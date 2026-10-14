// Problem: Maximize Sum of Squares of Digits
// Link: https://leetcode.com/problems/maximize-sum-of-squares-of-digits/
//
// Approach:
// To maximize the sum of squares of digits, we should place larger digits in the more significant positions (further to the left).
// This is because a larger digit squared contributes more to the total sum than the same digit squared in a less significant position.
// For example, 9^2 + 0^2 = 81, while 0^2 + 9^2 = 81. However, if we consider 91 vs 19 for num=2, sum=10:
// For 91: 9^2 + 1^2 = 81 + 1 = 82.
// For 19: 1^2 + 9^2 = 1 + 81 = 82.
// But the problem also states: "If there are multiple possible integers, return the maximum one."
// To get the maximum integer, we should try to make the most significant digits as large as possible.
//
// The strategy is to greedily fill the digits from left to right (most significant to least significant).
// For each digit position, we try to assign the largest possible digit (from 9 down to 0) such that the remaining sum of digits can still be formed by the remaining number of digits.
//
// Let `remaining_num` be the number of digits yet to be placed and `remaining_sum` be the sum of digits yet to be formed.
// For the current digit position, we iterate `d` from 9 down to 0.
// If we place digit `d` at the current position, the new `remaining_sum` will be `remaining_sum - d`.
// The minimum possible sum for the remaining `remaining_num - 1` digits is 0 (if all remaining digits are 0).
// The maximum possible sum for the remaining `remaining_num - 1` digits is `(remaining_num - 1) * 9`.
// So, if `remaining_sum - d >= 0` and `remaining_sum - d <= (remaining_num - 1) * 9`, then `d` is a valid choice for the current digit.
// We pick the largest such `d` for the current position.
//
// After filling all `num` digits, if the `remaining_sum` is not 0, it means we couldn't form the exact sum, which is an invalid case.
// Also, if at any point we cannot find a valid digit `d` for any position, it means no such good integer exists.
//
// Initial checks:
// 1. The minimum possible sum for `num` digits is `num * 0 = 0`.
// 2. The maximum possible sum for `num` digits is `num * 9`.
// If `sum` is outside this range, no good integer exists.
//
// Time Complexity:
// For each of the `num` digits, we iterate from 9 down to 0.
// So, the total time complexity is O(num * 10), which simplifies to O(num).
//
// Space Complexity:
// We store the resulting string of length `num`.
// So, the space complexity is O(num).
//
#include <iostream>
#include <string>
#include <vector>
#include <numeric>
#include <algorithm>

class Solution {
public:
    std::string maximizeSum(int num, int sum) {
        // Initial checks for impossible cases:
        // Minimum possible sum for 'num' digits is 0 (all zeros).
        // Maximum possible sum for 'num' digits is num * 9 (all nines).
        if (sum < 0 || sum > num * 9) {
            return "";
        }

        std::string result = ""; // String to store the resulting good integer
        int remaining_sum = sum; // Keep track of the sum of digits we still need to form
        int remaining_num = num; // Keep track of the number of digits we still need to place

        // Iterate through each digit position from left to right (most significant to least significant)
        for (int i = 0; i < num; ++i) {
            // For the current digit position, try to place the largest possible digit 'd' (from 9 down to 0)
            for (int d = 9; d >= 0; --d) {
                // If we place digit 'd' at the current position:
                // The sum of remaining digits will be `remaining_sum - d`.
                // The number of remaining digits will be `remaining_num - 1`.
                // The minimum possible sum for `remaining_num - 1` digits is 0.
                // The maximum possible sum for `remaining_num - 1` digits is `(remaining_num - 1) * 9`.

                // Check if placing digit 'd' is valid:
                // 1. `remaining_sum - d >= 0`: The sum of remaining digits must be non-negative.
                // 2. `remaining_sum - d <= (remaining_num - 1) * 9`: The sum of remaining digits must be achievable by the remaining digits.
                if (remaining_sum - d >= 0 && remaining_sum - d <= (long long)(remaining_num - 1) * 9) {
                    // If 'd' is a valid digit for this position, append it to the result.
                    result += std::to_string(d);
                    // Update the remaining sum and remaining number of digits.
                    remaining_sum -= d;
                    remaining_num--;
                    // Break the inner loop because we found the largest possible digit for this position.
                    break;
                }
            }
        }

        // After filling all 'num' digits, if the remaining_sum is 0, it means we successfully formed the exact sum.
        // If remaining_sum is not 0, it implies an issue, though the greedy approach should handle this
        // via the initial checks and the loop conditions.
        // An additional check for clarity: if remaining_sum is not zero after the loop, it's an invalid case.
        // However, our constraints and logic should prevent this if an answer exists.
        if (remaining_sum != 0) {
            return ""; // This should ideally not happen if the initial checks are correct and a solution exists.
        }

        // If the number of digits in the result is not equal to 'num', something went wrong.
        // This check is mostly for robustness, as the loop runs 'num' times.
        if (result.length() != num) {
             return "";
        }

        // The greedy approach ensures we build the largest possible number by prioritizing larger digits at more significant positions.
        return result;
    }
};
```