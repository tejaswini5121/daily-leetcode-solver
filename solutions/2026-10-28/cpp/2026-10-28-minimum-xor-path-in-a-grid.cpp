```cpp
// Problem: Minimum XOR Path in a Grid
// Link: https://leetcode.com/problems/minimum-xor-path-in-a-grid/
//
// Summary: Find the minimum XOR sum of a path from the top-left to the
// bottom-right cell of a grid, moving only right or down.
//
// Approach:
// This problem can be solved using dynamic programming. We need to keep
// track of all possible XOR sums that can reach a particular cell. Since
// the maximum value in the grid is 1023, which is less than 2^10, the
// maximum possible XOR sum will also be bounded (though a tighter bound exists,
// considering the path length, it's safer to consider the bitwise limits).
// A 2D DP array `dp[m][n]` where `dp[i][j]` stores a set of all possible
// XOR sums to reach cell `(i, j)`.
//
// For each cell `(i, j)`, the possible XOR sums can be derived from the cells
// above it (`dp[i-1][j]`) and to its left (`dp[i][j-1]`).
// Specifically, if `x` is an XOR sum in `dp[i-1][j]`, then `x ^ grid[i][j]` is
// a possible XOR sum for `dp[i][j]`. Similarly, if `y` is an XOR sum in
// `dp[i][j-1]`, then `y ^ grid[i][j]` is a possible XOR sum for `dp[i][j]`.
//
// The base case is `dp[0][0] = {grid[0][0]}`.
//
// After filling the DP table, the minimum value in `dp[m-1][n-1]` will be the answer.
//
// To optimize space, we can observe that to compute `dp[i][j]`, we only need
// values from row `i` and row `i-1`. We can further optimize this to use only
// two rows or even one row if we iterate carefully. However, given the constraint
// `m * n <= 1000`, and the fact that the number of distinct XOR sums can grow,
// using `std::set` for each cell might be acceptable if the number of distinct
// XOR sums per cell remains manageable.
//
// A more efficient DP state would be `dp[i][j]` representing the minimum XOR sum
// to reach cell `(i, j)`. However, this is incorrect because a path with a larger
// XOR sum at an intermediate cell might lead to a smaller XOR sum at the end.
// Therefore, we must store all possible XOR sums.
//
// Given the constraint `m*n <= 1000`, the total number of cells is at most 1000.
// The maximum value is 1023 (10 bits). The number of possible XOR sums to reach
// a cell could be up to 2^10 in the worst theoretical case if all possible
// combinations of paths yield distinct XOR values. However, due to the grid
// structure and only moving right/down, the number of paths to reach `(i, j)`
// is `(i+j) choose i`. The number of *distinct* XOR sums is more complex to bound.
// Let's consider the maximum possible XOR sum. If all grid values were 1023,
// the XOR sum could potentially reach values up to 1023. The actual limit on
// distinct XOR sums at any cell is likely much smaller than 2^10 in practice
// due to the structure of XOR operations.
//
// The constraint `m * n <= 1000` suggests that a solution with complexity
// related to `m * n * (number of states)` might pass. Using `std::set` for
// each cell leads to `O(m * n * S * log S)` where `S` is the maximum number
// of distinct XOR sums per cell. If `S` is bounded by `K` (e.g., 1024), then
// the complexity becomes `O(m * n * K * log K)`.
//
// We can optimize the DP state. Instead of `dp[i][j]` storing a `set<int>`,
// we can use `dp[i][j]` to store a `vector<int>` of possible XOR sums and sort it
// to avoid duplicates and potentially prune if the size exceeds a limit (though pruning
// might be tricky for XOR sums).
//
// A better DP state might be `dp[i][j]` which is a `bitset` of size 1024.
// `dp[i][j][k] = true` if XOR sum `k` is achievable at cell `(i, j)`.
//
// Using `std::bitset<1024>` for each cell:
// `dp[i][j]` will be a `bitset<1024>`.
// To compute `dp[i][j]`:
// If `i > 0`, `dp[i][j] |= (dp[i-1][j] << grid[i][j])`. This is incorrect for XOR.
// For XOR, if `k` is a possible XOR sum to `(i-1, j)`, then `k ^ grid[i][j]`
// is a possible XOR sum to `(i, j)`.
//
// Correct DP with bitsets:
// `dp[i][j]` stores a `bitset<1024>` where the k-th bit is set if XOR sum `k`
// is achievable at cell `(i, j)`.
//
// For cell `(i, j)`:
// Initialize `dp[i][j]` to all zeros.
//
// If `i > 0`:
//   For each bit `k` set in `dp[i-1][j]`:
//     Set the bit `k ^ grid[i][j]` in `dp[i][j]`.
//
// If `j > 0`:
//   For each bit `k` set in `dp[i][j-1]`:
//     Set the bit `k ^ grid[i][j]` in `dp[i][j]`.
//
// Base case: `dp[0][0][grid[0][0]] = 1`.
//
// We can optimize space by using only two rows (current and previous) or one row.
// Using one row `dp[n]` where `dp[j]` stores the bitset for the current cell `(i, j)`.
// When moving to the next row, `dp` will represent the previous row.
//
// Let `dp[j]` be the bitset for cell `(i, j)` in the current row `i`.
// Let `prev_dp[j]` be the bitset for cell `(i-1, j)`.
//
// For row `i`:
//   `dp[0]` (cell `(i, 0)`):
//     `dp[0] = prev_dp[0]`.
//     For each bit `k` set in `dp[0]`: set bit `k ^ grid[i][0]` in `dp[0]`.
//
//   For `j` from 1 to `n-1` (cell `(i, j)`):
//     `dp[j] = prev_dp[j]`. // Initialize with paths from above
//     For each bit `k` set in `dp[j]`: set bit `k ^ grid[i][j]` in `dp[j]`.
//
//     `temp_dp_left = dp[j-1]`. // Paths from left (already processed for row i)
//     For each bit `k` set in `temp_dp_left`: set bit `k ^ grid[i][j]` in `dp[j]`.
//
// This needs careful handling of the current `dp[j]` and `dp[j-1]` values.
//
// Let's use a `dp[n]` where `dp[j]` is the bitset for cell `(i, j)`.
//
// Initialize `dp` array of size `n` with empty bitsets.
//
// For row `i = 0`:
//   `dp[0][grid[0][0]] = 1`.
//   For `j = 1` to `n-1`:
//     `dp[j] = dp[j-1]`.
//     For `k` from 0 to 1023:
//       if `dp[j][k]`: `dp[j][k ^ grid[0][j]] = 1`.
//
// For row `i` from 1 to `m-1`:
//   // First cell in the current row (i, 0)
//   `dp[0] = dp[0]`. // Paths from (i-1, 0)
//   For `k` from 0 to 1023:
//     if `dp[0][k]`: `dp[0][k ^ grid[i][0]] = 1`.
//
//   // Other cells in the current row (i, j) for j from 1 to n-1
//   For `j = 1` to `n-1`:
//     `dp[j] = dp[j] | dp[j-1]`. // Combine paths from above and from left
//     For `k` from 0 to 1023:
//       if `dp[j][k]`: `dp[j][k ^ grid[i][j]] = 1`.
//
// The `dp[j] = dp[j] | dp[j-1]` operation is problematic because `dp[j]` still holds
// the values from the previous row. We need to compute the new `dp[j]` based on
// the new `dp[j-1]` and the old `dp[j]`.
//
// Correct DP with one row of bitsets:
// Let `dp[j]` store the `bitset<1024>` for cell `(current_row, j)`.
//
// Initialize `dp` array of size `n` with empty bitsets.
//
// For `i = 0` to `m-1`:
//   For `j = 0` to `n-1`:
//     If `i == 0` and `j == 0`:
//       `dp[j][grid[i][j]] = 1`.
//     Else if `i == 0`: // First row, only comes from left
//       `dp[j] = dp[j-1]`.
//       For `k` from 0 to 1023:
//         if `dp[j][k]`: `dp[j][k ^ grid[i][j]] = 1`.
//     Else if `j == 0`: // First column, only comes from above
//       For `k` from 0 to 1023:
//         if `dp[j][k]`: `dp[j][k ^ grid[i][j]] = 1`.
//     Else: // General case, comes from above and left
//       `dp[j] = dp[j] | dp[j-1]`. // This bitset `dp[j]` still has values from previous row.
//                                // This `dp[j-1]` is from the current row.
//       // We need to apply grid[i][j] to all possible XOR sums.
//       // Let's use a temporary bitset to apply the current grid value.
//       bitset<1024> temp_dp_from_above = dp[j]; // Values from (i-1, j)
//       bitset<1024> temp_dp_from_left = dp[j-1]; // Values from (i, j-1)
//
//       dp[j].reset(); // Clear dp[j] for current cell (i, j) calculation
//
//       for (int k = 0; k < 1024; ++k) {
//           if (temp_dp_from_above[k]) {
//               dp[j][k ^ grid[i][j]] = 1;
//           }
//           if (temp_dp_from_left[k]) {
//               dp[j][k ^ grid[i][j]] = 1;
//           }
//       }
//
// This approach is correct but might be slow due to iterating through 1024 bits
// for each cell.
//
// The maximum value of grid[i][j] is 1023. The maximum number of bits we need
// to consider is 10 (since 2^10 = 1024).
//
// Let's refine the one-row DP with bitsets:
// `dp[j]` stores the `bitset<1024>` for cell `(current_row, j)`.
//
// Initialize `dp` array of size `n` with empty bitsets.
//
// For `i = 0` to `m-1`:
//   For `j = 0` to `n-1`:
//     if `i == 0` and `j == 0`:
//       `dp[j][grid[i][j]] = 1;`
//     else if `i == 0`: // First row, coming only from left
//       // `dp[j]` should be computed from `dp[j-1]`
//       `dp[j] = dp[j-1];`
//       // Apply XOR for the current cell value
//       for (int k = 0; k < 1024; ++k) {
//         if (dp[j][k]) {
//           dp[j][k ^ grid[i][j]] = 1;
//         }
//       }
//     else if `j == 0`: // First column, coming only from above
//       // `dp[j]` (representing cell `(i, 0)`) should be updated based on its previous state
//       // which implicitly stores paths from `(i-1, 0)`.
//       // The existing `dp[j]` contains the XOR sums for cell `(i-1, 0)`.
//       // We need to XOR `grid[i][0]` to all these sums.
//       for (int k = 0; k < 1024; ++k) {
//         if (dp[j][k]) {
//           dp[j][k ^ grid[i][j]] = 1;
//         }
//       }
//     else: // General case: comes from `(i-1, j)` and `(i, j-1)`
//       // We need to combine the possibilities from `dp[j]` (paths from above, already computed for row `i-1`)
//       // and `dp[j-1]` (paths from left, already computed for row `i`).
//       bitset<1024> temp_from_above = dp[j]; // Values from (i-1, j)
//       bitset<1024> temp_from_left = dp[j-1]; // Values from (i, j-1)
//
//       dp[j].reset(); // Reset `dp[j]` to calculate for cell `(i, j)`
//
//       // Combine and apply XOR for grid[i][j]
//       for (int k = 0; k < 1024; ++k) {
//         if (temp_from_above[k]) {
//           dp[j][k ^ grid[i][j]] = 1;
//         }
//         if (temp_from_left[k]) {
//           dp[j][k ^ grid[i][j]] = 1;
//         }
//       }
//
// After the loops, find the smallest `k` such that `dp[n-1][k]` is true.
//
// Time Complexity:
// O(m * n * B * B) where B is the number of bits (1024 in this case) if we iterate through bits.
// However, bitset operations are often optimized. `dp[j] = dp[j] | dp[j-1]` takes O(B/W) where W is machine word size.
// The loop for `k` to apply `grid[i][j]` is O(B).
// Total: `O(m * n * B)` if bitset operations are efficient (e.g., word-wise).
// Given `B=1024`, this is `O(m * n * 1024)`. Since `m*n <= 1000`, this is `1000 * 1024`, which is about 10^6 operations per bitset OR, plus XORing.
// For the XORing step: `for (int k = 0; k < 1024; ++k)`
// `dp[j][k ^ grid[i][j]] = 1;`
// This inner loop iterates 1024 times.
// The overall complexity is `O(m * n * 1024)`. This should be acceptable.
//
// Space Complexity:
// O(n * B) where B is the number of bits (1024) for the `dp` array.
// This is `O(n * 1024)`. Since `n <= 1000`, this is `1000 * 1024` bits, which is about 128 KB. This is acceptable.
//
// Important Note: Maximum grid value is 1023. So bitset size 1024 is correct.
// Max path length: m + n - 2 steps.
// Total cells in a path: m + n - 1.
//
// Let's refine the DP transition for the general case.
// For cell `(i, j)`:
// The possible XOR sums are formed by:
// 1. Taking an XOR sum `x` from cell `(i-1, j)` and XORing it with `grid[i][j]`.
// 2. Taking an XOR sum `y` from cell `(i, j-1)` and XORing it with `grid[i][j]`.
//
// So, `dp[i][j]` should contain ` { x ^ grid[i][j] | x in dp[i-1][j] } U { y ^ grid[i][j] | y in dp[i][j-1] }`.
//
// With one row `dp[j]`:
// When processing `(i, j)`:
// `dp[j]` currently holds the possible XOR sums for `(i-1, j)`.
// `dp[j-1]` currently holds the possible XOR sums for `(i, j-1)`.
//
// We need to compute the new `dp[j]` for cell `(i, j)`.
//
// Let `current_row_dp[j]` be the bitset for cell `(i, j)`.
// Let `previous_row_dp[j]` be the bitset for cell `(i-1, j)`.
//
// When computing row `i`:
// `current_row_dp[0]` is derived from `previous_row_dp[0]` XORed with `grid[i][0]`.
// `current_row_dp[j]` (for j > 0) is derived from `previous_row_dp[j]` and `current_row_dp[j-1]`, both XORed with `grid[i][j]`.
//
// We can use a single `dp` array of size `n`, where `dp[j]` represents the state for cell `(current_row, j)`.
//
// For `i = 0` to `m-1`:
//   For `j = 0` to `n-1`:
//     `int current_val = grid[i][j];`
//     if `i == 0` and `j == 0`:
//       `dp[j][current_val] = 1;`
//     else if `i == 0`: // First row, only from left
//       // `dp[j-1]` is for `(0, j-1)`
//       // `dp[j]` currently holds state for `(0, j)` from a previous iteration (which is empty)
//       // We need to compute `dp[j]` from `dp[j-1]`
//       `dp[j] = dp[j-1];` // Copy possible XOR sums from left cell
//       for (int k = 0; k < 1024; ++k) {
//         if (dp[j][k]) {
//           dp[j][k ^ current_val] = 1;
//         }
//       }
//     else if `j == 0`: // First column, only from above
//       // `dp[j]` currently holds state for `(i-1, 0)`
//       // We need to update `dp[j]` to include `grid[i][0]`
//       for (int k = 0; k < 1024; ++k) {
//         if (dp[j][k]) {
//           dp[j][k ^ current_val] = 1;
//         }
//       }
//     else: // General case
//       // We need to combine possibilities from `dp[j]` (which represents `(i-1, j)`)
//       // and `dp[j-1]` (which represents `(i, j-1)`).
//       bitset<1024> from_above_xor_val;
//       for (int k = 0; k < 1024; ++k) {
//         if (dp[j][k]) { // dp[j] has states from (i-1, j)
//           from_above_xor_val[k ^ current_val] = 1;
//         }
//       }
//
//       bitset<1024> from_left_xor_val;
//       for (int k = 0; k < 1024; ++k) {
//         if (dp[j-1][k]) { // dp[j-1] has states from (i, j-1)
//           from_left_xor_val[k ^ current_val] = 1;
//         }
//       }
//
//       dp[j] = from_above_xor_val | from_left_xor_val;
//
// This seems correct and uses the bitset operations efficiently.
// The `for (int k = 0; k < 1024; ++k)` loop is essentially applying the XOR to the bitset.
// Let's see if we can optimize the application of XOR.
//
// `dp[j].apply_xor(grid[i][j])` would be ideal, but bitset doesn't have such a method.
// We can implement a helper function for XORing a bitset with a value.
//
// Helper function `apply_xor(bitset<1024>& bs, int val)`:
//   bitset<1024> result;
//   for (int i = 0; i < 1024; ++i) {
//     if (bs[i]) {
//       result[i ^ val] = 1;
//     }
//   }
//   bs = result;
//
// So the general case becomes:
//     `bitset<1024> temp_above = dp[j];`
//     `bitset<1024> temp_left = dp[j-1];`
//     `apply_xor(temp_above, current_val);`
//     `apply_xor(temp_left, current_val);`
//     `dp[j] = temp_above | temp_left;`
//
// Time complexity with `apply_xor`: `O(m * n * B)`. This is fine.
//
// Final check on constraints and logic:
// `m, n <= 1000`, `m*n <= 1000`.
// This means either `m` or `n` or both are relatively small.
// e.g., `m=1, n=1000` or `m=31, n=32` or `m=1000, n=1`.
// The DP approach with `O(m * n * 1024)` time and `O(n * 1024)` space works.
//
// Example 1: grid = [[1,2],[3,4]]
// m=2, n=2
// dp array of size 2.
//
// i = 0:
//   j = 0: grid[0][0] = 1
//     dp[0][1] = 1.  dp = [{...1...}, {}]
//   j = 1: grid[0][1] = 2
//     i=0, j>0: dp[1] = dp[0] (copy states {1})
//     apply_xor(dp[1], 2): {1^2} = {3}.
//     dp[1][3] = 1. dp = [{...1...}, {...3...}]
//
// i = 1:
//   j = 0: grid[1][0] = 3
//     j=0, i>0: dp[0] has states from (0,0) which is {1}.
//     apply_xor(dp[0], 3): {1^3} = {2}.
//     dp[0][2] = 1. dp = [{...2...}, {...3...}] (dp[1] still holds state for (0,1))
//   j = 1: grid[1][1] = 4
//     i>0, j>0:
//     temp_above = dp[1] (state from (0,1) -> {3})
//     temp_left = dp[0] (state from (1,0) -> {2})
//     current_val = 4
//
//     apply_xor(temp_above, 4): {3^4} = {7}. temp_above_xor_val = {7}
//     apply_xor(temp_left, 4): {2^4} = {6}. temp_left_xor_val = {6}
//
//     dp[1] = temp_above_xor_val | temp_left_xor_val = {7} | {6} = {6, 7}
//     dp[1][6] = 1, dp[1][7] = 1.
//
// Final dp = [{...2...}, {...6..., ...7...}]
// Target cell (1, 1) is dp[1]. Smallest k with dp[1][k] true is k=6.
// Output: 6. Correct for Example 1.
//
// Let's consider the apply_xor helper function:
// We can iterate through the bits of the bitset and form a new bitset.
//
// `bitset<1024> apply_xor(const bitset<1024>& bs, int val)`:
//   bitset<1024> result;
//   for (int i = 0; i < 1024; ++i) {
//     if (bs[i]) {
//       result[i ^ val] = 1;
//     }
//   }
//   return result;
//
// Main loop:
// For `i = 0` to `m-1`:
//   For `j = 0` to `n-1`:
//     `int current_val = grid[i][j];`
//     if `i == 0` and `j == 0`:
//       `dp[j][current_val] = 1;`
//     else if `i == 0`: // First row, only from left
//       `dp[j] = apply_xor(dp[j-1], current_val);`
//     else if `j == 0`: // First column, only from above
//       `dp[j] = apply_xor(dp[j], current_val);` // dp[j] here is the state from (i-1, j)
//     else: // General case
//       `bitset<1024> from_above = dp[j];` // States from (i-1, j)
//       `bitset<1024> from_left = dp[j-1];` // States from (i, j-1)
//
//       `bitset<1024> combined_xor_vals = apply_xor(from_above, current_val) | apply_xor(from_left, current_val);`
//       `dp[j] = combined_xor_vals;`
//
// This looks solid.
//
// Need to include necessary headers:
// `<vector>` for `grid`
// `<bitset>` for `bitset`
// `<iostream>` for basic I/O if needed for debugging (not for final submission)
// `<algorithm>` for `min` if we were doing min DP, but not needed here.
//
// Function signature: `int minimumXORPath(vector<vector<int>>& grid)`
//
// Final check of `m*n <= 1000`. This is a strong constraint.
// If `m=1000, n=1`, space is `O(1 * 1024)`.
// If `m=1, n=1000`, space is `O(1000 * 1024)`.
// Time: `O(m*n*1024)` in all cases.
//
// Example 2: grid = [[6,7],[5,8]]
// m=2, n=2
// dp array size 2.
//
// i = 0:
//   j = 0: grid[0][0] = 6
//     dp[0][6] = 1. dp = [{...6...}, {}]
//   j = 1: grid[0][1] = 7
//     i=0, j>0: dp[1] = apply_xor(dp[0], 7)
//     dp[0] has {6}.
//     apply_xor({6}, 7) -> {6^7} = {1}.
//     dp[1][1] = 1. dp = [{...6...}, {...1...}]
//
// i = 1:
//   j = 0: grid[1][0] = 5
//     j=0, i>0: dp[0] has {6}.
//     dp[0] = apply_xor(dp[0], 5)
//     apply_xor({6}, 5) -> {6^5} = {3}.
//     dp[0][3] = 1. dp = [{...3...}, {...1...}] (dp[1] still holds state for (0,1))
//   j = 1: grid[1][1] = 8
//     i>0, j>0:
//     from_above = dp[1] (state from (0,1) -> {1})
//     from_left = dp[0] (state from (1,0) -> {3})
//     current_val = 8
//
//     apply_xor(from_above, 8): {1^8} = {9}. -> from_above_xor_val = {9}
//     apply_xor(from_left, 8): {3^8} = {11}. -> from_left_xor_val = {11}
//
//     dp[1] = {9} | {11} = {9, 11}.
//     dp[1][9] = 1, dp[1][11] = 1.
//
// Final dp = [{...3...}, {...9..., ...11...}]
// Target cell (1, 1) is dp[1]. Smallest k with dp[1][k] true is k=9.
// Output: 9. Correct for Example 2.
//
// Example 3: grid = [[2,7,5]]
// m=1, n=3
// dp array size 3.
//
// i = 0:
//   j = 0: grid[0][0] = 2
//     dp[0][2] = 1. dp = [{...2...}, {}, {}]
//   j = 1: grid[0][1] = 7
//     i=0, j>0: dp[1] = apply_xor(dp[0], 7)
//     dp[0] has {2}. apply_xor({2}, 7) -> {2^7} = {5}.
//     dp[1][5] = 1. dp = [{...2...}, {...5...}, {}]
//   j = 2: grid[0][2] = 5
//     i=0, j>0: dp[2] = apply_xor(dp[1], 5)
//     dp[1] has {5}. apply_xor({5}, 5) -> {5^5} = {0}.
//     dp[2][0] = 1. dp = [{...2...}, {...5...}, {...0...}]
//
// Final dp = [{...2...}, {...5...}, {...0...}]
// Target cell (0, 2) is dp[2]. Smallest k with dp[2][k] true is k=0.
// Output: 0. Correct for Example 3.
//
// The logic seems sound and passes examples.
//
// The constraint `m*n <= 1000` is key. This means the number of cells is small.
// The approach is essentially a breadth-first search on states (XOR sums) on the grid,
// but implemented with DP and bitsets for efficiency.
//
// One edge case to consider: what if the grid is 1x1?
// grid = [[5]]
// m=1, n=1
// dp array size 1.
// i=0, j=0: grid[0][0]=5. dp[0][5]=1.
// Target cell (0,0) is dp[0]. Smallest k is 5. Correct.
//
// The problem statement guarantees `1 <= m, n`.
//
// The bitset size 1024 is sufficient because `0 <= grid[i][j] <= 1023`.
// The maximum possible XOR sum of numbers up to 1023 will not exceed 1023.
// This is because XORing numbers up to 1023 (which are 10-bit numbers) will
// result in a number that also fits within 10 bits (i.e., < 1024).
//
// The `apply_xor` function:
// `bitset<1024> result;`
// `for (int i = 0; i < 1024; ++i)`
//   `if (bs[i]) { result[i ^ val] = 1; }`
//
// This function has a time complexity of O(B) where B=1024.
//
// The main loop:
// Outer loops `m` and `n` iterations.
// Inside, `apply_xor` is called at most twice.
// `bitset` OR operation takes `O(B/W)` where W is word size (typically 64).
// Total time complexity `O(m * n * (B + B/W)) = O(m * n * B)`.
//
// The bitset OR operation `|` can be considered effectively constant time for typical
// bitset sizes that fit within a few machine words, but for `B=1024`, it's `1024/64 = 16` words.
// So `O(m * n * B)` is accurate if we consider the loop for XORing.
//
// Space complexity: `O(n * B)` for the DP array.
//
// This solution seems optimal given the problem constraints and the nature of XOR.
//
// Final check of the problem statement for any missed details.
// "You start at the top-left cell (0, 0) and want to reach the bottom-right cell (m - 1, n - 1)."
// "At each step, you may move either right or down."
// "The cost of a path is defined as the bitwise XOR of all the values in the cells along that path, including the start and end cells."
// "Return the minimum possible XOR value among all valid paths..."
//
// All aspects covered.
//
// The approach of using `std::vector<std::bitset<1024>> dp(n);` is correct.
//
// When `i == 0` and `j > 0`: `dp[j] = apply_xor(dp[j-1], current_val);`
// This is correct because `dp[j-1]` has the XOR sums to reach `(0, j-1)`.
// XORing each of those with `grid[0][j]` gives the XOR sums to reach `(0, j)`.
//
// When `j == 0` and `i > 0`: `dp[j] = apply_xor(dp[j], current_val);`
// This is correct because `dp[j]` (which is `dp[0]`) currently holds the XOR sums
// to reach `(i-1, 0)`. XORing each of those with `grid[i][0]` gives the XOR sums
// to reach `(i, 0)`.
//
// When `i > 0` and `j > 0`:
// `bitset<1024> from_above = dp[j];` // holds states for (i-1, j)
// `bitset<1024> from_left = dp[j-1];` // holds states for (i, j-1)
// `bitset<1024> combined_xor_vals = apply_xor(from_above, current_val) | apply_xor(from_left, current_val);`
// `dp[j] = combined_xor_vals;`
// This is correct. We take all achievable XOR sums from `(i-1, j)`, XOR them with `grid[i][j]`.
// We take all achievable XOR sums from `(i, j-1)`, XOR them with `grid[i][j]`.
// The union of these two sets of results are the achievable XOR sums for `(i, j)`.
// The `|` operator correctly computes the union for bitsets.
//
// Finally, we need to iterate through the final `dp[n-1]` bitset to find the minimum set bit.
//
// `for (int k = 0; k < 1024; ++k) { if (dp[n-1][k]) return k; }`
//
// This assumes there will always be at least one path, which is true by problem definition.
//
// The solution looks robust.
```cpp
#include <vector>
#include <bitset>
#include <algorithm> // For std::min, though not directly used in the final DP logic, useful for understanding problem type.

// Helper function to apply XOR operation to a bitset with an integer value.
// It iterates through each bit set in `bs` and sets the corresponding bit
// `i ^ val` in the `result` bitset.
static std::bitset<1024> apply_xor(const std::bitset<1024>& bs, int val) {
    std::bitset<1024> result;
    for (int i = 0; i < 1024; ++i) {
        if (bs[i]) { // If the i-th bit is set in the input bitset
            result[i ^ val] = 1; // Set the (i XOR val)-th bit in the result
        }
    }
    return result;
}

class Solution {
public:
    // Problem: Minimum XOR Path in a Grid
    // Link: https://leetcode.com/problems/minimum-xor-path-in-a-grid/
    //
    // Summary: Find the minimum XOR sum of a path from the top-left to the
    // bottom-right cell of a grid, moving only right or down.
    //
    // Approach:
    // This problem is solved using dynamic programming with bitsets.
    // We use a 1D DP array `dp` of size `n`, where `dp[j]` stores a bitset
    // representing all possible XOR sums to reach the cell `(current_row, j)`.
    // The bitset has a size of 1024, as the maximum value in the grid is 1023.
    //
    // The DP state transition is as follows:
    // For each cell `(i, j)`:
    // The possible XOR sums to reach `(i, j)` are derived from two sources:
    // 1. Paths from the cell above: `(i-1, j)`. If `x` is a possible XOR sum to `(i-1, j)`,
    //    then `x ^ grid[i][j]` is a possible XOR sum to `(i, j)`.
    // 2. Paths from the cell to the left: `(i, j-1)`. If `y` is a possible XOR sum to `(i, j-1)`,
    //    then `y ^ grid[i][j]` is a possible XOR sum to `(i, j)`.
    //
    // We iterate through the grid row by row, and within each row, column by column.
    // `dp[j]` at the start of processing cell `(i, j)` holds the possible XOR sums for `(i-1, j)`.
    // `dp[j-1]` at the start of processing cell `(i, j)` holds the possible XOR sums for `(i, j-1)`.
    //
    // Base case: `dp[0][grid[0][0]] = 1` for the starting cell `(0, 0)`.
    //
    // For the first row (`i == 0`, `j > 0`): The cell `(0, j)` can only be reached from `(0, j-1)`.
    //   `dp[j]` is computed by taking `dp[j-1]` and applying XOR with `grid[0][j]`.
    //
    // For the first column (`j == 0`, `i > 0`): The cell `(i, 0)` can only be reached from `(i-1, 0)`.
    //   `dp[j]` (which is `dp[0]`) is updated by applying XOR with `grid[i][0]` to its existing states.
    //
    // For general cells (`i > 0`, `j > 0`):
    //   The possible XOR sums are the union of:
    //   - `apply_xor(dp[j], grid[i][j])` (from above, where `dp[j]` holds states for `(i-1, j)`)
    //   - `apply_xor(dp[j-1], grid[i][j])` (from left, where `dp[j-1]` holds states for `(i, j-1)`)
    //   We use the bitwise OR operator `|` on the resulting bitsets to combine these possibilities.
    //
    // After filling the DP table, the final row's last cell `dp[n-1]` will contain all possible
    // XOR sums to reach `(m-1, n-1)`. We then iterate through this bitset to find the smallest
    // index `k` that is set, which represents the minimum XOR path value.
    //
    // Time Complexity:
    // O(m * n * B), where `m` is the number of rows, `n` is the number of columns,
    // and `B` is the bitset size (1024). The `apply_xor` function takes O(B) time,
    // and the bitset OR operation takes O(B/W) time (where W is the word size of the machine, typically 64).
    // The dominant factor is the loop within `apply_xor`, making the total O(m * n * B).
    // Given m*n <= 1000 and B = 1024, this is approximately 1000 * 1024 operations, which is feasible.
    //
    // Space Complexity:
    // O(n * B), where `n` is the number of columns and `B` is the bitset size.
    // This is because we use a 1D DP array of size `n`, and each element is a bitset of size B.
    // For `n=1000` and `B=1024`, this is about 1000 * 1024 bits, which is roughly 128 KB.
    int minimumXORPath(std::vector<std::vector<int>>& grid) {
        int m = grid.size();
        int n = grid[0].size();

        // dp[j] will store the bitset of possible XOR sums to reach cell (current_row, j).
        // We use a vector of bitsets for the DP table, optimized to O(n * B) space.
        std::vector<std::bitset<1024>> dp(n);

        // Iterate through each row of the grid.
        for (int i = 0; i < m; ++i) {
            // Iterate through each column of the grid.
            for (int j = 0; j < n; ++j) {
                int current_val = grid[i][j];

                // Base case: The starting cell (0, 0).
                if (i == 0 && j == 0) {
                    dp[j][current_val] = 1; // The only XOR sum is the value of the cell itself.
                }
                // First row, can only come from the left.
                else if (i == 0) {
                    // dp[j-1] contains XOR sums to reach (0, j-1).
                    // Apply XOR with the current cell's value grid[0][j].
                    dp[j] = apply_xor(dp[j - 1], current_val);
                }
                // First column, can only come from above.
                else if (j == 0) {
                    // dp[j] currently holds XOR sums to reach (i-1, 0).
                    // Apply XOR with the current cell's value grid[i][0].
                    dp[j] = apply_xor(dp[j], current_val);
                }
                // General case: can come from above (i-1, j) or from left (i, j-1).
                else {
                    // `dp[j]` currently holds XOR sums to reach (i-1, j).
                    // `dp[j-1]` holds XOR sums to reach (i, j-1).

                    // Calculate XOR sums from above and apply current cell's value.
                    std::bitset<1024> from_above_xor_val = apply_xor(dp[j], current_val);
                    // Calculate XOR sums from left and apply current cell's value.
                    std::bitset<1024> from_left_xor_val = apply_xor(dp[j - 1], current_val);

                    // Combine the possibilities from both directions using bitwise OR.
                    dp[j] = from_above_xor_val | from_left_xor_val;
                }
            }
        }

        // After filling the DP table, dp[n-1] contains all possible XOR sums for the
        // bottom-right cell (m-1, n-1).
        // We need to find the smallest index `k` in dp[n-1] that is set.
        for (int k = 0; k < 1024; ++k) {
            if (dp[n - 1][k]) {
                return k; // This is the minimum XOR path value.
            }
        }

        // This part should ideally not be reached given problem constraints (guaranteed paths).
        return -1; // Should not happen.
    }
};
```