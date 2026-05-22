```python
# Summary: Search for a target in a rotated sorted array with distinct values.
# Link: https://leetcode.com/problems/search-in-rotated-sorted-array/
# Approach:
# This problem requires an O(log n) solution, which strongly suggests binary search.
# The key challenge is handling the rotation. A standard binary search won't work directly.
# We can adapt binary search by determining which half of the array (from mid to left or mid to right) is sorted.
# 1. Initialize `left` and `right` pointers to the start and end of the array.
# 2. While `left` <= `right`:
#    a. Calculate the `mid` index.
#    b. If `nums[mid]` equals `target`, we've found it, return `mid`.
#    c. Check if the left half (`nums[left]` to `nums[mid]`) is sorted. This is true if `nums[left]` <= `nums[mid]`.
#       i. If the left half is sorted:
#          - If the `target` is within the range of the sorted left half (i.e., `nums[left]` <= `target` < `nums[mid]`),
#            then the target must be in the left half. So, update `right` to `mid - 1`.
#          - Otherwise, the target must be in the unsorted right half. So, update `left` to `mid + 1`.
#    d. Else (the right half, `nums[mid]` to `nums[right]`, must be sorted). This is true if `nums[left]` > `nums[mid]`.
#       i. If the right half is sorted:
#          - If the `target` is within the range of the sorted right half (i.e., `nums[mid]` < `target` <= `nums[right]`),
#            then the target must be in the right half. So, update `left` to `mid + 1`.
#          - Otherwise, the target must be in the unsorted left half. So, update `right` to `mid - 1`.
# 3. If the loop finishes without finding the target, return -1.
# Time Complexity: O(log n) because in each step of the binary search, we eliminate half of the search space.
# Space Complexity: O(1) because we only use a few extra variables for pointers and calculations.
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # Initialize left and right pointers for binary search
        left, right = 0, len(nums) - 1

        # Continue searching as long as the left pointer is less than or equal to the right pointer
        while left <= right:
            # Calculate the middle index
            mid = (left + right) // 2

            # If the middle element is the target, return its index
            if nums[mid] == target:
                return mid

            # Determine which half of the array is sorted
            # Case 1: The left half (from `left` to `mid`) is sorted
            if nums[left] <= nums[mid]:
                # Check if the target lies within the sorted left half
                if nums[left] <= target < nums[mid]:
                    # If it does, search in the left half by moving the `right` pointer
                    right = mid - 1
                else:
                    # If it doesn't, the target must be in the right half (unsorted part)
                    # Search in the right half by moving the `left` pointer
                    left = mid + 1
            # Case 2: The right half (from `mid` to `right`) is sorted
            else: # nums[left] > nums[mid]
                # Check if the target lies within the sorted right half
                if nums[mid] < target <= nums[right]:
                    # If it does, search in the right half by moving the `left` pointer
                    left = mid + 1
                else:
                    # If it doesn't, the target must be in the left half (unsorted part)
                    # Search in the left half by moving the `right` pointer
                    right = mid - 1

        # If the loop finishes and the target is not found, return -1
        return -1

```