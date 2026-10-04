// Given a string s containing '(', ')', and '*', return true if s is valid.
// '*' can be treated as '(', ')', or an empty string.
// Link: https://leetcode.com/problems/valid-parenthesis-string/
//
// Approach:
// We can use two variables, `low` and `high`, to keep track of the minimum and maximum
// possible balance of open parentheses at each point in the string.
// `low` represents the minimum number of open parentheses needed to balance the string if '*' are treated as ')'.
// `high` represents the maximum number of open parentheses that can be formed if '*' are treated as '('.
//
// When we encounter '(':
//   - `low` increases by 1.
//   - `high` increases by 1.
//
// When we encounter ')':
//   - `low` decreases by 1.
//   - `high` decreases by 1.
//
// When we encounter '*':
//   - `low` decreases by 1 (worst case: '*' is a closing parenthesis).
//   - `high` increases by 1 (best case: '*' is an opening parenthesis).
//
// Constraints:
//   - `low` should never be negative. If it becomes negative, we reset it to 0,
//     as we can't have a negative balance of open parentheses (meaning we have too many closing ones).
//   - If `high` becomes negative at any point, it means we have encountered more closing
//     parentheses than we can possibly match, even if all '*' were opening ones.
//     In this case, the string is invalid.
//
// Finally, after iterating through the entire string, if `low` is 0, it means we can
// perfectly balance the string, and it's valid.
//
// Time Complexity: O(n), where n is the length of the string. We iterate through the string once.
// Space Complexity: O(1), as we only use a few variables to store the balance.
var checkValidString = function(s) {
    // `low` tracks the minimum number of open parentheses needed.
    // It assumes '*' acts as ')' or an empty string when minimizing open counts.
    let low = 0;
    // `high` tracks the maximum number of open parentheses possible.
    // It assumes '*' acts as '(' when maximizing open counts.
    let high = 0;

    // Iterate through each character in the string
    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        if (char === '(') {
            // If it's an opening parenthesis, both minimum and maximum open counts increase.
            low++;
            high++;
        } else if (char === ')') {
            // If it's a closing parenthesis:
            // Decrease the minimum open count.
            low--;
            // Decrease the maximum open count.
            high--;
        } else { // char === '*'
            // If it's a '*':
            // It can be a closing parenthesis, so decrease the minimum open count.
            // We clamp `low` at 0 because we can't have a negative balance of open parentheses.
            // If we encounter a ')' and `low` becomes negative, it means we had more ')' than
            // matching '('. However, '*' can act as an empty string or '(', so we don't
            // immediately declare it invalid unless `high` also becomes negative.
            low = Math.max(0, low - 1);
            // It can be an opening parenthesis, so increase the maximum open count.
            high++;
        }

        // If `high` becomes negative, it means we have encountered more closing parentheses
        // than we can possibly match, even if all '*' were treated as opening parentheses.
        // In this case, the string is invalid.
        if (high < 0) {
            return false;
        }
    }

    // After iterating through the entire string, if `low` is 0, it means we can achieve
    // a perfect balance of parentheses. `low` represents the minimum number of unmatched
    // opening parentheses. If this is 0, all opening parentheses have been matched.
    return low === 0;
};
