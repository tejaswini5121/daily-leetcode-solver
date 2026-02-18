// Problem Summary: Check if a positive integer's binary representation has alternating bits.
// Link: https://leetcode.com/problems/binary-number-with-alternating-bits/
// Approach:
// We can iterate through the bits of the number. For each bit, we compare it with the next bit.
// If any adjacent bits are the same, the number does not have alternating bits.
// We can extract the least significant bit using the modulo operator (%) or bitwise AND (&) with 1.
// We can then shift the number to the right by 1 bit (>>) to examine the next bit.
// An alternative, more efficient approach involves bit manipulation.
// If a number has alternating bits, then `n ^ (n >> 1)` will result in a number where all bits are 1.
// For example, if n = 5 (binary 101), n >> 1 = 2 (binary 010).
// n ^ (n >> 1) = 101 ^ 010 = 111.
// Then, we can check if this result is of the form 2^k - 1 (all ones).
// A number of the form 2^k - 1 has the property that `x & (x + 1)` is 0.
// For example, if x = 7 (binary 111), x + 1 = 8 (binary 1000).
// x & (x + 1) = 111 & 1000 = 0.
// Time Complexity: O(log n) or O(1) depending on how you count bit operations. The loop or bitwise operations take a number of steps proportional to the number of bits in n, which is log n. However, since the input is bounded by 2^31 - 1, it's effectively a constant number of operations (e.g., 32 bits).
// Space Complexity: O(1) as we only use a few variables.

class Solution {
    public boolean hasAlternatingBits(int n) {
        // This approach uses bitwise operations for efficiency.
        // If n has alternating bits, then n ^ (n >> 1) will produce a number
        // where all bits are set to 1.
        // For example:
        // n = 5 (binary 101)
        // n >> 1 = 2 (binary 010)
        // n ^ (n >> 1) = 101 ^ 010 = 111 (decimal 7)

        // n = 7 (binary 111)
        // n >> 1 = 3 (binary 011)
        // n ^ (n >> 1) = 111 ^ 011 = 100 (decimal 4)

        int x = n ^ (n >> 1);

        // Now, we need to check if 'x' is a number with all bits set to 1.
        // A number with all bits set to 1 (e.g., 1, 3, 7, 15, ... which are 2^k - 1)
        // has the property that (x & (x + 1)) == 0.
        // For example:
        // If x = 7 (binary 111)
        // x + 1 = 8 (binary 1000)
        // x & (x + 1) = 111 & 1000 = 0

        // If x = 4 (binary 100)
        // x + 1 = 5 (binary 101)
        // x & (x + 1) = 100 & 101 = 100 (not 0)

        // So, if (x & (x + 1)) is 0, it means 'x' had all bits set to 1, which implies
        // the original number 'n' had alternating bits.
        // Note: For x = 0, (x & (x + 1)) is 0. However, n must be positive, so x will not be 0 if n has alternating bits.
        // For example, if n=1 (binary 1), n>>1 = 0, x = 1^0 = 1. x+1=2 (10). 1&2 = 0. This works.
        return (x & (x + 1)) == 0;

        /*
        // Alternative iterative approach:
        // Get the last bit of n
        int lastBit = n & 1;
        // Right shift n to examine the next bit
        n >>= 1;

        // Iterate while n is greater than 0
        while (n > 0) {
            // Get the current last bit
            int currentBit = n & 1;
            // If the current bit is the same as the last bit, they are not alternating
            if (currentBit == lastBit) {
                return false; // Adjacent bits are the same, so not alternating
            }
            // Update lastBit to the current bit for the next comparison
            lastBit = currentBit;
            // Right shift n again to move to the next bit
            n >>= 1;
        }
        // If the loop completes without finding adjacent same bits, then bits are alternating
        return true;
        */
    }
}
