```python
# Problem Summary: Find the largest number with 'num' digits that sums to 'sum', maximizing the sum of squares of its digits.
# Link: https://leetcode.com/problems/maximize-sum-of-squares-of-digits/
# Approach:
# The problem asks for the largest "good" integer that maximizes the sum of squares of its digits.
# A "good" integer has 'num' digits and its digits sum to 'sum'.
# To maximize the sum of squares of digits for a fixed sum, we want to have as many large digits as possible,
# and then distribute the remaining sum as evenly as possible among the digits.
# Specifically, to maximize the score (sum of squares), we should try to put the largest possible digits
# in the most significant positions (leftmost).
# This is a greedy approach.
#
# First, check for invalid cases:
# 1. If sum is 0 and num is greater than 1, it's impossible to form a positive integer with 0 sum of digits and more than one digit (leading zeros are not allowed for positive integers, and the smallest possible sum for num > 1 is 1).
# 2. If sum is greater than num * 9, it's impossible to achieve the sum with 'num' digits, as the maximum possible sum for 'num' digits is num * 9 (all 9s).
#
# If the conditions are valid, we construct the number greedily from left to right (most significant digit to least significant digit).
# For each digit position:
#   - We try to place the largest possible digit (from 9 down to 0).
#   - The digit we place must satisfy two conditions:
#     a. The remaining sum (sum - current_digit) must be achievable by the remaining number of digits (num - 1). The minimum sum for the remaining digits is 0 (if they are all 0s), and the maximum is (num - 1) * 9.
#     b. If we place the current digit, the remaining sum must be non-negative.
#   - The first valid digit we find (starting from 9 downwards) is the one we pick for the current position.
#   - We append this digit to our result string, decrease 'num' by 1, and update 'sum' by subtracting the chosen digit.
#
# If at any point we cannot find a valid digit for a position (e.g., sum becomes negative or remaining sum is impossible), it means no such number exists, and we should return an empty string. However, our initial checks should prevent this if a valid number is possible.
#
# Edge case: If sum is 0 and num is 1, the only number is "0". However, the problem states "positive integers". If num=1 and sum=0, and we are forced to return a string, it means no positive integer exists. The constraints state 1 <= num, 1 <= sum. So sum can be 0 only if num=1 and sum=0 is allowed, which is not the case.
# If num = 1, sum = 0, technically impossible as input constraints are 1 <= sum.
# If num = 1, sum = 1, result is "1".
# If num = 1, sum = 9, result is "9".
# If num = 1, sum = 10, impossible, return "".
#
# The initial checks handle the impossibility cases cleanly.
#
# Time Complexity: O(num). We iterate through 'num' positions, and for each position, we iterate from 9 down to 0, which is a constant factor (10). So, it's effectively O(num).
# Space Complexity: O(num) to store the resulting string.

class Solution:
    def maximizeSumOfSquaresOfDigits(self, num: int, sum: int) -> str:
        # Initial checks for impossible cases

        # If sum is 0 and we need more than one digit, it's impossible
        # for a positive integer (smallest sum for num > 1 is 1 if one digit is 1 and others 0).
        # Constraints state sum >= 1, so this specific check might not be hit if sum=0.
        # However, if num=1 and sum=0 were allowed, the result would be "0", but it needs to be a positive integer.
        # Given constraints 1 <= sum, sum will never be 0.
        # So, sum=0 is only relevant if num=1 and sum=0, which is ruled out by constraints.

        # Maximum possible sum for 'num' digits is when all digits are 9.
        if sum > num * 9:
            return ""

        # If num is 1 and sum is greater than 9, it's impossible.
        if num == 1 and sum > 9:
            return ""

        # We need to construct the largest number, so we build it from left to right (most significant digit first).
        result = []
        # Iterate while we still need to place digits
        while num > 0:
            # For the current position, try placing the largest possible digit from 9 down to 0.
            for digit in range(9, -1, -1):
                # Check if placing 'digit' is valid.
                # 1. The remaining sum must be non-negative.
                # 2. The remaining sum must be achievable by the remaining 'num - 1' digits.
                #    The minimum sum for 'num - 1' digits is 0.
                #    The maximum sum for 'num - 1' digits is (num - 1) * 9.
                if sum - digit >= 0 and sum - digit <= (num - 1) * 9:
                    # This 'digit' is the largest possible valid digit for the current position.
                    result.append(str(digit))
                    # Update the remaining sum and the number of digits left to place.
                    sum -= digit
                    num -= 1
                    # Break the inner loop to move to the next digit position.
                    break
            # If the inner loop completes without finding a digit, it implies an issue,
            # though our initial checks should prevent this if a solution exists.
            # This can happen if sum becomes negative or impossible to achieve with remaining digits.
            # The condition `sum - digit <= (num - 1) * 9` combined with `sum - digit >= 0`
            # ensures that if a solution is possible, we will find a digit.
            # If sum becomes 0 and num is still > 0, the loop will continue, and it will correctly
            # fill the remaining digits with 0s. E.g., num=3, sum=3. First digit is 3, sum=0, num=2.
            # Then remaining digits are 0, 0. Result "300".
            # Example: num=2, sum=3.
            # Pos 1: try 9..0.
            # digit = 3: sum-3=0. num-1=1. 0 <= 0 <= 1*9. Valid. Pick 3. result=['3'], sum=0, num=1.
            # Pos 2: try 9..0.
            # digit = 0: sum-0=0. num-1=0. 0 <= 0 <= 0*9. Valid. Pick 0. result=['3','0'], sum=0, num=0.
            # loop ends. Return "30".

            # Example: num=2, sum=17.
            # Pos 1: try 9..0.
            # digit = 9: sum-9=8. num-1=1. 8 >= 0. 8 <= 1*9. Valid. Pick 9. result=['9'], sum=8, num=1.
            # Pos 2: try 9..0.
            # digit = 8: sum-8=0. num-1=0. 0 >= 0. 0 <= 0*9. Valid. Pick 8. result=['9','8'], sum=0, num=0.
            # loop ends. Return "98".

            # Example: num=1, sum=10.
            # Initial check: sum > num * 9 (10 > 1*9). Returns "". Correct.

        # After filling all 'num' digits, if sum is still not 0, it means we couldn't achieve the target sum.
        # This should ideally be caught by the initial checks or the greedy logic.
        # If sum is exactly 0 and num is 0, we have successfully constructed the number.
        if sum == 0 and num == 0:
            return "".join(result)
        else:
            # This path should ideally not be reached if the initial checks are sufficient
            # and the greedy logic is sound. It indicates an error or an edge case missed.
            # However, if for some reason sum is not 0 at the end, it means no valid number was formed.
            return ""

```