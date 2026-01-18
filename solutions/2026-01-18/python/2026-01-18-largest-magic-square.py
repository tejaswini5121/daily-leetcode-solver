```python
# Problem: Largest Magic Square
# Link: https://leetcode.com/problems/largest-magic-square/
#
# Approach:
# The problem asks for the largest k x k subgrid that forms a magic square.
# A brute-force approach would be to iterate through all possible top-left corners (r, c)
# and all possible sizes k, and for each k x k subgrid, check if it's a magic square.
# To efficiently check if a subgrid is a magic square, we can precompute prefix sums.
# We'll need prefix sums for rows, columns, and diagonals.
#
# Prefix sums for rows: `row_sum[r][c]` stores the sum of elements from `grid[r][0]` to `grid[r][c]`.
# Prefix sums for columns: `col_sum[r][c]` stores the sum of elements from `grid[0][c]` to `grid[r][c]`.
# Prefix sums for main diagonals (top-left to bottom-right):
#   `diag1_sum[r][c]` stores the sum of elements `grid[i][j]` where `i-j == r-c`.
#   This can be indexed by `r-c + offset` to keep indices non-negative.
# Prefix sums for anti-diagonals (top-right to bottom-left):
#   `diag2_sum[r][c]` stores the sum of elements `grid[i][j]` where `i+j == r+c`.
#   This can be indexed by `r+c`.
#
# For each k x k subgrid starting at (r, c), the sum of a row `i` within this subgrid
# (from column `c` to `c+k-1`) can be calculated as `row_sum[r+i][c+k-1] - row_sum[r+i][c-1]`.
# Similarly for columns.
# Diagonal sums require careful calculation using the precomputed prefix sums for diagonals.
#
# A more optimized approach for calculating sums within subgrids using prefix sums:
# For a k x k subgrid starting at (r, c):
# Row sum for row `i` (where `r <= i < r+k`): `row_prefix_sum[i][c+k-1] - row_prefix_sum[i][c-1]`
# Column sum for column `j` (where `c <= j < c+k`): `col_prefix_sum[r+k-1][j] - col_prefix_sum[r-1][j]`
# Main diagonal sum (from (r, c) to (r+k-1, c+k-1)): This needs a dedicated prefix sum array or direct calculation.
#   It is often easier to maintain prefix sums for diagonals relative to the grid's diagonal lines.
#   Let `diag1[i][j]` be the sum of elements on the diagonal `x-y = i-j`.
#   For a kxk square starting at (r,c), the main diagonal sum is `diag1_sum[r-c][r+k-1] - diag1_sum[r-c][r-1]` (adjusting for index mapping).
#   A simpler way to think about it for subgrids is to compute it directly or use specialized 2D prefix sums for diagonals.
#   A 2D prefix sum for diagonals can be thought of as `dp[i][j]` for `i-j` and `dp2[i][j]` for `i+j`.
#   For a kxk square at (r,c), main diagonal sum = `diag1_pref[r+k-1][c+k-1] - diag1_pref[r-1][c-1]` (where `diag1_pref[i][j]` sums elements where `x-y <= i-j`). This is complex.
#
# Let's refine the prefix sum calculation for subgrids.
# We can compute 2D prefix sums for the grid itself, `presum[i][j]` = sum of elements in `grid[0..i-1][0..j-1]`.
# Then the sum of a subgrid from `(r1, c1)` to `(r2, c2)` is `presum[r2+1][c2+1] - presum[r1][c2+1] - presum[r2+1][c1] + presum[r1][c1]`.
# This is for rectangular sums. For magic squares, we need individual row, column, and diagonal sums.
#
# Let's use separate prefix sums for rows, columns, and diagonals.
# `row_pref[i][j]` = sum of `grid[i][0...j-1]`
# `col_pref[i][j]` = sum of `grid[0...i-1][j]`
#
# For a k x k magic square starting at (r, c):
# Target sum `S`.
# For each row `i` from `r` to `r+k-1`:
#   `sum(grid[i][c...c+k-1]) == S`
#   This can be computed as `row_pref[i][c+k] - row_pref[i][c]`.
# For each column `j` from `c` to `c+k-1`:
#   `sum(grid[r...r+k-1][j]) == S`
#   This can be computed as `col_pref[r+k][j] - col_pref[r][j]`.
# Main diagonal sum (top-left to bottom-right):
#   `sum(grid[r+i][c+i] for i in range(k)) == S`
# Anti-diagonal sum (top-right to bottom-left):
#   `sum(grid[r+i][c+k-1-i] for i in range(k)) == S`
#
# We can iterate `k` from `min(m, n)` down to `1`. For each `k`, iterate through all possible top-left corners `(r, c)`.
# If we find a `k x k` magic square, that's our answer.
#
# Helper function `is_magic(r, c, k)`: checks if the `k x k` subgrid starting at `(r, c)` is a magic square.
# To optimize `is_magic`, we precompute prefix sums.
# `row_sums[i][j]`: sum of `grid[i][0...j-1]`
# `col_sums[i][j]`: sum of `grid[0...i-1][j]`
#
# The `is_magic` function will need to compute the sums of rows, columns, and diagonals of the subgrid.
# Let's define the prefix sums to be 1-indexed for easier calculation of sums of ranges.
# `row_prefix[i][j]` = sum of `grid[i][0]` to `grid[i][j-1]` (so `row_prefix[i][k]` is sum of first `k` elements)
# `col_prefix[i][j]` = sum of `grid[0][j]` to `grid[i-1][j]` (so `col_prefix[k][j]` is sum of first `k` elements)
#
# The actual subgrid is `grid[r : r+k][c : c+k]`.
# Row sum for row `i` within the subgrid (i.e., `grid[r+i]`): `row_prefix[r+i][c+k] - row_prefix[r+i][c]`
# Column sum for column `j` within the subgrid (i.e., `grid[...][c+j]`): `col_prefix[r+k][c+j] - col_prefix[r][c+j]`
#
# Main diagonal sum for subgrid: `sum(grid[r+i][c+i] for i in range(k))`
# Anti-diagonal sum for subgrid: `sum(grid[r+i][c+k-1-i] for i in range(k))`
#
# These diagonal sums are still O(k) to compute. We can precompute prefix sums for diagonals as well.
# `diag1_prefix[i][j]` stores sum of elements `grid[x][y]` such that `x-y == i-j` and `x <= i, y <= j`.
# This is tricky. A simpler approach for diagonals with prefix sums:
#
# Let's rethink `is_magic` for a k x k subgrid at (r, c).
# The target sum `S` can be determined from the first row: `S = sum(grid[r][c : c+k])`.
#
# Precomputation:
# `row_sum[i][j]` = sum of `grid[i][0...j-1]`
# `col_sum[i][j]` = sum of `grid[0...i-1][j]`
# `diag1_sum[i][j]` = sum of elements `grid[x][y]` where `x-y == i-j` and `x <= i`.  Index this by `i-j + offset`.
# `diag2_sum[i][j]` = sum of elements `grid[x][y]` where `x+y == i+j` and `x <= i`. Index this by `i+j`.
#
# A more standard approach for 2D prefix sums that can handle subgrids:
# `ps[i][j]` = sum of elements in `grid[0...i-1][0...j-1]`
# Sum of `grid[r1...r2][c1...c2]` = `ps[r2+1][c2+1] - ps[r1][c2+1] - ps[r2+1][c1] + ps[r1][c1]`
#
# This only helps with rectangular sums. For magic squares, we need row, column, and diagonal sums.
#
# Let's try this approach:
# Iterate `k` from `min(m, n)` down to `1`.
# For each `k`, iterate through all possible top-left corners `(r, c)` where `r+k <= m` and `c+k <= n`.
# For each `k x k` subgrid, check if it's a magic square.
#
# To check if `grid[r:r+k][c:c+k]` is a magic square:
# 1. Calculate the sum of the first row: `magic_sum = sum(grid[r][c : c+k])`.
# 2. Check all other rows: For `i` from `r+1` to `r+k-1`, check if `sum(grid[i][c : c+k]) == magic_sum`.
# 3. Check all columns: For `j` from `c` to `c+k-1`, check if `sum(grid[r : r+k][j]) == magic_sum`.
# 4. Check main diagonal: `sum(grid[r+i][c+i] for i in range(k)) == magic_sum`.
# 5. Check anti-diagonal: `sum(grid[r+i][c+k-1-i] for i in range(k)) == magic_sum`.
#
# This check is O(k^2) for each subgrid. Total complexity: O(min(m,n) * m * n * k^2). With k up to 50, this is too slow.
# We need to optimize the sum calculations.
#
# Optimized `is_magic` using prefix sums:
# Precompute `row_prefix_sum[i][j]` = sum of `grid[i][0]` to `grid[i][j-1]`
# Precompute `col_prefix_sum[i][j]` = sum of `grid[0][j]` to `grid[i-1][j]`
#
# For a k x k subgrid at (r, c):
# Target sum `S = row_prefix_sum[r][c+k] - row_prefix_sum[r][c]` (sum of `grid[r][c...c+k-1]`)
#
# Check rows: For `i` from `r` to `r+k-1`:
#   `current_row_sum = row_prefix_sum[i][c+k] - row_prefix_sum[i][c]`
#   If `current_row_sum != S`, return False.
#
# Check columns: For `j` from `c` to `c+k-1`:
#   `current_col_sum = col_prefix_sum[r+k][j] - col_prefix_sum[r][j]`
#   If `current_col_sum != S`, return False.
#
# Check main diagonal:
#   `diag1_sum = 0`
#   For `i` from `0` to `k-1`: `diag1_sum += grid[r+i][c+i]`
#   If `diag1_sum != S`, return False.
#
# Check anti-diagonal:
#   `diag2_sum = 0`
#   For `i` from `0` to `k-1`: `diag2_sum += grid[r+i][c+k-1-i]`
#   If `diag2_sum != S`, return False.
#
# This `is_magic` check is O(k) because row/column sums are O(1) with prefix sums, but diagonal sums are O(k).
# Total complexity: O(min(m,n) * m * n * k). Still potentially too slow (50 * 50 * 50 * 50 = 6.25 million operations per `k` loop iteration).
#
# Can we optimize diagonal sums too?
# We can precompute prefix sums for diagonals.
# For main diagonals (constant `i-j`):
#   Let `diag1_pref[d][i]` be the sum of `grid[x][y]` where `x-y = d` and `x <= i`.
#   The difference in `i` will give us the sum.
#   For a kxk square at (r,c), the main diagonal elements are `grid[r][c], grid[r+1][c+1], ..., grid[r+k-1][c+k-1]`.
#   All these elements have `x-y = r-c`. Let `d = r-c`.
#   The sum is `sum(grid[r+i][c+i] for i in range(k))`.
#   If we precompute `diag1_prefix[d][idx]` = sum of `grid[x][y]` where `x-y=d` and `x` goes from `0` to `idx-1`.
#   Then the sum of `grid[r+i][c+i]` for `i=0..k-1` is `diag1_prefix[r-c][r+k] - diag1_prefix[r-c][r]`.
#   We need to handle the offset for `r-c`. The difference `r-c` ranges from `-(n-1)` to `m-1`.
#   Let `diag1_offset = n - 1`. The index for `r-c` will be `r-c + diag1_offset`.
#   `diag1_pref[r-c + diag1_offset][i]` = sum of elements on diagonal `d=r-c` with row index up to `i-1`.
#   Sum for main diagonal of kxk square at (r,c): `diag1_pref[r-c + diag1_offset][r+k] - diag1_pref[r-c + diag1_offset][r]`
#
# For anti-diagonals (constant `i+j`):
#   Let `diag2_pref[s][i]` be the sum of `grid[x][y]` where `x+y = s` and `x <= i`.
#   The sum of `grid[r+i][c+k-1-i]` for `i=0..k-1`.
#   The elements are `(r, c+k-1), (r+1, c+k-2), ..., (r+k-1, c)`.
#   All these elements have `x+y = r + (c+k-1)`. Let `s = r+c+k-1`.
#   Sum for anti-diagonal: `diag2_pref[s][r+k] - diag2_pref[s][r]`.
#   The sum `i+j` ranges from `0` to `m+n-2`. Index is `i+j`.
#   `diag2_pref[i+j][idx]` = sum of elements on diagonal `s=i+j` with row index up to `idx-1`.
#   Sum for anti-diagonal of kxk square at (r,c): `diag2_pref[r+c+k-1][r+k] - diag2_pref[r+c+k-1][r]`
#
# With these diagonal prefix sums, `is_magic` becomes O(k).
# Total complexity: O(min(m,n) * m * n * k) because we still iterate k down.
#
# Let's reconsider the constraints and the loop structure.
# `m, n <= 50`.
# If we iterate `k` from `min(m, n)` down to `1`, and for each `k`, iterate `r` and `c`.
# The `is_magic` check will take O(k).
# Total complexity: `Sum_{k=1 to min(m,n)} (m-k+1) * (n-k+1) * k`
# This is roughly `O(min(m,n)^2 * m * n)`. For m=n=50, this is 50^2 * 50 * 50 = 6.25 million. This should be acceptable.
#
# Let's structure the code.
#
# 1. Precompute prefix sums:
#    `row_sum[m][n+1]`
#    `col_sum[m+1][n]`
#    `diag1_sum[m+n][m+1]` (for `i-j`, index `i-j + n-1`)
#    `diag2_sum[m+n][m+1]` (for `i+j`)
#
# 2. Iterate `k` from `min(m, n)` down to `1`.
# 3. Iterate `r` from `0` to `m-k`.
# 4. Iterate `c` from `0` to `n-k`.
# 5. Call `is_magic(r, c, k)` using precomputed sums.
# 6. If `is_magic` returns True, return `k`.
#
# If loop finishes without returning, return 1 (since 1x1 is always magic).
#
# Helper function `get_sum_diag1(r1, c1, r2, c2)`:
#   `d = r1 - c1`
#   `offset = n - 1`
#   `sum_up_to_r2 = diag1_sum[d + offset][r2 + 1]`
#   `sum_up_to_r1_minus_1 = diag1_sum[d + offset][r1]`
#   Return `sum_up_to_r2 - sum_up_to_r1_minus_1`
#
# Helper function `get_sum_diag2(r1, c1, r2, c2)`:
#   `s = r1 + c1`
#   `sum_up_to_r2 = diag2_sum[s][r2 + 1]`
#   `sum_up_to_r1_minus_1 = diag2_sum[s][r1]`
#   Return `sum_up_to_r2 - sum_up_to_r1_minus_1`
#
# The indices for diagonal prefix sums need careful handling.
# `diag1_sum[diag_idx][row_idx]` stores sum of elements on diagonal `diag_idx` with row index up to `row_idx - 1`.
# `diag_idx` corresponds to `r-c + n-1`. It ranges from `0` to `m+n-2`.
# `row_idx` corresponds to the row index in the original grid, `0` to `m`.
#
# Let's implement the prefix sum calculation first.
#
# `m = len(grid)`
# `n = len(grid[0])`
#
# `row_prefix = [[0] * (n + 1) for _ in range(m)]`
# `for r in range(m):`
#   `for c in range(n):`
#     `row_prefix[r][c+1] = row_prefix[r][c] + grid[r][c]`
#
# `col_prefix = [[0] * n for _ in range(m + 1)]`
# `for c in range(n):`
#   `for r in range(m):`
#     `col_prefix[r+1][c] = col_prefix[r][c] + grid[r][c]`
#
# For diagonals, it's more complex.
# `diag1_prefix` (constant `r-c`): range of `r-c` is `-(n-1)` to `m-1`. Total `m+n-1` diagonals.
#   Offset for `r-c`: `n-1`. Index `r-c + n-1`.
#   Size: `(m+n-1) x (m+1)`
#   `diag1_prefix = [[0] * (m + 1) for _ in range(m + n - 1)]`
#   `for r in range(m):`
#     `for c in range(n):`
#       `diag_idx = r - c + n - 1`
#       `diag1_prefix[diag_idx][r+1] = diag1_prefix[diag_idx][r] + grid[r][c]`
#
# `diag2_prefix` (constant `r+c`): range of `r+c` is `0` to `m+n-2`. Total `m+n-1` diagonals.
#   Index `r+c`.
#   Size: `(m+n-1) x (m+1)`
#   `diag2_prefix = [[0] * (m + 1) for _ in range(m + n - 1)]`
#   `for r in range(m):`
#     `for c in range(n):`
#       `diag_idx = r + c`
#       `diag2_prefix[diag_idx][r+1] = diag2_prefix[diag_idx][r] + grid[r][c]`
#
# Now, the `is_magic(r, c, k)` function:
#
# `magic_sum = row_prefix[r][c+k] - row_prefix[r][c]`
#
# Check rows:
# `for i in range(r, r+k):`
#   `if row_prefix[i][c+k] - row_prefix[i][c] != magic_sum:`
#     `return False`
#
# Check columns:
# `for j in range(c, c+k):`
#   `if col_prefix[r+k][j] - col_prefix[r][j] != magic_sum:`
#     `return False`
#
# Check main diagonal:
# `diag1_val = 0`
# `for i in range(k):`
#   `diag1_val += grid[r+i][c+i]`
# `if diag1_val != magic_sum:`
#   `return False`
#
# Check anti-diagonal:
# `diag2_val = 0`
# `for i in range(k):`
#   `diag2_val += grid[r+i][c+k-1-i]`
# `if diag2_val != magic_sum:`
#   `return False`
#
# `return True`
#
# The diagonal sum calculation in `is_magic` is still O(k).
# Let's use the precomputed diagonal prefix sums in `is_magic`.
#
# For a k x k square at (r, c):
#
# Main diagonal: elements are `grid[r+i][c+i]` for `i = 0...k-1`.
#   The diagonal index `x-y` is constant: `(r+i) - (c+i) = r-c`.
#   Let `d = r-c`. The offset index is `d + n-1`.
#   We want the sum of elements on diagonal `d` from row `r` to `r+k-1`.
#   This means elements `grid[r][c], grid[r+1][c+1], ..., grid[r+k-1][c+k-1]`.
#   The `diag1_prefix[diag_idx][row_idx]` stores sum for elements where `x-y = diag_idx` and `x` goes from `0` to `row_idx-1`.
#   So, sum from `r` to `r+k-1` is `diag1_prefix[d + n - 1][r+k] - diag1_prefix[d + n - 1][r]`.
#
# Anti-diagonal: elements are `grid[r+i][c+k-1-i]` for `i = 0...k-1`.
#   The diagonal index `x+y` is constant: `(r+i) + (c+k-1-i) = r+c+k-1`.
#   Let `s = r+c+k-1`.
#   The `diag2_prefix[diag_idx][row_idx]` stores sum for elements where `x+y = diag_idx` and `x` goes from `0` to `row_idx-1`.
#   So, sum from `r` to `r+k-1` is `diag2_prefix[s][r+k] - diag2_prefix[s][r]`.
#
# With this, `is_magic` becomes O(1) after initial prefix sum calculation.
#
# Total time complexity:
# Prefix sum precomputation: O(m*n + (m+n)*m) roughly O(m^2 + mn)
# Iterating k, r, c: O(min(m,n) * m * n)
# Total: O(min(m,n) * m * n)
# For m=n=50, this is 50 * 50 * 50 = 125,000 iterations of the inner `is_magic` check.
# This is efficient.
#
# Space complexity:
# Prefix sum arrays: O(m*n + (m+n)*m) = O(m^2 + mn)
# For m=n=50, this is about 50*50 + 100*50 = 2500 + 5000 = 7500 elements. Manageable.
#
# Let's define the ranges for diagonal prefix sums carefully.
# `diag1_prefix[diag_idx][row_idx]` where `diag_idx` is `r-c + n-1`.
# `diag_idx` ranges from `0` (when `r=0, c=n-1`) to `m+n-2` (when `r=m-1, c=0`).
# So number of diagonals is `m+n-1`.
# `row_idx` is `r+1` (using 1-based indexing for sums).
# Size: `(m+n-1) x (m+1)`. This is correct.
#
# `diag2_prefix[diag_idx][row_idx]` where `diag_idx` is `r+c`.
# `diag_idx` ranges from `0` (when `r=0, c=0`) to `m+n-2` (when `r=m-1, c=n-1`).
# So number of diagonals is `m+n-1`.
# `row_idx` is `r+1` (using 1-based indexing for sums).
# Size: `(m+n-1) x (m+1)`. This is correct.
#
# Let's double check the indexing when using `diag1_prefix[d + n - 1][r+k] - diag1_prefix[d + n - 1][r]`.
# This correctly sums elements on the diagonal `d` where the row index `x` is from `r` to `r+k-1`.
# For `grid[r][c]`, `x=r`, `y=c`. `x-y = r-c = d`. This is correct.
# For `grid[r+k-1][c+k-1]`, `x=r+k-1`, `y=c+k-1`. `x-y = r-c = d`. This is correct.
#
# Similar logic for `diag2_prefix`.
# For anti-diagonal, elements are `grid[r+i][c+k-1-i]`.
# `x = r+i`, `y = c+k-1-i`. `x+y = r+i + c+k-1-i = r+c+k-1`. This is constant.
# Let `s = r+c+k-1`. This is the diagonal index.
# The rows involved are `r` through `r+k-1`.
# Sum is `diag2_prefix[s][r+k] - diag2_prefix[s][r]`. This seems correct.
#
# Example 1:
# grid = [[7,1,4,5,6],[2,5,1,6,4],[1,5,4,3,2],[1,2,7,3,4]]
# m=4, n=5
# min(m,n) = 4
# Try k=4:
#  r=0, c=0: 4x4 subgrid [[7,1,4,5],[2,5,1,6],[1,5,4,3],[1,2,7,3]]
#  Sum first row: 7+1+4+5 = 17.
#  Sum second row: 2+5+1+6 = 14. Not magic.
# Try k=3:
#  r=0, c=0: [[7,1,4],[2,5,1],[1,5,4]] -> 7+1+4=12. 2+5+1=8. Not magic.
#  r=0, c=1: [[1,4,5],[5,1,6],[5,4,3]] -> 1+4+5=10. 5+1+6=12. Not magic.
#  r=0, c=2: [[4,5,6],[1,6,4],[4,3,2]] -> 4+5+6=15. 1+6+4=11. Not magic.
#  r=1, c=0: [[2,5,1],[1,5,4],[1,2,7]] -> 2+5+1=8. 1+5+4=10. Not magic.
#  r=1, c=1: [[5,1,6],[5,4,3],[2,7,3]]
#    Row sums: 5+1+6=12, 5+4+3=12, 2+7+3=12. (Good)
#    Col sums: 5+5+2=12, 1+4+7=12, 6+3+3=12. (Good)
#    Main diag: 5+4+3=12. (Good)
#    Anti diag: 6+4+2=12. (Good)
#  Found k=3 magic square at (r=1, c=1). Return 3.
#
# The logic seems sound. Let's write the code.

class Solution:
    def largestMagicSquare(self, grid: list[list[int]]) -> int:
        m = len(grid)
        n = len(grid[0])

        # Precompute row prefix sums
        # row_prefix[r][c+1] stores sum of grid[r][0...c]
        row_prefix = [[0] * (n + 1) for _ in range(m)]
        for r in range(m):
            for c in range(n):
                row_prefix[r][c + 1] = row_prefix[r][c] + grid[r][c]

        # Precompute column prefix sums
        # col_prefix[r+1][c] stores sum of grid[0...r][c]
        col_prefix = [[0] * n for _ in range(m + 1)]
        for c in range(n):
            for r in range(m):
                col_prefix[r + 1][c] = col_prefix[r][c] + grid[r][c]

        # Precompute main diagonal prefix sums (constant r-c)
        # diag1_prefix[diag_idx][row_idx] stores sum of elements on diagonal diag_idx
        # where row index x ranges from 0 to row_idx - 1.
        # diag_idx = r - c + offset. Offset is n-1 to make indices non-negative.
        # Range of diag_idx: 0 (r=0, c=n-1) to m+n-2 (r=m-1, c=0). Total m+n-1 diagonals.
        # Size: (m+n-1) x (m+1)
        diag1_prefix = [[0] * (m + 1) for _ in range(m + n - 1)]
        diag1_offset = n - 1
        for r in range(m):
            for c in range(n):
                diag_idx = r - c + diag1_offset
                # diag1_prefix[diag_idx][r+1] sums elements with row index up to r
                diag1_prefix[diag_idx][r + 1] = diag1_prefix[diag_idx][r] + grid[r][c]

        # Precompute anti-diagonal prefix sums (constant r+c)
        # diag2_prefix[diag_idx][row_idx] stores sum of elements on diagonal diag_idx
        # where row index x ranges from 0 to row_idx - 1.
        # diag_idx = r + c.
        # Range of diag_idx: 0 (r=0, c=0) to m+n-2 (r=m-1, c=n-1). Total m+n-1 diagonals.
        # Size: (m+n-1) x (m+1)
        diag2_prefix = [[0] * (m + 1) for _ in range(m + n - 1)]
        for r in range(m):
            for c in range(n):
                diag_idx = r + c
                # diag2_prefix[diag_idx][r+1] sums elements with row index up to r
                diag2_prefix[diag_idx][r + 1] = diag2_prefix[diag_idx][r] + grid[r][c]

        # Helper function to check if a k x k subgrid starting at (r, c) is a magic square
        def is_magic(r_start, c_start, k_size):
            # Calculate the target sum from the first row of the subgrid
            magic_sum = row_prefix[r_start][c_start + k_size] - row_prefix[r_start][c_start]

            # Check row sums
            for r in range(r_start, r_start + k_size):
                if row_prefix[r][c_start + k_size] - row_prefix[r][c_start] != magic_sum:
                    return False

            # Check column sums
            for c in range(c_start, c_start + k_size):
                if col_prefix[r_start + k_size][c] - col_prefix[r_start][c] != magic_sum:
                    return False

            # Check main diagonal sum (top-left to bottom-right)
            # Elements are grid[r_start+i][c_start+i] for i in 0...k_size-1
            # The diagonal index r-c is constant: (r_start+i) - (c_start+i) = r_start - c_start
            d = r_start - c_start
            diag_idx1 = d + diag1_offset
            # Sum of elements on diagonal diag_idx1 from row r_start to r_start + k_size - 1
            main_diag_sum = diag1_prefix[diag_idx1][r_start + k_size] - diag1_prefix[diag_idx1][r_start]
            if main_diag_sum != magic_sum:
                return False

            # Check anti-diagonal sum (top-right to bottom-left)
            # Elements are grid[r_start+i][c_start+k_size-1-i] for i in 0...k_size-1
            # The diagonal index r+c is constant: (r_start+i) + (c_start+k_size-1-i) = r_start + c_start + k_size - 1
            s = r_start + c_start + k_size - 1
            diag_idx2 = s
            # Sum of elements on diagonal diag_idx2 from row r_start to r_start + k_size - 1
            anti_diag_sum = diag2_prefix[diag_idx2][r_start + k_size] - diag2_prefix[diag_idx2][r_start]
            if anti_diag_sum != magic_sum:
                return False

            return True

        # Iterate through possible sizes of magic squares, from largest to smallest
        for k in range(min(m, n), 0, -1):
            # Iterate through all possible top-left corners (r, c) for a k x k square
            for r in range(m - k + 1):
                for c in range(n - k + 1):
                    if is_magic(r, c, k):
                        return k

        # A 1x1 square is always a magic square, so we'll always find at least k=1
        return 1

```