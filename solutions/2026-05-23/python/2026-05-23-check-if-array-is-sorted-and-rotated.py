```python
# Problem: Check if Array Is Sorted and Rotated
# Summary: Determine if an array could have been formed by rotating a non-decreasingly sorted array.
# Link: https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/
#
# Approach:
# A sorted and rotated array will have at most one "descent" where nums[i] > nums[i+1].
# If the array is perfectly sorted and not rotated, there are zero descents.
# If the array is sorted and rotated, there will be exactly one descent. This descent occurs
# at the point where the "wrap-around" happens from the largest element back to the smallest.
# We also need to check the wrap-around case from the last element to the first element.
# If we find more than one such descent, it means the array cannot be a sorted and rotated version.
#
# Specifically, we can iterate through the array and count the number of times `nums[i] > nums[(i + 1) % n]`.
# The modulo operator `% n` handles the wrap-around from the last element to the first.
# If the count of such descents is 0 or 1, the array is considered sorted and rotated.
#
# Time Complexity: O(n), where n is the length of the array. We iterate through the array once.
# Space Complexity: O(1), as we only use a constant amount of extra space for the counter.

class Solution:
    def check(self, nums: list[int]) -> bool:
        # Get the length of the array
        n = len(nums)
        # Initialize a counter for the number of "descents" or "breaks" in the sorted order
        # A descent occurs when nums[i] > nums[i+1]
        descent_count = 0

        # Iterate through the array to find descents
        # The loop goes from index 0 to n-1.
        # We check nums[i] against nums[(i + 1) % n].
        # The modulo operator % n correctly handles the wrap-around comparison
        # between the last element (nums[n-1]) and the first element (nums[0]).
        for i in range(n):
            # If the current element is greater than the next element (considering wrap-around)
            if nums[i] > nums[(i + 1) % n]:
                # Increment the descent counter
                descent_count += 1

        # A sorted and rotated array can have at most one descent.
        # If descent_count is 0, the array is already sorted (and not rotated, or rotated by 0).
        # If descent_count is 1, the array is sorted and rotated, with the break at the rotation point.
        # If descent_count is greater than 1, the array cannot be formed by rotating a sorted array.
        return descent_count <= 1

```