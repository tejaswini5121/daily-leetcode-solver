```python
# Problem: Find the Highest Altitude
# Link: https://leetcode.com/problems/find-the-highest-altitude/
#
# Approach:
# We can solve this problem by iterating through the `gain` array and keeping track
# of the current altitude. The biker starts at altitude 0. For each element in `gain`,
# we add it to the current altitude to get the altitude at the next point.
# We also maintain a variable to store the maximum altitude encountered so far.
#
# Time Complexity:
# O(n), where n is the length of the `gain` array. We iterate through the array once.
#
# Space Complexity:
# O(1), as we only use a few extra variables to store the current and maximum altitude.

class Solution:
    def largestAltitude(self, gain: list[int]) -> int:
        # Initialize the current altitude to 0, as the biker starts at altitude 0.
        current_altitude = 0
        # Initialize the maximum altitude to 0, as the starting altitude is 0.
        max_altitude = 0

        # Iterate through each gain in the gain array.
        for g in gain:
            # Update the current altitude by adding the net gain.
            current_altitude += g
            # Update the maximum altitude if the current altitude is higher.
            max_altitude = max(max_altitude, current_altitude)

        # Return the highest altitude encountered during the trip.
        return max_altitude

```