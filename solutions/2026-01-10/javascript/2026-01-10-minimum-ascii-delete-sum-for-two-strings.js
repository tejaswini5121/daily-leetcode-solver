// Problem: Minimum ASCII Delete Sum for Two Strings
// Link: https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/
//
// Approach:
// This problem can be solved using dynamic programming. We want to find the longest common subsequence (LCS)
// in terms of ASCII values. The characters that are NOT part of this LCS are the ones we need to delete.
//
// Let dp[i][j] represent the maximum ASCII sum of a common subsequence of s1[0...i-1] and s2[0...j-1].
//
// Base Cases:
// dp[0][0] = 0 (empty strings have a common subsequence with sum 0)
// dp[i][0] = 0 for all i (s2 is empty, no common subsequence possible)
// dp[0][j] = 0 for all j (s1 is empty, no common subsequence possible)
//
// Recurrence Relation:
// If s1[i-1] == s2[j-1]:
//   The current characters match. We can include them in the common subsequence.
//   dp[i][j] = dp[i-1][j-1] + s1.charCodeAt(i-1)
// If s1[i-1] != s2[j-1]:
//   The current characters do not match. We have two choices:
//   1. Don't include s1[i-1] in the common subsequence (consider s1[0...i-2] and s2[0...j-1]).
//      The common subsequence sum would be dp[i-1][j].
//   2. Don't include s2[j-1] in the common subsequence (consider s1[0...i-1] and s2[0...j-2]).
//      The common subsequence sum would be dp[i][j-1].
//   We take the maximum of these two options to maximize the common subsequence sum.
//   dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])
//
// After filling the DP table, dp[s1.length][s2.length] will hold the maximum ASCII sum of the common subsequence.
// The total ASCII sum of both strings is sum(s1) + sum(s2).
// The minimum ASCII delete sum will be (total ASCII sum) - 2 * (maximum common subsequence ASCII sum).
// We multiply by 2 because the characters in the LCS are present in both original strings, and they
// don't need to be deleted from either.
//
// Time Complexity: O(m * n), where m is the length of s1 and n is the length of s2.
//   We iterate through the entire DP table of size (m+1) * (n+1).
// Space Complexity: O(m * n) for the DP table.
//   This can be optimized to O(min(m, n)) by observing that dp[i][j] only depends on the previous row
//   or current row and previous column values. However, for clarity and direct implementation of the
//   recurrence, O(m*n) space is used here.

/**
 * @param {string} s1
 * @param {string} s2
 * @return {number}
 */
var minimumDeleteSum = function(s1, s2) {
    const m = s1.length;
    const n = s2.length;

    // dp[i][j] will store the maximum ASCII sum of a common subsequence
    // of s1[0...i-1] and s2[0...j-1].
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

    // Calculate the maximum ASCII sum of the common subsequence
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            // If the current characters match
            if (s1[i - 1] === s2[j - 1]) {
                // Include the current character's ASCII value in the common subsequence sum
                dp[i][j] = dp[i - 1][j - 1] + s1.charCodeAt(i - 1);
            } else {
                // If characters don't match, take the maximum sum from either
                // excluding s1[i-1] or excluding s2[j-1] from the common subsequence.
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // The total ASCII sum of s1 and s2
    let totalAsciiSum = 0;
    for (let i = 0; i < m; i++) {
        totalAsciiSum += s1.charCodeAt(i);
    }
    for (let i = 0; i < n; i++) {
        totalAsciiSum += s2.charCodeAt(i);
    }

    // The maximum ASCII sum of the common subsequence is stored in dp[m][n].
    // Characters in the common subsequence do not need to be deleted from either string.
    // So, we subtract twice the common subsequence sum from the total sum.
    const maxCommonSubsequenceAsciiSum = dp[m][n];
    const minDeleteSum = totalAsciiSum - 2 * maxCommonSubsequenceAsciiSum;

    return minDeleteSum;
};
```