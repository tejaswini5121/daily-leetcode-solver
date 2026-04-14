```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

// Problem: Minimum Total Distance Traveled
// Link: https://leetcode.com/problems/minimum-total-distance-traveled/
// Approach:
// This problem can be solved using dynamic programming. The core idea is to process robots and factories in sorted order.
// First, sort both the robot positions and factory positions.
// We can define a DP state `dp[i][j]` as the minimum total distance to repair the first `i` robots using the first `j` factories.
// However, the `limit` constraint of factories makes this state definition insufficient.
// A better approach is to iterate through robots and for each robot, decide which factory to send it to.
// Since we want to minimize total distance, it's beneficial to pair robots that are close to a factory with that factory.
// This suggests a greedy-like processing after sorting.
//
// Let's refine the DP state: `dp[i][j]` will represent the minimum total distance to repair the first `i` robots using the first `j` factories, considering the capacities of these `j` factories.
//
// The state transition can be formulated as follows:
// To compute `dp[i][j]`:
// 1. The `i`-th robot is repaired by the `j`-th factory. In this case, we need to consider how many robots the `j`-th factory repairs. Let's say it repairs `k` robots (from `i - k + 1` to `i`).
//    The cost for this would be `dp[i-k][j-1]` (minimum cost for previous `i-k` robots using first `j-1` factories) + sum of distances for robots `i-k+1` to `i` to factory `j`.
//    The number of robots `k` that the `j`-th factory can repair ranges from 1 up to `min(i, limit_j)`.
//    For each `k`, we calculate the sum of distances from robots `i-k+1` to `i` to factory `j`.
// 2. The `i`-th robot is NOT repaired by the `j`-th factory. This means the `i`-th robot must have been repaired by one of the first `j-1` factories. The minimum cost would then be `dp[i][j-1]`.
//
// `dp[i][j] = min( dp[i][j-1], min_{1 <= k <= min(i, limit_j)} (dp[i-k][j-1] + cost(robots[i-k+1...i], factory_j_pos)) )`
//
// The `cost(robots[i-k+1...i], factory_j_pos)` is the sum of absolute differences between robot positions and the factory position.
// This DP state has dimensions `O(num_robots * num_factories)`.
// The inner loop for `k` can go up to `num_robots`.
// This results in a time complexity of `O(num_robots^2 * num_factories)`.
//
// Given the constraints (up to 100 robots and 100 factories), `100^2 * 100 = 1,000,000` operations per DP state, which might be too slow if there are many `k` values to check.
// We need to optimize the `cost` calculation.
//
// Let's consider the robots and factories sorted.
// `robots`: sorted list of robot positions.
// `factories`: sorted list of factory objects, where each object contains `position` and `limit`.
//
// Let `dp[i][j]` be the minimum cost to fix the first `i` robots using the first `j` factories.
// `dp[i][j] = dp[i][j-1]` (robot `i` is not fixed by factory `j`)
// OR
// `dp[i][j] = min_{1 <= k <= min(i, factories[j].limit)} (dp[i-k][j-1] + sum of distances for robots i-k+1 to i to factories[j].position)`
//
// The sum of distances can be optimized. For a fixed factory `j` and a number `k` of robots from `i-k+1` to `i`, we need `sum(|robots[p] - factories[j].position|)` for `p` from `i-k+1` to `i`.
// This sum can be computed efficiently if we precompute prefix sums of robot positions.
// Let `prefix_robot_sum[x]` be the sum of `robots[0]` to `robots[x-1]`.
// Then `sum(robots[a] to robots[b]) = prefix_robot_sum[b+1] - prefix_robot_sum[a]`.
//
// The cost of repairing `k` robots from index `p` to `p+k-1` at factory `f_pos` is:
// `sum_{r=p to p+k-1} |robots[r] - f_pos|`
// This can be split into two parts:
// `sum_{robots[r] < f_pos} (f_pos - robots[r]) + sum_{robots[r] >= f_pos} (robots[r] - f_pos)`
//
// The DP state `dp[i][j]` means minimum cost to repair the first `i` robots using the first `j` factories.
// The `j`-th factory has a limit.
//
// Let's consider `dp[i][j]` as the minimum cost to repair the first `i` robots using only the first `j` factories.
// `dp[i][j] = dp[i][j-1]` (robot `i` is NOT repaired by factory `j`).
// `dp[i][j] = min_{1 <= k <= min(i, limit_of_factory_j)} (dp[i-k][j-1] + cost_to_repair_k_robots_at_factory_j)`
//
// This structure still has `O(N^2 * M)` complexity, where N is number of robots and M is number of factories.
//
// An alternative DP state could be `dp[i][j]` meaning the minimum cost to repair robot `i` using factory `j`. This is too granular.
//
// Let's re-examine the problem structure and constraints.
// Robots and factories are on a 1D line.
// Sorting both is crucial.
//
// Let `robots` be `r_1, r_2, ..., r_n` and `factories` be `f_1, f_2, ..., f_m` with limits `l_1, l_2, ..., l_m`.
//
// Consider `dp[i][j]` = minimum cost to fix first `i` robots using first `j` factories.
//
// When considering `dp[i][j]`:
// 1. Factory `j` is not used at all. The cost is `dp[i][j-1]`.
// 2. Factory `j` is used. It can fix `k` robots, where `1 <= k <= min(i, limit_j)`.
//    These `k` robots must be a contiguous block of the first `i` robots, specifically robots `i-k+1` through `i`.
//    Why contiguous? Because if we send robots `r_a` and `r_c` to factory `j`, and `r_b` (where `r_a < r_b < r_c`) to another factory, and `r_a` and `r_c` are sorted, it's generally better to keep the robots that are close to each other together.
//    The logic here is that if we sort robots, and we decide to send a block of `k` robots ending at robot `i` to factory `j`, then these `k` robots are `robots[i-k], ..., robots[i-1]` (using 0-based indexing for robots array).
//    The cost would be `dp[i-k][j-1]` (minimum cost for the first `i-k` robots using the first `j-1` factories) + `cost_to_fix_robots[i-k...i-1]_at_factory_j`.
//
// This DP state and transition seems correct and is `O(N^2 * M)`.
// Let's check the calculation of `cost_to_fix_robots[i-k...i-1]_at_factory_j`.
// Let `r_idx` be the start index of robots (`i-k`) and `end_idx` be the end index (`i-1`).
// Let `f_pos` be the position of factory `j`.
// `cost = sum(abs(robots[p] - f_pos) for p from r_idx to end_idx)`.
//
// To optimize this sum calculation:
// We need prefix sums for robot positions. Let `P[x] = sum(robots[0] to robots[x-1])`.
// `P[0] = 0`
// `P[x] = P[x-1] + robots[x-1]` for `x > 0`.
//
// For a range of robots `robots[a...b]` and factory position `f_pos`:
// The sum of distances is `sum_{p=a to b} |robots[p] - f_pos|`.
//
// If all robots in the range are to the left of `f_pos` (`robots[b] < f_pos`):
// Sum = `sum_{p=a to b} (f_pos - robots[p]) = (b - a + 1) * f_pos - sum(robots[a...b])`
// Sum = `(b - a + 1) * f_pos - (P[b+1] - P[a])`
//
// If all robots in the range are to the right of `f_pos` (`robots[a] > f_pos`):
// Sum = `sum_{p=a to b} (robots[p] - f_pos) = sum(robots[a...b]) - (b - a + 1) * f_pos`
// Sum = `(P[b+1] - P[a]) - (b - a + 1) * f_pos`
//
// If some are left and some are right, we need to find the split point.
// Let `split_idx` be the index such that `robots[split_idx] <= f_pos` and `robots[split_idx+1] > f_pos`.
// Sum = `sum_{p=a to split_idx} (f_pos - robots[p]) + sum_{p=split_idx+1 to b} (robots[p] - f_pos)`
// This `split_idx` can be found using binary search (`Arrays.binarySearch` or `upper_bound` logic).
//
// The DP state `dp[i][j]` represents the min cost to repair the first `i` robots (indices `0` to `i-1`) using the first `j` factories (indices `0` to `j-1`).
// `i` ranges from `0` to `N` (number of robots).
// `j` ranges from `0` to `M` (number of factories).
//
// `dp` table size: `(N+1) x (M+1)`.
//
// Initialize `dp` table with infinity. `dp[0][j] = 0` for all `j`, as 0 robots cost 0 to fix.
// `dp[i][0] = infinity` for `i > 0`, as we can't fix robots without factories.
//
// For `i` from 1 to N:
//   For `j` from 1 to M:
//     // Option 1: Robot `i-1` is NOT repaired by factory `j-1`
//     `dp[i][j] = dp[i][j-1]`
//
//     // Option 2: Robot `i-1` IS repaired by factory `j-1`.
//     // This factory `j-1` repairs `k` robots, from `i-k` to `i-1`.
//     // `k` can range from 1 up to `min(i, factories[j-1].limit)`.
//     `factory_pos = factories[j-1].position`
//     `factory_limit = factories[j-1].limit`
//
//     For `k` from 1 to `min(i, factory_limit)`:
//       `robot_start_idx = i - k`
//       `robot_end_idx = i - 1`
//
//       // Calculate cost to repair robots `robots[robot_start_idx...robot_end_idx]` at `factory_pos`
//       `current_repair_cost = calculate_distance_cost(robots, robot_start_idx, robot_end_idx, factory_pos)`
//
//       If `dp[i-k][j-1]` is not infinity:
//         `dp[i][j] = min(dp[i][j], dp[i-k][j-1] + current_repair_cost)`
//
// `calculate_distance_cost(robots, start_idx, end_idx, factory_pos)`:
//   This function needs to use prefix sums for `O(1)` or `O(log N)` calculation per call.
//   Since we have `split_idx` finding, it might be `O(log N)`.
//   With precomputed prefix sums `P`:
//   `sum_robots_in_range = P[end_idx + 1] - P[start_idx]`
//   `num_robots_in_range = end_idx - start_idx + 1`
//
//   Find `split_idx` such that `robots[split_idx] <= factory_pos` and `robots[split_idx+1] > factory_pos`.
//   `split_idx = Arrays.binarySearch(robots, start_idx, end_idx + 1, factory_pos)`
//   If `split_idx < 0`, it means `factory_pos` is not found. The insertion point is `-(split_idx + 1)`.
//   `split_idx = -(split_idx + 1) - 1`  (This gives the index of the last element <= factory_pos)
//   Or we can use `upper_bound` logic.
//
//   Let's implement `upper_bound` helper to find the first element greater than `val`.
//   `upper_bound(arr, start, end, val)` returns index of first element `> val`.
//
//   `split_point = upper_bound(robots, start_idx, end_idx + 1, factory_pos)`
//   // `split_point` is the index of the first robot to the right of `factory_pos` (or `end_idx+1` if all are <=)
//
//   `left_count = split_point - start_idx`
//   `right_count = (end_idx + 1) - split_point`
//
//   `cost = 0`
//   If `left_count > 0`:
//     `sum_left_robots = P[split_point] - P[start_idx]`
//     `cost += left_count * factory_pos - sum_left_robots`
//   If `right_count > 0`:
//     `sum_right_robots = P[end_idx + 1] - P[split_point]`
//     `cost += sum_right_robots - right_count * factory_pos`
//
//   Return `cost`.
//
// Time Complexity:
// Sorting robots: `O(N log N)`
// Sorting factories: `O(M log M)`
// Prefix sums: `O(N)`
// DP calculation: `O(N * M * min(N, max_limit))` where `max_limit` is the max factory limit.
// In the worst case, `max_limit` can be `N`. So `O(N^2 * M)`.
// The `calculate_distance_cost` function uses binary search (for `split_point`) which is `O(log N)`.
// So, the overall DP part is `O(N * M * min(N, max_limit) * log N)`.
// If `max_limit` is small, say `K`, then `O(N * M * K * log N)`.
// If `max_limit` is large (up to N), it's `O(N^2 * M * log N)`.
//
// Given N, M <= 100, `100^2 * 100 * log 100` is roughly `10^6 * 7`, which is feasible.
//
// Space Complexity: `O(N * M)` for the DP table.
//
// Important consideration: The problem states "the test cases are generated such that all the robots can be repaired." This means the sum of limits must be at least the number of robots.
//
// Let's consider the data types for positions and distances. Positions can be up to `10^9`. Distances can be up to `2 * 10^9`. Total distance can be up to `N * 2 * 10^9`, which can exceed `int` capacity. Use `long` for DP table and distance calculations.
//
// Let's define a `Factory` class to hold position and limit together.
//
// The DP indices need careful handling.
// `dp[i][j]` = min cost for first `i` robots (0 to `i-1`) using first `j` factories (0 to `j-1`).
//
// `robots` array size `N`. `factories` array size `M`.
// `dp` table size `(N+1) x (M+1)`.
//
// `dp[0][j] = 0` for `j = 0 to M`.
// `dp[i][0] = infinity` for `i = 1 to N`.
//
// Outer loop for `i` (robots): 1 to N.
// Inner loop for `j` (factories): 1 to M.
//   `dp[i][j] = dp[i][j-1]` // Factory `j-1` is not used to fix robot `i-1`
//
//   Innermost loop for `k` (number of robots fixed by factory `j-1`): 1 to `min(i, factories[j-1].limit)`.
//     `prev_robots_count = i - k`
//     `current_robot_idx_start = i - k`
//     `current_robot_idx_end = i - 1`
//
//     If `dp[prev_robots_count][j-1]` is not infinity:
//       `cost = calculate_distance_cost(robots, current_robot_idx_start, current_robot_idx_end, factories[j-1].position)`
//       `dp[i][j] = min(dp[i][j], dp[prev_robots_count][j-1] + cost)`
//
// The `calculate_distance_cost` function will use the sorted `robots` array and prefix sums.
//
// We need a way to represent infinity. `Long.MAX_VALUE` is a good choice.
//
// `upper_bound` implementation:
// `int upper_bound(int[] arr, int start, int end, int val)`:
//   `low = start`, `high = end`
//   `ans = end`
//   while `low < high`:
//     `mid = low + (high - low) / 2`
//     if `arr[mid] > val`:
//       `ans = mid`
//       `high = mid`
//     else:
//       `low = mid + 1`
//   return `ans`
//
// The range for `upper_bound` call in `calculate_distance_cost`:
// We are looking for the split point within `robots[start_idx ... end_idx]`.
// So the array slice is `robots[start_idx]` to `robots[end_idx]`.
// The `upper_bound` function should operate on this slice.
// `upper_bound(robots, start_idx, end_idx + 1, factory_pos)` where `end_idx+1` is the exclusive upper bound for the search range in `arr`.
//
// Example 1:
// robot = [0,4,6], factory = [[2,2],[6,2]]
// N=3, M=2
// robots = [0, 4, 6] (sorted)
// factories = [{pos=2, lim=2}, {pos=6, lim=2}] (sorted by pos)
//
// Prefix sums for robots: P = [0, 0, 4, 10]
// P[0]=0
// P[1]=0 (robots[0])
// P[2]=0+4 (robots[0]+robots[1])
// P[3]=0+4+6 (robots[0]+robots[1]+robots[2])
//
// dp table (4x3)
//       j=0  j=1  j=2
// i=0:   0    0    0
// i=1: inf  inf  inf
// i=2: inf  inf  inf
// i=3: inf  inf  inf
//
// i=1 (robot 0):
//   j=1 (factory 0: pos=2, lim=2)
//     dp[1][1] = dp[1][0] (inf)
//     k=1: prev_robots_count=0.
//       robot_start_idx = 0, robot_end_idx = 0.
//       cost(0..0, pos=2) = |0-2| = 2.
//       dp[1][1] = min(inf, dp[0][0] + 2) = min(inf, 0 + 2) = 2.
//   j=2 (factory 1: pos=6, lim=2)
//     dp[1][2] = dp[1][1] = 2.
//     k=1: prev_robots_count=0.
//       robot_start_idx=0, robot_end_idx=0.
//       cost(0..0, pos=6) = |0-6| = 6.
//       dp[1][2] = min(2, dp[0][1] + 6) = min(2, 0 + 6) = 2.
//
// dp table after i=1:
//       j=0  j=1  j=2
// i=0:   0    0    0
// i=1: inf    2    2
// i=2: inf  inf  inf
// i=3: inf  inf  inf
//
// i=2 (robots 0, 1):
//   j=1 (factory 0: pos=2, lim=2)
//     dp[2][1] = dp[2][0] (inf)
//     k=1: prev_robots_count=1.
//       robot_start_idx=1, robot_end_idx=1.
//       cost(1..1, pos=2) = |4-2| = 2.
//       dp[2][1] = min(inf, dp[1][0] + 2) = min(inf, inf + 2) = inf. (Mistake here: dp[1][0] is inf. Robot 0 MUST use factory 1 here if only factory 0 is available!)
//       This means when we say `dp[i-k][j-1]`, it means first `i-k` robots used first `j-1` factories.
//       So `dp[1][0]` means first 1 robot using 0 factories, which is impossible.
//       Ah, the issue is `dp[i-k][j-1]` can be `infinity`. We only update if it's not `infinity`.
//       Corrected transition:
//       If `dp[prev_robots_count][j-1]` is not `Long.MAX_VALUE`:
//         `dp[i][j] = min(dp[i][j], dp[prev_robots_count][j-1] + cost)`
//
//     Let's re-evaluate `dp[2][1]` for factory 0 (pos=2, lim=2):
//     k=1: prev_robots_count=1. robots[1] to factory 0. cost=|4-2|=2.
//          dp[1][0] is inf. Cannot use this transition.
//     k=2: prev_robots_count=0. robots[0] to robots[1] to factory 0.
//          cost(0..1, pos=2). robots[0]=0, robots[1]=4.
//          Split point for pos=2: robots[0]=0 <= 2, robots[1]=4 > 2. Split is after index 0.
//          Left: robot 0. |0-2|=2.
//          Right: robot 1. |4-2|=2.
//          Total cost = 2 + 2 = 4.
//          dp[2][1] = min(inf, dp[0][0] + 4) = min(inf, 0 + 4) = 4.
//
//   j=2 (factory 1: pos=6, lim=2)
//     dp[2][2] = dp[2][1] = 4. (Robot 1 is not fixed by factory 1, it's fixed by factory 0)
//     k=1: prev_robots_count=1. robots[1] to factory 1. cost=|4-6|=2.
//          dp[1][1] = 2. (Robot 0 fixed by factory 0)
//          dp[2][2] = min(4, dp[1][1] + 2) = min(4, 2 + 2) = 4.
//     k=2: prev_robots_count=0. robots[0] to robots[1] to factory 1.
//          cost(0..1, pos=6). robots[0]=0, robots[1]=4.
//          All robots < 6.
//          Cost = (6-0) + (6-4) = 6 + 2 = 8.
//          dp[2][2] = min(4, dp[0][1] + 8) = min(4, 0 + 8) = 4.
//
// dp table after i=2:
//       j=0  j=1  j=2
// i=0:   0    0    0
// i=1: inf    2    2
// i=2: inf    4    4
// i=3: inf  inf  inf
//
// i=3 (robots 0, 1, 2):
//   j=1 (factory 0: pos=2, lim=2)
//     dp[3][1] = dp[3][0] (inf)
//     k=1: prev_robots_count=2. robots[2] to factory 0. cost=|6-2|=4.
//          dp[2][0] is inf. Cannot use.
//     k=2: prev_robots_count=1. robots[1] to robots[2] to factory 0.
//          cost(1..2, pos=2). robots[1]=4, robots[2]=6.
//          Split point for pos=2: robots[1]=4 > 2, robots[2]=6 > 2. All > 2.
//          Cost = (4-2) + (6-2) = 2 + 4 = 6.
//          dp[1][0] is inf. Cannot use.
//     So dp[3][1] remains inf. (This factory alone cannot fix 3 robots)
//
//   j=2 (factory 1: pos=6, lim=2)
//     dp[3][2] = dp[3][1] = inf.
//     k=1: prev_robots_count=2. robots[2] to factory 1. cost=|6-6|=0.
//          dp[2][1] = 4. (Robots 0,1 fixed by factory 0)
//          dp[3][2] = min(inf, dp[2][1] + 0) = min(inf, 4 + 0) = 4.
//     k=2: prev_robots_count=1. robots[1] to robots[2] to factory 1.
//          cost(1..2, pos=6). robots[1]=4, robots[2]=6.
//          Split point for pos=6: robots[1]=4 <= 6, robots[2]=6 <= 6. All <= 6.
//          Cost = (6-4) + (6-6) = 2 + 0 = 2.
//          dp[1][1] = 2. (Robot 0 fixed by factory 0)
//          dp[3][2] = min(4, dp[1][1] + 2) = min(4, 2 + 2) = 4.
//     k=3: prev_robots_count=0. robots[0] to robots[2] to factory 1.
//          cost(0..2, pos=6). robots[0]=0, robots[1]=4, robots[2]=6.
//          All robots <= 6.
//          Cost = (6-0) + (6-4) + (6-6) = 6 + 2 + 0 = 8.
//          dp[3][2] = min(4, dp[0][1] + 8) = min(4, 0 + 8) = 4.
//
// Final answer: dp[N][M] = dp[3][2] = 4. This matches the example.
//
// Let's trace `calculate_distance_cost` for `robots=[0,4,6]`, `start_idx=0`, `end_idx=1`, `factory_pos=2`.
// P = [0, 0, 4, 10]
// `upper_bound(robots, 0, 2, 2)`:
// arr=[0, 4], val=2
// low=0, high=2, ans=2
// mid = 1. arr[1]=4 > 2. ans=1, high=1.
// low=0, high=1.
// mid = 0. arr[0]=0 <= 2. low=1.
// low=1, high=1. Loop terminates.
// Returns ans=1.
// `split_point = 1`. This means `robots[1]` is the first element strictly greater than 2.
// `robots[0]=0 <= 2`. `robots[1]=4 > 2`. Correct.
//
// `start_idx = 0`, `end_idx = 1`.
// `split_point = 1`.
// `left_count = split_point - start_idx = 1 - 0 = 1`. (Robot at index 0)
// `right_count = (end_idx + 1) - split_point = (1 + 1) - 1 = 2 - 1 = 1`. (Robot at index 1)
//
// `P[split_point] = P[1] = 0`. `P[start_idx] = P[0] = 0`.
// `sum_left_robots = P[1] - P[0] = 0 - 0 = 0`.
// `cost += left_count * factory_pos - sum_left_robots = 1 * 2 - 0 = 2`.
//
// `P[end_idx + 1] = P[2] = 4`. `P[split_point] = P[1] = 0`.
// `sum_right_robots = P[2] - P[1] = 4 - 0 = 4`.
// `cost += sum_right_robots - right_count * factory_pos = 4 - 1 * 2 = 4 - 2 = 2`.
//
// Total cost = 2 + 2 = 4. Correct.
//
// Let's trace `calculate_distance_cost` for `robots=[0,4,6]`, `start_idx=1`, `end_idx=2`, `factory_pos=2`.
// P = [0, 0, 4, 10]
// `upper_bound(robots, 1, 3, 2)`:
// arr=[4, 6], val=2.
// low=1, high=3, ans=3.
// mid = 2. arr[2]=6 > 2. ans=2, high=2.
// low=1, high=2.
// mid = 1. arr[1]=4 > 2. ans=1, high=1.
// low=1, high=1. Loop terminates.
// Returns ans=1.
// Oh, the `upper_bound` needs to be on the slice `robots[start_idx]` to `robots[end_idx]`.
// So the search range should be `start_idx` to `end_idx + 1` (exclusive upper bound).
// `upper_bound(robots, start_idx, end_idx + 1, val)`
//
// `robots = [0, 4, 6]`, `start_idx=1`, `end_idx=2`, `factory_pos=2`.
// `upper_bound(robots, 1, 3, 2)`:
//   `low=1`, `high=3`, `ans=3`
//   `mid = 1 + (3-1)/2 = 2`. `robots[2]=6 > 2`. `ans=2`, `high=2`.
//   `low=1`, `high=2`
//   `mid = 1 + (2-1)/2 = 1`. `robots[1]=4 > 2`. `ans=1`, `high=1`.
//   `low=1`, `high=1`. Loop ends. Returns `ans=1`.
//   This is incorrect. It should find the first element *strictly greater* than `val`.
//   `robots = [0, 4, 6]`. `start_idx=1`, `end_idx=2`. Range of indices to consider is `[1, 2]`.
//   Values are `robots[1]=4`, `robots[2]=6`.
//   We need to find the first element in `robots[1..2]` that is `> 2`.
//   `robots[1]=4` is `> 2`. So `split_point` should be `1`.
//
// Let's refine `upper_bound`:
// `int upper_bound(int[] arr, int start, int end, int val)` searches in `arr[start...end-1]`.
// Returns the index of the first element in `arr[start...end-1]` that is `> val`.
// If all elements are `<= val`, it returns `end`.
//
// `int upper_bound(int[] arr, int start, int end, int val)`:
//   `low = start`, `high = end` // `high` is exclusive
//   while `low < high`:
//     `mid = low + (high - low) / 2`
//     if `arr[mid] > val`:
//       `high = mid` // `mid` is a potential answer, search left part for even smaller index
//     else:
//       `low = mid + 1` // `arr[mid] <= val`, so `mid` and everything left cannot be the answer. Search right.
//   return `low` // `low` will be the first index where `arr[low] > val`, or `end` if no such element exists.
//
// Example: `robots = [0, 4, 6]`, `start_idx=1`, `end_idx=2`, `factory_pos=2`.
// Call `upper_bound(robots, 1, 3, 2)`. `arr` is implicitly `robots`. `start=1`, `end=3`.
// `low=1`, `high=3`.
// `mid = 1 + (3-1)/2 = 2`. `robots[2]=6 > 2`. `high=2`.
// `low=1`, `high=2`.
// `mid = 1 + (2-1)/2 = 1`. `robots[1]=4 > 2`. `high=1`.
// `low=1`, `high=1`. Loop ends. Returns `low=1`.
//
// This `split_point = 1` seems correct for the range `robots[1...2]`.
// `start_idx = 1`, `end_idx = 2`.
// `split_point = 1`.
//
// `left_count = split_point - start_idx = 1 - 1 = 0`.
// `right_count = (end_idx + 1) - split_point = (2 + 1) - 1 = 3 - 1 = 2`.
//
// This means all robots in the range `[start_idx, end_idx]` are `> factory_pos`.
// `robots[1]=4`, `robots[2]=6`. `factory_pos=2`.
// This seems incorrect. The split point is the index *within the original `robots` array*.
// `split_point` is the index of the first robot strictly greater than `factory_pos`.
//
// `robots = [0, 4, 6]`, `factory_pos = 2`.
// `robots[0]=0 <= 2`. `robots[1]=4 > 2`. The split happens *between* index 0 and 1.
// The index of the first element `> 2` is `1`.
//
// `start_idx = 1`, `end_idx = 2`.
// Robots to consider: `robots[1]` and `robots[2]`.
// `factory_pos = 2`.
// `robots[1] = 4`, `robots[2] = 6`. Both are `> 2`.
//
// The `upper_bound` should search in the *entire* `robots` array, but we interpret the result relative to `start_idx`.
// `split_idx = upper_bound(robots, 0, N, factory_pos)`
// This `split_idx` is the index of the first robot position in the *whole array* that is greater than `factory_pos`.
//
// Let's re-think `calculate_distance_cost`.
// The cost is `sum_{p=start_idx to end_idx} |robots[p] - factory_pos|`.
//
// Find `k_left` = number of robots in `robots[start_idx...end_idx]` that are `<= factory_pos`.
// Find `k_right` = number of robots in `robots[start_idx...end_idx]` that are `> factory_pos`.
//
// We need to find the index `p` within `[start_idx, end_idx]` such that `robots[p] <= factory_pos` and `robots[p+1] > factory_pos`.
//
// Let `first_greater_idx = upper_bound(robots, start_idx, end_idx + 1, factory_pos)`.
// This `first_greater_idx` is the index of the first robot in `robots[start_idx...end_idx]` that is `> factory_pos`.
//
// If `first_greater_idx == start_idx`, it means all robots `robots[start_idx...end_idx]` are `> factory_pos`.
// If `first_greater_idx == end_idx + 1`, it means all robots `robots[start_idx...end_idx]` are `<= factory_pos`.
//
// `num_left_robots = first_greater_idx - start_idx`
// `num_right_robots = (end_idx + 1) - first_greater_idx`
//
// `sum_left_robots = P[first_greater_idx] - P[start_idx]`
// `cost += num_left_robots * factory_pos - sum_left_robots`
//
// `sum_right_robots = P[end_idx + 1] - P[first_greater_idx]`
// `cost += sum_right_robots - num_right_robots * factory_pos`
//
// Let's re-trace `calculate_distance_cost` for `robots=[0,4,6]`, `start_idx=1`, `end_idx=2`, `factory_pos=2`.
// P = [0, 0, 4, 10]
// `first_greater_idx = upper_bound(robots, 1, 3, 2)`. Returns 1.
// `start_idx=1`, `end_idx=2`, `factory_pos=2`.
// `first_greater_idx = 1`.
//
// `num_left_robots = first_greater_idx - start_idx = 1 - 1 = 0`.
// `num_right_robots = (end_idx + 1) - first_greater_idx = (2 + 1) - 1 = 3 - 1 = 2`.
//
// This implies that all robots in the range `[1, 2]` are `> factory_pos`.
// `robots[1]=4`, `robots[2]=6`. Both are `> 2`. This interpretation is correct.
//
// `sum_left_robots = P[first_greater_idx] - P[start_idx] = P[1] - P[1] = 0 - 0 = 0`.
// `cost += num_left_robots * factory_pos - sum_left_robots = 0 * 2 - 0 = 0`.
//
// `sum_right_robots = P[end_idx + 1] - P[first_greater_idx] = P[3] - P[1] = 10 - 0 = 10`.
// `cost += sum_right_robots - num_right_robots * factory_pos = 10 - 2 * 2 = 10 - 4 = 6`.
//
// Total cost = 0 + 6 = 6. This is correct.
// Cost(robots[1]=4, pos=2) = |4-2| = 2.
// Cost(robots[2]=6, pos=2) = |6-2| = 4.
// Total = 2 + 4 = 6.
//
// The `upper_bound` function seems fine.
//
// Need to handle `Long.MAX_VALUE` properly.
// When `dp[prev_robots_count][j-1]` is `Long.MAX_VALUE`, adding any positive cost will overflow.
// So, check `dp[prev_robots_count][j-1] != Long.MAX_VALUE` before calculating the new total cost.
//
// If `i-k == 0`, then `dp[0][j-1]` is used. `dp[0][j]` is always 0.
// The prefix sum calculation: `P[end_idx + 1] - P[start_idx]`.
// `P` has size `N+1`. Indices `0` to `N`.
// `P[x]` stores sum of `robots[0]` to `robots[x-1]`.
// `sum(robots[a]...robots[b])` = `P[b+1] - P[a]`.
//
// `start_idx` and `end_idx` are 0-based indices of `robots` array.
// `num_left_robots = first_greater_idx - start_idx`. These are robots from index `start_idx` up to `first_greater_idx - 1`.
// The prefix sum for these should be `P[first_greater_idx] - P[start_idx]`. This seems correct.
//
// `num_right_robots = (end_idx + 1) - first_greater_idx`. These are robots from index `first_greater_idx` up to `end_idx`.
// The prefix sum for these should be `P[end_idx + 1] - P[first_greater_idx]`. This also seems correct.
//
// The DP state transitions and calculations appear sound.
//
// Need to sort factories based on position.
//
// Factory struct/class:
// `class Factory { int position; int limit; }`
//
// Final check on constraints and types:
// robot positions and factory positions: `-10^9` to `10^9`. `long` might be safer for position if intermediate calculations in cost function could overflow, but `abs(pos - pos)` fits in `long`.
// `limitj`: `0` to `robot.length`.
// `robot.length`, `factory.length`: `1` to `100`.
//
// `dp` table elements: `long`.
// `prefix_sums` array: `long`.
// `cost` calculation: `long`.
//
// Initializing DP table:
// `dp[0][j] = 0` for all `j` from `0` to `M`.
// `dp[i][0] = Long.MAX_VALUE` for all `i` from `1` to `N`.
//
// `dp[i][j]` can be initialized from `dp[i][j-1]` first.
//
// Loop structure:
// for `i` from 1 to N:
//   for `j` from 1 to M:
//     // Option 1: Factory `j-1` not used for robot `i-1`
//     `dp[i][j] = dp[i][j-1]`
//
//     // Option 2: Factory `j-1` used for robots `i-k` to `i-1`
//     `f_pos = factories[j-1].position`
//     `f_lim = factories[j-1].limit`
//     for `k` from 1 to `min(i, f_lim)`:
//       `prev_r_count = i - k`
//       `curr_r_start_idx = i - k`
//       `curr_r_end_idx = i - 1`
//       if `dp[prev_r_count][j-1] != Long.MAX_VALUE`:
//         `cost = calculate_distance_cost(robots, curr_r_start_idx, curr_r_end_idx, f_pos, prefix_sums)`
//         `dp[i][j] = Math.min(dp[i][j], dp[prev_r_count][j-1] + cost)`
//
// Return `dp[N][M]`.
//
// The `calculate_distance_cost` needs to be a helper method.
//
// Need `Factory` class.
// Need `Arrays.sort` for robots.
// Need `Arrays.sort` for factories based on position.
//
// The time complexity of the DP part is `O(N * M * K * log N)` if `K` is the maximum limit of any factory.
// If we consider that `k` loops up to `min(i, f_lim)`, and `i` goes up to `N`, and `f_lim` goes up to `N`.
// The loop `for k from 1 to min(i, f_lim)` can execute up to `N` times.
// So it's `O(N * M * N * log N)` in the worst case if `f_lim` is always large.
//
// Example: `robot = [1,-1], factory = [[-2,1],[2,1]]`
// N=2, M=2
// robots = [-1, 1] (sorted)
// factories = [{pos=-2, lim=1}, {pos=2, lim=1}] (sorted by pos)
// P = [0, -1, 0]
//
// dp table (3x3)
//       j=0  j=1  j=2
// i=0:   0    0    0
// i=1: inf  inf  inf
// i=2: inf  inf  inf
//
// i=1 (robot 0: pos=-1):
//   j=1 (factory 0: pos=-2, lim=1)
//     dp[1][1] = dp[1][0] = inf.
//     k=1: prev_r_count=0. robot_start_idx=0, robot_end_idx=0.
//       cost(0..0, pos=-2). robot=-1. |(-1) - (-2)| = |-1 + 2| = 1.
//       dp[1][1] = min(inf, dp[0][0] + 1) = 0 + 1 = 1.
//   j=2 (factory 1: pos=2, lim=1)
//     dp[1][2] = dp[1][1] = 1.
//     k=1: prev_r_count=0. robot_start_idx=0, robot_end_idx=0.
//       cost(0..0, pos=2). robot=-1. |(-1) - 2| = |-3| = 3.
//       dp[1][2] = min(1, dp[0][1] + 3) = min(1, 0 + 3) = 1.
//
// dp table after i=1:
//       j=0  j=1  j=2
// i=0:   0    0    0
// i=1: inf    1    1
// i=2: inf  inf  inf
//
// i=2 (robots 0, 1: pos=-1, 1):
//   j=1 (factory 0: pos=-2, lim=1)
//     dp[2][1] = dp[2][0] = inf.
//     k=1: prev_r_count=1. robot_start_idx=1, robot_end_idx=1.
//       cost(1..1, pos=-2). robot=1. |1 - (-2)| = |1+2| = 3.
//       dp[1][0] is inf. Cannot use.
//     k=2: This is not allowed as factory limit is 1.
//     So dp[2][1] remains inf. (Factory 0 cannot fix 2 robots)
//
//   j=2 (factory 1: pos=2, lim=1)
//     dp[2][2] = dp[2][1] = inf.
//     k=1: prev_r_count=1. robot_start_idx=1, robot_end_idx=1.
//       cost(1..1, pos=2). robot=1. |1 - 2| = |-1| = 1.
//       dp[1][1] = 1. (Robot 0 fixed by factory 0)
//       dp[2][2] = min(inf, dp[1][1] + 1) = min(inf, 1 + 1) = 2.
//     k=2: Not allowed as factory limit is 1.
//
// Final answer: dp[N][M] = dp[2][2] = 2. Matches example.
//
// The DP state and transitions are solid.
//
// Let's write down the class structure.
// `Solution` class with `minTotalDistance` method.
// `Factory` inner class.
// `calculate_distance_cost` helper method.
// `upper_bound` helper method.
//
// `prefix_sums` array needs to be built from sorted `robots`.
// `robots` array needs to be sorted.
// `factories` array needs to be sorted by position.
//
// Max value of N, M is 100. `N+1` and `M+1` sizes for DP table are fine.
// `prefix_sums` array size `N+1`.
//
// Consider the `limitj` values. They can be 0. If limit is 0, that factory cannot repair any robot. The loop `for k from 1 to min(i, f_lim)` will not run if `f_lim` is 0. This is handled correctly.
//
// The problem guarantees all robots can be repaired. This means `sum(limitj) >= N`.
//
// A small optimization on `calculate_distance_cost`:
// Instead of binary searching for `first_greater_idx` every time, we can use the fact that robots are sorted.
// For a fixed `factory_pos`, and given range `[start_idx, end_idx]`:
// If `factory_pos < robots[start_idx]`: all robots are to the right.
// If `factory_pos >= robots[end_idx]`: all robots are to the left.
// Otherwise, we need to find the split.
//
// The `upper_bound` approach covers all cases naturally and is `O(log N)`. It is efficient enough.
//
// Let's define `Factory` struct.
// `class Factory { int position; int limit; }`
//
// Sorting factories: `Arrays.sort(factories, Comparator.comparingInt(f -> f.position));`
// Sorting robots: `Arrays.sort(robots);`
//
// Create `prefix_sums` array of `long`.
// `prefix_sums[0] = 0;`
// `for (int i = 0; i < N; i++) { prefix_sums[i+1] = prefix_sums[i] + robots[i]; }`
//
// Create `dp` table `long[N+1][M+1]`.
// Initialize with `Long.MAX_VALUE`.
// Set `dp[0][j] = 0` for `j` from `0` to `M`.
//
// DP loops.
//
// Final check of helper `upper_bound`:
// `int upper_bound(int[] arr, int start, int end, int val)`
// Searches in `arr[start...end-1]`. Returns index `idx` such that `arr[idx] > val` and for all `i < idx`, `arr[i] <= val`.
// If all elements in `arr[start...end-1]` are `<= val`, returns `end`.
//
// Test cases for `upper_bound`:
// arr = [2, 5, 8, 12], start=0, end=4, val=7.
// low=0, high=4.
// mid=2. arr[2]=8 > 7. high=2.
// low=0, high=2.
// mid=1. arr[1]=5 <= 7. low=2.
// low=2, high=2. Loop ends. Returns low=2. Correct. (arr[2]=8 is first > 7)
//
// arr = [2, 5, 8, 12], start=0, end=4, val=1.
// low=0, high=4.
// mid=2. arr[2]=8 > 1. high=2.
// low=0, high=2.
// mid=1. arr[1]=5 > 1. high=1.
// low=0, high=1.
// mid=0. arr[0]=2 > 1. high=0.
// low=0, high=0. Loop ends. Returns low=0. Correct. (arr[0]=2 is first > 1)
//
// arr = [2, 5, 8, 12], start=0, end=4, val=13.
// low=0, high=4.
// mid=2. arr[2]=8 <= 13. low=3.
// low=3, high=4.
// mid=3. arr[3]=12 <= 13. low=4.
// low=4, high=4. Loop ends. Returns low=4. Correct. (end reached)
//
// arr = [2, 5, 8, 12], start=1, end=3, val=6. (Search in [5, 8])
// low=1, high=3.
// mid=2. arr[2]=8 > 6. high=2.
// low=1, high=2.
// mid=1. arr[1]=5 <= 6. low=2.
// low=2, high=2. Loop ends. Returns low=2. Correct. (arr[2]=8 is first > 6 in arr[1..2])
//
// The `upper_bound` logic is correct for finding the first element strictly greater than `val` within the range `arr[start...end-1]`.
//
// The indices in `calculate_distance_cost` refer to the original `robots` array.
// `first_greater_idx = upper_bound(robots, start_idx, end_idx + 1, factory_pos)`
// This searches in `robots[start_idx ... end_idx]`.
// If `factory_pos` is found, `upper_bound` returns the index *after* the last occurrence.
// If `factory_pos` is not found, it returns the index where it would be inserted to maintain order.
//
// Example: `robots=[0, 4, 6]`, `start_idx=0`, `end_idx=1`, `factory_pos=2`.
// `upper_bound(robots, 0, 2, 2)` searches in `robots[0...1] = [0, 4]`.
//   `low=0`, `high=2`.
//   `mid=1`. `robots[1]=4 > 2`. `high=1`.
//   `low=0`, `high=1`.
//   `mid=0`. `robots[0]=0 <= 2`. `low=1`.
//   `low=1`, `high=1`. Loop ends. Returns `low=1`.
// `first_greater_idx = 1`.
// `num_left_robots = first_greater_idx - start_idx = 1 - 0 = 1`. (Robot at index 0)
// `num_right_robots = (end_idx + 1) - first_greater_idx = (1 + 1) - 1 = 1`. (Robot at index 1)
// This splitting seems correct.
//
// `sum_left_robots = P[first_greater_idx] - P[start_idx] = P[1] - P[0] = 0 - 0 = 0`.
// `cost += 1 * 2 - 0 = 2`.
//
// `sum_right_robots = P[end_idx + 1] - P[first_greater_idx] = P[2] - P[1] = 4 - 0 = 4`.
// `cost += 4 - 1 * 2 = 2`.
// Total cost = 2 + 2 = 4.
//
// Everything looks good.
```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

class Solution {

    // Class to represent a factory with its position and repair limit.
    private static class Factory {
        int position;
        int limit;

        Factory(int position, int limit) {
            this.position = position;
            this.limit = limit;
        }
    }

    /**
     * Calculates the minimum total distance traveled by all robots to be repaired by factories.
     *
     * Approach:
     * This problem is solved using dynamic programming.
     * 1. Sort the robot positions and factory positions. This is crucial for a DP approach that processes elements in order.
     * 2. Define a DP state: `dp[i][j]` represents the minimum total distance to repair the first `i` robots (robots from index 0 to i-1) using only the first `j` factories (factories from index 0 to j-1).
     * 3. The DP transition considers two main possibilities for the `i`-th robot:
     *    a. The `i`-th robot is NOT repaired by the `j`-th factory. In this case, the minimum cost is `dp[i][j-1]`.
     *    b. The `i`-th robot IS repaired by the `j`-th factory. The `j`-th factory can repair up to `limit_j` robots. If it repairs `k` robots, these must be the last `k` robots among the first `i` robots (i.e., robots from index `i-k` to `i-1`). The cost for this option is `dp[i-k][j-1]` (minimum cost to repair the first `i-k` robots using the first `j-1` factories) plus the cost of repairing robots `i-k` through `i-1` at the `j`-th factory.
     * 4. We iterate `k` from 1 up to `min(i, limit_j)` to find the best number of robots the `j`-th factory should repair in this scenario.
     * 5. The `calculate_distance_cost` helper function efficiently computes the sum of distances for a given range of robots to a factory using prefix sums and binary search.
     * 6. The DP table is initialized with a large value (representing infinity) and base cases are set. `dp[0][j]` is 0 (0 robots cost 0 to fix), and `dp[i][0]` is infinity (cannot fix robots without factories).
     *
     * Time Complexity:
     * - Sorting robots: O(N log N), where N is the number of robots.
     * - Sorting factories: O(M log M), where M is the number of factories.
     * - Precomputing prefix sums: O(N).
     * - DP calculation: The DP table has dimensions (N+1) x (M+1). For each cell `dp[i][j]`, we iterate `k` up to `min(i, limit_j)`. In the worst case, `limit_j` can be up to N, and `i` up to N. This gives an outer loop of O(N*M). The inner loop for `k` can run up to O(N) times. The `calculate_distance_cost` function uses binary search, taking O(log N) time.
     *   Therefore, the total time complexity for the DP part is O(N * M * min(N, max_limit) * log N). Since `max_limit` can be up to N, this is bounded by O(N^2 * M * log N). Given N, M <= 100, this is feasible.
     *
     * Space Complexity:
     * - DP table: O(N * M) to store the minimum distances.
     * - Prefix sums: O(N).
     * - Total space complexity is O(N * M).
     */
    public long minTotalDistance(int[] robot, int[][] factory) {
        int n = robot.length; // Number of robots
        int m = factory.length; // Number of factories

        // 1. Sort robot positions.
        Arrays.sort(robot);

        // Create Factory objects and sort them by position.
        Factory[] factories = new Factory[m];
        for (int i = 0; i < m; i++) {
            factories[i] = new Factory(factory[i][0], factory[i][1]);
        }
        Arrays.sort(factories, Comparator.comparingInt(f -> f.position));

        // 2. Precompute prefix sums of robot positions for efficient distance calculation.
        // prefixSums[i] stores the sum of robot[0]...robot[i-1].
        long[] prefixSums = new long[n + 1];
        prefixSums[0] = 0;
        for (int i = 0; i < n; i++) {
            prefixSums[i + 1] = prefixSums[i] + robot[i];
        }

        // 3. Initialize DP table.
        // dp[i][j] = minimum total distance to repair the first 'i' robots using the first 'j' factories.
        // i ranges from 0 to n, j ranges from 0 to m.
        long[][] dp = new long[n + 1][m + 1];

        // Initialize DP table with a large value representing infinity.
        for (int i = 0; i <= n; i++) {
            Arrays.fill(dp[i], Long.MAX_VALUE);
        }

        // Base case: 0 robots cost 0 to repair, regardless of the number of factories.
        for (int j = 0; j <= m; j++) {
            dp[0][j] = 0;
        }

        // 4. Fill the DP table.
        for (int i = 1; i <= n; i++) { // Iterate through the number of robots to repair (first 'i' robots)
            for (int j = 1; j <= m; j++) { // Iterate through the number of factories available (first 'j' factories)

                // Option 1: The i-th robot is NOT repaired by the j-th factory.
                // In this case, the cost is the same as repairing the first 'i' robots using the first 'j-1' factories.
                dp[i][j] = dp[i][j - 1];

                // Option 2: The j-th factory (factories[j-1] in 0-based index) repairs some robots.
                // Let's say it repairs 'k' robots, specifically robots from index (i-k) to (i-1).
                // The factory's limit is factories[j-1].limit.
                // 'k' can range from 1 up to the minimum of 'i' (number of robots available) and the factory's limit.
                int factoryLimit = factories[j - 1].limit;
                for (int k = 1; k <= Math.min(i, factoryLimit); k++) {
                    int prevRobotsCount = i - k; // Number of robots repaired by previous factories
                    int currentRobotStartIndex = i - k; // Start index in the sorted 'robot' array for this batch
                    int currentRobotEndIndex = i - 1; // End index in the sorted 'robot' array for this batch

                    // If the previous state is reachable (not infinity)
                    if (dp[prevRobotsCount][j - 1] != Long.MAX_VALUE) {
                        // Calculate the cost to repair these 'k' robots at the current factory.
                        long currentRepairCost = calculateDistanceCost(robot, currentRobotStartIndex, currentRobotEndIndex, factories[j - 1].position, prefixSums);

                        // Update dp[i][j] with the minimum cost.
                        // This includes the cost of repairing previous robots and the cost of repairing the current batch.
                        dp[i][j] = Math.min(dp[i][j], dp[prevRobotsCount][j - 1] + currentRepairCost);
                    }
                }
            }
        }

        // The final answer is the minimum total distance to repair all 'n' robots using all 'm' factories.
        return dp[n][m];
    }

    /**
     * Calculates the sum of distances for a contiguous range of robots to be repaired by a single factory.
     * Uses prefix sums and binary search for efficiency.
     *
     * @param robots          Sorted array of robot positions.
     * @param startIdx        The starting index (inclusive) of the robot range in the 'robots' array.
     * @param endIdx          The ending index (inclusive) of the robot range in the 'robots' array.
     * @param factoryPosition The position of the factory.
     * @param prefixSums      Precomputed prefix sums of robot positions.
     * @return The total distance for this range of robots to travel to the factory.
     */
    private long calculateDistanceCost(int[] robots, int startIdx, int endIdx, int factoryPosition, long[] prefixSums) {
        // We need to find how many robots in the range [startIdx, endIdx] are to the left of factoryPosition
        // and how many are to the right.

        // Find the index of the first robot that is strictly GREATER than factoryPosition
        // within the range [startIdx, endIdx].
        // This uses a custom upper_bound logic on the 'robots' array.
        // The search range is robots[startIdx ... endIdx].
        // The upper_bound function below searches in arr[start ... end-1].
        // So we call it with end = endIdx + 1.
        int firstGreaterIdx = upper_bound(robots, startIdx, endIdx + 1, factoryPosition);

        long totalCost = 0;

        // Robots to the left of factoryPosition (robots[p] <= factoryPosition)
        // These robots are in the range [startIdx, firstGreaterIdx - 1]
        int numLeftRobots = firstGreaterIdx - startIdx;
        if (numLeftRobots > 0) {
            // Sum of robot positions from startIdx to firstGreaterIdx - 1
            long sumLeftRobots = prefixSums[firstGreaterIdx] - prefixSums[startIdx];
            // Cost = sum(factoryPosition - robots[p]) for p in [startIdx, firstGreaterIdx - 1]
            //      = numLeftRobots * factoryPosition - sumLeftRobots
            totalCost += (long)numLeftRobots * factoryPosition - sumLeftRobots;
        }

        // Robots to the right of factoryPosition (robots[p] > factoryPosition)
        // These robots are in the range [firstGreaterIdx, endIdx]
        int numRightRobots = (endIdx + 1) - firstGreaterIdx;
        if (numRightRobots > 0) {
            // Sum of robot positions from firstGreaterIdx to endIdx
            long sumRightRobots = prefixSums[endIdx + 1] - prefixSums[firstGreaterIdx];
            // Cost = sum(robots[p] - factoryPosition) for p in [firstGreaterIdx, endIdx]
            //      = sumRightRobots - numRightRobots * factoryPosition
            totalCost += sumRightRobots - (long)numRightRobots * factoryPosition;
        }

        return totalCost;
    }

    /**
     * Finds the index of the first element in the array 'arr' within the range [start, end-1]
     * that is strictly greater than 'val'.
     * This is equivalent to C++'s std::upper_bound.
     *
     * @param arr   The sorted array to search within.
     * @param start The starting index of the search range (inclusive).
     * @param end   The ending index of the search range (exclusive).
     * @param val   The value to compare against.
     * @return The index of the first element > val, or 'end' if all elements are <= val.
     */
    private int upper_bound(int[] arr, int start, int end, int val) {
        int low = start;
        int high = end; // 'high' is exclusive

        while (low < high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] > val) {
                // arr[mid] is greater than val. This 'mid' is a potential answer.
                // We try to find an even earlier index by searching in the left half [low, mid).
                high = mid;
            } else {
                // arr[mid] is less than or equal to val.
                // So, 'mid' and all elements before it cannot be the answer.
                // We need to search in the right half [mid+1, high).
                low = mid + 1;
            }
        }
        // 'low' will point to the first element > val, or 'end' if no such element exists.
        return low;
    }
}
```