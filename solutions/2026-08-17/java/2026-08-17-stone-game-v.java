// /**
//  * Problem Summary: Alice and Bob play a game with stones. Alice divides a row of stones into two non-empty parts. Bob removes the part with the larger sum, and Alice gets the sum of the remaining part. The game continues until only one stone is left. Alice wants to maximize her score.
//  * Link: https://leetcode.com/problems/stone-game-v/
//  *
//  * Approach:
//  * This problem can be solved using dynamic programming. Let dp[i][j] represent the maximum score Alice can obtain from the subarray of stones from index i to j (inclusive).
//  *
//  * To calculate dp[i][j], Alice can make a split at any point k between i and j-1. This divides the stones into two subarrays: [i, k] and [k+1, j].
//  *
//  * The sum of the left subarray is `prefixSum[k+1] - prefixSum[i]`.
//  * The sum of the right subarray is `prefixSum[j+1] - prefixSum[k+1]`.
//  *
//  * Bob will discard the subarray with the larger sum. Alice gets the sum of the remaining subarray plus the maximum score she can get from that remaining subarray in future rounds.
//  *
//  * If `sum(i, k) < sum(k+1, j)`: Bob discards the right part. Alice gets `sum(i, k) + dp[i][k]`.
//  * If `sum(i, k) > sum(k+1, j)`: Bob discards the left part. Alice gets `sum(k+1, j) + dp[k+1][j]`.
//  * If `sum(i, k) == sum(k+1, j)`: Alice can choose which part to discard. She will choose the split that maximizes her score. So, Alice gets `max(sum(i, k) + dp[i][k], sum(k+1, j) + dp[k+1][j])`.
//  *
//  * The base case is when `i == j`, meaning there's only one stone. In this case, Alice's score is 0, so `dp[i][i] = 0`.
//  *
//  * We iterate through all possible subarray lengths (len) from 2 to n, and for each length, we iterate through all possible starting indices (i). The ending index j is then `i + len - 1`.
//  *
//  * We need to precompute prefix sums to efficiently calculate subarray sums. `prefixSum[x]` will store the sum of `stoneValue[0]` to `stoneValue[x-1]`.
//  *
//  * Time Complexity: O(n^3), where n is the number of stones. The three nested loops are for length, starting index, and splitting point.
//  * Space Complexity: O(n^2) for the DP table and O(n) for the prefix sum array.
//  */
class Solution {
    public int stoneGameV(int[] stoneValue) {
        int n = stoneValue.length;

        // prefixSum[i] will store the sum of stoneValue[0] to stoneValue[i-1]
        // prefixSum[0] = 0
        // prefixSum[i] = stoneValue[0] + ... + stoneValue[i-1]
        int[] prefixSum = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefixSum[i + 1] = prefixSum[i] + stoneValue[i];
        }

        // dp[i][j] will store the maximum score Alice can get from stones[i...j]
        // The DP table is initialized with 0s, which correctly handles the base cases where len = 1 (single stone).
        int[][] dp = new int[n][n];

        // Iterate over all possible lengths of subarrays, from 2 up to n
        for (int len = 2; len <= n; len++) {
            // Iterate over all possible starting indices for subarrays of current length
            for (int i = 0; i <= n - len; i++) {
                // Calculate the ending index of the subarray
                int j = i + len - 1;

                // Iterate over all possible split points k within the subarray [i, j]
                // k represents the index where Alice splits the row.
                // The left part is [i, k], and the right part is [k+1, j].
                for (int k = i; k < j; k++) {
                    // Calculate the sum of the left subarray [i, k]
                    // sumLeft = stoneValue[i] + ... + stoneValue[k]
                    int sumLeft = prefixSum[k + 1] - prefixSum[i];

                    // Calculate the sum of the right subarray [k+1, j]
                    // sumRight = stoneValue[k+1] + ... + stoneValue[j]
                    int sumRight = prefixSum[j + 1] - prefixSum[k + 1];

                    // If sum of left part is less than sum of right part
                    if (sumLeft < sumRight) {
                        // Bob throws away the right part. Alice gets sumLeft and the max score from the remaining left part.
                        // The score from the left part is dp[i][k] because Alice will play optimally on that subarray.
                        dp[i][j] = Math.max(dp[i][j], sumLeft + dp[i][k]);
                    }
                    // If sum of left part is greater than sum of right part
                    else if (sumLeft > sumRight) {
                        // Bob throws away the left part. Alice gets sumRight and the max score from the remaining right part.
                        // The score from the right part is dp[k+1][j] because Alice will play optimally on that subarray.
                        dp[i][j] = Math.max(dp[i][j], sumRight + dp[k + 1][j]);
                    }
                    // If sums are equal, Alice can choose which part to discard to maximize her score.
                    else {
                        // Alice gets the sum of one of the parts (they are equal) and the max score from the remaining part.
                        // She will choose the split that gives her a better outcome.
                        dp[i][j] = Math.max(dp[i][j], Math.max(sumLeft + dp[i][k], sumRight + dp[k + 1][j]));
                    }
                }
            }
        }

        // The final answer is the maximum score Alice can obtain from the entire row of stones [0, n-1].
        return dp[0][n - 1];
    }
}