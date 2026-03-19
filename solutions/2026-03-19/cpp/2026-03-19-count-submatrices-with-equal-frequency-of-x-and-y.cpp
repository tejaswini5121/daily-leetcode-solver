```cpp
/*
Problem Summary:
Counts submatrices in a 2D grid that start at (0,0), have an equal number of 'X' and 'Y' characters, and contain at least one 'X'.

Link: https://leetcode.com/problems/count-submatrices-with-equal-frequency-of-x-and-y/

Approach:
The problem asks us to count submatrices that satisfy three conditions:
1. They must include the top-left element grid[0][0]. This means any valid submatrix will be defined by its bottom-right corner (r, c).
2. They must have an equal frequency of 'X' and 'Y'.
3. They must contain at least one 'X'.

We can iterate through all possible bottom-right corners (r, c) of a submatrix. For each bottom-right corner, we need to efficiently calculate the number of 'X's and 'Y's within the submatrix defined by (0,0) and (r,c). This can be done using a 2D prefix sum array.

Let's define two 2D prefix sum arrays:
- `prefixX[i][j]` will store the count of 'X's in the rectangle from (0,0) to (i-1, j-1).
- `prefixY[i][j]` will store the count of 'Y's in the rectangle from (0,0) to (i-1, j-1).

The recurrence for building these prefix sum arrays is:
`prefixX[i][j] = grid[i-1][j-1] == 'X' ? 1 : 0 + prefixX[i-1][j] + prefixX[i][j-1] - prefixX[i-1][j-1]`
`prefixY[i][j] = grid[i-1][j-1] == 'Y' ? 1 : 0 + prefixY[i-1][j] + prefixY[i][j-1] - prefixY[i-1][j-1]`

The base cases are when i or j is 0, where the prefix sum is 0. We will use a 1-indexed prefix sum array for easier calculation, so the dimensions will be (rows+1) x (cols+1).

After building the prefix sum arrays, we iterate through each cell (r, c) in the original grid (from 0 to rows-1 and 0 to cols-1). For each cell (r, c), the submatrix defined by (0,0) to (r,c) has:
- Number of 'X's = `prefixX[r+1][c+1]`
- Number of 'Y's = `prefixY[r+1][c+1]`

We then check if:
1. `prefixX[r+1][c+1] > 0` (at least one 'X')
2. `prefixX[r+1][c+1] == prefixY[r+1][c+1]` (equal frequency of 'X' and 'Y')

If both conditions are met, we increment our count of valid submatrices.

Time Complexity:
- Building the prefix sum arrays: O(rows * cols)
- Iterating through all possible bottom-right corners: O(rows * cols)
- Total time complexity: O(rows * cols)

Space Complexity:
- For the two prefix sum arrays: O(rows * cols)
- Total space complexity: O(rows * cols)
*/

#include <vector>
#include <string>

class Solution {
public:
    int countSubmatrices(std::vector<std::vector<char>>& grid) {
        // Get the dimensions of the grid.
        int rows = grid.size();
        int cols = grid[0].size();

        // Initialize prefix sum arrays for 'X' and 'Y'.
        // We use 1-based indexing for easier prefix sum calculations.
        // prefixX[i][j] will store the count of 'X's in the subgrid from (0,0) to (i-1, j-1).
        // prefixY[i][j] will store the count of 'Y's in the subgrid from (0,0) to (i-1, j-1).
        std::vector<std::vector<int>> prefixX(rows + 1, std::vector<int>(cols + 1, 0));
        std::vector<std::vector<int>> prefixY(rows + 1, std::vector<int>(cols + 1, 0));

        // Populate the prefix sum arrays.
        for (int i = 1; i <= rows; ++i) {
            for (int j = 1; j <= cols; ++j) {
                // If the current cell contains 'X', add 1 to the count.
                prefixX[i][j] = prefixX[i - 1][j] + prefixX[i][j - 1] - prefixX[i - 1][j - 1];
                if (grid[i - 1][j - 1] == 'X') {
                    prefixX[i][j]++;
                }

                // If the current cell contains 'Y', add 1 to the count.
                prefixY[i][j] = prefixY[i - 1][j] + prefixY[i][j - 1] - prefixY[i - 1][j - 1];
                if (grid[i - 1][j - 1] == 'Y') {
                    prefixY[i][j]++;
                }
            }
        }

        // Initialize the count of valid submatrices.
        int count = 0;

        // Iterate through all possible bottom-right corners (r, c) of a submatrix.
        // Since all submatrices must include grid[0][0], they are defined by their bottom-right corner.
        for (int r = 0; r < rows; ++r) {
            for (int c = 0; c < cols; ++c) {
                // The number of 'X's and 'Y's in the submatrix defined by (0,0) and (r,c)
                // can be directly obtained from the prefix sum arrays.
                // We use (r+1, c+1) because our prefix sum arrays are 1-indexed.
                int countX = prefixX[r + 1][c + 1];
                int countY = prefixY[r + 1][c + 1];

                // Check the conditions:
                // 1. At least one 'X' must be present.
                // 2. The frequency of 'X' must be equal to the frequency of 'Y'.
                if (countX > 0 && countX == countY) {
                    count++; // If both conditions are met, increment the counter.
                }
            }
        }

        // Return the total count of valid submatrices.
        return count;
    }
};
```