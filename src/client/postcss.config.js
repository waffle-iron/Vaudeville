module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-at-rules-variables': {},
    'postcss-each': {},
    'postcss-for': {},
    'postcss-mixins': {},
    'postcss-extend': {},
    'postcss-cssnext': {
      browsers: ['last 2 versions', '> 5%']
    }
  }
}