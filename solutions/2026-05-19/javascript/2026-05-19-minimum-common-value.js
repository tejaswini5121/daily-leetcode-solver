// Problem Summary: Find the smallest integer present in both sorted input arrays.
// Link: https://leetcode.com/problems/minimum-common-value/
// Approach Explanation:
// Since both arrays are sorted, we can use a two-pointer approach.
// We initialize two pointers, one for each array, starting at the beginning.
// We compare the elements at the current pointers.
// If the elements are equal, we have found a common element, and since we are iterating from the smallest elements, this must be the minimum common value. We return it.
// If the element in nums1 is smaller than the element in nums2, we increment the pointer for nums1 to find a potentially larger, common element.
// If the element in nums2 is smaller than the element in nums1, we increment the pointer for nums2.
// If either pointer reaches the end of its respective array without finding a common element, it means no common element exists, so we return -1.
// Time Complexity: O(m + n), where m and n are the lengths of nums1 and nums2 respectively. In the worst case, we might iterate through both arrays once.
// Space Complexity: O(1), as we are only using a few variables for pointers.
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var minArray = function(nums1, nums2) {
    // Initialize two pointers, one for each array.
    let p1 = 0;
    let p2 = 0;

    // Iterate while both pointers are within the bounds of their respective arrays.
    while (p1 < nums1.length && p2 < nums2.length) {
        // If the elements at the current pointers are equal, we've found the minimum common value.
        if (nums1[p1] === nums2[p2]) {
            return nums1[p1]; // Return the common element.
        }
        // If the element in nums1 is smaller, advance the pointer in nums1.
        else if (nums1[p1] < nums2[p2]) {
            p1++;
        }
        // If the element in nums2 is smaller, advance the pointer in nums2.
        else {
            p2++;
        }
    }

    // If the loop finishes without finding a common element, return -1.
    return -1;
};
```