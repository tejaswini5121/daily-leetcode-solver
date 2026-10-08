// /**
//  * @param {string} s
//  * @return {string}
//  */
// Problem: Remove Outermost Parentheses
// Link: https://leetcode.com/problems/remove-outermost-parentheses/
//
// Approach:
// We can iterate through the string and keep track of the balance of parentheses.
// A primitive decomposition occurs when the balance returns to 0.
// When we encounter an opening parenthesis that is NOT the start of a new primitive
// string (i.e., balance > 0 before incrementing), we append it to our result.
// When we encounter a closing parenthesis that is NOT the end of a primitive
// string (i.e., balance > 1 before decrementing), we append it to our result.
//
// Time Complexity: O(n), where n is the length of the string s. We iterate through the string once.
// Space Complexity: O(n) in the worst case, if the string is composed of many small primitive strings,
// the result string could be close to the original length.
//
// Constraints:
// 1 <= s.length <= 105
// s[i] is either '(' or ')'
// s is a valid parentheses string.

var removeOuterParentheses = function(s) {
    // Initialize an empty string to store the result.
    let result = "";
    // Initialize a counter for the balance of parentheses.
    // This counter will track the number of open parentheses minus the number of closed parentheses.
    let balance = 0;

    // Iterate through each character in the input string s.
    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        // If the current character is an opening parenthesis '('.
        if (char === '(') {
            // If the balance is greater than 0, it means this opening parenthesis is not the outermost
            // parenthesis of a primitive string. So, we append it to the result.
            // This condition ensures we don't add the first '(' of a primitive string.
            if (balance > 0) {
                result += char;
            }
            // Increment the balance counter because we've encountered an opening parenthesis.
            balance++;
        } else { // If the current character is a closing parenthesis ')'.
            // Decrement the balance counter because we've encountered a closing parenthesis.
            balance--;
            // If the balance is greater than 0, it means this closing parenthesis is not the outermost
            // parenthesis of a primitive string. So, we append it to the result.
            // This condition ensures we don't add the last ')' of a primitive string.
            if (balance > 0) {
                result += char;
            }
        }
    }

    // Return the string with outermost parentheses removed from each primitive component.
    return result;
};
