```python
# Problem: Construct Product Matrix
# Link: https://leetcode.com/problems/construct-product-matrix/
# Approach:
# The problem asks us to compute a product matrix `p` where `p[i][j]` is the product of all elements in the input `grid` except `grid[i][j]`, modulo 12345.
# A naive approach would be to iterate through each element `grid[i][j]`, then iterate through the entire `grid` again to compute the product of all other elements. This would result in O((n*m)^2) time complexity, which is too slow given the constraints (n*m <= 10^5).

# A more efficient approach is to use prefix and suffix products.
# First, calculate the total product of all elements in the grid modulo 12345.
# If the total product is `total_prod`, then for an element `grid[i][j]` that is not zero, `p[i][j]` would be `total_prod / grid[i][j]`.
# However, division is not straightforward with modulo arithmetic, and we need to handle zeros carefully.

# Let's refine the prefix/suffix approach. We can flatten the 2D grid into a 1D array conceptually.
# For each cell (i, j), we need the product of all elements before it and all elements after it.
# We can compute prefix products and suffix products for the flattened grid.

# Let MOD = 12345.
# If there are no zeros in the grid:
# 1. Calculate the total product `total_prod` of all elements in `grid` modulo MOD.
# 2. For each `grid[i][j]`, `p[i][j] = (total_prod * pow(grid[i][j], MOD - 2, MOD)) % MOD`. This uses Fermat's Little Theorem for modular inverse, assuming MOD is prime. 12345 is not prime, so this direct modular inverse isn't applicable.

# A better approach that handles zeros and avoids modular inverse:
# We can use prefix sums and suffix sums in a flattened sense.
# Imagine the `grid` is flattened into a 1D array `flat_grid` of size N = n * m.
# We want to compute `p_flat[k]` such that `p_flat[k]` is the product of all elements in `flat_grid` except `flat_grid[k]`, modulo MOD.
# This is a standard "Product of Array Except Self" problem.

# Algorithm:
# 1. Initialize a result matrix `p` of the same dimensions as `grid` with all ones.
# 2. Iterate through the grid row by row, then column by column. Maintain a running product `prefix_prod` of elements encountered so far.
#    For each cell `grid[i][j]`:
#    - Set `p[i][j] = prefix_prod` (product of elements before `grid[i][j]`).
#    - Update `prefix_prod = (prefix_prod * grid[i][j]) % MOD`.
# 3. After the first pass, `p[i][j]` contains the product of all elements *before* `grid[i][j]`.
# 4. Now, iterate through the grid in reverse order (last row to first, last column to first). Maintain a running product `suffix_prod` of elements encountered so far from the end.
#    For each cell `grid[i][j]` (iterating backward):
#    - Update `p[i][j] = (p[i][j] * suffix_prod) % MOD`. This multiplies the prefix product by the suffix product, giving the total product excluding `grid[i][j]`.
#    - Update `suffix_prod = (suffix_prod * grid[i][j]) % MOD`.

# Handling Zeros:
# The above prefix/suffix product approach works correctly even with zeros.
# If `grid[i][j]` is zero:
# - In the first pass, `prefix_prod` will become zero after passing this zero. All subsequent `p[i'][j']` for `(i', j')` after `(i, j)` will be set to 0.
# - In the second pass, if there was a zero `grid[i][j]`, `suffix_prod` will become zero after passing this zero from the end.
# - If there is exactly one zero in the grid at `grid[r][c]`:
#   - `p[r][c]` will be the product of all non-zero elements.
#   - All other `p[i][j]` will be 0 because the total product of the grid will contain `grid[r][c]` (which is 0), and when we exclude any other element `grid[i][j]`, the product of the remaining elements will still include `grid[r][c]`, thus resulting in 0.
# - If there are two or more zeros in the grid:
#   - For any `grid[i][j]`, when we exclude it, the product of the remaining elements will still contain at least one zero. Thus, all elements in `p` will be 0.

# Time Complexity: O(n*m) because we iterate through the grid twice.
# Space Complexity: O(1) if we don't count the output matrix, otherwise O(n*m) for the output matrix. The problem statement implies we need to return the product matrix, so O(n*m) space is expected.

class Solution:
    def constructProductMatrix(self, grid: list[list[int]]) -> list[list[int]]:
        MOD = 12345
        n = len(grid)
        m = len(grid[0])

        # Initialize the product matrix with ones. This will store the final results.
        p = [[1] * m for _ in range(n)]

        # First pass: Calculate prefix products.
        # `prefix_prod` will store the product of all elements encountered *before* the current cell `grid[i][j]`.
        prefix_prod = 1
        for r in range(n):
            for c in range(m):
                # Assign the current prefix product to p[r][c]. This is the product of elements to the "left" of grid[r][c].
                p[r][c] = prefix_prod
                # Update prefix_prod by multiplying with the current element, modulo MOD.
                prefix_prod = (prefix_prod * grid[r][c]) % MOD

        # Second pass: Calculate suffix products and combine with prefix products.
        # `suffix_prod` will store the product of all elements encountered *after* the current cell `grid[i][j]` (when iterating backward).
        suffix_prod = 1
        # Iterate from the last row to the first, and from the last column to the first.
        for r in range(n - 1, -1, -1):
            for c in range(m - 1, -1, -1):
                # Multiply the existing value in p[r][c] (which is the prefix product) by the suffix product.
                # This gives the product of all elements except grid[r][c], modulo MOD.
                p[r][c] = (p[r][c] * suffix_prod) % MOD
                # Update suffix_prod by multiplying with the current element, modulo MOD.
                suffix_prod = (suffix_prod * grid[r][c]) % MOD

        # Return the constructed product matrix.
        return p

```