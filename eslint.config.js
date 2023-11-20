import matijaoe from '@matijaoe/eslint-config'

export default matijaoe({
  vue: {
    propsDestructure: true,
  },
  rules: {
    'unicorn/prefer-node-protocol': 'off',
  },
})
