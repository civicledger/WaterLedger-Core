var Stats = artifacts.require("Stats");
var AUD = artifacts.require("AUD");
var Water = artifacts.require("Water");
var OrderBook = artifacts.require("OrderBook");

module.exports = async function(deployer, environment, accounts) {

  const ALICE = accounts[1];
  const BOB = accounts[2];
  const ALLOCATOR = accounts[3];
  const BUY_CUSTOMER1 = accounts[4];
  const BUY_CUSTOMER2 = accounts[5];
  const SELL_CUSTOMER1 = accounts[6];
  const SELL_CUSTOMER2 = accounts[7];

  // This is duplicated due to a deployer bug which causes the first deployed
  // contract to not return a usable instance
  let statsInstance = await deployer.deploy(Stats, 22403, 45, 17212, 13243, 19243);
  statsInstance = await deployer.deploy(Stats, 22403, 45, 17212, 13243, 19243);

  const audInstance = await deployer.deploy(AUD, 500000000);
  
  const waterInstance = await deployer.deploy(Water, 1000000);

  const orderBookInstance = await deployer.deploy(OrderBook, statsInstance.address, waterInstance.address, audInstance.address);

  await audInstance.setOrderBook(orderBookInstance.address);
  await waterInstance.setOrderBook(orderBookInstance.address);

  if (environment === 'development' || environment === 'rinkeby') {
    await statsInstance.addWriter(orderBookInstance.address);
    await waterInstance.transfer(ALICE, 1000);
    await waterInstance.transfer(SELL_CUSTOMER1, 1000);
    await waterInstance.transfer(SELL_CUSTOMER2, 1000);
    await audInstance.transfer(BOB, 1000000);
    await audInstance.transfer(BUY_CUSTOMER1, 1000000);
    await audInstance.transfer(BUY_CUSTOMER2, 1000000);

    await orderBookInstance.addSellLimitOrder(292600, 430, {from: ALICE});
    await orderBookInstance.addSellLimitOrder(135976, 330, {from: SELL_CUSTOMER1});
    await orderBookInstance.addSellLimitOrder(359302, 580, {from: SELL_CUSTOMER2});

    await orderBookInstance.addBuyLimitOrder(126444, 930, {from: BOB});
    await orderBookInstance.addBuyLimitOrder(318340, 540, {from: BOB});
    await orderBookInstance.addBuyLimitOrder(378823, 500, {from: BUY_CUSTOMER1});
    await orderBookInstance.addBuyLimitOrder(208636, 330, {from: BUY_CUSTOMER1});
    await orderBookInstance.addBuyLimitOrder(256344, 843, {from: BUY_CUSTOMER2});
  }
};
