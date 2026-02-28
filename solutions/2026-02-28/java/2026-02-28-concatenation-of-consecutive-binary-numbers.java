```java
/**
 * Problem: Concatenation of Consecutive Binary Numbers
 * Link: https://leetcode.com/problems/concatenation-of-consecutive-binary-numbers
 *
 * Approach:
 * We can simulate the concatenation process by iterating from 1 to n. For each number `i`,
 * we need to determine its binary representation's length. This length dictates how many
 * bits we need to shift the current concatenated result to the left before adding the
 * binary representation of `i`.
 *
 * To find the number of bits in `i`, we can use `Integer.toBinaryString(i).length()`.
 * Alternatively, and more efficiently, we can find the highest power of 2 that is less than
 * or equal to `i`. The number of bits will be `floor(log2(i)) + 1`. A faster way to find
 * this is to observe that the number of bits increases only when `i` becomes a power of 2
 * (i.e., `i & (i-1) == 0`). For example, when going from 3 (binary "11", 2 bits) to 4
 * (binary "100", 3 bits), the bit length increases.
 *
 * We can maintain a running `result` and a `bitLength` representing the number of bits
 * currently in the `result`.
 * For each number `i` from 1 to `n`:
 * 1. If `i` is a power of 2 (i.e., `i & (i-1) == 0`), increment `bitLength`. This signifies
 *    that the next number will have one more bit in its binary representation.
 * 2. Shift the current `result` left by `bitLength` positions: `result = (result << bitLength) % MOD`.
 *    This makes space for the bits of `i`.
 * 3. Add the current number `i` to the shifted result: `result = (result + i) % MOD`.
 *
 * The modulo operation `10^9 + 7` should be applied at each step to prevent overflow.
 *
 * Time Complexity: O(n log n) in the worst case if we use `Integer.toBinaryString(i).length()`
 *                  for each `i`. However, by observing that the number of bits increases
 *                  only when `i` is a power of 2, we can achieve O(n) time complexity.
 *                  The `bitLength` variable will change at most log(n) times.
 * Space Complexity: O(1) as we only use a few variables to store the result and bit length.
 */
class Solution {
    public int concatenatedBinary(int n) {
        // Define the modulo value as per the problem statement
        long MOD = 1_000_000_007;
        // Variable to store the concatenated binary number's decimal value
        long result = 0;
        // Variable to store the current number of bits in the concatenated result
        // Initially, for n=1, the binary is "1", which has 1 bit.
        int bitLength = 0;

        // Iterate from 1 to n to process each number
        for (int i = 1; i <= n; i++) {
            // Check if `i` is a power of 2.
            // A number `i` is a power of 2 if `i > 0` and `(i & (i - 1)) == 0`.
            // This condition means that `i` has only one bit set to 1 in its binary representation.
            // When `i` is a power of 2, it means we are starting a new group of numbers
            // that will have an increased number of bits in their binary representation.
            // For example, transitioning from 3 (binary "11", 2 bits) to 4 (binary "100", 3 bits)
            // requires an increase in `bitLength`.
            if ((i & (i - 1)) == 0) {
                // Increment the bit length because the binary representation of `i` will have one more bit
                // than the binary representation of `i-1` (unless `i` is 1, which is handled by initial bitLength=0).
                bitLength++;
            }

            // Shift the current `result` to the left by `bitLength` positions.
            // This operation makes space for the binary representation of `i`.
            // For example, if `result` is 3 (binary "11") and `bitLength` is 3,
            // `result << bitLength` becomes `3 << 3` which is `0b11 << 3` = `0b11000` (decimal 24).
            // We apply the modulo operation at each step to prevent overflow.
            result = (result << bitLength) % MOD;

            // Add the current number `i` to the shifted `result`.
            // This effectively concatenates the binary representation of `i` to the end of `result`.
            // For example, if `result` is 24 (binary "11000") and `i` is 1 (binary "1"),
            // `result + i` becomes `24 + 1` = `25` (binary "11001").
            // Again, apply the modulo operation.
            result = (result + i) % MOD;
        }

        // Return the final concatenated binary value modulo 10^9 + 7
        return (int) result;
    }
}
```