// Checks if an array is a non-decreasingly sorted array that has been rotated.
// Problem Link: https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/
//
// Approach:
// A sorted and rotated array will have at most one "descent" or "break" in the non-decreasing order.
// A descent occurs when `nums[i] > nums[i+1]`.
// If the array is perfectly sorted (no rotation), there are zero descents.
// If the array is sorted and rotated, there will be exactly one descent.
// This descent happens at the point where the largest element is followed by the smallest element.
//
// We iterate through the array, comparing each element with the next one.
// We also need to compare the last element with the first element to account for the wrap-around rotation.
// We count the number of times `nums[i] > nums[(i+1) % n]`, where `n` is the length of the array.
// If this count is 0 or 1, the array is sorted and rotated. Otherwise, it is not.
//
// Time Complexity: O(n), where n is the length of the input array.
// We iterate through the array once.
//
// Space Complexity: O(1).
// We use a constant amount of extra space for the counter variable.
//
// @param {number[]} nums
// @return {boolean}
var check = function(nums) {
    // Get the length of the array
    const n = nums.length;
    // Initialize a counter for the number of descents
    let descents = 0;

    // Iterate through the array to find descents
    for (let i = 0; i < n; i++) {
        // Compare the current element with the next element (handling wrap-around)
        // If nums[i] is greater than nums[(i+1) % n], it means there's a descent
        if (nums[i] > nums[(i + 1) % n]) {
            // Increment the descent counter
            descents++;
        }
    }

    // If the number of descents is 0 or 1, the array is sorted and rotated.
    // 0 descents means the array is already sorted.
    // 1 descent means the array is sorted and rotated.
    return descents <= 1;
};
```