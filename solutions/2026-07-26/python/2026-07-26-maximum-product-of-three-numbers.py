```python
# Problem: Maximum Product of Three Numbers
# Link: https://leetcode.com/problems/maximum-product-of-three-numbers/
#
# Approach:
# The maximum product of three numbers can arise from two scenarios:
# 1. The product of the three largest numbers in the array.
# 2. The product of the two smallest (most negative) numbers and the largest number
#    in the array. This case is important when negative numbers are present, as
#    multiplying two negatives results in a positive.
#
# We can find the three largest and two smallest numbers efficiently.
# One way is to sort the array. After sorting, the three largest numbers will be
# at the end of the array, and the two smallest numbers will be at the beginning.
#
# Alternatively, we can iterate through the array once to find the three largest
# and two smallest numbers without fully sorting. This would have a better time
# complexity if we only need a few extreme values. However, sorting is simpler
# to implement and the constraints on nums.length (up to 10^4) make O(N log N)
# sorting acceptable.
#
# For this solution, we will use sorting for simplicity.
#
# Time Complexity:
# O(N log N) due to sorting the input array, where N is the length of nums.
#
# Space Complexity:
# O(1) if the sorting algorithm used is in-place (like Python's Timsort for lists).
# If a copy is made, it could be O(N). Python's sort is generally considered O(1)
# auxiliary space in practice for lists.

import math

class Solution:
    def maximumProduct(self, nums: list[int]) -> int:
        # Sort the array in ascending order.
        # This makes it easy to identify the smallest and largest elements.
        nums.sort()

        n = len(nums)

        # The maximum product can be either:
        # 1. The product of the three largest numbers: nums[n-1] * nums[n-2] * nums[n-3]
        #    This is the case when all numbers are positive, or when the largest
        #    negatives don't contribute to a larger positive product.
        # 2. The product of the two smallest (most negative) numbers and the largest number:
        #    nums[0] * nums[1] * nums[n-1]
        #    This case is important when there are significant negative numbers,
        #    as the product of two negatives is positive.

        # Calculate the product of the three largest numbers.
        product_of_three_largest = nums[n - 1] * nums[n - 2] * nums[n - 3]

        # Calculate the product of the two smallest numbers and the largest number.
        product_of_two_smallest_and_largest = nums[0] * nums[1] * nums[n - 1]

        # Return the maximum of these two possibilities.
        return max(product_of_three_largest, product_of_two_smallest_and_largest)

```