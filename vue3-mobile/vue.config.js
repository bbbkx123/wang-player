const path = require("path")

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack(config) {
    config.resolve.alias
      .set("api", resolve("src/api"))
      .set("views", resolve("src/views"))
      .set("common", resolve("src/common"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
  }
}