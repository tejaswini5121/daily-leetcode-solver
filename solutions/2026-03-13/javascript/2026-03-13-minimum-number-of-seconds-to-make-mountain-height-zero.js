/**
 * @file LeetCode Problem: Minimum Number of Seconds to Make Mountain Height Zero
 * @summary Calculates the minimum time required for workers to reduce a mountain's height to zero.
 * @link https://leetcode.com/problems/minimum-number-of-seconds-to-make-mountain-height-zero/
 *
 * @approach
 * The problem asks for the minimum time to make the mountain height zero. This implies we need to find the maximum time any worker takes to complete their assigned height reduction. Since workers work in parallel, the total time is determined by the slowest worker.
 *
 * The time taken by a worker to reduce the mountain's height by `x` is `workerTimes[i] * (1 + 2 + ... + x)`. The sum `1 + 2 + ... + x` is `x * (x + 1) / 2`. So, the time is `workerTimes[i] * x * (x + 1) / 2`.
 *
 * We want to minimize the maximum of these times across all workers, subject to the constraint that the sum of the heights reduced by all workers equals `mountainHeight`.
 *
 * This problem can be framed as a binary search problem on the answer (the minimum time). If a certain time `T` is achievable, it means we can assign heights to workers such that for each worker `i`, they reduce height `x_i` and the time taken `workerTimes[i] * x_i * (x_i + 1) / 2 <= T`, and the sum of all `x_i` equals `mountainHeight`.
 *
 * For a given time `T` and a worker `i` with time `workerTimes[i]`, we can find the maximum height `x_i` this worker can reduce within time `T`. The equation is `workerTimes[i] * x_i * (x_i + 1) / 2 <= T`. We can solve for `x_i` (approximately, or by finding the largest integer `x_i` satisfying the inequality). This is equivalent to finding the largest `x_i` such that `x_i * (x_i + 1) <= 2 * T / workerTimes[i]`.
 *
 * The function `canAchieve(time)` will calculate the maximum total height that can be reduced by all workers within the given `time`. If this total height is greater than or equal to `mountainHeight`, then `time` is a feasible solution.
 *
 * The binary search will work on the range of possible times. The lower bound can be 0, and the upper bound can be estimated. A safe upper bound could be `mountainHeight * max(workerTimes)`, as in the worst case, one worker with the largest time might need to do all the work. A tighter upper bound could be derived from the constraints: `mountainHeight * max(workerTimes) * (mountainHeight + 1) / 2`. However, since `mountainHeight` is up to 10^5 and `workerTimes` up to 10^6, this can overflow. A more practical upper bound can be found by considering the single worker case: `max(workerTimes) * mountainHeight * (mountainHeight + 1) / 2`. A simpler safe upper bound can be `10^5 * 10^6 * (10^5+1)/2` which is roughly `5 * 10^15`.
 *
 * The `canAchieve(time)` function:
 * For each worker `i`, we want to find the maximum `x_i` such that `workerTimes[i] * x_i * (x_i + 1) / 2 <= time`.
 * This is equivalent to `x_i * (x_i + 1) <= 2 * time / workerTimes[i]`.
 * Let `target = 2 * time / workerTimes[i]`. We need to find the largest `x_i` such that `x_i * (x_i + 1) <= target`.
 * This can be found using binary search for `x_i` or by approximating `x_i^2 \approx target`, so `x_i \approx sqrt(target)`. We can then check values around `sqrt(target)`.
 * A more robust approach within `canAchieve` is to find `x_i` for each worker.
 * For a worker with time `t = workerTimes[i]`:
 * The time taken to reduce height `x` is `t * x * (x + 1) / 2`.
 * We need to find the max `x` such that `t * x * (x + 1) / 2 <= time`.
 * `x * (x + 1) <= 2 * time / t`.
 * If `2 * time / t` is negative (which shouldn't happen with positive `time` and `t`), then `x` must be 0.
 * Otherwise, we are looking for the largest integer `x` such that `x^2 + x - (2 * time / t) <= 0`.
 * The roots of `x^2 + x - C = 0` are `x = (-1 ± sqrt(1 + 4C)) / 2`.
 * We are interested in the positive root: `x = (-1 + sqrt(1 + 8 * time / t)) / 2`.
 * The largest integer `x` will be `floor((-1 + sqrt(1 + 8 * time / t)) / 2)`.
 *
 * Alternatively, we can use binary search to find `x_i` for each worker. For a worker with time `w_i`, we are searching for `x` in the range `[0, mountainHeight]` (or even larger, `mountainHeight` is a safe upper bound for individual `x_i` if the total sum is `mountainHeight`).
 * The function to check for `x_i` within `canAchieve` would be:
 * `checkX(workerTime, targetTime)`: Binary search for `x` in `[0, mountainHeight+1]`.
 *   `mid = low + (high - low) / 2`
 *   `cost = workerTime * mid * (mid + 1) / 2`
 *   If `cost <= targetTime`, then `mid` might be achievable, try larger `x` (`low = mid + 1`).
 *   If `cost > targetTime`, `mid` is too much, try smaller `x` (`high = mid - 1`).
 *
 * Sum of all `x_i` obtained from `canAchieve` should be compared with `mountainHeight`.
 *
 * Binary search range for time: `[0, 5 * 10^15]` is a safe upper bound.
 * `low = 0`, `high = 1e16` (a slightly larger safe bound to avoid precision issues with `10^15` for `long long` in other languages, though JavaScript numbers can handle larger).
 *
 * Let's refine the upper bound calculation.
 * In the worst case, one worker with `workerTimes[i] = 1` has to reduce `mountainHeight`.
 * The time would be `1 * mountainHeight * (mountainHeight + 1) / 2`.
 * With `mountainHeight = 10^5`, this is approx `10^5 * 10^5 / 2 = 5 * 10^9`.
 * If `workerTimes[i] = 10^6`, and `mountainHeight = 1`, the time is `10^6 * 1 * 2 / 2 = 10^6`.
 * If `workerTimes[i] = 10^6` and `mountainHeight = 10^5`, and this is the only worker, the time would be `10^6 * 10^5 * (10^5+1) / 2`, which is roughly `5 * 10^15`.
 * So, `1e16` is a reasonable upper bound.
 *
 * `canAchieve(totalTime)`:
 *   `totalHeightReduced = 0`
 *   For each `workerTime` in `workerTimes`:
 *     Calculate max `h` for this worker such that `workerTime * h * (h + 1) / 2 <= totalTime`.
 *     Use binary search for `h` in range `[0, mountainHeight + 1]`.
 *     `low_h = 0`, `high_h = mountainHeight + 1`
 *     `max_h_for_worker = 0`
 *     While `low_h <= high_h`:
 *       `mid_h = Math.floor(low_h + (high_h - low_h) / 2)`
 *       If `mid_h == 0`: // Base case, cost is 0
 *         `cost = 0`
 *       Else:
 *         // Prevent overflow for mid_h * (mid_h + 1)
 *         // Check if mid_h is too large to potentially cause overflow when multiplied by workerTime
 *         // Approximate check: if mid_h > 2*10^9, mid_h*(mid_h+1) can exceed Number.MAX_SAFE_INTEGER.
 *         // However, mountainHeight is at most 10^5, so mid_h is at most ~10^5.
 *         // workerTime is at most 10^6.
 *         // workerTime * mid_h * (mid_h + 1) / 2
 *         // Max value: 10^6 * 10^5 * (10^5+1) / 2 ~ 5 * 10^15. This is within JavaScript's Number limits.
 *         `cost = workerTime * mid_h * (mid_h + 1) / 2`
 *
 *       If `cost <= totalTime`:
 *         `max_h_for_worker = mid_h`
 *         `low_h = mid_h + 1` // Try to achieve more height
 *       Else:
 *         `high_h = mid_h - 1` // Too much time, reduce height
 *
 *     `totalHeightReduced += max_h_for_worker`
 *     // Optimization: if we already have enough height, we can break early
 *     if `totalHeightReduced >= mountainHeight`:
 *       return true
 *
 *   Return `totalHeightReduced >= mountainHeight`
 *
 * Binary Search for time:
 * `low = 0`, `high = 5e15` (approximate upper bound)
 * `ans = high`
 * While `low <= high`:
 *   `mid_time = Math.floor(low + (high - low) / 2)`
 *   If `canAchieve(mid_time)`:
 *     `ans = mid_time`
 *     `high = mid_time - 1` // Try to find a smaller time
 *   Else:
 *     `low = mid_time + 1` // Need more time
 *
 * Return `ans`
 *
 * Note on `mid_h * (mid_h + 1) / 2`:
 * When `mid_h` is large, `mid_h * (mid_h + 1)` can potentially exceed `Number.MAX_SAFE_INTEGER` if `mid_h` is around `10^8`. However, `mid_h` is bounded by `mountainHeight`, which is `10^5`.
 * So, `mid_h * (mid_h + 1)` is at most `10^5 * (10^5 + 1) \approx 10^{10}`. This is well within `Number.MAX_SAFE_INTEGER`.
 * Then `workerTime * mid_h * (mid_h + 1) / 2`. Max `workerTime` is `10^6`.
 * So, `10^6 * 10^{10} / 2 \approx 5 \times 10^{15}`. This is also within `Number.MAX_SAFE_INTEGER` (which is about `9 \times 10^{15}`).
 *
 * The upper bound for binary search `high` can be safely set to `5e15`.
 *
 * Time Complexity:
 * The outer binary search for time performs `log(MaxTime)` iterations. `MaxTime` is roughly `5e15`. So `log(5e15)` is about `log(10^16)` which is around `16 * log(10) \approx 16 * 3.32 \approx 53` iterations.
 * Inside the `canAchieve` function, we iterate through `N` workers (where `N` is `workerTimes.length`).
 * For each worker, we perform a binary search to find the maximum height they can reduce. This binary search is on the height, which is bounded by `mountainHeight` (or `mountainHeight + 1`). So, this inner binary search takes `log(mountainHeight)` iterations.
 * Total time complexity = `O(log(MaxTime) * N * log(mountainHeight))`.
 * Given constraints: `N <= 10^4`, `mountainHeight <= 10^5`.
 * `log(5e15) * 10^4 * log(10^5) \approx 53 * 10^4 * 17 \approx 9 \times 10^6` operations, which is feasible within typical time limits.
 *
 * Space Complexity:
 * `O(1)` (excluding input storage), as we only use a few variables for binary search and calculations.
 */
function minSeconds(mountainHeight, workerTimes) {

    // Helper function to calculate the time cost for a worker to reduce height 'h'
    // Cost = workerTime * (1 + 2 + ... + h) = workerTime * h * (h + 1) / 2
    // This function handles potential overflow issues by careful multiplication order
    // and checking intermediate results against MAX_SAFE_INTEGER if necessary.
    // However, given the constraints (workerTime <= 10^6, h <= 10^5),
    // workerTime * h * (h+1) / 2 will be at most ~5e15, which is safe in JS.
    const calculateCost = (workerTime, h) => {
        if (h <= 0) return 0;
        // Ensure intermediate calculations are safe.
        // h * (h + 1) can be up to ~10^10, which is safe.
        // workerTime * h * (h+1) can be up to ~10^6 * 10^10 = 10^16.
        // Dividing by 2 brings it down to ~5e15, which is safe within JS Number limits.
        // Using BigInt would be safer if constraints were larger.
        return (workerTime * h * (h + 1)) / 2;
    };

    // Function to check if it's possible to reduce mountainHeight to 0 within 'totalTime'
    const canAchieve = (totalTime) => {
        let totalHeightReduced = 0;

        for (const workerTime of workerTimes) {
            // For the current worker, find the maximum height 'h' they can reduce
            // within 'totalTime'.
            // We use binary search for 'h'. The range for 'h' is [0, mountainHeight + 1].
            // An upper bound of mountainHeight + 1 is sufficient because if a single worker
            // had to reduce the entire mountain, they would reduce at most mountainHeight.
            let low_h = 0;
            let high_h = mountainHeight + 1; // Search up to a height slightly more than mountainHeight
            let max_h_for_worker = 0;

            while (low_h <= high_h) {
                let mid_h = Math.floor(low_h + (high_h - low_h) / 2);

                // Calculate the cost for this worker to reduce 'mid_h' height.
                // Using the helper function to ensure safety, though direct calculation is safe here.
                const cost = calculateCost(workerTime, mid_h);

                if (cost <= totalTime) {
                    // If the cost is within the allowed time, this height 'mid_h' is achievable.
                    // Store it and try to achieve an even greater height.
                    max_h_for_worker = mid_h;
                    low_h = mid_h + 1;
                } else {
                    // If the cost exceeds the allowed time, 'mid_h' is too high.
                    // Reduce the search space to lower heights.
                    high_h = mid_h - 1;
                }
            }
            // Add the maximum height this worker can reduce to the total.
            totalHeightReduced += max_h_for_worker;

            // Optimization: If we have already accumulated enough height, we can stop checking other workers.
            if (totalHeightReduced >= mountainHeight) {
                return true;
            }
        }

        // Return true if the total height reduced by all workers is enough to cover mountainHeight.
        return totalHeightReduced >= mountainHeight;
    };

    // Binary search for the minimum time required.
    // The lower bound for time is 0.
    // The upper bound can be estimated. In the worst case, one worker with the largest time
    // might need to reduce the entire mountain.
    // If workerTime is 10^6 and mountainHeight is 10^5, the time could be ~10^6 * 10^5 * (10^5+1)/2 ~ 5e15.
    // We use 5e15 as a safe upper bound.
    let low_time = 0;
    let high_time = 5e15; // A sufficiently large upper bound
    let min_seconds_required = high_time;

    while (low_time <= high_time) {
        // Calculate the middle time to check.
        let mid_time = Math.floor(low_time + (high_time - low_time) / 2);

        // Check if it's possible to achieve the mountainHeight in 'mid_time'.
        if (canAchieve(mid_time)) {
            // If achievable, 'mid_time' is a possible answer.
            // Store it and try to find an even smaller time.
            min_seconds_required = mid_time;
            high_time = mid_time - 1;
        } else {
            // If not achievable, we need more time.
            // Increase the lower bound of our search.
            low_time = mid_time + 1;
        }
    }

    // The binary search will converge to the minimum time.
    return min_seconds_required;
}
