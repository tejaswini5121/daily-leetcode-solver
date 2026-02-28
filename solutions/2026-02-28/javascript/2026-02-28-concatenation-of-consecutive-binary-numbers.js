/**
 * @param {number} n
 * @return {number}
 */
// Problem Summary: Concatenate binary representations of numbers from 1 to n and return the decimal value modulo 10^9 + 7.
// Link: https://leetcode.com/problems/concatenation-of-consecutive-binary-numbers/
// Approach:
// We can iterate from 1 to n. For each number `i`, we need to determine its binary representation and append it to our current result.
// Instead of building a huge binary string and then converting it, we can maintain the decimal value directly.
// For each number `i`, we need to know how many bits are in its binary representation. This determines how much we need to left-shift the current result before adding `i`.
// The number of bits in the binary representation of `i` can be found using `Math.floor(Math.log2(i)) + 1`.
// Alternatively, we can find the smallest power of 2 that is strictly greater than `i`. If `2^k > i`, then `i` has `k` bits. This is equivalent to finding `k` such that `2^(k-1) <= i < 2^k`.
// We can maintain a variable `currentLen` which stores the number of bits for the current block of numbers. When `i` becomes a power of 2 (e.g., 2, 4, 8, 16), we increment `currentLen`.
//
// Let `res` be the current concatenated decimal value.
// For each `i` from 1 to n:
// 1. Determine the number of bits `len` in the binary representation of `i`.
//    - This can be done by finding the smallest `k` such that `2^k > i`. `len = k`.
//    - We can track `len` by incrementing it whenever `i` is a power of 2.
// 2. Left-shift `res` by `len` bits: `res = (res << len) % MOD`.
// 3. Add `i` to `res`: `res = (res + i) % MOD`.
//
// Example walkthrough for n=3:
// MOD = 10^9 + 7
// res = 0
// currentLen = 0 (or 1 for the first number)
//
// i = 1:
//   Binary of 1 is "1". Length is 1.
//   If currentLen is not updated yet, it starts at 1.
//   res = (0 << 1) % MOD = 0
//   res = (0 + 1) % MOD = 1
//   currentLen becomes 1 (since 1 is the first number, it has 1 bit initially. Or we update currentLen when i is a power of 2).
//   A better way to track currentLen: start with 1. When `i` becomes a power of 2 (like 2, 4, 8...), increment `currentLen`.
//   Let's re-initialize: res = 0, currentLen = 1.
//
// i = 1:
//   `i` is 1. Binary is "1". `currentLen` is 1.
//   `res = (res << currentLen) % MOD` => `res = (0 << 1) % MOD = 0`
//   `res = (res + i) % MOD` => `res = (0 + 1) % MOD = 1`
//   Check if `i` is a power of 2: `(i & (i - 1)) == 0` is false for `i=1` if we consider 1 as a special case. Or if `i+1` is a power of 2.
//   A simpler way to update `currentLen`: if `i` is a power of 2, increment `currentLen`.
//   Check if `(i & (i - 1)) == 0` (for i > 0). For i=1, this is true. Let's say `currentLen` starts at 1, and we increment it when `i` reaches a power of two.
//   Let's refine the `currentLen` logic:
//   `currentLen` should represent the number of bits for the *current* `i`.
//   If `i` is 1, it has 1 bit. If `i` is 2, it has 2 bits. If `i` is 3, it has 2 bits. If `i` is 4, it has 3 bits.
//   The number of bits for `i` increases when `i` becomes a power of 2.
//   So, if `i` is 1, `bits = 1`.
//   If `i` is 2, `bits = 2`.
//   If `i` is 3, `bits = 2`.
//   If `i` is 4, `bits = 3`.
//   We can detect this by checking if `i` is a power of 2.
//   `i` is a power of 2 if `(i & (i - 1)) == 0` and `i > 0`.
//   Let's track `bits` for the current number `i`.
//
//   res = 0
//   MOD = 1000000007
//   bits = 0 // Number of bits for the current number `i`
//
//   i = 1:
//     Check if `i` is a power of 2. `(1 & 0) == 0`. Yes. Increment `bits`. `bits = 1`.
//     `res = (res << bits) % MOD` => `res = (0 << 1) % MOD = 0`
//     `res = (res + i) % MOD` => `res = (0 + 1) % MOD = 1`
//
//   i = 2:
//     Check if `i` is a power of 2. `(2 & 1) == 0`. Yes. Increment `bits`. `bits = 2`.
//     `res = (res << bits) % MOD` => `res = (1 << 2) % MOD = 4`
//     `res = (res + i) % MOD` => `res = (4 + 2) % MOD = 6`
//     Concatenation: "1" + "10" = "110". Decimal is 6. Correct.
//
//   i = 3:
//     Check if `i` is a power of 2. `(3 & 2) == 2`. No. `bits` remains 2.
//     `res = (res << bits) % MOD` => `res = (6 << 2) % MOD = 24`
//     `res = (res + i) % MOD` => `res = (24 + 3) % MOD = 27`
//     Concatenation: "110" + "11" = "11011". Decimal is 27. Correct.
//
// This approach seems correct.
//
// Time Complexity: O(n * log(n)) or O(n) depending on how bit length is calculated.
// If `Math.log2` or similar is used for each `i`, it's O(n * log(n)).
// If we maintain `bits` by checking for powers of 2, it's amortized O(n).
// The check `(i & (i - 1)) == 0` takes constant time.
// The left shift and addition also take constant time.
// So, the dominant factor is the loop from 1 to n. This makes it O(n).
//
// Space Complexity: O(1), as we only use a few variables to store the result and bit length.

const MOD = 1000000007;

var concatenatedBinary = function(n) {
    // Initialize the result to 0.
    let res = 0;
    // Initialize `bits` to 0. This variable will store the number of bits in the binary representation of the current number `i`.
    // We increment `bits` whenever `i` becomes a power of 2.
    let bits = 0;

    // Iterate from 1 to n.
    for (let i = 1; i <= n; i++) {
        // Check if `i` is a power of 2.
        // A number `i` is a power of 2 if `i > 0` and `(i & (i - 1))` is 0.
        // For example, if `i = 8` (binary `1000`), `i - 1 = 7` (binary `0111`). `i & (i - 1)` is `0000`.
        // If `i = 6` (binary `0110`), `i - 1 = 5` (binary `0101`). `i & (i - 1)` is `0100` (which is not 0).
        // This condition `(i & (i - 1)) === 0` will be true for i = 1, 2, 4, 8, 16, ...
        // When this condition is true, it means the number of bits required for the next sequence of numbers has increased.
        if ((i & (i - 1)) === 0) {
            // Increment `bits`. This means the current number `i` requires one more bit than the previous power of 2.
            // For example, 1 needs 1 bit. 2 needs 2 bits. 4 needs 3 bits. 8 needs 4 bits.
            bits++;
        }

        // Left-shift the current result `res` by `bits`.
        // This is equivalent to appending the binary representation of `i` to the right of the existing concatenated binary string.
        // For example, if `res` represents "1" (decimal 1) and `i` is 2 (binary "10"), `bits` will be 2.
        // `res << bits` becomes `1 << 2`, which is `100` in binary (decimal 4). This effectively shifts "1" to become "100".
        // We take the modulo `MOD` at each step to prevent overflow.
        res = (res << bits) % MOD;

        // Add the current number `i` to the shifted result.
        // Continuing the example: `res` is now 4. We add `i = 2`.
        // `res + i` becomes `4 + 2 = 6`. In binary, "100" + "10" becomes "10010". This is not correct.
        // The logic should be: `res` holds the decimal value of previous concatenations. When we consider `i`, we need to shift `res` to make space for `i`'s binary representation.
        // Let's re-trace `n=3`:
        // i = 1: bits=1. res = (0 << 1) % MOD = 0. res = (0 + 1) % MOD = 1. (Binary "1")
        // i = 2: bits becomes 2. res = (1 << 2) % MOD = 4. res = (4 + 2) % MOD = 6. (Binary "1" + "10" = "110". Decimal 6. Correct)
        // i = 3: bits remains 2. res = (6 << 2) % MOD = 24. res = (24 + 3) % MOD = 27. (Binary "110" + "11" = "11011". Decimal 27. Correct)
        // The logic `res = (res << bits) % MOD; res = (res + i) % MOD;` is correct. The left shift effectively appends `bits` number of zeros to the right of `res`, making space for the `i`'s binary representation which has `bits` length. Then `i` is added.
        res = (res + i) % MOD;
    }

    // Return the final concatenated decimal value modulo 10^9 + 7.
    return res;
};
```