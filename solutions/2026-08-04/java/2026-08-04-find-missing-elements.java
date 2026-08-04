/*
Problem Summary:
Given an array of unique integers `nums` representing a subset of a contiguous range, where the smallest and largest integers of the original range are still present in `nums`. The task is to find all integers missing from this range and return them in a sorted list.

Link: https://leetcode.com/problems/find-missing-elements/

Approach Explanation:
1.  Identify the full range: First, determine the minimum and maximum values present in the input array `nums`. These values define the start and end of the complete integer range from which `nums` was originally derived.
2.  Store present numbers: To efficiently check for the presence of numbers, all elements from the input array `nums` are added to a `HashSet`. This allows for O(1) average time complexity lookups.
3.  Iterate and collect missing numbers: Iterate through every integer from the calculated minimum value to the maximum value (inclusive). For each integer in this range, check if it exists in the `HashSet`. If an integer is not found in the `HashSet`, it means it's a missing number, and it is added to a `List` of missing integers.
4.  Return the list: Since the iteration from min to max is done in increasing order, the `List` of missing integers will naturally be sorted. This list is then returned.

Time Complexity Analysis:
-   Finding the minimum and maximum values: O(N), where N is the number of elements in `nums`, as we iterate through `nums` once.
-   Adding elements to the `HashSet`: O(N) on average, as each `add` operation takes O(1) on average.
-   Iterating from min to max and checking for missing elements: O(RangeSize), where `RangeSize` is `maxVal - minVal + 1`. In the worst case, `RangeSize` can be up to 100 (given constraints 1 <= nums[i] <= 100). Each `contains` operation on a `HashSet` takes O(1) on average.
-   Total Time Complexity: O(N + RangeSize). Given N <= 100 and RangeSize <= 100, this is very efficient.

Space Complexity Analysis:
-   `HashSet` to store present numbers: O(N) in the worst case, if all numbers in `nums` are distinct.
-   `ArrayList` to store missing numbers: O(RangeSize) in the worst case, if almost all numbers in the range are missing.
-   Total Space Complexity: O(N + RangeSize). Given N <= 100 and RangeSize <= 100, this is also very efficient.
*/

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Solution {
    public List<Integer> findMissingElements(int[] nums) {
        // Initialize min and max values to determine the full range.
        // Use Integer.MAX_VALUE and Integer.MIN_VALUE to ensure any number in nums
        // correctly updates these initial values.
        int minVal = Integer.MAX_VALUE;
        int maxVal = Integer.MIN_VALUE;

        // A HashSet is used for efficient O(1) average time complexity lookups
        // to quickly check if a number from the full range is present in the input array.
        Set<Integer> presentNumbers = new HashSet<>();

        // First pass: Iterate through the input array 'nums'.
        // This loop serves two purposes:
        // 1. Find the true minimum and maximum values in 'nums' to define the range.
        // 2. Populate the 'presentNumbers' HashSet with all elements from 'nums'.
        for (int num : nums) {
            // Update the minimum value found so far.
            minVal = Math.min(minVal, num);
            // Update the maximum value found so far.
            maxVal = Math.max(maxVal, num);
            // Add the current number to the set of present numbers for quick lookups later.
            presentNumbers.add(num);
        }

        // Initialize a list to store the missing numbers.
        // This list will automatically be sorted in ascending order because
        // we will iterate through the full range from minVal to maxVal.
        List<Integer> missingElements = new ArrayList<>();

        // Second pass: Iterate from the determined minimum value to the maximum value (inclusive).
        // For each number in this full range, check if it is present in our 'presentNumbers' set.
        for (int i = minVal; i <= maxVal; i++) {
            // If the current number 'i' is NOT found in our set of 'presentNumbers',
            // it means this integer is a missing element from the original contiguous range.
            if (!presentNumbers.contains(i)) {
                // Add the identified missing number to our result list.
                missingElements.add(i);
            }
        }

        // Return the list of all found missing elements. This list is already sorted
        // due to the nature of the iteration.
        return missingElements;
    }
}