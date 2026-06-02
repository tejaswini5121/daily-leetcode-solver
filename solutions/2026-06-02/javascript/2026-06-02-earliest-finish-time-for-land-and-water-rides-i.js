/**
 * @fileoverview LeetCode Problem: Earliest Finish Time for Land and Water Rides I
 * @problem_summary Find the minimum time to complete one land ride and one water ride, considering their start times and durations.
 * @problem_link https://leetcode.com/problems/earliest-finish-time-for-land-and-water-rides-i/
 *
 * @approach
 * The problem requires us to find the earliest time a tourist can finish one land ride and one water ride.
 * The tourist can choose any land ride and any water ride. The order of rides can be either land first then water, or water first then land.
 *
 * We need to consider all possible pairings of land rides and water rides. For each pair, we calculate the finish time in both possible orders:
 *
 * 1. Land ride first, then Water ride:
 *    - Let the chosen land ride be `landRide` and the water ride be `waterRide`.
 *    - The earliest the land ride can start is `landRide.startTime`.
 *    - The land ride finishes at `landRide.startTime + landRide.duration`.
 *    - The earliest the water ride can start is `waterRide.startTime`.
 *    - The actual start time for the water ride will be the maximum of:
 *        - The time the land ride finishes.
 *        - The earliest the water ride can be boarded (`waterRide.startTime`).
 *    - The water ride finishes at `actualWaterRideStartTime + waterRide.duration`.
 *    - The total finish time for this order is `max(landRide.finishTime, waterRide.startTime) + waterRide.duration`.
 *
 * 2. Water ride first, then Land ride:
 *    - Similarly, let the chosen water ride be `waterRide` and the land ride be `landRide`.
 *    - The earliest the water ride can start is `waterRide.startTime`.
 *    - The water ride finishes at `waterRide.startTime + waterRide.duration`.
 *    - The earliest the land ride can start is `landRide.startTime`.
 *    - The actual start time for the land ride will be the maximum of:
 *        - The time the water ride finishes.
 *        - The earliest the land ride can be boarded (`landRide.startTime`).
 *    - The land ride finishes at `actualLandRideStartTime + landRide.duration`.
 *    - The total finish time for this order is `max(waterRide.finishTime, landRide.startTime) + landRide.duration`.
 *
 * We iterate through all `n` land rides and `m` water rides. For each of the `n * m` pairs, we calculate the finish time for both possible orders.
 * We keep track of the minimum finish time found so far.
 *
 * To optimize, we can pre-calculate the earliest possible finish time for *any* land ride, and the earliest possible finish time for *any* water ride.
 * However, the problem states we must complete *exactly one* ride from *each* category. This means we must consider the combinations.
 *
 * Let's refine the calculation for a specific land ride `i` and water ride `j`:
 *
 * Order: Land `i` -> Water `j`
 *   - Land `i` starts at `landStartTime[i]`.
 *   - Land `i` finishes at `finishLandI = landStartTime[i] + landDuration[i]`.
 *   - Water `j` can start at `waterStartTime[j]`.
 *   - Water `j` will actually start at `startWaterJ = max(finishLandI, waterStartTime[j])`.
 *   - Water `j` finishes at `finishWaterJ = startWaterJ + waterDuration[j]`.
 *   - Total finish time for this order: `finishWaterJ`.
 *
 * Order: Water `j` -> Land `i`
 *   - Water `j` starts at `waterStartTime[j]`.
 *   - Water `j` finishes at `finishWaterJ = waterStartTime[j] + waterDuration[j]`.
 *   - Land `i` can start at `landStartTime[i]`.
 *   - Land `i` will actually start at `startLandI = max(finishWaterJ, landStartTime[i])`.
 *   - Land `i` finishes at `finishLandI = startLandI + landDuration[i]`.
 *   - Total finish time for this order: `finishLandI`.
 *
 * We initialize `minFinishTime` to infinity and update it with the minimum of these calculated times.
 *
 * @time_complexity O(n * m), where n is the number of land rides and m is the number of water rides. We iterate through all possible pairs of land and water rides.
 * @space_complexity O(1), as we only use a few variables to store the minimum finish time and intermediate calculations.
 */

/**
 * @param {number[]} landStartTime
 * @param {number[]} landDuration
 * @param {number[]} waterStartTime
 * @param {number[]} waterDuration
 * @return {number}
 */
var earliestFinishTime = function(landStartTime, landDuration, waterStartTime, waterDuration) {
    // Initialize the minimum finish time to a very large number.
    // This will be updated as we find earlier possible finish times.
    let minFinishTime = Infinity;

    // Iterate through each land ride.
    for (let i = 0; i < landStartTime.length; i++) {
        // Iterate through each water ride.
        for (let j = 0; j < waterStartTime.length; j++) {

            // --- Case 1: Land ride first, then Water ride ---

            // Calculate the earliest finish time for the current land ride.
            // The land ride starts at its opening time.
            const finishLandFirst = landStartTime[i] + landDuration[i];

            // The water ride can only start after the land ride finishes AND after its own opening time.
            // So, the actual start time for the water ride is the maximum of these two.
            const startWaterSecond = Math.max(finishLandFirst, waterStartTime[j]);

            // Calculate the final finish time for this order.
            const totalFinishLandWater = startWaterSecond + waterDuration[j];

            // Update the overall minimum finish time if this plan is better.
            minFinishTime = Math.min(minFinishTime, totalFinishLandWater);

            // --- Case 2: Water ride first, then Land ride ---

            // Calculate the earliest finish time for the current water ride.
            // The water ride starts at its opening time.
            const finishWaterFirst = waterStartTime[j] + waterDuration[j];

            // The land ride can only start after the water ride finishes AND after its own opening time.
            // So, the actual start time for the land ride is the maximum of these two.
            const startLandSecond = Math.max(finishWaterFirst, landStartTime[i]);

            // Calculate the final finish time for this order.
            const totalFinishWaterLand = startLandSecond + landDuration[i];

            // Update the overall minimum finish time if this plan is better.
            minFinishTime = Math.min(minFinishTime, totalFinishWaterLand);
        }
    }

    // Return the earliest finish time found across all combinations and orders.
    return minFinishTime;
};
```