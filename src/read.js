const Inquirer = require('inquirer')
const InquirerCommandPrompt = require('inquirer-command-prompt')
const AutoComplete = require('./auto-complete')

Inquirer.registerPrompt('command', InquirerCommandPrompt)

module.exports.read = (ctx) => {
  const question = { type: 'command', name: 'input', message: '>' }

  if (ctx.autoComplete) {
    question.autoCompletion = ctx.autoComplete.getList
  }

  return Inquirer.prompt([question])
}

module.exports.withAutoComplete = (read) => {
  return async function readWithAutoComplete (ctx) {
    if (!ctx.autoComplete) {
      ctx.autoComplete = new AutoComplete()
    }

    // Update the autocomplete list based on the new context
    await ctx.autoComplete.updateList(ctx)

    return read(ctx)
  }
}
