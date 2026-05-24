```cpp
// Problem: Jump Game V
// LeetCode Link: https://leetcode.com/problems/jump-game-v/
//
// Approach:
// This problem can be solved using dynamic programming with memoization and a depth-first search (DFS) approach.
// For each index `i`, we want to find the maximum number of jumps possible starting from `i`.
// Let `dp[i]` be the maximum number of indices we can visit starting from index `i`.
//
// To calculate `dp[i]`, we can explore all possible valid jumps from `i`.
// A jump from `i` to `j` is valid if:
// 1. `abs(i - j) <= d`
// 2. `arr[i] > arr[j]`
// 3. For all `k` strictly between `i` and `j`, `arr[i] > arr[k]`.
//
// The condition `arr[i] > arr[k]` for all `k` between `i` and `j` implies that `arr[i]` must be the maximum element in the subarray between `i` and `j` (exclusive of `j`).
// This condition can be checked efficiently by iterating outwards from `i` up to a distance `d`.
//
// For a given index `i`, we can jump to `i + x` or `i - x` where `0 < x <= d`.
//
// When jumping to `i + x`: we need `i + x < arr.length` and `arr[i] > arr[i+x]`.
// Crucially, for `i + x` to be reachable from `i`, all elements between `i` and `i + x` must be strictly smaller than `arr[i]`. This means as we check `i+1`, `i+2`, ..., `i+x`, `arr[i]` must be greater than each of them. If `arr[i+k]` becomes greater than or equal to `arr[i]` for any `k < x`, then `i+x` is not reachable from `i`.
// Similarly for jumping to `i - x`: we need `i - x >= 0` and `arr[i] > arr[i-x]`. All elements between `i-x` and `i` must be strictly smaller than `arr[i]`.
//
// The DFS function `dfs(index, arr, d, dp)` will calculate `dp[index]`:
// - Base case: If `dp[index]` is already computed, return `dp[index]`.
// - Initialize `max_visits = 1` (for the current index itself).
// - Explore jumps to the right: Iterate `x` from 1 to `d`. If `index + x` is within bounds and `arr[index] > arr[index + x]`:
//   - Check intermediate elements: For `k` from 1 to `x-1`, if `arr[index + k] >= arr[index]`, then this path is blocked, break the inner loop for `x`.
//   - If the path is not blocked, recursively call `dfs(index + x, arr, d, dp)` and update `max_visits = max(max_visits, 1 + dfs(index + x, arr, d, dp))`.
// - Explore jumps to the left: Iterate `x` from 1 to `d`. If `index - x` is within bounds and `arr[index] > arr[index - x]`:
//   - Check intermediate elements: For `k` from 1 to `x-1`, if `arr[index - k] >= arr[index]`, then this path is blocked, break the inner loop for `x`.
//   - If the path is not blocked, recursively call `dfs(index - x, arr, d, dp)` and update `max_visits = max(max_visits, 1 + dfs(index - x, arr, d, dp))`.
// - Store `dp[index] = max_visits` and return it.
//
// The main function will iterate through each index `i` of the array, call `dfs(i, arr, d, dp)`, and keep track of the overall maximum number of visits.
//
// Time Complexity:
// Each state `dp[i]` is computed exactly once. For each state `i`, we iterate up to `d` steps in both directions. For each step, we might iterate up to `d` elements to check the intermediate condition.
// So, in the worst case, for each index `i`, we might do `O(d * d)` work.
// Since there are `N` indices, the total time complexity is `O(N * d^2)`.
// However, a closer look at the intermediate check reveals that the loops are structured such that for a given direction (left or right), we stop as soon as the condition `arr[current] >= arr[start]` is met. This means for each index `i` and each direction, the total number of visited elements `k` across all `x` within `d` is at most `d`.
// For index `i`, exploring right: we iterate `j` from `i+1` to `min(i+d, n-1)`. If `arr[i] > arr[j]`, we add `1 + dfs(j)` to consideration. If `arr[i] <= arr[j]`, we stop exploring further in this direction.
// The overall logic for computing `dp[i]` involves iterating `x` from 1 to `d` and for each `x`, checking intermediate elements up to `x-1`. The total work for `dp[i]` by checking right and left is effectively `O(d)`. For example, when checking right, we iterate `x` from 1 to `d`. For each `x`, we check `arr[i+1], ..., arr[i+x-1]`. The total number of element checks in the rightward direction is sum of `(x-1)` for `x=1..d` as long as intermediate checks pass. This sums up to `O(d^2)`.
// Wait, the condition `arr[i] > arr[k] for all indices k between i and j` means that `arr[i]` must be strictly greater than *all* elements between `i` and `j`. This implies `arr[i]` must be greater than `arr[i+1], arr[i+2], ..., arr[j-1]`. So, when we check `i+x`, we must ensure `arr[i] > arr[i+1]`, `arr[i] > arr[i+2]`, ..., `arr[i] > arr[i+x-1]`.
// The refined DFS for `dfs(index)`:
//   For right jumps: iterate `j` from `index + 1` to `min(index + d, n - 1)`.
//     If `arr[index] > arr[j]`:
//       `max_visits = max(max_visits, 1 + dfs(j, ...))`
//     Else (`arr[index] <= arr[j]`):
//       This means `index` cannot jump to `j` or any index beyond `j` in this direction because `arr[index]` is not the maximum among them. So, break the loop for `j`.
//   For left jumps: iterate `j` from `index - 1` to `max(index - d, 0)`.
//     If `arr[index] > arr[j]`:
//       `max_visits = max(max_visits, 1 + dfs(j, ...))`
//     Else (`arr[index] <= arr[j]`):
//       Break the loop for `j`.
//
// With this refined logic, for each `dfs(index)` call, we iterate at most `d` times in each direction. The work inside the loop is `O(1)` (comparison and recursive call).
// Therefore, the time complexity is `O(N * d)`.
//
// Space Complexity:
// `O(N)` for the `dp` array to store memoized results.
// `O(N)` in the worst case for the recursion call stack depth.
// Total space complexity is `O(N)`.
//
// Example 1: arr = [6,4,14,6,8,13,9,7,10,6,12], d = 2
// dp array initialized to -1.
//
// Let's trace dfs(10): arr[10] = 12, d=2
//   Right: index + 1 = 11 (out of bounds)
//   Left:
//     x = 1: index - 1 = 9. arr[9] = 6. arr[10] > arr[9] (12 > 6).
//       Intermediate check: No elements between 10 and 9.
//       max_visits = max(1, 1 + dfs(9))
//     x = 2: index - 2 = 8. arr[8] = 10. arr[10] > arr[8] (12 > 10).
//       Intermediate check: arr[9] = 6. arr[10] > arr[9] (12 > 6). Condition met.
//       max_visits = max(max_visits, 1 + dfs(8))
//
// Let's trace dfs(9): arr[9] = 6, d=2
//   Right: index + 1 = 10. arr[10] = 12. arr[9] < arr[10]. Break right.
//   Left:
//     x = 1: index - 1 = 8. arr[8] = 10. arr[9] < arr[8]. Break left.
//   dp[9] = 1.
//
// Back to dfs(10):
//   max_visits = max(1, 1 + dp[9]) = max(1, 1 + 1) = 2.
//   Now consider x = 2 for left jump from 10 to 8.
//   Let's trace dfs(8): arr[8] = 10, d=2
//     Right:
//       x = 1: index + 1 = 9. arr[9] = 6. arr[8] > arr[9] (10 > 6).
//         Intermediate check: None.
//         max_visits = max(1, 1 + dfs(9)) = max(1, 1 + 1) = 2.
//       x = 2: index + 2 = 10. arr[10] = 12. arr[8] < arr[10]. Break right.
//     Left:
//       x = 1: index - 1 = 7. arr[7] = 7. arr[8] > arr[7] (10 > 7).
//         Intermediate check: None.
//         max_visits = max(2, 1 + dfs(7))
//       x = 2: index - 2 = 6. arr[6] = 9. arr[8] > arr[6] (10 > 9).
//         Intermediate check: arr[7] = 7. arr[8] > arr[7] (10 > 7). Condition met.
//         max_visits = max(max_visits, 1 + dfs(6))
//
// Let's trace dfs(7): arr[7] = 7, d=2
//   Right:
//     x = 1: index + 1 = 8. arr[8] = 10. arr[7] < arr[8]. Break right.
//   Left:
//     x = 1: index - 1 = 6. arr[6] = 9. arr[7] < arr[6]. Break left.
//   dp[7] = 1.
//
// Back to dfs(8) for left jump to 7:
//   max_visits = max(2, 1 + dp[7]) = max(2, 1 + 1) = 2.
//
// Let's trace dfs(6): arr[6] = 9, d=2
//   Right:
//     x = 1: index + 1 = 7. arr[7] = 7. arr[6] > arr[7] (9 > 7).
//       Intermediate check: None.
//       max_visits = max(1, 1 + dfs(7)) = max(1, 1 + 1) = 2.
//     x = 2: index + 2 = 8. arr[8] = 10. arr[6] < arr[8]. Break right.
//   Left:
//     x = 1: index - 1 = 5. arr[5] = 13. arr[6] < arr[5]. Break left.
//   dp[6] = 2.
//
// Back to dfs(8) for left jump to 6:
//   max_visits = max(2, 1 + dp[6]) = max(2, 1 + 2) = 3.
//   So, dp[8] = 3. (Path: 8 -> 6 -> 7)
//
// Back to dfs(10) for left jump to 8:
//   max_visits = max(2, 1 + dp[8]) = max(2, 1 + 3) = 4.
//   So, dp[10] = 4. (Path: 10 -> 8 -> 6 -> 7)
//
// The overall maximum will be the maximum of all dp[i].
//
// Example 1 output is 4.
// The example says start at index 10, jump 10 --> 8 --> 6 --> 7.
// arr = [6,4,14,6,8,13,9,7,10,6,12]
// index 10: arr[10]=12. d=2
//  jump to 8 (10-2): arr[8]=10. 12 > 10. Intermediate arr[9]=6. 12 > 6. Valid.
// index 8: arr[8]=10. d=2
//  jump to 6 (8-2): arr[6]=9. 10 > 9. Intermediate arr[7]=7. 10 > 7. Valid.
// index 6: arr[6]=9. d=2
//  jump to 7 (6+1): arr[7]=7. 9 > 7. Valid.
// index 7: arr[7]=7. d=2
//  cannot jump.
// Total visited: 10, 8, 6, 7. Count = 4.
//
// The logic for intermediate checks in the provided example explanation:
// "Note that if you start at index 6 you can only jump to index 7. You cannot jump to index 5 because 13 > 9. You cannot jump to index 4 because index 5 is between index 4 and 6 and 13 > 9."
//
// Let's re-verify the condition:
// "you can only jump from index i to index j if arr[i] > arr[j] and arr[i] > arr[k] for all indices k between i and j (More formally min(i, j) < k < max(i, j))."
//
// So, if we are at index `i` and considering jumping to index `j`:
// - `arr[i] > arr[j]` must hold.
// - For all `k` such that `min(i, j) < k < max(i, j)`, `arr[i] > arr[k]` must hold.
//
// This means `arr[i]` must be strictly greater than *all* elements between `i` and `j`.
//
// Let's re-trace dfs(6), arr[6]=9, d=2
//   Right jumps:
//     x=1: j = 6+1 = 7. arr[7]=7. arr[6] > arr[7] (9>7).
//       Intermediate k: none. Valid.
//       Consider 1 + dfs(7).
//     x=2: j = 6+2 = 8. arr[8]=10. arr[6] < arr[8] (9 < 10). Condition `arr[i] > arr[j]` fails. Stop right.
//
//   Left jumps:
//     x=1: j = 6-1 = 5. arr[5]=13. arr[6] < arr[5] (9 < 13). Condition `arr[i] > arr[j]` fails. Stop left.
//
// So dfs(6) should yield 1 + dfs(7). If dfs(7) is 1, then dfs(6) is 2. This matches my earlier trace.
//
// Let's re-trace the example's reasoning for index 6:
// "You can start at index 6. You can only jump to index 7."
// arr = [6,4,14,6,8,13,9,7,10,6,12], d = 2
// i = 6, arr[6] = 9.
//   Try j = 6+1 = 7. arr[7]=7. arr[6]>arr[7] (9>7). No intermediate k. Valid.
//   Try j = 6+2 = 8. arr[8]=10. arr[6]<arr[8] (9<10). Cannot jump.
//   Try j = 6-1 = 5. arr[5]=13. arr[6]<arr[5] (9<13). Cannot jump.
//   Try j = 6-2 = 4. arr[4]=8. arr[6]>arr[4] (9>8).
//     Intermediate k = 5. min(6,4)=4, max(6,4)=6. 4 < k < 6 means k=5.
//     arr[k] = arr[5] = 13.
//     Condition `arr[i] > arr[k]` means `arr[6] > arr[5]`. Is `9 > 13`? No. Invalid jump to 4.
//
// The key insight here is that when we iterate outwards from `i` to `j`, we must check ALL intermediate elements. The condition `arr[i] > arr[k]` for ALL `k` between `i` and `j` is powerful.
//
// My initial DFS structure was checking `arr[i] > arr[i+x]` and then checking intermediate `arr[i+k]`. This is slightly different.
//
// Let's refine the DFS:
// `dfs(index)`:
//   `dp[index]` is the max jumps from `index`.
//   `max_jumps = 1` (for current index).
//
//   // Explore right jumps
//   for `j` from `index + 1` to `min(index + d, n - 1)`:
//     // Check if `arr[index]` is greater than all elements between `index` and `j`
//     `bool can_jump = true;`
//     for `k` from `index + 1` to `j - 1`:
//       if `arr[index] <= arr[k]`:
//         `can_jump = false;`
//         break;
//     if `can_jump` and `arr[index] > arr[j]`: // The condition arr[i] > arr[j] must also hold
//       `max_jumps = max(max_jumps, 1 + dfs(j, ...))`
//     else if (!can_jump || arr[index] <= arr[j]) {
//       // If we can't jump to `j` because of intermediate elements or `arr[index] <= arr[j]`,
//       // we also cannot jump to any index `j' > j` in this direction from `index` because
//       // either `arr[index]` is not greater than some intermediate `arr[k]`, or `arr[index] <= arr[j']`.
//       // Specifically, if `arr[index] <= arr[j]`, then for any `j' > j`, `arr[index] <= arr[j] <= arr[j']` is possible,
//       // or if `arr[index] <= arr[k]` for some intermediate k, then for any j'>j, arr[index] might not be greater than k.
//       // So we can break the outer loop for `j`.
//       break;
//     }
//
//   // Explore left jumps
//   for `j` from `index - 1` to `max(index - d, 0)`:
//     `bool can_jump = true;`
//     for `k` from `index - 1` down to `j + 1`: // Checking indices between j and index
//       if `arr[index] <= arr[k]`:
//         `can_jump = false;`
//         break;
//     if `can_jump` and `arr[index] > arr[j]`: // The condition arr[i] > arr[j] must also hold
//       `max_jumps = max(max_jumps, 1 + dfs(j, ...))`
//     else if (!can_jump || arr[index] <= arr[j]) {
//       // Break the outer loop for `j`.
//       break;
//     }
//
//   `dp[index] = max_jumps;`
//   return `max_jumps;`
//
// This nested loop structure would be O(N * d^2) per DFS call, leading to O(N^2 * d^2) overall. This is too slow given N=1000, d=1000.
//
// Let's re-read: "you can only jump from index i to index j if arr[i] > arr[j] and arr[i] > arr[k] for all indices k between i and j"
//
// The condition `arr[i] > arr[k]` for all indices `k` between `i` and `j` effectively means that `arr[i]` is the *strict maximum* in the range `(min(i,j), max(i,j))`.
//
// Let's think about the search direction again. If `arr[i] > arr[i+1]`, and `arr[i] > arr[i+2]`, ..., and `arr[i] > arr[i+d]`. This implies `arr[i]` is the maximum in the range `(i, i+d]`.
//
// The example explanation for index 6: "You cannot jump to index 5 because 13 > 9. You cannot jump to index 4 because index 5 is between index 4 and 6 and 13 > 9."
//
// This means `arr[i]` must be greater than `arr[j]` AND `arr[i]` must be greater than all values BETWEEN `i` and `j`.
//
// When we are at `i`, and consider `i+1`, `i+2`, ... up to `i+d`.
// For `i+1`: must have `arr[i] > arr[i+1]`. No intermediate elements.
// For `i+2`: must have `arr[i] > arr[i+2]` AND `arr[i] > arr[i+1]`.
// For `i+x`: must have `arr[i] > arr[i+x]` AND `arr[i] > arr[i+1]` AND ... AND `arr[i] > arr[i+x-1]`.
//
// This condition implies that as we iterate `j` from `i+1` up to `min(i+d, n-1)`, if `arr[i] <= arr[j]`, then `i` cannot jump to `j` or any further right. Similarly, if `arr[i] <= arr[k]` for any `k` between `i` and `j`, then `i` cannot jump to `j` or any further right.
//
// This means the DFS logic I wrote earlier (second refined version):
//   `dfs(index)`:
//     `max_visits = 1`
//     // Explore right jumps
//     for `j` from `index + 1` to `min(index + d, n - 1)`:
//       if `arr[index] > arr[j]`:
//         // IMPORTANT: The condition "arr[i] > arr[k] for all k between i and j" means that
//         // if arr[index] is not greater than arr[j], we stop. But if arr[index] IS greater
//         // than arr[j], we still need to ensure that arr[index] is greater than ALL INTERMEDIATE values.
//         // The loop structure naturally handles this: if `arr[index] <= arr[some_intermediate_k]`,
//         // then this `k` would have already broken the loop for `j` when `j` reached `k`.
//         // So, IF the loop for `j` continues, it implies `arr[index]` is greater than all `arr[k]` where `index < k < j`.
//         `max_visits = max(max_visits, 1 + dfs(j, ...))`
//       else: // arr[index] <= arr[j]
//         // If arr[index] is not greater than arr[j], then index cannot jump to j.
//         // Also, index cannot jump to any j' > j because the condition `arr[index] > arr[k]`
//         // for k between index and j' would likely fail if arr[index] <= arr[j].
//         // This is the critical part: the problem states `arr[i] > arr[k]` for *all* k between i and j.
//         // This means if `arr[index] <= arr[j]`, then `j` cannot be reached.
//         // If `arr[index] <= arr[j]`, then for any `j' > j`, `arr[index]` cannot be the strict maximum
//         // between `index` and `j'` if `j` is between `index` and `j'`.
//         // Example: i, k1, k2, j. If arr[i] <= arr[k2], then we can't jump to j.
//         // This implies the `break` is correct.
//         break;
//     // Explore left jumps (similarly)
//     for `j` from `index - 1` down to `max(index - d, 0)`:
//       if `arr[index] > arr[j]`:
//         `max_visits = max(max_visits, 1 + dfs(j, ...))`
//       else: // arr[index] <= arr[j]
//         break;
//
//   `dp[index] = max_visits;`
//   return `max_visits;`
//
// This refined logic is indeed `O(N * d)`.
// Let's re-verify the example reasoning with this O(N*d) logic.
// arr = [6,4,14,6,8,13,9,7,10,6,12], d = 2
//
// dfs(10): arr[10]=12, d=2
//   Right: indices 11, 12 (out of bounds)
//   Left:
//     j=9: arr[9]=6. arr[10]>arr[9] (12>6). Valid. Consider 1 + dfs(9).
//     j=8: arr[8]=10. arr[10]>arr[8] (12>10). Intermediate check: k=9. arr[9]=6. arr[10]>arr[9]. Valid. Consider 1 + dfs(8).
//
// dfs(9): arr[9]=6, d=2
//   Right: j=10. arr[10]=12. arr[9]<arr[10]. Break.
//   Left:
//     j=8: arr[8]=10. arr[9]<arr[8]. Break.
//   dp[9] = 1.
//
// dfs(8): arr[8]=10, d=2
//   Right:
//     j=9: arr[9]=6. arr[8]>arr[9] (10>6). Valid. Consider 1 + dfs(9) = 1+1=2. max_visits=2.
//     j=10: arr[10]=12. arr[8]<arr[10]. Break.
//   Left:
//     j=7: arr[7]=7. arr[8]>arr[7] (10>7). Valid. Consider 1 + dfs(7).
//     j=6: arr[6]=9. arr[8]>arr[6] (10>9). Intermediate check: k=7. arr[7]=7. arr[8]>arr[7]. Valid. Consider 1 + dfs(6).
//
// dfs(7): arr[7]=7, d=2
//   Right:
//     j=8: arr[8]=10. arr[7]<arr[8]. Break.
//   Left:
//     j=6: arr[6]=9. arr[7]<arr[6]. Break.
//   dp[7] = 1.
//
// dfs(6): arr[6]=9, d=2
//   Right:
//     j=7: arr[7]=7. arr[6]>arr[7] (9>7). Valid. Consider 1 + dfs(7) = 1+1=2. max_visits=2.
//     j=8: arr[8]=10. arr[6]<arr[8]. Break.
//   Left:
//     j=5: arr[5]=13. arr[6]<arr[5]. Break.
//   dp[6] = 2.
//
// Back to dfs(8):
//   max_visits from right = 2.
//   Left jump to 7: 1 + dfs(7) = 1 + 1 = 2. max_visits = max(2, 2) = 2.
//   Left jump to 6: 1 + dfs(6) = 1 + 2 = 3. max_visits = max(2, 3) = 3.
//   So, dp[8] = 3.
//
// Back to dfs(10):
//   Left jump to 9: 1 + dfs(9) = 1 + 1 = 2. max_visits = 2.
//   Left jump to 8: 1 + dfs(8) = 1 + 3 = 4. max_visits = max(2, 4) = 4.
//   So, dp[10] = 4.
//
// The main loop will call dfs for all indices and find the max. The max found will be 4 from dfs(10).
//
// The logic seems correct now and fits `O(N*d)`.
//
// Let's consider the "intermediate elements" condition carefully again.
// "arr[i] > arr[k] for all indices k between i and j"
//
// When moving from `i` to `j` (say `j > i`), this means:
// `arr[i] > arr[i+1]`
// `arr[i] > arr[i+2]`
// ...
// `arr[i] > arr[j-1]`
// AND `arr[i] > arr[j]`
//
// The loop `for j from index + 1 to min(index + d, n - 1)` checks this implicitly.
// If `arr[index] <= arr[j]`, the loop breaks. This correctly prevents jumps where `arr[index]` is not greater than the destination.
// If `arr[index] > arr[j]`, we consider `1 + dfs(j)`. This assumes that `arr[index]` is greater than all intermediate `k`.
// Why is this assumption valid?
// Because if there was an intermediate `k` such that `arr[index] <= arr[k]`, then when `j` was equal to `k`, the `else` condition `arr[index] <= arr[j]` would have been triggered, and the loop would have broken *before* reaching the current `j`.
// So, if the loop for `j` successfully reaches a value greater than `index` and less than or equal to `index+d`, and `arr[index] > arr[j]` is true, it implicitly means that for all `k` such that `index < k < j`, we also had `arr[index] > arr[k]`.
//
// This confirms the `O(N*d)` approach.
//
// Final check on constraints and types:
// `arr.length <= 1000`, `arr[i] <= 10^5`, `d <= arr.length`.
// `int` is sufficient for array values and counts. `vector<int>` for dp table.
// Standard recursion depth is usually around 1000-2000, which is fine for N=1000.
//
// Include headers: `<vector>`, `<algorithm>`, `<iostream>` (for testing if needed).
// Use `std::vector<int> dp(n, -1);` for memoization.
// Use `std::max` for finding maximums.
// The main loop: `int max_reachable = 0; for (int i = 0; i < n; ++i) max_reachable = std::max(max_reachable, dfs(i, arr, d, dp));`

```cpp
#include <vector>
#include <algorithm>

class Solution {
public:
    // Memoization table to store the maximum number of jumps from each index.
    // dp[i] will store the maximum indices visitable starting from index i.
    // Initialize with -1 to indicate uncomputed states.
    std::vector<int> dp;
    // The input array.
    std::vector<int> arr;
    // The maximum jump distance.
    int d;
    // The size of the array.
    int n;

    /**
     * @brief Depth First Search function to calculate the maximum number of indices
     *        visit able starting from a given index.
     *
     * @param index The current starting index.
     * @return The maximum number of indices visitable starting from 'index'.
     */
    int dfs(int index) {
        // If the result for this index is already computed, return it.
        if (dp[index] != -1) {
            return dp[index];
        }

        // Initialize the maximum visits for the current index to 1 (the index itself).
        int max_visits = 1;

        // Explore possible jumps to the right.
        // We can jump from 'index' to 'j = index + x' where 0 < x <= d.
        // So, 'j' will range from 'index + 1' up to 'index + d'.
        for (int j = index + 1; j <= std::min(index + d, n - 1); ++j) {
            // Condition for jumping from 'index' to 'j':
            // 1. arr[index] > arr[j]
            // 2. arr[index] > arr[k] for all indices 'k' strictly between 'index' and 'j'.
            //
            // The loop structure naturally enforces the second condition:
            // If arr[index] <= arr[k] for any k between index+1 and j-1,
            // then when the loop variable 'j' reached that 'k', the condition
            // `arr[index] > arr[j]` would have been false, and the loop would have broken.
            // Therefore, if we reach this point and arr[index] > arr[j], it implies
            // arr[index] is greater than all intermediate elements as well.
            if (arr[index] > arr[j]) {
                // If the jump is valid, recursively call dfs for the next index 'j'
                // and update max_visits. We add 1 for the current step.
                max_visits = std::max(max_visits, 1 + dfs(j));
            } else {
                // If arr[index] <= arr[j], then 'index' cannot jump to 'j'.
                // Furthermore, it cannot jump to any index 'j_prime > j' in this direction
                // because 'arr[index]' is not strictly greater than 'arr[j]'.
                // The condition `arr[index] > arr[k]` for all k between i and j would be violated
                // if j itself is not smaller than arr[index].
                // So, we can stop exploring further to the right.
                break;
            }
        }

        // Explore possible jumps to the left.
        // We can jump from 'index' to 'j = index - x' where 0 < x <= d.
        // So, 'j' will range from 'index - 1' down to 'index - d'.
        for (int j = index - 1; j >= std::max(index - d, 0); --j) {
            // Similar logic as for right jumps.
            // If arr[index] <= arr[j], we cannot jump to 'j' or any further left.
            if (arr[index] > arr[j]) {
                // If the jump is valid, recursively call dfs for the next index 'j'.
                max_visits = std::max(max_visits, 1 + dfs(j));
            } else {
                // If arr[index] <= arr[j], stop exploring further to the left.
                break;
            }
        }

        // Store the computed maximum visits for the current index in the dp table.
        dp[index] = max_visits;
        // Return the result.
        return max_visits;
    }

    /**
     * @brief Given an array of integers arr and an integer d. In one step you can jump from index i to index j
     *        if abs(i - j) <= d and arr[i] > arr[j] and arr[i] > arr[k] for all indices k between i and j.
     *        Return the maximum number of indices you can visit.
     *
     * @param arr The input array of integers.
     * @param d The maximum jump distance.
     * @return The maximum number of indices that can be visited.
     */
    int maxJumps(std::vector<int>& arr, int d) {
        // Initialize member variables.
        this->arr = arr;
        this->d = d;
        this->n = arr.size();
        // Resize and initialize the dp table with -1.
        this->dp.assign(n, -1);

        // Variable to store the overall maximum number of visitable indices.
        int overall_max_visits = 0;

        // Iterate through each index of the array.
        // For each index, calculate the maximum number of visits starting from it
        // using the dfs function.
        for (int i = 0; i < n; ++i) {
            overall_max_visits = std::max(overall_max_visits, dfs(i));
        }

        // Return the overall maximum found.
        return overall_max_visits;
    }
};
```