```javascript
/**
 * @fileoverview Solves the Robot Collisions problem.
 * Problem: https://leetcode.com/problems/robot-collisions/
 * Summary: Determines the final health of robots after collisions, where robots with lower health are destroyed,
 * and the survivor's health decreases by one. If health is equal, both are destroyed.
 */

/**
 * @param {number[]} positions
 * @param {number[]} healths
 * @param {string} directions
 * @return {number[]}
 */
var survivedRobotsHealths = function(positions, healths, directions) {
    // Approach:
    // 1. Combine robot information (position, health, direction, original index) into a single array of objects.
    // 2. Sort robots by their initial positions. This is crucial because collisions only happen between robots
    //    moving towards each other. Robots moving in the same direction or away from each other will never collide.
    // 3. Iterate through the sorted robots. Use a stack to keep track of robots moving to the right ('R') that
    //    have not yet collided.
    // 4. When a robot moving left ('L') is encountered:
    //    a. It will potentially collide with robots in the stack (which are moving right and are to its left).
    //    b. While the stack is not empty and the current robot's health is greater than the top of the stack's health:
    //       - The robot at the top of the stack is destroyed (popped from stack).
    //       - The current robot's health decreases by 1.
    //    c. After the loop, if the stack is empty, the current robot also gets destroyed (it collided with all robots
    //       to its left that were moving right, or there were none).
    //    d. If the stack is not empty, the robot at the top of the stack has higher or equal health. The current robot
    //       collides with it. The current robot is destroyed, and the health of the robot at the top of the stack
    //       decreases by 1.
    // 5. If a robot moving right ('R') is encountered, push it onto the stack. It might be collided with later by
    //    robots moving left.
    // 6. After iterating through all sorted robots, the stack will contain surviving robots that were moving right.
    //    Any robots that were previously processed and survived (e.g., those moving left that destroyed others)
    //    need to be accounted for. A separate list or map can store these. A more efficient way is to process all
    //    robots and store their final states.
    //
    // Refined Approach using a stack for 'R' robots and a separate handling for 'L' robots:
    // 1. Create an array of robot objects, storing original index, position, health, and direction.
    // 2. Sort this array by position.
    // 3. Initialize an empty stack `rightMovingRobotsStack` to store robots moving right.
    // 4. Initialize a way to store the final health of all robots, perhaps using a map or by directly modifying
    //    the initial `healths` array using original indices. Let's use a map keyed by original index.
    // 5. Iterate through the sorted robots:
    //    a. If `robot.direction === 'R'`: Push the robot onto `rightMovingRobotsStack`.
    //    b. If `robot.direction === 'L'`:
    //       - `currentHealth = robot.health`
    //       - While `rightMovingRobotsStack` is not empty AND `currentHealth > 0`:
    //         - `rightRobot = rightMovingRobotsStack.pop()`
    //         - If `currentHealth === rightRobot.health`:
    //           - `currentHealth = 0` // Current robot is destroyed
    //           - Mark `rightRobot` as destroyed (e.g., set its health to 0 or remove from consideration later).
    //         - Else if `currentHealth > rightRobot.health`:
    //           - `currentHealth--` // Current robot survives this collision
    //           - Mark `rightRobot` as destroyed.
    //         - Else (`currentHealth < rightRobot.health`):
    //           - `rightRobot.health--` // Right robot survives this collision
    //           - `currentHealth = 0` // Current robot is destroyed
    //           - Push `rightRobot` back onto the stack (it survived and is still moving right).
    //       - If `currentHealth > 0`: This left-moving robot survived all collisions with right-moving robots to its left.
    //         Store its final `currentHealth` associated with its original index.
    // 6. After iterating through all sorted robots, the `rightMovingRobotsStack` contains robots that survived
    //    and are still moving right. Add their final healths to the result based on their original indices.
    // 7. Construct the final result array by iterating through the original `n` robots and picking their surviving
    //    health from the stored results, maintaining the original order.

    // Let's simplify: we can use a stack to process collisions. Robots moving 'R' are pushed.
    // When an 'L' robot comes, it tries to collide with robots on the stack.
    // We need to store results by original index.

    const n = positions.length;
    const robots = [];

    // Combine robot data and store original index
    for (let i = 0; i < n; i++) {
        robots.push({
            id: i, // Original index
            pos: positions[i],
            health: healths[i],
            dir: directions[i]
        });
    }

    // Sort robots by position
    robots.sort((a, b) => a.pos - b.pos);

    // Stack to store robots moving to the right that haven't collided yet.
    // Store the robot objects themselves.
    const stack = [];
    // Array to store the final health of robots, indexed by their original `id`.
    // Initialize with 0, which will indicate a destroyed robot.
    const finalHealths = new Array(n).fill(0);

    for (const robot of robots) {
        if (robot.dir === 'R') {
            // If robot moves right, push it onto the stack.
            stack.push(robot);
        } else { // robot.dir === 'L'
            // If robot moves left, it may collide with robots on the stack.
            let currentRobotHealth = robot.health;

            while (stack.length > 0 && currentRobotHealth > 0) {
                const rightRobot = stack.pop(); // Get the rightmost robot moving right

                if (currentRobotHealth === rightRobot.health) {
                    // Both robots have equal health, both are destroyed.
                    currentRobotHealth = 0; // Current robot is destroyed
                    // rightRobot is already popped, so it's effectively destroyed too.
                    // We don't update finalHealths for rightRobot here because it's removed.
                    break; // Current robot is destroyed, no more collisions for it.
                } else if (currentRobotHealth > rightRobot.health) {
                    // Current robot has more health. It destroys the right robot.
                    currentRobotHealth--; // Current robot loses 1 health
                    // rightRobot is destroyed (already popped).
                } else { // currentRobotHealth < rightRobot.health
                    // Right robot has more health. It destroys the current robot.
                    rightRobot.health--; // Right robot loses 1 health
                    currentRobotHealth = 0; // Current robot is destroyed
                    stack.push(rightRobot); // Push the surviving right robot back onto the stack.
                    break; // Current robot is destroyed, no more collisions for it.
                }
            }

            // If currentRobotHealth is still greater than 0 after collisions,
            // it means this left-moving robot survived.
            if (currentRobotHealth > 0) {
                finalHealths[robot.id] = currentRobotHealth;
            }
        }
    }

    // After processing all robots, any robots remaining in the stack are survivors moving right.
    // Update their final healths.
    while (stack.length > 0) {
        const survivingRightRobot = stack.pop();
        finalHealths[survivingRightRobot.id] = survivingRightRobot.health;
    }

    // Filter out robots that have health 0 (destroyed) and return the healths in original order.
    const result = [];
    for (let i = 0; i < n; i++) {
        if (finalHealths[i] > 0) {
            result.push(finalHealths[i]);
        }
    }

    return result;

    // Time Complexity Analysis:
    // 1. Creating the `robots` array: O(n)
    // 2. Sorting the `robots` array: O(n log n)
    // 3. Iterating through sorted robots and stack operations: Each robot is pushed onto the stack at most once
    //    and popped at most once. Collisions involve popping and potentially pushing back. In the worst case,
    //    each robot is involved in a constant number of stack operations and health updates across all iterations.
    //    Therefore, this part is O(n).
    // 4. Constructing the final result: O(n)
    // Overall Time Complexity: O(n log n) due to sorting.

    // Space Complexity Analysis:
    // 1. `robots` array: O(n) to store robot objects.
    // 2. `stack`: In the worst case (all robots moving right), the stack can hold up to n robots. O(n).
    // 3. `finalHealths` array: O(n) to store the health of each robot by its original index.
    // Overall Space Complexity: O(n).
};
```