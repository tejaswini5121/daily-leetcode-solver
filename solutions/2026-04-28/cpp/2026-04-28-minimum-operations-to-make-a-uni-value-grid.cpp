```cpp
// Problem: Minimum Operations to Make a Uni-Value Grid
// Link: https://leetcode.com/problems/minimum-operations-to-make-a-uni-value-grid/
// Approach:
// 1. Flatten the grid into a single 1D array.
// 2. Check if all elements in the flattened array have the same remainder when divided by x.
//    If not, it's impossible to make the grid uni-value, so return -1.
// 3. If they do have the same remainder, sort the flattened array.
// 4. The target value for the uni-value grid must be one of the elements in the sorted array.
//    The median element is the optimal choice to minimize the total number of operations.
//    This is because the sum of absolute differences is minimized when the target is the median.
// 5. Calculate the total operations needed to make all elements equal to the median.
//    For each element `val` in the flattened array, the number of operations is `abs(val - median) / x`.
//    Sum these operations up.
// Time Complexity: O(N log N), where N is the total number of elements in the grid (m * n).
//                  This is dominated by sorting the flattened array.
// Space Complexity: O(N) for storing the flattened array.
#include <vector>
#include <numeric>
#include <algorithm>
#include <cmath>

class Solution {
public:
    int minOperations(std::vector<std::vector<int>>& grid, int x) {
        // Flatten the 2D grid into a 1D vector
        std::vector<int> nums;
        int m = grid.size();
        int n = grid[0].size();

        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                nums.push_back(grid[i][j]);
            }
        }

        // Check if it's possible to make the grid uni-value.
        // All elements must have the same remainder when divided by x.
        int firstRemainder = nums[0] % x;
        for (size_t i = 1; i < nums.size(); ++i) {
            if (nums[i] % x != firstRemainder) {
                return -1; // Impossible to make uni-value
            }
        }

        // Sort the flattened array to find the median
        std::sort(nums.begin(), nums.end());

        // The median element will be the optimal target value
        int median = nums[nums.size() / 2];
        long long totalOperations = 0;

        // Calculate the total operations needed to make all elements equal to the median
        for (int num : nums) {
            // The difference must be a multiple of x, which we've already checked.
            // The number of operations is the absolute difference divided by x.
            totalOperations += std::abs(num - median) / x;
        }

        return static_cast<int>(totalOperations);
    }
};
```