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

module.exports = function formatPaths (cid, paths, remainderPath) {
  const table = new Table(tableOptions)

  paths.forEach(p => {
    let cidStr

    if (p.name === '.') {
      cidStr = p.cid.toBaseEncodedString() + (remainderPath ? '/' + remainderPath : '')
    } else if (p.cid.equals(cid)) {
      cidStr = Chalk.gray('(local)')
    } else {
      cidStr = p.cid.toBaseEncodedString()
    }

    table.push([
      p.name || Chalk.gray('(no name)'),
      p.size ? filesize(p.size) : '',
      p.cid.codec,
      cidStr
    ])
  })

  return table.toString()
}
