// Problem: Binary Number with Alternating Bits
// Link: https://leetcode.com/problems/binary-number-with-alternating-bits/
//
// Approach:
// We can iterate through the bits of the number from right to left.
// We keep track of the last bit seen. For each subsequent bit, we compare it
// with the last bit. If they are the same, the number does not have alternating bits.
// If they are different, we update the last bit and continue.
//
// Alternatively, a more concise bit manipulation approach can be used:
// 1. Right shift the number by 1: `n >> 1`. This effectively moves all bits one position to the right.
// 2. XOR the original number with the right-shifted number: `n ^ (n >> 1)`.
//    If the bits were alternating, this operation will result in a number where all bits are 1s.
//    For example, if n = 5 (binary 101):
//    n >> 1 = 2 (binary 010)
//    n ^ (n >> 1) = 101 ^ 010 = 111 (binary 7)
//    If n = 7 (binary 111):
//    n >> 1 = 3 (binary 011)
//    n ^ (n >> 1) = 111 ^ 011 = 100 (binary 4)
// 3. Check if the result of the XOR operation has all bits set to 1.
//    A number has all bits set to 1 if and only if it is of the form `2^k - 1` for some integer k.
//    This can be checked by seeing if `(result + 1) & result` is 0.
//    If `result` has all bits set to 1 (e.g., 111), then `result + 1` will have a single bit set to 1 followed by all zeros (e.g., 1000).
//    The bitwise AND of these two will be 0.
//    If `result` has any zero bits in between (e.g., 100), then `result + 1` (e.g., 101) and `result` (e.g., 100) when ANDed will not be 0.
//
// Time Complexity: O(1) - The operations are constant time, regardless of the size of the integer (within its fixed bit representation).
// Space Complexity: O(1) - We only use a few variables.
/**
 * @param {number} n
 * @return {boolean}
 */
var hasAlternatingBits = function(n) {
    // Perform bitwise XOR between n and n right-shifted by 1.
    // If bits are alternating, this results in a number with all bits set to 1.
    // For example:
    // n = 5 (binary 101)
    // n >> 1 = 2 (binary 010)
    // n ^ (n >> 1) = 101 ^ 010 = 111 (binary 7)
    //
    // n = 7 (binary 111)
    // n >> 1 = 3 (binary 011)
    // n ^ (n >> 1) = 111 ^ 011 = 100 (binary 4)
    let xorResult = n ^ (n >> 1);

    // Check if the xorResult has all bits set to 1.
    // A number with all bits set to 1 (like 111) when incremented becomes a power of 2 (like 1000).
    // The bitwise AND of (xorResult + 1) and xorResult will be 0 if and only if
    // xorResult has all bits set to 1.
    // Example:
    // xorResult = 7 (binary 111)
    // xorResult + 1 = 8 (binary 1000)
    // (xorResult + 1) & xorResult = 1000 & 111 = 0
    //
    // xorResult = 4 (binary 100)
    // xorResult + 1 = 5 (binary 101)
    // (xorResult + 1) & xorResult = 101 & 100 = 100 (non-zero)
    return (xorResult + 1) & xorResult === 0;
};
```