```python
# Problem: Smallest Palindromic Rearrangement II
# Link: https://leetcode.com/problems/smallest-palindromic-rearrangement-ii/
#
# Approach:
# The core idea is to count the frequency of each character in the input palindromic string 's'.
# Since 's' is a palindrome, the counts of characters (except possibly one for odd length strings)
# will be even. These counts determine the available characters for constructing the first half
# of the palindromic rearrangement.
#
# A palindromic rearrangement is determined by its first half. For example, if the first half
# is "abc", the full palindrome will be "abcba" (if odd length) or "abccba" (if even length).
# The problem then reduces to finding the k-th lexicographically smallest permutation of the
# characters available for the first half.
#
# We first calculate the frequencies of each character in 's'.
# Then, we construct the set of characters and their counts that will form the first half
# of the palindrome. If 's' has an odd length, one character will appear an odd number of times;
# this character will be the center of the palindrome. The remaining characters (with even counts)
# will contribute half of their count to the first half.
#
# We can use a combinatorial approach similar to finding the k-th permutation.
# We will iterate through possible characters for the first position of the first half
# (lexicographically sorted). For each character, we calculate how many palindromic
# rearrangements can be formed if that character is chosen. This count is determined by
# the number of permutations of the remaining characters for the rest of the first half.
# The number of permutations of 'n' items with counts n1, n2, ..., nk is n! / (n1! * n2! * ... * nk!).
#
# We precompute factorials and inverse factorials (or use modular inverse if dealing with large numbers,
# but here constraints are manageable with direct calculation for combinations).
#
# We iterate through the sorted unique characters available for the first half.
# For each character, we calculate the number of permutations if this character is placed
# at the current position. If 'k' is less than or equal to this count, we have found the
# character for the current position. We append it to our result (which will form the
# first half), decrement its count, and move to the next position.
# If 'k' is greater than this count, we subtract this count from 'k' and try the next
# lexicographically larger character.
#
# This process is repeated until the first half is fully constructed.
# Once the first half is constructed, the full palindrome is formed by concatenating
# the first half, the middle character (if any), and the reverse of the first half.
#
# If at any point 'k' remains positive after considering all possible characters for a position,
# it means there are fewer than 'k' distinct palindromic rearrangements, and we return an empty string.
#
# Time Complexity:
# - Character counting: O(N), where N is the length of 's'.
# - Precomputing factorials: O(N) up to max character count.
# - Calculating combinations: For each position in the first half (N/2 positions), we iterate through at most 26 characters.
#   The combination calculation itself involves division and multiplication of factorials.
#   The total complexity for generating the first half is roughly O((N/2) * 26 * log(N)) if using modular inverse for division,
#   or O((N/2) * 26 * N) in a naive factorial calculation approach (but we can precompute factorials).
#   With precomputed factorials and careful calculation, it's closer to O((N/2) * 26).
# - The dominant part is constructing the first half. With N <= 10^4, this is feasible.
#   Overall time complexity is approximately O(N).
#
# Space Complexity:
# - Frequency map: O(26) for character counts.
# - Factorials and inverse factorials (if used): O(N) or O(max_char_count).
# - Result string and temporary strings: O(N).
# - Overall space complexity is O(N).

import collections
import math

# Helper function to calculate combinations (n choose k)
# Using precomputed factorials for efficiency
def combinations(n, k, fact, invFact):
    if k < 0 or k > n:
        return 0
    # Calculate n! / (k! * (n-k)!)
    # Since we are dealing with division of factorials, we can use precomputed inverse factorials
    # for modular arithmetic if needed, but for direct calculation, standard division is fine.
    # The number of permutations of a multiset is n! / (n1! * n2! * ...).
    # If we fix one character at the start, we need to calculate permutations of the remaining.
    # The number of permutations of `rem_count` items with counts `rem_counts_list` is
    # rem_count! / (rem_counts_list[0]! * rem_counts_list[1]! * ...).
    return math.factorial(n) // (math.factorial(k) * math.factorial(n - k))

# Helper function to calculate permutations of a multiset
def permutations_of_multiset(n, counts, fact):
    if n == 0:
        return 1
    denominator = 1
    for count in counts:
        denominator *= math.factorial(count)
    return math.factorial(n) // denominator


class Solution:
    def getSmallestKthPermutation(self, s: str, k: int) -> str:
        # Precompute factorials up to the maximum possible length of the first half
        max_len_half = (len(s) + 1) // 2
        fact = [1] * (max_len_half + 1)
        for i in range(2, max_len_half + 1):
            fact[i] = fact[i-1] * i

        # Count character frequencies
        counts = collections.Counter(s)

        # Determine the characters for the first half and the middle character (if any)
        first_half_chars = []
        middle_char = ""
        for char in sorted(counts.keys()):
            if counts[char] % 2 == 1:
                middle_char = char
            # Add half of the count for even occurrences to the characters available for the first half
            for _ in range(counts[char] // 2):
                first_half_chars.append(char)

        # Sort the characters for the first half to ensure lexicographical ordering
        first_half_chars.sort()

        # If the number of possible permutations is less than k, return empty string
        n_first_half = len(first_half_chars)
        # Calculate total possible permutations for the first half
        total_perms_first_half = permutations_of_multiset(n_first_half, collections.Counter(first_half_chars).values(), fact)

        if k > total_perms_first_half:
            return ""

        # Construct the k-th lexicographically smallest first half
        result_first_half = []
        current_counts = collections.Counter(first_half_chars) # Counts of characters available for the first half

        # We need to iterate through `n_first_half` positions
        for i in range(n_first_half):
            # Iterate through sorted unique characters available for this position
            for char in sorted(current_counts.keys()):
                if current_counts[char] > 0:
                    # Temporarily remove 'char' to calculate permutations of remaining characters
                    current_counts[char] -= 1
                    remaining_len = n_first_half - (i + 1) # Length of the rest of the first half
                    
                    # Calculate permutations of the remaining characters
                    perms_with_this_char = permutations_of_multiset(remaining_len, current_counts.values(), fact)
                    
                    # If k is within the range of permutations starting with 'char'
                    if k <= perms_with_this_char:
                        result_first_half.append(char)
                        # Move to the next position, keep current_counts as is
                        break
                    else:
                        # Subtract the permutations starting with 'char' from k
                        k -= perms_with_this_char
                        # Backtrack: restore the count of 'char' as it wasn't chosen
                        current_counts[char] += 1

        # Construct the full palindrome
        first_half_str = "".join(result_first_half)
        return first_half_str + middle_char + first_half_str[::-1]

```