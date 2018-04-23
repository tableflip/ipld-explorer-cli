const Inquirer = require('inquirer')
const InquirerCommandPrompt = require('inquirer-command-prompt')
const IpfsApi = require('ipfs-api')
const debug = require('debug')('ipld-explorer-cli')
const Commands = require('./commands')
const { evaluate, withSpin } = require('./eval')
const print = require('./print')
const loop = require('./loop')
const { getAutoCompleteList } = require('./auto-complete')

Inquirer.registerPrompt('command', InquirerCommandPrompt)

module.exports = async function (argv = process.argv) {
  argv = argv.slice(2)
  let ctx = await getInitialCtx()
  return argv.length === 0
    ? repl(ctx)
    : print(() => withSpin(evaluate)(argv[0], ctx, argv.slice(1)))
}

async function repl (ctx) {
  console.log('\nWelcome to the IPLD explorer REPL!')
  console.log('Type "help" then <Enter> for a list of commands\n')

  loop(async function rep () {
    ctx.autoComplete = await getAutoCompleteList(ctx)

    const { input } = await Inquirer.prompt([{
      type: 'command',
      name: 'input',
      message: '>',
      autoCompletion: s => s.includes(' ') ? ctx.autoComplete : Object.keys(Commands)
    }])

    let [ cmd, ...args ] = input.split(' ').filter(Boolean)

    debug(cmd, args)

    await print(async () => {
      const res = await withSpin(evaluate)(cmd, ctx, args)
      if (res && res.ctx) Object.assign(ctx, res.ctx)
      return res
    })
  })
}

async function getInitialCtx () {
  const ipfs = IpfsApi()
  const wd = await Commands.cd.getHomePath(ipfs)
  return { ipfs, wd }
}
