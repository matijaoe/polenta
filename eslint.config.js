import matijaoe from '@matijaoe/eslint-config'

export default matijaoe({
  vue: {
    propsDestructure: true,
  },
  overrides: {
    typescript: {
      'ts/ban-ts-comment': 'off',
      'ts/prefer-ts-expect-error': 'off',
    }
  }
})
