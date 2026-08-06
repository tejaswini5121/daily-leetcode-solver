```python
# Finds the smallest number >= n whose digit product is divisible by t.
# Link: https://leetcode.com/problems/smallest-divisible-digit-product-i/
#
# Approach:
# We can iterate through numbers starting from n upwards. For each number,
# we calculate the product of its digits. If this product is divisible by t,
# we return the current number as it's the smallest such number encountered.
# The digit product calculation involves converting the number to a string,
# iterating through its characters, converting them back to integers, and
# multiplying them. Special handling for the digit 0 is needed, as any
# product involving 0 will be 0, which is divisible by any non-zero t.
#
# Time complexity: O(N * log10(N)), where N is the smallest number >= n satisfying the condition.
# In the worst case, we might iterate up to a certain point. The log10(N) factor comes
# from calculating the digit product of each number, which takes time proportional
# to the number of digits. Given the constraints on n (<= 100) and t (<= 10),
# the number of iterations and the magnitude of the numbers will be relatively small.
#
# Space complexity: O(log10(N)) due to string conversion for digit extraction.

class Solution:
    def smallestDivisibleDigitProduct(self, n: int, t: int) -> int:
        """
        Finds the smallest number greater than or equal to n such that the
        product of its digits is divisible by t.
        """

        # Iterate through numbers starting from n
        current_num = n
        while True:
            # Calculate the product of digits for the current number
            product = 1
            has_zero = False
            # Convert the number to a string to easily access its digits
            num_str = str(current_num)

            # Iterate through each character (digit) in the string
            for digit_char in num_str:
                digit = int(digit_char)
                # If a digit is 0, the product will be 0.
                # 0 is divisible by any non-zero t.
                if digit == 0:
                    has_zero = True
                    break # No need to multiply further if a zero is encountered
                product *= digit

            # Check if the product of digits is divisible by t
            # If has_zero is True, the product is effectively 0.
            # If t is 0, the problem statement constraints (t >= 1) prevent this.
            if has_zero or product % t == 0:
                return current_num # Found the smallest number satisfying the condition

            # If the condition is not met, increment the number and try again
            current_num += 1

```