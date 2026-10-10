```cpp
// Problem: Minimum Sum of Squared Difference
// Problem Summary: Minimize the sum of squared differences between two arrays by applying a limited number of +-1 modifications to each array.
// Link: https://leetcode.com/problems/minimum-sum-of-squared-difference/

/*
Approach:
The core idea is to reduce the absolute differences between corresponding elements of nums1 and nums2.
We can only reduce the absolute difference |nums1[i] - nums2[i]| by 1 if we change either nums1[i] or nums2[i] by 1.
Each such change costs 1 unit from either k1 or k2.
The total number of modifications we can make is k = k1 + k2.
To minimize the sum of squared differences, we should prioritize reducing the largest absolute differences first. This is because the square function grows quadratically, so reducing a large difference has a much greater impact than reducing a small difference.

1. Calculate the absolute differences: For each pair (nums1[i], nums2[i]), calculate their absolute difference diff = |nums1[i] - nums2[i]|. Store these differences.
2. Count the frequency of each difference: It's more efficient to work with counts of how many pairs have a certain difference. A map or a frequency array can be used. Since the maximum possible difference is 10^5, a frequency array is suitable.
3. Reduce differences greedily: We have k total modifications. We iterate from the largest possible difference downwards.
   - For the current difference `d`, if we have `count[d]` pairs with this difference, and we have `k` modifications remaining:
     - We can reduce up to `count[d]` of these differences to `d-1`.
     - The number of modifications used for this step is `min(count[d], k)`.
     - Update `k`: `k -= min(count[d], k)`.
     - Update `count[d-1]`: `count[d-1] += min(count[d], k_used_here)`.
     - If `k` becomes 0, we stop.
4. Handle remaining differences: If after reducing the largest differences, we still have `k > 0` modifications left, it means we can reduce all remaining positive differences further. Specifically, if we have `k` modifications left and the largest remaining difference is `d_max`, we can reduce all these `d_max` differences by `k / num_of_remaining_positive_diffs`.

To efficiently handle the reduction of differences, especially when k is large, we can use a priority queue (max heap) storing the absolute differences. However, with the constraint of 10^5 for differences, using a frequency array and iterating from the largest difference is more efficient.

Let's refine the frequency-based approach:
1. Calculate absolute differences and store their counts in `freq` array.
2. Iterate from `max_diff = 100000` down to `1`.
3. For each `diff`:
   - If `freq[diff] > 0`:
     - `num_pairs = freq[diff]`
     - `reductions_possible = min(k, num_pairs)`
     - `k -= reductions_possible`
     - `freq[diff - 1] += reductions_possible` // Reduce these pairs to diff-1
     - `freq[diff] -= reductions_possible`   // Effectively remove these from current diff
     - If `k == 0`, break.
4. After the loop, if `k > 0`:
   - We need to distribute the remaining `k` reductions across the smallest positive differences.
   - Find the largest `diff` such that `freq[diff] > 0`. Let this be `max_current_diff`.
   - If `max_current_diff == 0`, all differences are already 0, and the sum is 0.
   - If `max_current_diff > 0`, we have `k` modifications left. We can reduce all pairs with difference `max_current_diff` to `max_current_diff - 1`, and so on.
   - A more efficient way: After the loop, iterate from `max_diff` down to `0`. If `freq[diff] > 0`:
     - `num_pairs = freq[diff]`
     - `reduction_amount = k / num_pairs` // How much each of these pairs can be reduced
     - If `reduction_amount > 0`:
       - `new_diff = diff - reduction_amount`
       - `freq[new_diff] += num_pairs`
       - `k -= num_pairs * reduction_amount`
     - `k_remaining_for_this_diff = k % num_pairs` // Remainder for this diff group
     - If `k_remaining_for_this_diff > 0`:
       - `new_diff_one_less = diff - reduction_amount - 1`
       - `freq[new_diff_one_less] += k_remaining_for_this_diff`
       - `k -= k_remaining_for_this_diff`
     - `freq[diff] = 0` // All pairs at diff have been moved
     - If `k == 0`, break.
This iterative distribution can be complex. A simpler approach for step 4:

If `k > 0` after the greedy reduction:
- Iterate through `freq` from `max_diff` down to `1`.
- For each `diff` where `freq[diff] > 0`:
  - We have `freq[diff]` pairs with this difference.
  - We can reduce each of these by at most `k`.
  - The actual reduction for each of these pairs will be `min(diff, k / freq[diff])` if we want to reduce them as much as possible towards zero.
  - Let `reduction_per_pair = min(diff, k / freq[diff])`.
  - If `reduction_per_pair > 0`:
    - `freq[diff - reduction_per_pair] += freq[diff]`
    - `k -= freq[diff] * reduction_per_pair`
  - If `k == 0`, break.
  - If `k > 0` and `reduction_per_pair < diff` (meaning we couldn't reduce them all the way to `diff - reduction_per_pair` because `k` was not enough for `k/freq[diff]` reduction for all pairs), then we might have `k % freq[diff]` remaining modifications.
  - This still feels complicated.

Let's reconsider step 4: After the greedy reduction loop, if `k > 0`:
We have `k` remaining operations. These operations should be used to reduce the largest remaining differences.
The most efficient way is to reduce the largest difference `d_max` by 1, `k` times if possible.
This means if we have `m` elements with difference `d_max`, and we have `k` operations left:
We can reduce `min(k, m)` of these elements by 1.
`k_used = min(k, m)`
`k -= k_used`
`freq[d_max - 1] += k_used`
`freq[d_max] -= k_used`
Repeat this until `k=0` or `d_max` becomes 0.

A more structured approach for step 4 using a frequency map/array:
After the initial greedy reduction loop (from `max_diff` down to `1`), if `k > 0`:
Iterate through the frequencies from `max_val = 100000` down to `0`.
For each `diff` where `freq[diff] > 0`:
    `num_elements = freq[diff]`
    `reduction_amount = min(k, num_elements)` // how many elements at this difference we can reduce
    `new_diff = diff - 1` // they will be reduced to diff - 1
    `freq[new_diff] += reduction_amount`
    `k -= reduction_amount`
    `freq[diff] -= reduction_amount` // conceptually remove from current diff
    If `k == 0`, break.

This still doesn't handle distributing `k` across multiple `diff` values optimally.

Let's use the frequency array approach.
1. Create a frequency array `counts` of size 100001.
2. Calculate absolute differences `diff = abs(nums1[i] - nums2[i])`. Increment `counts[diff]`.
3. Total modifications `k = k1 + k2`.
4. Iterate from `d = 100000` down to `1`.
   - If `counts[d] > 0`:
     - `num_pairs = counts[d]`
     - `reductions_to_apply = min((long long)num_pairs, k)` // How many pairs at diff `d` we can reduce
     - `k -= reductions_to_apply`
     - `counts[d - 1] += reductions_to_apply` // These `reductions_to_apply` pairs now have diff `d-1`
     - `counts[d] -= reductions_to_apply` // These are no longer at diff `d`
     - If `k == 0`, break.
5. After the loop, if `k > 0`:
   - This implies we have enough modifications to bring down all remaining positive differences.
   - We can effectively reduce all remaining positive differences by a certain amount.
   - Iterate from `d = 100000` down to `0`.
   - If `counts[d] > 0`:
     - `num_pairs = counts[d]`
     - `reduction_per_pair = k / num_pairs` // How much each of these `num_pairs` can be reduced
     - If `reduction_per_pair > 0`:
       - `new_diff = d - reduction_per_pair`
       - `counts[new_diff] += num_pairs`
       - `k -= num_pairs * reduction_per_pair`
     - `k_for_one_less_reduction = k % num_pairs` // Remaining modifications for this group
     - If `k_for_one_less_reduction > 0`:
       - `new_diff_one_less = d - reduction_per_pair - 1`
       - `counts[new_diff_one_less] += k_for_one_less_reduction`
       - `k -= k_for_one_less_reduction`
     - `counts[d] = 0` // All pairs at diff `d` have been processed
     - If `k == 0`, break.

6. Finally, calculate the sum of squared differences:
   - Iterate from `d = 0` to `100000`.
   - `sum_sq_diff += (long long)d * d * counts[d]`.
   - Return `sum_sq_diff`.

Example walkthrough: nums1 = [1,4,10,12], nums2 = [5,8,6,9], k1 = 1, k2 = 1
k = 1 + 1 = 2.
Differences:
|1-5|=4
|4-8|=4
|10-6|=4
|12-9|=3
Counts: counts[3]=1, counts[4]=3. Max diff is 4.

Iterate from d=100000 down to 1.
d=4: counts[4]=3. k=2.
reductions_to_apply = min(3, 2) = 2.
k = 2 - 2 = 0.
counts[3] += 2. (Now counts[3] = 1 + 2 = 3)
counts[4] -= 2. (Now counts[4] = 3 - 2 = 1)
k is 0, so break.

Final counts: counts[3]=3, counts[4]=1. (This seems wrong. The logic should be reducing the current largest difference.)

Corrected greedy step:
We have `k` operations. For the largest difference `d`, we have `counts[d]` pairs.
We can reduce `min(k, counts[d])` of these pairs by 1.
These `min(k, counts[d])` pairs will now have a difference of `d-1`.
The cost is `min(k, counts[d])`.

Let's restart the example with the refined greedy logic.
nums1 = [1,4,10,12], nums2 = [5,8,6,9], k1 = 1, k2 = 1
k = 1 + 1 = 2.
Differences: |1-5|=4, |4-8|=4, |10-6|=4, |12-9|=3.
Counts: counts[3]=1, counts[4]=3. Max diff is 4.

Iterate `d` from 100000 down to 1.
Current `d = 4`. `counts[4] = 3`. `k = 2`.
Number of pairs we can reduce at diff 4 is `min(k, counts[4]) = min(2, 3) = 2`.
These 2 pairs will now have difference `4-1 = 3`.
So, we use 2 modifications. `k` becomes `2 - 2 = 0`.
The `counts` array needs to reflect this:
`counts[3] += 2` (previously `counts[3]=1`, now `counts[3]=3`)
`counts[4] -= 2` (previously `counts[4]=3`, now `counts[4]=1`)
`k` is now 0. We break the loop.

After the loop:
`k = 0`. No further distribution needed.
Final `counts`: `counts[3] = 3`, `counts[4] = 1`.

Calculate sum of squared differences:
`d=3`: `counts[3] * 3*3 = 3 * 9 = 27`
`d=4`: `counts[4] * 4*4 = 1 * 16 = 16`
Total sum = `27 + 16 = 43`. This matches the example.

Consider a case where k is large.
nums1 = [1, 1], nums2 = [10, 10], k1 = 1, k2 = 1. k = 2.
Differences: |1-10|=9, |1-10|=9.
Counts: counts[9]=2. Max diff is 9.

Iterate `d` from 100000 down to 1.
d=9: counts[9]=2, k=2.
reductions_to_apply = min(k, counts[9]) = min(2, 2) = 2.
k -= 2 => k = 0.
counts[9-1] += 2 => counts[8] += 2.
counts[9] -= 2 => counts[9] = 0.
k is 0, break.

Final counts: counts[8]=2.
Sum: counts[8] * 8*8 = 2 * 64 = 128.

Let's verify: Initial diffs are (9, 9). Total k=2.
We can reduce both 9s by 1. Diffs become (8, 8). Sum = 8^2 + 8^2 = 64 + 64 = 128. Correct.

Consider another case:
nums1 = [1, 1], nums2 = [10, 10], k1 = 0, k2 = 8. k = 8.
Differences: |1-10|=9, |1-10|=9.
Counts: counts[9]=2. Max diff is 9.

Iterate `d` from 100000 down to 1.
d=9: counts[9]=2, k=8.
reductions_to_apply = min(k, counts[9]) = min(8, 2) = 2.
k -= 2 => k = 6.
counts[9-1] += 2 => counts[8] += 2.
counts[9] -= 2 => counts[9] = 0.
k is not 0, continue.

Now `d` continues. No other entries in counts.
The loop finishes. `k` is still 6.
This is where step 5 comes in. `k > 0`.

We have `counts[8] = 2` and `k = 6`.
Iterate `d` from 100000 down to 0.
d=8: counts[8]=2, k=6.
num_pairs = 2.
reduction_per_pair = k / num_pairs = 6 / 2 = 3.
new_diff = d - reduction_per_pair = 8 - 3 = 5.
counts[5] += num_pairs => counts[5] += 2.
k -= num_pairs * reduction_per_pair => k -= 2 * 3 => k -= 6 => k = 0.
k_for_one_less_reduction = k % num_pairs = 0 % 2 = 0.
counts[8] = 0.
k is 0, break.

Final counts: counts[5]=2.
Sum: counts[5] * 5*5 = 2 * 25 = 50.

Let's verify: Initial diffs (9, 9). k = 8.
Reduce both 9s by 1: (8, 8). k=6 left.
Reduce both 8s by 1: (7, 7). k=4 left.
Reduce both 7s by 1: (6, 6). k=2 left.
Reduce both 6s by 1: (5, 5). k=0 left.
Sum = 5^2 + 5^2 = 25 + 25 = 50. Correct.

The frequency array size should be 100001 for differences up to 100000.
The maximum difference `d` we consider is 100000.
The intermediate `new_diff` can become negative if `reduction_per_pair > d`. This is fine, as it means we can reduce the difference to 0.
The problem states `nums1[i], nums2[i] <= 105`. The maximum difference is `105 - 0 = 105`.
So, the `counts` array size can be 106. Or, more generally, `max_val + 1` where `max_val` is the maximum possible difference.
Let's set `max_val = 100000` based on problem constraints.
The frequency array size is `100001`.

Consider the data types. `k1`, `k2` up to 10^9. So `k` can be up to 2 * 10^9. This fits in `long long`.
The sum of squared differences can be large.
`n` up to 10^5. Max difference `10^5`. Max squared difference `(10^5)^2 = 10^{10}`.
The sum can be `n * (10^5)^2 = 10^5 * 10^{10} = 10^{15}`. This requires `long long`.

The frequency array `counts` stores counts of pairs. The maximum count for a difference can be `n` (10^5). This fits in `int`.
However, `counts[d-1] += reductions_to_apply` might exceed `int` if `reductions_to_apply` is large and `counts[d-1]` is already large.
No, `reductions_to_apply` is at most `k` (2*10^9) or `num_pairs` (10^5).
The sum of all `counts[d]` must be `n`. So `counts` elements will not exceed `n`.

The maximum difference is `10^5`. So `counts` array of size `100001` is sufficient.
We iterate `d` from `100000` down to `1`.

Final check on step 5 logic:
If `k > 0` after the loop:
We have `k` operations remaining.
These operations will reduce the remaining positive differences.
Let's say the largest remaining difference is `D`.
We have `counts[D]` elements with this difference.
We can use `k` operations.
If `k >= counts[D]`: We can reduce all `counts[D]` elements by 1. Cost `counts[D]`. `k -= counts[D]`. `counts[D-1] += counts[D]`. `counts[D] = 0`.
If `k < counts[D]`: We can reduce `k` elements by 1. Cost `k`. `counts[D-1] += k`. `counts[D] -= k`. `k = 0`.

This suggests we don't need the division/modulo logic for `k > 0` if we just keep reducing the largest remaining difference by 1 until `k` is exhausted.
However, the problem is to *minimize* the sum of squared differences. If we have many elements with difference `d` and few `k`, we might be better off reducing them by more than 1 if possible.

Let's reconsider the greedy approach with `k`.
Total `k` modifications.
We have `counts` of differences.
We want to apply `k` modifications to reduce the largest differences.
Suppose `counts[d]` is the number of pairs with difference `d`.
We can reduce these `counts[d]` pairs.
If we apply `x` reductions to `y` pairs, it costs `x*y`.

Alternative perspective:
The problem is to reduce the absolute differences `d_i` to new differences `d'_i` such that `sum(d_i - d'_i) <= k` and `sum((d_i)^2 - (d'_i)^2)` is minimized.
This is equivalent to maximizing `sum((d_i)^2 - (d'_i)^2)`.
Since `(d_i)^2 - (d'_i)^2 = (d_i - d'_i)(d_i + d'_i)`, and we want to maximize this reduction.
For a fixed `d_i - d'_i` (which is the cost in `k`), we want to maximize `d_i + d'_i`. This means we want `d_i` to be as large as possible.
This confirms the greedy approach: reduce the largest differences first.

Let's refine step 4 again.
After the initial loop `d = 100000` down to `1`:
If `k > 0`:
We have `k` modifications left.
These modifications should be used to reduce the largest remaining differences.
We can iterate through the `counts` array from the highest index downwards.
For each `diff` where `counts[diff] > 0`:
  `num_pairs_at_diff = counts[diff]`
  If `k == 0`, break.

  // How many full steps of reducing all these pairs by 1 can we make?
  `steps = k / num_pairs_at_diff`

  if `steps > 0`:
      `reduction_amount = min((long long)diff, steps)` // Cannot reduce beyond 0.
      `effective_steps = min((long long)diff, steps)` // How much we can actually reduce.
      `k -= effective_steps * num_pairs_at_diff`
      `counts[diff - effective_steps] += num_pairs_at_diff`
      `counts[diff] = 0` // All these pairs have moved to a smaller difference.

  // Handle remaining `k` for this `num_pairs_at_diff`.
  // This is where `k % num_pairs_at_diff` comes in.
  `remaining_k_for_this_group = k % num_pairs_at_diff`

  if `remaining_k_for_this_group > 0`:
      `reduction_amount = min((long long)diff - (long long)diff + 1, remaining_k_for_this_group)`
      // The actual reduction is 1 if `diff > 0`.
      `actual_reduction = 1` // since we are distributing the remainder by 1
      if `diff > 0`:
          `new_diff = diff - actual_reduction`
          `counts[new_diff] += remaining_k_for_this_group`
          `k -= remaining_k_for_this_group`
          `counts[diff] -= remaining_k_for_this_group` // This subtract is tricky if `counts[diff]` was not `num_pairs_at_diff`.

This distribution logic is still feeling error-prone.

Simpler approach for step 5 (if k > 0):
Iterate from `d = 100000` down to `0`.
If `counts[d] > 0`:
  `num = counts[d]`
  `reduction = min((long long)d, k / num)` // How much we can reduce each of these `num` elements by.
  if `reduction > 0`:
    `new_d = d - reduction`
    `counts[new_d] += num`
    `k -= reduction * num`
  `remainder = k % num`
  if `remainder > 0`:
    // We have `remainder` operations left, and `num` pairs.
    // Each of these `remainder` pairs can be reduced by 1 more.
    // The new difference will be `d - reduction - 1`.
    `new_d_one_less = d - reduction - 1`
    if `new_d_one_less >= 0`: // Ensure we don't go below 0. This is guaranteed by min(d, k/num) if d > 0.
      `counts[new_d_one_less] += remainder`
      `k -= remainder`
  `counts[d] = 0` // All elements originally at `d` have been accounted for.
  if `k == 0`, break.

This seems to correctly distribute the remaining `k` modifications.

Consider edge case: `k` is very large, `nums1=[0], nums2=[100000]`. `k=10^9`.
Difference = 100000. `counts[100000] = 1`. `k = 10^9`.
Iterate `d = 100000` down to `1`.
d=100000: counts[100000]=1, k=10^9.
reductions_to_apply = min(k, counts[100000]) = min(10^9, 1) = 1.
k -= 1 => k = 10^9 - 1.
counts[99999] += 1.
counts[100000] -= 1 => counts[100000] = 0.
k is not 0. Continue loop.

Loop finishes. `k = 10^9 - 1`.
Step 5:
d=99999: counts[99999]=1, k=10^9-1.
num = 1.
reduction = min((long long)99999, k / num) = min(99999, 10^9 - 1) = 99999.
new_d = 99999 - 99999 = 0.
counts[0] += 1.
k -= 99999 * 1 => k = (10^9 - 1) - 99999.
remainder = k % num = (k_after_reduction) % 1 = 0.
counts[99999] = 0.
k is not 0.

This logic is flawed. The `reduction` calculation should use the current `k`.

Let's rethink step 5 with a clear distribution strategy.
If `k > 0` after the loop:
We have `k` remaining modifications.
We should use these to reduce the largest remaining differences as much as possible, towards zero.
We can iterate through the `counts` array from `max_val` down to `0`.
For each `diff` with `counts[diff] > 0`:
  `num_pairs = counts[diff]`
  If `k == 0`, break.

  // We have `num_pairs` elements at difference `diff`, and `k` operations.
  // We want to reduce these elements.
  // The maximum we can reduce each of them by is `diff`.
  // We can afford `k` total reductions.
  // We can perform `k / num_pairs` full reductions of size `diff` on each of the `num_pairs`.
  // This logic is still not quite right.

The fundamental idea for step 5:
We have `k` operations. We have `counts` of differences.
We want to distribute `k` operations to reduce the largest differences.
The most effective use of `k` operations is to reduce the largest differences first.
If we have `N` pairs with difference `D`, and `k` operations, we can reduce each of them by at most `D`.
The total reduction possible for these `N` pairs is `N * D`.
If `k >= N * D`, we can reduce all these `N` pairs to difference 0.
Cost: `N * D`. `k -= N * D`. `counts[0] += N`. `counts[D] = 0`.
If `k < N * D`:
  We can reduce each of the `N` pairs by `k / N`. Let this be `reduction_per_pair`.
  `k_used_full = (k / N) * N`. `k -= k_used_full`.
  `counts[D - reduction_per_pair] += N`.
  Now we have `k` (which is `k % N`) operations left.
  These `k` operations can be applied to `k` of the `N` pairs, reducing them by 1 more.
  `counts[D - reduction_per_pair - 1] += k`.
  `counts[D - reduction_per_pair] -= k` (if we are tracking exact counts for each difference, which we are).
  `counts[D] = 0`.

This implies that `counts` needs to be handled carefully.
After the first loop (greedy reduction from max_diff downwards), the `counts` array represents the state after applying as many *full* reductions as possible from largest differences.
If `k > 0` remaining:
Iterate `d` from `100000` down to `0`.
If `counts[d] > 0`:
  `num = counts[d]`
  `can_reduce_by = min((long long)d, k / num)` // How much each of these `num` can be reduced by, limited by `d`.
  if `can_reduce_by > 0`:
    `new_d = d - can_reduce_by`
    `counts[new_d] += num` // Move these `num` pairs to the new difference.
    `k -= can_reduce_by * num` // Use up `k`.
  `remainder = k % num` // The `k` operations not fully used above (due to `k/num` not being `d` or not enough total `k`).
  if `remainder > 0`:
    // We have `remainder` operations left. These should be used to reduce `remainder` of the `num` pairs by 1 more.
    `new_d_one_less = d - can_reduce_by - 1`
    if `new_d_one_less >= 0`: // Ensure we don't go below 0.
      `counts[new_d_one_less] += remainder` // Add these `remainder` pairs to the new difference.
      `k -= remainder`
  `counts[d] = 0` // All original pairs at `d` are now accounted for.
  if `k == 0`, break.

This seems correct for handling the remaining `k`.

Final check:
Max value of `nums1[i], nums2[i]` is `10^5`. Max difference is `10^5`.
So `counts` array of size `100001` is correct.
`k` is `long long`.
`sum_sq_diff` is `long long`.
The intermediate calculations for `k`, `reduction`, `new_d` should handle `long long`.

Consider the case where `k` is so large that it can reduce all differences to 0.
e.g., `nums1=[0], nums2=[100000]`, `k = 100000`.
`counts[100000]=1`.
`d=100000`: `counts[100000]=1`, `k=100000`.
`reductions_to_apply = min(100000, 1) = 1`.
`k -= 1 => k=99999`.
`counts[99999] += 1`.
`counts[100000] -= 1 => 0`.
Loop continues.

After loop, `k=99999`.
Step 5:
`d=99999`: `counts[99999]=1`, `k=99999`.
`num = 1`.
`can_reduce_by = min((long long)99999, k / num) = min(99999, 99999/1) = 99999`.
`new_d = 99999 - 99999 = 0`.
`counts[0] += 1`.
`k -= 99999 * 1 => k = 99999 - 99999 = 0`.
`remainder = k % num = 0 % 1 = 0`.
`counts[99999] = 0`.
`k == 0`, break.

Final counts: `counts[0] = 1`.
Sum: `counts[0] * 0*0 = 0`. Correct.

This logic seems solid now.

```cpp
#include <vector>
#include <cmath>
#include <numeric>
#include <algorithm>

class Solution {
public:
    long long minSumSquareDiff(std::vector<int>& nums1, std::vector<int>& nums2, int k1, int k2) {
        // Total modifications available.
        long long k = (long long)k1 + k2;

        // Max possible difference is 10^5 (from problem constraints 0 <= nums[i] <= 10^5).
        // We use 100001 to include difference 100000.
        const int MAX_DIFF = 100000;
        std::vector<int> counts(MAX_DIFF + 1, 0);

        // Calculate initial absolute differences and count their frequencies.
        for (size_t i = 0; i < nums1.size(); ++i) {
            int diff = std::abs(nums1[i] - nums2[i]);
            if (diff > 0) { // Only non-zero differences need reduction.
                counts[diff]++;
            }
        }

        // Greedily reduce the largest differences first.
        // Iterate from the maximum possible difference down to 1.
        for (int d = MAX_DIFF; d >= 1; --d) {
            // If there are pairs with difference 'd'
            if (counts[d] > 0) {
                // Number of pairs with difference 'd'.
                long long num_pairs = counts[d];

                // Number of reductions we can apply to these pairs.
                // This is limited by the remaining modifications 'k' and the number of pairs.
                long long reductions_to_apply = std::min(k, num_pairs);

                // Decrease k by the number of reductions applied.
                k -= reductions_to_apply;

                // These 'reductions_to_apply' pairs are now reduced to difference 'd-1'.
                // Add them to the count of difference 'd-1'.
                if (d - 1 >= 0) { // Ensure we don't go below 0, though d-1 >= 0 here since d >= 1.
                    counts[d - 1] += reductions_to_apply;
                }
                
                // Remove these pairs from the current difference 'd'.
                counts[d] -= reductions_to_apply;

                // If we have used all modifications, we can stop.
                if (k == 0) {
                    break;
                }
            }
        }

        // If there are still modifications left (k > 0), it means we can reduce
        // the remaining positive differences further. We distribute these remaining
        // modifications to bring down the largest remaining differences as much as possible.
        if (k > 0) {
            // Iterate from the maximum possible difference down to 0.
            for (int d = MAX_DIFF; d >= 0; --d) {
                if (counts[d] > 0) {
                    long long num_pairs = counts[d];

                    // How much each of these 'num_pairs' can be reduced by.
                    // This is limited by the remaining difference 'd' and the total remaining modifications 'k' per pair.
                    // k / num_pairs gives the average reduction per pair.
                    long long reduction_per_pair = 0;
                    if (num_pairs > 0) { // Avoid division by zero
                         reduction_per_pair = std::min((long long)d, k / num_pairs);
                    }

                    if (reduction_per_pair > 0) {
                        // Calculate the new difference after reduction.
                        long long new_d = d - reduction_per_pair;
                        
                        // Move these pairs to the new difference.
                        counts[new_d] += num_pairs;
                        
                        // Update k by subtracting the total modifications used.
                        k -= reduction_per_pair * num_pairs;
                    }

                    // Handle any remaining 'k' after the full reductions.
                    // This happens if 'k' was not perfectly divisible by 'num_pairs' or 'k/num_pairs' was less than 'd'.
                    long long remainder_k = k % num_pairs;
                    
                    if (remainder_k > 0) {
                        // These 'remainder_k' operations will reduce 'remainder_k' pairs by one more.
                        // The new difference will be 'd - reduction_per_pair - 1'.
                        // This logic assumes d - reduction_per_pair is the base for the remainder.
                        // The actual reduction for these specific pairs is reduction_per_pair + 1.
                        
                        // The new difference for the remainder is derived from the current difference 'd'
                        // after potentially applying 'reduction_per_pair'.
                        // The remaining 'remainder_k' operations will reduce these 'remainder_k' elements by 1.
                        // The target difference is d - reduction_per_pair - 1.
                        long long new_d_one_less = d - reduction_per_pair - 1;

                        // Ensure we don't go below 0 difference.
                        // If new_d_one_less is negative, it means we've already reduced it to 0 or less.
                        // We effectively bring them to 0 in this case.
                        if (new_d_one_less < 0) new_d_one_less = 0;

                        counts[new_d_one_less] += remainder_k;
                        k -= remainder_k;
                    }
                    
                    // All pairs originally at difference 'd' have now been accounted for.
                    counts[d] = 0;

                    // If we've used all modifications, stop.
                    if (k == 0) {
                        break;
                    }
                }
            }
        }

        // Calculate the final sum of squared differences.
        long long sum_sq_diff = 0;
        for (int d = 0; d <= MAX_DIFF; ++d) {
            if (counts[d] > 0) {
                sum_sq_diff += (long long)d * d * counts[d];
            }
        }

        return sum_sq_diff;
    }
};
```