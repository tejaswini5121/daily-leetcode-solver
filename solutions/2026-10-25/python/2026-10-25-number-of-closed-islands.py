```python
# Problem: Number of Closed Islands
# Link: https://leetcode.com/problems/number-of-closed-islands/
# Approach:
# The problem asks us to count "closed islands", which are islands of land (0s) completely surrounded by water (1s).
# An island is considered "not closed" if any part of it touches the boundary of the grid.
# We can use Depth-First Search (DFS) or Breadth-First Search (BFS) to solve this.
#
# Strategy:
# 1. First, identify and "remove" all land cells that are connected to the boundary of the grid. These cannot be part of a closed island. We can do this by performing DFS/BFS starting from all land cells on the boundary and marking them as visited or changing their value (e.g., to 1, effectively turning them into water).
# 2. After removing the boundary-connected land, iterate through the remaining grid.
# 3. For each unvisited land cell (0), start a new DFS/BFS. This will explore a new island.
# 4. If this island is indeed a closed island (meaning it doesn't touch the boundary, which we've already handled by step 1), increment the count of closed islands.
#
# Implementation Details (using DFS):
# - We'll use a `dfs` helper function that takes row and column as input.
# - Inside `dfs`, we'll mark the current cell as visited (e.g., change `grid[r][c]` to 1).
# - Then, we'll recursively call `dfs` for its 4-directional neighbors (up, down, left, right).
# - Before starting the main iteration, we'll call `dfs` for all land cells on the top and bottom rows, and for all land cells on the left and right columns. This effectively floods and removes any land connected to the edges.
# - After this initial "boundary flood fill", we iterate through the entire grid again.
# - If we find a land cell (0) that hasn't been visited (i.e., it's still 0), it means we've found the start of a new, potentially closed island. We increment our `closed_islands_count` and then call `dfs` from this cell to mark all cells belonging to this island as visited.
#
# Time Complexity: O(m * n), where m is the number of rows and n is the number of columns. We visit each cell at most a constant number of times (once for boundary flood, once for counting closed islands).
# Space Complexity: O(m * n) in the worst case for the recursion stack depth in DFS, if the entire grid is one large island. If we consider modifying the grid in-place, then the auxiliary space is O(1) besides the recursion stack. If we use a separate visited set, it would be O(m*n).

class Solution:
    def closedIsland(self, grid: list[list[int]]) -> int:
        rows = len(grid)
        cols = len(grid[0])
        
        # Helper function for Depth-First Search
        def dfs(r, c):
            # Base cases for recursion:
            # 1. Out of bounds
            # 2. Current cell is water (1)
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 1:
                return
            
            # Mark the current land cell as visited by changing it to water (1)
            grid[r][c] = 1
            
            # Recursively visit all 4-directional neighbors
            dfs(r + 1, c) # Down
            dfs(r - 1, c) # Up
            dfs(r, c + 1) # Right
            dfs(r, c - 1) # Left

        # Step 1: Flood fill from the boundaries.
        # Any land cell (0) connected to the boundary cannot be part of a closed island.
        # We turn these into water (1) so they don't get counted.

        # Flood fill from the top and bottom rows
        for c in range(cols):
            if grid[0][c] == 0: # Top row
                dfs(0, c)
            if grid[rows - 1][c] == 0: # Bottom row
                dfs(rows - 1, c)
        
        # Flood fill from the left and right columns (excluding corners already checked)
        for r in range(rows):
            if grid[r][0] == 0: # Left column
                dfs(r, 0)
            if grid[r][cols - 1] == 0: # Right column
                dfs(r, cols - 1)
        
        # Step 2: Count the remaining islands.
        # After removing boundary-connected land, any remaining land mass (0) must be a closed island.
        closed_islands_count = 0
        
        # Iterate through the inner grid
        for r in range(rows):
            for c in range(cols):
                # If we find a land cell (0), it means we've found a new closed island.
                if grid[r][c] == 0:
                    closed_islands_count += 1
                    # Perform DFS to mark all cells of this island as visited (turn to 1)
                    # so we don't count it again.
                    dfs(r, c)
        
        return closed_islands_count

```