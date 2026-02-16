// Problem Summary: Reverse the bits of a 32-bit unsigned integer.
// Link: https://leetcode.com/problems/reverse-bits/
//
// Approach:
// We can reverse the bits of a 32-bit integer by iterating 32 times.
// In each iteration, we take the least significant bit (LSB) of the input number
// and append it to the result. To append the LSB to the result, we left-shift
// the result by 1 and then OR it with the current LSB.
// After extracting the LSB, we right-shift the input number by 1 to process
// the next bit.
//
// For the follow-up question (optimization for multiple calls):
// We can precompute the reversed bits for each byte (0-255) and store them in
// a lookup table. Then, to reverse a 32-bit integer, we can break it into
// four bytes, reverse each byte using the lookup table, and then combine them
// in the reversed order. This would reduce the time complexity for each call
// to O(1) after an initial O(256) precomputation.
//
// Time Complexity:
// O(1) - since we always iterate 32 times, which is a constant.
//
// Space Complexity:
// O(1) - we only use a few variables to store the result and loop counters.
// For the follow-up, the space complexity would be O(256) for the lookup table.

#include <cstdint> // For uint32_t

class Solution {
public:
    uint32_t reverseBits(uint32_t n) {
        uint32_t reversed_n = 0; // Initialize the reversed number to 0

        // Iterate 32 times for each bit of the 32-bit integer
        for (int i = 0; i < 32; ++i) {
            // 1. Left shift the current reversed_n by 1. This makes space for the next bit.
            //    For example, if reversed_n is 0010, left shifting makes it 0100.
            reversed_n <<= 1;

            // 2. Get the least significant bit (LSB) of the input number 'n'.
            //    We do this by performing a bitwise AND with 1.
            //    If the LSB of 'n' is 1, (n & 1) will be 1. Otherwise, it will be 0.
            uint32_t lsb = n & 1;

            // 3. OR the reversed_n with the extracted LSB.
            //    This appends the LSB of 'n' to the rightmost position of reversed_n.
            //    If lsb is 1, it sets the last bit of reversed_n to 1.
            //    If lsb is 0, it keeps the last bit of reversed_n as 0.
            reversed_n |= lsb;

            // 4. Right shift the input number 'n' by 1.
            //    This discards the LSB that we just processed and moves the next bit to the LSB position.
            //    For example, if n is 0011100, right shifting makes it 0001110.
            n >>= 1;
        }

        // After 32 iterations, reversed_n will contain the bits of 'n' in reverse order.
        return reversed_n;
    }
};
