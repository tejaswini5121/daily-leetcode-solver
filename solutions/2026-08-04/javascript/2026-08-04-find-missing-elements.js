/*
Problem Summary:
This problem requires finding all missing integers within a continuous range, given an array `nums` where the smallest and largest integers of that original range are guaranteed to be present. The output should be a sorted list of these missing integers.

Link:
https://leetcode.com/problems/find-missing-elements/

Approach Explanation:
1.  **Determine the Range**: First, identify the minimum and maximum values present in the input array `nums`. These values define the complete range of integers that should have been in the original set.
2.  **Efficient Lookup**: To quickly check for the presence of numbers, convert the input array `nums` into a `Set`. This allows for average O(1) time complexity for checking if a number exists.
3.  **Iterate and Collect**: Iterate through every integer from the determined minimum value up to the maximum value (inclusive). For each integer in this sequence, check if it is present in the `Set`. If an integer is not found in the `Set`, it means it is a missing element, so add it to a result list.
4.  **Return Sorted List**: Since the iteration happens in ascending order from minimum to maximum, the collected missing elements will naturally be in sorted order. Return this list.

Time Complexity:
-   Finding min and max values: O(N), where N is the length of `nums`.
-   Creating the `Set` from `nums`: O(N), as each insertion into a Set takes average O(1) time.
-   Iterating from `minVal` to `maxVal` and checking the Set: O(M), where M is the size of the range (`maxVal - minVal + 1`). Each Set lookup takes average O(1) time.
-   Overall Time Complexity: O(N + M). Given the constraints (N <= 100, `nums[i]` <= 100, so M <= 100), this is very efficient.

Space Complexity:
-   `numSet`: O(N) space to store all unique elements from `nums`.
-   `missingNumbers`: O(M) space in the worst case, where M is the range size (e.g., if `nums = [1, 100]`, almost all numbers are missing).
-   Overall Space Complexity: O(N + M).
*/
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findMissingElements = function(nums) {
    // Determine the minimum and maximum values in the nums array.
    // These define the bounds of the original integer range.
    let minVal = Infinity;
    let maxVal = -Infinity;
    for (const num of nums) {
        if (num < minVal) {
            minVal = num;
        }
        if (num > maxVal) {
            maxVal = num;
        }
    }

    // Create a Set from the input array for efficient O(1) average time lookups.
    const numSet = new Set(nums);

    // Initialize an array to store the missing numbers.
    const missingNumbers = [];

    // Iterate through the entire range from minVal to maxVal (inclusive).
    for (let i = minVal; i <= maxVal; i++) {
        // If the current number 'i' is not found in our Set, it means it's missing.
        if (!numSet.has(i)) {
            // Add the missing number to our result list.
            // Since we iterate in ascending order, this list will naturally be sorted.
            missingNumbers.push(i);
        }
    }

    // Return the list of all missing numbers.
    return missingNumbers;
};