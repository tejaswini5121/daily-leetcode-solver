```cpp
// Problem: Maximal Rectangle
// Summary: Find the largest rectangle of 1s in a binary matrix.
// Link: https://leetcode.com/problems/maximal-rectangle/
//
// Approach:
// This problem can be solved by reducing it to the "Largest Rectangle in Histogram" problem.
// We can iterate through each row of the matrix. For each row, we construct a histogram where
// the height of each bar represents the number of consecutive 1s above it (including the current cell).
//
// For a given row `i`, we can calculate the heights of the histogram bars as follows:
// If `matrix[i][j]` is '1', then `height[j]` = `height[j]` (from the previous row) + 1.
// If `matrix[i][j]` is '0', then `height[j]` = 0 (as the consecutive sequence of 1s is broken).
//
// After constructing the histogram for the current row, we use the "Largest Rectangle in Histogram"
// algorithm to find the largest rectangle within that histogram. The maximum area found across
// all rows will be the answer.
//
// The "Largest Rectangle in Histogram" algorithm typically uses a monotonic increasing stack.
// For each bar, we want to find the nearest smaller bar to its left and right. The width of the
// rectangle with the current bar as the minimum height will be `right_boundary - left_boundary - 1`.
//
// Time Complexity: O(rows * cols)
//   - We iterate through each row (rows).
//   - For each row, we build a histogram (cols).
//   - Then, we process the histogram using a stack, which takes O(cols) time.
//   - Therefore, the total time complexity is O(rows * (cols + cols)) = O(rows * cols).
//
// Space Complexity: O(cols)
//   - We use an array `heights` of size `cols` to store the histogram heights.
//   - The stack used in the "Largest Rectangle in Histogram" algorithm also takes O(cols) space
//     in the worst case.
//   - Thus, the space complexity is O(cols).

#include <vector>
#include <stack>
#include <algorithm>

class Solution {
public:
    // Helper function to calculate the largest rectangle area in a histogram
    int largestRectangleArea(const std::vector<int>& heights) {
        std::stack<int> s; // Stores indices of bars in increasing order of height
        int maxArea = 0;
        int n = heights.size();

        for (int i = 0; i <= n; ++i) {
            // The `i == n` condition handles the remaining elements in the stack after iterating through all bars.
            // We push a 0 height to ensure all elements are popped.
            int currentHeight = (i == n) ? 0 : heights[i];

            // While the stack is not empty and the current bar is shorter than the bar at the top of the stack
            while (!s.empty() && currentHeight < heights[s.top()]) {
                int h = heights[s.top()]; // Height of the bar being popped
                s.pop();

                // Calculate the width of the rectangle.
                // If stack is empty, it means the popped bar is the smallest till the beginning.
                // Otherwise, the width is from the current index `i` to the index of the next smaller bar on the left (s.top()).
                int w = s.empty() ? i : i - s.top() - 1;
                maxArea = std::max(maxArea, h * w);
            }
            // Push the current bar's index onto the stack
            s.push(i);
        }
        return maxArea;
    }

    int maximalRectangle(std::vector<std::vector<char>>& matrix) {
        if (matrix.empty() || matrix[0].empty()) {
            return 0;
        }

        int rows = matrix.size();
        int cols = matrix[0].size();
        // `heights` vector will store the height of consecutive 1s ending at the current row for each column.
        std::vector<int> heights(cols, 0);
        int maxRectangleArea = 0;

        // Iterate through each row of the matrix
        for (int i = 0; i < rows; ++i) {
            // Update the heights for the current row
            for (int j = 0; j < cols; ++j) {
                if (matrix[i][j] == '1') {
                    // If the current cell is '1', increment the height from the previous row.
                    heights[j]++;
                } else {
                    // If the current cell is '0', reset the height to 0, breaking the consecutive sequence.
                    heights[j] = 0;
                }
            }
            // Calculate the largest rectangle area for the histogram formed by the current row's heights.
            // Update the overall maximum area found so far.
            maxRectangleArea = std::max(maxRectangleArea, largestRectangleArea(heights));
        }

        return maxRectangleArea;
    }
};
```