// Problem: Minimum Moves to Equal Array Elements
// Link: https://leetcode.com/problems/minimum-moves-to-equal-array-elements/
// Approach:
// The core idea is to realize that incrementing n-1 elements by 1 is equivalent to decrementing 1 element by 1 relative to the rest.
// If we want all elements to be equal to some target value 'T', and we perform 'm' moves,
// the sum of the array after 'm' moves will be sum(nums) + m * (n-1).
// If all elements become equal to 'T', then the final sum will be n * T.
// So, sum(nums) + m * (n-1) = n * T.
// Also, if we consider the minimum element 'min_val' in the original array, and we want all elements to reach some value 'T',
// then 'T' must be at least 'min_val'.
//
// Let's consider the total sum of the array. Each move increases the sum of the array by (n-1).
// If all elements are to become equal to a final value 'F', and we make 'm' moves,
// the sum of the array will be initial_sum + m * (n-1).
// The final sum will also be n * F.
// So, initial_sum + m * (n-1) = n * F.
//
// An alternative perspective:
// Consider the minimum element `min_val` in the array.
// When we increment `n-1` elements, we are effectively increasing the "gap" between the un-incremented element and the others.
// To make all elements equal, we are essentially trying to bring all elements up to the level of the largest element, or a value greater than it.
//
// Let the final equal value be `x`.
// Let `m` be the number of moves.
// In each move, we increment `n-1` elements by 1.
// If we increment `n-1` elements, it's like decrementing one element by 1 if we only care about the relative differences.
// So, effectively, to make all elements equal, we are reducing all elements to the minimum element's value, if we think of moves as decrements.
// The total number of decrements needed for an element `num` to reach the minimum `min_val` is `num - min_val`.
// The sum of these differences for all elements will be the total number of moves.
// Total moves = sum(nums[i] - min_val) for all i.
// This can be rewritten as:
// Total moves = sum(nums[i]) - n * min_val.
//
// Example: [1, 2, 3], n=3
// min_val = 1
// Moves = (1-1) + (2-1) + (3-1) = 0 + 1 + 2 = 3.
//
// Example: [1, 1, 1], n=3
// min_val = 1
// Moves = (1-1) + (1-1) + (1-1) = 0.
//
// This approach is correct because each move increments `n-1` elements. This means that if we make `m` moves, the total increment across all elements is `m * (n-1)`. If all elements become equal to some value `K`, then the final sum is `n * K`.
// So, `initial_sum + m * (n-1) = n * K`.
//
// Consider the minimum element `min_val`. After `m` moves, the minimum element will also be incremented. Let's say it's incremented `k` times. The final value of this element will be `min_val + k`.
//
// However, the key insight is that incrementing `n-1` elements by 1 is equivalent to decrementing one element by 1 if we only care about the relative differences to reach equality.
// If we want all elements to be equal to some target value, say `T`.
// Let the original array be `nums`. Let the minimum element be `min_val`.
// Each move increments `n-1` elements. This means that the difference between any two elements that are NOT the ones decremented by 1 (in the equivalent decrement perspective) increases by 1.
// The goal is to make all elements equal. This means we want to reduce all differences to zero.
// If we consider the minimum element, and we increment all other `n-1` elements, we are effectively bringing them closer to each other.
//
// Let's analyze the total sum and the minimum.
// If we make `m` moves, and the final equal value is `F`.
// The sum of the array after `m` moves is `initial_sum + m * (n-1)`.
// The final sum is `n * F`.
// `initial_sum + m * (n-1) = n * F`.
//
// Now consider the minimum element. In `m` moves, the minimum element must have been incremented at least once if it's not the target value.
// If we consider the effect on the minimum element: if it's not chosen to be the one NOT incremented in a move, it increases.
// The simplest way to reach equality is to bring all elements up to a common value.
// The most efficient way to achieve this is to bring them all up to a value that is achievable with the minimum number of increments.
//
// Let `min_val` be the minimum element.
// Let `m` be the number of moves.
// After `m` moves, all elements will be equal to some value `x`.
// The sum of the array increases by `m * (n-1)` in total.
// `sum(nums) + m * (n-1) = n * x`.
//
// What is `x`?
// Consider the perspective that incrementing `n-1` elements by 1 is equivalent to decrementing 1 element by 1 (relative to the sum).
// If we want to make all elements equal, we need to reduce each element `nums[i]` to be equal to the minimum element `min_val`.
// The number of "decrements" needed for `nums[i]` is `nums[i] - min_val`.
// The total number of "decrements" (which corresponds to total moves in the original problem) is the sum of these differences.
// Total moves = `sum(nums[i] - min_val)` for all `i`.
// Total moves = `sum(nums[i]) - n * min_val`.
//
// This is the most straightforward and correct derivation.
// Time Complexity: O(N) where N is the number of elements in the array. This is because we iterate through the array once to find the minimum element and then once again to sum up the differences (or sum the elements).
// Space Complexity: O(1) because we only use a few variables to store the minimum element and the sum.

class Solution {
    public int minMoves(int[] nums) {
        // Handle edge case: if the array is empty or has only one element, no moves are needed.
        if (nums == null || nums.length <= 1) {
            return 0;
        }

        // Find the minimum element in the array.
        // This is crucial because each move effectively increases all elements except one.
        // To make all elements equal, we aim to bring all elements up to a common value,
        // and the minimum element is the bottleneck.
        int minVal = nums[0];
        for (int num : nums) {
            if (num < minVal) {
                minVal = num;
            }
        }

        // Calculate the total number of moves.
        // The key insight is that incrementing n-1 elements by 1 is equivalent to decrementing 1 element by 1 relative to the others.
        // To make all elements equal, we essentially want to reduce each element to the minimum element's value.
        // The number of moves required for an element `num` to become equal to `minVal` (in this relative decrement sense) is `num - minVal`.
        // The sum of these differences for all elements gives the total number of moves.
        // Total moves = Sum(nums[i] - minVal) for all i.
        // This can be rewritten as: Total moves = Sum(nums[i]) - n * minVal.
        int totalMoves = 0;
        for (int num : nums) {
            totalMoves += (num - minVal);
        }

        return totalMoves;
    }
}
