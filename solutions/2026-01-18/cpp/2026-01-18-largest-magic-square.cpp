```cpp
// Problem: Largest Magic Square
// Link: https://leetcode.com/problems/largest-magic-square/
// Approach:
// The problem asks for the largest k x k subgrid that forms a magic square.
// A brute-force approach would be to iterate through all possible top-left corners (r, c)
// and all possible sizes k, and then check if the k x k subgrid starting at (r, c)
// is a magic square.
//
// To efficiently check if a subgrid is a magic square, we can precompute prefix sums
// for rows, columns, and diagonals.
//
// We can iterate through all possible sizes `k` from `min(m, n)` down to 1.
// For each `k`, we iterate through all possible top-left corners `(r, c)` of a `k x k` subgrid.
// For each subgrid, we calculate its row sums, column sums, and diagonal sums.
// If all these sums are equal, then we have found the largest magic square and can return `k`.
//
// To optimize the sum calculations, we can use 2D prefix sums.
// `rowSum[r][c]` will store the sum of elements in the `r`-th row from column 0 to `c`.
// `colSum[r][c]` will store the sum of elements in the `c`-th column from row 0 to `r`.
//
// For a k x k subgrid starting at (r, c):
// - Row sums: For each row `i` from `r` to `r + k - 1`, the sum of elements from `c` to `c + k - 1` can be calculated using `rowSum[i][c + k - 1] - rowSum[i][c - 1]` (handle `c=0` case).
// - Column sums: For each column `j` from `c` to `c + k - 1`, the sum of elements from `r` to `r + k - 1` can be calculated using `colSum[r + k - 1][j] - colSum[r - 1][j]` (handle `r=0` case).
// - Main diagonal sum (top-left to bottom-right): Sum of `grid[r+i][c+i]` for `i` from 0 to `k-1`.
// - Anti-diagonal sum (top-right to bottom-left): Sum of `grid[r+i][c+k-1-i]` for `i` from 0 to `k-1`.
//
// We can further optimize the diagonal sum calculation by precomputing diagonal prefix sums as well.
// `diag1Sum[r][c]` stores the sum of elements on the main diagonal ending at `(r, c)`.
// `diag2Sum[r][c]` stores the sum of elements on the anti-diagonal ending at `(r, c)`.
//
// However, the constraints `m, n <= 50` suggest that a simpler check for each subgrid might be acceptable
// without explicit 2D prefix sum arrays for rows and columns if we are careful with the loop bounds.
//
// Let's refine the approach:
// Iterate `k` from `min(m, n)` down to 1.
// For each `k`:
//   Iterate through all possible top-left corners `(r, c)` where `0 <= r <= m - k` and `0 <= c <= n - k`.
//   For each `(r, c)` subgrid of size `k`:
//     Calculate the expected sum. We can take the sum of the first row of this subgrid as the `magicSum`.
//     Check if all other row sums, all column sums, and both diagonal sums equal `magicSum`.
//     If all checks pass, return `k`.
//
// To calculate sums efficiently within the check:
// For a subgrid from `(r, c)` to `(r+k-1, c+k-1)`:
// - Row sums: Iterate `i` from `r` to `r+k-1`, sum `grid[i][j]` for `j` from `c` to `c+k-1`.
// - Column sums: Iterate `j` from `c` to `c+k-1`, sum `grid[i][j]` for `i` from `r` to `r+k-1`.
// - Main diagonal: Sum `grid[r+i][c+i]` for `i` from 0 to `k-1`.
// - Anti-diagonal: Sum `grid[r+i][c+k-1-i]` for `i` from 0 to `k-1`.
//
// This approach will still involve O(k) work to check each k x k subgrid.
// The total complexity will be roughly sum from k=1 to min(m,n) of (m-k+1)*(n-k+1)*k.
// This is approximately O(min(m,n)^3 * m * n), which might be too slow.
//
// Let's reconsider prefix sums. We can use 2D prefix sums for rows and columns.
// `prefixRowSum[i][j]` = sum of `grid[i][0]` to `grid[i][j-1]`.
// `prefixColSum[i][j]` = sum of `grid[0][j]` to `grid[i-1][j]`.
//
// `rowSum(r, c, k)` = sum of `grid[r][c]` to `grid[r][c+k-1]`. Using prefix sums: `prefixRowSum[r][c+k] - prefixRowSum[r][c]`.
// `colSum(r, c, k)` = sum of `grid[r][c]` to `grid[r+k-1][c]`. Using prefix sums: `prefixColSum[r+k][c] - prefixColSum[r][c]`.
//
// This would require `O(m*n)` preprocessing for prefix sums.
// Then, checking a `k x k` subgrid starting at `(r, c)`:
// - First row sum: `rowSum(r, c, k)`. Let this be `magicSum`.
// - For `i` from `r+1` to `r+k-1`: check `rowSum(i, c, k) == magicSum`.
// - For `j` from `c` to `c+k-1`: check `colSum(r, j, k) == magicSum`.
// - Main diagonal sum: Sum `grid[r+i][c+i]` for `i` from 0 to `k-1`.
// - Anti-diagonal sum: Sum `grid[r+i][c+k-1-i]` for `i` from 0 to `k-1`.
//
// The diagonal sums still take O(k) time.
// The overall complexity with prefix sums for rows/cols would be O(min(m,n) * m * n * k), which is still high.
//
// A more optimized approach would be to use 2D prefix sums for everything:
// `ps[i][j]` = sum of rectangle from (0,0) to (i-1, j-1).
// `ps_row[i][j]` = sum of row `i` from col 0 to `j-1`.
// `ps_col[i][j]` = sum of col `j` from row 0 to `i-1`.
// `ps_diag1[i][j]` = sum of main diagonal ending at `(i-1, j-1)`.
// `ps_diag2[i][j]` = sum of anti-diagonal ending at `(i-1, j-1)`.
//
// This is getting complicated. Let's consider a direct check of a k x k subgrid.
//
// For a given `k`, we iterate through all possible top-left corners `(r, c)`.
// For each `k x k` subgrid starting at `(r, c)`:
//
// 1. Calculate the target sum. Sum of the first row of this subgrid is a good candidate.
//    `targetSum = sum(grid[r][c+j] for j in 0 to k-1)`
//
// 2. Check all other row sums:
//    For `i` from `r+1` to `r+k-1`:
//      `currentSum = sum(grid[i][c+j] for j in 0 to k-1)`
//      If `currentSum != targetSum`, this is not a magic square.
//
// 3. Check all column sums:
//    For `j` from `c` to `c+k-1`:
//      `currentSum = sum(grid[r+i][j] for i in 0 to k-1)`
//      If `currentSum != targetSum`, this is not a magic square.
//
// 4. Check main diagonal sum:
//    `currentSum = sum(grid[r+i][c+i] for i in 0 to k-1)`
//    If `currentSum != targetSum`, this is not a magic square.
//
// 5. Check anti-diagonal sum:
//    `currentSum = sum(grid[r+i][c+k-1-i] for i in 0 to k-1)`
//    If `currentSum != targetSum`, this is not a magic square.
//
// If all checks pass, then `k` is a possible magic square size. Since we iterate `k` downwards, the first one we find will be the largest.
//
// Time Complexity:
// Outer loop for `k`: `min(m, n)` iterations.
// Loops for `r` and `c`: `(m-k+1) * (n-k+1)` iterations.
// Inside the loop for checking a `k x k` square:
//   Calculating `targetSum`: O(k)
//   Checking other row sums: `(k-1) * O(k)` = O(k^2)
//   Checking column sums: `k * O(k)` = O(k^2)
//   Checking main diagonal: O(k)
//   Checking anti-diagonal: O(k)
// Total for checking one `k x k` square: O(k^2)
//
// Total Time Complexity: Sum from `k=1` to `min(m, n)` of `(m-k+1) * (n-k+1) * k^2`.
// Roughly, let `S = min(m, n)`. The sum is approximately `O(S * m * n * S^2) = O(S^3 * m * n)`.
// Given `m, n <= 50`, `S <= 50`. So `50^3 * 50 * 50` is too large.
//
// Let's re-evaluate the check for a k x k square.
// If we precompute prefix sums for rows and columns, we can speed up row/column sum calculation.
//
// `rowPrefixSum[i][j]` = sum of `grid[i][0]` to `grid[i][j-1]`. Size `m x (n+1)`.
// `colPrefixSum[i][j]` = sum of `grid[0][j]` to `grid[i-1][j]`. Size `(m+1) x n`.
//
// Precomputation: `O(m*n)`.
//
// For a `k x k` subgrid starting at `(r, c)`:
//
// 1. Calculate `targetSum` for row `r`:
//    `targetSum = rowPrefixSum[r][c+k] - rowPrefixSum[r][c]`
//
// 2. Check other row sums:
//    For `i` from `r+1` to `r+k-1`:
//      `currentSum = rowPrefixSum[i][c+k] - rowPrefixSum[i][c]`
//      If `currentSum != targetSum`, not a magic square.
//    This loop takes `O(k)` time.
//
// 3. Check column sums:
//    For `j` from `c` to `c+k-1`:
//      `currentSum = colPrefixSum[r+k][j] - colPrefixSum[r][j]`
//      If `currentSum != targetSum`, not a magic square.
//    This loop takes `O(k)` time.
//
// 4. Check main diagonal sum:
//    `currentSum = 0`; For `i` from 0 to `k-1`, `currentSum += grid[r+i][c+i]`. O(k).
//
// 5. Check anti-diagonal sum:
//    `currentSum = 0`; For `i` from 0 to `k-1`, `currentSum += grid[r+i][c+k-1-i]`. O(k).
//
// Total time to check one `k x k` square: O(k).
//
// Overall Time Complexity:
// Precomputation: `O(m*n)`
// Outer loop for `k`: `min(m, n)` iterations.
// Loops for `r` and `c`: `(m-k+1) * (n-k+1)` iterations.
// Checking one `k x k` square: `O(k)`.
//
// Total Time Complexity: `O(m*n) + Sum from k=1 to min(m, n) of (m-k+1) * (n-k+1) * k`.
// Let `S = min(m, n)`. The sum is approximately `O(S * m * n * S) = O(S^2 * m * n)`.
// With `m, n <= 50`, `S <= 50`. `50^2 * 50 * 50 = 2500 * 2500 = 6,250,000`. This should be acceptable.
//
// Space Complexity:
// For `rowPrefixSum`: `O(m*n)`
// For `colPrefixSum`: `O(m*n)`
// Total Space Complexity: `O(m*n)`.

#include <vector>
#include <numeric>
#include <algorithm>

class Solution {
public:
    int largestMagicSquare(std::vector<std::vector<int>>& grid) {
        int m = grid.size();
        int n = grid[0].size();

        // Precompute row prefix sums
        // rowPrefixSum[i][j] stores the sum of grid[i][0] to grid[i][j-1]
        std::vector<std::vector<int>> rowPrefixSum(m, std::vector<int>(n + 1, 0));
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                rowPrefixSum[i][j + 1] = rowPrefixSum[i][j] + grid[i][j];
            }
        }

        // Precompute column prefix sums
        // colPrefixSum[i][j] stores the sum of grid[0][j] to grid[i-1][j]
        std::vector<std::vector<int>> colPrefixSum(m + 1, std::vector<int>(n, 0));
        for (int j = 0; j < n; ++j) {
            for (int i = 0; i < m; ++i) {
                colPrefixSum[i + 1][j] = colPrefixSum[i][j] + grid[i][j];
            }
        }

        // Iterate through possible magic square sizes k, from largest to smallest
        for (int k = std::min(m, n); k >= 1; --k) {
            // Iterate through all possible top-left corners (r, c) for a k x k subgrid
            for (int r = 0; r <= m - k; ++r) {
                for (int c = 0; c <= n - k; ++c) {
                    // Check if the k x k subgrid starting at (r, c) is a magic square
                    if (isMagicSquare(grid, rowPrefixSum, colPrefixSum, r, c, k)) {
                        return k; // Found the largest magic square size
                    }
                }
            }
        }

        return 0; // Should not reach here as 1x1 is always magic
    }

private:
    // Helper function to check if a k x k subgrid is a magic square
    bool isMagicSquare(const std::vector<std::vector<int>>& grid,
                       const std::vector<std::vector<int>>& rowPrefixSum,
                       const std::vector<std::vector<int>>& colPrefixSum,
                       int r_start, int c_start, int k) {

        // Calculate the sum of the first row of the subgrid as the target sum
        // Sum of grid[r_start][c_start] to grid[r_start][c_start + k - 1]
        int targetSum = rowPrefixSum[r_start][c_start + k] - rowPrefixSum[r_start][c_start];

        // Check all other row sums
        for (int i = r_start + 1; i < r_start + k; ++i) {
            // Sum of grid[i][c_start] to grid[i][c_start + k - 1]
            int currentRowSum = rowPrefixSum[i][c_start + k] - rowPrefixSum[i][c_start];
            if (currentRowSum != targetSum) {
                return false;
            }
        }

        // Check all column sums
        for (int j = c_start; j < c_start + k; ++j) {
            // Sum of grid[r_start][j] to grid[r_start + k - 1][j]
            int currentColSum = colPrefixSum[r_start + k][j] - colPrefixSum[r_start][j];
            if (currentColSum != targetSum) {
                return false;
            }
        }

        // Check main diagonal sum (top-left to bottom-right)
        int mainDiagonalSum = 0;
        for (int i = 0; i < k; ++i) {
            mainDiagonalSum += grid[r_start + i][c_start + i];
        }
        if (mainDiagonalSum != targetSum) {
            return false;
        }

        // Check anti-diagonal sum (top-right to bottom-left)
        int antiDiagonalSum = 0;
        for (int i = 0; i < k; ++i) {
            antiDiagonalSum += grid[r_start + i][c_start + k - 1 - i];
        }
        if (antiDiagonalSum != targetSum) {
            return false;
        }

        // If all sums match, it's a magic square
        return true;
    }
};
```