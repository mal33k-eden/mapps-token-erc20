var MappsToken = artifacts.require("MappsToken");

contract('MappsToken', function(accounts){
    it("sets the total supply upon deployment", function(){
        return MappsToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(),10000000, 'Sets the total supply to 10000000')
        });
    });
});