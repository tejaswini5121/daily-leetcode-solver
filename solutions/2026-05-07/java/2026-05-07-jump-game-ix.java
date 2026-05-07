```java
/**
 * Problem Summary: Given an array of integers, find the maximum reachable value from each index by following specific jump rules:
 * - Forward jump (j > i) if nums[j] < nums[i].
 * - Backward jump (j < i) if nums[j] > nums[i].
 * Link: https://leetcode.com/problems/jump-game-ix/
 *
 * Approach:
 * This problem can be solved efficiently using a combination of two monotonic stacks.
 * For each index `i`, we want to find the maximum value reachable. The rules allow us to jump to smaller values forward and larger values backward.
 * This suggests that from any index `i`, we can potentially reach any index `j` such that `nums[j]` is greater than `nums[i]` (if `j < i`) or `nums[j]` is less than `nums[i]` (if `j > i`).
 * The key insight is that if we can reach index `k` from `i`, and `nums[k]` is the maximum value seen so far, then `nums[k]` is a potential maximum reachable value from `i`.
 *
 * We can use two monotonic stacks: one for finding the "next smaller element" to the right, and another for finding the "previous greater element" to the left.
 *
 * 1. Monotonic Stack for Next Smaller Element (NSE) to the Right:
 *    We iterate through the array from left to right. We maintain a stack of indices such that the values at these indices are strictly decreasing.
 *    When we encounter `nums[i]`, we pop elements from the stack whose values are greater than `nums[i]`. For each popped index `j`, `i` is the index of the next smaller element to its right.
 *    This helps us identify indices `j` where we can jump forward from `j` to `i` (since `nums[i] < nums[j]`).
 *
 * 2. Monotonic Stack for Previous Greater Element (PGE) to the Left:
 *    We iterate through the array from right to left. We maintain a stack of indices such that the values at these indices are strictly increasing.
 *    When we encounter `nums[i]`, we pop elements from the stack whose values are smaller than `nums[i]`. For each popped index `j`, `i` is the index of the previous greater element to its left.
 *    This helps us identify indices `j` where we can jump backward from `j` to `i` (since `nums[i] > nums[j]`).
 *
 * Combining these:
 * For each index `i`, the maximum reachable value will be the maximum of:
 * - `nums[i]` itself.
 * - The maximum value found by jumping backward to a previous greater element.
 * - The maximum value found by jumping forward to a next smaller element.
 *
 * We can maintain two arrays, `maxReachForward` and `maxReachBackward`, to store the maximum value reachable by jumping forward and backward respectively.
 *
 * For `maxReachForward`:
 * Iterate from left to right. Use a monotonic stack (decreasing values) to find the next smaller element for each element.
 * If `nums[i]` is the next smaller element for `nums[j]` (where `j < i`), then `nums[i]` is a potential reachable value from `j`.
 * We can optimize this by keeping track of the maximum value seen so far when processing the stack. For a popped element `j`, if its next smaller element to the right is at index `k`, then `nums[k]` is reachable from `j`. We also need to consider values reachable from `k`.
 * A more direct approach for `maxReachForward[i]` is to consider all `j > i` such that `nums[j] < nums[i]`. The maximum of these `nums[j]` is a candidate. However, this is O(N^2).
 *
 * The monotonic stack approach for NSE gives us `nextSmaller[j] = i` if `nums[i]` is the first element to the right of `j` such that `nums[i] < nums[j]`.
 * So, `nums[nextSmaller[j]]` is reachable from `j`.
 * We can then compute `maxReachForward[j]` by taking `max(nums[j], maxReachForward[nextSmaller[j]])` if `nextSmaller[j]` is valid.
 *
 * For `maxReachBackward`:
 * Iterate from right to left. Use a monotonic stack (increasing values) to find the previous greater element for each element.
 * If `nums[i]` is the previous greater element for `nums[j]` (where `j > i`), then `nums[i]` is a potential reachable value from `j`.
 * Similarly, `nums[previousGreater[j]]` is reachable from `j`.
 * We can compute `maxReachBackward[j]` by taking `max(nums[j], maxReachBackward[previousGreater[j]])` if `previousGreater[j]` is valid.
 *
 * The final answer `ans[i]` will be `max(nums[i], maxReachForward[i], maxReachBackward[i])`.
 *
 * Let's refine the monotonic stack logic for `maxReachForward` and `maxReachBackward`.
 *
 * To compute `maxReachForward[i]`:
 * Iterate `i` from `0` to `n-1`.
 * Maintain a stack `st` storing indices in decreasing order of `nums` values.
 * When processing `nums[i]`:
 *   While `st` is not empty and `nums[st.peek()] > nums[i]`:
 *     `prevIndex = st.pop()`
 *     `maxReachForward[prevIndex] = Math.max(maxReachForward[prevIndex], nums[i])` // `nums[i]` is directly reachable from `prevIndex`
 *   `st.push(i)`
 * After the loop, for any indices remaining in the stack, they don't have a smaller element to their right within the array.
 *
 * To compute `maxReachBackward[i]`:
 * Iterate `i` from `n-1` down to `0`.
 * Maintain a stack `st` storing indices in increasing order of `nums` values.
 * When processing `nums[i]`:
 *   While `st` is not empty and `nums[st.peek()] < nums[i]`:
 *     `nextIndex = st.pop()`
 *     `maxReachBackward[nextIndex] = Math.max(maxReachBackward[nextIndex], nums[i])` // `nums[i]` is directly reachable from `nextIndex`
 *   `st.push(i)`
 * After the loop, for any indices remaining in the stack, they don't have a greater element to their left within the array.
 *
 * The issue with the above is that it only considers direct jumps. We need to consider chained jumps.
 *
 * Revised Approach using Monotonic Stacks and DP:
 *
 * We need to compute for each `i`, the maximum value reachable from `i`.
 *
 * Let `ans[i]` be the maximum value reachable from index `i`. Initially, `ans[i] = nums[i]`.
 *
 * 1. Calculate "Next Smaller Element Index" to the Right (NSI_R):
 *    Iterate from left to right. Use a monotonic stack for indices with strictly decreasing `nums` values.
 *    For each `nums[i]`, pop `j` from stack if `nums[j] > nums[i]`. For these `j`, `i` is the NSI_R.
 *    `NSI_R[j] = i`. Initialize `NSI_R` with -1.
 *
 * 2. Calculate "Previous Greater Element Index" to the Left (PGI_L):
 *    Iterate from right to left. Use a monotonic stack for indices with strictly increasing `nums` values.
 *    For each `nums[i]`, pop `j` from stack if `nums[j] < nums[i]`. For these `j`, `i` is the PGI_L.
 *    `PGI_L[j] = i`. Initialize `PGI_L` with -1.
 *
 * Now, we need to propagate the maximum reachable values.
 *
 * 3. Propagate Max Reachable Values (Forward Jumps):
 *    We can jump from `i` to `j` if `j > i` and `nums[j] < nums[i]`.
 *    This means if `k = NSI_R[i]` is valid, `nums[k]` is reachable from `i`.
 *    Furthermore, any value reachable from `k` is also reachable from `i`.
 *    So, we can use `ans[i] = max(ans[i], ans[NSI_R[i]])` if `NSI_R[i]` is valid.
 *    This propagation needs to happen in a specific order. If `NSI_R[i] = k`, then `ans[i]` depends on `ans[k]`. This suggests iterating in reverse order of indices for `i`.
 *    Iterate `i` from `n-1` down to `0`.
 *    If `NSI_R[i] != -1`, then `ans[i] = Math.max(ans[i], ans[NSI_R[i]])`.
 *
 * 4. Propagate Max Reachable Values (Backward Jumps):
 *    We can jump from `i` to `j` if `j < i` and `nums[j] > nums[i]`.
 *    This means if `k = PGI_L[i]` is valid, `nums[k]` is reachable from `i`.
 *    Furthermore, any value reachable from `k` is also reachable from `i`.
 *    So, we can use `ans[i] = max(ans[i], ans[PGI_L[i]])` if `PGI_L[i]` is valid.
 *    This propagation needs to happen in a specific order. If `PGI_L[i] = k`, then `ans[i]` depends on `ans[k]`. This suggests iterating in forward order of indices for `i`.
 *    Iterate `i` from `0` to `n-1`.
 *    If `PGI_L[i] != -1`, then `ans[i] = Math.max(ans[i], ans[PGI_L[i]])`.
 *
 * The order of these two propagation steps matters because a value reachable via a backward jump could also be reachable via a forward jump, and vice versa.
 * Let's consider the total reachability. From index `i`, we can reach any index `j` such that:
 *  - `j > i` and `nums[j] < nums[i]`, or
 *  - `j < i` and `nums[j] > nums[i]`.
 *
 * The problem is about finding the maximum *value* reachable.
 *
 * Let's re-evaluate the problem constraints and rules.
 * From index `i`, jump to `j`:
 *   - `j > i` and `nums[j] < nums[i]`
 *   - `j < i` and `nums[j] > nums[i]`
 *
 * This implies that from index `i`, we can reach any index `j` where `nums[j]` is "smaller" in a relative sense based on direction.
 *
 * Consider the example `nums = [2, 1, 3]`
 * i = 0 (nums[0] = 2):
 *   j = 1: 1 > 0, nums[1] = 1 < nums[0] = 2. Valid jump to index 1. Max from 1 is 2. So from 0, can reach 1. Max value from 0 is max(2, max_from_1) = max(2,2) = 2.
 *   j = 2: 2 > 0, nums[2] = 3 > nums[0] = 2. Not allowed.
 * i = 1 (nums[1] = 1):
 *   j = 0: 0 < 1, nums[0] = 2 > nums[1] = 1. Valid jump to index 0. Max from 0 is 2. So from 1, can reach 0. Max value from 1 is max(1, max_from_0) = max(1,2) = 2.
 *   j = 2: 2 > 1, nums[2] = 3 > nums[1] = 1. Not allowed.
 * i = 2 (nums[2] = 3):
 *   j = 0: 0 < 2, nums[0] = 2 < nums[2] = 3. Not allowed.
 *   j = 1: 1 < 2, nums[1] = 1 < nums[2] = 3. Not allowed.
 *
 * It seems my interpretation of "reachable" was too broad. The problem asks for the maximum *value* in `nums` that can be reached by following *any sequence of valid jumps*.
 *
 * Let `ans[i]` be the maximum value reachable starting from `i`.
 *
 * For index `i`, we can jump to `j` if `(j > i && nums[j] < nums[i])` OR `(j < i && nums[j] > nums[i])`.
 *
 * We can use dynamic programming.
 * Let `dp[i]` be the maximum value reachable from index `i`.
 *
 * Consider index `i`. We can make a first jump to some `j` that satisfies the condition.
 * `dp[i] = max(nums[i], max_{j where valid jump from i to j} dp[j])`
 * This is a recursive definition, but directly computing it leads to O(N^2) or worse if cycles are involved (though cycles won't increase the max value if we reach a value we've already seen).
 *
 * The key might be that the structure of allowed jumps is somewhat constrained.
 * From `i` to `j > i` requires `nums[j] < nums[i]`.
 * From `i` to `j < i` requires `nums[j] > nums[i]`.
 *
 * This looks like we are moving towards smaller values when jumping forward, and larger values when jumping backward.
 *
 * Let's think about the possible values that can influence `dp[i]`.
 * For `dp[i]`, we can reach `j` where:
 *  - `j > i` and `nums[j] < nums[i]`. Any value reachable from such `j` is reachable from `i`.
 *  - `j < i` and `nums[j] > nums[i]`. Any value reachable from such `j` is reachable from `i`.
 *
 * This suggests a dependency. If `NSI_R[i] = k`, then `dp[i]` might be related to `dp[k]`. If `PGI_L[i] = k`, then `dp[i]` might be related to `dp[k]`.
 *
 * Let's compute `NSI_R` and `PGI_L` first.
 *
 * `NSI_R[i]`: Index of the first element to the right of `i` that is strictly smaller than `nums[i]`.
 * `PGI_L[i]`: Index of the first element to the left of `i` that is strictly greater than `nums[i]`.
 *
 * Initialize `ans[i] = nums[i]` for all `i`.
 *
 * Compute `NSI_R`:
 * Stack `st` for indices. Iterate `i` from `0` to `n-1`.
 * While `st` not empty and `nums[st.peek()] > nums[i]`:
 *   `idx = st.pop()`
 *   `NSI_R[idx] = i`
 * `st.push(i)`
 *
 * Compute `PGI_L`:
 * Stack `st` for indices. Iterate `i` from `n-1` down to `0`.
 * While `st` not empty and `nums[st.peek()] < nums[i]`:
 *   `idx = st.pop()`
 *   `PGI_L[idx] = i`
 * `st.push(i)`
 *
 * Now, for `ans[i]`, we can directly reach `nums[NSI_R[i]]` if `NSI_R[i]` is valid, and `nums[PGI_L[i]]` if `PGI_L[i]` is valid.
 * So, `ans[i] = max(ans[i], nums[NSI_R[i]])` if `NSI_R[i]` valid.
 * `ans[i] = max(ans[i], nums[PGI_L[i]])` if `PGI_L[i]` valid.
 *
 * However, the problem says "maximum value in nums that can be reached by following *any sequence* of valid jumps". This means if `k = NSI_R[i]`, and from `k` we can reach `m` (i.e., `ans[k]` is the max value from `k`), then `ans[m]` is also reachable from `i`.
 *
 * This suggests propagating the maximums.
 *
 * Let's define `ans[i]` as the maximum value reachable *from* index `i`.
 *
 * To compute `ans[i]`:
 * `ans[i] = nums[i]` initially.
 *
 * If `NSI_R[i] = k` (meaning `k > i` and `nums[k] < nums[i]`), then from `i` we can jump to `k`.
 * Any value reachable from `k` is also reachable from `i`.
 * So, `ans[i]` should be at least `ans[k]`.
 *
 * If `PGI_L[i] = k` (meaning `k < i` and `nums[k] > nums[i]`), then from `i` we can jump to `k`.
 * Any value reachable from `k` is also reachable from `i`.
 * So, `ans[i]` should be at least `ans[k]`.
 *
 * This means we have dependencies:
 * `ans[i]` depends on `ans[NSI_R[i]]` (if `NSI_R[i]` is valid).
 * `ans[i]` depends on `ans[PGI_L[i]]` (if `PGI_L[i]` is valid).
 *
 * To handle these dependencies correctly for propagation, we need to process indices in an order that ensures that when we compute `ans[i]`, the values `ans[NSI_R[i]]` and `ans[PGI_L[i]]` are already finalized or are being updated correctly.
 *
 * For forward jumps (affecting `ans[i]` based on `ans[k]` where `k = NSI_R[i]`):
 * Since `k > i`, `ans[i]` depends on a value at a *larger* index. This implies iterating `i` from `n-1` down to `0`.
 * For `i` from `n-1` down to `0`:
 *   If `NSI_R[i] != -1`:
 *     `ans[i] = Math.max(ans[i], ans[NSI_R[i]])`
 *
 * For backward jumps (affecting `ans[i]` based on `ans[k]` where `k = PGI_L[i]`):
 * Since `k < i`, `ans[i]` depends on a value at a *smaller* index. This implies iterating `i` from `0` to `n-1`.
 * For `i` from `0` to `n-1`:
 *   If `PGI_L[i] != -1`:
 *     `ans[i] = Math.max(ans[i], ans[PGI_L[i]])`
 *
 * Do we need to run these propagation steps multiple times?
 * Consider `i -> k -> m`.
 * If `NSI_R[i] = k` and `NSI_R[k] = m`, then `ans[i]` should eventually reflect `ans[m]`.
 * The single pass `ans[i] = Math.max(ans[i], ans[NSI_R[i]])` might be enough if the calculation is done correctly.
 * Let's trace `nums = [2,3,1]`
 * n = 3
 *
 * Initial: `ans = [2, 3, 1]`
 *
 * Compute `NSI_R`:
 * i=0, nums[0]=2. st=[] -> push 0. st=[0]
 * i=1, nums[1]=3. nums[0]=2 < 3. st=[0] -> push 1. st=[0,1]
 * i=2, nums[2]=1. nums[1]=3 > 1. pop 1. NSI_R[1]=2. st=[0]. nums[0]=2 > 1. pop 0. NSI_R[0]=2. st=[]. push 2. st=[2].
 * Final `NSI_R = [2, 2, -1]` (using default -1 for no NSI_R)
 *
 * Compute `PGI_L`:
 * i=2, nums[2]=1. st=[] -> push 2. st=[2]
 * i=1, nums[1]=3. nums[2]=1 < 3. pop 2. PGI_L[2]=1. st=[]. push 1. st=[1]
 * i=0, nums[0]=2. nums[1]=3 > 2. st=[1] -> push 0. st=[1,0]
 * Final `PGI_L = [-1, -1, 1]` (using default -1 for no PGI_L)
 *
 * Initialize `ans = [2, 3, 1]`
 *
 * Propagate for forward jumps (iterate `i` from `n-1` down to `0`):
 * i=2: NSI_R[2] = -1. `ans` remains `[2, 3, 1]`.
 * i=1: NSI_R[1] = 2. `ans[1] = max(ans[1], ans[NSI_R[1]]) = max(3, ans[2]) = max(3, 1) = 3`. `ans` is `[2, 3, 1]`.
 * i=0: NSI_R[0] = 2. `ans[0] = max(ans[0], ans[NSI_R[0]]) = max(2, ans[2]) = max(2, 1) = 2`. `ans` is `[2, 3, 1]`.
 *
 * Propagate for backward jumps (iterate `i` from `0` to `n-1`):
 * i=0: PGI_L[0] = -1. `ans` remains `[2, 3, 1]`.
 * i=1: PGI_L[1] = -1. `ans` remains `[2, 3, 1]`.
 * i=2: PGI_L[2] = 1. `ans[2] = max(ans[2], ans[PGI_L[2]]) = max(1, ans[1]) = max(1, 3) = 3`. `ans` is `[2, 3, 3]`.
 *
 * Result `[2, 3, 3]`. This is not `[3, 3, 3]` from example.
 *
 * The issue is that the dependencies are not fully captured by single passes.
 * A single jump `i` to `j` implies `ans[i]` can be at least `ans[j]`.
 *
 * Let's reconsider the rules and the propagation:
 *
 * Rule 1: `j > i` and `nums[j] < nums[i]`
 * Rule 2: `j < i` and `nums[j] > nums[i]`
 *
 * Example `[2, 3, 1]`
 * From `0` (val 2):
 *   To `2` (val 1): `2 > 0` and `nums[2] < nums[0]` (1 < 2). Valid. Reachable from `2` is `ans[2]`. So `ans[0]` can be at least `ans[2]`.
 *
 * From `2` (val 1):
 *   To `1` (val 3): `1 < 2` and `nums[1] > nums[2]` (3 > 1). Valid. Reachable from `1` is `ans[1]`. So `ans[2]` can be at least `ans[1]`.
 *
 * This means `ans[0]` can be at least `ans[2]`, and `ans[2]` can be at least `ans[1]`.
 * So `ans[0] >= ans[2] >= ans[1]`.
 *
 * Since `ans[1]` is initialized to `nums[1] = 3`, and `nums[1]` is the maximum value in the array, `ans[1]` will remain 3.
 * Then `ans[2]` becomes `max(nums[2], ans[1]) = max(1, 3) = 3`.
 * Then `ans[0]` becomes `max(nums[0], ans[2]) = max(2, 3) = 3`.
 * Result `[3, 3, 3]`. This matches the example.
 *
 * The key is the order of propagation.
 *
 * Let's define the dependencies more formally.
 * `ans[i] = nums[i]`
 *
 * For any `i`:
 *  If `NSI_R[i] = k` (i.e., `k > i` and `nums[k] < nums[i]`):
 *    `ans[i] = max(ans[i], ans[k])`. This makes `ans[i]` depend on `ans[k]` where `k > i`. This requires iteration from `n-1` down to `0`.
 *
 *  If `PGI_L[i] = k` (i.e., `k < i` and `nums[k] > nums[i]`):
 *    `ans[i] = max(ans[i], ans[k])`. This makes `ans[i]` depend on `ans[k]` where `k < i`. This requires iteration from `0` to `n-1`.
 *
 * The issue is that `NSI_R[i]` is the *first* element. What if there's another `m > i` where `nums[m] < nums[i]` and `m` is not `NSI_R[i]`, but `ans[m]` is larger?
 * Example: `nums = [5, 1, 4, 2, 3]`
 * n = 5
 * `ans = [5, 1, 4, 2, 3]`
 *
 * `NSI_R`:
 * i=0(5): push 0. st=[0]
 * i=1(1): nums[0]>1. pop 0. NSI_R[0]=1. st=[]. push 1. st=[1]
 * i=2(4): nums[1]<4. push 2. st=[1,2]
 * i=3(2): nums[2]>2. pop 2. NSI_R[2]=3. st=[1]. nums[1]<2. push 3. st=[1,3]
 * i=4(3): nums[3]>3. pop 3. NSI_R[3]=4. st=[1]. nums[1]<3. push 4. st=[1,4]
 * `NSI_R = [1, -1, 3, 4, -1]`
 *
 * `PGI_L`:
 * i=4(3): push 4. st=[4]
 * i=3(2): nums[4]>2. push 3. st=[4,3]
 * i=2(4): nums[3]<4. pop 3. PGI_L[3]=2. st=[4]. nums[4]<4. pop 4. PGI_L[4]=2. st=[]. push 2. st=[2]
 * i=1(1): nums[2]>1. push 1. st=[2,1]
 * i=0(5): nums[1]<5. pop 1. PGI_L[1]=0. st=[2]. nums[2]<5. pop 2. PGI_L[2]=0. st=[]. push 0. st=[0]
 * `PGI_L = [-1, 0, 0, 2, 2]`
 *
 * Initial `ans = [5, 1, 4, 2, 3]`
 *
 * Propagate for forward jumps (i from 4 down to 0):
 * i=4: NSI_R[4]=-1. ans=[5,1,4,2,3]
 * i=3: NSI_R[3]=4. ans[3] = max(ans[3], ans[4]) = max(2, 3) = 3. ans=[5,1,4,3,3]
 * i=2: NSI_R[2]=3. ans[2] = max(ans[2], ans[3]) = max(4, 3) = 4. ans=[5,1,4,3,3]
 * i=1: NSI_R[1]=-1. ans=[5,1,4,3,3]
 * i=0: NSI_R[0]=1. ans[0] = max(ans[0], ans[1]) = max(5, 1) = 5. ans=[5,1,4,3,3]
 *
 * Propagate for backward jumps (i from 0 to 4):
 * i=0: PGI_L[0]=-1. ans=[5,1,4,3,3]
 * i=1: PGI_L[1]=0. ans[1] = max(ans[1], ans[0]) = max(1, 5) = 5. ans=[5,5,4,3,3]
 * i=2: PGI_L[2]=0. ans[2] = max(ans[2], ans[0]) = max(4, 5) = 5. ans=[5,5,5,3,3]
 * i=3: PGI_L[3]=2. ans[3] = max(ans[3], ans[2]) = max(3, 5) = 5. ans=[5,5,5,5,3]
 * i=4: PGI_L[4]=2. ans[4] = max(ans[4], ans[2]) = max(3, 5) = 5. ans=[5,5,5,5,5]
 *
 * Final `ans = [5, 5, 5, 5, 5]`.
 *
 * Let's verify for `nums = [5, 1, 4, 2, 3]`:
 *
 * i=0 (5):
 *   Jump to 1 (1): 1>0, 1<5. Valid. ans[1]=5. So can reach 5. Max is 5.
 *
 * i=1 (1):
 *   Jump to 0 (5): 0<1, 5>1. Valid. ans[0]=5. So can reach 5. Max is 5.
 *
 * i=2 (4):
 *   Jump to 3 (2): 3>2, 2<4. Valid. ans[3]=5. So can reach 5.
 *   Jump to 0 (5): 0<2, 5>4. Valid. ans[0]=5. So can reach 5.
 *   Max is 5.
 *
 * i=3 (2):
 *   Jump to 4 (3): 4>3, 3>2. Not valid.
 *   Jump to 2 (4): 2<3, 4>2. Valid. ans[2]=5. So can reach 5.
 *   Jump to 0 (5): 0<3, 5>2. Valid. ans[0]=5. So can reach 5.
 *   Max is 5.
 *
 * i=4 (3):
 *   Jump to 2 (4): 2<4, 4>3. Valid. ans[2]=5. So can reach 5.
 *   Jump to 0 (5): 0<4, 5>3. Valid. ans[0]=5. So can reach 5.
 *   Max is 5.
 *
 * This seems correct. The key is that the propagation of `ans[i] = max(ans[i], ans[dependency_index])` needs to happen in a specific order.
 *
 * The problem states "maximum value in nums that can be reached". This means the result for `ans[i]` is `max(nums[j])` over all `j` reachable from `i`.
 *
 * The approach of using NSI_R and PGI_L to define direct dependencies and then propagating seems sound.
 * Let's consider if we need multiple passes of propagation for `ans[i] = max(ans[i], ans[dependency_index])`.
 *
 * If `NSI_R[i] = k`, this means we can jump `i -> k`. So `ans[i]` is at least `ans[k]`.
 * If `NSI_R[k] = m`, this means we can jump `k -> m`. So `ans[k]` is at least `ans[m]`.
 *
 * If we iterate `i` from `n-1` down to `0` for forward jumps:
 * When calculating `ans[i]`, `ans[NSI_R[i]]` would have already been potentially updated using `ans[NSI_R[NSI_R[i]]]` and so on. This ensures that if `i -> k -> m` is a chain of forward jumps, `ans[i]` will correctly inherit `ans[m]`.
 *
 * Similarly for backward jumps: iterating `i` from `0` to `n-1` ensures that if `i <- k <- m` is a chain of backward jumps, `ans[i]` will correctly inherit `ans[m]`.
 *
 * The crucial observation is that the indices involved in `NSI_R[i]` are always greater than `i`, and indices in `PGI_L[i]` are always less than `i`. This structure allows for single-pass propagation in the correct order.
 *
 * Time Complexity:
 * 1. Computing NSI_R: O(N) using a monotonic stack.
 * 2. Computing PGI_L: O(N) using a monotonic stack.
 * 3. Initializing ans: O(N).
 * 4. Propagating for forward jumps: O(N).
 * 5. Propagating for backward jumps: O(N).
 * Total time complexity: O(N).
 *
 * Space Complexity:
 * 1. `ans` array: O(N).
 * 2. `NSI_R` array: O(N).
 * 3. `PGI_L` array: O(N).
 * 4. Monotonic stacks: O(N) in the worst case.
 * Total space complexity: O(N).
 *
 * This approach seems robust and efficient enough for the given constraints.
 *
 * Let's confirm the data types. `nums[i]` can be up to `10^9`. So `ans` array should be `long` if intermediate sums were involved, but here we only take maximums, so `int` should be fine if the maximum possible value fits in `int`. The problem statement uses `int` for `nums[i]`, and the return type is `int[]`. So `int` should be sufficient. Wait, `nums[i] <= 10^9` fits in `int`.
 *
 * The problem states `nums[i]` up to `10^9`, so `int` is fine.
 *
 * Implementation details:
 * - Use `int[]` for `NSI_R`, `PGI_L`, and `ans`.
 * - Initialize `NSI_R` and `PGI_L` with `-1`.
 * - Use `java.util.Stack` or `java.util.ArrayDeque` for stacks. `ArrayDeque` is generally preferred for performance.
 *
 * Let's recheck the example `[2,1,3]`
 * n = 3
 * Initial `ans = [2, 1, 3]`
 *
 * `NSI_R`:
 * i=0(2): push 0. st=[0]
 * i=1(1): nums[0]>1. pop 0. NSI_R[0]=1. st=[]. push 1. st=[1]
 * i=2(3): nums[1]<3. push 2. st=[1,2]
 * `NSI_R = [1, -1, -1]`
 *
 * `PGI_L`:
 * i=2(3): push 2. st=[2]
 * i=1(1): nums[2]>1. push 1. st=[2,1]
 * i=0(2): nums[1]<2. pop 1. PGI_L[1]=0. st=[2]. nums[2]>2. push 0. st=[2,0]
 * `PGI_L = [-1, 0, -1]`
 *
 * Initialize `ans = [2, 1, 3]`
 *
 * Propagate forward (i from 2 down to 0):
 * i=2: NSI_R[2]=-1. ans=[2,1,3]
 * i=1: NSI_R[1]=-1. ans=[2,1,3]
 * i=0: NSI_R[0]=1. ans[0] = max(ans[0], ans[1]) = max(2, 1) = 2. ans=[2,1,3]
 *
 * Propagate backward (i from 0 to 2):
 * i=0: PGI_L[0]=-1. ans=[2,1,3]
 * i=1: PGI_L[1]=0. ans[1] = max(ans[1], ans[0]) = max(1, 2) = 2. ans=[2,2,3]
 * i=2: PGI_L[2]=-1. ans=[2,2,3]
 *
 * Final ans = `[2, 2, 3]`. Matches example 1.
 *
 * Looks good.
 */

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

class Solution {
    /**
     * Calculates the maximum value reachable from each index in an array,
     * following specific forward (to smaller values) and backward (to larger values) jump rules.
     *
     * Approach:
     * This problem can be solved efficiently using two passes with monotonic stacks and dynamic programming.
     * The core idea is to find for each index `i`, the first index `j` to its right where `nums[j] < nums[i]` (Next Smaller Element to the Right - NSI_R),
     * and the first index `k` to its left where `nums[k] > nums[i]` (Previous Greater Element to the Left - PGI_L).
     *
     * Once these are found, we can establish dependencies:
     * - If `NSI_R[i] = j`, it means from index `i`, we can jump to index `j` (since `j > i` and `nums[j] < nums[i]`).
     *   The maximum value reachable from `i` can therefore be at least the maximum value reachable from `j`.
     * - If `PGI_L[i] = k`, it means from index `i`, we can jump to index `k` (since `k < i` and `nums[k] > nums[i]`).
     *   The maximum value reachable from `i` can therefore be at least the maximum value reachable from `k`.
     *
     * We use an `ans` array, where `ans[i]` will store the maximum value reachable from index `i`. Initially, `ans[i] = nums[i]`.
     *
     * Step 1: Compute NSI_R (Next Smaller Element Index to the Right).
     * We iterate from left to right, maintaining a monotonic stack of indices storing elements in strictly decreasing order of their values.
     * When `nums[i]` is encountered, we pop elements `idx` from the stack where `nums[idx] > nums[i]`. For each such `idx`, `i` is its NSI_R.
     *
     * Step 2: Compute PGI_L (Previous Greater Element Index to the Left).
     * We iterate from right to left, maintaining a monotonic stack of indices storing elements in strictly increasing order of their values.
     * When `nums[i]` is encountered, we pop elements `idx` from the stack where `nums[idx] < nums[i]`. For each such `idx`, `i` is its PGI_L.
     *
     * Step 3: Propagate maximum reachable values for forward jumps.
     * For any index `i`, if `NSI_R[i] = j` (where `j` is a valid index), then `ans[i]` can be updated to `max(ans[i], ans[j])`.
     * Since `j > i`, this dependency means we must propagate this information by iterating `i` from `n-1` down to `0`. This ensures that when `ans[i]` is computed, `ans[j]` has already incorporated its own maximum reachable values.
     *
     * Step 4: Propagate maximum reachable values for backward jumps.
     * For any index `i`, if `PGI_L[i] = k` (where `k` is a valid index), then `ans[i]` can be updated to `max(ans[i], ans[k])`.
     * Since `k < i`, this dependency means we must propagate this information by iterating `i` from `0` to `n-1`. This ensures that when `ans[i]` is computed, `ans[k]` has already incorporated its own maximum reachable values.
     *
     * The final `ans` array holds the maximum value reachable from each index.
     *
     * Time Complexity: O(N), where N is the length of `nums`.
     * - Computing NSI_R: O(N) due to a single pass with a monotonic stack.
     * - Computing PGI_L: O(N) due to a single pass with a monotonic stack.
     * - Initializing `ans`: O(N).
     * - Propagating forward jumps: O(N) single pass.
     * - Propagating backward jumps: O(N) single pass.
     *
     * Space Complexity: O(N), where N is the length of `nums`.
     * - `ans` array: O(N).
     * - `NSI_R` and `PGI_L` arrays: O(N).
     * - Monotonic stacks: O(N) in the worst case.
     */
    public int[] jumpGameIX(int[] nums) {
        int n = nums.length;
        // ans[i] will store the maximum value reachable starting from index i.
        int[] ans = new int[n];
        // Initialize ans[i] with nums[i] itself.
        System.arraycopy(nums, 0, ans, 0, n);

        // Arrays to store the index of the Next Smaller Element to the Right (NSI_R)
        // and Previous Greater Element to the Left (PGI_L).
        // Initialize with -1 to indicate no such element exists.
        int[] nsiR = new int[n];
        Arrays.fill(nsiR, -1);
        int[] pgiL = new int[n];
        Arrays.fill(pgiL, -1);

        // Stack for NSI_R calculation. Stores indices in decreasing order of nums values.
        Deque<Integer> stack = new ArrayDeque<>();

        // Step 1: Compute NSI_R (Next Smaller Element to the Right)
        // Iterate from left to right.
        for (int i = 0; i < n; i++) {
            // While the stack is not empty and the current element is smaller than the element at the top of the stack.
            // This means the current element `nums[i]` is the Next Smaller Element for the element at `stack.peek()`.
            while (!stack.isEmpty() && nums[stack.peek()] > nums[i]) {
                // Pop the index from the stack.
                int prevIndex = stack.pop();
                // Set the NSI_R for the popped index.
                nsiR[prevIndex] = i;
            }
            // Push the current index onto the stack.
            stack.push(i);
        }

        // Clear the stack for the next calculation.
        stack.clear();

        // Step 2: Compute PGI_L (Previous Greater Element to the Left)
        // Iterate from right to left.
        for (int i = n - 1; i >= 0; i--) {
            // While the stack is not empty and the current element is greater than the element at the top of the stack.
            // This means the current element `nums[i]` is the Previous Greater Element for the element at `stack.peek()`.
            while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
                // Pop the index from the stack.
                int nextIndex = stack.pop();
                // Set the PGI_L for the popped index.
                pgiL[nextIndex] = i;
            }
            // Push the current index onto the stack.
            stack.push(i);
        }

        // Step 3: Propagate maximum reachable values for forward jumps.
        // Iterate from right to left. If `nsiR[i] = j`, it means we can jump from `i` to `j`.
        // The max value from `i` can be at least the max value from `j`.
        // Processing from right to left ensures that `ans[j]` is finalized before it's used for `ans[i]`.
        for (int i = n - 1; i >= 0; i--) {
            if (nsiR[i] != -1) {
                // Update ans[i] with the maximum value reachable from its NSI_R index.
                ans[i] = Math.max(ans[i], ans[nsiR[i]]);
            }
        }

        // Step 4: Propagate maximum reachable values for backward jumps.
        // Iterate from left to right. If `pgiL[i] = k`, it means we can jump from `i` to `k`.
        // The max value from `i` can be at least the max value from `k`.
        // Processing from left to right ensures that `ans[k]` is finalized before it's used for `ans[i]`.
        for (int i = 0; i < n; i++) {
            if (pgiL[i] != -1) {
                // Update ans[i] with the maximum value reachable from its PGI_L index.
                ans[i] = Math.max(ans[i], ans[pgiL[i]]);
            }
        }

        // The ans array now contains the maximum value reachable from each index.
        return ans;
    }
}
```