```python
# Problem: Check if Strings Can be Made Equal With Operations II
# Link: https://leetcode.com/problems/check-if-strings-can-be-made-equal-with-operations-ii/
#
# Approach:
# The core idea is to understand what the allowed swap operation preserves.
# The operation allows swapping characters at indices i and j where j - i is even.
# This means we can swap characters within even positions (0, 2, 4, ...) and
# within odd positions (1, 3, 5, ...). However, we cannot swap a character
# from an even position with a character from an odd position.
#
# Therefore, if two strings can be made equal, two conditions must be met:
# 1. They must have the same count of each character. This is a necessary
#    condition for any permutation, including those achievable by our
#    specific swaps.
# 2. The characters at even indices in s1 must be a permutation of the
#    characters at even indices in s2.
# 3. The characters at odd indices in s1 must be a permutation of the
#    characters at odd indices in s2.
#
# Conditions 2 and 3 can be checked by sorting the characters at even indices
# of both strings and comparing them, and doing the same for odd indices.
# If both sorted even-indexed character lists and sorted odd-indexed character
# lists are identical for s1 and s2, then the strings can be made equal.
#
# We can use frequency maps (or character counts) to check condition 1.
# For conditions 2 and 3, we extract characters at even/odd indices, sort them,
# and compare.
#
# Alternatively, and more efficiently: if the character counts for the entire
# strings are the same, and the sorted characters at even positions are the same,
# and the sorted characters at odd positions are the same, then the strings
# can be made equal. We don't need separate character count checks if we are
# already comparing sorted even/odd parts.
#
# The most straightforward way to check if the characters at even/odd indices
# can be made to match is to collect all characters at even indices into one
# list and all characters at odd indices into another list, for each string.
# Then, sort these lists and compare them. If the sorted even-indexed character
# lists are identical, and the sorted odd-indexed character lists are identical,
# then the strings can be made equal.
#
# Time Complexity:
# - Iterating through the strings to collect characters: O(n)
# - Sorting the characters at even indices: O((n/2) log (n/2)) which is O(n log n)
# - Sorting the characters at odd indices: O((n/2) log (n/2)) which is O(n log n)
# - Comparing the sorted lists: O(n)
# Overall: O(n log n) due to sorting.
#
# Space Complexity:
# - Storing characters for even indices: O(n)
# - Storing characters for odd indices: O(n)
# Overall: O(n) for the auxiliary lists.

class Solution:
    def checkStrings(self, s1: str, s2: str) -> bool:
        n = len(s1)

        # Extract characters at even indices for s1 and s2
        s1_even_chars = []
        s2_even_chars = []
        for i in range(0, n, 2):
            s1_even_chars.append(s1[i])
            s2_even_chars.append(s2[i])

        # Extract characters at odd indices for s1 and s2
        s1_odd_chars = []
        s2_odd_chars = []
        for i in range(1, n, 2):
            s1_odd_chars.append(s1[i])
            s2_odd_chars.append(s2[i])

        # Sort the extracted character lists
        s1_even_chars.sort()
        s2_even_chars.sort()
        s1_odd_chars.sort()
        s2_odd_chars.sort()

        # Check if the sorted even-indexed characters are the same
        # and if the sorted odd-indexed characters are the same.
        # If both conditions are met, the strings can be made equal.
        return s1_even_chars == s2_even_chars and s1_odd_chars == s2_odd_chars

```