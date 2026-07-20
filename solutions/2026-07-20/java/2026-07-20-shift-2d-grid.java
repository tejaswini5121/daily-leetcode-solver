// Problem: Shift 2D Grid
// Link: https://leetcode.com/problems/shift-2d-grid/
//
// Approach:
// The problem describes a cyclic shift of elements in a 2D grid.
// We can model the 2D grid as a 1D array by flattening it.
// An element at grid[i][j] can be represented by a single index: i * n + j.
// Similarly, the original position of an element that ends up at index `idx` after k shifts can be found.
// The total number of elements in the grid is m * n.
// A shift operation moves each element one position to the right, with the last element wrapping around to the first.
// This is equivalent to shifting the flattened 1D array.
// After k shifts, an element originally at index `idx` will move to `(idx + k) % (m * n)`.
// To find the new 2D coordinates (new_row, new_col) for an element that ends up at a flattened index `new_idx`,
// we can use: new_row = new_idx / n and new_col = new_idx % n.
//
// We can iterate through the original grid, calculate the new flattened index for each element,
// and then determine its new 2D coordinates.
//
// To optimize for large k, we can take k modulo the total number of elements (m * n) because
// shifting m * n times returns the grid to its original state.
//
// Time Complexity: O(m * n), where m is the number of rows and n is the number of columns.
// We iterate through each element of the grid once to calculate its new position.
// Space Complexity: O(m * n) in the worst case if we create a new grid to store the result.
// If we modify the grid in place (which is slightly more complex due to overwriting),
// it could be O(1) extra space if the return type allows it, but LeetCode usually expects a new grid.
// We will create a new grid for clarity.
//
class Solution {
    public List<List<Integer>> shiftGrid(int[][] grid, int k) {
        int m = grid.length;
        int n = grid[0].length;
        int totalElements = m * n;

        // Reduce k to avoid unnecessary full cycles of shifts
        // Shifting by totalElements results in the original grid.
        k = k % totalElements;

        // Create a new grid to store the shifted result.
        List<List<Integer>> shiftedGrid = new ArrayList<>();
        for (int i = 0; i < m; i++) {
            List<Integer> row = new ArrayList<>();
            for (int j = 0; j < n; j++) {
                row.add(0); // Initialize with dummy values
            }
            shiftedGrid.add(row);
        }

        // Iterate through each element of the original grid
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                // Calculate the current element's position in a 1D flattened array
                int originalFlatIndex = r * n + c;

                // Calculate the new position in the 1D flattened array after k shifts
                // The formula is (original_index + k) % total_elements
                int newFlatIndex = (originalFlatIndex + k) % totalElements;

                // Convert the new flattened index back to 2D grid coordinates
                int newRow = newFlatIndex / n;
                int newCol = newFlatIndex % n;

                // Place the element from the original grid into its new position in the shifted grid
                shiftedGrid.get(newRow).set(newCol, grid[r][c]);
            }
        }

        return shiftedGrid;
    }
}