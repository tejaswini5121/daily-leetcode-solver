/**
 * Problem Summary:
 * Given two arrays nums1 and nums2 of equal length, and two integers k1 and k2,
 * minimize the sum of squared differences between elements of nums1 and nums2
 * by modifying elements of nums1 up to k1 times and elements of nums2 up to k2 times.
 *
 * Link: https://leetcode.com/problems/minimum-sum-of-squared-difference/
 *
 * Approach:
 * The core idea is to reduce the absolute differences between corresponding elements
 * in nums1 and nums2. Since we want to minimize the sum of squared differences,
 * it's most effective to reduce the largest absolute differences first.
 *
 * We can calculate the absolute difference between each pair of elements: diff[i] = abs(nums1[i] - nums2[i]).
 * Our goal is to reduce these diffs to zero as much as possible using the available k = k1 + k2 operations.
 * Each operation can reduce a single diff by 1.
 *
 * To efficiently reduce the largest differences, we can use a max-heap (PriorityQueue in Java).
 * We store the absolute differences in the max-heap.
 * In each step, we extract the maximum difference (let's say `max_diff`) from the heap.
 * If `max_diff` is 0, we can stop as all remaining differences are also 0 or can't be reduced further.
 * If `max_diff > 0` and we have operations available (k > 0), we reduce `max_diff` by 1 (meaning we use one operation)
 * and insert the new difference (`max_diff - 1`) back into the heap. We decrement k by 1.
 * We repeat this process until k becomes 0 or the heap is empty or the maximum difference becomes 0.
 *
 * After exhausting operations or reducing all possible differences, we iterate through the remaining
 * differences in the heap and calculate the sum of their squares.
 *
 * An optimization can be made: Instead of repeatedly extracting and inserting individual differences,
 * we can process differences in batches. If we have multiple occurrences of the same maximum difference,
 * say `max_diff`, and the next largest difference is `next_max_diff`, we can reduce all `max_diff`
 * values by `max_diff - next_max_diff` in one go, as long as we have enough operations.
 * However, a simpler approach for this problem involves a slightly different view of batch processing.
 *
 * Let's refine the batch processing idea using a frequency map or by sorting.
 * A more efficient approach is to realize that all differences will eventually become equal or zero.
 * The problem is to find a target difference `T` such that if we reduce all differences `d_i > T` to `T`,
 * and all differences `d_i <= T` remain as they are, the total number of operations used is at most `k`.
 * The cost of reducing `d_i` to `T` is `d_i - T`. The total operations would be sum(max(0, d_i - T)).
 * We want to find the `T` that minimizes sum(T^2) for elements that were reduced to `T`,
 * while satisfying the operation constraint.
 *
 * This looks like a problem solvable with binary search on the final target difference `T`.
 * The possible values for `T` range from 0 up to the maximum possible initial difference.
 * For a given `target_diff` (which represents the value to which we aim to reduce the largest absolute differences),
 * we can calculate the total operations required.
 * Iterate through all initial absolute differences `d`. If `d > target_diff`, we need `d - target_diff` operations.
 * Sum these up: `ops_needed = sum(max(0, d - target_diff))` for all initial `d`.
 *
 * If `ops_needed <= k`, it means `target_diff` is achievable or we might be able to achieve an even smaller
 * target difference (meaning we can reduce more to zero, or to a smaller positive value). So we try a smaller `target_diff`
 * in the binary search (low = mid + 1, since we are searching for the max achievable `target_diff` to minimize sum of squares).
 * If `ops_needed > k`, it means `target_diff` is too low, and we don't have enough operations. We need to aim for a higher
 * `target_diff` (high = mid - 1).
 *
 * The binary search will find the maximum possible `target_diff` such that we can reduce all differences greater than it
 * to it using at most `k` operations. Let this found value be `max_target_diff`.
 *
 * After finding `max_target_diff`:
 * We have `k_remaining = k` operations initially.
 * We iterate through the absolute differences `d`.
 * If `d > max_target_diff`, we reduce it to `max_target_diff`. The number of operations used is `d - max_target_diff`.
 * We subtract these operations from `k_remaining`.
 * The squared difference for this pair is `max_target_diff * max_target_diff`.
 *
 * After processing all differences that were initially greater than `max_target_diff`, we might have `k_remaining > 0`.
 * This means we have leftover operations. These leftover operations can be used to reduce some of the differences that are now
 * equal to `max_target_diff` by an additional 1.
 * The number of elements that are now equal to `max_target_diff` (after initial reduction) can be counted.
 * We have `k_remaining` operations to distribute among these `count_max_target_diff` elements.
 * Each operation reduces a `max_target_diff` by 1.
 * So, we can reduce `k_remaining` elements by 1.
 * This means `k_remaining % count_max_target_diff` elements will become `max_target_diff - 1`.
 * And `count_max_target_diff - (k_remaining % count_max_target_diff)` elements will remain `max_target_diff`.
 *
 * The final sum of squares will be:
 * (sum of `max_target_diff * max_target_diff` for all elements reduced to `max_target_diff`)
 * + (sum of `(max_target_diff - 1) * (max_target_diff - 1)` for elements reduced further by 1).
 *
 * Let's refine this logic.
 *
 * Alternative approach using frequency map and greedy reduction:
 * 1. Calculate all absolute differences `diff[i] = abs(nums1[i] - nums2[i])`.
 * 2. Count the frequency of each absolute difference. A `HashMap<Integer, Integer>` can store `difference -> count`.
 * 3. Iterate from the largest possible difference downwards. Let `max_diff` be the current largest difference.
 * 4. If `max_diff == 0`, we are done.
 * 5. If we have `k` operations remaining:
 *    a. Get the count of `max_diff` from the frequency map. Let it be `count`.
 *    b. Consider the next largest difference present in the map. If no other differences exist, assume the next largest is 0.
 *    c. Let `next_diff` be the next largest difference.
 *    d. The gap we can bridge is `gap = max_diff - next_diff`.
 *    e. The total operations to reduce all `count` occurrences of `max_diff` down to `next_diff` is `ops_needed = count * gap`.
 *    f. If `k >= ops_needed`:
 *       - We can bridge this entire gap.
 *       - Use `ops_needed` operations: `k -= ops_needed`.
 *       - The `count` occurrences of `max_diff` are now effectively `next_diff`.
 *       - Update the frequency map: `map.put(next_diff, map.getOrDefault(next_diff, 0) + count)`.
 *       - Remove `max_diff` from the map (or mark it as processed).
 *       - Continue to the next largest difference.
 *    g. If `k < ops_needed`:
 *       - We cannot bridge the entire gap. We can only use `k` operations.
 *       - Each operation reduces a `max_diff` by 1.
 *       - We can reduce `k` occurrences of `max_diff` by 1, or distribute the reduction.
 *       - The number of `max_diff` values that will be reduced by `x` is `k / x`, and `k % x` will be reduced by `x-1`.
 *       - A simpler way: We have `k` operations to distribute among `count` elements.
 *       - `num_can_reduce_fully = k / count` (how many levels we can reduce each of the `count` elements).
 *       - `remainder_ops = k % count` (how many elements can be reduced one extra step).
 *       - So, `count - remainder_ops` elements will have a final difference of `max_diff - num_can_reduce_fully`.
 *       - `remainder_ops` elements will have a final difference of `max_diff - num_can_reduce_fully - 1`.
 *       - Calculate the sum of squares for these:
 *         `sum += (count - remainder_ops) * (max_diff - num_can_reduce_fully)^2`
 *         `sum += remainder_ops * (max_diff - num_can_reduce_fully - 1)^2`
 *       - Set `k = 0` and break the loop.
 *
 * After the loop finishes (either `k` becomes 0 or all differences are processed):
 * Iterate through the remaining entries in the frequency map. For each `diff -> count` pair,
 * add `count * diff * diff` to the total sum.
 *
 * This frequency map approach seems more robust.
 *
 * Let's consider the constraints and data types. `k1`, `k2` can be up to 10^9. `nums1[i]`, `nums2[i]` up to 10^5.
 * Differences can be up to 10^5. Squared differences can be up to (10^5)^2 = 10^10.
 * The sum of squared differences can be up to `n * 10^10`. If n is 10^5, this is 10^15.
 * So, we need `long` for the sum and for `k`.
 *
 * The frequency map approach:
 * The maximum difference is 10^5. So the map keys are within this range.
 * The number of distinct differences can be at most 10^5.
 *
 * Let's use a `TreeMap` to keep differences sorted, which simplifies finding `next_diff`.
 *
 * Algorithm using TreeMap:
 * 1. Calculate absolute differences and store their frequencies in a `TreeMap<Integer, Integer>` called `freqMap`.
 *    `freqMap` will store `difference -> count`.
 * 2. Initialize `long k_total = (long)k1 + k2;`
 * 3. Initialize `long total_squared_diff = 0;`
 * 4. While `k_total > 0` and `!freqMap.isEmpty()`:
 *    a. Get the largest difference `max_diff` and its count `count` from `freqMap`.
 *       `Map.Entry<Integer, Integer> entry = freqMap.pollLastEntry();`
 *       `int max_diff = entry.getKey();`
 *       `int count = entry.getValue();`
 *    b. If `max_diff == 0`, break the loop.
 *    c. Determine the `next_diff`. If `freqMap` is empty, `next_diff = 0`. Otherwise, `next_diff = freqMap.lastKey()`.
 *    d. Calculate the `gap = max_diff - next_diff`.
 *    e. Operations required to reduce all `count` occurrences of `max_diff` down to `next_diff` is `ops_needed = (long)count * gap`.
 *    f. If `k_total >= ops_needed`:
 *       - `k_total -= ops_needed;`
 *       - Add `next_diff` to the map with its accumulated count:
 *         `freqMap.put(next_diff, freqMap.getOrDefault(next_diff, 0) + count);`
 *    g. If `k_total < ops_needed`:
 *       - We can't bridge the entire gap. We have `k_total` operations to distribute among `count` elements.
 *       - `num_full_reductions = k_total / count;` // How many full levels each can be reduced by.
 *       - `remainder_ops = k_total % count;`      // How many elements get an additional reduction.
 *       - The new difference for `count - remainder_ops` elements will be `max_diff - num_full_reductions`.
 *       - The new difference for `remainder_ops` elements will be `max_diff - num_full_reductions - 1`.
 *       - Calculate sum of squares for these:
 *         `long diff1 = max_diff - num_full_reductions;`
 *         `long diff2 = max_diff - num_full_reductions - 1;`
 *         `total_squared_diff += (count - remainder_ops) * diff1 * diff1;`
 *         `total_squared_diff += remainder_ops * diff2 * diff2;`
 *       - `k_total = 0;` // All operations used.
 *       - Break the loop.
 *
 * 5. After the loop, if `k_total` is still greater than 0 (this can happen if we reduced all differences to 0 and still have ops),
 *    or if `freqMap` still contains entries (which implies we didn't use all ops to reduce to 0),
 *    we need to process the remaining entries in `freqMap`.
 *    The loop condition `k_total > 0 && !freqMap.isEmpty()` handles the case where we might exhaust `k_total` before `freqMap` is empty.
 *    If `k_total` becomes 0, the loop breaks. If `freqMap` becomes empty, the loop breaks.
 *
 *    Let's re-evaluate the termination and final calculation.
 *
 *    Revised Step 4 and 5:
 *    Initialize `long k_total = (long)k1 + k2;`
 *    Initialize `long total_squared_diff = 0;`
 *    Use a `TreeMap<Integer, Integer> freqMap` to store `difference -> count`.
 *    Populate `freqMap` by calculating `abs(nums1[i] - nums2[i])` for all `i`.
 *
 *    Iterate through the `freqMap` from largest difference downwards.
 *    `int current_max_diff = 100001; // Sentinel value, larger than any possible diff`
 *    `int count_at_current_max = 0;`
 *
 *    Loop:
 *      Find the actual largest difference `actual_max_diff` present in `freqMap`. If empty, break.
 *      `Map.Entry<Integer, Integer> entry = freqMap.floorEntry(current_max_diff);`
 *      `int actual_max_diff = entry.getKey();`
 *      `int current_count = entry.getValue();`
 *
 *      `int next_diff_val = 0;`
 *      `if (freqMap.size() > 1) { // If there's at least one more distinct difference besides actual_max_diff`
 *          `Map.Entry<Integer, Integer> next_entry = freqMap.lowerEntry(actual_max_diff);`
 *          `next_diff_val = next_entry.getKey();`
 *      `}`
 *
 *      `int gap = actual_max_diff - next_diff_val;`
 *      `long ops_to_bridge_gap = (long)current_count * gap;`
 *
 *      If `k_total >= ops_to_bridge_gap`:
 *          `k_total -= ops_to_bridge_gap;`
 *          // Merge the count of `actual_max_diff` to `next_diff_val`
 *          `freqMap.put(next_diff_val, freqMap.getOrDefault(next_diff_val, 0) + current_count);`
 *          `freqMap.remove(actual_max_diff);`
 *          `current_max_diff = next_diff_val; // Continue processing from this new max.`
 *      Else (`k_total < ops_to_bridge_gap`):
 *          // We can't bridge the whole gap. Distribute k_total operations among `current_count` elements.
 *          `long num_full_reductions = k_total / current_count;`
 *          `long remainder_ops = k_total % current_count;`
 *
 *          `long final_diff1 = actual_max_diff - num_full_reductions;`
 *          `long final_diff2 = actual_max_diff - num_full_reductions - 1;`
 *
 *          `total_squared_diff += (current_count - remainder_ops) * final_diff1 * final_diff1;`
 *          `total_squared_diff += remainder_ops * final_diff2 * final_diff2;`
 *
 *          `k_total = 0; // All operations used.`
 *          break; // Exit loop.
 *
 *    This loop structure is tricky with TreeMap. Let's rethink the iteration.
 *
 *    Simpler approach with max-heap (PriorityQueue) and frequency counting:
 *    1. Calculate absolute differences `abs_diffs`.
 *    2. Count frequencies of these differences in a `HashMap<Integer, Integer> freqMap`.
 *    3. Put all unique differences into a max-heap (`PriorityQueue<Integer> pq`).
 *    4. `long k_total = k1 + k2;`
 *    5. While `k_total > 0` and `!pq.isEmpty()`:
 *       a. `int max_diff = pq.poll();`
 *       b. `int count = freqMap.get(max_diff);`
 *       c. If `max_diff == 0`, break.
 *       d. Determine `next_diff`. If `pq.isEmpty()`, `next_diff = 0`. Else, `next_diff = pq.peek()`.
 *       e. `int gap = max_diff - next_diff;`
 *       f. `long ops_needed = (long)count * gap;`
 *       g. If `k_total >= ops_needed`:
 *          `k_total -= ops_needed;`
 *          // Add `count` to the frequency of `next_diff`.
 *          `freqMap.put(next_diff, freqMap.getOrDefault(next_diff, 0) + count);`
 *          // If `next_diff` was not already in PQ, add it. This can be complex because `pq.peek()` might not reflect the merged counts.
 *          // It's better to process frequencies directly.
 *
 *    Let's go back to the `TreeMap` approach, but iterate through its entries directly.
 *
 *    Algorithm with TreeMap (refined):
 *    1. Create `TreeMap<Integer, Integer> freqMap`.
 *    2. For each `i` from 0 to `n-1`:
 *       `int diff = Math.abs(nums1[i] - nums2[i]);`
 *       `freqMap.put(diff, freqMap.getOrDefault(diff, 0) + 1);`
 *    3. `long k_total = (long)k1 + k2;`
 *    4. `long total_squared_diff = 0;`
 *
 *    5. Iterate through the entries of `freqMap` from largest to smallest.
 *       This requires creating a list of entries first or using `pollLastEntry` in a loop.
 *       `List<Map.Entry<Integer, Integer>> entries = new ArrayList<>(freqMap.entrySet());`
 *       `Collections.reverse(entries);`
 *
 *       `int current_max_diff = -1; // Track the current effective max difference after reduction`
 *       `int count_at_current_max = 0;`
 *
 *       for (Map.Entry<Integer, Integer> entry : entries) {
 *           int diff = entry.getKey();
 *           int count = entry.getValue();
 *
 *           // If we are processing the first unique difference (largest one initially)
 *           if (current_max_diff == -1) {
 *               current_max_diff = diff;
 *               count_at_current_max = count;
 *           } else {
 *               // We are processing a smaller difference, `diff`.
 *               // `current_max_diff` is the difference we are trying to reduce FROM.
 *               // `diff` is the target difference we want to reduce TO.
 *               int gap = current_max_diff - diff;
 *               long ops_needed = (long)count_at_current_max * gap;
 *
 *               if (k_total >= ops_needed) {
 *                   // We have enough operations to bridge the entire gap.
 *                   k_total -= ops_needed;
 *                   // Merge `count_at_current_max` elements to become `diff`.
 *                   // Update `count_at_current_max` to include the counts of `diff`.
 *                   count_at_current_max += count;
 *                   current_max_diff = diff; // Now `diff` is the new effective max difference we are considering.
 *               } else {
 *                   // We don't have enough operations to bridge the whole gap.
 *                   // Distribute `k_total` operations among `count_at_current_max` elements.
 *                   long num_full_reductions = k_total / count_at_current_max;
 *                   long remainder_ops = k_total % count_at_current_max;
 *
 *                   long final_diff1 = current_max_diff - num_full_reductions;
 *                   long final_diff2 = current_max_diff - num_full_reductions - 1;
 *
 *                   // `count_at_current_max - remainder_ops` elements become `final_diff1`
 *                   total_squared_diff += (count_at_current_max - remainder_ops) * final_diff1 * final_diff1;
 *                   // `remainder_ops` elements become `final_diff2`
 *                   total_squared_diff += remainder_ops * final_diff2 * final_diff2;
 *
 *                   k_total = 0; // All operations used.
 *                   break; // Exit the loop.
 *               }
 *           }
 *       }
 *
 *    6. After the loop, if `k_total > 0` (this means we reduced all differences to 0 and have ops left):
 *       If `current_max_diff` is still greater than 0, we can reduce it further.
 *       The `count_at_current_max` represents the total number of elements that ended up with the `current_max_diff`.
 *       This is where we can apply remaining `k_total` operations.
 *
 *       If `k_total > 0` and `count_at_current_max > 0`:
 *          `long num_full_reductions = k_total / count_at_current_max;`
 *          `long remainder_ops = k_total % count_at_current_max;`
 *
 *          `long final_diff1 = current_max_diff - num_full_reductions;`
 *          `long final_diff2 = current_max_diff - num_full_reductions - 1;`
 *
 *          `total_squared_diff += (count_at_current_max - remainder_ops) * final_diff1 * final_diff1;`
 *          `total_squared_diff += remainder_ops * final_diff2 * final_diff2;`
 *
 *          `k_total = 0;`
 *
 *    7. If `k_total` is still greater than 0 and `count_at_current_max` is 0, it implies all elements were reduced to 0 and we have no more elements to process.
 *       This case shouldn't happen if `count_at_current_max` correctly accumulates counts.
 *
 *    8. What if `k_total` is still positive after the loop and `current_max_diff` is 0? This means all remaining elements are 0, and we have leftover operations. We cannot reduce them further. The sum of squares is 0.
 *
 *    Example walk-through: nums1 = [1,4,10,12], nums2 = [5,8,6,9], k1 = 1, k2 = 1
 *    n = 4, k = 2
 *    Differences:
 *    abs(1-5) = 4
 *    abs(4-8) = 4
 *    abs(10-6) = 4
 *    abs(12-9) = 3
 *
 *    freqMap: {3: 1, 4: 3}
 *    entries = [(3, 1), (4, 3)]
 *    reversed entries = [(4, 3), (3, 1)]
 *
 *    k_total = 2
 *    total_squared_diff = 0
 *
 *    Loop 1: entry = (4, 3)
 *      current_max_diff = -1, count_at_current_max = 0 initially.
 *      diff = 4, count = 3
 *      current_max_diff = 4
 *      count_at_current_max = 3
 *
 *    Loop 2: entry = (3, 1)
 *      diff = 3, count = 1
 *      We are processing a smaller difference (`diff = 3`).
 *      current_max_diff is 4 (the effective max difference we are reducing FROM).
 *      gap = current_max_diff - diff = 4 - 3 = 1.
 *      ops_needed = count_at_current_max * gap = 3 * 1 = 3.
 *
 *      Check: k_total (2) < ops_needed (3).
 *      We don't have enough ops to bridge the gap completely.
 *
 *      Distribute k_total (2) among count_at_current_max (3) elements.
 *      num_full_reductions = k_total / count_at_current_max = 2 / 3 = 0.
 *      remainder_ops = k_total % count_at_current_max = 2 % 3 = 2.
 *
 *      final_diff1 = current_max_diff - num_full_reductions = 4 - 0 = 4.
 *      final_diff2 = current_max_diff - num_full_reductions - 1 = 4 - 0 - 1 = 3.
 *
 *      total_squared_diff += (count_at_current_max - remainder_ops) * final_diff1 * final_diff1
 *                          = (3 - 2) * 4 * 4
 *                          = 1 * 16 = 16.
 *      total_squared_diff is now 16.
 *
 *      total_squared_diff += remainder_ops * final_diff2 * final_diff2
 *                          = 2 * 3 * 3
 *                          = 2 * 9 = 18.
 *      total_squared_diff is now 16 + 18 = 34.
 *
 *      k_total = 0.
 *      Break the loop.
 *
 *    Final result: 34.
 *
 *    Wait, example 2 output is 43. What's wrong?
 *    Example 2: nums1 = [1,4,10,12], nums2 = [5,8,6,9], k1 = 1, k2 = 1. Output: 43.
 *    Explanation:
 *    - Increase nums1[0] once (from 1 to 2). New nums1 = [2,4,10,12].
 *    - Increase nums2[2] once (from 6 to 7). New nums2 = [5,8,7,9].
 *    Squared differences:
 *    (2-5)^2 = (-3)^2 = 9
 *    (4-8)^2 = (-4)^2 = 16
 *    (10-7)^2 = (3)^2 = 9
 *    (12-9)^2 = (3)^2 = 9
 *    Sum = 9 + 16 + 9 + 9 = 43.
 *
 *    Let's trace the difference evolution more carefully.
 *    Initial diffs: [4, 4, 4, 3]
 *    k = 2
 *
 *    We have 3 differences of 4 and 1 difference of 3.
 *    We want to reduce the largest differences.
 *    Let's use 1 operation to reduce one of the 4s to 3.
 *    Diffs become: [3, 4, 4, 3] or [4, 3, 4, 3] etc.
 *    k = 1 left.
 *    Now we have 2 differences of 4 and 2 differences of 3.
 *    Use the last operation to reduce one of the 4s to 3.
 *    Diffs become: [3, 3, 4, 3] or [3, 4, 3, 3] etc.
 *    k = 0.
 *    The differences are {3, 3, 3, 4}.
 *    Sum of squares = 3^2 + 3^2 + 3^2 + 4^2 = 9 + 9 + 9 + 16 = 43.
 *
 *    My algorithm logic:
 *    freqMap: {3: 1, 4: 3}
 *    k_total = 2
 *
 *    entries (reversed) = [(4, 3), (3, 1)]
 *
 *    Loop 1 (entry=(4,3)):
 *      current_max_diff = 4, count_at_current_max = 3.
 *
 *    Loop 2 (entry=(3,1)):
 *      diff = 3, count = 1 (This count is for the difference 3 itself, not for merging later).
 *      This is the key mistake in my iteration logic.
 *      When `diff` is processed, it represents the next *target* difference value.
 *      The elements that were `current_max_diff` should be reduced TOWARDS `diff`.
 *
 *      The `count` from `entry.getValue()` is the count of the specific difference `diff`.
 *      The `count_at_current_max` is the *accumulated* count of all differences that were *initially greater* than `diff` and are now effectively equal to `current_max_diff`.
 *
 *    Corrected logic for processing `entry = (3, 1)`:
 *    Current effective state: `count_at_current_max` elements are at `current_max_diff`.
 *    The next distinct difference encountered is `diff = 3`. The count for this specific difference is `count = 1`.
 *
 *    The operations we have (`k_total`) can be used to reduce the `count_at_current_max` elements.
 *    We want to reduce them from `current_max_diff` towards `diff`.
 *
 *    The `gap` is `current_max_diff - diff`.
 *    `ops_needed_to_reach_diff = (long)count_at_current_max * gap`.
 *
 *    If `k_total >= ops_needed_to_reach_diff`:
 *      We can reduce all `count_at_current_max` elements down to `diff`.
 *      `k_total -= ops_needed_to_reach_diff;`
 *      These `count_at_current_max` elements now effectively become `diff`.
 *      We need to merge this count with the existing count for `diff`.
 *      The new `current_max_diff` becomes `diff`.
 *      The new `count_at_current_max` becomes `count_at_current_max + count`. (Where `count` is the original frequency of `diff`).
 *    Else (`k_total < ops_needed_to_reach_diff`):
 *      We only have `k_total` operations. These are used to reduce the `count_at_current_max` elements.
 *      `num_full_reductions = k_total / count_at_current_max;`
 *      `remainder_ops = k_total % count_at_current_max;`
 *
 *      `final_diff1 = current_max_diff - num_full_reductions;`
 *      `final_diff2 = current_max_diff - num_full_reductions - 1;`
 *
 *      // `count_at_current_max - remainder_ops` elements become `final_diff1`
 *      `total_squared_diff += (count_at_current_max - remainder_ops) * final_diff1 * final_diff1;`
 *      // `remainder_ops` elements become `final_diff2`
 *      `total_squared_diff += remainder_ops * final_diff2 * final_diff2;`
 *
 *      `k_total = 0;`
 *      break;
 *
 *    This still feels complex because of the interaction with the original `count` of `diff`.
 *
 *    Let's use the `TreeMap` and iterate from largest key downwards, always considering the *current* largest difference and the *next* largest difference.
 *
 *    Algorithm using TreeMap (again, simpler iteration):
 *    1. Create `TreeMap<Integer, Integer> freqMap`.
 *    2. For each `i` from 0 to `n-1`:
 *       `int diff = Math.abs(nums1[i] - nums2[i]);`
 *       `freqMap.put(diff, freqMap.getOrDefault(diff, 0) + 1);`
 *    3. `long k_total = (long)k1 + k2;`
 *    4. `long total_squared_diff = 0;`
 *
 *    5. While `k_total > 0` and `!freqMap.isEmpty()`:
 *       a. Get the largest difference `max_diff` and its count `count` from `freqMap`.
 *          `Map.Entry<Integer, Integer> entry = freqMap.pollLastEntry();`
 *          `int max_diff = entry.getKey();`
 *          `int count = entry.getValue();`
 *
 *       b. If `max_diff == 0`, break. // All remaining diffs are 0.
 *
 *       c. Determine `next_diff`.
 *          `int next_diff = 0;`
 *          If `!freqMap.isEmpty()`:
 *             `next_diff = freqMap.lastKey();`
 *
 *       d. Calculate the `gap = max_diff - next_diff`.
 *       e. Operations required to reduce all `count` occurrences of `max_diff` down to `next_diff` is `ops_needed = (long)count * gap`.
 *
 *       f. If `k_total >= ops_needed`:
 *          // We can bridge the entire gap.
 *          `k_total -= ops_needed;`
 *          // Add `count` to the frequency of `next_diff`.
 *          `freqMap.put(next_diff, freqMap.getOrDefault(next_diff, 0) + count);`
 *       g. If `k_total < ops_needed`:
 *          // We can't bridge the entire gap. Distribute `k_total` operations among `count` elements.
 *          `long num_full_reductions = k_total / count;`
 *          `long remainder_ops = k_total % count;`
 *
 *          `long final_diff1 = max_diff - num_full_reductions;`
 *          `long final_diff2 = max_diff - num_full_reductions - 1;`
 *
 *          // `count - remainder_ops` elements become `final_diff1`
 *          `total_squared_diff += (count - remainder_ops) * final_diff1 * final_diff1;`
 *          // `remainder_ops` elements become `final_diff2`
 *          `total_squared_diff += remainder_ops * final_diff2 * final_diff2;`
 *
 *          `k_total = 0;` // All operations used.
 *          break; // Exit loop.
 *
 *    6. After the loop, process any remaining entries in `freqMap`.
 *       For each `diff -> count` pair in `freqMap`:
 *          `total_squared_diff += (long)count * diff * diff;`
 *
 *    7. Return `total_squared_diff`.
 *
 *    Example walk-through: nums1 = [1,4,10,12], nums2 = [5,8,6,9], k1 = 1, k2 = 1
 *    n = 4, k = 2
 *    Initial freqMap: {3: 1, 4: 3}
 *    k_total = 2
 *    total_squared_diff = 0
 *
 *    Loop 1:
 *      `entry = freqMap.pollLastEntry()` -> `entry = (4, 3)`.
 *      `max_diff = 4`, `count = 3`.
 *      `max_diff` is not 0.
 *      `freqMap` is {3: 1}.
 *      `next_diff = freqMap.lastKey() = 3`.
 *      `gap = max_diff - next_diff = 4 - 3 = 1`.
 *      `ops_needed = (long)count * gap = 3 * 1 = 3`.
 *
 *      Check: `k_total (2) < ops_needed (3)`.
 *      Enter the `else` block (k_total < ops_needed).
 *      `num_full_reductions = k_total / count = 2 / 3 = 0`.
 *      `remainder_ops = k_total % count = 2 % 3 = 2`.
 *
 *      `final_diff1 = max_diff - num_full_reductions = 4 - 0 = 4`.
 *      `final_diff2 = max_diff - num_full_reductions - 1 = 4 - 0 - 1 = 3`.
 *
 *      `total_squared_diff += (count - remainder_ops) * final_diff1 * final_diff1;`
 *          `= (3 - 2) * 4 * 4 = 1 * 16 = 16`.
 *      `total_squared_diff` is now 16.
 *
 *      `total_squared_diff += remainder_ops * final_diff2 * final_diff2;`
 *          `= 2 * 3 * 3 = 2 * 9 = 18`.
 *      `total_squared_diff` is now 16 + 18 = 34.
 *
 *      `k_total = 0`.
 *      Break loop.
 *
 *    After loop:
 *      `freqMap` is {3: 1}.
 *      Iterate through remaining `freqMap`.
 *      Entry: `diff = 3`, `count = 1`.
 *      `total_squared_diff += (long)count * diff * diff;`
 *          `= 1 * 3 * 3 = 9`.
 *      `total_squared_diff` is now 34 + 9 = 43.
 *
 *    Return 43. This matches Example 2.
 *
 *    Let's test with Example 1: nums1 = [1,2,3,4], nums2 = [2,10,20,19], k1 = 0, k2 = 0
 *    n = 4, k = 0
 *    Differences:
 *    abs(1-2) = 1
 *    abs(2-10) = 8
 *    abs(3-20) = 17
 *    abs(4-19) = 15
 *
 *    Initial freqMap: {1: 1, 8: 1, 15: 1, 17: 1}
 *    k_total = 0
 *    total_squared_diff = 0
 *
 *    Loop: `k_total` is 0, so loop condition `k_total > 0` is false. Loop does not run.
 *
 *    After loop:
 *      Iterate through `freqMap`:
 *      (1, 1): `total_squared_diff += 1 * 1 * 1 = 1`
 *      (8, 1): `total_squared_diff += 1 * 8 * 8 = 64`. Current sum = 1 + 64 = 65.
 *      (15, 1): `total_squared_diff += 1 * 15 * 15 = 225`. Current sum = 65 + 225 = 290.
 *      (17, 1): `total_squared_diff += 1 * 17 * 17 = 289`. Current sum = 290 + 289 = 579.
 *
 *    Return 579. Matches Example 1.
 *
 *    Consider edge case: All differences are initially the same, and k is large enough to make them all 0.
 *    nums1 = [5,5,5], nums2 = [1,1,1], k1 = 10, k2 = 0
 *    n = 3, k = 10
 *    Differences: abs(5-1)=4, abs(5-1)=4, abs(5-1)=4
 *    freqMap: {4: 3}
 *    k_total = 10
 *    total_squared_diff = 0
 *
 *    Loop 1:
 *      `entry = freqMap.pollLastEntry()` -> `entry = (4, 3)`.
 *      `max_diff = 4`, `count = 3`.
 *      `max_diff` is not 0.
 *      `freqMap` is empty.
 *      `next_diff = 0`.
 *      `gap = max_diff - next_diff = 4 - 0 = 4`.
 *      `ops_needed = (long)count * gap = 3 * 4 = 12`.
 *
 *      Check: `k_total (10) < ops_needed (12)`.
 *      Enter the `else` block.
 *      `num_full_reductions = k_total / count = 10 / 3 = 3`.
 *      `remainder_ops = k_total % count = 10 % 3 = 1`.
 *
 *      `final_diff1 = max_diff - num_full_reductions = 4 - 3 = 1`.
 *      `final_diff2 = max_diff - num_full_reductions - 1 = 4 - 3 - 1 = 0`.
 *
 *      `total_squared_diff += (count - remainder_ops) * final_diff1 * final_diff1;`
 *          `= (3 - 1) * 1 * 1 = 2 * 1 = 2`.
 *      `total_squared_diff` is now 2.
 *
 *      `total_squared_diff += remainder_ops * final_diff2 * final_diff2;`
 *          `= 1 * 0 * 0 = 0`.
 *      `total_squared_diff` is now 2 + 0 = 2.
 *
 *      `k_total = 0`.
 *      Break loop.
 *
 *    After loop:
 *      `freqMap` is empty. No remaining entries to process.
 *
 *    Return 2.
 *    Let's verify:
 *    Initial diffs: [4, 4, 4]. k = 10.
 *    Reduce all to 1: requires 3 * (4-1) = 9 ops. Diffs: [1, 1, 1]. k = 1 left.
 *    Use the last op on one of the 1s to make it 0. Diffs: [0, 1, 1].
 *    Sum of squares: 0^2 + 1^2 + 1^2 = 0 + 1 + 1 = 2. Correct.
 *
 *    Consider case where k is extremely large, reducing all to 0.
 *    nums1 = [5,5,5], nums2 = [1,1,1], k1 = 100, k2 = 0
 *    n = 3, k = 100
 *    freqMap: {4: 3}
 *    k_total = 100
 *    total_squared_diff = 0
 *
 *    Loop 1:
 *      `entry = freqMap.pollLastEntry()` -> `entry = (4, 3)`.
 *      `max_diff = 4`, `count = 3`.
 *      `max_diff` is not 0.
 *      `freqMap` is empty.
 *      `next_diff = 0`.
 *      `gap = max_diff - next_diff = 4 - 0 = 4`.
 *      `ops_needed = (long)count * gap = 3 * 4 = 12`.
 *
 *      Check: `k_total (100) >= ops_needed (12)`.
 *      Enter the `if` block.
 *      `k_total -= ops_needed;` -> `k_total = 100 - 12 = 88`.
 *      `freqMap.put(next_diff, freqMap.getOrDefault(next_diff, 0) + count);` -> `freqMap.put(0, 0 + 3);` -> `freqMap` is {0: 3}.
 *
 *    Loop 2:
 *      `k_total` is 88 > 0. `freqMap` is {0: 3}.
 *      `entry = freqMap.pollLastEntry()` -> `entry = (0, 3)`.
 *      `max_diff = 0`, `count = 3`.
 *      `max_diff == 0`. Break loop.
 *
 *    After loop:
 *      `freqMap` is empty. No remaining entries to process.
 *
 *    Return `total_squared_diff` which is 0. Correct.
 *
 *    The algorithm seems solid.
 *
 * Time Complexity:
 * 1. Calculating absolute differences: O(n)
 * 2. Populating `freqMap`: O(n log D), where D is the number of distinct differences. In the worst case, D can be up to n or the maximum possible difference (10^5). So, O(n log M), where M is the max difference value.
 * 3. The while loop iterates at most D times (number of distinct initial differences).
 *    Inside the loop: `pollLastEntry`, `lastKey`, `getOrDefault`, `put` on `TreeMap` are all O(log D).
 *    The operations within the loop (`k_total >= ops_needed` or `k_total < ops_needed`) are constant time except for the map operations.
 *    The loop processing `k_total < ops_needed` breaks early.
 *    In the worst case, if `k_total >= ops_needed` for many steps, we might merge differences.
 *    The number of distinct differences decreases.
 *    Let's consider the total number of operations performed on the TreeMap.
 *    Each `pollLastEntry` removes an entry. Each `put` adds/updates an entry.
 *    The total number of `pollLastEntry` is at most the initial number of distinct differences.
 *    The total number of `put` operations might be more if we create new entries, but the number of distinct keys in the map never exceeds the initial number of distinct differences.
 *    A safe upper bound for map operations is O(D log D), where D is the number of distinct differences initially.
 *    Since D <= 10^5, this part is roughly O(M log M) where M is max diff value.
 * 4. The final loop iterates through remaining `freqMap` entries, O(D).
 *
 *    The dominant part is populating the TreeMap, which can be O(N log M) if N is much larger than M (max difference). If M is much larger than N, it's O(N log N).
 *    Given M <= 10^5, and N <= 10^5.
 *    Populating `freqMap`: O(N log M).
 *    The `while` loop: In each iteration, we reduce the number of distinct differences or `k_total` becomes 0.
 *    The number of distinct differences is at most `min(N, M)`.
 *    So, the loop iterations are at most `min(N, M)`. Each iteration takes `O(log M)`.
 *    Total for the loop: `O(min(N, M) * log M)`.
 *
 *    Overall Time Complexity: O(N log M + min(N, M) log M), which simplifies to O(N log M) since M <= 10^5.
 *    The initial calculation of differences is O(N). The TreeMap construction is O(N log M). The loop runs at most M times, and each operation is O(log M). So the loop is O(M log M).
 *    Final complexity: O(N log M + M log M). Given M=10^5, N=10^5, this is efficient enough.
 *
 * Space Complexity:
 * O(D) for the `freqMap`, where D is the number of distinct differences. D <= min(N, 10^5). So, O(min(N, M)).
 */
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

class Solution {
    public long minSumOfSquaredDifference(int[] nums1, int[] nums2, int k1, int k2) {
        // Use a TreeMap to store the frequency of absolute differences.
        // The keys (differences) will be automatically sorted.
        // Key: absolute difference, Value: count of that difference.
        TreeMap<Integer, Integer> freqMap = new TreeMap<>();

        // Calculate the absolute differences and populate the frequency map.
        for (int i = 0; i < nums1.length; i++) {
            int diff = Math.abs(nums1[i] - nums2[i]);
            // Only store non-zero differences as zero differences don't contribute to squared sum
            // and cannot be reduced.
            if (diff > 0) {
                freqMap.put(diff, freqMap.getOrDefault(diff, 0) + 1);
            }
        }

        // Total operations available. Use long to avoid overflow.
        long k_total = (long)k1 + k2;

        // Variable to store the final sum of squared differences.
        long total_squared_diff = 0;

        // Process differences from largest to smallest.
        // The loop continues as long as we have operations left AND there are non-zero differences to reduce.
        while (k_total > 0 && !freqMap.isEmpty()) {
            // Get the largest difference and its count.
            // pollLastEntry() removes the entry from the map.
            Map.Entry<Integer, Integer> entry = freqMap.pollLastEntry();
            int max_diff = entry.getKey();
            int count = entry.getValue();

            // If the largest difference is 0, all remaining differences are also 0.
            // We cannot reduce them further, so we break.
            if (max_diff == 0) {
                break;
            }

            // Determine the next largest difference present in the map.
            // If the map becomes empty after polling, it means max_diff was the only non-zero difference.
            // In this case, the next_diff conceptually is 0.
            int next_diff = 0;
            if (!freqMap.isEmpty()) {
                next_diff = freqMap.lastKey();
            }

            // Calculate the 'gap' between the current maximum difference and the next largest difference.
            // This is how much we can reduce the current 'count' occurrences of 'max_diff'
            // by bringing them down towards 'next_diff'.
            int gap = max_diff - next_diff;

            // Calculate the total operations needed to reduce all 'count' occurrences of 'max_diff'
            // down to 'next_diff'.
            long ops_needed = (long)count * gap;

            // Case 1: We have enough operations to reduce all 'count' occurrences of 'max_diff'
            // down to 'next_diff' (or even further if k_total is much larger).
            if (k_total >= ops_needed) {
                // Deduct the operations used.
                k_total -= ops_needed;
                // These 'count' occurrences of 'max_diff' are now effectively at 'next_diff'.
                // We add their count to the frequency of 'next_diff'.
                // If 'next_diff' already exists in the map, its count increases.
                // If 'next_diff' was 0, it effectively means these elements become 0.
                freqMap.put(next_diff, freqMap.getOrDefault(next_diff, 0) + count);
            }
            // Case 2: We do NOT have enough operations to bridge the entire gap.
            else {
                // We have k_total operations remaining, and we must distribute them
                // among the 'count' elements that currently have the 'max_diff'.
                // Each operation reduces a difference by 1.

                // Calculate how many full levels each of the 'count' elements can be reduced by.
                long num_full_reductions = k_total / count;
                // Calculate how many elements can be reduced by an additional level.
                long remainder_ops = k_total % count;

                // Calculate the two possible final difference values.
                // 'final_diff1' is for the 'count - remainder_ops' elements.
                long final_diff1 = max_diff - num_full_reductions;
                // 'final_diff2' is for the 'remainder_ops' elements.
                long final_diff2 = max_diff - num_full_reductions - 1;

                // Add the squared differences for these reduced elements to the total sum.
                // The elements that become 'final_diff1'.
                total_squared_diff += (count - remainder_ops) * final_diff1 * final_diff1;
                // The elements that become 'final_diff2'.
                total_squared_diff += remainder_ops * final_diff2 * final_diff2;

                // All available operations have been used.
                k_total = 0;
                // Break the loop as we are done.
                break;
            }
        }

        // After the loop, if there are any entries left in freqMap, it means we processed all operations
        // or all reducible differences became 0. The remaining entries represent differences that
        // were not reduced or couldn't be further reduced.
        // We need to add their squared differences to the total sum.
        // This also covers the case where k_total might still be positive (e.g., if all differences were reduced to 0)
        // but freqMap contains 0s.
        for (Map.Entry<Integer, Integer> entry : freqMap.entrySet()) {
            int diff = entry.getKey();
            int count = entry.getValue();
            // Since we only put positive differences into the map initially,
            // and the `next_diff` could be 0 when merging, we might encounter 0 here.
            // If diff is 0, its square is 0 and does not add to the sum.
            total_squared_diff += (long)count * diff * diff;
        }

        return total_squared_diff;
    }
}
