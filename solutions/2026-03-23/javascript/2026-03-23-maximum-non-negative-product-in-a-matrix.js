/**
 * @param {number[][]} grid
 * @return {number}
 */
// Problem: Maximum Non-Negative Product in a Matrix
// Link: https://leetcode.com/problems/maximum-non-negative-product-in-a-matrix/
//
// Approach:
// This problem can be solved using dynamic programming. We need to keep track of both the
// maximum and minimum possible products to reach each cell. This is because a negative number
// multiplied by a large negative number can result in a large positive number.
//
// For each cell (i, j), the maximum product ending at this cell can be obtained from:
// 1. The maximum product from the cell above (i-1, j) multiplied by grid[i][j].
// 2. The maximum product from the cell to the left (i, j-1) multiplied by grid[i][j].
// 3. The minimum product from the cell above (i-1, j) multiplied by grid[i][j] (if grid[i][j] is negative).
// 4. The minimum product from the cell to the left (i, j-1) multiplied by grid[i][j] (if grid[i][j] is negative).
//
// Similarly, for the minimum product ending at cell (i, j), we consider the same four cases.
//
// We initialize two DP tables: `maxProd` and `minProd` of the same dimensions as `grid`.
//
// Base case: `maxProd[0][0]` and `minProd[0][0]` are initialized with `grid[0][0]`.
//
// For the first row:
// `maxProd[0][j] = maxProd[0][j-1] * grid[0][j]`
// `minProd[0][j] = minProd[0][j-1] * grid[0][j]`
//
// For the first column:
// `maxProd[i][0] = maxProd[i-1][0] * grid[i][0]`
// `minProd[i][0] = minProd[i-1][0] * grid[i][0]`
//
// For the rest of the cells (i > 0 and j > 0):
// `currentVal = grid[i][j]`
// `options = [maxProd[i-1][j] * currentVal, minProd[i-1][j] * currentVal, maxProd[i][j-1] * currentVal, minProd[i][j-1] * currentVal]`
// `maxProd[i][j] = Math.max(...options)`
// `minProd[i][j] = Math.min(...options)`
//
// Finally, the result is `maxProd[m-1][n-1]`. If `maxProd[m-1][n-1]` is negative, we return -1.
// Otherwise, we return `maxProd[m-1][n-1] % (10^9 + 7)`.
//
// We use `BigInt` to handle potential overflow during intermediate calculations, as the grid values can be multiplied many times.
//
// Time Complexity: O(m * n), where m is the number of rows and n is the number of columns. We visit each cell once.
// Space Complexity: O(m * n) for the two DP tables.
//
const MOD = 1_000_000_007n; // Use BigInt for modulo operation

var maxNonNegativeProduct = function(grid) {
    const m = grid.length;
    const n = grid[0].length;

    // Initialize DP tables to store maximum and minimum products ending at each cell.
    // We use BigInt to prevent overflow during multiplication.
    const maxProd = Array(m).fill(0).map(() => Array(n).fill(0n));
    const minProd = Array(m).fill(0).map(() => Array(n).fill(0n));

    // Base case: The starting cell (0, 0)
    maxProd[0][0] = BigInt(grid[0][0]);
    minProd[0][0] = BigInt(grid[0][0]);

    // Fill the first row
    for (let j = 1; j < n; j++) {
        const currentVal = BigInt(grid[0][j]);
        maxProd[0][j] = maxProd[0][j - 1] * currentVal;
        minProd[0][j] = minProd[0][j - 1] * currentVal;
    }

    // Fill the first column
    for (let i = 1; i < m; i++) {
        const currentVal = BigInt(grid[i][0]);
        maxProd[i][0] = maxProd[i - 1][0] * currentVal;
        minProd[i][0] = minProd[i - 1][0] * currentVal;
    }

    // Fill the rest of the DP tables
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            const currentVal = BigInt(grid[i][j]);

            // Calculate possible maximum and minimum products by coming from top or left
            const options = [
                maxProd[i - 1][j] * currentVal,
                minProd[i - 1][j] * currentVal,
                maxProd[i][j - 1] * currentVal,
                minProd[i][j - 1] * currentVal
            ];

            // Update maxProd and minProd for the current cell
            maxProd[i][j] = options.reduce((max, val) => (val > max ? val : max), -Infinity);
            minProd[i][j] = options.reduce((min, val) => (val < min ? val : min), Infinity);
        }
    }

    // The maximum non-negative product is in the bottom-right cell
    const result = maxProd[m - 1][n - 1];

    // If the maximum product is negative, return -1. Otherwise, return the product modulo 10^9 + 7.
    if (result < 0n) {
        return -1;
    } else {
        // Ensure the result is non-negative before modulo operation.
        // Although `result` is checked to be >= 0, this adds robustness if logic changes.
        return Number((result % MOD + MOD) % MOD);
    }
};
```