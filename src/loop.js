module.exports = async (func) => {
  while (true) { await func() }
}
