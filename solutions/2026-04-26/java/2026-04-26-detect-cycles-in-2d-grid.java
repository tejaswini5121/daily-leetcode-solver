/**
 * Problem: Detect Cycles in 2D Grid
 * Link: https://leetcode.com/problems/detect-cycles-in-2d-grid/
 *
 * Approach:
 * We can use Depth-First Search (DFS) to detect cycles. For each unvisited cell,
 * we start a DFS traversal. During DFS, we keep track of visited cells and the
 * parent cell from which we arrived at the current cell. A cycle is detected if
 * we encounter a visited cell that is not the immediate parent of the current cell
 * and has the same character value.
 *
 * To avoid revisiting cells unnecessarily and to manage the state for cycle detection,
 * we use a `visited` array. When starting DFS from a cell, we mark it as visited.
 * When exploring neighbors, if a neighbor has the same character and has already
 * been visited (and it's not the immediate parent), we've found a cycle.
 *
 * Time Complexity: O(m * n), where m is the number of rows and n is the number of columns.
 * Each cell is visited at most once during the DFS traversal.
 *
 * Space Complexity: O(m * n) for the `visited` array and the recursion stack in the worst case.
 */
class Solution {
    // Directions for moving in the grid: up, down, left, right
    private final int[][] DIRS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    private int m; // Number of rows
    private int n; // Number of columns
    private char[][] grid; // The input grid
    private boolean[][] visited; // Keeps track of visited cells

    /**
     * Main function to detect cycles in the 2D grid.
     * @param grid The input 2D character array.
     * @return true if a cycle exists, false otherwise.
     */
    public boolean containsCycle(char[][] grid) {
        this.grid = grid;
        this.m = grid.length;
        this.n = grid[0].length;
        this.visited = new boolean[m][n]; // Initialize visited array to all false

        // Iterate through each cell of the grid
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // If the cell has not been visited yet, start a DFS from it
                if (!visited[i][j]) {
                    // If DFS from this cell finds a cycle, return true
                    if (dfs(i, j, -1, -1, grid[i][j])) {
                        return true;
                    }
                }
            }
        }
        // If no cycle is found after checking all cells, return false
        return false;
    }

    /**
     * Depth-First Search (DFS) function to explore the grid and detect cycles.
     * @param r The current row index.
     * @param c The current column index.
     * @param pr The row index of the parent cell.
     * @param pc The column index of the parent cell.
     * @param targetChar The character value we are looking for in the cycle.
     * @return true if a cycle is detected from this path, false otherwise.
     */
    private boolean dfs(int r, int c, int pr, int pc, char targetChar) {
        // Mark the current cell as visited
        visited[r][c] = true;

        // Explore all four possible directions (up, down, left, right)
        for (int[] dir : DIRS) {
            int nr = r + dir[0]; // Neighbor row
            int nc = c + dir[1]; // Neighbor column

            // Check if the neighbor is within the grid boundaries
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                // Check if the neighbor has the same character as the target character
                if (grid[nr][nc] == targetChar) {
                    // If the neighbor is the parent cell, skip it to avoid going back immediately
                    if (nr == pr && nc == pc) {
                        continue;
                    }
                    // If the neighbor has already been visited and it's not the parent,
                    // it means we've found a cycle.
                    if (visited[nr][nc]) {
                        return true; // Cycle detected!
                    }
                    // If the neighbor is not visited, recursively call DFS on it.
                    // Pass the current cell (r, c) as the parent for the next call.
                    if (dfs(nr, nc, r, c, targetChar)) {
                        return true; // Cycle detected in a deeper recursive call.
                    }
                }
            }
        }
        // If no cycle is found from this path, return false
        return false;
    }
}
