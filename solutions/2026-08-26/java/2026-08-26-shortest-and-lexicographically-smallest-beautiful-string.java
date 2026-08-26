```java
/**
 * Finds the shortest and lexicographically smallest beautiful substring of a binary string.
 * A substring is beautiful if it contains exactly k ones.
 *
 * Problem Link: https://leetcode.com/problems/shortest-and-lexicographically-smallest-beautiful-string/
 *
 * Approach:
 * We can use a sliding window approach to find all beautiful substrings.
 * First, we iterate through the string to find the minimum length of a beautiful substring.
 * We maintain a count of ones within the current window. When the count reaches k, we have a potential beautiful substring.
 * We keep track of the minimum length found so far.
 *
 * After finding the minimum length, we iterate through the string again.
 * This time, for each substring of the minimum length, we check if it's beautiful.
 * If it is beautiful, we compare it with the current lexicographically smallest beautiful substring found and update if necessary.
 *
 * Time Complexity: O(N^2) where N is the length of the string s.
 * The first pass to find the minimum length takes O(N).
 * The second pass to find the lexicographically smallest substring of minimum length involves iterating through all possible start positions (N)
 * and for each start position, checking substrings of minimum length (which can be up to N).
 * In the worst case, if k is large, the minimum length can be close to N, leading to O(N*N) for substring extraction and comparison.
 *
 * Space Complexity: O(N) in the worst case for storing the result string.
 */
class Solution {
    public String shortestBeautifulSubstring(String s, int k) {
        int n = s.length();
        int minLen = Integer.MAX_VALUE; // Initialize minimum length to a very large value

        // First pass: Find the minimum length of a beautiful substring
        for (int i = 0; i < n; i++) {
            int onesCount = 0; // Counter for ones in the current substring
            for (int j = i; j < n; j++) {
                if (s.charAt(j) == '1') {
                    onesCount++; // Increment count if a '1' is encountered
                }
                // If the number of ones reaches k, we have found a beautiful substring
                if (onesCount == k) {
                    minLen = Math.min(minLen, j - i + 1); // Update minimum length
                    break; // No need to extend this substring further as we are looking for the shortest
                }
            }
        }

        // If no beautiful substring was found (minLen is still at its initial large value)
        if (minLen == Integer.MAX_VALUE) {
            return ""; // Return an empty string
        }

        String lexicographicallySmallest = ""; // Initialize the lexicographically smallest beautiful substring

        // Second pass: Find the lexicographically smallest beautiful substring of minLen
        for (int i = 0; i <= n - minLen; i++) {
            String sub = s.substring(i, i + minLen); // Extract substring of minLen
            int onesCount = 0; // Counter for ones in the extracted substring

            // Count ones in the extracted substring
            for (char c : sub.toCharArray()) {
                if (c == '1') {
                    onesCount++;
                }
            }

            // If the substring is beautiful (has exactly k ones)
            if (onesCount == k) {
                // If this is the first beautiful substring of minLen found, or
                // if this substring is lexicographically smaller than the current smallest
                if (lexicographicallySmallest.isEmpty() || sub.compareTo(lexicographicallySmallest) < 0) {
                    lexicographicallySmallest = sub; // Update the smallest
                }
            }
        }

        return lexicographicallySmallest; // Return the result
    }
}
```