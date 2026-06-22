// Problem: Maximum Number of Balloons
// Link: https://leetcode.com/problems/maximum-number-of-balloons/
//
// Approach:
// To form the word "balloon", we need to count the occurrences of each character required for "balloon" (b, a, l, o, n) in the input text.
// We can use a hash map (or an object in JavaScript) to store the frequency of each character in the input text.
// The word "balloon" requires:
// - 1 'b'
// - 1 'a'
// - 2 'l's
// - 2 'o's
// - 1 'n'
//
// For each of these required characters, we find how many times they appear in the input text.
// For 'b', 'a', and 'n', the maximum number of "balloon"s we can form is limited by their total count in the text.
// For 'l' and 'o', since we need two of each for one "balloon", the maximum number of "balloon"s we can form is limited by half of their total count in the text.
// The overall maximum number of "balloon"s will be the minimum of these limits across all required characters.
//
// Time Complexity: O(N), where N is the length of the input string `text`.
// We iterate through the `text` once to count character frequencies.
// Then, we iterate through the required characters of "balloon" (a constant 5 characters) to find the minimum possible instances.
//
// Space Complexity: O(1), as we are only storing counts for a fixed set of characters ('b', 'a', 'l', 'o', 'n'). The size of the frequency map is constant (at most 26 for all lowercase English letters, but practically only 5 for this problem).
//
//
const maxNumberOfBalloons = (text) => {
    // Create a frequency map to store the count of each character in the input text.
    const charCount = {};
    for (const char of text) {
        charCount[char] = (charCount[char] || 0) + 1;
    }

    // Define the required counts for each character to form "balloon".
    const balloonChars = {
        'b': 1,
        'a': 1,
        'l': 2,
        'o': 2,
        'n': 1
    };

    // Initialize the minimum number of balloons to a very large number.
    let minBalloons = Infinity;

    // Iterate through the characters required for "balloon".
    for (const char in balloonChars) {
        const requiredCount = balloonChars[char];
        const availableCount = charCount[char] || 0; // If character is not in text, its count is 0.

        // Calculate how many "balloon" instances can be formed based on this character.
        // For 'l' and 'o', we need 2, so divide by 2.
        const possibleInstances = Math.floor(availableCount / requiredCount);

        // Update the minimum number of balloons if the current character limits us.
        minBalloons = Math.min(minBalloons, possibleInstances);
    }

    // If minBalloons is still Infinity, it means at least one required character was missing,
    // or the text was empty. In either case, we can form 0 balloons.
    // Otherwise, return the calculated minimum.
    return minBalloons === Infinity ? 0 : minBalloons;
};
```