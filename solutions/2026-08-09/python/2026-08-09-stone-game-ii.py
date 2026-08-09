```python
# Summary: Alice and Bob play a game where they take stones from piles.
# On each turn, a player can take X piles (1 <= X <= 2M), and M is updated to max(M, X).
# Alice wants to maximize her stones, assuming optimal play from both.
# Link: https://leetcode.com/problems/stone-game-ii/
#
# Approach:
# This is a dynamic programming problem that can be modeled using minimax.
# We need to find the maximum number of stones Alice can get. The state of our DP
# will be (index, M), representing the current starting pile index and the current M value.
# The DP function `dp(index, m)` will return the maximum difference of stones
# the current player can achieve over the opponent, starting from `piles[index:]` with current `m`.
#
# If `dp(index, m)` returns a positive value, it means the current player can win
# (get more stones than the opponent). If it's negative, the opponent wins.
#
# The base case is when `index >= n`, meaning no more piles are left, so the difference is 0.
#
# For a given state `(index, m)`, the current player can choose to take `x` piles,
# where `1 <= x <= 2*m`. After taking `x` piles, the number of stones taken is
# `sum(piles[index : index + x])`. The next player will then play from `index + x`
# with `m` updated to `max(m, x)`.
#
# The current player wants to maximize their score. This means they want to maximize
# `stones_taken + (-dp(index + x, max(m, x)))`. The negative sign is because `dp`
# returns the difference from the *next* player's perspective.
#
# We can use memoization to store the results of `dp(index, m)` to avoid redundant calculations.
#
# Let `total_sum` be the sum of all stones. The total stones Alice gets will be
# `(total_sum + max_diff) / 2`, where `max_diff` is the maximum difference Alice can achieve.
#
# We'll use prefix sums to efficiently calculate the sum of stones taken.
# `prefix_sum[i]` will store the sum of `piles[0]` to `piles[i-1]`.
# The sum of `piles[start : end]` is `prefix_sum[end] - prefix_sum[start]`.
#
# Time Complexity: O(n^2 * M_max), where n is the number of piles and M_max is the maximum possible value of M.
# Since M can grow up to n, the theoretical complexity can be O(n^3). However, M is bounded by n/2 after a few steps.
# The states are (index, M). `index` goes from 0 to n. `M` can go up to n.
# The actual state space is roughly O(n * n). For each state, we iterate up to `2*M` times.
# Max value of M is approximately n. So, it's roughly O(n * n * n).
# A tighter bound is O(N^3) because M can be at most N.
# The number of distinct (index, M) states is O(N^2). For each state, we iterate up to 2M (at most 2N) times.
# So, Time Complexity = O(N^2 * 2N) = O(N^3).
#
# Space Complexity: O(N^2) for the memoization table.
# The recursion depth can also be O(N).
# So, Space Complexity = O(N^2).
class Solution:
    def stoneGameII(self, piles: list[int]) -> int:
        n = len(piles)
        # Precompute prefix sums for efficient calculation of sum of stones in a range.
        # prefix_sum[i] will store the sum of piles[0]...piles[i-1]
        prefix_sum = [0] * (n + 1)
        for i in range(n):
            prefix_sum[i + 1] = prefix_sum[i] + piles[i]

        # Memoization table to store results of dp(index, m)
        # dp[i][j] stores the maximum difference the current player can get
        # starting from piles[i:] with M = j.
        memo = {}

        # Define the recursive DP function
        # index: the starting index of the current piles
        # m: the current value of M
        def dp(index: int, m: int) -> int:
            # Base case: If all piles have been taken, the difference is 0.
            if index >= n:
                return 0

            # If the result for this state is already computed, return it.
            if (index, m) in memo:
                return memo[(index, m)]

            # Calculate the sum of remaining stones from the current index.
            # This is used to determine the maximum possible score the current player can get.
            remaining_stones = prefix_sum[n] - prefix_sum[index]

            # Initialize the maximum score the current player can achieve in this state.
            # We aim to maximize the current player's score minus the opponent's score.
            # Initially, assume the worst case where the current player gets 0 more stones than the opponent.
            max_stones_diff = -float('inf')

            # Iterate through possible numbers of piles (X) to take.
            # X can be from 1 up to 2*M, and also must not exceed the remaining piles.
            for x in range(1, 2 * m + 1):
                # If we try to take more piles than available, break the loop.
                if index + x > n:
                    break

                # Calculate the sum of stones taken in this move.
                stones_taken = prefix_sum[index + x] - prefix_sum[index]

                # Calculate the score difference for the current player.
                # The current player takes `stones_taken`.
                # The opponent will play from `index + x` with `M` updated to `max(m, x)`.
                # `dp(index + x, max(m, x))` returns the maximum difference the *opponent* can get.
                # So, we subtract it to get the current player's advantage.
                current_diff = stones_taken - dp(index + x, max(m, x))

                # Update max_stones_diff if the current move yields a better score difference.
                max_stones_diff = max(max_stones_diff, current_diff)

            # Store the computed result in the memoization table before returning.
            memo[(index, m)] = max_stones_diff
            return max_stones_diff

        # The initial call is for Alice starting at index 0 with M=1.
        # `dp(0, 1)` returns the maximum difference Alice can achieve over Bob.
        # Let this difference be `diff`. Alice's stones = A, Bob's stones = B.
        # We know A - B = diff.
        # Also, A + B = total_stones.
        # Adding these two equations: 2*A = total_stones + diff => A = (total_stones + diff) / 2.
        # Alice starts, so she aims to maximize her score.
        max_alice_diff = dp(0, 1)
        total_stones = prefix_sum[n]
        
        # Alice's maximum stones = (total stones + maximum difference Alice can achieve) / 2
        return (total_stones + max_alice_diff) // 2
```