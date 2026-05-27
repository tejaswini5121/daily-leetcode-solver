```python
# Counts special characters in a string where a character is special if its lowercase
# occurrence appears before its first uppercase occurrence.
# Link: https://leetcode.com/problems/count-the-number-of-special-characters-ii/
#
# Approach:
# We can iterate through the string and keep track of the first occurrence of each
# lowercase and uppercase letter.
# For each letter 'a' through 'z':
# 1. Find the index of its first lowercase occurrence.
# 2. Find the index of its first uppercase occurrence.
# If both lowercase and uppercase occurrences exist, and the lowercase occurrence
# appears before the first uppercase occurrence, then this letter is special.
# We can use dictionaries or arrays to store the first occurrence indices for
# lowercase and uppercase letters.
#
# Time Complexity: O(N), where N is the length of the input string. We iterate through
# the string once to find the first occurrences of each character. Then, we iterate
# through the alphabet (26 characters) to check the special character condition.
#
# Space Complexity: O(1), as we use fixed-size arrays (or dictionaries with at most 26 entries)
# to store the first occurrence indices, regardless of the input string's length.

class Solution:
    def numberOfSpecialChars(self, word: str) -> int:
        # Initialize arrays to store the first occurrence index of lowercase and uppercase letters.
        # We use -1 to indicate that a character has not been seen yet.
        # The size is 26 for 'a' to 'z'.
        first_occurrence_lower = [-1] * 26
        first_occurrence_upper = [-1] * 26

        # Iterate through the input string to record the first occurrences.
        for i, char in enumerate(word):
            if 'a' <= char <= 'z':
                # Calculate the index for the lowercase character (0 for 'a', 1 for 'b', etc.)
                idx = ord(char) - ord('a')
                # If this is the first time we see this lowercase character, record its index.
                if first_occurrence_lower[idx] == -1:
                    first_occurrence_lower[idx] = i
            elif 'A' <= char <= 'Z':
                # Calculate the index for the uppercase character (0 for 'A', 1 for 'B', etc.)
                idx = ord(char) - ord('A')
                # If this is the first time we see this uppercase character, record its index.
                if first_occurrence_upper[idx] == -1:
                    first_occurrence_upper[idx] = i

        # Initialize a counter for special characters.
        special_count = 0

        # Iterate through the alphabet to check which characters are special.
        for i in range(26):
            # Check if both lowercase and uppercase versions of the character exist in the string.
            # first_occurrence_lower[i] != -1 means the lowercase character was found.
            # first_occurrence_upper[i] != -1 means the uppercase character was found.
            if first_occurrence_lower[i] != -1 and first_occurrence_upper[i] != -1:
                # Check if the first lowercase occurrence appears before the first uppercase occurrence.
                if first_occurrence_lower[i] < first_occurrence_upper[i]:
                    # If both conditions are met, increment the special character count.
                    special_count += 1

        # Return the total count of special characters.
        return special_count

```