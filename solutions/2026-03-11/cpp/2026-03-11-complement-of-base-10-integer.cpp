// Problem: Complement of Base 10 Integer
// Link: https://leetcode.com/problems/complement-of-base-10-integer/
// Approach:
// The core idea is to find a bitmask that has the same number of bits as the input integer 'n'
// and all those bits are set to 1. For example, if n = 5 (binary "101"), the mask would be 7 (binary "111").
// If n = 10 (binary "1010"), the mask would be 15 (binary "1111").
// Once we have this mask, the complement of 'n' can be obtained by XORing 'n' with the mask.
// This is because XORing with 1 flips the bit, and XORing with 0 leaves it unchanged. Since our mask
// only has bits set up to the most significant bit of 'n', XORing 'n' with it will effectively flip
// all the bits of 'n' up to its most significant bit.
//
// To find the mask:
// We can iterate through powers of 2 until we find a power of 2 that is greater than 'n'.
// Subtracting 1 from this power of 2 will give us the desired mask.
// For example, if n = 5:
// - 1 (2^0) is not > 5
// - 2 (2^1) is not > 5
// - 4 (2^2) is not > 5
// - 8 (2^3) is > 5. So, the mask is 8 - 1 = 7 (binary "111").
//
// Special case: If n is 0, its binary representation is "0". The complement is "1", which is 1 in base 10.
// The general approach above might not handle n=0 correctly if not careful with loop conditions.
// A simpler way for the mask is to find the smallest power of 2 that is strictly greater than n.
// Example: n = 5 (101). Smallest power of 2 > 5 is 8 (1000). Mask is 8-1 = 7 (111).
// Complement = 5 ^ 7 = 101 ^ 111 = 010 = 2.
//
// Example: n = 10 (1010). Smallest power of 2 > 10 is 16 (10000). Mask is 16-1 = 15 (1111).
// Complement = 10 ^ 15 = 1010 ^ 1111 = 0101 = 5.
//
// Time Complexity: O(log n) - The loop to find the mask iterates up to the number of bits in 'n',
// which is logarithmic with respect to 'n'.
// Space Complexity: O(1) - We only use a few variables to store the mask and intermediate values.

class Solution {
public:
    int findComplement(int n) {
        // Handle the edge case where n is 0.
        // The binary representation of 0 is "0". Its complement is "1", which is 1 in base-10.
        if (n == 0) {
            return 1;
        }

        // We need to create a bitmask that has the same number of bits as 'n'
        // and all those bits are set to 1.
        // For example, if n = 5 (binary "101"), we need a mask of 7 (binary "111").
        // If n = 10 (binary "1010"), we need a mask of 15 (binary "1111").

        // Initialize 'mask' to 1. This will be used to build the bitmask.
        // We start with 1 (binary "1") and will left-shift it to create larger powers of 2.
        unsigned int mask = 1;

        // Loop to find the smallest power of 2 that is strictly greater than 'n'.
        // 'mask' will hold successive powers of 2: 1, 2, 4, 8, ...
        // The loop continues as long as 'mask' is less than or equal to 'n'.
        // We use 'unsigned int' for 'mask' to avoid potential issues with signed integer overflow
        // if 'n' is close to the maximum value of an int, though problem constraints (n < 10^9)
        // make this less critical for standard 32-bit integers.
        while (mask <= n) {
            // Left shift 'mask' by 1. This is equivalent to multiplying 'mask' by 2.
            // e.g., if mask was 1 (001), it becomes 2 (010). If it was 2 (010), it becomes 4 (100).
            mask <<= 1;
        }

        // At this point, 'mask' is the smallest power of 2 that is strictly greater than 'n'.
        // For example, if n = 5 (binary "101"), the loop stops when mask becomes 8 (binary "1000").
        // If n = 10 (binary "1010"), the loop stops when mask becomes 16 (binary "10000").

        // To get our desired bitmask (all 1s up to the most significant bit of n),
        // we subtract 1 from this power of 2.
        // For example:
        // If mask = 8 (binary "1000"), then mask - 1 = 7 (binary "0111").
        // If mask = 16 (binary "10000"), then mask - 1 = 15 (binary "01111").
        // This 'mask' now has 1s in all bit positions up to and including the most significant bit of 'n'.
        mask -= 1;

        // The complement of 'n' can be found by XORing 'n' with this 'mask'.
        // XORing a bit with 1 flips the bit. XORing a bit with 0 leaves it unchanged.
        // Since our mask has 1s in all relevant positions, this operation effectively flips
        // all the bits of 'n' up to its most significant bit.
        // Example: n = 5 (binary "101"), mask = 7 (binary "111").
        //   101 (n)
        // ^ 111 (mask)
        // -----
        //   010 (result, which is 2 in base-10)
        //
        // Example: n = 10 (binary "1010"), mask = 15 (binary "1111").
        //   1010 (n)
        // ^ 1111 (mask)
        // ------
        //   0101 (result, which is 5 in base-10)
        return n ^ mask;
    }
};
