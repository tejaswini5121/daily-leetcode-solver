```cpp
// Problem: Minimum Score by Changing Two Elements
// Link: https://leetcode.com/problems/minimum-score-by-changing-two-elements/
//
// Approach:
// The score of an array is defined as the sum of its minimum and maximum absolute differences between any two elements.
// We are allowed to change exactly two elements to minimize this score.
//
// To minimize the score, we want to make the minimum absolute difference as small as possible (ideally 0) and the maximum absolute difference as small as possible.
//
// The minimum absolute difference is minimized when two elements are made equal. The smallest possible value for this is 0.
// The maximum absolute difference is minimized when the largest and smallest elements in the array are brought closer together.
//
// Let the sorted array be `a_1, a_2, ..., a_n`.
// The original minimum difference is `a_2 - a_1` and the original maximum difference is `a_n - a_1`.
//
// If we change two elements, we have a few strategic options to minimize the score:
//
// 1. Make the smallest element and some other element equal to the second smallest element.
//    - If we change `nums[0]` and `nums[1]` (after sorting) to `nums[1]`.
//    - The new array will have `nums[1]` as the minimum and `nums[n-1]` as the maximum.
//    - The minimum difference will be 0 (since `nums[1]` is repeated).
//    - The maximum difference will be `nums[n-1] - nums[1]`.
//    - Score = `0 + (nums[n-1] - nums[1])`.
//
// 2. Make the largest element and some other element equal to the second largest element.
//    - If we change `nums[n-1]` and `nums[n-2]` (after sorting) to `nums[n-2]`.
//    - The new array will have `nums[0]` as the minimum and `nums[n-2]` as the maximum.
//    - The minimum difference will be 0 (since `nums[n-2]` is repeated).
//    - The maximum difference will be `nums[n-2] - nums[0]`.
//    - Score = `0 + (nums[n-2] - nums[0])`.
//
// 3. Make the smallest element equal to the largest element, and also change another element.
//    - This is covered by the previous two cases because if we make the smallest and largest equal, we can either pick the second smallest or second largest as the target value to minimize the range.
//    - For instance, if we change `nums[0]` to `nums[n-1]`, the new min is `nums[1]` and max is `nums[n-1]`.
//    - If we change `nums[0]` to `nums[1]`, new min is `nums[1]` and max is `nums[n-1]`. This covers case 1.
//    - If we change `nums[n-1]` to `nums[0]`, new min is `nums[0]` and max is `nums[n-2]`. This covers case 2.
//
// 4. Make the smallest element equal to some value, and the largest element equal to some value.
//    - The goal is to shrink the range `[min, max]`.
//    - If we change the smallest element `nums[0]` and the largest element `nums[n-1]`, we can make them equal to any value.
//    - To minimize `max - min`, we would want to bring `nums[0]` and `nums[n-1]` closer.
//    - If we change `nums[0]` and `nums[1]` to `nums[1]`, the new range is `[nums[1], nums[n-1]]`. This is case 1.
//    - If we change `nums[n-1]` and `nums[n-2]` to `nums[n-2]`, the new range is `[nums[0], nums[n-2]]`. This is case 2.
//
// Crucially, the minimum absolute difference can always be made 0 by making at least two elements equal.
// So, the problem reduces to minimizing the maximum absolute difference after ensuring a minimum difference of 0.
//
// The two elements we change should be strategically picked to minimize the remaining range.
//
// Let the sorted array be `nums_sorted`.
// The potential minimum scores are achieved by considering the following scenarios for the range `[min_val, max_val]` after changes:
//
// Scenario 1: We change the smallest element and one other element. To minimize the range, we can change `nums_sorted[0]` and `nums_sorted[1]` to `nums_sorted[1]`.
//             The new array will effectively have `nums_sorted[1]` as its minimum and `nums_sorted[n-1]` as its maximum.
//             The minimum difference becomes 0.
//             The maximum difference becomes `nums_sorted[n-1] - nums_sorted[1]`.
//             The score is `0 + (nums_sorted[n-1] - nums_sorted[1])`.
//
// Scenario 2: We change the largest element and one other element. To minimize the range, we can change `nums_sorted[n-1]` and `nums_sorted[n-2]` to `nums_sorted[n-2]`.
//             The new array will effectively have `nums_sorted[0]` as its minimum and `nums_sorted[n-2]` as its maximum.
//             The minimum difference becomes 0.
//             The maximum difference becomes `nums_sorted[n-2] - nums_sorted[0]`.
//             The score is `0 + (nums_sorted[n-2] - nums_sorted[0])`.
//
// We need to consider which pair of elements to change. The most impactful changes to reduce the range are those involving the smallest and largest elements.
// If we change two elements, say `a` and `b`, to some values `x` and `y`, the new minimum and maximum will be determined by the remaining elements and `x`, `y`.
//
// Consider the sorted array `nums[0], nums[1], ..., nums[n-1]`.
// The minimum score can be achieved by minimizing the `max - min` difference.
// To get a minimum difference of 0, we must make two elements equal.
//
// Option A: Change `nums[0]` and `nums[1]` to `nums[1]`.
//           The new effective range is `[nums[1], nums[n-1]]`.
//           The score is `(nums[n-1] - nums[1]) + 0 = nums[n-1] - nums[1]`.
//
// Option B: Change `nums[n-1]` and `nums[n-2]` to `nums[n-2]`.
//           The new effective range is `[nums[0], nums[n-2]]`.
//           The score is `(nums[n-2] - nums[0]) + 0 = nums[n-2] - nums[0]`.
//
// We need to find the minimum of these two possibilities.
//
// Example 1: nums = [1,4,7,8,5]
// Sorted: [1, 4, 5, 7, 8]
// n = 5
//
// Option A: Change 1 and 4 to 4. Array becomes [4,4,5,7,8].
//           Min diff = 0. Max diff = 8-4 = 4. Score = 4.
//           (This corresponds to `nums[n-1] - nums[1] = 8 - 4 = 4`)
//
// Option B: Change 8 and 7 to 7. Array becomes [1,4,5,7,7].
//           Min diff = 0. Max diff = 7-1 = 6. Score = 6.
//           (This corresponds to `nums[n-2] - nums[0] = 7 - 1 = 6`)
//
// The output is 3. My reasoning above yields 4 or 6. What am I missing?
//
// The problem states "after changing two elements". It does not constrain us to change specific positions or make them equal to existing elements.
//
// Let the sorted array be `a_1, a_2, ..., a_n`.
//
// We want to minimize `max_diff + min_diff`.
// We can always make `min_diff = 0` by making two elements equal.
// So, the problem is to minimize `max_diff`.
//
// What are the possible `max_diff` values after changing two elements?
//
// Case 1: We change the smallest element `a_1` and one other element.
//         To minimize the range `[min, max]`, we want to raise `a_1`.
//         If we change `a_1` to `a_2`, and `a_2` to `a_2`.
//         The new minimum becomes `a_2`. The maximum remains `a_n`.
//         The range is `[a_2, a_n]`. `max_diff = a_n - a_2`.
//         This is achieved by changing `nums[0]` and `nums[1]` to `nums[1]` (after sorting).
//         Score = `(a_n - a_2) + 0 = a_n - a_2`.
//
// Case 2: We change the largest element `a_n` and one other element.
//         To minimize the range `[min, max]`, we want to lower `a_n`.
//         If we change `a_n` to `a_{n-1}`, and `a_{n-1}` to `a_{n-1}`.
//         The minimum remains `a_1`. The new maximum becomes `a_{n-1}`.
//         The range is `[a_1, a_{n-1}]`. `max_diff = a_{n-1} - a_1`.
//         This is achieved by changing `nums[n-1]` and `nums[n-2]` to `nums[n-2]` (after sorting).
//         Score = `(a_{n-1} - a_1) + 0 = a_{n-1} - a_1`.
//
// Are there other ways to reduce `max_diff`?
// What if we change `a_1` and `a_n`?
// Suppose we change `a_1` to `x` and `a_n` to `y`.
//
// Let's re-examine Example 1: nums = [1,4,7,8,5]
// Sorted: [1, 4, 5, 7, 8]
// n = 5
//
// Potential scores derived from `a_n - a_2` and `a_{n-1} - a_1`:
// `a_n - a_2` = `8 - 5 = 3`.
// `a_{n-1} - a_1` = `7 - 1 = 6`.
// Minimum of these is 3.
//
// How to achieve a score of 3?
// Change two elements to make the min diff 0 and max diff 3.
// Array: [1, 4, 5, 7, 8]
// If we change `nums[0]` (which is 1) and `nums[1]` (which is 4).
// The target array is [6,6,7,8,5].
// Sorted becomes [5, 6, 6, 7, 8].
// Min diff = |6 - 6| = 0.
// Max diff = |8 - 5| = 3.
// Score = 0 + 3 = 3.
//
// So, the problem seems to be about finding the minimum of:
// 1. `nums[n-1] - nums[1]` (after sorting). This represents changing `nums[0]` and `nums[1]` to `nums[1]`. The min diff is 0. Max diff is `nums[n-1] - nums[1]`.
// 2. `nums[n-2] - nums[0]` (after sorting). This represents changing `nums[n-1]` and `nums[n-2]` to `nums[n-2]`. The min diff is 0. Max diff is `nums[n-2] - nums[0]`.
// 3. `nums[n-1] - nums[0]` (after sorting). This assumes we change two elements such that the minimum is still `nums[0]` and the maximum is still `nums[n-1]`, but we also managed to make two elements equal. This isn't directly achievable by just picking two elements and changing them to shrink the range to this.
//
// Let's reconsider what "change two elements" implies.
// We can pick any two indices `i` and `j`, and change `nums[i]` and `nums[j]` to any values.
//
// To minimize `max_score + min_score`, we'd aim for `min_score = 0`. This means we make at least two elements equal.
//
// Let the sorted array be `a_1, a_2, ..., a_n`.
//
// Possibility 1: We ensure `a_1` is still the minimum and `a_n` is still the maximum.
//                To achieve `min_score = 0`, we need to make two elements equal.
//                We can change `a_1` and `a_2` to `a_2`. The new set is `a_2, a_2, a_3, ..., a_n`.
//                The range is `[a_2, a_n]`. Max difference is `a_n - a_2`. Min difference is 0. Score = `a_n - a_2`.
//                This is achieved by changing `nums[0]` and `nums[1]` to `nums[1]`.
//
// Possibility 2: We ensure `a_1` is still the minimum and `a_n` is still the maximum.
//                To achieve `min_score = 0`, we need to make two elements equal.
//                We can change `a_{n-1}` and `a_n` to `a_{n-1}`. The new set is `a_1, a_2, ..., a_{n-1}, a_{n-1}`.
//                The range is `[a_1, a_{n-1}]`. Max difference is `a_{n-1} - a_1`. Min difference is 0. Score = `a_{n-1} - a_1`.
//                This is achieved by changing `nums[n-1]` and `nums[n-2]` to `nums[n-2]`.
//
// These two cases are precisely what my initial analysis pointed to.
//
// Why does Example 1 give 3?
// nums = [1,4,7,8,5]
// Sorted: [1, 4, 5, 7, 8]
//
// `nums[n-1] - nums[1]` = `8 - 4 = 4`. This corresponds to making the array `[4,4,5,7,8]`. Min score 0, Max score 4. Total 4.
// `nums[n-2] - nums[0]` = `7 - 1 = 6`. This corresponds to making the array `[1,4,5,7,7]`. Min score 0, Max score 6. Total 6.
//
// The example explanation says: "Change nums[0] and nums[1] to be 6 so that nums becomes [6,6,7,8,5]".
// Original nums = [1, 4, 7, 8, 5]
// Indices:       0  1  2  3  4
//
// Change nums[0] (value 1) and nums[1] (value 4) to value 6.
// New nums = [6, 6, 7, 8, 5].
// Sorted new nums = [5, 6, 6, 7, 8].
// Min absolute difference: |6 - 6| = 0.
// Maximum absolute difference: |8 - 5| = 3.
// Score = 0 + 3 = 3.
//
// This operation changed the original `min=1` and `second_min=4` to `6` and `6`.
// The new minimum is 5. The new maximum is 8.
// The range is [5, 8]. The max difference is 8 - 5 = 3.
// The two elements we changed are now both 6, so minimum difference is 0.
//
// The key insight is that we can choose *any* two elements to change, and they can be changed to *any* value.
//
// The score is `min_abs_diff + max_abs_diff`.
// We want to minimize this sum.
// We can always make `min_abs_diff = 0` by changing two elements to the same value.
// So, the problem becomes minimizing `max_abs_diff`.
//
// Let the original sorted array be `a_1, a_2, ..., a_n`.
//
// To minimize `max_abs_diff`, we want to make the smallest possible range `[min_val, max_val]` after modification.
//
// Consider the four extreme values: `a_1, a_2, a_{n-1}, a_n`.
//
// Option 1: We make the two smallest elements equal. This ensures `min_abs_diff = 0`.
//             To minimize the range, we could:
//             a) Change `a_1` and `a_2` to `a_2`. New range `[a_2, a_n]`. Max diff `a_n - a_2`. Score `a_n - a_2`.
//             b) Change `a_1` to `a_2` and `a_2` to `a_2`. Same as above.
//             c) Change `a_1` and `a_k` (for some k) to `a_2`. This is complex.
//
// The critical realization might be that we are changing *two elements*.
// These two elements are candidates for becoming the new minimum or maximum, or being removed from consideration for extremes.
//
// Let the sorted array be `nums[0], nums[1], ..., nums[n-1]`.
//
// Possible resulting states for `(min_val, max_val)` after changing two elements, and ensuring `min_abs_diff = 0`:
//
// 1. Change `nums[0]` and `nums[1]`. We can make them equal.
//    a) Make them both equal to `nums[1]`. New array conceptually `nums[1], nums[1], nums[2], ..., nums[n-1]`.
//       The minimum is `nums[1]`. The maximum is `nums[n-1]`.
//       Range `[nums[1], nums[n-1]]`. Max diff = `nums[n-1] - nums[1]`.
//       Score = `(nums[n-1] - nums[1]) + 0 = nums[n-1] - nums[1]`.
//    b) Make them both equal to `nums[0]`. This is not optimal as it doesn't necessarily reduce the max diff.
//
// 2. Change `nums[n-1]` and `nums[n-2]`. We can make them equal.
//    a) Make them both equal to `nums[n-2]`. New array conceptually `nums[0], nums[1], ..., nums[n-2], nums[n-2]`.
//       The minimum is `nums[0]`. The maximum is `nums[n-2]`.
//       Range `[nums[0], nums[n-2]]`. Max diff = `nums[n-2] - nums[0]`.
//       Score = `(nums[n-2] - nums[0]) + 0 = nums[n-2] - nums[0]`.
//
// 3. Change `nums[0]` and `nums[n-1]`. We can make them equal.
//    a) Make them both equal to `nums[1]`. New array `nums[1], ..., nums[n-1]` with `nums[0]` and `nums[n-1]` replaced.
//       The new minimum could be `nums[1]`. The new maximum could be `nums[n-2]`.
//       This seems too complex if we pick arbitrary values.
//
// What if we change `nums[0]` and `nums[1]` to some value `V`?
// The new array's minimum will be `min(V, nums[2], ..., nums[n-1])`.
// The new array's maximum will be `max(V, nums[2], ..., nums[n-1])`.
//
// If we want `min_abs_diff = 0`, we must make two elements equal.
//
// The crucial part is that we can change *any* two elements.
//
// Let the sorted array be `a_1, a_2, ..., a_n`.
//
// Consider the resulting array after changes. Let its minimum be `m` and maximum be `M`.
// The `max_abs_diff` will be `M - m`.
// We can achieve `min_abs_diff = 0` by making two elements equal.
// So we want to minimize `M - m`.
//
// The minimum `M - m` can be achieved by one of the following scenarios:
//
// Scenario A: We modify the two smallest elements such that the new minimum is `a_2`.
//             We can change `a_1` and `a_2` to `a_2`.
//             The new minimum becomes `a_2`. The maximum remains `a_n`.
//             The range is `[a_2, a_n]`. `M - m = a_n - a_2`.
//             Score = `(a_n - a_2) + 0 = a_n - a_2`.
//
// Scenario B: We modify the two largest elements such that the new maximum is `a_{n-1}`.
//             We can change `a_{n-1}` and `a_n` to `a_{n-1}`.
//             The minimum remains `a_1`. The new maximum becomes `a_{n-1}`.
//             The range is `[a_1, a_{n-1}]`. `M - m = a_{n-1} - a_1`.
//             Score = `(a_{n-1} - a_1) + 0 = a_{n-1} - a_1`.
//
// The example output of 3 for `[1,4,7,8,5]` suggests that `a_n - a_2` is the correct formula in that case: `8 - 5 = 3`.
// This means we changed `nums[0]` and `nums[1]` to `nums[1]`, effectively resulting in `[4,4,5,7,8]`, min diff 0, max diff `8-4=4`.
// Wait, the example explanation says change to 6.
//
// Example 1: [1,4,7,8,5] -> Sorted: [1, 4, 5, 7, 8]
//
// If we change `nums[0]` and `nums[1]` to be `nums[1]` (i.e., 4), the array becomes `[4,4,5,7,8]`.
//   Min diff = 0, Max diff = 8-4 = 4. Score = 4.
//
// If we change `nums[n-1]` and `nums[n-2]` to be `nums[n-2]` (i.e., 7), the array becomes `[1,4,5,7,7]`.
//   Min diff = 0, Max diff = 7-1 = 6. Score = 6.
//
// The example explanation states: "Change nums[0] and nums[1] to be 6 so that nums becomes [6,6,7,8,5]".
// Original: [1, 4, 7, 8, 5]. Sorted: [1, 4, 5, 7, 8]
// Changing `nums[0]` (1) and `nums[1]` (4) to `6`.
// New array: [6, 6, 7, 8, 5]. Sorted: [5, 6, 6, 7, 8].
// Min diff = `|6-6| = 0`.
// Max diff = `|8-5| = 3`.
// Score = `0 + 3 = 3`.
//
// This suggests that the two elements we change can be arbitrary values.
//
// If we change `a_1` and `a_2` to a value `V`, such that `V` is between `a_2` and `a_n`.
// The new minimum will be `min(V, a_3, ..., a_n)`.
// The new maximum will be `max(V, a_3, ..., a_n)`.
//
// The key is that we make two elements *equal*, resulting in `min_diff = 0`.
// And we want to minimize the `max_diff`.
//
// Consider the sorted array `a_1, a_2, ..., a_n`.
//
// Option 1: We modify `a_1` and `a_2`.
//   We can change them to any value `V`. To minimize the range `[min_new, max_new]`.
//   If we make them equal to `a_2`, the new range is `[a_2, a_n]`. Max diff = `a_n - a_2`. Score = `a_n - a_2`.
//   If we make them equal to `a_1`, the new range is `[a_1, a_n]`. This doesn't shrink the max diff.
//   If we make them equal to some `V` between `a_2` and `a_n`. For example, if we change `a_1` and `a_2` to `a_3`?
//   The example shows changing `1` and `4` to `6`. This means the new set of numbers is `5, 6, 6, 7, 8`.
//   The original numbers involved in the min/max were `1` and `8`. After changes, `1` and `4` become `6`.
//   The new set has `5` as min and `8` as max. The difference is `8 - 5 = 3`.
//
//   This implies we are looking at minimizing the difference between:
//   - The second smallest and the largest: `a_n - a_2`.
//   - The second largest and the smallest: `a_{n-1} - a_1`.
//   - The largest and the second largest: `a_n - a_{n-1}`. This is not useful for reducing the overall range.
//   - The smallest and second smallest: `a_2 - a_1`. Not useful either.
//
//   What if we change `a_1` and `a_n` to some value?
//   If we change `a_1` to `a_2`, and `a_n` to `a_{n-1}`. We've used up our two changes.
//   The array becomes `a_2, a_2, ..., a_{n-1}, a_{n-1}`.
//   Min diff = 0. Max diff = `a_{n-1} - a_2`.
//
//   So, the possible scores are:
//   1. `a_n - a_2` (by making `a_1` and `a_2` equal to `a_2`)
//   2. `a_{n-1} - a_1` (by making `a_{n-1}` and `a_n` equal to `a_{n-1}`)
//   3. `a_{n-1} - a_2` (by making `a_1` equal to `a_2`, and `a_n` equal to `a_{n-1}`)
//
//   Let's test these three with Example 1: [1, 4, 5, 7, 8]
//   `a_1=1, a_2=4, a_3=5, a_4=7, a_5=8`
//   1. `a_n - a_2` = `a_5 - a_2` = `8 - 4 = 4`.
//   2. `a_{n-1} - a_1` = `a_4 - a_1` = `7 - 1 = 6`.
//   3. `a_{n-1} - a_2` = `a_4 - a_2` = `7 - 4 = 3`.
//
//   The minimum of {4, 6, 3} is 3. This matches Example 1!
//
//   Let's test with Example 2: [1, 4, 3]
//   Sorted: [1, 3, 4]
//   `a_1=1, a_2=3, a_3=4`
//   n = 3
//   1. `a_n - a_2` = `a_3 - a_2` = `4 - 3 = 1`.
//   2. `a_{n-1} - a_1` = `a_2 - a_1` = `3 - 1 = 2`.
//   3. `a_{n-1} - a_2` = `a_2 - a_2` = `3 - 3 = 0`.
//
//   The minimum of {1, 2, 0} is 0. This matches Example 2!
//
//   The strategy is to sort the array first.
//   Then calculate the three possible minimum scores:
//   - `nums[n-1] - nums[1]` (This makes `nums[0]` and `nums[1]` equal to `nums[1]`. New min is `nums[1]`, max is `nums[n-1]`. Min diff 0).
//   - `nums[n-2] - nums[0]` (This makes `nums[n-1]` and `nums[n-2]` equal to `nums[n-2]`. New min is `nums[0]`, max is `nums[n-2]`. Min diff 0).
//   - `nums[n-1] - nums[2]` (This is not correct. It should be `nums[n-1] - nums[2]` in the sorted array. If we change `nums[0]` to `nums[1]` and `nums[n-1]` to `nums[n-2]`, we get `nums[n-2] - nums[1]`. Let's recheck.)
//
//   Let's verify scenario 3: `a_{n-1} - a_2`.
//   This is achieved by changing `a_1` to `a_2` AND changing `a_n` to `a_{n-1}`.
//   The two elements changed are `a_1` and `a_n`.
//   The values they are changed to are `a_2` and `a_{n-1}` respectively.
//   The new array has elements: `a_2, a_2, a_3, ..., a_{n-1}, a_{n-1}`.
//   The minimum is `a_2`. The maximum is `a_{n-1}`.
//   The `max_diff` is `a_{n-1} - a_2`.
//   To make `min_diff = 0`, we need two equal elements.
//   We changed `a_1` to `a_2`, so `a_2` is present twice. The minimum is `a_2`.
//   This scenario requires changing `a_1` and `a_n`. The score is `a_{n-1} - a_2`.
//   In terms of 0-indexed sorted `nums`: `nums[n-2] - nums[1]`.
//
//   Let's re-evaluate the three candidates based on 0-indexed sorted `nums`:
//   Sorted array: `nums[0], nums[1], ..., nums[n-1]`.
//
//   Candidate 1: Score = `nums[n-1] - nums[1]`.
//                Achieved by changing `nums[0]` and `nums[1]` to `nums[1]`.
//                New array concept: `nums[1], nums[1], nums[2], ..., nums[n-1]`.
//                Min diff = 0, Max diff = `nums[n-1] - nums[1]`. Score = `nums[n-1] - nums[1]`.
//
//   Candidate 2: Score = `nums[n-2] - nums[0]`.
//                Achieved by changing `nums[n-1]` and `nums[n-2]` to `nums[n-2]`.
//                New array concept: `nums[0], nums[1], ..., nums[n-2], nums[n-2]`.
//                Min diff = 0, Max diff = `nums[n-2] - nums[0]`. Score = `nums[n-2] - nums[0]`.
//
//   Candidate 3: Score = `nums[n-2] - nums[1]`.
//                Achieved by changing `nums[0]` to `nums[1]` AND `nums[n-1]` to `nums[n-2]`.
//                The elements changed are `nums[0]` and `nums[n-1]`.
//                The new array concept: `nums[1], nums[1], nums[2], ..., nums[n-2], nums[n-2]`.
//                Min diff = 0 (due to `nums[1]` repetition), Max diff = `nums[n-2] - nums[1]`. Score = `nums[n-2] - nums[1]`.
//
//   Let's recheck Example 1: [1, 4, 5, 7, 8] (n=5)
//   Candidate 1: `nums[4] - nums[1]` = `8 - 4 = 4`.
//   Candidate 2: `nums[3] - nums[0]` = `7 - 1 = 6`.
//   Candidate 3: `nums[3] - nums[1]` = `7 - 4 = 3`.
//   Min is 3. Correct.
//
//   Let's recheck Example 2: [1, 3, 4] (n=3)
//   Candidate 1: `nums[2] - nums[1]` = `4 - 3 = 1`.
//   Candidate 2: `nums[1] - nums[0]` = `3 - 1 = 2`.
//   Candidate 3: `nums[1] - nums[1]` = `3 - 3 = 0`.
//   Min is 0. Correct.
//
//   This set of three candidates seems to cover all minimal cases.
//   The core idea is that to minimize the range `[min_val, max_val]` and ensure `min_abs_diff = 0`, we should focus on the extreme elements.
//   We have two changes. These changes are best used to:
//   1. Eliminate the smallest element and make the second smallest the new min. (Affects `nums[0]` and `nums[1]`)
//   2. Eliminate the largest element and make the second largest the new max. (Affects `nums[n-1]` and `nums[n-2]`)
//   3. Eliminate both the smallest and largest element. (Affects `nums[0]` and `nums[n-1]`)
//
//   For each scenario, we also need to ensure `min_abs_diff = 0`. This is naturally achieved by the way we form the new range.
//   For scenario 1, changing `nums[0]` and `nums[1]` to `nums[1]` makes them equal.
//   For scenario 2, changing `nums[n-1]` and `nums[n-2]` to `nums[n-2]` makes them equal.
//   For scenario 3, changing `nums[0]` to `nums[1]` and `nums[n-1]` to `nums[n-2]` makes `nums[1]` and `nums[n-2]` appear twice. This requires `nums[1]` to be duplicated.
//   If `nums[0]` is changed to `nums[1]`, and `nums[n-1]` is changed to `nums[n-2]`.
//   The elements are `nums[1], nums[1], nums[2], ..., nums[n-2], nums[n-2]`.
//   This makes `nums[1]` and `nums[n-2]` the new min and max.
//   The smallest element used is `nums[1]`, largest is `nums[n-2]`.
//   The difference is `nums[n-2] - nums[1]`.
//   The minimum difference is 0 because `nums[1]` is repeated.
//
//   This logic seems solid. The implementation will be:
//   1. Sort the input array `nums`.
//   2. Calculate `n = nums.size()`.
//   3. Compute the three candidate scores:
//      - `nums[n-1] - nums[1]`
//      - `nums[n-2] - nums[0]`
//      - `nums[n-2] - nums[1]`
//   4. Return the minimum of these three values.
//
// Time Complexity: O(N log N) due to sorting. Accessing elements takes O(1).
// Space Complexity: O(log N) or O(N) depending on the sort implementation (for recursion stack or auxiliary space). If in-place sort is used, it's O(log N) for typical implementations.

#include <vector>
#include <algorithm>
#include <climits>

class Solution {
public:
    int minimumScore(std::vector<int>& nums) {
        // Sort the array to easily identify minimum, maximum, second minimum, and second maximum elements.
        std::sort(nums.begin(), nums.end());

        // Get the size of the array.
        int n = nums.size();

        // We want to minimize the score, which is the sum of minimum and maximum absolute differences.
        // The minimum absolute difference can always be made 0 by changing two elements to the same value.
        // Therefore, the problem reduces to minimizing the maximum absolute difference after ensuring a minimum difference of 0.

        // We consider three main strategies to minimize the range [min_val, max_val] using exactly two changes:

        // Strategy 1: Change the two smallest elements such that the new minimum is the second smallest element.
        // This can be achieved by changing nums[0] and nums[1] to nums[1].
        // The resulting conceptual array will have nums[1] as its minimum and nums[n-1] as its maximum.
        // The minimum absolute difference is 0 (since nums[1] is repeated).
        // The maximum absolute difference is nums[n-1] - nums[1].
        // The score in this case is (nums[n-1] - nums[1]) + 0.
        int score1 = nums[n - 1] - nums[1];

        // Strategy 2: Change the two largest elements such that the new maximum is the second largest element.
        // This can be achieved by changing nums[n-1] and nums[n-2] to nums[n-2].
        // The resulting conceptual array will have nums[0] as its minimum and nums[n-2] as its maximum.
        // The minimum absolute difference is 0 (since nums[n-2] is repeated).
        // The maximum absolute difference is nums[n-2] - nums[0].
        // The score in this case is (nums[n-2] - nums[0]) + 0.
        int score2 = nums[n - 2] - nums[0];

        // Strategy 3: Change the smallest element and the largest element.
        // To minimize the range and ensure min_diff = 0, we can change nums[0] to nums[1] and nums[n-1] to nums[n-2].
        // This effectively makes the new minimum nums[1] and the new maximum nums[n-2].
        // The minimum absolute difference is 0 (e.g., nums[1] is now present twice).
        // The maximum absolute difference is nums[n-2] - nums[1].
        // The score in this case is (nums[n-2] - nums[1]) + 0.
        int score3 = nums[n - 2] - nums[1];

        // The minimum score will be the minimum of these three strategies.
        return std::min({score1, score2, score3});
    }
};
```