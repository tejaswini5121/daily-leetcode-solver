```python
# Problem: Sum of Distances
# Problem Summary: Calculate the sum of absolute differences between an index and all other indices with the same value.
# Link: https://leetcode.com/problems/sum-of-distances/
#
# Approach:
# The core idea is to group indices by their values. For each distinct value, we need to calculate the sum of distances
# for all indices that hold this value.
#
# Let's consider a specific value `x` and the indices where it appears: `i_1, i_2, ..., i_k`.
# For an index `i_p` that contains `x`, the sum of distances is:
#   Sum(|i_p - i_j|) for all `j` from 1 to `k` where `j != p`.
#
# This can be rewritten by separating terms where `i_j < i_p` and `i_j > i_p`:
#   Sum(i_p - i_j) for `j < p`  +  Sum(i_j - i_p) for `j > p`
#   = (p * i_p - Sum(i_j for `j < p`))  +  (Sum(i_j for `j > p`) - (k - p) * i_p)
#
# To efficiently calculate the sums of `i_j` for `j < p` and `j > p`, we can use prefix sums and suffix sums.
#
# Steps:
# 1. Create a dictionary `value_to_indices` to store a list of indices for each unique value in `nums`.
# 2. Iterate through `nums` and populate `value_to_indices`.
# 3. Initialize an answer array `arr` of the same length as `nums` with zeros.
# 4. For each unique value `val` in `value_to_indices`:
#    a. Get the list of `indices` where `val` appears.
#    b. If there's only one index for this value, `arr[index]` remains 0.
#    c. If there are multiple indices:
#       i. Calculate the prefix sum of these `indices`. Let `prefix_sum_indices[m]` be the sum of the first `m` indices.
#       ii. Calculate the total sum of these `indices`.
#       iii. Iterate through the `indices` list with their corresponding `index_in_indices` (0-based position in the list).
#           - For the current `index_in_nums` at `indices[index_in_indices]`:
#             - `count_left`: Number of elements to the left = `index_in_indices`.
#             - `sum_left`: Sum of elements to the left = `prefix_sum_indices[index_in_indices]` (if `index_in_indices > 0`, else 0).
#             - `count_right`: Number of elements to the right = `len(indices) - 1 - index_in_indices`.
#             - `sum_right`: Sum of elements to the right = `total_sum_of_indices - prefix_sum_indices[index_in_indices + 1]` (if `index_in_indices + 1 < len(indices)`, else 0).
#             - Calculate `left_dist = count_left * index_in_nums - sum_left`.
#             - Calculate `right_dist = sum_right - count_right * index_in_nums`.
#             - `arr[index_in_nums] = left_dist + right_dist`.
#
# Time Complexity:
# - Populating `value_to_indices`: O(N), where N is the length of `nums`.
# - Iterating through unique values and their indices: For each unique value, we iterate through its occurrences.
#   In the worst case, all elements are the same, so we iterate through N elements once to calculate prefix sums
#   and once to calculate the final distances. If all elements are distinct, we still iterate through N elements once.
#   The total number of index visits across all unique values is N.
# - Therefore, the overall time complexity is O(N).
#
# Space Complexity:
# - `value_to_indices` dictionary: In the worst case (all elements are the same), it stores N indices. O(N).
# - `arr` array: O(N).
# - Prefix sum arrays for each value: At most O(N) in total across all values if all elements are distinct, or O(N) if all elements are the same.
# - Therefore, the overall space complexity is O(N).

import collections

class Solution:
    def getDistances(self, nums: list[int]) -> list[int]:
        # Dictionary to store indices for each unique value.
        # Key: value from nums, Value: list of indices where this value appears.
        value_to_indices = collections.defaultdict(list)

        # Populate the dictionary by iterating through the input array.
        for i, num in enumerate(nums):
            value_to_indices[num].append(i)

        # Initialize the result array with zeros.
        arr = [0] * len(nums)

        # Process each unique value found in nums.
        for val, indices in value_to_indices.items():
            # If a value appears only once, its distance sum is 0, which is already handled by initialization.
            if len(indices) <= 1:
                continue

            # Calculate prefix sums for the current list of indices.
            # prefix_sum_indices[k] will store the sum of the first k indices in the 'indices' list.
            prefix_sum_indices = [0] * (len(indices) + 1)
            for k in range(len(indices)):
                prefix_sum_indices[k+1] = prefix_sum_indices[k] + indices[k]

            # Get the total sum of all indices for the current value.
            total_sum_of_indices = prefix_sum_indices[-1]

            # Calculate the sum of distances for each index where 'val' appears.
            for k, current_index_in_nums in enumerate(indices):
                # k is the 0-based position of 'current_index_in_nums' within the 'indices' list.

                # Count of indices to the left of current_index_in_nums.
                count_left = k
                # Sum of indices to the left of current_index_in_nums.
                # This is the sum of the first 'k' elements from the 'indices' list.
                sum_left = prefix_sum_indices[k] # prefix_sum_indices[0] is 0, so this is correct for k=0.

                # Count of indices to the right of current_index_in_nums.
                count_right = len(indices) - 1 - k
                # Sum of indices to the right of current_index_in_nums.
                # This is the total sum minus the sum of indices up to and including current_index_in_nums.
                # We subtract prefix_sum_indices[k+1] because it includes the current index.
                sum_right = total_sum_of_indices - prefix_sum_indices[k+1]

                # Calculate the sum of distances for elements to the left.
                # For each element j < current_index_in_nums, the distance is current_index_in_nums - j.
                # Summing this gives count_left * current_index_in_nums - sum_left.
                distance_left = count_left * current_index_in_nums - sum_left

                # Calculate the sum of distances for elements to the right.
                # For each element j > current_index_in_nums, the distance is j - current_index_in_nums.
                # Summing this gives sum_right - count_right * current_index_in_nums.
                distance_right = sum_right - count_right * current_index_in_nums

                # The total sum of distances for arr[current_index_in_nums] is the sum of distances to the left and right.
                arr[current_index_in_nums] = distance_left + distance_right

        return arr
```