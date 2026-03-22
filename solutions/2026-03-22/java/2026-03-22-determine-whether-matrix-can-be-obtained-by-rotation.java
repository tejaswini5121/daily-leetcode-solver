// Problem: Determine Whether Matrix Can Be Obtained By Rotation
// Link: https://leetcode.com/problems/determine-whether-matrix-can-be-obtained-by-rotation/
//
// Approach:
// The problem asks if a given matrix `mat` can be transformed into another matrix `target`
// by rotating `mat` by 0, 90, 180, or 270 degrees clockwise.
// We can simulate these rotations and check if any of the rotated matrices match `target`.
//
// There are four possible orientations to check:
// 1. Original matrix (0-degree rotation).
// 2. 90-degree clockwise rotation.
// 3. 180-degree clockwise rotation (equivalent to two 90-degree rotations).
// 4. 270-degree clockwise rotation (equivalent to three 90-degree rotations).
//
// To perform a 90-degree clockwise rotation of an n x n matrix:
// The element at `mat[i][j]` moves to `rotated_mat[j][n - 1 - i]`.
//
// We can implement a helper function `rotate(matrix)` that returns a new matrix
// representing the 90-degree clockwise rotation of the input matrix.
//
// Then, we check the following:
// - Is `mat` equal to `target`?
// - Rotate `mat` once and check if it equals `target`.
// - Rotate `mat` twice and check if it equals `target`.
// - Rotate `mat` thrice and check if it equals `target`.
//
// If any of these checks return true, we return true. Otherwise, after checking all
// four orientations, we return false.
//
// The comparison of two matrices `mat1` and `mat2` can be done by iterating through
// all elements and checking if `mat1[i][j] == mat2[i][j]` for all `i` and `j`.
//
// Time Complexity:
// Let `n` be the dimension of the square matrices.
// - Each rotation takes O(n^2) time to create a new matrix.
// - Comparing two matrices takes O(n^2) time.
// - We perform at most 4 rotations and 4 comparisons.
// - Therefore, the total time complexity is O(4 * n^2) = O(n^2).
//
// Space Complexity:
// - Each rotation creates a new n x n matrix, which takes O(n^2) space.
// - Since we do this at most 4 times (but we can optimize by reusing space or just storing one rotated matrix at a time),
//   the dominant space complexity comes from storing the rotated matrix.
// - Thus, the space complexity is O(n^2).
class Solution {
    // Function to check if two matrices are equal.
    private boolean areMatricesEqual(int[][] mat1, int[][] mat2) {
        int n = mat1.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (mat1[i][j] != mat2[i][j]) {
                    return false; // Matrices differ at this element
                }
            }
        }
        return true; // All elements are equal
    }

    // Function to rotate a matrix 90 degrees clockwise.
    // Returns a new matrix, does not modify the original.
    private int[][] rotate90Clockwise(int[][] matrix) {
        int n = matrix.length;
        int[][] rotatedMatrix = new int[n][n]; // Create a new matrix for the rotated version

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                // The element at matrix[i][j] moves to rotatedMatrix[j][n - 1 - i]
                rotatedMatrix[j][n - 1 - i] = matrix[i][j];
            }
        }
        return rotatedMatrix; // Return the newly created rotated matrix
    }

    // Main function to determine if target can be obtained by rotating mat.
    public boolean findRotation(int[][] mat, int[][] target) {
        // Check all four possible rotations: 0, 90, 180, 270 degrees.
        
        int[][] currentMat = mat; // Start with the original matrix

        // Check 0-degree rotation (original matrix)
        if (areMatricesEqual(currentMat, target)) {
            return true;
        }

        // Check 90-degree rotation
        currentMat = rotate90Clockwise(currentMat); // Rotate mat by 90 degrees
        if (areMatricesEqual(currentMat, target)) {
            return true;
        }

        // Check 180-degree rotation (rotate again)
        currentMat = rotate90Clockwise(currentMat); // Rotate the already 90-degree rotated matrix by 90 degrees
        if (areMatricesEqual(currentMat, target)) {
            return true;
        }

        // Check 270-degree rotation (rotate again)
        currentMat = rotate90Clockwise(currentMat); // Rotate the already 180-degree rotated matrix by 90 degrees
        if (areMatricesEqual(currentMat, target)) {
            return true;
        }

        // If none of the rotations match the target, return false.
        return false;
    }
}
