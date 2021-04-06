import ganache from 'ganache-cli'
import Web3 from 'web3'

const web3 = new Web3(ganache.provider())

async function run() {
  const accounts = await web3.eth.getAccounts()
  console.log(accounts)
}

run()
