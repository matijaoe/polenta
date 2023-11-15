import BIP32Factory, { BIP32API } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import { z } from 'zod';
import { BitcoinNetwork, BitcoinScriptCode } from '~/models';
import { formatZodValidationErrorMessage, generateIndices, useQueryParams } from '~/server/utils';

const zodSchema = z.object({
  network: z.enum(['mainnet', 'testnet']).optional().default('mainnet'),
  script: z.enum(['p2pkh', 'p2sh-p2wpkh', 'p2wpkh', 'p2tr']).optional().default('p2wpkh'),
  limit: z.number().min(20).max(100).optional().default(20),
  gap: z.number().min(0).optional().default(0),
});

type QueryParams = {
  network?: BitcoinNetwork,
  script?: BitcoinScriptCode,
  limit?: number,
  gap?: number
}

const HARD_ADDRESS_COUNT_LIMIT = 100;

export default defineEventHandler(async (event) => {
  const { xpub } = event.context.params as { xpub: string }
  const rawParams = useQueryParams<QueryParams>(event)

  try {
    const params = zodSchema.parse(rawParams);

    // @ts-ignore
    const BIP32 = BIP32Factory.default(ecc) as BIP32API

    const network = bitcoin.networks.bitcoin;

    const xpubKey = BIP32.fromBase58(xpub, network);

    const generatePayment = (addressIndex: number) => {
      const pubkey = xpubKey.derive(addressIndex).publicKey;

      if (params.script === 'p2sh-p2wpkh') {
        // Wrap P2WPKH in a P2SH (Pay-to-Script-Hash) payment script
        const pw2pkhPayment = bitcoin.payments.p2wpkh({ pubkey, network });
        return bitcoin.payments.p2sh({
          redeem: pw2pkhPayment,
        });
      }

      return bitcoin.payments[params.script]({ pubkey, network });
    }


    const addresses: string[] = [];

    const count = Math.min(params.limit, HARD_ADDRESS_COUNT_LIMIT);
    generateIndices({ start: params.gap, count }).forEach((_, i) => {
      const payment = generatePayment(i);
      if (!payment?.address) return;

      addresses.push(payment.address);
    });

    return {
      addresses
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const message = formatZodValidationErrorMessage(err)
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error',
        message
      })
    }
    throw createError({
      statusCode: 500,
      message: err.message
    })
  }
})

