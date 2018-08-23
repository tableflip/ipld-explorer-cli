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

module.exports = function formatLinks (cid, links) {
  const table = new Table(tableOptions)

  links.forEach(l => {
    table.push([
      l.name || Chalk.gray('(no name)'),
      l.size ? filesize(l.size) : '',
      l.cid.codec,
      l.name !== '.' && l.cid.equals(cid)
        ? Chalk.gray('(local)')
        : l.cid.toBaseEncodedString()
    ])
  })

  return table.toString()
}
