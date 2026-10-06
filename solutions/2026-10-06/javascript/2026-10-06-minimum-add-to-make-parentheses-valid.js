// Summary: Calculate the minimum additions to make a parentheses string valid.
// Link: https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/
// Approach: We can use a stack-like approach or simply two counters to track the balance of parentheses.
// One counter, 'balance', will track the number of open parentheses that are currently unmatched.
// Another counter, 'additions', will track the number of parentheses we need to add.
// When we see an opening parenthesis '(', we increment 'balance'.
// When we see a closing parenthesis ')':
//   If 'balance' is greater than 0, it means we have a matching open parenthesis, so we decrement 'balance'.
//   If 'balance' is 0, it means this closing parenthesis is unmatched, so we need to add an opening parenthesis to make it valid. We increment 'additions'.
// After iterating through the string, any remaining 'balance' indicates unmatched open parentheses that need corresponding closing parentheses. So we add 'balance' to 'additions'.
// Time Complexity: O(n), where n is the length of the string s. We iterate through the string once.
// Space Complexity: O(1), as we only use a few constant space variables (balance and additions).
/**
 * @param {string} s
 * @return {number}
 */
var minAddToMakeValid = function(s) {
    // Initialize 'balance' to track unmatched open parentheses.
    let balance = 0;
    // Initialize 'additions' to track the minimum number of parentheses to add.
    let additions = 0;

    // Iterate through each character in the string.
    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        // If the character is an opening parenthesis.
        if (char === '(') {
            // Increment the balance as we've encountered an open parenthesis.
            balance++;
        } else { // If the character is a closing parenthesis.
            // If there's an open parenthesis to match this closing one.
            if (balance > 0) {
                // Decrement balance as we've found a valid pair.
                balance--;
            } else {
                // If balance is 0, this closing parenthesis is unmatched.
                // We need to add an opening parenthesis to make it valid.
                additions++;
            }
        }
    }

    // After iterating through the string, any remaining 'balance' represents unmatched open parentheses.
    // These also need corresponding closing parentheses to be added.
    additions += balance;

    // Return the total number of additions required.
    return additions;
};
