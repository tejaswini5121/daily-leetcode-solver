```python
# Problem: Minimum Element After Replacement With Digit Sum
# Summary: Replace each number in an array with the sum of its digits and find the minimum element.
# Link: https://leetcode.com/problems/minimum-element-after-replacement-with-digit-sum/
#
# Approach:
# 1. Iterate through each number in the input array `nums`.
# 2. For each number, calculate the sum of its digits. This can be done by repeatedly taking the number modulo 10 to get the last digit and adding it to a running sum, then dividing the number by 10 to remove the last digit, until the number becomes 0.
# 3. Store the calculated digit sums in a new list or modify the original list in-place.
# 4. After processing all numbers, find and return the minimum element from the list of digit sums.
#
# Time Complexity: O(N * log10(max(nums))), where N is the length of `nums`. For each of the N numbers, we perform operations proportional to the number of digits, which is logarithmic with base 10. Since the constraints on nums[i] are up to 10^4, log10(10^4) is 4, which is a small constant. Thus, it's effectively O(N).
# Space Complexity: O(1) if we modify the list in-place. If we create a new list to store digit sums, it would be O(N). The provided solution modifies in-place.
#
class Solution:
    def minElementAfterReplacementWithDigitSum(self, nums: list[int]) -> int:
        """
        Replaces each element in nums with the sum of its digits and returns the minimum element.

        Args:
            nums: A list of integers.

        Returns:
            The minimum element in nums after all replacements.
        """

        # Iterate through each number in the input array
        for i in range(len(nums)):
            current_num = nums[i]
            digit_sum = 0

            # Calculate the sum of digits for the current number
            # This loop continues as long as the number is greater than 0
            while current_num > 0:
                # Get the last digit of the number using the modulo operator
                digit = current_num % 10
                # Add the last digit to the digit_sum
                digit_sum += digit
                # Remove the last digit from the number by integer division
                current_num //= 10

            # Replace the original number in the list with its digit sum
            nums[i] = digit_sum

        # After all replacements, find and return the minimum element in the modified list
        return min(nums)

# Example Usage:
# sol = Solution()
# print(sol.minElementAfterReplacementWithDigitSum([10, 12, 13, 14])) # Output: 1
# print(sol.minElementAfterReplacementWithDigitSum([1, 2, 3, 4]))    # Output: 1
# print(sol.minElementAfterReplacementWithDigitSum([999, 19, 199]))  # Output: 10
```