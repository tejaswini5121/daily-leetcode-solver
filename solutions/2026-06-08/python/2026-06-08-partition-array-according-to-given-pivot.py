```python
# Problem: Partition Array According to Given Pivot
# Link: https://leetcode.com/problems/partition-array-according-to-given-pivot/
# Approach:
# The problem requires partitioning an array based on a pivot value while maintaining the relative order of elements smaller than and greater than the pivot.
# A straightforward approach is to iterate through the input array `nums` three times.
# 1. First pass: Collect all elements strictly less than `pivot` into a temporary list.
# 2. Second pass: Collect all elements equal to `pivot` into another temporary list.
# 3. Third pass: Collect all elements strictly greater than `pivot` into a third temporary list.
# Finally, concatenate these three lists in order (less than pivot, equal to pivot, greater than pivot) to form the rearranged array. This ensures that all conditions are met:
# - Elements less than pivot come first.
# - Elements equal to pivot come in between.
# - Elements greater than pivot come last.
# - The relative order within each group is preserved because we append them in the order they appear in the original `nums` array.
# Time Complexity: O(n), where n is the length of `nums`. We iterate through the array three times, and list concatenation takes linear time.
# Space Complexity: O(n), as we create three temporary lists that in the worst case can store all elements of `nums`.

class Solution:
    def pivotArray(self, nums: list[int], pivot: int) -> list[int]:
        """
        Rearranges the array `nums` such that elements less than `pivot` appear
        before elements greater than `pivot`, and elements equal to `pivot`
        appear in between. The relative order of elements within each group
        is maintained.
        """
        less_than_pivot = []  # To store elements smaller than pivot
        equal_to_pivot = []   # To store elements equal to pivot
        greater_than_pivot = [] # To store elements larger than pivot

        # Iterate through the input array `nums`
        for num in nums:
            if num < pivot:
                less_than_pivot.append(num) # Add to less_than_pivot list
            elif num == pivot:
                equal_to_pivot.append(num)  # Add to equal_to_pivot list
            else: # num > pivot
                greater_than_pivot.append(num) # Add to greater_than_pivot list

        # Concatenate the three lists in the desired order
        # This ensures elements < pivot come first, then == pivot, then > pivot.
        # The relative order within each group is preserved due to appending in order.
        return less_than_pivot + equal_to_pivot + greater_than_pivot

```