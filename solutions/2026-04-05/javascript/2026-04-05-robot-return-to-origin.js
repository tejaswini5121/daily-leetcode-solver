// Problem: Robot Return to Origin
// Summary: Determines if a robot returns to its starting position (0,0) after a sequence of moves.
// Link: https://leetcode.com/problems/robot-return-to-origin/
//
// Approach:
// We can simulate the robot's movement by keeping track of its horizontal (x) and vertical (y) coordinates.
// Initialize x and y to 0.
// Iterate through the `moves` string.
// For each move:
//   - 'U': increment y
//   - 'D': decrement y
//   - 'R': increment x
//   - 'L': decrement x
// After processing all moves, check if both x and y are 0. If they are, the robot returned to the origin.
//
// Time Complexity: O(n), where n is the length of the `moves` string. We iterate through the string once.
// Space Complexity: O(1), as we only use a few variables to store the robot's position, regardless of the input size.

/**
 * @param {string} moves
 * @return {boolean}
 */
var judgeCircle = function(moves) {
    // Initialize robot's position at the origin (0, 0)
    let x = 0; // Horizontal position
    let y = 0; // Vertical position

    // Iterate through each move in the sequence
    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];

        // Update the robot's position based on the current move
        if (move === 'U') {
            y++; // Move up
        } else if (move === 'D') {
            y--; // Move down
        } else if (move === 'R') {
            x++; // Move right
        } else if (move === 'L') {
            x--; // Move left
        }
    }

    // Check if the robot is back at the origin (0, 0)
    // The robot returns to the origin if both its horizontal and vertical positions are zero.
    return x === 0 && y === 0;
};
