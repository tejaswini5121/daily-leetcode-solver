```java
// Problem: Weighted Word Mapping
// Problem Description: Calculate word weights based on character weights, map the weighted sum modulo 26 to a character in reverse alphabetical order, and concatenate these characters.
// Link: https://leetcode.com/problems/weighted-word-mapping/
//
// Approach:
// 1. Iterate through each word in the input `words` array.
// 2. For each word, calculate its total weight by summing up the weights of its characters. The weight of a character is obtained from the `weights` array using its position in the alphabet (e.g., 'a' is at index 0, 'b' at index 1).
// 3. After calculating the total weight of a word, take it modulo 26.
// 4. Map this modulo result to a character using reverse alphabetical order. The mapping is as follows: 0 -> 'z', 1 -> 'y', ..., 25 -> 'a'. This can be achieved by calculating 'z' - (result % 26).
// 5. Append the mapped character to a result string.
// 6. Return the final concatenated string.
//
// Time Complexity: O(N*L), where N is the number of words and L is the maximum length of a word. We iterate through each word and for each word, we iterate through its characters to calculate the weight.
// Space Complexity: O(N), where N is the number of words. This is due to the space required to store the resulting string, which can have a length up to N.
class Solution {
    /**
     * Calculates the weighted character mapping for each word and returns the concatenated string.
     *
     * @param words   An array of strings representing words.
     * @param weights An array of 26 integers representing the weight of each lowercase English letter.
     * @return A string formed by concatenating the mapped characters for all words in order.
     */
    public String weightedWordMapping(String[] words, int[] weights) {
        StringBuilder result = new StringBuilder(); // Use StringBuilder for efficient string concatenation

        // Iterate through each word in the input array
        for (String word : words) {
            int wordWeight = 0; // Initialize the weight for the current word

            // Iterate through each character in the current word
            for (char c : word.toCharArray()) {
                // Calculate the index of the character in the alphabet (0 for 'a', 1 for 'b', etc.)
                int charIndex = c - 'a';
                // Add the weight of the character to the total word weight
                wordWeight += weights[charIndex];
            }

            // Calculate the mapped index by taking the word weight modulo 26
            int mappedIndex = wordWeight % 26;

            // Map the index to a character using reverse alphabetical order.
            // 'a' has an ASCII value, and 'z' has an ASCII value.
            // The mapping is 0 -> 'z', 1 -> 'y', ..., 25 -> 'a'.
            // This can be represented as 'z' - mappedIndex.
            char mappedChar = (char) ('z' - mappedIndex);

            // Append the mapped character to the result string
            result.append(mappedChar);
        }

        // Return the final concatenated string
        return result.toString();
    }
}
```