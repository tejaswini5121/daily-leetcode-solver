```python
# Problem: Check if All A's Appears Before All B's
# Link: https://leetcode.com/problems/check-if-all-as-appears-before-all-bs/
#
# Approach:
# The problem asks to verify if all occurrences of 'a' in a string appear before all occurrences of 'b'.
# This condition is violated if we encounter an 'a' after we have already seen a 'b'.
# We can iterate through the string and maintain a flag indicating whether we have encountered a 'b' yet.
# If we find an 'a' after the 'b' flag is set, then the condition is false.
# If we iterate through the entire string without finding such a violation, the condition is true.
#
# Time Complexity: O(n), where n is the length of the string s. We iterate through the string once.
# Space Complexity: O(1). We only use a constant amount of extra space for the flag variable.

class Solution:
    def checkString(self, s: str) -> bool:
        # Initialize a flag to track if we have encountered a 'b'
        seen_b = False

        # Iterate through each character in the string
        for char in s:
            # If the current character is 'b', set the seen_b flag to True
            if char == 'b':
                seen_b = True
            # If the current character is 'a' and we have already seen a 'b'
            # This means an 'a' appears after a 'b', which violates the condition
            elif char == 'a' and seen_b:
                return False

        # If we finish iterating through the string without finding any 'a' after a 'b',
        # it means all 'a's appear before all 'b's (or there are no 'a's or no 'b's).
        return True

```