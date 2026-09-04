```java
// Problem: Smallest Stable Index I
// Link: https://leetcode.com/problems/smallest-stable-index-i/
//
// Approach:
// The problem asks for the smallest index 'i' where the instability score is <= k.
// The instability score for an index 'i' is defined as max(nums[0..i]) - min(nums[i..n-1]).
//
// To efficiently calculate max(nums[0..i]) and min(nums[i..n-1]) for each 'i', we can use prefix and suffix arrays.
//
// 1. Prefix Maximums: Create an array `prefixMax` where `prefixMax[i]` stores the maximum value in `nums[0..i]`.
//    This can be calculated iteratively: `prefixMax[i] = max(prefixMax[i-1], nums[i])`.
//
// 2. Suffix Minimums: Create an array `suffixMin` where `suffixMin[i]` stores the minimum value in `nums[i..n-1]`.
//    This can be calculated iteratively from right to left: `suffixMin[i] = min(suffixMin[i+1], nums[i])`.
//
// 3. Iterate and Check: Iterate through the `nums` array from index 0 to n-1. For each index `i`:
//    - Calculate the instability score: `score = prefixMax[i] - suffixMin[i]`.
//    - If `score <= k`, then `i` is a stable index. Since we are iterating from the smallest index, the first such index we find is the smallest stable index. Return `i`.
//
// 4. No Stable Index: If the loop completes without finding any stable index, return -1.
//
// Time Complexity:
// - Calculating `prefixMax`: O(n)
// - Calculating `suffixMin`: O(n)
// - Iterating and checking instability scores: O(n)
// Total Time Complexity: O(n)
//
// Space Complexity:
// - `prefixMax` array: O(n)
// - `suffixMin` array: O(n)
// Total Space Complexity: O(n)

class Solution {
    public int smallestStableIndex(int[] nums, int k) {
        int n = nums.length;

        // Handle edge case of an empty array, though constraints say n >= 1.
        if (n == 0) {
            return -1;
        }

        // 1. Compute prefix maximums
        // prefixMax[i] will store the maximum value from nums[0] to nums[i]
        int[] prefixMax = new int[n];
        prefixMax[0] = nums[0];
        for (int i = 1; i < n; i++) {
            prefixMax[i] = Math.max(prefixMax[i - 1], nums[i]);
        }

        // 2. Compute suffix minimums
        // suffixMin[i] will store the minimum value from nums[i] to nums[n-1]
        int[] suffixMin = new int[n];
        suffixMin[n - 1] = nums[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            suffixMin[i] = Math.min(suffixMin[i + 1], nums[i]);
        }

        // 3. Iterate through each index to find the smallest stable index
        for (int i = 0; i < n; i++) {
            // Calculate the instability score for the current index i
            // Instability score = max(nums[0..i]) - min(nums[i..n-1])
            int instabilityScore = prefixMax[i] - suffixMin[i];

            // Check if the instability score is less than or equal to k
            if (instabilityScore <= k) {
                // If it is, this is the smallest stable index because we are iterating
                // from left to right. Return this index.
                return i;
            }
        }

        // 4. If no stable index is found after checking all indices, return -1
        return -1;
    }
}
```