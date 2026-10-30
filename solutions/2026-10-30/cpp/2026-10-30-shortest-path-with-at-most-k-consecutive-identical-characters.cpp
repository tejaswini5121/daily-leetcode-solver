```cpp
/*
Problem Summary: Find the shortest path from node 0 to node n-1 in a directed weighted graph,
such that the labels of nodes along the path do not have more than k consecutive identical characters.

Link: https://leetcode.com/problems/shortest-path-with-at-most-k-consecutive-identical-characters/

Approach:
This problem can be modeled as a shortest path problem on an augmented graph.
Since the constraint involves the consecutive identical characters, the state in our shortest path algorithm needs to include not just the current node, but also information about the last character encountered and its consecutive count.

We can use Dijkstra's algorithm. The state in the priority queue will be (cost, node, last_char, consecutive_count).
When exploring an edge from node u to node v with weight w:
1. If labels[v] is the same as last_char:
   - If consecutive_count + 1 <= k, we can extend the path. The new state will be (cost + w, v, labels[v], consecutive_count + 1).
2. If labels[v] is different from last_char:
   - We can always start a new sequence of consecutive characters. The new state will be (cost + w, v, labels[v], 1).

To avoid redundant computations and cycles, we need a way to keep track of the minimum cost to reach a particular state (node, last_char, consecutive_count). A 3D DP array or a map can be used for this. Given k is small (<= 50), a 3D array `dist[n][26][k+1]` is feasible, where `dist[i][c][cnt]` stores the minimum cost to reach node `i` ending with character `c` and having `cnt` consecutive occurrences of `c`.

Initialization:
The `dist` array should be initialized to infinity.
The starting state is node 0. Since it's the beginning of the path, we can consider it as having a "previous" character that doesn't exist or is different from any label. The cost to reach node 0 is 0.
So, we push (0, 0, -1, 0) into the priority queue, where -1 represents no previous character, and 0 is the initial consecutive count.
The `dist[0][label_to_int(labels[0])][1]` will be updated to 0.

Data Structures:
- Adjacency list: `adj[u]` stores pairs `(v, w)` representing edges from `u` to `v` with weight `w`.
- Distance array: `dist[node][char_index][consecutive_count]`. `char_index` is 0-25 for 'a'-'z'.
- Priority queue: `pq` storing tuples `(cost, node, last_char_index, consecutive_count)`. We use `pair<int, pair<int, pair<int, int>>>` for min-heap.

Algorithm Steps:
1. Build the adjacency list from the `edges` array.
2. Initialize the `dist` array with a large value (infinity) for all states.
3. Initialize a priority queue `pq`.
4. For node 0, push the initial state into `pq`: (0, 0, -1, 0).
   - Set `dist[0][labels[0] - 'a'][1] = 0`. We use `labels[0] - 'a'` for the current char index. The last_char_index is not strictly needed in the state representation of dist if we always know the current node's label. However, for the PQ state transition, we need to know the *previous* character to check for consecutiveness. A simpler state for `dist` can be `dist[node][prev_char_index][consecutive_count]` or `dist[node][current_char_index][consecutive_count]` where the transition logic uses `labels[node]` to compare with `prev_char_index`.
   Let's refine the state representation: `dist[node][prev_char_index][consecutive_count]`. `prev_char_index` will be from 0 to 25. For the initial state at node 0, we can use a sentinel value for `prev_char_index` (e.g., 26) or handle it as a special case.
   A more direct approach: The state in PQ should be `(cost, current_node, last_char_label, consecutive_count)`. The `dist` array can be `dist[node][last_char_index][consecutive_count]`.
   `dist[n][26][k+1]` where `dist[i][char_code][count]` is the min cost to reach node `i`, ending with `char_code` having `count` consecutive occurrences. `char_code` is -1 for initial.

   Let's use `dist[n][26][k+1]` where `dist[i][c][cnt]` is the minimum cost to reach node `i`, where the character `c` (0-25) occurred `cnt` times consecutively ending at node `i`. We'll need a sentinel for the initial state.
   The state in PQ will be `(cost, node_id, char_index, consecutive_count)`.

   Revised State for PQ and dist:
   `dist[n][26][k+1]` initialized to infinity.
   PQ element: `{cost, node, last_char_idx, consecutive_count}`
   Initial: Push `{0, 0, labels[0] - 'a', 1}` into PQ.
   Set `dist[0][labels[0] - 'a'][1] = 0`.

5. While PQ is not empty:
   - Pop the state with the minimum cost: `{current_cost, u, last_char_idx_u, consecutive_count_u}`.
   - If `current_cost > dist[u][last_char_idx_u][consecutive_count_u]`, continue (already found a better path).
   - If `u == n - 1`, we have reached the destination. This is a potential shortest path.
   - For each neighbor `v` of `u` with edge weight `w`:
     - Let `current_char_v = labels[v] - 'a'`.
     - If `current_char_v == last_char_idx_u`:
       - If `consecutive_count_u + 1 <= k`:
         - New cost: `new_cost = current_cost + w`.
         - New consecutive count: `new_consecutive_count = consecutive_count_u + 1`.
         - If `new_cost < dist[v][current_char_v][new_consecutive_count]`:
           - `dist[v][current_char_v][new_consecutive_count] = new_cost`.
           - Push `{new_cost, v, current_char_v, new_consecutive_count}` into PQ.
     - Else ( `current_char_v != last_char_idx_u`):
       - New cost: `new_cost = current_cost + w`.
       - New consecutive count: `new_consecutive_count = 1`.
       - If `new_cost < dist[v][current_char_v][new_consecutive_count]`:
         - `dist[v][current_char_v][new_consecutive_count] = new_cost`.
         - Push `{new_cost, v, current_char_v, new_consecutive_count}` into PQ.

6. After Dijkstra's finishes, find the minimum cost to reach `n-1` across all possible last characters and all valid consecutive counts.
   Iterate `c` from 0 to 25 and `cnt` from 1 to `k`. The minimum of `dist[n-1][c][cnt]` is the answer.
   If all `dist[n-1][c][cnt]` are still infinity, return -1.

Edge Case: n=1. The path is just node 0. If n=1, n-1=0. The cost is 0.
The problem states `1 <= n`. If n=1, target is 0. Start is 0. Cost is 0.

Consider initial state carefully:
When we start at node 0, we haven't seen any 'previous' character.
So, the state should represent reaching node `u`, having arrived from a path ending with `last_char_idx_u` consecutively for `consecutive_count_u` times.

Let's use `dist[n][26][k+1]` where `dist[node][char_idx][count]` stores the minimum cost to reach `node`, where the last character seen was `char_idx` and it appeared `count` times consecutively.
`char_idx` can be from 0 to 25.
Initial state: Node 0. Its label is `labels[0]`.
We push `(0, 0, labels[0]-'a', 1)` into PQ.
And set `dist[0][labels[0]-'a'][1] = 0`.

When exploring edge `u -> v` with weight `w`:
From state `(cost_u, u, last_char_idx_u, consecutive_count_u)`:
Neighbor `v` has label `labels[v]`. Let `char_v_idx = labels[v]-'a'`.

If `char_v_idx == last_char_idx_u`:
  If `consecutive_count_u + 1 <= k`:
    `new_cost = cost_u + w`
    `new_consecutive_count = consecutive_count_u + 1`
    If `new_cost < dist[v][char_v_idx][new_consecutive_count]`:
      `dist[v][char_v_idx][new_consecutive_count] = new_cost`
      Push `(new_cost, v, char_v_idx, new_consecutive_count)` to PQ.

Else (`char_v_idx != last_char_idx_u`):
  `new_cost = cost_u + w`
  `new_consecutive_count = 1`
  If `new_cost < dist[v][char_v_idx][new_consecutive_count]`:
    `dist[v][char_v_idx][new_consecutive_count] = new_cost`
    Push `(new_cost, v, char_v_idx, new_consecutive_count)` to PQ.

Final answer: Minimum of `dist[n-1][c][cnt]` for `c` in 0..25, `cnt` in 1..k.

Max possible cost: n * max_weight = 5e4 * 1e4 = 5e8. Use `long long` for costs, or `int` if it fits.
The problem constraints suggest `wi <= 10^4`, `n <= 5 * 10^4`. Total path length could be up to `n-1`. Maximum path cost `(n-1) * 10^4 \approx 5 * 10^4 * 10^4 = 5 * 10^8`. An `int` can store up to ~2*10^9, so `int` is fine for costs.

Size of dist array: `50000 * 26 * 51`. This is about `66 * 10^6` entries. If each entry is an `int` (4 bytes), this is about 264 MB, which is acceptable.

Priority Queue state: `pair<int, pair<int, pair<int, int>>>` representing `{cost, {node, {last_char_idx, consecutive_count}}}`.
`last_char_idx` can be -1 initially, but we are pushing node 0 with its label, so we don't need -1. It's always 0-25.

Let's consider the maximum consecutive characters `k`. It can be up to 50.
The DP state `dist[node][char_idx][consecutive_count]` seems correct.
`char_idx` is 0-25 for 'a'-'z'.
`consecutive_count` is 1 to `k`.

Example 1: n = 3, edges = [[0,1,1],[1,2,1],[0,2,3]], labels = "aab", k = 1
adj:
0: (1,1), (2,3)
1: (2,1)
2:

dist[3][26][2] initialized to INF.
pq:
push {0, 0, 'a'-'a'=0, 1}
dist[0][0][1] = 0

pop {0, 0, 0, 1} (cost=0, u=0, last_char=0, count=1)
  adj[0]:
  - edge to 1, w=1:
    labels[1] = 'a'. char_v_idx = 0.
    char_v_idx == last_char_idx_u (0 == 0).
    consecutive_count_u + 1 = 1 + 1 = 2. k = 1. 2 > k. Cannot extend.
  - edge to 2, w=3:
    labels[2] = 'b'. char_v_idx = 1.
    char_v_idx != last_char_idx_u (1 != 0).
    new_cost = 0 + 3 = 3.
    new_consecutive_count = 1.
    If 3 < dist[2][1][1] (INF):
      dist[2][1][1] = 3
      push {3, 2, 1, 1} to pq.

pq: {3, 2, 1, 1}
pop {3, 2, 1, 1} (cost=3, u=2, last_char=1, count=1)
  u=2 is n-1. Destination reached. Store min_cost_to_dest = 3.
  adj[2]: empty.

pq empty.
Min cost to n-1 = 3.
Result: 3. Correct.

Example 2: n = 3, edges = [[0,1,1],[1,2,1],[0,2,3]], labels = "aab", k = 2
dist[3][26][3] initialized to INF.
pq:
push {0, 0, 'a'-'a'=0, 1}
dist[0][0][1] = 0

pop {0, 0, 0, 1} (cost=0, u=0, last_char=0, count=1)
  adj[0]:
  - edge to 1, w=1:
    labels[1] = 'a'. char_v_idx = 0.
    char_v_idx == last_char_idx_u (0 == 0).
    consecutive_count_u + 1 = 1 + 1 = 2. k = 2. 2 <= k. Can extend.
    new_cost = 0 + 1 = 1.
    new_consecutive_count = 2.
    If 1 < dist[1][0][2] (INF):
      dist[1][0][2] = 1
      push {1, 1, 0, 2} to pq.
  - edge to 2, w=3:
    labels[2] = 'b'. char_v_idx = 1.
    char_v_idx != last_char_idx_u (1 != 0).
    new_cost = 0 + 3 = 3.
    new_consecutive_count = 1.
    If 3 < dist[2][1][1] (INF):
      dist[2][1][1] = 3
      push {3, 2, 1, 1} to pq.

pq: {1, 1, 0, 2}, {3, 2, 1, 1}
pop {1, 1, 0, 2} (cost=1, u=1, last_char=0, count=2)
  adj[1]:
  - edge to 2, w=1:
    labels[2] = 'b'. char_v_idx = 1.
    char_v_idx != last_char_idx_u (1 != 0).
    new_cost = 1 + 1 = 2.
    new_consecutive_count = 1.
    If 2 < dist[2][1][1] (3):
      dist[2][1][1] = 2
      push {2, 2, 1, 1} to pq.

pq: {2, 2, 1, 1}, {3, 2, 1, 1}
pop {2, 2, 1, 1} (cost=2, u=2, last_char=1, count=1)
  u=2 is n-1. Destination reached.
  adj[2]: empty.

pq: {3, 2, 1, 1}
pop {3, 2, 1, 1} (cost=3, u=2, last_char=1, count=1)
  cost 3 is not better than current dist[2][1][1] which is 2. Skip or check before pushing.
  If we check `current_cost > dist[u][last_char_idx_u][consecutive_count_u]` at pop, we skip.
  Let's assume we check. This state is already processed with cost 2.

pq empty.
Min cost to n-1:
dist[2][0][1] = INF
dist[2][0][2] = INF
dist[2][1][1] = 2
dist[2][1][2] = INF
...
Minimum is 2.
Result: 2. Correct.

Example 3: n = 3, edges = [[0,1,1],[1,2,1]], labels = "aaa", k = 2
adj:
0: (1,1)
1: (2,1)
2:

dist[3][26][3] initialized to INF.
pq:
push {0, 0, 'a'-'a'=0, 1}
dist[0][0][1] = 0

pop {0, 0, 0, 1} (cost=0, u=0, last_char=0, count=1)
  adj[0]:
  - edge to 1, w=1:
    labels[1] = 'a'. char_v_idx = 0.
    char_v_idx == last_char_idx_u (0 == 0).
    consecutive_count_u + 1 = 1 + 1 = 2. k = 2. 2 <= k. Can extend.
    new_cost = 0 + 1 = 1.
    new_consecutive_count = 2.
    If 1 < dist[1][0][2] (INF):
      dist[1][0][2] = 1
      push {1, 1, 0, 2} to pq.

pq: {1, 1, 0, 2}
pop {1, 1, 0, 2} (cost=1, u=1, last_char=0, count=2)
  adj[1]:
  - edge to 2, w=1:
    labels[2] = 'a'. char_v_idx = 0.
    char_v_idx == last_char_idx_u (0 == 0).
    consecutive_count_u + 1 = 2 + 1 = 3. k = 2. 3 > k. Cannot extend.

pq empty.
Min cost to n-1 (node 2):
dist[2][c][cnt] will all be INF.
Result: -1. Correct.

The logic seems sound. The state representation `dist[node][char_idx][count]` and the transitions cover the problem constraints.

Implementation details:
Use `vector<vector<pair<int, int>>> adj(n);`
Use `vector<vector<vector<int>>> dist(n, vector<vector<int>>(26, vector<int>(k + 1, INF)));`
INF can be `INT_MAX`.
Priority queue: `priority_queue<State, vector<State>, greater<State>> pq;` where `State` is a struct or tuple.
Tuple: `tuple<int, int, int, int>` for `{cost, node, last_char_idx, consecutive_count}`.

Helper struct for PQ state:
```cpp
struct State {
    int cost;
    int node;
    int last_char_idx;
    int consecutive_count;

    bool operator>(const State& other) const {
        return cost > other.cost;
    }
};
```
Or use `std::pair` and `std::tuple` directly.
Using `std::pair<int, std::pair<int, std::pair<int, int>>>` for `{cost, {node, {last_char_idx, consecutive_count}}}`.

Maximum value of k is 50.
`k+1` size for `consecutive_count` dimension is fine.

Consider `n=1`. `n-1=0`. The loop for finding minimum cost at `n-1` will correctly check `dist[0][c][cnt]`.
Initial state is pushing `{0, 0, labels[0]-'a', 1}`.
If `n=1`, the loop to find answer will check `dist[0][c][cnt]`.
The minimum cost to reach node 0 is 0.
If `n=1`, the loop would search `dist[0][c][cnt]`. `dist[0][labels[0]-'a'][1]` is 0. So it will return 0.

Final check of constraints and potential issues:
- `n` up to `5 * 10^4`.
- `edges.length` up to `5 * 10^4`.
- `k` up to `50`.

Time Complexity:
- Building adjacency list: O(E) where E is the number of edges.
- Dijkstra's algorithm: The number of states is N * 26 * (K+1). Each state is pushed and popped from the priority queue at most once. For each state popped, we iterate through its outgoing edges. Max out-degree is N-1, but total edges considered across all states is O(E).
  So, number of states S = N * 26 * (K+1).
  Number of edges considered in PQ operations is O(E).
  PQ operations take O(log S).
  Total time complexity: O(E log S + S log S) where S = N * 26 * (K+1).
  Since E can be up to 5*10^4 and N up to 5*10^4, N*26*(K+1) can be up to 5*10^4 * 26 * 51 ≈ 6.6 * 10^7.
  If E is much larger than S, then it's O(E log S).
  If S is much larger than E, then it's O(S log S).
  Here, S can be larger than E.
  S = N * 26 * (K+1)
  E <= N * (N-1)
  In this problem, E is limited to 5*10^4, which is comparable to N.
  So, S is roughly `5*10^4 * 26 * 51 \approx 6.6 \times 10^7`.
  E is `5 \times 10^4`.
  The complexity is dominated by O(S log S).
  O(N * 26 * K * log(N * 26 * K)).
  This seems to be the correct complexity for Dijkstra on an expanded state space.

Space Complexity:
- Adjacency list: O(N + E).
- Distance array: O(N * 26 * K).
- Priority queue: O(S) in the worst case, where S is the number of states.
  Total space complexity: O(N * K).

Let's use `std::tuple` for the PQ for cleaner code.
`std::priority_queue<std::tuple<int, int, int, int>, std::vector<std::tuple<int, int, int, int>>, std::greater<std::tuple<int, int, int, int>>> pq;`
The tuple will be `{cost, node, last_char_idx, consecutive_count}`.

`last_char_idx` in the state definition.
When we are at node `u`, `labels[u]` is the character.
When we move to `v`, we compare `labels[v]` with `labels[u]`.
The `last_char_idx` in the PQ state `{cost, node, last_char_idx, consecutive_count}` should represent the label of `node`.
So if we are at state `(cost, u, char_u_idx, count_u)`, this means we reached node `u` with cost `cost`, `labels[u]` is `char_u_idx`, and it occurred `count_u` times consecutively.

Let's verify the `dist` array indexing.
`dist[node][char_idx][count]` is the min cost to reach `node`, where `labels[node]` is `char_idx` and it's the `count`-th consecutive appearance of this char.

Initialisation for node 0:
`dist[0][labels[0]-'a'][1] = 0;`
`pq.push({0, 0, labels[0]-'a', 1});`

Transition for edge `u -> v` with weight `w`, from PQ state `{cost_u, u, char_u_idx, count_u}`:
Neighbor `v` has label `labels[v]`. Let `char_v_idx = labels[v]-'a'`.

If `char_v_idx == char_u_idx`:
  // We are extending the same consecutive character sequence.
  `new_count = count_u + 1`.
  If `new_count <= k`:
    `new_cost = cost_u + w`.
    If `new_cost < dist[v][char_v_idx][new_count]`:
      `dist[v][char_v_idx][new_count] = new_cost`.
      `pq.push({new_cost, v, char_v_idx, new_count});`
Else (`char_v_idx != char_u_idx`):
  // We are starting a new consecutive character sequence.
  `new_count = 1`.
  `new_cost = cost_u + w`.
  If `new_cost < dist[v][char_v_idx][new_count]`:
    `dist[v][char_v_idx][new_count] = new_cost`.
    `pq.push({new_cost, v, char_v_idx, new_count});`

This revised transition logic seems correct. The `last_char_idx` in the PQ state directly corresponds to `labels[node]`.

Final answer calculation:
Iterate `c` from 0 to 25.
Iterate `cnt` from 1 to `k`.
`min_cost = min(min_cost, dist[n-1][c][cnt]);`
If `min_cost` remains `INF`, return -1.

The constraint `1 <= k <= 50` is important. If `k` was large, this approach would be too slow.
The state space size is `N * 26 * K`.

Let's check `INT_MAX` value. `2147483647`. Max path cost is `5*10^8`. So `int` is fine.
Using `long long` for `dist` and `pq` costs is safer if there's any doubt about intermediate calculations or if the problem statement had larger bounds. But given the explicit bounds, `int` should be okay. Let's stick with `int` for now.

If `n=1`, `n-1=0`.
The answer loop will check `dist[0][c][cnt]`.
`dist[0][labels[0]-'a'][1]` is 0.
Other `dist[0][c][cnt]` will be INF.
So min_cost will be 0. Correct.

The code structure would be:
Include headers.
Define INF.
Main function `shortestAlternatingPaths` (or similar name, though problem doesn't ask for class member function).
Build adj list.
Initialize dist table.
Initialize PQ.
Push initial state for node 0.
Dijkstra loop.
Find minimum cost at node n-1.
Return result.

Need to handle includes: `<vector>`, `<queue>`, `<tuple>`, `<limits>`, `<algorithm>`.
`using namespace std;` is common in competitive programming but good practice to avoid in larger projects. For LeetCode, it's usually fine.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <tuple>
#include <limits>
#include <algorithm>

// Using namespace std; // Avoided for better practice, will qualify std:: usage.

const int INF = std::numeric_limits<int>::max();

/*
    Problem Summary: Find the shortest path from node 0 to node n-1 in a directed weighted graph,
    such that the labels of nodes along the path do not have more than k consecutive identical characters.

    Link: https://leetcode.com/problems/shortest-path-with-at-most-k-consecutive-identical-characters/

    Approach:
    This problem is solved using Dijkstra's algorithm on an augmented state space.
    The state in Dijkstra's algorithm is defined by (current_node, last_character_index, consecutive_count_of_last_character).
    This allows us to keep track of the path's history relevant to the constraint of consecutive identical characters.

    The state in the priority queue will be a tuple: {cost, node_id, last_char_idx, consecutive_count}.
    - cost: The accumulated weight of the path to reach this state.
    - node_id: The current node in the graph.
    - last_char_idx: The index (0-25) of the character label of the current node. This is used to check for consecutive characters.
    - consecutive_count: The number of times `last_char_idx` has appeared consecutively ending at `node_id`.

    We use a 3D DP table `dist[n][26][k+1]` to store the minimum cost to reach a specific state:
    `dist[node][char_idx][count]` = minimum cost to reach `node`, where `labels[node]` is `char_idx` and it's the `count`-th consecutive occurrence.

    Initialization:
    - The `dist` table is initialized with infinity (INF).
    - For the starting node (node 0), the initial state is pushed into the priority queue:
      `{0, 0, labels[0]-'a', 1}`.
    - `dist[0][labels[0]-'a'][1]` is set to 0.

    Transitions:
    When exploring an edge from node `u` to node `v` with weight `w`, originating from a state `{cost_u, u, char_u_idx, count_u}`:
    Let `char_v_idx = labels[v] - 'a'`.

    1. If `char_v_idx == char_u_idx`:
       The current character is the same as the previous one. We can extend the consecutive sequence if `count_u + 1 <= k`.
       The new state will be `{cost_u + w, v, char_v_idx, count_u + 1}`.
       If this new path is shorter than the previously recorded shortest path to this new state, update `dist` and push to PQ.

    2. If `char_v_idx != char_u_idx`:
       The current character is different from the previous one. This starts a new consecutive sequence of length 1.
       The new state will be `{cost_u + w, v, char_v_idx, 1}`.
       If this new path is shorter, update `dist` and push to PQ.

    Termination:
    Dijkstra's algorithm terminates when the priority queue is empty.
    The final answer is the minimum value found in `dist[n-1][c][cnt]` for all possible last characters `c` (0-25) and all valid consecutive counts `cnt` (1-k).
    If no path to `n-1` is found, the minimum will remain INF, and we return -1.

    Time Complexity:
    Let N be the number of nodes, E be the number of edges, and K be the maximum consecutive characters allowed.
    The number of states is N * 26 * (K+1).
    Each edge relaxation takes O(log(N * 26 * K)) due to priority queue operations.
    In the worst case, each edge might be relaxed multiple times across different states. However, a node in the state graph (node, char, count) is visited at most once with its minimum cost.
    The total time complexity is O(E * log(N*K) + N*K*log(N*K)), which simplifies to O(N * K * log(N * K)) because E can be up to N^2 in a general graph but is bounded by 5*10^4 here, and N*K*log(N*K) is likely the dominant term given N=5*10^4 and K=50. More precisely, it's O(S log S + E log S) where S is the number of states. Given E <= 5*10^4 and S approx 5*10^4 * 26 * 50, S is larger. The complexity is O(S log S).

    Space Complexity:
    - Adjacency list: O(N + E).
    - Distance table `dist`: O(N * 26 * K).
    - Priority queue: O(N * 26 * K) in the worst case.
    Total space complexity: O(N * K).
*/
class Solution {
public:
    int shortestPathWithKConsecutive(int n, std::vector<std::vector<int>>& edges, std::string labels, int k) {
        // Adjacency list: adj[u] stores pairs of {neighbor_v, edge_weight_w}
        std::vector<std::vector<std::pair<int, int>>> adj(n);
        for (const auto& edge : edges) {
            int u = edge[0];
            int v = edge[1];
            int w = edge[2];
            adj[u].push_back({v, w});
        }

        // dist[node][char_idx][consecutive_count] stores the minimum cost to reach 'node'
        // where the last character seen was 'char_idx' (0-25 for 'a'-'z')
        // and it appeared 'consecutive_count' times in a row.
        // Initialize with INF. consecutive_count goes from 1 to k.
        std::vector<std::vector<std::vector<int>>> dist(n, std::vector<std::vector<int>>(26, std::vector<int>(k + 1, INF)));

        // Priority queue stores tuples: {cost, node, last_char_idx, consecutive_count}
        // We use std::greater to make it a min-priority queue based on cost.
        using State = std::tuple<int, int, int, int>; // cost, node, last_char_idx, consecutive_count
        std::priority_queue<State, std::vector<State>, std::greater<State>> pq;

        // Initial state: Start at node 0.
        // The character at node 0 is labels[0]. Its index is labels[0]-'a'.
        // It's the first character in its consecutive sequence, so count is 1.
        int start_node = 0;
        int start_char_idx = labels[start_node] - 'a';
        int initial_cost = 0;
        int initial_count = 1;

        dist[start_node][start_char_idx][initial_count] = initial_cost;
        pq.push({initial_cost, start_node, start_char_idx, initial_count});

        // Dijkstra's algorithm
        while (!pq.empty()) {
            auto [current_cost, u, char_u_idx, count_u] = pq.top();
            pq.pop();

            // If we've found a shorter path to this state already, skip.
            if (current_cost > dist[u][char_u_idx][count_u]) {
                continue;
            }

            // Explore neighbors
            for (auto& edge : adj[u]) {
                int v = edge.first;
                int w = edge.second;
                int char_v_idx = labels[v] - 'a';
                int new_cost = current_cost + w;

                if (char_v_idx == char_u_idx) {
                    // Current character is the same as the last one.
                    // Check if we can extend the consecutive count.
                    int new_count = count_u + 1;
                    if (new_count <= k) {
                        if (new_cost < dist[v][char_v_idx][new_count]) {
                            dist[v][char_v_idx][new_count] = new_cost;
                            pq.push({new_cost, v, char_v_idx, new_count});
                        }
                    }
                } else {
                    // Current character is different from the last one.
                    // Start a new consecutive sequence of length 1.
                    int new_count = 1;
                    if (new_cost < dist[v][char_v_idx][new_count]) {
                        dist[v][char_v_idx][new_count] = new_cost;
                        pq.push({new_cost, v, char_v_idx, new_count});
                    }
                }
            }
        }

        // After Dijkstra, find the minimum cost to reach the destination node (n-1).
        // The destination can be reached with any last character and any valid consecutive count.
        int min_cost_to_dest = INF;
        int dest_node = n - 1;

        // If n=1, the destination is node 0. The loop below will correctly check dist[0].
        for (int char_idx = 0; char_idx < 26; ++char_idx) {
            for (int count = 1; count <= k; ++count) {
                min_cost_to_dest = std::min(min_cost_to_dest, dist[dest_node][char_idx][count]);
            }
        }

        // If min_cost_to_dest is still INF, it means no valid path was found.
        return (min_cost_to_dest == INF) ? -1 : min_cost_to_dest;
    }
};
```