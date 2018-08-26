const Path = require('path').posix
const debug = require('debug')('ipld-explorer-cli:commands:ls')
const isIpfs = require('is-ipfs')
const CID = require('cids')
const Formatters = require('../formatters')

module.exports = async function ls ({ ipld, ipfs, wd, spinner }, path) {
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

  const { cid, remainderPath } = await ipld.resolve(path)
  let paths

  debug(`resolved a ${cid.codec} node`)

  // Special case for dag-pb links and meta are easily accessible within the node
  if (cid.codec === 'dag-pb' && !remainderPath) {
    const node = await ipld.get(path)

    paths = node.links.map(l => ({
      cid: new CID(l.multihash),
      name: l.name,
      size: l.size
    }))

    paths = [{ cid, name: '.', size: node.size }].concat(paths)
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

    paths = await Promise.all(
      tree.map(async t => {
        const linkPath = `${path}/${t}`
        try {
          const { cid } = await ipld.resolve(linkPath)
          return { cid, name: t }
        } catch (err) {
          debug('failed to resolve', linkPath, err)
        }
      })
    )

    paths = [{ cid, name: '.' }].concat(paths.filter(Boolean))
  }

  return { out: Formatters.paths(cid, paths) }
}
