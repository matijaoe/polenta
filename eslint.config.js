import matijaoe from '@matijaoe/eslint-config'

export default matijaoe({
  vue: {
    propsDestructure: true,
  },
  rules: {
    'unicorn/prefer-node-protocol': 'off',
    'no-alert': 'warn',
    'vue/valid-v-bind': 'off' // TODO: for new shorten :id syntax
  },
})
