const IpfsApi = require('ipfs-api')
const debug = require('debug')('ipld-explorer-cli')
const Chalk = require('chalk')
const repl = require('./repl')
const Commands = require('./commands')
const { evaluate } = require('./eval')
const { withSpin } = require('./spinner')
const print = require('./print')

module.exports = async function (argv, opts) {
  argv = (argv || process.argv).slice(2)
  opts = opts || {}

  const ctx = await getInitialCtx()

  return argv.length
    ? evalPrint(ctx, argv[0], argv.slice(1), opts)
    : repl(ctx, opts)
}

async function getInitialCtx () {
  const res = await Commands.config({}, 'get', 'apiAddr')
  const ipfs = IpfsApi(res.out)
  let wd

  try {
    wd = await Commands.cd.getHomePath(ipfs)
  } catch (err) {
    debug(err)
    console.error(`${Chalk.yellow('⚠')} Is your IPFS daemon running?`)
    console.error(`${Chalk.red('✖')} ${err}`)
    wd = '/ipfs/QmfGBRT6BbWJd7yUc2uYdaUZJBbnEFvTqehPFoSMQ6wgdr'
  }

  return { ipfs, wd }
}

function evalPrint (ctx, cmd, cmdArgs, opts) {
  opts.evaluate = opts.evaluate || withSpin(evaluate)
  return print(() => opts.evaluate(ctx, cmd, cmdArgs))
}
