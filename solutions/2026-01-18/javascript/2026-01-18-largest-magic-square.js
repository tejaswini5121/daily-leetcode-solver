// Summary: Find the side length of the largest square subgrid where all row, column, and diagonal sums are equal.
// Link: https://leetcode.com/problems/largest-magic-square/
// Approach:
// The problem asks for the largest magic square within a given grid. A brute-force approach would be to check every possible square subgrid.
// For a grid of size m x n, a k x k subgrid can start at any position (r, c) such that r + k <= m and c + k <= n.
// For each potential k x k subgrid, we need to verify if it's a magic square. This involves calculating all row sums, column sums, and both diagonal sums and checking if they are equal.
//
// To efficiently calculate sums, we can precompute prefix sums for rows, columns, and diagonals.
// Let's define:
// - rowSum[r][c]: sum of elements in row r from column 0 to c-1.
// - colSum[r][c]: sum of elements in column c from row 0 to r-1.
// - diag1Sum[r][c]: sum of elements on the main diagonal passing through (r, c) from top-left to bottom-right.
// - diag2Sum[r][c]: sum of elements on the anti-diagonal passing through (r, c) from top-right to bottom-left.
//
// However, calculating prefix sums for diagonals is a bit more complex as the diagonal index needs to be handled.
// A more direct approach for checking a k x k subgrid starting at (sr, sc) is:
// 1. Calculate the expected magic sum from the first row (or any row/column/diagonal).
// 2. Iterate through all rows of the subgrid, calculate their sums, and compare with the magic sum.
// 3. Iterate through all columns of the subgrid, calculate their sums, and compare with the magic sum.
// 4. Calculate the sum of the main diagonal (top-left to bottom-right) and compare.
// 5. Calculate the sum of the anti-diagonal (top-right to bottom-left) and compare.
//
// The search for the largest k can be done by iterating k from min(m, n) down to 1. The first k for which we find a magic square is the answer.
//
// Precomputing prefix sums for rows and columns can speed up sum calculations for subgrids.
// Let `prefixRowSum[r][c]` be the sum of `grid[r][0]` to `grid[r][c-1]`.
// Let `prefixColSum[r][c]` be the sum of `grid[0][c]` to `grid[r-1][c]`.
//
// For a k x k subgrid starting at `(sr, sc)`:
// - Row sum for row `i` (0 <= i < k): `prefixRowSum[sr+i][sc+k] - prefixRowSum[sr+i][sc]`
// - Column sum for column `j` (0 <= j < k): `prefixColSum[sr+k][sc+j] - prefixColSum[sr][sc+j]`
//
// For diagonals, we can sum them directly for each subgrid.
//
// Time Complexity:
// Let m be the number of rows and n be the number of columns.
// The maximum possible size of a magic square is `min(m, n)`.
// We iterate `k` from `min(m, n)` down to 1.
// For each `k`, we iterate through all possible top-left corners `(sr, sc)` of a `k x k` subgrid. There are `(m-k+1) * (n-k+1)` such corners.
// For each subgrid, checking if it's a magic square takes O(k) time (summing diagonals and verifying other sums which are O(1) after prefix sums).
// So, the total time complexity is roughly:
// Sum from k=1 to min(m,n) of `(m-k+1) * (n-k+1) * k`.
// In the worst case, m ~ n. So, approximately Sum from k=1 to n of `(n-k+1)^2 * k`.
// This is roughly O(min(m, n)^4).
//
// With prefix sums for rows and columns, checking a subgrid:
// Row sums: O(k)
// Col sums: O(k)
// Diagonals: O(k)
// Total check: O(k)
//
// Precomputing prefix sums: O(m*n)
//
// The overall time complexity is dominated by checking subgrids: O(min(m, n)^4) if we consider the summation.
// If m and n are up to 50, min(m, n)^4 can be up to 50^4 = 6,250,000, which is feasible.
//
// Space Complexity:
// O(m*n) for storing prefix sums for rows and columns.
//
// Optimization: Instead of precomputing full prefix sums and then calculating sums of subsegments, we can directly calculate sums within the `isMagic` function. This might simplify the implementation slightly and the asymptotic space complexity remains the same if we optimize sum calculations.
// For this implementation, we'll use direct summation within `isMagic` for simplicity and to avoid complex prefix sum logic for diagonals.

/**
 * @param {number[][]} grid
 * @return {number}
 */
var largestMagicSquare = function(grid) {
    const m = grid.length;
    const n = grid[0].length;

    // Helper function to check if a k x k subgrid starting at (sr, sc) is a magic square
    const isMagic = (sr, sc, k) => {
        // Calculate the expected magic sum from the first row of the subgrid
        let magicSum = 0;
        for (let c = 0; c < k; c++) {
            magicSum += grid[sr][sc + c];
        }

        // Check row sums
        for (let r = 0; r < k; r++) {
            let currentRowSum = 0;
            for (let c = 0; c < k; c++) {
                currentRowSum += grid[sr + r][sc + c];
            }
            if (currentRowSum !== magicSum) {
                return false;
            }
        }

        // Check column sums
        for (let c = 0; c < k; c++) {
            let currentColSum = 0;
            for (let r = 0; r < k; r++) {
                currentColSum += grid[sr + r][sc + c];
            }
            if (currentColSum !== magicSum) {
                return false;
            }
        }

        // Check main diagonal sum (top-left to bottom-right)
        let mainDiagSum = 0;
        for (let i = 0; i < k; i++) {
            mainDiagSum += grid[sr + i][sc + i];
        }
        if (mainDiagSum !== magicSum) {
            return false;
        }

        // Check anti-diagonal sum (top-right to bottom-left)
        let antiDiagSum = 0;
        for (let i = 0; i < k; i++) {
            antiDiagSum += grid[sr + i][sc + k - 1 - i];
        }
        if (antiDiagSum !== magicSum) {
            return false;
        }

        // If all checks pass, it's a magic square
        return true;
    };

    // Iterate through possible sizes of magic squares, from largest to smallest
    // The maximum possible size is min(m, n)
    for (let k = Math.min(m, n); k >= 1; k--) {
        // Iterate through all possible top-left corners (sr, sc) for a k x k subgrid
        // sr can range from 0 to m - k
        // sc can range from 0 to n - k
        for (let sr = 0; sr <= m - k; sr++) {
            for (let sc = 0; sc <= n - k; sc++) {
                // If we find a magic square of size k, this is the largest one
                // because we are iterating k in decreasing order.
                if (isMagic(sr, sc, k)) {
                    return k;
                }
            }
        }
    }

    // This part should technically not be reached given constraints (1x1 is always magic),
    // but as a fallback. A 1x1 grid is always a magic square.
    return 1;
};
```