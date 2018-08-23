const { inspect } = require('util')
const filesize = require('filesize').partial({ unix: true })
const Chalk = require('chalk')
const formatLinks = require('./links')

module.exports = function formatDag (node) {
  let formattedLinks = ''

  if (node.links.length) {
    formattedLinks = `

${Chalk.gray('Links:')}

${formatLinks(node.cid, node.links)}`
  }

  let formattedSize = ''

  if (node.size != null) {
    formattedSize = `

${Chalk.gray('Size:')} ${filesize(node.size)}`
  }

  return `
${Chalk.green(`${node.cid.codec} DAG Node`)}

${Chalk.gray('CID:')} ${node.cid.toBaseEncodedString()}${formattedSize}

${Chalk.gray('Data:')}

${inspect(node.data)}${formattedLinks}
`
}
