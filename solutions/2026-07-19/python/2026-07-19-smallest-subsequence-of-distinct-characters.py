```python
# Finds the lexicographically smallest subsequence containing all distinct characters.
# Link: https://leetcode.com/problems/smallest-subsequence-of-distinct-characters/
#
# Approach:
# We use a stack-based approach with a greedy strategy.
# The idea is to iterate through the string and maintain a subsequence in the stack.
# For each character:
# 1. If the character is already in the current subsequence (marked by `in_stack`), skip it.
# 2. While the stack is not empty, the current character is lexicographically smaller than the top of the stack,
#    AND the character at the top of the stack appears later in the string (meaning we can potentially add it back later
#    if it's needed), we pop the character from the stack and update `in_stack`. This ensures we prioritize smaller
#    characters earlier in the subsequence.
# 3. Push the current character onto the stack and mark it as `in_stack`.
# Finally, join the characters in the stack to form the result.
#
# To efficiently check if a character appears later, we precompute the last occurrence index of each character.
#
# Time Complexity: O(N), where N is the length of the string. Each character is pushed and popped from the stack at most once.
# Space Complexity: O(K), where K is the number of distinct characters in the string (at most 26 for lowercase English letters).
# This is for the `last_occurrence` dictionary and the `in_stack` set. The stack itself can also grow up to size K.

class Solution:
    def smallestSubsequence(self, s: str) -> str:
        # Dictionary to store the last occurrence index of each character
        last_occurrence = {}
        for i, char in enumerate(s):
            last_occurrence[char] = i

        # Stack to build the result subsequence
        stack = []
        # Set to keep track of characters currently in the stack
        in_stack = set()

        # Iterate through the input string
        for i, char in enumerate(s):
            # If the character is already in the stack, skip it
            if char in in_stack:
                continue

            # While the stack is not empty, and the current character is lexicographically
            # smaller than the top of the stack, and the character at the top of the stack
            # appears later in the string (meaning we can potentially add it back later).
            # This condition ensures that we always try to keep the smallest possible
            # characters at the beginning of our subsequence.
            while stack and char < stack[-1] and i < last_occurrence[stack[-1]]:
                # Pop the character from the stack and remove it from in_stack
                removed_char = stack.pop()
                in_stack.remove(removed_char)

            # Push the current character onto the stack and add it to in_stack
            stack.append(char)
            in_stack.add(char)

        # Join the characters in the stack to form the result string
        return "".join(stack)

```