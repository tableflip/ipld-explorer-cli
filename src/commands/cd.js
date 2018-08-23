const Path = require('path').posix
const debug = require('debug')('ipld-explorer-cli:commands:cd')
const isIpfs = require('is-ipfs')

async function cd ({ ipld, ipfs, wd, spinner }, path) {
  path = path || await getHomePath(ipfs)

  if (isIpfs.cid(path)) {
    path = `/ipfs/${path}`
  } else {
    if (path[0] !== '/') {
      path = Path.join(wd, path)
    }

    path = Path.resolve(path)
  }

  debug(path)

  if (spinner) spinner.text = `Resolving ${path}`
  await ipld.get(path)

  return { out: path, ctx: { wd: path } }
}

async function getHomePath (ipfs) {
  const hash = (await ipfs.files.stat('/')).hash
  return `/ipfs/${hash}`
}

module.exports = cd
module.exports.getHomePath = getHomePath
