/*
Problem Summary:
Given an array `nums`, `x`, and `k`, find the minimum operations to make at least `k` non-overlapping subarrays of size `x` such that all elements within each subarray are equal. An operation consists of increasing or decreasing an element by 1.

Problem Link:
https://leetcode.com/problems/minimum-operations-to-make-elements-within-k-subarrays-equal/

Approach Explanation:
This problem can be modeled as a dynamic programming problem. We need to find `k` non-overlapping subarrays of size `x`.
Let `dp[i]` be the minimum cost to form `i` subarrays.
The state transition would be `dp[i] = min(dp[i], dp[i-1] + cost_of_new_subarray)`. However, this doesn't directly handle the non-overlapping constraint.

A more suitable DP state is `dp[i][j]`, representing the minimum cost to form `j` subarrays using elements up to index `i-1`.
`dp[i][j]` = minimum cost to form `j` subarrays using elements from `nums[0...i-1]`.
To compute `dp[i][j]`, we have two choices:
1. Don't form a subarray ending at `i-1`. In this case, `dp[i][j] = dp[i-1][j]`.
2. Form a subarray ending at `i-1`. This subarray would be `nums[i-x...i-1]`. If we form this subarray, we must have previously formed `j-1` subarrays using elements from `nums[0...i-x-1]`. So, `dp[i][j] = dp[i-x][j-1] + cost(nums[i-x...i-1])`.
Combining these, `dp[i][j] = min(dp[i-1][j], dp[i-x][j-1] + cost(nums[i-x...i-1]))`.
The base cases are `dp[0][0] = 0` and all other `dp[0][j]` or `dp[i][0]` for `i < x` are `Infinity`.
The final answer would be `min(dp[i][k])` for `i` from `k*x` to `n`.

The cost of making all elements in a subarray `nums[s...e]` equal is the sum of absolute differences between each element and their median. If `x` is the size of the subarray, we sort the subarray, find its median, and calculate the sum of `abs(num - median)`. This is a standard problem.

Precomputing costs:
We can precompute the cost for every possible subarray of size `x`. Let `costs[p]` be the cost for the subarray `nums[p...p+x-1]`.
To efficiently calculate costs, we can use a sliding window approach with a min-priority queue and a max-priority queue (or two balanced heaps/multisets) to maintain the median in `O(log x)` per slide. Or, since `x` can be up to `n`, sorting takes `O(x log x)`.
A more efficient approach for sliding window median sum:
For a window `[p, p+x-1]`, to make all elements equal to `m`, the cost is `sum(abs(nums[i] - m))` for `i` in the window. This cost is minimized when `m` is the median of `nums[p...p+x-1]`.
When the window slides from `[p, p+x-1]` to `[p+1, p+x]`:
1. `nums[p]` leaves the window.
2. `nums[p+x]` enters the window.
We need to efficiently update the median and the sum of absolute differences. This can be done using two heaps: a max-heap for the lower half elements and a min-heap for the upper half elements.
Let `L` be the max-heap (elements <= median) and `R` be the min-heap (elements >= median).
`L` will have `ceil(x/2)` elements and `R` will have `floor(x/2)` elements.
The median will be `L.peek()`.
When we add an element `v`:
If `v <= L.peek()`, add to `L`. Else, add to `R`.
Then rebalance: if `L.size() > R.size() + 1`, move `L.pop()` to `R`. If `R.size() > L.size()`, move `R.pop()` to `L`.
The cost contribution of `L` is `L.size() * median - sum(L_elements)`.
The cost contribution of `R` is `sum(R_elements) - R.size() * median`.
The total cost is `(L.size() * median - sum(L_elements)) + (sum(R_elements) - R.size() * median)`.
This requires maintaining sums for both heaps.

Let's refine the cost calculation.
`nums[i-x ... i-1]`
Let `v_j = nums[j]` be the value at index `j`.
`dp[i][j]` is the minimum cost to form `j` subarrays using elements `nums[0...i-1]`.
The values of `i` range from `0` to `n`. The values of `j` range from `0` to `k`.
`dp` table size: `(n+1) * (k+1)`.
Initialization: `dp[0][0] = 0`, all other `dp[i][j] = Infinity`.

The cost calculation using two heaps and maintaining sums:
`sumL` = sum of elements in `L`
`sumR` = sum of elements in `R`
`median` = `L.peek()`
Cost for current window `W`: `(L.size() * median - sumL) + (sumR - R.size() * median)`.

For adding `val`:
If `L` is empty or `val <= L.peek()`, `L.push(val)`, `sumL += val`.
Else, `R.push(val)`, `sumR += val`.
Rebalance:
While `L.size() > R.size() + 1`: `move = L.pop()`, `sumL -= move`, `R.push(move)`, `sumR += move`.
While `R.size() > L.size()`: `move = R.pop()`, `sumR -= move`, `L.push(move)`, `sumL += move`.

For removing `val`:
We need to know which heap `val` was in.
If `val <= L.peek()` (or `val` was in `L`): `L.remove(val)`, `sumL -= val`.
Else (`val` was in `R`): `R.remove(val)`, `sumR -= val`.
Removing from a heap is `O(log X)` if the heap supports it. Standard JS heaps don't. We'd need a custom implementation with a hash map to track element positions or use a data structure like a balanced BST (e.g., Treap, Red-Black Tree) which provides `O(log X)` insert, delete, and median/sum queries.
Since `k` is small (`15`), `n` is large (`10^5`), `x` is large (`10^5`).
The `O(N * K * X)` DP approach is too slow. `O(N * K * log X)` with sliding window for cost calc is also too slow (`10^5 * 15 * log(10^5)` is `1.5 * 10^6 * 17` approx `2.5 * 10^7` which might be acceptable if constant factors are small).

Let's check the constraints again: `k <= 15`. This strongly suggests that `k` is part of the polynomial factor, e.g., `O(N * K)` or `O(N * K * log N)`.
The `x` term for cost calculation:
A simple way to compute `cost(nums[start...end])` is to create a subarray, sort it, and calculate cost. This is `O(x log x)`.
If we compute `N-x+1` such costs, it would be `O(N * x log x)`. This is too slow.

We need an `O(N log X)` or `O(N log N)` solution for precomputing costs.
The two-heap approach with sum tracking is `O(log X)` for add/remove IF the heaps support `remove(value)`.
JavaScript's built-in `Set` or `Map` can track counts and then `add`/`remove` in `O(log X)` using `SortedList` or similar.
A `SortedList` (like Java's `TreeMap` or `TreeSet`) would support `add`, `remove`, `get_kth_element`, `sum_range` in `O(log X)`. With a custom `SortedList` implementation, we can make the median calculation `O(log X)`.

Let's define a `SortedList` class using a balanced binary search tree or by simulating it with a segment tree/Fenwick tree if values are within a limited range. Values are `-10^6` to `10^6`, so `2*10^6` range. This is feasible with a segment tree/Fenwick tree.
A segment tree can support:
- `add(val, count)`: `O(log MAX_VAL)`
- `remove(val, count)`: `O(log MAX_VAL)`
- `query_kth(k)`: `O(log MAX_VAL)` (for median)
- `query_sum(range)`: `O(log MAX_VAL)`
`MAX_VAL` would be `2 * 10^6`. `log(2*10^6)` is about `21`.
So, each window operation (add/remove) would be `O(log MAX_VAL)`. Precomputing all costs would be `O(N log MAX_VAL)`.

Let `MAX_COORD = 10^6`. All `nums[i]` are in `[-MAX_COORD, MAX_COORD]`.
We can use coordinate compression or shift values to `[0, 2 * MAX_COORD]`. Let's shift by `MAX_COORD`.
`val_shifted = val + MAX_COORD`.
Now values are in `[0, 2 * MAX_COORD]`. Let `M = 2 * MAX_COORD + 1`.

A `SegmentTree` for `count` and `sum`:
Nodes will store `count` and `sum_of_values`.
`update(idx, delta_count, delta_sum)`: `O(log M)`
`query_kth(k)`: find the `k`-th smallest element. `O(log M)`.
`query_sum_less_than(val)`: sum of elements less than `val`. `O(log M)`.
`query_sum_greater_than(val)`: sum of elements greater than `val`. `O(log M)`.

`SegmentTree` implementation:
Each node `[L, R]` stores `count` (number of elements in `[L, R]`) and `sum` (sum of elements in `[L, R]`).
`update(node, range_low, range_high, target_val_shifted, delta_count, delta_sum)`:
- Base case: `range_low == range_high == target_val_shifted`. Update `node.count` and `node.sum`.
- Recursive step: Recurse on left/right child based on `target_val_shifted`. Update `node.count` and `node.sum` from children.
`findKth(node, range_low, range_high, k)`:
- Base case: `range_low == range_high`. This is the `k`-th value. Return `range_low`.
- Recursive step: If `k <= left_child.count`, recurse left. Else, recurse right with `k - left_child.count`.

Window cost calculation using `SegmentTree`:
Initialize `SegmentTree` of size `M`.
`current_size = 0`
`current_total_sum = 0`
For `i = 0` to `n-1`:
  `add(nums[i])`:
    `val_shifted = nums[i] + MAX_COORD`.
    `segmentTree.update(val_shifted, 1, val_shifted)`. (Here `val_shifted` is the value to update, not `delta_sum`)
    `current_size++`.
    `current_total_sum += nums[i]`.
  If `current_size == x`:
    `median_shifted_idx = segmentTree.findKth(floor((x+1)/2))`. (k-th element, 1-indexed)
    `median = median_shifted_idx - MAX_COORD`.
    `sum_less = segmentTree.query_sum_less_than(median_shifted_idx)`.
    `count_less = segmentTree.query_count_less_than(median_shifted_idx)`.
    `sum_equal = median * segmentTree.query_count_equal_to(median_shifted_idx)`.
    `count_equal = segmentTree.query_count_equal_to(median_shifted_idx)`.
    `sum_greater = segmentTree.query_sum_greater_than(median_shifted_idx)`.
    `count_greater = segmentTree.query_count_greater_than(median_shifted_idx)`.

    Cost = `(count_less * median - sum_less) + (sum_greater - count_greater * median)`.
    This formula needs careful handling of elements equal to median.
    Correct formula:
    `k_th = floor((x+1)/2)`. `median_shifted = segmentTree.findKth(k_th)`. `median_val = median_shifted - MAX_COORD`.
    `count_less_eq_median = segmentTree.query_count_less_eq_than(median_shifted)`.
    `sum_less_eq_median = segmentTree.query_sum_less_eq_than(median_shifted)`.
    `count_greater_eq_median = segmentTree.query_count_greater_eq_than(median_shifted)`. (or simply `x - count_less_eq_median`)
    `sum_greater_eq_median = current_total_sum - sum_less_eq_median + median_val`. (this is tricky, current_total_sum is all elements, not just those greater than median)

    A more robust way:
    `k_th_val = segmentTree.findKth(ceil(x/2))` (this gives median for even/odd x, let's say 1-indexed for now).
    Let's use 1-indexed `k_th_val = segmentTree.findKth(floor((x+1)/2))`. This finds the median.
    `median = k_th_val - MAX_COORD`.
    `count_lt_median = segmentTree.query_count(0, k_th_val - 1)`.
    `sum_lt_median = segmentTree.query_sum(0, k_th_val - 1)`.
    `count_gt_median = segmentTree.query_count(k_th_val + 1, M-1)`.
    `sum_gt_median = segmentTree.query_sum(k_th_val + 1, M-1)`.
    `cost_for_window = (count_lt_median * median - sum_lt_median) + (sum_gt_median - count_gt_median * median)`.
    This `cost_for_window` should be stored at `costs[i-x+1]` where `i-x+1` is the starting index of the window.

    After calculating cost, `remove(nums[i-x+1])`:
      `val_shifted_to_remove = nums[i-x+1] + MAX_COORD`.
      `segmentTree.update(val_shifted_to_remove, -1, -val_shifted_to_remove)`.
      `current_size--`.
      `current_total_sum -= nums[i-x+1]`.
  The `MAX_COORD` is `10^6`. `M = 2 * 10^6 + 1`. This works.

SegmentTree for counts and sums:
```javascript
class Node {
    constructor() {
        this.count = 0;
        this.sum = 0;
    }
}

class SegmentTree {
    constructor(maxVal) {
        this.maxVal = maxVal; // Max coordinate value in the shifted range
        this.tree = Array(4 * maxVal).fill(null).map(() => new Node());
    }

    // Update value at index `idx` by `delta_count` and `delta_sum_value`
    // `delta_sum_value` should be `delta_count * original_val`
    update(nodeIdx, rangeLow, rangeHigh, targetIdx, deltaCount, deltaSumValue) {
        if (rangeLow === rangeHigh) {
            this.tree[nodeIdx].count += deltaCount;
            this.tree[nodeIdx].sum += deltaSumValue;
            return;
        }

        const mid = Math.floor((rangeLow + rangeHigh) / 2);
        if (targetIdx <= mid) {
            this.update(2 * nodeIdx, rangeLow, mid, targetIdx, deltaCount, deltaSumValue);
        } else {
            this.update(2 * nodeIdx + 1, mid + 1, rangeHigh, targetIdx, deltaCount, deltaSumValue);
        }
        this.tree[nodeIdx].count = this.tree[2 * nodeIdx].count + this.tree[2 * nodeIdx + 1].count;
        this.tree[nodeIdx].sum = this.tree[2 * nodeIdx].sum + this.tree[2 * nodeIdx + 1].sum;
    }

    // Find the k-th smallest element (1-indexed k)
    findKth(nodeIdx, rangeLow, rangeHigh, k) {
        if (rangeLow === rangeHigh) {
            return rangeLow;
        }

        const mid = Math.floor((rangeLow + rangeHigh) / 2);
        if (k <= this.tree[2 * nodeIdx].count) {
            return this.findKth(2 * nodeIdx, rangeLow, mid, k);
        } else {
            return this.findKth(2 * nodeIdx + 1, mid + 1, rangeHigh, k - this.tree[2 * nodeIdx].count);
        }
    }

    // Query sum of elements in a given range [queryLow, queryHigh]
    querySum(nodeIdx, rangeLow, rangeHigh, queryLow, queryHigh) {
        if (queryLow > rangeHigh || queryHigh < rangeLow) {
            return 0;
        }
        if (queryLow <= rangeLow && rangeHigh <= queryHigh) {
            return this.tree[nodeIdx].sum;
        }

        const mid = Math.floor((rangeLow + rangeHigh) / 2);
        return this.querySum(2 * nodeIdx, rangeLow, mid, queryLow, queryHigh) +
               this.querySum(2 * nodeIdx + 1, mid + 1, rangeHigh, queryLow, queryHigh);
    }

    // Query count of elements in a given range [queryLow, queryHigh]
    queryCount(nodeIdx, rangeLow, rangeHigh, queryLow, queryHigh) {
        if (queryLow > rangeHigh || queryHigh < rangeLow) {
            return 0;
        }
        if (queryLow <= rangeLow && rangeHigh <= queryHigh) {
            return this.tree[nodeIdx].count;
        }

        const mid = Math.floor((rangeLow + rangeHigh) / 2);
        return this.queryCount(2 * nodeIdx, rangeLow, mid, queryLow, queryHigh) +
               this.queryCount(2 * nodeIdx + 1, mid + 1, rangeHigh, queryLow, queryHigh);
    }
}
```

Precomputation of costs:
`MAX_COORD_ABS = 1000000;`
`SHIFT = MAX_COORD_ABS;`
`MAX_VAL_SHIFTED = 2 * MAX_COORD_ABS; // 0 to 2*10^6`

`costs = new Array(n - x + 1).fill(0);`
`st = new SegmentTree(MAX_VAL_SHIFTED);`
For `i = 0` to `n-1`:
  `val_shifted = nums[i] + SHIFT;`
  `st.update(1, 0, MAX_VAL_SHIFTED, val_shifted, 1, nums[i]);` // Update with original value for sum
  If `i >= x - 1`: // Window `nums[i-x+1 ... i]` is ready
    `window_start_idx = i - x + 1;`
    `kth_idx_for_median = Math.floor((x + 1) / 2);` // 1-indexed median position
    `median_shifted = st.findKth(1, 0, MAX_VAL_SHIFTED, kth_idx_for_median);`
    `median_val = median_shifted - SHIFT;`

    `sum_lt_median = st.querySum(1, 0, MAX_VAL_SHIFTED, 0, median_shifted - 1);`
    `count_lt_median = st.queryCount(1, 0, MAX_VAL_SHIFTED, 0, median_shifted - 1);`
    `sum_gt_median = st.querySum(1, 0, MAX_VAL_SHIFTED, median_shifted + 1, MAX_VAL_SHIFTED);`
    `count_gt_median = st.queryCount(1, 0, MAX_VAL_SHIFTED, median_shifted + 1, MAX_VAL_SHIFTED);`

    `current_cost = (count_lt_median * median_val - sum_lt_median) + (sum_gt_median - count_gt_median * median_val);`
    `costs[window_start_idx] = current_cost;`

    `val_to_remove_shifted = nums[window_start_idx] + SHIFT;`
    `st.update(1, 0, MAX_VAL_SHIFTED, val_to_remove_shifted, -1, -nums[window_start_idx]);`

DP calculation:
`dp = new Array(n + 1).fill(null).map(() => new Array(k + 1).fill(Infinity));`
`dp[0][0] = 0;`

For `i = 1` to `n`:
  For `j = 1` to `k`:
    `dp[i][j] = dp[i-1][j];` // Option 1: Don't form a subarray ending at i-1
    If `i >= x`: // Check if a subarray of size x can end at i-1
      `window_start_idx = i - x;` // Start of the current window `nums[i-x ... i-1]`
      If `dp[window_start_idx][j-1] !== Infinity`:
        `dp[i][j] = Math.min(dp[i][j], dp[window_start_idx][j-1] + costs[window_start_idx]);`

The final answer is `min(dp[i][k])` for `i` from `k*x` to `n`.

Total Time Complexity:
1. Precomputing costs using Segment Tree: `O(N * log M)` where `M` is `2 * MAX_COORD_ABS`.
2. DP calculation: `O(N * K)`.
Overall: `O(N * log M + N * K)`. Given `N=10^5`, `K=15`, `log M` approx `21`.
`10^5 * 21 + 10^5 * 15 = 2.1 * 10^6 + 1.5 * 10^6 = 3.6 * 10^6`. This should be efficient enough.

Total Space Complexity:
1. `nums`: `O(N)`
2. `costs`: `O(N)`
3. `dp` table: `O(N * K)`
4. `SegmentTree`: `O(M)` (tree array size `4 * M`, so `O(M)`)
Overall: `O(N * K + M)`. Given `N=10^5`, `K=15`, `M=2*10^6`.
`10^5 * 15 + 2*10^6 = 1.5 * 10^6 + 2 * 10^6 = 3.5 * 10^6`. This might be a bit tight for memory, but `M` here is not elements, but coordinate range size. `4 * M * Node` objects. Each node is two numbers. `4 * 2 * 10^6 * 8 bytes = 64 MB`. This should be fine.

Edge cases:
- `k*x > n`: Problem constraint `k*x <= nums.length` covers this.
- `x = 2`: Smallest subarray size.
- `k = 1`: Smallest number of subarrays.
- `nums` all same: costs will be 0.
- `nums` values large/small: Handled by shifting to `[0, 2*MAX_COORD_ABS]`.

Final answer `ans = Infinity`.
For `i = k*x` to `n`: `ans = Math.min(ans, dp[i][k])`.
If `ans === Infinity`, it means it's impossible to form `k` subarrays, though problem constraints usually guarantee a solution. Or it should return -1 or similar. But typically, this means `k*x <= nums.length` means it's always possible to form a subarray, and `k*x <= nums.length` implies it's possible to partition.
The problem asks for minimum number of operations, implying a solution always exists given the constraints.
`2 <= k * x <= nums.length` ensures that we always have enough space for `k` subarrays of size `x`.

One optimization for space: `dp[i][j]` only depends on `dp[i-1][j]` and `dp[i-x][j-1]`.
We can optimize `dp` space to `O(N)` by only keeping `dp[j]` and `prev_dp[j-1]`.
Specifically, `dp[j]` depends on previous column `j` and column `j-1`.
`dp[i][j]` depends on `dp[i-1][j]` (current column value from previous row) and `dp[i-x][j-1]` (previous column value from `x` rows ago).
Let `dp[j]` represent `dp[i][j]`.
To compute `dp[j]` for current `i`:
`new_dp_j = Math.min(dp_j, prev_dp_i_minus_x_j_minus_1 + costs[i-x]);`
This can be a rolling array or by simply iterating `j` from `k` down to `1` to avoid using updated `j` values from current `i`.
`dp[j]` from `dp[j]` (prev row, same col) and `dp_prev_col[i-x][j-1]` (prev row's `i-x` element of prev col).
This usually done by `dp[j][idx % x]` or `dp[j][idx]` as `idx` is just `i` in the row.
Since `k` is small, `O(N * K)` space for DP is acceptable. `10^5 * 15` is `1.5 * 10^6` numbers. Each number is `BigInt` potentially, if costs can be large. Max cost for a window is `x * 2 * 10^6`. `10^5 * 2 * 10^6 = 2 * 10^{11}`. Max `k` is `15`. So `15 * 2 * 10^{11} = 3 * 10^{12}`. This will exceed `2^31-1` or `2^53-1` (JS max safe integer). So `BigInt` will be needed for costs and `dp` values.

JavaScript `Number` type is double-precision floating-point, capable of representing integers up to `2^53 - 1` (approximately `9 * 10^15`).
`3 * 10^{12}` is well within `2^53 - 1`. So standard `Number` should be fine.

Let's quickly re-verify `kth_idx_for_median`.
If `x` is odd, say `x=3`, elements `a,b,c`. Sorted: `a',b',c'`. Median is `b'`. `floor((3+1)/2) = 2`. So 2nd element (1-indexed). Correct.
If `x` is even, say `x=4`, elements `a,b,c,d`. Sorted: `a',b',c',d'`. Median is usually average of `b',c'`. But for `sum(abs(x-m))`, any `m` between `b'` and `c'` works. For convenience, pick `b'`. `floor((4+1)/2) = 2`. So 2nd element (1-indexed). This is `b'`. Correct.

The segment tree should be initialized with 0 to `MAX_VAL_SHIFTED`.
`new SegmentTree(MAX_VAL_SHIFTED)` implies `maxVal` in the constructor is the upper bound of the coordinate range. So the range is `[0, maxVal]`. This makes `MAX_VAL_SHIFTED` good for max coordinate.

```javascript
// Helper class for Segment Tree Node
class Node {
    constructor() {
        this.count = 0; // Number of elements in this segment
        this.sum = 0;   // Sum of elements in this segment (using original values, not shifted)
    }
}

// Segment Tree implementation for range queries and updates
class SegmentTree {
    constructor(maxCoord) {
        // maxCoord is the maximum possible shifted coordinate value.
        // The tree covers the range [0, maxCoord].
        this.maxCoord = maxCoord;
        // The tree array size is typically 4 * maxCoord for worst case, but 2 * maxCoord is often sufficient for practical maxCoord.
        // Using 4 * maxCoord to be safe and avoid index out of bounds.
        this.tree = Array(4 * (maxCoord + 1)).fill(null).map(() => new Node());
    }

    // Update function to add/remove a value from the segment tree.
    // targetIdx is the shifted coordinate of the value.
    // deltaCount is +1 for add, -1 for remove.
    // deltaSumValue is the original value itself (or -value for remove), not shifted.
    update(nodeIdx, rangeLow, rangeHigh, targetIdx, deltaCount, deltaSumValue) {
        // If leaf node, update its count and sum directly
        if (rangeLow === rangeHigh) {
            this.tree[nodeIdx].count += deltaCount;
            this.tree[nodeIdx].sum += deltaSumValue;
            return;
        }

        const mid = Math.floor((rangeLow + rangeHigh) / 2);
        if (targetIdx <= mid) {
            // Target is in the left child's range
            this.update(2 * nodeIdx, rangeLow, mid, targetIdx, deltaCount, deltaSumValue);
        } else {
            // Target is in the right child's range
            this.update(2 * nodeIdx + 1, mid + 1, rangeHigh, targetIdx, deltaCount, deltaSumValue);
        }
        // Update current node's count and sum from its children
        this.tree[nodeIdx].count = this.tree[2 * nodeIdx].count + this.tree[2 * nodeIdx + 1].count;
        this.tree[nodeIdx].sum = this.tree[2 * nodeIdx].sum + this.tree[2 * nodeIdx + 1].sum;
    }

    // Find the k-th smallest element (1-indexed k) in the current window.
    // k must be between 1 and total count of elements.
    findKth(nodeIdx, rangeLow, rangeHigh, k) {
        // If leaf node, this is the k-th element
        if (rangeLow === rangeHigh) {
            return rangeLow; // Return the shifted coordinate
        }

        const mid = Math.floor((rangeLow + rangeHigh) / 2);
        // If k is within the count of the left child, recurse left
        if (k <= this.tree[2 * nodeIdx].count) {
            return this.findKth(2 * nodeIdx, rangeLow, mid, k);
        } else {
            // Otherwise, recurse right, adjusting k by the count of the left child
            return this.findKth(2 * nodeIdx + 1, mid + 1, rangeHigh, k - this.tree[2 * nodeIdx].count);
        }
    }

    // Query the sum of elements within a given range [queryLow, queryHigh] (shifted coordinates).
    querySum(nodeIdx, rangeLow, rangeHigh, queryLow, queryHigh) {
        // If the query range is completely outside the current segment range
        if (queryLow > rangeHigh || queryHigh < rangeLow || queryLow > queryHigh) {
            return 0;
        }
        // If the query range completely covers the current segment range
        if (queryLow <= rangeLow && rangeHigh <= queryHigh) {
            return this.tree[nodeIdx].sum;
        }

        const mid = Math.floor((rangeLow + rangeHigh) / 2);
        // Recursively query left and right children and sum their results
        return this.querySum(2 * nodeIdx, rangeLow, mid, queryLow, queryHigh) +
               this.querySum(2 * nodeIdx + 1, mid + 1, rangeHigh, queryLow, queryHigh);
    }

    // Query the count of elements within a given range [queryLow, queryHigh] (shifted coordinates).
    queryCount(nodeIdx, rangeLow, rangeHigh, queryLow, queryHigh) {
        // If the query range is completely outside the current segment range
        if (queryLow > rangeHigh || queryHigh < rangeLow || queryLow > queryHigh) {
            return 0;
        }
        // If the query range completely covers the current segment range
        if (queryLow <= rangeLow && rangeHigh <= queryHigh) {
            return this.tree[nodeIdx].count;
        }

        const mid = Math.floor((rangeLow + rangeHigh) / 2);
        // Recursively query left and right children and sum their results
        return this.queryCount(2 * nodeIdx, rangeLow, mid, queryLow, queryHigh) +
               this.queryCount(2 * nodeIdx + 1, mid + 1, rangeHigh, queryLow, queryHigh);
    }
}

function minOperations(nums, x, k) {
    const n = nums.length;

    // Constants for coordinate shifting
    const MAX_COORD_ABS = 1000000; // Max absolute value of nums[i]
    const SHIFT = MAX_COORD_ABS;   // Shift to make all numbers non-negative
    const MAX_VAL_SHIFTED = 2 * MAX_COORD_ABS; // Max value in the shifted range [0, 2*MAX_COORD_ABS]

    // Precompute costs for all possible subarrays of size x
    // costs[i] will store the minimum operations for subarray nums[i...i+x-1]
    const costs = new Array(n - x + 1);
    const segmentTree = new SegmentTree(MAX_VAL_SHIFTED);

    // Sliding window to calculate median costs
    for (let i = 0; i < n; i++) {
        const valShifted = nums[i] + SHIFT;
        // Add current element to the segment tree
        segmentTree.update(1, 0, MAX_VAL_SHIFTED, valShifted, 1, nums[i]);

        if (i >= x - 1) { // Window of size x has formed: nums[i-x+1 ... i]
            const windowStartIndex = i - x + 1;

            // Find the median. For sum of absolute differences, any value between
            // the two middle elements (for even x) or the middle element (for odd x) works.
            // We'll pick the lower median (k-th element, where k = floor((x+1)/2))
            const kthIdxForMedian = Math.floor((x + 1) / 2);
            const medianShifted = segmentTree.findKth(1, 0, MAX_VAL_SHIFTED, kthIdxForMedian);
            const medianVal = medianShifted - SHIFT; // Convert back to original value

            // Calculate cost for the current window: sum(abs(num - median))
            // This is (count_lt_median * median - sum_lt_median) + (sum_gt_median - count_gt_median * median)
            // Elements equal to median don't contribute to cost.
            const sumLtMedian = segmentTree.querySum(1, 0, MAX_VAL_SHIFTED, 0, medianShifted - 1);
            const countLtMedian = segmentTree.queryCount(1, 0, MAX_VAL_SHIFTED, 0, medianShifted - 1);
            
            const sumGtMedian = segmentTree.querySum(1, 0, MAX_VAL_SHIFTED, medianShifted + 1, MAX_VAL_SHIFTED);
            const countGtMedian = segmentTree.queryCount(1, 0, MAX_VAL_SHIFTED, medianShifted + 1, MAX_VAL_SHIFTED);

            // Cost calculation
            const currentCost = (countLtMedian * medianVal - sumLtMedian) + (sumGtMedian - countGtMedian * medianVal);
            costs[windowStartIndex] = currentCost;

            // Remove the element that is sliding out of the window: nums[windowStartIndex]
            const valToRemoveShifted = nums[windowStartIndex] + SHIFT;
            segmentTree.update(1, 0, MAX_VAL_SHIFTED, valToRemoveShifted, -1, -nums[windowStartIndex]);
        }
    }

    // Dynamic Programming to find minimum operations for k non-overlapping subarrays
    // dp[i][j] = minimum cost to form j subarrays using elements up to index i-1.
    // i ranges from 0 to n. j ranges from 0 to k.
    const dp = Array(n + 1).fill(null).map(() => Array(k + 1).fill(Infinity));

    // Base case: 0 cost to form 0 subarrays using 0 elements
    dp[0][0] = 0;

    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= k; j++) {
            // Option 1: Don't form a subarray ending at i-1.
            // In this case, the cost is the same as for i-1 elements.
            dp[i][j] = dp[i - 1][j];

            // Option 2: Form a subarray of size x ending at i-1.
            // This subarray is nums[i-x ... i-1].
            // This is only possible if we have at least x elements (i >= x)
            // and we need to form j-1 previous subarrays (j >= 1).
            if (i >= x && j >= 1) {
                const windowStartIndex = i - x; // The starting index of the subarray nums[i-x ... i-1]
                const costForCurrentSubarray = costs[windowStartIndex];
                
                // If it was possible to form j-1 subarrays ending before windowStartIndex,
                // then update dp[i][j] with this option.
                if (dp[windowStartIndex][j - 1] !== Infinity) {
                    dp[i][j] = Math.min(dp[i][j], dp[windowStartIndex][j - 1] + costForCurrentSubarray);
                }
            }
        }
    }

    // The result is the minimum cost to form k subarrays using any prefix of nums
    let minTotalOperations = Infinity;
    // Iterate from the earliest possible end index (k*x) up to n
    for (let i = k * x; i <= n; i++) {
        minTotalOperations = Math.min(minTotalOperations, dp[i][k]);
    }

    return minTotalOperations;
}
```