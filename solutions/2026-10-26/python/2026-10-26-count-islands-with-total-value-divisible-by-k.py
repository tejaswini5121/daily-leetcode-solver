```python
# Problem: Count Islands With Total Value Divisible by K
# Problem Summary: Count islands in a grid where the sum of values in each island is divisible by k.
# Link: https://leetcode.com/problems/count-islands-with-total-value-divisible-by-k/
#
# Approach:
# We can use Depth First Search (DFS) or Breadth First Search (BFS) to traverse each island.
# For each cell in the grid, if it's a positive integer (land) and hasn't been visited yet,
# we start a traversal (DFS or BFS) from that cell. During the traversal, we sum up the
# values of all connected land cells belonging to the current island and mark them as visited.
# After traversing an entire island, we check if the total sum of its values is divisible by k.
# If it is, we increment a counter for valid islands. We repeat this process for all unvisited
# land cells in the grid.
#
# For this implementation, we'll use DFS.
#
# Time Complexity Analysis:
# O(m * n), where m is the number of rows and n is the number of columns in the grid.
# Each cell is visited at most once. The DFS traversal for each island visits each cell
# within that island once.
#
# Space Complexity Analysis:
# O(m * n) in the worst case. This is due to the recursion depth of DFS which can be
# proportional to the number of cells in the grid if the entire grid forms a single island.
# We also use a 'visited' set/matrix of size O(m * n).
import collections

class Solution:
    def countIslands(self, grid: list[list[int]], k: int) -> int:
        # Get the dimensions of the grid
        rows, cols = len(grid), len(grid[0])
        # Initialize a set to keep track of visited cells
        visited = set()
        # Initialize the count of islands with total value divisible by k
        count = 0

        # Define the DFS function
        def dfs(r, c):
            # Base cases for DFS:
            # 1. Out of bounds
            # 2. Cell value is 0 (water)
            # 3. Cell has already been visited
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 0 or (r, c) in visited:
                return 0 # Return 0 if it's not part of the current island sum

            # Mark the current cell as visited
            visited.add((r, c))
            # Get the value of the current cell
            current_value = grid[r][c]

            # Explore neighbors (up, down, left, right) and add their values to the current sum
            # The sum will be the current cell's value plus the sum from its connected neighbors
            return (current_value +
                    dfs(r + 1, c) + # Down
                    dfs(r - 1, c) + # Up
                    dfs(r, c + 1) + # Right
                    dfs(r, c - 1))  # Left

        # Iterate through each cell in the grid
        for r in range(rows):
            for c in range(cols):
                # If the cell is land (positive value) and has not been visited yet,
                # it signifies the start of a new island.
                if grid[r][c] > 0 and (r, c) not in visited:
                    # Perform DFS to find the total value of the island
                    island_total_value = dfs(r, c)
                    # Check if the total value of the island is divisible by k
                    if island_total_value % k == 0:
                        # If divisible, increment the count of valid islands
                        count += 1

        # Return the final count of islands whose total value is divisible by k
        return count

```