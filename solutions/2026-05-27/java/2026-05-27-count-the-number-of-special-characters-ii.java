```java
// Problem: Count the Number of Special Characters II
// Link: https://leetcode.com/problems/count-the-number-of-special-characters-ii/
// Approach:
// We need to identify "special" characters, which are those that appear in both
// lowercase and uppercase forms, with ALL lowercase occurrences preceding the
// FIRST uppercase occurrence.
//
// To efficiently check these conditions, we can use two arrays (or hash maps)
// to store the first occurrence of each lowercase letter and the first
// occurrence of each uppercase letter.
//
// We iterate through the string once to populate these occurrence arrays.
// For each character:
// - If it's lowercase, record its first index if not already seen.
// - If it's uppercase, record its first index if not already seen.
//
// After populating, we iterate through all possible lowercase letters ('a' to 'z').
// For each letter:
// - Check if both its lowercase and uppercase versions have appeared in the string.
//   This means their recorded first occurrence indices are not their initial default
//   (e.g., -1 or infinity).
// - If both have appeared, compare their first occurrence indices.
//   If the first lowercase occurrence index is LESS THAN the first uppercase
//   occurrence index, then this character is "special".
// - We increment a counter for each special character found.
//
// Time Complexity: O(N), where N is the length of the input string 'word'.
//   We iterate through the string once to record first occurrences.
//   Then, we iterate 26 times (for each letter of the alphabet) to check
//   the special character condition. This is constant time relative to N.
// Space Complexity: O(1).
//   We use two arrays of size 26 (for lowercase and uppercase letters) to store
//   first occurrence indices. This space is constant and does not depend on
//   the input string length.
class Solution {
    public int numberOfSpecialChars(String word) {
        // Array to store the first occurrence index of each lowercase letter.
        // Initialize with -1 to indicate not seen.
        int[] firstLower = new int[26];
        // Array to store the first occurrence index of each uppercase letter.
        // Initialize with a value larger than any possible index (word.length())
        // to indicate not seen, and to ensure lowercase index < uppercase index
        // if uppercase is not seen.
        int[] firstUpper = new int[26];

        // Initialize firstLower with -1
        for (int i = 0; i < 26; i++) {
            firstLower[i] = -1;
        }
        // Initialize firstUpper with word.length()
        for (int i = 0; i < 26; i++) {
            firstUpper[i] = word.length();
        }

        // Iterate through the string to record the first occurrence of each letter.
        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            if (Character.isLowerCase(c)) {
                int index = c - 'a';
                // If this is the first time we see this lowercase letter, record its index.
                if (firstLower[index] == -1) {
                    firstLower[index] = i;
                }
            } else { // It's an uppercase letter
                int index = c - 'A';
                // If this is the first time we see this uppercase letter, record its index.
                // We want the MINIMUM index for uppercase.
                firstUpper[index] = Math.min(firstUpper[index], i);
            }
        }

        int specialCount = 0;
        // Iterate through all possible letters from 'a' to 'z'.
        for (int i = 0; i < 26; i++) {
            // Check if both the lowercase and uppercase versions of the letter exist in the word.
            // firstLower[i] != -1 means the lowercase version was found.
            // firstUpper[i] != word.length() means the uppercase version was found.
            if (firstLower[i] != -1 && firstUpper[i] != word.length()) {
                // Check the special character condition:
                // The first occurrence of the lowercase letter must be before
                // the first occurrence of the uppercase letter.
                if (firstLower[i] < firstUpper[i]) {
                    specialCount++;
                }
            }
        }

        return specialCount;
    }
}
```