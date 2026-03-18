```cpp
// Given an m x n integer matrix grid and an integer k, return the number of
// submatrices that contain the top-left element of the grid (grid[0][0]) and
// have a sum less than or equal to k.
//
// Link: https://leetcode.com/problems/count-submatrices-with-top-left-element-and-sum-less-than-k/
//
// Approach:
// We can use a 2D prefix sum array (also known as an integral image) to efficiently
// calculate the sum of any submatrix. Let `prefixSum[i][j]` store the sum of all
// elements in the submatrix from `grid[0][0]` to `grid[i-1][j-1]`.
// The `prefixSum` array will have dimensions (m+1) x (n+1) to handle boundary cases.
//
// `prefixSum[i][j] = grid[i-1][j-1] + prefixSum[i-1][j] + prefixSum[i][j-1] - prefixSum[i-1][j-1]`
//
// After computing the `prefixSum` array, we can iterate through all possible
// bottom-right corners (r, c) of submatrices that include `grid[0][0]`. For a
// submatrix with top-left at `grid[0][0]` and bottom-right at `grid[r][c]`, its
// sum can be directly obtained from `prefixSum[r+1][c+1]`.
//
// We then check if this sum is less than or equal to `k`. If it is, we increment
// our count of valid submatrices.
//
// Time Complexity:
// Calculating the 2D prefix sum array takes O(m * n) time.
// Iterating through all possible bottom-right corners to check sums takes O(m * n) time.
// Therefore, the overall time complexity is O(m * n).
//
// Space Complexity:
// We use a 2D prefix sum array of size (m+1) x (n+1), which requires O(m * n) space.
// Therefore, the space complexity is O(m * n).
//
class Solution {
public:
    int countSubmatrices(vector<vector<int>>& grid, int k) {
        int m = grid.size();
        int n = grid[0].size();

        // Create a 2D prefix sum array.
        // prefixSum[i][j] will store the sum of all elements in the submatrix
        // from grid[0][0] to grid[i-1][j-1].
        // We use (m+1) x (n+1) to handle boundary cases easily.
        vector<vector<long long>> prefixSum(m + 1, vector<long long>(n + 1, 0));

        // Populate the prefix sum array.
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                // The formula for 2D prefix sum:
                // current_cell + sum_above + sum_left - sum_top_left_diagonal
                prefixSum[i + 1][j + 1] = (long long)grid[i][j] + prefixSum[i][j + 1] + prefixSum[i + 1][j] - prefixSum[i][j];
            }
        }

        int count = 0; // Initialize count of valid submatrices.

        // Iterate through all possible bottom-right corners (r, c) of submatrices.
        // A submatrix containing grid[0][0] will have its bottom-right corner
        // at grid[r][c], where 0 <= r < m and 0 <= c < n.
        for (int r = 0; r < m; ++r) {
            for (int c = 0; c < n; ++c) {
                // The sum of the submatrix from grid[0][0] to grid[r][c]
                // is directly available in prefixSum[r+1][c+1].
                // We check if this sum is less than or equal to k.
                if (prefixSum[r + 1][c + 1] <= k) {
                    count++; // Increment count if the condition is met.
                }
            }
        }

        return count; // Return the total count of valid submatrices.
    }
};
```