```python
# Summary: Alice and Bob take turns taking 1, 2, or 3 stones from the beginning of a row.
# The player with the highest total score wins. Both play optimally.
# Link: https://leetcode.com/problems/stone-game-iii/
#
# Approach:
# This problem can be solved using dynamic programming. Let dp[i] represent the maximum
# *difference* in score the current player can achieve when considering the stones
# from index i to the end of the array. The current player wants to maximize their score
# minus the opponent's score.
#
# Base cases:
# If i is out of bounds (i >= n), the difference is 0.
#
# Transitions:
# For each index i, the current player can choose to take 1, 2, or 3 stones.
# If the player takes k stones (where k is 1, 2, or 3), their score increases by
# sum(stoneValue[i:i+k]). The opponent will then play optimally on the remaining stones
# starting from index i+k. The opponent's maximum difference from their perspective
# on the remaining stones will be dp[i+k]. Since the opponent is trying to maximize
# their score minus the current player's score on the remaining stones, the current
# player's score difference from this move will be sum(stoneValue[i:i+k]) - dp[i+k].
#
# The current player will choose the move (k=1, 2, or 3) that maximizes this difference.
# dp[i] = max(
#     stoneValue[i] - dp[i+1],  # Take 1 stone
#     stoneValue[i] + stoneValue[i+1] - dp[i+2],  # Take 2 stones
#     stoneValue[i] + stoneValue[i+1] + stoneValue[i+2] - dp[i+3]  # Take 3 stones
# )
# We need to handle boundary conditions where i+k goes beyond the array length.
#
# To implement this efficiently, we can use a suffix sum array to quickly calculate
# the sum of stones taken. Let prefixSum[i] be the sum of stones from index 0 to i-1.
# Then sum(stoneValue[i:j]) = prefixSum[j] - prefixSum[i].
#
# The DP state `dp[i]` will store the maximum score difference the current player
# can achieve starting from `stones[i:]`.
# We iterate from the end of the stones array backwards to compute the DP table.
#
# The final answer is determined by `dp[0]`.
# If `dp[0] > 0`, Alice wins.
# If `dp[0] < 0`, Bob wins.
# If `dp[0] == 0`, it's a tie.
#
# Time Complexity: O(n), where n is the number of stones. We iterate through the stones array once
# to compute the prefix sums and once again to compute the DP table. Each DP transition takes constant time.
# Space Complexity: O(n) for the DP table and the prefix sum array.
class Solution:
    def stoneGameIII(self, stoneValue: list[int]) -> str:
        n = len(stoneValue)

        # Calculate prefix sums for efficient stone sum calculation.
        # prefixSum[i] will store the sum of stoneValue[0] to stoneValue[i-1].
        # prefixSum[0] = 0
        # prefixSum[i] = stoneValue[0] + ... + stoneValue[i-1] for i > 0
        prefixSum = [0] * (n + 1)
        for i in range(n):
            prefixSum[i + 1] = prefixSum[i] + stoneValue[i]

        # dp[i] will store the maximum score difference the current player can achieve
        # when considering the stones from index i to the end (i.e., stoneValue[i:]).
        # The difference is current player's score - opponent's score.
        dp = [0] * (n + 1)

        # Iterate backwards from the end of the stones array.
        # dp[n] is 0 because there are no stones left.
        for i in range(n - 1, -1, -1):
            # For each position i, the current player can take 1, 2, or 3 stones.
            # The player wants to maximize their score difference.
            # The opponent will then play optimally on the remaining stones.

            # Option 1: Take 1 stone
            # Current player's score: stoneValue[i]
            # Opponent's max score difference on remaining stones: dp[i+1]
            # Current player's total difference: stoneValue[i] - dp[i+1]
            take1 = stoneValue[i] - dp[i + 1]

            # Option 2: Take 2 stones (if possible)
            # Current player's score: stoneValue[i] + stoneValue[i+1]
            # Opponent's max score difference on remaining stones: dp[i+2]
            # Current player's total difference: (stoneValue[i] + stoneValue[i+1]) - dp[i+2]
            take2 = float('-inf') # Initialize to negative infinity
            if i + 2 <= n:
                take2 = (stoneValue[i] + stoneValue[i + 1]) - dp[i + 2]

            # Option 3: Take 3 stones (if possible)
            # Current player's score: stoneValue[i] + stoneValue[i+1] + stoneValue[i+2]
            # Opponent's max score difference on remaining stones: dp[i+3]
            # Current player's total difference: (stoneValue[i] + stoneValue[i+1] + stoneValue[i+2]) - dp[i+3]
            take3 = float('-inf') # Initialize to negative infinity
            if i + 3 <= n:
                take3 = (stoneValue[i] + stoneValue[i + 1] + stoneValue[i + 2]) - dp[i + 3]

            # The current player chooses the move that maximizes their score difference.
            dp[i] = max(take1, take2, take3)

        # dp[0] represents the maximum score difference Alice can achieve starting from the beginning.
        # If dp[0] > 0, Alice's score is greater than Bob's.
        # If dp[0] < 0, Bob's score is greater than Alice's.
        # If dp[0] == 0, their scores are equal.
        if dp[0] > 0:
            return "Alice"
        elif dp[0] < 0:
            return "Bob"
        else:
            return "Tie"

```