```java
// Problem: Removing Minimum and Maximum From Array
// Link: https://leetcode.com/problems/removing-minimum-and-maximum-from-array/
// Approach:
// The goal is to find the minimum number of deletions to remove both the minimum and maximum elements.
// Deletions can only be performed from the front or the back of the array.
// This means we need to consider the indices of the minimum and maximum elements.
// Let `minIndex` be the index of the minimum element and `maxIndex` be the index of the maximum element.
// Let `n` be the length of the array.
// There are three main strategies to remove both elements:
// 1. Remove both from the left: This requires deleting elements from index 0 up to the rightmost of `minIndex` and `maxIndex`. The number of deletions would be `max(minIndex, maxIndex) + 1`.
// 2. Remove both from the right: This requires deleting elements from the leftmost of `minIndex` and `maxIndex` up to `n-1`. The number of deletions would be `n - min(minIndex, maxIndex)`.
// 3. Remove one from the left and one from the right:
//    - If `minIndex` is removed from the left and `maxIndex` from the right: deletions = `minIndex + 1 + n - maxIndex`.
//    - If `maxIndex` is removed from the left and `minIndex` from the right: deletions = `maxIndex + 1 + n - minIndex`.
//    These two scenarios can be combined by considering the distance from the start for one and distance from the end for the other.
//    Specifically, we can remove elements up to `minIndex` from the left, and elements from `maxIndex` to the end from the right.
//    The total deletions would be `minIndex + 1` (from the left) + `n - maxIndex` (from the right).
//    Similarly, we can remove elements up to `maxIndex` from the left, and elements from `minIndex` to the end from the right.
//    The total deletions would be `maxIndex + 1` (from the left) + `n - minIndex` (from the right).
//    The minimum deletions for this strategy would be `min(minIndex + 1 + n - maxIndex, maxIndex + 1 + n - minIndex)`.
//    However, a simpler way to think about strategy 3 is to consider removing elements from the left until one of them is removed, and then removing elements from the right until the other is removed.
//    The minimum deletions from the left to remove both would be `max(minIndex, maxIndex) + 1`.
//    The minimum deletions from the right to remove both would be `n - min(minIndex, maxIndex)`.
//    The minimum deletions by removing from both ends would be to remove the element furthest from the start from the left, and the element furthest from the end from the right.
//    The distance from the start for `minIndex` is `minIndex`. The distance from the end is `n - 1 - minIndex`.
//    The distance from the start for `maxIndex` is `maxIndex`. The distance from the end is `n - 1 - maxIndex`.
//    The cost of removing `minIndex` from the left is `minIndex + 1`. The cost of removing `maxIndex` from the left is `maxIndex + 1`.
//    The cost of removing `minIndex` from the right is `n - minIndex`. The cost of removing `maxIndex` from the right is `n - maxIndex`.
//
//    Let's re-evaluate strategy 3 more clearly:
//    We remove elements from the left until we reach the element that is closer to the left boundary.
//    Then we remove elements from the right until we reach the element that is closer to the right boundary.
//    Consider the two indices `i` and `j` (where `i` is `minIndex` and `j` is `maxIndex`, or vice-versa). Assume `i < j`.
//    - Option 1: Remove both from the left. Number of deletions = `j + 1`.
//    - Option 2: Remove both from the right. Number of deletions = `n - i`.
//    - Option 3: Remove `i` from the left and `j` from the right. Number of deletions = `(i + 1) + (n - j)`.
//    So, the minimum number of deletions is `min(j + 1, n - i, (i + 1) + (n - j))`.
//
//    We need to find the indices of the minimum and maximum elements first.
//    Then, we iterate through the three possible removal strategies and return the minimum.
//
//    Edge Case: If `nums.length` is 1, that single element is both min and max, so 1 deletion is needed.
//
// Time Complexity: O(n) - to find the minimum and maximum elements. The rest are constant time operations.
// Space Complexity: O(1) - only a few variables are used to store indices and the minimum result.
class Solution {
    public int minimumDeletions(int[] nums) {
        int n = nums.length;

        // Handle the edge case where the array has only one element.
        // This element is both the minimum and maximum.
        if (n == 1) {
            return 1;
        }

        // Find the index of the minimum element and the maximum element.
        int minVal = nums[0];
        int maxVal = nums[0];
        int minIndex = 0;
        int maxIndex = 0;

        for (int i = 1; i < n; i++) {
            if (nums[i] < minVal) {
                minVal = nums[i];
                minIndex = i;
            }
            if (nums[i] > maxVal) {
                maxVal = nums[i];
                maxIndex = i;
            }
        }

        // Now we have `minIndex` and `maxIndex`. Let's consider the three strategies:

        // Strategy 1: Remove both from the left.
        // We need to remove all elements from index 0 up to the index that is further from the start.
        // This is `max(minIndex, maxIndex) + 1` deletions.
        int deletionsFromLeft = Math.max(minIndex, maxIndex) + 1;

        // Strategy 2: Remove both from the right.
        // We need to remove all elements from the index that is closer to the start up to `n-1`.
        // This is `n - min(minIndex, maxIndex)` deletions.
        int deletionsFromRight = n - Math.min(minIndex, maxIndex);

        // Strategy 3: Remove one from the left and the other from the right.
        // There are two sub-cases here:
        //   a) Remove `minIndex` from the left and `maxIndex` from the right.
        //      Deletions = (elements from 0 to minIndex) + (elements from maxIndex to n-1)
        //      Deletions = (minIndex + 1) + (n - maxIndex)
        //   b) Remove `maxIndex` from the left and `minIndex` from the right.
        //      Deletions = (elements from 0 to maxIndex) + (elements from minIndex to n-1)
        //      Deletions = (maxIndex + 1) + (n - minIndex)
        // We take the minimum of these two sub-cases.
        int deletionsMixed = Math.min(
            (minIndex + 1) + (n - maxIndex), // min from left, max from right
            (maxIndex + 1) + (n - minIndex)  // max from left, min from right
        );

        // The minimum number of deletions is the minimum of the three strategies.
        return Math.min(deletionsFromLeft, Math.min(deletionsFromRight, deletionsMixed));
    }
}
```