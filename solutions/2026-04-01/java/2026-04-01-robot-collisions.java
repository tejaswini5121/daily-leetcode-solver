```java
// Problem: Robot Collisions
// Link: https://leetcode.com/problems/robot-collisions/
//
// Approach:
// The core idea is to simulate the collisions. Since robots move simultaneously and at the same speed,
// a collision only happens between robots moving towards each other. A robot moving 'R' and
// a robot moving 'L' will collide if the 'R' robot is to the left of the 'L' robot.
//
// To efficiently handle these collisions, we can sort the robots by their initial positions.
// We then iterate through the sorted robots. We use a stack to keep track of robots moving 'R'
// that haven't collided yet.
//
// When we encounter a robot moving 'R', we push it onto the stack.
// When we encounter a robot moving 'L':
// 1. If the stack is empty, this 'L' robot will not collide with any previous 'R' robots, so it survives.
// 2. If the stack is not empty, it means there's at least one 'R' robot to its left. We pop the top
//    'R' robot from the stack and check for collision:
//    a. If the 'R' robot's health is greater than the current 'L' robot's health, the 'L' robot is destroyed.
//       The 'R' robot's health decreases by 1. We then re-evaluate the current 'L' robot against the
//       next 'R' robot on the stack (if any), as it might still be heading towards another 'R' robot.
//    b. If the 'R' robot's health is less than the current 'L' robot's health, the 'R' robot is destroyed.
//       The 'L' robot's health decreases by 1. We continue processing the current 'L' robot against the
//       next 'R' robot on the stack.
//    c. If both robots have equal health, both are destroyed. The current 'L' robot is also destroyed
//       and we move to the next robot in the input.
//
// After iterating through all robots, any robots remaining in the stack are 'R' robots that survived.
// Any 'L' robots that survived are those that didn't collide or whose collisions resulted in their survival.
//
// To return the results in the original order, we store the initial index with each robot's data.
// After processing, we collect the surviving robots and then sort them by their original index to
// construct the final result array.
//
// Time Complexity:
// - Sorting the robots by position takes O(N log N) time, where N is the number of robots.
// - Iterating through the sorted robots and performing stack operations takes O(N) time in total,
//   as each robot is pushed and popped at most once.
// - Collecting and sorting the final results by original index takes O(N log N) time.
// Therefore, the overall time complexity is O(N log N).
//
// Space Complexity:
// - We use a stack to store robots, which can hold up to O(N) robots in the worst case.
// - We create a custom class or array of objects to store robot information (position, health, direction, original index),
//   which takes O(N) space.
// - The final result array takes O(N) space.
// Therefore, the overall space complexity is O(N).
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Stack;

class RobotCollisions {

    // Helper class to store robot information along with its original index.
    private static class Robot {
        int id; // Original index of the robot
        int position;
        int health;
        char direction;

        Robot(int id, int position, int health, char direction) {
            this.id = id;
            this.position = position;
            this.health = health;
            this.direction = direction;
        }
    }

    public int[] survivedRobotsHealthArray(int[] positions, int[] healths, String directions) {
        int n = positions.length;
        // Create a list of Robot objects to store all robot data.
        List<Robot> robots = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            robots.add(new Robot(i, positions[i], healths[i], directions.charAt(i)));
        }

        // Sort robots based on their initial positions. This is crucial for simulating collisions correctly.
        robots.sort(Comparator.comparingInt(r -> r.position));

        // Stack to store robots moving 'R' that are candidates for collision.
        Stack<Robot> stack = new Stack<>();
        // List to store robots that survive.
        List<Robot> survivors = new ArrayList<>();

        // Iterate through the sorted robots.
        for (Robot currentRobot : robots) {
            // If the current robot is moving 'R', push it onto the stack.
            if (currentRobot.direction == 'R') {
                stack.push(currentRobot);
            } else { // If the current robot is moving 'L'
                // Process collisions with 'R' robots on the stack.
                while (!stack.isEmpty() && currentRobot.health > 0) {
                    Robot rightRobot = stack.pop(); // Get the right-moving robot from the stack.

                    // Case 1: 'R' robot has less health, it's destroyed.
                    if (rightRobot.health < currentRobot.health) {
                        rightRobot.health = 0; // Mark for removal
                        currentRobot.health--; // Decrease health of the left-moving robot.
                    }
                    // Case 2: 'R' robot has equal health, both are destroyed.
                    else if (rightRobot.health == currentRobot.health) {
                        rightRobot.health = 0; // Mark for removal
                        currentRobot.health = 0; // Mark for removal
                        break; // Current 'L' robot is also destroyed, stop processing it.
                    }
                    // Case 3: 'R' robot has more health, 'L' robot is destroyed.
                    else { // rightRobot.health > currentRobot.health
                        rightRobot.health--; // Decrease health of the right-moving robot.
                        currentRobot.health = 0; // Mark for removal
                        stack.push(rightRobot); // The surviving 'R' robot goes back to the stack.
                        break; // Current 'L' robot is destroyed, stop processing it.
                    }
                }
                // If the current 'L' robot survived all potential collisions with 'R' robots on the stack,
                // and its health is still positive, it's a survivor.
                if (currentRobot.health > 0) {
                    survivors.add(currentRobot);
                }
            }
        }

        // Add any remaining 'R' robots from the stack to the survivors list.
        while (!stack.isEmpty()) {
            survivors.add(stack.pop());
        }

        // Sort the survivors by their original 'id' to return them in the input order.
        survivors.sort(Comparator.comparingInt(r -> r.id));

        // Create the result array with the health of the surviving robots.
        int[] result = new int[survivors.size()];
        for (int i = 0; i < survivors.size(); i++) {
            result[i] = survivors.get(i).health;
        }

        return result;
    }
}
```