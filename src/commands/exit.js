module.exports = function exit ({ spinner }) {
  if (spinner) spinner.stop()
  process.exit()
}
