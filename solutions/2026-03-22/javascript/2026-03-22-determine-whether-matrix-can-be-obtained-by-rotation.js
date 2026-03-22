// Summary: Checks if a binary matrix 'mat' can be transformed into another binary matrix 'target' by rotating 'mat' 0, 90, 180, or 270 degrees clockwise.
// Link: https://leetcode.com/problems/determine-whether-matrix-can-be-obtained-by-rotation/
// Approach:
// The problem asks us to check if 'mat' can become 'target' after any number of 90-degree clockwise rotations.
// Since there are only 4 possible rotations (0, 90, 180, 270 degrees), we can simulate each rotation and compare the rotated matrix with 'target'.
// If any of the rotated matrices match 'target', we return true. If after checking all 4 rotations, none match, we return false.
//
// To rotate a matrix 90 degrees clockwise:
// The element at `mat[i][j]` moves to `rotated_mat[j][n - 1 - i]`, where `n` is the dimension of the matrix.
// We'll implement a helper function `rotateMatrix` that takes a matrix and returns its 90-degree clockwise rotated version.
//
// The main function `findRotation` will:
// 1. Check if the original `mat` is equal to `target`. If yes, return `true`.
// 2. Rotate `mat` 90 degrees clockwise to get `rotatedMat90`. Check if `rotatedMat90` equals `target`. If yes, return `true`.
// 3. Rotate `rotatedMat90` 90 degrees clockwise to get `rotatedMat180`. Check if `rotatedMat180` equals `target`. If yes, return `true`.
// 4. Rotate `rotatedMat180` 90 degrees clockwise to get `rotatedMat270`. Check if `rotatedMat270` equals `target`. If yes, return `true`.
// 5. If none of the above conditions are met, return `false`.
//
// A helper function `areMatricesEqual` will compare two matrices element by element.
//
// Time Complexity:
// Let N be the dimension of the square matrices (N x N).
// - Rotating a matrix takes O(N^2) time.
// - Comparing two matrices takes O(N^2) time.
// - We perform at most 4 rotations and 4 comparisons.
// Therefore, the total time complexity is O(4 * N^2) which simplifies to O(N^2).
//
// Space Complexity:
// - Each rotation creates a new matrix of size N x N.
// - The `areMatricesEqual` function uses O(1) extra space.
// - We store at most 3 rotated matrices at any given time (current, rotated 90, rotated 180, rotated 270).
// Therefore, the space complexity is O(N^2) due to the creation of rotated matrices.

/**
 * @param {number[][]} mat
 * @param {number[][]} target
 * @return {boolean}
 */
var findRotation = function(mat, target) {
    const n = mat.length;

    // Helper function to check if two matrices are equal
    const areMatricesEqual = (matrix1, matrix2) => {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (matrix1[i][j] !== matrix2[i][j]) {
                    return false; // Matrices are not equal if any element mismatches
                }
            }
        }
        return true; // All elements matched, matrices are equal
    };

    // Helper function to rotate a matrix 90 degrees clockwise
    const rotateMatrix = (matrix) => {
        const rotated = Array(n).fill(0).map(() => Array(n).fill(0)); // Initialize a new n x n matrix
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                // The element at original[i][j] moves to rotated[j][n - 1 - i]
                rotated[j][n - 1 - i] = matrix[i][j];
            }
        }
        return rotated; // Return the newly created rotated matrix
    };

    let currentMat = mat; // Start with the original matrix

    // Check for 0-degree rotation (original matrix)
    if (areMatricesEqual(currentMat, target)) {
        return true;
    }

    // Check for 90-degree rotation
    currentMat = rotateMatrix(currentMat);
    if (areMatricesEqual(currentMat, target)) {
        return true;
    }

    // Check for 180-degree rotation
    currentMat = rotateMatrix(currentMat);
    if (areMatricesEqual(currentMat, target)) {
        return true;
    }

    // Check for 270-degree rotation
    currentMat = rotateMatrix(currentMat);
    if (areMatricesEqual(currentMat, target)) {
        return true;
    }

    // If none of the rotations match the target, return false
    return false;
};
