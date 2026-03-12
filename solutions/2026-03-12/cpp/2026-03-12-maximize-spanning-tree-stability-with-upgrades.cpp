```cpp
// Problem: Maximize Spanning Tree Stability with Upgrades
// Link: https://leetcode.com/problems/maximize-spanning-tree-stability-with-upgrades/
//
// Approach:
// The problem asks to find the maximum possible minimum edge strength in a spanning tree,
// given that some edges must be included, and others can be upgraded to double their strength
// up to a limit 'k'. This problem has a "maximize the minimum" structure, which strongly
// suggests binary search on the answer.
//
// We can binary search for the maximum possible stability value 'X'. For a given 'X', we need
// to check if it's possible to form a spanning tree where every edge has a strength of at least 'X',
// using at most 'k' upgrades.
//
// To check a candidate stability 'X':
// 1. **Mandatory Edges:** All edges with `musti == 1` must be considered. If any mandatory edge
//    has a strength less than 'X', then 'X' is not achievable. Otherwise, these edges are
//    tentatively included. We use a Union-Find data structure to track connected components
//    formed by these mandatory edges.
// 2. **Optional Edges:** For edges with `musti == 0`:
//    - If an edge's strength `si >= X`, it can be included without an upgrade. These are
//      preferable as they don't consume upgrades.
//    - If an edge's strength `si < X`, it *must* be upgraded to `2 * si` to meet the
//      stability requirement. This costs one upgrade. We consider these edges only if `2 * si >= X`.
//
// The `check(X)` function will perform the following:
// - Initialize a Union-Find data structure for 'n' nodes.
// - Initialize `upgrades_needed = 0`.
// - Iterate through all edges:
//   - If `musti == 1`:
//     - If `si < X`, return `false` (cannot achieve stability X).
//     - If `si >= X`, unite the nodes `ui` and `vi` in the Union-Find. If they were already
//       connected, it means this mandatory edge forms a cycle with other mandatory edges.
//       This scenario is tricky. If mandatory edges alone form a cycle before connecting all nodes,
//       then it's impossible. However, the problem states "a spanning tree ... without forming any cycles".
//       If mandatory edges connect already connected components, we should just ignore them if they don't
//       add to connectivity for the purpose of checking *if* a spanning tree can be formed.
//       A simpler approach is to add all mandatory edges first, and if they connect components that are
//       already connected, they are redundant for connectivity purposes but still must be present for the
//       final tree. The critical aspect is whether they create cycles that prevent forming a spanning tree
//       of n-1 edges.
//       A better way to handle mandatory edges: iterate and add them. If `unite` returns false (cycle),
//       and `n` nodes are not yet connected, then it's impossible. We'll count the number of *necessary*
//       mandatory edges for connectivity.
//   - If `musti == 0`:
//     - If `si >= X`, add this edge to a list of "optional but not upgraded" edges.
//     - If `si < X` and `2 * si >= X`, add this edge to a list of "optional but must be upgraded" edges.
//     - If `si < X` and `2 * si < X`, return `false` (cannot achieve stability X even with upgrade).
//
// - After processing all mandatory edges:
//   - Check if `n` nodes are connected. If not, and we still need to add edges, we proceed.
//   - Sort the "optional but must be upgraded" edges by their original strength (ascending) to prioritize
//     using upgrades on weaker edges that still meet the threshold.
//   - Greedily add edges:
//     - First, try to connect components using mandatory edges. Count components.
//     - Then, try to connect components using "optional but not upgraded" edges (strength `si >= X`).
//       Iterate through these edges, and if `unite(ui, vi)` connects two different components, add it.
//       Keep track of the number of edges added (`num_edges`).
//     - If `num_edges < n - 1` and we still need to connect components:
//       - Iterate through "optional but must be upgraded" edges. For each, if `unite(ui, vi)` connects
//         two different components:
//         - Increment `upgrades_needed`.
//         - Increment `num_edges`.
//         - If `upgrades_needed > k`, return `false`.
//
// - Finally, if `num_edges == n - 1` and all nodes are connected (implicitly by `n-1` edges if `n` nodes),
//   return `true`. If after exhausting all possible edges `num_edges < n - 1` or nodes are not connected, return `false`.
//
// Initial check for impossibility:
// - If the number of mandatory edges is already `n-1` and they form cycles, return -1.
// - If after adding all mandatory edges, the graph is not connected, we must rely on optional edges.
//
// Binary Search Range:
// - Lower bound: 1 (minimum possible strength).
// - Upper bound: Max possible strength. An edge can be upgraded once. Max strength is 10^5. Max possible upgraded strength is 2 * 10^5.
//   The maximum possible stability could be the maximum doubled strength of any edge.
//   A safe upper bound is `2 * 10^5 + 1`.
//
// Data Structures:
// - Union-Find: For tracking connected components.
// - Vectors to store mandatory, optional (no upgrade), and optional (upgrade needed) edges.
//
// Refined `check(X)` logic:
// 1. Initialize Union-Find.
// 2. `num_mandatory_edges_for_connectivity = 0`.
// 3. `upgrades_used = 0`.
// 4. `edges_to_consider_for_connectivity`: a list of all edges that can potentially be part of the ST
//    and have strength >= X (either mandatory or optional without upgrade) OR optional with upgrade (2*si >= X).
//    For optional edges with `si < X` and `2*si < X`, immediately return `false`.
//
// 5. Separate edges into two categories:
//    a. `must_include_edges`: `musti == 1`.
//    b. `optional_edges`: `musti == 0`.
//
// 6. First pass: Mandatory edges.
//    - For each edge `[u, v, s, 1]`:
//      - If `s < X`, return `false`.
//      - If `find(u) != find(v)`:
//        - `unite(u, v)`.
//        - `num_mandatory_edges_for_connectivity++`.
//      - Else (cycle among mandatory edges):
//        - If `num_mandatory_edges_for_connectivity < n-1` and the graph is not yet fully connected,
//          this redundant mandatory edge doesn't help connect components but still exists. This needs careful handling.
//          The Union-Find naturally handles cycles by not merging components if `find(u) == find(v)`.
//          The crucial part is `n-1` edges must be selected in total.
//
// 7. Second pass: Optional edges.
//    - Create two lists for optional edges:
//      a. `optional_no_upgrade`: `musti == 0`, `si >= X`.
//      b. `optional_upgrade`: `musti == 0`, `si < X`, `2*si >= X`.
//    - For `optional_upgrade` edges, sort them by original strength `si` (ascending) because we want to use upgrades on weaker edges first.
//
// 8. Connectivity check and upgrade allocation:
//    - Add all `optional_no_upgrade` edges that connect different components using `unite`.
//      `num_edges_added = num_mandatory_edges_for_connectivity`.
//    - While `num_edges_added < n - 1` and there are available edges:
//      - Try to add an edge from `optional_no_upgrade` that connects different components.
//      - If not enough edges from `optional_no_upgrade`, take from `optional_upgrade`:
//        - If `optional_upgrade` is not empty and `upgrades_used < k`:
//          - Take the first edge `[u, v, s, 0]` from sorted `optional_upgrade`.
//          - If `find(u) != find(v)`:
//            - `unite(u, v)`.
//            - `upgrades_used++`.
//            - `num_edges_added++`.
//          - Else (edge doesn't connect new components):
//            - Discard this edge as it's redundant for connectivity.
//        - Else (no more upgrades or edges): break.
//
// 9. Final check: If `num_edges_added == n - 1` (which implies all nodes are connected if `n >= 2`), return `true`. Otherwise, return `false`.
//
// Let's rethink the total number of edges and connected components.
// A spanning tree requires exactly `n-1` edges and must connect all `n` nodes.
//
// `check(X)` function:
// Input: target stability `X`.
// Returns: `true` if a spanning tree with stability `X` is possible using at most `k` upgrades, `false` otherwise.
//
// 1. Initialize `uf` (Union-Find) for `n` nodes.
// 2. `required_upgrades = 0`.
// 3. `edges_count = 0`.
// 4. Create two lists for optional edges:
//    - `can_upgrade`: `musti == 0`, `si < X`, `2 * si >= X`. Store as `[original_strength, u, v]`.
//    - `no_upgrade_or_already_strong`: `musti == 0`, `si >= X`. Store as `[strength, u, v]`.
//
// 5. Process mandatory edges (`musti == 1`):
//    - For each edge `[u, v, s, 1]`:
//      - If `s < X`, return `false` (mandatory edge too weak).
//      - If `uf.find(u) != uf.find(v)`:
//        - `uf.unite(u, v)`.
//        - `edges_count++`.
//      - Else (forms a cycle with other mandatory edges):
//        - This edge is redundant for connectivity but still must be 'part of' the graph.
//        - We need to ensure we can still form `n-1` edges in total without forming extra cycles.
//        - The Union-Find `unite` method returns `false` if a cycle is detected.
//        - The primary constraint is `n-1` edges and connectivity.
//        - If mandatory edges *alone* connect all `n` nodes and `edges_count < n-1`, it means
//          there were redundant mandatory edges that didn't add connectivity. This is fine.
//        - If mandatory edges *alone* form a cycle and `edges_count >= n-1`, then it's impossible.
//        - The critical part is that *if* a mandatory edge creates a cycle *before* all nodes are connected,
//          and `k` is insufficient to bridge the remaining gaps, we fail.
//        - For now, if `uf.unite(u,v)` returns `false` (cycle), we simply don't increment `edges_count`
//          and rely on other edges for connectivity. We need to add `n-1` edges eventually.
//
// 6. Sort `can_upgrade` by `original_strength` (ascending).
//
// 7. Merge and select edges:
//    - Create a combined list of candidate edges for connectivity:
//      - All mandatory edges `[u, v, s, 1]` with `s >= X`.
//      - All `no_upgrade_or_already_strong` edges `[si, u, v]`.
//    - Add these edges to a temporary list and sort them by strength (descending) to greedily pick the strongest ones first.
//    - Iterate through this sorted list:
//      - For edge `[strength, u, v]`:
//        - If `uf.find(u) != uf.find(v)`:
//          - `uf.unite(u, v)`.
//          - `edges_count++`.
//
//    - Now, `edges_count` contains the number of edges added that connect distinct components, considering
//      mandatory edges and optional edges that meet `X` without upgrades.
//    - We still need to add `n - 1 - edges_count` more edges for connectivity.
//
//    - While `edges_count < n - 1` and `required_upgrades < k`:
//      - If `can_upgrade` is empty, break (cannot form ST).
//      - Take the first edge `[original_s, u, v]` from `can_upgrade`.
//      - If `uf.find(u) != uf.find(v)`:
//        - `uf.unite(u, v)`.
//        - `required_upgrades++`.
//        - `edges_count++`.
//      - Else (this edge doesn't connect new components):
//        - Discard it.
//
// 8. Final check:
//    - After the loop, if `edges_count == n - 1`, it means we successfully connected all nodes using `n-1`
//      edges, and `required_upgrades <= k`. Return `true`.
//    - Otherwise, return `false`.
//
// Edge case: If the initial mandatory edges already connect all `n` nodes, `edges_count` would be `n-1`.
// Then we might not need any optional edges for connectivity, but we still must ensure the selected edges form a valid ST.
// The problem implies we need to select *exactly* `n-1` edges.
//
// Let's refine the process for `check(X)`:
// 1. Initialize Union-Find. `num_components = n`.
// 2. `upgrades_needed = 0`.
// 3. `edges_selected = 0`.
// 4. `mandatory_edges_to_consider`: List of `[strength, u, v]` for `musti == 1`.
// 5. `optional_upgradable_edges`: List of `[original_strength, u, v]` for `musti == 0`, `si < X`, `2 * si >= X`.
// 6. `optional_non_upgradable_edges`: List of `[strength, u, v]` for `musti == 0`, `si >= X`.
//
// 7. Process `mandatory_edges_to_consider`:
//    - For each `[s, u, v]`:
//      - If `s < X`, return `false`.
//      - If `uf.find(u) != uf.find(v)`:
//        - `uf.unite(u, v)`.
//        - `edges_selected++`.
//        - `num_components--`.
//      - Else (cycle):
//        - This edge cannot be used for connectivity but still exists conceptually.
//        - We need to ensure we can form exactly `n-1` edges in total. The `edges_selected` count
//          only tracks edges that *add* connectivity.
//
// 8. If `num_components == 1` and `edges_selected < n-1`: This implies we have already connected all nodes
//    using mandatory edges, but `edges_selected` didn't reach `n-1` due to cycles among mandatory edges.
//    This means we have redundant mandatory edges. We need to pick *exactly* `n-1` edges.
//    This logic is getting complicated. The core of ST problems is Kruskal's algorithm logic:
//    Sort edges by weight and add if they don't form a cycle, until `n-1` edges are added.
//
// Let's use the logic of picking edges greedily based on their final strength (or potential final strength).
//
// `check(X)`:
// 1. Initialize `uf`.
// 2. `upgrades_used = 0`.
// 3. `current_edges_in_tree = 0`.
// 4. Create a list `potential_edges` to store edges we *might* use.
//
// 5. Process mandatory edges (`musti == 1`):
//    - For each `[u, v, s, 1]`:
//      - If `s < X`, return `false`.
//      - Add `[s, u, v]` to `potential_edges`.
//
// 6. Process optional edges (`musti == 0`):
//    - For each `[u, v, s, 0]`:
//      - If `s >= X`:
//        - Add `[s, u, v]` to `potential_edges`. (No upgrade needed)
//      - Else if `2 * s >= X`:
//        - Add `[2 * s, u, v]` to `potential_edges`. (Requires upgrade)
//        - Store original `[s, u, v]` to count upgrades later.
//      - Else (`2 * s < X`):
//        - Return `false`. (Cannot reach `X` even with upgrade)
//
// 7. Separate `potential_edges` into two groups:
//    - `must_be_upgraded_list`: `[original_s, u, v]` for optional edges that required upgrade (`s < X` and `2*s >= X`).
//    - `candidates`: `[final_strength, u, v]` for mandatory edges and optional edges that meet `X` without upgrade (`s >= X`).
//
// 8. Sort `must_be_upgraded_list` by `original_strength` (ascending).
//
// 9. Sort `candidates` by `final_strength` (descending).
//
// 10. Greedily build the spanning tree:
//     - Iterate through `candidates`. For each `[strength, u, v]`:
//       - If `uf.find(u) != uf.find(v)`:
//         - `uf.unite(u, v)`.
//         - `current_edges_in_tree++`.
//
//     - Now, `current_edges_in_tree` is the number of components connected using mandatory edges and optional edges that didn't need upgrades.
//     - If `current_edges_in_tree == n - 1`, we have a valid tree using only non-upgraded/mandatory edges. Return `true`.
//
//     - If `current_edges_in_tree < n - 1`, we need to use upgrades.
//     - `remaining_edges_needed = n - 1 - current_edges_in_tree`.
//
//     - Iterate through `must_be_upgraded_list`. For each `[original_s, u, v]`:
//       - If `upgrades_used < k`:
//         - If `uf.find(u) != uf.find(v)`:
//           - `uf.unite(u, v)`.
//           - `upgrades_used++`.
//           - `current_edges_in_tree++`.
//           - If `current_edges_in_tree == n - 1`, return `true`.
//         - Else (edge is redundant for connectivity):
//           - Discard this edge.
//       - Else (`upgrades_used == k`):
//         - Break from this loop (cannot use more upgrades).
//
// 11. Final check: Return `current_edges_in_tree == n - 1`.
//
// This approach seems more robust.
//
// Time Complexity:
// - Binary Search: log(MAX_STRENGTH) iterations. MAX_STRENGTH approx 2 * 10^5.
// - `check(X)` function:
//   - Processing edges: O(E) where E is the number of edges.
//   - Sorting `candidates`: O(E log E).
//   - Sorting `must_be_upgraded_list`: O(E log E).
//   - Union-Find operations: Nearly constant time on average with path compression and union by rank/size. O(E * alpha(N)) where alpha is inverse Ackermann function.
//   - Building the tree: O(E * alpha(N)).
// - Total complexity: O(log(MAX_STRENGTH) * E log E). Given N, E up to 10^5, E log E might be too slow.
//
// Can we optimize `check(X)`?
// The sorting step `O(E log E)` is the bottleneck.
//
// Let's reconsider the selection process within `check(X)`:
//
// `check(X)`:
// 1. Initialize `uf`. `num_components = n`.
// 2. `upgrades_to_make = 0`.
// 3. `edges_in_mst = 0`.
// 4. List `must_upgrade_candidates`: `[original_strength, u, v]` for `musti == 0, si < X, 2*si >= X`.
// 5. List `non_upgrade_candidates`: `[strength, u, v]` for `musti == 1` or (`musti == 0, si >= X`).
//
// 6. Process mandatory edges (`musti == 1`):
//    - For each `[u, v, s, 1]`:
//      - If `s < X`, return `false`.
//      - Add `[s, u, v]` to `non_upgrade_candidates`.
//
// 7. Process optional edges (`musti == 0`):
//    - For each `[u, v, s, 0]`:
//      - If `s >= X`:
//        - Add `[s, u, v]` to `non_upgrade_candidates`.
//      - Else if `2 * s >= X`:
//        - Add `[s, u, v]` to `must_upgrade_candidates`.
//      - Else: return `false`.
//
// 8. Sort `must_upgrade_candidates` by `original_strength` (ascending).
//
// 9. Greedily add non-upgraded/mandatory edges:
//    - Iterate through `non_upgrade_candidates`. For each `[strength, u, v]`:
//      - If `uf.find(u) != uf.find(v)`:
//        - `uf.unite(u, v)`.
//        - `edges_in_mst++`.
//        - `num_components--`.
//
// 10. If `num_components == 1`, we have connected all nodes using only non-upgraded/mandatory edges.
//     Return `edges_in_mst == n - 1`. (This check is important: if mandatory edges connect all nodes but use fewer than n-1 edges due to cycles, we fail).
//
// 11. If `num_components > 1`: We need to use upgrades to connect remaining components.
//     - Iterate through `must_upgrade_candidates`. For each `[original_s, u, v]`:
//       - If `upgrades_to_make < k`:
//         - If `uf.find(u) != uf.find(v)`:
//           - `uf.unite(u, v)`.
//           - `upgrades_to_make++`.
//           - `edges_in_mst++`.
//           - `num_components--`.
//           - If `num_components == 1`, return `true`. (We've formed a spanning tree).
//         - Else (edge redundant for connectivity):
//           - Discard this edge.
//       - Else (`upgrades_to_make == k`):
//         - Break.
//
// 12. Final check: Return `num_components == 1 && edges_in_mst == n - 1`.
//
// The sorting of `non_upgrade_candidates` is still `O(E log E)` if we don't know the final strengths beforehand.
// However, if we are checking stability `X`, mandatory edges have strength `s >= X` and optional non-upgradable have `s >= X`.
// So, we can sort `non_upgrade_candidates` by strength descending. This ensures we pick the strongest available edges first,
// which is the correct greedy strategy for MST.
//
//
// The initial check for connectivity:
// If `n` nodes cannot be connected at all, even with all possible upgrades, then the answer is -1.
// We can do a preliminary check:
// - Construct a graph with all edges.
// - If `k=0`, check if mandatory edges connect the graph. If not, and no optional edges can connect it, it's impossible.
// - If `k > 0`, we can assume `k` is large enough for initial connectivity check.
//   Consider all mandatory edges as having their current strength.
//   Consider all optional edges `[u, v, s, 0]` to have strength `max(s, 2*s)`.
//   Run Kruskal's on these edges to see if `n` nodes can be connected. If not, return -1.
//
// A simpler initial check:
// Construct a graph with only mandatory edges. If they form cycles and don't connect `n` nodes, it's impossible.
// After mandatory edges, consider all optional edges to have their *doubled* strength.
// Run Kruskal's with mandatory edges and optional edges (doubled strength). If it still doesn't connect `n` nodes, return -1.
//
// Let's refine the check function to avoid `O(E log E)` sorting inside the binary search.
//
// `check(X)`:
// 1. Initialize `uf`.
// 2. `upgrades_used = 0`.
// 3. `num_edges = 0`.
// 4. `must_upgrade_edges`: store `[original_strength, u, v]` for `musti == 0, si < X, 2*si >= X`.
// 5. `non_upgrade_candidates`: store `[strength, u, v]` for mandatory edges (`musti == 1, s >= X`) and optional edges (`musti == 0, s >= X`).
//
// 6. Process mandatory edges (`musti == 1`):
//    - For each `[u, v, s, 1]`:
//      - If `s < X`, return `false`.
//      - Add `[s, u, v]` to `non_upgrade_candidates`.
//
// 7. Process optional edges (`musti == 0`):
//    - For each `[u, v, s, 0]`:
//      - If `s >= X`:
//        - Add `[s, u, v]` to `non_upgrade_candidates`.
//      - Else if `2 * s >= X`:
//        - Add `[s, u, v]` to `must_upgrade_edges`.
//      - Else: return `false`.
//
// 8. Sort `must_upgrade_edges` by `original_strength` (ascending).
//
// 9. Greedily add edges from `non_upgrade_candidates` that connect distinct components.
//    To do this efficiently without sorting `non_upgrade_candidates` entirely each time:
//    We need a way to pick the strongest available edges from `non_upgrade_candidates` that connect distinct components.
//    This is where standard Kruskal's sorting comes in.
//    Maybe the `O(E log E)` sort is unavoidable for correctness.
//
// If `N, E <= 10^5`, `E log E` is roughly `10^5 * 17`, which is about `1.7 * 10^6`.
// This might be acceptable if `log(MAX_STRENGTH)` is small.
// `log2(2 * 10^5)` is about 18.
// So `18 * 1.7 * 10^6` is around `3 * 10^7` operations per test case, which might be cutting it close but potentially acceptable.
//
// Let's assume the `O(E log E)` sort per `check` call is OK.
//
// Final Plan for `check(X)`:
//
// `check(X)` function:
// Input: target stability `X`.
// Returns: `true` if a spanning tree with stability `X` is possible using at most `k` upgrades, `false` otherwise.
//
// 1. Initialize `uf` for `n` nodes.
// 2. `upgrades_needed = 0`.
// 3. `edges_in_tree = 0`.
// 4. List `edges_to_consider`: stores `[final_strength, original_strength, u, v, is_mandatory, original_index]`
//    - `final_strength`: strength of the edge in the potential MST.
//    - `original_strength`: original strength of the edge.
//    - `is_mandatory`: 1 if `musti == 1`, 0 if `musti == 0`.
//    - `original_index`: to track which optional edge might need an upgrade.
//
// 5. Populate `edges_to_consider`:
//    - For each edge `[u, v, s, musti]` in `edges`:
//      - If `musti == 1`:
//        - If `s < X`, return `false`.
//        - Add `[s, s, u, v, 1, -1]` to `edges_to_consider`.
//      - Else (`musti == 0`):
//        - If `s >= X`:
//          - Add `[s, s, u, v, 0, original_edge_index]` to `edges_to_consider`.
//        - Else if `2 * s >= X`:
//          - Add `[2 * s, s, u, v, 0, original_edge_index]` to `edges_to_consider`.
//          - This edge *could* be used with strength `2*s`.
//        - Else (`2 * s < X`):
//          - Return `false`.
//
// 6. Now, `edges_to_consider` contains edges. We need to select `n-1` of them.
//    The edges with `final_strength = 2*s` from optional edges are candidates *if* we use an upgrade.
//    The edges with `final_strength = s` are candidates either mandatory or optional not upgraded.
//
//    The challenge is that an edge might be added with `s` or `2*s` depending on whether we have upgrades.
//
//    Let's go back to the list approach:
//
// `check(X)`:
// 1. Initialize `uf`.
// 2. `upgrades_used = 0`.
// 3. `edges_count = 0`.
// 4. List `optional_upgrade_candidates`: `[original_strength, u, v]` for `musti == 0, si < X, 2*si >= X`.
// 5. List `fixed_strength_candidates`: `[strength, u, v]` for mandatory edges (`musti == 1, s >= X`) and optional edges (`musti == 0, s >= X`).
//
// 6. Process mandatory edges:
//    For each `[u, v, s, 1]`:
//      If `s < X`, return `false`.
//      Add `[s, u, v]` to `fixed_strength_candidates`.
//
// 7. Process optional edges:
//    For each `[u, v, s, 0]`:
//      If `s >= X`:
//        Add `[s, u, v]` to `fixed_strength_candidates`.
//      Else if `2 * s >= X`:
//        Add `[s, u, v]` to `optional_upgrade_candidates`.
//      Else: return `false`.
//
// 8. Sort `optional_upgrade_candidates` by `original_strength` (ascending).
//
// 9. Construct a temporary list of edges to consider for MST formation:
//    Combine all edges from `fixed_strength_candidates` and *potentially* edges from `optional_upgrade_candidates`.
//    The `final_strength` of edges from `optional_upgrade_candidates` will be `2 * original_strength`.
//    This means we are essentially creating a list of candidate edges with their *maximum possible strength*
//    if they are to be considered.
//
//    Consider all mandatory edges `[u, v, s, 1]` with `s >= X`.
//    Consider all optional edges `[u, v, s, 0]` with `s >= X`.
//    Consider all optional edges `[u, v, s, 0]` with `s < X` and `2*s >= X`.
//
//    Let's try to build the MST using available resources (upgrades).
//
// `check(X)`:
// 1. Initialize `uf`. `num_components = n`.
// 2. `upgrades_used = 0`.
// 3. `edges_in_mst_count = 0`.
// 4. List `edges_needing_upgrade`: `[original_strength, u, v]` for `musti == 0, si < X, 2*si >= X`.
// 5. List `available_edges`: `[strength, u, v]` for mandatory (`musti==1, s>=X`) and optional (`musti==0, s>=X`).
//
// 6. Populate `edges_needing_upgrade` and `available_edges`:
//    For each `[u, v, s, musti]` in `edges`:
//      If `musti == 1`:
//        If `s < X`, return `false`.
//        Add `[s, u, v]` to `available_edges`.
//      Else (`musti == 0`):
//        If `s >= X`:
//          Add `[s, u, v]` to `available_edges`.
//        Else if `2 * s >= X`:
//          Add `[s, u, v]` to `edges_needing_upgrade`.
//        Else: return `false`.
//
// 7. Sort `edges_needing_upgrade` by `original_strength` (ascending).
//
// 8. Greedily add edges from `available_edges`:
//    - For each `[strength, u, v]` in `available_edges`:
//      - If `uf.find(u) != uf.find(v)`:
//        - `uf.unite(u, v)`.
//        - `edges_in_mst_count++`.
//        - `num_components--`.
//
// 9. If `num_components == 1`: All nodes are connected. Check if `edges_in_mst_count == n - 1`.
//    If yes, return `true`. If no (e.g., `edges_in_mst_count < n-1` due to cycles), return `false`.
//
// 10. If `num_components > 1`: Need to use upgrades.
//     - For each `[original_s, u, v]` in `edges_needing_upgrade`:
//       - If `upgrades_used < k`:
//         - If `uf.find(u) != uf.find(v)`:
//           - `uf.unite(u, v)`.
//           - `upgrades_used++`.
//           - `edges_in_mst_count++`.
//           - `num_components--`.
//           - If `num_components == 1`: return `true`.
//         - Else: discard this edge (redundant).
//       - Else: break (no more upgrades allowed).
//
// 11. Return `num_components == 1 && edges_in_mst_count == n - 1`.
//
// This `check` function performs sorting once (`O(E log E)`) and then `O(E * alpha(N))` operations.
// The overall complexity is `O(log(MAX_STRENGTH) * E log E)`. This is the most likely intended solution.
//
// Need a robust Union-Find implementation.
// Need to handle edge cases where graph is not connected initially.
// If after all mandatory and optional (non-upgraded) edges, the graph is not connected, AND
// we don't have enough upgrades (`k` is small) or `edges_needing_upgrade` is empty, we might fail.
//
// Initial connectivity check:
// - Create a graph with mandatory edges.
// - For optional edges, consider them with strength `max(s, 2*s)`.
// - Run Kruskal's. If it doesn't result in `n-1` edges connecting `n` nodes, return -1.
// This check is also `O(E log E)`. It's done once.
//
// To implement the initial check:
// - Create a list of all edges, with optional edges having their doubled strength.
// - Sort this list by strength.
// - Run Kruskal's. Count edges. If `n-1` edges are selected and `n` components are formed, it's connected.
//
// Let's refine the binary search boundaries.
// `low = 1`.
// `high = 200001`. (Max strength 10^5, doubled 2*10^5)
//
// In `check(X)`:
// If `uf.find(u) != uf.find(v)` and `uf.unite(u, v)` is successful, it means we added an edge that connects two previously disconnected components. `edges_in_mst_count` increases, `num_components` decreases.
// The goal is `num_components == 1` and `edges_in_mst_count == n - 1`.
// The `edges_in_mst_count == n - 1` condition is implicitly handled if `num_components == 1` after `n-1` successful unions in a graph of `n` nodes.
// So, we primarily check `num_components == 1`.
//
// What if `k=0`?
// `check(X)` will only consider mandatory edges and optional edges with `s >= X`.
// If `k=0`, `upgrades_used` can never become `1`.
// The loop for `edges_needing_upgrade` will be skipped if `k=0` and `upgrades_used` starts at `0`.
// This seems to be handled correctly.
//
// Example 3: n = 3, edges = [[0,1,1,1],[1,2,1,1],[2,0,1,1]], k = 0
// Mandatory edges: (0,1,1), (1,2,1), (2,0,1). All have strength 1.
// `check(1)`:
//   `musti=1`, `s=1`. `fixed_strength_candidates` will have these 3 edges.
//   `optional_upgrade_candidates` is empty.
//   `available_edges` = `[[1,0,1], [1,1,2], [1,2,0]]`.
//   Sort `optional_upgrade_candidates` (empty).
//   Greedily add from `available_edges`:
//     `uf.unite(0,1)`, `edges_count=1`, `num_components=2`.
//     `uf.unite(1,2)`, `edges_count=2`, `num_components=1`.
//     Now `num_components == 1`. Check `edges_count == n-1`. `2 == 3-1`. True. So `check(1)` returns true.
//   Binary search finds `ans = 1`.
//
// But the example output is -1. Why?
// "All edges are mandatory and form a cycle, which violates the spanning tree property of acyclicity."
//
// My `check` function counts edges that connect components. If mandatory edges alone form `n-1` such edges and connect `n` components, it's a valid tree.
// The issue is that mandatory edges MUST be included, and if they form a cycle, it's IMPOSSIBLE to form a spanning tree.
//
// Revised `check(X)` logic:
// 1. Initialize `uf`. `num_components = n`.
// 2. `upgrades_used = 0`.
// 3. `edges_for_connectivity = 0`.
// 4. List `must_upgrade_options`: `[original_strength, u, v]` for `musti == 0, si < X, 2*si >= X`.
// 5. List `fixed_edges_for_selection`: `[strength, u, v]` for mandatory (`musti==1, s>=X`) and optional (`musti==0, s>=X`).
//
// 6. Process mandatory edges:
//    For each `[u, v, s, 1]`:
//      If `s < X`, return `false`.
//      Add `[s, u, v]` to `fixed_edges_for_selection`.
//      // Crucial: Check for cycles among mandatory edges *first*
//      If `uf.find(u) != uf.find(v)`:
//        `uf.unite(u, v)`.
//        `edges_for_connectivity++`.
//        `num_components--`.
//      Else:
//        // Mandatory edge forms a cycle with other mandatory edges.
//        // This is only allowed if it doesn't prevent forming a ST of n-1 edges.
//        // If mandatory edges already connected all nodes and we find a cycle,
//        // or if `edges_for_connectivity` exceeds `n-1` and we are still adding mandatory edges.
//        // A simple way is to let uf handle it, and then check total edges selected.
//        pass; // Don't increment edges_for_connectivity, it forms a cycle.
//
// 7. Process optional edges:
//    For each `[u, v, s, 0]`:
//      If `s >= X`:
//        Add `[s, u, v]` to `fixed_edges_for_selection`.
//      Else if `2 * s >= X`:
//        Add `[s, u, v]` to `must_upgrade_options`.
//      Else: return `false`.
//
// 8. Sort `must_upgrade_options` by `original_strength` (ascending).
//
// 9. Greedily add edges from `fixed_edges_for_selection` that connect distinct components.
//    Sort `fixed_edges_for_selection` by strength (descending).
//    For each `[strength, u, v]` in sorted `fixed_edges_for_selection`:
//      If `uf.find(u) != uf.find(v)`:
//        `uf.unite(u, v)`.
//        `edges_for_connectivity++`.
//        `num_components--`.
//
// 10. If `num_components == 1`:
//     All nodes connected. Check if `edges_for_connectivity == n - 1`.
//     If yes, return `true`. If no, it means mandatory edges formed cycles, and we couldn't connect
//     using `n-1` edges that add connectivity. Return `false`.
//
// 11. If `num_components > 1`: Need to use upgrades.
//     - For each `[original_s, u, v]` in `must_upgrade_options`:
//       - If `upgrades_used < k`:
//         - If `uf.find(u) != uf.find(v)`:
//           - `uf.unite(u, v)`.
//           - `upgrades_used++`.
//           - `edges_for_connectivity++`.
//           - `num_components--`.
//           - If `num_components == 1`: return `true`.
//         - Else: discard this edge (redundant).
//       - Else: break (no more upgrades allowed).
//
// 12. Return `num_components == 1 && edges_for_connectivity == n - 1`.
//
// This `check` function now:
// - Sorts `fixed_edges_for_selection` (`O(E log E)`).
// - Sorts `must_upgrade_options` (`O(E log E)`).
// - Union-Find operations (`O(E * alpha(N))`).
//
// The overall complexity remains `O(log(MAX_STRENGTH) * E log E)`.
//
// Initial check for impossibility:
// What if the graph is fundamentally not connectable?
// Example 3 shows a case where mandatory edges form a cycle and cannot form a spanning tree.
// My `check` function would correctly return `false` for any `X >= 1` in Example 3:
// `check(1)`:
//   `fixed_edges_for_selection` = `[[1,0,1], [1,1,2], [1,2,0]]`.
//   `must_upgrade_options` = `[]`.
//   `uf.unite(0,1)`, `edges_for_connectivity=1`, `num_components=2`.
//   `uf.unite(1,2)`, `edges_for_connectivity=2`, `num_components=1`.
//   Now `num_components == 1`. `edges_for_connectivity == 2`. `n-1 == 2`.
//   So `check(1)` returns `true`. This is wrong for Example 3.
//
// The definition of `edges_for_connectivity` is crucial. It should only count edges that are *selected* for the MST and connect different components.
//
// Let's re-evaluate how mandatory edges work.
// If `musti == 1` and an edge `(u, v, s)` forms a cycle with other *already included* mandatory edges, then it's IMPOSSIBLE to form a spanning tree.
//
// Final `check(X)` logic attempt:
//
// `check(X)`:
// 1. Initialize `uf`. `num_components = n`.
// 2. `upgrades_used = 0`.
// 3. `edges_selected_count = 0`.
// 4. List `edges_that_can_be_upgraded`: `[original_strength, u, v]` for `musti == 0, si < X, 2*si >= X`.
// 5. List `edges_available_without_upgrade`: `[strength, u, v]` for mandatory (`musti==1, s>=X`) and optional (`musti==0, s>=X`).
//
// 6. Process mandatory edges first to check for immediate impossibility:
//    For each `[u, v, s, 1]` in `edges`:
//      If `s < X`, return `false`.
//      If `uf.find(u) != uf.find(v)`:
//        `uf.unite(u, v)`.
//        `edges_selected_count++`.
//        `num_components--`.
//      Else:
//        // Mandatory edge forms a cycle. This MST is impossible.
//        return `false`.
//
// 7. Process optional edges:
//    For each `[u, v, s, 0]` in `edges`:
//      If `s >= X`:
//        Add `[s, u, v]` to `edges_available_without_upgrade`.
//      Else if `2 * s >= X`:
//        Add `[s, u, v]` to `edges_that_can_be_upgraded`.
//      Else: return `false`.
//
// 8. Sort `edges_that_can_be_upgraded` by `original_strength` (ascending).
//
// 9. Add edges from `edges_available_without_upgrade` greedily:
//    Sort `edges_available_without_upgrade` by `strength` (descending).
//    For each `[strength, u, v]` in sorted `edges_available_without_upgrade`:
//      If `uf.find(u) != uf.find(v)`:
//        `uf.unite(u, v)`.
//        `edges_selected_count++`.
//        `num_components--`.
//
// 10. If `num_components == 1`:
//     All nodes are connected. We must have used `n-1` edges.
//     Return `edges_selected_count == n - 1`.
//
// 11. If `num_components > 1`: Need to use upgrades.
//     - For each `[original_s, u, v]` in `edges_that_can_be_upgraded`:
//       - If `upgrades_used < k`:
//         - If `uf.find(u) != uf.find(v)`:
//           - `uf.unite(u, v)`.
//           - `upgrades_used++`.
//           - `edges_selected_count++`.
//           - `num_components--`.
//           - If `num_components == 1`: return `true`.
//         - Else: discard this edge (redundant).
//       - Else: break (no more upgrades allowed).
//
// 12. Return `num_components == 1 && edges_selected_count == n - 1`.
//
// This seems to handle Example 3 correctly.
// If `check(1)` is called for Ex3:
// - Mandatory edges: (0,1,1), (1,2,1), (2,0,1). `X=1`.
// - For (0,1,1): `s=1 >= X`. `uf.find(0) != uf.find(1)`. `unite(0,1)`. `edges_selected_count=1`, `num_components=2`.
// - For (1,2,1): `s=1 >= X`. `uf.find(1) != uf.find(2)`. `unite(1,2)`. `edges_selected_count=2`, `num_components=1`.
// - For (2,0,1): `s=1 >= X`. `uf.find(2) == uf.find(0)`. Cycle detected. Return `false`.
// This `check(1)` returns `false`. Binary search will proceed.
// If `check(0)` is called (hypothetically, though `low` is 1):
// `check(0)` would also return `false` due to cycles.
// Thus, for Ex3, no `X >= 1` will pass the `check` if `k=0`.
// The result will be `low - 1`, which is `1 - 1 = 0`. This is not -1.
//
// If no `X` works, the binary search range `[low, high)` will result in `low == high`.
// The `ans` will remain at its initial value. If initial `ans = -1`.
//
// If `check` always returns `false`, `low` will become `high`. The loop terminates when `low >= high`.
// The `ans` will be the last `mid` for which `check(mid)` was true.
// If `check` is never true, `ans` will remain its initial value, say `0`.
//
// After binary search, we need to do a final check. If `ans` is `0` and `check(0)` (hypothetically) failed, it means no stability is possible.
//
// The problem statement guarantees that if a spanning tree is impossible, return -1.
// My current binary search structure will find the maximum `X` for which `check(X)` is true.
// If `check` is never true for `X >= 1`, `ans` would remain `0` (if initialized to `0`).
// We need `ans` initialized to -1.
//
// If `ans` remains -1 after binary search, it means no valid stability was found.
// The `check` function should be sufficient.
// The range of binary search `[1, 200001]`.
// If `check(X)` is always false for `X in [1, 200001]`, then `low` will become `200001`. `ans` will stay `-1`.
// This seems correct.

#include <vector>
#include <numeric>
#include <algorithm>

// Union-Find data structure
struct UnionFind {
    std::vector<int> parent;
    int num_components;

    UnionFind(int n) : num_components(n) {
        parent.resize(n);
        std::iota(parent.begin(), parent.end(), 0); // Initialize parent[i] = i
    }

    // Find the representative of the set containing element i
    // Uses path compression for optimization
    int find(int i) {
        if (parent[i] == i) {
            return i;
        }
        return parent[i] = find(parent[i]); // Path compression
    }

    // Unite the sets containing elements i and j
    // Returns true if i and j were in different sets (union happened), false if they were already in the same set (cycle detected)
    bool unite(int i, int j) {
        int root_i = find(i);
        int root_j = find(j);
        if (root_i != root_j) {
            parent[root_i] = root_j; // Union by rank/size is not implemented here but path compression is enough for typical performance
            num_components--;
            return true;
        }
        return false; // Already in the same set
    }
};

class Solution {
private:
    struct EdgeInfo {
        int u, v, s, musti;
        long long original_strength; // To handle potential upgrades
        int id; // To track original edge index if needed, not strictly used here

        // For sorting by strength
        bool operator<(const EdgeInfo& other) const {
            return original_strength < other.original_strength;
        }
    };

    struct CandidateEdge {
        long long strength; // The strength of the edge if selected for the MST
        int u, v;
        long long original_strength; // Store original strength to check for upgrades

        // For sorting candidates by strength (descending)
        bool operator>(const CandidateEdge& other) const {
            return strength > other.strength;
        }
    };

    // Structure to hold edges that *must* be upgraded to meet stability X
    struct UpgradeCandidate {
        long long original_strength;
        int u, v;

        // For sorting upgrade candidates by original strength (ascending)
        bool operator<(const UpgradeCandidate& other) const {
            return original_strength < other.original_strength;
        }
    };

    // Checks if it's possible to form a spanning tree with stability 'X'
    // using at most 'k' upgrades.
    bool check(int X, int n, const std::vector<std::vector<int>>& edges, int k) {
        UnionFind uf(n);
        int upgrades_used = 0;
        int edges_in_tree_count = 0;

        std::vector<UpgradeCandidate> edges_that_can_be_upgraded;
        std::vector<CandidateEdge> edges_available_without_upgrade;

        // Process all edges to categorize them based on stability 'X'
        for (const auto& edge : edges) {
            int u = edge[0];
            int v = edge[1];
            int s = edge[2];
            int musti = edge[3];

            if (musti == 1) { // Mandatory edge
                if (s < X) {
                    return false; // Mandatory edge too weak for stability X
                }
                // If mandatory edge creates a cycle, MST is impossible
                if (!uf.unite(u, v)) {
                    return false; // Mandatory edge forms a cycle
                }
                edges_available_without_upgrade.push_back({(long long)s, u, v, (long long)s});
                edges_in_tree_count++; // Count this edge as selected for connectivity purposes
            } else { // Optional edge
                if (s >= X) {
                    // Optional edge meets stability X without upgrade
                    edges_available_without_upgrade.push_back({(long long)s, u, v, (long long)s});
                } else if (2LL * s >= X) {
                    // Optional edge can meet stability X by upgrading
                    edges_that_can_be_upgraded.push_back({(long long)s, u, v});
                } else {
                    // Cannot meet stability X even with upgrade
                    return false;
                }
            }
        }

        // Sort upgrade candidates by original strength (ascending) to use upgrades efficiently
        std::sort(edges_that_can_be_upgraded.begin(), edges_that_can_be_upgraded.end());

        // Greedily add edges that are available without upgrade (mandatory and strong optional)
        // Sort these by strength (descending) to pick strongest ones first, like in Kruskal's
        std::sort(edges_available_without_upgrade.begin(), edges_available_without_upgrade.end(), std::greater<CandidateEdge>());

        for (const auto& ce : edges_available_without_upgrade) {
            if (uf.unite(ce.u, ce.v)) {
                // Edge added to connect two components
                // edges_in_tree_count is already incremented for mandatory edges if they connected components.
                // For optional edges added here, they also contribute to connecting components.
                // However, the primary check is `uf.num_components`.
            }
        }

        // If all nodes are already connected by non-upgraded edges
        if (uf.num_components == 1) {
            // We need exactly n-1 edges for a spanning tree.
            // The `edges_in_tree_count` from mandatory edges combined with successful unions from available_edges
            // should be checked against n-1.
            // A simpler check is if num_components == 1 and we used n-1 edges.
            // The `uf.unite` operation correctly tracks connectivity.
            // If `uf.num_components` becomes 1, it implies `n-1` successful unions.
            // The total number of edges selected for connectivity must be n-1.
            // `edges_in_tree_count` currently only accounts for *mandatory* edges that connected components.
            // We need to count *all* edges that connect components.
            // A better approach is to rely on `uf.num_components` reaching 1.
            // For a graph of `n` nodes, `uf.num_components == 1` means exactly `n-1` successful `unite` operations have occurred.
            // The mandatory cycle check already handled impossible scenarios.
            return true; // Successfully formed a spanning tree with stability X using only non-upgraded edges.
        }

        // If not all nodes are connected, use upgrades
        for (const auto& uc : edges_that_can_be_upgraded) {
            if (upgrades_used < k) {
                if (uf.unite(uc.u, uc.v)) {
                    // This upgrade successfully connects two components
                    upgrades_used++;
                    if (uf.num_components == 1) {
                        return true; // All nodes connected, and we used at most k upgrades.
                    }
                }
            } else {
                // Cannot use more upgrades
                break;
            }
        }

        // If after considering all options, not all nodes are connected
        return uf.num_components == 1;
    }


public:
    int maximizeSpanningTreeStability(int n, std::vector<std::vector<int>>& edges, int k) {
        // Binary search for the maximum possible stability value.
        // The stability can range from 1 up to max possible edge strength (max(s, 2*s)).
        // Max strength is 10^5, so max possible stability is around 2 * 10^5.
        int low = 1;
        int high = 200001; // A safe upper bound for possible stability values.
        int max_stability = -1; // Initialize with -1, indicating no valid spanning tree found yet.

        // If n=2 and edges.length=0, impossible to connect.
        // The problem constraints say 2 <= n <= 10^5 and 1 <= edges.length <= 10^5.
        // So edges list is never empty if n >= 2.

        // Preliminary check for fundamental impossibilities.
        // If all mandatory edges form cycles or do not allow connecting the graph.
        // This is implicitly handled by the `check` function, specifically the mandatory edge cycle check.
        // If `check(X)` always returns `false`, `max_stability` will remain -1.

        while (low < high) {
            // `mid` is the target stability value we are checking.
            // We use (low + high + 1) / 2 for ceiling division to ensure `low` advances.
            int mid = low + (high - low) / 2;
            if (check(mid, n, edges, k)) {
                // If stability `mid` is achievable, try for a higher stability.
                max_stability = mid; // `mid` is a possible answer.
                low = mid + 1;       // Try for higher stability.
            } else {
                // If stability `mid` is not achievable, we need to aim lower.
                high = mid; // Try for lower stability.
            }
        }
        
        // After binary search, `max_stability` holds the highest value for which `check` returned true.
        // If `check` was never true, `max_stability` remains -1.
        // However, the binary search logic above might have issues if `check` never returns true.
        // Let's adjust the binary search loop to be more standard.
        
        low = 1;
        high = 200001;
        max_stability = -1;

        while (low < high) {
            int mid = low + (high - low) / 2;
            if (check(mid, n, edges, k)) {
                // mid is achievable, so it's a potential answer.
                // We try to achieve an even higher stability.
                max_stability = mid;
                low = mid + 1;
            } else {
                // mid is not achievable, try a lower stability.
                high = mid;
            }
        }
        
        // A final check for the `low` value might be needed if the loop ends and `low` itself could be the answer.
        // For example, if `check(200000)` is true, `max_stability` becomes `200000`, `low` becomes `200001`.
        // Loop ends `low == high`. `max_stability` is correct.
        // If `check(mid)` is always false, `high` keeps reducing until `high = 1`. `low` stays `1`.
        // Then `mid = 1`, `check(1)` is false. `high` becomes `1`. `low = 1, high = 1`. loop ends. `max_stability` remains -1.
        
        // One final check: if the binary search range exhausted and `max_stability` is still -1,
        // it implies no stability >= 1 was possible. However, the problem asks for -1 if impossible.
        // If `check` is always false, `max_stability` will remain -1. This is the desired behavior.

        // Edge case: If `n=2` and `edges` only contains one mandatory edge that forms a cycle, e.g., `n=2, edges=[[0,0,1,1]], k=0`. This is invalid input though (ui != vi).
        // If `n=3, edges=[[0,1,1,1],[1,0,1,1]], k=0` (duplicate edge logic, not allowed by constraints)
        // The core logic of `check` handles cycles correctly. If mandatory edges form a cycle, `check` returns false.

        return max_stability;
    }
};
```