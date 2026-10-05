// Problem: Score of Parentheses
// Link: https://leetcode.com/problems/score-of-parentheses/
//
// Approach:
// We can use a stack to keep track of the scores.
// When we see an opening parenthesis '(', we push the current score onto the stack
// and reset the current score to 0. This is because we are starting a new nested
// structure.
// When we see a closing parenthesis ')', it signifies the end of a structure.
// We pop the previous score from the stack. The score for the current structure
// is either 1 (if it was an empty "()") or 2 times the score of the nested
// content (if it was of the form "(A)"). We then add this score to the popped
// previous score, updating our current score.
//
// Time Complexity: O(N), where N is the length of the string. We iterate through the string once.
// Space Complexity: O(N) in the worst case, for the stack, which can hold up to N/2 elements
//                   if the string is like "((...()))".
#include <iostream>
#include <string>
#include <stack>
#include <algorithm>

class Solution {
public:
    int scoreOfParentheses(std::string s) {
        // Stack to store scores of nested parentheses.
        std::stack<int> st;
        // Variable to keep track of the current score.
        int current_score = 0;

        // Iterate through each character in the string.
        for (char c : s) {
            if (c == '(') {
                // When an opening parenthesis is encountered, push the current score
                // onto the stack and reset current_score to 0 for the new nested scope.
                st.push(current_score);
                current_score = 0;
            } else { // c == ')'
                // When a closing parenthesis is encountered, it means a structure has ended.
                // Pop the score of the outer scope from the stack.
                int outer_score = st.top();
                st.pop();

                // Calculate the score for the just-closed structure:
                // If current_score is 0, it means we just closed "()", which has a score of 1.
                // Otherwise, it means we closed "(A)", where A is the content represented by current_score.
                // The score for "(A)" is 2 * A.
                // So, the score for the closed structure is max(1, 2 * current_score).
                // Then, add this score to the score of the outer scope.
                current_score = outer_score + std::max(1, 2 * current_score);
            }
        }
        // After processing the entire string, current_score will hold the total score.
        return current_score;
    }
};

/*
int main() {
    Solution sol;
    std::cout << "Score of \"()\": " << sol.scoreOfParentheses("()") << std::endl; // Expected: 1
    std::cout << "Score of \"(())\": " << sol.scoreOfParentheses("(())") << std::endl; // Expected: 2
    std::cout << "Score of \"()()\": " << sol.scoreOfParentheses("()()") << std::endl; // Expected: 2
    std::cout << "Score of \"(()(()))\": " << sol.scoreOfParentheses("(()(()))") << std::endl; // Expected: 6
    std::cout << "Score of \"((()))\": " << sol.scoreOfParentheses("((()))") << std::endl; // Expected: 4
    return 0;
}
*/