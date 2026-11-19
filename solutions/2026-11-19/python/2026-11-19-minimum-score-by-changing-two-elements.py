```python
# Problem: Minimum Score by Changing Two Elements
# Summary: Find the minimum score (max_diff + min_diff) after changing exactly two elements in the array.
# Link: https://leetcode.com/problems/minimum-score-by-changing-two-elements/
#
# Approach:
# The score is defined as the sum of the maximum absolute difference and the minimum absolute difference between any two elements in the array.
# To minimize this score, we want to make both the maximum and minimum differences as small as possible.
# The minimum possible difference between any two elements is 0, which can be achieved if we make at least two elements equal.
# The maximum difference is determined by the smallest and largest elements in the array.
#
# We are allowed to change two elements. This gives us flexibility.
# Consider the sorted version of the array. The smallest element is `nums[0]` and the largest is `nums[n-1]`.
# The initial maximum difference is `nums[n-1] - nums[0]`.
# The initial minimum difference depends on adjacent elements in the sorted array.
#
# If we change two elements, the most impactful changes to reduce the maximum difference would be to:
# 1. Change the smallest element to be equal to the second smallest element.
# 2. Change the largest element to be equal to the second largest element.
#
# Let's sort the array first. Let the sorted array be `s_nums`.
# The original minimum element is `s_nums[0]` and the maximum is `s_nums[n-1]`.
#
# Case 1: We change `s_nums[0]` and `s_nums[1]` to the same value.
#   The new minimum element could be the original `s_nums[2]` or the new value we set.
#   If we set them to `s_nums[2]`, then the new smallest element would be `s_nums[2]`.
#   The maximum element remains `s_nums[n-1]`.
#   The new maximum difference becomes `s_nums[n-1] - s_nums[2]`.
#   If we make `s_nums[0]` and `s_nums[1]` equal to some value `v`. To minimize the score, `v` should be chosen such that it doesn't increase the max difference significantly.
#   If we aim for the minimum difference to be 0, we can change `s_nums[0]` and `s_nums[1]` to be `s_nums[2]`.
#   The array effectively starts from `s_nums[2]`. The new minimum element becomes `s_nums[2]`.
#   The maximum element remains `s_nums[n-1]`.
#   The maximum difference becomes `s_nums[n-1] - s_nums[2]`.
#   The minimum difference becomes 0 (because `s_nums[0]` and `s_nums[1]` are now equal).
#   Score = `(s_nums[n-1] - s_nums[2]) + 0`.
#
# Case 2: We change `s_nums[n-2]` and `s_nums[n-1]` to the same value.
#   Similar to Case 1, we can set them to `s_nums[n-3]`.
#   The new maximum element becomes `s_nums[n-3]`.
#   The minimum element remains `s_nums[0]`.
#   The new maximum difference becomes `s_nums[n-3] - s_nums[0]`.
#   The minimum difference becomes 0.
#   Score = `(s_nums[n-3] - s_nums[0]) + 0`.
#
# Case 3: We change `s_nums[0]` and `s_nums[n-1]` to the same value.
#   We can change both to `s_nums[1]` or `s_nums[n-2]`.
#   If we change `s_nums[0]` to `s_nums[1]` and `s_nums[n-1]` to `s_nums[n-2]`.
#   The minimum element becomes `s_nums[1]` and the maximum becomes `s_nums[n-2]`.
#   The new maximum difference becomes `s_nums[n-2] - s_nums[1]`.
#   The minimum difference becomes 0.
#   Score = `(s_nums[n-2] - s_nums[1]) + 0`.
#
# However, we only need to consider making the minimum difference zero.
# If we make the minimum difference zero, the score is simply the maximum difference.
# We can always make the minimum difference zero by changing two elements to be equal to each other.
# The question then becomes how to minimize the maximum difference after we've ensured the minimum difference is zero.
#
# To minimize the maximum difference, we should try to bring the extreme values closer.
# We have two operations:
# 1. Change the smallest element.
# 2. Change the largest element.
#
# Consider the sorted array `s_nums` of length `n`.
# The original min is `s_nums[0]`, max is `s_nums[n-1]`.
#
# Option A: Change `s_nums[0]` and `s_nums[1]`.
#   If we make `s_nums[0]` and `s_nums[1]` equal to some value `x`.
#   The smallest element in the modified array will be `min(x, s_nums[2])` (if `n > 2`).
#   The largest element is `s_nums[n-1]`.
#   To minimize the maximum difference `s_nums[n-1] - smallest_element`, we should make `smallest_element` as large as possible.
#   The largest possible value for the smallest element (after changing `s_nums[0]` and `s_nums[1]`) is `s_nums[2]` (if `n > 2`).
#   If we set `s_nums[0]` and `s_nums[1]` to be `s_nums[2]`, then the new minimum element is `s_nums[2]`.
#   The maximum difference becomes `s_nums[n-1] - s_nums[2]`. The minimum difference is 0. Score = `s_nums[n-1] - s_nums[2]`.
#   If `n == 3`, setting `s_nums[0]` and `s_nums[1]` to `s_nums[2]` results in `[s_nums[2], s_nums[2], s_nums[2]]`. Max diff is 0.
#
# Option B: Change `s_nums[n-2]` and `s_nums[n-1]`.
#   If we make `s_nums[n-2]` and `s_nums[n-1]` equal to some value `y`.
#   The largest element in the modified array will be `max(y, s_nums[n-3])` (if `n > 2`).
#   The smallest element is `s_nums[0]`.
#   To minimize the maximum difference `largest_element - s_nums[0]`, we should make `largest_element` as small as possible.
#   The smallest possible value for the largest element (after changing `s_nums[n-2]` and `s_nums[n-1]`) is `s_nums[n-3]` (if `n > 2`).
#   If we set `s_nums[n-2]` and `s_nums[n-1]` to be `s_nums[n-3]`, then the new maximum element is `s_nums[n-3]`.
#   The maximum difference becomes `s_nums[n-3] - s_nums[0]`. The minimum difference is 0. Score = `s_nums[n-3] - s_nums[0]`.
#   If `n == 3`, setting `s_nums[1]` and `s_nums[2]` to `s_nums[0]` results in `[s_nums[0], s_nums[0], s_nums[0]]`. Max diff is 0.
#
# Option C: Change `s_nums[0]` and `s_nums[n-1]`.
#   If we make `s_nums[0]` equal to `s_nums[1]` and `s_nums[n-1]` equal to `s_nums[n-2]`.
#   The smallest element becomes `s_nums[1]`. The largest element becomes `s_nums[n-2]`.
#   The maximum difference becomes `s_nums[n-2] - s_nums[1]`. The minimum difference is 0. Score = `s_nums[n-2] - s_nums[1]`.
#   This uses two changes to reduce both extremes towards the center.
#
# We need to find the minimum of these three possible maximum differences, because in all these cases, we can make the minimum difference 0.
#
# Let `n` be the length of `nums`.
# Sort `nums`.
# Candidate 1: Change `nums[0]` and `nums[1]`. Effectively, the smallest element becomes `nums[2]`. Max difference is `nums[n-1] - nums[2]`. Minimum difference is 0. Score = `nums[n-1] - nums[2]`.
# Candidate 2: Change `nums[n-2]` and `nums[n-1]`. Effectively, the largest element becomes `nums[n-3]`. Max difference is `nums[n-3] - nums[0]`. Minimum difference is 0. Score = `nums[n-3] - nums[0]`.
# Candidate 3: Change `nums[0]` to `nums[1]` and `nums[n-1]` to `nums[n-2]`. The smallest element becomes `nums[1]`. The largest element becomes `nums[n-2]`. Max difference is `nums[n-2] - nums[1]`. Minimum difference is 0. Score = `nums[n-2] - nums[1]`.
#
# The minimum score will be the minimum of these three calculated scores.
# Note that if `n=3`, `nums[2]` for candidate 1 is `nums[n-1]`, `nums[n-3]` for candidate 2 is `nums[0]`, and `nums[1]` for candidate 3.
# If `n=3`:
# Cand 1: `nums[2] - nums[2] = 0`
# Cand 2: `nums[0] - nums[0] = 0`
# Cand 3: `nums[1] - nums[1] = 0`
# This makes sense, with `n=3` we can make all elements equal.
#
# Time Complexity: O(N log N) due to sorting.
# Space Complexity: O(log N) or O(N) depending on the sorting algorithm used (for recursion stack or auxiliary space).
import sys

class Solution:
    def minScore(self, nums: list[int]) -> int:
        """
        Calculates the minimum score achievable by changing two elements in the array.
        The score is the sum of the maximum and minimum absolute differences between any two elements.
        """
        n = len(nums)
        # Sort the array to easily identify the smallest and largest elements.
        nums.sort()

        # To minimize the score, we aim to make the minimum difference 0.
        # This can be achieved by making at least two elements equal.
        # The problem then reduces to minimizing the maximum difference after ensuring min_diff = 0.

        # There are three primary scenarios to consider for minimizing the maximum difference
        # by strategically changing two elements:

        # Scenario 1: Change the two smallest elements (nums[0] and nums[1]).
        # We can set them to be equal to nums[2]. This effectively removes the original
        # smallest two elements from consideration for the maximum difference.
        # The new smallest element would be nums[2]. The largest element remains nums[n-1].
        # The maximum difference in this scenario is nums[n-1] - nums[2].
        # The minimum difference is 0 (since we made two elements equal).
        # Score = (nums[n-1] - nums[2]) + 0
        score1 = nums[n-1] - nums[2]

        # Scenario 2: Change the two largest elements (nums[n-2] and nums[n-1]).
        # We can set them to be equal to nums[n-3]. This effectively removes the original
        # largest two elements from consideration for the maximum difference.
        # The new largest element would be nums[n-3]. The smallest element remains nums[0].
        # The maximum difference in this scenario is nums[n-3] - nums[0].
        # The minimum difference is 0.
        # Score = (nums[n-3] - nums[0]) + 0
        score2 = nums[n-3] - nums[0]

        # Scenario 3: Change the smallest element (nums[0]) and the largest element (nums[n-1]).
        # A common strategy to reduce the range is to make nums[0] equal to nums[1]
        # and nums[n-1] equal to nums[n-2].
        # The new smallest element becomes nums[1]. The new largest element becomes nums[n-2].
        # The maximum difference in this scenario is nums[n-2] - nums[1].
        # The minimum difference is 0.
        # Score = (nums[n-2] - nums[1]) + 0
        score3 = nums[n-2] - nums[1]

        # The minimum score will be the minimum of these three scenarios.
        # Note on edge case n=3:
        # For n=3, nums = [a, b, c] after sorting.
        # score1 = nums[2] - nums[2] = 0 (change a, b to c)
        # score2 = nums[0] - nums[0] = 0 (change b, c to a)
        # score3 = nums[1] - nums[1] = 0 (change a to b, c to b)
        # All result in 0, which is correct as we can make all elements equal.
        return min(score1, score2, score3)

```