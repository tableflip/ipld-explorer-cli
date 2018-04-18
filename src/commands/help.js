module.exports = function help ({ wd }) {
  console.log(`
Use the following commands to explore the IPFS DAG:

cd         <path>         change current working DAG to path
config set <key> <value>  set a config key to a new value. Supported keys:
                          "apiUrl" (value must be a multiaddr string)
exit                      exit the explorer REPL (also ctrl+c)
help                      print this help message
ls         [path]         list the links for a path (default path is working DAG
                          path)
pwd                       print the working DAG path
resolve    [path]         walk down a path and return the object found there
                          (default path is working DAG path)
version                   print the version number of this tool
`)
}
