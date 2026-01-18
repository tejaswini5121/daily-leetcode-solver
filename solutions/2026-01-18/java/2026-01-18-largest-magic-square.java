```java
/**
 * Problem Summary: Find the side length of the largest magic square within a given grid.
 * A magic square has equal row sums, column sums, and diagonal sums.
 * Link: https://leetcode.com/problems/largest-magic-square/
 *
 * Approach:
 * We can iterate through all possible top-left corners of a magic square and for each corner,
 * try to expand the square size. To efficiently check if a potential square is a magic square,
 * we precompute prefix sums for rows, columns, and diagonals.
 *
 * The maximum possible size of a magic square is min(m, n). We can iterate from this maximum
 * size down to 1. For a given size k, we iterate through all possible top-left corners (r, c)
 * such that a k x k square can be formed starting at (r, c).
 *
 * For each potential k x k square, we check:
 * 1. If all row sums are equal to the sum of the first row.
 * 2. If all column sums are equal to the sum of the first column.
 * 3. If the main diagonal sum is equal to the sum of the first row.
 * 4. If the anti-diagonal sum is equal to the sum of the first row.
 *
 * Prefix sums are used to calculate row, column, and diagonal sums in O(1) time.
 * Let `rowSum[i][j]` be the sum of elements from `grid[i][0]` to `grid[i][j]`.
 * Let `colSum[i][j]` be the sum of elements from `grid[0][j]` to `grid[i][j]`.
 * Let `diag1Sum[i][j]` be the sum of elements on the main diagonal ending at `grid[i][j]`.
 * Let `diag2Sum[i][j]` be the sum of elements on the anti-diagonal ending at `grid[i][j]`.
 *
 * The precomputation of prefix sums takes O(m*n) time.
 * The checking function `isMagic(r, c, k)` uses prefix sums to calculate sums in O(1).
 *
 * The outer loops iterate through potential top-left corners and sizes.
 * For a given size `k`, there are O(m*n) possible top-left corners.
 * The `isMagic` check takes O(k) time (to check k rows, k columns, 2 diagonals).
 *
 * However, we can optimize `isMagic` to O(1) using precomputed prefix sums.
 *
 * Let's refine the prefix sum approach.
 * `rowPrefixSum[i][j]` = sum of grid[i][0]...grid[i][j]
 * `colPrefixSum[i][j]` = sum of grid[0][j]...grid[i][j]
 *
 * To check a k x k square starting at (r, c):
 * Target sum = sum of `grid[r][c]` to `grid[r][c+k-1]`
 *
 * Row sums: For each row `i` from `r` to `r+k-1`:
 *   Sum = `rowPrefixSum[i][c+k-1]` - (`c > 0` ? `rowPrefixSum[i][c-1]` : 0)
 *   Check if equal to target sum.
 *
 * Column sums: For each col `j` from `c` to `c+k-1`:
 *   Sum = `colPrefixSum[r+k-1][j]` - (`r > 0` ? `colPrefixSum[r-1][j]` : 0)
 *   Check if equal to target sum.
 *
 * Main diagonal sum: Sum of `grid[r+i][c+i]` for `i` from 0 to `k-1`.
 * This can be computed efficiently with a separate prefix sum for main diagonals or by summing.
 *
 * Anti-diagonal sum: Sum of `grid[r+i][c+k-1-i]` for `i` from 0 to `k-1`.
 * This can be computed efficiently with a separate prefix sum for anti-diagonals or by summing.
 *
 * The most efficient way to check is to iterate from largest k down to 1.
 * For a fixed k, iterate through all possible top-left corners (r, c).
 * For each potential square, calculate its row sums, column sums, and diagonal sums
 * and check if they are all equal.
 *
 * Using 2D prefix sums for rows and columns:
 * `rowPrefixSum[i][j]` = sum of grid[i][0...j]
 * `colPrefixSum[i][j]` = sum of grid[0...i][j]
 *
 * Sum of row `i` from `c` to `c+k-1`: `rowPrefixSum[i][c+k-1] - (c > 0 ? rowPrefixSum[i][c-1] : 0)`
 * Sum of col `j` from `r` to `r+k-1`: `colPrefixSum[r+k-1][j] - (r > 0 ? colPrefixSum[r-1][j] : 0)`
 *
 * This still requires iterating k times for diagonals.
 *
 * A better approach:
 * Precompute prefix sums for rows, columns, and both diagonals.
 * `rowSum[i][j]` = sum of grid[i][0]...grid[i][j]
 * `colSum[i][j]` = sum of grid[0][j]...grid[i][j]
 * `diag1Sum[i][j]` = sum of elements on the main diagonal where `row - col == i - j` and the diagonal ends at `grid[i][j]`.
 * `diag2Sum[i][j]` = sum of elements on the anti-diagonal where `row + col == i + j` and the diagonal ends at `grid[i][j]`.
 *
 * For a k x k square starting at (r, c):
 * We need to verify that:
 * 1. `grid[r][c]` + ... + `grid[r][c+k-1]` (first row sum) == `grid[r+i][c]` + ... + `grid[r+i][c+k-1]` (other row sums) for `i` in [1, k-1]
 * 2. `grid[r][c]` + ... + `grid[r][c+k-1]` (first row sum) == `grid[r][c+j]` + ... + `grid[r+k-1][c+j]` (other col sums) for `j` in [1, k-1]
 * 3. `grid[r][c]` + ... + `grid[r+k-1][c+k-1]` (main diagonal sum) == first row sum
 * 4. `grid[r][c+k-1]` + ... + `grid[r+k-1][c]` (anti-diagonal sum) == first row sum
 *
 * With prefix sums:
 * `rowSum[i][j]` = sum of `grid[i][0]` to `grid[i][j]`.
 * `colSum[i][j]` = sum of `grid[0][j]` to `grid[i][j]`.
 * `mainDiag[i][j]` = sum of `grid[x][y]` where `x - y == i - j` and `x <= i, y <= j`.
 * `antiDiag[i][j]` = sum of `grid[x][y]` where `x + y == i + j` and `x <= i, y <= j`.
 *
 * Precomputation:
 * `rowSum[i][j] = grid[i][j] + (j > 0 ? rowSum[i][j-1] : 0)`
 * `colSum[i][j] = grid[i][j] + (i > 0 ? colSum[i-1][j] : 0)`
 * `mainDiag[i][j] = grid[i][j] + (i > 0 && j > 0 ? mainDiag[i-1][j-1] : 0)`
 * `antiDiag[i][j] = grid[i][j] + (i > 0 && j < n-1 ? antiDiag[i-1][j+1] : 0)`
 *
 * Note: The definition of `mainDiag` and `antiDiag` here is based on ending point.
 * For a k x k square starting at (r, c), the main diagonal elements are `grid[r+i][c+i]` for `i=0...k-1`.
 * The sum can be computed as: `mainDiag[r+k-1][c+k-1] - (r>0 && c>0 ? mainDiag[r-1][c-1] : 0)` (this definition is problematic).
 *
 * Let's redefine prefix sums to be more useful for submatrix sums:
 * `psRow[i][j]` = sum of grid[i][0]...grid[i][j]
 * `psCol[i][j]` = sum of grid[0][j]...grid[i][j]
 *
 * This approach seems too complex for O(1) diagonal sums.
 *
 * Alternative approach: Brute force with optimizations.
 * Iterate through all possible top-left corners (r, c).
 * For each (r, c), iterate through all possible sizes `k` from 1 up to `min(m-r, n-c)`.
 * For each `k`, check if the `k x k` square starting at `(r, c)` is a magic square.
 * To check if a `k x k` square is magic:
 *   Calculate the sum of the first row. Let this be `magicSum`.
 *   Check if all other row sums, column sums, and both diagonal sums equal `magicSum`.
 *
 * To speed up sum calculations:
 * Precompute `rowPrefixSum[i][j]` = sum of `grid[i][0]` to `grid[i][j]`.
 * Precompute `colPrefixSum[i][j]` = sum of `grid[0][j]` to `grid[i][j]`.
 *
 * `rowSum(r, c, k)` = `rowPrefixSum[r][c+k-1] - (c > 0 ? rowPrefixSum[r][c-1] : 0)`
 * `colSum(r, c, k)` = `colPrefixSum[r+k-1][c] - (r > 0 ? colPrefixSum[r-1][c] : 0)`
 *
 * Diagonal sums still need O(k) computation for each check.
 *
 * Let's reconsider the largest `k` first.
 * Iterate `k` from `min(m, n)` down to 1.
 * For each `k`, iterate through all possible top-left corners `(r, c)` such that a `k x k` square fits.
 *   (r from 0 to `m-k`, c from 0 to `n-k`)
 *   Check if the `k x k` square at `(r, c)` is a magic square.
 *   If it is, return `k`.
 *
 * Function `isMagic(grid, r, c, k)`:
 *   Calculate `magicSum = sum of grid[r][c]` to `grid[r][c+k-1]` (first row).
 *   Check other row sums (O(k) rows * O(k) elements = O(k^2) if done naively per row).
 *   Check column sums (O(k) cols * O(k) elements = O(k^2)).
 *   Check main diagonal sum (O(k)).
 *   Check anti-diagonal sum (O(k)).
 *
 *   Total check for `isMagic` is O(k^2).
 *   Outer loops: `k` from `min(m, n)` down to 1. For each `k`, O((m-k+1)*(n-k+1)) top-left corners.
 *   Total time complexity: Sum over `k` of `k^2 * (m-k+1)*(n-k+1)`. This is roughly O(min(m,n)^3 * m * n).
 *   With m, n <= 50, this is too slow.
 *
 * We need O(1) sum checks per potential magic square.
 *
 * Precomputation:
 * `rowSum[i][j]` = sum of `grid[i][0]` to `grid[i][j]`
 * `colSum[i][j]` = sum of `grid[0][j]` to `grid[i][j]`
 * `diag1Sum[i][j]` = sum of elements on the main diagonal starting from top-left and ending at `grid[i][j]`.
 *   Specifically, for `grid[x][y]` where `x-y = i-j`. The sum is for elements `grid[r+p][c+p]` where `0 <= p < k`.
 *   This sum is `diag1Sum[r+k-1][c+k-1] - (r>0 ? diag1Sum[r-1][c-1] : 0)` IF `diag1Sum[i][j]` is sum of `grid[x][y]` where `x-y = const` and `x <= i, y <= j`.
 *   This still feels complicated to define a prefix sum for arbitrary diagonals.
 *
 * Let's try a different definition for prefix sums:
 * `rs[i][j]`: sum of `grid[i][0...j]`
 * `cs[i][j]`: sum of `grid[0...i][j]`
 *
 * For a k x k square starting at `(r, c)`:
 * Target sum `S`.
 * Row `i` sum (for `r <= i < r+k`): `rs[i][c+k-1] - (c > 0 ? rs[i][c-1] : 0)`
 * Col `j` sum (for `c <= j < c+k`): `cs[r+k-1][j] - (r > 0 ? cs[r-1][j] : 0)`
 *
 * Main diagonal sum: `grid[r][c] + grid[r+1][c+1] + ... + grid[r+k-1][c+k-1]`.
 * Anti-diagonal sum: `grid[r][c+k-1] + grid[r+1][c+k-2] + ... + grid[r+k-1][c]`.
 *
 * These diagonal sums are the bottleneck.
 *
 * Let's use the approach from a similar problem or known solution pattern for magic squares.
 * The key is to check sums efficiently.
 *
 * We can iterate through all possible top-left corners `(r, c)` and for each, try to find the largest `k`.
 * For a fixed `(r, c)`, as `k` increases, we can update sums incrementally.
 *
 * For a `k x k` square starting at `(r, c)`:
 * Let `magicSum` be the sum of the first row.
 * When we expand to `(k+1) x (k+1)`:
 *  New row sum: sum of `grid[r+k][c]` to `grid[r+k][c+k]`.
 *  New col sum: sum of `grid[r][c+k]` to `grid[r+k][c+k]`.
 *  New main diagonal sum: `old_diag1_sum + grid[r+k][c+k]`.
 *  New anti-diagonal sum: `old_diag2_sum + grid[r+k][c]`.
 *
 * This incremental update is helpful.
 *
 * Let's iterate `k` from `min(m, n)` down to 1.
 * For each `k`, iterate `r` from 0 to `m-k` and `c` from 0 to `n-k`.
 *
 * Precompute:
 * `rowPrefixSum[i][j]` = sum of `grid[i][0]` to `grid[i][j]`
 * `colPrefixSum[i][j]` = sum of `grid[0][j]` to `grid[i][j]`
 *
 * `isMagic(r, c, k)` function:
 *   Calculate `magicSum = rowPrefixSum[r][c+k-1] - (c > 0 ? rowPrefixSum[r][c-1] : 0)`
 *   Check all other row sums: For `i` from `r+1` to `r+k-1`:
 *     `currentSum = rowPrefixSum[i][c+k-1] - (c > 0 ? rowPrefixSum[i][c-1] : 0)`
 *     If `currentSum != magicSum`, return `false`.
 *   Check all column sums: For `j` from `c` to `c+k-1`:
 *     `currentSum = colPrefixSum[r+k-1][j] - (r > 0 ? colPrefixSum[r-1][j] : 0)`
 *     If `currentSum != magicSum`, return `false`.
 *   Calculate main diagonal sum:
 *     `diag1Sum = 0`
 *     For `i` from 0 to `k-1`: `diag1Sum += grid[r+i][c+i]`
 *     If `diag1Sum != magicSum`, return `false`.
 *   Calculate anti-diagonal sum:
 *     `diag2Sum = 0`
 *     For `i` from 0 to `k-1`: `diag2Sum += grid[r+i][c+k-1-i]`
 *     If `diag2Sum != magicSum`, return `false`.
 *   Return `true`.
 *
 * Time complexity:
 * Precomputation of `rowPrefixSum` and `colPrefixSum`: O(m*n).
 * Outer loops: `k` from `min(m,n)` down to 1. For each `k`, O((m-k+1)*(n-k+1)) pairs of `(r, c)`.
 * `isMagic` function: O(k) for row checks, O(k) for col checks, O(k) for diag1, O(k) for diag2. Total O(k).
 *
 * Total complexity: O(m*n) + Sum_{k=1 to min(m,n)} (m-k+1)*(n-k+1)*k
 * Roughly, this is O(min(m,n) * m * n * min(m,n)) = O(min(m,n)^2 * m * n).
 * With m, n <= 50, this is 50^2 * 50 * 50 = 6,250,000 operations, which should be acceptable.
 *
 * Let's implement this.
 *
 * Space complexity: O(m*n) for prefix sum arrays.
 */
class Solution {
    public int largestMagicSquare(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        // Precompute row prefix sums
        // rs[i][j] stores the sum of elements grid[i][0]...grid[i][j]
        int[][] rs = new int[m][n];
        for (int i = 0; i < m; i++) {
            rs[i][0] = grid[i][0];
            for (int j = 1; j < n; j++) {
                rs[i][j] = rs[i][j - 1] + grid[i][j];
            }
        }

        // Precompute column prefix sums
        // cs[i][j] stores the sum of elements grid[0][j]...grid[i][j]
        int[][] cs = new int[m][n];
        for (int j = 0; j < n; j++) {
            cs[0][j] = grid[0][j];
            for (int i = 1; i < m; i++) {
                cs[i][j] = cs[i - 1][j] + grid[i][j];
            }
        }

        // Iterate through possible sizes of magic squares from largest to smallest
        for (int k = Math.min(m, n); k >= 1; k--) {
            // Iterate through all possible top-left corners (r, c) for a k x k square
            for (int r = 0; r <= m - k; r++) {
                for (int c = 0; c <= n - k; c++) {
                    // Check if the k x k square starting at (r, c) is a magic square
                    if (isMagic(grid, rs, cs, r, c, k)) {
                        return k; // Found the largest magic square
                    }
                }
            }
        }

        return 1; // Every 1x1 grid is a magic square, so minimum is 1
    }

    /**
     * Checks if a k x k subgrid starting at (r, c) is a magic square.
     *
     * @param grid The original grid.
     * @param rs   The precomputed row prefix sums.
     * @param cs   The precomputed column prefix sums.
     * @param r    The starting row index of the subgrid.
     * @param c    The starting column index of the subgrid.
     * @param k    The size (side length) of the subgrid.
     * @return true if the subgrid is a magic square, false otherwise.
     */
    private boolean isMagic(int[][] grid, int[][] rs, int[][] cs, int r, int c, int k) {
        // Calculate the target sum from the first row of the k x k square
        // This sum is grid[r][c] + ... + grid[r][c+k-1]
        // Using row prefix sums: rs[r][c+k-1] - (c > 0 ? rs[r][c-1] : 0)
        int magicSum = rs[r][c + k - 1] - (c > 0 ? rs[r][c - 1] : 0);

        // Check all other row sums
        // For each row i from r+1 to r+k-1
        for (int i = r + 1; i < r + k; i++) {
            // Sum of row i from column c to c+k-1
            int currentRowSum = rs[i][c + k - 1] - (c > 0 ? rs[i][c - 1] : 0);
            if (currentRowSum != magicSum) {
                return false; // Row sum does not match
            }
        }

        // Check all column sums
        // For each column j from c to c+k-1
        for (int j = c; j < c + k; j++) {
            // Sum of column j from row r to r+k-1
            // Using column prefix sums: cs[r+k-1][j] - (r > 0 ? cs[r-1][j] : 0)
            int currentColSum = cs[r + k - 1][j] - (r > 0 ? cs[r - 1][j] : 0);
            if (currentColSum != magicSum) {
                return false; // Column sum does not match
            }
        }

        // Check the main diagonal sum
        // Elements are grid[r][c], grid[r+1][c+1], ..., grid[r+k-1][c+k-1]
        int mainDiagonalSum = 0;
        for (int i = 0; i < k; i++) {
            mainDiagonalSum += grid[r + i][c + i];
        }
        if (mainDiagonalSum != magicSum) {
            return false; // Main diagonal sum does not match
        }

        // Check the anti-diagonal sum
        // Elements are grid[r][c+k-1], grid[r+1][c+k-2], ..., grid[r+k-1][c]
        int antiDiagonalSum = 0;
        for (int i = 0; i < k; i++) {
            antiDiagonalSum += grid[r + i][c + k - 1 - i];
        }
        if (antiDiagonalSum != magicSum) {
            return false; // Anti-diagonal sum does not match
        }

        // If all checks pass, it's a magic square
        return true;
    }
}
```