/*
Problem Summary:
Find the three largest distinct sums of elements forming the border of a 45-degree rotated square (rhombus) in a given grid. A rhombus can have an area of 0 (a single cell). Return the sums in descending order.

Problem Link:
https://leetcode.com/problems/get-biggest-three-rhombus-sums-in-a-grid

Approach Explanation:
The problem asks for the biggest three *distinct* rhombus sums. Since the grid dimensions are small (up to 50x50), a brute-force approach to iterate through all possible rhombuses and calculate their sums is feasible.

1.  **Iterate through all possible top-most corner cells (r, c) of a rhombus:**
    A rhombus is defined by its top-most corner (r, c) and its 'extent' or 'size'. The size of a rhombus can be thought of as the distance from its center to any of its four corners. If a rhombus has a top corner at (r, c), its size `k` determines the positions of the other corners:
    - Top: (r, c)
    - Right: (r + k, c + k)
    - Bottom: (r + 2k, c)
    - Left: (r + k, c - k)
    where `k` is a positive integer representing half the length of the diagonal.
    If `k=0`, the rhombus is just a single cell at (r, c). This is an area-0 rhombus.

2.  **Calculate Rhombus Sums:**
    For each potential top-most corner (r, c) and each possible size `k` (from 0 up to `min(m, n)/2` approximately, ensuring all corners stay within bounds):
    - **Case k = 0 (Area 0 Rhombus):** The sum is simply `grid[r][c]`. Add this to a set to maintain distinct sums.
    - **Case k > 0 (Regular Rhombus):**
        The sum involves four segments of cells.
        - Segment 1 (Top-Right): From (r, c) to (r+k, c+k).
        - Segment 2 (Right-Bottom): From (r+k, c+k) to (r+2k, c).
        - Segment 3 (Bottom-Left): From (r+2k, c) to (r+k, c-k).
        - Segment 4 (Left-Top): From (r+k, c-k) to (r, c).
        Each corner cell is counted once. The elements on the border are added up.
        The formula for a rhombus sum of size `k` starting at `(r, c)`:
        `sum = grid[r][c]` (top)
             `+ grid[r + k][c + k]` (right)
             `+ grid[r + 2 * k][c]` (bottom)
             `+ grid[r + k][c - k]` (left)
             `+ sum of elements along top-right segment (excluding corners)`
             `+ sum of elements along right-bottom segment (excluding corners)`
             `+ sum of elements along bottom-left segment (excluding corners)`
             `+ sum of elements along left-top segment (excluding corners)`

        A more efficient way to calculate the sum for `k > 0`:
        Initialize `current_sum = 0`.
        Iterate `i` from 0 to `k`:
            `current_sum += grid[r + i][c + i]` (top-right diagonal)
            `current_sum += grid[r + k + i][c + k - i]` (right-bottom diagonal)
            `current_sum += grid[r + 2 * k - i][c - i]` (bottom-left diagonal)
            `current_sum += grid[r + k - i][c - k + i]` (left-top diagonal)
        
        This sums each point 4 times, but the corners are summed multiple times.
        A cleaner way: Iterate along each side.
        For `k > 0`:
        `current_sum = 0`
        // Top-right side (from top corner to right corner)
        for `s` from 0 to `k`:
            `current_sum += grid[r + s][c + s]`
        // Right-bottom side (from right corner to bottom corner)
        for `s` from 1 to `k`: // Start from 1 to avoid double-counting right corner
            `current_sum += grid[r + k + s][c + k - s]`
        // Bottom-left side (from bottom corner to left corner)
        for `s` from 1 to `k`: // Start from 1 to avoid double-counting bottom corner
            `current_sum += grid[r + 2 * k - s][c - s]`
        // Left-top side (from left corner to top corner)
        for `s` from 1 to `k - 1`: // Start from 1, end at k-1 to avoid double-counting left and top corners
            `current_sum += grid[r + k - s][c - k + s]`

        This approach is correct but might be slow due to repeated sums.
        
        A simpler correct way for `k > 0`:
        `current_sum = 0`
        // Top-right segment (from top to right, excluding right)
        for `i` from 0 to `k - 1`:
            `current_sum += grid[r + i][c + i]`
        // Right-bottom segment (from right to bottom, excluding bottom)
        for `i` from 0 to `k - 1`:
            `current_sum += grid[r + k + i][c + k - i]`
        // Bottom-left segment (from bottom to left, excluding left)
        for `i` from 0 to `k - 1`:
            `current_sum += grid[r + 2 * k - i][c - i]`
        // Left-top segment (from left to top, excluding top)
        for `i` from 0 to `k - 1`:
            `current_sum += grid[r + k - i][c - k + i]`
        
        // Add the four corners
        `current_sum += grid[r][c]`
        `current_sum += grid[r + k][c + k]`
        `current_sum += grid[r + 2 * k][c]`
        `current_sum += grid[r + k][c - k]`

        Add `current_sum` to a `Set` to store distinct sums.

3.  **Collect and Sort Results:**
    After iterating through all possible rhombuses, convert the `Set` of sums into an array. Sort the array in descending order and return the first three elements (or fewer if less than three distinct sums were found).

**Optimization (Prefix Sums):**
For larger grids, prefix sums might be needed. Two types of prefix sums could be useful:
- `diag1_sum[r][c]`: sum of elements along the anti-diagonal ending at (r, c).
- `diag2_sum[r][c]`: sum of elements along the main-diagonal ending at (r, c).

For a rhombus of size `k` with top corner `(r, c)`:
- Top corner: `(r, c)`
- Right corner: `(r+k, c+k)`
- Bottom corner: `(r+2k, c)`
- Left corner: `(r+k, c-k)`

The sum of elements on a segment `(r1, c1)` to `(r2, c2)` where `abs(r1-r2) == abs(c1-c2)` can be calculated using diagonal prefix sums.
However, given `M, N <= 50`, the brute-force approach described above without explicit prefix sums for segments should pass within time limits. The number of rhombuses is roughly `M * N * (min(M,N)/2)`, and each sum takes `O(min(M,N))` time.
Total complexity: `O(M * N * min(M,N) * min(M,N)) = O(M * N * (min(M,N))^2)`.
For `M=N=50`, this is `50^4 = 6.25 * 10^6`, which is acceptable.

Let's refine the brute-force sum calculation for `k > 0`:
The four corners are `(r, c)`, `(r+k, c+k)`, `(r+2k, c)`, `(r+k, c-k)`.
The sum of all points along the border can be calculated by iterating `i` from `0` to `k`.
For each `i`:
- Top-Right: `grid[r + i][c + i]`
- Right-Bottom: `grid[r + k + i][c + k - i]`
- Bottom-Left: `grid[r + 2*k - i][c - i]`
- Left-Top: `grid[r + k - i][c - k + i]`

We need to be careful about double counting corners.
When `i=0`:
- Top-Right: `grid[r][c]` (top)
- Right-Bottom: `grid[r+k][c+k]` (right)
- Bottom-Left: `grid[r+2k][c]` (bottom)
- Left-Top: `grid[r+k][c-k]` (left)

When `i=k`:
- Top-Right: `grid[r+k][c+k]` (right)
- Right-Bottom: `grid[r+2k][c]` (bottom)
- Bottom-Left: `grid[r+k][c-k]` (left)
- Left-Top: `grid[r][c]` (top)

Each corner is counted twice in this scheme if we iterate `i` from `0` to `k` for all four paths and simply sum them.
A simpler way to add all unique points:
`current_sum = 0`
// Iterate from top to right
for `i` from `0` to `k`:
    `current_sum += grid[r + i][c + i]`
// Iterate from right to bottom (excluding right, which is already added)
for `i` from `1` to `k`:
    `current_sum += grid[r + k + i][c + k - i]`
// Iterate from bottom to left (excluding bottom, which is already added)
for `i` from `1` to `k`:
    `current_sum += grid[r + 2*k - i][c - i]`
// Iterate from left to top (excluding left and top, which are already added)
for `i` from `1` to `k - 1`: // k-1 because at i=k it would be grid[r][c] (top)
    `current_sum += grid[r + k - i][c - k + i]`

This adjusted iteration ensures each point on the border is added exactly once.
The `Set` automatically handles distinct values.

Time Complexity:
`M` = number of rows, `N` = number of columns.
Outer loops iterate `r` from `0` to `M-1` and `c` from `0` to `N-1`. (`M * N` iterations)
Innermost loop iterates `k` (rhombus size) from `0` up to `min(M, N) / 2`. Let `S = min(M, N)`. (`S/2` iterations)
- For `k=0`, sum calculation is `O(1)`.
- For `k>0`, sum calculation involves iterating `O(k)` steps for each of the four sides. So `O(k)`.
  The max `k` is `S/2`. So `O(S)`.
Total time complexity: `O(M * N * S * S) = O(M * N * min(M, N)^2)`.
Given `M, N <= 50`, `50 * 50 * 50^2 = 6,250,000` operations, which is efficient enough.
Sorting the results: At most `M*N*S/2` distinct sums. `O(M*N*S log(M*N*S))`. Max values `50*50*25 = 62500`. So `62500 log(62500)` is also fine.

Space Complexity:
A `Set` to store distinct sums. In the worst case, all `M * N * S/2` possible rhombus sums are distinct.
So, `O(M * N * min(M, N))` space.
Given `M, N <= 50`, `50 * 50 * 25 = 62,500` elements in the set. This is acceptable.
*/
const getBiggestThreeRhombusSums = (grid) => {
    // Get grid dimensions
    const m = grid.length;
    const n = grid[0].length;

    // Use a Set to store distinct rhombus sums
    const distinctSums = new Set();

    // Iterate through every cell in the grid to consider it as the top-most corner of a rhombus
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            // Add the sum for a rhombus of size 0 (single cell)
            distinctSums.add(grid[r][c]);

            // Iterate through possible rhombus sizes 'k' (half the length of the diagonal from top to right corner)
            // A rhombus of size 'k' has its top corner at (r, c).
            // Its corners will be:
            // Top: (r, c)
            // Right: (r + k, c + k)
            // Bottom: (r + 2k, c)
            // Left: (r + k, c - k)
            //
            // We need to ensure all corners stay within grid bounds.
            // r + 2k < m  =>  2k < m - r
            // c + k < n   =>  k < n - c
            // c - k >= 0  =>  k <= c
            // So, k must satisfy: k <= (m - r - 1) / 2, k < n - c, k <= c
            // We can combine these: k <= Math.min((m - 1 - r) / 2, n - 1 - c, c)
            // The loop for k starts from 1 because k=0 is handled above.
            for (let k = 1; ; k++) {
                // Calculate coordinates of the four corners for the current 'k'
                const r_top = r;
                const c_top = c;

                const r_right = r + k;
                const c_right = c + k;

                const r_bottom = r + 2 * k;
                const c_bottom = c;

                const r_left = r + k;
                const c_left = c - k;

                // Check if all four corners are within grid boundaries
                if (r_bottom >= m || c_right >= n || c_left < 0) {
                    // If any corner is out of bounds, this 'k' and larger 'k's are invalid
                    break;
                }

                let currentRhombusSum = 0;

                // Add elements along the four sides of the rhombus.
                // Each corner is added exactly once.

                // 1. Top-Right side: from (r_top, c_top) to (r_right, c_right)
                // Inclusive of (r_top, c_top), exclusive of (r_right, c_right)
                for (let i = 0; i < k; i++) {
                    currentRhombusSum += grid[r_top + i][c_top + i];
                }

                // 2. Right-Bottom side: from (r_right, c_right) to (r_bottom, c_bottom)
                // Inclusive of (r_right, c_right), exclusive of (r_bottom, c_bottom)
                for (let i = 0; i < k; i++) {
                    currentRhombusSum += grid[r_right + i][c_right - i];
                }

                // 3. Bottom-Left side: from (r_bottom, c_bottom) to (r_left, c_left)
                // Inclusive of (r_bottom, c_bottom), exclusive of (r_left, c_left)
                for (let i = 0; i < k; i++) {
                    currentRhombusSum += grid[r_bottom - i][c_bottom - i];
                }

                // 4. Left-Top side: from (r_left, c_left) to (r_top, c_top)
                // Inclusive of (r_left, c_left), exclusive of (r_top, c_top)
                for (let i = 0; i < k; i++) {
                    currentRhombusSum += grid[r_left - i][c_left + i];
                }

                // Add the four corners, which were excluded by the 'exclusive of' logic above.
                // The loops above ensure each segment adds 'k' points.
                // If we iterate from 0 to k-1 for each segment, we add 4k points.
                // These 4k points make up the boundary.
                // For k=1, 4 points are (r,c), (r+1,c+1), (r+2,c), (r+1,c-1).
                // Sum should be sum of these four points.
                // With current loop structure:
                // i=0 loop1: grid[r][c]
                // i=0 loop2: grid[r+1][c+1]
                // i=0 loop3: grid[r+2][c]
                // i=0 loop4: grid[r+1][c-1]
                // This sums each unique point on the border exactly once.
                // No need to explicitly add corners again.

                distinctSums.add(currentRhombusSum);
            }
        }
    }

    // Convert the Set to an array, sort in descending order, and return the top 3 (or fewer if less than 3 distinct sums exist)
    const result = Array.from(distinctSums).sort((a, b) => b - a);

    // Return the first three elements. If there are fewer than three, it will naturally return all of them.
    return result.slice(0, 3);
};