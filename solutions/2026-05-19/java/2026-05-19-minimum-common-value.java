```java
// Finds the minimum common integer between two sorted arrays.
// Problem Link: https://leetcode.com/problems/minimum-common-value/
// Approach:
// Since both arrays are sorted, we can use a two-pointer approach.
// We initialize two pointers, one for each array, starting at the beginning.
// We compare the elements at the current pointers.
// If they are equal, we have found a common element, and since we are iterating
// from the smallest elements, this must be the minimum common element. We return it.
// If the element in nums1 is smaller than the element in nums2, we increment the
// pointer for nums1 to try and find a larger element that might match.
// If the element in nums2 is smaller than the element in nums1, we increment the
// pointer for nums2.
// If either pointer reaches the end of its respective array without finding a common element,
// it means there is no common element, and we return -1.
// Time Complexity: O(min(n, m)), where n is the length of nums1 and m is the length of nums2.
// In the worst case, one pointer will traverse its entire array, and the other will
// traverse up to its end.
// Space Complexity: O(1), as we only use a constant amount of extra space for the pointers.
class Solution {
    public int getCommon(int[] nums1, int[] nums2) {
        // Initialize two pointers, one for each array.
        int ptr1 = 0;
        int ptr2 = 0;

        // Iterate while both pointers are within the bounds of their respective arrays.
        while (ptr1 < nums1.length && ptr2 < nums2.length) {
            // If the elements at the current pointers are equal, we've found the minimum common value.
            if (nums1[ptr1] == nums2[ptr2]) {
                return nums1[ptr1]; // Return the common element.
            }
            // If the element in nums1 is smaller, increment ptr1 to move to the next element in nums1.
            // This is because we're looking for a match, and nums1[ptr1] is too small to match nums2[ptr2].
            else if (nums1[ptr1] < nums2[ptr2]) {
                ptr1++;
            }
            // If the element in nums2 is smaller, increment ptr2 to move to the next element in nums2.
            // This is because we're looking for a match, and nums2[ptr2] is too small to match nums1[ptr1].
            else {
                ptr2++;
            }
        }

        // If the loop finishes without finding a common element, it means no common element exists.
        return -1;
    }
}
```