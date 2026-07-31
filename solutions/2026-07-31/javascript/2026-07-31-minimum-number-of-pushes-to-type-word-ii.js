/**
 * @param {string} word
 * @return {number}
 */
// Problem Summary: Minimize key presses to type a word by remapping letters to phone keys.
// Link: https://leetcode.com/problems/minimum-number-of-pushes-to-type-word-ii/
//
// Approach:
// The core idea is that to minimize the total number of pushes, we should assign the most frequent characters
// to keys that require fewer pushes (i.e., keys that are pushed once). Then, the next most frequent characters
// should be assigned to keys that require two pushes, and so on.
//
// 1. Count Character Frequencies: First, we need to know how many times each lowercase letter appears in the input `word`.
//    A hash map (or an array of size 26) can be used for this.
//
// 2. Sort Frequencies: We only care about the frequencies of characters that are actually present in the word.
//    We can extract these frequencies and sort them in descending order.
//
// 3. Assign to Keys Greedily:
//    - The keys 2-9 can be used to map letters. There are 8 such keys.
//    - We can assign 1 character to each of the first 8 keys (requiring 1 push each).
//    - Then, we can assign 1 character to each of the first 8 keys again (requiring 2 pushes each).
//    - This pattern continues: 1-8 characters get 1 push, the next 1-8 characters get 2 pushes, the next 1-8 get 3 pushes, etc.
//    - We can iterate through the sorted frequencies and assign them to "slots" corresponding to the number of pushes.
//    - We keep track of which "push level" (1, 2, 3, ...) we are currently on and how many characters have been assigned to that level.
//    - For example, the first 8 most frequent characters will be assigned to a key requiring 1 push.
//    - The next 8 most frequent characters will be assigned to a key requiring 2 pushes.
//    - And so on.
//
// 4. Calculate Total Pushes: For each character, its contribution to the total pushes is its frequency multiplied by the number of pushes required for its assigned key. Sum these up.
//
// Example Walkthrough (word = "aabbccddeeffgghhiiiiii"):
// - Frequencies: a:2, b:2, c:2, d:2, e:2, f:2, g:2, h:2, i:6
// - Sorted Frequencies (descending): 6 (for 'i'), 2 (for 'a' through 'h')
// - There are 8 characters with frequency 2, and 1 character with frequency 6.
// - Total distinct characters with frequency > 0: 9
//
// - Assigning:
//   - The most frequent character is 'i' (6 times).
//   - The next 8 characters ('a' through 'h') each appear 2 times.
//
//   - We have 8 "slots" for 1 push (keys 2-9).
//   - We have 8 "slots" for 2 pushes.
//   - And so on.
//
//   - Greedily assign the highest frequencies to the lowest push counts:
//     - Character 'i' (frequency 6): Needs to be assigned. The first 8 slots are for 1 push. Let's assign 'i' to one of these. Pushes = 6 * 1.
//     - Characters 'a' through 'h' (frequency 2 each): There are 8 such characters.
//       - If we assign 'i' to the first available 1-push slot, then we have 7 more 1-push slots.
//       - We have 8 characters with frequency 2.
//       - Let's say we assign the first 8 characters to the 1-push slots.
//       - But wait, we only have 8 keys (2-9).
//
//   - Let's rephrase the assignment strategy:
//     - The keys can be thought of as having "levels" of availability.
//     - Level 1: The first 8 characters encountered get assigned to keys that require 1 push.
//     - Level 2: The next 8 characters encountered get assigned to keys that require 2 pushes.
//     - Level 3: The next 8 characters encountered get assigned to keys that require 3 pushes.
//     - And so on.
//
//   - So, take the frequencies and sort them descending:
//     - 6 (for 'i')
//     - 2 (for 'a')
//     - 2 (for 'b')
//     - 2 (for 'c')
//     - 2 (for 'd')
//     - 2 (for 'e')
//     - 2 (for 'f')
//     - 2 (for 'g')
//     - 2 (for 'h')
//
//   - Number of available "slots" at push level 1: 8
//   - Number of available "slots" at push level 2: 8
//   - Number of available "slots" at push level 3: 8
//   - ...
//
//   - Iterate through the sorted frequencies:
//     - Frequency 6 (for 'i'): This is the 1st character we process. It goes into the 1st available slot, which is at push level 1. Cost: 6 * 1 = 6.
//       - We have used 1 slot at push level 1. Remaining slots at level 1: 7.
//     - Frequency 2 (for 'a'): This is the 2nd character. It goes into the 2nd available slot, which is at push level 1. Cost: 2 * 1 = 2.
//       - We have used 2 slots at push level 1. Remaining slots at level 1: 6.
//     - Frequency 2 (for 'b'): 3rd character. Push level 1. Cost: 2 * 1 = 2. Slots used: 3. Remaining: 5.
//     - ...
//     - Frequency 2 (for 'g'): 8th character. Push level 1. Cost: 2 * 1 = 2. Slots used: 8. Remaining: 0.
//       - At this point, all 8 keys are being used for the first time (1 push).
//     - Frequency 2 (for 'h'): 9th character. We have no more 1-push slots. This character goes into the first available 2-push slot. Cost: 2 * 2 = 4.
//       - We have used 1 slot at push level 2. Remaining slots at level 2: 7.
//
//   - Total cost calculation:
//     - 'i' (freq 6): 1st char processed, 1 push -> 6 * 1 = 6
//     - 'a' (freq 2): 2nd char processed, 1 push -> 2 * 1 = 2
//     - 'b' (freq 2): 3rd char processed, 1 push -> 2 * 1 = 2
//     - 'c' (freq 2): 4th char processed, 1 push -> 2 * 1 = 2
//     - 'd' (freq 2): 5th char processed, 1 push -> 2 * 1 = 2
//     - 'e' (freq 2): 6th char processed, 1 push -> 2 * 1 = 2
//     - 'f' (freq 2): 7th char processed, 1 push -> 2 * 1 = 2
//     - 'g' (freq 2): 8th char processed, 1 push -> 2 * 1 = 2
//     - 'h' (freq 2): 9th char processed, now we move to 2-pushes. 2 * 2 = 4
//
//   - Total = 6 + 2*7 + 4 = 6 + 14 + 4 = 24. This matches the example.
//
//   - The logic for calculating pushes:
//     - `pushLevel = 1`
//     - `charsAtCurrentLevel = 0`
//     - Iterate through sorted frequencies `freq`:
//       - `totalPushes += freq * pushLevel`
//       - `charsAtCurrentLevel++`
//       - If `charsAtCurrentLevel == 8`:
//         - `pushLevel++`
//         - `charsAtCurrentLevel = 0`
//
// Time Complexity Analysis:
// - Counting character frequencies: O(N), where N is the length of the word.
// - Extracting non-zero frequencies: O(26) which is O(1).
// - Sorting frequencies: If M is the number of unique characters (at most 26), sorting takes O(M log M) which is O(1).
// - Iterating through sorted frequencies to calculate total pushes: O(M) which is O(1).
// - Overall: O(N) because of the initial frequency counting.
//
// Space Complexity Analysis:
// - Storing character frequencies: O(26) which is O(1).
// - Storing sorted frequencies: O(26) which is O(1).
// - Overall: O(1) because the space usage is constant with respect to the input string length (limited by alphabet size).
//
const minimumPushes = (word) => {
    // Step 1: Count character frequencies.
    // Use a map to store counts of each character.
    const freqMap = new Map();
    for (const char of word) {
        freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }

    // Step 2: Get frequencies and sort them in descending order.
    // We only care about the frequencies of characters that exist in the word.
    const frequencies = Array.from(freqMap.values());
    // Sort in descending order so most frequent characters are processed first.
    frequencies.sort((a, b) => b - a);

    // Step 3 & 4: Assign characters to keys greedily and calculate total pushes.
    let totalPushes = 0;
    let pushLevel = 1; // Starts with keys that require 1 push.
    let charsAssignedAtCurrentLevel = 0; // Counts how many unique chars have been assigned to keys for the current pushLevel.

    // There are 8 keys (2-9) that can be mapped.
    // We can assign up to 8 characters to keys requiring 1 push.
    // Then up to 8 characters to keys requiring 2 pushes, and so on.
    const keysPerLevel = 8;

    // Iterate through the sorted frequencies.
    for (const freq of frequencies) {
        // Add the cost for the current character: frequency * pushLevel.
        totalPushes += freq * pushLevel;

        // Increment the count of characters assigned at the current push level.
        charsAssignedAtCurrentLevel++;

        // If we have assigned 8 characters at the current push level,
        // it means we have used all available keys for this push level.
        // We need to move to the next push level.
        if (charsAssignedAtCurrentLevel === keysPerLevel) {
            pushLevel++; // Move to the next push level (e.g., from 1 to 2, from 2 to 3).
            charsAssignedAtCurrentLevel = 0; // Reset the counter for the new push level.
        }
    }

    // Return the calculated minimum total pushes.
    return totalPushes;
};
```