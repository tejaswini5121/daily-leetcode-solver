/*
Problem Summary:
Find the minimum cost to travel from node 0 to node n-1 in a directed, weighted graph. A special rule allows reversing an incoming edge at most once per node, traversing it with 2*wi cost.

Problem Link:
https://leetcode.com/problems/minimum-cost-path-with-edge-reversals/

Approach Explanation:
This problem can be modeled as a shortest path problem on a graph where edge reversals create additional edges. Since edge costs are non-negative (wi > 0, and 2*wi > 0), Dijkstra's algorithm is suitable.

1.  **Graph Representation**: We need to represent the graph such that we can easily find both outgoing and incoming edges. An adjacency list `adj` storing `[neighbor, cost]` for outgoing edges is standard. For incoming edges, we can implicitly handle them or explicitly store them. The key insight for reversal is that if we are at `u` and want to reverse an incoming edge `v -> u` with cost `w` to `u -> v`, this essentially means we are looking for `v` that has an edge to `u`.

2.  **Modified Edge Costs**:
    *   Original edges `u -> v` with cost `w` remain as `u -> v` with cost `w`.
    *   For every original edge `u -> v` with cost `w`, we can conceptually add a "reversed" edge `v -> u` with cost `2 * w`. This edge represents the possibility of arriving at `v`, reversing the edge `u -> v` to `v -> u`, and traversing it. However, the problem statement says "when you arrive at ui and have not yet used its switch, you may activate it on one of its incoming edges vi -> ui reverse that edge to ui -> vi and immediately traverse it." This means the reversal happens *at* `ui` on an edge that points *to* `ui`. This implies that if we have `v -> u` with cost `w`, we can reverse it to `u -> v` with cost `2*w`.

3.  **Dijkstra's Algorithm**:
    *   Initialize `dist` array where `dist[i]` stores the minimum cost to reach node `i` from node 0. Set `dist[0] = 0` and `dist[i] = infinity` for `i > 0`.
    *   Use a min-priority queue (min-heap) to store `[cost, node]` pairs, ordered by `cost`. Add `[0, 0]` to the heap.
    *   While the heap is not empty:
        *   Extract the `[currentCost, u]` with the smallest `currentCost` from the heap.
        *   If `currentCost > dist[u]`, continue (we found a shorter path already).
        *   For each neighbor `v` reachable directly from `u` with cost `w` (original edge `u -> v`):
            *   If `dist[u] + w < dist[v]`:
                *   `dist[v] = dist[u] + w`
                *   Add `[dist[v], v]` to the heap.
        *   For each neighbor `v` that has an incoming edge *to* `u` (original edge `v -> u` with cost `w`):
            *   This is the scenario for reversal. If we are at `u`, we can choose to reverse `v -> u` to `u -> v` and traverse it. The cost for this action is `2 * w`.
            *   If `dist[u] + 2 * w < dist[v]`:
                *   `dist[v] = dist[u] + 2 * w`
                *   Add `[dist[v], v]` to the heap.

4.  **Handling the "switch at most once" constraint**: The wording "when you arrive at ui and have not yet used its switch, you may activate it on one of its incoming edges..." implies that each node has a switch that can be used once *at that node*. If we reverse an edge `v -> u` to `u -> v`, we use the switch *at node `u`*. This means we cannot use the switch at `u` again for another incoming edge *to `u`*. However, the "and immediately traverse it" part makes it tricky. If we just reverse `v -> u` to `u -> v` and traverse, we land at `v`. The problem is about reaching `n-1` with minimum cost. If we model the reversal as just another edge type, the shortest path algorithm naturally picks the minimum cost. The constraint "at most once" per node is usually handled by state-splitting (e.g., `dist[node][has_used_switch_at_node]`), but here, it seems simpler. If we use the reversal to `v -> u` -> `u -> v`, we arrive at `v`. Any future reversals from `v` are independent. The critical point is that a specific edge `v -> u` can be reversed *only if we are at `u`*.

    Let's re-read carefully: "when you arrive at `ui` and have not yet used its switch, you may activate it on one of its incoming edges `vi -> ui` reverse that edge to `ui -> vi` and immediately traverse it."
    This means if we arrive at `u` via any path, and we have not yet used the "switch for `u`", we can pick *one* incoming edge `v -> u`, reverse it to `u -> v`, and immediately traverse it. This implies a state: `(node, usedSwitchAtThisNode)`.
    However, if we are at `u`, and we reverse `v -> u` to `u -> v`, we are moving to `v`. The "switch at u" is used. We never return to `u` to use its switch again. The switch is effectively "consumed" by this single action.
    This structure (reversing an incoming edge *at* `u` to move *from* `u`) allows us to simplify. For each `(u, v, w)`:
    1.  There is a direct path `u -> v` with cost `w`.
    2.  There is a potential reverse path `v -> u` with cost `2w`. This `v -> u` edge is effectively created by reversing `u -> v` *if we are at `v`*. This means `v` can traverse to `u` with `2w` cost.
    So, for each given edge `(u, v, w)`:
    *   Add `u -> v` with cost `w` to `adj[u]`.
    *   Add `v -> u` with cost `2w` to `adj[v]` (representing reversing the original `u -> v` edge at `v` to `v -> u`).

    This interpretation simplifies the "switch" constraint. Since we only use the switch once *to move from* `u` via an incoming edge reversal, it means `u` will only incur the `2*w` cost once for a specific `v -> u` reversal, if that's the shortest path. Dijkstra's naturally handles this. If there are multiple incoming edges to `u`, say `x -> u` and `y -> u`, we can only reverse one *at `u`*. But if we model it as new edges, `u -> x` with `2*wx` and `u -> y` with `2*wy`, these are distinct outgoing edges from `u`. Dijkstra's will just pick the cheapest. This seems to be the intended interpretation given the problem difficulty and typical shortest path problems on LeetCode.

5.  **Final Result**: After Dijkstra's completes, `dist[n-1]` will hold the minimum cost. If `dist[n-1]` is still infinity, it's not possible to reach `n-1`, so return -1.

Time Complexity:
O((E + V) log V) where V is the number of nodes (N) and E is the number of effective edges.
In our case, each original edge `(u, v, w)` contributes two edges to our modified graph: `u -> v` with cost `w` and `v -> u` with cost `2w`. So, the number of effective edges `E'` is `2 * edges.length`.
The time complexity becomes O((`edges.length` + N) log N).
Given N <= 5 * 10^4 and edges.length <= 10^5, this is roughly O(10^5 log (5*10^4)), which is efficient enough.
log (5*10^4) is approximately log(2^15.6) ~ 16. So, 10^5 * 16 operations.

Space Complexity:
O(V + E) where V is the number of nodes (N) and E is the number of effective edges.
`adj` list stores `2 * edges.length` entries.
`dist` array stores `N` entries.
Min-heap can store up to `N` entries in the worst case.
So, O(N + `edges.length`).
Given N <= 5 * 10^4 and edges.length <= 10^5, this is O(5*10^4 + 10^5) which is feasible.
*/

/**
 * A simple MinPriorityQueue implementation for Dijkstra's algorithm.
 * Stores elements as [priority, value].
 */
class MinPriorityQueue {
    constructor() {
        this.heap = [];
    }

    // Get the number of elements in the queue
    size() {
        return this.heap.length;
    }

    // Add an element to the queue
    push(item) {
        this.heap.push(item);
        this._bubbleUp();
    }

    // Remove and return the element with the smallest priority
    pop() {
        if (this.size() === 0) {
            return undefined;
        }
        const min = this.heap[0];
        const last = this.heap.pop();
        if (this.size() > 0) {
            this.heap[0] = last;
            this._sinkDown();
        }
        return min;
    }

    // Helper to maintain heap property after adding an element
    _bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            // Compare priorities (first element in the array)
            if (this.heap[index][0] < this.heap[parentIndex][0]) {
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    // Helper to maintain heap property after removing the root
    _sinkDown() {
        let index = 0;
        const length = this.heap.length;
        const element = this.heap[0];

        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let swap = null;
            let leftChild, rightChild;

            // Determine if left child exists and has higher priority
            if (leftChildIndex < length) {
                leftChild = this.heap[leftChildIndex];
                if (leftChild[0] < element[0]) {
                    swap = leftChildIndex;
                }
            }

            // Determine if right child exists and has higher priority
            // If swap is already set to leftChildIndex, compare right child with left child
            if (rightChildIndex < length) {
                rightChild = this.heap[rightChildIndex];
                if (
                    (swap === null && rightChild[0] < element[0]) ||
                    (swap !== null && rightChild[0] < leftChild[0])
                ) {
                    swap = rightChildIndex;
                }
            }

            // No swap needed, element is in correct position
            if (swap === null) {
                break;
            }

            // Perform swap and continue sinking down
            [this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]];
            index = swap;
        }
    }
}


function minCost(n, edges) {
    // Adjacency list to represent the graph.
    // Each entry adj[u] will be a list of [v, cost] for edges u -> v.
    const adj = new Array(n).fill(0).map(() => []);

    // Build the graph.
    // For each original edge (u, v, w):
    // 1. Add a direct edge u -> v with cost w.
    // 2. Add a 'reversed' edge v -> u with cost 2*w.
    //    This reversed edge represents the option of being at node v,
    //    reversing the original edge u -> v to v -> u, and traversing it.
    for (const [u, v, w] of edges) {
        adj[u].push([v, w]);
        adj[v].push([u, 2 * w]);
    }

    // dist[i] will store the minimum cost to reach node i from node 0.
    // Initialize all distances to infinity, except for the start node (0).
    const dist = new Array(n).fill(Infinity);
    dist[0] = 0;

    // Min-priority queue to implement Dijkstra's algorithm.
    // Stores elements as [cost, node].
    const pq = new MinPriorityQueue();
    pq.push([0, 0]); // Start with node 0, cost 0.

    while (pq.size() > 0) {
        const [currentCost, u] = pq.pop();

        // If we found a shorter path to u previously, skip this one.
        // This handles cases where we push multiple paths to u onto the PQ,
        // but only the shortest one is relevant.
        if (currentCost > dist[u]) {
            continue;
        }

        // Explore all neighbors v reachable from u.
        for (const [v, weight] of adj[u]) {
            // If a shorter path to v is found through u.
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push([dist[v], v]);
            }
        }
    }

    // If dist[n-1] is still Infinity, node n-1 is unreachable.
    return dist[n - 1] === Infinity ? -1 : dist[n - 1];
}