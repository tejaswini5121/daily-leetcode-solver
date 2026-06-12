// Problem: Number of Ways to Assign Edge Weights II
// Link: https://leetcode.com/problems/number-of-ways-to-assign-edge-weights-ii/
//
// Approach:
// The problem asks us to count the number of ways to assign weights (1 or 2) to edges on the path between two nodes (u, v) such that the total path cost is odd.
//
// Key Observation:
// The parity of the path cost is determined by the number of edges with weight 1.
// Path cost = (number of edges with weight 1) * 1 + (number of edges with weight 2) * 2
// Path cost (mod 2) = (number of edges with weight 1) * 1 (mod 2)
// So, the path cost is odd if and only if the number of edges with weight 1 is odd.
//
// For a path of length k (i.e., k edges):
// Let 'o' be the number of edges assigned weight 1.
// Let 'e' be the number of edges assigned weight 2.
// o + e = k
// We want the path cost to be odd, which means 'o' must be odd.
//
// The total number of ways to assign weights to k edges is 2^k (each edge can be 1 or 2).
//
// Consider the number of ways to choose 'o' edges to have weight 1, where 'o' is odd.
// This is equivalent to summing C(k, 1) + C(k, 3) + C(k, 5) + ...
// A known identity states that C(k, 0) + C(k, 1) + C(k, 2) + ... + C(k, k) = 2^k.
// Another identity states that C(k, 0) - C(k, 1) + C(k, 2) - C(k, 3) + ... + (-1)^k C(k, k) = 0 (for k > 0).
// Summing these two: 2 * (C(k, 0) + C(k, 2) + C(k, 4) + ...) = 2^k
// Subtracting the second from the first: 2 * (C(k, 1) + C(k, 3) + C(k, 5) + ...) = 2^k
// Therefore, C(k, 1) + C(k, 3) + C(k, 5) + ... = 2^(k-1) (for k > 0).
//
// So, if the path length is k > 0, there are 2^(k-1) ways to have an odd number of edges with weight 1, and thus an odd path cost.
// If the path length is 0 (u == v), the path cost is 0, which is even. There are 0 ways to get an odd cost.
//
// The core of the problem then reduces to finding the path length between u and v for each query.
// We can use Lowest Common Ancestor (LCA) to efficiently find path lengths in a tree.
//
// Algorithm:
// 1. Preprocess the tree to build an adjacency list and compute depths and parents for LCA.
//    - Use DFS to traverse the tree, calculating depth and parent for each node.
//    - Store the direct parent of each node.
// 2. Preprocess for LCA: For each node, compute its 2^i-th ancestor. This will be used for binary lifting.
//    - `up[node][i]` will store the 2^i-th ancestor of `node`.
// 3. For each query [u, v]:
//    - Find the LCA of u and v.
//    - Calculate the distance from the root to u (depth[u]).
//    - Calculate the distance from the root to v (depth[v]).
//    - Calculate the distance from the root to LCA(u, v) (depth[lca]).
//    - The path length between u and v is: `depth[u] + depth[v] - 2 * depth[lca]`.
//    - If the path length is 0 (u == v), the answer is 0.
//    - If the path length k > 0, the answer is 2^(k-1) (modulo 10^9 + 7).
//
// LCA Implementation using Binary Lifting:
// - `depth[node]`: Depth of the node from the root.
// - `parent[node]`: Immediate parent of the node.
// - `up[node][i]`: The 2^i-th ancestor of `node`. `up[node][0] = parent[node]`.
//   `up[node][i] = up[up[node][i-1]][i-1]`.
// - `get_lca(u, v)`:
//   - If `depth[u] < depth[v]`, swap u and v to ensure `depth[u] >= depth[v]`.
//   - Lift `u` up by `depth[u] - depth[v]` steps to match `v`'s depth. This is done using binary lifting.
//   - If `u == v` after lifting, `u` (or `v`) is the LCA.
//   - Otherwise, lift `u` and `v` simultaneously using binary lifting until their parents are the same. The parent of `u` (or `v`) at that point is the LCA.
//
// Modulo: 10^9 + 7
//
// Time Complexity:
// - Tree preprocessing (DFS and LCA preprocessing): O(N log N)
//   - DFS: O(N)
//   - LCA preprocessing: O(N log N) where N is the number of nodes. log N is for the binary lifting table.
// - For each query: O(log N) to find LCA.
// - Total for Q queries: O(Q log N)
// - Overall: O(N log N + Q log N)
//
// Space Complexity:
// - Adjacency list: O(N)
// - Depth and parent arrays: O(N)
// - LCA binary lifting table `up`: O(N log N)
// - Total: O(N log N)
//
// Constraints: n <= 10^5, queries.length <= 10^5. log(10^5) is roughly 17.
// N log N is feasible.

const MOD = 1_000_000_007;
const MAX_LOG_N = 17; // ceil(log2(10^5)) approx 16.6, so 17 is safe.

/**
 * @param {number[][]} edges
 * @param {number[][]} queries
 * @return {number[]}
 */
var numberOfWays = function(edges, queries) {
    const n = edges.length + 1; // Number of nodes

    // Build adjacency list
    const adj = Array(n + 1).fill(0).map(() => []);
    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }

    // Arrays for LCA: depth, parent, and binary lifting table
    const depth = Array(n + 1).fill(0);
    const parent = Array(n + 1).fill(0);
    // up[node][i] stores the 2^i-th ancestor of 'node'
    const up = Array(n + 1).fill(0).map(() => Array(MAX_LOG_N).fill(0));

    // DFS to compute depth, parent, and initialize binary lifting table
    const dfs = (u, p, d) => {
        depth[u] = d;
        parent[u] = p;
        up[u][0] = p; // 2^0-th ancestor is the direct parent

        // Compute higher ancestors using dynamic programming
        // up[u][i] = up[up[u][i-1]][i-1]
        for (let i = 1; i < MAX_LOG_N; i++) {
            up[u][i] = up[up[u][i - 1]][i - 1];
        }

        for (const v of adj[u]) {
            if (v !== p) {
                dfs(v, u, d + 1);
            }
        }
    };

    // Start DFS from root (node 1). Root's parent is 0 and depth is 0.
    dfs(1, 0, 0);

    // Function to get the k-th ancestor of a node
    const getAncestor = (u, k) => {
        // Iterate from highest power of 2 down to 0
        for (let i = MAX_LOG_N - 1; i >= 0; i--) {
            // If the k-th bit is set in k (meaning we need to jump 2^i steps)
            if ((k >> i) & 1) {
                u = up[u][i]; // Jump to the 2^i-th ancestor
                if (u === 0) break; // Reached or passed the root
            }
        }
        return u;
    };

    // Function to find the Lowest Common Ancestor (LCA) of two nodes u and v
    const getLCA = (u, v) => {
        // Ensure u is deeper or at the same depth as v
        if (depth[u] < depth[v]) {
            [u, v] = [v, u]; // Swap u and v
        }

        // Lift u up to the same depth as v
        // The difference in depths is depth[u] - depth[v]
        u = getAncestor(u, depth[u] - depth[v]);

        // If u and v are now the same node, that node is the LCA
        if (u === v) {
            return u;
        }

        // Lift u and v simultaneously using binary lifting
        // Move up by the largest possible power of 2 such that their ancestors are different
        for (let i = MAX_LOG_N - 1; i >= 0; i--) {
            if (up[u][i] !== up[v][i]) {
                u = up[u][i];
                v = up[v][i];
            }
        }

        // After the loop, up[u][0] (which is parent[u]) will be the LCA
        return parent[u];
    };

    // Precompute powers of 2 for efficiency (modulo MOD)
    const powersOfTwo = Array(n + 1).fill(0);
    powersOfTwo[0] = 1;
    for (let i = 1; i <= n; i++) {
        powersOfTwo[i] = (powersOfTwo[i - 1] * 2) % MOD;
    }

    const results = [];

    // Process each query
    for (const [u, v] of queries) {
        // If u and v are the same node, the path length is 0.
        // Cost is 0 (even). Number of ways to get odd cost is 0.
        if (u === v) {
            results.push(0);
            continue;
        }

        // Find the LCA of u and v
        const lca = getLCA(u, v);

        // Calculate the path length between u and v
        // Path length = (distance from root to u) + (distance from root to v) - 2 * (distance from root to LCA)
        const pathLength = depth[u] + depth[v] - 2 * depth[lca];

        // For a path of length k > 0, there are 2^(k-1) ways to assign weights
        // such that the path cost is odd.
        // The number of ways is powersOfTwo[pathLength - 1]
        results.push(powersOfTwo[pathLength - 1]);
    }

    return results;
};
```