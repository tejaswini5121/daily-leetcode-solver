```python
# Finds the minimum element in a rotated sorted array of unique elements.
# This utilizes binary search to achieve O(log n) time complexity.
# The core idea is to compare the middle element with the rightmost element
# to determine which half of the array contains the minimum element.
# If the middle element is greater than the rightmost element, it means
# the pivot (and thus the minimum) lies in the right half.
# Otherwise, the minimum is in the left half or is the middle element itself.
# Link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
#
# Approach:
# Use binary search. Initialize left and right pointers to the start and end of the array.
# While left < right:
#   Calculate the middle index.
#   If nums[mid] > nums[right]:
#     The minimum element must be in the right half (including mid+1 to right).
#     So, move the left pointer to mid + 1.
#   Else (nums[mid] <= nums[right]):
#     The minimum element is in the left half or is nums[mid] itself.
#     So, move the right pointer to mid.
# When the loop terminates (left == right), left (or right) will point to the minimum element.
#
# Time Complexity: O(log n) - Binary search divides the search space in half at each step.
# Space Complexity: O(1) - Constant extra space is used for variables.

class Solution:
    def findMin(self, nums: list[int]) -> int:
        # Initialize left and right pointers for binary search.
        left, right = 0, len(nums) - 1

        # Continue the search as long as the left pointer is less than the right pointer.
        # When left == right, we have found our minimum element.
        while left < right:
            # Calculate the middle index. Using integer division to ensure it's an index.
            mid = left + (right - left) // 2

            # Compare the middle element with the rightmost element.
            # If nums[mid] is greater than nums[right], it means the rotation point
            # (and thus the minimum element) must be in the right half of the array.
            # For example, in [4, 5, 6, 7, 0, 1, 2], if mid points to 7 and right points to 2,
            # 7 > 2, so the minimum (0) is to the right of mid.
            if nums[mid] > nums[right]:
                # Discard the left half including mid, and move the left pointer to mid + 1.
                left = mid + 1
            else:
                # If nums[mid] is less than or equal to nums[right], it means the minimum
                # element is either nums[mid] itself or is in the left half of the array.
                # For example, in [0, 1, 2, 4, 5, 6, 7], if mid points to 2 and right points to 7,
                # 2 <= 7, so the minimum is either 2 or to its left.
                # In [3, 4, 5, 1, 2], if mid points to 5 and right points to 2,
                # 5 > 2, so left becomes mid + 1 (points to 1).
                # If mid points to 1 and right points to 2, 1 <= 2, so right becomes mid (points to 1).
                # We move the right pointer to mid because mid could be the minimum element.
                right = mid

        # When the loop finishes, left and right pointers will be at the same index,
        # which points to the minimum element in the rotated sorted array.
        return nums[left]

```