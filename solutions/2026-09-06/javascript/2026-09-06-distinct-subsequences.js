```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {number}
 */

// Problem Summary: Count distinct subsequences of string s that match string t.
// Link: https://leetcode.com/problems/distinct-subsequences/
// Approach: Dynamic Programming.
// We can use a 2D DP table `dp[i][j]` where `dp[i][j]` represents the number of distinct subsequences
// of `s[0...i-1]` that equal `t[0...j-1]`.
//
// Base Cases:
// 1. `dp[i][0] = 1` for all `i` from 0 to `s.length`. This is because an empty string `t` can always be formed from any prefix of `s` in one way (by choosing no characters).
// 2. `dp[0][j] = 0` for all `j` from 1 to `t.length`. This is because a non-empty string `t` cannot be formed from an empty string `s`.
//
// Recurrence Relation:
// For `i` from 1 to `s.length` and `j` from 1 to `t.length`:
// - If `s[i-1] == t[j-1]`:
//   The character `s[i-1]` can either be used to match `t[j-1]` or not.
//   - If we use `s[i-1]` to match `t[j-1]`: The number of ways is `dp[i-1][j-1]` (number of distinct subsequences of `s[0...i-2]` that equal `t[0...j-2]`).
//   - If we don't use `s[i-1]`: The number of ways is `dp[i-1][j]` (number of distinct subsequences of `s[0...i-2]` that equal `t[0...j-1]`).
//   So, `dp[i][j] = dp[i-1][j-1] + dp[i-1][j]`.
// - If `s[i-1] != t[j-1]`:
//   The character `s[i-1]` cannot be used to match `t[j-1]`. We must rely on subsequences formed from `s[0...i-2]` that match `t[0...j-1]`.
//   So, `dp[i][j] = dp[i-1][j]`.
//
// The final answer will be `dp[s.length][t.length]`.
//
// Time Complexity: O(m * n), where m is the length of s and n is the length of t.
// We iterate through each cell of the m x n DP table once.
// Space Complexity: O(m * n), for the DP table.
// We can optimize space to O(n) by noticing that each row only depends on the previous row.
// However, for clarity and direct implementation of the recurrence, O(m*n) is shown here.

const numDistinct = function(s, t) {
    const m = s.length;
    const n = t.length;

    // Initialize DP table with dimensions (m+1) x (n+1)
    // dp[i][j] will store the number of distinct subsequences of s[0...i-1] that equal t[0...j-1]
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

    // Base case: an empty string t can be formed in one way from any prefix of s (by choosing no characters)
    for (let i = 0; i <= m; i++) {
        dp[i][0] = 1;
    }

    // Base case: a non-empty string t cannot be formed from an empty string s
    // This is implicitly handled by the initialization of dp table with zeros,
    // but explicit for understanding.
    // for (let j = 1; j <= n; j++) {
    //     dp[0][j] = 0;
    // }

    // Fill the DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            // If the current characters match
            if (s[i - 1] === t[j - 1]) {
                // The number of distinct subsequences is the sum of:
                // 1. Using s[i-1] to match t[j-1]: dp[i-1][j-1] ways
                // 2. Not using s[i-1]: dp[i-1][j] ways
                dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
            } else {
                // If the current characters do not match, we cannot use s[i-1] to match t[j-1].
                // So, the number of distinct subsequences is the same as without considering s[i-1].
                dp[i][j] = dp[i - 1][j];
            }
        }
    }

    // The result is the number of distinct subsequences of the entire string s that equal the entire string t
    return dp[m][n];
};
```