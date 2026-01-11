// Problem Summary: Find the largest rectangle composed solely of '1's within a 2D binary matrix.
// Problem Link: https://leetcode.com/problems/maximal-rectangle/
// Approach:
// This problem can be broken down into a subproblem: finding the largest rectangle in a histogram.
// For each row in the matrix, we can construct a histogram where the height of each bar
// represents the number of consecutive '1's ending at that cell in the current column.
// We then apply the "Largest Rectangle in Histogram" algorithm to each of these histograms.
// The "Largest Rectangle in Histogram" algorithm uses a monotonic stack to efficiently find
// the widest rectangle for each bar as its minimum height.
//
// For each row `i`:
// 1. Calculate the `heights` array for the histogram. `heights[j]` will be the count of
//    consecutive '1's from `matrix[i][j]` upwards. If `matrix[i][j]` is '0', `heights[j]` is 0.
// 2. Use a monotonic increasing stack to find the largest rectangle in this `heights` histogram.
//    The stack stores indices of the `heights` array.
//    - When we encounter a bar smaller than the top of the stack, it means the bar at the top
//      of the stack can no longer extend to the right. We pop it, calculate the area it could
//      form (width is the difference between the current index and the index of the previous
//      element in the stack, and height is the popped bar's height), and update the maximum area.
//    - We push the current index onto the stack.
// 3. After processing all bars in a row's histogram, any remaining elements in the stack
//    represent bars that can extend to the end of the histogram. We pop them and calculate
//    their areas similarly.
// 4. The overall maximum area found across all rows is the result.
//
// Time Complexity: O(rows * cols)
// We iterate through each row (rows). For each row, we build the heights array (cols)
// and then process the histogram using the monotonic stack, which takes O(cols) time.
// Therefore, the total time complexity is O(rows * cols).
//
// Space Complexity: O(cols)
// We use an auxiliary `heights` array of size `cols` and a stack that can store up to
// `cols` elements in the worst case. Thus, the space complexity is O(cols).
var maximalRectangle = function(matrix) {
    // Handle empty matrix case
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return 0;
    }

    const rows = matrix.length;
    const cols = matrix[0].length;
    // Initialize an array to store the heights of consecutive '1's for each column.
    // This will be reused and updated for each row to represent the histogram for that row.
    const heights = new Array(cols).fill(0);
    let maxArea = 0;

    // Iterate through each row of the matrix.
    for (let i = 0; i < rows; i++) {
        // Update the heights array based on the current row.
        // If the current cell is '1', increment the height for that column.
        // If the current cell is '0', reset the height for that column to 0.
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === '1') {
                heights[j]++;
            } else {
                heights[j] = 0;
            }
        }

        // Now, treat the `heights` array as a histogram and find the largest rectangle in it.
        // We use a monotonic increasing stack to achieve this efficiently.
        // The stack will store indices of the `heights` array.
        const stack = []; // Stores indices

        // Iterate through the heights array (representing the current row's histogram).
        // We add an extra iteration at the end (when j === cols) to process any
        // remaining bars in the stack.
        for (let j = 0; j <= cols; j++) {
            // The current height we are considering. If j === cols, we use 0 to ensure
            // all remaining bars in the stack are processed.
            const currentHeight = (j === cols) ? 0 : heights[j];

            // While the stack is not empty AND the current height is less than or equal to
            // the height of the bar at the index on top of the stack, it means the bar
            // at the top of the stack cannot extend any further to the right.
            // We pop it and calculate the maximum area it can form.
            while (stack.length > 0 && currentHeight <= heights[stack[stack.length - 1]]) {
                const h = heights[stack.pop()]; // Height of the popped bar.
                // The width is determined by the difference between the current index `j`
                // and the index of the previous element in the stack. If the stack becomes empty,
                // it means the popped bar could extend all the way to the left (index -1),
                // so the width is simply `j`.
                const w = stack.length === 0 ? j : j - stack[stack.length - 1] - 1;
                maxArea = Math.max(maxArea, h * w); // Update maximum area.
            }
            // Push the current index onto the stack. The stack remains monotonic increasing.
            stack.push(j);
        }
    }

    // Return the overall maximum area found.
    return maxArea;
};
```