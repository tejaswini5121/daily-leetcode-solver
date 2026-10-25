```java
/**
 * LeetCode Problem: Number of Closed Islands
 * Link: https://leetcode.com/problems/number-of-closed-islands/
 *
 * Problem Summary: Count the number of islands (connected 0s) that are completely surrounded by water (1s).
 *
 * Approach:
 * The core idea is to first eliminate any land cells (0s) that are connected to the boundary of the grid.
 * These land cells, by definition, cannot be part of a closed island because they touch the "outside."
 * We can achieve this by performing a Depth-First Search (DFS) or Breadth-First Search (BFS) starting from
 * all land cells on the border. During the traversal, we can mark these cells as visited or change them
 * to water (1) to effectively remove them from consideration.
 *
 * After this initial pruning step, any remaining land cells must belong to islands that are either closed
 * or connected to other land masses that are also not connected to the boundary.
 *
 * We then iterate through the grid again. For each unvisited land cell (0), we start another DFS/BFS.
 * This traversal will explore a connected component of land. If this entire component is successfully
 * explored without reaching the boundary (which we've already handled), then it represents a closed island.
 * We increment a counter for each such closed island found. To avoid recounting, we mark visited land cells
 * during this second traversal as well.
 *
 * The DFS approach:
 * 1. Helper function `dfs(grid, r, c)`: This function performs a DFS starting from cell (r, c).
 *    It marks the current cell as visited (e.g., by changing it to 1) and recursively calls itself for
 *    its 4-directional neighbors if they are land (0) and within grid bounds.
 *
 * 2. Main logic:
 *    a. Iterate through the first and last rows (r=0 and r=grid.length-1). If a cell `grid[r][c]` is 0,
 *       call `dfs(grid, r, c)` to mark all connected land cells that touch the top/bottom border.
 *    b. Iterate through the first and last columns (c=0 and c=grid[0].length-1). If a cell `grid[r][c]` is 0,
 *       call `dfs(grid, r, c)` to mark all connected land cells that touch the left/right border.
 *    c. Initialize `closed_islands_count = 0`.
 *    d. Iterate through the entire grid (r from 0 to grid.length-1, c from 0 to grid[0].length-1).
 *    e. If a cell `grid[r][c]` is land (0), it means this land cell is not connected to the boundary.
 *       Therefore, it's part of a potential closed island.
 *       Increment `closed_islands_count`.
 *       Call `dfs(grid, r, c)` to mark all connected land cells of this closed island so they are not
 *       counted again.
 *    f. Return `closed_islands_count`.
 *
 * Time Complexity: O(m * n), where m is the number of rows and n is the number of columns.
 *                  Each cell is visited at most a constant number of times (during the boundary
 *                  traversal and then potentially during the closed island counting traversal).
 *
 * Space Complexity: O(m * n) in the worst case for the recursion stack depth in DFS if the entire
 *                   grid is land. In practice, it's often much less. If we consider modifying the
 *                   grid in-place, then the auxiliary space is O(1) (excluding recursion stack).
 */
class Solution {
    public int closedIsland(int[][] grid) {
        // Get dimensions of the grid
        int rows = grid.length;
        int cols = grid[0].length;

        // Step 1: Eliminate land connected to the boundary.
        // We iterate through the border cells and use DFS to mark any connected land (0s)
        // as water (1s). These cannot be part of a closed island.

        // Traverse the first and last rows
        for (int c = 0; c < cols; c++) {
            // If we find land (0) in the first row, start DFS from there
            if (grid[0][c] == 0) {
                dfs(grid, 0, c);
            }
            // If we find land (0) in the last row, start DFS from there
            if (grid[rows - 1][c] == 0) {
                dfs(grid, rows - 1, c);
            }
        }

        // Traverse the first and last columns
        for (int r = 0; r < rows; r++) {
            // If we find land (0) in the first column, start DFS from there
            if (grid[r][0] == 0) {
                dfs(grid, r, 0);
            }
            // If we find land (0) in the last column, start DFS from there
            if (grid[r][cols - 1] == 0) {
                dfs(grid, r, cols - 1);
            }
        }

        // Step 2: Count the remaining closed islands.
        // Now, any remaining land cells (0s) must be part of closed islands.
        int closedIslandsCount = 0;

        // Iterate through the entire grid
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                // If we find a land cell (0) that hasn't been visited yet
                // (i.e., it's not been turned into water during boundary traversal)
                if (grid[r][c] == 0) {
                    // This cell is the start of a new closed island.
                    closedIslandsCount++;
                    // Perform DFS to mark all connected land cells of this island as visited (turn to 1)
                    // so they are not counted again.
                    dfs(grid, r, c);
                }
            }
        }

        // Return the total count of closed islands found.
        return closedIslandsCount;
    }

    /**
     * Helper function to perform Depth-First Search (DFS) on the grid.
     * It marks visited land cells by changing them to water (1).
     *
     * @param grid The 2D grid representing land (0) and water (1).
     * @param r    The current row index.
     * @param c    The current column index.
     */
    private void dfs(int[][] grid, int r, int c) {
        // Get dimensions of the grid
        int rows = grid.length;
        int cols = grid[0].length;

        // Base cases for recursion:
        // 1. If the current cell is out of bounds.
        // 2. If the current cell is water (1) or already visited (marked as 1).
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == 1) {
            return;
        }

        // Mark the current cell as visited by changing it to water (1)
        grid[r][c] = 1;

        // Recursively call DFS for all 4-directional neighbors:
        // Up
        dfs(grid, r - 1, c);
        // Down
        dfs(grid, r + 1, c);
        // Left
        dfs(grid, r, c - 1);
        // Right
        dfs(grid, r, c + 1);
    }
}
```