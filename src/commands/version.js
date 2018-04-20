const pkg = require('../../package.json')

module.exports = function version () {
  return { out: `v${pkg.version}` }
}
