/**
 * @fileoverview LeetCode problem "Stone Game III".
 * Problem Summary: Alice and Bob play a game taking stones from a row. Each turn, a player can take 1, 2, or 3 stones from the beginning of the row. The player with the highest score wins. Alice goes first. Both play optimally.
 * Link: https://leetcode.com/problems/stone-game-iii/
 *
 * Approach:
 * This problem can be solved using dynamic programming. We are looking for the maximum score difference a player can achieve given the remaining stones.
 * Let dp[i] represent the maximum score difference the current player can achieve if the game starts with stones from index `i` to the end.
 *
 * The total sum of stones from index `i` to the end is `suffixSum[i]`.
 * If the current player takes `k` stones (where `k` is 1, 2, or 3), they gain `stones[i] + ... + stones[i+k-1]`.
 * The remaining stones start from index `i+k`. The *next* player will then play optimally on `stones[i+k:]`.
 * The score difference for the current player, if they take `k` stones, will be:
 * (sum of stones taken by current player) - (maximum score difference the *next* player can achieve from `stones[i+k:]`)
 *
 * So, for `dp[i]`, the current player will choose `k` (1, 2, or 3) to maximize their score difference:
 * `dp[i] = max(
 *     (stones[i] - dp[i+1]),  // take 1 stone
 *     (stones[i] + stones[i+1] - dp[i+2]), // take 2 stones
 *     (stones[i] + stones[i+1] + stones[i+2] - dp[i+3]) // take 3 stones
 * )`
 *
 * Base cases:
 * If `i` is beyond the array length, `dp[i]` should be 0, as there are no stones left.
 *
 * We iterate backwards from the end of the array to compute `dp` values.
 * `dp[n]` (where `n` is `stoneValue.length`) will be 0.
 * `dp[n-1]`: The player can only take 1 stone. `dp[n-1] = stones[n-1] - dp[n] = stones[n-1]`.
 * `dp[n-2]`: The player can take 1 or 2 stones.
 *   - Take 1: `stones[n-2] - dp[n-1]`
 *   - Take 2: `stones[n-2] + stones[n-1] - dp[n]`
 *   `dp[n-2] = max(stones[n-2] - dp[n-1], stones[n-2] + stones[n-1])`
 *
 * To handle boundary conditions for `dp[i+1]`, `dp[i+2]`, `dp[i+3]`, we can pad the `dp` array or use conditional checks. A simpler approach is to use a `suffixSum` array.
 * Let `suffixSum[i]` be the sum of `stoneValue[i:]`.
 * The sum of stones taken if we take `k` stones from index `i` is `suffixSum[i] - suffixSum[i+k]`.
 *
 * So, the recurrence becomes:
 * `dp[i] = max(
 *     (suffixSum[i] - suffixSum[i+1]) - dp[i+1], // take 1 stone
 *     (suffixSum[i] - suffixSum[i+2]) - dp[i+2], // take 2 stones
 *     (suffixSum[i] - suffixSum[i+3]) - dp[i+3]  // take 3 stones
 * )`
 *
 * Where `suffixSum[n] = 0`, `suffixSum[n+1] = 0`, `suffixSum[n+2] = 0`.
 * And `dp[n] = 0`, `dp[n+1] = 0`, `dp[n+2] = 0`, `dp[n+3] = 0`.
 *
 * We need to calculate `dp[0]`.
 * If `dp[0] > 0`, Alice wins.
 * If `dp[0] < 0`, Bob wins.
 * If `dp[0] == 0`, it's a tie.
 *
 * Time Complexity Analysis:
 * We iterate through the `stoneValue` array once to compute `suffixSum` (O(n)).
 * We then iterate backwards from `n-1` down to 0 to compute the `dp` array (O(n)).
 * Each `dp` computation takes constant time (max of 3 options).
 * Thus, the overall time complexity is O(n), where n is the number of stones.
 *
 * Space Complexity Analysis:
 * We use a `suffixSum` array of size n+1 (O(n)).
 * We use a `dp` array of size n+4 (to handle boundary cases easily) (O(n)).
 * Thus, the overall space complexity is O(n), where n is the number of stones.
 */

/**
 * @param {number[]} stoneValue
 * @return {string}
 */
var stoneGameIII = function(stoneValue) {
    const n = stoneValue.length;

    // suffixSum[i] stores the sum of stones from index i to the end.
    // We use n+1 length for suffixSum so suffixSum[n] is 0, representing sum from an empty subarray.
    const suffixSum = new Array(n + 1).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        suffixSum[i] = suffixSum[i + 1] + stoneValue[i];
    }

    // dp[i] stores the maximum score difference the current player can achieve
    // if the game starts with stones from index i to the end.
    // We use n+4 length for dp to easily handle cases where i+1, i+2, or i+3 go out of bounds.
    // dp[n], dp[n+1], dp[n+2], dp[n+3] are initialized to 0, as there are no stones left.
    const dp = new Array(n + 4).fill(0);

    // Iterate backwards from the end of the array to compute dp values.
    // dp[i] depends on dp[i+1], dp[i+2], dp[i+3].
    for (let i = n - 1; i >= 0; i--) {
        // The current player can take 1, 2, or 3 stones.
        // For each option, we calculate the score difference:
        // (sum of stones taken) - (max score difference the next player can get from remaining stones)

        let maxDiff = -Infinity; // Initialize with a very small number

        // Option 1: Take 1 stone
        // The sum of stones taken is stoneValue[i].
        // The next player plays on stones from index i+1.
        // The score difference is (stoneValue[i]) - dp[i+1].
        // Or using suffix sums: (suffixSum[i] - suffixSum[i+1]) - dp[i+1]
        maxDiff = Math.max(maxDiff, (suffixSum[i] - suffixSum[i + 1]) - dp[i + 1]);

        // Option 2: Take 2 stones (if possible, i.e., i+1 < n)
        if (i + 1 < n) {
            // The sum of stones taken is stoneValue[i] + stoneValue[i+1].
            // The next player plays on stones from index i+2.
            // The score difference is (stoneValue[i] + stoneValue[i+1]) - dp[i+2].
            // Or using suffix sums: (suffixSum[i] - suffixSum[i+2]) - dp[i+2]
            maxDiff = Math.max(maxDiff, (suffixSum[i] - suffixSum[i + 2]) - dp[i + 2]);
        }

        // Option 3: Take 3 stones (if possible, i.e., i+2 < n)
        if (i + 2 < n) {
            // The sum of stones taken is stoneValue[i] + stoneValue[i+1] + stoneValue[i+2].
            // The next player plays on stones from index i+3.
            // The score difference is (stoneValue[i] + stoneValue[i+1] + stoneValue[i+2]) - dp[i+3].
            // Or using suffix sums: (suffixSum[i] - suffixSum[i+3]) - dp[i+3]
            maxDiff = Math.max(maxDiff, (suffixSum[i] - suffixSum[i + 3]) - dp[i + 3]);
        }

        dp[i] = maxDiff;
    }

    // dp[0] represents the maximum score difference Alice can achieve starting the game.
    const aliceScoreDifference = dp[0];

    if (aliceScoreDifference > 0) {
        return "Alice";
    } else if (aliceScoreDifference < 0) {
        return "Bob";
    } else {
        return "Tie";
    }
};
```