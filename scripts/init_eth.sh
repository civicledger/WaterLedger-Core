#!/bin/bash
set -u
set -e

echo "[*] Cleaning up temporary data directories"
rm -rf ~/blockchain
mkdir -p ~/blockchain

echo "[*] Configuring node for private ETH"
mkdir -p ~/blockchain/keystore
cp ~/thin-layer/keys/*.json ~/blockchain/keystore
cp ~/thin-layer/src/genesis_eth.json ~/blockchain/keystore/genesis_eth.json

geth --datadir ~/blockchain init ~/blockchain/keystore/genesis_eth.json
