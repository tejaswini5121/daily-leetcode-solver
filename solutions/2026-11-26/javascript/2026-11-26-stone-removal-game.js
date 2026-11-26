// LeetCode Problem: Stone Removal Game
// Problem Summary: Alice and Bob take turns removing stones. Alice starts by removing 10, then each player removes one less than the opponent. The player who can't move loses.
// Link: https://leetcode.com/problems/stone-removal-game/
// Approach: This is a simulation problem. We can simulate the game turn by turn, keeping track of the number of stones remaining and the number of stones the current player needs to remove. Alice wins if Bob cannot make a valid move at any point.
// Time Complexity: O(1) - The game will always end within a fixed number of turns because the number of stones removed decreases. Even in the worst case where Alice removes 10, then 9, then 8... the number of stones removed will eventually become 0 or less. The number of turns is bounded.
// Space Complexity: O(1) - We only use a few variables to store the state of the game.

/**
 * @param {number} n The initial number of stones.
 * @return {boolean} True if Alice wins, false otherwise.
 */
const stoneGame = (n) => {
    // If the initial number of stones is less than 10, Alice cannot make her first move and loses.
    if (n < 10) {
        return false;
    }

    // Initialize the number of stones to remove for Alice's first turn.
    let stonesToRemove = 10;
    // Initialize the current number of stones.
    let currentStones = n;
    // Initialize a variable to track whose turn it is (true for Alice, false for Bob). Alice goes first.
    let isAliceTurn = true;

    // Loop as long as a valid move can be made by the current player.
    while (true) {
        // If the current player needs to remove more stones than are available, they lose.
        if (currentStones < stonesToRemove) {
            // The player whose turn it is cannot make a move, so the other player wins.
            // If it's Alice's turn and she can't move, Bob wins (Alice loses).
            // If it's Bob's turn and he can't move, Alice wins.
            return !isAliceTurn;
        }

        // The current player makes a move.
        currentStones -= stonesToRemove;

        // Switch turns.
        isAliceTurn = !isAliceTurn;

        // For the next turn, the number of stones to remove decreases by 1.
        stonesToRemove--;

        // If the number of stones to remove becomes 0 or negative, the game effectively ends,
        // and the player whose turn it is (but can't remove any stones) loses.
        // This condition is implicitly handled by the 'currentStones < stonesToRemove' check at the beginning of the loop.
        // However, explicitly checking for stonesToRemove <= 0 might be clearer in some interpretations,
        // but the current logic covers it. If stonesToRemove becomes 0, the next check currentStones < 0 will be false if currentStones >= 0,
        // but if stonesToRemove becomes negative, currentStones < stonesToRemove will likely be true.
        // Let's refine this: if stonesToRemove becomes 0 or less, the next player cannot remove any stones and loses.
        if (stonesToRemove <= 0) {
             // The player whose turn it now is cannot make a move (needs to remove 0 or less stones,
             // and if they can't even remove 1, they lose). The previous player wins.
             // Since we just switched turns, 'isAliceTurn' is now for the *next* player.
             // So if 'isAliceTurn' is true, it's Alice's turn and she loses, meaning Bob wins.
             // If 'isAliceTurn' is false, it's Bob's turn and he loses, meaning Alice wins.
            return !isAliceTurn;
        }
    }
};
```