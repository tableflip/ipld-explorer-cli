const IpfsApi = require('ipfs-api')
const debug = require('debug')('ipld-explorer-cli:commands:config')

module.exports = function config (ctx, subCmd, key, value) {
  if (subCmd !== 'set') throw new Error(`${subCmd}: subcommand not found`)
  if (key.toLowerCase() !== 'apiaddr') throw new Error(`${key}: invalid config key`)
  debug(subCmd, key, value)
  const ipfs = new IpfsApi(value)
  return { ctx: { ipfs } }
}
