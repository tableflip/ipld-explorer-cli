const debug = require('debug')('ipld-explorer-cli:repl')
const { read, withAutoComplete } = require('./read')
const { evaluate, withSpin } = require('./eval')
const print = require('./print')
const loop = require('./loop')

module.exports = async function repl (ctx) {
  console.log('\nWelcome to the IPLD explorer REPL!')
  console.log('Type "help" then <Enter> for a list of commands\n')

  const reader = withAutoComplete(read)
  const evaluator = withSpin(evaluate)

  loop(async function rep () {
    const { input } = await reader(ctx)
    let [ cmd, ...args ] = input.split(' ').filter(Boolean)

    debug(cmd, args)

    await print(async () => {
      const res = await evaluator(cmd, ctx, args)
      if (res && res.ctx) Object.assign(ctx, res.ctx)
      return res
    })
  })
}
