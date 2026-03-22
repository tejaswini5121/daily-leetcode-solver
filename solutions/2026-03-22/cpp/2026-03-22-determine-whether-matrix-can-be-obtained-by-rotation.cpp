// Problem: Determine Whether Matrix Can Be Obtained By Rotation
// Link: https://leetcode.com/problems/determine-whether-matrix-can-be-obtained-by-rotation/
//
// Approach:
// The problem asks if a given matrix `mat` can be transformed into another matrix `target`
// by rotating `mat` by 90, 180, or 270 degrees clockwise.
// We can simulate these rotations and check for equality with `target` after each rotation.
//
// There are at most 3 distinct rotations (0, 90, 180, 270 degrees) to check.
// If `mat` is already equal to `target`, we return true.
// Otherwise, we rotate `mat` 90 degrees clockwise and check for equality again.
// We repeat this process two more times for 180 and 270 degrees.
// If after all four possibilities (original and three rotations), `mat` does not match `target`,
// then it's impossible, and we return false.
//
// To rotate a matrix 90 degrees clockwise:
// An element at `mat[i][j]` moves to `rotated_mat[j][n - 1 - i]`, where `n` is the dimension of the matrix.
//
// Time Complexity:
// Let `n` be the dimension of the square matrix.
// We perform at most 4 matrix comparisons and at most 3 matrix rotations.
// Matrix comparison takes O(n^2) time.
// Matrix rotation takes O(n^2) time.
// Therefore, the total time complexity is O(4 * n^2) which simplifies to O(n^2).
//
// Space Complexity:
// We need to create a temporary matrix to store the rotated version of `mat`.
// This temporary matrix will also be of size n x n.
// Thus, the space complexity is O(n^2).

#include <vector>
#include <iostream>

class Solution {
public:
    // Function to check if two matrices are equal.
    bool areMatricesEqual(const std::vector<std::vector<int>>& mat1, const std::vector<std::vector<int>>& mat2) {
        int n = mat1.size();
        // Iterate through each element of the matrices.
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                // If any element doesn't match, the matrices are not equal.
                if (mat1[i][j] != mat2[i][j]) {
                    return false;
                }
            }
        }
        // If all elements match, the matrices are equal.
        return true;
    }

    // Function to rotate a matrix 90 degrees clockwise.
    std::vector<std::vector<int>> rotateMatrix(const std::vector<std::vector<int>>& mat) {
        int n = mat.size();
        // Create a new matrix to store the rotated version.
        std::vector<std::vector<int>> rotated_mat(n, std::vector<int>(n));
        // Apply the rotation logic: mat[i][j] becomes rotated_mat[j][n - 1 - i].
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                rotated_mat[j][n - 1 - i] = mat[i][j];
            }
        }
        // Return the rotated matrix.
        return rotated_mat;
    }

    // Main function to determine if target can be obtained by rotating mat.
    bool findRotation(std::vector<std::vector<int>>& mat, std::vector<std::vector<int>>& target) {
        // We check up to 4 possibilities:
        // 0 degrees rotation (original mat)
        // 90 degrees rotation
        // 180 degrees rotation
        // 270 degrees rotation

        for (int k = 0; k < 4; ++k) {
            // After 0 rotations, `mat` is the original matrix.
            // In subsequent iterations, `mat` will be the rotated version from the previous step.
            // Check if the current `mat` is equal to `target`.
            if (areMatricesEqual(mat, target)) {
                // If they are equal, we found a valid rotation.
                return true;
            }
            // If not equal, rotate `mat` 90 degrees clockwise for the next iteration.
            mat = rotateMatrix(mat);
        }

        // If after all 4 checks (0, 90, 180, 270 degrees), `mat` never equaled `target`,
        // then it's impossible to obtain `target` by rotating `mat`.
        return false;
    }
};
