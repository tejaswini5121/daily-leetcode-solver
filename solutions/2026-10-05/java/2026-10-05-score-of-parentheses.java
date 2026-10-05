```java
// Problem: Score of Parentheses
// Link: https://leetcode.com/problems/score-of-parentheses/
// Approach:
// This problem can be solved efficiently using a stack. We iterate through the input string 's'.
// When we encounter an opening parenthesis '(', we push a 0 onto the stack. This 0 will represent the score
// of the substring enclosed within this parenthesis pair.
// When we encounter a closing parenthesis ')', it signifies the end of a balanced substring.
// We pop the top element from the stack. Let this popped value be 'current_score'.
// If 'current_score' is 0, it means we just closed a simple "()" pair, which has a score of 1.
// If 'current_score' is greater than 0, it means we closed a "(A)" structure where A had a score of 'current_score'.
// The score for "(A)" is 2 * A. So, we calculate 2 * current_score.
// After calculating the score for the just-closed pair, we need to add it to the score of the enclosing pair.
// The score of the enclosing pair is represented by the new top of the stack (if the stack is not empty).
// If the stack is empty after popping, it means the just-closed pair is at the top level of the overall string,
// so we add its score to a running total. Otherwise, we update the score at the top of the stack.
//
// Example Walkthrough: s = "(()(()))"
// 1. '(': push 0. Stack: [0]
// 2. '(': push 0. Stack: [0, 0]
// 3. ')': pop 0. current_score = 0. Score = max(1, 2 * 0) = 1. Stack not empty, top is 0. Update top: 0 + 1 = 1. Stack: [1]
// 4. '(': push 0. Stack: [1, 0]
// 5. '(': push 0. Stack: [1, 0, 0]
// 6. ')': pop 0. current_score = 0. Score = max(1, 2 * 0) = 1. Stack not empty, top is 0. Update top: 0 + 1 = 1. Stack: [1, 1]
// 7. ')': pop 1. current_score = 1. Score = max(1, 2 * 1) = 2. Stack not empty, top is 1. Update top: 1 + 2 = 3. Stack: [3]
// 8. ')': pop 3. current_score = 3. Score = max(1, 2 * 3) = 6. Stack empty. Add to total. Total = 6.
// Final Result: 6
//
// Time Complexity: O(N), where N is the length of the string 's'. We iterate through the string once.
// Space Complexity: O(N) in the worst case, for the stack. This occurs for deeply nested parentheses,
// such as "((((...))))".
class Solution {
    public int scoreOfParentheses(String s) {
        // Use a stack to keep track of scores at different nesting levels.
        // Each element on the stack represents the score accumulated within a pair of parentheses.
        java.util.Stack<Integer> stack = new java.util.Stack<>();
        int totalScore = 0; // This will store the final score for top-level expressions.

        // Iterate through each character in the input string.
        for (char c : s.toCharArray()) {
            if (c == '(') {
                // If we see an opening parenthesis, push a 0 onto the stack.
                // This 0 acts as a placeholder for the score of the upcoming inner expression.
                stack.push(0);
            } else { // c == ')'
                // If we see a closing parenthesis, it means we've completed a balanced subexpression.
                // Pop the score of the immediately preceding subexpression from the stack.
                int currentScore = stack.pop();

                // Calculate the score for the just-closed pair:
                // If currentScore is 0, it means we just closed a simple "()" pair. Its score is 1.
                // If currentScore > 0, it means we closed a "(A)" pair where A's score was currentScore.
                // The score for "(A)" is 2 * A.
                // We use Math.max(1, 2 * currentScore) to handle both cases:
                // - If currentScore is 0 (for "()"), 2*0 = 0, max(1, 0) = 1.
                // - If currentScore > 0 (for "(A)"), 2*currentScore, max(1, 2*currentScore) will correctly be 2*currentScore.
                int scoreForThisPair = Math.max(1, 2 * currentScore);

                // Now, we need to add this score to the score of the enclosing expression.
                if (stack.isEmpty()) {
                    // If the stack is empty, it means this pair is at the top level of the string.
                    // Add its score to the totalScore.
                    totalScore += scoreForThisPair;
                } else {
                    // If the stack is not empty, the top element represents the score of the enclosing expression.
                    // Update the enclosing expression's score by adding the score of the current pair.
                    stack.push(stack.pop() + scoreForThisPair);
                }
            }
        }

        // After iterating through the entire string, totalScore holds the final calculated score.
        return totalScore;
    }
}
```