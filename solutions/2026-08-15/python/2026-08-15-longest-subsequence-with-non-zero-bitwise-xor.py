```python
# Problem: Longest Subsequence With Non-Zero Bitwise XOR
# Link: https://leetcode.com/problems/longest-subsequence-with-non-zero-bitwise-xor/
#
# Approach:
# The problem asks for the length of the longest subsequence whose bitwise XOR sum is non-zero.
# A subsequence can be formed by selecting any subset of elements from the original array.
#
# If all possible XOR sums of subsequences are zero, then the answer is 0. This can only happen
# if all numbers in the input array are 0. However, the constraints state nums[i] >= 0.
# If there's at least one non-zero number, we can always form a subsequence of length 1 with a non-zero XOR.
#
# Consider the properties of XOR:
# 1. A XOR A = 0
# 2. A XOR 0 = A
# 3. XOR is associative and commutative.
#
# If all elements in `nums` are 0, then any subsequence XOR sum will be 0. In this case, the answer is 0.
# If there is at least one non-zero element in `nums`, then we can always form a subsequence of length 1
# with a non-zero XOR sum. This means the minimum possible non-zero XOR subsequence length is 1.
#
# Now, let's think about achieving the *longest* subsequence.
# If we can form a subsequence with a non-zero XOR sum using all elements of `nums`, that would be the longest possible subsequence.
# The XOR sum of all elements in `nums` can be calculated by `reduce(lambda x, y: x ^ y, nums)`.
#
# If the XOR sum of all elements is non-zero, then the longest subsequence with a non-zero XOR sum is the entire array itself. Its length is `len(nums)`.
#
# If the XOR sum of all elements is zero, it means that the set of elements in `nums` is linearly dependent over GF(2) (the field with two elements, used for bitwise operations).
# In this case, including all elements results in a zero XOR sum. To get a non-zero XOR sum, we must exclude at least one element.
# If we exclude any single element from the entire array, will the remaining subsequence have a non-zero XOR sum?
# Let the XOR sum of all elements be `S`. If `S = 0`, and we remove an element `x`, the new XOR sum will be `S ^ x = 0 ^ x = x`.
# If there is any non-zero element `x` in `nums`, then removing it will result in a non-zero XOR sum.
# Since we are in the case where the total XOR sum is 0, and we want the *longest* subsequence with a non-zero XOR sum, we should try to exclude as few elements as possible.
# If excluding just one element `x` (where `x != 0`) results in a non-zero XOR sum, then the longest possible subsequence will have length `len(nums) - 1`.
#
# Therefore, the logic is:
# 1. Calculate the XOR sum of all elements in `nums`.
# 2. If the XOR sum is non-zero, the answer is `len(nums)`.
# 3. If the XOR sum is zero, we need to check if there's any non-zero element.
#    - If all elements are zero, any subsequence XOR is zero, so the answer is 0.
#    - If there is at least one non-zero element, excluding any single non-zero element will result in a non-zero XOR sum. The longest such subsequence will have length `len(nums) - 1`.
#
# A more concise way to handle step 3:
# If the XOR sum of all elements is zero, it means that the elements are "redundant" in terms of contributing to a unique XOR sum.
# If all elements are 0, then `all(x == 0 for x in nums)` is true. The XOR sum will be 0. In this case, the answer is 0.
# If the XOR sum is 0, but not all elements are 0, it means there's at least one non-zero element. Removing any one non-zero element will make the XOR sum of the remaining elements non-zero. The length will be `len(nums) - 1`.
#
# So, the refined logic:
# 1. Calculate `total_xor = reduce(operator.xor, nums)`.
# 2. If `total_xor != 0`, return `len(nums)`.
# 3. If `total_xor == 0`:
#    a. Check if all elements in `nums` are 0. This can be done by checking if the sum of the array is 0 (since elements are non-negative). Or more directly, `all(x == 0 for x in nums)`.
#    b. If `all(x == 0 for x in nums)`, return 0.
#    c. Otherwise (total_xor is 0, but there's at least one non-zero element), return `len(nums) - 1`.
#
# We can simplify step 3. If `total_xor == 0`, the answer is `len(nums) - 1` unless all elements are 0.
# If all elements are 0, the answer is 0.
# If `total_xor != 0`, the answer is `len(nums)`.
#
# Let's consider the edge case where `nums` contains only zeros.
# `nums = [0, 0, 0]`
# `total_xor = 0 ^ 0 ^ 0 = 0`
# `all(x == 0 for x in nums)` is `True`.
# So, the logic would return 0. This is correct.
#
# Let's consider `nums = [1, 2, 3]`
# `total_xor = 1 ^ 2 ^ 3 = 0`
# `all(x == 0 for x in nums)` is `False`.
# So, the logic would return `len(nums) - 1 = 3 - 1 = 2`. This is correct. (e.g., [1, 2] XOR sum is 3, [1, 3] XOR sum is 2, [2, 3] XOR sum is 1. Longest is 2)
#
# Let's consider `nums = [2, 3, 4]`
# `total_xor = 2 ^ 3 ^ 4 = 1 ^ 4 = 5`
# `total_xor != 0`.
# So, the logic would return `len(nums) = 3`. This is correct. (The subsequence [2, 3, 4] has XOR sum 5)
#
# The logic appears sound.
#
# Time Complexity:
# Calculating the XOR sum of all elements takes O(N) time, where N is the length of `nums`.
# Checking if all elements are zero takes O(N) time.
# Therefore, the overall time complexity is O(N).
#
# Space Complexity:
# We only use a few variables to store the total XOR sum and possibly a flag or loop counter.
# This is O(1) extra space.

import functools
import operator

class Solution:
    def longestSubsequence(self, nums: list[int]) -> int:
        # Calculate the bitwise XOR sum of all elements in the array.
        # functools.reduce applies a function cumulatively to the items of a sequence,
        # from left to right, so as to reduce the sequence to a single value.
        # operator.xor is the bitwise XOR operator.
        total_xor = functools.reduce(operator.xor, nums)

        # If the total XOR sum of all elements is non-zero,
        # then the longest subsequence with a non-zero XOR sum is the entire array itself.
        if total_xor != 0:
            return len(nums)
        else:
            # If the total XOR sum is zero, we need to consider two cases:
            # 1. All elements in the array are zero.
            # 2. The total XOR sum is zero, but there's at least one non-zero element.

            # To check if all elements are zero efficiently, we can iterate.
            # If `nums` is empty, total_xor would be 0 (or error depending on initial value), but constraints say len(nums) >= 1.
            # If there is at least one non-zero element, we can form a subsequence
            # of length `len(nums) - 1` with a non-zero XOR sum by removing that non-zero element.
            # For example, if nums = [a, b, c] and a^b^c = 0:
            # If we remove 'a', the new XOR sum is (a^b^c) ^ a = 0 ^ a = a.
            # If 'a' is non-zero, then this subsequence has a non-zero XOR sum.
            # So, if total_xor is 0 and there's at least one non-zero element, the answer is len(nums) - 1.

            # Check if all elements are zero.
            # We can do this by checking if any element is non-zero.
            has_non_zero = False
            for num in nums:
                if num != 0:
                    has_non_zero = True
                    break # Found a non-zero element, no need to check further.

            # If all elements are zero, then any subsequence will also have an XOR sum of zero.
            # In this case, no subsequence has a non-zero XOR sum, so we return 0.
            if not has_non_zero:
                return 0
            else:
                # If the total XOR sum is zero, but there is at least one non-zero element,
                # we can remove any single non-zero element to form a subsequence with a non-zero XOR sum.
                # The length of this subsequence will be len(nums) - 1, which is the maximum possible
                # length when the total XOR sum is zero.
                return len(nums) - 1

```