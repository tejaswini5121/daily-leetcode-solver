```cpp
// Given two sorted integer arrays, find the smallest common integer.
// If no common integer exists, return -1.
// Link: https://leetcode.com/problems/minimum-common-value/
//
// Approach:
// Since both arrays are sorted, we can use the two-pointer technique.
// We initialize two pointers, one for each array, at the beginning.
// We then iterate while both pointers are within their respective array bounds.
// In each iteration, we compare the elements pointed to by the two pointers:
// 1. If nums1[p1] == nums2[p2], we have found a common element. Since we are
//    looking for the minimum common element and both arrays are sorted,
//    this must be the minimum common element. So, we return nums1[p1].
// 2. If nums1[p1] < nums2[p2], it means the element at nums1[p1] is too small
//    to be equal to nums2[p2]. To potentially find a match, we need to move
//    the pointer in nums1 forward to a larger element, so we increment p1.
// 3. If nums1[p1] > nums2[p2], it means the element at nums2[p2] is too small
//    to be equal to nums1[p1]. To potentially find a match, we need to move
//    the pointer in nums2 forward to a larger element, so we increment p2.
// If the loop finishes without finding a common element (i.e., one of the
// pointers goes out of bounds), it means there are no common elements,
// so we return -1.
//
// Time Complexity: O(m + n), where m and n are the lengths of nums1 and nums2,
// respectively. In the worst case, we traverse each array at most once.
//
// Space Complexity: O(1), as we only use a constant amount of extra space for
// the pointers.
//
class Solution {
public:
    int getCommon(vector<int>& nums1, vector<int>& nums2) {
        // Initialize two pointers, one for each array, starting at the beginning.
        int p1 = 0;
        int p2 = 0;

        // Iterate while both pointers are within the bounds of their respective arrays.
        while (p1 < nums1.size() && p2 < nums2.size()) {
            // If the elements at the current pointers are equal, we've found a common element.
            // Since the arrays are sorted, this must be the minimum common element.
            if (nums1[p1] == nums2[p2]) {
                return nums1[p1];
            }
            // If the element in nums1 is smaller, increment p1 to move to the next element in nums1.
            // This is because nums1[p1] cannot be the common element if it's smaller than nums2[p2].
            else if (nums1[p1] < nums2[p2]) {
                p1++;
            }
            // If the element in nums2 is smaller, increment p2 to move to the next element in nums2.
            // This is because nums2[p2] cannot be the common element if it's smaller than nums1[p1].
            else { // nums1[p1] > nums2[p2]
                p2++;
            }
        }

        // If the loop completes without finding a common element, it means no common element exists.
        // Return -1 as per the problem statement.
        return -1;
    }
};
```