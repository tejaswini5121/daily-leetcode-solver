// Problem: Valid Parenthesis String
// Problem Summary: Check if a string with '(', ')', and '*' is valid, where '*' can be '(', ')', or empty.
// Link: https://leetcode.com/problems/valid-parenthesis-string/
// Approach:
// We can use two variables, `minOpen` and `maxOpen`, to keep track of the possible range of open parentheses counts.
// `minOpen` represents the minimum number of open parentheses needed to balance the string encountered so far,
// treating '*' as ')' whenever possible to reduce the count.
// `maxOpen` represents the maximum number of open parentheses we could have, treating '*' as '(' whenever possible
// to increase the count.
//
// Iterate through the string:
// - If character is '(': increment both `minOpen` and `maxOpen`.
// - If character is ')': decrement both `minOpen` and `maxOpen`.
// - If character is '*':
//   - For `minOpen`, we try to reduce it by treating '*' as ')', so decrement `minOpen`.
//   - For `maxOpen`, we try to increase it by treating '*' as '(', so increment `maxOpen`.
//
// After each character, we need to ensure `maxOpen` is not negative. If it is, it means we have encountered more closing
// parentheses than we can possibly balance even by treating all '*' as opening parentheses. In this case, the string is invalid.
// Also, `minOpen` should never be negative. If it becomes negative, it means we have a surplus of closing parentheses that
// we can't balance with available opening parentheses or '*' treated as opening. We reset `minOpen` to 0 in this case because
// a negative `minOpen` indicates we have more than enough closing parentheses for the preceding opening ones, and we can
// effectively ignore those surplus closing parentheses for future balancing.
//
// Finally, after iterating through the entire string, if `minOpen` is 0, it means all opening parentheses have been
// successfully balanced.
//
// Time Complexity: O(N), where N is the length of the string. We iterate through the string once.
// Space Complexity: O(1), as we only use a few constant variables.
class Solution {
    public boolean checkValidString(String s) {
        // minOpen tracks the minimum number of open parentheses needed to balance the string.
        // It treats '*' as ')' when possible to minimize the count.
        int minOpen = 0;
        // maxOpen tracks the maximum number of open parentheses we could have.
        // It treats '*' as '(' when possible to maximize the count.
        int maxOpen = 0;

        // Iterate through each character in the string.
        for (char c : s.toCharArray()) {
            if (c == '(') {
                // If it's an opening parenthesis, we must have one more open parenthesis.
                minOpen++;
                maxOpen++;
            } else if (c == ')') {
                // If it's a closing parenthesis, we must have one less open parenthesis.
                minOpen--;
                maxOpen--;
            } else { // c == '*'
                // If it's a wildcard character '*'.
                // For minOpen, we can treat '*' as a closing parenthesis to reduce the count.
                minOpen--;
                // For maxOpen, we can treat '*' as an opening parenthesis to increase the count.
                maxOpen++;
            }

            // After processing a character, we need to ensure the counts are valid.
            // If maxOpen becomes negative, it means we have too many closing parentheses that cannot be balanced,
            // even if all '*' were treated as opening parentheses. The string is invalid.
            if (maxOpen < 0) {
                return false;
            }

            // minOpen should never be negative. If it becomes negative, it means we have an excess of
            // closing parentheses. We can reset minOpen to 0 because we can effectively ignore
            // those surplus closing parentheses if we have enough '*' characters to balance them out later.
            // For example, "(*))" -> after "(*", minOpen might be -1 if '*' is ')', but we reset to 0.
            // Then for the next ')', minOpen becomes -1 again, but maxOpen also decreases.
            // The key is that minOpen represents the *minimum required* open parens. If it goes below zero,
            // it implies we have more than enough closing parens (or '*' acting as closing) to match preceding opens.
            minOpen = Math.max(0, minOpen);
        }

        // After iterating through the entire string, if minOpen is 0, it means all opening parentheses
        // have been successfully matched or could be matched with '*' acting as closing parentheses.
        // If minOpen > 0, it means there are still unmatched opening parentheses that cannot be balanced.
        return minOpen == 0;
    }
}
