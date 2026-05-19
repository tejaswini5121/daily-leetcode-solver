```python
# Finds the smallest integer present in both sorted arrays.
# LeetCode Problem: https://leetcode.com/problems/minimum-common-value/
#
# Approach:
# Since both arrays are sorted, we can use a two-pointer approach.
# We initialize two pointers, one for each array, at the beginning.
# We then compare the elements pointed to by the pointers:
# 1. If the elements are equal, we've found a common element. Since we're
#    iterating from the smallest elements upwards, this first common element
#    we find will be the minimum common value. We return it.
# 2. If the element in nums1 is smaller than the element in nums2, we
#    increment the pointer for nums1 to move towards a larger or equal value.
# 3. If the element in nums2 is smaller than the element in nums1, we
#    increment the pointer for nums2.
# If we exhaust either array without finding a common element, it means no
# common element exists, and we return -1.
#
# Time Complexity: O(m + n)
# Where m is the length of nums1 and n is the length of nums2. In the worst case,
# we might iterate through both arrays entirely.
#
# Space Complexity: O(1)
# We are only using a few extra variables (pointers), which do not depend on
# the input size.

class Solution:
    def getCommon(self, nums1: list[int], nums2: list[int]) -> int:
        # Initialize pointers for both arrays
        ptr1 = 0
        ptr2 = 0

        # Get the lengths of the arrays for boundary checks
        n1 = len(nums1)
        n2 = len(nums2)

        # Iterate while both pointers are within the bounds of their respective arrays
        while ptr1 < n1 and ptr2 < n2:
            # If the elements at the current pointers are equal, we found the minimum common value
            if nums1[ptr1] == nums2[ptr2]:
                return nums1[ptr1]
            # If the element in nums1 is smaller, advance the pointer for nums1
            elif nums1[ptr1] < nums2[ptr2]:
                ptr1 += 1
            # If the element in nums2 is smaller, advance the pointer for nums2
            else: # nums2[ptr2] < nums1[ptr1]
                ptr2 += 1

        # If the loop finishes without finding a common element, return -1
        return -1

```