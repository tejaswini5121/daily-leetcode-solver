```python
# Counts servers that can communicate with at least one other server in the same row or column.
# Problem Link: https://leetcode.com/problems/count-servers-that-communicate/
#
# Approach:
# The core idea is to determine, for each server, if there's another server in its row or column.
# We can efficiently check this by pre-calculating the number of servers in each row and each column.
#
# 1. Count servers per row: Iterate through the grid and maintain a count of servers for each row.
# 2. Count servers per column: Iterate through the grid and maintain a count of servers for each column.
# 3. Count communicating servers: Iterate through the grid again. For each cell containing a server (grid[r][c] == 1):
#    - Check if the total number of servers in its row (row_counts[r]) is greater than 1 OR
#    - Check if the total number of servers in its column (col_counts[c]) is greater than 1.
#    - If either of these conditions is true, it means this server communicates with at least one other server. Increment the total count of communicating servers.
#
# Time Complexity:
# - O(m * n) for iterating through the grid to count row and column servers.
# - O(m * n) for iterating through the grid again to count communicating servers.
# - Total: O(m * n), where m is the number of rows and n is the number of columns.
#
# Space Complexity:
# - O(m) for storing row counts.
# - O(n) for storing column counts.
# - Total: O(m + n).

class Solution:
    def countServers(self, grid: list[list[int]]) -> int:
        m = len(grid)  # Number of rows
        n = len(grid[0]) # Number of columns

        # Initialize arrays to store the count of servers in each row and column
        row_counts = [0] * m
        col_counts = [0] * n

        # First pass: Populate row_counts and col_counts
        for r in range(m):
            for c in range(n):
                if grid[r][c] == 1:
                    row_counts[r] += 1
                    col_counts[c] += 1

        communicating_servers_count = 0
        # Second pass: Count servers that can communicate
        for r in range(m):
            for c in range(n):
                # If the current cell contains a server
                if grid[r][c] == 1:
                    # Check if this server communicates with any other server.
                    # A server communicates if there's more than one server in its row
                    # OR more than one server in its column.
                    if row_counts[r] > 1 or col_counts[c] > 1:
                        communicating_servers_count += 1

        return communicating_servers_count

```