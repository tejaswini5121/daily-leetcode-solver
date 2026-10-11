// Problem: Sum of Squares of Special Elements
// Link: https://leetcode.com/problems/sum-of-squares-of-special-elements/
//
// Approach:
// The problem asks us to find the sum of squares of "special" elements in a 1-indexed array.
// An element nums[i] is special if its index `i` divides the length of the array `n`.
// We can iterate through the array from index 1 to `n` (inclusive). For each index `i`,
// we check if `n % i == 0`. If it is, then `nums[i-1]` (since the array is 0-indexed in C++)
// is a special element. We then square this element and add it to a running sum.
//
// Time Complexity: O(n)
// We iterate through the array once to check each element. The modulo operation and squaring
// are constant time operations.
//
// Space Complexity: O(1)
// We only use a single variable to store the sum, which does not depend on the input size.
//
#include <vector>
#include <numeric>

class Solution {
public:
    int sumOfSquares(std::vector<int>& nums) {
        // Get the length of the array. The problem statement uses 1-based indexing for `n`,
        // so `nums.size()` directly corresponds to `n`.
        int n = nums.size();
        // Initialize the sum of squares to 0.
        int sum_of_squares = 0;

        // Iterate through the array using 1-based indexing for `i` to match the problem's definition of special elements.
        // The loop runs from `i = 1` to `n`.
        for (int i = 1; i <= n; ++i) {
            // Check if the current index `i` is a divisor of the array length `n`.
            if (n % i == 0) {
                // If `i` divides `n`, then `nums[i-1]` is a special element (because the array is 0-indexed in C++).
                // Square the special element and add it to our running sum.
                sum_of_squares += nums[i - 1] * nums[i - 1];
            }
        }

        // Return the total sum of squares of all special elements.
        return sum_of_squares;
    }
};
