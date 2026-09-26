/**
 * Problem: Evaluate the Bracket Pairs of a String
 * Link: https://leetcode.com/problems/evaluate-the-bracket-pairs-of-a-string/
 *
 * Approach:
 * 1. Store the key-value pairs from the `knowledge` array into a HashMap for efficient lookups.
 * 2. Iterate through the input string `s`.
 * 3. When an opening parenthesis '(' is encountered, it signifies the start of a bracket pair.
 * 4. Extract the key within the parentheses.
 * 5. Look up the key in the HashMap.
 * 6. If the key is found, append its corresponding value to the result string.
 * 7. If the key is not found, append "?" to the result string.
 * 8. If a character is not part of a bracket pair (i.e., not an opening parenthesis), append it directly to the result string.
 * 9. Use a StringBuilder for efficient string concatenation.
 *
 * Time Complexity: O(N + K), where N is the length of the string `s` and K is the number of entries in `knowledge`.
 *                  The HashMap creation takes O(K) time. Iterating through `s` takes O(N) time, with each lookup in the HashMap being O(1) on average.
 *
 * Space Complexity: O(K), where K is the number of entries in `knowledge`, to store the key-value pairs in the HashMap.
 */
import java.util.HashMap;
import java.util.Map;

class Solution {
    public String evaluate(String s, List<List<String>> knowledge) {
        // Create a HashMap to store the knowledge for efficient lookups.
        // The key of the map will be the bracketed key, and the value will be its replacement.
        Map<String, String> knowledgeMap = new HashMap<>();
        for (List<String> pair : knowledge) {
            knowledgeMap.put(pair.get(0), pair.get(1));
        }

        // Use a StringBuilder to efficiently build the result string.
        StringBuilder result = new StringBuilder();
        // `i` is the current index in the input string `s`.
        int i = 0;
        // Iterate through the input string `s`.
        while (i < s.length()) {
            // Check if the current character is an opening parenthesis, indicating the start of a bracket pair.
            if (s.charAt(i) == '(') {
                // Move `i` to the character after the opening parenthesis.
                i++;
                // Find the index of the closing parenthesis.
                int closingBracketIndex = s.indexOf(')', i);
                // Extract the key from the bracket pair.
                String key = s.substring(i, closingBracketIndex);

                // Look up the key in the knowledgeMap.
                // If the key exists, append its value.
                // If the key does not exist, append "?".
                result.append(knowledgeMap.getOrDefault(key, "?"));

                // Move `i` to the character after the closing parenthesis.
                i = closingBracketIndex + 1;
            } else {
                // If the current character is not an opening parenthesis, it's a regular character.
                // Append it directly to the result string.
                result.append(s.charAt(i));
                // Move to the next character.
                i++;
            }
        }

        // Convert the StringBuilder to a String and return it.
        return result.toString();
    }
}
