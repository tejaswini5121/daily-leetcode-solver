// Problem: Minimum Difference Between Highest and Lowest of K Scores
// Link: https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/
// Approach: The problem asks us to find the minimum difference between the highest and lowest scores among any k selected students.
// To minimize this difference, we should select k students whose scores are as close to each other as possible.
// This suggests sorting the array of scores first. Once the array is sorted, any contiguous subarray of length k will represent a set of k scores.
// The difference between the highest and lowest score in such a subarray will be the last element minus the first element.
// We can iterate through all possible contiguous subarrays of length k and calculate this difference, keeping track of the minimum difference found.
// This is a classic sliding window approach on a sorted array. We maintain a window of size k.
//
// Time Complexity: O(N log N) due to sorting the array, where N is the number of students (nums.length).
// The sliding window part takes O(N) time.
// Space Complexity: O(log N) or O(N) depending on the sorting algorithm used by the standard library.
// If in-place sorting is used, it's O(log N) for recursion stack. If a copy is made, it's O(N).

#include <vector>
#include <algorithm>
#include <climits>

class Solution {
public:
    int minimumDifference(std::vector<int>& nums, int k) {
        // If k is 1, the difference is always 0 as we pick only one score.
        if (k == 1) {
            return 0;
        }

        // Sort the array of scores in ascending order.
        // This is crucial because to minimize the difference between the highest and lowest score within a group of k,
        // those k scores should be adjacent in the sorted list.
        std::sort(nums.begin(), nums.end());

        // Initialize the minimum difference to the maximum possible integer value.
        // This variable will store the smallest difference found so far.
        int min_diff = INT_MAX;

        // Iterate through the sorted array using a sliding window of size k.
        // The window starts at index `i` and ends at index `i + k - 1`.
        // The loop runs from `i = 0` up to `nums.size() - k` to ensure the window of size k is always within bounds.
        for (int i = 0; i <= (int)nums.size() - k; ++i) {
            // For the current window, the lowest score is at index `i` (nums[i])
            // and the highest score is at index `i + k - 1` (nums[i + k - 1]).
            // Calculate the difference between the highest and lowest scores in this window.
            int current_diff = nums[i + k - 1] - nums[i];

            // Update `min_diff` if the `current_diff` is smaller than the current `min_diff`.
            min_diff = std::min(min_diff, current_diff);
        }

        // Return the minimum difference found among all possible groups of k scores.
        return min_diff;
    }
};
