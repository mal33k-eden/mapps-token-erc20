pragma solidity ^0.8;

contract MappsToken {
    // Constructor 
    // set the total number of tokens
    // read the total numbe rof tokens 
    string public name = "Mapps Token";
    string public symbol = "MAPPS";
    string public standard = "Mapps Token v1.0";

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;


    constructor() public{
        //totalSuPPLY IS A STATE VARIABLE : MEANING AVAILABLE THROUGHOUT THE CONTRACT 
         _setTotalSupply();
    }

    function _setTotalSupply() public{
        totalSupply  = 10000000;
        //allocate the total supply to the admins wallet
        balanceOf[msg.sender] = totalSupply; 

    }
}