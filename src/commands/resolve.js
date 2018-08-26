const Path = require('path').posix
const debug = require('debug')('ipld-explorer-cli:commands:resolve')
const isIpfs = require('is-ipfs')
const CID = require('cids')
const Formatters = require('../formatters')

module.exports = async function resolve ({ ipld, ipfs, wd, spinner }, path) {
  path = path || wd

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

  const { cid, remainderPath } = await ipld.resolve(path)
  let info
  let node = await ipld.get(path)
  let paths

  debug(`resolved a ${cid.codec} node`)
  debug(node)

  // Special case for dag-pb links and meta are easily accessible within the node
  if (cid.codec === 'dag-pb') {
    info = {
      data: node.data,
      size: node.size,
      remainderPath
    }

    paths = node.links.map(l => ({
      cid: new CID(l.multihash),
      name: l.name,
      size: l.size
    }))
  } else {
    let tree = await ipld.tree(cid)

    debug('tree', tree)
    debug('path', path)
    debug('remainderPath', remainderPath)

    if (remainderPath) {
      tree = tree
        // Filter out paths below requested level
        .filter(t => t.startsWith(remainderPath))
        // Remove remainder path from paths
        .map(t => t.slice(remainderPath.length))
        .map(t => t.startsWith('/') ? t.slice(1) : t)
        .filter(Boolean)

      debug('filtered tree', tree)
    }

    info = {
      data: node,
      remainderPath
    }

    paths = await Promise.all(
      tree.map(async t => {
        const treePath = `${path}/${t}`
        try {
          const { cid } = await ipld.resolve(treePath)
          return { cid, name: t }
        } catch (err) {
          debug('failed to resolve', treePath, err)
        }
      })
    )

    paths = paths.filter(Boolean)
  }

  return { out: '\n' + Formatters.dagNode(cid, info, paths) + '\n' }
}
