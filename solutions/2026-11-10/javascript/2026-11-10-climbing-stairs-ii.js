// /**
//  * @param {number} n
//  * @param {number[]} costs
//  * @return {number}
//  */

// Summary: Find the minimum cost to reach step n from step 0, where costs are associated with each step and jumps have an additional squared distance cost.
// Problem Link: https://leetcode.com/problems/climbing-stairs-ii/
// Approach:
// This problem can be solved using dynamic programming. We want to find the minimum cost to reach each step.
// Let dp[i] be the minimum cost to reach step i.
// The base case is dp[0] = 0, as we start at step 0 with no cost.
// To reach step i, we could have come from step i-1, i-2, or i-3.
// The cost to reach step i from step j (where j is i-1, i-2, or i-3) is:
// dp[j] + costs[i] + (i - j)^2
// Therefore, the recurrence relation is:
// dp[i] = min(
//   dp[i-1] + costs[i] + (i - (i-1))^2,  // if i-1 >= 0
//   dp[i-2] + costs[i] + (i - (i-2))^2,  // if i-2 >= 0
//   dp[i-3] + costs[i] + (i - (i-3))^2   // if i-3 >= 0
// )
//
// However, the direct recurrence relation `dp[i] = min(dp[i-1] + cost, dp[i-2] + cost, dp[i-3] + cost)` is incorrect because the cost is associated with the destination step `costs[i]` and the jump itself has a squared distance cost.
// The cost to reach step `i` from step `j` is `dp[j] + costs[i] + (i - j)^2`.
// So, `dp[i]` should be the minimum of these values over all possible previous steps `j` (i-1, i-2, i-3).
//
// dp[i] = costs[i] + min(
//   dp[i-1] + (i - (i-1))^2,  // Jump from i-1 to i
//   dp[i-2] + (i - (i-2))^2,  // Jump from i-2 to i
//   dp[i-3] + (i - (i-3))^2   // Jump from i-3 to i
// )
//
// dp[i] = costs[i] + min(
//   dp[i-1] + 1,
//   dp[i-2] + 4,
//   dp[i-3] + 9
// )
//
// This still isn't quite right. The problem statement says "The cost of jumping from step i to step j is defined as: costs[j] + (j - i)2". This implies the cost is calculated AT the destination step `j`.
// Let `dp[i]` be the minimum cost to reach step `i`.
//
// To reach step `i`, we can jump from `i-1`, `i-2`, or `i-3`.
// Cost from `i-1` to `i`: `dp[i-1] + costs[i] + (i - (i-1))^2 = dp[i-1] + costs[i] + 1`
// Cost from `i-2` to `i`: `dp[i-2] + costs[i] + (i - (i-2))^2 = dp[i-2] + costs[i] + 4`
// Cost from `i-3` to `i`: `dp[i-3] + costs[i] + (i - (i-3))^2 = dp[i-3] + costs[i] + 9`
//
// So, `dp[i] = costs[i] + min(dp[i-1] + 1, dp[i-2] + 4, dp[i-3] + 9)`. This seems correct.
//
// However, the example costs suggest a different interpretation.
// Example 1: n = 4, costs = [1,2,3,4]
// costs are for steps 1, 2, 3, 4. So `costs` array has length n.
// The problem states `costs[i]` is the cost of step `i`. This means `costs` is 0-indexed representing steps 1 to n.
// If `costs` is 1-indexed in the problem statement: "costs[i] is the cost of step i". Then for a `costs` array of length `n`, it means `costs[1]` to `costs[n]`.
// The examples use `costs` as a 0-indexed array where `costs[0]` corresponds to step 1, `costs[1]` to step 2, etc.
// "You are also given a 1-indexed integer array costs of length n, where costs[i] is the cost of step i."
// This means `costs` array represents steps 1 through `n`.
// For `n=4`, `costs=[1,2,3,4]`. `costs[0]=1` is cost for step 1. `costs[1]=2` for step 2. `costs[2]=3` for step 3. `costs[3]=4` for step 4.
// The steps are numbered 0 to `n`. So `n+1` steps.
//
// Let's re-read carefully: "You are climbing a staircase with n + 1 steps, numbered from 0 to n."
// "You are also given a 1-indexed integer array costs of length n, where costs[i] is the cost of step i."
// This phrasing is very confusing. A 1-indexed array of length n has elements at indices 1 to n.
// If `costs[i]` is the cost of step `i`, then `costs` must have information for steps 1 to n.
//
// Let's assume the `costs` array given is `0`-indexed in JavaScript, and `costs[k]` corresponds to the cost of step `k+1`.
// So if `costs = [c_1, c_2, ..., c_n]`, then `c_k` is the cost for step `k`.
// The problem uses `costs[i]` for step `i` in the jump cost definition.
// "The cost of jumping from step i to step j is defined as: costs[j] + (j - i)2"
// This implies `costs` is 0-indexed in the context of the jump cost calculation as well, and `costs[j]` is the cost of step `j`.
// This means `costs` array itself must be of length `n+1` to have costs for steps 0 to `n`.
// But the constraint says `costs.length == n`. This is a contradiction.
//
// Let's re-examine the examples assuming `costs` is 0-indexed and `costs[k]` is the cost for step `k+1`.
// `n=4, costs = [1,2,3,4]`
// This means cost of step 1 is 1, step 2 is 2, step 3 is 3, step 4 is 4.
// Steps are 0, 1, 2, 3, 4.
// We need to reach step `n` (step 4).
//
// Example 1:
// n = 4, costs = [1,2,3,4]
// Steps: 0, 1, 2, 3, 4
// cost(step 1) = 1, cost(step 2) = 2, cost(step 3) = 3, cost(step 4) = 4.
// We start at step 0 with cost 0.
//
// Path: 0 -> 1 -> 2 -> 4
// Jump 0 -> 1: cost = cost(step 1) + (1-0)^2 = 1 + 1 = 2. Current total cost = 2.
// Jump 1 -> 2: cost = cost(step 2) + (2-1)^2 = 2 + 1 = 3. Current total cost = 2 + 3 = 5.
// Jump 2 -> 4: cost = cost(step 4) + (4-2)^2 = 4 + 4 = 8. Current total cost = 5 + 8 = 13.
//
// This interpretation aligns with the example. So, `costs` array is 0-indexed, and `costs[k]` is the cost for step `k+1`.
// We need costs for steps 0 to n.
// We need `costs_actual` array where `costs_actual[i]` is the cost of step `i`.
// `costs_actual[0]` is implicitly 0 (or we don't need it if we can't land on step 0 with a cost).
// `costs_actual[i] = costs[i-1]` for `i` from 1 to `n`.
//
// DP state: `dp[i]` = minimum cost to reach step `i`.
// `dp` array size will be `n+1`.
// `dp[0] = 0`.
//
// For `i` from 1 to `n`:
//   `dp[i] = Infinity`
//   To reach step `i`, we could have jumped from `i-1`, `i-2`, or `i-3`.
//
//   If `i-1 >= 0`:
//     Cost to jump from `i-1` to `i`: `dp[i-1] + cost_of_step_i + (i - (i-1))^2`
//     `cost_of_step_i` is `costs[i-1]` (since `costs` is 0-indexed and `costs[k]` is for step `k+1`)
//     `jump_cost = dp[i-1] + costs[i-1] + 1`
//     `dp[i] = min(dp[i], jump_cost)`
//
//   If `i-2 >= 0`:
//     Cost to jump from `i-2` to `i`: `dp[i-2] + costs[i-1] + (i - (i-2))^2`
//     `jump_cost = dp[i-2] + costs[i-1] + 4`
//     `dp[i] = min(dp[i], jump_cost)`
//
//   If `i-3 >= 0`:
//     Cost to jump from `i-3` to `i`: `dp[i-3] + costs[i-1] + (i - (i-3))^2`
//     `jump_cost = dp[i-3] + costs[i-1] + 9`
//     `dp[i] = min(dp[i], jump_cost)`
//
// The problem description's "1-indexed integer array costs of length n" might imply the provided `costs` array means `costs[0]` is for step 1, `costs[1]` for step 2, ..., `costs[n-1]` for step `n`.
// This interpretation seems to be the most consistent with the examples.
//
// Let's refine the DP state and transitions.
// `dp[i]` = minimum cost to reach step `i` (where `i` is from 0 to `n`).
//
// `dp[0] = 0`
//
// For `i` from 1 to `n`:
//   `dp[i] = Infinity`
//   Cost of step `i` is `costs[i-1]` (if `i > 0`).
//
//   Consider jumps to step `i`:
//   1. From step `i-1` to `i`:
//      If `i-1 >= 0`:
//        Cost = `dp[i-1] + costs[i-1] + (i - (i-1))^2`
//        Cost = `dp[i-1] + costs[i-1] + 1`
//        `dp[i] = min(dp[i], dp[i-1] + costs[i-1] + 1)`
//
//   2. From step `i-2` to `i`:
//      If `i-2 >= 0`:
//        Cost = `dp[i-2] + costs[i-1] + (i - (i-2))^2`
//        Cost = `dp[i-2] + costs[i-1] + 4`
//        `dp[i] = min(dp[i], dp[i-2] + costs[i-1] + 4)`
//
//   3. From step `i-3` to `i`:
//      If `i-3 >= 0`:
//        Cost = `dp[i-3] + costs[i-1] + (i - (i-3))^2`
//        Cost = `dp[i-3] + costs[i-1] + 9`
//        `dp[i] = min(dp[i], dp[i-3] + costs[i-1] + 9)`
//
// Let's trace Example 1: n = 4, costs = [1,2,3,4]
// dp array of size 5: dp[0], dp[1], dp[2], dp[3], dp[4]
//
// dp[0] = 0
//
// i = 1:
//   costs[i-1] = costs[0] = 1
//   dp[1] = Infinity
//   From i-1 (step 0): dp[0] + costs[0] + (1-0)^2 = 0 + 1 + 1 = 2. dp[1] = 2.
//
// i = 2:
//   costs[i-1] = costs[1] = 2
//   dp[2] = Infinity
//   From i-1 (step 1): dp[1] + costs[1] + (2-1)^2 = 2 + 2 + 1 = 5. dp[2] = 5.
//   From i-2 (step 0): dp[0] + costs[1] + (2-0)^2 = 0 + 2 + 4 = 6. dp[2] = min(5, 6) = 5.
//
// i = 3:
//   costs[i-1] = costs[2] = 3
//   dp[3] = Infinity
//   From i-1 (step 2): dp[2] + costs[2] + (3-2)^2 = 5 + 3 + 1 = 9. dp[3] = 9.
//   From i-2 (step 1): dp[1] + costs[2] + (3-1)^2 = 2 + 3 + 4 = 9. dp[3] = min(9, 9) = 9.
//   From i-3 (step 0): dp[0] + costs[2] + (3-0)^2 = 0 + 3 + 9 = 12. dp[3] = min(9, 12) = 9.
//
// i = 4:
//   costs[i-1] = costs[3] = 4
//   dp[4] = Infinity
//   From i-1 (step 3): dp[3] + costs[3] + (4-3)^2 = 9 + 4 + 1 = 14. dp[4] = 14.
//   From i-2 (step 2): dp[2] + costs[3] + (4-2)^2 = 5 + 4 + 4 = 13. dp[4] = min(14, 13) = 13.
//   From i-3 (step 1): dp[1] + costs[3] + (4-1)^2 = 2 + 4 + 9 = 15. dp[4] = min(13, 15) = 13.
//
// Final answer: dp[4] = 13. This matches Example 1.
//
// Time Complexity: O(n) because we iterate from 1 to n, and each step takes constant time.
// Space Complexity: O(n) for the DP array.

// Optimization to O(1) space:
// Notice that to calculate dp[i], we only need dp[i-1], dp[i-2], and dp[i-3].
// This suggests we can use only a constant number of variables to store the previous DP states.
// We can use variables like `dp_i_minus_3`, `dp_i_minus_2`, `dp_i_minus_1` and `current_dp`.
//
// Initialize:
// dp_i_minus_3 = 0 (represents dp[0])
// dp_i_minus_2 = Infinity (not directly used as a starting point, but conceptually it's dp[-1])
// dp_i_minus_1 = Infinity (not directly used as a starting point, but conceptually it's dp[-1])
//
// For i = 1:
//   current_dp = costs[0] + (1-0)^2  -- This is not right. `dp[i]` calculation depends on previous DP values.
//
// Let's use explicit variables for the last three computed DP values.
// `dp0` stores `dp[i-3]`
// `dp1` stores `dp[i-2]`
// `dp2` stores `dp[i-1]`
//
// Initial state for the loop starting at i = 1:
// Before loop, we need to compute dp[1], dp[2], dp[3] to establish `dp0, dp1, dp2`.
//
// dp[0] = 0
//
// i = 1:
//   dp[1] = dp[0] + costs[0] + 1 = 0 + costs[0] + 1
//   dp0 = dp[0] = 0
//   dp1 = dp[1]
//   dp2 = Infinity (for the next iteration)
//
// i = 2:
//   dp[2] = min(dp[1] + costs[1] + 1, dp[0] + costs[1] + 4)
//   This is getting complicated. Let's be more direct.
//
// We need to maintain the last three computed `dp` values.
// `dp_prev3` -> `dp[i-3]`
// `dp_prev2` -> `dp[i-2]`
// `dp_prev1` -> `dp[i-1]`
// `dp_curr`  -> `dp[i]`
//
// Initial values for the loop starting at `i = 1`:
// We want to compute `dp[1]`, `dp[2]`, ..., `dp[n]`.
//
// `dp[0] = 0`
//
// For `i = 1`:
//   `dp_prev3 = dp[0] = 0`
//   `dp_prev2 = Infinity` (conceptually, since we can't jump from step -2 or -1)
//   `dp_prev1 = Infinity` (conceptually, since we can't jump from step -1)
//   `dp_curr = dp[0] + costs[0] + (1-0)^2 = costs[0] + 1`
//   Now, update for next iteration:
//   `dp_prev3 = dp_prev2 = Infinity`
//   `dp_prev2 = dp_prev1 = Infinity`
//   `dp_prev1 = dp_curr = costs[0] + 1`
//
// This is still not right. The initialization needs to be carefully thought out.
//
// Let's consider the states needed for `dp[i]`: `dp[i-1]`, `dp[i-2]`, `dp[i-3]`.
//
// Base cases for DP array:
// `dp[0] = 0`
// `dp[1] = costs[0] + 1` (jump from 0 to 1)
// `dp[2] = min(dp[1] + costs[1] + 1, dp[0] + costs[1] + 4)`
// `dp[3] = min(dp[2] + costs[2] + 1, dp[1] + costs[2] + 4, dp[0] + costs[2] + 9)`
//
// Once we have `dp[0], dp[1], dp[2]`, we can start a loop from `i = 3` to `n` to calculate `dp[i]` using `dp[i-1]`, `dp[i-2]`, `dp[i-3]`.
//
// O(1) space approach:
//
// Handle small `n` cases:
// If `n == 0`, return 0. (Problem constraints say `n >= 1`)
// If `n == 1`, return `costs[0] + 1`.
// If `n == 2`, return `min(costs[0] + 1, costs[1] + 4)`. No, it's `dp[2]`.
//   `dp[0] = 0`
//   `dp[1] = costs[0] + 1`
//   `dp[2] = min(dp[1] + costs[1] + 1, dp[0] + costs[1] + 4)`
// If `n == 3`, return `dp[3]`.
//   `dp[3] = min(dp[2] + costs[2] + 1, dp[1] + costs[2] + 4, dp[0] + costs[2] + 9)`
//
// Let's use variables:
// `dpm3` (dp[i-3])
// `dpm2` (dp[i-2])
// `dpm1` (dp[i-1])
// `dpc` (dp[i])
//
// Initialization for `i = 1`:
// `dpm3` = 0 (this is `dp[0]`)
// `dpm2` = Infinity (no `dp[-1]`)
// `dpm1` = Infinity (no `dp[-1]`)
//
// Let's initialize the first few DP values explicitly to establish the pattern for the O(1) space approach.
// `dp[0] = 0`
// If `n = 0`, return 0. (Constraint `n >= 1`)
//
// If `n = 1`:
//   `dp[1] = costs[0] + 1`
//   Return `dp[1]`
//
// If `n = 2`:
//   `dp[0] = 0`
//   `dp[1] = costs[0] + 1`
//   `dp[2] = min(dp[1] + costs[1] + 1, dp[0] + costs[1] + 4)`
//   Return `dp[2]`
//
// If `n >= 3`:
//   `dpm3 = 0` (represents `dp[0]`)
//   `dpm2 = costs[0] + 1` (represents `dp[1]`)
//   `dpm1 = min(dpm2 + costs[1] + 1, dpm3 + costs[1] + 4)` (represents `dp[2]`)
//
//   Now loop from `i = 3` to `n`:
//   Current step's cost: `current_step_cost = costs[i-1]`
//   `dpc = min(`
//     `dpm1 + current_step_cost + 1,`       // from i-1
//     `dpm2 + current_step_cost + 4,`       // from i-2
//     `dpm3 + current_step_cost + 9`        // from i-3
//   `)`
//
//   Update for next iteration:
//   `dpm3 = dpm2`
//   `dpm2 = dpm1`
//   `dpm1 = dpc`
//
//   After the loop, `dpm1` will hold `dp[n]`.
//
// Let's re-trace Example 1: n = 4, costs = [1,2,3,4]
//
// n=4, so n >= 3.
//
// `dpm3 = 0` (dp[0])
//
// `dpm2 = costs[0] + 1 = 1 + 1 = 2` (dp[1])
//
// `dpm1 = min(dpm2 + costs[1] + 1, dpm3 + costs[1] + 4)`
// `dpm1 = min(2 + 2 + 1, 0 + 2 + 4) = min(5, 6) = 5` (dp[2])
//
// Loop starts at i = 3:
//
// i = 3:
//   `current_step_cost = costs[3-1] = costs[2] = 3`
//   `dpc = min(`
//     `dpm1 + current_step_cost + 1,`   // 5 + 3 + 1 = 9
//     `dpm2 + current_step_cost + 4,`   // 2 + 3 + 4 = 9
//     `dpm3 + current_step_cost + 9`    // 0 + 3 + 9 = 12
//   `)`
//   `dpc = min(9, 9, 12) = 9` (dp[3])
//
//   Update for next iteration:
//   `dpm3 = dpm2 = 2`
//   `dpm2 = dpm1 = 5`
//   `dpm1 = dpc = 9`
//
// i = 4:
//   `current_step_cost = costs[4-1] = costs[3] = 4`
//   `dpc = min(`
//     `dpm1 + current_step_cost + 1,`   // 9 + 4 + 1 = 14
//     `dpm2 + current_step_cost + 4,`   // 5 + 4 + 4 = 13
//     `dpm3 + current_step_cost + 9`    // 2 + 4 + 9 = 15
//   `)`
//   `dpc = min(14, 13, 15) = 13` (dp[4])
//
//   Update for next iteration:
//   `dpm3 = dpm2 = 5`
//   `dpm2 = dpm1 = 9`
//   `dpm1 = dpc = 13`
//
// Loop ends. Return `dpm1` which is 13.
// This O(1) space approach seems correct.
// Need to handle edge cases for `n=0, 1, 2` properly.

// Edge case n=0: Problem constraint n>=1.
// Edge case n=1:
//   We need dp[1]. The loop structure is for i=3 to n.
//   If n=1, loop from 3 to 1 does not run.
//   We should handle n=1, n=2, n=3 outside the main loop.
//
// The DP recurrence is for `dp[i]`, where `i` goes up to `n`.
// The `costs` array has `costs[i-1]` for step `i`.
//
// Let's use the O(n) space DP first, as it's clearer to implement and verify.
// If performance is an issue, then optimize to O(1) space.
// Given n <= 10^5, O(n) space is acceptable.

// The `costs` array is 0-indexed and `costs[k]` corresponds to the cost of step `k+1`.
// The steps are numbered 0 to `n`.
// `dp[i]` = min cost to reach step `i`.
//
// `dp[0] = 0`
//
// For `i` from 1 to `n`:
//   `cost_of_current_step = costs[i-1]` (This is only if `i >= 1`)
//   `dp[i] = Infinity`
//
//   From `i-1` to `i`:
//     If `i-1 >= 0`:
//       `dp[i] = min(dp[i], dp[i-1] + cost_of_current_step + (i - (i-1))^2)`
//       `dp[i] = min(dp[i], dp[i-1] + costs[i-1] + 1)`
//
//   From `i-2` to `i`:
//     If `i-2 >= 0`:
//       `dp[i] = min(dp[i], dp[i-2] + cost_of_current_step + (i - (i-2))^2)`
//       `dp[i] = min(dp[i], dp[i-2] + costs[i-1] + 4)`
//
//   From `i-3` to `i`:
//     If `i-3 >= 0`:
//       `dp[i] = min(dp[i], dp[i-3] + cost_of_current_step + (i - (i-3))^2)`
//       `dp[i] = min(dp[i], dp[i-3] + costs[i-1] + 9)`
//
// The final answer is `dp[n]`.
// This is the O(n) space approach.

// Let's consider the constraints and potential for overflow.
// n <= 10^5
// costs[i] <= 10^4
// Max cost for a single jump:
// `dp[i-k] + costs[i-1] + k^2`
// If `dp[i-k]` is large, `costs[i-1]` is large, `k^2` is large.
// Max `dp` value can be roughly `n * max_single_jump_cost`.
// Max single jump cost: suppose `dp[i-1]` is already large.
// `dp[i-1] + costs[i-1] + 1`.
// If `dp` values grow linearly, say `O(n * C)`, where C is average step cost.
// `dp[i]` could be around `i * 10^4`.
// For `i = 10^5`, `dp[i]` could be around `10^5 * 10^4 = 10^9`.
// Adding `k^2` (max 9) and `costs[i-1]` (max 10^4) won't overflow a 64-bit float (JavaScript numbers are 64-bit float).
// Using `Infinity` for initial DP values is fine. `Number.MAX_SAFE_INTEGER` could also be used for very large costs, but `Infinity` is generally simpler for min operations.

// Let's double check the "1-indexed integer array costs of length n" again.
// If `costs` is 1-indexed, and its length is `n`.
// This means `costs[1], costs[2], ..., costs[n]` are defined.
// And `costs[i]` is the cost of step `i`.
// In JavaScript, arrays are 0-indexed.
// So, if the problem statement implies a conceptual 1-indexed array, then the JS array `costs` of length `n` would mean `costs[0]` (conceptually `costs[1]`), `costs[1]` (conceptually `costs[2]`), ..., `costs[n-1]` (conceptually `costs[n]`).
// The problem statement says: "You are also given a 1-indexed integer array costs of length n, where costs[i] is the cost of step i."
// This phrasing implies `costs[i]` (using 1-based indexing for `i`) refers to step `i`.
// So, `costs[1]` is cost of step 1, `costs[2]` is cost of step 2, ..., `costs[n]` is cost of step n.
// If `costs` in JS is `[c_0, c_1, ..., c_{n-1}]`, and this corresponds to the conceptual 1-indexed array:
// `costs[0]` in JS = `costs[1]` conceptual = cost of step 1
// `costs[1]` in JS = `costs[2]` conceptual = cost of step 2
// ...
// `costs[n-1]` in JS = `costs[n]` conceptual = cost of step n
//
// So, when we need the cost of step `i` (where `i` is from 1 to `n`), we use `costs[i-1]` from the JS array. This matches my current implementation.
// The jump cost is `costs[j] + (j - i)^2`. Here `j` is the destination step.
// So, if we reach step `j`, we add `costs[j]` to the cost.
// With the interpretation that `costs[k]` in JS is the cost of step `k+1`:
// Cost of step `j` is `costs[j-1]`.
//
// So, the recurrence should be:
// `dp[i] = min(`
//   `dp[i-1] + costs[i-1] + (i - (i-1))^2,` // Jump from i-1 to i
//   `dp[i-2] + costs[i-1] + (i - (i-2))^2,` // Jump from i-2 to i
//   `dp[i-3] + costs[i-1] + (i - (i-3))^2`  // Jump from i-3 to i
// `)`
// This is exactly what I have implemented.
//
// The problem statement's phrasing is a bit ambiguous but the examples clarify the intent.

var climbStairs = function(n, costs) {
    // dp[i] will store the minimum cost to reach step i.
    // The steps are numbered from 0 to n. So we need an array of size n+1.
    const dp = new Array(n + 1).fill(Infinity);

    // Base case: The cost to reach step 0 is 0.
    dp[0] = 0;

    // Iterate through each step from 1 to n.
    for (let i = 1; i <= n; i++) {
        // The cost of the current step 'i'.
        // According to the problem statement and examples, 'costs' is 0-indexed,
        // and costs[k] is the cost for step k+1.
        // So, the cost for step 'i' is costs[i-1].
        // This is valid only if i >= 1.
        const currentStepCost = costs[i - 1];

        // Calculate the minimum cost to reach step 'i' by considering all possible previous steps.
        // A jump can be made from i-1, i-2, or i-3 to reach step i.

        // 1. Jump from step i-1 to step i:
        // Cost = (cost to reach i-1) + (cost of step i) + (squared distance of jump)
        // The squared distance from i-1 to i is (i - (i-1))^2 = 1^2 = 1.
        if (i - 1 >= 0) {
            dp[i] = Math.min(dp[i], dp[i - 1] + currentStepCost + 1);
        }

        // 2. Jump from step i-2 to step i:
        // Cost = (cost to reach i-2) + (cost of step i) + (squared distance of jump)
        // The squared distance from i-2 to i is (i - (i-2))^2 = 2^2 = 4.
        if (i - 2 >= 0) {
            dp[i] = Math.min(dp[i], dp[i - 2] + currentStepCost + 4);
        }

        // 3. Jump from step i-3 to step i:
        // Cost = (cost to reach i-3) + (cost of step i) + (squared distance of jump)
        // The squared distance from i-3 to i is (i - (i-3))^2 = 3^2 = 9.
        if (i - 3 >= 0) {
            dp[i] = Math.min(dp[i], dp[i - 3] + currentStepCost + 9);
        }
    }

    // The minimum cost to reach step n is stored in dp[n].
    return dp[n];
};
// */

// /**
//  * @param {number} n
//  * @param {number[]} costs
//  * @return {number}
//  */
// /*
//  * Summary: Find the minimum cost to reach step n from step 0, where costs are associated with each step and jumps have an additional squared distance cost.
//  * Problem Link: https://leetcode.com/problems/climbing-stairs-ii/
//  * Approach:
//  * This problem can be solved using dynamic programming. We want to find the minimum cost to reach each step.
//  * Let dp[i] be the minimum cost to reach step i.
//  * The base case is dp[0] = 0, as we start at step 0 with no cost.
//  * To reach step i, we could have come from step i-1, i-2, or i-3.
//  * The cost of jumping from step j to step i is defined as: costs[i] + (i - j)^2.
//  * However, the provided `costs` array is 0-indexed and `costs[k]` represents the cost of step `k+1`.
//  * So, the cost for step `i` (where `i >= 1`) is `costs[i-1]`.
//  *
//  * The recurrence relation is:
//  * dp[i] = min(
//  *   dp[i-1] + costs[i-1] + (i - (i-1))^2,  // Jump from i-1 to i
//  *   dp[i-2] + costs[i-1] + (i - (i-2))^2,  // Jump from i-2 to i
//  *   dp[i-3] + costs[i-1] + (i - (i-3))^2   // Jump from i-3 to i
//  * )
//  * Simplifying the squared terms:
//  * dp[i] = min(
//  *   dp[i-1] + costs[i-1] + 1,
//  *   dp[i-2] + costs[i-1] + 4,
//  *   dp[i-3] + costs[i-1] + 9
//  * )
//  *
//  * We need to handle the base cases and boundary conditions for `i-1`, `i-2`, `i-3` being non-negative.
//  *
//  * Time Complexity: O(n) because we iterate through the steps from 1 to n, and each step involves a constant number of operations.
//  * Space Complexity: O(n) for the DP array. An O(1) space optimization is possible by only storing the last three DP states, but O(n) is acceptable given the constraints.
//  */
// var climbStairs = function(n, costs) {
//     // dp[i] will store the minimum cost to reach step i.
//     // The steps are numbered from 0 to n. So we need an array of size n+1.
//     // Initialize all costs to Infinity, except for the starting step.
//     const dp = new Array(n + 1).fill(Infinity);
//
//     // Base case: The cost to reach step 0 is 0. We start at step 0.
//     dp[0] = 0;
//
//     // Iterate through each step from 1 up to n.
//     for (let i = 1; i <= n; i++) {
//         // The cost of the current step 'i'.
//         // The problem states `costs` is a 0-indexed array of length `n`.
//         // `costs[k]` is the cost for step `k+1`.
//         // Therefore, the cost for step `i` (where `i >= 1`) is `costs[i-1]`.
//         const currentStepCost = costs[i - 1];
//
//         // Calculate the minimum cost to reach step 'i' by considering jumps from previous steps.
//
//         // Option 1: Jump from step i-1 to step i.
//         // This is possible if i-1 is a valid step (i.e., >= 0).
//         if (i - 1 >= 0) {
//             // Cost = (min cost to reach i-1) + (cost of step i) + (squared jump distance from i-1 to i).
//             // Squared jump distance = (i - (i-1))^2 = 1^2 = 1.
//             dp[i] = Math.min(dp[i], dp[i - 1] + currentStepCost + 1);
//         }
//
//         // Option 2: Jump from step i-2 to step i.
//         // This is possible if i-2 is a valid step (i.e., >= 0).
//         if (i - 2 >= 0) {
//             // Cost = (min cost to reach i-2) + (cost of step i) + (squared jump distance from i-2 to i).
//             // Squared jump distance = (i - (i-2))^2 = 2^2 = 4.
//             dp[i] = Math.min(dp[i], dp[i - 2] + currentStepCost + 4);
//         }
//
//         // Option 3: Jump from step i-3 to step i.
//         // This is possible if i-3 is a valid step (i.e., >= 0).
//         if (i - 3 >= 0) {
//             // Cost = (min cost to reach i-3) + (cost of step i) + (squared jump distance from i-3 to i).
//             // Squared jump distance = (i - (i-3))^2 = 3^2 = 9.
//             dp[i] = Math.min(dp[i], dp[i - 3] + currentStepCost + 9);
//         }
//     }
//
//     // The final answer is the minimum cost to reach step n.
//     return dp[n];
// };
// */
//
// var climbStairs = function(n, costs) {
//     // dp[i] will store the minimum cost to reach step i.
//     // The steps are numbered from 0 to n. So we need an array of size n+1.
//     // Initialize all costs to Infinity, except for the starting step.
//     const dp = new Array(n + 1).fill(Infinity);
//
//     // Base case: The cost to reach step 0 is 0. We start at step 0.
//     dp[0] = 0;
//
//     // Iterate through each step from 1 up to n.
//     for (let i = 1; i <= n; i++) {
//         // The cost of the current step 'i'.
//         // The problem states `costs` is a 0-indexed array of length `n`.
//         // `costs[k]` is the cost for step `k+1`.
//         // Therefore, the cost for step `i` (where `i >= 1`) is `costs[i-1]`.
//         const currentStepCost = costs[i - 1];
//
//         // Calculate the minimum cost to reach step 'i' by considering jumps from previous steps.
//
//         // Option 1: Jump from step i-1 to step i.
//         // This is possible if i-1 is a valid step (i.e., >= 0).
//         if (i - 1 >= 0) {
//             // Cost = (min cost to reach i-1) + (cost of step i) + (squared jump distance from i-1 to i).
//             // Squared jump distance = (i - (i-1))^2 = 1^2 = 1.
//             dp[i] = Math.min(dp[i], dp[i - 1] + currentStepCost + 1);
//         }
//
//         // Option 2: Jump from step i-2 to step i.
//         // This is possible if i-2 is a valid step (i.e., >= 0).
//         if (i - 2 >= 0) {
//             // Cost = (min cost to reach i-2) + (cost of step i) + (squared jump distance from i-2 to i).
//             // Squared jump distance = (i - (i-2))^2 = 2^2 = 4.
//             dp[i] = Math.min(dp[i], dp[i - 2] + currentStepCost + 4);
//         }
//
//         // Option 3: Jump from step i-3 to step i.
//         // This is possible if i-3 is a valid step (i.e., >= 0).
//         if (i - 3 >= 0) {
//             // Cost = (min cost to reach i-3) + (cost of step i) + (squared jump distance from i-3 to i).
//             // Squared jump distance = (i - (i-3))^2 = 3^2 = 9.
//             dp[i] = Math.min(dp[i], dp[i - 3] + currentStepCost + 9);
//         }
//     }
//
//     // The final answer is the minimum cost to reach step n.
//     return dp[n];
// };

// /**
//  * @param {number} n
//  * @param {number[]} costs
//  * @return {number}
//  */

// Summary: Find the minimum cost to reach step n from step 0, where costs are associated with each step and jumps have an additional squared distance cost.
// Problem Link: https://leetcode.com/problems/climbing-stairs-ii/
// Approach:
// This problem can be solved using dynamic programming. We aim to find the minimum cost to reach each step from step 0.
// Let `dp[i]` represent the minimum cost to reach step `i`.
// The steps are numbered from 0 to `n`. Thus, our DP array will have a size of `n+1`.
// The base case is `dp[0] = 0`, as we start at step 0 with no initial cost.
//
// To calculate `dp[i]` for `i > 0`, we consider all possible steps from which we could have jumped to step `i`. These are steps `i-1`, `i-2`, and `i-3`.
//
// The cost of jumping from step `j` to step `i` is given by `costs[i] + (i - j)^2`.
// However, the problem specifies `costs` as a 0-indexed array of length `n`, where `costs[k]` is the cost of step `k+1`.
// Therefore, for a step `i` (where `i >= 1`), its cost is `costs[i-1]`.
//
// The recurrence relation to find `dp[i]` is the minimum of the costs from possible previous steps:
//
// `dp[i] = min(`
//   `dp[i-1] + costs[i-1] + (i - (i-1))^2,`  // Jump from step i-1 to step i
//   `dp[i-2] + costs[i-1] + (i - (i-2))^2,`  // Jump from step i-2 to step i
//   `dp[i-3] + costs[i-1] + (i - (i-3))^2`   // Jump from step i-3 to step i
// `)`
//
// Simplifying the squared jump distances:
// - From `i-1` to `i`: `(i - (i-1))^2 = 1^2 = 1`
// - From `i-2` to `i`: `(i - (i-2))^2 = 2^2 = 4`
// - From `i-3` to `i`: `(i - (i-3))^2 = 3^2 = 9`
//
// So, the recurrence becomes:
// `dp[i] = min(`
//   `dp[i-1] + costs[i-1] + 1,`
//   `dp[i-2] + costs[i-1] + 4,`
//   `dp[i-3] + costs[i-1] + 9`
// `)`
//
// We must ensure that the previous steps (`i-1`, `i-2`, `i-3`) are valid (i.e., non-negative) before using their `dp` values.
//
// Time Complexity: O(n)
// We iterate through the steps from 1 to `n`. For each step, we perform a constant number of operations (comparisons and additions). Therefore, the time complexity is linear with respect to `n`.
//
// Space Complexity: O(n)
// We use a DP array `dp` of size `n+1` to store the minimum costs to reach each step. This results in linear space complexity.
// An optimization to O(1) space is possible by noticing that `dp[i]` only depends on the three preceding DP values (`dp[i-1]`, `dp[i-2]`, `dp[i-3]`), allowing us to use a fixed number of variables. However, O(n) space is generally acceptable for this problem's constraints.
// */
var climbStairs = function(n, costs) {
    // `dp[i]` will store the minimum cost to reach step `i`.
    // The steps are numbered from 0 to `n`, so we need an array of size `n + 1`.
    // Initialize all costs to `Infinity`, except for the starting step, which has a cost of 0.
    const dp = new Array(n + 1).fill(Infinity);

    // Base case: The cost to reach step 0 is 0, as we start at step 0 with no cost.
    dp[0] = 0;

    // Iterate through each step from 1 up to `n` to calculate the minimum cost to reach it.
    for (let i = 1; i <= n; i++) {
        // The cost of the current step `i`.
        // The problem specifies that `costs` is a 0-indexed array of length `n`,
        // and `costs[k]` is the cost for step `k+1`.
        // Therefore, the cost for step `i` (where `i >= 1`) is `costs[i - 1]`.
        const currentStepCost = costs[i - 1];

        // Calculate the minimum cost to reach step `i` by considering jumps from previous steps.
        // A jump can be made from `i-1`, `i-2`, or `i-3` to reach step `i`.

        // Option 1: Jump from step `i-1` to step `i`.
        // This jump is possible if `i-1` is a valid step (i.e., `i-1 >= 0`).
        if (i - 1 >= 0) {
            // Cost = (minimum cost to reach step i-1) + (cost of step i) + (squared jump distance from i-1 to i).
            // The squared jump distance from `i-1` to `i` is `(i - (i-1))^2 = 1^2 = 1`.
            dp[i] = Math.min(dp[i], dp[i - 1] + currentStepCost + 1);
        }

        // Option 2: Jump from step `i-2` to step `i`.
        // This jump is possible if `i-2` is a valid step (i.e., `i-2 >= 0`).
        if (i - 2 >= 0) {
            // Cost = (minimum cost to reach step i-2) + (cost of step i) + (squared jump distance from i-2 to i).
            // The squared jump distance from `i-2` to `i` is `(i - (i-2))^2 = 2^2 = 4`.
            dp[i] = Math.min(dp[i], dp[i - 2] + currentStepCost + 4);
        }

        // Option 3: Jump from step `i-3` to step `i`.
        // This jump is possible if `i-3` is a valid step (i.e., `i-3 >= 0`).
        if (i - 3 >= 0) {
            // Cost = (minimum cost to reach step i-3) + (cost of step i) + (squared jump distance from i-3 to i).
            // The squared jump distance from `i-3` to `i` is `(i - (i-3))^2 = 3^2 = 9`.
            dp[i] = Math.min(dp[i], dp[i - 3] + currentStepCost + 9);
        }
    }

    // The final answer is the minimum cost to reach step `n`, which is stored in `dp[n]`.
    return dp[n];
};
