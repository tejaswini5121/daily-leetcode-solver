// Given a balanced parentheses string s, return the score of the string.
// The score is calculated recursively: "()" is 1, AB is A + B, and (A) is 2 * A.
// Problem Link: https://leetcode.com/problems/score-of-parentheses/
//
// Approach:
// We can solve this problem using a stack. The stack will store the scores of
// balanced parentheses substrings encountered so far.
// When we see an opening parenthesis '(', we push a placeholder onto the stack.
// When we see a closing parenthesis ')', we pop elements from the stack until
// we find the corresponding opening parenthesis placeholder.
// If the popped element is the placeholder itself, it means we have "()", so we add 1 to the score.
// If the popped element is a score, it means we have "(A)", where A is the sum of popped scores.
// We then multiply this sum by 2 and add it back to the stack (or to the last popped score if it's not a placeholder).
// Finally, after iterating through the string, the sum of elements remaining in the stack will be the total score.
//
// A more efficient stack-based approach:
// Instead of pushing placeholders, we can maintain a stack where each element represents
// the score of a balanced parenthesis substring at that level.
// When we encounter '(', we push 0 onto the stack. This 0 acts as a starting point for a new score.
// When we encounter ')':
//   - Pop the top element from the stack. This is the score of the inner balanced substring (let's call it `inner_score`).
//   - If `inner_score` is 0, it means we just closed an empty pair "()", so its score is 1.
//   - If `inner_score` is greater than 0, it means we closed a pair "(A)", so its score is 2 * `inner_score`.
//   - Add this calculated score (either 1 or 2 * `inner_score`) to the top element of the stack (which represents the score of the parent scope). If the stack is empty, it means this is the outermost score, so we can just add it.
//
// Time Complexity: O(n), where n is the length of the string. We iterate through the string once.
// Space Complexity: O(n) in the worst case for the stack (e.g., "((((....))))").
const scoreOfParentheses = function(s) {
    // Initialize a stack to store scores. The stack will hold intermediate scores.
    // For example, for "(())", when we process the first '(', we push 0.
    // When we process the second '(', we push 0 again.
    // When we see the first ')', we pop 0, calculate score as 1, and add it to the top of stack.
    // When we see the second ')', we pop 1, calculate score as 2 * 1 = 2, and add it to top of stack.
    const stack = [0]; // Start with a base score of 0 for the outermost level.

    // Iterate through each character in the input string.
    for (const char of s) {
        if (char === '(') {
            // If we see an opening parenthesis, push a new score of 0 onto the stack.
            // This 0 represents the start of a new nested balanced parentheses substring.
            stack.push(0);
        } else { // char === ')'
            // If we see a closing parenthesis, it means we've completed a balanced substring.
            // Pop the score of the most recent inner balanced substring.
            const innerScore = stack.pop();

            // Calculate the score of the just-closed balanced substring.
            // If innerScore is 0, it means we encountered "()", whose score is 1.
            // If innerScore is > 0, it means we encountered "(A)", whose score is 2 * A.
            const currentScore = Math.max(1, 2 * innerScore);

            // Add this calculated score to the score of the parent level (which is now the top of the stack).
            // This combines the scores of adjacent balanced substrings or multiplies the score of nested ones.
            const parentScore = stack.pop();
            stack.push(parentScore + currentScore);
        }
    }

    // After iterating through the entire string, the stack will contain a single element,
    // which is the total score of the entire balanced parentheses string.
    return stack[0];
};
```