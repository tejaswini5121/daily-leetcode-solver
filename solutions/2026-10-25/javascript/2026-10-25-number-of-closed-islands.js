/**
 * @summary Counts the number of "closed" islands in a 2D grid where 0 represents land and 1 represents water.
 *          A closed island is a landmass completely surrounded by water.
 * @link https://leetcode.com/problems/number-of-closed-islands/
 *
 * @approach
 * The core idea is to identify and "eliminate" islands that are not closed. An island is not closed if any of its land cells (0s) touch the boundary of the grid.
 * We can achieve this by performing a Depth-First Search (DFS) or Breadth-First Search (BFS) starting from any land cell on the boundary of the grid.
 * During this traversal, we mark all connected land cells as visited or change their value (e.g., to 1, effectively turning them into water). These are the "open" islands.
 *
 * After eliminating all open islands, we then iterate through the entire grid again.
 * Any remaining land cell (0) that we encounter must belong to a closed island.
 * For each such land cell, we start another DFS/BFS to find the entire connected island and increment our count of closed islands. We then mark all cells of this closed island as visited/water to avoid recounting them.
 *
 * The DFS approach is implemented here.
 *
 * @timeComplexity
 * The time complexity is O(M * N), where M is the number of rows and N is the number of columns in the grid.
 * We iterate through the grid a constant number of times:
 * 1. To mark boundary-connected land as water.
 * 2. To count and mark the remaining closed islands.
 * Each cell is visited at most a constant number of times by the DFS.
 *
 * @spaceComplexity
 * The space complexity is O(M * N) in the worst case due to the recursion depth of the DFS.
 * If the grid is filled with land, the DFS call stack can go as deep as M * N.
 * If an iterative BFS approach were used with a queue, the space complexity would also be O(M * N) in the worst case for the queue.
 */

/**
 * @param {number[][]} grid
 * @return {number}
 */
var closedIsland = function(grid) {
    const m = grid.length;
    const n = grid[0].length;

    // Helper function for DFS to mark connected land cells as water (1)
    // This is used to eliminate "open" islands connected to the boundary.
    const dfs = (r, c) => {
        // Base cases:
        // 1. Out of bounds
        // 2. Current cell is water (1) or already visited (marked as 1)
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === 1) {
            return;
        }

        // Mark the current land cell as water (visited)
        grid[r][c] = 1;

        // Explore all 4-directionally connected neighbors
        dfs(r + 1, c); // Down
        dfs(r - 1, c); // Up
        dfs(r, c + 1); // Right
        dfs(r, c - 1); // Left
    };

    // Step 1: Eliminate "open" islands by starting DFS from boundary land cells.
    // Any land cell connected to the boundary is not part of a closed island.
    // We effectively turn these into water.

    // Top and bottom rows
    for (let c = 0; c < n; c++) {
        if (grid[0][c] === 0) { // Top row
            dfs(0, c);
        }
        if (grid[m - 1][c] === 0) { // Bottom row
            dfs(m - 1, c);
        }
    }

    // Left and right columns (excluding corners already checked)
    for (let r = 1; r < m - 1; r++) {
        if (grid[r][0] === 0) { // Left column
            dfs(r, 0);
        }
        if (grid[r][n - 1] === 0) { // Right column
            dfs(r, n - 1);
        }
    }

    // Step 2: Count the remaining "closed" islands.
    // Iterate through the grid. Any land cell (0) encountered now must be part of a closed island.
    let closedIslandCount = 0;
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            // If we find a land cell (0) that hasn't been turned into water yet,
            // it's the start of a new closed island.
            if (grid[r][c] === 0) {
                closedIslandCount++; // Increment the count
                // Use DFS to mark all cells of this newly found closed island as water.
                // This prevents recounting the same island.
                dfs(r, c);
            }
        }
    }

    return closedIslandCount;
};
```