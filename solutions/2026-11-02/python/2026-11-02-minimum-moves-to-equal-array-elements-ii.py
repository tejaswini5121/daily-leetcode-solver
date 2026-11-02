```python
# Problem: Minimum Moves to Equal Array Elements II
# Link: https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/
#
# Approach:
# The problem asks for the minimum number of moves to make all elements in an array equal.
# A move consists of incrementing or decrementing an element by 1.
# This is equivalent to finding a target value 'x' such that the sum of absolute differences
# between each element and 'x' is minimized: sum(|nums[i] - x|).
#
# It is a well-known mathematical property that the value 'x' that minimizes this sum is the median
# of the array. If the array has an odd number of elements, the median is the middle element.
# If the array has an even number of elements, any value between the two middle elements (inclusive)
# will yield the minimum sum, but choosing either of the two middle elements simplifies the calculation.
#
# Therefore, the strategy is:
# 1. Sort the input array `nums`.
# 2. Find the median element. If `n` is the length of the array, the median is at index `n // 2`.
# 3. Calculate the sum of absolute differences between each element and the median.
#
# Time Complexity:
# Sorting the array takes O(n log n) time.
# Iterating through the sorted array to calculate the sum of differences takes O(n) time.
# Thus, the overall time complexity is dominated by sorting, which is O(n log n).
#
# Space Complexity:
# If we sort the array in-place, the space complexity is O(1) (excluding the input array storage).
# If a new array is created for sorting (e.g., using Python's `sorted()` function which might return a new list),
# the space complexity would be O(n) in the worst case. However, Python's `list.sort()` method sorts in-place.
# Given the constraints and typical Python implementations, we can consider it O(1) auxiliary space if sorting in-place.

import math

class Solution:
    def minMoves2(self, nums: list[int]) -> int:
        # Sort the array to easily find the median.
        # Sorting allows us to access the middle element(s) efficiently.
        nums.sort()
        
        # Get the number of elements in the array.
        n = len(nums)
        
        # The median is the element at the middle index.
        # For an array of size n, the middle index is n // 2 (integer division).
        # For example, if n=3, indices are 0, 1, 2. n//2 = 1 (the middle index).
        # If n=4, indices are 0, 1, 2, 3. n//2 = 2. The median can be nums[1] or nums[2] or any value in between.
        # Choosing nums[n//2] works for both odd and even lengths.
        median = nums[n // 2]
        
        # Initialize the total number of moves to 0.
        total_moves = 0
        
        # Iterate through each number in the sorted array.
        for num in nums:
            # Calculate the absolute difference between the current number and the median.
            # This difference represents the number of moves required for this specific element.
            # We use math.abs() for absolute value, though abs() is a built-in Python function.
            # Using abs() directly is more idiomatic in Python.
            moves_for_current_element = abs(num - median)
            
            # Add the moves for the current element to the total moves.
            total_moves += moves_for_current_element
            
        # Return the total minimum moves required to make all elements equal to the median.
        return total_moves

```