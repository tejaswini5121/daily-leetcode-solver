/**
 * @file LeetCode problem: Longest Strictly Increasing or Strictly Decreasing Subarray
 * @brief Finds the length of the longest subarray that is either strictly increasing or strictly decreasing.
 * @link https://leetcode.com/problems/longest-strictly-increasing-or-strictly-decreasing-subarray/
 *
 * @approach
 * We can iterate through the array and maintain two counters: one for the current strictly increasing subarray length (`incCount`) and one for the current strictly decreasing subarray length (`decCount`).
 *
 * We also maintain a `maxLength` variable to store the overall maximum length found so far.
 *
 * For each element `nums[i]`, we compare it with the previous element `nums[i-1]`:
 * 1. If `nums[i] > nums[i-1]`:
 *    - The increasing streak continues. Increment `incCount`.
 *    - The decreasing streak is broken. Reset `decCount` to 1.
 * 2. If `nums[i] < nums[i-1]`:
 *    - The decreasing streak continues. Increment `decCount`.
 *    - The increasing streak is broken. Reset `incCount` to 1.
 * 3. If `nums[i] == nums[i-1]`:
 *    - Both increasing and decreasing streaks are broken. Reset both `incCount` and `decCount` to 1.
 *
 * After updating `incCount` and `decCount`, we update `maxLength` by taking the maximum of `maxLength`, `incCount`, and `decCount`.
 *
 * We initialize `maxLength`, `incCount`, and `decCount` to 1 because a single element is considered a subarray of length 1. The loop starts from the second element (index 1).
 *
 * @complexity
 * Time Complexity: O(n), where n is the length of the input array `nums`. We iterate through the array once.
 * Space Complexity: O(1). We only use a few constant-space variables.
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestSubarray = function(nums) {
    // Initialize the maximum length found so far to 1, as any single element is a valid subarray.
    let maxLength = 1;
    // Initialize the current length of the strictly increasing subarray to 1.
    let incCount = 1;
    // Initialize the current length of the strictly decreasing subarray to 1.
    let decCount = 1;

    // Iterate through the array starting from the second element (index 1).
    for (let i = 1; i < nums.length; i++) {
        // Check if the current element is strictly greater than the previous element.
        if (nums[i] > nums[i - 1]) {
            // If it is, the increasing subarray continues. Increment its count.
            incCount++;
            // The strictly decreasing subarray is broken, so reset its count to 1.
            decCount = 1;
        }
        // Check if the current element is strictly less than the previous element.
        else if (nums[i] < nums[i - 1]) {
            // If it is, the decreasing subarray continues. Increment its count.
            decCount++;
            // The strictly increasing subarray is broken, so reset its count to 1.
            incCount = 1;
        }
        // If the current element is equal to the previous element.
        else {
            // Both strictly increasing and decreasing subarrays are broken.
            // Reset both counts to 1, as the current element starts a new potential subarray of length 1.
            incCount = 1;
            decCount = 1;
        }

        // Update the overall maximum length found so far.
        // We take the maximum of the current maxLength, the current incCount, and the current decCount.
        maxLength = Math.max(maxLength, incCount, decCount);
    }

    // Return the maximum length found.
    return maxLength;
};
```