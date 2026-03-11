// Summary: Calculates the bitwise complement of a base-10 integer by flipping its binary digits.
// Link: https://leetcode.com/problems/complement-of-base-10-integer/
// Approach:
// 1. Find a bitmask that has all 1s up to the most significant bit of n.
//    We can do this by finding the smallest power of 2 that is greater than n, and then subtracting 1.
//    For example, if n = 5 (binary 101), the smallest power of 2 greater than 5 is 8 (binary 1000).
//    8 - 1 = 7 (binary 111). This bitmask covers all the relevant bits.
// 2. XOR the original number n with this bitmask. This will flip all the bits of n up to the most significant bit.
//    For example, 5 (101) XOR 7 (111) = 2 (010).
// Time Complexity: O(log n) because finding the bitmask involves iterating through the bits of n, which is logarithmic to the value of n.
// Space Complexity: O(1) as we only use a few variables.
/**
 * @param {number} n
 * @return {number}
 */
var bitwiseComplement = function(n) {
    // Handle the edge case where n is 0.
    // The binary representation of 0 is "0", and its complement is "1", which is 1.
    if (n === 0) {
        return 1;
    }

    // Initialize a variable to find the smallest power of 2 that is greater than n.
    // We can also think of this as finding a mask of all 1s up to the most significant bit of n.
    let mask = 1;

    // Keep multiplying mask by 2 (left shifting) until it is greater than n.
    // This effectively creates a number with a single '1' bit at the position
    // just beyond the most significant bit of n.
    // For example, if n = 5 (101), mask will become 8 (1000).
    while (mask <= n) {
        mask <<= 1; // Equivalent to mask = mask * 2
    }

    // Now, subtract 1 from the mask. This creates a bitmask where all bits
    // from the least significant bit up to the most significant bit of n are set to 1.
    // For example, if mask was 8 (1000), mask - 1 becomes 7 (0111).
    // This bitmask will be used to flip the bits of n.
    mask -= 1;

    // Perform a bitwise XOR operation between n and the mask.
    // XORing with 1 flips a bit (0 becomes 1, 1 becomes 0).
    // XORing with 0 leaves a bit unchanged.
    // Since our mask has 1s up to the most significant bit of n, this operation
    // effectively flips only the relevant bits of n.
    // For example, if n = 5 (101) and mask = 7 (111):
    //   101 (n)
    // ^ 111 (mask)
    // -----
    //   010 (result is 2)
    return n ^ mask;
};
```