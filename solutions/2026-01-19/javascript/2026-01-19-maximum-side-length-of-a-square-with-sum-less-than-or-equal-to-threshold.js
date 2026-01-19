/**
 * @summary Finds the largest square submatrix whose sum of elements is less than or equal to a given threshold.
 * @link https://leetcode.com/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold/
 *
 * @approach
 * The problem asks for the maximum side length of a square submatrix whose sum is within a threshold.
 * This problem can be efficiently solved using a combination of 2D prefix sums and binary search.
 *
 * 1. **2D Prefix Sums:** First, we precompute a 2D prefix sum array (or integral image).
 *    `prefixSum[r][c]` will store the sum of all elements in the rectangle from `mat[0][0]` to `mat[r-1][c-1]`.
 *    This allows us to calculate the sum of any rectangular submatrix (including squares) in O(1) time.
 *    The formula for the sum of a square with top-left corner `(r1, c1)` and bottom-right corner `(r2, c2)` is:
 *    `sum = prefixSum[r2+1][c2+1] - prefixSum[r1][c2+1] - prefixSum[r2+1][c1] + prefixSum[r1][c1]`.
 *    For a square of side length `k` with its top-left corner at `(r, c)`, the bottom-right corner is `(r+k-1, c+k-1)`.
 *    The sum of this square can be calculated using the prefix sum array.
 *
 * 2. **Binary Search on Side Length:** The possible side lengths of a square range from 0 to `min(m, n)`.
 *    We can binary search for the maximum possible side length. For a given `mid` side length, we check if there exists
 *    any square submatrix of side `mid` whose sum is less than or equal to the `threshold`.
 *
 * 3. **Checking for a Given Side Length:** To check if a square of side length `k` exists with sum <= `threshold`:
 *    Iterate through all possible top-left corners `(r, c)` of a square of size `k`.
 *    For each `(r, c)`, calculate the sum of the square submatrix using the precomputed prefix sums.
 *    If `sum <= threshold` for any such square, then it's possible to form a square of side `k`.
 *
 * **Algorithm Outline:**
 * a. Create a 2D prefix sum array `prefixSum` of size `(m+1) x (n+1)`.
 * b. Populate `prefixSum` using the formula: `prefixSum[r+1][c+1] = mat[r][c] + prefixSum[r][c+1] + prefixSum[r+1][c] - prefixSum[r][c]`.
 * c. Initialize `low = 0` and `high = min(m, n)`. This is the range for our binary search on side length.
 * d. Initialize `maxSide = 0` to store the maximum valid side length found so far.
 * e. While `low <= high`:
 *    i. Calculate `mid = floor((low + high) / 2)`.
 *    ii. Call a helper function `hasSquareWithSum(mid, mat, prefixSum, threshold)` to check if a square of side `mid` exists.
 *    iii. If `hasSquareWithSum` returns `true`:
 *        - A square of side `mid` is possible. We try for larger squares.
 *        - `maxSide = mid`.
 *        - `low = mid + 1`.
 *    iv. If `hasSquareWithSum` returns `false`:
 *        - A square of side `mid` is not possible. We need to try smaller squares.
 *        - `high = mid - 1`.
 * f. Return `maxSide`.
 *
 * **`hasSquareWithSum(k, mat, prefixSum, threshold)` function:**
 * a. If `k == 0`, return `true` (an empty square has sum 0).
 * b. Iterate through all possible top-left corners `(r, c)` for a square of side `k`:
 *    - `r` ranges from `0` to `m - k`.
 *    - `c` ranges from `0` to `n - k`.
 * c. For each `(r, c)`:
 *    - The bottom-right corner is `(r + k - 1, c + k - 1)`.
 *    - Calculate the sum using the prefix sum array:
 *      `currentSum = prefixSum[r + k][c + k] - prefixSum[r][c + k] - prefixSum[r + k][c] + prefixSum[r][c]`.
 *    - If `currentSum <= threshold`, return `true` (a valid square is found).
 * d. If the loop finishes without finding a valid square, return `false`.
 *
 * @timeComplexity
 * - Precomputing the prefix sum array takes O(m * n) time.
 * - The binary search performs `log(min(m, n))` iterations.
 * - Inside each iteration of the binary search, the `hasSquareWithSum` function iterates through all possible top-left corners of a square of side `k`.
 *   This takes O((m - k + 1) * (n - k + 1)) which is approximately O(m * n) in the worst case.
 * - Therefore, the overall time complexity is O(m * n * log(min(m, n))).
 *
 * @spaceComplexity
 * - We use an auxiliary 2D array `prefixSum` of size `(m+1) x (n+1)` to store prefix sums.
 * - This results in a space complexity of O(m * n).
 */
var maximalSquare = function(mat, threshold) {
    const m = mat.length;
    const n = mat[0].length;

    // Create a 2D prefix sum array.
    // prefixSum[r][c] will store the sum of elements in mat from (0,0) to (r-1, c-1).
    // We add 1 to dimensions for easier calculation (1-based indexing conceptually for prefix sums).
    const prefixSum = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

    // Populate the prefix sum array.
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            // Formula for 2D prefix sum:
            // current element + sum of elements above + sum of elements to the left - sum of overlapping region
            prefixSum[r + 1][c + 1] = mat[r][c] + prefixSum[r][c + 1] + prefixSum[r + 1][c] - prefixSum[r][c];
        }
    }

    /**
     * Helper function to check if there exists a square of side length 'k'
     * with a sum less than or equal to the threshold.
     * @param {number} k - The side length of the square to check.
     * @returns {boolean} - True if such a square exists, false otherwise.
     */
    const hasSquareWithSum = (k) => {
        // If k is 0, it means an empty square, which always has sum 0 and satisfies threshold.
        if (k === 0) return true;

        // Iterate through all possible top-left corners (r, c) of a square of side k.
        // The bottom-right corner will be (r + k - 1, c + k - 1).
        // r can go up to m - k, and c can go up to n - k.
        for (let r = 0; r <= m - k; r++) {
            for (let c = 0; c <= n - k; c++) {
                // Calculate the sum of the square using the prefix sum array.
                // The square's top-left is (r, c) and bottom-right is (r + k - 1, c + k - 1).
                // In terms of prefixSum indices (which are 1-based for mat[0][0] to mat[r-1][c-1]):
                // bottom-right in prefixSum: (r + k, c + k)
                // top-left in prefixSum: (r, c)
                // top-right in prefixSum: (r, c + k)
                // bottom-left in prefixSum: (r + k, c)
                const currentSum = prefixSum[r + k][c + k] - prefixSum[r][c + k] - prefixSum[r + k][c] + prefixSum[r][c];

                // If the current square's sum is within the threshold, we found a valid square.
                if (currentSum <= threshold) {
                    return true;
                }
            }
        }
        // If no square of side k was found with sum <= threshold.
        return false;
    };

    // Binary search for the maximum side length.
    // 'low' is the minimum possible side length (0), 'high' is the maximum possible (min of matrix dimensions).
    let low = 0;
    let high = Math.min(m, n);
    let maxSide = 0; // Stores the maximum side length found so far.

    while (low <= high) {
        // Calculate the middle side length to check.
        const mid = Math.floor((low + high) / 2);

        // Check if a square of side 'mid' exists with sum <= threshold.
        if (hasSquareWithSum(mid)) {
            // If it exists, 'mid' is a possible side length. We try to find a larger one.
            maxSide = mid; // Update maxSide as 'mid' is a valid candidate.
            low = mid + 1; // Try for larger squares.
        } else {
            // If it doesn't exist, 'mid' is too large. We need to try smaller squares.
            high = mid - 1; // Try for smaller squares.
        }
    }

    // Return the maximum side length found.
    return maxSide;
};
```