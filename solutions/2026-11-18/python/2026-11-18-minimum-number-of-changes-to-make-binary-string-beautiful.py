```python
# Problem: Minimum Number of Changes to Make Binary String Beautiful
# Link: https://leetcode.com/problems/minimum-number-of-changes-to-make-binary-string-beautiful/
#
# Approach:
# A beautiful string can be partitioned into substrings of even length, where each substring
# consists of only 0s or only 1s. This means that within each substring of length 2,
# the characters must be the same. Therefore, for a string to be beautiful, for every
# pair of adjacent characters at indices i and i+1 (where i is even), s[i] must be
# equal to s[i+1]. We can iterate through the string with a step of 2 and count the
# number of adjacent pairs that have different characters. Each such pair requires
# one change to make them identical.
#
# Time Complexity: O(n), where n is the length of the string s. We iterate through the string once.
# Space Complexity: O(1), as we only use a few variables to store the count.

class Solution:
    def minChanges(self, s: str) -> int:
        """
        Calculates the minimum number of changes to make a binary string beautiful.
        """
        changes = 0  # Initialize the count of changes
        n = len(s)  # Get the length of the string

        # Iterate through the string with a step of 2, checking pairs of adjacent characters
        # The loop goes from index 0 up to n-2 (inclusive), incrementing by 2 each time.
        # This covers all pairs (s[0], s[1]), (s[2], s[3]), ..., (s[n-2], s[n-1]).
        for i in range(0, n, 2):
            # If the current character is different from the next character in the pair
            if s[i] != s[i+1]:
                changes += 1  # Increment the changes count, as one of them needs to be changed

        return changes  # Return the total minimum number of changes required

```