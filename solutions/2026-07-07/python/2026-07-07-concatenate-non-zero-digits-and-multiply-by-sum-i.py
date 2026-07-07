# Problem Summary:
# This problem requires forming a new integer 'x' by concatenating all non-zero digits of a given integer 'n' in their original order. If no non-zero digits are found, 'x' is 0. Then, calculate the sum of digits of 'x'. Finally, return the product of 'x' and its sum of digits.

# Link to the problem:
# https://leetcode.com/problems/concatenate-non-zero-digits-and-multiply-by-sum-i/

# Approach Explanation:
# 1. Convert the input integer 'n' to its string representation to easily iterate through its digits.
# 2. Iterate through the characters of the string. Collect all characters that are not '0' into a list.
# 3. Join these non-zero digit characters to form a new string, let's call it `x_str`.
# 4. If `x_str` is empty (meaning 'n' had no non-zero digits, e.g., n=0), then 'x' is 0. Otherwise, convert `x_str` to an integer to get `x_val`.
# 5. Calculate the sum of digits of `x_val`. This can be done by repeatedly taking `x_val % 10` to get the last digit and `x_val //= 10` to remove it, until `x_val` becomes 0.
# 6. Finally, return the product of `x_val` and the calculated sum of its digits.

# Time Complexity Analysis:
# The conversion of 'n' to a string takes O(log10(n)) time, as the number of digits is proportional to log10(n).
# Iterating through the string and filtering non-zero digits takes O(log10(n)) time.
# Joining the characters and converting `x_str` to an integer `x_val` takes O(log10(x)) time, which is at most O(log10(n)).
# Calculating the sum of digits of `x_val` also takes O(log10(x)) time, which is at most O(log10(n)).
# Therefore, the dominant operation is proportional to the number of digits in 'n'.
# Overall Time Complexity: O(log10(n)).

# Space Complexity Analysis:
# Storing the string representation of 'n' takes O(log10(n)) space.
# Storing the list of non-zero digits and the string `x_str` also takes O(log10(n)) space in the worst case (e.g., n=123456789).
# Other variables like `x_val`, `digit_sum`, `current_x` use O(1) space.
# Overall Space Complexity: O(log10(n)).
# Given n <= 10^9, log10(n) is at most 10, so this is very efficient in practice.

class Solution:
    def concatenateNonZeroDigits(self, n: int) -> int:
        # Convert the integer n to a string to easily process its digits.
        n_str = str(n)
        
        # Initialize a list to store non-zero digits as strings.
        non_zero_digits_list = []
        
        # Iterate through each character (digit) in the string representation of n.
        for digit_char in n_str:
            # If the digit is not '0', add it to our list.
            if digit_char != '0':
                non_zero_digits_list.append(digit_char)
        
        # Join the collected non-zero digits to form the string representation of x.
        x_str = "".join(non_zero_digits_list)
        
        # Convert x_str to an integer x_val.
        # If x_str is empty (meaning n had no non-zero digits, e.g., n=0), x_val should be 0.
        x_val = int(x_str) if x_str else 0
        
        # Calculate the sum of digits of x_val.
        current_x = x_val
        sum_of_digits_x = 0
        
        # Loop until current_x becomes 0.
        # If x_val is 0, the loop will not execute, and sum_of_digits_x will remain 0, which is correct.
        while current_x > 0:
            # Add the last digit of current_x to sum_of_digits_x.
            sum_of_digits_x += current_x % 10
            # Remove the last digit from current_x by integer division.
            current_x //= 10
            
        # Return the product of x_val and its sum of digits.
        return x_val * sum_of_digits_x