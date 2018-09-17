pragma solidity ^0.4.24;

import "./ERC20.sol";
import "./AUD.sol";

contract Exchange {

    ERC20 _aud;

    address private _owner;

    Trade[] public trades;

    struct Trade {
        uint256 amount; //water
        uint256 offer; //aud
        address owner;
        uint256 expires;
    }

    constructor () public {
        _owner = msg.sender;
        //_aud = AUD(aud);
    }
}