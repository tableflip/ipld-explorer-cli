const { inspect } = require('util')
const debug = require('debug')('ipld-explorer-cli:formatters:dag')
const filesize = require('filesize').partial({ unix: true })
const { DAGNode } = require('ipld-dag-pb')
const Chalk = require('chalk')
const formatLinks = require('./links')

module.exports = function formatDag (node) {
  debug(node)
  if (DAGNode.isDAGNode(node)) return formatDagPb(node)
  if (Buffer.isBuffer(node)) return formatBuffer(node)
  return formatCbor(node)
}

function formatDagPb (dagNode) {
  let links = formatLinks(dagNode)

  if (links) {
    links = `

${Chalk.gray('Links:')}

${links}`
  }

  return `
${Chalk.green('Protobuf DAG Node')}

${Chalk.gray('CID:')} ${dagNode.toJSON().multihash}

${Chalk.gray('Size:')} ${filesize(dagNode.size)}

${Chalk.gray('Data:')}

${inspect(dagNode.data)}${links}
`
}

function formatBuffer (buf) {
  return `
${Chalk.green('Buffer DAG Node')}

${inspect(buf)}
`
}

function formatCbor (obj) {
  let links = formatLinks(obj)

  if (links) {
    links = `

${Chalk.gray('Links (at this level):')}

${links}`
  }

  return `
${Chalk.green('CBOR DAG Node')}

${Chalk.gray('Data:')}

${inspect(obj, { colors: true })}${links}
`
}
