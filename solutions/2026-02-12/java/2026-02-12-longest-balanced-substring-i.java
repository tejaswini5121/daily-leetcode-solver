```java
// Problem: Longest Balanced Substring I
// Link: https://leetcode.com/problems/longest-balanced-substring-i/
//
// Approach:
// The problem asks for the longest substring where all distinct characters appear an equal number of times.
// We can iterate through all possible substrings of the given string `s`.
// For each substring, we need to check if it's "balanced".
// To check if a substring is balanced:
// 1. Count the frequency of each character within the substring.
// 2. Find the distinct characters in the substring.
// 3. If there are no distinct characters (empty substring), it's vacuously balanced.
// 4. If there are distinct characters, pick the frequency of the first distinct character.
// 5. Then, iterate through all other distinct characters and check if their frequencies match the first one.
// 6. If all distinct characters have the same frequency, the substring is balanced.
//
// We maintain a variable `maxLength` to store the length of the longest balanced substring found so far.
//
// Time Complexity:
// We have nested loops to iterate through all possible substrings. The outer loop iterates from `i = 0` to `n-1` (start index),
// and the inner loop iterates from `j = i` to `n-1` (end index), where `n` is the length of the string. This gives O(n^2) substrings.
// For each substring, we iterate through its characters to count frequencies and check for balance.
// In the worst case, a substring can have length `n`. Counting frequencies takes O(k) time where `k` is the number of distinct characters (at most 26 for lowercase English letters).
// Checking for balance involves iterating through the distinct characters, which is also at most O(k).
// Therefore, the overall time complexity is O(n^2 * k), which simplifies to O(n^2 * 26) or O(n^2) since `k` is a constant.
//
// Space Complexity:
// We use a HashMap or an array of size 26 to store character frequencies for each substring. This takes O(k) space, which is O(26) or O(1) as `k` is a constant.
// The space complexity is dominated by this frequency map, so it's O(1).

class Solution {
    public int longestBalancedSubstring(String s) {
        int n = s.length();
        int maxLength = 0;

        // Iterate through all possible start indices of a substring
        for (int i = 0; i < n; i++) {
            // Iterate through all possible end indices of a substring
            for (int j = i; j < n; j++) {
                // Extract the current substring
                String sub = s.substring(i, j + 1);
                
                // Check if the substring is balanced
                if (isBalanced(sub)) {
                    // If balanced, update maxLength if this substring is longer
                    maxLength = Math.max(maxLength, sub.length());
                }
            }
        }

        return maxLength;
    }

    // Helper function to check if a substring is balanced
    private boolean isBalanced(String sub) {
        // If the substring is empty, it's vacuously balanced
        if (sub.isEmpty()) {
            return true;
        }

        // Use an array to store frequency of each character 'a' through 'z'
        // Initialize with 0s
        int[] freq = new int[26];
        
        // Count frequencies of characters in the substring
        for (char c : sub.toCharArray()) {
            freq[c - 'a']++;
        }

        // Find the frequency of the first distinct character encountered
        int targetFreq = -1;
        
        // Iterate through the frequency array to find the first non-zero frequency
        for (int count : freq) {
            if (count > 0) {
                targetFreq = count;
                break; // Found the frequency of the first distinct character
            }
        }
        
        // If targetFreq is still -1, it means the substring was empty, which is handled at the start.
        // This part ensures all other distinct characters also have this targetFreq.
        for (int count : freq) {
            // If a character exists (count > 0) but its frequency is not the targetFreq,
            // then the substring is not balanced.
            if (count > 0 && count != targetFreq) {
                return false;
            }
        }

        // If all checks pass, the substring is balanced
        return true;
    }
}
```