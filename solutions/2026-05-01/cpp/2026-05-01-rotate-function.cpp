// Problem: Rotate Function
// Link: https://leetcode.com/problems/rotate-function/
//
// Summary:
// Given an array, we need to find the maximum value of a rotation function F(k)
// which is defined as the weighted sum of elements after rotating the array k times.
//
// Approach:
// We can observe a relationship between F(k) and F(k+1).
// Let nums = [a, b, c, d] (n=4)
// F(0) = 0*a + 1*b + 2*c + 3*d
//
// Rotating by 1 gives arr1 = [d, a, b, c]
// F(1) = 0*d + 1*a + 2*b + 3*c
//
// Let S be the sum of all elements in nums.
// S = a + b + c + d
//
// Consider F(k+1) - F(k):
// F(k+1) = 0*arrk+1[0] + 1*arrk+1[1] + ... + (n-1)*arrk+1[n-1]
//
// For arrk+1, the elements are shifted one position to the right compared to arrk.
// If arrk = [x0, x1, ..., xn-1], then arrk+1 = [xn-1, x0, x1, ..., xn-2].
//
// F(k+1) = 0*xn-1 + 1*x0 + 2*x1 + ... + (n-1)*xn-2
// F(k)   = 0*x0 + 1*x1 + 2*x2 + ... + (n-1)*xn-1
//
// F(k+1) - F(k) = (0*xn-1 - (n-1)*xn-1) + (1*x0 - 0*x0) + (2*x1 - 1*x1) + ... + ((n-1)*xn-2 - (n-2)*xn-2)
// F(k+1) - F(k) = -(n-1)*xn-1 + x0 + x1 + ... + xn-2
//
// Notice that x0 + x1 + ... + xn-2 = S - xn-1
// So, F(k+1) - F(k) = -(n-1)*xn-1 + (S - xn-1)
// F(k+1) - F(k) = S - n*xn-1
//
// Therefore, F(k+1) = F(k) + S - n*arrk[0] (where arrk[0] is the element that was moved from the end to the beginning in the next rotation)
//
// Algorithm:
// 1. Calculate the initial sum of elements (S).
// 2. Calculate the initial F(0) value.
// 3. Initialize max_f to F(0).
// 4. Iterate from k = 1 to n-1:
//    a. Use the derived formula: F(k) = F(k-1) + S - n * nums[n-k] (where nums[n-k] is the element that was at the end of the previous rotation).
//    b. Update max_f with the maximum of max_f and the current F(k).
// 5. Return max_f.
//
// Time Complexity:
// O(n) because we iterate through the array twice: once to calculate the sum and F(0), and once to calculate subsequent F(k) values.
//
// Space Complexity:
// O(1) because we only use a few extra variables to store the sum, current F value, and the maximum F value.

#include <vector>
#include <numeric>
#include <algorithm>

class Solution {
public:
    int maxRotateFunction(std::vector<int>& nums) {
        int n = nums.size();
        if (n == 0) {
            return 0;
        }

        // Calculate the sum of all elements in the array.
        long long sum = 0;
        for (int num : nums) {
            sum += num;
        }

        // Calculate the initial F(0) value.
        // F(0) = 0 * nums[0] + 1 * nums[1] + ... + (n-1) * nums[n-1]
        long long current_f = 0;
        for (int i = 0; i < n; ++i) {
            current_f += (long long)i * nums[i];
        }

        // Initialize the maximum F value found so far with F(0).
        long long max_f = current_f;

        // Iterate from k = 1 to n-1 to calculate F(1), F(2), ..., F(n-1).
        // The formula used is: F(k) = F(k-1) + sum - n * nums[n-k]
        // Here, nums[n-k] represents the element that was at the end of the array
        // in the (k-1)-th rotation and moved to the front in the k-th rotation.
        for (int k = 1; k < n; ++k) {
            // The element that was at the last position (index n-1) in the previous rotation
            // is now at the first position (index 0) in the current rotation.
            // When we go from F(k-1) to F(k), the element nums[n-k] which was previously
            // multiplied by (n-1) is now effectively removed from the weighted sum,
            // and all other elements get their weights increased by 1.
            // The formula F(k) = F(k-1) + sum - n * nums[n-k] efficiently calculates this.
            // nums[n-k] is the element that moved from the last position to the first in this step.
            current_f = current_f + sum - (long long)n * nums[n - k];

            // Update the maximum F value if the current F(k) is greater.
            max_f = std::max(max_f, current_f);
        }

        return static_cast<int>(max_f);
    }
};
