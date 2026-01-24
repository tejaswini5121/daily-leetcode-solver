```python
# Problem: Minimize Maximum Pair Sum in Array
# Link: https://leetcode.com/problems/minimize-maximum-pair-sum-in-array/
#
# Approach:
# To minimize the maximum pair sum, we should try to pair the smallest element
# with the largest element, the second smallest with the second largest, and so on.
# This greedy approach ensures that the sums of the pairs are as balanced as possible,
# thus reducing the overall maximum pair sum.
#
# 1. Sort the input array `nums` in ascending order.
# 2. Initialize two pointers, `left` at the beginning of the array (index 0)
#    and `right` at the end of the array (index n-1).
# 3. Initialize a variable `max_pair_sum` to 0 to store the maximum pair sum found so far.
# 4. Iterate while `left` is less than `right`:
#    a. Calculate the current pair sum: `current_sum = nums[left] + nums[right]`.
#    b. Update `max_pair_sum`: `max_pair_sum = max(max_pair_sum, current_sum)`.
#    c. Move the pointers: increment `left` by 1 and decrement `right` by 1.
# 5. After the loop finishes, `max_pair_sum` will hold the minimized maximum pair sum.
#    Return `max_pair_sum`.
#
# Time Complexity:
# The dominant operation is sorting the array, which takes O(n log n) time, where n is the
# length of the input array. The two-pointer iteration takes O(n) time.
# Therefore, the overall time complexity is O(n log n).
#
# Space Complexity:
# If the sorting algorithm used is in-place (like Python's Timsort for lists),
# the space complexity is O(1) (or O(log n) or O(n) depending on the specific implementation's
# auxiliary space requirements, but generally considered efficient). If a new array is
# created for sorting, it would be O(n). For Python's list sort, it's typically O(n) in the worst case.

class Solution:
    def minPairSum(self, nums: list[int]) -> int:
        # Sort the array in ascending order. This is crucial for the greedy approach.
        nums.sort()
        
        # Initialize pointers for the left and right ends of the sorted array.
        left = 0
        right = len(nums) - 1
        
        # Initialize a variable to keep track of the maximum pair sum found so far.
        # We want to minimize this value.
        max_pair_sum = 0
        
        # Iterate through the array using two pointers, pairing the smallest with the largest,
        # the second smallest with the second largest, and so on.
        while left < right:
            # Calculate the sum of the current pair.
            current_sum = nums[left] + nums[right]
            
            # Update the maximum pair sum if the current pair sum is greater.
            max_pair_sum = max(max_pair_sum, current_sum)
            
            # Move the pointers inwards to consider the next pair.
            left += 1
            right -= 1
            
        # Return the minimized maximum pair sum.
        return max_pair_sum

```