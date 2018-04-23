const debug = require('debug')('ipld-explorer-cli:repl')
const { read, withAutoComplete } = require('./read')
const { evaluate, withSpin } = require('./eval')
const print = require('./print')
const loop = require('./loop')

module.exports = async function repl (ctx, opts) {
  opts = opts || {}

  console.log('\nWelcome to the IPLD explorer REPL!')
  console.log('Type "help" then <Enter> for a list of commands\n')

  opts.read = opts.read || withAutoComplete(read)
  opts.evaluate = opts.evaluate || withSpin(evaluate)

  return loop(async function rep () {
    const { input } = await opts.read(ctx)
    let [ cmd, ...cmdArgs ] = input.split(' ').filter(Boolean)

    debug(cmd, cmdArgs)

    await print(async () => {
      const res = await opts.evaluate(ctx, cmd, cmdArgs)
      if (res && res.ctx) Object.assign(ctx, res.ctx)
      return res
    })
  })
}
