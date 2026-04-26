```python
# Problem Summary: Detect if there's a cycle of same characters in a 2D grid.
# Link: https://leetcode.com/problems/detect-cycles-in-2d-grid/
#
# Approach:
# We can use Depth First Search (DFS) to detect cycles.
# For each unvisited cell, we start a DFS. During the DFS, we keep track of visited cells and the parent cell from which we arrived at the current cell.
# If we encounter a cell that has already been visited AND it's not the immediate parent, we've found a cycle.
# The condition that a cycle must have a length of 4 or more is implicitly handled because if we revisit a node that isn't our parent, it means we've taken at least two distinct paths to reach that node, and since each step moves to an adjacent cell, this implies a path length of at least 4.
#
# Time Complexity: O(m * n), where m is the number of rows and n is the number of columns.
# Each cell is visited at most once by the DFS.
#
# Space Complexity: O(m * n) in the worst case for the recursion stack and the visited set.
#
class Solution:
    def containsCycle(self, grid: list[list[str]]) -> bool:
        rows = len(grid)
        cols = len(grid[0])
        # visited set to keep track of cells visited during DFS for the current component.
        # Format: (row, col)
        visited = set()

        # Directions for movement: up, down, left, right
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

        # DFS function to explore connected components and detect cycles.
        # r: current row
        # c: current column
        # pr: parent row (the row from which we arrived at (r, c))
        # pc: parent column (the column from which we arrived at (r, c))
        # char: the character value we are looking for in the cycle
        def dfs(r, c, pr, pc, char):
            # Mark the current cell as visited.
            visited.add((r, c))

            # Explore all four possible directions.
            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                # Check if the neighbor is within the grid boundaries.
                if 0 <= nr < rows and 0 <= nc < cols:
                    # Check if the neighbor has the same character.
                    if grid[nr][nc] == char:
                        # If the neighbor has been visited and it's NOT the parent cell, we found a cycle.
                        if (nr, nc) in visited and (nr, nc) != (pr, pc):
                            return True
                        # If the neighbor has not been visited, recursively call DFS on it.
                        # We pass the current cell (r, c) as the parent to the neighbor.
                        if (nr, nc) not in visited:
                            if dfs(nr, nc, r, c, char):
                                return True
            # If no cycle is found from this path, return False.
            return False

        # Iterate through each cell in the grid.
        for r in range(rows):
            for c in range(cols):
                # If the cell has not been visited yet (meaning it's part of a new component),
                # start a DFS from this cell.
                if (r, c) not in visited:
                    # For the starting cell of a DFS, there is no parent, so we use (-1, -1) as placeholder.
                    if dfs(r, c, -1, -1, grid[r][c]):
                        # If DFS finds a cycle, return True immediately.
                        return True

        # If no cycle is found after checking all components, return False.
        return False

```