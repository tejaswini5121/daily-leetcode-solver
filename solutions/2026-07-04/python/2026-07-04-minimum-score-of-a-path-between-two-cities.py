```python
# Problem Summary: Find the minimum road distance among all roads on any path between city 1 and city n.
# Link: https://leetcode.com/problems/minimum-score-of-a-path-between-two-cities/
#
# Approach:
# The problem asks for the minimum score of a path between city 1 and city n. The score of a path is the minimum distance of any road in that path.
# Since we can traverse roads multiple times and revisit cities, any road connected to city 1 or city n, or any road on *any* path connecting city 1 to city n, can be part of an optimal path.
# This implies that if city 1 and city n are in the same connected component, the minimum score of a path between them will be the minimum distance of *any* road within that connected component.
#
# We can use Breadth-First Search (BFS) or Depth-First Search (DFS) starting from city 1 to explore all reachable cities and roads in its connected component. During the traversal, we keep track of the minimum road distance encountered so far.
#
# Alternatively, Union-Find could be used to group cities into connected components. After processing all roads, we can find the component containing city 1 and then iterate through all roads to find the minimum distance of roads that connect two cities within this component. However, a simpler BFS/DFS approach directly finds the minimum in the relevant component.
#
# The BFS/DFS approach is more straightforward:
# 1. Build an adjacency list representation of the graph where each entry stores the neighbor city and the road distance.
# 2. Initialize a `visited` set to keep track of visited cities and a `min_score` to infinity.
# 3. Start a BFS (or DFS) from city 1.
# 4. Use a queue for BFS. Add city 1 to the queue and `visited` set.
# 5. While the queue is not empty:
#    a. Dequeue a `current_city`.
#    b. For each `neighbor_city` and `distance` connected to `current_city`:
#       i. Update `min_score = min(min_score, distance)`.
#       ii. If `neighbor_city` has not been visited, add it to the queue and `visited` set.
# 6. After the BFS completes, `min_score` will hold the minimum road distance in the connected component containing city 1. Since city n is guaranteed to be reachable from city 1, this `min_score` is the answer.
#
# Time Complexity: O(V + E), where V is the number of cities (n) and E is the number of roads. This is because we visit each city and edge at most once during the BFS traversal.
# Space Complexity: O(V + E) for the adjacency list and O(V) for the visited set and queue in the worst case.
class Solution:
    def minScore(self, n: int, roads: list[list[int]]) -> int:
        # Adjacency list to represent the graph.
        # adj[city] will store a list of tuples (neighbor_city, distance).
        adj = [[] for _ in range(n + 1)]
        for u, v, d in roads:
            adj[u].append((v, d))
            adj[v].append((u, d))

        # Initialize the minimum score to a very large value.
        min_score = float('inf')

        # Use a set to keep track of visited cities to avoid cycles and redundant processing.
        visited = set()

        # Use a queue for Breadth-First Search (BFS).
        # Start BFS from city 1.
        queue = [1]
        visited.add(1)

        # Perform BFS traversal.
        while queue:
            current_city = queue.pop(0) # Dequeue the current city.

            # Iterate through all neighbors of the current city.
            for neighbor_city, distance in adj[current_city]:
                # Update the minimum score with the current road's distance.
                min_score = min(min_score, distance)

                # If the neighbor city has not been visited, add it to the queue and mark as visited.
                if neighbor_city not in visited:
                    visited.add(neighbor_city)
                    queue.append(neighbor_city)

        # The min_score after traversing the connected component of city 1
        # will be the minimum score of any path between city 1 and city n,
        # as any road in this component is accessible and can contribute to a path.
        return min_score

```