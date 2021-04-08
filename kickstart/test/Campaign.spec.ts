import ganache from 'ganache-cli'
import Web3 from 'web3'
import { fail } from 'assert'

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

const web3 = new Web3(ganache.provider())

let accounts
let factory
let campaignAddress
let campaign

let caller

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  caller = accounts[0]

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: `0x${compiledFactory.evm.bytecode.object}`,
    })
    .send({ from: caller, gas: 3000000 })

  await factory.methods.createCampaign(100).send({
    from: caller,
    gas: 1000000,
  })

  const deployedCampaigns = await factory.methods.getDeployedCampaigns().call()
  campaignAddress = deployedCampaigns[0]
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)
})

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    expect(factory.options.address).toBeTruthy()
    expect(campaign.options.address).toBeTruthy()
  })

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call()
    expect(manager).toBe(caller)
  })

  it('allows people to contribute money and marks them as approvers', async () => {
    const contributor = accounts[1]
    await campaign.methods.contribute().send({
      value: 200,
      from: contributor,
    })
    const isContributor = await campaign.methods.approvers(contributor).call()
    expect(isContributor).toBe(true)
  })

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: 5,
        from: accounts[1],
      })
      fail()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })

  it('allows a manager to make a payment request', async () => {
    const description = 'Buy batteries'
    await campaign.methods.createRequest(description, 100, accounts[1]).send({
      from: caller,
      gas: 1000000,
    })
    const request = await campaign.methods.requests(0).call()

    expect(request.description).toBe(description)
  })

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: caller,
      value: web3.utils.toWei('10', 'ether'),
    })

    await campaign.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({ from: caller, gas: 1000000 })

    await campaign.methods.approveRequest(0).send({
      from: caller,
      gas: 1000000,
    })

    await campaign.methods.finalizeRequest(0).send({
      from: caller,
      gas: 1000000,
    })

    const balanceWei = await web3.eth.getBalance(accounts[1])
    const balanceEther = web3.utils.fromWei(balanceWei, 'ether')
    const balance = Number(balanceEther)

    expect(balance).toBeGreaterThan(104)
  })
})
