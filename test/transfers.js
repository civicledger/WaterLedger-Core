var Transfers = artifacts.require("Transfers");
let AssembleStruct = require('./helpers/AssembleStruct');

//let mockData = require('../migrations/transactions.json');

contract('Transfers', function(accounts) {

  var contractInstance;

  const structDefinition = [
    {name: 'from', type: 'bytes32'}, 
    {name: 'to', type: 'bytes32'}, 
    {name: 'location', type: 'bytes32'}, 
    {name: 'volume', type: 'uint'}, 
    {name: 'price', type: 'uint'},
    {name: 'time', type: 'uint'}
  ];

  beforeEach(async () => {
    contractInstance = await Transfers.new();
  });

  it("should have an empty list of transfers", async () => {
    let transferCount = await contractInstance.getTransfersLength();
    assert.equal(Number(transferCount), 0, 'Transfer list should be empty');
  });

  it("should allow adding a transfer", async () => {
    await addFiveTransfers(contractInstance, web3);
    let transferCount = await contractInstance.getTransfersLength();
    assert.equal(Number(transferCount), 5, 'Transfer list should have five entries');
  });

  it("should allow getting three most recent", async () => {
    await addFiveTransfers(contractInstance, web3);

    let transferData = await contractInstance.getRecentTransfers(3);
    
    let fixedData = AssembleStruct.assemble(structDefinition, Object.values(transferData));

    assert.equal(fixedData[0].from, 'yz1', 'Incorrect "from" record found');
    assert.equal(fixedData[0].to, 'aa1', 'Incorrect "to" record found');
    assert.equal(fixedData[0].location, 'Perth, WA', 'Incorrect "location" record found');
    assert.equal(fixedData[2].from, 'mno', 'Incorrect "from" record found');
    assert.equal(fixedData[2].to, 'pqr', 'Incorrect "to" record found');
    assert.equal(fixedData[2].location, 'Melbourne, VIC', 'Incorrect "location" record found');
  });

});


async function addFiveTransfers(contractInstance, web3) {
  await contractInstance.addTransfer(web3.utils.asciiToHex("abc"),  web3.utils.asciiToHex("def"), web3.utils.asciiToHex("Brisbane, QLD"),  123,  500, 1536896368);
  await contractInstance.addTransfer(web3.utils.asciiToHex("ghi"),  web3.utils.asciiToHex("jkl"), web3.utils.asciiToHex("Sydney, NSW"),  124,  400, 1536896368);
  await contractInstance.addTransfer(web3.utils.asciiToHex("mno"),  web3.utils.asciiToHex("pqr"), web3.utils.asciiToHex("Melbourne, VIC"),  223,  500, 1536896368);
  await contractInstance.addTransfer(web3.utils.asciiToHex("stu"),  web3.utils.asciiToHex("vwx"), web3.utils.asciiToHex("Adelaide, SA"),  225,  400, 1536896368);
  await contractInstance.addTransfer(web3.utils.asciiToHex("63e838ebc644a71b581ef172958f675c2873f9b9"), web3.utils.asciiToHex("aa1"),  web3.utils.asciiToHex("Perth, WA"),  334,  500, 1536896368);
}

