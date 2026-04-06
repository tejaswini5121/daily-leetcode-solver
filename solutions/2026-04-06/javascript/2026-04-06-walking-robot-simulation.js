/**
 * @param {number[]} commands
 * @param {number[][]} obstacles
 * @return {number}
 */
// Problem: Walking Robot Simulation
// Summary: Simulate a robot's movement on an infinite grid with obstacles, returning the maximum squared distance from the origin.
// Link: https://leetcode.com/problems/walking-robot-simulation/
// Approach:
// The robot starts at (0, 0) facing North. We can represent directions as changes in x and y coordinates.
// North: (0, 1), East: (1, 0), South: (0, -1), West: (-1, 0).
// We can use an array `dirs` to store these directions, where `dirs[0]` is North, `dirs[1]` is East, `dirs[2]` is South, and `dirs[3]` is West.
// The current direction index will be `dirIndex`. Turning left decreases `dirIndex` (modulo 4, handling negative results), and turning right increases it (modulo 4).
// Obstacles are stored in a Set for O(1) average time lookup to check for collisions. The coordinates are combined into a string "x,y" to be stored in the Set.
// We iterate through the `commands`.
// If the command is -2, we turn left.
// If the command is -1, we turn right.
// If the command is a positive integer `k`, we attempt to move forward `k` steps. For each step, we calculate the next position and check if it's an obstacle.
// If the next position is an obstacle, the robot stops at the current position for this move and breaks the inner loop for this command.
// If the next position is not an obstacle, we update the robot's current position.
// After each move (or attempted move blocked by an obstacle), we calculate the squared Euclidean distance from the origin (x*x + y*y) and update the `maxDist` if it's larger.
// Finally, we return `maxDist`.
// Time Complexity: O(N * K), where N is the number of commands and K is the maximum number of steps in a single command (which is 9). In the worst case, we might iterate through all commands, and for each move command, we iterate up to 9 times. The obstacle check is O(1) on average due to using a Set.
// Space Complexity: O(M), where M is the number of obstacles. This is for storing the obstacles in a Set for quick lookups.
const robotSim = (commands, obstacles) => {
    // Define the directions: North, East, South, West.
    // Each element is a [dx, dy] pair representing the change in coordinates.
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    // Initialize the robot's current position (x, y) to (0, 0).
    let x = 0;
    let y = 0;
    // Initialize the current direction index. 0 for North.
    let dirIndex = 0;
    // Initialize the maximum squared Euclidean distance from the origin.
    let maxDist = 0;

    // Create a Set to store obstacle locations for efficient lookups.
    // Obstacles are stored as strings "x,y" for easy comparison.
    const obstacleSet = new Set();
    for (const obs of obstacles) {
        obstacleSet.add(`${obs[0]},${obs[1]}`);
    }

    // Process each command in the commands array.
    for (const command of commands) {
        // If the command is -2, turn left 90 degrees.
        if (command === -2) {
            // Decrement dirIndex and wrap around using modulo 4.
            // Adding 4 before modulo handles negative results correctly.
            dirIndex = (dirIndex - 1 + 4) % 4;
        }
        // If the command is -1, turn right 90 degrees.
        else if (command === -1) {
            // Increment dirIndex and wrap around using modulo 4.
            dirIndex = (dirIndex + 1) % 4;
        }
        // If the command is a positive integer, move forward k units.
        else {
            // The command value is the number of steps 'k'.
            const k = command;
            // Get the current direction vector [dx, dy].
            const [dx, dy] = dirs[dirIndex];

            // Attempt to move k steps forward.
            for (let i = 0; i < k; i++) {
                // Calculate the next potential position.
                const nextX = x + dx;
                const nextY = y + dy;

                // Check if the next position is an obstacle.
                if (obstacleSet.has(`${nextX},${nextY}`)) {
                    // If it's an obstacle, the robot stays at the current position.
                    // Break out of the inner loop for this command as further movement is blocked by this obstacle.
                    break;
                } else {
                    // If there's no obstacle, update the robot's current position.
                    x = nextX;
                    y = nextY;
                    // Update the maximum squared distance from the origin.
                    // The squared distance is x*x + y*y.
                    maxDist = Math.max(maxDist, x * x + y * y);
                }
            }
        }
    }

    // Return the maximum squared Euclidean distance reached by the robot.
    return maxDist;
};
```