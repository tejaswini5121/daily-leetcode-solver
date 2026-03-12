```java
// Problem Summary: Maximize the minimum edge strength in a spanning tree by upgrading optional edges.
// Link: https://leetcode.com/problems/maximize-spanning-tree-stability-with-upgrades/
// Approach:
// The problem asks for the maximum possible stability, which is the minimum edge strength in a spanning tree.
// This suggests a binary search approach on the possible values of stability.
// For a given target stability `x`, we need to check if it's possible to form a spanning tree
// where all edges have a strength of at least `x`, using at most `k` upgrades.
//
// To check feasibility for a given `x`:
// 1. Mandatory edges: If a mandatory edge `[u, v, s, 1]` has `s < x`, then `x` is not achievable, so we return false.
//    If `s >= x`, we consider this edge as "taken" without using upgrades.
// 2. Optional edges: For optional edges `[u, v, s, 0]`:
//    - If `s >= x`, this edge can be included without upgrades.
//    - If `s < x`, we can upgrade it to `2 * s`. If `2 * s >= x`, we can use one upgrade to include this edge.
//    - If `2 * s < x`, this edge cannot contribute to stability `x` even with an upgrade.
//
// We can use a Union-Find data structure to keep track of connected components.
//
// The check function for binary search:
// `canAchieve(target_stability, n, edges, k)`
//  - Initialize Union-Find for `n` nodes.
//  - Initialize `upgrades_needed = 0`.
//  - Iterate through mandatory edges:
//    - If `strength < target_stability`, return `false`.
//    - Otherwise, union the two nodes. If they are already in the same set, this indicates a cycle with mandatory edges, return `false`.
//  - Collect optional edges that can contribute to `target_stability`:
//    - If `strength >= target_stability`, add to a list of "free" optional edges.
//    - If `strength < target_stability` AND `2 * strength >= target_stability`, add to a list of "upgradeable" optional edges.
//  - Sort "upgradeable" optional edges by their original strength in ascending order. This is a greedy choice:
//    to satisfy `target_stability` with minimum upgrades, we should prioritize upgrading weaker edges that *can* reach the target.
//  - Iterate through "free" optional edges and union their nodes. If a cycle is formed, return `false`.
//  - Iterate through sorted "upgradeable" optional edges:
//    - If `upgrades_needed < k`:
//      - If unioning the nodes does not form a cycle, increment `upgrades_needed` and union the nodes.
//    - Else (no more upgrades available):
//      - If unioning the nodes does not form a cycle, we cannot include this edge without violating the upgrade limit. Return `false`.
//  - After processing all edges, check if all nodes are connected (i.e., there is only one connected component). If yes, return `true`. Otherwise, return `false`.
//
// The binary search range for stability will be from 0 to 2 * max_strength (or a sufficiently large number).
//
// Time Complexity Analysis:
// - Binary Search: The range of stability is up to 2 * 10^5. The number of iterations is O(log(max_strength)).
// - `canAchieve` function:
//   - Union-Find operations (find, union): Nearly constant time on average with path compression and union by rank/size, O(alpha(n)).
//   - Processing mandatory edges: O(E * alpha(n)), where E is the number of edges.
//   - Collecting and sorting optional edges: O(E log E).
//   - Processing free optional edges: O(E * alpha(n)).
//   - Processing upgradeable optional edges: O(E * alpha(n)).
//   - Overall `canAchieve` complexity: O(E log E) due to sorting.
// - Total time complexity: O(log(max_strength) * E log E). Given E <= 10^5, this might be too slow.
//
// Let's refine the `canAchieve` function for better performance:
//
// Optimized `canAchieve(target_stability, n, edges, k)`:
//  - Initialize Union-Find for `n` nodes.
//  - Initialize `upgrades_needed = 0`.
//  - Store mandatory edges that meet `target_stability` and optional edges that can meet `target_stability` with or without upgrade.
//  - `mandatory_valid_edges`: list of `[u, v]` for mandatory edges with `s >= target_stability`.
//  - `optional_free_edges`: list of `[u, v]` for optional edges with `s >= target_stability`.
//  - `optional_upgradeable_edges`: list of `[u, v, original_strength]` for optional edges with `s < target_stability` and `2 * s >= target_stability`.
//
//  - First, check mandatory edges. If any `s < target_stability`, return `false`.
//  - Process all mandatory valid edges and optional free edges first. Union them. If any cycle is detected here, return `false`.
//  - Sort `optional_upgradeable_edges` by `original_strength` ascending.
//  - Iterate through sorted `optional_upgradeable_edges`:
//    - If `upgrades_needed < k`:
//      - If unioning `u, v` does not form a cycle, increment `upgrades_needed`, union `u, v`.
//    - Else:
//      - If unioning `u, v` does not form a cycle, this edge cannot be taken without exceeding `k` upgrades. Return `false`.
//
//  - After attempting to add all possible edges (mandatory, free optional, and as many upgradeable optional as possible within `k` limit),
//    check if `n-1` edges have been successfully added (implicitly tracked by the number of successful unions) and if all nodes are connected.
//    A simpler check is to count the number of components. If it's 1 and we've used at most `k` upgrades, return `true`.
//    We also need to ensure we form a spanning tree. This means we should add exactly `n-1` edges *if possible*.
//    The Union-Find structure naturally handles this. If we successfully union `n-1` times, we have a spanning tree.
//
// Let's simplify the check: We need to connect `n` nodes using `n-1` edges.
//
// Final `canAchieve(target_stability, n, edges, k)`:
//  - Initialize Union-Find for `n` nodes.
//  - `num_edges_taken = 0`.
//  - `upgrades_used = 0`.
//
//  - Create three lists of edges to consider:
//    - `must_use_edges`: edges `[u, v]` where `musti == 1` and `s >= target_stability`.
//    - `can_use_free`: edges `[u, v]` where `musti == 0`, `s >= target_stability`.
//    - `can_use_upgrade`: edges `[u, v, s]` where `musti == 0`, `s < target_stability`, `2*s >= target_stability`.
//
//  - First, check mandatory edges that *must* be included but don't meet the target:
//    For `[u, v, s, musti]` in `edges`:
//      If `musti == 1` and `s < target_stability`, return `false`.
//
//  - Add all `must_use_edges` to Union-Find. If any forms a cycle, return `false`. Increment `num_edges_taken`.
//  - Add all `can_use_free` edges to Union-Find. If any forms a cycle, return `false`. Increment `num_edges_taken`.
//
//  - Sort `can_use_upgrade` by `s` ascending.
//  - Iterate through sorted `can_use_upgrade`:
//    - If `upgrades_used < k`:
//      - If unioning `u, v` does not form a cycle:
//        - Union `u, v`.
//        - `upgrades_used++`.
//        - `num_edges_taken++`.
//    - Else:
//      - Break (no more upgrades).
//
//  - After processing all edges that can potentially meet the `target_stability` with available upgrades,
//    check if all `n` nodes are connected. This can be done by counting the number of components in Union-Find.
//    We need exactly one component.
//    Also, the number of edges taken should be `n-1` for a spanning tree.
//    Union-Find helps count components. If `UF.get_num_components() == 1` at the end, it means we successfully formed a connected graph.
//    Since we only add edges that don't form cycles, if the graph is connected, it must be a tree (or a forest if not connected).
//    The condition is that all nodes are connected. If `UF.get_num_components() == 1`, it implies we have a connected graph.
//    The number of edges added to achieve this connectivity will be at most `n-1` if no cycles were formed.
//    If `UF.get_num_components() == 1` AND `upgrades_used <= k`, return `true`.
//    Note: If after processing, we still have more than one component, it means we couldn't connect everything.
//
// The number of edges required for a spanning tree is `n-1`.
// So, a more precise check would be:
// `UF.get_num_components() == 1` AND `num_edges_taken == n-1` after processing all candidate edges.
// However, `UF.get_num_components() == 1` *is* the condition for connectivity. If we only add non-cyclic edges,
// the number of edges will naturally be `n-1` for a connected graph of `n` nodes.
//
// Binary Search Range:
// Lower bound: 0.
// Upper bound: A safe upper bound could be twice the maximum possible strength (2 * 10^5) or even larger.
// The maximum possible stability can be formed by upgrading an edge of strength `10^5` to `2 * 10^5`.
// Let's consider `2 * 10^5 + 1` as a safe upper bound for the binary search.
//
// Special Case: What if no spanning tree can be formed at all, even with infinite upgrades?
// This happens if the initial mandatory edges already form disjoint components that cannot be connected by any other edges,
// or if mandatory edges form a cycle.
// The `canAchieve` function implicitly handles this by returning `false` if connectivity isn't achieved.
// If the binary search completes and the best achievable stability is 0 (or the initial lower bound),
// it means we might not be able to connect the graph at all.
// We need a pre-check or a final check to see if the graph is even connectable.
// A simple initial Union-Find pass on all mandatory edges can help. If they form cycles, return -1 immediately.
// If after processing mandatory edges, multiple components exist, and no optional edges can bridge them, then it's impossible.
//
// Pre-check for impossible scenarios:
// 1. Check for cycles formed by mandatory edges.
// 2. After processing all mandatory edges, if `n-1` edges have not been added AND there are still more than one component, it might be impossible.
//    However, the binary search handles this. If `canAchieve` always returns `false` for all `target_stability > 0`, the answer will be -1 (or 0 if 0 is achievable).
//
// Let's refine the `canAchieve` logic for clarity and correctness regarding the number of edges.
//
// `canAchieve(target_stability, n, edges, k)`:
//  - UnionFind uf = new UnionFind(n);
//  - `edges_count = 0`;
//  - `upgrades_needed = 0`;
//
//  - `List<int[]> optional_upgradeable = new ArrayList<>();`
//
//  - // First pass: process mandatory edges and optional edges that meet target strength without upgrade.
//  - For `[u, v, s, musti]` in `edges`:
//    - If `musti == 1`:
//      - If `s < target_stability`, return `false`; // Cannot meet target with mandatory edge
//      - If `uf.union(u, v)` returns `false` (cycle): return `false`; // Cycle with mandatory edges
//      - `edges_count++`;
//    - Else (`musti == 0`):
//      - If `s >= target_stability`:
//        - If `uf.union(u, v)` returns `false` (cycle): return `false`; // Cycle with free optional edges
//        - `edges_count++`;
//      - Else if `2 * s >= target_stability`:
//        - `optional_upgradeable.add(new int[]{u, v, s});` // Edge can be upgraded
//
//  - // Sort upgradeable optional edges by original strength (greedy choice)
//  - `Collections.sort(optional_upgradeable, (a, b) -> a[2] - b[2]);`
//
//  - // Second pass: add upgradeable optional edges if upgrades are available
//  - For `edge` in `optional_upgradeable`:
//    - `u = edge[0], v = edge[1], s = edge[2];`
//    - If `upgrades_needed < k`:
//      - If `uf.union(u, v)` returns `false` (cycle): continue; // Don't add this edge if it forms a cycle
//      - `upgrades_needed++`;
//      - `edges_count++`;
//    - Else:
//      - break; // No more upgrades available
//
//  - // Final check: are all nodes connected?
//  - // A graph with n nodes and n-1 edges is a tree if connected.
//  - // The UnionFind `num_components` will tell us if it's connected.
//  - // We also need to ensure that we have successfully formed a spanning tree,
//  - // meaning we added exactly n-1 edges to connect n nodes.
//  - // If UF.get_num_components() == 1, it means all nodes are connected.
//  - // Since we only added edges that don't form cycles, the number of edges taken
//  - // to connect n nodes will naturally be n-1.
//  - return `uf.get_num_components() == 1`;
//
// The maximum possible strength is 10^5. Upgrading it to 2*10^5.
// So, the binary search range can be [0, 200001].
//
// Initial connectivity check:
// Before binary search, it's good to quickly check if the graph can even be connected.
// If all mandatory edges are processed, and we still have `num_components > 1`, and we cannot use any optional edges to reduce components further, then it's impossible.
//
// Let's refine the pre-check and `canAchieve` function.
//
// The core idea: Binary search for the minimum strength. For a given minimum strength `X`, we must form a spanning tree using edges with strength >= `X`.
// Mandatory edges with strength < `X` make `X` impossible.
// Optional edges with strength < `X` can be upgraded (if `2*strength >= X`) using one upgrade.
//
// `canAchieve(target_stability, n, edges, k)`:
//  - UnionFind uf = new UnionFind(n);
//  - `upgrades_used = 0`;
//  - `edges_considered_for_tree = 0`; // Count of edges that are candidates for the MST
//
//  - // Edges that are mandatory and meet the target stability
//  - `List<int[]> mandatory_valid = new ArrayList<>();`
//  - // Edges that are optional, meet target stability without upgrade
//  - `List<int[]> optional_free = new ArrayList<>();`
//  - // Edges that are optional, need upgrade to meet target stability
//  - `List<int[]> optional_upgradeable = new ArrayList<>();`
//
//  - // Categorize edges
//  - For `[u, v, s, musti]` in `edges`:
//    - If `musti == 1`:
//      - If `s < target_stability`: return `false`; // Mandatory edge too weak
//      - `mandatory_valid.add(new int[]{u, v});`
//    - Else (`musti == 0`):
//      - If `s >= target_stability`:
//        `optional_free.add(new int[]{u, v});`
//      - Else if `2 * s >= target_stability`:
//        `optional_upgradeable.add(new int[]{u, v, s});` // Store original strength
//
//  - // Process mandatory valid edges first
//  - For `edge` in `mandatory_valid`:
//    - If `uf.union(edge[0], edge[1])` returns `false` (cycle): return `false`;
//    - `edges_considered_for_tree++`;
//
//  - // Process optional free edges
//  - For `edge` in `optional_free`:
//    - If `uf.union(edge[0], edge[1])` returns `false` (cycle): return `false`;
//    - `edges_considered_for_tree++`;
//
//  - // Sort optional upgradeable edges by original strength for greedy selection
//  - `Collections.sort(optional_upgradeable, (a, b) -> a[2] - b[2]);`
//
//  - // Process optional upgradeable edges with available upgrades
//  - For `edge` in `optional_upgradeable`:
//    - `u = edge[0], v = edge[1];`
//    - If `upgrades_used < k`:
//      - If `uf.union(u, v)` returns `false` (cycle): continue; // Don't add if it creates a cycle
//      - `upgrades_used++`;
//      - `edges_considered_for_tree++`;
//    - Else:
//      - break; // No more upgrades
//
//  - // Check if a spanning tree is formed: n-1 edges and connected.
//  - // If UF has 1 component, it's connected. Since we only add non-cyclic edges,
//  - // the number of edges for n nodes will be n-1 for a connected graph.
//  - return `uf.get_num_components() == 1`;
//
// What if `n-1` edges cannot be formed? E.g., mandatory edges connect nodes 0-1, 2-3. And no other edges exist.
// In `canAchieve`, if `uf.get_num_components() == 1` is false at the end, it means graph is not connected.
// This function needs to return true ONLY if a spanning tree is possible.
// The condition `uf.get_num_components() == 1` ensures connectivity.
// Since we only add edges that do not form cycles, if the graph is connected, it must be a tree.
// The number of edges added is implicitly managed by the union operations.
//
// Example: n=3, edges = [[0,1,1,1],[1,2,1,1],[2,0,1,1]], k = 0
// Binary search for target_stability = 1.
// `canAchieve(1, 3, edges, 0)`:
//  - mandatory_valid: [0,1], [1,2], [2,0]
//  - optional_free: []
//  - optional_upgradeable: []
//  - Process mandatory_valid:
//    - uf.union(0,1) -> true. edges_considered_for_tree = 1.
//    - uf.union(1,2) -> true. edges_considered_for_tree = 2.
//    - uf.union(2,0) -> false (cycle). Return `false`.
// Correctly returns false.
//
// Example: n=3, edges = [[0,1,2,1],[1,2,3,0]], k = 1
// Binary search range [0, 200001].
// Let's try `target_stability = 2`.
// `canAchieve(2, 3, edges, 1)`:
//  - [0,1,2,1]: mandatory, s=2 >= target=2. `mandatory_valid.add([0,1])`.
//  - [1,2,3,0]: optional, s=3 >= target=2. `optional_free.add([1,2])`.
//  - Process mandatory_valid:
//    - uf.union(0,1) -> true. edges_considered_for_tree = 1. Components: {0,1}, {2}.
//  - Process optional_free:
//    - uf.union(1,2) -> true. edges_considered_for_tree = 2. Components: {0,1,2}.
//  - `optional_upgradeable` is empty.
//  - Return `uf.get_num_components() == 1` -> `true`.
// So, stability 2 is achievable.
//
// Let's try `target_stability = 3`.
// `canAchieve(3, 3, edges, 1)`:
//  - [0,1,2,1]: mandatory, s=2 < target=3. Return `false`.
// So, stability 3 is not achievable.
//
// Binary search will find max possible stability = 2.
//
// What if `n-1` is not met but `uf.get_num_components() == 1`?
// This scenario shouldn't happen if `n >= 2`.
// If `uf.get_num_components() == 1`, it means `n` nodes are connected.
// If `n` nodes are connected using edges without forming cycles, the number of edges MUST be `n-1`.
//
// So, the `canAchieve` logic returning `uf.get_num_components() == 1` seems sufficient.
//
// Final considerations for `canAchieve`:
// - What if `k` is huge?
// - What if `n` is large but `edges.length` is small? (Can be disconnected)
//
// Let's add a UnionFind class.
//
// Time complexity:
// Binary search: log(MAX_STRENGTH).
// `canAchieve`:
//   - Edge categorization: O(E).
//   - Sorting `optional_upgradeable`: O(E log E).
//   - Union-Find operations: O(E * alpha(N)).
// Total `canAchieve`: O(E log E).
// Total: O(log(MAX_STRENGTH) * E log E).
// Given `E <= 10^5`, `E log E` is roughly `10^5 * 17` which is fine.
// `log(2e5)` is about 18. So, `18 * 10^5 * 17` is roughly `3e7` operations, feasible.
//
// Space complexity:
// Union-Find: O(N).
// Lists for edge categorization: O(E).
// Total space: O(N + E).
//
// The problem statement says "If it is impossible to connect all nodes, return -1."
// This means if the graph structure (mandatory edges + all optional edges even with upgrades) cannot form a connected graph, we should return -1.
// Our binary search approach will find the maximum possible stability. If the maximum stability found is 0, it might mean it's impossible to connect or only edges with 0 strength are usable.
// The `canAchieve` function implicitly checks connectivity. If `canAchieve` always returns `false` for `target_stability > 0`, the BS will converge to `ans = 0`.
// After the BS, we need one final check: can the graph be connected *at all*?
//
// Final check for connectivity:
// `check_connectivity(n, edges)`:
//  - UnionFind uf = new UnionFind(n);
//  - For `[u, v, s, musti]` in `edges`:
//    - `uf.union(u, v);`
//  - return `uf.get_num_components() == 1`;
//
// If `!check_connectivity(n, edges)`, then return -1.
// Otherwise, run the binary search.
//
// This pre-check ensures that we don't return a valid stability if the graph is fundamentally disconnected.
//
// Let's re-think the result of binary search.
// BS range: `low = 0`, `high = 200001`.
// `ans = 0`.
// While `low <= high`:
//   `mid = low + (high - low) / 2`.
//   If `canAchieve(mid, n, edges, k)`:
//     `ans = mid`; // `mid` is achievable, try higher stability
//     `low = mid + 1`;
//   Else:
//     `high = mid - 1`; // `mid` is not achievable, try lower stability
//
// After BS, `ans` holds the maximum stability.
// If `ans == 0`, does it mean impossible or that 0 is the max?
// If the graph *is* connectable, and the BS yields `ans = 0`, it means even with all upgrades, the maximum minimum strength is 0. This is unlikely given `s >= 1`.
// If `canAchieve(0, ...)` always returns true (since all edges have strength >= 1, they are >= 0), `ans` will be at least 0.
//
// The problem asks to return -1 if it's impossible to connect all nodes.
// The `check_connectivity` function seems essential.
//
// Let's assume the `check_connectivity` function exists and is called first.
// If it returns `true`, then we proceed with binary search.
// The binary search finds the maximum `target_stability` for which `canAchieve` returns `true`.
// This `target_stability` will be the answer.
// If `check_connectivity` returns `false`, then we return -1.
//
// This makes sense.
//
// What if `n=2`, `edges = [[0,1,1,1]]`, `k=0`.
// `check_connectivity`: Yes, edge [0,1] connects them.
// BS:
// `canAchieve(1, 2, edges, 0)`:
//  - mandatory_valid: [0,1]
//  - Process mandatory_valid: uf.union(0,1) -> true. edges_considered_for_tree = 1.
//  - Return uf.get_num_components() == 1 -> true.
// `ans = 1`. `low = 2`.
// `canAchieve(2, 2, edges, 0)`:
//  - [0,1,1,1]: mandatory, s=1 < target=2. Return `false`.
// `high = 1`.
// Loop ends. `ans = 1`. Correct.
//
// What if `n=3`, `edges = [[0,1,1,1],[1,2,1,1],[2,0,1,1]]`, `k=0`.
// `check_connectivity`:
//  - uf.union(0,1), uf.union(1,2), uf.union(2,0) -> cycle!
//  The `check_connectivity` function should return `false` if cycles are formed by mandatory edges.
//  Actually, `check_connectivity` should just try to union all edges. If it results in 1 component, it's connectable.
//  The issue with mandatory cycles is handled within `canAchieve` when we aim for a specific stability.
//  If `check_connectivity` just unions everything and returns `uf.get_num_components() == 1`.
//  For `[[0,1,1,1],[1,2,1,1],[2,0,1,1]]`:
//  - uf.union(0,1)
//  - uf.union(1,2)
//  - uf.union(2,0) -> cycle. The union function should return false, and the count of edges taken by UF would not increase for this operation.
//  If `check_connectivity` uses a UF where `union` returns false on cycle, then it might incorrectly say disconnected.
//  `check_connectivity` should simply *add* all edges and then check components. The UF structure can handle cycles by not merging nodes if already connected.
//  So, `check_connectivity` is fine.
//  For `[[0,1,1,1],[1,2,1,1],[2,0,1,1]]`:
//  - `check_connectivity` will union all, and `uf.get_num_components()` will be 1. This seems to imply it's connectable.
//  But the problem states "without forming any cycles". So if mandatory edges form a cycle, it's impossible.
//  This implies that `check_connectivity` is not enough.
//  The `canAchieve` logic already handles cycles correctly for specific `target_stability`.
//
//  Let's consider what "impossible to connect all nodes" truly means.
//  It means that even if we use ALL available edges (mandatory and optional, with upgrades), we cannot achieve a state where all nodes are in a single connected component *without forming cycles*.
//
//  So, the problem boils down to:
//  1. Can we form a spanning tree at all?
//     This means: are mandatory edges acyclic? If yes, and if optional edges can bridge remaining components, then yes.
//     The `canAchieve(MAX_STABILITY_UPPER_BOUND, ...)` should give us a hint.
//     If `canAchieve` returns `false` even for a very high `target_stability` (like `200001`), it might imply impossibility, or just that no edge can reach that high.
//
//  The most robust approach:
//  Binary search on stability. The `canAchieve` function must accurately determine if a spanning tree can be formed *for that target stability*.
//  If binary search completes and `ans` is still 0, it could mean that no positive stability is possible.
//  We still need a way to detect if connectivity is impossible in the first place.
//
//  A graph is impossible to connect into a spanning tree if:
//  a) Mandatory edges form a cycle.
//  b) Mandatory edges form multiple components, and there are no optional edges that can bridge them.
//
//  The `canAchieve` function handles case (a) by returning `false` if `uf.union` fails on mandatory edges.
//  It also implicitly handles case (b) by checking `uf.get_num_components() == 1` at the end. If it's > 1, it returns `false`.
//
//  So, if `canAchieve` always returns `false` throughout the binary search (meaning no positive stability is achievable, or even stability 0 isn't achievable which is impossible because `s >= 1`), then `ans` will remain 0.
//  If the BS returns `ans = 0`, does it mean impossible?
//  If `s >= 1` for all edges, then `canAchieve(0, ...)` must be true if connectivity is possible.
//  If `canAchieve(0, ...)` is false, it means connectivity is impossible.
//
//  So, a final check `if (!canAchieve(0, n, edges, k)) return -1;` before the BS might be correct.
//  Or, we can just check the result of BS. If `ans == 0` AND `!canAchieve(0, n, edges, k)`, then return -1.
//  This seems redundant. `canAchieve(0, ...)` will tell us if connectivity is possible.
//
//  Consider the definition: "If it is impossible to connect all nodes, return -1."
//  This check should be independent of stability.
//  Let's implement `can_connect(n, edges)`:
//  - UnionFind uf = new UnionFind(n);
//  - For `[u, v, s, musti]` in `edges`:
//    - If `musti == 1`:
//      - If `uf.union(u, v)` returns `false` (cycle with mandatory): return `false`;
//  - // Now consider optional edges to see if we can connect remaining components
//  - // We need to find the minimum number of upgrades to connect the graph.
//  - // This is complex and might require another search or different logic.
//
//  Perhaps the `canAchieve(target_stability, ...)` function itself is sufficient.
//  If the BS finds a `target_stability > 0` that is achievable, then `ans` will be > 0.
//  If `canAchieve` always returns `false` for all `target_stability > 0`, the BS will yield `ans = 0`.
//  In this case, we need to distinguish between "max stability is 0" and "impossible".
//  The only way `canAchieve` can return `false` for `target_stability = 0` is if:
//    - A mandatory edge has strength < 0 (not possible by constraints).
//    - Mandatory edges form a cycle.
//    - After mandatory edges, remaining components cannot be connected by optional edges (even with upgrades).
//
//  So, if `canAchieve(0, n, edges, k)` returns `false`, it implies impossibility.
//  Let's try this:
//  1. Run `canAchieve(0, n, edges, k)`. If it returns `false`, return -1.
//  2. Otherwise, run binary search for max stability in range `[0, 200001]`.
//     Initialize `ans = 0`.
//     BS loop: if `canAchieve(mid, ...)` is true, `ans = mid`, `low = mid + 1`. Else `high = mid - 1`.
//  3. Return `ans`.
//
//  This seems to cover all cases.
//  `canAchieve(0, ...)`: all edges `s >= 1`, so they are all >= 0. No strength check fails.
//  It then checks for cycles and connectivity. If it returns `false`, it means connectivity is impossible.
//  If it returns `true`, then connectivity is possible, and binary search will find the max stability.
//  If max stability is indeed 0 (e.g., only mandatory edges of strength 1 can connect, and no upgrades possible), BS will correctly yield 0.
//
// UnionFind class will need:
// - `parent` array.
// - `rank` or `size` array for optimization.
// - `num_components` counter.
// - `union(int u, int v)`: returns `true` if merge successful, `false` if `u` and `v` are already connected. Decrements `num_components` on successful merge.
// - `get_num_components()`: returns `num_components`.
//
// `MAX_EDGE_STRENGTH = 100000`. Upper bound for BS: `2 * MAX_EDGE_STRENGTH + 1`.
//
class UnionFind {
    private int[] parent;
    private int[] rank; // Or size
    private int numComponents;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        numComponents = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 0; // Initialize rank to 0
        }
    }

    // Finds the representative of the set containing element i
    // With path compression
    public int find(int i) {
        if (parent[i] != i) {
            parent[i] = find(parent[i]); // Path compression
        }
        return parent[i];
    }

    // Unites the sets containing elements i and j
    // Returns true if they were in different sets and were merged, false otherwise (cycle detected or already connected)
    // Uses union by rank for optimization
    public boolean union(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);

        if (rootI != rootJ) {
            // Union by rank
            if (rank[rootI] < rank[rootJ]) {
                parent[rootI] = rootJ;
            } else if (rank[rootI] > rank[rootJ]) {
                parent[rootJ] = rootI;
            } else {
                parent[rootJ] = rootI;
                rank[rootI]++;
            }
            numComponents--; // Decrement component count if merge was successful
            return true; // Successfully merged
        }
        return false; // i and j are already in the same set (cycle detected if this is an edge)
    }

    // Returns the number of connected components
    public int getNumComponents() {
        return numComponents;
    }
}
```

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Solution {

    // UnionFind class for efficient set operations and connectivity tracking.
    class UnionFind {
        private int[] parent;
        private int[] rank; // Used for union by rank optimization
        private int numComponents; // Tracks the number of disjoint sets (connected components)

        // Constructor: Initializes n disjoint sets, each containing one element.
        public UnionFind(int n) {
            parent = new int[n];
            rank = new int[n];
            numComponents = n; // Initially, each node is its own component.
            for (int i = 0; i < n; i++) {
                parent[i] = i; // Each node is its own parent initially.
                rank[i] = 0;   // Rank is 0 for all nodes initially.
            }
        }

        // Finds the representative (root) of the set containing element 'i'.
        // Implements path compression for optimization.
        public int find(int i) {
            if (parent[i] != i) {
                parent[i] = find(parent[i]); // Path compression: point directly to the root.
            }
            return parent[i];
        }

        // Unites the sets containing elements 'i' and 'j'.
        // Returns true if the union operation successfully merged two different sets.
        // Returns false if 'i' and 'j' were already in the same set, indicating a cycle if this operation represents adding an edge.
        // Implements union by rank for optimization.
        public boolean union(int i, int j) {
            int rootI = find(i);
            int rootJ = find(j);

            if (rootI != rootJ) {
                // Union by rank: attach the shorter tree to the taller tree.
                if (rank[rootI] < rank[rootJ]) {
                    parent[rootI] = rootJ;
                } else if (rank[rootI] > rank[rootJ]) {
                    parent[rootJ] = rootI;
                } else {
                    // If ranks are equal, arbitrarily attach one to the other and increment the rank of the new root.
                    parent[rootJ] = rootI;
                    rank[rootI]++;
                }
                numComponents--; // A successful merge reduces the number of components by one.
                return true; // Successfully merged two different components.
            }
            return false; // 'i' and 'j' are already in the same set, indicates a cycle if this edge were added.
        }

        // Returns the current number of disjoint connected components.
        public int getNumComponents() {
            return numComponents;
        }
    }

    /**
     * Problem Summary: Maximize the minimum edge strength in a spanning tree by upgrading optional edges.
     * Link: https://leetcode.com/problems/maximize-spanning-tree-stability-with-upgrades/
     * Approach Explanation:
     * This problem can be solved using binary search on the answer (the maximum possible stability).
     * For a given target stability `X`, we need to check if it's possible to form a spanning tree
     * where all edges have a strength of at least `X`, using at most `k` upgrades.
     *
     * The `canAchieve(target_stability, n, edges, k)` function performs this check:
     * 1. Mandatory edges (`musti == 1`): If any mandatory edge has strength less than `target_stability`, then `target_stability` is not achievable, return `false`.
     * 2. Optional edges (`musti == 0`):
     *    - If strength `s >= target_stability`, it can be used without upgrades.
     *    - If `s < target_stability` but `2 * s >= target_stability`, it can be used with one upgrade.
     *    - If `2 * s < target_stability`, the edge is unusable for this `target_stability`.
     *
     * We use a Union-Find data structure to build the potential spanning tree.
     * - First, include all mandatory edges that meet the `target_stability`. If any form a cycle, return `false`.
     * - Next, include all optional edges that meet `target_stability` without upgrades. If any form a cycle, return `false`.
     * - Then, consider optional edges that can meet `target_stability` with an upgrade. To greedily use upgrades most effectively, we sort these edges by their original strength in ascending order. We iterate through them and use an upgrade if available (`upgrades_used < k`) and if adding the edge doesn't form a cycle.
     * - Finally, if after considering all possible edges (mandatory, free optional, and upgradeable optional within `k` limit), all `n` nodes are connected (i.e., `uf.getNumComponents() == 1`), then `target_stability` is achievable, and we return `true`. Otherwise, return `false`.
     *
     * Before binary search, we perform an initial check `canAchieve(0, ...)` to determine if the graph is connectable at all. If not, return -1. This handles cases where mandatory edges form cycles or where the graph is fundamentally disconnected.
     *
     * The binary search range for stability is from 0 to `2 * MAX_EDGE_STRENGTH + 1` (e.g., 200001).
     *
     * Time Complexity Analysis:
     * - `canAchieve` function:
     *   - Edge categorization: O(E), where E is the number of edges.
     *   - Sorting upgradeable optional edges: O(E log E).
     *   - Union-Find operations: O(E * alpha(N)), where alpha is the inverse Ackermann function, nearly constant.
     *   - Total for `canAchieve`: O(E log E).
     * - Binary Search: The range of stability is `log(MAX_STRENGTH)`.
     * - Overall Time Complexity: O(log(MAX_STRENGTH) * E log E).
     *
     * Space Complexity Analysis:
     * - Union-Find structure: O(N), where N is the number of nodes.
     * - Lists to store edges: O(E).
     * - Overall Space Complexity: O(N + E).
     *
     * @param n     The number of nodes.
     * @param edges A list of edges, where each edge is [ui, vi, si, musti].
     * @param k     The maximum number of upgrades allowed.
     * @return The maximum possible stability of a valid spanning tree, or -1 if impossible to connect all nodes.
     */
    public int maximizeSpanningTreeStability(int n, List<int[]> edges, int k) {
        // Define a high upper bound for binary search. Max strength is 10^5, so upgraded can be 2*10^5.
        // We add 1 for safety and to ensure the upper bound is inclusive for possible values.
        final int MAX_POSSIBLE_STABILITY = 200001;

        // Initial check: Can the graph be connected at all?
        // We check if it's possible to form a spanning tree with stability 0.
        // This covers cases like mandatory edges forming cycles or graph being disconnected.
        if (!canAchieve(0, n, edges, k)) {
            return -1; // If even stability 0 is not achievable, it's impossible to connect.
        }

        // Binary search for the maximum possible stability.
        int low = 0;
        int high = MAX_POSSIBLE_STABILITY;
        int maxStability = 0; // Initialize maxStability to 0.

        while (low <= high) {
            int mid = low + (high - low) / 2; // Calculate mid point for stability.

            // Check if it's possible to achieve a spanning tree with minimum strength `mid`.
            if (canAchieve(mid, n, edges, k)) {
                // If achievable, `mid` is a possible stability. We try to find a higher one.
                maxStability = mid;   // Update maxStability to the current achievable value.
                low = mid + 1;        // Try for a higher stability.
            } else {
                // If `mid` is not achievable, we need to aim for a lower stability.
                high = mid - 1;       // Try for a lower stability.
            }
        }

        return maxStability; // Return the highest achievable stability found.
    }

    /**
     * Checks if a spanning tree can be formed with a minimum edge strength of `target_stability`,
     * using at most `k` upgrades.
     *
     * @param target_stability The minimum strength required for all edges in the spanning tree.
     * @param n                The number of nodes.
     * @param edges            The list of all available edges.
     * @param k                The maximum number of upgrades allowed.
     * @return True if a spanning tree with at least `target_stability` is possible, false otherwise.
     */
    private boolean canAchieve(int target_stability, int n, List<int[]> edges, int k) {
        UnionFind uf = new UnionFind(n); // Initialize Union-Find for `n` nodes.
        int upgrades_used = 0;         // Counter for upgrades used.
        // Note: We don't explicitly track `edges_count` here.
        // The `uf.getNumComponents() == 1` check at the end implicitly verifies if `n-1` edges
        // were used to connect `n` nodes without cycles, as Union-Find ensures this.

        // Lists to categorize edges based on their ability to meet `target_stability`.
        List<int[]> mandatory_valid = new ArrayList<>();      // Mandatory edges with s >= target_stability.
        List<int[]> optional_free = new ArrayList<>();        // Optional edges with s >= target_stability (no upgrade needed).
        List<int[]> optional_upgradeable = new ArrayList<>(); // Optional edges with s < target_stability but 2*s >= target_stability.

        // --- Step 1: Categorize edges ---
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            int s = edge[2];
            int musti = edge[3];

            if (musti == 1) {
                // Mandatory edge: If its strength is less than the target, this target is impossible.
                if (s < target_stability) {
                    return false;
                }
                // If strength meets target, add to mandatory_valid list.
                mandatory_valid.add(new int[]{u, v});
            } else { // musti == 0 (Optional edge)
                if (s >= target_stability) {
                    // Optional edge meets target strength without upgrade. Add to optional_free.
                    optional_free.add(new int[]{u, v});
                } else if (2 * s >= target_stability) {
                    // Optional edge needs an upgrade to meet target strength. Store original strength for sorting.
                    optional_upgradeable.add(new int[]{u, v, s});
                }
                // If 2*s < target_stability, the edge is unusable for this target stability.
            }
        }

        // --- Step 2: Process mandatory valid edges first ---
        // These edges *must* be in the spanning tree if they meet the target.
        for (int[] edge : mandatory_valid) {
            // If union fails, it means adding this mandatory edge creates a cycle.
            if (!uf.union(edge[0], edge[1])) {
                return false; // Cycle detected with mandatory edges.
            }
        }

        // --- Step 3: Process optional free edges ---
        // These edges meet the target strength without any upgrades.
        for (int[] edge : optional_free) {
            // If union fails, it means adding this free optional edge creates a cycle.
            if (!uf.union(edge[0], edge[1])) {
                return false; // Cycle detected with free optional edges.
            }
        }

        // --- Step 4: Process optional upgradeable edges greedily ---
        // Sort these edges by their original strength in ascending order.
        // This greedy approach ensures that we use upgrades on edges that require less "effort" (original strength)
        // to reach the `target_stability`, maximizing our chances of connecting components.
        Collections.sort(optional_upgradeable, (a, b) -> a[2] - b[2]);

        for (int[] edge : optional_upgradeable) {
            int u = edge[0];
            int v = edge[1];

            // Check if we have upgrades available.
            if (upgrades_used < k) {
                // Try to unite the nodes. If it doesn't form a cycle, use an upgrade.
                if (uf.union(u, v)) {
                    upgrades_used++; // Increment upgrade count.
                }
                // If uf.union(u, v) returns false, it means adding this edge would create a cycle.
                // We simply skip it as it cannot be part of a tree.
            } else {
                // No more upgrades available. We cannot use any more of these upgradeable edges.
                break;
            }
        }

        // --- Step 5: Final Check ---
        // For a spanning tree to exist, all `n` nodes must be connected into a single component.
        // The Union-Find structure tracks the number of components.
        // If `uf.getNumComponents() == 1`, it means all nodes are connected.
        // Since we've only added edges that don't form cycles, connectivity implies a tree.
        return uf.getNumComponents() == 1;
    }
}
```