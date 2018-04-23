const IpfsApi = require('ipfs-api')
const repl = require('./repl')
const Commands = require('./commands')
const { evaluate, withSpin } = require('./eval')
const print = require('./print')

module.exports = async function (argv = process.argv) {
  argv = argv.slice(2)
  const ctx = await getInitialCtx()
  return argv.length
    ? print(() => withSpin(evaluate)(argv[0], ctx, argv.slice(1)))
    : repl(ctx)
}

async function getInitialCtx () {
  const ipfs = IpfsApi()
  const wd = await Commands.cd.getHomePath(ipfs)
  return { ipfs, wd }
}
