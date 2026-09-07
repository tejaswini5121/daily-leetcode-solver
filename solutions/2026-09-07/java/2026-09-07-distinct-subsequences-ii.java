// Problem: Distinct Subsequences II
// Link: https://leetcode.com/problems/distinct-subsequences-ii/
// Approach: Dynamic Programming. We can use a DP array where dp[i] stores the number of distinct subsequences of the string s up to index i-1.
// When considering the character s[i-1], we can form new distinct subsequences by appending s[i-1] to all previously formed distinct subsequences.
// The total number of distinct subsequences ending at index i would be 2 * (number of distinct subsequences up to i-1) + 1 (for the character itself).
// However, we need to subtract duplicates. If a character has appeared before, say at index j, then appending the current character s[i-1] to subsequences ending before index j would create duplicates of subsequences ending at index j.
// To handle this, we can maintain an array (or map) to store the last seen index of each character. When we encounter a character, we add 2 * (total distinct subsequences so far) to the count, and then subtract the number of distinct subsequences ending just before the last occurrence of that character to avoid double counting.
// The base case is an empty string which has 0 distinct subsequences. For the first character, we have 1 subsequence.
// We use modulo arithmetic to handle large numbers.
// Time Complexity: O(N), where N is the length of the string s. We iterate through the string once.
// Space Complexity: O(1) because the size of the lastSeen array is constant (26 for lowercase English letters).
class Solution {
    public int distinctSubseqII(String s) {
        int MOD = 1_000_000_007;
        int n = s.length();
        
        // dp[i] will store the number of distinct subsequences considering the prefix of length i
        // For this problem, it's more efficient to use a single variable `totalDistinct`
        // and an array `lastCount` to keep track of distinct subsequences ending with each character.

        // `lastCount[c - 'a']` stores the number of distinct subsequences ending with character `c`.
        int[] lastCount = new int[26];
        
        // `totalDistinct` stores the total number of distinct subsequences formed so far.
        int totalDistinct = 0;

        // Iterate through each character of the string
        for (int i = 0; i < n; i++) {
            char currentChar = s.charAt(i);
            int charIndex = currentChar - 'a';

            // The number of new distinct subsequences formed by adding `currentChar`
            // is equal to the total number of distinct subsequences formed so far (`totalDistinct`) plus 1 (for `currentChar` itself).
            // We then subtract `lastCount[charIndex]` to remove duplicates.
            // `lastCount[charIndex]` represents the number of distinct subsequences that *already* ended with `currentChar`.
            // Appending `currentChar` to subsequences that ended before the *previous* occurrence of `currentChar` would create duplicates.
            // So, `newSubsequencesEndingWithCurrent` will be `totalDistinct` (new subsequences formed by appending to all existing ones)
            // + 1 (the character itself) - `lastCount[charIndex]` (duplicates).
            // However, the logic can be simplified:
            // The new total distinct subsequences after considering `currentChar` is:
            // `totalDistinct` (existing distinct subsequences) * 2 (each existing subsequence can either include `currentChar` or not)
            // + 1 (the `currentChar` itself)
            // - `lastCount[charIndex]` (subsequences that were already counted and ended with `currentChar`).

            int newSubsequencesEndingWithCurrent = (totalDistinct + 1) % MOD;
            
            // Update `totalDistinct`:
            // The new `totalDistinct` is the old `totalDistinct` plus the new subsequences formed by `currentChar`.
            // We must subtract the subsequences that were already counted and ended with `currentChar` (which is `lastCount[charIndex]`)
            // to avoid double counting.
            totalDistinct = (totalDistinct + newSubsequencesEndingWithCurrent - lastCount[charIndex] + MOD) % MOD;
            
            // Update `lastCount[charIndex]`:
            // The number of distinct subsequences ending with `currentChar` is now `newSubsequencesEndingWithCurrent`.
            lastCount[charIndex] = newSubsequencesEndingWithCurrent;
        }

        // The `totalDistinct` variable now holds the total number of distinct non-empty subsequences.
        return totalDistinct;
    }
}
