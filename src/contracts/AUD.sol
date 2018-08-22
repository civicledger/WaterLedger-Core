pragma solidity ^0.4.23;

import "./ERC20.sol";
import "./Ownable.sol";
import "./SafeMath.sol";

contract AUD is Ownable, ERC20 {
    using SafeMath for uint;

    // Public variables of the token
    string public name = "AUD";
    string public symbol = "AUD";
    uint8 public decimals = 3;
    uint256 public totalSupply;

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;

    constructor() public {
        owner = msg.sender;
        balances[owner] = 100000000;
        totalSupply = balances[owner];
    }

    function balanceOf(address who) external view returns (uint256 balance) {
        balance = balances[who];
    }
    
    function transfer(address to, uint256 value) external returns (bool) {
        require(to != 0x0);
        require(balances[msg.sender].add(value) >= balances[msg.sender]);

        balances[msg.sender] = balances[msg.sender].sub(value);
        balances[to] = balances[to].add(value);
        emit Transfer(msg.sender, to, value);

        return true;
    }

    function allowance(address tokenOwner, address spender) external view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool success) {
        require(to != address(0));
        require(balances[from] >= value && allowed[from][msg.sender] >= value);

        balances[from] = balances[from].sub(value);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(value);
        balances[to] = balances[to].add(value);

        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        require(allowed[msg.sender][spender] == 0 || value == 0);

        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);
}