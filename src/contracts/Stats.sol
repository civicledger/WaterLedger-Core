pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./ERC20.sol";

contract Stats {

    address private waterContract;
    address private audContract;

    constructor () public {
        waterContract = 0x0050e270e80c831e42af1979bfccb47d82c797fa52;
        audContract = 0x00259a416f7cea5ac72c547daf542c67a7d6459283;
    }

    function getVolumeAvailable() public pure returns(uint256) {
        return 15970500;
    }

    function getTodaysSales() public pure returns(uint256) {
        return 159705;
    }
}