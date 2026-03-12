/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number} k
 * @return {number}
 */
// Problem Summary: Find the maximum possible minimum edge strength in a spanning tree,
// given some mandatory edges and the ability to upgrade optional edges a limited number of times.
// Link: https://leetcode.com/problems/maximize-spanning-tree-stability-with-upgrades/
// Approach:
// This problem can be solved using binary search on the answer (the maximum possible stability).
// For a given target stability 'x', we need to check if it's possible to form a spanning tree
// where all edges have a strength of at least 'x', using at most 'k' upgrades.
//
// To check a given stability 'x':
// 1. Initialize a Union-Find data structure to keep track of connected components.
// 2. Identify mandatory edges: For all edges with `musti == 1` and `si >= x`, add them to the spanning tree if they don't form a cycle.
//    Count the number of mandatory edges used and the number of upgrades needed.
//    If adding mandatory edges results in a cycle before connecting all nodes, then 'x' is not achievable.
// 3. Identify optional edges: For all edges with `musti == 0` and `si >= x`, these are candidates.
// 4. If `si < x` and `musti == 1`, then 'x' is impossible because a mandatory edge doesn't meet the required strength.
// 5. If `si < x` and `musti == 0`, these edges cannot be upgraded to meet 'x' if `si * 2 < x`.
// 6. Count the number of optional edges that are eligible for upgrading (i.e., `si * 2 >= x` and `musti == 0`).
//    We want to use these upgraded edges to connect the remaining components.
// 7. Calculate the number of additional edges needed to form a spanning tree (`n - 1 - mandatory_edges_count`).
// 8. Calculate the number of available upgrades (`k`).
// 9. If the number of available upgrades is sufficient to cover the required number of additional edges from the eligible optional edges,
//    then 'x' is achievable. Specifically, we need to pick `edges_needed` from the `eligible_optional_edges`.
//    The cost of picking an eligible optional edge is 1 upgrade if `si < x` (it needs to be upgraded) and 0 upgrades if `si >= x` (it's already strong enough).
//    We greedily pick optional edges that require upgrades first, up to 'k' upgrades.
//
// Binary Search Range: The minimum possible stability is 1, and the maximum possible stability can be estimated.
// A safe upper bound would be the maximum possible strength after one upgrade (max(si) * 2) or slightly higher.
// A tighter upper bound can be derived from the maximum possible `si` value.
//
// Union-Find Implementation: Standard Union-Find with path compression and union by rank/size.
//
// Time Complexity:
// - Binary Search: O(log(MaxStrength)) iterations.
// - `check(x)` function:
//   - Iterating through edges: O(E)
//   - Union-Find operations: O(E * alpha(N)), where alpha is the inverse Ackermann function, which is nearly constant.
// - Total Time Complexity: O(E * alpha(N) * log(MaxStrength))
//
// Space Complexity:
// - Union-Find structure: O(N)
// - Storing edges: O(E)
// - Total Space Complexity: O(N + E)
//
// Edge Cases:
// - If mandatory edges form a cycle, or if mandatory edges don't connect all nodes, it might be impossible.
// - If the graph cannot be connected even with all optional edges, return -1.
// - If k is 0, we can only use mandatory edges and optional edges that already meet the strength requirement.
//
// Detailed `check(x)` logic:
// - Initialize `uf` for `n` nodes.
// - `num_edges_in_mst = 0`
// - `upgrades_used = 0`
// - `mandatory_edges_count = 0`
// - `eligible_optional_edges_for_upgrade = []` (store tuples of (original_strength, upgraded_strength) for optional edges where upgraded_strength >= x)
// - `optional_edges_already_strong_enough = 0` (count of optional edges where si >= x)
//
// Phase 1: Process mandatory edges
// For each edge [u, v, s, must]:
//   If `must == 1`:
//     If `s < x`: return `false` (mandatory edge too weak)
//     If `uf.union(u, v)` returns `false` (cycle detected): return `false`
//     `num_edges_in_mst++`
//     `mandatory_edges_count++`
//
// Phase 2: Collect optional edges
// For each edge [u, v, s, must]:
//   If `must == 0`:
//     If `s >= x`:
//       `optional_edges_already_strong_enough++`
//     Else if `s * 2 >= x`: // Can be upgraded to meet strength x
//       `eligible_optional_edges_for_upgrade.push(s)` // Store original strength to know it needs an upgrade
//
// Phase 3: Check connectivity and upgrade feasibility
// If `mandatory_edges_count + optional_edges_already_strong_enough + eligible_optional_edges_for_upgrade.length < n - 1`:
//   // Not enough edges available even if all are used and eligible optional ones are upgraded.
//   // We need to be careful here. We don't necessarily use *all* optional edges.
//   // The goal is to form a spanning tree.
//
// Let's refine Phase 2 and 3:
// `num_components = n`
// `required_edges_to_connect = n - 1`
// `edges_taken = 0`
// `upgrades_available = k`
//
// Initialize `uf` for `n` nodes.
//
// Iterate through edges:
//   If `musti == 1`:
//     If `si < x`: return `false`
//     If `uf.union(ui, vi)` succeeds:
//       `edges_taken++`
//     Else: // Cycle detected among mandatory edges
//       return `false`
//
// Collect eligible optional edges that *can* reach strength 'x' when upgraded:
// `optional_edges_that_can_reach_x = []` // Store original strength
// `optional_edges_already_at_x = []` // Store original strength
//
// For each edge [u, v, s, must]:
//   If `must == 0`:
//     If `s >= x`:
//       `optional_edges_already_at_x.push(s)`
//     Else if `s * 2 >= x`:
//       `optional_edges_that_can_reach_x.push(s)`
//
// Sort `optional_edges_that_can_reach_x` by original strength in descending order.
// This is a greedy choice: upgrading stronger edges first might be beneficial if we need fewer upgrades,
// but here the cost is fixed at 1 upgrade. The order doesn't strictly matter for *counting* feasibility,
// but if we were to select *which* edges, it might. For feasibility, we just need to know if we have enough.
//
// Number of edges needed from optional pool: `edges_needed_from_optional = (n - 1) - edges_taken`
//
// `num_available_for_free = optional_edges_already_at_x.length`
// `num_requiring_upgrade = optional_edges_that_can_reach_x.length`
//
// If `edges_needed_from_optional <= 0`:
//   // All required edges are already included from mandatory ones.
//   // We need to check if all nodes are connected.
//   // The Union-Find `uf` structure already tells us this.
//   // The total number of edges in MST must be `n-1`.
//   // So, if `edges_taken == n - 1`, then it's connected.
//   return `edges_taken == n - 1`;
//
// // We need `edges_needed_from_optional` more edges.
// // We have `num_available_for_free` that don't cost upgrades.
// // We have `num_requiring_upgrade` that cost 1 upgrade each.
//
// `edges_to_take_for_free = min(edges_needed_from_optional, num_available_for_free)`
// `edges_taken += edges_to_take_for_free`
// `edges_needed_from_optional -= edges_to_take_for_free`
//
// If `edges_needed_from_optional > 0`:
//   // We still need more edges. Now we must use upgrades.
//   `upgrades_needed = edges_needed_from_optional`
//   If `upgrades_needed <= k` AND `upgrades_needed <= num_requiring_upgrade`:
//     `edges_taken += upgrades_needed`
//     `upgrades_used += upgrades_needed`
//   Else:
//     return `false` // Not enough upgrades or not enough eligible optional edges
//
// // Final check: Did we form a spanning tree?
// // This means we used exactly `n - 1` edges and all nodes are connected.
// // The Union-Find structure's `num_components` or checking `edges_taken == n - 1` after all unions should suffice.
// // A simpler check is that if we reached this point and `edges_taken` (implicitly, by using required edges)
// // along with selected optional edges, sums up to `n - 1` and all unions were successful, it's connected.
// // If `edges_taken` at the end of this process is exactly `n-1` AND all unions were successful, it implies connectivity.
// // If we returned `true` from `uf.union` for all edges we *intended* to add, then connectivity is implied by `edges_taken == n - 1`.
// // The condition `edges_taken == n - 1` is crucial.
//
// Let's refine the `check` function's structure:
//
// `check(x)`:
//   `uf = new UnionFind(n)`
//   `mst_edges_count = 0`
//   `upgrades_to_spend = k`
//
//   // 1. Process mandatory edges (musti == 1)
//   `mandatory_edges_for_mst = []`
//   For each edge `[u, v, s, must]` in `edges`:
//     If `must == 1`:
//       If `s < x`: return `false` // Mandatory edge too weak
//       `mandatory_edges_for_mst.push([u, v])`
//
//   // Add mandatory edges to UF and count them. Check for cycles.
//   For each `[u, v]` in `mandatory_edges_for_mst`:
//     If `uf.union(u, v)`:
//       `mst_edges_count++`
//     Else:
//       return `false` // Cycle detected among mandatory edges
//
//   // 2. Collect eligible optional edges (musti == 0)
//   `optional_edges_to_consider = []` // Store original strength `s`
//   For each edge `[u, v, s, must]` in `edges`:
//     If `must == 0`:
//       If `s >= x`:
//         `optional_edges_to_consider.push({ strength: s, needs_upgrade: false })`
//       Else if `s * 2 >= x`:
//         `optional_edges_to_consider.push({ strength: s, needs_upgrade: true })`
//
//   // Sort optional edges: prioritize those that don't need upgrades, then those that do.
//   // For feasibility check, order doesn't matter for counts. But if we had different upgrade costs, it would.
//   // Here, all upgrades cost 1. So we can prioritize based on `needs_upgrade`.
//   // It's better to use edges that already meet the strength requirement to save upgrades.
//   `optional_edges_to_consider.sort((a, b) => a.needs_upgrade - b.needs_upgrade);` // false (0) comes before true (1)
//
//   // 3. Add optional edges to form MST
//   For each `edge_info` in `optional_edges_to_consider`:
//     If `mst_edges_count == n - 1`: break // MST is complete
//
//     If `edge_info.needs_upgrade`:
//       If `upgrades_to_spend > 0`:
//         If `uf.union(u, v)`: // Need to find u, v for this edge. Store (u, v, s, must) in optional_edges_to_consider
//           `upgrades_to_spend--`
//           `mst_edges_count++`
//         Else: // Cycle detected
//           continue // Skip this edge, try next
//       Else:
//         continue // Not enough upgrades, skip this edge
//     Else: // Doesn't need upgrade
//       If `uf.union(u, v)`:
//         `mst_edges_count++`
//       Else: // Cycle detected
//         continue // Skip this edge, try next
//
//   // Final check:
//   // We need exactly n-1 edges and all nodes must be connected.
//   // The `uf.is_connected()` check is more robust.
//   // If `mst_edges_count == n - 1` AND `uf.num_components == 1`, then it's a valid MST.
//   // A simpler way to check connectivity if `mst_edges_count == n - 1` is implicitly handled by the algorithm.
//   // If `uf.union` successfully adds `n - 1` edges, connectivity is guaranteed.
//   // The issue is if we can *reach* `n - 1` edges.
//   // The number of components check is the most reliable.
//
//   return `mst_edges_count == n - 1 && uf.num_components == 1`;
//
// Refined `check` logic for clarity:
//
// `check(x)`:
//   `uf = new UnionFind(n)`
//   `current_mst_edges = 0`
//   `upgrades_remaining = k`
//
//   `edges_by_strength = []` // Store [u, v, s, must] for processing
//   For edge `[u, v, s, must]` in `edges`:
//     `edges_by_strength.push([u, v, s, must])`
//
//   // Sort edges primarily by `musti` (mandatory first), then by `strength` (descending)
//   // Sorting helps in processing mandatory edges first and then optional edges greedily.
//   // For optional edges, sorting by strength might not be strictly necessary for feasibility,
//   // but it's good practice for MST algorithms.
//   // The critical part is that mandatory edges *must* be considered first and must meet the threshold.
//
//   // Let's re-evaluate sorting. We need to check if ANY spanning tree exists.
//   // The `check(x)` function needs to be a decision problem: "Can we form an MST with stability >= x?"
//
//   // A more direct approach for `check(x)`:
//   // 1. Greedily add mandatory edges (`musti == 1`) that have `si >= x`.
//   //    If any mandatory edge has `si < x`, return `false`.
//   //    If adding a mandatory edge creates a cycle, return `false`.
//   // 2. Count the number of mandatory edges used (`mandatory_used`).
//   // 3. Identify optional edges (`musti == 0`):
//   //    - `eligible_optional_strong_enough`: edges with `si >= x`. Cost = 0 upgrades.
//   //    - `eligible_optional_upgradeable`: edges with `si < x` but `si * 2 >= x`. Cost = 1 upgrade.
//   // 4. We need `n - 1 - mandatory_used` more edges.
//   // 5. We can take `eligible_optional_strong_enough` edges for free.
//   // 6. We can take up to `k` edges from `eligible_optional_upgradeable` edges, provided we have enough such edges.
//   // 7. The total number of edges we *can* take from optional pool is `num_strong_enough + num_upgradeable`.
//   // 8. The number of edges required from the optional pool is `edges_needed_from_optional = n - 1 - mandatory_used`.
//   // 9. If `edges_needed_from_optional < 0`, it means we have too many mandatory edges, which is fine as long as no cycle.
//   //    If `edges_needed_from_optional <= 0` and `uf.num_components == 1` after adding mandatory edges, return true.
//   // 10. We must pick `edges_needed_from_optional` edges from the optional pool.
//   //     We pick as many as possible from `eligible_optional_strong_enough` first.
//   //     Let `num_free_taken = min(edges_needed_from_optional, num_strong_enough)`.
//   //     Remaining needed: `remaining_needed = edges_needed_from_optional - num_free_taken`.
//   //     If `remaining_needed > 0`:
//   //       We must use upgrades. We need `remaining_needed` upgrades.
//   //       If `remaining_needed <= k` AND `remaining_needed <= num_upgradeable`, then it's possible.
//   //       We also need to ensure that after adding mandatory edges and these chosen optional edges,
//   //       all nodes are connected. This is implicitly handled if we can form `n - 1` edges without cycles.
//
//   // Let's structure `check` again to avoid confusion.
//   // It needs to iterate through *all* edges for `si` checks and to populate potential candidate lists.
//
//   `check(x)`:
//     `uf = new UnionFind(n)`
//     `mandatory_edges_added_count = 0`
//     `upgrades_available = k`
//
//     // Store optional edges that *could* reach strength x
//     `optional_upgradeable_edges = []` // Stores [original_strength, u, v]
//     `optional_strong_enough_edges = []` // Stores [original_strength, u, v]
//
//     // First pass: check mandatory edges and categorize optional ones.
//     for `[u, v, s, must]` in `edges`:
//       if `must == 1`:
//         if `s < x`: return `false` // Mandatory edge too weak
//         // Add to UF. If it forms a cycle, it's impossible for this x.
//         if `uf.union(u, v)`:
//           `mandatory_edges_added_count++`
//         else:
//           return `false` // Cycle detected among mandatory edges
//       else: // must == 0
//         if `s >= x`:
//           `optional_strong_enough_edges.push({ s: s, u: u, v: v })`
//         else if `s * 2 >= x`:
//           `optional_upgradeable_edges.push({ s: s, u: u, v: v })`
//
//     // Number of edges still needed for the MST
//     `edges_needed_from_optional_pool = (n - 1) - mandatory_edges_added_count`
//
//     // If we don't need any more edges (mandatory edges already form a spanning tree)
//     if `edges_needed_from_optional_pool <= 0`:
//       // Check if all nodes are connected
//       return `uf.num_components == 1`;
//
//     // Now, we must pick `edges_needed_from_optional_pool` edges from the optional ones.
//     // Greedily pick optional edges that are already strong enough (cost 0 upgrades).
//     `num_free_edges_taken = Math.min(edges_needed_from_optional_pool, optional_strong_enough_edges.length)`
//     `edges_needed_from_optional_pool -= num_free_edges_taken`
//     // We don't need to actually add these to UF here, just track count.
//     // The subsequent loop will handle adding them and checking for cycles.
//
//     // If we still need more edges, we must use upgrades.
//     if `edges_needed_from_optional_pool > 0`:
//       // We need `edges_needed_from_optional_pool` upgrades.
//       `upgrades_required = edges_needed_from_optional_pool`
//
//       // Check if we have enough upgrades and enough eligible upgradeable edges.
//       if `upgrades_required <= upgrades_available` AND `upgrades_required <= optional_upgradeable_edges.length`:
//         // We can potentially form an MST. Now, actually add the chosen edges and check for connectivity.
//         // We need to add `num_free_edges_taken` and `upgrades_required` edges.
//
//         // To correctly check connectivity, we should add edges in the order that minimizes cycles or connects components.
//         // Let's add edges to the UF in a way that the check function builds a valid MST if possible.
//
//         // Re-initialize UF to build the potential MST for this 'x'.
//         // The previous UF state was only for checking mandatory edges.
//         `uf_for_building_mst = new UnionFind(n)`
//         `current_mst_edges_count = 0`
//         `upgrades_spent_for_building = 0`
//
//         // Re-add mandatory edges.
//         for `[u, v, s, must]` in `edges`:
//           if `must == 1`:
//             if `uf_for_building_mst.union(u, v)`:
//               `current_mst_edges_count++`
//             // else: cycle check already done, so this should succeed
//
//         // Add optional edges that are strong enough (cost 0 upgrades)
//         for `edge` in `optional_strong_enough_edges`:
//           if `current_mst_edges_count == n - 1`: break
//           if `uf_for_building_mst.union(edge.u, edge.v)`:
//             `current_mst_edges_count++`
//
//         // Add optional edges that need upgrades (cost 1 upgrade each), up to the required count and available upgrades.
//         // Sort `optional_upgradeable_edges` to pick efficiently. Sorting by original strength descending
//         // might be good, though not strictly necessary for feasibility of count.
//         `optional_upgradeable_edges.sort((a, b) => b.s - a.s);` // Sort by strength descending
//
//         let `upgrade_candidates_to_take = Math.min(edges_needed_from_optional_pool, optional_upgradeable_edges.length);`
//
//         for `i` from 0 to `upgrade_candidates_to_take - 1`:
//           if `current_mst_edges_count == n - 1`: break
//           let `edge = optional_upgradeable_edges[i]`
//           if `uf_for_building_mst.union(edge.u, edge.v)`:
//             `current_mst_edges_count++`
//             `upgrades_spent_for_building++`
//           // else: cycle, skip this edge
//
//         // Final check: Did we form a valid MST?
//         // This means we used exactly n-1 edges and all nodes are connected.
//         return `current_mst_edges_count == n - 1 && uf_for_building_mst.num_components == 1`;
//       else:
//         return `false` // Not enough upgrades or not enough eligible edges for upgrades
//     else: // `edges_needed_from_optional_pool` is 0 or less (already handled)
//       // This path is covered by `if (edges_needed_from_optional_pool <= 0)`
//       // If we reach here, it implies `edges_needed_from_optional_pool` was exactly 0 or less.
//       // The condition `uf.num_components == 1` is the definitive check.
//       return `uf.num_components == 1`;
//
// The `check` function can be simplified by NOT re-initializing UF.
// The primary goal is to see if `n-1` edges CAN be formed.
//
// `check(x)`:
//   `uf = new UnionFind(n)`
//   `edges_in_mst_count = 0`
//   `upgrades_available = k`
//
//   `optional_upgradeable_edges_with_uv = []` // Stores {s, u, v}
//   `optional_strong_enough_with_uv = []`    // Stores {s, u, v}
//
//   // Phase 1: Process mandatory edges and categorize optional ones.
//   for `[u, v, s, must]` in `edges`:
//     if `must == 1`:
//       if `s < x`: return `false` // Mandatory edge too weak
//       if `uf.union(u, v)`:
//         `edges_in_mst_count++`
//       else:
//         return `false` // Cycle detected among mandatory edges
//     else: // must == 0
//       if `s >= x`:
//         `optional_strong_enough_with_uv.push({s: s, u: u, v: v})`
//       else if `s * 2 >= x`:
//         `optional_upgradeable_edges_with_uv.push({s: s, u: u, v: v})`
//
//   // Phase 2: Determine how many more edges are needed.
//   `edges_needed_from_optional = (n - 1) - edges_in_mst_count`
//
//   // If all nodes are already connected by mandatory edges
//   if `edges_needed_from_optional <= 0`:
//     return `uf.num_components == 1`
//
//   // Phase 3: Try to fulfill the need using optional edges.
//   // Greedily use optional edges that are already strong enough.
//   `free_edges_to_take = Math.min(edges_needed_from_optional, optional_strong_enough_with_uv.length)`
//   `edges_needed_from_optional -= free_edges_to_take`
//
//   // If more edges are still needed, use upgradeable optional edges.
//   if `edges_needed_from_optional > 0`:
//     `upgrades_required = edges_needed_from_optional`
//
//     // Check if we have enough upgrades and enough eligible edges for upgrade.
//     if `upgrades_required <= upgrades_available` AND `upgrades_required <= optional_upgradeable_edges_with_uv.length`:
//       // It's POSSIBLE to get the required number of edges.
//       // We don't need to actually perform unions for *all* possible edges in `check`.
//       // The fact that we have enough *available* edges that meet the criteria (strength or upgradeable)
//       // and enough upgrades, means it is *possible* to form an MST.
//       // The unions performed earlier (for mandatory) combined with the *count* of optional edges that could be added
//       // will imply connectivity IF we can reach `n-1` edges.
//       //
//       // The most robust check for `check(x)` is:
//       // Can we select `n-1` edges from the graph such that:
//       // 1. All selected mandatory edges have strength >= x.
//       // 2. All selected optional edges have strength >= x (either originally or after upgrade).
//       // 3. The total number of selected optional edges that required upgrade is <= k.
//       // 4. The selected edges form a connected graph spanning all n nodes.
//
//       // The crucial part missing from the simplified `check` is ensuring connectivity is *achieved*.
//       // We MUST perform unions for the chosen edges.
//       // So the `uf_for_building_mst` approach was more correct.
//
//       // Let's go back to the `uf_for_building_mst` idea.
//
//       `uf_build = new UnionFind(n)`
//       `edges_added_count = 0`
//       `upgrades_used_in_build = 0`
//
//       // Add mandatory edges (we already know they are >= x and don't form cycles among themselves)
//       for `[u, v, s, must]` in `edges`:
//         if `must == 1`:
//           if `uf_build.union(u, v)`:
//             `edges_added_count++`
//
//       // Add optional edges that are already strong enough
//       for `edge` in `optional_strong_enough_with_uv`:
//         if `edges_added_count == n - 1`: break
//         if `uf_build.union(edge.u, edge.v)`:
//           `edges_added_count++`
//
//       // Add optional edges that need upgrades, up to the limit.
//       // Sort them to pick the best ones if needed (though here cost is uniform).
//       `optional_upgradeable_edges_with_uv.sort((a, b) => b.s - a.s);` // Sort by strength descending
//
//       let `num_upgradeable_to_take = Math.min(edges_needed_from_optional, optional_upgradeable_edges_with_uv.length);`
//
//       for `i` from 0 to `num_upgradeable_to_take - 1`:
//         if `edges_added_count == n - 1`: break
//         let `edge = optional_upgradeable_edges_with_uv[i]`
//         if `uf_build.union(edge.u, edge.v)`:
//           `edges_added_count++`
//           `upgrades_used_in_build++`
//         // else: cycle, skip
//
//       // Final check for this 'x':
//       // Did we manage to add exactly n-1 edges AND are all nodes connected?
//       return `edges_added_count == n - 1 && uf_build.num_components == 1`;
//
//     else:
//       return `false` // Not enough upgrades or eligible edges for upgrades
//
//   else: // `edges_needed_from_optional` is 0 or less (handled by `edges_needed_from_optional <= 0` check)
//     // This means mandatory edges already connected everything, or we needed 0 more edges.
//     return `uf.num_components == 1`;
//
// This `check` function seems robust.
//
// The Union-Find class:
// `parent`: array to store parent of each node. `parent[i] = i` initially.
// `rank` or `size`: for optimization. Let's use `size` (number of nodes in the component).
// `num_components`: initially `n`. Decrements on successful union.
//
// `find(i)`: Returns representative of set containing `i`. With path compression.
// `union(i, j)`: Merges sets containing `i` and `j`. Returns `true` if merged, `false` if already in the same set (cycle). Uses union by size.
//
// Binary Search Range:
// Lower bound `low = 1`.
// Upper bound `high = 1e5 * 2 + 1` (max strength 1e5, can be upgraded to 2e5). A bit more than that for safety.
// Max possible `si` is 10^5. Max possible strength is 2 * 10^5.
// A safe `high` can be `200001`. Or find max `si` from input and multiply by 2.
// `max_s = 0`; for `[u, v, s, must]` in `edges`: `max_s = Math.max(max_s, s);`
// `high = max_s * 2 + 1`.
//
// Initial check for connectivity:
// Before binary search, run a basic MST algorithm (Kruskal's or Prim's) on all edges *without* upgrades.
// If this graph is not connected, then no spanning tree is possible, return -1.
// This can be done by creating a UF and adding all edges. If after processing all edges, `uf.num_components > 1`, return -1.
//
// Edge case: `k=0`. The check function will work correctly. `upgrades_available` will be 0.
// If `s * 2 < x`, these edges won't be considered for upgrading, which is correct.
//
// Final Algorithm Structure:
// 1. Initialize `max_s = 0`. Find max strength from `edges`.
// 2. Initialize `low = 1`, `high = max_s * 2 + 1`.
// 3. Perform initial connectivity check:
//    `uf_initial = new UnionFind(n)`
//    For each `[u, v, s, must]` in `edges`: `uf_initial.union(u, v)`
//    If `uf_initial.num_components > 1`: return -1.
// 4. Binary search loop: `while (low < high)`
//    `mid = Math.floor((low + high + 1) / 2)` // Use ceiling division for `low = mid` later
//    If `check(mid)` is true:
//      `ans = mid`
//      `low = mid`
//    Else:
//      `high = mid - 1`
// 5. Return `ans`. (Initialize `ans = -1` or based on initial connectivity check).
//    If initial check passed, we know *some* MST exists. `ans` should be at least 1.
//    So, `ans = 1` after initial check, and then binary search updates it.
//
// Let's refine the range and initial `ans`.
// If initial connectivity check passes, `ans` could be initialized to the smallest possible stability (1).
// The binary search `check(mid)` will find the maximum.
// If `check(1)` is false, it means even with all upgrades, we can't achieve stability 1. This is unlikely if graph is connected.
// If initial check passes, `ans` should be initialized to `1` and binary search will update `low` to `mid`.
// If `check(mid)` is true, `low = mid`. If false, `high = mid - 1`.
// So the range is `[1, max_possible_strength]`.
// `low = 1`, `high = 200001` (a safe upper bound). `ans = -1`.
// `while (low <= high)`:
//   `mid = Math.floor((low + high) / 2)`
//   If `check(mid)`:
//     `ans = mid`
//     `low = mid + 1`
//   Else:
//     `high = mid - 1`
// Return `ans`.
//
// Example 1: n = 3, edges = [[0,1,2,1],[1,2,3,0]], k = 1
// Initial check: [0,1] (must), [1,2] (optional). Graph is connected. `uf.union(0,1), uf.union(1,2)`. num_components=1. OK.
// `max_s = 3`. `low=1`, `high=7`. `ans=-1`.
//
// BS Iter 1: `mid = 4`. `check(4)`:
//   Mandatory: [0,1,2,1]. `s=2`. `x=4`. `s < x`. Return `false`.
//   `high = 3`.
//
// BS Iter 2: `mid = 2`. `check(2)`:
//   `uf = UF(3)`. `edges_in_mst_count=0`. `upgrades_available=1`.
//   Mandatory edges: [0,1,2,1]. `s=2`. `x=2`. `s >= x`. `uf.union(0,1)` (true). `edges_in_mst_count=1`.
//   Optional edges: [1,2,3,0]. `s=3`. `x=2`. `s >= x`. `optional_strong_enough_with_uv = [{s:3, u:1, v:2}]`.
//   `edges_needed_from_optional = (3-1) - 1 = 1`.
//   `free_edges_to_take = min(1, 1) = 1`. `edges_needed_from_optional = 1 - 1 = 0`.
//   `edges_needed_from_optional <= 0`. Return `uf.num_components == 1`.
//   UF state: {0} {1,2}. `num_components=2`. Return `false`. Something is wrong in my `check` logic here.
//
// The `check` function must correctly build an MST and verify connectivity.
//
// Corrected `check(x)` logic:
// `check(x)`:
//   `uf = new UnionFind(n)`
//   `edges_count_in_potential_mst = 0`
//   `upgrades_left = k`
//
//   `mandatory_edges = []`
//   `optional_upgradeable = []` // Stores {s, u, v} where s*2 >= x
//   `optional_already_strong = []` // Stores {s, u, v} where s >= x
//
//   // Phase 1: Pre-process edges and check mandatory ones.
//   for `[u, v, s, must]` in `edges`:
//     if `must == 1`:
//       if `s < x`: return `false` // Mandatory edge too weak.
//       `mandatory_edges.push({u: u, v: v})`
//     else: // must == 0
//       if `s >= x`:
//         `optional_already_strong.push({s: s, u: u, v: v})`
//       else if `s * 2 >= x`:
//         `optional_upgradeable.push({s: s, u: u, v: v})`
//
//   // Phase 2: Add mandatory edges to the UF and check for cycles.
//   for `edge` in `mandatory_edges`:
//     if `uf.union(edge.u, edge.v)`:
//       `edges_count_in_potential_mst++`
//     else:
//       return `false` // Cycle detected among mandatory edges.
//
//   // Phase 3: Collect optional edges to meet `n-1` total edges.
//   // Greedily pick optional edges that don't require upgrades first.
//   // The actual choice of which optional edges to pick matters for forming an MST.
//   // We need to consider ALL eligible optional edges and see if we can select `n-1 - mandatory_count` of them.
//
//   // For a given `x`, we want to know if there EXISTS a set of `n-1` edges, chosen from eligible edges,
//   // such that stability is at least `x`, and upgrade count <= k.
//
//   // The `check(x)` function must behave like a greedy MST algorithm *filtered by x*.
//   // Sort all eligible edges by strength.
//   // Eligible edges are:
//   // - Mandatory edges with s >= x
//   // - Optional edges with s >= x
//   // - Optional edges with s*2 >= x (these cost 1 upgrade)
//
//   `candidate_edges = []`
//   for `[u, v, s, must]` in `edges`:
//     if `must == 1`:
//       if `s >= x`:
//         `candidate_edges.push({ u: u, v: v, s: s, must: 1, upgrade_cost: 0 })`
//       else: // s < x, mandatory edge failed check
//         return `false`
//     else: // must == 0
//       if `s >= x`:
//         `candidate_edges.push({ u: u, v: v, s: s, must: 0, upgrade_cost: 0 })`
//       else if `s * 2 >= x`:
//         `candidate_edges.push({ u: u, v: v, s: s, must: 0, upgrade_cost: 1 })`
//
//   // Sort candidate edges by strength primarily, then by upgrade cost (prefer 0 cost).
//   // A standard Kruskal's approach using eligible edges.
//   `candidate_edges.sort((a, b) => {
//     if (a.s !== b.s) {
//       return b.s - a.s; // Sort by strength descending
//     }
//     return a.upgrade_cost - b.upgrade_cost; // Prefer no upgrade cost
//   });`
//
//   `uf_kruskal = new UnionFind(n)`
//   `edges_added_kruskal = 0`
//   `upgrades_used_kruskal = 0`
//
//   for `edge` in `candidate_edges`:
//     if `edges_added_kruskal == n - 1`: break
//
//     // Check if adding this edge creates a cycle.
//     if `uf_kruskal.union(edge.u, edge.v)`:
//       // If it's an optional edge that requires an upgrade.
//       if `edge.must == 0` AND `edge.upgrade_cost == 1`:
//         // Check if we have enough upgrades.
//         if `upgrades_used_kruskal < k`:
//           `upgrades_used_kruskal++`
//           `edges_added_kruskal++`
//         else:
//           continue // Cannot use this edge, not enough upgrades.
//       else: // Mandatory edge or optional edge already strong enough.
//         `edges_added_kruskal++`
//     // else: cycle detected, skip this edge.
//
//   // Final check for this 'x':
//   // Did we manage to add exactly n-1 edges AND are all nodes connected?
//   return `edges_added_kruskal == n - 1 && uf_kruskal.num_components == 1`;
//
// This `check` function uses Kruskal's algorithm on a filtered edge set.
// The filtering ensures all edges considered have strength >= x (either originally or upgraded).
// The cost of upgrades is tracked.
// The sorting ensures we prioritize stronger edges and cheaper upgrades.
// This seems like the correct approach for `check(x)`.
//
// The initial connectivity check can also use Kruskal's.
// `uf_initial = new UnionFind(n)`
// `initial_edges_count = 0`
// `sorted_all_edges = [...edges].sort((a, b) => a[2] - b[2]);` // Sort all edges by strength ascending
// for `[u, v, s, must]` in `sorted_all_edges`:
//   if `uf_initial.union(u, v)`:
//     `initial_edges_count++`
// if `initial_edges_count < n - 1` OR `uf_initial.num_components > 1`: return -1.
//
// Final thoughts on range:
// `low = 1`. `high` can be `max_si * 2`. Let's find `max_si` first.
// If `edges` is empty, or `n=2` and no edges, it's impossible if `n-1 > 0`.
// The constraints say `2 <= n`, `1 <= edges.length`. So `n-1 >= 1`.
// If `edges.length < n-1` initially, it could be impossible if no optional edges can be added.
// The initial connectivity check handles this.
//
// Let's consider `max_s` calculation again.
// `let max_s = 0;`
// `for (const edge of edges) { max_s = Math.max(max_s, edge[2]); }`
// `let high = max_s * 2;`
// `let low = 1;`
// `let ans = -1;`
//
// The problem statement has `si <= 10^5`, so `max_s * 2 <= 2 * 10^5`.
// `high` can be `200000`.
// `low = 1`, `high = 200000`. `ans = -1`.
// `while (low <= high)`:
//   `mid = Math.floor((low + high) / 2)`
//   If `check(mid)`:
//     `ans = mid`
//     `low = mid + 1`
//   Else:
//     `high = mid - 1`
// return `ans`.

class UnionFind {
    constructor(n) {
        this.parent = Array(n).fill(0).map((_, i) => i);
        this.size = Array(n).fill(1);
        this.numComponents = n;
    }

    find(i) {
        if (this.parent[i] === i) {
            return i;
        }
        this.parent[i] = this.find(this.parent[i]); // Path compression
        return this.parent[i];
    }

    union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);

        if (rootI !== rootJ) {
            // Union by size
            if (this.size[rootI] < this.size[rootJ]) {
                this.parent[rootI] = rootJ;
                this.size[rootJ] += this.size[rootI];
            } else {
                this.parent[rootJ] = rootI;
                this.size[rootI] += this.size[rootJ];
            }
            this.numComponents--;
            return true; // Successfully merged
        }
        return false; // Already in the same set (cycle detected if adding an edge)
    }
}

function solve() {
    const n = 3;
    const edges = [[0, 1, 2, 1], [1, 2, 3, 0]];
    const k = 1;

    // const n = 3;
    // const edges = [[0,1,4,0],[1,2,3,0],[0,2,1,0]];
    // const k = 2;

    // const n = 3;
    // const edges = [[0,1,1,1],[1,2,1,1],[2,0,1,1]];
    // const k = 0;

    // Calculate maximum possible strength for binary search range
    let max_s = 0;
    for (const edge of edges) {
        max_s = Math.max(max_s, edge[2]);
    }

    // Check initial connectivity without any upgrades.
    // If the graph is not connected initially, no spanning tree is possible.
    const initialUF = new UnionFind(n);
    let initialEdgesCount = 0;
    // Sort all edges to simulate Kruskal's for initial check
    const allEdgesSorted = [...edges].sort((a, b) => a[2] - b[2]);
    for (const [u, v, s, must] of allEdgesSorted) {
        if (initialUF.union(u, v)) {
            initialEdgesCount++;
        }
    }
    // If we cannot form n-1 edges or not all components are connected, return -1.
    if (initialEdgesCount < n - 1 || initialUF.numComponents > 1) {
        return -1;
    }

    // Binary search for the maximum possible stability.
    // `low` is the minimum possible stability (1).
    // `high` is the maximum possible stability (max original strength * 2).
    let low = 1;
    let high = max_s * 2;
    let ans = -1; // Initialize answer to -1, if no valid stability is found (though initial check guarantees at least 1 if graph is connected).

    // The `check` function determines if a spanning tree with stability `x` is possible.
    const check = (x) => {
        const uf = new UnionFind(n);
        let edgesAddedCount = 0;
        let upgradesLeft = k;

        // Stores edges that are eligible to be part of an MST with stability >= x.
        // They are categorized by whether they need an upgrade.
        // Format: { u, v, s, must, upgradeCost }
        const candidateEdges = [];

        // First pass: Filter edges based on stability `x` and mandatory requirements.
        for (const [u, v, s, must] of edges) {
            if (must === 1) {
                if (s < x) {
                    return false; // Mandatory edge is too weak for stability `x`.
                }
                // This mandatory edge is eligible. Cost is 0 upgrades.
                candidateEdges.push({ u: u, v: v, s: s, must: 1, upgradeCost: 0 });
            } else { // must === 0 (optional edge)
                if (s >= x) {
                    // Optional edge is already strong enough. Cost is 0 upgrades.
                    candidateEdges.push({ u: u, v: v, s: s, must: 0, upgradeCost: 0 });
                } else if (s * 2 >= x) {
                    // Optional edge can be upgraded to meet stability `x`. Cost is 1 upgrade.
                    candidateEdges.push({ u: u, v: v, s: s, must: 0, upgradeCost: 1 });
                }
                // If s < x and s * 2 < x, this optional edge cannot reach stability `x`, so it's not a candidate.
            }
        }

        // Sort candidate edges:
        // 1. By strength (descending) to prioritize stronger edges in Kruskal's.
        // 2. By upgrade cost (ascending) to prioritize edges that don't need upgrades.
        candidateEdges.sort((a, b) => {
            if (a.s !== b.s) {
                return b.s - a.s; // Stronger edge first
            }
            return a.upgradeCost - b.upgradeCost; // Lower upgrade cost first
        });

        // Use Kruskal's algorithm on the filtered and sorted candidate edges.
        for (const edge of candidateEdges) {
            // If we already have n-1 edges, we have a spanning tree.
            if (edgesAddedCount === n - 1) {
                break;
            }

            // If adding this edge forms a cycle, skip it.
            if (uf.union(edge.u, edge.v)) {
                // If this edge requires an upgrade and we have upgrades left.
                if (edge.upgradeCost === 1) {
                    if (upgradesLeft > 0) {
                        upgradesLeft--;
                        edgesAddedCount++;
                    } else {
                        // Cannot use this edge, not enough upgrades.
                        continue;
                    }
                } else {
                    // Edge is mandatory or optional but already strong enough.
                    edgesAddedCount++;
                }
            }
            // If uf.union returns false, it means a cycle was detected, so we skip this edge.
        }

        // A valid spanning tree is possible for stability `x` if:
        // 1. We have successfully added exactly `n - 1` edges.
        // 2. All nodes are connected (which is implied by `n - 1` edges without cycles in a connected graph).
        //    The `uf.numComponents === 1` check is the definitive way to confirm connectivity.
        return edgesAddedCount === n - 1 && uf.numComponents === 1;
    };

    // Perform binary search.
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (check(mid)) {
            // If stability `mid` is achievable, try for higher stability.
            ans = mid;        // `mid` is a possible answer.
            low = mid + 1;    // Try to find a better (higher) stability.
        } else {
            // If stability `mid` is not achievable, we need to aim lower.
            high = mid - 1;
        }
    }

    // `ans` will hold the maximum stability found, or -1 if it was impossible from the start.
    return ans;
}

// Union-Find class definition (as provided in comments earlier)
class UnionFind {
    constructor(n) {
        this.parent = Array(n).fill(0).map((_, i) => i);
        this.size = Array(n).fill(1);
        this.numComponents = n;
    }

    find(i) {
        if (this.parent[i] === i) {
            return i;
        }
        this.parent[i] = this.find(this.parent[i]); // Path compression
        return this.parent[i];
    }

    union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);

        if (rootI !== rootJ) {
            // Union by size
            if (this.size[rootI] < this.size[rootJ]) {
                this.parent[rootI] = rootJ;
                this.size[rootJ] += this.size[rootI];
            } else {
                this.parent[rootJ] = rootI;
                this.size[rootI] += this.size[rootJ];
            }
            this.numComponents--;
            return true; // Successfully merged
        }
        return false; // Already in the same set (cycle detected if adding an edge)
    }
}

// This is a placeholder for the function that would be exported or called.
// In a LeetCode environment, this would be the main function.
// For a runnable script, we might call `solve()` directly.
// console.log(solve()); // Uncomment to run example if needed.
```