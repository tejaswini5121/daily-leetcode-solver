```python
# Problem: Maximum Product of Two Elements in an Array
# Link: https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/
#
# Approach:
# The goal is to maximize the product (nums[i]-1) * (nums[j]-1).
# To maximize this product, we need to find the two largest numbers in the array.
# Subtracting 1 from each of these largest numbers and then multiplying them will yield the maximum possible product.
#
# We can achieve this by:
# 1. Sorting the array in descending order. The two largest numbers will then be at the beginning of the sorted array (indices 0 and 1).
# 2. Alternatively, we can iterate through the array and keep track of the two largest numbers encountered so far. This avoids a full sort.
#
# For simplicity and given the constraints (nums.length <= 500), sorting is an efficient and straightforward approach.
#
# Time Complexity:
# O(N log N) due to sorting the array, where N is the number of elements in nums.
# If we use the linear scan approach to find the two largest elements, the time complexity would be O(N).
#
# Space Complexity:
# O(1) if sorting is done in-place, or O(N) if sorting requires auxiliary space (depending on the sorting algorithm implementation). Python's Timsort typically uses O(N) auxiliary space in the worst case.
# The linear scan approach would have O(1) space complexity.

class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        """
        Calculates the maximum product of two elements minus one.

        Args:
            nums: A list of integers.

        Returns:
            The maximum value of (nums[i]-1)*(nums[j]-1) for distinct i and j.
        """

        # Sort the array in descending order.
        # This places the two largest elements at the beginning of the array.
        nums.sort(reverse=True)

        # The two largest elements are now nums[0] and nums[1].
        # Calculate the product according to the problem statement.
        # (nums[i]-1) * (nums[j]-1)
        return (nums[0] - 1) * (nums[1] - 1)

# Example Usage:
# sol = Solution()
# print(sol.maxProduct([3,4,5,2])) # Output: 12
# print(sol.maxProduct([1,5,4,5])) # Output: 16
# print(sol.maxProduct([3,7]))     # Output: 12
```