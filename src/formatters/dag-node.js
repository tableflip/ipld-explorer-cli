const { inspect } = require('util')
const filesize = require('filesize').partial({ unix: true })
const Chalk = require('chalk')
const formatPaths = require('./paths')

module.exports = function formatDagNode (cid, info, paths) {
  const out = []

  out.push(Chalk.green(`${cid.codec} DAG Node`))

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
  out.push(inspect(info.data))

  if (paths.length) {
    out.push(Chalk.gray('Paths:'))
    out.push(formatPaths(cid, paths))
  }

  return out.join('\n\n')
}
