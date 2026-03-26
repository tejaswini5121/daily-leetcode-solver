/**
 * @file LeetCode Problem: Equal Sum Grid Partition II
 * @summary Determines if a grid can be partitioned with at most one cell discount to achieve equal sums in both sections.
 * @link https://leetcode.com/problems/equal-sum-grid-partition-ii/
 *
 * Approach:
 * The problem asks if we can make one horizontal or vertical cut such that the two resulting sections have equal sums,
 * or can be made equal by discounting at most one cell in total from either section. The key constraint is that
 * the remaining section must be connected.
 *
 * We can iterate through all possible horizontal cuts and all possible vertical cuts.
 * For each cut, we calculate the sums of the two resulting sections.
 *
 * For a horizontal cut after row `r`:
 * The top section is `grid[0...r][0...n-1]`.
 * The bottom section is `grid[r+1...m-1][0...n-1]`.
 *
 * For a vertical cut after column `c`:
 * The left section is `grid[0...m-1][0...c]`.
 * The right section is `grid[0...m-1][c+1...n-1]`.
 *
 * To efficiently calculate sums, we can precompute prefix sums.
 * `rowSum[i]` will store the sum of the `i`-th row.
 * `colSum[j]` will store the sum of the `j`-th column.
 *
 * For horizontal cuts:
 * The sum of the top section after row `r` can be calculated as the sum of `rowSum[0]` to `rowSum[r]`.
 * The sum of the bottom section can be calculated as the total sum of the grid minus the sum of the top section.
 * Let `totalSum` be the sum of all elements in the grid.
 * `sumTop = sum(rowSum[0]...rowSum[r])`
 * `sumBottom = totalSum - sumTop`
 *
 * For vertical cuts:
 * The sum of the left section after column `c` can be calculated as the sum of `colSum[0]` to `colSum[c]`.
 * `sumLeft = sum(colSum[0]...colSum[c])`
 * `sumRight = totalSum - sumLeft`
 *
 * Now, for each cut, we check the conditions:
 * 1. `sumTop == sumBottom` (no discount needed)
 * 2. `abs(sumTop - sumBottom) == grid[i][j]` for some cell `(i, j)` in one of the sections,
 *    and if `sumTop > sumBottom`, then `sumTop - sumBottom` must be the value of a cell in the bottom section.
 *    If `sumBottom > sumTop`, then `sumBottom - sumTop` must be the value of a cell in the top section.
 *    AND the section from which the cell is discounted must remain connected.
 *
 * Connectivity Constraint:
 * The connectivity constraint is tricky. If we discount a cell, the remaining cells in that section must form a single connected component.
 *
 * For a horizontal cut:
 * If we discount a cell `grid[i][j]` from the bottom section (where `i > r`), the bottom section is `grid[r+1...m-1][0...n-1]`.
 * If `grid[i][j]` is discounted, and `i > r`, for the bottom section to remain connected, it must not be a "corner" cell that, when removed, splits the remaining subgrid.
 * Specifically, if `m > 2` and `n > 2`, removing a cell `grid[i][j]` where `i > r` from the bottom section will always keep it connected IF `i` is not the last row and `j` is not the first or last column of the original grid.
 * However, the problem states "the rest of the section must remain connected".
 *
 * Consider the case of a horizontal cut after row `r`. The bottom section is `grid[r+1...m-1][0...n-1]`.
 * If we need to discount a cell `grid[i][j]` from this bottom section (where `i > r`), the condition is that the remaining cells in `grid[r+1...m-1][0...n-1]` must be connected.
 * If `m - 1 - (r + 1) + 1` (number of rows in bottom section) is `1`, and `n` is greater than `1`, removing any single cell will keep it connected.
 * If `n` is `1`, and `m - 1 - (r + 1) + 1` is greater than `1`, removing any single cell will keep it connected.
 * The only problematic case is if the bottom section is a `2x2` subgrid (or larger) and we remove a cell that disconnects it.
 *
 * A simpler interpretation for connectivity after removing a single cell:
 * If a section has dimensions `H x W`:
 * - If `H=1` and `W=1`, removing the cell makes it empty (not allowed).
 * - If `H=1` and `W > 1`, removing any cell leaves a connected row.
 * - If `H > 1` and `W=1`, removing any cell leaves a connected column.
 * - If `H > 1` and `W > 1`, removing a cell `grid[i][j]` from this section leaves it connected *unless* that cell is essential for connecting two otherwise separate parts.
 *
 * For a horizontal cut after row `r`:
 * Bottom section is `grid[r+1 ... m-1][0 ... n-1]`. Its dimensions are `(m - 1 - r) x n`.
 * If we need to discount `grid[i][j]` where `i > r`:
 *   The remaining cells form a connected component if:
 *   - `(m - 1 - r) == 1` (only one row in the bottom section), or
 *   - `n == 1` (only one column in the bottom section), or
 *   - `(m - 1 - r) > 1` AND `n > 1`. In this case, removing any single cell will NOT disconnect the rectangle UNLESS the section itself is very small and the removed cell is the only connection.
 *   Actually, if the section has dimensions `H x W` and we remove ONE cell:
 *   If `H = 1` or `W = 1`, it's always connected.
 *   If `H > 1` and `W > 1`, removing a single cell will *always* leave the remaining `H*W - 1` cells connected. This is because a rectangle is a highly connected structure. You can always find a path between any two remaining cells.
 *
 * The problem statement "If a cell is discounted, the rest of the section must remain connected." is crucial.
 *
 * Let's re-evaluate the connectivity for a section of size `H x W`.
 * - If `H=1, W=1`: removing the cell results in an empty section. This is not allowed as sections must be non-empty.
 * - If `H=1, W>1`: Removing any cell leaves a connected line segment.
 * - If `H>1, W=1`: Removing any cell leaves a connected line segment.
 * - If `H>1, W>1`: Removing *any single cell* from a rectangular subgrid will *always* leave the remaining cells connected. Imagine the grid cells as nodes in a graph; they form a grid graph. Removing a single vertex from a grid graph (where the grid is larger than 1x1) leaves it connected.
 *
 * So, the connectivity constraint effectively means:
 * If we discount a cell, the section from which it's discounted must have at least 2 cells remaining.
 *
 * For a horizontal cut after row `r`:
 * Bottom section: `(m - 1 - r) x n`. If we discount a cell from this section, it must have at least 2 cells.
 * This means `(m - 1 - r) * n >= 2`.
 * Top section: `(r + 1) x n`. If we discount a cell from this section, it must have at least 2 cells.
 * This means `(r + 1) * n >= 2`.
 *
 * For a vertical cut after column `c`:
 * Right section: `m x (n - 1 - c)`. If we discount a cell, `m * (n - 1 - c) >= 2`.
 * Left section: `m x (c + 1)`. If we discount a cell, `m * (c + 1) >= 2`.
 *
 * Let's refine the logic.
 *
 * Precomputation:
 * `m = grid.length`, `n = grid[0].length`
 * `rowPrefixSum[i]` = sum of `grid[i]`
 * `colPrefixSum[j]` = sum of `grid[k][j]` for all `k`
 * `totalSum = sum(rowPrefixSum)`
 *
 * Horizontal Cuts:
 * Iterate `r` from `0` to `m-2` (inclusive, as cut must result in non-empty sections).
 * `sumTop = sum(rowPrefixSum[0]...rowPrefixSum[r])`
 * `sumBottom = totalSum - sumTop`
 *
 * Case 1: `sumTop == sumBottom`
 *   Return `true`.
 *
 * Case 2: `abs(sumTop - sumBottom) == val` where `val` is the value of a cell in one of the sections.
 *   If `sumTop > sumBottom`: we need to discount a cell `grid[i][j]` from the top section such that `grid[i][j] == sumTop - sumBottom`.
 *     The top section is `grid[0...r][0...n-1]`. Its size is `(r+1) * n`.
 *     If `(r+1) * n >= 2`, we can check if such a cell exists.
 *     To efficiently check for existence, we can store cell values and their counts, or iterate through the top section.
 *     Iterating through `grid[0...r][0...n-1]` to find `grid[i][j] == sumTop - sumBottom` is O(m*n) for each cut, too slow.
 *     Instead, for each `r`, we can iterate through the rows `0` to `r` and within each row, iterate through columns `0` to `n-1`.
 *     If `sumTop > sumBottom`, check if `sumTop - sumBottom` exists in `grid[0...r][0...n-1]` AND `(r+1)*n >= 2`.
 *     If `sumBottom > sumTop`, check if `sumBottom - sumTop` exists in `grid[r+1...m-1][0...n-1]` AND `(m-1-r)*n >= 2`.
 *
 *   To avoid O(m*n) check inside the loop:
 *   For each `r`, we can determine the range of cell values in the top section and bottom section.
 *   When considering a horizontal cut after row `r`:
 *   Top section: `grid[0...r][0...n-1]`
 *   Bottom section: `grid[r+1...m-1][0...n-1]`
 *
 *   We can precompute for each cell `grid[i][j]`:
 *   - If `grid[i][j]` is in the "top" part of a horizontal partition.
 *   - If `grid[i][j]` is in the "bottom" part of a horizontal partition.
 *   - If `grid[i][j]` is in the "left" part of a vertical partition.
 *   - If `grid[i][j]` is in the "right" part of a vertical partition.
 *
 *   Let's think about the discount. If `sumTop = S_T` and `sumBottom = S_B`.
 *   If `S_T > S_B`, we need to find a cell `v` in the top section such that `v = S_T - S_B`.
 *   The top section consists of rows `0` to `r`. All cells `grid[i][j]` with `0 <= i <= r` are in the top section.
 *   The size of this section is `(r+1) * n`. If `(r+1) * n < 2`, we cannot discount a cell.
 *   So, if `S_T > S_B` and `(r+1) * n >= 2`, we need to check if any cell `grid[i][j]` with `0 <= i <= r` has the value `S_T - S_B`.
 *
 *   If `S_B > S_T`, we need to find a cell `v` in the bottom section such that `v = S_B - S_T`.
 *   The bottom section consists of rows `r+1` to `m-1`. All cells `grid[i][j]` with `r+1 <= i <= m-1` are in the bottom section.
 *   The size of this section is `(m-1-r) * n`. If `(m-1-r) * n < 2`, we cannot discount a cell.
 *   So, if `S_B > S_T` and `(m-1-r) * n >= 2`, we need to check if any cell `grid[i][j]` with `r+1 <= i <= m-1` has the value `S_B - S_T`.
 *
 *   To efficiently check for cell existence:
 *   We can precompute the set of all distinct values in the grid. Or, for each possible discount value, check if it exists in the relevant section.
 *   The maximum possible value of a cell is 10^5. The maximum sum difference could also be around this magnitude.
 *
 *   Let's consider the constraints: `m * n <= 10^5`. This implies that iterating through all cells of a section is acceptable if done judiciously.
 *
 *   Algorithm outline:
 *   1. Precompute `rowPrefixSum` and `colPrefixSum`.
 *   2. Calculate `totalSum`.
 *
 *   3. Check Horizontal Cuts:
 *      Iterate `r` from `0` to `m-2`.
 *      Calculate `sumTop = sum(rowPrefixSum[0]...rowPrefixSum[r])`.
 *      Calculate `sumBottom = totalSum - sumTop`.
 *
 *      If `sumTop == sumBottom`: return `true`.
 *
 *      If `sumTop > sumBottom`:
 *          `discountValue = sumTop - sumBottom`.
 *          `topSectionSize = (r + 1) * n`.
 *          If `topSectionSize >= 2`:
 *              Check if `discountValue` exists in `grid[0...r][0...n-1]`.
 *              If yes, return `true`.
 *
 *      If `sumBottom > sumTop`:
 *          `discountValue = sumBottom - sumTop`.
 *          `bottomSectionSize = (m - 1 - r) * n`.
 *          If `bottomSectionSize >= 2`:
 *              Check if `discountValue` exists in `grid[r+1...m-1][0...n-1]`.
 *              If yes, return `true`.
 *
 *   4. Check Vertical Cuts:
 *      Iterate `c` from `0` to `n-2`.
 *      Calculate `sumLeft = sum(colPrefixSum[0]...colPrefixSum[c])`.
 *      Calculate `sumRight = totalSum - sumLeft`.
 *
 *      If `sumLeft == sumRight`: return `true`.
 *
 *      If `sumLeft > sumRight`:
 *          `discountValue = sumLeft - sumRight`.
 *          `leftSectionSize = m * (c + 1)`.
 *          If `leftSectionSize >= 2`:
 *              Check if `discountValue` exists in `grid[0...m-1][0...c]`.
 *              If yes, return `true`.
 *
 *      If `sumRight > sumLeft`:
 *          `discountValue = sumRight - sumLeft`.
 *          `rightSectionSize = m * (n - 1 - c)`.
 *          If `rightSectionSize >= 2`:
 *              Check if `discountValue` exists in `grid[0...m-1][c+1...n-1]`.
 *              If yes, return `true`.
 *
 *   5. If no such cut is found after checking all possibilities, return `false`.
 *
 *   Efficiency of checking for `discountValue` existence:
 *   For each cut, iterating through the relevant section to find `discountValue`.
 *   Horizontal cut after row `r`:
 *     Top section: `(r+1) * n` cells.
 *     Bottom section: `(m-1-r) * n` cells.
 *   Vertical cut after col `c`:
 *     Left section: `m * (c+1)` cells.
 *     Right section: `m * (n-1-c)` cells.
 *
 *   The total number of cells in all horizontal sections checked for discount is roughly `m * n` (sum of `(r+1)*n` and `(m-1-r)*n` over all `r`). Similarly for vertical cuts.
 *   The total time complexity would be:
 *   Precomputation: O(m*n) for prefix sums.
 *   Horizontal cuts: `m-1` cuts. For each cut, sum calculation is O(1) if we maintain running sums. Checking for discount value in a section can be O(size of section).
 *   Total for horizontal cuts: Sum of `(r+1)*n + (m-1-r)*n` over `r=0..m-2`. This sum is roughly O(m^2 * n) if we iterate.
 *   Wait, if we iterate through `r`, `sumTop` can be updated in O(1) from `sumTop` for `r-1`.
 *   `sumTop_r = sumTop_{r-1} + rowPrefixSum[r]`.
 *   Similarly `sumLeft_c = sumLeft_{c-1} + colPrefixSum[c]`.
 *
 *   So, sum calculation is O(1).
 *   The bottleneck is finding the `discountValue`.
 *
 *   Example:
 *   grid = [[1,2],[3,4]] m=2, n=2
 *   rowPrefixSum = [3, 7]
 *   colPrefixSum = [4, 6]
 *   totalSum = 10
 *
 *   Horizontal Cuts:
 *   r = 0 (cut after row 0)
 *     sumTop = rowPrefixSum[0] = 3
 *     sumBottom = totalSum - sumTop = 10 - 3 = 7
 *     sumBottom > sumTop. Discount value = 7 - 3 = 4.
 *     Bottom section is grid[1][0...1] which is [3, 4]. Size is (2-1-0)*2 = 1*2 = 2. Size >= 2.
 *     Does 4 exist in grid[1][0...1]? Yes, grid[1][1] is 4.
 *     Return true. (Example 2 says true. My logic works for example 2)
 *
 *   Example 1:
 *   grid = [[1,4],[2,3]] m=2, n=2
 *   rowPrefixSum = [5, 5]
 *   colPrefixSum = [3, 7]
 *   totalSum = 10
 *
 *   Horizontal Cuts:
 *   r = 0 (cut after row 0)
 *     sumTop = rowPrefixSum[0] = 5
 *     sumBottom = totalSum - sumTop = 10 - 5 = 5
 *     sumTop == sumBottom. Return true. (Example 1 says true. My logic works)
 *
 *   Example 3:
 *   grid = [[1,2,4],[2,3,5]] m=2, n=3
 *   rowPrefixSum = [7, 10]
 *   colPrefixSum = [3, 5, 9]
 *   totalSum = 17
 *
 *   Horizontal Cuts:
 *   r = 0 (cut after row 0)
 *     sumTop = rowPrefixSum[0] = 7
 *     sumBottom = totalSum - sumTop = 17 - 7 = 10
 *     sumBottom > sumTop. Discount value = 10 - 7 = 3.
 *     Bottom section is grid[1][0...2] which is [2, 3, 5]. Size is (2-1-0)*3 = 1*3 = 3. Size >= 2.
 *     Does 3 exist in grid[1][0...2]? Yes, grid[1][1] is 3.
 *     If we discount grid[1][1]=3, the bottom section becomes [2, 5] which is connected.
 *     This suggests it should be true. But example output is false. Why?
 *
 *     "If a cell is discounted, the rest of the section must remain connected."
 *     In Example 3, horizontal cut after row 0: top is [1,2,4] (sum 7), bottom is [2,3,5] (sum 10).
 *     We need to discount 3 from the bottom to make sums equal (10-3=7).
 *     The bottom section is `grid[1][0...2]`. It has elements `grid[1][0]=2`, `grid[1][1]=3`, `grid[1][2]=5`.
 *     If we discount `grid[1][1]=3`, the remaining cells in the bottom section are `grid[1][0]=2` and `grid[1][2]=5`.
 *     These two cells are NOT connected because they are separated by the discounted cell. The problem states "the rest of the section must remain connected".
 *     This implies that if the section is a 1D row or column, removing any cell is fine.
 *     But if the section is `H x W` with `H>1` and `W>1`, removing a cell might disconnect it.
 *
 *     Revisiting the connectivity:
 *     The statement "If a cell is discounted, the rest of the section must remain connected."
 *     A section is defined by its boundaries.
 *     Horizontal cut after row `r`:
 *     Top section: `grid[0...r][0...n-1]`
 *     Bottom section: `grid[r+1...m-1][0...n-1]`
 *
 *     If we discount `grid[i][j]` from the bottom section (where `i > r`):
 *     The cells that constitute the bottom section are `{(x, y) | r+1 <= x <= m-1, 0 <= y <= n-1}`.
 *     If we remove `(i, j)` from this set, the remaining set must be connected.
 *
 *     When is a rectangular subgrid disconnected by removing one cell?
 *     Only if the subgrid has dimensions `H x W` where `H > 1` and `W > 1`, AND the removed cell is the *only* cell connecting two parts of the subgrid. This is NOT possible with a single cell removal from a rectangle.
 *     Let's consider the original problem wording carefully:
 *     "If a cell is discounted, the rest of the section must remain connected."
 *
 *     The examples give the key:
 *     Example 3: bottom section [2, 3, 5]. Discount 3 from it. Remaining are [2] and [5]. Not connected.
 *     Here the bottom section is `grid[1][0...2]`. This is a `1 x 3` section.
 *     Removing the middle element `3` leaves `2` and `5`. They are indeed separated.
 *
 *     This means for a section of size `H x W`:
 *     - If `H=1` and `W=1`: Cannot discount.
 *     - If `H=1` and `W>1`: Removing cell `grid[i][j]` (where `i` is fixed) leaves `grid[i][0...j-1]` and `grid[i][j+1...W-1]`. These two parts are connected only if `j=0` or `j=W-1`. If `0 < j < W-1`, the parts are disconnected.
 *     - If `H>1` and `W=1`: Similar to above, removing `grid[i][j]` (where `j` is fixed) leaves `grid[0...i-1][j]` and `grid[i+1...H-1][j]`. These are disconnected if `0 < i < H-1`.
 *     - If `H>1` and `W>1`: Removing cell `grid[i][j]` from an `H x W` subgrid leaves it connected.
 *
 *     This is the crucial interpretation.
 *
 *     Revised check for discount:
 *     For a horizontal cut after row `r`:
 *     Top section: `grid[0...r][0...n-1]`. Dimensions `H_T = r+1`, `W_T = n`.
 *     Bottom section: `grid[r+1...m-1][0...n-1]`. Dimensions `H_B = m-1-r`, `W_B = n`.
 *
 *     If `sumTop > sumBottom`: `discountValue = sumTop - sumBottom`.
 *       We need to discount a cell `grid[i][j]` from the top section (`0 <= i <= r`, `0 <= j <= n-1`).
 *       Conditions for valid discount:
 *       1. `grid[i][j] == discountValue`.
 *       2. The remaining top section must be connected.
 *          This means, if `H_T == 1` and `W_T > 1`, the discounted cell `grid[i][j]` must not be in the middle of the row (i.e., `j` must be `0` or `W_T-1`).
 *          If `H_T > 1` and `W_T == 1`, the discounted cell `grid[i][j]` must not be in the middle of the column (i.e., `i` must be `0` or `H_T-1`).
 *          If `H_T > 1` and `W_T > 1`, any cell can be discounted.
 *          Also, the section must have at least 2 cells if a discount is to happen. `H_T * W_T >= 2`.
 *
 *     If `sumBottom > sumTop`: `discountValue = sumBottom - sumTop`.
 *       We need to discount a cell `grid[i][j]` from the bottom section (`r+1 <= i <= m-1`, `0 <= j <= n-1`).
 *       Conditions for valid discount:
 *       1. `grid[i][j] == discountValue`.
 *       2. The remaining bottom section must be connected.
 *          This means, if `H_B == 1` and `W_B > 1`, the discounted cell `grid[i][j]` must not be in the middle of the row (i.e., `j` must be `0` or `W_B-1`).
 *          If `H_B > 1` and `W_B == 1`, the discounted cell `grid[i][j]` must not be in the middle of the column (i.e., `i` must be `0` or `H_B-1`).
 *          If `H_B > 1` and `W_B > 1`, any cell can be discounted.
 *          Also, `H_B * W_B >= 2`.
 *
 *     This implies we need to iterate through cells in the relevant section to find a `discountValue` that satisfies the connectivity.
 *     This brings back the O(m*n) per cut, total O(m^2 * n + m * n^2), which might be too slow given `m*n <= 10^5`.
 *     However, `m` and `n` can be up to `10^5` individually, but their product is limited.
 *     If `m = 10^5, n = 1`, then `m*n = 10^5`.
 *     If `m = 1, n = 10^5`, then `m*n = 10^5`.
 *     If `m = 300, n = 300`, then `m*n = 90000`.
 *
 *     Let's consider the maximum `m` or `n` if the other is small.
 *     If `m = 10^5`, `n=1`:
 *       Horizontal cuts are not possible (m-1 from 0 to m-2). A cut must result in non-empty sections. If m=1, no horizontal cut is possible. If m=2, one cut.
 *       If `m=2, n=1`: grid `[[a],[b]]`. Total sum a+b.
 *       Horizontal cut after row 0: top [a], bottom [b]. Sums a, b.
 *         If a == b, true.
 *         If a > b, discount a-b from top. Top section [a] is 1x1. Cannot discount.
 *         If b > a, discount b-a from bottom. Bottom section [b] is 1x1. Cannot discount.
 *       Vertical cuts are not possible (n-1 from 0 to n-2). If n=1, no vertical cut.
 *
 *     If `m = 1, n = 10^5`:
 *       Horizontal cuts are not possible.
 *       Vertical cuts:
 *       Let `c` be the cut column. `0 <= c <= n-2`.
 *       Left section: `grid[0][0...c]`. Size `1 x (c+1)`.
 *       Right section: `grid[0][c+1...n-1]`. Size `1 x (n-1-c)`.
 *       `sumLeft = sum(grid[0][0...c])`, `sumRight = sum(grid[0][c+1...n-1])`.
 *       If `sumLeft == sumRight`, return true.
 *       If `sumLeft > sumRight`, `discountValue = sumLeft - sumRight`.
 *         We need to discount from the left section, which is `1 x (c+1)`.
 *         If `c+1 == 1` (i.e., `c=0`), we cannot discount.
 *         If `c+1 > 1`, we can discount if `discountValue` exists in `grid[0][0...c]`.
 *         AND `grid[0][j] == discountValue` where `0 < j < c` (i.e., not endpoints).
 *         If `c+1 > 1`, discount from left if `sumLeft > sumRight`, `discountValue = sumLeft - sumRight`, AND `discountValue` is NOT `grid[0][0]` and NOT `grid[0][c]`, AND `discountValue` exists in `grid[0][1...c-1]`.
 *         This feels wrong. The constraint is "the rest of the section must remain connected".
 *         If a section is `1 x W` and `W > 1`:
 *           Discounting `grid[i][j]` (where `i` is fixed, `0 <= j < W`) leaves the section connected IF AND ONLY IF `j == 0` OR `j == W-1`.
 *           This means if a `1 x W` section needs a discount, the discount value *must* be the value of the first or last element in that section.
 *
 *     Let's re-read Example 3 carefully:
 *     grid = [[1,2,4],[2,3,5]]
 *     Horizontal cut after row 0.
 *     Top: [1,2,4], sum 7.
 *     Bottom: [2,3,5], sum 10.
 *     Difference = 3. Bottom section is `grid[1][0...2]`. This is a `1 x 3` subgrid.
 *     The cells are `(1,0)=2`, `(1,1)=3`, `(1,2)=5`.
 *     We need to discount 3 from the bottom. This is `grid[1][1]`.
 *     The problem states: "by discounting at most one single cell in total (from either section). If a cell is discounted, the rest of the section must remain connected."
 *     The rest of the bottom section after discounting `grid[1][1]` are `grid[1][0]` (value 2) and `grid[1][2]` (value 5).
 *     These two cells `(1,0)` and `(1,2)` are NOT connected. They are separated by the removed `(1,1)`.
 *     Therefore, this cut is invalid.
 *
 *     This implies that for a `1 x W` section (`W>1`) that needs a discount:
 *     The discounted cell `grid[i][j]` must be `grid[i][0]` or `grid[i][W-1]`.
 *     And the required `discountValue` must match one of these endpoint values.
 *
 *     For a `H x 1` section (`H>1`) that needs a discount:
 *     The discounted cell `grid[i][j]` must be `grid[0][j]` or `grid[H-1][j]`.
 *     And the required `discountValue` must match one of these endpoint values.
 *
 *     For a `H x W` section (`H>1, W>1`) that needs a discount:
 *     Any cell can be discounted. We just need to find if the `discountValue` exists anywhere in the section.
 *
 *     Revised check for discount:
 *
 *     Iterate `r` from `0` to `m-2` (horizontal cuts):
 *       `sumTop`, `sumBottom`.
 *       If `sumTop == sumBottom`: return `true`.
 *       If `sumTop > sumBottom`:
 *         `discountValue = sumTop - sumBottom`.
 *         `H_T = r + 1`, `W_T = n`.
 *         If `H_T * W_T >= 2`:
 *           If `H_T > 1` and `W_T > 1`: // Can discount any cell. Check if discountValue exists in grid[0..r][0..n-1]
 *             Iterate `i` from `0` to `r`, `j` from `0` to `n-1`. If `grid[i][j] == discountValue`, return `true`.
 *           Else if `H_T == 1` and `W_T > 1`: // Section is 1 x W_T. Discount must be endpoint.
 *             If `grid[0][0] == discountValue` OR `grid[0][W_T-1] == discountValue`, return `true`.
 *           Else if `H_T > 1` and `W_T == 1`: // Section is H_T x 1. Discount must be endpoint.
 *             If `grid[0][0] == discountValue` OR `grid[H_T-1][0] == discountValue`, return `true`.
 *       If `sumBottom > sumTop`:
 *         `discountValue = sumBottom - sumTop`.
 *         `H_B = m - 1 - r`, `W_B = n`.
 *         If `H_B * W_B >= 2`:
 *           If `H_B > 1` and `W_B > 1`: // Can discount any cell. Check if discountValue exists in grid[r+1..m-1][0..n-1]
 *             Iterate `i` from `r+1` to `m-1`, `j` from `0` to `n-1`. If `grid[i][j] == discountValue`, return `true`.
 *           Else if `H_B == 1` and `W_B > 1`: // Section is 1 x W_B. Discount must be endpoint.
 *             If `grid[r+1][0] == discountValue` OR `grid[r+1][W_B-1] == discountValue`, return `true`.
 *           Else if `H_B > 1` and `W_B == 1`: // Section is H_B x 1. Discount must be endpoint.
 *             If `grid[r+1][0] == discountValue` OR `grid[m-1][0] == discountValue`, return `true`.
 *
 *     Iterate `c` from `0` to `n-2` (vertical cuts):
 *       `sumLeft`, `sumRight`.
 *       If `sumLeft == sumRight`: return `true`.
 *       If `sumLeft > sumRight`:
 *         `discountValue = sumLeft - sumRight`.
 *         `H_L = m`, `W_L = c + 1`.
 *         If `H_L * W_L >= 2`:
 *           If `H_L > 1` and `W_L > 1`: // Can discount any cell. Check if discountValue exists in grid[0..m-1][0..c]
 *             Iterate `i` from `0` to `m-1`, `j` from `0` to `c`. If `grid[i][j] == discountValue`, return `true`.
 *           Else if `H_L == 1` and `W_L > 1`: // Section is 1 x W_L. Discount must be endpoint.
 *             If `grid[0][0] == discountValue` OR `grid[0][W_L-1] == discountValue`, return `true`.
 *           Else if `H_L > 1` and `W_L == 1`: // Section is H_L x 1. Discount must be endpoint.
 *             If `grid[0][0] == discountValue` OR `grid[H_L-1][0] == discountValue`, return `true`.
 *       If `sumRight > sumLeft`:
 *         `discountValue = sumRight - sumLeft`.
 *         `H_R = m`, `W_R = n - 1 - c`.
 *         If `H_R * W_R >= 2`:
 *           If `H_R > 1` and `W_R > 1`: // Can discount any cell. Check if discountValue exists in grid[0..m-1][c+1..n-1]
 *             Iterate `i` from `0` to `m-1`, `j` from `c+1` to `n-1`. If `grid[i][j] == discountValue`, return `true`.
 *           Else if `H_R == 1` and `W_R > 1`: // Section is 1 x W_R. Discount must be endpoint.
 *             If `grid[0][c+1] == discountValue` OR `grid[0][n-1] == discountValue`, return `true`.
 *           Else if `H_R > 1` and `W_R == 1`: // Section is H_R x 1. Discount must be endpoint.
 *             If `grid[0][c+1] == discountValue` OR `grid[m-1][c+1] == discountValue`, return `true`.
 *
 *   Complexity analysis of the revised check:
 *   Precomputation: O(m*n) for prefix sums.
 *   Horizontal cuts: `m-1` cuts.
 *     For each cut `r`:
 *       `sumTop`, `sumBottom` O(1).
 *       If discount needed:
 *         If `H > 1` and `W > 1`: Iterate through `H*W` cells. Max `m*n`.
 *         If `H=1` or `W=1`: Check 2 endpoints. O(1).
 *     In the worst case, `m` and `n` are roughly `sqrt(10^5)`. So `m*n` is up to `10^5`.
 *     If `H > 1` and `W > 1` applies for many cuts:
 *     Example: `m=300, n=300`.
 *     Horizontal cuts: `r` from `0` to `298`.
 *     For `r` such that `r+1 > 1` and `n > 1`, and `m-1-r > 1` and `n > 1`.
 *     This happens for `r` from `1` to `m-2`.
 *     For `r` from `1` to `m-3`, top section is `(r+1)x n`, bottom section is `(m-1-r) x n`. Both are > 1 x n.
 *     If `n > 1`, both are `>1` dimensions.
 *     So for `r = 1...m-3`, we iterate through `O(m*n)` cells. Total `m * O(m*n) = O(m^2 * n)`.
 *     Similarly for vertical cuts: `O(n * m*n) = O(n^2 * m)`.
 *     Total complexity: O(m*n + m^2*n + n^2*m).
 *     Given `m*n <= 10^5`:
 *     If `m=10^5, n=1`: O(10^5 + (10^5)^2 * 1 + 1^2 * 10^5) = O(10^10) - Too slow.
 *     This implies that iterating through cells is not the intended solution when `m` or `n` is large.
 *
 *     What if `m` or `n` is large?
 *     If `m=10^5, n=1`.
 *       Horizontal cuts: Not possible.
 *       Vertical cuts: `c` from `0` to `n-2`. `n=1`, so loop is empty. No vertical cuts.
 *       This implies the `m*n <= 10^5` constraint means we cannot have both `m` and `n` very large simultaneously.
 *       Either `m` is large and `n` is small, or `n` is large and `m` is small, or both are moderate.
 *
 *     Case 1: `m` is large, `n` is small. e.g., `m = 10^5, n = 1`. (Already covered, no cuts possible).
 *     Example: `m=10^5, n=2`. `m*n=2*10^5`.
 *       Horizontal cuts: `r` from `0` to `m-2`.
 *         Top section: `(r+1) x 2`. Bottom section: `(m-1-r) x 2`.
 *         If `r+1 > 1` and `2 > 1`, then `H_T > 1, W_T > 1`. So we iterate `O(m*n)` cells.
 *         This happens for `r >= 1`. For `r=0`, `H_T=1`.
 *         If `r=0`: Top `1x2`, Bottom `(m-1)x2`.
 *           If `sumTop > sumBottom`: `discountValue`. Top is `1x2`. Check endpoints `grid[0][0]` and `grid[0][1]`. O(1).
 *           If `sumBottom > sumTop`: `discountValue`. Bottom is `(m-1)x2`. If `m-1 > 1` and `2 > 1`, then `H_B > 1, W_B > 1`. Iterate `O(m*n)` cells.
 *         If `r > 0`: Top `(r+1)x2`, Bottom `(m-1-r)x2`. Both have `H>1, W>1`. Iterate `O(m*n)` cells.
 *       Total for horizontal: `O(m)` cuts. For `r=0`, O(1) or O(m*n). For `r>0`, O(m*n). Total `O(m*n)`.
 *       Vertical cuts: `c` from `0` to `n-2`. `n=2`, so `c=0`.
 *         Left section: `m x 1`. Right section: `m x 1`.
 *         If `sumLeft > sumRight`: `discountValue`. Left is `mx1`. If `m > 1`, discount must be endpoint: `grid[0][0]` or `grid[m-1][0]`. O(1).
 *         If `sumRight > sumLeft`: `discountValue`. Right is `mx1`. If `m > 1`, discount must be endpoint: `grid[0][1]` or `grid[m-1][1]`. O(1).
 *       Total for vertical: `O(1)`.
 *       Overall if `m` is large, `n` is small: `O(m*n)`.
 *
 *     Case 2: `n` is large, `m` is small. Similar logic, `O(m*n)`.
 *
 *     Case 3: Both `m` and `n` are moderate. e.g., `m=300, n=300`. `m*n=90000`.
 *       Horizontal cuts: `m-1` cuts.
 *         For `r` from `1` to `m-3`, both sections are `H>1, W>1`. Iterate `O(m*n)` cells. This part is `O(m * m*n) = O(m^2*n)`.
 *         This is the issue. We need to optimize finding `discountValue` in a subgrid.
 *
 *     Optimization for finding `discountValue` in a subgrid:
 *     We are looking for a specific value `X` within a rectangle `[r1..r2][c1..c2]`.
 *     If `H > 1` and `W > 1`, we need to know if `X` exists.
 *     If we can do this check faster than `O(H*W)`, that would help.
 *
 *     What if we precompute for each possible discount value `v`, the set of cells that contain `v`?
 *     `cell_locations[v] = [(r1,c1), (r2,c2), ...]`
 *     Then for each cut, if `discountValue = X`, we look up `cell_locations[X]`.
 *     For each `(r, c)` in `cell_locations[X]`, check if it falls within the current subgrid.
 *     `r1 <= r <= r2` and `c1 <= c <= c2`.
 *     Checking membership in `cell_locations` is fast if it's a Set or Hash Map.
 *     The number of distinct values can be up to `m*n`.
 *     The total number of cell locations across all values could be `m*n`.
 *     `cell_locations`: map value -> list of (row, col) tuples.
 *     `cell_locations[grid[i][j]].push([i, j])`. This precomputation takes `O(m*n)`.
 *
 *     Revised algorithm with `cell_locations`:
 *     1. Precompute `rowPrefixSum`, `colPrefixSum`, `totalSum`.
 *     2. Precompute `cell_locations`: `Map<number, Array<[number, number]>>`.
 *
 *     3. Check Horizontal Cuts:
 *        Iterate `r` from `0` to `m-2`.
 *        Calculate `sumTop`, `sumBottom`.
 *        If `sumTop == sumBottom`: return `true`.
 *        If `sumTop > sumBottom`:
 *          `discountValue = sumTop - sumBottom`.
 *          `H_T = r + 1`, `W_T = n`.
 *          If `H_T * W_T >= 2`:
 *            If `H_T > 1` and `W_T > 1`:
 *              If `cell_locations.has(discountValue)`:
 *                For each `[cell_r, cell_c]` in `cell_locations.get(discountValue)`:
 *                  If `0 <= cell_r <= r` and `0 <= cell_c <= n-1`: return `true`.
 *            Else if `H_T == 1` and `W_T > 1`:
 *              If `grid[0][0] == discountValue` OR `grid[0][W_T-1] == discountValue`: return `true`.
 *            Else if `H_T > 1` and `W_T == 1`:
 *              If `grid[0][0] == discountValue` OR `grid[H_T-1][0] == discountValue`: return `true`.
 *        If `sumBottom > sumTop`:
 *          `discountValue = sumBottom - sumTop`.
 *          `H_B = m - 1 - r`, `W_B = n`.
 *          If `H_B * W_B >= 2`:
 *            If `H_B > 1` and `W_B > 1`:
 *              If `cell_locations.has(discountValue)`:
 *                For each `[cell_r, cell_c]` in `cell_locations.get(discountValue)`:
 *                  If `r+1 <= cell_r <= m-1` and `0 <= cell_c <= n-1`: return `true`.
 *            Else if `H_B == 1` and `W_B > 1`:
 *              If `grid[r+1][0] == discountValue` OR `grid[r+1][W_B-1] == discountValue`: return `true`.
 *            Else if `H_B > 1` and `W_B == 1`:
 *              If `grid[r+1][0] == discountValue` OR `grid[m-1][0] == discountValue`: return `true`.
 *
 *     4. Check Vertical Cuts:
 *        Iterate `c` from `0` to `n-2`.
 *        Calculate `sumLeft`, `sumRight`.
 *        If `sumLeft == sumRight`: return `true`.
 *        If `sumLeft > sumRight`:
 *          `discountValue = sumLeft - sumRight`.
 *          `H_L = m`, `W_L = c + 1`.
 *          If `H_L * W_L >= 2`:
 *            If `H_L > 1` and `W_L > 1`:
 *              If `cell_locations.has(discountValue)`:
 *                For each `[cell_r, cell_c]` in `cell_locations.get(discountValue)`:
 *                  If `0 <= cell_r <= m-1` and `0 <= cell_c <= c`: return `true`.
 *            Else if `H_L == 1` and `W_L > 1`:
 *              If `grid[0][0] == discountValue` OR `grid[0][W_L-1] == discountValue`: return `true`.
 *            Else if `H_L > 1` and `W_L == 1`:
 *              If `grid[0][0] == discountValue` OR `grid[H_L-1][0] == discountValue`: return `true`.
 *        If `sumRight > sumLeft`:
 *          `discountValue = sumRight - sumLeft`.
 *          `H_R = m`, `W_R = n - 1 - c`.
 *          If `H_R * W_R >= 2`:
 *            If `H_R > 1` and `W_R > 1`:
 *              If `cell_locations.has(discountValue)`:
 *                For each `[cell_r, cell_c]` in `cell_locations.get(discountValue)`:
 *                  If `0 <= cell_r <= m-1` and `c+1 <= cell_c <= n-1`: return `true`.
 *            Else if `H_R == 1` and `W_R > 1`:
 *              If `grid[0][c+1] == discountValue` OR `grid[0][n-1] == discountValue`: return `true`.
 *            Else if `H_R > 1` and `W_R == 1`:
 *              If `grid[0][c+1] == discountValue` OR `grid[m-1][c+1] == discountValue`: return `true`.
 *
 *     5. Return `false`.
 *
 *     Complexity with `cell_locations`:
 *     Precomputation: O(m*n).
 *     Horizontal cuts: `m-1` cuts.
 *       For each cut `r`:
 *         `sumTop`, `sumBottom` O(1).
 *         If discount needed:
 *           If `H > 1, W > 1`: Iterate through `cell_locations.get(discountValue)`. Let `k` be the number of occurrences of `discountValue`. Check if any occurrence is in the range. O(k). Max `k = m*n`.
 *           If `H=1` or `W=1`: O(1).
 *     The total work for checking discounts across all horizontal cuts when `H > 1, W > 1` is bounded.
 *     For a fixed `discountValue = X`, we iterate through all its locations `[cell_r, cell_c]`. For each `[cell_r, cell_c]`, we check if it falls into any of the `m-1` horizontal partitions `[0..r][0..n-1]` or `[r+1..m-1][0..n-1]`.
 *     This seems to sum up to `O(m*n)` total work across all cuts for `H>1, W>1`.
 *     Consider a cell `(cell_r, cell_c)`. It can be part of a `H>1, W>1` top section if `cell_r <= r`. This applies for `r` from `cell_r` to `m-2`.
 *     It can be part of a `H>1, W>1` bottom section if `cell_r > r`. This applies for `r` from `0` to `cell_r - 1`.
 *     The total number of `(cell_r, cell_c)` checks across all cuts is effectively bounded by `O(m*n)` because each location `(cell_r, cell_c)` is considered only a limited number of times.
 *     Total complexity: O(m*n) for precomputation and O(m*n) for checking all cuts.
 *     This should be efficient enough.
 *
 *     Edge cases:
 *     `m=2, n=2` handled.
 *     `m=1, n=10^5` handled (no horizontal cuts, vertical cuts work).
 *     `m=10^5, n=1` handled (no horizontal, no vertical cuts).
 *
 *     The `m` and `n` can be large but their product is limited.
 *     The approach with `cell_locations` handles the `m` and `n` dependency efficiently.
 *
 *     Implementation details:
 *     `rowPrefixSum`: `Array<number>` of size `m`.
 *     `colPrefixSum`: `Array<number>` of size `n`.
 *     `cell_locations`: `Map<number, Array<[number, number]>>`.
 *
 *     Let's check the dimensions and indices again.
 *     Horizontal cut after row `r`:
 *       Top section: rows `0` to `r`. Size `(r+1) x n`.
 *       Bottom section: rows `r+1` to `m-1`. Size `(m-1-r) x n`.
 *     Indices for `cell_locations` check for top section: `0 <= cell_r <= r` and `0 <= cell_c <= n-1`.
 *     Indices for `cell_locations` check for bottom section: `r+1 <= cell_r <= m-1` and `0 <= cell_c <= n-1`.
 *
 *     Vertical cut after column `c`:
 *       Left section: columns `0` to `c`. Size `m x (c+1)`.
 *       Right section: columns `c+1` to `n-1`. Size `m x (n-1-c)`.
 *     Indices for `cell_locations` check for left section: `0 <= cell_r <= m-1` and `0 <= cell_c <= c`.
 *     Indices for `cell_locations` check for right section: `0 <= cell_r <= m-1` and `c+1 <= cell_c <= n-1`.
 *
 *     Connectivity checks for `H=1` or `W=1`:
 *     Horizontal cut, top section `1 x n`: `grid[0][0]` to `grid[0][n-1]`. Endpoints are `grid[0][0]` and `grid[0][n-1]`.
 *     Horizontal cut, bottom section `1 x n`: `grid[r+1][0]` to `grid[r+1][n-1]`. Endpoints are `grid[r+1][0]` and `grid[r+1][n-1]`.
 *     Vertical cut, left section `m x 1`: `grid[0][0]` to `grid[m-1][0]`. Endpoints are `grid[0][0]` and `grid[m-1][0]`.
 *     Vertical cut, right section `m x 1`: `grid[0][c+1]` to `grid[m-1][c+1]`. Endpoints are `grid[0][c+1]` and `grid[m-1][c+1]`.
 *
 *     This revised logic seems sound and covers all cases with expected O(m*n) time complexity.
 *
 *
 * Time Complexity: O(m * n)
 *   - Precomputing row and column prefix sums: O(m * n).
 *   - Precomputing cell locations: O(m * n).
 *   - Iterating through horizontal cuts: `m-1` cuts.
 *     - For each cut, sum calculation is O(1).
 *     - If discount is needed:
 *       - If the section is `H > 1` and `W > 1`, we iterate through the locations of the `discountValue`. In total across all horizontal cuts and all possible discount values, this step contributes O(m * n) because each cell location is checked against a limited number of partitions.
 *       - If the section is `H = 1` or `W = 1`, the check is O(1).
 *   - Iterating through vertical cuts: `n-1` cuts.
 *     - Similar analysis as horizontal cuts, contributing O(m * n) in total.
 *   Therefore, the overall time complexity is O(m * n).
 *
 * Space Complexity: O(m * n)
 *   - `rowPrefixSum`: O(m)
 *   - `colPrefixSum`: O(n)
 *   - `cell_locations`: In the worst case, all cells have distinct values, storing all `m * n` locations. O(m * n).
 *   - `grid` itself takes O(m * n).
 *   Thus, the overall space complexity is O(m * n).
 */

/**
 * @param {number[][]} grid
 * @return {boolean}
 */
var checkPartitioning = function(grid) {
    const m = grid.length;
    const n = grid[0].length;

    // Precompute row prefix sums
    const rowPrefixSum = new Array(m).fill(0);
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            rowPrefixSum[i] += grid[i][j];
        }
    }

    // Precompute column prefix sums
    const colPrefixSum = new Array(n).fill(0);
    for (let j = 0; j < n; j++) {
        for (let i = 0; i < m; i++) {
            colPrefixSum[j] += grid[i][j];
        }
    }

    // Calculate total sum of the grid
    let totalSum = 0;
    for (let i = 0; i < m; i++) {
        totalSum += rowPrefixSum[i];
    }

    // Store locations of each cell value for efficient lookup
    // Map: value -> Array of [row, col]
    const cellLocations = new Map();
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            const value = grid[r][c];
            if (!cellLocations.has(value)) {
                cellLocations.set(value, []);
            }
            cellLocations.get(value).push([r, c]);
        }
    }

    // Helper function to check if a discount value exists within a specified rectangular subgrid
    // and satisfies connectivity constraints.
    const checkDiscount = (discountValue, r1, r2, c1, c2) => {
        const H = r2 - r1 + 1; // Height of the subgrid
        const W = c2 - c1 + 1; // Width of the subgrid

        // If the section has fewer than 2 cells, we cannot discount a cell.
        if (H * W < 2) {
            return false;
        }

        // Case 1: The subgrid is larger than 1x1 (i.e., H > 1 and W > 1).
        // In this case, removing any single cell will always leave the remaining part connected.
        if (H > 1 && W > 1) {
            if (cellLocations.has(discountValue)) {
                for (const [cell_r, cell_c] of cellLocations.get(discountValue)) {
                    // Check if this cell is within the current subgrid boundaries
                    if (cell_r >= r1 && cell_r <= r2 && cell_c >= c1 && cell_c <= c2) {
                        return true; // Found a valid discountable cell
                    }
                }
            }
        }
        // Case 2: The subgrid is a single row (H = 1, W > 1) or a single column (H > 1, W = 1).
        // Removing a cell from the middle of a row/column disconnects the section.
        // So, the discounted cell must be an endpoint (first or last cell in the row/column).
        else if (H === 1 && W > 1) { // Single row subgrid
            // Check if the discount value matches the first or last cell in this row segment
            if (grid[r1][c1] === discountValue || grid[r1][c2] === discountValue) {
                return true;
            }
        } else if (H > 1 && W === 1) { // Single column subgrid
            // Check if the discount value matches the first or last cell in this column segment
            if (grid[r1][c1] === discountValue || grid[r2][c1] === discountValue) {
                return true;
            }
        }
        // Note: H=1, W=1 case is already handled by H*W < 2 check.

        return false; // No valid discount found in this section
    };


    // 1. Check Horizontal Cuts
    // Iterate through all possible horizontal cut positions. A cut after row `r` splits the grid into rows `0..r` and `r+1..m-1`.
    // `r` goes from `0` to `m-2` to ensure both sections are non-empty.
    let currentTopSum = 0;
    for (let r = 0; r < m - 1; r++) {
        currentTopSum += rowPrefixSum[r]; // Sum of the top section (rows 0 to r)
        const sumBottom = totalSum - currentTopSum; // Sum of the bottom section

        // Case 1: Sums are already equal, no discount needed.
        if (currentTopSum === sumBottom) {
            return true;
        }

        // Case 2: Sums can be made equal by discounting one cell.
        const diff = Math.abs(currentTopSum - sumBottom);

        if (currentTopSum > sumBottom) {
            // Need to discount from the top section (rows 0..r).
            // Check if the discountValue (diff) can be discounted from the top section.
            if (checkDiscount(diff, 0, r, 0, n - 1)) {
                return true;
            }
        } else { // sumBottom > currentTopSum
            // Need to discount from the bottom section (rows r+1..m-1).
            // Check if the discountValue (diff) can be discounted from the bottom section.
            if (checkDiscount(diff, r + 1, m - 1, 0, n - 1)) {
                return true;
            }
        }
    }

    // 2. Check Vertical Cuts
    // Iterate through all possible vertical cut positions. A cut after column `c` splits the grid into columns `0..c` and `c+1..n-1`.
    // `c` goes from `0` to `n-2` to ensure both sections are non-empty.
    let currentLeftSum = 0;
    for (let c = 0; c < n - 1; c++) {
        currentLeftSum += colPrefixSum[c]; // Sum of the left section (columns 0 to c)
        const sumRight = totalSum - currentLeftSum; // Sum of the right section

        // Case 1: Sums are already equal, no discount needed.
        if (currentLeftSum === sumRight) {
            return true;
        }

        // Case 2: Sums can be made equal by discounting one cell.
        const diff = Math.abs(currentLeftSum - sumRight);

        if (currentLeftSum > sumRight) {
            // Need to discount from the left section (columns 0..c).
            // Check if the discountValue (diff) can be discounted from the left section.
            if (checkDiscount(diff, 0, m - 1, 0, c)) {
                return true;
            }
        } else { // sumRight > currentLeftSum
            // Need to discount from the right section (columns c+1..n-1).
            // Check if the discountValue (diff) can be discounted from the right section.
            if (checkDiscount(diff, 0, m - 1, c + 1, n - 1)) {
                return true;
            }
        }
    }

    // If no valid partition is found after checking all possibilities
    return false;
};
