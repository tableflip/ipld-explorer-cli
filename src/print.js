const Chalk = require('chalk')
const debug = require('debug')('ipld-explorer-cli:print')

module.exports = async function print (func) {
  try {
    const res = await func()
    if (res && res.out) {
      if (Object.prototype.toString.call(res.out) === '[object String]') {
        console.log(res.out)
      } else {
        console.log(JSON.stringify(res.out, null, 2))
      }
    }
  } catch (err) {
    debug(err)
    console.error(`${Chalk.red('✖')} ${err}`)
  }
}
