/**
 * Problem: Count Islands With Total Value Divisible by K
 * Summary: Counts islands in a grid where the sum of cell values is divisible by k.
 * Link: https://leetcode.com/problems/count-islands-with-total-value-divisible-by-k/
 *
 * Approach:
 * We can solve this problem using Depth-First Search (DFS).
 * We iterate through each cell of the grid. If a cell contains a positive value (land)
 * and has not been visited yet, we start a DFS traversal from that cell to explore the entire island.
 * During the DFS, we sum up the values of all cells belonging to the current island and mark them as visited.
 * After exploring an island, we check if its total value is divisible by k. If it is, we increment a counter.
 * We use a boolean `visited` matrix to keep track of visited cells to avoid re-processing the same island.
 *
 * Time Complexity: O(m * n)
 * We visit each cell in the grid at most once. For each cell, the DFS operation takes constant time on average
 * (since each cell is processed as part of at most one island).
 *
 * Space Complexity: O(m * n)
 * The space complexity is dominated by the `visited` matrix, which has dimensions m x n.
 * In the worst case, the recursion depth of DFS can also be O(m * n) if the grid forms a single large island.
 */
class Solution {

    // Directions for 4-directional connectivity (up, down, left, right)
    private static final int[][] DIRECTIONS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    private int m;
    private int n;
    private int k;
    private int[][] grid;
    private boolean[][] visited;
    private int currentIslandSum;

    /**
     * Counts the number of islands with a total value divisible by k.
     *
     * @param grid The m x n matrix representing the land and water.
     * @param k    The divisor.
     * @return The number of islands whose total value is divisible by k.
     */
    public int countIslands(int[][] grid, int k) {
        this.grid = grid;
        this.m = grid.length;
        this.n = grid[0].length;
        this.k = k;
        this.visited = new boolean[m][n];
        int islandCountDivisibleByK = 0;

        // Iterate through each cell of the grid
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                // If the cell is land (positive value) and has not been visited yet,
                // it's the start of a new potential island.
                if (grid[r][c] > 0 && !visited[r][c]) {
                    currentIslandSum = 0; // Reset sum for the new island
                    dfs(r, c); // Explore the island using DFS

                    // After exploring the entire island, check if its total sum is divisible by k
                    if (currentIslandSum % k == 0) {
                        islandCountDivisibleByK++;
                    }
                }
            }
        }
        return islandCountDivisibleByK;
    }

    /**
     * Performs Depth-First Search to explore an island and calculate its total value.
     *
     * @param r The current row index.
     * @param c The current column index.
     */
    private void dfs(int r, int c) {
        // Base cases for DFS:
        // 1. Out of bounds
        // 2. Cell is water (value 0)
        // 3. Cell has already been visited
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] == 0 || visited[r][c]) {
            return;
        }

        // Mark the current cell as visited
        visited[r][c] = true;
        // Add the value of the current cell to the island's total sum
        currentIslandSum += grid[r][c];

        // Explore all 4-directionally connected neighbors
        for (int[] dir : DIRECTIONS) {
            int newRow = r + dir[0];
            int newCol = c + dir[1];
            dfs(newRow, newCol); // Recursive call for the neighbor
        }
    }

    // Main method for testing (optional, for demonstration)
    public static void main(String[] args) {
        Solution sol = new Solution();

        // Example 1
        int[][] grid1 = {{0, 2, 1, 0, 0}, {0, 5, 0, 0, 5}, {0, 0, 1, 0, 0}, {0, 1, 4, 7, 0}, {0, 2, 0, 0, 8}};
        int k1 = 5;
        System.out.println("Example 1 Output: " + sol.countIslands(grid1, k1)); // Expected: 2

        // Example 2
        int[][] grid2 = {{3, 0, 3, 0}, {0, 3, 0, 3}, {3, 0, 3, 0}};
        int k2 = 3;
        System.out.println("Example 2 Output: " + sol.countIslands(grid2, k2)); // Expected: 6

        // Additional test case
        int[][] grid3 = {{1, 1, 0, 1}, {1, 0, 0, 1}, {0, 0, 1, 0}};
        int k3 = 2;
        System.out.println("Additional Test Case Output: " + sol.countIslands(grid3, k3)); // Expected: 1 (island with values 1+1+1+1 = 4, divisible by 2)
    }
}
