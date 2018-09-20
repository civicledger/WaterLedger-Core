const Stats = artifacts.require("Stats");
const Water = artifacts.require("Water");
const OrderBook = artifacts.require("OrderBook");

contract("OrderBook", function(accounts) {

  const OWNER = accounts[0];
  const ALICE = accounts[1];
  const BOB = accounts[2];

  var contractInstance;
  var statsInstance;
  var waterInstance;

  const sellLimitAmount = 300;
  const defaultQuantity = 300;

  beforeEach(async ()=> {
    statsInstance = await Stats.new(22403, 45, 17212, 13243, 19243);
    waterInstance = await Water.new(500000);
    contractInstance = await OrderBook.new(statsInstance.address, waterInstance.address);
    await statsInstance.addWriter(contractInstance.address);
  });

  it("should have water and stats subcontracts", async () => {
    const statsAddress = await contractInstance._stats();
    const waterAddress = await contractInstance._water();
    assert.equal(statsAddress, statsInstance.address, "Stats contract is not on the expected address");
    assert.equal(waterAddress, waterInstance.address, "Water contract is not on the expected address");
  });

  it("should add a limit order from Alice", async () => {
    await waterInstance.transfer(ALICE, 500);
    await contractInstance.addSellLimitOrder(sellLimitAmount, defaultQuantity, {from: ALICE});

    let [ owner, quantity, price ] = Object.values(await contractInstance._asks(0));

    assert.equal(owner, ALICE, "Owner should be alice");
    assert.equal(price, sellLimitAmount, "Sell limit amount is wrong");
    assert.equal(quantity, defaultQuantity, "Incorrect quantity");
  });
});