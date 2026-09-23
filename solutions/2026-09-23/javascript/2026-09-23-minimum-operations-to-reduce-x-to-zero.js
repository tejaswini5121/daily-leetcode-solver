/**
 * @summary Finds the minimum operations to reduce x to zero by removing elements from either end of the array.
 * @link https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/
 * @approach This problem can be rephrased as finding the longest subarray whose sum equals `total_sum - x`.
 *           If such a subarray exists, the minimum number of operations will be `n - length_of_longest_subarray`.
 *           We use a sliding window approach to find this longest subarray.
 *           First, calculate the total sum of the array. If `total_sum < x`, it's impossible to reach x.
 *           Then, we aim to find a subarray with sum `target = total_sum - x`.
 *           We use two pointers, `left` and `right`, to define the window.
 *           We expand the window by moving `right` and subtracting `nums[right]` from `current_sum`.
 *           If `current_sum` exceeds `target`, we shrink the window by moving `left` and adding `nums[left]` to `current_sum` until `current_sum` is less than or equal to `target`.
 *           If `current_sum` equals `target`, we update `max_len` with the current window size (`right - left + 1`).
 *           Finally, if `max_len` remains at its initial value (indicating no subarray with sum `target` was found), return -1. Otherwise, return `n - max_len`.
 * @timeComplexity O(n), where n is the length of nums. We iterate through the array with two pointers at most once.
 * @spaceComplexity O(1), as we only use a few extra variables.
 */

/**
 * @param {number[]} nums
 * @param {number} x
 * @return {number}
 */
var minOperations = function(nums, x) {
    // Calculate the total sum of the array.
    let totalSum = 0;
    for (const num of nums) {
        totalSum += num;
    }

    // If the total sum is less than x, it's impossible to reach x.
    if (totalSum < x) {
        return -1;
    }

    // The target sum for the subarray we are looking for.
    // This is because if we find a subarray whose sum is `totalSum - x`,
    // then removing the elements outside this subarray will result in a sum of x.
    const target = totalSum - x;

    // If the target is 0, it means x is equal to the total sum,
    // so we need to remove all elements.
    if (target === 0) {
        return nums.length;
    }

    // Initialize variables for the sliding window.
    let left = 0; // Left pointer of the window.
    let currentSum = 0; // Current sum of elements within the window.
    let maxLen = -1; // Maximum length of a subarray that sums to `target`. Initialize to -1 to indicate no such subarray found yet.

    // Iterate through the array using the right pointer.
    for (let right = 0; right < nums.length; right++) {
        // Add the current element to the window sum.
        currentSum += nums[right];

        // If the current sum exceeds the target, shrink the window from the left.
        while (currentSum > target && left <= right) {
            currentSum -= nums[left];
            left++;
        }

        // If the current sum equals the target, update the maximum length.
        if (currentSum === target) {
            maxLen = Math.max(maxLen, right - left + 1);
        }
    }

    // If `maxLen` is still -1, it means no subarray with sum `target` was found.
    // Otherwise, the minimum operations is the total number of elements minus the length of the longest subarray.
    return maxLen === -1 ? -1 : nums.length - maxLen;
};
