// LeetCode Problem: Prime Number of Set Bits in Binary Representation
// Link: https://leetcode.com/problems/prime-number-of-set-bits-in-binary-representation/
//
// Problem Summary:
// Count numbers in a given range [left, right] where the count of set bits
// in their binary representation is a prime number.
//
// Approach:
// 1. Iterate through each number from 'left' to 'right'.
// 2. For each number, calculate the count of set bits in its binary representation.
//    This can be done efficiently using bitwise operations or by converting to a string.
// 3. Check if the calculated set bit count is a prime number.
//    Since the maximum possible number of set bits for numbers up to 10^6 is relatively small
//    (log2(10^6) is approximately 19.9, so at most 20 bits), we can pre-compute or
//    hardcode a list of small prime numbers.
// 4. If the set bit count is prime, increment a counter.
// 5. Return the final counter.
//
// For checking primality of the set bit count, the maximum number of set bits for a number
// up to 10^6 (which is less than 2^20) is 20. The prime numbers up to 20 are 2, 3, 5, 7, 11, 13, 17, 19.
// We can use a Set for efficient O(1) lookup of these primes.
//
// Time Complexity Analysis:
// Let N be the range (right - left + 1).
// For each number in the range, we count set bits.
// Counting set bits for a number 'x' takes O(log x) time.
// Checking if a number is prime (from our small pre-defined set) takes O(1) time.
// So, the total time complexity is O(N * log(max_right)).
// Given right <= 10^6, log(max_right) is a small constant (around 20).
// Thus, effectively O(N).
//
// Space Complexity Analysis:
// We use a Set to store prime numbers, which has a constant size (8 primes).
// Therefore, the space complexity is O(1).

/**
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
var countPrimeSetBits = function(left, right) {
    // Pre-compute a set of prime numbers up to a reasonable limit.
    // The maximum number of bits for numbers up to 10^6 is less than 20.
    // So, we only need primes up to 20.
    const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19]);

    let primeSetBitsCount = 0;

    // Iterate through each number in the given range [left, right]
    for (let i = left; i <= right; i++) {
        // Calculate the number of set bits (1s) in the binary representation of 'i'.
        // Method 1: Using toString(2) and counting '1's
        // const binaryString = i.toString(2);
        // let setBits = 0;
        // for (let j = 0; j < binaryString.length; j++) {
        //     if (binaryString[j] === '1') {
        //         setBits++;
        //     }
        // }

        // Method 2: Using bitwise operations (more efficient)
        let currentNum = i;
        let setBits = 0;
        while (currentNum > 0) {
            // If the last bit is 1, increment setBits.
            // (currentNum & 1) checks if the least significant bit is 1.
            setBits += (currentNum & 1);
            // Right shift the number by 1 to check the next bit.
            // This is equivalent to integer division by 2.
            currentNum >>= 1;
        }

        // Check if the calculated number of set bits is present in our set of primes.
        if (primes.has(setBits)) {
            primeSetBitsCount++;
        }
    }

    // Return the total count of numbers with a prime number of set bits.
    return primeSetBitsCount;
};
```