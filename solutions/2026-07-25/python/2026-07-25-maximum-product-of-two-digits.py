```python
# Given a positive integer n, find the maximum product of any two digits in n.
#
# Link: https://leetcode.com/problems/maximum-product-of-two-digits/
#
# Approach:
# To find the maximum product of two digits, we need to identify the two largest digits
# present in the number. The strategy is to extract all digits from the number,
# sort them in descending order, and then multiply the first two largest digits.
# If the number has only one digit (which is not possible given the constraints but
# good to consider generally), or if we are allowed to pick the same digit twice
# (as stated in the problem if it appears more than once), picking the largest
# digit and multiplying it by itself would also be an option if it's the only digit.
# However, given n >= 10, n will always have at least two digits.
#
# Steps:
# 1. Convert the integer `n` into a string to easily iterate through its digits.
# 2. Extract each character from the string, convert it back to an integer, and store
#    these digits in a list.
# 3. Sort the list of digits in descending order.
# 4. The maximum product will be the product of the first two elements in the sorted list
#    (which are the two largest digits).
#
# Time Complexity:
# O(log10(n) * log(log10(n))) - Converting the number to a string takes O(log10(n)) time.
# Extracting digits also takes O(log10(n)) time. Sorting the digits takes
# O(D log D) where D is the number of digits. Since D = log10(n), the sorting
# dominates, resulting in O(log10(n) * log(log10(n))). The number of digits is
# relatively small even for large n (e.g., 10^9 has 10 digits).
#
# Space Complexity:
# O(log10(n)) - To store the digits of the number in a list.

def maxProduct(n: int) -> int:
    """
    Calculates the maximum product of any two digits in a given positive integer n.
    """
    # Convert the integer to a string to access its digits easily.
    s_n = str(n)

    # Create a list to store the integer digits.
    digits = []

    # Iterate through each character in the string representation of n.
    for char_digit in s_n:
        # Convert the character digit to an integer and append it to the list.
        digits.append(int(char_digit))

    # Sort the list of digits in descending order.
    # This places the largest digits at the beginning of the list.
    digits.sort(reverse=True)

    # The maximum product is obtained by multiplying the two largest digits.
    # Since n >= 10, there will always be at least two digits.
    return digits[0] * digits[1]

```