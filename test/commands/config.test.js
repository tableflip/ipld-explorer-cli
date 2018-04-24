import test from 'ava'
import config from '../../src/commands/config'

test.beforeEach(t => {
  t.context.ipfs = {}
})

test('should set apiAddr and create new IPFS instance with passed multiaddr', async t => {
  const res = config({ ipfs: t.context.ipfs }, 'set', 'apiAddr', '/ip4/127.0.0.1/tcp/5001')
  t.truthy(res.ctx.ipfs) // ensure changed
  t.not(res.ctx.ipfs, t.context.ipfs) // ensure different
})

test('should error for invalid subcommand', async t => {
  const subCmd = 'blarp'
  const err = await t.throws(() => config({ ipfs: t.context.ipfs }, subCmd))
  t.is(err.message, `${subCmd}: subcommand not found`)
})

test('should error for invalid key', async t => {
  const key = 'apiURL'
  const err = await t.throws(() => config({ ipfs: t.context.ipfs }, 'set', key))
  t.is(err.message, `${key}: invalid config key`)
})
