```python
# Problem: Concatenation of Consecutive Binary Numbers
# Problem Summary: Concatenate binary representations of numbers from 1 to n and return the decimal value modulo 10^9 + 7.
# Link: https://leetcode.com/problems/concatenation-of-consecutive-binary-numbers/
#
# Approach:
# We can simulate the concatenation process. We maintain a running `result` which stores the decimal value of the concatenated binary string so far.
# For each number `i` from 1 to `n`, we need to determine how many bits its binary representation has.
# If `i` is a power of 2 (e.g., 1, 2, 4, 8), its binary representation has one more bit than the previous number's binary representation.
# We can check if `i` is a power of 2 by using the property `(i & (i - 1)) == 0`.
#
# Let `bits` be the number of bits in the binary representation of the current number `i`.
# When we process `i`, we essentially shift the current `result` to the left by `bits` positions (equivalent to multiplying by 2^bits) and then add `i`.
# So, the update rule becomes: `result = (result << bits) + i`.
# Since the result can be very large, we apply the modulo operation `10^9 + 7` at each step to prevent overflow.
#
# We can determine the number of bits for `i` efficiently. For example, if `i` is 3 (binary "11"), it has 2 bits. If `i` is 4 (binary "100"), it has 3 bits.
# Notice that the number of bits increases only when `i` becomes a power of 2.
# We can keep track of `bits` and increment it whenever `i` is a power of 2. A simpler way to find the number of bits for `i` is `i.bit_length()`.
#
# However, a more efficient way to determine `bits` for `i` is to observe that `bits` increases by 1 every time `i` crosses a power of 2.
# For example:
# i=1: "1" (1 bit)
# i=2: "10" (2 bits)
# i=3: "1011" (2 bits for 3)
# i=4: "1011100" (3 bits)
#
# Let's refine the `bits` calculation. We can maintain the `bits` count. When `i` becomes a power of 2 (e.g., 2, 4, 8), we increment `bits`.
# A number `i` is a power of 2 if `i` is `1 << k` for some integer `k`.
# Alternatively, we can use `i.bit_length()` directly for each `i`. This is cleaner.
#
# Let `MOD = 10**9 + 7`.
# Initialize `result = 0`.
# For `i` from 1 to `n`:
#   `num_bits = i.bit_length()`  # Get the number of bits for i
#   `result = (result << num_bits) % MOD`  # Shift the current result left by num_bits
#   `result = (result + i) % MOD`         # Add the current number i
# Return `result`.
#
# Time Complexity: O(n * log n) where log n is the average bit length of numbers up to n.
# Actually, `i.bit_length()` is O(log i). So the total time complexity is the sum of `log i` for i from 1 to n, which is roughly O(n log n).
# A tighter analysis might consider that `bit_length()` is proportional to the number of bits. The total number of bits concatenated is `sum(bit_length(i) for i in 1..n)`.
# The number of bits for `i` is approximately `log2(i)`. The sum `sum(log2(i))` from 1 to n is approximately `n log2(n)`.
# However, if we look at how `bit_length()` increases: it stays constant for ranges of numbers.
# For numbers from 1 to 1: 1 bit.
# For numbers from 2 to 3: 2 bits.
# For numbers from 4 to 7: 3 bits.
# For numbers from 2^k to 2^(k+1)-1: k+1 bits.
# The number of elements in each range is roughly `2^k`.
# The total number of operations is proportional to the total number of bits, which is approximately `n * log2(n)`.
#
# More precisely, if `L` is the number of bits for `n` (i.e., `n.bit_length()`), then the sum of bits is:
# `sum(k * 2^(k-1) for k=1 to L-1) + L * (n - 2^(L-1) + 1)`
# This sum is dominated by the last term, which is `L * n`. So, the time complexity is O(n * log n).
#
# Space Complexity: O(1) as we only use a few variables to store the result and loop counter.

class Solution:
    def concatenatedBinary(self, n: int) -> int:
        # Define the modulo constant
        MOD = 10**9 + 7

        # Initialize the decimal result to 0
        result = 0

        # Iterate through numbers from 1 to n
        for i in range(1, n + 1):
            # Determine the number of bits in the binary representation of i.
            # For example, 1 is "1" (1 bit), 2 is "10" (2 bits), 3 is "11" (2 bits), 4 is "100" (3 bits).
            num_bits = i.bit_length()

            # Shift the current result to the left by `num_bits` positions.
            # This is equivalent to multiplying by 2^num_bits.
            # We apply modulo at each step to prevent integer overflow.
            result = (result << num_bits) % MOD

            # Add the current number `i` to the shifted result.
            # Again, apply modulo to keep the result within bounds.
            result = (result + i) % MOD

        # Return the final concatenated binary value as a decimal, modulo 10^9 + 7
        return result

```