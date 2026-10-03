# Find the length of the longest valid parentheses substring.
# Link: https://leetcode.com/problems/longest-valid-parentheses/
#
# Approach:
# We can solve this problem using dynamic programming or a stack.
#
# Dynamic Programming Approach:
# Let dp[i] be the length of the longest valid parentheses substring ending at index i.
# If s[i] is '(': dp[i] = 0, as a valid substring cannot end with an opening parenthesis.
# If s[i] is ')':
#   1. If s[i-1] is '(': The substring ending at i is formed by adding "()" to the valid substring ending at i-2. So, dp[i] = dp[i-2] + 2. (Handle i-2 < 0 case)
#   2. If s[i-1] is ')': We need to check if there's a matching '(' before the valid substring ending at i-1. Let j = i - dp[i-1] - 1. If j >= 0 and s[j] == '(', then the current valid substring is formed by the valid substring ending at i-1, plus the pair s[j] and s[i], and potentially any valid substring before s[j]. So, dp[i] = dp[i-1] + 2 + (dp[j-1] if j-1 >= 0 else 0).
# The maximum value in the dp array will be the answer.
#
# Stack Approach:
# We can use a stack to keep track of the indices of opening parentheses.
# When we encounter '(', we push its index onto the stack.
# When we encounter ')':
#   - If the stack is not empty, it means we found a matching '('. We pop the stack.
#     - The length of the current valid substring is `i - stack.top()`. If the stack becomes empty after popping, it means the valid substring starts from the beginning of the string (or the last unmatched ')' encountered). In this case, the length is `i + 1`.
#     - If the stack is not empty after popping, the length is `i - stack.top()`, where `stack.top()` is the index of the last unmatched '('.
#   - If the stack is empty, it means the current ')' is unmatched. We push its index onto the stack to mark it as a boundary for future valid substrings.
# We maintain a `max_length` variable to store the maximum length found.
# To handle cases like "()(())", when the stack is empty after popping, we consider the "last invalid index". We initialize the stack with -1 to handle the case where the first character is '('.
#
# Time Complexity: O(n), where n is the length of the string. We iterate through the string once.
# Space Complexity: O(n) for the DP array or the stack in the worst case (e.g., "((((...))))").
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        # Initialize max_length to 0, which will store the length of the longest valid parentheses substring.
        max_length = 0
        # Initialize a stack to store indices. We push -1 initially to act as a base for calculations.
        # This -1 helps in calculating the length when the first valid pair starts from index 0,
        # or when a valid substring is found after an unmatched ')' whose index is stored.
        stack = [-1]

        # Iterate through the string with both index and character.
        for i, char in enumerate(s):
            # If the current character is an opening parenthesis '(', push its index onto the stack.
            if char == '(':
                stack.append(i)
            # If the current character is a closing parenthesis ')'.
            else:
                # Pop the top element from the stack. This element would be the index of the most recent unmatched '('.
                stack.pop()
                # After popping, if the stack becomes empty, it means the current ')' is unmatched,
                # or it completes a valid substring that extends all the way back to the starting point.
                # In this case, push the current index 'i' onto the stack. This 'i' will serve as the new base for future length calculations.
                if not stack:
                    stack.append(i)
                # If the stack is not empty after popping, it means we have found a valid pair.
                # The length of this valid substring is the current index 'i' minus the index of the last unmatched parenthesis (which is now at the top of the stack).
                # Update max_length with the maximum of its current value and the length of this newly found valid substring.
                else:
                    max_length = max(max_length, i - stack[-1])

        # Return the maximum length found.
        return max_length

```