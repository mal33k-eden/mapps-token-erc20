pragma solidity ^0.8;

contract MappsToken {
    // Constructor 
    // set the total number of tokens
    // read the total numbe rof tokens 

    uint256 public totalSupply;

    constructor() public{
        //totalSuPPLY IS A STATE VARIABLE : MEANING AVAILABLE THROUGHOUT THE CONTRACT 
        totalSupply = 10000000;

    }
}