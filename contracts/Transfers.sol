pragma solidity ^0.4.24;

contract Transfers {

    struct Transfer {
        address owner;
        bytes32 from;
        bytes32 to;
        bytes32 location;
        uint256 volume;
        uint256 price;
        uint256 time;
    }

    Transfer[] public transfers;

    mapping(bytes32 => Transfer) public transferMapping;

    function addTransfer(bytes32 _from, bytes32 _to, bytes32 _location, uint256 _volume, uint256 _price, uint256 _time) public {
        transfers.push(Transfer(msg.sender, _from, _to, _location, _volume, _price, _time));
    }

    function getTransfersLength() public view returns (uint256) {
        return transfers.length;
    }


    function getRecentTransfers(uint8 _numberOfRecords) public view returns (
        bytes32[],
        bytes32[], 
        bytes32[], 
        uint256[], 
        uint256[], 
        uint256[]
    ) {
        
        bytes32[] memory froms = new bytes32[](_numberOfRecords);
        bytes32[] memory tos = new bytes32[](_numberOfRecords);
        bytes32[] memory locations = new bytes32[](_numberOfRecords);
        uint256[] memory volumes = new uint256[](_numberOfRecords);
        uint256[] memory prices = new uint256[](_numberOfRecords);
        uint256[] memory times = new uint256[](_numberOfRecords);

        for(uint i = 0; i < _numberOfRecords; i++) {
            uint256 currentIndex = (transfers.length - i) - 1;
            froms[i] = transfers[currentIndex].from;
            tos[i] = transfers[currentIndex].to;
            locations[i] = transfers[currentIndex].location;
            volumes[i] = transfers[currentIndex].volume;
            prices[i] = transfers[currentIndex].price;
            times[i] = transfers[currentIndex].time;
        }

        return (froms, tos, locations, volumes, prices, times);
    }

}