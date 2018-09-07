pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./ERC20.sol";

contract Stats is Ownable {

    address private waterContract;
    address private audContract;

    uint256 private _volumeAvailable;
    uint256 private _todaysSales;

    uint256 public lastUpdated;

    constructor () public {
        waterContract = 0x0050e270e80c831e42af1979bfccb47d82c797fa52;
        audContract = 0x00259a416f7cea5ac72c547daf542c67a7d6459283;

        _volumeAvailable = 15970500;
        _todaysSales = 159705;
    }

    function getVolumeAvailable() public view returns(uint256) {
        return _volumeAvailable;
    }

    function getTodaysSales() public view returns(uint256) {
        return _todaysSales;
    }

    function getAverageBid() public pure returns(uint256) {
        return 0;
    }

    function getAverageAsk() public pure returns(uint256) {
        return 0;
    }

    function getLastBid() public pure returns(uint256) {
        return 0;
    }

    function getLastAsk() public pure returns(uint256) {
        return 0;
    }
}