```cpp
/*
Problem Summary: Find the minimum ASCII sum of deleted characters to make two strings equal.
Link: https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/

Approach:
This problem can be solved using dynamic programming, similar to the Longest Common Subsequence (LCS) problem.
We want to find the longest common subsequence (in terms of ASCII values) between the two strings.
The characters that are part of this common subsequence will NOT be deleted.
The characters that are NOT part of this common subsequence WILL be deleted.

Let dp[i][j] be the minimum ASCII delete sum to make s1[0...i-1] and s2[0...j-1] equal.

Base cases:
- dp[0][0] = 0 (empty strings are equal with no deletions)
- dp[i][0] = sum of ASCII values of s1[0...i-1] (to make s1[0...i-1] equal to an empty string, delete all characters from s1)
- dp[0][j] = sum of ASCII values of s2[0...j-1] (to make s2[0...j-1] equal to an empty string, delete all characters from s2)

Transitions:
1. If s1[i-1] == s2[j-1]:
   The last characters match. We don't need to delete them. The minimum delete sum is the same as the sum for s1[0...i-2] and s2[0...j-2].
   dp[i][j] = dp[i-1][j-1]

2. If s1[i-1] != s2[j-1]:
   The last characters do not match. We have three options:
   a. Delete s1[i-1]: The cost is ASCII of s1[i-1] + minimum delete sum for s1[0...i-2] and s2[0...j-1].
      Cost = s1[i-1] + dp[i-1][j]
   b. Delete s2[j-1]: The cost is ASCII of s2[j-1] + minimum delete sum for s1[0...i-1] and s2[0...j-2].
      Cost = s2[j-1] + dp[i][j-1]
   c. Delete both s1[i-1] and s2[j-1]: This case is implicitly covered by options a and b. If we delete both, it's like considering the problem for s1[0..i-2] and s2[0..j-2] and adding the ASCII of both characters. However, this won't be optimal compared to deleting just one if the other character could form a longer common subsequence.
   We take the minimum of the costs from deleting s1[i-1] or s2[j-1].
   dp[i][j] = min(s1[i-1] + dp[i-1][j], s2[j-1] + dp[i][j-1])

The final answer will be dp[s1.length()][s2.length()].

Alternatively, we can compute the total ASCII sum of both strings and subtract twice the ASCII sum of their Longest Common Subsequence (LCS). This approach might be conceptually simpler if we already have an LCS function. However, the DP approach directly calculates the minimum delete sum, which is what the problem asks for.

Let's stick to the direct DP approach described above.

Time Complexity:
O(m*n), where m is the length of s1 and n is the length of s2.
We iterate through the entire dp table of size (m+1) x (n+1).

Space Complexity:
O(m*n) for the dp table. This can be optimized to O(min(m,n)) space by observing that each row only depends on the previous row.
However, for clarity and ease of implementation, we will use O(m*n) space.
*/

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

class Solution {
public:
    int minimumDeleteSum(std::string s1, std::string s2) {
        int m = s1.length();
        int n = s2.length();

        // dp[i][j] will store the minimum ASCII delete sum to make
        // s1[0...i-1] and s2[0...j-1] equal.
        std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));

        // Initialize base cases:
        // If one string is empty, we must delete all characters from the other string.

        // dp[i][0]: Make s1[0...i-1] equal to an empty string.
        // This means deleting all characters from s1[0...i-1].
        for (int i = 1; i <= m; ++i) {
            dp[i][0] = dp[i - 1][0] + s1[i - 1];
        }

        // dp[0][j]: Make s2[0...j-1] equal to an empty string.
        // This means deleting all characters from s2[0...j-1].
        for (int j = 1; j <= n; ++j) {
            dp[0][j] = dp[0][j - 1] + s2[j - 1];
        }

        // Fill the DP table
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j) {
                // If the current characters match
                if (s1[i - 1] == s2[j - 1]) {
                    // We don't need to delete these characters.
                    // The minimum delete sum is the same as the sum for the prefixes excluding these characters.
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    // If the current characters do not match, we have two options:
                    // 1. Delete s1[i-1]: Cost is ASCII of s1[i-1] plus the minimum delete sum
                    //    for s1[0...i-2] and s2[0...j-1].
                    // 2. Delete s2[j-1]: Cost is ASCII of s2[j-1] plus the minimum delete sum
                    //    for s1[0...i-1] and s2[0...j-2].
                    // We take the minimum of these two options.
                    dp[i][j] = std::min(dp[i - 1][j] + s1[i - 1], dp[i][j - 1] + s2[j - 1]);
                }
            }
        }

        // The final answer is the minimum delete sum to make the entire s1 and s2 equal.
        return dp[m][n];
    }
};
```