```python
# Problem: Minimum Moves to Equal Array Elements
# Link: https://leetcode.com/problems/minimum-moves-to-equal-array-elements/
#
# Approach:
# The key insight is to reframe the problem. Incrementing n-1 elements by 1 is
# equivalent to decrementing one element by 1 relative to the others.
#
# Consider an array [a, b, c]. If we increment a and b, the new array is [a+1, b+1, c].
# The differences between elements change as follows:
# (b+1) - (a+1) = b - a
# c - (a+1) = c - a - 1
# c - (b+1) = c - b - 1
#
# Alternatively, if we decrement c by 1, the new array is [a, b, c-1].
# The differences are:
# b - a
# (c-1) - a = c - a - 1
# (c-1) - b = c - b - 1
#
# The relative differences between elements are the same.
#
# Our goal is to make all elements equal. This means all elements should become
# equal to some target value T.
#
# Let the minimum element in the array be `min_val`. If we make all elements
# equal to `min_val`, we would have to decrement all other elements.
# However, we can only increment.
#
# The problem states we increment n-1 elements. This means one element is *not*
# incremented. If we imagine the process in reverse, it's like decrementing one
# element. To make all elements equal, we must bring all elements down to the
# level of the smallest element.
#
# If we consider the final equal value to be `X`, and there are `m` moves:
# Sum of final array = Sum of initial array + m * (n - 1)
# n * X = sum(nums) + m * (n - 1)
#
# Also, the minimum element in the initial array, say `min_val`, will be incremented
# in every move where it's not the one left out. If we make all elements equal to `X`,
# then `X` must be at least `min_val`.
#
# Let's consider the total sum of the array `S`.
# After `m` moves, each incrementing `n-1` elements, the total sum increases by `m * (n - 1)`.
# Let the final equal value be `k`. The sum of the final array will be `n * k`.
# So, `n * k = S + m * (n - 1)`.
#
# The minimum element `min_val` will eventually become `k`.
# How many times is `min_val` incremented?
# In each move, `n-1` elements are incremented. This means one element is *not* incremented.
# If we want to reach a state where all elements are equal, the final value `k` must be achievable
# from the minimum element.
#
# Consider the minimum element `min_val`. In any move, if `min_val` is *not* the element
# that is left out, it gets incremented. If `min_val` *is* the element left out, it doesn't.
#
# If we increment `n-1` elements, it's equivalent to picking one element and decrementing it by 1
# relative to all others.
# To make all elements equal, we want to bring all elements to the level of the minimum element.
# The number of moves required to bring an element `x` down to `min_val` is `x - min_val`.
# The total number of moves is the sum of these differences for all elements.
#
# Therefore, the minimum number of moves is the sum of `(nums[i] - min(nums))` for all `i`.
#
# Example: [1, 2, 3]
# min_val = 1
# Moves = (1 - 1) + (2 - 1) + (3 - 1) = 0 + 1 + 2 = 3
#
# This matches the example explanation.
#
# Time Complexity: O(n) for finding the minimum and O(n) for summing the differences.
# Overall: O(n)
#
# Space Complexity: O(1) as we only use a few variables.
#
class Solution:
    def minMoves(self, nums: list[int]) -> int:
        # Find the minimum element in the array.
        # This will be the base value we try to bring all other elements to.
        min_val = min(nums)

        # Initialize the total number of moves.
        total_moves = 0

        # Iterate through each number in the array.
        for num in nums:
            # The number of moves required to make the current number equal to the minimum
            # is the difference between the current number and the minimum.
            # This is because each move effectively reduces the difference between an element
            # and the minimum by 1 (by incrementing n-1 elements, which is equivalent to
            # decrementing 1 element relative to the others).
            total_moves += (num - min_val)

        # Return the total calculated moves.
        return total_moves
```