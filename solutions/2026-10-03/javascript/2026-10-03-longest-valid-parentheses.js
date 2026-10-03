/**
 * @file LeetCode Problem: Longest Valid Parentheses
 * @brief Given a string containing only '(' and ')', find the length of the longest valid parentheses substring.
 * @link https://leetcode.com/problems/longest-valid-parentheses/
 *
 * @approach
 * This problem can be solved using dynamic programming. We define dp[i] as the length of the longest valid parentheses substring ending at index i.
 *
 * If s[i] is '(':
 *   A valid parentheses substring cannot end with an opening parenthesis. So, dp[i] = 0.
 *
 * If s[i] is ')':
 *   Case 1: The previous character s[i-1] is '('.
 *     In this case, we have found a pair "()". The length of the valid substring ending at i will be 2 plus the length of the valid substring ending at i-2 (if i-2 is valid).
 *     So, dp[i] = (i >= 2 ? dp[i-2] : 0) + 2.
 *
 *   Case 2: The previous character s[i-1] is ')'.
 *     If s[i-1] is ')', we need to look for a matching opening parenthesis for s[i]. The potential matching opening parenthesis would be at index `i - dp[i-1] - 1`.
 *     Let `prev_open_idx = i - dp[i-1] - 1`.
 *     If `prev_open_idx` is a valid index (>= 0) and `s[prev_open_idx]` is '(', then we have found a valid pair.
 *     The length of the valid substring ending at i will be `dp[i-1]` (length of the valid substring ending at i-1) + 2 (for the current matching pair) + the length of the valid substring ending before the matching opening parenthesis (i.e., at `prev_open_idx - 1`).
 *     So, dp[i] = dp[i-1] + ((prev_open_idx >= 0) ? dp[prev_open_idx - 1] : 0) + 2.
 *
 * We iterate through the string, calculate dp[i] for each i, and keep track of the maximum value in the dp array, which will be our answer.
 *
 * @time_complexity O(n), where n is the length of the string. We iterate through the string once to fill the dp array.
 * @space_complexity O(n), where n is the length of the string. We use a dp array of size n.
 */

/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
    // Initialize a dp array of the same length as the string, filled with zeros.
    // dp[i] will store the length of the longest valid parentheses substring ending at index i.
    const dp = new Array(s.length).fill(0);
    // Initialize the maximum length found so far to 0.
    let maxLength = 0;

    // Iterate through the string starting from the second character (index 1).
    // The first character (index 0) cannot form a valid pair by itself.
    for (let i = 1; i < s.length; i++) {
        // If the current character is a closing parenthesis ')'.
        if (s[i] === ')') {
            // Case 1: The previous character is an opening parenthesis '('.
            // This forms a "()" pair.
            if (s[i - 1] === '(') {
                // The length of the valid substring ending at i is 2 (for the "()" pair)
                // plus the length of the valid substring ending at i-2.
                // If i-2 is out of bounds (i.e., i < 2), we add 0.
                dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
            }
            // Case 2: The previous character is also a closing parenthesis ')'.
            // We need to find a matching opening parenthesis for the current ')'.
            else if (s[i - 1] === ')') {
                // The potential matching opening parenthesis would be at index `i - dp[i-1] - 1`.
                // `dp[i-1]` is the length of the valid substring ending at `i-1`.
                // Subtracting `dp[i-1]` from `i` gives the index of the character before the valid substring ending at `i-1`.
                // Subtracting another 1 checks the character immediately before that valid substring.
                const prevOpenIndex = i - dp[i - 1] - 1;

                // Check if `prevOpenIndex` is a valid index and if the character at `prevOpenIndex` is an opening parenthesis '('.
                if (prevOpenIndex >= 0 && s[prevOpenIndex] === '(') {
                    // If a matching opening parenthesis is found:
                    // The length of the valid substring ending at i is:
                    // 1. The length of the valid substring ending at `i-1` (`dp[i-1]`).
                    // 2. Plus 2 for the current matching pair "()".
                    // 3. Plus the length of the valid substring ending just before the matching opening parenthesis, which is `dp[prevOpenIndex - 1]`.
                    //    If `prevOpenIndex - 1` is out of bounds, we add 0.
                    dp[i] = dp[i - 1] + ((prevOpenIndex >= 1) ? dp[prevOpenIndex - 1] : 0) + 2;
                }
            }
        }
        // If the current character is '(', dp[i] remains 0 because a valid parentheses substring cannot end with '('.

        // Update `maxLength` with the maximum value found in the `dp` array so far.
        maxLength = Math.max(maxLength, dp[i]);
    }

    // Return the overall maximum length of a valid parentheses substring.
    return maxLength;
};
```