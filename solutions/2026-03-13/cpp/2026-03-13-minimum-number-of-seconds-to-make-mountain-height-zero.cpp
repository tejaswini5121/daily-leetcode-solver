```cpp
// Problem: Minimum Number of Seconds to Make Mountain Height Zero
// Link: https://leetcode.com/problems/minimum-number-of-seconds-to-make-mountain-height-zero/
// Approach:
// The problem asks for the minimum time required for workers to reduce the mountain height to zero.
// Each worker 'i' with a `workerTimes[i]` can reduce the mountain height by 'x' in
// `workerTimes[i] + workerTimes[i] * 2 + ... + workerTimes[i] * x` seconds.
// This sum can be simplified to `workerTimes[i] * x * (x + 1) / 2`.
// We want to assign each worker to reduce a certain amount of height such that the maximum time taken by any worker is minimized.
// This is a classic "minimize the maximum" problem, which can often be solved using binary search on the answer.
//
// We can binary search for the minimum possible time `T`. For a given time `T`, we need to check if it's possible to reduce the mountain height to zero.
// To check if time `T` is feasible:
// For each worker `i`, we can determine the maximum height `x` they can reduce within time `T`.
// The condition is `workerTimes[i] * x * (x + 1) / 2 <= T`.
// We can find the maximum `x` for each worker. Since `x * (x + 1) / 2` is an increasing function of `x`, we can solve this inequality for `x`.
// A simpler way is to realize that for a given time `T`, a worker with `workerTimes[i]` can contribute a total height reduction of `h_i`.
// The total height reduction achievable by worker `i` within time `T` is the sum of `k` such that `workerTimes[i] * k * (k + 1) / 2 <= T`.
// We can find the maximum such `k` by solving the quadratic inequality or by observation.
// The time taken by worker `i` to reduce height `k` is `workerTimes[i] * k * (k + 1) / 2`.
//
// For a given time `T`, can we achieve `mountainHeight`?
// For each worker `i`, we want to find the maximum height `k_i` they can reduce.
// This `k_i` satisfies `workerTimes[i] * k_i * (k_i + 1) / 2 <= T`.
// The total height reduction achieved by worker `i` is the sum of heights they reduce.
//
// Let's rephrase the check function: `canAchieve(time_limit)`
// For a given `time_limit`, each worker `i` can reduce some amount of height.
// The time taken to reduce height `h` is `workerTimes[i] * h * (h + 1) / 2`.
// So, for a worker `i` and a `time_limit`, what's the maximum height `h` they can reduce?
// We need to find the maximum `h` such that `workerTimes[i] * h * (h + 1) / 2 <= time_limit`.
// This means `h * (h + 1) <= 2 * time_limit / workerTimes[i]`.
// Let `target = 2 * time_limit / workerTimes[i]`. We need to find the max `h` such that `h * (h + 1) <= target`.
// This is equivalent to `h^2 + h - target <= 0`. The positive root of `h^2 + h - target = 0` is `(-1 + sqrt(1 + 4*target)) / 2`.
// So, `h` is approximately `sqrt(2 * target) = sqrt(4 * time_limit / workerTimes[i]) = 2 * sqrt(time_limit / workerTimes[i])`.
//
// The critical observation is that the total height reduction provided by worker `i` within time `T` is NOT the maximum `k` such that `workerTimes[i] * k * (k + 1) / 2 <= T`.
// Instead, for a given time `T`, worker `i` will contribute height reduction in chunks.
// If worker `i` works for `t_i` seconds, the total height reduced is `h_i`.
// The problem states: "For worker i: To decrease the mountain's height by x, it takes workerTimes[i] + workerTimes[i] * 2 + ... + workerTimes[i] * x seconds."
// This implies that if a worker is assigned to reduce height `x`, they spend `workerTimes[i] * x * (x+1) / 2` seconds.
//
// The problem can be framed as: we have `mountainHeight` to reduce. We have workers.
// For a fixed time `T`, can we reduce `mountainHeight`?
// For each worker `i`, we can find the maximum height `h_i` they can reduce within time `T`.
// This `h_i` is the maximum integer such that `workerTimes[i] * h_i * (h_i + 1) / 2 <= T`.
// The total height that can be reduced within time `T` is the sum of `h_i` for all workers.
// If `sum(h_i) >= mountainHeight`, then time `T` is feasible.
//
// How to efficiently find the maximum `h_i` for a given `T` and `workerTimes[i]`?
// The equation is `workerTimes[i] * h * (h + 1) / 2 <= T`.
// This is `h * (h + 1) <= 2 * T / workerTimes[i]`.
// Let `val = 2 * T / workerTimes[i]`. We need to find the max `h` such that `h * (h + 1) <= val`.
// This `h` can be found using binary search as well, or by approximating `h^2 ~= val`, so `h ~= sqrt(val)`.
//
// Let's refine `canAchieve(T)`:
// `total_height_reducible = 0`
// For each `w_time` in `workerTimes`:
//   We want to find max `h` such that `w_time * h * (h + 1) / 2 <= T`.
//   This can be written as `h * (h + 1) <= (2 * T) / w_time`.
//   Let `RHS = (2 * T) / w_time`. We need `h * (h + 1) <= RHS`.
//   We can binary search for `h` in the range `[0, mountainHeight]` (or a larger safe upper bound like `2 * mountainHeight` because a single worker could potentially reduce it all).
//   A safe upper bound for `h` for a single worker is roughly `2 * mountainHeight` if `workerTimes[i]=1`.
//   The maximum possible `h` is `mountainHeight`.
//   So, for each `w_time`, binary search for `h` in `[0, mountainHeight + 1]`.
//   `low = 0, high = mountainHeight + 1`
//   While `low < high`:
//     `mid = low + (high - low) / 2`
//     `time_needed = w_time * mid * (mid + 1) / 2`
//     If `time_needed <= T`:
//       `low = mid + 1` // Try to reduce more height
//     Else:
//       `high = mid` // `mid` height is too much
//   The maximum height reducible by this worker is `low - 1`.
//   `total_height_reducible += (low - 1)`
// Return `total_height_reducible >= mountainHeight`.
//
// Binary search range for `T`:
// Lower bound: 0 (if mountainHeight is 0, which is not possible by constraints, or if we have infinite workers who can do it instantly, which is not the case).
// A safe lower bound could be 0 or the minimum time to reduce 1 height by any worker (min(workerTimes)).
// Upper bound: What's the maximum possible time?
// If `mountainHeight = 10^5` and `workerTimes = [10^6]`.
// The single worker needs to reduce `10^5`.
// Time for height `h`: `10^6 * h * (h+1) / 2`.
// For `h = 10^5`, time is roughly `10^6 * (10^5)^2 / 2 = 10^6 * 10^{10} / 2 = 0.5 * 10^{16}`.
// This is too large for a 64-bit integer. Let's recheck the constraints and logic.
//
// Constraints:
// `1 <= mountainHeight <= 10^5`
// `1 <= workerTimes.length <= 10^4`
// `1 <= workerTimes[i] <= 10^6`
//
// Time for height `h`: `workerTimes[i] * h * (h + 1) / 2`.
// If `workerTimes[i] = 10^6`, `h = 10^5`.
// Time = `10^6 * 10^5 * (10^5 + 1) / 2`
//      = `10^6 * (10^{10} + 10^5) / 2`
//      = `(10^{16} + 10^{11}) / 2` which is approximately `0.5 * 10^{16}`.
// This will overflow `long long`.
//
// Wait, the problem phrasing: "For worker i: To decrease the mountain's height by x, it takes workerTimes[i] + workerTimes[i] * 2 + ... + workerTimes[i] * x seconds."
// This might mean the worker works for a total duration that is the sum.
// The question is "minimum number of seconds required for the workers to make the height of the mountain 0."
// This implies workers work simultaneously. The total time is the maximum time any single worker spends.
//
// Example 1: `mountainHeight = 4`, `workerTimes = [2,1,1]`
// Worker 0 (time=2):
//  h=1: 2 secs
//  h=2: 2 + 4 = 6 secs
//  h=3: 2 + 4 + 6 = 12 secs
// Worker 1 (time=1):
//  h=1: 1 sec
//  h=2: 1 + 2 = 3 secs
//  h=3: 1 + 2 + 3 = 6 secs
// Worker 2 (time=1):
//  h=1: 1 sec
//  h=2: 1 + 2 = 3 secs
//  h=3: 1 + 2 + 3 = 6 secs
//
// If time = 3:
// Worker 0: Can reduce height 1 (takes 2 secs). Cannot reduce height 2 (needs 6 secs).
// Worker 1: Can reduce height 2 (takes 3 secs).
// Worker 2: Can reduce height 1 (takes 1 sec).
// Total height reduced = 1 + 2 + 1 = 4. Yes, feasible. Minimum time is 3.
//
// The formula `workerTimes[i] * x * (x + 1) / 2` is correct.
// The issue is the upper bound for binary search.
// If `mountainHeight = 10^5` and `workerTimes = [1]`.
// Single worker needs to reduce `10^5`.
// Time = `1 * 10^5 * (10^5 + 1) / 2`
//      = `(10^{10} + 10^5) / 2` which is roughly `0.5 * 10^{10}`. This fits in `long long`.
//
// What if `workerTimes` is very large?
// `mountainHeight = 10^5`, `workerTimes = [10^6]`.
// For height `h`, time is `10^6 * h * (h+1) / 2`.
// To reduce height `1`: time = `10^6 * 1 * 2 / 2 = 10^6`.
// To reduce height `2`: time = `10^6 * 2 * 3 / 2 = 3 * 10^6`.
// To reduce height `k`: time is `O(workerTimes[i] * k^2)`.
//
// If `workerTimes[i]` is large, the maximum `k` a single worker can reduce within a reasonable time is small.
// Let's check the maximum height a single worker with `workerTimes[i] = 1` can reduce in a `long long` time.
// Max `long long` is approx `9 * 10^{18}`.
// `1 * h * (h + 1) / 2 <= 9 * 10^{18}`
// `h^2 ~= 18 * 10^{18}`
// `h ~= sqrt(18) * 10^9 ~= 4.2 * 10^9`.
// This means a worker with `workerTimes[i] = 1` can reduce a height much larger than `mountainHeight`.
//
// The maximum height `h` a worker can reduce within time `T` is bounded.
// `h * (h+1) <= 2 * T / workerTimes[i]`
// If `workerTimes[i]` is small (e.g., 1), and `T` is large (e.g., max possible `long long`), then `h` can be large.
//
// The binary search for `T` should be on `[0, approx_max_time]`.
// Max possible `mountainHeight` is `10^5`.
// If `workerTimes` has one element `1`, max time is `1 * 10^5 * (10^5 + 1) / 2` approx `0.5 * 10^{10}`.
// If `workerTimes` has one element `10^6`, `mountainHeight = 1`.
// Time = `10^6 * 1 * 2 / 2 = 10^6`.
//
// What if we have many workers?
// `mountainHeight = 10^5`, `workerTimes = [10^6, 10^6, ..., 10^6]` (10^4 times).
// If time `T` is large, each worker can contribute height.
// Say `T = 10^{12}`.
// For worker `i` with `w_time = 10^6`:
// `10^6 * h * (h + 1) / 2 <= 10^{12}`
// `h * (h + 1) <= 2 * 10^{12} / 10^6 = 2 * 10^6`
// `h^2 ~= 2 * 10^6`
// `h ~= sqrt(2) * 10^3 ~= 1414`.
// So each worker can reduce about 1414 height.
// With `10^4` workers, total height reducible = `10^4 * 1414 ~= 1.4 * 10^7`. This is enough.
//
// The upper bound for `T`:
// Consider the worst case: `mountainHeight = 10^5`, `workerTimes = [1]`.
// Max time approx `0.5 * 10^{10}`.
// What if `mountainHeight = 1`, `workerTimes = [10^6]`. Max time is `10^6`.
// What if `mountainHeight = 10^5`, `workerTimes = [10^6]`.
// We need `10^6 * h * (h+1)/2 >= 10^5`.
// `h * (h+1) >= 2 * 10^5 / 10^6 = 0.2`. So `h=1` is enough. Time is `10^6`.
//
// The maximum possible time is when a single worker with `workerTimes[i]=1` reduces `mountainHeight = 10^5`.
// `1 * 10^5 * (10^5 + 1) / 2` which is `0.5 * 10^{10}`. This fits in `long long`.
// So, the binary search range `[0, 1e10]` or slightly more should be fine.
// Let's use `1e15` as a very safe upper bound for `T` to avoid any overflow issues during calculation of time needed for height `h`.
// Max `h` is `10^5`. Max `w_time` is `10^6`. Max `T` could be roughly `10^6 * 10^5 * (10^5+1)/2 ~= 0.5 * 10^{16}`.
// So, `long long` is necessary for `T` and intermediate time calculations.
//
// Let's refine the `canAchieve` function and binary search for `h` inside it.
//
// `canAchieve(T)` function:
//   `total_h_reducible = 0`
//   For each `w_time` in `workerTimes`:
//     // Find max `h` such that `w_time * h * (h + 1) / 2 <= T`
//     // This implies `h * (h + 1) <= 2 * T / w_time`
//     // We need to find max `h` such that `h^2 + h - (2 * T / w_time) <= 0`.
//     // The roots of `h^2 + h - C = 0` are `(-1 +/- sqrt(1 + 4C)) / 2`.
//     // We need the positive root. `h <= (-1 + sqrt(1 + 4 * (2 * T / w_time))) / 2`.
//     // `h <= (-1 + sqrt(1 + 8 * T / w_time)) / 2`.
//     // Due to potential floating point precision issues, it's safer to use binary search for `h`.
//     // Max possible `h` for a single worker is `mountainHeight`.
//     // A safer upper bound for `h` when `w_time=1` and `T` is max `long long` is `~4*10^9`.
//     // But we only care if the sum of heights can reach `mountainHeight`.
//     // If a single worker can reduce `mountainHeight`, they might do it.
//     // So, the binary search range for `h` can be `[0, mountainHeight + 5]` (a small buffer).
//     // If `w_time` is very large, `h` will be small. If `w_time` is small, `h` can be large.
//     // Let's binary search `h` in `[0, 200001]` (slightly more than `mountainHeight`).
//     // Why `200001`? If `w_time = 1` and `T` is large enough to reduce `10^5`, `h` will be `10^5`.
//     // If `T` is so large that `h` could exceed `mountainHeight`, it means one worker can contribute
//     // more than needed. The actual `h` we consider can be capped at `mountainHeight`.
//     // `h_reducible_by_worker = 0;`
//     // `low_h = 0, high_h = mountainHeight + 1;` // Upper bound for h is mountainHeight.
//     // Let's test `high_h = 200001` for safety.
//     `low_h = 0, high_h = 200001;` // Max possible height is around 10^5. So 2*10^5 is a safe upper bound for h for a single worker to consider.
//     `max_h_for_worker = 0;`
//     while (`low_h < high_h`) {
//         `mid_h = low_h + (high_h - low_h) / 2;`
//         if (`mid_h == 0`) { // Handle mid_h = 0 case. Time needed is 0.
//             `low_h = 1;`
//             continue;
//         }
//         // Calculate time needed for mid_h height. Use __int128 if intermediate calculation overflows long long.
//         // `w_time * mid_h * (mid_h + 1) / 2`
//         // Max `w_time = 10^6`, `mid_h = 2*10^5`.
//         // `10^6 * (2*10^5) * (2*10^5 + 1) / 2`
//         // `10^6 * 4*10^{10} / 2 ~= 2 * 10^{16}`. This fits in `long long`.
//         // No need for __int128 for intermediate time calculation.
//         `long long time_needed = (long long)w_time * mid_h * (mid_h + 1) / 2;`
//
//         if (`time_needed <= T`) {
//             `max_h_for_worker = mid_h;` // This height is achievable within time T
//             `low_h = mid_h + 1;`      // Try to achieve more height
//         } else {
//             `high_h = mid_h;`         // This height is too much, reduce height
//         }
//     }
//     `total_h_reducible += max_h_for_worker;`
//     // Optimization: If total_h_reducible already exceeds mountainHeight, we can stop early.
//     if (`total_h_reducible >= mountainHeight`) {
//         return true;
//     }
//   `return total_h_reducible >= mountainHeight;`
//
// Binary search for the answer `T`:
// `low_T = 0;`
// `high_T = 1e16;` // A safe upper bound. Max time can be roughly 0.5 * 10^16. Let's use 10^16.
// `ans_T = high_T;`
//
// while (`low_T <= high_T`) {
//   `mid_T = low_T + (high_T - low_T) / 2;`
//   if (`canAchieve(mid_T)`):
//     `ans_T = mid_T;`
//     `high_T = mid_T - 1;` // Try to find a smaller time
//   else:
//     `low_T = mid_T + 1;` // Need more time
// }
// return `ans_T;`
//
// The maximum value of `mountainHeight` is `10^5`.
// If `workerTimes = [1]`, the time to reduce `10^5` is `1 * 10^5 * (10^5 + 1) / 2 ≈ 5 * 10^9`.
// If `mountainHeight = 1`, `workerTimes = [10^6]`, time is `10^6 * 1 * 2 / 2 = 10^6`.
//
// Let's reconsider `high_T`.
// Max value for `mountainHeight` is `10^5`.
// Min `workerTimes[i]` is `1`.
// If one worker reduces `10^5` height, time is `1 * 10^5 * (10^5+1)/2 ≈ 5 * 10^9`.
// If `mountainHeight = 10^5` and all `workerTimes[i] = 10^6`.
// Each worker might reduce height `h` where `10^6 * h * (h+1) / 2` is the time.
// For time `T`, each worker can reduce `h` such that `h * (h+1) <= 2*T / 10^6`.
// If `T = 5 * 10^9`, then `h * (h+1) <= 2 * 5 * 10^9 / 10^6 = 10^{10} / 10^6 = 10^4`.
// `h^2 ~= 10^4`, `h ~= 100`.
// With `10^4` workers, `10^4 * 100 = 10^6` height reducible. This is enough.
//
// So `5 * 10^9` is a reasonable upper bound for `T`.
// Let's try `high_T = 5e9 + 7` (a bit more than `0.5 * 10^{10}`).
// Or even safer, `1e10` or `1e11`.
// If `T = 10^{11}`, for `w_time = 1`: `h * (h+1) <= 2 * 10^{11}`. `h^2 ~= 2 * 10^{11}`, `h ~= sqrt(20) * 10^5 ~= 4.47 * 10^5`.
// This `h` value is higher than `mountainHeight`, which is fine.
// The binary search for `h` should cap at `mountainHeight`.
//
// Inside `canAchieve(T)`:
// `low_h = 0, high_h = mountainHeight + 1;` // The max height we need a single worker to contribute is `mountainHeight`.
// If a worker can reduce more than `mountainHeight` within time `T`, it means they can contribute `mountainHeight` towards the goal. So we can cap `h` at `mountainHeight`.
// `max_h_for_worker = 0;`
// while (`low_h < high_h`) {
//   `mid_h = low_h + (high_h - low_h) / 2;`
//   // Calculate time_needed: `(long long)w_time * mid_h * (mid_h + 1) / 2;`
//   // This calculation is safe as `w_time <= 10^6`, `mid_h <= 10^5+1`.
//   // `10^6 * (10^5+1) * (10^5+2) / 2 ≈ 10^6 * 10^{10} / 2 ≈ 0.5 * 10^{16}`. This is fine.
//   `long long time_needed = (long long)w_time * mid_h * (mid_h + 1) / 2;`
//   if (`time_needed <= T`) {
//     `max_h_for_worker = mid_h;`
//     `low_h = mid_h + 1;`
//   } else {
//     `high_h = mid_h;`
//   }
// }
// `total_h_reducible += max_h_for_worker;`
//
// Binary search range for `T`:
// `low_T = 0;`
// `high_T = 2e10;` // Let's use a generous upper bound. Max value is ~0.5e10.
// `ans_T = high_T;`
//
// Example: `mountainHeight = 4, workerTimes = [2,1,1]`
// `low_T = 0`, `high_T = 2e10`
// `mid_T = 1e10`. `canAchieve(1e10)` -> True. `ans_T = 1e10`, `high_T = 1e10 - 1`.
// ...
// Eventually, `mid_T = 3`.
// `canAchieve(3)`:
//   Worker 0 (w_time = 2):
//     BS for h in [0, 5].
//     h=1: time = 2 * 1 * 2 / 2 = 2 <= 3. max_h = 1. low_h = 2.
//     h=2: time = 2 * 2 * 3 / 2 = 6 > 3. high_h = 2.
//     loop ends. max_h_for_worker = 1.
//   Worker 1 (w_time = 1):
//     BS for h in [0, 5].
//     h=1: time = 1 * 1 * 2 / 2 = 1 <= 3. max_h = 1. low_h = 2.
//     h=2: time = 1 * 2 * 3 / 2 = 3 <= 3. max_h = 2. low_h = 3.
//     h=3: time = 1 * 3 * 4 / 2 = 6 > 3. high_h = 3.
//     loop ends. max_h_for_worker = 2.
//   Worker 2 (w_time = 1):
//     Same as Worker 1, max_h_for_worker = 2.
//   Total reducible = 1 + 2 + 2 = 5.
//   5 >= 4. Return true.
// `ans_T = 3`, `high_T = 2`.
//
// `mid_T = 1`. `canAchieve(1)`:
//   Worker 0 (w_time = 2):
//     BS for h in [0, 5].
//     h=1: time = 2 * 1 * 2 / 2 = 2 > 1. high_h = 1.
//     loop ends. max_h_for_worker = 0.
//   Worker 1 (w_time = 1):
//     BS for h in [0, 5].
//     h=1: time = 1 * 1 * 2 / 2 = 1 <= 1. max_h = 1. low_h = 2.
//     h=2: time = 1 * 2 * 3 / 2 = 3 > 1. high_h = 2.
//     loop ends. max_h_for_worker = 1.
//   Worker 2 (w_time = 1):
//     max_h_for_worker = 1.
//   Total reducible = 0 + 1 + 1 = 2.
//   2 < 4. Return false.
// `low_T = 2`.
//
// `mid_T = 2`. `canAchieve(2)`:
//   Worker 0 (w_time = 2):
//     BS for h in [0, 5].
//     h=1: time = 2 * 1 * 2 / 2 = 2 <= 2. max_h = 1. low_h = 2.
//     h=2: time = 2 * 2 * 3 / 2 = 6 > 2. high_h = 2.
//     loop ends. max_h_for_worker = 1.
//   Worker 1 (w_time = 1):
//     max_h_for_worker = 1.
//   Worker 2 (w_time = 1):
//     max_h_for_worker = 1.
//   Total reducible = 1 + 1 + 1 = 3.
//   3 < 4. Return false.
// `low_T = 3`.
//
// `low_T = 3, high_T = 2`. Loop ends.
// Return `ans_T = 3`. Correct for Example 1.

// Time complexity:
// Binary search for time `T`. Let the range be `[0, MAX_T]`. The number of iterations is `log(MAX_T)`.
// Inside `canAchieve(T)`: iterate through `N` workers (`workerTimes.length`).
// For each worker, binary search for height `h` in range `[0, mountainHeight]`. Number of iterations is `log(mountainHeight)`.
// Total Time Complexity: `O(log(MAX_T) * N * log(mountainHeight))`.
// `MAX_T` is roughly `5 * 10^9` or `10^{10}`. `log(10^{10})` is about 34.
// `N` is up to `10^4`. `mountainHeight` is up to `10^5`. `log(10^5)` is about 17.
// So, `34 * 10^4 * 17` operations, which is feasible.

// Space complexity: `O(1)` (excluding input storage).

// Let's refine `high_T` and `high_h` limits.
// `high_T`: Max height is `10^5`. Min `workerTimes[i]` is `1`. Time for `h=10^5` and `w_time=1` is `1 * 10^5 * (10^5 + 1) / 2 ≈ 5 * 10^9`.
// Let's set `high_T = 5e9 + 7` or `1e10`. `1e10` is safe.
// `high_h`: The maximum height a single worker might need to contribute is `mountainHeight`. If a worker can contribute more, it means they can cover the `mountainHeight` requirement. So, `mountainHeight + 1` is a sufficient upper bound for the binary search for `h`.
// Using `200001` is also fine, but `mountainHeight + 1` is more precise.

// `long long` should be used for `mid_T`, `low_T`, `high_T`, `ans_T`.
// `int` for `mid_h`, `low_h`, `high_h`, `max_h_for_worker`.
// `long long` for `total_h_reducible` to avoid overflow if many workers contribute height.
// `int` for `w_time` from `workerTimes` is fine.

#include <iostream>
#include <vector>
#include <numeric>
#include <algorithm>

class Solution {
public:
    // Helper function to check if a given time `T` is sufficient to reduce the mountain height to zero.
    // It calculates the maximum total height that can be reduced by all workers within time `T`.
    bool canAchieve(long long T, int mountainHeight, const std::vector<int>& workerTimes) {
        long long total_h_reducible = 0;

        // Iterate through each worker to calculate their maximum possible height reduction within time `T`.
        for (int w_time : workerTimes) {
            // We need to find the maximum integer `h` such that:
            // w_time * h * (h + 1) / 2 <= T
            // This inequality can be solved for `h` using binary search.
            // The range for `h` is [0, mountainHeight]. If a worker can reduce more than mountainHeight,
            // it means they can fully contribute to the goal, so capping `h` at mountainHeight is sufficient.
            int low_h = 0;
            int high_h = mountainHeight + 1; // Upper bound for height a single worker could contribute.
            int max_h_for_worker = 0; // Maximum height reducible by this worker within time T.

            while (low_h < high_h) {
                int mid_h = low_h + (high_h - low_h) / 2;

                // If mid_h is 0, time needed is 0. We always try to increase height.
                if (mid_h == 0) {
                    low_h = 1;
                    continue;
                }

                // Calculate the time required for this worker to reduce `mid_h` height.
                // The formula is `w_time * mid_h * (mid_h + 1) / 2`.
                // `w_time` up to 10^6, `mid_h` up to ~10^5.
                // `10^6 * 10^5 * (10^5 + 1) / 2 ≈ 0.5 * 10^16`, which fits in `long long`.
                long long time_needed = static_cast<long long>(w_time) * mid_h * (mid_h + 1) / 2;

                if (time_needed <= T) {
                    // If `mid_h` height is achievable within time `T`, store it and try to reduce more.
                    max_h_for_worker = mid_h;
                    low_h = mid_h + 1;
                } else {
                    // If `mid_h` height requires more than `T`, we must reduce the target height.
                    high_h = mid_h;
                }
            }
            total_h_reducible += max_h_for_worker;

            // Optimization: If we have already reduced enough height, we can stop early.
            if (total_h_reducible >= mountainHeight) {
                return true;
            }
        }

        // Return true if the total height reducible by all workers is greater than or equal to the mountain height.
        return total_h_reducible >= mountainHeight;
    }

    int minimumSeconds(int mountainHeight, std::vector<int>& workerTimes) {
        // The problem asks for the minimum time such that the total height can be reduced to zero.
        // This is a "minimize the maximum" problem, which can be solved using binary search on the answer (time).

        // Binary search range for the minimum time `T`.
        // Lower bound `low_T`: 0 seconds.
        // Upper bound `high_T`: A safe upper bound. The maximum possible time occurs when a single worker
        // with `workerTimes[i]=1` reduces the maximum `mountainHeight=10^5`.
        // Time = `1 * 10^5 * (10^5 + 1) / 2 ≈ 5 * 10^9`.
        // We set a generous upper bound like `10^10` or `2 * 10^10` to be safe.
        long long low_T = 0;
        long long high_T = 2e10; // A generous upper bound for the minimum time.
        long long min_seconds = high_T; // Initialize with the upper bound.

        // Perform binary search for the minimum time.
        while (low_T <= high_T) {
            long long mid_T = low_T + (high_T - low_T) / 2;

            // Check if `mid_T` is sufficient time to reduce the mountain height.
            if (canAchieve(mid_T, mountainHeight, workerTimes)) {
                // If `mid_T` is achievable, it's a potential answer.
                // We try to find an even smaller time, so we move the upper bound.
                min_seconds = mid_T;
                high_T = mid_T - 1;
            } else {
                // If `mid_T` is not sufficient, we need more time.
                // Move the lower bound up.
                low_T = mid_T + 1;
            }
        }

        return static_cast<int>(min_seconds);
    }
};
```