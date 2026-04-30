// Problem: Maximum Path Score in a Grid
// Link: https://leetcode.com/problems/maximum-path-score-in-a-grid/
//
// Approach:
// This problem can be solved using dynamic programming. We need to keep track of the maximum score achievable
// for each cell (i, j) at a given cost. Since the cost can go up to k, and the dimensions of the grid can be up to 200x200,
// a direct DP state `dp[i][j][cost]` would be too large (200 * 200 * 1000).
//
// Instead, we can define `dp[i][j]` as an array (or map) where `dp[i][j][c]` stores the maximum score to reach cell (i, j)
// with a total cost of `c`.
//
// The transitions are as follows:
// To reach cell (i, j) with cost `c`, we could have come from:
// 1. Cell (i-1, j) (if i > 0)
// 2. Cell (i, j-1) (if j > 0)
//
// Let's define `score_val` and `cost_val` based on `grid[i][j]`:
// - If `grid[i][j] == 0`: `score_val = 0`, `cost_val = 0`
// - If `grid[i][j] == 1`: `score_val = 1`, `cost_val = 1`
// - If `grid[i][j] == 2`: `score_val = 2`, `cost_val = 1`
//
// For a cell (i, j) and a cost `c`, the maximum score `dp[i][j][c]` is updated by considering paths from (i-1, j) and (i, j-1):
//
// If coming from (i-1, j) with cost `prev_cost` and score `prev_score`:
//   The new cost to reach (i, j) would be `prev_cost + cost_val`.
//   The new score would be `prev_score + score_val`.
//   We update `dp[i][j][prev_cost + cost_val] = max(dp[i][j][prev_cost + cost_val], prev_score + score_val)`.
//
// Similarly, if coming from (i, j-1) with cost `prev_cost` and score `prev_score`:
//   The new cost to reach (i, j) would be `prev_cost + cost_val`.
//   The new score would be `prev_score + score_val`.
//   We update `dp[i][j][prev_cost + cost_val] = max(dp[i][j][prev_cost + cost_val], prev_score + score_val)`.
//
// Base case:
// `dp[0][0][0] = 0` (assuming `grid[0][0]` is always 0 as per constraints, so initial cost and score are 0).
//
// We iterate through the grid and for each cell, iterate through all possible costs up to k.
//
// The DP table will be `dp[m][n][k+1]`. We initialize it with -1 to represent unreachable states.
//
// The final answer will be the maximum value in `dp[m-1][n-1][c]` for all `c` from 0 to `k`.
//
// Time Complexity: O(m * n * k) - We iterate through each cell (m*n) and for each cell, we iterate through all possible costs (k+1).
// Space Complexity: O(m * n * k) - For storing the DP table.
//
// Optimization:
// Since we only need the results from the previous row/column, we might be able to optimize space. However, with the cost dimension,
// it's not straightforward to reduce it to O(n*k) or O(m*k) directly without careful handling of the order of updates.
// For simplicity and clarity given the constraints, we'll stick with O(m*n*k) space.
//
// A more efficient DP state might be `dp[i][j]` storing a map of `{cost: max_score}`.
// When moving from `dp[prev_i][prev_j]` to `dp[i][j]`:
// For each `(prev_cost, prev_score)` in `dp[prev_i][prev_j]`:
//   `new_cost = prev_cost + cost_val`
//   `new_score = prev_score + score_val`
//   If `new_cost <= k`:
//     Update `dp[i][j][new_cost] = max(dp[i][j][new_cost], new_score)`
// This approach avoids iterating through all k costs if only a few costs are reachable.
//
// Let's refine the DP state to be `dp[i][j]` where `dp[i][j]` is a map or an array representing {cost: max_score}.
// We'll use an array where index represents cost.
// `dp[i][j][cost]` = max score to reach (i, j) with exactly `cost`.
//
// Initialize `dp` as a 3D array `dp[m][n][k+1]` filled with -1.
// `dp[0][0][0] = 0`
//
// Iterate `i` from 0 to `m-1`.
//   Iterate `j` from 0 to `n-1`.
//     Get `score_val`, `cost_val` for `grid[i][j]`.
//     Iterate `c` from 0 to `k`.
//       If `dp[i][j][c]` is not -1 (meaning (i, j) is reachable with cost `c`):
//         // Move down
//         If `i + 1 < m`:
//           `next_i = i + 1`
//           `next_j = j`
//           `next_cell_score_val`, `next_cell_cost_val` for `grid[next_i][next_j]`
//           `new_cost = c + next_cell_cost_val`
//           `new_score = dp[i][j][c] + next_cell_score_val`
//           If `new_cost <= k`:
//             `dp[next_i][next_j][new_cost] = max(dp[next_i][next_j][new_cost], new_score)`
//         // Move right
//         If `j + 1 < n`:
//           `next_i = i`
//           `next_j = j + 1`
//           `next_cell_score_val`, `next_cell_cost_val` for `grid[next_i][next_j]`
//           `new_cost = c + next_cell_cost_val`
//           `new_score = dp[i][j][c] + next_cell_score_val`
//           If `new_cost <= k`:
//             `dp[next_i][next_j][new_cost] = max(dp[next_i][next_j][new_cost], new_score)`
//
// This looks like we're pushing values forward. An alternative is to pull values from previous cells.
//
// Let's define `dp[i][j]` as a map `cost -> max_score`.
// `dp[i][j]` will store possible (cost, score) pairs to reach cell `(i, j)`.
//
// Initialize `dp` as a 2D array of maps. `dp[m][n]`.
// `dp[0][0] = new Map()`
// `dp[0][0].set(0, 0)` // Base case: start at (0,0) with cost 0, score 0.
//
// Iterate `i` from 0 to `m-1`.
//   Iterate `j` from 0 to `n-1`.
//     Get `current_cell_score_val`, `current_cell_cost_val` for `grid[i][j]`.
//
//     // Consider paths from above (i-1, j)
//     If `i > 0`:
//       For each `[prev_cost, prev_score]` in `dp[i-1][j].entries()`:
//         `new_cost = prev_cost + current_cell_cost_val`
//         `new_score = prev_score + current_cell_score_val`
//         If `new_cost <= k`:
//           If `!dp[i][j].has(new_cost)` or `dp[i][j].get(new_cost) < new_score`:
//             `dp[i][j].set(new_cost, new_score)`
//
//     // Consider paths from left (i, j-1)
//     If `j > 0`:
//       For each `[prev_cost, prev_score]` in `dp[i][j-1].entries()`:
//         `new_cost = prev_cost + current_cell_cost_val`
//         `new_score = prev_score + current_cell_score_val`
//         If `new_cost <= k`:
//           If `!dp[i][j].has(new_cost)` or `dp[i][j].get(new_cost) < new_score`:
//             `dp[i][j].set(new_cost, new_score)`
//
// This approach seems more manageable. The number of entries in each map `dp[i][j]` can be at most `k+1`.
//
// Final Answer:
// Iterate through `[cost, score]` in `dp[m-1][n-1].entries()`.
// Find the maximum `score`. If `dp[m-1][n-1]` is empty, return -1.
//
//
// Time Complexity: O(m * n * k) - In the worst case, each cell's map can have up to k entries, and we iterate through these entries to update the next cell's map.
// Space Complexity: O(m * n * k) - In the worst case, each cell's map can store up to k entries.
//
// Let's consider the constraint `grid[0][0] == 0`. This simplifies the base case.
//
// Data structures for DP:
// `dp[i][j]` will be an array `cost -> max_score`. So, `dp[i][j]` is an array of size `k+1`.
//
// Initialize `dp` as a 3D array `dp[m][n][k+1]` filled with -1.
//
// `dp[0][0][0] = 0`
//
// Iterate `i` from 0 to `m-1`.
//   Iterate `j` from 0 to `n-1`.
//     Get `current_cell_score_val`, `current_cell_cost_val` for `grid[i][j]`.
//
//     // From above (i-1, j)
//     If `i > 0`:
//       For `prev_cost` from 0 to `k`:
//         If `dp[i-1][j][prev_cost]` is not -1:
//           `new_cost = prev_cost + current_cell_cost_val`
//           `new_score = dp[i-1][j][prev_cost] + current_cell_score_val`
//           If `new_cost <= k`:
//             `dp[i][j][new_cost] = max(dp[i][j][new_cost], new_score)`
//
//     // From left (i, j-1)
//     If `j > 0`:
//       For `prev_cost` from 0 to `k`:
//         If `dp[i][j-1][prev_cost]` is not -1:
//           `new_cost = prev_cost + current_cell_cost_val`
//           `new_score = dp[i][j-1][prev_cost] + current_cell_score_val`
//           If `new_cost <= k`:
//             `dp[i][j][new_cost] = max(dp[i][j][new_cost], new_score)`
//
// This still seems to be the correct interpretation of DP.
// The initialization logic needs to be precise.
//
// Let's use a clearer DP state: `dp[i][j][c]` = maximum score to reach cell `(i, j)` with *exactly* cost `c`.
//
// Initialize `dp` table of size `m x n x (k+1)` with -1.
//
// `grid_scores = [[0, 1, 2], [0, 1, 1]]` (score contribution)
// `grid_costs = [[0, 1, 1], [0, 1, 1]]` (cost contribution)
//
// For cell `(i, j)`:
// `val = grid[i][j]`
// `score_contrib = (val == 1 ? 1 : (val == 2 ? 2 : 0))`
// `cost_contrib = (val == 1 ? 1 : (val == 2 ? 1 : 0))`
//
// Base case: `grid[0][0]` is always 0.
// `dp[0][0][0] = 0`
//
// Iterate through the grid:
// For `i` from 0 to `m-1`:
//   For `j` from 0 to `n-1`:
//     `score_contrib = (grid[i][j] == 1 ? 1 : (grid[i][j] == 2 ? 2 : 0))`
//     `cost_contrib = (grid[i][j] == 1 ? 1 : (grid[i][j] == 2 ? 1 : 0))`
//
//     // Update from cell above (i-1, j)
//     If `i > 0`:
//       For `prev_cost` from 0 to `k`:
//         If `dp[i-1][j][prev_cost]` != -1: // If cell (i-1, j) is reachable with `prev_cost`
//           `current_cost = prev_cost + cost_contrib`
//           `current_score = dp[i-1][j][prev_cost] + score_contrib`
//           If `current_cost <= k`:
//             `dp[i][j][current_cost] = Math.max(dp[i][j][current_cost], current_score)`
//
//     // Update from cell to the left (i, j-1)
//     If `j > 0`:
//       For `prev_cost` from 0 to `k`:
//         If `dp[i][j-1][prev_cost]` != -1: // If cell (i, j-1) is reachable with `prev_cost`
//           `current_cost = prev_cost + cost_contrib`
//           `current_score = dp[i][j-1][prev_cost] + score_contrib`
//           If `current_cost <= k`:
//             `dp[i][j][current_cost] = Math.max(dp[i][j][current_cost], current_score)`
//
// Wait, this logic is slightly off. The `score_contrib` and `cost_contrib` are for the *current* cell `(i, j)`, not the previous ones.
//
// Corrected DP State and Transition:
// `dp[i][j][c]` = maximum score to reach cell `(i, j)` with a total cost of *exactly* `c`.
//
// Initialize `dp` table `m x n x (k+1)` with -1.
//
// `dp[0][0][0] = 0` (Since `grid[0][0] == 0`, cost 0, score 0)
//
// Iterate `i` from 0 to `m-1`.
//   Iterate `j` from 0 to `n-1`.
//     // For the current cell (i, j), what are the possible ways to reach it?
//     // It can be reached from (i-1, j) or (i, j-1).
//
//     // Calculate score and cost for the current cell `grid[i][j]`
//     let cellValue = grid[i][j];
//     let scoreToAdd = 0;
//     let costToAdd = 0;
//     if (cellValue === 1) {
//         scoreToAdd = 1;
//         costToAdd = 1;
//     } else if (cellValue === 2) {
//         scoreToAdd = 2;
//         costToAdd = 1;
//     }
//
//     // If we are at (0,0), its score and cost are already set (0,0).
//     // We need to compute for cells that are NOT (0,0).
//     // If `(i, j)` is `(0,0)`, we don't do any updates from previous cells.
//     // The base case `dp[0][0][0] = 0` is correct.
//     // The logic should be: If we can reach (i-1, j) with cost `pc` and score `ps`,
//     // then we can reach (i, j) with cost `pc + costToAdd` and score `ps + scoreToAdd`.
//
//     // Iterate through all possible previous costs to reach (i, j)
//     for (let prev_cost = 0; prev_cost <= k; prev_cost++) {
//         // From cell above (i-1, j)
//         if (i > 0 && dp[i-1][j][prev_cost] !== -1) {
//             let current_cost = prev_cost + costToAdd;
//             let current_score = dp[i-1][j][prev_cost] + scoreToAdd;
//             if (current_cost <= k) {
//                 dp[i][j][current_cost] = Math.max(dp[i][j][current_cost], current_score);
//             }
//         }
//
//         // From cell to the left (i, j-1)
//         if (j > 0 && dp[i][j-1][prev_cost] !== -1) {
//             let current_cost = prev_cost + costToAdd;
//             let current_score = dp[i][j-1][prev_cost] + scoreToAdd;
//             if (current_cost <= k) {
//                 dp[i][j][current_cost] = Math.max(dp[i][j][current_cost], current_score);
//             }
//         }
//     }
//
// This still feels like we are double counting or processing the same cell multiple times incorrectly.
// Let's rethink the iteration order.
//
// The standard DP formulation for pathfinding on a grid where you can only move down or right is:
// `dp[i][j]` depends on `dp[i-1][j]` and `dp[i][j-1]`.
//
// `dp[i][j]` = max score to reach `(i, j)`.
//
// In this problem, we have the additional constraint of `k` cost.
// So `dp[i][j][c]` = max score to reach `(i, j)` with cost `c`.
//
// Initialization:
// `dp` table `m x n x (k+1)` filled with -1.
//
// `dp[0][0][0] = 0` (because `grid[0][0]` is 0, so initial cost is 0, score is 0).
//
// Iterate through `i` from 0 to `m-1`.
//   Iterate through `j` from 0 to `n-1`.
//     // For each cell (i, j), iterate through all possible costs `c` that could have led to it.
//     // These costs `c` are accumulated from previous cells.
//     // The state `dp[i][j][c]` means we arrived at `(i, j)` with *exactly* cost `c`.
//
//     // The value `grid[i][j]` adds `score_val` to score and `cost_val` to cost.
//     let cellValue = grid[i][j];
//     let score_val = 0;
//     let cost_val = 0;
//     if (cellValue === 1) {
//         score_val = 1;
//         cost_val = 1;
//     } else if (cellValue === 2) {
//         score_val = 2;
//         cost_val = 1;
//     }
//
//     // We are filling `dp[i][j]`.
//     // To reach `(i, j)` with cost `c`, we must have come from:
//     // 1. `(i-1, j)` with cost `c - cost_val` and score `dp[i-1][j][c - cost_val]`.
//     // 2. `(i, j-1)` with cost `c - cost_val` and score `dp[i][j-1][c - cost_val]`.
//
//     // This means `dp[i][j][c]` depends on previous states.
//     // Let's iterate through `c` from `cost_val` up to `k`.
//     for (let c = cost_val; c <= k; c++) {
//         let prev_cost_needed = c - cost_val;
//
//         // Try coming from above
//         if (i > 0 && dp[i-1][j][prev_cost_needed] !== -1) {
//             dp[i][j][c] = Math.max(dp[i][j][c], dp[i-1][j][prev_cost_needed] + score_val);
//         }
//
//         // Try coming from left
//         if (j > 0 && dp[i][j-1][prev_cost_needed] !== -1) {
//             dp[i][j][c] = Math.max(dp[i][j][c], dp[i][j-1][prev_cost_needed] + score_val);
//         }
//     }
//
// This approach looks correct.
//
// The grid[0][0] == 0 constraint is crucial.
// Base case: dp[0][0][0] = 0.
//
// Example Walkthrough: grid = [[0, 1],[2, 0]], k = 1
// m = 2, n = 2, k = 1
//
// dp table of size 2 x 2 x 2 (costs 0, 1). Initialize with -1.
// dp[0][0][0] = 0
//
// i = 0, j = 0: (already handled by base case)
//   cellValue = 0, score_val = 0, cost_val = 0.
//   loop c from 0 to 1:
//     c = 0: prev_cost_needed = 0.
//       i>0 is false. j>0 is false. dp[0][0][0] remains 0.
//     c = 1: prev_cost_needed = 1.
//       i>0 is false. j>0 is false. dp[0][0][1] remains -1.
//
// i = 0, j = 1:
//   cellValue = 1, score_val = 1, cost_val = 1.
//   loop c from 1 to 1:
//     c = 1: prev_cost_needed = 1 - 1 = 0.
//       From above (i-1, j) i.e., (-1, 1) is invalid.
//       From left (i, j-1) i.e., (0, 0):
//         dp[0][0][0] is 0 (not -1).
//         dp[0][1][1] = Math.max(dp[0][1][1], dp[0][0][0] + 1)
//                     = Math.max(-1, 0 + 1) = 1.
//   So, dp[0][1][0] = -1, dp[0][1][1] = 1.
//
// i = 1, j = 0:
//   cellValue = 2, score_val = 2, cost_val = 1.
//   loop c from 1 to 1:
//     c = 1: prev_cost_needed = 1 - 1 = 0.
//       From above (i-1, j) i.e., (0, 0):
//         dp[0][0][0] is 0 (not -1).
//         dp[1][0][1] = Math.max(dp[1][0][1], dp[0][0][0] + 2)
//                     = Math.max(-1, 0 + 2) = 2.
//       From left (i, j-1) i.e., (1, -1) is invalid.
//   So, dp[1][0][0] = -1, dp[1][0][1] = 2.
//
// i = 1, j = 1:
//   cellValue = 0, score_val = 0, cost_val = 0.
//   loop c from 0 to 1:
//     c = 0: prev_cost_needed = 0 - 0 = 0.
//       From above (i-1, j) i.e., (0, 1):
//         dp[0][1][0] is -1. No update.
//       From left (i, j-1) i.e., (1, 0):
//         dp[1][0][0] is -1. No update.
//       dp[1][1][0] remains -1.
//
//     c = 1: prev_cost_needed = 1 - 0 = 1.
//       From above (i-1, j) i.e., (0, 1):
//         dp[0][1][1] is 1 (not -1).
//         dp[1][1][1] = Math.max(dp[1][1][1], dp[0][1][1] + 0)
//                     = Math.max(-1, 1 + 0) = 1.
//       From left (i, j-1) i.e., (1, 0):
//         dp[1][0][1] is 2 (not -1).
//         dp[1][1][1] = Math.max(dp[1][1][1], dp[1][0][1] + 0)
//                     = Math.max(1, 2 + 0) = 2.
//   So, dp[1][1][0] = -1, dp[1][1][1] = 2.
//
// Final result: Find max in dp[m-1][n-1][c] for c from 0 to k.
// dp[1][1] has values: dp[1][1][0] = -1, dp[1][1][1] = 2.
// Maximum is 2.
// This matches Example 1.
//
// Example 2: grid = [[0, 1],[1, 2]], k = 1
// m = 2, n = 2, k = 1
//
// dp table of size 2 x 2 x 2 (costs 0, 1). Initialize with -1.
// dp[0][0][0] = 0
//
// i = 0, j = 1:
//   cellValue = 1, score_val = 1, cost_val = 1.
//   loop c from 1 to 1:
//     c = 1: prev_cost_needed = 0.
//       From left (0, 0): dp[0][0][0] = 0.
//       dp[0][1][1] = Math.max(-1, 0 + 1) = 1.
//   So, dp[0][1] = [-1, 1]
//
// i = 1, j = 0:
//   cellValue = 1, score_val = 1, cost_val = 1.
//   loop c from 1 to 1:
//     c = 1: prev_cost_needed = 0.
//       From above (0, 0): dp[0][0][0] = 0.
//       dp[1][0][1] = Math.max(-1, 0 + 1) = 1.
//   So, dp[1][0] = [-1, 1]
//
// i = 1, j = 1:
//   cellValue = 2, score_val = 2, cost_val = 1.
//   loop c from 1 to 1:
//     c = 1: prev_cost_needed = 1 - 1 = 0.
//       From above (0, 1): dp[0][1][0] = -1. No update from above.
//       From left (1, 0): dp[1][0][0] = -1. No update from left.
//       dp[1][1][1] remains -1.
//   So, dp[1][1] = [-1, -1]
//
// Final result: Find max in dp[1][1][c].
// dp[1][1][0] = -1, dp[1][1][1] = -1.
// Maximum is -1.
// This matches Example 2.
//
// The logic seems solid.
//
// Need to implement the DP table initialization.
// JavaScript doesn't have direct multi-dimensional array initialization like some other languages.
// We can use nested loops or Array.fill combined with map.
// For `dp[m][n][k+1]`, it will be an array of arrays of arrays.
//
// Let's create the DP table:
// `const dp = Array(m).fill(0).map(() => Array(n).fill(0).map(() => Array(k + 1).fill(-1)));`
//
// Then set the base case:
// `dp[0][0][0] = 0;`
//
// The loops will be:
// for (let i = 0; i < m; i++) {
//   for (let j = 0; j < n; j++) {
//     // ... calculate score_val, cost_val ...
//     for (let c = cost_val; c <= k; c++) {
//       let prev_cost_needed = c - cost_val;
//       // ... updates ...
//     }
//   }
// }
//
// Final step: find max score in dp[m-1][n-1].
// let maxScore = -1;
// for (let c = 0; c <= k; c++) {
//   maxScore = Math.max(maxScore, dp[m - 1][n - 1][c]);
// }
// return maxScore;
//
// Edge case: if m=1, n=1, the loop might behave differently.
// If m=1, n=1, the grid is [[0]]. k can be anything.
// dp[0][0][0] = 0.
// The loops for i=0, j=0 will not execute any updates from previous cells because i>0 and j>0 conditions will fail.
// The final result loop will check dp[0][0].
// dp[0][0] is [0, -1, -1, ...] (up to k)
// maxScore will be 0. This is correct.
//
// The problem states `grid[0][0] == 0`. This simplifies initialization.
// The constraints `1 <= m, n <= 200` and `0 <= k <= 10^3` mean `m*n*k` can be up to `200*200*1000 = 40,000,000`.
// This should be acceptable for time complexity.
// Space complexity is also `O(m*n*k)`. `200*200*1000 * sizeof(int)` could be large, but JavaScript numbers are typically 64-bit floats, so it's manageable.

```javascript
/**
 * @param {number[][]} grid
 * @param {number} k
 * @return {number}
 */
// Problem: Maximum Path Score in a Grid
// Link: https://leetcode.com/problems/maximum-path-score-in-a-grid/
//
// Approach:
// This problem requires finding the maximum score path from the top-left to the bottom-right corner of a grid,
// with a constraint on the total cost. We can use dynamic programming.
//
// We define a DP state `dp[i][j][c]` as the maximum score to reach cell `(i, j)` with an accumulated cost of exactly `c`.
// The dimensions of the DP table will be `m x n x (k+1)`.
//
// The base case is `dp[0][0][0] = 0`, as `grid[0][0]` is always 0, incurring no cost and giving no score.
//
// For any other cell `(i, j)`, to compute `dp[i][j][c]`, we consider paths coming from the cell above `(i-1, j)`
// and the cell to the left `(i, j-1)`.
//
// Let `score_val` and `cost_val` be the score and cost associated with the current cell `grid[i][j]`:
// - If `grid[i][j] == 0`: `score_val = 0`, `cost_val = 0`
// - If `grid[i][j] == 1`: `score_val = 1`, `cost_val = 1`
// - If `grid[i][j] == 2`: `score_val = 2`, `cost_val = 1`
//
// To reach cell `(i, j)` with a total cost `c`, we must have previously reached a cell `(prev_i, prev_j)`
// with a cost `c - cost_val`. The score at `(i, j)` would then be the score at `(prev_i, prev_j)` plus `score_val`.
//
// The transition is as follows:
// For each cell `(i, j)` from `(0, 0)` to `(m-1, n-1)`:
//   Calculate `score_val` and `cost_val` for `grid[i][j]`.
//   Iterate through all possible total costs `c` from `cost_val` to `k`.
//     Let `prev_cost = c - cost_val`. This is the cost we must have had *before* entering cell `(i, j)`.
//
//     If `i > 0` (can come from above):
//       If `dp[i-1][j][prev_cost]` is not -1 (meaning `(i-1, j)` was reachable with `prev_cost`):
//         `dp[i][j][c] = Math.max(dp[i][j][c], dp[i-1][j][prev_cost] + score_val)`
//
//     If `j > 0` (can come from left):
//       If `dp[i][j-1][prev_cost]` is not -1 (meaning `(i, j-1)` was reachable with `prev_cost`):
//         `dp[i][j][c] = Math.max(dp[i][j][c], dp[i][j-1][prev_cost] + score_val)`
//
// The base case `dp[0][0][0] = 0` needs to be handled. The loops for `i` and `j` should correctly build upon this.
//
// After filling the DP table, the maximum score achievable to reach the bottom-right corner `(m-1, n-1)`
// within the total cost `k` is the maximum value among `dp[m-1][n-1][c]` for all `c` from 0 to `k`.
// If no path is found, the maximum will remain -1.
//
// Time Complexity: O(m * n * k) - We iterate through each cell (m*n) and for each cell, we iterate through all possible costs (k+1).
// Space Complexity: O(m * n * k) - For storing the DP table.
//
const maximumPathScoreInAGrid = (grid, k) => {
    const m = grid.length;
    const n = grid[0].length;

    // Initialize DP table: dp[row][col][cost] = max_score
    // Initialize with -1 to indicate unreachable states.
    // The dimensions are m x n x (k + 1) because cost can range from 0 to k.
    const dp = Array(m).fill(0).map(() =>
        Array(n).fill(0).map(() =>
            Array(k + 1).fill(-1)
        )
    );

    // Base case: Starting at (0, 0).
    // grid[0][0] is guaranteed to be 0, so it costs 0 and scores 0.
    dp[0][0][0] = 0;

    // Iterate through each cell of the grid
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {

            // Determine the score and cost for the current cell
            let cellValue = grid[i][j];
            let score_val = 0;
            let cost_val = 0;

            if (cellValue === 1) {
                score_val = 1;
                cost_val = 1;
            } else if (cellValue === 2) {
                score_val = 2;
                cost_val = 1;
            }
            // If cellValue is 0, score_val and cost_val remain 0.

            // Iterate through all possible costs `c` to reach the current cell (i, j)
            // `c` represents the total cost to reach cell (i, j).
            // This cost `c` must be at least `cost_val` (the cost of the current cell itself).
            for (let c = cost_val; c <= k; c++) {

                // `prev_cost_needed` is the cost we must have had to reach the *previous* cell
                // (either from above or from left) to end up with a total cost `c` at the current cell.
                let prev_cost_needed = c - cost_val;

                // If we can come from the cell above (i-1, j)
                if (i > 0) {
                    // Check if the cell (i-1, j) was reachable with `prev_cost_needed`
                    if (dp[i - 1][j][prev_cost_needed] !== -1) {
                        // If reachable, update the current cell's DP state.
                        // The score is the score from the previous cell plus the score of the current cell.
                        dp[i][j][c] = Math.max(
                            dp[i][j][c],
                            dp[i - 1][j][prev_cost_needed] + score_val
                        );
                    }
                }

                // If we can come from the cell to the left (i, j-1)
                if (j > 0) {
                    // Check if the cell (i, j-1) was reachable with `prev_cost_needed`
                    if (dp[i][j - 1][prev_cost_needed] !== -1) {
                        // If reachable, update the current cell's DP state.
                        // The score is the score from the previous cell plus the score of the current cell.
                        dp[i][j][c] = Math.max(
                            dp[i][j][c],
                            dp[i][j - 1][prev_cost_needed] + score_val
                        );
                    }
                }
            }
        }
    }

    // After filling the DP table, find the maximum score at the bottom-right corner (m-1, n-1)
    // for any cost from 0 to k.
    let maxScore = -1;
    for (let c = 0; c <= k; c++) {
        maxScore = Math.max(maxScore, dp[m - 1][n - 1][c]);
    }

    return maxScore;
};
```