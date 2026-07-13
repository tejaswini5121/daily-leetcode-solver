```python
# LeetCode Problem: Sequential Digits
# Link: https://leetcode.com/problems/sequential-digits/
#
# Problem Summary: Find all numbers within a given range [low, high] that have digits increasing sequentially by 1.
#
# Approach:
# The core idea is to generate all possible sequential digit numbers and then filter them based on the given range [low, high].
# Since the maximum value for 'high' is 10^9, the maximum length of a sequential digit number we need to consider is 9 (e.g., 123456789).
# We can pre-generate all possible sequential digit numbers.
#
# There are 9 possible starting digits (1 through 9).
# For each starting digit, we can form sequential numbers of increasing length.
#
# Example:
# Starting with '1':
#   Length 2: 12
#   Length 3: 123
#   ...
#   Length 9: 123456789
#
# Starting with '2':
#   Length 2: 23
#   Length 3: 234
#   ...
#   Length 8: 23456789
#
# And so on, until starting with '9'.
#
# We can iterate through possible lengths (from 2 to 9) and starting digits (from 1 to 9-length+1).
# Alternatively, a simpler way is to iterate through the 10 available digits (0-9) and use them as a string to build sequential numbers.
#
# For example, using the string "123456789":
#   We can take all substrings of length 2 to 9.
#   Substrings of length 2: "12", "23", "34", ..., "89"
#   Substrings of length 3: "123", "234", ..., "789"
#   ...
#   Substrings of length 9: "123456789"
#
# After generating all these numbers, we convert them to integers and filter them to keep only those within the [low, high] range.
# Finally, we sort the resulting list.
#
# Time Complexity:
# The number of sequential digit numbers is relatively small.
# The maximum length of a sequential digit number is 9.
# For a starting digit `d` and length `l`, the last digit is `d + l - 1`. The maximum last digit is 9. So, `d + l - 1 <= 9`.
# The total number of sequential numbers is bounded.
# For length 2: 8 numbers (12, 23, ..., 89)
# For length 3: 7 numbers (123, 234, ..., 789)
# ...
# For length 9: 1 number (123456789)
# The total is 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 = 36.
# Generating these numbers by iterating through substrings of "123456789" takes O(L^2) time, where L is the length of the string (L=9). So, O(9^2) which is constant.
# Filtering and sorting these 36 numbers takes O(N log N) where N is the number of sequential numbers (N=36). This is also constant.
# Therefore, the overall time complexity is O(1) because the number of operations is bounded by a constant, independent of the input range 'low' and 'high' beyond their maximum constraints.
#
# Space Complexity:
# We store the generated sequential digit numbers in a list. The maximum number of such integers is constant (36).
# The output list will also contain at most 36 elements.
# Therefore, the space complexity is O(1).

class Solution:
    def sequentialDigits(self, low: int, high: int) -> list[int]:
        # String containing all digits 0-9 for easy substring generation.
        # We only need '1' through '9' to generate sequential numbers.
        digits = "123456789"
        
        # List to store all valid sequential digit numbers found.
        sequential_numbers = []
        
        # Iterate through all possible lengths of sequential numbers.
        # Minimum length is 2 (e.g., 12), maximum length is 9 (123456789).
        for length in range(2, 10):
            # Iterate through all possible starting positions in the 'digits' string.
            # The starting position 'i' determines the first digit of the sequential number.
            # The last possible starting position for a given length is when the sequential number
            # ends exactly at '9'. For example, if length is 3, the last starting digit can be '7' (789).
            # So, i can go up to len(digits) - length.
            for i in range(len(digits) - length + 1):
                # Extract the substring of the desired length starting from index 'i'.
                # This substring represents a sequential digit number.
                sub = digits[i : i + length]
                
                # Convert the substring to an integer.
                num = int(sub)
                
                # Check if the generated sequential number falls within the given range [low, high].
                if low <= num <= high:
                    # If it's within the range, add it to our list.
                    sequential_numbers.append(num)
                    
        # The problem requires the output list to be sorted.
        # Since we generated numbers in a somewhat ordered fashion (by length and then by start digit),
        # sorting ensures the final output meets the requirement.
        sequential_numbers.sort()
        
        # Return the sorted list of sequential digit numbers within the range.
        return sequential_numbers

```