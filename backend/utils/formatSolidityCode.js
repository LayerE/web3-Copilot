function formatSolidityCode(code) {
    // remove solidity in the beginning

    // if the first line contains solidity not followed by a version number
    // remove it
    if (code.startsWith('solidity') && !code.startsWith('solidity 0.')) {
      code = code.replace('solidity', '');
    }
    // Remove leading/trailing white spaces and line breaks
    code = code.trim();
  
    // Replace multiple empty lines with a single empty line
    code = code.replace(/\n\s*\n/g, '\n\n');

    // replace ` comments with /* */
    code = code.replace(/`/g, '/*');
  
    // Add proper indentation
    let lines = code.split('\n');
    let formattedCode = '';
    let indentLevel = 0;
  
    for (let line of lines) {
      line = line.trim();
  
      if (line.startsWith('}')) {
        indentLevel--;
      }
  
      formattedCode += '  '.repeat(indentLevel) + line + '\n';
  
      if (line.endsWith('{')) {
        indentLevel++;
      }
    }
  
    return formattedCode.trim();
  }


  



  export default formatSolidityCode;