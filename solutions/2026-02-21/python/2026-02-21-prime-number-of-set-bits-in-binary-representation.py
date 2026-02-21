```python
# Problem: Count numbers in a range with a prime number of set bits in their binary representation.
# Link: https://leetcode.com/problems/prime-number-of-set-bits-in-binary-representation/
#
# Approach:
# 1. Iterate through each number from `left` to `right` (inclusive).
# 2. For each number, count the number of set bits (1s) in its binary representation.
#    This can be done using Python's built-in `bin()` function and then counting '1's,
#    or by repeatedly checking the last bit and right-shifting.
# 3. Check if the count of set bits is a prime number.
#    Since the maximum value of `right` is 10^6, the maximum number of bits in `right` is
#    approximately `log2(10^6)`, which is around 20. Therefore, the maximum number of
#    set bits will be at most 20. We can pre-compute or hardcode a list of prime numbers
#    up to 20 (or a slightly larger safe bound like 30) for efficient checking.
# 4. If the count of set bits is prime, increment a counter.
# 5. Return the final counter.
#
# For prime checking, we can use a pre-defined set of primes up to the maximum possible
# number of set bits. For a number up to 10^6, the maximum number of bits is around 20.
# So, primes up to 20 are sufficient: 2, 3, 5, 7, 11, 13, 17, 19.
#
# Time Complexity:
# The loop iterates `right - left + 1` times.
# For each number, counting set bits takes `O(log N)` time where N is the number.
# Checking if a number is prime (from a pre-defined set) takes `O(1)` time.
# Therefore, the overall time complexity is `O((right - left) * log(max(right)))`.
# Given the constraints, `right - left <= 10^4` and `max(right) <= 10^6`,
# this is efficient enough.
#
# Space Complexity:
# `O(1)` as we only use a few variables and a small pre-defined set for primes.

class Solution:
    def countPrimeSetBits(self, left: int, right: int) -> int:
        # Pre-compute a set of prime numbers up to a reasonable limit.
        # The maximum number of bits for 10^6 is around 20.
        # So, primes up to 20 are: 2, 3, 5, 7, 11, 13, 17, 19.
        # We can include a few more just to be safe if the constraint was slightly higher.
        primes = {2, 3, 5, 7, 11, 13, 17, 19}

        count = 0  # Initialize the counter for numbers with prime set bits

        # Iterate through each number in the inclusive range [left, right]
        for num in range(left, right + 1):
            # Count the number of set bits (1s) in the binary representation of 'num'
            set_bits_count = 0
            temp_num = num
            while temp_num > 0:
                # Check the last bit: if it's 1, increment the count
                if temp_num & 1:
                    set_bits_count += 1
                # Right shift the number by 1 to check the next bit
                temp_num >>= 1

            # Alternatively, using Python's built-in functions:
            # set_bits_count = bin(num).count('1')

            # Check if the counted number of set bits is present in our set of primes
            if set_bits_count in primes:
                count += 1  # If it's prime, increment the overall count

        return count  # Return the total count of numbers with prime set bits

```