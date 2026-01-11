```python
# Problem: Maximal Rectangle
# Link: https://leetcode.com/problems/maximal-rectangle/
#
# Approach:
# This problem can be efficiently solved by converting it into a series of "Largest Rectangle in Histogram" problems.
# For each row, we can compute a histogram where the height of each bar represents the number of consecutive '1's
# ending at that column in the current row and all rows above it.
#
# For example, if the matrix is:
# [["1","0","1","0","0"],
#  ["1","0","1","1","1"],
#  ["1","1","1","1","1"],
#  ["1","0","0","1","0"]]
#
# The heights for each row would be:
# Row 0: [1, 0, 1, 0, 0]
# Row 1: [2, 0, 2, 1, 1] (since matrix[1][0] is '1' and matrix[0][0] is '1', height is 2; etc.)
# Row 2: [3, 1, 3, 2, 2]
# Row 3: [4, 0, 0, 3, 0]
#
# For each of these height arrays (histograms), we find the largest rectangle. The maximum area found across
# all rows will be the answer.
#
# The "Largest Rectangle in Histogram" problem can be solved using a monotonic stack. The stack stores indices
# of bars in increasing order of height. When we encounter a bar shorter than the top of the stack, we pop
# elements from the stack. For each popped bar, we calculate the area it could form. The width of the rectangle
# is determined by the current index and the index of the previous element in the stack (or -1 if the stack becomes empty).
#
# Time Complexity: O(rows * cols)
# We iterate through each cell of the matrix once to compute the heights. For each row, we process the histogram
# of heights. The histogram processing using a monotonic stack takes O(cols) time. Therefore, the total time
# complexity is O(rows * cols).
#
# Space Complexity: O(cols)
# The space is primarily used to store the heights array for the current row and the stack used in the
# largest rectangle in histogram algorithm, both of which have a size proportional to the number of columns.

class Solution:
    def maximalRectangle(self, matrix: list[list[str]]) -> int:
        if not matrix or not matrix[0]:
            return 0

        rows = len(matrix)
        cols = len(matrix[0])
        # Initialize heights array. heights[j] will store the number of consecutive '1's
        # ending at column j in the current row and all rows above it.
        heights = [0] * cols
        max_area = 0

        # Iterate through each row of the matrix
        for r in range(rows):
            # Update the heights for the current row
            for c in range(cols):
                # If the current cell is '1', increment the height at this column.
                # If it's '0', reset the height to 0, as it breaks the consecutive sequence of '1's.
                heights[c] = heights[c] + 1 if matrix[r][c] == '1' else 0

            # Now, for the current row's 'heights' array, find the largest rectangle in this histogram.
            # This is a standard problem that can be solved using a monotonic stack.
            # We'll define a helper function or implement it inline.

            # Helper function to calculate the largest rectangle in a histogram
            def largestRectangleArea(h_list: list[int]) -> int:
                stack = []  # Stores indices of bars in increasing order of height
                max_hist_area = 0
                # Append a 0 height bar at the end to ensure all bars in the stack are processed.
                h_list_with_sentinel = h_list + [0]

                for i in range(len(h_list_with_sentinel)):
                    # While the stack is not empty and the current bar is shorter than the bar at the top of the stack
                    while stack and h_list_with_sentinel[i] < h_list_with_sentinel[stack[-1]]:
                        # Pop the top element (index of the bar)
                        height = h_list_with_sentinel[stack.pop()]
                        # Calculate the width: if stack is empty, width is 'i' (from start to current).
                        # Otherwise, width is 'i' - stack[-1] - 1 (between current index and previous smaller bar).
                        width = i if not stack else i - stack[-1] - 1
                        # Update the maximum area found in this histogram
                        max_hist_area = max(max_hist_area, height * width)
                    # Push the current bar's index onto the stack
                    stack.append(i)
                return max_hist_area

            # Calculate the largest rectangle area for the current row's histogram
            current_row_max_area = largestRectangleArea(heights)
            # Update the overall maximum area found so far
            max_area = max(max_area, current_row_max_area)

        return max_area

```