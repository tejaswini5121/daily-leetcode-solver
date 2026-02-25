```cpp
// Sort an array of integers based on the count of set bits in their binary representation.
// If two numbers have the same number of set bits, sort them in ascending order.
// Link: https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits/
//
// Approach:
// We will use a custom comparator for sorting the array. The comparator will first
// count the number of set bits (1s) in the binary representation of two numbers.
// If the bit counts are different, the number with fewer set bits will come first.
// If the bit counts are the same, the numbers will be sorted in their natural
// ascending order.
//
// To count set bits efficiently, we can use the `__builtin_popcount()` function
// available in GCC and Clang, which is a built-in function for counting set bits.
// Alternatively, one could implement a manual bit counting loop.
//
// Time Complexity:
// O(N log N), where N is the number of elements in the array. This is due to
// the sorting algorithm used (typically `std::sort` in C++ which is O(N log N)).
// The custom comparator's operation (counting bits) takes constant time for each pair
// of numbers because the maximum value of `arr[i]` is 10^4, which fits within 14 bits,
// or `__builtin_popcount` is very efficient.
//
// Space Complexity:
// O(log N) or O(N) depending on the sorting implementation. `std::sort` typically
// uses O(log N) space for its recursive calls (for quicksort-like algorithms)
// or O(N) in the worst case if an algorithm like merge sort is used.
// The space for storing the input array is O(N).
#include <vector>
#include <algorithm>
#include <iostream>

class Solution {
public:
    std::vector<int> sortByBits(std::vector<int>& arr) {
        // Sort the array using a custom lambda function as the comparator.
        std::sort(arr.begin(), arr.end(), [](int a, int b) {
            // Count the number of set bits (1s) in the binary representation of 'a' and 'b'.
            // __builtin_popcount() is a GCC/Clang specific built-in function that efficiently
            // counts the number of set bits in an integer.
            int bits_a = __builtin_popcount(a);
            int bits_b = __builtin_popcount(b);

            // If the number of set bits are different, sort based on the bit count.
            // The number with fewer set bits comes first.
            if (bits_a != bits_b) {
                return bits_a < bits_b;
            } else {
                // If the number of set bits are the same, sort in ascending order of the numbers themselves.
                return a < b;
            }
        });
        // Return the sorted array.
        return arr;
    }
};

// Helper function to print a vector
void printVector(const std::vector<int>& vec) {
    for (int i = 0; i < vec.size(); ++i) {
        std::cout << vec[i] << (i == vec.size() - 1 ? "" : ",");
    }
    std::cout << std::endl;
}

// Main function to test the solution
int main() {
    Solution sol;

    // Example 1
    std::vector<int> arr1 = {0, 1, 2, 3, 4, 5, 6, 7, 8};
    std::cout << "Input arr1: ";
    printVector(arr1);
    std::vector<int> result1 = sol.sortByBits(arr1);
    std::cout << "Output arr1: [";
    printVector(result1);
    std::cout << "]" << std::endl; // Expected: [0,1,2,4,8,3,5,6,7]

    // Example 2
    std::vector<int> arr2 = {1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1};
    std::cout << "Input arr2: ";
    printVector(arr2);
    std::vector<int> result2 = sol.sortByBits(arr2);
    std::cout << "Output arr2: [";
    printVector(result2);
    std::cout << "]" << std::endl; // Expected: [1,2,4,8,16,32,64,128,256,512,1024]

    // Additional Test Case
    std::vector<int> arr3 = {100, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 0};
    std::cout << "Input arr3: ";
    printVector(arr3);
    std::vector<int> result3 = sol.sortByBits(arr3);
    std::cout << "Output arr3: [";
    printVector(result3);
    std::cout << "]" << std::endl; // Expected: [0,1,2,4,8,16,32,64,128,256,512,100] (100 = 1100100 binary, 3 bits)

    return 0;
}
```