```python
# Summary: Calculates the minimum time to visit a sequence of 2D points.
# Link: https://leetcode.com/problems/minimum-time-visiting-all-points/
#
# Approach:
# To minimize the time between two points (x1, y1) and (x2, y2), we should prioritize diagonal movements.
# A diagonal move covers one unit in the x-direction and one unit in the y-direction simultaneously.
# The number of diagonal moves we can make is limited by the minimum of the absolute difference in x-coordinates
# and the absolute difference in y-coordinates.
# After making as many diagonal moves as possible, the remaining distance in either the x or y direction
# will be covered by horizontal or vertical moves.
# Therefore, the time taken between two points is max(abs(x2 - x1), abs(y2 - y1)).
# We iterate through the points array, calculating the time between each consecutive pair and summing them up.
#
# Time Complexity: O(n), where n is the number of points. We iterate through the array once.
# Space Complexity: O(1), as we only use a few variables to store the total time and current/previous coordinates.

class Solution:
    def minTimeToVisitAllPoints(self, points: list[list[int]]) -> int:
        # Initialize total time to 0
        total_time = 0

        # Iterate through the points starting from the second point
        # to calculate the time from the previous point to the current one.
        for i in range(1, len(points)):
            # Get the coordinates of the current point and the previous point
            x1, y1 = points[i-1]
            x2, y2 = points[i]

            # Calculate the absolute difference in x and y coordinates
            dx = abs(x2 - x1)
            dy = abs(y2 - y1)

            # The minimum time to travel between two points is the maximum of the
            # absolute differences in their x and y coordinates. This is because
            # diagonal moves (which cover 1 unit in x and 1 unit in y per second)
            # are the most efficient. We can make min(dx, dy) diagonal moves.
            # The remaining distance (max(dx, dy) - min(dx, dy)) will be covered
            # by horizontal or vertical moves, each taking 1 second per unit.
            # So, the total time is min(dx, dy) (diagonal) + (max(dx, dy) - min(dx, dy)) (straight)
            # which simplifies to max(dx, dy).
            time_between_points = max(dx, dy)

            # Add the time taken to visit the current point from the previous one
            total_time += time_between_points

        # Return the total minimum time to visit all points
        return total_time

```