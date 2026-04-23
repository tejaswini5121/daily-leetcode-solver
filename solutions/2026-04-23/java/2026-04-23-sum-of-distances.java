/**
 * Calculates the sum of distances between indices of identical elements in an array.
 * Problem: https://leetcode.com/problems/sum-of-distances/
 *
 * Approach:
 * We can solve this problem efficiently by grouping indices based on their values.
 * For each distinct value in `nums`, we will have a list of indices where this value appears.
 * Let's say for a specific value `x`, the indices where it appears are `i1, i2, i3, ..., ik` in increasing order.
 * For any index `ij` in this list, the sum of distances to other occurrences of `x` is:
 * sum(|ij - i1| + |ij - i2| + ... + |ij - ik|)
 *
 * This sum can be broken down into two parts:
 * 1. The sum of distances to indices before `ij`: (ij - i1) + (ij - i2) + ... + (ij - i(j-1))
 *    This can be rewritten as (j-1) * ij - (i1 + i2 + ... + i(j-1)).
 * 2. The sum of distances to indices after `ij`: (i(j+1) - ij) + (i(j+2) - ij) + ... + (ik - ij)
 *    This can be rewritten as (i(j+1) + i(j+2) + ... + ik) - (k-j) * ij.
 *
 * To efficiently calculate these sums, we can use prefix sums for both the indices and the values.
 *
 * We can iterate through the `nums` array and store the indices for each number in a HashMap where the key is the number and the value is a list of its indices.
 *
 * Then, for each number in the HashMap:
 * 1. Get the list of indices.
 * 2. Calculate the prefix sum of these indices.
 * 3. Iterate through the list of indices. For each index `idx` at position `p` (0-indexed):
 *    - The sum of distances to elements *before* `idx` is: `p * idx - prefixSum[p-1]` (handle `p=0` case).
 *    - The sum of distances to elements *after* `idx` is: `totalSumOfIndices - prefixSum[p] - (totalNumberOfOccurrences - 1 - p) * idx` (handle `p=last_index` case).
 *    - The total sum of distances for `arr[idx]` is the sum of these two parts.
 *
 * Time Complexity:
 * - Building the HashMap: O(N), where N is the length of `nums`.
 * - For each distinct number, iterating through its indices to calculate prefix sums and distances:
 *   If a number appears K times, this part takes O(K).
 *   The sum of K for all distinct numbers is N. So, this step is also O(N).
 * - Overall Time Complexity: O(N).
 *
 * Space Complexity:
 * - HashMap to store indices: O(N) in the worst case (all elements are distinct).
 * - Prefix sum arrays: O(N) in the worst case.
 * - Result array: O(N).
 * - Overall Space Complexity: O(N).
 */
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    /**
     * Calculates the sum of distances for each element to all other elements with the same value.
     *
     * @param nums The input array of integers.
     * @return An array where arr[i] is the sum of |i - j| for all j such that nums[j] == nums[i] and j != i.
     */
    public long[] getDistances(int[] nums) {
        int n = nums.length;
        // Use a HashMap to store the indices for each number.
        // Key: number, Value: list of indices where this number appears.
        Map<Integer, List<Integer>> indexMap = new HashMap<>();

        // Populate the indexMap
        for (int i = 0; i < n; i++) {
            // Get the list of indices for the current number, or create a new list if it doesn't exist.
            indexMap.computeIfAbsent(nums[i], k -> new ArrayList<>()).add(i);
        }

        // Initialize the result array. Use long to prevent overflow for sums.
        long[] arr = new long[n];

        // Iterate through each distinct number found in the input array.
        for (Map.Entry<Integer, List<Integer>> entry : indexMap.entrySet()) {
            List<Integer> indices = entry.getValue(); // Get the list of indices for the current number.
            int numOccurrences = indices.size();     // Number of times this number appears.

            // If a number appears only once, there are no other elements with the same value, so its distance sum is 0.
            if (numOccurrences <= 1) {
                continue;
            }

            // Calculate the prefix sum of the indices for the current number.
            // This will help in quickly calculating sums of indices before/after a given index.
            long[] prefixSumIndices = new long[numOccurrences];
            prefixSumIndices[0] = indices.get(0);
            for (int i = 1; i < numOccurrences; i++) {
                prefixSumIndices[i] = prefixSumIndices[i - 1] + indices.get(i);
            }

            // Calculate the total sum of all indices for this number.
            long totalSumOfIndices = prefixSumIndices[numOccurrences - 1];

            // Now, for each index `currentIndex` in the `indices` list, calculate `arr[currentIndex]`.
            for (int i = 0; i < numOccurrences; i++) {
                int currentIndex = indices.get(i); // The actual index in the original `nums` array.

                // Calculate the sum of distances to indices *before* `currentIndex`.
                // Number of elements before `currentIndex` is `i`.
                // Sum of indices before `currentIndex` is `prefixSumIndices[i-1]` (if i > 0).
                // The sum is: (currentIndex - index_1) + (currentIndex - index_2) + ...
                // This simplifies to `i * currentIndex - (sum of indices before currentIndex)`
                long sumDistancesBefore = 0;
                if (i > 0) {
                    sumDistancesBefore = (long) i * currentIndex - prefixSumIndices[i - 1];
                }

                // Calculate the sum of distances to indices *after* `currentIndex`.
                // Number of elements after `currentIndex` is `numOccurrences - 1 - i`.
                // Sum of indices after `currentIndex` is `totalSumOfIndices - prefixSumIndices[i]`.
                // The sum is: (index_after_1 - currentIndex) + (index_after_2 - currentIndex) + ...
                // This simplifies to `(sum of indices after currentIndex) - (numOccurrences - 1 - i) * currentIndex`
                long sumDistancesAfter = 0;
                if (i < numOccurrences - 1) {
                    sumDistancesAfter = (totalSumOfIndices - prefixSumIndices[i]) - (long) (numOccurrences - 1 - i) * currentIndex;
                }

                // The total distance for `arr[currentIndex]` is the sum of distances before and after.
                arr[currentIndex] = sumDistancesBefore + sumDistancesAfter;
            }
        }

        return arr; // Return the calculated array of distances.
    }
}
