module.exports = function exit ({ spinner }) {
  spinner.stop()
  process.exit()
}
