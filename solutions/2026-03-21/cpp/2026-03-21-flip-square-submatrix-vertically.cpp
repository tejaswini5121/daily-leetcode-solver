// Problem: Flip Square Submatrix Vertically
// Link: https://leetcode.com/problems/flip-square-submatrix-vertically/
// Approach:
// The problem asks us to flip a square submatrix vertically. This means we need to reverse the order of rows within that specific square.
// We are given the top-left corner (x, y) and the size (k) of the square submatrix.
// The square submatrix spans from row x to x + k - 1 and from column y to y + k - 1.
// To flip it vertically, we can use a two-pointer approach for each column within the square.
// For a fixed column `j` (where `j` ranges from `y` to `y + k - 1`), we will have two pointers, `top_row` starting at `x` and `bottom_row` starting at `x + k - 1`.
// We then swap `grid[top_row][j]` with `grid[bottom_row][j]` and move `top_row` down and `bottom_row` up until `top_row` is no longer less than `bottom_row`.
// We repeat this for all columns within the submatrix.
// Time Complexity: O(k*k), where k is the side length of the square. We iterate through each column of the kxk submatrix, and for each column, we perform up to k/2 swaps.
// Space Complexity: O(1), as we are performing the flips in-place and not using any additional data structures that grow with input size.
#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<std::vector<int>> flipSquareSubmatrixVertically(std::vector<std::vector<int>>& grid, int x, int y, int k) {
        // Iterate through each column within the square submatrix.
        // The columns range from 'y' to 'y + k - 1'.
        for (int j = y; j < y + k; ++j) {
            // Initialize two pointers for vertical flipping within the current column.
            // 'top_row' starts at the top row of the submatrix (x).
            // 'bottom_row' starts at the bottom row of the submatrix (x + k - 1).
            int top_row = x;
            int bottom_row = x + k - 1;

            // Swap rows from the top and bottom until the pointers meet or cross.
            // This effectively reverses the order of rows for the current column within the submatrix.
            while (top_row < bottom_row) {
                // Swap the elements at the current top and bottom row indices for column 'j'.
                std::swap(grid[top_row][j], grid[bottom_row][j]);
                // Move the top pointer down to the next row.
                top_row++;
                // Move the bottom pointer up to the previous row.
                bottom_row--;
            }
        }
        // Return the modified grid.
        return grid;
    }
};
// Helper function to print the grid (for testing purposes, not part of the LeetCode solution).
void printGrid(const std::vector<std::vector<int>>& grid) {
    for (const auto& row : grid) {
        for (int cell : row) {
            // std::cout << cell << " "; // Uncomment for debugging output
        }
        // std::cout << std::endl; // Uncomment for debugging output
    }
}

// Main function for testing (not part of the LeetCode solution).
int main() {
    // Example 1
    std::vector<std::vector<int>> grid1 = {{1,2,3,4},{5,6,7,8},{9,10,11,12},{13,14,15,16}};
    int x1 = 1, y1 = 0, k1 = 3;
    Solution sol;
    std::vector<std::vector<int>> result1 = sol.flipSquareSubmatrixVertically(grid1, x1, y1, k1);
    // printGrid(result1); // Uncomment for debugging output

    // Example 2
    std::vector<std::vector<int>> grid2 = {{3,4,2,3},{2,3,4,2}};
    int x2 = 0, y2 = 2, k2 = 2;
    std::vector<std::vector<int>> result2 = sol.flipSquareSubmatrixVertically(grid2, x2, y2, k2);
    // printGrid(result2); // Uncomment for debugging output

    return 0;
}
