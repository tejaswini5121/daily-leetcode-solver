// Problem: Minimum Distance to the Target Element
// Link: https://leetcode.com/problems/minimum-distance-to-the-target-element/
//
// Approach:
// The problem asks us to find the minimum absolute difference between the index of the `start` element
// and the index of any element equal to `target`. Since it's guaranteed that `target` exists in `nums`,
// we can iterate through the entire array `nums`. For each element `nums[i]`, we check if it equals `target`.
// If it does, we calculate the absolute difference `abs(i - start)` and keep track of the minimum
// difference found so far. We initialize the minimum difference to a large value (like `INT_MAX`)
// to ensure the first calculated difference becomes the initial minimum.
//
// Time Complexity:
// O(n), where n is the length of the `nums` array. We iterate through the array once.
//
// Space Complexity:
// O(1), as we only use a few variables to store the minimum distance and the loop index.
//
#include <algorithm>
#include <cmath>
#include <limits>
#include <vector>

class Solution {
public:
    int getMinDistance(std::vector<int>& nums, int target, int start) {
        // Initialize the minimum distance to a very large value.
        // This ensures that the first valid distance found will be smaller.
        int min_dist = std::numeric_limits<int>::max();

        // Iterate through the array to find all occurrences of the target.
        for (int i = 0; i < nums.size(); ++i) {
            // Check if the current element is equal to the target.
            if (nums[i] == target) {
                // Calculate the absolute difference between the current index and the start index.
                int current_dist = std::abs(i - start);
                // Update min_dist if the current distance is smaller.
                min_dist = std::min(min_dist, current_dist);
            }
        }

        // Return the minimum distance found.
        return min_dist;
    }
};
