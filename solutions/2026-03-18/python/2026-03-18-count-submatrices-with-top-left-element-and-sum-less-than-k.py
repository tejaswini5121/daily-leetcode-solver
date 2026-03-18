```python
# Problem Summary: Count submatrices starting from the top-left of a given grid
#                  whose sum is less than or equal to a given integer k.
# Link: https://leetcode.com/problems/count-submatrices-with-top-left-element-and-sum-less-than-k/
#
# Approach:
# The problem requires us to count submatrices that start at grid[0][0] and end at grid[r][c]
# for all possible r and c, such that the sum of elements within these submatrices is <= k.
#
# A naive approach would be to iterate through all possible bottom-right corners (r, c)
# and for each, calculate the sum of the submatrix from (0,0) to (r,c). This would involve
# nested loops to calculate the sum, leading to O(m*n*m*n) complexity.
#
# To optimize sum calculation, we can use a 2D prefix sum array (also known as a summed-area table).
# Let prefix_sum[i][j] be the sum of all elements in the rectangle from (0,0) to (i-1, j-1).
# The sum of a submatrix with top-left (r1, c1) and bottom-right (r2, c2) can be calculated
# efficiently using the prefix sum array:
# sum(r1, c1, r2, c2) = prefix_sum[r2+1][c2+1] - prefix_sum[r1][c2+1] - prefix_sum[r2+1][c1] + prefix_sum[r1][c1].
#
# In this problem, all submatrices start at (0,0). So, for a submatrix ending at (r,c),
# its sum is simply prefix_sum[r+1][c+1].
#
# The algorithm will be:
# 1. Create a 2D prefix sum array `prefix_sum` of size (m+1) x (n+1), initialized with zeros.
# 2. Populate `prefix_sum`. For each cell `grid[i][j]`, `prefix_sum[i+1][j+1]` will be:
#    `grid[i][j] + prefix_sum[i][j+1] + prefix_sum[i+1][j] - prefix_sum[i][j]`.
# 3. Initialize a counter `count` to 0.
# 4. Iterate through each possible bottom-right corner (r, c) of a submatrix, where `r` goes from 0 to `m-1`
#    and `c` goes from 0 to `n-1`.
# 5. For each (r, c), the sum of the submatrix from (0,0) to (r,c) is `prefix_sum[r+1][c+1]`.
# 6. If `prefix_sum[r+1][c+1] <= k`, increment `count`.
# 7. Return `count`.
#
# Time Complexity:
# - Building the prefix sum array takes O(m*n) time.
# - Iterating through all possible bottom-right corners (r, c) takes O(m*n) time.
# - For each corner, checking the sum is O(1).
# - Therefore, the total time complexity is O(m*n).
#
# Space Complexity:
# - We use an additional 2D array `prefix_sum` of size (m+1) x (n+1).
# - Thus, the space complexity is O(m*n).
#
class Solution:
    def countSubmatrices(self, grid: list[list[int]], k: int) -> int:
        m = len(grid)
        n = len(grid[0])

        # Initialize a 2D prefix sum array.
        # prefix_sum[i][j] will store the sum of elements in the rectangle from (0,0) to (i-1, j-1).
        # We use (m+1)x(n+1) to simplify boundary conditions.
        prefix_sum = [[0] * (n + 1) for _ in range(m + 1)]

        # Populate the prefix sum array.
        for r in range(m):
            for c in range(n):
                # The sum of the rectangle ending at (r, c) is:
                # current element + sum of rectangle above + sum of rectangle to the left - sum of overlapping rectangle
                prefix_sum[r + 1][c + 1] = grid[r][c] + prefix_sum[r][c + 1] + prefix_sum[r + 1][c] - prefix_sum[r][c]

        count = 0  # Initialize counter for submatrices with sum <= k

        # Iterate through all possible bottom-right corners (r, c) of a submatrix starting from (0,0).
        for r in range(m):
            for c in range(n):
                # The sum of the submatrix from (0,0) to (r,c) is given by prefix_sum[r+1][c+1].
                submatrix_sum = prefix_sum[r + 1][c + 1]

                # If the sum is less than or equal to k, increment the counter.
                if submatrix_sum <= k:
                    count += 1

        return count

```