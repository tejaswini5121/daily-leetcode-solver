```python
# Problem: Special Positions in a Binary Matrix
# Summary: Count cells with '1' that are the only '1' in their respective row and column.
# Link: https://leetcode.com/problems/special-positions-in-a-binary-matrix/
#
# Approach:
# We need to iterate through the matrix and for each cell containing '1', check if it's the
# only '1' in its row and column. To efficiently do this, we can pre-calculate the sum of
# elements in each row and each column.
#
# We can use two arrays, `row_sums` and `col_sums`, of size m and n respectively, initialized
# to zeros. We iterate through the matrix once. For each element `mat[i][j]`:
# If `mat[i][j] == 1`, we increment `row_sums[i]` and `col_sums[j]`.
#
# After computing all row and column sums, we iterate through the matrix again.
# For each cell `mat[i][j]`:
# If `mat[i][j] == 1` AND `row_sums[i] == 1` AND `col_sums[j] == 1`, then this is a special position.
# We increment a counter for special positions.
#
# Time Complexity:
# O(m * n) - We iterate through the matrix twice, each taking O(m * n) time.
#
# Space Complexity:
# O(m + n) - For storing `row_sums` (size m) and `col_sums` (size n).

class Solution:
    def numSpecial(self, mat: list[list[int]]) -> int:
        # Get the dimensions of the matrix
        m = len(mat)
        n = len(mat[0])

        # Initialize arrays to store the sum of elements in each row and column
        # row_sums[i] will store the sum of elements in the i-th row
        # col_sums[j] will store the sum of elements in the j-th column
        row_sums = [0] * m
        col_sums = [0] * n

        # First pass: Calculate row and column sums
        for r in range(m):
            for c in range(n):
                if mat[r][c] == 1:
                    row_sums[r] += 1
                    col_sums[c] += 1

        # Initialize a counter for special positions
        special_positions_count = 0

        # Second pass: Count special positions
        for r in range(m):
            for c in range(n):
                # A position (r, c) is special if:
                # 1. The element at mat[r][c] is 1.
                # 2. The sum of elements in row r is 1 (meaning mat[r][c] is the only 1 in its row).
                # 3. The sum of elements in column c is 1 (meaning mat[r][c] is the only 1 in its column).
                if mat[r][c] == 1 and row_sums[r] == 1 and col_sums[c] == 1:
                    special_positions_count += 1

        # Return the total count of special positions
        return special_positions_count

```