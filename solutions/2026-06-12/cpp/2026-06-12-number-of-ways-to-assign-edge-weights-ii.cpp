```cpp
// Problem: Number of Ways to Assign Edge Weights II
// Link: https://leetcode.com/problems/number-of-ways-to-assign-edge-weights-ii/
//
// Approach:
// The core of this problem lies in understanding the parity of path costs.
// Each edge can be assigned a weight of 1 or 2. The cost of a path is the sum
// of weights of edges on that path. We are interested in assignments where the
// path cost is odd.
//
// Consider a path between two nodes u and v. Let this path consist of k edges.
// Let x be the number of edges with weight 1, and y be the number of edges with
// weight 2. Then x + y = k.
// The total cost of the path is x * 1 + y * 2.
// We want this cost to be odd: x + 2y is odd.
// Since 2y is always even, the parity of x + 2y is determined by the parity of x.
// Thus, we need x (the number of edges with weight 1) to be odd.
//
// For a given path of length k:
// - If k is odd:
//   - To make the number of weight-1 edges odd (i.e., x is odd), x can be 1, 3, 5, ..., up to k.
//   - The number of ways to choose x edges out of k to have weight 1 is C(k, x).
//   - So the total ways for an odd cost is C(k, 1) + C(k, 3) + ... + C(k, k).
//   - It is a known combinatorial identity that the sum of binomial coefficients with odd lower indices is 2^(k-1).
//   - For each of the remaining k-x edges, they must have weight 2. There's only 1 way to assign weight 2 to them.
//   - So for each odd x, there are C(k, x) ways. The total is 2^(k-1).
// - If k is even:
//   - To make the number of weight-1 edges odd (i.e., x is odd), x can be 1, 3, 5, ..., up to k-1.
//   - The total ways for an odd cost is C(k, 1) + C(k, 3) + ... + C(k, k-1).
//   - This sum is also 2^(k-1).
//
// Therefore, for any path of length k (where k >= 1), the number of ways to assign
// weights such that the path cost is odd is 2^(k-1) modulo 10^9 + 7.
//
// The problem then reduces to finding the length of the path between ui and vi for each query.
// Since this is a tree, the path between any two nodes is unique. We can use Lowest Common Ancestor (LCA)
// to find path lengths. The length of the path between u and v is:
// depth(u) + depth(v) - 2 * depth(LCA(u, v)).
//
// To efficiently compute depths and LCA, we can pre-process the tree using DFS.
// We need to build an adjacency list and compute depths for all nodes. For LCA,
// we can use binary lifting.
//
// Pre-processing:
// 1. Build adjacency list.
// 2. Perform DFS from root (node 1) to compute:
//    - depth[node]: depth of the node from the root.
//    - parent[node][k]: 2^k-th ancestor of node.
// 3. For each query [u, v]:
//    - Find LCA(u, v).
//    - Calculate path length `len = depth[u] + depth[v] - 2 * depth[lca]`.
//    - If `len == 0` (u == v), the path cost is 0 (even), so 0 ways.
//    - If `len > 0`, the number of ways is `(1LL << (len - 1)) % MOD`.
//
// The modulo is 10^9 + 7. We need to compute powers of 2 modulo MOD.
//
// Detailed steps:
// 1. Adjacency List: `vector<vector<int>> adj;`
// 2. DFS for Depth and Parent (for Binary Lifting):
//    `vector<int> depth;`
//    `vector<vector<int>> up; // up[i][j] is the 2^j-th ancestor of node i`
//    `MAX_LOG` for binary lifting will be around `ceil(log2(n))`.
//    DFS function signature: `void dfs(int u, int p, int d, int n)`
//    Inside DFS:
//        `depth[u] = d;`
//        `up[u][0] = p;`
//        `for (int j = 1; j < MAX_LOG; ++j) {`
//            `up[u][j] = up[up[u][j-1]][j-1];`
//        `}`
//        `for (int v : adj[u]) {`
//            `if (v != p) dfs(v, u, d + 1, n);`
//        `}`
// 3. LCA function: `int lca(int u, int v, const vector<int>& depth, const vector<vector<int>>& up, int MAX_LOG)`
//    - Equalize depths: If `depth[u] < depth[v]`, swap `u` and `v`.
//    - Lift `u` up to the same depth as `v`: Iterate from `MAX_LOG-1` down to 0. If `depth[u] - (1 << i) >= depth[v]`, then `u = up[u][i]`.
//    - If `u == v` after equalizing depths, then `v` is the LCA.
//    - Lift both `u` and `v` simultaneously: Iterate from `MAX_LOG-1` down to 0. If `up[u][i] != up[v][i]`, then `u = up[u][i]` and `v = up[v][i]`.
//    - The LCA will be `up[u][0]`.
// 4. Precompute powers of 2 modulo MOD: `vector<long long> powersOfTwo;`
//
// Time Complexity:
// - Building adjacency list: O(N)
// - DFS for depths and binary lifting pre-computation: O(N log N) (for each node, we iterate up to log N ancestors)
// - For each query:
//   - LCA computation: O(log N)
//   - Path length calculation: O(1)
//   - Power calculation: O(1) (if precomputed)
// - Total for Q queries: O(Q log N)
// - Overall Time Complexity: O(N log N + Q log N)
//
// Space Complexity:
// - Adjacency list: O(N)
// - Depth array: O(N)
// - Binary lifting parent array `up`: O(N log N)
// - Powers of two array: O(N)
// - Overall Space Complexity: O(N log N)

#include <vector>
#include <cmath>
#include <numeric>
#include <algorithm>

using namespace std;

// Define modulo constant
const int MOD = 1e9 + 7;

// Global variables for DFS and LCA
vector<vector<int>> adj;
vector<int> depth;
vector<vector<int>> up;
int MAX_LOG;
vector<long long> powersOfTwo;

// DFS function to compute depths and populate the 'up' table for binary lifting
// u: current node
// p: parent of the current node
// d: depth of the current node
// n: total number of nodes
void dfs(int u, int p, int d) {
    depth[u] = d;
    up[u][0] = p; // Set the immediate parent

    // Populate the 'up' table for binary lifting
    // up[u][j] stores the 2^j-th ancestor of node u
    for (int j = 1; j < MAX_LOG; ++j) {
        // The 2^j-th ancestor of u is the 2^(j-1)-th ancestor of the 2^(j-1)-th ancestor of u
        up[u][j] = up[up[u][j - 1]][j - 1];
    }

    // Recursively call DFS for all adjacent nodes
    for (int v : adj[u]) {
        if (v != p) { // Avoid going back to the parent
            dfs(v, u, d + 1);
        }
    }
}

// Function to find the Lowest Common Ancestor (LCA) of two nodes u and v
// depth: vector storing depths of each node
// up: binary lifting table
// MAX_LOG: maximum log value used for binary lifting
int lca(int u, int v) {
    // Ensure u is deeper than v or at the same depth
    if (depth[u] < depth[v]) {
        swap(u, v);
    }

    // Lift u up to the same depth as v
    // Iterate from the largest power of 2 downwards
    for (int i = MAX_LOG - 1; i >= 0; --i) {
        // If 2^i steps from u do not go above v's depth
        if (depth[u] - (1 << i) >= depth[v]) {
            u = up[u][i]; // Move u up by 2^i steps
        }
    }

    // If u is now equal to v, it means v was an ancestor of u, so v is the LCA
    if (u == v) {
        return v;
    }

    // Lift u and v simultaneously until their parents are the same
    // Iterate from the largest power of 2 downwards
    for (int i = MAX_LOG - 1; i >= 0; --i) {
        // If the 2^i-th ancestors of u and v are different
        if (up[u][i] != up[v][i]) {
            u = up[u][i]; // Move u up
            v = up[v][i]; // Move v up
        }
    }

    // After the loop, up[u][0] and up[v][0] will be the same node, which is the LCA
    return up[u][0];
}

// Function to calculate powers of 2 modulo MOD
void precomputePowers(int n) {
    powersOfTwo.resize(n + 1);
    powersOfTwo[0] = 1; // 2^0 = 1
    for (int i = 1; i <= n; ++i) {
        powersOfTwo[i] = (powersOfTwo[i - 1] * 2) % MOD;
    }
}

class Solution {
public:
    vector<int> countWays(int n, vector<vector<int>>& edges, vector<vector<int>>& queries) {
        // Initialize global variables
        adj.assign(n + 1, vector<int>());
        depth.assign(n + 1, 0);
        MAX_LOG = ceil(log2(n)) + 1; // Maximum power of 2 needed for binary lifting
        up.assign(n + 1, vector<int>(MAX_LOG));

        // Build the adjacency list
        for (const auto& edge : edges) {
            adj[edge[0]].push_back(edge[1]);
            adj[edge[1]].push_back(edge[0]);
        }

        // Precompute powers of 2 modulo MOD
        precomputePowers(n);

        // Perform DFS starting from root (node 1) to compute depths and populate 'up' table
        // Node 1 is the root, its parent is 0 (a dummy node), and its depth is 0
        dfs(1, 0, 0);

        vector<int> answer;
        answer.reserve(queries.size()); // Reserve space for efficiency

        // Process each query
        for (const auto& query : queries) {
            int u = query[0];
            int v = query[1];

            // If u and v are the same node, the path has length 0. The cost is 0 (even).
            // There are 0 ways to get an odd cost.
            if (u == v) {
                answer.push_back(0);
                continue;
            }

            // Find the LCA of u and v
            int ancestor = lca(u, v);

            // Calculate the path length between u and v
            // Path length = depth(u) + depth(v) - 2 * depth(LCA(u, v))
            int pathLength = depth[u] + depth[v] - 2 * depth[ancestor];

            // For a path of length k (k >= 1), the number of ways to assign weights
            // (1 or 2) such that the path cost is odd is 2^(k-1) modulo MOD.
            // This is because the parity of the path cost depends only on the parity
            // of the number of edges with weight 1.
            // The sum of C(k, 1) + C(k, 3) + ... is 2^(k-1).
            // `powersOfTwo[pathLength - 1]` gives us 2^(pathLength - 1) mod MOD.
            answer.push_back(powersOfTwo[pathLength - 1]);
        }

        return answer;
    }
};
```