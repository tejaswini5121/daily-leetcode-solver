```java
/**
 * LeetCode Problem: Maximum Side Length of a Square with Sum Less than or Equal to Threshold
 * Link: https://leetcode.com/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold/
 *
 * Problem Summary:
 * Given a 2D matrix and a threshold, find the largest square submatrix whose sum of elements
 * is less than or equal to the given threshold.
 *
 * Approach:
 * The problem asks for the maximum side length. This suggests that if a square of side 'k' satisfies
 * the condition, then any square of side 'j' < 'k' also satisfies it (since it's a sub-square, and elements are non-negative).
 * This monotonicity allows us to use binary search on the possible side lengths.
 *
 * The possible side lengths range from 0 to min(m, n).
 * For a given side length `k`, we need an efficient way to calculate the sum of all possible squares of size `k x k`.
 * This can be done using a 2D prefix sum array (also known as an integral image).
 *
 * The 2D prefix sum `prefixSum[i][j]` will store the sum of all elements in the rectangle from (0,0) to (i-1, j-1).
 * The sum of a rectangle with top-left corner (r1, c1) and bottom-right corner (r2, c2) can be calculated as:
 * sum(r1, c1, r2, c2) = prefixSum[r2+1][c2+1] - prefixSum[r1][c2+1] - prefixSum[r2+1][c1] + prefixSum[r1][c1].
 *
 * For a square of side `k` with its bottom-right corner at `(r, c)`, the top-left corner will be at `(r-k+1, c-k+1)`.
 * So, the sum of such a square is `prefixSum[r+1][c+1] - prefixSum[r-k+1][c+1] - prefixSum[r+1][c-k+1] + prefixSum[r-k+1][c-k+1]`.
 *
 * The `check(sideLength)` function will iterate through all possible bottom-right corners of squares with the given `sideLength`
 * and use the prefix sum array to calculate the sum. If any square's sum is less than or equal to the `threshold`, it returns `true`.
 *
 * Binary Search:
 * - `low = 0`, `high = min(m, n)` (maximum possible side length).
 * - `ans = 0` (to store the maximum valid side length found so far).
 * - While `low <= high`:
 *     - `mid = low + (high - low) / 2`
 *     - If `check(mid)` is true:
 *         - A square of side `mid` is possible. Try for a larger side.
 *         - `ans = mid`
 *         - `low = mid + 1`
 *     - Else (`check(mid)` is false):
 *         - A square of side `mid` is too large. Try for a smaller side.
 *         - `high = mid - 1`
 * - Return `ans`.
 *
 * Time Complexity:
 * - Building the prefix sum array: O(m*n)
 * - Binary search performs log(min(m, n)) iterations.
 * - Inside each iteration, the `check(k)` function iterates through all possible bottom-right corners of squares of size `k x k`.
 *   This is approximately O(m*n).
 * - Total Time Complexity: O(m*n * log(min(m, n)))
 *
 * Space Complexity:
 * - For the 2D prefix sum array: O(m*n)
 * - Total Space Complexity: O(m*n)
 */
class Solution {
    public int maxSideLength(int[][] mat, int threshold) {
        int m = mat.length;
        int n = mat[0].length;

        // Create a 2D prefix sum array.
        // prefixSum[i][j] stores the sum of elements in the rectangle from (0,0) to (i-1, j-1).
        // The size is (m+1) x (n+1) to handle 1-based indexing for easier calculation.
        int[][] prefixSum = new int[m + 1][n + 1];

        // Populate the prefix sum array.
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                prefixSum[i + 1][j + 1] = mat[i][j] + prefixSum[i][j + 1] + prefixSum[i + 1][j] - prefixSum[i][j];
            }
        }

        // Binary search for the maximum side length.
        int low = 0;
        int high = Math.min(m, n); // The maximum possible side length is limited by the smaller dimension.
        int ans = 0; // Stores the maximum side length found that satisfies the condition.

        // While the search space is valid.
        while (low <= high) {
            int mid = low + (high - low) / 2; // Calculate the middle side length to check.

            // If mid is 0, it's always a valid square (empty or single element with sum <= threshold if allowed).
            // We want to find the largest non-zero side if possible.
            if (mid == 0) {
                ans = Math.max(ans, mid);
                low = mid + 1;
                continue;
            }

            // Check if a square of side 'mid' exists with sum <= threshold.
            if (check(prefixSum, m, n, mid, threshold)) {
                // If a square of side 'mid' is valid, it means we might be able to find a larger square.
                ans = mid; // Update the answer to the current valid side length.
                low = mid + 1; // Try searching in the upper half for a larger side length.
            } else {
                // If a square of side 'mid' is not valid, it means 'mid' is too large.
                high = mid - 1; // Search in the lower half for a smaller side length.
            }
        }

        return ans; // Return the maximum valid side length found.
    }

    /**
     * Helper function to check if there exists any square of a given side length
     * with a sum of elements less than or equal to the threshold.
     *
     * @param prefixSum The precomputed 2D prefix sum array.
     * @param m         The number of rows in the original matrix.
     * @param n         The number of columns in the original matrix.
     * @param side      The current side length to check.
     * @param threshold The maximum allowed sum for a square.
     * @return true if such a square exists, false otherwise.
     */
    private boolean check(int[][] prefixSum, int m, int n, int side, int threshold) {
        // Iterate through all possible bottom-right corners of a square with the given 'side'.
        // The top-left corner of a square with bottom-right corner (r, c) and side 's' is (r-s+1, c-s+1).
        // Thus, the bottom-right corner can range from (side-1, side-1) to (m-1, n-1).
        for (int r = side - 1; r < m; r++) {
            for (int c = side - 1; c < n; c++) {
                // Calculate the sum of the square with bottom-right corner (r, c) and side 'side'.
                // The top-left corner is (r - side + 1, c - side + 1).
                // Using 1-based indexing for prefixSum:
                // The coordinates in prefixSum will be:
                // Bottom-right of the rectangle for sum: (r+1, c+1)
                // Top-left of the rectangle for sum: (r-side+1, c-side+1)
                //
                // Sum of rectangle (r1, c1) to (r2, c2) inclusive using 0-indexed matrix is:
                // prefixSum[r2+1][c2+1] - prefixSum[r1][c2+1] - prefixSum[r2+1][c1] + prefixSum[r1][c1]
                //
                // Here, r1 = r - side + 1, c1 = c - side + 1, r2 = r, c2 = c.
                // So, the sum is:
                // prefixSum[r+1][c+1] - prefixSum[r-side+1][c+1] - prefixSum[r+1][c-side+1] + prefixSum[r-side+1][c-side+1]

                int sum = prefixSum[r + 1][c + 1] - prefixSum[r - side + 1][c + 1] - prefixSum[r + 1][c - side + 1] + prefixSum[r - side + 1][c - side + 1];

                // If the sum of this square is less than or equal to the threshold, we've found a valid square.
                if (sum <= threshold) {
                    return true;
                }
            }
        }
        // If no square of the given 'side' length satisfies the condition, return false.
        return false;
    }
}
```