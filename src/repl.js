const debug = require('debug')('ipld-explorer-cli:repl')
const Chalk = require('chalk')
const { read } = require('./read')
const { evaluate } = require('./eval')
const { withAutoComplete } = require('./auto-complete')
const { withSpin } = require('./spinner')
const print = require('./print')
const loop = require('./loop')

module.exports = async function repl (ctx, opts) {
  opts = opts || {}

  console.log(`
${Chalk.bold('Welcome to the IPLD explorer REPL!')}
Type "help" then <Enter> for a list of commands.

Explore some sample datasets:

Project Apollo archives  QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D
IGIS git repo            z8mWaJHXieAVxxLagBpdaNWFEBKVWmMiE
An Ethereum block        z43AaGEvwdfzjrCZ3Sq7DKxdDHrwoaPQDtqF4jfdkNEVTiqGVFW
XKCD                     QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm
`)

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
