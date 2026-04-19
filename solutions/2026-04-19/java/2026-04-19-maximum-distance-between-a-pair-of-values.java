// Problem: Maximum Distance Between a Pair of Values
// Link: https://leetcode.com/problems/maximum-distance-between-a-pair-of-values/
//
// Approach:
// We need to find the maximum difference j - i such that i <= j and nums1[i] <= nums2[j].
// Since both arrays are non-increasing, we can use a two-pointer approach.
// We iterate through nums1 with pointer `i` and through nums2 with pointer `j`.
// For each `i`, we want to find the largest `j` such that `i <= j` and `nums1[i] <= nums2[j]`.
// Because nums2 is non-increasing, if `nums1[i] <= nums2[j]`, then for any `k < j`,
// it's possible that `nums1[i] <= nums2[k]` is also true. However, we want to maximize `j-i`,
// so we should push `j` as far right as possible.
//
// We initialize `maxDistance = 0`.
// We use two pointers, `i` for `nums1` and `j` for `nums2`, both starting at 0.
// We iterate while `i` is within the bounds of `nums1` and `j` is within the bounds of `nums2`.
// Inside the loop:
// 1. If `nums1[i] <= nums2[j]`: This is a valid pair. We can potentially extend the distance by moving `j` further to the right. So, we update `maxDistance = max(maxDistance, j - i)` and increment `j`.
// 2. If `nums1[i] > nums2[j]`: This means that for the current `nums1[i]`, `nums2[j]` is too small. Since `nums2` is non-increasing, any `nums2[k]` where `k > j` will also be less than or equal to `nums2[j]`, and thus even smaller. So, `nums1[i]` cannot form a valid pair with `nums2[j]` or any element to its right. Therefore, we need to consider the next element in `nums1` to see if it can form a valid pair. We increment `i`. We also need to ensure that `j` doesn't fall behind `i` if `i` increments past `j`. If `i > j`, we reset `j = i` to maintain the `i <= j` condition for future checks.
//
// A more optimized two-pointer approach:
// We iterate `i` from 0 to `nums1.length - 1`.
// For each `i`, we want to find the largest `j` such that `j >= i` and `nums1[i] <= nums2[j]`.
// Since `nums2` is non-increasing, we can use a pointer `j` that starts from the current `i` (or `j` from the previous iteration) and moves forward as long as `nums1[i] <= nums2[j]`.
// We maintain a `j` pointer that only moves forward.
// For each `i`, we advance `j` as long as `j < nums2.length` and `nums1[i] <= nums2[j]`.
// Once we stop advancing `j` for a given `i` (either because `j` reached the end of `nums2` or `nums1[i] > nums2[j]`), we have found the largest possible `j` for the current `i` that satisfies the condition.
// If `nums1[i] <= nums2[j]` (where `j` is the current position after advancing), then `j-i` is a potential maximum distance. We update `maxDistance`.
// The key observation is that `j` never needs to decrease. If `nums1[i] <= nums2[j]`, then for `i+1`, we only need to check `nums1[i+1]` against `nums2[j]` and subsequent elements. Since `nums1[i+1] <= nums1[i]`, if `nums1[i] <= nums2[j]`, it's more likely that `nums1[i+1] <= nums2[j]` is also true.
//
// Let's refine the two-pointer strategy:
// Initialize `maxDistance = 0`.
// Initialize `j = 0`.
// Iterate `i` from `0` to `nums1.length - 1`.
//   While `j < nums2.length` AND `nums1[i] <= nums2[j]`:
//     Increment `j`.
//   After the while loop, `j` has moved past all valid indices for the current `nums1[i]`.
//   The last valid `j` that satisfied `nums1[i] <= nums2[j]` was `j-1`.
//   So, the distance is `(j-1) - i`.
//   If `j > 0` (meaning we found at least one element in `nums2` for `nums1[i]`) and `j-1 >= i` (ensuring `i <= j`), we update `maxDistance = max(maxDistance, (j - 1) - i)`.
//   The condition `j-1 >= i` is implicitly handled if `j` advances at least once past `i`. If `j` stops at `i` and `nums1[i] <= nums2[i]`, then `j` becomes `i+1`, and `(j-1) - i = i - i = 0`. If `j` stops before `i` and `nums1[i] > nums2[j]`, then `j` will not advance, and the condition `nums1[i] <= nums2[j]` will not be met, so `j` will not increment. If `j` starts at `i` and `nums1[i] > nums2[i]`, then `j` won't advance and `j-1` would be `i-1`, leading to a negative distance, so we need to ensure `j-1 >= i`.
//
// A simpler way to manage `j`:
// Initialize `maxDistance = 0`.
// Initialize `j = 0`.
// Iterate `i` from `0` to `nums1.length - 1`.
//   // For the current nums1[i], find the largest j such that nums1[i] <= nums2[j]
//   // Since nums2 is non-increasing, we can advance j as long as the condition holds.
//   // We also need to ensure that j is not less than i for a valid pair.
//   while (j < nums2.length && nums1[i] <= nums2[j]) {
//       // This pair (i, j) is valid. We can potentially get a larger distance.
//       // Since we want to maximize j-i, we should keep moving j forward.
//       // The current distance is j - i.
//       maxDistance = Math.max(maxDistance, j - i);
//       j++; // Try to find an even larger j for the current i
//   }
//   // If j reaches the end of nums2, we can't find any more valid j for this i or subsequent i's (unless nums2[j] was equal to nums1[i]).
//   // If nums1[i] > nums2[j] for the current j, it means this j and any subsequent j's (which are smaller or equal) are not valid for nums1[i].
//   // So, for the next iteration of i, we start searching from the current j.
//   // If the while loop condition `nums1[i] <= nums2[j]` was never met for the current `i` starting from the previous `j`,
//   // then `j` didn't advance, and the distance `j-i` would be calculated with the old `j`.
//   // The crucial part is that `j` is only advanced.
//   // If the while loop finishes because `j == nums2.length`, it means for the current `i`, all valid `j`'s up to `nums2.length - 1` were considered.
//   // The `maxDistance` would have been updated correctly.
//   // If the while loop finishes because `nums1[i] > nums2[j]`, it means `nums2[j]` and all subsequent elements are too small for `nums1[i]`.
//   // So, for the next `i`, we continue searching from this `j`.
//   // What if `j` becomes less than `i`?
//   // The problem states `i <= j`.
//   // If `nums1[i] > nums2[j]` and `i` becomes greater than `j`, it implies we need to advance `i`.
//   // When `i` advances, `j` should ideally not decrease.
//   // Let's re-evaluate the loop condition:
//   // Iterate `i` from `0` to `nums1.length - 1`.
//   //   We need to find the largest `j` such that `j >= i` and `nums1[i] <= nums2[j]`.
//   //   The pointer `j` should only move forward.
//   //   Let's maintain `j` such that it always points to a potentially valid index for the current `i`.
//   //   Initialize `maxDistance = 0`.
//   //   Initialize `j = 0`.
//   //   For `i` from `0` to `nums1.length - 1`:
//   //     // For the current `i`, advance `j` as much as possible while maintaining `nums1[i] <= nums2[j]`.
//   //     // We also need to ensure that `j >= i`. However, `j` will naturally stay ahead of `i` or catch up if `nums1[i]` is small enough.
//   //     // The condition `j < nums2.length` is essential.
//   //     while (j < nums2.length && nums1[i] <= nums2[j]) {
//   //       // If `i <= j` and `nums1[i] <= nums2[j]`, it's a valid pair.
//   //       // We want to maximize `j - i`.
//   //       // The current `j` is a candidate for the maximum `j` for the current `i`.
//   //       // So, update the max distance.
//   //       maxDistance = Math.max(maxDistance, j - i);
//   //       // Try to advance `j` to find an even larger `j` for the same `i`.
//   //       j++;
//   //     }
//   //     // If `j` becomes `nums2.length`, it means no more `j` values can be checked for current `i` or future `i`'s.
//   //     // If the loop terminates because `nums1[i] > nums2[j]`, it means `nums2[j]` is too small for `nums1[i]`.
//   //     // Since `nums2` is non-increasing, any `nums2[k]` with `k > j` will also be too small.
//   //     // So, for the next `i`, we should continue searching from the current `j`.
//   //     // The crucial insight is that `j` never needs to reset.
//   //
//   // Consider the case where `i` is large but `j` is still small.
//   // Example: nums1 = [10, 5], nums2 = [20, 15, 10]
//   // i = 0, nums1[0] = 10
//   //   j = 0, nums2[0] = 20. 10 <= 20. maxDistance = max(0, 0-0) = 0. j becomes 1.
//   //   j = 1, nums2[1] = 15. 10 <= 15. maxDistance = max(0, 1-0) = 1. j becomes 2.
//   //   j = 2, nums2[2] = 10. 10 <= 10. maxDistance = max(1, 2-0) = 2. j becomes 3.
//   //   j = 3. Loop ends.
//   // i = 1, nums1[1] = 5
//   //   j = 3. Loop condition `j < nums2.length` is false.
//   // Final maxDistance = 2. Correct.
//
//   // Example: nums1 = [55,30,5,4,2], nums2 = [100,20,10,10,5]
//   // i = 0, nums1[0] = 55
//   //   j = 0, nums2[0] = 100. 55 <= 100. maxDist = max(0, 0-0) = 0. j = 1.
//   //   j = 1, nums2[1] = 20. 55 > 20. Loop ends.
//   // i = 1, nums1[1] = 30
//   //   j = 1, nums2[1] = 20. 30 > 20. Loop ends.
//   // i = 2, nums1[2] = 5
//   //   j = 1, nums2[1] = 20. 5 <= 20. maxDist = max(0, 1-2) -> this is wrong. j-i must be non-negative.
//   //   The problem requires `i <= j`. The check `nums1[i] <= nums2[j]` implies a valid pair.
//   //   If `nums1[i] <= nums2[j]` is true, then `j-i` is a candidate for the maximum distance, provided `i <= j`.
//   //   The condition `i <= j` must be implicitly handled.
//   //   The `while` loop structure ensures `j` is always greater than or equal to the `i` at the start of the `while` loop if `nums1[i] <= nums2[j]` is met.
//   //   Let's trace again:
//   //   Initialize `maxDistance = 0`.
//   //   Initialize `j = 0`.
//   //   For `i` from `0` to `nums1.length - 1`:
//   //     While `j < nums2.length` AND `nums1[i] <= nums2[j]`:
//   //       // At this point, we know `i <= j` is implicitly satisfied because
//   //       // `j` starts at 0 and only moves forward. If `i` were to exceed `j`,
//   //       // then `nums1[i] > nums2[j]` would likely be true (since nums1 is non-increasing too),
//   //       // and `j` wouldn't advance.
//   //       // The key is that if `nums1[i] <= nums2[j]`, this is a valid pair candidate, and we can update distance.
//   //       maxDistance = Math.max(maxDistance, j - i); // `j - i` is guaranteed non-negative IF this condition `nums1[i] <= nums2[j]` is met with `i <= j`.
//   //       j++;
//   //
//   //   Example: nums1 = [55,30,5,4,2], nums2 = [100,20,10,10,5]
//   //   i = 0, nums1[0] = 55
//   //     j = 0, nums2[0] = 100. 55 <= 100. maxDist = max(0, 0-0) = 0. j = 1.
//   //     j = 1, nums2[1] = 20. 55 > 20. Loop breaks.
//   //   i = 1, nums1[1] = 30
//   //     j = 1, nums2[1] = 20. 30 > 20. Loop breaks.
//   //   i = 2, nums1[2] = 5
//   //     j = 1, nums2[1] = 20. 5 <= 20. maxDist = max(0, 1-2) -> Still wrong. `j-i` can be negative if `i` advanced past `j`.
//   //     The condition `i <= j` is critical and must be checked or implicitly maintained.
//
//   // Revised Two-Pointer Approach:
//   // Initialize `maxDistance = 0`.
//   // Initialize `j = 0`.
//   // Iterate `i` from `0` to `nums1.length - 1`.
//   //   // For the current `nums1[i]`, we want to find the largest `j` such that `i <= j` and `nums1[i] <= nums2[j]`.
//   //   // The pointer `j` only moves forward.
//   //   // We need to ensure that `j` starts from at least `i` to satisfy `i <= j`.
//   //   // So, let `j` always be at least `i`.
//   //   // Let's try `j` starting from `i` each time, but this defeats the purpose of optimization.
//   //
//   //   // Correct logic: `j` is a pointer that scans `nums2`.
//   //   // For each `i`, we are looking for the farthest `j` such that `i <= j` and `nums1[i] <= nums2[j]`.
//   //   // Since `nums1` is non-increasing, as `i` increases, `nums1[i]` decreases or stays the same.
//   //   // This means if `nums1[i] <= nums2[j]`, then for `i+1`, `nums1[i+1] <= nums2[j]` is more likely.
//   //   // Thus, `j` can only move forward.
//   //
//   //   Initialize `maxDistance = 0`.
//   //   Initialize `j = 0`.
//   //   For `i` from `0` to `nums1.length - 1`:
//   //     // For the current `nums1[i]`, advance `j` as long as it's valid.
//   //     // The condition `j < nums2.length` ensures we don't go out of bounds.
//   //     // The condition `nums1[i] <= nums2[j]` checks if the values are compatible.
//   //     // The condition `i <= j` is implicitly handled by how `j` advances relative to `i`.
//   //     // If `i` advances and becomes greater than `j`, it means `nums1[i]` would be too large for `nums2[j]`.
//   //     // The `while` loop ensures that if `nums1[i] <= nums2[j]`, then `j-i` is a valid distance candidate.
//   //     // So, `j` must always be greater than or equal to `i` when `maxDistance` is updated, for `j-i` to be a valid distance.
//   //
//   //     // Let's restart the thought process with the exact constraint: `i <= j`.
//   //     // Initialize `maxDistance = 0`.
//   //     // Initialize `j = 0`.
//   //     // Iterate `i` from `0` to `nums1.length - 1`.
//   //     //   We need to find the largest `j` such that `j >= i` and `nums1[i] <= nums2[j]`.
//   //     //   Since `nums2` is non-increasing, we can use `j` as a pointer that advances.
//   //     //   For the current `i`, we need to find the *first* `j` (from its current position) such that `nums1[i] <= nums2[j]`.
//   //     //   Once we find such a `j`, we know that for this `i`, any `k` from `j` up to `nums2.length - 1` will satisfy `nums1[i] <= nums2[k]` (if `nums2[k] >= nums1[i]`).
//   //     //   We want the *largest* such `j`.
//   //     //   So, for a fixed `i`, we iterate `j` from `i` (or from its previous position) until `nums1[i] > nums2[j]`.
//   //     //   The largest `j` found before the condition `nums1[i] > nums2[j]` was met is the best `j` for this `i`.
//   //
//   //     // Correct Two-Pointer Approach:
//   //     // `i` iterates through `nums1`. `j` iterates through `nums2`.
//   //     // `j` only moves forward.
//   //     // For each `i`, we want to find the largest `j` such that `i <= j` and `nums1[i] <= nums2[j]`.
//   //     // Initialize `maxDistance = 0`.
//   //     // Initialize `j = 0`.
//   //     // For `i` from `0` to `nums1.length - 1`:
//   //     //   // Advance `j` as long as `j` is within bounds and `nums1[i] <= nums2[j]`.
//   //     //   // The condition `i <= j` is implicitly handled. If `i` were to surpass `j`, it means `nums1[i]` must be greater than `nums2[j]` (since `nums1` is non-increasing and `nums2` is non-increasing).
//   //     //   // So, if `nums1[i] <= nums2[j]`, then `j` must be >= `i` (or `i` is small enough that `j` hasn't caught up but is still valid).
//   //     //   while (j < nums2.length && nums1[i] <= nums2[j]) {
//   //     //     // This pair (i, j) is valid because i <= j and nums1[i] <= nums2[j].
//   //     //     // The distance is j - i. We update maxDistance.
//   //     //     maxDistance = Math.max(maxDistance, j - i);
//   //     //     // Try to extend the distance by moving j further.
//   //     //     j++;
//   //     //   }
//   //     //   // If j reached the end, or if nums1[i] > nums2[j], then for this i, we can't find a better j.
//   //     //   // For the next i, we start checking from the current j. This is because nums1[i+1] <= nums1[i],
//   //     //   // so if nums1[i] was already too large for nums2[j], then nums1[i+1] might be smaller and compatible with nums2[j].
//   //     //   // The crucial part is that j never decrements.
//   //
//   //   // Example: nums1 = [55,30,5,4,2], nums2 = [100,20,10,10,5]
//   //   // i = 0, nums1[0] = 55
//   //   //   j = 0, nums2[0] = 100. 55 <= 100. maxDist = max(0, 0-0) = 0. j = 1.
//   //   //   j = 1, nums2[1] = 20. 55 > 20. Loop ends.
//   //   // i = 1, nums1[1] = 30
//   //   //   j = 1, nums2[1] = 20. 30 > 20. Loop ends.
//   //   // i = 2, nums1[2] = 5
//   //   //   j = 1, nums2[1] = 20. 5 <= 20. maxDist = max(0, 1-2) -> STILL WRONG. The condition `j-i` for distance implies `j >= i`.
//   //   //   This is the point where `i <= j` constraint is tricky.
//   //   //   The initial `j` for a given `i` should be at least `i`.
//   //
//   //   // FINAL REVISED APPROACH:
//   //   // Use two pointers, `i` for `nums1` and `j` for `nums2`.
//   //   // Initialize `maxDistance = 0`.
//   //   // Initialize `j = 0`.
//   //   // Iterate `i` from `0` to `nums1.length - 1`.
//   //   //   For the current `nums1[i]`, we need to find the largest `j` such that `i <= j` and `nums1[i] <= nums2[j]`.
//   //   //   We advance `j` as long as `j < nums2.length` AND `nums1[i] <= nums2[j]`.
//   //   //   The crucial part is that `j` must always be at least `i` for `j-i` to be a valid distance.
//   //   //   If `j` ever falls behind `i`, we should advance `j` to `i`.
//   //   //   However, since both arrays are non-increasing, if `nums1[i] <= nums2[j]`, and `j` only moves forward, it means `j` will naturally keep up or stay ahead of `i`.
//   //   //   If `i` is such that `nums1[i]` is too large for `nums2[j]` (where `j >= i`), then `j` will not advance.
//   //   //   Let's try again with the basic two-pointer:
//   //
//   //   // Initialize `maxDistance = 0`.
//   //   // Initialize `j = 0`.
//   //   // For `i` from `0` to `nums1.length - 1`:
//   //   //   While `j < nums2.length` AND `nums1[i] <= nums2[j]`:
//   //   //     // This condition `nums1[i] <= nums2[j]` implies a potential valid pair.
//   //   //     // The condition `i <= j` must hold for a valid pair.
//   //   //     // Since `j` starts at 0 and only increments, and `i` also starts at 0 and increments,
//   //   //     // if `nums1[i] <= nums2[j]`, it implies that `j` has advanced at least to `i` or `i` is small enough.
//   //   //     // If `i` were to be greater than `j`, it would mean `nums1[i]` is likely larger than `nums2[j]` (due to non-increasing nature),
//   //   //     // and the `while` loop condition `nums1[i] <= nums2[j]` would be false, preventing `j` from advancing.
//   //   //     // Therefore, if `nums1[i] <= nums2[j]` is true inside this while loop, then `i <= j` is implicitly satisfied.
//   //   //     maxDistance = Math.max(maxDistance, j - i);
//   //   //     j++;
//   //   //
//   //   // Let's dry run Example 1 again with this logic carefully:
//   //   // nums1 = [55,30,5,4,2], nums2 = [100,20,10,10,5]
//   //   // maxDistance = 0, j = 0
//   //
//   //   // i = 0, nums1[0] = 55
//   //   //   j = 0, nums2[0] = 100. (0 < 5) && (55 <= 100) is TRUE.
//   //   //     maxDistance = Math.max(0, 0 - 0) = 0.
//   //   //     j becomes 1.
//   //   //   j = 1, nums2[1] = 20. (1 < 5) && (55 <= 20) is FALSE. While loop terminates.
//   //
//   //   // i = 1, nums1[1] = 30
//   //   //   j = 1, nums2[1] = 20. (1 < 5) && (30 <= 20) is FALSE. While loop terminates.
//   //
//   //   // i = 2, nums1[2] = 5
//   //   //   j = 1, nums2[1] = 20. (1 < 5) && (5 <= 20) is TRUE.
//   //   //     maxDistance = Math.max(0, 1 - 2) -> This calculation is still the issue. `j-i` can be negative if `i` becomes larger than `j`.
//   //   //     The constraint `i <= j` must be respected.
//   //   //     The `maxDistance = Math.max(maxDistance, j - i)` should only happen IF `i <= j`.
//   //   //
//   //   //   Let's be explicit about `i <= j`.
//   //   //   The most straightforward way is to ensure `j` starts from at least `i` OR `j` never falls behind `i`.
//   //   //   If `j` falls behind `i`, we must advance `j` to `i`.
//   //
//   //   // FINAL FINAL REVISED APPROACH (The correct two-pointer logic):
//   //   // Initialize `maxDistance = 0`.
//   //   // Initialize `j = 0`.
//   //   // Iterate `i` from `0` to `nums1.length - 1`.
//   //   //   // Ensure `j` is always at least `i`. If `j` is behind `i`, advance `j` to `i`.
//   //   //   // This guarantees the `i <= j` condition for any pair considered.
//   //   //   j = Math.max(j, i);
//   //   //
//   //   //   // Now, for the current `nums1[i]`, find the largest `j` such that `nums1[i] <= nums2[j]`.
//   //   //   // Since `nums2` is non-increasing, `j` only needs to move forward.
//   //   //   while (j < nums2.length && nums1[i] <= nums2[j]) {
//   //   //     // We have a valid pair (i, j) because `i <= j` (maintained by `j = Math.max(j, i)`)
//   //   //     // and `nums1[i] <= nums2[j]`.
//   //   //     // The distance is `j - i`. Update `maxDistance`.
//   //   //     maxDistance = Math.max(maxDistance, j - i);
//   //   //     // Try to find a larger `j` for the current `i` by advancing `j`.
//   //   //     j++;
//   //   //   }
//   //   //   // After the while loop, `j` is either at the end of `nums2` or `nums1[i] > nums2[j]`.
//   //   //   // For the next `i`, `j` will be correctly positioned to start searching.
//   //
//   //   // Example 1 again: nums1 = [55,30,5,4,2], nums2 = [100,20,10,10,5]
//   //   // maxDistance = 0, j = 0
//   //
//   //   // i = 0, nums1[0] = 55
//   //   //   j = Math.max(0, 0) = 0.
//   //   //   While loop:
//   //   //     j = 0, nums2[0] = 100. (0 < 5) && (55 <= 100) is TRUE.
//   //   //       maxDistance = Math.max(0, 0 - 0) = 0.
//   //   //       j becomes 1.
//   //   //     j = 1, nums2[1] = 20. (1 < 5) && (55 <= 20) is FALSE. While loop terminates.
//   //
//   //   // i = 1, nums1[1] = 30
//   //   //   j = Math.max(1, 1) = 1. (Crucially, `j` is updated to be at least `i`).
//   //   //   While loop:
//   //   //     j = 1, nums2[1] = 20. (1 < 5) && (30 <= 20) is FALSE. While loop terminates.
//   //
//   //   // i = 2, nums1[2] = 5
//   //   //   j = Math.max(1, 2) = 2. (j was 1, now updated to 2 because i=2).
//   //   //   While loop:
//   //   //     j = 2, nums2[2] = 10. (2 < 5) && (5 <= 10) is TRUE.
//   //   //       maxDistance = Math.max(0, 2 - 2) = 0.
//   //   //       j becomes 3.
//   //   //     j = 3, nums2[3] = 10. (3 < 5) && (5 <= 10) is TRUE.
//   //   //       maxDistance = Math.max(0, 3 - 2) = 1.
//   //   //       j becomes 4.
//   //   //     j = 4, nums2[4] = 5. (4 < 5) && (5 <= 5) is TRUE.
//   //   //       maxDistance = Math.max(1, 4 - 2) = 2.
//   //   //       j becomes 5.
//   //   //     j = 5. (5 < 5) is FALSE. While loop terminates.
//   //
//   //   // i = 3, nums1[3] = 4
//   //   //   j = Math.max(5, 3) = 5. (j was 5, remains 5).
//   //   //   While loop:
//   //   //     j = 5. (5 < 5) is FALSE. While loop terminates.
//   //
//   //   // i = 4, nums1[4] = 2
//   //   //   j = Math.max(5, 4) = 5. (j was 5, remains 5).
//   //   //   While loop:
//   //   //     j = 5. (5 < 5) is FALSE. While loop terminates.
//   //
//   //   // Loop for `i` finishes. Return `maxDistance = 2`. This matches Example 1.
//   //
//   //   // Example 2: nums1 = [2,2,2], nums2 = [10,10,1]
//   //   // maxDistance = 0, j = 0
//   //
//   //   // i = 0, nums1[0] = 2
//   //   //   j = Math.max(0, 0) = 0.
//   //   //   While loop:
//   //   //     j = 0, nums2[0] = 10. (0 < 3) && (2 <= 10) is TRUE.
//   //   //       maxDistance = Math.max(0, 0 - 0) = 0.
//   //   //       j becomes 1.
//   //   //     j = 1, nums2[1] = 10. (1 < 3) && (2 <= 10) is TRUE.
//   //   //       maxDistance = Math.max(0, 1 - 0) = 1.
//   //   //       j becomes 2.
//   //   //     j = 2, nums2[2] = 1. (2 < 3) && (2 <= 1) is FALSE. While loop terminates.
//   //
//   //   // i = 1, nums1[1] = 2
//   //   //   j = Math.max(2, 1) = 2. (j was 2, remains 2).
//   //   //   While loop:
//   //   //     j = 2, nums2[2] = 1. (2 < 3) && (2 <= 1) is FALSE. While loop terminates.
//   //
//   //   // i = 2, nums1[2] = 2
//   //   //   j = Math.max(2, 2) = 2. (j was 2, remains 2).
//   //   //   While loop:
//   //   //     j = 2, nums2[2] = 1. (2 < 3) && (2 <= 1) is FALSE. While loop terminates.
//   //
//   //   // Loop for `i` finishes. Return `maxDistance = 1`. This matches Example 2.
//   //
//   //   // Example 3: nums1 = [30,29,19,5], nums2 = [25,25,25,25,25]
//   //   // maxDistance = 0, j = 0
//   //
//   //   // i = 0, nums1[0] = 30
//   //   //   j = Math.max(0, 0) = 0.
//   //   //   While loop:
//   //   //     j = 0, nums2[0] = 25. (0 < 5) && (30 <= 25) is FALSE. While loop terminates.
//   //
//   //   // i = 1, nums1[1] = 29
//   //   //   j = Math.max(0, 1) = 1. (j was 0, now becomes 1).
//   //   //   While loop:
//   //   //     j = 1, nums2[1] = 25. (1 < 5) && (29 <= 25) is FALSE. While loop terminates.
//   //
//   //   // i = 2, nums1[2] = 19
//   //   //   j = Math.max(1, 2) = 2. (j was 1, now becomes 2).
//   //   //   While loop:
//   //   //     j = 2, nums2[2] = 25. (2 < 5) && (19 <= 25) is TRUE.
//   //   //       maxDistance = Math.max(0, 2 - 2) = 0.
//   //   //       j becomes 3.
//   //   //     j = 3, nums2[3] = 25. (3 < 5) && (19 <= 25) is TRUE.
//   //   //       maxDistance = Math.max(0, 3 - 2) = 1.
//   //   //       j becomes 4.
//   //   //     j = 4, nums2[4] = 25. (4 < 5) && (19 <= 25) is TRUE.
//   //   //       maxDistance = Math.max(1, 4 - 2) = 2.
//   //   //       j becomes 5.
//   //   //     j = 5. (5 < 5) is FALSE. While loop terminates.
//   //
//   //   // i = 3, nums1[3] = 5
//   //   //   j = Math.max(5, 3) = 5. (j was 5, remains 5).
//   //   //   While loop:
//   //   //     j = 5. (5 < 5) is FALSE. While loop terminates.
//   //
//   //   // Loop for `i` finishes. Return `maxDistance = 2`. This matches Example 3.
//
// Time Complexity:
// The outer loop iterates `i` from `0` to `nums1.length - 1`.
// The inner `while` loop iterates `j` from its current position.
// Crucially, `j` never resets and only moves forward. In the worst case, `j` traverses `nums2` once.
// Therefore, the total number of operations for both pointers is proportional to `nums1.length + nums2.length`.
// Time Complexity: O(m + n), where m is the length of nums1 and n is the length of nums2.
//
// Space Complexity:
// We are only using a few extra variables (`i`, `j`, `maxDistance`).
// Space Complexity: O(1).
class Solution {
    public int maxDistance(int[] nums1, int[] nums2) {
        // Initialize maxDistance to 0, as per the problem statement if no valid pairs exist.
        int maxDistance = 0;
        // Initialize pointer j for nums2. j will only move forward.
        int j = 0;
        // Iterate through nums1 with pointer i.
        for (int i = 0; i < nums1.length; i++) {
            // Ensure that the pointer j is always at least equal to i.
            // This is to satisfy the condition `i <= j` for a valid pair.
            // Since both arrays are non-increasing, if `nums1[i] <= nums2[j]` is true,
            // and `j` has been advanced from previous iterations, `j` will naturally stay ahead or catch up.
            // However, if `i` advances and `j` has not kept pace (e.g., `nums1[i]` was too large in previous steps
            // for `nums2[j]` to advance), then `j` might be less than `i`.
            // By setting `j = Math.max(j, i)`, we ensure that we only consider pairs where `i <= j`.
            j = Math.max(j, i);

            // For the current element nums1[i], find the largest index j in nums2
            // such that nums1[i] <= nums2[j].
            // We advance j as long as it's within bounds and the condition nums1[i] <= nums2[j] holds.
            // Because nums2 is non-increasing, if nums1[i] <= nums2[j], it will also be less than or equal to
            // any nums2[k] where k < j, but we are looking for the largest j for the current i.
            while (j < nums2.length && nums1[i] <= nums2[j]) {
                // If we are in this loop, it means we have found a valid pair (i, j) because:
                // 1. `i <= j` is guaranteed by `j = Math.max(j, i)` at the start of the outer loop iteration.
                // 2. `nums1[i] <= nums2[j]` is the condition of the while loop.
                // So, the distance `j - i` is a candidate for the maximum distance.
                maxDistance = Math.max(maxDistance, j - i);

                // Try to find an even larger j for the current i by moving j forward.
                // This is because a larger j would result in a larger distance `j - i`.
                j++;
            }
            // If the while loop terminates, it's either because j reached the end of nums2,
            // or because nums1[i] > nums2[j]. In either case, for the current i,
            // we have found the maximum possible j that satisfies the condition.
            // For the next iteration of i (i+1), nums1[i+1] <= nums1[i].
            // This means that the current value of j (where the loop broke) is still a good starting point
            // for checking nums1[i+1]. `j` never needs to reset.
        }
        // Return the maximum distance found. If no valid pairs were found, maxDistance remains 0.
        return maxDistance;
    }
}
