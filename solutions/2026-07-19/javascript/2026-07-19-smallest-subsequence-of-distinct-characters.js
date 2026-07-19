// Summary: Find the lexicographically smallest subsequence with all distinct characters.
// Link: https://leetcode.com/problems/smallest-subsequence-of-distinct-characters/
// Approach:
// We can use a greedy approach with a stack to build the smallest subsequence.
// We iterate through the input string `s`. For each character `char`:
// 1. If `char` has already been included in our subsequence (tracked by a set `seen`), we skip it.
// 2. If `char` is not in `seen`, we consider adding it to our subsequence (represented by the `stack`).
//    Before adding, we check if the last character in the `stack` is lexicographically larger than `char`
//    AND if the last character in the `stack` appears later in the string `s` (checked using a frequency map `lastOccurence`).
//    If both conditions are true, it means we can potentially get a smaller subsequence by removing the larger character
//    from the stack and re-adding it later. So, we pop from the `stack` and remove the popped character from `seen`.
//    We repeat this popping process until the conditions are no longer met.
// 3. After the popping process, we push `char` onto the `stack` and add it to `seen`.
// Finally, we join the characters in the `stack` to form the result string.
// Time Complexity: O(n), where n is the length of the string `s`. Each character is pushed and popped from the stack at most once.
// Space Complexity: O(k), where k is the number of distinct characters in `s` (at most 26 for lowercase English letters). This is for the `seen` set and `lastOccurence` map.
const smallestSubsequence = (s) => {
    // Map to store the last occurrence index of each character.
    const lastOccurence = {};
    for (let i = 0; i < s.length; i++) {
        lastOccurence[s[i]] = i;
    }

    // Set to keep track of characters already included in the subsequence.
    const seen = new Set();
    // Stack to build the lexicographically smallest subsequence.
    const stack = [];

    // Iterate through the input string.
    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        // If the character is already in our subsequence, skip it.
        if (seen.has(char)) {
            continue;
        }

        // While the stack is not empty,
        // AND the current character is lexicographically smaller than the top of the stack,
        // AND the character at the top of the stack appears later in the string:
        // Pop the top of the stack and remove it from `seen`. This is because we can
        // potentially form a smaller subsequence by using the current character now
        // and adding the popped character later if it's still beneficial.
        while (stack.length > 0 && char < stack[stack.length - 1] && i < lastOccurence[stack[stack.length - 1]]) {
            seen.delete(stack.pop());
        }

        // Push the current character onto the stack and mark it as seen.
        stack.push(char);
        seen.add(char);
    }

    // Join the characters in the stack to form the result string.
    return stack.join('');
};
```