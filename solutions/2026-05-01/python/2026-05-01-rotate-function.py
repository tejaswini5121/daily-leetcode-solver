```python
# Problem Summary:
# Calculates the maximum value of a rotation function F(k) applied to an array nums,
# where F(k) is a weighted sum of elements in the array rotated k positions clockwise.
# Link: https://leetcode.com/problems/rotate-function/
#
# Approach:
# We can observe a relationship between F(k) and F(k+1).
# Let S be the sum of all elements in nums.
# Let F(k) = 0*arrk[0] + 1*arrk[1] + ... + (n-1)*arrk[n-1]
# When we rotate the array by one position clockwise to get arrk+1,
# arrk+1[0] = arrk[n-1], arrk+1[1] = arrk[0], ..., arrk+1[n-1] = arrk[n-2].
#
# F(k+1) = 0*arrk+1[0] + 1*arrk+1[1] + ... + (n-1)*arrk+1[n-1]
# F(k+1) = 0*arrk[n-1] + 1*arrk[0] + 2*arrk[1] + ... + (n-1)*arrk[n-2]
#
# Comparing F(k) and F(k+1):
# F(k+1) = (1*arrk[0] + 2*arrk[1] + ... + (n-1)*arrk[n-2]) + 0*arrk[n-1]
# F(k)   = (0*arrk[0] + 1*arrk[1] + ... + (n-2)*arrk[n-2]) + (n-1)*arrk[n-1]
#
# Let's rewrite F(k+1) by subtracting and adding terms related to arrk[n-1]:
# F(k+1) = (0*arrk[0] + 1*arrk[1] + ... + (n-1)*arrk[n-2]) + (n-1)*arrk[n-1] - (n-1)*arrk[n-1] + 0*arrk[n-1]
# F(k+1) = F(k) - (n-1)*arrk[n-1] + (0*arrk[0] + 1*arrk[1] + ... + (n-2)*arrk[n-2]) + arrk[n-1]
#
# Consider F(k) - (n-1)*arrk[n-1]:
# F(k) - (n-1)*arrk[n-1] = 0*arrk[0] + 1*arrk[1] + ... + (n-2)*arrk[n-2]
#
# So, F(k+1) = (F(k) - (n-1)*arrk[n-1]) + arrk[0] + arrk[1] + ... + arrk[n-2] + arrk[n-1] - arrk[n-1]
# F(k+1) = F(k) - (n-1)*arrk[n-1] + S - arrk[n-1]
# F(k+1) = F(k) + S - n*arrk[n-1]
#
# This gives us a way to calculate F(k+1) efficiently from F(k).
# We first calculate F(0).
# Then, we iterate from k = 0 to n-2, calculating F(k+1) using the formula.
# We keep track of the maximum F(k) encountered.
#
# Time Complexity Analysis:
# O(n) - We iterate through the array once to calculate the sum and F(0), and then iterate n-1 times
# to calculate subsequent F(k) values.
#
# Space Complexity Analysis:
# O(1) - We only use a few variables to store the sum, current F value, and maximum F value.
class Solution:
    def maxRotateFunction(self, nums: list[int]) -> int:
        n = len(nums)
        if n == 0:
            return 0

        # Calculate the sum of all elements in nums.
        total_sum = sum(nums)

        # Calculate F(0) initially.
        # F(0) = 0*nums[0] + 1*nums[1] + ... + (n-1)*nums[n-1]
        fk = 0
        for i in range(n):
            fk += i * nums[i]

        # Initialize the maximum F value found so far with F(0).
        max_fk = fk

        # Iterate from k = 0 to n-2 to calculate F(1), F(2), ..., F(n-1).
        # The formula to derive F(k+1) from F(k) is:
        # F(k+1) = F(k) + total_sum - n * nums[n - 1 - k]
        # In our loop, when we are calculating F(i+1) based on F(i),
        # the element that "leaves" the highest coefficient position is nums[n - 1 - i].
        # For example, to get F(1) from F(0):
        # F(1) = F(0) + total_sum - n * nums[n-1] (where nums[n-1] is the last element of the original array)
        # To get F(2) from F(1):
        # F(2) = F(1) + total_sum - n * nums[n-2] (where nums[n-2] is the second to last element of the original array)
        # So, for F(k+1) based on F(k), the element removed is nums[n-1-(k)].
        # In our loop where `i` goes from 0 to n-2, `k` is `i`.
        # The element nums[n-1-i] is the element that was at index `n-1` in the previous rotation.
        for i in range(n - 1):
            # Calculate the next F value (F(k+1)) using the derived formula.
            # `fk` currently holds F(i).
            # `nums[n - 1 - i]` is the element that was at the last position `n-1` in the array for F(i).
            # When rotating to F(i+1), this element `nums[n - 1 - i]` will be shifted to the first position (index 0),
            # and its contribution of `(n-1) * nums[n-1]` in F(i) will be removed, and `0 * nums[n-1]` will be its new contribution.
            # The other elements' contributions will increase by 1 each.
            fk = fk + total_sum - n * nums[n - 1 - i]
            # Update the maximum F value if the current F value is greater.
            max_fk = max(max_fk, fk)

        return max_fk

```