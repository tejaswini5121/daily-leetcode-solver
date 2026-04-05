```java
// Problem: Robot Return to Origin
// Link: https://leetcode.com/problems/robot-return-to-origin/
//
// Approach:
// We can simulate the robot's movement by keeping track of its current position
// on a 2D plane. We can use two integer variables, `x` for the horizontal
// position and `y` for the vertical position, initialized to 0.
// We iterate through the input string `moves`. For each character:
// - If it's 'U', we increment `y`.
// - If it's 'D', we decrement `y`.
// - If it's 'R', we increment `x`.
// - If it's 'L', we decrement `x`.
// After processing all moves, we check if both `x` and `y` are back to 0.
// If they are, the robot has returned to the origin, and we return true.
// Otherwise, we return false.
//
// Time Complexity: O(n), where n is the length of the `moves` string.
// We iterate through the string once to process each move.
//
// Space Complexity: O(1).
// We only use a few integer variables to store the robot's position, which
// is constant regardless of the input string length.

class Solution {
    public boolean judgeCircle(String moves) {
        // Initialize the robot's position at the origin (0, 0).
        int x = 0;
        int y = 0;

        // Iterate through each move in the input string.
        for (char move : moves.toCharArray()) {
            // Update the position based on the move.
            if (move == 'U') {
                y++; // Move up
            } else if (move == 'D') {
                y--; // Move down
            } else if (move == 'R') {
                x++; // Move right
            } else if (move == 'L') {
                x--; // Move left
            }
        }

        // Check if the robot has returned to the origin (0, 0).
        // The robot returns to the origin if and only if both x and y are 0.
        return x == 0 && y == 0;
    }
}
```