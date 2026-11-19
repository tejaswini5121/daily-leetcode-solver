```java
// Problem: Minimum Score by Changing Two Elements
// Link: https://leetcode.com/problems/minimum-score-by-changing-two-elements/
// Approach: To minimize the score (max_diff + min_diff), we want to make the range of numbers as small as possible.
// The minimum possible low score is 0, which can be achieved if we can make at least two elements equal.
// The maximum possible high score is limited by the remaining elements after we've modified two.
// By changing two elements, we effectively have control over two values.
// To minimize the score, we should aim to make the smallest element and the largest element as close as possible.
// This can be done by either changing the two smallest elements to match the third smallest, or changing the two largest elements to match the third largest.
// Or, we can change one smallest and one largest element to be somewhere in between.
// However, the most effective strategy is to bring the extreme values closer.
// Sorting the array helps us identify the smallest, second smallest, third smallest, largest, second largest, and third largest elements easily.
//
// Let the sorted array be `sortedNums`.
// The initial low score is `sortedNums[1] - sortedNums[0]` and the initial high score is `sortedNums[n-1] - sortedNums[0]`.
// The initial score is `(sortedNums[n-1] - sortedNums[0]) + (sortedNums[1] - sortedNums[0])`.
//
// When we change two elements, we have a few scenarios to consider for minimizing the score:
//
// 1. Change the two smallest elements:
//    - Make `sortedNums[0]` and `sortedNums[1]` equal to `sortedNums[2]`.
//    - The new minimum element becomes `sortedNums[2]`.
//    - The new maximum element is `sortedNums[n-1]`.
//    - The new low score would be 0 (since `sortedNums[2]` would be present twice).
//    - The new high score would be `sortedNums[n-1] - sortedNums[2]`.
//    - Total score: `0 + (sortedNums[n-1] - sortedNums[2])`.
//
// 2. Change the two largest elements:
//    - Make `sortedNums[n-1]` and `sortedNums[n-2]` equal to `sortedNums[n-3]`.
//    - The new minimum element is `sortedNums[0]`.
//    - The new maximum element becomes `sortedNums[n-3]`.
//    - The new low score would be 0 (since `sortedNums[n-3]` would be present twice).
//    - The new high score would be `sortedNums[n-3] - sortedNums[0]`.
//    - Total score: `0 + (sortedNums[n-3] - sortedNums[0])`.
//
// 3. Change one smallest and one largest element:
//    - Make `sortedNums[0]` equal to `sortedNums[1]`.
//    - Make `sortedNums[n-1]` equal to `sortedNums[n-2]`.
//    - The new minimum element is `sortedNums[1]`.
//    - The new maximum element is `sortedNums[n-2]`.
//    - The new low score would be 0.
//    - The new high score would be `sortedNums[n-2] - sortedNums[1]`.
//    - Total score: `0 + (sortedNums[n-2] - sortedNums[1])`.
//
// We need to find the minimum score among these possibilities.
//
// Time complexity: O(N log N) due to sorting.
// Space complexity: O(log N) or O(N) depending on the sorting algorithm used by `Arrays.sort` for primitive arrays in Java (typically O(log N) for quicksort/mergesort space).
class Solution {
    public int minScore(int[] nums) {
        // Get the length of the array
        int n = nums.length;

        // Sort the array to easily access the smallest and largest elements
        // Sorting is crucial for identifying potential candidates for minimization.
        java.util.Arrays.sort(nums);

        // After sorting, the array looks like: nums[0], nums[1], ..., nums[n-2], nums[n-1]
        // We want to minimize the score, which is high_score + low_score.
        // The low_score is the minimum absolute difference between any two elements.
        // The high_score is the maximum absolute difference between any two elements.
        // We can change two elements. To minimize the score, we aim to make the range as small as possible,
        // and ideally make the low_score 0.

        // There are three primary strategies to consider for minimizing the score by changing two elements:

        // Strategy 1: Change the two smallest elements.
        // Make nums[0] and nums[1] equal to nums[2].
        // The new array would effectively start from nums[2] as its minimum.
        // The maximum element remains nums[n-1].
        // The new low score will be 0 (since nums[2] will appear at least twice).
        // The new high score will be nums[n-1] - nums[2].
        // Total score = 0 + (nums[n-1] - nums[2]).
        int score1 = nums[n - 1] - nums[2];

        // Strategy 2: Change the two largest elements.
        // Make nums[n-1] and nums[n-2] equal to nums[n-3].
        // The new array would effectively end at nums[n-3] as its maximum.
        // The minimum element remains nums[0].
        // The new low score will be 0.
        // The new high score will be nums[n-3] - nums[0].
        // Total score = 0 + (nums[n-3] - nums[0]).
        int score2 = nums[n - 3] - nums[0];

        // Strategy 3: Change the smallest and the largest element.
        // Make nums[0] equal to nums[1].
        // Make nums[n-1] equal to nums[n-2].
        // The new minimum element effectively becomes nums[1].
        // The new maximum element effectively becomes nums[n-2].
        // The new low score will be 0.
        // The new high score will be nums[n-2] - nums[1].
        // Total score = 0 + (nums[n-2] - nums[1]).
        int score3 = nums[n - 2] - nums[1];

        // The minimum score will be the minimum of these three strategies.
        // We are guaranteed to have at least 3 elements (constraint: 3 <= nums.length).
        // Thus, indices 0, 1, 2, n-3, n-2, n-1 are always valid.
        return Math.min(score1, Math.min(score2, score3));
    }
}
```