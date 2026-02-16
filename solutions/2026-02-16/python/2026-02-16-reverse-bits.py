```python
# Reverse bits of a given 32-bit unsigned integer.
# Link: https://leetcode.com/problems/reverse-bits/
#
# Approach:
# We can iterate through each bit of the input integer from the least significant bit (LSB)
# to the most significant bit (MSB). For each bit, we extract it using a bitwise AND operation
# with 1. Then, we shift the result to the left by one position and add this extracted bit to
# the reversed integer. We repeat this process 32 times to cover all 32 bits.
#
# Time Complexity: O(1) - Since the input is always a 32-bit integer, the loop runs a fixed number of times (32).
# Space Complexity: O(1) - We use a constant amount of extra space for variables.
#
# Follow up: If this function is called many times, how would you optimize it?
# Pre-compute a lookup table for reversing bytes or nibbles (4-bit chunks).
# For example, a lookup table for reversing all 256 possible byte values can be created.
# Then, you can reverse a 32-bit integer by reversing its four bytes and then concatenating them in reverse order.
# This would reduce the operation to a few lookups and bit shifts.

class Solution:
    def reverseBits(self, n: int) -> int:
        # Initialize the result to 0. This will store the reversed bits.
        reversed_n = 0
        
        # Iterate 32 times, as we are dealing with a 32-bit integer.
        for i in range(32):
            # Extract the least significant bit (LSB) of n.
            # (n & 1) will be 1 if the LSB of n is 1, and 0 otherwise.
            lsb = n & 1
            
            # Left shift the reversed_n by 1. This makes space for the next bit.
            reversed_n <<= 1
            
            # Add the extracted LSB to the reversed_n.
            # This effectively appends the bit from n to the end of reversed_n.
            reversed_n |= lsb
            
            # Right shift n by 1 to process the next bit in the following iteration.
            n >>= 1
            
        # After 32 iterations, reversed_n will hold the bitwise reversed integer.
        return reversed_n

```