```python
# Problem Summary:
# Count numbers from 1 to n that are "good" after rotating their digits 180 degrees.
# A good number, when rotated, results in a valid number different from the original.
# Valid rotations: 0->0, 1->1, 8->8, 2->5, 5->2, 6->9, 9->6. Invalid rotations: 3, 4, 7.
# Link: https://leetcode.com/problems/rotated-digits/
#
# Approach:
# We can iterate through each number from 1 to n. For each number, we check if it's a "good" number.
# A number is good if:
# 1. All its digits can be rotated into a valid digit (i.e., no 3, 4, or 7).
# 2. After rotating all valid digits, the resulting number is strictly greater than the original number.
#
# To implement this, we can create a mapping for rotated digits.
# We can convert the number to a string to easily access and rotate each digit.
# For each digit in the number:
#   - If it's 0, 1, or 8, it remains the same after rotation.
#   - If it's 2, it becomes 5.
#   - If it's 5, it becomes 2.
#   - If it's 6, it becomes 9.
#   - If it's 9, it becomes 6.
#   - If it's 3, 4, or 7, the number is invalid and cannot be rotated into a valid digit.
#
# We can maintain two boolean flags: `has_transforming_digit` and `has_invalid_digit`.
# Iterate through the digits of the number (as a string):
#   - If a digit is 3, 4, or 7, set `has_invalid_digit` to True and break.
#   - If a digit is 2, 5, 6, or 9, set `has_transforming_digit` to True.
#
# After checking all digits:
#   - If `has_invalid_digit` is True, the number is not good.
#   - If `has_transforming_digit` is False, the number doesn't change after rotation (e.g., 1, 8, 10, 11, 18), so it's not good.
#   - Otherwise, if `has_invalid_digit` is False and `has_transforming_digit` is True, the number is good.
#
# Time Complexity:
# O(N * log10(N)), where N is the input integer n.
# For each number from 1 to n, we iterate through its digits. The number of digits in a number x is approximately log10(x).
#
# Space Complexity:
# O(log10(N)) for storing the string representation of the number.
# This is essentially constant space relative to N for typical integer sizes.
class Solution:
    def rotatedDigits(self, n: int) -> int:
        # Mapping for rotated digits. 'X' indicates an invalid rotation.
        # The index of the list corresponds to the digit (0-9).
        # For example, mapping[2] = 5 means 2 rotates to 5.
        mapping = [0, 1, 5, 'X', 'X', 2, 9, 'X', 8, 6]

        count = 0
        for i in range(1, n + 1):
            num_str = str(i)
            rotated_num_str = ""
            is_valid = True
            has_transforming_digit = False # True if at least one digit rotates to a different digit

            for digit in num_str:
                rotated_digit = mapping[int(digit)]

                if rotated_digit == 'X':
                    # This digit cannot be rotated to a valid digit.
                    is_valid = False
                    break
                
                rotated_num_str += str(rotated_digit)
                
                # Check if the digit itself transforms into a different digit after rotation
                if int(digit) != rotated_digit:
                    has_transforming_digit = True

            # A number is "good" if it's valid after rotation AND it's different from the original number.
            # The condition `is_valid` checks if all digits can be rotated.
            # The condition `has_transforming_digit` checks if at least one digit actually changed its value after rotation.
            # If both are true, the rotated number will be different from the original and valid.
            if is_valid and has_transforming_digit:
                count += 1
        
        return count

```