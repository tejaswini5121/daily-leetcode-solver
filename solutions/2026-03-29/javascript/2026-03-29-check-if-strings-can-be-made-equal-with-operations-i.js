// Brief problem summary: Determine if two strings of length 4 can be made equal by swapping characters at indices i and i+2.
// Link: https://leetcode.com/problems/check-if-strings-can-be-made-equal-with-operations-i/
// Approach explanation:
// The key observation is that the allowed operation swaps characters at indices i and i+2.
// This means that characters at even indices can only be swapped with other even indexed characters, and
// characters at odd indices can only be swapped with other odd indexed characters.
// Specifically, for a string of length 4:
// - index 0 can swap with index 2.
// - index 1 can swap with index 3.
// This implies that the set of characters at even positions (0 and 2) in s1 must be the same as the set of characters at even positions in s2.
// Similarly, the set of characters at odd positions (1 and 3) in s1 must be the same as the set of characters at odd positions in s2.
// We can achieve this check by:
// 1. Extracting the characters at even indices from s1 and s2.
// 2. Extracting the characters at odd indices from s1 and s2.
// 3. Sorting these extracted character sets for both even and odd positions.
// 4. Comparing the sorted even character sets and the sorted odd character sets. If both pairs match, the strings can be made equal.
// Time complexity analysis: O(1) because the string length is fixed at 4. Sorting and comparison operations take constant time for a fixed length.
// Space complexity analysis: O(1) because we are using a fixed amount of extra space to store the character sets (which will always have at most 2 elements each).

/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var canBeEqual = function(s1, s2) {
    // Helper function to get sorted characters at specific indices
    const getSortedChars = (str, indices) => {
        let chars = [];
        // Iterate through the specified indices
        for (const index of indices) {
            // Add the character at the current index to the list
            chars.push(str[index]);
        }
        // Sort the characters alphabetically
        chars.sort();
        // Join the sorted characters back into a string
        return chars.join('');
    };

    // Extract and sort characters at even indices (0 and 2) from s1
    const s1EvenChars = getSortedChars(s1, [0, 2]);
    // Extract and sort characters at even indices (0 and 2) from s2
    const s2EvenChars = getSortedChars(s2, [0, 2]);

    // Extract and sort characters at odd indices (1 and 3) from s1
    const s1OddChars = getSortedChars(s1, [1, 3]);
    // Extract and sort characters at odd indices (1 and 3) from s2
    const s2OddChars = getSortedChars(s2, [1, 3]);

    // Check if the sorted even character sets are equal AND
    // if the sorted odd character sets are equal.
    // If both conditions are true, the strings can be made equal.
    return s1EvenChars === s2EvenChars && s1OddChars === s2OddChars;
};
