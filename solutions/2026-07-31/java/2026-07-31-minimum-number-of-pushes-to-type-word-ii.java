```java
// Problem: Minimum Number of Pushes to Type Word II
// Link: https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-ii/
//
// Problem Summary:
// Given a word, find the minimum number of key presses required to type it by remapping
// lowercase English letters to telephone keys (2-9). Each character on a key requires
// an increasing number of presses based on its position on that key.
//
// Approach:
// The core idea is to assign the most frequent characters to keys that require the fewest presses.
// We can use a frequency map to count the occurrences of each character in the input `word`.
// Then, we sort these frequencies in descending order.
// We have 8 keys available (2 through 9).
// The first 8 most frequent characters can be assigned to different keys, each requiring 1 push.
// The next 8 most frequent characters can be assigned to these same keys, but they will require 2 pushes.
// This pattern continues: the first 8 characters get 1 push, the next 8 get 2 pushes, the next 8 get 3 pushes, and so on.
// We iterate through the sorted frequencies and calculate the total pushes.
//
// Time Complexity: O(N + C log C) where N is the length of `word` and C is the number of unique characters (at most 26).
// - Counting character frequencies: O(N)
// - Sorting frequencies: O(C log C)
// - Calculating total pushes: O(C)
//
// Space Complexity: O(C) where C is the number of unique characters (at most 26) for the frequency map.
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Collections;
import java.util.ArrayList;
import java.util.List;

class Solution {
    public int minimumPushes(String word) {
        // Frequency map to store the count of each character.
        Map<Character, Integer> freqMap = new HashMap<>();
        for (char c : word.toCharArray()) {
            freqMap.put(c, freqMap.getOrDefault(c, 0) + 1);
        }

        // Store the frequencies in a list.
        List<Integer> frequencies = new ArrayList<>(freqMap.values());

        // Sort frequencies in descending order. The most frequent characters should be prioritized.
        Collections.sort(frequencies, Collections.reverseOrder());

        int totalPushes = 0;
        int keyPresses = 1; // Starts with 1 push per character for the first 8 unique characters.
        int charactersOnKey = 0; // Counts how many characters have been assigned to the current key press level.

        // Iterate through the sorted frequencies.
        for (int freq : frequencies) {
            // Add the cost of typing this character. The cost is its frequency * current key presses.
            totalPushes += freq * keyPresses;

            // Increment the count of characters assigned to the current key press level.
            charactersOnKey++;

            // If we have assigned 8 characters to the current key press level,
            // reset the counter and increment the key presses for the next set of characters.
            // This simulates moving to the next "level" of key presses (e.g., from 1 push to 2 pushes).
            if (charactersOnKey == 8) {
                keyPresses++;
                charactersOnKey = 0;
            }
        }

        return totalPushes;
    }
}
```