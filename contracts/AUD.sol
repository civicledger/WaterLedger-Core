pragma solidity ^0.4.23;

import "./ERC20.sol";
import "./Ownable.sol";
import "./SafeMath.sol";

contract AUD is ERC20, Ownable  {
    using SafeMath for uint;

    string public _name = "Water Ledger AUD";
    string public _symbol = "AUD";
    uint8 public _decimals = 2; //megalitres

    address public _orderBook;

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

    function setOrderBook(address orderBook) public onlyOwner {
        _orderBook = orderBook;
    }

    function orderBookTransfer(address from, uint256 value) external returns (bool) {
        require(address(_orderBook) != address(0), "Orderbook must be set to make this transfer");
        require(_orderBook == msg.sender, "Only the orderbook can make this transfer");

        _balances[from] = _balances[from].sub(value);
        _balances[owner()] = _balances[owner()].add(value);

        emit Transfer(from, owner(), value);
        return true;
    }

    event Minted(uint256 value);
    event Burned(uint256 value);
}