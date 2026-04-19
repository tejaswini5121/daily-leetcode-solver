```python
# Finds the maximum distance j - i for valid pairs (i, j) where i <= j and nums1[i] <= nums2[j].
# The arrays nums1 and nums2 are non-increasing.
# Link: https://leetcode.com/problems/maximum-distance-between-a-pair-of-values/
#
# Approach:
# We can use a two-pointer approach. We iterate through nums1 with pointer `i` and
# through nums2 with pointer `j`. Since both arrays are non-increasing, for a fixed
# `i`, as we increase `j`, nums2[j] will be less than or equal to nums2[j-1].
#
# For each `i` in nums1, we want to find the largest `j` in nums2 such that `i <= j`
# and `nums1[i] <= nums2[j]`.
#
# We initialize `max_dist = 0`.
# We use a pointer `j` for nums2, starting at 0.
# We iterate through nums1 with pointer `i` from 0 to len(nums1) - 1.
# For each `i`, we advance `j` as long as `j < len(nums2)` and `nums1[i] <= nums2[j]`.
# This ensures that `j` is always the largest valid index for the current `i`.
# If `i <= j` (which will always be true in this logic since `j` starts at 0 and only moves forward,
# and `i` also starts at 0 and moves forward) and `nums1[i] <= nums2[j]`, then `j - i` is a potential
# maximum distance. We update `max_dist = max(max_dist, j - i)`.
#
# Crucially, when we move to the next `i` (i.e., `i+1`), `nums1[i+1]` will be less than or equal to
# `nums1[i]`. This means that the optimal `j` for `i+1` will be greater than or equal to the optimal
# `j` for `i`. Therefore, we don't need to reset `j` for each `i`; we can continue advancing it.
#
# Time Complexity: O(m + n), where m is the length of nums1 and n is the length of nums2.
# The pointers `i` and `j` each traverse their respective arrays at most once.
#
# Space Complexity: O(1). We only use a few variables to store pointers and the maximum distance.
#
class Solution:
    def maxDistance(self, nums1: list[int], nums2: list[int]) -> int:
        m = len(nums1)
        n = len(nums2)
        max_dist = 0  # Initialize maximum distance found so far
        j = 0         # Pointer for nums2

        # Iterate through nums1 with pointer i
        for i in range(m):
            # Advance pointer j in nums2 as long as the conditions are met:
            # 1. j is within the bounds of nums2
            # 2. nums1[i] is less than or equal to nums2[j]
            # This ensures we find the largest possible j for the current i.
            while j < n and nums1[i] <= nums2[j]:
                j += 1

            # After the inner while loop, 'j' has moved past the valid range for the current nums1[i].
            # The last valid index for nums2 for the current nums1[i] would be j-1.
            # The condition i <= j is implicitly handled because j starts at 0 and only increments.
            # If j has moved forward, and j-1 is a valid index such that nums1[i] <= nums2[j-1],
            # then j-1 is a potential candidate for the end of a valid pair.
            # We must ensure j > i because j was advanced past the condition, and we consider
            # the pair (i, j-1) if j > i.
            if j > i:
                # Update the maximum distance if the current pair (i, j-1) yields a larger distance.
                # The valid pair is (i, j-1) since the loop breaks when nums1[i] > nums2[j] or j reaches n.
                # So the largest valid j for nums1[i] was j-1.
                max_dist = max(max_dist, (j - 1) - i)

        return max_dist

```