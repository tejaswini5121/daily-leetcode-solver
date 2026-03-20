/**
 * @summary Calculates the minimum absolute difference between any two distinct elements in each k x k submatrix of a given grid.
 * @link https://leetcode.com/problems/minimum-absolute-difference-in-sliding-submatrix/
 * @approach
 * The problem requires us to find the minimum absolute difference within every k x k submatrix.
 * A naive approach would be to iterate through each possible top-left corner (i, j) of a k x k submatrix.
 * For each submatrix, we would extract all its elements, sort them, and then find the minimum difference between adjacent elements.
 *
 * Since the constraints on m and n are small (up to 30), this brute-force approach is feasible.
 *
 * Steps:
 * 1. Initialize an answer matrix `ans` of size `(m - k + 1) x (n - k + 1)` to store the results.
 * 2. Iterate through each possible row `i` from 0 to `m - k`. This `i` represents the top row of the current submatrix.
 * 3. For each `i`, iterate through each possible column `j` from 0 to `n - k`. This `j` represents the left column of the current submatrix.
 * 4. For the submatrix starting at `(i, j)`:
 *    a. Create a temporary list `submatrixElements` to store all elements of the current k x k submatrix.
 *    b. Iterate through rows `row` from `i` to `i + k - 1`.
 *    c. Iterate through columns `col` from `j` to `j + k - 1`.
 *    d. Add `grid[row][col]` to `submatrixElements`.
 *    e. Sort `submatrixElements` in ascending order.
 *    f. Initialize `minDiff` to infinity.
 *    g. Iterate through the sorted `submatrixElements` from the second element (index 1) to find the minimum difference between adjacent elements: `submatrixElements[l] - submatrixElements[l-1]`. Update `minDiff` if a smaller difference is found.
 *    h. If `submatrixElements` has only one distinct element (meaning all elements are the same after sorting), `minDiff` will remain infinity. In this case, the minimum absolute difference is 0. We can handle this by checking if the sorted list has fewer than 2 elements or if the first and last element are the same. A simpler way is to just calculate differences and if `minDiff` is still infinity after the loop, it implies all elements were the same, so set `ans[i][j] = 0`. Otherwise, `ans[i][j] = minDiff`.
 * 5. Return the `ans` matrix.
 *
 * Example walkthrough:
 * grid = [[1, -2, 3], [2, 3, 5]], k = 2
 * m = 2, n = 3
 * ans will be of size (2-2+1) x (3-2+1) = 1 x 2
 *
 * i = 0, j = 0:
 *   Submatrix: [[1, -2], [2, 3]]
 *   Elements: [1, -2, 2, 3]
 *   Sorted: [-2, 1, 2, 3]
 *   Differences: |1 - (-2)|=3, |2 - 1|=1, |3 - 2|=1. Min diff = 1.
 *   ans[0][0] = 1
 *
 * i = 0, j = 1:
 *   Submatrix: [[-2, 3], [3, 5]]
 *   Elements: [-2, 3, 3, 5]
 *   Sorted: [-2, 3, 3, 5]
 *   Differences: |3 - (-2)|=5, |3 - 3|=0, |5 - 3|=2. Min diff = 0.
 *   Wait, the problem states "minimum absolute difference between any two *distinct* values". If there are duplicates, the difference is 0.
 *   Let's re-evaluate:
 *   Sorted: [-2, 3, 3, 5]
 *   Distinct sorted values: [-2, 3, 5]
 *   Differences: |3 - (-2)|=5, |5 - 3|=2. Min diff = 2.
 *   ans[0][1] = 2
 *
 * The approach of sorting all elements and finding the minimum difference between adjacent ones in the sorted list inherently handles duplicate values correctly because `abs(x - x) = 0`, which would be the minimum possible difference if duplicates exist.
 *
 * Time Complexity:
 * - Outer loops for `i` and `j`: `O((m-k+1) * (n-k+1))`.
 * - Inner loops to extract submatrix elements: `O(k*k)`.
 * - Sorting the `k*k` elements: `O(k*k * log(k*k))`.
 * - Finding the minimum difference in the sorted array: `O(k*k)`.
 *
 * Total Time Complexity: `O((m-k+1) * (n-k+1) * k*k * log(k*k))`.
 * Given m, n <= 30, and k <= min(m, n) <= 30.
 * In the worst case, m=30, n=30, k=30. The complexity would be roughly `O(1 * 1 * 30*30 * log(30*30))`, which is approximately `O(900 * log(900))`. This is well within typical time limits.
 *
 * Space Complexity:
 * - Storing the `submatrixElements`: `O(k*k)`.
 * - Storing the `ans` matrix: `O((m-k+1) * (n-k+1))`.
 *
 * Total Space Complexity: `O(k*k + (m-k+1) * (n-k+1))`.
 * In the worst case, this is `O(m*n)`.
 */
/**
 * @param {number[][]} grid
 * @param {number} k
 * @return {number[][]}
 */
var minAbsoluteDifference = function(grid, k) {
    const m = grid.length;
    const n = grid[0].length;

    // Initialize the answer matrix with dimensions (m - k + 1) x (n - k + 1)
    // This will store the minimum absolute difference for each k x k submatrix.
    const ans = Array(m - k + 1).fill(null).map(() => Array(n - k + 1).fill(0));

    // Iterate through each possible starting row of a k x k submatrix.
    // The last possible starting row is m - k.
    for (let i = 0; i <= m - k; i++) {
        // Iterate through each possible starting column of a k x k submatrix.
        // The last possible starting column is n - k.
        for (let j = 0; j <= n - k; j++) {
            // This is the top-left corner (i, j) of the current k x k submatrix.

            // Store all elements of the current k x k submatrix.
            const submatrixElements = [];

            // Extract elements from the submatrix.
            for (let row = i; row < i + k; row++) {
                for (let col = j; col < j + k; col++) {
                    submatrixElements.push(grid[row][col]);
                }
            }

            // Sort the extracted elements. This is crucial for efficiently finding
            // the minimum absolute difference between adjacent elements.
            submatrixElements.sort((a, b) => a - b);

            // Initialize the minimum absolute difference for this submatrix to infinity.
            let minDiff = Infinity;

            // If there's only one element in the submatrix (k=1), the difference is 0.
            // The loop below won't run if submatrixElements.length < 2.
            // If all elements are the same, minDiff will remain Infinity.
            if (submatrixElements.length >= 2) {
                // Iterate through the sorted elements to find the minimum difference
                // between any two adjacent elements.
                for (let l = 1; l < submatrixElements.length; l++) {
                    const currentDiff = submatrixElements[l] - submatrixElements[l - 1];
                    minDiff = Math.min(minDiff, currentDiff);

                    // Optimization: If we find a difference of 0, it means there are duplicate
                    // elements, and 0 is the smallest possible absolute difference. We can stop early.
                    if (minDiff === 0) {
                        break;
                    }
                }
            }

            // If minDiff is still Infinity, it means all elements in the submatrix were the same,
            // or there was only one element (k=1). In such cases, the minimum absolute difference is 0.
            // Otherwise, use the calculated minDiff.
            ans[i][j] = (minDiff === Infinity) ? 0 : minDiff;
        }
    }

    // Return the 2D array containing the minimum absolute differences for all k x k submatrices.
    return ans;
};
```