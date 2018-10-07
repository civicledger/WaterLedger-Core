pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./Water.sol";
import "./Stats.sol";
import "./Stats.sol";
import "./AUD.sol";
import "./IERC20.sol";

contract OrderBook {

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
    address private _owner;

    constructor (address statsContract, address waterContract, address audContract) public {
        _aud = AUD(audContract);
        _stats = Stats(statsContract);
        _water = Water(waterContract);
        _owner = msg.sender;
    }

    function getStatsParent() public view returns (address) {
        return _stats._parentContract();
    }

    function addSellLimitOrder(uint256 price, uint256 quantity) public {
        require(quantity > 0 && price > 0, "Values must be greater than 0");
        require(_water.balanceOf(msg.sender) >= quantity, "Insufficient water allocation");

        _asks.push(Order(OrderType.Ask, msg.sender, price, quantity, now));
        _stats.updateVolumeAvailable(quantity);
        _water.orderBookTransfer(msg.sender, price);

        emit OrderAdded(msg.sender);
    }

    function addBuyLimitOrder(uint256 price, uint256 quantity) public {
        require(quantity > 0 && price > 0, "Values must be greater than 0");
        require(_aud.balanceOf(msg.sender) >= quantity, "Insufficient AUD allocation");

        _offers.push(Order(OrderType.Offer, msg.sender, price, quantity, now));
        _aud.orderBookTransfer(msg.sender, price);

        emit OrderAdded(msg.sender);
    }

    function getOrderBook() public view returns (
        OrderType[],
        address[],
        uint256[],
        uint256[],
        uint256[]
    ) {
        uint256 totalLength = _asks.length + _offers.length;

        OrderType[] memory orderTypes = new OrderType[](totalLength);
        address[] memory owners = new address[](totalLength);
        uint256[] memory prices = new uint256[](totalLength);
        uint256[] memory quantities = new uint256[](totalLength);
        uint256[] memory timeStamps = new uint256[](totalLength);

        for(uint256 i = 0; i < _asks.length; i++) {
            orderTypes[i] = _asks[i].orderType;
            owners[i] = _asks[i].owner;
            prices[i] = _asks[i].price;
            quantities[i] = _asks[i].quantity;
            timeStamps[i] = _asks[i].timeStamp;
        }

        for(uint256 j = 0; j < _offers.length; j++) {
            orderTypes[_asks.length + j] = _offers[j].orderType;
            owners[_asks.length + j] = _offers[j].owner;
            prices[_asks.length + j] = _offers[j].price;
            quantities[_asks.length + j] = _offers[j].quantity;
            timeStamps[_asks.length + j] = _offers[i].timeStamp;
        }

        return (orderTypes, owners, prices, quantities, timeStamps);
    }

    function getOrderBookAsks(uint256 numberOfOrders) public view returns (
        OrderType[],
        address[],
        uint256[],
        uint256[],
        uint256[]
    ) {

        uint256 max = _asks.length < numberOfOrders ? _asks.length : numberOfOrders;

        if (max > 10) {
            max = 10;
        }

        OrderType[] memory orderTypes = new OrderType[](max);
        address[] memory owners = new address[](max);
        uint256[] memory prices = new uint256[](max);
        uint256[] memory quantities = new uint256[](max);
        uint256[] memory timeStamps = new uint256[](max);

        for(uint256 i = 0; i < _asks.length; i++) {
            orderTypes[i] = _asks[i].orderType;
            owners[i] = _asks[i].owner;
            prices[i] = _asks[i].price;
            quantities[i] = _asks[i].quantity;
            timeStamps[i] = _asks[i].timeStamp;
        }

        return (orderTypes, owners, prices, quantities, timeStamps);
    }

    function getOrderBookOffers(uint256 numberOfOrders) public view returns (
        OrderType[],
        address[],
        uint256[],
        uint256[],
        uint256[]
    ) {

        uint256 max = _offers.length < numberOfOrders ? _offers.length : numberOfOrders;

        if (max > 10) {
            max = 10;
        }

        OrderType[] memory orderTypes = new OrderType[](max);
        address[] memory owners = new address[](max);
        uint256[] memory prices = new uint256[](max);
        uint256[] memory quantities = new uint256[](max);
        uint256[] memory timeStamps = new uint256[](max);

        for(uint256 i = 0; i < _offers.length; i++) {
            orderTypes[i] = _offers[i].orderType;
            owners[i] = _offers[i].owner;
            prices[i] = _offers[i].price;
            quantities[i] = _offers[i].quantity;
            timeStamps[i] = _offers[i].timeStamp;
        }

        return (orderTypes, owners, prices, quantities, timeStamps);
    }

    event OrderAdded(address _stats);
}