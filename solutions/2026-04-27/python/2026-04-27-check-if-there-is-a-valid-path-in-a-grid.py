```python
# Problem: Check if There is a Valid Path in a Grid
# Link: https://leetcode.com/problems/check-if-there-is-a-valid-path-in-a-grid/
#
# Approach:
# We can use Breadth-First Search (BFS) or Depth-First Search (DFS) to explore the grid.
# Since we are looking for any valid path, either BFS or DFS will work. BFS is often
# preferred for finding the shortest path, but here we just need to know if a path exists.
# We'll use BFS.
#
# The core idea is to start at (0, 0) and explore reachable cells. For each cell, we need
# to determine which directions are valid exits based on the street type in that cell and
# which directions are valid entrances from neighboring cells.
#
# Street mappings:
# 1: left <-> right
# 2: up <-> down
# 3: left <-> down
# 4: right <-> down
# 5: left <-> up
# 6: right <-> up
#
# We need a way to map street types to the possible directions they connect.
# For a cell (r, c) with street `grid[r][c]`, we can determine the valid outgoing
# directions. Then, for a neighboring cell (nr, nc) and its street `grid[nr][nc]`,
# we need to check if it connects back to (r, c).
#
# Let's define the connections for each street type. We can represent directions as:
# 0: up, 1: right, 2: down, 3: left
#
# Street type -> valid outgoing directions relative to the cell itself.
# 1: [3, 1] (left, right)
# 2: [0, 2] (up, down)
# 3: [3, 2] (left, down)
# 4: [1, 2] (right, down)
# 5: [3, 0] (left, up)
# 6: [1, 0] (right, up)
#
# For checking connectivity from a neighbor, we need the inverse mapping.
# If cell (r, c) connects to (nr, nc), then (nr, nc) must connect back to (r, c).
# For example, if cell (r, c) has street 1 (left-right) and we move right to (r, c+1),
# then street at (r, c+1) must be able to connect to the left.
#
# `connections[street_type]` will be a list of directions (0-3) this street allows exiting.
# `opposite_direction[direction]` will give the opposite direction.
#
# BFS implementation:
# 1. Initialize a queue and add the starting cell (0, 0).
# 2. Initialize a `visited` set to keep track of visited cells. Add (0, 0) to it.
# 3. While the queue is not empty:
#    a. Dequeue a cell (r, c).
#    b. If (r, c) is the target cell (m-1, n-1), return True.
#    c. Get the street type `street = grid[r][c]`.
#    d. For each possible outgoing `direction` from `street`:
#       i. Calculate the next cell's coordinates `(nr, nc)`.
#       ii. Check if `(nr, nc)` is within the grid boundaries.
#       iii. Check if `(nr, nc)` has not been visited.
#       iv. Get the street type of the neighbor `neighbor_street = grid[nr][nc]`.
#       v. Determine if `neighbor_street` can connect back to `(r, c)`. This means
#          if the `direction` from (r, c) to (nr, nc) is `d`, then the
#          `opposite_direction[d]` must be one of the allowed outgoing directions
#          from `neighbor_street`.
#       vi. If all conditions are met, enqueue `(nr, nc)` and add it to `visited`.
# 4. If the queue becomes empty and we haven't reached the target, return False.
#
# Time Complexity: O(m * n) because each cell is visited at most once.
# Space Complexity: O(m * n) in the worst case for the queue and visited set.
#
# Example 1 breakdown:
# grid = [[2,4,3],[6,5,2]]
# m = 2, n = 3
#
# Start at (0,0) with street 2 (up-down). Possible exits: up, down.
# Only valid move is down to (1,0).
#
# Queue: [(0,0)]
# Visited: {(0,0)}
#
# Dequeue (0,0). Street 2.
# Possible moves:
# - Up: Out of bounds.
# - Down: (1,0). Valid bounds. Not visited.
#   Neighbor street at (1,0) is 6 (right-up).
#   Direction from (0,0) to (1,0) is DOWN (2).
#   Opposite of DOWN is UP (0).
#   Street 6 allows exits: RIGHT (1), UP (0).
#   Since UP (0) is allowed by street 6, connection is valid.
#   Enqueue (1,0). Add (1,0) to visited.
#
# Queue: [(1,0)]
# Visited: {(0,0), (1,0)}
#
# Dequeue (1,0). Street 6.
# Possible moves:
# - Right: (1,1). Valid bounds. Not visited.
#   Neighbor street at (1,1) is 5 (left-up).
#   Direction from (1,0) to (1,1) is RIGHT (1).
#   Opposite of RIGHT is LEFT (3).
#   Street 5 allows exits: LEFT (3), UP (0).
#   Since LEFT (3) is allowed by street 5, connection is valid.
#   Enqueue (1,1). Add (1,1) to visited.
# - Up: (0,0). Visited. Skip.
#
# Queue: [(1,1)]
# Visited: {(0,0), (1,0), (1,1)}
#
# Dequeue (1,1). Street 5.
# Possible moves:
# - Left: (1,0). Visited. Skip.
# - Up: (0,1). Valid bounds. Not visited.
#   Neighbor street at (0,1) is 4 (right-down).
#   Direction from (1,1) to (0,1) is UP (0).
#   Opposite of UP is DOWN (2).
#   Street 4 allows exits: RIGHT (1), DOWN (2).
#   Since DOWN (2) is allowed by street 4, connection is valid.
#   Enqueue (0,1). Add (0,1) to visited.
#
# Queue: [(0,1)]
# Visited: {(0,0), (1,0), (1,1), (0,1)}
#
# Dequeue (0,1). Street 4.
# Possible moves:
# - Right: (0,2). Valid bounds. Not visited.
#   Neighbor street at (0,2) is 3 (left-down).
#   Direction from (0,1) to (0,2) is RIGHT (1).
#   Opposite of RIGHT is LEFT (3).
#   Street 3 allows exits: LEFT (3), DOWN (2).
#   Since LEFT (3) is allowed by street 3, connection is valid.
#   Enqueue (0,2). Add (0,2) to visited.
# - Down: (1,1). Visited. Skip.
#
# Queue: [(0,2)]
# Visited: {(0,0), (1,0), (1,1), (0,1), (0,2)}
#
# Dequeue (0,2). Street 3.
# Possible moves:
# - Left: (0,1). Visited. Skip.
# - Down: (1,2). Valid bounds. Not visited.
#   Neighbor street at (1,2) is 2 (up-down).
#   Direction from (0,2) to (1,2) is DOWN (2).
#   Opposite of DOWN is UP (0).
#   Street 2 allows exits: UP (0), DOWN (2).
#   Since UP (0) is allowed by street 2, connection is valid.
#   Enqueue (1,2). Add (1,2) to visited.
#
# Queue: [(1,2)]
# Visited: {(0,0), (1,0), (1,1), (0,1), (0,2), (1,2)}
#
# Dequeue (1,2). This is the target cell (m-1, n-1). Return True.
#
# Final check on directions and their opposites:
# 0: UP (moves from r-1 to r)
# 1: RIGHT (moves from c to c+1)
# 2: DOWN (moves from r to r+1)
# 3: LEFT (moves from c+1 to c)
#
# `dr = [-1, 0, 1, 0]` (UP, RIGHT, DOWN, LEFT)
# `dc = [0, 1, 0, -1]`
#
# `opposite_direction = [2, 3, 0, 1]` (opposite of UP is DOWN, RIGHT is LEFT, DOWN is UP, LEFT is RIGHT)
#
# Street definitions (based on outgoing directions):
# street_connections = {
#     1: [3, 1],  # LEFT, RIGHT
#     2: [0, 2],  # UP, DOWN
#     3: [3, 2],  # LEFT, DOWN
#     4: [1, 2],  # RIGHT, DOWN
#     5: [3, 0],  # LEFT, UP
#     6: [1, 0]   # RIGHT, UP
# }
#
# This seems correct.

import collections

class Solution:
    def hasValidPath(self, grid: list[list[int]]) -> bool:
        m, n = len(grid), len(grid[0])

        # Define directions: 0: UP, 1: RIGHT, 2: DOWN, 3: LEFT
        # dr, dc arrays for moving in these directions
        dr = [-1, 0, 1, 0]
        dc = [0, 1, 0, -1]

        # Mapping from direction to its opposite
        # e.g., opposite of UP (0) is DOWN (2), opposite of RIGHT (1) is LEFT (3)
        opposite_direction = {0: 2, 1: 3, 2: 0, 3: 1}

        # Define which directions each street type allows to exit.
        # The values are indices corresponding to dr/dc and opposite_direction.
        # Example: street 1 connects left and right. If you are in a cell with street 1,
        # you can go LEFT (direction 3) or RIGHT (direction 1).
        street_connections = {
            1: [3, 1],  # LEFT, RIGHT
            2: [0, 2],  # UP, DOWN
            3: [3, 2],  # LEFT, DOWN
            4: [1, 2],  # RIGHT, DOWN
            5: [3, 0],  # LEFT, UP
            6: [1, 0]   # RIGHT, UP
        }

        # BFS initialization
        queue = collections.deque([(0, 0)])  # Start at the top-left cell (row, col)
        visited = set([(0, 0)])  # Keep track of visited cells to avoid cycles and redundant work

        # BFS loop
        while queue:
            r, c = queue.popleft()  # Get the current cell from the queue

            # Check if we have reached the bottom-right cell
            if r == m - 1 and c == n - 1:
                return True

            current_street_type = grid[r][c]

            # Iterate through the possible directions this street allows exiting
            for direction in street_connections[current_street_type]:
                # Calculate the coordinates of the next cell
                nr = r + dr[direction]
                nc = c + dc[direction]

                # Check if the next cell is within the grid boundaries
                if 0 <= nr < m and 0 <= nc < n:
                    # Check if the next cell has not been visited yet
                    if (nr, nc) not in visited:
                        neighbor_street_type = grid[nr][nc]
                        # Determine the direction from the neighbor cell back to the current cell
                        # If we moved from (r, c) to (nr, nc) using 'direction',
                        # then from (nr, nc) we need to connect back to (r, c).
                        # The direction from (nr, nc) back to (r, c) is the opposite of 'direction'.
                        required_neighbor_connection = opposite_direction[direction]

                        # Check if the neighbor's street type allows this connection back
                        if required_neighbor_connection in street_connections[neighbor_street_type]:
                            # If all conditions are met, add the neighbor to the queue and mark as visited
                            queue.append((nr, nc))
                            visited.add((nr, nc))

        # If the queue is empty and we haven't reached the target, no valid path exists
        return False

```