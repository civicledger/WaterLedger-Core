pragma solidity ^0.4.23;

import "./SafeMath.sol";
import "./ERC20.sol";
import "./Ownable.sol";

contract Water is ERC20, Ownable {
    using SafeMath for uint;

    // Public variables of the token
    string public _name = "Water Ledger Water";
    string public _symbol = "CLW";
    uint8 public _decimals = 12; //megalitres

    address public _orderBook;

    mapping (address => bool) _allocators;

    constructor(uint256 supply) public {
        _totalSupply = supply;
        _balances[msg.sender] = supply;
        _allocators[msg.sender] = true;
    }

    function allocate(address to, uint256 amount) external {
        _balances[owner()] = _balances[owner()].sub(amount);
        _balances[to] = _balances[to].add(amount);
        emit Allocation(to, amount);
    }

    function setAllocator(address _address) public onlyOwner {
        _allocators[_address] = true;
    }

    function isAllocator() public view returns (bool) {
        return _allocators[msg.sender];
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

    event Allocation(address indexed to, uint256 value);
    event Approval(address indexed to, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);
}