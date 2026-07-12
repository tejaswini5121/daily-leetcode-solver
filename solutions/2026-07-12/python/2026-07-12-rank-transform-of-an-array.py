```python
# Problem: Rank Transform of an Array
# Given an array of integers, replace each element with its rank.
# Ranks start from 1, larger elements have larger ranks, and equal elements have equal ranks.
# Link: https://leetcode.com/problems/rank-transform-of-an-array/
#
# Approach:
# 1. Create a sorted list of unique elements from the input array. This will establish the order for ranking.
# 2. Create a dictionary (hash map) to store the rank of each unique element. The rank will be its index in the sorted unique list plus 1.
# 3. Iterate through the original input array and for each element, look up its rank in the dictionary and append it to the result array.
#
# Time Complexity:
# - Sorting the array: O(N log N), where N is the length of arr.
# - Creating unique sorted list: O(N) (after sorting).
# - Building the rank map: O(U), where U is the number of unique elements (U <= N).
# - Iterating through the original array to build the result: O(N).
# Overall: O(N log N) due to sorting.
#
# Space Complexity:
# - Storing the unique sorted array: O(U)
# - Storing the rank map: O(U)
# - Storing the result array: O(N)
# Overall: O(N) in the worst case where all elements are unique.

class Solution:
    def arrayRankTransform(self, arr: list[int]) -> list[int]:
        # Handle the edge case of an empty array.
        if not arr:
            return []

        # 1. Create a sorted list of unique elements from the input array.
        # We use a set to get unique elements and then sort them.
        sorted_unique_elements = sorted(list(set(arr)))

        # 2. Create a dictionary (hash map) to store the rank of each unique element.
        # The rank is the index in the sorted_unique_elements list + 1.
        rank_map = {}
        for i, element in enumerate(sorted_unique_elements):
            rank_map[element] = i + 1

        # 3. Iterate through the original input array and build the result array.
        # For each element in the original array, find its rank from the rank_map.
        result = []
        for element in arr:
            result.append(rank_map[element])

        # Return the array with elements replaced by their ranks.
        return result

```