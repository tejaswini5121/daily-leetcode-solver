/**
 * @file LeetCode Problem: Smallest Stable Index II
 * @brief Given an array nums and an integer k, find the smallest index i such that max(nums[0..i]) - min(nums[i..n-1]) <= k.
 * @link https://leetcode.com/problems/smallest-stable-index-ii/
 * @approach
 * The problem asks us to find the smallest index `i` where the difference between the maximum element in the prefix `nums[0..i]` and the minimum element in the suffix `nums[i..n-1]` is less than or equal to `k`.
 *
 * To efficiently calculate `max(nums[0..i])` for all `i`, we can use a prefix maximum array. Let `prefixMax[i]` store the maximum value in `nums[0..i]`. This can be computed in O(n) time: `prefixMax[i] = max(prefixMax[i-1], nums[i])`.
 *
 * Similarly, to efficiently calculate `min(nums[i..n-1])` for all `i`, we can use a suffix minimum array. Let `suffixMin[i]` store the minimum value in `nums[i..n-1]`. This can be computed in O(n) time by iterating backward: `suffixMin[i] = min(suffixMin[i+1], nums[i])`.
 *
 * Once we have these two arrays, we can iterate through the array from index `0` to `n-1`. For each index `i`, we calculate its instability score as `prefixMax[i] - suffixMin[i]`. If this score is less than or equal to `k`, then `i` is a stable index. Since we are looking for the *smallest* stable index, the first `i` that satisfies this condition is our answer.
 *
 * If we iterate through all indices and don't find any stable index, we return -1.
 *
 * Time Complexity: O(n) because we perform three passes over the array: one for prefix maximum, one for suffix minimum, and one for checking the instability score.
 * Space Complexity: O(n) to store the `prefixMax` and `suffixMin` arrays.
 */
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var smallestStableIndex = function(nums, k) {
    const n = nums.length;

    // Handle edge case of an empty array, though constraints say n >= 1.
    if (n === 0) {
        return -1;
    }

    // 1. Compute the prefix maximum array.
    // prefixMax[i] will store the maximum value in nums[0...i].
    const prefixMax = new Array(n);
    prefixMax[0] = nums[0];
    for (let i = 1; i < n; i++) {
        prefixMax[i] = Math.max(prefixMax[i - 1], nums[i]);
    }

    // 2. Compute the suffix minimum array.
    // suffixMin[i] will store the minimum value in nums[i...n-1].
    const suffixMin = new Array(n);
    suffixMin[n - 1] = nums[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        suffixMin[i] = Math.min(suffixMin[i + 1], nums[i]);
    }

    // 3. Iterate through the array to find the smallest stable index.
    // An index i is stable if prefixMax[i] - suffixMin[i] <= k.
    for (let i = 0; i < n; i++) {
        const instabilityScore = prefixMax[i] - suffixMin[i];
        if (instabilityScore <= k) {
            // Found the smallest stable index.
            return i;
        }
    }

    // If no stable index is found after checking all indices.
    return -1;
};
```