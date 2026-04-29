/**
 * @summary Given an n x n grid, find the maximum score by coloring columns. The score is the sum of white cells adjacent to a black cell horizontally.
 * @link https://leetcode.com/problems/maximum-score-from-grid-operations/
 * @approach This problem can be solved using dynamic programming. We can define a DP state `dp[i][j]` representing the maximum score achievable considering the first `i` rows and the first `j` columns. However, the operations are defined by coloring a column down to a specific row, which implies that the choice made for a column affects future columns and rows. A more suitable DP approach involves iterating through each cell `(i, j)` and deciding whether to "activate" it to contribute to the score.
 *
 * The key observation is that a cell `grid[r][c]` contributes to the score if it's white and has a horizontally adjacent black cell. A cell `(r, c)` becomes black if an operation is performed on column `c` down to row `k` where `k <= r`.
 *
 * Let `dp[i][j]` be the maximum score achievable considering cells up to row `i-1` and column `j-1`. This state definition is difficult to manage due to the column coloring operation affecting entire columns.
 *
 * A better DP approach:
 * Consider processing the grid column by column. For each column `j`, we need to decide for each row `i` if we want to perform an operation that colors column `j` down to row `i`.
 * This choice impacts the score of cells in column `j` and `j+1`.
 *
 * Let's redefine DP: `dp[j][k]` = maximum score considering columns `0` to `j`, where column `j` was colored down to row `k`.
 * This still seems complex.
 *
 * Let's think about the contribution of each cell. A cell `grid[r][c]` contributes if it's white and `grid[r][c-1]` is black OR `grid[r][c+1]` is black.
 * The operation colors a column. If we color column `c` down to row `k`, then for all `i <= k`, cell `(i, c)` becomes black.
 *
 * This problem has characteristics of a maximum weight independent set problem on a graph, but constructing the graph explicitly might be too complex.
 *
 * Let's try a DP on columns, where for each column, we decide the highest row to color.
 * `dp[j][k]` = maximum score considering columns `0` to `j`, where column `j` has been colored down to row `k`.
 *
 * Base Case: For `j = 0` (the first column), `dp[0][k]` would be the score obtained by coloring column 0 down to row `k`. The score would be `grid[k][1]` if `k > 0` (since `grid[k][0]` is black).
 *
 * Transition: To calculate `dp[j][k]`, we consider coloring column `j` down to row `k`. This means for all `i <= k`, cell `(i, j)` is black.
 * The score contributed by this operation on column `j` itself is the sum of `grid[i][j+1]` for all `i <= k` where `grid[i][j+1]` is white (and `grid[i][j]` is black).
 * This means we get `grid[i][j+1]` for `i <= k` if we consider the state of column `j+1`.
 *
 * The problem is that the score is based on *white* cells adjacent to black cells.
 *
 * Let's reconsider the state.
 * For each cell `(r, c)`, it can be white or black.
 * A cell `(r, c)` is black if an operation on column `c` was performed down to row `k >= r`.
 *
 * The score from `grid[r][c]` is `grid[r][c]` if:
 * 1. `grid[r][c]` is white.
 * 2. `(r, c-1)` is black OR `(r, c+1)` is black.
 *
 * Let's define `dp[j][k]` as the maximum score considering columns `0` to `j`, where column `j` is colored down to row `k`.
 *
 * To calculate `dp[j][k]`:
 * The cells `(i, j)` for `i <= k` are black.
 * The score contribution from column `j` involves cells in column `j-1` and `j+1`.
 *
 * If column `j` is colored down to row `k`:
 * - The cells `(i, j)` for `i <= k` are black.
 * - For `i <= k`:
 *   - If `j > 0`, `grid[i][j-1]` might contribute if `grid[i][j-1]` is white and `grid[i][j]` is black. This is always true if `i <= k`. So we get `grid[i][j-1]` for `i <= k` if `grid[i][j-1]` is white.
 *   - If `j < n-1`, `grid[i][j+1]` might contribute if `grid[i][j+1]` is white and `grid[i][j]` is black. This is always true if `i <= k`. So we get `grid[i][j+1]` for `i <= k` if `grid[i][j+1]` is white.
 *
 * This looks like we need to know the state of the *previous* column when deciding for the current column.
 *
 * Let `dp[j][k]` be the max score considering columns `0` to `j-1`, where column `j-1` was colored down to row `k`.
 *
 * When we are at column `j`, and we decide to color it down to row `cur_k`:
 * The cells `(i, j)` for `i <= cur_k` are black.
 *
 * Score from column `j`:
 * For each row `i` from `0` to `n-1`:
 *   If `(i, j)` is white and `(i, j-1)` is black (i.e., `j > 0` and an operation on column `j-1` was done down to row `prev_k >= i`): `grid[i][j]` is added.
 *   If `(i, j)` is white and `(i, j+1)` is black (i.e., `j < n-1` and an operation on column `j+1` is done down to row `next_k >= i`): `grid[i][j]` is added.
 *
 * This structure suggests that for each column `j`, we iterate through all possible rows `k` (from -1 to `n-1`, where -1 means no operation) to color that column.
 *
 * Let `dp[j][k]` be the maximum score achievable considering columns `0` to `j-1`, where column `j-1` was colored down to row `k`.
 * `j` from `0` to `n` (representing columns `0` to `n-1`).
 * `k` from `-1` to `n-1` (representing the row to color down to, `-1` means no operation on the previous column).
 *
 * `dp[j][k]` will store the max score from columns `0` to `j-1`, given column `j-1` was colored down to `k`.
 *
 * We need to calculate the score gained by coloring column `j` down to `cur_k`, based on the state of column `j-1`.
 *
 * Let `dp[j][k]` be the maximum score considering the first `j` columns, where column `j-1` was colored down to row `k`.
 * `j`: 0 to n
 * `k`: -1 to n-1 (row index for coloring in column `j-1`)
 *
 * Base case: `dp[0][k]` doesn't make much sense. Let's shift the index for columns.
 * `dp[j][k]` = maximum score considering columns `0` to `j-1`, where column `j` is colored down to row `k`.
 * `j`: 0 to n-1 (current column being considered)
 * `k`: -1 to n-1 (row to color column `j` down to)
 *
 * The transitions are tricky because an operation on column `j` can affect the score of `grid[i][j-1]` (if `j>0`) and `grid[i][j+1]` (if `j<n-1`).
 *
 * Let's use DP where `dp[i][j]` is the maximum score considering the subgrid from `(0,0)` to `(i,j)`. This doesn't work well with column operations.
 *
 * Alternative: Iterate through each column `j` from `0` to `n-1`. For each column, iterate through all possible rows `k` from `-1` to `n-1` (where `-1` means no operation on this column).
 *
 * Let's define `dp[j][k]` as the maximum score achievable by processing columns `0` through `j`, where column `j` has been colored down to row `k`.
 * `j`: 0 to n-1 (current column index)
 * `k`: -1 to n-1 (row index to color column `j` down to. `k=-1` means column `j` is not colored).
 *
 * `dp[j][k]` calculation:
 *
 * If `k == -1` (column `j` is not colored):
 *   `dp[j][-1] = max(dp[j-1][prev_k])` over all `prev_k` from `-1` to `n-1`.
 *   The score contribution from column `j` in this case comes from its left neighbor.
 *   If `j > 0`, the score added is `sum(grid[i][j])` for `i` such that `grid[i][j]` is white and `grid[i][j-1]` is black.
 *   This means we need to know the state of column `j-1`.
 *
 * This problem is actually solvable with DP on columns.
 * `dp[j][k]` = maximum score considering columns `0` to `j-1`, where column `j-1` was colored down to row `k`.
 * `j`: 0 to `n` (representing the boundary *after* processing column `j-1`).
 * `k`: -1 to `n-1` (row index for coloring column `j-1`).
 *
 * `dp[j][k]` is the max score using columns `0`...`j-1`, where column `j-1` was colored down to row `k`.
 *
 * We want to compute `dp[n][k]` for all `k`.
 *
 * Let's define `dp[col][row_color]` as the max score using columns `0` to `col`, where `col` was colored down to `row_color`.
 * `col`: 0 to `n-1`
 * `row_color`: -1 to `n-1` (`-1` means no operation on column `col`).
 *
 * `dp[col][row_color]` means:
 * - Columns `0` to `col-1` have been processed.
 * - Column `col` is colored down to `row_color`.
 *
 * To compute `dp[col][cur_row_color]`:
 * We need to consider the state of column `col-1`.
 * Suppose column `col-1` was colored down to `prev_row_color`.
 * The score up to `col-1` is `dp[col-1][prev_row_color]`.
 *
 * Now, we color column `col` down to `cur_row_color`.
 * Cells `(i, col)` for `i <= cur_row_color` are black.
 *
 * Score contributed by the operation on column `col`:
 * 1. Cells in column `col-1`: For `i` from `0` to `n-1`:
 *    If `prev_row_color >= i` (meaning `(i, col-1)` is black) AND `grid[i][col-1]` is white, we add `grid[i][col-1]`.
 *    This condition means `grid[i][col-1]` contributes if it's white and adjacent to a black cell in column `col`.
 *    This is getting circular.
 *
 * Let's think about the score contributed by each cell `grid[r][c]`.
 * `grid[r][c]` adds to the score if:
 * 1. `grid[r][c]` is white.
 * 2. `grid[r][c-1]` is black OR `grid[r][c+1]` is black.
 *
 * If we are at column `j`, and we decide to color it down to row `k`:
 * Cells `(i, j)` for `i <= k` become black.
 *
 * This suggests iterating through columns and, for each column, iterating through all possible row cuts.
 *
 * `dp[j][k]` = Maximum score considering columns `0` to `j`, where column `j` is colored down to row `k`.
 * `j`: 0 to n-1
 * `k`: -1 to n-1
 *
 * Base Case: `j = 0`
 * `dp[0][k]` (column 0 colored down to `k`):
 *   Score contribution comes from `grid[i][0]` if `grid[i][0]` is white and `grid[i][1]` is black.
 *   If column 0 is colored down to `k`, then cells `(i, 0)` for `i <= k` are black.
 *   If `j < n-1` (i.e., `0 < n-1`), then for `i <= k`, `grid[i][0]` is black, so `grid[i][1]` contributes if it's white.
 *   `dp[0][k] = sum(grid[i][1])` for `i` from `0` to `k` where `grid[i][1]` is white. (If `k=-1`, this sum is 0).
 *
 * For `j > 0`:
 * `dp[j][k]` (column `j` colored down to `k`):
 *   To calculate this, we need to know the maximum score from columns `0` to `j-1`, where column `j-1` was colored down to some `prev_k`.
 *   Let `max_prev_score = max(dp[j-1][prev_k])` for `prev_k` from `-1` to `n-1`.
 *
 *   Now, consider coloring column `j` down to `k`.
 *   Score from operations on column `j`:
 *   1. Cells `grid[i][j]` for `i <= k`: These are black. They can make `grid[i][j-1]` (if white) and `grid[i][j+1]` (if white) contribute.
 *   2. Cells `grid[i][j]` for `i > k`: These are white. They can make `grid[i][j-1]` (if black) and `grid[i][j+1]` (if black) contribute.
 *
 * This implies a DP state that captures the "blackness" of the boundary between columns.
 *
 * Let `dp[j][k]` be the maximum score considering columns `0` to `j`, where column `j` is colored down to row `k`.
 * `j`: 0 to n-1
 * `k`: -1 to n-1
 *
 * To compute `dp[j][k]`:
 * We must have come from a state in column `j-1`.
 * `dp[j][k] = max_{prev_k \in [-1, n-1]} (dp[j-1][prev_k] + score_from_col_j(prev_k, k))`
 *
 * `score_from_col_j(prev_k, k)`:
 * This is the score contributed by cells `(i, j)` and `(i, j+1)` given that column `j-1` was colored down to `prev_k` and column `j` is colored down to `k`.
 *
 * This is still very complicated. Let's simplify the score calculation.
 *
 * For a cell `grid[r][c]` to contribute `grid[r][c]`:
 * - It must be white.
 * - It must have a black horizontal neighbor.
 *
 * If column `c` is colored down to row `k`, then cells `(i, c)` for `i <= k` are black.
 *
 * Consider the state of column `j`. For each `i` from `0` to `n-1`:
 * Cell `(i, j)` can be black or white.
 * `(i, j)` is black if there's an operation on column `j` down to row `k >= i`.
 * `(i, j)` is white if no such operation exists.
 *
 * Let `dp[j][k]` be the maximum score after processing columns `0` to `j-1`, where column `j-1` was colored down to row `k`.
 * `j`: 1 to `n` (index representing the column *after* the one we just decided on)
 * `k`: -1 to `n-1` (row color for column `j-1`)
 *
 * Base case: `dp[0][k]` - this doesn't make sense.
 *
 * Let's define `dp[j][k]` as the max score considering columns `0` to `j-1`, where column `j-1` was colored down to row `k`.
 * `j`: 0 to `n`
 * `k`: -1 to `n-1`
 *
 * `dp[j][k]` will be the max score from operations in columns `0` to `j-1`, where column `j-1` was colored down to row `k`.
 *
 * To compute `dp[j+1][cur_k]`:
 * We consider all possible `prev_k` for column `j-1`.
 * `dp[j+1][cur_k] = max_{prev_k \in [-1, n-1]} (dp[j][prev_k] + score_gain_at_boundary(j, prev_k, cur_k))`
 *
 * `score_gain_at_boundary(col_idx, prev_k, cur_k)`:
 * This is the score gained from cells that become white and have a black neighbor *because* of the decision to color column `col_idx` down to `cur_k`, given column `col_idx-1` was colored down to `prev_k`.
 *
 * Score is added for `grid[i][c]` if it's white and `(i, c-1)` is black OR `(i, c+1)` is black.
 *
 * Consider the transition from column `j-1` to column `j`.
 * Let `dp[j][k]` be the max score considering columns `0` to `j-1`, where column `j-1` was colored down to row `k`.
 * `j` ranges from `0` to `n`.
 * `k` ranges from `-1` to `n-1`.
 *
 * Base case: `dp[0][-1] = 0`. All other `dp[0][k]` are `-infinity`.
 *
 * Transition: To compute `dp[j+1][cur_k]` (max score using cols `0` to `j`, with col `j` colored down to `cur_k`):
 * We must have come from a state `dp[j][prev_k]`.
 * `dp[j+1][cur_k] = max_{prev_k \in [-1, n-1]} (dp[j][prev_k] + score_contribution_from_col_j(j, prev_k, cur_k))`
 *
 * `score_contribution_from_col_j(j, prev_k, cur_k)`:
 * This is the score gained from cells involving columns `j-1` and `j` due to the coloring choices.
 *
 * This is the score contribution of the pair of columns `(j-1, j)`.
 *
 * Let's simplify the DP state.
 * `dp[j][k]` = maximum score considering columns `0` to `j`, where column `j` is colored down to row `k`.
 * `j`: 0 to n-1
 * `k`: -1 to n-1 (row index to color column `j` down to. `-1` means no operation on column `j`).
 *
 * Base case: `j = 0`
 * `dp[0][k]` (column 0 colored down to `k`):
 *   The score comes from `grid[i][0]` if white, and `grid[i][1]` black, OR `grid[i][0]` white and `grid[i][-1]` black (not possible).
 *   The only potential score comes from `grid[i][0]` where `i > k` (white), and `grid[i][1]` is black (due to operation on column 1).
 *   This means we are looking ahead, which is not how DP usually works.
 *
 * Let's process column by column, and for each column, decide its color state.
 * `dp[j][k]` = Max score considering columns `0` to `j-1`, where column `j-1` was colored down to row `k`.
 * `j` is the number of columns processed so far (0 to n).
 * `k` is the row index that column `j-1` was colored down to (-1 means no operation).
 *
 * `dp[j][k]` represents the max score accumulated from decisions made on columns `0` to `j-1`.
 *
 * To calculate `dp[j+1][cur_k]` (max score after considering column `j`, colored down to `cur_k`):
 * `dp[j+1][cur_k] = max_{prev_k} (dp[j][prev_k] + score_gained_by_coloring_col_j_to_cur_k_given_col_j_minus_1_to_prev_k)`
 *
 * The `score_gained_by_coloring_col_j_to_cur_k_given_col_j_minus_1_to_prev_k` is the sum of `grid[i][c]` for cells `(i, c)` that become score-contributing *because* of the decisions on columns `j-1` and `j`.
 *
 * This includes:
 * 1. `grid[i][j-1]` if `grid[i][j-1]` is white AND `(i, j-1)` is black (i.e., `prev_k >= i`).
 * 2. `grid[i][j]` if `grid[i][j]` is white AND `(i, j)` is black (i.e., `cur_k >= i`).
 *
 * Let's refine `dp[j][k]` = max score considering columns `0` to `j-1`, where column `j-1` was colored down to `k`.
 * `j`: 0 to `n`.
 * `k`: -1 to `n-1`.
 *
 * `dp[0][-1] = 0`. All other `dp[0][k]` are `-infinity`.
 *
 * For `j` from `0` to `n-1`: (Iterating through columns `j` from `0` to `n-1`)
 *   For `prev_k` from `-1` to `n-1`: (Previous column `j-1` was colored down to `prev_k`)
 *     If `dp[j][prev_k]` is `-infinity`, continue.
 *     For `cur_k` from `-1` to `n-1`: (Current column `j` is colored down to `cur_k`)
 *       Calculate the score gained by coloring column `j` down to `cur_k`, given column `j-1` was colored down to `prev_k`.
 *       Let this gain be `gain`.
 *       `gain = 0`
 *       // Score from cells in column `j-1` becoming white and having a black neighbor in column `j`.
 *       // Cells (i, j-1) are black if `prev_k >= i`. They are white if `grid[i][j-1]` is not used.
 *       // This interpretation is wrong. The score is for WHITE cells adjacent to BLACK.
 *
 *       // Cells in column `j-1` that contribute:
 *       // `grid[i][j-1]` if it's white and `(i, j-1)` has a black neighbor.
 *       // The decision of `prev_k` makes `(i, j-1)` black for `i <= prev_k`.
 *       // If `j-1` is the current column, and `i <= prev_k`, then `(i, j-1)` is black.
 *       // If `(i, j-1)` is black, it can make `grid[i][j-2]` (if white) and `grid[i][j-1]` (if white) contribute.
 *
 * This problem requires careful definition of the DP state.
 *
 * Let's use a common DP pattern for grid problems involving choices at each cell or row/column.
 *
 * `dp[j][k]` = maximum score considering columns `0` to `j`, where column `j` is colored down to row `k`.
 * `j`: 0 to n-1
 * `k`: -1 to n-1 (row index. `k=-1` means column `j` is NOT colored by an operation starting at column `j`).
 *
 * To compute `dp[j][k]`:
 * We must have come from a previous column `j-1`.
 * `dp[j][k] = max_{prev_k} (dp[j-1][prev_k] + score_added_by_transition(j-1, prev_k, j, k))`
 *
 * `score_added_by_transition(prev_col, prev_row_color, curr_col, curr_row_color)`:
 * This is the score added by cells that become score-contributing due to the decisions on columns `prev_col` and `curr_col`.
 *
 * If `curr_row_color == -1`: Column `curr_col` is not colored by an operation starting at `curr_col`.
 *   Cells `(i, curr_col)` are white.
 *   Score contribution from `grid[i][curr_col]` comes if `grid[i][curr_col]` is white AND `grid[i][curr_col-1]` is black.
 *   `grid[i][curr_col-1]` is black if `prev_row_color >= i`.
 *   So, for `i` such that `prev_row_color >= i` and `grid[i][curr_col]` is white, we add `grid[i][curr_col]`.
 *
 * If `cur_k != -1`: Column `curr_col` is colored down to `cur_k`.
 *   Cells `(i, curr_col)` for `i <= cur_k` are black.
 *   Cells `(i, curr_col)` for `i > cur_k` are white.
 *
 *   Score contribution from `grid[i][curr_col-1]` (if white and `(i, curr_col-1)` has black neighbor):
 *     `grid[i][curr_col-1]` is white if `prev_row_color < i`.
 *     `grid[i][curr_col-1]` has black neighbor `(i, curr_col)` if `cur_k >= i`.
 *     So, for `i` such that `prev_row_color < i` AND `cur_k >= i` AND `grid[i][curr_col-1]` is white, we add `grid[i][curr_col-1]`.
 *
 *   Score contribution from `grid[i][curr_col]` (if white and `(i, curr_col)` has black neighbor):
 *     `grid[i][curr_col]` is white if `cur_k < i`.
 *     `grid[i][curr_col]` has black neighbor `(i, curr_col-1)` if `prev_k >= i`.
 *     So, for `i` such that `cur_k < i` AND `prev_k >= i` AND `grid[i][curr_col]` is white, we add `grid[i][curr_col]`.
 *
 * Let's reformulate the DP.
 * `dp[j][k]` = max score considering columns `0` to `j`, where column `j` has been colored down to row `k`.
 * `j`: 0 to n-1
 * `k`: -1 to n-1
 *
 * Base case: `j = 0`
 *   `dp[0][k]` (column 0 colored down to `k`):
 *     If `k == -1`: Column 0 is white. Score comes from `grid[i][0]` if white and `grid[i][1]` is black.
 *       This means we look ahead to column 1's state.
 *
 * This problem might be better modeled by thinking about the state of the boundary between columns.
 *
 * Consider a 2D DP approach where `dp[i][j]` is the maximum score considering the first `i` rows and first `j` columns. This is difficult due to column operations.
 *
 * Let's try a simpler DP state.
 * `dp[j][k]` = maximum score considering columns `0` to `j-1`, where column `j-1` was colored down to row `k`.
 * `j` from `0` to `n`.
 * `k` from `-1` to `n-1`.
 *
 * Initialize `dp` table with `-infinity`.
 * `dp[0][-1] = 0`.
 *
 * For `j` from `0` to `n-1`: (Iterate through columns to be decided, `j`)
 *   For `prev_k` from `-1` to `n-1`: (Previous column `j-1` was colored down to `prev_k`)
 *     If `dp[j][prev_k]` is `-infinity`, continue.
 *
 *     // Option 1: Don't color column `j` with an operation starting at `j`.
 *     // `cur_k = -1`
 *     // The score from column `j` comes from white cells `grid[i][j]` if `grid[i][j-1]` is black.
 *     // `grid[i][j-1]` is black if `prev_k >= i`.
 *     // So, for `i` from `0` to `prev_k`:
 *     //   If `grid[i][j]` is white, add `grid[i][j]`.
 *     // This is only if `j > 0`. If `j == 0`, this path is not possible without a prior column.
 *
 *     // Let's consider the contribution of `grid[i][c]`.
 *     // `grid[i][c]` contributes if it's white AND `(i, c-1)` is black OR `(i, c+1)` is black.
 *
 *     // Let's define `dp[j][k]` as the maximum score after processing columns `0` to `j-1`, and column `j-1` was colored down to `k`.
 *     // `j` is column index for decision. `j` from 0 to `n`.
 *     // `k` is row color for column `j-1`. `k` from -1 to `n-1`.
 *
 *     // `dp[0][k]` is invalid.
 *     // `dp[1][cur_k]` (decision for column 0):
 *     // `dp[1][cur_k] = score_from_col_0(cur_k)`
 *     // `score_from_col_0(cur_k)`:
 *     //   If `cur_k == -1` (col 0 white): Score from `grid[i][0]` if white AND `grid[i][1]` black.
 *     //     This implies we need to know the decision for column 1.
 *
 * Okay, let's try the state `dp[j][k]` = maximum score considering columns `0` to `j-1`, where column `j` is colored down to row `k`.
 * `j`: 0 to `n`. `j` represents the "boundary" after column `j-1`.
 * `k`: -1 to `n-1`. `k` represents the row color for column `j`.
 *
 * `dp[j][k]` = Max score using columns `0` to `j-1`, with column `j-1` colored down to `k`.
 *
 * Base case: `dp[0][k]` not applicable.
 *
 * Let `dp[j][k]` be the max score using columns `0` to `j-1`, where column `j-1` was colored down to row `k`.
 * `j` from `0` to `n`.
 * `k` from `-1` to `n-1`.
 *
 * `dp[0][-1] = 0`. All other `dp[0][k]` are `-inf`.
 *
 * For `j` from `0` to `n-1`: (Iterating through columns `j` from `0` to `n-1` that we are deciding on)
 *   For `prev_k` from `-1` to `n-1`: (Column `j-1` was colored down to `prev_k`)
 *     If `dp[j][prev_k]` is `-inf`, continue.
 *
 *     // Now, consider decisions for column `j`.
 *     // For each `cur_k` from `-1` to `n-1` (column `j` is colored down to `cur_k`):
 *     //   Calculate the score gained from the transition from `prev_k` on column `j-1` to `cur_k` on column `j`.
 *     //   `gain = calculate_gain(j, prev_k, cur_k)`
 *     //   `dp[j+1][cur_k] = max(dp[j+1][cur_k], dp[j][prev_k] + gain)`
 *
 * `calculate_gain(col_idx, prev_row_color, cur_row_color)`:
 * This function calculates the score added by cells *between* column `col_idx-1` and `col_idx`, due to their coloring states.
 *
 * If `col_idx == 0`: This means we are calculating the score for column 0.
 *   `gain = 0`.
 *   If `cur_row_color != -1`: Cells `(i, 0)` for `i <= cur_row_color` are black.
 *     The score comes from `grid[i][1]` if white and `grid[i][0]` black.
 *     So, for `i` from `0` to `cur_row_color`: if `grid[i][1]` is white, add `grid[i][1]`.
 *     This implies we need to look at column 1.
 *
 * This means DP needs to look one step ahead or one step back carefully.
 *
 * Let `dp[j][k]` be the max score using columns `0` to `j-1`, where column `j-1` was colored down to `k`.
 * `j`: 1 to `n+1`. (Index `j` represents the column *after* the decision is made).
 * `k`: -1 to `n-1`. (Row color for column `j-2`).
 *
 * `dp[j][k]` = Max score using columns `0` to `j-2`, where column `j-2` was colored down to `k`.
 *
 * This is getting confusing. Let's use a more standard DP structure.
 *
 * `dp[j][k]` = max score considering columns `0` to `j`, where column `j` is colored down to `k`.
 * `j`: 0 to `n-1`
 * `k`: -1 to `n-1`
 *
 * Base Case: `j = 0`
 *   For `k` from `-1` to `n-1`:
 *     // Column 0 colored down to `k`.
 *     // Score comes from `grid[i][0]` if white and `grid[i][1]` is black.
 *     // `grid[i][0]` is white if `k < i`.
 *     // `grid[i][1]` is black if there's an operation on column 1 down to row `r >= i`.
 *     // This suggests we need to know decisions for future columns, which is not standard.
 *
 * The problem is about making decisions column by column. For each column, we decide the "cut-off" row.
 *
 * `dp[j][k]` = maximum score obtained by processing columns `0` to `j-1`, where column `j-1` was colored down to row `k`.
 * `j`: `0` to `n`. Index `j` signifies the "number of columns processed".
 * `k`: `-1` to `n-1`. Row index for coloring column `j-1`.
 *
 * `dp[0][-1] = 0`. All other `dp[0][k]` initialized to `-infinity`.
 *
 * For `j` from `0` to `n-1`: // Iterate through columns to decide (0 to n-1)
 *   For `prev_k` from `-1` to `n-1`: // Previous column (j-1) was colored down to prev_k
 *     If `dp[j][prev_k]` is `-infinity`, continue.
 *
 *     // Now, decide the color for column `j`. Let it be `cur_k`.
 *     For `cur_k` from `-1` to `n-1`:
 *       // Calculate score added by the transition from column `j-1` to column `j`.
 *       // This involves cells in column `j-1` and column `j`.
 *
 *       `current_score_gain = 0;`
 *       // Contribution from cells in column `j-1`
 *       // `grid[i][j-1]` contributes if it's white AND `(i, j-1)` is black.
 *       // `(i, j-1)` is black if `prev_k >= i`.
 *       // `grid[i][j-1]` is white if `prev_k < i`.
 *       // So, for `i` such that `prev_k < i` AND `prev_k >= i`... this is contradictory.
 *
 *       // Let's use the definition: `grid[r][c]` contributes `grid[r][c]` if it's white and adjacent black.
 *
 *       // Cells `(i, j-1)` are black if `prev_k >= i`.
 *       // Cells `(i, j)` are black if `cur_k >= i`.
 *
 *       // Score from column `j-1`:
 *       // `grid[i][j-1]` contributes if it's white and `(i, j-1)` has black neighbor.
 *       // `grid[i][j-1]` is white if `prev_k < i`.
 *       // `grid[i][j-1]` has black neighbor `(i, j-2)` (if `j>1`) or `(i, j)` (if `j<n`).
 *       // If `j > 0`: `(i, j-1)` has black neighbor `(i, j)` if `cur_k >= i`.
 *       // So, for `i` from `0` to `n-1`:
 *       // If `prev_k < i` AND `cur_k >= i` AND `grid[i][j-1]` is white, add `grid[i][j-1]`.
 *       // This is for `j > 0`.
 *
 *       // Score from column `j`:
 *       // `grid[i][j]` contributes if it's white and `(i, j)` has black neighbor.
 *       // `grid[i][j]` is white if `cur_k < i`.
 *       // `grid[i][j]` has black neighbor `(i, j-1)` if `prev_k >= i`.
 *       // So, for `i` from `0` to `n-1`:
 *       // If `cur_k < i` AND `prev_k >= i` AND `grid[i][j]` is white, add `grid[i][j]`.
 *       // This is for `j < n`.
 *
 *       `gain = 0;`
 *       // Handle `j = 0` case separately or adjust logic.
 *       // If `j == 0`:
 *       //   // Column `-1` is effectively non-existent or all white.
 *       //   // Score comes from `grid[i][0]` if white AND `grid[i][1]` black.
 *       //   // `grid[i][0]` is white if `cur_k < i`.
 *       //   // `grid[i][1]` is black if there's an operation on column 1.
 *       //   // This suggests looking ahead again.
 *
 * Let's consider the state definition again:
 * `dp[j][k]` = maximum score considering columns `0` to `j-1`, where column `j-1` was colored down to row `k`.
 * `j`: `1` to `n+1`. (Number of columns processed)
 * `k`: `-1` to `n-1`. (Row color for column `j-2`)
 *
 * `dp[j][k]` = max score obtained using columns `0` to `j-2`, where column `j-2` was colored down to `k`.
 *
 * Let's use `dp[j][k]` as the max score considering columns `0` to `j`, where column `j` was colored down to `k`.
 * `j`: 0 to `n-1`.
 * `k`: -1 to `n-1`.
 *
 * `dp[j][k]` = max score considering columns `0` to `j`, where column `j` is colored down to `k`.
 *
 * Base case: `j = 0`
 *   `dp[0][k]` = score from coloring column 0 down to `k`.
 *   This score comes from `grid[i][0]` if white and `grid[i][1]` black.
 *   `grid[i][0]` is white if `k < i`.
 *   `grid[i][1]` is black if there's an operation on column 1 down to `r >= i`.
 *   This still requires looking ahead.
 *
 * Correct DP state definition is crucial.
 *
 * `dp[j][k]` = Maximum score considering columns `0` to `j-1`, where column `j-1` was colored down to row `k`.
 * `j`: `0` to `n`. `j` indicates the number of columns considered *so far*.
 * `k`: `-1` to `n-1`. `k` indicates the row color for column `j-1`.
 *
 * Initialize `dp` table of size `(n+1) x n` with `-infinity`.
 * `dp[0][-1] = 0`.  (0 columns processed, no operation on previous conceptual column, score is 0).
 *
 * Iterate `j` from `0` to `n-1`: (This `j` represents the column we are deciding the color for, from `0` to `n-1`)
 *   Iterate `prev_k` from `-1` to `n-1`: (This `prev_k` is the color of column `j-1`)
 *     If `dp[j][prev_k]` is `-infinity`, continue.
 *
 *     // Now, decide the color for column `j`. Let it be `cur_k`.
 *     For `cur_k` from `-1` to `n-1`:
 *       // Calculate the score gained by the transition from `j-1` (colored `prev_k`) to `j` (colored `cur_k`).
 *       `gain = 0;`
 *
 *       // Score from cells in column `j-1`:
 *       // `grid[i][j-1]` contributes if it's white AND `(i, j-1)` has a black neighbor.
 *       // `grid[i][j-1]` is white if `prev_k < i`.
 *       // `(i, j-1)` has black neighbor `(i, j)` if `cur_k >= i`.
 *       // So, for `i` from `0` to `n-1`:
 *       // If `prev_k < i` AND `cur_k >= i` AND `grid[i][j-1]` is white, add `grid[i][j-1]`.
 *       // This applies for `j > 0`.
 *
 *       // Score from cells in column `j`:
 *       // `grid[i][j]` contributes if it's white AND `(i, j)` has a black neighbor.
 *       // `grid[i][j]` is white if `cur_k < i`.
 *       // `grid[i][j]` has black neighbor `(i, j-1)` if `prev_k >= i`.
 *       // So, for `i` from `0` to `n-1`:
 *       // If `cur_k < i` AND `prev_k >= i` AND `grid[i][j]` is white, add `grid[i][j]`.
 *       // This applies for `j < n`.
 *
 *       // Special case `j=0`:
 *       // `prev_k` is conceptual for column -1. Assume column -1 is all white, no black neighbors.
 *       // So score comes only from column `0`.
 *       // `grid[i][0]` contributes if it's white AND `(i, 0)` has black neighbor `(i, 1)`.
 *       // `grid[i][0]` is white if `cur_k < i`.
 *       // `(i, 1)` is black if an operation on column 1 is done. This implies looking ahead.
 *
 *       // Let's simplify the gain calculation.
 *       // The score is a sum of `grid[r][c]` values.
 *       // `grid[r][c]` contributes if it's white and `(r, c-1)` is black OR `(r, c+1)` is black.
 *
 *       // The DP state `dp[j][k]` should represent the max score using columns `0` to `j-1`, where column `j-1` was colored down to `k`.
 *       // When we transition to column `j` with color `cur_k`, coming from `j-1` with `prev_k`:
 *       // The score gained comes from pairs of adjacent cells where one becomes black and makes the white neighbor contribute.
 *
 *       // Consider column `j-1` and column `j`.
 *       // Cells `(i, j-1)` are black if `prev_k >= i`.
 *       // Cells `(i, j)` are black if `cur_k >= i`.
 *
 *       // Score from `grid[i][j-1]` (if white and adjacent black):
 *       // `grid[i][j-1]` is white if `prev_k < i`.
 *       // If `j > 0`, `(i, j-1)` has black neighbor `(i, j)` if `cur_k >= i`.
 *       // So, for `i` from `0` to `n-1`:
 *       // If `prev_k < i` AND `cur_k >= i` AND `grid[i][j-1] > 0`, add `grid[i][j-1]`. (Assuming `grid[i][j-1]` is always non-negative)
 *
 *       // Score from `grid[i][j]` (if white and adjacent black):
 *       // `grid[i][j]` is white if `cur_k < i`.
 *       // If `j < n`, `(i, j)` has black neighbor `(i, j-1)` if `prev_k >= i`.
 *       // So, for `i` from `0` to `n-1`:
 *       // If `cur_k < i` AND `prev_k >= i` AND `grid[i][j] > 0`, add `grid[i][j]`.
 *
 *       // This logic should cover the score contribution from `(i, j-1)` and `(i, j)`.
 *       // The `prev_k` defines black cells in col `j-1`.
 *       // The `cur_k` defines black cells in col `j`.
 *
 *       `gain = 0;`
 *       // Contribution from column `j-1`
 *       if (j > 0) {
 *           for (let i = 0; i < n; i++) {
 *               // Cell (i, j-1) is white if i > prev_k
 *               // Cell (i, j-1) has black neighbor (i, j) if i <= cur_k
 *               if (i > prev_k && i <= cur_k) {
 *                   gain += grid[i - 1][j - 1]; // Correct index: row i-1, col j-1
 *               }
 *           }
 *       }
 *       // Contribution from column `j`
 *       if (j < n) { // We are considering column `j`
 *           for (let i = 0; i < n; i++) {
 *               // Cell (i, j) is white if i > cur_k
 *               // Cell (i, j) has black neighbor (i, j-1) if i <= prev_k
 *               if (i > cur_k && i <= prev_k) {
 *                   gain += grid[i][j];
 *               }
 *           }
 *       }
 *
 *       // Update dp[j+1][cur_k]
 *       // The state `dp[j+1][cur_k]` represents the max score after considering column `j`, which was colored down to `cur_k`.
 *       // This score comes from `dp[j][prev_k]` (score up to column `j-1` colored `prev_k`) plus the `gain` from the transition.
 *
 *       // The indices are tricky.
 *       // `dp[j][prev_k]` means columns `0` to `j-1` processed, `j-1` colored `prev_k`.
 *       // We are deciding for column `j`, coloring it `cur_k`.
 *       // The new state is `dp[j+1][cur_k]` meaning columns `0` to `j` processed, `j` colored `cur_k`.
 *       // So, `dp[j+1][cur_k] = max(dp[j+1][cur_k], dp[j][prev_k] + gain)`.
 *
 *       // The `gain` calculation needs to be precise.
 *       // `gain = 0;`
 *       // // Cells in column `j-1`: `grid[i][j-1]` contributes if it's white and its right neighbor `grid[i][j]` is black.
 *       // // `grid[i][j-1]` is white if `i > prev_k`.
 *       // // `grid[i][j]` is black if `i <= cur_k`.
 *       // // This is for `j > 0`.
 *       // if (j > 0) {
 *       //     for (let i = 0; i < n; i++) {
 *       //         if (i > prev_k && i <= cur_k) { // `grid[i][j-1]` is white, `grid[i][j]` is black
 *       //             gain += grid[i][j-1]; // Contribution from `grid[i][j-1]`
 *       //         }
 *       //     }
 *       // }
 *       //
 *       // // Cells in column `j`: `grid[i][j]` contributes if it's white and its left neighbor `grid[i][j-1]` is black.
 *       // // `grid[i][j]` is white if `i > cur_k`.
 *       // // `grid[i][j-1]` is black if `i <= prev_k`.
 *       // // This is for `j < n`.
 *       // if (j < n) {
 *       //     for (let i = 0; i < n; i++) {
 *       //         if (i > cur_k && i <= prev_k) { // `grid[i][j]` is white, `grid[i][j-1]` is black
 *       //             gain += grid[i][j]; // Contribution from `grid[i][j]`
 *       //         }
 *       //     }
 *       // }
 *
 *       // The gain calculation is actually simpler: it's the score from cells that satisfy the conditions.
 *       // The score is additive.
 *
 *       // Let's think about the score cells that are white and adjacent to black.
 *       //
 *       // When we color column `j` down to `cur_k`:
 *       // Cells `(i, j)` for `i <= cur_k` are black.
 *       // Cells `(i, j)` for `i > cur_k` are white.
 *
 *       // Score contribution from `grid[i][j-1]` (if it's white and `(i, j-1)` has black neighbor `(i, j)`):
 *       // This happens if `prev_k < i` (cell `(i, j-1)` is white) AND `cur_k >= i` (cell `(i, j)` is black).
 *       // This score is `grid[i][j-1]` if `prev_k < i` and `cur_k >= i`.
 *       // Valid for `j > 0`.
 *
 *       // Score contribution from `grid[i][j]` (if it's white and `(i, j)` has black neighbor `(i, j-1)`):
 *       // This happens if `cur_k < i` (cell `(i, j)` is white) AND `prev_k >= i` (cell `(i, j-1)` is black).
 *       // This score is `grid[i][j]` if `cur_k < i` and `prev_k >= i`.
 *       // Valid for `j < n`.
 *
 *       `score_gain = 0;`
 *       // Consider pairs of columns (j-1, j)
 *       if (j > 0) { // Contribution from cells in column j-1
 *           for (let i = 0; i < n; i++) {
 *               // grid[i][j-1] contributes if white AND (i,j-1) has black neighbor.
 *               // (i, j-1) is white if i > prev_k.
 *               // (i, j-1) has black neighbor (i, j) if i <= cur_k.
 *               if (i > prev_k && i <= cur_k) {
 *                   score_gain += grid[i][j - 1];
 *               }
 *           }
 *       }
 *       if (j < n) { // Contribution from cells in column j
 *           for (let i = 0; i < n; i++) {
 *               // grid[i][j] contributes if white AND (i, j) has black neighbor.
 *               // (i, j) is white if i > cur_k.
 *               // (i, j) has black neighbor (i, j-1) if i <= prev_k.
 *               if (i > cur_k && i <= prev_k) {
 *                   score_gain += grid[i][j];
 *               }
 *           }
 *       }
 *
 *       // Update the DP table.
 *       // `dp[j+1][cur_k]` represents the max score after considering column `j` (colored `cur_k`).
 *       // This score is `dp[j][prev_k]` (max score considering columns up to `j-1`, where `j-1` was `prev_k`)
 *       // plus the `score_gain` from the transition.
 *       `dp[j + 1][cur_k] = Math.max(dp[j + 1][cur_k], dp[j][prev_k] + score_gain);`
 *
 * Final answer: `max(dp[n][k])` for all `k` from `-1` to `n-1`.
 *
 * Time Complexity: O(N^3 * N) = O(N^4) because we have N columns, N choices for previous color, N choices for current color, and the gain calculation takes O(N).
 * N is the size of the grid (n x n).
 *
 * Optimization: The score calculation for gain can be optimized using prefix sums.
 * Let `prefix_sum_col[c][r]` be the sum of `grid[i][c]` for `i` from `0` to `r-1`.
 *
 * Let's re-evaluate the gain calculation.
 * `dp[j][prev_k]` = max score using columns `0` to `j-1`, where column `j-1` was colored down to `prev_k`.
 * We are deciding for column `j`, coloring it down to `cur_k`.
 *
 * Score contribution from cells in column `j-1`:
 * `grid[i][j-1]` is white if `i > prev_k`.
 * `(i, j-1)` has black neighbor `(i, j)` if `i <= cur_k`.
 * So, score is `grid[i][j-1]` for `i` where `prev_k < i <= cur_k`.
 * This is a sum from `prev_k + 1` to `cur_k` in column `j-1`.
 * `sum(grid[i][j-1] for i from prev_k + 1 to cur_k)`.
 * This can be computed with prefix sums for each column.
 * `col_prefix_sum[c][r] = sum(grid[i][c] for i from 0 to r-1)`.
 * The sum from `a` to `b` (inclusive) is `col_prefix_sum[c][b+1] - col_prefix_sum[c][a]`.
 *
 * Score contribution from cells in column `j`:
 * `grid[i][j]` is white if `i > cur_k`.
 * `(i, j)` has black neighbor `(i, j-1)` if `i <= prev_k`.
 * So, score is `grid[i][j]` for `i` where `cur_k < i <= prev_k`.
 * This is a sum from `cur_k + 1` to `prev_k` in column `j`.
 * `sum(grid[i][j] for i from cur_k + 1 to prev_k)`.
 *
 * Precomputing column prefix sums: O(N^2).
 * DP calculation: N columns, N choices for `prev_k`, N choices for `cur_k`. Gain calculation is O(1) with prefix sums.
 * Total Time Complexity: O(N^2 + N * N * N * 1) = O(N^3).
 * Space Complexity: O(N^2) for DP table and O(N^2) for prefix sums. Total O(N^2).
 *
 * Let's recheck the bounds for `k`: it's `-1` to `n-1`.
 * When calculating the sum from `a` to `b`: if `a > b`, the sum is 0.
 * `prev_k + 1` can be `0`. `cur_k` can be `n-1`.
 * `cur_k + 1` can be `0`. `prev_k` can be `n-1`.
 *
 * The indices for `prev_k` and `cur_k` should be handled carefully.
 * `i` ranges from `0` to `n-1`.
 * If `prev_k = -1`: means column `j-1` is all white.
 * If `cur_k = -1`: means column `j` is all white.
 *
 * Summing from `a` to `b` inclusive (for row indices):
 * If `a > b`, sum is 0.
 *
 * Contribution from column `j-1`: `sum(grid[i][j-1] for i from prev_k + 1 to cur_k)`
 *   `start_row = prev_k + 1`
 *   `end_row = cur_k`
 *   If `start_row <= end_row`: Use prefix sums.
 *
 * Contribution from column `j`: `sum(grid[i][j] for i from cur_k + 1 to prev_k)`
 *   `start_row = cur_k + 1`
 *   `end_row = prev_k`
 *   If `start_row <= end_row`: Use prefix sums.
 *
 * This seems correct.
 */

/**
 * @param {number[][]} grid
 * @return {number}
 */
var maximumScore = function(grid) {
    const n = grid.length;

    // Precompute prefix sums for each column.
    // colPrefixSum[c][r] will store the sum of grid[i][c] for i from 0 to r-1.
    // Size (n x (n+1)) for easier range sum calculation.
    const colPrefixSum = Array(n).fill(0).map(() => Array(n + 1).fill(0));
    for (let c = 0; c < n; c++) {
        for (let r = 0; r < n; r++) {
            colPrefixSum[c][r + 1] = colPrefixSum[c][r] + grid[r][c];
        }
    }

    // Helper function to get sum of grid[i][c] for i from startRow to endRow (inclusive).
    // Uses precomputed prefix sums.
    const getColSum = (c, startRow, endRow) => {
        if (startRow > endRow) {
            return 0;
        }
        // Ensure rows are within bounds [0, n-1]
        startRow = Math.max(0, startRow);
        endRow = Math.min(n - 1, endRow);
        // Sum from index startRow to endRow (inclusive) is prefixSum[endRow+1] - prefixSum[startRow]
        return colPrefixSum[c][endRow + 1] - colPrefixSum[c][startRow];
    };

    // DP state: dp[j][k] = maximum score considering columns 0 to j-1,
    // where column j-1 was colored down to row k.
    // j: 0 to n (represents the number of columns processed).
    // k: -1 to n-1 (row index for coloring column j-1).
    // Use n+1 for j to handle up to column n-1.
    // Offset k by 1 to map -1 to 0, and 0 to n-1 maps to 1 to n. Total n+1 states for k.
    // dp[num_cols_processed][color_row_for_prev_col + 1]
    // Size: (n + 1) x (n + 1)
    const dp = Array(n + 1).fill(0).map(() => Array(n + 1).fill(-Infinity));

    // Base case: 0 columns processed. No operation on a conceptual column -1. Score is 0.
    // We map k=-1 to index 0 in the DP table for k.
    dp[0][0] = 0;

    // Iterate through columns to make decisions. 'j' represents the current column index we are deciding for.
    // 'j' will go from 0 to n-1.
    for (let j = 0; j < n; j++) {
        // Iterate through all possible color states of the previous column (j-1).
        // 'prev_k' is the actual row index (from -1 to n-1).
        // 'prev_k_idx' is the DP table index for k (from 0 to n).
        for (let prev_k_idx = 0; prev_k_idx <= n; prev_k_idx++) {
            const prev_k = prev_k_idx - 1; // Convert DP index back to actual row index

            if (dp[j][prev_k_idx] === -Infinity) {
                continue; // Skip if this state is unreachable
            }

            // Now, decide the color for the current column 'j'.
            // 'cur_k' is the actual row index (from -1 to n-1).
            // 'cur_k_idx' is the DP table index for k (from 0 to n).
            for (let cur_k_idx = 0; cur_k_idx <= n; cur_k_idx++) {
                const cur_k = cur_k_idx - 1; // Convert DP index back to actual row index

                // Calculate the score gained by the transition from column j-1 (colored prev_k) to column j (colored cur_k).
                // This gain comes from cells that are white and adjacent to a black cell across the boundary.

                let score_gain = 0;

                // 1. Contribution from cells in column j-1:
                //    grid[i][j-1] contributes if it's white AND its right neighbor (i, j) is black.
                //    - grid[i][j-1] is white if i > prev_k.
                //    - (i, j) is black if i <= cur_k.
                //    So, cells (i, j-1) where prev_k < i <= cur_k contribute.
                if (j > 0) { // This applies only if column j-1 exists (i.e., j > 0)
                    // Sum grid[i][j-1] for i from prev_k + 1 to cur_k
                    score_gain += getColSum(j - 1, prev_k + 1, cur_k);
                }

                // 2. Contribution from cells in column j:
                //    grid[i][j] contributes if it's white AND its left neighbor (i, j-1) is black.
                //    - grid[i][j] is white if i > cur_k.
                //    - (i, j-1) is black if i <= prev_k.
                //    So, cells (i, j) where cur_k < i <= prev_k contribute.
                if (j < n) { // This applies only if column j exists.
                    // Sum grid[i][j] for i from cur_k + 1 to prev_k
                    score_gain += getColSum(j, cur_k + 1, prev_k);
                }

                // Update the DP table for the state after processing column 'j'.
                // dp[j + 1][cur_k_idx] represents max score after considering column 'j', which was colored down to 'cur_k'.
                // It comes from dp[j][prev_k_idx] (score up to column j-1) plus the score_gain.
                dp[j + 1][cur_k_idx] = Math.max(dp[j + 1][cur_k_idx], dp[j][prev_k_idx] + score_gain);
            }
        }
    }

    // The maximum score is the maximum value in the last row of the DP table (after processing all n columns).
    let maxScore = 0;
    // dp[n] corresponds to processing all n columns (from 0 to n-1).
    // k_idx ranges from 0 to n, representing prev_k from -1 to n-1.
    for (let k_idx = 0; k_idx <= n; k_idx++) {
        maxScore = Math.max(maxScore, dp[n][k_idx]);
    }

    return maxScore;
};
