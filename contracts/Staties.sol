pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Staties {

    using SafeMath for uint;

    uint256 public _volumeAvailable;
    uint256 public _inTransitAmount;
    uint256 public _yesterdayAverageBid;
    uint256 public _yesterdayMinBid;
    uint256 public _yesterdayMaxBid;

    address public _parentContract;


}