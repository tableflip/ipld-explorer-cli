const debug = require('debug')('ipld-explorer-cli:auto-complete')
const Chalk = require('chalk')
const { withSpin } = require('./spinner')
const Commands = require('./commands')

class AutoComplete {
  constructor () {
    this._list = []
    this.getList = this.getList.bind(this)
  }

  // Update the auto-completion list based on the passed context
  async updateList ({ ipld, ipfs, wd, spinner }) {
    if (spinner) spinner.text = 'Updating auto-complete list'

    const cmdNames = Object.keys(Commands)
    const { cid } = await ipld.resolve(wd)
    let autoCompleteLinks = []

    if (cid.codec === 'dag-pb') {
      const value = await ipld.get(wd)
      autoCompleteLinks = value.links.reduce((ac, l) => {
        if (!l.name) return ac
        return ac.concat(cmdNames.map(n => `${n} ${l.name}`))
      }, [])
    } else {
      const tree = await ipld.tree(wd)

      autoCompleteLinks = tree.reduce((ac, key) => {
        return ac.concat(cmdNames.map(n => `${n} ${key}`))
      }, [])
    }

    this._list = cmdNames.concat(autoCompleteLinks)
  }

  // Given a string of chars typed by the user, return a list of auto-completion
  // options
  getList (s) {
    return s.includes(' ') ? this._list : Object.keys(Commands)
  }
}

exports.AutoComplete = AutoComplete

exports.withAutoComplete = (fn) => {
  return async function fnWithAutoComplete (ctx) {
    if (!ctx.autoComplete) {
      ctx.autoComplete = new AutoComplete()
      ctx.autoComplete.updateList = withSpin(ctx.autoComplete.updateList)
    }

    // Update the autocomplete list based on the new context
    try {
      await ctx.autoComplete.updateList(ctx)
    } catch (err) {
      console.warn(`${Chalk.yellow('⚠')} failed to update auto-complete list`)
      debug(err)
    }

    return fn.apply(this, arguments)
  }
}
