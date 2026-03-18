```java
/**
 * Problem: Count Submatrices with Top-Left Element and Sum Less Than k
 * LeetCode Link: https://leetcode.com/problems/count-submatrices-with-top-left-element-and-sum-less-than-k/
 *
 * Approach:
 * The problem asks us to count submatrices that start at the top-left corner (0,0)
 * and have a sum of elements less than or equal to k.
 *
 * We can use a 2D prefix sum array to efficiently calculate the sum of any submatrix.
 * Let `prefixSum[i][j]` store the sum of all elements in the submatrix from (0,0) to (i-1, j-1).
 * The formula for calculating `prefixSum[i][j]` is:
 * `prefixSum[i][j] = grid[i-1][j-1] + prefixSum[i-1][j] + prefixSum[i][j-1] - prefixSum[i-1][j-1]`
 *
 * Once we have the `prefixSum` array, the sum of a submatrix with top-left at (0,0)
 * and bottom-right at (r, c) (inclusive, 0-indexed) can be directly obtained from
 * `prefixSum[r+1][c+1]`.
 *
 * We can then iterate through all possible bottom-right corners (r, c) of submatrices
 * that include the top-left element (0,0). For each such submatrix, we check if its
 * sum (obtained from the prefix sum array) is less than or equal to k. If it is,
 * we increment our count.
 *
 * The possible bottom-right corners (r, c) range from r = 0 to m-1 and c = 0 to n-1,
 * where m is the number of rows and n is the number of columns in the grid.
 *
 * Time Complexity:
 * Building the 2D prefix sum array takes O(m * n) time, where m is the number of rows
 * and n is the number of columns.
 * Iterating through all possible bottom-right corners and checking the sum takes O(m * n) time.
 * Therefore, the total time complexity is O(m * n).
 *
 * Space Complexity:
 * We use a 2D prefix sum array of size (m+1) * (n+1), which requires O(m * n) space.
 * Therefore, the space complexity is O(m * n).
 */
class Solution {
    public int countSubmatrices(int[][] grid, int k) {
        int m = grid.length;
        int n = grid[0].length;

        // Create a 2D prefix sum array.
        // prefixSum[i][j] will store the sum of elements in the submatrix
        // from grid[0][0] to grid[i-1][j-1].
        // We use dimensions (m+1) x (n+1) to simplify boundary conditions.
        long[][] prefixSum = new long[m + 1][n + 1];

        // Populate the prefix sum array.
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                prefixSum[i][j] = grid[i - 1][j - 1] + prefixSum[i - 1][j] + prefixSum[i][j - 1] - prefixSum[i - 1][j - 1];
            }
        }

        int count = 0; // Initialize the count of valid submatrices.

        // Iterate through all possible bottom-right corners (r, c) of submatrices
        // that start at (0,0).
        // The submatrix will span from grid[0][0] to grid[r][c].
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                // The sum of the submatrix from (0,0) to (r,c) is stored in prefixSum[r+1][c+1].
                long currentSubmatrixSum = prefixSum[r + 1][c + 1];

                // If the sum is less than or equal to k, increment the count.
                if (currentSubmatrixSum <= k) {
                    count++;
                }
            }
        }

        return count; // Return the total count of valid submatrices.
    }
}
```