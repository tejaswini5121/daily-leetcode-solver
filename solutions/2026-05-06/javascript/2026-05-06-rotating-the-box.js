/**
 * @summary Rotates a box grid 90 degrees clockwise and simulates gravity for stones.
 * @link https://leetcode.com/problems/rotating-the-box/
 *
 * Approach:
 * 1. Transpose the grid: The original grid `boxGrid` (m x n) becomes `transposedGrid` (n x m).
 *    The cell `boxGrid[r][c]` moves to `transposedGrid[c][r]`.
 * 2. Reverse rows of the transposed grid: To simulate the 90-degree clockwise rotation,
 *    we reverse each row of the `transposedGrid`. Now `transposedGrid[c][r]` becomes
 *    `rotatedGrid[c][n-1-r]`. This effectively places the elements in their correct
 *    rotated positions.
 * 3. Simulate gravity: For each column `j` in the `rotatedGrid`, we iterate from bottom
 *    to top. We maintain a pointer `stoneRow` that indicates the next available row
 *    from the bottom where a stone can land.
 *    - If we encounter a stone ('#'), we place it at `rotatedGrid[stoneRow][j]` and
 *      decrement `stoneRow`.
 *    - If we encounter an obstacle ('*'), we update `stoneRow` to be the row just above
 *      the obstacle.
 *    - Empty cells ('.') are naturally handled as we skip over them and only place stones
 *      in available slots determined by `stoneRow`.
 *
 * Time Complexity:
 * - Transposing: O(m * n)
 * - Reversing rows: O(m * n)
 * - Simulating gravity: O(m * n) (each cell is visited a constant number of times)
 * Total Time Complexity: O(m * n)
 *
 * Space Complexity:
 * - Storing the rotated grid: O(m * n) to create the new `rotatedGrid`.
 * Total Space Complexity: O(m * n)
 */

/**
 * @param {character[][]} boxGrid
 * @return {character[][]}
 */
var rotateAndSimulateGravity = function(boxGrid) {
    const m = boxGrid.length;
    const n = boxGrid[0].length;

    // 1. Transpose the grid
    // new grid will be n x m
    const transposedGrid = Array(n).fill(0).map(() => Array(m).fill('.'));
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            transposedGrid[c][r] = boxGrid[r][c];
        }
    }

    // 2. Reverse rows of the transposed grid to achieve 90-degree clockwise rotation
    // The dimensions are now n x m, and we want to reverse each row.
    const rotatedGrid = Array(n).fill(0).map(() => Array(m).fill('.'));
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < m; c++) {
            rotatedGrid[r][c] = transposedGrid[r][m - 1 - c];
        }
    }

    // 3. Simulate gravity for each column
    // Iterate through each column of the rotated grid
    for (let c = 0; c < m; c++) {
        // `stoneRow` tracks the next available row from the bottom for a stone to land
        let stoneRow = n - 1;
        // Iterate from the bottom row upwards for the current column
        for (let r = n - 1; r >= 0; r--) {
            if (rotatedGrid[r][c] === '#') {
                // If it's a stone, move it to the `stoneRow` position
                // and decrement `stoneRow` to find the next available spot
                rotatedGrid[stoneRow][c] = '#';
                // Clear the original position of the stone if it's not already the target position
                if (stoneRow !== r) {
                    rotatedGrid[r][c] = '.';
                }
                stoneRow--;
            } else if (rotatedGrid[r][c] === '*') {
                // If it's an obstacle, update `stoneRow` to be the row directly above it.
                // This ensures stones will stack on top of obstacles.
                stoneRow = r - 1;
            }
            // If it's an empty cell '.', we just continue, `stoneRow` remains unchanged.
        }
    }

    return rotatedGrid;
};
```