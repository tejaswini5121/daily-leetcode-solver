```java
/**
 * Problem Summary: Count special positions in a binary matrix where a '1' is the only '1' in its row and column.
 * Link: https://leetcode.com/problems/special-positions-in-a-binary-matrix/
 *
 * Approach:
 * 1. Precompute the sum of ones for each row and each column.
 * 2. Iterate through the matrix. If a cell `mat[i][j]` contains a '1', check if the sum of its row is 1 and the sum of its column is 1.
 * 3. If both conditions are met, increment the count of special positions.
 *
 * Time Complexity: O(m * n), where m is the number of rows and n is the number of columns.
 * We iterate through the matrix twice: once to calculate row sums, once to calculate column sums, and then once more to check for special positions.
 *
 * Space Complexity: O(m + n), where m is the number of rows and n is the number of columns.
 * We use two arrays to store the sum of ones for each row and column.
 */
class Solution {
    /**
     * Counts the number of special positions in a binary matrix.
     *
     * @param mat The input binary matrix.
     * @return The number of special positions.
     */
    public int numSpecial(int[][] mat) {
        int m = mat.length;
        int n = mat[0].length;

        // Array to store the sum of ones in each row
        int[] rowSum = new int[m];
        // Array to store the sum of ones in each column
        int[] colSum = new int[n];

        // Calculate row sums and column sums
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                rowSum[i] += mat[i][j];
                colSum[j] += mat[i][j];
            }
        }

        int specialCount = 0;
        // Iterate through the matrix to find special positions
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // A position (i, j) is special if mat[i][j] is 1,
                // and it's the only 1 in its row (rowSum[i] == 1),
                // and it's the only 1 in its column (colSum[j] == 1).
                if (mat[i][j] == 1 && rowSum[i] == 1 && colSum[j] == 1) {
                    specialCount++;
                }
            }
        }

        return specialCount;
    }
}
```