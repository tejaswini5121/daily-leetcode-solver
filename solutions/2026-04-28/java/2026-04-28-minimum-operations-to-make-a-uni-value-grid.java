// PROBLEM SUMMARY: Make all elements in a grid equal by adding/subtracting x.
// LINK: https://leetcode.com/problems/minimum-operations-to-make-a-uni-value-grid/
// APPROACH:
// 1. Flatten the grid into a 1D array.
// 2. Check if all elements have the same remainder when divided by x. If not, it's impossible, return -1.
// 3. Sort the flattened array.
// 4. The target value that minimizes operations is the median of the sorted array. This is because the sum of absolute differences is minimized at the median.
// 5. Calculate the total operations by summing the absolute differences between each element and the median, divided by x.
// TIME COMPLEXITY: O(m*n*log(m*n)) due to sorting the flattened array.
// SPACE COMPLEXITY: O(m*n) to store the flattened array.
class Solution {
    public int minOperations(int[][] grid, int x) {
        int m = grid.length;
        int n = grid[0].length;
        int size = m * n;
        int[] nums = new int[size];
        int index = 0;

        // Flatten the grid into a 1D array and check for divisibility by x.
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // If any element has a different remainder when divided by x, it's impossible to make them equal.
                if (index > 0 && nums[index - 1] % x != grid[i][j] % x) {
                    return -1;
                }
                nums[index++] = grid[i][j];
            }
        }

        // Sort the flattened array.
        java.util.Arrays.sort(nums);

        // The median of the sorted array is the optimal target value to minimize operations.
        int median = nums[size / 2];
        int operations = 0;

        // Calculate the total operations needed to make all elements equal to the median.
        for (int num : nums) {
            // The difference must be divisible by x. Since we already checked for same remainder, this is guaranteed.
            operations += Math.abs(num - median) / x;
        }

        return operations;
    }
}
