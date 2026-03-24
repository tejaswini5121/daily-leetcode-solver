// Problem: Construct Product Matrix
// Given a 2D matrix grid, construct a product matrix p where p[i][j] is the product of all elements in grid except grid[i][j], modulo 12345.
// Link: https://leetcode.com/problems/construct-product-matrix/
//
// Approach:
// The problem asks to calculate the product of all elements except the current one for each cell in the grid.
// A naive approach would be to iterate through the grid for each cell, calculate the total product, and then divide by the current element. However, division is not allowed for modulo arithmetic, and elements can be 0.
// A more efficient approach is to use prefix and suffix products.
// For a 1D array, we can calculate prefix products: `prefix_prod[i] = arr[0] * ... * arr[i]`.
// And suffix products: `suffix_prod[i] = arr[i] * ... * arr[n-1]`.
// Then, for `arr[i]`, the product of elements except `arr[i]` would be `prefix_prod[i-1] * suffix_prod[i+1]`.
//
// For a 2D matrix, we can extend this idea.
// First, calculate the product of all elements in the grid. Let this be `total_product`.
// If `total_product` is 0, it means there's at least one 0 in the grid.
// If there's exactly one 0 at `grid[zero_r][zero_c]`, then `p[zero_r][zero_c]` will be the product of all non-zero elements, and all other `p[i][j]` will be 0.
// If there are multiple 0s, then all `p[i][j]` will be 0.
//
// If there are no zeros in the grid, we can compute `total_product` and then `p[i][j] = total_product / grid[i][j] % MOD`. This division needs careful handling with modulo inverse if MOD is prime, but since we are calculating the product of *all other elements*, we can avoid direct division.
//
// A robust approach that handles zeros and avoids division:
// 1. Calculate the total product of all elements in the grid modulo 12345.
// 2. Count the number of zeros in the grid.
// 3. If there are more than one zero, the result matrix will be all zeros.
// 4. If there is exactly one zero at `grid[zero_r][zero_c]`:
//    - Calculate the product of all non-zero elements. Let this be `product_of_non_zeros`.
//    - `p[zero_r][zero_c]` will be `product_of_non_zeros % 12345`.
//    - All other `p[i][j]` will be 0.
// 5. If there are no zeros:
//    - We need to calculate `p[i][j]` as the product of all elements except `grid[i][j]`.
//    - This can be done by iterating through the grid once to compute prefix products and suffix products for each row and column, similar to the 1D case but generalized.
//    - A more intuitive approach without explicit division for the non-zero case:
//      Iterate through the grid. For each `grid[i][j]`, we want the product of all elements.
//      We can use two passes:
//      First pass (left-to-right, top-to-bottom): Calculate the product of elements encountered so far, excluding the current element.
//      Second pass (right-to-left, bottom-to-top): Multiply the result from the first pass with the product of elements encountered so far from the end.
//
// Let's refine the approach to be more general and handle zeros correctly without special casing for no zeros vs. zeros.
// We can use prefix and suffix products in a 2D manner.
// 1. Create a `prefix_row_products` matrix of the same size. `prefix_row_products[i][j]` will store the product of elements `grid[i][0]` through `grid[i][j]`, modulo 12345.
// 2. Create a `suffix_row_products` matrix. `suffix_row_products[i][j]` will store the product of elements `grid[i][j]` through `grid[i][m-1]`, modulo 12345.
// 3. Create a `prefix_col_products` matrix. `prefix_col_products[i][j]` will store the product of elements `grid[0][j]` through `grid[i][j]`, modulo 12345.
// 4. Create a `suffix_col_products` matrix. `suffix_col_products[i][j]` will store the product of elements `grid[i][j]` through `grid[n-1][j]`, modulo 12345.
//
// This approach requires O(n*m) space for these intermediate matrices.
//
// A space-optimized approach using prefix and suffix products directly in the result matrix:
// The problem states `n * m <= 10^5`. This means we can afford O(n*m) time complexity.
// For space, we need to be more careful if `n` and `m` are both large. However, `n*m` constraint implies that if `n` is large, `m` must be small, and vice-versa.
// So, O(n*m) space for the result matrix is acceptable.
//
// Let's use a single pass to fill the result matrix with prefix products, and then another pass to incorporate suffix products.
//
// Algorithm:
// MOD = 12345
// n = grid.length
// m = grid[0].length
// p = new Array(n).fill(0).map(() => new Array(m).fill(1)); // Initialize result matrix with 1s
//
// Pass 1: Calculate prefix products (row-wise and then column-wise).
// For each row `i`:
//   current_product = 1
//   For each column `j`:
//     p[i][j] = current_product // Product of elements before grid[i][j] in this row
//     current_product = (current_product * grid[i][j]) % MOD
//
// Now, `p[i][j]` stores the product of `grid[i][0]` to `grid[i][j-1]` modulo MOD.
//
// We need to combine row and column products.
// Let's rethink. The problem is for each `p[i][j]`, we need the product of ALL other elements.
//
// A better approach is to calculate the total product and handle zeros.
//
// Let's use the prefix/suffix product idea but apply it to flatten the matrix conceptually.
// Total elements N = n * m.
// We can think of a 1D array `flat_grid` of size N.
// For `flat_grid[k]`, we want the product of all elements except `flat_grid[k]`.
// This can be solved using 1D prefix/suffix products.
//
// To map 2D index (i, j) to 1D index k: `k = i * m + j`.
// To map 1D index k to 2D index (i, j): `i = floor(k / m)`, `j = k % m`.
//
// Algorithm using 1D prefix/suffix on a conceptual flattened array:
// MOD = 12345
// n = grid.length
// m = grid[0].length
// p = new Array(n).fill(0).map(() => new Array(m).fill(0));
//
// total_product = 1
// zero_count = 0
// zero_pos = { row: -1, col: -1 }
//
// Iterate through grid to calculate total_product, zero_count, and zero_pos:
// For i from 0 to n-1:
//   For j from 0 to m-1:
//     If grid[i][j] == 0:
//       zero_count++
//       zero_pos.row = i
//       zero_pos.col = j
//     Else:
//       total_product = (total_product * grid[i][j]) % MOD
//
// Now, fill the result matrix `p`:
// If zero_count > 1:
//   // All elements of p will be 0. The matrix is already initialized to 0.
//   return p
//
// If zero_count == 1:
//   // Only the element at zero_pos will be non-zero.
//   p[zero_pos.row][zero_pos.col] = total_product
//   return p
//
// If zero_count == 0:
//   // No zeros. We can use division conceptually.
//   // p[i][j] = total_product / grid[i][j] % MOD
//   // To avoid division, we can use prefix and suffix products.
//   // This is where the 2D prefix/suffix logic comes in.
//
// Let's refine the 2D prefix/suffix logic without relying on total_product and division.
//
// We can perform two main passes on the grid:
// Pass 1: Calculate prefix products (left-to-right, top-to-bottom).
//   `p[i][j]` will store the product of all elements *before* `grid[i][j]` in a row-major traversal.
//   Initialize `p` with 1s.
//   `current_product_row = 1`
//   For `i` from 0 to `n-1`:
//     `current_product_row = 1`
//     For `j` from 0 to `m-1`:
//       `p[i][j] = current_product_row`
//       `current_product_row = (current_product_row * grid[i][j]) % MOD`
//
//   After this, `p[i][j]` holds the product of `grid[i][0]` through `grid[i][j-1]`.
//
//   Now, we need to incorporate the products from elements above `grid[i][j]`.
//   This can be done by introducing a `current_product_col` that accumulates products from previous rows.
//
// Let's consider a single pass with two variables, one for prefix products and one for suffix products.
//
// Algorithm using two passes and in-place calculation (conceptually):
// MOD = 12345
// n = grid.length
// m = grid[0].length
// p = new Array(n).fill(0).map(() => new Array(m).fill(1)); // Initialize result matrix with 1s
//
// Pass 1: Calculate prefix products for each element.
//   `prefix_product_so_far = 1`
//   For `i` from 0 to `n-1`:
//     For `j` from 0 to `m-1`:
//       // The product of all elements *before* grid[i][j] in a flattened row-major traversal.
//       // We can't directly do this in one pass and update p[i][j].
//
// Let's go back to the 1D prefix/suffix idea on a conceptually flattened array.
// This seems the most robust and clear.
//
// The challenge is that `n*m <= 10^5`, so we can't create a temporary flattened array of size `n*m` if `n` and `m` are both large (e.g., n=10^5, m=1).
// But if n=10^5, m=1, then n*m=10^5. If n=sqrt(10^5) ~= 316, m=sqrt(10^5) ~= 316, then n*m=10^5.
// The constraint is on `n*m`, not on `n` or `m` individually.
// So, we can always create a result matrix of size n*m.
//
// The logic for 1D prefix/suffix product on a flattened array:
// `prefix_products[k] = product of elements from index 0 to k-1`
// `suffix_products[k] = product of elements from index k+1 to N-1`
// `result[k] = prefix_products[k] * suffix_products[k]`
//
// We can compute this in two passes on the grid, without explicitly flattening it.
//
// Pass 1: Calculate row-wise prefix products and column-wise prefix products for elements *before* the current one.
// Initialize `p` matrix with 1s.
//
// `prefix_row_prod_val = 1`
// For `i` from 0 to `n-1`:
//   `prefix_row_prod_val = 1`
//   For `j` from 0 to `m-1`:
//     // `p[i][j]` currently stores the product of elements `grid[i][0]`...`grid[i][j-1]`
//     `p[i][j] = prefix_row_prod_val`
//     `prefix_row_prod_val = (prefix_row_prod_val * grid[i][j]) % MOD`
//
// Now, `p[i][j]` contains the product of elements to its left in the same row.
// We need to multiply this by the product of elements above it.
//
// Let's use a single `res` matrix and two passes.
// MOD = 12345
// n = grid.length
// m = grid[0].length
// res = new Array(n).fill(0).map(() => new Array(m).fill(1));
//
// Pass 1: Compute prefix products (row-wise and then incorporate column-wise prefix).
//   `prefix_val = 1`
//   For `i` from 0 to `n-1`:
//     `prefix_val = 1` // Reset for each row
//     For `j` from 0 to `m-1`:
//       `res[i][j] = prefix_val` // Stores product of elements to the left in the same row
//       `prefix_val = (prefix_val * grid[i][j]) % MOD`
//
//   After this loop, `res[i][j]` contains the product of `grid[i][0] * ... * grid[i][j-1]`.
//   We need to multiply this by the product of elements `grid[0][j] * ... * grid[i-1][j]`.
//
//   Let's adjust Pass 1:
//   `row_prefix = 1`
//   For `i` from 0 to `n-1`:
//     `row_prefix = 1`
//     For `j` from 0 to `m-1`:
//       `res[i][j] = row_prefix`
//       `row_prefix = (row_prefix * grid[i][j]) % MOD`
//
//   Now `res[i][j]` has the product of elements to the left in row `i`.
//
//   To incorporate column prefix:
//   `col_prefix = 1`
//   For `j` from 0 to `m-1`:
//     `col_prefix = 1` // Reset for each column
//     For `i` from 0 to `n-1`:
//       // `res[i][j]` currently holds the product of elements `grid[i][0]` to `grid[i][j-1]`.
//       // We need to multiply it by the product of `grid[0][j]` to `grid[i-1][j]`.
//       // Let's modify this.
//
// Let's use the approach that directly computes prefix and suffix products in a flattened sense but applies it to the 2D structure.
//
// For cell `(i, j)`, the desired product is:
// (Product of elements in row `i` to the left of `j`) *
// (Product of elements in row `i` to the right of `j`) *
// (Product of elements in column `j` above `i`) *
// (Product of elements in column `j` below `i`)
//
// This doesn't quite work directly because it double counts.
//
// The correct 1D prefix/suffix product application to 2D:
// `p[i][j]` = (product of all elements *before* `grid[i][j]` in row-major order) * (product of all elements *after* `grid[i][j]` in row-major order)
//
// Let's implement this.
//
// MOD = 12345
// n = grid.length
// m = grid[0].length
// p = new Array(n).fill(0).map(() => new Array(m).fill(1));
//
// Pass 1: Calculate prefix products.
//   `prefix_product_so_far = 1`
//   For `i` from 0 to `n-1`:
//     For `j` from 0 to `m-1`:
//       // `p[i][j]` will store the product of all elements `grid[r][c]`
//       // where `r * m + c < i * m + j`.
//       `p[i][j] = prefix_product_so_far`
//       `prefix_product_so_far = (prefix_product_so_far * grid[i][j]) % MOD`
//
// Pass 2: Calculate suffix products and combine.
//   `suffix_product_so_far = 1`
//   For `i` from `n-1` down to 0:
//     For `j` from `m-1` down to 0:
//       // `p[i][j]` currently holds the prefix product.
//       // Multiply it by the suffix product:
//       // product of all elements `grid[r][c]` where `r * m + c > i * m + j`.
//       `p[i][j] = (p[i][j] * suffix_product_so_far) % MOD`
//       `suffix_product_so_far = (suffix_product_so_far * grid[i][j]) % MOD`
//
// This approach correctly computes the product of all elements except `grid[i][j]` for each cell.
// It handles zeros implicitly because if any `grid[i][j]` is zero, `prefix_product_so_far` and `suffix_product_so_far` will become zero when they encounter that zero, and subsequent calculations will remain zero.
//
// Example 1 walkthrough: grid = [[1,2],[3,4]]
// n=2, m=2, MOD=12345
// p = [[1,1],[1,1]]
//
// Pass 1 (Prefix):
// i=0, j=0: p[0][0] = 1. prefix_product_so_far = (1 * 1) % MOD = 1.
// i=0, j=1: p[0][1] = 1. prefix_product_so_far = (1 * 2) % MOD = 2.
// i=1, j=0: p[1][0] = 2. prefix_product_so_far = (2 * 3) % MOD = 6.
// i=1, j=1: p[1][1] = 6. prefix_product_so_far = (6 * 4) % MOD = 24.
//
// After Pass 1: p = [[1, 1], [2, 6]]
//
// Pass 2 (Suffix):
// suffix_product_so_far = 1
//
// i=1, j=1: p[1][1] = (6 * 1) % MOD = 6. suffix_product_so_far = (1 * 4) % MOD = 4.
// i=1, j=0: p[1][0] = (2 * 4) % MOD = 8. suffix_product_so_far = (4 * 3) % MOD = 12.
// i=0, j=1: p[0][1] = (1 * 12) % MOD = 12. suffix_product_so_far = (12 * 2) % MOD = 24.
// i=0, j=0: p[0][0] = (1 * 24) % MOD = 24. suffix_product_so_far = (24 * 1) % MOD = 24.
//
// After Pass 2: p = [[24, 12], [8, 6]]
// This matches Example 1.
//
// Example 2 walkthrough: grid = [[12345],[2],[1]]
// n=3, m=1, MOD=12345
// p = [[1],[1],[1]]
//
// Pass 1 (Prefix):
// i=0, j=0: p[0][0] = 1. prefix_product_so_far = (1 * 12345) % MOD = 0.
// i=1, j=0: p[1][0] = 0. prefix_product_so_far = (0 * 2) % MOD = 0.
// i=2, j=0: p[2][0] = 0. prefix_product_so_far = (0 * 1) % MOD = 0.
//
// After Pass 1: p = [[1], [0], [0]]
//
// Pass 2 (Suffix):
// suffix_product_so_far = 1
//
// i=2, j=0: p[2][0] = (0 * 1) % MOD = 0. suffix_product_so_far = (1 * 1) % MOD = 1.
// i=1, j=0: p[1][0] = (0 * 1) % MOD = 0. suffix_product_so_far = (1 * 2) % MOD = 2.
// i=0, j=0: p[0][0] = (1 * 2) % MOD = 2. suffix_product_so_far = (2 * 12345) % MOD = 0.
//
// After Pass 2: p = [[2], [0], [0]]
// This matches Example 2.
//
// The approach seems correct and handles zeros.
//
// Time complexity:
// Two passes over the grid. Each pass takes O(n*m) time.
// Total time complexity = O(n*m).
//
// Space complexity:
// We create a result matrix `p` of size n*m.
// Total space complexity = O(n*m).
//
// The constraint `1 <= n == grid.length <= 10^5`, `1 <= m == grid[i].length <= 10^5`, `2 <= n * m <= 10^5`
// ensures that `n*m` is at most `10^5`. So O(n*m) space is acceptable.

const MOD = 12345;

/**
 * @param {number[][]} grid
 * @return {number[][]}
 */
var constructProductMatrix = function(grid) {
    const n = grid.length;
    const m = grid[0].length;

    // Initialize the product matrix `p` with all ones.
    // `p[i][j]` will eventually store the product of all elements in `grid` except `grid[i][j]`.
    const p = new Array(n).fill(0).map(() => new Array(m).fill(1));

    // Pass 1: Calculate prefix products.
    // This pass computes the product of all elements that come *before* the current element `grid[i][j]`
    // in a row-major traversal of the grid.
    // `prefix_product_so_far` accumulates this product.
    let prefix_product_so_far = 1;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            // Store the accumulated prefix product in `p[i][j]`.
            // At this point, `p[i][j]` represents the product of elements before `grid[i][j]`.
            p[i][j] = prefix_product_so_far;

            // Update `prefix_product_so_far` by multiplying with the current element `grid[i][j]`,
            // taking modulo MOD. This handles potential overflows and ensures results are within bounds.
            // If `grid[i][j]` is 0, `prefix_product_so_far` will become 0 and stay 0 for subsequent elements,
            // correctly propagating the effect of zero.
            prefix_product_so_far = (prefix_product_so_far * grid[i][j]) % MOD;
        }
    }

    // Pass 2: Calculate suffix products and combine with prefix products.
    // This pass computes the product of all elements that come *after* the current element `grid[i][j]`
    // in a row-major traversal of the grid.
    // `suffix_product_so_far` accumulates this product from the end of the grid backwards.
    let suffix_product_so_far = 1;
    // Iterate from the last row to the first row.
    for (let i = n - 1; i >= 0; i--) {
        // Iterate from the last column to the first column within each row.
        for (let j = m - 1; j >= 0; j--) {
            // Multiply the current value in `p[i][j]` (which is the prefix product)
            // by the `suffix_product_so_far`. This gives the total product of all elements
            // except `grid[i][j]`.
            p[i][j] = (p[i][j] * suffix_product_so_far) % MOD;

            // Update `suffix_product_so_far` by multiplying with the current element `grid[i][j]`,
            // taking modulo MOD.
            // Similar to the prefix pass, if `grid[i][j]` is 0, `suffix_product_so_far` becomes 0
            // and propagates backwards.
            suffix_product_so_far = (suffix_product_so_far * grid[i][j]) % MOD;
        }
    }

    // Return the constructed product matrix `p`.
    return p;
};
```