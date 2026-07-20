// Problem: Shift 2D Grid
// Summary: Shifts elements in a 2D grid cyclically to the right and down, k times.
// Link: https://leetcode.com/problems/shift-2d-grid/
//
// Approach:
// The key insight is that the grid shift operation can be thought of as a single
// linear shift if we flatten the 2D grid into a 1D array.
//
// 1. Flatten the 2D grid into a 1D array.
// 2. Calculate the effective number of shifts by taking `k` modulo the total number of elements in the grid. This is because shifting by the total number of elements brings the grid back to its original state.
// 3. Perform the shift on the 1D array. The element at index `i` will move to index `(i + effective_k) % total_elements`.
// 4. Reconstruct the 2D grid from the shifted 1D array.
//
// Time Complexity: O(m * n) where m is the number of rows and n is the number of columns.
// We iterate through the grid once to flatten it, once to perform the shift (conceptually), and once to reconstruct it.
//
// Space Complexity: O(m * n) to store the flattened 1D array.

/**
 * @param {number[][]} grid
 * @param {number} k
 * @return {number[][]}
 */
var shiftGrid = function(grid, k) {
    const m = grid.length;
    const n = grid[0].length;
    const totalElements = m * n;

    // Calculate the effective number of shifts.
    // Shifting by totalElements brings the grid back to its original state.
    const effectiveK = k % totalElements;

    // If effectiveK is 0, no shift is needed, return the original grid.
    if (effectiveK === 0) {
        return grid;
    }

    // Create a 1D array to represent the flattened grid.
    const flatGrid = new Array(totalElements);

    // Flatten the 2D grid into a 1D array.
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            flatGrid[i * n + j] = grid[i][j];
        }
    }

    // Create a new 1D array to store the shifted elements.
    const shiftedFlatGrid = new Array(totalElements);

    // Perform the shift operation on the 1D array.
    // Each element at index `i` moves to `(i + effectiveK) % totalElements`.
    for (let i = 0; i < totalElements; i++) {
        const newIndex = (i + effectiveK) % totalElements;
        shiftedFlatGrid[newIndex] = flatGrid[i];
    }

    // Reconstruct the 2D grid from the shifted 1D array.
    const resultGrid = Array(m).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            resultGrid[i][j] = shiftedFlatGrid[i * n + j];
        }
    }

    return resultGrid;
};
