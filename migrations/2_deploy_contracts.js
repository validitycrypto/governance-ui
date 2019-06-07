var Validation = artifacts.require("./communalValidation.sol");
var AddressSet = artifacts.require("./addressSet.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var ERC20d = artifacts.require("./ERC20d.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(AddressSet);
  deployer.link(SafeMath, ERC20d);
  deployer.deploy(ERC20d);
  deployer.link(AddressSet, Validation);
  deployer.deploy(Validation);
};
