pragma solidity ^0.4.23;

import "./SafeMath.sol";

contract Water {
    using SafeMath for uint;

    address public owner;

    // Public variables of the token
    string public name = "Water Ledger Water";
    string public symbol = "CLW";
    uint8 public decimals = 12; //megalitres
    uint256 public totalSupply;

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;

    mapping (address => bool) allocators;

    constructor(uint256 _supply) public {
        totalSupply = _supply;
        owner = msg.sender;
        balances[owner] = _supply;
        allocators[owner] = true;
    }

    function balanceOf(address who) external view returns (uint256 balance) {
        balance = balances[who];
    }
    
    function transfer(address to, uint256 value) external returns (bool) {
        require(to != 0x0, "Cannot be address zero");
        require(balances[msg.sender].add(value) >= balances[msg.sender], "Balance is insufficient for this transfer");

        balances[msg.sender] = balances[msg.sender].sub(value);
        balances[to] = balances[to].add(value);
        emit Transfer(msg.sender, to, value);

        return true;
    }

    function allowance(address tokenOwner, address spender) external view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }

    function allocate(address _to, uint256 _amount) external {
        balances[owner] = balances[owner].sub(_amount);
        balances[_to] = balances[_to].add(_amount);
        emit Allocation(_to, _amount);
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool success) {
        require(to != 0x0, "Cannot be address zero");
        require(balances[from] >= value && allowed[from][msg.sender] >= value, "Balance is insufficient for this transfer");

        balances[from] = balances[from].sub(value);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
        balances[to] = balances[to].add(value);

        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        require(allowed[msg.sender][spender] == 0 || value == 0, "Value must not be zero");

        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function setAllocator(address _address) public onlyOwner {
        allocators[_address] = true;
    }

    function isAllocator() public view returns (bool) {
        return allocators[msg.sender];
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner of this contract may take that action");
        _;
    }

    event Allocation(address indexed owner, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);
}