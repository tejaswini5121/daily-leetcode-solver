/**
 * @param {number} n
 * @param {number[][]} roads
 * @return {number}
 */

// Problem: Minimum Score of a Path Between Two Cities
// Link: https://leetcode.com/problems/minimum-score-of-a-path-between-two-cities/
// Approach:
// The problem asks for the minimum score of a path between city 1 and city n, where the score of a path is the minimum distance of any road in that path.
// Since we are allowed to revisit cities and roads, any road connected to city 1 or city n, or any road connected to a city that is reachable from city 1 (and can reach city n), can potentially be part of a path that has the minimum score.
// This means we only need to consider the connected component that contains city 1 and city n. Since the problem guarantees a path exists between 1 and n, they must be in the same connected component.
// Therefore, the minimum score of a path between city 1 and city n will be the minimum distance among all roads that belong to the connected component containing city 1 and city n.
// We can use Breadth-First Search (BFS) or Depth-First Search (DFS) starting from city 1 to explore all reachable cities and the roads connecting them. During the traversal, we keep track of the minimum road distance encountered.
//
// Detailed Steps using BFS:
// 1. Build an adjacency list representation of the graph where each key is a city and its value is a list of [neighbor_city, distance] pairs.
// 2. Initialize a `visited` set to keep track of visited cities.
// 3. Initialize a queue for BFS, adding city 1 to it.
// 4. Initialize `minScore` to infinity.
// 5. While the queue is not empty:
//    a. Dequeue a `currentCity`.
//    b. If `currentCity` has already been visited, continue to the next iteration.
//    c. Mark `currentCity` as visited.
//    d. For each `neighborInfo` (which is `[neighborCity, distance]`) of `currentCity`:
//       i. Update `minScore = min(minScore, distance)`.
//       ii. If `neighborCity` has not been visited, enqueue `neighborCity`.
// 6. Return `minScore`.
//
// Time Complexity: O(V + E), where V is the number of cities (n) and E is the number of roads. This is because we visit each city and each edge at most once during the BFS traversal.
// Space Complexity: O(V + E) for the adjacency list. O(V) for the visited set and the BFS queue in the worst case. Therefore, the overall space complexity is O(V + E).
 */
function minScore(n, roads) {
    // Adjacency list to represent the graph.
    // Each key is a city, and its value is an array of [neighbor_city, distance] pairs.
    const adj = new Map();

    // Populate the adjacency list from the roads input.
    for (const [u, v, dist] of roads) {
        if (!adj.has(u)) {
            adj.set(u, []);
        }
        if (!adj.has(v)) {
            adj.set(v, []);
        }
        adj.get(u).push([v, dist]);
        adj.get(v).push([u, dist]); // Roads are bidirectional
    }

    // Use a Set to keep track of visited cities to avoid cycles and redundant processing.
    const visited = new Set();
    // Initialize the queue for Breadth-First Search (BFS) and add the starting city (city 1).
    const queue = [1];
    // Initialize the minimum score to a very large number (infinity).
    let minScore = Infinity;

    // Perform BFS starting from city 1.
    while (queue.length > 0) {
        // Dequeue the current city to process.
        const currentCity = queue.shift();

        // If the city has already been visited, skip it.
        if (visited.has(currentCity)) {
            continue;
        }

        // Mark the current city as visited.
        visited.add(currentCity);

        // If the current city is not in the adjacency list (e.g., an isolated city not part of any road, though problem guarantees path between 1 and n), skip its neighbors.
        if (!adj.has(currentCity)) {
            continue;
        }

        // Iterate through all neighbors of the current city.
        for (const [neighborCity, distance] of adj.get(currentCity)) {
            // Update the minimum score found so far with the current road's distance.
            // This is because any road within the connected component of city 1 and n is a candidate for the minimum score.
            minScore = Math.min(minScore, distance);

            // If the neighbor city has not been visited yet, add it to the queue for further exploration.
            if (!visited.has(neighborCity)) {
                queue.push(neighborCity);
            }
        }
    }

    // Return the overall minimum score found among all roads in the connected component of city 1.
    return minScore;
}