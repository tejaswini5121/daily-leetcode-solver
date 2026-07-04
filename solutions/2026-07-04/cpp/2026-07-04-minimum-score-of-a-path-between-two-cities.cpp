```cpp
/*
Problem Summary: Find the minimum score of a path between city 1 and city n, where the score is the minimum road distance on the path.

Link: https://leetcode.com/problems/minimum-score-of-a-path-between-two-cities/

Approach:
The problem states that we can revisit cities and roads. This implies that if city 1 and city n are in the same connected component, we can reach any city within that component from city 1. The score of a path is the minimum distance of a road in that path. Therefore, the minimum possible score of a path between city 1 and city n is the minimum distance among ALL roads that are reachable from city 1. We can find all reachable cities and the roads connecting them using either Breadth-First Search (BFS) or Depth-First Search (DFS). We start a traversal from city 1, and keep track of the minimum road distance encountered during the traversal. Since there's guaranteed to be a path between 1 and n, they must be in the same connected component.

Algorithm using BFS:
1. Build an adjacency list representation of the graph. For each road [u, v, distance], add an edge from u to v with weight `distance` and from v to u with weight `distance`. Store the `distance` along with the neighbor.
2. Initialize a queue for BFS and a `visited` set to keep track of visited cities.
3. Initialize `min_score` to a very large value (e.g., INT_MAX).
4. Add city 1 to the queue and mark it as visited.
5. While the queue is not empty:
   a. Dequeue a city `current_city`.
   b. For each neighbor `neighbor_city` and its `distance` connected to `current_city`:
      i. Update `min_score = min(min_score, distance)`.
      ii. If `neighbor_city` has not been visited:
          - Mark `neighbor_city` as visited.
          - Enqueue `neighbor_city`.
6. Return `min_score`.

Time Complexity Analysis:
The time complexity is dominated by the graph traversal (BFS or DFS).
Building the adjacency list takes O(E) time, where E is the number of roads.
The BFS traversal visits each reachable city and edge at most once. In the worst case, we might visit all n cities and all E edges if they are all in the same connected component as city 1.
Therefore, the time complexity is O(N + E), where N is the number of cities and E is the number of roads.

Space Complexity Analysis:
The space complexity is determined by the adjacency list, the queue for BFS, and the visited set.
The adjacency list stores up to O(N + E) information.
The queue in BFS can store up to O(N) cities in the worst case.
The visited set stores up to O(N) cities.
Therefore, the space complexity is O(N + E).
*/

#include <vector>
#include <queue>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <limits>

class Solution {
public:
    int minScore(int n, std::vector<std::vector<int>>& roads) {
        // Adjacency list to represent the graph.
        // Key: city, Value: vector of pairs, where each pair is {neighbor_city, distance_to_neighbor}
        std::unordered_map<int, std::vector<std::pair<int, int>>> adj;

        // Build the adjacency list from the roads.
        // Since roads are bidirectional, add edges in both directions.
        for (const auto& road : roads) {
            int u = road[0];
            int v = road[1];
            int distance = road[2];
            adj[u].push_back({v, distance});
            adj[v].push_back({u, distance});
        }

        // Initialize the minimum score to the maximum possible integer value.
        int min_score = std::numeric_limits<int>::max();

        // Queue for Breadth-First Search (BFS).
        std::queue<int> q;
        // Set to keep track of visited cities during BFS.
        std::unordered_set<int> visited;

        // Start BFS from city 1.
        q.push(1);
        visited.insert(1);

        // Perform BFS.
        while (!q.empty()) {
            int current_city = q.front();
            q.pop();

            // Iterate over all neighbors of the current city.
            if (adj.count(current_city)) { // Check if current_city has any neighbors
                for (const auto& edge : adj[current_city]) {
                    int neighbor_city = edge.first;
                    int distance = edge.second;

                    // Update the minimum score with the current road's distance.
                    // Since we can traverse any road in the connected component,
                    // we just need to find the minimum distance among all reachable roads.
                    min_score = std::min(min_score, distance);

                    // If the neighbor city has not been visited yet,
                    // mark it as visited and add it to the queue for further exploration.
                    if (visited.find(neighbor_city) == visited.end()) {
                        visited.insert(neighbor_city);
                        q.push(neighbor_city);
                    }
                }
            }
        }

        // Return the minimum score found among all roads reachable from city 1.
        return min_score;
    }
};
```