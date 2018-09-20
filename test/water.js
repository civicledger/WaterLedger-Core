const Water = artifacts.require("Water");

contract("Water Contract", function(accounts) {

  var contractInstance;

  const OWNER = accounts[0];
  const ALICE = accounts[1];
  const BOB = accounts[2];
  const ALLOCATOR = accounts[9];

  const AMOUNT = 2000;

  beforeEach(async () => { contractInstance = await Water.new(AMOUNT) });

  describe("Instantiation and ERC-20 functionality", function(){

    describe("Initial supply", () => {
      it("total supply should be 2000", async function () {
        const actual = await contractInstance.totalSupply();
        assert.equal(actual, AMOUNT, `Total supply is not ${AMOUNT}`);
      });

      it("owner balance should be 2000", async function () {
        const actual = await contractInstance.balanceOf(OWNER);
        assert.equal(actual, AMOUNT, `Owner balance is not ${AMOUNT}`);
      });
    });

    describe("Transfers", () => {

      it("should transfer 1337 tokens to alice", async function () {
        await contractInstance.transfer(ALICE, 1337);

        let balance = await contractInstance.balanceOf(OWNER);
        assert.equal(balance, 663, "Balance should be 663");

        balance = await contractInstance.balanceOf(ALICE);
        assert.equal(balance, 1337, "Balance should be 1337");
      });

      it("owner should allow alice to transfer 100 tokens to bob", async function () {
        // account 0 (owner) approves alice
        await contractInstance.transfer(ALICE, 1337);
        await contractInstance.approve(ALICE, 100);

        //account 0 (owner) now transfers from alice to bob
        await contractInstance.transferFrom(OWNER, BOB, 100, {from: ALICE});

        const balance = await contractInstance.balanceOf(BOB);
        assert.equal(balance, 100, "Balance should be 100");
      });
    });
  });

  describe("Allocator setup", function(){

    it("should allow an owner to add an allocator", async () => {
      await contractInstance.setAllocator(ALLOCATOR);
      let isAllocator = await contractInstance.isAllocator({from: ALLOCATOR});

      assert(isAllocator, "Assigned address is not an allocator");
    });

    it("should not allow everyone to be an allocator", async () => {
      let isAllocator = await contractInstance.isAllocator({from: BOB});
      assert.isNotOk(isAllocator, "Assigned address should not be an allocator");
    });
  });

  describe("Allocations", function(){

    beforeEach(async () => await contractInstance.setAllocator(ALLOCATOR));

    it("should allow an owner to add an allocator", async () => {
      let isAllocator = await contractInstance.isAllocator({from: ALLOCATOR});

      assert(isAllocator, "Assigned address is not an allocator");
    });

    it("should allow allocation of water",  async () => {
      await contractInstance.allocate(ALICE, 123, {from: ALLOCATOR});
      const balance = await contractInstance.balanceOf(ALICE);
      const ownerBalance = await contractInstance.balanceOf(OWNER);
      assert.equal(balance, 123, "Balance should be 123");
      assert.equal(ownerBalance, 1877, "Owner Balance should be reduced to 1877");
    });



  });

});