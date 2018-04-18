const Path = require('path')
const debug = require('debug')('ipld-explorer-cli:cd')

module.exports = async function cd ({ ipfs, wd }, path) {
  path = path || wd

  if (path[0] !== '/') {
    path = Path.join(wd, path)
  }

  path = Path.resolve(path)

  try {
    await ipfs.dag.get(path)
  } catch (err) {
    debug(err)
    return console.error(err.message)
  }

  debug(path)
  console.log(path)
  return { wd: path }
}
