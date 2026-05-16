```python
# Summary: Find the minimum element in a sorted and rotated array that may contain duplicates.
# Problem Link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/
#
# Approach:
# We will use binary search. The key idea is to compare the middle element with the rightmost element.
#
# 1. Initialize `left` to 0 and `right` to `len(nums) - 1`.
# 2. While `left < right`:
#    a. Calculate `mid = left + (right - left) // 2`.
#    b. If `nums[mid] < nums[right]`: This means the minimum element is in the left half (including `mid`),
#       because the right half (`mid` to `right`) is sorted and `nums[mid]` is smaller than the end.
#       So, we set `right = mid`.
#    c. If `nums[mid] > nums[right]`: This means the minimum element is in the right half (excluding `mid`),
#       because the pivot point (where the rotation occurs and the minimum lies) must be to the right of `mid`.
#       So, we set `left = mid + 1`.
#    d. If `nums[mid] == nums[right]`: This is the tricky part due to duplicates. We cannot definitively say
#       which half contains the minimum. For example, in `[3,1,3,3,3]` or `[3,3,3,1,3]`, `mid` could be 3
#       and `right` could be 3. To safely proceed, we can discard the rightmost element. This is because
#       if `nums[right]` is the minimum, then `nums[mid]` is also the minimum (since they are equal),
#       and by decrementing `right`, we don't lose the minimum. If `nums[right]` is not the minimum,
#       then the actual minimum is somewhere to its left, and we've just shrunk the search space.
#       So, we set `right = right - 1`.
# 3. After the loop terminates, `left` will be equal to `right`, and `nums[left]` (or `nums[right]`)
#    will be the minimum element.
#
# Time Complexity Analysis:
# In the worst case, when all elements are the same (e.g., [2,2,2,2,2]), the `right = right - 1` step
# will be executed `n` times. This degrades the binary search to a linear scan in that specific scenario.
# Therefore, the worst-case time complexity is O(n).
# In cases without many duplicates, it remains O(log n).
#
# Space Complexity Analysis:
# O(1) because we are only using a few variables to keep track of indices.
class Solution:
    def findMin(self, nums: list[int]) -> int:
        # Initialize left and right pointers for binary search.
        left, right = 0, len(nums) - 1

        # Perform binary search. The loop continues as long as the search space is valid.
        while left < right:
            # Calculate the middle index to avoid potential integer overflow.
            mid = left + (right - left) // 2

            # Case 1: nums[mid] < nums[right]
            # This implies that the subarray from mid to right is sorted in ascending order.
            # The minimum element must be in the left half (including mid), because nums[mid]
            # is smaller than the element at the right end.
            # So, we narrow down the search space to the left half.
            if nums[mid] < nums[right]:
                right = mid
            # Case 2: nums[mid] > nums[right]
            # This implies that the rotation point (and thus the minimum element) is in the
            # right half of the array (excluding mid). The left half is sorted normally,
            # but the break in the sorted order occurs after mid.
            # So, we narrow down the search space to the right half.
            elif nums[mid] > nums[right]:
                left = mid + 1
            # Case 3: nums[mid] == nums[right]
            # This is the tricky case with duplicates. We cannot definitively determine if the
            # minimum is to the left or right of mid. For example, in [3,1,3,3,3], if mid points to
            # the first 3 and right points to the last 3, the minimum (1) is between them.
            # In [3,3,3,1,3], if mid points to the middle 3 and right to the last 3, the minimum (1)
            # is to the right of mid.
            # To safely proceed, we can discard the rightmost element `nums[right]`.
            # If `nums[right]` is the minimum, then `nums[mid]` is also the minimum, and decrementing
            # `right` does not lose the minimum. If `nums[right]` is not the minimum, then the actual
            # minimum is somewhere to its left, and we've just reduced the search space.
            else: # nums[mid] == nums[right]
                right -= 1

        # When the loop terminates, left == right. This index points to the minimum element.
        return nums[left]

```