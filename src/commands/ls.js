const Path = require('path')
const debug = require('debug')('ipld-explorer-cli:commands:ls')
const Table = require('cli-table')
const filesize = require('filesize').partial({ unix: true })
const { DAGNode } = require('ipld-dag-pb')
const isIpfs = require('is-ipfs')

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

  spinner.text = `Resolving ${path}`
  const obj = await ipfs.dag.get(path)

  debug(obj)

  if (DAGNode.isDAGNode(obj.value)) {
    const table = new Table(tableOptions)
    table.push(['.', filesize(obj.value.size), obj.value.toJSON().multihash])
    obj.value.links.forEach(l => table.push([l.name, filesize(l.size), l.toJSON().multihash]))
    return { out: table.toString() }
  }
}
