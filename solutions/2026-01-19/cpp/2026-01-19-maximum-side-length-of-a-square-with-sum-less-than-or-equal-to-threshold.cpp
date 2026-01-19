// Problem: Maximum Side Length of a Square with Sum Less than or Equal to Threshold
// Link: https://leetcode.com/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold/
//
// Approach:
// The problem asks for the largest square subgrid whose sum of elements is less than or equal to a given threshold.
// The maximum possible side length of a square is bounded by min(m, n).
// This suggests that we can use binary search on the possible side lengths.
// For a given side length 'k', we need to efficiently check if there exists any square subgrid of size k x k whose sum is <= threshold.
// To efficiently calculate the sum of any k x k subgrid, we can use a 2D prefix sum array.
// Let `prefixSum[i][j]` store the sum of all elements in the rectangle from `mat[0][0]` to `mat[i-1][j-1]`.
// The sum of a k x k square with its bottom-right corner at `mat[r][c]` can then be calculated using the prefix sum array:
// `sum = prefixSum[r+1][c+1] - prefixSum[r+1-k][c+1] - prefixSum[r+1][c+1-k] + prefixSum[r+1-k][c+1-k]`.
//
// The binary search will work as follows:
// Initialize `low = 0` and `high = min(m, n)`. `ans = 0`.
// While `low <= high`:
//   `mid = low + (high - low) / 2` (this is the current side length to check).
//   If `mid == 0`, we can always form a square of side 0 with sum 0, so continue to check larger sides.
//   Check if there exists a `mid x mid` square with sum <= threshold.
//     Iterate through all possible bottom-right corners `(r, c)` of a `mid x mid` square (i.e., `r` from `mid-1` to `m-1`, `c` from `mid-1` to `n-1`).
//     Calculate the sum of the `mid x mid` square ending at `(r, c)` using the prefix sum array.
//     If the sum is <= threshold, then a square of side `mid` is possible. Set `ans = mid`, and try for larger sides by setting `low = mid + 1`. Break the inner loops and continue binary search.
//   If no such `mid x mid` square is found after checking all possible positions, then `mid` is too large. Set `high = mid - 1`.
// Return `ans`.
//
// Time Complexity:
// Building the 2D prefix sum array takes O(m * n) time.
// The binary search performs log(min(m, n)) iterations.
// Inside each iteration of the binary search, we iterate through all possible bottom-right corners of a square of size `mid x mid`.
// The number of such corners is approximately O((m - mid) * (n - mid)).
// Calculating the sum for each square takes O(1) using the prefix sum array.
// So, for a given `mid`, checking for a valid square takes O((m - mid) * (n - mid)) time.
// In the worst case, `mid` can be close to `min(m, n)`, leading to O(m*n) for checking.
// Therefore, the overall time complexity is O(m * n * log(min(m, n))).
//
// Space Complexity:
// O(m * n) for storing the 2D prefix sum array.

#include <vector>
#include <algorithm>

class Solution {
public:
    int maximalSquare(std::vector<std::vector<int>>& matrix, int threshold) {
        int m = matrix.size();
        int n = matrix[0].size();

        // Create a 2D prefix sum array.
        // prefixSum[i][j] will store the sum of elements in the rectangle
        // from matrix[0][0] to matrix[i-1][j-1].
        // We add 1 to dimensions for easier boundary handling (0-indexing to 1-indexing).
        std::vector<std::vector<int>> prefixSum(m + 1, std::vector<int>(n + 1, 0));

        // Populate the prefix sum array.
        for (int r = 0; r < m; ++r) {
            for (int c = 0; c < n; ++c) {
                prefixSum[r + 1][c + 1] = matrix[r][c] + prefixSum[r][c + 1] + prefixSum[r + 1][c] - prefixSum[r][c];
            }
        }

        // Function to calculate the sum of a square subgrid.
        // The square has side length 'side' and its bottom-right corner is at (r, c) in the original matrix.
        // In terms of prefixSum array (1-indexed), the bottom-right corner is (r+1, c+1).
        auto getSquareSum = [&](int r, int c, int side) {
            // Coordinates in prefixSum array are 1-indexed.
            // Bottom-right corner: (r+1, c+1)
            // Top-left corner: (r+1-side, c+1-side)
            return prefixSum[r + 1][c + 1] - prefixSum[r + 1 - side][c + 1] - prefixSum[r + 1][c + 1 - side] + prefixSum[r + 1 - side][c + 1 - side];
        };

        // Function to check if a square of given 'side' length exists with sum <= threshold.
        auto check = [&](int side) {
            if (side == 0) return true; // A square of side 0 always has sum 0.

            // Iterate through all possible bottom-right corners of a 'side' x 'side' square.
            // The bottom-right corner (r, c) in the original matrix means:
            // r ranges from side - 1 to m - 1.
            // c ranges from side - 1 to n - 1.
            for (int r = side - 1; r < m; ++r) {
                for (int c = side - 1; c < n; ++c) {
                    if (getSquareSum(r, c, side) <= threshold) {
                        return true; // Found a valid square.
                    }
                }
            }
            return false; // No valid square of this side length found.
        };

        // Binary search for the maximum side length.
        int low = 0;
        int high = std::min(m, n); // Maximum possible side length.
        int ans = 0;

        while (low <= high) {
            int mid = low + (high - low) / 2; // Current side length to check.
            if (check(mid)) {
                // If a square of side 'mid' is possible, we try for a larger side.
                ans = mid;
                low = mid + 1;
            } else {
                // If a square of side 'mid' is not possible, we need to try smaller sides.
                high = mid - 1;
            }
        }

        return ans;
    }
};
```