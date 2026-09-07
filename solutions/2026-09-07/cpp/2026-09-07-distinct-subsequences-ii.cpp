// Problem: Distinct Subsequences II
// Link: https://leetcode.com/problems/distinct-subsequences-ii/
//
// Approach:
// This problem can be solved using dynamic programming. We want to count the number of distinct non-empty subsequences.
// Let dp[i] be the number of distinct non-empty subsequences ending at index i.
// However, this definition makes it tricky to handle duplicates.
// A better approach is to maintain the count of distinct subsequences ending with each character.
// Let `count[c]` be the number of distinct subsequences ending with character `c` considering the string processed so far.
// When we process a new character `s[i]`:
// 1. The number of new subsequences we can form is `1` (for the character `s[i]` itself) plus the sum of all distinct subsequences ending with any character encountered *before* `s[i]`.
//    This sum is effectively the total number of distinct subsequences found so far *before* considering `s[i]` as an appended character.
// 2. If we have seen `s[i]` before, say the last time was at index `prev_i`, then the subsequences ending with `s[i]` formed by appending `s[i]` to subsequences ending at `prev_i` would be duplicates of subsequences we're about to form.
//    Therefore, we need to subtract the count of distinct subsequences ending with `s[i]` *before* this current `s[i]` was processed.
//
// Let `endsWith[c]` store the number of distinct subsequences ending with character `c`.
// Initialize `endsWith` array with zeros for all 26 lowercase letters.
// Iterate through the input string `s`:
// For each character `s[i]`:
//   Let `currentChar = s[i]`.
//   Calculate `newSubsequencesEndingWithCurrentChar`:
//     This is `1` (for the character `s[i]` itself) plus the sum of all `endsWith[c]` for all characters `c`.
//     The sum of all `endsWith[c]` represents the total number of distinct subsequences formed so far that do not end with `s[i]`.
//     So, `newSubsequencesEndingWithCurrentChar = 1 + (sum of all endsWith[c] for c from 'a' to 'z')`.
//     To avoid recomputing the sum every time, we can maintain a `totalDistinctSubsequences` count.
//     `newSubsequencesEndingWithCurrentChar = 1 + totalDistinctSubsequences_before_this_char`.
//
//   The number of distinct subsequences *ending* with `currentChar` after processing `s[i]` will be:
//   `currentTotalEndingWithChar = (newSubsequencesEndingWithCurrentChar) % MOD`.
//
//   We need to adjust the `totalDistinctSubsequences` count.
//   The change in `totalDistinctSubsequences` is `currentTotalEndingWithChar - old_endsWith[currentChar]`.
//   So, `newTotalDistinctSubsequences = (totalDistinctSubsequences + currentTotalEndingWithChar - old_endsWith[currentChar] + MOD) % MOD`.
//
//   Update `endsWith[currentChar]` to `currentTotalEndingWithChar`.
//   Update `totalDistinctSubsequences` to `newTotalDistinctSubsequences`.
//
// Let's refine the DP state and transition:
// `dp[c]` = the number of distinct subsequences ending with character `c` considering the prefix of `s` processed so far.
// `total_distinct` = the total number of distinct non-empty subsequences considering the prefix of `s` processed so far.
//
// Initialize `dp` array (size 26) to 0.
// Initialize `total_distinct = 0`.
// Modulo constant `MOD = 10^9 + 7`.
//
// For each character `char_code` (0-25) corresponding to `s[i]`:
//   `current_char_count = dp[char_code]` (number of distinct subsequences ending with `s[i]` *before* processing this `s[i]`).
//   `new_sequences_ending_here = (total_distinct + 1) % MOD`. This represents forming new subsequences by appending `s[i]` to all previously existing distinct subsequences, plus the subsequence `s[i]` itself.
//   `dp[char_code] = new_sequences_ending_here`.
//   The `total_distinct` subsequences need to be updated.
//   The number of new distinct subsequences added is `new_sequences_ending_here - current_char_count`.
//   `total_distinct = (total_distinct + new_sequences_ending_here - current_char_count + MOD) % MOD`.
//
// Time Complexity: O(N), where N is the length of the string `s`. We iterate through the string once. The operations inside the loop (array access, arithmetic) are constant time.
// Space Complexity: O(1), as we use a fixed-size array `dp` of size 26 for lowercase English letters.
//
// Example walk-through: s = "aba"
// MOD = 10^9 + 7
// dp = [0, 0, ..., 0] (size 26)
// total_distinct = 0
//
// i = 0, s[0] = 'a' (char_code = 0)
//   current_char_count = dp[0] = 0
//   new_sequences_ending_here = (total_distinct + 1) % MOD = (0 + 1) % MOD = 1
//   dp[0] = 1
//   total_distinct = (total_distinct + new_sequences_ending_here - current_char_count + MOD) % MOD
//                  = (0 + 1 - 0 + MOD) % MOD = 1
//   dp = [1, 0, ..., 0], total_distinct = 1. (Subsequences: "a")
//
// i = 1, s[1] = 'b' (char_code = 1)
//   current_char_count = dp[1] = 0
//   new_sequences_ending_here = (total_distinct + 1) % MOD = (1 + 1) % MOD = 2
//     (These 2 are: "b" itself, and "ab" formed by appending 'b' to "a")
//   dp[1] = 2
//   total_distinct = (total_distinct + new_sequences_ending_here - current_char_count + MOD) % MOD
//                  = (1 + 2 - 0 + MOD) % MOD = 3
//   dp = [1, 2, 0, ..., 0], total_distinct = 3. (Subsequences: "a", "b", "ab")
//
// i = 2, s[2] = 'a' (char_code = 0)
//   current_char_count = dp[0] = 1 (This is the count of subsequences ending with 'a' *before* this current 'a')
//   new_sequences_ending_here = (total_distinct + 1) % MOD = (3 + 1) % MOD = 4
//     (These 4 potential new subsequences are formed by appending 'a' to:
//      - empty string -> "a" (this is counted by +1)
//      - "a" -> "aa"
//      - "b" -> "ba"
//      - "ab" -> "aba")
//   dp[0] = 4 (Now, subsequences ending with 'a' are "a", "aa", "ba", "aba")
//   total_distinct = (total_distinct + new_sequences_ending_here - current_char_count + MOD) % MOD
//                  = (3 + 4 - 1 + MOD) % MOD = 6
//   dp = [4, 2, 0, ..., 0], total_distinct = 6.
//
// Final answer is total_distinct = 6. This matches Example 2.

#include <vector>
#include <string>

class Solution {
public:
    int distinctSubseqII(std::string s) {
        // Modulo constant for the problem
        int MOD = 1e9 + 7;

        // dp[i] will store the number of distinct subsequences ending with the i-th letter of the alphabet ('a' + i).
        // Size 26 for 'a' through 'z'.
        std::vector<int> dp(26, 0);

        // total_distinct will store the total number of distinct non-empty subsequences found so far.
        long long total_distinct = 0;

        // Iterate through each character of the input string s.
        for (char c : s) {
            // Get the index for the current character c (0 for 'a', 1 for 'b', ..., 25 for 'z').
            int char_code = c - 'a';

            // `current_char_count` stores the number of distinct subsequences that ended with character `c` *before* processing the current `c`.
            // This is important to subtract duplicates correctly.
            int current_char_count = dp[char_code];

            // `new_sequences_ending_here` represents the count of new distinct subsequences we can form by considering the current character `c`.
            // This is calculated as:
            // 1 (for the single character subsequence `c` itself)
            // + `total_distinct` (for appending `c` to all existing distinct subsequences).
            // We take modulo `MOD` to prevent overflow.
            long long new_sequences_ending_here = (total_distinct + 1) % MOD;

            // Update `dp[char_code]` to the new count of distinct subsequences ending with character `c`.
            dp[char_code] = new_sequences_ending_here;

            // Update the `total_distinct` count.
            // The logic is:
            // `total_distinct` (old) + `new_sequences_ending_here` (just formed) - `current_char_count` (those that are now duplicates because they also end in `c` and were counted before)
            // We add `MOD` before taking modulo to handle cases where `new_sequences_ending_here - current_char_count` is negative.
            total_distinct = (total_distinct + new_sequences_ending_here - current_char_count + MOD) % MOD;
        }

        // The final `total_distinct` holds the count of all distinct non-empty subsequences.
        return static_cast<int>(total_distinct);
    }
};
```