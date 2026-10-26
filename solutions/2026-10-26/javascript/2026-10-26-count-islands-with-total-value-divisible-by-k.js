// Summary: Counts the number of islands in a grid whose total cell values are divisible by k.
// An island is a connected group of positive numbers.
// Link: https://leetcode.com/problems/count-islands-with-total-value-divisible-by-k/
//
// Approach:
// We can use Depth-First Search (DFS) or Breadth-First Search (BFS) to traverse the grid and identify islands.
// For each unvisited positive cell, we start a traversal (DFS or BFS) to find all connected positive cells belonging to the same island.
// During the traversal, we sum up the values of all cells in the current island.
// We mark visited cells to avoid recounting them or starting new traversals from within an already discovered island.
// After completing the traversal for an island, we check if its total value is divisible by k. If it is, we increment a counter.
//
// DFS approach:
// - Initialize a `visited` matrix of the same dimensions as the `grid` to keep track of visited cells.
// - Initialize a `count` variable to 0.
// - Iterate through each cell `(r, c)` of the `grid`.
// - If `grid[r][c]` is positive and `visited[r][c]` is false:
//   - Start a DFS from `(r, c)`.
//   - The DFS function will recursively explore connected positive cells, sum their values, and mark them as visited.
//   - The DFS function returns the total sum of the island.
//   - If the returned sum is divisible by `k`, increment `count`.
// - Return `count`.
//
// DFS helper function: `dfs(r, c, grid, visited, k)`
//   - Base cases:
//     - If `(r, c)` is out of bounds.
//     - If `grid[r][c]` is 0 (water).
//     - If `visited[r][c]` is true.
//     - In these cases, return 0.
//   - Mark `visited[r][c]` as true.
//   - Initialize `currentSum` with `grid[r][c]`.
//   - Recursively call `dfs` for the 4-directional neighbors: `(r+1, c)`, `(r-1, c)`, `(r, c+1)`, `(r, c-1)`.
//   - Add the results of the recursive calls to `currentSum`.
//   - Return `currentSum`.
//
// Time Complexity: O(m * n)
// Each cell in the grid is visited at most once by the DFS/BFS traversal.
//
// Space Complexity: O(m * n)
// In the worst case, the recursion depth of DFS can be proportional to the number of cells in the grid, leading to O(m * n) space for the call stack.
// The `visited` matrix also takes O(m * n) space.
// If BFS is used, the queue can store up to O(m * n) elements in the worst case.
var countIslands = function(grid, k) {
    const m = grid.length;
    if (m === 0) {
        return 0;
    }
    const n = grid[0].length;
    if (n === 0) {
        return 0;
    }

    // Visited matrix to keep track of cells that have already been part of an island traversal.
    const visited = Array(m).fill(0).map(() => Array(n).fill(false));
    // Counter for the number of islands whose total value is divisible by k.
    let count = 0;

    // Directions for 4-directional movement (down, up, right, left).
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    /**
     * Depth-First Search (DFS) function to explore an island and calculate its total value.
     * @param {number} r - The current row index.
     * @param {number} c - The current column index.
     * @returns {number} The total value of the island found starting from (r, c).
     */
    const dfs = (r, c) => {
        // Base cases for recursion:
        // 1. If the current cell is out of bounds.
        // 2. If the current cell is water (value is 0).
        // 3. If the current cell has already been visited.
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === 0 || visited[r][c]) {
            return 0;
        }

        // Mark the current cell as visited to avoid revisiting.
        visited[r][c] = true;
        // Initialize the sum for the current island with the value of the current cell.
        let currentIslandSum = grid[r][c];

        // Explore all 4-directional neighbors.
        for (const [dr, dc] of directions) {
            const newRow = r + dr;
            const newCol = c + dc;
            // Recursively call DFS for each neighbor and add its contribution to the island's sum.
            currentIslandSum += dfs(newRow, newCol);
        }

        // Return the total sum of the island.
        return currentIslandSum;
    };

    // Iterate through each cell of the grid.
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            // If the cell contains land (positive value) and has not been visited yet,
            // it means we've found the start of a new island.
            if (grid[r][c] > 0 && !visited[r][c]) {
                // Perform DFS to find the total value of this island.
                const totalValue = dfs(r, c);
                // Check if the total value of the island is divisible by k.
                if (totalValue % k === 0) {
                    // If it is, increment the count of valid islands.
                    count++;
                }
            }
        }
    }

    // Return the final count of islands with total value divisible by k.
    return count;
};
