/**
 * Problem Summary:
 * Given an n x n binary grid, we can swap adjacent rows. A grid is valid if all cells above the main diagonal are zeros.
 * The goal is to find the minimum swaps to make the grid valid, or return -1 if impossible.
 *
 * Link: https://leetcode.com/problems/minimum-swaps-to-arrange-a-binary-grid/
 *
 * Approach:
 * The condition "all cells above the main diagonal are zeros" means that for each row `i` (0-indexed),
 * the first `i` cells must be zeros. This implies that the `k`-th row (0-indexed) must have at least `n - 1 - k` trailing zeros.
 * We can pre-calculate the number of trailing zeros for each row.
 *
 * Then, we iterate through the rows from top to bottom (i from 0 to n-1). For each row `i`, we need a row that has at least `n - 1 - i` trailing zeros.
 * We find the first available row `j` (where `j >= i`) that satisfies this condition.
 * If no such row exists, it's impossible to make the grid valid, so we return -1.
 *
 * If we find such a row `j`, we count the number of swaps needed to bring it to position `i`. This is simply `j - i`.
 * We add this to our total swaps. After bringing row `j` to position `i`, we effectively remove it from further consideration for rows below `i`.
 * We can achieve this by simulating the swaps: move row `j` to position `i` by repeatedly swapping it with the row above it.
 * This is equivalent to removing row `j` and inserting it at position `i` within the remaining unsorted part of the array.
 *
 * Time Complexity:
 * Pre-calculating trailing zeros for all rows takes O(n^2) time.
 * The main loop iterates `n` times. Inside the loop, finding the correct row `j` can take up to O(n) time in the worst case.
 * Simulating the swaps by shifting elements takes O(n) time for each row `i`.
 * Therefore, the overall time complexity is O(n^2) + n * (O(n) + O(n)) = O(n^2).
 *
 * Space Complexity:
 * We use an array `zerosCount` to store the number of trailing zeros for each row, which takes O(n) space.
 * The overall space complexity is O(n).
 */
class Solution {
    public int minSwaps(int[][] grid) {
        int n = grid.length;
        // Array to store the count of trailing zeros for each row.
        int[] zerosCount = new int[n];

        // Calculate the number of trailing zeros for each row.
        // A row is valid at index 'i' if it has at least 'n - 1 - i' trailing zeros.
        for (int i = 0; i < n; i++) {
            int count = 0;
            // Iterate from the right of the row to count trailing zeros.
            for (int j = n - 1; j >= 0; j--) {
                if (grid[i][j] == 0) {
                    count++;
                } else {
                    // Once a '1' is encountered, no more trailing zeros.
                    break;
                }
            }
            zerosCount[i] = count;
        }

        int totalSwaps = 0;

        // Iterate through each row position 'i' that needs to be filled.
        // The goal is to place a row with at least 'n - 1 - i' trailing zeros at index 'i'.
        for (int i = 0; i < n; i++) {
            // The minimum required trailing zeros for row 'i'.
            int requiredZeros = n - 1 - i;
            int foundRowIndex = -1; // Index of the row that satisfies the condition.

            // Search for the first available row 'j' (starting from the current position 'i')
            // that has enough trailing zeros.
            for (int j = i; j < n; j++) {
                if (zerosCount[j] >= requiredZeros) {
                    foundRowIndex = j;
                    break;
                }
            }

            // If no row is found that satisfies the condition for the current position 'i',
            // it's impossible to make the grid valid.
            if (foundRowIndex == -1) {
                return -1;
            }

            // If the found row is not already at the correct position 'i',
            // we need to perform swaps.
            if (foundRowIndex != i) {
                // The number of swaps required to bring row 'foundRowIndex' to position 'i'
                // is the difference in their indices.
                totalSwaps += (foundRowIndex - i);

                // Simulate the swaps by shifting the elements in the zerosCount array.
                // This means moving the row from 'foundRowIndex' to 'i' by shifting all
                // elements from 'i' to 'foundRowIndex - 1' one position to the right.
                int temp = zerosCount[foundRowIndex]; // Store the count of the row being moved.
                for (int k = foundRowIndex; k > i; k--) {
                    zerosCount[k] = zerosCount[k - 1]; // Shift elements to the right.
                }
                zerosCount[i] = temp; // Place the correctly found row's zero count at position 'i'.
            }
        }

        // Return the total minimum swaps required.
        return totalSwaps;
    }
}
