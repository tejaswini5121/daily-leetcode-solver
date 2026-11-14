```cpp
// Problem: Minimum Positive Sum Subarray
// Link: https://leetcode.com/problems/minimum-positive-sum-subarray/
//
// Approach:
// We can use a sliding window approach combined with prefix sums.
// For each possible start of a subarray, we expand the window up to the maximum
// allowed size (r). We calculate the sum of the current window and check if its
// length is within the [l, r] range and if its sum is positive.
// If both conditions are met, we update our minimum positive sum found so far.
//
// To efficiently calculate subarray sums, we can use prefix sums.
// prefixSum[i] will store the sum of nums[0] to nums[i-1].
// The sum of subarray nums[j...k] is prefixSum[k+1] - prefixSum[j].
//
// We iterate through all possible start indices `i` of the subarray.
// For each `i`, we iterate through all possible end indices `j` such that the
// subarray length (j - i + 1) is between `l` and `r`.
// We calculate the sum using prefix sums and update the minimum positive sum.
//
// Time Complexity: O(n^2), where n is the length of nums.
// We have two nested loops: one for the start of the subarray and one for the end.
// Space Complexity: O(n) for the prefix sum array.
// If we don't use prefix sums and calculate sum on the fly, space complexity would be O(1).
// Given the constraints (n <= 100), O(n^2) time and O(n) space are acceptable.
// We can optimize the space to O(1) by calculating the sum on the fly within the inner loop.

#include <vector>
#include <numeric>
#include <algorithm>

class Solution {
public:
    int minimumPositiveSumSubarray(std::vector<int>& nums, int l, int r) {
        int n = nums.size();
        // Initialize minimum positive sum to a very large value.
        // If no positive sum subarray is found, this will remain, and we'll return -1.
        int minPositiveSum = -1;

        // Iterate through all possible starting points of the subarray.
        for (int i = 0; i < n; ++i) {
            int currentSum = 0;
            // Iterate through all possible ending points of the subarray,
            // ensuring the subarray length is within the [l, r] range.
            for (int j = i; j < n; ++j) {
                currentSum += nums[j];
                int subarrayLength = j - i + 1;

                // Check if the current subarray's length is within the allowed range [l, r]
                // and if its sum is positive.
                if (subarrayLength >= l && subarrayLength <= r && currentSum > 0) {
                    // If this is the first positive sum found, initialize minPositiveSum.
                    if (minPositiveSum == -1) {
                        minPositiveSum = currentSum;
                    } else {
                        // Otherwise, update minPositiveSum if the current sum is smaller.
                        minPositiveSum = std::min(minPositiveSum, currentSum);
                    }
                }
            }
        }

        // Return the minimum positive sum found, or -1 if none was found.
        return minPositiveSum;
    }
};
```