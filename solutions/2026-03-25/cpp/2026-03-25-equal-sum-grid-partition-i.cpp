```cpp
// Problem: Equal Sum Grid Partition I
// Link: https://leetcode.com/problems/equal-sum-grid-partition-i/
//
// Summary:
// Check if a grid can be partitioned into two non-empty sections with equal sums
// using either a single horizontal or a single vertical cut.
//
// Approach:
// The problem can be solved efficiently by pre-calculating prefix sums.
//
// 1. Calculate row sums: Iterate through each row and compute the sum of its elements.
// 2. Calculate column sums: Iterate through each column and compute the sum of its elements.
// 3. Calculate total sum: Sum all elements in the grid (or sum all row sums/column sums).
// 4. Check horizontal cuts:
//    Iterate through each possible horizontal cut position (between rows).
//    For each cut, maintain the sum of the top section. If the total sum is even
//    and the sum of the top section is exactly half of the total sum, a valid
//    horizontal partition exists.
// 5. Check vertical cuts:
//    Iterate through each possible vertical cut position (between columns).
//    For each cut, maintain the sum of the left section. If the total sum is even
//    and the sum of the left section is exactly half of the total sum, a valid
//    vertical partition exists.
//
// Time Complexity:
// O(m*n) to calculate row sums and the total sum.
// O(m) to check horizontal cuts.
// O(n) to check vertical cuts.
// Overall: O(m*n) because m*n is the dominant factor given the constraints (m*n <= 10^5).
//
// Space Complexity:
// O(m) to store row sums.
// O(n) to store column sums.
// Overall: O(m + n).

#include <vector>
#include <numeric> // For std::accumulate

class Solution {
public:
    bool splitEqually(std::vector<std::vector<int>>& grid) {
        int m = grid.size();
        int n = grid[0].size();

        // Calculate row sums and total sum
        std::vector<long long> rowSums(m, 0);
        long long totalSum = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                rowSums[i] += grid[i][j];
            }
            totalSum += rowSums[i];
        }

        // If the total sum is odd, it's impossible to split into two equal halves.
        if (totalSum % 2 != 0) {
            return false;
        }

        long long targetSum = totalSum / 2;

        // Check for horizontal cuts
        long long currentHorizontalSum = 0;
        // Iterate from the first row up to the second to last row.
        // A cut can be made after row i. The top section will contain rows 0 to i.
        for (int i = 0; i < m - 1; ++i) {
            currentHorizontalSum += rowSums[i];
            if (currentHorizontalSum == targetSum) {
                return true; // Found a valid horizontal cut
            }
        }

        // Calculate column sums
        std::vector<long long> colSums(n, 0);
        for (int j = 0; j < n; ++j) {
            for (int i = 0; i < m; ++i) {
                colSums[j] += grid[i][j];
            }
        }

        // Check for vertical cuts
        long long currentVerticalSum = 0;
        // Iterate from the first column up to the second to last column.
        // A cut can be made after column j. The left section will contain columns 0 to j.
        for (int j = 0; j < n - 1; ++j) {
            currentVerticalSum += colSums[j];
            if (currentVerticalSum == targetSum) {
                return true; // Found a valid vertical cut
            }
        }

        // If no valid horizontal or vertical cut was found
        return false;
    }
};
```