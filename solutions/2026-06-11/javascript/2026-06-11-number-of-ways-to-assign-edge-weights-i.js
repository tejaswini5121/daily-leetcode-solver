/**
 * @param {number[][]} edges
 * @return {number}
 */
const numberOfWaysToAssignEdgeWeights = function(edges) {
    // Problem Summary: Given a tree, assign weights (1 or 2) to edges.
    // Find the number of ways to assign weights such that the path cost from root (1)
    // to a node at maximum depth is odd.
    // Link: https://leetcode.com/problems/number-of-ways-to-assign-edge-weights-i/
    //
    // Approach:
    // The problem asks for the number of ways to assign edge weights (1 or 2)
    // to make the path cost from the root (node 1) to a node at maximum depth odd.
    // Since we only care about the parity of the path cost, we can simplify the weights.
    // Assigning weight 1 or 2 to an edge results in the same parity for the path cost
    // if the *difference* in parity between the two weights is odd.
    // For example, if we have two edges on a path, say edge A and edge B:
    // Path cost = weight(A) + weight(B)
    // If weight(A) is 1 and weight(B) is 2, cost = 3 (odd)
    // If weight(A) is 2 and weight(B) is 1, cost = 3 (odd)
    // If weight(A) is 1 and weight(B) is 1, cost = 2 (even)
    // If weight(A) is 2 and weight(B) is 2, cost = 4 (even)
    //
    // This implies that the parity of the path cost depends on the number of edges assigned weight 1.
    // Specifically, the path cost is odd if and only if the number of edges with weight 1 is odd.
    //
    // The core idea is to identify nodes at the maximum depth. For any such node `x`, the path from
    // node 1 to `x` is unique in a tree. Let this path have `k` edges.
    // We need to assign weights to these `k` edges such that the sum of their weights is odd.
    //
    // Let's consider an edge. If we assign it weight 1, it contributes 1 to the sum. If we assign it weight 2, it contributes 0 to the parity sum (since 2 is even).
    // So, we are essentially deciding for each edge whether it contributes 1 (if weight is 1) or 0 (if weight is 2) to the parity of the path sum.
    //
    // For any path of length `k` from the root to a node `x`, we need to assign weights to the `k` edges.
    // Let `n1` be the number of edges assigned weight 1, and `n2` be the number of edges assigned weight 2.
    // `n1 + n2 = k`.
    // The total cost is `n1 * 1 + n2 * 2`.
    // We want `n1 * 1 + n2 * 2` to be odd.
    // `n1 + 2 * n2` is odd.
    // Since `2 * n2` is always even, the parity of the total cost is determined by `n1`.
    // Thus, we need `n1` to be odd.
    //
    // For a path of length `k`, if `k` is even, we can have `n1` be 1, 3, ..., k-1 (odd counts).
    // If `k` is odd, we can have `n1` be 1, 3, ..., k (odd counts).
    //
    // The key observation from the problem statement is:
    // "The problem asks for the number of ways to assign edge weights in the path from node 1 to x such that its total cost is odd."
    // It implies that for a *specific* node `x` at maximum depth, we count the ways.
    //
    // Consider a path of length `L` from node 1 to node `x`. Let this path consist of edges `e1, e2, ..., eL`.
    // For each edge `ei`, we can assign weight 1 or 2.
    // The cost of the path is `w(e1) + w(e2) + ... + w(eL)`.
    // We want this sum to be odd.
    //
    // Let's think about the parity contribution of each edge.
    // If we assign weight 1, the edge contributes 1 (odd).
    // If we assign weight 2, the edge contributes 0 (even) to the parity.
    //
    // The total path cost parity is the sum of parities of individual edge weights (modulo 2).
    // Path Cost (mod 2) = (w(e1) mod 2 + w(e2) mod 2 + ... + w(eL) mod 2) mod 2.
    //
    // If we assign weight 1: w(ei) mod 2 = 1.
    // If we assign weight 2: w(ei) mod 2 = 0.
    //
    // So, for each edge on the path, we are deciding whether to make its contribution to the parity sum 1 or 0.
    // This is equivalent to saying: we can choose to assign a weight of 1 to any edge, and a weight of 2 to any edge.
    //
    // The question is about the number of ways to assign *edge weights*.
    //
    // Let's re-read carefully: "Select any one node x at the maximum depth. Return the number of ways to assign edge weights in the path from node 1 to x such that its total cost is odd."
    //
    // The problem statement implies that we pick *one* node `x` at the maximum depth. If there are multiple nodes at the maximum depth, we can pick *any* one of them.
    // The examples clarify this. In Example 2, nodes 4 and 5 are at max depth. We can pick either 4 or 5.
    //
    // Let's consider the path from root (1) to node `x`. Let this path have length `k`.
    // For each of the `k` edges on this path, we have 2 choices: assign weight 1 or assign weight 2.
    // This gives a total of `2^k` possible ways to assign weights to the edges on the path.
    //
    // We need the sum of weights to be odd.
    // Let `m` be the number of edges assigned weight 1, and `k-m` be the number of edges assigned weight 2.
    // The sum is `m * 1 + (k-m) * 2`. We want this to be odd.
    // `m + 2k - 2m = 2k - m`.
    // For `2k - m` to be odd, `m` must be odd.
    //
    // So, out of the `k` edges on the path, we need to choose an odd number of them to assign weight 1.
    // The number of ways to choose `m` edges out of `k` is `C(k, m)`.
    // We need to sum `C(k, m)` for all odd `m` from 1 to `k`.
    // This sum is `C(k, 1) + C(k, 3) + C(k, 5) + ...`
    //
    // It's a known combinatorial identity that for `k >= 1`:
    // `C(k, 1) + C(k, 3) + C(k, 5) + ... = 2^(k-1)`
    //
    // And for `k >= 1`:
    // `C(k, 0) + C(k, 2) + C(k, 4) + ... = 2^(k-1)`
    //
    // So, for any path of length `k >= 1`, the number of ways to assign weights such that the path cost is odd is `2^(k-1)`.
    //
    // What if k=0? This means node x is the root itself. The path has 0 edges, cost is 0 (even). This case is not possible because the problem states n >= 2, so there will always be at least one edge and a depth > 0 for some node.
    //
    // The problem asks for the number of ways to assign edge weights in the path from node 1 to `x` such that its total cost is odd.
    // If `x` is at depth `d`, the path from 1 to `x` has `d` edges. So `k=d`.
    // The number of ways for a specific `x` at maximum depth `D` is `2^(D-1)`.
    //
    // The problem states: "Select any one node x at the maximum depth."
    // This phrasing is a bit ambiguous. Does it mean:
    // 1. Pick *one specific* node `x` at max depth, calculate ways for it, and return that.
    // 2. Sum the ways for *all* nodes at max depth?
    //
    // The examples suggest interpretation 1.
    // Example 1: edges = [[1,2]]. Max depth is 1 (node 2). Path 1->2 has 1 edge. `k=1`. Ways = `2^(1-1) = 2^0 = 1`.
    // Example 2: edges = [[1,2],[1,3],[3,4],[3,5]].
    // Tree structure:
    //     1
    //    / \
    //   2   3
    //      / \
    //     4   5
    // Depth: 1 (depth 0), 2 (depth 1), 3 (depth 1), 4 (depth 2), 5 (depth 2).
    // Maximum depth is 2. Nodes 4 and 5 are at maximum depth.
    //
    // If we select node 4: Path 1->3->4. Length `k=2`. Ways = `2^(2-1) = 2^1 = 2`.
    // Weights assignments for (1->3, 3->4):
    // (1,1) -> cost 2 (even)
    // (1,2) -> cost 3 (odd)
    // (2,1) -> cost 3 (odd)
    // (2,2) -> cost 4 (even)
    // Valid ways: 2.
    //
    // If we select node 5: Path 1->3->5. Length `k=2`. Ways = `2^(2-1) = 2^1 = 2`.
    //
    // The output for Example 2 is 2. This means we should calculate the number of ways for *any one* node at maximum depth. Since the number of ways is the same for all nodes at the same maximum depth (because the path length `k` is the same), we just need to find the maximum depth `D`, and the answer is `2^(D-1)`.
    //
    // So, the algorithm is:
    // 1. Build an adjacency list representation of the tree.
    // 2. Perform a Breadth-First Search (BFS) or Depth-First Search (DFS) starting from node 1 to find the depth of each node and determine the maximum depth.
    // 3. Let the maximum depth be `D`.
    // 4. The answer is `2^(D-1)` modulo `10^9 + 7`.
    //
    // Implementation details:
    // - Adjacency list: `adj[u]` will store neighbors of `u`.
    // - BFS: Use a queue. Keep track of `(node, depth)`.
    // - `maxDepth`: Variable to store the maximum depth found.
    // - Modulo: `10^9 + 7`.
    //
    // Let's re-verify the logic with edge cases and constraints.
    // `n <= 10^5`. Building adjacency list is O(N+E) = O(N). BFS/DFS is O(N+E) = O(N).
    // Calculating 2^(D-1) modulo 10^9 + 7 can be done efficiently using modular exponentiation if D-1 is large. However, D can be at most N-1. If D-1 is large, direct `Math.pow` might lead to precision issues or overflow before modulo.
    //
    // Let's consider calculating 2^(D-1) mod M.
    // If `D-1 < 0` (i.e., D=0), this implies root is the only node, which is ruled out by N >= 2.
    // If `D-1 = 0` (i.e., D=1), answer is `2^0 = 1`.
    // If `D-1 > 0`, we need `pow(2, D-1, MOD)`.
    //
    // The constraints state `n >= 2`, so there's always at least one edge. The root is at depth 0. Any other node will have depth >= 1. So `maxDepth >= 1`. Therefore `D-1 >= 0`.
    //
    // Example: edges = [[1,2]]
    // adj: {1: [2], 2: [1]}
    // BFS from 1:
    // Queue: [(1, 0)]
    // Pop (1, 0). Neighbors of 1: [2].
    // Visited[1] = true. Depth[1] = 0. maxDepth = 0.
    // Push (2, 1).
    // Queue: [(2, 1)]
    // Pop (2, 1). Neighbors of 2: [1].
    // Visited[2] = true. Depth[2] = 1. maxDepth = max(0, 1) = 1.
    // Node 1 is visited, skip.
    // Queue empty.
    // Max depth D = 1.
    // Answer = 2^(1-1) mod (10^9+7) = 2^0 mod (10^9+7) = 1. Correct.
    //
    // Example: edges = [[1,2],[1,3],[3,4],[3,5]]
    // adj: {1: [2, 3], 2: [1], 3: [1, 4, 5], 4: [3], 5: [3]}
    // BFS from 1:
    // Queue: [(1, 0)]
    // Pop (1, 0). visited[1]=true, depth[1]=0, maxDepth=0. Neighbors: [2, 3].
    // Push (2, 1), (3, 1).
    // Queue: [(2, 1), (3, 1)]
    // Pop (2, 1). visited[2]=true, depth[2]=1, maxDepth=max(0,1)=1. Neighbors: [1]. 1 is visited.
    // Queue: [(3, 1)]
    // Pop (3, 1). visited[3]=true, depth[3]=1, maxDepth=max(1,1)=1. Neighbors: [1, 4, 5]. 1 is visited.
    // Push (4, 2), (5, 2).
    // Queue: [(4, 2), (5, 2)]
    // Pop (4, 2). visited[4]=true, depth[4]=2, maxDepth=max(1,2)=2. Neighbors: [3]. 3 is visited.
    // Queue: [(5, 2)]
    // Pop (5, 2). visited[5]=true, depth[5]=2, maxDepth=max(2,2)=2. Neighbors: [3]. 3 is visited.
    // Queue empty.
    // Max depth D = 2.
    // Answer = 2^(2-1) mod (10^9+7) = 2^1 mod (10^9+7) = 2. Correct.
    //
    // The logic seems solid.
    // We need a modular exponentiation function for `pow(base, exp, mod)`.
    //
    // Modulo constant:
    const MOD = 1000000007;
    //
    // Modular exponentiation function
    const power = (base, exp) => {
        let res = 1n; // Use BigInt for intermediate calculations to avoid overflow
        base = BigInt(base) % BigInt(MOD);
        while (exp > 0) {
            if (exp % 2 === 1) res = (res * base) % BigInt(MOD);
            base = (base * base) % BigInt(MOD);
            exp = Math.floor(exp / 2);
        }
        return Number(res); // Convert back to Number for the final result
    };
    //
    // If `maxDepth = 0`, then `D-1 = -1`. The formula `2^(D-1)` doesn't apply directly.
    // However, `n >= 2` ensures that `maxDepth >= 1`.
    // So `D-1 >= 0`.
    //
    // Let's refine the BFS part.
    // We need to store depths and track the maximum depth.
    //
    // `n` is the number of nodes. Node labels are 1 to `n`.
    // `edges.length = n - 1`.
    //
    // Adjacency list:
    // For `n` nodes, an array of `n+1` lists is convenient to use 1-based indexing.
    //
    // Max nodes `10^5`. BFS is efficient enough.
    // The calculation `2^(D-1)` is the bottleneck if `D-1` is large and we don't use modular exponentiation.
    //
    // Let's consider the case where `maxDepth = 1`.
    // Path length `k=1`. We need `2^(1-1) = 2^0 = 1` way.
    // This is correct. If path is 1->2, weights (1) or (2). Cost 1 (odd), cost 2 (even). 1 way.
    //
    // Final check on logic:
    // The problem asks for the number of ways to assign weights to edges *in the path from node 1 to x*.
    // This implies we only consider edges on that specific path.
    // For a path of length `k`, we have `k` edges. For each edge, there are 2 weight choices.
    // Total `2^k` ways to assign weights to these `k` edges.
    // We want the sum of weights to be odd.
    // Let `m` be the count of edges with weight 1.
    // Path cost = `m * 1 + (k - m) * 2`.
    // Parity: `(m + 2*(k-m)) mod 2 = (m + 0) mod 2 = m mod 2`.
    // We need `m` to be odd.
    // The number of ways to choose `m` items from `k` is `C(k, m)`.
    // We sum `C(k, m)` for odd `m` (1, 3, 5, ...).
    // `C(k, 1) + C(k, 3) + C(k, 5) + ... = 2^(k-1)` for `k >= 1`.
    // If `k=0` (path length 0), this sum is empty, equals 0. But `k >= 1` here.
    // The maximum depth `D` is the path length from root to any node at max depth.
    // So `k = D`.
    // Answer is `2^(D-1)`.
    //
    // The `power` function needs to handle `exp = 0`.
    // `power(base, 0)` should return 1.
    // Our `power` function: `exp` loop condition is `exp > 0`. If `exp=0`, loop doesn't run, `res` remains `1n`. Correct.
    //
    // Consider the constraints on `n`: `2 <= n <= 10^5`.
    // `edges.length == n - 1`.
    //
    // The problem uses 1-based indexing for nodes, so adj list size `n+1`.
    //
    // The BFS will naturally find the maximum depth.
    //
    // Building Adjacency List:
    // `const adj = Array(n + 1).fill(0).map(() => []);`
    // For each `edge = [u, v]`:
    // `adj[u].push(v);`
    // `adj[v].push(u);`
    //
    // BFS Implementation:
    // `const queue = [[1, 0]]; // [node, depth]`
    // `const visited = new Set();`
    // `let maxDepth = 0;`
    // `visited.add(1);`
    //
    // Inside BFS loop:
    // `const [currentNode, currentDepth] = queue.shift();`
    // `maxDepth = Math.max(maxDepth, currentDepth);`
    //
    // For each `neighbor` of `currentNode`:
    // `if (!visited.has(neighbor))`
    //   `visited.add(neighbor);`
    //   `queue.push([neighbor, currentDepth + 1]);`
    //
    // After BFS, `maxDepth` will hold the maximum depth of any node.
    //
    // The result is `power(2, maxDepth - 1)`.
    //
    // If `maxDepth = 0` (only root exists), this implies `n=1`, which is not allowed.
    // `n >= 2` means there's at least one edge, so `maxDepth >= 1`.
    // Thus `maxDepth - 1 >= 0`.
    //
    // The approach looks complete and correct.
    //
    // One edge case to be careful about: `n=2`, `edges=[[1,2]]`.
    // `adj = {1: [2], 2: [1]}`.
    // BFS:
    // queue = [[1, 0]]
    // visited = {1}
    // maxDepth = 0
    //
    // Pop [1, 0]. currentDepth = 0. maxDepth = max(0, 0) = 0.
    // Neighbors of 1: [2].
    // visited.has(2) is false. Add 2 to visited. Push [2, 1].
    // queue = [[2, 1]]
    //
    // Pop [2, 1]. currentDepth = 1. maxDepth = max(0, 1) = 1.
    // Neighbors of 2: [1].
    // visited.has(1) is true. Skip.
    //
    // Queue empty.
    // Final maxDepth = 1.
    // Result = power(2, 1 - 1) = power(2, 0) = 1.
    // This matches Example 1.
    //
    // The problem specifies "rooted at node 1". Our BFS starts from node 1, which aligns with this.
    //
    // Time Complexity:
    // 1. Building adjacency list: O(N) where N is the number of nodes.
    // 2. BFS to find max depth: O(N + E) where E is the number of edges. Since it's a tree, E = N-1. So O(N).
    // 3. Modular exponentiation: O(log(maxDepth)) which is O(log N).
    // Total time complexity: O(N).
    //
    // Space Complexity:
    // 1. Adjacency list: O(N + E) = O(N).
    // 2. Visited set: O(N).
    // 3. Queue for BFS: O(N) in the worst case (e.g., a star graph).
    // Total space complexity: O(N).
    //
    // The use of BigInt in `power` function is important if `MOD * MOD` can overflow `Number.MAX_SAFE_INTEGER`.
    // `MOD = 10^9 + 7`. `MOD * MOD` is approx `10^18`. `Number.MAX_SAFE_INTEGER` is `2^53 - 1` which is approx `9 * 10^15`.
    // So `base * base` can indeed overflow `Number`. BigInt is necessary.
    // The final result is modulo MOD, so it fits within a Number.
    //
    // The problem asks for JavaScript code.
    // `Array.fill(0).map(() => [])` is a common way to create a 2D array in JS.
    // `Set` is efficient for `visited`.
    // `Array.prototype.shift()` on an array used as queue is O(N) if not careful. However, for BFS, it's usually acceptable given the overall O(N) complexity. For better performance with large queues, a custom deque or library could be used, but `shift` is standard for LeetCode.
    //
    //
    // Final check on the problem wording:
    // "Select any one node x at the maximum depth."
    // This means if there are multiple nodes at max depth, we just need to pick *one* of them and compute the ways. Since the path length (depth) is the same for all nodes at max depth, the number of ways `2^(D-1)` will be the same. So we don't need to sum anything up. We just need to find the max depth `D`.
    //
    // Seems ready for implementation.
};

/**
 * @param {number[][]} edges
 * @return {number}
 */
const numberOfWaysToAssignEdgeWeights = function(edges) {
    // Problem Summary: Given a tree, assign weights (1 or 2) to edges.
    // Find the number of ways to assign weights such that the path cost from root (1)
    // to a node at maximum depth is odd.
    // Link: https://leetcode.com/problems/number-of-ways-to-assign-edge-weights-i/
    //
    // Approach:
    // The cost of a path is the sum of its edge weights. We need this sum to be odd.
    // Let a path from node 1 to node `x` have `k` edges.
    // We can assign weight 1 or 2 to each of these `k` edges.
    // Let `m` be the number of edges assigned weight 1, and `k-m` be the number of edges assigned weight 2.
    // The total cost is `m * 1 + (k - m) * 2`.
    // We want `m + 2*(k-m)` to be odd.
    // `m + 2k - 2m = 2k - m`.
    // Since `2k` is always even, the parity of `2k - m` is determined by the parity of `m`.
    // So, we need `m` (the number of edges assigned weight 1) to be odd.
    //
    // The number of ways to choose `m` edges out of `k` to assign weight 1 is `C(k, m)`.
    // We need to sum `C(k, m)` for all odd `m` (i.e., m = 1, 3, 5, ...).
    // It is a known combinatorial identity that for `k >= 1`, the sum of binomial coefficients
    // for odd lower indices is `C(k, 1) + C(k, 3) + C(k, 5) + ... = 2^(k-1)`.
    //
    // The problem asks us to select *any one* node `x` at the maximum depth.
    // If the maximum depth is `D`, then the path from node 1 to any node at this depth has length `k = D`.
    // Therefore, the number of ways to assign weights for any such node `x` is `2^(D-1)`.
    //
    // The algorithm is:
    // 1. Build an adjacency list representation of the tree.
    // 2. Perform a Breadth-First Search (BFS) starting from node 1 to find the maximum depth `D` of any node in the tree.
    // 3. Calculate `2^(D-1)` modulo `10^9 + 7`.
    //
    // Constraints: `2 <= n <= 10^5`. Node labels are 1 to n.
    // Since `n >= 2`, there is at least one edge, and the maximum depth `D` will be at least 1. Thus, `D-1 >= 0`.
    //
    // Time Complexity:
    // - Building adjacency list: O(N)
    // - BFS to find max depth: O(N) (since it's a tree, E = N-1)
    // - Modular exponentiation: O(log D), which is O(log N)
    // Total Time Complexity: O(N)
    //
    // Space Complexity:
    // - Adjacency list: O(N)
    // - Visited set: O(N)
    // - Queue for BFS: O(N) in the worst case
    // Total Space Complexity: O(N)

    const MOD = 1000000007;
    const n = edges.length + 1; // Number of nodes

    // Helper function for modular exponentiation (calculates base^exp % mod)
    // Uses BigInt for intermediate calculations to prevent overflow.
    const power = (base, exp) => {
        if (exp < 0) return 0; // Should not happen given constraints, but for safety
        let res = 1n;
        let b = BigInt(base) % BigInt(MOD); // Ensure base is within modulo range
        let e = BigInt(exp);

        while (e > 0n) {
            // If exponent is odd, multiply result by base
            if (e % 2n === 1n) {
                res = (res * b) % BigInt(MOD);
            }
            // Square the base
            b = (b * b) % BigInt(MOD);
            // Halve the exponent
            e = e / 2n;
        }
        return Number(res); // Convert back to Number for the final result
    };

    // 1. Build adjacency list
    // Use n+1 size to easily map node labels (1 to n)
    const adj = Array(n + 1).fill(0).map(() => []);
    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }

    // 2. Perform BFS to find the maximum depth
    const queue = [[1, 0]]; // Stores [node, depth]
    const visited = new Set();
    visited.add(1); // Start BFS from root node 1
    let maxDepth = 0;

    while (queue.length > 0) {
        const [currentNode, currentDepth] = queue.shift(); // Dequeue the front element

        // Update maximum depth found so far
        maxDepth = Math.max(maxDepth, currentDepth);

        // Explore neighbors
        for (const neighbor of adj[currentNode]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([neighbor, currentDepth + 1]); // Enqueue neighbor with increased depth
            }
        }
    }

    // 3. Calculate 2^(maxDepth - 1) mod (10^9 + 7)
    // Since n >= 2, maxDepth will be at least 1. So maxDepth - 1 >= 0.
    return power(2, maxDepth - 1);
};
```