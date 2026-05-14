```python
# Problem: Check if Array is Good
# LeetCode Link: https://leetcode.com/problems/check-if-array-is-good/
#
# Problem Summary:
# Given an integer array `nums`, determine if it's a permutation of a `base[n]` array.
# `base[n]` contains numbers from 1 to n-1 exactly once, and the number n twice.
#
# Approach:
# 1. Find the maximum element in the input array `nums`. Let this be `max_val`.
# 2. If the array is a permutation of `base[n]`, then `n` must be `max_val`.
# 3. The length of `base[n]` is `n + 1`. So, the length of `nums` must be `max_val + 1`.
#    If `len(nums)` is not equal to `max_val + 1`, return `False`.
# 4. We need to check if `nums` contains numbers from 1 to `max_val - 1` exactly once,
#    and the number `max_val` exactly twice.
# 5. We can use a frequency map (dictionary or Counter) to count the occurrences of each number in `nums`.
# 6. Iterate from 1 to `max_val - 1`:
#    - If any number `i` is not present in `nums` or appears more than once, return `False`.
# 7. Check the count of `max_val`:
#    - If `max_val` does not appear exactly twice, return `False`.
# 8. If all checks pass, return `True`.
#
# Time Complexity:
# O(N) where N is the length of the input array `nums`.
# - Finding the maximum element takes O(N).
# - Counting frequencies using a hash map takes O(N).
# - Iterating from 1 to `max_val` (which is at most N-1) takes O(N).
#
# Space Complexity:
# O(N) where N is the length of the input array `nums`.
# - The hash map to store frequencies can store up to N distinct elements in the worst case.

from collections import Counter

class Solution:
    def isGood(self, nums: list[int]) -> bool:
        # Step 1: Find the maximum element in the array.
        if not nums:
            return False # An empty array cannot be good.

        max_val = 0
        for num in nums:
            if num > max_val:
                max_val = num

        # Step 2 & 3: Check if the length of nums is consistent with a potential base[n].
        # If nums is a permutation of base[n], then n must be max_val, and len(nums) must be n + 1.
        if len(nums) != max_val + 1:
            return False

        # Step 4 & 5: Use a frequency map to count occurrences of each number.
        counts = Counter(nums)

        # Step 6: Check numbers from 1 to max_val - 1.
        # They should appear exactly once.
        for i in range(1, max_val):
            # If number i is not in the counts or appears more than once, it's not a good array.
            if counts[i] != 1:
                return False

        # Step 7: Check the count of the maximum value (n).
        # It should appear exactly twice.
        if counts[max_val] != 2:
            return False

        # Step 8: If all checks pass, the array is good.
        return True

```