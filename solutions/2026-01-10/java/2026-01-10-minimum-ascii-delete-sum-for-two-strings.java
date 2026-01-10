```java
// Problem: Minimum ASCII Delete Sum for Two Strings
// Link: https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/
//
// Approach:
// This problem can be solved using dynamic programming. We want to find the longest common subsequence (LCS)
// of the two strings, but instead of counting the length, we want to maximize the sum of ASCII values of
// the characters in the common subsequence. The reason for this is that the total ASCII sum of both strings
// minus twice the ASCII sum of the LCS will give us the minimum ASCII delete sum.
//
// Let dp[i][j] represent the maximum ASCII sum of a common subsequence of s1[0...i-1] and s2[0...j-1].
//
// Base cases:
// dp[0][j] = 0 for all j (empty s1, no common subsequence)
// dp[i][0] = 0 for all i (empty s2, no common subsequence)
//
// Recurrence relation:
// If s1[i-1] == s2[j-1]:
//   dp[i][j] = dp[i-1][j-1] + ascii(s1[i-1])
//   (We extend the common subsequence by including the matching character)
// If s1[i-1] != s2[j-1]:
//   dp[i][j] = max(dp[i-1][j], dp[i][j-1])
//   (We have to delete either s1[i-1] or s2[j-1], so we take the maximum sum from the previous states)
//
// After computing the dp table, the maximum ASCII sum of the LCS will be dp[s1.length()][s2.length()].
//
// The total ASCII sum of s1 is sum(s1).
// The total ASCII sum of s2 is sum(s2).
// The minimum delete sum = sum(s1) + sum(s2) - 2 * LCS_ASCII_SUM.
//
// Time complexity: O(m * n), where m is the length of s1 and n is the length of s2.
// We iterate through the dp table of size (m+1) x (n+1).
//
// Space complexity: O(m * n) for the dp table. This can be optimized to O(min(m, n)) by using only two rows
// of the dp table since each cell only depends on the previous row and the current row.
// However, for simplicity and clarity, we'll use the O(m*n) space approach first.
// The problem constraints (lengths up to 1000) make O(m*n) space acceptable.

class Solution {
    public int minimumDeleteSum(String s1, String s2) {
        int m = s1.length();
        int n = s2.length();

        // dp[i][j] will store the maximum ASCII sum of a common subsequence
        // for the first i characters of s1 and the first j characters of s2.
        int[][] dp = new int[m + 1][n + 1];

        // Fill the dp table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                // If the current characters match
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    // We extend the common subsequence by adding the ASCII value of the matching character.
                    dp[i][j] = dp[i - 1][j - 1] + s1.charAt(i - 1);
                } else {
                    // If the characters don't match, we consider two options:
                    // 1. Skip the current character from s1 (dp[i-1][j])
                    // 2. Skip the current character from s2 (dp[i][j-1])
                    // We take the maximum ASCII sum from these options.
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        // The maximum ASCII sum of the longest common subsequence is dp[m][n].
        int lcsAsciiSum = dp[m][n];

        // Calculate the total ASCII sum of both strings.
        int totalAsciiSum = 0;
        for (int i = 0; i < m; i++) {
            totalAsciiSum += s1.charAt(i);
        }
        for (int i = 0; i < n; i++) {
            totalAsciiSum += s2.charAt(i);
        }

        // The minimum delete sum is the total ASCII sum of both strings minus twice the ASCII sum of the LCS.
        // This is because characters in the LCS are not deleted from either string.
        // Total sum = (sum of deleted from s1) + (sum of deleted from s2) + 2 * (sum of LCS)
        // Minimum delete sum = (sum of deleted from s1) + (sum of deleted from s2)
        // So, Minimum delete sum = Total sum - 2 * (sum of LCS)
        return totalAsciiSum - 2 * lcsAsciiSum;
    }
}
```