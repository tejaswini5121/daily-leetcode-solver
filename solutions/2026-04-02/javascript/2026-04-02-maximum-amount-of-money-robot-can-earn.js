// Summary: Find the maximum profit a robot can earn moving from top-left to bottom-right in a grid,
// with the ability to neutralize up to two negative coin values (robbers).
// Link: https://leetcode.com/problems/maximum-amount-of-money-robot-can-earn/
//
// Approach:
// This problem can be solved using dynamic programming. We need to keep track of not only the maximum
// coins earned to reach a cell, but also how many robber neutralizations have been used.
//
// We'll define a 3D DP array `dp[i][j][k]`, where:
// - `i`: current row
// - `j`: current column
// - `k`: number of robber neutralizations used so far (0, 1, or 2)
//
// `dp[i][j][k]` will store the maximum coins earned to reach cell `(i, j)` using `k` neutralizations.
//
// The state transition will consider moving from `(i-1, j)` (down) or `(i, j-1)` (right).
// For each cell `coins[i][j]`:
// 1. If `coins[i][j] >= 0`:
//    - The robot gains `coins[i][j]`. The number of neutralizations `k` remains the same.
//    - `dp[i][j][k] = max(dp[i-1][j][k], dp[i][j-1][k]) + coins[i][j]`
// 2. If `coins[i][j] < 0`:
//    - This is a robber.
//    - If `k > 0` (robot has neutralizations available):
//      - The robot can choose to use a neutralization. The previous state would have used `k-1` neutralizations.
//      - `dp[i][j][k] = max(dp[i-1][j][k-1], dp[i][j-1][k-1]) + coins[i][j]` (coins[i][j] is negative)
//    - If `k == 0` (no neutralizations available):
//      - The robot cannot neutralize this robber, so they lose `abs(coins[i][j])` coins.
//      - `dp[i][j][k] = max(dp[i-1][j][k], dp[i][j-1][k]) + coins[i][j]` (coins[i][j] is negative)
//
// Initialization:
// - `dp` array should be initialized with a very small negative number (representing unreachable states or very low profit).
// - `dp[0][0][0] = coins[0][0]`
// - If `coins[0][0] < 0` and we use a neutralization:
//   - If `k=1`: `dp[0][0][1] = coins[0][0]` (assuming the initial cell can use a neutralization if it's negative)
//
// The final answer will be the maximum value in `dp[m-1][n-1][0]`, `dp[m-1][n-1][1]`, and `dp[m-1][n-1][2]`.
//
// Edge Cases:
// - The first cell (0,0) might be a robber. The robot can choose to use a neutralization on the first cell itself if needed.
// - The DP table size will be m x n x 3.
//
// Time Complexity: O(m * n * 3) which simplifies to O(m * n) because the third dimension is constant.
// Space Complexity: O(m * n * 3) which simplifies to O(m * n) for the DP table.
//
/**
 * @param {number[][]} coins
 * @return {number}
 */
var maximumMoney = function(coins) {
    const m = coins.length;
    const n = coins[0].length;

    // dp[i][j][k] stores the maximum coins earned to reach cell (i, j) using k neutralizations.
    // k can be 0, 1, or 2.
    // Initialize dp table with a very small number to represent unreachable states.
    const INF = -Infinity; // Using -Infinity to properly handle negative coin sums.
    const dp = Array(m).fill(0).map(() =>
        Array(n).fill(0).map(() =>
            Array(3).fill(INF)
        )
    );

    // Base case: Starting at (0, 0)
    const initialCoin = coins[0][0];

    // If the starting cell is not a robber, we start with its value and 0 neutralizations.
    dp[0][0][0] = initialCoin;

    // If the starting cell is a robber, we can potentially use one neutralization.
    if (initialCoin < 0) {
        // If we use one neutralization at (0,0), the score is just coins[0][0] (no robbery)
        // This state is only possible if we have at least one neutralization available.
        dp[0][0][1] = initialCoin;
    }

    // Iterate through the grid
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            // Skip the starting cell as it's already initialized
            if (i === 0 && j === 0) continue;

            const currentCoin = coins[i][j];

            // For each possible number of neutralizations used to reach (i, j)
            for (let k = 0; k <= 2; k++) {
                let fromAbove = INF;
                let fromLeft = INF;

                // Calculate score coming from the cell above (i-1, j)
                if (i > 0) {
                    // If current cell is not a robber, the number of neutralizations used (k) remains the same.
                    // If current cell is a robber and we use a neutralization (k > 0), we came from k-1 neutralizations.
                    const prevK = (currentCoin < 0 && k > 0) ? k - 1 : k;
                    if (prevK >= 0 && dp[i - 1][j][prevK] !== INF) {
                         fromAbove = dp[i - 1][j][prevK];
                    }
                }

                // Calculate score coming from the cell to the left (i, j-1)
                if (j > 0) {
                    // If current cell is not a robber, the number of neutralizations used (k) remains the same.
                    // If current cell is a robber and we use a neutralization (k > 0), we came from k-1 neutralizations.
                    const prevK = (currentCoin < 0 && k > 0) ? k - 1 : k;
                     if (prevK >= 0 && dp[i][j - 1][prevK] !== INF) {
                        fromLeft = dp[i][j - 1][prevK];
                    }
                }

                // Determine the maximum score from either path (above or left)
                const maxPrevScore = Math.max(fromAbove, fromLeft);

                // If no valid path from above or left, skip this state.
                if (maxPrevScore === INF) {
                    continue;
                }

                // Update dp[i][j][k]
                if (currentCoin >= 0) {
                    // If the current cell has positive coins, we just add it.
                    // The number of neutralizations `k` remains the same.
                    dp[i][j][k] = Math.max(dp[i][j][k], maxPrevScore + currentCoin);
                } else {
                    // If the current cell has negative coins (a robber)
                    // We can only reach this state with k neutralizations IF we had prevK = k neutralizations available from the previous step.
                    // The logic for `prevK` correctly handles this.
                    if (k > 0) { // We can afford to use a neutralization if k > 0
                        dp[i][j][k] = Math.max(dp[i][j][k], maxPrevScore + currentCoin); // currentCoin is negative
                    }
                    // If k is 0 and it's a robber, we cannot neutralize, so this path is not considered for dp[i][j][0]
                    // unless we arrived with 0 neutralizations already used and the robber is encountered.
                    // The `prevK` logic already handles this by ensuring `dp[i-1][j][0]` or `dp[i][j-1][0]` is used for `dp[i][j][0]` when encountering a robber.
                    // If `currentCoin < 0` and `k=0`, the only way to reach `dp[i][j][0]` is if `prevK` was also 0.
                    // In this case, `maxPrevScore` would be `dp[i-1][j][0]` or `dp[i][j-1][0]`, and `currentCoin` is added.
                    // This is correctly handled by the `maxPrevScore + currentCoin` if `k` allows it.
                    // The crucial part is that if currentCoin < 0 and k=0, we are trying to calculate dp[i][j][0].
                    // This would only be possible if the previous state used 0 neutralizations AND we still had 0 neutralizations to use here.
                    // The prevK calculation `const prevK = (currentCoin < 0 && k > 0) ? k - 1 : k;` ensures this:
                    // If currentCoin < 0 and k > 0, prevK = k-1.
                    // If currentCoin >= 0, prevK = k.
                    // If currentCoin < 0 and k = 0, prevK = 0.
                    // So, when currentCoin < 0, we always try to come from `prevK`. If k is 0, we must come from prevK = 0.
                    // And we add `currentCoin` which is negative.
                    // The state `dp[i][j][k]` is only updated if `k` is sufficient.
                    // The logic for `dp[i][j][k]` update `maxPrevScore + currentCoin` is correct for both >=0 and <0 coins.
                    // The key is ensuring `maxPrevScore` itself is valid and `k` is correctly managed.
                }
            }
        }
    }

    // The final answer is the maximum value among all possible neutralizations at the bottom-right corner.
    let maxProfit = INF;
    for (let k = 0; k <= 2; k++) {
        maxProfit = Math.max(maxProfit, dp[m - 1][n - 1][k]);
    }

    // If maxProfit is still INF, it means the destination is unreachable, but constraints say m,n >= 1, so this shouldn't happen.
    // However, if all paths lead to extremely negative values, it's possible. The problem implies a path always exists.
    return maxProfit;
};
```