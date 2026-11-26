```python
# Problem: Stone Removal Game
# Summary: Alice and Bob take turns removing stones. Alice starts by removing 10.
# Each subsequent turn, a player removes one less stone than their opponent.
# The player who cannot make a move loses.
# Link: https://leetcode.com/problems/stone-removal-game/
#
# Approach:
# This is a simulation problem. We can directly simulate the game turn by turn.
# Alice starts by removing 10 stones.
# Then, Bob removes 9 stones.
# Then, Alice removes 8 stones, and so on.
# The number of stones removed decreases by 1 each turn.
# The game continues as long as the number of stones to be removed is positive
# and the remaining number of stones is sufficient.
#
# We can keep track of the current number of stones and the number of stones to be removed.
# Alice wins if Bob cannot make a move, or if Alice cannot make a move and Bob has already lost.
# In this specific game, the number of stones to remove decreases linearly, so one player
# will eventually be unable to make a valid move.
#
# We can model this using a loop.
# Alice's turn:
#   - If n < stones_to_remove, Alice loses.
#   - n -= stones_to_remove
#   - stones_to_remove -= 1
# Bob's turn:
#   - If n < stones_to_remove, Bob loses (Alice wins).
#   - n -= stones_to_remove
#   - stones_to_remove -= 1
#
# The problem states Alice removes exactly 10 stones on her first turn.
# Subsequent turns remove "exactly 1 fewer stone than the previous opponent".
# This means the sequence of stones removed is: 10, 9, 8, 7, ...
#
# Let's re-evaluate the turns:
# Turn 1 (Alice): Removes 10 stones. If n < 10, Alice loses. Remaining stones = n - 10.
# Turn 2 (Bob): Removes 9 stones. If (n - 10) < 9, Bob loses. Remaining stones = (n - 10) - 9.
# Turn 3 (Alice): Removes 8 stones. If (n - 10 - 9) < 8, Alice loses. Remaining stones = (n - 10 - 9) - 8.
# Turn 4 (Bob): Removes 7 stones. If (n - 10 - 9 - 8) < 7, Bob loses. Remaining stones = (n - 10 - 9 - 8) - 7.
# And so on.
#
# The player whose turn it is loses if the number of stones to remove is greater than
# the remaining number of stones.
#
# Time Complexity: O(1)
# The maximum number of stones is 50. The number of stones removed starts at 10 and decreases.
# The game will end very quickly. The total number of stones removed is at most the sum
# of an arithmetic progression. The maximum number of turns is small and constant given the constraints.
#
# Space Complexity: O(1)
# We only use a few variables to keep track of the game state.

class Solution:
    def stoneGame(self, n: int) -> bool:
        # If the initial number of stones is less than 10, Alice cannot make her first move.
        if n < 10:
            return False

        # Initialize the number of stones to remove for the current turn.
        # Alice starts by removing 10 stones.
        stones_to_remove = 10
        # Variable to track whose turn it is. 0 for Alice, 1 for Bob.
        turn = 0

        # Simulate the game turn by turn.
        while True:
            # Check if the current player can make a move.
            # If the number of stones to remove is greater than the remaining stones, the current player loses.
            if n < stones_to_remove:
                # If it's Alice's turn and she cannot move, she loses.
                if turn == 0:
                    return False
                # If it's Bob's turn and he cannot move, he loses, meaning Alice wins.
                else: # turn == 1
                    return True

            # If the player can make a move, subtract the stones.
            n -= stones_to_remove

            # Decrease the number of stones to remove for the next turn.
            stones_to_remove -= 1

            # Switch turns.
            turn = 1 - turn

            # If stones_to_remove becomes 0 or negative, it means no more valid moves can be made according to the rule.
            # However, the check `n < stones_to_remove` will handle this implicitly.
            # If stones_to_remove becomes 0, the next player will always have n >= 0, so they can't lose based on the condition.
            # But the problem implies the number of stones removed must be positive for a valid move.
            # Let's consider the case where stones_to_remove becomes 0. The next player will be unable to remove any stones.
            # If stones_to_remove reaches 0, it means the previous player removed 1 stone.
            # The current player would be supposed to remove 0 stones, which is not a valid move.
            # The condition `n < stones_to_remove` handles the case where `stones_to_remove` is positive and greater than `n`.
            # If `stones_to_remove` becomes 0, the player whose turn it is cannot make a valid move (removing 0 stones is not a move).
            # So, if `stones_to_remove` becomes 0, the current player loses.
            if stones_to_remove <= 0:
                # If it's Alice's turn and stones_to_remove is non-positive, she loses.
                if turn == 0:
                    return False
                # If it's Bob's turn and stones_to_remove is non-positive, he loses, Alice wins.
                else: # turn == 1
                    return True

```