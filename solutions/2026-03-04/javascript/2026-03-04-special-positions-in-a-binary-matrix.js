// Problem Summary: Count cells in a binary matrix that have a 1 and are the only 1 in their row and column.
// Problem Link: https://leetcode.com/problems/special-positions-in-a-binary-matrix/
// Approach:
// 1. Precompute the sum of 1s for each row and each column.
// 2. Iterate through the matrix. If a cell contains a 1, check if its corresponding row sum and column sum are both 1.
// 3. If both conditions are met, increment the count of special positions.
// Time Complexity: O(m * n), where m is the number of rows and n is the number of columns. We iterate through the matrix once to calculate sums and once to count special positions.
// Space Complexity: O(m + n), for storing the row sums and column sums.
const numSpecial = function(mat) {
    const m = mat.length;
    const n = mat[0].length;

    // Initialize arrays to store the sum of 1s in each row and column.
    const rowSums = new Array(m).fill(0);
    const colSums = new Array(n).fill(0);

    // Calculate the sum of 1s for each row and column.
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (mat[i][j] === 1) {
                rowSums[i]++;
                colSums[j]++;
            }
        }
    }

    let specialCount = 0;

    // Iterate through the matrix again to find special positions.
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            // A position (i, j) is special if it contains a 1 and is the only 1 in its row and column.
            if (mat[i][j] === 1 && rowSums[i] === 1 && colSums[j] === 1) {
                specialCount++;
            }
        }
    }

    // Return the total count of special positions.
    return specialCount;
};
