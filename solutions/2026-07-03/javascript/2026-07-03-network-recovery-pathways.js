```javascript
// Problem: Network Recovery Pathways
// Summary: Find the maximum path score (minimum edge cost) for valid paths from node 0 to n-1,
// where paths must only use online nodes and have a total cost not exceeding k.
// Link: https://leetcode.com/problems/network-recovery-pathways/
//
// Approach:
// The problem asks for the maximum of minimums. This structure suggests that we can use binary search on the answer (the path score).
// For a given potential minimum edge cost `mid`, we need to check if there exists a path from node 0 to node n-1 such that:
// 1. All edges on the path have a cost greater than or equal to `mid`.
// 2. All intermediate nodes on the path are online.
// 3. The total cost of edges on the path does not exceed `k`.
//
// To perform this check efficiently, we can build a subgraph containing only edges with costs >= `mid`.
// Within this subgraph, we need to find the shortest path from node 0 to node n-1. If such a path exists and its total cost is <= `k` and all intermediate nodes are online, then `mid` is a possible path score, and we try a higher `mid`. Otherwise, we need to try a smaller `mid`.
//
// The shortest path in a graph with non-negative edge weights can be found using Dijkstra's algorithm.
//
// The binary search range for the path score will be from 0 to the maximum possible edge cost (or a sufficiently large number, like 10^9, or even k + 1 if we consider the total cost). A tighter upper bound can be the maximum edge cost in the input.
//
// Binary Search Logic:
// - `low = 0`, `high = 10^9 + 7` (or max edge cost + 1)
// - While `low <= high`:
//   - `mid = floor((low + high) / 2)`
//   - `check(mid)`:
//     - Build a subgraph including only edges `[u, v, cost]` where `cost >= mid`.
//     - Use Dijkstra's algorithm on this subgraph starting from node 0 to find the shortest path to node `n-1`.
//     - During Dijkstra's, only consider visiting nodes that are online.
//     - If Dijkstra's finds a path to `n-1` with a total cost `dist[n-1] <= k`, then `check(mid)` returns true.
//     - If `check(mid)` is true, it means `mid` is a possible score, so we try for a higher score: `ans = mid`, `low = mid + 1`.
//     - If `check(mid)` is false, it means `mid` is too high, so we reduce the search space: `high = mid - 1`.
//
// The `check` function using Dijkstra:
// - Adjacency list `adj` for the subgraph where edge cost >= `min_edge_cost`.
// - `dist` array initialized to infinity, `dist[0] = 0`.
// - Priority queue `pq` storing `[current_cost, current_node]`, ordered by `current_cost`.
// - While `pq` is not empty:
//   - Pop `[d, u]` from `pq`.
//   - If `d > dist[u]`, continue.
//   - If `u === n - 1`, we found a path. Return `d <= k`.
//   - For each neighbor `v` of `u` with edge cost `edge_cost` (which is already filtered to be >= `min_edge_cost`):
//     - If `online[v]` is false (and `v` is not `n-1`), skip this neighbor.
//     - If `dist[u] + edge_cost < dist[v]`:
//       - `dist[v] = dist[u] + edge_cost`
//       - Push `[dist[v], v]` to `pq`.
// - If the loop finishes without reaching `n-1`, return `false`.
//
// Time Complexity:
// - Binary search performs `log(max_cost)` iterations.
// - Inside each iteration, the `check` function runs Dijkstra's algorithm.
// - Building the subgraph for Dijkstra takes O(m) time in the worst case for each `mid`.
// - Dijkstra's algorithm with a priority queue on a graph with V nodes and E edges is O(E log V). In our case, V = n and E can be up to m.
// - So, the `check` function is roughly O(m + m log n).
// - Total time complexity: O(log(max_cost) * (m + m log n)). Given constraints, max_cost is up to 10^9. log(10^9) is about 30. m is up to 10^5, n is up to 5*10^4. So, approximately O(30 * (10^5 + 10^5 * log(5*10^4))) which is feasible.
//
// Space Complexity:
// - Adjacency list: O(m + n)
// - Distance array: O(n)
// - Priority queue: O(n) in the worst case.
// - Total space complexity: O(m + n).
//
// Edge cases:
// - No path exists from 0 to n-1.
// - All paths exceed k.
// - Intermediate nodes are offline.
// - The problem statement guarantees nodes 0 and n-1 are always online.
//
// Implementation details:
// - Use a custom Priority Queue or a library that provides one. JavaScript doesn't have a built-in one, so we'll implement a simple min-heap.
// - Handle large `k` values (up to 5 * 10^13) which requires using `BigInt` for total cost calculations if intermediate sums might exceed `Number.MAX_SAFE_INTEGER`. However, edge costs are up to 10^9 and n up to 5*10^4. The max path cost could be around 5*10^4 * 10^9 = 5*10^13, which fits within `Number` if `k` is also handled correctly. Let's assume standard numbers are sufficient if `k` itself is `Number`. The problem statement indicates `k` is up to 5*10^13, which implies we should use `BigInt` for `k` and total costs.
// - For edge cases where `k` could lead to overflow, using `BigInt` for `k` and cost accumulations is safer.
//
// Let's re-evaluate the cost constraints. `costi <= 10^9`. `n <= 5 * 10^4`. A path can have up to `n-1` edges. Max total cost could be `(5*10^4 - 1) * 10^9 \approx 5 * 10^{13}`. `k` is also up to `5 * 10^{13}`.
// JavaScript's `Number` type can safely represent integers up to `Number.MAX_SAFE_INTEGER` which is `2^53 - 1 \approx 9 * 10^{15}`.
// So, `k` and the total path costs can be represented by standard JavaScript `Number` if `k` is within this range.
// The problem statement says `k <= 5 * 10^13`, which fits within `Number`. We don't need `BigInt` for `k` or path costs.

class PriorityQueue {
    // Simple min-heap implementation for Dijkstra's algorithm.
    // Stores elements as [priority, value].
    constructor() {
        this.heap = [];
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    push(element) { // element is [priority, value]
        this.heap.push(element);
        this.bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.isEmpty()) return null;
        const min = this.heap[0];
        const last = this.heap.pop();
        if (!this.isEmpty()) {
            this.heap[0] = last;
            this.bubbleDown(0);
        }
        return min;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index][0] < this.heap[parentIndex][0]) {
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    bubbleDown(index) {
        const lastIndex = this.heap.length - 1;
        while (true) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let smallestIndex = index;

            if (leftChildIndex <= lastIndex && this.heap[leftChildIndex][0] < this.heap[smallestIndex][0]) {
                smallestIndex = leftChildIndex;
            }
            if (rightChildIndex <= lastIndex && this.heap[rightChildIndex][0] < this.heap[smallestIndex][0]) {
                smallestIndex = rightChildIndex;
            }

            if (smallestIndex !== index) {
                [this.heap[index], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[index]];
                index = smallestIndex;
            } else {
                break;
            }
        }
    }
}


/**
 * @param {number[][]} edges
 * @param {boolean[]} online
 * @param {number} k
 * @return {number}
 */
var maxNetwork = function(edges, online, k) {
    const n = online.length;
    let maxScore = -1;

    // Binary search for the maximum possible path score.
    // The score is the minimum edge cost along a valid path.
    // The range for the score is from 0 to a value slightly larger than the maximum possible edge cost.
    // We can use 10^9 + 7 as a safe upper bound or find the max edge cost.
    // Let's find the max edge cost for a tighter bound.
    let maxEdgeCost = 0;
    for (const edge of edges) {
        maxEdgeCost = Math.max(maxEdgeCost, edge[2]);
    }
    let low = 0;
    let high = maxEdgeCost; // The maximum possible minimum edge cost is the maximum edge cost itself.
    let ans = -1; // Stores the best valid score found so far.

    // The check function: Determines if there exists a valid path from node 0 to node n-1
    // where all edge costs are >= `minEdgeCost` and the total path cost <= `k`,
    // and all intermediate nodes are online.
    const check = (minEdgeCost) => {
        // Build an adjacency list for the graph considering only edges with cost >= minEdgeCost.
        const adj = Array(n).fill(null).map(() => []);
        for (const [u, v, cost] of edges) {
            if (cost >= minEdgeCost) {
                adj[u].push([v, cost]);
            }
        }

        // Dijkstra's algorithm to find the shortest path from node 0 to node n-1
        // considering only online nodes and the cost constraint.
        const dist = Array(n).fill(Infinity);
        dist[0] = 0;
        const pq = new PriorityQueue();
        pq.push([0, 0]); // [current_total_cost, current_node]

        while (!pq.isEmpty()) {
            const [currentCost, u] = pq.pop();

            // If we've found a shorter path already, skip this one.
            if (currentCost > dist[u]) {
                continue;
            }

            // If we reached the destination node n-1, check if the total cost is within k.
            if (u === n - 1) {
                return currentCost <= k;
            }

            // Explore neighbors.
            for (const [v, edgeCost] of adj[u]) {
                // Only consider intermediate nodes that are online.
                // Node n-1 is always online, so we don't need to check online[n-1].
                if (v !== n - 1 && !online[v]) {
                    continue;
                }

                const newCost = currentCost + edgeCost;
                // If the new path to v is shorter and within the total cost limit k, update dist.
                // We don't strictly need to check `newCost <= k` here because Dijkstra's will
                // naturally find the shortest path. The final check `currentCost <= k` at `u === n-1` is sufficient.
                // However, it can prune branches early if `newCost` already exceeds `k`.
                // Let's rely on the final check for simplicity, as the problem asks for *existence* of such a path.
                if (newCost < dist[v]) {
                    dist[v] = newCost;
                    pq.push([newCost, v]);
                }
            }
        }

        // If Dijkstra completes without reaching n-1, no path exists with the given minEdgeCost.
        return false;
    };

    // Perform binary search on the possible minimum edge cost (path score).
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (check(mid)) {
            // If a path exists with minimum edge cost `mid`, then `mid` is a possible answer.
            // We try to find an even higher score.
            ans = mid;
            low = mid + 1;
        } else {
            // If no path exists with minimum edge cost `mid`, then `mid` is too high.
            // We need to try a smaller minimum edge cost.
            high = mid - 1;
        }
    }

    return ans;
};
```