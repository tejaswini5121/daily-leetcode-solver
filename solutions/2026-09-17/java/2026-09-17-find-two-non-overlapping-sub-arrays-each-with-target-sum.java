// Problem Summary: Find two non-overlapping sub-arrays with a target sum,
// minimizing the combined length of these two sub-arrays.
// Link: https://leetcode.com/problems/find-two-non-overlapping-sub-arrays-each-with-target-sum/
//
// Approach:
// This problem can be solved efficiently using a combination of prefix sums and a hash map
// to store the first occurrence of a prefix sum. We can iterate through the array and,
// for each element, calculate the current prefix sum. We then check if a previous
// prefix sum exists such that their difference equals the target. If it does, it means
// we've found a sub-array with the target sum.
//
// To find two non-overlapping sub-arrays with the minimum combined length, we can use
// dynamic programming. We'll maintain two arrays:
// 1. `min_len_left[i]`: The minimum length of a sub-array with sum `target` ending at or before index `i`.
// 2. `min_len_right[i]`: The minimum length of a sub-array with sum `target` starting at or after index `i`.
//
// First, we iterate from left to right to populate `min_len_left`. We use a hash map to
// store the index of the first occurrence of each prefix sum. When we find a sub-array
// with sum `target`, we update `min_len_left[i]` with the minimum length found so far.
//
// Second, we iterate from right to left to populate `min_len_right` using a similar approach.
//
// Finally, we iterate through the array from `i = 0` to `n-2`. For each `i`, we consider
// the possibility of the first sub-array ending at `i` and the second sub-array starting
// at `i+1`. We then sum `min_len_left[i]` and `min_len_right[i+1]` and find the minimum
// of these sums. If no two such sub-arrays are found, we return -1.
//
// Time Complexity: O(n) - We iterate through the array a constant number of times (three passes).
// Space Complexity: O(n) - For the prefix sum hash map and the two DP arrays.
class Solution {
    public int minSumOfLengths(int[] arr, int target) {
        int n = arr.length;

        // min_len_left[i]: minimum length of a sub-array with sum 'target' ending at or before index i.
        int[] min_len_left = new int[n];
        // Initialize with a value larger than any possible length.
        Arrays.fill(min_len_left, Integer.MAX_VALUE);

        // min_len_right[i]: minimum length of a sub-array with sum 'target' starting at or after index i.
        int[] min_len_right = new int[n];
        // Initialize with a value larger than any possible length.
        Arrays.fill(min_len_right, Integer.MAX_VALUE);

        // Map to store the first occurrence of a prefix sum: prefix_sum -> index.
        Map<Integer, Integer> prefixSumMap = new HashMap<>();
        prefixSumMap.put(0, -1); // Base case: prefix sum 0 occurs before index 0.

        int currentSum = 0;
        int minLenSoFar = Integer.MAX_VALUE;

        // Populate min_len_left by iterating from left to right.
        for (int i = 0; i < n; i++) {
            currentSum += arr[i];

            // If we've seen a prefix sum 'currentSum - target' before, it means
            // there's a sub-array ending at 'i' with sum 'target'.
            if (prefixSumMap.containsKey(currentSum - target)) {
                int prevIndex = prefixSumMap.get(currentSum - target);
                // Length of the current sub-array with sum 'target'.
                int currentSubarrayLen = i - prevIndex;
                // Update the minimum length found so far ending at or before 'i'.
                minLenSoFar = Math.min(minLenSoFar, currentSubarrayLen);
            }

            // Store the minimum length found so far that ends at or before index 'i'.
            if (i > 0) {
                min_len_left[i] = min_len_left[i - 1];
            }
            if (minLenSoFar != Integer.MAX_VALUE) {
                min_len_left[i] = Math.min(min_len_left[i], minLenSoFar);
            }

            // Store the first occurrence of the current prefix sum.
            // If prefixSumMap.get(currentSum) is already present, it means we've seen this sum before,
            // and we want to keep the *earlier* index for calculating sub-array lengths.
            prefixSumMap.put(currentSum, i);
        }

        // Reset for right-to-left pass.
        prefixSumMap.clear();
        prefixSumMap.put(0, n); // Base case for right-to-left: prefix sum 0 occurs after index n-1.
        currentSum = 0;
        minLenSoFar = Integer.MAX_VALUE;

        // Populate min_len_right by iterating from right to left.
        for (int i = n - 1; i >= 0; i--) {
            currentSum += arr[i];

            // If we've seen a prefix sum 'currentSum - target' before (relative to the end of the array),
            // it means there's a sub-array starting at 'i' with sum 'target'.
            // For right-to-left, `prefixSumMap` stores `sum -> index`.
            // We are looking for `currentSum - target` in the map.
            // If found at `prevIndex`, then `arr[i...prevIndex-1]` sums to `target`.
            // The sum of elements from index `i` to `n-1` is `currentSum`.
            // If we subtract `target` from `currentSum`, we get the prefix sum
            // up to the element *before* the start of our desired sub-array.
            if (prefixSumMap.containsKey(currentSum - target)) {
                int nextIndex = prefixSumMap.get(currentSum - target);
                // Length of the current sub-array with sum 'target'.
                int currentSubarrayLen = nextIndex - i;
                // Update the minimum length found so far starting at or after 'i'.
                minLenSoFar = Math.min(minLenSoFar, currentSubarrayLen);
            }

            // Store the minimum length found so far that starts at or after index 'i'.
            if (i < n - 1) {
                min_len_right[i] = min_len_right[i + 1];
            }
            if (minLenSoFar != Integer.MAX_VALUE) {
                min_len_right[i] = Math.min(min_len_right[i], minLenSoFar);
            }

            // Store the first occurrence of the current prefix sum (from right).
            // For right-to-left, `prefixSumMap` stores `sum -> index`.
            // We want the largest index for a given prefix sum from the right.
            prefixSumMap.put(currentSum, i);
        }

        int minTotalLength = Integer.MAX_VALUE;

        // Iterate to find the minimum sum of lengths of two non-overlapping sub-arrays.
        // The first sub-array ends at index 'i', and the second starts at 'i+1'.
        for (int i = 0; i < n - 1; i++) {
            // If we found a valid sub-array ending at or before 'i' AND
            // a valid sub-array starting at or after 'i+1'.
            if (min_len_left[i] != Integer.MAX_VALUE && min_len_right[i + 1] != Integer.MAX_VALUE) {
                minTotalLength = Math.min(minTotalLength, min_len_left[i] + min_len_right[i + 1]);
            }
        }

        // If minTotalLength remains its initial large value, it means no such pair was found.
        return minTotalLength == Integer.MAX_VALUE ? -1 : minTotalLength;
    }
}
