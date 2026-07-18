```python
# Problem: Find Greatest Common Divisor of Array
# LeetCode Link: https://leetcode.com/problems/find-greatest-common-divisor-of-array/
#
# Problem Summary:
# Find the greatest common divisor (GCD) of the smallest and largest elements in an integer array.
#
# Approach:
# 1. Find the minimum and maximum values in the input array `nums`.
# 2. Implement a GCD function (Euclidean algorithm is efficient).
# 3. Calculate and return the GCD of the minimum and maximum values found.
#
# Time Complexity:
# O(log(min(a, b))), where a is the minimum and b is the maximum element. This is due to the Euclidean algorithm for GCD.
# Finding min/max takes O(N) where N is the length of the array.
# Therefore, the overall time complexity is dominated by O(N).
#
# Space Complexity:
# O(1) - We only use a few variables to store min, max, and intermediate GCD calculations.

import math

class Solution:
    def findGCD(self, nums: list[int]) -> int:
        """
        Calculates the greatest common divisor of the smallest and largest numbers in an array.
        """

        # 1. Find the minimum and maximum values in the array.
        min_num = min(nums)
        max_num = max(nums)

        # 2. Implement a GCD function using math.gcd (built-in and efficient).
        # Alternatively, a custom Euclidean algorithm could be implemented:
        # def gcd(a, b):
        #     while b:
        #         a, b = b, a % b
        #     return a
        #
        # gcd_val = gcd(min_num, max_num)

        # 3. Calculate and return the GCD of the minimum and maximum values.
        gcd_val = math.gcd(min_num, max_num)

        return gcd_val

# Example Usage (for testing locally):
# sol = Solution()
# print(sol.findGCD([2, 5, 6, 9, 10]))  # Output: 2
# print(sol.findGCD([7, 5, 6, 8, 3]))  # Output: 1
# print(sol.findGCD([3, 3]))          # Output: 3
```