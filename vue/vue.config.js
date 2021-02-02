const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack (config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('api', resolve('src/api'))
      .set('view', resolve('src/view'))
      .set('base', resolve('src/base'))
  }
}