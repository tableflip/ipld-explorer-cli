const IpfsApi = require('ipfs-api')
const repl = require('./repl')
const Commands = require('./commands')
const { evaluate, withSpin } = require('./eval')
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
  const ipfs = IpfsApi()
  const wd = await Commands.cd.getHomePath(ipfs)
  return { ipfs, wd }
}

function evalPrint (ctx, cmd, cmdArgs, opts) {
  opts.evaluate = opts.evaluate || withSpin(evaluate)
  return print(() => opts.evaluate(ctx, cmd, cmdArgs))
}
