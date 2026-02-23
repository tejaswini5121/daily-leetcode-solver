// /*
// Problem Summary:
// Check if a binary string `s` contains all possible binary codes of length `k` as substrings.
// Problem Link: https://leetcode.com/problems/check-if-a-string-contains-all-binary-codes-of-size-k/
//
// Approach:
// The total number of unique binary codes of length `k` is 2^k.
// We can iterate through the string `s` and extract all substrings of length `k`.
// A hash set (unordered_set in C++) can be used to store the unique binary codes encountered.
// For each substring of length `k`, we add it to the hash set.
// After iterating through the entire string, we check if the size of the hash set is equal to 2^k.
// If it is, it means all possible binary codes of length `k` were found.
//
// Optimization using rolling hash (or bit manipulation):
// Instead of storing strings in the hash set, we can store their integer representations.
// This avoids the overhead of string hashing and comparisons.
// For a binary string of length `k`, its integer representation can be calculated.
// As we slide the window of size `k` one position to the right, the integer representation
// can be updated efficiently.
//
// Let the current window be `s[i...i+k-1]` and its integer value be `current_val`.
// When we move to `s[i+1...i+k]`:
// 1. Remove the contribution of `s[i]` (the leftmost bit). This is `s[i] * 2^(k-1)`.
// 2. Shift the remaining bits to the left by one position (multiply by 2).
// 3. Add the contribution of `s[i+k]` (the new rightmost bit). This is `s[i+k]`.
//
// The formula for updating `current_val` when sliding from `s[i...i+k-1]` to `s[i+1...i+k]` is:
// `new_val = (current_val - (s[i] - '0') * 2^(k-1)) * 2 + (s[i+k] - '0')`
//
// A more straightforward way to implement this without explicit powers of 2 during subtraction is:
// `new_val = (current_val << 1) | (s[i+k] - '0');`
// When calculating the initial `current_val` for `s[0...k-1]`, we can do:
// `current_val = (current_val << 1) | (s[i] - '0');`
// After calculating the initial `current_val`, we can then add it to the set.
// For subsequent characters, we can update `current_val` by `(current_val << 1) | (s[j] - '0')`
// and then subtract the contribution of the bit that falls out of the window.
//
// A simpler and more efficient rolling hash update:
// If `val` represents the integer of `s[i...i+k-1]`:
// When we move to `s[i+1...i+k]`:
// The new integer `new_val` can be calculated from `val` as follows:
// `new_val = (val & ((1 << (k-1)) - 1)) << 1 | (s[i+k] - '0');`
// The `(val & ((1 << (k-1)) - 1))` part effectively removes the most significant bit (which is `s[i]`).
// Then we shift left by 1 and OR with the new bit `s[i+k]`.
//
// For example, if k=3 and current window is "101" (val = 5).
// Next window is "010". s[i] = '1', s[i+k] = '0'.
// `(1 << (k-1)) - 1` for k=3 is `(1 << 2) - 1 = 4 - 1 = 3` (binary `011`).
// `val & 3` = `5 & 3` = `101 & 011` = `001` (decimal 1). This is `s[i+1...i+k-1]` as an integer.
// `(val & 3) << 1` = `1 << 1` = `2` (binary `010`).
// `2 | ('0' - '0')` = `2 | 0` = `2`. Which is the integer representation of "010".
//
// Constraints:
// s.length <= 5 * 10^5
// k <= 20
//
// The maximum number of unique codes is 2^20, which is about 1 million.
// This is manageable for a hash set.
//
// Time Complexity: O(N * K) if string operations are used for hashing, O(N) if rolling hash is used.
//    The initial calculation of the first `k` bits takes O(K).
//    Each subsequent character involves O(1) update and O(1) hash set insertion.
//    So, the rolling hash approach is O(N).
// Space Complexity: O(2^K) in the worst case to store all unique codes.
//    Since K <= 20, 2^K is at most ~1 million. This is acceptable.
// */

#include <string>
#include <vector>
#include <unordered_set>
#include <cmath>

class Solution {
public:
    bool hasAllCodes(std::string s, int k) {
        // If the string length is less than k, it's impossible to form any code of length k.
        if (s.length() < k) {
            return false;
        }

        // The total number of unique binary codes of length k is 2^k.
        // We can use a bitmask to represent the maximum possible number of codes.
        // `max_codes` represents 2^k.
        int max_codes = 1 << k;

        // An unordered_set to store the unique binary codes (as integers) encountered.
        std::unordered_set<int> unique_codes;

        // `current_val` will store the integer representation of the current window of size k.
        int current_val = 0;

        // Calculate the integer value for the first window of size k (s[0...k-1]).
        for (int i = 0; i < k; ++i) {
            // Shift `current_val` left by 1 (equivalent to multiplying by 2).
            // Then, OR with the current bit (0 or 1).
            // `(s[i] - '0')` converts the character '0' or '1' to its integer equivalent.
            current_val = (current_val << 1) | (s[i] - '0');
        }
        // Add the first code's integer representation to the set.
        unique_codes.insert(current_val);

        // Iterate through the string starting from the k-th character.
        // For each iteration, we are sliding the window one position to the right.
        for (int i = k; i < s.length(); ++i) {
            // Update `current_val` for the new window s[i-k+1 ... i].
            // 1. Shift `current_val` left by 1. This effectively removes the leftmost bit's contribution
            //    (if we were thinking in terms of powers, it's like `val * 2`).
            // 2. OR with the new bit `s[i]`. This adds the new rightmost bit.
            //
            // To correctly implement the rolling hash and only keep bits relevant to the `k` length window:
            // The most significant bit that falls out of the window corresponds to `s[i-k]`.
            // When we shift left, this bit's value is lost implicitly.
            //
            // A more robust rolling hash update:
            // `current_val = (current_val << 1) | (s[i] - '0');`
            // Now `current_val` represents the value of `s[i-k+1 ... i]`.
            // If `current_val` has become larger than `2^k - 1`, it means the value might be too large
            // because we effectively kept more than `k` bits during the shift and OR.
            // This can be managed by bitwise operations.
            //
            // The formula `current_val = ((current_val << 1) | (s[i] - '0')) & ((1 << k) - 1);`
            // ensures that `current_val` always stays within the range of k bits.
            // `(1 << k) - 1` is a mask with `k` ones (e.g., for k=3, it's 0b111).
            // This mask clears any bits beyond the k-th position, effectively keeping only the last k bits.

            current_val = ((current_val << 1) | (s[i] - '0')) & ((1 << k) - 1);

            // Add the integer representation of the current window to the set.
            // The set automatically handles duplicates.
            unique_codes.insert(current_val);
        }

        // If the number of unique codes found is equal to the total possible number of codes (2^k),
        // then all binary codes of length k are present as substrings.
        return unique_codes.size() == max_codes;
    }
};
