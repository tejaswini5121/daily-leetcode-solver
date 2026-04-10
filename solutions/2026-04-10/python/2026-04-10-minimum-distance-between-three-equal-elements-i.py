```python
# Problem: Minimum Distance Between Three Equal Elements I
# Summary: Find the minimum distance between three distinct indices in an array
#          that have the same value. Distance is defined as the sum of absolute
#          differences between the indices.
# Link: https://leetcode.com/problems/minimum-distance-between-three-equal-elements-i/
#
# Approach:
# 1. Use a dictionary (hash map) to store the indices for each unique number.
#    The keys will be the numbers in `nums`, and the values will be lists of indices
#    where that number appears.
# 2. Iterate through the `nums` array and populate the dictionary.
# 3. Initialize `min_distance` to infinity.
# 4. Iterate through the values (lists of indices) in the dictionary.
# 5. If a list of indices has fewer than 3 elements, it cannot form a good tuple,
#    so skip it.
# 6. If a list has 3 or more elements, iterate through all possible combinations
#    of 3 distinct indices (i, j, k) from this list.
# 7. For each combination, calculate the distance: abs(i - j) + abs(j - k) + abs(k - i).
# 8. Update `min_distance` if the calculated distance is smaller.
# 9. After checking all numbers and their index combinations, if `min_distance` is
#    still infinity, it means no good tuples were found, so return -1. Otherwise,
#    return `min_distance`.
#
# Time Complexity:
# Let N be the length of the input array `nums`.
# Let K be the maximum number of occurrences of any single number.
# - Populating the hash map takes O(N) time.
# - Iterating through the hash map values:
#   - For each number, if it appears K times, we need to find combinations of 3 indices.
#     The number of combinations of 3 indices from K indices is O(K^3).
#   - In the worst case, all numbers could be the same (K=N), leading to O(N^3) for
#     combination generation. However, K is bounded by N.
#   - The problem constraints state 1 <= n <= 100. So, N^3 is at most 100^3 = 1,000,000.
#     This is feasible.
# - Overall, the time complexity is dominated by the combinations generation, which is
#   approximately O(N * K^3) in the worst case where one number appears N times,
#   but given N <= 100, it's effectively O(N^3).
#
# Space Complexity:
# O(N) in the worst case, where all elements are distinct and their indices are stored.
# If many elements are the same, the space complexity depends on the distribution,
# but it won't exceed O(N) because each index is stored exactly once.
#

import sys

class Solution:
    def minDistance(self, nums: list[int]) -> int:
        # Dictionary to store indices for each number.
        # Key: number, Value: list of indices where the number appears.
        num_indices = {}

        # Populate the dictionary with indices.
        for i, num in enumerate(nums):
            if num not in num_indices:
                num_indices[num] = []
            num_indices[num].append(i)

        # Initialize minimum distance to a very large value.
        # We use sys.maxsize to represent infinity.
        min_distance = sys.maxsize

        # Iterate through each number and its list of indices.
        for num, indices in num_indices.items():
            # A good tuple requires at least 3 occurrences of the same number.
            if len(indices) >= 3:
                # Iterate through all combinations of 3 distinct indices for this number.
                # We use three nested loops for this.
                for i_idx in range(len(indices)):
                    for j_idx in range(i_idx + 1, len(indices)): # j_idx must be greater than i_idx for distinctness
                        for k_idx in range(j_idx + 1, len(indices)): # k_idx must be greater than j_idx for distinctness
                            # Get the actual indices from the list.
                            idx1 = indices[i_idx]
                            idx2 = indices[j_idx]
                            idx3 = indices[k_idx]

                            # Calculate the distance for the current tuple (idx1, idx2, idx3).
                            current_distance = abs(idx1 - idx2) + abs(idx2 - idx3) + abs(idx3 - idx1)

                            # Update the minimum distance if the current distance is smaller.
                            min_distance = min(min_distance, current_distance)

        # If min_distance is still sys.maxsize, it means no good tuples were found.
        # Otherwise, return the calculated minimum distance.
        return min_distance if min_distance != sys.maxsize else -1

```