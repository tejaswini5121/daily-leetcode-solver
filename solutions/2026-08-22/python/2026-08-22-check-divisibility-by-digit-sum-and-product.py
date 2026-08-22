```python
# Problem: Check Divisibility by Digit Sum and Product
# Link: https://leetcode.com/problems/check-divisibility-by-digit-sum-and-product/
#
# Approach:
# We need to calculate the sum of the digits and the product of the digits of the given
# positive integer 'n'.
# To do this, we can iterate through the digits of 'n'. A common way to extract digits
# is by repeatedly taking the number modulo 10 to get the last digit, and then
# dividing the number by 10 (integer division) to remove the last digit.
# We'll maintain two variables: one for the digit sum and one for the digit product.
# Initialize digit_sum to 0 and digit_product to 1.
# In each iteration:
#   - Get the last digit: digit = n % 10
#   - Add to sum: digit_sum += digit
#   - Multiply to product: digit_product *= digit
#   - Update n: n //= 10
# This process continues until 'n' becomes 0.
# Once we have the digit_sum and digit_product, we calculate their sum: total_divisor = digit_sum + digit_product.
# Finally, we check if the original number 'n' is divisible by total_divisor.
# If total_divisor is 0 (which can happen if n is 0, but the problem constraints say n >= 1, so this is unlikely,
# but it's good practice to consider division by zero), we should handle it. However, for n >= 1,
# the digit sum will be at least 1, and the digit product will be at least 0 (if a 0 digit exists) or 1
# (if no 0 digit exists). Thus, total_divisor will always be >= 1.
# The problem statement implies 'n' is the original input value. So, we should store the original 'n'
# before starting the digit extraction loop.
#
# Time Complexity Analysis:
# The number of digits in 'n' is logarithmic with respect to 'n' (specifically, O(log10(n))).
# For each digit, we perform constant time operations (modulo, division, addition, multiplication).
# Therefore, the time complexity is O(log10(n)). Given the constraint n <= 10^6, this is very efficient.
#
# Space Complexity Analysis:
# We only use a few variables to store the original number, digit sum, digit product, and current digit.
# The space used does not depend on the input size 'n', making the space complexity O(1).

class Solution:
    def checkDivisibility(self, n: int) -> bool:
        # Store the original value of n because we will modify n to extract digits
        original_n = n

        # Initialize variables to store the sum and product of digits
        digit_sum = 0
        digit_product = 1

        # Iterate through the digits of n
        while n > 0:
            # Get the last digit
            digit = n % 10

            # Add the digit to the sum
            digit_sum += digit

            # Multiply the digit to the product
            digit_product *= digit

            # Remove the last digit from n by integer division
            n //= 10

        # Calculate the total divisor by summing the digit sum and digit product
        total_divisor = digit_sum + digit_product

        # Handle the case where total_divisor might be zero to avoid division by zero.
        # For positive integers n, digit_sum is always >= 1.
        # If a 0 digit exists, digit_product becomes 0.
        # If no 0 digit exists, digit_product is >= 1.
        # Therefore, total_divisor will always be >= 1 for n >= 1, so division by zero is not an issue here.
        # The problem constraints state 1 <= n <= 10^6.

        # Check if the original number is divisible by the total_divisor
        if total_divisor == 0: # This condition will not be met for n >= 1
            return False
        else:
            return original_n % total_divisor == 0

```