// /**
//  * @param {number[]} landStartTime
//  * @param {number[]} landDuration
//  * @param {number[]} waterStartTime
//  * @param {number[]} waterDuration
//  * @return {number}
//  */
// Problem: Earliest Finish Time for Land and Water Rides II
// Link: https://leetcode.com/problems/earliest-finish-time-for-land-and-water-rides-ii/
//
// Approach:
// The problem requires finding the minimum time to complete one land ride and one water ride.
// There are two possible sequences: land ride first, then water ride, or water ride first, then land ride.
// For each sequence, we need to consider all possible pairs of land and water rides.
//
// Let's consider the sequence: Land Ride -> Water Ride.
// For a specific land ride `i` and water ride `j`:
// - The land ride starts at `landStartTime[i]`.
// - It finishes at `landFinishTime = landStartTime[i] + landDuration[i]`.
// - The water ride can start at the maximum of its opening time and the finish time of the land ride: `waterStartTime[j]` or `landFinishTime`. So, `waterStartTimeActual = max(waterStartTime[j], landFinishTime)`.
// - The water ride finishes at `waterFinishTime = waterStartTimeActual + waterDuration[j]`.
// - The total finish time for this pair is `waterFinishTime`.
//
// We want to minimize this `waterFinishTime` across all possible `i` and `j`.
//
// To optimize, we can fix one ride (e.g., the land ride) and efficiently find the best water ride to pair with it.
// If we iterate through each land ride `i`, we need to find a water ride `j` that minimizes `max(waterStartTime[j], landStartTime[i] + landDuration[i]) + waterDuration[j]`.
//
// This expression can be broken down:
// `max(waterStartTime[j] + waterDuration[j], landStartTime[i] + landDuration[i] + waterDuration[j])`
//
// Let `landFinishTime = landStartTime[i] + landDuration[i]`.
// We want to minimize `max(waterStartTime[j] + waterDuration[j], landFinishTime + waterDuration[j])`.
//
// This is equivalent to minimizing `max(waterFinishTime_j, landFinishTime + waterDuration[j])`, where `waterFinishTime_j = waterStartTime[j] + waterDuration[j]`.
//
// If we sort the water rides by their start times, we can potentially use a two-pointer or binary search approach.
//
// Let's define two helper functions:
// 1. `solve(rides1_start, rides1_duration, rides2_start, rides2_duration)`: Calculates the minimum finish time when the first category of rides is taken, followed by the second category.
//
// Inside `solve(rides1_start, rides1_duration, rides2_start, rides2_duration)`:
// - Combine start and duration for rides of the second category into objects like `{ startTime: duration_time, duration: duration_val }`.
// - Sort these objects by `startTime`.
// - Precompute suffix minimums for `startTime[k] + duration[k]`. Let this be `min_finish_time_from_k`.
// - Iterate through each ride `i` in `rides1`.
// - Calculate `finish1 = rides1_start[i] + rides1_duration[i]`.
// - We need to find a ride `j` in `rides2` that minimizes `max(rides2_start[j], finish1) + rides2_duration[j]`.
// - This is `max(rides2_start[j] + rides2_duration[j], finish1 + rides2_duration[j])`.
// - The term `rides2_start[j] + rides2_duration[j]` is the inherent finish time of ride `j`.
// - The term `finish1 + rides2_duration[j]` is the finish time if ride `j` starts exactly after ride `i` finishes.
//
// To efficiently find the best `j` for a given `finish1`:
// We are looking for `j` to minimize `max(rides2_start[j] + rides2_duration[j], finish1 + rides2_duration[j])`.
// Let `W_j = rides2_start[j]` and `D_j = rides2_duration[j]`. We want to minimize `max(W_j + D_j, finish1 + D_j)`.
//
// Consider `rides2` sorted by `W_j`.
// For a fixed `finish1`, we can use binary search on `rides2` to find the point where `W_j <= finish1`.
// - For `j` where `W_j <= finish1`: The start time is `finish1`. The finish time is `finish1 + D_j`. We want to minimize `finish1 + D_j`, which means minimizing `D_j`.
// - For `j` where `W_j > finish1`: The start time is `W_j`. The finish time is `W_j + D_j`. We want to minimize `W_j + D_j`.
//
// This suggests sorting `rides2` by start times.
// Let's define `rides2_data = [{ startTime: W_j, duration: D_j, finishTime: W_j + D_j }]` and sort `rides2_data` by `startTime`.
//
// For each `ride1` in `rides1`:
//   `finish1 = ride1.startTime + ride1.duration`.
//   We need to find `ride2` in `rides2_data` to minimize `max(ride2.startTime, finish1) + ride2.duration`.
//   This is `max(ride2.startTime + ride2.duration, finish1 + ride2.duration)`.
//
//   Let's use binary search to find the index `k` in `rides2_data` such that `rides2_data[k].startTime <= finish1` and `rides2_data[k+1].startTime > finish1`.
//   - For rides `j` where `rides2_data[j].startTime <= finish1`: The earliest we can start is `finish1`. The finish time is `finish1 + rides2_data[j].duration`. To minimize this, we need the minimum `rides2_data[j].duration` among these rides.
//   - For rides `j` where `rides2_data[j].startTime > finish1`: The earliest we can start is `rides2_data[j].startTime`. The finish time is `rides2_data[j].startTime + rides2_data[j].duration`. We need to find the minimum `rides2_data[j].startTime + rides2_data[j].duration` among these rides.
//
//   This structure suggests precomputing prefix minimums of durations and suffix minimums of finish times.
//
// Let's refine the `solve` function:
// `solve(rides1_start, rides1_duration, rides2_start, rides2_duration)`:
// 1. Create `rides2_processed = []`. For each `j`, push `{ startTime: rides2_start[j], duration: rides2_duration[j], finishTime: rides2_start[j] + rides2_duration[j] }`.
// 2. Sort `rides2_processed` by `startTime`.
// 3. Create `rides2_prefix_min_duration = []`. Initialize with infinity. For each `k` from 0 to `rides2_processed.length - 1`, `rides2_prefix_min_duration[k] = min(rides2_prefix_min_duration[k-1] or infinity, rides2_processed[k].duration)`.
// 4. Create `rides2_suffix_min_finish = []`. Initialize with infinity. For each `k` from `rides2_processed.length - 1` down to 0, `rides2_suffix_min_finish[k] = min(rides2_suffix_min_finish[k+1] or infinity, rides2_processed[k].finishTime)`.
//
// 5. Initialize `min_total_finish_time = Infinity`.
// 6. Iterate through each `ride1` with `start1 = rides1_start[i]` and `duration1 = rides1_duration[i]`.
//    `finish1 = start1 + duration1`.
//
//    Now, we need to find the best `ride2` from `rides2_processed`.
//    We can use binary search on `rides2_processed` to find the index `idx` such that `rides2_processed[idx].startTime <= finish1` and `rides2_processed[idx+1].startTime > finish1` (if `idx+1` exists).
//    `upper_bound(rides2_processed, finish1, key=lambda x: x.startTime)` will give us the index of the first element whose startTime is strictly greater than `finish1`. Let this be `insertion_point`.
//
//    Case 1: Rides `j` in `rides2_processed` where `startTime <= finish1`.
//    These are `rides2_processed[0]` to `rides2_processed[insertion_point - 1]`.
//    If `insertion_point > 0`:
//      The earliest we can start such a ride `j` is `finish1`.
//      The finish time is `finish1 + rides2_processed[j].duration`.
//      To minimize this, we need the minimum duration among these rides. This is `rides2_prefix_min_duration[insertion_point - 1]`.
//      `current_min_finish = finish1 + rides2_prefix_min_duration[insertion_point - 1]`.
//      `min_total_finish_time = min(min_total_finish_time, current_min_finish)`.
//
//    Case 2: Rides `j` in `rides2_processed` where `startTime > finish1`.
//    These are `rides2_processed[insertion_point]` to `rides2_processed[rides2_processed.length - 1]`.
//    If `insertion_point < rides2_processed.length`:
//      The earliest we can start such a ride `j` is `rides2_processed[j].startTime`.
//      The finish time is `rides2_processed[j].startTime + rides2_processed[j].duration`.
//      To minimize this, we need the minimum `finishTime` among these rides. This is `rides2_suffix_min_finish[insertion_point]`.
//      `current_min_finish = rides2_suffix_min_finish[insertion_point]`.
//      `min_total_finish_time = min(min_total_finish_time, current_min_finish)`.
//
// 7. Return `min_total_finish_time`.
//
// The overall solution will be `min(solve(landStartTime, landDuration, waterStartTime, waterDuration), solve(waterStartTime, waterDuration, landStartTime, landDuration))`.
//
// Binary search implementation detail:
// `upper_bound(arr, target, key_func)`: returns the index of the first element for which `key_func(element) > target`.
// If all elements satisfy `key_func(element) <= target`, it returns `arr.length`.
//
// Time Complexity:
// - Let `N` be the number of land rides and `M` be the number of water rides.
// - `solve` function:
//   - Processing rides2: O(M)
//   - Sorting rides2: O(M log M)
//   - Precomputing prefix min duration: O(M)
//   - Precomputing suffix min finish time: O(M)
//   - Iterating through rides1: O(N)
//   - Inside the loop, binary search on rides2: O(log M)
//   - Total for `solve`: O(M log M + N log M)
// - The overall complexity will be O(M log M + N log M + N log N + M log N).
// - If N and M are of similar magnitude, say `K`, then it's O(K log K).
//
// Space Complexity:
// - `rides2_processed`: O(M)
// - `rides2_prefix_min_duration`: O(M)
// - `rides2_suffix_min_finish`: O(M)
// - Overall space complexity is O(M) for each call to `solve`.
// - The overall space complexity is O(max(N, M)).
//
// Edge cases:
// - If `rides1` or `rides2` are empty, this problem statement says `1 <= n, m`. So, they won't be empty.
//
// Let's dry run Example 1:
// landStartTime = [2,8], landDuration = [4,1]
// waterStartTime = [6], waterDuration = [3]
//
// Call 1: solve(land, water)
//   rides1 = [{s: 2, d: 4}, {s: 8, d: 1}]
//   rides2 = [{s: 6, d: 3}]
//
//   rides2_processed = [{ startTime: 6, duration: 3, finishTime: 9 }]
//   Sorted rides2_processed = [{ startTime: 6, duration: 3, finishTime: 9 }]
//   rides2_prefix_min_duration = [3]
//   rides2_suffix_min_finish = [9]
//
//   Iterate through land rides:
//   1. ride1 = {s: 2, d: 4}. finish1 = 2 + 4 = 6.
//      Binary search on rides2_processed for value <= 6.
//      `insertion_point` (first element > 6) is 1.
//      Case 1: `insertion_point > 0` is true (1 > 0).
//         Consider `rides2_processed[0]` to `rides2_processed[0]`. (index 0 to 0)
//         Min duration = `rides2_prefix_min_duration[0]` = 3.
//         `current_min_finish = finish1 + min_duration = 6 + 3 = 9`.
//         `min_total_finish_time = min(Infinity, 9) = 9`.
//      Case 2: `insertion_point < rides2_processed.length` is false (1 < 1). Skip.
//
//   2. ride1 = {s: 8, d: 1}. finish1 = 8 + 1 = 9.
//      Binary search on rides2_processed for value <= 9.
//      `insertion_point` (first element > 9) is 1.
//      Case 1: `insertion_point > 0` is true (1 > 0).
//         Consider `rides2_processed[0]` to `rides2_processed[0]`. (index 0 to 0)
//         Min duration = `rides2_prefix_min_duration[0]` = 3.
//         `current_min_finish = finish1 + min_duration = 9 + 3 = 12`.
//         `min_total_finish_time = min(9, 12) = 9`.
//      Case 2: `insertion_point < rides2_processed.length` is false (1 < 1). Skip.
//
//   solve(land, water) returns 9.
//
// Call 2: solve(water, land)
//   rides1 = [{s: 6, d: 3}]
//   rides2 = [{s: 2, d: 4}, {s: 8, d: 1}]
//
//   rides2_processed = [{ startTime: 2, duration: 4, finishTime: 6 }, { startTime: 8, duration: 1, finishTime: 9 }]
//   Sorted rides2_processed = [{ startTime: 2, duration: 4, finishTime: 6 }, { startTime: 8, duration: 1, finishTime: 9 }]
//   rides2_prefix_min_duration = [4, min(4, 1)] = [4, 1]
//   rides2_suffix_min_finish = [min(6, 9), 9] = [6, 9]
//
//   Iterate through water rides:
//   1. ride1 = {s: 6, d: 3}. finish1 = 6 + 3 = 9.
//      Binary search on rides2_processed for value <= 9.
//      `insertion_point` (first element > 9) is 2.
//      Case 1: `insertion_point > 0` is true (2 > 0).
//         Consider `rides2_processed[0]` to `rides2_processed[1]`. (index 0 to 1)
//         Min duration = `rides2_prefix_min_duration[1]` = 1.
//         `current_min_finish = finish1 + min_duration = 9 + 1 = 10`.
//         `min_total_finish_time = min(Infinity, 10) = 10`.
//      Case 2: `insertion_point < rides2_processed.length` is false (2 < 2). Skip.
//
//   solve(water, land) returns 10.
//
// Final answer = min(9, 10) = 9. Correct for Example 1.
//
// Dry run Example 2:
// landStartTime = [5], landDuration = [3]
// waterStartTime = [1], waterDuration = [10]
//
// Call 1: solve(land, water)
//   rides1 = [{s: 5, d: 3}]
//   rides2 = [{s: 1, d: 10}]
//
//   rides2_processed = [{ startTime: 1, duration: 10, finishTime: 11 }]
//   Sorted rides2_processed = [{ startTime: 1, duration: 10, finishTime: 11 }]
//   rides2_prefix_min_duration = [10]
//   rides2_suffix_min_finish = [11]
//
//   Iterate through land rides:
//   1. ride1 = {s: 5, d: 3}. finish1 = 5 + 3 = 8.
//      Binary search on rides2_processed for value <= 8.
//      `insertion_point` (first element > 8) is 1.
//      Case 1: `insertion_point > 0` is true (1 > 0).
//         Consider `rides2_processed[0]` to `rides2_processed[0]`.
//         Min duration = `rides2_prefix_min_duration[0]` = 10.
//         `current_min_finish = finish1 + min_duration = 8 + 10 = 18`.
//         `min_total_finish_time = min(Infinity, 18) = 18`.
//      Case 2: `insertion_point < rides2_processed.length` is false (1 < 1). Skip.
//
//   solve(land, water) returns 18.
//
// Call 2: solve(water, land)
//   rides1 = [{s: 1, d: 10}]
//   rides2 = [{s: 5, d: 3}]
//
//   rides2_processed = [{ startTime: 5, duration: 3, finishTime: 8 }]
//   Sorted rides2_processed = [{ startTime: 5, duration: 3, finishTime: 8 }]
//   rides2_prefix_min_duration = [3]
//   rides2_suffix_min_finish = [8]
//
//   Iterate through water rides:
//   1. ride1 = {s: 1, d: 10}. finish1 = 1 + 10 = 11.
//      Binary search on rides2_processed for value <= 11.
//      `insertion_point` (first element > 11) is 1.
//      Case 1: `insertion_point > 0` is true (1 > 0).
//         Consider `rides2_processed[0]` to `rides2_processed[0]`.
//         Min duration = `rides2_prefix_min_duration[0]` = 3.
//         `current_min_finish = finish1 + min_duration = 11 + 3 = 14`.
//         `min_total_finish_time = min(Infinity, 14) = 14`.
//      Case 2: `insertion_point < rides2_processed.length` is false (1 < 1). Skip.
//
//   solve(water, land) returns 14.
//
// Final answer = min(18, 14) = 14. Correct for Example 2.
//
// Implementation of upper_bound:
// Standard binary search can be used.
// Function `binarySearchForInsertionPoint(arr, target, key_func)`:
// It should return the index of the first element `x` where `key_func(x) > target`.
//
// ```javascript
// function binarySearchForInsertionPoint(arr, target, key_func) {
//     let low = 0;
//     let high = arr.length; // `high` is exclusive
//     while (low < high) {
//         let mid = Math.floor((low + high) / 2);
//         if (key_func(arr[mid]) <= target) {
//             // If arr[mid] is <= target, then the insertion point must be after mid
//             low = mid + 1;
//         } else {
//             // If arr[mid] is > target, then mid could be the insertion point, or it's before mid
//             high = mid;
//         }
//     }
//     return low; // `low` is the index where `key_func(element) > target` first holds, or `arr.length`
// }
// ```
//
// The logic for `rides2_prefix_min_duration` and `rides2_suffix_min_finish` needs careful indexing.
// `rides2_prefix_min_duration[k]` should be the minimum duration from index 0 up to index `k` inclusive.
// `rides2_suffix_min_finish[k]` should be the minimum finish time from index `k` up to index `rides2_processed.length - 1` inclusive.
//
// Let's adjust precomputation logic:
//
// 3. `rides2_prefix_min_duration = []`.
//    `current_min = Infinity`.
//    For `k` from 0 to `rides2_processed.length - 1`:
//      `current_min = Math.min(current_min, rides2_processed[k].duration)`.
//      `rides2_prefix_min_duration.push(current_min)`.
//
// 4. `rides2_suffix_min_finish = []`.
//    `current_min = Infinity`.
//    For `k` from `rides2_processed.length - 1` down to 0:
//      `current_min = Math.min(current_min, rides2_processed[k].finishTime)`.
//      `rides2_suffix_min_finish[k] = current_min`. // Store at current index k
//
// Now, usage of these arrays:
//
// Case 1: `insertion_point > 0`.
//   This means there are rides with `startTime <= finish1`. These are indices `0` to `insertion_point - 1`.
//   The minimum duration among these is `rides2_prefix_min_duration[insertion_point - 1]`.
//   `current_min_finish = finish1 + rides2_prefix_min_duration[insertion_point - 1]`.
//   `min_total_finish_time = Math.min(min_total_finish_time, current_min_finish)`.
//
// Case 2: `insertion_point < rides2_processed.length`.
//   This means there are rides with `startTime > finish1`. These are indices `insertion_point` to `rides2_processed.length - 1`.
//   The minimum finish time among these is `rides2_suffix_min_finish[insertion_point]`.
//   `current_min_finish = rides2_suffix_min_finish[insertion_point]`.
//   `min_total_finish_time = Math.min(min_total_finish_time, current_min_finish)`.
//
// This seems correct.

/**
 * @param {number[]} landStartTime
 * @param {number[]} landDuration
 * @param {number[]} waterStartTime
 * @param {number[]} waterDuration
 * @return {number}
 */
const earliestFinishTime = (landStartTime, landDuration, waterStartTime, waterDuration) => {
    /**
     * Helper function to calculate the minimum finish time when rides from `rides1` are taken first,
     * followed by rides from `rides2`.
     * @param {number[]} rides1_start - Start times for the first category of rides.
     * @param {number[]} rides1_duration - Durations for the first category of rides.
     * @param {number[]} rides2_start - Start times for the second category of rides.
     * @param {number[]} rides2_duration - Durations for the second category of rides.
     * @returns {number} The earliest possible finish time.
     */
    const solve = (rides1_start, rides1_duration, rides2_start, rides2_duration) => {
        // Process rides for the second category: combine start time, duration, and calculate finish time.
        const rides2_processed = [];
        for (let i = 0; i < rides2_start.length; i++) {
            rides2_processed.push({
                startTime: rides2_start[i],
                duration: rides2_duration[i],
                finishTime: rides2_start[i] + rides2_duration[i]
            });
        }

        // Sort the second category of rides by their start times. This is crucial for the binary search.
        rides2_processed.sort((a, b) => a.startTime - b.startTime);

        // Precompute prefix minimum durations for rides2.
        // `rides2_prefix_min_duration[k]` stores the minimum duration among `rides2_processed[0]` to `rides2_processed[k]`.
        const rides2_prefix_min_duration = new Array(rides2_processed.length).fill(Infinity);
        let current_min_dur = Infinity;
        for (let k = 0; k < rides2_processed.length; k++) {
            current_min_dur = Math.min(current_min_dur, rides2_processed[k].duration);
            rides2_prefix_min_duration[k] = current_min_dur;
        }

        // Precompute suffix minimum finish times for rides2.
        // `rides2_suffix_min_finish[k]` stores the minimum finish time among `rides2_processed[k]` to `rides2_processed[rides2_processed.length - 1]`.
        const rides2_suffix_min_finish = new Array(rides2_processed.length).fill(Infinity);
        current_min_dur = Infinity; // Re-using variable name for clarity, though it's min finish time now.
        for (let k = rides2_processed.length - 1; k >= 0; k--) {
            current_min_dur = Math.min(current_min_dur, rides2_processed[k].finishTime);
            rides2_suffix_min_finish[k] = current_min_dur;
        }

        // Initialize the minimum total finish time to infinity.
        let min_total_finish_time = Infinity;

        // Iterate through each ride in the first category.
        for (let i = 0; i < rides1_start.length; i++) {
            const start1 = rides1_start[i];
            const duration1 = rides1_duration[i];
            const finish1 = start1 + duration1; // Finish time of the first ride.

            // Find the insertion point for `finish1` in the sorted `rides2_processed` by `startTime`.
            // `insertion_point` will be the index of the first ride in `rides2_processed` whose `startTime` is strictly greater than `finish1`.
            // We use a custom binary search function for this.
            const insertion_point = binarySearchForInsertionPoint(rides2_processed, finish1, (ride) => ride.startTime);

            // Case 1: Consider rides in `rides2_processed` that can be started at or after `finish1`.
            // These are rides `j` where `rides2_processed[j].startTime <= finish1`.
            // The earliest we can start such a ride is `finish1`.
            // The finish time will be `finish1 + rides2_processed[j].duration`.
            // To minimize this, we need the minimum duration among these rides.
            if (insertion_point > 0) {
                // `insertion_point - 1` is the index of the last ride where `startTime <= finish1`.
                const min_duration_in_range = rides2_prefix_min_duration[insertion_point - 1];
                const current_total_finish = finish1 + min_duration_in_range;
                min_total_finish_time = Math.min(min_total_finish_time, current_total_finish);
            }

            // Case 2: Consider rides in `rides2_processed` that can only be started at or after their own `startTime`.
            // These are rides `j` where `rides2_processed[j].startTime > finish1`.
            // The earliest we can start such a ride is `rides2_processed[j].startTime`.
            // The finish time will be `rides2_processed[j].startTime + rides2_processed[j].duration`.
            // To minimize this, we need the minimum `finishTime` among these rides.
            if (insertion_point < rides2_processed.length) {
                // `insertion_point` is the index of the first ride where `startTime > finish1`.
                const min_finish_time_in_range = rides2_suffix_min_finish[insertion_point];
                min_total_finish_time = Math.min(min_total_finish_time, min_finish_time_in_range);
            }
        }

        return min_total_finish_time;
    };

    /**
     * Performs binary search to find the insertion point for a target value in a sorted array.
     * It returns the index of the first element for which `key_func(element) > target`.
     * If all elements satisfy `key_func(element) <= target`, it returns `arr.length`.
     * @param {Array<Object>} arr - The sorted array of objects.
     * @param {number} target - The value to search for.
     * @param {function(Object): number} key_func - A function that extracts the key to compare from array elements.
     * @returns {number} The insertion point index.
     */
    const binarySearchForInsertionPoint = (arr, target, key_func) => {
        let low = 0;
        let high = arr.length; // `high` is exclusive, representing the end of the search space.

        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            // If the key of the middle element is less than or equal to the target,
            // it means the insertion point must be in the right half (after `mid`).
            if (key_func(arr[mid]) <= target) {
                low = mid + 1;
            } else {
                // If the key of the middle element is greater than the target,
                // it means `mid` could be the insertion point, or the insertion point is in the left half.
                high = mid;
            }
        }
        // `low` will be the index where `key_func(element) > target` first holds, or `arr.length` if all elements are <= target.
        return low;
    };

    // The problem states that the tourist must experience exactly one ride from each category, in either order.
    // We need to find the minimum finish time by considering both possible orders:
    // 1. Land ride first, then water ride.
    // 2. Water ride first, then land ride.
    const finish_land_then_water = solve(landStartTime, landDuration, waterStartTime, waterDuration);
    const finish_water_then_land = solve(waterStartTime, waterDuration, landStartTime, landDuration);

    // The earliest finish time is the minimum of these two scenarios.
    return Math.min(finish_land_then_water, finish_water_then_land);
};
// Time Complexity: O(N log N + M log M) where N is the number of land rides and M is the number of water rides.
// The `solve` function takes O(M log M + N log M) time.
// Sorting rides2 takes O(M log M).
// Precomputing prefix/suffix minimums takes O(M).
// Iterating through N rides in rides1, with binary search on rides2 (log M), takes O(N log M).
// We call `solve` twice, once for (land, water) and once for (water, land).
// The total time complexity is O(M log M + N log M + N log N + M log N).
// Assuming N and M are comparable, it simplifies to O(K log K) where K = max(N, M).
//
// Space Complexity: O(N + M).
// The `rides2_processed` array takes O(M) space.
// The `rides2_prefix_min_duration` and `rides2_suffix_min_finish` arrays take O(M) space.
// The recursive calls to `solve` do not add significant space complexity beyond the arrays used.
// Therefore, the space complexity is dominated by the storage of processed rides and auxiliary arrays.
// Since we call `solve` twice, and each call uses O(M) or O(N) space, the overall space complexity is O(max(N, M)).
```