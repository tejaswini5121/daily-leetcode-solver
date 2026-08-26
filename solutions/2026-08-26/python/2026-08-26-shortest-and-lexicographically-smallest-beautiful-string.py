```python
# Summary: Find the shortest and lexicographically smallest substring of a binary string containing exactly k ones.
# Link: https://leetcode.com/problems/shortest-and-lexicographically-smallest-beautiful-string/
# Approach:
# The problem asks for the shortest beautiful substring, and among those, the lexicographically smallest.
# A beautiful substring has exactly k ones.
#
# First, we can iterate through all possible substrings and count the number of ones in each.
# If a substring has k ones, we consider its length and the substring itself.
# We keep track of the minimum length found so far and the lexicographically smallest substring of that minimum length.
#
# A sliding window approach can optimize finding substrings with k ones.
# We can maintain a window and expand it until it contains k ones. Once it does, we have a potential beautiful substring.
# We then try to shrink the window from the left while maintaining k ones to find the shortest possible beautiful substring starting at that position.
#
# However, the constraints (s.length <= 100) suggest that a brute-force approach iterating through all substrings might be acceptable and simpler to implement correctly for finding the lexicographically smallest among the shortest.
#
# Let's refine the brute-force approach:
# 1. Iterate through all possible start indices `i` from 0 to `len(s) - 1`.
# 2. For each start index `i`, iterate through all possible end indices `j` from `i` to `len(s) - 1`.
# 3. Extract the substring `s[i:j+1]`.
# 4. Count the number of ones in this substring.
# 5. If the count of ones is exactly `k`:
#    a. If this is the first beautiful substring found, store its length and the substring itself.
#    b. If its length is less than the current minimum length, update the minimum length and the best substring.
#    c. If its length is equal to the current minimum length, compare it lexicographically with the current best substring and update if it's smaller.
#
# Initialization:
# - `min_len` to infinity (or a value larger than any possible string length).
# - `best_substring` to an empty string.
#
# This approach guarantees finding all beautiful substrings and correctly identifying the shortest and lexicographically smallest among them.
#
# Time Complexity: O(N^3), where N is the length of the string s.
# - Outer loops for start and end indices: O(N^2) substrings.
# - Counting ones in each substring: O(N).
#
# Space Complexity: O(N) for storing the substring in the worst case.

class Solution:
    def shortestBeautifulSubstring(self, s: str, k: int) -> str:
        n = len(s)
        min_len = float('inf') # Initialize minimum length to infinity
        best_substring = ""    # Initialize the best substring found so far

        # Iterate through all possible start indices of a substring
        for i in range(n):
            # Iterate through all possible end indices of a substring, starting from the current start index
            for j in range(i, n):
                substring = s[i : j + 1]  # Extract the current substring
                ones_count = substring.count('1') # Count the number of ones in the substring

                # Check if the substring is beautiful (contains exactly k ones)
                if ones_count == k:
                    current_len = len(substring) # Get the length of the current beautiful substring

                    # If this is the first beautiful substring found or it's shorter than the current minimum length
                    if current_len < min_len:
                        min_len = current_len      # Update the minimum length
                        best_substring = substring # Update the best substring
                    # If the current beautiful substring has the same length as the minimum length
                    elif current_len == min_len:
                        # Compare lexicographically and update if the current substring is smaller
                        if best_substring == "" or substring < best_substring:
                            best_substring = substring

        return best_substring # Return the lexicographically smallest beautiful substring of minimum length

```