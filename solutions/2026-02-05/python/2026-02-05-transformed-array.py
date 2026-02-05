```python
# Problem: Transformed Array
# LeetCode Link: https://leetcode.com/problems/transformed-array/
#
# Problem Summary:
# Given a circular array `nums`, create a new array `result` where each element `result[i]` is determined by
# moving `nums[i]` steps (right if positive, left if negative) from index `i` in the circular array.
# If `nums[i]` is 0, `result[i]` is 0.
#
# Approach:
# We will iterate through the input array `nums`. For each element `nums[i]` at index `i`:
# 1. If `nums[i]` is 0, we set `result[i]` to 0.
# 2. If `nums[i]` is positive, we calculate the new index by moving `nums[i]` steps to the right.
#    The circular movement is handled using the modulo operator. The formula is `(i + nums[i]) % n`,
#    where `n` is the length of the array.
# 3. If `nums[i]` is negative, we calculate the new index by moving `abs(nums[i])` steps to the left.
#    The circular movement to the left is handled by `(i - abs(nums[i])) % n`.
#    Since Python's modulo operator can result in negative numbers for negative inputs, we ensure
#    the index is always positive by adding `n` and then taking the modulo again: `(i - abs(nums[i]) % n + n) % n`.
#    A simpler way to achieve leftward circular movement is `(i + nums[i]) % n`. Python's modulo correctly handles negative numbers for circular array indexing when the step is negative. For example, if i=0 and nums[i]=-1, and n=4, (0 + -1) % 4 = -1. However, we need it to wrap around. The correct logic is `(i + nums[i]) % n`. If this result is negative, we add `n` to make it positive: `target_index = (i + nums[i]) % n`. Then `result[i] = nums[target_index]`. The formula `(i + nums[i] % n + n) % n` correctly handles both positive and negative moves for circular arrays. For negative moves, `i + nums[i]` can be negative. `(i + nums[i]) % n` in Python might result in a negative index if `i + nums[i]` is negative. For example, `(0 + -2) % 4` is `-2`. To correctly handle negative indices in Python for circular arrays, we can use `(current_index + step % n + n) % n`. For `nums[i] < 0`, the step is `nums[i]`. So the target index would be `(i + nums[i]) % n`. If this result is negative, it means we've wrapped around from the beginning. In Python, a negative result from `% n` means it's `k - n` where `k` is the true index if we were to count negative steps. A common way to ensure a positive index for circular arrays in Python is `(start_index + steps % n + n) % n`.
#
# Let's refine the negative movement:
# If `nums[i]` is negative, the number of steps to the left is `abs(nums[i])`.
# The target index will be `i - abs(nums[i])`.
# To handle circularity, we use `(i - abs(nums[i])) % n`.
# In Python, `a % n` can be negative if `a` is negative. For example, `-2 % 4` is `-2`.
# To get a positive index between `0` and `n-1`, we can use `(i - abs(nums[i]) % n + n) % n`.
# A more direct and correct way for both positive and negative steps is `(i + nums[i]) % n`.
# If `i + nums[i]` is negative, say `k`, then `k % n` might also be negative.
# We want the index to be `(k + m*n)` such that it's in `[0, n-1]`.
# This can be achieved by `(i + nums[i]) % n`. If the result is negative, add `n`.
# So, `target_index = (i + nums[i]) % n`. Then `result[i] = nums[target_index]`.
#
# Example walk-through: `nums = [3,-2,1,1]`, `n = 4`
# i = 0, nums[0] = 3: `(0 + 3) % 4 = 3`. `result[0] = nums[3] = 1`.
# i = 1, nums[1] = -2: `(1 + (-2)) % 4 = -1 % 4 = -1`. This is negative. Python's modulo for negative numbers: `-1 % 4` evaluates to `3`. So `target_index = 3`. `result[1] = nums[3] = 1`.
# i = 2, nums[2] = 1: `(2 + 1) % 4 = 3`. `result[2] = nums[3] = 1`.
# i = 3, nums[3] = 1: `(3 + 1) % 4 = 4 % 4 = 0`. `result[3] = nums[0] = 3`.
# Result: `[1, 1, 1, 3]`. This matches example 1.
#
# Example walk-through: `nums = [-1,4,-1]`, `n = 3`
# i = 0, nums[0] = -1: `(0 + (-1)) % 3 = -1 % 3 = -1`. In Python, `-1 % 3` is `2`. So `target_index = 2`. `result[0] = nums[2] = -1`.
# i = 1, nums[1] = 4: `(1 + 4) % 3 = 5 % 3 = 2`. `result[1] = nums[2] = -1`.
# i = 2, nums[2] = -1: `(2 + (-1)) % 3 = 1 % 3 = 1`. `result[2] = nums[1] = 4`.
# Result: `[-1, -1, 4]`. This matches example 2.
#
# The logic `(i + nums[i]) % n` correctly handles circular indexing in Python for both positive and negative steps.
#
# Time Complexity:
# We iterate through the `nums` array once. The length of `nums` is `n`.
# Inside the loop, operations like addition, modulo, and array access are O(1).
# Therefore, the total time complexity is O(n), where n is the length of the `nums` array.
#
# Space Complexity:
# We create a new array `result` of the same size as `nums` to store the output.
# The space used by `result` is O(n).
# Therefore, the space complexity is O(n), where n is the length of the `nums` array.

def transformedArray(nums):
    """
    Transforms a circular array based on element values.

    Args:
        nums: A list of integers representing the circular array.

    Returns:
        A new list of integers representing the transformed array.
    """
    n = len(nums)  # Get the length of the input array
    result = [0] * n  # Initialize the result array with zeros

    # Iterate through each element of the input array
    for i in range(n):
        current_value = nums[i]

        # If the current value is 0, the transformed value is also 0
        if current_value == 0:
            result[i] = 0
        else:
            # Calculate the target index using circular arithmetic.
            # (i + current_value) handles both positive (right) and negative (left) moves.
            # The modulo operator '%' ensures circularity.
            # Python's % operator handles negative numbers such that the result
            # is always in the range [-(n-1), n-1].
            # To ensure the index is always in [0, n-1], we can use:
            # target_index = (i + current_value) % n
            # If target_index is negative, add n. A more robust way is:
            target_index = (i + current_value) % n

            # Assign the value from the calculated target index in the original nums array
            # to the corresponding index in the result array.
            result[i] = nums[target_index]

    return result  # Return the newly created transformed array

# Example Usage:
# nums1 = [3, -2, 1, 1]
# print(f"Input: {nums1}")
# print(f"Output: {transformedArray(nums1)}")  # Expected Output: [1, 1, 1, 3]

# nums2 = [-1, 4, -1]
# print(f"Input: {nums2}")
# print(f"Output: {transformedArray(nums2)}")  # Expected Output: [-1, -1, 4]
```