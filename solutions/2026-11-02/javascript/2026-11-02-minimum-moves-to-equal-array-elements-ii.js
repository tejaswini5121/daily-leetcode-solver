// Problem: Minimum Moves to Equal Array Elements II
// LeetCode Link: https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/
//
// Approach:
// The problem asks for the minimum number of moves to make all elements in an array equal.
// A move consists of incrementing or decrementing an element by 1.
// This is a classic problem where the optimal target value to make all elements equal to is the median of the array.
// The intuition is that the sum of absolute differences is minimized when the target is the median.
// If the array has an odd number of elements, the median is the middle element after sorting.
// If the array has an even number of elements, any value between the two middle elements (inclusive) will yield the minimum sum of absolute differences.
// For simplicity and consistency, we can pick either of the two middle elements as the median.
//
// Steps:
// 1. Sort the input array `nums`.
// 2. Find the median element. If `n` is the length of the array, the median index is `Math.floor(n / 2)`.
// 3. Initialize a variable `moves` to 0.
// 4. Iterate through the sorted array and for each element, calculate the absolute difference between it and the median. Add this difference to `moves`.
// 5. Return `moves`.
//
// Time Complexity:
// O(n log n) due to the sorting step. The iteration to calculate moves is O(n).
//
// Space Complexity:
// O(log n) or O(n) depending on the sorting algorithm used by the JavaScript engine.
// In-place sorting algorithms might use O(log n) for recursion stack, while others might use O(n) for auxiliary space.
// For standard JavaScript `sort()`, the space complexity can vary.

/**
 * @param {number[]} nums
 * @return {number}
 */
var minMoves2 = function(nums) {
    // Sort the array to easily find the median.
    // JavaScript's sort method sorts elements as strings by default,
    // so we need to provide a comparison function for numerical sorting.
    nums.sort((a, b) => a - b);

    // Get the length of the array.
    const n = nums.length;

    // Find the median element. For an array of length n, the median is at index floor(n/2).
    // This works for both odd and even length arrays.
    // If n is odd, it's the exact middle element.
    // If n is even, it's one of the two middle elements (which yields the same minimum moves).
    const median = nums[Math.floor(n / 2)];

    // Initialize a variable to store the total number of moves.
    let moves = 0;

    // Iterate through the sorted array.
    for (let i = 0; i < n; i++) {
        // For each element, calculate the absolute difference between it and the median.
        // This difference represents the number of moves needed for this specific element.
        moves += Math.abs(nums[i] - median);
    }

    // Return the total minimum moves required to make all elements equal to the median.
    return moves;
};
