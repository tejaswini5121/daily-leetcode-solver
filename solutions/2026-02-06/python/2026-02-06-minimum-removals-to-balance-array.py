```python
# Summary: Find the minimum removals to make an array balanced, where balanced means max_element <= min_element * k.
# Link: https://leetcode.com/problems/minimum-removals-to-balance-array/
# Approach:
# The problem asks us to find a subarray (after removing elements) such that the maximum element in that subarray
# is at most k times the minimum element. We want to maximize the size of this subarray, which is equivalent to
# minimizing the number of removed elements.
#
# If we sort the array `nums`, any contiguous subarray in the sorted array will represent a potential balanced array
# after removals. This is because if we consider a subarray `nums[i:j+1]` from the sorted array, the minimum element
# will be `nums[i]` and the maximum will be `nums[j]`. The condition for balance becomes `nums[j] <= nums[i] * k`.
#
# We can use a sliding window approach on the sorted array. We'll have two pointers, `left` and `right`, defining the
# current window `nums[left:right+1]`. We expand the window by moving `right`. If the current window `nums[left:right+1]`
# becomes unbalanced (i.e., `nums[right] > nums[left] * k`), we need to shrink the window from the left by incrementing `left`
# until the window is balanced again.
#
# At each step where the window `nums[left:right+1]` is balanced, the number of elements in this window is `right - left + 1`.
# We keep track of the maximum window size found so far.
#
# The minimum number of removals will be `len(nums) - max_window_size`.
#
# Time Complexity: O(N log N) due to sorting. The sliding window part takes O(N) because both `left` and `right` pointers
# move at most N times.
# Space Complexity: O(N) or O(log N) depending on the sorting algorithm used by the Python `sort()` method.
# In Python, `sort()` typically uses Timsort, which has an average and worst-case space complexity of O(N) for temporary storage,
# but can be O(log N) in some implementations or for nearly sorted arrays. For simplicity, we often consider it O(N) in general.

import sys

class Solution:
    def minimumRemovals(self, nums: list[int], k: int) -> int:
        # Sort the array to easily identify minimum and maximum elements in a subarray.
        nums.sort()
        n = len(nums)

        # Initialize pointers for the sliding window.
        left = 0
        # `max_len` will store the maximum size of a balanced subarray found so far.
        max_len = 0

        # Iterate with the right pointer to expand the window.
        for right in range(n):
            # While the current window is unbalanced (max element > min element * k),
            # shrink the window from the left.
            # The minimum element in the window is nums[left] and the maximum is nums[right].
            while nums[right] > nums[left] * k:
                left += 1

            # At this point, the window `nums[left:right+1]` is balanced.
            # Calculate the current window size and update `max_len` if it's larger.
            current_len = right - left + 1
            max_len = max(max_len, current_len)

        # The minimum number of removals is the total number of elements minus the maximum size
        # of a balanced subarray we can form.
        return n - max_len

```