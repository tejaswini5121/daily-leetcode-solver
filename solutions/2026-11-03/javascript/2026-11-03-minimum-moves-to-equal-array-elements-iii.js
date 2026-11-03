// Problem: Minimum Moves to Equal Array Elements III
// Find the minimum number of moves to make all array elements equal by incrementing any element by 1.
// Link: https://leetcode.com/problems/minimum-moves-to-equal-array-elements-iii/
//
// Approach:
// The problem asks for the minimum number of moves to make all elements equal. Each move consists of incrementing one element by 1.
// If we want to make all elements equal to some target value `T`, and all original elements `nums[i]` are less than or equal to `T`,
// then the total moves would be the sum of `(T - nums[i])` for all `i`.
//
// Consider the effect of a move. Incrementing any element by 1 is equivalent to decrementing all *other* elements by 1,
// if we fix the target value. For example, if we have [1, 2, 3] and want to make them all 3, we increment 1 by 2 and 2 by 1. Total 3 moves.
// This is equivalent to saying we want to make all elements equal to the largest element.
//
// Alternatively, consider the problem from the perspective of finding a "median" element.
// If we decide to make all elements equal to some value `X`, the total moves will be `sum(|nums[i] - X|)`.
// To minimize this sum of absolute differences, `X` should be the median of the array.
// However, the problem statement says we can ONLY increase elements.
//
// Let's re-read the problem carefully: "In one move, you may increase the value of any single element nums[i] by 1."
// This means the target value must be greater than or equal to the maximum element in the original array.
// If we choose a target value `T`, and `T` is greater than the maximum element in `nums`,
// the total moves will be `sum(T - nums[i])`.
// To minimize this sum, we need to minimize `T`. The smallest possible value for `T` is the maximum element in the original array.
//
// So, the strategy is to find the maximum element in the array and then sum up the differences between this maximum element
// and each element in the array.
//
// Example 1: nums = [2,1,3]
// Maximum element is 3.
// Moves = (3 - 2) + (3 - 1) + (3 - 3) = 1 + 2 + 0 = 3.
//
// Example 2: nums = [4,4,5]
// Maximum element is 5.
// Moves = (5 - 4) + (5 - 4) + (5 - 5) = 1 + 1 + 0 = 2.
//
// Time Complexity: O(n), where n is the length of the array. We iterate through the array once to find the maximum element
// and then iterate again to sum up the differences. This can be optimized to a single pass.
//
// Space Complexity: O(1), as we only use a few variables to store the maximum element and the sum of moves.

var minMoves2 = function(nums) {
    // Handle edge case: if the array is empty or has only one element, no moves are needed.
    if (!nums || nums.length <= 1) {
        return 0;
    }

    // Find the maximum element in the array.
    // Initialize maxElement with the first element of the array.
    let maxElement = nums[0];
    // Iterate through the array starting from the second element.
    for (let i = 1; i < nums.length; i++) {
        // If the current element is greater than the current maxElement, update maxElement.
        if (nums[i] > maxElement) {
            maxElement = nums[i];
        }
    }

    // Calculate the total number of moves required.
    // Initialize totalMoves to 0.
    let totalMoves = 0;
    // Iterate through each element in the array.
    for (let i = 0; i < nums.length; i++) {
        // For each element, the number of moves to make it equal to maxElement is (maxElement - nums[i]).
        // Add this difference to totalMoves.
        totalMoves += (maxElement - nums[i]);
    }

    // Return the total minimum moves.
    return totalMoves;
};
```