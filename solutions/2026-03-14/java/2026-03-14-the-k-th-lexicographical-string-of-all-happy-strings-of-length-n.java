```java
// Problem: The k-th Lexicographical String of All Happy Strings of Length n
// Link: https://leetcode.com/problems/the-k-th-lexicographical-string-of-all-happy-strings-of-length-n/
// Approach: This problem can be solved using backtracking. We can generate all happy strings of length n
// in lexicographical order. Since n is small (<= 10) and k is also relatively small (<= 100),
// generating all possible happy strings and then picking the k-th one is feasible.
// We can use a recursive helper function that builds the string character by character.
// At each step, we try appending 'a', 'b', or 'c' if it's different from the last character appended.
// We maintain a counter `k` and decrement it each time we form a complete happy string.
// When `k` becomes 0, we have found our k-th string.

import java.util.ArrayList;
import java.util.List;

class Solution {
    // Stores the k-th happy string once found.
    private String result = "";
    // Counter to track which string we are currently looking for.
    private int currentK;

    /**
     * Finds the k-th lexicographical happy string of length n.
     *
     * @param n The desired length of the happy string.
     * @param k The index (1-based) of the happy string to find.
     * @return The k-th happy string, or an empty string if fewer than k happy strings exist.
     */
    public String getHappyString(int n, int k) {
        this.currentK = k;
        // Start the backtracking process. We can start with any character ('a', 'b', 'c')
        // as the first character, as it will be handled lexicographically by the recursion.
        backtrack(n, "");
        return result;
    }

    /**
     * Recursive helper function to generate happy strings using backtracking.
     *
     * @param n The target length of the happy string.
     * @param currentString The string built so far.
     */
    private void backtrack(int n, String currentString) {
        // If we have already found the k-th string, stop further recursion.
        if (!result.isEmpty()) {
            return;
        }

        // Base case: If the current string has reached the desired length n.
        if (currentString.length() == n) {
            // We have formed a complete happy string.
            currentK--; // Decrement k as we found one valid string.
            if (currentK == 0) {
                // If this is the k-th string, store it and stop.
                result = currentString;
            }
            return;
        }

        // Recursive step: Try appending 'a', 'b', or 'c'.
        for (char c : new char[]{'a', 'b', 'c'}) {
            // Check if the character can be appended (i.e., not the same as the last character).
            if (currentString.isEmpty() || currentString.charAt(currentString.length() - 1) != c) {
                // Append the character and recursively call backtrack.
                backtrack(n, currentString + c);
                // If the result is found during the recursive call, propagate the early exit.
                if (!result.isEmpty()) {
                    return;
                }
            }
        }
    }

    // Time Complexity:
    // The maximum number of happy strings of length n is 3 * 2^(n-1).
    // For n=10, this is 3 * 2^9 = 3 * 512 = 1536.
    // Since k is at most 100, we will at most explore up to the k-th string.
    // In the worst case, we might explore a significant portion of the tree up to depth n.
    // The number of nodes in the tree up to depth n is approximately sum(3 * 2^(i-1)) for i=1 to n.
    // This is roughly O(3 * 2^n).
    // However, since k is small, we stop as soon as we find the k-th string.
    // The effective time complexity is related to generating the k-th string, which is bounded by the number of happy strings up to k.
    // Given n <= 10 and k <= 100, the number of strings explored will be small.
    // The maximum number of operations is proportional to k multiplied by the number of choices at each step (which is at most 3).
    // So, the time complexity is roughly O(k * 3^n) in a very loose upper bound sense, but more accurately, it's bounded by the number of happy strings up to k, which is small for the given constraints.
    // A tighter analysis considering k's limit would be O(k * n) if we consider the number of characters appended, or more precisely, the number of states visited until the k-th string is found.
    // For n=10, k=100, the maximum number of strings of length 10 is 1536. We are guaranteed to find the k-th string or determine it doesn't exist by exploring at most 1536 strings.
    // Thus, the time complexity is O(3 * 2^n) in the worst case (if k is very large), but practically O(k * n) or O(k) for the given constraints where we stop early.

    // Space Complexity:
    // The space complexity is dominated by the recursion depth, which is O(n) for the call stack.
    // The `currentString` also takes O(n) space.
    // Therefore, the space complexity is O(n).
}
```