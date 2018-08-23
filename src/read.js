const Inquirer = require('inquirer')
const InquirerCommandPrompt = require('inquirer-command-prompt')

Inquirer.registerPrompt('command', InquirerCommandPrompt)

exports.read = (ctx) => {
  const question = { type: 'command', name: 'input', message: '>' }

  if (ctx.autoComplete) {
    question.autoCompletion = ctx.autoComplete.getList
  }

  return Inquirer.prompt([question])
}
