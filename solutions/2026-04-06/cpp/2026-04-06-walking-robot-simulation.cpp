```cpp
/*
Problem Summary:
Simulates a robot's movement on an infinite XY-plane with obstacles and returns the maximum squared Euclidean distance from the origin.

Link:
https://leetcode.com/problems/walking-robot-simulation/

Approach:
The robot starts at (0,0) facing North. We can represent the direction using an integer: 0 for North (+y), 1 for East (+x), 2 for South (-y), and 3 for West (-x).
Turns are handled by updating the direction: -1 (right) increments the direction (modulo 4), and -2 (left) decrements it (modulo 4, handling negative results).
Obstacles are stored in a set for efficient lookups.
When moving, we simulate the movement step by step. For each step, we check if the next position is an obstacle. If it is, we stop moving in that direction and process the next command.
If there's no obstacle, we update the robot's current position.
We keep track of the maximum squared Euclidean distance reached at any point.

Time Complexity:
O(N * M), where N is the number of commands and M is the maximum number of steps in a single command (which is 9). In the worst case, each command could involve M steps, and each step involves a constant-time check against the obstacles set. The size of the obstacles set doesn't directly affect the command processing time for each step, but the number of obstacles can indirectly affect performance if they are clustered. However, for a single step, the lookup is O(1) on average for a hash set. So, it's effectively O(N * 9) which is O(N).

Space Complexity:
O(O), where O is the number of obstacles. This is due to storing the obstacles in a hash set. The robot's position and direction take constant space.
*/

#include <vector>
#include <set>
#include <cmath>
#include <algorithm>

class Solution {
public:
    int robotSim(std::vector<int>& commands, std::vector<std::vector<int>>& obstacles) {
        // Use a set to store obstacles for O(1) average time complexity lookup.
        // We store pairs of integers representing (x, y) coordinates.
        std::set<std::pair<int, int>> obstacleSet;
        for (const auto& obs : obstacles) {
            obstacleSet.insert({obs[0], obs[1]});
        }

        // Robot's current position (x, y).
        int x = 0;
        int y = 0;

        // Robot's current direction.
        // 0: North (+y)
        // 1: East (+x)
        // 2: South (-y)
        // 3: West (-x)
        int direction = 0;

        // Maximum squared Euclidean distance from the origin.
        long long maxDistSq = 0;

        // Define movement vectors for each direction.
        // dx[direction] and dy[direction] give the change in x and y for one step in that direction.
        int dx[] = {0, 1, 0, -1}; // Changes in x for North, East, South, West
        int dy[] = {1, 0, -1, 0}; // Changes in y for North, East, South, West

        // Process each command.
        for (int command : commands) {
            if (command == -1) { // Turn right
                // Increment direction, modulo 4 to wrap around.
                direction = (direction + 1) % 4;
            } else if (command == -2) { // Turn left
                // Decrement direction, modulo 4. Add 4 before modulo to handle negative results correctly.
                direction = (direction - 1 + 4) % 4;
            } else { // Move forward k units
                int steps = command;
                for (int i = 0; i < steps; ++i) {
                    // Calculate the next potential position.
                    int nextX = x + dx[direction];
                    int nextY = y + dy[direction];

                    // Check if the next position contains an obstacle.
                    if (obstacleSet.count({nextX, nextY})) {
                        // If an obstacle is encountered, stop moving in this direction for this command.
                        break;
                    } else {
                        // If no obstacle, update the robot's position.
                        x = nextX;
                        y = nextY;
                        // Update the maximum squared distance.
                        // Use long long to avoid potential overflow when squaring.
                        maxDistSq = std::max(maxDistSq, (long long)x * x + (long long)y * y);
                    }
                }
            }
        }

        // Return the maximum squared Euclidean distance.
        return (int)maxDistSq;
    }
};
```