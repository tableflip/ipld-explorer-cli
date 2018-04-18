const Inquirer = require('inquirer')
const InquirerCommandPrompt = require('inquirer-command-prompt')
const IpfsApi = require('ipfs-api')
const debug = require('debug')('ipld-explorer-cli')
const isIpfs = require('is-ipfs')
const Commands = require('./commands')

Inquirer.registerPrompt('command', InquirerCommandPrompt)

module.exports = async function () {
  const initialCtx = await getInitialCtx()

  console.log('\nWelcome to the IPLD explorer REPL!')
  console.log('Type "help" then <Enter> for a list of commands\n')

  async function getInitialCtx () {
    const ipfs = IpfsApi()
    const { hash } = await ipfs.files.stat('/')
    const wd = `/ipfs/${hash}`
    return { ipfs, wd }
  }

  loop(async ctx => {
    ctx.autoComplete = await getAutoCompleteList(ctx)

    const { input } = await Inquirer.prompt([{
      type: 'command',
      name: 'input',
      message: '>',
      autoCompletion: () => ctx.autoComplete
    }])

    let [ cmd, ...argv ] = input.split(' ').filter(Boolean)

    debug(cmd, argv)

    if (isIpfs.cid(cmd)) {
      argv = [`/ipfs/${cmd}`]
      cmd = 'cd'
    } else if (isIpfs.path(cmd)) {
      argv = [cmd]
      cmd = 'cd'
    }

    if (!Commands[cmd]) return console.error(`${cmd}: command not found`)

    return Commands[cmd](ctx, ...argv)
  }, initialCtx)

  async function getAutoCompleteList ({ ipfs, wd }) {
    const cmdNames = Object.keys(Commands)
    const workingDag = (await ipfs.dag.get(wd)).value

    const autoCompleteLinks = workingDag.links.reduce((ac, l) => {
      return ac.concat(cmdNames.map(n => `${n} ${l.name}`))
    }, [])

    return cmdNames.concat(autoCompleteLinks)
  }

  async function loop (func, ctx) {
    while (true) {
      try {
        Object.assign(ctx, await func(ctx))
      } catch (err) {
        debug(err)
        console.error(err.message)
        process.exit(1)
      }
    }
  }
}
