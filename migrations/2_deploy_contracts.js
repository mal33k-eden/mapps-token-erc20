const MappsToken = artifacts.require("MappsToken");
const MappsTokenSale = artifacts.require("MappsTokenSale");

module.exports = function (deployer) {
  deployer.deploy(MappsToken).then(x =>{
    var tokenPrice = 1000000000000000; // in wei == 0.001 eth
    return deployer.deploy(MappsTokenSale,MappsToken.address,tokenPrice);
  });
  
};
