```cpp
// Problem: Champagne Tower
// Link: https://leetcode.com/problems/champagne-tower/
// Approach:
// This problem can be solved using dynamic programming. We can simulate the flow of champagne row by row.
// Let dp[i][j] represent the amount of champagne in the j-th glass of the i-th row.
// The base case is dp[0][0] = poured, representing the initial amount poured into the top glass.
// For each glass dp[i][j], if it contains more than 1 unit of champagne, the excess flows equally to the two glasses below it:
// dp[i+1][j] += (dp[i][j] - 1) / 2.0
// dp[i+1][j+1] += (dp[i][j] - 1) / 2.0
// We only need to consider rows up to query_row, as any champagne that flows beyond that row is irrelevant for the query.
// The maximum possible row we might need to calculate is query_row itself. The maximum number of glasses in a row is `row + 1`.
// We can use a 2D array to store the champagne amounts. Since the number of rows is limited (up to 100), a fixed-size 2D array is feasible.
// The final answer for the j-th glass in the i-th row will be min(1.0, dp[query_row][query_glass]). If dp[query_row][query_glass] is greater than 1, it means the glass is full, so we return 1.0.
// Time Complexity: O(query_row^2) - We iterate through each glass up to the query_row. In the worst case, query_row is around 100. The number of glasses in row `r` is `r+1`. So, total operations are roughly sum(i from 0 to query_row) of (i+1), which is O(query_row^2).
// Space Complexity: O(query_row^2) - We use a 2D array to store the champagne amounts for each glass up to the query_row. The size of this array is proportional to query_row^2.

#include <vector>
#include <algorithm>
#include <iomanip>

class Solution {
public:
    double champagneTower(int poured, int query_row, int query_glass) {
        // Initialize a 2D vector to store the amount of champagne in each glass.
        // The size is (query_row + 1) x (query_row + 1) because the maximum number of glasses
        // in row `r` is `r+1`, and we need to calculate up to `query_row`.
        // We use `double` to handle fractional amounts.
        std::vector<std::vector<double>> tower(query_row + 1, std::vector<double>(query_row + 1, 0.0));

        // The top glass (row 0, glass 0) receives all the poured champagne initially.
        tower[0][0] = poured;

        // Iterate through each row up to the query_row.
        for (int i = 0; i <= query_row; ++i) {
            // Iterate through each glass in the current row.
            for (int j = 0; j <= i; ++j) {
                // If the current glass has more than 1 unit of champagne,
                // the excess flows to the two glasses directly below it.
                if (tower[i][j] > 1.0) {
                    // Calculate the excess amount to be distributed.
                    double excess = tower[i][j] - 1.0;

                    // The excess is split equally between the glass at (i+1, j)
                    // and the glass at (i+1, j+1).
                    // We add half of the excess to each of these glasses.
                    // We ensure we don't go out of bounds for rows (i+1)
                    // and for glasses within that row (j and j+1).
                    if (i + 1 <= query_row) {
                        tower[i + 1][j] += excess / 2.0;
                        tower[i + 1][j + 1] += excess / 2.0;
                    }
                    // Once the excess is distributed, we can cap the current glass at 1.0
                    // for future calculations, although it's not strictly necessary for correctness
                    // as we are only concerned with the flow *out* of this glass.
                    // However, if we were to use the value of tower[i][j] later for something else,
                    // capping would be important. For this problem, the logic works fine without capping here.
                    // tower[i][j] = 1.0; // Optional capping for clarity, but not strictly required for current logic
                }
            }
        }

        // The amount of champagne in the target glass is tower[query_row][query_glass].
        // Since a glass can hold at most 1.0 unit of champagne, we take the minimum of
        // the calculated amount and 1.0.
        return std::min(1.0, tower[query_row][query_glass]);
    }
};
```