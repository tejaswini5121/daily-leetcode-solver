```java
import java.util.Arrays;

class Solution {
    /**
     * Calculates the earliest finish time for a tourist to experience one land ride and one water ride.
     * The tourist can choose any land ride and any water ride, and can do them in any order.
     * The tourist can start a ride at its opening time or later.
     *
     * Approach:
     * We need to consider all possible pairs of one land ride and one water ride.
     * For each pair, we calculate the finish time if the land ride is taken first, and if the water ride is taken first.
     * The overall minimum finish time among all these possibilities will be the answer.
     *
     * To efficiently calculate the finish times, for a chosen land ride `l` and water ride `w`:
     * 1. Land ride first:
     *    - Start land ride at `landStartTime[l]`.
     *    - Finish land ride at `landStartTime[l] + landDuration[l]`. Let this be `landFinishTime`.
     *    - The water ride can start earliest at `max(landFinishTime, waterStartTime[w])`.
     *    - Finish water ride at `max(landFinishTime, waterStartTime[w]) + waterDuration[w]`.
     *
     * 2. Water ride first:
     *    - Start water ride at `waterStartTime[w]`.
     *    - Finish water ride at `waterStartTime[w] + waterDuration[w]`. Let this be `waterFinishTime`.
     *    - The land ride can start earliest at `max(waterFinishTime, landStartTime[l])`.
     *    - Finish land ride at `max(waterFinishTime, landStartTime[l]) + landDuration[l]`.
     *
     * The minimum of these two scenarios for the current pair (l, w) is then compared with the global minimum finish time.
     *
     * Optimization:
     * To speed up finding the earliest possible start for the second ride, we can sort the rides by their start times.
     * However, the problem states we need to pick *any* land ride and *any* water ride. A brute force of N*M pairs is too slow given constraints up to 5*10^4.
     *
     * Let's rethink the calculation for a specific pair (land_i, water_j).
     * Scenario 1: Land ride i then Water ride j
     *   - Land ride starts at `landStartTime[i]`.
     *   - Land ride finishes at `landFinish = landStartTime[i] + landDuration[i]`.
     *   - Water ride can start at `max(landFinish, waterStartTime[j])`.
     *   - Water ride finishes at `max(landFinish, waterStartTime[j]) + waterDuration[j]`.
     *
     * Scenario 2: Water ride j then Land ride i
     *   - Water ride starts at `waterStartTime[j]`.
     *   - Water ride finishes at `waterFinish = waterStartTime[j] + waterDuration[j]`.
     *   - Land ride can start at `max(waterFinish, landStartTime[i])`.
     *   - Land ride finishes at `max(waterFinish, landStartTime[i]) + landDuration[i]`.
     *
     * The overall minimum finish time is `min(min(finish_time_land_first), min(finish_time_water_first))` across all pairs.
     *
     * Instead of iterating through all N*M pairs, we can consider the core calculation.
     * The finish time for a land ride `i` followed by water ride `j` is:
     * `max(landStartTime[i] + landDuration[i], waterStartTime[j]) + waterDuration[j]`
     * The finish time for a water ride `j` followed by land ride `i` is:
     * `max(waterStartTime[j] + waterDuration[j], landStartTime[i]) + landDuration[i]`
     *
     * We can optimize by sorting the start times and then using a two-pointer or binary search approach.
     *
     * Let's sort `landStartTime` and `waterStartTime`.
     *
     * Consider a fixed water ride `w`. We want to find the best land ride `l` to pair with it,
     * such that either `l -> w` or `w -> l` is minimized.
     *
     * If we do `l -> w`: Finish time is `max(landStartTime[l] + landDuration[l], waterStartTime[w]) + waterDuration[w]`.
     * To minimize this, we want `landStartTime[l] + landDuration[l]` to be as small as possible and `waterStartTime[w]` to be as early as possible.
     * For a fixed `w`, `waterStartTime[w] + waterDuration[w]` is constant. We need to minimize `max(landStartTime[l] + landDuration[l], waterStartTime[w])`.
     * This means we want `landStartTime[l] + landDuration[l]` to be less than or equal to `waterStartTime[w]` if possible, otherwise as small as possible.
     *
     * If we do `w -> l`: Finish time is `max(waterStartTime[w] + waterDuration[w], landStartTime[l]) + landDuration[l]`.
     * To minimize this, we want `waterStartTime[w] + waterDuration[w]` to be as small as possible and `landStartTime[l]` to be as early as possible.
     * For a fixed `w`, `waterStartTime[w] + waterDuration[w]` is constant. We need to minimize `max(waterStartTime[w] + waterDuration[w], landStartTime[l])`.
     * This means we want `landStartTime[l]` to be less than or equal to `waterStartTime[w] + waterDuration[w]` if possible, otherwise as small as possible.
     *
     * This suggests that for each water ride, we might need to efficiently query land rides.
     *
     * Let's sort both arrays based on start times. This might not be enough because durations matter.
     *
     * The critical observation: For any pair of rides (land `i`, water `j`), the finish time is determined by `max(finish_time_of_first_ride, start_time_of_second_ride) + duration_of_second_ride`.
     *
     * Consider the finish time of land ride `i`: `FL_i = landStartTime[i] + landDuration[i]`.
     * Consider the finish time of water ride `j`: `FW_j = waterStartTime[j] + waterDuration[j]`.
     *
     * If land ride `i` is first, then water ride `j`:
     *   Finish time = `max(FL_i, waterStartTime[j]) + waterDuration[j]`
     * If water ride `j` is first, then land ride `i`:
     *   Finish time = `max(FW_j, landStartTime[i]) + landDuration[i]`
     *
     * We need to find `min( min_over_i( min( max(FL_i, waterStartTime[j]) + waterDuration[j], max(FW_j, landStartTime[i]) + landDuration[i] ) ) )`
     *
     * Let's consider a specific land ride `i`. We want to find the best water ride `j` to pair with it.
     * For a fixed `i`, we want to minimize:
     * `min_j ( min( max(FL_i, waterStartTime[j]) + waterDuration[j], max(FW_j, landStartTime[i]) + landDuration[i] ) )`
     *
     * For the `max(FL_i, waterStartTime[j]) + waterDuration[j]` term:
     * To minimize this for a fixed `i`, we want `waterStartTime[j]` to be small if `FL_i` is large, and `waterDuration[j]` to be small.
     *
     * For the `max(FW_j, landStartTime[i]) + landDuration[i]` term:
     * To minimize this for a fixed `i`, we want `landStartTime[i]` to be small if `FW_j` is large, and `landDuration[i]` to be small.
     *
     * Let's consider iterating through one type of ride, say water rides, and for each water ride, find the optimal land ride.
     *
     * For a fixed water ride `w` (with start `ws` and duration `wd`):
     * 1. Land ride `l` (start `ls`, duration `ld`) then `w`:
     *    Finish = `max(ls + ld, ws) + wd`.
     *    To minimize this for a fixed `w`, we are looking for `l` that minimizes `max(ls + ld, ws)`.
     *    This means if `ls + ld <= ws`, we want `ls + ld` to be as small as possible.
     *    If `ls + ld > ws`, we want `ls + ld` to be as small as possible.
     *    So, we want to find a land ride `l` such that `ls + ld` is minimal among those where `ls + ld <= ws`,
     *    and if no such land ride exists, we want the land ride with the globally minimum `ls + ld`.
     *    This is still complicated.
     *
     * Let's simplify the structure. For any pair (land `i`, water `j`):
     * Possible finish times are `max(landStartTime[i] + landDuration[i], waterStartTime[j]) + waterDuration[j]`
     * and `max(waterStartTime[j] + waterDuration[j], landStartTime[i]) + landDuration[i]`.
     *
     * Key Insight: The problem is asking for the minimum of `max(A, B) + C` over pairs of rides.
     *
     * Consider the finish time of a land ride `i`: `finish_land_i = landStartTime[i] + landDuration[i]`.
     * Consider the finish time of a water ride `j`: `finish_water_j = waterStartTime[j] + waterDuration[j]`.
     *
     * If land ride `i` comes first, then water ride `j`:
     *   The tourist finishes land ride `i` at `finish_land_i`.
     *   The tourist can start water ride `j` at `max(finish_land_i, waterStartTime[j])`.
     *   The tourist finishes water ride `j` at `max(finish_land_i, waterStartTime[j]) + waterDuration[j]`.
     *
     * If water ride `j` comes first, then land ride `i`:
     *   The tourist finishes water ride `j` at `finish_water_j`.
     *   The tourist can start land ride `i` at `max(finish_water_j, landStartTime[i])`.
     *   The tourist finishes land ride `i` at `max(finish_water_j, landStartTime[i]) + landDuration[i]`.
     *
     * We want to minimize the result of these two possibilities over all pairs `(i, j)`.
     *
     * Let's sort the land rides by their start times and water rides by their start times.
     *
     * `landStartTime = [2, 8], landDuration = [4, 1]`
     * `waterStartTime = [6], waterDuration = [3]`
     *
     * Land rides:
     * Ride 0: start=2, duration=4, finish=6
     * Ride 1: start=8, duration=1, finish=9
     *
     * Water rides:
     * Ride 0: start=6, duration=3, finish=9
     *
     * Pair (Land 0, Water 0):
     *   Land 0 -> Water 0:
     *     Land 0 finishes at 2+4=6.
     *     Water 0 opens at 6. Can start at max(6, 6) = 6.
     *     Water 0 finishes at 6+3=9.
     *   Water 0 -> Land 0:
     *     Water 0 finishes at 6+3=9.
     *     Land 0 opens at 2. Can start at max(9, 2) = 9.
     *     Land 0 finishes at 9+4=13.
     *   Min for this pair: 9.
     *
     * Pair (Land 1, Water 0):
     *   Land 1 -> Water 0:
     *     Land 1 finishes at 8+1=9.
     *     Water 0 opens at 6. Can start at max(9, 6) = 9.
     *     Water 0 finishes at 9+3=12.
     *   Water 0 -> Land 1:
     *     Water 0 finishes at 6+3=9.
     *     Land 1 opens at 8. Can start at max(9, 8) = 9.
     *     Land 1 finishes at 9+1=10.
     *   Min for this pair: 10.
     *
     * Overall minimum: min(9, 10) = 9.
     *
     * The crucial part is how to avoid O(N*M) iteration.
     *
     * Let's sort the land rides and water rides independently based on their start times.
     *
     * `land = [(2, 4), (8, 1)]`
     * `water = [(6, 3)]`
     *
     * `min_overall_finish = infinity`
     *
     * Iterate through each land ride `l` (start `ls`, duration `ld`):
     *   For this `l`, we need to find the best water ride `w` (start `ws`, duration `wd`).
     *
     *   Scenario 1: `l -> w`
     *     Finish time = `max(ls + ld, ws) + wd`
     *     To minimize this, for a fixed `l`, we want to find `w` that minimizes `max(ls + ld, ws) + wd`.
     *     This term can be seen as `max(ls + ld + wd, ws + wd)`.
     *     This doesn't simplify easily.
     *
     *   Scenario 2: `w -> l`
     *     Finish time = `max(ws + wd, ls) + ld`
     *     To minimize this, for a fixed `l`, we want to find `w` that minimizes `max(ws + wd, ls) + ld`.
     *     This term can be seen as `max(ws + wd + ld, ls + ld)`.
     *     This also doesn't simplify easily.
     *
     * Let's consider the two finish possibilities for a pair `(l, w)`:
     * P1 = `max(landStartTime[l] + landDuration[l], waterStartTime[w]) + waterDuration[w]`
     * P2 = `max(waterStartTime[w] + waterDuration[w], landStartTime[l]) + landDuration[l]`
     *
     * We want `min over all (l, w) of min(P1, P2)`.
     *
     * Try sorting both arrays.
     * `land = [(2, 4), (8, 1)]`
     * `water = [(6, 3)]`
     *
     * Let's consider the problem from a different angle.
     * We have a set of land events (start, end) and water events (start, end).
     *
     * For each land ride `i`:
     *   Its earliest finish time is `landStartTime[i] + landDuration[i]`.
     *   For any water ride `j`, if `land i` is done first, the finish time is `max(landStartTime[i] + landDuration[i], waterStartTime[j]) + waterDuration[j]`.
     *   To minimize this over all `j` for a fixed `i`, we need to pick `j` that minimizes `max(C1, waterStartTime[j]) + waterDuration[j]`, where `C1 = landStartTime[i] + landDuration[i]`.
     *   This is equivalent to `min_j (max(C1 + waterDuration[j], waterStartTime[j] + waterDuration[j]))`.
     *   Let `FW_j = waterStartTime[j] + waterDuration[j]`. We want `min_j (max(C1 + waterDuration[j], FW_j))`.
     *   This is still not trivial.
     *
     * Let's reconsider the constraints. N, M up to 5*10^4. O(N log N + M log M + N log M) or O(N log N + M log M + M log N) might be acceptable.
     *
     * If we iterate through each land ride `i`:
     *   We need to find the minimum `max(FL_i, ws) + wd` over all water rides `w` (ws, wd).
     *   And the minimum `max(FW_w, ls) + ld` over all water rides `w` (ws, wd).
     *
     * Let's sort `waterStartTime` and `waterDuration` together.
     * For a fixed land ride `i` (start `ls`, duration `ld`), finish `FL_i = ls + ld`.
     *
     * Part 1: Land `i` then Water `w`
     *   Finish time = `max(FL_i, ws) + wd`.
     *   To efficiently find the minimum of this, we can consider two cases for `ws`:
     *   Case 1.1: `ws <= FL_i`. We want to minimize `FL_i + wd`. This means picking `w` with minimum `wd`.
     *   Case 1.2: `ws > FL_i`. We want to minimize `ws + wd`. This means picking `w` with minimum `ws + wd`.
     *   So, for a fixed `FL_i`, we need:
     *     - Minimum `wd` among water rides where `ws <= FL_i`.
     *     - Minimum `ws + wd` among water rides where `ws > FL_i`.
     *
     *   This can be achieved by sorting water rides by `ws`. Then we can use binary search to find the split point.
     *   For water rides sorted by `ws`:
     *     - To find min `wd` for `ws <= FL_i`: maintain a running minimum of `wd` for rides processed so far.
     *     - To find min `ws + wd` for `ws > FL_i`: this is harder.
     *
     * This seems to be the right direction. Let's refine it.
     *
     * Sort `landStartTime` and `landDuration` to get `landRides` (pairs of `(startTime, duration)`).
     * Sort `waterStartTime` and `waterDuration` to get `waterRides` (pairs of `(startTime, duration)`).
     *
     * `landRides`: `[(ls1, ld1), (ls2, ld2), ...]` sorted by `ls`.
     * `waterRides`: `[(ws1, wd1), (ws2, wd2), ...]` sorted by `ws`.
     *
     * Initialize `minFinishTime = infinity`.
     *
     * Precomputation for Water Rides:
     *   Create `waterFinishTimes` = list of `ws + wd` for each water ride.
     *   Create `minWaterDurationPrefix` = prefix minimum of `wd` for water rides sorted by `ws`.
     *   Create `minWaterFinishTimeSuffix` = suffix minimum of `ws + wd` for water rides sorted by `ws`.
     *
     * Iterate through each land ride `l` from `landRides` with `(ls, ld)`:
     *   Calculate `landFinishTime = ls + ld`.
     *
     *   // Case 1: Land ride `l` first, then Water ride `w`.
     *   // Finish time = `max(landFinishTime, ws) + wd`
     *   // We want to minimize this over all water rides `w`.
     *
     *   // Find the index `k` such that `waterRides[k-1].ws <= landFinishTime` and `waterRides[k].ws > landFinishTime`.
     *   // Use binary search (e.g., `upper_bound` on `ws` for `landFinishTime`).
     *
     *   // Subcase 1.1: `ws <= landFinishTime`.
     *   // We are interested in water rides from index 0 to `k-1`.
     *   // Finish time = `landFinishTime + wd`.
     *   // To minimize this, we need the minimum `wd` among these rides.
     *   // This is `minWaterDurationPrefix[k-1]` if `k > 0`.
     *   // If `k > 0`, update `minFinishTime = min(minFinishTime, landFinishTime + minWaterDurationPrefix[k-1])`.
     *
     *   // Subcase 1.2: `ws > landFinishTime`.
     *   // We are interested in water rides from index `k` to end.
     *   // Finish time = `ws + wd`.
     *   // To minimize this, we need the minimum `ws + wd` among these rides.
     *   // This is `minWaterFinishTimeSuffix[k]` if `k < numWaterRides`.
     *   // If `k < numWaterRides`, update `minFinishTime = min(minFinishTime, minWaterFinishTimeSuffix[k])`.
     *
     *   // Case 2: Water ride `w` first, then Land ride `l`.
     *   // Finish time = `max(ws + wd, ls) + ld`.
     *   // We want to minimize this over all water rides `w`.
     *
     *   // This is `max(ws + wd + ld, ls + ld)`.
     *   // Let `waterFinishTime = ws + wd`. Finish time = `max(waterFinishTime, ls) + ld`.
     *
     *   // This is equivalent to finding minimum of `max(FW_w, ls) + ld` over all `w`.
     *   // For a fixed `ls` and `ld`, we need to find `w` that minimizes `max(FW_w, ls)`.
     *
     *   // This means if `FW_w <= ls`, we want `FW_w` to be as small as possible.
     *   // If `FW_w > ls`, we want `FW_w` to be as small as possible.
     *   // So, we want `FW_w` to be as small as possible among all `w`.
     *   // The minimum `FW_w` over all `w` is simply `min(waterFinishTimes)`.
     *   // Let `minFW = min(waterFinishTimes)`.
     *   // The minimum finish time in this scenario for land ride `l` would be `max(minFW, ls) + ld`.
     *   // Update `minFinishTime = min(minFinishTime, max(minFW, ls) + ld)`.
     *
     *
     * Let's structure the data and precomputation:
     *
     * Pair class to hold start and duration.
     *
     * `landRides`: Array of Pair, sorted by startTime.
     * `waterRides`: Array of Pair, sorted by startTime.
     *
     * Precomputation for `waterRides` (sorted by `ws`):
     *   `minWaterDurationPrefix[i]`: min `wd` for `waterRides[0...i]`.
     *   `minWaterFinishTimeSuffix[i]`: min `ws + wd` for `waterRides[i...end]`.
     *   `minOverallWaterFinishTime`: min `ws + wd` for all water rides.
     *
     * Iterate through `landRides`: `(ls, ld)`
     *   `landFinishTime = ls + ld`
     *
     *   // Case 1: Land then Water. Finish = `max(landFinishTime, ws) + wd`
     *   // Find split point `k` in `waterRides` where `ws <= landFinishTime` and `ws > landFinishTime`.
     *   // `k = upper_bound(waterRides.ws, landFinishTime)`
     *
     *   // Subcase 1.1: `ws <= landFinishTime` (indices 0 to k-1)
     *   // Minimize `landFinishTime + wd`. Need min `wd` in this range.
     *   // If `k > 0`, use `minWaterDurationPrefix[k-1]`.
     *   // `potentialFinish1_1 = landFinishTime + minWaterDurationPrefix[k-1]`.
     *   // `minFinishTime = min(minFinishTime, potentialFinish1_1)`.
     *
     *   // Subcase 1.2: `ws > landFinishTime` (indices k to end)
     *   // Minimize `ws + wd`. Need min `ws + wd` in this range.
     *   // If `k < numWaterRides`, use `minWaterFinishTimeSuffix[k]`.
     *   // `potentialFinish1_2 = minWaterFinishTimeSuffix[k]`.
     *   // `minFinishTime = min(minFinishTime, potentialFinish1_2)`.
     *
     *   // Case 2: Water then Land. Finish = `max(ws + wd, ls) + ld`
     *   // We want to minimize this over all water rides `w`.
     *   // This is `max(minWaterFinishTime, ls) + ld`, where `minWaterFinishTime` is the minimum `ws+wd` over all `w`.
     *   // This `minWaterFinishTime` is `minOverallWaterFinishTime`.
     *   // `potentialFinish2 = max(minOverallWaterFinishTime, ls) + ld`.
     *   // `minFinishTime = min(minFinishTime, potentialFinish2)`.
     *
     *
     * Need to handle edge cases for binary search (`k` can be 0 or `numWaterRides`).
     *
     * Time Complexity:
     * Sorting land rides: O(N log N)
     * Sorting water rides: O(M log M)
     * Precomputation for water rides: O(M)
     * Iterating through land rides: N iterations.
     *   Inside loop: Binary search (O(log M)), constant time lookups.
     * Total loop: O(N log M)
     * Overall: O(N log N + M log M + N log M).
     * If N and M are of similar magnitude, it's roughly O(N log N).
     *
     * Space Complexity:
     * Storing sorted rides: O(N + M)
     * Precomputation arrays: O(M)
     * Overall: O(N + M)
     *
     * Example 1 walkthrough with refined approach:
     * landStartTime = [2,8], landDuration = [4,1]
     * waterStartTime = [6], waterDuration = [3]
     *
     * landRides = [(2, 4), (8, 1)] // sorted by start time
     * waterRides = [(6, 3)] // sorted by start time
     *
     * Water ride precomputation:
     * waterRides = [(ws=6, wd=3)]
     * ws + wd = 9
     * minWaterDurationPrefix: [3]
     * minWaterFinishTimeSuffix: [9]
     * minOverallWaterFinishTime: 9
     *
     * minFinishTime = infinity
     *
     * Iterate through landRides:
     *
     * Land ride `l = (ls=2, ld=4)`:
     *   `landFinishTime = 2 + 4 = 6`
     *
     *   // Case 1: Land then Water. Finish = `max(landFinishTime, ws) + wd`
     *   `landFinishTime = 6`.
     *   Binary search `waterRides.ws` for `landFinishTime = 6`:
     *     `waterRides.ws = [6]`. `upper_bound(6)` for `6` is index 1. So `k = 1`.
     *
     *   // Subcase 1.1: `ws <= landFinishTime` (indices 0 to k-1 = 0)
     *   // Rides: (6, 3). `ws=6 <= landFinishTime=6`.
     *   // Range is [0, 0]. `k=1 > 0`.
     *   // `minWaterDurationPrefix[k-1] = minWaterDurationPrefix[0] = 3`.
     *   // `potentialFinish1_1 = landFinishTime + minWaterDurationPrefix[0] = 6 + 3 = 9`.
     *   // `minFinishTime = min(infinity, 9) = 9`.
     *
     *   // Subcase 1.2: `ws > landFinishTime` (indices k to end = 1 to end)
     *   // Range is [1, 0]. This range is empty because `k = numWaterRides`.
     *   // Condition `k < numWaterRides` is false (1 < 1 is false). No update.
     *
     *   // Case 2: Water then Land. Finish = `max(ws + wd, ls) + ld`
     *   // `minOverallWaterFinishTime = 9`.
     *   // `potentialFinish2 = max(minOverallWaterFinishTime, ls) + ld = max(9, 2) + 4 = 9 + 4 = 13`.
     *   // `minFinishTime = min(9, 13) = 9`.
     *
     * Land ride `l = (ls=8, ld=1)`:
     *   `landFinishTime = 8 + 1 = 9`
     *
     *   // Case 1: Land then Water. Finish = `max(landFinishTime, ws) + wd`
     *   `landFinishTime = 9`.
     *   Binary search `waterRides.ws` for `landFinishTime = 9`:
     *     `waterRides.ws = [6]`. `upper_bound(6)` for `9` is index 1. So `k = 1`.
     *
     *   // Subcase 1.1: `ws <= landFinishTime` (indices 0 to k-1 = 0)
     *   // Rides: (6, 3). `ws=6 <= landFinishTime=9`.
     *   // Range is [0, 0]. `k=1 > 0`.
     *   // `minWaterDurationPrefix[k-1] = minWaterDurationPrefix[0] = 3`.
     *   // `potentialFinish1_1 = landFinishTime + minWaterDurationPrefix[0] = 9 + 3 = 12`.
     *   // `minFinishTime = min(9, 12) = 9`.
     *
     *   // Subcase 1.2: `ws > landFinishTime` (indices k to end = 1 to end)
     *   // Range is empty. `k < numWaterRides` is false. No update.
     *
     *   // Case 2: Water then Land. Finish = `max(ws + wd, ls) + ld`
     *   // `minOverallWaterFinishTime = 9`.
     *   // `potentialFinish2 = max(minOverallWaterFinishTime, ls) + ld = max(9, 8) + 1 = 9 + 1 = 10`.
     *   // `minFinishTime = min(9, 10) = 9`.
     *
     * Final `minFinishTime = 9`. Correct for Example 1.
     *
     * Example 2 walkthrough:
     * landStartTime = [5], landDuration = [3]
     * waterStartTime = [1], waterDuration = [10]
     *
     * landRides = [(5, 3)]
     * waterRides = [(1, 10)]
     *
     * Water ride precomputation:
     * waterRides = [(ws=1, wd=10)]
     * ws + wd = 11
     * minWaterDurationPrefix: [10]
     * minWaterFinishTimeSuffix: [11]
     * minOverallWaterFinishTime: 11
     *
     * minFinishTime = infinity
     *
     * Land ride `l = (ls=5, ld=3)`:
     *   `landFinishTime = 5 + 3 = 8`
     *
     *   // Case 1: Land then Water. Finish = `max(landFinishTime, ws) + wd`
     *   `landFinishTime = 8`.
     *   Binary search `waterRides.ws` for `landFinishTime = 8`:
     *     `waterRides.ws = [1]`. `upper_bound(1)` for `8` is index 1. `k = 1`.
     *
     *   // Subcase 1.1: `ws <= landFinishTime` (indices 0 to 0)
     *   // Rides: (1, 10). `ws=1 <= landFinishTime=8`.
     *   // `k=1 > 0`.
     *   // `minWaterDurationPrefix[0] = 10`.
     *   // `potentialFinish1_1 = landFinishTime + minWaterDurationPrefix[0] = 8 + 10 = 18`.
     *   // `minFinishTime = min(infinity, 18) = 18`.
     *
     *   // Subcase 1.2: `ws > landFinishTime` (indices 1 to end)
     *   // Range empty. `k < numWaterRides` false. No update.
     *
     *   // Case 2: Water then Land. Finish = `max(ws + wd, ls) + ld`
     *   // `minOverallWaterFinishTime = 11`.
     *   // `potentialFinish2 = max(minOverallWaterFinishTime, ls) + ld = max(11, 5) + 3 = 11 + 3 = 14`.
     *   // `minFinishTime = min(18, 14) = 14`.
     *
     * Final `minFinishTime = 14`. Correct for Example 2.
     *
     * Implementation details:
     * Use a helper class `Ride` for (startTime, duration).
     * Use `Arrays.sort` with a custom comparator.
     * Need `upper_bound` logic for binary search. A manual loop or `Arrays.binarySearch` can be adapted.
     * `Arrays.binarySearch` returns `(-(insertion point) - 1)` if not found. The insertion point is `k`.
     * So, if `res < 0`, `k = -(res + 1)`. If `res >= 0`, `k = res`.
     * To get `upper_bound` for `val`: find first element `>` val.
     * If we search for `val`, `binarySearch` might return an index where `ws == val`. We need index where `ws > val`.
     * So, we need to find the first element greater than `landFinishTime`.
     *
     * `int k = Arrays.binarySearch(waterRides, new Ride(landFinishTime + 1, 0), comparatorByStartTime);`
     * If `k < 0`, `k = -(k + 1);` this `k` is the insertion point for `landFinishTime + 1`.
     * If the element at `k` has `ws == landFinishTime`, it will be grouped with elements less than it.
     * We want the first `ws > landFinishTime`.
     *
     * Let's define `k` as the index of the first water ride whose start time `ws` is strictly greater than `landFinishTime`.
     * This `k` is equivalent to `upper_bound(ws, landFinishTime)`.
     *
     * If `waterRides[i].startTime <= landFinishTime` then `i` is in the first group (0 to k-1).
     * If `waterRides[i].startTime > landFinishTime` then `i` is in the second group (k to end).
     *
     * Let's use a binary search that returns the index of the first element greater than the target.
     *
     * `findFirstGreaterThan(arr, target, comparator)`
     *
     * Edge cases for precomputation:
     * If `waterRides` is empty, this whole approach needs adjustment. But constraints say N, M >= 1.
     *
     * `minWaterDurationPrefix` calculation:
     * `minWaterDurationPrefix[0] = waterRides[0].duration`
     * `for i = 1 to M-1: minWaterDurationPrefix[i] = min(minWaterDurationPrefix[i-1], waterRides[i].duration)`
     *
     * `minWaterFinishTimeSuffix` calculation:
     * `minWaterFinishTimeSuffix[M-1] = waterRides[M-1].startTime + waterRides[M-1].duration`
     * `for i = M-2 down to 0: minWaterFinishTimeSuffix[i] = min(minWaterFinishTimeSuffix[i+1], waterRides[i].startTime + waterRides[i].duration)`
     *
     * `minOverallWaterFinishTime` is `minWaterFinishTimeSuffix[0]`.
     */

    // Helper class to store ride information.
    private static class Ride {
        long startTime;
        long duration;

        Ride(long startTime, long duration) {
            this.startTime = startTime;
            this.duration = duration;
        }
    }

    // Comparator for sorting rides by startTime.
    private static final java.util.Comparator<Ride> COMPARATOR_BY_START_TIME =
            java.util.Comparator.comparingLong(ride -> ride.startTime);

    public long earliestFinishTime(int[] landStartTime, int[] landDuration, int[] waterStartTime, int[] waterDuration) {
        int n = landStartTime.length;
        int m = waterStartTime.length;

        // Create arrays of Ride objects for land and water rides.
        Ride[] landRides = new Ride[n];
        for (int i = 0; i < n; i++) {
            landRides[i] = new Ride(landStartTime[i], landDuration[i]);
        }

        Ride[] waterRides = new Ride[m];
        for (int i = 0; i < m; i++) {
            waterRides[i] = new Ride(waterStartTime[i], waterDuration[i]);
        }

        // Sort both arrays by their start times.
        Arrays.sort(landRides, COMPARATOR_BY_START_TIME);
        Arrays.sort(waterRides, COMPARATOR_BY_START_TIME);

        // Precompute values for water rides for faster lookups.
        // minWaterDurationPrefix[i]: The minimum duration among waterRides[0...i].
        long[] minWaterDurationPrefix = new long[m];
        minWaterDurationPrefix[0] = waterRides[0].duration;
        for (int i = 1; i < m; i++) {
            minWaterDurationPrefix[i] = Math.min(minWaterDurationPrefix[i - 1], waterRides[i].duration);
        }

        // minWaterFinishTimeSuffix[i]: The minimum finish time (ws + wd) among waterRides[i...m-1].
        long[] minWaterFinishTimeSuffix = new long[m];
        minWaterFinishTimeSuffix[m - 1] = waterRides[m - 1].startTime + waterRides[m - 1].duration;
        for (int i = m - 2; i >= 0; i--) {
            minWaterFinishTimeSuffix[i] = Math.min(minWaterFinishTimeSuffix[i + 1], waterRides[i].startTime + waterRides[i].duration);
        }

        // The overall minimum finish time for any water ride.
        long minOverallWaterFinishTime = minWaterFinishTimeSuffix[0];

        // Initialize the minimum finish time to a very large value.
        long minFinishTime = Long.MAX_VALUE;

        // Iterate through each land ride to find the best pairing.
        for (Ride landRide : landRides) {
            long ls = landRide.startTime;
            long ld = landRide.duration;
            long landFinishTime = ls + ld; // Earliest time the land ride can be finished.

            // Case 1: Land ride first, then Water ride.
            // Finish time = max(landFinishTime, waterStartTime) + waterDuration
            // We want to minimize this over all water rides.

            // Find the index 'k' of the first water ride whose start time is strictly greater than landFinishTime.
            // This splits water rides into two groups:
            // Group A: waterRides[0...k-1] where ws <= landFinishTime
            // Group B: waterRides[k...m-1] where ws > landFinishTime
            int k = findFirstGreaterThan(waterRides, landFinishTime, COMPARATOR_BY_START_TIME);

            // Subcase 1.1: Consider water rides where ws <= landFinishTime (Group A).
            // The finish time is landFinishTime + wd. To minimize this, we need the minimum wd in this group.
            if (k > 0) {
                // minWaterDurationPrefix[k-1] gives the minimum duration for waterRides[0...k-1].
                long potentialFinish1_1 = landFinishTime + minWaterDurationPrefix[k - 1];
                minFinishTime = Math.min(minFinishTime, potentialFinish1_1);
            }

            // Subcase 1.2: Consider water rides where ws > landFinishTime (Group B).
            // The finish time is ws + wd. To minimize this, we need the minimum ws + wd in this group.
            if (k < m) {
                // minWaterFinishTimeSuffix[k] gives the minimum finish time (ws + wd) for waterRides[k...m-1].
                long potentialFinish1_2 = minWaterFinishTimeSuffix[k];
                minFinishTime = Math.min(minFinishTime, potentialFinish1_2);
            }

            // Case 2: Water ride first, then Land ride.
            // Finish time = max(waterStartTime + waterDuration, ls) + ld
            // We want to minimize this over all water rides.
            // For a fixed land ride (ls, ld), we want to minimize max(ws + wd, ls) + ld.
            // This is equivalent to minimizing max(ws + wd, ls) over all water rides.
            // The smallest possible value for ws + wd over all water rides is minOverallWaterFinishTime.
            // So, the minimum finish time in this scenario for the current land ride is max(minOverallWaterFinishTime, ls) + ld.
            long potentialFinish2 = Math.max(minOverallWaterFinishTime, ls) + ld;
            minFinishTime = Math.min(minFinishTime, potentialFinish2);
        }

        return minFinishTime;
    }

    /**
     * Finds the index of the first element in a sorted array of Rides whose startTime is strictly greater than 'target'.
     * This is equivalent to finding the upper_bound for 'target'.
     *
     * @param rides    The sorted array of Rides.
     * @param target   The value to compare against.
     * @param comparator The comparator to sort/compare Rides.
     * @return The index of the first element greater than target, or rides.length if all elements are less than or equal to target.
     */
    private int findFirstGreaterThan(Ride[] rides, long target, java.util.Comparator<Ride> comparator) {
        int low = 0;
        int high = rides.length; // Exclusive upper bound

        while (low < high) {
            int mid = low + (high - low) / 2;
            // Create a dummy ride for comparison, only startTime matters for this search.
            Ride midRide = new Ride(rides[mid].startTime, 0);

            // If the middle ride's startTime is less than or equal to target,
            // it means all elements from low to mid (inclusive) are not strictly greater than target.
            // So, we need to search in the right half (mid + 1 to high).
            if (comparator.compare(midRide, new Ride(target, 0)) <= 0) {
                low = mid + 1;
            } else {
                // If the middle ride's startTime is strictly greater than target,
                // it means mid *could* be the first element greater than target.
                // So, we search in the left half (low to mid) to find an even earlier index.
                high = mid;
            }
        }
        // 'low' will be the index of the first element strictly greater than target.
        // If all elements are <= target, low will become rides.length.
        return low;
    }
}
```