```python
# Summary: Find the maximum possible minimum edge strength in a spanning tree,
#          given the ability to upgrade optional edges at most once, up to k times.
# Link: https://leetcode.com/problems/maximize-spanning-tree-stability-with-upgrades/
#
# Approach:
# The problem asks for the maximum possible *minimum* strength of an edge in a spanning tree.
# This is a classic characteristic of problems that can be solved using binary search on the answer.
# We can binary search for the maximum possible stability (minimum edge strength).
# For a given 'mid' value (potential stability), we need to check if it's possible to form a
# spanning tree where all edges have a strength of at least 'mid', using at most 'k' upgrades.
#
# The check function:
# 1. Identify 'must-include' edges that satisfy the 'mid' strength requirement. Add them to the Union-Find structure.
# 2. Identify 'optional' edges that satisfy the 'mid' strength requirement (either original or upgraded).
# 3. Sort the optional edges that meet the 'mid' strength requirement (original strength >= mid) by their original strength in ascending order.
# 4. Iterate through these optional edges. If adding an edge does not create a cycle (checked by Union-Find), add it.
# 5. If, after adding all 'must-include' edges and available 'optional' edges (without upgrades), the graph is not connected,
#    we need to use upgrades.
# 6. Sort the optional edges that *don't* meet the 'mid' strength requirement but *do* meet it when upgraded (upgraded strength >= mid).
#    These are the candidates for upgrades. Sort them by the cost of upgrade (which is 1 upgrade, but implicitly by their original strength to prioritize cheaper upgrades first).
# 7. Greedily pick from these upgrade candidates, using up to 'k' upgrades, as long as they connect new components and we have upgrades left.
# 8. After considering mandatory edges, non-upgraded optional edges, and upgraded optional edges, check if we have formed a connected graph with n-1 edges.
#
# Union-Find Structure:
# Used to efficiently check for cycles when adding edges and to track connected components.
#
# Binary Search Range:
# The minimum possible stability can be 0 (or the minimum strength of any edge).
# The maximum possible stability can be twice the maximum initial strength of any edge.
# A safer upper bound is 2 * 10^5 (max initial strength * 2).
#
# Detailed check(threshold):
# - Initialize Union-Find.
# - `num_edges_in_tree = 0`
# - `upgrades_used = 0`
# - `edges_to_consider_for_upgrade = []`
#
# - **Step 1: Mandatory Edges**
#   - For each edge `[u, v, s, must]`:
#     - If `must == 1`:
#       - If `s < threshold`, return `False` immediately (cannot satisfy stability).
#       - If `union(u, v)` connects two different components:
#         - `num_edges_in_tree += 1`
#       - Else (cycle): return `False` (mandatory edges form a cycle).
#
# - **Step 2: Optional Edges (No Upgrade)**
#   - For each edge `[u, v, s, must]`:
#     - If `must == 0` and `s >= threshold`:
#       - If `union(u, v)` connects two different components:
#         - `num_edges_in_tree += 1`
#       - Else (cycle): continue (this edge is not needed to connect, and adding it would form a cycle).
#
# - **Step 3: Optional Edges (Potential Upgrade)**
#   - For each edge `[u, v, s, must]`:
#     - If `must == 0` and `s < threshold`:
#       - Calculate `upgraded_strength = s * 2`
#       - If `upgraded_strength >= threshold`:
#         - Add `(u, v, s)` to `edges_to_consider_for_upgrade`. This edge *could* be upgraded.
#
# - **Step 4: Greedily Use Upgrades**
#   - Sort `edges_to_consider_for_upgrade` by original strength `s` in ascending order. This is to pick edges that are "closest" to meeting the threshold without upgrade, to use upgrades efficiently.
#   - For each edge `(u, v, s)` in `edges_to_consider_for_upgrade`:
#     - If `upgrades_used < k`:
#       - If `union(u, v)` connects two different components:
#         - `num_edges_in_tree += 1`
#         - `upgrades_used += 1`
#       - Else (cycle): continue.
#
# - **Step 5: Final Check**
#   - Return `num_edges_in_tree == n - 1` and `num_components == 1` (implicitly handled by Union-Find `n-1` successful unions).
#   - The Union-Find structure implicitly tracks the number of components. If `num_edges_in_tree == n - 1` after processing, it means all nodes are connected IF the initial graph was connected.
#   - We also need to ensure that `upgrades_used <= k`. This is handled by the `if upgrades_used < k` check.
#
# Time Complexity:
# - Binary Search: `log(max_strength)`.
# - `check(threshold)` function:
#   - Iterating through edges: `O(E)`.
#   - Union-Find operations: `O(alpha(N))` where `alpha` is the inverse Ackermann function, which is nearly constant.
#   - Sorting optional edges for upgrade: `O(E log E)`.
#   - Total for `check`: `O(E log E)`.
# - Overall: `O(log(max_strength) * E log E)`. If we optimize the sorting part within `check` by pre-sorting all optional edges, it can be `O(log(max_strength) * E * alpha(N))`.
#   A more precise look:
#   Inside `check(threshold)`:
#   1. Mandatory edges: `O(E * alpha(N))`
#   2. Optional edges (no upgrade): `O(E * alpha(N))`
#   3. Optional edges (potential upgrade): Collect `O(E)` edges. Sort them `O(E log E)`.
#   4. Use upgrades: Iterate through sorted `edges_to_consider_for_upgrade` (at most `E` edges) `O(E * alpha(N))`.
#   So, `check` is `O(E log E)` due to sorting.
#   Total complexity: `O(log(max_strength) * E log E)`.
#   Given constraints E, N <= 10^5, E log E might be too slow.
#   Let's re-evaluate the `check` function for optimization.
#   If we pre-sort ALL optional edges by their strength once.
#   Then, within `check(threshold)`:
#   1. Mandatory: `O(E * alpha(N))`
#   2. Optional (no upgrade): Iterate through pre-sorted optional edges, take those `s >= threshold`. `O(E * alpha(N))`
#   3. Optional (upgrade): Iterate through pre-sorted optional edges, take those `s < threshold` but `s*2 >= threshold`. Collect these. Sort this sublist. `O(E log E)` still.
#   The critical part is collecting and sorting edges that *need* upgrades.
#   What if we group edges by their potential strength after upgrade?
#
#   A better approach for `check(threshold)`:
#   - Initialize UF.
#   - `num_edges = 0`, `upgrades_used = 0`.
#   - Collect all mandatory edges `must_edges` with `s >= threshold`.
#   - Collect all optional edges `opt_edges` with `s >= threshold`.
#   - Collect all optional edges `upgrade_candidates` with `s < threshold` and `s*2 >= threshold`.
#
#   - **Process `must_edges`**:
#     - For each `(u, v, s)` in `must_edges`:
#       - If `union(u, v)` connects: `num_edges += 1`. Else: return `False`.
#
#   - **Process `opt_edges`**:
#     - Sort `opt_edges` by `s` descending (to pick stronger ones first if needed, but here we just need to connect).
#     - For each `(u, v, s)` in `opt_edges`:
#       - If `union(u, v)` connects: `num_edges += 1`.
#
#   - **Process `upgrade_candidates`**:
#     - Sort `upgrade_candidates` by original strength `s` ascending. These are the edges we might upgrade.
#     - For each `(u, v, s)` in `upgrade_candidates`:
#       - If `upgrades_used < k`:
#         - If `union(u, v)` connects:
#           - `num_edges += 1`
#           - `upgrades_used += 1`
#
#   - Return `num_edges == n - 1`.
#
#   This `check` function still involves sorting `upgrade_candidates`, which can be `O(E log E)` in the worst case.
#   This might still be too slow.
#
#   Alternative `check` function:
#   - Initialize UF.
#   - `num_edges_taken = 0`.
#   - `required_upgrades = 0`.
#
#   - **Phase 1: Mandatory Edges**
#     - For each `[u, v, s, must]` where `must == 1`:
#       - If `s < threshold`, return `False`.
#       - If `union(u, v)` connects two components: `num_edges_taken += 1`.
#       - Else: return `False` (cycle in mandatory edges).
#
#   - **Phase 2: Optional Edges (Strong Enough)**
#     - Create a list `optional_strong_enough` for `[u, v, s]` where `must == 0` and `s >= threshold`.
#     - Sort `optional_strong_enough` by `s` descending. (This is not strictly necessary for correctness, but can be a good heuristic for Kruskal-like processing. However, for just checking connectivity, order doesn't matter here.)
#     - For each `(u, v, s)` in `optional_strong_enough`:
#       - If `union(u, v)` connects: `num_edges_taken += 1`.
#
#   - **Phase 3: Optional Edges (Need Upgrade)**
#     - Create a list `upgrade_candidates` for `[u, v, s]` where `must == 0` and `s < threshold` but `s * 2 >= threshold`.
#     - Sort `upgrade_candidates` by original strength `s` ascending.
#     - For each `(u, v, s)` in `upgrade_candidates`:
#       - If `required_upgrades < k`:
#         - If `union(u, v)` connects:
#           - `num_edges_taken += 1`
#           - `required_upgrades += 1`
#         - Else: continue (adding this edge would form a cycle even with upgrade).
#       - Else: break (ran out of upgrades).
#
#   - **Final Check**:
#     - Return `num_edges_taken == n - 1`.
#
#   The `check` function is still dominated by `O(E log E)` if `upgrade_candidates` can be `O(E)` and need sorting.
#   However, the total number of edges we consider for upgrades that *could* meet the threshold is at most E.
#   If we sort *all* optional edges once by strength at the beginning, then in `check`:
#   - Iterate through mandatory edges: `O(E * alpha(N))`.
#   - Iterate through pre-sorted optional edges:
#     - If `s >= threshold`, add if connects: `O(E * alpha(N))`.
#     - If `s < threshold` and `s*2 >= threshold`, add to a temporary list. `O(E * alpha(N))`.
#   - Sort the temporary list: `O(E log E)`.
#   - Process temporary list: `O(E * alpha(N))`.
#
#   The problem is that `upgrade_candidates` can be `O(E)` and we are sorting it repeatedly.
#   Maybe we don't need to sort `upgrade_candidates` by original strength `s`. What if we sort them by *their doubled strength*? Or any arbitrary order that allows us to greedily pick?
#
#   Consider the `check(threshold)` function again.
#   We need to form a spanning tree using at least `threshold` strength edges.
#   We have:
#   1. `must_edges` where `s >= threshold`. These must be used.
#   2. `optional_edges_ok` where `s >= threshold` and `must == 0`. These can be used.
#   3. `optional_edges_need_upgrade` where `s < threshold`, `s*2 >= threshold`, and `must == 0`. These can be used if upgraded (cost 1 upgrade).
#
#   Algorithm for `check(threshold)`:
#   - Initialize UF, `edges_count = 0`, `upgrades_used = 0`.
#   - Process all `must_edges` with `s >= threshold`. If any `s < threshold` or forms cycle, return `False`. Add successful unions to UF, increment `edges_count`.
#   - Collect all `optional_edges_ok` with `s >= threshold`. Add them to a list `potential_edges`.
#   - Collect all `optional_edges_need_upgrade` with `s < threshold` and `s*2 >= threshold`. Add them to a list `upgrade_candidates`.
#   - Sort `potential_edges` by strength `s` descending (Kruskal's style).
#   - Sort `upgrade_candidates` by original strength `s` ascending.
#
#   - **Add `potential_edges`**:
#     - For `(u, v, s)` in `potential_edges`:
#       - If `union(u, v)` connects: `edges_count += 1`.
#
#   - **Use `upgrade_candidates`**:
#     - For `(u, v, s)` in `upgrade_candidates`:
#       - If `upgrades_used < k`:
#         - If `union(u, v)` connects:
#           - `edges_count += 1`
#           - `upgrades_used += 1`
#       - Else: Break.
#
#   - Return `edges_count == n - 1`.
#
#   The bottleneck is sorting `upgrade_candidates`.
#   What if we gather *all* optional edges that can possibly be part of a solution, with their final strength (original or upgraded).
#   Let's refine the `check` function to avoid explicit sorting of `upgrade_candidates` if possible.
#
#   **Optimized `check(threshold)`:**
#   - Initialize Union-Find structure.
#   - `edges_in_tree = 0`
#   - `upgrades_available = k`
#   - `edges_for_upgrade_candidates = []`
#
#   - **1. Process Mandatory Edges**:
#     - For each edge `[u, v, s, must]` where `must == 1`:
#       - If `s < threshold`: return `False` (cannot meet stability).
#       - If `union(u, v)` connects two components:
#         - `edges_in_tree += 1`
#       - Else: return `False` (cycle formed by mandatory edges).
#
#   - **2. Process Optional Edges (No Upgrade Needed)**:
#     - For each edge `[u, v, s, must]` where `must == 0` and `s >= threshold`:
#       - If `union(u, v)` connects two components:
#         - `edges_in_tree += 1`
#       - Else: continue (edge forms cycle, not needed).
#
#   - **3. Collect Edges for Potential Upgrade**:
#     - For each edge `[u, v, s, must]` where `must == 0` and `s < threshold`:
#       - If `s * 2 >= threshold`:
#         - `edges_for_upgrade_candidates.append((u, v, s))` # Store original strength to distinguish.
#
#   - **4. Use Upgrades Greedily**:
#     - Sort `edges_for_upgrade_candidates` by their original strength `s` in ascending order. This ensures we prioritize upgrading edges that are "closest" to meeting the threshold without upgrade.
#     - For each edge `(u, v, original_strength)` in `edges_for_upgrade_candidates`:
#       - If `upgrades_available > 0`:
#         - If `union(u, v)` connects two components:
#           - `edges_in_tree += 1`
#           - `upgrades_available -= 1`
#       - Else:
#         - Break (no more upgrades available).
#
#   - **5. Final Check**:
#     - Return `edges_in_tree == n - 1`.
#
#   This `check` function has a complexity of `O(E log E)` due to sorting `edges_for_upgrade_candidates`.
#   The binary search calls this function.
#   Total time complexity: `O(log(max_strength) * E log E)`.
#   Given `n, E <= 10^5`, `E log E` is roughly `10^5 * 17`, which is around `1.7 * 10^6`.
#   `log(max_strength)` is about `log(2*10^5)` which is around `18`.
#   Total operations: `18 * 1.7 * 10^6` is roughly `3 * 10^7`. This might be acceptable.
#   If `E` is close to `N^2`, it would be too slow. But `E <= 10^5`.
#
#   Let's double check constraints and potential for TLE.
#   `n <= 10^5`, `edges.length <= 10^5`.
#   `O(log(max_strength) * E log E)` is the most straightforward implementation.
#
#   What if we don't sort `edges_for_upgrade_candidates`?
#   If we process them in any order, and if `union(u, v)` connects, we use an upgrade.
#   This is greedy. Does the order matter?
#   Yes, the order matters for minimizing the number of edges needed to connect components.
#   If we have two edges that need upgrades, say `(u1, v1, s1)` and `(u2, v2, s2)`, and `s1 < s2`.
#   If we upgrade `(u1, v1)` first, and it connects two components, we use 1 upgrade.
#   If we then need to upgrade `(u2, v2)` to connect *other* components, and we have another upgrade, great.
#   If we upgrade `(u2, v2)` first, and it connects two components.
#   It seems sorting by original strength is a good heuristic for which edge *barely* misses the threshold, suggesting it's cheaper to "fix".
#
#   Consider if `k` is very large. We can upgrade many edges.
#   The problem essentially boils down to: what is the minimum strength `S` such that we can form a spanning tree where all edges have strength `>= S`, using at most `k` upgrades on optional edges.
#
#   The Union-Find implementation:
#   `parent` array: `parent[i]` stores the parent of element `i`.
#   `rank` or `size` array: for union by rank/size optimization.
#   `find(i)`: returns the representative of the set containing `i`, with path compression.
#   `union(i, j)`: merges the sets containing `i` and `j`, returns `True` if they were in different sets, `False` otherwise.
#
#   Initial check: Can we even form a spanning tree if all edges are mandatory and selected greedily by strength?
#   This is a basic MST check. If mandatory edges already form cycles, or if after taking all mandatory edges, the remaining graph cannot be connected to form a spanning tree (i.e., not enough edges or components can't be merged), then it's impossible.
#   The `check` function implicitly handles this by ensuring `edges_in_tree == n-1`. If the graph is not connectable at all, `edges_in_tree` will never reach `n-1`.
#
#   If initially, all `must == 1` edges form a cycle, return -1. This can be checked upfront.
#   Or, the `check` function when `threshold` is 0 would implicitly fail if mandatory edges form cycles.
#
#   Maximum possible stability can be 2 * 10^5. Binary search range `[0, 200001]`.
#
#   Let's consider the constraints again. `n, edges.length <= 10^5`.
#   `O(log(max_strength) * E log E)` might be too slow if E is close to 10^5.
#   `log(10^5) \approx 17`. `log(2*10^5) \approx 18`.
#   `18 * 10^5 * 17 \approx 3 \times 10^7`. This is on the edge. It might pass.
#
#   If we can optimize the `check` function to `O(E * alpha(N))`, then total would be `O(log(max_strength) * E * alpha(N))`, which is much better.
#   The bottleneck is the sorting of `edges_for_upgrade_candidates`.
#
#   Can we use counting sort or radix sort if strengths are bounded?
#   Strengths are up to `10^5`. `s*2` up to `2*10^5`.
#   The number of candidates can be `O(E)`.
#
#   Let's consider the sorting of `edges_for_upgrade_candidates` more closely.
#   We need to select up to `k` edges from `edges_for_upgrade_candidates` that, when added, connect distinct components.
#   The sorting by `s` ascending is a greedy strategy.
#   This strategy is similar to Kruskal's algorithm where we sort edges by weight.
#
#   What if we group `edges_for_upgrade_candidates` by their `original_strength`?
#   If `k` is small, we only need a few upgrades.
#   If `k` is large, we can upgrade many edges.
#
#   The `check` function:
#   1. Mandatory edges >= threshold: process them. O(E * alpha(N)).
#   2. Optional edges >= threshold: process them. O(E * alpha(N)).
#   3. Optional edges < threshold but *2 >= threshold: These are candidates.
#      Let's call this list `candidates`.
#
#   The problem is, for a given `threshold`, we need to pick the cheapest upgrades from `candidates` to connect remaining components until we have `n-1` edges.
#   This subproblem itself sounds like a min-cost MST problem if we consider upgrades as having cost 1.
#
#   Let's analyze the maximum number of edges we might need to consider for upgrades.
#   If `k` is large, we might need to pick up to `n-1` edges.
#   The total number of edges considered for upgrades is at most `E`.
#
#   Could there be a scenario where sorting by `s` ascending leads to picking an edge that connects two already-connected components, thus wasting an upgrade that could have been used on a different edge to connect new components?
#   No, because if `union(u, v)` returns `False`, it means `u` and `v` are already in the same component, so we *don't* use an upgrade on that edge. We only use an upgrade if `union(u, v)` returns `True`, meaning it successfully connects two previously disconnected components.
#
#   So, the greedy approach of picking from `edges_for_upgrade_candidates` sorted by original strength `s` ascending, and using an upgrade only if it connects new components, is correct.
#   The complexity remains `O(E log E)` within `check`.
#
#   Consider the case where `k` is large, say `k = n`.
#   This means we can afford to upgrade up to `n` edges.
#   We want to find the maximum `S` such that we can form a spanning tree using edges with strength `>= S` (original or upgraded).
#   The check would be:
#   - Take all mandatory edges `>= S`.
#   - Take optional edges `>= S`.
#   - Take optional edges `< S` but `s*2 >= S`. Upgrading these costs 1. We have `k` such upgrades available.
#
#   What if we iterate on the number of upgrades used, from 0 to `k`?
#   For a fixed number of upgrades `u` (0 <= u <= k):
#   Can we form a spanning tree using `u` upgrades such that all edges have strength at least `threshold`?
#   This would make the check function `O(E)` or `O(E log E)` if we need to pick the best `u` upgrades.
#   Binary searching on `threshold` and then using `k` upgrades greedily seems more promising.
#
#   Let's assume the `O(log(max_strength) * E log E)` approach is intended and might pass.
#
#   A crucial pre-check:
#   If all `must_edges` already form a cycle, or if the number of `must_edges` is greater than `n-1`, then it's impossible.
#   Let's run a quick check for cycles within mandatory edges first.
#   This can be done by iterating through all `must == 1` edges and using Union-Find. If any union operation returns `False`, it's a cycle.
#   If the number of `must == 1` edges is `>= n`, and they don't form a cycle, it's still potentially invalid for a spanning tree (too many edges). However, they might connect different components, and we'd still need to add `n-1 - num_must_edges` more edges.
#   The `check` function should correctly handle this. If `num_must_edges` are added and they form `C` components, we need `n-1 - num_must_edges` more edges.
#   The `check` function counts the total edges added. If it reaches `n-1`, it implies connectivity.
#
#   Final check on the logic for `check(threshold)`:
#   1. Process mandatory edges `m` with `s >= threshold`. Add them if they connect. If `s < threshold` or cycle, return `False`. Count edges.
#   2. Process optional edges `o` with `s >= threshold`. Add them if they connect. Count edges.
#   3. Collect candidates for upgrade `c`: optional edges with `s < threshold` and `s*2 >= threshold`.
#   4. Sort `c` by original `s` ascending.
#   5. Iterate through sorted `c`. If upgrade available and edge connects, use upgrade, count edge, decrement upgrades.
#   6. Return `total_edges == n-1`.
#
#   This seems solid.
#
#   Edge case: `n=2`, `edges = [[0,1,10,1]]`, `k=0`. Output: `10`.
#   `check(10)`: mandatory edge `(0,1,10)` has `s>=10`. Union `0,1`. `edges_in_tree=1`. `n-1 = 1`. Return `True`. BS finds 10.
#
#   Edge case: `n=3`, `edges=[[0,1,2,1],[1,2,3,0]]`, `k=1`. Output: `2`.
#   Binary search for threshold.
#   Try `threshold = 2`:
#     Mandatory `(0,1,2)`: `s=2 >= 2`. Union `0,1`. `edges_in_tree=1`.
#     Optional `(1,2,3)`: `s=3 >= 2`. Union `1,2`. `edges_in_tree=2`.
#     `n-1 = 2`. `edges_in_tree == n-1`. `check(2)` returns `True`.
#   Try `threshold = 3`:
#     Mandatory `(0,1,2)`: `s=2 < 3`. Return `False`.
#   So max stability is 2.
#
#   Edge case: `n=3`, `edges=[[0,1,4,0],[1,2,3,0],[0,2,1,0]]`, `k=2`. Output: `6`.
#   Edges: `(0,1,4,0)`, `(1,2,3,0)`, `(0,2,1,0)`. All optional.
#   BS:
#   Try `threshold = 6`:
#     Mandatory: none.
#     Optional `s>=6`: none.
#     Candidates `s<6` and `s*2>=6`:
#       `(0,1,4)` -> `4*2=8>=6`. Candidate.
#       `(1,2,3)` -> `3*2=6>=6`. Candidate.
#       `(0,2,1)` -> `1*2=2<6`. Not candidate.
#     `edges_for_upgrade_candidates = [(0,2,1), (1,2,3), (0,1,4)]` sorted by original strength: `[(0,2,1), (1,2,3), (0,1,4)]`.
#     `upgrades_available = 2`.
#     Process `(0,2,1)`: `s=1 < 6`, but `s*2=2 < 6`. Wait, the condition is `s < threshold` and `s * 2 >= threshold`.
#     Re-evaluate candidates for `threshold = 6`:
#     Edge `(0,1,4,0)`: `s=4 < 6`. `s*2=8 >= 6`. Candidate: `(0,1,4)`.
#     Edge `(1,2,3,0)`: `s=3 < 6`. `s*2=6 >= 6`. Candidate: `(1,2,3)`.
#     Edge `(0,2,1,0)`: `s=1 < 6`. `s*2=2 < 6`. Not candidate.
#     `edges_for_upgrade_candidates = [(0,2,1), (1,2,3)]` -> Oops, edge `(0,2,1)` should not be included.
#     Correct candidates for `threshold = 6`: `[(1,2,3), (0,1,4)]`.
#     Sorted by original strength: `[(1,2,3), (0,1,4)]`.
#     `upgrades_available = 2`.
#     Process `(1,2,3)`: `union(1,2)`. Connects. `edges_in_tree=1`. `upgrades_available=1`.
#     Process `(0,1,4)`: `union(0,1)`. Connects. `edges_in_tree=2`. `upgrades_available=0`.
#     `n-1 = 2`. `edges_in_tree == n-1`. `check(6)` returns `True`.
#
#   Try `threshold = 7`:
#     Mandatory: none.
#     Optional `s>=7`: none.
#     Candidates `s<7` and `s*2>=7`:
#       `(0,1,4)` -> `4*2=8>=7`. Candidate: `(0,1,4)`.
#       `(1,2,3)` -> `3*2=6<7`. Not candidate.
#       `(0,2,1)` -> `1*2=2<7`. Not candidate.
#     `edges_for_upgrade_candidates = [(0,1,4)]`.
#     `upgrades_available = 2`.
#     Process `(0,1,4)`: `union(0,1)`. Connects. `edges_in_tree=1`. `upgrades_available=1`.
#     Now we have `edges_in_tree = 1`, but `n-1 = 2`. We need one more edge.
#     We ran out of candidates that *can* meet threshold 7.
#     So `check(7)` returns `False` because `edges_in_tree != n-1`.
#   Max stability is 6.
#
#   The approach looks correct.

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.num_components = n

    def find(self, i):
        if self.parent[i] != i:
            self.parent[i] = self.find(self.parent[i]) # Path compression
        return self.parent[i]

    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            # Union by rank
            if self.rank[root_i] < self.rank[root_j]:
                self.parent[root_i] = root_j
            elif self.rank[root_i] > self.rank[root_j]:
                self.parent[root_j] = root_i
            else:
                self.parent[root_j] = root_i
                self.rank[root_i] += 1
            self.num_components -= 1
            return True # Successfully merged
        return False # Already in the same set

class Solution:
    def maximizeSpanningTreeStability(self, n: int, edges: list[list[int]], k: int) -> int:

        # Helper function to check if a given stability threshold is achievable
        def check(threshold):
            uf = UnionFind(n)
            edges_in_tree = 0
            upgrades_used = 0
            
            # List to store optional edges that can meet the threshold only after upgrade
            edges_for_upgrade_candidates = []

            # Phase 1: Process mandatory edges
            # These edges MUST be included. Their strength must meet the threshold.
            for u, v, s, must in edges:
                if must == 1:
                    if s < threshold:
                        return False # Mandatory edge doesn't meet the threshold
                    
                    # Add mandatory edge if it connects two different components
                    if uf.union(u, v):
                        edges_in_tree += 1
                    else:
                        # Cycle formed by mandatory edges, invalid spanning tree structure
                        return False

            # Phase 2: Process optional edges that already meet the threshold
            # These edges can be included if they connect components and don't form cycles.
            for u, v, s, must in edges:
                if must == 0 and s >= threshold:
                    if uf.union(u, v):
                        edges_in_tree += 1
                    # If it forms a cycle, we just don't include it. It's not mandatory.

            # Phase 3: Collect optional edges that *need* an upgrade to meet the threshold
            # Store them along with their original strength for sorting.
            for u, v, s, must in edges:
                if must == 0 and s < threshold:
                    # Check if upgrading this edge makes its strength meet the threshold
                    if s * 2 >= threshold:
                        edges_for_upgrade_candidates.append((u, v, s))

            # Phase 4: Greedily use upgrades on candidate edges
            # Sort candidates by their original strength ascending. This is a greedy strategy:
            # prioritize upgrading edges that are "closest" to meeting the threshold without upgrade.
            # This helps in potentially connecting more components with fewer upgrades.
            edges_for_upgrade_candidates.sort(key=lambda item: item[2]) # Sort by original strength 's'

            for u, v, original_strength in edges_for_upgrade_candidates:
                if upgrades_used < k:
                    # Try to include this edge using an upgrade if it connects new components
                    if uf.union(u, v):
                        edges_in_tree += 1
                        upgrades_used += 1
                    # If uf.union(u,v) returns False, it means adding this upgraded edge would form a cycle,
                    # so we skip it. It's not needed to connect components.
                else:
                    # No more upgrades available, stop considering candidates
                    break

            # A valid spanning tree requires exactly n-1 edges and all nodes connected.
            # The UnionFind structure ensures that if edges_in_tree == n-1, and the initial graph
            # was connectable, then all components are merged.
            return edges_in_tree == n - 1

        # Binary search for the maximum possible stability (minimum edge strength)
        # The minimum possible stability is 0.
        # The maximum possible stability is twice the maximum initial strength of any edge.
        # Max initial strength is 10^5, so max possible upgraded strength is 2*10^5.
        low = 0
        high = 2 * 10**5 + 1 # Upper bound for binary search (exclusive)
        ans = -1

        # Pre-check: Ensure mandatory edges don't form a cycle initially.
        # If they do, it's impossible to form a spanning tree, regardless of stability.
        uf_precheck = UnionFind(n)
        must_edge_count = 0
        for u, v, s, must in edges:
            if must == 1:
                must_edge_count += 1
                if not uf_precheck.union(u, v):
                    # Mandatory edges form a cycle
                    return -1
        
        # If number of mandatory edges is already n-1 and they don't form a cycle, 
        # this is the only possible spanning tree. Its stability is the minimum strength among them.
        # If must_edge_count == n-1 and uf_precheck.num_components == 1:
        #    min_s = float('inf')
        #    for u, v, s, must in edges:
        #        if must == 1:
        #            min_s = min(min_s, s)
        #    return min_s # This scenario is implicitly handled by the BS.

        while low < high:
            mid = (low + high) // 2
            if check(mid):
                # If mid is achievable, it means we can have a stability of at least mid.
                # Try for a higher stability.
                ans = mid
                low = mid + 1
            else:
                # If mid is not achievable, we need a lower stability.
                high = mid

        return ans

```