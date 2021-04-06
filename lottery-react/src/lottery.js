import web3 from "./web3";

const address = process.env.REACT_APP_LOTTERY_CONTRACT_ADDRESS;
const abi = require("./build/Lottery").abi;

export default new web3.eth.Contract(abi, address);
