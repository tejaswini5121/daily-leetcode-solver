// Problem: Equal Sum Grid Partition I
// Summary: Determine if a grid can be split into two equal-sum parts with a single horizontal or vertical cut.
// Link: https://leetcode.com/problems/equal-sum-grid-partition-i/
//
// Approach:
// The problem asks if we can make a single horizontal or vertical cut to divide the grid into two non-empty parts with equal sums.
//
// 1. Calculate the total sum of all elements in the grid. This will be useful for checking if a partition sum is exactly half of the total.
//
// 2. Horizontal Cuts:
//    - Iterate through each possible horizontal cut position (i.e., between row `i` and `i+1`, where `0 <= i < m-1`).
//    - For each cut, calculate the sum of elements in the top part (rows 0 to `i`) and the bottom part (rows `i+1` to `m-1`).
//    - A more efficient way to do this is to precompute prefix sums for rows. We can calculate the sum of each row and then compute the prefix sums of these row sums.
//    - Let `rowSums[i]` be the sum of elements in row `i`.
//    - Let `prefixRowSums[i]` be the sum of `rowSums[0]` to `rowSums[i]`.
//    - The sum of the top part for a cut after row `i` is `prefixRowSums[i]`.
//    - The sum of the bottom part is `totalSum - prefixRowSums[i]`.
//    - If `prefixRowSums[i] * 2 == totalSum`, then we have found a valid horizontal partition.
//
// 3. Vertical Cuts:
//    - Similarly, iterate through each possible vertical cut position (i.e., between column `j` and `j+1`, where `0 <= j < n-1`).
//    - For each cut, calculate the sum of elements in the left part (columns 0 to `j`) and the right part (columns `j+1` to `n-1`).
//    - Precompute prefix sums for columns. We can calculate the sum of each column and then compute the prefix sums of these column sums.
//    - Let `colSums[j]` be the sum of elements in column `j`.
//    - Let `prefixColSums[j]` be the sum of `colSums[0]` to `colSums[j]`.
//    - The sum of the left part for a cut after column `j` is `prefixColSums[j]`.
//    - The sum of the right part is `totalSum - prefixColSums[j]`.
//    - If `prefixColSums[j] * 2 == totalSum`, then we have found a valid vertical partition.
//
// 4. Return `true` if any valid partition is found, otherwise return `false`.
//
// Time Complexity Analysis:
// - Calculating the total sum: O(m*n)
// - Calculating row sums and their prefix sums: O(m*n)
// - Checking horizontal cuts: O(m)
// - Calculating column sums and their prefix sums: O(m*n)
// - Checking vertical cuts: O(n)
// The dominant part is calculating the sums, which is O(m*n).
// However, since m * n <= 10^5, we can consider the overall complexity to be efficient.
// If we consider the constraints for m and n separately, where m or n can be up to 10^5 (but not both simultaneously if m*n <= 10^5),
// then the prefix sum calculation for rows is O(m*n) and for columns is O(n*m).
// The check for horizontal cuts is O(m) and for vertical cuts is O(n).
// The most efficient way to calculate sums for prefix sum arrays is to iterate through the grid once.
//
// Let's refine the complexity:
// 1. Calculate `totalSum`: O(m * n)
// 2. Calculate `rowPrefixSums`:
//    - First, calculate sum of each row: O(m * n)
//    - Then, calculate prefix sums of these row sums: O(m)
// 3. Check horizontal cuts: O(m)
// 4. Calculate `colPrefixSums`:
//    - First, calculate sum of each column: O(m * n)
//    - Then, calculate prefix sums of these column sums: O(n)
// 5. Check vertical cuts: O(n)
//
// The total time complexity is dominated by the initial sum calculations, which is O(m * n).
// Given m * n <= 10^5, this is acceptable.
//
// Space Complexity Analysis:
// - Storing `rowPrefixSums`: O(m)
// - Storing `colPrefixSums`: O(n)
// - Storing `rowSums` (intermediate for row prefix sums): O(m)
// - Storing `colSums` (intermediate for col prefix sums): O(n)
// In total, the space complexity is O(m + n).
// Since m * n <= 10^5, the maximum value of m or n can be 10^5, so O(m+n) is appropriate.
// If m and n were independent and could both be large, this would be an issue, but the constraint m*n <= 10^5 limits this.

const equalSumPartition = (grid) => {
    const m = grid.length;
    const n = grid[0].length;

    let totalSum = 0;

    // Calculate the total sum of all elements in the grid.
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            totalSum += grid[i][j];
        }
    }

    // If the total sum is odd, it's impossible to partition into two equal sums.
    if (totalSum % 2 !== 0) {
        return false;
    }

    const targetSum = totalSum / 2;

    // --- Check for Horizontal Cuts ---

    // Calculate the prefix sums for rows.
    // rowPrefixSums[i] will store the sum of elements from row 0 to row i.
    const rowPrefixSums = new Array(m).fill(0);
    let currentRowSum = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            currentRowSum += grid[i][j];
        }
        rowPrefixSums[i] = currentRowSum;
    }

    // Iterate through possible horizontal cut positions.
    // A cut after row `i` means the top partition includes rows 0 to `i`.
    // We need to ensure the partition is non-empty, so the cut cannot be after the last row (i.e., i < m-1).
    for (let i = 0; i < m - 1; i++) {
        // The sum of the top partition is rowPrefixSums[i].
        // If this sum equals the target sum, we have a valid partition.
        if (rowPrefixSums[i] === targetSum) {
            return true;
        }
    }

    // --- Check for Vertical Cuts ---

    // Calculate the prefix sums for columns.
    // colPrefixSums[j] will store the sum of elements from column 0 to column j.
    const colPrefixSums = new Array(n).fill(0);
    let currentColSum = 0;
    for (let j = 0; j < n; j++) {
        for (let i = 0; i < m; i++) {
            currentColSum += grid[i][j];
        }
        colPrefixSums[j] = currentColSum;
    }

    // Iterate through possible vertical cut positions.
    // A cut after column `j` means the left partition includes columns 0 to `j`.
    // We need to ensure the partition is non-empty, so the cut cannot be after the last column (i.e., j < n-1).
    for (let j = 0; j < n - 1; j++) {
        // The sum of the left partition is colPrefixSums[j].
        // If this sum equals the target sum, we have a valid partition.
        if (colPrefixSums[j] === targetSum) {
            return true;
        }
    }

    // If no valid horizontal or vertical partition was found, return false.
    return false;
};
