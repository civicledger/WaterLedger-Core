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