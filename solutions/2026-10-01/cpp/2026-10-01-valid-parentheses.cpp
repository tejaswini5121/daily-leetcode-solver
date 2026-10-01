// // Problem: Valid Parentheses
// // Link: https://leetcode.com/problems/valid-parentheses/
// // Approach:
// // We can use a stack to solve this problem. We iterate through the input string.
// // If we encounter an opening bracket ('(', '{', '['), we push it onto the stack.
// // If we encounter a closing bracket (')', '}', ']'), we check if the stack is empty.
// // If the stack is empty, it means there's a closing bracket without a corresponding opening bracket, so the string is invalid.
// // If the stack is not empty, we pop the top element. If the popped element is not the corresponding opening bracket for the current closing bracket, the string is invalid.
// // After iterating through the entire string, if the stack is empty, it means all opening brackets have been closed correctly, and the string is valid. Otherwise, it's invalid.
// // Time Complexity: O(n), where n is the length of the input string. We iterate through the string once. Stack operations (push, pop, top, empty) take O(1) time.
// // Space Complexity: O(n) in the worst case, where n is the length of the input string. This occurs when the string consists only of opening brackets, and all are pushed onto the stack.
#include <iostream>
#include <string>
#include <stack>
#include <unordered_map>

class Solution {
public:
    bool isValid(std::string s) {
        // Use a stack to keep track of opening brackets.
        std::stack<char> st;
        // Map to store the corresponding opening bracket for each closing bracket.
        std::unordered_map<char, char> bracketMap = {
            {')', '('},
            {'}', '{'},
            {']', '['}
        };

        // Iterate through each character in the input string.
        for (char c : s) {
            // If the character is an opening bracket, push it onto the stack.
            if (c == '(' || c == '{' || c == '[') {
                st.push(c);
            }
            // If the character is a closing bracket.
            else {
                // If the stack is empty, it means there's no corresponding opening bracket.
                if (st.empty()) {
                    return false; // Invalid string
                }
                // Get the top element from the stack (the most recent opening bracket).
                char topChar = st.top();
                // Pop the element from the stack.
                st.pop();

                // Check if the popped opening bracket matches the current closing bracket.
                // If not, the brackets are not matched correctly.
                if (bracketMap[c] != topChar) {
                    return false; // Invalid string
                }
            }
        }

        // After iterating through the string, if the stack is empty, it means all opening brackets
        // have been closed correctly.
        return st.empty(); // True if valid, false otherwise.
    }
};

/*
// Example Usage (for testing purposes, not part of the LeetCode solution structure)
int main() {
    Solution sol;
    std::cout << "Input: \"()\" Output: " << (sol.isValid("()") ? "true" : "false") << std::endl; // Expected: true
    std::cout << "Input: \"()[]{}\" Output: " << (sol.isValid("()[]{}") ? "true" : "false") << std::endl; // Expected: true
    std::cout << "Input: \"(]\" Output: " << (sol.isValid("(]") ? "true" : "false") << std::endl; // Expected: false
    std::cout << "Input: \"([)]\" Output: " << (sol.isValid("([)]") ? "true" : "false") << std::endl; // Expected: false
    std::cout << "Input: \"{[]}\" Output: " << (sol.isValid("{[]}") ? "true" : "false") << std::endl; // Expected: true
    std::cout << "Input: \"[\" Output: " << (sol.isValid("[") ? "true" : "false") << std::endl; // Expected: false
    std::cout << "Input: \"]\" Output: " << (sol.isValid("]") ? "true" : "false") << std::endl; // Expected: false
    return 0;
}
*/