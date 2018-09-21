var Stats = artifacts.require("./Stats.sol");
var Transfers = artifacts.require("./Transfers.sol");
var AUD = artifacts.require("./AUD.sol");
var Water = artifacts.require("./Water.sol");
var OrderBook = artifacts.require("./OrderBook.sol");

let mockData = require('./transactions.json');

module.exports = async function(deployer) {

  let statsInstance = await deployer.deploy(Stats, 22403, 45, 17212, 13243, 19243);
  statsInstance = await deployer.deploy(Stats, 22403, 45, 17212, 13243, 19243);

  const transfersInstance = await deployer.deploy(Transfers);

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

  let audInstance = await deployer.deploy(AUD, 0);
  let waterInstance = await deployer.deploy(Water, 2000);

  await deployer.deploy(OrderBook, statsInstance.address, waterInstance.address, audInstance.address);
};
