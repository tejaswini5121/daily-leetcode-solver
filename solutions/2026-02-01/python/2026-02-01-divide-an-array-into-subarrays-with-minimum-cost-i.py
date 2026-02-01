```python
# Problem: Divide an Array Into Subarrays With Minimum Cost I
# Link: https://leetcode.com/problems/divide-an-array-into-subarrays-with-minimum-cost-i/
#
# Approach:
# The problem asks us to divide an array `nums` into three disjoint contiguous subarrays
# and minimize the sum of the costs of these subarrays, where the cost of a subarray
# is its first element.
#
# Since we need to divide the array into exactly 3 subarrays, we need to determine
# two split points. Let the array have length `n`.
# The first subarray will start at index 0 and end at some index `i`.
# The second subarray will start at index `i + 1` and end at some index `j`.
# The third subarray will start at index `j + 1` and end at index `n - 1`.
#
# The constraints state that `n` is between 3 and 50. This small constraint suggests
# that an O(n^3) or even O(n^4) solution might be acceptable.
#
# We can iterate through all possible pairs of split points.
# The first split point can be after index `i`, where `0 <= i < n - 2`. This means
# the first subarray is `nums[0...i]`.
# The second split point can be after index `j`, where `i + 1 <= j < n - 1`. This means
# the second subarray is `nums[i+1...j]`.
# The third subarray will then be `nums[j+1...n-1]`.
#
# For each possible division, the cost will be `nums[0]` (cost of the first subarray),
# `nums[i+1]` (cost of the second subarray), and `nums[j+1]` (cost of the third subarray).
# We need to find the minimum sum of these three elements over all valid `i` and `j`.
#
# Let's refine the indices:
# The first subarray is `nums[0...i]`. Its cost is `nums[0]`.
# The second subarray is `nums[i+1...j]`. Its cost is `nums[i+1]`.
# The third subarray is `nums[j+1...n-1]`. Its cost is `nums[j+1]`.
#
# We need to ensure that each subarray is non-empty.
# The first subarray `nums[0...i]` is non-empty if `i >= 0`.
# The second subarray `nums[i+1...j]` is non-empty if `j >= i+1`.
# The third subarray `nums[j+1...n-1]` is non-empty if `n-1 >= j+1`, which means `j <= n-2`.
#
# Combining these, the valid ranges for `i` and `j` are:
# `i` can range from 0 up to `n - 3` (to leave at least two elements for the second and third subarrays).
# `j` can range from `i + 1` up to `n - 2` (to leave at least one element for the third subarray).
#
# So, we can use nested loops:
# Outer loop for `i` from 0 to `n - 3`.
# Inner loop for `j` from `i + 1` to `n - 2`.
#
# For each pair `(i, j)`, the sum of costs is `nums[0] + nums[i+1] + nums[j+1]`.
# We keep track of the minimum sum found so far.
#
# Initializing `min_cost` to a very large value is a good practice.
#
# Example 1 dry run: nums = [1,2,3,12], n = 4
# i ranges from 0 to 4 - 3 = 1
# j ranges from i + 1 to 4 - 2 = 2
#
# i = 0:
#   j ranges from 0 + 1 = 1 to 2
#   j = 1:
#     First subarray: nums[0] (cost 1)
#     Second subarray: nums[1] (cost 2)
#     Third subarray: nums[2..3] (cost 3)
#     Sum = 1 + 2 + 3 = 6. min_cost = 6.
#   j = 2:
#     First subarray: nums[0] (cost 1)
#     Second subarray: nums[1..2] (cost 2)
#     Third subarray: nums[3] (cost 12)
#     Sum = 1 + 2 + 12 = 15. min_cost = min(6, 15) = 6.
#
# i = 1:
#   j ranges from 1 + 1 = 2 to 2
#   j = 2:
#     First subarray: nums[0..1] (cost 1)
#     Second subarray: nums[2] (cost 3)
#     Third subarray: nums[3] (cost 12)
#     Sum = 1 + 3 + 12 = 16. min_cost = min(6, 16) = 6.
#
# Final min_cost = 6. This matches the example.
#
# The problem statement in LeetCode specifies that the cost of an array is the value of its first element.
# This means if we divide `nums` into `sub1`, `sub2`, `sub3`, the total cost is `sub1[0] + sub2[0] + sub3[0]`.
#
# Let's re-examine the indices and costs.
# If the first split point is after index `i-1` (meaning the first subarray is `nums[0...i-1]`),
# its cost is `nums[0]`.
# If the second split point is after index `j-1` (meaning the second subarray is `nums[i...j-1]`),
# its cost is `nums[i]`.
# The third subarray is `nums[j...n-1]`, and its cost is `nums[j]`.
#
# We need to ensure each subarray is non-empty:
# First subarray: `nums[0...i-1]` requires `i-1 >= 0`, so `i >= 1`.
# Second subarray: `nums[i...j-1]` requires `j-1 >= i`, so `j >= i+1`.
# Third subarray: `nums[j...n-1]` requires `n-1 >= j`, so `j <= n-1`.
#
# Combining these:
# `i` can range from 1 up to `n-2` (to leave at least one element for the second and third subarrays).
# `j` can range from `i+1` up to `n-1` (to leave at least one element for the third subarray).
#
# So the loops would be:
# For `i` from 1 to `n-2`:
#   For `j` from `i+1` to `n-1`:
#     Cost = `nums[0] + nums[i] + nums[j]`
#
# Let's re-trace Example 1: nums = [1,2,3,12], n = 4
# i ranges from 1 to 4-2 = 2
# j ranges from i+1 to 4-1 = 3
#
# i = 1:
#   j ranges from 1+1 = 2 to 3
#   j = 2:
#     First subarray starts at index 0, ends at 1-1=0. `nums[0]` (cost 1)
#     Second subarray starts at index 1, ends at 2-1=1. `nums[1]` (cost 2)
#     Third subarray starts at index 2, ends at 3. `nums[2..3]` (cost 3)
#     Sum = nums[0] + nums[1] + nums[2] = 1 + 2 + 3 = 6. min_cost = 6.
#   j = 3:
#     First subarray starts at index 0, ends at 0. `nums[0]` (cost 1)
#     Second subarray starts at index 1, ends at 3-1=2. `nums[1..2]` (cost 2)
#     Third subarray starts at index 3, ends at 3. `nums[3]` (cost 12)
#     Sum = nums[0] + nums[1] + nums[3] = 1 + 2 + 12 = 15. min_cost = min(6, 15) = 6.
#
# i = 2:
#   j ranges from 2+1 = 3 to 3
#   j = 3:
#     First subarray starts at index 0, ends at 0. `nums[0]` (cost 1)
#     Second subarray starts at index 1, ends at 3-1=2. `nums[1..2]` (cost 2)
#     Third subarray starts at index 3, ends at 3. `nums[3]` (cost 12)
#     Sum = nums[0] + nums[2] + nums[3] = 1 + 3 + 12 = 16. min_cost = min(6, 16) = 6.
#
# This interpretation seems correct: the three costs come from `nums[0]`, `nums[i]`, and `nums[j]`.
# The split points are effectively *before* indices `i` and `j`.
#
# This interpretation aligns with the problem statement:
# "You need to divide nums into 3 disjoint contiguous subarrays."
# If we pick indices `i` and `j` such that `0 < i < j < n`, then:
# Subarray 1: `nums[0...i-1]`, cost is `nums[0]`
# Subarray 2: `nums[i...j-1]`, cost is `nums[i]`
# Subarray 3: `nums[j...n-1]`, cost is `nums[j]`
#
# We need `i` to be at least 1 (so subarray 1 is non-empty).
# We need `j` to be at least `i+1` (so subarray 2 is non-empty).
# We need `n-1` to be at least `j` (so subarray 3 is non-empty).
#
# So the ranges are:
# `i` from 1 to `n-2` (inclusive)
# `j` from `i+1` to `n-1` (inclusive)
#
# This looks like the correct interpretation.
#
# Time Complexity:
# We have two nested loops. The outer loop runs `n-2` times. The inner loop runs at most `n-2` times.
# The total number of iterations is approximately `O(n^2)`.
# Inside the loop, we do constant time operations (addition and comparison).
# So, the overall time complexity is O(n^2).
# Given n <= 50, n^2 <= 2500, which is very efficient.
#
# Space Complexity:
# We are only using a few variables to store the minimum cost and loop indices.
# We are not using any auxiliary data structures that grow with the input size.
# So, the space complexity is O(1).

class Solution:
    def minimumCost(self, nums: list[int]) -> int:
        # Get the length of the input array.
        n = len(nums)
        
        # Initialize the minimum cost to a very large value.
        # This ensures that the first calculated cost will be smaller and update min_cost.
        min_cost = float('inf')
        
        # Iterate through all possible split points for the first and second subarrays.
        # 'i' represents the starting index of the second subarray.
        # The first subarray is nums[0...i-1]. Its cost is nums[0].
        # 'i' must be at least 1 (for the first subarray to be non-empty).
        # 'i' can go up to n-2 (to leave at least two elements for the second and third subarrays).
        for i in range(1, n - 1):
            # 'j' represents the starting index of the third subarray.
            # The second subarray is nums[i...j-1]. Its cost is nums[i].
            # 'j' must be at least i+1 (for the second subarray to be non-empty).
            # 'j' can go up to n-1 (to leave at least one element for the third subarray).
            for j in range(i + 1, n):
                # The third subarray is nums[j...n-1]. Its cost is nums[j].
                
                # Calculate the total cost for this partition.
                # Cost = (cost of first subarray) + (cost of second subarray) + (cost of third subarray)
                # Cost = nums[0] + nums[i] + nums[j]
                current_cost = nums[0] + nums[i] + nums[j]
                
                # Update the minimum cost if the current cost is smaller.
                min_cost = min(min_cost, current_cost)
                
        # Return the overall minimum cost found.
        return min_cost

```