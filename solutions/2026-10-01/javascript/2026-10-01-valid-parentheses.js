// Problem: Valid Parentheses
// Summary: Checks if a string of parentheses is valid, meaning all open brackets are closed by matching types in the correct order.
// Link: https://leetcode.com/problems/valid-parentheses/
// Approach: Use a stack to keep track of open brackets. When an opening bracket is encountered, push it onto the stack. When a closing bracket is encountered, check if the stack is empty or if the top of the stack is the corresponding opening bracket. If it is, pop the stack; otherwise, the string is invalid. After iterating through the string, if the stack is empty, the string is valid.
// Time Complexity: O(n), where n is the length of the string. We iterate through the string once.
// Space Complexity: O(n), in the worst case (e.g., "((((...))))"), the stack can store up to n/2 elements.

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    // Initialize an empty stack to store opening brackets.
    const stack = [];
    // Define a mapping of closing brackets to their corresponding opening brackets.
    const map = {
        ')': '(',
        '}': '{',
        ']': '['
    };

    // Iterate through each character in the input string.
    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        // If the character is an opening bracket, push it onto the stack.
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        }
        // If the character is a closing bracket:
        else {
            // Check if the stack is empty. If it is, it means we have a closing bracket without a corresponding opening bracket.
            if (stack.length === 0) {
                return false;
            }
            // Pop the last opening bracket from the stack.
            const lastOpenBracket = stack.pop();
            // Check if the popped opening bracket matches the current closing bracket's expected opening bracket.
            if (map[char] !== lastOpenBracket) {
                return false; // Mismatched brackets.
            }
        }
    }

    // After iterating through the entire string, if the stack is empty, it means all opening brackets have been correctly closed.
    // If the stack is not empty, it means there are unclosed opening brackets.
    return stack.length === 0;
};
