```python
# Summary: Find the maximum possible minimum edge cost on a valid path from node 0 to n-1 in a DAG.
# A path is valid if all intermediate nodes are online and the total edge cost does not exceed k.
# Link: https://leetcode.com/problems/network-recovery-pathways/
#
# Approach:
# This problem can be solved using a binary search on the answer. The "answer" we are searching for is the maximum possible minimum edge cost.
# Let's call this potential minimum edge cost 'min_cost_threshold'.
#
# For a given 'min_cost_threshold', we need to check if there exists a valid path from node 0 to node n-1 such that:
# 1. All edges on the path have a cost greater than or equal to 'min_cost_threshold'.
# 2. All intermediate nodes on the path are online.
# 3. The total cost of edges on the path does not exceed 'k'.
#
# This check can be done efficiently using a modified Dijkstra's algorithm or a topological sort-based approach.
# Since the graph is a DAG, a topological sort based approach is more suitable to calculate shortest paths in terms of total cost.
#
# Binary Search Range:
# The minimum possible minimum edge cost is 0. The maximum possible minimum edge cost can be the maximum edge cost in the graph (or a sufficiently large value if no paths exist).
# The costs can be up to 10^9. We can also consider the maximum possible total cost K as an upper bound for the binary search on the score.
# The possible minimum edge cost can range from 0 to 10^9.
#
# Check Function (can_achieve_min_cost):
# For a given 'min_cost_threshold':
# 1. Create a subgraph containing only edges with cost >= 'min_cost_threshold'.
# 2. Perform a topological sort on this subgraph.
# 3. For each node, calculate the minimum total cost to reach it from node 0. Let's call this `min_total_cost[node]`. Initialize `min_total_cost[0] = 0` and all others to infinity.
# 4. Iterate through the nodes in topological order. For each node 'u', if `min_total_cost[u]` is not infinity and 'u' is online (or 'u' is 0 or n-1), then for each neighbor 'v' of 'u' through an edge with cost 'c' (where c >= 'min_cost_threshold'):
#    If 'v' is online (or 'v' is 0 or n-1), update `min_total_cost[v] = min(min_total_cost[v], min_total_cost[u] + c)`.
# 5. After iterating through all nodes, if `min_total_cost[n-1]` is not infinity and `min_total_cost[n-1] <= k`, then it's possible to achieve a minimum edge cost of at least 'min_cost_threshold'.
#
# The binary search will adjust the 'min_cost_threshold' until the maximum possible value is found.
#
# Data Structures:
# - Adjacency list to represent the graph: `graph[u] = [(v, cost), ...]`.
# - Adjacency list for the check function's subgraph: `subgraph[u] = [(v, cost), ...]`.
# - In-degree array for topological sort.
# - `min_total_cost` array to store minimum total costs.
#
# Time Complexity:
# Let N be the number of nodes and M be the number of edges.
# The binary search performs O(log(max_cost)) iterations, where max_cost is the maximum possible edge cost (10^9).
# Inside each iteration, the `can_achieve_min_cost` function involves:
# - Building the subgraph: O(M)
# - Topological sort: O(N + M)
# - Calculating minimum total costs: O(N + M)
# Therefore, the total time complexity is O((N + M) * log(max_cost)).
#
# Space Complexity:
# - Adjacency lists: O(N + M)
# - In-degree array: O(N)
# - `min_total_cost` array: O(N)
# - Recursion stack for topological sort (if implemented recursively): O(N) in the worst case.
# Therefore, the total space complexity is O(N + M).

import collections
import heapq

def solve():
    edges_input = [[0,1,5],[1,3,10],[0,2,3],[2,3,4]]
    online_input = [True,true,true,true]
    k_input = 10

    n = len(online_input)
    m = len(edges_input)
    k = k_input
    online = online_input

    # Binary search for the maximum possible minimum edge cost.
    # The search space for the minimum edge cost is from 0 to 10^9 + 1.
    # We add 1 to the upper bound to ensure that if the maximum cost is 10^9, it can be considered.
    low = 0
    high = 10**9 + 1 # Max possible edge cost + 1
    ans = -1

    while low < high:
        mid = low + (high - low) // 2 # Potential minimum edge cost threshold

        # Check if there exists a valid path with minimum edge cost >= mid and total cost <= k
        if can_achieve_min_cost(n, edges_input, online, k, mid):
            ans = mid
            low = mid + 1 # Try for a higher minimum edge cost
        else:
            high = mid # Current mid is too high, need to lower the threshold

    # The binary search finds the maximum 'mid' for which can_achieve_min_cost is true.
    # If no path is found for any 'mid' > 0, 'ans' will remain -1 if can_achieve_min_cost(0) is false.
    # If can_achieve_min_cost(0) is true but no higher value is possible, ans will be 0.
    # The problem asks for -1 if no valid path exists. If ans remains -1 and is not updated, it means no valid path.
    # If ans is updated to 0, it means a path with min edge cost 0 is possible and valid.
    # The initial value of ans = -1 correctly handles the case where no valid path is found.

    return ans

def can_achieve_min_cost(n, edges, online, k, min_cost_threshold):
    # Build the graph with only edges that meet the min_cost_threshold.
    # Also, prepare for topological sort by calculating in-degrees.
    graph = collections.defaultdict(list)
    in_degree = [0] * n
    for u, v, cost in edges:
        if cost >= min_cost_threshold:
            graph[u].append((v, cost))
            in_degree[v] += 1

    # Initialize minimum total cost to reach each node from node 0.
    # Use a large value for infinity.
    min_total_cost = [float('inf')] * n
    min_total_cost[0] = 0

    # Use a queue for topological sort.
    # We can also use a priority queue for Dijkstra-like processing if we don't strictly rely on topological order
    # for minimum total cost calculation after filtering edges. However, for DAGs, topological sort is standard.
    # Here, we will process nodes in topological order to correctly compute minimum total costs.
    queue = collections.deque()

    # Add nodes with in-degree 0 to the queue. Node 0 is guaranteed to have an incoming edge if m > 0 and it's not the only node.
    # However, we need to consider the filtered graph. If node 0 has no outgoing edges in the filtered graph, it might not be processed correctly if not explicitly added.
    # But, since we start `min_total_cost[0] = 0`, we can initialize the queue with nodes whose in-degree is 0 *in the filtered graph*.
    # If node 0 itself has incoming edges from nodes with cost < min_cost_threshold, those edges are ignored.
    # So, we should start processing from node 0 if it's online and reachable.

    # For DAG shortest path, we can directly use the in-degree based topological sort.
    # Add all nodes with in-degree 0 to the queue.
    for i in range(n):
        if in_degree[i] == 0:
            queue.append(i)

    # Process nodes in topological order.
    while queue:
        u = queue.popleft()

        # If the current node 'u' is unreachable or offline (and not the start/end node), skip processing its neighbors.
        if min_total_cost[u] == float('inf') or (not online[u] and u != 0 and u != n - 1):
            continue

        # Relax edges from 'u' to its neighbors 'v'.
        for v, cost in graph[u]:
            # If the destination node 'v' is online (or it's the end node 0 or n-1),
            # and if this path is shorter than the current shortest path to 'v'.
            if (online[v] or v == 0 or v == n - 1):
                if min_total_cost[u] + cost < min_total_cost[v]:
                    min_total_cost[v] = min_total_cost[u] + cost
                    # We don't add 'v' to the queue here in a standard topo sort for shortest path.
                    # Instead, we decrement in-degree and add to queue when in-degree becomes 0.
                    # The standard topo sort processes each node once.
                    # For shortest paths, we'd update in_degree and add to queue.
                    # Let's correct this to standard topo sort for shortest path.

    # Re-implementing topo sort and shortest path together for DAG.
    # This loop structure is a bit off for shortest path + topo sort.
    # A better approach is to get the full topological order first, then iterate.
    # Or, use a queue where we add nodes as their in-degree becomes zero.

    # Let's use a queue that processes nodes whose in-degree becomes zero.
    # The initial queue population is correct.
    # When we relax an edge (u, v), we decrement in_degree[v]. If in_degree[v] becomes 0, we add v to the queue.

    # Reset for the correct topological sort based shortest path calculation.
    graph = collections.defaultdict(list)
    in_degree = [0] * n
    for u, v, cost in edges:
        if cost >= min_cost_threshold:
            graph[u].append((v, cost))
            in_degree[v] += 1

    min_total_cost = [float('inf')] * n
    min_total_cost[0] = 0

    queue = collections.deque()
    for i in range(n):
        if in_degree[i] == 0:
            queue.append(i)

    processed_count = 0
    while queue:
        u = queue.popleft()
        processed_count += 1

        # If node u is not online (and not start/end), any path through it would be invalid
        # unless this is the only way to reach a valid node. However, the problem states
        # "All intermediate nodes on the path are online". So, if u is not online and not 0 or n-1,
        # we cannot use it as an intermediate node.
        if not online[u] and u != 0 and u != n - 1:
             continue # This node cannot be part of a valid path.

        # If the node is unreachable, we can't extend paths from it.
        if min_total_cost[u] == float('inf'):
            continue

        for v, cost in graph[u]:
            # Check if the neighbor node 'v' is online (or the destination node).
            if online[v] or v == 0 or v == n - 1:
                if min_total_cost[u] + cost < min_total_cost[v]:
                    min_total_cost[v] = min_total_cost[u] + cost
                    # Decrement in-degree for 'v'. If it becomes 0, add to queue.
                    in_degree[v] -= 1
                    if in_degree[v] == 0:
                        queue.append(v)

    # After processing all reachable nodes in topological order, check the total cost to reach node n-1.
    # The condition is that the total cost must not exceed k.
    # Also, we must ensure that node n-1 was reachable.
    # If n-1 was reached, min_total_cost[n-1] would not be infinity.
    return min_total_cost[n - 1] != float('inf') and min_total_cost[n - 1] <= k


# Example 1 Test
# edges = [[0,1,5],[1,3,10],[0,2,3],[2,3,4]]
# online = [True,True,True,True]
# k = 10
# print(solve(edges, online, k)) # Expected: 3

# Example 2 Test
# edges = [[0,1,7],[1,4,5],[0,2,6],[2,3,6],[3,4,2],[2,4,6]]
# online = [True,true,true,false,true]
# k = 12
# print(solve(edges, online, k)) # Expected: 6

# Helper function to allow calling with specific inputs for testing.
# In a LeetCode environment, this would be part of a class method.
def find_max_path_score(edges, online, k):
    n = len(online)

    low = 0
    # The maximum possible cost of an edge is 10^9.
    # The maximum possible minimum edge cost can be at most 10^9.
    # So, the binary search range is [0, 10^9 + 1].
    high = 10**9 + 1
    ans = -1

    while low < high:
        mid = low + (high - low) // 2 # This 'mid' is our candidate for the minimum edge cost.

        # Check if it's possible to find a path from 0 to n-1 where:
        # 1. All edges have cost >= 'mid'.
        # 2. All intermediate nodes are 'online'.
        # 3. The total cost of such a path <= 'k'.
        if can_achieve_min_cost(n, edges, online, k, mid):
            ans = mid          # 'mid' is achievable, so we record it and try for a higher value.
            low = mid + 1
        else:
            high = mid         # 'mid' is not achievable, so we need to lower our expectation for the minimum edge cost.

    # If 'ans' remains -1, it means no valid path was found for any positive minimum edge cost.
    # If a path with minimum edge cost 0 was possible, 'ans' would be at least 0.
    # The initial value of -1 correctly handles the case where no valid path exists.
    return ans

# This is the main function signature for LeetCode.
class Solution:
    def networkRecoveryPathways(self, edges: list[list[int]], online: list[bool], k: int) -> int:
        n = len(online)

        low = 0
        # Maximum possible edge cost is 10^9. The score (minimum edge cost) can also be up to 10^9.
        # We search in the range [0, 10^9 + 1].
        high = 10**9 + 1
        ans = -1

        while low < high:
            mid = low + (high - low) // 2  # Candidate for minimum edge cost.

            # Check if a valid path exists with minimum edge cost at least 'mid'.
            if self.can_achieve_min_cost(n, edges, online, k, mid):
                ans = mid          # 'mid' is possible, try for a higher score.
                low = mid + 1
            else:
                high = mid         # 'mid' is not possible, try a lower score.

        # If 'ans' is still -1, no valid path was found. Otherwise, 'ans' holds the maximum possible score.
        return ans

    def can_achieve_min_cost(self, n, edges, online, k, min_cost_threshold):
        # Build graph considering only edges with cost >= min_cost_threshold.
        # Also, compute in-degrees for topological sort.
        graph = collections.defaultdict(list)
        in_degree = [0] * n
        for u, v, cost in edges:
            if cost >= min_cost_threshold:
                graph[u].append((v, cost))
                in_degree[v] += 1

        # Initialize distances (minimum total cost from node 0).
        min_total_cost = [float('inf')] * n
        min_total_cost[0] = 0

        # Queue for topological sort.
        queue = collections.deque()
        # Add all nodes with an in-degree of 0 to the queue.
        for i in range(n):
            if in_degree[i] == 0:
                queue.append(i)

        # Process nodes in topological order.
        while queue:
            u = queue.popleft()

            # If the current node 'u' is not online and it's an intermediate node (not start or end),
            # then any path going through it is invalid according to the problem statement.
            if not online[u] and u != 0 and u != n - 1:
                continue

            # If node 'u' is unreachable, we cannot extend any path from it.
            if min_total_cost[u] == float('inf'):
                continue

            # Relax edges outgoing from 'u'.
            for v, cost in graph[u]:
                # The neighbor node 'v' must also be online (or it's the end node).
                if online[v] or v == 0 or v == n - 1:
                    # If a shorter path to 'v' is found.
                    if min_total_cost[u] + cost < min_total_cost[v]:
                        min_total_cost[v] = min_total_cost[u] + cost
                        # Decrement in-degree of 'v'. If it becomes 0, add 'v' to the queue.
                        in_degree[v] -= 1
                        if in_degree[v] == 0:
                            queue.append(v)

        # After processing all nodes, check if the destination node (n-1) is reachable
        # and if the total cost to reach it does not exceed 'k'.
        return min_total_cost[n - 1] != float('inf') and min_total_cost[n - 1] <= k

```