// Problem Summary: Process a string with letters and special characters (*, #, %) to build a new string.
// '*' removes the last character, '#' duplicates the current string, and '%' reverses it.
// Link: https://leetcode.com/problems/process-string-with-special-operations-i/
// Approach: We can simulate the process by maintaining a `StringBuilder` that represents the `result` string.
// We iterate through the input string `s` character by character.
// If the character is a lowercase letter, we append it to the `StringBuilder`.
// If the character is '*', we check if the `StringBuilder` is not empty and delete the last character.
// If the character is '#', we duplicate the current content of the `StringBuilder` by appending it to itself.
// If the character is '%', we reverse the content of the `StringBuilder`.
// Finally, we return the string representation of the `StringBuilder`.
// Time Complexity: O(N*M), where N is the length of the input string `s` and M is the maximum length of the `result` string.
// The '#' and '%' operations can take up to O(M) time. In the worst case, if `s` consists of many '#' and '%' characters,
// the length of the `result` string can grow exponentially. However, given the constraint s.length <= 20,
// the maximum length of the result string will be bounded. For practical purposes and given the small constraint,
// we can consider it close to O(N) in many cases, but the theoretical worst-case for unbounded string length is higher.
// Given s.length <= 20, the maximum length of the result string won't exceed 2^20 which is a large but finite number.
// For the purpose of complexity analysis with the given constraint, it's more accurate to say O(N * max_result_length).
// Since max_result_length can be at most 2^20 (theoretically), this is the upper bound.
// Space Complexity: O(M), where M is the maximum length of the `result` string. This is due to the `StringBuilder` storing the result.
class Solution {
    public String processString(String s) {
        // Use StringBuilder for efficient string manipulation.
        StringBuilder result = new StringBuilder();

        // Iterate through each character of the input string.
        for (char c : s.toCharArray()) {
            // If the character is a lowercase English letter, append it to the result.
            if (c >= 'a' && c <= 'z') {
                result.append(c);
            }
            // If the character is '*', remove the last character from the result if it exists.
            else if (c == '*') {
                if (result.length() > 0) {
                    result.deleteCharAt(result.length() - 1);
                }
            }
            // If the character is '#', duplicate the current result and append it to itself.
            else if (c == '#') {
                // Append the current content of result to itself.
                result.append(result.toString());
            }
            // If the character is '%', reverse the current result.
            else if (c == '%') {
                // Reverse the StringBuilder in-place.
                result.reverse();
            }
        }

        // Convert the final StringBuilder to a String and return it.
        return result.toString();
    }
}
