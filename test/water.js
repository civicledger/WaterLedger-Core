const Water = artifacts.require("Water");

const durationTime = 28; //4 weeks

contract("Water", function(accounts) {

  var contractInstance;

  const OWNER = accounts[0];
  const ALICE = accounts[1];
  const BOB = accounts[2];

  beforeEach(async () => {
    contractInstance = await Water.new();
  });
  
  it("total supply should be 0", async function () {
    const actual = await contractInstance.totalSupply();
    assert.equal(actual.valueOf(), 0, "Total supply should be 0");
  });

  it("owner balance should be 0", async function () {
    const actual = await contractInstance.balanceOf(OWNER);
    assert.equal(actual.valueOf(), 0, "Balance should be 0");
  });

  it("should mint 2000 tokens", async function () {
    await contractInstance.mint(2000);

    var balance = await contractInstance.balanceOf(OWNER);
    assert.equal(balance.valueOf(), 2000, "Balance should be 2000");
  });

  it("should burn 10 tokens", async function () {
    await contractInstance.mint(2000);
    await contractInstance.burn(10);
    const balance = await contractInstance.balanceOf(OWNER);
    assert.equal(balance, 1990, "Balance should be 1990");
  });

  it("should transfer 1337 tokens to alice", async function () {
    await contractInstance.mint(2000);
    await contractInstance.transfer(ALICE, 1337);

    let balance = await contractInstance.balanceOf(OWNER);
    assert.equal(balance, 663, "Balance should be 663");

    balance = await contractInstance.balanceOf(ALICE);
    assert.equal(balance, 1337, "Balance should be 1337");
  });

  it("owner should allow alice to transfer 100 tokens to bob", async function () {
    //account 0 (owner) approves alice
    await contractInstance.mint(2000);
    await contractInstance.transfer(ALICE, 1337);
    await contractInstance.approve(ALICE, 100);
    
    //account 0 (owner) now transfers from alice to bob
    await contractInstance.transferFrom(OWNER, BOB, 100, {from: ALICE});
    
    const balance = await contractInstance.balanceOf(BOB);
    assert.equal(balance, 100, "Balance should be 100");
  });
});