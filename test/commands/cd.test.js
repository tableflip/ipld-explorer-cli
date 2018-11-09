import test from 'ava'
import Sinon from 'sinon'
import cd from '../../src/commands/cd'

test.beforeEach(t => {
  t.context.ipfs = {
    dag: { get: Sinon.stub() },
    files: { stat: Sinon.stub() }
  }

  t.context.ipld = {
    get: Sinon.stub()
  }
})

test('should cd to home when no argument is given', async t => {
  const mfsRootStat = { hash: 'QmTDRqaYVQSGKPsdgUPmFPWguD9rVP1ra7SAQRBgr81xuV' }
  t.context.ipfs.files.stat.withArgs('/').returns(Promise.resolve(mfsRootStat))
  t.context.ipld.get.returns(Promise.resolve())
  const res = await cd({ ipfs: t.context.ipfs, ipld: t.context.ipld })
  t.is(res.ctx.wd, `/ipfs/${mfsRootStat.hash}`)
})

test('should cd directly to CID', async t => {
  const cid = 'QmTDRqaYVQSGKPsdgUPmFPWguD9rVP1ra7SAQRBgr81xuV'
  t.context.ipld.get.returns(Promise.resolve())
  const res = await cd({ ipld: t.context.ipld }, cid)
  t.is(res.ctx.wd, `/ipfs/${cid}`)
})

test('should cd to absolute path', async t => {
  const path = '/ipfs/QmTDRqaYVQSGKPsdgUPmFPWguD9rVP1ra7SAQRBgr81xuV'
  t.context.ipld.get.returns(Promise.resolve())
  const res = await cd({ ipld: t.context.ipld }, path)
  t.is(res.ctx.wd, path)
})

test('should cd to relative path', async t => {
  const wd = '/ipfs/QmTDRqaYVQSGKPsdgUPmFPWguD9rVP1ra7SAQRBgr81xuV'
  const path = 'foo'
  t.context.ipld.get.returns(Promise.resolve())
  const res = await cd({ ipld: t.context.ipld, wd }, path)
  t.is(res.ctx.wd, `${wd}/${path}`)
})

test('should resolve path traversal parts', async t => {
  const wd = '/ipfs/QmTDRqaYVQSGKPsdgUPmFPWguD9rVP1ra7SAQRBgr81xuV'
  const path = 'foo/../bar/./baz'
  t.context.ipld.get.returns(Promise.resolve())
  const res = await cd({ ipld: t.context.ipld, wd }, path)
  t.is(res.ctx.wd, `${wd}/bar/baz`)
})
