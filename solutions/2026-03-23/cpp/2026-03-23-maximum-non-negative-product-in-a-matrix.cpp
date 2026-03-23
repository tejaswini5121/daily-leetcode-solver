```cpp
// Problem: Maximum Non-Negative Product in a Matrix
// Link: https://leetcode.com/problems/maximum-non-negative-product-in-a-matrix/
//
// Approach:
// This problem can be solved using dynamic programming. Since we can only move right or down,
// the path to any cell (i, j) must come from either (i-1, j) or (i, j-1).
// The product can become negative due to multiplication with negative numbers. Therefore, for each
// cell, we need to track both the maximum possible non-negative product and the minimum possible
// product (which could be a large negative number). This is because multiplying a large negative
// number by another negative number can result in a large positive number.
//
// Let dp_max[i][j] be the maximum non-negative product to reach cell (i, j).
// Let dp_min[i][j] be the minimum possible product (can be negative) to reach cell (i, j).
//
// When considering cell (i, j) with value grid[i][j]:
//
// If grid[i][j] is non-negative:
//   dp_max[i][j] = grid[i][j] * max(dp_max[i-1][j], dp_max[i][j-1])
//   dp_min[i][j] = grid[i][j] * min(dp_min[i-1][j], dp_min[i][j-1])
//
// If grid[i][j] is negative:
//   dp_max[i][j] = grid[i][j] * min(dp_min[i-1][j], dp_min[i][j-1])  // Negative * min negative = max positive
//   dp_min[i][j] = grid[i][j] * max(dp_max[i-1][j], dp_max[i][j-1])  // Negative * max positive = min negative
//
// Base Case:
// dp_max[0][0] = grid[0][0]
// dp_min[0][0] = grid[0][0]
//
// For the first row (i=0, j>0):
//   dp_max[0][j] = grid[0][j] * dp_max[0][j-1]
//   dp_min[0][j] = grid[0][j] * dp_min[0][j-1]
//
// For the first column (i>0, j=0):
//   dp_max[i][0] = grid[i][0] * dp_max[i-1][0]
//   dp_min[i][0] = grid[i][0] * dp_min[i-1][0]
//
// For general case (i>0, j>0):
//   We need to consider four possibilities for the product of grid[i][j] with the max/min products from the previous cells:
//   1. grid[i][j] * dp_max[i-1][j]
//   2. grid[i][j] * dp_min[i-1][j]
//   3. grid[i][j] * dp_max[i][j-1]
//   4. grid[i][j] * dp_min[i][j-1]
//
//   dp_max[i][j] will be the maximum among these four values, considering only non-negative results.
//   dp_min[i][j] will be the minimum among these four values.
//
//   A more refined DP state transition:
//   For cell (i, j), the potential max and min products from above are (dp_max[i-1][j], dp_min[i-1][j])
//   and from left are (dp_max[i][j-1], dp_min[i][j-1]).
//   Let current_val = grid[i][j].
//   Candidates for max product at (i, j):
//     - current_val * dp_max[i-1][j]
//     - current_val * dp_min[i-1][j]
//     - current_val * dp_max[i][j-1]
//     - current_val * dp_min[i][j-1]
//   Candidates for min product at (i, j):
//     - current_val * dp_max[i-1][j]
//     - current_val * dp_min[i-1][j]
//     - current_val * dp_max[i][j-1]
//     - current_val * dp_min[i][j-1]
//
//   dp_max[i][j] = max(candidates for max product)
//   dp_min[i][j] = min(candidates for min product)
//
//   Important: The problem asks for the maximum NON-NEGATIVE product.
//   The final result will be dp_max[m-1][n-1]. If this value is negative, return -1.
//   The modulo operation (10^9 + 7) should be applied to the final maximum non-negative product.
//   Since the constraints on m and n are small (up to 15), the intermediate products can become very large.
//   We should use `long long` for DP states.
//
//   Let's refine the DP transition:
//   For cell (i, j) with value `val = grid[i][j]`:
//   We have two possible predecessors: (i-1, j) and (i, j-1).
//   Let `max_prev_up, min_prev_up` be the max/min products for (i-1, j).
//   Let `max_prev_left, min_prev_left` be the max/min products for (i, j-1).
//
//   If `val >= 0`:
//     `current_max = val * max(max_prev_up, max_prev_left)`
//     `current_min = val * min(min_prev_up, min_prev_left)`
//   If `val < 0`:
//     `current_max = val * min(min_prev_up, min_prev_left)` (negative * most negative = most positive)
//     `current_min = val * max(max_prev_up, max_prev_left)` (negative * most positive = most negative)
//
//   This logic needs to be carefully combined.
//   For cell (i, j), consider paths from (i-1, j) and (i, j-1).
//   From (i-1, j): `max1 = dp_max[i-1][j]`, `min1 = dp_min[i-1][j]`
//   From (i, j-1): `max2 = dp_max[i][j-1]`, `min2 = dp_min[i][j-1]`
//   Current value `val = grid[i][j]`.
//
//   Potential products:
//   `p1 = val * max1`
//   `p2 = val * min1`
//   `p3 = val * max2`
//   `p4 = val * min2`
//
//   `dp_max[i][j] = max({p1, p2, p3, p4})`
//   `dp_min[i][j] = min({p1, p2, p3, p4})`
//
//   This approach is correct. The key is to always track both max and min products.
//
//   Initialize dp_max and dp_min tables with appropriate values.
//   A value like -1 might be used for initialization where a path is not yet possible, or a very small number for min and very large for max.
//   For cells that are reachable from the start, initialize with the grid value.
//
//   The problem statement guarantees that m, n >= 1, so (0,0) is always the starting point.
//   The values in grid are small (-4 to 4).
//
//   Let's use `long long` for DP table to avoid overflow before modulo.
//   Modulo constant: MOD = 1e9 + 7.
//
//   Final result: If dp_max[m-1][n-1] < 0, return -1. Otherwise, return dp_max[m-1][n-1] % MOD.
//
// Time complexity: O(m * n) because we visit each cell once.
// Space complexity: O(m * n) for the DP tables. This can be optimized to O(n) or O(m) if we only need the previous row/column.
// Given m, n <= 15, O(m*n) space is perfectly acceptable.

#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int maxNonNegativeProduct(vector<vector<int>>& grid) {
        int m = grid.size();
        int n = grid[0].size();
        long long MOD = 1e9 + 7;

        // dp_max[i][j] stores the maximum non-negative product to reach cell (i, j)
        // dp_min[i][j] stores the minimum (could be negative) product to reach cell (i, j)
        // We use long long to prevent overflow before modulo.
        vector<vector<long long>> dp_max(m, vector<long long>(n));
        vector<vector<long long>> dp_min(m, vector<long long>(n));

        // Base case: starting cell (0, 0)
        dp_max[0][0] = grid[0][0];
        dp_min[0][0] = grid[0][0];

        // Fill the first row
        for (int j = 1; j < n; ++j) {
            long long current_val = grid[0][j];
            dp_max[0][j] = current_val * dp_max[0][j - 1];
            dp_min[0][j] = current_val * dp_min[0][j - 1];
        }

        // Fill the first column
        for (int i = 1; i < m; ++i) {
            long long current_val = grid[i][0];
            dp_max[i][0] = current_val * dp_max[i - 1][0];
            dp_min[i][0] = current_val * dp_min[i - 1][0];
        }

        // Fill the rest of the DP table
        for (int i = 1; i < m; ++i) {
            for (int j = 1; j < n; ++j) {
                long long current_val = grid[i][j];

                // Products coming from the cell above (i-1, j)
                long long max_up = dp_max[i - 1][j];
                long long min_up = dp_min[i - 1][j];

                // Products coming from the cell to the left (i, j-1)
                long long max_left = dp_max[i][j - 1];
                long long min_left = dp_min[i][j - 1];

                // Calculate potential products for current cell
                // When multiplying by current_val, the roles of max and min can swap if current_val is negative.
                // We need to consider all four combinations to find the true max and min.
                
                // Candidate products by multiplying current_val with max/min from above and left
                long long p1 = current_val * max_up;
                long long p2 = current_val * min_up;
                long long p3 = current_val * max_left;
                long long p4 = current_val * min_left;
                
                // The maximum product at (i, j) is the maximum of these four potential products.
                dp_max[i][j] = max({p1, p2, p3, p4});
                // The minimum product at (i, j) is the minimum of these four potential products.
                dp_min[i][j] = min({p1, p2, p3, p4});
            }
        }

        // The maximum non-negative product is at the bottom-right corner.
        long long max_prod = dp_max[m - 1][n - 1];

        // If the maximum product is negative, it's impossible to achieve a non-negative product.
        // The problem states to return -1 in this case.
        if (max_prod < 0) {
            return -1;
        }

        // Otherwise, return the maximum non-negative product modulo 10^9 + 7.
        return max_prod % MOD;
    }
};
```