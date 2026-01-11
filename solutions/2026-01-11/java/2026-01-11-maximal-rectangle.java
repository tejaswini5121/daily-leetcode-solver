/**
 * Problem: Maximal Rectangle
 * Link: https://leetcode.com/problems/maximal-rectangle/
 *
 * Summary: Finds the largest rectangular area consisting entirely of '1's in a binary matrix.
 *
 * Approach:
 * The problem can be reduced to finding the largest rectangle in a histogram.
 * For each row, we can compute a histogram where the height of each bar represents the number of consecutive '1's upwards from that cell to the current row.
 * Then, for each such histogram, we find the largest rectangular area within it.
 * The overall maximum area across all rows will be the answer.
 *
 * To compute the histogram for a row 'i':
 * For each column 'j', if matrix[i][j] is '1', the height of the bar at column 'j' is `heights[j] + 1`.
 * If matrix[i][j] is '0', the height of the bar at column 'j' is 0.
 *
 * The problem of finding the largest rectangle in a histogram can be solved efficiently using a monotonic stack.
 * The stack stores indices of bars in increasing order of height. When we encounter a bar shorter than the top of the stack, it means the bar at the top of the stack can no longer extend to the right. We pop elements from the stack, calculate the area they can form, and update the maximum area.
 *
 * Time Complexity:
 * O(rows * cols)
 * We iterate through each cell of the matrix once to build the histograms.
 * For each row, finding the largest rectangle in the histogram takes O(cols) time using the monotonic stack.
 * So, the total time complexity is O(rows * (cols + cols)) which simplifies to O(rows * cols).
 *
 * Space Complexity:
 * O(cols)
 * We use an array `heights` of size `cols` to store the histogram heights for the current row.
 * The monotonic stack also stores at most `cols` indices.
 * Therefore, the space complexity is O(cols).
 */
class Solution {
    /**
     * Calculates the largest rectangular area in a histogram.
     * Uses a monotonic stack to find the largest rectangle for each bar.
     *
     * @param heights The array representing the heights of the histogram bars.
     * @return The area of the largest rectangle in the histogram.
     */
    private int largestRectangleArea(int[] heights) {
        int n = heights.length;
        // Stack to store indices of bars in increasing order of height.
        // The stack will store indices.
        java.util.Stack<Integer> stack = new java.util.Stack<>();
        int maxArea = 0;

        // Iterate through each bar of the histogram, including an imaginary bar of height 0 at the end
        // to ensure all bars in the stack are processed.
        for (int i = 0; i <= n; i++) {
            // Current height, 0 for the imaginary bar at the end.
            int currentHeight = (i == n) ? 0 : heights[i];

            // While the stack is not empty AND the current bar's height is less than the height
            // of the bar at the top of the stack:
            // This means the bar at the top of the stack can no longer extend to the right.
            // We pop it and calculate the area it can form.
            while (!stack.isEmpty() && currentHeight < heights[stack.peek()]) {
                // Pop the index of the bar that is taller than the current bar.
                int topIndex = stack.pop();
                // The height of the rectangle is the height of the popped bar.
                int height = heights[topIndex];
                // The width of the rectangle is determined by the distance between the current index `i`
                // and the index of the bar just before the popped bar in the stack (or -1 if stack is empty).
                // If the stack is empty, it means the popped bar was the shortest so far, and it extends
                // all the way to the beginning (index -1).
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                // Calculate the area and update maxArea if it's larger.
                maxArea = Math.max(maxArea, height * width);
            }
            // Push the current index onto the stack.
            stack.push(i);
        }
        return maxArea;
    }

    /**
     * Finds the largest rectangle containing only 1's in a binary matrix.
     *
     * @param matrix The input binary matrix.
     * @return The area of the largest rectangle.
     */
    public int maximalRectangle(char[][] matrix) {
        // If the matrix is empty or has no columns, return 0.
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return 0;
        }

        int rows = matrix.length;
        int cols = matrix[0].length;
        // `heights` array stores the height of consecutive '1's upwards for each column.
        // For example, if `matrix[i][j]` is '1', and `matrix[i-1][j]` is '1',
        // then `heights[j]` for row `i` will be `heights[j]` for row `i-1` + 1.
        // If `matrix[i][j]` is '0', `heights[j]` is reset to 0.
        int[] heights = new int[cols];
        int maxArea = 0;

        // Iterate through each row of the matrix.
        for (int i = 0; i < rows; i++) {
            // Update the `heights` array for the current row.
            for (int j = 0; j < cols; j++) {
                // If the current cell is '1', increment the height for this column.
                // Otherwise, reset the height to 0.
                if (matrix[i][j] == '1') {
                    heights[j]++;
                } else {
                    heights[j] = 0;
                }
            }
            // After updating heights for the current row, treat it as a histogram
            // and find the largest rectangle within this histogram.
            // The result of `largestRectangleArea` is the maximum area found for this row's histogram.
            // We update `maxArea` with the overall maximum found so far.
            maxArea = Math.max(maxArea, largestRectangleArea(heights));
        }

        return maxArea;
    }
}
