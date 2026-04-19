// Problem: Maximum Distance Between a Pair of Values
// Link: https://leetcode.com/problems/maximum-distance-between-a-pair-of-values/
//
// Approach:
// We are looking for the maximum difference `j - i` such that `i <= j` and `nums1[i] <= nums2[j]`.
// Since both arrays are non-increasing, for a fixed `i`, as `j` increases, `nums2[j]` decreases.
// This means that if `nums1[i] <= nums2[j]` is true, it will also be true for all `k < j` as long as `k >= i`.
// However, we want to maximize `j - i`.
//
// A two-pointer approach can be used. We can iterate through `nums1` with pointer `i` and
// use a pointer `j` for `nums2`. For each `i`, we want to find the largest `j` such that
// `i <= j` and `nums1[i] <= nums2[j]`.
//
// Since `nums1` is non-increasing, as `i` increases, `nums1[i]` will decrease or stay the same.
// This implies that if a `j` is valid for `nums1[i]`, it might also be valid for `nums1[i+1]`.
// Therefore, `j` can only move forward.
//
// For each `i` from 0 to `nums1.length - 1`:
//   We advance `j` (starting from `max(i, current_j)`) as long as `j < nums2.length` and `nums1[i] <= nums2[j]`.
//   Once `j` stops moving, if `nums1[i] <= nums2[j-1]` (meaning `j-1` was the last valid index in `nums2`),
//   then `(i, j-1)` is a valid pair. The distance is `(j-1) - i`. We update our maximum distance.
//   If `j` reaches `nums2.length` or `nums1[i] > nums2[j]`, we stop advancing `j` for this `i`.
//
// An optimization: for a fixed `i`, we can use binary search on `nums2` (from index `i` to `nums2.length - 1`)
// to find the largest `j` such that `nums1[i] <= nums2[j]`. This is because `nums2` is sorted (non-increasing).
// The binary search will find the rightmost element that is greater than or equal to `nums1[i]`.
//
// Let's refine the two-pointer approach for better efficiency:
// Initialize `maxDistance = 0`, `j = 0`.
// Iterate `i` from 0 to `nums1.length - 1`.
//   For the current `i`, advance `j` while `j < nums2.length` AND `nums1[i] <= nums2[j]`.
//   After the while loop, `j` is either at the end of `nums2` or `nums1[i] > nums2[j]`.
//   The last valid `j` for this `i` was `j-1`.
//   If `j > i` (meaning we found at least one `j >= i` where the condition held),
//   then the valid pair is `(i, j-1)`. The distance is `(j-1) - i`.
//   Update `maxDistance = max(maxDistance, j - 1 - i)`.
//   Note that `j` only moves forward. If `j` becomes equal to `nums2.length`, it will stay there.
//   If `j` is already less than `i`, we should set `j = i` at the start of the inner loop for `i` to ensure `i <= j`.
//   Let's adjust the `j` pointer initialization.
//
// Revised Two-Pointer Approach:
// Initialize `maxDistance = 0`.
// Initialize `j = 0` (pointer for `nums2`).
// Iterate `i` from 0 to `nums1.length - 1`:
//   While `j < nums2.length` and `nums1[i] <= nums2[j]`:
//     Increment `j`.
//   // At this point, `j` is the first index in `nums2` where `nums1[i] > nums2[j]`
//   // or `j` has reached `nums2.length`.
//   // The last valid index for `j` for the current `i` is `j - 1`.
//   // The pair is `(i, j - 1)`.
//   // We need `i <= j - 1`. If `j - 1 >= i`, then we have a valid pair.
//   // The distance is `(j - 1) - i`.
//   // `j` has already been incremented one step past the valid range.
//   // So, the current `j` is one position *beyond* the valid `j`s for `nums1[i]`.
//   // Thus, the valid `j` indices are from the previous `j` position (let's call it `prev_j`) up to `j-1`.
//   // We are interested in the largest `j-1`.
//   // The `j` pointer will only move forward. So if `j` reaches `nums2.length`, it stays there.
//   // If `j` stops because `nums1[i] > nums2[j]`, then `j-1` is the largest valid index.
//   // The distance is `(j-1) - i`.
//   // If the loop terminates because `j == nums2.length`, then `j-1` is `nums2.length - 1`.
//   // So the maximum `j` is `j-1`.
//   // The distance calculation should be `j - 1 - i`. This is only valid if `j - 1 >= i`.
//   // Since `j` is always non-decreasing and we ensure `j` advances as much as possible for each `i`,
//   // if `j` has advanced past `i`, then `j-1` is a potential candidate.
//   // If `j` stops at `k`, it means `nums1[i] <= nums2[k-1]` and (if `k < nums2.length`) `nums1[i] > nums2[k]`.
//   // So the best `j` for this `i` is `k-1`.
//   // The distance is `(k-1) - i`.
//   // The `j` pointer is *already* the first invalid index or end of array.
//   // So the correct index in `nums2` is `j-1`.
//   // We only care if `j-1 >= i`.
//   // If `j` has advanced such that `j > i`, it implies that `j-1` is a valid candidate for `j` and `j-1 >= i`.
//   // The distance is `(j-1) - i`.
//   // We can directly compute `maxDistance = max(maxDistance, j - i - 1)`.
//   // The condition `i <= j` is implicitly handled because `j` starts at 0 and only moves forward.
//   // If `j` never moves past `i`, `j-i` will be 0 or negative, and `j-i-1` will be negative.
//   // `maxDistance` will remain 0 if no valid pairs are found.
//
// Let's consider the example: nums1 = [55,30,5,4,2], nums2 = [100,20,10,10,5]
// i=0, nums1[0]=55.
//   j=0, nums2[0]=100. 55 <= 100. j becomes 1.
//   j=1, nums2[1]=20. 55 > 20. Loop stops.
//   j is now 1. The last valid j was 0. Pair (0,0). Distance 0-0=0. maxDistance = 0.
// i=1, nums1[1]=30.
//   j=1 (starts from where it left off). nums2[1]=20. 30 > 20. Loop stops.
//   j is now 1. No advancement. Last valid j was not found because initial j was not valid.
//   The logic needs refinement. The `j` for `nums1[i]` must be at least `i`.
//
// Let's use the binary search approach, which is cleaner given the sorted nature.
// For each `i` in `nums1`:
//   Find the largest index `j` in `nums2` such that `j >= i` and `nums1[i] <= nums2[j]`.
//   We can use `std::upper_bound` or `std::lower_bound` on a reversed view or carefully.
//   `std::lower_bound` finds the first element NOT LESS than the value.
//   We need the first element LESS than `nums1[i]` in the range `[i, nums2.length)`.
//   Let's search for `nums1[i]` in `nums2` from index `i` onwards.
//   We want the rightmost `j` such that `nums1[i] <= nums2[j]`.
//   In a non-increasing array, this means we want the leftmost `j` such that `nums1[i] > nums2[j]`.
//   The index *before* that would be our largest valid `j`.
//   So, search for `nums1[i]` in `nums2` (from index `i` to `nums2.length - 1`).
//   Find `it = upper_bound(nums2.begin() + i, nums2.end(), nums1[i], greater<int>())`.
//   `upper_bound` with `greater<int>()` finds the first element GREATER than `nums1[i]`.
//   This is not what we want.
//
// Let's stick to the two-pointer approach.
// For each `i` in `nums1`:
//   We need to find the largest `j` such that `j >= i` and `nums1[i] <= nums2[j]`.
//   Let `j` be the pointer for `nums2`.
//   Initialize `max_dist = 0`.
//   Initialize `j = 0`.
//   For `i` from 0 to `nums1.size() - 1`:
//     // We need to find the largest `j` such that `j >= i` AND `nums1[i] <= nums2[j]`.
//     // Since `j` is non-decreasing across iterations of `i`, we can continue `j` from where it was.
//     // Ensure `j` is at least `i`.
//     // If `j` is already greater than `i`, great. If `j < i`, we must advance `j` at least to `i`.
//     `j = max(j, i);` // This ensures `j >= i`
//     while (`j < nums2.size()` and `nums1[i] <= nums2[j]`) {
//       `j++`;
//     }
//     // After the loop, `j` is the first index where `nums1[i] > nums2[j]` or `j == nums2.size()`.
//     // The largest valid `j` for this `i` is `j - 1`.
//     // This valid `j-1` must also satisfy `i <= j-1`.
//     // Since we ensured `j >= i` initially for `j`, and `j` only increases,
//     // if `j` advanced beyond `i`, then `j-1 >= i` must hold for a valid pair.
//     // The distance is `(j - 1) - i`.
//     // If `j` didn't advance at all for this `i` (meaning `nums1[i] > nums2[i]` or `i` is out of bounds),
//     // then `j` remains `i`. `j-1` would be `i-1`, which is invalid.
//     // If `j` advanced to `k`, then `j` is now `k`. The largest valid index in `nums2` was `k-1`.
//     // The distance is `(k-1) - i`.
//     // `max_dist = max(max_dist, (j - 1) - i);` // This is problematic if `j == 0` or `j == i`.
//     // Let's analyze the condition: `0 <= i < nums1.length`, `0 <= j < nums2.length`, `i <= j`, `nums1[i] <= nums2[j]`.
//     // Distance = `j - i`.
//
// Revised Two-Pointer Approach (simpler logic):
// Initialize `max_dist = 0`.
// Initialize `j = 0`.
// For `i` from 0 to `nums1.size() - 1`:
//   // For the current `i`, we want to find the largest `j` (where `j >= i`) such that `nums1[i] <= nums2[j]`.
//   // Since `nums2` is non-increasing, and `nums1[i]` is non-increasing as `i` increases,
//   // `j` can only move forward.
//   // We can advance `j` as long as the condition holds and `j` is within bounds.
//   while (j < nums2.size() && nums1[i] <= nums2[j]) {
//     // If `nums1[i] <= nums2[j]` and `i <= j`, this is a valid pair.
//     // We want to maximize `j - i`.
//     // The current `j` is a potential candidate for the maximum `j` for this `i`.
//     // The condition `i <= j` is implicitly handled by the outer loop for `i` and inner loop for `j`.
//     // If `i` increases, `j` can only stay same or increase.
//     // If `j` starts at 0 and `i` starts at 0, and `nums1[0] <= nums2[0]`, `j` increments.
//     // Then `i` becomes 1. If `nums1[1] <= nums2[1]`, `j` increments again.
//     // The constraint `i <= j` is satisfied as long as `j` does not go backwards relative to `i`.
//     // Since `j` only moves forward, and `i` moves forward, if `j` is ahead of `i`, we're good.
//     // The critical part is: for a fixed `i`, we want the largest possible `j` that satisfies `nums1[i] <= nums2[j]` AND `i <= j`.
//     // Since `j` is guaranteed to be non-decreasing, we simply advance `j` as far as possible.
//     // `j` is the pointer for `nums2`.
//     // `i` is the pointer for `nums1`.
//     // For each `i`, we find the largest `j` such that `nums1[i] <= nums2[j]`.
//     // The condition `i <= j` must also be met.
//     // If we advance `j` while `nums1[i] <= nums2[j]`, and `j` becomes `k`, then for `i`,
//     // the largest valid `j` could be `k-1`. The distance is `(k-1) - i`.
//     // We must ensure that `i <= k-1`.
//     // If `k-1 < i`, then this pair `(i, k-1)` is invalid because `i > j`.
//     // So, we should only consider `(j-1) - i` if `j-1 >= i`.
//     // This is equivalent to `j > i`.
//     // If `j` stops at index `k`, it means `nums1[i] <= nums2[k-1]` and (if `k < nums2.size()`) `nums1[i] > nums2[k]`.
//     // So `k-1` is the largest index in `nums2` for which `nums1[i] <= nums2[k-1]`.
//     // If `k-1 >= i`, then `(i, k-1)` is a valid pair. Distance: `(k-1) - i`.
//     // `max_dist = max(max_dist, (k-1) - i)`.
//     // `j` is now `k`.
//     // So the `while` condition is correct. After the `while` loop, `j` points to the first element
//     // where the condition `nums1[i] <= nums2[j]` fails, or `j == nums2.size()`.
//     // Therefore, `j-1` is the largest index in `nums2` that satisfies `nums1[i] <= nums2[j-1]`.
//     // We also need `i <= j-1`.
//     // If `j-1 >= i`, then `max_dist = max(max_dist, (j-1) - i)`.
//     // This can be simplified: `max_dist = max(max_dist, j - 1 - i)` only if `j - 1 >= i`.
//     // Or, `max_dist = max(max_dist, j - i)` if `j > i`.
//     // Let's track `j` for `nums2`.
//     // For each `i`, we find the furthest `j` such that `nums1[i] <= nums2[j]`.
//     // If this `j` is also `j >= i`, then we have a valid pair `(i, j)`.
//     // The distance is `j - i`.
//     // `j` advances.
//     j++;
//   }
//   // Now `j` is one position *past* the valid range for `nums1[i]` in `nums2`.
//   // The valid range of `j` indices for `nums1[i]` is from `i` up to `j-1`.
//   // So, the largest valid `j` is `j-1`.
//   // We must check if `i <= j-1`. If this is true, then the distance is `(j-1) - i`.
//   // `max_dist = max(max_dist, (j - 1) - i)`.
//   // This update needs to happen when `j-1 >= i`.
//   // Since `j` advances, if `j` ends up being `k`, it means for `nums1[i]`,
//   // `nums2[k-1]` was the last element that `nums1[i]` was less than or equal to.
//   // We need to ensure that `k-1` is a valid index in `nums2` and `k-1 >= i`.
//   // If `j` has advanced, meaning `j > 0`, then `j-1` is a valid index.
//   // If `j > i`, it means we found at least one `j` such that `j >= i` and `nums1[i] <= nums2[j]`.
//   // The furthest such `j` was `j-1`. The distance is `(j-1) - i`.
//   // So, if `j > i`, `max_dist = max(max_dist, j - 1 - i)`.
//   // The `j` pointer is always at least `i` when calculating the distance because `j` is advanced only if `nums1[i] <= nums2[j]`.
//   // If `j` stops at `k`, then `j-1` is the furthest valid index.
//   // If `k > i`, then `k-1 >= i`. So the distance `(k-1) - i` is valid.
//   // `max_dist = max(max_dist, j - 1 - i)`.
//   // The pointer `j` is always trying to find the maximal `j` for the current `i`.
//   // For `i=0`, `j` moves. When it stops at `k`, the maximum `j` for `i=0` is `k-1`. The distance is `k-1 - 0`.
//   // For `i=1`, `j` starts from `k`. If `nums1[1] <= nums2[k]`, `j` moves to `k+1`. If `nums1[1] > nums2[k]`, it stops.
//   // The maximal `j` for `i=1` is `k-1`. The distance is `k-1 - 1`.
//   // So the logic `max_dist = max(max_dist, j - 1 - i)` is correct IF `j - 1 >= i`.
//   // This is equivalent to `j > i`.
//   if (j > i) { // This check ensures `i <= j-1`
//     max_dist = max(max_dist, j - 1 - i);
//   }
//
// Example 1: nums1 = [55,30,5,4,2], nums2 = [100,20,10,10,5]
// max_dist = 0, j = 0
//
// i = 0, nums1[0] = 55
//   j = 0, nums2[0] = 100. 55 <= 100. j becomes 1.
//   j = 1, nums2[1] = 20. 55 > 20. While loop ends.
//   Current j = 1.
//   Check: j > i? 1 > 0? Yes.
//   max_dist = max(0, 1 - 1 - 0) = max(0, 0) = 0.
//
// i = 1, nums1[1] = 30
//   j is 1.
//   j = 1, nums2[1] = 20. 30 > 20. While loop ends.
//   Current j = 1.
//   Check: j > i? 1 > 1? No.
//
// i = 2, nums1[2] = 5
//   j is 1.
//   j = 1, nums2[1] = 20. 5 <= 20. j becomes 2.
//   j = 2, nums2[2] = 10. 5 <= 10. j becomes 3.
//   j = 3, nums2[3] = 10. 5 <= 10. j becomes 4.
//   j = 4, nums2[4] = 5. 5 <= 5. j becomes 5.
//   j = 5. j == nums2.size(). While loop ends.
//   Current j = 5.
//   Check: j > i? 5 > 2? Yes.
//   max_dist = max(0, 5 - 1 - 2) = max(0, 4 - 2) = max(0, 2) = 2.
//
// i = 3, nums1[3] = 4
//   j is 5.
//   j = 5. j == nums2.size(). While loop ends.
//   Current j = 5.
//   Check: j > i? 5 > 3? Yes.
//   max_dist = max(2, 5 - 1 - 3) = max(2, 4 - 3) = max(2, 1) = 2.
//
// i = 4, nums1[4] = 2
//   j is 5.
//   j = 5. j == nums2.size(). While loop ends.
//   Current j = 5.
//   Check: j > i? 5 > 4? Yes.
//   max_dist = max(2, 5 - 1 - 4) = max(2, 4 - 4) = max(2, 0) = 2.
//
// Return max_dist = 2. This works for Example 1.
//
// Example 2: nums1 = [2,2,2], nums2 = [10,10,1]
// max_dist = 0, j = 0
//
// i = 0, nums1[0] = 2
//   j = 0, nums2[0] = 10. 2 <= 10. j becomes 1.
//   j = 1, nums2[1] = 10. 2 <= 10. j becomes 2.
//   j = 2, nums2[2] = 1. 2 > 1. While loop ends.
//   Current j = 2.
//   Check: j > i? 2 > 0? Yes.
//   max_dist = max(0, 2 - 1 - 0) = max(0, 1) = 1.
//
// i = 1, nums1[1] = 2
//   j is 2.
//   j = 2, nums2[2] = 1. 2 > 1. While loop ends.
//   Current j = 2.
//   Check: j > i? 2 > 1? Yes.
//   max_dist = max(1, 2 - 1 - 1) = max(1, 0) = 1.
//
// i = 2, nums1[2] = 2
//   j is 2.
//   j = 2, nums2[2] = 1. 2 > 1. While loop ends.
//   Current j = 2.
//   Check: j > i? 2 > 2? No.
//
// Return max_dist = 1. This works for Example 2.
//
// Example 3: nums1 = [30,29,19,5], nums2 = [25,25,25,25,25]
// max_dist = 0, j = 0
//
// i = 0, nums1[0] = 30
//   j = 0, nums2[0] = 25. 30 > 25. While loop ends.
//   Current j = 0.
//   Check: j > i? 0 > 0? No.
//
// i = 1, nums1[1] = 29
//   j is 0.
//   j = 0, nums2[0] = 25. 29 > 25. While loop ends.
//   Current j = 0.
//   Check: j > i? 0 > 1? No.
//
// i = 2, nums1[2] = 19
//   j is 0.
//   j = 0, nums2[0] = 25. 19 <= 25. j becomes 1.
//   j = 1, nums2[1] = 25. 19 <= 25. j becomes 2.
//   j = 2, nums2[2] = 25. 19 <= 25. j becomes 3.
//   j = 3, nums2[3] = 25. 19 <= 25. j becomes 4.
//   j = 4, nums2[4] = 25. 19 <= 25. j becomes 5.
//   j = 5. j == nums2.size(). While loop ends.
//   Current j = 5.
//   Check: j > i? 5 > 2? Yes.
//   max_dist = max(0, 5 - 1 - 2) = max(0, 4 - 2) = max(0, 2) = 2.
//
// i = 3, nums1[3] = 5
//   j is 5.
//   j = 5. j == nums2.size(). While loop ends.
//   Current j = 5.
//   Check: j > i? 5 > 3? Yes.
//   max_dist = max(2, 5 - 1 - 3) = max(2, 4 - 3) = max(2, 1) = 2.
//
// Return max_dist = 2. This works for Example 3.
//
// The condition `j > i` is crucial. It ensures that we only consider pairs `(i, j-1)` where `i <= j-1`.
// If `j <= i` after the while loop, it means we couldn't find a valid `j` such that `j >= i` and `nums1[i] <= nums2[j]`.
//
// Time complexity: O(N + M) where N is nums1.length and M is nums2.length.
// Both `i` and `j` pointers traverse their respective arrays at most once.
// The outer loop runs N times. The inner `while` loop advances `j`. Across all outer loop iterations, `j`
// traverses `nums2` at most once. So total operations are proportional to N + M.
//
// Space complexity: O(1) as we only use a few extra variables.

#include <iostream>
#include <vector>
#include <algorithm>

class Solution {
public:
    int maxDistance(std::vector<int>& nums1, std::vector<int>& nums2) {
        int max_dist = 0; // Initialize the maximum distance found so far to 0.
        int j = 0;        // Pointer for nums2, initialized to the beginning.

        // Iterate through nums1 with pointer 'i'.
        for (int i = 0; i < nums1.size(); ++i) {
            // For the current element nums1[i], find the largest index 'j' in nums2
            // such that nums1[i] <= nums2[j] and i <= j.
            // Since nums2 is non-increasing, and nums1[i] is non-increasing as 'i' increases,
            // the pointer 'j' can only move forward.
            // We advance 'j' as long as it's within bounds and the condition nums1[i] <= nums2[j] holds.
            while (j < nums2.size() && nums1[i] <= nums2[j]) {
                j++; // Move the pointer for nums2 forward.
            }

            // After the while loop, 'j' points to the first index in nums2 where
            // nums1[i] > nums2[j], or 'j' has reached the end of nums2.
            // Therefore, the largest valid index in nums2 for the current nums1[i] is 'j - 1'.
            // A pair (i, j_valid) is valid if i <= j_valid and nums1[i] <= nums2[j_valid].
            // The distance is j_valid - i.
            // We need to ensure that the valid 'j' (which is j-1) also satisfies i <= j-1.
            // This is equivalent to checking if j > i. If j <= i, it means we couldn't find a suitable j >= i.
            // If j > i, it means that j-1 is at least equal to i, so (i, j-1) is a valid pair.
            // The distance is (j - 1) - i.
            if (j > i) {
                // Update max_dist with the maximum distance found so far.
                // (j - 1) is the largest valid index in nums2 for nums1[i].
                // The distance is (j - 1) - i.
                max_dist = std::max(max_dist, (j - 1) - i);
            }
        }

        return max_dist; // Return the maximum distance found.
    }
};
```