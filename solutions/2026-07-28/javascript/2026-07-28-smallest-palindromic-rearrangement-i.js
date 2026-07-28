// Problem: Smallest Palindromic Rearrangement I
// Link: https://leetcode.com/problems/smallest-palindromic-rearrangement-i/
//
// Approach:
// The problem asks for the lexicographically smallest palindromic permutation of a given palindromic string.
// Since the input string is guaranteed to be a palindrome, it means that for every character, its count must be even,
// except for at most one character which can have an odd count (this character will be at the center of the palindrome).
//
// To form the lexicographically smallest palindrome:
// 1. Count the frequency of each character in the input string.
// 2. Identify the character with an odd count (if any). This character will form the center of our palindrome.
// 3. For all characters with even counts, we will use half of their occurrences to build the first half of the palindrome
//    and the other half to build the second half.
// 4. To ensure the lexicographically smallest result, we construct the first half by appending characters in alphabetical order.
// 5. The second half will be the reverse of the first half.
// 6. The final palindrome is formed by concatenating the first half, the middle character (if any), and the second half.
//
// Example: s = "babab"
// Counts: 'a': 2, 'b': 3
// Odd count character: 'b' (center)
// First half characters: 'a' (1 occurrence), 'b' (1 occurrence)
// Sorted first half: "ab"
// Middle character: "b"
// Second half (reverse of first half): "ba"
// Result: "ab" + "b" + "ba" = "abbba"
//
// Example: s = "daccad"
// Counts: 'a': 2, 'c': 2, 'd': 2
// Odd count character: None
// First half characters: 'a' (1 occurrence), 'c' (1 occurrence), 'd' (1 occurrence)
// Sorted first half: "acd"
// Middle character: ""
// Second half (reverse of first half): "dca"
// Result: "acd" + "" + "dca" = "acddca"
//
// Time Complexity: O(N + K), where N is the length of the string s, and K is the number of possible characters (26 for lowercase English letters).
//   - Counting character frequencies: O(N)
//   - Constructing the first half: O(K) because we iterate through all possible characters.
//   - Reversing the first half and concatenation: O(N/2) which is O(N).
//   - Overall: O(N).
//
// Space Complexity: O(K), where K is the number of possible characters (26 for lowercase English letters).
//   - Storing character counts: O(K)
//   - Storing the first half string: O(N/2) which is O(N) in the worst case.
//   - Storing the reversed second half string: O(N/2) which is O(N) in the worst case.
//   - However, if we consider the output string as part of the space complexity, it's O(N).
//   - If we exclude the output string, the auxiliary space is dominated by the character counts, which is O(K).
//   - Let's consider auxiliary space for intermediate strings. The first half and second half can take up to N/2 space each.
//   - Therefore, O(N) space complexity if intermediate strings are counted. If only character counts are considered, then O(K).
//   - Given the constraints and typical LeetCode interpretation, O(N) for intermediate strings is usually considered.
var smallestPalindrome = function(s) {
    // Use an array of size 26 to store the frequency of each lowercase English letter.
    // Index 0 for 'a', 1 for 'b', ..., 25 for 'z'.
    const counts = new Array(26).fill(0);

    // Iterate through the input string to count character frequencies.
    for (let i = 0; i < s.length; i++) {
        const charCode = s.charCodeAt(i) - 'a'.charCodeAt(0);
        counts[charCode]++;
    }

    let firstHalf = ""; // String to build the first half of the palindrome.
    let middleChar = ""; // String to store the character at the center of the palindrome (if any).

    // Iterate through the counts array to construct the first half and identify the middle character.
    for (let i = 0; i < 26; i++) {
        const char = String.fromCharCode('a'.charCodeAt(0) + i);
        const count = counts[i];

        // If the count is odd, this character must be the middle character.
        // Since the input is guaranteed to be a palindrome, there will be at most one character with an odd count.
        if (count % 2 !== 0) {
            middleChar = char;
            // Decrement the count so that the remaining even part can be used for the halves.
            counts[i]--;
        }

        // Append half of the remaining (now even) count of the current character to the firstHalf.
        // We do this to ensure the first half is lexicographically smallest.
        const halfCount = counts[i] / 2;
        firstHalf += char.repeat(halfCount);
    }

    // The second half of the palindrome is the reverse of the first half.
    // We reverse the firstHalf string to get the secondHalf.
    const secondHalf = firstHalf.split("").reverse().join("");

    // Concatenate the first half, the middle character, and the second half to form the smallest palindrome.
    return firstHalf + middleChar + secondHalf;
};
