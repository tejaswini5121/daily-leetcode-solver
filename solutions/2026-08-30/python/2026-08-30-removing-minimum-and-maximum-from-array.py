```python
# This problem asks us to find the minimum number of deletions to remove both the minimum
# and maximum elements from a given array. Deletions can only occur from the front or back
# of the array.
#
# Link: https://leetcode.com/problems/removing-minimum-and-maximum-from-array/
#
# Approach:
# The core idea is to find the indices of the minimum and maximum elements.
# Once we have these indices, we can consider three scenarios to remove both elements:
# 1. Remove both from the left: This involves deleting all elements up to and including
#    the maximum of the two indices. The number of deletions is `max(min_idx, max_idx) + 1`.
# 2. Remove both from the right: This involves deleting all elements from the end of the
#    array up to and including the minimum of the two indices. The number of deletions
#    is `n - min(min_idx, max_idx)`, where `n` is the length of the array.
# 3. Remove one from the left and one from the right: This means we remove elements from
#    the left up to one of the elements, and then from the right up to the other.
#    There are two sub-cases here:
#    a. Remove min from left, max from right: `min_idx + 1` (from left) + `n - max_idx` (from right).
#    b. Remove max from left, min from right: `max_idx + 1` (from left) + `n - min_idx` (from right).
#
#    Alternatively, and more concisely for case 3, we can think of it as removing elements
#    from the left up to the element that is *further* from the left end, and then removing
#    elements from the right up to the element that is *further* from the right end.
#    The total deletions in this scenario would be `max(min_idx, max_idx) + 1` (from left) +
#    `n - min(min_idx, max_idx)` (from right), but this overcounts. A simpler way to express
#    the third strategy is to remove the element further from the front from the front,
#    and the element further from the back from the back. The total deletions would be
#    the index of the element further from the front + 1 (to include that element)
#    plus the number of elements from the back to the element further from the back.
#    Let's say min_idx is at `i` and max_idx is at `j`.
#    - Remove from left only: `max(i, j) + 1`
#    - Remove from right only: `n - min(i, j)`
#    - Remove one from left, one from right:
#      - Min from left, Max from right: `i + 1 + n - j`
#      - Max from left, Min from right: `j + 1 + n - i`
#    The minimum of these three strategies will be our answer.
#
# Time Complexity:
# O(N) to find the minimum and maximum elements and their indices.
# O(1) for calculating the three possible deletion counts and finding the minimum.
# Therefore, the overall time complexity is O(N), where N is the number of elements in the array.
#
# Space Complexity:
# O(1) as we only use a few variables to store indices and the minimum result.

class Solution:
    def removeMinMax(self, nums: list[int]) -> int:
        n = len(nums)

        # Handle the edge case where the array has only one element.
        # This element is both the minimum and maximum, so 1 deletion is needed.
        if n == 1:
            return 1

        # Find the minimum and maximum elements and their indices.
        min_val = float('inf')
        max_val = float('-inf')
        min_idx = -1
        max_idx = -1

        for i in range(n):
            if nums[i] < min_val:
                min_val = nums[i]
                min_idx = i
            if nums[i] > max_val:
                max_val = nums[i]
                max_idx = i

        # Ensure min_idx is always less than or equal to max_idx for simpler logic.
        # This is not strictly necessary but can make comparisons slightly cleaner.
        # However, the logic below correctly handles any order of min_idx and max_idx.

        # Calculate the number of deletions for three main strategies:

        # Strategy 1: Remove both from the left.
        # We need to delete all elements from the start up to the element that is
        # further from the left end. The index of this element is max(min_idx, max_idx).
        # The number of deletions is this index + 1 (to include the element itself).
        deletions_from_left = max(min_idx, max_idx) + 1

        # Strategy 2: Remove both from the right.
        # We need to delete all elements from the end up to the element that is
        # further from the right end. The index of the element further from the
        # right end is min(min_idx, max_idx).
        # The number of elements from the end to this index is n - index.
        # So, deletions = n - min(min_idx, max_idx).
        deletions_from_right = n - min(min_idx, max_idx)

        # Strategy 3: Remove one from the left and one from the right.
        # There are two ways this can happen:
        #   a) Remove min_idx from the left, max_idx from the right.
        #      Deletions = (min_idx + 1) + (n - max_idx)
        #   b) Remove max_idx from the left, min_idx from the right.
        #      Deletions = (max_idx + 1) + (n - min_idx)
        # We want the minimum of these two possibilities for this strategy.
        # A simpler way to think about this combined strategy is to remove the element
        # that is further from the left (say at index `farthest_idx_from_left`) from the left,
        # and the element that is further from the right (say at index `farthest_idx_from_right`)
        # from the right.
        # The total number of deletions is (farthest_idx_from_left + 1) + (n - farthest_idx_from_right).
        # This can be calculated as:
        # (index of the element that is further from the left) + 1
        # + (number of elements from the end up to the element that is further from the right)
        #
        # Example: If min_idx=2, max_idx=7, n=10
        # Case a: min from left, max from right => (2+1) + (10-7) = 3 + 3 = 6
        # Case b: max from left, min from right => (7+1) + (10-2) = 8 + 8 = 16
        # Minimum for this strategy is 6.
        #
        # The expression `(min_idx + 1) + (n - max_idx)` covers one scenario,
        # and `(max_idx + 1) + (n - min_idx)` covers the other.
        # We take the minimum of these two.
        deletions_one_left_one_right = min(
            (min_idx + 1) + (n - max_idx),  # Remove min from left, max from right
            (max_idx + 1) + (n - min_idx)   # Remove max from left, min from right
        )

        # The final answer is the minimum of the three strategies.
        return min(deletions_from_left, deletions_from_right, deletions_one_left_one_right)

```