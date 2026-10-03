// Problem: Longest Valid Parentheses
// Link: https://leetcode.com/problems/longest-valid-parentheses/
//
// Approach:
// We can solve this problem using dynamic programming. Let dp[i] be the length of the longest valid parentheses substring ending at index i.
// If s[i] is '(', dp[i] will always be 0 because a valid parentheses substring cannot end with an opening parenthesis.
// If s[i] is ')':
//   1. If s[i-1] is '(': This means we found a pair "()". The length of the valid substring ending at i will be 2 plus the length of the valid substring ending at i-2 (if i-2 is valid). So, dp[i] = dp[i-2] + 2.
//   2. If s[i-1] is ')': This means we have a situation like "...))". We need to check if there's a matching opening parenthesis for the current closing parenthesis. The matching opening parenthesis would be at index i - dp[i-1] - 1.
//      If this index is valid (>= 0) and s[i - dp[i-1] - 1] is '(':
//         Then we have found a larger valid substring. The length will be dp[i-1] (the length of the valid substring ending at i-1) plus 2 (for the current pair) plus the length of any valid substring ending *before* the matching opening parenthesis (i.e., at index i - dp[i-1] - 2).
//         So, dp[i] = dp[i-1] + 2 + dp[i - dp[i-1] - 2].
// The maximum value in the dp array will be the answer.
//
// Time Complexity: O(n), where n is the length of the string s. We iterate through the string once to fill the dp array.
// Space Complexity: O(n), for the dp array.

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    int longestValidParentheses(std::string s) {
        int n = s.length();
        if (n == 0) {
            return 0;
        }

        // dp[i] will store the length of the longest valid parentheses substring ending at index i.
        std::vector<int> dp(n, 0);
        int maxLength = 0;

        // Iterate through the string starting from the second character.
        for (int i = 1; i < n; ++i) {
            // If the current character is a closing parenthesis.
            if (s[i] == ')') {
                // Case 1: The previous character is an opening parenthesis.
                // This forms a pair "()".
                if (s[i - 1] == '(') {
                    // The length is 2 plus the length of the valid substring ending at i-2.
                    // If i-2 is out of bounds, dp[i-2] is considered 0.
                    dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
                }
                // Case 2: The previous character is also a closing parenthesis.
                // This looks like "...))". We need to find a matching opening parenthesis.
                else { // s[i-1] == ')'
                    // The potential matching opening parenthesis would be at index i - dp[i-1] - 1.
                    // dp[i-1] is the length of the valid substring ending at i-1.
                    // So, the character before that valid substring is at i - dp[i-1] - 1.
                    int prevOpeningIndex = i - dp[i - 1] - 1;

                    // Check if the potential matching opening parenthesis is within bounds and is indeed an opening parenthesis.
                    if (prevOpeningIndex >= 0 && s[prevOpeningIndex] == '(') {
                        // The length is:
                        // dp[i-1] (length of valid substring ending at i-1)
                        // + 2 (for the current pair "()")
                        // + dp[prevOpeningIndex - 1] (length of valid substring ending before the matched opening parenthesis).
                        // If prevOpeningIndex - 1 is out of bounds, dp[prevOpeningIndex - 1] is 0.
                        dp[i] = dp[i - 1] + 2 + (prevOpeningIndex >= 1 ? dp[prevOpeningIndex - 1] : 0);
                    }
                }
            }
            // Update the overall maximum length found so far.
            maxLength = std::max(maxLength, dp[i]);
        }

        return maxLength;
    }
};

// Example of how to use the Solution class (optional, for testing locally)
/*
int main() {
    Solution sol;
    std::cout << "Input: \"(()\"" << std::endl;
    std::cout << "Output: " << sol.longestValidParentheses("(()") << std::endl; // Expected: 2

    std::cout << "Input: \")()())\"" << std::endl;
    std::cout << "Output: " << sol.longestValidParentheses(")()())") << std::endl; // Expected: 4

    std::cout << "Input: \"\"" << std::endl;
    std::cout << "Output: " << sol.longestValidParentheses("") << std::endl; // Expected: 0

    std::cout << "Input: \"()(()\"" << std::endl;
    std::cout << "Output: " << sol.longestValidParentheses("()(()") << std::endl; // Expected: 2

    std::cout << "Input: \"()(())()\"" << std::endl;
    std::cout << "Output: " << sol.longestValidParentheses("()(())()") << std::endl; // Expected: 8

    return 0;
}
*/