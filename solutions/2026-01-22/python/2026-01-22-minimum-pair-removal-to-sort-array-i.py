```python
# Summary: Repeatedly merge adjacent pairs with the minimum sum until the array is non-decreasing.
# Link: https://leetcode.com/problems/minimum-pair-removal-to-sort-array-i/
# Approach:
# We can simulate the process. In each step, we need to find the adjacent pair with the minimum sum.
# If there are multiple pairs with the same minimum sum, we choose the leftmost one.
# We then replace this pair with their sum. We repeat this until the array is sorted in non-decreasing order.
#
# To efficiently find the minimum sum pair, we can iterate through the adjacent pairs in each step.
# A `while` loop will continue as long as the array is not sorted.
# Inside the loop, we find the minimum sum and its index.
# Then, we update the array by replacing the pair with their sum.
# The count of operations is incremented in each iteration of the `while` loop.
#
# Time Complexity:
# In the worst case, the array length can be up to 50. Each operation reduces the array length by 1.
# So, there can be at most N-1 operations where N is the initial length of the array.
# In each operation, we iterate through the array to find the minimum sum pair. This takes O(N) time.
# Therefore, the overall time complexity is O(N^2) in the worst case, where N is the initial length of nums.
# Given N <= 50, N^2 is at most 2500, which is acceptable.
#
# Space Complexity:
# We are modifying the input array in-place. We are using a few variables to store the minimum sum, index, etc.
# This uses a constant amount of extra space.
# Therefore, the space complexity is O(1).

class Solution:
    def minOperations(self, nums: list[int]) -> int:
        """
        Calculates the minimum number of operations to make the array non-decreasing
        by repeatedly merging the adjacent pair with the minimum sum.
        """
        operations = 0  # Initialize the count of operations

        # Continue operations until the array is sorted non-decreasingly
        while not self.is_non_decreasing(nums):
            min_sum = float('inf')  # Initialize minimum sum to infinity
            min_idx = -1  # Initialize index of the pair with minimum sum

            # Iterate through adjacent pairs to find the one with the minimum sum
            # We only need to check up to len(nums) - 2 because we are looking at pairs (nums[i], nums[i+1])
            for i in range(len(nums) - 1):
                current_sum = nums[i] + nums[i+1]
                # If the current sum is smaller than the minimum sum found so far,
                # or if the current sum is equal to the minimum sum but it's a
                # leftmost pair (smaller index), update min_sum and min_idx.
                if current_sum < min_sum:
                    min_sum = current_sum
                    min_idx = i

            # If a valid pair was found (i.e., the array was not already sorted and had at least 2 elements)
            if min_idx != -1:
                # Replace the pair (nums[min_idx], nums[min_idx+1]) with their sum
                # The new element will be at index min_idx.
                # We can achieve this by replacing nums[min_idx] with the sum and then removing nums[min_idx+1].
                nums[min_idx] = nums[min_idx] + nums[min_idx+1]
                nums.pop(min_idx + 1)
                operations += 1  # Increment the operation count
            else:
                # This case should ideally not be reached if is_non_decreasing works correctly,
                # but as a safeguard, break if no pair is found (e.g., array of length 1).
                break

        return operations

    def is_non_decreasing(self, arr: list[int]) -> bool:
        """
        Checks if an array is non-decreasing.
        An array is non-decreasing if each element is greater than or equal to its previous element.
        """
        # Iterate from the second element to the end of the array
        for i in range(1, len(arr)):
            # If any element is smaller than its previous element, the array is not non-decreasing
            if arr[i] < arr[i-1]:
                return False
        # If the loop completes without finding any violation, the array is non-decreasing
        return True

```