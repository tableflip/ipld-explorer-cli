const isIpfs = require('is-ipfs')
const debug = require('debug')('ipld-explorer-cli:eval')
const Commands = require('./commands')

module.exports.evaluate = (ctx, cmd, cmdArgs) => {
  debug(cmd, cmdArgs)
  cmd = cmd || ''

  if (isIpfs.cid(cmd) || isIpfs.cid(cmd.split('/')[0])) {
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
