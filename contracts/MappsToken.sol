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

    event Transfer(
        address indexed _from,
        address indexed _to, 
        uint256 _value
    );

    constructor() public{
        //totalSuPPLY IS A STATE VARIABLE : MEANING AVAILABLE THROUGHOUT THE CONTRACT 
         _setTotalSupply();
    }

    function _setTotalSupply() public{
        totalSupply  = 10000000;
        //allocate the total supply to the admins wallet
        balanceOf[msg.sender] = totalSupply; 
    }

    //transfer MAAPS TOKEN
    function transfer(address _to, uint256 _value) public returns (bool success){
        // Exception if account does not have enouch balance 
        require(balanceOf[msg.sender] >= _value);
        //transfer the balance 
        balanceOf[msg.sender]  -= _value;
        balanceOf[_to] += _value;
        //trigger transfer the event even if transfer is zero
        emit Transfer(msg.sender, _to, _value);
        
        return true;
    }


}