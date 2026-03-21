```java
// Problem: Flip Square Submatrix Vertically
// Link: https://leetcode.com/problems/flip-square-submatrix-vertically/
// Approach:
// The problem requires flipping a square submatrix vertically. This means reversing the order of rows within the specified square.
// We are given the top-left corner (x, y) and the side length (k) of the square.
// The square submatrix spans from row x to x + k - 1 and from column y to y + k - 1.
// To flip it vertically, we need to swap rows. Specifically, we swap the i-th row from the top of the submatrix with the (k-1-i)-th row from the top of the submatrix.
// This swap should only occur for the columns within the submatrix's bounds (from y to y + k - 1).
// We can use a two-pointer approach for each row swap. For a given row index `r1` and `r2` within the submatrix, we iterate from `y` to `y + k - 1` and swap `grid[r1][c]` with `grid[r2][c]`.
// The outer loop will iterate from `i = 0` to `k / 2 - 1`, representing the pairs of rows to be swapped.
// For each `i`, the two rows to swap are `x + i` and `x + k - 1 - i`.
//
// Time Complexity:
// The outer loop runs `k / 2` times. The inner loop runs `k` times.
// Therefore, the total time complexity is O(k * k), which is O(k^2). Since k is at most min(m, n), this is O(min(m, n)^2).
// In the worst case, k can be equal to m and n if the grid is a square, leading to O(m*n) or O(n^2) if m=n.
//
// Space Complexity:
// We are modifying the input matrix in-place. No additional data structures are used that grow with the input size.
// Therefore, the space complexity is O(1).

class Solution {
    /**
     * Flips a square submatrix vertically.
     *
     * @param grid The input m x n integer matrix.
     * @param x    The row index of the top-left corner of the submatrix.
     * @param y    The column index of the top-left corner of the submatrix.
     * @param k    The side length of the square submatrix.
     * @return The updated matrix after flipping the submatrix.
     */
    public int[][] flipSquareSubmatrixVertically(int[][] grid, int x, int y, int k) {
        // Iterate through the rows that need to be swapped.
        // We only need to iterate up to k/2 because swapping the i-th row with the (k-1-i)-th row
        // covers both directions of the swap.
        for (int i = 0; i < k / 2; i++) {
            // Determine the indices of the two rows to be swapped.
            // `row1` is the i-th row from the top of the submatrix.
            int row1 = x + i;
            // `row2` is the i-th row from the bottom of the submatrix.
            int row2 = x + k - 1 - i;

            // Iterate through the columns within the submatrix to perform the row swap.
            // We swap elements column by column for the determined rows.
            for (int j = y; j < y + k; j++) {
                // Swap the elements at grid[row1][j] and grid[row2][j].
                int temp = grid[row1][j];
                grid[row1][j] = grid[row2][j];
                grid[row2][j] = temp;
            }
        }
        // Return the modified grid.
        return grid;
    }
}
```