```python
# Problem: Number of Substrings Containing All Three Characters
# Link: https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/
#
# Approach:
# This problem can be solved efficiently using the sliding window technique.
# We maintain a window [left, right] and a frequency map (or an array of size 3)
# to count the occurrences of 'a', 'b', and 'c' within the current window.
# We expand the window by moving the 'right' pointer.
# Once the window contains at least one of each character ('a', 'b', 'c'),
# it means any substring starting from 'left' and ending at 'right' or any index
# further to the right will also contain all three characters.
# The number of such valid substrings starting at 'left' is (n - right),
# where n is the total length of the string.
# We then shrink the window by moving the 'left' pointer to find more valid substrings.
# We decrement the count of the character at 'left' from the frequency map.
# If after shrinking, the window still contains all three characters, we continue adding
# (n - right) to our total count.
# The process continues until the 'right' pointer reaches the end of the string.
#
# Time Complexity: O(n), where n is the length of the string.
# Both 'left' and 'right' pointers traverse the string at most once.
# The operations inside the loop (map updates and checks) take constant time.
#
# Space Complexity: O(1)
# The frequency map or array used to store character counts has a fixed size (3),
# independent of the input string length.
class Solution:
    def numberOfSubstrings(self, s: str) -> int:
        # Initialize a counter for the number of valid substrings
        count = 0
        # Initialize the left pointer of the sliding window
        left = 0
        # Initialize a frequency map (or array) to store counts of 'a', 'b', 'c'
        # We can use a dictionary or a list/array of size 3.
        # Using a list where index 0 for 'a', 1 for 'b', 2 for 'c'
        freq = [0, 0, 0]
        # Get the length of the input string
        n = len(s)

        # Iterate through the string with the right pointer of the sliding window
        for right in range(n):
            # Increment the frequency of the character at the current right pointer
            # 'a' -> 0, 'b' -> 1, 'c' -> 2
            freq[ord(s[right]) - ord('a')] += 1

            # Check if the current window [left, right] contains at least one 'a', 'b', and 'c'
            # This condition is met if all elements in freq are greater than 0
            while freq[0] > 0 and freq[1] > 0 and freq[2] > 0:
                # If the window is valid, any substring starting from 'left'
                # and ending at 'right' or any index beyond 'right' will also be valid.
                # The number of such substrings is (n - right).
                # For example, if n=6, right=2, and the window is valid, then substrings
                # s[left:3], s[left:4], s[left:5], s[left:6] are all valid.
                # The number of such valid endpoints is n - right.
                count += (n - right)

                # Now, shrink the window from the left to find more valid substrings.
                # Decrement the frequency of the character at the left pointer.
                freq[ord(s[left]) - ord('a')] -= 1
                # Move the left pointer one step to the right.
                left += 1

        # Return the total count of valid substrings
        return count
```