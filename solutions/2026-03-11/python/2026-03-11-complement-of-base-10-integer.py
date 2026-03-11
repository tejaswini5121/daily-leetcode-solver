```python
# Given an integer n, return its complement.
# The complement of an integer is the integer you get when you flip all the 0's to 1's and all the 1's to 0's in its binary representation.
# Link: https://leetcode.com/problems/complement-of-base-10-integer/

# Approach:
# 1. Find the binary representation of the input number n.
# 2. Determine the number of bits in the binary representation.
# 3. Create a bitmask of all ones with the same number of bits as n.
#    This can be done by left-shifting 1 by the number of bits and subtracting 1.
#    For example, if n = 5 (binary "101", 3 bits), the mask is (1 << 3) - 1 = 8 - 1 = 7 (binary "111").
# 4. The complement can be found by XORing n with this bitmask.
#    XORing a bit with 1 flips the bit.
#    For example, 5 (binary "101") XOR 7 (binary "111") = 2 (binary "010").
#
# Special Case: If n is 0, its binary representation is "0". The complement should be "1", which is 1.
# The general approach needs adjustment for n=0. If n=0, the number of bits is technically 1,
# mask would be (1<<1)-1 = 1. 0 XOR 1 = 1. So it handles 0 correctly.

# Time Complexity: O(log n)
# The time complexity is dominated by finding the number of bits in n, which is proportional to the number of bits in n, hence O(log n).
# Space Complexity: O(1)
# We are using a constant amount of extra space for variables.

class Solution:
    def bitwiseComplement(self, n: int) -> int:
        # Handle the edge case where n is 0.
        # The binary representation of 0 is "0", its complement is "1", which is 1 in decimal.
        if n == 0:
            return 1

        # Find the number of bits in the binary representation of n.
        # This can be done by repeatedly right-shifting n until it becomes 0,
        # counting the number of shifts.
        num_bits = 0
        temp = n
        while temp > 0:
            temp >>= 1
            num_bits += 1

        # Create a bitmask of all ones with the same number of bits as n.
        # For example, if num_bits is 3, we want a mask of "111" (binary), which is 7.
        # This can be achieved by (1 << num_bits) - 1.
        # (1 << 3) is 8 (binary "1000"). Subtracting 1 gives 7 (binary "111").
        mask = (1 << num_bits) - 1

        # The complement is found by XORing n with the mask.
        # XORing a bit with 1 flips the bit (0 XOR 1 = 1, 1 XOR 1 = 0).
        return n ^ mask

```