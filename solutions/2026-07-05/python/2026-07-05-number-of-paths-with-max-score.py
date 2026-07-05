# Problem Summary:
# Given a square board with numbers, obstacles 'X', a start 'S' (bottom-right), and an end 'E' (top-left).
# Find the maximum sum of numeric characters collected along a path from 'S' to 'E', moving only up, left, or up-left,
# and the number of such paths, modulo 10^9 + 7. Return [0, 0] if no path exists.

# Link to the problem:
# https://leetcode.com/problems/number-of-paths-with-max-score/

# Approach Explanation:
# This problem can be solved using dynamic programming. We define `dp[r][c]` as a tuple `(max_score, count)`
# representing the maximum score achievable to reach cell `(r, c)` from 'S', and the number of paths that achieve this
# maximum score.
# We iterate through the board cells from bottom-right (where 'S' is) towards top-left (where 'E' is).
# For each cell `(r, c)`, we consider the three possible previous cells it could have come from:
# 1. `(r+1, c)` (move 'up' to `(r, c)`)
# 2. `(r, c+1)` (move 'left' to `(r, c)`)
# 3. `(r+1, c+1)` (move 'up-left' diagonally to `(r, c)`)
#
# If a cell is an obstacle ('X'), no path can go through it, so its `dp` value remains `(0, 0)`.
# For other cells, we look at the `(max_score, count)` values of its valid predecessors.
# We find the maximum `max_score` among the predecessors.
# If multiple predecessors offer the same maximum score, we sum their `count` values.
# The score collected at the current cell `(r, c)` is added to this `max_prev_score`.
# 'S' and 'E' characters themselves do not add to the numeric sum (their value is 0 for sum calculation).
# The base case is the 'S' cell at `(N-1, N-1)`, initialized as `(0, 1)` (score 0, 1 way to be at itself).
# All `count` values are taken modulo 10^9 + 7.
# Finally, the result is `dp[0][0]`. If `dp[0][0]` has a count of 0, it means no path exists, so we return `[0, 0]`.

# Time Complexity:
# O(N^2), where N is the side length of the square board.
# This is because we iterate through each of the N*N cells in the board once.
# For each cell, we perform a constant number of operations (checking up to 3 neighbors, comparisons, additions).

# Space Complexity:
# O(N^2), where N is the side length of the square board.
# This is due to storing the N*N `dp` table, where each entry is a tuple of two integers.

class Solution:
    def pathsWithMaxScore(self, board: list[str]) -> list[int]:
        # Define modulo constant for path counts
        MOD = 10**9 + 7
        # Get the dimension of the square board
        N = len(board)

        # Initialize a 2D DP table. Each cell stores a tuple (max_score, count).
        # (0, 0) initially means no path has reached this cell yet or it's unreachable.
        dp = [[(0, 0) for _ in range(N)] for _ in range(N)]

        # Base case: The 'S' (start) cell at bottom-right (N-1, N-1).
        # Score is 0 (as 'S' itself doesn't add to the sum of numeric characters),
        # and there's 1 way to be at the start itself.
        dp[N-1][N-1] = (0, 1)

        # Iterate through the board from bottom-right to top-left
        # 'r' for row, 'c' for column
        for r in range(N - 1, -1, -1):
            for c in range(N - 1, -1, -1):
                # If current cell is an obstacle 'X', no path can go through it.
                # Its dp value remains (0, 0) as initialized.
                if board[r][c] == 'X':
                    continue
                # If current cell is 'S', it's our base case, which is already handled.
                if r == N - 1 and c == N - 1:
                    continue

                # Initialize variables to track the maximum score found from predecessors
                # and the number of paths achieving that score.
                # Use -1 for max_prev_score to ensure any valid path score (which is >= 0) is considered greater.
                max_prev_score = -1
                num_max_paths = 0

                # Define possible moves to reach (r, c): up, left, up-left (diagonal).
                # These correspond to predecessors (r+1, c), (r, c+1), (r+1, c+1).

                # Check path from 'up' (r+1, c)
                if r + 1 < N:  # Ensure the predecessor is within board bounds
                    prev_score, prev_count = dp[r+1][c]
                    if prev_count > 0:  # Only consider if a path exists from 'S' to (r+1, c)
                        if prev_score > max_prev_score:
                            # Found a new maximum score
                            max_prev_score = prev_score
                            num_max_paths = prev_count
                        elif prev_score == max_prev_score:
                            # Found another path achieving the same maximum score
                            num_max_paths = (num_max_paths + prev_count) % MOD

                # Check path from 'left' (r, c+1)
                if c + 1 < N:  # Ensure the predecessor is within board bounds
                    prev_score, prev_count = dp[r][c+1]
                    if prev_count > 0:  # Only consider if a path exists from 'S' to (r, c+1)
                        if prev_score > max_prev_score:
                            max_prev_score = prev_score
                            num_max_paths = prev_count
                        elif prev_score == max_prev_score:
                            num_max_paths = (num_max_paths + prev_count) % MOD

                # Check path from 'up-left' (r+1, c+1)
                if r + 1 < N and c + 1 < N:  # Ensure the predecessor is within board bounds
                    prev_score, prev_count = dp[r+1][c+1]
                    if prev_count > 0:  # Only consider if a path exists from 'S' to (r+1, c+1)
                        if prev_score > max_prev_score:
                            max_prev_score = prev_score
                            num_max_paths = prev_count
                        elif prev_score == max_prev_score:
                            num_max_paths = (num_max_paths + prev_count) % MOD

                # If after checking all predecessors, num_max_paths is still 0,
                # it means the current cell (r, c) is unreachable from 'S'.
                if num_max_paths == 0:
                    continue

                # Determine the numeric value of the current cell (r, c).
                # 'E' and 'S' characters do not contribute to the numeric sum.
                current_cell_val = 0
                if board[r][c].isdigit():
                    current_cell_val = int(board[r][c])

                # Update the DP table for the current cell.
                # The total score to reach (r, c) is the maximum score from a predecessor plus the current cell's value.
                # The number of paths is num_max_paths accumulated from predecessors that yield max_prev_score.
                dp[r][c] = (max_prev_score + current_cell_val, num_max_paths)

        # The final result is stored at dp[0][0] (the 'E' cell, top-left).
        final_max_score, final_num_paths = dp[0][0]

        # If no paths were found to 'E' (final_num_paths is 0), return [0, 0] as per problem statement.
        if final_num_paths == 0:
            return [0, 0]
        else:
            # Otherwise, return the maximum score and the number of paths achieving it.
            return [final_max_score, final_num_paths]

```