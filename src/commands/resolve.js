const Path = require('path').posix
const debug = require('debug')('ipld-explorer-cli:commands:resolve')
const isIpfs = require('is-ipfs')
const format = require('../format-dag')

module.exports = async function resolve ({ ipfs, wd, spinner }, path) {
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
  return { out: format(obj.value) }
}
