// Problem: Minimum Swaps to Arrange a Binary Grid
// Link: https://leetcode.com/problems/minimum-swaps-to-arrange-a-binary-grid/
//
// Approach:
// The goal is to make the grid valid, meaning all cells above the main diagonal are zeros.
// This is equivalent to saying that for each row `i` (0-indexed), there must be at least `n - 1 - i` zeros from the right end of the row.
// We can precompute the number of trailing zeros for each row.
// Then, we iterate through the rows from top to bottom (0 to n-1). For each row `i`, we need to find a row `j` (where `j >= i`) that has enough trailing zeros (at least `n - 1 - i`).
// We greedily pick the first such row `j` that satisfies the condition and swap it up to position `i`.
// The number of swaps required to move row `j` to position `i` is `j - i`.
// If at any point we cannot find a suitable row for the current position `i`, it means the grid cannot be made valid, and we return -1.
//
// Time Complexity:
// Precomputing trailing zeros for each row: O(n^2)
// Iterating through rows and finding swaps: In the worst case, for each row `i`, we might scan up to `n-i` rows. The total swaps might be up to O(n^2). However, each swap operation effectively moves one row into its correct position. The total number of swaps is at most O(n^2).
// Overall Time Complexity: O(n^2)
//
// Space Complexity:
// Storing the count of trailing zeros for each row: O(n)
// Overall Space Complexity: O(n)

/**
 * @param {number[][]} grid
 * @return {number}
 */
const minSwaps = function(grid) {
    const n = grid.length;

    // Step 1: Precompute the number of trailing zeros for each row.
    // A row is "valid" for position `i` if it has at least `n - 1 - i` trailing zeros.
    const trailingZeros = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        let count = 0;
        // Iterate from the right of the row to count trailing zeros.
        for (let j = n - 1; j >= 0; j--) {
            if (grid[i][j] === 0) {
                count++;
            } else {
                // As soon as we encounter a '1', we stop counting trailing zeros for this row.
                break;
            }
        }
        trailingZeros[i] = count;
    }

    let totalSwaps = 0;

    // Step 2: Iterate through each row position `i` from top to bottom.
    for (let i = 0; i < n; i++) {
        // The required number of trailing zeros for row `i` to be valid at this position.
        const requiredZeros = n - 1 - i;

        // Step 3: Find the first row `j` (where `j >= i`) that satisfies the condition.
        let foundRowIndex = -1;
        for (let j = i; j < n; j++) {
            if (trailingZeros[j] >= requiredZeros) {
                foundRowIndex = j;
                break; // Found the first suitable row.
            }
        }

        // Step 4: If no suitable row is found, the grid cannot be made valid.
        if (foundRowIndex === -1) {
            return -1;
        }

        // Step 5: If a suitable row is found at `foundRowIndex`, move it to position `i`.
        // This requires `foundRowIndex - i` swaps.
        totalSwaps += (foundRowIndex - i);

        // Step 6: Update the `trailingZeros` array to reflect the swap.
        // The row at `foundRowIndex` is moved to `i`. So, we need to shift the elements
        // from `foundRowIndex - 1` down to `i` by one position to the right.
        const rowToMove = trailingZeros[foundRowIndex];
        for (let k = foundRowIndex; k > i; k--) {
            trailingZeros[k] = trailingZeros[k - 1];
        }
        trailingZeros[i] = rowToMove;
    }

    // If we successfully placed all rows, return the total number of swaps.
    return totalSwaps;
};
