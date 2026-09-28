// Problem: Maximum Nesting Depth of the Parentheses
// Link: https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/
//
// Approach:
// We can solve this problem by iterating through the string and keeping track of the current nesting depth.
// When we encounter an opening parenthesis '(', we increment the current depth.
// When we encounter a closing parenthesis ')', we decrement the current depth.
// We also maintain a variable to store the maximum depth encountered so far.
//
// Time Complexity: O(n), where n is the length of the input string.
// We iterate through the string once.
//
// Space Complexity: O(1).
// We only use a few variables to store the current depth and maximum depth.

class Solution {
    /**
     * Given a valid parentheses string s, return the nesting depth of s.
     * The nesting depth is the maximum number of nested parentheses.
     *
     * @param s The input string, which is a valid parentheses string.
     * @return The maximum nesting depth of the parentheses.
     */
    public int maxDepth(String s) {
        // Initialize the maximum depth found so far to 0.
        int maxDepth = 0;
        // Initialize the current nesting depth to 0.
        int currentDepth = 0;

        // Iterate through each character in the input string.
        for (char c : s.toCharArray()) {
            // If the character is an opening parenthesis '(', it means we are entering a new level of nesting.
            if (c == '(') {
                // Increment the current depth.
                currentDepth++;
                // Update the maximum depth if the current depth is greater than the maximum depth found so far.
                maxDepth = Math.max(maxDepth, currentDepth);
            }
            // If the character is a closing parenthesis ')', it means we are exiting a level of nesting.
            else if (c == ')') {
                // Decrement the current depth.
                currentDepth--;
            }
            // Other characters (digits and operators) do not affect the nesting depth, so we ignore them.
        }

        // After iterating through the entire string, maxDepth will hold the maximum nesting depth encountered.
        return maxDepth;
    }
}
