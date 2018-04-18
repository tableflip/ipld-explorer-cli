const Path = require('path')
const debug = require('debug')('ipld-explorer-cli:ls')
const Table = require('cli-table')
const filesize = require('filesize').partial({ unix: true })

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

module.exports = async function ls ({ ipfs, wd }, path) {
  path = path || wd

  if (path[0] !== '/') {
    path = Path.join(wd, path)
  }

  let obj

  try {
    obj = await ipfs.dag.get(path)
  } catch (err) {
    debug(err)
    return console.error(err.message)
  }

  debug(obj)

  const table = new Table(tableOptions)
  table.push(['.', filesize(obj.value.size), obj.value.toJSON().multihash])
  obj.value.links.forEach(l => table.push([l.name, filesize(l.size), l.toJSON().multihash]))
  console.log(table.toString())
}
