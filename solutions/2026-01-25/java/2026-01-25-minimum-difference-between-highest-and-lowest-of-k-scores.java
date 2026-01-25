```java
import java.util.Arrays;

/**
 * Problem: Minimum Difference Between Highest and Lowest of K Scores
 * LeetCode Link: https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/
 *
 * Approach:
 * To minimize the difference between the highest and lowest scores of k students,
 * we should select k scores that are as close to each other as possible.
 * Sorting the array allows us to easily consider contiguous subarrays of size k.
 * Once the array is sorted, we can use a sliding window of size k.
 * For each window, the difference between the highest and lowest score is simply
 * the difference between the last element and the first element of that window.
 * We iterate through all possible windows and keep track of the minimum difference found.
 *
 * Time Complexity:
 * O(N log N) due to the sorting step, where N is the number of students (nums.length).
 * The sliding window part takes O(N) time.
 *
 * Space Complexity:
 * O(1) if the sorting is done in-place. If a copy of the array is made for sorting,
 * then it would be O(N). The problem constraints allow in-place sorting.
 */
class Solution {
    public int minimumDifference(int[] nums, int k) {
        // If k is 1, the difference is always 0 as we pick only one score.
        if (k == 1) {
            return 0;
        }

        // Sort the array of scores in ascending order.
        // This is crucial for the sliding window approach to find contiguous elements.
        Arrays.sort(nums);

        // Initialize the minimum difference to the maximum possible value.
        // This will be updated as we find smaller differences.
        int minDiff = Integer.MAX_VALUE;

        // Use a sliding window of size k.
        // The window starts at index `i` and ends at index `i + k - 1`.
        // The loop runs until `i + k - 1` is within the bounds of the array.
        for (int i = 0; i <= nums.length - k; i++) {
            // For the current window, the lowest score is nums[i] and the highest is nums[i + k - 1].
            // Calculate the difference between the highest and lowest score in this window.
            int currentDiff = nums[i + k - 1] - nums[i];

            // Update minDiff if the current difference is smaller.
            minDiff = Math.min(minDiff, currentDiff);
        }

        // Return the minimum difference found across all windows.
        return minDiff;
    }
}
```