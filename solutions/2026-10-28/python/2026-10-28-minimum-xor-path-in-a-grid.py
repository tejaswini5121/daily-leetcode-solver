```python
# Problem: Minimum XOR Path in a Grid
# Link: https://leetcode.com/problems/minimum-xor-path-in-a-grid/
#
# Approach:
# This problem can be solved using dynamic programming. We need to find the minimum XOR sum to reach each cell from the starting cell (0, 0).
# Since we can only move right or down, the state for DP would be dp[i][j], representing the set of all possible XOR sums to reach cell (i, j).
# However, storing all possible XOR sums for each cell can lead to a very large state space.
# A more efficient approach is to observe that the maximum value in grid[i][j] is 1023. This means the maximum possible XOR sum will be within a limited range (less than 1024).
# We can use a 2D DP array where dp[i][j] is a set of all possible XOR sums to reach cell (i, j).
# For each cell (i, j), we can reach it either from (i-1, j) (moving down) or from (i, j-1) (moving right).
# So, dp[i][j] = { (xor_sum ^ grid[i][j]) for xor_sum in dp[i-1][j] } U { (xor_sum ^ grid[i][j]) for xor_sum in dp[i][j-1] }
# The base case is dp[0][0] = { grid[0][0] }.
# The final answer will be the minimum value in dp[m-1][n-1].
#
# Due to the constraint m * n <= 1000, the total number of cells is manageable. The maximum XOR value is 1023.
# The size of the set dp[i][j] can be at most the number of paths to (i, j), but practically, it's limited by the number of possible XOR sums (<= 1024).
# So, for each cell, we iterate through the XOR sums from the previous cells and generate new XOR sums.
#
# Time Complexity: O(m * n * MAX_XOR_VALUE) where MAX_XOR_VALUE is the maximum possible XOR sum (1024 in this case).
# For each cell (m*n), we iterate through the possible XOR sums from the previous cells. Since the number of distinct XOR sums is at most 1024, the complexity is O(m * n * 1024).
#
# Space Complexity: O(m * n * MAX_XOR_VALUE) in the worst case if we store all possible XOR sums. However, since we only need the results from the previous row/column, we can optimize space.
# If we use a single DP array (or two rows for space optimization), the space complexity can be O(n * MAX_XOR_VALUE) or O(m * MAX_XOR_VALUE) if we iterate by row, or O(MAX_XOR_VALUE) if we carefully manage the current and previous XOR sums.
# For this implementation, we will use O(m * n * MAX_XOR_VALUE) for clarity, which is acceptable given the constraints.

import sys

class Solution:
    def minimumXORPath(self, grid: list[list[int]]) -> int:
        m = len(grid)
        n = len(grid[0])

        # dp[i][j] will be a set of all possible XOR sums to reach cell (i, j)
        # Initialize dp table with empty sets
        dp = [[set() for _ in range(n)] for _ in range(m)]

        # Base case: The XOR sum to reach (0, 0) is just the value at grid[0][0]
        dp[0][0].add(grid[0][0])

        # Fill the dp table
        for i in range(m):
            for j in range(n):
                # If we can reach this cell from the cell above (i-1, j)
                if i > 0:
                    for prev_xor_sum in dp[i-1][j]:
                        dp[i][j].add(prev_xor_sum ^ grid[i][j])

                # If we can reach this cell from the cell to the left (i, j-1)
                if j > 0:
                    for prev_xor_sum in dp[i][j-1]:
                        dp[i][j].add(prev_xor_sum ^ grid[i][j])

        # The minimum XOR path to the bottom-right cell (m-1, n-1) is the minimum value in the set dp[m-1][n-1]
        # If the set is empty (which shouldn't happen for valid grids and paths), return a large value.
        if not dp[m-1][n-1]:
            return -1 # Should not happen with valid inputs

        return min(dp[m-1][n-1])

```