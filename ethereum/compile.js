const fs = require('fs-extra');
const solc = require('solc');
const path = require('path');

const pathBuild = path.resolve(__dirname, 'build');
const pathContract = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(pathContract, 'utf8');
const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'];
fs.removeSync(pathBuild);
fs.ensureDirSync(pathBuild);
for(let contract in output) {
    fs.outputJSONSync(
        path.resolve(__dirname,'build', contract + '.json'),
        output[contract]
    )
}