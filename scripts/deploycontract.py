## NO LONGER REQUIRED
## Note, requires pip install json-rpc
## pip install 'jsonrpcclient[requests]'
## pip install ethjsonrpc

import json
import web3

from web3 import Web3, HTTPProvider, TestRPCProvider

node_url = '127.0.0.1' # Test RPC
#node_url = 'https://infura.io/...' # Rinkeby node

# web3.py instance
w3 = Web3(TestRPCProvider())

# Instantiate and deploy contract
contract = w3.eth.contract(abi=contract_interface['abi'], bytecode=contract_interface['bin'])

# Get transaction hash from deployed contract
tx_hash = contract.deploy(transaction={'from': w3.eth.accounts[0], 'gas': 410000})

print()
print(tx_hash)