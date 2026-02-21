```java
// Problem: Prime Number of Set Bits in Binary Representation
// Link: https://leetcode.com/problems/prime-number-of-set-bits-in-binary-representation/
// Approach:
// We need to iterate through each number from 'left' to 'right' (inclusive).
// For each number, we count the number of set bits (1s) in its binary representation.
// Then, we check if this count of set bits is a prime number.
// If it is prime, we increment a counter.
//
// To count set bits efficiently, we can use the Brian Kernighan's algorithm
// or the built-in Integer.bitCount() method.
//
// To check for primality, since the maximum possible number of set bits for
// numbers up to 10^6 is relatively small (for 10^6, the binary representation
// is approximately 20 bits long, so the maximum set bits is 20), we can precompute
// or hardcode a list of small prime numbers. The primes up to 20 are: 2, 3, 5, 7, 11, 13, 17, 19.
//
// Time Complexity:
// Let N be the range (right - left + 1).
// For each number in the range, we count its set bits. This takes O(log K) time,
// where K is the maximum value of 'right' (10^6). The `Integer.bitCount()` method
// is typically very efficient, often O(1) or O(log K) depending on implementation.
// Checking if the count is prime takes constant time since the number of set bits is bounded.
// Therefore, the overall time complexity is O(N * log K).
// Given the constraints (N <= 10^4, K <= 10^6), this is efficient enough.
//
// Space Complexity:
// We use a constant amount of extra space to store the primes and the counter.
// Thus, the space complexity is O(1).
class Solution {
    public int countPrimeSetBits(int left, int right) {
        // A set to store prime numbers up to a reasonable limit.
        // The maximum number of bits for 10^6 is 20 (2^19 < 10^6 < 2^20).
        // So, the maximum possible count of set bits is 20.
        // The primes less than or equal to 20 are 2, 3, 5, 7, 11, 13, 17, 19.
        Set<Integer> primes = new HashSet<>(Arrays.asList(2, 3, 5, 7, 11, 13, 17, 19));

        int primeSetBitsCount = 0; // Initialize the counter for numbers with prime set bits

        // Iterate through each number in the inclusive range [left, right]
        for (int i = left; i <= right; i++) {
            // Count the number of set bits (1s) in the binary representation of 'i'
            // Integer.bitCount(i) is a highly optimized method for this.
            int setBits = Integer.bitCount(i);

            // Check if the count of set bits is a prime number
            if (primes.contains(setBits)) {
                // If the setBits count is prime, increment our main counter
                primeSetBitsCount++;
            }
        }

        // Return the total count of numbers in the range that have a prime number of set bits
        return primeSetBitsCount;
    }
}
```