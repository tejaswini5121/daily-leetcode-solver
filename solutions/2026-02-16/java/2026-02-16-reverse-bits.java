// Problem: Reverse Bits
// Summary: Reverses the bits of a given 32-bit unsigned integer.
// Link: https://leetcode.com/problems/reverse-bits/
//
// Approach:
// We can iterate 32 times (for each bit of a 32-bit integer). In each iteration:
// 1. We extract the least significant bit (LSB) of the input integer `n` using the bitwise AND operator (`n & 1`).
// 2. We shift the `result` to the left by one position (`result <<= 1`) to make space for the new bit.
// 3. We then set the LSB of `result` to the extracted bit from `n` using the bitwise OR operator (`result |= lsb`).
// 4. We shift `n` to the right by one position (`n >>>= 1`) to process the next bit. The unsigned right shift `>>>` is crucial here to handle potential sign bit issues if we were dealing with signed integers directly in a way that might propagate the sign bit. For unsigned interpretations, it's cleaner.
//
// Follow-up Optimization:
// For repeated calls, precomputing a lookup table for reversing bytes (8 bits) can significantly speed up the process.
// A 256-entry table can store the reversed bits for each possible byte value.
// Then, we can reverse the 32-bit integer by reversing each of its four bytes and combining them in reverse order.
// For example, if `n` is `b3 b2 b1 b0` (where `b` represents bytes), the reversed number would be `rev(b0) rev(b1) rev(b2) rev(b3)`.
//
// Time Complexity:
// For the basic approach: O(1) because the number of bits (32) is constant.
// For the optimized approach with a lookup table: O(1) as well, as each byte lookup and combination is constant time.
//
// Space Complexity:
// For the basic approach: O(1).
// For the optimized approach with a lookup table: O(1) because the lookup table size (256 entries) is constant.

class Solution {
    /**
     * Reverses the bits of a given 32-bit unsigned integer.
     *
     * @param n The 32-bit unsigned integer to reverse.
     * @return The integer with its bits reversed.
     */
    public int reverseBits(int n) {
        // Initialize the result to 0. This will store the reversed bits.
        int result = 0;

        // Iterate 32 times, once for each bit of a 32-bit integer.
        for (int i = 0; i < 32; i++) {
            // 1. Extract the least significant bit (LSB) of n.
            // (n & 1) will be 1 if the LSB of n is 1, and 0 otherwise.
            int lsb = n & 1;

            // 2. Shift the current result one position to the left.
            // This makes space for the new bit to be added at the LSB position of the result.
            result <<= 1;

            // 3. Set the LSB of the result to the extracted bit.
            // The bitwise OR operation adds the extracted bit (lsb) to the LSB of the shifted result.
            result |= lsb;

            // 4. Shift n one position to the right.
            // The unsigned right shift operator (>>>) ensures that the sign bit is not propagated,
            // which is important for treating n as an unsigned 32-bit integer.
            // This moves the next bit of n to the LSB position for the next iteration.
            n >>>= 1;
        }

        // After iterating through all 32 bits, the result will hold the reversed bits of the original n.
        return result;
    }
}
