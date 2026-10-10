// Problem Summary: Minimize the sum of squared differences between two arrays by reducing the absolute differences using a given number of operations.
// Link: https://leetcode.com/problems/minimum-sum-of-squared-difference/
// Approach Explanation:
// The core idea is to greedily reduce the largest absolute differences first, as squaring these differences contributes the most to the total sum.
// 1. Calculate the absolute difference for each pair of elements in nums1 and nums2. Store these absolute differences.
// 2. The total number of allowed operations is k = k1 + k2.
// 3. We want to reduce the absolute differences as much as possible. Since we want to minimize the sum of squares, we should target the largest differences.
// 4. A max-heap (priority queue) is a suitable data structure to efficiently get the largest absolute difference.
// 5. We repeatedly extract the maximum absolute difference from the heap. If it's greater than 0 and we still have operations (k > 0), we decrement the difference by 1 and increment k. The reduced difference is then pushed back into the heap if it's still positive.
// 6. After exhausting operations or when all differences are 0, we calculate the sum of squares of the remaining differences in the heap.
// 7. Optimization: Instead of a full heap simulation, we can observe that multiple operations on the same difference will reduce it sequentially. We can group identical differences and process them in batches.
//    - Count the frequencies of each absolute difference.
//    - Iterate from the largest possible difference downwards.
//    - For each difference `diff`, if we have operations `k` available and there are elements with this difference, we can reduce `count` of these elements by `min(k, count)`.
//    - The `k` operations are used to reduce these `count` elements. The reduction per element will be `min(k, count)`.
//    - If `k >= count`, all `count` elements are reduced to `diff - count`. We then add `diff - count` to the frequency of `diff - count` and update `k` by subtracting `count`.
//    - If `k < count`, we reduce `k` elements by 1 each. The remaining `count - k` elements stay at `diff`. We update `k` to 0.
//    - This still involves iterating through differences. A more efficient approach is to use a frequency map or array and then process the largest differences.
//    - A heap is simpler to implement initially. For optimization, we can use a frequency array or map and then iterate.
//    - Let's stick to the heap approach for clarity and then consider optimization if needed.
//
// Refined Approach using frequency array:
// 1. Calculate all absolute differences `abs(nums1[i] - nums2[i])`.
// 2. Create a frequency map (or array if differences are within a reasonable bound) to store the count of each absolute difference.
// 3. The total operations available are `k = k1 + k2`.
// 4. Iterate from the maximum possible difference (10^5) down to 1.
// 5. For each difference `d`:
//    - Get the count `c` of elements that have this difference `d`.
//    - If `c > 0` and `k > 0`:
//        - The number of elements we can reduce is `num_to_reduce = min(c, k)`.
//        - These `num_to_reduce` elements will have their difference reduced.
//        - The reduction per element will be `reduction_amount = min(d, num_to_reduce)`. This is because we cannot reduce a difference below 0.
//        - Update the frequency of `d - reduction_amount` by adding `num_to_reduce`.
//        - Subtract `num_to_reduce` from `k`.
//        - If `d - reduction_amount > 0`, we have effectively moved `num_to_reduce` elements from difference `d` to `d - reduction_amount`. The original `c - num_to_reduce` elements at difference `d` remain at `d`.
//        - This logic can be simplified:
//          - For difference `d`, if `count[d] > 0` and `k > 0`:
//            - `ops_to_use = min(k, count[d])`.
//            - The target difference becomes `d - ops_to_use`.
//            - If `d - ops_to_use >= 0`:
//              - `count[d - ops_to_use] += count[d]` (transferring all elements from `d` to `d - ops_to_use`).
//            - Else (`d - ops_to_use < 0`):
//              - All `count[d]` elements are reduced to 0.
//            - `k -= count[d]` (effectively using `count[d]` operations).
//            - `count[d] = 0`.
//          - This is still not quite right. The reduction is applied *per element*.
//
// Let's reconsider the greedy strategy:
// We have `k = k1 + k2` operations.
// We have differences `d_1, d_2, ..., d_n`.
// We want to reduce the largest `d_i` values.
// The cost of reducing a difference `d` by 1 is `d^2 - (d-1)^2 = 2d - 1`.
// The marginal cost of reducing the largest difference is always the highest.
//
// Approach using a frequency map and binary search idea:
// 1. Calculate all absolute differences and store them.
// 2. Total operations `k = k1 + k2`.
// 3. Create a frequency map (or array) of absolute differences.
// 4. We want to find a target difference `T`. All differences greater than `T` should be reduced to `T` (or less if `k` runs out). Differences less than or equal to `T` remain as they are.
// 5. For a given `T`, we can calculate the total operations required to reduce all differences `d > T` to `T`.
//    `ops_needed(T) = sum(d - T)` for all `d > T` where `count[d] > 0`.
// 6. We can binary search for the maximum possible `T` such that `ops_needed(T) <= k`.
//    - The search space for `T` is from 0 to 10^5.
// 7. Once we find this `T`:
//    - We use `k_remaining = k - ops_needed(T)` operations.
//    - All differences `d > T` are reduced to `T`.
//    - The remaining `k_remaining` operations are used to reduce some of these `T` differences further.
//    - The number of elements that had `d > T` is `num_greater_than_T`.
//    - We can reduce `min(k_remaining, num_greater_than_T)` of these elements by 1.
//    - So, `num_to_reduce_by_one = min(k_remaining, num_greater_than_T)`.
//    - The number of elements reduced to `T - 1` is `num_to_reduce_by_one`.
//    - The number of elements remaining at `T` is `num_greater_than_T - num_to_reduce_by_one`.
//    - For elements `d <= T`, they remain `d`.
//
// Example Walkthrough with Binary Search idea:
// nums1 = [1,4,10,12], nums2 = [5,8,6,9], k1 = 1, k2 = 1
// k = 2
// Differences: |1-5|=4, |4-8|=4, |10-6|=4, |12-9|=3
// Differences: [4, 4, 4, 3]
// Frequencies: {3: 1, 4: 3}
// Max difference = 4. Max possible T = 4.
//
// Binary Search for T in [0, 4]:
// Try T = 2:
// Differences > 2 are 3 and 4.
// Count for 3 is 1. Need to reduce 3 to 2: 3-2 = 1 operation.
// Count for 4 is 3. Need to reduce 4 to 2: 4-2 = 2 operations per element. Total = 3 * 2 = 6 operations.
// Total ops_needed(2) = 1 + 6 = 7. This is > k (2). So T must be higher.
//
// Try T = 3:
// Differences > 3 is 4.
// Count for 4 is 3. Need to reduce 4 to 3: 4-3 = 1 operation per element. Total = 3 * 1 = 3 operations.
// Total ops_needed(3) = 3. This is > k (2). So T must be higher.
//
// Try T = 4:
// Differences > 4: None.
// Total ops_needed(4) = 0. This is <= k (2). So T=4 is possible.
//
// Let's re-think the binary search. The goal is to find the *smallest* value `X` such that if we reduce all differences `d > X` to `X`, the total operations are `<= k`.
//
// Binary Search for the final minimum difference `min_diff` after operations.
// All differences `d` will become `max(0, d - reduction_amount)`.
//
// Consider the function `can_achieve(target_max_diff)`:
// Given a `target_max_diff`, what is the minimum operations required to make sure all absolute differences are `<= target_max_diff`?
// For each difference `d`:
//   If `d > target_max_diff`, we need `d - target_max_diff` operations to reduce it to `target_max_diff`.
//   Total operations = sum of `(d - target_max_diff)` for all `d > target_max_diff`.
//
// We can binary search for `target_max_diff` in the range `[0, 10^5]`.
//
// Let `max_diff_val = 10^5`.
//
// `check(target_diff)`:
//   `operations_needed = 0`
//   Iterate through all distinct differences `d` in the frequency map:
//     If `d > target_diff`:
//       `operations_needed += (d - target_diff) * freq[d]`
//   Return `operations_needed <= k`.
//
// Binary search range for `target_diff`: `low = 0`, `high = max_diff_val`.
// `best_target_diff = 0`.
//
// While `low <= high`:
//   `mid = floor((low + high) / 2)`
//   If `check(mid)` is true:
//     `best_target_diff = mid`
//     `low = mid + 1`  // Try to achieve an even smaller maximum difference
//   Else:
//     `high = mid - 1` // Need to increase the target maximum difference
//
// After binary search, `best_target_diff` is the smallest value such that all differences can be reduced to be at most `best_target_diff` using at most `k` operations.
//
// Now, we know the target maximum difference. Let this be `T = best_target_diff`.
//
// Calculate the actual remaining operations:
// `ops_used_for_reduction = 0`
// For each difference `d` in freq:
//   If `d > T`:
//     `ops_used_for_reduction += (d - T) * freq[d]`
//
// `remaining_ops = k - ops_used_for_reduction`.
//
// These `remaining_ops` can be used to further reduce the differences that are now equal to `T`.
//
// The number of elements that ended up with difference `T` after the first reduction phase is:
// `count_at_T = freq[T]` (from original elements with difference T)
// `+ sum(freq[d] for d > T)` (elements that were reduced from `d > T` down to `T`).
//
// Total elements that can be further reduced (now at difference `T`):
// `num_reducible_to_T_minus_1 = 0`
// For `d` from `max_diff_val` down to `T + 1`:
//   `num_reducible_to_T_minus_1 += freq[d]`
//
// If `remaining_ops >= num_reducible_to_T_minus_1`:
//   All these `num_reducible_to_T_minus_1` elements can be reduced from `T` to `T - 1`.
//   The new maximum difference becomes `T - 1`.
//   `remaining_ops -= num_reducible_to_T_minus_1`.
//   The number of elements now at `T - 1` is `num_reducible_to_T_minus_1`.
//   The number of elements now at `T` is `freq[T]` (original elements).
//   The rest of the differences `d < T - 1` are unchanged.
//   This logic of "further reduction" is tricky.
//
// Let's simplify the final calculation of the sum of squares.
// After finding `best_target_diff = T`:
// We know `k` operations are used.
//
// Iterate through differences `d` from `max_diff_val` down to 0.
// If `freq[d] > 0`:
//   If `d <= T`:
//     All `freq[d]` elements contribute `d*d` to the sum.
//     Add `freq[d] * d * d` to the total sum.
//   Else (`d > T`):
//     These `freq[d]` elements need to be reduced.
//     We have `k` operations remaining to distribute among these elements.
//     The total number of elements that are currently greater than `T` is `num_elements_gt_T`.
//     `num_elements_gt_T = sum(freq[i] for i from T+1 to max_diff_val)`.
//
//     If `k >= freq[d]`:
//       We can reduce all `freq[d]` elements from difference `d` to `d - freq[d]`.
//       The new difference is `d_new = d - freq[d]`.
//       This `d_new` must be `>= T`.
//       We used `freq[d]` operations. `k -= freq[d]`.
//       The number of elements contributing `d_new * d_new` is `freq[d]`.
//     Else (`k < freq[d]`):
//       We can only reduce `k` of these elements.
//       `k` elements are reduced by 1, becoming `d - 1`.
//       `freq[d] - k` elements remain at difference `d`.
//       We used all `k` operations. `k = 0`.
//       The number of elements contributing `(d-1)*(d-1)` is `k`.
//       The number of elements contributing `d*d` is `freq[d] - k`.
//       We have used all `k`. The remaining `freq[d] - k` elements will stay at `d`.
//       This feels like simulating the operations again.
//
// Alternative: Use a max-heap to store the differences.
// 1. Calculate all absolute differences `diffs = [abs(nums1[i] - nums2[i]) for i in range(n)]`.
// 2. Put all non-zero differences into a max-heap.
// 3. `k = k1 + k2`.
// 4. While `k > 0` and heap is not empty:
//    `max_diff = heap.pop()`
//    `max_diff -= 1`
//    `k -= 1`
//    If `max_diff > 0`:
//      `heap.push(max_diff)`
// 5. Calculate sum of squares of elements remaining in the heap.
//
// Time complexity of heap approach:
// - Calculating differences: O(N)
// - Building heap: O(N log N) (or O(N) if all differences are distinct and sorted first)
// - While loop: In the worst case, we might reduce all differences to 0.
//   If `D` is the maximum initial difference, and `N` is the number of elements, the total number of operations could be up to `N * D`.
//   Each heap operation is O(log N). So, O(K * log N) if K operations are performed.
//   However, if K is very large, we might reduce all differences to 0.
//   Consider the total reduction needed to bring all differences to 0. Let this be `TotalDiffSum`.
//   If `k >= TotalDiffSum`, all differences become 0. Sum of squares is 0.
//   The number of heap operations is `min(k, TotalDiffSum)`.
//   Total complexity: O(N log N + min(k, N*D) * log N).
//   Given `k` can be up to 10^9, this is too slow if `k` is large and `D` is large.
//
// The frequency array approach with binary search is better.
// Max difference is 10^5.
//
// Let's use frequency array and iterate from largest diff.
// Max diff = 100000. Array size 100001.
// `freq` array of size 100001.
// `k = k1 + k2`.
//
// Populate `freq`:
// For `i` from 0 to `n-1`:
//   `diff = abs(nums1[i] - nums2[i])`
//   `freq[diff]++`
//
// Iterate from `d = 100000` down to 1.
// For each `d`:
//   If `freq[d] > 0` and `k > 0`:
//     `num_ops_to_use = min(k, freq[d])`
//     // These `num_ops_to_use` will reduce `num_ops_to_use` elements by 1 each.
//     // The target difference for these elements becomes `d - 1`.
//     // We are moving `num_ops_to_use` elements from count `freq[d]` to count `freq[d-1]`.
//     `freq[d - 1] += num_ops_to_use`
//     `freq[d] -= num_ops_to_use`
//     `k -= num_ops_to_use`
//
// This is not correct because we want to reduce the difference *by* `num_ops_to_use`, not necessarily reduce it to `d-1`.
// If we have `freq[d]` elements and `k` ops, we can reduce `min(k, freq[d])` elements by 1.
//
// Let's refine the frequency array iteration:
//
// `k = k1 + k2`
// `max_val = 100000`
// `freq = array of size max_val + 1, initialized to 0`
//
// For `i` from 0 to `n-1`:
//   `diff = abs(nums1[i] - nums2[i])`
//   `freq[diff]++`
//
// For `d` from `max_val` down to 1:
//   If `freq[d] > 0`:
//     // We have `freq[d]` elements with difference `d`.
//     // We can reduce these elements.
//     // The number of operations we can spend on these is `ops_to_spend_here = min(k, freq[d])`.
//     // These `ops_to_spend_here` operations will reduce `ops_to_spend_here` elements by 1.
//     // The difference becomes `d-1`.
//     // The count of elements that will have difference `d-1` increases by `ops_to_spend_here`.
//     // The count of elements that will have difference `d` decreases by `ops_to_spend_here`.
//
//     `ops_from_this_diff = min(k, freq[d])`
//     `freq[d - 1] += ops_from_this_diff`
//     `freq[d] -= ops_from_this_diff` // This element moves to d-1
//     `k -= ops_from_this_diff`
//
// After this loop, `k` might still be greater than 0. This means we have reduced all differences to 0.
//
// Example: diffs = [3, 4, 4, 4], k=2
// freq: {3:1, 4:3}
// d = 4: freq[4]=3. k=2. ops_from_this_diff = min(2, 3) = 2.
//        freq[3] += 2  => freq[3] = 1 + 2 = 3.
//        freq[4] -= 2  => freq[4] = 3 - 2 = 1.
//        k -= 2 => k = 0.
// freq: {3:3, 4:1}
// d = 3: freq[3]=3. k=0. No operations.
//
// Final freq: {3:3, 4:1}. This is incorrect. We should have reduced the differences.
//
// The issue is that `ops_from_this_diff` are applied one by one.
// When we reduce `freq[d]` by `ops_from_this_diff`, these elements are now at `d-1`.
//
// Correct Frequency Iteration:
// `k = k1 + k2`
// `max_val = 100000`
// `freq = array of size max_val + 1, initialized to 0`
//
// For `i` from 0 to `n-1`:
//   `diff = abs(nums1[i] - nums2[i])`
//   `freq[diff]++`
//
// // Iterate from largest difference down to 1
// For `d` from `max_val` down to 1:
//   // If there are elements with difference `d` and we still have operations:
//   If `freq[d] > 0` and `k > 0`:
//     // How many elements can we reduce from this difference `d`?
//     // We have `freq[d]` elements. We can use at most `freq[d]` operations to reduce these.
//     // We also have `k` operations available.
//     `num_to_reduce_from_d = min(k, freq[d])`
//
//     // These `num_to_reduce_from_d` elements will be reduced by 1.
//     // So, they move from difference `d` to `d - 1`.
//     `freq[d - 1] += num_to_reduce_from_d`
//     `freq[d] -= num_to_reduce_from_d` // This count is conceptually moved.
//     `k -= num_to_reduce_from_d`
//
// Example: diffs = [3, 4, 4, 4], k=2
// freq: {0:0, 1:0, 2:0, 3:1, 4:3}
// d=4: freq[4]=3, k=2. num_to_reduce_from_d = min(2, 3) = 2.
//      freq[3] += 2  => freq[3] = 1 + 2 = 3.
//      freq[4] -= 2  => freq[4] = 3 - 2 = 1.
//      k -= 2 => k = 0.
//      freq state: {0:0, 1:0, 2:0, 3:3, 4:1}
//
// d=3: freq[3]=3, k=0. No ops.
// d=2: ...
// d=1: ...
//
// Final freq state: {0:0, 1:0, 2:0, 3:3, 4:1}. This still indicates some elements are at difference 4.
// This means the `freq[d] -= num_to_reduce_from_d` is conceptually moving items, not removing them from consideration.
//
// The remaining `freq[d]` elements will stay at difference `d`.
//
// Let's use a concrete example:
// nums1 = [1,4,10,12], nums2 = [5,8,6,9], k1 = 1, k2 = 1
// k = 2
// diffs = [4, 4, 4, 3]
// freq: {3:1, 4:3}
// max_val = 100000. We only care about up to diff 4.
//
// Iterate d from max_val down to 1:
// d = 4: freq[4] = 3. k = 2.
//   `num_ops_to_use = min(k, freq[4]) = min(2, 3) = 2`.
//   These 2 operations will reduce 2 of the '4' differences by 1.
//   So, 2 elements become difference 3.
//   The count of elements at difference 3 increases by 2. `freq[3]` becomes 1 + 2 = 3.
//   The count of elements at difference 4 decreases by 2. `freq[4]` becomes 3 - 2 = 1.
//   `k` becomes `k - 2 = 0`.
//   Current state of freq: {3: 3, 4: 1}. (Conceptually, we have 3 elements at diff 3, 1 element at diff 4).
//
// d = 3: freq[3] = 3. k = 0. No operations.
//
// Final state of counts for each difference value:
// The `freq` array now represents the *final* counts of elements for each difference.
//
// Let's re-think the loop structure for frequency.
//
// `k = k1 + k2`
// `max_val = 100000`
// `freq = array of size max_val + 1, initialized to 0`
//
// For `i` from 0 to `n-1`:
//   `diff = abs(nums1[i] - nums2[i])`
//   `freq[diff]++`
//
// // Iterate from largest difference down to 1
// For `d` from `max_val` down to 1:
//   // If there are elements with difference `d` and we still have operations:
//   If `freq[d] > 0` and `k > 0`:
//     // We want to reduce the difference `d` for `freq[d]` elements.
//     // The reduction per element is `min(d, k_available_for_this_diff)`.
//     // We have `freq[d]` elements, each requiring `d` operations to reach 0.
//     // Total operations needed to reduce all `freq[d]` elements to 0 is `freq[d] * d`.
//     // However, we only have `k` total operations.
//
//     // If we have enough operations `k` to reduce all `freq[d]` elements from `d` to `d-1`:
//     // This requires `freq[d]` operations.
//     // If `k >= freq[d]`:
//     //   We can perform this reduction.
//     //   Move all `freq[d]` elements to `d-1`.
//     //   `freq[d-1] += freq[d]`
//     //   `k -= freq[d]`
//     //   `freq[d] = 0` // All elements that were at `d` are now accounted for at `d-1`.
//     // Else (`k < freq[d]`):
//     //   We can only reduce `k` of these elements.
//     //   These `k` elements become `d-1`.
//     //   `freq[d-1] += k`
//     //   The remaining `freq[d] - k` elements stay at `d`.
//     //   `k = 0`
//     //   `freq[d] -= k` // This is wrong, it should be `freq[d] = freq[d] - k`.
//
// Example: diffs = [3, 4, 4, 4], k=2
// freq: {3:1, 4:3}
//
// d=4: freq[4]=3, k=2.
//      k < freq[4] is false (2 < 3 is true). So this logic `if k < freq[d]` applies.
//      `freq[3] += k` => `freq[3] = 1 + 2 = 3`.
//      `k = 0`.
//      `freq[4] -= k` => This part is confusing.
//
// Let's use the `k` operations to reduce the largest differences.
//
// For `d` from `max_val` down to 1:
//   If `freq[d] > 0`:
//     // We have `freq[d]` elements at difference `d`.
//     // We can use `k` operations.
//     // If `k` is very large, we might reduce all these `freq[d]` elements to 0.
//     // The total reduction needed for these `freq[d]` elements to reach 0 is `freq[d] * d`.
//     // If `k >= freq[d] * d`:
//     //   All `freq[d]` elements are reduced to 0.
//     //   `k -= freq[d] * d`
//     //   `freq[d] = 0` (conceptually, they all become 0).
//     // Else (`k < freq[d] * d`):
//     //   We have `k` operations to distribute among `freq[d]` elements.
//     //   Each element will be reduced by `k / freq[d]` (integer division).
//     //   `reduction_per_element = floor(k / freq[d])`
//     //   `remaining_ops = k % freq[d]`
//     //
//     //   The elements will now have difference `d - reduction_per_element`.
//     //   `freq[d - reduction_per_element] += freq[d]`
//     //   `k -= reduction_per_element * freq[d]`
//     //
//     //   And `remaining_ops` elements will be reduced by one more step.
//     //   These will have difference `d - reduction_per_element - 1`.
//     //   `freq[d - reduction_per_element - 1] += remaining_ops`
//     //   `k -= remaining_ops`
//     //   `freq[d] = 0`
//
// This is becoming too complex to manage counts this way.
//
// Let's go back to the simpler frequency array approach where we consider "how many ops to use for the current difference `d`".
//
// `k = k1 + k2`
// `max_val = 100000`
// `freq = array of size max_val + 1, initialized to 0`
//
// For `i` from 0 to `n-1`:
//   `diff = abs(nums1[i] - nums2[i])`
//   `freq[diff]++`
//
// // Iterate from largest difference down to 1
// For `d` from `max_val` down to 1:
//   // If there are elements with difference `d` and we still have operations:
//   If `freq[d] > 0` and `k > 0`:
//     // We have `freq[d]` elements. We can use `k` operations.
//     // Each operation reduces one element's difference by 1.
//     // We want to use `num_ops_to_use` from `k` to reduce these `freq[d]` elements.
//     // The most we can reduce from *this difference level* is `freq[d]`.
//     `num_ops_to_use = min(k, freq[d])`
//
//     // These `num_ops_to_use` operations are used to reduce `num_ops_to_use` of the elements that had difference `d`.
//     // These elements will now have a difference of `d - 1`.
//     // We effectively transfer `num_ops_to_use` counts from difference `d` to difference `d - 1`.
//
//     `freq[d - 1] += num_ops_to_use`
//     `freq[d] -= num_ops_to_use` // This is conceptual. We are modifying the counts.
//     `k -= num_ops_to_use`
//
// Example: diffs = [3, 4, 4, 4], k=2
// freq: {3:1, 4:3}
//
// d=4: freq[4]=3, k=2. num_ops_to_use = min(2, 3) = 2.
//      freq[3] += 2  => freq[3] = 1 + 2 = 3.
//      freq[4] -= 2  => freq[4] = 3 - 2 = 1.
//      k -= 2 => k = 0.
//      freq state: {3:3, 4:1}
//
// d=3: freq[3]=3, k=0. No operations.
//
// The `freq` array should represent the FINAL counts for each difference.
// The current `freq` state {3:3, 4:1} implies we have 3 elements at difference 3 and 1 element at difference 4.
// This is incorrect. The operations are applied sequentially.
//
// Consider the number of elements we reduce at each step.
//
// `k = k1 + k2`
// `max_val = 100000`
// `counts = array of size max_val + 1, initialized to 0`
//
// For `i` from 0 to `n-1`:
//   `diff = abs(nums1[i] - nums2[i])`
//   `counts[diff]++`
//
// // Iterate from largest difference down to 1
// For `d` from `max_val` down to 1:
//   // If there are elements with difference `d` and we still have operations:
//   If `counts[d] > 0` and `k > 0`:
//     // We have `counts[d]` elements that are at difference `d`.
//     // We can reduce these `counts[d]` elements by at most `d` each to reach 0.
//     // The total operations needed for *these specific elements* to reach difference `d-1` is `counts[d]`.
//     // We have `k` operations available.
//
//     `ops_to_apply = min(k, counts[d])`
//
//     // These `ops_to_apply` operations reduce `ops_to_apply` of the `counts[d]` elements by 1.
//     // So, `ops_to_apply` elements move from difference `d` to `d-1`.
//
//     `counts[d - 1] += ops_to_apply`
//     `counts[d] -= ops_to_apply` // This element is conceptually moved.
//     `k -= ops_to_apply`
//
// Example: diffs = [3, 4, 4, 4], k=2
// counts: {3:1, 4:3}
//
// d=4: counts[4]=3, k=2. ops_to_apply = min(2, 3) = 2.
//      counts[3] += 2 => counts[3] = 1 + 2 = 3.
//      counts[4] -= 2 => counts[4] = 3 - 2 = 1.
//      k -= 2 => k = 0.
//      counts state: {3:3, 4:1}
//
// d=3: counts[3]=3, k=0. No ops.
//
// Final state of `counts` should represent the distribution of differences.
// The current `counts` means:
// 1 element at difference 4 (was not reduced).
// 3 elements at difference 3 (2 came from difference 4, 1 was originally at 3).
//
// This still means we have a difference of 4. The problem is how `counts[d] -= ops_to_apply` works.
// It means we have `counts[d] - ops_to_apply` elements remaining at difference `d`.
// And `ops_to_apply` elements that moved to difference `d-1`.
//
// Let's track `num_elements_at_diff` instead.
//
// `k = k1 + k2`
// `max_val = 100000`
// `num_elements_at_diff = array of size max_val + 1, initialized to 0`
//
// For `i` from 0 to `n-1`:
//   `diff = abs(nums1[i] - nums2[i])`
//   `num_elements_at_diff[diff]++`
//
// // Iterate from largest difference down to 1
// For `d` from `max_val` down to 1:
//   // If there are elements with difference `d` and we still have operations:
//   If `num_elements_at_diff[d] > 0` and `k > 0`:
//     // We have `num_elements_at_diff[d]` elements.
//     // We can use `k` operations.
//     // The number of operations we can use to reduce these elements is `num_ops_to_use = min(k, num_elements_at_diff[d])`.
//     // These `num_ops_to_use` elements are reduced by 1.
//
//     `ops_to_apply = min(k, num_elements_at_diff[d])`
//
//     // The `ops_to_apply` elements that were at difference `d` now move to `d-1`.
//     `num_elements_at_diff[d - 1] += ops_to_apply`
//     // The number of elements remaining at difference `d` is `num_elements_at_diff[d] - ops_to_apply`.
//     `num_elements_at_diff[d] -= ops_to_apply` // This is the number of elements that stay at difference `d`.
//     `k -= ops_to_apply`
//
// Example: diffs = [3, 4, 4, 4], k=2
// num_elements_at_diff: {3:1, 4:3}
//
// d=4: num_elements_at_diff[4]=3, k=2. ops_to_apply = min(2, 3) = 2.
//      num_elements_at_diff[3] += 2 => num_elements_at_diff[3] = 1 + 2 = 3.
//      num_elements_at_diff[4] -= 2 => num_elements_at_diff[4] = 3 - 2 = 1.
//      k -= 2 => k = 0.
//      state: {3:3, 4:1}
//
// d=3: num_elements_at_diff[3]=3, k=0. No ops.
//
// Final state: {3:3, 4:1}. This means we have 1 element at difference 4 and 3 elements at difference 3.
// This should be: 3 elements at difference 3, 0 elements at difference 4.
//
// The issue is that `num_elements_at_diff[d]` represents the elements *remaining* at difference `d` after processing.
//
// Let's re-think: we have `num_elements_at_diff[d]` items at level `d`.
// We can use `k` operations.
// We can take `min(k, num_elements_at_diff[d])` items and reduce them by 1.
// These `min(k, num_elements_at_diff[d])` items move to level `d-1`.
//
// `k = k1 + k2`
// `max_val = 100000`
// `num_elements_at_diff = array of size max_val + 1, initialized to 0`
//
// For `i` from 0 to `n-1`:
//   `diff = abs(nums1[i] - nums2[i])`
//   `num_elements_at_diff[diff]++`
//
// // Iterate from largest difference down to 1
// For `d` from `max_val` down to 1:
//   // If there are elements at difference `d` and we have operations left:
//   If `num_elements_at_diff[d] > 0` and `k > 0`:
//     // The number of elements we can reduce at this step is limited by:
//     // 1. The number of elements at this difference (`num_elements_at_diff[d]`).
//     // 2. The total remaining operations (`k`).
//     `ops_to_apply = min(k, num_elements_at_diff[d])`
//
//     // These `ops_to_apply` elements are reduced by 1. They move from difference `d` to `d - 1`.
//     `num_elements_at_diff[d - 1] += ops_to_apply`
//     // The remaining elements at difference `d` are `num_elements_at_diff[d] - ops_to_apply`.
//     // These will NOT be reduced further *in this iteration* because they stay at `d`.
//     // This `num_elements_at_diff[d] -= ops_to_apply` line IS correct for updating how many elements *remain* at difference `d`.
//     `num_elements_at_diff[d] -= ops_to_apply`
//
//     `k -= ops_to_apply`
//
// Example: diffs = [3, 4, 4, 4], k=2
// num_elements_at_diff: {3:1, 4:3}
//
// d=4: num_elements_at_diff[4]=3, k=2. ops_to_apply = min(2, 3) = 2.
//      num_elements_at_diff[3] += 2 => num_elements_at_diff[3] = 1 + 2 = 3.
//      num_elements_at_diff[4] -= 2 => num_elements_at_diff[4] = 3 - 2 = 1.
//      k -= 2 => k = 0.
//      Current state of `num_elements_at_diff`: {3:3, 4:1}
//
// d=3: num_elements_at_diff[3]=3, k=0. No ops.
//
// Final state: {3:3, 4:1}. This means 1 element is at difference 4, and 3 elements are at difference 3.
// This implies the minimum sum of squares is 1*(4^2) + 3*(3^2) = 16 + 27 = 43.
//
// Let's check the example output again:
// Example 2: nums1 = [1,4,10,12], nums2 = [5,8,6,9], k1 = 1, k2 = 1 => Output: 43
// Initial diffs: [4, 4, 4, 3]
// Total k = 2.
// One way:
// - Increase nums1[0] once: nums1 becomes [2,4,10,12]. diff1 becomes |2-5|=3.
// - Increase nums2[2] once: nums2 becomes [5,8,7,9]. diff3 becomes |10-7|=3.
// New diffs: [3, 4, 3, 3].
// Sum of squares: 3^2 + 4^2 + 3^2 + 3^2 = 9 + 16 + 9 + 9 = 43.
//
// So, the final distribution of differences should be: one 4, three 3s.
//
// The logic `num_elements_at_diff[d] -= ops_to_apply` means that `ops_to_apply` elements are *no longer* at difference `d`. They have moved to `d-1`.
// The remaining `num_elements_at_diff[d]` elements stay at difference `d`.
// This seems correct.
//
// Final calculation of sum of squares:
// `total_sum_of_squares = 0`
// For `d` from 0 to `max_val`:
//   If `num_elements_at_diff[d] > 0`:
//     `total_sum_of_squares += num_elements_at_diff[d] * d * d`
//
// This seems like a correct and efficient approach.
//
// Time Complexity:
// - Calculating initial differences and populating `num_elements_at_diff`: O(N)
// - Iterating from `max_val` down to 1: O(max_val) where `max_val` is the maximum possible difference (10^5).
// - Calculating final sum of squares: O(max_val).
// Total Time Complexity: O(N + max_val) which is O(N + 10^5). Since N <= 10^5, this is essentially O(N).
//
// Space Complexity:
// - `num_elements_at_diff` array: O(max_val) where `max_val` is the maximum possible difference (10^5).
// Total Space Complexity: O(max_val).
//
// Constraints:
// `n <= 10^5`
// `nums1[i], nums2[i] <= 10^5`
// `k1, k2 <= 10^9`
// `max_val = 10^5`
//
// This approach fits within the constraints.
//
// Double check edge cases:
// - k1=0, k2=0: No operations, sums squares of initial differences. Correct.
// - All differences are 0: Sum of squares is 0. Correct.
// - `k` is very large, enough to reduce all differences to 0.
//   Example: [5], [2], k=10. diff=3.
//   num_elements_at_diff: {3:1}
//   d=3: num_elements_at_diff[3]=1, k=10. ops_to_apply = min(10, 1) = 1.
//        num_elements_at_diff[2] += 1.
//        num_elements_at_diff[3] -= 1 => 0.
//        k -= 1 => 9.
//      state: {2:1, 3:0}
//   d=2: num_elements_at_diff[2]=1, k=9. ops_to_apply = min(9, 1) = 1.
//        num_elements_at_diff[1] += 1.
//        num_elements_at_diff[2] -= 1 => 0.
//        k -= 1 => 8.
//      state: {1:1, 2:0}
//   d=1: num_elements_at_diff[1]=1, k=8. ops_to_apply = min(8, 1) = 1.
//        num_elements_at_diff[0] += 1.
//        num_elements_at_diff[1] -= 1 => 0.
//        k -= 1 => 7.
//      state: {0:1, 1:0}
//   Final calculation: num_elements_at_diff[0] * 0 * 0 = 0. Correct.
//
// The `num_elements_at_diff` array should be populated with `BigInt` if intermediate sums can exceed `Number.MAX_SAFE_INTEGER`.
// Max sum of squares: n * (10^5)^2 = 10^5 * 10^10 = 10^15.
// `Number.MAX_SAFE_INTEGER` is about 9 * 10^15. So, regular numbers should be fine.
// However, `k1`, `k2` are up to 10^9. So `k` can be up to 2 * 10^9.
//
// The `num_elements_at_diff` can hold counts up to `N=10^5`.
// The `d` values are up to `10^5`.
// The product `num_elements_at_diff[d] * d * d` can be `10^5 * (10^5)^2 = 10^15`. This fits in a standard number.
// The total sum of squares can also be around `10^15`.
//
// The `k` variable needs to be `BigInt` if it's used in calculations where its magnitude might matter.
// `k = BigInt(k1) + BigInt(k2)`.
// The `ops_to_apply` should also be `BigInt`.
//
// When calculating sum of squares: `num_elements_at_diff[d] * d * d`.
// `d * d` can be up to `10^10`.
// `num_elements_at_diff[d]` is up to `N = 10^5`.
// Product is `10^5 * 10^10 = 10^15`. This fits in `Number`.
//
// Let's use BigInt for `k` and `ops_to_apply` to be safe, as `k` can be very large.
//
// `let k = BigInt(k1) + BigInt(k2);`
// `let ops_to_apply = min(k, BigInt(num_elements_at_diff[d]));`
//
// When calculating sum of squares, the result should be BigInt.
// `total_sum_of_squares += BigInt(num_elements_at_diff[d]) * BigInt(d) * BigInt(d);`

```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number} k1
 * @param {number} k2
 * @return {number}
 */
var minSumOfSquaredDifference = function(nums1, nums2, k1, k2) {
    // The problem asks us to minimize the sum of squared differences between elements
    // of two arrays, given a budget of operations (k1 and k2) to reduce these differences.
    // Each operation allows us to increment or decrement an element by 1.
    // The total number of operations available is k = k1 + k2.
    //
    // The key insight is that reducing larger differences has a greater impact
    // on minimizing the sum of squares. For example, reducing a difference of 10 by 1
    // changes its square from 100 to 81 (a reduction of 19). Reducing a difference of 2
    // by 1 changes its square from 4 to 1 (a reduction of 3).
    //
    // Therefore, a greedy approach is optimal: always reduce the largest existing differences.
    //
    // We can model the problem by looking at the absolute differences between corresponding elements:
    // diff_i = abs(nums1[i] - nums2[i]).
    // We want to spend our total k operations to reduce these diff_i values.
    //
    // A frequency array approach is efficient here. We can count how many pairs have
    // a specific absolute difference. The maximum possible difference is 10^5 (since elements
    // are up to 10^5).
    //
    // We iterate from the largest possible difference down to 1. For each difference `d`,
    // if there are `count[d]` pairs with this difference, and we have `k` operations remaining,
    // we can use `min(k, count[d])` operations to reduce `min(k, count[d])` of these pairs.
    // Each operation reduces the difference by 1. So, these pairs will move to difference `d-1`.
    //
    // Time Complexity: O(N + max_diff), where N is the length of the arrays and max_diff is the maximum possible difference (10^5).
    // Space Complexity: O(max_diff), for the frequency array.

    const n = nums1.length;
    // Use BigInt for k since k1 and k2 can be up to 10^9, resulting in a sum up to 2 * 10^9.
    let k = BigInt(k1) + BigInt(k2);

    // The maximum possible difference between any two elements.
    // If nums1[i] = 10^5 and nums2[i] = 0, the difference is 10^5.
    const MAX_DIFF = 100000;

    // numElementsAtDiff[d] will store the count of pairs (nums1[i], nums2[i])
    // such that abs(nums1[i] - nums2[i]) == d.
    // We need MAX_DIFF + 1 size for indices 0 to MAX_DIFF.
    const numElementsAtDiff = new Array(MAX_DIFF + 1).fill(0);

    // Calculate initial differences and populate the frequency array.
    for (let i = 0; i < n; i++) {
        const diff = Math.abs(nums1[i] - nums2[i]);
        // Only consider non-zero differences, as zero differences already contribute 0 to the sum.
        if (diff > 0) {
            numElementsAtDiff[diff]++;
        }
    }

    // Iterate from the largest possible difference down to 1.
    // We greedily reduce the largest differences first.
    for (let d = MAX_DIFF; d > 0; d--) {
        // If there are elements with difference 'd' and we still have operations left:
        if (numElementsAtDiff[d] > 0 && k > 0) {
            // Determine how many operations to use for this difference level.
            // We can use at most 'k' operations in total.
            // We can reduce at most 'numElementsAtDiff[d]' elements at this difference level.
            // Each operation reduces one element's difference by 1.
            const opsToApply = k < BigInt(numElementsAtDiff[d]) ? k : BigInt(numElementsAtDiff[d]);

            // These 'opsToApply' elements (which had difference 'd') are now reduced by 1.
            // They move to the difference level 'd - 1'.
            numElementsAtDiff[d - 1] += Number(opsToApply); // Add to count at the next lower difference level.

            // Update the count of elements remaining at difference 'd'.
            // This means 'numElementsAtDiff[d]' becomes 'numElementsAtDiff[d] - opsToApply'.
            numElementsAtDiff[d] = Number(BigInt(numElementsAtDiff[d]) - opsToApply);

            // Decrease the total available operations.
            k -= opsToApply;
        }
    }

    // After exhausting operations or reducing all possible differences,
    // calculate the sum of squared differences based on the final distribution.
    let totalSumOfSquaredDifference = 0n; // Use BigInt for the sum, as it can be very large.

    for (let d = 0; d <= MAX_DIFF; d++) {
        if (numElementsAtDiff[d] > 0) {
            // The number of elements at difference 'd' is numElementsAtDiff[d].
            // The contribution to the sum is (count * difference^2).
            // Use BigInt for d and the multiplication to avoid overflow.
            totalSumOfSquaredDifference += BigInt(numElementsAtDiff[d]) * BigInt(d) * BigInt(d);
        }
    }

    // The problem statement implies the result should be a number.
    // Since the sum can exceed Number.MAX_SAFE_INTEGER, we should return as BigInt if necessary,
    // but LeetCode often expects a standard number if possible or handles BigInt conversion.
    // Given the constraints and typical LeetCode behavior, returning as BigInt is safer.
    // If a standard Number is strictly required and guaranteed to fit, then Number(totalSumOfSquaredDifference) could be used.
    // However, 10^5 * (10^5)^2 = 10^15, which fits in standard JS Number (up to ~9e15).
    // But to be absolutely safe with intermediate calculations and potential test cases, BigInt is preferred.
    // Let's check the problem constraints again. The return type is `number`.
    // Max sum = 10^5 * (10^5)^2 = 10^15. This is within JS Number's safe integer range if it doesn't exceed 2^53-1.
    // 10^15 is less than 9 * 10^15 (Number.MAX_SAFE_INTEGER). So standard number is fine for the final result.
    // BUT, intermediate k operations and additions to numElementsAtDiff might overflow if not handled as BigInt.
    // The current implementation uses BigInt for k and opsToApply, and then converts opsToApply to Number.
    // numElementsAtDiff[d] can reach up to N (10^5), which fits in Number.
    // So, numElementsAtDiff[d-1] += Number(opsToApply) is fine.
    // numElementsAtDiff[d] = Number(BigInt(numElementsAtDiff[d]) - opsToApply) is fine.
    // The final sum calculation `BigInt(numElementsAtDiff[d]) * BigInt(d) * BigInt(d)` correctly uses BigInt.
    // And the final `totalSumOfSquaredDifference` is a BigInt.

    // Convert BigInt sum to Number for return type.
    // If the sum were to exceed Number.MAX_SAFE_INTEGER, this conversion would lose precision.
    // However, based on calculations, 10^15 fits within safe integer range.
    // LeetCode might implicitly handle BigInt conversion if the problem setter expects it or if the return type is flexible.
    // The problem states "Return the minimum sum of squared difference" and the example output is a number.
    // Let's assume the final sum will fit in a standard `number` type.
    return Number(totalSumOfSquaredDifference);
};
```