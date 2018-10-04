pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./Water.sol";
import "./Stats.sol";
import "./Stats.sol";
import "./AUD.sol";
import "./IERC20.sol";
import "./QuickSort.sol";

contract OrderBook is QuickSort {

    IERC20 public _water;
    IERC20 public _aud;
    Stats public _stats;

    enum OrderType { Ask, Offer }

    struct Order {
        OrderType orderType;
        address owner;
        uint256 price;
        uint256 quantity;
        uint256 timeStamp;
    }

    Order[] public _asks;
    Order[] public _offers;

    constructor (address statsContract, address waterContract, address audContract) public {
        _aud = AUD(audContract);
        _stats = Stats(statsContract);
        _water = Water(waterContract);
    }

    function getStatsParent() public view returns (address) {
        return _stats._parentContract();
    }

    function addSellLimitOrder(uint256 price, uint256 quantity) public {
        require(quantity > 0 && price > 0, "Values must be greater than 0");
        require(_water.balanceOf(msg.sender) >= quantity, "Insufficient water allocation");

        _asks.push(Order(OrderType.Ask, msg.sender, price, quantity, now));
        _stats.updateVolumeAvailable(quantity);

        emit OrderAdded(msg.sender);
    }

    function addBuyLimitOrder(uint256 price, uint256 quantity) public {
        require(quantity > 0 && price > 0, "Values must be greater than 0");
        require(_aud.balanceOf(msg.sender) >= quantity, "Insufficient AUD allocation");

        _offers.push(Order(OrderType.Offer, msg.sender, price, quantity, now));

        emit OrderAdded(msg.sender);
    }

    function getOrderBook() public view returns (
        OrderType[],
        address[],
        uint256[],
        uint256[],
        uint256[]
    ) {
        uint256 totalOrderCount = _asks.length + _offers.length;

        OrderType[] memory offerTypes = new OrderType[](totalOrderCount);
        address[] memory owners = new address[](totalOrderCount);
        uint256[] memory prices = new uint256[](totalOrderCount);
        uint256[] memory quantities = new uint256[](totalOrderCount);
        uint256[] memory timeStamps = new uint256[](totalOrderCount);

        for(uint256 i = 0; i < _asks.length; i++) {
            offerTypes[i] = _asks[i].orderType;
            owners[i] = _asks[i].owner;
            prices[i] = _asks[i].price;
            quantities[i] = _asks[i].quantity;
            timeStamps[i] = _asks[i].timeStamp;
        }

        for(uint256 j = 0; j < _offers.length; j++) {
            offerTypes[_asks.length + j] = _offers[j].orderType;
            owners[_asks.length + j] = _offers[j].owner;
            prices[_asks.length + j] = _offers[j].price;
            quantities[_asks.length + j] = _offers[j].quantity;
            timeStamps[_asks.length + j] = _offers[i].timeStamp;
        }

        return (offerTypes, owners, prices, quantities, timeStamps);
    }

    function getPriceTimeOrders() public view returns(uint256[]) {
        uint256[] memory prices = new uint256[](_asks.length);
        uint256[] memory indexes = new uint256[](_asks.length);

        for (uint i = 0; i < _asks.length; i++) {
            prices[i] = _asks[i].price;
            indexes[i] = i;
        }

        uint256[] memory sortedIndexes = sortWithIndex(prices, indexes);
        return sortedIndexes;
    }

    event OrderAdded(address _stats);
}