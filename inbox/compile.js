const path = require('path')
// const fs = require('fs')
const fs = require('fs-extra')
const solc = require('solc')

function compilingPreperations() {
  const buildPath = path.resolve(__dirname, 'build')
  fs.removeSync(buildPath)
  return buildPath
}

function createConfiguration() {
  return {
    language: 'Solidity',
    sources: {
      'Inbox.sol': {
        content: fs.readFileSync(
          path.resolve(__dirname, 'contracts', 'Inbox.sol'),
          'utf8'
        ),
      },
    },
    settings: {
      outputSelection: {
        // return everything
        '*': {
          '*': ['*'],
        },
      },
    },
  }
}

function compileSources(config) {
  try {
    return JSON.parse(solc.compile(JSON.stringify(config)))
  } catch (error) {
    console.log(error)
  }
}

function errorHandling(compiledSources) {
  if (!compiledSources) {
    console.error(
      '>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n',
      'NO OUTPUT'
    )
  } else if (compiledSources.errors) {
    // something went wrong.
    console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n')
    compiledSources.errors.map((error) => console.log(error.formattedMessage))
  }
}

function writeOutput(compiled, buildPath) {
  fs.ensureDirSync(buildPath)

  for (let contractFileName in compiled.contracts) {
    const contractName = contractFileName.replace('.sol', '')
    console.log('Writing: ', `${contractName}.json`)
    fs.outputJsonSync(
      path.resolve(buildPath, `${contractName}.json`),
      compiled.contracts[contractFileName][contractName]
    )
  }
}

const buildPath = compilingPreperations()
const config = createConfiguration()
const compiled = compileSources(config)
errorHandling(compiled)
writeOutput(compiled, buildPath)

// const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol')
// const source = fs.readFileSync(inboxPath, 'utf8')

// const input = {
//   language: 'Solidity',
//   sources: {
//     'Inbox.sol': {
//       content: source,
//     },
//   },
//   settings: {
//     optimizer: {
//       enabled: true,
//     },
//     outputSelection: {
//       '*': {
//         '*': ['*'],
//       },
//     },
//   },
// }

// const compiled = JSON.parse(solc.compile(JSON.stringify(input)))
// module.exports = compiled.contracts['Inbox.sol'].Inbox
