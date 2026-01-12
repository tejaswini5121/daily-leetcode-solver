```cpp
/*
Problem Summary:
Calculates the minimum time to visit a sequence of 2D points.
Movement options include horizontal, vertical, or diagonal steps, each taking 1 second.

Link: https://leetcode.com/problems/minimum-time-visiting-all-points/

Approach:
The key observation is that the fastest way to move between two points [x1, y1] and [x2, y2]
is to maximize diagonal movements. A diagonal move covers one unit in both x and y directions
simultaneously. The number of diagonal moves possible is limited by the smaller of the absolute
differences in x and y coordinates: min(abs(x2 - x1), abs(y2 - y1)).
After exhausting all possible diagonal moves, the remaining difference in either x or y
must be covered by purely horizontal or vertical moves. The number of such moves will be
abs(abs(x2 - x1) - abs(y2 - y1)).
Therefore, the total time to move between two points is max(abs(x2 - x1), abs(y2 - y1)).
This is also known as the Chebyshev distance or maximum coordinate difference.
We iterate through the points array, calculating the time required to move from each point
to the next point in the sequence and summing these times up.

Time Complexity:
O(n), where n is the number of points. We iterate through the array once, and for each pair of adjacent points,
we perform a constant number of arithmetic operations.

Space Complexity:
O(1). We only use a few variables to store the total time and coordinate differences,
which does not depend on the input size.
*/

#include <vector>
#include <cmath>
#include <algorithm>

class Solution {
public:
    int minTimeToVisitAllPoints(std::vector<std::vector<int>>& points) {
        // Initialize total time to 0.
        int totalTime = 0;

        // Iterate through the points array, starting from the second point.
        // We calculate the time required to move from points[i-1] to points[i].
        for (size_t i = 1; i < points.size(); ++i) {
            // Get the coordinates of the current point.
            int x1 = points[i - 1][0];
            int y1 = points[i - 1][1];

            // Get the coordinates of the next point.
            int x2 = points[i][0];
            int y2 = points[i][1];

            // Calculate the absolute difference in x coordinates.
            int dx = std::abs(x2 - x1);
            // Calculate the absolute difference in y coordinates.
            int dy = std::abs(y2 - y1);

            // The minimum time to move between two points is the maximum of the
            // absolute differences in their x and y coordinates. This is because
            // we can make min(dx, dy) diagonal moves (each taking 1 second and
            // covering 1 unit in both x and y), and the remaining difference
            // (abs(dx - dy)) will be covered by purely horizontal or vertical moves.
            // The total time for this segment is therefore max(dx, dy).
            totalTime += std::max(dx, dy);
        }

        // Return the accumulated total time.
        return totalTime;
    }
};
```