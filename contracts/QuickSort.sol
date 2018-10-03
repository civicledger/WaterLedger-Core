pragma solidity ^0.4.24;

contract QuickSort {
    
    function sort(uint[] data) public pure returns(uint[]) {
        quickSort(data, int(0), int(data.length - 1));
        return data;
    }

    function sortWithIndex(uint[] data, uint[] indices) public pure returns(uint[], uint[]) {
        quickSortWithIndex(data, indices, int(0), int(data.length - 1));
        return (data, indices);
    }
    
    function quickSort(uint[] memory arr, int left, int right) internal pure {
        int i = left;
        int j = right;

        if(i==j) return;

        uint pivot = arr[uint(left + (right - left) / 2)];
        while (i <= j) {
            while (arr[uint(i)] < pivot) i++;
            while (pivot < arr[uint(j)]) j--;
            if (i <= j) {
                (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
                i++;
                j--;
            }
        }
    
        if (left < j)
            quickSort(arr, left, j);
        if (i < right)
            quickSort(arr, i, right);
    }

    function quickSortWithIndex(uint[] memory arr, uint[] memory indices, int left, int right) internal pure {
        int i = left;
        int j = right;

        if(i==j) return;

        uint pivot = arr[uint(left + (right - left) / 2)];
        while (i <= j) {
            while (arr[uint(i)] < pivot) i++;
            while (pivot < arr[uint(j)]) j--;
            if (i <= j) {
                (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
                (indices[uint(i)], indices[uint(j)]) = (indices[uint(j)], indices[uint(i)]);
                i++;
                j--;
            }
        }
    
        if (left < j)
            quickSortWithIndex(arr, indices, left, j);
        if (i < right)
            quickSortWithIndex(arr, indices, i, right);
    }
}