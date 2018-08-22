pid=$(lsof -i:8545 -t); kill -TERM $pid || kill -KILL $pid

../src/node_modules/.bin/ganache-cli -p 8545 "retreat kitten seek knife accuse pole guess lion hold vessel normal large"