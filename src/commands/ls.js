const Path = require('path')
const { inspect } = require('util')
const debug = require('debug')('ipld-explorer-cli:commands:ls')
const Table = require('cli-table')
const filesize = require('filesize').partial({ unix: true })
const { DAGNode } = require('ipld-dag-pb')
const isIpfs = require('is-ipfs')
const CID = require('cids')
const Chalk = require('chalk')

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

module.exports = async function ls ({ ipfs, wd, spinner }, path) {
  path = path || wd

  if (isIpfs.cid(path)) {
    path = `/ipfs/${path}`
  } else {
    if (path[0] !== '/') {
      path = Path.join(wd, path)
    }

    path = Path.resolve(path)
  }

  if (spinner) spinner.text = `Resolving ${path}`
  const obj = await ipfs.dag.get(path)

  debug(obj)

  if (DAGNode.isDAGNode(obj.value)) {
    const table = new Table(tableOptions)
    table.push(['.', filesize(obj.value.size), obj.value.toJSON().multihash])
    obj.value.links.forEach(l => table.push([l.name || Chalk.gray('(no name)'), filesize(l.size), l.toJSON().multihash]))
    return { out: table.toString() }
  } else if (typeof obj.value === 'object') {
    const table = new Table(tableOptions)
    Object.keys(obj.value).forEach(k => {
      if (obj.value[k]['/']) {
        let cid

        try {
          cid = new CID(obj.value[k]['/'])
        } catch (err) {
          debug(err)
        }

        table.push([k, cid ? cid.toBaseEncodedString() : inspect(obj.value[k]['/'])])
      } else {
        table.push([k, Chalk.gray('(local)')])
      }
    })
    return { out: table.toString() }
  }
}
