```java
/**
 * Problem: Check if There is a Valid Path in a Grid
 * Link: https://leetcode.com/problems/check-if-there-is-a-valid-path-in-a-grid/
 *
 * Approach:
 * This problem can be solved using either Breadth-First Search (BFS) or Depth-First Search (DFS).
 * We start from the top-left cell (0,0) and explore possible paths based on the street configurations in each cell.
 * We use a visited set to keep track of cells we've already processed to avoid cycles and redundant computations.
 * For each cell, we determine its possible outgoing connections based on its street type.
 * We then check if these outgoing connections lead to valid, unvisited adjacent cells.
 * If we reach the bottom-right cell (m-1, n-1), a valid path exists.
 *
 * Time Complexity: O(m * n), where m is the number of rows and n is the number of columns in the grid.
 * In the worst case, we visit each cell at most once.
 *
 * Space Complexity: O(m * n) for the visited set and the recursion stack (for DFS) or queue (for BFS).
 */
import java.util.LinkedList;
import java.util.Queue;

class Solution {
    // Define directions for movement: up, down, left, right
    // For each direction, we store the change in row and column
    // For example, { -1, 0 } means moving one step up (row decreases by 1, column stays the same)
    // The order of directions is important for matching street types.
    // The indices of these arrays will correspond to the possible connections for each street type.
    //
    // Street Type 1: Left-Right
    //   - Connects to: Left (-1, 0), Right (1, 0)
    // Street Type 2: Up-Down
    //   - Connects to: Up (0, -1), Down (0, 1)
    // Street Type 3: Left-Down
    //   - Connects to: Left (-1, 0), Down (0, 1)
    // Street Type 4: Right-Down
    //   - Connects to: Right (1, 0), Down (0, 1)
    // Street Type 5: Left-Up
    //   - Connects to: Left (-1, 0), Up (0, -1)
    // Street Type 6: Right-Up
    //   - Connects to: Right (1, 0), Up (0, -1)

    // These arrays represent the possible adjacent cells a street can connect to.
    // The first element in each pair is the row offset, the second is the column offset.
    // For example, for street type 1 (1), it connects left and right.
    // If we are at cell (r, c) with street type 1, we can potentially move to (r + dr[0], c + dc[0]) or (r + dr[1], c + dc[1]).
    // The mapping is:
    // dr[0], dc[0]: First connection for this street type
    // dr[1], dc[1]: Second connection for this street type
    //
    // The key idea is to define which "sides" of a cell are connected by each street type,
    // and then map these "sides" to absolute directions (up, down, left, right).
    //
    // For a cell at (r, c), we want to know what are the possible neighbors (r+dr, c+dc).
    // The connection logic is reversed: if cell A connects to cell B, then cell B must also connect back to cell A.
    //
    // Example: Street type 1 (horizontal). Connects left and right.
    // If we are at cell (r, c) and it has street type 1:
    //   - It can connect to the cell to its left (r, c-1).
    //   - It can connect to the cell to its right (r, c+1).
    // So, from (r, c), we check neighbors (r, c-1) and (r, c+1).
    // When we are at (r, c-1), we need to see if it connects *back* to (r, c).
    //
    // Let's define connections from the perspective of the *current* cell.
    // For a cell (r, c) with a given `streetType`:
    //
    // streetType 1: Horizontal. Connects left and right.
    //   - Can connect to (r, c-1) (left).
    //   - Can connect to (r, c+1) (right).
    //
    // streetType 2: Vertical. Connects up and down.
    //   - Can connect to (r-1, c) (up).
    //   - Can connect to (r+1, c) (down).
    //
    // streetType 3: Left-Down.
    //   - Can connect to (r, c-1) (left).
    //   - Can connect to (r+1, c) (down).
    //
    // streetType 4: Right-Down.
    //   - Can connect to (r, c+1) (right).
    //   - Can connect to (r+1, c) (down).
    //
    // streetType 5: Left-Up.
    //   - Can connect to (r, c-1) (left).
    //   - Can connect to (r-1, c) (up).
    //
    // streetType 6: Right-Up.
    //   - Can connect to (r, c+1) (right).
    //   - Can connect to (r-1, c) (up).
    //
    // To implement this, we can use a mapping where for each `streetType`, we know which
    // absolute directions are connected.
    //
    // Let's use the indices of `dr` and `dc` to represent directions:
    // Index 0: Up (-1, 0)
    // Index 1: Down (1, 0)
    // Index 2: Left (0, -1)
    // Index 3: Right (0, 1)
    //
    // Now, for each street type, we need to specify which of these direction indices it connects to.
    //
    // streetType 1 (Left-Right): Connects to Left (idx 2) and Right (idx 3).
    // streetType 2 (Up-Down): Connects to Up (idx 0) and Down (idx 1).
    // streetType 3 (Left-Down): Connects to Left (idx 2) and Down (idx 1).
    // streetType 4 (Right-Down): Connects to Right (idx 3) and Down (idx 1).
    // streetType 5 (Left-Up): Connects to Left (idx 2) and Up (idx 0).
    // streetType 6 (Right-Up): Connects to Right (idx 3) and Up (idx 0).
    //
    // We can use arrays to store these connections. For each street type, the array will contain
    // the indices of the connected directions.

    // dr and dc represent the row and column changes for UP, DOWN, LEFT, RIGHT respectively.
    // dr[0] = -1, dc[0] = 0  (UP)
    // dr[1] = 1,  dc[1] = 0  (DOWN)
    // dr[2] = 0,  dc[2] = -1 (LEFT)
    // dr[3] = 0,  dc[3] = 1  (RIGHT)
    private static final int[] dr = {-1, 1, 0, 0};
    private static final int[] dc = {0, 0, -1, 1};

    // For each street type (1-6), this array stores the indices of the directions it connects to.
    // For example, `connections[1]` is {2, 3}, meaning street type 1 connects to LEFT (index 2) and RIGHT (index 3).
    private static final int[][] connections = {
            {},          // Index 0 is unused
            {2, 3},      // Street type 1: Left, Right
            {0, 1},      // Street type 2: Up, Down
            {2, 1},      // Street type 3: Left, Down
            {3, 1},      // Street type 4: Right, Down
            {2, 0},      // Street type 5: Left, Up
            {3, 0}       // Street type 6: Right, Up
    };

    public boolean hasValidPath(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        // We will use BFS for exploration. A queue will store the cells to visit.
        Queue<int[]> queue = new LinkedList<>();
        // A 2D boolean array to keep track of visited cells.
        boolean[][] visited = new boolean[m][n];

        // Start from the top-left cell (0, 0).
        queue.offer(new int[]{0, 0});
        visited[0][0] = true;

        // Perform BFS.
        while (!queue.isEmpty()) {
            int[] currentCell = queue.poll();
            int r = currentCell[0];
            int c = currentCell[1];
            int streetType = grid[r][c];

            // If we have reached the bottom-right cell, we have found a valid path.
            if (r == m - 1 && c == n - 1) {
                return true;
            }

            // Get the possible outgoing directions for the current street type.
            // `connections[streetType]` gives us an array of indices into `dr` and `dc`.
            int[] connectedDirectionsIndices = connections[streetType];

            // Iterate through the two possible connections from the current cell.
            for (int directionIndex : connectedDirectionsIndices) {
                // Calculate the coordinates of the neighboring cell.
                int nr = r + dr[directionIndex];
                int nc = c + dc[directionIndex];

                // Check if the neighbor is within the grid boundaries.
                if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                    // Check if the neighbor has already been visited.
                    if (!visited[nr][nc]) {
                        // Now, we need to check if the neighbor cell connects *back* to the current cell.
                        // This is crucial for ensuring a continuous path.
                        int neighborStreetType = grid[nr][nc];
                        int[] neighborConnections = connections[neighborStreetType];

                        // For each connection from the neighbor cell, see if it points back to the current cell.
                        boolean connectsBack = false;
                        for (int neighborDirectionIndex : neighborConnections) {
                            // Calculate the coordinates of the cell that the neighbor connects to in this direction.
                            int prevR = nr + dr[neighborDirectionIndex];
                            int prevC = nc + dc[neighborDirectionIndex];

                            // If this connection leads back to the current cell (r, c), then the path is valid.
                            if (prevR == r && prevC == c) {
                                connectsBack = true;
                                break; // Found a connection back, no need to check further for this neighbor.
                            }
                        }

                        // If the neighbor connects back to the current cell, add it to the queue and mark as visited.
                        if (connectsBack) {
                            queue.offer(new int[]{nr, nc});
                            visited[nr][nc] = true;
                        }
                    }
                }
            }
        }

        // If the queue becomes empty and we haven't reached the destination, no valid path exists.
        return false;
    }
}
```