/**
 * @param {number[]} stoneValue
 * @return {number}
 */
// Problem: Stone Game V
// Link: https://leetcode.com/problems/stone-game-v/
// Approach: This problem can be solved using dynamic programming.
// We define dp[i][j] as the maximum score Alice can obtain from the subarray stoneValue[i...j].
// To calculate dp[i][j], Alice can split the subarray stoneValue[i...j] into two non-empty subarrays:
// stoneValue[i...k] and stoneValue[k+1...j], where i <= k < j.
// Let S be the prefix sum array where S[x] = sum(stoneValue[0...x-1]).
// The sum of stoneValue[i...k] is S[k+1] - S[i].
// The sum of stoneValue[k+1...j] is S[j+1] - S[k+1].
//
// If sum(stoneValue[i...k]) < sum(stoneValue[k+1...j]):
// Bob throws away the right part, Alice gets the left part. Her score is (S[k+1] - S[i]) + dp[k+1][j].
// If sum(stoneValue[i...k]) > sum(stoneValue[k+1...j]):
// Bob throws away the left part, Alice gets the right part. Her score is (S[j+1] - S[k+1]) + dp[i][k].
// If sum(stoneValue[i...k]) == sum(stoneValue[k+1...j]):
// Alice can choose which part to keep. She will choose the one that maximizes her score.
// Her score is max( (S[k+1] - S[i]) + dp[k+1][j], (S[j+1] - S[k+1]) + dp[i][k] ).
//
// Alice wants to maximize her score, so dp[i][j] will be the maximum over all possible split points k.
// The base case is when the subarray has only one element (length 1). In this case, no game can be played,
// and Alice's score is 0. So, dp[i][i] = 0 for all i.
//
// We iterate through subarray lengths (len) from 2 to n. For each length, we iterate through all possible start indices (i).
// The end index (j) is determined by j = i + len - 1.
//
// Time Complexity: O(n^3), where n is the number of stones.
//   - The outer loops iterate through lengths (n) and start indices (n).
//   - The inner loop iterates through split points (n).
//   - Calculating sums using prefix sums takes O(1).
// Space Complexity: O(n^2) for the DP table.
const stoneGameV = (stoneValue) => {
    const n = stoneValue.length;

    // If there's only one stone, Alice cannot make any moves, so her score is 0.
    if (n === 1) {
        return 0;
    }

    // Calculate prefix sums to efficiently get the sum of any subarray.
    // prefixSum[i] will store the sum of stoneValue[0]...stoneValue[i-1].
    // prefixSum[0] = 0.
    const prefixSum = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefixSum[i + 1] = prefixSum[i] + stoneValue[i];
    }

    // dp[i][j] will store the maximum score Alice can get from the subarray stoneValue[i...j].
    // Initialize with 0s. The base case dp[i][i] = 0 is implicitly handled.
    const dp = Array(n).fill(0).map(() => Array(n).fill(0));

    // Iterate through subarray lengths, from 2 up to n.
    for (let len = 2; len <= n; len++) {
        // Iterate through all possible starting indices for subarrays of current length.
        for (let i = 0; i <= n - len; i++) {
            // Calculate the ending index for the current subarray.
            const j = i + len - 1;

            // For each subarray stoneValue[i...j], iterate through all possible split points 'k'.
            // Alice splits into stoneValue[i...k] and stoneValue[k+1...j].
            for (let k = i; k < j; k++) {
                // Calculate the sum of the left part (stoneValue[i...k]).
                const leftSum = prefixSum[k + 1] - prefixSum[i];
                // Calculate the sum of the right part (stoneValue[k+1...j]).
                const rightSum = prefixSum[j + 1] - prefixSum[k + 1];

                let currentScore = 0;
                if (leftSum < rightSum) {
                    // Bob throws away the right part. Alice gets the left part's value
                    // plus the maximum score she can get from the remaining right part (dp[k+1][j]).
                    currentScore = leftSum + dp[k + 1][j];
                } else if (leftSum > rightSum) {
                    // Bob throws away the left part. Alice gets the right part's value
                    // plus the maximum score she can get from the remaining left part (dp[i][k]).
                    currentScore = rightSum + dp[i][k];
                } else {
                    // If sums are equal, Alice chooses the split that maximizes her score.
                    // She can either take the left part and play on the right,
                    // or take the right part and play on the left.
                    currentScore = Math.max(leftSum + dp[k + 1][j], rightSum + dp[i][k]);
                }

                // Update dp[i][j] with the maximum score found so far for this subarray.
                dp[i][j] = Math.max(dp[i][j], currentScore);
            }
        }
    }

    // The final answer is the maximum score Alice can get from the entire array stoneValue[0...n-1].
    return dp[0][n - 1];
};
```