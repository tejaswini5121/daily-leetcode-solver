# Problem: Subarrays Distinct Element Sum of Squares II
# Summary: Calculate the sum of squares of distinct counts for all subarrays of a given array, modulo 10^9 + 7.
# Link: https://leetcode.com/problems/subarrays-distinct-element-sum-of-squares-ii/

# Approach:
# This problem asks for the sum of distinct_count^2 for all subarrays.
# Let `D(i, j)` be the distinct count of `nums[i..j]`. We need to calculate `sum(D(i, j)^2)` for all `0 <= i <= j < n`.
# The expression `D^2` can be expanded as `D * D`.
#
# A common technique for problems involving sums over subarrays is to fix the right endpoint `j` and iterate `i` from `0` to `j`, or fix the left endpoint `i` and iterate `j` from `i` to `n-1`.
# Let's fix the right endpoint `j` and try to calculate the sum for all subarrays `nums[i..j]` where `0 <= i <= j`.
#
# For a fixed `j`, as `i` decreases from `j` to `0`, the distinct count `D(i, j)` changes.
# The `distinct count` `D(i, j)` can be written as `sum(is_present(val, i, j))` over all unique values `val` in `nums`.
# Or more conveniently, `D(i, j)` is the count of elements `nums[k]` such that `i <= k <= j` and `nums[k]` has not appeared in `nums[k+1..j]`.
# This is equivalent to saying `nums[k]` is the rightmost occurrence of its value in `nums[i..j]`.
#
# Let's consider `D(i, j) = k`. We need to sum `k^2`.
# `k^2 = sum(1 for x=1 to k) + sum(1 for y=1 to k-1)` or `k^2 = k + k*(k-1)`.
#
# Alternatively, `k^2 = sum(I_x * I_y)` for all distinct elements `x, y` present in `nums[i..j]`, where `I_x` and `I_y` are indicator variables for presence. This expansion is incorrect.
# `D(i, j)^2 = (count of distinct elements in nums[i..j])^2`.
# This means `D(i, j)^2 = sum_{v1 in distinct(i,j)} sum_{v2 in distinct(i,j)} 1`.
#
# We can iterate `j` from `0` to `n-1`. For each `j`, we want to calculate `sum_{i=0 to j} D(i, j)^2`.
# Let `dp[i]` store `D(i, j)`.
# When we move from `j-1` to `j`, `nums[j]` is added.
# For each `i <= j`, `D(i, j)` changes from `D(i, j-1)` to `D(i, j-1)` if `nums[j]` is already in `nums[i..j-1]`, or `D(i, j-1) + 1` if `nums[j]` is new to `nums[i..j-1]`.
#
# The condition "new to `nums[i..j-1]`" means `nums[j]` has not appeared in `nums[i..j-1]`. This is equivalent to saying that the *last occurrence* of `nums[j]` before `j` (let's call its index `prev_idx`) must be less than `i`.
# So, for `i` such that `prev_idx[nums[j]] < i <= j`, `D(i, j) = D(i, j-1) + 1`.
# For `i` such that `0 <= i <= prev_idx[nums[j]]`, `D(i, j) = D(i, j-1)`.
#
# Let `prev_occurrence[val]` be the last index where `val` appeared. Initialize with -1.
# When processing `nums[j]`:
# For `i` in `[prev_occurrence[nums[j]] + 1, j]`, `D(i, j)` increments by 1 compared to `D(i, j-1)`.
# For `i` in `[0, prev_occurrence[nums[j]]]`, `D(i, j)` remains `D(i, j-1)`.
#
# Let `S_j = sum_{i=0 to j} D(i, j)^2`. We want to compute `sum_{j=0 to n-1} S_j`.
# We have a range update: for a range `[L, R]`, `D(i, j)` becomes `D(i, j) + 1`.
# Let `curr_distinct[i]` denote `D(i, j)` for the current `j`.
# When `curr_distinct[i]` changes from `X` to `X+1`, `X^2` changes to `(X+1)^2 = X^2 + 2X + 1`.
# This means we need to update `sum(X^2)` by adding `sum(2X + 1)` over the range `[L, R]`.
# To do this efficiently, we need a data structure that supports:
# 1. Range increment `X -> X+1`.
# 2. Range sum query `sum(X)`.
# 3. Range sum query `sum(X^2)`.
#
# A segment tree can handle range updates and range sum queries.
# To handle `sum(X^2)`, we need to store `sum(X)` and `sum(X^2)` in each node.
# When a range `[L, R]` is updated by `+delta`:
# New `sum(X)` for the range: `sum(X) + (R - L + 1) * delta`.
# New `sum(X^2)` for the range: `sum((X+delta)^2) = sum(X^2 + 2*X*delta + delta^2)`
# ` = sum(X^2) + 2*delta*sum(X) + (R - L + 1)*delta^2`.
#
# So, each segment tree node needs to store:
# - `sum_val`: sum of `D(i, j)` for the range covered by the node.
# - `sum_sq_val`: sum of `D(i, j)^2` for the range covered by the node.
# - `lazy_delta`: pending increment for the range.
#
# Let `n = nums.length`. The segment tree will operate on indices `0` to `n-1`.
# Initially, all `D(i, -1)` are 0. So, `sum_val = 0`, `sum_sq_val = 0`, `lazy_delta = 0` for all nodes.
#
# The overall algorithm:
# Initialize `total_sum_of_squares = 0`.
# Initialize a segment tree for range `[0, n-1]`. All initial values are 0.
# Initialize `last_occurrence = {}` to store `val -> index` mapping.
# Loop `j` from `0` to `n-1`:
#   Let `curr_num = nums[j]`.
#   Let `last_idx = last_occurrence.get(curr_num, -1)`.
#   The range `[last_idx + 1, j]` will have their distinct counts `D(i, j)` incremented by 1.
#   Call `segment_tree.update(last_idx + 1, j, 1)`. This updates `sum_val` and `sum_sq_val` for relevant nodes.
#   After updating, the root of the segment tree will contain `sum_sq_val` which is `sum_{i=0 to j} D(i, j)^2`.
#   Add `segment_tree.query_sum_sq(0, j)` (or `segment_tree.root.sum_sq_val` if root always covers `[0,j]`) to `total_sum_of_squares`.
#   Update `last_occurrence[curr_num] = j`.
# Return `total_sum_of_squares % MOD`.
#
# Edge cases for segment tree update:
# `update(L, R, delta)`:
# If `L > R`, there's no range to update, so do nothing. This happens if `last_idx == j`.
# For example, if `nums = [1, 2, 1]` and `j=2` (value `1`):
# `last_occurrence[1]` was 0. So `last_idx = 0`.
# Update range `[0+1, 2] = [1, 2]` by `+1`.
# This effectively updates `D(1,2)` and `D(2,2)` which are `D(1,1)+1` and `D(2,1)+1`.
# But `D(0,2)` (for `nums[0..2] = [1,2,1]`) also changes, it is `D(0,1)` (which is 2) when `nums[2]` is added, `nums[0]` is still present. No, `D(0,1)` is `2`, `D(0,2)` is `2`.
# The distinct counts for `i <= last_idx` are not affected.
# For `i > last_idx`, the new element `nums[j]` adds a new distinct value to `nums[i..j]` if `nums[j]` hasn't appeared in `nums[i..j-1]`.
# Since `last_idx` is the last occurrence of `nums[j]` before `j`, any subarray `nums[i..j]` with `i > last_idx` will have `nums[j]` as its first occurrence from the right for its value.
# So, the distinct count `D(i,j)` increases by 1 for all `i` in `(last_idx, j]`.
#
# The `query_sum_sq(0, j)` needs to be applied carefully. The segment tree holds values for indices `0` to `n-1`. For a fixed `j`, we are interested in `sum_{i=0 to j} D(i, j)^2`. So we need to query `sum_sq_val` for the range `[0, j]`.
#
# Modulo arithmetic: `MOD = 10^9 + 7`.
# All additions and multiplications must be modulo `MOD`.
# `(X+delta)^2 = X^2 + 2*X*delta + delta^2`.
# Term `2*delta*sum(X)` means we need to take `2*delta` modulo `MOD`, `sum(X)` modulo `MOD`.
# `delta^2` needs to be modulo `MOD`.
# `(R-L+1)*delta^2` needs to be modulo `MOD`.

# Segment Tree Implementation Details:
# Node structure: `sum_val`, `sum_sq_val`, `lazy_delta`.
# `build(node, start, end)`: Initializes the tree.
# `push_down(node, start, end)`: Applies lazy updates to children.
# `update_range(node, start, end, query_L, query_R, delta)`: Updates a range.
# `query_range(node, start, end, query_L, query_R)`: Queries a range. For this problem, we only need `query_range(0, j)` for `sum_sq_val`.

# A simplified segment tree can be used if we only query for a fixed total range (e.g., [0, N-1] or [0, j]).
# Since we only query `sum_sq_val` of `[0, j]`, and `j` is the current right endpoint being processed, the effective range of distinct counts is `[0, j]`.
# The `update_range` call will always be for `[last_idx + 1, j]`.
# The `query` for total_sum_of_squares will always be for `[0, j]`.
#
# Example walkthrough: `nums = [1, 2, 1]`
# `n = 3`, `MOD = 10^9 + 7`
# `total_sum_of_squares = 0`
# `segment_tree` initialized for `[0, 2]` with all values 0.
# `last_occurrence = {}`

# `j = 0`, `curr_num = 1`
#   `last_idx = -1` (since 1 not in `last_occurrence`)
#   `update_range(0, 0, 1)`:
#     Range `[0, 0]` is updated by `+1`.
#     `D(0, 0)` was 0, becomes 1. `0^2 -> 1^2`.
#     `segment_tree.root.sum_val = 1`, `segment_tree.root.sum_sq_val = 1`.
#   `total_sum_of_squares += segment_tree.query_sum_sq(0, 0) = 1`. `total_sum_of_squares = 1`.
#   `last_occurrence[1] = 0`.

# `j = 1`, `curr_num = 2`
#   `last_idx = -1` (since 2 not in `last_occurrence`)
#   `update_range(0, 1, 1)`:
#     Range `[0, 1]` is updated by `+1`.
#     `i=0`: `D(0, 0)` was 1. Now for `j=1`, `D(0, 1)` (for `[1,2]`) becomes `1+1=2`. `1^2 -> 2^2`. (cost `2*1+1=3`)
#     `i=1`: `D(1, 0)` was 0. Now for `j=1`, `D(1, 1)` (for `[2]`) becomes `0+1=1`. `0^2 -> 1^2`. (cost `2*0+1=1`)
#     Segment tree updates:
#       `root_sum_val` (for `[0,1]`): `(1+0) + (1+1) = 2 + 1 = 3`. No, current sum values are `1` (for index 0) and `0` (for index 1).
#       After update for `[0,1]` by `+1`: `sum_val` changes `(1+0)` to `(1+1) + (0+1) = 2+1 = 3`.
#       `sum_sq_val` changes `(1^2+0^2)` to `(1+1)^2 + (0+1)^2 = 2^2+1^2 = 4+1 = 5`.
#       `segment_tree.root.sum_val = 3`, `segment_tree.root.sum_sq_val = 5`.
#   `total_sum_of_squares += segment_tree.query_sum_sq(0, 1) = 5`. `total_sum_of_squares = 1 + 5 = 6`.
#   `last_occurrence[2] = 1`.

# `j = 2`, `curr_num = 1`
#   `last_idx = 0` (from `last_occurrence[1]`)
#   `update_range(0 + 1, 2, 1)` which is `update_range(1, 2, 1)`:
#     Range `[1, 2]` is updated by `+1`.
#     `D(i, 1)` values before update (current `j=1` values after `nums[1]`):
#       `D(0,1)` = 2 (for `[1,2]`)
#       `D(1,1)` = 1 (for `[2]`)
#       Values `curr_distinct` at indices: `[2, 1, 0]` (for `i=0,1,2`)
#     Apply `+1` to `curr_distinct[1]` and `curr_distinct[2]`.
#     `i=1`: `D(1, 1)` was 1. Now `D(1, 2)` (for `[2,1]`) becomes `1+1=2`. `1^2 -> 2^2`. (cost `2*1+1=3`)
#     `i=2`: `D(2, 1)` was 0. Now `D(2, 2)` (for `[1]`) becomes `0+1=1`. `0^2 -> 1^2`. (cost `2*0+1=1`)
#     Segment tree updates:
#       Index 0: `curr_distinct[0]` is still 2. (for `D(0,2)` for `[1,2,1]`)
#       Index 1: `curr_distinct[1]` changes from 1 to 2.
#       Index 2: `curr_distinct[2]` changes from 0 to 1.
#       Current state of segment tree values `[D(0,j), D(1,j), D(2,j), ...]`: `[2, 1, 0]` (for `j=1`).
#       After `update_range(1, 2, 1)`: values become `[2, 1+1, 0+1] = [2, 2, 1]`.
#       `sum_val` (for `[0,2]`): `2+2+1 = 5`. (Was `sum_val` for `[0,1]` which was 3. For `[0,2]` it would be `3+0` at index 2, plus updates)
#       `sum_sq_val` (for `[0,2]`): `2^2 + 2^2 + 1^2 = 4+4+1 = 9`.
#       `segment_tree.root.sum_val = 5`, `segment_tree.root.sum_sq_val = 9`.
#   `total_sum_of_squares += segment_tree.query_sum_sq(0, 2) = 9`. `total_sum_of_squares = 6 + 9 = 15`.
#   `last_occurrence[1] = 2`.

# Result `total_sum_of_squares = 15`. Matches example.

# Time Complexity:
# The segment tree has `O(N)` nodes.
# Each `update_range` and `query_range` operation takes `O(log N)` time.
# We iterate `j` from `0` to `n-1`, performing one `update_range` and one `query_range` in each iteration.
# Total time complexity: `O(N log N)`.
# Given `N <= 10^5`, `N log N` is around `10^5 * 17`, which is feasible.

# Space Complexity:
# The segment tree stores information for `O(N)` nodes. Each node stores a few integer values.
# `last_occurrence` map stores at most `N` entries (number of unique elements).
# Total space complexity: `O(N)`.

# MOD value
MOD = 10**9 + 7

class SegmentTreeNode:
    def __init__(self):
        # sum_val stores the sum of D(i, j) for the range covered by this node.
        self.sum_val = 0
        # sum_sq_val stores the sum of D(i, j)^2 for the range covered by this node.
        self.sum_sq_val = 0
        # lazy_delta stores the pending increment to be applied to all elements in this node's range.
        self.lazy_delta = 0
        self.left = None
        self.right = None

class SegmentTree:
    def __init__(self, n):
        self.root = self._build(0, n - 1)
        self.n = n

    def _build(self, start, end):
        # Base case: if start == end, it's a leaf node. Initialize with 0s.
        node = SegmentTreeNode()
        if start == end:
            return node
        
        # Recursively build left and right children.
        mid = (start + end) // 2
        node.left = self._build(start, mid)
        node.right = self._build(mid + 1, end)
        return node

    def _push_down(self, node, start, end):
        # If there's a pending lazy_delta, apply it to children.
        if node.lazy_delta != 0:
            delta = node.lazy_delta
            node.lazy_delta = 0 # Clear lazy_delta for current node

            # If not a leaf node, push delta down to children.
            if start != end:
                mid = (start + end) // 2
                
                # Apply delta to left child
                left_node = node.left
                left_node.sum_sq_val = (left_node.sum_sq_val + 2 * delta * left_node.sum_val + (mid - start + 1) * delta * delta) % MOD
                left_node.sum_val = (left_node.sum_val + (mid - start + 1) * delta) % MOD
                left_node.lazy_delta = (left_node.lazy_delta + delta) % MOD

                # Apply delta to right child
                right_node = node.right
                right_node.sum_sq_val = (right_node.sum_sq_val + 2 * delta * right_node.sum_val + (end - (mid + 1) + 1) * delta * delta) % MOD
                right_node.sum_val = (right_node.sum_val + (end - (mid + 1) + 1) * delta) % MOD
                right_node.lazy_delta = (right_node.lazy_delta + delta) % MOD

    def _update_range(self, node, start, end, query_L, query_R, delta):
        # If the current node's range is completely outside the query range.
        if start > query_R or end < query_L:
            return

        # If the current node's range is completely within the query range.
        if query_L <= start and end <= query_R:
            # Update sum_sq_val: (X+delta)^2 = X^2 + 2*X*delta + delta^2
            # Sum for range [start, end]: sum(X^2) + 2*delta*sum(X) + (end-start+1)*delta^2
            node.sum_sq_val = (node.sum_sq_val + 2 * delta * node.sum_val + (end - start + 1) * delta * delta) % MOD
            # Update sum_val: sum(X+delta) = sum(X) + (end-start+1)*delta
            node.sum_val = (node.sum_val + (end - start + 1) * delta) % MOD
            # Update lazy_delta for future push_down.
            node.lazy_delta = (node.lazy_delta + delta) % MOD
            return

        # If the current node's range partially overlaps the query range.
        # First, push down any pending lazy updates to children.
        self._push_down(node, start, end)

        # Recursively update children.
        mid = (start + end) // 2
        self._update_range(node.left, start, mid, query_L, query_R, delta)
        self._update_range(node.right, mid + 1, end, query_L, query_R, delta)

        # After children are updated, update current node's sums by combining children's sums.
        node.sum_val = (node.left.sum_val + node.right.sum_val) % MOD
        node.sum_sq_val = (node.left.sum_sq_val + node.right.sum_sq_val) % MOD

    def update_range(self, query_L, query_R, delta):
        # Only update if the range is valid.
        if query_L <= query_R:
            self._update_range(self.root, 0, self.n - 1, query_L, query_R, delta)

    def _query_sum_sq(self, node, start, end, query_L, query_R):
        # If current node's range is completely outside query range.
        if start > query_R or end < query_L:
            return 0

        # If current node's range is completely within query range.
        if query_L <= start and end <= query_R:
            return node.sum_sq_val

        # Push down lazy updates before querying children.
        self._push_down(node, start, end)

        # Recursively query children and combine results.
        mid = (start + end) // 2
        left_sum_sq = self._query_sum_sq(node.left, start, mid, query_L, query_R)
        right_sum_sq = self._query_sum_sq(node.right, mid + 1, end, query_L, query_R)
        return (left_sum_sq + right_sum_sq) % MOD

    def query_sum_sq(self, query_L, query_R):
        if query_L > query_R:
            return 0
        return self._query_sum_sq(self.root, 0, self.n - 1, query_L, query_R)

class Solution:
    def sumDistinctCountsOfSubarrays(self, nums: list[int]) -> int:
        n = len(nums)
        MOD = 10**9 + 7
        
        # Initialize segment tree with N elements, all values initially 0.
        segment_tree = SegmentTree(n)
        
        # last_occurrence maps a number to its last seen index.
        last_occurrence = {}
        
        total_sum_of_squares = 0
        
        # Iterate through all possible right endpoints 'j'.
        for j in range(n):
            curr_num = nums[j]
            
            # Find the last index where curr_num appeared. If it hasn't appeared, use -1.
            last_idx = last_occurrence.get(curr_num, -1)
            
            # For all subarrays nums[i..j] where i is in (last_idx, j],
            # curr_num is a new distinct element compared to nums[i..j-1].
            # Thus, their distinct counts increase by 1.
            # We need to update the range [last_idx + 1, j] with a delta of +1.
            segment_tree.update_range(last_idx + 1, j, 1)
            
            # After updating for the current 'j', the segment tree root's sum_sq_val (for range [0, j])
            # will contain the sum of D(i, j)^2 for all i from 0 to j.
            # Add this to the total sum.
            total_sum_of_squares = (total_sum_of_squares + segment_tree.query_sum_sq(0, j)) % MOD
            
            # Update the last occurrence for curr_num.
            last_occurrence[curr_num] = j
            
        return total_sum_of_squares

# Example usage (for testing purposes, not part of final submission structure):
# sol = Solution()
# print(sol.sumDistinctCountsOfSubarrays([1,2,1])) # Expected: 15
# print(sol.sumDistinctCountsOfSubarrays([2,2])) # Expected: 3
# print(sol.sumDistinctCountsOfSubarrays([1,2,3])) # Expected: 1*1 + 1*1 + 1*1 + 2*2 + 2*2 + 3*3 = 1+1+1+4+4+9 = 20

# Subarrays of [1,2,3]:
# [1]: D=1, D^2=1
# [2]: D=1, D^2=1
# [3]: D=1, D^2=1
# [1,2]: D=2, D^2=4
# [2,3]: D=2, D^2=4
# [1,2,3]: D=3, D^2=9
# Total = 1+1+1+4+4+9 = 20. My example test case matched.