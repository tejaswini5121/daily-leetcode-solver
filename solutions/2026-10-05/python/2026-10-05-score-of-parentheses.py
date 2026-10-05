```python
# Problem: Score of Parentheses
# Link: https://leetcode.com/problems/score-of-parentheses/
#
# Approach:
# We can solve this problem using a stack. The stack will store the scores of
# nested balanced parentheses.
# When we encounter an opening parenthesis '(', we push 0 onto the stack. This
# 0 acts as a placeholder for the score of the potential inner expression.
# When we encounter a closing parenthesis ')', we pop the top element from the
# stack. This popped element represents the score of the balanced
# parentheses string immediately preceding this closing parenthesis.
#
# If the popped score is 0, it means we have encountered a simple "()" pair,
# which has a score of 1. We then add this score to the current top of the
# stack (which represents the score of the outer expression).
# If the popped score is greater than 0, it means we have encountered a
# "(A)" structure where A has a score of 'popped_score'. The score of "(A)"
# is 2 * A. So, we multiply the popped score by 2 and add it to the current
# top of the stack.
#
# After processing the entire string, the final score will be the single
# element remaining in the stack.
#
# Time Complexity: O(N), where N is the length of the string s. We iterate
# through the string once. Stack operations (push and pop) take O(1) time.
# Space Complexity: O(N) in the worst case. The maximum depth of the stack can
# be N/2 for a string like "((((....))))".

class Solution:
    def scoreOfParentheses(self, s: str) -> int:
        # Initialize a stack to store scores.
        # Start with a 0 to handle the outermost level score.
        stack = [0]

        # Iterate through each character in the input string
        for char in s:
            if char == '(':
                # If we see an opening parenthesis, push a 0 onto the stack.
                # This 0 will accumulate the score of the expression inside this parenthesis.
                stack.append(0)
            else:
                # If we see a closing parenthesis, it means we've completed a
                # balanced sub-expression.
                # Pop the score of the just-completed sub-expression.
                score_of_inner = stack.pop()

                # The score for a "()" is 1.
                # The score for "(A)" is 2 * A.
                # If score_of_inner is 0, it means we just closed a "()" which has a score of 1.
                # Otherwise, we closed "(A)" where A's score is score_of_inner, so its score is 2 * score_of_inner.
                # We add this calculated score to the score of the outer expression,
                # which is currently at the top of the stack.
                stack[-1] += max(1, 2 * score_of_inner)

        # After iterating through the entire string, the stack will contain
        # a single element, which is the total score of the balanced parentheses string.
        return stack[0]

```