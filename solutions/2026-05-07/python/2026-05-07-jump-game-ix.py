```python
# Problem Summary: Find the maximum reachable value from each index in an array
# given specific jump rules based on element values.
# Link: https://leetcode.com/problems/jump-game-ix/
#
# Approach:
# This problem can be modeled as finding the maximum reachable value in a directed acyclic graph (DAG).
# Each index `i` is a node. An edge exists from `i` to `j` if a valid jump is possible.
# The value of a node is `nums[i]`. We want to find the maximum value reachable from each node.
#
# The jump rules are:
# - From `i` to `j` where `j > i` if `nums[j] < nums[i]`.
# - From `i` to `j` where `j < i` if `nums[j] > nums[i]`.
#
# Notice that a jump always moves to an element that is either smaller (if jumping forward)
# or larger (if jumping backward). This implies that we cannot form cycles that increase
# the value indefinitely.
#
# To efficiently find valid jumps for all indices, we can use monotonic stacks.
#
# 1. Forward Jumps (i to j where j > i and nums[j] < nums[i]):
#    We can use a monotonic decreasing stack to find the next smaller element to the right.
#    Iterate from left to right. For each `nums[i]`, pop elements from the stack that are
#    greater than `nums[i]`. The popped element `nums[k]` can jump to `i` if `k < i` and
#    `nums[i] < nums[k]`. This is backward jump.
#    For forward jump from `i` to `j` (j > i, nums[j] < nums[i]):
#    We can use a monotonic increasing stack. Iterate from right to left. For each `nums[i]`,
#    pop elements from the stack that are smaller than `nums[i]`. The elements remaining
#    on the stack are greater than `nums[i]`. The first element `nums[k]` on the stack
#    (which is to the right of `i`) will be the next greater element to the right.
#    Wait, the rule is `nums[j] < nums[i]` for `j > i`. So we are looking for the next SMALLER
#    element to the right.
#
#    Let's rethink:
#    For `j > i` and `nums[j] < nums[i]`:
#    We want to find for each `i`, what are the `j`'s such that `j > i` and `nums[j] < nums[i]`.
#    This is equivalent to finding for each `j`, what are the `i`'s such that `i < j` and `nums[i] > nums[j]`.
#    This can be found using a monotonic increasing stack from left to right. When we process `nums[j]`,
#    we pop elements `nums[k]` from the stack that are `nums[k] > nums[j]`. For each popped `k`,
#    `k` can jump to `j` (if `k > j` and `nums[k] > nums[j]`) or `j` can jump to `k` (if `j > k` and `nums[j] < nums[k]`).
#    This is getting confusing. Let's simplify the problem statement.
#
#    "From any index i, you can jump to another index j under the following rules:"
#    Rule 1: `j > i` and `nums[j] < nums[i]`
#    Rule 2: `j < i` and `nums[j] > nums[i]`
#
#    "For each index i, find the maximum value in nums that can be reached by following any sequence of valid jumps starting at i."
#
#    This means from `i`, we can reach `nums[i]` itself. Then from `i` we can jump to `j` (if valid), and from `j` we can jump to `k` (if valid), and so on. We want the maximum `nums[x]` among all `x` reachable from `i`.
#
#    Let `dp[i]` be the maximum value reachable from index `i`.
#    `dp[i] = nums[i]`.
#    If we can jump from `i` to `j` (where `j > i` and `nums[j] < nums[i]`), then we can reach `dp[j]` from `i`. So, `dp[i] = max(dp[i], dp[j])`.
#    If we can jump from `i` to `j` (where `j < i` and `nums[j] > nums[i]`), then we can reach `dp[j]` from `i`. So, `dp[i] = max(dp[i], dp[j])`.
#
#    The issue is that the definition of `dp[i]` depends on `dp[j]` where `j` can be greater than `i` or less than `i`. This suggests a dependency that is not strictly forward or backward, and a simple linear DP might not work directly if the dependencies form cycles.
#
#    However, the problem statement says "maximum value in nums that can be reached". This implies that the actual values matter, not just the indices.
#
#    Let's consider the jumps more carefully.
#    A jump from `i` to `j` (`j > i`, `nums[j] < nums[i]`) allows us to reach a smaller value if we move forward.
#    A jump from `i` to `j` (`j < i`, `nums[j] > nums[i]`) allows us to reach a larger value if we move backward.
#
#    This problem is equivalent to finding connected components in a graph where edge direction depends on values.
#    If `nums[i] > nums[j]` and `abs(i - j)` is some unit, we can jump.
#
#    Let's think about the structure of reachable values.
#    From index `i`, we can reach `nums[i]`.
#    If there exists `j > i` with `nums[j] < nums[i]`, we can reach `nums[j]`. From `j`, we can reach `dp[j]`. So from `i` we can reach `dp[j]`.
#    If there exists `j < i` with `nums[j] > nums[i]`, we can reach `nums[j]`. From `j`, we can reach `dp[j]`. So from `i` we can reach `dp[j]`.
#
#    This looks like reachability in a graph. The "maximum value reachable" means we want to find all nodes reachable from `i` and take the maximum `nums` value among them.
#
#    Consider the conditions again:
#    - `i` -> `j` if `j > i` and `nums[j] < nums[i]`
#    - `i` -> `j` if `j < i` and `nums[j] > nums[i]`
#
#    Let's build the graph explicitly. For each `i`, we need to find all `j` that satisfy these conditions.
#    The number of such `j` could be O(N) for each `i`, leading to O(N^2) edges. This is too slow given N = 10^5.
#
#    We need a faster way to find potential jump destinations.
#
#    For `j > i` and `nums[j] < nums[i]`:
#    For a fixed `i`, we are looking for `j` in `(i, N-1]` such that `nums[j]` is less than `nums[i]`.
#    If we sort `nums` along with their original indices, we can efficiently query.
#    Let `(val, idx)` pairs be sorted by `val`.
#
#    Consider pairs `(nums[i], i)`.
#    If we want to find `j > i` with `nums[j] < nums[i]`:
#    We can iterate through `i` from `0` to `N-1`. For each `i`, we need to efficiently query indices `j > i` where `nums[j]` is small.
#
#    If we use a data structure that stores indices `j > i` and supports range queries for values, this could work. E.g., a segment tree or Fenwick tree.
#
#    Let's reconsider the structure of allowed jumps:
#    - From `i` to `j` if `j > i` and `nums[j] < nums[i]`. This means we can jump to a smaller value if we move forward.
#    - From `i` to `j` if `j < i` and `nums[j] > nums[i]`. This means we can jump to a larger value if we move backward.
#
#    This implies that if we can reach a very large value `V`, we can potentially jump backward from any index `i` where `nums[i] < V` to an index `j` where `nums[j] = V`.
#    Similarly, if we are at a large value `V` at index `i`, we can jump forward to any index `j > i` where `nums[j] < V`.
#
#    The problem is essentially about finding the connected components in a graph where edges are defined by value relationships and relative index positions. However, the "maximum value reachable" suggests that if two nodes `u` and `v` are in the same "strongly connected component" or can reach each other, they will have the same maximum reachable value (which is the maximum value in that component).
#
#    The jumps essentially define equivalence classes of indices. If index `i` can reach index `j`, and index `j` can reach index `k`, then `i` can reach `k`. We are looking for the maximum `nums` value within the set of all indices reachable from `i`.
#
#    Let's consider the conditions from a different perspective.
#    We want to find the maximum value reachable *from* `i`.
#
#    For `j > i` and `nums[j] < nums[i]`:
#    We can jump from `i` to `j`. The maximum reachable from `i` is `max(nums[i], max_reachable_from_j)`.
#
#    For `j < i` and `nums[j] > nums[i]`:
#    We can jump from `i` to `j`. The maximum reachable from `i` is `max(nums[i], max_reachable_from_j)`.
#
#    This still feels like a DP, but with dependencies in both directions.
#    If we can reverse the dependencies, maybe DP can be applied.
#
#    Consider the set of all `(value, index)` pairs.
#    Sort these pairs by value: `(v_1, idx_1), (v_2, idx_2), ..., (v_N, idx_N)` where `v_1 <= v_2 <= ... <= v_N`.
#
#    When processing `(v_k, idx_k)`:
#    This `v_k` is a potential maximum value.
#    What indices can reach this `v_k` or values larger than `v_k`?
#
#    Let's try to define the relationships that lead to the same maximum reachable value.
#    If `i` can reach `j` and `j` can reach `i` (possibly through intermediate nodes), then `ans[i] = ans[j]`.
#    This implies finding connected components.
#
#    The rules:
#    1. `i` -> `j` if `j > i` and `nums[j] < nums[i]`
#    2. `i` -> `j` if `j < i` and `nums[j] > nums[i]`
#
#    Let's define a symmetric relationship: `i` is related to `j` if `i` can reach `j` OR `j` can reach `i` using ONE jump.
#    This doesn't seem to capture the full reachability.
#
#    What if we consider the problem from the perspective of values?
#    Suppose we are at index `i` with value `V = nums[i]`.
#    We can jump to `j > i` if `nums[j] < V`.
#    We can jump to `k < i` if `nums[k] > V`.
#
#    Consider the sorted list of (value, index) pairs.
#    Let `sorted_pairs = sorted([(nums[i], i) for i in range(N)])`.
#
#    We can use a Disjoint Set Union (DSU) data structure to group indices that can reach the same maximum value.
#    Initialize DSU where each index is in its own set. The "max value" for each set will be `nums[i]`.
#
#    Iterate through `sorted_pairs`. For each `(val, idx)`:
#    This `val` is a potential maximum. We need to find all indices that can jump *to* `idx` or *from* `idx` to values that will eventually lead to `val`.
#
#    Let's use a data structure to quickly find eligible jump targets.
#
#    For jumps `i` -> `j` where `j > i` and `nums[j] < nums[i]`:
#    This means `nums[i]` can reach indices with smaller values to its right.
#    We can use a monotonic stack to find "next smaller element to the right".
#    For each `i`, if `j` is the next smaller element to its right, then `i` can jump to `j`.
#    But this is only one possible jump. We can jump to *any* `j > i` with `nums[j] < nums[i]`.
#
#    For jumps `i` -> `j` where `j < i` and `nums[j] > nums[i]`:
#    This means `nums[i]` can reach indices with larger values to its left.
#    We can use a monotonic stack to find "next greater element to the left".
#    For each `i`, if `j` is the next greater element to its left, then `i` can jump to `j`.
#    Again, this is only one possible jump.
#
#    The crucial observation might be that if two indices `u` and `v` can reach a common index `w`, and `w` can reach a maximum value `M`, then `u` and `v` can also reach `M`. This suggests that we should group indices that can reach the same "highest" possible value.
#
#    Let's consider the values again.
#    If `nums[i] > nums[j]` and `i > j`, we can jump `i -> j`. This means a larger value can reach a smaller value by moving forward.
#    If `nums[i] < nums[j]` and `i < j`, we can jump `i -> j`. This means a smaller value can reach a larger value by moving forward.
#
#    The problem statement:
#    "Jump to index j where j > i is allowed only if nums[j] < nums[i]." (Forward jump to smaller value)
#    "Jump to index j where j < i is allowed only if nums[j] > nums[i]." (Backward jump to larger value)
#
#    Let's re-read Example 1: nums = [2,1,3]
#    i=0 (val=2): can jump to j=1 (val=1) because j>i and nums[j]<nums[i]. Max reachable from 1 is 2 (from index 0, which can jump to 1, then from 1 can't jump further to increase value, but from 0 can jump to 1. So from 0, we can reach 2 or 1. Max is 2).
#    i=1 (val=1): can jump to j=0 (val=2) because j<i and nums[j]>nums[i]. Max reachable from 0 is 2. From 1 we can reach 2.
#    i=2 (val=3): max value, no jumps. Max reachable is 3.
#
#    Example 2: nums = [2,3,1]
#    i=0 (val=2):
#      Can jump forward to j=2 (val=1) because j>i and nums[j]<nums[i]. From 2 (val=1), can jump backward to j=1 (val=3) because j<2 and nums[j]>nums[2]. So, 0 -> 2 -> 1. From 1 (val=3), max reachable is 3. So from 0, max reachable is 3.
#    i=1 (val=3): max value, no jumps. Max reachable is 3.
#    i=2 (val=1):
#      Can jump backward to j=1 (val=3) because j<2 and nums[j]>nums[2]. Max reachable from 1 is 3. So from 2, max reachable is 3.
#
#    This is indeed a graph reachability problem. The "maximum value reachable" means we need to find the maximum value in the connected component that `i` belongs to.
#
#    Consider the graph where an edge `i -> j` exists if:
#    1. `j > i` and `nums[j] < nums[i]`
#    2. `j < i` and `nums[j] > nums[i]`
#
#    We want to find for each `i`, the maximum `nums[k]` for all `k` reachable from `i`.
#
#    The key is that the problem allows jumps that can lead to cycles in terms of indices, but not in terms of "value increasing" cycles that go on forever.
#    Specifically, a forward jump decreases the value, and a backward jump increases the value.
#
#    Let's build a graph where an UNDIRECTED edge exists between `i` and `j` if EITHER condition for a direct jump is met.
#    This doesn't quite work because the direction matters for reachability.
#
#    Consider the sorted values `(val, idx)`.
#    Let `sorted_indices = sorted(range(N), key=lambda k: nums[k])`.
#
#    We need to efficiently find for each `i`, all `j` such that there is a path `i -> ... -> j`.
#
#    Let's use DSU with two pieces of information per set:
#    1. The representative of the set.
#    2. The maximum value within the set.
#
#    We can iterate through the indices and try to merge sets based on potential jumps.
#
#    How to efficiently find all valid `j` from `i`?
#    - For `j > i` and `nums[j] < nums[i]`: We need to find all indices `j` in `(i, N-1]` whose values are less than `nums[i]`. This is a range query on values for indices greater than `i`.
#    - For `j < i` and `nums[j] > nums[i]`: We need to find all indices `j` in `[0, i)` whose values are greater than `nums[i]`. This is a range query on values for indices less than `i`.
#
#    These range queries can be answered efficiently using data structures like Fenwick trees or Segment trees.
#
#    Let's try a specific approach using Monotonic Stacks and DSU:
#
#    1. Find "next smaller element to the right" (NSR) for each index.
#       Iterate `i` from `N-1` down to `0`. Maintain a monotonic increasing stack of indices.
#       When processing `i`, pop `k` from stack if `nums[k] >= nums[i]`.
#       If stack is not empty, `stack.peek()` is the index of the next smaller element to the right of `i`.
#       If `j = NSR[i]`, then `j > i` and `nums[j] < nums[i]`. This means `i` can jump to `j`.
#       So, `i` and `j` belong to the same component, and their max reachable value should be the same. Use DSU to union `i` and `j`.
#
#    2. Find "next greater element to the left" (NGL) for each index.
#       Iterate `i` from `0` to `N-1`. Maintain a monotonic decreasing stack of indices.
#       When processing `i`, pop `k` from stack if `nums[k] <= nums[i]`.
#       If stack is not empty, `stack.peek()` is the index of the next greater element to the left of `i`.
#       If `j = NGL[i]`, then `j < i` and `nums[j] > nums[i]`. This means `i` can jump to `j`.
#       So, `i` and `j` belong to the same component. Use DSU to union `i` and `j`.
#
#    This strategy finds direct jumps and merges components. However, it misses indirect jumps.
#    For example, `i -> k` and `k -> j`. We merge `i` and `k`, and `k` and `j`. Transitivity ensures `i` and `j` end up in the same component.
#
#    So the DSU approach with Monotonic Stacks for NGL and NSR seems plausible.
#
#    DSU structure:
#    `parent`: array to store parent of each element.
#    `max_val`: array to store the maximum value in the set represented by the index.
#
#    `find(i)`: returns the representative of `i`'s set, with path compression.
#    `union(i, j)`: merges the sets of `i` and `j`. Updates `max_val` of the new root.
#
#    Algorithm:
#    Initialize DSU: `parent[i] = i`, `max_val[i] = nums[i]` for all `i`.
#
#    Compute NSR:
#    `nsr = [-1] * N`
#    `stack = []`
#    For `i` from `N-1` down to `0`:
#        while `stack` and `nums[stack[-1]] >= nums[i]`:
#            `stack.pop()`
#        if `stack`:
#            `nsr[i] = stack[-1]`
#        `stack.append(i)`
#
#    For `i` from `0` to `N-1`:
#        if `nsr[i] != -1`:
#            `union(i, nsr[i])`
#
#    Compute NGL:
#    `ngl = [-1] * N`
#    `stack = []`
#    For `i` from `0` to `N-1`:
#        while `stack` and `nums[stack[-1]] <= nums[i]`:
#            `stack.pop()`
#        if `stack`:
#            `ngl[i] = stack[-1]`
#        `stack.append(i)`
#
#    For `i` from `0` to `N-1`:
#        if `ngl[i] != -1`:
#            `union(i, ngl[i])`
#
#    After processing all NSR and NGL jumps, the DSU structure will group indices that can reach the same maximum value.
#    The final answer for index `i` will be `max_val[find(i)]`.
#
#    Let's trace Example 1: nums = [2,1,3], N=3
#    Initial DSU:
#    parent = [0, 1, 2]
#    max_val = [2, 1, 3]
#
#    NSR:
#    i=2 (3): stack=[], nsr[2]=-1, stack=[2]
#    i=1 (1): stack=[2]. nums[2]=3 >= nums[1]=1. pop 2. stack=[]. nsr[1]=-1, stack=[1]
#    i=0 (2): stack=[1]. nums[1]=1 < nums[0]=2. nsr[0]=1. stack=[1, 0]
#    nsr = [-1, -1, 1] (Mistake in manual trace, should be nsr[0]=1 if nums[1]<nums[0] which is true)
#    Correct NSR:
#    i=2 (3): stack=[], nsr[2]=-1, stack=[2]
#    i=1 (1): stack=[2]. nums[2]=3 >= nums[1]=1. pop 2. stack=[]. nsr[1]=-1, stack=[1]
#    i=0 (2): stack=[1]. nums[1]=1 < nums[0]=2. nsr[0]=1. stack=[1, 0]
#    NSR array:
#    i=2 (3): stack=[]. nsr[2]=-1. stack=[2]
#    i=1 (1): stack=[2]. nums[2](3) >= nums[1](1). pop 2. stack=[]. nsr[1]=-1. stack=[1]
#    i=0 (2): stack=[1]. nums[1](1) < nums[0](2). nsr[0]=1. stack=[1,0]
#    NSR: [-1, -1, 1] ??? The rule is `j > i` and `nums[j] < nums[i]`.
#    Let's correct the NSR loop:
#    NSR for `i`: find smallest `j > i` such that `nums[j] < nums[i]`.
#    Iterate `i` from `N-1` down to `0`.
#    Stack stores indices `k` such that `nums[k]` is increasing.
#    When processing `i`, we pop `k` from stack if `nums[k] >= nums[i]`.
#    The element at the top of the stack (`stack[-1]`) will be the first index `j > i` such that `nums[j] < nums[i]`.
#
#    NSR computation:
#    nums = [2, 1, 3], N=3
#    i=2 (3): stack=[]. nsr[2]=-1. stack=[2]
#    i=1 (1): stack=[2]. nums[2]=3. nums[2] >= nums[1] is false (3 >= 1). No, it's true.
#    Let's be careful with `>=` vs `>`.
#    We need `nums[j] < nums[i]`. So if `nums[k] >= nums[i]`, then `k` cannot be `nsr[i]`.
#    So, while `stack` and `nums[stack[-1]] >= nums[i]`: pop.
#
#    nums = [2, 1, 3]
#    i=2 (3): stack=[], nsr[2]=-1. stack=[2]
#    i=1 (1): stack=[2]. nums[2]=3. nums[2] >= nums[1] (3 >= 1). Pop 2. stack=[]. nsr[1]=-1. stack=[1].
#    i=0 (2): stack=[1]. nums[1]=1. nums[1] >= nums[0] (1 >= 2) is false.
#    So, stack.peek() = 1. nsr[0] = 1. stack=[1, 0].
#    NSR = [-1, -1, 1] (Still same. What is wrong?)
#
#    Example 1: nums = [2,1,3]
#    i=0 (2): Possible `j > 0` with `nums[j] < 2`? Only `j=1` (val=1). So `0` can jump to `1`.
#    i=1 (1): Possible `j > 1` with `nums[j] < 1`? None.
#    i=2 (3): Possible `j > 2` with `nums[j] < 3`? None.
#    So for forward jumps `j > i, nums[j] < nums[i]`: only edge `0 -> 1`.
#
#    Example 1: nums = [2,1,3]
#    i=0 (2): Possible `j < 0` with `nums[j] > 2`? None.
#    i=1 (1): Possible `j < 1` with `nums[j] > 1`? `j=0` (val=2). So `1` can jump to `0`.
#    i=2 (3): Possible `j < 2` with `nums[j] > 3`? None.
#    So for backward jumps `j < i, nums[j] > nums[i]`: only edge `1 -> 0`.
#
#    Combining: 0 can jump to 1. 1 can jump to 0.
#    This forms a component {0, 1}. Max value in this component is `max(nums[0], nums[1]) = max(2, 1) = 2`.
#    Index 2 is isolated. Max value is `nums[2] = 3`.
#    Result: ans[0]=2, ans[1]=2, ans[2]=3. Matches Example 1.
#
#    The DSU + Monotonic Stack approach for NGL and NSR seems correct IF those jumps are the only ones that matter for connectivity.
#    The problem states "any sequence of valid jumps". This means if `i` can jump to `k` and `k` can jump to `j`, then `i` can reach `j`.
#
#    The NGL/NSR logic correctly identifies the *nearest* such index.
#    Why are nearest ones enough?
#    Consider `i`.
#    We need to find `j > i` with `nums[j] < nums[i]`.
#    If we find `k = NSR[i]`, we know `i` can reach `k`. So `union(i, k)`.
#    Now, `k` is in the same component as `i`. If `k` can reach some `m` (e.g., `m = NSR[k]` or `m = NGL[k]`), then `i` can also reach `m`.
#    The DSU structure handles this transitivity.
#
#    Let's re-check NGL/NSR logic.
#    NSR for `i`: find smallest `j > i` such that `nums[j] < nums[i]`.
#    Iterate `i` from `N-1` down to `0`.
#    `stack` stores indices `k` such that `nums[k]` is *increasing*.
#    When processing `i`:
#    While `stack` is not empty AND `nums[stack[-1]] >= nums[i]`:
#        `stack.pop()`  # `stack[-1]` cannot be the NSR for `i` because `nums[stack[-1]] >= nums[i]`
#    After popping, if `stack` is not empty, `stack[-1]` is the index of an element to the right of `i` (`stack[-1] > i`) and `nums[stack[-1]] < nums[i]`. This `stack[-1]` is the *closest* such index because we are processing from right to left.
#    `nsr[i] = stack[-1]` if `stack` is not empty.
#    `stack.append(i)`.
#
#    Example 1: nums = [2, 1, 3]
#    N = 3
#    NSR:
#    i=2 (3): stack=[], nsr[2]=-1. stack.append(2). stack=[2]
#    i=1 (1): stack=[2]. nums[stack[-1]]=nums[2]=3. nums[2] >= nums[1] (3 >= 1) is True. Pop 2. stack=[].
#             stack is empty. nsr[1]=-1. stack.append(1). stack=[1].
#    i=0 (2): stack=[1]. nums[stack[-1]]=nums[1]=1. nums[1] >= nums[0] (1 >= 2) is False.
#             stack is not empty. nsr[0] = stack[-1] = 1. stack.append(0). stack=[1, 0].
#    NSR = [-1, -1, 1]. Wait, this is index of the element, not the value.
#    NSR: `nsr[i]` is the index `j`.
#    NSR[0] = 1. This is correct: from index 0 (value 2), the next smaller element to the right is at index 1 (value 1).
#    NSR[1] = -1. Correct: from index 1 (value 1), no element to the right is smaller.
#    NSR[2] = -1. Correct: from index 2 (value 3), no element to the right.
#
#    NGL: `ngl[i]` is the index `j` such that `j < i` and `nums[j] > nums[i]`, and `j` is the largest such index.
#    Iterate `i` from `0` to `N-1`.
#    `stack` stores indices `k` such that `nums[k]` is *decreasing*.
#    When processing `i`:
#    While `stack` is not empty AND `nums[stack[-1]] <= nums[i]`:
#        `stack.pop()` # `stack[-1]` cannot be NGL for `i` because `nums[stack[-1]] <= nums[i]`
#    After popping, if `stack` is not empty, `stack[-1]` is the index of an element to the left of `i` (`stack[-1] < i`) and `nums[stack[-1]] > nums[i]`. This `stack[-1]` is the *closest* such index because we are processing from left to right.
#    `ngl[i] = stack[-1]` if `stack` is not empty.
#    `stack.append(i)`.
#
#    Example 1: nums = [2, 1, 3]
#    N = 3
#    NGL:
#    i=0 (2): stack=[]. ngl[0]=-1. stack.append(0). stack=[0].
#    i=1 (1): stack=[0]. nums[stack[-1]]=nums[0]=2. nums[0] <= nums[1] (2 <= 1) is False.
#             stack is not empty. ngl[1] = stack[-1] = 0. stack.append(1). stack=[0, 1].
#    i=2 (3): stack=[0, 1]. nums[stack[-1]]=nums[1]=1. nums[1] <= nums[2] (1 <= 3) is True. Pop 1. stack=[0].
#             nums[stack[-1]]=nums[0]=2. nums[0] <= nums[2] (2 <= 3) is True. Pop 0. stack=[].
#             stack is empty. ngl[2]=-1. stack.append(2). stack=[2].
#    NGL = [-1, 0, -1].
#
#    Now, perform unions:
#    Initial DSU: parent=[0,1,2], max_val=[2,1,3]
#
#    Process NSR:
#    nsr = [-1, -1, 1] -- Wait, NGL/NSR arrays are often computed for all indices, not just the nearest.
#    Let's re-check the NGL/NSR computation for their common definition.
#
#    Correct NGL/NSR Logic:
#    To find `j > i` where `nums[j] < nums[i]`:
#    Monotonic INCREASING stack. Iterate `i` from `N-1` down to `0`.
#    When processing `i`, pop `k` from stack if `nums[k] >= nums[i]`.
#    The `stack.peek()` is the index of the first element to the right that is smaller.
#    So `nsr[i] = stack.peek()`. This is what I implemented.
#    Let's check the example again: nums = [2, 1, 3]
#    NSR:
#    i=2 (3): stack=[], nsr[2]=-1. stack=[2].
#    i=1 (1): stack=[2]. nums[2]=3 >= nums[1]=1. Pop 2. stack=[]. nsr[1]=-1. stack=[1].
#    i=0 (2): stack=[1]. nums[1]=1 < nums[0]=2. nsr[0]=1. stack=[1,0].
#    NSR = [-1, -1, 1]. This doesn't seem right. Index 0 can jump to index 1.
#    The rule is `nums[j] < nums[i]`.
#    If `nums[stack[-1]] >= nums[i]`, then `stack[-1]` cannot be the *next smaller*.
#
#    Let's try the other direction of processing for NSR.
#    Iterate `i` from `0` to `N-1`. Monotonic stack.
#    For `j > i` and `nums[j] < nums[i]`:
#    We need for each `i`, to know all `j > i` with `nums[j] < nums[i]`.
#
#    Alternative perspective:
#    Instead of finding immediate neighbors, let's consider values.
#    Sort `(value, index)` pairs by value: `sorted_pairs`.
#    Iterate `k` from `0` to `N-1` over `sorted_pairs = [(v_0, idx_0), (v_1, idx_1), ..., (v_{N-1}, idx_{N-1})]`.
#    When we are at `(v_k, idx_k)`:
#    This `v_k` is a potential maximum value.
#    Any index `i` for which `nums[i] >= v_k` might be able to reach `idx_k` or some other index with value `v_k` or higher.
#
#    Consider `i`. If `nums[i] > v_k`, then `i` can potentially jump to `idx_k` if `idx_k > i`.
#    If `nums[i] < v_k`, and `idx_k < i`, then `idx_k` can potentially jump to `i`.
#
#    This is about building the connections.
#    Let's stick with the DSU + Monotonic Stack approach, but ensure NGL/NSR are correct.
#
#    For `j > i` and `nums[j] < nums[i]`:
#    Iterate `i` from `0` to `N-1`. Maintain a data structure of indices `j > i` encountered so far, ordered by index. Query for minimum value.
#    This is complex.
#
#    What if we consider the jump graph?
#    Edges: `i -> j` if `j > i` and `nums[j] < nums[i]`.
#    Edges: `i -> j` if `j < i` and `nums[j] > nums[i]`.
#
#    This is a directed graph. We need to find for each `i`, the max `nums[k]` among all `k` in the SCC of `i`, or reachable from `i`.
#
#    The crucial property might be that the combination of the two jump rules makes certain indices "connectable".
#    If we have `i` and `j` such that `nums[i] < nums[j]`, and `i < j`:
#    - `i` can jump to `k` if `k > i` and `nums[k] < nums[i]`
#    - `j` can jump to `k` if `k < j` and `nums[k] > nums[j]`
#
#    This is NOT a standard graph problem structure (like monotonic stacks finding nearest element).
#
#    Let's rethink:
#    `ans[i]` = maximum value reachable from `i`.
#    The maximum possible value for `ans[i]` is `max(nums)`.
#
#    Consider all indices `i` and `j` such that `nums[i] < nums[j]`.
#    If `i < j`:
#        `i` cannot jump to `j` (rule `j>i` requires `nums[j] < nums[i]`).
#        `j` cannot jump to `i` (rule `j<i` requires `nums[j] > nums[i]`).
#
#    If `i > j`:
#        `i` can jump to `j` if `nums[j] < nums[i]`. (This is allowed by rule 1, `j>i` needs `nums[j]<nums[i]`. Here `j<i` and `nums[j]<nums[i]`, this is NOT allowed by rule 1).
#        Rule 1: `j > i` and `nums[j] < nums[i]`.
#        Rule 2: `j < i` and `nums[j] > nums[i]`.
#
#    So if `nums[i] < nums[j]` and `i < j`:
#        `i` cannot jump to `j`.
#        `j` cannot jump to `i`.
#
#    If `nums[i] > nums[j]` and `i < j`:
#        `i` can jump to `j` if `nums[j] < nums[i]` (Rule 1: `j > i` and `nums[j] < nums[i]`). Yes.
#        `j` cannot jump to `i` (Rule 2: `j < i` needs `nums[j] > nums[i]`, but `nums[j] < nums[i]`).
#
#    If `nums[i] > nums[j]` and `i > j`:
#        `i` cannot jump to `j` (Rule 1: `j > i` requires `j>i`, but `j<i`. Rule 2: `j < i` requires `nums[j] > nums[i]`, but `nums[j] < nums[i]`). No jump from `i` to `j`.
#        `j` can jump to `i` if `nums[i] > nums[j]` (Rule 2: `j < i` and `nums[j] > nums[i]`. Here `j < i` and `nums[i] > nums[j]`. This is not correct. Rule is `nums[j] > nums[i]` where `j` is the destination, and `i` is the source. So `j < i` and `nums[j] > nums[i]`. The source is `i`, dest is `j`. So `i < j` and `nums[i] > nums[j]` not allowed. `i > j` and `nums[i] < nums[j]` not allowed.)
#
#    Let's re-state the rules very clearly:
#    From index `i`, allowed jumps to index `j`:
#    1. If `j > i` AND `nums[j] < nums[i]`
#    2. If `j < i` AND `nums[j] > nums[i]`
#
#    Consider pairs `(i, j)` where `i` can jump to `j`.
#    This is a directed graph. We need to find for each node `i`, the maximum `nums[k]` of all nodes `k` reachable from `i`.
#
#    The problem is that directly building the graph and doing BFS/DFS from each node is O(N^2) in worst case (dense graph).
#
#    The key is that the maximum value reachable from `i` is limited by the maximum value in its "reachable component".
#    If `i` can reach `j`, and `j` can reach `k`, then `i` can reach `k`.
#
#    This suggests we are looking for connected components in some sense.
#
#    Let's revisit the DSU + Monotonic Stack idea.
#    The problem is asking for the maximum value in the *component* of `i` in the directed graph.
#    However, the DSU approach merges components based on undirected edges.
#
#    If `i` can jump to `j`, and `j` can jump to `i`, they are in the same SCC.
#    This happens if:
#    - `i` -> `j` (`j > i`, `nums[j] < nums[i]`) AND `j` -> `i` (`i < j`, `nums[i] > nums[j]`). This is possible if `j > i` and `nums[j] < nums[i]` AND `i < j` and `nums[i] > nums[j]`. The conditions `j > i` and `i < j` are the same. So if `j > i` and `nums[j] < nums[i]` and `nums[i] > nums[j]`, they can jump back and forth.
#    This is the same as: `j > i` and `nums[j] < nums[i]`.
#
#    If `i` can jump to `j` and `j` can jump to `i`, then `i` and `j` are in the same SCC.
#    The DSU approach with NGL and NSR merges components if there's a jump `i` to `NGL[i]` or `i` to `NSR[i]`.
#    Let's consider the implications:
#    If `i` -> `NSR[i]`, then `union(i, NSR[i])`.
#    If `i` -> `NGL[i]`, then `union(i, NGL[i])`.
#
#    This is effectively finding components where at least one of the "nearest" jumps connects them.
#    Does this cover all necessary connections?
#
#    Consider values. Let `sorted_indices = sorted(range(N), key=lambda k: nums[k])`.
#    Iterate `k` from `0` to `N-1`.
#    `curr_idx = sorted_indices[k]`
#    `curr_val = nums[curr_idx]`
#
#    We want to find `j > curr_idx` such that `nums[j] < curr_val`.
#    And `j < curr_idx` such that `nums[j] > curr_val`.
#
#    Let's use a Fenwick tree (or Segment tree) on indices, storing values.
#    Or a Fenwick tree on values, storing indices.
#
#    What if we process indices from left to right, and maintain information about reachable values to the left?
#    And from right to left, for reachable values to the right?
#
#    Consider the sorted values again.
#    `sorted_pairs = sorted([(nums[i], i) for i in range(N)])`
#
#    We can use a data structure that allows us to query for indices that satisfy the conditions.
#    Let's use a persistent segment tree or a Fenwick tree on indices.
#
#    For a fixed `i`, we want to find `j > i` with `nums[j] < nums[i]`.
#    And `j < i` with `nums[j] > nums[i]`.
#
#    This can be viewed as: for each `i`, we want to find its connected component in the directed graph and the max value in that component.
#
#    The fact that we need maximum value suggests that if `i` and `j` can reach the same set of values, they should have the same `ans`.
#
#    Let's consider the DSU + Monotonic Stack approach again.
#    The NGL/NSR logic identifies specific jumps.
#    If `i` can jump to `j`, they are in the same component.
#    If `i` -> `k` and `k` -> `j`, then `i` can reach `j`.
#    DSU handles transitivity.
#
#    The potential issue is whether NGL/NSR capture enough connections.
#    Suppose `i` can jump to `k_1` and `k_2`, where `k_1` and `k_2` are far away.
#    NGL/NSR only connect `i` to the *nearest* one.
#
#    However, if `i` can reach `k_1`, and `k_1` can reach `m`, then `i` can reach `m`.
#    DSU handles this.
#
#    Let's re-verify the NGL/NSR logic for the jump conditions.
#
#    Forward jump: `i` -> `j` where `j > i` and `nums[j] < nums[i]`.
#    This means `nums[i]` is larger than `nums[j]`.
#    To find all such `j` for a given `i`, we need to query indices `j` in `(i, N-1]` where `nums[j]` is less than `nums[i]`.
#    This is equivalent to asking, for each `j`, what are the `i < j` such that `nums[i] > nums[j]`.
#
#    Backward jump: `i` -> `j` where `j < i` and `nums[j] > nums[i]`.
#    This means `nums[i]` is smaller than `nums[j]`.
#    To find all such `j` for a given `i`, we need to query indices `j` in `[0, i)` where `nums[j]` is greater than `nums[i]`.
#    This is equivalent to asking, for each `j`, what are the `i > j` such that `nums[i] < nums[j]`.
#
#    The problem states "maximum value in nums that can be reached".
#    This implies that all nodes in a strongly connected component will have the same maximum reachable value.
#    And if a node `u` can reach a node `v`, and `v` can reach a component `C`, then `u` can reach the max value in `C`.
#
#    This means we are looking for connected components where connectivity is defined by the allowed jumps.
#    The DSU approach with NGL/NSR seems to connect components if a direct "nearest" jump exists.
#    The transitivity of DSU should handle indirect connections.
#
#    Let's reconsider the problem constraints and typical solutions for similar problems.
#    Problems involving "reachability" and "maximum value" often use DSU or graph traversal.
#    The key is efficient edge finding. Monotonic stacks are good for nearest smaller/greater elements.
#
#    Consider the set of all indices `S`.
#    We are partitioning `S` into groups `G_1, G_2, ..., G_k` such that for any `i` in `G_m`, `ans[i] = max(nums[j] for j in G_m)`.
#
#    The NGL/NSR approach connects `i` with `ngl[i]` and `nsr[i]`.
#    If `i` can jump to `j`, and `j` can jump to `k`, then `i` can reach `k`.
#    The DSU will correctly group `i`, `ngl[i]`, and `nsr[i]`.
#    If `k = ngl[ngl[i]]`, then `i` -> `ngl[i]` and `ngl[i]` -> `ngl[ngl[i]]`.
#    DSU will merge `i` with `ngl[i]`, and `ngl[i]` with `ngl[ngl[i]]`. This means `i` and `ngl[ngl[i]]` will be in the same set.
#
#    So, the DSU approach based on NGL and NSR seems to be the intended solution.
#
#    Let's confirm the NGL/NSR implementation details.
#
#    NSR: next smaller to the right.
#    `nsr = [-1] * N`
#    `stack = []` (stores indices)
#    For `i` from `N-1` down to `0`:
#        while `stack` and `nums[stack[-1]] >= nums[i]`:
#            `stack.pop()`
#        if `stack`:
#            `nsr[i] = stack[-1]`
#        `stack.append(i)`
#    This correctly finds the nearest `j > i` with `nums[j] < nums[i]`.
#
#    NGL: next greater to the left.
#    `ngl = [-1] * N`
#    `stack = []` (stores indices)
#    For `i` from `0` to `N-1`:
#        while `stack` and `nums[stack[-1]] <= nums[i]`:
#            `stack.pop()`
#        if `stack`:
#            `ngl[i] = stack[-1]`
#        `stack.append(i)`
#    This correctly finds the nearest `j < i` with `nums[j] > nums[i]`.
#
#    DSU implementation:
#    `parent` array, `max_val` array.
#    `find(i)`: path compression.
#    `union(i, j)`: union by rank/size (not strictly necessary for correctness, but good for performance). Update `max_val` of the new root.
#
#    `union(i, j)`:
#        root_i = find(i)
#        root_j = find(j)
#        if root_i != root_j:
#            # Merge root_j into root_i
#            parent[root_j] = root_i
#            max_val[root_i] = max(max_val[root_i], max_val[root_j])
#
#    Final answer construction: `ans[i] = max_val[find(i)]`.
#
#    Time Complexity:
#    - NGL/NSR computation: Each element is pushed and popped from the stack at most once. O(N).
#    - DSU initialization: O(N).
#    - Union operations: For each NGL/NSR pair, we do one union. Total O(N) unions. With path compression and union by rank/size, DSU operations are nearly constant amortized time. O(N * alpha(N)), where alpha is inverse Ackermann function.
#    - Final answer construction: For each N, find operation. O(N * alpha(N)).
#    Overall time complexity: O(N log N) if we use sorting for NGL/NSR, or O(N) if we use monotonic stacks. The monotonic stack approach is O(N). So, overall O(N * alpha(N)) which is practically O(N).
#
#    Space Complexity:
#    - `parent` array: O(N)
#    - `max_val` array: O(N)
#    - `nsr`, `ngl` arrays: O(N)
#    - Stacks: O(N) in worst case.
#    Overall space complexity: O(N).
#
#    This approach seems solid.

class DSU:
    def __init__(self, n, nums):
        # Initialize parent array where each element is its own parent
        self.parent = list(range(n))
        # Initialize max_val array where each element's initial max value is itself
        self.max_val = list(nums)
        self.n = n

    def find(self, i):
        # Find the representative of the set containing element i
        # Apply path compression for optimization
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def union(self, i, j):
        # Union the sets containing elements i and j
        root_i = self.find(i)
        root_j = self.find(j)

        if root_i != root_j:
            # Merge the set of j into the set of i
            # Update the parent of root_j to be root_i
            self.parent[root_j] = root_i
            # The maximum value in the new merged set is the maximum of the two previous sets
            self.max_val[root_i] = max(self.max_val[root_i], self.max_val[root_j])

class Solution:
    def jumpGameIX(self, nums: list[int]) -> list[int]:
        n = len(nums)
        dsu = DSU(n, nums)

        # --- Compute Next Smaller Element to the Right (NSR) ---
        # NSR[i] will store the index j such that j > i, nums[j] < nums[i], and j is minimized.
        # This corresponds to a jump from i to j (j > i, nums[j] < nums[i]).
        nsr = [-1] * n
        stack = [] # Monotonically increasing stack (stores indices)

        # Iterate from right to left
        for i in range(n - 1, -1, -1):
            # While stack is not empty and the element at stack top is greater than or equal to current element
            # It means the element at stack top cannot be the NSR for elements to its left that are smaller than it.
            # Also, it means the current element `i` is smaller than elements on stack, so they cannot be NSR for `i`.
            while stack and nums[stack[-1]] >= nums[i]:
                stack.pop()

            # If stack is not empty, the top element is the index of the nearest smaller element to the right
            if stack:
                nsr[i] = stack[-1]

            # Push current index onto the stack
            stack.append(i)

        # Perform union operations based on NSR jumps
        for i in range(n):
            if nsr[i] != -1:
                dsu.union(i, nsr[i])

        # --- Compute Next Greater Element to the Left (NGL) ---
        # NGL[i] will store the index j such that j < i, nums[j] > nums[i], and j is maximized.
        # This corresponds to a jump from i to j (j < i, nums[j] > nums[i]).
        ngl = [-1] * n
        stack = [] # Monotonically decreasing stack (stores indices)

        # Iterate from left to right
        for i in range(n):
            # While stack is not empty and the element at stack top is less than or equal to current element
            # It means the element at stack top cannot be the NGL for elements to its right that are larger than it.
            # Also, it means the current element `i` is larger than elements on stack, so they cannot be NGL for `i`.
            while stack and nums[stack[-1]] <= nums[i]:
                stack.pop()

            # If stack is not empty, the top element is the index of the nearest greater element to the left
            if stack:
                ngl[i] = stack[-1]

            # Push current index onto the stack
            stack.append(i)

        # Perform union operations based on NGL jumps
        for i in range(n):
            if ngl[i] != -1:
                dsu.union(i, ngl[i])

        # Construct the answer array
        # For each index i, the maximum reachable value is the max_val of its set representative
        ans = [0] * n
        for i in range(n):
            root = dsu.find(i)
            ans[i] = dsu.max_val[root]

        return ans

```