const isIpfs = require('is-ipfs')
const ora = require('ora')
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

module.exports.withSpin = (evaluate) => {
  return async function evaluateWithSpin (ctx, cmd, cmdArgs) {
    ctx.spinner = ora().start()
    try {
      return await evaluate(ctx, cmd, cmdArgs)
    } finally {
      ctx.spinner.stop()
    }
  }
}
