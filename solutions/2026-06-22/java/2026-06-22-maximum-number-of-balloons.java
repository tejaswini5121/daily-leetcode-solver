// Problem: Maximum Number of Balloons
// Problem Summary: Determine how many times the word "balloon" can be formed using characters from a given text.
// Link: https://leetcode.com/problems/maximum-number-of-balloons/
//
// Approach:
// To solve this problem, we need to count the frequency of each character in the input `text` and compare it with the required frequency of characters in the word "balloon".
// The word "balloon" requires:
// - 1 'b'
// - 1 'a'
// - 2 'l's
// - 2 'o's
// - 1 'n'
//
// We can use a frequency map (or an array of size 26 for lowercase English letters) to store the counts of characters in `text`.
// After counting, we calculate how many "balloons" can be formed based on the available characters.
// For 'b', 'a', and 'n', the number of balloons is limited by their count in `text`.
// For 'l' and 'o', since we need two of each per "balloon", the number of balloons is limited by half of their count in `text` (integer division).
// The minimum of these limitations will be our final answer.
//
// Time Complexity: O(N), where N is the length of the input `text`.
// We iterate through the `text` once to build the frequency map. Then, we perform a constant number of operations (checking counts for 5 distinct characters) to determine the maximum number of balloons.
//
// Space Complexity: O(1).
// The space used by the frequency map (or array) is constant, as it only stores counts for 26 lowercase English letters, regardless of the input string's length.

class Solution {
    public int maxNumberOfBalloons(String text) {
        // Frequency map to store the count of each character in the input text.
        // Using an array of size 26 for lowercase English letters ('a' through 'z').
        int[] charCounts = new int[26];

        // Iterate through the input string to populate the frequency map.
        for (char c : text.toCharArray()) {
            // Increment the count for the corresponding character.
            // 'c - 'a'' gives the index for the character (e.g., 'a' -> 0, 'b' -> 1).
            charCounts[c - 'a']++;
        }

        // Define the required counts for each character in the word "balloon".
        // b: 1, a: 1, l: 2, o: 2, n: 1
        int countB = charCounts['b' - 'a']; // Count of 'b'
        int countA = charCounts['a' - 'a']; // Count of 'a'
        int countL = charCounts['l' - 'a']; // Count of 'l'
        int countO = charCounts['o' - 'a']; // Count of 'o'
        int countN = charCounts['n' - 'a']; // Count of 'n'

        // Calculate the maximum number of balloons that can be formed.
        // For 'b', 'a', and 'n', the number of balloons is directly limited by their counts.
        // For 'l' and 'o', since we need two of each per balloon, the number of balloons is limited by half of their counts (integer division).
        // The overall maximum number of balloons is the minimum of these individual limits.
        int maxBalloons = Math.min(countB, countA); // Limited by 'b' and 'a'
        maxBalloons = Math.min(maxBalloons, countN); // Limited by 'b', 'a', and 'n'
        maxBalloons = Math.min(maxBalloons, countL / 2); // Limited by 'b', 'a', 'n', and 'l' (need 2 'l's per balloon)
        maxBalloons = Math.min(maxBalloons, countO / 2); // Limited by all characters (need 2 'o's per balloon)

        // Return the calculated maximum number of balloons.
        return maxBalloons;
    }
}
