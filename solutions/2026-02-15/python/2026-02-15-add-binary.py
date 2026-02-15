```python
# Problem: Add Binary
# LeetCode Link: https://leetcode.com/problems/add-binary/
# Summary: Given two binary strings, return their sum as a binary string.
#
# Approach:
# The approach is to simulate the manual binary addition process.
# We iterate from the rightmost digits of both strings simultaneously,
# maintaining a carry. For each position, we sum the corresponding digits
# from 'a' and 'b' (if they exist) and the carry.
# The last digit of the sum (sum % 2) becomes the digit for the result,
# and the carry for the next iteration is (sum // 2).
# We build the result string in reverse and then reverse it at the end.
# If there's a remaining carry after iterating through both strings,
# we append it to the result.
#
# Time Complexity: O(max(n, m)), where n and m are the lengths of strings a and b.
# We iterate through the strings once, from right to left.
#
# Space Complexity: O(max(n, m)) for storing the result string. In the worst case,
# the result can be one digit longer than the longer input string.

class Solution:
    def addBinary(self, a: str, b: str) -> str:
        # Initialize pointers for the end of both strings
        i = len(a) - 1
        j = len(b) - 1
        # Initialize carry to 0
        carry = 0
        # Initialize an empty list to store the result digits (in reverse order)
        result = []

        # Loop while there are still digits to process in either string or there's a carry
        while i >= 0 or j >= 0 or carry:
            # Get the digit from string 'a' at the current position i.
            # If i is out of bounds, consider the digit as 0.
            digit_a = int(a[i]) if i >= 0 else 0
            # Get the digit from string 'b' at the current position j.
            # If j is out of bounds, consider the digit as 0.
            digit_b = int(b[j]) if j >= 0 else 0

            # Calculate the sum of the current digits and the carry
            current_sum = digit_a + digit_b + carry

            # The current digit for the result is the remainder when current_sum is divided by 2
            # (This is the least significant bit of the sum)
            result.append(str(current_sum % 2))
            # The carry for the next iteration is the quotient when current_sum is divided by 2
            # (This represents any overflow to the next higher bit)
            carry = current_sum // 2

            # Move the pointers to the next digits (to the left)
            i -= 1
            j -= 1

        # The result list contains the binary digits in reverse order.
        # Reverse the list and join its elements to form the final binary string.
        return "".join(result[::-1])

```