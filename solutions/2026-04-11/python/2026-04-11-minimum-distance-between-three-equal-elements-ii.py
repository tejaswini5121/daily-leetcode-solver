```python
# Problem Summary: Find the minimum distance between three equal elements in an array.
# Problem Link: https://leetcode.com/problems/minimum-distance-between-three-equal-elements-ii/
#
# Approach:
# The core idea is to group indices by their corresponding values. We can use a hash map (dictionary in Python)
# to store lists of indices for each unique number.
# For each number in the input array `nums`, we iterate through its list of indices.
# If a number appears at least three times, we can form "good tuples".
# The distance of a good tuple (i, j, k) is |i - j| + |j - k| + |k - i|.
# To minimize this distance, we want the indices to be as close as possible.
#
# Let the indices for a specific number be `idx_list = [p1, p2, p3, ..., pn]`, where p1 < p2 < ... < pn.
# We are looking for three indices `pi, pj, pk` from `idx_list` to minimize `|pi - pj| + |pj - pk| + |pk - pi|`.
#
# Consider three indices `a`, `b`, `c` from `idx_list` such that `a < b < c`.
# The distance is `(b - a) + (c - b) + (c - a) = 2 * (c - a)`.
# This means that for any three indices, the minimum distance is achieved when they are the smallest,
# largest, and some middle index, or more precisely, when we consider three consecutive indices.
#
# However, the problem statement `abs(i - j) + abs(j - k) + abs(k - i)` is symmetric.
# If we sort the indices for a given number `v` as `idx = [i1, i2, i3, ..., ik]`,
# we need to find `i_a, i_b, i_c` such that `abs(i_a - i_b) + abs(i_b - i_c) + abs(i_c - i_a)` is minimized.
#
# A key observation is that to minimize `|x - y| + |y - z| + |z - x|`, we should pick indices that are
# close to each other. If we pick three indices `a < b < c`, the distance is `(b-a) + (c-b) + (c-a) = 2*(c-a)`.
#
# Let's re-evaluate the distance formula: `abs(i - j) + abs(j - k) + abs(k - i)`.
# If `i < j < k`, the distance is `(j-i) + (k-j) + (k-i) = j - i + k - j + k - i = 2k - 2i = 2 * (k - i)`.
#
# The problem states "3 distinct indices". The indices themselves don't have to be consecutive in the original array.
#
# For each number that appears at least three times, we iterate through its list of indices.
# Let the sorted indices be `indices = [idx1, idx2, idx3, ..., idx_m]`.
# We are looking for three indices `a, b, c` from `indices` that minimize `abs(a - b) + abs(b - c) + abs(c - a)`.
#
# Consider the indices `idx1, idx2, ..., idx_m`.
# If we pick `idx_i`, `idx_j`, `idx_k`, where `idx_i < idx_j < idx_k`, the distance is `2 * (idx_k - idx_i)`.
# This implies that for a fixed number, to minimize the distance, we should pick the smallest and largest
# indices that are at least two positions apart.
#
# Let's check the examples carefully.
# Example 1: nums = [1,2,1,1,3]
# Indices of 1: [0, 2, 3]. Good tuple (0, 2, 3). Distance: abs(0-2) + abs(2-3) + abs(3-0) = 2 + 1 + 3 = 6.
# Here, 0 < 2 < 3. Distance = 2*(3-0) = 6.
#
# Example 2: nums = [1,1,2,3,2,1,2]
# Indices of 1: [0, 1, 5]
# Indices of 2: [2, 4, 6]
#
# For value 1, indices [0, 1, 5].
# Possible tuples: (0, 1, 5). Distance: abs(0-1) + abs(1-5) + abs(5-0) = 1 + 4 + 5 = 10.
#
# For value 2, indices [2, 4, 6].
# Possible tuples: (2, 4, 6). Distance: abs(2-4) + abs(4-6) + abs(6-2) = 2 + 2 + 4 = 8.
#
# The minimum distance is 8.
#
# The formula `abs(i - j) + abs(j - k) + abs(k - i)` is always `2 * (max(i, j, k) - min(i, j, k))` IF `i, j, k` are ordered.
# However, the indices `i, j, k` are distinct but not necessarily ordered.
#
# Let the three indices be `a, b, c`.
# The sum of absolute differences is `|a-b| + |b-c| + |c-a|`.
#
# If `a < b < c`, then `(b-a) + (c-b) + (c-a) = 2(c-a)`.
# If `a < c < b`, then `(b-a) + (b-c) + (c-a) = b-a + b-c + c-a = 2b - 2a`. This is wrong.
# Let's re-calculate carefully.
# If `a < c < b`: `|a-b| + |b-c| + |c-a| = (b-a) + (b-c) + (c-a) = b-a + b-c + c-a = 2b - 2a` This is still wrong.
#
# Let `x = min(i, j, k)`, `y = median(i, j, k)`, `z = max(i, j, k)`.
# The distance is `|i-j| + |j-k| + |k-i|`.
# The sum of differences between three numbers `a, b, c` is `|a-b| + |b-c| + |c-a|`.
# It can be shown that this sum is minimized when two of the numbers are the same.
# But here, the indices must be distinct.
#
# Let the sorted indices for a number `v` be `idx = [p1, p2, p3, ..., pm]`.
# We need to pick `pi, pj, pk` from `idx`.
# To minimize `|pi - pj| + |pj - pk| + |pk - pi|`, we should pick indices that are "close" to each other.
#
# Consider any three indices `a, b, c`.
# Let `x = min(a, b, c)`, `m = median(a, b, c)`, `y = max(a, b, c)`.
# The sum `|a-b| + |b-c| + |c-a|` is always `2 * (y - x)`. This is a standard property.
# Proof:
# Assume `a < b < c`. Distance = `(b-a) + (c-b) + (c-a) = 2c - 2a = 2(c-a)`.
# Assume `a < c < b`. Distance = `|a-b| + |b-c| + |c-a| = (b-a) + (b-c) + (c-a) = b - a + b - c + c - a = 2b - 2a`. Here `b` is max and `a` is min. So `2(max - min)`.
# Assume `b < a < c`. Distance = `|a-b| + |b-c| + |c-a| = (a-b) + (c-b) + (c-a) = a - b + c - b + c - a = 2c - 2b`. Here `c` is max and `b` is min. So `2(max - min)`.
#
# So, for any three distinct indices `i, j, k`, the distance is `2 * (max(i, j, k) - min(i, j, k))`.
#
# Therefore, for each number `v` that appears at least 3 times, with indices `idx = [p1, p2, ..., pm]`,
# we need to find three indices `pi, pj, pk` from `idx` such that `2 * (max(pi, pj, pk) - min(pi, pj, pk))` is minimized.
# This is equivalent to minimizing `max(pi, pj, pk) - min(pi, pj, pk)`.
#
# To minimize `max - min`, we should pick indices that are as close as possible in the sorted list of indices.
# If we have sorted indices `[p1, p2, p3, p4, ...]`, the minimum `max - min` will occur between consecutive elements
# when picking three indices.
#
# For a value `v` with indices `[p1, p2, p3, ..., pm]`:
# We need to consider tuples of indices.
# If we pick `p_i, p_j, p_k` where `i < j < k`, the distance is `2 * (p_k - p_i)`.
#
# To minimize `p_k - p_i`, we should look at `p_{i+2} - p_i` for `i` from `0` to `m-3`.
# Why `p_{i+2} - p_i`?
# If we pick `p_i, p_{i+1}, p_{i+2}`, the distance is `2 * (p_{i+2} - p_i)`.
#
# Let's re-read the problem: "A tuple (i, j, k) of 3 distinct indices is good if nums[i] == nums[j] == nums[k]."
#
# My previous analysis `abs(a-b) + |b-c| + |c-a| = 2 * (max(a,b,c) - min(a,b,c))` is correct.
# So we want to minimize `max(i, j, k) - min(i, j, k)` for three indices `i, j, k` with `nums[i] == nums[j] == nums[k]`.
#
# For a given value `v`, let its indices be `idx = [p1, p2, p3, ..., pm]`, sorted: `p1 < p2 < ... < pm`.
#
# If `m < 3`, no good tuples for this value.
#
# If `m >= 3`:
# We need to pick `p_a, p_b, p_c` from `idx`.
# We want to minimize `max(p_a, p_b, p_c) - min(p_a, p_b, p_c)`.
# This minimum occurs when the three chosen indices are as close as possible in the sorted list.
#
# Consider adjacent triplets in the sorted `idx` list.
# For example, pick `p_i, p_{i+1}, p_{i+2}`.
# Here, `min = p_i`, `median = p_{i+1}`, `max = p_{i+2}`.
# The distance is `2 * (p_{i+2} - p_i)`.
#
# We should iterate through all possible starting indices `i` from `0` to `m-3` and calculate `2 * (p_{i+2} - p_i)`.
# The minimum among these values will be the minimum distance for this number.
#
# Algorithm:
# 1. Create a dictionary `val_to_indices` to store lists of indices for each number.
# 2. Iterate through `nums` with index `i` and value `num`. Append `i` to `val_to_indices[num]`.
# 3. Initialize `min_overall_distance = infinity`.
# 4. Iterate through the values (lists of indices) in `val_to_indices`.
# 5. For each list `indices` of length `m`:
#    a. If `m < 3`, continue.
#    b. Iterate `i` from `0` to `m - 3`.
#       i. Let `idx1 = indices[i]`, `idx2 = indices[i+1]`, `idx3 = indices[i+2]`.
#       ii. Calculate distance `d = 2 * (idx3 - idx1)`.
#       iii. Update `min_overall_distance = min(min_overall_distance, d)`.
# 6. If `min_overall_distance` is still infinity, return -1. Otherwise, return `min_overall_distance`.
#
# Time Complexity:
# - Building the `val_to_indices` map: O(N), where N is the length of `nums`.
# - Iterating through the map: In the worst case, all elements are unique, or all elements are the same.
#   If all elements are the same, we have one list of N indices. We iterate `i` from 0 to N-3. This is O(N).
#   If all elements are unique, each list has length 1, so we do nothing.
#   If there are K distinct values, and their indices counts are `n1, n2, ..., nK` such that `sum(ni) = N`.
#   For each value, we iterate up to `ni - 2` times. The total iterations for step 5.b is `sum(ni - 2)` for all `i` where `ni >= 3`.
#   This sum is at most `sum(ni) = N`. So, step 5 is O(N).
# Total Time Complexity: O(N).
#
# Space Complexity:
# - `val_to_indices` dictionary: In the worst case, all elements are distinct, storing N indices.
#   If all elements are the same, we store N indices for one key.
#   The space required is O(N) to store all indices.
# Total Space Complexity: O(N).
#
# Test Cases:
# Example 1: nums = [1,2,1,1,3]
# val_to_indices = {1: [0, 2, 3], 2: [1], 3: [4]}
# For 1: indices = [0, 2, 3]. m=3. i=0. idx1=0, idx2=2, idx3=3. dist = 2 * (3 - 0) = 6. min_overall_distance = 6.
# For 2: indices = [1]. m=1. Skip.
# For 3: indices = [4]. m=1. Skip.
# Return 6. Correct.
#
# Example 2: nums = [1,1,2,3,2,1,2]
# val_to_indices = {1: [0, 1, 5], 2: [2, 4, 6], 3: [3]}
# For 1: indices = [0, 1, 5]. m=3. i=0. idx1=0, idx2=1, idx3=5. dist = 2 * (5 - 0) = 10. min_overall_distance = 10.
# For 2: indices = [2, 4, 6]. m=3. i=0. idx1=2, idx2=4, idx3=6. dist = 2 * (6 - 2) = 8. min_overall_distance = min(10, 8) = 8.
# For 3: indices = [3]. m=1. Skip.
# Return 8. Correct.
#
# Example 3: nums = [1]
# val_to_indices = {1: [0]}
# For 1: indices = [0]. m=1. Skip.
# min_overall_distance remains infinity. Return -1. Correct.
#
# Edge cases:
# nums = [1, 1, 1, 1, 1]
# val_to_indices = {1: [0, 1, 2, 3, 4]}
# indices = [0, 1, 2, 3, 4]. m=5.
# i=0: idx1=0, idx2=1, idx3=2. dist = 2 * (2-0) = 4. min_overall_distance = 4.
# i=1: idx1=1, idx2=2, idx3=3. dist = 2 * (3-1) = 4. min_overall_distance = 4.
# i=2: idx1=2, idx2=3, idx3=4. dist = 2 * (4-2) = 4. min_overall_distance = 4.
# Return 4.
#
# nums = [1, 2, 3, 4, 5]
# No value appears 3 times. Return -1.
#
# nums = [1, 1, 2, 2, 3, 3]
# No value appears 3 times. Return -1.
#
# nums = [1, 1, 1, 2, 2, 2]
# val_to_indices = {1: [0, 1, 2], 2: [3, 4, 5]}
# For 1: indices = [0, 1, 2]. m=3. i=0. idx1=0, idx2=1, idx3=2. dist = 2 * (2-0) = 4. min_overall_distance = 4.
# For 2: indices = [3, 4, 5]. m=3. i=0. idx1=3, idx2=4, idx3=5. dist = 2 * (5-3) = 4. min_overall_distance = min(4, 4) = 4.
# Return 4.
#
# It seems the logic holds.
#
# Final check of the distance formula interpretation:
# The problem states "distance of a good tuple is abs(i - j) + abs(j - k) + abs(k - i)".
# My derived formula `2 * (max(i, j, k) - min(i, j, k))` is correct for any three distinct numbers.
#
# Example 1: (0, 2, 3) for value 1. Indices: [0, 2, 3].
# i=0, j=2, k=3.
# abs(0-2) + abs(2-3) + abs(3-0) = 2 + 1 + 3 = 6.
# max(0,2,3)=3, min(0,2,3)=0. 2 * (3-0) = 6. Matches.
#
# Example 2: (2, 4, 6) for value 2. Indices: [2, 4, 6].
# i=2, j=4, k=6.
# abs(2-4) + abs(4-6) + abs(6-2) = 2 + 2 + 4 = 8.
# max(2,4,6)=6, min(2,4,6)=2. 2 * (6-2) = 8. Matches.
#
# The strategy of finding `2 * (p_{i+2} - p_i)` minimizes `max - min` for triplets of indices from a single value's index list.
#
# One small optimization: when building `val_to_indices`, if a value's index list already has size 2, and we encounter a third index, we know it's a candidate.
# But processing all indices at the end is simpler and doesn't change the O(N) complexity.

```python
import sys
from collections import defaultdict

class Solution:
    def minimumDistance(self, nums: list[int]) -> int:
        # Dictionary to store lists of indices for each unique number.
        # The key is the number, and the value is a list of its indices in the input array.
        val_to_indices = defaultdict(list)

        # Populate the dictionary with indices for each number.
        for i, num in enumerate(nums):
            val_to_indices[num].append(i)

        # Initialize the minimum overall distance to a very large value.
        # If no good tuples are found, this value will remain unchanged.
        min_overall_distance = sys.maxsize

        # Iterate through each unique number and its list of indices.
        for indices in val_to_indices.values():
            # A good tuple requires at least three distinct indices for the same number.
            if len(indices) < 3:
                continue

            # For a given number with indices [p1, p2, p3, ..., pm] where p1 < p2 < ... < pm,
            # the distance of a good tuple (i, j, k) is abs(i - j) + abs(j - k) + abs(k - i).
            # This sum simplifies to 2 * (max(i, j, k) - min(i, j, k)).
            # To minimize this distance, we need to minimize the difference between the maximum and minimum indices chosen.
            # This minimum difference for three indices from a sorted list [p1, ..., pm] is achieved by picking
            # three indices that are closest to each other. The closest possible configuration of three distinct indices
            # from a sorted list is `p_i, p_{i+1}, p_{i+2}`. The distance for this triplet is 2 * (p_{i+2} - p_i).
            # We iterate through all such consecutive triplets.

            # Iterate through the indices list, considering every possible starting index `i`
            # for a triplet `(indices[i], indices[i+1], indices[i+2])`.
            # The loop goes up to `len(indices) - 3` to ensure we have `i+2` as a valid index.
            for i in range(len(indices) - 2):
                # Get the three closest indices for the current number.
                idx1 = indices[i]
                # idx2 = indices[i+1] # The median index is not strictly needed for calculation, but conceptually part of the triplet.
                idx3 = indices[i+2] # The farthest index in this triplet.

                # Calculate the distance for this triplet.
                # The distance is 2 * (max_index - min_index).
                # Here, max_index is idx3 and min_index is idx1.
                current_distance = 2 * (idx3 - idx1)

                # Update the overall minimum distance found so far.
                min_overall_distance = min(min_overall_distance, current_distance)

        # If min_overall_distance is still sys.maxsize, it means no good tuples were found.
        # Otherwise, we have found the minimum possible distance.
        if min_overall_distance == sys.maxsize:
            return -1
        else:
            return min_overall_distance

```