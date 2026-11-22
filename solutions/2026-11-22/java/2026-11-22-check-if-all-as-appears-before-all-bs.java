/**
 * Problem: Check if All A's Appears Before All B's
 * Link: https://leetcode.com/problems/check-if-all-as-appears-before-all-bs/
 *
 * Approach:
 * The problem asks us to verify if all occurrences of 'a' in a string appear before all occurrences of 'b'.
 * We can iterate through the string and maintain a flag to track if we have encountered a 'b' yet.
 * If we encounter an 'a' after we have already seen a 'b', it means the condition is violated, and we can immediately return false.
 * If we reach the end of the string without such a violation, it means all 'a's appear before all 'b's (or there are no 'a's or no 'b's),
 * so we return true.
 *
 * Time Complexity: O(n), where n is the length of the string. We iterate through the string once.
 * Space Complexity: O(1), as we only use a few variables for tracking state.
 */
class Solution {
    public boolean checkString(String s) {
        // Flag to indicate if we have encountered a 'b' character.
        boolean foundB = false;

        // Iterate through each character of the string.
        for (int i = 0; i < s.length(); i++) {
            char currentChar = s.charAt(i);

            // If the current character is 'b', set the foundB flag to true.
            if (currentChar == 'b') {
                foundB = true;
            }
            // If the current character is 'a' and we have already found a 'b',
            // it means an 'a' appears after a 'b', violating the condition.
            else if (currentChar == 'a' && foundB) {
                return false;
            }
        }

        // If the loop completes without returning false, it means all 'a's appear before all 'b's.
        // This also handles cases where the string contains only 'a's, only 'b's, or is empty (though constraints say length >= 1).
        return true;
    }
}