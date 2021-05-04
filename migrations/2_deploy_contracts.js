const MappsToken = artifacts.require("MappsToken");

module.exports = function (deployer) {
  deployer.deploy(MappsToken);
};
