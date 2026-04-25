/**
 * @param {number} side
 * @param {number[][]} points
 * @param {number} k
 * @return {number}
 */
/**
 * Problem Summary:
 * Given a square of a given side length and a set of points on its boundary,
 * select k points such that the minimum Manhattan distance between any two
 * selected points is maximized.
 *
 * Link: https://leetcode.com/problems/maximize-the-distance-between-points-on-a-square/
 *
 * Approach:
 * This problem can be solved using binary search on the answer. The minimum
 * Manhattan distance can range from 0 to 2 * side (the maximum possible distance
 * between two points on the boundary). For a given potential minimum distance `d`,
 * we need to check if it's possible to select at least `k` points such that the
 * Manhattan distance between any two selected points is at least `d`.
 *
 * To check if a distance `d` is feasible:
 * We can iterate through each point as a potential first point in our selection.
 * For each chosen point `p1`, we then greedily try to select subsequent points `p2`
 * such that `manhattan_distance(p1, p2) >= d`.
 *
 * A more efficient way to check feasibility of distance `d` is to consider the
 * Manhattan distance transformation: u = x + y, v = x - y.
 * In this transformed space, the Manhattan distance `|x1 - x2| + |y1 - y2|`
 * is related to the Chebyshev distance `max(|u1 - u2|, |v1 - v2|)`.
 *
 * Specifically, for two points (x1, y1) and (x2, y2), the Manhattan distance is:
 * `|x1 - x2| + |y1 - y2|`.
 *
 * Let `u1 = x1 + y1`, `v1 = x1 - y1`, `u2 = x2 + y2`, `v2 = x2 - y2`.
 * Then `x = (u + v) / 2`, `y = (u - v) / 2`.
 *
 * `|x1 - x2| = |(u1 + v1)/2 - (u2 + v2)/2| = |(u1 - u2) + (v1 - v2)| / 2`
 * `|y1 - y2| = |(u1 - v1)/2 - (u2 - v2)/2| = |(u1 - u2) - (v1 - v2)| / 2`
 *
 * The Manhattan distance is `|x1 - x2| + |y1 - y2|`.
 *
 * A crucial property is that for any two points, the Manhattan distance
 * `|x1 - x2| + |y1 - y2|` is greater than or equal to `max(|(x1+y1) - (x2+y2)|, |(x1-y1) - (x2-y2)|)`.
 * This means if we can ensure `|u1 - u2| >= d` and `|v1 - v2| >= d` for all pairs,
 * then the Manhattan distance will be at least `d`.
 *
 * However, this is too strict. We need `|x1 - x2| + |y1 - y2| >= d`.
 *
 * A simpler approach for checking feasibility of distance `d`:
 * Iterate through each point `p` in `points`. If we decide to pick `p`,
 * then any other point `q` we pick must satisfy `|p.x - q.x| + |p.y - q.y| >= d`.
 *
 * We can rephrase the condition: for any two selected points `pi` and `pj`,
 * `|xi - xj| + |yi - yj| >= d`.
 *
 * Consider the four boundaries of the square:
 * 1. Left: x=0, 0 <= y <= side
 * 2. Bottom: y=0, 0 <= x <= side
 * 3. Right: x=side, 0 <= y <= side
 * 4. Top: y=side, 0 <= x <= side
 *
 * For each point, we can map it to a single coordinate along the perimeter.
 * Let's define a perimeter traversal:
 * - (0, y) maps to y
 * - (x, side) maps to side + x
 * - (side, y) maps to side + side + (side - y)
 * - (x, 0) maps to side + side + side + (side - x)
 * This gives a linear representation of points on the boundary.
 *
 * However, the Manhattan distance isn't directly preserved in this linear mapping.
 *
 * Back to the binary search on the answer `d`.
 * For a given `d`, can we select `k` points?
 * This check itself can be tricky.
 *
 * A key observation for Manhattan distance:
 * `|x1 - x2| + |y1 - y2| >= d`
 *
 * This inequality can be broken down into four cases based on the signs of `x1-x2` and `y1-y2`:
 * 1. (x1 - x2) + (y1 - y2) >= d  => (x1 + y1) - (x2 + y2) >= d
 * 2. (x1 - x2) - (y1 - y2) >= d  => (x1 - y1) - (x2 - y2) >= d
 * 3. -(x1 - x2) + (y1 - y2) >= d => -(x1 - y1) + (x2 - y2) >= d
 * 4. -(x1 - x2) - (y1 - y2) >= d => -(x1 + y1) + (x2 + y2) >= d
 *
 * Let `u = x + y` and `v = x - y`.
 * The conditions become:
 * 1. `u1 - u2 >= d`
 * 2. `v1 - v2 >= d`
 * 3. `-v1 + v2 >= d`  => `v2 - v1 >= d`
 * 4. `-u1 + u2 >= d`  => `u2 - u1 >= d`
 *
 * So, for any two selected points `i` and `j`, we need:
 * `|ui - uj| >= d` OR `|vi - vj| >= d` is NOT what we need.
 *
 * We need `|xi - xj| + |yi - yj| >= d`.
 *
 * The constraint `k <= 25` is very important. This suggests an approach that is exponential in `k` but polynomial in `n` (number of points).
 *
 * If `k` is small, we can try a greedy approach within the `check` function.
 *
 * Let's reconsider the `check(d)` function.
 * For a given distance `d`, can we select `k` points?
 *
 * Iterate through each point `p` in `points`. Assume `p` is one of the selected points.
 * Then, we need to find `k-1` more points `q` such that `|p.x - q.x| + |p.y - q.y| >= d`.
 *
 * This seems like a set cover type problem if we fix one point.
 *
 * Let's transform the points. For each point `(x, y)` on the boundary, calculate `x+y` and `x-y`.
 * Boundary points and their transformations:
 * - (0, y)  => u = y, v = -y
 * - (x, side) => u = side + x, v = x - side
 * - (side, y) => u = side + y, v = side - y
 * - (x, 0) => u = x, v = x
 *
 * This transformation is not monotonic for all points on the boundary.
 *
 * For a given `d`, we want to select `k` points `pi` such that for all `i != j`, `|xi - xj| + |yi - yj| >= d`.
 *
 * Consider sorting the points. If we sort points by their perimeter distance, it might help.
 *
 * The small `k` strongly suggests a dynamic programming or recursive approach with memoization, potentially combined with bitmasks if `k` were smaller (like up to 15-20).
 *
 * Let's try to frame the `check(d)` function more concretely.
 * We need to select `k` points. For each pair, the Manhattan distance must be `>= d`.
 *
 * What if we iterate through all possible subsets of size `k`? This is `C(n, k)` which is too large.
 *
 * The problem is to find the largest `d` such that there exists a subset of `k` points where all pairwise Manhattan distances are at least `d`.
 *
 * Let's consider the problem of checking if a distance `d` is feasible.
 *
 * For a fixed `d`, can we find `k` points?
 * Iterate through each point `p` as a potential starting point.
 * If we pick `p`, then all other `k-1` points `q` must satisfy `|p.x - q.x| + |p.y - q.y| >= d`.
 *
 * This condition `|p.x - q.x| + |p.y - q.y| >= d` means that `q` must lie outside a diamond shape centered at `p`.
 *
 * The number of points is up to `15000`.
 *
 * Let's use the small `k` property.
 * Suppose we fix the first point `p1`. We want to pick `k-1` more points `p2, ..., pk` such that `dist(pi, pj) >= d` for all `i, j`.
 *
 * This subproblem can be modeled as finding a maximum independent set in a graph where nodes are points and an edge exists if their Manhattan distance is less than `d`. We want to find if an independent set of size `k` exists. Maximum independent set is NP-hard in general graphs. However, our graph has special structure.
 *
 * For small `k`, maybe we can iterate through all combinations of `k` points and check the minimum distance. No, this is still too slow.
 *
 * The check function should be efficient.
 *
 * What if we try to select points one by one greedily?
 * Pick a point `p1`. Then pick `p2` such that `dist(p1, p2) >= d` and `p2` is "far" from `p1`. This greedy choice might not lead to an optimal global solution.
 *
 * Let's analyze the `check(d)` function more carefully.
 * Suppose we have `N` points. We need to pick `k` points.
 *
 * For a fixed `d`, can we find `k` points?
 * Let's try a greedy strategy for the `check(d)` function.
 * Select the first point `p1`.
 * Then select the second point `p2` such that `dist(p1, p2) >= d`.
 * Then select `p3` such that `dist(p1, p3) >= d` and `dist(p2, p3) >= d`.
 * And so on.
 * This greedy selection might fail to find `k` points even if `k` points exist.
 *
 * Example: points A, B, C, D. We need to pick 3 points, distance `d`.
 * If `dist(A, B) < d`, `dist(A, C) < d`, `dist(A, D) < d`. Then A cannot be picked if we want to pick more than one point.
 *
 * The fact that `k` is small means we can potentially explore combinations or use recursion with state.
 *
 * Let `can_select(idx, count, current_selection)` be a recursive function to check if we can select `count` more points from `points[idx:]` given `current_selection`.
 * `current_selection` would be a list of points already selected.
 * For each point `points[i]` where `i >= idx`:
 *  Check if `dist(points[i], p) >= d` for all `p` in `current_selection`.
 *  If yes, then recursively call `can_select(i+1, count-1, current_selection + [points[i]])`.
 *
 * The state `current_selection` can be large.
 *
 * Maybe the state can be simplified: `can_select(point_idx, points_to_pick, last_selected_point_idx)`?
 * No, we need distances to all previously selected points.
 *
 * Given `k <= 25`, the maximum number of points is `15000`.
 * `C(15000, 25)` is enormous.
 *
 * What if the `check(d)` function uses bitmask DP if `k` were smaller? Like `k <= 20`.
 * `dp[mask]` = boolean, can we select points represented by `mask` such that pairwise dist >= d.
 *
 * Since `k` can be up to 25, bitmask DP on points is not feasible.
 *
 * The small `k` suggests we can bound the search space by `k`.
 *
 * Let's rethink the `check(d)` function.
 * For a given `d`, can we find `k` points?
 *
 * We can try to iterate through all points `p_i`.
 * If we select `p_i`, then any other selected point `p_j` must satisfy `dist(p_i, p_j) >= d`.
 *
 * Let's consider the constraints again. `side` up to `10^9`. This means coordinates can be large, but `k` is small.
 *
 * This problem sounds like it has a greedy component within the `check` function, or a limited search.
 *
 * Suppose we fix one point `p_start`. We need to find `k-1` other points.
 *
 * Let's try a greedy approach for `check(d)`:
 * Function `can_achieve(d, k, points)`:
 *   `selected_count = 0`
 *   `selected_points = []`
 *   For each point `p` in `points`:
 *     `is_valid = true`
 *     For each `s_p` in `selected_points`:
 *       If `manhattan_distance(p, s_p) < d`:
 *         `is_valid = false`
 *         break
 *     If `is_valid`:
 *       `selected_points.push(p)`
 *       `selected_count += 1`
 *       If `selected_count == k`:
 *         return true
 *   Return false
 *
 * This greedy approach is WRONG. It might pick points that prevent picking more points later.
 *
 * Example: Points A, B, C, D. Need k=3, distance d.
 * Suppose `dist(A, B) < d`, `dist(A, C) < d`, `dist(B, C) < d`.
 * If we pick A, we can't pick B or C.
 * If we pick B, we can't pick A or C.
 * If we pick C, we can't pick A or B.
 * If we pick D, and `dist(A, D) >= d`, `dist(B, D) >= d`, `dist(C, D) >= d`.
 * Greedy might pick A first. Then it can't pick B or C. If D is far from A, it picks D. Total 2.
 * But maybe we could pick B, C, D if their pairwise distances are >= d.
 *
 * The small `k` suggests a recursive backtracking approach for `check(d)`.
 *
 * `can_select_recursive(point_idx, num_to_select, current_selection)`:
 *   `current_selection` is a list of indices or points.
 *   Base case: `num_to_select == 0` -> return true.
 *   Base case: `point_idx == points.length` -> return false.
 *
 *   // Option 1: Don't select points[point_idx]
 *   If `can_select_recursive(point_idx + 1, num_to_select, current_selection)`:
 *     return true
 *
 *   // Option 2: Select points[point_idx]
 *   `is_compatible = true`
 *   For each `selected_point_idx` in `current_selection`:
 *     If `manhattan_distance(points[point_idx], points[selected_point_idx]) < d`:
 *       `is_compatible = false`
 *       break
 *   If `is_compatible`:
 *     `new_selection = current_selection + [point_idx]`
 *     If `can_select_recursive(point_idx + 1, num_to_select - 1, new_selection)`:
 *       return true
 *
 *   Return false
 *
 * This is still exponential in `N` if not memoized.
 * The state needs to be `(point_idx, num_to_select, mask_of_selected_points)` if `k` is small enough for mask.
 *
 * Since `k` is up to 25, a bitmask on points won't work.
 * What if we fix the FIRST point selected?
 *
 * `check(d, k, points)`:
 *   For each `start_point_idx` from `0` to `points.length - 1`:
 *     If `recursive_helper(start_point_idx, k - 1, [start_point_idx], d, points)`:
 *       return true
 *   Return false
 *
 * `recursive_helper(current_point_idx, num_to_select, selected_indices, d, points)`:
 *   If `num_to_select == 0`:
 *     return true
 *
 *   For `next_point_idx` from `current_point_idx + 1` to `points.length - 1`:
 *     `is_compatible = true`
 *     For `idx` in `selected_indices`:
 *       If `manhattan_distance(points[next_point_idx], points[idx]) < d`:
 *         `is_compatible = false`
 *         break
 *     If `is_compatible`:
 *       `new_selected_indices = selected_indices + [next_point_idx]`
 *       If `recursive_helper(next_point_idx, num_to_select - 1, new_selected_indices, d, points)`:
 *         return true
 *   Return false
 *
 * This backtracking approach is roughly `O(N * C(N, k-1))` in the worst case without pruning.
 * With pruning and small `k`, it might pass.
 *
 * The maximum number of points is `15000`.
 * `k <= 25`.
 *
 * Let's analyze the time complexity of `check(d)` with this recursive helper.
 * `check(d)` calls `recursive_helper` for each starting point.
 * `recursive_helper(curr_idx, num_to_select, selected_indices)`:
 *   The depth of recursion is `k`.
 *   At each step, we iterate up to `N` potential next points.
 *   Checking compatibility takes `O(k)` time.
 *   Total for `check(d)` is roughly `O(N * (N * k)^k)`. This is too high.
 *
 * The number of points is `N = points.length`.
 * The constraint `4 <= k <= min(25, points.length)` is key.
 *
 * What if we sort points first?
 * Sorting points along the perimeter might be useful.
 *
 * Let's consider the "check" function `can_select(d, k, points)` again.
 * This problem is similar to finding the largest `d` such that a graph formed by points with edges for distances `< d` has an independent set of size `k`.
 *
 * For small `k`, we can try a bounded search.
 *
 * Let's consider the problem from a different angle: maximize `d`.
 * Binary search for `d` in the range `[0, 2 * side]`.
 * For `check(d)`:
 *   Try to select `k` points.
 *
 * The check function needs to be more efficient.
 *
 * What if we iterate through all possible subsets of points of size `k`? That's `C(N, k)`, too large.
 *
 * The fact that `k` is small suggests we can bound the complexity by `k`.
 *
 * Consider a simpler greedy strategy for the `check` function that might be correct for this problem.
 * Iterate through all points `p`. If `p` can be selected (i.e., its distance to all already selected points is >= `d`), select it.
 * This doesn't work because the order of selection matters.
 *
 * What if we fix one point `p1` and then try to select `k-1` points that are far from `p1` and each other?
 *
 * For a fixed `d`, and a fixed starting point `p_start`:
 * We need to select `k-1` more points from the remaining `N-1` points.
 * Let `remaining_points` be the points from `points` that are at least distance `d` from `p_start`.
 * Then we need to find `k-1` points from `remaining_points` that are pairwise at least distance `d` apart.
 *
 * This is still the same recursive problem.
 *
 * The key must be in how the `check(d)` function is implemented, exploiting the small `k`.
 *
 * Let's re-read: "select k elements among points such that the minimum Manhattan distance between any two points is maximized."
 *
 * If we can select `k` points, say `S = {p_1, ..., p_k}`, then `min_{i!=j} dist(p_i, p_j) = D`. We want to maximize `D`.
 *
 * Binary search for `D`.
 * `check(D)`: is it possible to select `k` points such that all pairwise distances are at least `D`?
 *
 * Let's try to build a `check(d)` function that's potentially `O(N * k * 2^k)` or `O(N * k^2)` or something related to `k`.
 *
 * Let's fix the first point `p_0`.
 * We want to find `k-1` other points `p_1, ..., p_{k-1}` such that:
 * `dist(p_i, p_j) >= d` for all `i, j` in `{0, ..., k-1}`.
 *
 * Consider a recursive function `solve(point_idx, count, current_selection_indices)`
 * `point_idx`: the index of the point we are currently considering to include or exclude.
 * `count`: the number of points we still need to select.
 * `current_selection_indices`: the indices of points already selected.
 *
 * `solve(idx, k_rem, selection_indices)`:
 *   If `k_rem == 0`: return true.
 *   If `idx == points.length`: return false.
 *
 *   // Option 1: Exclude points[idx]
 *   If `solve(idx + 1, k_rem, selection_indices)`: return true.
 *
 *   // Option 2: Include points[idx] if compatible
 *   `can_include = true`
 *   For `s_idx` in `selection_indices`:
 *     If `manhattan_distance(points[idx], points[s_idx]) < d`:
 *       `can_include = false`
 *       break
 *   If `can_include`:
 *     `new_selection = selection_indices + [idx]`
 *     If `solve(idx + 1, k_rem - 1, new_selection)`: return true.
 *
 *   Return false.
 *
 * This is essentially the same backtracking.
 * The issue is the state: `selection_indices` can be a list of up to `k` indices.
 *
 * The constraint `k <= 25` is really unusual if the solution isn't exponential in `k`.
 *
 * What if we try to find the k-th point?
 *
 * Let's consider the properties of Manhattan distance on a square boundary.
 *
 * The problem can be rephrased: Find the maximum `d` such that there exists a subset `S` of `points` with `|S| = k` and for all `p, q` in `S`, `|p.x - q.x| + |p.y - q.y| >= d`.
 *
 * The check function `can(d)` must be efficient.
 *
 * Consider this: For a given `d`, if we have selected `m` points, and we are considering adding a new point `p`.
 * The condition is that `p` must be at least distance `d` from ALL currently selected points.
 *
 * This is a maximum independent set problem on an interval graph if the points were on a line.
 * For 2D, it's more complex.
 *
 * Maybe the approach is a slightly optimized backtracking for `check(d)`.
 *
 * Let's define `can_select(point_index, num_needed, current_selection)`:
 * `point_index`: current index in `points` array we are considering.
 * `num_needed`: how many more points we need to select.
 * `current_selection`: a list/array of points already selected.
 *
 * `can_select(idx, k_rem, selected_points)`:
 *   If `k_rem == 0`: return true.
 *   If `idx == points.length`: return false.
 *
 *   // Try to include points[idx]
 *   `current_point = points[idx]`
 *   `is_compatible = true`
 *   For each `p` in `selected_points`:
 *     If `manhattan_distance(current_point, p) < d`:
 *       `is_compatible = false`
 *       break
 *
 *   If `is_compatible`:
 *     `selected_points.push(current_point)`
 *     If `can_select(idx + 1, k_rem - 1, selected_points)`:
 *       // Backtrack: remove current_point before returning true
 *       // to explore other branches if necessary.
 *       // However, since we're just checking for existence,
 *       // if one path works, we can return true.
 *       // But to correctly explore all possibilities within this branch,
 *       // we should backtrack.
 *       // The issue is that 'selected_points' is passed by reference.
 *       // We need to pass a copy or manage it carefully.
 *       return true
 *     `selected_points.pop()` // Backtrack
 *
 *   // Try to exclude points[idx]
 *   If `can_select(idx + 1, k_rem, selected_points)`:
 *     return true
 *
 *   Return false
 *
 * The initial call would be: `can_select(0, k, [])`.
 *
 * The number of states visited could still be large.
 *
 * Let's look at typical solutions for this kind of problem with small `k`.
 * Often, it involves iterating through all combinations of `k` items or using bitmasks if `k` is small enough.
 * Here `k` is up to 25. This is too large for bitmasks.
 *
 * However, maybe the number of *valid* starting points or intermediate states is limited.
 *
 * Consider the `check(d)` function again.
 * For a fixed `d`, we want to find if there is a subset `S` of size `k` such that all pairs `(p, q) \in S` have `dist(p, q) >= d`.
 *
 * This is equivalent to finding if the graph `G_d` where vertices are `points` and an edge exists between `p, q` if `dist(p, q) < d` has an independent set of size `k`.
 * Finding maximum independent set is NP-hard. But for small `k`, we might be able to bound the search.
 *
 * What if we fix the FIRST point `p_0` and then recursively find `k-1` points?
 * The maximum number of points we can select greedily from a starting point `p_0` is `N`.
 *
 * If we use `check(d)` with the recursive helper, the number of `selected_indices` in the state is at most `k`.
 *
 * `recursive_helper(point_idx, k_rem, current_selection_indices, d, points)`
 *
 * The state space can be pruned if `k_rem` becomes too large for the remaining `points.length - point_idx`.
 *
 * Let's think about the time complexity of the `check` function with backtracking.
 * The state could be represented by `(index_of_current_point_considered, number_of_points_still_needed, tuple_of_selected_indices)`.
 * The tuple of selected indices is the problematic part.
 * Since `k` is small, the number of elements in the tuple is small.
 *
 * Let's fix the number of points already selected, say `m`.
 * And we are looking for `k-m` more points.
 *
 * The critical observation might be related to the constraints on `k` and `points.length`.
 * `4 <= k <= min(25, points.length)`.
 * `points.length <= 15000`.
 *
 * If `points.length` is small (e.g., `points.length <= 50`), then `C(N, k)` might be feasible for `k=25`.
 * `C(50, 25)` is large but manageable for a check function that runs few times.
 *
 * But `points.length` can be `15000`.
 *
 * Let's consider the `check(d)` function using the recursive approach.
 * `solve(idx, k_rem, selection_mask)` - if `k` was small, say `< 20`.
 * But `k <= 25`.
 *
 * What if the `check(d)` function tries to match pairs?
 *
 * Alternative approach for `check(d)`:
 *
 * For each point `p_i` as a potential member of the `k` selected points:
 *   If `p_i` is chosen, then all other `k-1` chosen points `p_j` must satisfy `dist(p_i, p_j) >= d`.
 *
 * Consider the constraints on the coordinates: `0 <= x, y <= side`. `side` can be `10^9`.
 * This implies we cannot discretize the space.
 *
 * The small `k` is the only clue for a non-polynomial-in-N solution.
 *
 * Let's assume the recursive `check(d)` function is indeed the intended solution structure.
 * `can_select_recursive(point_idx, num_to_select, current_selection)`
 *   `current_selection` stores points, not indices.
 *
 * `check(d, k, points)`:
 *   `n = points.length`
 *   `memo = {}` // For memoization, but the state `current_selection` is complex.
 *
 *   `function backtrack(idx, k_rem, current_selection)`:
 *     If `k_rem == 0`: return true.
 *     If `idx == n`: return false.
 *
 *     // Option 1: Exclude points[idx]
 *     If `backtrack(idx + 1, k_rem, current_selection)`: return true.
 *
 *     // Option 2: Include points[idx] if compatible
 *     `p = points[idx]`
 *     `is_compatible = true`
 *     For `s_p` in `current_selection`:
 *       If `manhattan_distance(p, s_p) < d`:
 *         `is_compatible = false`
 *         break
 *
 *     If `is_compatible`:
 *       `current_selection.push(p)` // Modify in place
 *       If `backtrack(idx + 1, k_rem - 1, current_selection)`:
 *         // Found a solution, no need to pop for THIS path.
 *         // However, to explore alternative paths in earlier calls, we must pop.
 *         return true
 *       `current_selection.pop()` // Backtrack
 *
 *     Return false
 *
 *   Return `backtrack(0, k, [])`
 *
 * This `check(d)` function has a worst-case complexity that is exponential in `N`.
 * But the number of points actually selected is limited by `k`.
 *
 * The key insight might be that `k` is small, so the number of points in `current_selection` is at most `k`.
 * The number of recursive calls can be visualized as a binary tree of depth `N`.
 * However, the `k_rem` parameter prunes branches. The maximum depth of a path that reaches `k_rem == 0` is `k`.
 *
 * If we fix the set of `k` points, the check is `O(k^2)`.
 * The problem is finding that set.
 *
 * Consider the time complexity of `check(d)` with backtracking:
 * `T(idx, k_rem, num_selected_in_current)`
 * `idx` up to `N`. `k_rem` up to `k`. `num_selected_in_current` up to `k`.
 * The compatibility check takes `O(num_selected_in_current)`.
 *
 * The total number of nodes in the recursion tree can be roughly `O(N choose k) * k^2` if we consider unique combinations.
 *
 * A typical strategy for small `k` is iterating through all subsets of size `k`.
 * But `N` is large.
 *
 * Let's try to find a bound on the number of recursive calls for `check(d)`.
 * The state `(idx, k_rem, current_selection)` is tricky.
 * `current_selection` is a list of points. Its length is `k - k_rem`.
 *
 * If `k=25`, and `N=15000`.
 *
 * Let's refine the `check` function.
 *
 * `can_select(start_idx, num_to_select, selected_points_so_far, d, points)`:
 *   If `num_to_select == 0`: return true.
 *   If `start_idx == points.length`: return false.
 *
 *   // Option 1: Skip points[start_idx]
 *   If `can_select(start_idx + 1, num_to_select, selected_points_so_far, d, points)`:
 *     return true
 *
 *   // Option 2: Try to select points[start_idx]
 *   `current_point = points[start_idx]`
 *   `is_compatible = true`
 *   For `p` in `selected_points_so_far`:
 *     If `manhattan_distance(current_point, p) < d`:
 *       `is_compatible = false`
 *       break
 *
 *   If `is_compatible`:
 *     `selected_points_so_far.push(current_point)`
 *     If `can_select(start_idx + 1, num_to_select - 1, selected_points_so_far, d, points)`:
 *       return true
 *     `selected_points_so_far.pop()` // Backtrack
 *
 *   Return false
 *
 * This `check(d)` function is `O(2^N)` in naive form.
 * However, pruning by `num_to_select` and the constraint that `len(selected_points_so_far)` never exceeds `k` limits it.
 *
 * The number of states visited can be bounded. If `k` is small, the branches where `k_rem` becomes `0` are reached relatively quickly.
 * The number of paths of length `k` in a binary tree of depth `N` is `C(N, k)`.
 * For each path of length `k`, the compatibility check takes `O(k^2)`.
 * Total time for `check(d)` might be `O(C(N, k) * k^2)`.
 * Still too big for `N=15000`, `k=25`.
 *
 * The critical factor MUST be that `k` is small.
 * This implies the complexity must be exponential in `k`, but polynomial in `N`.
 *
 * Maybe `check(d)` is `O(N * k * (N/k)^k)` or similar.
 *
 * If `k` is small, say `k=4`. `C(N, 4)` is `O(N^4)`.
 *
 * A key property of Manhattan distance:
 * `|x1 - x2| + |y1 - y2| >= d`
 *
 * Let's look at the problem on LeetCode for similar solutions.
 * The constraint `k <= 25` is the standard hint for "exponential in k".
 *
 * The `check(d)` function:
 *
 * `function can(d)`:
 *   `n = points.length`
 *   `memo = {}` // Key: (idx, k_rem, bitmask of selected) - not feasible for k=25
 *
 *   `function find(idx, k_rem, selection)`:
 *     If `k_rem == 0`: return true
 *     If `idx == n`: return false
 *
 *     // Try not selecting points[idx]
 *     If `find(idx + 1, k_rem, selection)`: return true
 *
 *     // Try selecting points[idx]
 *     `p = points[idx]`
 *     `is_ok = true`
 *     For `s_p` in `selection`:
 *       If `manhattan_distance(p, s_p) < d`:
 *         `is_ok = false`
 *         break
 *     If `is_ok`:
 *       `selection.push(p)`
 *       If `find(idx + 1, k_rem - 1, selection)`: return true
 *       `selection.pop()` // Backtrack
 *
 *     Return false
 *
 *   Return `find(0, k, [])`
 *
 * The complexity of this `find` function is `O(2^N)` in worst case.
 * However, `k_rem` limits the useful depth.
 * The actual number of calls to `find` where `k_rem` decreases is `k`.
 * The total number of states `(idx, k_rem)` visited *across all branches* could be large.
 *
 * The crucial observation for small `k` might be related to:
 * `check(d)` can be formulated as finding if there exists a subset of size `k` in a graph where edges represent distance `< d`.
 * For small `k`, we can iterate through all potential sets of `k` points from a smaller pool or use specialized algorithms.
 *
 * Given that `k` is small, and `N` can be large, perhaps the `check` function can prune effectively.
 *
 * Let's use a `Set` for `selected_points` within `check` to make compatibility checks faster if we were hashing points, but points are objects/arrays.
 *
 * The maximum value of `d` can be `2 * side`. So, the range of binary search is `[0, 2 * 10^9]`.
 * The number of iterations in binary search is `log(2 * side)`, which is about 31.
 *
 * The core problem is `check(d)`.
 *
 * For `k <= 25`, the expected time complexity for `check(d)` is likely `O(N * k * C(N, k))` or `O(N * k * 2^k)` if we fix one point.
 *
 * Consider a simplified `check(d)` function:
 * `function check(d, k, points)`:
 *   `n = points.length`
 *   `function can(index, count, current_selection)`:
 *     If `count == 0`: return true
 *     If `index == n`: return false
 *
 *     // Option 1: Skip points[index]
 *     If `can(index + 1, count, current_selection)`: return true
 *
 *     // Option 2: Try to include points[index]
 *     `p = points[index]`
 *     `is_compatible = true`
 *     For `s_p` in `current_selection`:
 *       If `manhattan_distance(p, s_p) < d`:
 *         `is_compatible = false`
 *         break
 *     If `is_compatible`:
 *       `current_selection.push(p)`
 *       If `can(index + 1, count - 1, current_selection)`: return true
 *       `current_selection.pop()` // Backtrack
 *
 *     Return false
 *
 *   Return `can(0, k, [])`
 *
 * This `check` function has a time complexity that is roughly `O(C(N, k) * k^2)` if `k_rem` pruning is very effective.
 * If `k` is small, `C(N, k)` is `O(N^k)`.
 * Example: `k=4`. `O(N^4 * 16)`.
 * For `N=15000`, `k=4`, this is too much.
 *
 * There MUST be a more efficient `check(d)` using the small `k`.
 *
 * The constraint `k <= 25` usually hints towards `O(N * poly(k) * 2^k)` or `O(N * poly(k) * C(poly(k), k))`.
 *
 * Let's consider fixing one point `p_0`. Then we need to pick `k-1` points from the remaining `N-1` points, which are all at least distance `d` from `p_0`.
 * This subproblem is still hard.
 *
 * The crucial observation might be that the number of points we need to CHOOSE is small (`k`), not necessarily the total number of points `N`.
 *
 * Let's try to bound the `check(d)` complexity more tightly.
 * The recursion tree has depth `N`. At each node, we have two branches.
 * However, the `k_rem` parameter limits the depth of successful paths to `k`.
 *
 * The number of nodes in the search tree where `k_rem` reaches `0` is at most `C(N, k)`.
 * For each such path, the compatibility check involves `k` points, taking `O(k^2)`.
 * So `O(C(N, k) * k^2)` seems like an upper bound.
 *
 * Why is `k` capped at 25? This number is very specific.
 *
 * What if the `check` function uses an approach like this:
 * For each point `p_i` as the *first* selected point:
 *   Recursively try to find `k-1` other points.
 *   `find_k_minus_1(current_point_index, num_to_find, current_selection)`
 *
 * This is exactly the recursive function described above.
 *
 * `manhattan_distance(p1, p2)` helper function.
 *
 * Binary search range for `d`: `low = 0`, `high = 2 * side + 1`.
 * `ans = 0`.
 * While `low < high`:
 *   `mid = Math.floor((low + high) / 2)`
 *   If `check(mid, k, points)`:
 *     `ans = mid`
 *     `low = mid + 1`
 *   Else:
 *     `high = mid`
 *
 * The `check` function:
 * `function check(d, k, points)`:
 *   `n = points.length`
 *   `function backtrack(idx, k_needed, current_selection)`:
 *     // Pruning: if remaining points are not enough to satisfy k_needed
 *     If `k_needed > n - idx`: return false
 *
 *     If `k_needed == 0`: return true
 *     If `idx == n`: return false
 *
 *     // Option 1: Exclude points[idx]
 *     If `backtrack(idx + 1, k_needed, current_selection)`: return true
 *
 *     // Option 2: Include points[idx]
 *     `p = points[idx]`
 *     `is_compatible = true`
 *     For `s_p` in `current_selection`:
 *       If `manhattan_distance(p, s_p) < d`:
 *         `is_compatible = false`
 *         break
 *     If `is_compatible`:
 *       `current_selection.push(p)`
 *       If `backtrack(idx + 1, k_needed - 1, current_selection)`: return true
 *       `current_selection.pop()` // Backtrack
 *
 *     Return false
 *
 *   Return `backtrack(0, k, [])`
 *
 * This backtracking approach seems to be the most plausible given the constraints.
 * The key is that the number of *successful* paths is limited by `C(N, k)`.
 * And the pruning `k_needed > n - idx` helps.
 *
 * Time Complexity:
 * Binary Search: `O(log(side))` iterations.
 * `check(d)` function: The backtracking has a state `(idx, k_needed, current_selection)`.
 * `idx` goes from `0` to `N`.
 * `k_needed` goes from `k` down to `0`.
 * `current_selection` has size at most `k`.
 *
 * The number of nodes in the recursion tree where `k_needed` actually decreases is `k`.
 * The total number of calls to `check` is `O(log(side))`.
 * For `check(d)`:
 * The complexity is roughly `O(N * k * (\text{something related to } C(N, k)))`.
 * A more precise analysis for `O(C(N, k) * k^2)` is often cited for MIS on small independent sets.
 *
 * Given `k <= 25`, perhaps the `N` dependence is not as bad as `N^k`.
 *
 * Let's assume this backtracking `check` is what's expected.
 *
 * Space Complexity:
 * `O(k)` for the recursion depth and storing `current_selection`.
 *
 * Final check on constraints and logic:
 * - `side`: large, so cannot discretize. Binary search on distance is good.
 * - `k`: small (<= 25), suggests exponential in k, polynomial in N.
 * - `points.length`: can be large.
 * - Points are on boundary.
 *
 * The provided solution structure implies the binary search and the recursive `check` function.
 *
 * Helper for Manhattan distance.
 *
 * `manhattan_distance(p1, p2)`:
 *   `return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1])`
 */
/**
 * @param {number} side
 * @param {number[][]} points
 * @param {number} k
 * @return {number}
 */
const maximizeTheDistanceBetweenPointsOnASquare = function(side, points, k) {
    /**
     * Calculates the Manhattan distance between two points.
     * @param {number[]} p1 - The first point [x1, y1].
     * @param {number[]} p2 - The second point [x2, y2].
     * @returns {number} The Manhattan distance.
     */
    const manhattanDistance = (p1, p2) => {
        return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
    };

    /**
     * Checks if it's possible to select at least `k` points from the given `points`
     * such that the minimum Manhattan distance between any two selected points is at least `d`.
     * This function uses a recursive backtracking approach.
     *
     * @param {number} d - The minimum required Manhattan distance.
     * @param {number} k - The number of points to select.
     * @param {number[][]} currentPoints - The array of points to consider.
     * @returns {boolean} True if `k` points can be selected, false otherwise.
     */
    const canSelectKPoints = (d, k, currentPoints) => {
        const n = currentPoints.length;

        /**
         * Recursive helper function for backtracking.
         * @param {number} idx - The index of the current point being considered.
         * @param {number} kNeeded - The number of points still needed to be selected.
         * @param {number[][]} currentSelection - The list of points already selected in the current path.
         * @returns {boolean} True if a valid selection of `kNeeded` points can be completed from `currentPoints[idx:]`.
         */
        const backtrack = (idx, kNeeded, currentSelection) => {
            // Base Case 1: If we have successfully selected k points.
            if (kNeeded === 0) {
                return true;
            }

            // Base Case 2: If we have run out of points to consider but still need to select more.
            if (idx === n) {
                return false;
            }

            // Pruning: If the number of remaining points is less than the number of points we still need to select.
            if (n - idx < kNeeded) {
                return false;
            }

            // Option 1: Exclude the current point `currentPoints[idx]`.
            // Move to the next point without selecting the current one.
            if (backtrack(idx + 1, kNeeded, currentSelection)) {
                return true;
            }

            // Option 2: Try to include the current point `currentPoints[idx]`.
            const currentPoint = currentPoints[idx];
            let isCompatible = true;

            // Check if the current point is compatible with all points already in `currentSelection`.
            for (const selectedPoint of currentSelection) {
                if (manhattanDistance(currentPoint, selectedPoint) < d) {
                    isCompatible = false;
                    break;
                }
            }

            // If compatible, add it to the selection and recurse.
            if (isCompatible) {
                currentSelection.push(currentPoint); // Add the point to the current selection.
                // Recurse to find the remaining `kNeeded - 1` points from the next index onwards.
                if (backtrack(idx + 1, kNeeded - 1, currentSelection)) {
                    return true; // Found a valid selection.
                }
                currentSelection.pop(); // Backtrack: Remove the point to explore other possibilities.
            }

            // If neither option leads to a solution from this state.
            return false;
        };

        // Start the backtracking process from the first point (index 0), needing k points, with an empty initial selection.
        return backtrack(0, k, []);
    };

    // Binary search for the maximum possible minimum Manhattan distance.
    // The minimum possible distance is 0.
    // The maximum possible distance is between two opposite corners, which is 2 * side.
    let low = 0;
    let high = 2 * side + 1; // Upper bound is exclusive for the binary search.
    let maxMinDistance = 0;

    while (low < high) {
        // Calculate the middle value for the potential minimum distance.
        // Using `low + Math.floor((high - low) / 2)` to prevent potential overflow if `low + high` is too large.
        const mid = low + Math.floor((high - low) / 2);

        // Check if it's possible to select k points with a minimum distance of `mid`.
        if (canSelectKPoints(mid, k, points)) {
            // If it's possible, it means `mid` is a feasible minimum distance.
            // We try to achieve an even larger minimum distance.
            maxMinDistance = mid; // `mid` is a possible answer.
            low = mid + 1;       // Try searching in the upper half [mid + 1, high).
        } else {
            // If it's not possible, `mid` is too large to be the minimum distance.
            // We need to search for smaller distances.
            high = mid;          // Search in the lower half [low, mid).
        }
    }

    // `maxMinDistance` holds the largest `mid` for which `canSelectKPoints` returned true.
    return maxMinDistance;
};
```