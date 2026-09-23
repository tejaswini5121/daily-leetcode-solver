// Problem Summary: Find the minimum operations to reduce x to zero by removing elements from either end of an array.
// Link: https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/
// Approach: The problem can be rephrased as finding a subarray in the middle whose sum is `total_sum - x`.
// If such a subarray exists, the minimum operations will be `n - length_of_subarray`.
// We use a sliding window approach to find the longest subarray with sum `total_sum - x`.
// We first calculate the total sum of the array. If x is greater than the total sum, it's impossible to reach zero, so return -1.
// Otherwise, we aim to find the longest subarray whose sum is `target = total_sum - x`.
// We use two pointers, `left` and `right`, to define the window.
// We expand the window by moving `right` and subtracting `nums[right]` from the current window sum.
// If the window sum exceeds the `target`, we shrink the window by moving `left` and adding `nums[left]` to the window sum.
// If the window sum equals the `target`, we update the maximum length of such a subarray.
// If no such subarray is found (max_len remains -1), it means x cannot be reduced to zero.
// Otherwise, the minimum operations is `n - max_len`.
// Time Complexity: O(n) because both `left` and `right` pointers traverse the array at most once.
// Space Complexity: O(1) as we only use a few variables to store the sum and pointers.
class Solution {
    public int minOperations(int[] nums, int x) {
        // Calculate the total sum of the array.
        int totalSum = 0;
        for (int num : nums) {
            totalSum += num;
        }

        // If x is greater than the total sum, it's impossible to reach zero.
        if (x > totalSum) {
            return -1;
        }

        // The target sum for the middle subarray is totalSum - x.
        int target = totalSum - x;

        // If target is 0, it means we need to remove all elements to reach x, so the answer is nums.length.
        if (target == 0) {
            return nums.length;
        }

        // Initialize variables for the sliding window.
        int left = 0; // Left pointer of the window.
        int currentSum = 0; // Sum of elements within the current window.
        int maxLen = -1; // Maximum length of a subarray with sum equal to target. Initialized to -1 to indicate no such subarray found yet.

        // Iterate through the array with the right pointer.
        for (int right = 0; right < nums.length; right++) {
            // Add the current element to the window sum.
            currentSum += nums[right];

            // If the current sum exceeds the target, shrink the window from the left.
            while (currentSum > target && left <= right) {
                currentSum -= nums[left];
                left++;
            }

            // If the current sum equals the target, update the maximum length.
            if (currentSum == target) {
                maxLen = Math.max(maxLen, right - left + 1);
            }
        }

        // If maxLen is still -1, it means no subarray with sum 'target' was found.
        // Otherwise, the minimum operations is the total length minus the length of the longest subarray.
        return maxLen == -1 ? -1 : nums.length - maxLen;
    }
}
