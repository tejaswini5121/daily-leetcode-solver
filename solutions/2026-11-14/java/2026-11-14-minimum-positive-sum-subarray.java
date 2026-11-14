```java
/**
 * Problem: Minimum Positive Sum Subarray
 * Summary: Find the minimum positive sum of a subarray with a length between l and r.
 * Link: https://leetcode.com/problems/minimum-positive-sum-subarray/
 *
 * Approach:
 * This problem can be solved using a brute-force approach combined with prefix sums.
 * We iterate through all possible subarrays whose lengths are within the given range [l, r].
 * For each subarray, we calculate its sum. If the sum is positive, we keep track of the minimum positive sum found so far.
 *
 * To efficiently calculate subarray sums, we can precompute a prefix sum array.
 * The sum of a subarray from index `i` to `j` (inclusive) can be calculated as `prefixSum[j+1] - prefixSum[i]`.
 *
 * We initialize `minPositiveSum` to `Integer.MAX_VALUE`.
 * We iterate through all possible start indices `i` from 0 to `nums.length - 1`.
 * For each start index `i`, we iterate through all possible end indices `j` from `i` to `nums.length - 1`.
 * We check if the length of the subarray `(j - i + 1)` is within the range `[l, r]`.
 * If it is, we calculate the sum of the subarray `nums[i...j]` using prefix sums.
 * If the `currentSum` is greater than 0, we update `minPositiveSum = Math.min(minPositiveSum, currentSum)`.
 *
 * After checking all valid subarrays, if `minPositiveSum` is still `Integer.MAX_VALUE`, it means no such subarray was found, so we return -1. Otherwise, we return `minPositiveSum`.
 *
 * Time Complexity:
 * The prefix sum array calculation takes O(N) time, where N is the length of `nums`.
 * The nested loops iterate through all possible subarrays. The outer loop runs N times, and the inner loop runs up to N times.
 * Inside the inner loop, calculating the sum using prefix sums takes O(1) time.
 * Therefore, the overall time complexity is O(N^2). Given N <= 100, this is acceptable.
 *
 * Space Complexity:
 * We use a prefix sum array of size N+1, which takes O(N) space.
 *
 */
class Solution {
    /**
     * Finds the minimum positive sum of a subarray with a length between l and r.
     *
     * @param nums The input integer array.
     * @param l    The minimum length of the subarray.
     * @param r    The maximum length of the subarray.
     * @return The minimum positive sum of a qualifying subarray, or -1 if none exists.
     */
    public int minPositiveSumSubarray(int[] nums, int l, int r) {
        int n = nums.length;
        // Create a prefix sum array to efficiently calculate subarray sums.
        // prefixSum[i] will store the sum of elements from nums[0] to nums[i-1].
        // prefixSum[0] is 0, which helps in calculating sums starting from index 0.
        int[] prefixSum = new int[n + 1];
        prefixSum[0] = 0;
        for (int i = 0; i < n; i++) {
            prefixSum[i + 1] = prefixSum[i] + nums[i];
        }

        // Initialize minPositiveSum to a large value.
        // This will be updated with the smallest positive sum found.
        int minPositiveSum = Integer.MAX_VALUE;

        // Iterate through all possible start indices of the subarray.
        for (int i = 0; i < n; i++) {
            // Iterate through all possible end indices of the subarray.
            for (int j = i; j < n; j++) {
                // Calculate the length of the current subarray.
                int currentLength = j - i + 1;

                // Check if the current subarray's length is within the allowed range [l, r].
                if (currentLength >= l && currentLength <= r) {
                    // Calculate the sum of the subarray nums[i...j] using prefix sums.
                    // The sum is prefixSum[j+1] - prefixSum[i].
                    int currentSum = prefixSum[j + 1] - prefixSum[i];

                    // If the current sum is positive, update minPositiveSum if it's smaller.
                    if (currentSum > 0) {
                        minPositiveSum = Math.min(minPositiveSum, currentSum);
                    }
                }
            }
        }

        // If minPositiveSum is still Integer.MAX_VALUE, it means no positive sum subarray
        // within the given length constraints was found.
        if (minPositiveSum == Integer.MAX_VALUE) {
            return -1; // No such subarray exists.
        } else {
            return minPositiveSum; // Return the minimum positive sum found.
        }
    }
}
```