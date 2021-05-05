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
    mapping(address=> mapping(address=>uint256)) public allowance;

    event Transfer(
        address indexed _from,
        address indexed _to, 
        uint256 _value
    );
    event Approval(
        address indexed _owner,
        address indexed _spender, 
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
    //approve transaction through exchange or thirdp
    function approve(address _spender, uint256 _value) public returns (bool success){
        
        allowance[msg.sender][_spender] = _value;
        //approve event 
        emit Approval(msg.sender, _spender, _value);
      return true;
    }

    //transfer from 
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        //three accounts used here. 1- the account that is calling the function, -2 the account to transfer from -3 and trhe account to transfer to 
        
        // require _from has enough tokens 
        require(_value <= balanceOf[_from]);
        // require  allowance  is big enough 
        require(_value <= allowance[_from][msg.sender]);
        // change the balance 
        balanceOf[_from] -= _value;
        balanceOf[_to]   += _value;
        // update the allowance 
        allowance[_from][msg.sender] -= _value;
        // trigger transfer event 
        emit Transfer(_from, _to, _value);
        //return a boolean
        return true;
    }
    


}