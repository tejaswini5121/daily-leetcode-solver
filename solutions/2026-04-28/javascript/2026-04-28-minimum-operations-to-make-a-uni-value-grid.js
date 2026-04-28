/**
 * @param {number[][]} grid
 * @param {number} x
 * @return {number}
 * Problem Summary: Given a 2D grid and an integer x, find the minimum operations to make all grid elements equal by adding or subtracting x from any element. Return -1 if impossible.
 * Link: https://leetcode.com/problems/minimum-operations-to-make-a-uni-value-grid/
 *
 * Approach:
 * 1. First, we need to check if it's even possible to make all elements equal. For all elements to be made equal by adding/subtracting x, they must all have the same remainder when divided by x. If this condition is not met, we return -1.
 * 2. If the condition is met, we flatten the grid into a single array.
 * 3. To minimize the total operations (which is the sum of absolute differences between each element and the target value, all divided by x), we should choose the median of the flattened array as our target value. This is because the median minimizes the sum of absolute deviations.
 * 4. Calculate the total number of operations by summing up the absolute differences between each element and the median, and then dividing by x.
 *
 * Time Complexity:
 * - Flattening the grid: O(m * n), where m is the number of rows and n is the number of columns.
 * - Sorting the flattened array: O(m * n * log(m * n)).
 * - Finding the median: O(1) after sorting.
 * - Calculating total operations: O(m * n).
 * Therefore, the dominant factor is sorting, resulting in O(m * n * log(m * n)).
 *
 * Space Complexity:
 * - Storing the flattened array: O(m * n).
 * Therefore, the space complexity is O(m * n).
 */

/**
 * @param {number[][]} grid
 * @param {number} x
 * @return {number}
 */
var minOperations = function(grid, x) {
    // Flatten the grid into a single array
    const flattenedGrid = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            // Check if all elements have the same remainder when divided by x
            // If not, it's impossible to make them equal
            if (flattenedGrid.length > 0 && grid[i][j] % x !== flattenedGrid[0] % x) {
                return -1;
            }
            flattenedGrid.push(grid[i][j]);
        }
    }

    // Sort the flattened array to easily find the median
    flattenedGrid.sort((a, b) => a - b);

    // The median of the sorted array is the optimal target value to minimize operations
    const n = flattenedGrid.length;
    const median = flattenedGrid[Math.floor(n / 2)];

    let operations = 0;
    // Calculate the total number of operations
    for (let i = 0; i < n; i++) {
        const diff = Math.abs(flattenedGrid[i] - median);
        // We've already checked for divisibility by x when flattening,
        // so diff should always be divisible by x.
        operations += diff / x;
    }

    return operations;
};
