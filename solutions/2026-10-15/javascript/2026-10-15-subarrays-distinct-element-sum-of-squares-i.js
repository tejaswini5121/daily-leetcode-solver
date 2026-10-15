// Problem Summary: Calculate the sum of squares of distinct element counts for all possible subarrays.
// Link: https://leetcode.com/problems/subarrays-distinct-element-sum-of-squares-i/
//
// Approach:
// We can iterate through all possible subarrays of the given array `nums`.
// For each subarray, we determine the number of distinct elements it contains.
// We then square this distinct count and add it to a running total.
//
// To find the distinct count for each subarray, we can use a Set.
//
// Let's break down the iteration:
// The outer loop will iterate through all possible starting indices `i` of a subarray.
// The inner loop will iterate through all possible ending indices `j` of a subarray, starting from `i`.
// For each subarray `nums[i..j]`, we create a Set and add elements from `nums[i]` to `nums[j]` into it.
// The size of the Set at the end of processing `nums[i..j]` gives us the distinct count.
//
// Time Complexity:
// We have a nested loop structure. The outer loop runs `n` times (where `n` is the length of `nums`).
// The inner loop runs up to `n` times for each iteration of the outer loop.
// Inside the inner loop, we add elements to a Set. In the worst case, adding an element to a Set takes O(1) on average.
// So, for each subarray, calculating the distinct count takes at most O(n) time.
// The total number of subarrays is O(n^2).
// Therefore, the overall time complexity is O(n^2 * n) = O(n^3) if we rebuild the set for each subarray.
//
// A more optimized approach within this nested loop structure is to maintain the set as the inner loop progresses.
// When the inner loop moves from `j` to `j+1`, we only need to consider adding `nums[j+1]` to the set.
// This reduces the time to calculate distinct count for each subarray to O(1) on average after the initial setup.
// With this optimization:
// Outer loop (i): n iterations
// Inner loop (j): n iterations
// Set operations (add, size): O(1) on average
// Total time complexity: O(n * n * 1) = O(n^2).
// Given the constraints (n <= 100), O(n^2) is perfectly acceptable.
//
// Space Complexity:
// For each subarray, we use a Set to store distinct elements.
// In the worst case, a subarray can have up to `n` distinct elements.
// However, since we reuse the Set and clear it or create a new one for each outer loop iteration's start index,
// the maximum space used by the Set at any given time is O(n) if the inner loop expands to the full array.
// So, the space complexity is O(n).
// Given the constraints (nums[i] <= 100), the maximum number of distinct elements is also bounded by 100,
// so it's effectively O(min(n, max_value)), which is O(1) if max_value is constant.
// For this problem, values are <= 100, so it's effectively O(1) in terms of value range.
// However, the number of elements in the subarray is what matters for space related to `n`.

var sumOfSquaresOfDistinctCounts = function(nums) {
    let totalSumOfSquares = 0; // Initialize the total sum of squares to 0.
    const n = nums.length; // Get the length of the input array.

    // Iterate through all possible start indices of subarrays.
    for (let i = 0; i < n; i++) {
        // For each starting index `i`, iterate through all possible end indices `j`.
        // The subarray will be nums[i..j].
        // We maintain a Set to efficiently track distinct elements within the current subarray.
        const distinctElements = new Set();

        for (let j = i; j < n; j++) {
            // Add the current element nums[j] to the set of distinct elements for the subarray nums[i..j].
            distinctElements.add(nums[j]);

            // The size of the set is the count of distinct elements in nums[i..j].
            const distinctCount = distinctElements.size;

            // Square the distinct count and add it to the total sum.
            totalSumOfSquares += distinctCount * distinctCount;
        }
    }

    // Return the final calculated sum of squares of distinct counts.
    return totalSumOfSquares;
};
