```python
# Problem: Minimum Moves to Equal Array Elements III
# Summary: Find the minimum moves to make all array elements equal by incrementing.
# Link: https://leetcode.com/problems/minimum-moves-to-equal-array-elements-iii/
#
# Approach:
# The problem states we can only increment elements. To minimize the moves, we should
# aim to make all elements equal to the maximum element in the array.
#
# Consider an array `nums`. Let `max_val` be the maximum value in `nums`.
# For each element `num` in `nums`, the number of moves required to make it equal to
# `max_val` is `max_val - num`.
# The total minimum moves will be the sum of `(max_val - num)` for all `num` in `nums`.
#
# Alternatively, we can also view this problem as finding a target value `x`
# such that the sum of `abs(num - x)` for all `num` is minimized.
# It's a known mathematical property that the value `x` that minimizes the sum
# of absolute differences is the median of the dataset.
# However, since we can only increment elements, the target value must be at least
# the maximum element of the original array.
# If the target value is greater than the current maximum, say `max_val`, then
# for every element `num`, the moves would be `target - num`. The total moves
# would be `n * target - sum(nums)`. This value increases as `target` increases.
# Therefore, the optimal `target` is indeed the maximum element in the array.
#
# So, the algorithm is:
# 1. Find the maximum element in the array.
# 2. Iterate through the array and sum up the differences between the maximum element
#    and each element.
#
# Time Complexity:
# O(N), where N is the number of elements in the array.
# This is because we iterate through the array once to find the maximum element
# and then iterate again to calculate the sum of differences.
#
# Space Complexity:
# O(1), as we only use a few extra variables to store the maximum value and the sum.

class Solution:
    def minMoves(self, nums: list[int]) -> int:
        """
        Calculates the minimum moves to make all elements in an array equal by incrementing.
        """
        # Handle edge case of an empty or single-element array
        if not nums or len(nums) <= 1:
            return 0

        # Find the maximum element in the array. This will be our target value.
        max_val = max(nums)

        # Initialize the total number of moves to 0.
        total_moves = 0

        # Iterate through each number in the array.
        for num in nums:
            # The number of moves required for the current element is the difference
            # between the maximum value and the current element.
            moves_for_current_num = max_val - num
            # Add these moves to the total count.
            total_moves += moves_for_current_num

        # Return the total minimum moves required.
        return total_moves

# Example Usage (for testing purposes, not part of the LeetCode submission)
# sol = Solution()
# print(sol.minMoves([1, 2, 3]))  # Output: 3
# print(sol.minMoves([4, 4, 5]))  # Output: 2
# print(sol.minMoves([1]))       # Output: 0
# print(sol.minMoves([]))        # Output: 0
```