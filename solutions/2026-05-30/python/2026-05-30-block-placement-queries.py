# Problem Summary:
# This problem involves placing obstacles on an infinite number line and then querying if a block of a certain size can be placed within a given range [0, x] without intersecting any obstacles.
# Problem Link: https://leetcode.com/problems/block-placement-queries

# Approach Explanation:
# The core idea is to maintain the available gaps between obstacles and the origin.
# Initially, there are no obstacles, so the entire line [0, infinity) is available. We can model this by considering obstacles at -infinity and +infinity, or more simply, just focusing on the maximum available space starting from 0.
# When an obstacle is placed at `x`, it might split an existing free segment or reduce the maximum free space available from 0 to some point.
# A key observation for type 2 queries `[2, x, sz]` is that we need to find if there's *any* continuous segment of length `sz` within `[0, x]`. This is equivalent to checking if `max_available_space(y) >= sz` for some `y <= x`. More precisely, it means checking if there exists a position `p` such that `p >= 0`, `p + sz <= x`, and the interval `[p, p + sz]` is free of obstacles.

# Let's define `max_reach[i]` as the maximum possible size of a block that can be placed such that its rightmost end is at or before position `i`. This is not quite what we need.
# Instead, let's keep track of the obstacles. When an obstacle is placed at `p`, it means `p` is no longer free.
# The critical insight is that if we want to place a block of size `sz` ending at or before `x`, we need a continuous free segment `[start, end]` such that `end <= x` and `end - start >= sz`. The `start` can be 0 or an obstacle. The `end` can be `x` or an obstacle.
# This problem has elements that suggest a Segment Tree or a similar data structure.
# The coordinates `x` and `sz` can be up to `min(5 * 10^4, 3 * queries.length)`. `queries.length` can be `1.5 * 10^4`. This means `x` and `sz` can be up to `4.5 * 10^4`.
# A coordinate compression approach might be needed if values were larger, but here, the maximum coordinate is manageable for a segment tree.

# Let's consider the free segments. Initially, we have one segment `[0, infinity)`.
# When an obstacle is placed at `x`:
# 1. If `x` is already occupied, nothing changes (guaranteed not to happen by problem description).
# 2. `x` splits an existing free segment `[a, b]` into `[a, x)` and `(x, b]`. `x` itself becomes an obstacle.
# The total space available is finite, up to `max_X + max_SZ`. Let's assume the maximum coordinate is `C = max(x_i)` from queries.
# We are interested in segments `[0, y]` for `y <= x`. The maximum position we care about is `max_X` from queries.
# Let `obstacles` be a sorted set of obstacle positions. We also add `0` as a conceptual obstacle (or boundary) and `max_coordinate + 1` as another.
# Example: obstacles = {0, 2, 7, 10}.
# Free segments are `(0, 2)`, `(2, 7)`, `(7, 10)`. The lengths are `2-0=2`, `7-2=5`, `10-7=3`.
# We want to find if there is a segment `[a, b]` such that `b <= x` and `b - a >= sz`.
# This sounds like we need to query for maximum length free segment ending before `x`.

# Let's use a Segment Tree. The segment tree will operate on coordinates `[0, MaxCoord]`.
# `MaxCoord` can be `max_x + max_sz`. Let's estimate `MaxCoord = 5 * 10^4 + 5 * 10^4 = 10^5` (worst case if we need to place a block of size `sz` ending at `x`, and `x` and `sz` are both maximal). Or `max(x_i)`.
# Let's define the segment tree nodes to store information about contiguous free segments.
# For a range `[L, R]` in the segment tree:
# `max_prefix_free`: maximum length of a free segment starting at `L`.
# `max_suffix_free`: maximum length of a free segment ending at `R`.
# `max_total_free`: maximum length of any free segment fully contained within `[L, R]`.
# `total_length`: `R - L + 1`.

# When an obstacle is placed at `x`, we mark point `x` as occupied in the segment tree. This means updating a single leaf node `x` to 'occupied'.
# An occupied leaf node will have `max_prefix_free = 0`, `max_suffix_free = 0`, `max_total_free = 0`.
# A free leaf node `i` will have `max_prefix_free = 1`, `max_suffix_free = 1`, `max_total_free = 1`.

# How to combine nodes `left` and `right` for their parent `node`?
# `node.max_prefix_free`: If `left` is entirely free (`left.max_prefix_free == left.total_length`), then `node.max_prefix_free = left.total_length + right.max_prefix_free`. Otherwise, it's `left.max_prefix_free`.
# `node.max_suffix_free`: If `right` is entirely free (`right.max_suffix_free == right.total_length`), then `node.max_suffix_free = right.total_length + left.max_suffix_free`. Otherwise, it's `right.max_suffix_free`.
# `node.max_total_free`: `max(left.max_total_free, right.max_total_free, left.max_suffix_free + right.max_prefix_free)`.

# This segment tree structure allows us to query for the maximum free segment length in a range `[0, X]`.
# The query `[2, x, sz]` asks: "Is there any segment `[p, p + sz]` such that `p + sz <= x` and `[p, p + sz]` is free?"
# This is NOT the same as "Is `max_total_free` in `[0, x]` >= `sz`?".
# Consider obstacles {0, 5, 10}. Query `[2, 10, 3]`. Segments are `(0,5)` length 5, `(5,10)` length 5.
# `max_total_free` in `[0,10]` is 5.
# We can place `[0,3]`, `[1,4]`, `[2,5]`, `[5,8]`, `[6,9]`, `[7,10]`. All are valid.
# `p + sz <= x` means we need to query the range `[0, x]`.
# `max_total_free` is indeed what we need. If the largest free segment in `[0, x]` is of length `L`, and `L >= sz`, then we can place the block.
# Wait, this condition `p + sz <= x` is crucial.
# If we have a free segment `[a, b]`, then we can place a block of size `sz` if `b - a >= sz`.
# The block can be placed at `a` and extend to `a+sz`, or at `b-sz` and extend to `b`.
# We need `b <= x`. So, we need to find if there exists a free segment `[a,b]` such that `b <= x` and `b-a >= sz`.
# The `max_total_free` property of a segment tree node over range `[0, x]` will give us the maximum length `L` of any free segment `[a, b]` such that `a >= 0` and `b <= x`. If `L >= sz`, then the answer is true.

# Let's consider the maximum coordinate.
# `max_x` can be `5 * 10^4`. `max_sz` can be `5 * 10^4`.
# If we have query `[2, x, sz]`, we care about position `x`.
# The maximum coordinate for the segment tree would be `max_X` encountered in queries.
# Example: `queries = [[1,7],[2,7,6],[1,2],[2,7,5],[2,7,6]]`
# Max X is 7.
# Let's consider the interval `[0, MaxCoord + 1]`. Let `MaxCoord = 50000`.
# Segment tree size is `4 * MaxCoord`.
# Each node stores `max_prefix_free`, `max_suffix_free`, `max_total_free`.
# Initialize: All nodes are free. A node `[L, R]` has `max_prefix_free = R - L + 1`, `max_suffix_free = R - L + 1`, `max_total_free = R - L + 1`.

# Segment Tree structure:
# `tree` array, `size` `4 * MAX_COORD`.
# `build(node_idx, start, end)`:
#   if `start == end`:
#     `tree[node_idx] = {1, 1, 1}` (free unit length segment)
#     return
#   `mid = (start + end) // 2`
#   `build(2 * node_idx, start, mid)`
#   `build(2 * node_idx + 1, mid + 1, end)`
#   `tree[node_idx] = merge(tree[2 * node_idx], tree[2 * node_idx + 1])`
# `merge(left_child_data, right_child_data)`:
#   `res = {}`
#   `res.max_prefix_free`: if `left_child_data.is_fully_free`: `left_child_data.total_length + right_child_data.max_prefix_free` else `left_child_data.max_prefix_free`
#   `res.max_suffix_free`: if `right_child_data.is_fully_free`: `right_child_data.total_length + left_child_data.max_suffix_free` else `right_child_data.max_suffix_free`
#   `res.max_total_free`: `max(left_child_data.max_total_free, right_child_data.max_total_free, left_child_data.max_suffix_free + right_child_data.max_prefix_free)`
#   return `res`
# The `is_fully_free` flag can be derived from `max_prefix_free == total_length`.

# `update(node_idx, start, end, idx, type)`:
#   if `start == end`:
#     if `type == 1` (place obstacle): `tree[node_idx] = {0, 0, 0}`
#     else (`type == 0`, remove obstacle, not in this problem): `tree[node_idx] = {1, 1, 1}`
#     return
#   `mid = (start + end) // 2`
#   if `idx <= mid`: `update(2 * node_idx, start, mid, idx, type)`
#   else: `update(2 * node_idx + 1, mid + 1, end, idx, type)`
#   `tree[node_idx] = merge(tree[2 * node_idx], tree[2 * node_idx + 1])`

# `query(node_idx, start, end, L, R)`:
#   if `R < start` or `end < L`: return a 'zero' segment (all occupied: `0, 0, 0`)
#   if `L <= start` and `end <= R`: return `tree[node_idx]`
#   `mid = (start + end) // 2`
#   `p1 = query(2 * node_idx, start, mid, L, R)`
#   `p2 = query(2 * node_idx + 1, mid + 1, end, L, R)`
#   return `merge(p1, p2)`

# The maximum coordinate for `x` is `5*10^4`.
# Let's consider the segment tree for range `[0, MaxCoord]`.
# What values should `MaxCoord` be?
# The `x` in `[1, x]` can be up to `5 * 10^4`. The `x` in `[2, x, sz]` can be up to `5 * 10^4`.
# A block of size `sz` (up to `5 * 10^4`) can be placed.
# If `x = 100` and `sz = 50`, we query `[0, 100]`.
# If `x = 50000`, `sz = 50000`, we query `[0, 50000]`.
# So `MaxCoord` should be `max_possible_x`. Let's use `MAX_X_VAL = 50000`.
# Segment tree range `[0, MAX_X_VAL]`.
# An obstacle at `x` effectively blocks the point `x`.
# This is a bit tricky. If we place obstacle at `x`, it occupies position `x`.
# A block `[p, p+sz]` is valid if all points `y` in `[p, p+sz]` are free.
# If `x` is an obstacle, then `x` cannot be part of `[p, p+sz]`.
# The segment tree nodes `[L, R]` refer to *intervals*.
# A common way to handle points and intervals in segment trees is to think of intervals `[i, i+1)` or `[i, i]`.
# Let's say `tree[idx]` stores info for `[start, end]`.
# If `start == end`, `tree[idx]` describes point `start`. If `start` is free, it has length 1. If occupied, length 0.
# The `merge` logic then correctly combines adjacent free points.
# If `MaxCoord = 50000`, the segment tree operates on indices `0` to `50000`. This means `50001` leaves.
# A segment `[L, R]` has `R - L + 1` points.
# Our segment tree stores the maximum length of a segment of *points*.
# `max_prefix_free`: longest consecutive free points from `start`.
# `max_suffix_free`: longest consecutive free points to `end`.
# `max_total_free`: longest consecutive free points anywhere in `[start, end]`.

# Initial state: All points `[0, MAX_X_VAL]` are free.
# `build(node_idx, start, end)`:
#   if `start == end`:
#     `tree[node_idx] = {'pref': 1, 'suff': 1, 'max_len': 1, 'total_len': 1}`
#     return
#   `mid = (start + end) // 2`
#   `build(2 * node_idx, start, mid)`
#   `build(2 * node_idx + 1, mid + 1, end)`
#   `tree[node_idx] = merge(tree[2 * node_idx], tree[2 * node_idx + 1])`

# `merge(left_child_data, right_child_data)`:
#   `res = {'pref': 0, 'suff': 0, 'max_len': 0, 'total_len': left_child_data['total_len'] + right_child_data['total_len']}`
#   `res['pref'] = left_child_data['pref']`
#   if `left_child_data['pref'] == left_child_data['total_len']`:
#     `res['pref'] += right_child_data['pref']`
#   `res['suff'] = right_child_data['suff']`
#   if `right_child_data['suff'] == right_child_data['total_len']`:
#     `res['suff'] += left_child_data['suff']`
#   `res['max_len'] = max(left_child_data['max_len'], right_child_data['max_len'], left_child_data['suff'] + right_child_data['pref'])`
#   return `res`

# `update(node_idx, start, end, idx, is_obstacle)`:
#   if `start == end`:
#     if `is_obstacle`: `tree[node_idx] = {'pref': 0, 'suff': 0, 'max_len': 0, 'total_len': 1}`
#     else: `tree[node_idx] = {'pref': 1, 'suff': 1, 'max_len': 1, 'total_len': 1}`
#     return
#   `mid = (start + end) // 2`
#   if `idx <= mid`: `update(2 * node_idx, start, mid, idx, is_obstacle)`
#   else: `update(2 * node_idx + 1, mid + 1, end, idx, is_obstacle)`
#   `tree[node_idx] = merge(tree[2 * node_idx], tree[2 * node_idx + 1])`

# `query(node_idx, start, end, L, R)`:
#   if `R < start` or `end < L`: # Query range outside current node's range
#     return {'pref': 0, 'suff': 0, 'max_len': 0, 'total_len': 0} # Return identity for merge (all occupied, length 0)
#   if `L <= start` and `end <= R`: # Current node's range fully contained in query range
#     return `tree[node_idx]`
#   `mid = (start + end) // 2`
#   `p1 = query(2 * node_idx, start, mid, L, R)`
#   `p2 = query(2 * node_idx + 1, mid + 1, end, L, R)`
#   return `merge(p1, p2)`

# `MAX_COORD = 50000` is enough since `x` values are up to `5 * 10^4`.
# A block `sz` must fit in `[0, x]`. This means it needs to be placed at `p` such that `p >= 0` and `p + sz - 1 <= x`.
# So we need a free segment of length `sz` within `[0, x]`.
# Query the segment tree for the range `[0, x]`. Get the `max_len`. If `max_len >= sz`, return true.

# Let's consider `MAX_COORD` carefully.
# The problem constraints state `x, sz <= min(5 * 10^4, 3 * queries.length)`.
# If `queries.length = 15 * 10^4`, then `3 * queries.length = 45 * 10^4`. So `x, sz` can be up to `5 * 10^4`.
# The largest `x` we might care about is `5 * 10^4`.
# The range for the segment tree should cover up to this maximum `x`. So `[0, 50000]` is reasonable.
# `MAX_POS = 50000`. Size of `tree` array: `4 * (MAX_POS + 1)`.

# Let's trace Example 1: `queries = [[1,2],[2,3,3],[2,3,1],[2,2,2]]`
# `MAX_POS = 3` for this example. Initial tree `[0,3]`:
# Node for `[0,3]`: pref=4, suff=4, max_len=4
# Node for `[0,1]`: pref=2, suff=2, max_len=2
# Node for `[2,3]`: pref=2, suff=2, max_len=2

# 1. `[1,2]`: Place obstacle at `x=2`.
#   `update(root, 0, MAX_POS, 2, True)`
#   Leaf `2` becomes `pref=0, suff=0, max_len=0, total_len=1`.
#   Parent `[2,3]` becomes `merge(leaf 2, leaf 3)`:
#     leaf 2: {0,0,0,1}
#     leaf 3: {1,1,1,1} (free)
#     parent `[2,3]`: pref=0 (from leaf 2), suff=1 (from leaf 3), max_len=1 (from leaf 3, or if 2 was free, 0+1=1).
#     Specifically:
#       res['pref'] = p1['pref'] = 0.
#       res['suff'] = p2['suff'] = 1. p2['suff'] == p2['total_len']? Yes. So res['suff'] += p1['suff'] = 1 + 0 = 1.
#       res['max_len'] = max(p1['max_len']=0, p2['max_len']=1, p1['suff']+p2['pref']=0+0=0) = 1.
#     Node `[2,3]` is now `{'pref': 0, 'suff': 1, 'max_len': 1, 'total_len': 2}`.
#   Root `[0,3]` becomes `merge([0,1], [2,3])`:
#     Node `[0,1]`: {2,2,2,2} (still free)
#     Node `[2,3]`: {0,1,1,2}
#     Root `[0,3]`:
#       res['pref'] = p1['pref'] = 2. p1['pref'] == p1['total_len']? Yes. So res['pref'] += p2['pref'] = 2+0 = 2.
#       res['suff'] = p2['suff'] = 1. p2['suff'] == p2['total_len']? No (1 != 2). So res['suff'] = 1.
#       res['max_len'] = max(p1['max_len']=2, p2['max_len']=1, p1['suff']+p2['pref']=2+0=2) = 2.
#     Node `[0,3]` is now `{'pref': 2, 'suff': 1, 'max_len': 2, 'total_len': 4}`.

# 2. `[2,3,3]`: Check if block of size `sz=3` can be placed in `[0,3]`.
#   `query(root, 0, MAX_POS, 0, 3)`
#   Returns `tree[root]` which is `{'pref': 2, 'suff': 1, 'max_len': 2, 'total_len': 4}`.
#   `max_len = 2`. `sz = 3`. `2 < 3`. So, `False`.
#   This is correct: we can place block of size 2 at [0,2) or [0,1], or block of size 1 at [3,4) or [3,3].
#   Free positions are 0, 1, 3. Max consecutive free positions is 2 (at 0,1).
#   Result: `[False]`

# 3. `[2,3,1]`: Check if block of size `sz=1` can be placed in `[0,3]`.
#   `query(root, 0, MAX_POS, 0, 3)`
#   Returns `tree[root]`: `max_len = 2`. `sz = 1`. `2 >= 1`. So, `True`.
#   Result: `[False, True]`

# 4. `[2,2,2]`: Check if block of size `sz=2` can be placed in `[0,2]`.
#   `query(root, 0, MAX_POS, 0, 2)`
#   Need to query range `[0,2]`.
#   `mid = (0+3)//2 = 1`. Query left child `[0,1]`, right child `[2,3]`.
#   `p1 = query(left_child, 0, 1, 0, 2)`: `[0,1]` fully contained. Returns `tree[child_0_1]` = `{2,2,2,2}`.
#   `p2 = query(right_child, 2, 3, 0, 2)`: Query range `[0,2]` overlaps with `[2,3]` only at point `2`.
#     `start=2, end=3, L=0, R=2`. `L <= start` is false. `end <= R` is false.
#     `mid = (2+3)//2 = 2`.
#     `p2_left = query(leaf 2, 2, 2, 0, 2)`: `[2,2]` fully contained. Returns `tree[leaf_2]` = `{0,0,0,1}`.
#     `p2_right = query(leaf 3, 3, 3, 0, 2)`: `R < start` (2 < 3) is true. Returns `{'pref': 0, 'suff': 0, 'max_len': 0, 'total_len': 0}`.
#     `merge(p2_left, p2_right)`: merge({0,0,0,1}, {0,0,0,0}) gives {0,0,0,1}. So `p2` is `{0,0,0,1}`.
#   `merge(p1, p2)` = merge({2,2,2,2}, {0,0,0,1}):
#     `res['pref'] = p1['pref'] = 2`. (p1['pref']==p1['total_len'], so res['pref'] += p2['pref'] = 2+0 = 2).
#     `res['suff'] = p2['suff'] = 0`. (p2['suff']==p2['total_len'] no).
#     `res['max_len'] = max(p1['max_len']=2, p2['max_len']=0, p1['suff']+p2['pref']=2+0=2) = 2`.
#   So query for `[0,2]` returns `{pref: 2, suff: 0, max_len: 2, total_len: 3}` (this total_len is wrong, should be what the node represents `[0,2]`, but it does not matter for the logic here).
#   `max_len = 2`. `sz = 2`. `2 >= 2`. So, `True`.
#   Result: `[False, True, True]`
#   Example output matches. The logic seems to be correct.

# `MAX_POS` value:
# `x` is `1 <= x <= min(5 * 10^4, 3 * queries.length)`.
# This implies `x` can be up to `50000`.
# Segment tree needs to cover `0` up to `50000`. So indices `0, ..., 50000`. Total `50001` elements.
# `MAX_COORD_VAL = 50000`.
# Array for segment tree `4 * (MAX_COORD_VAL + 1)` is approx `200004` nodes.
# Each node stores a dictionary of 4 values.
# Building the tree takes `O(MAX_COORD_VAL)`.
# Each update/query takes `O(log MAX_COORD_VAL)`.
# Total time complexity: `O(MAX_COORD_VAL + Q * log MAX_COORD_VAL)`.
# `Q = 1.5 * 10^4`. `MAX_COORD_VAL = 5 * 10^4`.
# `5 * 10^4 + 1.5 * 10^4 * log(5 * 10^4)`
# `log2(50000)` is approx `15.6`. So `16`.
# `50000 + 15000 * 16 = 50000 + 240000 = 290000`. This should be efficient enough.

# Space complexity: `O(MAX_COORD_VAL)` for the segment tree.
# `5 * 10^4` elements, each a dict of 4 ints. Reasonable.

# Python recursion depth limit might be an issue. `log_2(50000)` is about 16, so the recursion depth is small.
# Default recursion limit in Python is usually 1000. So no need to worry.

# One edge case: what if `x=0`?
# A block `sz` in `[0,0]`. Needs `p + sz - 1 <= 0`.
# If `sz=1`, `p=0`, `0+1-1=0 <= 0`. Possible. Needs `[0,0]` to be free.
# Query range `[0, x]`. If `x=0`, query `[0,0]`. Max length of free segment within `[0,0]`.
# If point 0 is free, max_len is 1. If `sz=1`, true. If `sz>1`, false. This seems correct.

class SegmentTree:
    def __init__(self, max_coord):
        # max_coord is the highest possible coordinate value (inclusive).
        # We need to cover range [0, max_coord]. So total_points = max_coord + 1.
        self.max_coord = max_coord
        self.tree = [None] * (4 * (max_coord + 1)) # Each node stores a dictionary
        self._build(1, 0, self.max_coord)

    # Helper function to merge two segment tree node results
    # Each node result is a dictionary: {'pref': ..., 'suff': ..., 'max_len': ..., 'total_len': ...}
    def _merge(self, left_child_data, right_child_data):
        # Base case: if one child is empty (e.g., query range outside), return the other child's data
        # An empty segment is represented by {'pref': 0, 'suff': 0, 'max_len': 0, 'total_len': 0}
        if left_child_data['total_len'] == 0:
            return right_child_data
        if right_child_data['total_len'] == 0:
            return left_child_data

        res = {
            'pref': 0,
            'suff': 0,
            'max_len': 0,
            'total_len': left_child_data['total_len'] + right_child_data['total_len']
        }

        # Calculate max_prefix_free
        res['pref'] = left_child_data['pref']
        if left_child_data['pref'] == left_child_data['total_len']:
            # If left child is entirely free, add right child's prefix
            res['pref'] += right_child_data['pref']

        # Calculate max_suffix_free
        res['suff'] = right_child_data['suff']
        if right_child_data['suff'] == right_child_data['total_len']:
            # If right child is entirely free, add left child's suffix
            res['suff'] += left_child_data['suff']

        # Calculate max_total_free
        # It can be from left child, right child, or crossing the boundary
        res['max_len'] = max(
            left_child_data['max_len'],
            right_child_data['max_len'],
            left_child_data['suff'] + right_child_data['pref']
        )
        return res

    # Build the segment tree
    # Initially, all points are free, so max_len, pref, suff are equal to total_len
    def _build(self, node_idx, start, end):
        if start == end:
            # Leaf node: a single point, initially free
            self.tree[node_idx] = {'pref': 1, 'suff': 1, 'max_len': 1, 'total_len': 1}
            return

        mid = (start + end) // 2
        self._build(2 * node_idx, start, mid)
        self._build(2 * node_idx + 1, mid + 1, end)
        self.tree[node_idx] = self._merge(self.tree[2 * node_idx], self.tree[2 * node_idx + 1])

    # Update a point (obstacle placement)
    # is_obstacle = True to place an obstacle, False to remove (not used in this problem)
    def update(self, node_idx, start, end, idx, is_obstacle):
        if start == end:
            # Reached the leaf node for 'idx'
            if is_obstacle:
                # Point 'idx' becomes an obstacle, so all lengths are 0
                self.tree[node_idx] = {'pref': 0, 'suff': 0, 'max_len': 0, 'total_len': 1}
            else:
                # Point 'idx' becomes free
                self.tree[node_idx] = {'pref': 1, 'suff': 1, 'max_len': 1, 'total_len': 1}
            return

        mid = (start + end) // 2
        if idx <= mid:
            self.update(2 * node_idx, start, mid, idx, is_obstacle)
        else:
            self.update(2 * node_idx + 1, mid + 1, end, idx, is_obstacle)
        # After updating children, re-merge their results
        self.tree[node_idx] = self._merge(self.tree[2 * node_idx], self.tree[2 * node_idx + 1])

    # Query the maximum free segment length within a given range [L, R]
    def query(self, node_idx, start, end, L, R):
        # Current node's range [start, end] is outside the query range [L, R]
        if R < start or end < L:
            return {'pref': 0, 'suff': 0, 'max_len': 0, 'total_len': 0} # Identity for merge operation

        # Current node's range [start, end] is completely within the query range [L, R]
        if L <= start and end <= R:
            return self.tree[node_idx]

        # Current node's range partially overlaps with query range
        mid = (start + end) // 2
        p1 = self.query(2 * node_idx, start, mid, L, R)
        p2 = self.query(2 * node_idx + 1, mid + 1, end, L, R)
        return self._merge(p1, p2)

class Solution:
    def blockPlacementQueries(self, queries: list[list[int]]) -> list[bool]:
        # Determine the maximum coordinate value that can appear in queries
        # Max x or sz can be up to 5 * 10^4
        # We need to consider coordinates from 0 up to max_x.
        # So the segment tree should cover 0 to MAX_COORD_VAL.
        MAX_COORD_VAL = 0
        for query in queries:
            if query[0] == 1:
                MAX_COORD_VAL = max(MAX_COORD_VAL, query[1])
            else: # query[0] == 2
                MAX_COORD_VAL = max(MAX_COORD_VAL, query[1])

        # Initialize the Segment Tree
        # It will manage points from 0 up to MAX_COORD_VAL
        seg_tree = SegmentTree(MAX_COORD_VAL)
        
        results = []
        for query in queries:
            query_type = query[0]
            if query_type == 1:
                x = query[1]
                # Place an obstacle at x.
                # Update the segment tree: point x is now occupied.
                seg_tree.update(1, 0, MAX_COORD_VAL, x, True)
            else: # query_type == 2
                x, sz = query[1], query[2]
                # Check if a block of size sz can be placed in [0, x].
                # This means we need a continuous free segment of at least size sz within [0, x].
                # Query the segment tree for the range [0, x].
                # The 'max_len' property from the query result gives the maximum length
                # of any free segment found within [0, x].
                query_res = seg_tree.query(1, 0, MAX_COORD_VAL, 0, x)
                
                # If the maximum available free length is greater than or equal to sz, it's possible.
                results.append(query_res['max_len'] >= sz)
                
        return results

# Time Complexity:
# Building the segment tree: O(MAX_COORD_VAL) where MAX_COORD_VAL is the maximum possible coordinate (approx 5 * 10^4).
# Each query operation (type 1 or type 2): O(log MAX_COORD_VAL).
# There are Q queries (up to 1.5 * 10^4).
# Total time complexity: O(MAX_COORD_VAL + Q * log MAX_COORD_VAL).
# With given constraints, this is roughly O(5 * 10^4 + 1.5 * 10^4 * log(5 * 10^4)) which is approximately O(50000 + 15000 * 16) = O(50000 + 240000) = O(290000) operations. This is efficient enough.

# Space Complexity:
# The segment tree stores nodes for coordinates from 0 to MAX_COORD_VAL.
# The size of the tree array is approximately 4 * MAX_COORD_VAL.
# Each node stores a dictionary with a few integer values.
# Total space complexity: O(MAX_COORD_VAL).
# With MAX_COORD_VAL = 5 * 10^4, this is O(2 * 10^5) elements. This is also manageable.