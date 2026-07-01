/**
 * @file LeetCode 1792: Find the Safest Path in a Grid.
 * Given a 0-indexed 2D matrix where 1 represents a thief and 0 represents an empty cell,
 * find the maximum safeness factor of a path from (0, 0) to (n-1, n-1). The safeness factor
 * of a path is the minimum Manhattan distance from any cell in the path to any thief.
 *
 * Problem Link: https://leetcode.com/problems/find-the-safest-path-in-a-grid/
 *
 * Approach:
 * This problem can be broken down into two main parts:
 * 1. Pre-calculating the minimum distance to the nearest thief for every cell in the grid.
 *    This can be efficiently done using a multi-source BFS starting from all thief locations.
 *    Initialize a distance matrix `dist` with infinity. For all cells containing a thief, set their
 *    distance to 0 and add them to the BFS queue. Then, perform BFS, updating the distance of
 *    neighboring cells if a shorter path is found.
 *
 * 2. Finding the path with the maximum minimum distance. This is a classic problem that can be
 *    solved using Dijkstra's algorithm or a Binary Search on the answer.
 *    Since we want to maximize the minimum distance, we can binary search for the maximum possible
 *    safeness factor `k`. For a given `k`, we need to check if there exists a path from (0, 0)
 *    to (n-1, n-1) such that every cell on the path has a minimum thief distance of at least `k`.
 *    This check can be done using BFS or DFS. A path exists if we can reach (n-1, n-1) from (0, 0)
 *    by only traversing cells where `dist[r][c] >= k`.
 *
 *    The binary search range for `k` is from 0 to 2 * (n - 1) (maximum possible Manhattan distance).
 *
 *    Alternatively, a greedy approach using a priority queue (max-heap) can also solve the second part.
 *    The priority queue will store tuples `[safeness, row, col]`. We start by adding `[dist[0][0], 0, 0]`
 *    to the priority queue. In each step, we extract the cell with the highest safeness. If we reach
 *    (n-1, n-1), the safeness of that cell is our answer. We then explore its valid neighbors
 *    (cells with distance greater than or equal to the current cell's safeness) and add them to the
 *    priority queue. This is conceptually similar to Dijkstra's but we prioritize higher safeness.
 *
 *    This implementation uses the Binary Search on the answer approach.
 *
 * Time Complexity:
 * - Pre-calculation of distances (BFS from all thieves): O(N*N), where N is the dimension of the grid.
 * - Binary Search: The range of possible safeness values is O(N). For each `k` in the binary search,
 *   we perform a BFS/DFS to check path existence, which takes O(N*N).
 * - Total Time Complexity: O(N*N * log(N)).
 *
 * Space Complexity:
 * - `dist` matrix: O(N*N) to store distances to nearest thieves.
 * - BFS/DFS queue/stack: O(N*N) in the worst case.
 * - Total Space Complexity: O(N*N).
 */

/**
 * @param {number[][]} grid
 * @return {number}
 */
var maximumSafenessFactor = function(grid) {
    const n = grid.length;
    // Directions for BFS (up, down, left, right)
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    // 1. Pre-calculate minimum distance to nearest thief for each cell using multi-source BFS.
    // Initialize distance matrix with -1 (unvisited)
    const dist = Array(n).fill(0).map(() => Array(n).fill(-1));
    // Queue for BFS, stores [row, col]
    const queue = [];

    // Add all thief locations to the queue and set their distance to 0.
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (grid[r][c] === 1) {
                dist[r][c] = 0;
                queue.push([r, c]);
            }
        }
    }

    let head = 0; // Pointer for the BFS queue
    while (head < queue.length) {
        const [r, c] = queue[head++];

        // Explore neighbors
        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;

            // Check if the neighbor is within bounds and has not been visited yet.
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && dist[nr][nc] === -1) {
                // The distance to the nearest thief for the neighbor is one more than the current cell's distance.
                dist[nr][nc] = dist[r][c] + 1;
                queue.push([nr, nc]);
            }
        }
    }

    // 2. Binary Search for the maximum safeness factor.
    // The safeness factor can range from 0 to 2*(n-1) (maximum possible Manhattan distance).
    let low = 0;
    let high = 2 * (n - 1);
    let maxSafeness = 0;

    // Helper function to check if a path exists with a minimum safeness factor `k`.
    const canReach = (k) => {
        // If the starting or ending cell has a distance less than k, no path is possible.
        if (dist[0][0] < k || dist[n - 1][n - 1] < k) {
            return false;
        }

        // Use BFS to check for path existence.
        // `visited` array to keep track of visited cells in this specific BFS.
        const visited = Array(n).fill(0).map(() => Array(n).fill(false));
        const pathQueue = [[0, 0]]; // Start BFS from (0, 0)
        visited[0][0] = true;
        let pathHead = 0;

        while (pathHead < pathQueue.length) {
            const [r, c] = pathQueue[pathHead++];

            // If we reached the destination, a path exists.
            if (r === n - 1 && c === n - 1) {
                return true;
            }

            // Explore neighbors
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;

                // Check if the neighbor is within bounds, has not been visited,
                // and its minimum thief distance is at least `k`.
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && dist[nr][nc] >= k) {
                    visited[nr][nc] = true;
                    pathQueue.push([nr, nc]);
                }
            }
        }
        // If the BFS completes without reaching the destination, no path exists for this `k`.
        return false;
    };

    // Perform binary search
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (canReach(mid)) {
            // If a path exists with safeness `mid`, try for a higher safeness.
            maxSafeness = mid;
            low = mid + 1;
        } else {
            // If no path exists with safeness `mid`, we need to reduce the safeness.
            high = mid - 1;
        }
    }

    return maxSafeness;
};
```