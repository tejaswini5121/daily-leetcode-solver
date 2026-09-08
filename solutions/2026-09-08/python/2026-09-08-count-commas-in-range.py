```python
# Problem Summary: Count commas in standard number formatting for integers from 1 to n.
# Link: https://leetcode.com/problems/count-commas-in-range/
# Approach:
# We can iterate through each number from 1 to n and check if it requires a comma.
# A number requires a comma if it has 4 or more digits.
# Commas are placed every three digits from the right.
# For a number x, the number of digits is floor(log10(x)) + 1.
# The number of commas in a number x is (number of digits - 1) // 3.
# We sum this count for all numbers from 1 to n.
# Time Complexity: O(n * log10(n)) because for each of the n numbers, we perform a log10 operation
# which is roughly proportional to the number of digits. Since n <= 10^5, log10(n) is small.
# More accurately, the time complexity for checking digits of a number `x` is O(log10(x)).
# So the total complexity is Sum(log10(i)) for i from 1 to n, which is approximately O(n log n).
# Space Complexity: O(1) as we only use a few variables to store counts.

class Solution:
    def countCommas(self, n: int) -> int:
        """
        Counts the total number of commas used when writing all integers from 1 to n.
        """
        total_commas = 0  # Initialize the total count of commas

        # Iterate through each number from 1 up to n (inclusive)
        for i in range(1, n + 1):
            # Convert the number to a string to easily get its length (number of digits)
            s_num = str(i)
            num_digits = len(s_num)

            # A comma is inserted after every three digits from the right.
            # Numbers with fewer than 4 digits contain no commas.
            # If the number has 4 or more digits, we calculate how many commas it will have.
            # For a number with `k` digits, it will have `(k - 1) // 3` commas.
            # Example:
            # 1000 (4 digits): (4 - 1) // 3 = 3 // 3 = 1 comma
            # 10000 (5 digits): (5 - 1) // 3 = 4 // 3 = 1 comma
            # 100000 (6 digits): (6 - 1) // 3 = 5 // 3 = 1 comma
            # 1000000 (7 digits): (7 - 1) // 3 = 6 // 3 = 2 commas
            if num_digits >= 4:
                commas_in_current_num = (num_digits - 1) // 3
                total_commas += commas_in_current_num

        return total_commas

```