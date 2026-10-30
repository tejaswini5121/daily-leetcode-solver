/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {string} labels
 * @param {number} k
 * @return {number}
 */

/*
Problem Summary: Find the shortest path from node 0 to node n-1 in a weighted directed graph, with a constraint on consecutive identical characters in the node labels along the path.

Link: https://leetcode.com/problems/shortest-path-with-at-most-k-consecutive-identical-characters/

Approach:
This problem can be modeled as a shortest path problem on an augmented graph. Since we need to keep track of the consecutive identical characters, the state in our shortest path algorithm will not just be the node, but also information about the last character encountered and how many times it has consecutively appeared.

We can use Dijkstra's algorithm. The state in our priority queue will be `[cost, currentNode, lastChar, consecutiveCount]`.
- `cost`: The total weight of the path so far.
- `currentNode`: The current node we are at.
- `lastChar`: The label of the previous node visited in the path.
- `consecutiveCount`: The number of consecutive times `lastChar` has appeared leading up to `currentNode`.

The initial state will be `[0, 0, null, 0]` (or similar, representing the start at node 0 with no previous character).

When exploring from a `currentNode` to a `nextNode`:
1. Get the `nextChar = labels[nextNode]`.
2. Calculate the `newConsecutiveCount`:
   - If `nextChar` is the same as `lastChar`, increment `consecutiveCount`.
   - If `nextChar` is different from `lastChar`, reset `consecutiveCount` to 1.
3. Check if `newConsecutiveCount` exceeds `k`. If it does, this path is invalid.
4. If the path is valid, update the cost to reach `nextNode`. The new cost will be `cost + edgeWeight`.
5. Push the new state `[newCost, nextNode, nextChar, newConsecutiveCount]` into the priority queue if this new path to `nextNode` with this specific `lastChar` and `consecutiveCount` is shorter than any previously found path to such a state.

To avoid redundant computations and cycles, we need a way to store the minimum cost to reach a particular state. A 3D array `minCost[node][lastCharIndex][consecutiveCount]` can be used. `lastCharIndex` can map characters 'a'-'z' to 0-25.

The adjacency list for the graph will store `[neighborNode, edgeWeight]`.

The priority queue will store `[cost, currentNode, lastChar, consecutiveCount]`.

Initialization:
- Create an adjacency list `adj` where `adj[u]` contains `[v, w]` for each edge `[u, v, w]`.
- Initialize `minCost` with infinity.
- Push the starting state `[0, 0, null, 0]` into the priority queue. We can use a special character or a placeholder for `lastChar` at the start, and `consecutiveCount` can be 0. For simplicity, we can handle the very first step from node 0 as a special case or ensure our logic works with an initial `null` last character.

When popping from the priority queue:
- If `currentNode` is `n - 1`, we have found a path. Since Dijkstra explores in increasing order of cost, the first time we reach `n - 1`, it will be the shortest valid path. Return the `cost`.
- If the current `cost` is greater than the already recorded `minCost` for this state, skip it.

State representation in `minCost`:
`minCost[node][char_code][count]`
- `node`: 0 to n-1
- `char_code`: 0 to 25 (for 'a' to 'z')
- `count`: 1 to k

The initial state `[0, 0, null, 0]` can be handled by pushing `[0, 0, labels[0], 1]` to the PQ and initializing `minCost[0][labels[0].charCodeAt(0) - 'a'.charCodeAt(0)][1] = 0`. This assumes the path starts at node 0.

Let's refine the state and `minCost` to handle the first node.
State: `[cost, currentNode, lastChar, consecutiveCount]`
`minCost[node][char_index][count]` where `char_index` is the index of `labels[node]` and `count` is the consecutive count *ending at* `node`.

Initial push: `pq.push([0, 0, labels[0], 1])`.
And `minCost[0][labels[0].charCodeAt(0) - 'a'.charCodeAt(0)][1] = 0`.

When processing `[cost, u, u_label, u_count]` from PQ:
If `cost > minCost[u][u_label_idx][u_count]`, continue.
For each neighbor `v` with edge weight `w`:
  `v_label = labels[v]`
  `new_u_count = (v_label === u_label) ? u_count + 1 : 1`
  If `new_u_count <= k`:
    `new_cost = cost + w`
    `v_label_idx = v_label.charCodeAt(0) - 'a'.charCodeAt(0)`
    If `new_cost < minCost[v][v_label_idx][new_u_count]`:
      `minCost[v][v_label_idx][new_u_count] = new_cost`
      `pq.push([new_cost, v, v_label, new_u_count])`

The target node is `n-1`. We want the minimum cost among all valid states that end at `n-1`.
So, after Dijkstra finishes (or when we first extract `n-1` from PQ if we don't stop early), we'll find `min(minCost[n-1][char_idx][count])` for all `char_idx` and `count`.

Edge cases:
- `k=1`: Means no consecutive identical characters are allowed.
- No path to `n-1`: Return -1.

Implementation details:
- Priority Queue: A min-heap implementation.
- `minCost` table: Initialize with a large value (infinity).
- Character to index mapping: `char.charCodeAt(0) - 'a'.charCodeAt(0)`.

Let's consider the initial state more carefully. The path starts at node 0. The first node's label contributes to the consecutive count.
So, if we start at node 0, its label is `labels[0]`, and the consecutive count is 1.
State in PQ: `[cost, currentNode, currentChar, consecutiveCountOfCurrentChar]`

Initial push: `[0, 0, labels[0], 1]`
`minCost[0][labels[0].charCodeAt(0) - 'a'.charCodeAt(0)][1] = 0`

Then when exploring from `u` to `v`:
`u_label = labels[u]`, `u_count` is consecutive count ending at `u`.
`v_label = labels[v]`.
`new_consecutive_count = (v_label === u_label) ? u_count + 1 : 1`.
If `new_consecutive_count <= k`:
  `new_cost = cost + edge_weight`.
  If `new_cost < minCost[v][v_label_idx][new_consecutive_count]`:
    Update `minCost[v][v_label_idx][new_consecutive_count] = new_cost`.
    Push `[new_cost, v, v_label, new_consecutive_count]` to PQ.

After Dijkstra, iterate through all possible character indices (0-25) and counts (1-k) for node `n-1` to find the minimum cost.

Time Complexity:
The number of states is `n * 26 * k`.
Each edge is processed once for each state it's reachable from.
In Dijkstra's, each edge relaxation takes `O(log(V_states))` where `V_states` is the number of possible states.
Number of nodes in the state-space graph is `N_states = n * 26 * k`.
Number of edges in the state-space graph is `E_states = E * 26 * k` (roughly, each original edge can lead to multiple states).
So, complexity is `O(E_states * log(N_states))` or `O(E * 26 * k * log(n * 26 * k))`.
Given `n <= 5*10^4`, `edges.length <= 5*10^4`, `k <= 50`:
`N_states` can be up to `5*10^4 * 26 * 50` which is large.
Let's re-evaluate the state. `minCost[node][lastCharIndex][consecutiveCount]`.
`lastCharIndex` refers to the index of the character of the *previous* node.
This makes it tricky to manage the initial state.

Alternative state: `[cost, currentNode, currentChar, consecutiveCountOfCurrentChar]`
Here, `currentChar` is `labels[currentNode]`.
When moving from `u` to `v`:
We are at `u` with state `[cost_u, u, u_label, u_count]`.
We consider edge `(u, v)` with weight `w`.
`v_label = labels[v]`.
`new_consecutive_count = (v_label === u_label) ? u_count + 1 : 1`.
If `new_consecutive_count <= k`:
  `new_cost = cost_u + w`.
  If `new_cost < minCost[v][v_label_idx][new_consecutive_count]`:
    Update `minCost[v][v_label_idx][new_consecutive_count] = new_cost`.
    Push `[new_cost, v, v_label, new_consecutive_count]` to PQ.

Initial state: `[0, 0, labels[0], 1]`
`minCost[0][labels[0].charCodeAt(0) - 'a'.charCodeAt(0)][1] = 0`.

Size of `minCost`: `n * 26 * (k+1)`. (k+1 because count can be 0 up to k, though 0 is unlikely useful after the first step)
The states in PQ are `[cost, node, char_index, consecutive_count]`. `char_index` is the index of `labels[node]`.

The number of states is `n * 26 * k`.
Each edge `(u, v)` in the original graph translates to transitions from states ending at `u` to states ending at `v`.
For a state `(u, u_label_idx, u_count)`, when considering edge `(u, v)`, we calculate the state `(v, v_label_idx, v_count)`.
The number of states is `n * 26 * k`.
The number of transitions is `E * 26 * k`.
Dijkstra complexity: `O(E_states * log(V_states))` where `V_states = n * 26 * k` and `E_states = E * 26 * k`.
`O(E * 26 * k * log(n * 26 * k))`.
With `n=5*10^4`, `E=5*10^4`, `k=50`:
`log(5*10^4 * 26 * 50) approx log(6.5 * 10^7) approx 26`.
`5*10^4 * 26 * 50 * 26 approx 1.7 * 10^9`. This might be too slow.

Let's reconsider the `minCost` dimensions.
`minCost[node][char_index][consecutive_count]`
`node`: 0 to n-1
`char_index`: 0 to 25 (for the character at `node`)
`consecutive_count`: 1 to k

The PQ elements would be `[cost, node, consecutive_count]`. The character at `node` is implicit from `labels[node]`.
When processing `[cost, u, u_count]` from PQ:
`u_label = labels[u]`
`u_label_idx = u_label.charCodeAt(0) - 'a'.charCodeAt(0)`
If `cost > minCost[u][u_label_idx][u_count]`, continue.
For each neighbor `v` with edge weight `w`:
  `v_label = labels[v]`
  `v_label_idx = v_label.charCodeAt(0) - 'a'.charCodeAt(0)`
  `new_consecutive_count = (v_label === u_label) ? u_count + 1 : 1`
  If `new_consecutive_count <= k`:
    `new_cost = cost + w`
    If `new_cost < minCost[v][v_label_idx][new_consecutive_count]`:
      `minCost[v][v_label_idx][new_consecutive_count] = new_cost`
      `pq.push([new_cost, v, new_consecutive_count])`

Initial state:
`pq.push([0, 0, 1])`
`minCost[0][labels[0].charCodeAt(0) - 'a'.charCodeAt(0)][1] = 0`

Final answer: `min(minCost[n-1][char_idx][count])` for all `char_idx` (0-25) and `count` (1-k).

Total states in `minCost`: `n * 26 * k`.
Transitions from a state `(u, u_label_idx, u_count)` to neighbor `v`:
For each `v` that `u` points to, we calculate a potential new state `(v, v_label_idx, new_consecutive_count)`.
The number of edges considered for relaxation is `E`. Each original edge `(u,v)` will cause a check for all states ending at `u`.
Number of states ending at `u`: `26 * k`.
So, the total number of relaxations is `E * 26 * k`.
Complexity: `O(E * 26 * k * log(n * 26 * k))`. This is still the same.

Let's verify constraints and typical LeetCode time limits.
`5*10^4` nodes and edges suggest an `O(E log V)` or `O(E + V log V)` or `O(E log E)` type solution.
The states space explosion is the issue.

Is there a way to prune the states or avoid the `26*k` factor for each node?
Consider the `k` constraint. If `k` is small, `26*k` is manageable. Here `k <= 50`.
`n=50000`, `k=50`. States = `50000 * 26 * 50 = 65,000,000`.
This is likely the number of states we need to manage.
The log factor comes from the priority queue.
`log(65,000,000) approx 26`.
Total operations `~ 65,000,000 * 26` which is about `1.7 * 10^9`. This is indeed too high.

What if we use a `Map` for `minCost` to only store reachable states?
`minCost[node]` would be a `Map`.
`minCost[node].set(char_index * (k+1) + consecutive_count, cost)`

Let's analyze the maximum number of *reachable* states.
It's possible that not all `n * 26 * k` states are reachable.
The number of edges is `E = 5*10^4`.
Each edge `(u,v)` can potentially create a new state `(v, v_label_idx, new_count)`.
The total number of unique states `(node, char_idx, count)` could be up to `n * 26 * k`.
The number of edges in the state graph is `E * (26*k)`.

Let's double-check if there's a mistake in complexity analysis or understanding.
Dijkstra on graph G' with V' vertices and E' edges is O(E' log V') or O(E' + V' log V') with Fibonacci heap.
Here V' = n * 26 * k, E' = E * 26 * k.
O(E * 26 * k * log(n * 26 * k)). This is the standard complexity.

Could the `k` constraint be used more effectively?
What if `k` is very large, effectively unlimited? Then it's just Dijkstra on the original graph.
When `k` is small, it significantly increases the state space.

Consider the total number of distinct `(node, consecutive_count)` pairs across all characters.
This is `n * k`.
For each character, we essentially have a smaller Dijkstra.

Maybe the PQ can be optimized?
The states pushed onto the PQ are `[cost, node, consecutive_count]`.
The `char_index` is implicitly `labels[node].charCodeAt(0) - 'a'.charCodeAt(0)`.
So the PQ is correct.

Let's consider the constraints: `n` up to `5*10^4`, `edges` up to `5*10^4`, `k` up to `50`.
A common pattern in such problems is that either the effective number of states explored is much smaller, or there's a more efficient way to manage states.

If we think about the path construction, we pick an edge.
The crucial part is `new_consecutive_count = (v_label === u_label) ? u_count + 1 : 1`.
This update is local.

Could the problem be solved using BFS if edge weights were 1? Yes, for unweighted graphs. Here it's weighted.

Let's use a simple Priority Queue implementation for JavaScript.

```javascript
class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    push(item) {
        this.heap.push(item);
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

    isEmpty() {
        return this.heap.length === 0;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex][0] > this.heap[index][0]) {
                [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    bubbleDown(index) {
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let smallestIndex = index;

        if (leftChildIndex < this.heap.length && this.heap[leftChildIndex][0] < this.heap[smallestIndex][0]) {
            smallestIndex = leftChildIndex;
        }
        if (rightChildIndex < this.heap.length && this.heap[rightChildIndex][0] < this.heap[smallestIndex][0]) {
            smallestIndex = rightChildIndex;
        }

        if (smallestIndex !== index) {
            [this.heap[index], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[index]];
            this.bubbleDown(smallestIndex);
        }
    }
}
```

The `minCost` initialization: `Infinity` should be a sufficiently large number. `Number.MAX_SAFE_INTEGER` or similar.

The state `[cost, node, consecutive_count]` in PQ seems correct.
`minCost[node][char_index][consecutive_count]` seems correct for storing minimum costs.

Let's consider the `char_index` for `minCost`.
If we store `minCost[node][char_index][consecutive_count]`, `char_index` should correspond to `labels[node]`.
This means we need `26 * k` possible entries for each `node`.

Example 1: n = 3, edges = [[0,1,1],[1,2,1],[0,2,3]], labels = "aab", k = 1
Target: node 2.

Adj:
0: [[1, 1], [2, 3]]
1: [[2, 1]]
2: []

labels: a(0), a(1), b(2)
k = 1

Initialize minCost: `n x 26 x (k+1)` array with Infinity.
`minCost = Array(n).fill(0).map(() => Array(26).fill(0).map(() => Array(k + 1).fill(Infinity)));`

PQ:
Push `[0, 0, 1]` (cost, node, consecutive_count)
`0_label_idx = 'a'.charCodeAt(0) - 'a'.charCodeAt(0) = 0`
`minCost[0][0][1] = 0`

Pop `[0, 0, 1]` (cost=0, u=0, u_count=1)
`u_label = 'a'`

Neighbors of 0:
1. `v=1`, `w=1`. `v_label = 'a'`.
   `new_count = (v_label === u_label) ? u_count + 1 : 1` => `('a' === 'a') ? 1 + 1 : 1` => `2`.
   `k = 1`. `new_count` (2) > `k` (1). Invalid path.

2. `v=2`, `w=3`. `v_label = 'b'`.
   `new_count = (v_label === u_label) ? u_count + 1 : 1` => `('b' === 'a') ? 1 + 1 : 1` => `1`.
   `new_count` (1) <= `k` (1). Valid.
   `new_cost = cost + w = 0 + 3 = 3`.
   `v_label_idx = 'b'.charCodeAt(0) - 'a'.charCodeAt(0) = 1`.
   Check `minCost[2][1][1]`. It's Infinity.
   `minCost[2][1][1] = 3`.
   Push `[3, 2, 1]` to PQ.

PQ: `[[3, 2, 1]]`

Pop `[3, 2, 1]` (cost=3, u=2, u_count=1)
`u_label = 'b'`
Node 2 is `n-1`. Found a path. The cost is 3.
Since this is Dijkstra, the first time we extract `n-1`, it's the shortest.
Return 3. Correct for Example 1.

Example 2: n = 3, edges = [[0,1,1],[1,2,1],[0,2,3]], labels = "aab", k = 2
Target: node 2.

Adj, labels same as above. k = 2.

Initialize minCost: `n x 26 x (k+1)` array with Infinity.

PQ:
Push `[0, 0, 1]`
`0_label_idx = 0`
`minCost[0][0][1] = 0`

Pop `[0, 0, 1]` (cost=0, u=0, u_count=1)
`u_label = 'a'`

Neighbors of 0:
1. `v=1`, `w=1`. `v_label = 'a'`.
   `new_count = ('a' === 'a') ? 1 + 1 : 1` => `2`.
   `new_count` (2) <= `k` (2). Valid.
   `new_cost = 0 + 1 = 1`.
   `v_label_idx = 0`.
   Check `minCost[1][0][2]`. It's Infinity.
   `minCost[1][0][2] = 1`.
   Push `[1, 1, 2]` to PQ.

2. `v=2`, `w=3`. `v_label = 'b'`.
   `new_count = ('b' === 'a') ? 1 + 1 : 1` => `1`.
   `new_count` (1) <= `k` (2). Valid.
   `new_cost = 0 + 3 = 3`.
   `v_label_idx = 1`.
   Check `minCost[2][1][1]`. It's Infinity.
   `minCost[2][1][1] = 3`.
   Push `[3, 2, 1]` to PQ.

PQ: `[[1, 1, 2], [3, 2, 1]]` (Sorted by cost)

Pop `[1, 1, 2]` (cost=1, u=1, u_count=2)
`u_label = 'a'`

Neighbors of 1:
1. `v=2`, `w=1`. `v_label = 'b'`.
   `new_count = ('b' === 'a') ? 2 + 1 : 1` => `1`.
   `new_count` (1) <= `k` (2). Valid.
   `new_cost = 1 + 1 = 2`.
   `v_label_idx = 1`.
   Check `minCost[2][1][1]`. It's 3.
   `new_cost` (2) < `minCost[2][1][1]` (3). Update.
   `minCost[2][1][1] = 2`.
   Push `[2, 2, 1]` to PQ.

PQ: `[[2, 2, 1], [3, 2, 1]]`

Pop `[2, 2, 1]` (cost=2, u=2, u_count=1)
`u_label = 'b'`
Node 2 is `n-1`. Found a path. Cost is 2.
Return 2. Correct for Example 2.

Example 3: n = 3, edges = [[0,1,1],[1,2,1]], labels = "aaa", k = 2
Target: node 2.

Adj:
0: [[1, 1]]
1: [[2, 1]]
2: []

labels: a(0), a(1), a(2)
k = 2

Initialize minCost: `n x 26 x (k+1)` array with Infinity.

PQ:
Push `[0, 0, 1]`
`0_label_idx = 0`
`minCost[0][0][1] = 0`

Pop `[0, 0, 1]` (cost=0, u=0, u_count=1)
`u_label = 'a'`

Neighbors of 0:
1. `v=1`, `w=1`. `v_label = 'a'`.
   `new_count = ('a' === 'a') ? 1 + 1 : 1` => `2`.
   `new_count` (2) <= `k` (2). Valid.
   `new_cost = 0 + 1 = 1`.
   `v_label_idx = 0`.
   Check `minCost[1][0][2]`. Infinity.
   `minCost[1][0][2] = 1`.
   Push `[1, 1, 2]` to PQ.

PQ: `[[1, 1, 2]]`

Pop `[1, 1, 2]` (cost=1, u=1, u_count=2)
`u_label = 'a'`

Neighbors of 1:
1. `v=2`, `w=1`. `v_label = 'a'`.
   `new_count = ('a' === 'a') ? 2 + 1 : 1` => `3`.
   `new_count` (3) > `k` (2). Invalid path.

PQ is empty. Node 2 was never reached with a valid path.

After PQ is empty, we need to find the minimum cost to reach `n-1`.
Iterate `char_idx` from 0 to 25, `count` from 1 to k.
`min_final_cost = Infinity`.
For node `n-1` (node 2):
`min_final_cost = min(min_final_cost, minCost[2][char_idx][count])`
In this example, `minCost[2]` remains all Infinity.

So, if `min_final_cost` is still Infinity, return -1.
This logic seems solid.

The key challenge is the state space size. For the given constraints, `n * 26 * k` states is `50000 * 26 * 50 = 65,000,000`. If all these states are explored and pushed to the PQ, it will TLE.
However, it's common in LeetCode that only a fraction of these states are actually reachable or lead to a shorter path, making Dijkstra feasible.

Let's try to optimize the `minCost` storage slightly.
We can use `Map` for each node to store `[char_idx * (k+1) + count] -> cost`. This might save memory if states are sparse, but lookup might be slower.
Given the constraints, a 3D array is usually expected for this type of DP/shortest path state.

The maximum number of edges in the state graph is `E * 26 * k`. This means roughly `50000 * 26 * 50 = 65,000,000` potential transitions.
If `log(V_states)` is about 26, then `E' * log(V')` would be `6.5e7 * 26` which is about `1.7e9`. This is pushing limits but sometimes accepted if the constant factor is small.

Let's consider the `k` value. If `k` was smaller, say `k=10`, then `50000 * 26 * 10 = 13,000,000` states, and `log(1.3e7) approx 24`. `1.3e7 * 24 approx 3e8`, which would be fine. The `k=50` is the main contributor to large state space.

Final check of implementation details:
- Adjacency list construction: Correct.
- Priority Queue: Standard min-heap, should work.
- `minCost` table dimensions: `n x 26 x (k+1)`. The `k+1` is because `consecutive_count` ranges from 1 to `k`. We need `k+1` size if we index from 0. Let's make it `k+1` and use counts 1 to `k`. Or size `k` and use counts 0 to `k-1` (if `k` is max number of *allowed* consecutive, then actual count can go up to `k`). The problem states "at most k consecutive", so actual count can be `1, 2, ..., k`. Thus size `k+1` and index `1..k` is appropriate.
- Initial state: `[0, 0, 1]` for PQ, `minCost[0][labelIdx][1] = 0`. This seems correct.
- Loop for neighbors: Correct.
- `new_consecutive_count` logic: Correct.
- Check against `k`: Correct.
- Update `minCost` and push to PQ: Correct.
- Final answer calculation: Iterate over all possible `char_idx` and `consecutive_count` for `n-1`, and take the minimum. Correct.
- Return -1 if `min_final_cost` is `Infinity`. Correct.

The only doubt is performance. Given typical LeetCode limits, `1.7 * 10^9` operations might be too slow. However, without further optimization ideas, this Dijkstra-based approach on the state-space graph is the standard way to solve this kind of problem. The test cases might be constructed such that the reachable state space is smaller or the constants are favorable.

Consider an empty graph or `n=1`.
If `n=1`, `labels="a"`, `k=1`. `0` is both start and end. Cost is 0. My logic handles this: PQ starts with `[0, 0, 1]`, node `0` is `n-1`, returns 0.

If `edges` is empty, and `n>1`, no path can be formed. `min_final_cost` will remain Infinity, returns -1.

```javascript
// Priority Queue Implementation
class PriorityQueue {
    constructor() {
        // The heap stores elements in the format [priority, ...data]
        this.heap = [];
    }

    // Add an item to the priority queue.
    push(item) {
        this.heap.push(item);
        this.bubbleUp(this.heap.length - 1);
    }

    // Remove and return the item with the lowest priority.
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

    // Check if the priority queue is empty.
    isEmpty() {
        return this.heap.length === 0;
    }

    // Move an element up the heap to maintain the heap property.
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            // Compare priorities (the first element in the item array)
            if (this.heap[parentIndex][0] > this.heap[index][0]) {
                [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    // Move an element down the heap to maintain the heap property.
    bubbleDown(index) {
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let smallestIndex = index;

        if (leftChildIndex < this.heap.length && this.heap[leftChildIndex][0] < this.heap[smallestIndex][0]) {
            smallestIndex = leftChildIndex;
        }
        if (rightChildIndex < this.heap.length && this.heap[rightChildIndex][0] < this.heap[smallestIndex][0]) {
            smallestIndex = rightChildIndex;
        }

        if (smallestIndex !== index) {
            [this.heap[index], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[index]];
            this.bubbleDown(smallestIndex);
        }
    }
}

/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {string} labels
 * @param {number} k
 * @return {number}
 */
var shortestPathWithK = function(n, edges, labels, k) {
    // Build adjacency list: adj[u] = [[v, weight], ...]
    const adj = Array(n).fill(0).map(() => []);
    for (const [u, v, w] of edges) {
        adj[u].push([v, w]);
    }

    // Initialize the minimum cost table.
    // minCost[node][char_index][consecutive_count] stores the minimum cost to reach 'node'
    // ending with 'consecutive_count' occurrences of the character corresponding to 'char_index'.
    // char_index: 0-25 for 'a'-'z'.
    // consecutive_count: 1 to k. We use k+1 size for 1-based indexing of count.
    const INF = Number.MAX_SAFE_INTEGER;
    const minCost = Array(n).fill(0).map(() =>
        Array(26).fill(0).map(() =>
            Array(k + 1).fill(INF)
        )
    );

    // Priority queue stores elements in the format [cost, currentNode, consecutiveCount]
    // 'currentNode' is the node we are currently at.
    // 'consecutiveCount' is the number of consecutive identical characters ending at 'currentNode'.
    const pq = new PriorityQueue();

    // Initial state: starting at node 0.
    // The cost is 0. The current node is 0.
    // The label of node 0 is labels[0]. The consecutive count for this first node is 1.
    const startNode = 0;
    const startLabelIndex = labels.charCodeAt(startNode) - 'a'.charCodeAt(0);
    const startConsecutiveCount = 1;

    // If k is 0, this is an invalid state unless n=1. For n>1, no path can have length > 0.
    // Problem constraints say 1 <= k <= 50, so k=0 is not an issue.
    // If startConsecutiveCount (1) is greater than k, this is impossible, but k>=1 so it's fine.

    pq.push([0, startNode, startConsecutiveCount]);
    minCost[startNode][startLabelIndex][startConsecutiveCount] = 0;

    // Dijkstra's algorithm
    while (!pq.isEmpty()) {
        const [currentCost, u, uConsecutiveCount] = pq.pop();

        // Get the character and its index for the current node 'u'.
        const uLabel = labels[u];
        const uLabelIndex = uLabel.charCodeAt(0) - 'a'.charCodeAt(0);

        // If the current cost is greater than the already recorded minimum cost for this state, skip.
        // This check prevents processing outdated or suboptimal paths.
        if (currentCost > minCost[u][uLabelIndex][uConsecutiveCount]) {
            continue;
        }

        // If we have reached the destination node, we can potentially stop early if we only need one path.
        // However, to find the absolute minimum, we must continue until PQ is empty or we have found
        // all minimum paths to n-1. Since we extract in increasing cost order, the first time we
        // extract n-1, it IS the shortest path *for that specific state*.
        // We will find the overall minimum at the end by checking all states for n-1.

        // Explore neighbors of node 'u'.
        for (const [v, weight] of adj[u]) {
            const vLabel = labels[v];
            const vLabelIndex = vLabel.charCodeAt(0) - 'a'.charCodeAt(0);

            // Calculate the new consecutive count for node 'v'.
            let newConsecutiveCount;
            if (vLabel === uLabel) {
                // If the neighbor's label is the same as the current node's label, increment the count.
                newConsecutiveCount = uConsecutiveCount + 1;
            } else {
                // If the neighbor's label is different, reset the count to 1.
                newConsecutiveCount = 1;
            }

            // Check if the new consecutive count violates the constraint 'k'.
            if (newConsecutiveCount <= k) {
                const newCost = currentCost + weight;

                // If this new path to node 'v' with 'newConsecutiveCount' is shorter than any previously found.
                if (newCost < minCost[v][vLabelIndex][newConsecutiveCount]) {
                    minCost[v][vLabelIndex][newConsecutiveCount] = newCost;
                    // Push the new state into the priority queue.
                    pq.push([newCost, v, newConsecutiveCount]);
                }
            }
        }
    }

    // After Dijkstra's algorithm completes, find the minimum cost to reach the target node (n-1).
    // We need to check all possible characters and consecutive counts that end at node n-1.
    let minFinalCost = INF;
    const targetNode = n - 1;

    // Iterate through all possible character indices (0-25)
    for (let charIndex = 0; charIndex < 26; charIndex++) {
        // Iterate through all possible consecutive counts (1 to k)
        for (let count = 1; count <= k; count++) {
            // Update minFinalCost if a shorter path is found.
            minFinalCost = Math.min(minFinalCost, minCost[targetNode][charIndex][count]);
        }
    }

    // If minFinalCost is still INF, it means the target node is unreachable with a valid path.
    return minFinalCost === INF ? -1 : minFinalCost;
};
```