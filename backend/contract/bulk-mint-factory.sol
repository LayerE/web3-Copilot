// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./bulk-mint.sol";

contract ERC1155Factory {

    address public deployedAddress;

    event ERC1155Created(string name, string symbol, address deployer, address tokenContract);

    function deploy(string memory _name, string memory _symbol) public returns (address deployedContractAddress) {
        CopilotERC1155 t = new CopilotERC1155(_name, _symbol);
        emit ERC1155Created(_name, _symbol, msg.sender, address(t));
        deployedAddress = address(t);
        return deployedAddress;
    }
}