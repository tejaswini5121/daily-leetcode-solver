// Problem Summary: Find the k-th lexicographically smallest palindromic permutation of a given palindromic string.
// Link: https://leetcode.com/problems/smallest-palindromic-rearrangement-ii/
// Approach:
// 1. Count the frequency of each character in the input string `s`.
// 2. Since `s` is palindromic, at most one character can have an odd frequency. This character will be the middle character of any palindromic rearrangement.
// 3. Construct the first half of the palindromic string by taking half the count of each character. This first half will determine the lexicographical order.
// 4. Calculate the number of distinct palindromic permutations. This is equivalent to the number of distinct permutations of the first half string. The formula for permutations with repetitions is n! / (c1! * c2! * ...), where n is the length of the first half string and ci is the count of each character.
// 5. If `k` is greater than the total number of distinct palindromic permutations, return "".
// 6. To find the k-th permutation, we can use a technique similar to finding the k-th permutation of a regular string. We iterate through the available characters for the first half, calculate how many permutations start with that character, and subtract that count from `k` until `k` is small enough to pinpoint the character for the current position.
//    - For each position in the first half, iterate through sorted available characters.
//    - For each character, calculate the number of permutations of the remaining characters.
//    - If `k` is less than or equal to this count, the current character is the one for this position. Append it to the result, decrease its count, and move to the next position.
//    - Otherwise, subtract the count from `k` and try the next character.
// 7. Once the first half is constructed, the full palindrome is formed by concatenating the first half, the middle character (if any), and the reverse of the first half.
//
// Time Complexity: O(N + alphabet_size * N), where N is the length of s.
//   - Counting character frequencies: O(N)
//   - Calculating total permutations: O(N) due to factorial calculations with precomputed factorials/inverse factorials or O(alphabet_size * N) if calculating on the fly.
//   - Constructing the k-th permutation: For each of the N/2 positions, we iterate through up to `alphabet_size` characters. For each character, calculating permutations of remaining characters can take O(N) naively, or O(alphabet_size) if precomputed factorials are used. Thus, O(N/2 * alphabet_size * alphabet_size) or O(N/2 * alphabet_size). With precomputation, it's closer to O(N * alphabet_size).
//   - String concatenation and reversal: O(N)
//   - Precomputing factorials and inverse factorials: O(N)
// Space Complexity: O(N) for storing character counts, precomputed factorials, and the resulting string.
const smallestPalindromicRearrangementII = (s, k) => {
    // Helper function to calculate combinations (n choose k)
    const combinations = (n, k) => {
        if (k < 0 || k > n) {
            return 0;
        }
        if (k === 0 || k === n) {
            return 1;
        }
        if (k > n / 2) {
            k = n - k;
        }
        let res = 1;
        for (let i = 1; i <= k; ++i) {
            res = res * (n - i + 1) / i;
        }
        return res;
    };

    // Helper function to calculate permutations with repetitions
    // n! / (c1! * c2! * ...)
    // This function calculates the number of permutations for the remaining characters
    const countPermutations = (counts) => {
        let n = 0;
        let denominator = 1;
        for (const char in counts) {
            n += counts[char];
            denominator *= factorial[counts[char]];
        }
        return factorial[n] / denominator;
    };

    const MAX_LEN = 10004; // Maximum possible length of s + a small buffer
    const factorial = new Array(MAX_LEN);
    const invFactorial = new Array(MAX_LEN);
    const MOD = 10**9 + 7; // Not strictly needed for this problem as results can be large, but good practice if intermediate calculations might overflow if we were asked for modulo.

    // Precompute factorials
    factorial[0] = 1;
    invFactorial[0] = 1;
    for (let i = 1; i < MAX_LEN; ++i) {
        factorial[i] = (factorial[i - 1] * i);
        // invFactorial[i] = power(factorial[i], MOD - 2); // For modular inverse if MOD was used
    }

    // Count character frequencies
    const charCounts = {};
    for (const char of s) {
        charCounts[char] = (charCounts[char] || 0) + 1;
    }

    let middleChar = '';
    const halfCounts = {};
    let halfLength = 0;

    // Construct counts for the first half and find the middle character
    const sortedChars = Object.keys(charCounts).sort();
    for (const char of sortedChars) {
        if (charCounts[char] % 2 === 1) {
            middleChar = char;
        }
        halfCounts[char] = Math.floor(charCounts[char] / 2);
        halfLength += halfCounts[char];
    }

    // Calculate total distinct palindromic permutations
    // This is the number of permutations of the first half string
    const totalPermutations = countPermutations(halfCounts);

    // If k is greater than the total number of permutations, return empty string
    if (k > totalPermutations) {
        return "";
    }

    let resultHalf = "";
    let currentK = k; // Use currentK to modify k as we build the permutation

    // Build the k-th lexicographically smallest permutation of the first half
    for (let i = 0; i < halfLength; ++i) {
        // Iterate through available characters in sorted order
        for (const char of sortedChars) {
            if (halfCounts[char] > 0) {
                // Temporarily decrement count to calculate permutations of remaining characters
                halfCounts[char]--;

                // Calculate the number of permutations that can be formed with the remaining characters
                const numPermsWithRemaining = countPermutations(halfCounts);

                // If currentK is within the range of permutations starting with this character
                if (currentK <= numPermsWithRemaining) {
                    resultHalf += char;
                    // The character is chosen, break the inner loop and move to the next position
                    break;
                } else {
                    // currentK is larger, so we skip all permutations starting with this character
                    // Subtract the count of permutations we just skipped
                    currentK -= numPermsWithRemaining;
                    // Restore the count since this character was not chosen
                    halfCounts[char]++;
                }
            }
        }
    }

    // Construct the full palindrome
    // The first half is `resultHalf`
    // The middle character is `middleChar`
    // The second half is the reverse of `resultHalf`
    const result = resultHalf + middleChar + resultHalf.split('').reverse().join('');

    return result;
};
