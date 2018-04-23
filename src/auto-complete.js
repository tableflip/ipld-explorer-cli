const { DAGNode } = require('ipld-dag-pb')
const Commands = require('./commands')

module.exports.getAutoCompleteList = async ({ ipfs, wd }) => {
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

  return cmdNames.concat(autoCompleteLinks)
}
