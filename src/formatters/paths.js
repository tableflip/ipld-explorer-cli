const Table = require('cli-table')
const filesize = require('filesize').partial({ unix: true })
const Chalk = require('chalk')

const tableOptions = {
  chars: {
    'top': '',
    'top-mid': '',
    'top-left': '',
    'top-right': '',
    'bottom': '',
    'bottom-mid': '',
    'bottom-left': '',
    'bottom-right': '',
    'left': '',
    'left-mid': '',
    'mid': '',
    'mid-mid': '',
    'right': '',
    'right-mid': '',
    'middle': ' '
  },
  style: {
    'padding-left': 0,
    'padding-right': 0
  }
}

module.exports = function formatPaths (cid, paths) {
  const table = new Table(tableOptions)

  paths.forEach(p => {
    table.push([
      p.name || Chalk.gray('(no name)'),
      p.size ? filesize(p.size) : '',
      p.cid.codec,
      p.name !== '.' && p.cid.equals(cid)
        ? Chalk.gray('(local)')
        : p.cid.toBaseEncodedString()
    ])
  })

  return table.toString()
}
