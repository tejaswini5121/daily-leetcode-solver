```cpp
// Problem: Concatenation of Consecutive Binary Numbers
// Link: https://leetcode.com/problems/concatenation-of-consecutive-binary-numbers
//
// Approach:
// We can iterate from 1 to n. For each number `i`, we need to find its binary
// representation and append it to our growing binary string.
// However, constructing a large string and then converting it to a decimal
// will be inefficient and may lead to overflow.
//
// Instead, we can maintain a running decimal value. For each number `i`,
// we determine the number of bits required for its binary representation.
// Let's say `i` requires `k` bits. Then, to append the binary representation
// of `i` to the current decimal value `res`, we shift `res` left by `k`
// bits (effectively multiplying by 2^k) and then add `i`.
//
// To find `k` (the number of bits for `i`), we can use `log2(i)` or
// find the most significant bit. A simple way is to keep shifting `i`
// right until it becomes 0, counting the shifts. Or, more efficiently,
// we can observe that the number of bits for `i` increases only when `i`
// is a power of 2. We can track the number of bits needed and update it.
// For example, numbers 1-1 require 1 bit. Numbers 2-3 require 2 bits.
// Numbers 4-7 require 3 bits, and so on.
//
// We need to perform all calculations modulo 10^9 + 7 to prevent overflow.
//
// Time Complexity: O(n * log n) because for each number from 1 to n, we perform
// bitwise operations which take logarithmic time with respect to the number itself.
// More precisely, it's O(n * B) where B is the maximum number of bits for n,
// which is log(n).
//
// Space Complexity: O(1) as we are only using a few variables to store the result
// and intermediate calculations.
//

class Solution {
public:
    int concatenatedBinary(int n) {
        long long res = 0; // Stores the concatenated decimal value
        int MOD = 1e9 + 7; // The modulo value
        int num_bits = 0;  // Tracks the number of bits needed for the current number

        for (int i = 1; i <= n; ++i) {
            // If 'i' is a power of 2, it means we are starting a new block of
            // binary numbers that will require one more bit than the previous block.
            // For example, when i=2 (binary "10"), we need 2 bits. When i=4 (binary "100"),
            // we need 3 bits.
            // We can detect a power of 2 by checking if (i & (i - 1)) == 0.
            if ((i & (i - 1)) == 0) {
                num_bits++; // Increment the number of bits required
            }

            // Append the binary representation of 'i' to the result.
            // To do this, we first shift the current result 'res' to the left
            // by 'num_bits'. This effectively makes space for the new binary
            // representation of 'i'.
            // Then, we add 'i' to the shifted result.
            // All operations are performed modulo MOD.
            res = (res << num_bits) % MOD; // Shift left by num_bits and take modulo
            res = (res + i) % MOD;         // Add 'i' and take modulo
        }

        return (int)res; // Cast the final result back to int
    }
};
```