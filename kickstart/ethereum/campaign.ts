import web3 from './web3'
const Campaign = require('./build/Campaign')

export default (address) => {
  return new web3.eth.Contract(Campaign.abi, address)
}
