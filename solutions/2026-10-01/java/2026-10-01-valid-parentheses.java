// Problem Summary: Check if a string containing only parentheses is valid.
// Link: https://leetcode.com/problems/valid-parentheses/
// Approach:
// We use a stack to keep track of the opening brackets encountered.
// When an opening bracket is seen, push it onto the stack.
// When a closing bracket is seen:
//   - If the stack is empty, it means there's no corresponding opening bracket, so the string is invalid.
//   - Pop the top element from the stack.
//   - If the popped opening bracket does not match the current closing bracket, the string is invalid.
// After iterating through the entire string, if the stack is empty, it means all opening brackets
// have been correctly closed, and the string is valid. Otherwise, there are unmatched opening brackets,
// and the string is invalid.
// Time Complexity: O(n), where n is the length of the input string. We iterate through the string once.
// Space Complexity: O(n) in the worst case, where the string consists of only opening brackets (e.g., "((((...))))").
//                  The stack can grow up to the size of the string.
import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        // Use a stack to store opening brackets
        Stack<Character> stack = new Stack<>();

        // Iterate through each character in the input string
        for (char c : s.toCharArray()) {
            // If the character is an opening bracket, push it onto the stack
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else { // If the character is a closing bracket
                // If the stack is empty, it means there's no corresponding opening bracket for this closing bracket
                if (stack.isEmpty()) {
                    return false; // Invalid string
                }

                // Pop the top element from the stack (which should be the corresponding opening bracket)
                char top = stack.pop();

                // Check if the popped opening bracket matches the current closing bracket
                if (c == ')' && top != '(') {
                    return false; // Mismatched brackets
                }
                if (c == '}' && top != '{') {
                    return false; // Mismatched brackets
                }
                if (c == ']' && top != '[') {
                    return false; // Mismatched brackets
                }
            }
        }

        // After iterating through the entire string, if the stack is empty, it means all opening brackets
        // have been correctly closed.
        // If the stack is not empty, it means there are unmatched opening brackets.
        return stack.isEmpty();
    }
}
```