```python
# Problem Summary: Calculate the GCD of the sum of the first n positive odd numbers and the sum of the first n positive even numbers.
# Link: https://leetcode.com/problems/gcd-of-odd-and-even-sums/
# Approach:
# The sum of the first n positive odd numbers is n^2. This can be derived from the arithmetic series formula or by observation:
# 1 = 1^2
# 1 + 3 = 4 = 2^2
# 1 + 3 + 5 = 9 = 3^2
# 1 + 3 + 5 + 7 = 16 = 4^2
# So, sumOdd = n * n.

# The sum of the first n positive even numbers is n * (n + 1). This can be derived from the arithmetic series formula or by factoring out 2:
# 2 + 4 + 6 + ... + 2n = 2 * (1 + 2 + 3 + ... + n)
# The sum of the first n positive integers is n * (n + 1) / 2.
# So, sumEven = 2 * (n * (n + 1) / 2) = n * (n + 1).

# Once we have sumOdd and sumEven, we need to compute their GCD. Python's `math` module provides a `gcd` function.
# We can directly compute GCD(n*n, n*(n+1)).
# Using the property GCD(a*c, b*c) = c * GCD(a, b), we can simplify this to n * GCD(n, n+1).
# Since n and n+1 are consecutive integers, their GCD is always 1.
# Therefore, GCD(n*n, n*(n+1)) = n * 1 = n.
# So, the GCD of the sum of the first n odd numbers and the sum of the first n even numbers is simply n.

# Time Complexity: O(1) - The calculations and GCD computation are constant time operations.
# Space Complexity: O(1) - We only use a few variables to store intermediate results, which takes constant space.

import math

class Solution:
    def gcdOfOddAndEvenSums(self, n: int) -> int:
        # Calculate the sum of the first n positive odd numbers.
        # Formula: sum of first n odd numbers = n^2
        sumOdd = n * n

        # Calculate the sum of the first n positive even numbers.
        # Formula: sum of first n even numbers = n * (n + 1)
        sumEven = n * (n + 1)

        # Compute the GCD of sumOdd and sumEven.
        # Using the property GCD(a*c, b*c) = c * GCD(a, b)
        # GCD(n*n, n*(n+1)) = n * GCD(n, n+1)
        # Since n and n+1 are consecutive, GCD(n, n+1) = 1.
        # Therefore, the result is n * 1 = n.
        # We can directly return n, or use the math.gcd function for clarity/verification.
        return math.gcd(sumOdd, sumEven)

# Example usage (for testing purposes, not part of the final LeetCode submission format)
# if __name__ == "__main__":
#     sol = Solution()
#     n1 = 4
#     print(f"Input: n = {n1}")
#     print(f"Output: {sol.gcdOfOddAndEvenSums(n1)}") # Expected: 4

#     n2 = 5
#     print(f"Input: n = {n2}")
#     print(f"Output: {sol.gcdOfOddAndEvenSums(n2)}") # Expected: 5

#     n3 = 1
#     print(f"Input: n = {n3}")
#     print(f"Output: {sol.gcdOfOddAndEvenSums(n3)}") # Expected: 1

#     n4 = 10
#     print(f"Input: n = {n4}")
#     print(f"Output: {sol.gcdOfOddAndEvenSums(n4)}") # Expected: 10
```