// Problem: Minimum Insertions to Balance a Parentheses String
// Link: https://leetcode.com/problems/minimum-insertions-to-balance-a-parentheses-string/
//
// Approach:
// We can solve this problem using a greedy approach by iterating through the string and maintaining a count of open parentheses that still need to be closed.
// When we encounter an opening parenthesis '(', we increment the count of open parentheses.
// When we encounter a closing parenthesis ')', we need to consider two cases:
// 1. If the next character is also ')', it forms a pair '))' which can close an open parenthesis. If there are open parentheses available (open_count > 0), we decrement open_count. If there are no open parentheses available, we need to insert an opening parenthesis to match this '))', so we increment insertions.
// 2. If the next character is not ')' (or we are at the end of the string), this single ')' needs a matching pair.
//    - If there are open parentheses available (open_count > 0), this single ')' partially closes an open parenthesis. We still need another ')' to complete the pair, so we increment insertions by 1 and decrement open_count.
//    - If there are no open parentheses available (open_count == 0), this single ')' needs both an opening parenthesis and another closing parenthesis to be balanced, so we increment insertions by 2.
// After iterating through the string, any remaining open parentheses need to be closed. Each open parenthesis requires two closing parentheses, so we add open_count * 2 to our total insertions.
//
// Time Complexity: O(n), where n is the length of the string. We iterate through the string once.
// Space Complexity: O(1), as we only use a few variables to store counts.
//
const minInsertions = function(s) {
    let insertions = 0; // Counter for the minimum number of insertions needed
    let open_count = 0; // Counter for the number of open parentheses that need to be closed

    // Iterate through the string character by character
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            // If we see an opening parenthesis, we increment the open_count.
            // Each '(' needs two ')' to be balanced.
            open_count++;
        } else { // s[i] === ')'
            // If we see a closing parenthesis
            if (i + 1 < s.length && s[i + 1] === ')') {
                // Case 1: We found a "))" pair.
                if (open_count > 0) {
                    // If there are open parentheses available, this "))" pair balances one open parenthesis.
                    open_count--;
                } else {
                    // If there are no open parentheses, we need to insert an opening parenthesis '(' to match this "))".
                    insertions++;
                }
                // Move to the next character since we've processed a pair
                i++;
            } else {
                // Case 2: We found a single ')' or it's the last character.
                if (open_count > 0) {
                    // If there are open parentheses, this single ')' partially balances an open parenthesis.
                    // We need one more ')' to complete the pair for this open parenthesis.
                    insertions++;
                    open_count--;
                } else {
                    // If there are no open parentheses, this single ')' needs both an opening parenthesis and another closing parenthesis to be balanced.
                    // So, we need to insert one '(' and one ')', totaling 2 insertions.
                    insertions += 2;
                }
            }
        }
    }

    // After iterating through the string, any remaining open_count indicates open parentheses that still need to be closed.
    // Each remaining open parenthesis requires two closing parentheses '))'.
    insertions += open_count * 2;

    return insertions;
};
```