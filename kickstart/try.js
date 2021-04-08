const ganache = require('ganache-cli')
const compiled = require('./build/Inbox')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

async function run() {
  accounts = await web3.eth.getAccounts()
  console.log(accounts)
}

run()
