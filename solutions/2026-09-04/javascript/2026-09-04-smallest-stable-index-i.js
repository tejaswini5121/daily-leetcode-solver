/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
// Problem Summary: Find the smallest index 'i' in an array 'nums' such that the
// difference between the maximum element from index 0 to 'i' and the minimum
// element from index 'i' to the end of the array is less than or equal to 'k'.
// Link: https://leetcode.com/problems/smallest-stable-index-i/
// Approach:
// We need to iterate through each index 'i' of the array 'nums'. For each index 'i',
// we need to calculate two values:
// 1. The maximum value in the subarray nums[0...i].
// 2. The minimum value in the subarray nums[i...n-1].
//
// To efficiently calculate these values, we can precompute prefix maximums and suffix minimums.
//
// `prefixMax[i]` will store the maximum value from `nums[0]` to `nums[i]`.
// `suffixMin[i]` will store the minimum value from `nums[i]` to `nums[n-1]`.
//
// Once we have these precomputed arrays, we can iterate through 'i' from 0 to n-1.
// For each 'i', the instability score is `prefixMax[i] - suffixMin[i]`.
// If this score is less than or equal to 'k', then 'i' is a stable index.
// Since we are looking for the *smallest* stable index, we return the first such 'i' we find.
// If no stable index is found after checking all indices, we return -1.
//
// Time Complexity:
// - Precomputing `prefixMax`: O(n)
// - Precomputing `suffixMin`: O(n)
// - Iterating to find the smallest stable index: O(n)
// Total Time Complexity: O(n)
//
// Space Complexity:
// - `prefixMax` array: O(n)
// - `suffixMin` array: O(n)
// Total Space Complexity: O(n)
var smallestStableIndex = function(nums, k) {
    const n = nums.length;

    // Handle the edge case of an empty array, although constraints say n >= 1.
    if (n === 0) {
        return -1;
    }

    // precomputedPrefixMax[i] will store the maximum value in nums[0...i]
    const precomputedPrefixMax = new Array(n);
    precomputedPrefixMax[0] = nums[0];
    for (let i = 1; i < n; i++) {
        precomputedPrefixMax[i] = Math.max(precomputedPrefixMax[i - 1], nums[i]);
    }

    // precomputedSuffixMin[i] will store the minimum value in nums[i...n-1]
    const precomputedSuffixMin = new Array(n);
    precomputedSuffixMin[n - 1] = nums[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        precomputedSuffixMin[i] = Math.min(precomputedSuffixMin[i + 1], nums[i]);
    }

    // Iterate through each index to find the smallest stable index
    for (let i = 0; i < n; i++) {
        // Calculate the instability score for the current index i
        // max(nums[0..i]) is precomputedPrefixMax[i]
        // min(nums[i..n-1]) is precomputedSuffixMin[i]
        const instabilityScore = precomputedPrefixMax[i] - precomputedSuffixMin[i];

        // Check if the instability score is less than or equal to k
        if (instabilityScore <= k) {
            // If it is, this is the smallest stable index we've found so far.
            // Return it immediately as we are looking for the smallest.
            return i;
        }
    }

    // If the loop finishes without finding any stable index, return -1.
    return -1;
};
```