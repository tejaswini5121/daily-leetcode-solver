```cpp
// Problem Summary: Find the maximum path score from (0,0) to (m-1,n-1) in a grid,
// moving only right or down, with a total cost constraint k.
// Link: https://leetcode.com/problems/maximum-path-score-in-a-grid/
//
// Approach:
// This problem can be solved using dynamic programming. We need to keep track of
// the maximum score achievable at each cell (i, j) for a given cost.
// Let dp[i][j][c] be the maximum score to reach cell (i, j) with a total cost of c.
//
// The state transitions are as follows:
// To reach (i, j), we can come from (i-1, j) (moving down) or (i, j-1) (moving right).
// For each cell (i, j), we calculate its score and cost:
// - If grid[i][j] == 0: score_increment = 0, cost_increment = 0
// - If grid[i][j] == 1: score_increment = 1, cost_increment = 1
// - If grid[i][j] == 2: score_increment = 2, cost_increment = 1
//
// The recurrence relation is:
// For each possible cost 'prev_c' to reach the previous cell:
// dp[i][j][prev_c + cost_increment] = max(dp[i][j][prev_c + cost_increment], dp[prev_cell][prev_c] + score_increment)
//
// Initialization:
// dp[0][0][0] = 0 (starting at (0,0) with 0 cost gives 0 score).
// All other dp values are initialized to -1 (or a very small negative number) to indicate
// unreachable states.
//
// The base case for the starting cell (0,0) needs careful handling.
// Since grid[0][0] is guaranteed to be 0, the score is 0 and cost is 0.
// So, dp[0][0][0] = 0.
//
// The dimensions of the dp table would be m x n x (k+1).
// m, n <= 200, k <= 103.
// The size of dp table is approximately 200 * 200 * 1004, which is about 4 * 10^7.
// This might be too large. Let's re-evaluate the state.
//
// We can optimize the DP state. Instead of `dp[i][j][c]`, we can use `dp[i][j]` as a map
// or a vector of pairs where `dp[i][j]` stores `(cost, score)` pairs representing all
// achievable scores for a given cost at cell (i, j).
// However, a simpler approach that fits within constraints might be to use
// `dp[i][j]` to store the maximum score for each possible cost up to `k`.
// Let `dp[i][j][c]` be the maximum score to reach cell `(i, j)` with exactly cost `c`.
//
// The state transitions:
// For cell `(i, j)` and current cost `c`:
// If `grid[i][j] == 0`: score_inc = 0, cost_inc = 0
// If `grid[i][j] == 1`: score_inc = 1, cost_inc = 1
// If `grid[i][j] == 2`: score_inc = 2, cost_inc = 1
//
// To reach `(i, j)` with cost `c`:
// We can come from `(i-1, j)` with cost `c - cost_inc`. If `dp[i-1][j][c - cost_inc]` is valid:
// `dp[i][j][c] = max(dp[i][j][c], dp[i-1][j][c - cost_inc] + score_inc)`
// We can come from `(i, j-1)` with cost `c - cost_inc`. If `dp[i][j-1][c - cost_inc]` is valid:
// `dp[i][j][c] = max(dp[i][j][c], dp[i][j-1][c - cost_inc] + score_inc)`
//
// The DP table size is m * n * (k+1).
// m, n <= 200, k <= 103.
// Size: 200 * 200 * 1004 ≈ 4 * 10^7. This is manageable.
// Initialize dp table with -1.
//
// Base case:
// dp[0][0][0] = 0, because grid[0][0] is always 0, so score 0, cost 0.
//
// Iteration order:
// Iterate through rows `i` from 0 to m-1.
// Iterate through columns `j` from 0 to n-1.
// Iterate through costs `c` from 0 to k.
//
// For each cell `(i, j)` and cost `c`, calculate its score and cost increment.
// Then, update `dp[i][j][c]` using values from `dp[i-1][j][c - cost_inc]` and `dp[i][j-1][c - cost_inc]`.
// We need to be careful with boundary conditions (i-1 < 0 or j-1 < 0) and cost checks (c - cost_inc >= 0).
//
// A potential issue with the above DP is that we are iterating over all costs `c` for each cell.
// The order should be: iterate through cells, and for each cell, iterate through possible previous costs.
//
// Let's refine the DP state and transitions.
// dp[i][j][c]: Maximum score to reach cell (i, j) with a total cost of exactly `c`.
//
// Initialize `dp` table of size `m x n x (k+1)` with -1.
//
// Base case:
// `grid[0][0]` is always 0. So, score is 0, cost is 0.
// `dp[0][0][0] = 0`.
//
// Iterate through the grid:
// For `i` from 0 to `m-1`:
//   For `j` from 0 to `n-1`:
//     Calculate `score_val` and `cost_val` for `grid[i][j]`.
//     `score_val = grid[i][j]`
//     `cost_val = (grid[i][j] == 0) ? 0 : 1`
//
//     For `c` from 0 to `k`:
//       // If dp[i][j][c] is reachable (i.e., not -1)
//       if (dp[i][j][c] != -1) {
//         // Try moving right
//         if (j + 1 < n) {
//           int next_cost = c + cost_val;
//           if (next_cost <= k) {
//             dp[i][j + 1][next_cost] = max(dp[i][j + 1][next_cost], dp[i][j][c] + score_val);
//           }
//         }
//         // Try moving down
//         if (i + 1 < m) {
//           int next_cost = c + cost_val;
//           if (next_cost <= k) {
//             dp[i + 1][j][next_cost] = max(dp[i + 1][j][next_cost], dp[i][j][c] + score_val);
//           }
//         }
//       }
//
// This approach is still problematic because the `score_val` and `cost_val` are associated with the *current* cell `(i, j)`, but the DP update happens *after* we've potentially accumulated a score at `(i, j)`. The `score_val` and `cost_val` should be added when *entering* a cell.
//
// Let's use the definition: `dp[i][j][c]` is the maximum score to reach cell `(i, j)` having spent a total cost of `c`.
//
// Initialize `dp` table of size `m x n x (k+1)` with -1.
//
// Base case:
// `grid[0][0]` is always 0. So, score is 0, cost is 0.
// `dp[0][0][0] = 0`.
//
// Iterate through the grid:
// For `i` from 0 to `m-1`:
//   For `j` from 0 to `n-1`:
//     // For each possible cost `c` that we can arrive at (i, j) with
//     For `c` from 0 to `k`:
//       if (dp[i][j][c] != -1) { // If state (i, j, c) is reachable
//         int current_score = dp[i][j][c];
//
//         // Calculate score and cost for the cell (i, j) itself.
//         // This calculation is already accounted for when we *enter* the cell.
//         // The DP definition is: max score to *reach* (i,j) with cost c.
//         // This means the score/cost of (i,j) are already included in dp[i][j][c].
//
//         // Consider moving from (i, j) to (i+1, j) (down)
//         if (i + 1 < m) {
//           int next_cell_value = grid[i+1][j];
//           int score_increment = next_cell_value;
//           int cost_increment = (next_cell_value == 0) ? 0 : 1;
//
//           int new_total_cost = c + cost_increment;
//           if (new_total_cost <= k) {
//             // Update dp[i+1][j][new_total_cost]
//             // The score for dp[i+1][j][new_total_cost] is the score to reach (i,j) with cost c, plus the score of (i+1, j).
//             dp[i+1][j][new_total_cost] = max(dp[i+1][j][new_total_cost], current_score + score_increment);
//           }
//         }
//
//         // Consider moving from (i, j) to (i, j+1) (right)
//         if (j + 1 < n) {
//           int next_cell_value = grid[i][j+1];
//           int score_increment = next_cell_value;
//           int cost_increment = (next_cell_value == 0) ? 0 : 1;
//
//           int new_total_cost = c + cost_increment;
//           if (new_total_cost <= k) {
//             // Update dp[i][j+1][new_total_cost]
//             dp[i][j+1][new_total_cost] = max(dp[i][j+1][new_total_cost], current_score + score_increment);
//           }
//         }
//       }
//
// This is still a bit off. The score and cost for the cell (i, j) should be added when calculating dp[i][j].
//
// Let `dp[i][j][c]` be the maximum score to reach cell `(i, j)` having spent a total cost of `c` *upon arrival at `(i, j)`*.
//
// Initialize `dp` table of size `m x n x (k+1)` with -1.
//
// Base case:
// `grid[0][0]` is 0.
// Score at (0,0) = 0. Cost at (0,0) = 0.
// `dp[0][0][0] = 0`.
//
// Iterate through the grid cells:
// For `i` from 0 to `m-1`:
//   For `j` from 0 to `n-1`:
//     // For each possible cost `c` at cell (i, j)
//     For `c` from 0 to `k`:
//       // If state (i, j, c) is not reachable, skip
//       if (dp[i][j][c] == -1) continue;
//
//       // Calculate the score and cost for the cell (i, j) itself.
//       // This is already incorporated in dp[i][j][c] by definition.
//       // So, when we move from (i, j) to a neighbor, we take dp[i][j][c] as the score so far.
//
//       // Try moving right to (i, j+1)
//       if (j + 1 < n) {
//         int next_val = grid[i][j+1];
//         int score_increment = next_val;
//         int cost_increment = (next_val == 0) ? 0 : 1;
//
//         int new_total_cost = c + cost_increment;
//         if (new_total_cost <= k) {
//           // The score at (i, j+1) with cost `new_total_cost` is the score
//           // at (i, j) with cost `c` plus the score increment of the cell (i, j+1).
//           dp[i][j+1][new_total_cost] = max(dp[i][j+1][new_total_cost], dp[i][j][c] + score_increment);
//         }
//       }
//
//       // Try moving down to (i+1, j)
//       if (i + 1 < m) {
//         int next_val = grid[i+1][j];
//         int score_increment = next_val;
//         int cost_increment = (next_val == 0) ? 0 : 1;
//
//         int new_total_cost = c + cost_increment;
//         if (new_total_cost <= k) {
//           // The score at (i+1, j) with cost `new_total_cost` is the score
//           // at (i, j) with cost `c` plus the score increment of the cell (i+1, j).
//           dp[i+1][j][new_total_cost] = max(dp[i+1][j][new_total_cost], dp[i][j][c] + score_increment);
//         }
//       }
//
// This looks correct. The time complexity will be O(m * n * k).
// Space complexity will be O(m * n * k).
// m, n <= 200, k <= 103.
// Time: 200 * 200 * 1004 ≈ 4 * 10^7 operations. This should be acceptable within typical time limits (like 1 second).
// Space: 200 * 200 * 1004 * sizeof(int) ≈ 4 * 10^7 * 4 bytes ≈ 160 MB. This might be tight but often acceptable.
//
// Let's consider the constraints again. m, n up to 200. k up to 103.
// If k was larger, say up to 10^5, then this DP would be too slow/memory intensive.
// But for k=103, it seems feasible.
//
// Final check on DP state and transitions:
// `dp[i][j][c]` = maximum score to reach cell `(i, j)` with *exactly* total cost `c`.
//
// Initialization:
// `vector<vector<vector<int>>> dp(m, vector<vector<int>>(n, vector<int>(k + 1, -1)));`
//
// Base case:
// `dp[0][0][0] = 0;` // Grid[0][0] is always 0, so score 0, cost 0.
//
// Iteration:
// For `i` from 0 to `m-1`:
//   For `j` from 0 to `n-1`:
//     For `c` from 0 to `k`:
//       if (dp[i][j][c] == -1) continue; // If this state is unreachable, skip.
//
//       // Calculate score and cost for the *next* cell we are moving to.
//       // This is because dp[i][j][c] already represents the score *after arriving* at (i,j) with cost c.
//
//       // Move Right: to (i, j+1)
//       if (j + 1 < n) {
//         int next_cell_val = grid[i][j+1];
//         int score_increment = next_cell_val;
//         int cost_increment = (next_cell_val == 0) ? 0 : 1;
//
//         int new_total_cost = c + cost_increment;
//         if (new_total_cost <= k) {
//           // Update the state for the next cell (i, j+1) with the new total cost.
//           // The score is the score at (i, j) plus the score of the next cell.
//           dp[i][j+1][new_total_cost] = max(dp[i][j+1][new_total_cost], dp[i][j][c] + score_increment);
//         }
//       }
//
//       // Move Down: to (i+1, j)
//       if (i + 1 < m) {
//         int next_cell_val = grid[i+1][j];
//         int score_increment = next_cell_val;
//         int cost_increment = (next_cell_val == 0) ? 0 : 1;
//
//         int new_total_cost = c + cost_increment;
//         if (new_total_cost <= k) {
//           // Update the state for the next cell (i+1, j) with the new total cost.
//           // The score is the score at (i, j) plus the score of the next cell.
//           dp[i+1][j][new_total_cost] = max(dp[i+1][j][new_total_cost], dp[i][j][c] + score_increment);
//         }
//       }
//
// After filling the DP table, the answer is the maximum value in `dp[m-1][n-1][c]` for all `c` from 0 to `k`.
//
// Result extraction:
// `int max_score = -1;`
// `for (int c = 0; c <= k; ++c) {`
//   `max_score = max(max_score, dp[m-1][n-1][c]);`
// `}`
// `return max_score;`
//
// Consider edge cases: 1x1 grid.
// If m=1, n=1, k=0. grid=[[0]]. Expected output: 0.
// dp table: 1x1x1. dp[0][0][0] = 0. Loop finishes. Max score at dp[0][0] is dp[0][0][0] = 0. Correct.
//
// If m=1, n=2, k=0. grid=[[0, 1]]. Expected output: -1.
// dp table: 1x2x1. dp[0][0][0] = 0.
// i=0, j=0, c=0: dp[0][0][0] = 0.
//   Move right to (0,1): next_val=1, score_inc=1, cost_inc=1.
//   new_total_cost = 0 + 1 = 1. k=0. 1 <= 0 is false. Cannot move.
//
// The problem statement says "You start from the top-left corner (0, 0) and want to reach the bottom-right corner (m - 1, n - 1)".
// The scores and costs are "according to their cell values".
// This implies the starting cell (0,0) also contributes its score/cost.
//
// Let's adjust the DP state meaning slightly for clarity.
// `dp[i][j][c]` = maximum score accumulated *after processing* cell `(i, j)` and having a total cost of `c`.
//
// Initialization:
// `vector<vector<vector<int>>> dp(m, vector<vector<int>>(n, vector<int>(k + 1, -1)));`
//
// Base case for (0,0):
// `int start_val = grid[0][0];` (which is always 0)
// `int start_score = start_val;` // 0
// `int start_cost = (start_val == 0) ? 0 : 1;` // 0
// `dp[0][0][start_cost] = start_score;` // dp[0][0][0] = 0
//
// Iteration:
// For `i` from 0 to `m-1`:
//   For `j` from 0 to `n-1`:
//     For `c` from 0 to `k`:
//       if (dp[i][j][c] == -1) continue; // If this state is unreachable, skip.
//
//       // Consider moving from (i, j) to (i+1, j)
//       if (i + 1 < m) {
//         int next_val = grid[i+1][j];
//         int score_increment = next_val;
//         int cost_increment = (next_val == 0) ? 0 : 1;
//
//         int new_total_cost = c + cost_increment; // Cost *after arriving* at (i+1, j)
//         if (new_total_cost <= k) {
//           // The score at (i+1, j) with cost `new_total_cost` is the score
//           // accumulated up to (i, j) with cost `c`, plus the score of the cell (i+1, j).
//           dp[i+1][j][new_total_cost] = max(dp[i+1][j][new_total_cost], dp[i][j][c] + score_increment);
//         }
//       }
//
//       // Consider moving from (i, j) to (i, j+1)
//       if (j + 1 < n) {
//         int next_val = grid[i][j+1];
//         int score_increment = next_val;
//         int cost_increment = (next_val == 0) ? 0 : 1;
//
//         int new_total_cost = c + cost_increment; // Cost *after arriving* at (i, j+1)
//         if (new_total_cost <= k) {
//           // The score at (i, j+1) with cost `new_total_cost` is the score
//           // accumulated up to (i, j) with cost `c`, plus the score of the cell (i, j+1).
//           dp[i][j+1][new_total_cost] = max(dp[i][j+1][new_total_cost], dp[i][j][c] + score_increment);
//         }
//       }
//
// This interpretation seems correct. `dp[i][j][c]` stores the max score *after* visiting `(i,j)` and accumulating cost `c`.
// The base case `dp[0][0][0] = 0` correctly represents starting at `(0,0)` (which has value 0, score 0, cost 0) with 0 cost and 0 score.
// When we move to a neighbor, say `(i+1, j)`, we add `grid[i+1][j]` to the score and `cost(grid[i+1][j])` to the cost.
//
// The final answer is `max(dp[m-1][n-1][c])` for `0 <= c <= k`.
// If all `dp[m-1][n-1][c]` are -1, it means the destination is unreachable, return -1.
//
// Example 1 walk-through:
// grid = [[0, 1],[2, 0]], k = 1
// m=2, n=2, k=1
// dp table: 2x2x2, initialized to -1.
//
// Base case: grid[0][0]=0. score=0, cost=0.
// dp[0][0][0] = 0.
//
// i=0, j=0, c=0: dp[0][0][0] = 0.
//   Move Right to (0,1): grid[0][1]=1. score_inc=1, cost_inc=1.
//     new_total_cost = 0 + 1 = 1. (1 <= k=1) True.
//     dp[0][1][1] = max(-1, dp[0][0][0] + 1) = max(-1, 0 + 1) = 1.
//   Move Down to (1,0): grid[1][0]=2. score_inc=2, cost_inc=1.
//     new_total_cost = 0 + 1 = 1. (1 <= k=1) True.
//     dp[1][0][1] = max(-1, dp[0][0][0] + 2) = max(-1, 0 + 2) = 2.
//
// i=0, j=1, c=0: dp[0][1][0] = -1. Skip.
// i=0, j=1, c=1: dp[0][1][1] = 1.
//   Move Right to (0,2): j+1=2 >= n=2. No move.
//   Move Down to (1,1): grid[1][1]=0. score_inc=0, cost_inc=0.
//     new_total_cost = 1 + 0 = 1. (1 <= k=1) True.
//     dp[1][1][1] = max(-1, dp[0][1][1] + 0) = max(-1, 1 + 0) = 1.
//
// i=1, j=0, c=0: dp[1][0][0] = -1. Skip.
// i=1, j=0, c=1: dp[1][0][1] = 2.
//   Move Right to (1,1): grid[1][1]=0. score_inc=0, cost_inc=0.
//     new_total_cost = 1 + 0 = 1. (1 <= k=1) True.
//     dp[1][1][1] = max(dp[1][1][1], dp[1][0][1] + 0) = max(1, 2 + 0) = 2.
//   Move Down to (2,0): i+1=2 >= m=2. No move.
//
// i=1, j=1, c=0: dp[1][1][0] = -1. Skip.
// i=1, j=1, c=1: dp[1][1][1] = 2. (Updated value from previous step)
//   No further moves possible from (1,1).
//
// Final DP table for dp[1][1]:
// dp[1][1][0] = -1
// dp[1][1][1] = 2
//
// Max score at dp[1][1]: max(-1, 2) = 2. Correct for Example 1.
//
// Example 2 walk-through:
// grid = [[0, 1],[1, 2]], k = 1
// m=2, n=2, k=1
// dp table: 2x2x2, initialized to -1.
//
// Base case: grid[0][0]=0. score=0, cost=0.
// dp[0][0][0] = 0.
//
// i=0, j=0, c=0: dp[0][0][0] = 0.
//   Move Right to (0,1): grid[0][1]=1. score_inc=1, cost_inc=1.
//     new_total_cost = 0 + 1 = 1. (1 <= k=1) True.
//     dp[0][1][1] = max(-1, dp[0][0][0] + 1) = max(-1, 0 + 1) = 1.
//   Move Down to (1,0): grid[1][0]=1. score_inc=1, cost_inc=1.
//     new_total_cost = 0 + 1 = 1. (1 <= k=1) True.
//     dp[1][0][1] = max(-1, dp[0][0][0] + 1) = max(-1, 0 + 1) = 1.
//
// i=0, j=1, c=0: dp[0][1][0] = -1. Skip.
// i=0, j=1, c=1: dp[0][1][1] = 1.
//   Move Right: No.
//   Move Down to (1,1): grid[1][1]=2. score_inc=2, cost_inc=1.
//     new_total_cost = 1 + 1 = 2. (2 <= k=1) False. Cannot reach (1,1) through this path.
//
// i=1, j=0, c=0: dp[1][0][0] = -1. Skip.
// i=1, j=0, c=1: dp[1][0][1] = 1.
//   Move Right to (1,1): grid[1][1]=2. score_inc=2, cost_inc=1.
//     new_total_cost = 1 + 1 = 2. (2 <= k=1) False. Cannot reach (1,1) through this path.
//   Move Down: No.
//
// Final DP table for dp[1][1]:
// dp[1][1][0] = -1
// dp[1][1][1] = -1
//
// Max score at dp[1][1]: max(-1, -1) = -1. Correct for Example 2.
//
// The approach appears solid.
//
// Time Complexity: O(m * n * k) where m is number of rows, n is number of columns, and k is the maximum cost.
// Space Complexity: O(m * n * k) for the DP table.
//
// Given m, n <= 200 and k <= 103, the complexity is feasible.
// Time: 200 * 200 * 1004 operations which is about 4 * 10^7.
// Space: 200 * 200 * 1004 * sizeof(int) which is about 160 MB.
//
// One final check: the problem states "grid[0][0] == 0". This simplifies the base case nicely.
// The costs are: 0 for value 0, 1 for value 1, 1 for value 2.
// Scores are: 0 for value 0, 1 for value 1, 2 for value 2.
// This is correctly implemented as `score_increment = next_cell_val` and `cost_increment = (next_cell_val == 0) ? 0 : 1`.
//
// Code structure:
// - Include necessary headers.
// - Define the Solution class.
// - Implement the `maxPathScore` method.
// - Use `vector<vector<vector<int>>>` for DP table.
// - Handle initialization and base case.
// - Implement nested loops for DP transitions.
// - Extract the final result.
//
// The return value should be `int`.
// The maximum possible score could be `m * n * 2`. For m=200, n=200, this is 80000. An `int` is sufficient.
//

#include <vector>
#include <algorithm>

class Solution {
public:
    int maxPathScore(std::vector<std::vector<int>>& grid, int k) {
        int m = grid.size();
        int n = grid[0].size();

        // dp[i][j][c] stores the maximum score to reach cell (i, j) with a total cost of exactly c.
        // Initialize with -1 to indicate unreachable states.
        std::vector<std::vector<std::vector<int>>> dp(m, std::vector<std::vector<int>>(n, std::vector<int>(k + 1, -1)));

        // Base case: starting cell (0, 0).
        // grid[0][0] is guaranteed to be 0.
        // Score for (0,0) is 0, cost for (0,0) is 0.
        // So, we reach (0,0) with cost 0 and score 0.
        dp[0][0][0] = 0;

        // Iterate through the grid cells
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                // Iterate through all possible costs that could lead to cell (i, j)
                for (int c = 0; c <= k; ++c) {
                    // If the current state (i, j, c) is unreachable, skip it.
                    if (dp[i][j][c] == -1) {
                        continue;
                    }

                    // From cell (i, j), we can move right or down to the next cell.
                    // We calculate the score and cost of the *next* cell.

                    // Try moving right to cell (i, j+1)
                    if (j + 1 < n) {
                        int next_cell_value = grid[i][j + 1];
                        int score_increment = next_cell_value; // Score contributed by the next cell
                        // Cost increment: 0 for value 0, 1 for value 1 or 2
                        int cost_increment = (next_cell_value == 0) ? 0 : 1;

                        int new_total_cost = c + cost_increment; // Total cost after moving to (i, j+1)

                        // If the new total cost does not exceed k
                        if (new_total_cost <= k) {
                            // Update the dp table for the next cell (i, j+1) with the new total cost.
                            // The score is the score accumulated until (i, j) plus the score of the next cell.
                            dp[i][j + 1][new_total_cost] = std::max(dp[i][j + 1][new_total_cost], dp[i][j][c] + score_increment);
                        }
                    }

                    // Try moving down to cell (i+1, j)
                    if (i + 1 < m) {
                        int next_cell_value = grid[i + 1][j];
                        int score_increment = next_cell_value; // Score contributed by the next cell
                        // Cost increment: 0 for value 0, 1 for value 1 or 2
                        int cost_increment = (next_cell_value == 0) ? 0 : 1;

                        int new_total_cost = c + cost_increment; // Total cost after moving to (i+1, j)

                        // If the new total cost does not exceed k
                        if (new_total_cost <= k) {
                            // Update the dp table for the next cell (i+1, j) with the new total cost.
                            // The score is the score accumulated until (i, j) plus the score of the next cell.
                            dp[i + 1][j][new_total_cost] = std::max(dp[i + 1][j][new_total_cost], dp[i][j][c] + score_increment);
                        }
                    }
                }
            }
        }

        // After filling the DP table, find the maximum score at the bottom-right corner (m-1, n-1)
        // across all possible valid costs (from 0 to k).
        int max_score = -1;
        for (int c = 0; c <= k; ++c) {
            max_score = std::max(max_score, dp[m - 1][n - 1][c]);
        }

        return max_score;
    }
};
```