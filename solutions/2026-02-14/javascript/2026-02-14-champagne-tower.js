/**
 * @file LeetCode Problem 799: Champagne Tower.
 * @summary Simulates champagne pouring into a pyramid-shaped tower of glasses and calculates the fullness of a specific glass.
 * @link https://leetcode.com/problems/champagne-tower/
 * @approach This problem can be solved using dynamic programming. We can simulate the flow of champagne row by row.
 * We can use a 2D array (or a 1D array for space optimization) to store the amount of champagne in each glass.
 * For each glass, if it contains more than 1 cup of champagne, the excess spills equally to the glass below and to its left,
 * and the glass below and to its right. We iterate up to the query_row, and then return the amount in the query_glass.
 *
 * Let dp[i][j] represent the amount of champagne in the j-th glass of the i-th row.
 * Base case: dp[0][0] = poured.
 * Transition: For each glass dp[i][j], if dp[i][j] > 1:
 *   - Excess to the left-down glass: (dp[i][j] - 1) / 2 goes to dp[i+1][j]
 *   - Excess to the right-down glass: (dp[i][j] - 1) / 2 goes to dp[i+1][j+1]
 * We ensure that each glass only holds a maximum of 1 cup; any excess flows down.
 *
 * Space Optimization: We only need the previous row's information to calculate the current row.
 * Therefore, we can use a 1D array where `dp[j]` represents the amount of champagne in the j-th glass of the *current* row being processed.
 * When calculating the next row, we can update this 1D array based on the current row's spills.
 *
 * Time Complexity Analysis: O(R*R), where R is the query_row. Since R is at most 100, this is effectively O(100*100), which is constant.
 * Space Complexity Analysis: O(R) for the 1D DP array, where R is the query_row. Since R is at most 100, this is effectively O(100), which is constant.
 */

/**
 * @param {number} poured
 * @param {number} query_row
 * @param {number} query_glass
 * @return {number}
 */
var champagneTower = function(poured, query_row, query_glass) {
    // Initialize a 2D array (or conceptually think of it as a list of lists)
    // to store the amount of champagne in each glass.
    // `tower[i]` will represent the i-th row.
    // `tower[i][j]` will represent the j-th glass in the i-th row.
    // We only need to store up to `query_row` + 1 rows because spills from `query_row`
    // don't affect glasses before it, and spills from glasses beyond `query_row`
    // are not needed for the query.
    const tower = Array(query_row + 1).fill(0).map(() => Array(query_row + 1).fill(0.0));

    // Pour the initial champagne into the top glass.
    tower[0][0] = poured;

    // Iterate through each row up to the query_row.
    for (let i = 0; i < query_row; i++) {
        // Iterate through each glass in the current row `i`.
        // The number of glasses in row `i` is `i + 1`.
        for (let j = 0; j <= i; j++) {
            // If the current glass has more than 1 cup of champagne,
            // calculate the excess and distribute it to the glasses below.
            if (tower[i][j] > 1) {
                // Calculate the excess champagne.
                const excess = tower[i][j] - 1;
                // Each of the two glasses below receives half of the excess.
                const spill_amount = excess / 2.0;

                // Distribute to the glass directly below and to the left (i+1, j).
                tower[i + 1][j] += spill_amount;
                // Distribute to the glass directly below and to the right (i+1, j+1).
                tower[i + 1][j + 1] += spill_amount;

                // The current glass is now considered full (holds only 1 cup).
                // We don't explicitly set it to 1 here because subsequent calculations
                // will use the original `tower[i][j]`'s spilled amount for the next row.
                // However, in a strict interpretation, we could set `tower[i][j] = 1.0`
                // to represent the glass holding at most 1.0. But for the flow,
                // the `excess` calculation correctly handles this.
            }
        }
    }

    // The amount of champagne in the target glass is `tower[query_row][query_glass]`.
    // However, a glass can only hold 1 cup. So, if the calculated amount is greater than 1,
    // it means the glass is full, and the value should be capped at 1.0.
    // The `Math.min` function ensures this capping.
    return Math.min(1.0, tower[query_row][query_glass]);
};
```