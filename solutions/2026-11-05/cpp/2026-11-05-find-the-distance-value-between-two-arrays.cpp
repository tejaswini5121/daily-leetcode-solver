// Problem: Find the Distance Value Between Two Arrays
// Link: https://leetcode.com/problems/find-the-distance-value-between-two-arrays/
//
// Approach:
// For each element in arr1, we need to check if there exists any element in arr2
// such that the absolute difference is less than or equal to d.
// To efficiently check this for each element in arr1, we can sort arr2.
// Once arr2 is sorted, for a given arr1[i], we can use binary search (specifically,
// `std::lower_bound`) to find the first element in arr2 that is greater than or equal to
// arr1[i] - d.
// If such an element exists and is within the range [arr1[i] - d, arr1[i] + d],
// then arr1[i] does not contribute to the distance value.
//
// The check involves looking at the element found by `lower_bound` and the element
// before it (if it exists).
//
// Specifically, for each `num1` in `arr1`:
// 1. Find the first element `it` in sorted `arr2` such that `*it >= num1 - d`.
// 2. If `it` is not the end of `arr2` and `*it <= num1 + d`, then `num1` is "too close"
//    to an element in `arr2`. This `num1` does NOT contribute to the distance.
// 3. If `it` is the beginning of `arr2` or the element before `it` (`*(it-1)`)
//    is also greater than `num1 + d`, AND the element at `it` (if `it` is not `arr2.end()`)
//    is greater than `num1 + d`, then `num1` is at a sufficient distance.
//    This `num1` CONTRIBUTES to the distance.
//
// A simpler way to check condition 2 and 3:
// For each `num1` in `arr1`:
// Iterate through `arr2`. If `abs(num1 - num2) <= d` for any `num2`, then `num1`
// does not count. If the loop finishes without finding such `num2`, then `num1` counts.
//
// Using sorted arr2 and binary search:
// For each `num1` in `arr1`:
//    We are looking for any `num2` in `arr2` such that `num1 - d <= num2 <= num1 + d`.
//    This is equivalent to checking if `arr2` contains any element in the range `[num1 - d, num1 + d]`.
//    We can use `std::lower_bound` to find the first element `it` in `arr2` that is `>= num1 - d`.
//    If `it` points to `arr2.end()`, it means all elements in `arr2` are less than `num1 - d`, so `num1` is valid.
//    If `*it > num1 + d`, it means all elements from `it` onwards are greater than `num1 + d`.
//    We also need to check the element *before* `it`. If `it` is not `arr2.begin()` and `*(it-1)` is also greater than `num1 + d`, then `num1` is valid.
//
//    The condition simplifies:
//    For each `num1` in `arr1`:
//        Let `target_min = num1 - d` and `target_max = num1 + d`.
//        Find `it = lower_bound(arr2.begin(), arr2.end(), target_min)`.
//        If `it == arr2.end()`: All elements in `arr2` are less than `target_min`. `num1` is valid.
//        Else if `*it > target_max`: The first element >= `target_min` is already > `target_max`.
//            We also need to consider the element *before* `it`. If `it != arr2.begin()` and `*(it-1) > target_max`, then `num1` is valid.
//            If `it != arr2.begin()` and `*(it-1)` is less than or equal to `target_max`, then `num1` is invalid.
//            If `it == arr2.begin()` and `*it > target_max`, then `num1` is valid.
//
//    This logic is a bit complex to implement correctly.
//    A more straightforward check using binary search:
//    For each `num1` in `arr1`:
//        We want to know if there is ANY `num2` in `arr2` such that `abs(num1 - num2) <= d`.
//        This means `num1 - d <= num2 <= num1 + d`.
//        Let's find the *closest* element to `num1` in `arr2`.
//        We can find the first element `>= num1` using `lower_bound`.
//        Let this be `it_ge`.
//        If `it_ge != arr2.end()` and `abs(num1 - *it_ge) <= d`, then `num1` is invalid.
//        If `it_ge != arr2.begin()`, consider the element before it, `it_lt = prev(it_ge)`.
//        If `abs(num1 - *it_lt) <= d`, then `num1` is invalid.
//        If neither of these conditions is met, `num1` is valid.
//
// Time Complexity:
// Sorting arr2: O(N2 * log(N2)), where N2 is the length of arr2.
// For each element in arr1 (N1 elements), performing binary search on arr2: O(log(N2)).
// Total time complexity: O(N2 * log(N2) + N1 * log(N2)).
// Given constraints N1, N2 <= 500, this is efficient.
//
// Space Complexity:
// O(log(N2)) or O(N2) depending on the sort implementation.
// If sorting is in-place, it's O(log(N2)) for recursion stack or O(1) for iterative.
// If a copy is made, it's O(N2). std::sort in C++ typically uses Introsort, which has O(log N) space complexity for recursion.
//
// Optimized approach using sorting and two pointers:
// Sort both arr1 and arr2.
// Use two pointers, one for arr1 (i) and one for arr2 (j).
// Iterate through arr1. For each arr1[i]:
//   Advance j as long as arr2[j] < arr1[i] - d.
//   Check if arr2[j] <= arr1[i] + d. If it is, then arr1[i] has a "close" element in arr2.
//   If arr1[i] does not have a close element, increment the distance count.
// This approach is also valid and has a similar time complexity after sorting.
//
// The binary search approach seems more direct to implement based on the problem statement.
// Let's stick to the binary search on sorted `arr2`.
//
// Example Walkthrough:
// arr1 = [4,5,8], arr2 = [10,9,1,8], d = 2
// Sorted arr2 = [1, 8, 9, 10]
//
// For arr1[0] = 4:
//   target_min = 4 - 2 = 2
//   target_max = 4 + 2 = 6
//   lower_bound for 2 in [1, 8, 9, 10] points to 8. `it` points to 8.
//   `it` is not end. `*it` is 8.
//   Is `*it <= target_max`? 8 <= 6 is false.
//   Now check element before `it`. `it` points to 8. `prev(it)` points to 1.
//   Is `prev(it)` not begin? No, it is not begin.
//   Is `*(prev(it))` > `target_max`? 1 > 6 is false.
//   This logic is still tricky. Let's refine.
//
// A simpler check:
// For each `num1` in `arr1`:
//    Assume `num1` is valid (distance_value++).
//    Iterate through `arr2`. If `abs(num1 - num2) <= d` for any `num2`, then `num1` is NOT valid, break inner loop.
//    This is O(N1 * N2) which is too slow if N1, N2 are large.
//
// Revised Binary Search approach:
// Sort arr2.
// For each `num1` in `arr1`:
//    Find the first element in arr2 that is `>= num1 - d`. Let's call this `lower_bound_val`.
//    Find the first element in arr2 that is `> num1 + d`. Let's call this `upper_bound_val`.
//    If `lower_bound_val` exists and is `<= num1 + d`, then there's an element in the "forbidden zone".
//    More precisely, `lower_bound(arr2.begin(), arr2.end(), num1 - d)` gives an iterator `it_low`.
//    If `it_low != arr2.end()` and `*it_low <= num1 + d`, it means there is an element `*it_low` in `arr2`
//    such that `num1 - d <= *it_low <= num1 + d`. This `num1` is NOT valid.
//
// Let's try again with the conditions:
// For `num1` in `arr1`:
//    Does there exist `num2` in `arr2` such that `|num1 - num2| <= d`?
//    This is equivalent to: Does there exist `num2` in `arr2` such that `num1 - d <= num2 <= num1 + d`?
//
//    Sort `arr2`.
//    For each `num1` in `arr1`:
//        Let `lower_bound_target = num1 - d`.
//        Let `upper_bound_target = num1 + d`.
//
//        Use `std::lower_bound` to find `it = std::lower_bound(arr2.begin(), arr2.end(), lower_bound_target)`.
//
//        Now, `it` points to the first element in `arr2` which is greater than or equal to `lower_bound_target`.
//        We need to check two conditions:
//        1. If `it` is not `arr2.end()` AND `*it <= upper_bound_target`:
//           This means we found an element `*it` in `arr2` such that `num1 - d <= *it <= num1 + d`.
//           So `num1` is NOT valid.
//        2. If `it` is `arr2.begin()` OR `*(it-1) > upper_bound_target`:
//           This part is still confusing.
//
// The condition is simply: is there ANY element `num2` in `arr2` such that `num1 - d <= num2 <= num1 + d`?
//
// For `num1` in `arr1`:
//    If `num1` is valid, increment count.
//    A `num1` is valid IF AND ONLY IF for ALL `num2` in `arr2`, `|num1 - num2| > d`.
//    This means for ALL `num2` in `arr2`, `num2 < num1 - d` OR `num2 > num1 + d`.
//
//    Let's use `std::binary_search` (or `lower_bound` / `upper_bound`) to check for existence.
//
//    Sort `arr2`.
//    For `num1` in `arr1`:
//        Initialize `is_valid = true`.
//        Find `it = std::lower_bound(arr2.begin(), arr2.end(), num1 - d)`.
//        If `it != arr2.end()` and `*it <= num1 + d`:
//            // This means there's an element in arr2 that is in the range [num1-d, num1+d]
//            `is_valid = false`.
//
//        If `is_valid` is still true, increment `distance_value`.
//
// Let's test this simpler logic with Example 1:
// arr1 = [4,5,8], arr2 = [10,9,1,8], d = 2
// Sorted arr2 = [1, 8, 9, 10]
//
// For arr1[0] = 4:
//   num1 = 4, d = 2
//   num1 - d = 2, num1 + d = 6
//   lower_bound for 2 in [1, 8, 9, 10] points to 8. `it` points to 8.
//   `it` is not end. `*it` is 8.
//   Is `*it <= num1 + d`? 8 <= 6 is false.
//   So, `is_valid` remains true. distance_value = 1.
//
// For arr1[1] = 5:
//   num1 = 5, d = 2
//   num1 - d = 3, num1 + d = 7
//   lower_bound for 3 in [1, 8, 9, 10] points to 8. `it` points to 8.
//   `it` is not end. `*it` is 8.
//   Is `*it <= num1 + d`? 8 <= 7 is false.
//   So, `is_valid` remains true. distance_value = 2.
//
// For arr1[2] = 8:
//   num1 = 8, d = 2
//   num1 - d = 6, num1 + d = 10
//   lower_bound for 6 in [1, 8, 9, 10] points to 8. `it` points to 8.
//   `it` is not end. `*it` is 8.
//   Is `*it <= num1 + d`? 8 <= 10 is true.
//   So, `is_valid` becomes false.
//   `distance_value` remains 2.
//
// Final answer = 2. This matches Example 1.
//
// Let's test with Example 2:
// arr1 = [1,4,2,3], arr2 = [-4,-3,6,10,20,30], d = 3
// Sorted arr2 = [-4, -3, 6, 10, 20, 30]
//
// For arr1[0] = 1:
//   num1 = 1, d = 3
//   num1 - d = -2, num1 + d = 4
//   lower_bound for -2 in arr2 points to -3. `it` points to -3.
//   `it` is not end. `*it` is -3.
//   Is `*it <= num1 + d`? -3 <= 4 is true.
//   `is_valid` becomes false. distance_value = 0.
//
// For arr1[1] = 4:
//   num1 = 4, d = 3
//   num1 - d = 1, num1 + d = 7
//   lower_bound for 1 in arr2 points to 6. `it` points to 6.
//   `it` is not end. `*it` is 6.
//   Is `*it <= num1 + d`? 6 <= 7 is true.
//   `is_valid` becomes false. distance_value = 0.
//
// For arr1[2] = 2:
//   num1 = 2, d = 3
//   num1 - d = -1, num1 + d = 5
//   lower_bound for -1 in arr2 points to -3. `it` points to -3.
//   `it` is not end. `*it` is -3.
//   Is `*it <= num1 + d`? -3 <= 5 is true.
//   `is_valid` becomes false. distance_value = 0.
//
// For arr1[3] = 3:
//   num1 = 3, d = 3
//   num1 - d = 0, num1 + d = 6
//   lower_bound for 0 in arr2 points to 6. `it` points to 6.
//   `it` is not end. `*it` is 6.
//   Is `*it <= num1 + d`? 6 <= 6 is true.
//   `is_valid` becomes false. distance_value = 0.
//
// Wait, the example output is 2. My logic seems to be inverted or missing something.
// The condition `*it <= num1 + d` is checking if the first element >= `num1-d` is still within the forbidden range `num1+d`.
// This correctly identifies if *any* element exists in `[num1-d, num1+d]`.
//
// The logic is:
// If `lower_bound` finds an element AND that element is `<= num1 + d`, it means there's a `num2` in `arr2`
// such that `num1 - d <= num2 <= num1 + d`. This `num1` should NOT be counted.
//
// Let's re-examine Example 2 with this understanding:
// arr1 = [1,4,2,3], arr2 = [-4,-3,6,10,20,30], d = 3
// Sorted arr2 = [-4, -3, 6, 10, 20, 30]
//
// For arr1[0] = 1:
//   num1 = 1, d = 3. Range is [-2, 4].
//   `lower_bound` for -2 in `arr2` points to -3. `it` points to -3.
//   `it` is not `arr2.end()`. `*it` is -3.
//   Is `*it <= num1 + d` (i.e., -3 <= 4)? Yes, true.
//   So, `num1 = 1` has an element in `arr2` within distance `d`. `num1` is NOT valid. Count remains 0.
//
// For arr1[1] = 4:
//   num1 = 4, d = 3. Range is [1, 7].
//   `lower_bound` for 1 in `arr2` points to 6. `it` points to 6.
//   `it` is not `arr2.end()`. `*it` is 6.
//   Is `*it <= num1 + d` (i.e., 6 <= 7)? Yes, true.
//   So, `num1 = 4` has an element in `arr2` within distance `d`. `num1` is NOT valid. Count remains 0.
//
// For arr1[2] = 2:
//   num1 = 2, d = 3. Range is [-1, 5].
//   `lower_bound` for -1 in `arr2` points to -3. `it` points to -3.
//   `it` is not `arr2.end()`. `*it` is -3.
//   Is `*it <= num1 + d` (i.e., -3 <= 5)? Yes, true.
//   So, `num1 = 2` has an element in `arr2` within distance `d`. `num1` is NOT valid. Count remains 0.
//
// For arr1[3] = 3:
//   num1 = 3, d = 3. Range is [0, 6].
//   `lower_bound` for 0 in `arr2` points to 6. `it` points to 6.
//   `it` is not `arr2.end()`. `*it` is 6.
//   Is `*it <= num1 + d` (i.e., 6 <= 6)? Yes, true.
//   So, `num1 = 3` has an element in `arr2` within distance `d`. `num1` is NOT valid. Count remains 0.
//
// The example output is 2. This means elements `arr1[0]=1` and `arr1[3]=3` are NOT valid.
// But `arr1[1]=4` and `arr1[2]=2` ARE valid according to the output.
// Let's trace the "valid" ones according to the output:
//
// For arr1[1] = 4:
//   num1 = 4, d = 3. Range is [1, 7].
//   arr2 = [-4, -3, 6, 10, 20, 30].
//   Is there any `num2` in `arr2` such that `1 <= num2 <= 7`? Yes, `num2 = 6`.
//   So, `arr1[1]=4` SHOULD NOT be valid. But the example says it IS valid.
//
// There must be a misunderstanding of the problem or my interpretation of `lower_bound`'s behavior.
//
// "The distance value is defined as the number of elements arr1[i] such that there is not any element arr2[j] where |arr1[i]-arr2[j]| <= d."
//
// This means we count `arr1[i]` if FOR ALL `arr2[j]`, `|arr1[i]-arr2[j]| > d`.
//
// Let's reconsider `arr1 = [1,4,2,3], arr2 = [-4,-3,6,10,20,30], d = 3`.
// Sorted `arr2 = [-4, -3, 6, 10, 20, 30]`.
//
// For `arr1[0] = 1`:
//   Check `|1 - num2| > 3` for all `num2`.
//   `|1 - (-4)| = 5 > 3` (OK)
//   `|1 - (-3)| = 4 > 3` (OK)
//   `|1 - 6| = 5 > 3` (OK)
//   `|1 - 10| = 9 > 3` (OK)
//   `|1 - 20| = 19 > 3` (OK)
//   `|1 - 30| = 29 > 3` (OK)
//   All differences are > 3. So `arr1[0]=1` IS valid. Distance = 1.
//
// For `arr1[1] = 4`:
//   Check `|4 - num2| > 3` for all `num2`.
//   `|4 - (-4)| = 8 > 3` (OK)
//   `|4 - (-3)| = 7 > 3` (OK)
//   `|4 - 6| = 2`. This is NOT `> 3`. It is `<= 3`.
//   Since we found one `num2` (which is 6) where `|4 - 6| <= 3`, `arr1[1]=4` is NOT valid. Distance remains 1.
//
// For `arr1[2] = 2`:
//   Check `|2 - num2| > 3` for all `num2`.
//   `|2 - (-4)| = 6 > 3` (OK)
//   `|2 - (-3)| = 5 > 3` (OK)
//   `|2 - 6| = 4 > 3` (OK)
//   `|2 - 10| = 8 > 3` (OK)
//   `|2 - 20| = 18 > 3` (OK)
//   `|2 - 30| = 28 > 3` (OK)
//   All differences are > 3. So `arr1[2]=2` IS valid. Distance = 2.
//
// For `arr1[3] = 3`:
//   Check `|3 - num2| > 3` for all `num2`.
//   `|3 - (-4)| = 7 > 3` (OK)
//   `|3 - (-3)| = 6 > 3` (OK)
//   `|3 - 6| = 3`. This is NOT `> 3`. It is `<= 3`.
//   Since we found one `num2` (which is 6) where `|3 - 6| <= 3`, `arr1[3]=3` is NOT valid. Distance remains 2.
//
// Final answer = 2. This matches Example 2.
//
// Okay, the understanding is now correct. The condition for an `arr1[i]` to be counted is:
// `FOR ALL arr2[j], |arr1[i] - arr2[j]| > d`.
//
// This is equivalent to:
// There is NO `arr2[j]` such that `|arr1[i] - arr2[j]| <= d`.
//
// So for `num1` in `arr1`:
// We need to check if there is ANY `num2` in `arr2` such that `num1 - d <= num2 <= num1 + d`.
// If such a `num2` EXISTS, then `num1` is NOT counted.
// If NO such `num2` exists, then `num1` IS counted.
//
// This is precisely what my previous interpretation of `lower_bound` was trying to catch.
//
// For `num1` in `arr1`:
//    Let `lower_bound_target = num1 - d`.
//    Let `upper_bound_target = num1 + d`.
//
//    Use `std::lower_bound` to find `it = std::lower_bound(arr2.begin(), arr2.end(), lower_bound_target)`.
//
//    If `it != arr2.end()` AND `*it <= upper_bound_target`:
//        // This means we found an element `*it` in `arr2` such that `num1 - d <= *it <= num1 + d`.
//        // Thus, `num1` has an element in `arr2` within distance `d`.
//        // So, `num1` should NOT be counted.
//        This `num1` is NOT valid.
//    Else:
//        // This implies EITHER:
//        // 1. `it == arr2.end()`: All elements in `arr2` are less than `num1 - d`.
//        //    Therefore, all elements are also less than `num1 + d`. So, `|num1 - num2| > d` for all `num2`.
//        // 2. `it != arr2.end()` but `*it > upper_bound_target`:
//        //    The first element >= `num1 - d` is already greater than `num1 + d`.
//        //    This means all elements from `it` onwards are `> num1 + d`.
//        //    We also need to consider elements BEFORE `it`.
//        //    If `it == arr2.begin()`, then all elements are `> num1 + d`. Valid.
//        //    If `it != arr2.begin()`, the element before `it` is `*(it-1)`.
//        //    Since `it` is the `lower_bound` for `num1-d`, `*(it-1)` must be `< num1-d`.
//        //    So `*(it-1) < num1-d <= num1+d`. This case is not covered by `*it > upper_bound_target` alone.
//
// The check `it != arr2.end() && *it <= num1 + d` is correct.
// If this condition is TRUE, it means there's a `num2` in `arr2` that falls into `[num1-d, num1+d]`.
// This `num1` is NOT valid.
// If this condition is FALSE, it means NO `num2` falls into `[num1-d, num1+d]`.
// This `num1` IS valid.
//
// So, the initial logic was:
// For each `num1` in `arr1`:
//    Initialize `is_valid = true`.
//    Find `it = std::lower_bound(arr2.begin(), arr2.end(), num1 - d)`.
//    If `it != arr2.end()` and `*it <= num1 + d`:
//        `is_valid = false`. // Found a "close" element in arr2
//
//    If `is_valid` is true, increment `distance_value`.
//
// This interpretation matches the correct trace for Example 2.
//
// Let's re-trace Example 1 with this logic:
// arr1 = [4,5,8], arr2 = [10,9,1,8], d = 2
// Sorted arr2 = [1, 8, 9, 10]
//
// For arr1[0] = 4:
//   num1 = 4, d = 2. Range [2, 6].
//   `lower_bound` for 2 in [1, 8, 9, 10] points to 8. `it` points to 8.
//   `it` is not end. `*it` is 8.
//   Is `*it <= num1 + d` (i.e., 8 <= 6)? False.
//   `is_valid` remains true. `distance_value` = 1.
//
// For arr1[1] = 5:
//   num1 = 5, d = 2. Range [3, 7].
//   `lower_bound` for 3 in [1, 8, 9, 10] points to 8. `it` points to 8.
//   `it` is not end. `*it` is 8.
//   Is `*it <= num1 + d` (i.e., 8 <= 7)? False.
//   `is_valid` remains true. `distance_value` = 2.
//
// For arr1[2] = 8:
//   num1 = 8, d = 2. Range [6, 10].
//   `lower_bound` for 6 in [1, 8, 9, 10] points to 8. `it` points to 8.
//   `it` is not end. `*it` is 8.
//   Is `*it <= num1 + d` (i.e., 8 <= 10)? True.
//   `is_valid` becomes false.
//   `distance_value` remains 2.
//
// Final answer = 2. Matches Example 1.
//
// The logic seems solid now.
//
// Implementation details:
// - Include `<vector>`, `<algorithm>`, `<cmath>` (for abs if needed, though comparisons are fine).
// - Sort `arr2`.
// - Loop through `arr1`.
// - Inside the loop, perform `lower_bound`.
// - Check the condition.
// - Increment counter if valid.
//
// The `abs` function is not strictly needed if we use range checks.
// `num1 - d <= num2 <= num1 + d` implies `|num1 - num2| <= d`.
//
// The `lower_bound` function in C++ returns an iterator to the first element that is NOT LESS than the given value.
// So `std::lower_bound(arr2.begin(), arr2.end(), val)` returns an iterator `it` such that `*it >= val`.
// If `*it >= num1 - d` and `*it <= num1 + d`, then `num1` is not valid.
//
// Code structure:
// class Solution {
// public:
//     int findTheDistanceValue(vector<int>& arr1, vector<int>& arr2, int d) {
//         sort(arr2.begin(), arr2.end());
//         int distance_value = 0;
//         for (int num1 : arr1) {
//             bool is_valid = true;
//             // Find first element in arr2 that is >= num1 - d
//             auto it = lower_bound(arr2.begin(), arr2.end(), num1 - d);
//
//             // Check if this element (or any element after it) falls within the forbidden range [num1 - d, num1 + d]
//             // The element found by lower_bound is already >= num1 - d.
//             // We only need to check if it's <= num1 + d.
//             if (it != arr2.end() && *it <= num1 + d) {
//                 is_valid = false; // Found an element in arr2 that is too close
//             }
//
//             if (is_valid) {
//                 distance_value++;
//             }
//         }
//         return distance_value;
//     }
// };
//
// Consider edge cases:
// - Empty arrays: Constraints say 1 <= arr1.length, arr2.length. So not empty.
// - `d = 0`: If `d=0`, we count `arr1[i]` if there's no `arr2[j]` equal to `arr1[i]`.
//   Example: arr1=[1,2], arr2=[1], d=0.
//   Sorted arr2 = [1].
//   For arr1[0]=1: num1-d=1, num1+d=1. lower_bound for 1 points to 1. `it` points to 1.
//   `it` not end. `*it`=1. Is `*it <= num1+d` (1 <= 1)? True. `is_valid` becomes false. Not counted.
//   For arr1[1]=2: num1-d=2, num1+d=2. lower_bound for 2 points to end. `it` is end.
//   Condition `it != arr2.end() && *it <= num1+d` is false. `is_valid` remains true. Counted.
//   Distance = 1. Correct.
//
// - Large/small values for numbers and `d`: Constraints are within standard integer types.
//
// The logic holds up.

```cpp
#include <vector>
#include <algorithm>
#include <cmath> // Not strictly needed for the chosen approach but useful for general math

// Problem: Find the Distance Value Between Two Arrays
// Link: https://leetcode.com/problems/find-the-distance-value-between-two-arrays/
//
// Approach:
// The problem asks us to count elements in `arr1` for which there is no element in `arr2`
// within a distance `d`. This means for an element `arr1[i]` to be counted, it must satisfy
// `abs(arr1[i] - arr2[j]) > d` for ALL `j`.
// This is equivalent to checking if there is NO element `arr2[j]` such that
// `arr1[i] - d <= arr2[j] <= arr1[i] + d`.
//
// To efficiently check this for each element in `arr1`, we first sort `arr2`.
// Sorting `arr2` allows us to use binary search (specifically `std::lower_bound`).
//
// For each element `num1` in `arr1`:
// 1. We define the "forbidden range" as `[num1 - d, num1 + d]`.
// 2. We use `std::lower_bound` on the sorted `arr2` to find the first element that is
//    greater than or equal to `num1 - d`. Let this iterator be `it`.
// 3. If `it` points to an element within `arr2` (i.e., `it != arr2.end()`) AND
//    the value pointed to by `it` (`*it`) is less than or equal to `num1 + d`,
//    then we have found an element in `arr2` that falls within the forbidden range.
//    In this case, `num1` does NOT contribute to the distance value.
// 4. If the condition in step 3 is NOT met, it means NO element in `arr2` falls within
//    the forbidden range `[num1 - d, num1 + d]`. Therefore, `num1` contributes to the
//    distance value, and we increment our counter.
//
// Time Complexity:
// - Sorting `arr2`: O(N2 * log(N2)), where N2 is the length of `arr2`.
// - Iterating through `arr1`: N1 elements, where N1 is the length of `arr1`.
// - For each element in `arr1`, performing binary search (`lower_bound`) on `arr2`: O(log(N2)).
// - Total time complexity: O(N2 * log(N2) + N1 * log(N2)).
//
// Space Complexity:
// - O(log(N2)) for the recursion stack of `std::sort` (or O(1) if iterative sorting is used).
//   If `std::sort` creates a copy, it would be O(N2). Standard library sort is typically O(log N) space.
//
class Solution {
public:
    int findTheDistanceValue(std::vector<int>& arr1, std::vector<int>& arr2, int d) {
        // Sort arr2 to enable efficient binary search.
        std::sort(arr2.begin(), arr2.end());

        int distance_value = 0; // Initialize the count of elements satisfying the condition.

        // Iterate through each element in arr1.
        for (int num1 : arr1) {
            bool is_valid = true; // Assume the current num1 is valid until proven otherwise.

            // The condition for num1 NOT to be valid is if there exists any num2 in arr2
            // such that |num1 - num2| <= d.
            // This is equivalent to: num1 - d <= num2 <= num1 + d.

            // Use std::lower_bound to find the first element in sorted arr2 that is >= (num1 - d).
            // 'it' will point to this element, or arr2.end() if all elements are less than (num1 - d).
            auto it = std::lower_bound(arr2.begin(), arr2.end(), num1 - d);

            // Now we check if this found element `*it` (if it exists) falls within the forbidden range [num1 - d, num1 + d].
            // `*it` is already guaranteed to be >= `num1 - d` because of `lower_bound`.
            // So, we only need to check if `*it <= num1 + d`.
            if (it != arr2.end() && *it <= num1 + d) {
                // If the condition is true, it means we found an element `*it` in `arr2`
                // such that `num1 - d <= *it <= num1 + d`.
                // This `num1` has an element in `arr2` within distance `d`, so it's not valid.
                is_valid = false;
            }

            // If after checking, `is_valid` is still true, it means no element in `arr2`
            // was found within the forbidden range. So, this `num1` contributes to the distance value.
            if (is_valid) {
                distance_value++;
            }
        }

        // Return the total count of valid elements from arr1.
        return distance_value;
    }
};
```