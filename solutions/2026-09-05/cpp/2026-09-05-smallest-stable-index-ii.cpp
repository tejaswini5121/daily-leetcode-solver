// Problem: Smallest Stable Index II
// Link: https://leetcode.com/problems/smallest-stable-index-ii/
//
// Approach:
// We need to find the smallest index `i` where `max(nums[0..i]) - min(nums[i..n-1]) <= k`.
// To efficiently calculate `max(nums[0..i])` and `min(nums[i..n-1])` for each `i`, we can use precomputation.
//
// 1. Precompute prefix maximums:
//    Create an array `prefixMax` where `prefixMax[i]` stores the maximum value in `nums[0..i]`.
//    `prefixMax[i] = max(prefixMax[i-1], nums[i])` for `i > 0`, and `prefixMax[0] = nums[0]`.
//
// 2. Precompute suffix minimums:
//    Create an array `suffixMin` where `suffixMin[i]` stores the minimum value in `nums[i..n-1]`.
//    `suffixMin[i] = min(suffixMin[i+1], nums[i])` for `i < n-1`, and `suffixMin[n-1] = nums[n-1]`.
//
// 3. Iterate and check:
//    Iterate through the array from `i = 0` to `n-1`.
//    For each index `i`, calculate the instability score: `instabilityScore = prefixMax[i] - suffixMin[i]`.
//    If `instabilityScore <= k`, then `i` is a stable index. Since we are iterating from the smallest index,
//    the first stable index we find will be the smallest stable index. Return `i`.
//
// 4. No stable index:
//    If the loop completes without finding any stable index, return -1.
//
// Time Complexity:
// - Precomputing prefix maximums: O(n)
// - Precomputing suffix minimums: O(n)
// - Iterating and checking: O(n)
// Total time complexity: O(n)
//
// Space Complexity:
// - `prefixMax` array: O(n)
// - `suffixMin` array: O(n)
// Total space complexity: O(n)

#include <vector>
#include <algorithm>

class Solution {
public:
    int smallestStableIndex(std::vector<int>& nums, int k) {
        int n = nums.size();

        // Handle edge case for an empty array, though constraints say n >= 1
        if (n == 0) {
            return -1;
        }

        // 1. Precompute prefix maximums
        std::vector<int> prefixMax(n);
        prefixMax[0] = nums[0];
        for (int i = 1; i < n; ++i) {
            prefixMax[i] = std::max(prefixMax[i - 1], nums[i]);
        }

        // 2. Precompute suffix minimums
        std::vector<int> suffixMin(n);
        suffixMin[n - 1] = nums[n - 1];
        for (int i = n - 2; i >= 0; --i) {
            suffixMin[i] = std::min(suffixMin[i + 1], nums[i]);
        }

        // 3. Iterate and check for the smallest stable index
        for (int i = 0; i < n; ++i) {
            // Calculate instability score for index i
            // instabilityScore = max(nums[0..i]) - min(nums[i..n-1])
            int instabilityScore = prefixMax[i] - suffixMin[i];

            // Check if the instability score is less than or equal to k
            if (instabilityScore <= k) {
                // If it is, this is the smallest stable index because we are iterating from the beginning
                return i;
            }
        }

        // 4. If no stable index is found after checking all indices
        return -1;
    }
};
```