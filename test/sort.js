var QuickSort = artifacts.require("QuickSort");

contract('QuickSort', function(accounts) {

  var instance;

  beforeEach(async function() {
    instance = await QuickSort.new();
  });

  it("should sort array of ints", async function() {

    let data = [2, 4, 1, 5, 3, 6];

    var actual = await instance.sort(data);

    assert.equal(actual[0], 1, "Should be 1");
    assert.equal(actual[1], 2, "Should be 2");
    assert.equal(actual[2], 3, "Should be 3");
    assert.equal(actual[3], 4, "Should be 4");
    assert.equal(actual[4], 5, "Should be 5");
    assert.equal(actual[5], 6, "Should be 6");
  });

  it("should sort array of ints by index", async function() {

    let indexes = [0, 1, 2, 3, 4, 5];
    let data = [2, 4, 1, 5, 3, 6];

    var actual = await instance.sortWithIndex(data, indexes);

    assert.equal(actual[0], 2, "Should be index 2");
    assert.equal(actual[1], 0, "Should be index 0");
    assert.equal(actual[2], 4, "Should be index 0");
  });
});