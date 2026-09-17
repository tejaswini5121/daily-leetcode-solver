```python
# Find Two Non-overlapping Sub-arrays Each With Target Sum
# Link: https://leetcode.com/problems/find-two-non-overlapping-sub-arrays-each-with-target-sum/
#
# Approach:
# The problem asks for the minimum sum of lengths of two non-overlapping sub-arrays that each sum to the target.
# We can solve this by iterating through all possible split points in the array. For each split point, we will find
# the minimum length sub-array ending at or before the split point that sums to the target, and the minimum length
# sub-array starting at or after the split point that sums to the target.
#
# To efficiently find sub-arrays with a target sum, we can use a sliding window approach or prefix sums.
# Given the constraints and the need to find sub-arrays of a specific sum, prefix sums with a hash map are more suitable.
#
# We will first precompute for each index `i`, the minimum length of a sub-array ending at `i` that sums to `target`.
# Let's call this `min_len_ending_at[i]`. If no such sub-array exists, we can store infinity or a large value.
# We can compute `min_len_ending_at` by iterating through the array and maintaining a running sum. For each running sum,
# we check if `running_sum - target` exists in our prefix sum map. If it does, we have found a sub-array. We then update
# `min_len_ending_at[i]` with the minimum length found so far.
#
# Similarly, we will precompute for each index `i`, the minimum length of a sub-array starting at `i` that sums to `target`.
# Let's call this `min_len_starting_at[i]`. This can be done by iterating from right to left.
#
# After precomputing these two arrays, we can iterate through all possible split points `i` from 0 to n-2.
# For each `i`, the minimum sum of lengths for a pair of non-overlapping sub-arrays would be `min_len_ending_at[i] + min_len_starting_at[i+1]`.
# We take the minimum of these sums across all `i`.
#
# To handle the prefix sums efficiently:
# We can use a dictionary `prefix_sum_map` where keys are prefix sums and values are the index where that prefix sum was first encountered.
# When calculating `min_len_ending_at`, we iterate from left to right.
# `current_sum` is the prefix sum up to the current index `j`.
# If `current_sum - target` is in `prefix_sum_map`, it means there's a sub-array ending at `j` with sum `target`.
# The start index of this sub-array is `prefix_sum_map[current_sum - target] + 1`.
# The length is `j - (prefix_sum_map[current_sum - target] + 1) + 1 = j - prefix_sum_map[current_sum - target]`.
# We need to store the minimum length for each ending index.
#
# Let's refine the `min_len_ending_at` calculation:
# `min_len_ending_at[i]` = minimum length of a sub-array ending at or before index `i` with sum `target`.
# This is better calculated by iterating through the array, maintaining prefix sums, and updating a global minimum length found so far.
#
# A better approach would be:
# 1. Calculate `min_len_left[i]`: the minimum length of a sub-array ending at or before index `i` with sum `target`.
# 2. Calculate `min_len_right[i]`: the minimum length of a sub-array starting at or after index `i` with sum `target`.
#
# To calculate `min_len_left`:
# Iterate from left to right. Maintain `current_sum` and `prefix_sum_map` (sum -> index).
# `min_len_so_far = infinity`
# `min_len_left[i]` is the minimum of `min_len_so_far` considering sub-arrays ending at `i`.
# When `current_sum - target` is found in `prefix_sum_map` at index `prev_idx`:
#   `length = i - prev_idx`
#   `min_len_so_far = min(min_len_so_far, length)`
#   `min_len_left[i] = min_len_so_far`
# If `current_sum - target` is not found, `min_len_left[i] = min_len_left[i-1]` (or infinity if i=0).
#
# To calculate `min_len_right`:
# Iterate from right to left. Maintain `current_sum` and `prefix_sum_map` (sum -> index).
# `min_len_so_far = infinity`
# `min_len_right[i]` is the minimum of `min_len_so_far` considering sub-arrays starting at `i`.
# When `current_sum - target` is found in `prefix_sum_map` at index `prev_idx`:
#   `length = prev_idx - i`
#   `min_len_so_far = min(min_len_so_far, length)`
#   `min_len_right[i] = min_len_so_far`
# If `current_sum - target` is not found, `min_len_right[i] = min_len_right[i+1]` (or infinity if i=n-1).
#
# Finally, iterate through `i` from 0 to n-2 and calculate `min_len_left[i] + min_len_right[i+1]`.
# The overall minimum of these sums is the answer.
#
# Time Complexity: O(n) - We iterate through the array a few times. Dictionary operations are O(1) on average.
# Space Complexity: O(n) - For prefix sum maps and the `min_len` arrays.

import sys

class Solution:
    def minSumOfLengths(self, arr: list[int], target: int) -> int:
        n = len(arr)
        # Initialize min_len_left: min_len_left[i] stores the minimum length of a sub-array
        # ending at or before index i that sums to target.
        min_len_left = [sys.maxsize] * n
        # Initialize min_len_right: min_len_right[i] stores the minimum length of a sub-array
        # starting at or after index i that sums to target.
        min_len_right = [sys.maxsize] * n

        # Calculate min_len_left
        prefix_sum_map = {0: -1} # Map: prefix_sum -> index
        current_sum = 0
        min_len_so_far = sys.maxsize

        for i in range(n):
            current_sum += arr[i]
            
            # Check if a sub-array ending at i with sum target exists
            if current_sum - target in prefix_sum_map:
                # The start index of this sub-array is prefix_sum_map[current_sum - target] + 1
                prev_idx = prefix_sum_map[current_sum - target]
                length = i - prev_idx
                # Update the minimum length found so far that ends at or before current index i
                min_len_so_far = min(min_len_so_far, length)
            
            # Store the minimum length found so far for index i
            min_len_left[i] = min_len_so_far
            
            # Update the prefix sum map. If current_sum already exists, we keep the earlier index
            # because we are looking for the *shortest* sub-array. If we update to a later index,
            # it would mean a longer prefix sum for the same value, which isn't what we need for finding
            # the shortest sub-array ending here. However, the logic for finding the shortest sub-array
            # ending at `i` depends on `current_sum - target`. If `current_sum` is seen again, it means
            # the elements between the previous occurrence and the current one sum to 0, which is not relevant
            # for finding a sum `target`. So, we simply store the first occurrence of `current_sum`.
            if current_sum not in prefix_sum_map:
                prefix_sum_map[current_sum] = i

        # Calculate min_len_right
        prefix_sum_map = {0: n} # Map: prefix_sum -> index. Initialize with n for right-to-left sums.
        current_sum = 0
        min_len_so_far = sys.maxsize

        for i in range(n - 1, -1, -1):
            current_sum += arr[i]
            
            # Check if a sub-array starting at i with sum target exists
            if current_sum - target in prefix_sum_map:
                # The end index of this sub-array is prefix_sum_map[current_sum - target] - 1
                next_idx = prefix_sum_map[current_sum - target]
                length = next_idx - i
                # Update the minimum length found so far that starts at or after current index i
                min_len_so_far = min(min_len_so_far, length)
            
            # Store the minimum length found so far for index i
            min_len_right[i] = min_len_so_far
            
            # Update the prefix sum map. For right-to-left, we are interested in the first occurrence
            # of a prefix sum when moving from right. If `current_sum` is seen again, it means
            # the elements between the previous occurrence and the current one sum to 0, which isn't useful.
            if current_sum not in prefix_sum_map:
                prefix_sum_map[current_sum] = i

        # Find the minimum sum of lengths of two non-overlapping sub-arrays
        min_total_len = sys.maxsize

        # Iterate through all possible split points.
        # The first sub-array ends at index `i`, and the second sub-array starts at index `i + 1`.
        for i in range(n - 1):
            # Ensure that both left and right sub-arrays exist
            if min_len_left[i] != sys.maxsize and min_len_right[i + 1] != sys.maxsize:
                min_total_len = min(min_total_len, min_len_left[i] + min_len_right[i + 1])

        # If min_total_len is still sys.maxsize, it means no such pair of sub-arrays was found.
        return min_total_len if min_total_len != sys.maxsize else -1

```