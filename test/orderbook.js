const Stats = artifacts.require("Stats");
const Water = artifacts.require("Water");
const AUD = artifacts.require("AUD");
const OrderBook = artifacts.require("OrderBook");

contract("OrderBook", function(accounts) {

  const OWNER = accounts[0];
  const ALICE = accounts[1];
  const BOB = accounts[2];

  var contractInstance;
  var statsInstance;
  var waterInstance;

  const sellLimitPrice = 300;
  const buyLimitPrice = 300;
  const defaultSellQuantity = 300;
  const defaultBuyQuantity = 400;

  beforeEach(async ()=> {
    statsInstance = await Stats.new(22403, 45, 17212, 13243, 19243);
    waterInstance = await Water.new(500000);
    audInstance = await AUD.new(500000);
    contractInstance = await OrderBook.new(statsInstance.address, waterInstance.address, audInstance.address);
    await statsInstance.addWriter(contractInstance.address);
  });

  it("should have water, AUD and stats subcontracts", async () => {
    const statsAddress = await contractInstance._stats();
    const waterAddress = await contractInstance._water();
    const audAddress = await contractInstance._aud();
    assert.equal(statsAddress, statsInstance.address, "Stats contract is not on the expected address");
    assert.equal(audAddress, audInstance.address, "AUD contract is not on the expected address");
    assert.equal(waterAddress, waterInstance.address, "Water contract is not on the expected address");
  });

  it("should not allow Alice to make a sell order if she does not have sufficient water", async () => {
    try {
      await contractInstance.addSellLimitOrder(sellLimitPrice, defaultSellQuantity, {from: ALICE});
    } catch(error) {
      assert(error);
      assert.equal(error.reason, "Insufficient water allocation", "Incorrect error for this revert");
    }
  });

  it("should add a limit sell order from Alice", async () => {
    await waterInstance.transfer(ALICE, 500);
    await contractInstance.addSellLimitOrder(sellLimitPrice, defaultSellQuantity, {from: ALICE});

    let [ owner, quantity, price ] = Object.values(await contractInstance._asks(0));

    assert.equal(owner, ALICE, "Owner should be alice");
    assert.equal(price, sellLimitPrice, "Sell limit amount is wrong");
    assert.equal(quantity, defaultSellQuantity, "Incorrect quantity");
  });

  it("should not allow Bob to make a buy order if he does not have sufficient funds", async () => {
    try {
      await contractInstance.addBuyLimitOrder(buyLimitPrice, defaultBuyQuantity, {from: BOB});
    } catch(error) {
      assert(error);
      assert.equal(error.reason, "Insufficient AUD allocation", "Incorrect error for this revert");
    }
  });

  it("should add a limit buy order from Bob", async () => {
    await audInstance.transfer(BOB, 500);
    await contractInstance.addBuyLimitOrder(buyLimitPrice, defaultBuyQuantity, {from: BOB});

    let [ owner, quantity, price ] = Object.values(await contractInstance._offers(0));

    assert.equal(owner, BOB, "Owner should be Bob");
    assert.equal(price, buyLimitPrice, "Sell limit amount is wrong");
    assert.equal(quantity, defaultBuyQuantity, "Incorrect quantity");
  });
});