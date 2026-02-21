// Problem: Prime Number of Set Bits in Binary Representation
// Link: https://leetcode.com/problems/prime-number-of-set-bits-in-binary-representation/
//
// Approach:
// Iterate through each number in the given range [left, right]. For each number,
// count the number of set bits (1s) in its binary representation. Then, check
// if this count of set bits is a prime number. If it is prime, increment a counter.
// Finally, return the total count.
//
// To efficiently check for primality of the set bit count, we can pre-compute
// a set of prime numbers up to a reasonable limit. Since the maximum value of
// 'right' is 10^6, the maximum number of set bits for any number less than or equal to
// 10^6 is relatively small. 2^20 is approximately 10^6, so at most 20 bits are needed.
// Thus, the maximum possible number of set bits is 20. We only need to check for
// primality for numbers up to 20. The prime numbers in this range are 2, 3, 5, 7, 11, 13, 17, 19.
// We can store these in a set for O(1) lookup.
//
// To count set bits in a number, we can use the built-in `__builtin_popcount()` function
// in C++ which is highly optimized. Alternatively, we can use a loop: repeatedly
// check the least significant bit using `n & 1` and then right shift `n >>= 1`
// until `n` becomes 0.
//
// Time Complexity:
// O((right - left + 1) * log(max_val)), where max_val is the maximum possible value
// of a number in the range (10^6 in this case). If using `__builtin_popcount`,
// the popcount operation is typically O(1) or O(number of bits), making the
// overall complexity closer to O(right - left + 1).
//
// Space Complexity:
// O(1) because we only use a constant amount of extra space for storing primes and the counter.
// If we pre-compute primes up to a certain limit, the space is still constant.

#include <iostream>
#include <vector>
#include <cmath>
#include <unordered_set>

class Solution {
public:
    // Function to count set bits in a number
    // This is a helper function, but __builtin_popcount is generally preferred for performance.
    /*
    int countSetBits(int n) {
        int count = 0;
        while (n > 0) {
            n &= (n - 1); // Brian Kernighan's algorithm to unset the least significant bit
            count++;
        }
        return count;
    }
    */

    int countPrimeSetBits(int left, int right) {
        // Pre-define prime numbers up to 20 (maximum possible set bits for numbers up to 10^6)
        // 2^10 = 1024, 2^20 = 1048576. So max bits is 20.
        std::unordered_set<int> primes = {2, 3, 5, 7, 11, 13, 17, 19};

        int primeSetBitsCount = 0; // Counter for numbers with prime set bits

        // Iterate through the range [left, right]
        for (int i = left; i <= right; ++i) {
            // Count the number of set bits for the current number 'i'
            // __builtin_popcount is a GCC/Clang extension for counting set bits, highly optimized.
            int setBits = __builtin_popcount(i);

            // Check if the count of set bits is present in our set of primes
            if (primes.count(setBits)) {
                primeSetBitsCount++; // Increment counter if it's a prime number of set bits
            }
        }

        return primeSetBitsCount; // Return the total count of such numbers
    }
};

/*
// Example Usage:
int main() {
    Solution sol;

    // Example 1
    int left1 = 6, right1 = 10;
    std::cout << "Input: left = " << left1 << ", right = " << right1 << std::endl;
    std::cout << "Output: " << sol.countPrimeSetBits(left1, right1) << std::endl; // Expected: 4

    // Example 2
    int left2 = 10, right2 = 15;
    std::cout << "Input: left = " << left2 << ", right = " << right2 << std::endl;
    std::cout << "Output: " << sol.countPrimeSetBits(left2, right2) << std::endl; // Expected: 5

    return 0;
}
*/
