// Problem: Flip Square Submatrix Vertically
// Link: https://leetcode.com/problems/flip-square-submatrix-vertically/
// Approach:
// The problem requires flipping a square submatrix vertically. This means reversing the order of rows within that specific square.
// We are given the top-left corner coordinates (x, y) and the size of the square submatrix (k).
// The submatrix spans from row x to x + k - 1 and from column y to y + k - 1.
// To flip it vertically, we need to swap rows. Specifically, the row at index `x + i` should be swapped with the row at index `x + k - 1 - i`, where `i` ranges from 0 up to (k / 2) - 1.
// For each swap, we only need to consider the columns within the submatrix, i.e., from y to y + k - 1.
// We can iterate from `i = 0` to `k / 2 - 1`. In each iteration, we'll perform a row swap between `grid[x + i]` and `grid[x + k - 1 - i]`.
// During the row swap, we'll only swap elements from column `y` to `y + k - 1`. This can be done by iterating from `j = 0` to `k - 1` and swapping `grid[x + i][y + j]` with `grid[x + k - 1 - i][y + j]`.
// A temporary variable will be used for the swap.
// Time Complexity:
// The outer loop iterates `k / 2` times. The inner loop iterates `k` times.
// Therefore, the total time complexity is O(k^2). Since k is at most min(m, n), in the worst case, it's O(min(m, n)^2).
// Space Complexity:
// We are modifying the matrix in-place and only using a single temporary variable for swapping.
// Therefore, the space complexity is O(1).
var flipSquareSubmatrixVertically = function(grid, x, y, k) {
    // Iterate through the top half of the submatrix rows to perform swaps.
    // We only need to iterate up to k/2 because each iteration swaps two rows.
    for (let i = 0; i < Math.floor(k / 2); i++) {
        // Calculate the indices of the two rows to be swapped.
        // `topRowIndex` is the current row from the top of the submatrix.
        let topRowIndex = x + i;
        // `bottomRowIndex` is the corresponding row from the bottom of the submatrix.
        let bottomRowIndex = x + k - 1 - i;

        // Iterate through the columns within the square submatrix.
        // We swap elements only within the specified column range [y, y + k - 1].
        for (let j = 0; j < k; j++) {
            // Calculate the current column index within the grid.
            let currentColIndex = y + j;

            // Swap the elements at `grid[topRowIndex][currentColIndex]` and `grid[bottomRowIndex][currentColIndex]`.
            // Use a temporary variable to hold one of the values during the swap.
            let temp = grid[topRowIndex][currentColIndex];
            grid[topRowIndex][currentColIndex] = grid[bottomRowIndex][currentColIndex];
            grid[bottomRowIndex][currentColIndex] = temp;
        }
    }
    // Return the modified grid.
    return grid;
};
```