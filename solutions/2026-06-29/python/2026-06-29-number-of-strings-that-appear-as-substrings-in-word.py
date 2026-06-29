```python
# Problem: Number of Strings That Appear as Substrings in Word
# Link: https://leetcode.com/problems/number-of-strings-that-appear-as-substrings-in-word/
#
# Approach:
# We iterate through each string in the 'patterns' array. For each pattern string,
# we check if it is a substring of the 'word' string. Python's 'in' operator
# efficiently handles substring checking. We maintain a counter and increment it
# every time a pattern is found as a substring within the word.
#
# Time Complexity:
# Let N be the number of strings in 'patterns' and M be the maximum length of a string
# in 'patterns'. Let W be the length of 'word'.
# For each of the N patterns, we perform a substring check. In Python, the 'in'
# operator for strings has a time complexity that is roughly O(len(pattern) * len(word))
# in the worst case (though often faster in practice due to optimized algorithms).
# Therefore, the overall time complexity is approximately O(N * M * W).
# Given the constraints (N, M, W <= 100), this is at most O(100 * 100 * 100) = O(10^6),
# which is well within acceptable limits.
#
# Space Complexity:
# The space complexity is O(1) because we are only using a single counter variable
# to store the result and not creating any additional data structures that scale
# with the input size. The input strings themselves occupy space, but that's
# considered input space, not auxiliary space.

class Solution:
    def numOfStrings(self, patterns: list[str], word: str) -> int:
        # Initialize a counter to store the number of patterns found as substrings
        count = 0

        # Iterate through each string in the 'patterns' array
        for pattern in patterns:
            # Check if the current 'pattern' is a substring of 'word'
            # Python's 'in' operator efficiently checks for substring presence
            if pattern in word:
                # If the pattern is found as a substring, increment the counter
                count += 1

        # Return the total count of patterns that appeared as substrings in 'word'
        return count

```