```python
import heapq

# Problem: Shortest Path With At Most K Consecutive Identical Characters
# Link: https://leetcode.com/problems/shortest-path-with-at-most-k-consecutive-identical-characters/

# Approach:
# This problem can be modeled as a shortest path problem on a modified graph.
# The state in our Dijkstra's algorithm needs to include not just the current node
# but also information about the preceding path to enforce the constraint on
# consecutive identical characters.
#
# A suitable state for our priority queue will be a tuple:
# (current_cost, current_node, last_char, consecutive_count)
#
# - current_cost: The total weight of the path from node 0 to current_node.
# - current_node: The current node we are at.
# - last_char: The character of the node immediately preceding current_node in the path.
# - consecutive_count: The number of consecutive times last_char has appeared
#                      ending at current_node.
#
# We initialize the priority queue with the starting state:
# (0, 0, None, 0) representing (cost, node, last_char, consecutive_count).
# The last_char is None and consecutive_count is 0 for the starting node.
#
# We use a distance array `dist` to store the minimum cost to reach a specific
# state. The key for `dist` will be a tuple: (node, last_char, consecutive_count).
# This is because multiple paths can lead to the same node, but with different
# consecutive character counts or preceding characters, and we need to track
# the minimum cost for each distinct state.
#
# The dimensions of `dist` would be n * 26 * (k+1).
#
# Algorithm:
# 1. Build an adjacency list representation of the graph from the `edges` array.
# 2. Initialize a distance dictionary `dist` to store the minimum cost for each state
#    (node, last_char_index, consecutive_count). Initialize all distances to infinity.
#    `last_char_index` can be from 0 to 25 representing 'a' to 'z', or a special value for 'None'.
#    We can use 26 as a special index for the initial state where there's no preceding character.
# 3. Initialize a min-heap `pq` and push the starting state:
#    (0, 0, 26, 0)  # (cost, node, last_char_index, consecutive_count)
#    `dist[(0, 26, 0)] = 0`
#
# 4. While the priority queue is not empty:
#    a. Pop the state with the smallest cost: `(cost, u, last_char_idx, cons_count)`
#    b. If `cost > dist[(u, last_char_idx, cons_count)]`, continue (already found a better path).
#    c. If `u` is the target node `n-1`, return `cost`.
#
#    d. For each neighbor `v` of `u` with edge weight `w`:
#       i. Get the character of the current node `u`: `current_char = labels[u]`.
#       ii. Convert `current_char` to its index: `current_char_idx = ord(current_char) - ord('a')`.
#
#       iii. Calculate the new `consecutive_count` and `new_last_char_idx`:
#           If `current_char_idx == last_char_idx`:
#               `new_cons_count = cons_count + 1`
#               `new_last_char_idx = current_char_idx`
#           Else:
#               `new_cons_count = 1`
#               `new_last_char_idx = current_char_idx`
#
#       iv. Check the constraint: If `new_cons_count <= k`:
#           Calculate the `new_cost = cost + w`.
#           If `new_cost < dist.get((v, new_last_char_idx, new_cons_count), float('inf'))`:
#               `dist[(v, new_last_char_idx, new_cons_count)] = new_cost`
#               `heapq.heappush(pq, (new_cost, v, new_last_char_idx, new_cons_count))`
#
# 5. If the loop finishes without reaching the target node, return -1.
#
# Time Complexity:
# The state space is `n * 26 * (k+1)`.
# In Dijkstra's algorithm, each edge relaxation takes O(log V') time, where V' is the
# number of states.
# The number of edges in the expanded state graph can be up to `E * 26 * (k+1)`,
# where E is the number of original edges.
# So, the time complexity is roughly O(E * 26 * k * log(n * 26 * k)).
# Given the constraints, E <= 5*10^4, n <= 5*10^4, k <= 50, this might be too slow.
#
# Let's re-evaluate the state and distance representation for better efficiency.
# We can use a 3D array `dist[n][27][k+1]` for distances.
# `dist[node][last_char_index][consecutive_count]`
# `last_char_index` 0-25 for 'a'-'z', and 26 for the initial state (no preceding char).
#
# Building the adjacency list: O(E)
# Initialization of `dist` array: O(n * 26 * k)
# Dijkstra's algorithm:
# Number of states = n * 26 * (k+1)
# Number of edges in the state graph: For each original edge (u, v, w), we potentially
# transition from states at u to states at v. For a state at u, there are 26 * (k+1)
# possible (last_char_index, consecutive_count) pairs. So, the number of transitions
# from u is 26 * (k+1).
# Total number of potential transitions (edges in state graph) = E * 26 * (k+1).
#
# The number of states is V' = n * 27 * (k+1).
# The number of edges E' in the state graph is bounded by E * 27 * (k+1).
# The complexity of Dijkstra with a binary heap is O(E' log V').
# O(E * 27 * k * log(n * 27 * k)).
#
# With n=5*10^4, E=5*10^4, k=50:
# V' approx 5*10^4 * 27 * 51 approx 7 * 10^7
# E' approx 5*10^4 * 27 * 51 approx 7 * 10^7
# log V' approx log(7 * 10^7) approx 27
# E' log V' approx 7 * 10^7 * 27 approx 2 * 10^9 operations. This is likely too slow.
#
# Let's reconsider the state. When we arrive at a node `v` from `u`, the relevant
# information for `v` is its character `labels[v]`, the cost to reach it, and
# how this new character extends a consecutive sequence. The crucial part is
# the `consecutive_count` of `labels[v]`.
#
# If we reach node `v` with character `c_v` and the path leading to `v` ended with `c_u`,
# then if `c_v == c_u`, the consecutive count increments. Otherwise, it resets to 1.
#
# The state should be `(cost, node, last_char_idx, consecutive_count)`.
# The number of states at a node `u` is `26 * (k+1)` (considering all possible
# last characters and their consecutive counts leading to `u`).
#
# The number of entries in the `dist` table can be simplified.
# We only need to store the minimum cost to reach node `v` with its label being the
# `i`-th character in a sequence of `j` consecutive identical characters.
# `dist[v][char_v_idx][consecutive_count]` = min_cost.
#
# When we are at `u` with `(cost, u, prev_char_idx, prev_cons_count)`:
# For each edge `(u, v, w)`:
#   `char_v = labels[v]`
#   `char_v_idx = ord(char_v) - ord('a')`
#
#   If `char_v_idx == prev_char_idx` (i.e., `labels[v] == labels[prev_node]`):
#     `new_cons_count = prev_cons_count + 1`
#     `new_prev_char_idx = prev_char_idx` # The previous char remains the same
#   Else:
#     `new_cons_count = 1`
#     `new_prev_char_idx = char_v_idx` # The previous char is now the char at v
#
#   If `new_cons_count <= k`:
#     `new_cost = cost + w`
#     If `new_cost < dist[v][new_prev_char_idx][new_cons_count]`:
#       `dist[v][new_prev_char_idx][new_cons_count] = new_cost`
#       `heapq.heappush(pq, (new_cost, v, new_prev_char_idx, new_cons_count))`
#
# This looks more correct. The state is `(current_node, the_char_index_of_the_previous_node, count_of_that_previous_char_ending_at_current_node)`.
#
# Let's refine the state representation for `dist`.
# `dist[node][last_char_idx][consecutive_count]`
# `last_char_idx`: index of the character of the node *before* the current node.
# `consecutive_count`: count of `last_char_idx` ending at the *current* node.
#
# For the start node 0:
# `dist[0][26][0] = 0`  (node 0, no previous char, 0 consecutive count)
# PQ: `(0, 0, 26, 0)` # (cost, current_node, prev_char_idx, prev_consecutive_count)
#
# When popping `(cost, u, prev_char_idx, prev_cons_count)` from PQ:
# For each neighbor `v` of `u` with edge weight `w`:
#   `current_char_at_v = labels[v]`
#   `current_char_at_v_idx = ord(current_char_at_v) - ord('a')`
#
#   If `current_char_at_v_idx == prev_char_idx`: # The character at v is the same as the one before u
#     `new_cons_count_at_v = prev_cons_count + 1`
#     `new_prev_char_idx_for_v = prev_char_idx` # The char *before* v is the same as the char *before* u
#   Else: # The character at v is different from the one before u
#     `new_cons_count_at_v = 1` # New sequence starts at v
#     `new_prev_char_idx_for_v = current_char_at_v_idx` # The char *before* v is the char at v
#
#   If `new_cons_count_at_v <= k`:
#     `new_cost = cost + w`
#     # The state in dist should be `dist[v][char_at_v_idx][consecutive_count_of_char_at_v]`
#     # This seems wrong. The `prev_char_idx` and `prev_cons_count` are properties of the path *leading to* the current node `u`.
#     # When we move to `v`, we are concerned about `labels[v]` and its relation to `labels[u]`.
#
# Let's redefine the state in `dist` and PQ.
# State: `(node, char_at_node_idx, consecutive_count_of_char_at_node)`
# `dist[node][char_at_node_idx][consecutive_count]` = min_cost to reach `node` such that `labels[node]` is the `consecutive_count`-th occurrence of `char_at_node_idx`.
#
# Start: `dist[0][ord(labels[0])-ord('a')][1] = 0`.
# PQ: `(0, 0, ord(labels[0])-ord('a'), 1)` # (cost, current_node, char_at_current_node_idx, consecutive_count_at_current_node)
#
# When popping `(cost, u, u_char_idx, u_cons_count)` from PQ:
# For each neighbor `v` of `u` with edge weight `w`:
#   `v_char_idx = ord(labels[v]) - ord('a')`
#
#   If `v_char_idx == u_char_idx`: # Character at v is the same as character at u
#     `new_cons_count_at_v = u_cons_count + 1`
#     `new_u_char_idx_for_v = u_char_idx` # The "char_at_node_idx" for v is still the same type
#   Else: # Character at v is different from character at u
#     `new_cons_count_at_v = 1` # New sequence starts at v
#     `new_u_char_idx_for_v = v_char_idx` # The "char_at_node_idx" for v is its own char type
#
#   If `new_cons_count_at_v <= k`:
#     `new_cost = cost + w`
#     If `new_cost < dist[v][new_u_char_idx_for_v][new_cons_count_at_v]`:
#       `dist[v][new_u_char_idx_for_v][new_cons_count_at_v] = new_cost`
#       `heapq.heappush(pq, (new_cost, v, new_u_char_idx_for_v, new_cons_count_at_v))`
#
# This state definition seems more correct.
# `dist[node_idx][label_char_idx][consecutive_count]`
# `label_char_idx`: the index (0-25) of the character `labels[node_idx]`
# `consecutive_count`: the number of consecutive occurrences of `labels[node_idx]` ending at `node_idx`.
#
# Initializing `dist` with infinity.
# For the starting node 0:
# `start_char_idx = ord(labels[0]) - ord('a')`
# `dist[0][start_char_idx][1] = 0`
# Push to PQ: `(0, 0, start_char_idx, 1)` # (cost, current_node, char_at_current_node_idx, consecutive_count_at_current_node)
#
# When popping `(cost, u, u_char_idx, u_cons_count)`:
# For each neighbor `v` of `u` with edge weight `w`:
#   `v_char_idx = ord(labels[v]) - ord('a')`
#
#   Calculate `new_cons_count_at_v` and `new_u_char_idx_for_v`:
#   If `v_char_idx == u_char_idx`:
#     # The character at `v` is the same as the character at `u`.
#     # The consecutive count for `labels[v]` increases.
#     `new_cons_count_at_v = u_cons_count + 1`
#     # The *type* of character sequence ending at `v` is the same as the type ending at `u`.
#     `state_char_idx_for_v = u_char_idx`
#   Else:
#     # The character at `v` is different from the character at `u`.
#     # A new consecutive sequence starts at `v`.
#     `new_cons_count_at_v = 1`
#     # The *type* of character sequence ending at `v` is `labels[v]`.
#     `state_char_idx_for_v = v_char_idx`
#
#   If `new_cons_count_at_v <= k`:
#     `new_cost = cost + w`
#     # Check if this new path to `v` is better than any existing path to `v`
#     # that ends with `state_char_idx_for_v` and has a consecutive count of `new_cons_count_at_v`.
#     if `new_cost < dist[v][state_char_idx_for_v][new_cons_count_at_v]`:
#       `dist[v][state_char_idx_for_v][new_cons_count_at_v] = new_cost`
#       `heapq.heappush(pq, (new_cost, v, state_char_idx_for_v, new_cons_count_at_v))`
#
# Final answer: Minimum value in `dist[n-1][char_idx][cons_count]` for all `char_idx` and `cons_count`.
#
# Time Complexity Analysis (Revised):
# - Number of nodes: `n`
# - Number of edges: `E`
# - Max consecutive characters: `k`
# - Number of possible characters: 26 (for 'a' through 'z')
#
# The states in Dijkstra are defined by `(node, char_type_idx, consecutive_count)`.
# Number of states = `n * 26 * k`.
#
# Building adjacency list: O(E)
# Initializing `dist` array: O(n * 26 * k) with infinity.
#
# Dijkstra's algorithm:
# Each node `u` has at most 26 * k states associated with it.
# Each edge `(u, v, w)` can potentially create `26 * k` new states at `v` from states at `u`.
# The number of edges in the state graph: For each original edge `(u, v, w)`, we iterate through
# all `26 * k` states at `u`. So, roughly `E * 26 * k` transitions in total.
#
# Each push/pop on the priority queue takes `O(log(number_of_states))`.
# Number of states = `n * 26 * k`.
# Total time complexity: `O(E * 26 * k + n * 26 * k + E * 26 * k * log(n * 26 * k))`.
# The dominant term is `O(E * 26 * k * log(n * 26 * k))`.
#
# Let's check the constraints again: n = 5 * 10^4, E = 5 * 10^4, k = 50.
# `n * 26 * k` approx `5 * 10^4 * 26 * 50` approx `6.5 * 10^7`.
# `E * 26 * k` approx `5 * 10^4 * 26 * 50` approx `6.5 * 10^7`.
# `log(n * 26 * k)` approx `log(6.5 * 10^7)` approx `26`.
#
# Total operations: `6.5 * 10^7 * 26` approx `1.7 * 10^9`. This might still be borderline or too slow.
#
# There might be an implicit assumption or optimization possible.
# The problem statement mentions "Shortest Path". If the graph were unweighted, BFS would be appropriate. With weights, Dijkstra is standard.
#
# What if we use a dictionary for `dist` instead of a 3D array?
# `dist = {}` where keys are `(node, char_type_idx, consecutive_count)`.
# This reduces initialization time but the number of states can still be large.
# The complexity remains the same in the worst case.
#
# Let's use `float('inf')` for distances.
#
# Space Complexity Analysis:
# - Adjacency list: O(E)
# - `dist` table: O(n * 26 * k)
# - Priority queue: In the worst case, it can hold O(number_of_states) entries, which is O(n * 26 * k).
# Total space complexity: O(n * 26 * k).
#
# With n=5*10^4, k=50, 26:
# `5 * 10^4 * 26 * 50` approx `6.5 * 10^7` entries. This is a lot of memory.
#
# Consider the constraints on `k` (up to 50). This small value of `k` is key.
# If `k` was large (e.g., `n`), the problem would be much harder.
#
# The state definition and Dijkstra implementation seem standard for this type of constraint.
# Let's implement it and see. If it TLEs, we might need a more advanced technique or a different interpretation.
#
# An alternative approach for states:
# What if we use `(current_node, last_node_label_char_idx, count_of_that_char)`?
#
# `dist[node][last_node_label_idx][consecutive_count]`
#
# `dist[v][char_v_idx][new_cons_count]` = min cost to reach `v` such that `labels[v]` is the `new_cons_count`-th occurrence of `char_v_idx`.
#
# Initial state: node 0. `labels[0]` is the 1st occurrence of itself.
# `start_node = 0`
# `start_char_idx = ord(labels[start_node]) - ord('a')`
# `dist = collections.defaultdict(lambda: float('inf'))`
# `dist[(start_node, start_char_idx, 1)] = 0`
# `pq = [(0, start_node, start_char_idx, 1)]` # (cost, current_node, char_at_current_node_idx, consecutive_count_at_current_node)
#
# When popping `(cost, u, u_char_idx, u_cons_count)` from PQ:
# For each neighbor `v` of `u` with edge weight `w`:
#   `v_char_idx = ord(labels[v]) - ord('a')`
#
#   If `v_char_idx == u_char_idx`:
#     # The character at `v` is the same as the character at `u`.
#     # This extends the consecutive sequence of `u_char_idx`.
#     `new_cons_count_at_v = u_cons_count + 1`
#     `state_char_idx_for_v = u_char_idx` # The character type defining this sequence is the same
#   Else:
#     # The character at `v` is different from the character at `u`.
#     # A new consecutive sequence starts at `v` with `labels[v]`.
#     `new_cons_count_at_v = 1`
#     `state_char_idx_for_v = v_char_idx` # The character type defining this sequence is `labels[v]`
#
#   If `new_cons_count_at_v <= k`:
#     `new_cost = cost + w`
#     # Check if this new path to `v` is better.
#     # The state in `dist` is `(node, char_type_defining_the_sequence, consecutive_count_of_that_char_type_ending_at_node)`.
#     if `new_cost < dist[(v, state_char_idx_for_v, new_cons_count_at_v)]`:
#       `dist[(v, state_char_idx_for_v, new_cons_count_at_v)] = new_cost`
#       `heapq.heappush(pq, (new_cost, v, state_char_idx_for_v, new_cons_count_at_v))`
#
# This seems to be the correct interpretation. The `state_char_idx_for_v` is the character that forms the consecutive sequence ending at `v`.
# The `consecutive_count` is how many times that `state_char_idx_for_v` has appeared consecutively ending at `v`.
#
# Final answer would be `min(dist[(n-1, char_idx, cons_count)] for char_idx in range(26) for cons_count in range(1, k+1))`.
#
# Using `defaultdict` might be slightly slower than a pre-allocated 3D array for `dist` but handles sparse states better.
# Given the constraints, `n * 26 * k` states can be dense. A 3D array `dist[n][26][k+1]` is likely better.
#
# `dist[node_idx][label_char_idx][consecutive_count]`
# `label_char_idx`: 0-25, for `labels[node_idx]`
# `consecutive_count`: 1 to `k`
#
# Let's use a 3D array for `dist` initialized to infinity.
# `dist = [[[float('inf')] * (k + 1) for _ in range(26)] for _ in range(n)]`
#
# Initializing the start node (node 0):
# `start_node = 0`
# `start_char_idx = ord(labels[start_node]) - ord('a')`
# `dist[start_node][start_char_idx][1] = 0`
# `pq = [(0, start_node, start_char_idx, 1)]` # (cost, current_node, char_at_current_node_idx, consecutive_count_at_current_node)
#
# When popping `(cost, u, u_char_idx, u_cons_count)` from PQ:
# For each neighbor `v` of `u` with edge weight `w`:
#   `v_char_idx = ord(labels[v]) - ord('a')`
#
#   If `v_char_idx == u_char_idx`:
#     `new_cons_count_at_v = u_cons_count + 1`
#     `state_char_idx_for_v = u_char_idx`
#   Else:
#     `new_cons_count_at_v = 1`
#     `state_char_idx_for_v = v_char_idx`
#
#   If `new_cons_count_at_v <= k`:
#     `new_cost = cost + w`
#     if `new_cost < dist[v][state_char_idx_for_v][new_cons_count_at_v]`:
#       `dist[v][state_char_idx_for_v][new_cons_count_at_v] = new_cost`
#       `heapq.heappush(pq, (new_cost, v, state_char_idx_for_v, new_cons_count_at_v))`
#
# Final answer calculation:
# Iterate through all possible character types and counts for the destination node `n-1`.
# `min_total_cost = float('inf')`
# `for char_idx in range(26):`
#   `for cons_count in range(1, k + 1):`
#     `min_total_cost = min(min_total_cost, dist[n-1][char_idx][cons_count])`
#
# If `min_total_cost == float('inf')`, return -1. Otherwise, return `min_total_cost`.

```python
import heapq
import collections

# Problem: Shortest Path With At Most K Consecutive Identical Characters
# Link: https://leetcode.com/problems/shortest-path-with-at-most-k-consecutive-identical-characters/

# Approach:
# This problem can be solved using Dijkstra's algorithm on a modified state space.
# The standard Dijkstra's algorithm finds the shortest path from a source to all
# other nodes. Here, we need to consider an additional constraint: the path's
# concatenated labels must not have more than k consecutive identical characters.
#
# To handle this constraint, our state in Dijkstra's algorithm must include not only
# the current node but also information about the immediately preceding character
# and its consecutive count.
#
# A state can be defined as `(current_node, char_at_current_node_idx, consecutive_count_of_that_char)`.
# `char_at_current_node_idx`: The index (0-25) of the character `labels[current_node]`.
# `consecutive_count_of_that_char`: The number of times `labels[current_node]` has appeared
#                                   consecutively ending at `current_node`.
#
# We will use a 3D array `dist[n][26][k+1]` to store the minimum cost to reach a
# specific state. `dist[node_idx][label_char_idx][consecutive_count]` will store the
# minimum total edge weight to reach `node_idx` such that `labels[node_idx]` is the
# `consecutive_count`-th occurrence of the character represented by `label_char_idx`.
#
# The algorithm proceeds as follows:
# 1. Graph Representation: Build an adjacency list where `adj[u]` stores a list of
#    tuples `(v, w)` for edges from `u` to `v` with weight `w`.
# 2. Initialization:
#    - Create a 3D array `dist` of size `n x 26 x (k+1)` and initialize all entries
#      to `float('inf')`.
#    - The starting node is 0. Its initial state is defined by its character and
#      a consecutive count of 1.
#      `start_node = 0`
#      `start_char_idx = ord(labels[start_node]) - ord('a')`
#      Set `dist[start_node][start_char_idx][1] = 0`.
#    - Initialize a min-priority queue (heap) and push the starting state:
#      `(0, start_node, start_char_idx, 1)`. The format is
#      `(current_cost, current_node, char_at_current_node_idx, consecutive_count_at_current_node)`.
# 3. Dijkstra's Algorithm:
#    - While the priority queue is not empty:
#      - Pop the state with the minimum cost: `(cost, u, u_char_idx, u_cons_count)`.
#      - If `cost > dist[u][u_char_idx][u_cons_count]`, continue (we've found a shorter path already).
#      - For each neighbor `v` of `u` with edge weight `w`:
#        - Determine the character index for node `v`: `v_char_idx = ord(labels[v]) - ord('a')`.
#        - Calculate the `new_cons_count_at_v` and `state_char_idx_for_v` for the state at `v`.
#          - If `v_char_idx == u_char_idx`: The character at `v` is the same as at `u`.
#            The consecutive count increases. `new_cons_count_at_v = u_cons_count + 1`.
#            The character type that defines this sequence remains `u_char_idx`.
#            `state_char_idx_for_v = u_char_idx`.
#          - Else (`v_char_idx != u_char_idx`): The character at `v` is different from `u`.
#            A new consecutive sequence begins at `v` with `labels[v]`.
#            `new_cons_count_at_v = 1`.
#            The character type that defines this sequence is `v_char_idx`.
#            `state_char_idx_for_v = v_char_idx`.
#        - If `new_cons_count_at_v <= k`: (Check if the constraint is satisfied)
#          - Calculate the `new_cost = cost + w`.
#          - If `new_cost < dist[v][state_char_idx_for_v][new_cons_count_at_v]`:
#            - Update `dist[v][state_char_idx_for_v][new_cons_count_at_v] = new_cost`.
#            - Push the new state `(new_cost, v, state_char_idx_for_v, new_cons_count_at_v)` onto the priority queue.
# 4. Result:
#    - After Dijkstra's finishes, the minimum cost to reach the destination node `n-1`
#      is the minimum value among all possible states at `n-1`.
#    - Iterate through all character indices (0-25) and all valid consecutive counts (1 to k)
#      for node `n-1` and find the minimum `dist[n-1][char_idx][cons_count]`.
#    - If this minimum cost is still `float('inf')`, it means `n-1` is unreachable under
#      the given constraints, so return -1. Otherwise, return the minimum cost.
#
# Time Complexity:
# - Building adjacency list: O(E), where E is the number of edges.
# - Initialization of `dist` array: O(n * 26 * k).
# - Dijkstra's algorithm:
#   - Number of states = `n * 26 * k`.
#   - Each edge relaxation involves processing neighbors. For each edge `(u, v, w)` in the original graph,
#     we potentially transition from `26 * k` states at `u` to states at `v`.
#   - The number of edges in the state graph is roughly `O(E * 26 * k)`.
#   - Each heap operation (push/pop) takes `O(log(number_of_states))`.
#   - Number of states is `V' = n * 26 * k`.
#   - Total time complexity: `O(E * 26 * k + V' + E' log V')`.
#     Since `E' = O(E * 26 * k)` and `V' = O(n * 26 * k)`, this simplifies to
#     `O(E * 26 * k * log(n * 26 * k))`.
#
# Space Complexity:
# - Adjacency list: O(E).
# - `dist` array: O(n * 26 * k).
# - Priority queue: In the worst case, it can hold `O(n * 26 * k)` states.
# Total space complexity: O(n * 26 * k).
#
# Given n <= 5*10^4, E <= 5*10^4, k <= 50:
# `n * 26 * k` approx `5*10^4 * 26 * 50` approx `6.5 * 10^7`.
# `log(n * 26 * k)` approx `log(6.5 * 10^7)` approx `26`.
# The overall operations might be around `6.5 * 10^7 * 26` which is approximately `1.7 * 10^9`.
# This might be tight for a typical time limit of 1-2 seconds, but this is the standard Dijkstra approach for such problems.

def shortest_path_with_at_most_k_consecutive_identical_characters(n: int, edges: list[list[int]], labels: str, k: int) -> int:
    # Build adjacency list: adj[u] = [(v, w), ...]
    adj = collections.defaultdict(list)
    for u, v, w in edges:
        adj[u].append((v, w))

    # Initialize distance table: dist[node][char_idx][consecutive_count]
    # char_idx: 0-25 for 'a'-'z'
    # consecutive_count: 1 to k
    # Initialize with infinity
    dist = [[[float('inf')] * (k + 1) for _ in range(26)] for _ in range(n)]

    # Priority queue: stores (cost, current_node, char_at_current_node_idx, consecutive_count_at_current_node)
    pq = []

    # Starting node is 0.
    start_node = 0
    start_char_idx = ord(labels[start_node]) - ord('a')

    # The starting node is the first occurrence of its character type.
    dist[start_node][start_char_idx][1] = 0
    heapq.heappush(pq, (0, start_node, start_char_idx, 1))

    while pq:
        cost, u, u_char_idx, u_cons_count = heapq.heappop(pq)

        # If we found a shorter path to this state already, skip.
        if cost > dist[u][u_char_idx][u_cons_count]:
            continue

        # Explore neighbors of node u
        for v, w in adj[u]:
            v_char_idx = ord(labels[v]) - ord('a')

            new_cons_count_at_v = 0
            state_char_idx_for_v = -1 # Character type that forms the sequence ending at v

            if v_char_idx == u_char_idx:
                # The character at v is the same as the character at u.
                # This extends the consecutive sequence of u_char_idx.
                new_cons_count_at_v = u_cons_count + 1
                state_char_idx_for_v = u_char_idx # The sequence type is the same as at u
            else:
                # The character at v is different from the character at u.
                # A new consecutive sequence starts at v with labels[v].
                new_cons_count_at_v = 1
                state_char_idx_for_v = v_char_idx # The sequence type is now v's character

            # Check if the new consecutive count is within the allowed limit k.
            if new_cons_count_at_v <= k:
                new_cost = cost + w

                # If this new path to state (v, state_char_idx_for_v, new_cons_count_at_v) is shorter
                if new_cost < dist[v][state_char_idx_for_v][new_cons_count_at_v]:
                    dist[v][state_char_idx_for_v][new_cons_count_at_v] = new_cost
                    heapq.heappush(pq, (new_cost, v, state_char_idx_for_v, new_cons_count_at_v))

    # Find the minimum cost to reach the destination node (n-1) across all valid states.
    min_total_cost = float('inf')
    destination_node = n - 1

    # Iterate through all possible character types and consecutive counts for the destination node.
    for char_idx in range(26):
        for cons_count in range(1, k + 1):
            min_total_cost = min(min_total_cost, dist[destination_node][char_idx][cons_count])

    # If min_total_cost is still infinity, it means the destination is unreachable.
    if min_total_cost == float('inf'):
        return -1
    else:
        return min_total_cost

```