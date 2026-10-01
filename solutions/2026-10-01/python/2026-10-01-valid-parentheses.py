```python
# Summary: Determines if a string of parentheses, brackets, and braces is valid.
# Link: https://leetcode.com/problems/valid-parentheses/
#
# Approach:
# We can use a stack to solve this problem. The idea is to iterate through the input string.
# If we encounter an opening bracket ('(', '[', '{'), we push it onto the stack.
# If we encounter a closing bracket (')', ']', '}'), we check the top of the stack.
# If the stack is empty or the top element is not the corresponding opening bracket,
# then the string is invalid. Otherwise, we pop the opening bracket from the stack.
# After iterating through the entire string, if the stack is empty, it means all
# opening brackets have been closed correctly, and the string is valid.
#
# Time Complexity: O(n), where n is the length of the input string. We iterate through the string once.
# Space Complexity: O(n) in the worst case, where n is the length of the input string.
# This occurs when the input string consists only of opening brackets, and all are pushed onto the stack.

class Solution:
    def isValid(self, s: str) -> bool:
        # Initialize an empty stack to store opening brackets.
        stack = []
        # Define a mapping of closing brackets to their corresponding opening brackets.
        mapping = {")": "(", "}": "{", "]": "["}

        # Iterate through each character in the input string.
        for char in s:
            # If the character is a closing bracket:
            if char in mapping:
                # Check if the stack is empty or if the top element of the stack
                # does not match the corresponding opening bracket for the current closing bracket.
                # If either condition is true, the string is invalid.
                # We use a dummy value '#' if the stack is empty to avoid an IndexError.
                top_element = stack.pop() if stack else '#'
                if mapping[char] != top_element:
                    return False
            # If the character is an opening bracket:
            else:
                # Push the opening bracket onto the stack.
                stack.append(char)

        # After iterating through the entire string, if the stack is empty,
        # it means all opening brackets have been matched with their corresponding closing brackets,
        # and the string is valid. Otherwise, there are unmatched opening brackets,
        # and the string is invalid.
        return not stack

# Example Usage:
# solver = Solution()
# print(solver.isValid("()"))      # Output: True
# print(solver.isValid("()[]{}"))  # Output: True
# print(solver.isValid("(]"))      # Output: False
# print(solver.isValid("([])"))    # Output: True
# print(solver.isValid("([)]"))    # Output: False
```