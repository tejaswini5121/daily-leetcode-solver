```python
# Finds the number of elements in arr1 that are a "distance value" away from all elements in arr2.
# A distance value is defined as the number of elements arr1[i] such that there is not any element arr2[j] where |arr1[i]-arr2[j]| <= d.
# Link: https://leetcode.com/problems/find-the-distance-value-between-two-arrays/
#
# Approach:
# For each element in arr1, we iterate through arr2 to check if the absolute difference between the element
# and any element in arr2 is less than or equal to d. If we find such an element in arr2, we know that the
# current element from arr1 does not contribute to the distance value, and we can move to the next element in arr1.
# If, after checking all elements in arr2, we don't find any element that satisfies the condition, then the current
# element from arr1 contributes to the distance value.
#
# To optimize the search in arr2, we can sort arr2 first. Then, for each element in arr1, we can use binary search
# (specifically, `bisect_left` from the `bisect` module) to find the insertion point of `arr1[i] - d`.
# If the element at that insertion point (or the element before it if the insertion point is 0) is within the
# range [arr1[i] - d, arr1[i] + d], then arr1[i] is not a distance value.
#
# Time Complexity:
# Sorting arr2 takes O(m log m) where m is the length of arr2.
# For each element in arr1 (length n), we perform a binary search in arr2, which takes O(log m).
# So, the total time complexity is O(m log m + n log m).
# If we don't sort arr2 and iterate through it for each element of arr1, the complexity would be O(n*m).
#
# Space Complexity:
# O(log m) or O(m) for sorting arr2, depending on the sorting algorithm used by Python's `sort()` (Timsort).
# If we don't sort and just iterate, it's O(1).

import bisect

class Solution:
    def findTheDistanceValue(self, arr1: list[int], arr2: list[int], d: int) -> int:
        # Sort arr2 to enable efficient binary search
        arr2.sort()
        
        distance_value = 0
        
        # Iterate through each element in arr1
        for num1 in arr1:
            # For the current number in arr1, we need to check if there's any number in arr2
            # such that the absolute difference is less than or equal to d.
            # This is equivalent to checking if there is any number 'num2' in arr2 such that:
            # num1 - d <= num2 <= num1 + d
            
            # We can use binary search to efficiently find if such a 'num2' exists.
            # We are looking for an element `num2` in `arr2` such that `num1 - d <= num2 <= num1 + d`.
            # This means `num2` must be greater than or equal to `num1 - d` AND less than or equal to `num1 + d`.
            
            # Find the index where `num1 - d` would be inserted to maintain sorted order.
            # `bisect_left` returns the leftmost index where an element can be inserted.
            # If `arr2[idx] >= num1 - d`, then `idx` is the first potential candidate.
            idx = bisect.bisect_left(arr2, num1 - d)
            
            # Check if the found index `idx` is within bounds of `arr2`
            # AND if the element at `arr2[idx]` is less than or equal to `num1 + d`.
            # If both conditions are true, it means there is at least one element `arr2[j]`
            # such that `num1 - d <= arr2[j] <= num1 + d`.
            # In this case, `num1` does NOT contribute to the distance value.
            
            is_close_to_any_in_arr2 = False
            if idx < len(arr2) and arr2[idx] <= num1 + d:
                is_close_to_any_in_arr2 = True
                
            # If `num1` is not close to any element in `arr2` (i.e., the condition `is_close_to_any_in_arr2` is False),
            # then `num1` contributes to the distance value.
            if not is_close_to_any_in_arr2:
                distance_value += 1
        
        return distance_value

```