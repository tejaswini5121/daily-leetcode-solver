/*
 * Problem Summary:
 * Given a string s, find the lexicographically smallest subsequence that contains all distinct characters of s exactly once.
 *
 * Problem Link:
 * https://leetcode.com/problems/smallest-subsequence-of-distinct-characters/
 *
 * Approach Explanation:
 * This problem can be efficiently solved using a monotonic stack combined with auxiliary data structures to track character occurrences.
 * The goal is to build the result subsequence character by character, ensuring two main properties:
 * 1. All distinct characters are included exactly once.
 * 2. The resulting subsequence is lexicographically smallest.
 *
 * We use the following:
 * - `lastOcc[char - 'a']`: An array to store the last occurrence index of each character in the input string `s`. This helps us decide if a character currently on the stack can be safely removed, knowing it will appear again later.
 * - `inStack[char - 'a']`: A boolean array to track which characters are currently present in our result stack. This ensures that each distinct character is included only once.
 * - `Stack<Character> stack`: The main data structure to build our result subsequence. We maintain a potentially lexicographically increasing sequence.
 *
 * Algorithm Steps:
 * 1. Pre-process `s` to populate `lastOcc`: Iterate through `s` once to record the last index for each character.
 * 2. Iterate through `s` again, character by character (`c`) at index `i`:
 *    a. If `c` is already in the `stack` (checked by `inStack[c - 'a']`), skip it. We only need one instance.
 *    b. If `c` is not in the `stack`:
 *       i. While the `stack` is not empty, and the character at `stack.peek()` is lexicographically *greater* than `c`, AND `stack.peek()` will appear again later in the string
 *          (i.e., its last occurrence index `lastOcc[stack.peek() - 'a']` is greater than the current index `i`):
 *          - Pop `stack.peek()`.
 *          - Mark the popped character as not in `stack` (`inStack[...] = false`).
 *          This step is crucial for achieving lexicographical smallest. If we can replace a larger character with a smaller one that appears later, we do so.
 *       ii. Push `c` onto the `stack`.
 *       iii. Mark `c` as being in `stack` (`inStack[c - 'a'] = true`).
 * 3. After iterating through all characters in `s`, the `stack` will contain the characters of the lexicographically smallest subsequence.
 * 4. Construct the final string by iterating through the stack (from bottom to top for correct order).
 *
 * Time Complexity:
 * O(N), where N is the length of the input string `s`.
 * - Populating `lastOcc` takes O(N).
 * - The main loop iterates N times. Inside the loop, each character is pushed onto the stack at most once and popped from the stack at most once. The `while` loop condition effectively processes each character at most twice (once for push, once for potential pop).
 * - Constructing the result string from the stack takes O(K), where K is the number of distinct characters (at most 26).
 * Overall, the dominant factor is O(N).
 *
 * Space Complexity:
 * O(1) because the size of auxiliary data structures (`lastOcc`, `inStack`, and the `stack`) is bounded by the size of the English alphabet (26 characters), which is a constant.
 */
import java.util.Stack;

class Solution {
    public String smallestSubsequence(String s) {
        // lastOcc stores the last occurrence index for each character 'a' through 'z'.
        // For example, lastOcc['a' - 'a'] stores the last index of 'a'.
        int[] lastOcc = new int[26];
        for (int i = 0; i < s.length(); i++) {
            lastOcc[s.charAt(i) - 'a'] = i;
        }

        // inStack keeps track of characters currently present in our result stack.
        // This ensures we only include each distinct character once.
        boolean[] inStack = new boolean[26];
        // The stack will build our result subsequence.
        Stack<Character> stack = new Stack<>();

        // Iterate through the input string character by character.
        for (int i = 0; i < s.length(); i++) {
            char currentChar = s.charAt(i);

            // If the current character is already in the stack, we skip it.
            // We've already included it, and an earlier occurrence is always preferred
            // for lexicographical order, unless it was removed for a smaller character.
            if (inStack[currentChar - 'a']) {
                continue;
            }

            // Monotonic stack logic:
            // While the stack is not empty, AND the character at the top of the stack
            // is lexicographically greater than the current character, AND
            // the character at the top of the stack will appear again later in the string
            // (i.e., its last occurrence index `lastOcc[stack.peek() - 'a']` is greater than the current index `i`):
            // We can safely pop the larger character from the stack to potentially
            // place the smaller current character earlier, thus forming a
            // lexicographically smaller subsequence.
            while (!stack.isEmpty() && stack.peek() > currentChar && i < lastOcc[stack.peek() - 'a']) {
                char poppedChar = stack.pop();
                inStack[poppedChar - 'a'] = false; // Mark as no longer in stack
            }

            // Push the current character onto the stack.
            stack.push(currentChar);
            // Mark it as being in the stack.
            inStack[currentChar - 'a'] = true;
        }

        // Build the result string from the characters in the stack.
        // Iterating directly over the Stack (e.g., using an enhanced for-loop)
        // processes elements from bottom to top, which is the correct order for our subsequence.
        StringBuilder sb = new StringBuilder();
        for (char c : stack) {
            sb.append(c);
        }

        return sb.toString();
    }
}