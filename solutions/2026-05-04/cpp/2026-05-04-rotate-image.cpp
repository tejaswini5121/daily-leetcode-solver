// Problem: Rotate Image
// Summary: Rotates an n x n 2D matrix representing an image by 90 degrees clockwise in-place.
// Link: https://leetcode.com/problems/rotate-image/
//
// Approach:
// The rotation can be achieved in two main steps:
// 1. Transpose the matrix: Swap elements across the main diagonal. For an element at (row, col),
//    it will be swapped with the element at (col, row).
// 2. Reverse each row: After transposing, each row needs to be reversed to achieve the 90-degree clockwise rotation.
//
// Example Walkthrough (3x3 matrix):
// Original:
// 1 2 3
// 4 5 6
// 7 8 9
//
// After Transpose:
// 1 4 7
// 2 5 8
// 3 6 9
//
// After Reversing Each Row:
// 7 4 1
// 8 5 2
// 9 6 3
//
// Time Complexity:
// O(n^2), where n is the dimension of the square matrix.
// Transposing takes O(n^2) operations (iterating through roughly half the elements).
// Reversing each row takes O(n^2) operations (iterating through n rows, each of length n).
// Total is O(n^2) + O(n^2) = O(n^2).
//
// Space Complexity:
// O(1), as the rotation is performed in-place without using any extra significant space.
// We only use a few temporary variables for swapping.

#include <vector>
#include <algorithm> // For std::swap and std::reverse

class Solution {
public:
    void rotate(std::vector<std::vector<int>>& matrix) {
        int n = matrix.size(); // Get the dimension of the square matrix

        // Step 1: Transpose the matrix
        // Iterate through the upper triangle of the matrix (including the diagonal if we were to swap with self)
        // We only need to iterate through the upper triangle because swapping (i, j) with (j, i)
        // automatically handles the lower triangle as well.
        for (int i = 0; i < n; ++i) {
            for (int j = i + 1; j < n; ++j) {
                // Swap element at (i, j) with element at (j, i)
                std::swap(matrix[i][j], matrix[j][i]);
            }
        }

        // Step 2: Reverse each row
        // Iterate through each row of the transposed matrix
        for (int i = 0; i < n; ++i) {
            // Reverse the current row in-place
            std::reverse(matrix[i].begin(), matrix[i].end());
        }
    }
};
