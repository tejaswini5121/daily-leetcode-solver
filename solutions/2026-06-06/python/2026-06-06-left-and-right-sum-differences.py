```python
# Problem: Left and Right Sum Differences
# Link: https://leetcode.com/problems/left-and-right-sum-differences/
#
# Approach:
# The problem asks us to calculate the absolute difference between the sum of elements to the left of an index and the sum of elements to the right of that index for each element in the input array.
#
# We can solve this efficiently using prefix sums.
# 1. Calculate the total sum of all elements in the array.
# 2. Iterate through the array from left to right. Maintain a running sum of elements encountered so far (leftSum).
# 3. For each element at index `i`:
#    - The `leftSum` for this index `i` is the running sum *before* adding `nums[i]`.
#    - The `rightSum` for this index `i` can be calculated as `totalSum - leftSum - nums[i]`.
#    - The answer for index `i` is `abs(leftSum - rightSum)`.
#    - After calculating the difference, update `leftSum` by adding `nums[i]` for the next iteration.
#
# Time Complexity: O(n)
# We iterate through the array twice: once to calculate the total sum and once to calculate the left and right sums and the differences. Both operations take linear time with respect to the size of the input array `n`.
#
# Space Complexity: O(n)
# We need to store the resulting `answer` array, which has the same size as the input array `nums`. If we are allowed to modify the input array in-place, the space complexity could be O(1) besides the output array. However, the problem statement implies returning a new array.

class Solution:
    def leftRigthDifference(self, nums: list[int]) -> list[int]:
        n = len(nums)
        
        # Calculate the total sum of all elements in the array.
        totalSum = sum(nums)
        
        # Initialize an array to store the results.
        answer = [0] * n
        
        # Initialize the running sum for elements to the left of the current index.
        leftSum = 0
        
        # Iterate through the array to calculate leftSum and rightSum for each index.
        for i in range(n):
            # The sum of elements to the right of index `i` is:
            # totalSum - (sum of elements up to and including index i)
            # which is totalSum - (leftSum + nums[i])
            rightSum = totalSum - leftSum - nums[i]
            
            # Calculate the absolute difference between leftSum and rightSum.
            answer[i] = abs(leftSum - rightSum)
            
            # Update leftSum by adding the current element for the next iteration.
            leftSum += nums[i]
            
        return answer

```