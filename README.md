# ipld-explorer-cli

[![Build Status](https://travis-ci.org/tableflip/ipld-explorer-cli.svg?branch=master)](https://travis-ci.org/tableflip/ipld-explorer-cli) [![dependencies Status](https://david-dm.org/tableflip/ipld-explorer-cli/status.svg)](https://david-dm.org/tableflip/ipld-explorer-cli) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Explore the IPLD directed acyclic graph with your keyboard

<img width="740" alt="screen shot 2018-04-18 at 16 30 40" src="https://user-images.githubusercontent.com/152863/38942150-01a0f8e4-4326-11e8-9c1b-559373b0cdcc.png">

## Install

Ensure you have at least:

* node@8
* go-ipfs@0.4 or js-ipfs@0.31

Install the explorer:

```sh
npm install --global ipld-explorer-cli
```

Start your Go/JS IPFS daemon:

```sh
ipfs daemon
# or
jsipfs daemon
```

## Usage

```sh
$ ipld-explorer

Welcome to the IPLD explorer REPL!
Type "help" then <Enter> for a list of commands

? >
```

### Commands

#### `cd [path]` (alias `get`)

Change DAG. Changes the current working DAG node to the specified path. If the path is starts with `/ipfs` or is a CID then change to that path otherwise path is taken to be relative to the current working DAG path.

#### `pwd`

Print working DAG. Prints the path of the current working DAG.

#### `resolve [path]`

Walk down the provided path and print the object found there. `path` defaults to CWD (current working DAG) if not specified.

#### `ls [path]`

List the entries at a path. `path` defaults to CWD (current working DAG) if not specified.

#### `config set <key> <value>`

Set a config value.

##### Configuration

The following configuration keys are valid:

* `apiAddr` - The [multiaddr](https://multiformats.io/multiaddr/) of the IPFS node to use (default: /ip4/127.0.0.1/tcp/5001)

#### `config get [key]`

Get a config value or get all config if no key is provided.

#### `help`

Print the help information.

#### `version`

Prints the version of the ipld-explorer.

#### `exit`

Quit the explorer.

## Contribute

Feel free to dive in! [Open an issue](https://github.com/tableflip/ipld-explorer-cli/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
