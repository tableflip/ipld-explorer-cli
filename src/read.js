const Inquirer = require('inquirer')
const InquirerCommandPrompt = require('inquirer-command-prompt')
const debug = require('debug')('ipld-explorer-cli:read')
const Chalk = require('chalk')
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
    try {
      await ctx.autoComplete.updateList(ctx)
    } catch (err) {
      console.warn(`${Chalk.yellow('⚠')} failed to update auto-complete list`)
      debug(err)
    }

    return read(ctx)
  }
}
