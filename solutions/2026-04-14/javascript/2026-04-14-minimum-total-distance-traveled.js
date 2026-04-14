```javascript
/**
 * @param {number[]} robot
 * @param {number[][]} factory
 * @return {number}
 */

/*
Problem Summary:
Minimize the total distance traveled by robots to reach factories for repair, given factory capacity limits.

Link: https://leetcode.com/problems/minimum-total-distance-traveled/

Approach:
This problem can be solved using dynamic programming. The key insight is that once we sort both the robots and factories, we can make decisions about assigning robots to factories in a greedy manner. However, the limits on factories make a purely greedy approach insufficient.

We can define a DP state `dp[i][j]` representing the minimum total distance traveled by the first `i` robots to reach some of the first `j` factories, respecting their limits.

Let's sort the robots by their positions and the factories by their positions.
`robots = [r1, r2, ..., rn]` where r1 <= r2 <= ... <= rn
`factories = [(f1_pos, f1_limit), (f2_pos, f2_limit), ..., (fm_pos, fm_limit)]` where f1_pos <= f2_pos <= ... <= fm_pos

The DP state `dp[i][j]` will represent the minimum distance to repair the first `i` robots using only the first `j` factories.

The transitions for `dp[i][j]` would be:
1. The j-th factory is NOT used to repair any of the first `i` robots. In this case, `dp[i][j] = dp[i][j-1]`.
2. The j-th factory IS used to repair some robots. Suppose the j-th factory repairs `k` robots from the first `i` robots. These `k` robots must be the last `k` robots in the sorted `robot` array (i.e., `robots[i-k], ..., robots[i-1]`). This is because if a robot `r_a` is repaired by factory `f_j` and a robot `r_b` with `r_b > r_a` is repaired by factory `f_p` where `p < j`, this is suboptimal. A robot at a larger position is better off going to a factory at a larger position.
   If factory `j` repairs `k` robots (where `1 <= k <= factory[j-1][1]` and `k <= i`), these robots will be `robots[i-k]` through `robots[i-1]`. The minimum distance for these `k` robots to be repaired by factory `j` (at `factories[j-1][0]`) needs to be calculated. This would be the sum of `abs(robots[p] - factories[j-1][0])` for `p` from `i-k` to `i-1`.
   The transition would then be `dp[i][j] = min(dp[i][j-1], dp[i-k][j-1] + cost_of_repairing_k_robots_by_factory_j)`.

The base cases would be:
- `dp[0][j] = 0` for all `j`: No robots, no distance.
- `dp[i][0] = infinity` for `i > 0`: No factories, cannot repair robots.

The cost calculation for repairing `k` robots by factory `j` can be optimized. If factory `j` repairs robots `robots[a]` through `robots[b]`, the cost is `sum(abs(robots[p] - factory_pos))` for `p` from `a` to `b`. This sum can be computed efficiently.

A more refined DP state might be `dp[i][j]` = minimum distance to repair the first `i` robots using the first `j` factories.

Let's reconsider the DP state and transitions.
It seems more intuitive to think about the number of robots processed and the number of factories considered.

Let `dp[i][j]` be the minimum total distance to repair the first `i` robots using the first `j` factories.

To compute `dp[i][j]`:
1. We don't use factory `j`. Then `dp[i][j] = dp[i][j-1]`.
2. We use factory `j`. Suppose factory `j` repairs `k` robots, which must be the last `k` robots among the first `i` robots considered (i.e., robots `i-k` to `i-1`). These `k` robots must be assigned to factory `j`. The previous `i-k` robots must have been repaired by the first `j-1` factories.
   The cost of repairing robots `i-k` to `i-1` by factory `j` can be calculated.
   So, `dp[i][j] = min(dp[i][j-1], dp[i-k][j-1] + cost_of_k_robots_by_factory_j)`.

The challenge is that `cost_of_k_robots_by_factory_j` can be computed efficiently if we know the range of robots.
If factory `j` (at `factories[j-1][0]` with limit `factories[j-1][1]`) repairs robots from index `start_robot_idx` to `end_robot_idx` (inclusive, 0-indexed robots), the cost is `sum(abs(robots[p] - factories[j-1][0]))` for `p` from `start_robot_idx` to `end_robot_idx`.

Let's simplify the DP state for clarity.
Let `dp[i][j]` be the minimum distance to repair the first `i` robots using the first `j` factories.
When considering `dp[i][j]`:
- Option 1: Factory `j` is not used. The cost is `dp[i][j-1]`.
- Option 2: Factory `j` is used. Suppose it repairs `k` robots. These `k` robots must be the robots `i-k, i-k+1, ..., i-1` (using 1-based indexing for robots for now, `robots[i-k]` to `robots[i-1]` in 0-indexed terms).
  The number of robots to repair by factory `j` must be between 1 and `min(i, factories[j-1][1])`.
  For each possible `k` (number of robots factory `j` repairs):
    The previous `i-k` robots must be repaired by the first `j-1` factories. The cost is `dp[i-k][j-1]`.
    The current `k` robots (`robots[i-k]` to `robots[i-1]`) are repaired by factory `j`. The cost is `sum(|robots[p] - factories[j-1][0]|)` for `p` from `i-k` to `i-1`.

To make this efficient, we can precompute prefix sums of distances.
Let `cost[p][k]` be the minimum cost to repair the `k` robots from `robots[p-k]` to `robots[p-1]` by `factories[j-1]`.
This precomputation would be for each factory `j` and each possible number of robots `k`.

Let's refine the DP state:
`dp[i][j]` = min distance to repair the first `i` robots using the first `j` factories.

`dp[i][j] = min(`
  `dp[i][j-1],` // Factory `j` is not used for any of the first `i` robots.
  `min(dp[i-k][j-1] + cost_to_repair(robots[i-k...i-1], factory_j))` for `1 <= k <= min(i, factory_limit_j)`
`)`

We need to sort `robot` array and `factory` array (by position).
Let `n` be the number of robots, `m` be the number of factories.
`robots` sorted: `r_1, r_2, ..., r_n`
`factories` sorted: `(f_1_pos, f_1_limit), (f_2_pos, f_2_limit), ..., (f_m_pos, f_m_limit)`

Let `dp[i][j]` be the min distance to repair the first `i` robots using the first `j` factories.
`dp` table size: `(n+1) x (m+1)`

Initialization:
`dp[0][j] = 0` for `0 <= j <= m`
`dp[i][0] = Infinity` for `1 <= i <= n`

Iterate `i` from 1 to `n` (robots)
  Iterate `j` from 1 to `m` (factories)
    // Option 1: Factory `j` is not used for the first `i` robots.
    `dp[i][j] = dp[i][j-1]`

    // Option 2: Factory `j` is used. It repairs `k` robots from the first `i`.
    // These `k` robots must be `robots[i-k]` to `robots[i-1]` (0-indexed).
    // The number of robots `k` can range from 1 to `min(i, factories[j-1][1])`.
    `factory_pos = factories[j-1][0]`
    `factory_limit = factories[j-1][1]`
    `current_factory_repair_cost = 0`
    `robot_start_idx = i - 1` // The last robot we consider for factory j

    For `k` from 1 to `min(i, factory_limit)`:
      // Add the current robot `robots[robot_start_idx]` to the group being repaired by factory `j`.
      `current_factory_repair_cost += abs(robots[robot_start_idx] - factory_pos)`

      // The remaining `i-k` robots must be repaired by the first `j-1` factories.
      // The total cost would be `dp[i-k][j-1] + current_factory_repair_cost`.
      `dp[i][j] = min(dp[i][j], dp[i-k][j-1] + current_factory_repair_cost)`

      // Move to the next robot to the left if we consider one more robot for factory `j`.
      `robot_start_idx--`

The final answer will be `dp[n][m]`.

The time complexity of this DP approach:
Sorting robots: O(N log N)
Sorting factories: O(M log M)
DP table filling: O(N * M * min(N, limit)) where limit is the max factory limit. In worst case, this can be O(N * M * N) if limits are large. This is too slow if N and M are up to 100. O(100 * 100 * 100) = 10^6 operations per DP cell calculation * 10^4 cells = 10^10, too high.

We need to optimize the calculation of `cost_to_repair(robots[i-k...i-1], factory_j)`.

Let `current_cost_for_factory_j` be the cost to repair robots from index `i-k` to `i-1` by factory `j`.
When `k` increases by 1, we are considering one more robot to the left.
So, when we iterate `k` from 1 to `min(i, factory_limit)`, we can maintain `current_factory_repair_cost` incrementally.

Revised DP loop:
Iterate `i` from 1 to `n` (robots)
  Iterate `j` from 1 to `m` (factories)
    `dp[i][j] = dp[i][j-1]` // Factory j not used

    `factory_pos = factories[j-1][0]`
    `factory_limit = factories[j-1][1]`
    `current_factory_repair_cost = 0`

    // Iterate `k` from 1 up to `min(i, factory_limit)`
    // This `k` represents the number of robots factory `j` is repairing,
    // which are robots `robots[i-k]` through `robots[i-1]`.
    for `k` from 1 to `min(i, factory_limit)`:
      // The robot being added to factory `j`'s repair list is `robots[i-k]`
      `current_factory_repair_cost += abs(robots[i-k] - factory_pos)`
      // The previous `i-k` robots are repaired by the first `j-1` factories.
      `dp[i][j] = min(dp[i][j], dp[i-k][j-1] + current_factory_repair_cost)`

This still results in O(N * M * min(N, L)) where L is max limit.

Consider the state space and transitions carefully.
The number of robots `i` goes up to 100.
The number of factories `j` goes up to 100.
The limit of a factory can be up to 100.

The complexity is O(N * M * N). This is approximately 100 * 100 * 100 = 10^6 operations for the DP part.
Total complexity: O(N log N + M log M + N * M * N).
This might be acceptable for N, M <= 100.
N=100, M=100. Sorting: 100 log 100 is small. DP: 100 * 100 * 100 = 1,000,000. This is fine.

Let's check the constraints again.
1 <= robot.length, factory.length <= 100
-10^9 <= robot[i], positionj <= 10^9

The coordinates can be large, so we need 64-bit integers for sums if languages don't handle it automatically. JavaScript numbers are 64-bit floats, but for integer arithmetic up to 2^53 they are safe. The total distance could exceed 2^53. So we need to be careful or use BigInt if necessary. The problem statement implies the total distance fits in a standard integer type if calculated correctly. Given the limits, total distance could be up to 100 * 2 * 10^9 = 2 * 10^11, which fits in BigInt.

Let's use BigInt for sums to be safe.

Example 1 walkthrough:
robot = [0, 4, 6], factory = [[2, 2], [6, 2]]
Sorted robots: [0, 4, 6] (n=3)
Sorted factories: [(2, 2), (6, 2)] (m=2)

dp table (4x3):
dp[0][0] = 0, dp[0][1] = 0, dp[0][2] = 0
dp[1][0] = inf, dp[2][0] = inf, dp[3][0] = inf

i = 1 (robot 0)
  j = 1 (factory [2, 2])
    dp[1][1] = dp[1][0] = inf
    k = 1: robot 0 (idx 0) -> factory at 2. Cost = |0-2| = 2.
      dp[1][1] = min(inf, dp[0][0] + 2) = 2.
  j = 2 (factory [6, 2])
    dp[1][2] = dp[1][1] = 2
    k = 1: robot 0 (idx 0) -> factory at 6. Cost = |0-6| = 6.
      dp[1][2] = min(2, dp[0][1] + 6) = min(2, 0 + 6) = 2.

i = 2 (robots 0, 4)
  j = 1 (factory [2, 2])
    dp[2][1] = dp[2][0] = inf
    k = 1: robot 1 (idx 1, pos 4) -> factory at 2. Cost = |4-2| = 2.
      dp[2][1] = min(inf, dp[1][0] + 2) = inf (dp[1][0] is inf)
    k = 2: robots 0, 1 (idx 0, 1, pos 0, 4) -> factory at 2. Limit is 2.
      Robot 0 (idx 0): cost |0-2|=2.
      Robot 1 (idx 1): cost |4-2|=2.
      Total cost for k=2: 2 + 2 = 4.
      dp[2][1] = min(inf, dp[0][0] + 4) = 4.

  j = 2 (factory [6, 2])
    dp[2][2] = dp[2][1] = 4
    k = 1: robot 1 (idx 1, pos 4) -> factory at 6. Cost = |4-6| = 2.
      dp[2][2] = min(4, dp[1][1] + 2) = min(4, 2 + 2) = 4.
    k = 2: robots 0, 1 (idx 0, 1, pos 0, 4) -> factory at 6. Limit is 2.
      Robot 0 (idx 0): cost |0-6|=6.
      Robot 1 (idx 1): cost |4-6|=2.
      Total cost for k=2: 6 + 2 = 8.
      dp[2][2] = min(4, dp[0][1] + 8) = min(4, 0 + 8) = 4.

i = 3 (robots 0, 4, 6)
  j = 1 (factory [2, 2])
    dp[3][1] = dp[3][0] = inf
    k = 1: robot 2 (idx 2, pos 6) -> factory at 2. Cost = |6-2| = 4.
      dp[3][1] = min(inf, dp[2][0] + 4) = inf
    k = 2: robots 1, 2 (idx 1, 2, pos 4, 6) -> factory at 2. Limit is 2.
      Robot 1 (idx 1): cost |4-2|=2.
      Robot 2 (idx 2): cost |6-2|=4.
      Total cost for k=2: 2 + 4 = 6.
      dp[3][1] = min(inf, dp[1][0] + 6) = inf.

  j = 2 (factory [6, 2])
    dp[3][2] = dp[3][1] = inf (this should be dp[3][1] which is inf but should be calculated from dp[3][1] which is dp[3][j-1])
    Let's reset the trace for dp[3][2] using correct logic:
    dp[3][2] = dp[3][1] (value from previous factory column) = inf (if dp[3][1] was correctly inf, or some computed value if not)
    We need to compute dp[3][1] correctly first.

Let's re-trace step by step.
dp table initialized with Infinity, dp[0][*] = 0.

robots = [0, 4, 6], n = 3
factories = [[2, 2], [6, 2]], m = 2

dp (4x3)
     j=0    j=1(f1:[2,2]) j=2(f2:[6,2])
i=0:   0       0              0
i=1:  inf    ?              ?
i=2:  inf    ?              ?
i=3:  inf    ?              ?

i = 1 (robot 0)
  j = 1 (factory [2, 2])
    dp[1][1] = dp[1][0] = inf
    k = 1 (robots[0..0], i.e., robot 0):
      cost_k1 = abs(robots[0] - 2) = |0-2| = 2
      dp[1][1] = min(inf, dp[0][0] + cost_k1) = min(inf, 0 + 2) = 2

  j = 2 (factory [6, 2])
    dp[1][2] = dp[1][1] = 2
    k = 1 (robots[0..0], i.e., robot 0):
      cost_k1 = abs(robots[0] - 6) = |0-6| = 6
      dp[1][2] = min(2, dp[0][1] + cost_k1) = min(2, 0 + 6) = 2

dp state after i=1:
     j=0    j=1(f1:[2,2]) j=2(f2:[6,2])
i=0:   0       0              0
i=1:  inf      2              2
i=2:  inf      ?              ?
i=3:  inf      ?              ?

i = 2 (robots 0, 4)
  j = 1 (factory [2, 2])
    dp[2][1] = dp[2][0] = inf
    k = 1 (robots[1..1], i.e., robot 1 at pos 4):
      cost_k1 = abs(robots[1] - 2) = |4-2| = 2
      dp[2][1] = min(inf, dp[1][0] + cost_k1) = min(inf, inf + 2) = inf
    k = 2 (robots[0..1], i.e., robots 0, 1 at pos 0, 4). Limit is 2, so k=2 is allowed.
      cost_k2 = abs(robots[0] - 2) + abs(robots[1] - 2) = |0-2| + |4-2| = 2 + 2 = 4
      dp[2][1] = min(inf, dp[0][0] + cost_k2) = min(inf, 0 + 4) = 4

  j = 2 (factory [6, 2])
    dp[2][2] = dp[2][1] = 4
    k = 1 (robots[1..1], i.e., robot 1 at pos 4):
      cost_k1 = abs(robots[1] - 6) = |4-6| = 2
      dp[2][2] = min(4, dp[1][1] + cost_k1) = min(4, 2 + 2) = 4
    k = 2 (robots[0..1], i.e., robots 0, 1 at pos 0, 4). Limit is 2.
      cost_k2 = abs(robots[0] - 6) + abs(robots[1] - 6) = |0-6| + |4-6| = 6 + 2 = 8
      dp[2][2] = min(4, dp[0][1] + cost_k2) = min(4, 0 + 8) = 4

dp state after i=2:
     j=0    j=1(f1:[2,2]) j=2(f2:[6,2])
i=0:   0       0              0
i=1:  inf      2              2
i=2:  inf      4              4
i=3:  inf      ?              ?

i = 3 (robots 0, 4, 6)
  j = 1 (factory [2, 2])
    dp[3][1] = dp[3][0] = inf
    k = 1 (robots[2..2], i.e., robot 2 at pos 6):
      cost_k1 = abs(robots[2] - 2) = |6-2| = 4
      dp[3][1] = min(inf, dp[2][0] + cost_k1) = min(inf, inf + 4) = inf
    k = 2 (robots[1..2], i.e., robots 1, 2 at pos 4, 6). Limit is 2.
      cost_k2 = abs(robots[1] - 2) + abs(robots[2] - 2) = |4-2| + |6-2| = 2 + 4 = 6
      dp[3][1] = min(inf, dp[1][0] + cost_k2) = min(inf, inf + 6) = inf

  j = 2 (factory [6, 2])
    dp[3][2] = dp[3][1] = inf
    k = 1 (robots[2..2], i.e., robot 2 at pos 6):
      cost_k1 = abs(robots[2] - 6) = |6-6| = 0
      dp[3][2] = min(inf, dp[2][1] + cost_k1) = min(inf, 4 + 0) = 4

    k = 2 (robots[1..2], i.e., robots 1, 2 at pos 4, 6). Limit is 2.
      cost_k2 = abs(robots[1] - 6) + abs(robots[2] - 6) = |4-6| + |6-6| = 2 + 0 = 2
      dp[3][2] = min(4, dp[1][1] + cost_k2) = min(4, 2 + 2) = 4

dp state after i=3:
     j=0    j=1(f1:[2,2]) j=2(f2:[6,2])
i=0:   0       0              0
i=1:  inf      2              2
i=2:  inf      4              4
i=3:  inf      inf            4

Final answer: dp[3][2] = 4. Correct for Example 1.

The DP formulation seems correct. Let's consider BigInt.
JavaScript `Number` type is 64-bit floating point, safe for integers up to `Number.MAX_SAFE_INTEGER` (2^53 - 1).
The maximum distance for a single robot is approximately 2 * 10^9.
The maximum number of robots is 100.
The maximum total distance could be around 100 * 2 * 10^9 = 2 * 10^11.
This fits within a BigInt.
`Number.MAX_SAFE_INTEGER` is about 9 * 10^15. So, intermediate sums might fit into `Number` if we are careful. However, `dp[i-k][j-1]` can also be large.
It's safer to use `BigInt` for all distance calculations and DP table values.

Implementation details:
- Sort robots.
- Sort factories by position.
- Initialize DP table with a large BigInt value for infinity.
- Use BigInt for all calculations involving distances and DP values.

`const INF = BigInt(Infinity)` // Not a real BigInt. Use a sufficiently large value.
e.g., `const INF = BigInt(Number.MAX_SAFE_INTEGER)` or even larger if needed.
A safe upper bound for total distance: 100 robots * (2 * 10^9 distance per robot) = 2 * 10^11.
So, `INF = 10n ** 18n` would be safe.

The indices in the DP transition:
`dp[i-k][j-1]` means the first `i-k` robots are repaired by the first `j-1` factories.
The `k` robots are `robots[i-k]` to `robots[i-1]` (0-indexed).
When calculating `dp[i][j]`, we are considering the first `i` robots.
If factory `j` repairs `k` robots, these are the last `k` robots in the set of first `i` robots.
So, robots are indexed `0` to `i-1`.
If factory `j` repairs `k` robots, these are `robots[i-k], robots[i-k+1], ..., robots[i-1]`.
The previous `i-k` robots are `robots[0], ..., robots[i-k-1]`. These are the first `i-k` robots.
The DP state definition `dp[i][j]` is "minimum distance to repair the first `i` robots using the first `j` factories".
So, `dp[i-k][j-1]` is indeed the correct previous state.

Let's refine the loop for `k`:
For `k` from 1 to `min(i, factory_limit)`:
  `robot_idx_to_add = i - k` // The robot at index `i-k` in the sorted `robots` array
  `current_factory_repair_cost += abs(robots[robot_idx_to_add] - factory_pos)`
  `dp[i][j] = min(dp[i][j], dp[i-k][j-1] + current_factory_repair_cost)`

This looks correct.

Final check on Time and Space Complexity:
Time:
Sorting robots: O(N log N)
Sorting factories: O(M log M)
DP table filling:
Outer loops for `i` (N times) and `j` (M times).
Inner loop for `k` runs up to `min(i, limit)`, which is at most `N` (since `limit <= N` and `i <= N`).
Total DP time: O(N * M * N)
Overall Time Complexity: O(N log N + M log M + N^2 * M)

Space:
DP table: O(N * M)
Auxiliary space for sorting: O(log N) or O(N) depending on implementation.
Overall Space Complexity: O(N * M)

Given N, M <= 100:
N^2 * M = 100^2 * 100 = 1,000,000 operations. This is well within typical time limits.
N * M = 100 * 100 = 10,000 for DP table. This is also fine.

Consider the constraints and potential edge cases:
- `robot.length` or `factory.length` could be 1.
- `limitj` can be 0. If `limitj` is 0, that factory cannot repair any robots. Our `min(i, factory_limit)` will handle this correctly, as `k` will never be >= 1 if `factory_limit` is 0.
- Robots and factories can share the same position. This is handled by `abs(robot_pos - factory_pos)`.
- All robots can be repaired: guaranteed by problem statement.

The use of BigInt should prevent overflow.
`BigInt(num)` converts a number to BigInt.
`a + b`, `a - b`, `a * b`, `a / b` work for BigInt.
Comparisons (`<`, `>`, `<=`, `>=`) also work.

```javascript
/**
 * @param {number[]} robot
 * @param {number[][]} factory
 * @return {bigint}
 */

/*
Problem Summary:
Minimize the total distance traveled by robots to reach factories for repair, given factory capacity limits.

Link: https://leetcode.com/problems/minimum-total-distance-traveled/

Approach:
This problem can be solved using dynamic programming.
First, we sort the robot positions and factory positions to establish an order.
Let `n` be the number of robots and `m` be the number of factories.
We define `dp[i][j]` as the minimum total distance traveled to repair the first `i` robots using only the first `j` factories.

The robots are sorted as `robots[0], robots[1], ..., robots[n-1]`.
The factories are sorted by position as `factories[0], factories[1], ..., factories[m-1]`, where `factories[j] = [positionj, limitj]`.

The DP transition for `dp[i][j]` has two main possibilities:
1. The `j`-th factory is NOT used to repair any of the first `i` robots. In this case, the minimum distance is the same as using the first `j-1` factories for the first `i` robots: `dp[i][j] = dp[i][j-1]`.

2. The `j`-th factory IS used to repair some robots. Suppose the `j`-th factory repairs `k` robots. Due to the sorted nature of robots and factories, these `k` robots must be the last `k` robots among the first `i` robots being considered (i.e., `robots[i-k]` through `robots[i-1]`). The remaining `i-k` robots must have been repaired by the first `j-1` factories. The number of robots `k` that factory `j` can repair ranges from 1 up to `min(i, factories[j-1][1])` (the factory's limit and the number of available robots).
   For each possible `k`, the cost is `dp[i-k][j-1]` (cost for previous robots) plus the cost of repairing `robots[i-k]` through `robots[i-1]` by `factories[j-1]`.
   The cost of repairing `k` robots by factory `j` can be calculated incrementally as we increase `k`.

The base cases are:
- `dp[0][j] = 0` for all `j` (0 robots, 0 distance).
- `dp[i][0] = Infinity` for `i > 0` (robots exist but no factories to repair them).

We use `BigInt` for all distance calculations and DP table values to avoid potential integer overflow, as the total distance can be large.

Time Complexity:
- Sorting robots: O(N log N), where N is the number of robots.
- Sorting factories: O(M log M), where M is the number of factories.
- DP table filling: The outer loops iterate `i` from 1 to N and `j` from 1 to M. The inner loop for `k` iterates up to `min(i, limit)`, which is at most N. The calculation of `current_factory_repair_cost` is O(1) incrementally.
  Thus, the DP part is O(N * M * N).
- Overall Time Complexity: O(N log N + M log M + N^2 * M). Given N, M <= 100, this is efficient enough.

Space Complexity:
- DP table: O(N * M) to store the intermediate results.
- Sorting might use O(log N) or O(N) auxiliary space.
- Overall Space Complexity: O(N * M).
*/

function minTotalDistance(robot, factory) {
    // Sort robots by position
    robot.sort((a, b) => a - b);
    // Sort factories by position
    factory.sort((a, b) => a[0] - b[0]);

    const n = robot.length;
    const m = factory.length;

    // Use a sufficiently large BigInt for infinity.
    // Max possible total distance ~ 100 robots * 2 * 10^9 = 2 * 10^11.
    // 10^18 is a safe upper bound.
    const INF = 10n ** 18n;

    // dp[i][j] will store the minimum distance to repair the first i robots
    // using the first j factories.
    // We use 1-based indexing for robots (1 to n) and factories (1 to m) in DP state.
    // dp table size: (n+1) x (m+1)
    const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(INF));

    // Base case: 0 robots require 0 distance, regardless of factories.
    for (let j = 0; j <= m; j++) {
        dp[0][j] = 0n;
    }

    // Fill the DP table
    for (let i = 1; i <= n; i++) { // Iterate through robots (first i robots)
        for (let j = 1; j <= m; j++) { // Iterate through factories (first j factories)

            // Option 1: The j-th factory is not used for the first i robots.
            // The cost is inherited from using the first j-1 factories for the first i robots.
            dp[i][j] = dp[i][j - 1];

            // Option 2: The j-th factory IS used to repair some robots.
            // Suppose factory j repairs k robots. These must be robots[i-k]...robots[i-1].
            const factoryPos = BigInt(factory[j - 1][0]);
            const factoryLimit = factory[j - 1][1];

            let currentFactoryRepairCost = 0n; // Cost for the current group of k robots by factory j

            // Iterate through possible number of robots 'k' that factory j can repair.
            // k ranges from 1 up to min(i, factoryLimit).
            // The robots being repaired are robots[i-k] through robots[i-1].
            for (let k = 1; k <= Math.min(i, factoryLimit); k++) {
                // The robot being added to factory j's repair list is robots[i-k].
                // Note: robot array is 0-indexed, so we access robot[i-k].
                const robotPos = BigInt(robot[i - k]);
                currentFactoryRepairCost += abs(robotPos - factoryPos);

                // If factory j repairs k robots (robots[i-k]...robots[i-1]),
                // the previous i-k robots must be repaired by the first j-1 factories.
                // The total cost is dp[i-k][j-1] + currentFactoryRepairCost.
                dp[i][j] = min(dp[i][j], dp[i - k][j - 1] + currentFactoryRepairCost);
            }
        }
    }

    // The minimum total distance to repair all n robots using all m factories.
    return dp[n][m];
}

// Helper function for absolute value of BigInt
function abs(x) {
    return x < 0n ? -x : x;
}

// Helper function for minimum of two BigInts
function min(a, b) {
    return a < b ? a : b;
}
```