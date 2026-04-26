/**
 * @param {character[][]} grid
 * @return {boolean}
 */
// Problem: Detect Cycles in 2D Grid
// Link: https://leetcode.com/problems/detect-cycles-in-2d-grid/
// Approach:
// We can use Depth-First Search (DFS) to detect cycles.
// For each cell in the grid, if it hasn't been visited yet, we start a DFS from that cell.
// During the DFS, we keep track of the current cell, its value, and the parent cell from which we arrived.
// We mark cells as visited. If we encounter a visited cell that has the same character and is not the immediate parent,
// it means we have found a cycle.
// The condition "you cannot move to the cell that you visited in your last move" is handled by passing the parent's coordinates to the DFS function.
//
// Time Complexity: O(m * n), where m is the number of rows and n is the number of columns.
// Each cell is visited at most once.
// Space Complexity: O(m * n) in the worst case, for the recursion stack if the grid is traversed deeply without finding a cycle,
// or for the visited set.
const detectCyclesIn2DGrid = (grid) => {
    // Get the dimensions of the grid
    const m = grid.length;
    const n = grid[0].length;

    // Initialize a 2D array to keep track of visited cells.
    // 'visited[r][c]' will be true if the cell (r, c) has been visited in the current DFS path.
    const visited = Array(m).fill(0).map(() => Array(n).fill(false));

    // Define the possible movements (up, down, left, right)
    const directions = [
        [-1, 0], // up
        [1, 0],  // down
        [0, -1], // left
        [0, 1]   // right
    ];

    /**
     * Depth-First Search function to explore the grid and detect cycles.
     * @param {number} r - The current row.
     * @param {number} c - The current column.
     * @param {number} pr - The row of the parent cell (from which we arrived).
     * @param {number} pc - The column of the parent cell (from which we arrived).
     * @param {character} char - The character value of the current cell.
     * @returns {boolean} - True if a cycle is detected, false otherwise.
     */
    const dfs = (r, c, pr, pc, char) => {
        // Mark the current cell as visited
        visited[r][c] = true;

        // Explore all four possible directions from the current cell
        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;

            // Check if the new coordinates are within the grid boundaries
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                // Check if the neighbor has the same character
                if (grid[nr][nc] === char) {
                    // If the neighbor is the parent cell, skip it (to avoid going back immediately)
                    if (nr === pr && nc === pc) {
                        continue;
                    }

                    // If the neighbor has already been visited in this DFS path, we've found a cycle.
                    if (visited[nr][nc]) {
                        return true;
                    }

                    // If the neighbor has the same character and hasn't been visited,
                    // recursively call DFS on the neighbor.
                    // If the recursive call finds a cycle, return true.
                    if (dfs(nr, nc, r, c, char)) {
                        return true;
                    }
                }
            }
        }
        // If no cycle is found from this cell, return false.
        return false;
    };

    // Iterate through each cell of the grid
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            // If the cell has not been visited yet, start a DFS from it.
            // We pass -1, -1 as parent coordinates for the starting cell because it has no parent.
            if (!visited[r][c]) {
                if (dfs(r, c, -1, -1, grid[r][c])) {
                    // If DFS from this cell detects a cycle, return true immediately.
                    return true;
                }
            }
        }
    }

    // If no cycles are found after checking all cells, return false.
    return false;
};
```