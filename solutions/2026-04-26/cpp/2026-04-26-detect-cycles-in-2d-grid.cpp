```cpp
/*
Problem Summary:
Given a 2D grid of characters, determine if there's a cycle of characters with the same value.
A cycle must have a length of at least 4 and cannot revisit the immediate parent cell.

Link: https://leetcode.com/problems/detect-cycles-in-2d-grid/

Approach:
We can use Depth First Search (DFS) to detect cycles. For each cell, if it hasn't been visited,
we start a DFS from it. During DFS, we keep track of the current cell's coordinates, its parent's
coordinates (to avoid going back immediately), and the character value we are looking for.

When exploring neighbors, if a neighbor has the same character value and has already been visited
during the *current* DFS traversal (indicated by a different state or by checking if it's the parent),
and importantly, if it's not the immediate parent, we've found a cycle.

To distinguish between cells visited in the current DFS path and cells visited in previous DFS traversals
(that did not lead to a cycle), we can use a `visited` matrix.
`visited[r][c] = 0` means not visited.
`visited[r][c] = 1` means currently being visited in the ongoing DFS path.
`visited[r][c] = 2` means visited and processed in a previous DFS path (no cycle found from it).

When we start a DFS from `(r, c)` with character `target_char`, we mark `visited[r][c] = 1`.
For each valid neighbor `(nr, nc)` (same character, within bounds):
1. If `(nr, nc)` is the parent `(pr, pc)`, we ignore it.
2. If `visited[nr][nc] == 1`, we have found a cycle because we encountered a cell that is already in our current DFS path and is not our immediate parent. Return `true`.
3. If `visited[nr][nc] == 0`, recursively call DFS on `(nr, nc)` with `(r, c)` as its parent. If the recursive call returns `true`, propagate `true` upwards.

After exploring all neighbors of `(r, c)` and returning from its DFS call, we mark `visited[r][c] = 2` to indicate it has been fully processed.

Time Complexity: O(m * n), where m is the number of rows and n is the number of columns.
Each cell is visited at most a constant number of times (during DFS and marking as visited/processed).

Space Complexity: O(m * n) in the worst case for the recursion stack during DFS, and for the `visited` matrix.
*/

#include <vector>
#include <string>

class Solution {
public:
    int m, n;
    // visited states:
    // 0: not visited
    // 1: currently in DFS path
    // 2: finished processing (in a previous path or current path but no cycle from it)
    std::vector<std::vector<int>> visited;
    // Directions for moving up, down, left, right
    int dr[4] = {-1, 1, 0, 0};
    int dc[4] = {0, 0, -1, 1};

    bool isValid(int r, int c) {
        return r >= 0 && r < m && c >= 0 && c < n;
    }

    // DFS function to detect cycles
    // r: current row
    // c: current column
    // pr: parent row
    // pc: parent column
    // target_char: the character we are looking for in the cycle
    bool dfs(int r, int c, int pr, int pc, char target_char, const std::vector<std::vector<char>>& grid) {
        // Mark the current cell as being visited in the current DFS path
        visited[r][c] = 1;

        // Explore all four possible directions
        for (int i = 0; i < 4; ++i) {
            int nr = r + dr[i]; // next row
            int nc = c + dc[i]; // next column

            // Check if the neighbor is valid (within bounds)
            if (isValid(nr, nc)) {
                // If the neighbor has the same character we are looking for
                if (grid[nr][nc] == target_char) {
                    // If the neighbor is the immediate parent, skip it to avoid going back immediately
                    if (nr == pr && nc == pc) {
                        continue;
                    }

                    // If the neighbor is already in the current DFS path (visited[nr][nc] == 1),
                    // and it's not the parent, we've found a cycle.
                    if (visited[nr][nc] == 1) {
                        return true; // Cycle detected
                    }

                    // If the neighbor has not been visited yet (visited[nr][nc] == 0)
                    // Recursively call DFS on the neighbor.
                    // If the recursive call finds a cycle, propagate true upwards.
                    if (visited[nr][nc] == 0) {
                        if (dfs(nr, nc, r, c, target_char, grid)) {
                            return true; // Cycle found deeper in the recursion
                        }
                    }
                    // If visited[nr][nc] == 2, it means this cell was processed in a previous DFS branch
                    // that did not lead to a cycle. We don't need to revisit it.
                }
            }
        }

        // After exploring all neighbors, mark the current cell as fully processed.
        // This is important to distinguish between cells in the current path and cells
        // visited in previous, non-cyclic paths.
        visited[r][c] = 2;
        return false; // No cycle found from this path
    }

    bool containsCycle(std::vector<std::vector<char>>& grid) {
        m = grid.size();
        if (m == 0) return false;
        n = grid[0].size();
        if (n == 0) return false;

        // Initialize the visited matrix with all cells marked as not visited (0)
        visited.assign(m, std::vector<int>(n, 0));

        // Iterate through each cell in the grid
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                // If the cell has not been visited yet, start a DFS from it.
                // The parent coordinates (-1, -1) are arbitrary for the starting node.
                if (visited[i][j] == 0) {
                    if (dfs(i, j, -1, -1, grid[i][j], grid)) {
                        return true; // A cycle was found
                    }
                }
            }
        }

        // If we iterate through the entire grid without finding any cycles, return false.
        return false;
    }
};
```