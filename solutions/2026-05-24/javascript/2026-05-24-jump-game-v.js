/**
 * @summary Given an array of integers arr and an integer d, find the maximum number of indices you can visit by jumping.
 *          You can jump from index i to index j if abs(i-j) <= d and arr[i] > arr[j] and arr[i] is strictly greater than
 *          all elements between i and j.
 * @link https://leetcode.com/problems/jump-game-v/
 * @approach
 * This problem can be solved using dynamic programming with memoization (top-down approach) or recursion.
 * For each index `i`, we want to find the maximum number of jumps we can make starting from `i`.
 * This can be defined recursively: `dp[i] = 1 + max(dp[next_index])` where `next_index` are valid jump destinations from `i`.
 * A valid jump from `i` to `j` requires:
 * 1. `abs(i - j) <= d`
 * 2. `arr[i] > arr[j]`
 * 3. For all `k` between `min(i, j)` and `max(i, j)`, `arr[i] > arr[k]`. This condition means that `arr[i]` must be strictly greater
 *    than all intermediate elements. This implies that we can only jump "downhill" in terms of value as we move away from `i`.
 *
 * To efficiently check condition 3, when considering jumps from `i` to `i+x` (where `0 < x <= d`), we need to ensure `arr[i]` is the maximum
 * among `arr[i+1], ..., arr[i+x]`. Similarly, for jumps to `i-x`, `arr[i]` must be the maximum among `arr[i-1], ..., arr[i-x]`.
 *
 * The state `dp[i]` will store the maximum number of visited indices starting from index `i`.
 * We will use a memoization array `memo` to store computed `dp[i]` values and avoid redundant calculations.
 *
 * The overall maximum number of visited indices will be the maximum value in the `memo` array after computing all `dp[i]`.
 *
 * The function `dfs(index)` will perform the depth-first search:
 * - If `memo[index]` is already computed, return it.
 * - Initialize `maxJumps` to 0.
 * - Explore jumps to the right: For `x` from 1 to `d`:
 *     - If `index + x` is within bounds:
 *         - Check if `arr[index] > arr[index + x]`.
 *         - Check if `arr[index]` is strictly greater than all elements between `index` and `index + x`. This can be done by iterating from `index + 1` to `index + x - 1`. If any element `arr[k]` is greater than or equal to `arr[index]`, this path is invalid.
 *         - If valid, recursively call `dfs(index + x)` and update `maxJumps = Math.max(maxJumps, dfs(index + x))`.
 * - Explore jumps to the left: For `x` from 1 to `d`:
 *     - If `index - x` is within bounds:
 *         - Check if `arr[index] > arr[index - x]`.
 *         - Check if `arr[index]` is strictly greater than all elements between `index - x` and `index`. This can be done by iterating from `index - 1` down to `index - x + 1`. If any element `arr[k]` is greater than or equal to `arr[index]`, this path is invalid.
 *         - If valid, recursively call `dfs(index - x)` and update `maxJumps = Math.max(maxJumps, dfs(index - x))`.
 * - Store the result `memo[index] = 1 + maxJumps`.
 * - Return `memo[index]`.
 *
 * Finally, iterate through all indices `i` from 0 to `n-1`, call `dfs(i)`, and find the maximum result.
 *
 * Time Complexity: O(n*d) in the worst case if the intermediate checks are optimized. Without optimization, the intermediate check can take O(d). Thus, O(n*d*d).
 * With optimization for the intermediate check:
 * For each `dfs(i)`, we iterate `d` steps to the right and `d` steps to the left.
 * In each step, we perform a check for intermediate elements. If `arr[i]` is the maximum, we can continue.
 * If we iterate `x` steps, we check `x-1` elements. The total work for checking intermediate elements for a given `i` and a direction (left/right) could be summed up.
 * However, a more efficient way to think about the constraint `arr[i] > arr[k]` for all `k` between `i` and `j` is that when we are at index `i`, we can only jump to `i+x` or `i-x` if `arr[i]` is strictly greater than all elements between `i` and `i+x` (or `i-x`). This means that as we move away from `i` within the `d` range, the values must be strictly decreasing relative to `arr[i]`.
 * The check `arr[i] > arr[k]` for all `min(i, j) < k < max(i, j)` can be tricky. The problem statement clarifies: "you can only jump from index i to index j if arr[i] > arr[j] AND arr[i] > arr[k] for all indices k between i and j". This means `arr[i]` has to be the largest among `arr[i], arr[j]` AND all intermediate values.
 *
 * Corrected Intermediate Check Logic:
 * When jumping from `i` to `i+x`:
 *   We need `arr[i] > arr[i+x]`.
 *   We also need `arr[i] > arr[k]` for all `i < k < i+x`.
 *   This implies that `arr[i]` must be strictly greater than `arr[i+1]`, `arr[i+2]`, ..., `arr[i+x-1]`.
 *
 * The critical observation for the intermediate check:
 * When moving right from `i` to `i+x`, the condition `arr[i] > arr[k]` for `i < k < i+x` means that `arr[i]` must be greater than `arr[i+1]`, `arr[i+1]` must be greater than `arr[i+2]` (if `arr[i+1]` was the value at `i` for the next jump), and so on, up to `arr[i+x-1]`.
 * Essentially, as you take steps `i -> i+1 -> i+2 -> ... -> i+x`, the value of `arr` must be strictly decreasing at each step *from the perspective of `arr[i]`*.
 *
 * Example: `arr = [6,4,14,6,8,13,9,7,10,6,12], d = 2`
 * From index 10 (`arr[10] = 12`):
 *   Jump right:
 *     - To index 11? `10+1=11`, `11 < 11` (false). No jumps right.
 *   Jump left:
 *     - To index 9 (`arr[9] = 6`): `d=1`, `arr[10] > arr[9]` (12 > 6). No intermediate elements. Valid. `dfs(9)`
 *     - To index 8 (`arr[8] = 10`): `d=2`, `arr[10] > arr[8]` (12 > 10). Intermediate element at index 9: `arr[9]=6`. `arr[10] > arr[9]` (12 > 6). Valid. `dfs(8)`
 *
 * The core problem is that `arr[i] > arr[k]` for all `k` between `i` and `j`. This means that if we consider jumping from `i` to `j` where `j = i+x`, then `arr[i]` must be strictly greater than `arr[i+1]`, `arr[i+2]`, ..., `arr[i+x-1]`.
 * This implies that for a jump from `i` to `i+x`, all intermediate values `arr[i+1], ..., arr[i+x-1]` must be less than `arr[i]`.
 * Similarly, for a jump from `i` to `i-x`, all intermediate values `arr[i-1], ..., arr[i-x+1]` must be less than `arr[i]`.
 *
 * The state `dp[i]` represents the maximum number of visits *starting from index i*.
 * `dp[i] = 1 + max(dp[j])` where `j` is a valid next jump from `i`.
 *
 * The intermediate check can be simplified:
 * For a jump from `i` to `i+x` (where `1 <= x <= d`):
 *   We must have `arr[i] > arr[i+x]`.
 *   And for all `k` such that `i < k < i+x`, we must have `arr[i] > arr[k]`. This is a strong condition.
 *   This means that `arr[i]` must be the maximum in the segment `[i, i+x]`.
 *
 * Let's refine the DFS logic:
 * `dfs(i)`:
 *   If `memo[i]` is computed, return it.
 *   `max_visits_from_here = 0`
 *   // Explore right jumps
 *   For `j` from `i+1` to `min(n-1, i+d)`:
 *     // Check if arr[i] is strictly greater than all intermediate elements up to j
 *     `is_valid_intermediate = true`
 *     For `k` from `i+1` to `j-1`:
 *       If `arr[k] >= arr[i]`:
 *         `is_valid_intermediate = false`
 *         break
 *     If `is_valid_intermediate` and `arr[i] > arr[j]`:
 *       `max_visits_from_here = max(max_visits_from_here, dfs(j))`
 *
 *   // Explore left jumps
 *   For `j` from `i-1` to `max(0, i-d)`:
 *     // Check if arr[i] is strictly greater than all intermediate elements up to j
 *     `is_valid_intermediate = true`
 *     For `k` from `i-1` down to `j+1`:
 *       If `arr[k] >= arr[i]`:
 *         `is_valid_intermediate = false`
 *         break
 *     If `is_valid_intermediate` and `arr[i] > arr[j]`:
 *       `max_visits_from_here = max(max_visits_from_here, dfs(j))`
 *
 *   `memo[i] = 1 + max_visits_from_here`
 *   Return `memo[i]`
 *
 * This approach leads to O(N * D^2) time complexity because of the nested loop for intermediate checks.
 *
 * Can we optimize the intermediate check?
 * The condition `arr[i] > arr[k]` for all `min(i, j) < k < max(i, j)` is key.
 * This implies that if we are at `i`, we can jump to `i+x` (where `x <= d`) only if `arr[i] > arr[i+1]`, `arr[i] > arr[i+2]`, ..., `arr[i] > arr[i+x-1]`, AND `arr[i] > arr[i+x]`.
 *
 * Consider a jump from `i` to `i+x`. We need to check `arr[i] > arr[i+1], arr[i] > arr[i+2], ..., arr[i] > arr[i+x-1], arr[i] > arr[i+x]`.
 * This can be rephrased as: `arr[i]` must be strictly greater than all elements in the range `[i+1, i+x]`.
 *
 * Let's rethink the problem. If we are at index `i`, we can jump to `i+x` if `1 <= x <= d` AND `arr[i] > arr[i+x]` AND `arr[i]` is greater than all elements `arr[k]` where `i < k < i+x`.
 *
 * The condition is "arr[i] > arr[j] AND arr[i] > arr[k] for all indices k between i and j".
 *
 * Let's consider the example: arr = [6,4,14,6,8,13,9,7,10,6,12], d = 2
 * From index 10 (value 12):
 *   Can jump to index 9 (value 6)? `abs(10-9)=1 <= d`. `arr[10] > arr[9]` (12 > 6). No elements between 9 and 10. Valid.
 *   Can jump to index 8 (value 10)? `abs(10-8)=2 <= d`. `arr[10] > arr[8]` (12 > 10). Element between 8 and 10 is at index 9 (value 6). Is `arr[10] > arr[9]`? Yes, 12 > 6. Valid.
 *   Can jump to index 7 (value 7)? `abs(10-7)=3 > d`. Invalid jump distance.
 *
 * From index 8 (value 8):
 *   Can jump to index 7 (value 7)? `abs(8-7)=1 <= d`. `arr[8] > arr[7]` (8 > 7). No elements between 7 and 8. Valid.
 *   Can jump to index 6 (value 9)? `abs(8-6)=2 <= d`. `arr[8] > arr[6]` (8 > 9)? No. Invalid.
 *
 * From index 6 (value 9):
 *   Can jump to index 7 (value 7)? `abs(6-7)=1 <= d`. `arr[6] > arr[7]` (9 > 7). No elements between. Valid.
 *   Can jump to index 5 (value 13)? `abs(6-5)=1 <= d`. `arr[6] > arr[5]` (9 > 13)? No. Invalid.
 *   Can jump to index 4 (value 8)? `abs(6-4)=2 <= d`. `arr[6] > arr[4]` (9 > 8). Element between 4 and 6 is at index 5 (value 13). Is `arr[6] > arr[5]`? No, 9 < 13. Invalid.
 *
 * So, the condition "arr[i] > arr[k] for all indices k between i and j" means that `arr[i]` must be strictly greater than *all* elements in the open interval `(min(i, j), max(i, j))`.
 *
 * This constraint makes the problem tricky. If we jump from `i` to `i+x`, it implies that `arr[i] > arr[i+1]`, `arr[i] > arr[i+2]`, ..., `arr[i] > arr[i+x-1]`.
 * This doesn't mean `arr[i+1] > arr[i+2]`, etc.
 *
 * The O(N * D^2) approach is:
 * For each `i`:
 *   Iterate `x` from 1 to `d`:
 *     // Check jump to `i+x`
 *     If `i+x < n`:
 *       `valid_intermediate = true`
 *       For `k` from `i+1` to `i+x-1`:
 *         If `arr[k] >= arr[i]`:
 *           `valid_intermediate = false`
 *           break
 *       If `valid_intermediate` and `arr[i] > arr[i+x]`:
 *         `max_jumps = max(max_jumps, dfs(i+x))`
 *
 *     // Check jump to `i-x`
 *     If `i-x >= 0`:
 *       `valid_intermediate = true`
 *       For `k` from `i-1` down to `i-x+1`:
 *         If `arr[k] >= arr[i]`:
 *           `valid_intermediate = false`
 *           break
 *       If `valid_intermediate` and `arr[i] > arr[i-x]`:
 *         `max_jumps = max(max_jumps, dfs(i-x))`
 *
 * This is O(N * D^2) because for each of N states, we do D checks, and each check involves a loop up to D.
 *
 * Constraints: N <= 1000, D <= 1000. N*D^2 could be 1000 * 1000^2 = 10^9, too slow.
 * Wait, the maximum value of D is N. So it's O(N^3). This is definitely too slow.
 *
 * Let's re-read the condition carefully.
 * "You can only jump from index i to index j if arr[i] > arr[j] and arr[i] > arr[k] for all indices k between i and j (More formally min(i, j) < k < max(i, j))."
 *
 * This condition means that `arr[i]` must be strictly greater than *all* elements in the open interval `(min(i, j), max(i, j))`.
 *
 * The key insight might be how to efficiently find valid jumps.
 *
 * Let's consider the jumps from `i` to the right. We are looking for `j = i+x` where `1 <= x <= d`.
 * The condition `arr[i] > arr[k]` for `i < k < i+x` implies that `arr[i]` must be greater than all elements from `arr[i+1]` up to `arr[i+x-1]`.
 *
 * This is still O(N*D^2) if we iterate for each intermediate check.
 *
 * Maybe sorting helps? The problem mentions "Sorting" as a topic.
 * If we sort indices by their values, can we process them in increasing order of values?
 * Let's try sorting `arr` along with their original indices: `[[value, index], ...]`.
 * Sort this array by value in ascending order.
 *
 * When we process an index `i` (which has value `arr[i]`), all previously processed indices `p` had `arr[p] <= arr[i]`.
 * If we are at `i`, we are looking for jumps FROM `i` TO `j`. This means `arr[i]` must be greater than `arr[j]`.
 * If we sort by value in ascending order, and we are processing `arr[i]`, we cannot jump TO any of the indices `p` that we have already processed if `arr[i] <= arr[p]`.
 *
 * This sorting approach usually helps when the jump condition is `arr[i] > arr[j]` and we are trying to find such `j` efficiently.
 *
 * If we process indices in decreasing order of `arr[i]`, then when we consider `i`, any `j` that we can jump to will have `arr[j] < arr[i]`. This is good.
 *
 * Let's sort the indices based on `arr[i]` in decreasing order.
 * `indexed_arr = [[arr[i], i] for i in range(n)]`
 * `indexed_arr.sort(key=lambda x: x[0], reverse=True)`
 *
 * Now, iterate through `indexed_arr`. For each `(val, i)`:
 * We want to find `dp[i]`.
 * `dp[i] = 1 + max(dp[j])` where `j` is a valid jump from `i`.
 *
 * For a jump from `i` to `j`, we need `abs(i-j) <= d` AND `arr[i] > arr[j]` AND `arr[i] > arr[k]` for all `k` between `i` and `j`.
 *
 * Since we are processing in decreasing order of `arr` values, when we consider `i`, any `j` that is a potential jump destination will have `arr[j] < arr[i]`. This is because `j` would have been processed earlier if `arr[j] > arr[i]`, or at the same time if `arr[j] == arr[i]`. If `arr[j] < arr[i]`, `j` would have been processed before `i`.
 *
 * So, when processing `(val, i)`:
 * We need to find `j` such that `abs(i-j) <= d`, and the intermediate condition `arr[i] > arr[k]` for `min(i,j) < k < max(i,j)` holds.
 *
 * This intermediate condition is still the bottleneck.
 *
 * What if we iterate through `i` from 0 to `n-1` and use memoization?
 * `dp[i]` = max jumps starting from `i`.
 *
 * `dfs(i)`:
 *   If `memo[i]` is computed, return it.
 *   `max_val = 0`
 *   // Right jumps
 *   For `j` from `i+1` to `min(n-1, i+d)`:
 *     // Check if arr[i] is greater than all elements between i and j
 *     `is_valid = true`
 *     For `k` from `i+1` to `j-1`:
 *       If `arr[k] >= arr[i]`:
 *         `is_valid = false`
 *         break
 *     If `is_valid` and `arr[i] > arr[j]`:
 *       `max_val = max(max_val, dfs(j))`
 *
 *   // Left jumps
 *   For `j` from `i-1` to `max(0, i-d)`:
 *     // Check if arr[i] is greater than all elements between j and i
 *     `is_valid = true`
 *     For `k` from `i-1` down to `j+1`:
 *       If `arr[k] >= arr[i]`:
 *         `is_valid = false`
 *         break
 *     If `is_valid` and `arr[i] > arr[j]`:
 *       `max_val = max(max_val, dfs(j))`
 *
 *   `memo[i] = 1 + max_val`
 *   return `memo[i]`
 *
 * This is indeed O(N*D^2). Given N, D <= 1000, this is too slow.
 *
 * Is there a way to optimize the "check if arr[i] is greater than all elements between i and j" part?
 *
 * Consider the right jumps from `i`. We are looking for `j = i+x` where `1 <= x <= d`.
 * The condition is `arr[i] > arr[k]` for all `k` in `(i, i+x)`.
 *
 * This implies that if we have a sequence `i, i+1, i+2, ..., i+x`, then `arr[i]` must be greater than `arr[i+1]`, `arr[i]` must be greater than `arr[i+2]`, ..., `arr[i]` must be greater than `arr[i+x-1]`.
 *
 * Let's consider the DP state `dp[i]` as the maximum number of visited indices starting from index `i`.
 *
 * When we compute `dp[i]`:
 * We look for valid jumps to `j`.
 * A jump from `i` to `j` is valid if `abs(i-j) <= d` AND `arr[i] > arr[j]` AND `arr[i]` is strictly greater than ALL elements in `(min(i, j), max(i, j))`.
 *
 * Example: arr = [6,4,14,6,8,13,9,7,10,6,12], d = 2
 *
 * `dfs(10)` where `arr[10]=12`
 *  Right jumps: None within `d=2`.
 *  Left jumps:
 *   `j=9` (`arr[9]=6`): `abs(10-9)=1 <= d`. `arr[10] > arr[9]` (12>6). No intermediate. Valid. `dfs(9)` -> `1 + dfs(9)`
 *   `j=8` (`arr[8]=10`): `abs(10-8)=2 <= d`. `arr[10] > arr[8]` (12>10). Intermediate `k=9`, `arr[9]=6`. `arr[10] > arr[9]` (12>6). Valid. `dfs(8)` -> `1 + dfs(8)`
 *
 * `dfs(8)` where `arr[8]=8`
 *  Right jumps:
 *   `j=9` (`arr[9]=6`): `abs(8-9)=1 <= d`. `arr[8] > arr[9]` (8>6). No intermediate. Valid. `dfs(9)` -> `1 + dfs(9)`
 *   `j=10` (`arr[10]=12`): `abs(8-10)=2 <= d`. `arr[8] > arr[10]` (8>12)? No. Invalid.
 *  Left jumps:
 *   `j=7` (`arr[7]=7`): `abs(8-7)=1 <= d`. `arr[8] > arr[7]` (8>7). No intermediate. Valid. `dfs(7)` -> `1 + dfs(7)`
 *   `j=6` (`arr[6]=9`): `abs(8-6)=2 <= d`. `arr[8] > arr[6]` (8>9)? No. Invalid.
 *
 * The issue is that the constraint `arr[i] > arr[k]` for all `k` between `i` and `j` is very restrictive.
 *
 * Consider the structure of valid jumps.
 * If `i` can jump to `i+x`, then `arr[i]` must be strictly greater than `arr[i+1], arr[i+2], ..., arr[i+x-1]`.
 * This implies that if we are at index `i`, we can jump to `i+1` if `arr[i] > arr[i+1]`.
 * If `arr[i] > arr[i+1]` and `arr[i+1] > arr[i+2]`, then `arr[i]` is also greater than `arr[i+2]`.
 * But if `arr[i] > arr[i+1]` and `arr[i] > arr[i+2]`, it doesn't mean `arr[i+1] > arr[i+2]`.
 *
 * Let's assume the O(N*D^2) is the intended solution for now and try to implement it cleanly.
 * The maximum value of N is 1000, D is 1000. N*D^2 is too large.
 * Perhaps there is an optimization that is not obvious.
 *
 * Could it be related to Monotonic Stack/Queue for range maximum queries?
 * When we are at index `i`, we are looking for jumps to `j` where `abs(i-j) <= d`.
 * For right jumps `j = i+x` (`1 <= x <= d`), we need `arr[i] > arr[k]` for `i < k < i+x`.
 * This means `arr[i]` is the maximum in `arr[i+1...i+x-1]`.
 *
 * The state `dp[i]` depends on `dp[j]` where `j` is reachable from `i`.
 * This is a Directed Acyclic Graph (DAG) if we consider the jumps as edges.
 * The problem then becomes finding the longest path in this DAG.
 *
 * The condition `arr[i] > arr[k]` for all `min(i, j) < k < max(i, j)` implies that if we move away from `i`, the values must be strictly decreasing.
 *
 * Let's go back to the example: arr = [6,4,14,6,8,13,9,7,10,6,12], d = 2
 *
 * Jumps from 10 (12):
 * To 9 (6): `abs=1<=2`, `12>6`, no intermediate. OK. `dfs(9)`
 * To 8 (10): `abs=2<=2`, `12>10`, intermediate 9 (6). `12>6`. OK. `dfs(8)`
 *
 * Jumps from 8 (8):
 * To 7 (7): `abs=1<=2`, `8>7`, no intermediate. OK. `dfs(7)`
 * To 9 (6): `abs=1<=2`, `8>6`, no intermediate. OK. `dfs(9)`
 *
 * Jumps from 6 (9):
 * To 7 (7): `abs=1<=2`, `9>7`, no intermediate. OK. `dfs(7)`
 * To 5 (13): `abs=1<=2`, `9>13`? No.
 * To 4 (8): `abs=2<=2`, `9>8`, intermediate 5 (13). `9>13`? No.
 *
 * Jumps from 7 (7):
 * To 6 (9): `abs=1<=2`, `7>9`? No.
 * To 8 (8): `abs=1<=2`, `7>8`? No.
 *
 * This implies that `dfs(7)` will be 1.
 * `dfs(6)` will consider `dfs(7)`. So `dfs(6) = 1 + dfs(7) = 1 + 1 = 2`. (Path: 6 -> 7)
 *
 * Let's try to compute `dfs(i)` for all `i`.
 * `memo = [-1] * n`
 * `max_total_visits = 0`
 *
 * `dfs(i)`:
 *   If `memo[i] != -1`: return `memo[i]`
 *
 *   `max_next_visits = 0`
 *
 *   // Explore right jumps
 *   For `x` from 1 to `d`:
 *     `next_idx = i + x`
 *     If `next_idx >= n`: break
 *
 *     // Check intermediate elements
 *     `can_jump = true`
 *     For `k` from `i + 1` to `next_idx - 1`:
 *       If `arr[k] >= arr[i]`:
 *         `can_jump = false`
 *         break
 *
 *     If `can_jump` and `arr[i] > arr[next_idx]`:
 *       `max_next_visits = max(max_next_visits, dfs(next_idx))`
 *
 *   // Explore left jumps
 *   For `x` from 1 to `d`:
 *     `next_idx = i - x`
 *     If `next_idx < 0`: break
 *
 *     // Check intermediate elements
 *     `can_jump = true`
 *     For `k` from `i - 1` down to `next_idx + 1`:
 *       If `arr[k] >= arr[i]`:
 *         `can_jump = false`
 *         break
 *
 *     If `can_jump` and `arr[i] > arr[next_idx]`:
 *       `max_next_visits = max(max_next_visits, dfs(next_idx))`
 *
 *   `memo[i] = 1 + max_next_visits`
 *   return `memo[i]`
 *
 * Final answer is `max(dfs(i) for i in range(n))`.
 *
 * This O(N*D^2) approach will TLE.
 *
 * Let's consider the sorted approach again.
 * Sort indices by value in decreasing order.
 * `indexed_arr = [(arr[i], i) for i in range(n)]`
 * `indexed_arr.sort(key=lambda x: x[0], reverse=True)`
 *
 * `dp = [0] * n`
 * `max_visits = 0`
 *
 * For `val, i` in `indexed_arr`:
 *   `dp[i] = 1` // Minimum 1 visit (the current index itself)
 *   // Check right jumps
 *   For `x` from 1 to `d`:
 *     `j = i + x`
 *     If `j >= n`: break
 *
 *     // Check intermediate elements
 *     `valid_intermediate = True`
 *     For `k` from `i + 1` to `j - 1`:
 *       If `arr[k] >= arr[i]`: // If any intermediate is >= arr[i], then arr[i] cannot be the largest.
 *         `valid_intermediate = False`
 *         break
 *
 *     If `valid_intermediate` and `arr[i] > arr[j]`: // We need arr[i] > arr[j] as well. Since we process in decreasing order of arr, if arr[j] >= arr[i], it would have been processed already. So arr[j] < arr[i] is guaranteed if j was processed.
 *       // The condition `arr[i] > arr[j]` is implicitly handled by the sorting IF `j` has been processed and `arr[j] < arr[i]`.
 *       // However, if `arr[j] == arr[i]`, then `j` would be processed at the same time or after `i`.
 *       // The condition `arr[i] > arr[j]` is explicit and needed.
 *       // Also, since we sorted by decreasing value, and we are looking at `j` where `abs(i-j) <= d`, if `j` has already been processed, it means `arr[j] >= arr[i]`.
 *       // This contradicts `arr[i] > arr[j]`.
 *       // So, `j` must have NOT been processed yet, meaning `arr[j] < arr[i]`. This is guaranteed by sorting.
 *
 *       // Revisit the condition "arr[i] > arr[j] AND arr[i] > arr[k] for all indices k between i and j".
 *       // If we iterate through indices in decreasing order of `arr[i]`:
 *       // When we are at `(val_i, i)`, we are looking for `j` such that `abs(i-j) <= d`.
 *       // If `arr[j]` has already been computed (i.e., `dp[j] > 0`), it means `arr[j] >= val_i`.
 *       // If `arr[j] == val_i`, then `arr[i] > arr[j]` is false.
 *       // If `arr[j] > val_i`, then `arr[i] > arr[j]` is false.
 *       // So, a jump is only possible to an index `j` that has NOT been processed yet.
 *       // This means we can only jump to `j` where `arr[j] < arr[i]`.
 *       // This is guaranteed if `j` is not yet processed and `arr[j] != arr[i]`.
 *
 *       // The intermediate check `arr[i] > arr[k]` for `i < k < j` is the main thing.
 *       // This means `arr[i]` is the maximum in `arr[i+1...j-1]`.
 *       // If `dp[j]` is already computed, it means `arr[j]` was processed.
 *       // Since we are processing in decreasing order of values, if `dp[j]` is computed, it means `arr[j]` was processed earlier, so `arr[j] >= arr[i]`.
 *       // But we need `arr[i] > arr[j]` for a jump.
 *       // This implies we can only jump to indices `j` that are NOT YET PROCESSED.
 *
 *       // Let's refine this:
 *       // `dp[i]` = max visits STARTING from `i`.
 *       // For `val, i` in `indexed_arr`:
 *       //   `dp[i] = 1`
 *       //   Check right: `j = i+1...i+d`
 *       //     If `j < n`:
 *       //       Check intermediate: `arr[i] > arr[k]` for `i < k < j`.
 *       //       If `arr[i] > arr[j]` AND intermediate condition holds:
 *       //         // IMPORTANT: Since `arr[j]` might be equal to `arr[i]`, and if `arr[j] == arr[i]`, `j` might be processed at the same time or later.
 *       //         // If `j` has already been processed, it means `arr[j] >= arr[i]`.
 *       //         // If `arr[j] == arr[i]`, `arr[i] > arr[j]` is false.
 *       //         // If `arr[j] > arr[i]`, `arr[i] > arr[j]` is false.
 *       //         // So, we can only jump to `j` if `arr[j] < arr[i]`.
 *       //         // And if `arr[j] < arr[i]`, then `j` MUST have been processed already.
 *       //         `dp[i] = max(dp[i], 1 + dp[j])`
 *
 *       // This sorted approach seems to struggle with the intermediate condition when `j` has already been processed.
 *
 * What if we use a Segment Tree or Fenwick Tree for range maximum queries?
 *
 * Let's stick with the DFS + Memoization. The problem might be that N and D are up to 1000, but typical test cases might not hit the worst-case O(N*D^2) repeatedly.
 * Given the constraints, N=1000, D=1000. N*D is 10^6. N*D^2 is 10^9.
 * The O(N*D^2) must be wrong if N, D can both be large.
 *
 * Re-check the problem constraints and example:
 * `arr.length <= 1000`
 * `d <= arr.length`
 *
 * If D is small, say D=100, then N*D^2 = 1000 * 100^2 = 10^7, which is feasible.
 * But D can be as large as N.
 *
 * The crucial part is "arr[i] > arr[k] for all indices k between i and j".
 *
 * Consider a jump from `i` to `i+x`.
 * This requires `arr[i] > arr[i+1]`, `arr[i] > arr[i+2]`, ..., `arr[i] > arr[i+x-1]`.
 *
 * Let's look at the example where it says "You cannot jump to index 5 because 13 > 9."
 * `arr = [6,4,14,6,8,13,9,7,10,6,12], d = 2`
 * From index 6 (`arr[6]=9`):
 *   Target index 5 (`arr[5]=13`). `abs(6-5)=1 <= d`. `arr[6] > arr[5]` (9 > 13)? False. So this jump is invalid because `arr[i] > arr[j]` fails.
 *
 * "You cannot jump to index 4 because index 5 is between index 4 and 6 and 13 > 9."
 * From index 6 (`arr[6]=9`):
 *   Target index 4 (`arr[4]=8`). `abs(6-4)=2 <= d`. `arr[6] > arr[4]` (9 > 8)? True.
 *   Intermediate indices: `k=5`. `min(4,6)=4`, `max(4,6)=6`. So `4 < k < 6`. The only `k` is 5.
 *   Condition: `arr[i] > arr[k]` for all `k` between `i` and `j`.
 *   Here `i=6`, `j=4`. `arr[6] > arr[5]`? `9 > 13`? False.
 *   So the jump from 6 to 4 is invalid because `arr[6]` is NOT greater than `arr[5]`.
 *
 * This confirms my understanding of the intermediate check.
 *
 * The O(N*D^2) solution seems correct given the interpretation of the rules. The issue is its performance.
 *
 * If N=1000, D=1000, then N*D^2 is 10^9.
 * If N=1000, D=1, then N*D^2 = 1000, which is fine.
 * If N=10, D=10, then N*D^2 = 10*100 = 1000.
 *
 * Maybe the problem statement implies that intermediate elements cannot be GREATER THAN or EQUAL TO `arr[i]`.
 * "arr[i] > arr[k] for all indices k between i and j"
 * Yes, strictly greater.
 *
 * The O(N*D^2) solution:
 * Let's implement it and see if it passes within the typical time limits if test cases are not that strong.
 *
 * To optimize the intermediate check:
 * When checking right jumps from `i` to `i+x`, we need `arr[i] > arr[k]` for `i < k < i+x`.
 * This is equivalent to `arr[i]` being the maximum in the range `arr[i+1 ... i+x-1]`.
 * This can be optimized using a monotonic stack or segment tree.
 *
 * Let's consider the jumps from `i` to `i+x` (`1 <= x <= d`).
 * We need `arr[i] > arr[k]` for `i < k < i+x`.
 * This implies `arr[i+1] < arr[i]`, `arr[i+2] < arr[i]`, ..., `arr[i+x-1] < arr[i]`.
 *
 * If we find the first element `arr[m]` to the right of `i` such that `arr[m] >= arr[i]`, then we cannot jump past `m-1`.
 * So for right jumps from `i`, we only need to consider `j` in `[i+1, min(n-1, i+d)]` such that `arr[k] < arr[i]` for all `k` in `[i+1, j-1]`.
 *
 * Let `next_smaller_right[i]` be the index of the next element to the right of `i` that is greater than or equal to `arr[i]`.
 * Let `next_smaller_left[i]` be the index of the next element to the left of `i` that is greater than or equal to `arr[i]`.
 * These can be computed in O(N) using a monotonic stack.
 *
 * Using monotonic stack for `next_smaller_or_equal_right`:
 * `stack = []`
 * `next_smaller_or_equal_right = [n] * n` // Initialize with n (out of bounds)
 * For `i` from 0 to `n-1`:
 *   While `stack` is not empty and `arr[stack[-1]] <= arr[i]`:
 *     `prev_idx = stack.pop()`
 *     `next_smaller_or_equal_right[prev_idx] = i`
 *   `stack.append(i)`
 *
 * Using monotonic stack for `next_smaller_or_equal_left`:
 * `stack = []`
 * `next_smaller_or_equal_left = [-1] * n` // Initialize with -1 (out of bounds)
 * For `i` from `n-1` down to 0:
 *   While `stack` is not empty and `arr[stack[-1]] <= arr[i]`:
 *     `prev_idx = stack.pop()`
 *     `next_smaller_or_equal_left[prev_idx] = i`
 *   `stack.append(i)`
 *
 * Now, in `dfs(i)`:
 * `max_visits = 0`
 *
 * // Explore right jumps
 * // The first element >= arr[i] to the right is at `nsr_idx = next_smaller_or_equal_right[i]`.
 * // We can only jump to indices `j` such that `i < j < nsr_idx`.
 * // And `abs(i-j) <= d`. So `j` is in `[i+1, min(n-1, i+d)]`.
 * // Combining these: `j` is in `[i+1, min(nsr_idx - 1, i+d)]`.
 * For `j` from `i + 1` to `min(n - 1, i + d, next_smaller_or_equal_right[i] - 1)`:
 *   `max_visits = max(max_visits, dfs(j))`
 *
 * // Explore left jumps
 * // The first element >= arr[i] to the left is at `nsl_idx = next_smaller_or_equal_left[i]`.
 * // We can only jump to indices `j` such that `nsl_idx < j < i`.
 * // And `abs(i-j) <= d`. So `j` is in `[max(0, i-d), i-1]`.
 * // Combining these: `j` is in `[max(0, i-d, next_smaller_or_equal_left[i] + 1), i-1]`.
 * For `j` from `max(0, i - d, next_smaller_or_equal_left[i] + 1)` to `i - 1`:
 *   `max_visits = max(max_visits, dfs(j))`
 *
 * `memo[i] = 1 + max_visits`
 *
 * The time complexity for computing `next_smaller_or_equal_right/left` is O(N).
 * The DFS part: For each `i`, the loop for right jumps runs up to `d` times. The loop for left jumps runs up to `d` times.
 * Total time complexity of DFS is O(N * D).
 * Overall time complexity = O(N) (for monotonic stack) + O(N * D) (for DFS) = O(N * D).
 * Space complexity: O(N) for memoization array and stack.
 *
 * This O(N*D) approach should pass.
 *
 * Let's write down the improved DFS logic:
 *
 * 1. Precompute `next_smaller_or_equal_right` and `next_smaller_or_equal_left` using monotonic stacks.
 *    - For `next_smaller_or_equal_right[i]`: the index `k > i` such that `arr[k] >= arr[i]`, and `k` is minimized. If no such `k`, it's `n`.
 *    - For `next_smaller_or_equal_left[i]`: the index `k < i` such that `arr[k] >= arr[i]`, and `k` is maximized. If no such `k`, it's `-1`.
 *
 * 2. Initialize `memo` array with -1.
 *
 * 3. `dfs(i)` function:
 *    - If `memo[i]` is not -1, return `memo[i]`.
 *    - `max_next_jumps = 0`
 *    - // Right jumps: from `i+1` up to `min(i+d, n-1)`.
 *      // The jump destination `j` must also be less than `next_smaller_or_equal_right[i]`.
 *      // So, `j` is in range `[i+1, min(i+d, next_smaller_or_equal_right[i] - 1)]`.
 *      For `j` from `i+1` to `min(i+d, next_smaller_or_equal_right[i] - 1)`:
 *        `max_next_jumps = max(max_next_jumps, dfs(j))`
 *
 *    - // Left jumps: from `max(0, i-d)` up to `i-1`.
 *      // The jump destination `j` must also be greater than `next_smaller_or_equal_left[i]`.
 *      // So, `j` is in range `[max(0, i-d, next_smaller_or_equal_left[i] + 1), i-1]`.
 *      For `j` from `max(0, i-d, next_smaller_or_equal_left[i] + 1)` to `i-1`:
 *        `max_next_jumps = max(max_next_jumps, dfs(j))`
 *
 *    - `memo[i] = 1 + max_next_jumps`
 *    - Return `memo[i]`
 *
 * 4. Iterate `i` from 0 to `n-1`, call `dfs(i)`, and keep track of the overall maximum.
 *
 * This looks like the correct, optimized approach.
 *
 * Example: arr = [6,4,14,6,8,13,9,7,10,6,12], d = 2
 * n = 11
 *
 * Monotonic Stack for `next_smaller_or_equal_right`:
 * i=0, arr[0]=6. stack=[0]
 * i=1, arr[1]=4. stack=[0,1]
 * i=2, arr[2]=14. arr[1]<=14, pop 1. nse_r[1]=2. arr[0]<=14, pop 0. nse_r[0]=2. stack=[2]
 * i=3, arr[3]=6. arr[2]<=6? No. stack=[2,3]
 * i=4, arr[4]=8. arr[3]<=8, pop 3. nse_r[3]=4. arr[2]<=8? No. stack=[2,4]
 * i=5, arr[5]=13. arr[4]<=13, pop 4. nse_r[4]=5. arr[2]<=13, pop 2. nse_r[2]=5. stack=[5]
 * i=6, arr[6]=9. arr[5]<=9? No. stack=[5,6]
 * i=7, arr[7]=7. arr[6]<=7? No. stack=[5,6,7]
 * i=8, arr[8]=10. arr[7]<=10, pop 7. nse_r[7]=8. arr[6]<=10, pop 6. nse_r[6]=8. arr[5]<=10? No. stack=[5,8]
 * i=9, arr[9]=6. arr[8]<=6? No. stack=[5,8,9]
 * i=10, arr[10]=12. arr[9]<=12, pop 9. nse_r[9]=10. arr[8]<=12, pop 8. nse_r[8]=10. arr[5]<=12? No. stack=[5,10]
 * End of loop. Stack = [5, 10]. These elements don't have elements >= them to their right. So their nse_r remains n (11).
 * nse_r = [2, 2, 5, 4, 5, 11, 8, 8, 10, 10, 11]
 *
 * Monotonic Stack for `next_smaller_or_equal_left`:
 * i=10, arr[10]=12. stack=[10]
 * i=9, arr[9]=6. stack=[10,9]
 * i=8, arr[8]=10. arr[9]<=10, pop 9. nsel[9]=8. arr[10]<=10? No. stack=[10,8]
 * i=7, arr[7]=7. stack=[10,8,7]
 * i=6, arr[6]=9. arr[7]<=9, pop 7. nsel[7]=6. arr[8]<=9? No. stack=[10,8,6]
 * i=5, arr[5]=13. arr[6]<=13, pop 6. nsel[6]=5. arr[8]<=13, pop 8. nsel[8]=5. arr[10]<=13, pop 10. nsel[10]=5. stack=[5]
 * i=4, arr[4]=8. stack=[5,4]
 * i=3, arr[3]=6. stack=[5,4,3]
 * i=2, arr[2]=14. arr[3]<=14, pop 3. nsel[3]=2. arr[4]<=14, pop 4. nsel[4]=2. arr[5]<=14, pop 5. nsel[5]=2. stack=[2]
 * i=1, arr[1]=4. stack=[2,1]
 * i=0, arr[0]=6. arr[1]<=6, pop 1. nsel[1]=0. arr[2]<=6? No. stack=[2,0]
 * End of loop. Stack = [2,0]. These elements don't have elements >= them to their left. So their nsel remains -1.
 * nsel = [-1, 0, -1, 2, 2, 2, 5, 6, 5, 8, 5]
 *
 * Let's trace dfs(10) where arr[10]=12, nse_r[10]=11, nsel[10]=5. d=2.
 * memo = [-1] * 11
 *
 * dfs(10):
 *  max_next_jumps = 0
 *  Right jumps: j from 11 to min(10+2, 11-1, 11-1) = min(12, 10, 10) = 10. Loop range [11, 10] is empty. No right jumps.
 *  Left jumps: j from max(0, 10-2, 5+1) to 10-1. max(0, 8, 6) = 8. Range [8, 9].
 *    j=8: max_next_jumps = max(0, dfs(8))
 *    j=9: max_next_jumps = max(max_next_jumps, dfs(9))
 *
 * Need to compute dfs(8) and dfs(9) first. This is why memoization is key.
 *
 * Let's assume the O(N*D) approach is correct and implement it.
 */
function solve() {
    /**
     * @param {number[]} arr
     * @param {number} d
     * @return {number}
     */
    var maxJumps = function(arr, d) {
        const n = arr.length;
        // memo[i] stores the maximum number of indices visitable starting from index i.
        const memo = new Array(n).fill(-1);

        // Precompute next_smaller_or_equal_right and next_smaller_or_equal_left using monotonic stacks.
        // This optimization helps to limit the range of potential jump destinations,
        // effectively handling the condition `arr[i] > arr[k]` for all intermediate `k`.

        // next_smaller_or_equal_right[i] will store the index of the nearest element to the right of `i`
        // that has a value greater than or equal to arr[i]. If no such element exists, it's n.
        const next_smaller_or_equal_right = new Array(n).fill(n);
        let stack_right = []; // Stores indices in increasing order of their arr values.
        for (let i = 0; i < n; i++) {
            // While the stack is not empty and the current element is greater than or equal to
            // the element at the top of the stack, it means the current element is the
            // first element to the right that is >= the stack's top element.
            while (stack_right.length > 0 && arr[stack_right[stack_right.length - 1]] <= arr[i]) {
                const prev_idx = stack_right.pop();
                next_smaller_or_equal_right[prev_idx] = i;
            }
            stack_right.push(i);
        }

        // next_smaller_or_equal_left[i] will store the index of the nearest element to the left of `i`
        // that has a value greater than or equal to arr[i]. If no such element exists, it's -1.
        const next_smaller_or_equal_left = new Array(n).fill(-1);
        let stack_left = []; // Stores indices in increasing order of their arr values.
        for (let i = n - 1; i >= 0; i--) {
            // While the stack is not empty and the current element is greater than or equal to
            // the element at the top of the stack, it means the current element is the
            // first element to the left that is >= the stack's top element.
            while (stack_left.length > 0 && arr[stack_left[stack_left.length - 1]] <= arr[i]) {
                const prev_idx = stack_left.pop();
                next_smaller_or_equal_left[prev_idx] = i;
            }
            stack_left.push(i);
        }

        /**
         * Depth-First Search function with memoization to calculate the maximum number of jumps from a given index.
         * @param {number} currentIndex The index to start jumping from.
         * @returns {number} The maximum number of indices visitable starting from currentIndex.
         */
        const dfs = (currentIndex) => {
            // If the result for this index is already computed, return it.
            if (memo[currentIndex] !== -1) {
                return memo[currentIndex];
            }

            let maxVisitsFromHere = 0; // Stores the max number of visits from any possible next jump.

            // --- Explore right jumps ---
            // Possible jump destinations `j` must satisfy:
            // 1. `currentIndex + 1 <= j <= min(currentIndex + d, n - 1)` (within distance `d` and array bounds)
            // 2. `j < next_smaller_or_equal_right[currentIndex]` (ensures `arr[currentIndex] > arr[k]` for all `k` between `currentIndex` and `j`)
            const upperBoundRight = Math.min(currentIndex + d, next_smaller_or_equal_right[currentIndex] - 1);
            for (let j = currentIndex + 1; j <= upperBoundRight; j++) {
                // Recursively call dfs for the next index and update maxVisitsFromHere.
                maxVisitsFromHere = Math.max(maxVisitsFromHere, dfs(j));
            }

            // --- Explore left jumps ---
            // Possible jump destinations `j` must satisfy:
            // 1. `max(0, currentIndex - d) <= j <= currentIndex - 1` (within distance `d` and array bounds)
            // 2. `j > next_smaller_or_equal_left[currentIndex]` (ensures `arr[currentIndex] > arr[k]` for all `k` between `j` and `currentIndex`)
            const lowerBoundLeft = Math.max(currentIndex - d, next_smaller_or_equal_left[currentIndex] + 1);
            for (let j = lowerBoundLeft; j <= currentIndex - 1; j++) {
                // Recursively call dfs for the next index and update maxVisitsFromHere.
                maxVisitsFromHere = Math.max(maxVisitsFromHere, dfs(j));
            }

            // The total number of visits starting from currentIndex is 1 (for itself) plus the maximum visits from any next step.
            memo[currentIndex] = 1 + maxVisitsFromHere;
            return memo[currentIndex];
        };

        let overallMaxVisits = 0;
        // Calculate the maximum jumps starting from each index and find the overall maximum.
        for (let i = 0; i < n; i++) {
            overallMaxVisits = Math.max(overallMaxVisits, dfs(i));
        }

        return overallMaxVisits;
    };

    // The code above defines the function `maxJumps`.
    // To make it executable as a script, we need to call it with example inputs.
    // However, the prompt asks for ONLY the executable JavaScript code, so we will
    // return the function definition as is. The user will need to call it.

    return maxJumps;
}
// The function `solve` returns the `maxJumps` function.
// To run this code, you would typically do:
// const maxJumps = solve();
// console.log(maxJumps([6,4,14,6,8,13,9,7,10,6,12], 2)); // Output: 4
// console.log(maxJumps([3,3,3,3,3], 3)); // Output: 1
// console.log(maxJumps([7,6,5,4,3,2,1], 1)); // Output: 7
```