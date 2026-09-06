// Problem: Distinct Subsequences
// Link: https://leetcode.com/problems/distinct-subsequences/
//
// Approach:
// This problem can be solved using dynamic programming.
// Let dp[i][j] be the number of distinct subsequences of s[0...i-1] that equal t[0...j-1].
// We want to find dp[s.length()][t.length()].
//
// Base cases:
// 1. dp[i][0] = 1 for all i: An empty string t can always be formed from any prefix of s in one way (by deleting all characters).
// 2. dp[0][j] = 0 for j > 0: A non-empty string t cannot be formed from an empty string s.
//
// Recurrence relation:
// For dp[i][j], consider the characters s[i-1] and t[j-1].
//
// Case 1: s[i-1] != t[j-1]
// If the last characters don't match, then s[i-1] cannot be used to form the last character of t[0...j-1].
// So, the number of distinct subsequences is the same as the number of distinct subsequences of s[0...i-2] that equal t[0...j-1].
// dp[i][j] = dp[i-1][j]
//
// Case 2: s[i-1] == t[j-1]
// If the last characters match, we have two options:
//   a) We use s[i-1] to match t[j-1]. In this case, we need to find the number of distinct subsequences of s[0...i-2] that equal t[0...j-2]. This is dp[i-1][j-1].
//   b) We don't use s[i-1] to match t[j-1]. In this case, s[i-1] is essentially ignored for forming t[0...j-1], and we need to find the number of distinct subsequences of s[0...i-2] that equal t[0...j-1]. This is dp[i-1][j].
// Therefore, when s[i-1] == t[j-1], dp[i][j] = dp[i-1][j-1] + dp[i-1][j].
//
// The DP table size will be (s.length() + 1) x (t.length() + 1).
//
// Optimization: Space complexity can be reduced to O(t.length()) because dp[i][j] only depends on values from the previous row (i-1). We can use two rows or even one row with careful updates.
// Let's use a 1D DP array `dp` of size `t.length() + 1`, where `dp[j]` stores the number of distinct subsequences of the current prefix of `s` that equal `t[0...j-1]`.
// When iterating through `s`, for each character `s[i-1]`:
// We iterate `t` from right to left (`j` from `t.length()` down to `1`).
// If `s[i-1] == t[j-1]`, then `dp[j]` (new value) = `dp[j-1]` (old value) + `dp[j]` (old value).
// `dp[j-1]` represents the count of subsequences of `s[0...i-2]` matching `t[0...j-2]` (which is the count of subsequences of `s[0...i-1]` matching `t[0...j-2]` when we consider `s[i-1]` matching `t[j-1]`).
// `dp[j]` (old value) represents the count of subsequences of `s[0...i-2]` matching `t[0...j-1]`.
//
// Time Complexity: O(s.length() * t.length())
// Space Complexity: O(t.length()) after optimization. If not optimized, O(s.length() * t.length()).
//
// Let's stick with the 1D DP for space optimization.

#include <vector>
#include <string>
#include <iostream>

class Solution {
public:
    int numDistinct(std::string s, std::string t) {
        int n = s.length();
        int m = t.length();

        // dp[j] will store the number of distinct subsequences of s[0...i-1]
        // that equal t[0...j-1].
        // We use a 1D DP array for space optimization.
        // Initialize dp array. dp[0] = 1 because an empty string t can always be
        // formed from any prefix of s in one way (by deleting all characters).
        // All other dp[j] for j > 0 are initialized to 0.
        std::vector<int> dp(m + 1, 0);
        dp[0] = 1;

        // Iterate through each character of string s
        for (int i = 1; i <= n; ++i) {
            // Iterate through each character of string t from right to left.
            // This is crucial for the 1D DP to work correctly. When we update dp[j],
            // we need the previous value of dp[j-1] from the *previous* iteration of s.
            // Iterating from right to left ensures that dp[j-1] still holds the value
            // from the previous row (i-1) before it gets updated in the current iteration.
            for (int j = m; j >= 1; --j) {
                // If the current characters match (s[i-1] and t[j-1])
                if (s[i - 1] == t[j - 1]) {
                    // The number of distinct subsequences to form t[0...j-1] using s[0...i-1]
                    // is the sum of:
                    // 1. Number of distinct subsequences to form t[0...j-2] using s[0...i-2]
                    //    (this is dp[j-1] from the previous iteration of s, which is now dp[j-1]
                    //     because we are updating in place and j-1 is already processed or still
                    //     holds its value from the previous outer loop iteration).
                    // 2. Number of distinct subsequences to form t[0...j-1] using s[0...i-2]
                    //    (this is the current value of dp[j] before this update, which represents
                    //     the count without using s[i-1]).
                    dp[j] = dp[j - 1] + dp[j];
                } else {
                    // If the characters don't match, s[i-1] cannot be used to match t[j-1].
                    // So, the number of distinct subsequences to form t[0...j-1] using s[0...i-1]
                    // is the same as the number of distinct subsequences to form t[0...j-1]
                    // using s[0...i-2]. This value is already stored in dp[j] from the previous
                    // outer loop iteration. So, no change is needed for dp[j] in this case.
                    // dp[j] = dp[j]; // Implicitly stays the same.
                }
            }
        }

        // The final answer is the number of distinct subsequences of s that equal t.
        return dp[m];
    }
};
```