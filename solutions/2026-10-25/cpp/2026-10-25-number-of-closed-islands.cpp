```cpp
/*
Problem Summary:
Counts the number of "closed islands" in a 2D grid. A closed island is a group of land cells (0s)
completely surrounded by water cells (1s).

Link: https://leetcode.com/problems/number-of-closed-islands/

Approach:
The problem can be solved by first identifying and "removing" any land cells that are connected to the
boundary of the grid. These land cells cannot be part of a closed island. We can use Depth First Search (DFS)
or Breadth First Search (BFS) to achieve this.

1. Boundary DFS/BFS: Iterate through the cells on the border of the grid. If a cell is land (0), start a DFS/BFS
   from that cell to mark all connected land cells as visited or change them to water (1). This effectively
   "drains" any land connected to the edges.

2. Count Closed Islands: After processing the boundary, iterate through the entire grid again. If we find an unvisited
   land cell (0), it means this land cell is not connected to the boundary and thus must be part of a closed island.
   Start a DFS/BFS from this cell to mark all connected land cells of this island as visited (or change them to water).
   Increment a counter for each such island found.

We'll use DFS for both steps.

Time Complexity:
O(M * N), where M is the number of rows and N is the number of columns in the grid.
Each cell is visited at most a constant number of times (during the boundary DFS and then during the island counting DFS).

Space Complexity:
O(M * N) in the worst case for the recursion stack if DFS is used and the grid is filled with land.
If BFS is used, the space complexity would be O(M * N) for the queue in the worst case.
If we modify the grid in-place (changing 0s to 1s to mark visited), the auxiliary space is O(1) beyond the input grid.
We'll modify the grid in-place.
*/
#include <vector>
#include <queue>

class Solution {
public:
    int closedIsland(std::vector<std::vector<int>>& grid) {
        int rows = grid.size();
        if (rows == 0) return 0;
        int cols = grid[0].size();

        // Step 1: Flood-fill (DFS) from boundary land cells to mark them as visited (or change to water).
        // These cannot be part of a closed island.
        for (int r = 0; r < rows; ++r) {
            // Check left boundary
            if (grid[r][0] == 0) {
                dfs(grid, r, 0);
            }
            // Check right boundary
            if (grid[r][cols - 1] == 0) {
                dfs(grid, r, cols - 1);
            }
        }
        for (int c = 0; c < cols; ++c) {
            // Check top boundary
            if (grid[0][c] == 0) {
                dfs(grid, 0, c);
            }
            // Check bottom boundary
            if (grid[rows - 1][c] == 0) {
                dfs(grid, rows - 1, c);
            }
        }

        // Step 2: Iterate through the grid and count remaining unvisited land cells as closed islands.
        int closedIslandCount = 0;
        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < cols; ++c) {
                // If we find a land cell (0) that hasn't been visited yet (meaning it's not connected to the boundary),
                // it signifies the start of a closed island.
                if (grid[r][c] == 0) {
                    closedIslandCount++;
                    // Use DFS to mark all cells of this closed island as visited.
                    dfs(grid, r, c);
                }
            }
        }

        return closedIslandCount;
    }

private:
    // Helper function for Depth First Search (DFS).
    // It explores connected land cells (0s) and marks them as visited by changing them to water (1).
    void dfs(std::vector<std::vector<int>>& grid, int r, int c) {
        int rows = grid.size();
        int cols = grid[0].size();

        // Base cases for DFS:
        // 1. Out of bounds.
        // 2. Current cell is water (1) or already visited (marked as 1).
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == 1) {
            return;
        }

        // Mark the current cell as visited by changing it to water.
        grid[r][c] = 1;

        // Explore 4-directionally connected neighbors.
        dfs(grid, r + 1, c); // Down
        dfs(grid, r - 1, c); // Up
        dfs(grid, r, c + 1); // Right
        dfs(grid, r, c - 1); // Left
    }
};
```