```python
# Summary: Find the longest contiguous subarray where each element appears at most k times.
# Link: https://leetcode.com/problems/length-of-longest-subarray-with-at-most-k-frequency/
# Approach: This problem can be efficiently solved using the sliding window technique.
# We maintain a window [left, right] and a frequency map (dictionary) to store the counts of elements within the current window.
# We expand the window by moving the 'right' pointer. For each element added, we update its count in the frequency map.
# If at any point the frequency of an element exceeds 'k', it means the current window is no longer "good".
# To make the window "good" again, we shrink the window from the left by moving the 'left' pointer.
# As we shrink, we decrement the count of the element leaving the window.
# We continue shrinking until the frequency of all elements in the window is less than or equal to 'k'.
# At each valid step (when the window is "good"), we update the maximum length of the good subarray found so far.
# Time Complexity: O(N), where N is the length of the input array `nums`.
# Each element is visited at most twice (once by the `right` pointer and once by the `left` pointer).
# The operations within the loop (dictionary lookups, updates, comparisons) take O(1) on average.
# Space Complexity: O(M), where M is the number of distinct elements in `nums`.
# In the worst case, if all elements are distinct, the space complexity can be O(N).
# The frequency map stores the counts of elements within the current window.

from collections import defaultdict

class Solution:
    def maxFrequency(self, nums: list[int], k: int) -> int:
        # Initialize the left pointer of the sliding window.
        left = 0
        # Initialize the maximum length of a good subarray found so far.
        max_length = 0
        # Use a defaultdict to store the frequency of elements within the current window.
        # defaultdict(int) automatically initializes the count to 0 for new keys.
        frequency_map = defaultdict(int)

        # Iterate through the array with the right pointer of the sliding window.
        for right in range(len(nums)):
            # Get the element at the current right pointer.
            current_element = nums[right]
            # Increment the frequency of the current element in the map.
            frequency_map[current_element] += 1

            # Check if the frequency of the current element exceeds k.
            # If it does, we need to shrink the window from the left until the condition is met.
            while frequency_map[current_element] > k:
                # Get the element at the current left pointer.
                left_element = nums[left]
                # Decrement the frequency of the element that is about to leave the window.
                frequency_map[left_element] -= 1
                # If the frequency of the left_element becomes 0 after decrementing,
                # it means this element is no longer present in the window.
                # While not strictly necessary for correctness (as frequency_map[left_element] will be 0),
                # it can slightly optimize by not keeping keys with zero counts if memory is a concern,
                # but for this problem, it doesn't significantly impact performance.
                # if frequency_map[left_element] == 0:
                #     del frequency_map[left_element]

                # Move the left pointer one step to the right to shrink the window.
                left += 1

            # At this point, the current window [left, right] is a "good" subarray
            # because the frequency of all elements is at most k.
            # Calculate the length of the current good subarray.
            current_window_length = right - left + 1
            # Update the maximum length found so far.
            max_length = max(max_length, current_window_length)

        # Return the maximum length of the longest good subarray.
        return max_length

```