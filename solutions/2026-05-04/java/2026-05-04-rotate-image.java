// Problem: Rotate Image
// Summary: Rotates an n x n 2D matrix representing an image by 90 degrees clockwise in-place.
// Link: https://leetcode.com/problems/rotate-image/
//
// Approach:
// The rotation can be achieved in two steps:
// 1. Transpose the matrix: Swap elements across the main diagonal. For an element matrix[i][j],
//    it will be swapped with matrix[j][i].
// 2. Reverse each row: After transposing, each row needs to be reversed to achieve the 90-degree
//    clockwise rotation.
//
// Example:
// For [[1,2,3],[4,5,6],[7,8,9]]
// After transpose: [[1,4,7],[2,5,8],[3,6,9]]
// After reversing each row: [[7,4,1],[8,5,2],[9,6,3]]
//
// Time Complexity: O(n^2)
// We iterate through roughly half of the elements for transposing (n*n/2) and then iterate through
// each row to reverse it (n*n). Therefore, the total time complexity is O(n^2).
//
// Space Complexity: O(1)
// The rotation is performed in-place, meaning we do not allocate any extra space for a new matrix.
// The modifications are done directly on the input matrix.

class Solution {
    /**
     * Rotates an n x n 2D matrix by 90 degrees clockwise in-place.
     *
     * @param matrix The n x n matrix to rotate.
     */
    public void rotate(int[][] matrix) {
        int n = matrix.length;

        // Step 1: Transpose the matrix
        // Iterate through the upper triangle of the matrix (including the diagonal is fine,
        // but we only need to swap elements once, so we iterate i from 0 to n-1 and j from i to n-1).
        // For each element matrix[i][j], swap it with matrix[j][i].
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                // Swap matrix[i][j] and matrix[j][i]
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }

        // Step 2: Reverse each row
        // Iterate through each row of the matrix.
        for (int i = 0; i < n; i++) {
            // Reverse the current row using two pointers: 'left' starting at the beginning
            // and 'right' starting at the end of the row.
            int left = 0;
            int right = n - 1;
            while (left < right) {
                // Swap the elements at the 'left' and 'right' pointers.
                int temp = matrix[i][left];
                matrix[i][left] = matrix[i][right];
                matrix[i][right] = temp;

                // Move the pointers towards the center.
                left++;
                right--;
            }
        }
    }
}
```