const filesize = require('filesize').partial({ unix: true })
const Chalk = require('chalk')
const formatPaths = require('./paths')
const formatData = require('./data')

module.exports = function formatDagNode (cid, info, paths) {
  const out = []

  out.push(Chalk.magenta(`${cid.codec} DAG Node`))

  const cidStr = cid.toBaseEncodedString()

  if (info.remainderPath) {
    out.push(`${Chalk.gray('Path:')} ${cidStr}/${info.remainderPath}`)
  } else {
    out.push(`${Chalk.gray('CID:')} ${cidStr}`)
  }

  if (info.size != null) {
    out.push(`${Chalk.gray('Size:')} ${filesize(info.size)}`)
  }

  out.push(Chalk.gray('Data:'))
  out.push(formatData(cid, info.data))

  if (paths.length) {
    out.push(Chalk.gray('Paths:'))
    out.push(formatPaths(cid, paths))
  }

  return out.join('\n\n')
}
