var Stats = artifacts.require("./Stats.sol");
var Transfers = artifacts.require("./Transfers.sol");
var AUD = artifacts.require("./AUD.sol");
var Exchange = artifacts.require("./Exchange.sol");
var Water = artifacts.require("./Water.sol");

let mockData = require('./transactions.json');

module.exports = async function(deployer) {
  await deployer.deploy(Stats, 22403, 45, 17212, 13243, 19243);
  
  let transfersInstance = await deployer.deploy(Transfers);

  mockData.forEach(async (transfer) => {
    await transfersInstance.addTransfer(
      web3.utils.asciiToHex(transfer.seller),  
      web3.utils.asciiToHex(transfer.buyer),  
      web3.utils.asciiToHex(transfer.location),  
      transfer.volume,  
      transfer.pricePerML, 
      new Date(transfer.time).getTime()
    );
  });

  await deployer.deploy(AUD, 0);
  await deployer.deploy(Exchange);
  await deployer.deploy(Water, 2000);
};
