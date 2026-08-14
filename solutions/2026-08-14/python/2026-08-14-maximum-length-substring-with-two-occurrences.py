```python
# Problem: Maximum Length Substring With Two Occurrences
# Summary: Find the longest substring where each character appears at most twice.
# Link: https://leetcode.com/problems/maximum-length-substring-with-two-occurrences/

# Approach:
# This problem can be solved efficiently using the sliding window technique.
# We'll maintain a window defined by two pointers, 'left' and 'right'.
# We'll also use a hash map (dictionary in Python) to keep track of the frequency
# of each character within the current window.
# We expand the window by moving the 'right' pointer. For each character encountered
# at 'right', we increment its count in the frequency map.
# If at any point, the count of any character in the map exceeds 2, it means the
# current window is invalid. To make it valid again, we shrink the window from
# the left by moving the 'left' pointer. We decrement the count of the character
# at 'left' in the frequency map. If its count becomes 0, we can remove it from
# the map. We continue shrinking until all character counts are at most 2.
# At each valid step (where all character counts are <= 2), we update the
# maximum length found so far by comparing it with the current window size (right - left + 1).

# Time Complexity: O(N), where N is the length of the string.
# The 'right' pointer iterates through the string once. The 'left' pointer also
# iterates through the string at most once in total. Each character is added to
# and removed from the hash map at most once. Hash map operations (insertion,
# deletion, lookup) take O(1) on average.

# Space Complexity: O(1), because the size of the character set is fixed (lowercase English letters, 26 characters).
# The hash map will store at most 26 key-value pairs.

class Solution:
    def maxLengthSubstring(self, s: str) -> int:
        # Initialize left and right pointers for the sliding window
        left = 0
        # Initialize the maximum length found so far
        max_length = 0
        # Initialize a dictionary to store character frequencies within the window
        char_counts = {}

        # Iterate through the string with the right pointer
        for right in range(len(s)):
            # Get the character at the current right pointer
            current_char = s[right]

            # Increment the count of the current character in the dictionary
            # If the character is not yet in the dictionary, it will be added with a count of 1
            char_counts[current_char] = char_counts.get(current_char, 0) + 1

            # Shrink the window from the left if any character's count exceeds 2
            while char_counts[current_char] > 2:
                # Get the character at the current left pointer
                left_char = s[left]
                # Decrement the count of the character at the left pointer
                char_counts[left_char] -= 1
                # If the count of the left_char becomes 0, remove it from the dictionary
                # This step is not strictly necessary for correctness but can help keep the map smaller
                if char_counts[left_char] == 0:
                    del char_counts[left_char]
                # Move the left pointer to shrink the window
                left += 1

            # Update the maximum length with the current valid window size
            # The current window size is (right - left + 1)
            max_length = max(max_length, right - left + 1)

        # Return the maximum length found
        return max_length

# Example Usage (for testing purposes, can be removed if only the class is needed)
# sol = Solution()
# print(sol.maxLengthSubstring("bcbbbcba"))  # Output: 4
# print(sol.maxLengthSubstring("aaaa"))      # Output: 2
# print(sol.maxLengthSubstring("aabbccddeeff")) # Output: 12
# print(sol.maxLengthSubstring("aaabbbccc")) # Output: 6 (e.g., "aaabbb")
```