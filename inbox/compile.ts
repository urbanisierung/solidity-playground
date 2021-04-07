import path from 'path'
import fs from 'fs-extra'
import solc from 'solc'

const CONTRACT_DIR = 'contracts'
const BUILD_DIR = 'build'

export class Compile {
  constructor(private contract: string) {}

  public compile() {
    const buildPath = Compile.prepare()
    const config = this.getConfig()
    let compiledSources
    try {
      compiledSources = JSON.parse(solc.compile(JSON.stringify(config)))
    } catch (error) {
      console.log(error)
      return
    }

    if (!compiledSources) {
      console.error(
        '>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n',
        'NO OUTPUT'
      )
    } else {
      if (compiledSources.errors) {
        // something went wrong.
        console.error(
          '>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n'
        )
        compiledSources.errors.map((error) =>
          console.log(error.formattedMessage)
        )
      } else {
        fs.ensureDirSync(buildPath)

        for (let contractFileName in compiledSources.contracts) {
          const contractName = contractFileName.replace('.sol', '')
          console.log('Writing: ', `${contractName}.json`)
          fs.outputJsonSync(
            path.resolve(buildPath, `${contractName}.json`),
            compiledSources.contracts[contractFileName][contractName]
          )
        }
      }
    }
  }

  private static prepare() {
    const buildPath = path.resolve(__dirname, BUILD_DIR)
    fs.removeSync(path.resolve(__dirname, BUILD_DIR))
    return buildPath
  }

  private getConfig() {
    let config: any = {
      language: 'Solidity',
      sources: {},
      settings: {
        outputSelection: {
          // return everything
          '*': {
            '*': ['*'],
          },
        },
      },
    }
    config.sources[this.contract] = {
      content: fs.readFileSync(
        path.resolve(__dirname, CONTRACT_DIR, this.contract),
        'utf8'
      ),
    }
    return config
  }
}

const compile = new Compile('Inbox.sol')
compile.compile()
