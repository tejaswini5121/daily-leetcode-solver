```java
/**
 * Problem: Maximum Number of Jumps to Reach the Last Index
 * LeetCode Link: https://leetcode.com/problems/maximum-number-of-jumps-to-reach-the-last-index/
 *
 * Approach:
 * This problem can be solved using dynamic programming. We want to find the maximum number of jumps to reach each index.
 * Let dp[i] be the maximum number of jumps to reach index i.
 * Initialize dp array with a value indicating that an index is unreachable (e.g., -1 or negative infinity).
 * dp[0] = 0, as we start at index 0 with 0 jumps.
 *
 * Iterate from index i = 0 to n-1. For each index i, if dp[i] is reachable (not -1):
 *   Iterate from index j = i + 1 to n-1.
 *   Check if a jump from i to j is valid:
 *     -target <= nums[j] - nums[i] <= target
 *   If the jump is valid, update dp[j] = max(dp[j], dp[i] + 1). This means if we can reach j from i,
 *   the number of jumps to reach j could be one more than the number of jumps to reach i.
 *
 * The final answer will be dp[n-1]. If dp[n-1] is still -1, it means the last index is unreachable.
 *
 * Time Complexity: O(n^2)
 * We have two nested loops. The outer loop iterates from 0 to n-1, and the inner loop iterates from i+1 to n-1.
 *
 * Space Complexity: O(n)
 * We use a DP array of size n to store the maximum number of jumps to reach each index.
 */
class Solution {
    public int maximumJumps(int[] nums, int target) {
        int n = nums.length;
        // dp[i] will store the maximum number of jumps to reach index i.
        // Initialize with -1 to indicate that the index is unreachable.
        int[] dp = new int[n];
        // Initialize all elements to -1, except for the first element.
        for (int i = 0; i < n; i++) {
            dp[i] = -1;
        }

        // We start at index 0 with 0 jumps.
        dp[0] = 0;

        // Iterate through each index i.
        for (int i = 0; i < n; i++) {
            // If index i is reachable (i.e., dp[i] is not -1).
            if (dp[i] != -1) {
                // Iterate through all possible next indices j, starting from i + 1.
                for (int j = i + 1; j < n; j++) {
                    // Check if the jump from index i to index j is valid according to the target.
                    // The condition is: -target <= nums[j] - nums[i] <= target
                    // This can be rewritten as: nums[i] - target <= nums[j] <= nums[i] + target
                    long diff = (long) nums[j] - nums[i]; // Use long to avoid potential overflow with large numbers
                    if (diff >= -target && diff <= target) {
                        // If the jump is valid, update dp[j].
                        // The number of jumps to reach j from i is dp[i] + 1.
                        // We take the maximum because we want the maximum number of jumps to reach j.
                        dp[j] = Math.max(dp[j], dp[i] + 1);
                    }
                }
            }
        }

        // The result is the maximum number of jumps to reach the last index (n-1).
        // If dp[n-1] is still -1, it means the last index is unreachable.
        return dp[n - 1];
    }
}
```