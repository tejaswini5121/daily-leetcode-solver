```python
# Problem: Find the Length of the Longest Common Prefix
# Link: https://leetcode.com/problems/find-the-length-of-the-longest-common-prefix/
#
# Approach:
# To find the longest common prefix among all pairs (x, y) where x is from arr1 and y is from arr2,
# we can convert the integers to strings and then compare them.
# A naive approach would be to iterate through all pairs (x, y) and compute their longest common prefix.
# However, this would lead to O(N*M*L) time complexity where N and M are lengths of arr1 and arr2,
# and L is the maximum length of the integer strings.
#
# A more efficient approach involves using a Trie (prefix tree) or a set to store prefixes.
# We can iterate through one array (say, arr1), convert each number to its string representation,
# and then generate all its prefixes. We store these prefixes in a data structure that allows
# efficient lookup. A hash set is a good choice for this.
#
# Then, we iterate through the second array (arr2), convert each number to its string representation,
# and for each number, we iterate through its prefixes from longest to shortest. For each prefix,
# we check if it exists in the set of prefixes from arr1. The first prefix (which will be the longest)
# that is found in the set is a common prefix. We keep track of the maximum length of such common prefixes.
#
# To optimize further, instead of storing all prefixes in the set, we can store all numbers from
# arr1 as strings in a set. Then, for each number in arr2, we can iterate through its prefixes
# from longest to shortest and check if that prefix string is present in the set of arr1 strings.
# This way, we are directly checking if a number from arr2 has a common prefix that *is* a number in arr1.
# This interpretation aligns better with the problem statement where a common prefix *is* an integer.
#
# Let's refine the approach:
# 1. Convert all numbers in arr1 to their string representations and store them in a set `arr1_strings`.
# 2. Initialize `max_common_prefix_length` to 0.
# 3. Iterate through each number `num2` in `arr2`.
# 4. Convert `num2` to its string representation `s2`.
# 5. Iterate through the possible lengths of prefixes of `s2`, from `len(s2)` down to 1.
#    For each length `l`:
#    a. Extract the prefix `prefix = s2[:l]`.
#    b. Check if `prefix` exists in `arr1_strings`.
#    c. If `prefix` is found in `arr1_strings`:
#       i. This `prefix` is a common prefix. Update `max_common_prefix_length = max(max_common_prefix_length, l)`.
#       ii. Since we are iterating from longest prefix to shortest, the first match we find for `s2` will be its longest common prefix with any string in `arr1_strings`. We can then break the inner loop for `s2` and move to the next number in `arr2`.
# 6. Return `max_common_prefix_length`.
#
# Time Complexity Analysis:
# Let N be the length of arr1, M be the length of arr2, and L be the maximum number of digits in any integer (which is at most 9 for 10^8).
# Converting arr1 to strings and storing in a set: O(N * L) on average for string conversions and set insertions.
# Iterating through arr2: M numbers.
# For each number in arr2:
#   Converting to string: O(L).
#   Iterating through prefixes: At most L prefixes.
#   Checking prefix in set: O(L) on average (string hashing).
# Total time for arr2 iteration: O(M * L * L).
# Overall Time Complexity: O(N*L + M*L^2) which simplifies to O(M*L^2) if M*L > N.
# Given L <= 9, this is efficient enough. For constraints L=9, N=M=5e4, this is roughly 5e4 * 9^2 which is around 4e6 operations per array, well within limits.
#
# Space Complexity Analysis:
# Storing strings of arr1 in a set: O(N * L) space in the worst case.
# Overall Space Complexity: O(N * L).

class Solution:
    def longestCommonPrefix(self, arr1: list[int], arr2: list[int]) -> int:
        # Convert all numbers in arr1 to their string representations and store in a set
        # This allows for O(L) average time lookup for string prefixes.
        arr1_strings = set()
        for num in arr1:
            arr1_strings.add(str(num))

        # Initialize the maximum length of a common prefix found so far.
        max_common_prefix_length = 0

        # Iterate through each number in arr2.
        for num2 in arr2:
            # Convert the current number from arr2 to its string representation.
            s2 = str(num2)
            
            # Iterate through all possible prefix lengths for s2, from longest to shortest.
            # This is crucial because we want the *longest* common prefix.
            # The length of the prefix can range from the full string length down to 1.
            for length in range(len(s2), 0, -1):
                # Extract the current prefix.
                prefix = s2[:length]

                # Check if this prefix exists as a complete number string in arr1_strings.
                # If it does, it means we've found a common prefix that is an integer present in arr1.
                if prefix in arr1_strings:
                    # We found a common prefix. Update the maximum length if this prefix is longer.
                    max_common_prefix_length = max(max_common_prefix_length, length)
                    # Since we are iterating from the longest possible prefix downwards,
                    # the first match we find for the current s2 will be its longest common prefix
                    # with any number in arr1. We can break the inner loop and move to the next number in arr2.
                    break

        # Return the maximum length of the common prefix found across all pairs.
        return max_common_prefix_length

```