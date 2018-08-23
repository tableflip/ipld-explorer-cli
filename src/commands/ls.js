const Path = require('path').posix
const debug = require('debug')('ipld-explorer-cli:commands:ls')
const isIpfs = require('is-ipfs')
const CID = require('cids')
const parseIpldPath = require('../lib/ipld/parse-ipld-path')
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

  const resolved = await ipld.resolve(ipfs, path)
  const { cidOrFqdn } = parseIpldPath(resolved.path)
  const cid = new CID(cidOrFqdn)
  let links

  debug(`resolved a ${cid.codec} node`)

  // Special case for dag-pb links and meta are easily accessible within the node
  if (cid.codec === 'dag-pb') {
    const node = await ipld.get(path)

    links = node.links.map(l => ({
      cid: new CID(l.multihash),
      name: l.name,
      size: l.size
    }))

    links = [{ cid, name: '.', size: node.size }].concat(links)
  } else {
    const tree = await ipld.tree(path)
    debug('tree', tree)

    links = await Promise.all(
      tree.map(async t => {
        const resolved = await ipld.resolve(ipfs, `${path}/${t}`)
        const { cidOrFqdn } = parseIpldPath(resolved.path)
        const cid = new CID(cidOrFqdn)
        return { cid, name: t }
      })
    )

    links = [{ cid, name: '.' }].concat(links)
  }

  return { out: Formatters.links(cid, links) }
}
