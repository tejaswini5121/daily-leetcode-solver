// Problem: Find the Highest Altitude
// Link: https://leetcode.com/problems/find-the-highest-altitude/
//
// Approach:
// The problem asks for the highest altitude reached during a road trip.
// We are given the net gain in altitude between consecutive points.
// The biker starts at altitude 0.
// We can simulate the trip by keeping track of the current altitude and the maximum altitude encountered so far.
// We iterate through the `gain` array. For each `gain[i]`, we add it to the current altitude to get the altitude at point `i+1`.
// We then compare this new current altitude with the maximum altitude seen and update the maximum if necessary.
// The initial maximum altitude is 0, as the biker starts at altitude 0.
//
// Time Complexity: O(n), where n is the length of the `gain` array. We iterate through the array once.
// Space Complexity: O(1), as we only use a few variables to store the current altitude and maximum altitude.
#include <vector>
#include <algorithm>

class Solution {
public:
    int largestAltitude(std::vector<int>& gain) {
        // Initialize current altitude to 0 (starting point)
        int currentAltitude = 0;
        // Initialize maximum altitude to 0 (the starting altitude is the initial maximum)
        int maxAltitude = 0;

        // Iterate through the gain array
        for (int netGain : gain) {
            // Update the current altitude by adding the net gain
            currentAltitude += netGain;
            // Update the maximum altitude if the current altitude is higher
            maxAltitude = std::max(maxAltitude, currentAltitude);
        }

        // Return the highest altitude reached
        return maxAltitude;
    }
};
