// Problem: Binary Number with Alternating Bits
// Link: https://leetcode.com/problems/binary-number-with-alternating-bits/
//
// Approach:
// We can iterate through the bits of the number and check if adjacent bits are the same.
// We can get the last bit using the modulo operator (%) or the bitwise AND operator (& 1).
// We can then right-shift the number by 1 to process the next bit.
// We store the previous bit to compare with the current bit.
//
// Alternatively, a more concise bit manipulation approach:
// If a number has alternating bits, then `n` and `n >> 1` will have different bits at each position.
// Therefore, `n ^ (n >> 1)` will result in a number where all bits are 1s.
// For example, if n = 5 (binary 101):
// n >> 1 = 2 (binary 010)
// n ^ (n >> 1) = 101 ^ 010 = 111 (binary)
//
// Now, to check if `n ^ (n >> 1)` consists of all 1s, we can use the property that
// a number consisting of all 1s (like 7, 15, 31, etc.) minus 1 will be a power of 2 (or 0).
// Let `x = n ^ (n >> 1)`. If `x` is all 1s, then `x + 1` will be a power of 2.
// A number is a power of 2 if `(x_plus_1) & (x_plus_1 - 1)` is 0.
// So, if `(x + 1) & x == 0`, then `x` was a number with all bits set to 1.
//
// Time Complexity: O(log n) - The number of iterations is proportional to the number of bits in n, which is logarithmic with respect to n.
// Space Complexity: O(1) - We only use a few extra variables.

class Solution {
public:
    bool hasAlternatingBits(int n) {
        // Calculate n XOR (n right-shifted by 1).
        // If n has alternating bits, then n and n >> 1 will differ at every bit position.
        // The result of XOR will have all bits set to 1.
        // Example: n = 5 (101)
        // n >> 1 = 2 (010)
        // n ^ (n >> 1) = 101 ^ 010 = 111 (7)
        int x = n ^ (n >> 1);

        // Now, check if 'x' consists of all set bits.
        // A number that has all bits set to 1 (like 7, 15, 31, etc.) has the property
        // that when you add 1 to it, you get a power of 2.
        // A power of 2 (let's call it 'p') has the property that (p & (p - 1)) == 0.
        // So, if x has all bits set, then x + 1 is a power of 2.
        // Therefore, (x + 1) & x should be 0.
        //
        // Example: x = 7 (111)
        // x + 1 = 8 (1000)
        // (x + 1) & x = 1000 & 0111 = 0
        //
        // Example: If n = 6 (110)
        // n >> 1 = 3 (011)
        // n ^ (n >> 1) = 110 ^ 011 = 101 (5)
        // x = 5 (101)
        // x + 1 = 6 (110)
        // (x + 1) & x = 110 & 101 = 100 (4) != 0. So false.
        //
        // Note: The problem statement guarantees n is positive (1 <= n <= 2^31 - 1).
        // This means `x` will also be positive. The largest possible value for x would be
        // when n is `0xAAAAAAAA` (binary 101010...10), resulting in x being `0x55555555`
        // or when n is `0x55555555` (binary 010101...01), resulting in x being `0x55555555`.
        // In the case of alternating bits, x will be `0xFFFFFFFF` (if we consider 32 bits).
        // Adding 1 to `0xFFFFFFFF` would overflow, but in terms of bitwise operations,
        // it behaves like a power of 2 for the purpose of this check.
        // However, a simpler way to consider is that if x is all 1s, then `x & (x + 1)` will be 0.
        // This handles potential overflow implicitly by how bitwise operations work.
        return (x & (x + 1LL)) == 0; // Use 1LL for x+1 to ensure it's treated as unsigned long long in case of overflow if x is INT_MAX
    }
};
