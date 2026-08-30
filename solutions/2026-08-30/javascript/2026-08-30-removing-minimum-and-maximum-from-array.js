// Problem: Removing Minimum and Maximum From Array
// Link: https://leetcode.com/problems/removing-minimum-and-maximum-from-array/
//
// Approach:
// The problem asks for the minimum number of deletions to remove both the minimum and maximum elements from an array.
// Deletions can only be performed from the front or the back of the array.
//
// The core idea is to find the indices of the minimum and maximum elements. Let these indices be `minIndex` and `maxIndex`.
// We need to consider three scenarios for removing both elements:
// 1. Remove both from the left: This involves deleting elements from the beginning up to and including the element furthest from the start (i.e., the one with the larger index). The number of deletions would be `max(minIndex, maxIndex) + 1`.
// 2. Remove both from the right: This involves deleting elements from the end up to and including the element furthest from the end (i.e., the one with the smaller index). The number of deletions would be `n - min(minIndex, maxIndex)`, where `n` is the length of the array.
// 3. Remove one from the left and one from the right: This means deleting elements from the left up to one of the elements, and from the right up to the other element.
//    - If `minIndex` is to the left of `maxIndex`:
//      - Remove `minIndex` from the left (cost: `minIndex + 1`) and `maxIndex` from the right (cost: `n - maxIndex`). Total cost: `(minIndex + 1) + (n - maxIndex)`.
//    - If `maxIndex` is to the left of `minIndex`:
//      - Remove `maxIndex` from the left (cost: `maxIndex + 1`) and `minIndex` from the right (cost: `n - minIndex`). Total cost: `(maxIndex + 1) + (n - minIndex)`.
//    The total cost for this scenario is `(min(minIndex, maxIndex) + 1) + (n - max(minIndex, maxIndex))`.
//
// We can simplify this by realizing that after finding `minIndex` and `maxIndex`, we can always sort them such that `minIndex <= maxIndex`.
// Let `leftmostIndex = min(minIndex, maxIndex)` and `rightmostIndex = max(minIndex, maxIndex)`.
// The three scenarios then become:
// 1. Remove both from the left: `rightmostIndex + 1` deletions.
// 2. Remove both from the right: `n - leftmostIndex` deletions.
// 3. Remove `leftmostIndex` from the left and `rightmostIndex` from the right: `(leftmostIndex + 1) + (n - rightmostIndex)` deletions.
//
// The minimum of these three values will be our answer.
//
// Edge case: If `nums.length` is 1, that single element is both min and max, so 1 deletion is needed.
//
// Time Complexity:
// - Finding the minimum and maximum values and their indices: O(n), where n is the length of the array.
// - Calculating the three possible deletion counts: O(1).
// - Finding the minimum of the three counts: O(1).
// Therefore, the overall time complexity is O(n).
//
// Space Complexity:
// - We only use a few variables to store indices and counts.
// Therefore, the space complexity is O(1).
//

/**
 * @param {number[]} nums
 * @return {number}
 */
var removeMinMax = function(nums) {
    // Handle the edge case where the array has only one element.
    // In this case, that element is both the minimum and maximum, requiring 1 deletion.
    if (nums.length === 1) {
        return 1;
    }

    // Find the minimum and maximum values in the array and their indices.
    let minVal = nums[0];
    let maxVal = nums[0];
    let minIndex = 0;
    let maxIndex = 0;

    // Iterate through the array starting from the second element.
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] < minVal) {
            minVal = nums[i];
            minIndex = i;
        }
        if (nums[i] > maxVal) {
            maxVal = nums[i];
            maxIndex = i;
        }
    }

    // Get the total number of elements in the array.
    const n = nums.length;

    // Ensure minIndex is the smaller index and maxIndex is the larger index for simpler calculation.
    // This is useful for calculating deletions from left and right.
    const leftmostIndex = Math.min(minIndex, maxIndex);
    const rightmostIndex = Math.max(minIndex, maxIndex);

    // Calculate the three possible scenarios for minimum deletions:

    // Scenario 1: Remove both from the left side.
    // This means deleting all elements from the start up to and including the element
    // that is furthest from the left end (which is the one at `rightmostIndex`).
    // The number of deletions is `rightmostIndex + 1` (since indices are 0-based).
    const deleteFromLeftOnly = rightmostIndex + 1;

    // Scenario 2: Remove both from the right side.
    // This means deleting all elements from the end up to and including the element
    // that is furthest from the right end (which is the one at `leftmostIndex`).
    // The number of deletions is `n - leftmostIndex`.
    const deleteFromRightOnly = n - leftmostIndex;

    // Scenario 3: Remove the leftmost element from the left and the rightmost element from the right.
    // - Deleting the element at `leftmostIndex` from the left requires `leftmostIndex + 1` deletions.
    // - Deleting the element at `rightmostIndex` from the right requires `n - rightmostIndex` deletions.
    // The total deletions for this scenario is the sum of these two.
    const deleteFromBothSides = (leftmostIndex + 1) + (n - rightmostIndex);

    // The minimum number of deletions is the minimum of these three scenarios.
    return Math.min(deleteFromLeftOnly, deleteFromRightOnly, deleteFromBothSides);
};
```