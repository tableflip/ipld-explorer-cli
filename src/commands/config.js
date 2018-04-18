const IpfsApi = require('ipfs-api')
const debug = require('debug')('ipld-explorer-cli:config')

module.exports = function config (ctx, subCmd, key, value) {
  if (subCmd !== 'set') return console.error(`${subCmd}: subcommand not found`)
  if (key !== 'apiUrl') return console.error(`${key}: invalid config key`)
  debug(subCmd, key, value)
  const ipfs = new IpfsApi(value)
  return { ipfs }
}
