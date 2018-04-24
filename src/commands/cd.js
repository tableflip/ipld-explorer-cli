const Path = require('path').posix
const debug = require('debug')('ipld-explorer-cli:commands:cd')
const isIpfs = require('is-ipfs')

async function cd ({ ipfs, wd, spinner }, path) {
  path = path || await getHomePath(ipfs)

  if (isIpfs.cid(path)) {
    path = `/ipfs/${path}`
  } else {
    if (path[0] !== '/') {
      path = Path.join(wd, path)
    }

    path = Path.resolve(path)
  }

  if (spinner) spinner.text = `Resolving ${path}`
  await ipfs.dag.get(path)

  debug(path)
  return { out: path, ctx: { wd: path } }
}

async function getHomePath (ipfs) {
  let hash
  // TODO: remove once js-ipfs supports MFS
  if (ipfs.files.stat) {
    hash = (await ipfs.files.stat('/')).hash
  } else {
    hash = 'QmfGBRT6BbWJd7yUc2uYdaUZJBbnEFvTqehPFoSMQ6wgdr'
  }
  return `/ipfs/${hash}`
}

module.exports = cd
module.exports.getHomePath = getHomePath
