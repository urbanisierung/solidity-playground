const path = require('path')
const fs = require('fs')
const solc = require('solc')

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol')
const source = fs.readFileSync(inboxPath, 'utf8')

const input = {
  language: 'Solidity',
  sources: {
    'Inbox.sol': {
      content: source,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
    },
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
}

//   solc.

// const inbox = JSON.parse(solc.compile(JSON.stringify(input))).contracts.Inbox
const compiled = JSON.parse(solc.compile(JSON.stringify(input)))
module.exports = compiled.contracts['Inbox.sol'].Inbox

// console.log(JSON.parse(solc.compile(JSON.stringify(input))).contracts.Inbox)

// module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts.Inbox

// console.log(JSON.parse(solc.compile(JSON.stringify(input))))
// console.log(JSON.parse(solc.compile(input)))

// console.log(solc.compile(source, 1))

// module.exports = solc.compile(source, 1).contracts[':Inbox']
