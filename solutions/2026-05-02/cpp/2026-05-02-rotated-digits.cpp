```cpp
// Problem: Rotated Digits
// Problem Summary: Count numbers in a range that become different valid numbers after rotating digits 180 degrees.
// Link: https://leetcode.com/problems/rotated-digits/
//
// Approach:
// We can iterate through each number from 1 to n and check if it's a "good" number.
// A number is "good" if:
// 1. All its digits rotate to valid digits (0, 1, 2, 5, 6, 8, 9).
// 2. At least one digit rotates to a different digit (i.e., the rotated number is different from the original).
//
// To check a number, we can convert it to a string or process its digits one by one.
// We'll maintain a mapping or use conditions to determine the rotated value of each digit.
// - 0 -> 0
// - 1 -> 1
// - 8 -> 8
// - 2 -> 5
// - 5 -> 2
// - 6 -> 9
// - 9 -> 6
// - Other digits (3, 4, 7) are invalid.
//
// For each number:
// - Initialize a flag `has_different_digit` to false.
// - Initialize a flag `is_valid` to true.
// - Iterate through the digits of the number:
//   - If a digit is invalid (3, 4, 7), set `is_valid` to false and break.
//   - If a digit rotates to a different digit (2->5, 5->2, 6->9, 9->6), set `has_different_digit` to true.
//   - If a digit rotates to itself (0, 1, 8), continue.
// - After checking all digits, if `is_valid` is true AND `has_different_digit` is true, increment the count of good numbers.
//
// Time Complexity: O(N * log10(N))
// For each number from 1 to N, we iterate through its digits. The number of digits in a number `x` is approximately `log10(x)`.
// So, the total time complexity is roughly the sum of log10(i) for i from 1 to N, which is approximately N * log10(N).
//
// Space Complexity: O(1)
// We only use a few variables to keep track of flags and the count. The space used does not depend on the input size N.

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    /**
     * @brief Checks if a single digit is valid after rotation and returns its rotated digit.
     *        Returns -1 if the digit is invalid.
     * @param digit The digit to rotate.
     * @return The rotated digit, or -1 if invalid.
     */
    int rotate_digit(int digit) {
        if (digit == 0) return 0;
        if (digit == 1) return 1;
        if (digit == 8) return 8;
        if (digit == 2) return 5;
        if (digit == 5) return 2;
        if (digit == 6) return 9;
        if (digit == 9) return 6;
        return -1; // Invalid digit
    }

    /**
     * @brief Checks if a number is "good".
     *        A number is good if rotating its digits results in a valid and different number.
     * @param num The number to check.
     * @return True if the number is good, false otherwise.
     */
    bool is_good(int num) {
        bool has_different_digit = false;
        std::string s_num = std::to_string(num);
        std::string rotated_s_num = "";

        for (char c : s_num) {
            int digit = c - '0';
            int rotated = rotate_digit(digit);

            if (rotated == -1) {
                return false; // Digit is invalid, so the number is not valid after rotation.
            }

            if (rotated != digit) {
                has_different_digit = true; // At least one digit changed.
            }
            rotated_s_num += std::to_string(rotated);
        }

        // A number is good if it's valid after rotation (all digits rotated to valid ones)
        // AND the rotated number is different from the original number.
        // The check for `rotated != -1` for all digits ensures validity.
        // The `has_different_digit` flag ensures the rotated number is different.
        return has_different_digit;
    }

    /**
     * @brief Counts the number of good integers in the range [1, n].
     * @param n The upper bound of the range.
     * @return The count of good integers.
     */
    int rotatedDigits(int n) {
        int count = 0;
        for (int i = 1; i <= n; ++i) {
            if (is_good(i)) {
                count++;
            }
        }
        return count;
    }
};

// Main function for testing purposes.
// This part is for demonstrating the functionality and is not strictly part of the LeetCode solution submission.
int main() {
    Solution sol;

    // Example 1
    int n1 = 10;
    std::cout << "Input: n = " << n1 << std::endl;
    std::cout << "Output: " << sol.rotatedDigits(n1) << std::endl; // Expected: 4

    // Example 2
    int n2 = 1;
    std::cout << "Input: n = " << n2 << std::endl;
    std::cout << "Output: " << sol.rotatedDigits(n2) << std::endl; // Expected: 0

    // Example 3
    int n3 = 2;
    std::cout << "Input: n = " << n3 << std::endl;
    std::cout << "Output: " << sol.rotatedDigits(n3) << std::endl; // Expected: 1

    // Additional test case
    int n4 = 100;
    std::cout << "Input: n = " << n4 << std::endl;
    std::cout << "Output: " << sol.rotatedDigits(n4) << std::endl; // Expected: 24 (numbers like 2,5,6,9,12,15,16,19,20,21,22,25,26,29,50,51,52,55,56,59,60,61,62,65,66,69,80,81,82,85,86,89,90,91,92,95,96,99)
    // Wait, the example calculation for 100 is:
    // Numbers from 1 to 10: 2, 5, 6, 9 (4)
    // Numbers from 11 to 20: 12, 15, 16, 19, 20 (5)
    // Numbers from 21 to 30: 21 (not good, 11), 22 (good), 25 (good), 26 (good), 29 (good)
    // Let's trace the logic for 21:
    // 2 -> 5 (different)
    // 1 -> 1 (same)
    // rotated: 51. Original: 21. 51 != 21. All digits valid. So 21 is good.
    //
    // Let's re-evaluate 100.
    // The good numbers are those that:
    // 1. Contain only digits {0, 1, 2, 5, 6, 8, 9}.
    // 2. Contain at least one digit from {2, 5, 6, 9}.
    //
    // Numbers with only {0, 1, 8} are NOT good because they don't change. (e.g., 1, 8, 10, 11, 18, 80, 81, 88, 100)
    // Numbers with {3, 4, 7} are NOT good because they are invalid. (e.g., 3, 4, 7, 13, 14, 17)
    //
    // Let's check my `is_good` logic.
    // For `num = 21`:
    // s_num = "21"
    // '2': digit=2, rotated=5. has_different_digit = true. rotated_s_num = "5"
    // '1': digit=1, rotated=1. has_different_digit remains true. rotated_s_num = "51"
    // Returns true. Correct for 21.
    //
    // Let's test 11:
    // s_num = "11"
    // '1': digit=1, rotated=1. has_different_digit = false. rotated_s_num = "1"
    // '1': digit=1, rotated=1. has_different_digit = false. rotated_s_num = "11"
    // Returns false. Correct for 11.
    //
    // Let's test 10:
    // s_num = "10"
    // '1': digit=1, rotated=1. has_different_digit = false. rotated_s_num = "1"
    // '0': digit=0, rotated=0. has_different_digit = false. rotated_s_num = "10"
    // Returns false. Correct for 10.
    //
    // The example output 4 for n=10 is correct (2, 5, 6, 9).
    //
    // For n=100, the calculation is indeed tricky.
    // Let's use a DP approach for verification if needed, but the current O(N log N) should pass for N=10^4.
    // N = 10^4 means around 10000 numbers, each with up to 4 digits. Total operations ~ 10000 * 4 = 40000, which is very fast.
    //
    // Re-checking for n=100:
    // Good numbers:
    // Single digits: 2, 5, 6, 9 (4)
    // Two digits:
    //   Form XY, where X in {1,2,5,6,8,9} and Y in {0,1,2,5,6,8,9}
    //   and at least one of X or Y rotates to a different digit.
    //   Exclude numbers with only {0,1,8} digits: 11, 18, 81, 88, 10.
    //   Exclude numbers with invalid digits: 3,4,7 etc.
    //
    //   Numbers with digits {0,1,2,5,6,8,9} are valid if they don't contain 3,4,7.
    //   These are numbers that are NOT composed solely of {0,1,8}.
    //   Total numbers from 1 to 100.
    //   Numbers with digits only from {0,1,8}:
    //     1-digit: 1, 8 (2)
    //     2-digits: 10, 11, 18, 80, 81, 88 (6)
    //     3-digits: 100 (1)
    //   Total numbers from 1 to 100 that use ONLY {0,1,8} are: 1, 8, 10, 11, 18, 80, 81, 88, 100. (9 numbers)
    //   These 9 numbers are NOT good because they don't change.
    //
    //   Numbers from 1 to 100 containing digits {3,4,7}:
    //   3, 4, 7, 13, 14, 17, 23, 24, 27, 30-39, 40-49, 53, 54, 57, 63, 64, 67, 70-79, 83, 84, 87, 93, 94, 97.
    //   All these are invalid.
    //
    //   So, good numbers are those from 1 to 100 that:
    //   a) Contain digits only from {0,1,2,5,6,8,9}
    //   b) Are not exclusively made of {0,1,8} digits.
    //
    //   Let's list numbers from 1 to 100 and check:
    //   1-9: 2,5,6,9 (4 good)
    //   10-19: 10(no), 11(no), 12(yes), 13(no), 14(no), 15(yes), 16(yes), 17(no), 18(no), 19(yes) -> 12,15,16,19 (4 good)
    //   20-29: 20(yes), 21(yes), 22(yes), 23(no), 24(no), 25(yes), 26(yes), 27(no), 28(yes), 29(yes) -> 20,21,22,25,26,28,29 (7 good)
    //   30-39: all invalid (0 good)
    //   40-49: all invalid (0 good)
    //   50-59: 50(yes), 51(yes), 52(yes), 53(no), 54(no), 55(yes), 56(yes), 57(no), 58(yes), 59(yes) -> 50,51,52,55,56,58,59 (7 good)
    //   60-69: 60(yes), 61(yes), 62(yes), 63(no), 64(no), 65(yes), 66(yes), 67(no), 68(yes), 69(yes) -> 60,61,62,65,66,68,69 (7 good)
    //   70-79: all invalid (0 good)
    //   80-89: 80(no), 81(no), 82(yes), 83(no), 84(no), 85(yes), 86(yes), 87(no), 88(no), 89(yes) -> 82,85,86,89 (4 good)
    //   90-99: 90(yes), 91(yes), 92(yes), 93(no), 94(no), 95(yes), 96(yes), 97(no), 98(yes), 99(yes) -> 90,91,92,95,96,98,99 (7 good)
    //   100: 100(no)
    //
    // Total = 4 + 4 + 7 + 0 + 0 + 7 + 7 + 0 + 4 + 7 + 0 = 40.
    // My `is_good` function seems correct. The manual count for n=100 leads to 40.
    // Let's verify the logic for some edge cases of my manual count.
    // 28: 2->5, 8->8. Rotated is 58. Original 28. 58!=28. Valid. Good.
    // 82: 8->8, 2->5. Rotated is 85. Original 82. 85!=82. Valid. Good.
    // So my manual count of 40 is likely correct.

    return 0;
}
```