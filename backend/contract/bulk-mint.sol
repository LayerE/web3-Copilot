// SPDX-License-Identifier: MIT



pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract CopilotERC1155 is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
    string public name;
    string public symbol;
    mapping(uint256 => string) public tokenURI;
    uint256 public tokenID; 
    
     constructor(
        string memory _name,
        string memory _symbol
    ) ERC1155("") {
        name = _name;
        symbol = _symbol;
    }

    function setURI(uint256 id, string memory _tokenURI) public onlyOwner {
        tokenURI[id] = _tokenURI;
    }

    function mint(address account, string memory _tokenURI, 
        uint256 amount
    )
        public
    {
        tokenID++;
        tokenURI[tokenID] = _tokenURI;
        _mint(account, tokenID, amount, "");
    }

    function bulkMint(address account, string memory _tokenURI,  uint256 count
    )
        public
    {
        for(uint256 i = 0; i < count; i++){
            tokenID++;
            tokenURI[tokenID] = string(abi.encodePacked(_tokenURI, Strings.toString(i), ".json"));
            _mint(account, tokenID, 1, "");
        }
    }


    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

     function uri(uint256 id) public view override(ERC1155) returns (string memory) {
        return tokenURI[id];
    }
}