const { DAGNode } = require('ipld-dag-pb')
const Commands = require('./commands')

module.exports = class AutoComplete {
  constructor () {
    this._list = []
    this.getList = this.getList.bind(this)
  }

  // Update the auto-completion list based on the passed context
  async updateList ({ ipfs, wd }) {
    const cmdNames = Object.keys(Commands)
    const { value } = await ipfs.dag.get(wd)
    let autoCompleteLinks = []

    if (DAGNode.isDAGNode(value)) {
      autoCompleteLinks = value.links.reduce((ac, l) => {
        if (!l.name) return ac
        return ac.concat(cmdNames.map(n => `${n} ${l.name}`))
      }, [])
    } else if (typeof value === 'object') {
      autoCompleteLinks = Object.keys(value).reduce((ac, key) => {
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
