/**
 * Problem: Jump Game V
 * Link: https://leetcode.com/problems/jump-game-v/
 *
 * Problem Summary:
 * Given an array of integers arr and an integer d, find the maximum number of indices
 * you can visit by jumping. Jumps are allowed to indices i+x or i-x (where 0 < x <= d)
 * only if arr[i] > arr[j] and all intermediate elements between i and j are strictly smaller than arr[i].
 *
 * Approach:
 * This problem can be solved using dynamic programming with memoization.
 * For each index, we want to find the maximum number of steps we can take starting from that index.
 * Let dp[i] be the maximum number of indices reachable starting from index i.
 * The base case is when we cannot make any valid jump from index i, then dp[i] = 1 (visiting index i itself).
 *
 * To compute dp[i], we explore all possible valid jumps from index i:
 * 1. Jump to the right: For each j from i+1 to min(i+d, n-1):
 *    If arr[i] > arr[j] and all elements arr[k] (where i < k < j) are strictly less than arr[i],
 *    then we can jump from i to j. The number of steps would be 1 (for i) + dp[j].
 * 2. Jump to the left: For each j from i-1 to max(i-d, 0):
 *    If arr[i] > arr[j] and all elements arr[k] (where j < k < i) are strictly less than arr[i],
 *    then we can jump from i to j. The number of steps would be 1 (for i) + dp[j].
 *
 * The condition "arr[i] > arr[k] for all indices k between i and j" implies that we need to check
 * intermediate elements. This check can be optimized. When jumping to the right, if we encounter
 * an element arr[k] (i < k < j) such that arr[i] <= arr[k], we cannot jump beyond k from i to reach
 * any index j > k. Similarly for jumping to the left.
 *
 * To efficiently check this condition and compute dp[i], we can iterate through possible jumps.
 * For jumps to the right (i+1 to min(i+d, n-1)): we stop if arr[i] <= arr[next_index].
 * For jumps to the left (i-1 to max(i-d, 0)): we stop if arr[i] <= arr[next_index].
 *
 * We use a memoization array `memo` initialized with -1 to store the computed `dp[i]` values.
 * If `memo[i]` is not -1, we return the stored value.
 * The final answer is the maximum value in the `memo` array after computing `dp[i]` for all i.
 *
 * The `dfs` function will calculate `dp[i]`.
 *
 * Time Complexity: O(N*D), where N is the length of the array and D is the maximum jump distance.
 * For each of the N elements, we potentially iterate up to D steps in both directions.
 * Space Complexity: O(N) for the memoization array and the recursion call stack.
 */
class Solution {
    // Memoization array to store the maximum number of jumps starting from each index.
    // Initialized with -1 to indicate that the value has not been computed yet.
    int[] memo;
    // The input array.
    int[] arr;
    // The maximum jump distance.
    int d;
    // The length of the array.
    int n;

    /**
     * The main function to find the maximum number of indices that can be visited.
     * @param arr The input array of integers.
     * @param d The maximum jump distance.
     * @return The maximum number of indices that can be visited.
     */
    public int maxJumps(int[] arr, int d) {
        this.arr = arr;
        this.d = d;
        this.n = arr.length;
        // Initialize memoization array with -1.
        this.memo = new int[n];
        java.util.Arrays.fill(memo, -1);

        // Variable to store the overall maximum number of jumps.
        int max_jumps = 0;

        // Iterate through each index and compute the maximum jumps starting from it.
        for (int i = 0; i < n; i++) {
            max_jumps = Math.max(max_jumps, dfs(i));
        }

        return max_jumps;
    }

    /**
     * Depth-First Search (DFS) function to compute the maximum number of jumps
     * starting from a given index.
     * @param i The current index.
     * @return The maximum number of jumps starting from index i.
     */
    private int dfs(int i) {
        // If the result for this index is already computed, return it.
        if (memo[i] != -1) {
            return memo[i];
        }

        // Initialize the maximum jumps from the current index to 1 (visiting the current index itself).
        int max_reach = 1;

        // Explore jumps to the right.
        // Iterate from i+1 up to min(i+d, n-1).
        for (int j = i + 1; j <= Math.min(i + d, n - 1); j++) {
            // If the current element is not greater than the next element,
            // we cannot jump further right from this path due to the condition arr[i] > arr[k] for k between i and j.
            // This also implicitly checks the condition for intermediate elements if we break.
            if (arr[i] <= arr[j]) {
                break; // Cannot jump further right along this path if arr[i] <= arr[j]
            }
            // Recursively call dfs for the next index and update max_reach.
            // The number of jumps will be 1 (for the current step) + the max jumps from the next index.
            max_reach = Math.max(max_reach, 1 + dfs(j));
        }

        // Explore jumps to the left.
        // Iterate from i-1 down to max(i-d, 0).
        for (int j = i - 1; j >= Math.max(i - d, 0); j--) {
            // If the current element is not greater than the next element,
            // we cannot jump further left from this path.
            if (arr[i] <= arr[j]) {
                break; // Cannot jump further left along this path if arr[i] <= arr[j]
            }
            // Recursively call dfs for the next index and update max_reach.
            max_reach = Math.max(max_reach, 1 + dfs(j));
        }

        // Store the computed result in the memoization array before returning.
        memo[i] = max_reach;
        return max_reach;
    }
}
