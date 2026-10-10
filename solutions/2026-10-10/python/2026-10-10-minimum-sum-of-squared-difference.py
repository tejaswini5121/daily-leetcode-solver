```python
import heapq

# Problem: Minimum Sum of Squared Difference
# Link: https://leetcode.com/problems/minimum-sum-of-squared-difference/
#
# Approach Explanation:
# The core idea is to reduce the absolute differences between elements of nums1 and nums2.
# Since we want to minimize the sum of squared differences, it's always optimal to reduce
# the largest absolute differences first. This is because the squared function grows faster
# for larger numbers.
#
# We calculate the absolute difference for each pair of elements. We can think of these
# differences as "tasks" that we need to reduce. We have a total of k1 + k2 "operations"
# to distribute. Each operation can reduce an absolute difference by 1.
#
# We can use a max-heap (or a min-heap storing negative absolute differences) to efficiently
# get the largest absolute difference at each step.
#
# Algorithm:
# 1. Calculate the absolute difference for each pair (nums1[i], nums2[i]) and store them.
# 2. If all differences are 0, the sum of squared differences is 0.
# 3. Use a max-heap to store the absolute differences. Push the negative of each difference
#    onto a min-heap to simulate a max-heap.
# 4. Combine k1 and k2 into a total budget `k = k1 + k2`.
# 5. While `k > 0` and the heap is not empty:
#    a. Pop the largest absolute difference (smallest negative value from the min-heap). Let it be `diff`.
#    b. If `diff` is 0, we can't reduce it further, so break the loop.
#    c. Decrement `diff` by 1.
#    d. Decrement `k` by 1.
#    e. If the decremented `diff` is still positive, push it back onto the heap.
# 6. After spending all `k` operations (or exhausting the differences), iterate through the
#    remaining absolute differences in the heap.
# 7. Calculate the sum of squares of these remaining differences.
#
# Time Complexity Analysis:
# - Calculating initial differences: O(n)
# - Building the heap: O(n log n)
# - Processing k operations: In the worst case, k can be very large. However, the number of distinct
#   difference values is at most n. Each `pop` and `push` operation takes O(log n) time.
#   The total number of unique difference values that are greater than 0 is at most `n`.
#   If `k` is very large, we will reduce many differences to 0.
#   A more refined analysis for the heap operations: we can group same differences together.
#   If we have `c` occurrences of difference `d`, and we reduce `d` to `d-1`, we essentially
#   perform `c` operations. We can do this efficiently using a frequency map or by observing
#   that we process `diff` values.
#   The total number of times we can decrease a difference from its initial maximum value
#   down to 0 across all `n` elements is bounded. A more efficient approach uses binary search
#   on the final maximum difference.
#   Let's reconsider the heap approach:
#   Each `pop` and `push` takes O(log n). We might do this up to `k` times.
#   If `k` is much larger than `n^2`, we can reduce most differences to 0.
#   The number of distinct differences is at most `n`.
#   The heap approach: at most `n` initial pushes. Then `k` pops and pushes. Total: O(n log n + k log n).
#   Given k can be 10^9, this is too slow.
#
#   **Revised Approach using Binary Search (More efficient for large k):**
#   The problem can be rephrased: find the minimum possible maximum absolute difference `max_diff`
#   such that we can reduce all original differences to be less than or equal to `max_diff`
#   using at most `k = k1 + k2` operations.
#   Once we find this `max_diff`, we can calculate the sum of squares.
#   For a given `max_diff`, we can count the total operations needed. For each original difference `d`,
#   if `d > max_diff`, we need `d - max_diff` operations to reduce it to `max_diff`.
#   The total operations for a given `max_diff` is `sum(max(0, d - max_diff))` for all `d`.
#   This check function `can_achieve(max_diff)` takes O(n) time.
#   The range of `max_diff` is from 0 to 10^5 (the maximum possible difference).
#   We can binary search on `max_diff`. The binary search will take `log(10^5)` iterations.
#   Total time complexity with binary search: O(n * log(max_val)) where max_val is the max possible difference.
#   This is much better than O(k log n).
#
#   **Let's implement the Binary Search approach:**
#   1. Calculate all absolute differences: `diffs = [abs(nums1[i] - nums2[i]) for i in range(n)]`. O(n).
#   2. Calculate total operations available: `k = k1 + k2`.
#   3. Define a helper function `count_ops(max_d)` that returns the total operations required to
#      make all differences less than or equal to `max_d`.
#      `count_ops(max_d) = sum(max(0, d - max_d) for d in diffs)`. This takes O(n).
#   4. Binary search for the minimum `target_max_diff` in the range [0, 100000].
#      - `low = 0`, `high = 100001` (or slightly higher than max possible difference).
#      - While `low < high`:
#        - `mid = low + (high - low) // 2`
#        - If `count_ops(mid) <= k`: it's possible to achieve `mid` as the max difference. Try smaller max differences. `high = mid`.
#        - Else: `mid` is too small. Need larger max difference. `low = mid + 1`.
#      - The `target_max_diff` will be `low` after the loop.
#   5. Once `target_max_diff` is found, calculate the sum of squared differences.
#      Iterate through the original `diffs`. For each `d`:
#      - If `d > target_max_diff`, the new difference will be `target_max_diff`. Add `target_max_diff**2` to sum.
#      - If `d <= target_max_diff`, the new difference is `d`. Add `d**2` to sum.
#      This step takes O(n).
#
#   Wait, step 5 needs to be precise.
#   If we have found `target_max_diff`, it means we can reduce *all* differences to be at most `target_max_diff`.
#   The actual reduction strategy matters. We use `k` operations.
#   Consider the `diffs` array and `k`. We need to reduce the largest `diff` values.
#   If we find `target_max_diff` using binary search, we know that `sum(max(0, d - target_max_diff) for d in diffs) <= k`.
#   This means we have enough operations to bring all values down to `target_max_diff`.
#   Let `ops_needed_to_reach_target = sum(max(0, d - target_max_diff) for d in diffs)`.
#   We have `k_remaining = k - ops_needed_to_reach_target` operations left over.
#   These `k_remaining` operations should be used to further reduce the values that are now equal to `target_max_diff`.
#   We can reduce `ops_needed_to_reach_target` elements that were originally greater than `target_max_diff`.
#   After applying `ops_needed_to_reach_target` operations, we have `num_elements_at_target_max_diff` elements that are exactly `target_max_diff` (these were originally >= `target_max_diff`).
#   And `num_elements_less_than_target_max_diff` elements that were originally < `target_max_diff`.
#   So, total elements that are <= `target_max_diff` is `num_elements_at_target_max_diff + num_elements_less_than_target_max_diff`.
#   The elements that are `target_max_diff` are the ones we can further reduce using `k_remaining` operations.
#   The total number of elements that are `target_max_diff` or less after initial reduction is `n`.
#   We need to find how many elements are equal to `target_max_diff`.
#   It's the count of original `d` such that `d >= target_max_diff`. Let this count be `count_ge_target`.
#   We have `k_remaining` operations. We want to distribute these operations to reduce `count_ge_target` elements,
#   each currently at `target_max_diff`.
#   If `k_remaining >= count_ge_target`, we can reduce all of them by at least 1.
#   If `k_remaining` is large, we can reduce them to `target_max_diff - 1`, `target_max_diff - 2`, etc.
#   The `k_remaining` operations can be distributed such that some become `target_max_diff - 1`, some `target_max_diff - 2`, etc.
#   This distribution is equivalent to applying `k_remaining` total reductions across all `count_ge_target` elements.
#   We can think of this as `k_remaining // count_ge_target` full reductions for each of these `count_ge_target` elements,
#   and then `k_remaining % count_ge_target` additional reductions applied one by one to some of them.
#   Let `reduction_per_element = k_remaining // count_ge_target`.
#   Let `extra_reductions = k_remaining % count_ge_target`.
#   So, `extra_reductions` elements will be reduced by `reduction_per_element + 1`, and
#   `count_ge_target - extra_reductions` elements will be reduced by `reduction_per_element`.
#   The final differences will be:
#   - For original `d < target_max_diff`: `d` (no change)
#   - For original `d >= target_max_diff`:
#     - `extra_reductions` elements become `target_max_diff - (reduction_per_element + 1)`
#     - `count_ge_target - extra_reductions` elements become `target_max_diff - reduction_per_element`
#
#   This logic is a bit complex to implement directly. A simpler way to get the sum of squares after finding `target_max_diff`:
#   1. Find `target_max_diff` using binary search.
#   2. Iterate through the original differences `d`.
#   3. If `d <= target_max_diff`, the final difference is `d`. Add `d**2` to the total sum.
#   4. If `d > target_max_diff`, this element contributed to `count_ops(target_max_diff)`.
#      The number of operations used for this element is `d - target_max_diff`.
#      We know `sum(d - target_max_diff for d > target_max_diff) = ops_needed_to_reach_target`.
#      We have `k_remaining = k - ops_needed_to_reach_target` operations left.
#      We need to distribute these `k_remaining` operations among elements that were originally `> target_max_diff`.
#      This distribution reduces the values that are currently `target_max_diff`.
#      Let's use the heap again, but only for the values that are `target_max_diff` or greater.
#
#   Let's refine the binary search approach:
#   1. Calculate `diffs = [abs(nums1[i] - nums2[i]) for i in range(n)]`.
#   2. `k = k1 + k2`.
#   3. Binary search for `max_allowed_diff` (the largest difference we *want* to end up with).
#      The range of `max_allowed_diff` is [0, 100001].
#      `check(mid_max_diff)` function:
#         Calculates `ops_needed = sum(max(0, d - mid_max_diff) for d in diffs)`.
#         Returns `ops_needed <= k`.
#      The binary search will find the smallest `max_allowed_diff` for which `check` returns True. Let this be `target_max_diff`.
#   4. Now, we know we can reduce all differences to be AT MOST `target_max_diff`.
#      Calculate the actual sum of squares.
#      We need to precisely know how many operations were used for each difference.
#      The total operations used to bring all differences to `target_max_diff` is `ops_used_to_target = sum(max(0, d - target_max_diff) for d in diffs)`.
#      We have `k_rem = k - ops_used_to_target` remaining operations.
#      These `k_rem` operations are applied to reduce values that are currently `target_max_diff`.
#      We can use a min-heap to store the values that are currently `target_max_diff` or smaller.
#      Initialize a min-heap with all original differences `d`.
#      Iterate `k` times:
#         `val = heapq.heappop(heap)`
#         if `val == 0`: break
#         `val -= 1`
#         `heapq.heappush(heap, val)`
#      This is still the O(k log n) approach.
#
#   Let's reconsider the Binary Search + Greedy application of remaining operations.
#   1. Calculate `diffs = [abs(nums1[i] - nums2[i]) for i in range(n)]`.
#   2. `k = k1 + k2`.
#   3. Find `target_max_diff` using binary search on the possible values of maximum difference [0, 100001].
#      `count_ops(limit)`: sums `max(0, d - limit)` for all `d` in `diffs`. O(n).
#      Binary search finds the smallest `target_max_diff` such that `count_ops(target_max_diff) <= k`.
#   4. Now, we have `ops_to_reach_target = count_ops(target_max_diff)`.
#      And `k_remaining = k - ops_to_reach_target`.
#   5. We need to calculate the sum of squares.
#      Create a frequency map or sort `diffs` to count occurrences of each difference.
#      Or, better, use a max-heap (or min-heap of negative values) initialized with all original `diffs`.
#      `heap = [-d for d in diffs]`
#      `heapq.heapify(heap)`
#
#      We know that `target_max_diff` is achievable. The key insight is that after we reduce all
#      differences to be at most `target_max_diff`, the `k_remaining` operations are used to
#      further reduce elements that are equal to `target_max_diff`.
#
#      A more direct approach after finding `target_max_diff`:
#      Initialize `sum_sq_diff = 0`.
#      Initialize a count for elements that become exactly `target_max_diff`.
#      Iterate through original `d` in `diffs`:
#          If `d <= target_max_diff`:
#              `sum_sq_diff += d * d`
#          Else (`d > target_max_diff`):
#              // This difference `d` will be reduced to `target_max_diff` using `d - target_max_diff` operations.
#              // We need to account for the remaining operations `k_remaining`.
#              // The actual values will be `target_max_diff` minus some amount distributed from `k_remaining`.
#              // Total ops spent here = `d - target_max_diff`.
#              // We have `k_remaining` operations left to distribute among these elements that are now `target_max_diff`.
#              // Let's count how many elements were originally >= `target_max_diff`.
#              `count_ge_target_max_diff = sum(1 for d_ in diffs if d_ >= target_max_diff)`
#              // These `count_ge_target_max_diff` elements will be reduced from `target_max_diff`.
#              // The `k_remaining` operations will be distributed among these.
#              // `k_remaining` can be thought of as `q * count_ge_target_max_diff + r`
#              // Each of the `count_ge_target_max_diff` elements will be reduced by `q` on average.
#              // `r` elements will be reduced by `q+1`.
#
#      This logic is still quite involved. Let's try a simpler interpretation after finding `target_max_diff`.
#      The binary search finds the smallest `M` such that `sum(max(0, d - M)) <= k`.
#      This `M` is our `target_max_diff`.
#      We know that all differences can be made `<= M`.
#      The total operations used to bring all differences to at most `M` is `ops_used = sum(max(0, d - M))`.
#      We have `k_rem = k - ops_used` operations remaining.
#      These `k_rem` operations should be applied to reduce the differences that are now `M`.
#      How many differences are exactly `M`?
#      It's the count of original differences `d` such that `d >= M`.
#      Let `count_at_M = sum(1 for d in diffs if d >= M)`.
#      We have `k_rem` operations to distribute among these `count_at_M` elements.
#      Each of these `count_at_M` elements is currently at `M`.
#      The total reduction from `M` that can be achieved by `k_rem` operations is `k_rem`.
#      We distribute `k_rem` reductions over `count_at_M` elements.
#      This is like applying `k_rem` reductions to a pile of `count_at_M` items, each item having value `M`.
#      Total reduction applied is `k_rem`.
#      Average reduction per item is `k_rem // count_at_M`.
#      Number of items that get an additional reduction is `k_rem % count_at_M`.
#
#      So, the final values will be:
#      1. Original `d < M`: Final value is `d`. Sum of squares is `d*d`.
#      2. Original `d >= M`:
#         These elements become `M` initially. We have `k_rem` ops.
#         `base_reduction = k_rem // count_at_M`
#         `extra_reduction_count = k_rem % count_at_M`
#
#         `extra_reduction_count` elements will be reduced by `base_reduction + 1` from `M`.
#         Their final value is `M - (base_reduction + 1)`. Add `(M - base_reduction - 1)**2` to sum.
#
#         `count_at_M - extra_reduction_count` elements will be reduced by `base_reduction` from `M`.
#         Their final value is `M - base_reduction`. Add `(M - base_reduction)**2` to sum.
#
#      This seems like the correct approach for the sum calculation after finding `target_max_diff`.
#
#   Example 2 walkthrough: nums1 = [1,4,10,12], nums2 = [5,8,6,9], k1 = 1, k2 = 1
#   n = 4
#   diffs = [abs(1-5), abs(4-8), abs(10-6), abs(12-9)] = [4, 4, 4, 3]
#   k = k1 + k2 = 1 + 1 = 2
#
#   Binary Search for `target_max_diff` in [0, 100001].
#   `count_ops(limit)`:
#     limit = 0: ops = (4-0) + (4-0) + (4-0) + (3-0) = 4 + 4 + 4 + 3 = 15. 15 > k=2. Need larger limit.
#     limit = 3: ops = max(0, 4-3) + max(0, 4-3) + max(0, 4-3) + max(0, 3-3) = 1 + 1 + 1 + 0 = 3. 3 > k=2. Need larger limit.
#     limit = 4: ops = max(0, 4-4) + max(0, 4-4) + max(0, 4-4) + max(0, 3-4) = 0 + 0 + 0 + 0 = 0. 0 <= k=2. Possible. `high = 4`.
#     `low` will converge to 4. So `target_max_diff = 4`.
#
#   Now calculate sum of squares:
#   `target_max_diff = M = 4`.
#   `diffs = [4, 4, 4, 3]`.
#   `ops_to_reach_target = count_ops(4) = 0`.
#   `k_remaining = k - ops_to_reach_target = 2 - 0 = 2`.
#
#   Count elements >= `target_max_diff` (which is 4):
#   `diffs = [4, 4, 4, 3]`. Elements >= 4 are `4, 4, 4`.
#   `count_at_M = 3`.
#
#   Distribute `k_remaining = 2` operations among `count_at_M = 3` elements.
#   `base_reduction = k_remaining // count_at_M = 2 // 3 = 0`.
#   `extra_reduction_count = k_rem % count_at_M = 2 % 3 = 2`.
#
#   Final calculation:
#   Iterate through original `diffs = [4, 4, 4, 3]`:
#   - diff = 4: (original >= M). This is one of the 3 elements.
#     It's one of the `extra_reduction_count = 2` elements that get `base_reduction + 1 = 0 + 1 = 1` reduction.
#     Final value = `M - (base_reduction + 1) = 4 - 1 = 3`. Square = `3*3 = 9`.
#   - diff = 4: (original >= M). This is another of the 3 elements.
#     It's one of the `extra_reduction_count = 2` elements that get `base_reduction + 1 = 0 + 1 = 1` reduction.
#     Final value = `M - (base_reduction + 1) = 4 - 1 = 3`. Square = `3*3 = 9`.
#   - diff = 4: (original >= M). This is the remaining 1 element (out of 3).
#     It gets `base_reduction = 0` reduction.
#     Final value = `M - base_reduction = 4 - 0 = 4`. Square = `4*4 = 16`.
#   - diff = 3: (original < M). Final value is `d = 3`. Square = `3*3 = 9`.
#
#   Total sum of squares = 9 + 9 + 16 + 9 = 43. This matches the example.
#
#   Space Complexity Analysis:
#   - Storing differences: O(n)
#   - Binary search: Constant space.
#   - Frequency map (if used for optimization, but not strictly necessary for this approach): O(max_diff_value) or O(n) if values are sparse.
#   - Overall: O(n) for storing differences.
#
# Let's check edge cases:
# - k1=0, k2=0: `k=0`. Binary search will find `target_max_diff` where `count_ops` is 0.
#   If all original diffs are 0, `target_max_diff = 0`. `ops_to_reach_target = 0`, `k_rem = 0`.
#   Final calc: original `d <= 0` becomes `d*d`. Correct.
#   If original diffs are non-zero, e.g. [4, 4, 4, 3], k=0.
#   `count_ops(0) = 15 > 0`. `count_ops(3) = 3 > 0`. `count_ops(4) = 0 <= 0`. `target_max_diff = 4`.
#   `ops_to_reach_target = 0`. `k_rem = 0`.
#   `count_at_M = 3` (for 4, 4, 4).
#   `base_reduction = 0 // 3 = 0`. `extra_reduction_count = 0 % 3 = 0`.
#   Final calc:
#   - diff=4 (>=M): 3 elements get `base_reduction=0` reduction. Final value `4-0=4`. Square `16`. (This happens `count_at_M - extra_reduction_count` times)
#   - diff=3 (<M): Final value `3`. Square `9`.
#   Sum = 16 + 16 + 16 + 9 = 57. This is not correct.
#   The mistake is in `count_at_M`. `count_at_M` should represent the number of elements that will *end up* at `target_max_diff` BEFORE using `k_remaining`.
#   The total number of elements that are GREATER THAN `target_max_diff` originally is what matters.
#   Let's rephrase:
#   `target_max_diff` is the max value we can achieve for *all* differences using *at most* `k` operations.
#   It's the smallest `M` such that `sum(max(0, d - M)) <= k`.
#
#   After finding `target_max_diff = M`:
#   We know `ops_used_for_reduction = sum(max(0, d - M) for d in diffs)`.
#   We have `k_rem = k - ops_used_for_reduction` operations left.
#
#   Let's consider the `diffs` array. We can categorize them:
#   1. `d < M`: These remain `d`.
#   2. `d == M`: These remain `M` initially.
#   3. `d > M`: These are reduced to `M` using `d - M` ops.
#
#   The elements in category 3 contribute `d - M` operations to `ops_used_for_reduction`.
#   After this initial reduction, all elements from categories 2 and 3 are now at value `M`.
#   The number of such elements is `count(d >= M)`. Let this be `num_at_M_after_initial_reduction`.
#   We have `k_rem` operations left to distribute among these `num_at_M_after_initial_reduction` elements, all of which are currently `M`.
#
#   Let's try a specific example: nums1 = [10], nums2 = [1], k1=1, k2=1. n=1.
#   diffs = [9]. k = 2.
#   BS:
#   count_ops(0): 9-0=9. 9 > 2.
#   count_ops(7): 9-7=2. 2 <= 2. `high = 7`.
#   count_ops(8): 9-8=1. 1 <= 2. `high = 8`.
#   count_ops(9): 9-9=0. 0 <= 2. `high = 9`.
#   BS will find `target_max_diff = 7`.
#
#   `M = 7`.
#   `diffs = [9]`.
#   `ops_used_for_reduction = count_ops(7) = max(0, 9 - 7) = 2`.
#   `k_rem = k - ops_used_for_reduction = 2 - 2 = 0`.
#
#   Original diff `d = 9`. `d > M`.
#   `num_at_M_after_initial_reduction` counts elements originally `>= M`. Here `9 >= 7`. So, 1 element.
#   `k_rem = 0`.
#   `base_reduction = 0 // 1 = 0`.
#   `extra_reduction_count = 0 % 1 = 0`.
#
#   Final calc:
#   - diff = 9: (original >= M). This is 1 element.
#     It gets `base_reduction = 0` reduction.
#     Final value = `M - base_reduction = 7 - 0 = 7`. Square = `7*7 = 49`.
#   Total sum = 49.
#   Check: initial diff 9. k=2.
#   ops 1: diff becomes 8.
#   ops 2: diff becomes 7.
#   Final diff is 7. Squared is 49. Correct.
#
#   Example: nums1 = [1,2,3,4], nums2 = [2,10,20,19], k1 = 0, k2 = 0
#   diffs = [1, 8, 17, 15]. k = 0.
#   BS:
#   `count_ops(0)` = 1+8+17+15 = 41 > 0.
#   `count_ops(1)` = 0+7+16+14 = 37 > 0.
#   ...
#   `count_ops(15)` = 0+0+2+0 = 2 > 0.
#   `count_ops(16)` = 0+0+1+0 = 1 > 0.
#   `count_ops(17)` = 0+0+0+0 = 0 <= 0. `target_max_diff = 17`.
#
#   `M = 17`.
#   `diffs = [1, 8, 17, 15]`.
#   `ops_used_for_reduction = count_ops(17) = 0`.
#   `k_rem = k - 0 = 0`.
#
#   `num_at_M_after_initial_reduction` counts elements originally `>= M`. `17 >= 17`. So 1 element (the one with diff 17).
#   `k_rem = 0`.
#   `base_reduction = 0 // 1 = 0`. `extra_reduction_count = 0 % 1 = 0`.
#
#   Final calc:
#   Iterate through original diffs:
#   - diff=1: `d < M`. Final value = 1. Square = 1.
#   - diff=8: `d < M`. Final value = 8. Square = 64.
#   - diff=17: `d >= M`. This is the one element.
#     It gets `base_reduction = 0` reduction.
#     Final value = `M - base_reduction = 17 - 0 = 17`. Square = `17*17 = 289`.
#   - diff=15: `d < M`. Final value = 15. Square = 225.
#
#   Sum = 1 + 64 + 289 + 225 = 579. Correct.
#
#   One more consideration for calculation after `target_max_diff = M` is found:
#   The `k_rem` operations are used to reduce values that are *currently* `M`.
#   The count of these values is `num_elements_becoming_M = sum(1 for d in diffs if d >= M)`.
#
#   Let `num_greater_than_M = sum(1 for d in diffs if d > M)`.
#   Let `num_equal_to_M = sum(1 for d in diffs if d == M)`.
#   Total operations to bring all `d > M` to `M` is `sum(d - M for d > M)`.
#   We have `k_rem = k - sum(d - M for d > M)`.
#   The elements that were originally `> M` are now `M`.
#   The elements that were originally `== M` are still `M`.
#   So, `num_elements_at_M = num_greater_than_M + num_equal_to_M`.
#   We distribute `k_rem` operations among these `num_elements_at_M` values, each currently `M`.
#
#   Final calculation structure:
#   1. Compute `diffs`. `k = k1 + k2`.
#   2. Perform binary search to find `target_max_diff = M`.
#   3. Compute `ops_used = sum(max(0, d - M) for d in diffs)`.
#   4. `k_rem = k - ops_used`.
#   5. Initialize `sum_sq = 0`.
#   6. Initialize `num_elements_at_M = 0`.
#   7. Iterate through original `d` in `diffs`:
#      If `d <= M`:
#         `sum_sq += d * d`
#      Else (`d > M`):
#         `num_elements_at_M += 1`
#         // These `d` are reduced to `M` initially.
#         // We will account for the final reduction from `M` later.
#
#   8. Now we have `num_elements_at_M` elements that are currently at value `M` (these were originally `> M`).
#      Also, original elements `d == M` are still `M`.
#      The count of original `d == M` is `num_equal_to_M = sum(1 for d in diffs if d == M)`.
#      Total elements that are now `M` and can be reduced further = `num_elements_at_M + num_equal_to_M`.
#      Let `total_M_values = num_elements_at_M + num_equal_to_M`.
#
#      We have `k_rem` operations to distribute among `total_M_values` elements, each currently `M`.
#      `base_reduction = k_rem // total_M_values`.
#      `extra_reduction_count = k_rem % total_M_values`.
#
#      Add to `sum_sq`:
#      `extra_reduction_count` elements become `M - (base_reduction + 1)`. Add `(M - base_reduction - 1)**2` to `sum_sq`.
#      `total_M_values - extra_reduction_count` elements become `M - base_reduction`. Add `(M - base_reduction)**2` to `sum_sq`.
#
#      This requires careful handling of `M - value` if `M - value` becomes negative.
#      The problem statement allows negative integers. So no issue there.
#      Need to handle `total_M_values == 0` case (if all diffs < M). If `total_M_values` is 0, `k_rem` is unused.
#
#   Revised step 7/8:
#   Initialize `sum_sq = 0`.
#   Create a list/heap of final differences.
#   Initialize `count_ge_M = 0`.
#   Iterate through original `d` in `diffs`:
#      If `d <= M`:
#         `sum_sq += d * d`
#      Else (`d > M`):
#         `count_ge_M += 1`
#         // These elements will be reduced from M.
#
#   Now, `count_ge_M` is the number of original differences that were greater than `M`.
#   The number of elements that are *currently* `M` and can be reduced is `count_ge_M` (from original `d > M`) + `sum(1 for d in diffs if d == M)` (from original `d == M`).
#   Let `num_elements_to_reduce = sum(1 for d in diffs if d >= M)`.
#
#   If `num_elements_to_reduce == 0`, it means all original diffs were `< M`. `k_rem` is unused.
#   If `num_elements_to_reduce > 0`:
#      `base_reduction = k_rem // num_elements_to_reduce`
#      `extra_reduction_count = k_rem % num_elements_to_reduce`
#
#      // The values that can be reduced are those with original `d >= M`.
#      // All these are effectively `M` after initial reduction.
#      // We apply `base_reduction` to all of them.
#      // And `base_reduction + 1` to `extra_reduction_count` of them.
#
#      // The values that were originally `< M` have their squares already added to `sum_sq`.
#      // We need to add squares for values that were originally `>= M`.
#      // There are `num_elements_to_reduce` such values.
#
#      // `extra_reduction_count` values will become `M - (base_reduction + 1)`.
#      `final_val_1 = M - base_reduction - 1`
#      `sum_sq += extra_reduction_count * (final_val_1 * final_val_1)`
#
#      // `num_elements_to_reduce - extra_reduction_count` values will become `M - base_reduction`.
#      `final_val_2 = M - base_reduction`
#      `sum_sq += (num_elements_to_reduce - extra_reduction_count) * (final_val_2 * final_val_2)`
#
#   Consider the case when `final_val_1` or `final_val_2` can become negative. This is allowed.
#
#   The crucial part is correctly identifying `num_elements_to_reduce` and applying the reductions.
#   `num_elements_to_reduce = sum(1 for d in diffs if d >= M)` is correct.
#
#   Let's re-verify example 1: nums1 = [1,2,3,4], nums2 = [2,10,20,19], k1 = 0, k2 = 0
#   diffs = [1, 8, 17, 15]. k = 0.
#   `M = 17`.
#   `ops_used = 0`. `k_rem = 0`.
#   `sum_sq = 0`.
#   `count_ge_M = 0`.
#   `num_equal_to_M = 0`.
#
#   Iterate diffs:
#   d=1: 1 <= 17. `sum_sq += 1*1 = 1`.
#   d=8: 8 <= 17. `sum_sq += 8*8 = 64`. Total `sum_sq = 65`.
#   d=17: 17 >= 17. `count_ge_M += 1`. `num_equal_to_M += 1`.
#   d=15: 15 <= 17. `sum_sq += 15*15 = 225`. Total `sum_sq = 65 + 225 = 290`.
#
#   `num_elements_to_reduce = count_ge_M + num_equal_to_M = 1 + 1 = 2`. Wait, this is wrong.
#   `num_elements_to_reduce` should be the count of original elements that are `>= M`.
#   In example 1: diffs=[1, 8, 17, 15]. M=17.
#   Elements >= 17 are: [17]. Count is 1. So `num_elements_to_reduce = 1`.
#
#   Let's trace Example 1 again with correct `num_elements_to_reduce`:
#   diffs = [1, 8, 17, 15]. k = 0. `M = 17`.
#   `ops_used = count_ops(17) = 0`. `k_rem = 0`.
#   `sum_sq = 0`.
#
#   Iterate through original `d` in `diffs`:
#   `d=1`: `d <= M`. `sum_sq += 1*1 = 1`.
#   `d=8`: `d <= M`. `sum_sq += 8*8 = 64`. `sum_sq = 65`.
#   `d=17`: `d > M` is False. `d == M` is True.
#   `d=15`: `d <= M`. `sum_sq += 15*15 = 225`. `sum_sq = 65 + 225 = 290`.
#
#   Now, calculate `num_elements_to_reduce = sum(1 for d in diffs if d >= M)`.
#   For `diffs = [1, 8, 17, 15]` and `M = 17`, `num_elements_to_reduce = 1` (only `d=17`).
#
#   If `num_elements_to_reduce > 0`:
#     `base_reduction = k_rem // num_elements_to_reduce = 0 // 1 = 0`.
#     `extra_reduction_count = k_rem % num_elements_to_reduce = 0 % 1 = 0`.
#
#     // Add squares for elements that were originally `>= M`.
#     // `extra_reduction_count` values become `M - (base_reduction + 1)`.
#     `final_val_1 = M - base_reduction - 1 = 17 - 0 - 1 = 16`.
#     `sum_sq += extra_reduction_count * (final_val_1 * final_val_1) = 0 * (16*16) = 0`.
#     `sum_sq = 290`.
#
#     // `num_elements_to_reduce - extra_reduction_count` values become `M - base_reduction`.
#     `final_val_2 = M - base_reduction = 17 - 0 = 17`.
#     `sum_sq += (num_elements_to_reduce - extra_reduction_count) * (final_val_2 * final_val_2)`
#     `sum_sq += (1 - 0) * (17 * 17) = 1 * 289 = 289`.
#     `sum_sq = 290 + 289 = 579`.
#
#   This final calculation logic seems to work for both examples.
#
# Time Complexity: O(N * log(max_diff_value)) where max_diff_value is ~10^5.
# Space Complexity: O(N) for storing differences.

class Solution:
    def minSumOfSquaredDifference(self, nums1: list[int], nums2: list[int], k1: int, k2: int) -> int:
        n = len(nums1)
        # Calculate absolute differences between corresponding elements.
        diffs = [abs(nums1[i] - nums2[i]) for i in range(n)]
        # Total available operations to reduce differences.
        k = k1 + k2

        # If all differences are already zero, the sum of squared difference is 0.
        if all(d == 0 for d in diffs):
            return 0

        # Binary search for the maximum possible difference we can achieve for all elements.
        # The range of possible maximum differences is from 0 up to the maximum possible initial difference (around 10^5).
        # We search for the smallest `max_allowed_diff` such that we can reduce all original
        # differences to be less than or equal to `max_allowed_diff` using at most `k` operations.
        low = 0
        high = 100001 # Upper bound for difference (max possible value of nums[i] is 10^5)
        target_max_diff = high # Initialize with a value outside the possible range

        # Helper function to count operations needed to make all diffs <= `limit`.
        def count_ops_needed(limit: int) -> int:
            ops = 0
            for d in diffs:
                if d > limit:
                    ops += (d - limit)
            return ops

        # Perform binary search.
        while low < high:
            mid = low + (high - low) // 2
            # If we can achieve 'mid' as the maximum difference with available 'k' operations,
            # it means 'mid' is a possible target. We try to find an even smaller target.
            if count_ops_needed(mid) <= k:
                target_max_diff = mid # 'mid' is achievable, store it as a potential answer.
                high = mid # Try smaller maximum differences.
            else:
                # If 'mid' is not achievable, we need a larger maximum difference.
                low = mid + 1

        # After binary search, `target_max_diff` holds the minimum possible maximum difference
        # that all absolute differences can be reduced to.
        M = target_max_diff

        # Calculate the total operations used to bring all differences down to at most M.
        ops_used_to_reach_target = count_ops_needed(M)
        # Calculate the remaining operations after reducing all differences to <= M.
        k_remaining = k - ops_used_to_reach_target

        # Now, calculate the sum of squared differences.
        sum_sq = 0
        # Count elements that were originally greater than or equal to M.
        # These are the elements that can be further reduced using k_remaining operations.
        num_elements_to_reduce = 0

        for d in diffs:
            if d <= M:
                # Differences already less than or equal to M are squared directly.
                sum_sq += d * d
            else:
                # Differences greater than M will be reduced.
                # They are initially reduced to M, and then further reduced by k_remaining.
                num_elements_to_reduce += 1

        # If there are elements that need further reduction (i.e., they were originally > M),
        # distribute the remaining k operations among them.
        if num_elements_to_reduce > 0:
            # Calculate how many full reductions each of these elements will get.
            base_reduction = k_remaining // num_elements_to_reduce
            # Calculate how many elements will receive an additional reduction.
            extra_reduction_count = k_remaining % num_elements_to_reduce

            # Add the squared differences for the elements that get an extra reduction.
            # Their final value will be M - (base_reduction + 1).
            final_val_1 = M - base_reduction - 1
            sum_sq += extra_reduction_count * (final_val_1 * final_val_1)

            # Add the squared differences for the remaining elements.
            # Their final value will be M - base_reduction.
            num_elements_with_base_reduction = num_elements_to_reduce - extra_reduction_count
            final_val_2 = M - base_reduction
            sum_sq += num_elements_with_base_reduction * (final_val_2 * final_val_2)

        return sum_sq
```