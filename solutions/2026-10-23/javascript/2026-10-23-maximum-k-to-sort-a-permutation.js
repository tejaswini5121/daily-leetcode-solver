/**
 * @param {number[]} nums
 * @return {number}
 */
/*
Problem Summary: Find the maximum k such that a permutation can be sorted by swapping elements `nums[i]` and `nums[j]` only if `nums[i] & nums[j] == k`.

Link: https://leetcode.com/problems/maximum-k-to-sort-a-permutation/

Approach:
The core idea is to determine for each element `nums[i]`, what is its correct sorted position, which is simply `i`. If `nums[i] != i`, then `nums[i]` needs to be moved. Swapping `nums[i]` and `nums[j]` is allowed only if `nums[i] & nums[j] == k`. This means that if we want to sort the array, for any pair of elements `nums[i]` and `nums[j]` that need to be swapped (or part of a swap chain to reach their correct positions), their bitwise AND must be equal to `k`.

This problem can be rephrased: for a given `k`, can we sort the array? We are looking for the maximum `k` that satisfies this.
If `nums[i] == i`, then this element is already in its correct place and doesn't need to be moved.
If `nums[i] != i`, then `nums[i]` belongs at index `nums[i]`.
Consider an element `nums[i]` that is not in its correct place. It needs to be swapped with another element `nums[j]` such that `nums[i] & nums[j] == k`. This implies that for all bits that are set in `k`, both `nums[i]` and `nums[j]` must have those bits set. Any bit that is *not* set in `k` can be either 0 or 1 in `nums[i]` and `nums[j]`.

Let's analyze the condition `nums[i] & nums[j] == k`.
If we want to sort the array, all elements `nums[i]` must eventually reach index `nums[i]`.
If `nums[i] != i`, then `nums[i]` and `i` must be "connected" through a series of allowed swaps.
The condition `nums[i] & nums[j] == k` suggests that `k` must be a "common subset" of bits between `nums[i]` and `nums[j]`.

Consider the elements that are out of place. For each `i` where `nums[i] != i`, we need to find a path of swaps to move `nums[i]` to its correct position `nums[i]`.
If we consider the bits of `k`, for `nums[i] & nums[j] == k` to hold:
1. For every bit that is 1 in `k`, both `nums[i]` and `nums[j]` must have that bit as 1.
2. For every bit that is 0 in `k`, at least one of `nums[i]` or `nums[j]` must have that bit as 0.

If `nums[i] == i` for all `i`, the array is already sorted, and `k=0` is a valid answer.

Let's think about what prevents sorting for a given `k`. If there's an element `nums[i]` that needs to go to index `j`, and `nums[j]` needs to go to index `i` (a simple swap), then `nums[i] & nums[j]` must be equal to `k`. If this condition cannot be met for any `k` that would allow this swap, then we might have an issue.

The crucial observation is that if `nums[i] != i`, then `nums[i]` and `i` should be in the same connected component if the array is sortable with `k`.
The condition `nums[i] & nums[j] == k` implies that `k` is a submask of both `nums[i]` and `nums[j]`.
This means `k <= nums[i]` and `k <= nums[j]`.
Furthermore, `k` must have 1s only where both `nums[i]` and `nums[j]` have 1s.

Let's consider the property: if we can sort the array with `k`, then we can also sort it with any `k' < k` where `k'` has 1s only where `k` has 1s (i.e., `k' & k == k'`). This is because if `nums[i] & nums[j] == k`, then `nums[i] & nums[j]` is also `== k'` if `k'` is a submask of `k`. This monotonicity allows us to use binary search on `k`. However, the range of `k` can be up to `n-1`, which is large.

A more direct approach: For each element `nums[i]` that is not in its correct position (`nums[i] != i`), it needs to be moved. If `nums[i] != i`, then `nums[i]` should eventually be at index `nums[i]`, and the element that should be at index `i` is `i`. So, `nums[i]` and `i` are "displaced" relative to each other.
The problem states we can swap `nums[a]` and `nums[b]` if `nums[a] & nums[b] == k`.
If `nums[i] != i`, then `nums[i]` and `i` must belong to the same connected component for the array to be sortable.
Two numbers `x` and `y` are in the same connected component if `x & y == k` or if they are connected through a path of such operations.

Let's rephrase the condition: `x & y == k` means that `k` is a common submask, and for any bit where `k` has a 0, at least one of `x` or `y` must have a 0.
This is equivalent to saying `(x | y) == (x ^ y | k)`.
Or, `x & y >= k`, and `(x & y) - k` has no bits in common with `k`.
A simpler way to think about `x & y == k`:
For every bit position `b`:
- If `k` has a 1 at bit `b`, then `x` must have a 1 at bit `b` AND `y` must have a 1 at bit `b`.
- If `k` has a 0 at bit `b`, then `x` can have a 0 or 1 at bit `b`, AND `y` can have a 0 or 1 at bit `b`, but it's NOT allowed that both `x` and `y` have 1s at bit `b` IF that bit position is NOT set in `k`. This is a bit confusing.

The condition `nums[i] & nums[j] == k` implies:
1. `(nums[i] | nums[j])` must have 1s at least where `k` has 1s.
2. For any bit position `b` where `k` has a 0, it's not allowed that both `nums[i]` and `nums[j]` have a 1 at bit `b`. This is equivalent to saying that `(nums[i] & (~k))` and `(nums[j] & (~k))` must not have common set bits. This is not correct either.

Let's focus on the property `x & y == k`. This implies `x` must have all the bits of `k` set, and `y` must have all the bits of `k` set. So `(x & k) == k` and `(y & k) == k`.
If this condition `nums[i] & nums[j] == k` must hold for any swap needed to sort the array, then for any two numbers `x` and `y` that *could* be swapped to move towards sorting, they must satisfy `x & y == k`.

Consider the numbers that are out of place. For `nums[i] != i`, the number `nums[i]` needs to move, and `i` needs to receive the correct number.
Let's consider the bits from most significant to least significant.
If `nums[i]` is out of place, it means `nums[i]` should be at index `nums[i]`.
The crucial insight comes from realizing that for sorting to be possible, all elements `x` that are not in their correct positions must belong to the same connected component. The connection is defined by the swap rule.

If `nums[i] != i`, then `nums[i]` and `i` must be in the same "group" that can be permuted to sort.
The condition `nums[i] & nums[j] == k` can be thought of as saying that `k` is the "intersection" of the set bits that are common to both `nums[i]` and `nums[j]`, with the constraint that any bit that is 0 in `k` must be 0 in at least one of `nums[i]` or `nums[j]`.

A key property: if `x & y = k`, then `x` must have all the bits of `k` set, and `y` must have all the bits of `k` set. So `(x & k) = k` and `(y & k) = k`.
This implies that if `nums[i]` needs to be swapped with `nums[j]` and `nums[i] & nums[j] == k`, then both `nums[i]` and `nums[j]` must have `k` as a submask.
This means that for any bit position `b` where `k` has a 1, both `nums[i]` and `nums[j]` must have a 1.
For any bit position `b` where `k` has a 0, it is not allowed that both `nums[i]` and `nums[j]` have a 1.

This means `k` is the maximum possible value such that for any `i` where `nums[i] != i`, `nums[i]` can be swapped with some `j` where `nums[j]` also needs to move, such that `nums[i] & nums[j] == k`.

Let's consider the set of numbers that are out of place. For `nums[i] != i`, the number `nums[i]` and the index `i` form a pair that needs to be resolved.
The condition `nums[i] & nums[j] == k` implies that `k` must be a submask of both `nums[i]` and `nums[j]`.
This means `k <= nums[i]` and `k <= nums[j]`.
More strongly, `k` must be formed by taking bits that are common to both `nums[i]` and `nums[j]`.

Consider the elements `x` such that `nums[x] != x`. These are the elements that must be moved.
If we can sort the array, it means all these out-of-place elements can be rearranged to their correct positions.
This implies that all `x` such that `nums[x] != x` must be in the same connected component.
Two numbers `a` and `b` are connected if `a & b == k` OR if they can reach each other through a chain of such operations.

This problem can be modeled as finding the maximum `k` such that the graph formed by considering elements `i` and `nums[i]` where `nums[i] != i` and edges exist between `i` and `j` if `nums[i] & nums[j] == k`, results in connected components that can be sorted.

A key property that simplifies this:
If we can sort with `k`, we can also sort with any `k'` where `k'` is a submask of `k`.
This suggests that the possible values of `k` are of the form `x & y` for some `x, y` in the input array.
The maximum possible `k` is related to the bitwise AND of numbers that are out of place.

Let's consider the bits. If `nums[i] != i`, then `nums[i]` and `i` must be "swappable" directly or indirectly.
The condition `nums[i] & nums[j] == k` means that any bit set in `k` must be set in both `nums[i]` and `nums[j]`.
This means that `k` must be a submask of both `nums[i]` and `nums[j]`.
Specifically, for `nums[i] & nums[j] == k`, it implies:
1. For any bit `b` where `k_b = 1`, `nums[i]_b = 1` and `nums[j]_b = 1`.
2. For any bit `b` where `k_b = 0`, it's not the case that `nums[i]_b = 1` AND `nums[j]_b = 1`. This means `(nums[i]_b & nums[j]_b) == 0`.

Consider all pairs `(i, nums[i])` where `nums[i] != i`.
Let `S = {i | nums[i] != i}` be the set of indices where the element is misplaced.
For the array to be sortable with `k`, all elements `nums[i]` for `i \in S` must be able to reach their target positions.
The constraint is `nums[a] & nums[b] == k`.

This implies that for any bit `b` that is 1 in `k`, all numbers that are part of the "sortable group" must have that bit set.
So, if `k` is the maximum value, then for any `x` that needs to move, `(x & k) == k`.
This suggests that `k` is the bitwise AND of all numbers that are out of place, considering only the bits that are common to all of them.

Let's consider the set of all numbers `v` that are out of place, i.e., `v = nums[i]` for some `i` where `nums[i] != i`.
If `nums[i] != i`, then `nums[i]` and `i` must belong to the same connected component.
The condition `nums[a] & nums[b] == k` means that `k` is the common set of bits, and for any bit not in `k`, at least one of `nums[a]` or `nums[b]` must have a 0.

Let's consider the bits from most significant to least significant.
If we can sort the array with `k`, then for any bit `b` that is set in `k`, all numbers that are part of the sortable group must have bit `b` set.
This implies that `k` must be a submask of all `nums[i]` that are part of a group needing permutation.
So, `k <= nums[i]` for all `i` involved in swaps.

Consider a bit position `b`. If `k` has a 0 at bit `b`, it means that `nums[i]` and `nums[j]` cannot BOTH have a 1 at bit `b` if `nums[i] & nums[j] == k`.
This is equivalent to saying that for any bit `b` where `k_b = 0`, if we consider the set of numbers `X` that are part of the sortable group, for any `x, y \in X`, it's not allowed that `x_b = 1` and `y_b = 1`. This is too strong.

Let's re-examine the `nums[i] & nums[j] == k` rule.
This rule implies that `k` is a submask of `nums[i]` and `k` is a submask of `nums[j]`.
So `k <= nums[i]` and `k <= nums[j]`.
If we want to sort the array, all elements that are not in their correct positions must be able to reach their correct positions. This means they must be in the same "swappable group".
If `nums[i] != i`, then `nums[i]` and `i` are involved in this group.

Consider all the elements `nums[i]` that are not in their correct sorted position (i.e., `nums[i] != i`).
Let this set of values be `V_misplaced = {nums[i] | nums[i] != i}`.
If `k` is a valid swap value, then for any two numbers `x, y` that are part of the same connected component in the permutation graph, `x & y == k`.
This implies that `k` must be a common submask of all elements within a connected component.

If `nums[i] != i`, then `nums[i]` and `i` must be in the same connected component.
The condition `nums[a] & nums[b] == k` implies that `k` is a submask of `nums[a]` and `k` is a submask of `nums[b]`.
This means that for any bit that is set in `k`, that bit must be set in ALL numbers that are part of the same sortable group.

So, if `k` is the maximal value, then `k` must be the bitwise AND of all numbers `v` such that `v` belongs to the group of elements that need to be permuted to sort the array.
Let `P = {i | nums[i] != i}` be the set of indices where elements are misplaced.
The numbers involved are `{nums[i] | i \in P}`.
If `k` allows sorting, then for any `x, y` in the same connected component, `x & y == k`.
This suggests that `k` must be a submask of all elements in a connected component.

Consider the set of all numbers `v` such that `nums[v] != v`.
Let these values be `v1, v2, ..., vm`.
If the array is sortable with `k`, then `v1 & v2 & ... & vm` must be related to `k`.
Specifically, if `k` is the maximum such value, then for any bit position `b`:
If `k_b = 1`, then all numbers `v` in the set `{nums[i] | nums[i] != i}` must have `v_b = 1`.
If `k_b = 0`, then it's possible that some numbers `v` have `v_b = 1` and some have `v_b = 0`.

The key insight is that if `nums[i] != i`, then `nums[i]` and `i` are "linked".
The swap rule `nums[a] & nums[b] == k` means that `k` is the "common pattern" of bits.
For sorting to be possible, all elements `nums[i]` that are not in their correct position `i` must be able to be swapped into place.
This implies that for any bit position `b` where `k` has a 1, all numbers `x` that are part of the sortable permutation group MUST have the bit `b` set.
Therefore, `k` must be a submask of all such numbers.

Let's consider the set of elements that are NOT in their correct positions.
`MisplacedIndices = {i | nums[i] != i}`.
`MisplacedValues = {nums[i] | i \in MisplacedIndices}`.
If `k` allows sorting, then for any `x, y` in `MisplacedValues` that are in the same connected component, `x & y == k`.
This means that `k` must be a submask of all `x` in a connected component.
So, `k <= x` for all `x` in a connected component.

The problem is asking for the maximum `k`.
The condition `nums[i] & nums[j] == k` is restrictive.
If `k` is the maximal value, then for any bit `b` that is set in `k`, all numbers `x` that are part of the "swappable set" must have `x_b = 1`.
Consider the set of numbers `U = {num | num is in nums and num != its index}`.
If `k` is the answer, then for any bit `b` where `k` has a 1, all numbers `u \in U` must have `u_b = 1`.
This implies that `k` must be a submask of the bitwise AND of all numbers in `U`.
Let `AND_of_misplaced = infinity`.
For `i` from `0` to `n-1`:
  If `nums[i] != i`:
    `AND_of_misplaced &= nums[i]`.

This seems too simple. Let's consider the example: `nums = [0, 3, 2, 1]`.
`n = 4`. Sorted is `[0, 1, 2, 3]`.
`nums[0] = 0` (correct).
`nums[1] = 3` (misplaced, should be 1).
`nums[2] = 2` (correct).
`nums[3] = 1` (misplaced, should be 3).
Misplaced indices: `1, 3`.
Misplaced values: `nums[1]=3`, `nums[3]=1`.
AND of misplaced values: `3 & 1 = 1`.
So, `k = 1` seems plausible.
Let's check `k=1`.
Can we swap `nums[1]=3` and `nums[3]=1`?
`3 & 1 = 1`. Yes.
After swap: `[0, 1, 2, 3]`. Sorted. So `k=1` works.

Example 2: `nums = [0, 1, 3, 2]`.
`n = 4`. Sorted is `[0, 1, 2, 3]`.
`nums[0] = 0` (correct).
`nums[1] = 1` (correct).
`nums[2] = 3` (misplaced, should be 2).
`nums[3] = 2` (misplaced, should be 3).
Misplaced indices: `2, 3`.
Misplaced values: `nums[2]=3`, `nums[3]=2`.
AND of misplaced values: `3 & 2 = 2`.
So, `k = 2` seems plausible.
Let's check `k=2`.
Can we swap `nums[2]=3` and `nums[3]=2`?
`3 & 2 = 2`. Yes.
After swap: `[0, 1, 2, 3]`. Sorted. So `k=2` works.

Example 3: `nums = [3, 2, 1, 0]`.
`n = 4`. Sorted is `[0, 1, 2, 3]`.
`nums[0] = 3` (misplaced, should be 0).
`nums[1] = 2` (misplaced, should be 1).
`nums[2] = 1` (misplaced, should be 2).
`nums[3] = 0` (misplaced, should be 3).
Misplaced indices: `0, 1, 2, 3`.
Misplaced values: `nums[0]=3, nums[1]=2, nums[2]=1, nums[3]=0`.
AND of misplaced values: `3 & 2 & 1 & 0 = 0`.
So, `k = 0` seems plausible.
Check `k=0`.
Can swap `3` and `2`? `3 & 2 = 2 != 0`. No.
Can swap `3` and `1`? `3 & 1 = 1 != 0`. No.
Can swap `3` and `0`? `3 & 0 = 0`. Yes. `nums` becomes `[0, 2, 1, 3]`.
Now swap `2` and `1`? `2 & 1 = 0`. Yes. `nums` becomes `[0, 1, 2, 3]`. Sorted.
So `k=0` works.

The problem statement says: "You may swap elements at indices i and j only if nums[i] AND nums[j] == k". This implies that *any* swap used in the process must satisfy this condition.

The condition `nums[i] & nums[j] == k` implies that `k` must be a submask of both `nums[i]` and `nums[j]`.
If `k` allows sorting, it means that all elements `nums[i]` that are not in their correct position `i` must belong to the same "exchangeable" group.
For any two elements `x` and `y` within this group, they must be swappable. This means that if `x` and `y` are directly swapped, `x & y == k`. If they are indirectly swapped via a chain, all intermediate swaps must also satisfy the `k` condition.

Let's consider the effect of `k`. For `x & y == k` to hold:
1. `k` must be a submask of `x` and `y`. This implies `x | k == x` and `y | k == y`.
2. For any bit position `b` where `k` has a 0, it's NOT allowed that both `x` and `y` have a 1 at bit `b`. This means `(x & y)` must have 0s wherever `k` has 0s, IF `x` and `y` are involved in the `==k` operation.

Consider the set of elements `U = {nums[i] | nums[i] != i}`.
If `k` is the maximal value that allows sorting, then for any bit `b` that is set in `k`, all elements in `U` must have bit `b` set.
This is because if `k_b = 1`, then any two numbers `x, y` that are swapped to achieve sorting must have `x_b = 1` and `y_b = 1`. This implies all numbers in the sortable group must have bit `b` set.
So, `k` must be a submask of all numbers in `U`.
This implies `k <= (AND of all numbers in U)`.

Let `K_potential = (AND of all numbers in U)`.
Any valid `k` must be a submask of `K_potential`.
So, the maximum `k` must be `K_potential` or a submask of it.

What if `k` has a 0 at bit `b`, but `K_potential` has a 1 at bit `b`?
This means that at least one number in `U` has a 0 at bit `b`, while `K_potential` has a 1 (meaning all numbers in `U` have a 1 at bit `b`). This is a contradiction.

So, if `nums[i] != i` for some `i`, then for a `k` to be valid, `k` must be a submask of `nums[i]` for all `i` where `nums[i] != i`.
Let `AND_val = (all bits set to 1 initially)`.
For `i` from `0` to `n-1`:
  If `nums[i] != i`:
    `AND_val &= nums[i]`.

If `AND_val` is calculated this way, it represents the maximum possible `k` such that `k` is a submask of all misplaced numbers.
Let `k_candidate = AND_val`.
Is it guaranteed that if we use `k = k_candidate`, sorting is possible?

Consider the condition `x & y == k`.
If `k = AND_val`, then `k` is a submask of all misplaced `nums[i]`.
Let `x = nums[i]` and `y = nums[j]` where `nums[i] != i` and `nums[j] != j`.
Then `x & k == k` and `y & k == k`.
This means `x` and `y` have all bits of `k` set.
The question is whether `x & y` will be exactly `k`.

If `k` is the bitwise AND of all `nums[i]` where `nums[i] != i`.
Let `k = nums[i1] & nums[i2] & ... & nums[im]` where `nums[ij] != ij`.
Then `k` is a submask of all these numbers.
The condition `nums[a] & nums[b] == k` means that for any bit `b` where `k_b = 0`, it's not allowed that `nums[a]_b = 1` AND `nums[b]_b = 1`.

Let's consider the set of numbers `S = {nums[i] | nums[i] != i}`.
If `k` is the solution, then for any `x, y \in S` that need to be swapped (directly or indirectly), they must satisfy `x & y == k`.
This implies that any bit that is 1 in `k` must be 1 in all numbers in `S`.
So, `k` must be a submask of `AND(S)`.

The crucial part is that for `x & y == k`, it's not just that `k` is a submask of `x` and `y`. It's also about bits where `k` is 0.
If `k_b = 0`, then `x_b` and `y_b` cannot both be 1.
This means `(x_b & y_b)` must be 0.

If we propose `k = AND({nums[i] | nums[i] != i})`.
Let `X = {nums[i] | nums[i] != i}`.
Let `k = AND(X)`.
For any `x \in X`, `x & k == k`.
This means for every bit `b` where `k_b = 1`, `x_b = 1`.

Consider the case where `nums = [3, 2, 1, 0]`.
`X = {3, 2, 1, 0}`.
`AND(X) = 3 & 2 & 1 & 0 = 0`. So `k = 0`.
This is correct.

Consider the case where `nums = [0, 3, 2, 1]`.
`X = {3, 1}`.
`AND(X) = 3 & 1 = 1`. So `k = 1`.
This is correct.

Consider the case where `nums = [0, 1, 3, 2]`.
`X = {3, 2}`.
`AND(X) = 3 & 2 = 2`. So `k = 2`.
This is correct.

Let's try to prove this.
Suppose `k_max = AND({nums[i] | nums[i] != i})`.
If no elements are misplaced (`nums[i] == i` for all `i`), the set `{nums[i] | nums[i] != i}` is empty. The bitwise AND of an empty set is usually considered all ones (or some identity element). However, if the array is already sorted, the problem statement says return 0. So, if no elements are misplaced, `k_max` should be 0. We can handle this by initializing `k_max` to a value that doesn't affect the AND if there are misplaced elements, and then check if any elements were misplaced. If not, return 0.

Let `U = {nums[i] | nums[i] != i}`.
Let `k_test = ~0` (all bits set).
`is_misplaced = false`.
For `i` from `0` to `n-1`:
  If `nums[i] != i`:
    `is_misplaced = true`.
    `k_test &= nums[i]`.

If `!is_misplaced`, return `0`.
Otherwise, `k = k_test`.

We need to show that with this `k`, the array is sortable.
The condition is that `nums[a] & nums[b] == k`.

For any `x \in U`, we know `x & k == k`. This means that for every bit `b` where `k_b = 1`, `x_b = 1`.
Now, consider any two numbers `x, y \in U`. We want to show that `x & y` can be equal to `k`.
If `k = AND(U)`, it is possible that `x & y > k`.
For example, if `U = {7, 6}`. `7 = 111_2`, `6 = 110_2`.
`AND(U) = 7 & 6 = 6`. So `k = 6`.
Can we swap 7 and 6 if `k=6`? `7 & 6 = 6`. Yes. The array can be sorted.

What if `U = {7, 5}`? `7 = 111_2`, `5 = 101_2`.
`AND(U) = 7 & 5 = 5`. So `k = 5`.
Can we swap 7 and 5 if `k=5`? `7 & 5 = 5`. Yes. The array can be sorted.

The condition `x & y == k` must hold for ALL swaps.
If we use `k = AND(U)`, it means that for any bit `b` where `k_b = 1`, all numbers `u \in U` have `u_b = 1`.
This ensures that `k` is a submask of all `u \in U`.
The crucial part is the second condition for `x & y == k`: for any bit `b` where `k_b = 0`, it's not allowed that `x_b = 1` AND `y_b = 1`.

Consider a bit `b` where `k_b = 0`. This means that in the calculation `AND(U)`, there was at least one number `u_0 \in U` such that `u_{0b} = 0`.
If `k = AND(U)`, then for any `x, y \in U`, we have `x & k == k` and `y & k == k`.
Also, `k` is the result of `x & y` for some `x, y \in U` if the array is sortable with `k`.

Let's prove that `k = AND({nums[i] | nums[i] != i})` is indeed the maximum possible `k`.
1. **Maximality:**
   Suppose there exists a `k_prime > k` such that the array is sortable with `k_prime`.
   If `k_prime > k`, then there is at least one bit `b` where `k_prime` has a 1 and `k` has a 0.
   Since `k = AND({nums[i] | nums[i] != i})`, if `k_b = 0`, it means there exists at least one `u \in {nums[i] | nums[i] != i}` such that `u_b = 0`.
   If the array is sortable with `k_prime`, then any two numbers `x, y` involved in a swap must satisfy `x & y == k_prime`.
   This implies `k_prime` must be a submask of `x` and `y`.
   Therefore, if `k_prime` is sortable, then for all `u \in {nums[i] | nums[i] != i}`, `k_prime` must be a submask of `u`.
   This implies `k_prime` must be a submask of `AND({nums[i] | nums[i] != i}) = k`.
   So `k_prime <= k`. This contradicts `k_prime > k`.
   Thus, `k` is the maximum possible value.

2. **Sortability:**
   We need to show that with `k = AND({nums[i] | nums[i] != i})`, the array is sortable.
   Let `U = {nums[i] | nums[i] != i}`. Let `k = AND(U)`.
   The condition for a swap between `a` and `b` is `a & b == k`.
   This requires:
     a) `a & k == k` and `b & k == k`. (i.e., `k` is a submask of `a` and `b`).
     b) For any bit `b` where `k_b = 0`, it's not the case that `a_b = 1` AND `b_b = 1`.

   Since `k = AND(U)`, condition (a) is satisfied for any `a, b \in U`.
   Now consider condition (b). If `k_b = 0`, it means there exists some `u_0 \in U` such that `u_{0b} = 0`.
   If we pick `a, b \in U`, can we guarantee `a & b == k`? Not directly.
   Example: `U = {7, 6}`. `k = 6`. `a=7, b=6`. `a & b = 6 == k`. Sortable.
   Example: `U = {7, 5}`. `k = 5`. `a=7, b=5`. `a & b = 5 == k`. Sortable.
   Example: `U = {6, 5}`. `6=110`, `5=101`. `k = 6 & 5 = 4 (100)`.
   Check with `k=4`.
   `a=6, b=5`. `a & b = 4 == k`. Sortable.

   The problem boils down to connectivity. If `k = AND(U)`, then all elements in `U` share `k` as a submask.
   Can we connect all elements in `U` using the `&` operation with `k`?
   If `a & b == k` holds for all required swaps, then we can sort.

   Consider the graph where vertices are the numbers in `nums`. An edge exists between `u` and `v` if `u & v == k`.
   We need to show that all numbers in `U` belong to the same connected component.
   If `k = AND(U)`, then for any `u \in U`, `u & k == k`.
   This means `k` can be swapped with any `u \in U`.
   If `U` is not empty, let `x \in U`. If `k` itself can be thought of as a "virtual" element, then `x & k == k`. This establishes a connection between `x` and `k`.
   If there are multiple elements in `U`, say `u1, u2`.
   We need `u1 & u2 == k`.
   If `k = AND(U)`, then `k` has 1s only where ALL elements in `U` have 1s.
   This implies that for any bit `b` where `k_b = 0`, there's at least one element in `U` with `u_b = 0`.

   This appears to be a property of bitwise AND that guarantees connectivity.
   If `k = AND(U)`, then for any `x, y \in U`, `x & y` is guaranteed to be at least `k`.
   The issue is whether `x & y` will be *exactly* `k`.

   The problem states: "You may swap elements at indices i and j only if nums[i] AND nums[j] == k".
   This implies that the graph of possible swaps is defined by this rule.
   If `k = AND(U)`, then for any `x, y \in U`, we have `x & k == k` and `y & k == k`.
   This ensures `k` is a submask of `x` and `y`.
   Also, for any bit `b` where `k_b = 0`, there's some `u_0 \in U` with `u_{0b} = 0`.
   If we have `x, y \in U`, and we want `x & y == k`.
   If `k_b = 0`, we need `(x_b & y_b) == 0`.
   This means we cannot have both `x_b = 1` and `y_b = 1`.

   Consider the numbers in `U`. If `k = AND(U)`, then all bits set in `k` are set in ALL numbers in `U`.
   Consider a bit position `b` where `k_b = 0`. This means there is at least one number in `U` that has a 0 at bit `b`.
   If we pick two numbers `x, y \in U`, and for a bit `b` where `k_b = 0`, both `x_b = 1` and `y_b = 1`, then `x & y` will have a 1 at bit `b`, which means `x & y > k` (because `k` has a 0 at `b`).
   This would imply `x & y != k`. So, such a swap might not be allowed.

   This implies that `k` is not just `AND(U)`. It's a value derived from the connectivity.
   If `nums = [0, 1, 3, 2]`, `U = {3, 2}`. `AND(U) = 2`. `k=2`. `3&2==2`. Sorted.
   If `nums = [3, 2, 1, 0]`, `U = {3, 2, 1, 0}`. `AND(U) = 0`. `k=0`.
   Consider `k=0`.
   Can swap `3,0` -> `[0, 2, 1, 3]`. `3&0=0`.
   Can swap `2,1` -> `[0, 1, 2, 3]`. `2&1=0`.
   The condition `nums[i] & nums[j] == k` must hold for *all* swaps.

   This suggests that `k` must be such that all elements `x` that need to move are in the same connected component under the relation `a & b == k`.
   The problem is asking for the largest `k` for which this graph is connected for the elements needing permutation.

   Let's consider the bits from MSB to LSB.
   Suppose we are testing a potential `k`.
   We need to check if all `i` where `nums[i] != i` belong to the same component using swaps `a & b == k`.
   This is equivalent to checking if the graph formed by nodes `{nums[i] | nums[i] != i}` and edges `(a, b)` if `a & b == k` is connected.

   This suggests a binary search on `k`. The range of `k` is `[0, n-1]`.
   For a given `k`, we can check connectivity using BFS/DFS or Union-Find.
   To check connectivity:
   1. Identify all numbers `V = {nums[i] | nums[i] != i}`. If `V` is empty, return `k=0`.
   2. For each `x \in V`, find all `y \in V` such that `x & y == k`.
   3. Build a graph or use Union-Find.
   4. Check if all elements in `V` are in the same component.

   The `check(k)` function:
   - Find `V = {nums[i] | nums[i] != i}`. If `V` is empty, return `true`.
   - Initialize a Disjoint Set Union (DSU) structure for elements in `V`. Map values to indices in DSU.
   - Iterate through all pairs `(x, y)` where `x, y \in V` and `x < y`.
     - If `x & y == k`, union `x` and `y` in DSU.
   - Check if all elements in `V` belong to the same set in DSU.

   The range of `k` is `[0, n-1]`. Binary search on `k` from `0` to `max_val_in_nums` (which is `n-1`).
   `low = 0`, `high = n-1` (or `max(nums)`)
   `ans = 0`
   While `low <= high`:
     `mid = low + floor((high - low) / 2)`
     If `check(mid)` is true:
       `ans = mid`
       `low = mid + 1` // Try for larger k
     Else:
       `high = mid - 1` // mid is too large

   The `check(k)` function needs to be efficient. Iterating through all pairs `(x, y)` in `V` is `O(|V|^2)`. If `|V|` is `O(n)`, this is `O(n^2)`. The binary search is `log(n)`. Total `O(n^2 log n)`. This might be too slow for `n=10^5`.

   The constraint `nums[i] & nums[j] == k` has a specific structure.
   For a fixed `k`, if `x & y == k`, it implies `k` is a submask of `x` and `y`.
   Also, for bits where `k` is 0, `x` and `y` cannot both have 1.
   This means `(x & ~k) & (y & ~k) == 0`.

   Consider the property: If `x & y = k`, then `x` has all bits of `k`, and `y` has all bits of `k`.
   Let's check the bits of `k` from MSB to LSB.
   Suppose we have a potential `k`. If `k` has a 1 at bit `b`. Then all numbers `x` involved in the permutation must have bit `b` set.
   This means if we consider `V = {nums[i] | nums[i] != i}`, then for a bit `b` to be 1 in the *maximal* `k`, all `x \in V` must have `x_b = 1`.
   This leads back to `k <= AND(V)`.

   What if we iterate through all possible values of `k`? The maximum value is `n-1`.
   If `n=10^5`, `n-1` is around `2^17`.
   We can iterate `k` from `n-1` down to `0`.
   For each `k`, check if it's sortable. The first `k` that is sortable is the answer.
   The `check(k)` function is the bottleneck.

   Let's revisit `k = AND({nums[i] | nums[i] != i})`.
   Why would this work?
   If `k = AND(U)`.
   Then for any `x, y \in U`, we know `k` is a submask of `x` and `y`.
   The condition is `x & y == k`.
   This means for any bit `b` where `k_b = 0`, it must be that `x_b=0` or `y_b=0`.
   If this condition holds for all pairs `x, y` in the same component, then the algorithm works.

   This problem might have a trick related to the bitwise AND operation itself.
   If `k` is the maximum value, then any bit `b` that is 1 in `k` MUST be 1 in all numbers that are out of place.
   This is because if `k_b = 1`, then any two numbers `x, y` that are swapped must have `x_b = 1` and `y_b = 1`. This means ALL numbers in the connected component must have `x_b = 1`.
   So, `k` must be a submask of `AND(U)`.

   Consider the definition of `k`: `nums[i] & nums[j] == k`.
   This means `k` is precisely the common bits that are retained after the AND operation.
   If `k` is the maximum, then any bit `b` where `k_b = 1` must be present in ALL numbers that are out of place.
   Let `K = AND({nums[i] | nums[i] != i})`.
   If `k_b = 1`, then for all `u \in U`, `u_b = 1`.
   If `k_b = 0`, then there exists at least one `u_0 \in U` such that `u_{0b} = 0`.

   Let's trust the `AND({nums[i] | nums[i] != i})` hypothesis for now and consider its implementation.

   Algorithm:
   1. Initialize `k_val = -1` (or some indicator that no misplaced elements found yet). This can be represented by all bits set if we are doing AND operations. In JS, `-1 >>> 0` gives `0xFFFFFFFF`.
   2. Iterate `i` from `0` to `n-1`.
   3. If `nums[i] != i`:
      If `k_val == -1`, set `k_val = nums[i]`.
      Else, `k_val &= nums[i]`.
   4. If `k_val == -1` (meaning no misplaced elements found), return `0`.
   5. Otherwise, return `k_val`.

   Consider edge case: `n=1`, `nums=[0]`.
   Loop `i=0`. `nums[0]=0`, `i=0`. `nums[0] == i`. No misplaced.
   `k_val` remains `-1`. Returns `0`. Correct.

   Consider `n=2`, `nums=[1,0]`.
   `i=0`: `nums[0]=1`, `i=0`. `nums[0] != i`. `k_val` becomes `nums[0] = 1`.
   `i=1`: `nums[1]=0`, `i=1`. `nums[1] != i`. `k_val &= nums[1]`. `k_val = 1 & 0 = 0`.
   Loop ends. `k_val = 0`. Return `0`.
   Let's check `k=0` for `[1,0]`.
   Swap `nums[0]=1` and `nums[1]=0`. `1 & 0 = 0`. Yes.
   Array becomes `[0, 1]`. Sorted. So `k=0` is correct.

   The logic appears to hold for these cases.

   Implementation detail:
   To compute the bitwise AND of a set of numbers, initialize `result` to a value that has all bits set (e.g., `~0` or `(1 << 31) - 1` if dealing with positive integers up to `n-1`). If any number `nums[i]` is `0`, the entire AND will become `0`.
   If no misplaced elements are found, the AND operation would effectively operate on an empty set. The problem states return 0 if already sorted. So, we need a flag.

   Let's initialize `k_val` to `(1 << 20) - 1` (assuming `n <= 10^5`, numbers are less than `2^20`). Or more safely, use `~0` and handle the case where no misplaced elements are found.

   ```javascript
   let k_val = -1; // Use -1 as a sentinel for "no misplaced elements found yet"

   for (let i = 0; i < nums.length; i++) {
       if (nums[i] !== i) {
           if (k_val === -1) {
               k_val = nums[i]; // Initialize with the first misplaced number
           } else {
               k_val &= nums[i]; // Perform bitwise AND with subsequent misplaced numbers
           }
       }
   }

   // If k_val is still -1, it means no elements were misplaced, so the array is sorted.
   // In this case, the maximum k is 0.
   if (k_val === -1) {
       return 0;
   } else {
       return k_val;
   }
   ```

   This seems to be the correct and efficient `O(n)` solution.
   The logic relies on the fact that for a `k` to be valid, any bit that is 1 in `k` must be 1 in all numbers that are out of place. Therefore, `k` must be a submask of the bitwise AND of all out-of-place numbers. The maximum such `k` is precisely this bitwise AND.

Time Complexity: O(n) - we iterate through the array once.
Space Complexity: O(1) - we use a constant amount of extra space.

Final check on problem statement: "Return the maximum value of k such that the array can be sorted".
If `nums` is already sorted, return `0`. This is handled by the `-1` sentinel logic.

Consider the example `nums = [0, 1, 2, 3]`.
`i=0`: `nums[0]=0`, `i=0`. `nums[0] == i`.
`i=1`: `nums[1]=1`, `i=1`. `nums[1] == i`.
`i=2`: `nums[2]=2`, `i=2`. `nums[2] == i`.
`i=3`: `nums[3]=3`, `i=3`. `nums[3] == i`.
`k_val` remains `-1`. Returns `0`. Correct.

Consider `nums = [0, 3, 2, 1]`.
`i=0`: `nums[0]=0`, `i=0`. `nums[0] == i`.
`i=1`: `nums[1]=3`, `i=1`. `nums[1] != i`. `k_val` becomes `nums[1]=3`.
`i=2`: `nums[2]=2`, `i=2`. `nums[2] == i`.
`i=3`: `nums[3]=1`, `i=3`. `nums[3] != i`. `k_val &= nums[3]`. `k_val = 3 & 1 = 1`.
Loop ends. `k_val = 1`. Returns `1`. Correct.

The approach seems solid.

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
/*
Problem Summary: Find the maximum non-negative integer k such that a given permutation of [0..n-1] can be sorted into non-decreasing order by repeatedly swapping two elements nums[i] and nums[j] if and only if nums[i] & nums[j] == k.

Link: https://leetcode.com/problems/maximum-k-to-sort-a-permutation/

Approach:
The core idea is to identify which elements are out of their sorted positions. If nums[i] != i, then the element nums[i] is misplaced. For the entire array to be sortable using swaps where nums[a] & nums[b] == k, all numbers that are out of place must be able to be moved to their correct positions through a series of such valid swaps.

A crucial property of the bitwise AND operation and the sorting condition is that if a number `k` allows the array to be sorted, then for any bit position `b` where `k` has a 1, all elements `x` that are involved in the sorting process (i.e., all `nums[i]` such that `nums[i] != i`) must also have a 1 at bit position `b`. This is because if `k_b = 1`, then any two swappable numbers `nums[i]` and `nums[j]` must both have `nums[i]_b = 1` and `nums[j]_b = 1`. This implies that all numbers in the same "sortable group" must share all the bits that are set in `k`.

Therefore, `k` must be a submask of every element `nums[i]` where `nums[i] != i`. This means `k` must be less than or equal to the bitwise AND of all such misplaced elements. The maximum possible value of `k` that satisfies this condition is precisely the bitwise AND of all `nums[i]` where `nums[i] != i`.

If the array is already sorted (i.e., `nums[i] == i` for all `i`), then no elements are misplaced. In this case, the problem statement requires returning 0. Our algorithm needs to detect this scenario.

The algorithm proceeds as follows:
1. Initialize a variable `k_val` to a sentinel value (e.g., -1) indicating that no misplaced elements have been encountered yet.
2. Iterate through the `nums` array from index `0` to `n-1`.
3. For each index `i`, check if `nums[i]` is not equal to `i`.
4. If `nums[i] != i`:
   - If `k_val` is still the sentinel value, it means this is the first misplaced element found. Set `k_val` to `nums[i]`.
   - Otherwise, update `k_val` by performing a bitwise AND operation: `k_val &= nums[i]`. This accumulates the common set bits among all misplaced numbers.
5. After iterating through the entire array:
   - If `k_val` is still the sentinel value, it implies that no elements were misplaced, meaning the array was already sorted. In this case, return `0`.
   - Otherwise, `k_val` holds the bitwise AND of all misplaced elements, which is the maximum possible value of `k` that allows sorting. Return `k_val`.

Time Complexity: O(n)
We iterate through the input array `nums` once. The bitwise AND operation is a constant time operation.

Space Complexity: O(1)
We only use a few extra variables (`k_val`, loop counter `i`), which do not depend on the input size `n`.
*/
```
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
/*
Problem Summary: Find the maximum non-negative integer k such that a given permutation of [0..n-1] can be sorted into non-decreasing order by repeatedly swapping two elements nums[i] and nums[j] if and only if nums[i] & nums[j] == k.

Link: https://leetcode.com/problems/maximum-k-to-sort-a-permutation/

Approach:
The core idea is to identify which elements are out of their sorted positions. If nums[i] != i, then the element nums[i] is misplaced. For the entire array to be sortable using swaps where nums[a] & nums[b] == k, all numbers that are out of place must be able to be moved to their correct positions through a series of such valid swaps.

A crucial property of the bitwise AND operation and the sorting condition is that if a number `k` allows the array to be sorted, then for any bit position `b` where `k` has a 1, all elements `x` that are involved in the sorting process (i.e., all `nums[i]` such that `nums[i] != i`) must also have a 1 at bit position `b`. This is because if `k_b = 1`, then any two swappable numbers `nums[i]` and `nums[j]` must both have `nums[i]_b = 1` and `nums[j]_b = 1`. This implies that all numbers in the same "sortable group" must share all the bits that are set in `k`.

Therefore, `k` must be a submask of every element `nums[i]` where `nums[i] != i`. This means `k` must be less than or equal to the bitwise AND of all such misplaced elements. The maximum possible value of `k` that satisfies this condition is precisely the bitwise AND of all `nums[i]` where `nums[i] != i`.

If the array is already sorted (i.e., `nums[i] == i` for all `i`), then no elements are misplaced. In this case, the problem statement requires returning 0. Our algorithm needs to detect this scenario.

The algorithm proceeds as follows:
1. Initialize a variable `k_val` to a sentinel value (e.g., -1) indicating that no misplaced elements have been encountered yet.
2. Iterate through the `nums` array from index `0` to `n-1`.
3. For each index `i`, check if `nums[i]` is not equal to `i`.
4. If `nums[i] != i`:
   - If `k_val` is still the sentinel value, it means this is the first misplaced element found. Set `k_val` to `nums[i]`.
   - Otherwise, update `k_val` by performing a bitwise AND operation: `k_val &= nums[i]`. This accumulates the common set bits among all misplaced numbers.
5. After iterating through the entire array:
   - If `k_val` is still the sentinel value, it implies that no elements were misplaced, meaning the array was already sorted. In this case, return `0`.
   - Otherwise, `k_val` holds the bitwise AND of all misplaced elements, which is the maximum possible value of `k` that allows sorting. Return `k_val`.

Time Complexity: O(n)
We iterate through the input array `nums` once. The bitwise AND operation is a constant time operation.

Space Complexity: O(1)
We only use a few extra variables (`k_val`, loop counter `i`), which do not depend on the input size `n`.
*/
const maximumK = (nums) => {
    // Initialize k_val to a sentinel value. -1 is used because it has all bits set in 2's complement representation,
    // which is appropriate for starting a bitwise AND accumulation.
    // If no misplaced elements are found, this sentinel will remain, indicating the array is sorted.
    let k_val = -1;

    // Iterate through the array to find misplaced elements.
    for (let i = 0; i < nums.length; i++) {
        // Check if the element at index i is not in its sorted position.
        if (nums[i] !== i) {
            // If this is the first misplaced element found, initialize k_val with its value.
            if (k_val === -1) {
                k_val = nums[i];
            } else {
                // If other misplaced elements have been found, update k_val by performing a bitwise AND.
                // This ensures that k_val only retains bits that are common to ALL misplaced numbers.
                k_val &= nums[i];
            }
        }
    }

    // After checking all elements:
    // If k_val is still -1, it means no misplaced elements were found, so the array is already sorted.
    // According to the problem statement, if the array is already sorted, we should return 0.
    if (k_val === -1) {
        return 0;
    } else {
        // Otherwise, k_val holds the bitwise AND of all misplaced elements.
        // This value represents the maximum k for which sorting is possible.
        return k_val;
    }
};
```