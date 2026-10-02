```java
// Problem Summary: Generate all valid combinations of n pairs of parentheses.
// Link: https://leetcode.com/problems/generate-parentheses/
//
// Approach:
// This problem can be solved using backtracking. We maintain a current string of parentheses
// and keep track of the number of open and closed parentheses used.
// At each step, we have two choices:
// 1. Add an open parenthesis '(': We can do this if the number of open parentheses used
//    is less than n.
// 2. Add a closed parenthesis ')': We can do this if the number of closed parentheses used
//    is less than the number of open parentheses used. This ensures that we always maintain
//    a well-formed structure, where a closing parenthesis never appears before its
//    corresponding opening parenthesis.
//
// The recursion base case is when the length of the current string reaches 2*n (meaning we have used all n pairs).
// At this point, the current string is a valid combination, and we add it to our result list.
//
// Time Complexity:
// The number of valid parentheses combinations is given by the Catalan numbers, C_n.
// The time complexity is roughly O(4^n / sqrt(n)) because at each step, we have at most 2 choices (add '(' or ')'),
// and the depth of the recursion is 2n. This is an approximation and the exact bound relates to Catalan numbers.
//
// Space Complexity:
// The space complexity is O(n) due to the recursion depth (call stack) and the space used to store
// the current string being built. The space for the output list itself is not typically counted
// in space complexity analysis for algorithmic problems, but if it were, it would be O(C_n * n).

import java.util.ArrayList;
import java.util.List;

class Solution {
    /**
     * Generates all combinations of well-formed parentheses.
     *
     * @param n The number of pairs of parentheses.
     * @return A list of all well-formed parentheses combinations.
     */
    public List<String> generateParenthesis(int n) {
        // Initialize a list to store the resulting well-formed parentheses combinations.
        List<String> result = new ArrayList<>();
        // Start the backtracking process with an empty string, 0 open parentheses, and 0 closed parentheses.
        backtrack(result, "", 0, 0, n);
        // Return the list of all generated combinations.
        return result;
    }

    /**
     * Recursive helper function to generate parentheses combinations.
     *
     * @param list       The list to store the valid combinations.
     * @param currentStr The current string of parentheses being built.
     * @param open       The count of open parentheses used so far.
     * @param close      The count of closed parentheses used so far.
     * @param max        The total number of pairs of parentheses (n).
     */
    private void backtrack(List<String> list, String currentStr, int open, int close, int max) {
        // Base case: If the current string has reached the desired length (2*n),
        // it means we have a complete and well-formed combination.
        if (currentStr.length() == max * 2) {
            // Add the complete combination to the result list.
            list.add(currentStr);
            // Stop further recursion for this path.
            return;
        }

        // Recursive step 1: Try adding an open parenthesis '('.
        // We can add an open parenthesis if the number of open parentheses used is less than n.
        if (open < max) {
            // Append '(' to the current string and increment the count of open parentheses.
            // Then, recursively call backtrack for the next step.
            backtrack(list, currentStr + "(", open + 1, close, max);
        }

        // Recursive step 2: Try adding a closed parenthesis ')'.
        // We can add a closed parenthesis only if the number of closed parentheses used
        // is strictly less than the number of open parentheses used. This ensures that
        // we always maintain a valid structure (no closing parenthesis without a preceding open one).
        if (close < open) {
            // Append ')' to the current string and increment the count of closed parentheses.
            // Then, recursively call backtrack for the next step.
            backtrack(list, currentStr + ")", open, close + 1, max);
        }
    }

    // Main method for testing the solution (optional, but good for verification).
    public static void main(String[] args) {
        Solution sol = new Solution();

        // Test case 1: n = 3
        int n1 = 3;
        List<String> result1 = sol.generateParenthesis(n1);
        System.out.println("n = " + n1 + ": " + result1); // Expected: ["((()))","(()())","(())()","()(())","()()()"]

        // Test case 2: n = 1
        int n2 = 1;
        List<String> result2 = sol.generateParenthesis(n2);
        System.out.println("n = " + n2 + ": " + result2); // Expected: ["()"]

        // Test case 3: n = 2
        int n3 = 2;
        List<String> result3 = sol.generateParenthesis(n3);
        System.out.println("n = " + n3 + ": " + result3); // Expected: ["(())", "()()"]
    }
}
```