const { inspect } = require('util')
const debug = require('debug')('ipld-explorer-cli:formatters:data')
const CID = require('cids')

const Formatters = {
  'dag-json': formatDagJsonData,
  'git-raw': formatDagJsonData
}

module.exports = function formatData (cid, data) {
  return Formatters[cid.codec]
    ? Formatters[cid.codec](data)
    : inspect(data, { colors: true })
}

function formatDagJsonData (data) {
  return inspect(replaceCborLinks(data), { colors: true })
}

function replaceCborLinks (data) {
  if (data && data['/'] && Object.keys(data).length === 1) {
    try {
      return { '/': new CID(data['/']).toBaseEncodedString() }
    } catch (err) {
      debug(err)
      return data
    }
  } else if (Array.isArray(data)) {
    return data.map(replaceCborLinks)
  } else if (typeof data === 'object') {
    return Object.keys(data).reduce((clone, key) => {
      clone[key] = replaceCborLinks(data[key])
      return clone
    }, {})
  }

  return data
}
