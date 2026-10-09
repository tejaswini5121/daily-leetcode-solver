// Problem: Minimum Insertions to Balance a Parentheses String
// Link: https://leetcode.com/problems/minimum-insertions-to-balance-a-parentheses-string
// Approach:
// We can use a greedy approach to solve this problem. We iterate through the string, keeping track of the number of open parentheses that need to be closed.
// When we encounter an open parenthesis '(', we increment the count of needed closing parentheses by 2, as each '(' requires two '))'.
// When we encounter a closing parenthesis ')', we decrement the count of needed closing parentheses.
// If the count of needed closing parentheses becomes negative, it means we have an unmatched ')' that needs an opening parenthesis. In this case, we increment our insertions count by 1 (for the missing '(') and reset the needed closing parentheses count to 1 (since the newly inserted '(' now needs one ')' to form '())').
// If we encounter two consecutive closing parentheses '))', we check if there are any open parentheses that can match them. If there are, we decrement the needed closing parentheses count by 2. If not, we need to insert an opening parenthesis, so we increment our insertions count by 1 and decrement the needed closing parentheses count by 2.
// After iterating through the string, any remaining needed closing parentheses must be inserted to balance the string. We add this remaining count to our total insertions.
//
// Time complexity: O(n), where n is the length of the input string s. We iterate through the string once.
// Space complexity: O(1). We only use a few variables to keep track of counts.
#include <string>
#include <algorithm>

class Solution {
public:
    int minInsertions(std::string s) {
        int insertions = 0; // Total insertions needed
        int needed_closing_parentheses = 0; // Number of ')' needed to balance current open '('

        for (int i = 0; i < s.length(); ++i) {
            if (s[i] == '(') {
                // An open parenthesis requires two closing parentheses.
                // If we currently need an odd number of closing parentheses,
                // it means we have a single ')' that needs a pair.
                // We must insert one ')' to complete that pair, and then
                // this new '(' requires two more.
                if (needed_closing_parentheses % 2 != 0) {
                    insertions++; // Insert one ')' to complete a previous pair
                    needed_closing_parentheses--; // This single ')' is now balanced
                }
                needed_closing_parentheses += 2; // This '(' requires two ')'
            } else { // s[i] == ')'
                // We encountered a closing parenthesis.
                needed_closing_parentheses--;

                // If needed_closing_parentheses becomes negative, it means we have an
                // extra ')' without a matching '('. We need to insert an '('.
                // This inserted '(' will then need one more ')' to form '())'.
                if (needed_closing_parentheses < 0) {
                    insertions++; // Insert an '('
                    needed_closing_parentheses = 1; // The inserted '(' needs one more ')'
                }

                // Check for consecutive closing parentheses '))'
                if (i + 1 < s.length() && s[i+1] == ')') {
                    // We found a '))', so we satisfy one pair of needed closing parentheses.
                    needed_closing_parentheses--;
                    i++; // Skip the next ')' as it's already processed

                    // If after consuming '))', needed_closing_parentheses becomes negative,
                    // it means we had an unbalanced scenario. This case is already handled
                    // by the previous needed_closing_parentheses < 0 check which inserts '('.
                    // However, if it was exactly 0 and we decremented it to -1 by consuming
                    // the second ')', it means the ')' was not needed for a preceding '('.
                    // The logic above correctly handles this by ensuring needed_closing_parentheses
                    // is at least 0 after processing a single ')'.
                    // The crucial part is the if (needed_closing_parentheses < 0) block above.
                }
            }
        }

        // After iterating through the string, any remaining needed_closing_parentheses
        // must be inserted to balance the remaining open parentheses.
        insertions += needed_closing_parentheses;

        return insertions;
    }
};
