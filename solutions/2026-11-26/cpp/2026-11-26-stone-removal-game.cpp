// Problem Summary: Alice and Bob play a stone removal game. Alice starts with 10 stones, and each subsequent turn removes 1 less than the opponent. The player unable to move loses.
// Link: https://leetcode.com/problems/stone-removal-game/
// Approach: This problem can be solved by simulating the game turn by turn. We track the number of stones remaining and the number of stones the current player needs to remove. Alice wins if Bob cannot make a move.
// Time Complexity: O(n) in the worst case, as the number of stones removed decreases. However, since the number of stones removed is capped by the initial number of stones and decreases linearly, the number of turns is limited. A more precise analysis shows the number of turns is roughly proportional to the square root of n. Given n <= 50, this is very efficient.
// Space Complexity: O(1) as we only use a few variables to store the state of the game.

#include <iostream>

class Solution {
public:
    bool stoneGame(int n) {
        // If the initial number of stones is less than 10, Alice cannot make her first move and loses.
        if (n < 10) {
            return false;
        }

        int stones_remaining = n; // Initialize the number of stones
        int stones_to_remove = 10; // Alice's first move
        bool alice_turn = true;   // Flag to track whose turn it is

        // Simulate the game turn by turn
        while (true) {
            // Check if the current player can make a valid move
            if (stones_remaining < stones_to_remove) {
                // If the current player cannot remove enough stones, they lose.
                // If it's Alice's turn and she can't move, she loses, so Bob wins (return false).
                // If it's Bob's turn and he can't move, he loses, so Alice wins (return true).
                return !alice_turn;
            }

            // Current player removes stones
            stones_remaining -= stones_to_remove;

            // Prepare for the next turn: the number of stones to remove decreases by 1
            // However, the number of stones to remove cannot be less than 1.
            stones_to_remove = std::max(1, stones_to_remove - 1);

            // Switch to the other player's turn
            alice_turn = !alice_turn;
        }
    }
};
