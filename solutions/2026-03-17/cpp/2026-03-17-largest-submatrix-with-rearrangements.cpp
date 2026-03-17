```cpp
// Summary: Find the largest rectangular submatrix of 1s in a binary matrix by rearranging columns.
// Link: https://leetcode.com/problems/largest-submatrix-with-rearrangements/
// Approach:
// For each row, we can calculate the consecutive number of 1s upwards from that cell.
// If a cell matrix[i][j] is 1, the number of consecutive 1s above it (including itself) is `height[i][j] = height[i-1][j] + 1`. If matrix[i][j] is 0, then `height[i][j] = 0`.
// After computing these heights for a given row `i`, we want to find the largest rectangle that can be formed using these heights.
// To do this, we sort the heights for the current row in descending order.
// Then, for each height `h` at index `k` (meaning there are `k+1` columns to its left and including itself that have a height of at least `h`), the potential area of a rectangle with height `h` is `h * (k + 1)`.
// We iterate through all sorted heights and keep track of the maximum area found.
// The overall maximum area across all rows will be our answer.
// Time Complexity: O(m * n * log n) where m is the number of rows and n is the number of columns.
//   - Calculating heights for each row takes O(m * n).
//   - For each row, sorting the heights takes O(n * log n).
//   - Iterating through sorted heights takes O(n).
//   - Total: O(m * n + m * n * log n + m * n) = O(m * n * log n).
// Space Complexity: O(m * n) to store the heights matrix. If we optimize to O(n) space, we can do it by processing one row at a time and storing heights for the current row. The current implementation uses O(m*n) to store heights, but it can be optimized to O(n) by re-using the input matrix or a 1D array for heights. The provided code uses O(m*n) for clarity.
#include <vector>
#include <algorithm>

class Solution {
public:
    int largestSubmatrix(std::vector<std::vector<int>>& matrix) {
        int m = matrix.size();
        int n = matrix[0].size();
        int maxArea = 0;

        // Create a heights matrix to store consecutive 1s upwards.
        // heights[i][j] will store the number of consecutive 1s ending at matrix[i][j] and going upwards.
        std::vector<std::vector<int>> heights(m, std::vector<int>(n));

        // Populate the heights matrix.
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (matrix[i][j] == 1) {
                    // If the current cell is 1, the height is 1 plus the height of the cell directly above it.
                    // If it's the first row (i=0), the height is just 1.
                    heights[i][j] = (i > 0) ? heights[i - 1][j] + 1 : 1;
                } else {
                    // If the current cell is 0, the height is 0.
                    heights[i][j] = 0;
                }
            }
        }

        // Iterate through each row to find the largest submatrix ending at that row.
        for (int i = 0; i < m; ++i) {
            // Sort the heights of the current row in descending order.
            // This is crucial because to form a rectangle of height 'h', we need 'k+1' columns
            // with heights at least 'h'. By sorting, we ensure that for a given height,
            // we are considering the maximum possible width to its left.
            std::sort(heights[i].rbegin(), heights[i].rend());

            // Iterate through the sorted heights of the current row.
            for (int j = 0; j < n; ++j) {
                // For a height `h` at index `j` in the sorted `heights[i]`,
                // it means there are `j+1` columns (including the current one) to the left
                // (or at the same position) that have a height of at least `heights[i][j]`.
                // So, the potential area of a rectangle with height `heights[i][j]` is `heights[i][j] * (j + 1)`.
                int currentHeight = heights[i][j];
                int currentWidth = j + 1;
                int currentArea = currentHeight * currentWidth;

                // Update the maximum area found so far.
                maxArea = std::max(maxArea, currentArea);
            }
        }

        return maxArea;
    }
};
```