import web3 from './web3'
const CampaignFactory = require('./build/CampaignFactory')

// const contractAddress = process.env.REACT_APP_KICKSTART_CONTRACT_ADDRESS
const contractAddress = `0x0100F2dB549883DA855C676abEb84995Beb8b370`
console.log(`contract address: ${contractAddress}`)

const instance = new web3.eth.Contract(CampaignFactory.abi, contractAddress)

export default instance
