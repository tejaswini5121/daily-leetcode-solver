# Problem Summary:
# Given an array of unique integers, find all integers missing from the range defined by the minimum and maximum elements present in the array.
# The original array is guaranteed to contain the smallest and largest integers of its full range.
# Link: https://leetcode.com/problems/find-missing-elements/

# Approach Explanation:
# 1. Determine the full range: First, find the minimum and maximum values within the input `nums` array. These two values define the inclusive boundaries of the complete sequence of numbers that should have been present.
# 2. Create an efficient lookup structure: Convert the input `nums` list into a hash set (Python's `set`). This data structure provides average O(1) time complexity for checking if an element exists, which is crucial for efficient lookups.
# 3. Iterate through the full range: Generate all integers from the calculated minimum value up to the maximum value (inclusive).
# 4. Identify missing elements: For each integer in this generated range, check if it is present in the hash set created from `nums`. If an integer is not found in the set, it means it was missing from the original array.
# 5. Collect and return: Add all identified missing integers to a list. Since we iterate through the range in ascending order, the resulting list of missing integers will naturally be sorted. If no integers are missing, the list will remain empty.

# Time Complexity:
# O(N + R) where N is the number of elements in `nums` and R is the size of the determined range (max_val - min_val + 1).
# - Finding `min_val` and `max_val`: O(N) using built-in `min()` and `max()`.
# - Creating the `nums_set`: O(N) to add all N elements to the set.
# - Iterating from `min_val` to `max_val` (R elements) and performing set lookups (O(1) average for each): O(R).
# Given the constraints (N <= 100, `nums[i]` <= 100), R will also be at most 100. Thus, the total time complexity is very efficient.

# Space Complexity:
# O(N + R) where N is the number of elements in `nums` and R is the size of the determined range.
# - `nums_set`: O(N) space to store the unique elements from `nums`.
# - `missing_elements` list: In the worst-case scenario (e.g., `nums = [1, 100]` and all numbers between 1 and 100 except 1 and 100 are missing), this list could store up to O(R) elements.
# The total space complexity is dominated by the storage needed for the set and the result list.

class Solution:
    def findMissingElements(self, nums: list[int]) -> list[int]:
        # Step 1: Find the smallest and largest integers in the given array.
        # These values define the inclusive boundaries of the expected full range.
        min_val = min(nums)
        max_val = max(nums)

        # Step 2: Convert the input list `nums` into a set for efficient O(1) average time lookups.
        # This allows us to quickly check if a number from the full range is present in `nums`.
        nums_set = set(nums)

        # Step 3: Initialize an empty list to store the missing integers.
        missing_elements = []

        # Step 4: Iterate through every integer from `min_val` to `max_val` (inclusive).
        # This covers the entire expected range of numbers.
        for i in range(min_val, max_val + 1):
            # Step 5: For each number `i` in the range, check if it is present in `nums_set`.
            # If `i` is not in `nums_set`, it means it's a missing element from the original array.
            if i not in nums_set:
                # Step 6: Add the missing element to our `missing_elements` list.
                # Since we iterate through the range in ascending order, the list will automatically be sorted.
                missing_elements.append(i)
        
        # Step 7: Return the list of all found missing elements.
        # If no elements were missing, this list will be empty.
        return missing_elements