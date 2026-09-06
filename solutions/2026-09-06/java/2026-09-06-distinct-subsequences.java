// Problem: Distinct Subsequences
// Link: https://leetcode.com/problems/distinct-subsequences/
// Approach:
// This problem can be solved using dynamic programming.
// Let dp[i][j] be the number of distinct subsequences of s[0...i-1] that equals t[0...j-1].
// We are looking for dp[s.length()][t.length()].
//
// The recurrence relation is as follows:
// 1. If s[i-1] != t[j-1]:
//    The character s[i-1] cannot be used to match t[j-1].
//    So, dp[i][j] = dp[i-1][j] (we consider subsequences from s[0...i-2] that match t[0...j-1]).
//
// 2. If s[i-1] == t[j-1]:
//    The character s[i-1] can be used to match t[j-1].
//    There are two possibilities:
//    a) We use s[i-1] to match t[j-1]. In this case, the number of ways is dp[i-1][j-1]
//       (number of distinct subsequences of s[0...i-2] that match t[0...j-2]).
//    b) We do NOT use s[i-1] to match t[j-1]. In this case, the number of ways is dp[i-1][j]
//       (number of distinct subsequences of s[0...i-2] that match t[0...j-1]).
//    So, dp[i][j] = dp[i-1][j-1] + dp[i-1][j].
//
// Base cases:
// - dp[i][0] = 1 for all i from 0 to s.length(). This is because there is always one way to form an empty subsequence (by taking no characters) from any string.
// - dp[0][j] = 0 for all j from 1 to t.length(). This is because an empty string cannot form any non-empty subsequence.
//
// Time Complexity: O(m*n), where m is the length of s and n is the length of t.
// We iterate through a 2D DP table of size (m+1) * (n+1).
// Space Complexity: O(m*n), for the 2D DP table.
// We can optimize space to O(n) by noticing that dp[i][j] only depends on values from the previous row (i-1).
// However, the problem constraints (lengths up to 1000) make O(m*n) space acceptable.
class Solution {
    public int numDistinct(String s, String t) {
        int m = s.length();
        int n = t.length();

        // dp[i][j] will store the number of distinct subsequences of s[0...i-1]
        // that equals t[0...j-1].
        // We use m+1 and n+1 for 1-based indexing to handle empty string cases easily.
        int[][] dp = new int[m + 1][n + 1];

        // Base case: When t is an empty string (j=0), there's always one way
        // to form it from any prefix of s (by taking no characters).
        // So, dp[i][0] = 1 for all i from 0 to m.
        for (int i = 0; i <= m; i++) {
            dp[i][0] = 1;
        }

        // Base case: When s is an empty string (i=0) and t is not empty (j>0),
        // there are no ways to form a non-empty subsequence.
        // dp[0][j] = 0 for all j from 1 to n. This is already handled by default
        // initialization of the int array to 0.

        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                // If the current characters match, we have two options:
                // 1. Use s[i-1] to match t[j-1]: The number of ways is dp[i-1][j-1]
                //    (number of ways to form t[0...j-2] from s[0...i-2]).
                // 2. Do NOT use s[i-1] to match t[j-1]: The number of ways is dp[i-1][j]
                //    (number of ways to form t[0...j-1] from s[0...i-2]).
                // So, dp[i][j] = dp[i-1][j-1] + dp[i-1][j].
                if (s.charAt(i - 1) == t.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
                } else {
                    // If the current characters do not match, we cannot use s[i-1] to match t[j-1].
                    // So, the number of ways is the same as forming t[0...j-1] from s[0...i-2].
                    // dp[i][j] = dp[i-1][j].
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }

        // The final answer is the number of distinct subsequences of s that equals t.
        // This is stored in dp[m][n].
        return dp[m][n];
    }
}
