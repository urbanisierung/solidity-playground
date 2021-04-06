// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Lottery {
    string internal constant INSUFFICIENT_FUND_MESSAGE = "Insufficient Fund";
    string internal constant RESTRICTED_MESSAGE = "Unauthorized Access";

    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether, INSUFFICIENT_FUND_MESSAGE);

        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == manager, RESTRICTED_MESSAGE);
        _;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}