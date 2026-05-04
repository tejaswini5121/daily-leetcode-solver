// Problem: Rotate Image
// Summary: Rotate an n x n 2D matrix by 90 degrees clockwise in-place.
// Link: https://leetcode.com/problems/rotate-image/
//
// Approach:
// The rotation can be achieved in two steps:
// 1. Transpose the matrix: Swap elements across the main diagonal. For an element at matrix[i][j], swap it with matrix[j][i].
// 2. Reverse each row: After transposing, each row needs to be reversed to achieve the 90-degree clockwise rotation.
//
// Example:
// [[1, 2, 3],
//  [4, 5, 6],
//  [7, 8, 9]]
//
// After Transpose:
// [[1, 4, 7],
//  [2, 5, 8],
//  [3, 6, 9]]
//
// After Reversing Each Row:
// [[7, 4, 1],
//  [8, 5, 2],
//  [9, 6, 3]]
//
// Time Complexity: O(n^2)
// We iterate through roughly half of the elements for the transpose operation (n/2 * n) and then iterate through all n^2 elements to reverse the rows.
//
// Space Complexity: O(1)
// The rotation is performed in-place, meaning no additional significant space is allocated.
//
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
    const n = matrix.length;

    // 1. Transpose the matrix
    // Iterate through the upper triangle of the matrix (including the diagonal)
    // and swap elements matrix[i][j] with matrix[j][i].
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            // Swap elements using a temporary variable
            const temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }

    // 2. Reverse each row
    // Iterate through each row of the transposed matrix and reverse it.
    for (let i = 0; i < n; i++) {
        // Use two pointers, one from the start and one from the end of the row,
        // and swap elements until they meet.
        let left = 0;
        let right = n - 1;
        while (left < right) {
            // Swap elements
            const temp = matrix[i][left];
            matrix[i][left] = matrix[i][right];
            matrix[i][right] = temp;
            // Move pointers inwards
            left++;
            right--;
        }
    }
};
```