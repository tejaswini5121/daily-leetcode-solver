// Problem: Maximum Distance Between a Pair of Values
// Summary: Find the maximum distance j - i for valid pairs (i, j) where i <= j and nums1[i] <= nums2[j].
// Link: https://leetcode.com/problems/maximum-distance-between-a-pair-of-values/
//
// Approach:
// We can use a two-pointer approach. We iterate through nums1 with pointer `i` and through nums2 with pointer `j`.
// For each `i`, we want to find the largest `j` such that `i <= j` and `nums1[i] <= nums2[j]`.
// Since both arrays are non-increasing, if `nums1[i] <= nums2[j]`, then for any `k < j` and `k >= i`, `nums1[i] <= nums2[k]` will also hold if `nums2[k] >= nums1[i]`.
// To maximize `j - i`, we want to find the largest possible `j` for a given `i`.
// We can advance `j` as long as `j < nums2.length` and `nums1[i] <= nums2[j]`.
// If `nums1[i] > nums2[j]`, then for this `i`, we cannot find a valid `j` starting from the current `j` or further. We must increment `i` to try a smaller `nums1[i]`.
// We maintain a `maxDistance` variable to store the maximum valid distance found so far.
//
// Time Complexity: O(m + n), where m is the length of nums1 and n is the length of nums2.
// Each pointer `i` and `j` moves forward at most `m` and `n` times respectively.
//
// Space Complexity: O(1) because we only use a few variables for pointers and the maximum distance.
//
// Solution:
const maximumDistance = (nums1, nums2) => {
    let maxDistance = 0; // Initialize the maximum distance found so far to 0
    let i = 0; // Pointer for nums1
    let j = 0; // Pointer for nums2

    // Iterate while both pointers are within their respective array bounds
    while (i < nums1.length && j < nums2.length) {
        // Check if the current pair (i, j) is valid
        // Condition 1: i <= j (implicit by how we advance j)
        // Condition 2: nums1[i] <= nums2[j]
        if (nums1[i] <= nums2[j]) {
            // If the pair is valid, calculate the distance and update maxDistance if it's larger
            maxDistance = Math.max(maxDistance, j - i);
            // To find the largest possible j for the current i, we advance j.
            // Since nums2 is non-increasing, if nums1[i] <= nums2[j], then for any k < j where k >= i,
            // nums1[i] <= nums2[k] would also hold if nums2[k] >= nums1[i].
            // We want the LARGEST j, so we continue to advance j.
            j++;
        } else {
            // If nums1[i] > nums2[j], it means that for the current nums1[i],
            // no subsequent element in nums2 (starting from j) can satisfy nums1[i] <= nums2[k]
            // because nums2 is non-increasing.
            // Therefore, we must move to the next element in nums1 to find a potentially smaller value.
            i++;
            // Crucially, if `i` catches up to or surpasses `j`, we should also advance `j` to maintain `i <= j`.
            // This ensures we only consider valid pairs where the index in nums1 is less than or equal to the index in nums2.
            if (i > j) {
                j = i;
            }
        }
    }

    return maxDistance; // Return the maximum distance found
};
