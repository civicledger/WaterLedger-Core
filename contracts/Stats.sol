pragma solidity ^0.4.24;

contract Stats {

    address public owner;
    uint256 public volumeAvailable;
    uint256 public inTransitAmount;
    uint256 public yesterdayAverageBid;
    uint256 public yesterdayMinBid;
    uint256 public yesterdayMaxBid;

    event StatsChanged();

    constructor(uint256 _volume, uint256 _inTransit, uint256 _avg, uint256 _min, uint256 _max) public {
        owner = msg.sender;
        volumeAvailable = _volume;
        inTransitAmount = _inTransit;
        yesterdayAverageBid = _avg;
        yesterdayMinBid = _min;
        yesterdayMaxBid = _max;
    }

    function setVolumeAvailable(uint _volume) public {
        require(msg.sender == owner, "Only owner can set volume");
        require(_volume > 0, "Volume must be greater than zero");
        volumeAvailable = _volume;
        emit StatsChanged();
    }

    function setInTransitAmount(uint _inTransit) public {
        require(msg.sender == owner, "Only owner can change stats");
        inTransitAmount = _inTransit;
        emit StatsChanged();
    }

    function setStats(
        uint256 _volume, 
        uint256 _inTransit, 
        uint256 _avg, 
        uint256 _min, 
        uint256 _max
    ) public {
        require(msg.sender == owner, "Only owner can change stats");
        volumeAvailable = _volume;
        inTransitAmount = _inTransit;
        yesterdayAverageBid = _avg;
        yesterdayMinBid = _min;
        yesterdayMaxBid = _max;
    }

    function getAllStats() public view returns (
        uint256 volume, 
        uint256 inTransit, 
        uint256 avg, 
        uint256 min, 
        uint256 max
    ) {
        return (volumeAvailable, inTransitAmount, yesterdayAverageBid, yesterdayMinBid, yesterdayMaxBid);
    }
}