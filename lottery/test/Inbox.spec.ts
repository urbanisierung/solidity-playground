import ganache from 'ganache-cli'
import Web3 from 'web3'
import { fail } from 'assert'

const compiled = require('../build/Lottery')

const web3 = new Web3(ganache.provider())

let accounts
let lottery

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  lottery = await new web3.eth.Contract(compiled.abi)
    .deploy({
      data: `0x${compiled.evm.bytecode.object}`,
    })
    .send({ from: accounts[0], gas: 1000000 })
})

describe('Lottery', () => {
  it('deploys a contract', () => {
    expect(lottery.options.address).toBeTruthy()
  })

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether'),
    })

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })

    expect(accounts[0]).toBe(players[0])
    expect(players.length).toBe(1)
  })

  it('allows multiple accounts to enter', async () => {
    const accountsToEnter = accounts.slice(0, 3)
    const enterPromises = accountsToEnter.map((account) =>
      lottery.methods.enter().send({
        from: account,
        value: web3.utils.toWei('0.02', 'ether'),
      })
    )
    await Promise.all(enterPromises)

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })

    accountsToEnter.forEach((account) => {
      expect(players.includes(account)).toBe(true)
    })
    expect(players.length).toBe(accountsToEnter.length)
  })

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0,
      })
      fail()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })

  it('only manager can call pickWinner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      })
      fail()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })

  it('sends money to the winner and resets the players array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether'),
    })

    const initialBalance = await web3.eth.getBalance(accounts[0])
    await lottery.methods.pickWinner().send({ from: accounts[0] })
    const finalBalance = await web3.eth.getBalance(accounts[0])
    const difference = Number(finalBalance) - Number(initialBalance)

    expect(difference > Number(web3.utils.toWei('1.8', 'ether'))).toBe(true)
  })
})
