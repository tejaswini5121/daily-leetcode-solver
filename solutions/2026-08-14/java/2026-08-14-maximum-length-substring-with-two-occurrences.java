```java
// Problem: Maximum Length Substring With Two Occurrences
// Link: https://leetcode.com/problems/maximum-length-substring-with-two-occurrences/
//
// Approach:
// This problem can be solved using a sliding window approach.
// We maintain a window [left, right] and a frequency map (or an array for lowercase English letters)
// to store the count of each character within the current window.
// We expand the window by moving the 'right' pointer. For each character added, we update its count.
// If the count of any character exceeds 2, we shrink the window from the 'left' side
// until the condition (at most two occurrences of each character) is met again.
// At each step where the condition is met, we update the maximum length of the valid substring.
//
// Time Complexity: O(N), where N is the length of the string.
// The 'right' pointer traverses the string once, and the 'left' pointer also traverses at most once.
// Each character operation (increment, decrement, check count) takes O(1) time.
//
// Space Complexity: O(1), as the frequency map will store counts for at most 26 lowercase English letters,
// which is a constant amount of space.

import java.util.HashMap;
import java.util.Map;

class Solution {
    public int maximumLengthSubstring(String s) {
        // Initialize the maximum length found so far to 0.
        int maxLength = 0;
        // Initialize the left pointer of the sliding window to 0.
        int left = 0;
        // Use a HashMap to store the frequency of each character within the current window.
        // For this problem, since the input consists only of lowercase English letters,
        // an array of size 26 could also be used for slightly better performance.
        Map<Character, Integer> charCounts = new HashMap<>();

        // Iterate through the string with the right pointer.
        for (int right = 0; right < s.length(); right++) {
            // Get the character at the current right pointer.
            char currentChar = s.charAt(right);
            // Increment the count of the current character in the map.
            // The getOrDefault method safely handles characters not yet in the map.
            charCounts.put(currentChar, charCounts.getOrDefault(currentChar, 0) + 1);

            // Check if the current window is invalid, meaning any character occurs more than twice.
            // While the window is invalid:
            while (charCounts.get(currentChar) > 2) {
                // Get the character at the current left pointer.
                char leftChar = s.charAt(left);
                // Decrement the count of the character at the left pointer.
                charCounts.put(leftChar, charCounts.get(leftChar) - 1);
                // If the count of the character becomes 0, remove it from the map to keep it clean.
                if (charCounts.get(leftChar) == 0) {
                    charCounts.remove(leftChar);
                }
                // Shrink the window by moving the left pointer one step to the right.
                left++;
            }

            // At this point, the window [left, right] is guaranteed to be valid.
            // Calculate the current length of the valid window.
            int currentLength = right - left + 1;
            // Update the maximum length found so far.
            maxLength = Math.max(maxLength, currentLength);
        }

        // Return the maximum length of a valid substring.
        return maxLength;
    }
}
```