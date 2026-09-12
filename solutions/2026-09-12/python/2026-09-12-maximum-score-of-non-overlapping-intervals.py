```python
# Problem: Maximum Score of Non-overlapping Intervals
# Link: https://leetcode.com/problems/maximum-score-of-non-overlapping-intervals/
# Approach:
# This problem asks for the lexicographically smallest set of indices for up to 4 non-overlapping intervals that maximize the total weight.
# Since we are limited to at most 4 intervals, this suggests a dynamic programming or a brute-force approach involving combinations.
# Given the constraint of at most 4 intervals, we can explore combinations of 1, 2, 3, and 4 intervals.
# To efficiently find non-overlapping intervals, we should sort the intervals. Sorting by the end time is a common strategy for interval problems.
# If we sort by end time, we can iterate through the sorted intervals and for each interval, find the best preceding non-overlapping interval.
# However, the lexicographically smallest index requirement makes a simple greedy or DP approach tricky.
# A more suitable approach for a small fixed number of selections (like 4) is to consider combinations.
#
# Let's refine the approach:
# 1. Augment intervals with their original indices: `(start, end, weight, original_index)`.
# 2. Sort intervals primarily by their end times. If end times are the same, sort by start times to break ties consistently. This helps in identifying non-overlapping intervals.
#
# The core challenge is selecting up to 4 intervals with maximum score and then finding the lexicographically smallest indices.
#
# Given the small number of allowed intervals (up to 4), a state-space search or dynamic programming approach based on the number of intervals chosen seems appropriate.
# Let dp[k][i] be the maximum score using k intervals, ending with interval i. This is still problematic due to the lexicographical requirement.
#
# A better approach for a small fixed 'k' (k=4) is to use DP where the state depends on the number of intervals chosen and the index of the last chosen interval.
# Let `dp[k][i]` store a tuple: `(maximum_score, lexicographically_smallest_indices)` for choosing exactly `k` non-overlapping intervals, where the `i`-th interval (in the sorted list) is the last chosen interval.
#
# To find the `i`-th interval, we need to find a preceding interval `j` such that `intervals[j].end < intervals[i].start`.
#
# The state transition would be:
# `dp[k][i] = (intervals[i].weight + dp[k-1][j].score, [intervals[i].original_index] + dp[k-1][j].indices)` for all valid `j < i`.
# We need to pick the `j` that maximizes `dp[k-1][j].score`, and among those, the one that leads to the lexicographically smallest combined `indices`.
#
# This DP approach has a high complexity. A different perspective might be needed.
#
# Since k is very small (<= 4), let's consider generating all possible combinations of non-overlapping intervals and then picking the best. This would be too slow if not optimized.
#
# Let's rethink the DP state for lexicographical order.
#
# `dp[k][i]` will store `(max_score, list_of_indices)` for choosing exactly `k` intervals ending at index `i` (in the original unsorted array). This is also complex to manage.
#
# The problem statement implies we can choose *up to* 4 intervals.
#
# Let's try a DP state: `dp[k][i]` = `(max_score, indices)` representing the maximum score and lexicographically smallest indices of choosing `k` non-overlapping intervals, where the `i`-th interval (in the *sorted* list by end time) is the *last* chosen interval.
#
# To compute `dp[k][i]`:
# Iterate through all `j < i`. If `intervals[j].end < intervals[i].start` (non-overlapping):
#   candidate_score = `intervals[i].weight + dp[k-1][j].score`
#   candidate_indices = `[intervals[i].original_index] + dp[k-1][j].indices`
#   Compare `candidate_score` with current `dp[k][i].score`.
#   If `candidate_score` is greater, update `dp[k][i]`.
#   If `candidate_score` is equal, compare `candidate_indices` lexicographically with `dp[k][i].indices` and update if smaller.
#
# Base case: `dp[1][i] = (intervals[i].weight, [intervals[i].original_index])` for all `i`.
#
# We need to handle `k=0` and `k=2, 3, 4`.
#
# The indices need to be sorted before comparing lexicographically.
#
# Let's define `intervals_with_indices` where each element is `(start, end, weight, original_index)`.
# Sort `intervals_with_indices` by end time. Let `N` be the number of intervals.
#
# `dp[k][i]` = `(score, indices_list)`
# `k` ranges from 1 to 4. `i` ranges from 0 to N-1.
#
# Initialization:
# `dp` table of size `5 x N`. Initialize all scores to -1 (or a very small number) and indices to empty lists.
#
# For `k = 1`:
#   For `i` from 0 to N-1:
#     `dp[1][i] = (intervals_with_indices[i][2], [intervals_with_indices[i][3]])`
#
# For `k` from 2 to 4:
#   For `i` from 0 to N-1:
#     current_max_score = -1
#     best_indices = []
#
#     # Find the best preceding non-overlapping interval 'j'
#     # We need to efficiently find 'j' such that intervals_with_indices[j][1] < intervals_with_indices[i][0]
#     # Since intervals are sorted by end time, we can iterate j from 0 to i-1.
#     # To optimize finding the best 'j' for a fixed 'i', we could use binary search or a segment tree,
#     # but for a fixed k, iterating through j is okay if we optimize the comparison.
#
#     for j in range(i):
#       # Check for non-overlap: interval j ends before interval i starts
#       if intervals_with_indices[j][1] < intervals_with_indices[i][0]:
#         prev_score, prev_indices = dp[k-1][j]
#         if prev_score != -1: # If a valid selection of k-1 intervals exists ending at j
#           current_total_score = intervals_with_indices[i][2] + prev_score
#           current_selection_indices = sorted(prev_indices + [intervals_with_indices[i][3]])
#
#           if current_total_score > current_max_score:
#             current_max_score = current_total_score
#             best_indices = current_selection_indices
#           elif current_total_score == current_max_score:
#             if not best_indices or current_selection_indices < best_indices:
#               best_indices = current_selection_indices
#
#     if current_max_score != -1:
#       dp[k][i] = (current_max_score, best_indices)
#
# After filling the DP table:
# Iterate through all `k` from 1 to 4 and all `i` from 0 to N-1.
# Find the overall maximum score and the corresponding lexicographically smallest indices.
#
# Time Complexity:
# Sorting: O(N log N)
# DP filling:
# Outer loops for k: 4 iterations.
# Inner loops for i and j: O(N^2) for each k.
# Inside the inner loop: list concatenation and sorting of indices. The number of indices is at most 4. Sorting 4 elements is O(1). Concatenation is O(1) for lists of size at most 3.
# Total DP time: O(4 * N^2) = O(N^2).
# Overall: O(N log N + N^2) = O(N^2).
# Given N up to 5 * 10^4, N^2 is too slow (2.5 * 10^9).
#
# The O(N^2) comes from the nested loops `i` and `j`. For a fixed `i`, we are looking for the best `j < i` that satisfies the non-overlapping condition.
#
# Optimization:
# For `dp[k][i]`, when considering interval `i`, we need to find `max(dp[k-1][j].score)` among all `j < i` where `intervals_with_indices[j][1] < intervals_with_indices[i][0]`.
#
# We can pre-calculate or efficiently query for the best preceding non-overlapping interval.
#
# Let's define `max_prev_dp[k_minus_1][end_time]` which stores `(score, indices)` for the best selection of `k-1` intervals ending at or before `end_time`. This is still tricky due to the `end_time` being continuous.
#
# A key observation might be that for a fixed `k`, as we iterate `i` (sorted by end time), the set of valid `j`s (non-overlapping) also progresses.
#
# Consider `dp[k][i]` as the max score and indices using `k` intervals, where the *last* interval chosen is `intervals_with_indices[i]`.
#
# For `k` from 2 to 4:
#   For `i` from 0 to N-1:
#     `current_interval_data = intervals_with_indices[i]`
#     `max_score_for_i = -1`
#     `best_indices_for_i = []`
#
#     # To find the best `j < i` where `intervals_with_indices[j][1] < current_interval_data[0]`:
#     # We can iterate `j` from 0 up to `i`. This is O(N^2).
#     # We need a way to find the best `dp[k-1][j]` efficiently.
#
#     # Let's try a slightly different DP state for optimization.
#     # `dp[k][i]` = max score using `k` intervals, with the `i`-th interval (sorted by end time) being the last one.
#
#     # The issue is efficiently finding the best `j`.
#     # For a fixed `i`, we are looking for `max(dp[k-1][j].score)` for `j` such that `intervals_with_indices[j].end < intervals_with_indices[i].start`.
#     # Since `intervals_with_indices` is sorted by `end` time, we can use binary search to find the last `j` that satisfies `intervals_with_indices[j].end < intervals_with_indices[i].start`.
#     # Let this index be `max_j_idx`. Then we need to query for the best `dp[k-1][p]` for `p <= max_j_idx`.
#
#     # This requires us to maintain the maximum score and best indices up to a certain point in the `dp[k-1]` table.
#
#     # Let's define `max_so_far_dp[k-1][idx]` = `(score, indices)` representing the best selection of `k-1` intervals using intervals from `0` to `idx` (in sorted list).
#
#     # For `k` from 2 to 4:
#     #   Initialize `max_so_far_dp[k-1]` array.
#     #   For `i` from 0 to N-1:
#     #     `current_interval = intervals_with_indices[i]`
#     #     # Find the index `p` such that `intervals_with_indices[p].end < current_interval.start`
#     #     # Use binary search (bisect_left) to find the first interval whose end time is >= current_interval.start
#     #     # The valid preceding intervals are those with end time strictly less than current_interval.start
#     #     # So we look for `p` such that `intervals_with_indices[p].end < current_interval.start`.
#     #     # `bisect_left` on end times will give us the index of the first interval whose end time is >= `current_interval.start`.
#     #     # So we are interested in indices `j` such that `intervals_with_indices[j].end < current_interval.start`.
#     #     # If `target = current_interval.start`, we want to find max `j` such that `intervals_with_indices[j][1] < target`.
#     #     # This means we need to find the largest index `p` such that `intervals_with_indices[p][1] < current_interval.start`.
#     #     # We can use `bisect_left` on the end times.
#
#     #     # Create a list of end times for binary search
#     #     end_times = [iv[1] for iv in intervals_with_indices]
#     #     target_start = current_interval[0]
#
#     #     # Find the index of the first interval whose end time is >= target_start
#     #     # `p_idx = bisect_left(end_times, target_start, hi=i)` # only search up to i-1
#     #     # `bisect_left` will return the insertion point. All elements before this point have end times < target_start.
#     #     # The indices `j` we are interested in are `0` to `p_idx - 1`.
#     #     # We need the maximum score from `dp[k-1]` among these valid `j`.
#
#     #     # `max_prev_score, best_prev_indices = (-1, [])`
#     #     # Iterate through `j` from `0` to `p_idx - 1`:
#     #     #   If `dp[k-1][j].score > max_prev_score`:
#     #     #     `max_prev_score = dp[k-1][j].score`
#     #     #     `best_prev_indices = dp[k-1][j].indices`
#     #     #   Else if `dp[k-1][j].score == max_prev_score`:
#     #     #     If `dp[k-1][j].indices < best_prev_indices`:
#     #     #       `best_prev_indices = dp[k-1][j].indices`
#     #
#     # This is still O(N^2) because `p_idx` can be up to `i`.
#
#     # The standard approach for this type of problem (maximum non-overlapping intervals with score) is to use a data structure that can query for maximums in a range.
#     # Since we are selecting up to 4 intervals, the DP state can be:
#     # `dp[k][i]` = best (score, indices) using `k` intervals, ending at `intervals[i]` (sorted by end time).
#     #
#     # To compute `dp[k][i]`: we need to find `max(dp[k-1][j])` for `j < i` where `intervals[j].end < intervals[i].start`.
#     #
#     # We can maintain, for each `k-1`, the best result found so far ending at any index `p`.
#     # Let `best_ending_at_or_before[k_minus_1][end_point]` store `(score, indices)`.
#     # This still requires a way to query efficiently.
#
#     # Given the constraints and the "up to 4", the DP approach is likely intended. The O(N^2) must be optimized.
#     #
#     # Let's reconsider the DP state and transitions.
#     #
#     # `dp[k][i]` = `(score, indices_list)` for selecting exactly `k` non-overlapping intervals, where the `i`-th interval (in sorted list by end time) is the *last* chosen interval.
#     #
#     # For `k` from 1 to 4:
#     #   For `i` from 0 to N-1:
#     #     `current_interval = intervals_with_indices[i]`
#     #     `current_weight = current_interval[2]`
#     #     `current_original_index = current_interval[3]`
#     #
#     #     if k == 1:
#     #       `dp[1][i] = (current_weight, [current_original_index])`
#     #     else:
#     #       `max_prev_score = -1`
#     #       `best_prev_indices = []`
#     #
#     #       # Iterate through all possible preceding intervals `j`
#     #       # `intervals_with_indices[j][1] < current_interval[0]`
#     #       for j in range(i):
#     #         if intervals_with_indices[j][1] < current_interval[0]:
#     #           prev_score, prev_indices = dp[k-1][j]
#     #           if prev_score != -1: # Check if a valid selection of k-1 intervals exists ending at j
#     #             # Lexicographical comparison needs careful handling.
#     #             # We want to maximize score first, then minimize indices.
#     #             # If `prev_score` is better than `max_prev_score`, update.
#     #             # If `prev_score` is equal to `max_prev_score`, compare indices.
#     #             if prev_score > max_prev_score:
#     #               max_prev_score = prev_score
#     #               best_prev_indices = prev_indices
#     #             elif prev_score == max_prev_score:
#     #               if not best_prev_indices or prev_indices < best_prev_indices:
#     #                 best_prev_indices = prev_indices
#     #
#     #       if max_prev_score != -1:
#     #         new_total_score = current_weight + max_prev_score
#     #         new_indices = sorted(best_prev_indices + [current_original_index])
#     #         dp[k][i] = (new_total_score, new_indices)
#
#     # The overall result will be the best among all `dp[k][i]` for `1 <= k <= 4`.
#
#     # The issue is the inner loop `for j in range(i)`. For a fixed `i`, we are iterating through all `j < i` and checking the non-overlapping condition.
#     # To optimize this, for a fixed `i`, we need to find `max(dp[k-1][j])` such that `intervals_with_indices[j][1] < intervals_with_indices[i][0]`.
#
#     # We can use a Segment Tree or Fenwick Tree.
#     # The segment tree would operate on the indices of the sorted intervals.
#     # For a fixed `k`, when computing `dp[k][i]`, we need to query the segment tree for `dp[k-1]` values for indices `j` whose interval ends before `intervals_with_indices[i].start`.
#
#     # Let's discretize the start and end points if they are large, but here they are just used for comparison.
#     #
#     # A simpler optimization might be to maintain a running maximum for `dp[k-1]`.
#     # For a fixed `k`, as we iterate `i` (sorted by end time):
#     #   We need to find the best `j < i` where `intervals_with_indices[j][1] < intervals_with_indices[i][0]`.
#     #   This implies that `j` must correspond to an interval that ends *before* the current interval `i` starts.
#
#     # Let's use a structure to store the best results for `k-1` intervals.
#     # `best_options_for_k_minus_1`: a list of `(score, indices, end_time)` for the best `k-1` selections found so far.
#     # This is getting complicated.
#
#     # Given the constraint of *at most* 4 intervals, perhaps a meet-in-the-middle or a limited brute-force search over combinations is what's hinted at by the "Hard" difficulty if N is large.
#     # However, the standard approach for interval DP is O(N^2). The constraint `k <= 4` is crucial.
#
#     # Let's consider the structure of the optimal solution. If we have an optimal set of `m <= 4` intervals, sorting them by end time gives `i_1, i_2, ..., i_m`.
#     # Then `intervals[i_p].end < intervals[i_{p+1}].start`.
#
#     # DP approach with segment tree optimization:
#     # We need to perform range maximum queries.
#     # For `dp[k][i]`, we need `max(dp[k-1][j])` for `j` such that `intervals_with_indices[j][1] < intervals_with_indices[i][0]`.
#     #
#     # The indices `j` are from `0` to `i-1`.
#     # The condition `intervals_with_indices[j][1] < intervals_with_indices[i][0]` partitions the `j`'s.
#     # Since `intervals_with_indices` is sorted by `end` time, we can use binary search to find the largest `j` satisfying this.
#     # Let this index be `max_valid_j_idx`.
#     # We need to query the maximum value in `dp[k-1]` for indices from `0` to `max_valid_j_idx`.
#     # A segment tree can do this.
#
#     # `dp[k]` will be a list of `(score, indices)`.
#     # We'll use a segment tree for each `k` to store `dp[k]`.
#     # `st[k]` = Segment Tree for `dp[k]`.
#     # The segment tree will store `(score, indices)` and support range maximum query.
#     # The comparison for maximum should prioritize score, then lexicographical order of indices.
#
#     # Let's define a custom comparison function for `(score, indices)` tuples.
#     # `compare(t1, t2)`: if `t1.score > t2.score`, return `t1`. If `t1.score < t2.score`, return `t2`. If scores equal, return `t1` if `t1.indices < t2.indices` else `t2`.
#
#     # Initialize `dp_results[k]` as a list of `(score, indices)` of size N, initialized to `(-1, [])`.
#
#     # For `k` from 1 to 4:
#     #   Initialize segment tree `st[k]` of size N, with initial values `(-1, [])`.
#     #   For `i` from 0 to N-1:
#     #     `current_interval = intervals_with_indices[i]`
#     #     `current_weight = current_interval[2]`
#     #     `current_original_index = current_interval[3]`
#
#     #     if k == 1:
#     #       `dp_results[1][i] = (current_weight, [current_original_index])`
#     #       `st[1].update(i, dp_results[1][i])` # Update segment tree
#     #     else:
#     #       # Find the maximum valid previous selection from dp[k-1]
#     #       # We need to query for `j` such that `intervals_with_indices[j][1] < current_interval[0]`
#     #       # Let's use `bisect_left` on the *end times* of intervals up to `i-1`.
#     #       target_start = current_interval[0]
#     #       # Find index `p` such that `intervals_with_indices[p][1] >= target_start`.
#     #       # All `j` such that `intervals_with_indices[j][1] < target_start` are before `p`.
#     #       # So we are interested in indices `0` to `p-1`.
#     #       # Use `bisect_left` on `end_times` array up to index `i-1`.
#
#     #       # To make bisect work, we need an array of end times.
#     #       end_times_prefix = [iv[1] for iv in intervals_with_indices[:i]]
#     #       # Find the insertion point for `target_start`.
#     #       # `p_idx = bisect_left(end_times_prefix, target_start)`
#     #       # This `p_idx` is the count of elements < `target_start`.
#     #       # So, the valid indices `j` are `0, 1, ..., p_idx - 1`.
#     #       # We need to query `st[k-1]` for the maximum in range `[0, p_idx - 1]`.
#
#     #       # If `p_idx == 0`, it means no previous interval ends before `current_interval` starts.
#     #       if p_idx > 0:
#     #         `max_prev_option = st[k-1].query(0, p_idx - 1)` # Range query
#     #         `prev_score, prev_indices = max_prev_option`
#
#     #         if prev_score != -1:
#     #           new_total_score = current_weight + prev_score
#     #           new_indices = sorted(prev_indices + [current_original_index])
#     #           dp_results[k][i] = (new_total_score, new_indices)
#     #           st[k].update(i, dp_results[k][i]) # Update segment tree for current k
#
#     # This segment tree approach has Time Complexity: O(N log N) for sorting and N * K * log N for DP (K=4).
#     # Segment tree operations (update and query) are O(log N).
#     # Overall: O(N log N) + O(K * N log N) = O(K * N log N). With K=4, this is O(N log N).
#     # Space Complexity: O(K * N) for DP table and segment trees.
#
#     # Let's implement the Segment Tree.
#
#     # The segment tree will store `(score, indices)`.
#     # Comparison logic for segment tree nodes:
#     # `combine(node1, node2)`:
#     #   if `node1.score > node2.score`: return `node1`
#     #   if `node2.score > node1.score`: return `node2`
#     #   # Scores are equal, compare indices lexicographically
#     #   if `node1.indices < node2.indices`: return `node1`
#     #   else: return `node2`
#     # Default identity element for combine: `(-1, [])`
#
#     # The `bisect_left` needs to be on the *end times* of the sorted intervals.
#     # The indices `j` are in the range `[0, i-1]`.
#     # We need to find the largest `j` such that `intervals_with_indices[j][1] < intervals_with_indices[i][0]`.
#     # Let `target_start = intervals_with_indices[i][0]`.
#     # We can find the count of intervals `j` (where `j < i`) such that `intervals_with_indices[j][1] < target_start`.
#     # This count `p_idx` will be the upper bound for our segment tree query range `[0, p_idx - 1]`.
#
#     # We will use `bisect_left` on the sorted list of end times of *all* intervals, not just prefixes.
#     # `end_times_all = [iv[1] for iv in intervals_with_indices]`
#     # `p_idx = bisect_left(end_times_all, target_start, hi=i)` # Search only up to index i-1
#     # The valid indices `j` are from `0` to `p_idx - 1`.
#
#     # Example 1 walk-through:
#     # intervals = [[1,3,2],[4,5,2],[1,5,5],[6,9,3],[6,7,1],[8,9,1]]
#     # Original indices: 0, 1, 2, 3, 4, 5
#     #
#     # intervals_with_indices = [
#     #   (1, 3, 2, 0),
#     #   (4, 5, 2, 1),
#     #   (1, 5, 5, 2),
#     #   (6, 9, 3, 3),
#     #   (6, 7, 1, 4),
#     #   (8, 9, 1, 5)
#     # ]
#     #
#     # Sorted by end time:
#     # (1, 3, 2, 0)
#     # (4, 5, 2, 1)
#     # (1, 5, 5, 2)
#     # (6, 7, 1, 4)
#     # (6, 9, 3, 3)
#     # (8, 9, 1, 5)
#     #
#     # Let's re-sort carefully:
#     # intervals_with_indices = [
#     #   (1, 3, 2, 0),  # ends at 3
#     #   (4, 5, 2, 1),  # ends at 5
#     #   (1, 5, 5, 2),  # ends at 5 (start at 1)
#     #   (6, 7, 1, 4),  # ends at 7
#     #   (6, 9, 3, 3),  # ends at 9
#     #   (8, 9, 1, 5)   # ends at 9 (start at 8)
#     # ]
#     #
#     # After sorting by end time (and start time for ties):
#     # indices: 0, 1, 2, 4, 3, 5
#     # intervals_sorted = [
#     #   (1, 3, 2, 0),  # index 0 in sorted list
#     #   (4, 5, 2, 1),  # index 1
#     #   (1, 5, 5, 2),  # index 2
#     #   (6, 7, 1, 4),  # index 3
#     #   (6, 9, 3, 3),  # index 4
#     #   (8, 9, 1, 5)   # index 5
#     # ]
#     #
#     # Let's use the actual indices from `intervals_sorted` for DP:
#     # `intervals_sorted[0] = (1, 3, 2, 0)`
#     # `intervals_sorted[1] = (4, 5, 2, 1)`
#     # `intervals_sorted[2] = (1, 5, 5, 2)`
#     # `intervals_sorted[3] = (6, 7, 1, 4)`
#     # `intervals_sorted[4] = (6, 9, 3, 3)`
#     # `intervals_sorted[5] = (8, 9, 1, 5)`
#     #
#     # Let's re-sort the input properly:
#     # intervals = [[1,3,2,0],[4,5,2,1],[1,5,5,2],[6,9,3,3],[6,7,1,4],[8,9,1,5]]
#     # Sort by end time, then start time:
#     # sorted_intervals_data = sorted(intervals, key=lambda x: (x[1], x[0]))
#     #
#     # sorted_intervals_data:
#     # [1, 3, 2, 0]  (idx 0)
#     # [4, 5, 2, 1]  (idx 1)
#     # [1, 5, 5, 2]  (idx 2)
#     # [6, 7, 1, 4]  (idx 3)
#     # [6, 9, 3, 3]  (idx 4)
#     # [8, 9, 1, 5]  (idx 5)
#     #
#     # This order is not fully sorted by end time.
#     # Correct sorting by end time:
#     # [1, 3, 2, 0]  # end=3
#     # [4, 5, 2, 1]  # end=5, start=4
#     # [1, 5, 5, 2]  # end=5, start=1
#     # [6, 7, 1, 4]  # end=7
#     # [6, 9, 3, 3]  # end=9, start=6
#     # [8, 9, 1, 5]  # end=9, start=8
#     #
#     # Final sorted list for DP:
#     # idx=0: [1, 3, 2, 0]
#     # idx=1: [1, 5, 5, 2]  # sorted (1,5) before (4,5)
#     # idx=2: [4, 5, 2, 1]
#     # idx=3: [6, 7, 1, 4]
#     # idx=4: [6, 9, 3, 3]
#     # idx=5: [8, 9, 1, 5]
#     #
#     # Let's use this order:
#     # intervals_data = [
#     #   (1, 3, 2, 0), # idx 0
#     #   (1, 5, 5, 2), # idx 1
#     #   (4, 5, 2, 1), # idx 2
#     #   (6, 7, 1, 4), # idx 3
#     #   (6, 9, 3, 3), # idx 4
#     #   (8, 9, 1, 5)  # idx 5
#     # ]
#     #
#     # N = 6
#     # end_times_all = [3, 5, 5, 7, 9, 9]
#     #
#     # DP Initialization:
#     # dp_results[k] for k=1..4, each is a list of size N.
#     # st[k] for k=1..4, each is a segment tree of size N.
#     #
#     # k=1:
#     # dp_results[1] = [(-1, []) for _ in range(N)]
#     # st[1] initialized with (-1, [])
#     #
#     # i=0: (1, 3, 2, 0)
#     # dp_results[1][0] = (2, [0])
#     # st[1].update(0, (2, [0]))
#     #
#     # i=1: (1, 5, 5, 2)
#     # dp_results[1][1] = (5, [2])
#     # st[1].update(1, (5, [2]))
#     #
#     # i=2: (4, 5, 2, 1)
#     # dp_results[1][2] = (2, [1])
#     # st[1].update(2, (2, [1]))
#     #
#     # i=3: (6, 7, 1, 4)
#     # dp_results[1][3] = (1, [4])
#     # st[1].update(3, (1, [4]))
#     #
#     # i=4: (6, 9, 3, 3)
#     # dp_results[1][4] = (3, [3])
#     # st[1].update(4, (3, [3]))
#     #
#     # i=5: (8, 9, 1, 5)
#     # dp_results[1][5] = (1, [5])
#     # st[1].update(5, (1, [5]))
#     #
#     # k=2:
#     # dp_results[2] = [(-1, []) for _ in range(N)]
#     # st[2] initialized with (-1, [])
#     #
#     # i=0: (1, 3, 2, 0) # Cannot form 2 intervals ending here
#     #
#     # i=1: (1, 5, 5, 2)
#     #   current_start = 1. Find j < 1 where intervals_data[j][1] < 1.
#     #   end_times_all[:1] = [3]. bisect_left([3], 1) = 0. p_idx = 0. No prev intervals.
#     #
#     # i=2: (4, 5, 2, 1)
#     #   current_start = 4. Find j < 2 where intervals_data[j][1] < 4.
#     #   end_times_all[:2] = [3, 5]. bisect_left([3, 5], 4) = 1. p_idx = 1.
#     #   Valid j is only index 0.
#     #   Query st[1] in range [0, 0]: st[1].query(0, 0) -> (2, [0])
#     #   prev_score = 2, prev_indices = [0]
#     #   new_total_score = 2 (current weight) + 2 = 4
#     #   new_indices = sorted([0] + [1]) = [0, 1]
#     #   dp_results[2][2] = (4, [0, 1])
#     #   st[2].update(2, (4, [0, 1]))
#     #
#     # i=3: (6, 7, 1, 4)
#     #   current_start = 6. Find j < 3 where intervals_data[j][1] < 6.
#     #   end_times_all[:3] = [3, 5, 5]. bisect_left([3, 5, 5], 6) = 3. p_idx = 3.
#     #   Valid j are indices 0, 1, 2.
#     #   Query st[1] in range [0, 2]: max of st[1] at 0, 1, 2.
#     #   st[1] at 0: (2, [0])
#     #   st[1] at 1: (5, [2])
#     #   st[1] at 2: (2, [1])
#     #   Max of these is (5, [2]).
#     #   prev_score = 5, prev_indices = [2]
#     #   new_total_score = 1 (current weight) + 5 = 6
#     #   new_indices = sorted([2] + [4]) = [2, 4]
#     #   dp_results[2][3] = (6, [2, 4])
#     #   st[2].update(3, (6, [2, 4]))
#     #
#     # i=4: (6, 9, 3, 3)
#     #   current_start = 6. Find j < 4 where intervals_data[j][1] < 6.
#     #   end_times_all[:4] = [3, 5, 5, 7]. bisect_left([3, 5, 5, 7], 6) = 3. p_idx = 3.
#     #   Valid j are indices 0, 1, 2.
#     #   Query st[1] in range [0, 2]: max is (5, [2]).
#     #   prev_score = 5, prev_indices = [2]
#     #   new_total_score = 3 (current weight) + 5 = 8
#     #   new_indices = sorted([2] + [3]) = [2, 3]
#     #   dp_results[2][4] = (8, [2, 3])
#     #   st[2].update(4, (8, [2, 3]))
#     #
#     # i=5: (8, 9, 1, 5)
#     #   current_start = 8. Find j < 5 where intervals_data[j][1] < 8.
#     #   end_times_all[:5] = [3, 5, 5, 7, 9]. bisect_left([3, 5, 5, 7, 9], 8) = 4. p_idx = 4.
#     #   Valid j are indices 0, 1, 2, 3.
#     #   Query st[1] in range [0, 3]: max of st[1] at 0, 1, 2, 3.
#     #   st[1] at 0: (2, [0])
#     #   st[1] at 1: (5, [2])
#     #   st[1] at 2: (2, [1])
#     #   st[1] at 3: (1, [4])
#     #   Max is (5, [2]).
#     #   prev_score = 5, prev_indices = [2]
#     #   new_total_score = 1 (current weight) + 5 = 6
#     #   new_indices = sorted([2] + [5]) = [2, 5]
#     #   dp_results[2][5] = (6, [2, 5])
#     #   st[2].update(5, (6, [2, 5]))
#     #
#     # After k=2:
#     # dp_results[2] = [(-1, []), (-1, []), (4, [0, 1]), (6, [2, 4]), (8, [2, 3]), (6, [2, 5])]
#     #
#     # k=3:
#     # i=0,1,2,3: Cannot form 3 intervals ending here.
#     #
#     # i=4: (6, 9, 3, 3)
#     #   current_start = 6. Find j < 4 where intervals_data[j][1] < 6.
#     #   p_idx = 3 (same as before). Query st[2] range [0, 2].
#     #   st[2] at 0: (-1, [])
#     #   st[2] at 1: (-1, [])
#     #   st[2] at 2: (4, [0, 1])
#     #   Max is (4, [0, 1]).
#     #   prev_score = 4, prev_indices = [0, 1]
#     #   new_total_score = 3 (current weight) + 4 = 7
#     #   new_indices = sorted([0, 1] + [3]) = [0, 1, 3]
#     #   dp_results[3][4] = (7, [0, 1, 3])
#     #   st[3].update(4, (7, [0, 1, 3]))
#     #
#     # i=5: (8, 9, 1, 5)
#     #   current_start = 8. Find j < 5 where intervals_data[j][1] < 8.
#     #   p_idx = 4. Query st[2] range [0, 3].
#     #   st[2] at 0: (-1, [])
#     #   st[2] at 1: (-1, [])
#     #   st[2] at 2: (4, [0, 1])
#     #   st[2] at 3: (6, [2, 4])
#     #   Max is (6, [2, 4]).
#     #   prev_score = 6, prev_indices = [2, 4]
#     #   new_total_score = 1 (current weight) + 6 = 7
#     #   new_indices = sorted([2, 4] + [5]) = [2, 4, 5]
#     #   dp_results[3][5] = (7, [2, 4, 5])
#     #   st[3].update(5, (7, [2, 4, 5]))
#     #
#     # k=4:
#     # Only possible if N >= 4.
#     # Example 1 has N=6.
#     #
#     # i=4: (6, 9, 3, 3)
#     #   current_start = 6. Find j < 4 where intervals_data[j][1] < 6.
#     #   p_idx = 3. Query st[3] range [0, 2].
#     #   st[3] at 0, 1, 2 are all (-1, []). No valid 3-interval prefix.
#     #
#     # i=5: (8, 9, 1, 5)
#     #   current_start = 8. Find j < 5 where intervals_data[j][1] < 8.
#     #   p_idx = 4. Query st[3] range [0, 3].
#     #   st[3] at 0, 1, 2, 3 are all (-1, []). No valid 3-interval prefix.
#     #
#     # Final Result Extraction:
#     # Iterate through all `dp_results[k][i]` for `1 <= k <= 4` and `0 <= i < N`.
#     # Track the overall best `(score, indices)`.
#     #
#     # From k=1: max is (5, [2]) from dp_results[1][1].
#     # From k=2: max is (8, [2, 3]) from dp_results[2][4].
#     # From k=3: max is (7, [0, 1, 3]) from dp_results[3][4] AND (7, [2, 4, 5]) from dp_results[3][5].
#     # Lexicographically, [0, 1, 3] < [2, 4, 5]. So best for k=3 is (7, [0, 1, 3]).
#     # From k=4: No valid selections found.
#     #
#     # Overall best:
#     # Compare (5, [2]), (8, [2, 3]), (7, [0, 1, 3]).
#     # The maximum score is 8 with indices [2, 3].
#     #
#     # Example 1 Output: [2, 3] - Matches!
#
#     # What if a problem asks for lexicographically smallest indices among those with maximum score?
#     # The `combine` function in segment tree and the DP updates must handle this.
#     # The current comparison logic in segment tree `combine` is:
#     # `if node1.score > node2.score: return node1`
#     # `if node2.score > node1.score: return node2`
#     # `# Scores are equal, compare indices lexicographically`
#     # `if node1.indices < node2.indices: return node1`
#     # `else: return node2`
#     # This is correct.
#
#     # The DP update logic also needs to consider this:
#     # When updating `dp_results[k][i]`:
#     # `new_total_score = current_weight + prev_score`
#     # `new_indices = sorted(best_prev_indices + [current_original_index])`
#     #
#     # If `new_total_score > current_max_score`: update
#     # If `new_total_score == current_max_score` and `new_indices < best_indices`: update.
#     #
#     # The current implementation of DP state update seems to handle this when `max_prev_option` is fetched.
#     # The `st[k].update(i, dp_results[k][i])` correctly propagates the best option including lexicographical ordering.
#
#     # Need a Segment Tree class.
#     # Node structure: `(score, indices)`
#     # Identity element: `(-1, [])`
#     # `combine` function for nodes: `compare_options(opt1, opt2)`
#
#     # The `bisect_left` usage:
#     # `end_times_all = [iv[1] for iv in intervals_data]`
#     # For `i`, we need `j < i` such that `intervals_data[j][1] < intervals_data[i][0]`.
#     # `target_start = intervals_data[i][0]`
#     # Find `p_idx = bisect_left(end_times_all, target_start, hi=i)`
#     # `hi=i` means the search is restricted to indices `0` to `i-1`.
#     # `bisect_left` returns the index where `target_start` would be inserted.
#     # All elements before this index have end times strictly less than `target_start`.
#     # So, the valid indices `j` are `0, 1, ..., p_idx - 1`.
#     # The range for query is `[0, p_idx - 1]`. If `p_idx` is 0, the range is empty.
#     # This looks correct.
#
#     # Final sweep to find the overall best result.
#     # Iterate through `dp_results[k][i]` for `k` in `[1, 4]` and `i` in `[0, N-1]`.
#     # Keep track of `overall_max_score` and `overall_best_indices`.
#     #
#     # Compare with `current_score, current_indices = dp_results[k][i]`.
#     # If `current_score > overall_max_score`: update.
#     # If `current_score == overall_max_score` and `current_indices < overall_best_indices`: update.
#     # Initialize `overall_max_score` to -1 and `overall_best_indices` to an empty list.
#
#     # The problem asks for "lexicographically smallest array of at most 4 indices from intervals with maximum score".
#     # This means we first find the maximum score. Then among all selections that achieve this maximum score, find the one with the lexicographically smallest indices.
#     #
#     # The DP table naturally stores the lexicographically smallest indices for a given score ending at a specific interval.
#     # When we extract the final answer, we should collect all `(score, indices)` pairs from `dp_results[k][i]` for `1 <= k <= 4`.
#     # Then, find the maximum score from these pairs.
#     # Then, collect all pairs that have this maximum score.
#     # Finally, find the lexicographically smallest indices among these pairs.
#     #
#     # Let's track `max_score_overall` and `best_indices_overall`.
#     # `max_score_overall = -1`
#     # `best_indices_overall = []`
#     #
#     # For `k` in `[1, 4]`:
#     #   For `i` in `[0, N-1]`:
#     #     `current_score, current_indices = dp_results[k][i]`
#     #     if `current_score == -1`: continue
#     #
#     #     if `current_score > max_score_overall`:
#     #       `max_score_overall = current_score`
#     #       `best_indices_overall = current_indices`
#     #     elif `current_score == max_score_overall`:
#     #       if not `best_indices_overall` or `current_indices < best_indices_overall`:
#     #         `best_indices_overall = current_indices`
#     #
#     # This final sweep correctly finds the maximum score and then the lexicographically smallest indices for that score.
#
#     # Segment Tree implementation details:
#     # Needs `build`, `update`, `query` methods.
#     # `build(arr)`: builds from an initial array.
#     # `update(idx, value)`: updates element at `idx`.
#     # `query(l, r)`: queries range `[l, r]`.
#
#     # The `compare_options` function will be critical.
#     # `compare_options(opt1, opt2)` where `opt = (score, indices)`
#     # Returns the "better" option.
#
#     # Default value for segment tree nodes: `(-1, [])`
#     # This is because scores are positive. Any valid score will be > -1.
#     # Empty list for indices is lexicographically smaller than any non-empty list (for same score).
#     # Actually, an empty list is not directly comparable with non-empty lists by '<'.
#     # We need to handle `if not best_indices_overall` case.
#     # The problem is that when we compare `current_indices < best_indices_overall`, if `best_indices_overall` is empty, this comparison might be invalid or return false.
#     # The logic `if not best_indices_overall or current_indices < best_indices_overall` handles this. If `best_indices_overall` is empty, the first part of the OR is true, so the condition is met.
#
#     # Let's consider the maximum number of intervals chosen is *at most* 4.
#     # Our DP `dp_results[k][i]` computes for *exactly* `k` intervals.
#     # The final sweep correctly aggregates results for `k=1, 2, 3, 4`.
#
#     # Time complexity: O(N log N) for sorting.
#     # Segment Tree construction: O(N) for each k (4 trees).
#     # DP calculation: O(K * N * log N) because for each of K*N states, we do one segment tree query (O(log N)) and one update (O(log N)).
#     # Total DP is O(K * N log N).
#     # Final sweep: O(K * N).
#     # Overall: O(N log N + K * N log N) = O(K * N log N).
#     # With K=4, this is O(N log N).
#
#     # Space complexity:
#     # `intervals_data`: O(N)
#     # `dp_results`: O(K * N)
#     # `st` (segment trees): O(K * N)
#     # Total: O(K * N). With K=4, O(N).
#
#     # This seems like the correct and optimized approach.
#
#     # Structure of the code:
#     # 1. Segment Tree Class.
#     # 2. `maximumScore` function.
#     #    a. Augment intervals with original indices.
#     #    b. Sort intervals by end time, then start time.
#     #    c. Initialize DP tables and Segment Trees.
#     #    d. Fill DP tables using Segment Trees.
#     #    e. Extract final answer.
#
#     # Segment Tree implementation:
#     # `tree`: list representing the segment tree. Size `4*N`.
#     # `default_val`: `(-1, [])`
#     # `compare`: function to merge/compare node values.
#     # `build`: recursive.
#     # `update`: recursive.
#     # `query`: recursive.
#
#     # Edge case: empty input `intervals`. Constraints say `1 <= intervals.length`.
#     # Max number of intervals is 5 * 10^4. N log N should be acceptable.
#
#     # The `intervals[i].weighti` can be up to 10^9. Total score can exceed 32-bit int, so use Python's arbitrary precision integers.
#     # The problem statement uses `weighti`, but the LeetCode platform often uses `weight`. The example shows `weighti`.
#     # The variables `weighti` and `weight` are used interchangeably in context.
#
#     # Final checks on lexicographical comparison:
#     # Python's list comparison `[a, b] < [c, d]` works lexicographically. `[1, 5] < [2, 3]` is True. `[1, 5] < [1, 6]` is True.
#     # So, `current_indices < best_indices_overall` logic is correct.
#
#     # Let's ensure the sorting is stable if start times are the same. Python's `sorted` is stable.
#     # `key=lambda x: (x[1], x[0])` means sort by `x[1]` first, then by `x[0]` for ties. This is correct.
#
#     # The constraint "up to 4 non-overlapping intervals" is handled by iterating k from 1 to 4.
#
#     # The problem asks for the lexicographically smallest array of indices.
#     # The `dp_results[k][i]` already stores the lexicographically smallest indices for that specific `k` and ending interval `i`.
#     # The `compare_options` in the segment tree propagates this lexicographical minimality.
#     # The final sweep correctly finds the overall best (max score, then lexicographically smallest indices).
#
#     # A potential issue: if multiple `j` give the same `max_prev_score`, which one to choose for `best_prev_indices`?
#     # The `compare_options` function in the segment tree ensures that if scores are equal, it picks the one with lexicographically smaller indices.
#     # This ensures that `max_prev_option` itself is the best possible result for `k-1` intervals ending before the current interval.
#
#     # The `bisect_left` function requires a sorted sequence. `end_times_all` is sorted.
#     # The `hi=i` argument is crucial for `bisect_left` to only search within the valid prefix `0` to `i-1`.
#
#     # The `intervals_data` should be `(li, ri, weighti, original_index)`.
#
#     # The constraints on `li`, `ri`, `weighti` are large, so Python's arbitrary precision integers are necessary.
#     # The score can reach 4 * 10^9, which fits in a standard 64-bit integer, but it's safer to use Python's native ints.
#
#     # Everything seems to be in order for implementing this optimized DP with Segment Tree approach.
#
# Time Complexity: O(N log N) where N is the number of intervals.
#   - Sorting: O(N log N).
#   - DP calculation: We have K (up to 4) layers of DP. For each layer, we iterate through N intervals. For each interval, we perform a segment tree query and update, both O(log N).
#     So, DP calculation is O(K * N * log N).
#   - Final sweep: O(K * N).
#   - Total: O(N log N + K * N log N) = O(K * N log N), which simplifies to O(N log N) since K is a constant.
#
# Space Complexity: O(N) where N is the number of intervals.
#   - `intervals_data`: O(N).
#   - `dp_results`: O(K * N).
#   - Segment Trees: O(K * N).
#   - Total: O(K * N), which simplifies to O(N) since K is a constant.

import bisect

# Helper function to compare two options (score, indices)
# Returns the better option: higher score, or if scores are equal, lexicographically smaller indices.
def compare_options(opt1, opt2):
    score1, indices1 = opt1
    score2, indices2 = opt2

    if score1 > score2:
        return opt1
    elif score2 > score1:
        return opt2
    else: # Scores are equal
        # Python list comparison is lexicographical
        if not indices1: # If indices1 is empty, it's considered 'smaller' if score is same as opt2
            return opt1
        if not indices2: # If indices2 is empty, opt1 is better if score is same
            return opt1
        
        if indices1 < indices2:
            return opt1
        else:
            return opt2

# Segment Tree implementation
class SegmentTree:
    def __init__(self, size, default_val, combine_func):
        self.size = size
        self.default_val = default_val
        self.combine_func = combine_func
        # Tree size is typically 4 * size for safety
        self.tree = [default_val] * (4 * size)
        # We don't build from an initial array, we'll update element by element.

    # Update the value at a specific index
    def update(self, index, value):
        self._update_recursive(0, 0, self.size - 1, index, value)

    def _update_recursive(self, node_idx, start, end, update_idx, value):
        if start == end: # Leaf node
            self.tree[node_idx] = value
            return
        
        mid = (start + end) // 2
        if start <= update_idx <= mid:
            # Update left child
            self._update_recursive(2 * node_idx + 1, start, mid, update_idx, value)
        else:
            # Update right child
            self._update_recursive(2 * node_idx + 2, mid + 1, end, update_idx, value)
        
        # Internal node: combine children's values
        self.tree[node_idx] = self.combine_func(self.tree[2 * node_idx + 1], self.tree[2 * node_idx + 2])

    # Query for the combined value in a range [query_l, query_r]
    def query(self, query_l, query_r):
        return self._query_recursive(0, 0, self.size - 1, query_l, query_r)

    def _query_recursive(self, node_idx, start, end, query_l, query_r):
        # If the current segment is completely outside the query range
        if query_r < start or end < query_l:
            return self.default_val
        
        # If the current segment is completely inside the query range
        if query_l <= start and end <= query_r:
            return self.tree[node_idx]
        
        # If the current segment partially overlaps with the query range
        mid = (start + end) // 2
        left_result = self._query_recursive(2 * node_idx + 1, start, mid, query_l, query_r)
        right_result = self._query_recursive(2 * node_idx + 2, mid + 1, end, query_l, query_r)
        
        return self.combine_func(left_result, right_result)

class Solution:
    def maxScoreOfNonOverlappingIntervals(self, intervals: list[list[int]]) -> list[int]:
        # Augment intervals with their original indices
        # Format: [start, end, weight, original_index]
        intervals_data = []
        for i, (l, r, w) in enumerate(intervals):
            intervals_data.append([l, r, w, i])
        
        # Sort intervals by end time, then by start time for ties.
        # This order is crucial for the DP approach.
        intervals_data.sort(key=lambda x: (x[1], x[0]))
        
        n = len(intervals_data)
        max_k = 4 # Maximum number of intervals we can choose
        
        # dp_results[k][i] will store the best (score, indices_list) for selecting exactly k intervals,
        # where the i-th interval in the *sorted* list is the last one chosen.
        # Initialize with a score of -1, indicating no valid selection.
        dp_results = [[(-1, []) for _ in range(n)] for _ in range(max_k + 1)]
        
        # Segment Trees for efficient querying.
        # st[k] will store the best results for selecting k intervals.
        # We need a segment tree for each k from 1 to max_k.
        # Each segment tree will store (score, indices) and use compare_options for combining.
        # The default value (-1, []) represents an invalid or empty selection.
        segment_trees = [SegmentTree(n, (-1, []), compare_options) for _ in range(max_k + 1)]
        
        # Precompute end times for binary search
        # This is the list of end times of intervals_data, sorted.
        end_times_all = [iv[1] for iv in intervals_data]
        
        # Fill the DP table and segment trees
        for k in range(1, max_k + 1):
            for i in range(n):
                current_start, current_end, current_weight, current_original_index = intervals_data[i]
                
                if k == 1:
                    # Base case: selecting exactly one interval
                    dp_results[k][i] = (current_weight, [current_original_index])
                else:
                    # For k > 1, we need to find the best preceding non-overlapping interval.
                    # We need to find the maximum score from dp_results[k-1] among intervals j < i
                    # such that intervals_data[j][1] < current_start.
                    
                    # Use binary search on the sorted end times to find the index `p_idx`
                    # such that all intervals with index `j < p_idx` have `intervals_data[j][1] < current_start`.
                    # `bisect_left` finds the insertion point for `current_start` in `end_times_all`.
                    # We restrict the search to indices `0` to `i-1` using `hi=i`.
                    p_idx = bisect.bisect_left(end_times_all, current_start, hi=i)
                    
                    # If p_idx > 0, it means there are intervals ending before current_start.
                    # We query the segment tree for k-1 intervals for the range [0, p_idx - 1].
                    # This gives us the best (score, indices) for k-1 intervals that can precede interval i.
                    if p_idx > 0:
                        # Query segment tree for k-1 intervals in the valid range.
                        # The range is [0, p_idx - 1].
                        best_prev_option = segment_trees[k-1].query(0, p_idx - 1)
                        prev_score, prev_indices = best_prev_option
                        
                        # If a valid previous selection exists (score != -1)
                        if prev_score != -1:
                            new_total_score = current_weight + prev_score
                            # Combine current interval's index with the best previous indices.
                            # Sort them to maintain lexicographical order for future comparisons.
                            new_indices = sorted(prev_indices + [current_original_index])
                            dp_results[k][i] = (new_total_score, new_indices)
                
                # Update the segment tree for the current k with the result for interval i.
                # This makes dp_results[k][i] available for future queries (for larger i or larger k).
                segment_trees[k].update(i, dp_results[k][i])
        
        # After filling the DP table and segment trees, find the overall best result.
        # We need to consider all possible numbers of intervals (1 to max_k)
        # and all possible ending intervals for each k.
        
        overall_max_score = -1
        overall_best_indices = [] # Empty list is lexicographically smallest initially

        for k in range(1, max_k + 1):
            for i in range(n):
                current_score, current_indices = dp_results[k][i]
                
                # Skip invalid entries
                if current_score == -1:
                    continue
                
                # Compare with the overall best found so far
                if current_score > overall_max_score:
                    overall_max_score = current_score
                    overall_best_indices = current_indices
                elif current_score == overall_max_score:
                    # If scores are equal, choose the lexicographically smaller indices
                    if not overall_best_indices or current_indices < overall_best_indices:
                        overall_best_indices = current_indices
        
        return overall_best_indices

```