```java
/**
 * Problem Summary: Simulate champagne pouring into a pyramid of glasses and determine the fullness of a specific glass.
 * Link: https://leetcode.com/problems/champagne-tower/
 *
 * Approach:
 * This problem can be solved using dynamic programming. We can model the champagne flow as a 2D array (or a list of lists)
 * where `dp[i][j]` represents the amount of champagne in the j-th glass of the i-th row.
 *
 * We start with `poured` amount in the topmost glass `dp[0][0]`.
 * For each glass `dp[i][j]`, if it contains more than 1 cup of champagne (i.e., it's full and has excess),
 * the excess champagne `(dp[i][j] - 1.0)` flows equally to the glass directly below and to its left `dp[i+1][j]`
 * and the glass directly below and to its right `dp[i+1][j+1]`.
 *
 * We iterate through the rows and glasses, simulating the flow.
 * The final answer for the `query_row` and `query_glass` is the minimum of `dp[query_row][query_glass]` and 1.0,
 * as a glass can hold at most 1 cup of champagne.
 *
 * We can optimize space by noticing that the calculation for row `i` only depends on row `i-1`.
 * However, for simplicity and clarity given the constraints (row < 100), a 2D array is fine.
 *
 * Time Complexity: O(R^2), where R is the query_row. We iterate through at most R rows and R glasses per row.
 * Space Complexity: O(R^2), for storing the champagne amounts in the tower. If we optimize to only store the current and next row, it could be O(R).
 */
class Solution {
    public double champagneTower(int poured, int query_row, int query_glass) {
        // Initialize a 2D array to store the amount of champagne in each glass.
        // The size is (query_row + 1) x (query_row + 1) because the maximum number of glasses in a row
        // up to query_row is query_row + 1.
        double[][] dp = new double[query_row + 1][query_row + 1];

        // Pour the initial champagne into the top glass.
        dp[0][0] = poured;

        // Iterate through each row up to the query_row.
        for (int i = 0; i <= query_row; i++) {
            // Iterate through each glass in the current row.
            // The number of glasses in row 'i' is 'i + 1'.
            for (int j = 0; j <= i; j++) {
                // If the current glass has more than 1 cup of champagne, it overflows.
                if (dp[i][j] > 1.0) {
                    // Calculate the excess champagne.
                    double excess = dp[i][j] - 1.0;

                    // Distribute the excess equally to the two glasses below it.
                    // Each of the glasses below receives half of the excess.

                    // Left glass in the next row.
                    // The glass at dp[i+1][j] receives 'excess / 2.0'.
                    dp[i + 1][j] += excess / 2.0;

                    // Right glass in the next row.
                    // The glass at dp[i+1][j+1] receives 'excess / 2.0'.
                    dp[i + 1][j + 1] += excess / 2.0;

                    // Set the current glass to 1.0 as it can only hold a maximum of 1 cup.
                    // This step is implicitly handled by adding to the next row,
                    // and the final clipping to 1.0 happens at the return.
                    // However, it's conceptually important that dp[i][j] effectively becomes 1.0 for its own contribution.
                    // We don't strictly need to set dp[i][j] = 1.0 here because the calculation is based on dp[i][j] > 1.0
                    // and the excess is what matters for subsequent glasses.
                }
            }
        }

        // The amount of champagne in the query_glass of the query_row.
        // A glass can hold at most 1 cup of champagne.
        // So, we return the minimum of the calculated amount and 1.0.
        return Math.min(dp[query_row][query_glass], 1.0);
    }
}
```