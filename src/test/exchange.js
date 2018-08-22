const Token = artifacts.require("AUD");
const assertJump = require("./assertJump.js");

const durationTime = 28; //4 weeks

const timeController = (() => {
  
    const addSeconds = (seconds) => new Promise((resolve, reject) =>
      web3.currentProvider.sendAsync({
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [seconds],
        id: new Date().getTime()
      }, (error, result) => error ? reject(error) : resolve(result.result)));
  
    const addDays = (days) => addSeconds(days * 24 * 60 * 60);
  
    const currentTimestamp = () => web3.eth.getBlock(web3.eth.blockNumber).timestamp;
  
    return {
      addSeconds,
      addDays,
      currentTimestamp
    };
  })();
  
async function advanceToBlock(number) {
  await timeController.addDays(number);
}

contract('Media', function(accounts) {
  beforeEach(async function () {
      this.token = await Token.new({from: accounts[0]});
  });

  it("total supply should be 100000000", async function () {
    const actual = await this.token.totalSupply();
    assert.equal(actual.valueOf(), 100000000, "Total supply should be 100000000");
  });

  it("owner balance should be 100000000", async function () {
    const actual = await this.token.balanceOf(accounts[0]);
    assert.equal(actual.valueOf(), 100000000, "Balance should be 100000000");
  });

  it("should transfer 1337 tokens", async function () {
    await this.token.transfer(accounts[1], 1337);
    var actual = await this.token.balanceOf(accounts[0]);
    assert.equal(actual.valueOf(), 99998663, "Balance should be 99998663");

    actual = await this.token.balanceOf(accounts[1]);
    assert.equal(actual.valueOf(), 1337, "Balance should be 1337");
  });

  it("owner should allow alice to transfer 100 tokens to bob", async function () {
    //account 0 (owner) approves alice
    const owner = accounts[0];
    const bob = accounts[1];
    const alice = accounts[2];
    await this.token.approve(alice, 100);
    
    //account 0 (owner) now transfers from alice to bob
    await this.token.transferFrom(owner, bob, 100, {from: alice});
    var actual = await this.token.balanceOf(bob);
    assert.equal(actual.valueOf(), 100, "Balance should be 100");
  });
});