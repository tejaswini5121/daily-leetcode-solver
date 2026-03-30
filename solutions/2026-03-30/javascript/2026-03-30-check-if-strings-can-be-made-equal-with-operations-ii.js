// Problem: Check if Strings Can be Made Equal With Operations II
// Link: https://leetcode.com/problems/check-if-strings-can-be-made-equal-with-operations-ii/
//
// Approach:
// The key insight here is understanding what the allowed operation does.
// Swapping characters at indices `i` and `j` where `j - i` is even means we are swapping
// characters at indices with the same parity (both even or both odd).
// This implies that characters at even indices can only be swapped among themselves,
// and characters at odd indices can only be swapped among themselves.
// Therefore, to make two strings equal using this operation, two conditions must be met:
// 1. The multiset of characters at even indices in `s1` must be the same as the multiset
//    of characters at even indices in `s2`.
// 2. The multiset of characters at odd indices in `s1` must be the same as the multiset
//    of characters at odd indices in `s2`.
//
// We can check these conditions by:
// - Creating two frequency maps (or arrays of size 26) for `s1`: one for even indices
//   and one for odd indices.
// - Creating two frequency maps (or arrays of size 26) for `s2`: one for even indices
//   and one for odd indices.
// - Comparing the corresponding frequency maps. If both pairs of maps are identical,
//   the strings can be made equal.
//
// Time Complexity: O(N), where N is the length of the strings. We iterate through both strings
// once to build the frequency maps. Comparing the maps takes O(1) time since the alphabet
// size is constant (26).
// Space Complexity: O(1), as we use two frequency arrays of fixed size 26 for each string,
// which is constant regardless of the input string length.
//

/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkStrings = function(s1, s2) {
    const n = s1.length;

    // Frequency arrays for even and odd indexed characters in s1
    // `evenFreq1[char_code]` stores the count of character `char_code` at even indices in s1
    // `oddFreq1[char_code]` stores the count of character `char_code` at odd indices in s1
    const evenFreq1 = new Array(26).fill(0);
    const oddFreq1 = new Array(26).fill(0);

    // Frequency arrays for even and odd indexed characters in s2
    const evenFreq2 = new Array(26).fill(0);
    const oddFreq2 = new Array(26).fill(0);

    // Populate frequency arrays for s1
    for (let i = 0; i < n; i++) {
        const charCode = s1.charCodeAt(i) - 'a'.charCodeAt(0);
        if (i % 2 === 0) {
            // Even index
            evenFreq1[charCode]++;
        } else {
            // Odd index
            oddFreq1[charCode]++;
        }
    }

    // Populate frequency arrays for s2
    for (let i = 0; i < n; i++) {
        const charCode = s2.charCodeAt(i) - 'a'.charCodeAt(0);
        if (i % 2 === 0) {
            // Even index
            evenFreq2[charCode]++;
        } else {
            // Odd index
            oddFreq2[charCode]++;
        }
    }

    // Compare the frequency arrays
    // Check if characters at even indices can be made equal
    for (let i = 0; i < 26; i++) {
        if (evenFreq1[i] !== evenFreq2[i]) {
            return false; // Mismatch in character counts at even indices
        }
    }

    // Check if characters at odd indices can be made equal
    for (let i = 0; i < 26; i++) {
        if (oddFreq1[i] !== oddFreq2[i]) {
            return false; // Mismatch in character counts at odd indices
        }
    }

    // If all checks pass, the strings can be made equal
    return true;
};
