const isIpfs = require('is-ipfs')
const ora = require('ora')
const debug = require('debug')('ipld-explorer-cli:eval')
const Commands = require('./commands')

module.exports.evaluate = (cmd, ctx, args) => {
  debug(cmd, args)

  if (isIpfs.cid(cmd)) {
    args = [`/ipfs/${cmd}`]
    cmd = 'cd'
  } else if (isIpfs.path(cmd)) {
    args = [cmd]
    cmd = 'cd'
  }

  if (!cmd) return
  if (!Commands[cmd]) throw new Error(`${cmd}: command not found`)

  return Commands[cmd](ctx, ...args)
}

module.exports.withSpin = (evaluate) => {
  return async (cmd, ctx, args) => {
    ctx.spinner = ora().start()
    try {
      return await evaluate(cmd, ctx, args)
    } finally {
      ctx.spinner.stop()
    }
  }
}
