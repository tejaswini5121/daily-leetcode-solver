// Summary: Find the minimum absolute difference between an index of a target element and a given start index.
// Link: https://leetcode.com/problems/minimum-distance-to-the-target-element/
// Approach:
// The problem guarantees that the target element exists in the array.
// We need to find an index `i` where `nums[i]` equals `target` and `abs(i - start)` is minimized.
// The most straightforward approach is to iterate through the entire array.
// For each element, if it matches the `target`, we calculate the absolute difference between its index `i` and the `start` index.
// We keep track of the minimum difference found so far.
// Initialize `minDist` to a very large number (or the maximum possible difference, which is `nums.length`).
// Iterate from `i = 0` to `nums.length - 1`.
// If `nums[i] === target`, update `minDist = Math.min(minDist, Math.abs(i - start))`.
// After checking all elements, `minDist` will hold the minimum distance.
//
// Time Complexity: O(n), where n is the length of the `nums` array.
// We iterate through the array once.
//
// Space Complexity: O(1), as we only use a few extra variables to store the minimum distance and loop index.
/**
 * @param {number[]} nums
 * @param {number} target
 * @param {number} start
 * @return {number}
 */
var getMinDistance = function(nums, target, start) {
    // Initialize the minimum distance to a very large value.
    // The maximum possible distance is nums.length - 1, so nums.length is a safe upper bound.
    let minDist = nums.length;

    // Iterate through the array to find occurrences of the target element.
    for (let i = 0; i < nums.length; i++) {
        // Check if the current element is equal to the target.
        if (nums[i] === target) {
            // Calculate the absolute difference between the current index and the start index.
            const currentDist = Math.abs(i - start);
            // Update the minimum distance if the current distance is smaller.
            minDist = Math.min(minDist, currentDist);
        }
    }

    // Return the minimum distance found.
    return minDist;
};
```