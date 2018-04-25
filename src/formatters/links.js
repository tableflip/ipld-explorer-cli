const { inspect } = require('util')
const debug = require('debug')('ipld-explorer-cli:formatters:links')
const Table = require('cli-table')
const filesize = require('filesize').partial({ unix: true })
const { DAGNode } = require('ipld-dag-pb')
const Chalk = require('chalk')
const CID = require('cids')

module.exports = function formatLinks (node, opts) {
  debug(node)
  if (DAGNode.isDAGNode(node)) return formatDagPbLinks(node, opts)
  if (typeof node === 'object') return formatCborLinks(node)
  return ''
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

function formatDagPbLinks (dagNode, opts) {
  const table = new Table(tableOptions)

  if (opts && opts.showCurrent) {
    const cid = new CID(dagNode.multihash)

    table.push([
      '.',
      filesize(dagNode.size),
      cid.codec,
      cid.toBaseEncodedString()
    ])
  }

  dagNode.links.forEach(l => {
    const cid = new CID(l.multihash)
    table.push([
      l.name || Chalk.gray('(no name)'),
      filesize(l.size),
      cid.codec,
      cid.toBaseEncodedString()
    ])
  })

  return table.toString()
}

function formatCborLinks (obj) {
  if (!Object.keys(obj).length) return ''

  const table = new Table(tableOptions)

  Object.keys(obj).forEach(k => {
    if (obj[k]['/']) {
      let cid

      try {
        cid = new CID(obj[k]['/'])
      } catch (err) {
        debug(err)
      }

      if (cid) {
        table.push([k, cid.codec, cid.toBaseEncodedString()])
      } else {
        table.push([k, Chalk.gray('(unknown)'), inspect(obj[k]['/'])])
      }
    } else {
      table.push([k, '', Chalk.gray('(local)')])
    }
  })

  return table.toString()
}
