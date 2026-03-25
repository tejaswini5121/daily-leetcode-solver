```python
# Problem Summary: Check if a grid can be partitioned into two equal sum halves with one horizontal or vertical cut.
# Problem Link: https://leetcode.com/problems/equal-sum-grid-partition-i/
# Approach:
# 1. Calculate the total sum of the grid. If the total sum is odd, no partition into two equal halves is possible, so return False.
# 2. For horizontal cuts:
#    a. Iterate through each possible row to make a cut (from row 0 to row m-2).
#    b. For each cut, calculate the sum of the upper section.
#    c. If the sum of the upper section is equal to half of the total sum, then a valid horizontal partition exists, return True.
# 3. For vertical cuts:
#    a. Iterate through each possible column to make a cut (from col 0 to col n-2).
#    b. For each cut, calculate the sum of the left section.
#    c. If the sum of the left section is equal to half of the total sum, then a valid vertical partition exists, return True.
# 4. If no valid partition is found after checking all horizontal and vertical cuts, return False.
#
# Optimization using prefix sums:
# To efficiently calculate the sum of sections, we can precompute prefix sums.
# - Row sums: `row_sums[i]` will store the sum of elements in row `i`.
# - Column sums: `col_sums[j]` will store the sum of elements in column `j`.
#
# With prefix row sums, the sum of the upper section for a horizontal cut after row `r` (i.e., rows 0 to `r`) can be calculated as the sum of `row_sums[0]` to `row_sums[r]`.
# Similarly, with prefix column sums, the sum of the left section for a vertical cut after column `c` (i.e., columns 0 to `c`) can be calculated as the sum of `col_sums[0]` to `col_sums[c]`.
#
# To further optimize the prefix sum calculation, we can use a single pass to calculate the prefix sum of row sums (for horizontal cuts) and a single pass to calculate the prefix sum of column sums (for vertical cuts).
#
# Time Complexity: O(m * n) for calculating the total sum initially. Then O(m) for checking horizontal cuts and O(n) for checking vertical cuts using precomputed prefix sums. Since m*n <= 10^5, this is efficient. The dominant part is the initial sum calculation.
# Space Complexity: O(m) for storing row sums and O(n) for storing column sums. In the worst case, m and n can be up to sqrt(10^5), so space complexity is acceptable.

class Solution:
    def splitGrid(self, grid: list[list[int]]) -> bool:
        m = len(grid)
        n = len(grid[0])

        # Calculate the total sum of the grid
        total_sum = sum(sum(row) for row in grid)

        # If the total sum is odd, it's impossible to partition into two equal halves
        if total_sum % 2 != 0:
            return False

        target_sum = total_sum // 2

        # --- Check for horizontal cuts ---
        # Calculate prefix sums of rows
        row_prefix_sums = [0] * m
        current_row_sum = 0
        for r in range(m):
            current_row_sum += sum(grid[r])
            row_prefix_sums[r] = current_row_sum

        # Iterate through possible horizontal cut points (after row i)
        # A cut after row `r` means rows 0 to `r` form one partition, and rows `r+1` to `m-1` form the other.
        # The cut point `r` can range from 0 to m-2 to ensure both partitions are non-empty.
        for r in range(m - 1):
            # The sum of the top partition (rows 0 to r) is simply row_prefix_sums[r]
            if row_prefix_sums[r] == target_sum:
                return True

        # --- Check for vertical cuts ---
        # Calculate prefix sums of columns
        col_prefix_sums = [0] * n
        current_col_sum = 0
        for c in range(n):
            for r in range(m):
                current_col_sum += grid[r][c]
            col_prefix_sums[c] = current_col_sum

        # Iterate through possible vertical cut points (after column j)
        # A cut after column `c` means columns 0 to `c` form one partition, and columns `c+1` to `n-1` form the other.
        # The cut point `c` can range from 0 to n-2 to ensure both partitions are non-empty.
        for c in range(n - 1):
            # The sum of the left partition (columns 0 to c) is simply col_prefix_sums[c]
            if col_prefix_sums[c] == target_sum:
                return True

        # If no valid partition is found after checking all possibilities
        return False

```