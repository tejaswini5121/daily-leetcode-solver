```java
// Problem: Maximum Non-Negative Product in a Matrix
// Link: https://leetcode.com/problems/maximum-non-negative-product-in-a-matrix/
//
// Approach:
// This problem can be solved using dynamic programming. We need to find the maximum and minimum product to reach each cell (i, j)
// because a negative number multiplied by another negative number can become positive.
// Let dp_max[i][j] be the maximum non-negative product to reach cell (i, j), and dp_min[i][j] be the minimum product (could be negative) to reach cell (i, j).
//
// Base Case:
// dp_max[0][0] = grid[0][0]
// dp_min[0][0] = grid[0][0]
//
// Recurrence Relation:
// For cell (i, j), we can reach it either from (i-1, j) (moving down) or from (i, j-1) (moving right).
// If grid[i][j] is positive:
//   dp_max[i][j] = grid[i][j] * max(dp_max[i-1][j], dp_max[i][j-1])  (if i > 0 and j > 0)
//   dp_min[i][j] = grid[i][j] * min(dp_min[i-1][j], dp_min[i][j-1])  (if i > 0 and j > 0)
//
// If grid[i][j] is negative:
//   dp_max[i][j] = grid[i][j] * min(dp_min[i-1][j], dp_min[i][j-1])  (if i > 0 and j > 0)
//   dp_min[i][j] = grid[i][j] * max(dp_max[i-1][j], dp_max[i][j-1])  (if i > 0 and j > 0)
//
// For the first row (i=0, j>0):
//   dp_max[0][j] = grid[0][j] * dp_max[0][j-1]
//   dp_min[0][j] = grid[0][j] * dp_min[0][j-1]
//
// For the first column (i>0, j=0):
//   dp_max[i][0] = grid[i][0] * dp_max[i-1][0]
//   dp_min[i][0] = grid[i][0] * dp_min[i-1][0]
//
// When considering both paths (from above and from left) for cell (i, j):
// If grid[i][j] > 0:
//   Candidates for dp_max[i][j]: grid[i][j] * dp_max[i-1][j], grid[i][j] * dp_max[i][j-1]
//   Candidates for dp_min[i][j]: grid[i][j] * dp_min[i-1][j], grid[i][j] * dp_min[i][j-1]
//
// If grid[i][j] < 0:
//   Candidates for dp_max[i][j]: grid[i][j] * dp_min[i-1][j], grid[i][j] * dp_min[i][j-1]
//   Candidates for dp_min[i][j]: grid[i][j] * dp_max[i-1][j], grid[i][j] * dp_max[i][j-1]
//
// If grid[i][j] == 0:
//   dp_max[i][j] = 0
//   dp_min[i][j] = 0
//
// To handle the general case efficiently, for each cell (i, j), we consider the four possible products:
// 1. grid[i][j] * dp_max[i-1][j]
// 2. grid[i][j] * dp_min[i-1][j]
// 3. grid[i][j] * dp_max[i][j-1]
// 4. grid[i][j] * dp_min[i][j-1]
//
// dp_max[i][j] will be the maximum among these four values.
// dp_min[i][j] will be the minimum among these four values.
//
// Special handling for cells on the first row and first column is needed.
//
// The modulo operation (10^9 + 7) should be applied at the very end to the final maximum product.
// If the maximum product at dp_max[m-1][n-1] is negative, we return -1.
//
// Time Complexity: O(m * n), where m is the number of rows and n is the number of columns. We visit each cell once.
// Space Complexity: O(m * n) for the DP tables. We can optimize space to O(n) or O(m) by only keeping track of the previous row/column.
// Given the constraints (m, n <= 15), O(m*n) space is acceptable.

class Solution {
    public int maxNonNegativeProduct(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        long MOD = 1_000_000_007;

        // dp_max[i][j] stores the maximum product to reach cell (i, j)
        // dp_min[i][j] stores the minimum product to reach cell (i, j)
        // We use long to avoid overflow during intermediate calculations
        long[][] dp_max = new long[m][n];
        long[][] dp_min = new long[m][n];

        // Initialize the starting cell
        dp_max[0][0] = grid[0][0];
        dp_min[0][0] = grid[0][0];

        // Fill the first row
        for (int j = 1; j < n; j++) {
            dp_max[0][j] = dp_max[0][j - 1] * grid[0][j];
            dp_min[0][j] = dp_min[0][j - 1] * grid[0][j];
        }

        // Fill the first column
        for (int i = 1; i < m; i++) {
            dp_max[i][0] = dp_max[i - 1][0] * grid[i][0];
            dp_min[i][0] = dp_min[i - 1][0] * grid[i][0];
        }

        // Fill the rest of the DP table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                long currentVal = grid[i][j];
                
                // Calculate potential max and min products coming from the cell above (i-1, j)
                long fromAboveMax = dp_max[i - 1][j] * currentVal;
                long fromAboveMin = dp_min[i - 1][j] * currentVal;

                // Calculate potential max and min products coming from the cell to the left (i, j-1)
                long fromLeftMax = dp_max[i][j - 1] * currentVal;
                long fromLeftMin = dp_min[i][j - 1] * currentVal;

                // The new maximum product at (i, j) is the maximum of all four possibilities
                dp_max[i][j] = Math.max(fromAboveMax, Math.max(fromAboveMin, Math.max(fromLeftMax, fromLeftMin)));
                
                // The new minimum product at (i, j) is the minimum of all four possibilities
                dp_min[i][j] = Math.min(fromAboveMax, Math.min(fromAboveMin, Math.min(fromLeftMax, fromLeftMin)));
            }
        }

        // The maximum non-negative product is at dp_max[m-1][n-1]
        long maxProduct = dp_max[m - 1][n - 1];

        // If the maximum product is negative, return -1. Otherwise, return the product modulo 10^9 + 7.
        if (maxProduct < 0) {
            return -1;
        } else {
            return (int) (maxProduct % MOD);
        }
    }
}
```