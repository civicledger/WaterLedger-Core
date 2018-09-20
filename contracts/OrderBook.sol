pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./Water.sol";
import "./Stats.sol";
import "./Stats.sol";
import "./AUD.sol";

contract OrderBook {
    Water public _water;
    Stats public _stats;
    AUD public _aud;

    struct Order {
        address owner;
        uint256 quantity;
        uint256 price;
    }

    Order[] public _asks;
    Order[] public _offers;

    constructor (address statsContract, address waterContract, address audContract) public {
        _stats = Stats(statsContract);
        _water = Water(waterContract);
        _aud = AUD(audContract);
    }

    function getStatsParent() public view returns (address) {
        return _stats._parentContract();
    }

    function addSellLimitOrder(uint256 price, uint256 quantity) public {
        require(quantity > 0 && price > 0, "Values must be greater than 0");
        require(_water.balanceOf(msg.sender) >= quantity, "Insufficient water allocation");

        _asks.push(Order(msg.sender, quantity, price));
        _stats.updateVolumeAvailable(quantity);

        emit OrderAdded(msg.sender);
    }

    function addBuyLimitOrder(uint256 price, uint256 quantity) public {
        require(quantity > 0 && price > 0, "Values must be greater than 0");
        require(_aud.balanceOf(msg.sender) >= quantity, "Insufficient AUD allocation");

        _offers.push(Order(msg.sender, quantity, price));
        //_stats.updateVolumeAvailable(quantity);

        emit OrderAdded(msg.sender);
    }

    event OrderAdded(address _stats);
}