/**
 * @fileoverview LeetCode Problem: Generate Parentheses
 * @author [Your Name/LeetCode Username]
 * @date [Current Date]
 *
 * Problem Summary:
 * Generates all valid combinations of n pairs of parentheses.
 *
 * Link:
 * https://leetcode.com/problems/generate-parentheses/
 *
 * Approach Explanation:
 * This problem can be solved using backtracking. We build the parenthesis string character by character.
 * At each step, we have two choices: add an opening parenthesis '(' or a closing parenthesis ')'.
 *
 * Constraints for adding parentheses:
 * 1. We can add an opening parenthesis if the number of open parentheses used so far is less than n.
 * 2. We can add a closing parenthesis if the number of closing parentheses used so far is less than the number of open parentheses used so far. This ensures that we never have a closing parenthesis without a matching open parenthesis before it, thus maintaining well-formedness.
 *
 * Base Case:
 * When the length of the current string reaches 2*n (meaning we have used all n pairs of parentheses), we have found a valid combination and add it to our result list.
 *
 * Time Complexity:
 * The time complexity is roughly O(4^n / sqrt(n)). This is because at each step, we have up to two choices, but the valid paths are constrained. The number of valid parenthesis combinations is given by the Catalan numbers, C_n = (1/(n+1)) * (2n choose n). Generating each string takes O(n) time.
 *
 * Space Complexity:
 * The space complexity is O(n) for the recursion stack and to store the current string being built. The output list will store O(4^n / sqrt(n)) strings, each of length O(n). If we consider the output space, it's O(n * (4^n / sqrt(n))). However, typically, when analyzing space complexity for algorithms, we exclude the output space.
 */

/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    // Array to store all valid combinations of parentheses
    const result = [];

    /**
     * Backtracking helper function to build parenthesis combinations.
     * @param {string} currentString - The current string of parentheses being built.
     * @param {number} openCount - The number of open parentheses used so far.
     * @param {number} closeCount - The number of closing parentheses used so far.
     */
    function backtrack(currentString, openCount, closeCount) {
        // Base case: If the current string has reached the desired length (2*n),
        // it means we have formed a complete and valid combination.
        if (currentString.length === 2 * n) {
            result.push(currentString); // Add the valid combination to the result list
            return; // Stop further recursion for this path
        }

        // Recursive step 1: Add an opening parenthesis if we haven't used all n open parentheses yet.
        // This ensures we always have enough open parentheses to potentially close later.
        if (openCount < n) {
            // Explore the path by adding '('
            backtrack(currentString + '(', openCount + 1, closeCount);
        }

        // Recursive step 2: Add a closing parenthesis if the number of closing parentheses
        // is less than the number of open parentheses. This is crucial for maintaining
        // well-formedness, ensuring we don't close a parenthesis that hasn't been opened.
        if (closeCount < openCount) {
            // Explore the path by adding ')'
            backtrack(currentString + ')', openCount, closeCount + 1);
        }
    }

    // Start the backtracking process with an empty string, 0 open parentheses, and 0 close parentheses.
    backtrack("", 0, 0);

    // Return the list of all generated valid parenthesis combinations.
    return result;
};
```