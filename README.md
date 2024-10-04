 
# Game

Game is a simple smart contract with a functional decentralized application (DApp) integrated with the smart contract. The smart contract is a gaming contract where the owner sets a mystery letter and require the players to guess the letter. The players stake to guess.

## Description
This program is a Dapp created using a javascript framework to connect to the blockchain - ethers.js and some javascript codes. On the front-end, the players can only guess the letter only when the owner have set the letter.

## Smart Contract
```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


contract Game {

    address immutable owner;
    bytes32 mistery;

    mapping(address => uint256) public balanceOf;

    event GamePlayed(string result);

    constructor(address[] memory players) {
        owner = msg.sender;
        initializePlayers(players);
    }

    function initializePlayers(address[] memory players) private {
        for (uint256 i = 0; i < players.length; i++) {
            balanceOf[players[i]] = 1000;
        }
    }

    function setMistery(string memory _mistery) external returns(bool) {
        require(msg.sender == owner, "ONLY_OWNER");

        mistery = keccak256(abi.encodePacked(_mistery));
        return true;
    }

    function playGame(uint256 _amount, string memory _guess) external {
        require(msg.sender != owner, "OWNER_CANNOT_PLAY!");
        require(balanceOf[msg.sender] >= _amount, "INSUFFICIENT BALANCE");

        bytes32 result = keccak256(abi.encodePacked(_guess));
         uint256 _perc = (_amount * 10) / 100;
         string memory message;

        if (result == mistery) {
            balanceOf[msg.sender] += _perc;
            message = "You Won!";
            
        } else {
            balanceOf[msg.sender] -= _amount;
            message = "You lost!";
        }

        emit GamePlayed(message);

    }
}
```

# Getting Started

## Installing

- Clone the project by typing ```git clone https://github.com/teetop/Module-2-DApp``` in your terminal.
- After cloning the project, ```cd``` into the project and type ```npm i``` to install all dependencies for the project
- Deploy your contract on your preferred chain, preferably on Avalanche. Set up your hardhat.config file to be able to deploy on your preferred network. run ```npx hardhat run scripts/deploy.js --network <YOUR_NETWORK>``` to deploy
- Once your contract is deployed, copy the contract address and head to index.js, add the contract address here
  ```javascript
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  ```
- When the contract address is added, run ```npm run dev``` to start your frontend
- Once the front-end is up, interact with the contract.

## Authors

Temitope Taiwo

## License
This project is licensed under the MIT License - see the LICENSE.md file for details
