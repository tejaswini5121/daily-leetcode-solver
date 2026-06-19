// Problem Summary: Calculates the highest altitude reached during a road trip given altitude gains between points.
// Link: https://leetcode.com/problems/find-the-highest-altitude/
// Approach: We can use a prefix sum approach. We start at altitude 0. We iterate through the `gain` array,
// calculating the current altitude by adding the `gain[i]` to the previous altitude. We keep track of the maximum
// altitude encountered so far.
// Time Complexity: O(n) - We iterate through the `gain` array once.
// Space Complexity: O(1) - We only use a few variables to store the current altitude and the maximum altitude.

/**
 * @param {number[]} gain
 * @return {number}
 */
var largestAltitude = function(gain) {
    // Initialize the current altitude to 0, as the biker starts at point 0 with altitude 0.
    let currentAltitude = 0;
    // Initialize the highest altitude encountered so far to 0.
    let highestAltitude = 0;

    // Iterate through the gain array. Each element represents the net gain in altitude between two points.
    for (let i = 0; i < gain.length; i++) {
        // Update the current altitude by adding the gain from the current point to the next.
        currentAltitude += gain[i];
        // Update the highest altitude if the current altitude is greater than the highest altitude found so far.
        highestAltitude = Math.max(highestAltitude, currentAltitude);
    }

    // Return the highest altitude reached during the trip.
    return highestAltitude;
};
```