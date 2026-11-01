// Problem Summary: Find the minimum moves to make all elements in an array equal, where a move increments n-1 elements by 1.
// Link: https://leetcode.com/problems/minimum-moves-to-equal-array-elements/
// Approach:
// The key insight is that incrementing n-1 elements by 1 is equivalent to decrementing one element by 1 relative to the others.
// If we want all elements to be equal to some target value 'T', and each move effectively reduces one element by 1 (relative to others),
// then to make all elements equal to the minimum element in the original array, the total number of moves will be the sum of the differences
// between each element and the minimum element.
//
// Let 'm' be the number of moves.
// Let 'sum' be the sum of all elements in the array.
// Let 'min_val' be the minimum element in the array.
// Let 'n' be the length of the array.
// After 'm' moves, the sum of the array will be: sum + m * (n - 1).
// If all elements become equal to some value 'x', then the final sum will be n * x.
//
// Consider the final state where all elements are equal to some value 'k'.
// Let the original array be nums.
// Each move increments n-1 elements by 1. This is the same as decrementing 1 element by 1, relative to the maximum.
// Or, if we want all elements to eventually be equal to some value 'target', and the minimum element 'min_val' needs to reach 'target',
// then every move that increments n-1 elements is effectively pushing all other elements closer to 'target'.
//
// Let the final equal value be 'F'.
// The sum of the initial array is S.
// The number of moves is 'm'.
// The sum of the array after 'm' moves is S + m * (n - 1).
// The final state has all elements equal to 'F'. So, the final sum is n * F.
// Thus, S + m * (n - 1) = n * F.
//
// Now, consider the minimum element 'min_val'. In each move, 'min_val' is either incremented or not.
// If 'min_val' is incremented, then all other n-1 elements are also incremented.
// If 'min_val' is not incremented, then one of the other elements is not incremented, while 'min_val' is incremented along with the rest.
//
// Let's rephrase: a move is incrementing n-1 elements.
// Consider the target value: if we make all elements equal, the smallest element will need the most increments.
// If we make all elements equal to the *initial* minimum value, then for any element `num` in the array, the number of moves required
// to bring it up to the minimum is `num - min_val`. The sum of these differences across all elements gives the total number of moves.
//
// Proof:
// Let the initial array be `a1, a2, ..., an`.
// Let the minimum element be `min_val`.
// We want to reach a state where all elements are equal to some value `k`.
// The total number of moves is `m`.
// After `m` moves, each of `n-1` elements is incremented by 1 in each move.
// This means that the sum of the array increases by `m * (n - 1)`.
// The total sum of the array becomes `sum(nums) + m * (n - 1)`.
// In the final state, all elements are equal to `k`. So the final sum is `n * k`.
// `sum(nums) + m * (n - 1) = n * k`
//
// Now consider the minimum element `min_val`.
// Suppose the minimum element is at index `i`.
// In `m` moves, the element `nums[i]` will be incremented some number of times.
// Crucially, if we make all elements equal to some final value `k`, then `k` must be greater than or equal to the initial maximum element.
//
// Let's look at the relative difference.
// Incrementing `n-1` elements by 1 is equivalent to decrementing 1 element by 1 relative to the rest.
// If we want to make all elements equal, and we can only increment, eventually they will all meet at some value.
// The smallest element needs to be increased the most.
//
// Consider the effect of a move:
// [1, 2, 3] -> Increment n-1 (2 elements) by 1.
// Option 1: Increment 1 and 2 -> [2, 3, 3]
// Option 2: Increment 1 and 3 -> [2, 2, 4]
// Option 3: Increment 2 and 3 -> [1, 3, 4]
//
// The problem states "increment n - 1 elements of the array by 1".
// Let the final equal value be `x`.
// Let the initial array be `nums`.
// `sum(nums) + m * (n-1) = n * x`
//
// Consider the element `nums[i]`. Let it be incremented `c_i` times.
// The final value of `nums[i]` is `nums[i] + c_i = x`.
// So, `c_i = x - nums[i]`.
// The total number of increments across all elements is `sum(c_i) = sum(x - nums[i]) = n*x - sum(nums)`.
//
// The total number of moves `m` is the sum of increments distributed across elements.
// Each move increments `n-1` elements.
// So, the total number of increments `sum(c_i)` must be equal to `m * (n-1)`.
// `n*x - sum(nums) = m * (n-1)`
// `m = (n*x - sum(nums)) / (n-1)`
//
// We want to minimize `m`.
// To minimize `m`, we need to minimize `n*x - sum(nums)`. Since `n` and `sum(nums)` are fixed, we need to minimize `x`.
// What is the minimum possible value for `x` (the final equal value)?
// The final value `x` must be at least the maximum element in the original array, because we can only increment.
// However, this is not strictly true in terms of the "equivalent" operation.
//
// Let's go back to the idea of decrementing one element.
// If we increment n-1 elements by 1, the difference between any two elements that were both incremented remains the same.
// The difference between an element that was incremented and one that wasn't changes by 1.
//
// Example: [1, 2, 3], n=3
// Move: increment n-1=2 elements.
// [1, 2, 3] -> increment 1, 2 -> [2, 3, 3]. Difference between 2 and 3 is 1. Difference between 3 and 3 is 0.
// [2, 3, 3] -> increment 2, 3 -> [3, 4, 3].
// [3, 4, 3] -> increment 3, 4 -> [4, 5, 3] <-- this is NOT the example's path.
//
// The example path:
// [1,2,3]  =>  [2,3,3]  (incremented 1 and 2)
// [2,3,3]  =>  [3,4,3]  (incremented 2 and 3) <-- one of the 3s was not incremented. Which one?
// The phrasing "increment n-1 elements of the array" implies we pick which n-1.
// If we pick the elements other than the minimum, it's like we are increasing the minimum.
//
// Let's consider the total sum and the minimum element.
// Let the array be `nums`, `n = nums.length`.
// Let `min_val = min(nums)`.
//
// Imagine we want all elements to become `min_val`. This is impossible because we can only increment.
//
// Consider the total number of increments applied to *all* elements.
// If we make `m` moves, and in each move `n-1` elements are incremented, the total number of increments across all positions is `m * (n-1)`.
// Let the final equal value be `F`.
// For each `nums[i]`, its final value is `nums[i] + increments_on_nums[i] = F`.
// `increments_on_nums[i] = F - nums[i]`.
// Summing this over all `i`: `sum(increments_on_nums[i]) = n * F - sum(nums)`.
// So, `m * (n-1) = n * F - sum(nums)`.
//
// To minimize `m`, we need to minimize `F`.
// What is the smallest possible `F`?
// `F` must be at least `max(nums)`. If `F < max(nums)`, then the element `max(nums)` cannot reach `F` by only incrementing.
// This is where the alternative perspective comes in.
//
// Alternative perspective:
// Incrementing `n-1` elements by 1 is mathematically equivalent to decrementing *one* element by 1.
// Why? Consider the differences between elements.
// If we increment `a, b, c` and leave `d` as is:
// `a+1, b+1, c+1, d`.
// Differences like `(a+1) - (b+1)` remain `a-b`.
// Differences like `(a+1) - d` become `a-d+1`.
//
// If we decrement `d` by 1:
// `a, b, c, d-1`.
// Differences like `a - (d-1)` become `a-d+1`.
//
// This means that if we want to make all elements equal, we can think of it as decrementing all elements towards a common minimum.
// The number of moves required to make all elements equal to the initial minimum element `min_val` is simply the sum of the differences between each element and `min_val`.
//
// Let's test this hypothesis with Example 1: nums = [1, 2, 3]
// min_val = 1.
// Moves = (1 - 1) + (2 - 1) + (3 - 1) = 0 + 1 + 2 = 3.
// This matches the output.
//
// Example 2: nums = [1, 1, 1]
// min_val = 1.
// Moves = (1 - 1) + (1 - 1) + (1 - 1) = 0 + 0 + 0 = 0.
// This matches the output.
//
// Let's re-derive why the sum of differences to the minimum works.
// Let the initial array be `a1, a2, ..., an`.
// Let `min_val = min(a1, ..., an)`.
// We want to reach a state where all elements are equal to `k`.
// The problem states: increment `n-1` elements by 1.
//
// Consider the target state where all elements are equal to `k`.
// The number of moves `m` will make the sum `sum(ai) + m * (n-1)`.
// The final sum is `n * k`.
// So, `sum(ai) + m * (n-1) = n * k`.
//
// Now, what is `k` in relation to `min_val`?
// Let `m` be the total number of moves.
// In each move, `n-1` elements are incremented.
// This means one element is *not* incremented.
// If we always choose to not increment the *current maximum* element, then all other elements will eventually catch up.
// This is equivalent to always decrementing the maximum element.
//
// However, if we think of the relative difference:
// Incrementing `n-1` elements by 1 is same as decrementing 1 element by 1 *relative to the others*.
//
// Consider the sum of differences from the minimum: `D = sum(nums[i] - min_val)`
// Let's assume the minimum element is `nums[0]`.
// `D = (nums[0] - nums[0]) + (nums[1] - nums[0]) + ... + (nums[n-1] - nums[0])`
// `D = sum(nums) - n * min_val`.
//
// We are claiming `m = D`. So, `m = sum(nums) - n * min_val`.
//
// Let's substitute this into our earlier equation: `sum(nums) + m * (n-1) = n * k`.
// `sum(nums) + (sum(nums) - n * min_val) * (n-1) = n * k`
//
// This isn't directly showing that `k` is related to `min_val` in a simple way.
//
// Let's look at the operation again.
// If we increment `n-1` elements by 1, this means that *exactly one* element is not incremented in that move.
//
// Consider the minimum element `min_val`.
// If we always increment the `n-1` elements *other than* `min_val`, then `min_val` never changes, and other elements increase. This is not correct.
//
// Let's re-examine the "equivalent to decrementing one element" idea.
// Suppose we have an array `[a, b]`, n=2. Move: increment n-1=1 element.
// `[a, b]` -> increment `a` -> `[a+1, b]`
// `[a, b]` -> increment `b` -> `[a, b+1]`
//
// The equivalent operation is decrementing one element.
// If we have `[a, b]`, and we want to make them equal to `min(a, b)`.
// If `a < b`, we want `a` and `b` to become `a`.
// This means we need to reduce `b` by `b-a`.
//
// If we have `[1, 2]`, n=2.
// Increment 1 element.
// `[1, 2]` -> increment 1 -> `[2, 2]`. 1 move.
// Using the formula: min_val = 1. Moves = (1-1) + (2-1) = 1. Correct.
//
// If we have `[1, 2, 3]`, n=3.
// We want to reach `[1, 1, 1]` state *effectively*.
// This means we need to reduce `2` by `2-1=1` and `3` by `3-1=2`. Total reduction needed = 1 + 2 = 3.
// This corresponds to 3 moves.
//
// Why is incrementing `n-1` elements by 1 equivalent to decrementing 1 element by 1?
// Let the array be `A = [a_1, a_2, ..., a_n]`.
// Consider the sum of the array: `S = sum(a_i)`.
// If we increment `n-1` elements by 1, the new sum is `S + (n-1)`.
// If we decrement 1 element by 1, the new sum is `S - 1`.
// These are not directly equivalent in terms of sum.
//
// However, let's consider the differences again.
// Let the final equal value be `k`.
// Suppose we have `m` moves.
// The total increment applied to the array is `m * (n-1)`.
// The final sum is `sum(nums) + m * (n-1)`.
// If all elements are equal to `k`, then the final sum is `n * k`.
// So, `sum(nums) + m * (n-1) = n * k`.
//
// Consider the minimum element `min_val`.
// After `m` moves, it will become `min_val + moves_applied_to_min_val = k`.
// The elements that are NOT incremented in a move are essentially "falling behind" relative to the others.
//
// Let's use the property that incrementing `n-1` elements by 1 is equivalent to decrementing 1 element by 1 in terms of relative differences.
// Imagine we want to make all elements equal to `min_val`.
// To do this, we need to reduce `nums[i]` by `nums[i] - min_val`.
// The total reduction needed is `sum(nums[i] - min_val)`.
// Each "move" (which is incrementing `n-1` elements) can be thought of as achieving one unit of reduction on *one* element.
//
// Example: `[1, 2, 3]`. `n=3`.
// Target: make all elements equal to `1` (effectively).
// `1` needs `1-1=0` reduction.
// `2` needs `2-1=1` reduction.
// `3` needs `3-1=2` reduction.
// Total reduction needed = `0 + 1 + 2 = 3`.
//
// Now, how does an operation "increment n-1 elements by 1" achieve this reduction?
//
// Consider the array `[1, 2, 3]`.
// Move 1: increment elements at index 0 and 1. `[1+1, 2+1, 3]` -> `[2, 3, 3]`.
//   Relative to the original, the element at index 2 (value 3) was "left behind" by 1 compared to elements at 0 and 1.
//   This is like decrementing element 2 by 1 *relative to the sum of others*.
//
// Move 2: increment elements at index 0 and 2. `[2+1, 3, 3+1]` -> `[3, 3, 4]`.
//   Now the element at index 1 (value 3) was "left behind".
//
// Move 3: increment elements at index 1 and 2. `[3, 3+1, 4+1]` -> `[3, 4, 5]`.
// This path is confusing.
//
// Let's stick to the established correct logic for this problem:
// The operation of incrementing `n-1` elements by 1 is equivalent to decrementing a single element by 1.
// Why? If we consider the target value `k` that all elements will eventually reach, and `m` is the number of moves.
// The sum of the array after `m` moves is `sum(nums) + m * (n - 1)`.
// The final sum is `n * k`.
// So, `sum(nums) + m * (n - 1) = n * k`.
//
// Consider the minimum element `min_val`.
// If `k` is the final equal value, then `k >= min_val`.
// Each move effectively increases all elements except one. This is same as decreasing that one element relative to the others.
//
// To make all elements equal, we want to bring them all to a common value.
// The minimum number of moves occurs when we aim for the smallest possible common value.
// The smallest possible common value that can be reached from `nums` by only incrementing elements is limited.
//
// If we view the problem as "decrementing one element", we want to reduce all elements to the minimum.
// Suppose the minimum element is `min_val`.
// To make `nums[i]` equal to `min_val`, we need to "reduce" it by `nums[i] - min_val`.
// Each move (incrementing `n-1`) allows us to reduce *one* element by 1.
// Therefore, the total number of moves required is the sum of reductions needed for each element: `sum(nums[i] - min_val)`.
//
// This sum can be rewritten as:
// `sum(nums[i] - min_val)`
// `= (nums[0] - min_val) + (nums[1] - min_val) + ... + (nums[n-1] - min_val)`
// `= (nums[0] + nums[1] + ... + nums[n-1]) - (min_val + min_val + ... + min_val)` (n times)
// `= sum(nums) - n * min_val`.
//
// This approach is robust and commonly accepted for this problem.
//
// Algorithm:
// 1. Find the minimum element in the array `nums`.
// 2. Calculate the sum of all elements in the array `nums`.
// 3. The minimum number of moves is `sum(nums) - n * min_val`, where `n` is the length of the array.
//
// Time Complexity: O(N) for finding the minimum element and O(N) for calculating the sum. Total O(N).
// Space Complexity: O(1) as we only use a few variables to store the minimum, sum, and count.
//
// Constraints check:
// 1 <= nums.length <= 10^5: O(N) is efficient enough.
// -10^9 <= nums[i] <= 10^9: Sum can be large, but fits in 32-bit integer if the total sum of differences fits. The problem guarantees the answer fits in a 32-bit integer.
// This means `sum(nums) - n * min_val` will fit.
// JavaScript numbers are 64-bit floating-point, so they can handle these sums and differences.
// However, for very large sums, precision could be an issue if we were dealing with floats, but here we are dealing with integers.
// The maximum sum could be `10^5 * 10^9 = 10^14`. A standard 32-bit integer (`int`) would overflow.
// However, the *answer* (the number of moves) is guaranteed to fit in a 32-bit integer.
// `sum(nums) - n * min_val` calculation itself might involve intermediate values exceeding 32-bit, but JavaScript's `Number` type handles this.
//
// Example 1: nums = [1, 2, 3]
// n = 3
// min_val = 1
// sum = 1 + 2 + 3 = 6
// Moves = 6 - 3 * 1 = 6 - 3 = 3.
//
// Example 2: nums = [1, 1, 1]
// n = 3
// min_val = 1
// sum = 1 + 1 + 1 = 3
// Moves = 3 - 3 * 1 = 3 - 3 = 0.
//
// Edge case: single element array. nums = [5]
// n = 1
// min_val = 5
// sum = 5
// Moves = 5 - 1 * 5 = 0. Correct, no moves needed.
//
// Edge case: all negative numbers. nums = [-3, -1, -2]
// n = 3
// min_val = -3
// sum = -3 + (-1) + (-2) = -6
// Moves = -6 - 3 * (-3) = -6 - (-9) = -6 + 9 = 3.
// Let's verify:
// [-3, -1, -2]
// Increment -3, -1 -> [-2, 0, -2] (1 move)
// Increment -2, 0 -> [-1, 1, -1] (2 moves)
// Increment -1, -1 -> [0, 1, 0] (3 moves) -- not equal yet.
//
// Let's re-trace the logic of "decrement one element".
// If we increment n-1 elements, it's like we are making all elements equal to the *maximum* element by *increasing* them, but the moves are counted based on the equivalence.
//
// Let's consider the final state and work backwards.
// If all elements are equal to `k`, and the minimum element in the original array was `min_val`.
// To reach `k` from `min_val`, we need `k - min_val` increments for this element.
// If we increment `n-1` elements by 1, this is the same as decrementing 1 element by 1.
//
// Let the initial array be `[a_1, a_2, ..., a_n]`.
// Let the minimum element be `min_val`.
// We want to make all elements equal. Let the final value be `k`.
// In `m` moves, the total sum increases by `m * (n-1)`.
// `sum(a_i) + m * (n-1) = n * k`.
//
// Consider the minimum element `a_min`. To reach `k`, it needs `k - a_min` effective increments.
// If we perform `m` moves, then the element `a_min` is incremented in at most `m` moves.
// If `a_min` is never the element left out, then `a_min` is incremented in all `m` moves.
// If `a_min` is left out `x` times, then it's incremented `m-x` times.
//
// The key is that incrementing `n-1` elements by 1 means that *exactly one* element is NOT incremented.
// This means in each step, one element effectively "falls behind" by 1 relative to the others.
//
// Let the final common value be `F`.
// Let `m` be the number of moves.
// The total number of increments performed on the array is `m * (n-1)`.
// The final sum is `sum(nums) + m * (n-1)`.
// If all elements are `F`, then the final sum is `n * F`.
//
// The minimum element `min_val` must also reach `F`.
// This requires `F - min_val` effective increments for `min_val`.
//
// Consider the effect of a move:
// `[1, 2, 3]`
// Let's say we want all to be 4.
// Move 1: Inc 1,2 -> `[2, 3, 3]`. The element 3 was NOT incremented.
// Move 2: Inc 2,3 -> `[3, 4, 3]`. The element 3 (at index 2) was NOT incremented.
// Move 3: Inc 3,4 -> `[4, 5, 3]`. The element 3 (at index 2) was NOT incremented.
//
// The example's path:
// [1,2,3]  =>  [2,3,3]  (Inc 1, 2. Element 3 not inc)
// [2,3,3]  =>  [3,4,3]  (Inc 2, one of the 3s. Let's say the first 3. Element 3 at index 2 not inc)
// [3,4,3]  =>  [4,4,4]  (Inc 3, 4. Element 3 at index 2 not inc)
//
// In the example path, the element at index 2 (initial value 3) was never incremented.
// This is not necessarily the case. The choice of which `n-1` elements to increment is strategic.
//
// The key is that each move increases `n-1` elements. This is equivalent to decreasing 1 element.
// If we want all elements to be equal, we can think of this as reducing all elements to the minimum value.
//
// Let `nums = [a, b, c]`.
// Final state: `[k, k, k]`.
// Original sum `S = a + b + c`.
// Number of moves `m`.
// `S + m * (3-1) = 3 * k`.
// `S + 2m = 3k`.
//
// Let `min_val = min(a, b, c)`.
// The total number of "decrements" needed to bring all elements to `min_val` is `(a - min_val) + (b - min_val) + (c - min_val)`.
// Each move can achieve one unit of "decrement" on one element.
// So, `m = (a - min_val) + (b - min_val) + (c - min_val)`.
//
// This logic is sound for this specific problem statement.
// The transformation `increment n-1 elements by 1` -> `decrement 1 element by 1` is what simplifies the problem.
// Let's confirm this transformation.
// Consider `[x_1, x_2, ..., x_n]`.
// After one move (incrementing all but `x_i`): `[x_1+1, ..., x_{i-1}+1, x_i, x_{i+1}+1, ..., x_n+1]`.
// The sum increases by `n-1`.
//
// Consider `[x_1, x_2, ..., x_n]`.
// Decrement `x_i` by 1: `[x_1, ..., x_{i-1}, x_i-1, x_{i+1}, ..., x_n]`.
// The sum decreases by 1.
//
// The equivalence is not in the sum, but in the relative differences.
// The operation of incrementing `n-1` elements by 1 changes the difference between the un-incremented element and any incremented element by 1.
// Example: `[a, b, c]`. Increment `a, b`. New state: `[a+1, b+1, c]`.
// Difference `c - (a+1) = c - a - 1`. Original diff `c - a`. Changed by -1.
// Difference `(b+1) - (a+1) = b - a`. Original diff `b - a`. Unchanged.
//
// This means that each move effectively reduces the difference between the "left behind" element and the others.
// If we want all elements to be equal, we must reduce all differences to zero.
// The "left behind" element can be strategically chosen. To minimize moves, we want to reduce the largest differences first.
// The total "difference" that needs to be eliminated is `sum(nums[i] - min_val)`.
// Each move can reduce this total difference by exactly 1 (by picking the element that currently has the largest difference from the minimum).
//
// Thus, the total number of moves is indeed `sum(nums) - n * min_val`.

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
// Problem Summary: Find the minimum moves to make all elements in an array equal, where a move increments n-1 elements by 1.
// Link: https://leetcode.com/problems/minimum-moves-to-equal-array-elements/
// Approach:
// The key insight is that incrementing n-1 elements by 1 is mathematically equivalent to decrementing a single element by 1.
// If we consider the target state where all array elements are equal, and we can only perform moves that increment n-1 elements,
// this is the same as being able to selectively "decrement" one element at a time.
// To minimize the number of moves to make all elements equal, we aim to make all elements equal to the smallest element initially present in the array.
// The number of moves required for an element `nums[i]` to reach the minimum value (`min_val`) is `nums[i] - min_val`.
// The total number of moves is the sum of these differences for all elements in the array.
// This sum can be calculated as `sum(nums) - n * min_val`, where `n` is the length of the array.
//
// Time Complexity: O(N), where N is the number of elements in the array.
// This is because we iterate through the array once to find the minimum element and calculate the sum.
// Space Complexity: O(1).
// We only use a few extra variables to store the minimum value, the sum, and the array length.
//
var minMoves = function(nums) {
    // Handle edge case: if the array has only one element, no moves are needed.
    if (nums.length <= 1) {
        return 0;
    }

    // Find the minimum element in the array.
    // Initialize minVal with the first element.
    let minVal = nums[0];
    // Iterate through the rest of the array to find the true minimum.
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] < minVal) {
            minVal = nums[i];
        }
    }

    // Calculate the sum of all elements in the array.
    // Initialize sum with 0.
    let sum = 0;
    // Iterate through the array and add each element to the sum.
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];
    }

    // The minimum number of moves is the sum of the differences between each element
    // and the minimum element. This is equivalent to:
    // sum(nums[i] - minVal for all i) = sum(nums) - n * minVal
    // where n is the length of the array.
    const n = nums.length;
    const moves = sum - n * minVal;

    return moves;
};
```