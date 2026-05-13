/**
 * @param {number[]} nums
 * @param {number} limit
 * @return {number}
 */
// Problem: Minimum Moves to Make Array Complementary
// Link: https://leetcode.com/problems/minimum-moves-to-make-array-complementary/
//
// Approach:
// The problem asks for the minimum moves to make an array complementary, meaning nums[i] + nums[n-1-i] is constant for all i.
// We can iterate through the first half of the array (from i = 0 to n/2 - 1). For each pair (nums[i], nums[n-1-i]),
// let their sum be 's'. We want to change these numbers such that their new sum is a constant 'target'.
//
// The possible values for the sum of a pair (nums[i], nums[n-1-i]) after modification are limited.
// The minimum possible sum is 1 + 1 = 2.
// The maximum possible sum is limit + limit = 2 * limit.
// So, the target sum must be between 2 and 2 * limit.
//
// For each pair (nums[i], nums[n-1-i]), let a = nums[i] and b = nums[n-1-i]. Their current sum is s = a + b.
// We want to change them to a' and b' such that a' + b' = target, and 1 <= a', b' <= limit.
// The number of moves required for this pair to reach the target sum depends on the target value:
//
// 1. If we change only one element:
//    - If we change a to a' such that a' + b = target, then a' = target - b. We need 1 <= target - b <= limit.
//      This implies target - limit <= b <= target - 1.
//    - If we change b to b' such that a + b' = target, then b' = target - a. We need 1 <= target - a <= limit.
//      This implies target - limit <= a <= target - 1.
//    So, if either a or b falls within the range [target - limit, target - 1], we can achieve the target sum with 1 move.
//
// 2. If we change both elements:
//    - If neither a nor b allows reaching the target with one move, we need two moves.
//    - For example, if target - b < 1 or target - b > limit, and target - a < 1 or target - a > limit.
//
// Let's reframe the number of moves for a given pair (a, b) and a target sum:
// The sum of the pair is s = a + b.
// We want to reach a target sum 'k'.
//
// - Moves = 0: If a + b = k. (This is the ideal case).
//
// - Moves = 1:
//   - We can change 'a' to 'a'' such that a' + b = k. This requires a' = k - b.
//     This is possible if 1 <= k - b <= limit.
//     This means k - limit <= b <= k - 1.
//   - We can change 'b' to 'b'' such that a + b' = k. This requires b' = k - a.
//     This is possible if 1 <= k - a <= limit.
//     This means k - limit <= a <= k - 1.
//   So, if `min(a, b) + 1 <= k <= max(a, b) + limit`, one move is sufficient.
//   Equivalently, if `k` is in the range `[min(a, b) + 1, max(a, b) + limit]`, one move is enough.
//   Consider the range of possible sums for a pair `(x, y)` where `1 <= x, y <= limit`.
//   The sum `x + y` can range from `2` to `2 * limit`.
//   For a given pair `(a, b)`, their sum `s = a + b`.
//   If we want to achieve a target sum `k`:
//   - If `a` is changed to `a'`, `a' + b = k` => `a' = k - b`. We need `1 <= k - b <= limit`, so `k - limit <= b <= k - 1`.
//   - If `b` is changed to `b'`, `a + b' = k` => `b' = k - a`. We need `1 <= k - a <= limit`, so `k - limit <= a <= k - 1`.
//   So, if `k` is in the range `[b + 1, b + limit]` or `[a + 1, a + limit]`, one move is sufficient.
//   This means if `k` is in the range `[min(a, b) + 1, max(a, b) + limit]`.
//   The condition `min(a, b) + 1 <= k` is equivalent to `k - b >= 1` or `k - a >= 1`.
//   The condition `k <= max(a, b) + limit` is equivalent to `k - b <= limit` or `k - a <= limit`.
//   This can be simplified. The minimum possible sum of a pair is `1 + 1 = 2`. The maximum is `limit + limit = 2 * limit`.
//   For a pair `(a, b)`, their sum `s = a + b`.
//   We are looking for a target sum `k`.
//   - If `a` is changed to `a'`, we need `1 <= a' <= limit`. So `1 <= k - b <= limit`, which implies `k - limit <= b <= k - 1`.
//   - If `b` is changed to `b'`, we need `1 <= b' <= limit`. So `1 <= k - a <= limit`, which implies `k - limit <= a <= k - 1`.
//   So, if `k` is in the range `[b + 1, b + limit]` or `[a + 1, a + limit]`, one move is sufficient.
//   This simplifies to:
//   If `k` is in the range `[min(a, b) + 1, max(a, b) + limit]`.
//   No, this is not quite right. Let's consider the target sum `k`.
//   For a pair `(a, b)` with sum `s = a + b`, how many moves to reach `k`?
//   - If `s == k`: 0 moves.
//   - If we can make one change:
//     - Change `a` to `a'` such that `a' + b = k`. Requires `a' = k - b`.
//       We need `1 <= a' <= limit`, so `1 <= k - b <= limit`.
//       This implies `k - limit <= b <= k - 1`.
//     - Change `b` to `b'` such that `a + b' = k`. Requires `b' = k - a`.
//       We need `1 <= b' <= limit`, so `1 <= k - a <= limit`.
//       This implies `k - limit <= a <= k - 1`.
//     So, if `k - limit <= a <= k - 1` OR `k - limit <= b <= k - 1`, one move suffices.
//     This is equivalent to saying that `k` is in the range `[a + 1, a + limit]` OR `k` is in the range `[b + 1, b + limit]`.
//     Combining these, if `k` is in the range `[min(a, b) + 1, max(a, b) + limit]`, then one move is sufficient.
//     This can also be written as: `k >= min(a, b) + 1` AND `k <= max(a, b) + limit`.
//     Let `m = min(a, b)` and `M = max(a, b)`.
//     One move is sufficient if `k >= m + 1` AND `k <= M + limit`.
//     This means the target sum `k` must be achievable by changing one of the numbers.
//     The smallest possible sum achievable with one move is `min(a, b) + 1`. (Change the smaller to 1).
//     The largest possible sum achievable with one move is `max(a, b) + limit`. (Change the larger to limit).
//     So if `k` is in `[min(a, b) + 1, max(a, b) + limit]`, one move is enough.
//
//   - If two moves are needed:
//     This happens when `k` is NOT in the ranges that require 0 or 1 move.
//     The "critical" values for the target sum `k` for a pair `(a, b)` are:
//     - `a + b`: If target = `a + b`, 0 moves.
//     - `min(a, b) + 1`: Minimum possible sum achievable by changing one element.
//     - `max(a, b) + limit`: Maximum possible sum achievable by changing one element.
//
//     Let's use a difference array or a frequency map approach.
//     For each pair `(nums[i], nums[n - 1 - i])`, let `a = nums[i]` and `b = nums[n - 1 - i]`.
//     Let `m = min(a, b)` and `M = max(a, b)`.
//     The possible sums range from `2` to `2 * limit`.
//     For a pair `(a, b)` and a target sum `k`:
//     - If `k == a + b`: 0 moves.
//     - If `k` is such that `1 <= k - b <= limit` OR `1 <= k - a <= limit`: 1 move.
//       This means `k - limit <= b <= k - 1` OR `k - limit <= a <= k - 1`.
//       Equivalently, `a + 1 <= k <= a + limit` OR `b + 1 <= k <= b + limit`.
//       This means `k` is in the range `[m + 1, M + limit]`.
//     - Otherwise, 2 moves are needed. This happens if `k < m + 1` or `k > M + limit`.
//
//     Consider the "cost" of each target sum `k`.
//     For each pair `(a, b)`:
//     - If `k == a + b`, cost = 0.
//     - If `k` is in `[m + 1, M + limit]`, cost = 1.
//     - Otherwise, cost = 2.
//
//     We want to find the `k` that minimizes the total cost.
//     Instead of iterating through all possible `k`, let's think about how each pair contributes to the total cost for each `k`.
//     Let `diff` be a frequency array where `diff[x]` stores the change in the number of moves if the target sum `k` increases by 1.
//     The range of possible sums is `[2, 2 * limit]`. Let's use an array of size `2 * limit + 2` to handle indices.
//     `diff[x]` will represent the net number of pairs that *transition* from requiring `y` moves to `y-1` moves when the target sum crosses a boundary.
//
//     For each pair `(a, b)` with `m = min(a, b)` and `M = max(a, b)`:
//     - If the target sum `k` is `a + b`, cost is 0.
//     - If `k` is in the range `[m + 1, M + limit]`, cost is 1.
//     - Otherwise, cost is 2.
//
//     Let's analyze the number of pairs that need *more than* 1 move for a target sum `k`.
//     A pair `(a, b)` needs 2 moves if `k < m + 1` or `k > M + limit`.
//
//     Consider a target sum `k`.
//     Number of moves = `(Number of pairs requiring 2 moves) * 2 + (Number of pairs requiring 1 move) * 1`.
//     Total number of pairs is `n / 2`.
//     Number of pairs requiring 0 moves = `count_where_sum_is_k`.
//     Number of pairs requiring 1 move = `count_where_k_in_[m+1, M+limit]`.
//     Number of pairs requiring 2 moves = `count_where_k_in_[2, m]` or `k_in_[M+limit+1, 2*limit]`.
//
//     This can be modeled as follows:
//     For each pair `(a, b)` with `m = min(a, b)` and `M = max(a, b)`:
//     - The target sum `k = a + b` requires 0 moves for this pair.
//     - The target sum `k` in `[m + 1, M + limit]` requires 1 move.
//     - All other target sums `k` require 2 moves.
//
//     Let's maintain a frequency map (or array) for the number of moves required for each possible target sum.
//     The possible target sums are `2` to `2 * limit`.
//
//     Initialize an array `moves_count` of size `2 * limit + 1` to zeros.
//     For each pair `(a, b)` where `a = nums[i]` and `b = nums[n-1-i]`:
//     Let `m = min(a, b)` and `M = max(a, b)`.
//
//     - Target sum `k = a + b`: requires 0 moves. This means for any other target sum, we *add* 1 move if `k` is not `a+b`.
//       This is not quite right. We need to find *one* target sum that minimizes total moves.
//
//     Let's use the difference array approach on the costs.
//     The possible target sums are `k` from `2` to `2 * limit`.
//     For each pair `(a, b)` with `m = min(a, b)` and `M = max(a, b)`:
//     - The range `[m + 1, M + limit]` requires 1 move.
//     - All other sums require 2 moves, except `a + b` which requires 0.
//
//     Let's use a `delta` array of size `2 * limit + 2`.
//     `delta[x]` will store the *change* in the number of moves when the target sum `k` increases from `x-1` to `x`.
//
//     For a pair `(a, b)` with `m = min(a, b)` and `M = max(a, b)`:
//     - All sums `k` in `[2, m]` require 2 moves.
//     - Sum `m + 1` requires 1 move.
//     - Sums `k` in `[m + 2, M + limit - 1]` require 1 move.
//     - Sum `M + limit` requires 1 move.
//     - Sum `M + limit + 1` requires 2 moves.
//     - Sum `a + b` requires 0 moves.
//
//     This is still complex. A simpler perspective:
//     For each pair `(a, b)`, we want to find a `target` sum.
//     The minimum sum is 2, maximum is `2 * limit`.
//
//     Let `diff` be an array of size `2 * limit + 2`.
//     `diff[x]` will represent the number of pairs for which `x` is an invalid sum or an increase in moves.
//
//     For each pair `(a, b)` with `m = min(a, b)` and `M = max(a, b)`:
//     - The target sum `k = a + b` needs 0 moves for this pair.
//     - Target sums `k` in `[m + 1, M + limit]` need 1 move.
//     - Target sums `k` such that `k < m + 1` OR `k > M + limit` need 2 moves.
//
//     Consider the cost:
//     If we pick a target sum `k`:
//     Cost = `(Number of pairs where k < m + 1 or k > M + limit) * 2`
//          + `(Number of pairs where m + 1 <= k <= M + limit and k != a + b) * 1`
//          + `(Number of pairs where k == a + b) * 0`
//
//     Let's focus on how many pairs *do not* meet a certain condition.
//     For a pair `(a, b)` with `m = min(a, b)` and `M = max(a, b)`:
//     1. If target `k = a + b`, cost = 0.
//     2. If `m + 1 <= k <= M + limit`, cost = 1.
//     3. Otherwise, cost = 2.
//
//     Consider the total number of pairs: `N = n / 2`.
//     The total moves can be expressed as:
//     `Total Moves = 2 * N - (Number of pairs with cost 1) * 1 - (Number of pairs with cost 0) * 2`.
//     We want to maximize `(Number of pairs with cost 1) * 1 + (Number of pairs with cost 0) * 2`.
//
//     Let's use a difference array `delta` of size `2 * limit + 2`.
//     `delta[x]` will represent the net change in the number of moves when the target sum `k` transitions from `x-1` to `x`.
//
//     For each pair `(a, b)` with `m = min(a, b)` and `M = max(a, b)`:
//     - Sum range that requires 1 move: `[m + 1, M + limit]`.
//     - Sum range that requires 2 moves: `[2, m]` and `[M + limit + 1, 2 * limit]`.
//     - Sum `a + b` requires 0 moves.
//
//     Let's increment the number of pairs that require 2 moves.
//     For each pair `(a, b)`:
//     - For `k` in `[2, m]`: These sums are "bad" (cost 2).
//     - For `k` in `[M + limit + 1, 2 * limit]`: These sums are "bad" (cost 2).
//     - For `k` in `[m + 1, M + limit]`: These sums are "better" (cost 1).
//     - For `k = a + b`: This sum is "best" (cost 0).
//
//     Consider the number of "violations" where the sum is not `a+b`.
//     If we choose a target sum `k`:
//     A pair `(a, b)` contributes to the cost.
//     If `a + b != k`, we need at least one move.
//     If `k < m + 1` or `k > M + limit`, we need 2 moves.
//
//     Let's use the difference array to count how many pairs *avoid* a certain cost.
//     The total number of pairs is `n / 2`.
//     Let `max_pairs_benefiting` be the maximum of `(count of pairs with cost 1) * 1 + (count of pairs with cost 0) * 2` over all possible target sums.
//     The minimum moves will be `(n / 2) * 2 - max_pairs_benefiting`.
//
//     For each pair `(a, b)` with `m = min(a, b)` and `M = max(a, b)`:
//     - The range `[m + 1, M + limit]` offers a "discount" of 1 move compared to the default of 2 moves.
//       So, for `k` in `[m + 1, M + limit]`, we gain 1 move towards our objective.
//       This means for `k` from `m + 1` to `M + limit`, we add 1 to a counter.
//       `delta[m + 1] += 1`
//       `delta[M + limit + 1] -= 1`
//
//     - The sum `a + b` offers an *additional* discount of 1 move (total discount of 2 moves compared to the default of 2).
//       So, for `k = a + b`, we gain an *extra* 1 move.
//       This means we add 1 to the benefit for `k = a + b`.
//       `delta[a + b] += 1`
//       `delta[a + b + 1] -= 1`
//
//     Initialize `delta` array of size `2 * limit + 2` to zeros.
//     `n = nums.length`
//     `pairs_count = n / 2`
//
//     For `i` from `0` to `pairs_count - 1`:
//       `a = nums[i]`
//       `b = nums[n - 1 - i]`
//       `m = min(a, b)`
//       `M = max(a, b)`
//
//       // Range [m + 1, M + limit] gives a benefit of 1 move (reduction from 2 to 1)
//       `delta[m + 1] += 1`
//       `delta[M + limit + 1] -= 1`
//
//       // The exact sum a + b gives an additional benefit of 1 move (reduction from 1 to 0)
//       `delta[a + b] += 1`
//       `delta[a + b + 1] -= 1`
//
//     After processing all pairs, compute prefix sums of `delta` to get the cumulative benefit for each target sum.
//     `current_benefit = 0`
//     `max_benefit = 0`
//
//     For `k` from `2` to `2 * limit`:
//       `current_benefit += delta[k]`
//       `max_benefit = max(max_benefit, current_benefit)`
//
//     The minimum number of moves is `pairs_count * 2 - max_benefit`.
//
//     Example walkthrough: nums = [1,2,4,3], limit = 4
//     n = 4, pairs_count = 2
//     limit = 4, 2*limit = 8. delta array size = 10 (indices 0 to 9).
//
//     Pair 1: (nums[0], nums[3]) = (1, 3)
//       a = 1, b = 3
//       m = 1, M = 3
//       Range for 1 move: [m + 1, M + limit] = [1 + 1, 3 + 4] = [2, 7]
//       Exact sum: a + b = 4
//
//       delta[m + 1] += 1  => delta[2] += 1
//       delta[M + limit + 1] -= 1 => delta[3 + 4 + 1] = delta[8] -= 1
//
//       delta[a + b] += 1 => delta[4] += 1
//       delta[a + b + 1] -= 1 => delta[5] -= 1
//
//     Pair 2: (nums[1], nums[2]) = (2, 4)
//       a = 2, b = 4
//       m = 2, M = 4
//       Range for 1 move: [m + 1, M + limit] = [2 + 1, 4 + 4] = [3, 8]
//       Exact sum: a + b = 6
//
//       delta[m + 1] += 1  => delta[3] += 1
//       delta[M + limit + 1] -= 1 => delta[4 + 4 + 1] = delta[9] -= 1
//
//       delta[a + b] += 1 => delta[6] += 1
//       delta[a + b + 1] -= 1 => delta[7] -= 1
//
//     Initial delta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//     After Pair 1:
//       delta[2] = 1
//       delta[8] = -1
//       delta[4] = 1
//       delta[5] = -1
//     delta: [0, 0, 1, 0, 1, -1, 0, 0, -1, 0]
//
//     After Pair 2:
//       delta[3] = 1
//       delta[9] = -1
//       delta[6] = 1
//       delta[7] = -1
//     delta: [0, 0, 1, 1, 1, -1, 1, -1, -1, -1] (Indices 0-9)
//
//     Calculate prefix sums and find max benefit (from k=2 to 2*limit=8):
//     k=2: current_benefit = delta[2] = 1. max_benefit = 1. (Benefit for sum 2)
//     k=3: current_benefit = 1 + delta[3] = 1 + 1 = 2. max_benefit = 2. (Benefit for sum 3)
//     k=4: current_benefit = 2 + delta[4] = 2 + 1 = 3. max_benefit = 3. (Benefit for sum 4)
//     k=5: current_benefit = 3 + delta[5] = 3 - 1 = 2. max_benefit = 3. (Benefit for sum 5)
//     k=6: current_benefit = 2 + delta[6] = 2 + 1 = 3. max_benefit = 3. (Benefit for sum 6)
//     k=7: current_benefit = 3 + delta[7] = 3 - 1 = 2. max_benefit = 3. (Benefit for sum 7)
//     k=8: current_benefit = 2 + delta[8] = 2 - 1 = 1. max_benefit = 3. (Benefit for sum 8)
//
//     Max benefit found = 3.
//     Total pairs = 2. Max possible moves = 2 * 2 = 4.
//     Minimum moves = 4 - 3 = 1.
//     This matches Example 1.
//
//     Example 2: nums = [1,2,2,1], limit = 2
//     n = 4, pairs_count = 2
//     limit = 2, 2*limit = 4. delta array size = 6 (indices 0 to 5).
//
//     Pair 1: (nums[0], nums[3]) = (1, 1)
//       a = 1, b = 1
//       m = 1, M = 1
//       Range for 1 move: [m + 1, M + limit] = [1 + 1, 1 + 2] = [2, 3]
//       Exact sum: a + b = 2
//
//       delta[m + 1] += 1 => delta[2] += 1
//       delta[M + limit + 1] -= 1 => delta[1 + 2 + 1] = delta[4] -= 1
//       delta[a + b] += 1 => delta[2] += 1
//       delta[a + b + 1] -= 1 => delta[3] -= 1
//
//     Pair 2: (nums[1], nums[2]) = (2, 2)
//       a = 2, b = 2
//       m = 2, M = 2
//       Range for 1 move: [m + 1, M + limit] = [2 + 1, 2 + 2] = [3, 4]
//       Exact sum: a + b = 4
//
//       delta[m + 1] += 1 => delta[3] += 1
//       delta[M + limit + 1] -= 1 => delta[2 + 2 + 1] = delta[5] -= 1
//       delta[a + b] += 1 => delta[4] += 1
//       delta[a + b + 1] -= 1 => delta[5] -= 1
//
//     Initial delta: [0, 0, 0, 0, 0, 0]
//     After Pair 1:
//       delta[2] += 1 (becomes 1)
//       delta[4] -= 1 (becomes -1)
//       delta[2] += 1 (becomes 2)
//       delta[3] -= 1 (becomes -1)
//     delta: [0, 0, 2, -1, -1, 0]
//
//     After Pair 2:
//       delta[3] += 1 (becomes 0)
//       delta[5] -= 1 (becomes -1)
//       delta[4] += 1 (becomes 0)
//       delta[5] -= 1 (becomes -2)
//     delta: [0, 0, 2, 0, 0, -2]
//
//     Calculate prefix sums and find max benefit (from k=2 to 2*limit=4):
//     k=2: current_benefit = delta[2] = 2. max_benefit = 2. (Benefit for sum 2)
//     k=3: current_benefit = 2 + delta[3] = 2 + 0 = 2. max_benefit = 2. (Benefit for sum 3)
//     k=4: current_benefit = 2 + delta[4] = 2 + 0 = 2. max_benefit = 2. (Benefit for sum 4)
//
//     Max benefit found = 2.
//     Total pairs = 2. Max possible moves = 2 * 2 = 4.
//     Minimum moves = 4 - 2 = 2.
//     This matches Example 2.
//
//     Example 3: nums = [1,2,1,2], limit = 2
//     n = 4, pairs_count = 2
//     limit = 2, 2*limit = 4. delta array size = 6.
//
//     Pair 1: (nums[0], nums[3]) = (1, 2)
//       a = 1, b = 2
//       m = 1, M = 2
//       Range for 1 move: [m + 1, M + limit] = [1 + 1, 2 + 2] = [2, 4]
//       Exact sum: a + b = 3
//
//       delta[m + 1] += 1 => delta[2] += 1
//       delta[M + limit + 1] -= 1 => delta[2 + 2 + 1] = delta[5] -= 1
//       delta[a + b] += 1 => delta[3] += 1
//       delta[a + b + 1] -= 1 => delta[4] -= 1
//
//     Pair 2: (nums[1], nums[2]) = (2, 1)
//       a = 2, b = 1
//       m = 1, M = 2
//       Range for 1 move: [m + 1, M + limit] = [1 + 1, 2 + 2] = [2, 4]
//       Exact sum: a + b = 3
//
//       delta[m + 1] += 1 => delta[2] += 1
//       delta[M + limit + 1] -= 1 => delta[2 + 2 + 1] = delta[5] -= 1
//       delta[a + b] += 1 => delta[3] += 1
//       delta[a + b + 1] -= 1 => delta[4] -= 1
//
//     Initial delta: [0, 0, 0, 0, 0, 0]
//     After Pair 1:
//       delta[2] = 1
//       delta[5] = -1
//       delta[3] = 1
//       delta[4] = -1
//     delta: [0, 0, 1, 1, -1, -1]
//
//     After Pair 2:
//       delta[2] += 1 (becomes 2)
//       delta[5] -= 1 (becomes -2)
//       delta[3] += 1 (becomes 2)
//       delta[4] -= 1 (becomes -2)
//     delta: [0, 0, 2, 2, -2, -2]
//
//     Calculate prefix sums and find max benefit (from k=2 to 2*limit=4):
//     k=2: current_benefit = delta[2] = 2. max_benefit = 2. (Benefit for sum 2)
//     k=3: current_benefit = 2 + delta[3] = 2 + 2 = 4. max_benefit = 4. (Benefit for sum 3)
//     k=4: current_benefit = 4 + delta[4] = 4 - 2 = 2. max_benefit = 4. (Benefit for sum 4)
//
//     Max benefit found = 4.
//     Total pairs = 2. Max possible moves = 2 * 2 = 4.
//     Minimum moves = 4 - 4 = 0.
//     This matches Example 3.
//
//     The logic seems sound.
//     The maximum value of limit is 10^5, so 2 * limit can be 2 * 10^5.
//     The size of the delta array will be around 2 * 10^5 + 2, which is manageable.
//     The time complexity will be O(N) for iterating through pairs and O(limit) for prefix sums, so O(N + limit).
//     Since N can be up to 10^5 and limit up to 10^5, this is efficient enough.
//
// Time Complexity:
// - Iterating through the first half of `nums` to populate the `delta` array takes O(N/2) which is O(N) time, where N is the length of `nums`.
// - Computing the prefix sums of the `delta` array takes O(2 * limit) which is O(limit) time.
// - Therefore, the total time complexity is O(N + limit).
//
// Space Complexity:
// - The `delta` array has a size of `2 * limit + 2`.
// - Therefore, the space complexity is O(limit).
//
// Important considerations for indices:
// - The target sum `k` can range from 2 to `2 * limit`.
// - The `delta` array needs to accommodate indices up to `2 * limit + 1` (for `delta[M + limit + 1]` and `delta[a + b + 1]`).
// - So, `delta` array of size `2 * limit + 2` is correct.
// - When calculating prefix sums, we iterate `k` from 2 up to `2 * limit`.
//
// Let's recheck the bounds and indices for the delta array.
// Smallest possible value for `m + 1` is `1 + 1 = 2`.
// Largest possible value for `M + limit + 1` is `limit + limit + 1 = 2 * limit + 1`.
// Smallest possible value for `a + b` is `1 + 1 = 2`.
// Largest possible value for `a + b + 1` is `limit + limit + 1 = 2 * limit + 1`.
// So, indices used are from 2 up to `2 * limit + 1`.
// The `delta` array needs to be indexed up to `2 * limit + 1`.
// Thus, a size of `2 * limit + 2` (for indices 0 to `2 * limit + 1`) is appropriate.
// When calculating prefix sums, we iterate `k` from 2 to `2 * limit`.
// The `current_benefit` at index `k` represents the benefit for target sum `k`.
//
// The calculation `max_benefit = max(max_benefit, current_benefit)` should happen for each `k` in the range of possible target sums.
// The minimum target sum is 2. The maximum target sum is `2 * limit`.
// So, the loop for prefix sums should be `for (let k = 2; k <= 2 * limit; k++)`.
//
// `delta[idx] += value` updates the value at `idx`.
// `current_benefit += delta[k]` accumulates changes.
// `max_benefit = max(max_benefit, current_benefit)` finds the peak.
//
// The final calculation is `pairs_count * 2 - max_benefit`.
// This works because the default cost for any pair is 2 moves.
// `max_benefit` represents the maximum reduction in moves we can achieve across all possible target sums.
// For a given target sum `k`, `current_benefit` tells us how many pairs contribute a reduction in moves.
// - A pair contributes 1 to `current_benefit` if `k` is in `[m + 1, M + limit]` (reduces cost from 2 to 1).
// - A pair contributes an *additional* 1 to `current_benefit` if `k == a + b` (reduces cost from 1 to 0).
// So `current_benefit` at `k` is effectively:
// `(Number of pairs where k is in [m + 1, M + limit]) + (Number of pairs where k == a + b)`
// This is precisely the number of pairs that require *less than 2 moves* for target sum `k`.
// Let `num_less_than_2_moves(k)` be this count.
// The number of pairs requiring 2 moves is `pairs_count - num_less_than_2_moves(k)`.
// Total moves for target sum `k` = `(pairs_count - num_less_than_2_moves(k)) * 2 + (num_less_than_2_moves(k)) * (average_moves_for_less_than_2)`. This is too complicated.
//
// Alternative formulation:
// Total moves = `Sum over all pairs (moves_for_pair_i_with_target_k)`.
// `moves_for_pair_i(k)`:
//   - 0 if `k == a_i + b_i`
//   - 1 if `m_i + 1 <= k <= M_i + limit` AND `k != a_i + b_i`
//   - 2 otherwise.
//
// Let's consider the number of pairs that require *exactly* 2 moves.
// A pair `(a, b)` needs 2 moves if `k < m + 1` OR `k > M + limit`.
// Let's count how many pairs *do not* satisfy `m + 1 <= k <= M + limit`.
// For each pair `(a, b)` with `m = min(a, b), M = max(a, b)`:
// The range of sums `[m + 1, M + limit]` is "good" (cost 1).
// Sums outside this range are "bad" (cost 2), except `a + b` which is "best" (cost 0).
//
// `delta[x]` = change in the number of pairs that need 2 moves when target sum `k` goes from `x-1` to `x`.
//
// For a pair `(a, b)` with `m = min(a, b), M = max(a, b)`:
// - Sums `k` in `[2, m]` require 2 moves.
// - Sum `m + 1` requires 1 move.
// - Sums `k` in `[m + 2, M + limit]` require 1 move.
// - Sum `M + limit + 1` requires 2 moves.
// - Sums `k` in `[M + limit + 2, 2*limit]` require 2 moves.
// - Sum `a + b` requires 0 moves.
//
// The number of moves for a target `k` is:
// `Sum over all pairs (moves_for_pair_i(k))`
// `moves_for_pair_i(k)` is 0, 1, or 2.
//
// Let's simplify. The maximum number of moves is `2 * pairs_count`.
// We want to minimize moves, which means maximizing the "savings".
//
// Savings for a pair `(a, b)` with target `k`:
// - If `k = a + b`: Savings = 2 (from default 2 to 0).
// - If `m + 1 <= k <= M + limit` and `k != a + b`: Savings = 1 (from default 2 to 1).
// - Otherwise: Savings = 0.
//
// Let `savings_delta` array of size `2 * limit + 2`.
// For each pair `(a, b)` with `m = min(a, b), M = max(a, b)`:
//
// 1. The range `[m + 1, M + limit]` gives a saving of 1.
//    This range contributes +1 to the savings for each `k` within it.
//    `savings_delta[m + 1] += 1`
//    `savings_delta[M + limit + 1] -= 1`
//
// 2. The exact sum `a + b` gives an *additional* saving of 1.
//    This means for `k = a + b`, the total saving is 1 (from range) + 1 (exact sum) = 2.
//    So, `a + b` contributes an extra +1 saving compared to other sums in the range `[m + 1, M + limit]`.
//    `savings_delta[a + b] += 1`
//    `savings_delta[a + b + 1] -= 1`
//
// This formulation seems correct.
// The maximum value of `current_savings` computed from prefix sums of `savings_delta` will represent the maximum possible total savings over all target sums.
// `max_savings = max(current_savings)`
// `minimum_moves = (pairs_count * 2) - max_savings`.
//
// The logic is:
// - Each pair initially costs 2 moves (worst case). Total initial cost = `pairs_count * 2`.
// - For a chosen target sum `k`:
//   - If `k` is in `[m + 1, M + limit]`, we reduce the cost by 1. This pair contributes 1 to savings.
//   - If `k` is exactly `a + b`, we reduce the cost by another 1 (total reduction of 2). This pair contributes an extra 1 to savings.
//
// The `delta` array in my implementation `delta[idx] += 1` and `delta[idx+1] -= 1` is for computing range updates.
// So the total number of pairs `k` where `m+1 <= k <= M+limit` is captured by the prefix sum.
// And the `delta[a+b] += 1`, `delta[a+b+1] -= 1` is for the specific value `a+b`.
// This correctly models the problem.
//
// Max limit is 10^5, N is 10^5.
// Array size `2 * limit + 2` is about 200002. Fine.
// Time O(N + limit). Space O(limit).
//
// The range of `nums[i]` is `1 <= nums[i] <= limit`.
// The range of `limit` is `1 <= limit <= 10^5`.
// The range of `n` is `2 <= n <= 10^5` and `n` is even.
//
// The loop for prefix sums should go from the minimum possible sum to the maximum possible sum.
// Minimum sum is `1 + 1 = 2`.
// Maximum sum is `limit + limit = 2 * limit`.
// So the loop `for (let k = 2; k <= 2 * limit; k++)` is correct.
//
// Let's consider edge cases.
// - `limit = 1`: `nums` can only contain 1s. If `nums = [1, 1, 1, 1]`, `limit = 1`.
//   `n=4`, `pairs_count=2`.
//   Pair 1: (1, 1). `m=1, M=1`. Range `[2, 1+1] = [2, 2]`. Exact sum = 2.
//     `delta[2] += 1`
//     `delta[4] -= 1` (M+limit+1 = 1+1+1 = 3 => delta[3] -= 1. Wait, M+limit+1 = 1+1+1 = 3. So delta[3] -= 1.)
//     `delta[2] += 1`
//     `delta[3] -= 1`
//   Pair 2: (1, 1). `m=1, M=1`. Range `[2, 2]`. Exact sum = 2.
//     `delta[2] += 1`
//     `delta[3] -= 1`
//     `delta[2] += 1`
//     `delta[3] -= 1`
//   Delta: `delta[2] = 4`, `delta[3] = -4`. (Indices 0..5, for limit=1, 2*limit=2)
//   Loop k from 2 to 2:
//   k=2: current_benefit = delta[2] = 4. max_benefit = 4.
//   Min moves = 2 * 2 - 4 = 0. Correct.
//
// - All elements are the same: `nums = [3,3,3,3]`, `limit = 3`.
//   `n=4`, `pairs_count=2`.
//   Pair 1: (3,3). `m=3, M=3`. Range `[4, 3+3] = [4, 6]`. Exact sum = 6.
//     `delta[4] += 1`
//     `delta[7] -= 1` (M+limit+1 = 3+3+1 = 7)
//     `delta[6] += 1`
//     `delta[7] -= 1`
//   Pair 2: (3,3). `m=3, M=3`. Range `[4, 6]`. Exact sum = 6.
//     `delta[4] += 1`
//     `delta[7] -= 1`
//     `delta[6] += 1`
//     `delta[7] -= 1`
//   Delta (size 2*3+2 = 8): `delta[4]=2`, `delta[7]=-2`, `delta[6]=2`, `delta[7]=-2`.
//   `delta[4]=2`, `delta[6]=2`, `delta[7]=-4`.
//   Loop k from 2 to 6.
//   k=2: cb=0, mb=0
//   k=3: cb=0, mb=0
//   k=4: cb=delta[4]=2, mb=2
//   k=5: cb=2+delta[5]=2, mb=2
//   k=6: cb=2+delta[6]=2+2=4, mb=4
//   Max benefit = 4.
//   Min moves = 2*2 - 4 = 0. Correct.
//
// The indices for delta array and loop bounds seem correct.

 */
const minimumMoves = (nums, limit) => {
    // n is the length of the input array. It's guaranteed to be even.
    const n = nums.length;
    // The number of pairs we need to consider.
    const pairsCount = n / 2;
    // The maximum possible sum for a pair is limit + limit.
    const maxSum = 2 * limit;

    // `delta` array is used for difference array technique.
    // `delta[k]` will store the change in the number of pairs that benefit from
    // a target sum of `k` compared to `k-1`.
    // The range of possible target sums is [2, maxSum].
    // We need indices up to `maxSum + 1` for range updates `M + limit + 1` and `a + b + 1`.
    // So, array size is `maxSum + 2`.
    const delta = new Array(maxSum + 2).fill(0);

    // Iterate through the first half of the array, considering pairs (nums[i], nums[n-1-i]).
    for (let i = 0; i < pairsCount; i++) {
        const a = nums[i];
        const b = nums[n - 1 - i];

        // m is the minimum of the pair, M is the maximum.
        const m = Math.min(a, b);
        const M = Math.max(a, b);

        // --- Calculate the "benefit" for each pair for different target sums ---
        // Default cost for any pair is 2 moves (changing both elements).
        // We want to find the target sum that maximizes the total "savings" (reductions in moves).
        //
        // A target sum `k` yields savings based on how close it is to achieving the desired sum.
        //
        // 1. Range `[m + 1, M + limit]` gives a saving of 1 move.
        //    This is because if `k` is in this range, we can achieve sum `k` by changing only one element.
        //    For example, if we want target `k`, and `k = b + x` where `1 <= x <= limit`,
        //    we can change `a` to `x`. This requires 1 move instead of 2.
        //    So, for every `k` in `[m + 1, M + limit]`, the total moves reduce by 1.
        //    We use `delta[m + 1] += 1` to mark the start of this range for increased savings.
        //    We use `delta[M + limit + 1] -= 1` to mark the end of this range (exclusive) where savings stop increasing.
        delta[m + 1]++;
        delta[M + limit + 1]--;

        // 2. The exact sum `a + b` gives an ADDITIONAL saving of 1 move.
        //    If the target sum `k` is exactly `a + b`, then 0 moves are needed for this pair.
        //    This is a saving of 2 moves (from the default 2 to 0).
        //    The previous step already accounted for a saving of 1 (reducing from 2 to 1).
        //    So, for `k = a + b`, we get an extra 1 move saving.
        //    We use `delta[a + b]++` to add this extra saving for the specific sum `a + b`.
        //    We use `delta[a + b + 1]--` to end this extra saving.
        delta[a + b]++;
        delta[a + b + 1]--;
    }

    // `currentBenefit` will track the total savings for a given target sum as we iterate through possible sums.
    let currentBenefit = 0;
    // `maxBenefit` will store the maximum total savings found across all possible target sums.
    let maxBenefit = 0;

    // Iterate through all possible target sums `k`, from the minimum possible sum (2)
    // up to the maximum possible sum (`maxSum`).
    // The prefix sum of `delta` at index `k` gives the total benefit (savings)
    // if `k` is chosen as the target sum.
    for (let k = 2; k <= maxSum; k++) {
        currentBenefit += delta[k];
        maxBenefit = Math.max(maxBenefit, currentBenefit);
    }

    // The total number of moves required if we had to change both elements in every pair is `pairsCount * 2`.
    // `maxBenefit` is the maximum reduction in moves we can achieve by choosing the optimal target sum.
    // Therefore, the minimum number of moves is `(initial_worst_case_moves) - (maximum_savings)`.
    return pairsCount * 2 - maxBenefit;
};
```