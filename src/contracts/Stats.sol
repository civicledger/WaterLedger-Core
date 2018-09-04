pragma solidity ^0.4.24;

contract Stats {
    
    constructor () public {

    }

    function getVolumeAvailable() public pure returns(uint256) {
        return 15970500;
    }

    function getTodaysSales() public pure returns(uint256) {
        return 159705;
    }
}