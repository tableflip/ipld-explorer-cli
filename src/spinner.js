const ora = require('ora')

exports.withSpin = (fn) => {
  return async function fnWithSpin (ctx) {
    ctx.spinner = ora().start()
    try {
      return await fn.apply(this, arguments)
    } finally {
      ctx.spinner.stop()
      ctx.spinner = null
    }
  }
}
