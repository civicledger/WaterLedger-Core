pragma solidity ^0.4.23;

import "./ERC20.sol";
import "./Ownable.sol";
import "./SafeMath.sol";

contract AUD is ERC20, Ownable  {
    using SafeMath for uint;

    string public _name = "Water Ledger AUD";
    string public _symbol = "AUD";
    uint8 public _decimals = 2; //megalitres

    constructor(uint256 supply) public {
        _totalSupply = supply;
        _balances[msg.sender] = supply;
    }

    function mint(uint256 value) public onlyOwner returns(bool) {
        require(value > 0, "Amount must be greater than zero");

        _balances[owner()] = _balances[owner()].add(value);
        _totalSupply = _totalSupply.add(value);

        emit Minted(_totalSupply);

        return true;
    }

    function burn(uint256 value) public onlyOwner returns (bool) {
        require(value > 0, "Amount must be greater than zero");
        require(_totalSupply >= value, "Cannot burn more than you have");

        _balances[owner()] = _balances[owner()].sub(value);
        _totalSupply = _totalSupply.sub(value);

        emit Burned(_totalSupply);

        return true;
    }

    event Minted(uint256 value);
    event Burned(uint256 value);
}