/**
 * @summary Finds the maximum number of non-overlapping palindrome substrings of length at least k.
 * @link https://leetcode.com/problems/maximum-number-of-non-overlapping-palindrome-substrings/
 *
 * @approach
 * This problem can be solved using dynamic programming. Let dp[i] be the maximum number of non-overlapping palindrome substrings we can form using the prefix of the string s up to index i-1.
 *
 * To calculate dp[i], we have two choices:
 * 1. We don't include any substring ending at index i-1. In this case, dp[i] = dp[i-1].
 * 2. We include a palindrome substring ending at index i-1. If s[j...i-1] is a palindrome of length at least k, then we can potentially form dp[j] + 1 such substrings. We take the maximum over all possible valid j.
 *
 * The base case is dp[0] = 0.
 *
 * To efficiently check if a substring is a palindrome and to find all such substrings, we can precompute a 2D boolean array `isPalindrome[i][j]` where `isPalindrome[i][j]` is true if the substring s[i...j] is a palindrome. This can be done using DP:
 * - `isPalindrome[i][i]` is always true.
 * - `isPalindrome[i][i+1]` is true if `s[i] == s[i+1]`.
 * - `isPalindrome[i][j]` is true if `s[i] == s[j]` and `isPalindrome[i+1][j-1]` is true.
 *
 * The final answer will be dp[n], where n is the length of s.
 *
 * Time Complexity:
 * - Precomputing `isPalindrome`: O(n^2) where n is the length of s.
 * - Calculating DP table: O(n^2) because for each dp[i], we iterate up to i to find possible palindrome substrings.
 * - Total: O(n^2)
 *
 * Space Complexity:
 * - `isPalindrome` table: O(n^2)
 * - `dp` table: O(n)
 * - Total: O(n^2)
 */
function maxNonOverlapping(s, k) {
    const n = s.length;

    // isPalindrome[i][j] will be true if the substring s[i...j] is a palindrome.
    // Initialize with false.
    const isPalindrome = Array(n).fill(0).map(() => Array(n).fill(false));

    // All substrings of length 1 are palindromes.
    for (let i = 0; i < n; i++) {
        isPalindrome[i][i] = true;
    }

    // Check for substrings of length 2.
    for (let i = 0; i < n - 1; i++) {
        if (s[i] === s[i + 1]) {
            isPalindrome[i][i + 1] = true;
        }
    }

    // Check for substrings of length 3 or more.
    // Length goes from 3 to n.
    for (let len = 3; len <= n; len++) {
        // Start index of the substring.
        for (let i = 0; i <= n - len; i++) {
            // End index of the substring.
            const j = i + len - 1;
            // Check if the outer characters match and the inner substring is a palindrome.
            if (s[i] === s[j] && isPalindrome[i + 1][j - 1]) {
                isPalindrome[i][j] = true;
            }
        }
    }

    // dp[i] will store the maximum number of non-overlapping palindrome substrings
    // using the first i characters of the string s.
    // We use n+1 size to handle the base case dp[0] representing an empty prefix.
    const dp = Array(n + 1).fill(0);

    // Iterate through the string to fill the dp table.
    for (let i = 1; i <= n; i++) {
        // Option 1: Don't include any substring ending at index i-1.
        // The max count is the same as the count for the prefix ending at i-2.
        dp[i] = dp[i - 1];

        // Option 2: Try to find a palindrome substring ending at index i-1.
        // Iterate backward from i-1 to find potential start indices 'j'.
        // The substring is s[j...i-1]. Its length is i - j.
        for (let j = 0; j < i; j++) {
            // Check if the substring s[j...i-1] is a palindrome and its length is at least k.
            if (isPalindrome[j][i - 1] && (i - j) >= k) {
                // If it's a valid palindrome substring, we can potentially form dp[j] + 1 substrings.
                // dp[j] represents the max count using the prefix s[0...j-1].
                // We add 1 for the current palindrome substring s[j...i-1].
                // We take the maximum between the current dp[i] and this new possibility.
                dp[i] = Math.max(dp[i], (j > 0 ? dp[j] : 0) + 1);
            }
        }
    }

    // The final answer is the maximum count using the entire string s.
    return dp[n];
}
;
```