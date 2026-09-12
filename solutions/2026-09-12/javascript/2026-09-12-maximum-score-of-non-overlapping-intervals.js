// Problem: Maximum Score of Non-overlapping Intervals
// Link: https://leetcode.com/problems/maximum-score-of-non-overlapping-intervals/
//
// Approach:
// This problem asks for the lexicographically smallest set of indices of at most 4 non-overlapping intervals that yield the maximum total weight.
// Since we are limited to at most 4 intervals, we can use dynamic programming.
// The state of our DP can be defined as dp[k][last_end_time], representing the maximum score achievable using 'k' non-overlapping intervals, where the last chosen interval ends at 'last_end_time'.
// However, the 'last_end_time' can be very large (up to 10^9), making this state space infeasible.
//
// A key observation is that the relevant end times are the end times of the intervals themselves. If we sort the intervals by their end times, we can build up our DP solution.
//
// Let's refine the DP state: dp[k][i] will store a pair: [maximum_score, lexicographically_smallest_indices_list] using 'k' intervals, where the k-th interval is interval 'i' (after sorting by end time).
//
// We need to sort the intervals by their end times. If end times are equal, sort by start times to handle boundary cases correctly and ensure consistent DP transitions.
// After sorting, we iterate through each interval 'i' and consider it as the k-th interval in our selection.
// To select interval 'i' as the k-th interval, we need to find a previous interval 'j' (where j < i) such that interval 'j' ends before interval 'i' starts (intervals[j][1] < intervals[i][0]).
// Among all such valid 'j', we pick the one that maximizes the score (dp[k-1][j][0]) and then append interval 'i' to its indices list. If scores are equal, we choose the one with the lexicographically smaller indices list.
//
// We will maintain an array of DP states for each number of intervals chosen (1 to 4).
// dp[k][i]: [score, indices_list] using k intervals, with the k-th interval being the i-th interval (after sorting by end time).
//
// Base case: For k=1, dp[1][i] = [intervals[i][2], [i]].
//
// Transition: For k from 2 to 4, and for each interval 'i':
// Iterate through all previous intervals 'j' (0 <= j < i).
// If intervals[j][1] < intervals[i][0]:
//   Calculate potential_score = dp[k-1][j][0] + intervals[i][2]
//   potential_indices = dp[k-1][j][1] concatenated with [i]
//   Compare potential_score and potential_indices with the current best for dp[k][i].
//   If potential_score > current_best_score: update dp[k][i].
//   If potential_score == current_best_score and potential_indices is lexicographically smaller: update dp[k][i].
//
// After filling the DP table, find the maximum score across all dp[k][i] for k from 1 to 4. Among those with the maximum score, return the lexicographically smallest indices list.
//
// To handle the lexicographically smallest indices, we need a helper function to compare two arrays of indices.
//
// The problem asks for the *original* indices. So, when sorting intervals, we should store their original indices.
//
// Let's refine the DP state again. Instead of dp[k][i], let's use dp[k][end_time] where end_time is one of the interval end times. This is still too large.
//
// The constraint of "at most 4 non-overlapping intervals" is critical. This suggests that we can perhaps try all combinations of 4 intervals and check for overlaps, but that would be O(N^4 * logN) or O(N^4) which is too slow given N=5*10^4.
//
// Let's reconsider the DP. Since N is large, the DP state cannot depend directly on N for its size if N is one of the dimensions.
//
// The maximum number of intervals is 4. This suggests that the DP state could be dp[number_of_intervals_chosen][index_of_current_interval].
//
// Let's add original indices to the intervals and sort them by end time.
//
// `sorted_intervals` will be an array of `[l, r, weight, original_index]`.
// Sort `sorted_intervals` by `r`, then by `l`.
//
// `dp[k][i]` = `{ score: number, indices: number[] }` representing the max score and indices using `k` intervals, where the `k`-th interval chosen is `sorted_intervals[i]`.
//
// `dp` will be an array of arrays. `dp[k]` will store the DP states for selecting `k` intervals.
// `dp[k]` will be a map or an array where the index corresponds to the index in `sorted_intervals`.
//
// For `k = 1`:
// `dp[1][i] = { score: sorted_intervals[i][2], indices: [sorted_intervals[i][3]] }` for all `i`.
//
// For `k` from 2 to 4:
// For each interval `i` (current interval to be the `k`-th chosen):
//   Iterate through all previous intervals `j` (0 <= j < i) that can precede `i`.
//   Condition for non-overlapping: `sorted_intervals[j][1] < sorted_intervals[i][0]`.
//   If `dp[k-1][j]` is valid (meaning `k-1` intervals could be formed ending with `j`):
//     `current_score = dp[k-1][j].score + sorted_intervals[i][2]`
//     `current_indices = [...dp[k-1][j].indices, sorted_intervals[i][3]]`
//
//     Compare `current_score` and `current_indices` with the best found so far for `dp[k][i]`.
//     If `current_score > best_score_for_k_i`: update `dp[k][i]`.
//     If `current_score == best_score_for_k_i` and `current_indices` is lexicographically smaller: update `dp[k][i]`.
//
// The issue here is that for a fixed `k` and `i`, we need to iterate over all `j < i`. This makes the transition O(N^2) for each `k`. Total O(4 * N^2), which is still too slow for N=5*10^4.
//
// We need a faster way to find the best preceding interval `j`.
//
// For a fixed `k` and `i`, we are looking for `max(dp[k-1][j].score)` among all `j < i` where `sorted_intervals[j][1] < sorted_intervals[i][0]`.
// This looks like a range maximum query problem.
//
// Let's consider the DP state: `dp[k][i]` = the best result `{score, indices}` using `k` intervals, where the `k`-th interval *ends at or before* `sorted_intervals[i][1]`.
// This is still problematic because we need the exact end time to ensure non-overlap with the *next* interval.
//
// What if we iterate through the sorted intervals and for each interval, we consider it as the *last* chosen interval?
//
// Let `dp[k]` be an array of "best solutions" using `k` intervals.
// `dp[k][i]` = `{score, indices}` using `k` intervals, where the `k`-th interval is `sorted_intervals[i]`.
//
// To optimize finding the best `j` for `dp[k][i]`, when considering `sorted_intervals[i]` as the `k`-th interval, we need to find the best `dp[k-1][j]` such that `sorted_intervals[j][1] < sorted_intervals[i][0]`.
//
// Since `sorted_intervals` is sorted by end times, if `sorted_intervals[j][1] < sorted_intervals[i][0]`, then all intervals `j'` where `j' <= j` also satisfy this condition if `sorted_intervals[j'][1] <= sorted_intervals[j][1]`.
//
// We can precompute for each `i`, the index `prev_idx[i]` which is the largest index `j < i` such that `sorted_intervals[j][1] < sorted_intervals[i][0]`. This can be done using binary search (or `upper_bound` logic) on the end times.
//
// For each `i` from 0 to N-1:
//   `prev_idx[i] = binary_search_for_largest_j(sorted_intervals, i, sorted_intervals[i][0])`
//   `prev_idx[i]` will be the index such that `sorted_intervals[prev_idx[i]][1] < sorted_intervals[i][0]`. If no such `j` exists, it will be -1.
// This precomputation takes O(N log N).
//
// Now, for `k` from 1 to 4:
//   `dp[k]` will store the best `{score, indices}` results ending with each interval `i`.
//   For `k = 1`:
//     `dp[1][i] = { score: sorted_intervals[i][2], indices: [sorted_intervals[i][3]] }` for all `i`.
//   For `k` from 2 to 4:
//     For `i` from 0 to N-1:
//       If `prev_idx[i] == -1`, then `i` cannot be the `k`-th interval if `k > 1`, so `dp[k][i]` remains uninitialized or marked as invalid.
//       Else:
//         `j = prev_idx[i]`
//         We need to find the best result among `dp[k-1][p]` where `p <= j`.
//         This means we need to efficiently query for the maximum score and lexicographically smallest indices from `dp[k-1][0]` to `dp[k-1][j]`.
//
// This still requires a range query on the DP states.
//
// Let's redefine `dp[k]` as a structure that efficiently answers: "What is the best `{score, indices}` using `k` intervals that ends at or before a given end time `T`?"
// This is getting complicated.
//
// What if we don't sort by end time but by start time?
//
// Let's consider the problem from the perspective of selecting *up to* 4 intervals.
//
// The constraint of "at most 4" is key. This suggests something like:
// `dp[count][last_interval_index]` = `{max_score, indices_list}`
// `count` goes from 1 to 4.
// `last_interval_index` goes from 0 to N-1.
//
// Let's augment intervals with original indices: `[l, r, weight, original_index]`
// Sort intervals by `r`, then `l`.
//
// `dp[k][i]` = `{score: number, indices: number[]}`: best result using `k` intervals, where the `k`-th interval chosen is `sorted_intervals[i]`.
//
// `N = intervals.length`
// `sorted_intervals = intervals.map((interval, index) => [...interval, index])`
// `sorted_intervals.sort((a, b) => { if (a[1] !== b[1]) return a[1] - b[1]; return a[0] - b[0]; })`
//
// `dp = Array(5).fill(0).map(() => Array(N).fill(null))` // dp[k][i]
//
// Function to compare two results `{score, indices}` for lexicographical order.
// `compareResults(res1, res2)`: returns -1 if res1 < res2, 1 if res1 > res2, 0 if equal.
// Comparison criteria:
// 1. Higher score is better.
// 2. If scores are equal, lexicographically smaller indices list is better.
//
// `compareIndices(indices1, indices2)`: returns -1 if indices1 < indices2, 1 if indices1 > indices2.
//
// `for (let i = 0; i < N; i++) {`
//   `// Base case: k = 1`
//   `dp[1][i] = { score: sorted_intervals[i][2], indices: [sorted_intervals[i][3]] }`
// `}`
//
// `for (let k = 2; k <= 4; k++) {`
//   `for (let i = 0; i < N; i++) {`
//     `let best_prev_result = { score: -1, indices: [] }` // Sentinel for comparison
//     `for (let j = 0; j < i; j++) {`
//       `// Check for non-overlap: sorted_intervals[j][1] < sorted_intervals[i][0]`
//       `if (sorted_intervals[j][1] < sorted_intervals[i][0]) {`
//         `if (dp[k-1][j] !== null) {`
//           `if (compareResults(dp[k-1][j], best_prev_result) > 0) {` // If dp[k-1][j] is better
//             `best_prev_result = dp[k-1][j]`
//           `}`
//         `}`
//       `}`
//     `}`
//
//     `if (best_prev_result.score !== -1) {`
//       `const current_score = best_prev_result.score + sorted_intervals[i][2]`
//       `const current_indices = [...best_prev_result.indices, sorted_intervals[i][3]]`
//
//       `// Now, compare this new potential result with the current best for dp[k][i]`
//       `if (dp[k][i] === null || compareResults({ score: current_score, indices: current_indices }, dp[k][i]) > 0) {`
//         `dp[k][i] = { score: current_score, indices: current_indices }`
//       `}`
//     `}`
//   `}`
// `}`
//
// This O(4 * N^2) approach is still too slow.
//
// Let's think about the transition: `dp[k][i]` depends on `max(dp[k-1][j])` for `j < i` and `sorted_intervals[j][1] < sorted_intervals[i][0]`.
//
// The condition `sorted_intervals[j][1] < sorted_intervals[i][0]` is the bottleneck.
//
// If we are calculating `dp[k][i]`, we are looking for the best previous state `dp[k-1][j]` such that `sorted_intervals[j]` ends before `sorted_intervals[i]` starts.
//
// Key Insight: For a fixed `k`, as we iterate through `i`, the condition `sorted_intervals[j][1] < sorted_intervals[i][0]` is related to the start time of `sorted_intervals[i]`.
//
// We need to efficiently query the best `{score, indices}` from `dp[k-1]` for intervals ending *before* a certain time.
//
// Let's use a data structure that can maintain the best `{score, indices}` found so far for `dp[k-1]` and query it based on the end time.
//
// When we are computing `dp[k][i]`, we need to query `dp[k-1]` for all intervals `j` that end before `sorted_intervals[i][0]`.
//
// Consider `k=2`. We iterate through `i`. For `dp[2][i]`, we need the best `dp[1][j]` where `sorted_intervals[j][1] < sorted_intervals[i][0]`.
//
// We can use a segment tree or a Fenwick tree (BIT) if the values were just scores. But we also need the indices and lexicographical comparison.
//
// Since we have only 4 intervals, maybe we can iterate through possible `k` values (1 to 4) and for each `k`, iterate through all intervals `i`.
// For each `i`, we want to find the best `j < i` such that `sorted_intervals[j][1] < sorted_intervals[i][0]`.
//
// Let's consider the set of all possible end times. Let `E` be the set of all unique end times of intervals.
// Sort `sorted_intervals` by `r`.
//
// For `k` from 1 to 4:
//   `current_dp_states`: A list of `{score, indices}` for intervals chosen as the `k`-th interval.
//   `previous_dp_states`: The list of `{score, indices}` for intervals chosen as the `(k-1)`-th interval.
//
//   Let's maintain `max_score_ending_at_or_before_time[t]` for `dp[k-1]`.
//   This still needs to handle indices.
//
//   We need a data structure that supports:
//   1. Add an item: `{score, indices, end_time}` for `dp[k-1]`.
//   2. Query for the best item whose `end_time < query_time`.
//
//   The query time is `sorted_intervals[i][0]`.
//   The items to query from are `dp[k-1][j]` where `sorted_intervals[j][1] < sorted_intervals[i][0]`.
//
//   Consider the unique end times. If we map these end times to indices, we might use a data structure.
//   The number of unique end times can be up to N.
//
//   Let's maintain `best_results_k_minus_1` which is a list of `{score, indices, end_time}`.
//   When considering `sorted_intervals[i]` for `dp[k][i]`:
//     We query `best_results_k_minus_1` for all entries whose `end_time < sorted_intervals[i][0]`.
//     From the results, pick the one with max score, then lexicographically smallest indices.
//     Then form `dp[k][i] = { score: best_prev.score + sorted_intervals[i][2], indices: [...best_prev.indices, sorted_intervals[i][3]] }`.
//
//   To optimize the query:
//   We can iterate through `i`. For each `i`, we are looking for `max(dp[k-1][j])` where `sorted_intervals[j][1] < sorted_intervals[i][0]`.
//
//   Let `dp[k]` be a structure that stores `k`-interval solutions.
//   When computing for `k` intervals:
//     We can use a data structure (e.g., a sorted list or balanced BST, or Fenwick tree on compressed coordinates) that keeps track of the best solutions ending at various points.
//
//     Let's use a technique where we iterate through the sorted intervals and update a data structure.
//
//     For `k = 1` to `4`:
//       `data_structure_for_k_minus_1` // Stores best {score, indices} achieved by k-1 intervals, indexed by end_time.
//       `data_structure_for_k` // Stores best {score, indices} achieved by k intervals, indexed by end_time.
//
//       Initialize `data_structure_for_k_minus_1` based on the previous step's results.
//
//       Iterate through `sorted_intervals` `i = 0` to `N-1`:
//         `current_interval = sorted_intervals[i]`
//         `current_l = current_interval[0]`, `current_r = current_interval[1]`, `current_w = current_interval[2]`, `current_orig_idx = current_interval[3]`
//
//         // Query `data_structure_for_k_minus_1` for the best result ending before `current_l`.
//         // Let this best result be `prev_best = {score: prev_score, indices: prev_indices}`.
//         `prev_best = query(data_structure_for_k_minus_1, ending_before=current_l)`
//
//         `if (prev_best.score !== -1) {`
//           `new_score = prev_score + current_w`
//           `new_indices = [...prev_indices, current_orig_idx]`
//           `new_result = { score: new_score, indices: new_indices }`
//
//           // Add this new result to `data_structure_for_k`.
//           // The "key" for adding to the data structure is `current_r` (end time of the current interval).
//           // We need to update the structure at `current_r` with `new_result`.
//           // If `new_result` is better than what's already there for end time `current_r`, update it.
//           `update(data_structure_for_k, end_time=current_r, result=new_result)`
//         `}`
//
//       // After iterating through all `i`, `data_structure_for_k` contains potential solutions.
//       // We also need to consider solutions that don't include the i-th interval for `dp[k]`.
//       // This means `data_structure_for_k` should effectively store the best result ending *at or before* a given time.
//
//   The data structure needs to handle point updates and prefix maximum queries.
//   A Fenwick tree (BIT) or Segment Tree can work if we compress the coordinates (start and end times).
//   The relevant coordinates are `sorted_intervals[i][0]` (start times) and `sorted_intervals[i][1]` (end times).
//   Collect all `l` and `r` values. Sort them and remove duplicates. Map them to indices.
//
//   Let `coords` be the sorted unique start and end points. Size of `coords` can be up to 2N.
//   Map each `l` and `r` to its index in `coords`.
//
//   For each `k` from 1 to 4:
//     Initialize `BIT_k` (a Fenwick tree) of size `coords.length`.
//     `BIT_k` will store the best `{score, indices}` ending at or before a coordinate.
//     Each node in `BIT_k` will store `{score, indices}`.
//
//     `previous_results_for_k_minus_1`: A list of `{score, indices, original_end_time}` from the previous iteration.
//
//     Iterate through `sorted_intervals[i]`:
//       `l = sorted_intervals[i][0]`, `r = sorted_intervals[i][1]`, `w = sorted_intervals[i][2]`, `orig_idx = sorted_intervals[i][3]`
//
//       // Query for best k-1 interval ending before `l`.
//       // Find the coordinate index `idx_l` corresponding to `l`.
//       // Query `BIT_{k-1}` up to `idx_l - 1`.
//       `best_prev = query(BIT_{k-1}, idx_l - 1)`
//
//       `if (best_prev.score !== -1) {`
//         `new_score = best_prev.score + w`
//         `new_indices = [...best_prev.indices, orig_idx]`
//         `new_result = { score: new_score, indices: new_indices }`
//
//         // Update `BIT_k` at the coordinate index for `r`.
//         // `idx_r = find_index_of_coordinate(r)`
//         `update(BIT_k, idx_r, new_result)`
//       `}`
//
//     // After processing all `i` for the current `k`, `BIT_k` contains information.
//     // We need to ensure that `BIT_k` also propagates maximums to the right.
//     // For example, the best solution ending at coordinate `c` should also be considered as a solution ending at coordinate `c+1`.
//     // This means the BIT should be structured to handle prefix maximums.
//     // For each coordinate `x`, `BIT_k[x]` should store the best solution ending *at or before* coordinate `x`.
//
//     // This requires a "segment tree" like structure rather than a simple BIT.
//     // Or, we can post-process the BIT: `BIT_k[i] = max(BIT_k[i], BIT_k[i-1])`.
//
//   The coordinates approach:
//   1. Collect all `l` and `r` values from `intervals`.
//   2. Create a sorted unique list of these coordinates: `unique_coords`.
//   3. Create a map from coordinate value to its index in `unique_coords`.
//   4. Sort `intervals` by `r`, then `l`. Store original index: `[l, r, w, orig_idx]`.
//
//   Let `dp[k]` be a segment tree. Each node in the segment tree covers a range of indices in `unique_coords`.
//   Each node stores the best `{score, indices}` for intervals that *end* within the coordinate range covered by that node.
//
//   When considering `sorted_intervals[i] = [l, r, w, orig_idx]`:
//     Find the coordinate index for `l`: `idx_l = coord_to_idx[l]`.
//     Find the coordinate index for `r`: `idx_r = coord_to_idx[r]`.
//
//     For `k = 1` to `4`:
//       `segment_tree_k`: Stores best `{score, indices}` for `k` intervals, indexed by *end coordinate index*.
//       `prev_seg_tree = segment_tree_{k-1}`
//
//       // Query `prev_seg_tree` for the best result ending strictly before `l`.
//       // This means querying the range of coordinate indices `[0, idx_l - 1]`.
//       `best_prev = query_segment_tree(prev_seg_tree, 0, idx_l - 1)`
//
//       `if (best_prev.score !== -1) {`
//         `new_score = best_prev.score + w`
//         `new_indices = [...best_prev.indices, orig_idx]`
//         `new_result = { score: new_score, indices: new_indices }`
//
//         // Update `segment_tree_k` at `idx_r` with `new_result`.
//         // The update should be `max` with existing value and handle lexicographical comparison.
//         `update_segment_tree(segment_tree_k, idx_r, new_result)`
//       `}`
//
//   The segment tree approach is `O(4 * N log N)`.
//   The coordinate compression step is `O(N log N)`.
//   The segment tree operations (query and update) take `O(log M)` where M is the number of unique coordinates (at most 2N).
//   Total time: `O(N log N + 4 * N * log N) = O(N log N)`.
//   Space: `O(N)` for storing coordinates and `O(N)` for segment tree nodes. Total `O(N)`.
//
//   This seems like a viable approach.
//
//   Detailed plan for segment tree:
//   1. Create an array `events` by combining all `l` and `r` coordinates. Add `l` as a "start" event and `r` as an "end" event.
//      This is not directly how it's used. The coordinates are just for discretizing the timeline.
//
//   Let's use the unique coordinates:
//   `all_coords = new Set()`
//   `intervals.forEach(([l, r, w]) => { all_coords.add(l); all_coords.add(r); })`
//   `unique_coords = Array.from(all_coords).sort((a, b) => a - b)`
//   `coord_to_idx = new Map()`
//   `unique_coords.forEach((coord, index) => coord_to_idx.set(coord, index))`
//   `M = unique_coords.length`
//
//   Sort `intervals` by `r` then `l`.
//   `sorted_intervals = intervals.map((interval, index) => [...interval, index])`
//   `sorted_intervals.sort((a, b) => { if (a[1] !== b[1]) return a[1] - b[1]; return a[0] - b[0]; })`
//
//   `dp_states = Array(5)` // dp_states[k] will be a segment tree for k intervals.
//   Each segment tree will store `{score, indices}`.
//   The segment tree will operate on indices `0` to `M-1`.
//   Initialize `dp_states[0]` as a base representing 0 intervals (score -1, empty indices).
//   `dp_states[0]` is effectively a dummy segment tree with a single node for `{-1, []}`.
//
//   Need a helper `compareResults(res1, res2)` that returns > 0 if `res1` is better.
//   `compareResults = (res1, res2) => {`
//     `if (res1.score !== res2.score) return res1.score - res2.score;`
//     `// Compare indices lexicographically`
//     `for (let i = 0; i < Math.max(res1.indices.length, res2.indices.length); i++) {`
//       `v1 = res1.indices[i] === undefined ? -Infinity : res1.indices[i];`
//       `v2 = res2.indices[i] === undefined ? -Infinity : res2.indices[i];`
//       `if (v1 !== v2) return v1 - v2;`
//     `}`
//     `return 0; // Equal`
//   `}`
//
//   `// A simplified compare function for segment tree updates`
//   `// returns true if res1 is strictly better than res2`
//   `isStrictlyBetter = (res1, res2) => {`
//     `if (res1.score === -1) return false; // Sentinel`
//     `if (res2.score === -1) return true; // Anything is better than sentinel`
//     `if (res1.score !== res2.score) return res1.score > res2.score;`
//     `// Compare indices lexicographically`
//     `for (let i = 0; i < Math.max(res1.indices.length, res2.indices.length); i++) {`
//       `v1 = res1.indices[i] === undefined ? -Infinity : res1.indices[i];`
//       `v2 = res2.indices[i] === undefined ? -Infinity : res2.indices[i];`
//       `if (v1 !== v2) return v1 > v2;`
//     `}`
//     `return false; // Equal`
//   `}`
//
//   Need a Segment Tree implementation that supports:
//   1. `build(size)`: Creates a segment tree of given size, initialized with `{-1, []}`.
//   2. `query(range_start, range_end)`: Returns the best `{score, indices}` in the given range.
//   3. `update(index, new_result)`: Updates the value at `index`. The update should take the maximum based on `isStrictlyBetter`.
//
//   The segment tree will store the best result ending *at or before* a given coordinate index.
//   So `tree[node]` will store `max(all valid results whose end_coord_idx <= node_max_coord_idx)`.
//   This means the segment tree needs to propagate maximums upwards.
//
//   Let's use a simpler approach for segment tree updates/queries.
//   Each leaf `i` in the segment tree will correspond to `unique_coords[i]`.
//   `tree[leaf_i]` stores the best result that *ends exactly at* `unique_coords[i]`.
//   The query `query(0, idx_l - 1)` will then need to find the max in the range.
//   The structure should be: `tree[node]` stores the best result among all leaves in its range.
//   `query(node, node_l, node_r, query_l, query_r)`
//   `update(node, node_l, node_r, index_to_update, new_result)`
//
//   After calculating `new_result` for `sorted_intervals[i]`, we `update` the segment tree for `k` at `idx_r` with `new_result`.
//   Crucially, the segment tree should maintain prefix maximums. This means after each update at `idx_r`, we must propagate this best value to higher nodes.
//   Specifically, when we update `tree[idx_r]`, we need to ensure that `tree[parent_of_idx_r]` reflects the best value in its range, which might now come from `idx_r`.
//
//   The segment tree can be implemented such that `query(range)` finds the max in that range.
//   And `update(index, value)` updates the leaf and propagates the maximum up.
//
//   Example structure for Segment Tree node:
//   `Node { score: number, indices: number[] }`
//   `DEFAULT_NODE = { score: -1, indices: [] }`
//
//   `SegmentTree` class:
//   `constructor(size)`: `this.tree = Array(4 * size).fill(DEFAULT_NODE)`
//   `combine(node1, node2)`: returns the better of `node1`, `node2` using `isStrictlyBetter`.
//   `update(idx, val)`: updates `tree[idx]` and propagates.
//   `query(l, r)`: queries range `[l, r]`.
//
//   Main loop:
//   `best_overall_result = { score: -1, indices: [] }`
//
//   `dp_trees = Array(5).fill(0).map((_, k) => new SegmentTree(M))`
//
//   For `k` from 1 to 4:
//     For `[l, r, w, orig_idx]` in `sorted_intervals`:
//       `idx_l = coord_to_idx.get(l)`
//       `idx_r = coord_to_idx.get(r)`
//
//       `// Query for best k-1 intervals ending *strictly before* l.`
//       `// This means querying up to the coordinate index *before* idx_l.`
//       `// If idx_l is 0, no preceding interval is possible.`
//       `prev_best_result = { score: -1, indices: [] }`
//       `if (idx_l > 0) {`
//         `// The query range is [0, idx_l - 1].`
//         `prev_best_result = dp_trees[k-1].query(0, idx_l - 1)`
//       `}`
//
//       `if (prev_best_result.score !== -1) {`
//         `new_score = prev_best_result.score + w`
//         `new_indices = [...prev_best_result.indices, orig_idx]`
//         `new_result = { score: new_score, indices: new_indices }`
//
//         `// Update the segment tree for k intervals at index idx_r.`
//         `// The update should compare new_result with the current best at idx_r`
//         `// and also propagate the max to parent nodes.`
//         `dp_trees[k].update(idx_r, new_result)`
//
//         `// Update overall best result if this is better.`
//         `if (isStrictlyBetter(new_result, best_overall_result)) {`
//           `best_overall_result = new_result`
//         `}`
//       `}`
//
//     // After processing all intervals for a given `k`, the `dp_trees[k]` needs to represent
//     // the best result *ending at or before* a coordinate.
//     // This is achieved by making the segment tree query itself return the prefix maximum.
//     // The update should already propagate maximums correctly.
//
//   Final result: `best_overall_result.indices`.
//
//   Let's reconsider the `isStrictlyBetter` and `compareResults`. The problem asks for lexicographically smallest *indices*.
//   So, if scores are equal, we pick the one with smaller indices.
//   `isStrictlyBetter(res1, res2)`:
//     `if (res1.score !== res2.score) return res1.score > res2.score;`
//     `// Scores are equal, compare indices lexicographically`
//     `len1 = res1.indices.length, len2 = res2.indices.length`
//     `for (let i = 0; i < Math.max(len1, len2); i++) {`
//       `v1 = i < len1 ? res1.indices[i] : -Infinity; // Smaller indices are better`
//       `v2 = i < len2 ? res2.indices[i] : -Infinity;`
//       `if (v1 !== v2) return v1 < v2; // If v1 is smaller than v2, res1 is better`
//     `}`
//     `return false; // They are equal or res1 is not strictly better`
//
//   The segment tree needs to handle this comparison.
//   The `combine` function in segment tree:
//   `combine(node1, node2)`:
//     `if (node1.score === -1) return node2;`
//     `if (node2.score === -1) return node1;`
//     `if (node1.score > node2.score) return node1;`
//     `if (node2.score > node1.score) return node2;`
//     `// Scores are equal, compare indices lexicographically`
//     `// We want the lexicographically SMALLEST indices. So if node1.indices < node2.indices, node1 is better.`
//     `len1 = node1.indices.length, len2 = node2.indices.length;`
//     `for (let i = 0; i < Math.max(len1, len2); i++) {`
//       `v1 = i < len1 ? node1.indices[i] : Infinity; // Default to larger if one list is shorter`
//       `v2 = i < len2 ? node2.indices[i] : Infinity;`
//       `if (v1 !== v2) return v1 < v2 ? node1 : node2;`
//     `}`
//     `return node1; // They are equal`
//
//   The `update` function in segment tree needs to correctly update a leaf and propagate the `combine` result upwards.
//   The `query` function needs to traverse the tree and combine results from relevant nodes.
//
//   Base case `k=1`:
//   For each `[l, r, w, orig_idx]` in `sorted_intervals`:
//     `idx_r = coord_to_idx.get(r)`
//     `result = { score: w, indices: [orig_idx] }`
//     `dp_trees[1].update(idx_r, result)`
//     `// Also update overall best result.`
//     `if (combine(result, best_overall_result) === result) {`
//       `best_overall_result = result`
//     `}`
//
//   This update strategy seems right.
//   The `update` function in segment tree:
//   `update(node, node_l, node_r, target_idx, new_val)`
//     `if (node_l === node_r) {`
//       `this.tree[node] = this.combine(this.tree[node], new_val);`
//       `return;`
//     `}`
//     `mid = Math.floor((node_l + node_r) / 2);`
//     `if (target_idx <= mid) {`
//       `this.update(2 * node + 1, node_l, mid, target_idx, new_val);`
//     `} else {`
//       `this.update(2 * node + 2, mid + 1, node_r, target_idx, new_val);`
//     `}`
//     `this.tree[node] = this.combine(this.tree[2 * node + 1], this.tree[2 * node + 2]);`
//
//   The `query` function in segment tree:
//   `query(node, node_l, node_r, query_l, query_r)`
//     `if (query_l > query_r) return DEFAULT_NODE;`
//     `if (query_l === node_l && query_r === node_r) return this.tree[node];`
//     `mid = Math.floor((node_l + node_r) / 2);`
//     `left_res = this.query(2 * node + 1, node_l, mid, query_l, Math.min(query_r, mid));`
//     `right_res = this.query(2 * node + 2, mid + 1, node_r, Math.max(query_l, mid + 1), query_r);`
//     `return this.combine(left_res, right_res);`
//
//   Initial best_overall_result should be `{score: -1, indices: []}`.
//   The comparison logic needs to be consistent. When `isStrictlyBetter(res1, res2)` is used, it should return true if `res1` is strictly better.
//   When `combine(res1, res2)` is used, it should return the better of the two.
//   The problem statement says "lexicographically smallest array of at most 4 indices from intervals with maximum score".
//   So, highest score first. If scores are tied, pick the one with lexicographically smallest indices.
//
//   `combine(res1, res2)`:
//     `if (res1.score === -1) return res2;`
//     `if (res2.score === -1) return res1;`
//     `if (res1.score !== res2.score) return res1.score > res2.score ? res1 : res2;`
//     `// Scores are equal, choose lexicographically smallest indices`
//     `len1 = res1.indices.length, len2 = res2.indices.length;`
//     `for (let i = 0; i < Math.max(len1, len2); i++) {`
//       `v1 = i < len1 ? res1.indices[i] : Infinity;`
//       `v2 = i < len2 ? res2.indices[i] : Infinity;`
//       `if (v1 !== v2) return v1 < v2 ? res1 : res2;`
//     `}`
//     `return res1; // Equal`
//
//   The `update` function should incorporate `combine`. `this.tree[node] = this.combine(this.tree[node], new_val);`
//   The `query` function should also combine results.
//   The initial `best_overall_result` should be `{ score: -1, indices: [] }`.
//
//   The `k=1` loop needs to update `best_overall_result` correctly.
//   Inside `k=1` loop:
//     `result = { score: w, indices: [orig_idx] }`
//     `dp_trees[1].update(idx_r, result)`
//     `// Update overall best result`
//     `if (combine(result, best_overall_result) === result) {`
//       `best_overall_result = result`
//     `}`
//
//   This seems to cover the logic correctly.

// Helper function to compare two results for the segment tree.
// It returns the "better" of the two results, prioritizing higher score,
// and then lexicographically smaller indices.
// Sentinel result: { score: -1, indices: [] }
function combineResults(res1, res2) {
    if (res1.score === -1) return res2;
    if (res2.score === -1) return res1;

    if (res1.score !== res2.score) {
        return res1.score > res2.score ? res1 : res2;
    }

    // Scores are equal, choose lexicographically smallest indices
    const len1 = res1.indices.length;
    const len2 = res2.indices.length;
    const maxLen = Math.max(len1, len2);

    for (let i = 0; i < maxLen; i++) {
        const v1 = i < len1 ? res1.indices[i] : Infinity; // Use Infinity for shorter lists to ensure comparison
        const v2 = i < len2 ? res2.indices[i] : Infinity;
        if (v1 !== v2) {
            return v1 < v2 ? res1 : res2;
        }
    }
    return res1; // Results are equal
}

// Segment Tree implementation
class SegmentTree {
    constructor(size) {
        // The tree array size is typically 4 * size for a 0-indexed array of size.
        // Initialize with a sentinel result representing no intervals chosen.
        this.DEFAULT_NODE = { score: -1, indices: [] };
        this.tree = Array(4 * size).fill(this.DEFAULT_NODE);
        this.size = size;
    }

    // Combines two node results. This is the same as combineResults.
    combine(res1, res2) {
        return combineResults(res1, res2);
    }

    // Updates the value at a specific index.
    // The update function ensures that the tree maintains the maximum combined result
    // at each node, propagating updates upwards.
    update(targetIndex, newValue) {
        this._update(0, 0, this.size - 1, targetIndex, newValue);
    }

    _update(nodeIndex, nodeStart, nodeEnd, targetIndex, newValue) {
        // If we've reached the leaf node corresponding to the target index
        if (nodeStart === nodeEnd) {
            // Update the leaf node by combining its current value with the new value.
            // This handles cases where multiple intervals might end at the same coordinate,
            // and we want the best result.
            this.tree[nodeIndex] = this.combine(this.tree[nodeIndex], newValue);
            return;
        }

        const mid = Math.floor((nodeStart + nodeEnd) / 2);
        const leftChildIndex = 2 * nodeIndex + 1;
        const rightChildIndex = 2 * nodeIndex + 2;

        // Determine which child subtree to recurse into
        if (targetIndex <= mid) {
            this._update(leftChildIndex, nodeStart, mid, targetIndex, newValue);
        } else {
            this._update(rightChildIndex, mid + 1, nodeEnd, targetIndex, newValue);
        }

        // After updating a child, recalculate the value for the current node.
        // The current node's value is the combination of its children's values.
        this.tree[nodeIndex] = this.combine(this.tree[leftChildIndex], this.tree[rightChildIndex]);
    }

    // Queries the maximum result within a given range [queryStart, queryEnd].
    query(queryStart, queryEnd) {
        // If the query range is invalid, return the default sentinel.
        if (queryStart > queryEnd) {
            return this.DEFAULT_NODE;
        }
        return this._query(0, 0, this.size - 1, queryStart, queryEnd);
    }

    _query(nodeIndex, nodeStart, nodeEnd, queryStart, queryEnd) {
        // If the current node's range is completely outside the query range
        if (nodeEnd < queryStart || nodeStart > queryEnd) {
            return this.DEFAULT_NODE;
        }

        // If the current node's range is completely within the query range
        if (queryStart <= nodeStart && nodeEnd <= queryEnd) {
            return this.tree[nodeIndex];
        }

        // If the current node's range partially overlaps with the query range
        const mid = Math.floor((nodeStart + nodeEnd) / 2);
        const leftChildIndex = 2 * nodeIndex + 1;
        const rightChildIndex = 2 * nodeIndex + 2;

        // Recursively query the left and right children and combine their results.
        const leftResult = this._query(leftChildIndex, nodeStart, mid, queryStart, queryEnd);
        const rightResult = this._query(rightChildIndex, mid + 1, nodeEnd, queryStart, queryEnd);

        return this.combine(leftResult, rightResult);
    }
}

/**
 * @param {number[][]} intervals
 * @return {number[]}
 */
var maxScoreAndIndices = function(intervals) {
    // Collect all unique start and end coordinates to discretize them.
    const allCoords = new Set();
    intervals.forEach(([l, r, _]) => {
        allCoords.add(l);
        allCoords.add(r);
    });

    // Sort the unique coordinates and create a mapping from coordinate value to its index.
    const uniqueCoords = Array.from(allCoords).sort((a, b) => a - b);
    const coordToIdx = new Map();
    uniqueCoords.forEach((coord, index) => coordToIdx.set(coord, index));
    const M = uniqueCoords.length; // Number of unique coordinates.

    // Augment intervals with their original indices and sort them by end time (r), then start time (l).
    const sortedIntervals = intervals.map((interval, index) => [...interval, index]);
    sortedIntervals.sort((a, b) => {
        if (a[1] !== b[1]) return a[1] - b[1]; // Sort by end time (r)
        return a[0] - b[0]; // If end times are equal, sort by start time (l)
    });

    // dpTrees[k] will be a segment tree storing the best {score, indices} for selecting k intervals,
    // indexed by the *coordinate index* of the end time of the k-th interval.
    // We need k from 0 to 4. dpTrees[0] is a conceptual base for 0 intervals.
    const dpTrees = Array(5).fill(0).map((_, k) => new SegmentTree(M));

    // This will store the overall best result found across all k values and all intervals.
    let bestOverallResult = { score: -1, indices: [] };

    // Iterate through each possible number of intervals (k) from 1 to 4.
    for (let k = 1; k <= 4; k++) {
        // Iterate through each interval in the sorted list.
        // This interval will be considered as the k-th chosen interval.
        for (const [l, r, w, originalIndex] of sortedIntervals) {
            // Get the coordinate index for the start (l) and end (r) times of the current interval.
            const idxL = coordToIdx.get(l);
            const idxR = coordToIdx.get(r);

            // Query the segment tree for k-1 intervals (dpTrees[k-1]) to find the best
            // preceding non-overlapping interval.
            // We need intervals that end strictly before the current interval starts (l).
            // This means querying up to the coordinate index *before* idxL.
            // If idxL is 0, it means no preceding interval can exist.
            let bestPrevResult = { score: -1, indices: [] };
            if (idxL > 0) {
                // Query the range of coordinate indices [0, idxL - 1] from the (k-1)-th tree.
                // This finds the best result using k-1 intervals that ends at or before the coordinate
                // immediately preceding 'l'.
                bestPrevResult = dpTrees[k - 1].query(0, idxL - 1);
            }

            // If a valid preceding interval was found (bestPrevResult.score is not -1)
            if (bestPrevResult.score !== -1) {
                // Calculate the score and indices for the new selection including the current interval.
                const currentScore = bestPrevResult.score + w;
                const currentIndices = [...bestPrevResult.indices, originalIndex];
                const currentResult = { score: currentScore, indices: currentIndices };

                // Update the segment tree for k intervals (dpTrees[k]) at the coordinate index of the current interval's end time (idxR).
                // The update function will ensure that the best result ending at or before idxR is maintained,
                // considering the 'currentResult' and any existing results at idxR.
                dpTrees[k].update(idxR, currentResult);

                // Update the overall best result if the 'currentResult' is better than the current overall best.
                // The `combineResults` function handles the comparison logic (score then lexicographical indices).
                if (combineResults(currentResult, bestOverallResult) === currentResult) {
                    bestOverallResult = currentResult;
                }
            } else if (k === 1) {
                // Special case for k=1: The current interval is the first chosen interval.
                // There is no preceding interval required.
                const currentResult = { score: w, indices: [originalIndex] };

                // Update the segment tree for k=1 at the end coordinate idxR.
                dpTrees[k].update(idxR, currentResult);

                // Update the overall best result if this k=1 result is better.
                if (combineResults(currentResult, bestOverallResult) === currentResult) {
                    bestOverallResult = currentResult;
                }
            }
        }
    }

    // Return the lexicographically smallest array of indices from the overall best result.
    return bestOverallResult.indices;
};
```