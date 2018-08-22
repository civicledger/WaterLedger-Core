#!/bin/bash
set -u
set -e
geth --datadir ~/blockchain --rpc --rpccorsdomain "*" --rpcaddr "0.0.0.0" --rpcapi "eth,web3,personal,net,miner,admin,debug" --mine