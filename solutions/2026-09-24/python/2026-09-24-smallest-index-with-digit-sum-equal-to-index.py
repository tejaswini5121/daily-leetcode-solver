```python
# Problem: Find the smallest index 'i' where the sum of digits of nums[i] equals 'i'.
# Link: https://leetcode.com/problems/smallest-index-with-digit-sum-equal-to-index/
#
# Approach:
# We need to iterate through the given array 'nums' from left to right (smallest index first).
# For each index 'i', we calculate the sum of digits of the element nums[i].
# If the calculated digit sum is equal to the current index 'i', we have found the smallest such index,
# and we return 'i' immediately.
# If we iterate through the entire array and do not find any such index, we return -1.
#
# To calculate the sum of digits of a number:
# We can use a helper function or do it inline. The process involves repeatedly taking the number modulo 10
# to get the last digit, adding it to a running sum, and then dividing the number by 10 (integer division)
# to remove the last digit, until the number becomes 0.
#
# Time Complexity:
# O(N * log(M)), where N is the length of the array 'nums', and M is the maximum value of an element in 'nums'.
# The outer loop iterates through each element of 'nums' (N times).
# For each element, calculating the sum of digits takes approximately log(M) operations,
# as the number of digits in M is proportional to log10(M).
#
# Space Complexity:
# O(1), as we are only using a few variables to store the index, the current sum of digits, and the number being processed.
# We are not using any extra data structures that grow with the input size.

class Solution:
    def smallestEqual(self, nums: list[int]) -> int:
        # Helper function to calculate the sum of digits of a number
        def sum_digits(n):
            s = 0
            # Continue as long as the number is greater than 0
            while n > 0:
                # Add the last digit to the sum
                s += n % 10
                # Remove the last digit by integer division
                n //= 10
            return s

        # Iterate through the array 'nums' using its indices
        for i in range(len(nums)):
            # Calculate the sum of digits for the current number nums[i]
            digit_sum = sum_digits(nums[i])
            # Check if the sum of digits is equal to the current index 'i'
            if digit_sum == i:
                # If it is, we've found the smallest such index, so return it
                return i

        # If the loop completes without finding any matching index, return -1
        return -1

```