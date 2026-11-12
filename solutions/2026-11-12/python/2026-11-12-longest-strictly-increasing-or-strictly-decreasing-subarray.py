```python
# Problem: Longest Strictly Increasing or Strictly Decreasing Subarray
# Link: https://leetcode.com/problems/longest-strictly-increasing-or-strictly-decreasing-subarray/
#
# Approach:
# We can iterate through the array and keep track of the current length of the
# strictly increasing subarray and the strictly decreasing subarray ending at the
# current position. We also maintain a global maximum length.
#
# For each element, we compare it with the previous element.
# If nums[i] > nums[i-1], it extends the strictly increasing subarray, so we
# increment the current increasing length and reset the current decreasing
# length to 1 (since a single element is always a decreasing subarray of length 1).
# If nums[i] < nums[i-1], it extends the strictly decreasing subarray, so we
# increment the current decreasing length and reset the current increasing
# length to 1.
# If nums[i] == nums[i-1], both the increasing and decreasing sequences are broken,
# so we reset both current increasing and decreasing lengths to 1.
# After updating the current lengths, we update the overall maximum length by
# taking the maximum of the current increasing length, current decreasing length,
# and the previous maximum length.
#
# Time Complexity: O(n) where n is the length of the input array.
# We iterate through the array once.
#
# Space Complexity: O(1)
# We only use a few variables to store the current lengths and the maximum length.

class Solution:
    def longestSubarray(self, nums: list[int]) -> int:
        n = len(nums)
        # If the array has only one element, the longest subarray is of length 1.
        if n <= 1:
            return n

        # Initialize the maximum length found so far.
        # A single element is always a subarray of length 1.
        max_len = 1

        # Initialize the current length of the strictly increasing subarray ending at the current index.
        current_increasing_len = 1

        # Initialize the current length of the strictly decreasing subarray ending at the current index.
        current_decreasing_len = 1

        # Iterate through the array starting from the second element.
        for i in range(1, n):
            # Check if the current element is strictly greater than the previous one.
            if nums[i] > nums[i-1]:
                # Extend the current strictly increasing subarray.
                current_increasing_len += 1
                # Reset the strictly decreasing subarray length as the sequence is broken.
                current_decreasing_len = 1
            # Check if the current element is strictly less than the previous one.
            elif nums[i] < nums[i-1]:
                # Extend the current strictly decreasing subarray.
                current_decreasing_len += 1
                # Reset the strictly increasing subarray length as the sequence is broken.
                current_increasing_len = 1
            # If the current element is equal to the previous one, both sequences are broken.
            else:
                # Reset both increasing and decreasing subarray lengths to 1.
                current_increasing_len = 1
                current_decreasing_len = 1

            # Update the maximum length found so far by considering the current increasing and decreasing lengths.
            max_len = max(max_len, current_increasing_len, current_decreasing_len)

        # Return the overall maximum length.
        return max_len

```