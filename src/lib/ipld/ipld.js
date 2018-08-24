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
    this._bs = bs
  }

  tree (path) {
    const { cidOrFqdn, rest } = parsePath(path)

    if (!isIpfs.cid(cidOrFqdn)) {
      throw new Error(`invalid cid ${cidOrFqdn}`)
    }

    const cid = new CID(cidOrFqdn)
    path = rest ? rest.slice(1) : ''

    debug('tree', cid.toBaseEncodedString(), path)

    return new Promise((resolve, reject) => {
      pull(
        this._ipld.treeStream(cid, path),
        pull.collect((err, paths) => {
          if (err) return reject(err)
          resolve(paths)
        })
      )
    })
  }

  get (path) {
    const { cidOrFqdn, rest } = parsePath(path)

    if (!isIpfs.cid(cidOrFqdn)) {
      throw new Error(`invalid cid ${cidOrFqdn}`)
    }

    const cid = new CID(cidOrFqdn)
    path = rest ? rest.slice(1) : ''

    debug('get', cid.toBaseEncodedString(), path)

    return new Promise((resolve, reject) => {
      this._ipld.get(cid, path, (err, res) => {
        if (err) return reject(err)
        resolve(res.value)
      })
    })
  }

  // Resolve the given path to a CID + remainder path.
  async resolve (path) {
    debug('resolving', path)

    const { cidOrFqdn, rest } = parsePath(path)

    if (!isIpfs.cid(cidOrFqdn)) {
      throw new Error(`invalid cid ${cidOrFqdn}`)
    }

    const originalPath = path
    let cid = new CID(cidOrFqdn)
    path = rest ? rest.slice(1) : ''

    let remainderPath = path
    let value

    while (true) {
      const block = await new Promise((resolve, reject) => {
        this._bs.get(cid, (err, block) => {
          if (err) return reject(err)
          resolve(block)
        })
      })

      let format = this._ipld.resolvers[cid.codec]

      if (!format) {
        throw new Error(`No resolver found for codec "${cid.codec}"`)
      }

      debug(`resolving ${path || '/'} of ${originalPath}...`)

      const result = await new Promise((resolve, reject) => {
        format.resolver.resolve(block.data, path, (err, res) => {
          if (err) return reject(err)
          resolve(res)
        })
      })

      value = result.value
      path = result.remainderPath

      debug(`resolved ${cid.toBaseEncodedString()}`)
      debug('to', value)
      if (path) debug('with remainder path', path)

      const endReached = !path || path === '/'

      if (endReached) {
        break
      }

      // Not end reached and value - must be a link!
      if (value) {
        cid = new CID(value['/'])
        remainderPath = path
      }
    }

    let result

    if (value && value['/']) {
      result = { cid: new CID(value['/']), remainderPath: '' }
    } else {
      result = { cid, remainderPath }
    }

    debug(`resolved ${originalPath}`)
    debug(`to ${result.cid.toBaseEncodedString()}`)
    if (result.remainderPath) debug(`with remainder path ${result.remainderPath}`)

    return result
  }
}

module.exports = Ipld
