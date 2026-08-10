// Problem: Stone Game IV
// Summary: Alice and Bob take turns removing perfect square numbers of stones. The player who cannot move loses. Determine if Alice wins.
// Link: https://leetcode.com/problems/stone-game-iv/
// Approach: This is a game theory problem that can be solved using dynamic programming.
// We can define dp[i] as a boolean value indicating whether the current player can win if there are 'i' stones remaining.
// The base case is dp[0] = false (no stones, current player loses).
// For any 'i' stones, the current player can win if they can make a move to a state 'i - k*k' where the *next* player *loses*.
// This means dp[i] is true if there exists a perfect square 'k*k' such that 'i - k*k >= 0' and 'dp[i - k*k]' is false.
// We iterate through possible moves (perfect squares) for each number of stones.
// Time Complexity: O(N * sqrt(N)) where N is the input number of stones. For each state 'i' from 1 to N, we iterate through possible square subtractions up to sqrt(i).
// Space Complexity: O(N) to store the DP table.
#include <vector>
#include <cmath>
#include <iostream>

class Solution {
public:
    bool winnerOfGame(int n) {
        // dp[i] will be true if the current player can win with i stones, false otherwise.
        std::vector<bool> dp(n + 1, false);

        // Iterate through each number of stones from 1 to n.
        for (int i = 1; i <= n; ++i) {
            // For each number of stones 'i', check all possible moves.
            // A move consists of removing k*k stones, where k*k is a perfect square.
            for (int k = 1; k * k <= i; ++k) {
                // If removing k*k stones leads to a state where the *next* player loses (dp[i - k*k] is false),
                // then the current player can win from state 'i'.
                if (!dp[i - k * k]) {
                    dp[i] = true; // The current player can win.
                    break;        // No need to check further moves for this 'i', as we found a winning move.
                }
            }
        }

        // Alice starts with 'n' stones. So, we return dp[n].
        return dp[n];
    }
};

// This main function is for testing purposes and is not part of the LeetCode solution structure.
int main() {
    Solution sol;
    std::cout << "n = 1, Alice wins: " << (sol.winnerOfGame(1) ? "true" : "false") << std::endl; // Expected: true
    std::cout << "n = 2, Alice wins: " << (sol.winnerOfGame(2) ? "true" : "false") << std::endl; // Expected: false
    std::cout << "n = 4, Alice wins: " << (sol.winnerOfGame(4) ? "true" : "false") << std::endl; // Expected: true
    std::cout << "n = 5, Alice wins: " << (sol.winnerOfGame(5) ? "true" : "false") << std::endl; // Expected: true (5->4, Bob faces 4, Alice wins)
    std::cout << "n = 6, Alice wins: " << (sol.winnerOfGame(6) ? "true" : "false") << std::endl; // Expected: false (6->5 (Alice wins), 6->2 (Bob wins))
    std::cout << "n = 7, Alice wins: " << (sol.winnerOfGame(7) ? "true" : "false") << std::endl; // Expected: false (7->6 (Bob wins), 7->3 (Bob wins))
    std::cout << "n = 10, Alice wins: " << (sol.winnerOfGame(10) ? "true" : "false") << std::endl; // Expected: true (10 -> 9, Bob faces 9, Alice wins)
    return 0;
}
```