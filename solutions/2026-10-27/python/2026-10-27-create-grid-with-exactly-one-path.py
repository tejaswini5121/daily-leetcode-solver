```python
# Problem Summary: Construct an m x n grid with '.' and '#' characters, ensuring exactly one path from top-left to bottom-right.
# Link: https://leetcode.com/problems/create-grid-with-exactly-one-path/
#
# Approach:
# To guarantee exactly one path, we can construct a grid where the path consists of only '.' cells,
# and all other cells are '#'. A simple way to achieve this is to create a diagonal path of '.' cells.
# For example, we can make the cells (i, j) a '.' if i + j < m + n - 2, and a '#' otherwise.
# This creates a "staircase" effect where the path can only move right or down along this boundary.
# The starting cell (0, 0) and ending cell (m-1, n-1) will always be '.' with this construction.
#
# Let's analyze the path:
# From (0,0), we can move right or down.
# If we move right, we reach (0,1).
# If we move down, we reach (1,0).
#
# Consider the cells (i, j) such that i + j = k. These cells form an anti-diagonal.
# For k < m + n - 2, cells (i, j) on this anti-diagonal are '.'
# For k = m + n - 2, cells (i, j) on this anti-diagonal are '.' if we are on the path.
# For k > m + n - 2, cells (i, j) on this anti-diagonal are '#'
#
# The path from (0,0) to (m-1, n-1) must consist of cells (i, j) where i+j ranges from 0 to m+n-2.
# Specifically, the path will traverse cells where i+j < m+n-2, eventually reaching a cell (i, j)
# where i+j = m+n-2, and from there, it must move towards (m-1, n-1).
#
# A simpler construction for a guaranteed single path is to make a "straight" path of '.' and block off all other options with '#'.
# The most straightforward path is to go right until the last column, then down until the last row.
# Or, go down until the last row, then right until the last column.
#
# Let's try a specific construction:
# Initialize an m x n grid filled with '#'.
# Make the start cell (0, 0) a '.'.
# From (0, 0), we can only move right or down.
# To force a single path, we can make a "corridor" of '.' cells.
#
# Example: m=3, n=3
#
# Path: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
#
# Grid:
# . . #
# # . .
# # # .
#
# This requires careful placement of '#'.
#
# Let's try a simpler approach: Fill the grid with '.' and then strategically place '#' to block alternative paths.
#
# Consider the path that goes as far right as possible then as far down as possible.
# (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1)
# This path only involves cells (i,j) where either i=0 and j is from 0 to n-1, OR j=n-1 and i is from 0 to m-1.
#
# Another path: (0,0) -> (1,0) -> ... -> (m-1, 0) -> (m-1, 1) -> ... -> (m-1, n-1)
# This path only involves cells (i,j) where either j=0 and i is from 0 to m-1, OR i=m-1 and j is from 0 to n-1.
#
# To have *exactly one* path, we need to ensure that any deviation from a single chosen path is blocked.
#
# A simple strategy that works for the given constraints (m, n <= 25) is to create a serpentine path.
# Start at (0,0). Go right until the end of the first row (or until n-1).
# Then go down to the next row. Then go left until the start of the row (or until 0).
# Then go down. Repeat.
# This isn't quite what we want because we can only move right and down.
#
# The simplest path is to always move right when possible, and down when necessary.
# Or always down when possible, and right when necessary.
#
# Let's consider the path where we prioritize moving right:
# (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> (1, n-1) -> (2, n-1) -> ... -> (m-1, n-1)
# This is not a valid path. The path must only move right or down.
#
# Let's consider the path:
# (0,0) -> (0,1) -> ... -> (0, n-1)  (if m=1)
# (0,0) -> (1,0) -> ... -> (m-1, 0)  (if n=1)
#
# If m > 1 and n > 1, the path must consist of (m-1) down moves and (n-1) right moves, in any order.
# The total number of steps is (m-1) + (n-1) = m + n - 2.
#
# To create a single path, we can make a "corridor" of '.' cells.
#
# Consider the path that goes right as much as possible, then down.
# (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> ... -> (m-1, n-2) -> (m-1, n-1)
# This is not the target. The target is (m-1, n-1).
#
# The problem is similar to finding the number of paths in a grid, but we want exactly ONE.
#
# The simplest way to ensure exactly one path is to create a path that is the only sequence of moves
# that can reach the destination.
#
# Let's try to make a path that goes right until the second-to-last column, then down to the last row, then right to the end.
# (0,0) -> (0,1) -> ... -> (0, n-2)  (Path segment 1)
# From (0, n-2), we can go down.
# (0, n-2) -> (1, n-2) -> ... -> (m-1, n-2) (Path segment 2)
# From (m-1, n-2), we can go right to (m-1, n-1). (Path segment 3)
#
# This requires cells (i, j) to be '.' where:
# - 0 <= i < m, j = n-2
# - i = m-1, 0 <= j < n-1
# - (0,0) is also a '.'
#
# Let's trace this path for m=2, n=3:
# Path: (0,0) -> (0,1) -> (1,1) -> (1,2)
#
# Grid:
# . . #
# # . .
#
# Here, (0,0) is '.', (0,1) is '.'. j=n-2=1. So, row 0, col 1 is '.'.
# i=m-1=1, j=0..n-2=1. So, row 1, col 0 to 1.
# Col 0: #
# Col 1: .
#
# Let's try the example: m=2, n=3 -> ["..#","#.."]
#
# The path is (0,0) -> (0,1) -> (1,1) -> (1,2)
# This path means cells (0,0), (0,1), (1,1), (1,2) must be '.'
#
# Grid:
# . . #
# # . .
#
# Cell (0,0) is '.', (0,1) is '.', (0,2) is '#'.
# Cell (1,0) is '#', (1,1) is '.', (1,2) is '.'.
#
# This construction is achieved by:
# Initialize all cells to '#'.
# Make (0,0) a '.'.
# For each cell (i, j):
# If we can reach (i, j) from (i-1, j) or (i, j-1) by following a single path rule.
#
# A simpler strategy is to make the path a "staircase" of '.' cells and fill the rest with '#'.
# The staircase path is formed by cells (i, j) where i + j < k for some k.
#
# Consider the cells (i, j) such that i + j < m + n - 2.
# For m=2, n=3: m+n-2 = 2+3-2 = 3.
# Cells where i+j < 3:
# (0,0): 0+0=0 < 3 -> '.'
# (0,1): 0+1=1 < 3 -> '.'
# (0,2): 0+2=2 < 3 -> '.'
# (1,0): 1+0=1 < 3 -> '.'
# (1,1): 1+1=2 < 3 -> '.'
# (1,2): 1+2=3 is NOT < 3 -> '#'
#
# This gives:
# . . .
# . . #
# This doesn't work. The end cell (m-1, n-1) is '#'.
#
# The path should always consist of '.' cells.
#
# The constraint of "exactly one path" implies that any alternative moves from any cell on the single path must be blocked.
#
# Let's go back to the example solution for m=2, n=3: ["..#","#.."]
# Path: (0,0) -> (0,1) -> (1,1) -> (1,2)
#
# Cells on the path: (0,0), (0,1), (1,1), (1,2)
#
# Consider the cells (i, j) that are NOT on this path. They are '#'.
# (0,2) is '#'.
# (1,0) is '#'.
#
# This suggests that for a cell (i, j) to be '.', it must be on the unique path.
# How to define this unique path?
#
# The path must start at (0,0) and end at (m-1, n-1), moving only right or down.
#
# Consider the "anti-diagonal" k = i + j.
# Cells with k=0: (0,0)
# Cells with k=1: (0,1), (1,0)
# Cells with k=2: (0,2), (1,1), (2,0)
# ...
# Cells with k=m+n-2: (m-1, n-1)
#
# To have a single path, we can make a "corridor" of '.' cells that forces progress towards the goal.
#
# If we make all cells (i, j) a '.' where i + j <= some value, and '#' otherwise,
# this will create a diagonal path.
#
# Let's try making cells '.' if they are on the path and '#' otherwise.
# The path: (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> ... -> (m-1, n-2) -> (m-1, n-1)
# This path is:
# - (0,0)
# - (0,1), ..., (0, n-2)
# - (1, n-2), ..., (m-1, n-2)
# - (m-1, n-1)
#
# This isn't correct as (0,0) can go to (1,0).
#
# The problem guarantees that m, n >= 1.
#
# Let's consider the path that goes right until the end of the second to last column, then goes down.
#
# The path must be able to reach (m-1, n-1) from (0,0).
#
# The condition for a cell (i, j) to be '.' on the single path:
# It must be reachable from (0,0) and from it, (m-1, n-1) must be reachable, using only '.' cells.
#
# A simple, construction:
# Fill the grid with '.'.
# Then, strategically place '#' to block all but one path.
#
# Consider the path where we go down as much as possible, then right.
# (0,0) -> (1,0) -> ... -> (m-1, 0) -> (m-1, 1) -> ... -> (m-1, n-1)
#
# Example: m=3, n=3
# Path: (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2)
# Cells that must be '.': (0,0), (1,0), (2,0), (2,1), (2,2)
#
# Grid:
# . # #
# . # #
# . . .
#
# Let's check this for example 2: m=3, n=3. Output: ["..#","#..","##."]
# Path: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
# This path is different from the one above.
#
# The example outputs suggest a path that is somewhat "diagonal".
#
# Let's reconsider the condition: i + j < m + n - 2
# For m=2, n=3, m+n-2 = 3.
# Cells (i,j) where i+j < 3 are: (0,0), (0,1), (0,2), (1,0), (1,1).
# If these are '.' and others are '#':
# . . .
# . . #
# This doesn't work. (m-1, n-1) is (1,2).
#
# The problem is to *construct* any grid with exactly one path.
# So we can choose a path and then block everything else.
#
# What if we make the path go along the "boundary" of the grid?
#
# Path: (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1)
# Cells: (i, j) where i=0, 0 <= j < n  OR  j=n-1, 0 < i < m
#
# Let's apply this to m=2, n=3.
# Path cells:
# i=0, 0<=j<3: (0,0), (0,1), (0,2)
# j=2, 0<i<2: (1,2)
#
# Cells to be '.': (0,0), (0,1), (0,2), (1,2)
#
# Grid:
# . . .
# # # .
#
# This would allow a path (0,0)->(0,1)->(0,2)->(1,2).
# But it also allows (0,0)->(1,0) (if (1,0) is '.'), which isn't the case here.
#
# The issue is that if we make a "straight" path, we need to ensure no other combinations of moves can reach the end.
#
# Consider making all cells (i, j) a '.' if they are "reachable" by the single path.
#
# Let's try to construct the grid such that the only path is along cells (i, j) where i + j < m + n - 2.
# This implies that cells (i, j) where i + j >= m + n - 2 must be '#'.
#
# Let's test this hypothesis:
# If m=2, n=3, m+n-2 = 3.
# Cells with i+j < 3 are: (0,0), (0,1), (1,0), (1,1), (0,2).
# Cells with i+j >= 3 are: (1,2).
#
# So, cells (i,j) with i+j < 3 are '.' and cells with i+j >= 3 are '#'.
#
# Grid:
# (0,0) i+j=0 < 3 -> '.'
# (0,1) i+j=1 < 3 -> '.'
# (0,2) i+j=2 < 3 -> '.'
# (1,0) i+j=1 < 3 -> '.'
# (1,1) i+j=2 < 3 -> '.'
# (1,2) i+j=3 >= 3 -> '#'
#
# Resulting Grid:
# . . .
# . . #
#
# This is not correct because the destination (1,2) is '#'.
#
# The destination (m-1, n-1) MUST be a '.'.
#
# Let's try to make the path a "diagonal" from (0,0) to (m-1, n-1).
# The path consists of cells (i, j) such that:
# For each step, either i increases by 1 or j increases by 1.
# The sum i+j increases by 1 at each step.
#
# Consider the path: (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> ... -> (m-1, n-2) -> (m-1, n-1)
# This path makes sense if n > 1 and m > 1.
#
# Cells that must be '.':
# (0,0)
# (0,1), ..., (0, n-2)
# (1, n-2), ..., (m-1, n-2)
# (m-1, n-1)
#
# Let's verify the path with this set of '.' cells.
# From (0,0), can go to (0,1) (if n-2 >= 1, i.e., n>=3).
# Or can go to (1,0) if (1,0) is '.'.
#
# If n=1: Path is (0,0) -> (1,0) -> ... -> (m-1, 0). Grid is just a column of '.'.
# If m=1: Path is (0,0) -> (0,1) -> ... -> (0, n-1). Grid is just a row of '.'.
#
# Let's consider the general case m>1, n>1.
#
# A robust strategy is to make all cells (i, j) a '.' if they lie on a simple "straight" path.
# The simplest path is to go right until the second to last column, then go down to the last row, then go right.
#
# Specifically, fill cells (i, j) with '.' if:
# 1. i = 0 and 0 <= j < n-1 (first row, excluding the last cell)
# 2. j = n-1 and 0 < i < m (last column, excluding the first cell) - This is WRONG, we can't reach (m-1, n-1) this way only.
#
# Let's try this path: (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> ... -> (m-1, n-2) -> (m-1, n-1)
#
# Cells to be '.':
# (0,0)
# (0,j) for 1 <= j <= n-2
# (i,n-2) for 1 <= i <= m-1
# (m-1, n-1)
#
# Let's reconstruct for m=2, n=3.
# Path: (0,0) -> (0,1) -> (1,1) -> (1,2)
# Cells: (0,0), (0,1), (1,1), (1,2) are '.'
#
# Grid construction:
# Initialize an m x n grid with '#'.
# Iterate through cells (i, j).
# If a cell (i, j) is part of our chosen single path, set it to '.'.
#
# Chosen path: (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> ... -> (m-1, n-2) -> (m-1, n-1)
#
# The set of cells on this path is:
# (0, k) for 0 <= k < n-1
# (k, n-2) for 1 <= k < m
# (m-1, n-1)  -- this is already covered by (k, n-2) if k=m-1
#
# So, cells (i, j) are '.' if:
# (i == 0 and 0 <= j < n-1) OR (j == n-2 and 1 <= i < m)
#
# Let's test this logic for m=2, n=3.
# Path cells:
# i=0, 0 <= j < 2: (0,0), (0,1)
# j=1, 1 <= i < 2: (1,1)
#
# So, cells (0,0), (0,1), (1,1) are '.'.
# The destination (m-1, n-1) = (1,2) must also be '.'.
#
# This logic misses the last cell (m-1, n-1) if n-1 = n-2, which is impossible.
#
# Let's redefine the path carefully:
# Path: (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> ... -> (m-1, n-2) -> (m-1, n-1)
#
# Example m=2, n=3:
# Path: (0,0) -> (0,1) -> (1,1) -> (1,2)
# Cells: (0,0), (0,1), (1,1), (1,2)
#
# Example m=3, n=3:
# Path: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
# Cells: (0,0), (0,1), (1,1), (1,2), (2,2)
#
# This suggests that cells (i, j) are '.' if they lie on this specific path.
# The path is defined by:
# Going right until the second-to-last column.
# Then going down until the last row.
# Then going right to the end.
#
# Let's create the grid:
# Initialize m x n grid of '#'.
#
# For i from 0 to m-1:
#   For j from 0 to n-1:
#     If (i == 0 and j < n-1) or (j == n-2 and i > 0 and i < m) or (i == m-1 and j == n-1):
#       This is not quite right.
#
# Let's simplify the rule.
# A cell (i, j) is on the path if we can reach it from (0,0) by moving only right/down,
# and from it, we can reach (m-1, n-1) by moving only right/down, and this is the *only* such sequence.
#
# Consider the path defined by cells (i, j) such that:
# (i + j) is within a certain range, and the path follows a specific "shape".
#
# The example for m=2, n=3 yields: ["..#","#.."]
# Path: (0,0) -> (0,1) -> (1,1) -> (1,2)
#
# The path cells are (i, j) such that:
# - If i=0, then j can be anything from 0 to n-2.
# - If i>0, then j must be such that we are "on the diagonal", specifically j = i or j = i-1 or something similar.
#
# A very simple construction that guarantees exactly one path is to make a single "corridor" of '.' cells.
#
# Make all cells (i, j) a '.' if i + j < m + n - 2.
# This doesn't work because (m-1, n-1) might be '#'.
#
# What if we define the path such that cells (i, j) are '.' if i + j < m + n - 2,
# EXCEPT for the end cell (m-1, n-1) which must be '.'.
#
# If m=2, n=3, m+n-2 = 3.
# Cells with i+j < 3: (0,0), (0,1), (0,2), (1,0), (1,1).
# If these are '.' and (1,2) is also '.':
# . . .
# . . .
# This has many paths.
#
# The trick must be to put '#' strategically.
#
# Consider the path that prioritizes right moves until the second-to-last column, then moves down.
# Path: (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> ... -> (m-1, n-2) -> (m-1, n-1)
#
# Let's try to identify which cells should be '.' for this path.
# Cells are '.' if they are on the path.
#
# For m=2, n=3:
# Path: (0,0) -> (0,1) -> (1,1) -> (1,2)
# Cells to be '.': (0,0), (0,1), (1,1), (1,2)
#
# Constructing the grid:
# Initialize all to '#'.
#
# For i from 0 to m-1:
#   For j from 0 to n-1:
#     If (i == 0 and j <= n-2) or (j == n-2 and i >= 1 and i <= m-1) or (i == m-1 and j == n-1):
#       This is still not covering all cases correctly for the general path.
#
# A much simpler approach that works for the constraints:
# Fill the entire grid with '.' initially.
# Then, iterate and fill cells with '#' such that only one path remains.
#
# Consider the path that goes right as much as possible, then down.
# (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1)
#
# To block alternative paths, we can place '#' strategically.
# For example, for cell (i, j), if i>0 and j>0, then either (i-1, j) or (i, j-1) must be '#'.
# This is too restrictive.
#
# The given examples strongly suggest a path that progresses somewhat diagonally.
#
# Let's examine the pattern in the examples:
# m=2, n=3: ["..#","#.."]
# Path: (0,0) -> (0,1) -> (1,1) -> (1,2)
#
# m=3, n=3: ["..#","#..","##."]
# Path: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
#
# In both cases, the path seems to be:
# (0,0) -> (0,1)
# then moves "diagonally" through (1,1)
# then moves "diagonally" to the end.
#
# The cells that are '.' seem to form a "diagonal band".
#
# Let's try the rule: A cell (i, j) is '.' if and only if (i + j) < m + n - 2.
# This rule doesn't work because (m-1, n-1) is not guaranteed to be '.'.
#
# The problem is asking for *any* grid.
# The simplest valid grid is when m=1 or n=1. In this case, all cells are '.', and there's only one path.
#
# For m > 1 and n > 1:
# Construct a grid where the path goes right along the first row up to the second to last column,
# then down along the second to last column to the last row, then right to the end.
#
# Path: (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> ... -> (m-1, n-2) -> (m-1, n-1)
#
# Cells to be '.':
# - (0, j) for 0 <= j < n-1
# - (i, n-2) for 1 <= i < m
# - (m-1, n-1)
#
# Let's test this precisely for m=2, n=3.
# Path cells:
# - (0, j) for 0 <= j < 2: (0,0), (0,1)
# - (i, 1) for 1 <= i < 2: (1,1)
# - (1, 2)
#
# Union of these sets: (0,0), (0,1), (1,1), (1,2).
# Grid:
# . . #
# # . .
# This matches example 1.
#
# Let's test for m=3, n=3.
# Path cells:
# - (0, j) for 0 <= j < 2: (0,0), (0,1)
# - (i, 1) for 1 <= i < 3: (1,1), (2,1)
# - (2, 2)
#
# Union: (0,0), (0,1), (1,1), (2,1), (2,2).
#
# Grid:
# . . #
# # . #
# # . .
#
# This doesn't match example 2: ["..#","#..","##."]
# Example 2 path: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
#
# The path in example 2 is:
# (0,0)
# (0,1)
# (1,1)
# (1,2)
# (2,2)
#
# This path has cells (i, j) such that:
# - (0,0), (0,1)
# - (1,1), (1,2)
# - (2,2)
#
# The construction of example 2's grid:
# ["..#",
#  "#..",
#  "##."]
#
# Let's look at the cells that are '.'
# (0,0), (0,1)
# (1,1), (1,2)
# (2,2)
#
# This path is constructed by going right until the second-to-last column of the first row,
# then going down to the second-to-last row, and then going right.
#
# The path seems to be:
# (0,0) -> (0,1) -> ... -> (0, n-2)
# then from (0, n-2) -> (1, n-2) -> ... -> (m-2, n-2)
# then from (m-2, n-2) -> (m-1, n-2)  -- this is wrong
#
# The path in example 2 is more like:
# (0,0) -> (0,1)
# then from (0,1) -> (1,1)
# then from (1,1) -> (1,2)
# then from (1,2) -> (2,2)
#
# This corresponds to a path that always moves right or down, and ensures that from any '.' cell,
# if you can move right and down to a new '.' cell, only one of those moves leads to a valid continuation.
#
# The simplest way to guarantee exactly ONE path is to create a single line of '.' cells.
#
# Let's try the simple path again:
# (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> ... -> (m-1, n-2) -> (m-1, n-1)
#
# Cells to be '.':
# (0,j) for 0 <= j < n-1  (Covers (0,0) to (0, n-2))
# (i, n-2) for 1 <= i < m  (Covers (1, n-2) to (m-1, n-2))
# (m-1, n-1) (The final destination)
#
# Let's check this definition.
# For m=2, n=3:
# (0,j) for 0 <= j < 2: (0,0), (0,1)
# (i, 1) for 1 <= i < 2: (1,1)
# (1, 2)
# Union: (0,0), (0,1), (1,1), (1,2). Correct for example 1.
#
# For m=3, n=3:
# (0,j) for 0 <= j < 2: (0,0), (0,1)
# (i, 1) for 1 <= i < 3: (1,1), (2,1)
# (2, 2)
# Union: (0,0), (0,1), (1,1), (2,1), (2,2).
#
# Grid:
# . . #
# # . #
# # . .
#
# This differs from example 2. But the problem asks for *any* valid grid.
# Let's verify if this grid has exactly one path.
# Path: (0,0) -> (0,1) -> (1,1) -> (2,1) -> (2,2)
#
# Let's examine other possibilities:
# From (0,0): Can go to (0,1) ('.'). Cannot go to (1,0) ('#').
# From (0,1): Can go to (0,2) ('#'). Can go to (1,1) ('.').
# From (1,1): Can go to (1,2) ('#'). Can go to (2,1) ('.').
# From (2,1): Can go to (2,2) ('.'). Cannot go to (3,1) (out of bounds).
# From (2,2): Destination.
#
# This construction indeed creates a single path.
#
# So the rule is:
# A cell (i, j) is '.' if:
#   (i == 0 and j < n - 1)  OR
#   (j == n - 2 and i > 0 and i < m) OR
#   (i == m - 1 and j == n - 1)
#
# Let's re-check the condition for the second part.
# The path goes down the column j = n-2.
# So, from (0, n-2), we can go to (1, n-2), (2, n-2), ..., (m-1, n-2).
#
# The cells on the path are:
# (0,0), (0,1), ..., (0, n-2)
# (1, n-2), (2, n-2), ..., (m-1, n-2)
# (m-1, n-1) - this last cell is covered if m-1 = m-1 and n-1 = n-2, which is not possible.
#
# Let's rewrite the path and cells more carefully:
#
# Path:
# (0,0) -> (0,1) -> ... -> (0, n-2)  (This is for n > 1)
# Then from (0, n-2) -> (1, n-2) -> ... -> (m-1, n-2)
# Then from (m-1, n-2) -> (m-1, n-1)
#
# So, cells that must be '.':
# 1. (0, j) for 0 <= j <= n-2  (If n=1, this range is empty, j=0 to -1. So it should be j < n-1)
#    If n=1, then j can only be 0. So range is (0,0).
#    If n>1, range is (0,0) to (0, n-2).
#
# 2. (i, n-2) for 1 <= i <= m-1 (If m=1, this range is empty, i=1 to 0. So it should be i > 0 and i < m)
#    If m=1, this part is not applicable (we are already at the bottom).
#    If m>1, range is (1, n-2) to (m-1, n-2).
#
# 3. (m-1, n-1)
#
# Let's handle edge cases m=1 or n=1.
# If m=1, grid is a single row. Path is (0,0) -> (0,1) -> ... -> (0, n-1). All cells are '.'.
# If n=1, grid is a single column. Path is (0,0) -> (1,0) -> ... -> (m-1, 0). All cells are '.'.
#
# If m=1, n=1, grid is ".".
#
# For m > 1 and n > 1:
# Initialize grid with '#'.
#
# For j from 0 to n-2:  # First row segment
#   grid[0][j] = '.'
#
# For i from 1 to m-1:  # Second to last column segment
#   grid[i][n-2] = '.'
#
# grid[m-1][n-1] = '.' # The destination
#
# Let's test this refined logic.
#
# m=2, n=3:
# grid = [['#', '#', '#'], ['#', '#', '#']]
# j from 0 to 3-2=1:
#   j=0: grid[0][0] = '.'
#   j=1: grid[0][1] = '.'
# grid is now: [['.', '.', '#'], ['#', '#', '#']]
#
# i from 1 to 2-1=1:
#   i=1: grid[1][3-2=1] = '.'
# grid is now: [['.', '.', '#'], ['#', '.', '#']]
#
# grid[2-1=1][3-1=2] = '.'
# grid[1][2] = '.'
# grid is now: [['.', '.', '#'], ['#', '.', '.']]
#
# This matches example 1.
#
# m=3, n=3:
# grid = [['#', '#', '#'], ['#', '#', '#'], ['#', '#', '#']]
# j from 0 to 3-2=1:
#   j=0: grid[0][0] = '.'
#   j=1: grid[0][1] = '.'
# grid is now: [['.', '.', '#'], ['#', '#', '#'], ['#', '#', '#']]
#
# i from 1 to 3-1=2:
#   i=1: grid[1][3-2=1] = '.'
#   i=2: grid[2][3-2=1] = '.'
# grid is now: [['.', '.', '#'], ['#', '.', '#'], ['#', '.', '#']]
#
# grid[3-1=2][3-1=2] = '.'
# grid[2][2] = '.'
# grid is now: [['.', '.', '#'], ['#', '.', '#'], ['#', '.', '.']]
#
# This is the grid I derived earlier, which is valid.
#
# Time complexity: O(m * n) for initializing and filling the grid.
# Space complexity: O(m * n) for storing the grid.
#
# Constraints: 1 <= m, n <= 25. O(m*n) is perfectly fine.
#
# Final check of the logic for m=1 or n=1.
# If m=1:
# j from 0 to n-2: grid[0][j] = '.'
# i loop (1 to 0) is skipped.
# grid[0][n-1] = '.'
# This correctly fills the entire first row with '.'.
#
# If n=1:
# j loop (0 to -1) is skipped.
# i from 1 to m-1: grid[i][1-2=-1] -> This will cause an index error.
#
# The logic needs adjustment for n=1.
#
# If n=1, the path is simply (0,0) -> (1,0) -> ... -> (m-1, 0). All cells are '.'.
# If m=1, the path is simply (0,0) -> (0,1) -> ... -> (0, n-1). All cells are '.'.
#
# So, if m=1 or n=1, return a grid of all '.'.
#
# Otherwise (m>1 and n>1):
# Construct the grid as planned.
#
# Grid construction for m>1, n>1:
# Initialize grid m x n with '#'.
#
# For j from 0 to n-2:
#   grid[0][j] = '.'
#
# For i from 1 to m-1:
#   grid[i][n-2] = '.'
#
# grid[m-1][n-1] = '.'
#
# This logic seems sound. The resulting grid represents the path:
# (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> ... -> (m-1, n-2) -> (m-1, n-1).
# All other cells are '#', blocking any alternative moves.
#
# For example, if we are at (0,0), we can only move to (0,1) because (1,0) will be '#'.
# If we are at (0, n-2), we can move to (0, n-1) which is '#', or move down to (1, n-2) which is '.'.
# If we are at (m-1, n-2), we can move right to (m-1, n-1) which is '.', or down (out of bounds).
#
# This construction guarantees exactly one path.

class Solution:
    def createGridWithOnePath(self, m: int, n: int) -> list[str]:
        # Handle the edge cases where m or n is 1.
        # In these cases, the grid is a single row or column, and there's only one possible path (all '.' cells).
        if m == 1 or n == 1:
            return ["." * n for _ in range(m)]

        # Initialize an m x n grid filled with obstacles ('#').
        # We will then carve out the single path by changing '#' to '.'
        grid = [['#' for _ in range(n)] for _ in range(m)]

        # Define the single path:
        # The path goes right along the first row up to the second-to-last column.
        # Then, it goes down along the second-to-last column to the last row.
        # Finally, it moves to the bottom-right corner cell.

        # 1. Path segment along the first row (from (0,0) to (0, n-2)).
        #    This segment is cells (0, j) where 0 <= j < n-1.
        #    Note: n-1 is the index of the last column. We go up to the second-to-last column (index n-2).
        for j in range(n - 1):
            grid[0][j] = '.'

        # 2. Path segment down the second-to-last column (from (1, n-2) to (m-1, n-2)).
        #    This segment is cells (i, n-2) where 1 <= i < m.
        #    We start from the second row (index 1) because the first row (index 0) is already handled.
        #    We go down to the last row (index m-1).
        for i in range(1, m):
            grid[i][n - 2] = '.'

        # 3. The final destination cell (m-1, n-1).
        #    This cell must be part of the path.
        grid[m - 1][n - 1] = '.'

        # Convert the 2D list of characters into a list of strings, as required by the output format.
        result_grid = ["".join(row) for row in grid]
        return result_grid

```