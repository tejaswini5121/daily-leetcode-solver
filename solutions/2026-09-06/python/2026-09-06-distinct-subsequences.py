```python
# Find the number of distinct subsequences of s that equal t.
# Link: https://leetcode.com/problems/distinct-subsequences/
#
# Approach:
# This problem can be solved using dynamic programming.
# Let dp[i][j] be the number of distinct subsequences of s[0...i-1] that equal t[0...j-1].
#
# Base Cases:
# 1. dp[i][0] = 1 for all i: An empty string t (t[0...-1]) can always be formed from any prefix of s in exactly one way (by choosing no characters).
# 2. dp[0][j] = 0 for j > 0: A non-empty string t cannot be formed from an empty string s.
#
# Recurrence Relation:
# For dp[i][j], consider the characters s[i-1] and t[j-1].
#
# Case 1: s[i-1] != t[j-1]
#   If the last characters don't match, we cannot use s[i-1] to form t[j-1].
#   Therefore, the number of distinct subsequences is the same as the number of distinct subsequences of s[0...i-2] that equal t[0...j-1].
#   dp[i][j] = dp[i-1][j]
#
# Case 2: s[i-1] == t[j-1]
#   If the last characters match, we have two choices for s[i-1]:
#   a) We don't use s[i-1] to match t[j-1]. In this case, we need to find the number of distinct subsequences of s[0...i-2] that equal t[0...j-1]. This is dp[i-1][j].
#   b) We use s[i-1] to match t[j-1]. In this case, we need to find the number of distinct subsequences of s[0...i-2] that equal t[0...j-2]. This is dp[i-1][j-1].
#   So, dp[i][j] = dp[i-1][j] + dp[i-1][j-1]
#
# The final answer will be dp[m][n], where m is the length of s and n is the length of t.
#
# Optimization (Space Complexity):
# Notice that to compute dp[i][j], we only need values from the previous row (i-1).
# This means we can optimize the space complexity from O(m*n) to O(n) by using only two rows or even one row if we iterate carefully.
# For the O(n) space optimization, we can use a 1D DP array where dp[j] stores the number of distinct subsequences of the current prefix of s that equal t[0...j-1].
# When considering a new character s[i-1]:
# We iterate j from n down to 1.
# If s[i-1] == t[j-1]: dp[j] = dp[j] (don't use s[i-1]) + dp[j-1] (use s[i-1]).
# If s[i-1] != t[j-1]: dp[j] remains unchanged as we cannot use s[i-1] to match t[j-1].
# The base case dp[0] remains 1.
#
# Time Complexity: O(m * n), where m is the length of s and n is the length of t.
# We have a nested loop iterating through all characters of s and t.
#
# Space Complexity: O(n), where n is the length of t.
# We use a 1D DP array of size n+1.
#
# If we use the O(m*n) space approach, then space complexity is O(m*n).

class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        m = len(s)
        n = len(t)

        # dp[j] will store the number of distinct subsequences of s[:i] that equals t[:j].
        # We will iterate through s, updating this dp array.
        # The size of the dp array is n+1 because we consider prefixes of t up to length n.
        dp = [0] * (n + 1)

        # Base case: An empty string t can always be formed from any prefix of s in one way
        # (by choosing no characters). So, dp[0] represents the count for an empty target string,
        # which is always 1.
        dp[0] = 1

        # Iterate through each character of string s
        for i in range(1, m + 1):
            # Iterate through each character of string t in reverse order.
            # We iterate in reverse to ensure that when we calculate dp[j],
            # we are using the dp[j-1] value from the *previous* iteration of the outer loop (i.e., from s[:i-1]).
            # If we iterated forward, dp[j-1] would have already been updated with the current character s[i-1].
            for j in range(n, 0, -1):
                # If the current characters of s and t match
                if s[i - 1] == t[j - 1]:
                    # We have two options:
                    # 1. Use s[i-1] to match t[j-1]: The number of ways is dp[j-1] (the number of ways to form t[:j-1] from s[:i-1]).
                    # 2. Don't use s[i-1] to match t[j-1]: The number of ways is dp[j] (the number of ways to form t[:j] from s[:i-1]).
                    # So, the total number of ways to form t[:j] from s[:i] is the sum of these two.
                    dp[j] = dp[j] + dp[j - 1]
                # If the characters do not match, we cannot use s[i-1] to match t[j-1].
                # The number of distinct subsequences of s[:i] that equal t[:j] is the same
                # as the number of distinct subsequences of s[:i-1] that equal t[:j].
                # This is already stored in dp[j] from the previous iteration of the outer loop,
                # so we don't need to do anything (dp[j] remains unchanged).
                # dp[j] = dp[j] # This line is implicit as we don't update dp[j] when chars don't match.

        # The final answer is the number of distinct subsequences of s[:m] that equal t[:n].
        return dp[n]

```