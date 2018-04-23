const { inspect } = require('util')
const debug = require('debug')('ipld-explorer-cli:format-dag')
const Table = require('cli-table')
const filesize = require('filesize').partial({ unix: true })
const { DAGNode } = require('ipld-dag-pb')
const Chalk = require('chalk')
const CID = require('cids')

module.exports = function formatDag (node) {
  debug(node)
  if (DAGNode.isDAGNode(node)) return formatDagPb(node)
  if (Buffer.isBuffer(node)) return formatBuffer(node)
  return formatCbor(node)
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
    dagNode.links.forEach(l => table.push([l.name || Chalk.gray('(no name)'), filesize(l.size), l.toJSON().multihash]))
    links = `

${Chalk.gray('Links:')}

${table.toString()}`
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
  let links = ''

  if (typeof obj === 'object' && Object.keys(obj).length) {
    const linkNodes = Object.keys(obj).filter(k => !!obj[k]['/'])

    if (linkNodes.length) {
      const table = new Table(tableOptions)

      Object.keys(obj).forEach(k => {
        if (obj[k]['/']) {
          let cid

          try {
            cid = new CID(obj[k]['/'])
          } catch (err) {
            debug(err)
          }

          table.push([k, cid ? cid.toBaseEncodedString() : inspect(obj[k]['/'])])
        } else {
          table.push([k, Chalk.gray('(local)')])
        }
      })

      links = `

${Chalk.gray('Links (at this level):')}

${table.toString()}`
    }
  }

  return `
${Chalk.green('CBOR DAG Node')}

${Chalk.gray('Data:')}

${inspect(obj, { colors: true })}${links}
`
}
