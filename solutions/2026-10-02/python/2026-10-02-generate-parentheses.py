```python
# Generates all combinations of well-formed parentheses for n pairs.
# Link: https://leetcode.com/problems/generate-parentheses/
#
# Approach:
# This problem can be solved using backtracking. We can build the string character by character.
# At each step, we have two choices: add an opening parenthesis '(' or a closing parenthesis ')'.
# However, we must adhere to two rules to ensure well-formedness:
# 1. We can only add an opening parenthesis if the number of open parentheses used so far is less than n.
# 2. We can only add a closing parenthesis if the number of closing parentheses used so far is less than the number of open parentheses used so far.
# Once the length of the generated string reaches 2 * n, we have a valid combination and add it to our result list.
#
# Time Complexity: O(4^n / sqrt(n))
# This is related to the Catalan numbers. In the worst case, we explore a tree of possibilities.
# Each node can have up to two branches (adding '(' or ')'). The depth of the tree is 2n.
#
# Space Complexity: O(n)
# This is due to the recursion depth of the backtracking function, which can go up to 2n.
# The space for storing the result list also contributes, but it's dependent on the number of valid combinations,
# which is also bounded by Catalan numbers.

class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        # Initialize an empty list to store the resulting combinations.
        result = []

        # Define the backtracking helper function.
        # current_string: the string built so far.
        # open_count: the number of open parentheses used.
        # close_count: the number of close parentheses used.
        def backtrack(current_string, open_count, close_count):
            # Base case: If the current string has reached the desired length (2*n),
            # it means we have a complete and well-formed combination.
            if len(current_string) == 2 * n:
                result.append(current_string)
                return

            # Recursive step 1: Try adding an opening parenthesis.
            # We can add an opening parenthesis if the number of open parentheses used
            # is less than the total number of pairs 'n'.
            if open_count < n:
                backtrack(current_string + "(", open_count + 1, close_count)

            # Recursive step 2: Try adding a closing parenthesis.
            # We can add a closing parenthesis if the number of closing parentheses used
            # is less than the number of open parentheses used. This ensures that we don't
            # have more closing parentheses than opening ones at any point, maintaining well-formedness.
            if close_count < open_count:
                backtrack(current_string + ")", open_count, close_count + 1)

        # Start the backtracking process with an empty string and zero counts for open and close parentheses.
        backtrack("", 0, 0)
        return result

```