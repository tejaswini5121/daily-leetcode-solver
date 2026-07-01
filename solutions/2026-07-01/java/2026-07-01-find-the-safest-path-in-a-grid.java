```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Queue;

class Solution {
    /*
     * Problem: Find the Safest Path in a Grid
     * Link: https://leetcode.com/problems/find-the-safest-path-in-a-grid/
     *
     * Approach:
     * This problem asks for the maximum possible minimum Manhattan distance from any cell in a path to any thief.
     * This "maximum of minimums" structure suggests a binary search approach on the answer (the safeness factor).
     *
     * For a given potential safeness factor 'k', we need to check if there exists a path from (0, 0) to (n-1, n-1)
     * such that every cell in the path has a Manhattan distance of at least 'k' from any thief.
     *
     * To efficiently check for a given 'k':
     * 1. Pre-calculate the minimum Manhattan distance from every cell to the nearest thief. This can be done
     *    using a multi-source BFS. Initialize a distance matrix with infinity. For all cells containing a thief (grid[r][c] == 1),
     *    set their distance to 0 and add them to the BFS queue. Then, perform a standard BFS, updating distances.
     *    The Manhattan distance between (r1, c1) and (r2, c2) is |r1 - r2| + |c1 - c2|.
     *
     * 2. After computing these minimum distances (let's call this `minDistToThief` matrix), we can check for a path
     *    with safeness 'k'. This check can be done using BFS or DFS. We start from (0, 0) and only move to adjacent cells
     *    (r', c') if `minDistToThief[r'][c'] >= k`. If we can reach (n-1, n-1) under these constraints, then a path with
     *    safeness 'k' exists.
     *
     * Binary Search:
     * The possible values for the safeness factor range from 0 to `2 * (n - 1)` (the maximum possible Manhattan distance
     * between opposite corners).
     * We can binary search for the maximum 'k' for which the `canReach` function (step 2) returns true.
     *
     * Let `low = 0`, `high = 2 * (n - 1)`.
     * While `low <= high`:
     *   `mid = low + (high - low) / 2`
     *   If `canReach(mid)` is true:
     *     This `mid` is a possible safeness factor, try for a higher one. `ans = mid`, `low = mid + 1`.
     *   Else (`canReach(mid)` is false):
     *     `mid` is too high, need a lower safeness factor. `high = mid - 1`.
     *
     * The final `ans` will be the maximum safeness factor.
     *
     * Optimization:
     * Instead of a binary search on the answer, we can use a modified Dijkstra/Priority Queue approach.
     * We want to find a path from (0, 0) to (n-1, n-1) that maximizes the minimum distance to a thief.
     * This is equivalent to finding the path with the highest bottleneck capacity, where capacity is defined by the
     * minimum distance to a thief of any cell on the path.
     *
     * We can use a Priority Queue to explore paths, prioritizing paths that maintain a higher minimum safeness.
     * The state in the priority queue would be `(safeness, row, col)`. We want to extract the state with the maximum
     * safeness.
     *
     * The algorithm would be:
     * 1. Pre-calculate `minDistToThief` for all cells using multi-source BFS from all thieves.
     * 2. Initialize a `maxSafeness` matrix with -1, representing the maximum safeness found so far to reach each cell.
     * 3. Create a Priority Queue `pq` that stores `(safeness, row, col)`, ordered by `safeness` in descending order.
     * 4. Add the starting cell `(minDistToThief[0][0], 0, 0)` to `pq`. Set `maxSafeness[0][0] = minDistToThief[0][0]`.
     * 5. While `pq` is not empty:
     *    a. Dequeue `(currentSafeness, r, c)`.
     *    b. If `(r, c)` is the destination `(n-1, n-1)`, return `currentSafeness`.
     *    c. If `currentSafeness < maxSafeness[r][c]`, continue (already found a better path to this cell).
     *    d. For each neighbor `(nr, nc)`:
     *       i. Calculate `newSafeness = min(currentSafeness, minDistToThief[nr][nc])`.
     *       ii. If `newSafeness > maxSafeness[nr][nc]`:
     *           Update `maxSafeness[nr][nc] = newSafeness`.
     *           Enqueue `(newSafeness, nr, nc)` into `pq`.
     *
     * This Dijkstra-like approach directly finds the maximum safeness.
     *
     * Time Complexity:
     * - Pre-calculation of `minDistToThief`: Multi-source BFS takes O(N*N) time, where N is the grid dimension.
     * - Dijkstra-like pathfinding: In the worst case, each cell is enqueued and dequeued once. The priority queue
     *   operations take O(log(N*N)) = O(log N). With N*N cells, this part is O(N*N log N).
     * Overall Time Complexity: O(N*N log N).
     *
     * Space Complexity:
     * - `minDistToThief` matrix: O(N*N).
     * - `maxSafeness` matrix: O(N*N).
     * - BFS queue for pre-calculation: O(N*N) in the worst case.
     * - Priority Queue: O(N*N) in the worst case.
     * Overall Space Complexity: O(N*N).
     *
     * Constraints: N <= 400. N*N = 160000. O(N*N log N) should be acceptable.
     *
     * Let's refine the Dijkstra approach:
     * We are looking for a path that maximizes the minimum value of `minDistToThief` on the path.
     * This is exactly what Dijkstra's algorithm does if we consider the edge weights as the minimum `minDistToThief` values.
     * However, it's simpler to think of it as maximizing the "bottleneck capacity" of the path.
     *
     * Dijkstra's state would be (current_max_safeness_to_reach_this_cell, row, col).
     * We use a max-heap for the priority queue.
     *
     * Initial step: Pre-compute `dist[r][c]` = min Manhattan distance from (r, c) to any thief.
     *
     * `dist` matrix initialization:
     * Queue `q` for BFS.
     * Initialize `dist` matrix with -1 (or infinity).
     * For every cell (r, c) with `grid[r][c] == 1`:
     *   `dist[r][c] = 0`
     *   `q.offer((r, c))`
     *
     * BFS:
     * While `q` is not empty:
     *   `curr_r, curr_c = q.poll()`
     *   For each neighbor `(nr, nc)`:
     *     If `(nr, nc)` is valid and `dist[nr][nc] == -1`:
     *       `dist[nr][nc] = dist[curr_r][curr_c] + 1`
     *       `q.offer((nr, nc))`
     *
     * Pathfinding with PriorityQueue:
     * PriorityQueue `pq` stores `[safeness, row, col]`, ordered by `safeness` (descending).
     * `maxSafenessReached[r][c]` stores the max safeness to reach (r, c) found so far. Initialize with -1.
     *
     * Add `[dist[0][0], 0, 0]` to `pq`.
     * `maxSafenessReached[0][0] = dist[0][0]`.
     *
     * While `pq` is not empty:
     *   `[currentSafeness, r, c] = pq.poll()`
     *
     *   If `r == n-1` and `c == n-1`, return `currentSafeness`.
     *
     *   // This check is crucial: if we've already found a path with higher or equal safeness to (r,c), skip.
     *   // However, because we are using a max-heap and updating maxSafenessReached, this explicit check might be implicitly handled.
     *   // A simpler check might be: if currentSafeness < maxSafenessReached[r][c], continue. But if currentSafeness is GREATER than what's recorded,
     *   // it means we found a *new* path with better safeness to this cell.
     *   // The condition for adding to PQ is `newSafeness > maxSafenessReached[nr][nc]`, so if we extract `currentSafeness`, it must be the highest for (r, c) explored so far.
     *   // If `currentSafeness < maxSafenessReached[r][c]`, it means a better path to (r,c) was already processed and added to PQ.
     *   if (currentSafeness < maxSafenessReached[r][c]) continue; // Optimization: if we found a better path already
     *
     *   For each neighbor `(nr, nc)`:
     *     `neighborSafeness = dist[nr][nc]`
     *     `newSafeness = Math.min(currentSafeness, neighborSafeness)`
     *
     *     If `newSafeness > maxSafenessReached[nr][nc]`:
     *       `maxSafenessReached[nr][nc] = newSafeness`
     *       `pq.offer([newSafeness, nr, nc])`
     *
     * The problem states "An adjacent cell of cell (r, c), is one of the cells (r, c + 1), (r, c - 1), (r + 1, c) and (r - 1, c) if it exists." This means 4-directional movement.
     *
     * Edge cases:
     * - If (0, 0) or (n-1, n-1) has a thief, `dist[0][0]` or `dist[n-1][n-1]` will be 0. If the safeness factor is 0, this is handled.
     * - If there is only one thief, the `minDistToThief` calculation is straightforward.
     * - Constraints: `1 <= grid.length == n <= 400`. `grid[i][j]` is 0 or 1. At least one thief.
     *
     * The problem guarantees `grid[0][0]` and `grid[n-1][n-1]` are not necessarily thieves. However, if they are, the safeness will be 0 if that thief is unavoidable.
     * The problem statement "You are initially positioned at cell (0, 0)" implies that (0,0) is part of the path.
     * Similarly, "all paths leading to cell (n - 1, n - 1)" implies (n-1, n-1) is the destination.
     *
     * Let's consider the check `if (currentSafeness < maxSafenessReached[r][c]) continue;`. This is correct. If we pull an element from the PQ, it's guaranteed to be the maximum safeness found *so far* for that cell. If `maxSafenessReached[r][c]` is already higher, it means a better path was already processed and its neighbors were considered.
     *
     * The problem asks for the maximum safeness factor of ALL paths. The Dijkstra approach finds the path that maximizes the bottleneck.
     *
     * The definition of safeness factor: "minimum manhattan distance from any cell in the path to any thief".
     * When we traverse from `(r, c)` to `(nr, nc)`, the safeness of the path segment up to `(nr, nc)` is `min(safeness_up_to_r_c, dist[nr][nc])`. This is exactly what `newSafeness = Math.min(currentSafeness, neighborSafeness)` captures.
     */
    public int maximumSafenessFactor(List<List<Integer>> grid) {
        int n = grid.size();
        // Array to store the minimum Manhattan distance from each cell to the nearest thief.
        int[][] minDistToThief = new int[n][n];
        // Initialize with a large value (effectively infinity) for all cells.
        for (int[] row : minDistToThief) {
            Arrays.fill(row, Integer.MAX_VALUE);
        }

        // Queue for multi-source BFS. Stores {row, col} of thief locations.
        Queue<int[]> thiefBfsQueue = new ArrayDeque<>();

        // Find all thieves and initialize their distances to 0. Add them to the BFS queue.
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                if (grid.get(r).get(c) == 1) {
                    minDistToThief[r][c] = 0;
                    thiefBfsQueue.offer(new int[]{r, c});
                }
            }
        }

        // Directions for 4-directional movement (up, down, left, right).
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

        // Perform BFS to calculate minimum Manhattan distance to the nearest thief for all cells.
        while (!thiefBfsQueue.isEmpty()) {
            int[] currentCell = thiefBfsQueue.poll();
            int r = currentCell[0];
            int c = currentCell[1];

            // Explore neighbors.
            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];

                // Check if the neighbor is within grid bounds.
                if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                    // If we found a shorter path to this neighbor (i.e., it's closer to a thief), update its distance.
                    // The Manhattan distance increases by 1 for each step.
                    if (minDistToThief[r][c] + 1 < minDistToThief[nr][nc]) {
                        minDistToThief[nr][nc] = minDistToThief[r][c] + 1;
                        thiefBfsQueue.offer(new int[]{nr, nc});
                    }
                }
            }
        }

        // If the starting cell (0,0) or the ending cell (n-1, n-1) is a thief, the safeness factor must be 0.
        if (minDistToThief[0][0] == 0 || minDistToThief[n - 1][n - 1] == 0) {
            return 0;
        }

        // Priority Queue for Dijkstra's algorithm.
        // Stores elements as {safeness, row, col}.
        // We use a max-heap, so we sort by safeness in descending order.
        // The initial safeness to reach (0,0) is its distance to the nearest thief.
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[0] - a[0]);

        // Array to store the maximum safeness factor found so far to reach each cell.
        // Initialize with -1 to indicate not visited or no path found yet.
        int[][] maxSafenessReached = new int[n][n];
        for (int[] row : maxSafenessReached) {
            Arrays.fill(row, -1);
        }

        // Add the starting cell to the priority queue.
        // The safeness of the path starting at (0,0) is limited by the distance of (0,0) to the nearest thief.
        pq.offer(new int[]{minDistToThief[0][0], 0, 0});
        maxSafenessReached[0][0] = minDistToThief[0][0];

        // Dijkstra's algorithm to find the path with the maximum minimum safeness.
        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int currentSafeness = current[0];
            int r = current[1];
            int c = current[2];

            // If we reached the destination cell, return the current safeness factor.
            // Since we are using a max-heap, the first time we reach the destination, it will be with the maximum possible safeness.
            if (r == n - 1 && c == n - 1) {
                return currentSafeness;
            }

            // Optimization: If we have already found a path to this cell with a higher or equal safeness, skip it.
            // This check is important because PQ might contain stale entries for a cell if a better path was found later.
            // If currentSafeness < maxSafenessReached[r][c], it means a path with higher safeness to (r,c) has already been processed.
            if (currentSafeness < maxSafenessReached[r][c]) {
                continue;
            }

            // Explore neighbors.
            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];

                // Check if the neighbor is within grid bounds.
                if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                    // The safeness of the path extended to the neighbor is limited by:
                    // 1. The current safeness of the path up to (r, c).
                    // 2. The minimum distance of the neighbor cell (nr, nc) to any thief.
                    int neighborSafeness = minDistToThief[nr][nc];
                    int newSafeness = Math.min(currentSafeness, neighborSafeness);

                    // If this new path to (nr, nc) offers a higher safeness factor than previously found, update and add to PQ.
                    if (newSafeness > maxSafenessReached[nr][nc]) {
                        maxSafenessReached[nr][nc] = newSafeness;
                        pq.offer(new int[]{newSafeness, nr, nc});
                    }
                }
            }
        }

        // This line should theoretically not be reached if a path always exists from (0,0) to (n-1, n-1)
        // given the problem constraints and logic. However, if somehow no path is found, return -1 or handle appropriately.
        // For this problem, a path should always exist because the grid is connected and we can move freely.
        // The only limitation is the safeness factor. If the target is unreachable with any safeness > 0,
        // it implies the max safeness is 0, which is handled by the initial check.
        return -1; // Should not happen in a valid grid for this problem.
    }
}
```