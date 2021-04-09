import Web3 from 'web3'

const web3object = 'web3'
const ethObject = 'ethereum'

let provider
let web3

if (typeof window !== 'undefined') {
  // We are in the browser and metamask is running.
  console.log(`Using metamask`)
  if (window[ethObject]) {
    console.log(`ethereum object available`)
    web3 = new Web3(window[ethObject])
    window[ethObject].enable().catch((error) => console.error(error))
  } else {
    console.log(`NO ethereum object available`)
    provider = window[web3object].currentProvider
    web3 = new Web3(provider)
  }
} else {
  // We are on the server *OR* the user is not running metamask
  console.log(`Using server`)
  provider = new Web3.providers.HttpProvider(process.env.INFURA_RINKABY_API_KEY)
  web3 = new Web3(provider)
}

export default web3
