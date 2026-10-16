/*
Problem Summary:
Given an integer array `nums`, calculate the sum of squares of distinct counts for all possible subarrays. Return the result modulo 10^9 + 7.

Problem Link:
https://leetcode.com/problems/subarrays-distinct-element-sum-of-squares-ii/

Approach Explanation:
This problem asks for the sum of `(distinct_count)^2` for all subarrays. A direct O(N^3) or O(N^2) approach by iterating through all subarrays and calculating distinct counts will be too slow for N=10^5. We need a more efficient approach, likely O(N log N) or O(N).

Let `dp[j]` be the sum of distinct counts for all subarrays ending at index `j`. This is not quite what we need, as we need the sum of squares.
Let `d(i, j)` be the distinct count of subarray `nums[i..j]`. We want to calculate `sum_{0 <= i <= j < n} d(i, j)^2`.

Consider iterating through the right endpoint `j` from `0` to `n-1`. For each `j`, we want to calculate `sum_{0 <= i <= j} d(i, j)^2`.
When we extend a subarray `nums[i..j-1]` to `nums[i..j]`, the distinct count `d(i, j)` is either `d(i, j-1)` (if `nums[j]` is already in `nums[i..j-1]`) or `d(i, j-1) + 1` (if `nums[j]` is new).

Let's fix the right endpoint `j`. We want to calculate `sum_{0 <= i <= j} d(i, j)^2`.
The distinct count `d(i, j)` depends on `nums[j]` and its last occurrence before `j`.
Let `last_occurrence[x]` be the last index where value `x` appeared.
When we are at index `j`:
- For any `i` such that `last_occurrence[nums[j]] < i <= j`, `nums[j]` is a new distinct element in `nums[i..j]` compared to `nums[i..j-1]`. So, `d(i, j) = d(i, j-1) + 1`.
- For any `i` such that `0 <= i <= last_occurrence[nums[j]]`, `nums[j]` is not a new distinct element because it has already appeared at `last_occurrence[nums[j]]` or earlier. So, `d(i, j) = d(i, j-1)`. (Actually, `d(i, j)` will be equal to `d(i, j-1)` only if `nums[j]` was already present in `nums[i...j-1]`. If `last_occurrence[nums[j]] < i`, it IS new. If `last_occurrence[nums[j]] >= i`, then `nums[j]` was already present in `nums[i...j-1]`. So `d(i, j) = d(i, j-1)` in this case.)

Let's refine. `d(i, j)` is the number of unique elements in `nums[i...j]`.
For a fixed `j`, as `i` decreases from `j` to `0`, the distinct count `d(i, j)` is non-decreasing.
When `i` decreases past `last_occurrence[nums[k]]` for some `k` in `[i+1, j]`, then `nums[k]` effectively becomes a "new" element that has not been seen in `nums[i...j]` before `i`. This is hard to track.

A common strategy for problems involving sum of distinct counts or related properties is to use a data structure (like Fenwick tree or segment tree) to efficiently query and update counts over ranges.
We need `sum_{i=0 to j} d(i, j)^2`.
Let `count(i, j)` denote `d(i, j)`.
`count(i, j)^2 = (count(i, j-1) + 1)^2 = count(i, j-1)^2 + 2 * count(i, j-1) + 1` if `nums[j]` is new in `nums[i..j]`.
`count(i, j)^2 = count(i, j-1)^2` if `nums[j]` is not new in `nums[i..j]`.

Let `p = last_occurrence[nums[j]]`.
- For `i` in `[p+1, j]`: `nums[j]` is a new element. So `d(i, j) = d(i, j-1) + 1`.
- For `i` in `[0, p]`: `nums[j]` is not a new element. So `d(i, j) = d(i, j-1)`.

We need to maintain two sums for `i` in `[0, j]`:
1. `sum_squares = sum_{i=0 to j} d(i, j)^2`
2. `sum_counts = sum_{i=0 to j} d(i, j)`

When moving from `j-1` to `j`:
Let `p = last_occurrence[nums[j]]` (if `nums[j]` appeared before, else `p = -1`).
- For `i` in `[p+1, j]`:
  `d(i, j) = d(i, j-1) + 1`.
  `d(i, j)^2 = (d(i, j-1) + 1)^2 = d(i, j-1)^2 + 2 * d(i, j-1) + 1`.
- For `i` in `[0, p]`:
  `d(i, j) = d(i, j-1)`.
  `d(i, j)^2 = d(i, j-1)^2`.

We can use a segment tree. Each node in the segment tree will represent a range `[L, R]` of starting indices `i`.
A node `[L, R]` needs to store information to quickly update and query sums.
Specifically, for a range `[L, R]`, we need to query `sum_{k=L to R} d(k, j)^2` and `sum_{k=L to R} d(k, j)`.
When `nums[j]` is processed, we need to:
1. Update `d(i, j)` to `d(i, j-1) + 1` for `i` in `[p+1, j]`. This means adding 1 to `d(i, j-1)` for each `i` in this range.
2. For the newly added element `nums[j]` itself (which corresponds to `i=j`), `d(j, j) = 1`. This needs to be set.

Let the segment tree store for each range `[L, R]` of starting indices `i`:
- `S1`: `sum_{k=L to R} d(k, j)`
- `S2`: `sum_{k=L to R} d(k, j)^2`
- `lazy_add`: a lazy tag representing a value to be added to `d(k, j)` for all `k` in `[L, R]`.

When we update `d(k, j)` to `d(k, j) + V` for `k` in range `[L, R]`:
- `S1_new = S1_old + V * (R - L + 1)`
- `S2_new = sum_{k=L to R} (d(k, j) + V)^2`
  `= sum_{k=L to R} (d(k, j)^2 + 2 * V * d(k, j) + V^2)`
  `= S2_old + 2 * V * S1_old + V^2 * (R - L + 1)`

So, with a lazy propagation segment tree, we can:
1. For `i` in `[p+1, j-1]`: add 1 to `d(i, j-1)`. This is a range update `add(p+1, j-1, 1)`.
2. For `i = j`: `d(j, j) = 1`. This is a point update `set(j, 1)`.
   Actually, `d(j, j)` starts as 0. So adding 1 to `d(j, j-1)` means `d(j, j-1)` was 0, and now it becomes 1. This means the range `[p+1, j]` will have 1 added to `d(i, j-1)`.
   The `d(j, j-1)` for `j` itself refers to a conceptual array ending at `j-1`, which doesn't exist.
   So `d(j, j) = 1`.
   The elements in `[p+1, j-1]` are those whose distinct count increases by 1.
   The element at `j` itself has `d(j, j) = 1`.
   The distinct count of `d(i, j)` for `i` in `[0, p]` remains `d(i, j-1)`.

Let's maintain the `d(i, j)` values using a segment tree.
The segment tree will store `(S1, S2)` for ranges of `i`.
`S1` = sum of `d(i, j)`
`S2` = sum of `d(i, j)^2`
`lazy` = value to add to `d(i, j)`

Initialize segment tree with all `d(i, -1) = 0`. So `S1=0, S2=0` for all leaves.

Iterate `j` from `0` to `n-1`:
1. Get `prev_idx = last_occurrence[nums[j]]`. If `nums[j]` hasn't appeared, `prev_idx = -1`.
2. Update the segment tree:
   - For `i` in `[prev_idx + 1, j-1]`: `d(i, j) = d(i, j-1) + 1`. This is a range update. We call `update(prev_idx + 1, j-1, 1)`.
   - For `i = j`: `d(j, j) = 1`. This is a point set update. We call `update(j, j, 1)` or more accurately, `set(j, 1)`.
     When we are at index `j`, all `d(i, j-1)` for `i > j` are irrelevant.
     The `d(j,j)` is always 1. So we want to set `d(j,j)` to 1 in the segment tree.
     If we apply `update(prev_idx + 1, j, 1)`, it means `d(i, j)` for `i \in [prev_idx+1, j]` increases by 1 relative to `d(i, j-1)`.
     What is `d(j, j-1)`? This would be 0. So adding 1 correctly makes `d(j, j) = 1`.
     So we update range `[prev_idx + 1, j]` by adding 1. `segmentTree.rangeAdd(prev_idx + 1, j, 1)`.
3. After updates for current `j`, the segment tree roots contain `sum_{0 <= i <= j} d(i, j)` and `sum_{0 <= i <= j} d(i, j)^2`.
   The segment tree actually covers `[0, N-1]`. We want sums for `[0, j]`. So `query(0, j)`.
4. Add `query(0, j).S2` to total `ans`.
5. Update `last_occurrence[nums[j]] = j`.

Modulo arithmetic needs to be applied at each addition. `MOD = 10^9 + 7`.

Let's trace `nums = [1,2,1]`
N=3, MOD = 10^9 + 7
`last_occurrence = {}`
`ans = 0`

Segment Tree Initialization: `size = N`. All values (S1, S2, lazy) are 0.
Nodes represent `[0, N-1]`.

`j = 0`, `nums[0] = 1`:
  `prev_idx = last_occurrence[1]` (not found, so `-1`).
  Range to update: `[prev_idx + 1, j] = [-1 + 1, 0] = [0, 0]`.
  `segmentTree.rangeAdd(0, 0, 1)`.
  This sets `d(0, 0)` to `1`. `S1=1, S2=1`.
  `query(0, 0)` returns `(S1=1, S2=1)`.
  `ans = (ans + 1) % MOD = 1`.
  `last_occurrence[1] = 0`.

`j = 1`, `nums[1] = 2`:
  `prev_idx = last_occurrence[2]` (not found, so `-1`).
  Range to update: `[prev_idx + 1, j] = [-1 + 1, 1] = [0, 1]`.
  `segmentTree.rangeAdd(0, 1, 1)`.
  Before update:
  `d(0, 0) = 1`, `d(1, 0)` (conceptually 0 for element at index 1 for subarray ending at 0).
  Segment tree stores state after `j=0`. `d(0,0)=1`, and all other `d(i,0)=0`.
  `rangeAdd(0, 1, 1)`:
  - `i=0`: `d(0, 1) = d(0, 0) + 1 = 1 + 1 = 2`.
  - `i=1`: `d(1, 1) = d(1, 0) + 1 = 0 + 1 = 1`. (Base for `d(1,1)` is 0 because `j-1` is 0, so `d(1,0)` means subarray `nums[1..0]` which is empty. `d(1,1)` is actually always 1)
  So segment tree now has:
  `d(0,1) = 2`, `d(0,1)^2 = 4`.
  `d(1,1) = 1`, `d(1,1)^2 = 1`.
  `query(0, 1)` returns `(S1=3, S2=5)`.
  `ans = (ans + 5) % MOD = 1 + 5 = 6`.
  `last_occurrence[2] = 1`.

`j = 2`, `nums[2] = 1`:
  `prev_idx = last_occurrence[1]` (found, `0`).
  Range to update: `[prev_idx + 1, j] = [0 + 1, 2] = [1, 2]`.
  `segmentTree.rangeAdd(1, 2, 1)`.
  Before update (state from `j=1`):
  `d(0, 1) = 2`, `d(0, 1)^2 = 4`
  `d(1, 1) = 1`, `d(1, 1)^2 = 1`
  `d(2, 1) = 0`, `d(2, 1)^2 = 0` (conceptual)
  `rangeAdd(1, 2, 1)`:
  - `i=0`: `d(0, 2) = d(0, 1) = 2`. (Because `0 <= prev_idx = 0`). No change.
  - `i=1`: `d(1, 2) = d(1, 1) + 1 = 1 + 1 = 2`. (Because `1 > prev_idx = 0`).
  - `i=2`: `d(2, 2) = d(2, 1) + 1 = 0 + 1 = 1`. (Because `2 > prev_idx = 0`).
  So segment tree should reflect:
  `d(0, 2) = 2`, `d(0, 2)^2 = 4`
  `d(1, 2) = 2`, `d(1, 2)^2 = 4`
  `d(2, 2) = 1`, `d(2, 2)^2 = 1`
  `query(0, 2)` returns `(S1=5, S2=9)`.
  `ans = (ans + 9) % MOD = 6 + 9 = 15`.
  `last_occurrence[1] = 2`.

Final `ans = 15`. This matches example.

Segment Tree Structure:
Each node `idx` covering range `[L, R]` stores:
- `s1[idx]`: sum of `d(i, j)` for `i` in `[L, R]`
- `s2[idx]`: sum of `d(i, j)^2` for `i` in `[L, R]`
- `lazy[idx]`: value to be added to `d(i, j)` for all `i` in `[L, R]`

`push_down(idx, L, R)`:
  If `lazy[idx] != 0`:
    `val = lazy[idx]`
    `mid = floor((L+R)/2)`
    `len_left = mid - L + 1`
    `len_right = R - mid`

    // Update left child
    `s2[left_child] = (s2[left_child] + 2 * val * s1[left_child] + val * val % MOD * len_left) % MOD`
    `s1[left_child] = (s1[left_child] + val * len_left) % MOD`
    `lazy[left_child] = (lazy[left_child] + val) % MOD`

    // Update right child
    `s2[right_child] = (s2[right_child] + 2 * val * s1[right_child] + val * val % MOD * len_right) % MOD`
    `s1[right_child] = (s1[right_child] + val * len_right) % MOD`
    `lazy[right_child] = (lazy[right_child] + val) % MOD`
    `lazy[idx] = 0`

`update(idx, L, R, query_L, query_R, val)`:
  If `query_L <= L` and `R <= query_R`: (Current node fully within query range)
    `len = R - L + 1`
    `s2[idx] = (s2[idx] + 2 * val * s1[idx] + val * val % MOD * len) % MOD`
    `s1[idx] = (s1[idx] + val * len) % MOD`
    `lazy[idx] = (lazy[idx] + val) % MOD`
    return
  
  `push_down(idx, L, R)`
  `mid = floor((L+R)/2)`
  If `query_L <= mid`: `update(left_child, L, mid, query_L, query_R, val)`
  If `query_R > mid`: `update(right_child, mid+1, R, query_L, query_R, val)`
  
  `s1[idx] = (s1[left_child] + s1[right_child]) % MOD`
  `s2[idx] = (s2[left_child] + s2[right_child]) % MOD`

`query(idx, L, R, query_L, query_R)`:
  If `query_L <= L` and `R <= query_R`: (Current node fully within query range)
    return `(s1[idx], s2[idx])`
  
  `push_down(idx, L, R)`
  `mid = floor((L+R)/2)`
  `res_s1 = 0, res_s2 = 0`
  If `query_L <= mid`:
    `left_res = query(left_child, L, mid, query_L, query_R)`
    `res_s1 = (res_s1 + left_res.s1) % MOD`
    `res_s2 = (res_s2 + left_res.s2) % MOD`
  If `query_R > mid`:
    `right_res = query(right_child, mid+1, R, query_L, query_R)`
    `res_s1 = (res_s1 + right_res.s1) % MOD`
    `res_s2 = (res_s2 + right_res.s2) % MOD`
  
  return `(res_s1, res_s2)`

A slight correction in range for update:
When processing `j`:
`nums[j]` contributes `1` to `d(j, j)`.
`d(i, j)` for `i \in [prev_idx+1, j-1]` increases by 1.
`d(i, j)` for `i \in [0, prev_idx]` stays the same as `d(i, j-1)`.

Consider the effect of `nums[j]` on `d(i, j)`.
- If `nums[j]` hasn't appeared before `j` (i.e. `prev_idx = -1`), then for all `i \in [0, j]`, `nums[j]` is a new element compared to `nums[i..j-1]`. So `d(i, j) = d(i, j-1) + 1`. We update range `[0, j]` by adding 1.
- If `nums[j]` appeared at `prev_idx` (`prev_idx >= 0`), then:
    - For `i \in [prev_idx + 1, j]`: `nums[j]` is a new element in `nums[i..j]` compared to `nums[i..j-1]` (because `nums[j]` wasn't in `nums[i..j-1]`, as `prev_idx < i`). So `d(i, j) = d(i, j-1) + 1`. We update range `[prev_idx + 1, j]` by adding 1.
    - For `i \in [0, prev_idx]`: `nums[j]` is *not* a new element in `nums[i..j]` because it already appeared at `prev_idx` (which is in `[i, j-1]`). So `d(i, j) = d(i, j-1)`. No change for this range.

The segment tree will be `N` leaves, representing `i` from `0` to `N-1`.
`last_occurrence` stores `last_seen_index` for each number.
`max_val_in_nums = 10^5`, so `last_occurrence` map or array can be used.

The segment tree should be built for indices `0` to `N-1`.
The updates are `rangeAdd(L, R, val)` and queries are `query(0, j)`.

Let's double check the `push_down` modulo logic for negative numbers.
In JavaScript, `%` can result in negative numbers if the dividend is negative.
`A % MOD = (A % MOD + MOD) % MOD` is a safe way to ensure positive result.
This applies to sums, products, and powers.
For `(A + B) % MOD`, if A or B can be negative, need to adjust.
Here `s1`, `s2`, `lazy` are non-negative. `val` is always 1. So all sums will be positive.
`val * val % MOD` is also fine.

Time complexity:
`N` iterations for `j`.
Inside each iteration: `rangeAdd` takes `O(log N)` time. `query` takes `O(log N)` time.
Total time complexity: `O(N log N)`.
`N = 10^5`, `log N` is about `17`. `10^5 * 17` is around `1.7 * 10^6`, which is efficient enough.

Space complexity:
Segment tree stores `3 * 4 * N` elements (arrays for `s1`, `s2`, `lazy`, and for 4N nodes).
`last_occurrence` map stores up to `N` distinct elements or `10^5` if using an array for all possible values.
Total space complexity: `O(N)` or `O(MAX_VAL)` depending on `last_occurrence` implementation. Both are within limits.
`N` can be `10^5`, `MAX_VAL` can be `10^5`. So `O(N + MAX_VAL)`.

```javascript
/*
Problem Summary:
Given an integer array `nums`, calculate the sum of squares of distinct counts for all possible subarrays. Return the result modulo 10^9 + 7.

Problem Link:
https://leetcode.com/problems/subarrays-distinct-element-sum-of-squares-ii/

Approach Explanation:
The problem asks to calculate `sum_{0 <= i <= j < n} d(i, j)^2` where `d(i, j)` is the number of distinct elements in `nums[i..j]`. This needs to be done modulo 10^9 + 7.

A direct O(N^2) or O(N^3) approach is too slow for N=10^5. We use a sweep-line approach combined with a segment tree. We iterate through the right endpoint `j` from `0` to `n-1`. For each `j`, we want to sum `d(i, j)^2` for all `0 <= i <= j`.

Let `d(i, k)` be the distinct count for subarray `nums[i..k]`.
When we move from `j-1` to `j`, we need to update the `d(i, j-1)` values to `d(i, j)` for all `i`.
Specifically, for a fixed `j`:
1. Find `prev_idx = last_occurrence[nums[j]]`, the last index where `nums[j]` appeared before `j`. If `nums[j]` has not appeared before, `prev_idx = -1`.
2. For `i` in the range `[prev_idx + 1, j]`: `nums[j]` is a new distinct element in `nums[i..j]` compared to `nums[i..j-1]`. Thus, `d(i, j) = d(i, j-1) + 1`. (Note: `d(j, j-1)` is conceptually 0, so `d(j, j) = 1` which is correct).
3. For `i` in the range `[0, prev_idx]`: `nums[j]` is not a new distinct element in `nums[i..j]` because it already appeared at `prev_idx` within `nums[i..j-1]`. Thus, `d(i, j) = d(i, j-1)`. No change for these `d` values.

We use a segment tree to efficiently maintain and update the sums. Each leaf node `i` in the segment tree stores information about `d(i, j)`. A segment tree node for range `[L, R]` stores:
- `S1`: The sum of `d(k, j)` for `k` in `[L, R]`.
- `S2`: The sum of `d(k, j)^2` for `k` in `[L, R]`.
- `lazy`: A value to be added to `d(k, j)` for all `k` in `[L, R]` (lazy propagation tag).

When we add `val` to `d(k, j)` for all `k` in a range `[L, R]`:
- The new `S1` becomes `S1_old + val * (R - L + 1)`.
- The new `S2` becomes `sum_{k=L to R} (d(k, j) + val)^2 = sum_{k=L to R} (d(k, j)^2 + 2*val*d(k, j) + val^2)`.
  This simplifies to `S2_old + 2*val*S1_old + val^2 * (R - L + 1)`.
All operations are performed modulo `10^9 + 7`.

Algorithm steps:
1. Initialize `ans = 0` and `MOD = 10^9 + 7`.
2. Create a `last_occurrence` map (or array) to store the last seen index for each number. Initialize it empty.
3. Initialize a segment tree for indices `0` to `N-1`. All `S1`, `S2`, `lazy` values in the tree nodes are initially `0`.
4. Iterate `j` from `0` to `n-1`:
   a. Get `val = nums[j]`.
   b. Get `prev_idx = last_occurrence[val]`. If `val` has not been seen, `prev_idx` is conceptually `-1`.
   c. Perform a range update on the segment tree: `segmentTree.rangeAdd(prev_idx + 1, j, 1)`. This efficiently adds `1` to `d(i, j)` for all `i` in `[prev_idx + 1, j]`, updating `S1` and `S2` in affected nodes.
   d. Query the segment tree for the range `[0, j]`. Get the `S2` value, which is `sum_{0 <= i <= j} d(i, j)^2`.
   e. Add this `S2` value to `ans`: `ans = (ans + S2) % MOD`.
   f. Update `last_occurrence[val] = j`.
5. Return `ans`.

Time Complexity: O(N log N)
- N iterations for `j`.
- Each iteration involves a `rangeAdd` operation and a `query` operation on the segment tree, both taking `O(log N)` time.
- Map operations (`last_occurrence`) take `O(1)` average time.
- Total time: `N * (O(log N) + O(log N)) = O(N log N)`.

Space Complexity: O(N + M)
- Segment tree uses `O(N)` space (roughly `4*N` nodes for `s1`, `s2`, `lazy` arrays).
- `last_occurrence` map uses `O(M)` space where `M` is the number of distinct elements in `nums` (at most N) or `MAX_VAL_IN_NUMS` if using an array. Given `MAX_VAL_IN_NUMS <= 10^5`, this is `O(N + MAX_VAL_IN_NUMS)`.
*/

/**
 * @param {number[]} nums
 * @return {number}
 */
var sumCounts = function(nums) {
    const N = nums.length;
    const MOD = 10**9 + 7;

    // Segment tree implementation
    // Each node in the segment tree represents a range [L, R] of starting indices i.
    // s1[idx]: sum of d(k, j) for k in [L, R]
    // s2[idx]: sum of d(k, j)^2 for k in [L, R]
    // lazy[idx]: value to be added to d(k, j) for all k in [L, R]
    const s1 = new Array(4 * N).fill(0);
    const s2 = new Array(4 * N).fill(0);
    const lazy = new Array(4 * N).fill(0);

    // Helper function to push down lazy tag to children
    // idx: current node index
    // L, R: range covered by current node
    function pushDown(idx, L, R) {
        if (lazy[idx] !== 0 && L !== R) { // If there's a lazy tag and it's not a leaf node
            const val = lazy[idx];
            const mid = Math.floor((L + R) / 2);

            // Left child: range [L, mid]
            const lenLeft = mid - L + 1;
            // new_s2 = old_s2 + 2*val*old_s1 + val^2*len
            s2[2 * idx] = (s2[2 * idx] + 2 * val * s1[2 * idx] + (1 * val * val) % MOD * lenLeft) % MOD;
            // new_s1 = old_s1 + val*len
            s1[2 * idx] = (s1[2 * idx] + val * lenLeft) % MOD;
            // Propagate lazy tag
            lazy[2 * idx] = (lazy[2 * idx] + val) % MOD;

            // Right child: range [mid+1, R]
            const lenRight = R - mid;
            s2[2 * idx + 1] = (s2[2 * idx + 1] + 2 * val * s1[2 * idx + 1] + (1 * val * val) % MOD * lenRight) % MOD;
            s1[2 * idx + 1] = (s1[2 * idx + 1] + val * lenRight) % MOD;
            lazy[2 * idx + 1] = (lazy[2 * idx + 1] + val) % MOD;

            lazy[idx] = 0; // Clear lazy tag for current node
        }
    }

    // Helper function to update segment tree nodes
    // idx: current node index
    // L, R: range covered by current node
    // queryL, queryR: range to update
    // val: value to add to distinct counts
    function rangeAdd(idx, L, R, queryL, queryR, val) {
        // If current node's range is outside the query range, do nothing
        if (R < queryL || L > queryR) {
            return;
        }

        // If current node's range is fully within the query range
        if (queryL <= L && R <= queryR) {
            const len = R - L + 1;
            s2[idx] = (s2[idx] + 2 * val * s1[idx] + (1 * val * val) % MOD * len) % MOD;
            s1[idx] = (s1[idx] + val * len) % MOD;
            lazy[idx] = (lazy[idx] + val) % MOD;
            return;
        }

        // Push down lazy tag before recursing
        pushDown(idx, L, R);

        const mid = Math.floor((L + R) / 2);
        // Recurse for left child
        rangeAdd(2 * idx, L, mid, queryL, queryR, val);
        // Recurse for right child
        rangeAdd(2 * idx + 1, mid + 1, R, queryL, queryR, val);

        // Update current node's sums from children
        s1[idx] = (s1[2 * idx] + s1[2 * idx + 1]) % MOD;
        s2[idx] = (s2[2 * idx] + s2[2 * idx + 1]) % MOD;
    }

    // Helper function to query segment tree
    // idx: current node index
    // L, R: range covered by current node
    // queryL, queryR: range to query
    // Returns an object { S1: sum_counts, S2: sum_squares }
    function query(idx, L, R, queryL, queryR) {
        // If current node's range is outside the query range
        if (R < queryL || L > queryR) {
            return { S1: 0, S2: 0 };
        }

        // If current node's range is fully within the query range
        if (queryL <= L && R <= queryR) {
            return { S1: s1[idx], S2: s2[idx] };
        }

        // Push down lazy tag before recursing
        pushDown(idx, L, R);

        const mid = Math.floor((L + R) / 2);
        // Recurse for left child
        const leftRes = query(2 * idx, L, mid, queryL, queryR);
        // Recurse for right child
        const rightRes = query(2 * idx + 1, mid + 1, R, queryL, queryR);

        // Combine results from children
        return {
            S1: (leftRes.S1 + rightRes.S1) % MOD,
            S2: (leftRes.S2 + rightRes.S2) % MOD
        };
    }

    let totalAns = 0;
    // Using a Map for last_occurrence as numbers can be sparse and up to 10^5
    const lastOccurrence = new Map();

    for (let j = 0; j < N; j++) {
        const val = nums[j];
        // Get the last index where 'val' appeared. If not found, use -1.
        const prevIdx = lastOccurrence.has(val) ? lastOccurrence.get(val) : -1;

        // Update segment tree for range [prevIdx + 1, j].
        // For i in this range, nums[j] is a new distinct element,
        // so d(i,j) = d(i, j-1) + 1. We add 1 to these counts.
        // The segment tree covers indices 0 to N-1.
        rangeAdd(1, 0, N - 1, prevIdx + 1, j, 1);

        // Query the segment tree for the sum of squares of distinct counts for all
        // subarrays ending at j, i.e., for ranges [0, j].
        const currentQueryRes = query(1, 0, N - 1, 0, j);
        totalAns = (totalAns + currentQueryRes.S2) % MOD;

        // Update the last occurrence of the current value
        lastOccurrence.set(val, j);
    }

    return totalAns;
};
```