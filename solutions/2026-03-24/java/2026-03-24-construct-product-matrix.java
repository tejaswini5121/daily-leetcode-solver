```java
class Solution {
    /*
     * Problem Summary: Given a 2D matrix, construct a new matrix where each element is the product of all other elements in the original matrix, modulo 12345.
     * Link: https://leetcode.com/problems/construct-product-matrix/
     *
     * Approach:
     * The core idea is to calculate the total product of all elements in the grid, modulo 12345.
     * Then, for each element p[i][j], it will be (total_product / grid[i][j]) % 12345.
     * However, division is problematic with modulo arithmetic, especially if grid[i][j] is 0.
     *
     * A more robust approach uses prefix and suffix products.
     * 1. Calculate the product of all elements to the "left" (top-left to current element) of each cell.
     * 2. Calculate the product of all elements to the "right" (bottom-right to current element) of each cell.
     *
     * We can do this efficiently by first iterating through the grid to calculate prefix products.
     * Then, iterate backward to calculate suffix products and combine them with the prefix products.
     *
     * Let's refine this for a 2D grid:
     * We can think of the "prefix" and "suffix" products in terms of a flattened 1D representation of the grid.
     * Imagine flattening the grid into a 1D array. We can then compute prefix products and suffix products for this 1D array.
     *
     * For a 2D grid of size n x m:
     * Total number of elements = N = n * m.
     *
     * Step 1: Calculate the total product of all elements modulo 12345.
     * We also need to count the number of zeros in the grid.
     *
     * Step 2: Handle the zero cases:
     * - If there are more than one zero: Every element in the product matrix will be 0.
     * - If there is exactly one zero at grid[zero_r][zero_c]:
     *   - The element p[zero_r][zero_c] will be the product of all non-zero elements.
     *   - All other elements in the product matrix will be 0.
     * - If there are no zeros: Proceed with prefix/suffix product calculation.
     *
     * Step 3: Prefix and Suffix Products (when no zeros or one zero is handled):
     * Instead of a direct 2D prefix/suffix sum, we can think of iterating through the grid sequentially
     * and maintaining the running product of elements encountered so far (prefix) and the running product
     * of elements yet to be encountered (suffix).
     *
     * We can perform two passes:
     * Pass 1 (Forward): Calculate prefix products.
     *   Initialize a `prefix_product` matrix.
     *   Iterate through the grid. For each cell (i, j):
     *     `prefix_product[i][j]` = product of all elements from grid[0][0] up to and including grid[i][j], modulo 12345.
     *     This can be done by considering the element before it in a row-major order.
     *     `prefix_product[i][j] = (previous_prefix_product * grid[i][j]) % MOD`.
     *     We need a way to track the "previous" element's prefix product.
     *
     * Pass 2 (Backward): Calculate suffix products and combine.
     *   Initialize a `suffix_product` variable to 1.
     *   Iterate through the grid in reverse order (from bottom-right to top-left).
     *   For each cell (i, j):
     *     The product of elements *after* grid[i][j] can be accumulated in `suffix_product`.
     *     `p[i][j]` will be `(prefix_product_up_to_grid[i][j]_exclusive * suffix_product_from_grid[i][j]_exclusive) % MOD`.
     *
     * A more optimized approach using a single result matrix:
     *
     * Initialize `result` matrix of the same dimensions as `grid`.
     *
     * Pass 1 (Forward - Prefix Product):
     *   Initialize `current_prefix_product = 1`.
     *   Iterate through the grid row by row, then column by column.
     *   For each cell `grid[i][j]`:
     *     Set `result[i][j] = current_prefix_product`.
     *     Update `current_prefix_product = (current_prefix_product * grid[i][j]) % MOD`.
     *   After this pass, `result[i][j]` will store the product of all elements *before* `grid[i][j]` in row-major order.
     *
     * Pass 2 (Backward - Suffix Product):
     *   Initialize `current_suffix_product = 1`.
     *   Iterate through the grid in reverse row by row, then reverse column by column.
     *   For each cell `grid[i][j]`:
     *     Update `result[i][j] = (result[i][j] * current_suffix_product) % MOD`.
     *     Update `current_suffix_product = (current_suffix_product * grid[i][j]) % MOD`.
     *   Now, `result[i][j]` stores the product of all elements before it multiplied by the product of all elements after it.
     *
     * Special handling for zeros:
     * If `grid[i][j]` is 0, then `current_prefix_product` or `current_suffix_product` will become 0.
     * This might lead to incorrect results if we don't account for it.
     *
     * Let's reconsider the zero handling first.
     * Calculate `total_product_without_zeros` and `zero_count`.
     *
     * If `zero_count > 1`: return a matrix of all zeros.
     * If `zero_count == 1`: find the `zero_row`, `zero_col`.
     *    The result matrix will be all zeros except at `result[zero_row][zero_col]`, which will be `total_product_without_zeros`.
     * If `zero_count == 0`: Use the prefix/suffix product method.
     *
     * Let's refine the prefix/suffix product calculation to handle modulo at each step to avoid overflow.
     * The modulo is 12345.
     *
     * Time Complexity: O(N), where N = n * m. We iterate through the grid a constant number of times (e.g., 3 passes: one for zero count/total product, two for prefix/suffix products).
     * Space Complexity: O(N) for storing the result matrix. If we are allowed to modify the input grid, it could be O(1) aux space by modifying the grid in-place, but problem implies returning a new matrix.
     */
    public int[][] constructProductMatrix(int[][] grid) {
        int MOD = 12345;
        int n = grid.length;
        int m = grid[0].length;

        // Initialize the result matrix
        int[][] result = new int[n][m];

        // Variables to track total product and number of zeros
        long totalProduct = 1; // Use long to prevent overflow before modulo
        int zeroCount = 0;
        int zeroRow = -1, zeroCol = -1;

        // First pass: Calculate total product and count zeros
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (grid[i][j] == 0) {
                    zeroCount++;
                    zeroRow = i;
                    zeroCol = j;
                } else {
                    // Only multiply non-zero elements for totalProduct
                    totalProduct = (totalProduct * grid[i][j]) % MOD;
                }
            }
        }

        // Handle cases based on zero count
        if (zeroCount > 1) {
            // If more than one zero, all elements in the product matrix are 0
            // The result matrix is already initialized with zeros, so we can just return it.
            return result;
        } else if (zeroCount == 1) {
            // If exactly one zero, only the element at the zero's position will have a non-zero product
            // The product will be the total product of all other (non-zero) elements.
            result[zeroRow][zeroCol] = (int) totalProduct;
            return result;
        } else {
            // No zeros in the grid, proceed with prefix and suffix products

            // Pass 2: Calculate prefix products and store them in the result matrix
            // `result[i][j]` will store the product of all elements *before* `grid[i][j]` in row-major order.
            long prefixProduct = 1;
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < m; j++) {
                    result[i][j] = (int) prefixProduct;
                    prefixProduct = (prefixProduct * grid[i][j]) % MOD;
                }
            }

            // Pass 3: Calculate suffix products and multiply them with the prefix products in the result matrix
            // `suffixProduct` will store the product of all elements *after* `grid[i][j]` in row-major order.
            long suffixProduct = 1;
            for (int i = n - 1; i >= 0; i--) {
                for (int j = m - 1; j >= 0; j--) {
                    // Multiply the existing prefix product with the current suffix product
                    result[i][j] = (int) ((result[i][j] * suffixProduct) % MOD);
                    // Update the suffix product for the next element
                    suffixProduct = (suffixProduct * grid[i][j]) % MOD;
                }
            }
            return result;
        }
    }
}
```