/**
 * @summary Calculates the minimum time to visit all points in order on a 2D plane.
 * @link https://leetcode.com/problems/minimum-time-visiting-all-points/
 *
 * @approach
 * The problem asks for the minimum time to visit a sequence of points.
 * The key observation is that a diagonal move (one unit horizontally and one unit vertically simultaneously) takes 1 second.
 * This is equivalent to moving one unit in both x and y directions.
 * If we need to move from (x1, y1) to (x2, y2), the difference in x is dx = |x2 - x1| and the difference in y is dy = |y2 - y1|.
 * We can make min(dx, dy) diagonal moves. Each diagonal move covers one unit in both x and y.
 * After these diagonal moves, we will have covered min(dx, dy) units in x and min(dx, dy) units in y.
 * The remaining distance will be max(dx, dy) - min(dx, dy) = |dx - dy|.
 * This remaining distance must be covered by purely horizontal or vertical moves, each taking 1 second per unit.
 * Therefore, the time taken to go from point A to point B is max(dx, dy).
 * To find the total minimum time, we iterate through the points array, calculating the time to move from points[i] to points[i+1] and summing these times.
 *
 * @timeComplexity O(n) where n is the number of points. We iterate through the array once.
 * @spaceComplexity O(1) as we only use a few variables to store intermediate calculations.
 */
var minTimeToVisitAllPoints = function(points) {
    // Initialize total time to 0
    let totalTime = 0;

    // Iterate through the points array from the first point up to the second to last point
    // We are calculating the time to move from points[i] to points[i+1]
    for (let i = 0; i < points.length - 1; i++) {
        // Get the current point coordinates
        const x1 = points[i][0];
        const y1 = points[i][1];

        // Get the next point coordinates
        const x2 = points[i + 1][0];
        const y2 = points[i + 1][1];

        // Calculate the absolute difference in x-coordinates
        const deltaX = Math.abs(x2 - x1);
        // Calculate the absolute difference in y-coordinates
        const deltaY = Math.abs(y2 - y1);

        // The minimum time to travel between two points is the maximum of the absolute differences in their x and y coordinates.
        // This is because diagonal moves cover one unit in both x and y simultaneously, and we can make as many diagonal moves as the minimum of deltaX and deltaY.
        // The remaining distance will be covered by horizontal or vertical moves.
        const timeBetweenPoints = Math.max(deltaX, deltaY);

        // Add the time taken to visit the next point to the total time
        totalTime += timeBetweenPoints;
    }

    // Return the total minimum time to visit all points
    return totalTime;
};
```