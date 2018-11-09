import test from 'ava'
import Sinon from 'sinon'
import Os from 'os'
import Path from 'path'
import config from '../../src/commands/config'

test.beforeEach(t => {
  t.context.ipfs = {}
  t.context.configPath = Path.join(Os.tmpdir(), `.ipld-explorer-cli-${Date.now()}`)
})

test('should set apiAddr and create new IPFS instance with passed multiaddr', async t => {
  const mockIpfs = {
    block: Sinon.stub(),
    files: { stat: Sinon.stub() }
  }

  const mfsRootStat = { hash: 'QmTDRqaYVQSGKPsdgUPmFPWguD9rVP1ra7SAQRBgr81xuV' }
  mockIpfs.files.stat.withArgs('/').returns(Promise.resolve(mfsRootStat))

  const IpfsApi = () => mockIpfs
  const ctx = { ipfs: t.context.ipfs, IpfsApi, configPath: t.context.configPath }

  const res = await config(ctx, 'set', 'apiAddr', '/ip4/127.0.0.1/tcp/5001')
  t.truthy(res.ctx.ipfs) // ensure changed
  t.not(res.ctx.ipfs, t.context.ipfs) // ensure different
})

test('should error for invalid subcommand', async t => {
  const subCmd = 'blarp'
  const err = await t.throws(config({}, subCmd))
  t.is(err.message, `${subCmd}: subcommand not found`)
})
