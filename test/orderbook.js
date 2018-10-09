const Stats = artifacts.require("Stats");
const Water = artifacts.require("Water");
const AUD = artifacts.require("AUD");
const OrderBook = artifacts.require("OrderBook");
let AssembleStruct = require('./helpers/AssembleStruct');

const structDefinition = [
  {name: 'offerType', type: 'uint256'},
  {name: 'owner', type: 'address'},
  {name: 'price', type: 'uint256'},
  {name: 'quantity', type: 'uint256'},
  {name: 'timeStamp', type: 'uint256'},
];

contract("OrderBook", function(accounts) {

  const OWNER = accounts[0];
  const ALICE = accounts[1];
  const BOB = accounts[2];
  const ORDER_TYPE_ASK = 0;
  const ORDER_TYPE_OFFER = 1;

  var contractInstance;
  var statsInstance;
  var waterInstance;

  const sellLimitPrice = 334822;
  const buyLimitPrice = 234822;
  const defaultSellQuantity = 420;
  const defaultBuyQuantity = 360;

  beforeEach(async ()=> {
    statsInstance = await Stats.new(22403, 45, 17212, 13243, 19243);
    waterInstance = await Water.new(500000);
    audInstance = await AUD.new(50000000);
    contractInstance = await OrderBook.new(statsInstance.address, waterInstance.address, audInstance.address);
    await waterInstance.setOrderBook(contractInstance.address);
    await audInstance.setOrderBook(contractInstance.address);
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
    const aliceWaterBalance = 5000;
    await waterInstance.transfer(ALICE, aliceWaterBalance);
    await contractInstance.addSellLimitOrder(sellLimitPrice, defaultSellQuantity, {from: ALICE});

    let [ orderType, owner, price, quantity ] = Object.values(await contractInstance._asks(0));

    let remainingWaterBalance = await waterInstance.balanceOf(ALICE);

    assert.equal(orderType, ORDER_TYPE_ASK, "Should be an ask");
    assert.equal(owner, ALICE, "Owner should be alice");
    assert.equal(Number(remainingWaterBalance), (aliceWaterBalance - defaultSellQuantity), "Alice's water balance has not been correctly reduced");
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
    await audInstance.transfer(BOB, 1000000);
    await contractInstance.addBuyLimitOrder(buyLimitPrice, defaultBuyQuantity, {from: BOB});

    let [ orderType, owner, price, quantity, timeStamp ] = Object.values(await contractInstance._offers(0));

    let remainingAudBalance = await audInstance.balanceOf(BOB);

    assert.equal(orderType, ORDER_TYPE_OFFER, "Should be an offer");
    assert.equal(owner, BOB, "Owner should be Bob");
    assert.equal(Number(remainingAudBalance), 1000000 - buyLimitPrice, "Bob's aud balance has not been correctly reduced");
    assert.equal(price, buyLimitPrice, "Sell limit amount is wrong");
    assert.equal(quantity, defaultBuyQuantity, "Incorrect quantity");
  });

  describe("OrderBook with setup complete", () => {
    beforeEach(async () => {
      await waterInstance.transfer(ALICE, 5000);
      await audInstance.transfer(BOB, 1000000);
      await contractInstance.addSellLimitOrder(sellLimitPrice, defaultSellQuantity, {from: ALICE});
      await contractInstance.addBuyLimitOrder(buyLimitPrice, defaultBuyQuantity, {from: BOB});
      await contractInstance.addBuyLimitOrder(buyLimitPrice, defaultBuyQuantity, {from: BOB});
    });

    it("should have three total limit orders", async () => {
      let orderBookData = await contractInstance.getOrderBook();
      let fixedData = AssembleStruct.assemble(structDefinition, Object.values(orderBookData));

      assert.equal(fixedData.length, 3, "There should be three order limits");

      assert.equal(fixedData[0].owner, ALICE, 'Incorrect "owner" record found');
      assert.equal(fixedData[0].quantity, defaultSellQuantity, 'Incorrect "quantity" record found');
      assert.equal(fixedData[0].price, sellLimitPrice, 'Incorrect "price" record found');
      assert.equal(fixedData[2].owner, BOB, 'Incorrect "owner" record found');
      assert.equal(fixedData[2].quantity, defaultBuyQuantity, 'Incorrect "quantity" record found');
      assert.equal(fixedData[2].price, buyLimitPrice, 'Incorrect "price" record found');
    });

    it("should sort ask orders", async () => {
      await waterInstance.transfer(ALICE, 500);
      await contractInstance.addSellLimitOrder(200, 100, {from: ALICE});
      await contractInstance.addSellLimitOrder(150, 100, {from: ALICE});

      let actual = await contractInstance.getPriceTimeOrders();

      assert.equal(actual[0], 2, "Should be index 2");
      assert.equal(actual[1], 1, "Should be index 1");
      assert.equal(actual[2], 0, "Should be index 0");
    });

    it("should have one sell order", async () => {
      let orderBookData = await contractInstance.getOrderBookAsks(10);

      let fixedData = AssembleStruct.assemble(structDefinition, Object.values(orderBookData));

      assert.equal(fixedData.length, 1, "There should be 1 ask order limits");

      assert.equal(fixedData[0].owner, ALICE, 'Incorrect "owner" record found');
      assert.equal(fixedData[0].quantity, defaultSellQuantity, 'Incorrect "quantity" record found');
      assert.equal(fixedData[0].price, sellLimitPrice, 'Incorrect "price" record found');
    });

    it("should have two buy orders", async () => {
      let orderBookData = await contractInstance.getOrderBookOffers(5);

      let fixedData = AssembleStruct.assemble(structDefinition, Object.values(orderBookData));

      assert.equal(fixedData.length, 2, "There should be 2 offer order limits");

      assert.equal(fixedData[0].owner, BOB, 'Incorrect "owner" record found');
      assert.equal(fixedData[0].quantity, defaultBuyQuantity, 'Incorrect "quantity" record found');
      assert.equal(fixedData[0].price, buyLimitPrice, 'Incorrect "price" record found');
      assert.equal(fixedData[1].owner, BOB, 'Incorrect "owner" record found');
      assert.equal(fixedData[1].quantity, defaultBuyQuantity, 'Incorrect "quantity" record found');
      assert.equal(fixedData[1].price, buyLimitPrice, 'Incorrect "price" record found');

    });
  });
});