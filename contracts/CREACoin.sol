// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CREACoin is ERC20 {

    uint256 private _mintAmount = 0;
    address private _owner;
    uint64 private _mintDelay = 60 * 60 * 24;

    mapping (address => uint256) nextMint;

    constructor () ERC20("CREACoin", "CREAC"){

        _owner = msg.sender;

        _mint(msg.sender,1000 * 10 ** 18);

    }

    function mint( address to)  public restricted  {

        require(_mintAmount > 0,"Minting is not enabled.");
        require(block.timestamp > nextMint[to],"You cannot mint twice in a row.");
        _mint(to, _mintAmount);
        nextMint[to]=block.timestamp + _mintDelay;
        
    }

    function setMintAmount(uint256 newAmount) public restricted{
        _mintAmount = newAmount;
        
    }

    function setMintDelay(uint64 newDelay) public restricted{
            _mintDelay = newDelay;
            
    }

    modifier restricted() {
        require (_owner == msg.sender, "You do not have permission.");
        _;
    }


}
