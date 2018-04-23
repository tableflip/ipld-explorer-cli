module.exports = async function loop (func) {
  while (true) { await func() }
}
