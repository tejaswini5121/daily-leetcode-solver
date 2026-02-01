```java
// Problem: Divide an Array Into Subarrays With Minimum Cost I
// Link: https://leetcode.com/problems/divide-an-array-into-subarrays-with-minimum-cost-i/
//
// Approach:
// The problem asks us to divide an array into three contiguous subarrays and minimize the sum of the costs of these subarrays.
// The cost of a subarray is defined as its first element.
// Since the array length 'n' is small (up to 50), we can iterate through all possible ways to split the array into three subarrays.
// A split into three subarrays requires two division points.
// Let the first division point be 'i' and the second be 'j'.
// The first subarray will be nums[0...i-1]. Its cost is nums[0].
// The second subarray will be nums[i...j-1]. Its cost is nums[i].
// The third subarray will be nums[j...n-1]. Its cost is nums[j].
//
// We need to choose indices 'i' and 'j' such that:
// 1. The first subarray is non-empty, so 1 <= i.
// 2. The second subarray is non-empty, so i <= j.
// 3. The third subarray is non-empty, so j <= n-1.
//
// Combining these, we need to pick 'i' and 'j' such that:
// 1 <= i < j <= n-1.
//
// The first subarray will be from index 0 to i-1. Its cost is nums[0].
// The second subarray will be from index i to j-1. Its cost is nums[i].
// The third subarray will be from index j to n-1. Its cost is nums[j].
//
// The total cost for a split at indices 'i' and 'j' would be nums[0] + nums[i] + nums[j].
// We can iterate through all possible values of 'i' and 'j' that satisfy the conditions and find the minimum sum.
//
// The outer loop for 'i' will go from 1 to n-2 (because 'j' must be at least i+1, and 'j' can be at most n-1).
// The inner loop for 'j' will go from i+1 to n-1.
//
// Initialize a variable `minCost` to a very large value.
// Iterate 'i' from 1 to n-2.
//   Iterate 'j' from i+1 to n-1.
//     Calculate the current cost: nums[0] + nums[i] + nums[j].
//     Update `minCost = Math.min(minCost, currentCost)`.
//
// Finally, return `minCost`.
//
// Time Complexity:
// The nested loops iterate through possible split points.
// The outer loop for 'i' runs approximately n times.
// The inner loop for 'j' runs approximately n times.
// Therefore, the time complexity is O(n^2). Given n <= 50, this is efficient enough.
//
// Space Complexity:
// We are only using a few variables to store indices and the minimum cost.
// Therefore, the space complexity is O(1).

class Solution {
    public int minimumCost(int[] nums) {
        // Get the length of the input array.
        int n = nums.length;

        // Initialize the minimum cost to a very large value.
        // This ensures that the first calculated cost will be smaller and update minCost.
        int minCost = Integer.MAX_VALUE;

        // Iterate through all possible starting indices for the second subarray.
        // 'i' represents the start index of the second subarray.
        // The first subarray is nums[0...i-1]. Its cost is nums[0].
        // 'i' must be at least 1 (to make the first subarray non-empty).
        // 'i' must be at most n-2 (to leave at least one element for the third subarray).
        for (int i = 1; i < n - 1; i++) {
            // Iterate through all possible starting indices for the third subarray.
            // 'j' represents the start index of the third subarray.
            // The second subarray is nums[i...j-1]. Its cost is nums[i].
            // 'j' must be at least i+1 (to make the second subarray non-empty).
            // 'j' must be at most n-1 (to make the third subarray non-empty).
            for (int j = i + 1; j < n; j++) {
                // Calculate the current cost for this split.
                // The cost is the sum of the first elements of the three subarrays:
                // - First subarray: nums[0]
                // - Second subarray: nums[i]
                // - Third subarray: nums[j]
                int currentCost = nums[0] + nums[i] + nums[j];

                // Update the minimum cost if the current cost is smaller.
                minCost = Math.min(minCost, currentCost);
            }
        }

        // Return the overall minimum cost found.
        return minCost;
    }
}
```