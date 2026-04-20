```cpp
// Problem: Two Furthest Houses With Different Colors
// Link: https://leetcode.com/problems/two-furthest-houses-with-different-colors/
//
// Approach:
// The problem asks for the maximum distance between two houses with different colors.
// To maximize the distance, we should pick houses that are as far apart as possible.
// The furthest possible pair of houses will always involve one of the endpoints (house 0 or house n-1).
//
// We can iterate through the houses from the beginning and find the first house that has a different color than house 0.
// The distance between house 0 and this house is a candidate for the maximum distance.
//
// Similarly, we can iterate through the houses from the end and find the first house that has a different color than house n-1.
// The distance between house n-1 and this house is another candidate for the maximum distance.
//
// The maximum of these two candidate distances will be our answer.
//
// For example, if colors = [1, 1, 1, 6, 1, 1, 1]:
// - Compare with house 0 (color 1):
//   - House 1 (color 1) - same
//   - House 2 (color 1) - same
//   - House 3 (color 6) - different. Distance = abs(0 - 3) = 3. Max distance so far = 3.
// - Compare with house 6 (color 1):
//   - House 5 (color 1) - same
//   - House 4 (color 1) - same
//   - House 3 (color 6) - different. Distance = abs(6 - 3) = 3. Max distance so far = max(3, 3) = 3.
//
// The logic relies on the fact that to maximize `abs(i - j)`, at least one of `i` or `j` should be an extreme index (0 or n-1).
// If house 0 and house n-1 have the same color, we must pick a house with a different color.
// The furthest such house from house 0 would be the first house from the right with a different color.
// The furthest such house from house n-1 would be the first house from the left with a different color.
// If house 0 and house n-1 have different colors, the maximum distance is simply `n-1`.
//
// Time complexity: O(n) because we iterate through the array at most twice.
// Space complexity: O(1) because we only use a few variables to store the maximum distance and indices.

#include <vector>
#include <cmath>
#include <algorithm>

class Solution {
public:
    int maxDistance(std::vector<int>& colors) {
        int n = colors.size();
        int maxDist = 0;

        // Find the furthest house from house 0 with a different color.
        // Iterate from the right to find the first house with a different color than house 0.
        for (int i = n - 1; i >= 0; --i) {
            if (colors[i] != colors[0]) {
                maxDist = std::max(maxDist, std::abs(i - 0));
                break; // Found the furthest, no need to check further from this end
            }
        }

        // Find the furthest house from house n-1 with a different color.
        // Iterate from the left to find the first house with a different color than house n-1.
        for (int i = 0; i < n; ++i) {
            if (colors[i] != colors[n - 1]) {
                maxDist = std::max(maxDist, std::abs(i - (n - 1)));
                break; // Found the furthest, no need to check further from this end
            }
        }

        return maxDist;
    }
};
```