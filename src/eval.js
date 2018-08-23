const isIpfs = require('is-ipfs')
const debug = require('debug')('ipld-explorer-cli:eval')
const Commands = require('./commands')

module.exports.evaluate = (ctx, cmd, cmdArgs) => {
  debug(cmd, cmdArgs)

  if (isIpfs.cid(cmd)) {
    cmdArgs = [`/ipfs/${cmd}`]
    cmd = 'cd'
  } else if (isIpfs.path(cmd)) {
    cmdArgs = [cmd]
    cmd = 'cd'
  }

  if (!cmd) return
  if (!Commands[cmd]) throw new Error(`${cmd}: command not found`)

  return Commands[cmd](ctx, ...cmdArgs)
}
