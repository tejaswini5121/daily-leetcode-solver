```java
/**
 * Problem Summary: Alice and Bob play a stone removal game. Alice starts by removing 10 stones.
 * Each subsequent turn, a player removes one less stone than their opponent's last move.
 * The player who cannot make a valid move loses. Determine if Alice wins given the initial number of stones.
 *
 * Link: https://leetcode.com/problems/stone-removal-game/
 *
 * Approach:
 * This problem can be solved by simulating the game turn by turn.
 * We keep track of the current number of stones and the number of stones to be removed in the current turn.
 * Alice starts by removing 10 stones.
 * If Alice cannot remove 10 stones (i.e., n < 10), she loses immediately.
 * If she can, we update the remaining stones and set the number of stones for Bob's turn to 9.
 * Bob then tries to remove 9 stones. If he can't (remaining stones < 9), Alice wins.
 * If he can, we update the remaining stones and set the number of stones for Alice's next turn to 8.
 * This continues, with the number of stones to be removed decreasing by 1 each turn.
 * The game ends when a player cannot make a valid move (i.e., the number of stones to remove is greater than the remaining stones).
 *
 * Time Complexity: O(1) - The number of turns is limited because the number of stones removed decreases by 1 each turn, and the maximum number of stones is 50.
 * The maximum number of stones removed in a turn would be 10, then 9, 8, and so on.
 * The sum of an arithmetic progression 10 + 9 + 8 + ... + 1 is 55.
 * Since n <= 50, the game will not last more than a few turns.
 *
 * Space Complexity: O(1) - We only use a few variables to store the current state of the game.
 */
class Solution {
    public boolean stoneGame(int n) {
        // If the initial number of stones is less than 10, Alice cannot make her first move and loses.
        if (n < 10) {
            return false;
        }

        // Variable to keep track of the number of stones to be removed in the current turn.
        // Alice starts by removing 10 stones.
        int stonesToRemove = 10;

        // Variable to represent the current player.
        // 0 for Alice, 1 for Bob.
        int currentPlayer = 0; // Alice's turn

        // Simulate the game turn by turn.
        while (true) {
            // Check if the current player can make a valid move.
            // A valid move requires removing 'stonesToRemove' stones from the pile 'n'.
            if (n < stonesToRemove) {
                // If the current player cannot make a move, the *previous* player wins.
                // If currentPlayer is 0 (Alice) and she can't move, Bob wins (Alice loses).
                // If currentPlayer is 1 (Bob) and he can't move, Alice wins.
                return currentPlayer == 1; // If Bob couldn't move, Alice wins.
            }

            // If the move is valid, subtract the stones.
            n -= stonesToRemove;

            // Prepare for the next turn:
            // The number of stones to remove decreases by 1 for the opponent.
            stonesToRemove--;

            // Switch to the other player.
            currentPlayer = 1 - currentPlayer; // Toggle between 0 (Alice) and 1 (Bob)
        }
    }
}
```