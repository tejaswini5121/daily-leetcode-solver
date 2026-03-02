// Brief problem summary: Find the minimum adjacent row swaps to make a binary grid valid,
// where valid means all cells above the main diagonal are zeros.
// Link: https://leetcode.com/problems/minimum-swaps-to-arrange-a-binary-grid/
// Approach explanation:
// A grid is valid if for every row `i`, the last `i+1` elements are 0s (from right to left).
// This is because all cells above the main diagonal (grid[r][c] where r < c) must be 0.
// For row 0, grid[0][1], grid[0][2], ..., grid[0][n-1] must be 0. This means row 0 must end with n-1 zeros.
// For row 1, grid[1][2], ..., grid[1][n-1] must be 0. This means row 1 must end with n-2 zeros.
// In general, row `i` must end with `n - 1 - i` zeros.
// We can precompute the number of trailing zeros for each row.
// Then, we iterate through the rows from top to bottom (i from 0 to n-1).
// For each row `i`, we need to find a row `j` (where `j >= i`) that satisfies the condition:
// the number of trailing zeros in row `j` is at least `n - 1 - i`.
// We want to find the *first* such row `j` (closest to `i`) to minimize swaps.
// Once we find such a row `j`, we move it to position `i` by performing adjacent swaps.
// The number of swaps needed to move row `j` to position `i` is `j - i`.
// We add this to our total swaps and update the array of trailing zeros by performing the same swaps.
// If at any point we cannot find a suitable row `j` for row `i`, it means the grid cannot be made valid, and we return -1.
//
// Time complexity analysis:
// Precomputing trailing zeros for each row: O(n^2)
// Iterating through rows to find suitable rows and performing swaps:
// For each row `i`, we search for a suitable row `j` starting from `i`.
// In the worst case, we might scan all remaining rows.
// Moving the row `j` to position `i` takes `j - i` swaps.
// The total number of swaps across all rows can be at most O(n^2) in the worst case (e.g., reversing the order of rows).
// The search for `j` for each `i` is linear in the remaining `n-i` rows.
// The overall complexity of the main loop and swaps is O(n^2).
// Therefore, the total time complexity is O(n^2).
//
// Space complexity analysis:
// Storing the count of trailing zeros for each row: O(n)
// The grid itself takes O(n^2) space, but we consider auxiliary space.
// Therefore, the auxiliary space complexity is O(n).
//
// Approach detailed breakdown:
// 1. For each row in the grid, calculate the number of trailing zeros. Store these counts in a vector `trailingZeros`.
// 2. Initialize `totalSwaps = 0`.
// 3. Iterate through the rows from `i = 0` to `n - 1`:
//    a. Determine the required number of trailing zeros for row `i`: `requiredZeros = n - 1 - i`.
//    b. Search for the first row `j` (where `j >= i`) in `trailingZeros` such that `trailingZeros[j] >= requiredZeros`.
//    c. If no such row `j` is found:
//       Return -1 (grid cannot be made valid).
//    d. If row `j` is found:
//       i. Add `j - i` to `totalSwaps`.
//       ii. "Move" row `j` to position `i` in the `trailingZeros` vector. This means taking `trailingZeros[j]` and inserting it at index `i`, shifting elements `trailingZeros[i]` through `trailingZeros[j-1]` one position to the right. This simulates the physical swaps in the grid without actually modifying the grid itself.
// 4. Return `totalSwaps`.
class Solution {
public:
    int minSwaps(vector<vector<int>>& grid) {
        int n = grid.size();
        // Vector to store the number of trailing zeros for each row.
        vector<int> trailingZeros(n);

        // Calculate the number of trailing zeros for each row.
        for (int i = 0; i < n; ++i) {
            int count = 0;
            // Iterate from the rightmost element of the row.
            for (int j = n - 1; j >= 0; --j) {
                if (grid[i][j] == 0) {
                    count++;
                } else {
                    // Stop counting once a non-zero element is encountered.
                    break;
                }
            }
            trailingZeros[i] = count;
        }

        int totalSwaps = 0;

        // Iterate through each row position `i` from top to bottom.
        for (int i = 0; i < n; ++i) {
            // The `i`-th row (0-indexed) needs at least `n - 1 - i` trailing zeros
            // to satisfy the condition that all elements above the main diagonal are 0.
            // For example, row 0 needs n-1 trailing zeros, row 1 needs n-2, etc.
            int requiredZeros = n - 1 - i;
            
            // Find the first row `j` (at or after the current position `i`)
            // that satisfies the `requiredZeros` condition.
            int foundRowIndex = -1;
            for (int j = i; j < n; ++j) {
                if (trailingZeros[j] >= requiredZeros) {
                    foundRowIndex = j;
                    break;
                }
            }

            // If no suitable row is found for the current position `i`,
            // it means the grid cannot be made valid.
            if (foundRowIndex == -1) {
                return -1;
            }

            // The number of swaps needed to bring row `foundRowIndex` to position `i`
            // is the difference in their indices (`foundRowIndex - i`).
            totalSwaps += (foundRowIndex - i);

            // Now, we need to "move" the row from `foundRowIndex` to position `i`.
            // This is done by simulating the adjacent swaps. We take the `trailingZeros` count
            // from `foundRowIndex` and insert it at position `i`, shifting the elements
            // from `i` to `foundRowIndex - 1` one position to the right.
            int rowToMove = trailingZeros[foundRowIndex];
            for (int k = foundRowIndex; k > i; --k) {
                trailingZeros[k] = trailingZeros[k - 1];
            }
            trailingZeros[i] = rowToMove;
        }

        // If we successfully placed all rows according to the conditions,
        // return the total number of swaps performed.
        return totalSwaps;
    }
};
