```cpp
// Problem: Furthest Point From Origin
// Link: https://leetcode.com/problems/furthest-point-from-origin/
// Approach: To maximize the distance from the origin, we should try to move as far as possible in one direction.
// For 'L' moves, we can always move left. For 'R' moves, we can always move right.
// For '_' moves, we have a choice: we can either move left or move right.
// To reach the furthest point, we should make all '_' moves in the direction that further extends our current position.
// Therefore, we can count the number of 'L's, 'R's, and '_'s.
// The maximum distance to the left will be the count of 'L's plus the count of '_'s.
// The maximum distance to the right will be the count of 'R's plus the count of '_'s.
// The final answer is the maximum of these two distances.
// Time complexity: O(n), where n is the length of the moves string, because we iterate through the string once.
// Space complexity: O(1), as we only use a few variables to store counts.

#include <string>
#include <algorithm>
#include <vector>

class Solution {
public:
    int furthestDistanceFromOrigin(std::string moves) {
        int left_moves = 0;   // Counts 'L' moves
        int right_moves = 0;  // Counts 'R' moves
        int underscores = 0;  // Counts '_' moves

        // Iterate through the moves string to count each type of character
        for (char move : moves) {
            if (move == 'L') {
                left_moves++;
            } else if (move == 'R') {
                right_moves++;
            } else { // move == '_'
                underscores++;
            }
        }

        // To get the furthest distance to the left, we can treat all '_' as 'L' moves.
        // So, total left distance = left_moves + underscores
        int max_left_distance = left_moves + underscores;

        // To get the furthest distance to the right, we can treat all '_' as 'R' moves.
        // So, total right distance = right_moves + underscores
        int max_right_distance = right_moves + underscores;

        // The furthest point from the origin is the maximum of these two distances.
        // We return the absolute value of the furthest position.
        return std::max(max_left_distance, max_right_distance);
    }
};
```