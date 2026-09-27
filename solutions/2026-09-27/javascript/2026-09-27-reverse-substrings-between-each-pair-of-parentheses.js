// Problem: Reverse Substrings Between Each Pair of Parentheses
// Summary: Given a string with balanced parentheses, reverse substrings within each matching pair, starting from the innermost. The final output should not contain parentheses.
// Link: https://leetcode.com/problems/reverse-substrings-between-each-pair-of-parentheses/
// Approach:
// We can use a stack to keep track of the characters encountered.
// When we see an opening parenthesis '(', we push the current "level" of the string being built onto the stack and start a new level.
// When we see a closing parenthesis ')', we pop the previous level from the stack, reverse the current level of characters, and then prepend the popped level to the reversed current level.
// For characters other than parentheses, we simply append them to the current level.
// Finally, after processing the entire string, the result will be the characters in the last level.
// Time Complexity: O(N^2) in the worst case, where N is the length of the string. This is because reversing substrings can take O(k) time, where k is the length of the substring, and this can happen multiple times. For example, if we have nested parentheses like "((((a))))", reversing "a" takes O(1), then reversing "a" again takes O(1), and so on. However, a string like "(a(b(c)))" would involve reversing "c", then "bc", then "abc", leading to O(N^2). A more precise analysis might consider that each character is reversed at most as many times as its nesting depth.
// Space Complexity: O(N) in the worst case, due to the stack potentially storing a significant portion of the string if it's deeply nested.
const reverseParentheses = (s) => {
    // Stack to store characters and intermediate results.
    const stack = [];
    // The current string being built at the current nesting level.
    let currentString = "";

    // Iterate through each character in the input string.
    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        // If the character is an opening parenthesis.
        if (char === '(') {
            // Push the current string being built onto the stack.
            stack.push(currentString);
            // Reset currentString to start building the content within the new parentheses.
            currentString = "";
        }
        // If the character is a closing parenthesis.
        else if (char === ')') {
            // Pop the string from the previous level (before the current pair of parentheses).
            const previousString = stack.pop();
            // Reverse the currentString (content within the parentheses).
            const reversedSubstring = currentString.split('').reverse().join('');
            // Concatenate the previous string with the reversed substring.
            currentString = previousString + reversedSubstring;
        }
        // If the character is a lowercase English letter.
        else {
            // Append the character to the currentString.
            currentString += char;
        }
    }

    // The final currentString contains the result without any parentheses.
    return currentString;
};
