```java
// Problem: Minimum Number of Seconds to Make Mountain Height Zero
// Link: https://leetcode.com/problems/minimum-number-of-seconds-to-make-mountain-height-zero/
//
// Approach:
// This problem asks for the minimum time required for a group of workers to reduce a mountain's height to zero.
// Each worker `i` has a base work time `workerTimes[i]`. To reduce the mountain by `x` units, worker `i` takes
// `workerTimes[i] + 2*workerTimes[i] + ... + x*workerTimes[i]` seconds. This sum is equivalent to `workerTimes[i] * (1 + 2 + ... + x)`,
// which simplifies to `workerTimes[i] * x * (x + 1) / 2`.
//
// The workers work simultaneously, meaning the total time taken is determined by the worker who takes the longest.
// Our goal is to assign heights to be reduced by each worker such that the maximum time taken by any worker is minimized.
// This is a classic optimization problem that can be solved using binary search on the answer (the minimum time).
//
// For a given `time` (our candidate for the minimum seconds), we need to check if it's possible to reduce the entire
// `mountainHeight` using all workers within this `time`.
//
// To check if a `time` is feasible:
// For each worker `i`, we need to find the maximum height `x` they can reduce within `time`.
// The time taken by worker `i` to reduce height `x` is `workerTimes[i] * x * (x + 1) / 2`.
// We need to find the largest `x` such that `workerTimes[i] * x * (x + 1) / 2 <= time`.
// This inequality can be rewritten as `x * (x + 1) <= 2 * time / workerTimes[i]`.
// Since `x * (x + 1)` is an increasing function for positive `x`, we can use binary search (or a direct mathematical approach)
// to find the maximum `x` for each worker.
//
// The total height reducible by all workers within `time` is the sum of the maximum `x` each worker can achieve.
// If this total reducible height is greater than or equal to `mountainHeight`, then `time` is a feasible solution.
//
// Binary Search Range:
// Lower bound: 0 seconds (theoretically, though practically we'll use a small positive value).
// Upper bound: A safe upper bound could be `mountainHeight * max(workerTimes)`. A more refined upper bound:
// If one worker reduces the entire height, the time would be `workerTimes[i] * mountainHeight * (mountainHeight + 1) / 2`.
// So, `mountainHeight * 10^6 * (10^5 + 1) / 2` is a loose but safe upper bound.
//
// Algorithm:
// 1. Initialize `low = 0` and `high = a sufficiently large number` (e.g., `2 * 10^11` considering constraints).
// 2. While `low <= high`:
//    a. Calculate `mid = low + (high - low) / 2`.
//    b. Check if `mid` is a feasible time:
//       i. Initialize `totalReducibleHeight = 0`.
//       ii. For each `workerTime` in `workerTimes`:
//           - Find the maximum `x` such that `workerTime * x * (x + 1) / 2 <= mid`.
//           - This can be done by solving the quadratic equation or using binary search for `x`.
//           - A simpler approach to find `x`: `x * (x + 1) <= 2 * mid / workerTime`.
//             Let `target = 2 * mid / workerTime`. We need to find max `x` such that `x*(x+1) <= target`.
//             Since `x*(x+1)` is roughly `x^2`, we can approximate `x = sqrt(target)`.
//             We can then perform a small binary search around `sqrt(target)` or check integer values near it to find the exact `x`.
//             Alternatively, a direct binary search for `x` in the range [0, mountainHeight] is also feasible.
//             Let's use binary search for `x` for each worker. The range for `x` can be up to `mountainHeight`.
//             `low_x = 0`, `high_x = mountainHeight`.
//             While `low_x <= high_x`:
//                 `mid_x = low_x + (high_x - low_x) / 2`
//                 `time_needed = (long)workerTime * mid_x * (mid_x + 1) / 2`
//                 If `time_needed <= mid`: `can_reduce_this_much = mid_x; low_x = mid_x + 1`
//                 Else: `high_x = mid_x - 1`
//           - Add `can_reduce_this_much` to `totalReducibleHeight`.
//       iii. If `totalReducibleHeight >= mountainHeight`: `mid` is feasible, try smaller times. `ans = mid`, `high = mid - 1`.
//       iv. Else: `mid` is not feasible, need more time. `low = mid + 1`.
// 3. Return `ans`.
//
// Optimization for finding `x`:
// The equation `workerTime * x * (x + 1) / 2 <= time` can be approximated.
// `x^2 * workerTime <= 2 * time`
// `x^2 <= 2 * time / workerTime`
// `x <= sqrt(2 * time / workerTime)`
// So, `x` will be around `sqrt(2 * time / workerTime)`. We can do a binary search for `x` in the range `[0, mountainHeight]`.
//
// For calculating `x` for a given `workerTime` and `time`:
// We need to find the maximum `x` such that `x * (x + 1) <= 2 * time / workerTime`.
// Let `RHS = 2 * time / workerTime`.
// We are looking for the largest `x` such that `x * (x + 1) <= RHS`.
// We can binary search for `x` in the range `[0, mountainHeight]`.
//
// Let's refine the binary search for `x` within the `check` function:
// `max_x_for_worker(workerTime, time_limit)`:
//   `low_x = 0`, `high_x = mountainHeight` (or a tighter upper bound like `sqrt(2*time_limit/min_worker_time)` if `time_limit` is large enough)
//   `max_height_reducible = 0`
//   While `low_x <= high_x`:
//     `mid_x = low_x + (high_x - low_x) / 2`
//     If `mid_x == 0`: // Special case for x=0, takes 0 time
//       `time_needed = 0`
//     Else:
//       // Calculate time_needed carefully to avoid overflow
//       // workerTime * mid_x * (mid_x + 1) / 2
//       // We need to check if `mid_x * (mid_x + 1) / 2` can be computed without overflow
//       // Max value of mid_x can be mountainHeight (10^5).
//       // max value of mid_x * (mid_x + 1) / 2 is approx (10^5)^2 / 2 = 5 * 10^9
//       // This fits into a long.
//       // workerTime can be up to 10^6.
//       // workerTime * (mid_x * (mid_x + 1) / 2) can be up to 10^6 * 5 * 10^9 = 5 * 10^15, which fits into long.
//       `long reduction_factor = (long)mid_x * (mid_x + 1) / 2;`
//       `long time_needed = (long)workerTime * reduction_factor;`
//
//     If `time_needed <= time_limit`:
//       `max_height_reducible = mid_x;` // This height is achievable
//       `low_x = mid_x + 1;`          // Try to achieve more height
//     Else:
//       `high_x = mid_x - 1;`         // This height is too much
//   Return `max_height_reducible`.
//
// The `check` function would then sum up `max_x_for_worker` for all workers and see if it meets `mountainHeight`.
//
// Time Complexity:
// The binary search for the answer runs `log(MaxTime)` iterations.
// Inside each iteration, we iterate through `N` workers (where `N = workerTimes.length`).
// For each worker, we perform a binary search for the height `x` they can reduce. This binary search runs `log(mountainHeight)` iterations.
// So, the total time complexity is `O(log(MaxTime) * N * log(mountainHeight))`.
// `MaxTime` can be up to `10^5 * 10^6 * (10^5+1)/2` which is roughly `5 * 10^16`. `log(5*10^16)` is around 56.
// `log(mountainHeight)` is `log(10^5)` which is around 17.
// So, roughly `56 * 10^4 * 17` operations. This should be acceptable.
//
// Let's choose `MaxTime` upper bound carefully.
// Max time for one worker reducing all height: `10^6 * 10^5 * (10^5 + 1) / 2 ≈ 5 * 10^15`.
// A safe upper bound for binary search on time: `5 * 10^15`.
//
// Upper bound for `x` in `max_x_for_worker`: `mountainHeight` is a safe bet.
//
// Space Complexity:
// `O(1)` (excluding input storage).
class Solution {
    /**
     * Calculates the minimum number of seconds required to make the mountain height zero.
     * The problem is solved using binary search on the answer (minimum time).
     * For a given time `t`, we check if all workers collectively can reduce the mountain's height to zero.
     * Each worker `i` with time `workerTimes[i]` can reduce a height `x` in `workerTimes[i] * x * (x + 1) / 2` seconds.
     * We find the maximum `x` for each worker such that the time taken is less than or equal to `t`.
     * If the sum of these maximum `x` values for all workers is >= `mountainHeight`, then `t` is a feasible time.
     *
     * Time Complexity: O(log(MaxTotalTime) * N * log(mountainHeight))
     *   - log(MaxTotalTime): The range of possible times. Max time can be roughly mountainHeight * max(workerTimes) * mountainHeight.
     *     A loose upper bound for time is around 10^5 * 10^6 * 10^5 / 2 ≈ 5 * 10^15. log(5*10^15) is around 53.
     *   - N: The number of workers (workerTimes.length). Up to 10^4.
     *   - log(mountainHeight): The binary search for the maximum height a worker can reduce. Up to log(10^5) ≈ 17.
     *   Total operations: ~53 * 10^4 * 17, which is feasible.
     *
     * Space Complexity: O(1) (excluding input storage).
     */
    public long minimumSeconds(int mountainHeight, int[] workerTimes) {
        // Binary search for the minimum time required.
        // `low` is the minimum possible time (0).
        // `high` is a generous upper bound for the time.
        // A single worker reducing the entire mountain could take:
        // workerTime * mountainHeight * (mountainHeight + 1) / 2
        // With max workerTime (10^6) and max mountainHeight (10^5), this is roughly:
        // 10^6 * 10^5 * (10^5 + 1) / 2 ≈ 5 * 10^15.
        long low = 0;
        long high = 5_000_000_000_000_000L; // A sufficiently large upper bound.
        long ans = high; // Initialize answer to the upper bound.

        while (low <= high) {
            long mid = low + (high - low) / 2; // Candidate time
            // Check if this `mid` time is sufficient to reduce the mountain to 0.
            if (canReduceToZero(mountainHeight, workerTimes, mid)) {
                ans = mid;         // `mid` is a possible answer, try for a smaller time.
                high = mid - 1;
            } else {
                low = mid + 1;     // `mid` is not enough, need more time.
            }
        }
        return ans;
    }

    /**
     * Checks if it's possible to reduce the mountain's height to zero within a given time.
     *
     * @param mountainHeight The initial height of the mountain.
     * @param workerTimes    An array where workerTimes[i] is the base work time of worker i.
     * @param timeLimit      The maximum time allowed.
     * @return true if the mountain can be reduced to zero within `timeLimit`, false otherwise.
     */
    private boolean canReduceToZero(int mountainHeight, int[] workerTimes, long timeLimit) {
        long totalReducibleHeight = 0;
        for (int workerTime : workerTimes) {
            // For each worker, find the maximum height they can reduce within `timeLimit`.
            totalReducibleHeight += getMaxHeightReducibleByWorker(workerTime, timeLimit, mountainHeight);
            // If the total reducible height already exceeds the mountain height, we can stop early.
            if (totalReducibleHeight >= mountainHeight) {
                return true;
            }
        }
        // If after checking all workers, the total reducible height is still less than the mountain height,
        // then `timeLimit` is not sufficient.
        return totalReducibleHeight >= mountainHeight;
    }

    /**
     * Calculates the maximum height a single worker can reduce within a given time limit.
     * The time taken by a worker to reduce height `x` is `workerTime * x * (x + 1) / 2`.
     * We need to find the maximum `x` such that `workerTime * x * (x + 1) / 2 <= timeLimit`.
     * This is done using binary search for `x`.
     *
     * @param workerTime The base work time of the worker.
     * @param timeLimit  The maximum time allowed for this worker.
     * @param maxPossibleHeight The maximum possible height a worker might need to reduce (which is `mountainHeight`).
     * @return The maximum height this worker can reduce within `timeLimit`.
     */
    private long getMaxHeightReducibleByWorker(int workerTime, long timeLimit, int maxPossibleHeight) {
        // Binary search for the maximum height `x` this worker can reduce.
        // The search space for `x` is from 0 up to `maxPossibleHeight` (the entire mountain).
        long lowX = 0;
        long highX = maxPossibleHeight;
        long maxReducibleHeight = 0; // Stores the maximum height found so far.

        while (lowX <= highX) {
            long midX = lowX + (highX - lowX) / 2; // Candidate height to reduce.

            // Calculate the time needed by this worker to reduce `midX` height.
            // Time = workerTime * (1 + 2 + ... + midX) = workerTime * midX * (midX + 1) / 2
            // Use long for calculations to prevent overflow.
            long reductionFactor = midX * (midX + 1) / 2;
            // If midX is 0, reductionFactor is 0, and time_needed is 0. This is handled correctly by the formula.
            // Check for potential overflow before multiplication if workerTime is extremely large and reductionFactor is large.
            // In this problem, max workerTime = 10^6, max midX ≈ 10^5.
            // reductionFactor ≈ (10^5)^2 / 2 = 5 * 10^9.
            // time_needed ≈ 10^6 * 5 * 10^9 = 5 * 10^15, which fits within `long`.

            long timeNeeded;
            // Handle midX = 0 explicitly to avoid potential division by zero if not using long for reductionFactor calculation.
            // However, with `long reductionFactor = midX * (midX + 1) / 2;`, midX=0 results in reductionFactor=0, which is correct.
            if (midX == 0) {
                timeNeeded = 0;
            } else {
                 // Ensure reductionFactor calculation doesn't overflow before multiplying with workerTime.
                 // However, given the constraints, `midX * (midX + 1) / 2` will fit in `long`.
                 // And `workerTime * reductionFactor` will also fit in `long`.
                 // For safety, we can check for intermediate overflows if constraints were tighter.
                 // Example: If workerTime is 10^9 and reductionFactor is 10^9, their product would overflow.
                 // Here, max workerTime is 10^6, max reductionFactor is ~5*10^9. Product is ~5*10^15, which is fine.
                timeNeeded = (long) workerTime * reductionFactor;
            }

            if (timeNeeded <= timeLimit) {
                // This height `midX` is achievable within the time limit.
                maxReducibleHeight = midX; // Update the maximum achievable height.
                lowX = midX + 1;          // Try to reduce even more height.
            } else {
                // This height `midX` is too much; it takes longer than `timeLimit`.
                highX = midX - 1;         // Need to aim for a smaller height.
            }
        }
        return maxReducibleHeight;
    }
}
```