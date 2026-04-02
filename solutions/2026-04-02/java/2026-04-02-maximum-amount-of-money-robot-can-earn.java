/**
 * Problem Summary:
 * Find the maximum profit a robot can earn by traversing a grid from top-left to bottom-right,
 * moving only right or down. The robot can neutralize at most 2 negative coin cells (robbers).
 *
 * Problem Link: https://leetcode.com/problems/maximum-amount-of-money-robot-can-earn/
 *
 * Approach:
 * This problem can be solved using dynamic programming. Since the robot has a special ability
 * to neutralize at most 2 robbers, we need to keep track of the number of neutralizations
 * used.
 *
 * We can define a 3D DP state: dp[i][j][k] represents the maximum profit the robot can achieve
 * to reach cell (i, j) having used 'k' neutralizations (where k can be 0, 1, or 2).
 *
 * The transitions will be:
 * To reach (i, j) from (i-1, j) (moving down):
 *   dp[i][j][k] = max(dp[i][j][k], dp[i-1][j][k] + coins[i][j]) if coins[i][j] >= 0
 *   dp[i][j][k] = max(dp[i][j][k], dp[i-1][j][k-1] + coins[i][j]) if coins[i][j] < 0 and k > 0
 *
 * To reach (i, j) from (i, j-1) (moving right):
 *   dp[i][j][k] = max(dp[i][j][k], dp[i][j-1][k] + coins[i][j]) if coins[i][j] >= 0
 *   dp[i][j][k] = max(dp[i][j][k], dp[i][j-1][k-1] + coins[i][j]) if coins[i][j] < 0 and k > 0
 *
 * Initialization:
 * Initialize all DP states to a very small negative number to represent unreachable states.
 * For the starting cell (0, 0):
 *   If coins[0][0] >= 0:
 *     dp[0][0][0] = coins[0][0]
 *   If coins[0][0] < 0:
 *     dp[0][0][1] = coins[0][0] // Use 1 neutralization for the first cell
 *
 * Base Cases:
 * For the first row (i=0, j > 0):
 *   The robot can only come from the left.
 *   For each number of neutralizations k (0, 1, 2):
 *     If coins[0][j] >= 0:
 *       dp[0][j][k] = dp[0][j-1][k] + coins[0][j]
 *     If coins[0][j] < 0 and k > 0:
 *       dp[0][j][k] = dp[0][j-1][k-1] + coins[0][j]
 *
 * For the first column (j=0, i > 0):
 *   The robot can only come from above.
 *   For each number of neutralizations k (0, 1, 2):
 *     If coins[i][0] >= 0:
 *       dp[i][0][k] = dp[i-1][0][k] + coins[i][0]
 *     If coins[i][0] < 0 and k > 0:
 *       dp[i][0][k] = dp[i-1][0][k-1] + coins[i][0]
 *
 * The final answer will be the maximum value among dp[m-1][n-1][0], dp[m-1][n-1][1], and dp[m-1][n-1][2].
 *
 * To handle negative infinities properly, we can initialize with a value like -1e18.
 *
 * Time Complexity Analysis:
 * O(m * n * k), where m is the number of rows, n is the number of columns, and k is the maximum number of
 * neutralizations (which is 3 in this case: 0, 1, or 2).
 * So, the time complexity is O(m * n).
 *
 * Space Complexity Analysis:
 * O(m * n * k), where m is the number of rows, n is the number of columns, and k is the maximum number of
 * neutralizations.
 * So, the space complexity is O(m * n).
 */
class Solution {
    public int maximumMoney(int[][] coins) {
        int m = coins.length;
        int n = coins[0].length;
        // dp[i][j][k] will store the maximum money earned to reach cell (i, j) using k neutralizations.
        // k can be 0, 1, or 2.
        long[][][] dp = new long[m][n][3];

        // Initialize dp table with a very small negative value to represent unreachable states.
        // Using Long.MIN_VALUE/2 to avoid overflow issues when adding to it.
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                for (int k = 0; k < 3; k++) {
                    dp[i][j][k] = Long.MIN_VALUE / 2;
                }
            }
        }

        // Base case: starting cell (0, 0)
        if (coins[0][0] >= 0) {
            dp[0][0][0] = coins[0][0];
        } else {
            // If the starting cell has a robber, we must use one neutralization.
            dp[0][0][1] = coins[0][0];
        }

        // Fill the first row
        for (int j = 1; j < n; j++) {
            for (int k = 0; k < 3; k++) {
                if (coins[0][j] >= 0) {
                    // If current cell has coins, we can reach it from the left with the same number of neutralizations.
                    dp[0][j][k] = dp[0][j - 1][k] + coins[0][j];
                } else {
                    // If current cell has a robber, we need to have one neutralization available (k > 0).
                    if (k > 0) {
                        dp[0][j][k] = dp[0][j - 1][k - 1] + coins[0][j];
                    }
                }
            }
        }

        // Fill the first column
        for (int i = 1; i < m; i++) {
            for (int k = 0; k < 3; k++) {
                if (coins[i][0] >= 0) {
                    // If current cell has coins, we can reach it from above with the same number of neutralizations.
                    dp[i][0][k] = dp[i - 1][0][k] + coins[i][0];
                } else {
                    // If current cell has a robber, we need to have one neutralization available (k > 0).
                    if (k > 0) {
                        dp[i][0][k] = dp[i - 1][0][k - 1] + coins[i][0];
                    }
                }
            }
        }

        // Fill the rest of the dp table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                for (int k = 0; k < 3; k++) {
                    long profitFromAbove = Long.MIN_VALUE / 2;
                    long profitFromLeft = Long.MIN_VALUE / 2;

                    if (coins[i][j] >= 0) {
                        // If current cell has coins, the number of neutralizations used doesn't change.
                        profitFromAbove = dp[i - 1][j][k];
                        profitFromLeft = dp[i][j - 1][k];
                    } else {
                        // If current cell has a robber, we must use a neutralization if available (k > 0).
                        if (k > 0) {
                            profitFromAbove = dp[i - 1][j][k - 1];
                            profitFromLeft = dp[i][j - 1][k - 1];
                        }
                    }

                    // Take the maximum profit from either coming from above or from the left.
                    dp[i][j][k] = Math.max(profitFromAbove, profitFromLeft) + coins[i][j];
                }
            }
        }

        // The final answer is the maximum profit to reach the bottom-right corner (m-1, n-1)
        // using any of the allowed number of neutralizations (0, 1, or 2).
        long maxProfit = Math.max(dp[m - 1][n - 1][0], Math.max(dp[m - 1][n - 1][1], dp[m - 1][n - 1][2]));

        // The problem statement implies that even if all paths result in negative profit,
        // we should return that negative profit.
        // If maxProfit is still the initial very small negative value, it means the destination is unreachable.
        // However, with the given constraints (m, n >= 1), the destination is always reachable.
        return (int) maxProfit;
    }
}
