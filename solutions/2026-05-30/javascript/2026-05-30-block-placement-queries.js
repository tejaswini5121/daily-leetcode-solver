/**
 * @param {number[][]} queries
 * @return {boolean[]}
 */

/*
Problem Summary:
This problem involves managing obstacles on an infinite number line and determining if a block of a given size can be placed within a specified range without overlapping any obstacles.

Link: https://leetcode.com/problems/block-placement-queries/

Approach:
The core idea is to efficiently find the largest available space for placing a block. Since we are dealing with ranges and updates (adding obstacles), a data structure that can handle range queries and point updates is suitable. A Segment Tree or a Binary Indexed Tree (BIT) can be used.

We will use a Segment Tree to maintain the maximum available space ending at each position. The segment tree will cover the maximum possible coordinate (which is bounded by the maximum `x` in queries, up to 5 * 10^4).

For each query:
1. Type 1 query ([1, x]): Add an obstacle at position `x`. This means the maximum available space ending at `x` and any position before `x` might be affected. We need to update the segment tree. However, simply marking `x` as occupied isn't enough because the "available space" depends on the *previous* obstacle. A better approach for type 1 is to store the obstacles in a sorted list. When an obstacle is added, we can insert it into the sorted list.

2. Type 2 query ([2, x, sz]): Check if a block of size `sz` can be placed in the range `[0, x]`. This means we need to find if there's any contiguous segment of length `sz` within `[0, x]` that doesn't intersect any obstacle.
   Consider the obstacles within the range `[0, x]`. Let these obstacles be `o_1, o_2, ..., o_k` in increasing order. The available spaces are `[0, o_1-1]`, `[o_1+1, o_2-1]`, ..., `[o_k+1, x]`.
   We need to find the maximum length of any of these available contiguous segments. If this maximum length is greater than or equal to `sz`, then it's possible to place the block.

   To efficiently find the obstacles within `[0, x]` and the gaps between them, we can maintain a sorted list of obstacles. For a query `[2, x, sz]`, we can find the obstacles less than or equal to `x` using binary search. Let the obstacles be `obs = [o_1, o_2, ..., o_n]` sorted.
   The available segments are `[0, o_1-1]`, `[o_1+1, o_2-1]`, `[o_2+1, o_3-1]`, ..., `[o_n+1, x]`.
   We need to calculate the lengths of these segments and find the maximum.

   A more efficient approach for type 2 queries is to use a Segment Tree that stores, for each node representing a range `[L, R]`, the maximum available contiguous space ending at `R` within that range.
   When a type 1 query `[1, x]` arrives, we add `x` to our set of obstacles. We can use a `SortedSet` or a `Map` to store obstacles and their preceding available space.

   Let's refine the Segment Tree approach. We want to know, for a given `x`, what is the maximum length of a free segment ending at `x`.
   - When we add an obstacle at `x` (Type 1):
     The maximum free space ending at `x` becomes 0.
     The maximum free space ending at any `y > x` will be `max(current_max_free_space[y], max_free_space_ending_before_x)`. This seems complicated.

   Alternative Segment Tree approach:
   Store in each segment tree node `[L, R]`:
   - `max_free_prefix`: The maximum length of a free segment starting at `L` within `[L, R]`.
   - `max_free_suffix`: The maximum length of a free segment ending at `R` within `[L, R]`.
   - `max_free_total`: The maximum length of a free segment anywhere within `[L, R]`.
   - `size`: The total size of the range `[L, R]`.

   When an obstacle `x` is added:
   We update the segment tree at index `x`. The node representing `x` will have `max_free_prefix = 0`, `max_free_suffix = 0`, `max_free_total = 0`.
   When querying for `[2, x, sz]`:
   We query the segment tree for the range `[0, x]`. The result from the query will give us the `max_free_total` within `[0, x]`. If this is `>= sz`, then it's possible.

   Let's reconsider the Segment Tree state.
   We can use a Segment Tree where each leaf `i` stores the maximum length of a *free segment ending at `i`*.
   `tree[i]` = maximum length of a free segment ending at position `i`.
   Initialize all `tree` values to 1 (assuming an infinite line initially is all free).
   When a type 1 query `[1, x]` occurs:
   We set `tree[x]` to 0.
   This change propagates upwards. A node covering `[L, R]` will store the maximum of its children. This is not quite right.

   Let's use a `Map` or `SortedList` to store the *obstacles*.
   When a type 1 query `[1, x]` arrives, add `x` to the obstacles.
   When a type 2 query `[2, x, sz]` arrives:
   We are looking for a free segment of length `sz` within `[0, x]`.
   Consider the obstacles in the range `[0, x]`. Let them be `o_1, o_2, ..., o_k` sorted.
   The gaps are `[0, o_1-1]`, `[o_1+1, o_2-1]`, ..., `[o_k+1, x]`.
   We need to find the maximum length of these gaps.

   This suggests that we need to efficiently query for the nearest obstacle to the left and right of a given position.
   If we use a `SortedSet` (like `TreeSet` in Java, or `SortedList` in Python with libraries, or simulate it in JS) to store obstacles, for a query `[2, x, sz]`:
   1. Find all obstacles `o <= x`.
   2. Consider these obstacles and `0` and `x`.
   3. The maximum gap is `max(o_i - o_{i-1} - 1)` for consecutive obstacles `o_{i-1}, o_i` in `[0, x]`.
   Also, we need to consider the gap from `0` to the first obstacle, and from the last obstacle to `x`.

   This approach requires iterating through obstacles for each query, which can be too slow if there are many obstacles.
   The problem constraints `queries.length <= 15 * 10^4` and `x, sz <= 5 * 10^4` suggest a logarithmic time complexity per query.

   Let's use a Segment Tree to maintain the maximum free space.
   We need to map the original coordinates to indices if they are sparse. However, the coordinates are up to 5 * 10^4, so a segment tree on this range is feasible.
   Let the segment tree cover the range `[0, 50000]`.
   For a node representing range `[L, R]`, we store:
   - `maxLen`: The maximum length of a contiguous free segment within `[L, R]`.
   - `prefixLen`: The length of the free segment starting at `L` within `[L, R]`.
   - `suffixLen`: The length of the free segment ending at `R` within `[L, R]`.
   - `totalLen`: The total length of the range `[L, R]`.

   When an obstacle is placed at `x` (Type 1):
   We update the leaf node corresponding to `x`. For this leaf, `maxLen`, `prefixLen`, `suffixLen` become 0.
   We then propagate this update upwards. For a parent node `[L, R]` with children `[L, M]` and `[M+1, R]`:
   - `node.totalLen = child_left.totalLen + child_right.totalLen`
   - `node.prefixLen = child_left.prefixLen`
     If `child_left.prefixLen == child_left.totalLen` (meaning the whole left child range is free), then `node.prefixLen = child_left.totalLen + child_right.prefixLen`.
   - `node.suffixLen = child_right.suffixLen`
     If `child_right.suffixLen == child_right.totalLen` (meaning the whole right child range is free), then `node.suffixLen = child_right.totalLen + child_left.suffixLen`.
   - `node.maxLen = max(child_left.maxLen, child_right.maxLen, child_left.suffixLen + child_right.prefixLen)`

   When querying for `[2, x, sz]` (Type 2):
   We query the segment tree for the range `[0, x]`. The query function will return a `Node` object representing the aggregate information for `[0, x]`. We check if `query_result.maxLen >= sz`.

   The maximum coordinate can be up to 50000. The segment tree will need to handle this range.
   The maximum number of queries is 150000. If `x` values are distributed, the actual range might be smaller. However, we need to pre-allocate or dynamically manage the segment tree size. Let's use a fixed size up to 50000.

   Maximum coordinate: 50000. Let's make the segment tree cover up to `MAX_COORD = 50000`.
   The segment tree will have nodes indexed `1` to `4 * MAX_COORD`.

   Segment Tree Structure:
   We need a `Node` class/object with `maxLen`, `prefixLen`, `suffixLen`, `totalLen`.
   The segment tree will be an array `tree` where `tree[v]` is a `Node`.

   `build(v, tl, tr)`: Initializes the segment tree. For range `[tl, tr]`, `tree[v]` will have `maxLen = tr - tl + 1`, `prefixLen = tr - tl + 1`, `suffixLen = tr - tl + 1`, `totalLen = tr - tl + 1`.

   `update(v, tl, tr, pos)`: Sets the leaf at `pos` to represent an obstacle (all lengths 0). Then propagates up.
   `pos` is the coordinate where the obstacle is placed.

   `query(v, tl, tr, l, r)`: Returns a `Node` representing the aggregated information for the range `[l, r]`.
   If `[tl, tr]` is completely outside `[l, r]`, return an identity node (e.g., lengths 0, totalLen 0).
   If `[tl, tr]` is completely inside `[l, r]`, return `tree[v]`.
   Otherwise, recursively query children and combine results.

   Combining results from two nodes `left_res` and `right_res`:
   `combined_res.totalLen = left_res.totalLen + right_res.totalLen`
   `combined_res.prefixLen = left_res.prefixLen`
   If `left_res.prefixLen == left_res.totalLen`:
     `combined_res.prefixLen += right_res.prefixLen`
   `combined_res.suffixLen = right_res.suffixLen`
   If `right_res.suffixLen == right_res.totalLen`:
     `combined_res.suffixLen += left_res.suffixLen`
   `combined_res.maxLen = max(left_res.maxLen, right_res.maxLen, left_res.suffixLen + right_res.prefixLen)`

   The maximum coordinate is 50000.
   The coordinate range for the segment tree will be `[0, MAX_COORD - 1]` or `[1, MAX_COORD]`. Let's use `[0, 50000]`. The indices of the segment tree array will be `0` to `N-1` where `N` is around 50001. The tree array size will be roughly `4 * N`.

   Let's define `MAX_COORD = 50001` to handle coordinates up to 50000.
   The segment tree will operate on indices `0` to `MAX_COORD - 1`.

   Node structure:
   `{ maxLen: 0, prefixLen: 0, suffixLen: 0, totalLen: 0 }`

   Identity node for combination:
   `{ maxLen: 0, prefixLen: 0, suffixLen: 0, totalLen: 0 }`

   Initial build:
   For range `[tl, tr]`:
   `totalLen = tr - tl + 1`
   `maxLen = totalLen`
   `prefixLen = totalLen`
   `suffixLen = totalLen`

   Update function `update(v, tl, tr, pos)`:
   If `tl == tr` (leaf node):
     `tree[v] = { maxLen: 0, prefixLen: 0, suffixLen: 0, totalLen: 1 }`
   Else:
     `tm = floor((tl + tr) / 2)`
     If `pos <= tm`: `update(2*v, tl, tm, pos)`
     Else: `update(2*v+1, tm+1, tr, pos)`
     `tree[v] = combine(tree[2*v], tree[2*v+1])`

   Query function `query(v, tl, tr, l, r)`:
   If `l > r`: return identity node.
   If `l == tl && r == tr`: return `tree[v]`.
   `tm = floor((tl + tr) / 2)`
   `left_res = query(2*v, tl, tm, l, min(r, tm))`
   `right_res = query(2*v+1, tm+1, tr, max(l, tm+1), r)`
   Return `combine(left_res, right_res)`

   Maximum coordinate is 50000. Let's use `N = 50001` for the range `[0, N-1]`.
   Segment tree array size: `4 * N`.

   Initial values for segment tree:
   All `tree` nodes should be initialized for the range `[0, N-1]`.
   `build(1, 0, N-1)`

   Let's write the `combine` function carefully.
   `combine(left, right)`:
   `res = { totalLen: left.totalLen + right.totalLen }`
   `res.prefixLen = left.prefixLen`
   if `left.prefixLen == left.totalLen`:
     `res.prefixLen += right.prefixLen`
   `res.suffixLen = right.suffixLen`
   if `right.suffixLen == right.totalLen`:
     `res.suffixLen += left.suffixLen`
   `res.maxLen = Math.max(left.maxLen, right.maxLen, left.suffixLen + right.prefixLen)`
   return `res`

   The maximum coordinate in queries is `min(5 * 10^4, 3 * queries.length)`.
   If `queries.length = 15 * 10^4`, then `3 * queries.length = 45 * 10^4`. So max coordinate is `5 * 10^4`.
   Let `MAX_COORD = 50001`. Segment tree operates on `[0, MAX_COORD - 1]`.

   The segment tree nodes can be stored as objects.
   `tree = new Array(4 * MAX_COORD)`
   Initialize `tree` with default node objects.

   Let's trace Example 1:
   `queries = [[1,2],[2,3,3],[2,3,1],[2,2,2]]`
   `MAX_COORD = 50001` (or larger if needed, but problem constraint suggests up to 50000)
   Initialize segment tree for range `[0, 50000]`. All are free.

   1. `[1, 2]`: Obstacle at 2.
      `update(1, 0, 50000, 2)`
      Leaf node for 2 becomes `{ maxLen: 0, prefixLen: 0, suffixLen: 0, totalLen: 1 }`.
      This updates ancestor nodes.

   2. `[2, 3, 3]`: Check block size 3 in `[0, 3]`.
      `query(1, 0, 50000, 0, 3)`
      This query will traverse the tree and combine results for ranges `[0, 1]`, `[2, 2]`, `[3, 3]`.
      Let's assume the segment tree correctly represents the state.
      After obstacle at 2:
      - Range `[0, 1]` is free. Node for `[0, 1]` will be `{ maxLen: 2, prefixLen: 2, suffixLen: 2, totalLen: 2 }`.
      - Range `[2, 2]` has an obstacle. Node for `[2, 2]` is `{ maxLen: 0, prefixLen: 0, suffixLen: 0, totalLen: 1 }`.
      - Range `[3, 3]` is free. Node for `[3, 3]` is `{ maxLen: 1, prefixLen: 1, suffixLen: 1, totalLen: 1 }`.

      Combining `[0, 1]` and `[2, 2]`:
      `left = { maxLen: 2, prefixLen: 2, suffixLen: 2, totalLen: 2 }`
      `right = { maxLen: 0, prefixLen: 0, suffixLen: 0, totalLen: 1 }`
      `combine(left, right)`:
      `totalLen = 2 + 1 = 3`
      `prefixLen = left.prefixLen` (since `left.prefixLen == left.totalLen`)
      `prefixLen = 2 + right.prefixLen = 2 + 0 = 2`.
      `suffixLen = right.suffixLen = 0`.
      `maxLen = max(left.maxLen, right.maxLen, left.suffixLen + right.prefixLen)`
      `maxLen = max(2, 0, 2 + 0) = 2`.
      Result for `[0, 2]` is `{ maxLen: 2, prefixLen: 2, suffixLen: 0, totalLen: 3 }`.

      Now combine this with `[3, 3]`:
      `left = { maxLen: 2, prefixLen: 2, suffixLen: 0, totalLen: 3 }` (for `[0, 2]`)
      `right = { maxLen: 1, prefixLen: 1, suffixLen: 1, totalLen: 1 }` (for `[3, 3]`)
      `combine(left, right)`:
      `totalLen = 3 + 1 = 4`
      `prefixLen = left.prefixLen = 2`.
      `suffixLen = right.suffixLen = 1`.
      `maxLen = max(left.maxLen, right.maxLen, left.suffixLen + right.prefixLen)`
      `maxLen = max(2, 1, 0 + 1) = 2`.
      Result for `[0, 3]` is `{ maxLen: 2, prefixLen: 2, suffixLen: 1, totalLen: 4 }`.

      Query result for `[0, 3]` has `maxLen = 2`.
      Is `maxLen >= sz`? `2 >= 3` is False.
      So, `results.push(false)`. Correct for example 1.

   3. `[2, 3, 1]`: Check block size 1 in `[0, 3]`.
      `query(1, 0, 50000, 0, 3)` again.
      Result is `{ maxLen: 2, prefixLen: 2, suffixLen: 1, totalLen: 4 }`.
      Is `maxLen >= sz`? `2 >= 1` is True.
      So, `results.push(true)`. Correct for example 1.

   4. `[2, 2, 2]`: Check block size 2 in `[0, 2]`.
      `query(1, 0, 50000, 0, 2)`
      This would combine results for `[0, 1]` and `[2, 2]`.
      `[0, 1]` is `{ maxLen: 2, prefixLen: 2, suffixLen: 2, totalLen: 2 }`.
      `[2, 2]` is `{ maxLen: 0, prefixLen: 0, suffixLen: 0, totalLen: 1 }`.
      Combined for `[0, 2]`: `{ maxLen: 2, prefixLen: 2, suffixLen: 0, totalLen: 3 }`.
      Is `maxLen >= sz`? `2 >= 2` is True.
      So, `results.push(true)`. Correct for example 1.

   The segment tree approach seems sound.

   Maximum value of `x` is 50000. So `MAX_COORD = 50001` for indices `0` to `50000`.
   The segment tree array size should be `4 * MAX_COORD`.

   Double check constraints and potential edge cases:
   - Coordinates are positive integers.
   - Range `[0, x]`.
   - Block entirely lies in `[0, x]`.

   The segment tree needs to be initialized to represent the entire line as free.
   The `build` function will initialize `tree[v]` for the range `[tl, tr]`.
   `tree[1]` will cover `[0, MAX_COORD - 1]`.

   The `combine` logic is critical.
   `left.suffixLen + right.prefixLen`: this is the maximum gap that spans across the midpoint.
   If `left.prefixLen == left.totalLen`, it means the entire left segment is free. So, its prefix can extend into the right segment.
   Similarly for `suffixLen`.

   The coordinates can go up to 50000. What if `queries.length` is small, say 10? Then `3 * queries.length = 30`. But `x` can be up to `5 * 10^4`. So, the segment tree must cover the maximum possible coordinate, which is `5 * 10^4`.
   Let `MAX_COORD = 50001`.
   The segment tree operates on `[0, MAX_COORD-1]`.

   The `Node` object can be defined.
   The `SegmentTree` class can encapsulate `tree`, `MAX_COORD`, `build`, `update`, `query`, `combine`.

   Consider the problem constraints on `x, sz <= min(5 * 10^4, 3 * queries.length)`.
   This means `x` and `sz` will not exceed `5 * 10^4`. So, `MAX_COORD = 50001` is appropriate for indices `0` to `50000`.

   Initialization of segment tree:
   The `build` function should be called once at the beginning.
   `build(1, 0, MAX_COORD - 1)`

   The update operation is `update(1, 0, MAX_COORD - 1, pos)`.
   The query operation is `query(1, 0, MAX_COORD - 1, 0, x)`.

   The `results` array will store booleans.

   ```javascript
   const MAX_COORD = 50001; // Coordinates up to 50000, so range [0, 50000]
   // Segment tree node structure
   class Node {
       constructor(maxLen = 0, prefixLen = 0, suffixLen = 0, totalLen = 0) {
           this.maxLen = maxLen;       // Max free segment in this range
           this.prefixLen = prefixLen; // Max free segment starting at the left boundary of this range
           this.suffixLen = suffixLen; // Max free segment ending at the right boundary of this range
           this.totalLen = totalLen;   // Total length of this range
       }
   }

   // Identity node for combining, represents an empty range or invalid range.
   const IDENTITY_NODE = new Node(0, 0, 0, 0);

   // Array to store segment tree nodes
   const tree = new Array(4 * MAX_COORD);

   // Function to combine results from two child nodes
   function combine(left, right) {
       const res = new Node();
       res.totalLen = left.totalLen + right.totalLen;

       // Calculate prefixLen
       res.prefixLen = left.prefixLen;
       if (left.prefixLen === left.totalLen) { // If left child range is fully free
           res.prefixLen += right.prefixLen;
       }

       // Calculate suffixLen
       res.suffixLen = right.suffixLen;
       if (right.suffixLen === right.totalLen) { // If right child range is fully free
           res.suffixLen += left.suffixLen;
       }

       // Calculate maxLen
       res.maxLen = Math.max(left.maxLen, right.maxLen, left.suffixLen + right.prefixLen);

       return res;
   }

   // Build the segment tree
   // v: current node index
   // tl, tr: range covered by the current node [tl, tr]
   function build(v, tl, tr) {
       if (tl === tr) { // Leaf node
           tree[v] = new Node(1, 1, 1, 1); // Initially, each position is a free segment of length 1
       } else {
           const tm = Math.floor((tl + tr) / 2);
           build(2 * v, tl, tm);
           build(2 * v + 1, tm + 1, tr);
           tree[v] = combine(tree[2 * v], tree[2 * v + 1]);
       }
   }

   // Update function: place an obstacle at 'pos'
   // v: current node index
   // tl, tr: range covered by the current node [tl, tr]
   // pos: coordinate of the obstacle
   function update(v, tl, tr, pos) {
       if (tl === tr) { // Leaf node corresponding to the obstacle position
           tree[v] = new Node(0, 0, 0, 1); // Obstacle means this position is not free (length 1, but max free is 0)
       } else {
           const tm = Math.floor((tl + tr) / 2);
           if (pos <= tm) {
               update(2 * v, tl, tm, pos);
           } else {
               update(2 * v + 1, tm + 1, tr, pos);
           }
           tree[v] = combine(tree[2 * v], tree[2 * v + 1]);
       }
   }

   // Query function: find the aggregated info for range [l, r]
   // v: current node index
   // tl, tr: range covered by the current node [tl, tr]
   // l, r: query range [l, r]
   function query(v, tl, tr, l, r) {
       if (l > r) { // Query range is invalid or completely outside current node's range
           return IDENTITY_NODE;
       }
       if (l === tl && r === tr) { // Current node's range is fully within the query range
           return tree[v];
       }
       const tm = Math.floor((tl + tr) / 2);
       // Recursively query left and right children, then combine results
       const leftResult = query(2 * v, tl, tm, l, Math.min(r, tm));
       const rightResult = query(2 * v + 1, tm + 1, tr, Math.max(l, tm + 1), r);
       return combine(leftResult, rightResult);
   }


   var blockPlacementQueries = function(queries) {
       const results = [];
       // Reset and build the segment tree for each test case if it were multiple,
       // but LeetCode usually handles this by creating new objects or scope.
       // For a single function call, we initialize once.
       // Re-initialize tree elements if necessary, or ensure they are properly set.
       // For this problem, we can assume a single setup per test case run.

       // Initialize all tree nodes with default values before build
       // This is crucial if the same tree array is reused across test cases.
       // However, for typical LeetCode, a fresh instance is often implied.
       // A safer approach for reusable tree:
       for(let i = 0; i < tree.length; i++) {
           tree[i] = new Node(); // Default empty node
       }
       build(1, 0, MAX_COORD - 1); // Build the tree for the full range [0, MAX_COORD-1]

       for (const queryArr of queries) {
           if (queryArr[0] === 1) {
               // Type 1 query: place an obstacle
               const x = queryArr[1];
               update(1, 0, MAX_COORD - 1, x);
           } else {
               // Type 2 query: check if a block can be placed
               const x = queryArr[1];
               const sz = queryArr[2];

               // The query is for range [0, x]
               // We need to ensure x is within our segment tree bounds.
               // Since problem states x <= 5*10^4, MAX_COORD is sufficient.
               // If x > MAX_COORD - 1, we'd query up to MAX_COORD - 1.
               // But x is guaranteed to be within reasonable bounds for the problem.

               // Ensure query range [0, x] is valid for segment tree
               const queryRangeMax = Math.min(x, MAX_COORD - 1);
               if (queryRangeMax < 0) { // Should not happen given constraints
                   results.push(false);
                   continue;
               }

               const res = query(1, 0, MAX_COORD - 1, 0, queryRangeMax);

               // Check if the maximum free segment in [0, x] is at least 'sz'
               results.push(res.maxLen >= sz);
           }
       }
       return results;
   };

*/
const MAX_COORD = 50001; // We consider coordinates from 0 up to 50000. The range is [0, MAX_COORD - 1].

// Segment tree node structure.
// Each node represents a range on the number line and stores information about free segments within that range.
class Node {
    constructor(maxLen = 0, prefixLen = 0, suffixLen = 0, totalLen = 0) {
        this.maxLen = maxLen;       // Maximum length of any contiguous free segment within this node's range.
        this.prefixLen = prefixLen; // Length of the contiguous free segment starting from the left boundary of this node's range.
        this.suffixLen = suffixLen; // Length of the contiguous free segment ending at the right boundary of this node's range.
        this.totalLen = totalLen;   // Total length of the range this node covers.
    }
}

// An identity node is used when a query range is invalid or completely outside a node's responsibility.
// Combining with an identity node should not change the other node's properties.
const IDENTITY_NODE = new Node(0, 0, 0, 0);

// The segment tree is implemented as an array. `tree[v]` stores the Node for the v-th segment tree node.
// The size is 4 * MAX_COORD to accommodate a full binary tree for the range [0, MAX_COORD - 1].
const tree = new Array(4 * MAX_COORD);

// Function to merge the information from two child nodes into their parent node.
// This is the core logic for propagating updates and answering range queries.
function combine(left, right) {
    const res = new Node();
    res.totalLen = left.totalLen + right.totalLen; // Total length is the sum of child lengths.

    // Calculate the prefix length for the combined range.
    // If the left child's entire range is free (prefixLen === totalLen),
    // then its prefix can extend into the right child's range.
    res.prefixLen = left.prefixLen;
    if (left.prefixLen === left.totalLen) {
        res.prefixLen += right.prefixLen;
    }

    // Calculate the suffix length for the combined range.
    // If the right child's entire range is free (suffixLen === totalLen),
    // then its suffix can extend into the left child's range.
    res.suffixLen = right.suffixLen;
    if (right.suffixLen === right.totalLen) {
        res.suffixLen += left.suffixLen;
    }

    // The maximum free segment in the combined range is either:
    // 1. Entirely within the left child's range (left.maxLen).
    // 2. Entirely within the right child's range (right.maxLen).
    // 3. Spanning across the boundary between the left and right children (left.suffixLen + right.prefixLen).
    res.maxLen = Math.max(left.maxLen, right.maxLen, left.suffixLen + right.prefixLen);

    return res;
}

// Builds the segment tree from scratch. Initially, the entire line is considered free.
// v: index of the current node in the `tree` array (1-based indexing for tree nodes).
// tl, tr: the range [tl, tr] covered by the current node `v`.
function build(v, tl, tr) {
    if (tl === tr) { // Leaf node: represents a single point.
        // Initially, each point is a free segment of length 1.
        tree[v] = new Node(1, 1, 1, 1);
    } else {
        const tm = Math.floor((tl + tr) / 2); // Midpoint of the current range.
        // Recursively build left and right children.
        build(2 * v, tl, tm);         // Left child covers [tl, tm].
        build(2 * v + 1, tm + 1, tr); // Right child covers [tm + 1, tr].
        // Combine the results from children to set the properties of the current node.
        tree[v] = combine(tree[2 * v], tree[2 * v + 1]);
    }
}

// Updates the segment tree to reflect the placement of an obstacle at a specific position.
// v: index of the current node.
// tl, tr: range covered by the current node [tl, tr].
// pos: the coordinate where the obstacle is placed.
function update(v, tl, tr, pos) {
    if (tl === tr) { // Found the leaf node corresponding to the obstacle position.
        // An obstacle means this position is no longer free. The free segment length is 0.
        // The total length of this single-point range remains 1.
        tree[v] = new Node(0, 0, 0, 1);
    } else {
        const tm = Math.floor((tl + tr) / 2);
        // Decide whether to go left or right based on the obstacle's position.
        if (pos <= tm) {
            update(2 * v, tl, tm, pos);
        } else {
            update(2 * v + 1, tm + 1, tr, pos);
        }
        // After updating a child, re-combine its properties into the parent node.
        tree[v] = combine(tree[2 * v], tree[2 * v + 1]);
    }
}

// Queries the segment tree for information about a specific range [l, r].
// v: index of the current node.
// tl, tr: range covered by the current node [tl, tr].
// l, r: the query range [l, r].
// Returns a Node object summarizing the free segments within the query range.
function query(v, tl, tr, l, r) {
    // If the query range is invalid (e.g., l > r) or completely outside the current node's range, return the identity node.
    if (l > r || tl > r || tr < l) {
        return IDENTITY_NODE;
    }
    // If the current node's range is fully contained within the query range, return its stored information.
    if (l <= tl && tr <= r) {
        return tree[v];
    }

    const tm = Math.floor((tl + tr) / 2);
    // Recursively query the left and right children for the overlapping parts of the query range.
    const leftResult = query(2 * v, tl, tm, l, Math.min(r, tm));
    const rightResult = query(2 * v + 1, tm + 1, tr, Math.max(l, tm + 1), r);

    // Combine the results from the children.
    return combine(leftResult, rightResult);
}

/**
 * @param {number[][]} queries
 * @return {boolean[]}
 */
var blockPlacementQueries = function(queries) {
    const results = [];

    // Initialize the segment tree for the entire possible range of coordinates.
    // We clear and rebuild for each problem instance as if it were a fresh start.
    // In a typical LeetCode environment, this initialization happens once per function call.
    for (let i = 0; i < tree.length; i++) {
        tree[i] = new Node(); // Initialize all nodes to default/empty state.
    }
    // Build the tree for the range [0, MAX_COORD - 1].
    build(1, 0, MAX_COORD - 1);

    // Process each query.
    for (const queryArr of queries) {
        if (queryArr[0] === 1) {
            // Type 1 query: Place an obstacle.
            const x = queryArr[1]; // The coordinate of the obstacle.
            // Update the segment tree at position 'x'.
            update(1, 0, MAX_COORD - 1, x);
        } else {
            // Type 2 query: Check if a block can be placed.
            const x = queryArr[1];   // The upper bound of the placement range [0, x].
            const sz = queryArr[2]; // The size of the block to place.

            // We need to find the maximum free segment within the range [0, x].
            // Ensure the query range does not exceed MAX_COORD - 1.
            const queryRangeMax = Math.min(x, MAX_COORD - 1);

            // If queryRangeMax is less than 0 (should not happen given constraints), it's impossible.
            if (queryRangeMax < 0) {
                results.push(false);
                continue;
            }

            // Query the segment tree for the range [0, queryRangeMax].
            const res = query(1, 0, MAX_COORD - 1, 0, queryRangeMax);

            // A block of size 'sz' can be placed if the maximum free segment found
            // within the range [0, x] is at least 'sz'.
            results.push(res.maxLen >= sz);
        }
    }
    return results;
};
```