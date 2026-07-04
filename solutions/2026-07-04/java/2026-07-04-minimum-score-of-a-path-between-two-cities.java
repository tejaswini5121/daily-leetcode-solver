```java
// Problem Summary: Find the minimum score of a path between city 1 and city n, where the score is the minimum edge weight in the path.
// Problem Link: https://leetcode.com/problems/minimum-score-of-a-path-between-two-cities/
//
// Approach:
// The problem asks for the minimum score of a path between city 1 and city n. The score of a path is the minimum edge weight within that path.
// Since we can traverse roads multiple times and visit cities multiple times, any road connected to city 1 or city n, or any city reachable from city 1,
// can potentially be part of a path that ultimately reaches city n.
// The key insight is that if city 1 and city n are in the same connected component, the minimum score of a path between them will be the minimum edge weight
// among ALL edges that are part of the connected component containing city 1 and city n. This is because we can construct a path that includes any edge in this component.
// For example, to include an edge (u, v) with weight w in our path from 1 to n (assuming 1 and n are in the same component as u and v), we can travel from 1 to u,
// traverse the edge (u, v), and then travel from v to n. The score of this path would be min(..., w, ...). If we can always find a path from 1 to n, and w is the smallest edge
// in the component, we can ensure w is the minimum edge by constructing a path that includes it.
//
// We can use either Breadth-First Search (BFS) or Depth-First Search (DFS) to explore the connected component starting from city 1.
// During the traversal, we keep track of the minimum edge weight encountered so far. Since we are guaranteed that city n is reachable from city 1,
// we will eventually explore all edges within their connected component.
//
// Algorithm using BFS:
// 1. Build an adjacency list representation of the graph where each entry stores the neighbor and the distance to that neighbor.
// 2. Initialize a queue for BFS and a boolean array `visited` to keep track of visited cities.
// 3. Initialize `minScore` to infinity.
// 4. Add city 1 to the queue and mark it as visited.
// 5. While the queue is not empty:
//    a. Dequeue a city `currentCity`.
//    b. For each neighbor `neighbor` of `currentCity` with edge weight `distance`:
//       i. Update `minScore = min(minScore, distance)`.
//       ii. If `neighbor` has not been visited:
//           - Mark `neighbor` as visited.
//           - Enqueue `neighbor`.
// 6. Return `minScore`.
//
// Algorithm using DFS:
// 1. Build an adjacency list representation of the graph.
// 2. Initialize a boolean array `visited` and `minScore` to infinity.
// 3. Call a recursive DFS function starting from city 1.
//
// DFS function `dfs(city, adj, visited, minScore)`:
// 1. Mark `city` as visited.
// 2. For each neighbor `neighbor` and `distance` of `city`:
//    a. Update `minScore = min(minScore, distance)`.
//    b. If `neighbor` is not visited:
//       i. Recursively call `dfs(neighbor, adj, visited, minScore)`.
//
// Time Complexity: O(V + E), where V is the number of cities and E is the number of roads. We visit each city and edge in the connected component at most once.
// Space Complexity: O(V + E) for the adjacency list. O(V) for the visited array and the recursion stack (for DFS) or the queue (for BFS).
//
// Alternative using Union-Find:
// While Union-Find can identify connected components, directly using it to find the minimum edge weight within a component can be slightly more complex.
// You would first union all cities connected by roads. Then, you would iterate through all roads and check if both endpoints of a road belong to the same component as city 1 and city n.
// If they do, update the minimum score. This approach might involve iterating through roads multiple times or storing edge information with components.
// The BFS/DFS approach is more direct for this specific problem.
//
// Given the constraints and the nature of the problem (finding the minimum edge in a connected component), BFS is a straightforward and efficient solution.
// We will implement the BFS approach.

import java.util.*;

class Solution {
    /**
     * Finds the minimum score of a path between city 1 and city n.
     * The score of a path is the minimum distance of a road in that path.
     *
     * @param n     The number of cities.
     * @param roads A 2D array where roads[i] = [ai, bi, distancei] indicates a bidirectional road.
     * @return The minimum possible score of a path between city 1 and city n.
     */
    public int minScore(int n, int[][] roads) {
        // Adjacency list to represent the graph.
        // Map: City -> List of Pairs (Neighbor City, Distance)
        Map<Integer, List<int[]>> adj = new HashMap<>();

        // Build the adjacency list from the roads.
        // Since roads are bidirectional, add entries for both directions.
        for (int[] road : roads) {
            int u = road[0];
            int v = road[1];
            int distance = road[2];

            adj.computeIfAbsent(u, k -> new ArrayList<>()).add(new int[]{v, distance});
            adj.computeIfAbsent(v, k -> new ArrayList<>()).add(new int[]{u, distance});
        }

        // Variable to store the minimum score found so far.
        // Initialize to a very large value.
        int minScore = Integer.MAX_VALUE;

        // Queue for Breadth-First Search (BFS).
        Queue<Integer> queue = new LinkedList<>();
        // Set to keep track of visited cities during BFS.
        Set<Integer> visited = new HashSet<>();

        // Start BFS from city 1.
        queue.offer(1);
        visited.add(1);

        // Perform BFS traversal.
        while (!queue.isEmpty()) {
            int currentCity = queue.poll();

            // If the current city is not in the adjacency list (e.g., isolated city, though problem guarantees reachability),
            // we can skip processing its neighbors.
            if (!adj.containsKey(currentCity)) {
                continue;
            }

            // Iterate through all roads connected to the current city.
            for (int[] neighborInfo : adj.get(currentCity)) {
                int neighborCity = neighborInfo[0];
                int distance = neighborInfo[1];

                // Update the minimum score encountered. The score of any path between 1 and n within this connected component
                // can be at most the minimum edge weight within this component.
                minScore = Math.min(minScore, distance);

                // If the neighbor city has not been visited yet, add it to the queue and mark it as visited.
                // This ensures we explore the entire connected component that includes city 1 and city n.
                if (!visited.contains(neighborCity)) {
                    visited.add(neighborCity);
                    queue.offer(neighborCity);
                }
            }
        }

        // After BFS, minScore will hold the minimum edge weight found in the connected component
        // containing city 1 and city n. This is because any path between 1 and n must traverse
        // through this connected component, and we can construct a path that utilizes any edge
        // within this component.
        return minScore;
    }
}
```