import solc from 'solc';
import fs from 'fs';


import path from 'path';

export default function compileSolc(source) {
    try{
        let input = {
            language: 'Solidity',
            sources: {
                'input.sol': {
                    content: source
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

        function findImports(relativePath){
            const absolutePath = path.resolve(path.dirname(''), 'node_modules', relativePath);
            const source = fs.readFileSync(absolutePath, 'utf8');
            return { contents: source };
        }
        let output = JSON.parse(solc.compile(JSON.stringify(input),
            { import: findImports }, 
        ));
        let contractName = Object.keys(output.contracts['input.sol'])[0];
        let bytecode = output.contracts['input.sol'][contractName].evm.bytecode.object;
        let abi = output.contracts['input.sol'][contractName].abi;
        return {
            bytecode: bytecode,
            abi,
        }
        
    }
catch (error) {
    console.log(error);
    return { error: "error compiling the contract" };
}
}