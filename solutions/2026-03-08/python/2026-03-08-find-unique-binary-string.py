```python
# Problem: Find Unique Binary String
# Summary: Given n unique binary strings of length n, find one binary string of length n that is not present.
# Link: https://leetcode.com/problems/find-unique-binary-string/
#
# Approach:
# The problem guarantees that there are n unique binary strings of length n in the input array `nums`.
# There are a total of 2^n possible binary strings of length n.
# Since n is at most 16, 2^n is at most 2^16 = 65536, which is a manageable number.
# We can iterate through all possible binary strings of length n and check if each string exists in `nums`.
# The first string we find that is NOT in `nums` is our answer.
#
# A simpler and more efficient approach leverages Cantor's diagonalization argument, similar to how one might prove that the set of real numbers is uncountable.
# We can construct a unique binary string by taking the i-th character of the i-th string in `nums` and inverting it.
# For example, if nums = ["01", "10"]:
# - For the first string "01", take its 0-th character: '0'. Invert it to '1'.
# - For the second string "10", take its 1-st character: '0'. Invert it to '1'.
# This gives us "11".
# This constructed string is guaranteed to be unique because it differs from every string in `nums` at at least one position (specifically, the position corresponding to the string's index).
#
# Time Complexity:
# O(n^2) - We iterate through `nums` once (n strings). For each string, we access its i-th character. String indexing is O(1). Concatenating characters to form the result string takes O(n). So, constructing the unique string is O(n).
# If we were to use the brute-force approach of checking all 2^n strings, the complexity would be much higher.
#
# Space Complexity:
# O(n) - To store the resulting unique binary string.

class Solution:
    def findDifferentBinaryString(self, nums: list[str]) -> str:
        n = len(nums)
        unique_string = []

        # Iterate through each string in nums by index
        for i in range(n):
            # Take the i-th character of the i-th string
            char_to_invert = nums[i][i]
            
            # Invert the character ('0' becomes '1', '1' becomes '0')
            inverted_char = '1' if char_to_invert == '0' else '0'
            
            # Append the inverted character to our unique string builder
            unique_string.append(inverted_char)
        
        # Join the list of characters into a single string
        return "".join(unique_string)

```