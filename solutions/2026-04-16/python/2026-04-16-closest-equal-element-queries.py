```python
# Problem: Closest Equal Element Queries
# LeetCode Link: https://leetcode.com/problems/closest-equal-element-queries/
#
# Approach:
# To efficiently find the closest equal element in a circular array, we can pre-process the array.
# We'll use a hash map (dictionary in Python) to store the indices for each unique number.
# The keys of the hash map will be the numbers in `nums`, and the values will be sorted lists of indices where that number appears.
# For each query:
# 1. Get the value `val` at `nums[query_index]`.
# 2. Retrieve the sorted list of indices `indices` for `val` from the hash map.
# 3. If `indices` contains only one element (meaning it's the only occurrence of `val`), the answer is -1.
# 4. If `indices` has multiple elements, we need to find the minimum circular distance from `query_index` to any other index in `indices`.
#    We can use binary search (`bisect_left`) on the sorted `indices` list to find the insertion point for `query_index`.
#    This insertion point helps us identify potential nearest neighbors (the element just before and the element just after `query_index` in the sorted list).
#    Let the sorted indices be `[i_1, i_2, ..., i_k]`.
#    If `query_index` is at `indices[p]`, we consider `indices[p-1]` and `indices[p+1]` as candidates.
#    The distances need to account for the circular nature of the array.
#    The distance between two indices `a` and `b` in a circular array of length `n` is `min(abs(a-b), n - abs(a-b))`.
#    We calculate the distances to the element before and the element after `query_index` in the `indices` list, handling wrap-around cases for `p-1` and `p+1` (e.g., if `p` is 0, the previous element is the last one in the list).
#    The minimum of these circular distances is the answer for the query.
#
# Time Complexity:
# - Pre-processing (building the hash map): O(N), where N is the length of `nums`. Each element is inserted into a list once.
# - For each query:
#   - Hash map lookup: O(1) on average.
#   - Binary search on `indices`: O(log K), where K is the number of occurrences of the queried value. In the worst case, K can be N. So, O(log N).
#   - Calculating distances: O(1).
# - Total time complexity for Q queries: O(N + Q * log N).
#
# Space Complexity:
# - O(N) to store the hash map, where each index is stored once.
```
import collections
import bisect

class Solution:
    def closestEqualElement(self, nums: list[int], queries: list[int]) -> list[int]:
        # Store the indices for each number in a dictionary.
        # The keys are the numbers, and the values are sorted lists of their indices.
        val_to_indices = collections.defaultdict(list)
        for i, num in enumerate(nums):
            val_to_indices[num].append(i)

        n = len(nums)
        answer = []

        for query_index in queries:
            val = nums[query_index]
            indices = val_to_indices[val]

            # If the value appears only once, there's no other equal element.
            if len(indices) == 1:
                answer.append(-1)
                continue

            # Use binary search to find the position of query_index in the sorted indices list.
            # bisect_left finds the insertion point to maintain sorted order.
            pos = bisect.bisect_left(indices, query_index)

            min_dist = float('inf')

            # Consider the element immediately after query_index in the sorted list.
            # If pos is within bounds and not the last element.
            if pos < len(indices) - 1:
                next_idx = indices[pos + 1]
                # Calculate circular distance
                dist = abs(next_idx - query_index)
                min_dist = min(min_dist, dist)

            # Consider the element immediately before query_index in the sorted list.
            # If pos is greater than 0.
            if pos > 0:
                prev_idx = indices[pos - 1]
                # Calculate circular distance
                dist = abs(prev_idx - query_index)
                min_dist = min(min_dist, dist)

            # Handle circularity by checking the distance to the "wrapped around" neighbors.
            # If query_index is the first occurrence, the closest "previous" could be the last occurrence.
            # If query_index is the last occurrence, the closest "next" could be the first occurrence.
            
            # Distance to the last occurrence if query_index is not the last one
            if pos == 0 and len(indices) > 1: # If query_index is the first in the list
                last_idx_val = indices[-1]
                # Circular distance from query_index to the last index
                circular_dist = (last_idx_val - query_index + n) % n
                min_dist = min(min_dist, circular_dist)
            
            # Distance to the first occurrence if query_index is not the first one
            if pos == len(indices) - 1 and len(indices) > 1: # If query_index is the last in the list
                first_idx_val = indices[0]
                # Circular distance from query_index to the first index
                circular_dist = (query_index - first_idx_val + n) % n
                min_dist = min(min_dist, circular_dist)


            # If min_dist is still infinity, it means no other equal element was found,
            # but this case is already handled by len(indices) == 1 check.
            # However, if there are multiple occurrences, we must have found a distance.
            # If for some reason min_dist wasn't updated (e.g., indices list had only one element,
            # which we already handled), it would remain inf.
            # In this problem's logic, if len(indices) > 1, we will always find a valid distance.
            answer.append(min_dist)

        return answer

```