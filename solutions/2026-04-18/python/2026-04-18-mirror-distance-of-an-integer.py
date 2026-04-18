```python
# Summary: Calculates the absolute difference between an integer and its reversed counterpart.
# Link: https://leetcode.com/problems/mirror-distance-of-an-integer/
# Approach:
# 1. Convert the integer `n` to a string to easily reverse its digits.
# 2. Reverse the string representation of `n`.
# 3. Convert the reversed string back to an integer. Note that leading zeros will be automatically handled (e.g., "01" becomes 1).
# 4. Calculate the absolute difference between the original integer `n` and the reversed integer.
# Time Complexity: O(log10(n)) - The dominant operations are converting to a string, reversing, and converting back, which are proportional to the number of digits in `n`. The number of digits in `n` is log10(n).
# Space Complexity: O(log10(n)) - Used to store the string representation of `n`.
import math

class Solution:
    def mirrorDistance(self, n: int) -> int:
        # Convert the integer to a string to facilitate digit reversal.
        n_str = str(n)
        
        # Reverse the string representation of the integer.
        # Slicing with [::-1] creates a reversed copy of the string.
        reversed_n_str = n_str[::-1]
        
        # Convert the reversed string back to an integer.
        # int() handles potential leading zeros correctly (e.g., "01" becomes 1).
        reversed_n = int(reversed_n_str)
        
        # Calculate the absolute difference between the original integer and its reversed version.
        # The abs() function ensures we return a non-negative distance.
        mirror_dist = abs(n - reversed_n)
        
        return mirror_dist

```