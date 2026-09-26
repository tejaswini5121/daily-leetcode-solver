/**
 * @param {string} s
 * @param {string[][]} knowledge
 * @return {string}
 */
// Summary: Evaluate bracket pairs in a string using a knowledge base of key-value pairs.
// Link: https://leetcode.com/problems/evaluate-the-bracket-pairs-of-a-string/
// Approach:
// 1. Create a hash map (JavaScript object) from the `knowledge` array for efficient key lookups.
// 2. Iterate through the input string `s`.
// 3. When an opening bracket '(' is encountered, start extracting the key within the brackets.
// 4. Continue extracting characters until a closing bracket ')' is found.
// 5. Look up the extracted key in the knowledge map.
// 6. If the key is found, append its corresponding value to the result string.
// 7. If the key is not found, append a "?" to the result string.
// 8. If the character is not an opening bracket, append it directly to the result string.
// 9. Return the final constructed result string.
// Time Complexity: O(N + K), where N is the length of the string `s` and K is the number of key-value pairs in `knowledge`.
// Building the hash map takes O(K) time. Iterating through the string `s` and performing lookups takes O(N) time because each character is visited at most a constant number of times, and hash map lookups are O(1) on average.
// Space Complexity: O(K) for storing the knowledge in a hash map. In the worst case, all keys from `knowledge` will be stored. The result string can also take up to O(N) space, but this is often considered part of the output, not auxiliary space.
const evaluateBracketPairs = (s, knowledge) => {
    // Create a hash map for efficient lookup of keys.
    // Keys in the hash map will be the keys from `knowledge` and values will be their corresponding values.
    const knowledgeMap = {};
    for (const [key, value] of knowledge) {
        knowledgeMap[key] = value;
    }

    let result = ""; // Initialize an empty string to build the result.
    let i = 0; // Pointer to iterate through the input string `s`.

    // Iterate through the input string `s`.
    while (i < s.length) {
        // Check if the current character is an opening bracket.
        if (s[i] === '(') {
            // If it's an opening bracket, find the corresponding closing bracket.
            let j = i + 1; // Start searching for the closing bracket from the next character.
            while (j < s.length && s[j] !== ')') {
                j++; // Move `j` forward until the closing bracket is found.
            }
            // Extract the key from between the brackets.
            const key = s.substring(i + 1, j);
            // Look up the key in the knowledge map.
            // If the key exists, append its value to the result.
            // Otherwise, append a "?" to the result.
            result += knowledgeMap[key] || "?";
            // Move the main pointer `i` to the position after the closing bracket.
            i = j + 1;
        } else {
            // If the current character is not an opening bracket, append it directly to the result.
            result += s[i];
            // Move the main pointer `i` to the next character.
            i++;
        }
    }

    // Return the evaluated string.
    return result;
};
```