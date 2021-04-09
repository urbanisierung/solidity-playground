import HDWalletProvider from '@truffle/hdwallet-provider'
import Web3 from 'web3'
import dotenv from 'dotenv'

dotenv.config()

const compiled = require('./build/CampaignFactory')

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: process.env.MNEMONIC,
  },
  providerOrUrl: process.env.INFURA_RINKABY_API_KEY,
})

const web3 = new Web3(provider)

async function deploy() {
  const accounts = await web3.eth.getAccounts()

  console.log('Attempting to deploy from account', accounts[0])

  const result = await new web3.eth.Contract(compiled.abi)
    .deploy({
      data: `0x${compiled.evm.bytecode.object}`,
    })
    .send({ gas: 3000000, from: accounts[0] })

  console.log('Contract deployed to', result.options.address)
}

deploy()
