/**
 * Problem: Rotating the Box
 * Summary: Rotates a 2D grid representing a box containing stones, obstacles, and empty spaces 90 degrees clockwise. Stones fall due to gravity after rotation.
 * Link: https://leetcode.com/problems/rotating-the-box/
 *
 * Approach:
 * 1. Simulate the rotation: A 90-degree clockwise rotation of an m x n grid results in an n x m grid.
 *    The element at boxGrid[i][j] in the original grid will move to rotatedGrid[j][m-1-i] in the new grid.
 * 2. Handle gravity after rotation: For each column in the rotated grid, simulate gravity.
 *    Iterate from bottom to top. Maintain a pointer to the next available empty slot for a stone.
 *    If an obstacle '*' is encountered, it acts as a new bottom for stones above it. Reset the empty slot pointer.
 *    If a stone '#' is encountered, place it in the next available empty slot and update the pointer.
 *
 * Time Complexity:
 * - Rotation: O(m * n), where m is the number of rows and n is the number of columns in the original grid.
 * - Gravity simulation for each column: For each of the n columns in the rotated grid (which has m rows), we iterate through the m rows. So, O(n * m).
 * - Total Time Complexity: O(m * n) + O(n * m) = O(m * n).
 *
 * Space Complexity:
 * - New grid for rotation: O(n * m) to store the rotated grid.
 * - Total Space Complexity: O(n * m).
 */
class Solution {
    /**
     * Rotates the box grid 90 degrees clockwise and simulates gravity.
     *
     * @param boxGrid The input 2D character array representing the box.
     * @return A new 2D character array representing the box after rotation and gravity.
     */
    public char[][] rotateTheBox(char[][] boxGrid) {
        int m = boxGrid.length;
        int n = boxGrid[0].length;

        // 1. Rotate the box 90 degrees clockwise.
        // The new grid will have dimensions n x m.
        // An element at originalGrid[i][j] moves to rotatedGrid[j][m-1-i].
        char[][] rotatedGrid = new char[n][m];

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                rotatedGrid[j][m - 1 - i] = boxGrid[i][j];
            }
        }

        // 2. Simulate gravity for each column in the rotated grid.
        // Iterate through each column of the rotated grid.
        for (int j = 0; j < m; j++) { // j iterates through columns of rotatedGrid (which corresponds to original rows)
            // `nextEmptyRow` points to the next available row for a stone in the current column.
            // It starts from the bottom-most row and moves upwards.
            int nextEmptyRow = n - 1; // n is the number of rows in the rotated grid.

            // Iterate from bottom to top for the current column.
            for (int i = n - 1; i >= 0; i--) { // i iterates through rows of rotatedGrid
                char cell = rotatedGrid[i][j];

                if (cell == '*') {
                    // If an obstacle is found, it becomes the new "bottom" for stones above it.
                    // Reset `nextEmptyRow` to the row just above the obstacle.
                    nextEmptyRow = i - 1;
                } else if (cell == '#') {
                    // If a stone is found, move it to the `nextEmptyRow` if it's not already there.
                    if (i != nextEmptyRow) {
                        rotatedGrid[nextEmptyRow][j] = '#';
                        // The original position of the stone becomes empty.
                        rotatedGrid[i][j] = '.';
                    }
                    // Move `nextEmptyRow` one step up for the next stone.
                    nextEmptyRow--;
                }
                // If the cell is '.', do nothing, it remains empty or gets filled by a falling stone.
            }
        }

        return rotatedGrid;
    }
}
