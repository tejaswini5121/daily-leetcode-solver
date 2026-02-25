```python
# Problem: Sort Integers by The Number of 1 Bits
# Link: https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits/
# Approach:
# We need to sort the array based on two criteria:
# 1. The number of set bits (1s) in the binary representation of the integer (ascending).
# 2. If two integers have the same number of set bits, sort them by their numerical value (ascending).
# Python's built-in sorted() function can accept a custom 'key' function.
# The key function will return a tuple for each element. Python sorts tuples lexicographically.
# So, for each number `x`, we will return a tuple `(count_set_bits(x), x)`.
# This ensures that numbers with fewer set bits come first. If set bit counts are equal,
# the numbers themselves will be compared, achieving the secondary sorting requirement.
#
# To count set bits efficiently, we can use the bin(x).count('1') method or bit manipulation.
# For simplicity and readability, bin(x).count('1') is chosen here.
#
# Time Complexity:
# The `sorted()` function in Python uses Timsort, which has an average and worst-case time
# complexity of O(N log N), where N is the number of elements in the array.
# The `key` function (counting set bits) takes O(log M) time for each number, where M is the
# maximum value of an element in the array (due to `bin()` conversion). Since M <= 10^4,
# log M is a small constant.
# Therefore, the overall time complexity is dominated by the sorting, making it O(N log N).
#
# Space Complexity:
# The `sorted()` function in Python creates a new sorted list, which takes O(N) space.
# The `key` function uses a small constant amount of extra space for each element.
# Therefore, the overall space complexity is O(N).

class Solution:
    def sortByBits(self, arr: list[int]) -> list[int]:
        # Define a helper function to count the number of set bits (1s) in a binary representation
        def count_set_bits(n):
            # Convert the integer to its binary string representation (e.g., 5 -> "0b101")
            # Then count the occurrences of '1' in this string.
            return bin(n).count('1')

        # Use Python's built-in sorted() function with a custom key.
        # The key function returns a tuple for each element:
        # The first element of the tuple is the count of set bits.
        # The second element of the tuple is the number itself.
        # Python sorts tuples lexicographically:
        # It first compares the first elements of the tuples. If they are equal,
        # it compares the second elements, and so on.
        # This achieves the desired sorting:
        # 1. Ascending order of set bit count.
        # 2. Ascending order of the number itself if set bit counts are the same.
        sorted_arr = sorted(arr, key=lambda x: (count_set_bits(x), x))

        return sorted_arr

# Example Usage:
# sol = Solution()
# arr1 = [0,1,2,3,4,5,6,7,8]
# print(f"Input: {arr1}, Output: {sol.sortByBits(arr1)}") # Expected: [0,1,2,4,8,3,5,6,7]
#
# arr2 = [1024,512,256,128,64,32,16,8,4,2,1]
# print(f"Input: {arr2}, Output: {sol.sortByBits(arr2)}") # Expected: [1,2,4,8,16,32,64,128,256,512,1024]
```