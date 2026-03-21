```python
# Problem: Flip Square Submatrix Vertically
# Link: https://leetcode.com/problems/flip-square-submatrix-vertically/
#
# Approach:
# The problem requires flipping a square submatrix vertically. This means reversing the order of rows within the specified submatrix.
# We are given the top-left corner coordinates (x, y) and the size k of the square submatrix.
#
# The submatrix spans from row x to x + k - 1 and from column y to y + k - 1.
# To flip it vertically, we need to swap rows. Specifically, we will swap row `i` with row `x + k - 1 - (i - x)`
# for rows `i` from `x` up to `x + k // 2 - 1`.
#
# We can use a two-pointer approach for swapping. For each row index `i` within the top half of the submatrix
# (from `x` to `x + k // 2 - 1`), we find its corresponding row index `j` in the bottom half.
# The corresponding row index `j` will be `x + k - 1 - (i - x)`.
# Then, we swap the entire row `grid[i]` with `grid[j]`.
#
# Time Complexity:
# The outer loop iterates through approximately k/2 rows. Inside the loop, we are swapping entire rows.
# Swapping two rows of length n takes O(n) time.
# Therefore, the total time complexity is O(k/2 * n), which simplifies to O(k * n).
# Since k <= min(m - x, n - y), in the worst case, k can be close to min(m, n).
# So, the time complexity can be expressed as O(min(m, n) * n) or O(m * min(m, n)) depending on which dimension is smaller.
# However, since we are only performing operations within a kxk submatrix and row swaps, the complexity is more precisely O(k * n).
#
# Space Complexity:
# We are modifying the input matrix in-place. No additional data structures are used that grow with the input size,
# except for temporary variables used during row swapping.
# Therefore, the space complexity is O(1) (excluding the input matrix itself).

class Solution:
    def flipSquareSubmatrixVertically(self, grid: list[list[int]], x: int, y: int, k: int) -> list[list[int]]:
        m = len(grid)
        n = len(grid[0])

        # Iterate through the top half of the rows in the submatrix
        # The submatrix rows range from x to x + k - 1
        # We only need to iterate up to the middle row to perform swaps
        for i in range(x, x + k // 2):
            # Calculate the corresponding row index in the bottom half of the submatrix
            # If i is the first row (x), its counterpart is the last row (x + k - 1)
            # If i is the second row (x + 1), its counterpart is the second to last row (x + k - 2)
            # The formula for the counterpart row index j is: x + (k - 1) - (i - x)
            # This simplifies to: x + k - 1 - i + x = 2*x + k - 1 - i
            # A simpler way to think about it is that the distance from x to i is i - x.
            # We want the same distance from the end of the submatrix rows (x + k - 1).
            # So, the counterpart row is (x + k - 1) - (i - x).
            corresponding_row_idx = x + k - 1 - (i - x)

            # Swap the entire row grid[i] with grid[corresponding_row_idx]
            # Python's tuple assignment provides a concise way to swap elements
            grid[i], grid[corresponding_row_idx] = grid[corresponding_row_idx], grid[i]

        # Return the modified grid
        return grid

```