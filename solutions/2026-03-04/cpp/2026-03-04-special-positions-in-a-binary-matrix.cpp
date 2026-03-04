// Problem: Special Positions in a Binary Matrix
// Link: https://leetcode.com/problems/special-positions-in-a-binary-matrix/
//
// Approach:
// We need to count the number of cells (i, j) where mat[i][j] is 1 and
// all other elements in the same row 'i' and same column 'j' are 0.
//
// A straightforward approach is to iterate through each cell of the matrix.
// If a cell mat[i][j] contains a 1, we then check its entire row and column.
// To efficiently check rows and columns, we can precompute the sum of each row
// and the sum of each column.
//
// For each cell (i, j):
// 1. If mat[i][j] == 1:
//    a. Check if the sum of row 'i' is exactly 1.
//    b. Check if the sum of column 'j' is exactly 1.
//    c. If both conditions are true, then (i, j) is a special position.
//
// Time Complexity:
// O(m * n), where 'm' is the number of rows and 'n' is the number of columns.
// We iterate through the matrix once to compute row sums and column sums,
// which takes O(m*n). Then, we iterate through the matrix again to check
// each cell and its corresponding precomputed sums, which also takes O(m*n).
//
// Space Complexity:
// O(m + n), for storing the sums of each row and each column.
// We use two arrays (or vectors): one of size 'm' for row sums and one of size 'n' for column sums.

#include <vector>
#include <numeric> // For std::accumulate

class Solution {
public:
    int numSpecial(std::vector<std::vector<int>>& mat) {
        int m = mat.size();
        int n = mat[0].size();

        // Vectors to store the sum of each row and each column.
        // row_sums[i] will store the sum of elements in row i.
        // col_sums[j] will store the sum of elements in column j.
        std::vector<int> row_sums(m, 0);
        std::vector<int> col_sums(n, 0);

        // First pass: Compute the sum of each row and each column.
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                row_sums[i] += mat[i][j];
                col_sums[j] += mat[i][j];
            }
        }

        int special_positions_count = 0;

        // Second pass: Iterate through the matrix to find special positions.
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                // A position (i, j) is special if:
                // 1. The element at mat[i][j] is 1.
                // 2. The sum of row 'i' is exactly 1 (meaning only mat[i][j] is 1 in this row).
                // 3. The sum of column 'j' is exactly 1 (meaning only mat[i][j] is 1 in this column).
                if (mat[i][j] == 1 && row_sums[i] == 1 && col_sums[j] == 1) {
                    special_positions_count++;
                }
            }
        }

        return special_positions_count;
    }
};
