```cpp
// Problem: Minimum Total Distance Traveled
// Link: https://leetcode.com/problems/minimum-total-distance-traveled/
//
// Approach:
// This problem can be solved using dynamic programming. The key observation is that
// if we sort both robots and factories by their positions, we can make decisions greedily.
// For each robot, it can be repaired by any factory. To minimize total distance, a robot
// should be repaired by the "closest" available factory within its reach.
//
// We sort both the robot positions and factory positions.
// Let dp[i][j] be the minimum total distance to repair the first 'i' robots using the first 'j' factories.
//
// To calculate dp[i][j], we have two choices for the i-th robot:
// 1. The i-th robot is repaired by the j-th factory. This is only possible if the j-th factory has
//    not reached its limit. If it is repaired by the j-th factory, the cost is the distance
//    between the i-th robot and the j-th factory, plus the minimum cost to repair the first
//    i-1 robots using some subset of the first 'j' factories.
//    However, a single factory can repair multiple robots. The crucial insight is that if
//    we decide to use the j-th factory for the i-th robot, it's optimal for the j-th factory
//    to repair a contiguous block of robots ending at the i-th robot. This is because if a
//    factory repairs robots with positions r1, r2, ..., rk, where r1 < r2 < ... < rk, and
//    the factory is at position F, the total distance is |F-r1| + |F-r2| + ... + |F-rk|.
//    If we consider robots from left to right and factories from left to right, and a factory
//    is assigned to robots from index `k` to `i-1` (meaning robots `k` through `i-1` are
//    assigned to this factory), then the state would be dp[i][j] = min(dp[k][j-1] + sum_of_distances_for_robots_k_to_i-1_with_factory_j).
//
//    This approach leads to a complexity of O(N^2 * M), where N is the number of robots and M is the number of factories, which is too slow.
//
// A more optimized DP state is needed.
// Let's sort robots: R_1, R_2, ..., R_N
// Let's sort factories: F_1, F_2, ..., F_M
//
// Consider the problem from left to right. When we are at robot R_i, it needs to be repaired.
// It can be repaired by any factory F_j.
//
// The constraint is the factory limit. This makes it tricky.
//
// Let's rethink the DP state.
// dp[i][j]: minimum total distance to repair the first `i` robots using the first `j` factories.
//
// If we are at robot `i` (after sorting robots), it must be repaired by some factory.
// If the `i`-th robot is repaired by the `j`-th factory, it means that the `j`-th factory
// will be responsible for this robot.
//
// The key insight to optimize is that if we consider robots `i` to `k` being repaired by factory `j`,
// then all robots from `i` to `k` will be sent to factory `j`.
//
// Let's define `dp[i][j]` as the minimum cost to repair the first `i` robots considering only the first `j` factories.
//
// Transition:
// dp[i][j] = dp[i][j-1] // The j-th factory is not used for the first i robots.
//
// Now, consider using the j-th factory to repair some robots.
// Suppose the j-th factory repairs robots from index `k+1` to `i`.
// The cost would be `dp[k][j-1]` (minimum cost to repair first `k` robots using first `j-1` factories)
// plus the cost of repairing robots from `k+1` to `i` using factory `j`.
//
// The cost of repairing robots from `k+1` to `i` by factory `j` is the sum of distances:
// sum(abs(factory_pos[j] - robot_pos[p])) for p from k+1 to i.
//
// The `limit` of factory `j` must be considered. If factory `j` repairs `i - k` robots, then `i - k <= limit[j]`.
//
// dp[i][j] = min(dp[i][j-1], min_{0 <= k < i, i-k <= limit[j]} (dp[k][j-1] + cost(robots[k+1...i], factory[j])))
//
// The `cost` calculation: sum(abs(factory_pos[j] - robot_pos[p])) for p from k+1 to i.
// This sum can be optimized. If we fix robot `i` and factory `j`, and we are considering that factory `j`
// repairs robots from `k+1` to `i`, then the cost is `dp[k][j-1] + sum_{p=k+1}^i |F_j - R_p|`.
//
// The total number of robots is at most 100, and the number of factories is at most 100.
// N, M <= 100.
// The DP state is O(N*M).
// The transition involves iterating over `k` (from 0 to i-1) and calculating the sum of distances.
// Calculating the sum of distances naively takes O(N).
// So, the total complexity would be O(N * M * N * N) which is too high.
//
// We can optimize the sum of distances.
// If we iterate over `k` from `i-1` down to `0` (such that `i-k <= limit[j]`), we can maintain the sum of distances incrementally.
//
// Let's define `dp[i][j]` as the minimum total distance to repair the first `i` robots considering the first `j` factories.
//
// Base case:
// dp[0][j] = 0 for all j (0 robots, 0 cost)
// dp[i][0] = infinity for i > 0 (cannot repair robots without factories)
//
// For i from 1 to N (number of robots):
//   For j from 1 to M (number of factories):
//     // Option 1: Don't use the j-th factory for the first i robots.
//     dp[i][j] = dp[i][j-1]
//
//     // Option 2: Use the j-th factory to repair some robots ending with the i-th robot.
//     // Let the j-th factory repair robots from index k+1 to i (1-based indexing for robots in DP).
//     // So, robots with original indices `robot_indices[k]` to `robot_indices[i-1]` are repaired by factory `j`.
//     // The number of robots repaired by factory `j` is `i - k`.
//     // This is possible only if `i - k <= factory_limits[j-1]` and `i - k > 0`.
//     // The previous state would be `dp[k][j-1]` (first `k` robots repaired by first `j-1` factories).
//
//     current_distance_sum = 0
//     for k from i-1 down to 0: // k represents the number of robots NOT repaired by factory j before robot i.
//       // Robots repaired by factory j are from index k+1 to i (1-based for DP states).
//       // Original indices: robot_indices[k] to robot_indices[i-1].
//       num_robots_by_factory_j = i - k
//
//       if (num_robots_by_factory_j > factory_limits[j-1]) {
//         break; // Factory j cannot repair this many robots.
//       }
//
//       // Add distance for robot at original index robot_indices[i-1] (which is robot_indices[i-1] in sorted array).
//       // The robot is at position robot_pos[i-1]. Factory is at factory_pos[j-1].
//       current_distance_sum += abs(factory_pos[j-1] - robot_pos[i-1])
//
//       // If k == 0, it means factory j repairs robots from 1 to i.
//       // The previous state is dp[0][j-1] which is 0.
//       // If k > 0, the previous state is dp[k][j-1].
//       // We need to use 0-based indexing for DP for easier implementation.
//       // dp[i][j] = min cost for first `i` robots using first `j` factories.
//       // robots: robot[0...N-1], factories: factory[0...M-1]
//       // dp[i][j] = min cost for robots[0...i-1] using factories[0...j-1].
//
//       // Let's use 0-based indexing for robots and factories in DP as well.
//       // dp[i][j] = min cost to repair robots[0...i-1] using factories[0...j-1].
//       // Base cases:
//       // dp[0][j] = 0 for all j = 0...M (0 robots, 0 cost)
//       // dp[i][0] = infinity for i = 1...N (cannot repair robots with no factories)
//
//       // For i from 1 to N:
//       //   For j from 1 to M:
//       //     // Option 1: Don't use factory j-1.
//       //     dp[i][j] = dp[i][j-1]
//
//       //     // Option 2: Use factory j-1 to repair a suffix of robots ending at i-1.
//       //     // Let factory j-1 repair robots[k...i-1]. Number of robots = i-k.
//       //     // The previous state is dp[k][j-1] (robots[0...k-1] repaired by factories[0...j-2]).
//       //     current_distance_sum = 0
//       //     for k from i-1 down to 0: // k is the start index of robots repaired by factory j-1.
//       //       // Robots repaired are robot[k...i-1]. Number of robots = i-k.
//       //       num_robots_by_current_factory = i - k
//       //
//       //       if (num_robots_by_current_factory > factory[j-1].limit) {
//       //         break; // Factory j-1 cannot repair this many robots.
//       //       }
//       //
//       //       // Add the distance for robot[i-1] (the current robot we are assigning to factory j-1).
//       //       current_distance_sum += abs(factory[j-1].pos - robot[i-1])
//       //
//       //       // Update dp[i][j]
//       //       // The previous state is dp[k][j-1] if k > 0. If k == 0, it means robots[0...i-1] are repaired by factory j-1. The cost is current_distance_sum.
//       //       // The cost for the previous state:
//       //       prev_cost = (k == 0) ? 0 : dp[k][j-1]
//       //       if (prev_cost != infinity) { // Check if the previous state was reachable
//       //         dp[i][j] = min(dp[i][j], prev_cost + current_distance_sum)
//       //       }
//
// The `current_distance_sum` is computed for robots from `k` to `i-1`. When we iterate `k` downwards, `i-1` is fixed, `i-2` is fixed, etc.
// So `current_distance_sum` should be the sum from `k` to `i-1`.
//
// Let's retry the loop for `k`.
// For i from 1 to N:
//   For j from 1 to M:
//     // Option 1: Don't use factory j-1.
//     dp[i][j] = dp[i][j-1]
//
//     // Option 2: Use factory j-1 to repair a suffix of robots ending at robot i-1.
//     // Let factory j-1 repair robots from index `k` to `i-1`.
//     // The number of robots repaired is `i - k`.
//     // The preceding state is `dp[k][j-1]` (robots[0...k-1] repaired by factories[0...j-2]).
//     long long current_segment_dist_sum = 0;
//     for (int k = i - 1; k >= 0; --k) { // k is the starting index of the segment of robots to be repaired by factory j-1.
//       int num_robots_in_segment = i - k;
//
//       if (num_robots_in_segment > factory[j-1].limit) {
//         break; // Factory j-1 cannot repair this many robots.
//       }
//
//       // Add the distance for robot[k] (the leftmost robot in the current segment being assigned to factory j-1).
//       current_segment_dist_sum += abs(factory[j-1].pos - robot[k]);
//
//       // The state for the first `k` robots using the first `j-1` factories.
//       long long prev_state_cost = (k == 0) ? 0 : dp[k][j-1];
//
//       if (prev_state_cost != LLONG_MAX) { // Check if the previous state was reachable.
//         dp[i][j] = min(dp[i][j], prev_state_cost + current_segment_dist_sum);
//       }
//     }
//
// This still has an issue: `current_segment_dist_sum` is accumulated for robots from `k` to `i-1`.
// When `k` decreases, we are adding a new robot to the LEFT of the segment.
// Example: robots[k+1..i-1] assigned to factory j-1, and now robots[k..i-1] are assigned.
// We add `abs(factory[j-1].pos - robot[k])`. This is correct.
//
// The DP state definition should be `dp[i][j]` = minimum cost to repair the first `i` robots using a SUBSET of the first `j` factories.
//
// This is where it gets tricky. The problem states that "all robots can be repaired".
//
// Let's refine the DP state and transition.
// Sort `robot` array: `r_1, r_2, ..., r_N`
// Sort `factory` array: `f_1, f_2, ..., f_M`
//
// `dp[i][j]` = minimum total distance to repair the first `i` robots (`robot[0]` to `robot[i-1]`)
//              using only the first `j` factories (`factory[0]` to `factory[j-1]`).
//
// Base cases:
// `dp[0][j] = 0` for all `j` from 0 to M. (0 robots, 0 cost)
// `dp[i][0] = infinity` for all `i` from 1 to N. (Cannot repair robots with 0 factories)
//
// For `i` from 1 to N (number of robots):
//   For `j` from 1 to M (number of factories):
//     // Option 1: Don't use the j-th factory for the first `i` robots.
//     // This means the first `i` robots are repaired using only the first `j-1` factories.
//     `dp[i][j] = dp[i][j-1]`
//
//     // Option 2: Use the j-th factory to repair a segment of robots ending at `robot[i-1]`.
//     // Let the j-th factory repair robots from index `k` to `i-1`.
//     // The number of robots repaired by this factory is `i - k`.
//     // This is valid only if `i - k <= factory[j-1].limit`.
//     // The cost for these robots is `sum(abs(factory[j-1].pos - robot[p]))` for `p` from `k` to `i-1`.
//     // The remaining robots `robot[0]` to `robot[k-1]` must be repaired by the first `j-1` factories.
//     // The cost for that is `dp[k][j-1]`.
//
//     `long long current_segment_cost_sum = 0;`
//     `for (int k = i - 1; k >= 0; --k) {` // `k` is the start index of the segment of robots `robot[k...i-1]`
//       `int num_robots_in_segment = i - k;`
//
//       // Check if the number of robots exceeds the factory's limit.
//       `if (num_robots_in_segment > factory[j-1].limit) {`
//         `break; // Factory j-1 cannot repair this many robots.`
//       `}`
//
//       // Add the distance for the robot at index `k` to the current segment's total cost.
//       // This loop adds the cost for robot[i-1], then robot[i-2], ..., robot[k].
//       // `current_segment_cost_sum` will accumulate `abs(factory[j-1].pos - robot[i-1]) + abs(factory[j-1].pos - robot[i-2]) + ... + abs(factory[j-1].pos - robot[k])`.
//       `current_segment_cost_sum += abs((long long)factory[j-1].pos - robot[k]);`
//
//       // Calculate the cost if the first `k` robots are repaired by the first `j-1` factories.
//       // If `k == 0`, it means the current factory `j-1` repairs all robots from `0` to `i-1`.
//       // The cost for `dp[0][j-1]` is 0.
//       `long long cost_of_previous_robots = (k == 0) ? 0 : dp[k][j-1];`
//
//       // If the previous state was reachable (not infinity).
//       `if (cost_of_previous_robots != LLONG_MAX) {`
//         `dp[i][j] = min(dp[i][j], cost_of_previous_robots + current_segment_cost_sum);`
//       `}`
//     `}`
//
// Final Answer: `dp[N][M]`
//
// Data types: Positions can be up to 10^9. Distances can be up to 2 * 10^9. Total distance can be N * 2 * 10^9.
// N <= 100. So total distance can be up to 100 * 2 * 10^9 = 2 * 10^11.
// We need `long long` for DP table and distance sums.
//
// Sorting: O(N log N + M log M)
// DP: O(N * M * N) where N is the number of robots. The inner loop for `k` runs up to `i` times.
// Total time complexity: O(N log N + M log M + N^2 * M)
// Space complexity: O(N * M) for the DP table.
// Given N, M <= 100, N^2 * M = 100^2 * 100 = 10^6, which is feasible.
//
// Let's check the loop for `k` again carefully.
// `dp[i][j]` represents min cost for robots `0` to `i-1` using factories `0` to `j-1`.
//
// When we consider using factory `j-1` for a segment `robot[k...i-1]`:
// The robots covered are `robot[k]`, `robot[k+1]`, ..., `robot[i-1]`.
// The number of robots in this segment is `i - k`.
// This must be <= `factory[j-1].limit`.
// The previous state is `dp[k][j-1]` which means robots `0` to `k-1` are covered by factories `0` to `j-2`.
// The cost for the current segment `robot[k...i-1]` using factory `j-1` is `sum_{p=k}^{i-1} abs(factory[j-1].pos - robot[p])`.
//
// The loop structure:
// `for i = 1 to N`
//   `for j = 1 to M`
//     `dp[i][j] = dp[i][j-1]` // Don't use factory j-1
//
//     `long long current_segment_dist_sum = 0;`
//     `for k = i - 1; k >= 0; --k` // `k` is the start index of the segment
//       `num_robots_in_segment = i - k`
//       `if num_robots_in_segment > factory[j-1].limit break`
//
//       `current_segment_dist_sum += abs(factory[j-1].pos - robot[k])`
//       // Now `current_segment_dist_sum` is the cost for robots `k, k+1, ..., i-1`.
//       // The previous state is `dp[k][j-1]` (robots `0` to `k-1` using factories `0` to `j-2`).
//       `prev_cost = (k == 0) ? 0 : dp[k][j-1]`
//       `if prev_cost != LLONG_MAX`
//         `dp[i][j] = min(dp[i][j], prev_cost + current_segment_dist_sum)`
//
// This seems correct.
//
// Example walkthrough:
// robot = [0,4,6], factory = [[2,2],[6,2]]
// Sorted robot: [0, 4, 6] (N=3)
// Sorted factory: [[2,2], [6,2]] (M=2)
//
// DP table: dp[4][3] initialized to LLONG_MAX. dp[0][j] = 0.
//
// i=1 (robot[0]=0)
//   j=1 (factory[0]=[2,2])
//     dp[1][1] = dp[1][0] = LLONG_MAX (initially)
//     k=0: num_robots=1. limit=2. OK.
//       current_segment_dist_sum = abs(2 - 0) = 2.
//       prev_cost = dp[0][0] = 0.
//       dp[1][1] = min(LLONG_MAX, 0 + 2) = 2.
//   j=2 (factory[1]=[6,2])
//     dp[1][2] = dp[1][1] = 2.
//     k=0: num_robots=1. limit=2. OK.
//       current_segment_dist_sum = abs(6 - 0) = 6.
//       prev_cost = dp[0][1] = 0.
//       dp[1][2] = min(2, 0 + 6) = 2.
//
// i=2 (robots[0]=0, robot[1]=4)
//   j=1 (factory[0]=[2,2])
//     dp[2][1] = dp[2][0] = LLONG_MAX.
//     k=1: segment [1..1] (robot[1]=4). num_robots=1. limit=2. OK.
//       current_segment_dist_sum = abs(2 - 4) = 2.
//       prev_cost = dp[1][0] = LLONG_MAX. Not reachable.
//     k=0: segment [0..1] (robots[0]=0, robot[1]=4). num_robots=2. limit=2. OK.
//       current_segment_dist_sum = abs(2 - 0) + abs(2 - 4) = 2 + 2 = 4.
//       prev_cost = dp[0][0] = 0.
//       dp[2][1] = min(LLONG_MAX, 0 + 4) = 4.
//   j=2 (factory[1]=[6,2])
//     dp[2][2] = dp[2][1] = 4.
//     k=1: segment [1..1] (robot[1]=4). num_robots=1. limit=2. OK.
//       current_segment_dist_sum = abs(6 - 4) = 2.
//       prev_cost = dp[1][1] = 2.
//       dp[2][2] = min(4, 2 + 2) = 4.
//     k=0: segment [0..1] (robots[0]=0, robot[1]=4). num_robots=2. limit=2. OK.
//       current_segment_dist_sum = abs(6 - 0) + abs(6 - 4) = 6 + 2 = 8.
//       prev_cost = dp[0][1] = 0.
//       dp[2][2] = min(4, 0 + 8) = 4.
//
// i=3 (robots[0]=0, robot[1]=4, robot[2]=6)
//   j=1 (factory[0]=[2,2])
//     dp[3][1] = dp[3][0] = LLONG_MAX.
//     k=2: segment [2..2] (robot[2]=6). num_robots=1. limit=2. OK.
//       current_segment_dist_sum = abs(2 - 6) = 4.
//       prev_cost = dp[2][0] = LLONG_MAX. Not reachable.
//     k=1: segment [1..2] (robots[1]=4, robot[2]=6). num_robots=2. limit=2. OK.
//       current_segment_dist_sum = abs(2 - 4) + abs(2 - 6) = 2 + 4 = 6.
//       prev_cost = dp[1][0] = LLONG_MAX. Not reachable.
//     k=0: segment [0..2] (robots[0]=0, robot[1]=4, robot[2]=6). num_robots=3. limit=2. NOT OK. Break.
//     dp[3][1] remains LLONG_MAX.
//
//   j=2 (factory[1]=[6,2])
//     dp[3][2] = dp[3][1] = LLONG_MAX.
//     k=2: segment [2..2] (robot[2]=6). num_robots=1. limit=2. OK.
//       current_segment_dist_sum = abs(6 - 6) = 0.
//       prev_cost = dp[2][1] = 4.
//       dp[3][2] = min(LLONG_MAX, 4 + 0) = 4.
//     k=1: segment [1..2] (robots[1]=4, robot[2]=6). num_robots=2. limit=2. OK.
//       current_segment_dist_sum = abs(6 - 4) + abs(6 - 6) = 2 + 0 = 2.
//       prev_cost = dp[1][1] = 2.
//       dp[3][2] = min(4, 2 + 2) = 4.
//     k=0: segment [0..2] (robots[0]=0, robot[1]=4, robot[2]=6). num_robots=3. limit=2. NOT OK. Break.
//
// Final answer: dp[3][2] = 4. Correct for Example 1.
//
// Need to use `std::vector<std::pair<int, int>> factory;` and `std::vector<int> robot;`.
// Sort robots. Sort factories.
// Initialize DP table with LLONG_MAX. Set dp[0][j] = 0.
//
// Constraints on positions: -10^9 to 10^9. Use `long long` for positions when calculating distance.
// The input `factory[j] = [positionj, limitj]` has `positionj` as int. It's better to use long long for factory positions in calculation.
// Or cast to long long before `abs`.
// The problem statement says `factory[j] = [positionj, limitj]`. Let's assume positionj can be large and use long long for them in calculation.
// `abs(factory[j-1].pos - robot[k])` where `robot[k]` is int and `factory[j-1].pos` is int.
// If they are `int`, `abs` returns `int`. The sum can overflow.
// We should cast to `long long` before `abs`.
// `abs((long long)factory[j-1].pos - robot[k])`
// Let's store factory positions as `long long` to be safe.
//
// The input `factory` is `vector<vector<int>>`. So `factory[j][0]` is position.
// `factory[j][1]` is limit.
//
// `std::vector<long long> robot_pos(robot.begin(), robot.end());`
// `std::sort(robot_pos.begin(), robot_pos.end());`
//
// `std::vector<std::pair<long long, int>> factory_data;`
// `for (const auto& f : factory) {`
//   `factory_data.push_back({(long long)f[0], f[1]});`
// `}`
// `std::sort(factory_data.begin(), factory_data.end());`
//
// Now `robot_pos` has sorted robot positions and `factory_data` has sorted factory `(pos, limit)` pairs.
//
// `N = robot_pos.size();`
// `M = factory_data.size();`
//
// `std::vector<std::vector<long long>> dp(N + 1, std::vector<long long>(M + 1, LLONG_MAX));`
//
// `for (int j = 0; j <= M; ++j) {`
//   `dp[0][j] = 0;`
// `}`
//
// ... DP loops ...
//
// `return dp[N][M];`

// Final check on time complexity.
// Sorting: O(N log N + M log M)
// DP:
// Outer loops: N * M
// Inner loop for `k`: runs up to N times.
// Inside inner loop: constant time operations.
// Total DP complexity: O(N * M * N)
// Total: O(N log N + M log M + N^2 * M)
// With N, M <= 100, N^2 * M <= 100^3 = 1,000,000. This is fine.

// Space complexity: O(N * M) for DP table.

// Edge cases:
// - All robots at the same position (problem states unique positions for robots).
// - All factories at the same position (problem states unique positions for factories).
// - Limit is 0 for some factories.
// - Limit is large enough for all robots.
// - All robots can be repaired (guaranteed by problem).

// Use `climits` for `LLONG_MAX`.
// Include `<vector>`, `<algorithm>`, `<cmath>`, `<climits>`.
// Using `std::abs` on `long long` is fine.
// The problem states `factory[j] = [positionj, limitj]` and `positionj` is `int`.
// Let's stick to the input types and cast to `long long` during calculation of distances.
// `int pos_j = factory[j-1][0];`
// `int limit_j = factory[j-1][1];`
// `long long dist = std::abs((long long)pos_j - robot_pos[k]);`

// Let's refine `robot` and `factory` storage.
// `std::vector<int> robots_input = robot;`
// `std::sort(robots_input.begin(), robots_input.end());`
//
// `std::vector<std::pair<int, int>> factories_input;`
// `for (const auto& f : factory) {`
//   `factories_input.push_back({f[0], f[1]});`
// `}`
// `std::sort(factories_input.begin(), factories_input.end());`
//
// N = robots_input.size();
// M = factories_input.size();
//
// `vector<vector<long long>> dp(N + 1, vector<long long>(M + 1, LLONG_MAX));`
//
// `for (int j = 0; j <= M; ++j) dp[0][j] = 0;`
//
// `for (int i = 1; i <= N; ++i) {`
//   `for (int j = 1; j <= M; ++j) {`
//     `dp[i][j] = dp[i][j-1]; // Option 1: Don't use factory j-1`
//
//     `long long current_segment_dist_sum = 0;`
//     `int current_factory_pos = factories_input[j-1].first;`
//     `int current_factory_limit = factories_input[j-1].second;`
//
//     `for (int k = i - 1; k >= 0; --k) { // k is the start index of the segment of robots robot[k...i-1]`
//       `int num_robots_in_segment = i - k;`
//
//       `if (num_robots_in_segment > current_factory_limit) {`
//         `break;`
//       `}`
//
//       // Add distance for robot[k]
//       `current_segment_dist_sum += std::abs((long long)current_factory_pos - robots_input[k]);`
//
//       `long long cost_of_previous_robots = (k == 0) ? 0 : dp[k][j-1];`
//
//       `if (cost_of_previous_robots != LLONG_MAX) {`
//         `dp[i][j] = std::min(dp[i][j], cost_of_previous_robots + current_segment_dist_sum);`
//       `}`
//     `}`
//   `}`
// `}`
// `return dp[N][M];`
//
// This looks solid.
//


class Solution {
public:
    long long minTotalDistance(std::vector<int>& robot, std::vector<std::vector<int>>& factory) {
        // Sort robot positions.
        std::sort(robot.begin(), robot.end());
        int n = robot.size();

        // Store factory positions and limits, and sort them by position.
        std::vector<std::pair<int, int>> factories;
        for (const auto& f : factory) {
            factories.push_back({f[0], f[1]});
        }
        std::sort(factories.begin(), factories.end());
        int m = factories.size();

        // dp[i][j] will store the minimum total distance to repair the first 'i' robots
        // using only the first 'j' factories.
        // We use N+1 rows and M+1 columns for easier 1-based indexing in DP.
        // Initialize with LLONG_MAX, representing unreachable states.
        std::vector<std::vector<long long>> dp(n + 1, std::vector<long long>(m + 1, LLONG_MAX));

        // Base case: 0 robots require 0 distance, regardless of the number of factories used.
        for (int j = 0; j <= m; ++j) {
            dp[0][j] = 0;
        }

        // Iterate through each robot (from 1 to N)
        for (int i = 1; i <= n; ++i) {
            // Iterate through each factory (from 1 to M)
            for (int j = 1; j <= m; ++j) {
                // Option 1: The i-th robot is NOT repaired by the j-th factory.
                // In this case, the minimum cost is the same as repairing the first 'i' robots
                // using only the first 'j-1' factories.
                dp[i][j] = dp[i][j - 1];

                // Option 2: The j-th factory (factories[j-1]) is used to repair a segment of robots
                // ending with the i-th robot (robot[i-1] in 0-based indexing).
                long long current_segment_dist_sum = 0;
                int current_factory_pos = factories[j - 1].first;
                int current_factory_limit = factories[j - 1].second;

                // Iterate backward from the i-th robot to determine the start of the segment
                // that the current factory will repair.
                // 'k' represents the number of robots *before* the current segment that were
                // already repaired by previous factories.
                // So, the current factory repairs robots from index k to i-1 (in 0-based robot array).
                for (int k = i - 1; k >= 0; --k) {
                    // Number of robots in the current segment being repaired by factory 'j-1'.
                    int num_robots_in_segment = i - k;

                    // If the number of robots in the segment exceeds the factory's limit,
                    // this segment cannot be repaired by this factory. Break and try a shorter segment
                    // or a different factory.
                    if (num_robots_in_segment > current_factory_limit) {
                        break;
                    }

                    // Add the distance for the current robot (robot[k]) to the segment's total distance sum.
                    // We use `long long` for position and distance calculation to avoid overflow.
                    current_segment_dist_sum += std::abs((long long)current_factory_pos - robot[k]);

                    // The cost for the robots preceding this segment (i.e., the first 'k' robots)
                    // repaired by the first 'j-1' factories.
                    // If k is 0, it means the current factory is repairing robots from index 0 to i-1.
                    // In this case, the cost of previous robots is 0 (dp[0][j-1]).
                    long long cost_of_previous_robots = (k == 0) ? 0 : dp[k][j - 1];

                    // If the state for previous robots is reachable (not LLONG_MAX),
                    // update the minimum cost for repairing the first 'i' robots using the first 'j' factories.
                    if (cost_of_previous_robots != LLONG_MAX) {
                        dp[i][j] = std::min(dp[i][j], cost_of_previous_robots + current_segment_dist_sum);
                    }
                }
            }
        }

        // The final answer is the minimum total distance to repair all 'n' robots using all 'm' factories.
        return dp[n][m];
    }
};
```