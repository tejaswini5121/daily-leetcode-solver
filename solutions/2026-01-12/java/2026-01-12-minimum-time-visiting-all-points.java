// Problem: Minimum Time Visiting All Points
// Link: https://leetcode.com/problems/minimum-time-visiting-all-points/
//
// Approach:
// To minimize the time between two points [x1, y1] and [x2, y2], we can leverage
// the diagonal move. A diagonal move covers one unit horizontally and one unit
// vertically simultaneously in 1 second.
//
// The number of diagonal moves we can make is limited by the minimum of the
// absolute difference in x-coordinates and the absolute difference in y-coordinates.
// Let dx = abs(x2 - x1) and dy = abs(y2 - y1). The number of diagonal moves
// will be min(dx, dy).
//
// After making min(dx, dy) diagonal moves, we will have covered min(dx, dy)
// distance in both the x and y directions. The remaining distance to cover will be
// abs(dx - dy) in either the x or y direction (whichever was larger).
// This remaining distance must be covered by horizontal or vertical moves,
// each taking 1 second per unit.
//
// Therefore, the total time to travel from [x1, y1] to [x2, y2] is:
// min(dx, dy) (for diagonal moves) + abs(dx - dy) (for remaining straight moves).
// This simplifies to max(dx, dy). This is because if dx >= dy, we make dy diagonal moves
// and (dx - dy) straight moves, totaling dy + (dx - dy) = dx = max(dx, dy).
// If dy > dx, we make dx diagonal moves and (dy - dx) straight moves, totaling
// dx + (dy - dx) = dy = max(dx, dy).
//
// We iterate through the points array, calculating the time to move from
// points[i] to points[i+1] for all i from 0 to n-2, and sum these times up.
//
// Time Complexity: O(n)
// We iterate through the array of points once. For each pair of adjacent points,
// we perform constant time calculations (absolute difference and maximum).
//
// Space Complexity: O(1)
// We only use a few variables to store the total time and intermediate calculations.
// The space used does not depend on the input size.
class Solution {
    public int minTimeToVisitAllPoints(int[][] points) {
        // Initialize total time to 0.
        int totalTime = 0;

        // Iterate through the points array from the first point up to the second to last point.
        // We calculate the time needed to travel from points[i] to points[i+1].
        for (int i = 0; i < points.length - 1; i++) {
            // Get the coordinates of the current point.
            int x1 = points[i][0];
            int y1 = points[i][1];

            // Get the coordinates of the next point.
            int x2 = points[i + 1][0];
            int y2 = points[i + 1][1];

            // Calculate the absolute difference in x-coordinates.
            int deltaX = Math.abs(x2 - x1);
            // Calculate the absolute difference in y-coordinates.
            int deltaY = Math.abs(y2 - y1);

            // The minimum time to travel between two points is determined by the
            // larger of the two absolute differences (deltaX or deltaY).
            // This is because we can make diagonal moves to cover min(deltaX, deltaY)
            // distance in both axes simultaneously. The remaining distance
            // abs(deltaX - deltaY) must be covered by straight horizontal or vertical moves.
            // The total time is min(deltaX, deltaY) + abs(deltaX - deltaY), which simplifies to max(deltaX, deltaY).
            int timeToNextPoint = Math.max(deltaX, deltaY);

            // Add the time taken to reach the next point to the total time.
            totalTime += timeToNextPoint;
        }

        // Return the accumulated total time required to visit all points in order.
        return totalTime;
    }
}
