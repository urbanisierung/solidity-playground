import ganache from 'ganache-cli'
import Web3 from 'web3'

const compiled = require('../build/Inbox')

const web3 = new Web3(ganache.provider())

const DEFAULT_MESSAGE = 'Hi there!'

let accounts
let inbox

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  inbox = await new web3.eth.Contract(compiled.abi)
    .deploy({
      data: `0x${compiled.evm.bytecode.object}`,
      arguments: [DEFAULT_MESSAGE],
    })
    .send({ from: accounts[0], gas: 1000000 })
})

describe('Inbox', () => {
  it('deploys a contract', () => {
    expect(inbox.options.address).toBeTruthy()
  })

  it('has a default mess<ge', async () => {
    const message = await inbox.methods.message().call()
    expect(message).toBe(DEFAULT_MESSAGE)
  })

  it('can change the message', async () => {
    const NEW_MESSAGE = 'bye'
    await inbox.methods.setMessage(NEW_MESSAGE).send({ from: accounts[0] })
    const message = await inbox.methods.message().call()
    expect(message).toBe(NEW_MESSAGE)
  })
})
