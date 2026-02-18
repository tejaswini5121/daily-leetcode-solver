```python
# Problem: Binary Number with Alternating Bits
# Link: https://leetcode.com/problems/binary-number-with-alternating-bits/
# Approach:
# We can iterate through the bits of the number and check if adjacent bits are the same.
# We can get the last bit using the modulo operator (%) and the second-to-last bit
# by right-shifting the number by 1. We continue this process until the number becomes 0.
# An alternative and more efficient approach uses bitwise operations.
# If a number has alternating bits, then when we XOR it with itself right-shifted by one,
# the result should be a number with all bits set to 1.
# For example, if n = 5 (binary 101):
# n >> 1 = 2 (binary 010)
# n ^ (n >> 1) = 101 ^ 010 = 111 (binary 7)
# Now, if we add 1 to this result, we get 1000 (binary 8).
# If we then AND this with the original result (111), we should get 0.
# (111 + 1) & 111 = 1000 & 111 = 000. This confirms alternating bits.
# If n = 7 (binary 111):
# n >> 1 = 3 (binary 011)
# n ^ (n >> 1) = 111 ^ 011 = 100 (binary 4)
# (100 + 1) & 100 = 101 & 100 = 100. This is not 0, so not alternating bits.
# Time Complexity: O(log n) - The number of operations is proportional to the number of bits in n.
# Space Complexity: O(1) - We use a constant amount of extra space.

class Solution:
    def hasAlternatingBits(self, n: int) -> bool:
        # XOR n with n right-shifted by 1.
        # If n has alternating bits, then x will have all bits set to 1.
        # For example, if n = 5 (101), n >> 1 = 2 (010), n ^ (n >> 1) = 7 (111).
        # If n = 6 (110), n >> 1 = 3 (011), n ^ (n >> 1) = 5 (101).
        x = n ^ (n >> 1)

        # Check if x is of the form 2^k - 1 (all bits set to 1).
        # A number that is all ones has the property that (x + 1) & x == 0.
        # For example, if x = 7 (111), x + 1 = 8 (1000). 1000 & 111 = 0.
        # If x = 5 (101), x + 1 = 6 (110). 110 & 101 = 100 (not 0).
        return (x + 1) & x == 0

```