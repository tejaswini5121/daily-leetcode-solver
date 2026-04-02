// /*
// Problem Summary:
// Find the maximum coins a robot can earn on a path from the top-left to the bottom-right of a grid,
// with the ability to neutralize at most 2 robbers who steal coins.
// Link: https://leetcode.com/problems/maximum-amount-of-money-robot-can-earn/
//
// Approach:
// This problem can be solved using dynamic programming. We need to keep track of the maximum coins earned
// and the number of robber neutralizations used to reach a particular cell.
//
// Let dp[i][j][k] represent the maximum coins earned to reach cell (i, j) using exactly 'k' neutralizations.
// 'k' can be 0, 1, or 2.
//
// For each cell (i, j), we can reach it either from (i-1, j) (moving down) or from (i, j-1) (moving right).
//
// The state transition will be:
// For each k in {0, 1, 2}:
//   If coins[i][j] >= 0:
//     dp[i][j][k] = max(dp[i-1][j][k], dp[i][j-1][k]) + coins[i][j]
//   If coins[i][j] < 0:
//     // Option 1: Don't use a neutralization at this cell (if k > 0)
//     // This means the neutralization must have been used on a previous cell on the path.
//     // So, we consider the max coins from previous cells with k neutralizations.
//     // The number of neutralizations used to reach (i,j) is still k.
//     dp[i][j][k] = max(dp[i-1][j][k], dp[i][j-1][k]) + coins[i][j]
//
//     // Option 2: Use a neutralization at this cell (if k > 0)
//     // This means we arrived at (i, j) with k-1 neutralizations used on the path to the previous cell.
//     // By neutralizing at (i, j), we effectively "gain" abs(coins[i][j]) instead of losing it.
//     // So, the value added is coins[i][j] (which is negative) + 2 * abs(coins[i][j]) = -coins[i][j].
//     // The number of neutralizations used to reach (i,j) becomes k.
//     if (k > 0) {
//       dp[i][j][k] = max(dp[i][j][k], max(dp[i-1][j][k-1], dp[i][j-1][k-1]) - coins[i][j]);
//     }
//
// Base case:
// dp[0][0][0] = coins[0][0] (if coins[0][0] >= 0, otherwise it's impossible to start with 0 neutralizations and a negative coin without spending one).
// Actually, if coins[0][0] < 0, we MUST use a neutralization.
//
// Corrected Base case:
// dp[0][0][0] = coins[0][0]
// dp[0][0][1] = -coins[0][0] (if coins[0][0] < 0)
// dp[0][0][2] = -coins[0][0] (if coins[0][0] < 0)
//
// Let's refine the DP state definition.
// dp[i][j][k] = maximum coins to reach (i, j) having used EXACTLY k neutralizations on the path.
//
// Initialize dp table with a very small negative number to represent unreachable states.
//
// For cell (i, j) and neutralizations 'k':
//
// If coins[i][j] >= 0:
//   // Path from above (i-1, j)
//   if (i > 0) {
//     dp[i][j][k] = max(dp[i][j][k], dp[i-1][j][k] + coins[i][j]);
//   }
//   // Path from left (i, j-1)
//   if (j > 0) {
//     dp[i][j][k] = max(dp[i][j][k], dp[i][j-1][k] + coins[i][j]);
//   }
//
// If coins[i][j] < 0:
//   // Option 1: The robot doesn't use a neutralization at (i, j).
//   // This is only possible if we already used 'k' neutralizations to reach the previous cell.
//   // The number of neutralizations used to reach (i, j) is still 'k'.
//   if (i > 0) {
//     dp[i][j][k] = max(dp[i][j][k], dp[i-1][j][k] + coins[i][j]);
//   }
//   if (j > 0) {
//     dp[i][j][k] = max(dp[i][j][k], dp[i][j-1][k] + coins[i][j]);
//   }
//
//   // Option 2: The robot uses a neutralization at (i, j).
//   // This is only possible if k > 0 (meaning we have at least one neutralization available to use).
//   // We arrive at (i, j) having used k-1 neutralizations to reach the previous cell.
//   // The coins gained are coins[i][j] (which is negative) + 2 * abs(coins[i][j]) = -coins[i][j].
//   if (k > 0) {
//     if (i > 0) {
//       dp[i][j][k] = max(dp[i][j][k], dp[i-1][j][k-1] - coins[i][j]); // -coins[i][j] is the gain
//     }
//     if (j > 0) {
//       dp[i][j][k] = max(dp[i][j][k], dp[i][j-1][k-1] - coins[i][j]); // -coins[i][j] is the gain
//     }
//   }
//
// Base case initialization:
// For dp[0][0]:
//   dp[0][0][0] = coins[0][0];
//   if (coins[0][0] < 0) {
//     dp[0][0][1] = -coins[0][0]; // Use 1 neutralization
//     dp[0][0][2] = -coins[0][0]; // Use 1 neutralization (at least one is used)
//   }
// Initialize all other dp states to a very small negative number (e.g., -1e18).
//
// After filling the DP table, the answer is the maximum value among dp[m-1][n-1][0], dp[m-1][n-1][1], and dp[m-1][n-1][2].
//
// Time Complexity: O(m * n * 3) = O(m * n) since the number of neutralizations is constant (3 states).
// Space Complexity: O(m * n * 3) = O(m * n) for the DP table.
// We can optimize space to O(n) by only keeping track of the previous row.
//
// Let's refine the base case and initialization for clarity.
// Use a sentinel value like `LLONG_MIN` for unreachability.
//
// dp[i][j][k]: max coins to reach (i, j) having used AT MOST k neutralizations.
// This state definition might be simpler to handle. But the problem states "at most 2 cells", implying exactly 0, 1, or 2.
// So, the "exactly k" definition is more precise.
//
// Let's stick to dp[i][j][k] = max coins to reach (i, j) using EXACTLY k neutralizations.
//
// Initializing with a very small number is crucial.
//
// `const long long INF = -1e18;`
//
// `vector<vector<vector<long long>>> dp(m, vector<vector<long long>>(n, vector<long long>(3, INF)));`
//
// Base Case (0,0):
// `dp[0][0][0] = coins[0][0];`
// If `coins[0][0] < 0`:
//   `dp[0][0][1] = -coins[0][0];` // Used 1 neutralization
//   `dp[0][0][2] = -coins[0][0];` // Can use up to 2, so this state is also reachable.
//
// Now iterate through the grid.
//
// For cell (i, j):
//   For k in {0, 1, 2}:
//     // Calculate the maximum coins from the previous cells.
//     long long max_prev_coins = INF;
//
//     // From top (i-1, j)
//     if (i > 0) {
//       if (k == 0) { // If we want to reach (i,j) with 0 neutralizations at (i,j)
//         if (dp[i-1][j][0] != INF) max_prev_coins = max(max_prev_coins, dp[i-1][j][0]);
//       } else { // If we want to reach (i,j) with k > 0 neutralizations at (i,j)
//         // We could have used k neutralizations from the previous cell
//         if (dp[i-1][j][k] != INF) max_prev_coins = max(max_prev_coins, dp[i-1][j][k]);
//         // OR we could have used k-1 neutralizations from the previous cell and use one at (i,j)
//         if (dp[i-1][j][k-1] != INF) max_prev_coins = max(max_prev_coins, dp[i-1][j][k-1]);
//       }
//     }
//
//     // From left (i, j-1)
//     if (j > 0) {
//       if (k == 0) { // If we want to reach (i,j) with 0 neutralizations at (i,j)
//         if (dp[i][j-1][0] != INF) max_prev_coins = max(max_prev_coins, dp[i][j-1][0]);
//       } else { // If we want to reach (i,j) with k > 0 neutralizations at (i,j)
//         // We could have used k neutralizations from the previous cell
//         if (dp[i][j-1][k] != INF) max_prev_coins = max(max_prev_coins, dp[i][j-1][k]);
//         // OR we could have used k-1 neutralizations from the previous cell and use one at (i,j)
//         if (dp[i][j-1][k-1] != INF) max_prev_coins = max(max_prev_coins, dp[i][j-1][k-1]);
//       }
//     }
//
//     // If max_prev_coins is still INF, it means this state is unreachable from any valid previous path.
//     if (max_prev_coins == INF) continue;
//
//     // Now, apply the coins[i][j] to max_prev_coins based on whether it's a robber or not.
//
//     if (coins[i][j] >= 0) {
//       // If it's positive, we always gain coins. The number of neutralizations used remains k.
//       // This is only valid if we are trying to reach state dp[i][j][k] where k is the number of
//       // neutralizations used on the path.
//       // The calculation of max_prev_coins should reflect the number of neutralizations used on the path *leading to* (i,j).
//       //
//       // Let's rethink the loop structure.
//       // Iterate through the grid cells (i, j).
//       // For each cell, iterate through the possible number of neutralizations *used to reach that cell*.
//       //
//       // For i from 0 to m-1:
//       //   For j from 0 to n-1:
//       //     For k from 0 to 2: // k is the number of neutralizations used to reach (i, j)
//       //       // Calculate contribution from dp[i-1][j][k_prev] and dp[i][j-1][k_prev]
//       //       // where k_prev could be k or k-1 depending on whether (i,j) is a robber and we use a neutralization there.
//
//       // Revised DP transition:
//       // For cell (i, j):
//       // Iterate through all possible previous states (from (i-1, j) and (i, j-1))
//       // and for each of those states (k_prev neutralizations used), decide how to arrive at (i, j)
//       // with a new number of neutralizations (k_new).
//
//       // Let's use `dp[i][j][k]` = maximum coins to reach cell (i, j) having used EXACTLY k neutralizations so far.
//       //
//       // Initialize dp table with `INF`.
//       // Base case:
//       // `dp[0][0][0] = coins[0][0];`
//       // If `coins[0][0] < 0`:
//       //   `dp[0][0][1] = -coins[0][0];` // Use 1 neutralization at (0,0)
//       //   // `dp[0][0][2]` is not directly possible from (0,0) with 2 neutralizations if only 1 negative coin.
//       //   // If coins[0][0] >= 0, dp[0][0][1] and dp[0][0][2] should remain INF.
//
//       // Correct Base Case Logic:
//       // `dp[0][0][0] = coins[0][0];`
//       // If `coins[0][0] < 0`:
//       //   `dp[0][0][1] = -coins[0][0];` // Use 1 neutralization.
//
//       // Iterate through the grid
//       // For i from 0 to m-1:
//       //   For j from 0 to n-1:
//       //     For k from 0 to 2: // k = number of neutralizations used to reach (i, j)
//       //       if (dp[i][j][k] == INF) continue; // If current state is unreachable, skip.
//
//       //       // Try to move right to (i, j+1)
//       //       if (j + 1 < n) {
//       //         int next_val = coins[i][j+1];
//       //         if (next_val >= 0) {
//       //           // No robber, number of neutralizations doesn't change.
//       //           dp[i][j+1][k] = max(dp[i][j+1][k], dp[i][j][k] + next_val);
//       //         } else { // Robber
//       //           // Option 1: Don't neutralize at (i, j+1). This is only possible if k is not already 2.
//       //           // So, if we used k neutralizations to reach (i,j), and we don't use one at (i,j+1),
//       //           // the number of neutralizations used to reach (i,j+1) is still k.
//       //           // This is incorrect. The k in dp[i][j][k] is the TOTAL neutralizations used on the path.
//       //           // When we move to (i,j+1), we need to decide the new total number of neutralizations.
//
//       // Let's use the definition: dp[i][j][k] = maximum profit to reach cell (i,j) having used EXACTLY k ROBBER NEUTRALIZATIONS *on the path up to and including cell (i,j)*.
//
//       // Initialization:
//       // `const long long INF = -1e18;`
//       // `vector<vector<vector<long long>>> dp(m, vector<vector<long long>>(n, vector<long long>(3, INF)));`
//
//       // Base case (0,0):
//       // If `coins[0][0] >= 0`:
//       //   `dp[0][0][0] = coins[0][0];`
//       // Else (coins[0][0] < 0):
//       //   `dp[0][0][1] = -coins[0][0];` // Use 1 neutralization at (0,0)
//
//       // Iteration:
//       // For i from 0 to m-1:
//       //   For j from 0 to n-1:
//       //     For k from 0 to 2: // k = neutralizations used to reach (i, j)
//       //       if (dp[i][j][k] == INF) continue; // If current state is unreachable, skip.
//
//       //       // Consider moving RIGHT to (i, j+1)
//       //       if (j + 1 < n) {
//       //         int next_coin_val = coins[i][j+1];
//       //
//       //         if (next_coin_val >= 0) {
//       //           // No robber. Number of neutralizations remains 'k'.
//       //           dp[i][j+1][k] = max(dp[i][j+1][k], dp[i][j][k] + next_coin_val);
//       //         } else { // Robber at (i, j+1)
//       //           // Option 1: Use a neutralization at (i, j+1).
//       //           // This requires that we have used < 2 neutralizations to reach (i,j).
//       //           // The number of neutralizations becomes k + 1.
//       //           if (k + 1 <= 2) {
//       //             dp[i][j+1][k+1] = max(dp[i][j+1][k+1], dp[i][j][k] - next_coin_val); // -next_coin_val is the gain
//       //           }
//       //           // Option 2: Do NOT use a neutralization at (i, j+1).
//       //           // This is only possible if the number of neutralizations used *before* reaching (i, j+1)
//       //           // already accounts for the maximum allowed (which would be 2).
//       //           // The problem states "at most 2 cells". This implies the total number of cells where neutralization happens is <= 2.
//       //           // So, if we are in state dp[i][j][k] and move to a robber cell (i, j+1),
//       //           // we can either:
//       //           // 1. Use a neutralization at (i, j+1). This is only possible if k < 2. The new state is dp[i][j+1][k+1].
//       //           // 2. NOT use a neutralization at (i, j+1). This means the number of neutralizations used remains 'k'.
//       //           //    This is valid if we have already used 'k' neutralizations on the path up to (i,j) and we don't use another one.
//       //           //    The total neutralizations to reach (i,j+1) is still k.
//       //           //    This implies that the robber at (i,j+1) steals `next_coin_val`.
//       //           dp[i][j+1][k] = max(dp[i][j+1][k], dp[i][j][k] + next_coin_val); // Robber steals value
//       //         }
//       //       }
//
//       //       // Consider moving DOWN to (i+1, j)
//       //       if (i + 1 < m) {
//       //         int next_coin_val = coins[i+1][j];
//       //
//       //         if (next_coin_val >= 0) {
//       //           // No robber. Number of neutralizations remains 'k'.
//       //           dp[i+1][j][k] = max(dp[i+1][j][k], dp[i][j][k] + next_coin_val);
//       //         } else { // Robber at (i+1, j)
//       //           // Option 1: Use a neutralization at (i+1, j).
//       //           if (k + 1 <= 2) {
//       //             dp[i+1][j][k+1] = max(dp[i+1][j][k+1], dp[i][j][k] - next_coin_val); // -next_coin_val is the gain
//       //           }
//       //           // Option 2: Do NOT use a neutralization at (i+1, j).
//       //           dp[i+1][j][k] = max(dp[i+1][j][k], dp[i][j][k] + next_coin_val); // Robber steals value
//       //         }
//       //       }
//       //     } // end for k
//       //   } // end for j
//       // } // end for i
//
//       // Final answer:
//       // `long long max_profit = INF;`
//       // `max_profit = max(max_profit, dp[m-1][n-1][0]);`
//       // `max_profit = max(max_profit, dp[m-1][n-1][1]);`
//       // `max_profit = max(max_profit, dp[m-1][n-1][2]);`
//       // Return `max_profit`.
//
//       // Consider the initialization of `dp[0][0]`.
//       // If `coins[0][0] >= 0`, then `dp[0][0][0] = coins[0][0]`.
//       // If `coins[0][0] < 0`, then to reach `(0,0)`:
//       //   - We must use a neutralization. So `dp[0][0][1] = -coins[0][0]`.
//       //   - `dp[0][0][0]` should remain `INF` because we cannot reach `(0,0)` with 0 neutralizations if the first cell is a robber.
//       //   - `dp[0][0][2]` is also not directly reachable by just being at `(0,0)` with 2 neutralizations unless we consider a path of length 0.
//       //     However, our transitions consider moving *from* a state.
//       //     So `dp[0][0][1]` is the only relevant state if `coins[0][0] < 0`.
//
//       // Let's refine the base case and first cell handling.
//
//       // `vector<vector<vector<long long>>> dp(m, vector<vector<long long>>(n, vector<long long>(3, INF)));`
//
//       // For cell (0, 0):
//       // If coins[0][0] >= 0:
//       //   dp[0][0][0] = coins[0][0];
//       // Else (coins[0][0] < 0):
//       //   dp[0][0][1] = -coins[0][0]; // Used 1 neutralization
//
//       // The main loops should start from (0,0) and propagate.
//       // The logic for moving right/down from (i,j) to (i,j+1) or (i+1,j) seems correct with the "k vs k+1" logic for robbers.
//
//       // Example 1 dry run:
//       // coins = [[0,1,-1],[1,-2,3],[2,-3,4]]
//       // m=3, n=3
//       // INF = -1e18
//       // dp table (3x3x3) initialized to INF.
//
//       // Base case (0,0): coins[0][0] = 0 (>=0)
//       // dp[0][0][0] = 0.
//
//       // i=0, j=0, k=0, dp[0][0][0] = 0
//       //   Move right to (0,1): coins[0][1] = 1 (>=0)
//       //     dp[0][1][0] = max(INF, dp[0][0][0] + 1) = max(INF, 0 + 1) = 1.
//       //   Move down to (1,0): coins[1][0] = 1 (>=0)
//       //     dp[1][0][0] = max(INF, dp[0][0][0] + 1) = max(INF, 0 + 1) = 1.
//
//       // i=0, j=1, k=0, dp[0][1][0] = 1
//       //   Move right to (0,2): coins[0][2] = -1 (<0) - ROBBER
//       //     k+1 = 1 <= 2:
//       //       dp[0][2][1] = max(INF, dp[0][1][0] - (-1)) = max(INF, 1 + 1) = 2.
//       //     dp[0][2][0] = max(INF, dp[0][1][0] + (-1)) = max(INF, 1 - 1) = 0.
//       //   Move down to (1,1): coins[1][1] = -2 (<0) - ROBBER
//       //     k+1 = 1 <= 2:
//       //       dp[1][1][1] = max(INF, dp[0][1][0] - (-2)) = max(INF, 1 + 2) = 3.
//       //     dp[1][1][0] = max(INF, dp[0][1][0] + (-2)) = max(INF, 1 - 2) = -1.
//
//       // i=1, j=0, k=0, dp[1][0][0] = 1
//       //   Move right to (1,1): coins[1][1] = -2 (<0) - ROBBER
//       //     k+1 = 1 <= 2:
//       //       dp[1][1][1] = max(3, dp[1][0][0] - (-2)) = max(3, 1 + 2) = 3. (No change)
//       //     dp[1][1][0] = max(-1, dp[1][0][0] + (-2)) = max(-1, 1 - 2) = -1. (No change)
//       //   Move down to (2,0): coins[2][0] = 2 (>=0)
//       //     dp[2][0][0] = max(INF, dp[1][0][0] + 2) = max(INF, 1 + 2) = 3.
//
//       // ... continue filling ...
//
//       // Let's trace the optimal path from example 1: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
//       // (0,0): coins=0. dp[0][0][0] = 0.
//       // (0,1): coins=1. dp[0][1][0] = dp[0][0][0] + 1 = 1.
//       // (1,1): coins=-2. Path is (0,0)->(0,1)->(1,1).
//       //   If we DO NOT use neutralization at (1,1):
//       //     dp[1][1][0] = dp[0][1][0] + coins[1][1] = 1 + (-2) = -1. (Robber steals)
//       //   If we DO use neutralization at (1,1): (k=0 before, now k=1)
//       //     dp[1][1][1] = dp[0][1][0] - coins[1][1] = 1 - (-2) = 3.
//       // Optimal choice for (1,1) from (0,1) is dp[1][1][1] = 3.
//
//       // (1,2): coins=3. Path is (0,0)->(0,1)->(1,1)->(1,2).
//       //   We are coming from dp[1][1][1] = 3.
//       //   coins[1][2] = 3 (>=0). No robber. Neutralization count stays 1.
//       //   dp[1][2][1] = max(INF, dp[1][1][1] + coins[1][2]) = max(INF, 3 + 3) = 6.
//
//       // (2,2): coins=4. Path is (0,0)->(0,1)->(1,1)->(1,2)->(2,2).
//       //   We are coming from dp[1][2][1] = 6.
//       //   coins[2][2] = 4 (>=0). No robber. Neutralization count stays 1.
//       //   dp[2][2][1] = max(INF, dp[1][2][1] + coins[2][2]) = max(INF, 6 + 4) = 10.
//
//       // Wait, the example output is 8. What did I miss?
//       // The example path description is:
//       // Start at (0, 0) with 0 coins (total coins = 0).
//       // Move to (0, 1), gaining 1 coin (total coins = 0 + 1 = 1).
//       // Move to (1, 1), where there's a robber stealing 2 coins. The robot uses one neutralization here, avoiding the robbery (total coins = 1).
//       // --> This means total coins *before* adding coins[1][1] is 1.
//       // --> After neutralizing, the effective value from (1,1) is 0 (neutralized the -2). So total coins = 1 + 0 = 1.
//       // --> This implies the calculation `dp[i][j][k] - next_coin_val` should be `dp[i][j][k_prev] + abs(next_coin_val)` if neutralizing.
//       // --> OR `dp[i][j][k_prev] + next_coin_val` if not neutralizing.
//
//       // Let's re-evaluate the "gain" when neutralizing.
//       // If `coins[i][j] < 0`:
//       //   Neutralizing means we treat `coins[i][j]` as `0`. So we add `0`.
//       //   The total coins become `dp[i][j][k_prev] + 0`.
//       //   The gain compared to not neutralizing is `0 - coins[i][j] = -coins[i][j] = abs(coins[i][j])`.
//       //   So, the new total is `dp[i][j][k_prev] + abs(coins[i][j])` if neutralizing.
//       //   This is equivalent to `dp[i][j][k_prev] - coins[i][j]` since `coins[i][j]` is negative.
//       //   This seems correct.
//
//       // The path description:
//       // (0,0) = 0.
//       // (0,1) = 1. Current total = 0 + 1 = 1.
//       // (1,1) = -2. Use neutralization. Total = 1. (This 1 is the accumulated value *before* considering the current cell's effect).
//       //   Path: (0,0)->(0,1) -> score=1.
//       //   At (1,1), robber. Use 1 neutralization.
//       //   The coins collected from (0,0), (0,1) is 1.
//       //   The cost/gain at (1,1) after neutralization is 0. So total is 1.
//       //   Total cells traversed: (0,0), (0,1), (1,1). Total neutralizations = 1.
//       //   State at (1,1) with 1 neutralization used: dp[1][1][1] should be 1.
//       //   My DP formula: dp[1][1][1] = dp[0][1][0] - coins[1][1] = 1 - (-2) = 3. This is wrong.
//
//       // Let's look at the definition of `dp[i][j][k]`.
//       // `dp[i][j][k]` = max coins to reach (i, j) using EXACTLY k neutralizations *on the path*.
//       //
//       // Path (0,0)->(0,1)
//       // coins[0][0]=0, coins[0][1]=1. Total coins = 0 + 1 = 1.
//       // dp[0][0][0] = 0.
//       // dp[0][1][0] = dp[0][0][0] + coins[0][1] = 0 + 1 = 1. (Reached (0,1) with 0 neutralizations).
//
//       // Path (0,0)->(0,1)->(1,1)
//       // coins[1][1] = -2. Robber.
//       // Case 1: Don't use neutralization at (1,1).
//       //   We must have used 'k' neutralizations to reach (0,1). We are in state dp[0][1][k].
//       //   If k=0, we arrive at (1,1) with 0 neutralizations. Total coins = dp[0][1][0] + coins[1][1] = 1 + (-2) = -1.
//       //   So, dp[1][1][0] = -1.
//       // Case 2: Use neutralization at (1,1).
//       //   We must have used 'k_prev' neutralizations to reach (0,1), where k_prev = k - 1.
//       //   If k=1, we must have used k_prev=0 neutralizations to reach (0,1).
//       //   So, from dp[0][1][0], we use a neutralization at (1,1).
//       //   The effective value from (1,1) is 0 (neutralized the loss).
//       //   Total coins = dp[0][1][0] + 0 = 1 + 0 = 1.
//       //   So, dp[1][1][1] = 1.
//
//       // The example description states: "total coins = 1". This matches my dp[1][1][1] = 1.
//       // So the formula for robbing cells needs correction.
//       //
//       // If `next_coin_val < 0` (robber):
//       //   // Option 1: Use a neutralization at (i, j+1).
//       //   // Requires k < 2. New state is k+1. Gain is abs(next_coin_val).
//       //   if (k + 1 <= 2) {
//       //     // The profit comes from dp[i][j][k] PLUS the gain from neutralizing the robber.
//       //     // The gain is abs(next_coin_val).
//       //     dp[i][j+1][k+1] = max(dp[i][j+1][k+1], dp[i][j][k] + abs(next_coin_val)); // This is equivalent to dp[i][j][k] - next_coin_val
//       //   }
//       //   // Option 2: Do NOT use a neutralization at (i, j+1).
//       //   // The number of neutralizations used remains 'k'. The robber steals `next_coin_val`.
//       //   dp[i][j+1][k] = max(dp[i][j+1][k], dp[i][j][k] + next_coin_val);
//
//       // The problem: "the robot gains that many coins" or "robber steals".
//       // This implies the value `coins[i][j]` is always ADDED to the total.
//       // If `coins[i][j] >= 0`, add `coins[i][j]`.
//       // If `coins[i][j] < 0`, add `coins[i][j]` (which is a subtraction).
//       //
//       // If we neutralize a robber at cell (i,j) with value `C < 0`:
//       // Instead of adding `C` (losing `abs(C)`), we add `0`.
//       // The difference is `0 - C = -C = abs(C)`.
//       // So if we have profit `P` and reach a robber cell with value `C`,
//       // Not neutralizing: new profit = `P + C`.
//       // Neutralizing: new profit = `P + 0`. The gain is `(P + 0) - (P + C) = -C = abs(C)`.
//       // So, if we are in state `dp[i][j][k]` and move to a robber cell `(i',j')` with value `C`,
//       // if we neutralize: `dp[i'][j'][k+1] = max(..., dp[i][j][k] + abs(C))`
//       // if we don't neutralize: `dp[i'][j'][k] = max(..., dp[i][j][k] + C)`
//
//       // This is the logic I had initially. Let's re-trace example 1 with this:
//       // coins = [[0,1,-1],[1,-2,3],[2,-3,4]]
//       // dp table (3x3x3) initialized to INF.
//       // INF = -1e18
//
//       // Base case (0,0): coins[0][0] = 0
//       // dp[0][0][0] = 0.
//
//       // i=0, j=0, k=0, dp[0][0][0] = 0
//       //   Move right to (0,1): coins[0][1] = 1 (>=0)
//       //     dp[0][1][0] = max(INF, 0 + 1) = 1.
//       //   Move down to (1,0): coins[1][0] = 1 (>=0)
//       //     dp[1][0][0] = max(INF, 0 + 1) = 1.
//
//       // i=0, j=1, k=0, dp[0][1][0] = 1
//       //   Move right to (0,2): coins[0][2] = -1 (<0) - ROBBER
//       //     Use neutralization (k=0 -> k=1):
//       //       dp[0][2][1] = max(INF, dp[0][1][0] + abs(-1)) = max(INF, 1 + 1) = 2.
//       //     Don't use neutralization (k=0 -> k=0):
//       //       dp[0][2][0] = max(INF, dp[0][1][0] + (-1)) = max(INF, 1 - 1) = 0.
//       //   Move down to (1,1): coins[1][1] = -2 (<0) - ROBBER
//       //     Use neutralization (k=0 -> k=1):
//       //       dp[1][1][1] = max(INF, dp[0][1][0] + abs(-2)) = max(INF, 1 + 2) = 3.
//       //     Don't use neutralization (k=0 -> k=0):
//       //       dp[1][1][0] = max(INF, dp[0][1][0] + (-2)) = max(INF, 1 - 2) = -1.
//
//       // i=1, j=0, k=0, dp[1][0][0] = 1
//       //   Move right to (1,1): coins[1][1] = -2 (<0) - ROBBER
//       //     Use neutralization (k=0 -> k=1):
//       //       dp[1][1][1] = max(3, dp[1][0][0] + abs(-2)) = max(3, 1 + 2) = 3. (No change)
//       //     Don't use neutralization (k=0 -> k=0):
//       //       dp[1][1][0] = max(-1, dp[1][0][0] + (-2)) = max(-1, 1 - 2) = -1. (No change)
//       //   Move down to (2,0): coins[2][0] = 2 (>=0)
//       //     dp[2][0][0] = max(INF, dp[1][0][0] + 2) = max(INF, 1 + 2) = 3.
//
//       // Let's trace the example path again with this DP logic.
//       // Path: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
//       // (0,0): dp[0][0][0] = 0
//       // (0,1): dp[0][1][0] = dp[0][0][0] + coins[0][1] = 0 + 1 = 1.
//       // (1,1): coins[1][1] = -2.
//       //   To reach (1,1) using 1 neutralization (from state dp[0][1][0]):
//       //     dp[1][1][1] = max(INF, dp[0][1][0] + abs(-2)) = 1 + 2 = 3.
//       //   To reach (1,1) using 0 neutralizations (from state dp[0][1][0]):
//       //     dp[1][1][0] = max(INF, dp[0][1][0] + coins[1][1]) = 1 + (-2) = -1.
//       //   The optimal for (1,1) with 1 neutralization is dp[1][1][1] = 3.
//
//       // (1,2): coins[1][2] = 3 (>=0)
//       //   We are coming from dp[1][1][1] = 3.
//       //   Next cell (1,2) is not a robber. Neutralization count stays 1.
//       //   dp[1][2][1] = max(INF, dp[1][1][1] + coins[1][2]) = 3 + 3 = 6.
//
//       // (2,2): coins[2][2] = 4 (>=0)
//       //   We are coming from dp[1][2][1] = 6.
//       //   Next cell (2,2) is not a robber. Neutralization count stays 1.
//       //   dp[2][2][1] = max(INF, dp[1][2][1] + coins[2][2]) = 6 + 4 = 10.
//
//       // Still 10. Let's check the path that gives 8.
//       // (0,0) = 0.
//       // (0,1) = 1. Total = 1.
//       // (1,1) = -2. Use 1 neutralization. Total = 1. (This implies effectively adding 0 from this cell's perspective, meaning the score *before* this cell was 1, and the score *after* this cell is 1).
//       // (1,2) = 3. Total = 1 + 3 = 4.
//       // (2,2) = 4. Total = 4 + 4 = 8.
//
//       // This implies when we use a neutralization at a robber cell (i,j) with value C (<0),
//       // the score from that cell contributes 0, and the total becomes `score_before_cell + 0`.
//       // This means the transition should be:
//       // If `next_coin_val < 0` AND we use neutralization (k -> k+1):
//       //   `dp[next_cell][k+1] = max(..., dp[current_cell][k] + 0)`  <-- This is wrong.
//       //   The problem is that "total coins = 1" after (1,1) means the profit accumulated *up to and including* (1,1) with 1 neutralization is 1.
//       //   If `coins[0][0]=0`, `coins[0][1]=1`, `coins[1][1]=-2`.
//       //   Path (0,0)->(0,1): score = 0+1=1.
//       //   Path (0,0)->(0,1)->(1,1), using neutralization at (1,1):
//       //   The contribution from (0,0) is 0.
//       //   The contribution from (0,1) is +1.
//       //   The contribution from (1,1) when neutralized is 0.
//       //   Total = 0 + 1 + 0 = 1.
//       //   So if we are at (i,j) with score `S` (using `k` neutralizations) and move to robber cell `(i',j')` with value `C`,
//       //   if we neutralize:
//       //     The new score for `(i',j')` with `k+1` neutralizations is `S + 0`.
//       //     `dp[i'][j'][k+1] = max(..., dp[i][j][k] + 0)` is NOT correct. It should be `dp[i][j][k] + (value of cell (i',j'))`.
//       //     The value of cell (i',j') when neutralized is 0.
//       //     So, `dp[i'][j'][k+1] = max(..., dp[i][j][k] + 0)`. This means the value added from the cell itself is 0.
//       //
//       //     If `coins[i'][j'] < 0` and we neutralize:
//       //       The state should represent the TOTAL coins.
//       //       The value added AT `(i',j')` is effectively `0`.
//       //       The transition: `dp[i'][j'][k+1] = max(..., dp[i][j][k] + 0)`.
//       //       This IS what `dp[i][j][k] + abs(coins[i'][j'])` represents if `abs(coins[i'][j'])` is the gain.
//       //       Example: `dp[0][1][0] = 1`. At `(1,1)` with `coins[1][1]=-2`.
//       //       Neutralizing: `dp[1][1][1] = dp[0][1][0] + abs(-2) = 1 + 2 = 3`. Still not matching.
//       //
//       // What if the DP state `dp[i][j][k]` stores the maximum profit to reach cell (i,j) with EXACTLY k neutralizations used *so far*.
//       // The profit accumulated is `sum of coins[x][y]` for all visited cells `(x,y)`.
//
//       // Let's re-read: "the robot gains that many coins. If coins[i][j] < 0, the robber steals the absolute value".
//       // This means the contribution of a cell `coins[i][j]` is ALWAYS ADDED.
//       // If `coins[i][j] >= 0`, we add `coins[i][j]`.
//       // If `coins[i][j] < 0`, we add `coins[i][j]` (a negative number).
//       //
//       // When we neutralize a robber:
//       // Instead of adding `coins[i][j]` (which is negative), we add `0`.
//       // The change in total profit is `0 - coins[i][j] = abs(coins[i][j])`.
//       // So the new total profit is `old_total_profit + abs(coins[i][j])`.
//       // This IS what `dp[i][j][k] + abs(next_coin_val)` means.
//       //
//       // Why does the example path give 8?
//       // Path: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
//       //
//       // (0,0) : coins = 0. Score = 0. Neutralizations = 0.
//       // (0,1) : coins = 1. Score = 0 + 1 = 1. Neutralizations = 0.
//       // (1,1) : coins = -2. Robber. Use 1 neutralization.
//       //   Previous score = 1.
//       //   If we don't use neutralization, score = 1 + (-2) = -1.
//       //   If we use neutralization, score = 1 + 0 (effectively).
//       //   The example says "total coins = 1". This means the score *after* accounting for (1,1) is 1.
//       //   So, if `P` is score before cell, and cell is `C` (<0):
//       //     Not neutralizing: `P + C`.
//       //     Neutralizing: `P + 0`.
//       //   This means the value added AT the robber cell when neutralizing is `0`.
//       //   The state `dp[i][j][k]` should be the total profit.
//       //   If we move from `dp[i][j][k]` (profit `P`) to cell `(i', j')` with value `C`:
//       //     If `C >= 0`: `dp[i'][j'][k] = max(..., P + C)`
//       //     If `C < 0`:
//       //       Don't neutralize: `dp[i'][j'][k] = max(..., P + C)`
//       //       Neutralize (if k < 2): `dp[i'][j'][k+1] = max(..., P + 0)`.
//       //       This looks like the correct interpretation.
//       //
//       // Let's retry with this rule:
//       // `dp[i][j][k]` = max profit to reach (i,j) using EXACTLY k neutralizations.
//
//       // Base case:
//       // `dp[0][0][0] = coins[0][0];`
//       // If `coins[0][0] < 0`:
//       //   `dp[0][0][1] = 0;` // Used 1 neutralization, value added is 0.
//
//       // Transition:
//       // For i from 0 to m-1:
//       //   For j from 0 to n-1:
//       //     For k from 0 to 2: // k = neutralizations used to reach (i, j)
//       //       if (dp[i][j][k] == INF) continue;
//
//       //       // Move RIGHT to (i, j+1)
//       //       if (j + 1 < n) {
//       //         int next_coin_val = coins[i][j+1];
//       //         if (next_coin_val >= 0) {
//       //           // No robber. Profit increases by next_coin_val. Neutralizations stay 'k'.
//       //           dp[i][j+1][k] = max(dp[i][j+1][k], dp[i][j][k] + next_coin_val);
//       //         } else { // Robber
//       //           // Option 1: Don't neutralize. Profit increases by next_coin_val. Neutralizations stay 'k'.
//       //           dp[i][j+1][k] = max(dp[i][j+1][k], dp[i][j][k] + next_coin_val);
//       //           // Option 2: Use neutralization. Profit increases by 0. Neutralizations become 'k+1'.
//       //           if (k + 1 <= 2) {
//       //             dp[i][j+1][k+1] = max(dp[i][j+1][k+1], dp[i][j][k] + 0);
//       //           }
//       //         }
//       //       }
//       //       // Move DOWN to (i+1, j) - similar logic
//       //       if (i + 1 < m) {
//       //         int next_coin_val = coins[i+1][j];
//       //         if (next_coin_val >= 0) {
//       //           dp[i+1][j][k] = max(dp[i+1][j][k], dp[i][j][k] + next_coin_val);
//       //         } else { // Robber
//       //           dp[i+1][j][k] = max(dp[i+1][j][k], dp[i][j][k] + next_coin_val);
//       //           if (k + 1 <= 2) {
//       //             dp[i+1][j][k+1] = max(dp[i+1][j][k+1], dp[i][j][k] + 0);
//       //           }
//       //         }
//       //       }
//       //
//       // Example 1 trace with this new logic:
//       // coins = [[0,1,-1],[1,-2,3],[2,-3,4]]
//       // m=3, n=3
//       // INF = -1e18
//       // dp table (3x3x3) initialized to INF.
//
//       // Base case (0,0): coins[0][0] = 0
//       // dp[0][0][0] = 0.
//       //
//       // i=0, j=0, k=0, dp[0][0][0] = 0
//       //   Move right to (0,1): coins[0][1] = 1 (>=0)
//       //     dp[0][1][0] = max(INF, 0 + 1) = 1.
//       //   Move down to (1,0): coins[1][0] = 1 (>=0)
//       //     dp[1][0][0] = max(INF, 0 + 1) = 1.
//
//       // i=0, j=1, k=0, dp[0][1][0] = 1
//       //   Move right to (0,2): coins[0][2] = -1 (<0) - ROBBER
//       //     Don't neutralize (k=0 -> k=0):
//       //       dp[0][2][0] = max(INF, dp[0][1][0] + (-1)) = max(INF, 1 - 1) = 0.
//       //     Neutralize (k=0 -> k=1):
//       //       dp[0][2][1] = max(INF, dp[0][1][0] + 0) = max(INF, 1 + 0) = 1.
//       //   Move down to (1,1): coins[1][1] = -2 (<0) - ROBBER
//       //     Don't neutralize (k=0 -> k=0):
//       //       dp[1][1][0] = max(INF, dp[0][1][0] + (-2)) = max(INF, 1 - 2) = -1.
//       //     Neutralize (k=0 -> k=1):
//       //       dp[1][1][1] = max(INF, dp[0][1][0] + 0) = max(INF, 1 + 0) = 1.
//
//       // i=1, j=0, k=0, dp[1][0][0] = 1
//       //   Move right to (1,1): coins[1][1] = -2 (<0) - ROBBER
//       //     Don't neutralize (k=0 -> k=0):
//       //       dp[1][1][0] = max(-1, dp[1][0][0] + (-2)) = max(-1, 1 - 2) = -1. (No change)
//       //     Neutralize (k=0 -> k=1):
//       //       dp[1][1][1] = max(1, dp[1][0][0] + 0) = max(1, 1 + 0) = 1. (No change)
//       //   Move down to (2,0): coins[2][0] = 2 (>=0)
//       //     dp[2][0][0] = max(INF, dp[1][0][0] + 2) = max(INF, 1 + 2) = 3.
//
//       // Now trace the example path: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
//       // (0,0): dp[0][0][0] = 0.
//       // (0,1): dp[0][1][0] = 1.
//       // (1,1): coins[1][1] = -2. Robber.
//       //   We want to reach (1,1) with 1 neutralization. We come from dp[0][1][0].
//       //   Use neutralization: dp[1][1][1] = dp[0][1][0] + 0 = 1. This matches the example's "total coins = 1".
//
//       // (1,2): coins[1][2] = 3 (>=0).
//       //   We are coming from dp[1][1][1] = 1.
//       //   Next cell (1,2) is not a robber. Neutralization count stays 1.
//       //   dp[1][2][1] = max(INF, dp[1][1][1] + coins[1][2]) = 1 + 3 = 4. Matches example's "total coins = 4".
//
//       // (2,2): coins[2][2] = 4 (>=0).
//       //   We are coming from dp[1][2][1] = 4.
//       //   Next cell (2,2) is not a robber. Neutralization count stays 1.
//       //   dp[2][2][1] = max(INF, dp[1][2][1] + coins[2][2]) = 4 + 4 = 8. Matches example's "total coins = 8".
//
//       // This logic seems correct and matches the example.
//       // The key is that when neutralizing a robber, the effective value added by that cell is 0.
//
//       // Space optimization is possible, but given constraints M,N <= 500, O(M*N*3) space should be fine.
//       // For a true space optimization to O(N*3), we'd use two rows (current and previous).
//       // Let's stick with the O(M*N*3) space for simplicity and correctness verification first.
//
//       // Need to handle `INF` correctly. If `dp[i][j][k]` is `INF`, it means that state is unreachable.
//       // So, when calculating `max(..., dp[i][j][k] + value)`, we should check if `dp[i][j][k]` is `INF`.
//       // If `dp[i][j][k] == INF`, then `dp[i][j][k] + value` will likely overflow or remain very small.
//       // It's better to check `if (dp[i][j][k] != INF)` before using it.
//
//       // Let's write the code using this logic.
//       // Use `long long` for DP table to avoid overflow with sums.
//       // The constraints on coin values are -1000 to 1000. Max path length is M+N-1 ~ 1000. Max possible sum could be ~1000 * 1000 = 1e6. Min possible sum could be ~1000 * -1000 = -1e6. Fits in `long long`.
//       // The INF value ` -1e18` is sufficiently small.
// */
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// Define a large negative value to represent unreachable states in DP.
const long long INF = -1e18; // Using -10^18

class Solution {
public:
    int maxMoney(vector<vector<int>>& coins) {
        int m = coins.size();
        int n = coins[0].size();

        // dp[i][j][k] will store the maximum profit to reach cell (i, j)
        // using exactly 'k' robber neutralizations on the path.
        // k can be 0, 1, or 2.
        vector<vector<vector<long long>>> dp(m, vector<vector<long long>>(n, vector<long long>(3, INF)));

        // Base case: Starting cell (0, 0).
        // If the starting cell has positive coins, we can reach it with 0 neutralizations.
        if (coins[0][0] >= 0) {
            dp[0][0][0] = coins[0][0];
        } else {
            // If the starting cell has negative coins (a robber), we MUST use a neutralization.
            // The value added by this cell becomes 0 if neutralized.
            // This state requires exactly 1 neutralization.
            dp[0][0][1] = 0;
        }

        // Iterate through the grid.
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                // Iterate through the number of neutralizations used to reach cell (i, j).
                for (int k = 0; k <= 2; ++k) {
                    // If the current state (i, j, k) is unreachable, skip it.
                    if (dp[i][j][k] == INF) {
                        continue;
                    }

                    // Explore moving RIGHT to cell (i, j+1).
                    if (j + 1 < n) {
                        int next_coin_val = coins[i][j + 1];

                        if (next_coin_val >= 0) {
                            // If the next cell has positive coins (no robber):
                            // The profit increases by the cell's value.
                            // The number of neutralizations used remains 'k'.
                            dp[i][j + 1][k] = max(dp[i][j + 1][k], dp[i][j][k] + next_coin_val);
                        } else {
                            // If the next cell has negative coins (a robber):

                            // Option 1: Do NOT use a neutralization at (i, j+1).
                            // The profit decreases by the absolute value of the robber's coins (i.e., adds the negative value).
                            // The number of neutralizations used remains 'k'.
                            dp[i][j + 1][k] = max(dp[i][j + 1][k], dp[i][j][k] + next_coin_val);

                            // Option 2: Use a neutralization at (i, j+1).
                            // This is only possible if we have neutralizations available (k < 2).
                            // When a robber is neutralized, the effective value added by that cell is 0.
                            // The number of neutralizations used becomes 'k + 1'.
                            if (k + 1 <= 2) {
                                dp[i][j + 1][k + 1] = max(dp[i][j + 1][k + 1], dp[i][j][k] + 0);
                            }
                        }
                    }

                    // Explore moving DOWN to cell (i+1, j).
                    if (i + 1 < m) {
                        int next_coin_val = coins[i + 1][j];

                        if (next_coin_val >= 0) {
                            // If the next cell has positive coins (no robber):
                            // The profit increases by the cell's value.
                            // The number of neutralizations used remains 'k'.
                            dp[i + 1][j][k] = max(dp[i + 1][j][k], dp[i][j][k] + next_coin_val);
                        } else {
                            // If the next cell has negative coins (a robber):

                            // Option 1: Do NOT use a neutralization at (i+1, j).
                            // The profit decreases by the absolute value of the robber's coins (i.e., adds the negative value).
                            // The number of neutralizations used remains 'k'.
                            dp[i + 1][j][k] = max(dp[i + 1][j][k], dp[i][j][k] + next_coin_val);

                            // Option 2: Use a neutralization at (i+1, j).
                            // This is only possible if we have neutralizations available (k < 2).
                            // When a robber is neutralized, the effective value added by that cell is 0.
                            // The number of neutralizations used becomes 'k + 1'.
                            if (k + 1 <= 2) {
                                dp[i + 1][j][k + 1] = max(dp[i + 1][j][k + 1], dp[i][j][k] + 0);
                            }
                        }
                    }
                }
            }
        }

        // The maximum profit to reach the bottom-right corner (m-1, n-1)
        // can be achieved using 0, 1, or 2 neutralizations.
        // We take the maximum among these possibilities.
        long long max_profit = INF;
        max_profit = max(max_profit, dp[m - 1][n - 1][0]);
        max_profit = max(max_profit, dp[m - 1][n - 1][1]);
        max_profit = max(max_profit, dp[m - 1][n - 1][2]);

        // If the destination is unreachable with any number of neutralizations,
        // the max_profit will still be INF. However, the problem guarantees
        // a path exists, and constraints usually imply a valid output.
        // In case of very negative results, the problem implies the answer can be negative.
        return (int)max_profit;
    }
};
```