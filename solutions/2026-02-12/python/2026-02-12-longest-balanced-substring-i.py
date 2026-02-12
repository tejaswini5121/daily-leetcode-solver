```python
# Find the length of the longest substring where all distinct characters appear an equal number of times.
# Link: https://leetcode.com/problems/longest-balanced-substring-i/
#
# Approach:
# We iterate through all possible substrings of the given string `s`.
# For each substring, we count the occurrences of each character.
# Then, we check if all distinct characters in that substring appear the same number of times.
# If they do, we update the `max_length` with the length of this balanced substring.
#
# To efficiently count character occurrences within a substring, we can use a frequency map (dictionary or array).
#
# Time Complexity: O(n^3), where n is the length of the string.
#   - Outer loops for substring start and end: O(n^2)
#   - Inner loop to count character frequencies for each substring: O(n)
#   - Checking if counts are equal: O(alphabet_size), which is constant (26)
# Space Complexity: O(alphabet_size), which is O(1) for storing character counts.
#
# Optimization thought:
# Can we do better than O(n^3)?
# If we fix the number of distinct characters `k` that must be present in a balanced substring,
# we can iterate through the string. For each starting position `i`, we can maintain the counts
# of characters encountered up to the current position `j`.
# This would involve iterating through `k` from 1 to 26. For each `k`, we can use a sliding
# window or a prefix sum approach.
# The prefix sum approach with a hash table seems promising for O(n^2) time complexity.
# For each possible frequency `f` (from 1 to n), and for each possible number of distinct characters `d` (from 1 to 26),
# we check if there's a substring where `d` distinct characters appear exactly `f` times.
# This still seems complex to implement and might lead to O(n^2 * alphabet_size * max_freq) which is O(n^3).
#
# The current O(n^3) approach is straightforward to implement and given n <= 1000, it might pass.
# Let's stick with the simpler O(n^3) approach for now.

class Solution:
    def longestBalancedSubstring(self, s: str) -> int:
        n = len(s)
        max_length = 0

        # Iterate through all possible start indices of a substring
        for i in range(n):
            # Iterate through all possible end indices of a substring
            for j in range(i, n):
                # Extract the current substring
                substring = s[i : j + 1]
                
                # Dictionary to store the frequency of each character in the current substring
                char_counts = {}
                
                # Count character frequencies
                for char in substring:
                    char_counts[char] = char_counts.get(char, 0) + 1

                # Check if the substring is balanced
                is_balanced = True
                # If there are no characters in the substring, it's trivially balanced (but length 0)
                if not char_counts:
                    is_balanced = True
                else:
                    # Get the count of the first character as the target count
                    target_count = next(iter(char_counts.values()))
                    
                    # Check if all other character counts are equal to the target count
                    for count in char_counts.values():
                        if count != target_count:
                            is_balanced = False
                            break
                
                # If the substring is balanced and its length is greater than the current max_length
                if is_balanced:
                    max_length = max(max_length, len(substring))
        
        return max_length

```