const Path = require('path')
const debug = require('debug')('ipld-explorer-cli:commands:cd')
const isIpfs = require('is-ipfs')

module.exports = async function cd ({ ipfs, wd, spinner }, path) {
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
  await ipfs.dag.get(path)

  debug(path)
  return { out: path, ctx: { wd: path } }
}
