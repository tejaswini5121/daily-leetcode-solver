/**
 * @summary Calculates the maximum number of jumps to reach the last index in an array.
 * Jumps are restricted by the difference between array elements and a given target value.
 * @link https://leetcode.com/problems/maximum-number-of-jumps-to-reach-the-last-index/
 * @approach This problem can be solved using dynamic programming. We define dp[i] as the maximum number of jumps to reach index i.
 * The base case is dp[0] = 0, as we start at index 0 with 0 jumps.
 * For each index i from 1 to n-1, we iterate through all previous indices j (0 <= j < i).
 * If a jump from index j to index i is valid (i.e., -target <= nums[i] - nums[j] <= target),
 * and if index j is reachable (dp[j] != -1), we can potentially reach index i from index j.
 * We update dp[i] with the maximum of its current value and dp[j] + 1.
 * If after checking all possible previous indices, dp[i] remains -1, it means index i is unreachable.
 * Finally, dp[n-1] will contain the maximum number of jumps to reach the last index, or -1 if unreachable.
 *
 * Time Complexity: O(n^2) where n is the length of the nums array.
 * The outer loop iterates from i = 1 to n-1, and the inner loop iterates from j = 0 to i-1.
 *
 * Space Complexity: O(n) where n is the length of the nums array.
 * We use a DP array of size n to store the maximum jumps to reach each index.
 */
const maximumJumps = (nums, target) => {
    const n = nums.length;
    // dp[i] will store the maximum number of jumps to reach index i.
    // Initialize all dp values to -1, indicating that indices are unreachable by default.
    const dp = new Array(n).fill(-1);
    // Base case: We start at index 0 with 0 jumps.
    dp[0] = 0;

    // Iterate through each index from 1 to n-1 to calculate the maximum jumps to reach it.
    for (let i = 1; i < n; i++) {
        // For each index i, iterate through all previous indices j.
        for (let j = 0; j < i; j++) {
            // Check if index j is reachable (dp[j] is not -1).
            // Also, check if a jump from index j to index i is valid according to the target condition.
            if (dp[j] !== -1 && Math.abs(nums[i] - nums[j]) <= target) {
                // If a jump is valid and index j is reachable, we can potentially reach index i from j.
                // Update dp[i] with the maximum number of jumps.
                // This is either the current dp[i] value or the jumps to reach j plus one more jump.
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }

    // The result is the maximum number of jumps to reach the last index (n-1).
    // If dp[n-1] is still -1, it means the last index is unreachable.
    return dp[n - 1];
};
```