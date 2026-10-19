```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    /**
     * Finds all indices of a target element in an array after sorting it.
     * Problem Link: https://leetcode.com/problems/find-target-indices-after-sorting-array/
     *
     * Approach:
     * 1. Sort the input array `nums` in non-decreasing order.
     * 2. Iterate through the sorted array.
     * 3. If an element matches the `target`, add its index to a result list.
     * 4. Since the array is sorted, all occurrences of the target will be contiguous,
     *    and their indices will naturally be in increasing order.
     *
     * Time Complexity: O(N log N) due to the sorting step, where N is the length of `nums`.
     * Space Complexity: O(N) in the worst case for the `result` list if all elements are the target.
     *                  If we consider the space used by sorting algorithms that might use auxiliary space,
     *                  it could be O(log N) or O(N) depending on the implementation. However, the problem
     *                  constraints are small (N <= 100), so `Arrays.sort()` is efficient.
     */
    public List<Integer> targetIndices(int[] nums, int target) {
        // Sort the array in non-decreasing order.
        Arrays.sort(nums);

        // Initialize a list to store the indices where the target is found.
        List<Integer> result = new ArrayList<>();

        // Iterate through the sorted array to find target indices.
        for (int i = 0; i < nums.length; i++) {
            // If the current element matches the target, add its index to the result list.
            if (nums[i] == target) {
                result.add(i);
            }
            // Optimization: Since the array is sorted, if we encounter an element
            // greater than the target, we can stop searching as no further elements
            // will match the target.
            else if (nums[i] > target) {
                break;
            }
        }

        // Return the list of target indices. The list will be sorted because we
        // iterate through the sorted array from left to right.
        return result;
    }
}
```