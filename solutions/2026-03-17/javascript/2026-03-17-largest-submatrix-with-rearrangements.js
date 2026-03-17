/**
 * @param {number[][]} matrix
 * @return {number}
 *
 * Problem: Largest Submatrix With Rearrangements
 * Link: https://leetcode.com/problems/largest-submatrix-with-rearrangements/
 *
 * Approach:
 * The core idea is to determine, for each cell (i, j), how many consecutive 1s are there upwards from that cell (including itself).
 * We can precompute this by iterating through the matrix from top to bottom. If matrix[i][j] is 0, the count is 0. Otherwise, it's 1 + the count from the cell directly above (matrix[i-1][j]).
 *
 * After computing these "heights" for each cell, we can consider each row independently. For a given row `i`, we have an array of heights. To maximize the submatrix area in this row, we should rearrange the columns such that taller columns are placed adjacent to each other.
 * Therefore, for each row, we sort the heights in descending order.
 *
 * Once sorted, for each height `h` at index `k` in the sorted list of heights for row `i`, we can form a submatrix of width `k + 1` and height `h`. The area would be `(k + 1) * h`. We iterate through all possible `k` for the current row and find the maximum area.
 *
 * We maintain a global maximum area across all rows.
 *
 * Time Complexity:
 * 1. Precomputing heights: O(m * n), where m is the number of rows and n is the number of columns.
 * 2. For each row:
 *    a. Sorting heights: O(n log n).
 *    b. Calculating max area for the row: O(n).
 *    Since this is done for `m` rows, the total for this part is O(m * n log n).
 *
 * Overall Time Complexity: O(m * n log n).
 *
 * Space Complexity:
 * O(m * n) to store the precomputed heights. If we modify the input matrix in-place to store heights, then it could be O(1) extra space if allowed, but typically a separate matrix is used for clarity or if the input is read-only. Here, we'll use a separate array for heights for each row.
 *
 * Overall Space Complexity: O(n) if we process row by row and store heights for the current row. If we precompute heights for the entire matrix, it's O(m*n). Let's optimize to O(n) by processing row by row.
 */
/**
 * @param {number[][]} matrix
 * @return {number}
 */
var largestSubmatrix = function(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    let maxArea = 0;

    // Create an array to store the heights of consecutive 1s upwards for each column in the current row.
    // This array will be reused for each row.
    const heights = new Array(n).fill(0);

    // Iterate through each row of the matrix
    for (let i = 0; i < m; i++) {
        // Update the heights array for the current row
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === 1) {
                // If the current cell is 1, increment its height based on the height from the row above.
                // If it's the first row (i=0), heights[j] will be 0 initially, so this correctly sets it to 1.
                heights[j]++;
            } else {
                // If the current cell is 0, reset the height for this column to 0.
                heights[j] = 0;
            }
        }

        // For the current row, we have an array of heights. To find the largest submatrix,
        // we can sort these heights in descending order.
        // Then, for each height `h` at index `k` in the sorted array, we can form a submatrix
        // of width `k + 1` and height `h`. The area is `(k + 1) * h`.
        // We want to find the maximum such area.

        // Create a copy of heights to sort, so we don't modify the original heights array
        // which is needed for the next row's calculation.
        const sortedHeights = [...heights];
        sortedHeights.sort((a, b) => b - a); // Sort in descending order

        // Calculate the maximum area for the current row
        for (let k = 0; k < n; k++) {
            // If sortedHeights[k] is 0, any further heights will also be 0 or smaller,
            // so we can stop considering wider submatrices.
            if (sortedHeights[k] === 0) {
                break;
            }
            // The width of the submatrix is (k + 1) because we are considering k+1 columns
            // (from index 0 to k in the sorted array) which all have at least height sortedHeights[k].
            const currentArea = (k + 1) * sortedHeights[k];
            maxArea = Math.max(maxArea, currentArea);
        }
    }

    return maxArea;
};
```