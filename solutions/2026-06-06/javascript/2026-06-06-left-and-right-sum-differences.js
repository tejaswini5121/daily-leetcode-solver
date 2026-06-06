/**
 * @fileoverview LeetCode Problem: Left and Right Sum Differences
 * @description Calculates the absolute difference between the sum of elements to the left and right of each element in an array.
 * @link https://leetcode.com/problems/left-and-right-sum-differences/
 *
 * @approach
 * The problem requires calculating the sum of elements to the left and right of each index.
 * A straightforward approach is to use prefix sums.
 * We can calculate the total sum of the array first.
 * Then, iterate through the array:
 * - For each element at index `i`, the `leftSum[i]` is the sum of elements from index 0 to `i-1`.
 * - The `rightSum[i]` is the total sum minus the `leftSum[i]` and the current element `nums[i]`.
 * - The `answer[i]` is the absolute difference between `leftSum[i]` and `rightSum[i]`.
 *
 * An alternative and more efficient single-pass approach:
 * 1. Calculate the total sum of the array.
 * 2. Initialize `leftSum` to 0.
 * 3. Iterate through the array from left to right. For each element `nums[i]`:
 *    - `rightSum` for the current index `i` can be calculated as `totalSum - leftSum - nums[i]`.
 *    - The answer for the current index is `Math.abs(leftSum - rightSum)`.
 *    - Update `leftSum` by adding `nums[i]` to it for the next iteration.
 *
 * @time_complexity O(n) - We iterate through the array twice (once for total sum, once for calculating differences).
 * @space_complexity O(1) - We use a few variables to store sums and the result array, which is O(n) for the output but O(1) auxiliary space.
 */

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var leftRigthDifference = function(nums) {
    // Calculate the total sum of the array.
    let totalSum = 0;
    for (let i = 0; i < nums.length; i++) {
        totalSum += nums[i];
    }

    // Initialize the sum of elements to the left of the current index.
    let leftSum = 0;
    // Initialize the result array.
    const answer = new Array(nums.length);

    // Iterate through the array to calculate leftSum, rightSum, and the difference.
    for (let i = 0; i < nums.length; i++) {
        // The sum of elements to the right of the current index.
        // It's the total sum minus the sum of elements to the left and the current element itself.
        const rightSum = totalSum - leftSum - nums[i];

        // Calculate the absolute difference between leftSum and rightSum.
        answer[i] = Math.abs(leftSum - rightSum);

        // Update leftSum for the next iteration by adding the current element.
        leftSum += nums[i];
    }

    // Return the array containing the left and right sum differences.
    return answer;
};
```