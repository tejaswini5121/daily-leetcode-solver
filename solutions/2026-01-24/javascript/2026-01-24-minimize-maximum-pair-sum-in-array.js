/**
 * @param {number[]} nums
 * @return {number}
 *
 * Problem Summary: Pair up elements in an array to minimize the largest sum of any pair.
 * Link: https://leetcode.com/problems/minimize-maximum-pair-sum-in-array/
 *
 * Approach:
 * To minimize the maximum pair sum, we should pair the smallest element with the largest element,
 * the second smallest with the second largest, and so on. This is a greedy approach.
 * By sorting the array first, we can easily access these elements.
 * We then use two pointers, one at the beginning of the sorted array (smallest element)
 * and one at the end (largest element). We form a pair, calculate its sum, and keep track
 * of the maximum sum encountered. We move the left pointer one step to the right and the
 * right pointer one step to the left for the next pair.
 *
 * Time Complexity: O(N log N) due to sorting the array. The two-pointer iteration takes O(N).
 * Space Complexity: O(log N) or O(N) depending on the sorting algorithm used by the environment.
 *                   If an in-place sort like Heapsort is used, it's O(log N) for recursion stack.
 *                   If Timsort or Mergesort is used, it can be O(N) for auxiliary space.
 */
const minPairSum = (nums) => {
    // Sort the array in ascending order.
    // This is crucial for the greedy approach where we pair smallest with largest.
    nums.sort((a, b) => a - b);

    // Initialize two pointers: one at the beginning (smallest element)
    // and one at the end (largest element).
    let left = 0;
    let right = nums.length - 1;

    // Initialize a variable to store the maximum pair sum found so far.
    let maxPairSum = 0;

    // Iterate while the left pointer is less than the right pointer.
    // This ensures we consider all possible pairs from the ends inward.
    while (left < right) {
        // Calculate the sum of the current pair (smallest available and largest available).
        const currentPairSum = nums[left] + nums[right];

        // Update the maximum pair sum if the current pair sum is greater.
        maxPairSum = Math.max(maxPairSum, currentPairSum);

        // Move the pointers inward to consider the next pair.
        // The left pointer moves to the next smallest element.
        left++;
        // The right pointer moves to the next largest element.
        right--;
    }

    // Return the minimized maximum pair sum.
    return maxPairSum;
};
```