```java
// Problem: Equal Sum Grid Partition I
// Link: https://leetcode.com/problems/equal-sum-grid-partition-i/
//
// Approach:
// The problem asks if we can partition a grid into two non-empty parts with equal sums by making a single horizontal or vertical cut.
//
// 1. Calculate the total sum of all elements in the grid. If the total sum is odd, it's impossible to partition it into two equal halves, so we can immediately return false.
//
// 2. Horizontal Cut:
//    Iterate through all possible horizontal cut positions (from row 0 to m-2).
//    For each cut position `i`, calculate the sum of elements in the top section (rows 0 to `i`) and the bottom section (rows `i+1` to m-1).
//    We can efficiently calculate these sums using prefix sums.
//    First, precompute row sums. For each row, calculate the sum of its elements.
//    Then, precompute prefix sums of these row sums. `rowPrefixSum[k]` will store the sum of elements from row 0 to row `k`.
//    If a horizontal cut is made after row `i`, the sum of the top section is `rowPrefixSum[i]`.
//    The sum of the bottom section is `totalSum - rowPrefixSum[i]`.
//    If `rowPrefixSum[i] == totalSum - rowPrefixSum[i]`, we have found a valid horizontal partition, so return true.
//
// 3. Vertical Cut:
//    Similarly, iterate through all possible vertical cut positions (from column 0 to n-2).
//    For each cut position `j`, calculate the sum of elements in the left section (columns 0 to `j`) and the right section (columns `j+1` to n-1).
//    Precompute column sums. For each column, calculate the sum of its elements.
//    Then, precompute prefix sums of these column sums. `colPrefixSum[k]` will store the sum of elements from column 0 to column `k`.
//    If a vertical cut is made after column `j`, the sum of the left section is `colPrefixSum[j]`.
//    The sum of the right section is `totalSum - colPrefixSum[j]`.
//    If `colPrefixSum[j] == totalSum - colPrefixSum[j]`, we have found a valid vertical partition, so return true.
//
// 4. If no valid partition is found after checking all possible horizontal and vertical cuts, return false.
//
// Time Complexity:
// - Calculating total sum: O(m*n)
// - Calculating row sums: O(m*n)
// - Calculating row prefix sums: O(m)
// - Checking horizontal cuts: O(m)
// - Calculating column sums: O(m*n)
// - Calculating column prefix sums: O(n)
// - Checking vertical cuts: O(n)
// The dominant factor is calculating the sums, which is O(m*n).
// Total time complexity: O(m*n)
//
// Space Complexity:
// - Storing row sums: O(m)
// - Storing row prefix sums: O(m)
// - Storing column sums: O(n)
// - Storing column prefix sums: O(n)
// Total space complexity: O(m + n)
class Solution {
    public boolean equalSum(int[][] grid) {
        int m = grid.length;
        int n = grid[0].length;

        // Calculate the total sum of all elements in the grid.
        long totalSum = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                totalSum += grid[i][j];
            }
        }

        // If the total sum is odd, it's impossible to partition into two equal halves.
        if (totalSum % 2 != 0) {
            return false;
        }

        // Precompute row sums and their prefix sums.
        long[] rowSums = new long[m];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                rowSums[i] += grid[i][j];
            }
        }

        long[] rowPrefixSum = new long[m];
        rowPrefixSum[0] = rowSums[0];
        for (int i = 1; i < m; i++) {
            rowPrefixSum[i] = rowPrefixSum[i - 1] + rowSums[i];
        }

        // Check for horizontal cuts.
        // A horizontal cut can be made after any row from 0 to m-2.
        // This ensures both resulting sections are non-empty.
        for (int i = 0; i < m - 1; i++) {
            // Sum of the top section (rows 0 to i)
            long topSum = rowPrefixSum[i];
            // Sum of the bottom section (rows i+1 to m-1)
            long bottomSum = totalSum - topSum;

            if (topSum == bottomSum) {
                return true; // Found a valid horizontal partition.
            }
        }

        // Precompute column sums and their prefix sums.
        long[] colSums = new long[n];
        for (int j = 0; j < n; j++) {
            for (int i = 0; i < m; i++) {
                colSums[j] += grid[i][j];
            }
        }

        long[] colPrefixSum = new long[n];
        colPrefixSum[0] = colSums[0];
        for (int j = 1; j < n; j++) {
            colPrefixSum[j] = colPrefixSum[j - 1] + colSums[j];
        }

        // Check for vertical cuts.
        // A vertical cut can be made after any column from 0 to n-2.
        // This ensures both resulting sections are non-empty.
        for (int j = 0; j < n - 1; j++) {
            // Sum of the left section (columns 0 to j)
            long leftSum = colPrefixSum[j];
            // Sum of the right section (columns j+1 to n-1)
            long rightSum = totalSum - leftSum;

            if (leftSum == rightSum) {
                return true; // Found a valid vertical partition.
            }
        }

        // If no valid partition was found after checking all possibilities.
        return false;
    }
}
```