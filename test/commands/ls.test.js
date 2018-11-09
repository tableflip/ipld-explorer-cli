import test from 'ava'
import Sinon from 'sinon'
import { DAGNode } from 'ipld-dag-pb'
import { promisify } from 'util'
import CID from 'cids'
import ls from '../../src/commands/ls'

test.beforeEach(t => {
  t.context.ipld = {
    get: Sinon.stub(),
    resolve: Sinon.stub()
  }
})

test('should ls links for protobuf DAG node', async t => {
  const data = 'aaa'
  const links = [{
    name: 'unicorn-pug.jpg',
    size: 18023,
    multihash: 'QmRU85XyXTfFHRetAKSzj6jNGHUNNkrsDAqJqa5k15DvP4'
  }, {
    name: '515f726a7087d.jpg',
    size: 43622,
    multihash: 'QmU8pC4jDQh2wZzFqM3WUZFw1t6Z2WbWXSogxMnurBFCtj'
  }]

  const node = await promisify(DAGNode.create)(data, links)
  const cid = new CID(node.toJSON().multihash)

  t.context.ipld.resolve.returns(Promise.resolve({ cid }))
  t.context.ipld.get.returns(Promise.resolve(node))

  const res = await ls({ ipld: t.context.ipld }, cid)

  links.forEach(l => {
    t.true(res.out.includes(l.name))
    t.true(res.out.includes(l.multihash))
  })
})

test('should ls for working DAG when no argument is given', async t => {
  const data = 'aaa'
  const links = [{
    name: 'unicorn-pug.jpg',
    size: 18023,
    multihash: 'QmRU85XyXTfFHRetAKSzj6jNGHUNNkrsDAqJqa5k15DvP4'
  }, {
    name: '515f726a7087d.jpg',
    size: 43622,
    multihash: 'QmU8pC4jDQh2wZzFqM3WUZFw1t6Z2WbWXSogxMnurBFCtj'
  }]

  const node = await promisify(DAGNode.create)(data, links)
  const cid = new CID(node.toJSON().multihash)

  t.context.ipld.resolve.returns(Promise.resolve({ cid }))
  t.context.ipld.get.returns(Promise.resolve(node))

  const res = await ls({ ipld: t.context.ipld, wd: `/ipfs/${cid}` })

  links.forEach(l => {
    t.true(res.out.includes(l.name))
    t.true(res.out.includes(l.multihash))
  })
})
