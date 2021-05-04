var MappsToken = artifacts.require("MappsToken");

contract('MappsToken', function(accounts){
    var tokenInstance;
    

    it("initializes the contract with the collect values", function(){
        return MappsToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name,"Mapps Token", "has the correct name");
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol,"MAPPS", "has the correct symbol");
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(symbol,"Mapps Token v1.0", "has the correct standard");
        });
    });
    it("allocates the initial total supply upon deployment", function(){
        return MappsToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(),10000000, 'Sets the total supply to 10000000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 10000000, "it allocates the initial supply to the admin wallet");
        });
    });
});