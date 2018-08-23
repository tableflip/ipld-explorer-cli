const _Ipld = require('ipld')
const pull = require('pull-stream')
const isIpfs = require('is-ipfs')
const CID = require('cids')
const debug = require('debug')('ipld-explorer-cli:lib:ipld')
const parsePath = require('./parse-ipld-path')

// A better IPLD™️
class Ipld {
  constructor (bs) {
    this._ipld = new _Ipld(bs)
  }

  async tree (path) {
    const { cidOrFqdn, rest } = parsePath(path)

    if (!isIpfs.cid(cidOrFqdn)) {
      throw new Error(`invalid cid ${cidOrFqdn}`)
    }

    return new Promise((resolve, reject) => {
      pull(
        this._ipld.treeStream(new CID(cidOrFqdn), rest),
        pull.collect((err, paths) => {
          if (err) return reject(err)
          resolve(paths)
        })
      )
    })
  }

  async get (path) {
    const { cidOrFqdn, rest } = parsePath(path)

    if (!isIpfs.cid(cidOrFqdn)) {
      throw new Error(`invalid cid ${cidOrFqdn}`)
    }

    return new Promise((resolve, reject) => {
      this._ipld.get(new CID(cidOrFqdn), rest, (err, res) => {
        if (err) return reject(err)
        resolve(res.value)
      })
    })
  }

  // TODO: this can all be done using the block store and remove the ipfs dependency
  // see https://github.com/ipfs/js-ipfs/blob/1fb71f2fe9182e95db913504ed7b933d3b7ca4a4/src/core/components/resolve.js#L44-L85
  async resolve (ipfs, path) {
    const originalPath = path

    async function _resolve (path) {
      let resolvedPath

      try {
        resolvedPath = await ipfs.resolve(path, { recursive: true })
      } catch (err) {
        if (err.message === 'found non-link at given path' || err.message === 'not a link' || err.message === 'no such link') {
          return _resolve(path.split('/').slice(0, -1).join('/'))
        }

        debug(`failed to resolve ${path} from ${originalPath}`)
        throw err
      }

      const resolved = {
        path: resolvedPath,
        remainder: originalPath.replace(path, '')
      }

      debug(`resolved ${originalPath}`)
      debug(`to ${resolvedPath}`)
      if (resolved.remainder) debug(`with remainder ${resolved.remainder}`)

      return resolved
    }

    return _resolve(path)
  }
}

module.exports = Ipld
