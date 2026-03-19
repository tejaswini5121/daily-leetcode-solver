/**
 * @file LeetCode problem: Count Submatrices With Equal Frequency of X and Y.
 * @summary Counts submatrices with equal 'X' and 'Y' frequencies and at least one 'X'.
 * @link https://leetcode.com/problems/count-submatrices-with-equal-frequency-of-x-and-y/
 *
 * @approach
 * This problem can be efficiently solved using prefix sums. We need to count submatrices that satisfy three conditions:
 * 1. They must contain grid[0][0]. This means all valid submatrices will have their top-left corner at (0,0).
 * 2. The frequency of 'X' must equal the frequency of 'Y' within the submatrix.
 * 3. The submatrix must contain at least one 'X'.
 *
 * Since all submatrices must include grid[0][0], we only need to consider submatrices defined by their bottom-right corner (r, c),
 * where 0 <= r < m and 0 <= c < n (m is number of rows, n is number of columns).
 *
 * We can precompute two 2D prefix sum arrays:
 * 1. `prefixX[i][j]`: The count of 'X's in the rectangle from (0,0) to (i-1, j-1).
 * 2. `prefixY[i][j]`: The count of 'Y's in the rectangle from (0,0) to (i-1, j-1).
 *
 * The formula for calculating prefix sums is:
 * `prefixX[i][j] = prefixX[i-1][j] + prefixX[i][j-1] - prefixX[i-1][j-1] + (grid[i-1][j-1] === 'X' ? 1 : 0)`
 * Similarly for `prefixY`.
 *
 * For each cell (r, c) as a potential bottom-right corner of a submatrix (including grid[0][0]), we can get the count of 'X's and 'Y's
 * in the submatrix ending at (r, c) by directly using the prefix sum values:
 * `countX = prefixX[r+1][c+1]`
 * `countY = prefixY[r+1][c+1]`
 *
 * Then, we check the conditions:
 * - `countX === countY`
 * - `countX > 0` (This also implies `countY > 0` if `countX === countY`, and satisfies the "at least one 'X'" condition).
 *
 * If both conditions are met, we increment our total count of valid submatrices.
 *
 * @timeComplexity O(m * n), where m is the number of rows and n is the number of columns in the grid.
 *   We iterate through the grid once to build the prefix sum arrays, and then iterate through the grid again to check each submatrix.
 * @spaceComplexity O(m * n) for storing the two prefix sum arrays.
 */

/**
 * @param {character[][]} grid
 * @return {number}
 */
var countSubmatrices = function(grid) {
    const m = grid.length;
    const n = grid[0].length;

    // Initialize prefix sum arrays.
    // prefixX[i][j] will store the count of 'X's in the subgrid from (0,0) to (i-1, j-1).
    // prefixY[i][j] will store the count of 'Y's in the subgrid from (0,0) to (i-1, j-1).
    // We use dimensions (m+1) x (n+1) to handle 1-based indexing for easier prefix sum calculations.
    const prefixX = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    const prefixY = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

    // Populate the prefix sum arrays.
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            // Calculate prefixX
            prefixX[i + 1][j + 1] = prefixX[i][j + 1] + prefixX[i + 1][j] - prefixX[i][j] + (grid[i][j] === 'X' ? 1 : 0);
            // Calculate prefixY
            prefixY[i + 1][j + 1] = prefixY[i][j + 1] + prefixY[i + 1][j] - prefixY[i][j] + (grid[i][j] === 'Y' ? 1 : 0);
        }
    }

    let count = 0; // Initialize the counter for valid submatrices.

    // Iterate through all possible bottom-right corners of submatrices.
    // Since all submatrices must include grid[0][0], we iterate from (0,0) to (m-1, n-1).
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            // Get the total count of 'X's and 'Y's in the submatrix ending at (r, c)
            // using the precomputed prefix sums.
            const countX = prefixX[r + 1][c + 1];
            const countY = prefixY[r + 1][c + 1];

            // Check the conditions for a valid submatrix:
            // 1. Equal frequency of 'X' and 'Y'.
            // 2. At least one 'X' (which implies countX > 0).
            if (countX === countY && countX > 0) {
                count++; // Increment the counter if the submatrix is valid.
            }
        }
    }

    return count; // Return the total number of valid submatrices.
};
```