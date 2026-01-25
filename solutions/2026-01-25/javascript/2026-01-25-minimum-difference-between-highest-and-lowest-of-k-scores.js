// Problem Summary: Find the minimum difference between the highest and lowest scores among any k students.
// Problem Link: https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/
// Approach:
// 1. Sort the input array `nums` in ascending order. This is crucial because to minimize the difference between the highest and lowest of k scores, these k scores must be contiguous in the sorted array.
// 2. Initialize a variable `minDifference` to a very large value (e.g., Infinity) to keep track of the minimum difference found so far.
// 3. Iterate through the sorted array using a sliding window of size `k`. For each window, the lowest score will be the first element of the window, and the highest score will be the last element of the window.
// 4. Calculate the difference between the highest and lowest score for the current window: `nums[i + k - 1] - nums[i]`.
// 5. Update `minDifference` with the minimum of its current value and the difference calculated in the previous step.
// 6. After iterating through all possible windows, `minDifference` will hold the smallest difference.
// Time Complexity: O(n log n) due to sorting the array, where n is the length of `nums`. The sliding window iteration takes O(n) time.
// Space Complexity: O(log n) or O(n) depending on the sorting algorithm used by the JavaScript engine (typically Timsort or Merge Sort which can take O(n) in the worst case for auxiliary space, or O(log n) for call stack in quicksort). If we consider in-place sorting, it can be O(1) for space apart from the input array.

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
const minimumDifference = function(nums, k) {
    // Sort the array in ascending order.
    // This allows us to use a sliding window of contiguous elements to find the minimum difference.
    nums.sort((a, b) => a - b);

    // Initialize minDifference to infinity.
    // This variable will store the smallest difference found between the highest and lowest of k scores.
    let minDifference = Infinity;

    // Iterate through the sorted array using a sliding window of size k.
    // The loop runs from the first element up to the element where a window of size k can still be formed.
    // The last possible starting index for a window of size k is nums.length - k.
    for (let i = 0; i <= nums.length - k; i++) {
        // For the current window starting at index `i`, the lowest score is `nums[i]`.
        // The highest score in this window is `nums[i + k - 1]`.
        const currentDifference = nums[i + k - 1] - nums[i];

        // Update minDifference if the current difference is smaller.
        minDifference = Math.min(minDifference, currentDifference);
    }

    // Return the minimum difference found.
    return minDifference;
};
