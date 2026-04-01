```cpp
// Summary: Simulate robot collisions based on position, health, and direction.
// Problem Link: https://leetcode.com/problems/robot-collisions/
// Approach:
// 1. Combine robot data (original index, position, health, direction) into a structure.
// 2. Sort robots based on their initial positions. This ensures we process robots
//    from left to right, which is crucial for simulating collisions correctly.
// 3. Use a stack to keep track of robots moving to the right that haven't collided yet.
// 4. Iterate through the sorted robots:
//    - If a robot moves left ('L'):
//        - While the stack is not empty and the robot at the top of the stack moves right ('R')
//          and the current robot has health to potentially collide:
//            - If current robot's health > stack top's health:
//                - Decrease stack top's health by 1.
//                - Remove stack top (it's destroyed).
//                - Decrease current robot's health by 1.
//            - If current robot's health < stack top's health:
//                - Decrease stack top's health by 1.
//                - Current robot is destroyed. Break the inner loop.
//            - If current robot's health == stack top's health:
//                - Remove stack top.
//                - Current robot is destroyed. Break the inner loop.
//        - If the current robot survived all potential collisions with right-moving robots
//          (i.e., the inner loop finished and the robot wasn't destroyed), push it onto
//          the stack (it will continue moving left).
//    - If a robot moves right ('R'):
//        - Push it onto the stack. These robots are potential collision partners for
//          left-moving robots encountered later.
// 5. After processing all robots, the stack will contain the surviving robots.
//    The robots on the stack are not necessarily in their original input order.
// 6. Reconstruct the final result by creating a map from original index to health
//    for all surviving robots.
// 7. Iterate through the original input arrays and build the final result array
//    in the specified original order.
// Time Complexity: O(N log N) due to sorting. The stack operations and collision
//                  resolution take O(N) in total because each robot is pushed and
//                  popped at most once.
// Space Complexity: O(N) for storing robot data, the stack, and the result map.
#include <vector>
#include <string>
#include <algorithm>
#include <stack>
#include <map>

struct Robot {
    int id; // Original index
    int position;
    int health;
    char direction;
};

bool compareRobots(const Robot& a, const Robot& b) {
    return a.position < b.position;
}

class Solution {
public:
    std::vector<int> survivedRobotsHealthArray(std::vector<int>& positions, std::vector<int>& healths, std::string directions) {
        int n = positions.size();
        std::vector<Robot> robots(n);
        for (int i = 0; i < n; ++i) {
            robots[i] = {i, positions[i], healths[i], directions[i]};
        }

        // Sort robots by their initial positions
        std::sort(robots.begin(), robots.end(), compareRobots);

        std::stack<Robot> st; // Stores robots moving to the right that haven't collided

        for (const auto& current_robot : robots) {
            Robot r = current_robot; // Make a mutable copy to modify health
            
            // If robot moves left, it might collide with robots on the stack (moving right)
            if (r.direction == 'L') {
                while (!st.empty() && st.top().direction == 'R') {
                    Robot top_robot = st.top();
                    st.pop();

                    if (r.health > top_robot.health) {
                        // Current robot wins, top robot is destroyed
                        r.health--;
                        top_robot.health = 0; // Mark as destroyed
                    } else if (r.health < top_robot.health) {
                        // Top robot wins, current robot is destroyed
                        top_robot.health--;
                        r.health = 0; // Mark as destroyed
                        st.push(top_robot); // Put the surviving top robot back
                        break; // Current robot is destroyed, stop collisions
                    } else {
                        // Both robots have same health, both destroyed
                        r.health = 0; // Mark as destroyed
                        top_robot.health = 0; // Mark as destroyed
                        // Neither is pushed back onto the stack
                        break; // Current robot is destroyed, stop collisions
                    }
                }
                // If current robot survived all collisions and is still moving left
                if (r.health > 0) {
                    st.push(r);
                }
            } else { // Robot moves right, add to stack to be potentially hit by a left-mover
                st.push(r);
            }
        }

        // Collect survivors and their final health, keyed by original ID
        std::map<int, int> survivors;
        while (!st.empty()) {
            survivors[st.top().id] = st.top().health;
            st.pop();
        }

        // Construct the result array in the original order
        std::vector<int> result;
        for (int i = 0; i < n; ++i) {
            if (survivors.count(i)) { // Check if robot with original ID i survived
                result.push_back(survivors[i]);
            }
        }

        return result;
    }
};
```