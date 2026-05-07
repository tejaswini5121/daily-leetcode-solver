/**
 * @param {number[]} nums
 * @return {number[]}
 */
// Problem Summary: Given an array nums, for each index i, find the maximum value reachable by a sequence of valid jumps.
// A jump from i to j is valid if:
// - j > i and nums[j] < nums[i]
// - j < i and nums[j] > nums[i]
// Link: https://leetcode.com/problems/jump-game-ix/
//
// Approach:
// This problem can be solved using dynamic programming and a monotonic stack.
// For each index `i`, we want to find the maximum value reachable. The maximum value will be at least `nums[i]` itself.
// We can extend the reachable value by considering valid jumps.
//
// To efficiently find the next valid jumps, we can precompute:
// 1. `next_smaller[i]`: The index of the first element to the right of `i` that is smaller than `nums[i]`.
// 2. `prev_greater[i]`: The index of the first element to the left of `i` that is greater than `nums[i]`.
//
// These can be found using a monotonic increasing stack for `next_smaller` and a monotonic decreasing stack for `prev_greater`.
//
// Once we have these precomputed arrays, we can define a DP relation. Let `dp[i]` be the maximum value reachable from index `i`.
// `dp[i] = nums[i]` initially.
//
// If `next_smaller[i]` exists, we can potentially jump to `next_smaller[i]`. The maximum value reachable from `i` would then be `max(dp[i], dp[next_smaller[i]])`.
// If `prev_greater[i]` exists, we can potentially jump to `prev_greater[i]`. The maximum value reachable from `i` would then be `max(dp[i], dp[prev_greater[i]])`.
//
// However, the jumps can form a chain. For example, from `i` to `j`, and from `j` to `k`.
// This suggests that the DP state depends on the states of other indices. Since the problem asks for the maximum reachable value, and a jump only happens if the value *increases* (for backward jumps) or *decreases* (for forward jumps), this implies a directed acyclic graph (DAG) structure if we only consider jumps that *increase* the value or *decrease* it.
//
// The key insight here is that if we can reach a value `X` from index `i`, and from index `j` we can also reach `X`, then from `i` we can potentially reach whatever `j` can reach.
//
// Let's reconsider the problem. For each `i`, we need the maximum value in `nums` that can be reached.
// The problem isn't about the path, but the maximum *value* encountered.
//
// If `nums[i]` is the current maximum, and we jump to `j`:
// - `j > i` and `nums[j] < nums[i]`: The current maximum remains `nums[i]`. We then consider what can be reached from `j`.
// - `j < i` and `nums[j] > nums[i]`: The new maximum becomes `nums[j]`. We then consider what can be reached from `j`.
//
// This suggests a graph where nodes are indices, and edges are valid jumps. We want to find the maximum value in any connected component that `i` belongs to.
//
// The problem statement phrasing "maximum value in nums that can be reached by following any sequence of valid jumps starting at i" implies we are looking for the maximum value *among all indices* that are reachable from `i`.
//
// Let's re-evaluate the DP.
// For an index `i`, the maximum reachable value is at least `nums[i]`.
//
// Consider the structure of jumps:
// - `i -> j` where `j > i` and `nums[j] < nums[i]`
// - `i -> j` where `j < i` and `nums[j] > nums[i]`
//
// If `nums[i]` is the maximum element in the entire array, then from `i`, no jump can lead to a strictly greater value.
// If `nums[i]` is the minimum element in the entire array, then from `i`, no jump can lead to a strictly smaller value.
//
// Let's focus on what makes the maximum value increase. This only happens when we jump backwards to a larger element: `i -> j` where `j < i` and `nums[j] > nums[i]`.
//
// Consider building the answer for each `i`. The initial answer for `ans[i]` is `nums[i]`.
//
// We can use a technique similar to finding "next greater/smaller elements".
//
// Let `ans[i]` be the maximum value reachable from index `i`.
//
// For `i = 0 to n-1`:
//  `ans[i] = nums[i]`
//
// Now, consider jumps.
//
// For `i = 0 to n-1`:
//  If there's `j < i` such that `nums[j] > nums[i]`:
//      `ans[i] = max(ans[i], ans[j])`  // This is not quite right, as `ans[j]` might depend on `ans[i]`.
//
// The problem is that `ans[i]` can influence `ans[j]` and vice versa through chains of jumps.
//
// Let's consider the contribution of each element.
// For an index `i`, it can reach `nums[i]`.
// It can also reach any value reachable from an index `j` that `i` can jump to.
//
// The key structure for jumps that INCREASE the value is: `i -> j` where `j < i` and `nums[j] > nums[i]`.
// These are "previous greater element" type jumps.
//
// Let's compute `prev_greater[i]` and `next_smaller[i]` using monotonic stacks.
//
// `prev_greater[i]`: Index `k` such that `k < i`, `nums[k] > nums[i]`, and `k` is maximized.
// `next_smaller[i]`: Index `k` such that `k > i`, `nums[k] < nums[i]`, and `k` is minimized.
//
// Let `dp[i]` be the maximum value reachable from index `i`.
//
// We can process elements from right to left or left to right.
//
// Let's try a right-to-left pass.
// `dp[i]` = maximum value reachable starting from `i`.
// Initialize `dp[i] = nums[i]` for all `i`.
//
// Consider a monotonic stack to find previous greater elements.
// When processing `nums[i]` from right to left:
// Maintain a stack of indices `s` such that `nums[s.top()]` is increasing.
// For `i = n-1` down to `0`:
//   while stack is not empty and `nums[stack.top()] <= nums[i]`:
//     pop from stack
//   if stack is not empty:
//     `prev_greater_idx = stack.top()`
//     `dp[i] = max(dp[i], dp[prev_greater_idx])` // If we jump `i -> prev_greater_idx`, we can reach `dp[prev_greater_idx]`
//   push `i` onto stack
//
// This handles backward jumps (`j < i` and `nums[j] > nums[i]`).
//
// Now, consider forward jumps (`j > i` and `nums[j] < nums[i]`).
// These jumps don't necessarily increase the maximum value directly, but they can lead to other states.
//
// Let's rephrase: what is the maximum value in the connected component that `i` belongs to?
// A jump from `i` to `j` means `i` and `j` are in the same "component" for reachability.
//
// The definition of a jump is crucial:
// 1. `j > i` and `nums[j] < nums[i]`
// 2. `j < i` and `nums[j] > nums[i]`
//
// Notice that if `i` can jump to `j`, and `j` can jump to `k`, then `i` can reach `k`.
//
// The problem boils down to finding, for each `i`, the maximum value `nums[k]` such that there is a path `i -> ... -> k`.
//
// Let's consider the relationship between indices and values.
//
// Example 1: nums = [2, 1, 3]
// i=0, nums[0]=2
//   - j=1: 1 > 0, nums[1]=1 < nums[0]=2. Valid jump. From 1, can reach max?
//     From i=1, nums[1]=1.
//       - j=0: 0 < 1, nums[0]=2 > nums[1]=1. Valid jump. Max from 0 is 2. So from 1, can reach 2.
//     So from i=0, can reach 2 (itself) and via i=1 can reach 2. Max = 2. ans[0]=2.
//   - j=2: 2 > 0, nums[2]=3 > nums[0]=2. Invalid jump (nums[j] must be < nums[i]).
//
// i=1, nums[1]=1
//   - j=0: 0 < 1, nums[0]=2 > nums[1]=1. Valid jump. From 0, can reach max? Max from 0 is 2. So from 1, can reach 2.
//   - j=2: 2 > 1, nums[2]=3 > nums[1]=1. Invalid jump (nums[j] must be < nums[i]).
// Max reachable from i=1 is 2. ans[1]=2.
//
// i=2, nums[2]=3
//   - j=0: 0 < 2, nums[0]=2 < nums[2]=3. Invalid jump (nums[j] must be > nums[i]).
//   - j=1: 1 < 2, nums[1]=1 < nums[2]=3. Invalid jump (nums[j] must be > nums[i]).
// Max reachable from i=2 is 3. ans[2]=3.
//
// Output: [2, 2, 3] - Matches.
//
// Example 2: nums = [2, 3, 1]
// i=0, nums[0]=2
//   - j=1: 1 > 0, nums[1]=3 > nums[0]=2. Invalid.
//   - j=2: 2 > 0, nums[2]=1 < nums[0]=2. Valid. From 2, what can be reached?
//     From i=2, nums[2]=1.
//       - j=0: 0 < 2, nums[0]=2 > nums[2]=1. Valid. From 0, what can be reached?
//         From i=0, nums[0]=2.
//           - j=1: 1 > 0, nums[1]=3 > nums[0]=2. Invalid.
//           - j=2: 2 > 0, nums[2]=1 < nums[0]=2. Valid. From 2, what can be reached? This is a cycle!
//
// The problem statement implies that we are looking for the maximum value in the connected component.
// If we can go from `i` to `j`, and `j` to `k`, then `i` can reach `k`.
//
// Let's define the graph:
// Nodes: 0, 1, ..., n-1
// Edges:
//   - `i -> j` if `j > i` and `nums[j] < nums[i]`
//   - `i -> j` if `j < i` and `nums[j] > nums[i]`
//
// For each `i`, we need to find `max(nums[k])` for all `k` reachable from `i`.
//
// This is equivalent to finding the maximum value in the strongly connected component (SCC) or the transitive closure of the reachable set.
//
// The issue is that the graph might have cycles.
//
// If we have a cycle, e.g., `i -> j -> k -> i`, then all `nums[i]`, `nums[j]`, `nums[k]` are mutually reachable. The maximum value reachable from any of them is `max(nums[i], nums[j], nums[k])`.
//
// This suggests that for each connected component in the graph (undirected sense), we need to find the maximum value within that component.
//
// Let's define the "reachability graph".
// For `i` and `j` to be in the same "component":
// There exists a path from `i` to `j` OR from `j` to `i`.
//
// The problem is asking for `max(nums[k])` for all `k` such that `i` can reach `k`.
//
// Let's consider the types of jumps again.
// Jump `i -> j` where `j > i` and `nums[j] < nums[i]`. This means a larger number can jump to a smaller number to its right.
// Jump `i -> j` where `j < i` and `nums[j] > nums[i]`. This means a smaller number can jump to a larger number to its left.
//
// This second type of jump is what increases the "potential" maximum value.
//
// Consider iterating through the array and maintaining the maximum value seen so far in a "dominant" chain.
//
// Let `ans[i]` be the maximum value reachable from `i`.
//
// We can use two monotonic stacks to find the *immediate* neighbors that satisfy the jump conditions.
//
// 1. Previous Greater Element (for `j < i` and `nums[j] > nums[i]`):
//    `prev_greater[i]` = index of nearest element to the left of `i` with value greater than `nums[i]`.
//    Computed using a decreasing monotonic stack.
//
// 2. Next Smaller Element (for `j > i` and `nums[j] < nums[i]`):
//    `next_smaller[i]` = index of nearest element to the right of `i` with value smaller than `nums[i]`.
//    Computed using an increasing monotonic stack.
//
//
// Let's use DP. `dp[i]` = maximum value reachable from index `i`.
// Initialize `dp[i] = nums[i]`.
//
// Consider processing jumps.
//
// If `i` can jump to `j` (`j < i` and `nums[j] > nums[i]`), then `dp[i]` can potentially be `dp[j]`.
// If `i` can jump to `k` (`k > i` and `nums[k] < nums[i]`), then `dp[i]` can potentially be `dp[k]`.
//
// The critical observation is that if `nums[j] > nums[i]` and `j < i`, then we can jump from `i` to `j`. This means `i` can reach anything `j` can reach. Thus, `dp[i]` should be at least `dp[j]`.
//
// This suggests a dependence: `dp[i]` depends on `dp[j]` if `i` can jump to `j`.
// Since the jumps are not strictly ordered (e.g., `i` can jump to `j < i` and `k > i`), we cannot simply iterate left-to-right or right-to-left for DP without considering mutual dependencies.
//
// This is where the concept of connected components or transitive closure comes in.
//
// Let's rethink: for each `i`, find `max(nums[k])` where `k` is reachable from `i`.
//
// Consider processing by values. If we process values in increasing order, what happens?
//
// Let's try a structure that captures reachability:
//
// We can use a Union-Find data structure, but the "union" condition depends on the jump rules, which can be complex.
//
// Alternative approach:
// For each index `i`, we are interested in `max(nums[k])` over all `k` reachable from `i`.
//
// Let's analyze the jumps that allow progress (increase value):
// From `i`, jump to `j` where `j < i` and `nums[j] > nums[i]`.
// This is exactly the "previous greater element" scenario.
//
// Let's compute `prev_greater_idx[i]` for all `i`.
// And `next_smaller_idx[i]` for all `i`.
//
// Now, consider `ans[i]`. It's at least `nums[i]`.
// If `prev_greater_idx[i]` is `p`, then `i` can jump to `p`. This means `ans[i]` is at least `ans[p]`.
// If `next_smaller_idx[i]` is `s`, then `i` can jump to `s`. This means `ans[i]` is at least `ans[s]`.
//
// This looks like `ans[i] = max(nums[i], ans[prev_greater_idx[i]] if exists, ans[next_smaller_idx[i]] if exists)`.
// However, this is still a direct dependency. The problem is that `ans[p]` itself might depend on `i` if `p` can jump back to `i` (which is not possible in this definition of `prev_greater_idx`).
//
// The issue is that the graph might have cycles.
// If `i` can jump to `j`, and `j` can jump to `i`, then they are in the same "reachability set".
//
// Example: nums = [5, 1, 6, 2, 7]
//
// Index | Value | Prev Greater | Next Smaller
// ------|-------|--------------|--------------
// 0     | 5     | -1           | 1 (1<5)
// 1     | 1     | 0 (5>1)      | 2 (6>1 but 2<1 no) -> 3 (2<1 no) -> ???
//       |       |              | From 1:
//       |       |              | j=2, nums[2]=6 > nums[1]=1. Invalid.
//       |       |              | j=3, nums[3]=2 > nums[1]=1. Invalid.
//       |       |              | j=4, nums[4]=7 > nums[1]=1. Invalid.
//       |       |              | Wait, mistake in definition.
//       |       |              | Next smaller: j > i, nums[j] < nums[i]
//       |       |              | 1: nums[1]=1.
//       |       |              | j=2: nums[2]=6. No.
//       |       |              | j=3: nums[3]=2. No.
//       |       |              | j=4: nums[4]=7. No.
//       |       |              | So next_smaller[1] is -1.
// 2     | 6     | -1           | 3 (2<6)
// 3     | 2     | 2 (6>2)      | 4 (7>2 but 4>3 no) -> ???
//       |       |              | From 3: nums[3]=2
//       |       |              | j=4: nums[4]=7. No.
//       |       |              | So next_smaller[3] is -1.
// 4     | 7     | -1           | -1
//
// Let's recompute prev_greater and next_smaller more carefully.
//
// nums = [5, 1, 6, 2, 7]
// n = 5
//
// prev_greater: stack stores indices of increasing values.
// i=0, nums[0]=5. stack=[0]
// i=1, nums[1]=1. nums[0]=5 > 1. prev_greater[1] = 0. stack=[0, 1] (Mistake, stack should be decreasing for prev_greater)
//
// prev_greater: stack stores indices of decreasing values.
// i=0, nums[0]=5. stack=[0]
// i=1, nums[1]=1. nums[0]=5 > 1. prev_greater[1] = 0. stack=[0, 1] (Mistake, stack should be decreasing values. If new val < top, pop. If new val > top, push. So stack is increasing values)
//
// Let's get the definitions right.
//
// prev_greater_idx[i]: the largest index `k < i` such that `nums[k] > nums[i]`.
// Use a monotonic *increasing* stack. When we see `nums[i]`, pop elements from stack that are `<= nums[i]`. The top element remaining is the previous greater.
//
// nums = [5, 1, 6, 2, 7]
//
// prev_greater:
// i=0, nums[0]=5. stack=[0]. prev_greater[0] = -1.
// i=1, nums[1]=1. nums[0]=5 > 1. prev_greater[1]=0. stack=[0, 1]. (Mistake: stack should contain indices of elements *greater than* `nums[i]`. When `nums[i]` arrives, pop all `nums[stack.top()] <= nums[i]`. The top is `prev_greater[i]`).
//
// Let's use the standard way:
//
// `prev_greater_idx`:
// stack = []
// for i = 0 to n-1:
//   while stack is not empty and nums[stack.top()] <= nums[i]:
//     stack.pop()
//   if stack is empty:
//     prev_greater_idx[i] = -1
//   else:
//     prev_greater_idx[i] = stack.top()
//   stack.push(i)
//
// nums = [5, 1, 6, 2, 7]
// i=0, nums[0]=5. stack=[] -> prev_greater_idx[0]=-1. stack=[0].
// i=1, nums[1]=1. nums[0]=5 > 1. prev_greater_idx[1]=0. stack=[0, 1].
// i=2, nums[2]=6. nums[1]=1 <= 6 -> pop 1. nums[0]=5 <= 6 -> pop 0. stack=[]. prev_greater_idx[2]=-1. stack=[2].
// i=3, nums[3]=2. nums[2]=6 > 2. prev_greater_idx[3]=2. stack=[2, 3].
// i=4, nums[4]=7. nums[3]=2 <= 7 -> pop 3. nums[2]=6 <= 7 -> pop 2. stack=[]. prev_greater_idx[4]=-1. stack=[4].
//
// prev_greater_idx = [-1, 0, -1, 2, -1]
//
// `next_smaller_idx`:
// stack = []
// for i = n-1 down to 0:
//   while stack is not empty and nums[stack.top()] >= nums[i]: // Note: >= here for strictly smaller
//     stack.pop()
//   if stack is empty:
//     next_smaller_idx[i] = -1
//   else:
//     next_smaller_idx[i] = stack.top()
//   stack.push(i)
//
// nums = [5, 1, 6, 2, 7]
// i=4, nums[4]=7. stack=[] -> next_smaller_idx[4]=-1. stack=[4].
// i=3, nums[3]=2. nums[4]=7 >= 2 -> pop 4. stack=[]. next_smaller_idx[3]=-1. stack=[3].
// i=2, nums[2]=6. nums[3]=2 < 6. next_smaller_idx[2]=3. stack=[3, 2].
// i=1, nums[1]=1. nums[2]=6 >= 1 -> pop 2. nums[3]=2 >= 1 -> pop 3. stack=[]. next_smaller_idx[1]=-1. stack=[1].
// i=0, nums[0]=5. nums[1]=1 < 5. next_smaller_idx[0]=1. stack=[1, 0].
//
// next_smaller_idx = [1, -1, 3, -1, -1]
//
//
// Let's analyze the structure of jumps again.
// If `i` can jump to `j` where `j < i` and `nums[j] > nums[i]`:
// This means `j` is `prev_greater_idx[i]`.
// So, `i` can jump to `prev_greater_idx[i]`.
// If `i` can jump to `k` where `k > i` and `nums[k] < nums[i]`:
// This means `k` is `next_smaller_idx[i]`.
// So, `i` can jump to `next_smaller_idx[i]`.
//
// Let `ans[i]` be the max value reachable from `i`.
//
// Initialize `ans[i] = nums[i]`.
//
// Consider the jumps that *increase* the potential maximum: `i -> j` where `j < i` and `nums[j] > nums[i]`.
// If `p = prev_greater_idx[i]` exists, we can jump `i -> p`.
// This means that the maximum reachable from `i` must be at least the maximum reachable from `p`.
// `ans[i] = max(ans[i], ans[p])`.
//
// This looks like a dependency that can be resolved by processing from right to left.
//
// Iterate `i` from `n-1` down to `0`.
// Maintain `ans` array. Initialize `ans[i] = nums[i]`.
//
// For `i` from `n-1` down to `0`:
//   `ans[i] = nums[i]`
//   If `p = prev_greater_idx[i]` is not -1:
//     `ans[i] = max(ans[i], ans[p])`  // This uses `ans[p]` which would have been computed if `p > i`. BUT `p < i` here. This is problematic.
//
// The DP state `ans[i]` depends on `ans[j]` where `j` could be anywhere.
//
// The core issue is the interdependence. If `i` can reach `j`, and `j` can reach `i`, they are in the same component.
//
// Let's consider how indices become "connected".
// Index `i` and `prev_greater_idx[i]` are related.
// Index `i` and `next_smaller_idx[i]` are related.
//
// This creates "chains".
// Example: `nums = [3, 1, 2]`
// prev_greater_idx = [-1, 0, 0]
// next_smaller_idx = [1, -1, -1]
//
// i=0, nums[0]=3. prev_g=-1. next_s=1 (nums[1]=1 < 3).
//   Jump 0 -> 1.
// i=1, nums[1]=1. prev_g=0 (nums[0]=3 > 1). next_s=-1.
//   Jump 1 -> 0.
// i=2, nums[2]=2. prev_g=0 (nums[0]=3 > 2). next_s=-1.
//   Jump 2 -> 0.
//
// Reachability:
// From 0: can jump to 1. From 1: can jump to 0. So {0, 1} are mutually reachable. Max value is `max(nums[0], nums[1]) = max(3, 1) = 3`.
// From 2: can jump to 0. From 0, can reach 1. So 2 can reach 0 and 1. Max value is `max(nums[0], nums[1], nums[2]) = max(3, 1, 2) = 3`.
//
// Result: [3, 3, 3]. Correct for [3,1,2].
//
// So, the problem is finding connected components based on these directed jumps, and for each component, find the maximum value.
//
// This is not standard SCC. If `i` can jump to `j`, it means `i` can "access" `j`.
// If `i` can access `j` AND `j` can access `i`, they are in the same "reachability group".
//
// Let's define an undirected graph where an edge exists between `i` and `j` if:
// 1. `i -> j` is a valid jump.
// 2. `j -> i` is a valid jump.
//
// We can then find connected components in this undirected graph. For each component, the answer for all nodes in it is the maximum value in `nums` for that component.
//
// How to build this undirected graph efficiently?
// An edge exists between `i` and `j` if:
//   - (`j > i` and `nums[j] < nums[i]`) OR (`j < i` and `nums[j] > nums[i]`)
//   - OR (`i > j` and `nums[i] < nums[j]`) OR (`i < j` and `nums[i] > nums[j]`)
//
// These conditions are symmetrical! If `i` can jump to `j`, then `j` can jump to `i` under the symmetric condition.
//
// Case 1: `j > i` and `nums[j] < nums[i]`. This is `i -> j`.
// The symmetric condition would be `i < j` and `nums[i] > nums[j]`, which is the same.
//
// Case 2: `j < i` and `nums[j] > nums[i]`. This is `i -> j`.
// The symmetric condition would be `i > j` and `nums[i] < nums[j]`, which is the same.
//
// So, if `i` can jump to `j`, then `j` can also jump to `i` by reversing the roles and conditions.
//
// This means if there's a valid jump between `i` and `j`, they are "connected".
//
// We need to find all pairs `(i, j)` that can jump to each other.
//
// The "previous greater element" (`prev_greater_idx[i]`) gives us `i -> p` where `p < i` and `nums[p] > nums[i]`.
// This implies an undirected edge between `i` and `p`.
//
// The "next smaller element" (`next_smaller_idx[i]`) gives us `i -> s` where `s > i` and `nums[s] < nums[i]`.
// This implies an undirected edge between `i` and `s`.
//
// So, we can define undirected edges:
// - `(i, prev_greater_idx[i])` if `prev_greater_idx[i]` is valid.
// - `(i, next_smaller_idx[i])` if `next_smaller_idx[i]` is valid.
//
// We can use Union-Find to group these connected indices.
//
// Algorithm:
// 1. Compute `prev_greater_idx` for all `i`.
// 2. Compute `next_smaller_idx` for all `i`.
// 3. Initialize Union-Find structure for `n` elements.
// 4. For each `i` from 0 to n-1:
//    If `p = prev_greater_idx[i]` is not -1, `union(i, p)`.
//    If `s = next_smaller_idx[i]` is not -1, `union(i, s)`.
// 5. After processing all unions, iterate through `nums`. For each `i`, find its root using `find(i)`.
//    Maintain a map `component_max_val` where `component_max_val[root]` stores the maximum `nums[k]` for all `k` in the component rooted at `root`.
// 6. Finally, for each `i`, `ans[i] = component_max_val[find(i)]`.
//
// Let's trace this for nums = [2, 1, 3]
// n = 3
//
// prev_greater_idx:
// i=0, nums[0]=2. stack=[] -> pg[0]=-1. stack=[0].
// i=1, nums[1]=1. nums[0]=2 > 1. pg[1]=0. stack=[0, 1].
// i=2, nums[2]=3. nums[1]=1 <= 3 -> pop 1. nums[0]=2 <= 3 -> pop 0. stack=[]. pg[2]=-1. stack=[2].
// pg = [-1, 0, -1]
//
// next_smaller_idx:
// i=2, nums[2]=3. stack=[] -> ns[2]=-1. stack=[2].
// i=1, nums[1]=1. nums[2]=3 >= 1 -> pop 2. stack=[]. ns[1]=-1. stack=[1].
// i=0, nums[0]=2. nums[1]=1 < 2. ns[0]=1. stack=[1, 0].
// ns = [1, -1, -1]
//
// Union-Find: uf_parent = [0, 1, 2], uf_rank = [0, 0, 0]
//
// Unions:
// i=0: pg[0]=-1. ns[0]=1. union(0, 1).
//   find(0)=0, find(1)=1. Ranks are equal. uf_parent[1]=0. uf_rank[0]=1.
//   uf_parent = [0, 0, 2]
// i=1: pg[1]=0. union(1, 0). find(1)=0, find(0)=0. Already in same set.
//   ns[1]=-1.
// i=2: pg[2]=-1. ns[2]=-1.
//
// Final uf_parent = [0, 0, 2]
//
// Component Max Values:
// component_max_val = {}
//
// i=0: find(0)=0. component_max_val[0] = max(component_max_val[0] || -Infinity, nums[0]=2) = 2.
// i=1: find(1)=0. component_max_val[0] = max(component_max_val[0]=2, nums[1]=1) = 2.
// i=2: find(2)=2. component_max_val[2] = max(component_max_val[2] || -Infinity, nums[2]=3) = 3.
//
// component_max_val = { 0: 2, 2: 3 }
//
// Final ans:
// i=0: find(0)=0. ans[0] = component_max_val[0] = 2.
// i=1: find(1)=0. ans[1] = component_max_val[0] = 2.
// i=2: find(2)=2. ans[2] = component_max_val[2] = 3.
//
// ans = [2, 2, 3]. Matches example 1.
//
// Let's trace for nums = [2, 3, 1]
// n = 3
//
// prev_greater_idx:
// i=0, nums[0]=2. pg[0]=-1. stack=[0].
// i=1, nums[1]=3. nums[0]=2 <= 3 -> pop 0. stack=[]. pg[1]=-1. stack=[1].
// i=2, nums[2]=1. nums[1]=3 > 1. pg[2]=1. stack=[1, 2].
// pg = [-1, -1, 1]
//
// next_smaller_idx:
// i=2, nums[2]=1. ns[2]=-1. stack=[2].
// i=1, nums[1]=3. nums[2]=1 < 3. ns[1]=2. stack=[2, 1].
// i=0, nums[0]=2. nums[1]=3 >= 2 -> pop 1. nums[2]=1 < 2. ns[0]=2. stack=[2, 0].
// ns = [2, 2, -1]
//
// Union-Find: uf_parent = [0, 1, 2]
//
// Unions:
// i=0: pg[0]=-1. ns[0]=2. union(0, 2).
//   find(0)=0, find(2)=2. uf_parent[2]=0. uf_rank[0]=1.
//   uf_parent = [0, 1, 0]
// i=1: pg[1]=-1. ns[1]=2. union(1, 2).
//   find(1)=1, find(2)=0. uf_parent[0]=1. uf_rank[1]=1.
//   uf_parent = [1, 1, 0] (After fixing parent of 0 to be 1)
//   Let's re-trace union(1, 2) after union(0, 2):
//   uf_parent = [0, 1, 0]. find(0)=0, find(1)=1, find(2)=0.
//   union(1, 2): find(1)=1, find(2)=0. Roots are 1 and 0.
//   Assume rank of 0 is 1, rank of 1 is 0. uf_parent[0]=1.
//   uf_parent = [1, 1, 0].
//   Now, find(0): parent is 1. parent of 1 is 1. Root is 1.
//   find(1): root is 1.
//   find(2): parent is 0. parent of 0 is 1. parent of 1 is 1. Root is 1.
//
// i=2: pg[2]=1. union(2, 1).
//   find(2)=1, find(1)=1. Already in same set.
//   ns[2]=-1.
//
// Final uf_parent (after path compression would be cleaner):
// Let's re-do Union-Find carefully without path compression for clarity in trace.
// uf_parent = [0, 1, 2]
// i=0: pg[0]=-1, ns[0]=2. union(0, 2). find(0)=0, find(2)=2. roots 0, 2. parent[2]=0. uf_parent=[0,1,0]
// i=1: pg[1]=-1, ns[1]=2. union(1, 2). find(1)=1, find(2)=find(0)=0. roots 1, 0. parent[0]=1. uf_parent=[1,1,0]
// i=2: pg[2]=1, union(2, 1). find(2)=find(0)=find(1)=1. find(1)=1. Roots 1, 1. Same.
//
// Final uf_parent = [1, 1, 0]
// Let's apply find with path compression for final roots:
// find(0): parent=1, parent[1]=1. root=1. uf_parent=[1,1,0] -> [1,1,0] (after path compression for 0)
// find(1): parent=1. root=1. uf_parent=[1,1,0]
// find(2): parent=0, parent[0]=1, parent[1]=1. root=1. uf_parent=[1,1,1] (after path compression for 2)
//
// So all are in component with root 1.
//
// Component Max Values:
// component_max_val = {}
//
// i=0: find(0)=1. component_max_val[1] = max(-Inf, nums[0]=2) = 2.
// i=1: find(1)=1. component_max_val[1] = max(2, nums[1]=3) = 3.
// i=2: find(2)=1. component_max_val[1] = max(3, nums[2]=1) = 3.
//
// component_max_val = { 1: 3 }
//
// Final ans:
// i=0: find(0)=1. ans[0] = component_max_val[1] = 3.
// i=1: find(1)=1. ans[1] = component_max_val[1] = 3.
// i=2: find(2)=1. ans[2] = component_max_val[1] = 3.
//
// ans = [3, 3, 3]. Matches example 2.
//
// This Union-Find approach seems correct.
//
// Time Complexity:
// - Computing `prev_greater_idx`: O(N) using monotonic stack.
// - Computing `next_smaller_idx`: O(N) using monotonic stack.
// - Union-Find operations:
//   - Initialization: O(N)
//   - `N` union operations: Each `union` and `find` operation with path compression and union by rank/size is nearly constant time on average, O(α(N)), where α is the inverse Ackermann function, which grows extremely slowly. So, effectively O(N).
// - Computing component max values: O(N) to iterate and find roots.
// - Final answer construction: O(N) to iterate and lookup component max values.
//
// Total Time Complexity: O(N)
//
// Space Complexity:
// - `prev_greater_idx`: O(N)
// - `next_smaller_idx`: O(N)
// - Monotonic stacks: O(N) in worst case.
// - Union-Find parent array: O(N)
// - Component max values map: O(N) in worst case (if each element is its own component).
//
// Total Space Complexity: O(N)
//
// Implementation details:
// Need a Union-Find class or helper functions.
//
// `find(i)` function with path compression.
// `union(i, j)` function with union by rank/size.
//
// Use `Map` for `component_max_val` in JavaScript.

```javascript
/**
 * Represents a Disjoint Set Union (Union-Find) data structure.
 * Supports path compression and union by rank for efficient operations.
 */
class UnionFind {
    /**
     * Initializes the Union-Find structure for `n` elements.
     * @param {number} n The number of elements.
     */
    constructor(n) {
        // `parent` array stores the parent of each element. Initially, each element is its own parent.
        this.parent = Array(n).fill(0).map((_, i) => i);
        // `rank` array stores the rank (or height) of each tree. Used for optimizing union operations.
        this.rank = Array(n).fill(0);
    }

    /**
     * Finds the representative (root) of the set containing element `i`.
     * Implements path compression for optimization.
     * @param {number} i The element to find the set representative for.
     * @returns {number} The representative (root) of the set.
     */
    find(i) {
        if (this.parent[i] === i) {
            return i; // `i` is the root of its set.
        }
        // Path compression: Set the parent of `i` directly to the root.
        this.parent[i] = this.find(this.parent[i]);
        return this.parent[i];
    }

    /**
     * Unites the sets containing elements `i` and `j`.
     * Implements union by rank for optimization.
     * @param {number} i An element in the first set.
     * @param {number} j An element in the second set.
     * @returns {boolean} `true` if the sets were different and merged, `false` otherwise.
     */
    union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);

        if (rootI !== rootJ) {
            // Union by rank: Attach the smaller rank tree under the root of the larger rank tree.
            if (this.rank[rootI] < this.rank[rootJ]) {
                this.parent[rootI] = rootJ;
            } else if (this.rank[rootI] > this.rank[rootJ]) {
                this.parent[rootJ] = rootI;
            } else {
                // If ranks are equal, pick one as root and increment its rank.
                this.parent[rootJ] = rootI;
                this.rank[rootI]++;
            }
            return true; // Sets were merged.
        }
        return false; // `i` and `j` were already in the same set.
    }
}


/**
 * @param {number[]} nums
 * @return {number[]}
 */
var jumpGameIX = function(nums) {
    const n = nums.length;
    const ans = Array(n);

    // Step 1: Compute `prev_greater_idx` for all `i`.
    // `prev_greater_idx[i]` stores the index `k` such that `k < i`, `nums[k] > nums[i]`, and `k` is maximized.
    // Uses a monotonic increasing stack.
    const prev_greater_idx = Array(n).fill(-1);
    const stack_pg = []; // Stores indices in increasing order of nums values
    for (let i = 0; i < n; i++) {
        // While stack is not empty and the current number is greater than or equal to the number at stack top,
        // pop from stack. This ensures that `stack_pg` always stores indices of elements in increasing order of their values.
        // When we pop, it means the popped element cannot be the previous greater for `nums[i]` (or any element after `i` that is smaller than `nums[i]`).
        while (stack_pg.length > 0 && nums[stack_pg[stack_pg.length - 1]] <= nums[i]) {
            stack_pg.pop();
        }
        // If stack is not empty after popping, the top element is the previous greater element.
        if (stack_pg.length > 0) {
            prev_greater_idx[i] = stack_pg[stack_pg.length - 1];
        }
        // Push the current index onto the stack.
        stack_pg.push(i);
    }

    // Step 2: Compute `next_smaller_idx` for all `i`.
    // `next_smaller_idx[i]` stores the index `k` such that `k > i`, `nums[k] < nums[i]`, and `k` is minimized.
    // Uses a monotonic decreasing stack.
    const next_smaller_idx = Array(n).fill(-1);
    const stack_ns = []; // Stores indices in decreasing order of nums values
    for (let i = n - 1; i >= 0; i--) {
        // While stack is not empty and the current number is less than or equal to the number at stack top,
        // pop from stack. This ensures that `stack_ns` always stores indices of elements in decreasing order of their values.
        // When we pop, it means the popped element cannot be the next smaller for `nums[i]` (or any element before `i` that is larger than `nums[i]`).
        while (stack_ns.length > 0 && nums[stack_ns[stack_ns.length - 1]] <= nums[i]) { // Note: using <= to find STRICTLY smaller values for next_smaller
            stack_ns.pop();
        }
        // If stack is not empty after popping, the top element is the next smaller element.
        if (stack_ns.length > 0) {
            next_smaller_idx[i] = stack_ns[stack_ns.length - 1];
        }
        // Push the current index onto the stack.
        stack_ns.push(i);
    }

    // Step 3: Initialize Union-Find structure.
    const uf = new UnionFind(n);

    // Step 4: Perform unions based on valid jumps.
    // A jump from `i` to `j` implies `i` and `j` are in the same connected component for reachability.
    // If `i` can jump to `p = prev_greater_idx[i]`, we unite `i` and `p`.
    // If `i` can jump to `s = next_smaller_idx[i]`, we unite `i` and `s`.
    for (let i = 0; i < n; i++) {
        // Jump to a previous greater element
        if (prev_greater_idx[i] !== -1) {
            uf.union(i, prev_greater_idx[i]);
        }
        // Jump to a next smaller element
        if (next_smaller_idx[i] !== -1) {
            uf.union(i, next_smaller_idx[i]);
        }
    }

    // Step 5: Compute the maximum value for each component.
    // We use a Map to store `root -> max_value`.
    const componentMaxVal = new Map();
    for (let i = 0; i < n; i++) {
        const root = uf.find(i); // Get the representative of the component `i` belongs to.
        // Update the maximum value for this component.
        // If the root is not yet in the map, initialize its max value with `nums[i]`.
        // Otherwise, take the maximum of the current max value and `nums[i]`.
        componentMaxVal.set(root, Math.max(componentMaxVal.get(root) || -Infinity, nums[i]));
    }

    // Step 6: Construct the final answer array.
    // For each index `i`, its answer is the maximum value of its component.
    for (let i = 0; i < n; i++) {
        const root = uf.find(i); // Find the root of `i`'s component.
        ans[i] = componentMaxVal.get(root); // Assign the max value of that component.
    }

    return ans;
};
```