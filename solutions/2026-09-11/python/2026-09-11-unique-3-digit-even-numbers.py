```python
# This problem asks us to find the number of unique three-digit even numbers that can be formed
# using digits from a given array. Each digit from the array can be used at most as many times
# as it appears in the input array. Leading zeros are not allowed for three-digit numbers.
#
# Link: https://leetcode.com/problems/unique-3-digit-even-numbers/
#
# Approach:
# We can use a brute-force approach by iterating through all possible three-digit even numbers
# and checking if they can be formed using the given digits.
# A three-digit number can be represented as 100*h + 10*t + u, where h is the hundreds digit,
# t is the tens digit, and u is the units digit.
# For a number to be a three-digit even number:
# 1. The hundreds digit (h) cannot be 0.
# 2. The units digit (u) must be an even digit (0, 2, 4, 6, 8).
#
# We can iterate through all possible hundreds digits (1-9), all possible tens digits (0-9),
# and all possible units digits (0, 2, 4, 6, 8). For each combination, we form a number and
# check if the required digits are available in the input `digits` array.
# To efficiently check digit availability, we can use a frequency map (or a Counter) of the
# input digits.
#
# Algorithm:
# 1. Create a frequency map (e.g., a list of size 10) to store the counts of each digit in `digits`.
# 2. Initialize a set `unique_numbers` to store the distinct three-digit even numbers found.
# 3. Iterate through possible hundreds digits `h` from 1 to 9.
# 4. Iterate through possible tens digits `t` from 0 to 9.
# 5. Iterate through possible units digits `u` from the set {0, 2, 4, 6, 8}.
# 6. For each combination (h, t, u):
#    a. Create a temporary frequency map for the current number: `temp_counts = [0] * 10`.
#    b. Increment `temp_counts[h]`, `temp_counts[t]`, and `temp_counts[u]`.
#    c. Check if `temp_counts` is a sub-multiset of the input digits' frequency map.
#       This means for every digit `d` from 0 to 9, `temp_counts[d] <= original_counts[d]`.
#    d. If the digits are available, form the number `num = h * 100 + t * 10 + u` and add it to `unique_numbers`.
# 7. Return the size of the `unique_numbers` set.
#
# Time Complexity:
# The outer loops iterate:
# - Hundreds digit: 9 times (1-9)
# - Tens digit: 10 times (0-9)
# - Units digit: 5 times (0, 2, 4, 6, 8)
# Inside the loops, we create a temporary frequency map (constant time O(1) as it's size 10)
# and compare it with the original frequency map (constant time O(1) as it's size 10).
# Therefore, the total time complexity is O(9 * 10 * 5) which is O(1) with respect to the input
# `digits` length, as the number of possible combinations is fixed. However, if we consider
# the constraints, the `digits.length` can be up to 10, but this approach is independent
# of the length and only depends on the range of digits and the structure of the problem.
# The dominant factor is the number of possible 3-digit numbers, which is constant.
#
# Space Complexity:
# We use a frequency map for the input digits (O(1) because it's fixed size 10).
# We use a set `unique_numbers` to store the results. The maximum number of unique 3-digit
# even numbers is limited. The number of 3-digit numbers is 900. The number of 3-digit
# even numbers is approximately half, around 450. So, the space complexity for the set is O(1)
# as it's bounded by a constant number of possible results.
#
# Alternative (and more efficient) approach using backtracking or permutations:
# We can also think of this as finding permutations of length 3 from the input digits.
# However, we need to ensure uniqueness and the constraints of the problem (leading zero, even number).
# A direct iteration is simpler and efficient enough given the problem constraints.

from collections import Counter

class Solution:
    def countLaps(self, digits: list[int]) -> int:
        """
        Counts the number of distinct three-digit even numbers that can be formed
        using the digits provided in the input array.
        """
        # Create a frequency map of the input digits.
        # This allows us to quickly check if a digit is available and how many times.
        digit_counts = Counter(digits)

        # A set to store the unique three-digit even numbers found.
        # Using a set automatically handles uniqueness.
        unique_numbers = set()

        # Iterate through all possible hundreds digits.
        # A three-digit number cannot start with 0.
        for h in range(1, 10):
            # Check if the hundreds digit is available.
            if digit_counts[h] > 0:
                # Decrement the count of the hundreds digit as it's now used.
                digit_counts[h] -= 1

                # Iterate through all possible tens digits.
                for t in range(0, 10):
                    # Check if the tens digit is available.
                    if digit_counts[t] > 0:
                        # Decrement the count of the tens digit.
                        digit_counts[t] -= 1

                        # Iterate through all possible units digits that make the number even.
                        # The units digit must be one of {0, 2, 4, 6, 8}.
                        for u in [0, 2, 4, 6, 8]:
                            # Check if the units digit is available.
                            if digit_counts[u] > 0:
                                # Form the three-digit number.
                                num = h * 100 + t * 10 + u
                                # Add the number to the set of unique numbers.
                                unique_numbers.add(num)

                        # Backtrack: Increment the count of the tens digit for the next iteration.
                        digit_counts[t] += 1

                # Backtrack: Increment the count of the hundreds digit for the next iteration.
                digit_counts[h] += 1

        # Return the total count of unique three-digit even numbers found.
        return len(unique_numbers)

# Example Usage (for testing purposes, not part of the required output)
# sol = Solution()
# print(sol.countLaps([1, 2, 3, 4]))  # Output: 12
# print(sol.countLaps([0, 2, 2]))    # Output: 2
# print(sol.countLaps([6, 6, 6]))    # Output: 1
# print(sol.countLaps([1, 3, 5]))    # Output: 0
```