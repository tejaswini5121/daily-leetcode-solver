```cpp
// Problem: Partitioning Into Minimum Number Of Deci-Binary Numbers
// Link: https://leetcode.com/problems/partitioning-into-minimum-number-of-deci-binary-numbers/
//
// Approach:
// The problem asks for the minimum number of positive deci-binary numbers that sum up to a given decimal number 'n'.
// A deci-binary number consists only of digits 0 and 1.
// Consider the structure of the sum. If we have a digit 'd' in the decimal number 'n', it means that the sum of the digits at that position across all the deci-binary numbers must equal 'd'.
// Since each deci-binary number can contribute at most 1 to any given digit position (because its digits are 0 or 1), to achieve a digit 'd', we need at least 'd' deci-binary numbers that have a '1' at that specific digit position.
// For example, if 'n' is "32":
// The digit '3' at the tens place means we need at least 3 deci-binary numbers to contribute a '1' to the tens place.
// The digit '2' at the ones place means we need at least 2 deci-binary numbers to contribute a '1' to the ones place.
// To satisfy both conditions simultaneously, we need a number of deci-binary numbers equal to the maximum digit present in 'n'.
// If the maximum digit is 'max_digit', we can construct 'max_digit' deci-binary numbers. For each of these 'max_digit' numbers, we can place '1's at positions where the corresponding digit in 'n' is greater than or equal to the deci-binary number's index (from 1 to max_digit).
// For example, for "32":
// Max digit is 3. We need 3 deci-binary numbers.
// Number 1: Can contribute to digits >= 1. For "32", it can contribute to the '3' and '2'. Let's say we use it for positions where digit >= 1. So, 11. Remaining to form: "21".
// Number 2: Can contribute to digits >= 2. For "21", it can contribute to the '2'. So, 10. Remaining to form: "11".
// Number 3: Can contribute to digits >= 3. For "11", it can contribute to the '1'. So, 10. Remaining to form: "00".
// This approach is a bit complex to visualize direct construction. The core insight is that the maximum digit directly dictates the minimum number of deci-binary numbers required.
// If the maximum digit in 'n' is 'M', then we need at least 'M' deci-binary numbers. Why? Because to form the digit 'M', we need 'M' ones at that position across our chosen deci-binary numbers. Each deci-binary number can contribute at most one '1' at any position.
// Conversely, we can always construct 'M' deci-binary numbers. For each deci-binary number 'i' (from 1 to M), we can set its digits to '1' if the corresponding digit in 'n' is greater than or equal to 'i', and '0' otherwise. This will sum up to 'n'.
// Therefore, the minimum number of positive deci-binary numbers needed is simply the largest digit present in the input string 'n'.
//
// Time Complexity: O(L), where L is the length of the string 'n'. We iterate through the string once to find the maximum digit.
// Space Complexity: O(1), as we only use a single variable to store the maximum digit found.
class Solution {
public:
    int minPartitions(string n) {
        // Initialize a variable to store the maximum digit encountered.
        // Since digits are '0'-'9', we can start with 0.
        int maxDigit = 0;

        // Iterate through each character (digit) in the input string 'n'.
        for (char c : n) {
            // Convert the character digit to an integer.
            // Subtracting '0' from a character digit gives its integer value.
            // For example, '3' - '0' = 3.
            int digit = c - '0';

            // Update maxDigit if the current digit is greater than the current maxDigit.
            if (digit > maxDigit) {
                maxDigit = digit;
            }
        }

        // The minimum number of positive deci-binary numbers required is equal
        // to the largest digit present in the number 'n'.
        return maxDigit;
    }
};
```