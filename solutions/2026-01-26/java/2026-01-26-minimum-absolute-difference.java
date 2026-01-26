```java
// Problem: Minimum Absolute Difference
// Problem Description: Find all pairs of elements with the minimum absolute difference.
// Link: https://leetcode.com/problems/minimum-absolute-difference/
//
// Approach:
// 1. Sort the input array `arr`. This is crucial because the minimum absolute difference
//    will always occur between adjacent elements in a sorted array.
// 2. Initialize a variable `minDiff` to store the minimum absolute difference found so far.
//    Initially, it can be set to a very large value or the difference between the first two
//    elements after sorting.
// 3. Iterate through the sorted array from the second element (`i = 1`). For each element,
//    calculate the absolute difference with its preceding element (`arr[i] - arr[i-1]`).
// 4. Update `minDiff` if the current difference is smaller.
// 5. After finding the `minDiff`, iterate through the sorted array again. This time, collect
//    all pairs `[arr[i-1], arr[i]]` whose difference is equal to `minDiff`.
// 6. Return the list of these pairs.
//
// Time Complexity: O(N log N) due to the sorting step. The subsequent two passes over the array
// take O(N) time, which is dominated by the sorting.
// Space Complexity: O(N) in the worst case for storing the result list. If we consider the
// space used by sorting algorithms that might use auxiliary space (e.g., merge sort), it could
// be O(log N) or O(N) depending on the implementation. However, if sorting is done in-place
// (like quicksort's average case), the dominant space complexity comes from the output list.
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> minimumAbsDifference(int[] arr) {
        // Sort the array to easily find minimum differences between adjacent elements.
        Arrays.sort(arr);

        // Initialize minimum difference to a very large value.
        int minDiff = Integer.MAX_VALUE;

        // First pass: Find the minimum absolute difference.
        // We only need to compare adjacent elements because the array is sorted.
        for (int i = 1; i < arr.length; i++) {
            int currentDiff = arr[i] - arr[i - 1];
            minDiff = Math.min(minDiff, currentDiff);
        }

        // List to store the pairs with the minimum absolute difference.
        List<List<Integer>> result = new ArrayList<>();

        // Second pass: Collect all pairs with the minimum absolute difference.
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] - arr[i - 1] == minDiff) {
                // Create a new list for the pair and add it to the result.
                List<Integer> pair = new ArrayList<>();
                pair.add(arr[i - 1]);
                pair.add(arr[i]);
                result.add(pair);
            }
        }

        // The pairs are already in ascending order because we iterate through the sorted array.
        return result;
    }
}
```