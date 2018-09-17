const assemble = (structure, dataArrays) => {
  if(structure.length !== dataArrays.length) {
    throw Error("The structure and data do not match");
  }


  return dataArrays[0].map((data, index) => {
    let newObject = {};
    structure.forEach((field, innerIndex) => {
      let fieldRowValue = dataArrays[innerIndex][index];
      newObject[field.name] = field.type === 'bytes32' ? web3.utils.hexToUtf8(fieldRowValue) : Number(fieldRowValue);
    })
    return newObject;
  });
}

module.exports = { assemble }