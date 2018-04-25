const Path = require('path').posix
const debug = require('debug')('ipld-explorer-cli:commands:ls')
const isIpfs = require('is-ipfs')
const Formatters = require('../formatters')

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

  return { out: Formatters.links(obj.value, { showCurrent: true }) }
}
