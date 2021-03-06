pragma solidity ^0.8;

import "./MappsToken.sol";

contract MappsTokenSale{
    address  admin;
    MappsToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);


    constructor(MappsToken _tokenContract, uint256 _tokenPrice) public {
        //assign an admin
        admin = msg.sender;
        //link to token contract 
        tokenContract = _tokenContract;
        //token price 
        tokenPrice = _tokenPrice;

    }

    //multiply
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable{
        
        // require that the value is equal to tokens
        require(msg.value == multiply(_numberOfTokens , tokenPrice));
        // Require that contract has enough tokens 
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        //require that the transfer is succccesfull
        require(tokenContract.transfer(msg.sender,_numberOfTokens));
        //track number of tokens sold 
        tokensSold += _numberOfTokens;
        // emit the sell event 
        emit Sell(msg.sender, _numberOfTokens);
    }
    //End the token sale 
    function endSale() public {
        // Require admin 
        require(msg.sender == admin);
        //transfer remaining dapp tokens to admin 
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        // destroy contract 
        shutdownICO();


        // UPDATE: Let's not destroy the contract here
        // Just transfer the balance to the admin
        //admin.transfer(address(this).balance);

    }

    /// destroy the contract and reclaim the leftover funds.
    function shutdownICO() public {
        require(msg.sender == admin);
        selfdestruct(payable(msg.sender));
    }

}