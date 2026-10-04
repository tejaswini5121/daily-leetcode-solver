// Problem: Valid Parenthesis String
// Given a string with '(', ')', and '*', determine if it's valid.
// '*' can be '(', ')', or empty.
// Link: https://leetcode.com/problems/valid-parenthesis-string/
//
// Approach:
// We can solve this problem using a greedy approach with two variables, `low` and `high`.
// `low` represents the minimum number of open parentheses needed to balance the string up to the current character,
// treating '*' as ')'.
// `high` represents the maximum number of open parentheses that can be open up to the current character,
// treating '*' as '('.
//
// When we encounter '(':
// - `low` increases by 1 (we need at least one more closing parenthesis).
// - `high` increases by 1 (we can have one more open parenthesis).
//
// When we encounter ')':
// - `low` decreases by 1 (we use up one open parenthesis or assume we can).
// - `high` decreases by 1 (we use up one available open parenthesis).
//
// When we encounter '*':
// - `low` decreases by 1 (it can act as a ')' to close a '(', reducing the minimum required open count).
// - `high` increases by 1 (it can act as a '(' to increase the maximum possible open count).
//
// Constraints and Updates:
// - `low` should never be negative. If it becomes negative, it means we have an excess of closing parentheses that even '*' cannot balance as ')'. We reset `low` to 0 because a '*' can also be an empty string.
// - `high` should never be negative. If `high` becomes negative, it means we have more closing parentheses than any combination of open parentheses and '*' can balance. In this case, the string is invalid.
//
// Final Check:
// After iterating through the entire string, the string is valid if and only if `low` is 0. This means that all opening parentheses have been matched, and we don't have any outstanding required open parentheses that couldn't be closed.
//
// Time Complexity: O(n), where n is the length of the string. We iterate through the string once.
// Space Complexity: O(1), as we only use a constant amount of extra space for the `low` and `high` variables.
#include <string>
#include <algorithm> // For std::max and std::min

class Solution {
public:
    bool checkValidString(std::string s) {
        // `low` tracks the minimum number of open parentheses required.
        // If '*' is treated as ')', `low` decreases.
        int low = 0;
        // `high` tracks the maximum number of open parentheses possible.
        // If '*' is treated as '(', `high` increases.
        int high = 0;

        // Iterate through each character in the string
        for (char c : s) {
            if (c == '(') {
                // Encountered an open parenthesis:
                // Increment both `low` and `high` as we definitely have an open one.
                low++;
                high++;
            } else if (c == ')') {
                // Encountered a closing parenthesis:
                // Decrement `low`: it can potentially close an open parenthesis.
                // Decrement `high`: it consumes one potential open parenthesis.
                low--;
                high--;
            } else { // c == '*'
                // Encountered a wildcard character:
                // Decrement `low`: '*' can be treated as ')' to balance a '('.
                // Increment `high`: '*' can be treated as '(' to increase potential open count.
                low--;
                high++;
            }

            // `low` cannot be negative. If it is, it means we have more ')' than '(',
            // and even if '*' is treated as ')', we can't balance it.
            // However, '*' can also be an empty string, so we reset `low` to 0.
            low = std::max(0, low);

            // If `high` becomes negative at any point, it means we have an unbalanced
            // number of closing parentheses that cannot be matched by any '(' or '*'.
            if (high < 0) {
                return false; // String is invalid
            }
        }

        // After processing the entire string, the string is valid if `low` is 0.
        // This means all required open parentheses have been matched.
        return low == 0;
    }
};
