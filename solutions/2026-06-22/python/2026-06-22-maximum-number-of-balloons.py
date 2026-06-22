```python
# Problem: Maximum Number of Balloons
# Link: https://leetcode.com/problems/maximum-number-of-balloons/
# Approach:
# The problem asks us to find the maximum number of times we can form the word "balloon"
# using the characters from a given text. We can only use each character once.
# To solve this, we need to count the frequency of each character required for "balloon"
# ('b', 'a', 'l', 'o', 'n') in the input text.
# For each character in "balloon", we determine how many times it can be formed
# based on its available count in the text.
# Specifically, 'b', 'a', and 'n' are needed once per "balloon".
# 'l' and 'o' are needed twice per "balloon".
#
# The limiting factor for the number of "balloon" instances will be the character
# that is least available relative to its requirement.
#
# We can use a hash map (dictionary in Python) to store the counts of characters in the input text.
# Then, we iterate through the required characters of "balloon":
# - For 'b', 'a', 'n': The number of "balloon"s is limited by the count of this character in `text`.
# - For 'l', 'o': Since each "balloon" needs two 'l's and two 'o's, the number of "balloon"s
#   is limited by `count_of_char // 2`.
#
# The minimum of these limitations for all characters will be our answer.
#
# Time Complexity: O(N), where N is the length of the input string `text`.
# We iterate through the input string once to count character frequencies.
# Then, we iterate through a fixed number of characters ('b', 'a', 'l', 'o', 'n')
# to determine the minimum instances.
#
# Space Complexity: O(1). We are using a hash map to store character counts.
# Since the input string consists only of lowercase English letters, the size of the
# hash map will be at most 26, which is a constant.

from collections import Counter

class Solution:
    def maxNumberOfBalloons(self, text: str) -> int:
        # Count the frequency of each character in the input text.
        # The Counter object provides a convenient way to do this.
        char_counts = Counter(text)

        # The word "balloon" requires the following characters with these frequencies:
        # 'b': 1
        # 'a': 1
        # 'l': 2
        # 'o': 2
        # 'n': 1

        # Calculate the maximum number of balloons based on the availability of each character.
        # For characters 'b', 'a', 'n', we need one of each per balloon.
        # So, the number of balloons is limited by their count directly.
        max_b = char_counts.get('b', 0)
        max_a = char_counts.get('a', 0)
        max_n = char_counts.get('n', 0)

        # For characters 'l' and 'o', we need two of each per balloon.
        # So, the number of balloons is limited by half of their count.
        max_l = char_counts.get('l', 0) // 2
        max_o = char_counts.get('o', 0) // 2

        # The overall maximum number of balloons we can form is limited by the minimum
        # of the calculated maximums for each required character.
        # We use `min()` to find the bottleneck.
        return min(max_b, max_a, max_l, max_o, max_n)

```