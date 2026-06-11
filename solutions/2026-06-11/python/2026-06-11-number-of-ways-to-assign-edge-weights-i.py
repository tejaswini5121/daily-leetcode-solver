```python
# LeetCode problem: Number of Ways to Assign Edge Weights I
# Link: https://leetcode.com/problems/number-of-ways-to-assign-edge-weights-i/
#
# Problem Summary:
# Given a tree, assign weights 1 or 2 to each edge. We need to find the number
# of ways to assign weights such that the path cost from the root (node 1) to
# any node at the maximum depth is odd.
#
# Approach:
# The problem states we need to consider "any one node x at the maximum depth".
# This implies that if there are multiple nodes at the maximum depth, we only
# need to satisfy the condition for one of them. Let's pick one such node.
# The path from node 1 to any node `x` in a tree is unique. Let the path be
# 1 -> v1 -> v2 -> ... -> vk -> x. The cost of this path is the sum of weights
# assigned to the edges (1, v1), (v1, v2), ..., (vk, x).
#
# Each edge can be assigned a weight of 1 or 2.
# We want the total path cost to be odd.
#
# Consider a path of length `L` (i.e., `L` edges).
# Let `k` be the number of edges assigned weight 1.
# Then `L - k` edges are assigned weight 2.
# The total cost is `k * 1 + (L - k) * 2 = k + 2L - 2k = 2L - k`.
#
# For the total cost `2L - k` to be odd, `k` must be odd.
# This is because `2L` is always even, so `even - k` is odd if and only if `k` is odd.
#
# So, the problem reduces to finding the number of ways to assign weights such
# that an odd number of edges in the path from root (node 1) to a max-depth
# node `x` are assigned weight 1.
#
# First, we need to find the maximum depth of the tree and one node at that depth.
# We can use BFS or DFS to calculate depths. A DFS is suitable here.
# During DFS, we can also build an adjacency list representation of the tree
# and keep track of visited nodes to avoid cycles (though it's a tree, so no cycles).
# We can also keep track of the parent to avoid going back up the tree.
#
# The DFS function will return the depth of the current node.
# We'll maintain a global `max_depth` and `node_at_max_depth`.
#
# Once we have identified a node `x` at the maximum depth, we need to find the
# path from node 1 to `x`. A simple way to do this is to perform another DFS
# or BFS starting from `x` and going towards the root, using parent pointers
# or by checking neighbors that are at a shallower depth. A DFS from root
# that also stores parents is more direct.
#
# Let's use DFS from root (node 1) to:
# 1. Calculate depth of each node.
# 2. Find the maximum depth and one node at that depth.
# 3. Store parent of each node to reconstruct the path.
#
# `dfs(u, p, current_depth)`:
# - `adj`: adjacency list
# - `depth[u]`: stores depth of node `u`
# - `parent[u]`: stores parent of node `u`
# - `max_depth`, `node_at_max_depth`: global variables
#
# `adj`: `defaultdict(list)`
# `depth`: `[-1] * (n + 1)`
# `parent`: `[0] * (n + 1)`
# `max_depth = 0`
# `node_at_max_depth = -1`
#
# Call `dfs(1, 0, 0)`
#
# After DFS, we have `max_depth` and `node_at_max_depth`.
#
# Now, we need to find the path from 1 to `node_at_max_depth`.
# We can reconstruct this path by backtracking from `node_at_max_depth` using `parent` array.
# `path_nodes = []`
# `curr = node_at_max_depth`
# `while curr != 0:`
#   `path_nodes.append(curr)`
#   `curr = parent[curr]`
# `path_nodes.reverse()` # path_nodes now contains [1, ..., node_at_max_depth]
#
# The length of the path (number of edges) is `len(path_nodes) - 1`.
# Let `L = len(path_nodes) - 1`.
#
# We need to assign weights such that an odd number of edges on this path are weight 1.
# The number of edges to assign weight 1 can be 1, 3, 5, ... up to `L` (if `L` is odd)
# or `L-1` (if `L` is even).
#
# For a path of length `L`, there are `L` edges. Each edge has 2 choices (1 or 2).
# Total number of ways to assign weights is `2^L`.
#
# We want the number of assignments where exactly `k` edges are weight 1, where `k` is odd.
# The number of ways to choose `k` edges out of `L` is `C(L, k)`.
#
# The total number of ways for an odd `k` is `C(L, 1) + C(L, 3) + C(L, 5) + ...`
#
# It's a known combinatorial identity that for `L >= 1`:
# `C(L, 0) + C(L, 2) + C(L, 4) + ... = 2^(L-1)` (sum of even combinations)
# `C(L, 1) + C(L, 3) + C(L, 5) + ... = 2^(L-1)` (sum of odd combinations)
#
# The only exception is `L = 0` (tree with only root, but problem states `n >= 2`, so `L >= 1`).
#
# So, if the path length `L` is at least 1, the number of ways to assign weights
# such that an odd number of edges have weight 1 is exactly `2^(L-1)`.
#
# The modulo is `10^9 + 7`.
#
# We need to calculate `pow(2, L-1, 10^9 + 7)`.
#
# Let's verify the logic with examples:
# Example 1: edges = [[1,2]]
# Tree: 1 -- 2
# n = 2. Max depth = 1. Node at max depth = 2.
# Path from 1 to 2 is just the edge (1,2). Path length L = 1.
# We need an odd number of edges with weight 1. So, 1 edge must have weight 1.
# - Assign weight 1 to (1,2): cost = 1 (odd). Valid.
# - Assign weight 2 to (1,2): cost = 2 (even). Invalid.
# Number of ways = 1.
# Our formula: `2^(L-1) = 2^(1-1) = 2^0 = 1`. Correct.
#
# Example 2: edges = [[1,2],[1,3],[3,4],[3,5]]
# Tree:
#     1
#    / \
#   2   3
#      / \
#     4   5
# n = 5.
# Depths:
# Depth 0: {1}
# Depth 1: {2, 3}
# Depth 2: {4, 5}
# Max depth = 2. Nodes at max depth = {4, 5}.
#
# Let's pick node 4.
# Path from 1 to 4: 1 -> 3 -> 4. Edges: (1,3), (3,4). Path length L = 2.
# We need an odd number of edges with weight 1. So, k can be 1.
# Possible assignments for ((1,3), (3,4)):
# (1,1): cost 1+1=2 (even) - Invalid (k=2, even)
# (1,2): cost 1+2=3 (odd) - Valid (k=1, odd)
# (2,1): cost 2+1=3 (odd) - Valid (k=1, odd)
# (2,2): cost 2+2=4 (even) - Invalid (k=0, even)
# Number of valid ways = 2.
#
# Our formula: `2^(L-1) = 2^(2-1) = 2^1 = 2`. Correct.
#
# Let's pick node 5.
# Path from 1 to 5: 1 -> 3 -> 5. Edges: (1,3), (3,5). Path length L = 2.
# Same path length, same logic, 2 ways.
#
# The crucial part is "Select any one node x at the maximum depth".
# This means we don't sum up ways for all max-depth nodes. We just pick one.
#
# Implementation details:
# - Adjacency list.
# - DFS to compute depths and parents, and find max depth node.
# - Calculate `L-1` and then `pow(2, L-1, MOD)`.
#
# `MOD = 10^9 + 7`
#
# Time Complexity:
# - Building adjacency list: O(N)
# - DFS to find depths, parents, max depth: O(N)
# - Calculating `pow(2, L-1)`: O(log L) which is O(log N) because L <= N.
# Total time complexity: O(N).
#
# Space Complexity:
# - Adjacency list: O(N)
# - Depth array: O(N)
# - Parent array: O(N)
# - Recursion stack for DFS: O(N) in worst case (skewed tree).
# Total space complexity: O(N).
#
# Edge cases:
# - n=2: Smallest tree, handled.
# - Skewed tree: DFS stack depth might be large, but within O(N).
#
# Constraints: `2 <= n <= 10^5`.
#
# Let's write the code.
# We can use `collections.defaultdict(list)` for adjacency list.

import sys
from collections import defaultdict

# Increase recursion depth for potentially deep trees
sys.setrecursionlimit(200000)

class Solution:
    def numberOfWays(self, edges: list[list[int]]) -> int:
        MOD = 10**9 + 7

        # Build adjacency list
        adj = defaultdict(list)
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)

        # Global variables to store max depth and a node at that depth
        self.max_depth = 0
        self.node_at_max_depth = -1

        # Arrays to store depth and parent of each node
        # Initialize depth to -1 (unvisited) and parent to 0 (no parent for root)
        n = len(edges) + 1
        depth = [-1] * (n + 1)
        parent = [0] * (n + 1)

        # DFS function to compute depths, parents, and find the node at max depth
        def dfs(u: int, p: int, current_depth: int):
            depth[u] = current_depth
            parent[u] = p

            # Update max_depth and node_at_max_depth if current node is deeper
            if current_depth > self.max_depth:
                self.max_depth = current_depth
                self.node_at_max_depth = u

            # Recurse on neighbors
            for v in adj[u]:
                if v != p:  # Avoid going back to parent
                    dfs(v, u, current_depth + 1)

        # Start DFS from root (node 1) with parent 0 and depth 0
        dfs(1, 0, 0)

        # If no node at max depth was found (shouldn't happen for n>=2, but for safety)
        if self.node_at_max_depth == -1:
            return 0 # Or handle as per problem context, but for n>=2 this is unreachable

        # The path length L is the depth of the node at max depth.
        # This is because the depth calculation starts from 0 for the root.
        # A node at depth `d` is connected to the root by a path of `d` edges.
        path_length_L = self.max_depth

        # If the path length is 0 (only root node, but n>=2, so L>=1), this case is not possible.
        # For L >= 1, the number of ways to have an odd number of edges with weight 1 is 2^(L-1).
        # We need to compute (2^(path_length_L - 1)) % MOD.

        # If path_length_L is 0 (which implies n=1, not possible by constraints)
        # The formula 2^(L-1) would be problematic if L=0.
        # But since n >= 2, path_length_L >= 1.
        # For path_length_L = 1 (e.g., 1->2), L-1 = 0, 2^0 = 1.
        # For path_length_L = 2 (e.g., 1->3->4), L-1 = 1, 2^1 = 2.

        # Calculate (2^(path_length_L - 1)) % MOD
        # Python's pow() function handles modular exponentiation efficiently.
        # The base is 2, the exponent is path_length_L - 1, and the modulus is MOD.
        result = pow(2, path_length_L - 1, MOD)

        return result

```