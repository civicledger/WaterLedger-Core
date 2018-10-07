var Stats = artifacts.require("Stats");
var AUD = artifacts.require("AUD");
var Water = artifacts.require("Water");
var OrderBook = artifacts.require("OrderBook");

module.exports = async function(deployer, environment, accounts) {

  const ALICE = accounts[1];
  const BOB = accounts[2];

  // This is duplicated due to a deployer bug which causes the first deployed
  // contract to not return a usable instance
  let statsInstance = await deployer.deploy(Stats, 22403, 45, 17212, 13243, 19243);
  statsInstance = await deployer.deploy(Stats, 22403, 45, 17212, 13243, 19243);

  const audInstance = await deployer.deploy(AUD, 50000);
  const waterInstance = await deployer.deploy(Water, 50000);

  const orderBookInstance = await deployer.deploy(OrderBook, statsInstance.address, waterInstance.address, audInstance.address);

  await audInstance.setOrderBook(orderBookInstance.address);
  await waterInstance.setOrderBook(orderBookInstance.address);

  if (environment === 'development' || environment === 'rinkeby') {
    await statsInstance.addWriter(orderBookInstance.address);
    await waterInstance.transfer(ALICE, 10000);
    await audInstance.transfer(BOB, 10000);

    await orderBookInstance.addSellLimitOrder(4267, 400, {from: ALICE});
    await orderBookInstance.addSellLimitOrder(1355, 300, {from: ALICE});
    await orderBookInstance.addBuyLimitOrder(1254, 900, {from: BOB});
    await orderBookInstance.addBuyLimitOrder(3188, 500, {from: BOB});
  }
};
