// Problem: Add Binary
// LeetCode Link: https://leetcode.com/problems/add-binary/
//
// Approach:
// We can simulate binary addition by iterating from the rightmost digits of both strings,
// keeping track of a carry. For each position, we sum the corresponding digits from 'a' and 'b'
// along with the carry. The resulting digit is the sum modulo 2, and the new carry is the sum
// divided by 2. We build the result string in reverse and then reverse it at the end.
//
// Time Complexity: O(max(N, M)), where N and M are the lengths of strings 'a' and 'b'.
// We iterate through the strings at most once.
//
// Space Complexity: O(max(N, M)), for storing the result string.

#include <string>
#include <algorithm>
#include <vector>

class Solution {
public:
    std::string addBinary(std::string a, std::string b) {
        // Initialize the result string.
        std::string result = "";
        // Initialize carry to 0.
        int carry = 0;
        // Pointers to the end of strings a and b.
        int i = a.length() - 1;
        int j = b.length() - 1;

        // Loop while there are digits in either string or there's a carry.
        while (i >= 0 || j >= 0 || carry) {
            // Get the digit from string a, if available, otherwise assume 0.
            int digit_a = (i >= 0) ? (a[i] - '0') : 0;
            // Get the digit from string b, if available, otherwise assume 0.
            int digit_b = (j >= 0) ? (b[j] - '0') : 0;

            // Calculate the sum of the current digits and the carry.
            int current_sum = digit_a + digit_b + carry;

            // The last digit of the sum (modulo 2) is the current result digit.
            // Convert the integer digit back to a character.
            result += std::to_string(current_sum % 2);

            // The carry for the next iteration is the sum divided by 2.
            carry = current_sum / 2;

            // Move to the next digit in string a (if available).
            i--;
            // Move to the next digit in string b (if available).
            j--;
        }

        // The result string was built in reverse order, so reverse it.
        std::reverse(result.begin(), result.end());

        // Return the final binary sum.
        return result;
    }
};
