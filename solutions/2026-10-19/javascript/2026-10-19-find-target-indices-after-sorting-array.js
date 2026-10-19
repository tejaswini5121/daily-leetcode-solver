// Problem Summary: Find all indices of a target value in an array after it's sorted.
// Link: https://leetcode.com/problems/find-target-indices-after-sorting-array/
// Approach:
// 1. Sort the input array `nums` in non-decreasing order.
// 2. Iterate through the sorted array.
// 3. If an element `nums[i]` equals the `target`, add its index `i` to a result list.
// 4. Return the result list, which will naturally be sorted due to the iteration order.
// Time Complexity: O(N log N) due to sorting the array. The subsequent linear scan is O(N).
// Space Complexity: O(N) in the worst case for the result list, or O(log N) or O(N) depending on the sorting algorithm's space complexity if it's not in-place.
const findTargetIndices = (nums, target) => {
    // Sort the array in non-decreasing order.
    // The sort method in JavaScript uses Timsort for arrays of numbers, which has an average and worst-case time complexity of O(N log N).
    nums.sort((a, b) => a - b);

    // Initialize an empty array to store the target indices.
    const targetIndices = [];

    // Iterate through the sorted array.
    for (let i = 0; i < nums.length; i++) {
        // If the current element matches the target, add its index to the result list.
        if (nums[i] === target) {
            targetIndices.push(i);
        }
    }

    // Return the list of target indices. Since we iterated in increasing order, the list is already sorted.
    return targetIndices;
};
/*
// Example Usage (for testing purposes, not part of the final required output):
console.log(findTargetIndices([1, 2, 5, 2, 3], 2)); // Output: [1, 2]
console.log(findTargetIndices([1, 2, 5, 2, 3], 3)); // Output: [3]
console.log(findTargetIndices([1, 2, 5, 2, 3], 5)); // Output: [4]
console.log(findTargetIndices([1, 2, 5, 2, 3], 4)); // Output: []
console.log(findTargetIndices([1], 1)); // Output: [0]
console.log(findTargetIndices([100], 50)); // Output: []
*/