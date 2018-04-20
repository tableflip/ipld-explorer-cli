const debug = require('debug')('ipld-explorer-cli:format-dag')
const Table = require('cli-table')
const filesize = require('filesize').partial({ unix: true })
const { DAGNode } = require('ipld-dag-pb')
const Chalk = require('chalk')

module.exports = node => {
  debug(node)
  if (DAGNode.isDAGNode(node)) return formatDagPb(node)
  if (Buffer.isBuffer(node)) return formatBuffer(node)
  if (typeof node === 'object') return formatCbor(node)
  throw new Error('Failed to format DAG node')
}

const tableOptions = {
  chars: {
    'top': '',
    'top-mid': '',
    'top-left': '',
    'top-right': '',
    'bottom': '',
    'bottom-mid': '',
    'bottom-left': '',
    'bottom-right': '',
    'left': '',
    'left-mid': '',
    'mid': '',
    'mid-mid': '',
    'right': '',
    'right-mid': '',
    'middle': ' '
  },
  style: {
    'padding-left': 0,
    'padding-right': 0
  }
}

function formatDagPb (dagNode) {
  let links = ''

  if (dagNode.links.length) {
    const table = new Table(tableOptions)
    dagNode.links.forEach(l => table.push([l.name, filesize(l.size), l.toJSON().multihash]))
    links = `

${Chalk.gray('Links:')}

${table.toString()}`
  }

  return `
${Chalk.green('Protobuf DAG Node')}

${Chalk.gray('CID:')} ${dagNode.toJSON().multihash}

${Chalk.gray('Size:')} ${filesize(dagNode.size)}

${Chalk.gray('Data:')}

${dagNode.data.inspect()}${links}
`
}

function formatBuffer (buf) {
  return `
${Chalk.green('Buffer DAG Node')}

${buf}
`
}

function formatCbor (obj) {
  return `
${Chalk.green('CBOR DAG Node')}

${JSON.stringify(obj, null, 2)}
`
}
