```javascript
/**
 * @param {number} m
 * @param {number} n
 * @return {string[]}
 */
// Problem Summary: Construct an m x n grid with '.' and '#' such that there is exactly one path from (0,0) to (m-1, n-1) moving only right or down.
// Link: https://leetcode.com/problems/create-grid-with-exactly-one-path/
// Approach:
// The simplest way to guarantee exactly one path is to create a "straight" path of free cells
// and block all other possibilities with obstacles.
// A common strategy is to create a diagonal-like path.
// For instance, we can make all cells (i, j) a '.' if i + j < (m - 1) + (n - 1),
// and then strategically place '#' to force the single path.
// A simpler and more robust approach is to create a path that goes mostly right and then mostly down,
// or vice-versa, and fill the rest with obstacles.
// Let's try a simpler approach:
// Fill the grid such that the path goes from (0,0) to (0, n-1) and then from (0, n-1) to (m-1, n-1)
// or from (0,0) to (m-1, 0) and then from (m-1, 0) to (m-1, n-1).
//
// A more direct way to ensure exactly one path is to create a "bent" path.
// For example, make a path from (0,0) to (0, n-1) and then down to (m-1, n-1).
// This means cells (0, j) for 0 <= j < n should be '.',
// and cells (i, n-1) for 0 < i < m should be '.'.
// All other cells are '#'.
// However, the problem statement for Example 1 and 2 suggests a different pattern.
//
// Let's analyze the examples:
// Example 1: m=2, n=3 -> ["..#", "#.."]
// Path: (0,0) -> (0,1) -> (1,1) -> (1,2)
// Grid:
// . . #
// # . .
// This path moves right twice and then down once.
//
// Example 2: m=3, n=3 -> ["..#", "#..", "##."]
// Path: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
// Grid:
// . . #
// # . .
// # # .
// This path moves right once, down once, right once, down once.
//
// The examples suggest a pattern where the path essentially forms a "staircase" or a diagonal line
// with some obstacles.
//
// A robust way to create exactly one path is to force a specific path.
// Consider a path that goes all the way right and then all the way down:
// (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1)
// To ensure this is the ONLY path, we need to block all alternative routes.
//
// Let's try to construct a path that uses cells (i, j) where i + j is "small".
// The minimum value of i+j is 0 at (0,0).
// The maximum value of i+j is (m-1) + (n-1) at (m-1, n-1).
//
// The path in Example 1 and 2 seems to follow cells where i+j is relatively small.
//
// Let's try to create a path that uses cells (i, j) where i + j <= k for some k.
// For a single path, we can make a "bent" path.
// For example, make cells (0, j) for 0 <= j < n-1 to be '.', and cells (i, n-1) for 0 < i < m to be '.'.
// This creates a path: (0,0) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1).
// To make it unique, we must place '#' strategically.
//
// A very simple strategy that guarantees a path is to make all cells '.', which gives many paths.
// To get exactly one path, we must introduce obstacles.
//
// Consider the path: (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1).
// This path covers cells (0, j) for j from 0 to n-1, and (i, n-1) for i from 0 to m-1.
//
// Let's try filling the grid with '.' initially and then place '#'.
// If we make all cells '.' then there are many paths.
//
// The examples suggest that the path often stays in the top-left quadrant of the grid.
//
// Let's consider a pattern where we make a "diagonal" path of free cells and fill everything else with '#'.
//
// A simple construction:
// Make cells (i, j) a '.' if i < m-1 and j < n-1. This essentially creates a path that can go right or down.
// This doesn't guarantee a single path.
//
// The problem statement says "Construct ANY grid". This implies we don't need to find the most optimal or shortest.
//
// Let's use the strategy from Example 1 and 2 as inspiration.
// They seem to create a path that progresses generally towards the bottom-right.
//
// Consider a path that goes right as much as possible and then down as much as possible:
// (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1)
//
// To force this path, we can set:
// grid[0][j] = '.' for all 0 <= j < n
// grid[i][n-1] = '.' for all 0 <= i < m
//
// Now, how to block all other paths?
// Any path must reach (0, n-1) to then go down to (m-1, n-1).
// Or it must reach (m-1, 0) to then go right to (m-1, n-1).
//
// Let's consider the path that goes down first, then right:
// (0,0) -> (1,0) -> ... -> (m-1, 0) -> (m-1, 1) -> ... -> (m-1, n-1)
// This path uses cells (i, 0) for 0 <= i < m and (m-1, j) for 0 <= j < n.
//
// We can choose one of these two "straight" paths and then add obstacles to block any deviations.
//
// Let's try the first one: path goes right along the top row, then down along the rightmost column.
// Cells on this path: (0,0), (0,1), ..., (0, n-1), (1, n-1), ..., (m-1, n-1).
//
// To block other paths, we need to make sure no other sequence of moves reaches (m-1, n-1).
//
// A simple pattern that works is to create a "diagonal-like" path.
// For example, make cells (i, j) a '.' if i + j <= m + n - 3.
// This creates a diagonal of '.' cells.
//
// Let's try to make a grid that has a single path, similar to the examples.
//
// The examples seem to have a pattern where the path makes a "bend" at some point.
//
// Consider the simplest possible "bent" path:
// (0,0) -> (0,1) -> ... -> (0, k) -> (1, k) -> ... -> (m-1, k) -> (m-1, k+1) -> ... -> (m-1, n-1)
// This is too complex to fill.
//
// A very simple and guaranteed approach to create EXACTLY ONE path is to make a single line of '.'
// and fill the rest with '#'.
// For example, if m=1, we can have ["...."]. The only path is right.
// If n=1, we can have ["." , "." , "."]. The only path is down.
//
// For m > 1 and n > 1, we need a path that involves both right and down moves.
//
// The strategy from the examples:
// Make a path that generally moves right and down.
//
// Let's try this construction:
//
// 1. Initialize an m x n grid with all '#'.
// 2. Create a path of '.' from (0,0) to (m-1, n-1).
//    A simple path is to go right until column n-1, then go down until row m-1.
//    Set `grid[0][j] = '.'` for `0 <= j < n`.
//    Set `grid[i][n-1] = '.'` for `0 <= i < m`.
//    This creates the path (0,0) -> ... -> (0, n-1) -> ... -> (m-1, n-1).
//
//    Now, we need to ensure this is the ONLY path.
//    Consider any other path. It must deviate from this initial path.
//
//    Let's refine the path:
//    Path: (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> (1, n-1) -> ... -> (m-1, n-1)
//    This path looks like:
//    (0,0) .
//    (0,1) .
//    ...
//    (0, n-2) .
//    (1, n-2) .
//    (1, n-1) .
//    ...
//    (m-1, n-1) .
//
//    This is not quite right for guaranteeing a unique path.
//
// Let's reconsider the examples:
// Example 1: m=2, n=3 -> ["..#","#.."]
// Path: (0,0) -> (0,1) -> (1,1) -> (1,2)
// Grid:
// . . #
// # . .
//
// Example 2: m=3, n=3 -> ["..#","#..","##."]
// Path: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
// Grid:
// . . #
// # . .
// # # .
//
// These examples suggest a path that moves right, then down, then right, then down...
// The key seems to be that for any cell (i, j) on the path (except the last),
// either (i+1, j) or (i, j+1) must be an obstacle, *unless* it's the unique next step on the path.
//
// The simplest way to create exactly one path is to make a "bent" line of free cells.
// For example, go right from (0,0) to (0, n-1), then go down from (0, n-1) to (m-1, n-1).
//
// Let's try this:
// Set `grid[0][j] = '.'` for `0 <= j < n`.
// Set `grid[i][n-1] = '.'` for `0 <= i < m`.
//
// This path is: (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1).
//
// What if we make `grid[0][j] = '#'` for `0 <= j < n-1`?
// This would force the path to go down first.
//
// A consistent pattern from the examples:
// The path seems to always start with (0,0) -> (0,1).
// Then it might go down or right.
//
// Consider filling the grid such that:
// `grid[i][j] = '.'` if `i + j < m + n - 2`
// `grid[i][j] = '#'` if `i + j >= m + n - 2`
// This creates a diagonal boundary. This will result in multiple paths as well.
//
// Let's try to force the path from Example 2: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
//
// Grid:
// . . #
// # . .
// # # .
//
// The path cells are: (0,0), (0,1), (1,1), (1,2), (2,2).
//
// Let's generalize this pattern.
// The path moves right, then down, then right, then down.
//
// For cell (i, j):
// If `i == 0` and `j < n-1`: the path moves right to (0, j+1).
//   So, `grid[0][j] = '.'`.
//   If `j+1 < n-1`, then `grid[0][j+1]` should be '.' for the path.
//
//   Consider the example: m=3, n=3
//   Path cells: (0,0), (0,1), (1,1), (1,2), (2,2)
//
//   grid[0][0] = '.' (start)
//   grid[0][1] = '.' (move right to (0,1))
//   grid[0][2] = '#' (cannot move right from (0,1) to (0,2) and then down)
//
//   grid[1][0] = '#' (cannot move down from (0,0) to (1,0))
//   grid[1][1] = '.' (move down from (0,1) to (1,1))
//   grid[1][2] = '.' (move right from (1,1) to (1,2))
//
//   grid[2][0] = '#' (cannot move down from (1,0) or right from (2,0))
//   grid[2][1] = '#' (cannot move down from (1,1) to (2,1) or right from (2,0) to (2,1))
//   grid[2][2] = '.' (move down from (1,2) to (2,2))
//
// The pattern appears to be:
// Fill the grid with '#'.
// Then, set specific cells to '.' to form the path.
//
// For the path (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2) (m=3, n=3):
// We need `grid[0][0]`, `grid[0][1]`, `grid[1][1]`, `grid[1][2]`, `grid[2][2]` to be '.'.
//
// Let's generalize this.
// We want to create a path that looks like:
// (0,0) .
// (0,1) .
// (1,1) .
// (1,2) .
// (2,2) .
// ...
//
// This suggests that if `i == j`, the cell might be on the path.
// Or if `i == k` and `j == k+1`, or `i == k+1` and `j == k`.
//
// Consider a simple "bent" path.
// Path 1: (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1).
// This path uses cells (0, j) for `0 <= j < n` and (i, n-1) for `0 <= i < m`.
// To make it unique, we need to place '#' strategically.
//
// A very simple construction that works for any m, n:
//
// Fill the grid with '.'
// Then, add obstacles to block all but one path.
//
// Simplest path:
// Go right `n-1` times, then down `m-1` times.
// Cells: (0,0), (0,1), ..., (0, n-1), (1, n-1), ..., (m-1, n-1).
//
// Let's try to make a grid where only one path exists.
//
// If we make a grid where all cells are '.', there are many paths.
//
// What if we make a path of '.' cells, and all other cells are '#'?
//
// Example: m=3, n=3
//
// Grid:
// . # #
// . # #
// . . .
// Path: (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2). This is one path.
//
// Grid:
// . . .
// # . #
// # . .
// Path: (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2) -- NOT POSSIBLE because (1,2) is '#'.
// Path: (0,0) -> (0,1) -> (1,1) -> (2,1) -> (2,2). This is one path.
//
// The examples suggest a path that is not strictly horizontal then vertical.
//
// Let's analyze the path moves again from Example 2:
// (0,0) -> (0,1) (Right)
// (0,1) -> (1,1) (Down)
// (1,1) -> (1,2) (Right)
// (1,2) -> (2,2) (Down)
//
// This pattern suggests: move right, then down, then right, then down.
// This can be generalized:
// At cell (i, j):
// If we are on the path and the next move is Right to (i, j+1), then `grid[i][j] = '.'` and `grid[i][j+1] = '.'`.
// If we are on the path and the next move is Down to (i+1, j), then `grid[i][j] = '.'` and `grid[i+1][j] = '.'`.
//
// To ensure uniqueness, we must place obstacles.
//
// Consider a path where we alternate moves as much as possible.
// (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2) ...
//
// Let's make a grid where only one cell is '.' at each "step" of the path.
//
// For a cell `(i, j)` on the path, the next cell `(i', j')` must be reachable by only one move.
// And all other adjacent cells from `(i, j)` must be '#'.
//
// Let's use the strategy from the examples:
// Create a grid of '#' initially.
// Then, draw a single path of '.' cells.
//
// Path for m=3, n=3: (0,0), (0,1), (1,1), (1,2), (2,2).
//
// `grid[0][0] = '.'`
// `grid[0][1] = '.'`
// `grid[1][1] = '.'`
// `grid[1][2] = '.'`
// `grid[2][2] = '.'`
//
// All other cells are '#'.
//
// This is hard to generalize programmatically.
//
// Let's think about the constraints: m, n <= 25. This is small.
//
// Simplest guaranteed construction:
//
// Create a grid of all '.'.
// Then, place obstacles.
//
// If we place a single obstacle, it might block the path.
//
// The problem asks for ANY grid.
//
// Consider the path: (0,0) -> (1,0) -> (2,0) -> ... -> (m-1, 0) -> (m-1, 1) -> ... -> (m-1, n-1).
// This is a path going all the way down, then all the way right.
// Cells: `(i, 0)` for `0 <= i < m`, and `(m-1, j)` for `0 <= j < n`.
//
// To make this the ONLY path:
// Set `grid[i][0] = '.'` for `0 <= i < m`.
// Set `grid[m-1][j] = '.'` for `0 <= j < n`.
//
// Now, we need to block all other paths.
// Any path that deviates from this must not reach (m-1, n-1).
//
// Consider filling the grid with '.' initially.
// Then, place obstacles at `grid[i][j] = '#'` for `i > 0` and `j > 0` and `i + j > 1`.
// This creates a path that is forced to stay in the top-left.
//
// Let's try the following construction which guarantees a single path:
//
// 1. Initialize an m x n grid with all '.' characters.
// 2. Create a path by making specific cells '#'.
//    The path we want to preserve is roughly diagonal.
//    For instance, cells (i, j) where i + j < m + n - 2.
//
//    A simpler approach:
//    Make the path (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1).
//    This path uses cells:
//    `grid[0][j] = '.'` for `0 <= j < n`.
//    `grid[i][n-1] = '.'` for `0 <= i < m`.
//
//    To ensure this is the ONLY path, we must block all other ways to reach (m-1, n-1).
//
//    What if we make `grid[i][j] = '#'` for all `i > 0` and `j > 0` such that `i < m-1` and `j < n-1`?
//    This would force the path to stay on the boundaries.
//
//    Let's try a path that is simply a straight line of '.' with '#' everywhere else.
//    This is only possible if m=1 or n=1.
//
//    Example 1: m=2, n=3 -> ["..#","#.."]
//    Path: (0,0) -> (0,1) -> (1,1) -> (1,2)
//
//    Let's consider the cells that are NOT on this path.
//    (0,2) is '#'.
//    (1,0) is '#'.
//
//    It seems like if we have a path, we can make any cell that is "off" the path a '#'.
//
//    A simple construction that works:
//    Create a grid where the only path is a "bent" line.
//    Specifically, make the path go from (0,0) to (0, n-1) then down to (m-1, n-1).
//
//    Initialize grid with all '.'.
//    Then, strategically place '#' to block alternative paths.
//
//    Consider this:
//    `grid[i][j] = '.'` if `i == 0` or `j == n-1`. (Top row and rightmost column).
//    This path is (0,0) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1).
//
//    Now, we need to block all other paths.
//    Any other path must use a cell `(i, j)` where `i > 0` and `j < n-1`.
//
//    Let's try to make all cells `grid[i][j] = '#'` if `i > 0` and `j < n-1`.
//
//    Example: m=3, n=3
//    Grid should be:
//    . . . (i=0, j=0,1,2)
//    # # . (i=1, j=0,1,2. If j < n-1 (j<2), then #. So grid[1][0]='#', grid[1][1]='#'. grid[1][2]='.')
//    # # . (i=2, j=0,1,2. If j < n-1 (j<2), then #. So grid[2][0]='#', grid[2][1]='#'. grid[2][2]='.')
//
//    Resulting grid:
//    . . .
//    # # .
//    # # .
//    Path: (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2). This is one path.
//
//    Let's verify this general construction:
//    Initialize an m x n grid of '#'.
//    Set `grid[0][j] = '.'` for `0 <= j < n`. // Top row is free
//    Set `grid[i][n-1] = '.'` for `0 <= i < m`. // Rightmost column is free
//
//    The cells on this path are:
//    (0,0), (0,1), ..., (0, n-1)
//    (1, n-1), (2, n-1), ..., (m-1, n-1)
//
//    This forms a single continuous path.
//    Any other path would have to go through a cell `(i, j)` where `i > 0` and `j < n-1`.
//    If we fill all such cells with '#', then the only way to reach `(m-1, n-1)` is via the path defined.
//
//    Let's try constructing the grid this way:
//    Initialize `grid` with all '#'.
//    For `j` from `0` to `n-1`: `grid[0][j] = '.'`
//    For `i` from `0` to `m-1`: `grid[i][n-1] = '.'`
//
//    Let's test with examples:
//    m=2, n=3
//    Initialize:
//    # # #
//    # # #
//
//    Set top row:
//    . . .
//    # # #
//
//    Set rightmost column:
//    . . .
//    # # .
//
//    Output: [ "..", "#." ] for m=2, n=3. This is wrong. The example output is ["..#","#.."].
//
//    The chosen path for Example 1 was: (0,0) -> (0,1) -> (1,1) -> (1,2).
//
//    Let's use the pattern from the examples:
//    The path essentially makes a "staircase" or diagonal.
//
//    If we set `grid[i][j] = '.'` if `i + j < m + n - 2` (for the path), and the rest '#'.
//    This doesn't guarantee a single path.
//
//    The simplest construction that guarantees exactly one path is to make a "bent" line of free cells and block all other options.
//    Let's make the path go from (0,0) to (0, n-1) and then down to (m-1, n-1).
//
//    Grid:
//    . . . . .
//    . . . . #
//    . . . . #
//    . . . . #
//
//    Path: (0,0) -> (0,1) -> (0,2) -> (0,3) -> (1,3) -> (2,3) -> (3,3)
//
//    Let's try to implement this general strategy that works:
//    Fill the grid with '.'
//    Then add obstacles to ensure a single path.
//
//    The simplest unique path is to make a single "channel" of '.'
//
//    Consider making the path:
//    (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> (1, n-1) -> ... -> (m-2, n-1) -> (m-1, n-1)
//
//    This is still complex.
//
//    Let's analyze the examples again very carefully.
//    Example 1: m=2, n=3. Output: ["..#","#.."]
//    Path: (0,0) -> (0,1) -> (1,1) -> (1,2)
//    The cells on the path are (0,0), (0,1), (1,1), (1,2).
//    The obstacles are at (0,2) and (1,0).
//    Notice that `grid[0][0] = '.'`, `grid[0][1] = '.'`, `grid[1][1] = '.'`, `grid[1][2] = '.'`.
//    And `grid[0][2] = '#'`, `grid[1][0] = '#'`.
//
//    Example 2: m=3, n=3. Output: ["..#","#..","##."]
//    Path: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
//    Path cells: (0,0), (0,1), (1,1), (1,2), (2,2).
//    Obstacles: (0,2), (1,0), (2,0), (2,1).
//    Grid:
//    . . #
//    # . .
//    # # .
//
//    The general pattern from these examples is:
//    Initialize all cells to '#'.
//    Then, set the cells that form the single path to '.'.
//
//    What is the path? It seems to be a "bent diagonal".
//    It goes right as much as possible, then down, then right, etc.
//
//    Consider the cells `(i, j)` such that `i + j` is "small".
//    The path cells in Example 2 are:
//    (0,0) sum=0
//    (0,1) sum=1
//    (1,1) sum=2
//    (1,2) sum=3
//    (2,2) sum=4
//
//    The path consists of cells `(i, j)` where `i + j <= m + n - 3`. This is not quite right.
//
//    Let's try to construct the grid by making a diagonal-like path:
//    Set `grid[i][j] = '.'` for `i + j <= k`, and '#' otherwise.
//    This will not yield a single path.
//
//    The problem is simple enough that there should be a straightforward constructive method.
//
//    Consider filling the grid such that the path moves right, then down.
//    Path: (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1).
//
//    Let's try constructing this path and filling the rest with obstacles.
//
//    Initialize grid with all '#'.
//    Set `grid[0][j] = '.'` for `0 <= j < n`.
//    Set `grid[i][n-1] = '.'` for `0 <= i < m`.
//
//    This creates a path. Now, how to make it unique?
//    Consider the cell `grid[0][n-1]`. It's on the top row and rightmost column.
//    This cell is part of the "horizontal" segment and the "vertical" segment of our defined path.
//
//    If we set `grid[0][j] = '.'` for all `j`, and `grid[i][n-1] = '.'` for all `i`,
//    we have made the entire top row and entire rightmost column free.
//    This creates a structure where any cell `(i, j)` with `i > 0` and `j < n-1` is an obstacle.
//
//    Let's try the construction:
//    Create an m x n grid of '#'.
//    Set `grid[0][j] = '.'` for `0 <= j < n-1`. // Path goes right on the top row, leaving the last column for a potential bend.
//    Set `grid[i][n-1] = '.'` for `0 <= i < m`. // Path goes down the last column.
//
//    Example m=3, n=3:
//    Initialize:
//    # # #
//    # # #
//    # # #
//
//    Set `grid[0][j] = '.'` for `j = 0, 1`:
//    . . #
//    # # #
//    # # #
//
//    Set `grid[i][n-1] = '.'` for `i = 0, 1, 2` (n-1 = 2):
//    . . .
//    # # .
//    # # .
//
//    This gives ["..", "#.", "#."]. This is still not matching the examples.
//
//    The examples' paths:
//    Ex1: (0,0)->(0,1)->(1,1)->(1,2)
//    Ex2: (0,0)->(0,1)->(1,1)->(1,2)->(2,2)
//
//    The pattern of cells is:
//    (0,0) -> Right -> (0,1)
//    (0,1) -> Down -> (1,1)
//    (1,1) -> Right -> (1,2)
//    (1,2) -> Down -> (2,2)
//
//    This suggests a "staircase" pattern of '.' cells.
//
//    Let's try to fill the grid based on this pattern.
//    Initialize grid with '#'.
//    Iterate through the grid. If a cell `(i, j)` is part of the desired path, set it to '.'.
//
//    The condition for a cell `(i, j)` to be on *a* unique path might be related to its "distance" from the start/end.
//
//    Let's try the simplest general construction that guarantees a path:
//    Create a grid where all cells are '.', which gives many paths.
//    Then add obstacles.
//
//    Consider the path: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2) -> ... -> (m-1, n-1).
//    This path consists of cells (i, j) where either i = j, or one step is horizontal and the next is vertical.
//
//    A simple construction that works is to create a bent path of '.' and fill all other cells with '#'.
//    Path: (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1).
//    The cells on this path are `(0, j)` for `0 <= j < n` and `(i, n-1)` for `0 <= i < m`.
//
//    To make this the unique path, we must ensure no other moves are possible.
//    Set `grid[i][j] = '#'` for all `i > 0` and `j < n-1`.
//
//    This leads to:
//    `grid[0][j] = '.'` for `0 <= j < n`. (Top row is free)
//    `grid[i][n-1] = '.'` for `0 <= i < m`. (Rightmost column is free)
//    `grid[i][j] = '#'` for `i > 0` and `j < n-1`. (All other cells are blocked)
//
//    Let's re-test this strategy with the examples:
//
//    Example 1: m=2, n=3
//    Initialize grid of '#'.
//    `grid[0][j] = '.'` for `j = 0, 1, 2`:
//    . . .
//    # # #
//
//    `grid[i][n-1] = '.'` for `i = 0, 1` (n-1 = 2):
//    . . .
//    # # .
//
//    Now, apply `grid[i][j] = '#'` for `i > 0` and `j < n-1`:
//    `i = 1`, `j = 0, 1`.
//    So `grid[1][0] = '#'`, `grid[1][1] = '#'.`
//
//    Final grid:
//    . . .
//    # # .
//
//    Output: ["..", "#."]. This is incorrect according to Example 1 output ["..#","#.."].
//
//    The issue is that my constructed path is too simple and doesn't match the examples' paths.
//
//    Let's try the path construction from Example 2:
//    (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2)
//
//    This path can be characterized by the cells `(i, j)` where `i + j < m + n - 2`.
//    No, this is not a direct relation.
//
//    The path cells have `i <= j` and `i < m`, `j < n`.
//
//    Let's use the simplest construction that satisfies the problem.
//    We need to guarantee EXACTLY ONE path.
//
//    Consider filling the grid with '.' initially.
//    Then, place obstacles.
//
//    The simplest path: go right `n-1` times, then down `m-1` times.
//    Path: (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1).
//
//    Let's modify this path slightly to match the examples.
//    Path: (0,0) -> (0,1) -> ... -> (0, n-2) -> (1, n-2) -> (1, n-1) -> ... -> (m-1, n-1).
//
//    A key observation: the problem statement is "Construct ANY grid".
//    This means we can choose a simple structure.
//
//    What if we make a grid with only one '.' cell? That won't work.
//
//    Let's try the pattern from Example 2:
//    The path cells are (i, j) such that `i + j <= k` for some `k`.
//    No, this is not accurate.
//
//    Consider the path: (0,0) -> (0,1) -> (1,1) -> (1,2) -> (2,2) ...
//    The general rule might be:
//    If `i == j` or `i == j-1`, the cell is potentially on the path.
//
//    Let's try a construction where the path is essentially a bent line.
//    Path: Go right `n-1` times, then down `m-1` times.
//    (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1).
//
//    To make this the unique path:
//    Set `grid[i][j] = '.'` if `i = 0` or `j = n-1`.
//    Set `grid[i][j] = '#'` otherwise.
//
//    Example m=2, n=3:
//    `grid[0][j] = '.'` for `j = 0, 1, 2`:
//    . . .
//    # # #
//
//    `grid[i][n-1] = '.'` for `i = 0, 1` (n-1 = 2):
//    . . .
//    # # .
//
//    This yields ["..", "#."]. Still not matching.
//
//    The issue is that the *examples* have specific path structures.
//    The problem is asking for ANY valid grid.
//
//    Let's re-read the problem: "Construct ANY m x n grid ... where there is EXACTLY ONE valid path".
//
//    The simplest way to guarantee a single path is to make a single "channel" of '.' cells.
//
//    Path: (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1).
//    This path is formed by cells in the first row and the last column.
//
//    Let's try filling the grid with '#' and then drawing this path.
//
//    Initialize grid with '#'.
//    `grid[0][j] = '.'` for `0 <= j < n`.
//    `grid[i][n-1] = '.'` for `0 <= i < m`.
//
//    Consider the union of these two sets of cells.
//    If `i=0`, cell is `(0, j)`.
//    If `j=n-1`, cell is `(i, n-1)`.
//    The cell `(0, n-1)` is in both sets.
//
//    The set of free cells is:
//    `{(0, j) | 0 <= j < n}` U `{(i, n-1) | 0 <= i < m}`.
//
//    Example m=2, n=3:
//    `{(0,0), (0,1), (0,2)}` U `{(0,2), (1,2)}`
//    = `{(0,0), (0,1), (0,2), (1,2)}`.
//
//    Grid:
//    . . .
//    # # .
//
//    Output: ["...", "#."]. This is a valid grid with ONE path: (0,0)->(0,1)->(0,2)->(1,2).
//    This IS a valid solution, even if it doesn't match the specific examples given.
//    The problem asks for ANY such grid.
//
//    Let's double check if this strategy always produces a single path.
//    The free cells form an "L" shape.
//    Any path from (0,0) to (m-1, n-1) must use only right and down moves.
//    To reach (m-1, n-1), any path must eventually reach either row `m-1` or column `n-1`.
//
//    Path must consist of cells `(i, j)` where `i` increases or `j` increases.
//
//    Consider any path from (0,0) to (m-1, n-1) using only '.' cells in our constructed grid.
//    The free cells are `(0, j)` and `(i, n-1)`.
//
//    To reach (m-1, n-1), a path must end with a move that lands on (m-1, n-1).
//    This move can be from (m-2, n-1) (down) or (m-1, n-2) (right).
//
//    In our grid:
//    - (m-2, n-1) is a free cell if `m-2 >= 0` and `n-1 == n-1`. Yes, if `m > 0`.
//    - (m-1, n-2) is a free cell if `m-1 == 0` or `n-2 == n-1`.
//      - `m-1 == 0` means `m=1`. In this case, the path is just the top row.
//      - `n-2 == n-1` is impossible.
//
//    Let's analyze the path structure:
//    The free cells form the first row and the last column.
//    `{(0, j) | 0 <= j < n}` U `{(i, n-1) | 0 <= i < m}`.
//
//    Any path must start at (0,0).
//    From (0,0), the only allowed moves are to (0,1) (if it's '.') or (1,0) (if it's '.').
//    In our grid, (0,1) is '.', but (1,0) is '#' if `1 > 0` and `0 < n-1`.
//    If `n=1`, then `0 < n-1` is false, so `(1,0)` could be '.', but our rule for `(i, n-1)` covers `(i, 0)`.
//
//    Case 1: `n = 1`.
//    Free cells: `{(0, 0)}` U `{(i, 0) | 0 <= i < m}` = `{(i, 0) | 0 <= i < m}`.
//    Grid is a single column of '.'. Path: (0,0) -> (1,0) -> ... -> (m-1,0). Unique.
//
//    Case 2: `m = 1`.
//    Free cells: `{(0, j) | 0 <= j < n}` U `{(0, n-1)}` = `{(0, j) | 0 <= j < n}`.
//    Grid is a single row of '.'. Path: (0,0) -> (0,1) -> ... -> (0,n-1). Unique.
//
//    Case 3: `m > 1` and `n > 1`.
//    Free cells: `{(0, j) | 0 <= j < n}` U `{(i, n-1) | 0 <= i < m}`.
//    The cell (0,0) is free. Allowed moves:
//    - To (0,1): This is free since `0 < n`.
//    - To (1,0): This is '#' if `1 > 0` and `0 < n-1`. This is true if `n > 1`.
//      So, if `n > 1`, the first move must be to (0,1).
//
//    Once on the first row, say at `(0, k)` where `k < n-1`:
//    Allowed moves:
//    - To `(0, k+1)`: This is free since `k+1 < n`.
//    - To `(1, k)`: This is '#' since `1 > 0` and `k < n-1`.
//    So, on the first row, the path must always move right.
//
//    When the path reaches `(0, n-1)`:
//    Allowed moves:
//    - To `(0, n)`: Out of bounds.
//    - To `(1, n-1)`: This is free since `1 <= m-1` (as `m > 1`).
//    So, the path must move down to `(1, n-1)`.
//
//    Once on the last column, say at `(k, n-1)` where `k < m-1`:
//    Allowed moves:
//    - To `(k, n)`: Out of bounds.
//    - To `(k+1, n-1)`: This is free since `k+1 <= m-1`.
//    So, on the last column, the path must always move down.
//
//    This confirms that the path must be: (0,0) -> (0,1) -> ... -> (0, n-1) -> (1, n-1) -> ... -> (m-1, n-1).
//    This is exactly ONE path.
//
//    So, the construction is:
//    1. Create an m x n grid filled with '#'.
//    2. For `j` from 0 to `n-1`, set `grid[0][j] = '.'`.
//    3. For `i` from 0 to `m-1`, set `grid[i][n-1] = '.'`.
//    4. Convert the 2D array of characters into an array of strings.
//
//    This is a valid approach. The time complexity will be O(m*n) to initialize and then O(m+n) to set the path. Space complexity is O(m*n) for the grid.
//
//    Constraints: 1 <= m, n <= 25. This approach is efficient enough.
//
// Time Complexity: O(m * n) - For initializing the grid and then iterating through the first row and last column.
// Space Complexity: O(m * n) - To store the grid.

var createGridWithExactlyOnePath = function(m, n) {
    // Initialize an m x n grid with '#' characters.
    // Each row will be an array of characters.
    const grid = Array(m).fill(null).map(() => Array(n).fill('#'));

    // Create the path:
    // Set all cells in the first row to '.'
    for (let j = 0; j < n; j++) {
        grid[0][j] = '.';
    }

    // Set all cells in the last column to '.'
    // This extends the path from the end of the first row down to the bottom-right cell.
    for (let i = 0; i < m; i++) {
        grid[i][n - 1] = '.';
    }

    // Convert the 2D array of characters into an array of strings.
    // Each string represents a row in the grid.
    const result = grid.map(row => row.join(''));

    return result;
};
```