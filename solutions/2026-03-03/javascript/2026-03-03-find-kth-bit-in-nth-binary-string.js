// /**
//  * @param {number} n
//  * @param {number} k
//  * @return {character}
//  */
// /*
// Problem: Find Kth Bit in Nth Binary String
// Difficulty: Medium
// Topics: String, Recursion, Simulation
// Link: https://leetcode.com/problems/find-kth-bit-in-nth-binary-string/

// Problem Summary:
// This problem involves generating a sequence of binary strings based on a recursive formula and then finding the kth bit of the nth string.

// Approach:
// The core idea is to recognize the recursive structure of the string generation and leverage it to find the kth bit without explicitly generating the entire string, which can become very large.

// Let's analyze the structure of Si:
// Si = Si-1 + "1" + reverse(invert(Si-1))

// Let L(i) be the length of Si.
// L(1) = 1
// L(i) = L(i-1) + 1 + L(i-1) = 2 * L(i-1) + 1

// This length follows the pattern 2^i - 1.
// L(1) = 2^1 - 1 = 1
// L(2) = 2*1 + 1 = 3.  2^2 - 1 = 3
// L(3) = 2*3 + 1 = 7.  2^3 - 1 = 7
// L(4) = 2*7 + 1 = 15. 2^4 - 1 = 15

// We can define a recursive function, say `findKthBit(n, k)`, which returns the kth bit of Sn.

// Base Case:
// If n = 1, S1 = "0". So, if n = 1, return '0'.

// Recursive Step:
// For n > 1, we consider the structure of Sn: Sn = Sn-1 + "1" + reverse(invert(Sn-1)).
// The length of Sn-1 is L(n-1) = 2^(n-1) - 1.

// There are three parts in Sn:
// 1. The first part is Sn-1, which occupies indices 1 to L(n-1).
// 2. The middle part is "1", which is at index L(n-1) + 1.
// 3. The third part is reverse(invert(Sn-1)), which occupies indices L(n-1) + 2 to L(n).

// Now, let's determine where the kth bit falls:

// Case 1: k is in the first part (1 <= k <= L(n-1))
// If k is within the length of Sn-1, the kth bit of Sn is the same as the kth bit of Sn-1.
// So, we recursively call `findKthBit(n-1, k)`.

// Case 2: k is the middle bit (k = L(n-1) + 1)
// The middle bit is always "1".
// So, if k = 2^(n-1), return '1'. (Since L(n-1) = 2^(n-1) - 1, the middle index is 2^(n-1) - 1 + 1 = 2^(n-1)).

// Case 3: k is in the third part (L(n-1) + 2 <= k <= L(n))
// This part is `reverse(invert(Sn-1))`.
// Let's analyze its relation to Sn-1.
// The indices in this part are from L(n-1) + 2 to 2 * L(n-1) + 1.
// If we consider the bits in reverse(invert(Sn-1)) from left to right, the first bit of this section corresponds to the *last* bit of Sn-1, inverted.
// The second bit of this section corresponds to the *second to last* bit of Sn-1, inverted, and so on.

// Let's map the index `k` in Sn to an index in Sn-1.
// The index `k` in Sn corresponds to an index in reverse(invert(Sn-1)).
// The length of reverse(invert(Sn-1)) is L(n-1).
// The position of `k` within this third part is `k - (L(n-1) + 1)`. Let this be `offset_in_third_part`.
// The index in Sn-1 that this bit comes from is `L(n-1) - offset_in_third_part + 1`.
// Let's verify:
// If k = L(n-1) + 2 (the first bit of the third part), then offset_in_third_part = 1.
// The corresponding index in Sn-1 should be L(n-1).
// Formula: L(n-1) - 1 + 1 = L(n-1). Correct.

// If k = L(n) (the last bit of the third part), then offset_in_third_part = L(n) - (L(n-1) + 1) = (2*L(n-1) + 1) - (L(n-1) + 1) = L(n-1).
// The corresponding index in Sn-1 should be 1.
// Formula: L(n-1) - L(n-1) + 1 = 1. Correct.

// So, the index in Sn-1 is `idx_in_sn_minus_1 = L(n-1) - (k - (L(n-1) + 1))`.
// Simplifying: `idx_in_sn_minus_1 = L(n-1) - k + L(n-1) + 1 = 2 * L(n-1) + 1 - k`.
// This simplifies to `idx_in_sn_minus_1 = L(n) - k + 1`.
// Let's recheck:
// k = L(n-1) + 2 => idx = L(n) - (L(n-1) + 2) + 1 = 2*L(n-1) + 1 - L(n-1) - 2 + 1 = L(n-1). Correct.
// k = L(n) => idx = L(n) - L(n) + 1 = 1. Correct.

// So, if k is in the third part, we need to find the `(L(n) - k + 1)`th bit of Sn-1.
// Let `new_k = L(n) - k + 1`.
// We find `bit = findKthBit(n-1, new_k)`.
// Since this bit is from `invert(Sn-1)`, we need to invert it.
// If `bit` is '0', return '1'. If `bit` is '1', return '0'.

// Let's use the actual lengths for calculation.
// Length of Sn-1 is `len_sn_minus_1 = (1 << (n - 1)) - 1`.
// The middle index is `mid_index = len_sn_minus_1 + 1 = (1 << (n - 1))`.

// Function signature: `solve(n, k)`

// `solve(n, k)`:
//   if n == 1: return '0'

//   `len_sn_minus_1 = (1 << (n - 1)) - 1`
//   `mid_index = len_sn_minus_1 + 1` // which is (1 << (n - 1))

//   if k < mid_index:
//     // k is in the first part (Sn-1)
//     return solve(n - 1, k)
//   elif k == mid_index:
//     // k is the middle bit
//     return '1'
//   else: // k > mid_index
//     // k is in the third part (reverse(invert(Sn-1)))
//     // The corresponding index in Sn-1 for the *inverted* bit is:
//     // Length of the third part is len_sn_minus_1.
//     // k is `k - mid_index` positions into the third part (0-indexed if we consider the third part alone)
//     // k is `k - mid_index + 1` positions into the third part (1-indexed).
//     // The corresponding index in Sn-1 from the *end* is `k - mid_index`.
//     // The corresponding index in Sn-1 from the *beginning* (1-indexed) is:
//     // `new_k = len_sn_minus_1 - (k - mid_index)`
//     // `new_k = (1 << (n - 1)) - 1 - (k - (1 << (n - 1)))`
//     // `new_k = (1 << (n - 1)) - 1 - k + (1 << (n - 1))`
//     // `new_k = 2 * (1 << (n - 1)) - 1 - k`
//     // `new_k = (1 << n) - 1 - k`  <- This is the length of Sn. So `new_k = Length(Sn) - k` ? No.
//     // Let's try `new_k = mid_index + (mid_index - k)`? No.

//     // Let's use the logic: position from the end.
//     // The third part has length `len_sn_minus_1`.
//     // `k` is the (k - mid_index)-th element in this part (0-indexed).
//     // The original index in Sn-1 that this bit came from (before reversing and inverting) would be `len_sn_minus_1 - 1 - (k - mid_index)`.
//     // This is for 0-indexed.

//     // For 1-indexed:
//     // The third part starts at index `mid_index + 1`.
//     // The k-th bit is `k - mid_index` positions into the third part (1-indexed).
//     // The corresponding bit in Sn-1 (before reversing and inverting) should be at position `len_sn_minus_1 - (k - mid_index) + 1`.
//     // Let's verify with an example: S3 = "0111001", n=3, k=7
//     // mid_index for n=3 is `(1 << 2) = 4`. Length of S2 is 3.
//     // k=7 is in the third part.
//     // `len_sn_minus_1 = 3`. `mid_index = 4`.
//     // `new_k = len_sn_minus_1 - (k - mid_index) + 1`
//     // `new_k = 3 - (7 - 4) + 1`
//     // `new_k = 3 - 3 + 1 = 1`.
//     // This means the 7th bit of S3 comes from the 1st bit of S2, inverted.
//     // S3 = S2 + "1" + reverse(invert(S2))
//     // S2 = "011"
//     // invert(S2) = "100"
//     // reverse(invert(S2)) = "001"
//     // S3 = "011" + "1" + "001" = "0111001"
//     // The 7th bit of S3 is '1'.
//     // The 1st bit of S2 is '0'. Inverting '0' gives '1'. This matches.

//     // Let's verify with k=5. S3[5] = '0'.
//     // `new_k = len_sn_minus_1 - (k - mid_index) + 1`
//     // `new_k = 3 - (5 - 4) + 1`
//     // `new_k = 3 - 1 + 1 = 3`.
//     // This means the 5th bit of S3 comes from the 3rd bit of S2, inverted.
//     // The 3rd bit of S2 is '1'. Inverting '1' gives '0'. This matches S3[5].

//     `new_k = (1 << (n - 1)) - (k - (1 << (n - 1)))`
//     `new_k = (1 << (n - 1)) - k + (1 << (n - 1))`
//     `new_k = 2 * (1 << (n - 1)) - k`
//     `new_k = (1 << n) - k` // This is wrong. Check the calculation.

//     Let `len_prev = (1 << (n - 1)) - 1`.
//     Middle index `mid = len_prev + 1 = (1 << (n - 1))`.
//     Third part starts at `mid + 1`.
//     `k` is in the third part means `k > mid`.
//     The position of `k` within the third part, 1-indexed: `pos_in_third = k - mid`.
//     The corresponding bit from `Sn-1` (before reversing and inverting) should be at `len_prev - pos_in_third + 1`.
//     So, `new_k = len_prev - (k - mid) + 1`.
//     `new_k = ((1 << (n - 1)) - 1) - (k - (1 << (n - 1))) + 1`
//     `new_k = (1 << (n - 1)) - 1 - k + (1 << (n - 1)) + 1`
//     `new_k = 2 * (1 << (n - 1)) - k`
//     `new_k = (1 << n) - k`  <- Still seems to be this. Let's check again.

//     Example n=3, k=7. `mid = 4`. `len_prev = 3`.
//     `new_k = 3 - (7 - 4) + 1 = 3 - 3 + 1 = 1`.
//     Using `(1 << n) - k`: `(1 << 3) - 7 = 8 - 7 = 1`. This formula seems correct for calculating the *new k*.

//     Let's re-derive `new_k` more carefully.
//     `k_orig` is the index in `Sn`.
//     We are in the third part: `k_orig > mid`.
//     The third part is `reverse(invert(Sn-1))`.
//     The length of `Sn-1` is `L(n-1) = (1 << (n-1)) - 1`.
//     The length of `Sn` is `L(n) = (1 << n) - 1`.
//     The middle element is at index `mid = (1 << (n-1))`.
//     The third part starts at `mid + 1`.
//     Let's consider the mapping from an index `k_orig` in `Sn` to an index `k_new` in `Sn-1`.

//     For `k_orig` in the range `[mid + 1, L(n)]`:
//     The index within the third part, 0-indexed, is `idx_in_third_part = k_orig - (mid + 1)`.
//     This `idx_in_third_part` corresponds to the `(L(n-1) - 1 - idx_in_third_part)`-th element of `Sn-1` (0-indexed), which then gets inverted.
//     So, `k_new_0_indexed = L(n-1) - 1 - (k_orig - (mid + 1))`.
//     `k_new_0_indexed = ((1 << (n-1)) - 1) - 1 - k_orig + (1 << (n-1)) + 1`
//     `k_new_0_indexed = (1 << (n-1)) - 1 - k_orig + (1 << (n-1))`
//     `k_new_0_indexed = 2 * (1 << (n-1)) - 1 - k_orig`
//     `k_new_0_indexed = (1 << n) - 1 - k_orig`

//     Now convert to 1-indexed:
//     `k_new_1_indexed = k_new_0_indexed + 1`
//     `k_new_1_indexed = ((1 << n) - 1 - k_orig) + 1`
//     `k_new_1_indexed = (1 << n) - k_orig`

//     So, if `k` is in the third part, we need to calculate `solve(n - 1, (1 << n) - k)`.
//     Let `char_from_prev = solve(n - 1, (1 << n) - k)`.
//     If `char_from_prev` is '0', return '1'.
//     If `char_from_prev` is '1', return '0'.

// Time Complexity:
// The recursion depth is `n`. In each recursive call, we perform constant time operations (comparisons, arithmetic).
// The length of the string is `2^n - 1`.
// In the worst case, we might traverse down the recursion tree.
// Each call to `solve(n, k)` makes a call to `solve(n-1, k')`.
// The total number of calls is proportional to `n`.
// For example, if `k` is always in the first part, `solve(n, k)` calls `solve(n-1, k)`, which calls `solve(n-2, k)`, ..., `solve(1, k)`. This is `n` calls.
// If `k` is always in the third part, `solve(n, k)` calls `solve(n-1, k')`, then `solve(n-2, k'')`, etc. The `k` value changes, but the logic follows a similar path.
// The length of the string is `O(2^n)`.
// The `k` value can be up to `2^n - 1`.
// The calculation `(1 << n) - k` takes constant time.
// The number of recursive calls is `n`.
// So, the time complexity is O(n).

// Space Complexity:
// The space complexity is determined by the recursion depth.
// The maximum depth of the recursion is `n`.
// Each function call stores its parameters and return address on the call stack.
// Therefore, the space complexity is O(n).

// Constraints:
// 1 <= n <= 20
// 1 <= k <= 2^n - 1

// The chosen approach is efficient for these constraints. n=20 means string length up to 2^20 - 1, which is about 1 million. Generating this string directly would be too slow and memory intensive. The recursive approach avoids this.

// Let's refine the implementation.
// The problem uses 1-based indexing for `k`.
// Our formulas are consistent with 1-based indexing for `k`.

// `mid_index = (1 << (n - 1))`
// If `k < mid_index`, recurse on `n-1` with `k`.
// If `k == mid_index`, return '1'.
// If `k > mid_index`, recurse on `n-1` with `(1 << n) - k`.

// Example 1: n = 3, k = 1
// solve(3, 1):
//   mid_index = (1 << 2) = 4.
//   k = 1 < 4.
//   Recurse: solve(2, 1)
//     solve(2, 1):
//       mid_index = (1 << 1) = 2.
//       k = 1 < 2.
//       Recurse: solve(1, 1)
//         solve(1, 1):
//           n == 1, return '0'.
//     Returns '0'.
//   Returns '0'.
// Output: "0". Correct.

// Example 2: n = 4, k = 11
// solve(4, 11):
//   mid_index = (1 << 3) = 8.
//   k = 11 > 8.
//   Recurse: solve(3, (1 << 4) - 11) = solve(3, 16 - 11) = solve(3, 5)
//     solve(3, 5):
//       mid_index = (1 << 2) = 4.
//       k = 5 > 4.
//       Recurse: solve(2, (1 << 3) - 5) = solve(2, 8 - 5) = solve(2, 3)
//         solve(2, 3):
//           mid_index = (1 << 1) = 2.
//           k = 3 > 2.
//           Recurse: solve(1, (1 << 2) - 3) = solve(1, 4 - 3) = solve(1, 1)
//             solve(1, 1):
//               n == 1, return '0'.
//           char_from_prev = '0'. Invert it: return '1'.
//         Returns '1'.
//       char_from_prev = '1'. Invert it: return '0'.
//     Returns '0'.
//   char_from_prev = '0'. Invert it: return '1'.
// Returns '1'.
// Output: "1". Correct.


// The logic seems solid.
// Let's consider the `invert` operation explicitly.
// `invert(bit)`: if bit == '0' return '1', else return '0'.

// Final check on the formula `(1 << n) - k` for the new `k` when `k` is in the third part.
// Let's use `mid = 1 << (n - 1)`.
// If `k` is in the third part, `k` is in `[mid + 1, (1 << n) - 1]`.
// The part `reverse(invert(Sn-1))` has length `(1 << (n-1)) - 1`.
// The indices are `mid + 1, mid + 2, ..., mid + ((1 << (n-1)) - 1)`.
// The position of `k` within this third part (1-indexed) is `k - mid`.
// This means `k` is the `(k - mid)`-th character of `reverse(invert(Sn-1))`.
// The `i`-th character of `reverse(invert(Sn-1))` is the inverted `(length_of_Sn-1 - i + 1)`-th character of `Sn-1`.
// Here, `i = k - mid`.
// `length_of_Sn-1 = (1 << (n-1)) - 1`.
// So, the original index in `Sn-1` (1-indexed) is `((1 << (n-1)) - 1) - (k - mid) + 1`.
// `new_k = (1 << (n-1)) - 1 - k + mid + 1`
// `new_k = (1 << (n-1)) - k + (1 << (n-1))`
// `new_k = 2 * (1 << (n-1)) - k`
// `new_k = (1 << n) - k`.
// This derivation confirms the formula.

// It might be slightly cleaner to calculate the length of Sn-1 outside the recursive calls, but since n is small, recalculating is fine.
// Using bit shifts `1 << n` is equivalent to `Math.pow(2, n)`.

// The problem guarantees that `k` is valid, so we don't need to handle out-of-bounds `k`.

// Let's write the code.
// */

/**
 * Finds the kth bit of the nth binary string Sn.
 * Sn is defined recursively:
 * S1 = "0"
 * Si = Si-1 + "1" + reverse(invert(Si-1))
 *
 * @param {number} n The level of the string to consider (1-indexed).
 * @param {number} k The position of the bit to find (1-indexed).
 * @return {character} The kth bit of Sn ('0' or '1').
 */
const findKthBit = (n, k) => {
    // Base case: S1 is "0". If n is 1, the only bit is '0'.
    if (n === 1) {
        return '0';
    }

    // Calculate the length of Sn-1.
    // The length of Si is 2^i - 1.
    // So, length of Sn-1 is 2^(n-1) - 1.
    // This can be calculated using bit shift: (1 << (n - 1)) - 1.
    // Example: n=3, length of S2 = (1 << 2) - 1 = 4 - 1 = 3.
    const length_sn_minus_1 = (1 << (n - 1)) - 1;

    // Calculate the index of the middle '1' in Sn.
    // Sn = Sn-1 + "1" + reverse(invert(Sn-1))
    // The middle '1' is at index length_sn_minus_1 + 1.
    // Example: n=3, length_sn_minus_1 = 3. Middle index = 3 + 1 = 4. S3 = "011" + "1" + "001"
    // The middle index is also equal to 2^(n-1), which is (1 << (n-1)).
    const middle_index = (1 << (n - 1)); // This is length_sn_minus_1 + 1.

    // Case 1: k is in the first part (Sn-1).
    // If k is less than or equal to the length of Sn-1, it means the kth bit
    // is part of the Sn-1 segment.
    if (k <= length_sn_minus_1) {
        // We recursively find the kth bit in the (n-1)th string.
        return findKthBit(n - 1, k);
    }
    // Case 2: k is the middle bit.
    // If k is exactly the middle index, it's the '1' inserted in Sn.
    else if (k === middle_index) {
        return '1';
    }
    // Case 3: k is in the third part (reverse(invert(Sn-1))).
    // If k is greater than the middle index, it means the kth bit
    // is part of the reverse(invert(Sn-1)) segment.
    else {
        // We need to find the corresponding bit in Sn-1 and then invert it.
        // The third part has a length equal to length_sn_minus_1.
        // The k-th bit in Sn corresponds to a bit in reverse(invert(Sn-1)).
        // Let's find the index in Sn-1 from which this bit originated.
        // The index within the third part, 1-based, is `k - middle_index`.
        // This position `k - middle_index` in the reversed/inverted part corresponds to
        // the `length_sn_minus_1 - (k - middle_index) + 1` position in the original Sn-1.
        // Let `new_k` be the 1-based index in Sn-1.
        // `new_k = length_sn_minus_1 - (k - middle_index) + 1`
        // `new_k = ((1 << (n - 1)) - 1) - (k - (1 << (n - 1))) + 1`
        // `new_k = (1 << (n - 1)) - 1 - k + (1 << (n - 1)) + 1`
        // `new_k = 2 * (1 << (n - 1)) - k`
        // `new_k = (1 << n) - k`

        const new_k = (1 << n) - k;
        const bit_from_prev = findKthBit(n - 1, new_k);

        // Invert the bit obtained from the previous string.
        if (bit_from_prev === '0') {
            return '1';
        } else {
            return '0';
        }
    }
};
