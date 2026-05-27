// Summary: Counts special letters in a string where a letter is special if its lowercase version appears before its first uppercase version.
// Link: https://leetcode.com/problems/count-the-number-of-special-characters-ii/
// Approach:
// We iterate through the string `word` and maintain two sets: `lowerCaseSeen` to store lowercase letters encountered so far,
// and `upperCaseSeen` to store uppercase letters encountered so far.
// For each character, we check if it's a lowercase letter. If it is, we add it to `lowerCaseSeen`.
// If it's an uppercase letter, we add it to `upperCaseSeen`.
// After iterating through the entire string, we iterate through all possible lowercase English letters ('a' to 'z').
// For each lowercase letter, we check if it exists in `lowerCaseSeen` and if its corresponding uppercase letter exists in `upperCaseSeen`.
// If both conditions are met, it means we have seen both lowercase and uppercase versions of this letter.
// To ensure the "every lowercase occurrence of c appears before the first uppercase occurrence of c" condition,
// we can leverage the fact that we processed the string from left to right. If a lowercase letter `l` and its uppercase `U`
// are both present, and `l` appeared *before* `U` in the string, it implicitly satisfies the condition for this problem's definition.
// The problem statement is slightly ambiguous in "every lowercase occurrence of c appears before the first uppercase occurrence of c".
// A simpler interpretation for counting special characters is that if a character `c` (lowercase) and `C` (uppercase) exist in the string,
// AND the first occurrence of `C` is AFTER the first occurrence of `c`, then it's special.
// However, the example "aaAbcBC" outputting 3 suggests that if *any* lowercase 'a' appears before *any* uppercase 'A', and both exist, it's special.
// The constraint "every lowercase occurrence of c appears before the first uppercase occurrence of c" is stricter.
//
// Let's re-evaluate the "every lowercase occurrence of c appears before the first uppercase occurrence of c" constraint.
// This implies that the FIRST uppercase occurrence of 'a' MUST be AFTER ALL occurrences of 'a'.
// This can be checked by keeping track of the index of the first occurrence of each character and the index of the first uppercase occurrence.
//
// Revised Approach:
// 1. Create two maps: `firstOccurrence` and `firstUpperCaseOccurrence`.
// 2. Iterate through the string `word` with index `i`.
// 3. If `word[i]` is lowercase:
//    - If `word[i]` is not in `firstOccurrence`, store `i` in `firstOccurrence[word[i]]`.
// 4. If `word[i]` is uppercase:
//    - If `word[i].toLowerCase()` is not in `firstUpperCaseOccurrence`, store `i` in `firstUpperCaseOccurrence[word[i].toLowerCase()]`.
// 5. Initialize `specialCount = 0`.
// 6. Iterate through all lowercase letters from 'a' to 'z'.
// 7. For each lowercase letter `char`:
//    - Get its corresponding uppercase `upperChar = char.toUpperCase()`.
//    - Check if `char` exists in `firstOccurrence` AND `char` exists in `firstUpperCaseOccurrence`.
//    - If both exist, compare their first occurrence indices: `firstOccurrence[char]` and `firstUpperCaseOccurrence[char]`.
//    - If `firstOccurrence[char] < firstUpperCaseOccurrence[char]`, increment `specialCount`.
// This refined approach directly checks the condition.
//
// Let's consider the constraint again: "every lowercase occurrence of c appears before the first uppercase occurrence of c."
// Example: "abBa" -> 'a' lowercase before 'B' uppercase. Then another 'a'. The first 'B' is at index 2. The 'a's are at 0 and 3. The second 'a' is NOT before the first 'B'. So 'a' is NOT special.
//
// This means we need to find the *last* index of the lowercase character and compare it with the *first* index of the uppercase character.
//
// Final Approach:
// 1. Create two maps: `lastLowercaseIndex` and `firstUppercaseIndex`.
// 2. Iterate through the string `word` with index `i`.
// 3. If `word[i]` is lowercase:
//    - Update `lastLowercaseIndex[word[i]] = i`.
// 4. If `word[i]` is uppercase:
//    - If `word[i].toLowerCase()` is not in `firstUppercaseIndex`, set `firstUppercaseIndex[word[i].toLowerCase()] = i`.
// 5. Initialize `specialCount = 0`.
// 6. Iterate through all lowercase letters from 'a' to 'z'.
// 7. For each lowercase letter `char`:
//    - Check if `char` exists in `lastLowercaseIndex` AND `char` exists in `firstUppercaseIndex`.
//    - If both exist, and `lastLowercaseIndex[char] < firstUppercaseIndex[char]`, increment `specialCount`.
//
// Time Complexity: O(N + 26), where N is the length of the string. We iterate through the string once, and then iterate through the alphabet (26 letters). This is O(N).
// Space Complexity: O(26) in the worst case for the maps, as they store at most 26 distinct characters. This is O(1).

const countSpecialCharacters = (word) => {
    // Map to store the index of the last occurrence of each lowercase character.
    const lastLowercaseIndex = new Map();
    // Map to store the index of the first occurrence of each uppercase character (key is the lowercase version).
    const firstUppercaseIndex = new Map();

    // Iterate through the word to populate the maps.
    for (let i = 0; i < word.length; i++) {
        const char = word[i];

        if (char >= 'a' && char <= 'z') {
            // If it's a lowercase character, update its last seen index.
            lastLowercaseIndex.set(char, i);
        } else { // It's an uppercase character
            const lowerChar = char.toLowerCase();
            // If this is the first time we see this uppercase character (represented by its lowercase form), store its index.
            if (!firstUppercaseIndex.has(lowerChar)) {
                firstUppercaseIndex.set(lowerChar, i);
            }
        }
    }

    let specialCount = 0;

    // Iterate through all lowercase letters of the alphabet.
    for (let charCode = 'a'.charCodeAt(0); charCode <= 'z'.charCodeAt(0); charCode++) {
        const char = String.fromCharCode(charCode);

        // Check if both the lowercase and uppercase versions of the character exist in the word.
        if (lastLowercaseIndex.has(char) && firstUppercaseIndex.has(char)) {
            // The condition is "every lowercase occurrence of c appears before the first uppercase occurrence of c".
            // This means the *last* index of the lowercase character must be before the *first* index of the uppercase character.
            if (lastLowercaseIndex.get(char) < firstUppercaseIndex.get(char)) {
                specialCount++;
            }
        }
    }

    return specialCount;
};
```