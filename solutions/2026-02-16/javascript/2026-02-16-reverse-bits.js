/**
 * @summary Reverses the bits of a given 32-bit unsigned integer.
 * @link https://leetcode.com/problems/reverse-bits/
 *
 * Approach:
 * We can iterate through the 32 bits of the input integer. In each iteration,
 * we extract the least significant bit (LSB) of the input number using the
 * bitwise AND operator (`& 1`). We then shift the result left by one position
 * to make space for the next bit. The extracted LSB is then added to the
 * reversed number, which is also shifted left by one position in each iteration.
 * The input number is right-shifted by one position in each iteration to process
 * the next bit.
 *
 * For the follow-up optimization:
 * If the function is called many times, pre-computation can be used.
 * We can pre-compute the reversed bits for smaller chunks (e.g., 8 bits).
 * Then, we can reverse the 32-bit integer by reversing each 8-bit chunk and
 * combining them in the reversed order. This would involve looking up the
 * reversed value of each byte in a pre-computed table.
 *
 * Time Complexity: O(1) - Since we always iterate through a fixed number of bits (32).
 * Space Complexity: O(1) - We only use a few variables for storage.
 */

/**
 * @param {number} n - A 32-bit unsigned integer.
 * @return {number} - The integer with its bits reversed.
 */
var reverseBits = function(n) {
    // Initialize the reversed number to 0.
    let reversedN = 0;

    // Iterate 32 times for each bit of the 32-bit integer.
    for (let i = 0; i < 32; i++) {
        // Extract the least significant bit (LSB) of n.
        // n & 1 will be 1 if the LSB is 1, and 0 if the LSB is 0.
        const lsb = n & 1;

        // Shift the reversed number to the left by one position.
        // This makes space for the next bit to be added.
        reversedN <<= 1;

        // Add the extracted LSB to the reversed number.
        reversedN |= lsb;

        // Right-shift n by one position to process the next bit.
        n >>>= 1; // Use unsigned right shift to handle potential sign bits correctly for intermediate values if n were signed.
    }

    // Return the integer with its bits reversed.
    // The result needs to be treated as an unsigned 32-bit integer, which
    // JavaScript handles automatically for bitwise operations that result
    // in a 32-bit signed integer. However, for the specific problem of
    // reversing bits of an unsigned integer, the operations naturally produce
    // the correct unsigned representation.
    return reversedN >>> 0; // Ensure the result is treated as an unsigned 32-bit integer.
};
```