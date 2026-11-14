// Given an integer array nums and two integers l and r, find the minimum positive sum of a subarray whose size is between l and r (inclusive).
// Link: https://leetcode.com/problems/minimum-positive-sum-subarray/
// Approach:
// We can use a prefix sum array to efficiently calculate the sum of any subarray.
// Let prefixSum[i] be the sum of elements from nums[0] to nums[i-1]. Then, the sum of a subarray from index i to j (inclusive) is prefixSum[j+1] - prefixSum[i].
// We iterate through all possible start and end indices of subarrays. For each subarray, we check if its length is within the [l, r] range and if its sum is greater than 0.
// If both conditions are met, we update the minimum positive sum found so far.
// If no such subarray is found after checking all possibilities, we return -1.
//
// Time Complexity: O(n^2), where n is the length of the nums array. This is because we have nested loops to iterate through all possible subarrays.
// Space Complexity: O(n) for the prefix sum array.
const minimumPositiveSumSubarray = (nums, l, r) => {
    const n = nums.length;
    // Initialize prefix sum array. prefixSum[i] will store the sum of nums[0]...nums[i-1].
    // prefixSum[0] is 0, representing the sum before the first element.
    const prefixSum = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefixSum[i + 1] = prefixSum[i] + nums[i];
    }

    // Initialize minimum positive sum to infinity.
    let minPositiveSum = Infinity;

    // Iterate through all possible start indices of a subarray.
    for (let i = 0; i < n; i++) {
        // Iterate through all possible end indices of a subarray.
        for (let j = i; j < n; j++) {
            // Calculate the length of the current subarray.
            const subarrayLength = j - i + 1;

            // Check if the subarray length is within the given range [l, r].
            if (subarrayLength >= l && subarrayLength <= r) {
                // Calculate the sum of the current subarray using prefix sums.
                // sum(nums[i...j]) = prefixSum[j+1] - prefixSum[i]
                const currentSum = prefixSum[j + 1] - prefixSum[i];

                // Check if the current subarray sum is positive.
                if (currentSum > 0) {
                    // Update the minimum positive sum if the current sum is smaller.
                    minPositiveSum = Math.min(minPositiveSum, currentSum);
                }
            }
        }
    }

    // If minPositiveSum is still Infinity, it means no subarray with a positive sum
    // within the given length constraints was found. Return -1.
    // Otherwise, return the minimum positive sum found.
    return minPositiveSum === Infinity ? -1 : minPositiveSum;
};
```