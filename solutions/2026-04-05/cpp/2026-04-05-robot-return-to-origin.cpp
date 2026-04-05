// Problem: Robot Return to Origin
// Link: https://leetcode.com/problems/robot-return-to-origin/
// Approach: We can simulate the robot's movement by keeping track of its current x and y coordinates.
// We initialize both x and y to 0. Then, we iterate through the given moves string.
// For each move:
// - If the move is 'U', we increment y.
// - If the move is 'D', we decrement y.
// - If the move is 'R', we increment x.
// - If the move is 'L', we decrement x.
// After processing all moves, we check if both x and y are back to 0.
// Time complexity: O(n), where n is the length of the moves string, because we iterate through the string once.
// Space complexity: O(1), because we only use a few variables to store the coordinates, regardless of the input size.

#include <string>
#include <iostream>

class Solution {
public:
    bool judgeCircle(std::string moves) {
        // Initialize the robot's position to the origin (0, 0)
        int x = 0;
        int y = 0;

        // Iterate through each move in the input string
        for (char move : moves) {
            // Update the coordinates based on the move
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

        // Check if the robot has returned to the origin (0, 0)
        return x == 0 && y == 0;
    }
};

/*
// Example Usage:
int main() {
    Solution sol;

    std::string moves1 = "UD";
    std::cout << "Moves: " << moves1 << ", Returns to origin: " << (sol.judgeCircle(moves1) ? "true" : "false") << std::endl; // Expected: true

    std::string moves2 = "LL";
    std::cout << "Moves: " << moves2 << ", Returns to origin: " << (sol.judgeCircle(moves2) ? "true" : "false") << std::endl; // Expected: false

    std::string moves3 = "RRDD";
    std::cout << "Moves: " << moves3 << ", Returns to origin: " << (sol.judgeCircle(moves3) ? "true" : "false") << std::endl; // Expected: false

    std::string moves4 = "LDRRLRUULR";
    std::cout << "Moves: " << moves4 << ", Returns to origin: " << (sol.judgeCircle(moves4) ? "true" : "false") << std::endl; // Expected: false

    return 0;
}
*/