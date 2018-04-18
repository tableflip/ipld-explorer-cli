const Path = require('path')
const debug = require('debug')('ipld-explorer-cli:resolve')

module.exports = async function resolve ({ ipfs, wd }, path) {
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
  console.log(obj.value.data)
}
