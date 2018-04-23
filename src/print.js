const Chalk = require('chalk')
const debug = require('debug')('ipld-explorer-cli:print')

module.exports = async (func) => {
  try {
    const res = await func()
    if (res && res.out) console.log(res.out)
  } catch (err) {
    debug(err)
    console.error(`${Chalk.red('✖')} ${err.message}`)
  }
}
