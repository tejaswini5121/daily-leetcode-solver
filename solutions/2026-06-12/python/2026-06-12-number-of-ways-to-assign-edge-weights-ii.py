```python
# Problem: Number of Ways to Assign Edge Weights II
# Link: https://leetcode.com/problems/number-of-ways-to-assign-edge-weights-ii/
#
# Approach:
# The problem asks for the number of ways to assign weights (1 or 2) to edges in a tree such that the path cost between two given nodes is odd.
#
# The key observation is that the parity of the path cost depends only on the number of edges with weight 1.
# If an edge has weight 1, it contributes 1 to the path cost, changing the parity.
# If an edge has weight 2, it contributes 2 to the path cost, not changing the parity.
#
# Therefore, the path cost is odd if and only if the number of edges with weight 1 on the path is odd.
#
# For a given path between nodes u and v, let its length (number of edges) be L.
# We need to assign weights to these L edges. Each edge can be weight 1 or 2.
#
# Consider a path of length L.
# Let k be the number of edges assigned weight 1. The remaining L-k edges are assigned weight 2.
# The total path cost is k * 1 + (L-k) * 2 = k + 2L - 2k = 2L - k.
# For the cost to be odd, 2L - k must be odd. Since 2L is always even, this means k must be odd.
#
# So, we need to count the number of ways to assign weights such that an odd number of edges on the path have weight 1.
#
# For each edge on the path, there are two choices: weight 1 or weight 2.
# If we decide to assign weight 1 to exactly `odd_count` edges on the path, the number of ways to choose these `odd_count` edges is `C(L, odd_count)`.
# The remaining `L - odd_count` edges must be assigned weight 2.
#
# The total number of ways for the path cost to be odd is the sum of `C(L, odd_count)` for all odd `odd_count` from 1 to L.
#
# A crucial property of binomial coefficients is that the sum of C(n, k) for odd k is equal to 2^(n-1) for n >= 1.
# Sum(C(L, k) for k = 1, 3, 5, ...) = 2^(L-1).
#
# This holds true if L >= 1. If L = 0 (path from a node to itself), the path has no edges, cost is 0 (even). So, the number of ways is 0.
#
# Thus, for a path of length L >= 1, the number of ways to assign weights to make the path cost odd is 2^(L-1) modulo 10^9 + 7.
# For a path of length L = 0, the number of ways is 0.
#
# The problem then reduces to finding the length of the path between `u` and `v` for each query.
# This can be efficiently done using Lowest Common Ancestor (LCA) and precomputed depths.
#
# Steps:
# 1. Build the adjacency list for the tree.
# 2. Perform a DFS from the root (node 1) to compute:
#    - `depth[u]`: the depth of node `u` from the root (root is at depth 0).
#    - `parent[u]`: the immediate parent of node `u`.
#    - `up[u][k]`: the 2^k-th ancestor of node `u`. This is used for fast LCA calculation.
# 3. Precompute `up` table for LCA. `up[u][k]` = `up[up[u][k-1]][k-1]`.
# 4. Implement an LCA function that uses the `depth` and `up` table to find the LCA of two nodes.
# 5. For each query `(u, v)`:
#    - Find `lca = LCA(u, v)`.
#    - The path length `L` between `u` and `v` is `depth[u] + depth[v] - 2 * depth[lca]`.
#    - If `L == 0`, the answer is 0.
#    - If `L >= 1`, the answer is `pow(2, L - 1, MOD)`.
#
# Modulo is 10^9 + 7.
#
# Time Complexity:
# - Building adjacency list: O(N)
# - DFS for depths and parents: O(N)
# - Precomputing LCA `up` table: O(N log N)
# - LCA query: O(log N)
# - Total for Q queries: O(N log N + Q log N)
#
# Space Complexity:
# - Adjacency list: O(N)
# - Depth, parent arrays: O(N)
# - LCA `up` table: O(N log N)
# - Total: O(N log N)
#
# Constraints: N <= 10^5, Q <= 10^5. N log N is feasible.

import sys

sys.setrecursionlimit(200000)  # Increase recursion depth for DFS

MOD = 10**9 + 7

def solve():
    # Read input edges and queries from stdin or directly if provided as args
    # For LeetCode, input is usually passed as arguments.
    # Here, we'll assume a structure where edges and queries are passed to a function.

    # Example input structure for testing:
    # edges_input = [[1,2]]
    # queries_input = [[1,1],[1,2]]
    # n_input = 2

    # Mocking input for demonstration. In a real LeetCode setup, these would be function parameters.
    # To make this runnable as a script, we'll simulate reading from stdin or pass them.

    # To make this runnable with example inputs, let's define a function that takes these.
    # In LeetCode, the function signature would be `numberOfWays(n, edges, queries)`.

    # Let's assume the following function signature for clarity and modularity:
    # def numberOfWays(n: int, edges: list[list[int]], queries: list[list[int]]) -> list[int]:

    # For a standalone script, we'll use dummy data or read from a file/console if needed.
    # For LeetCode, we'll structure it as a class method or function.

    # Placeholder for actual function definition that would be called by LeetCode
    # ... inside a Solution class ...
    # def numberOfWays(self, n: int, edges: list[list[int]], queries: list[list[int]]) -> list[int]:
    #     return self.solve_internal(n, edges, queries)
    #
    # def solve_internal(self, n: int, edges: list[list[int]], queries: list[list[int]]) -> list[int]:
    #     ... implementation ...

    # For this execution, we'll define the main logic in this scope.
    # If this were a LeetCode problem, 'n', 'edges', 'queries' would be parameters.

    # --- Start of main logic ---
    # Simulate receiving n, edges, queries
    # Example 1:
    # n = 2
    # edges = [[1, 2]]
    # queries = [[1, 1], [1, 2]]

    # Example 2:
    n = 5
    edges = [[1, 2], [1, 3], [3, 4], [3, 5]]
    queries = [[1, 4], [3, 4], [2, 5]]
    # --- End of simulation ---


    # 1. Build adjacency list
    adj = [[] for _ in range(n + 1)]
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)

    # 2. DFS to compute depths, parents, and populate LCA `up` table
    # `depth[i]` will store the depth of node `i` from root (node 1). Root is at depth 0.
    depth = [-1] * (n + 1)
    # `up[i][k]` will store the 2^k-th ancestor of node `i`.
    # `MAX_LOG_N` is sufficient to cover all ancestors up to the root.
    # N <= 10^5, so log2(10^5) is approx 16.6. Let's use 17 or 18 for safety.
    MAX_LOG_N = 18 # ceil(log2(10^5)) is about 16.6, so 17 or 18 is safe.
    up = [[0] * MAX_LOG_N for _ in range(n + 1)]

    # Perform DFS starting from root (node 1)
    # The DFS function will populate `depth` and `up` table.
    # We need to pass the parent to avoid going back up the tree immediately.
    def dfs(u, p, d):
        depth[u] = d
        up[u][0] = p # The 1st (2^0) ancestor is the immediate parent

        for v in adj[u]:
            if v != p: # Avoid going back to parent
                dfs(v, u, d + 1)

    # Start DFS from root node 1, parent is 0 (null/non-existent), depth is 0
    dfs(1, 0, 0)

    # 3. Precompute the `up` table for binary lifting
    # For each node `i` and each power of 2 `k`, `up[i][k]` is the `2^k`-th ancestor of `i`.
    # This is computed using `up[i][k] = up[up[i][k-1]][k-1]`
    # which means the `2^k`-th ancestor is the `2^(k-1)`-th ancestor of the `2^(k-1)`-th ancestor.
    for k in range(1, MAX_LOG_N):
        for i in range(1, n + 1):
            # If `up[i][k-1]` is a valid node (not 0, which represents no parent/root's parent)
            # then `up[i][k]` is the `2^(k-1)`-th ancestor of `up[i][k-1]`.
            # Otherwise, `up[i][k]` remains 0.
            ancestor = up[i][k-1]
            if ancestor != 0:
                up[i][k] = up[ancestor][k-1]
            else:
                up[i][k] = 0 # No ancestor further up


    # 4. Implement LCA function
    # This function finds the Lowest Common Ancestor of two nodes `u` and `v`.
    def lca(u, v):
        # Ensure `u` is deeper than `v` (or at the same depth)
        if depth[u] < depth[v]:
            u, v = v, u

        # Lift `u` up to the same depth as `v`
        # We can do this efficiently using the `up` table.
        # For each bit `k` in `MAX_LOG_N - 1` down to 0:
        # If `u` needs to be lifted by `2^k` steps (i.e., `depth[u] - depth[v]` has the k-th bit set),
        # then move `u` to its `2^k`-th ancestor.
        diff = depth[u] - depth[v]
        for k in range(MAX_LOG_N - 1, -1, -1):
            if (diff >> k) & 1: # Check if k-th bit is set in diff
                u = up[u][k]

        # If `u` and `v` are now the same, then `v` was an ancestor of `u`, and `v` (or the current `u`) is the LCA.
        if u == v:
            return u

        # If `u` and `v` are not the same, they are at the same depth.
        # Now, we lift both `u` and `v` simultaneously, one step at a time,
        # until their parents are the same. The parent of that common node is the LCA.
        # We iterate from the highest power of 2 down to 0.
        # If `up[u][k]` and `up[v][k]` are different, it means they are not yet at the same parent.
        # So, we move `u` and `v` up by `2^k` steps.
        for k in range(MAX_LOG_N - 1, -1, -1):
            if up[u][k] != up[v][k]:
                u = up[u][k]
                v = up[v][k]

        # After the loop, `u` and `v` are children of the LCA.
        # So, `up[u][0]` (or `up[v][0]`) is the LCA.
        return up[u][0]


    # 5. Process queries
    results = []
    for u, v in queries:
        # If u and v are the same node, path length is 0. Cost is 0 (even).
        # Number of ways for odd cost is 0.
        if u == v:
            results.append(0)
            continue

        # Find the LCA of u and v
        ancestor = lca(u, v)

        # Calculate path length: depth[u] + depth[v] - 2 * depth[lca]
        # This formula works because the path from u to v goes from u up to LCA, and then from LCA down to v.
        # The length is (depth[u] - depth[lca]) + (depth[v] - depth[lca]).
        path_length = depth[u] + depth[v] - 2 * depth[ancestor]

        # If path_length is 0, it means u and v are the same node, which is already handled.
        # If path_length is >= 1, the number of ways to get an odd cost is 2^(path_length - 1) mod MOD.
        # The formula 2^(L-1) works because for L edges, we need an odd number of edges to be weight 1.
        # This is equivalent to Sum(C(L, k) for k=1,3,5,...) which equals 2^(L-1).
        num_ways = pow(2, path_length - 1, MOD)
        results.append(num_ways)

    return results

# Execute the solve function and print results for the example.
# In a LeetCode environment, this part would be handled by the platform.
# For standalone execution and testing:
if __name__ == "__main__":
    # Example 1 test case:
    # n_ex1 = 2
    # edges_ex1 = [[1, 2]]
    # queries_ex1 = [[1, 1], [1, 2]]
    # Expected Output: [0, 1]

    # Example 2 test case:
    n_ex2 = 5
    edges_ex2 = [[1, 2], [1, 3], [3, 4], [3, 5]]
    queries_ex2 = [[1, 4], [3, 4], [2, 5]]
    # Expected Output: [2, 1, 4]

    # To run a specific example, uncomment and call `solve_with_input`
    # def solve_with_input(n_val, edges_val, queries_val):
    #     # Temporarily override the simulated input inside solve()
    #     global n, edges, queries
    #     original_n, original_edges, original_queries = n, edges, queries
    #     n, edges, queries = n_val, edges_val, queries_val
    #
    #     result = solve()
    #
    #     # Restore original values
    #     n, edges, queries = original_n, original_edges, original_queries
    #     return result
    #
    # print(f"Example 1 Output: {solve_with_input(n_ex1, edges_ex1, queries_ex1)}")
    # print(f"Example 2 Output: {solve_with_input(n_ex2, edges_ex2, queries_ex2)}")

    # When running this script, it will use the last set of simulated inputs (Example 2)
    # and print the results.
    print(solve())
```