const Inquirer = require('inquirer')
const InquirerCommandPrompt = require('inquirer-command-prompt')
const IpfsApi = require('ipfs-api')
const debug = require('debug')('ipld-explorer-cli')
const isIpfs = require('is-ipfs')
const ora = require('ora')
const Commands = require('./commands')

Inquirer.registerPrompt('command', InquirerCommandPrompt)

module.exports = async function () {
  console.log('\nWelcome to the IPLD explorer REPL!')
  console.log('Type "help" then <Enter> for a list of commands\n')

  let ctx = await getInitialCtx()

  loop(async function rep () {
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

    ctx.spinner = ora().start()
    let res

    try {
      res = await Commands[cmd](ctx, ...argv)
    } catch (err) {
      debug(err)
      return ctx.spinner.fail(err.message)
    }

    ctx.spinner.stop()

    if (res && res.ctx) Object.assign(ctx, res.ctx)
    if (res && res.out) console.log(res.out)
  })

  async function getInitialCtx () {
    const ipfs = IpfsApi()
    let hash

    // TODO: remove once js-ipfs supports MFS
    if (ipfs.files.stat) {
      hash = (await ipfs.files.stat('/')).hash
    } else {
      hash = 'QmfGBRT6BbWJd7yUc2uYdaUZJBbnEFvTqehPFoSMQ6wgdr'
    }

    return { ipfs, wd: `/ipfs/${hash}` }
  }

  async function getAutoCompleteList ({ ipfs, wd }) {
    const cmdNames = Object.keys(Commands)
    const workingDag = (await ipfs.dag.get(wd)).value

    const autoCompleteLinks = workingDag.links.reduce((ac, l) => {
      return ac.concat(cmdNames.map(n => `${n} ${l.name}`))
    }, [])

    return cmdNames.concat(autoCompleteLinks)
  }

  async function loop (func) {
    while (true) { await func() }
  }
}
