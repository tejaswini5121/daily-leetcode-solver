```java
import java.util.*;

class Solution {

    /*
     * Problem Summary: Find the shortest path from node 0 to node n-1 in a weighted directed graph,
     * with the constraint that the sequence of labels along the path must not have more than k
     * consecutive identical characters.
     *
     * Problem Link: https://leetcode.com/problems/shortest-path-with-at-most-k-consecutive-identical-characters/
     *
     * Approach:
     * This problem can be solved using Dijkstra's algorithm. The key is to augment the state in Dijkstra's
     * algorithm to include information about the last character encountered and the count of consecutive
     * occurrences of that character.
     *
     * State Representation:
     * We will use a tuple (node, last_char, consecutive_count) to represent a state.
     * - `node`: The current node we are at.
     * - `last_char`: The character of the immediately preceding node in the path.
     * - `consecutive_count`: The number of consecutive times `last_char` has appeared ending at the current node.
     *
     * Dijkstra's Algorithm:
     * We'll use a priority queue to store states ordered by their current path cost.
     * The priority queue will store elements of type `[cost, node, last_char_code, consecutive_count]`.
     * `last_char_code` is an integer representation of the character for easier comparison (e.g., 'a' -> 0, 'b' -> 1).
     *
     * Distance Array:
     * We need a 3D DP table (or distance map) `dist[node][last_char_code][consecutive_count]` to store the minimum
     * cost to reach `node` with the given `last_char_code` and `consecutive_count`.
     * Initialize `dist` with infinity.
     *
     * Initialization:
     * For the starting node (node 0):
     * The initial state is at node 0. The "last_char" conceptually doesn't exist yet, or we can think of it
     * as a special character that doesn't match any real character. For simplicity, we can consider the initial
     * `last_char` as something that won't cause an immediate violation. A convenient way is to use a character code
     * that's outside the range of 'a'-'z' (e.g., -1) and a consecutive count of 0.
     * So, `dist[0][-1][0] = 0`. We add `[0, 0, -1, 0]` to the priority queue.
     *
     * Exploration:
     * When we extract a state `[cost, u, prev_char_code, prev_count]` from the priority queue:
     * 1. If `cost > dist[u][prev_char_code][prev_count]`, skip (already found a better path).
     * 2. For each neighbor `v` of `u` with edge weight `w`:
     *    - Let `current_char = labels.charAt(v)`.
     *    - Let `current_char_code = current_char - 'a'`.
     *
     *    - Calculate `new_consecutive_count`:
     *      - If `current_char_code == prev_char_code`:
     *          `new_consecutive_count = prev_count + 1`.
     *      - Else:
     *          `new_consecutive_count = 1`.
     *
     *    - Check constraint:
     *      - If `new_consecutive_count <= k`:
     *          - `new_cost = cost + w`.
     *          - If `new_cost < dist[v][current_char_code][new_consecutive_count]`:
     *              - Update `dist[v][current_char_code][new_consecutive_count] = new_cost`.
     *              - Add `[new_cost, v, current_char_code, new_consecutive_count]` to the priority queue.
     *
     * Result:
     * After Dijkstra's algorithm finishes, the minimum cost to reach node `n-1` is the minimum value
     * among `dist[n-1][char_code][count]` for all possible `char_code` (0-25) and `count` (1 to k).
     * If this minimum is still infinity, no valid path exists, return -1.
     *
     * Graph Representation:
     * An adjacency list `adj` where `adj[u]` stores a list of `[v, w]` for edges from `u` to `v` with weight `w`.
     *
     * State in Priority Queue:
     * We will store `[cost, node, last_char_code, consecutive_count]`. `last_char_code` can be from -1 to 25.
     * `consecutive_count` can be from 0 to k.
     *
     * Handling `last_char_code = -1`:
     * We can map -1 to index 26 in our `dist` array to avoid negative indices.
     * `dist[node][26][count]` will store the cost when the previous character was undefined (start node).
     *
     * Data Structures:
     * - `adj`: `List<List<int[]>>` where `adj.get(u)` contains `[v, w]`.
     * - `dist`: `int[n][27][k+1]`. `dist[i][j][l]` is the min cost to reach node `i` where the last distinct
     *   character was `j` (0-25 for 'a'-'z', 26 for initial state) with `l` consecutive occurrences.
     * - `pq`: `PriorityQueue<long[]>`, storing `[cost, node, last_char_code, consecutive_count]`. Using `long` for cost to prevent overflow.
     *
     * Time Complexity:
     * The number of states is `n * 26 * k`.
     * For each state, we might iterate through its outgoing edges. The total number of edges is `E`.
     * In Dijkstra's, each edge is relaxed at most once for each state.
     * So, the complexity is roughly `O(E * 26 * k * log(n * 26 * k))`, where `log` is for priority queue operations.
     * Since `k` is small (<= 50) and `n`, `E` up to 5 * 10^4, this should be acceptable.
     * Let `V_prime = n * 26 * k` be the number of states. The complexity is `O(E_prime * log(V_prime))`, where `E_prime` is the total number of transitions, which is bounded by `E * 26 * k`.
     * A tighter bound is `O(E * 26 * k * log(n * 26 * k))`.
     *
     * Space Complexity:
     * - `adj`: `O(N + E)`
     * - `dist`: `O(n * 26 * k)`
     * - `pq`: `O(n * 26 * k)` in the worst case.
     * Overall: `O(N + E + n * k)`. Since `k` is small, it's effectively `O(N + E)`.
     */
    public int shortestPath(int n, int[][] edges, String labels, int k) {
        // Adjacency list to represent the graph.
        // adj.get(u) stores a list of pairs [v, w] for edges from u to v with weight w.
        List<List<int[]>> adj = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
        }
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            int w = edge[2];
            adj.get(u).add(new int[]{v, w});
        }

        // dist[node][last_char_code][consecutive_count] stores the minimum cost to reach 'node'.
        // 'last_char_code': 0-25 for 'a'-'z'. We use 26 for a special 'null' character to represent the start node state,
        // where there's no preceding character.
        // 'consecutive_count': 1 to k. We use 0 for the initial state's count.
        // Initialize distances to a very large value (infinity).
        long[][][] dist = new long[n][27][k + 1];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < 27; j++) {
                Arrays.fill(dist[i][j], Long.MAX_VALUE);
            }
        }

        // Priority queue for Dijkstra's algorithm.
        // Stores elements as [cost, node, last_char_code, consecutive_count].
        // Using long for cost to prevent potential overflow.
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));

        // Initial state: starting at node 0, cost is 0, no previous character (use code 26), and 0 consecutive.
        dist[0][26][0] = 0;
        pq.offer(new long[]{0, 0, 26, 0});

        // Dijkstra's algorithm main loop
        while (!pq.isEmpty()) {
            long[] current = pq.poll();
            long currentCost = current[0];
            int u = (int) current[1];
            int prevCharInt = (int) current[2];
            int prevConsecutive = (int) current[3];

            // If we found a shorter path to this state already, skip.
            if (currentCost > dist[u][prevCharInt][prevConsecutive]) {
                continue;
            }

            // Explore neighbors of node u
            for (int[] edge : adj.get(u)) {
                int v = edge[0];
                int weight = edge[1];
                char currentChar = labels.charAt(v);
                int currentCharInt = currentChar - 'a'; // 0-25

                int nextConsecutive;
                // Determine the new consecutive count based on the previous character.
                if (prevCharInt == currentCharInt) {
                    // If the current character is the same as the previous one.
                    nextConsecutive = prevConsecutive + 1;
                } else {
                    // If the current character is different, reset consecutive count to 1.
                    nextConsecutive = 1;
                }

                // Check if the consecutive count constraint is met.
                if (nextConsecutive <= k) {
                    long newCost = currentCost + weight;
                    // If this new path to state (v, currentCharInt, nextConsecutive) is shorter.
                    if (newCost < dist[v][currentCharInt][nextConsecutive]) {
                        dist[v][currentCharInt][nextConsecutive] = newCost;
                        // Add the new state to the priority queue.
                        pq.offer(new long[]{newCost, v, currentCharInt, nextConsecutive});
                    }
                }
            }
        }

        // After Dijkstra's, find the minimum cost to reach the destination node (n-1).
        // We need to check all possible last characters and all valid consecutive counts.
        long minPathCost = Long.MAX_VALUE;

        // Iterate through all possible last characters (0-25 for 'a'-'z').
        for (int charCode = 0; charCode < 26; charCode++) {
            // Iterate through all possible consecutive counts (1 to k).
            for (int count = 1; count <= k; count++) {
                minPathCost = Math.min(minPathCost, dist[n - 1][charCode][count]);
            }
        }

        // If minPathCost is still Long.MAX_VALUE, it means node n-1 is unreachable with the given constraints.
        return (minPathCost == Long.MAX_VALUE) ? -1 : (int) minPathCost;
    }
}
```