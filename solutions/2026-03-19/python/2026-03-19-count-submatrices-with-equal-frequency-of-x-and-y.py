```python
# Problem: Count Submatrices With Equal Frequency of X and Y
# Link: https://leetcode.com/problems/count-submatrices-with-equal-frequency-of-x-and-y/
#
# Approach:
# The problem asks us to count submatrices that satisfy three conditions:
# 1. They include the top-left element grid[0][0].
# 2. They have an equal frequency of 'X' and 'Y'.
# 3. They contain at least one 'X'.
#
# To efficiently count the occurrences of 'X' and 'Y' within submatrices,
# we can use a 2D prefix sum (or integral image) approach. We will create
# two prefix sum matrices, one for the count of 'X' and one for the count of 'Y'.
#
# Let `prefix_x[i][j]` store the total count of 'X's in the rectangle
# from (0, 0) to (i-1, j-1) in the original grid.
# Similarly, `prefix_y[i][j]` will store the total count of 'Y's.
#
# The formula for calculating prefix sums is:
# `prefix_sum[i][j] = grid[i-1][j-1] + prefix_sum[i-1][j] + prefix_sum[i][j-1] - prefix_sum[i-1][j-1]`
# where `grid[i-1][j-1]` is 1 if the character is the one we are counting, and 0 otherwise.
#
# Once we have the prefix sum matrices, we can calculate the count of 'X's and 'Y's
# in any submatrix defined by its top-left corner (r1, c1) and bottom-right corner (r2, c2)
# using the formula:
# `count_in_submatrix = prefix_sum[r2+1][c2+1] - prefix_sum[r1][c2+1] - prefix_sum[r2+1][c1] + prefix_sum[r1][c1]`
#
# Since all valid submatrices must include `grid[0][0]`, their top-left corner (r1, c1)
# will always be (0, 0). Thus, for a submatrix ending at (r2, c2), the counts of 'X' and 'Y'
# are simply `prefix_x[r2+1][c2+1]` and `prefix_y[r2+1][c2+1]` respectively.
#
# We iterate through all possible bottom-right corners (r2, c2) of submatrices.
# For each submatrix ending at (r2, c2) (which starts at (0, 0)), we check the conditions:
# 1. `prefix_x[r2+1][c2+1] == prefix_y[r2+1][c2+1]` (equal frequency)
# 2. `prefix_x[r2+1][c2+1] > 0` (at least one 'X')
# If both conditions are met, we increment our total count.
#
# The prefix sum matrices will have dimensions (m+1) x (n+1) where m and n are
# the dimensions of the grid, to handle boundary cases easily.
#
# Time Complexity:
# - Building the prefix sum matrices: O(m * n), where m is the number of rows and n is the number of columns.
# - Iterating through all possible submatrices (defined by their bottom-right corner): O(m * n).
# - For each submatrix, checking the conditions is O(1).
# Total time complexity: O(m * n).
#
# Space Complexity:
# - We use two prefix sum matrices of size (m+1) x (n+1).
# Total space complexity: O(m * n).

class Solution:
    def count_submatrices_with_equal_frequency(self, grid: list[list[str]]) -> int:
        rows = len(grid)
        cols = len(grid[0])

        # Initialize prefix sum matrices for 'X' and 'Y' counts.
        # Dimensions are (rows+1) x (cols+1) for easier boundary handling.
        prefix_x = [[0] * (cols + 1) for _ in range(rows + 1)]
        prefix_y = [[0] * (cols + 1) for _ in range(rows + 1)]

        # Build the prefix sum matrices
        for r in range(rows):
            for c in range(cols):
                # Value for 'X' count: 1 if grid[r][c] is 'X', else 0
                val_x = 1 if grid[r][c] == 'X' else 0
                # Value for 'Y' count: 1 if grid[r][c] is 'Y', else 0
                val_y = 1 if grid[r][c] == 'Y' else 0

                # Calculate prefix sums using the inclusion-exclusion principle
                # prefix_sum[i][j] = current_value + sum_from_above + sum_from_left - sum_from_top_left
                prefix_x[r + 1][c + 1] = val_x + prefix_x[r][c + 1] + prefix_x[r + 1][c] - prefix_x[r][c]
                prefix_y[r + 1][c + 1] = val_y + prefix_y[r][c + 1] + prefix_y[r + 1][c] - prefix_y[r][c]

        # Counter for valid submatrices
        count = 0

        # Iterate through all possible bottom-right corners (r, c) of submatrices.
        # Since all submatrices must include grid[0][0], their top-left corner is fixed at (0,0).
        # Thus, a submatrix ending at (r, c) is uniquely defined by its bottom-right corner.
        for r in range(rows):
            for c in range(cols):
                # Get the count of 'X's and 'Y's in the submatrix from (0,0) to (r,c).
                # This is directly available from the prefix sum matrices at index [r+1][c+1].
                num_x = prefix_x[r + 1][c + 1]
                num_y = prefix_y[r + 1][c + 1]

                # Check the conditions:
                # 1. Equal frequency of 'X' and 'Y'
                # 2. At least one 'X'
                if num_x == num_y and num_x > 0:
                    count += 1

        return count

```