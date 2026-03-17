// Problem: Largest Submatrix With Rearrangements
// Problem Description: Find the largest rectangular submatrix of 1s in a binary matrix after rearranging columns.
// Link: https://leetcode.com/problems/largest-submatrix-with-rearrangements/
//
// Approach:
// The core idea is that for any given row, the height of a rectangle of 1s ending at that row is determined by the consecutive number of 1s upwards from that cell.
// If we have a set of columns, and we want to form a rectangle of height 'h' and width 'w' using these columns, all columns must have at least 'h' consecutive 1s ending at the current row.
// To maximize the area for a given row, we should sort the heights of consecutive 1s upwards for each column in descending order.
// Then, for each row, iterate through the sorted heights. If a height is 'h', it means we can form a rectangle of height 'h' with the current column and all the columns to its left that also have a height of at least 'h'.
// So, if we have 'k' columns with heights greater than or equal to 'h', the area formed would be h * k. We iterate through all possible 'k' values (from 1 to the number of columns) for each row and find the maximum area.
//
// Specifically, we first compute for each cell `matrix[i][j]`, the number of consecutive 1s upwards, including itself. Let's call this `heights[i][j]`.
// If `matrix[i][j]` is 0, then `heights[i][j]` is 0.
// If `matrix[i][j]` is 1, then `heights[i][j] = heights[i-1][j] + 1` (for i > 0), and `heights[0][j] = 1`.
// After computing the `heights` matrix, for each row `i`, we sort the `heights[i]` array in descending order.
// Then, for each row `i`, we iterate from `j = 0` to `n-1`. The current height is `heights[i][j]`. This height can be extended to the right by `j+1` columns (the current column and `j` columns to its left that also have at least this height).
// The potential area is `heights[i][j] * (j + 1)`. We keep track of the maximum area found across all rows and all columns.
//
// Time Complexity Analysis:
// 1. Computing the `heights` matrix: O(m * n)
// 2. For each row (m rows):
//    a. Sorting the heights array of size n: O(n log n)
//    b. Iterating through the sorted heights to find max area: O(n)
// Total time for processing all rows: m * (O(n log n) + O(n)) = O(m * n log n)
// Overall Time Complexity: O(m * n log n)
//
// Space Complexity Analysis:
// We use an additional matrix `heights` of size m x n to store the heights.
// Overall Space Complexity: O(m * n)
//
class Solution {
    public int largestSubmatrix(int[][] matrix) {
        int m = matrix.length;
        int n = matrix[0].length;
        int maxArea = 0;

        // Step 1: Compute heights matrix.
        // `heights[i][j]` will store the number of consecutive 1s ending at `matrix[i][j]` and going upwards.
        int[][] heights = new int[m][n];

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (matrix[i][j] == 1) {
                    // If the current cell is 1, the height is 1 plus the height of the cell directly above it.
                    // If it's the first row (i=0), the height is just 1.
                    heights[i][j] = (i == 0) ? 1 : heights[i - 1][j] + 1;
                } else {
                    // If the current cell is 0, the height is 0.
                    heights[i][j] = 0;
                }
            }
        }

        // Step 2: For each row, sort the heights and calculate the maximum area.
        for (int i = 0; i < m; i++) {
            // Sort the heights in the current row in descending order.
            // This allows us to consider wider rectangles more easily.
            // `Arrays.sort()` sorts in ascending order, so we need to reverse the logic or use custom comparator.
            // A simpler way is to sort ascending and then iterate backwards, or sort ascending and then reverse.
            // For this problem, we want to iterate through the sorted heights and for each height `h`, it can extend
            // to the right by `j+1` columns if all those `j+1` columns have a height of at least `h`.
            // Sorting descending makes this direct. If `heights[i]` is sorted as `[h1, h2, h3, ...]` where `h1 >= h2 >= h3 >= ...`,
            // then `h1` can form a rectangle of `h1 * 1`, `h2` can form `h2 * 2`, `h3` can form `h3 * 3`, etc.
            // So, we sort in descending order.
            
            // Create a temporary array to sort heights of the current row.
            // This is a common optimization to avoid modifying the `heights` array directly if we were to sort in place and then iterate.
            // Or, we can sort in place if we are careful. Let's sort in place.
            
            // Sort `heights[i]` in descending order.
            // The standard `Arrays.sort` sorts in ascending order. We can use a lambda for descending sort or sort and reverse.
            // Let's sort ascending and then iterate backwards to get the descending effect.
            java.util.Arrays.sort(heights[i]);

            // Iterate through the sorted heights from right to left (largest to smallest).
            for (int j = n - 1; j >= 0; j--) {
                // The current height is `heights[i][j]`.
                // Since the array is sorted ascending, `heights[i][j]` is the j-th smallest height.
                // However, when iterating from `n-1` down to `0`, `heights[i][j]` represents
                // the (n-1-j)-th largest height.
                // If we are at index `k` in the original array (before sorting), and after sorting, its value is `v`,
                // and it appears at index `p` in the sorted array (where `p` is `n-1-j` if `v` is the (n-1-j)-th largest),
                // this means there are `n - p` columns with heights greater than or equal to `v`.
                // So, the number of columns with height at least `heights[i][j]` is `j + 1` (because `heights[i][j]` is the `j`-th element from the right, including itself).
                
                // Current height is `heights[i][j]`.
                // Number of columns that have a height of at least `heights[i][j]` is `j + 1`.
                // This is because `heights[i][j]` is the (n-1-j)-th largest height, and all elements from `j` to `n-1` are greater than or equal to `heights[i][j]`.
                // So there are `(n-1) - j + 1 = n - j` columns. Wait, this is incorrect.
                
                // Let's re-evaluate. If `heights[i]` is sorted in ascending order: `[h_0, h_1, ..., h_{n-1}]`.
                // When we iterate from `j = n-1` down to `0`:
                // At `j = n-1`: `heights[i][n-1]` is the largest height. It can form a rectangle of width 1. Area = `heights[i][n-1] * 1`.
                // At `j = n-2`: `heights[i][n-2]` is the second largest height. All columns with height `heights[i][n-1]` and `heights[i][n-2]` are considered. There are 2 such columns. Area = `heights[i][n-2] * 2`.
                // At `j = k`: `heights[i][k]` is the `(n-1-k)`-th largest height. The number of columns with height at least `heights[i][k]` is `n-k`.
                // So, for each `j` from `n-1` down to `0`, the potential area is `heights[i][j] * (n - j)`.
                
                int currentHeight = heights[i][j];
                int width = n - j; // The number of columns that have a height of at least `currentHeight`.
                maxArea = Math.max(maxArea, currentHeight * width);
            }
        }

        return maxArea;
    }
}
