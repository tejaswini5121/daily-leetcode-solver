// Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.
// LeetCode: https://leetcode.com/problems/longest-valid-parentheses/
// Approach:
// We can use dynamic programming to solve this problem. Let dp[i] be the length of the longest valid parentheses substring ending at index i.
// If s[i] is '(', dp[i] is 0, as it cannot end a valid substring.
// If s[i] is ')', we have two cases:
// 1. If s[i-1] is '(', then the substring ending at i is "..." + "()". The length of this valid substring is dp[i-2] + 2.
// 2. If s[i-1] is ')', we need to check if there's a matching '(' before the current valid substring. The index of this potential matching '(' would be i - dp[i-1] - 1. If s[i - dp[i-1] - 1] is '(', then we have formed a larger valid substring. The length would be dp[i-1] + 2 (for the outer pair) + the length of the valid substring before the matching '(', which is dp[i - dp[i-1] - 2].
// We need to handle boundary conditions carefully. The maximum value in the dp array will be our answer.
// Time Complexity: O(n), where n is the length of the string. We iterate through the string once.
// Space Complexity: O(n), for the dp array.
class Solution {
    public int longestValidParentheses(String s) {
        int n = s.length();
        // dp[i] will store the length of the longest valid parentheses substring ending at index i.
        int[] dp = new int[n];
        int maxLength = 0;

        // Iterate through the string starting from the second character.
        for (int i = 1; i < n; i++) {
            // If the current character is a closing parenthesis ')'.
            if (s.charAt(i) == ')') {
                // Case 1: The previous character is an opening parenthesis '('.
                // This forms a "()" pair. The length is 2 plus the length of the valid substring ending at i-2.
                if (s.charAt(i - 1) == '(') {
                    // dp[i-2] accounts for valid parentheses before this "()".
                    // If i-2 < 0, it means there are no characters before, so we just add 2.
                    dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
                }
                // Case 2: The previous character is also a closing parenthesis ')'.
                // We need to look for a matching opening parenthesis before the valid substring ending at i-1.
                // The index of this potential matching '(' would be i - dp[i-1] - 1.
                else if (i - dp[i - 1] > 0 && s.charAt(i - dp[i - 1] - 1) == '(') {
                    // dp[i-1] is the length of the valid substring ending at i-1.
                    // i - dp[i-1] - 1 is the index of the matching '('.
                    // dp[i-1] + 2 accounts for the newly formed larger valid pair.
                    // dp[i - dp[i-1] - 2] accounts for any valid parentheses substring that might exist before this larger pair.
                    // If i - dp[i-1] - 2 < 0, it means there are no characters before, so we add 0.
                    dp[i] = dp[i - 1] + ((i - dp[i - 1]) >= 2 ? dp[i - dp[i - 1] - 2] : 0) + 2;
                }
            }
            // Update the maximum length found so far.
            maxLength = Math.max(maxLength, dp[i]);
        }
        // Return the overall maximum length of a valid parentheses substring.
        return maxLength;
    }
}
