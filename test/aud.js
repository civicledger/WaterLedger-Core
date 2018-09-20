const Token = artifacts.require("AUD");

contract("AUD", function(accounts) {

  const OWNER = accounts[0];
  const ALICE = accounts[1];
  const BOB = accounts[2];

  before(async function () {
      this.token = await Token.new({from: OWNER});
  });

  it("total supply should be 0", async function () {
    const actual = await this.token.totalSupply();
    assert.equal(actual.valueOf(), 0, "Total supply should be 0");
  });

  it("owner balance should be 0", async function () {
    const actual = await this.token.balanceOf(OWNER);
    assert.equal(actual.valueOf(), 0, "Balance should be 0");
  });

  it("should mint 2000 tokens", async function () {
    const actual = await this.token.mint(2000);
    let balance = await this.token.balanceOf(OWNER);
    assert.equal(balance.valueOf(), 2000, "Balance should be 2000");
  });

  it("should burn 10 tokens", async function () {
    const actual = await this.token.burn(10);

    let balance = await this.token.balanceOf(OWNER);
    assert.equal(balance.valueOf(), 1990, "Balance should be 1990");
  });

  it("should transfer 1337 tokens to alice", async function () {
    await this.token.transfer(ALICE, 1337);

    let actual = await this.token.balanceOf(OWNER);
    assert.equal(actual.valueOf(), 653, "Balance should be 653");

    actual = await this.token.balanceOf(ALICE);
    assert.equal(actual.valueOf(), 1337, "Balance should be 1337");
  });

  it("owner should allow alice to transfer 100 tokens to bob", async function () {
    //account 0 (owner) approves alice
    await this.token.approve(ALICE, 100);
    
    //account 0 (owner) now transfers from alice to bob
    await this.token.transferFrom(OWNER, BOB, 100, {from: ALICE});
    let actual = await this.token.balanceOf(BOB);
    assert.equal(actual.valueOf(), 100, "Balance should be 100");
  });
});