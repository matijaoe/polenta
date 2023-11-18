import { Buffer } from 'node:buffer'
import type { BIP32API, BIP32Interface } from 'bip32'
import BIP32Factory from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'
import * as ecc from 'tiny-secp256k1'
import type { Script } from '~/models'

export const HARD_ADDRESS_COUNT_LIMIT = 250

export const generateXpubKey = (xpub: string) => {
  // @ts-ignore
  const BIP32 = BIP32Factory.default(ecc) as BIP32API
  const network = bitcoin.networks.bitcoin
  return BIP32.fromBase58(xpub, network)
}

export const generateAddressFromXpubKey = (xpubKey: BIP32Interface, { script, type, index }: {
  script: Script
  type: 'receive' | 'change'
  index: number
}) => {
  const addrLevel = type === 'change' ? 1 : 0
  const pubkey = xpubKey.derive(addrLevel).derive(index).publicKey

  const network = bitcoin.networks.bitcoin

  // Segwit
  if (script === 'p2sh-p2wpkh') {
    // Wrap P2WPKH in a P2SH (Pay-to-Script-Hash) payment script
    const pw2pkhPayment = bitcoin.payments.p2wpkh({ pubkey, network })
    const { address } = bitcoin.payments.p2sh({
      redeem: pw2pkhPayment,
    })
    return address
  }

  // Taproot
  if (script === 'p2tr') {
    // Ensure the public key is in compressed format
    if (pubkey.length !== 33) {
      throw new Error('Public key is not in compressed format')
    }

    bitcoin.initEccLib(ecc)

    // Taproot tweaks the pubkey by the hash of itself
    const hash = bitcoin.crypto.taggedHash('TapTweak', pubkey)
    const tweaked = ecc.pointAddScalar(pubkey, hash, true)

    if (!tweaked) {
      throw new Error('Failed to tweak the public key')
    }

    // Extract the x-coordinate (first 32 bytes of the 33-byte compressed pubkey)
    const internalPubkey = Buffer.from(tweaked.slice(1, 33))

    const { address } = bitcoin.payments.p2tr({ internalPubkey, network })
    return address
  }

  // Legacy and Native Segwit
  const address = bitcoin.payments[script]({ pubkey, network }).address
  return address
}

export const generateAddressesFromXpub = (xpub: string, { gap, limit, script, type }: {
  script: Script
  limit: number
  gap: number
  type: 'receive' | 'change'
}): string[] => {
  const xpubKey = generateXpubKey(xpub)

  const count = Math.min(limit, HARD_ADDRESS_COUNT_LIMIT)

  return generateIndices({ start: gap, count }).map((index) => {
    const address = generateAddressFromXpubKey(xpubKey, { script, type, index })
    return address ?? null
  }).filter(Boolean) as string[]
}
