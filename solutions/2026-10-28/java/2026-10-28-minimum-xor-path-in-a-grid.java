```java
// Problem: Minimum XOR Path in a Grid
// Link: https://leetcode.com/problems/minimum-xor-path-in-a-grid/
//
// Problem Summary: Find the minimum XOR sum of a path from the top-left to the
// bottom-right cell of a grid, where movement is restricted to right or down.
//
// Approach:
// This problem can be solved using dynamic programming. We need to find the minimum
// XOR sum to reach each cell. Since the path can arrive at a cell (i, j) either
// from (i-1, j) (moving down) or from (i, j-1) (moving right), the XOR sum to
// reach (i, j) will be grid[i][j] XORed with the XOR sum of the path to the
// previous cell.
//
// However, a simple DP state like dp[i][j] = min_xor_sum to reach (i, j) is not
// sufficient because XOR operation is not directly comparable like addition or
// minimum. We cannot simply take the minimum of two XOR sums.
//
// Instead, for each cell (i, j), we need to store all possible XOR sums that can
// be achieved to reach that cell. Since the values in the grid are up to 1023,
// which is less than 2^10, the maximum possible XOR sum will also be within a
// manageable range (less than 2^10).
//
// We can use a `Set<Integer>` at each DP state `dp[i][j]` to store all distinct
// XOR sums that can lead to cell (i, j).
//
// `dp[i][j]` will store a set of all possible XOR sums to reach cell (i, j).
//
// Initialization:
// `dp[0][0]` will contain only `grid[0][0]`.
//
// Transitions:
// For `dp[i][j]`:
// If `i > 0`, for each `prev_xor_sum` in `dp[i-1][j]`, add `prev_xor_sum ^ grid[i][j]` to `dp[i][j]`.
// If `j > 0`, for each `prev_xor_sum` in `dp[i][j-1]`, add `prev_xor_sum ^ grid[i][j]` to `dp[i][j]`.
//
// The base cases are the first row and first column.
// For the first row (i=0, j>0): `dp[0][j]` will contain `dp[0][j-1].iterator().next() ^ grid[0][j]`
// (since there's only one path to any cell in the first row).
// Similarly for the first column (i>0, j=0).
//
// The final answer will be the minimum value in `dp[m-1][n-1]`.
//
// Since m * n <= 1000, the total number of cells is limited. The maximum number of
// distinct XOR sums at any cell is bounded by 1024 (0 to 1023). So, the size of
// each set is at most 1024.
//
// Time Complexity: O(m * n * K), where K is the maximum possible XOR value (1024).
// For each cell (m*n), we iterate through the XOR sums from the previous cells.
// The number of possible XOR sums for any cell is at most 1024.
//
// Space Complexity: O(m * n * K), where K is the maximum possible XOR value (1024).
// This is due to storing the sets of XOR sums for each cell.
//
class Solution {
    public int minimumXORPath(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        // dp[i][j] will store a set of all possible XOR sums to reach cell (i, j).
        // The maximum possible XOR value is less than 1024 (2^10), so the set size is bounded.
        Set<Integer>[][] dp = new Set[m][n];

        // Initialize the dp table
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                dp[i][j] = new HashSet<>();
            }
        }

        // Base case: The starting cell (0, 0)
        dp[0][0].add(grid[0][0]);

        // Fill the first row
        for (int j = 1; j < n; j++) {
            // For the first row, there's only one way to reach a cell: from the left.
            // Since there's only one XOR sum to reach dp[0][j-1], we can directly compute it.
            for (int prevXor : dp[0][j - 1]) {
                dp[0][j].add(prevXor ^ grid[0][j]);
            }
        }

        // Fill the first column
        for (int i = 1; i < m; i++) {
            // For the first column, there's only one way to reach a cell: from above.
            // Since there's only one XOR sum to reach dp[i-1][0], we can directly compute it.
            for (int prevXor : dp[i - 1][0]) {
                dp[i][0].add(prevXor ^ grid[i][0]);
            }
        }

        // Fill the rest of the DP table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                // Paths from the cell above (i-1, j)
                for (int prevXor : dp[i - 1][j]) {
                    dp[i][j].add(prevXor ^ grid[i][j]);
                }
                // Paths from the cell to the left (i, j-1)
                for (int prevXor : dp[i][j - 1]) {
                    dp[i][j].add(prevXor ^ grid[i][j]);
                }
            }
        }

        // The minimum XOR path sum to reach the bottom-right cell (m-1, n-1)
        // is the minimum value in the set dp[m-1][n-1].
        int minXor = Integer.MAX_VALUE;
        for (int xorSum : dp[m - 1][n - 1]) {
            minXor = Math.min(minXor, xorSum);
        }

        return minXor;
    }
}
```