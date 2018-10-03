var QuickSort = artifacts.require("QuickSort");

contract('QuickSort', function(accounts) {

  var instance;

  beforeEach(async function() {
    instance = await QuickSort.new();
  });

  it.skip("should sort array of ints", async function() {

    let data = [2, 4, 1, 5, 3, 6];

    var actual = await instance.sort(data);

    console.log(actual);
  });

  it.only("should sort array of ints", async function() {

    let indexes = [0, 1, 2, 3, 4, 5];
    let data = [2, 4, 1, 5, 3, 6];

    var actual = await instance.sortWithIndex(data, indexes);

    console.log(actual);
  });
});