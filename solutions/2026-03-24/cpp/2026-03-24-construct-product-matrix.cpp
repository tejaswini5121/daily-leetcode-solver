```cpp
// Problem: Construct Product Matrix
// Given a 0-indexed 2D integer matrix grid, construct a product matrix p where
// p[i][j] is the product of all elements in grid except grid[i][j], taken modulo 12345.
// Link: https://leetcode.com/problems/construct-product-matrix/
//
// Approach:
// The core idea is to calculate the total product of all elements in the grid first.
// Then, for each element grid[i][j], the corresponding element p[i][j] can be
// calculated by dividing the total product by grid[i][j]. However, direct division
// is not possible with modular arithmetic if we want to maintain the modulo.
//
// A more robust approach for modular arithmetic is to use prefix and suffix products.
// We can flatten the 2D grid into a 1D array conceptually.
// Let's denote the flattened grid as `flat_grid` of size N*M.
// We will compute two arrays:
// 1. `prefix_prod`: `prefix_prod[k]` stores the product of `flat_grid[0]` to `flat_grid[k-1]` modulo 12345.
// 2. `suffix_prod`: `suffix_prod[k]` stores the product of `flat_grid[k+1]` to `flat_grid[N*M-1]` modulo 12345.
//
// Then, for `flat_grid[k]`, the product of all elements except itself is `prefix_prod[k] * suffix_prod[k] % 12345`.
//
// We need to handle the case where the total product is 0. If the total product is 0,
// this means there's at least one 0 in the grid.
//
// Case 1: No zeros in the grid.
//   Calculate the total product `total_product` of all elements modulo 12345.
//   For each `grid[i][j]`, `p[i][j] = (total_product * modular_inverse(grid[i][j])) % 12345`.
//   However, calculating modular inverse can be complex and inefficient.
//
// Case 2: One zero in the grid.
//   Let the zero be at `grid[zero_r][zero_c]`.
//   For `p[zero_r][zero_c]`, the product will be the product of all non-zero elements modulo 12345.
//   For all other `p[i][j]` where `(i,j) != (zero_r, zero_c)`, `p[i][j]` will be 0 because `grid[zero_r][zero_c]` will be part of their product.
//
// Case 3: More than one zero in the grid.
//   In this case, every `p[i][j]` will have at least one zero in its product calculation.
//   So, all elements of `p` will be 0.
//
// The prefix/suffix product approach handles all these cases implicitly and efficiently.
// We flatten the matrix conceptually, compute prefix and suffix products, and then combine them.
//
// MOD = 12345
//
// Algorithm:
// 1. Get dimensions n and m.
// 2. Create a flattened list `flat_grid` of size `N*M`.
// 3. Populate `flat_grid` by iterating through `grid` row by row. Keep track of the count of zeros.
// 4. If `zero_count > 1`, return a matrix of all zeros.
// 5. If `zero_count == 1`:
//    a. Find the index `zero_idx` of the single zero in `flat_grid`.
//    b. Calculate the product of all non-zero elements modulo 12345. Let this be `product_without_zero`.
//    c. Create the result matrix `p` of size n*m, initialized with zeros.
//    d. Set `p[zero_idx_row][zero_idx_col] = product_without_zero`.
//    e. Return `p`.
// 6. If `zero_count == 0`:
//    a. Calculate the `total_product` of all elements modulo 12345.
//    b. Create `prefix_prod` array of size `N*M + 1`. `prefix_prod[0] = 1`.
//    c. For `k` from 0 to `N*M - 1`: `prefix_prod[k+1] = (prefix_prod[k] * flat_grid[k]) % 12345`.
//    d. Create `suffix_prod` array of size `N*M + 1`. `suffix_prod[N*M] = 1`.
//    e. For `k` from `N*M - 1` down to 0: `suffix_prod[k] = (suffix_prod[k+1] * flat_grid[k]) % 12345`.
//    f. Create the result matrix `p` of size n*m.
//    g. For `k` from 0 to `N*M - 1`:
//       `p[k_row][k_col] = (prefix_prod[k] * suffix_prod[k+1]) % 12345`.
//       (Note: `suffix_prod[k+1]` represents the product of elements after index `k`).
//    h. Return `p`.
//
// Time Complexity:
// - Flattening the grid: O(N*M)
// - Calculating prefix/suffix products (if no zeros): O(N*M)
// - Reconstructing the product matrix: O(N*M)
// - Handling the zero case: O(N*M)
// Total time complexity is O(N*M), where N is the number of rows and M is the number of columns.
//
// Space Complexity:
// - `flat_grid`: O(N*M)
// - `prefix_prod` and `suffix_prod`: O(N*M)
// - Result matrix `p`: O(N*M)
// Total space complexity is O(N*M).
//
// Optimization: We can potentially reduce space complexity by performing prefix and suffix
// calculations in two passes over the grid, without explicitly creating `flat_grid`,
// `prefix_prod`, and `suffix_prod` arrays.
//
// Optimized Space Approach:
// 1. Get dimensions n and m.
// 2. Initialize `p` matrix of size n*m with all 1s.
// 3. Initialize `zero_count = 0`, `zero_r = -1`, `zero_c = -1`.
// 4. Calculate prefix products:
//    Iterate through `grid` row by row, column by column.
//    Maintain a running `current_prefix_prod = 1`.
//    For each `grid[i][j]`:
//        If `grid[i][j] == 0`:
//            `zero_count++`, `zero_r = i`, `zero_c = j`.
//        Else:
//            `current_prefix_prod = (current_prefix_prod * grid[i][j]) % MOD`.
//        Set `p[i][j] = current_prefix_prod`.
// 5. Calculate suffix products and combine with prefix products:
//    Maintain a running `current_suffix_prod = 1`.
//    Iterate through `grid` in reverse, column by column, then row by row.
//    For each `grid[i][j]`:
//        If `grid[i][j] != 0`:
//            `current_suffix_prod = (current_suffix_prod * grid[i][j]) % MOD`.
//        Combine with the prefix product already stored in `p[i][j]`:
//        `p[i][j] = (p[i][j] * current_suffix_prod) % MOD`.
// 6. Handle zero cases:
//    If `zero_count > 1`:
//        Return a matrix of all zeros.
//    If `zero_count == 1`:
//        Create a new result matrix `final_p` of size n*m, filled with zeros.
//        Calculate the product of all non-zero elements modulo MOD. Let this be `product_without_zero`.
//        Set `final_p[zero_r][zero_c] = product_without_zero`.
//        Return `final_p`.
//    If `zero_count == 0`:
//        Return the `p` matrix computed in step 4 and 5.
//
// Let's refine the optimized space approach to avoid creating a new `final_p` matrix.
// We can use the initial `p` matrix to store intermediate results.
//
// Refined Optimized Space Approach:
// 1. Get dimensions n and m.
// 2. Define MOD = 12345.
// 3. Initialize `p` matrix of size n*m.
// 4. Initialize `total_product_nonzero = 1`.
// 5. Initialize `zero_count = 0`, `zero_r = -1`, `zero_c = -1`.
// 6. First Pass (Prefix Products):
//    Iterate through `grid` row by row, then column by column.
//    Maintain a running `current_prefix_prod = 1`.
//    For `i` from 0 to `n-1`:
//        For `j` from 0 to `m-1`:
//            If `grid[i][j] == 0`:
//                `zero_count++`, `zero_r = i`, `zero_c = j`.
//            Else:
//                `current_prefix_prod = (current_prefix_prod * grid[i][j]) % MOD`.
//            `p[i][j] = current_prefix_prod`. // Stores prefix product up to (i, j)
//    After this loop, `p[i][j]` holds the product of all elements from grid[0][0] to grid[i][j] in flattened order.
//    We also need the product of all non-zero elements. Let's recalculate `total_product_nonzero` separately.
//
//    `total_product_nonzero = 1`.
//    For `i` from 0 to `n-1`:
//        For `j` from 0 to `m-1`:
//            If `grid[i][j] != 0`:
//                `total_product_nonzero = (total_product_nonzero * grid[i][j]) % MOD`.
//
// 7. Second Pass (Suffix Products and Final Calculation):
//    Initialize `current_suffix_prod = 1`.
//    Iterate through `grid` in reverse: column by column, then row by row.
//    For `i` from `n-1` down to 0:
//        For `j` from `m-1` down to 0:
//            If `grid[i][j] != 0`:
//                `current_suffix_prod = (current_suffix_prod * grid[i][j]) % MOD`.
//            // Now, `p[i][j]` contains the prefix product.
//            // `current_suffix_prod` contains the suffix product from the element AFTER (i,j) in flattened order.
//            // The product of all elements except grid[i][j] is:
//            // (prefix product up to element before (i,j)) * (suffix product from element after (i,j))
//            // This is `p[i][j] / grid[i][j] * current_suffix_prod` if no zeros.
//            //
//            // A simpler way:
//            // `p[i][j]` currently holds the prefix product up to `grid[i][j]`.
//            // We want to store `(prefix product up to element before (i,j)) * (suffix product from element after (i,j))`.
//            //
//            // Let's reconsider the direct prefix/suffix calculation on the flattened view.
//
// Let's stick to the conceptually simpler approach first, which is to flatten, then calculate prefix/suffix, then unflatten.
// Then we can optimize if needed.
//
// The original problem statement guarantees `2 <= n * m <= 10^5`. This means N or M can be large, but not both.
// For example, N=10^5, M=1 or N=1, M=10^5, or N=sqrt(10^5), M=sqrt(10^5).
//
// Revisit Example 1: grid = [[1,2],[3,4]]
// n=2, m=2, N*M=4
// flat_grid = [1, 2, 3, 4]
// MOD = 12345
// zero_count = 0
//
// Prefix Products:
// prefix_prod[0] = 1
// prefix_prod[1] = (1 * 1) % MOD = 1
// prefix_prod[2] = (1 * 2) % MOD = 2
// prefix_prod[3] = (2 * 3) % MOD = 6
// prefix_prod[4] = (6 * 4) % MOD = 24
// prefix_prod = [1, 1, 2, 6, 24] (size 5)
//
// Suffix Products:
// suffix_prod[4] = 1
// suffix_prod[3] = (1 * 4) % MOD = 4
// suffix_prod[2] = (4 * 3) % MOD = 12
// suffix_prod[1] = (12 * 2) % MOD = 24
// suffix_prod[0] = (24 * 1) % MOD = 24
// suffix_prod = [24, 24, 12, 4, 1] (size 5)
//
// Result matrix `p` (size 4):
// k=0 (grid[0][0]): p[0] = (prefix_prod[0] * suffix_prod[1]) % MOD = (1 * 24) % MOD = 24
// k=1 (grid[0][1]): p[1] = (prefix_prod[1] * suffix_prod[2]) % MOD = (1 * 12) % MOD = 12
// k=2 (grid[1][0]): p[2] = (prefix_prod[2] * suffix_prod[3]) % MOD = (2 * 4) % MOD = 8
// k=3 (grid[1][1]): p[3] = (prefix_prod[3] * suffix_prod[4]) % MOD = (6 * 1) % MOD = 6
//
// Flattened result: [24, 12, 8, 6]
// Unflattened result: [[24, 12], [8, 6]] - Correct.
//
// Example 2: grid = [[12345],[2],[1]]
// n=3, m=1, N*M=3
// flat_grid = [12345, 2, 1]
// MOD = 12345
// zero_count = 0. Wait, 12345 % 12345 = 0.
//
// Let's recheck: grid[i][j] are up to 10^9.
// Example 2: grid = [[12345],[2],[1]]
// The input is actually `[[12345], [2], [1]]`. This implies a 3x1 matrix.
// So, grid[0][0] = 12345, grid[1][0] = 2, grid[2][0] = 1.
//
// flat_grid = [12345, 2, 1]
// MOD = 12345
//
// Check for zeros:
// 12345 % 12345 = 0. So, grid[0][0] is effectively 0 modulo MOD.
// Let's call numbers that are 0 modulo MOD as "modular zeros".
//
// When `grid[i][j]` is a multiple of MOD, it's like having a zero in terms of modular arithmetic.
//
// Let's re-evaluate Example 2 with this understanding:
// grid = [[12345],[2],[1]]
// n=3, m=1
//
// Elements modulo 12345: [0, 2, 1]
//
// Case: zero_count (modular zeros) = 1 (at index 0).
//
// The single "modular zero" is at index 0 (grid[0][0] = 12345).
// The product of all elements *except* the first one is (2 * 1) % 12345 = 2.
// So, p[0][0] should be 2.
//
// For any other element, its product will include grid[0][0] (which is 0 mod 12345).
// So, p[1][0] should be 0, and p[2][0] should be 0.
//
// Output: [[2], [0], [0]] - Matches example.
//
// So, the handling of zeros needs to consider values that are `X % MOD == 0`.
//
// Let's adjust the logic. We can't just count zeros. We need to count numbers that are `grid[i][j] % MOD == 0`.
//
// The problem states: "Each element p[i][j] is calculated as the product of all elements in grid except for the element grid[i][j]. This product is then taken modulo 12345."
// This implies the intermediate product is calculated normally, and ONLY the FINAL result for p[i][j] is taken modulo 12345.
//
// Let's re-read carefully. "This product is then taken modulo 12345."
// This phrasing is ambiguous. It *could* mean:
// 1. Calculate total product, then p[i][j] = (total_product / grid[i][j]) % MOD
// 2. For each p[i][j], calculate product of all others, then p[i][j] = (product_of_others) % MOD
//
// Example 1: [[1,2],[3,4]] -> [[24,12],[8,6]]
// Total product = 1*2*3*4 = 24.
// p[0][0] = (2*3*4) % 12345 = 24.
// This suggests we calculate the full product of others and THEN take modulo.
//
// If there are zeros in `grid`, the total product of all elements in `grid` will be 0.
//
// Let's consider the definition of modulo: `a % n` is the remainder when `a` is divided by `n`.
//
// If `grid` contains `0`:
// Total product of all elements is `0`.
// For `p[i][j]` where `grid[i][j] != 0`: The product of others will contain the `0`, so `p[i][j] = 0 % 12345 = 0`.
// For `p[i][j]` where `grid[i][j] == 0`: The product of others is the product of all non-zero elements.
//
// If `grid` contains multiple `0`s:
// For any `p[i][j]`, the product of others will contain at least one `0`, so `p[i][j] = 0 % 12345 = 0`.
//
// If `grid` contains exactly one `0` at `grid[zero_r][zero_c]`:
// For `(i, j) != (zero_r, zero_c)`, `p[i][j] = 0`.
// For `p[zero_r][zero_c]`, it's the product of all non-zero elements. Let this product be `P_nonzero`. Then `p[zero_r][zero_c] = P_nonzero % 12345`.
//
// If `grid` contains no `0`s:
// We need to calculate `product_of_others = (total_product / grid[i][j])`.
// This requires modular inverse if we are working purely in modular arithmetic.
// However, the problem implies the intermediate product is calculated *before* modulo.
//
// Let's assume the intermediate product can grow very large, but fits within `long long`.
// If `n*m` is up to `10^5` and values are up to `10^9`, the total product can be HUGE, exceeding `long long`.
// This means we MUST use modular arithmetic at each multiplication step.
//
// "This product is then taken modulo 12345." This implies the final value `p[i][j]` is the result of `(product_of_others) % 12345`.
//
// The prefix/suffix sum approach using modulo at each step is standard for this type of problem when the total product can overflow.
//
// The issue with "modular zeros" like 12345 % 12345 = 0 is:
// If `grid[i][j] = 12345`, does it behave like `0` in the product?
// The problem statement says `grid[i][j] <= 10^9`. It does NOT say `grid[i][j] < 12345`.
//
// So, if `grid[i][j] = 12345`, `grid[i][j] % 12345 = 0`.
// If we have `grid = [[12345, 2], [3, 4]]`
// The elements modulo 12345 are: `[0, 2, 3, 4]`.
// There is one "modular zero" at index [0][0].
//
// Product of others for p[0][0]: (2 * 3 * 4) % 12345 = 24.
//
// Product of others for p[0][1] (grid[0][1]=2): (12345 * 3 * 4) % 12345.
// Since 12345 is a factor, the product is 0. So, p[0][1] = 0.
// Similarly, p[1][0] = (12345 * 2 * 4) % 12345 = 0.
// And p[1][1] = (12345 * 2 * 3) % 12345 = 0.
//
// So, if any element in `grid` is a multiple of 12345, it acts like a zero in the final modular product.
//
// The prefix/suffix product approach with modulo at each step is the correct way.
//
// Let MOD = 12345.
//
// Revised Algorithm with "modular zeros":
// 1. Get dimensions n and m.
// 2. Create a flattened list `flat_grid_mod` where `flat_grid_mod[k] = flat_grid[k] % MOD`.
// 3. Count `modular_zero_count` and store the index `modular_zero_idx` of the first such element.
// 4. If `modular_zero_count > 1`:
//    Return a matrix of all zeros.
// 5. If `modular_zero_count == 1`:
//    a. Calculate `product_of_others_mod` = product of all elements in `flat_grid_mod` that are NOT at `modular_zero_idx`, modulo MOD.
//    b. Create the result matrix `p` of size n*m, initialized with zeros.
//    c. Set `p[modular_zero_idx_row][modular_zero_idx_col] = product_of_others_mod`.
//    d. Return `p`.
// 6. If `modular_zero_count == 0`:
//    a. Create `prefix_prod` array of size `N*M + 1`. `prefix_prod[0] = 1`.
//    b. For `k` from 0 to `N*M - 1`: `prefix_prod[k+1] = (prefix_prod[k] * flat_grid_mod[k]) % MOD`.
//    c. Create `suffix_prod` array of size `N*M + 1`. `suffix_prod[N*M] = 1`.
//    d. For `k` from `N*M - 1` down to 0: `suffix_prod[k] = (suffix_prod[k+1] * flat_grid_mod[k]) % MOD`.
//    e. Create the result matrix `p` of size n*m.
//    f. For `k` from 0 to `N*M - 1`:
//       `p[k_row][k_col] = (prefix_prod[k] * suffix_prod[k+1]) % MOD`.
//    g. Return `p`.
//
// This approach seems correct. We need to map the 1D index `k` back to 2D `(i, j)`.
// `i = k / m`, `j = k % m`.
//
// Let's implement this using the prefix/suffix product arrays on a flattened view.
// This avoids the complexity of handling indices during the 2-pass in-place update.
//
// Constraints: `2 <= n * m <= 10^5`. This suggests `n` or `m` can be up to `10^5`, meaning `N*M` is manageable.
//
// Data structures needed:
// `grid`: `vector<vector<int>>`
// `flat_grid_mod`: `vector<int>` of size `n*m`
// `prefix_prod`: `vector<long long>` of size `n*m + 1`
// `suffix_prod`: `vector<long long>` of size `n*m + 1`
// `p`: `vector<vector<int>>` of size `n*m`

class Solution {
public:
    std::vector<std::vector<int>> constructProductMatrix(std::vector<std::vector<int>>& grid) {
        int n = grid.size();
        int m = grid[0].size();
        long long MOD = 12345;
        int total_elements = n * m;

        // Flatten the grid and take modulo at each element.
        // Store elements that are 0 modulo MOD.
        std::vector<int> flat_grid_mod(total_elements);
        int modular_zero_count = 0;
        int modular_zero_idx = -1; // Stores the 1D index of the first modular zero

        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < m; ++j) {
                int current_val = grid[i][j];
                int flat_idx = i * m + j;
                
                if (current_val % MOD == 0) {
                    flat_grid_mod[flat_idx] = 0; // Store 0 if it's a modular zero
                    modular_zero_count++;
                    if (modular_zero_idx == -1) {
                        modular_zero_idx = flat_idx;
                    }
                } else {
                    flat_grid_mod[flat_idx] = current_val % MOD;
                }
            }
        }

        // Result matrix initialization
        std::vector<std::vector<int>> p(n, std::vector<int>(m));

        // Case 1: More than one modular zero
        if (modular_zero_count > 1) {
            // All elements in the result matrix will be 0
            for (int i = 0; i < n; ++i) {
                for (int j = 0; j < m; ++j) {
                    p[i][j] = 0;
                }
            }
            return p;
        }

        // Case 2: Exactly one modular zero
        if (modular_zero_count == 1) {
            // Calculate the product of all elements EXCEPT the modular zero.
            long long product_of_others_mod = 1;
            for (int i = 0; i < total_elements; ++i) {
                if (i != modular_zero_idx) {
                    product_of_others_mod = (product_of_others_mod * flat_grid_mod[i]) % MOD;
                }
            }

            // All elements in the result matrix are 0, except for the one at the modular zero's position.
            for (int i = 0; i < n; ++i) {
                for (int j = 0; j < m; ++j) {
                    p[i][j] = 0;
                }
            }
            // Calculate the 2D indices for the modular zero
            int zero_r = modular_zero_idx / m;
            int zero_c = modular_zero_idx % m;
            p[zero_r][zero_c] = product_of_others_mod;
            return p;
        }

        // Case 3: No modular zeros
        // Use prefix and suffix products.
        std::vector<long long> prefix_prod(total_elements + 1, 1);
        std::vector<long long> suffix_prod(total_elements + 1, 1);

        // Calculate prefix products
        for (int i = 0; i < total_elements; ++i) {
            prefix_prod[i + 1] = (prefix_prod[i] * flat_grid_mod[i]) % MOD;
        }

        // Calculate suffix products
        for (int i = total_elements - 1; i >= 0; --i) {
            suffix_prod[i] = (suffix_prod[i + 1] * flat_grid_mod[i]) % MOD;
        }

        // Construct the product matrix
        for (int i = 0; i < total_elements; ++i) {
            // For element at index 'i', the product of others is:
            // (product of elements before 'i') * (product of elements after 'i')
            // prefix_prod[i] gives product of elements from index 0 up to i-1.
            // suffix_prod[i+1] gives product of elements from index i+1 up to total_elements-1.
            long long result_val = (prefix_prod[i] * suffix_prod[i + 1]) % MOD;
            
            // Map 1D index 'i' back to 2D (row, col)
            int row = i / m;
            int col = i % m;
            p[row][col] = result_val;
        }

        return p;
    }
};
```