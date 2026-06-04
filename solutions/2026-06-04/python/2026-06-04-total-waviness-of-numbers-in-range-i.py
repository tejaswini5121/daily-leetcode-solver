```python
# Problem Summary:
# Calculates the total waviness of all numbers within a given inclusive range [num1, num2].
# Waviness of a number is the count of its peaks and valleys (digits strictly greater/less than neighbors).
# Link: https://leetcode.com/problems/total-waviness-of-numbers-in-range-i/

# Approach Explanation:
# The problem asks for the sum of waviness for all numbers in the range [num1, num2].
# A straightforward approach is to iterate through each number in the range and calculate its waviness.
# For each number, we convert it to a string to easily access its digits.
# We then iterate through the digits from the second digit to the second-to-last digit (inclusive).
# For each middle digit, we check if it's a peak (strictly greater than both neighbors)
# or a valley (strictly less than both neighbors).
# If it's a peak or a valley, we increment the waviness count for that number.
# Finally, we sum up the waviness of all numbers in the range.

# Time Complexity Analysis:
# Let N be the number of elements in the range (num2 - num1 + 1).
# Let D be the maximum number of digits in the largest number (log10(num2)).
# For each number, we convert it to a string (O(D)) and iterate through its digits (O(D)).
# The total time complexity is approximately O(N * D).
# Given the constraint num2 <= 10^5, D is at most 6. So, it's roughly O(N).

# Space Complexity Analysis:
# Converting a number to a string takes O(D) space.
# We use a few variables for counting, which take O(1) space.
# Thus, the space complexity is O(D), which is effectively O(1) given the constraint on num2.

class Solution:
    def totalWaviness(self, num1: int, num2: int) -> int:
        """
        Calculates the total sum of waviness for all numbers in the inclusive range [num1, num2].
        """
        total_waviness_sum = 0  # Initialize the total sum of waviness for all numbers

        # Iterate through each number in the given range [num1, num2]
        for num in range(num1, num2 + 1):
            # Convert the current number to a string to easily access its digits
            s_num = str(num)
            n_digits = len(s_num)
            current_waviness = 0  # Initialize waviness for the current number

            # Numbers with fewer than 3 digits have a waviness of 0.
            # We only need to check digits from the second to the second-to-last.
            if n_digits >= 3:
                # Iterate through the middle digits (excluding the first and last)
                for i in range(1, n_digits - 1):
                    # Get the current digit and its immediate neighbors
                    prev_digit = int(s_num[i - 1])
                    current_digit = int(s_num[i])
                    next_digit = int(s_num[i + 1])

                    # Check if the current digit is a peak
                    # A digit is a peak if it is strictly greater than both of its immediate neighbors.
                    if current_digit > prev_digit and current_digit > next_digit:
                        current_waviness += 1
                    # Check if the current digit is a valley
                    # A digit is a valley if it is strictly less than both of its immediate neighbors.
                    elif current_digit < prev_digit and current_digit < next_digit:
                        current_waviness += 1

            # Add the waviness of the current number to the total sum
            total_waviness_sum += current_waviness

        # Return the total sum of waviness for all numbers in the range
        return total_waviness_sum

```