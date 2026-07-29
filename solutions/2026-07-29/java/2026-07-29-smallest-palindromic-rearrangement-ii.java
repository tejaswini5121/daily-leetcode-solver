```java
// Finds the k-th lexicographically smallest palindromic permutation of a given palindromic string.
// Link: https://leetcode.com/problems/smallest-palindromic-rearrangement-ii/
//
// Approach:
// 1. Count the frequency of each character in the input string `s`.
// 2. For a string to be rearranged into a palindrome, at most one character can have an odd frequency.
//    Since the input `s` is guaranteed to be a palindrome, this condition is already met.
// 3. To form a palindromic rearrangement, we only need to arrange the first half of the palindrome.
//    The second half will be the reverse of the first half. If the string length is odd, the middle character
//    is fixed by the character with the odd count.
// 4. We count the characters that will form the first half. For each character with frequency `f`,
//    `f/2` instances will go into the first half.
// 5. The number of distinct palindromic permutations is equivalent to the number of distinct permutations
//    of the characters in the first half. This can be calculated using the multinomial coefficient formula:
//    N! / (n1! * n2! * ... * nk!), where N is the total number of characters in the first half, and
//    n_i is the count of the i-th distinct character in the first half.
// 6. We need to calculate the k-th lexicographically smallest permutation of the first half.
//    This is a standard algorithm:
//    a. For each position in the first half (from left to right), iterate through the available characters
//       in lexicographical order.
//    b. For each character, calculate how many permutations start with that character. This is done by
//       considering the remaining characters and their counts, and calculating the number of permutations
//       of those remaining characters.
//    c. If `k` is less than or equal to this count, then the current character is the one for the current
//       position. Append it to the result, decrement its count, and move to the next position.
//    d. If `k` is greater than this count, subtract this count from `k` and try the next character.
// 7. Pre-compute factorials and inverse factorials (or use `BigInteger` for combinations) to efficiently
//    calculate the number of permutations.
// 8. If the total number of distinct palindromic permutations is less than `k`, return an empty string.
//
// Time Complexity: O(L + A*L), where L is the length of `s` and A is the size of the alphabet (26).
//                  Counting frequencies takes O(L). Calculating total permutations can take O(A log(L!)).
//                  The k-th permutation generation takes O(A * L) in the worst case for each digit,
//                  but since we iterate through available characters and calculate combinations, it's more
//                  accurately O(A * L) overall because combination calculation with precomputed factorials is O(1).
//                  However, if we don't precompute or use BigInteger directly, it can be slower. With precomputation,
//                  it's closer to O(L) for frequency counting and O(A*L) for permutation construction.
//                  Since A is constant (26), the complexity is dominated by O(L).
// Space Complexity: O(A), where A is the size of the alphabet, for storing character counts and factorials.
class Solution {
    // Using BigInteger for combinations to handle large numbers.
    // Max length of s is 10^4, so length of first half is 5000. Factorials can be very large.

    // Precompute factorials up to 5000 (max length of first half).
    private static final int MAX_HALF_LEN = 5000;
    private BigInteger[] fact = new BigInteger[MAX_HALF_LEN + 1];

    // Initialize factorials.
    private void precomputeFactorials() {
        fact[0] = BigInteger.ONE;
        for (int i = 1; i <= MAX_HALF_LEN; i++) {
            fact[i] = fact[i - 1].multiply(BigInteger.valueOf(i));
        }
    }

    // Calculates combinations C(n, k) = n! / (k! * (n-k)!).
    private BigInteger combinations(int n, int k) {
        if (k < 0 || k > n) {
            return BigInteger.ZERO;
        }
        // C(n, k) = n! / (k! * (n-k)!)
        // n! is fact[n]
        // k! is fact[k]
        // (n-k)! is fact[n-k]
        return fact[n].divide(fact[k].multiply(fact[n - k]));
    }

    // Calculates the number of distinct permutations of a multiset.
    // Given character counts, total number of characters is n.
    // The formula is n! / (count1! * count2! * ...).
    private BigInteger countPermutations(int n, int[] counts) {
        BigInteger res = fact[n]; // Start with n!
        for (int count : counts) {
            if (count > 0) {
                res = res.divide(fact[count]); // Divide by count! for each character
            }
        }
        return res;
    }

    public String smallestBeautifulString(String s, int k) {
        // Precompute factorials needed for combination calculations.
        precomputeFactorials();

        // Character counts for the entire string.
        int[] totalCounts = new int[26];
        for (char c : s.toCharArray()) {
            totalCounts[c - 'a']++;
        }

        // Character counts for the first half of the palindrome.
        // If a character has count `f`, `f/2` instances go to the first half.
        int[] halfCounts = new int[26];
        int halfLen = 0;
        char oddChar = ' '; // Character with odd frequency, if any.

        for (int i = 0; i < 26; i++) {
            halfCounts[i] = totalCounts[i] / 2;
            halfLen += halfCounts[i]; // Total length of the first half.
            if (totalCounts[i] % 2 != 0) {
                oddChar = (char) ('a' + i);
            }
        }

        // If k is larger than the total number of distinct palindromic permutations, return empty string.
        // Total palindromic permutations = permutations of the first half.
        BigInteger totalPalindromicPermutations = countPermutations(halfLen, halfCounts);
        if (BigInteger.valueOf(k).compareTo(totalPalindromicPermutations) > 0) {
            return "";
        }

        // Build the k-th lexicographically smallest permutation of the first half.
        StringBuilder firstHalf = new StringBuilder();
        int remainingLen = halfLen; // Number of characters still needed for the first half.
        BigInteger kBig = BigInteger.valueOf(k); // Use BigInteger for k comparisons.

        // Iterate through each position of the first half.
        for (int i = 0; i < halfLen; i++) {
            // Try each character from 'a' to 'z' for the current position.
            for (int charCode = 0; charCode < 26; charCode++) {
                // If this character is available in the first half.
                if (halfCounts[charCode] > 0) {
                    // Tentatively place this character at the current position.
                    halfCounts[charCode]--; // Use one instance of this character.
                    remainingLen--; // One less character needed overall.

                    // Calculate the number of permutations possible with the remaining characters.
                    // This is the number of permutations of the remaining multiset.
                    BigInteger permutationsWithRemaining = countPermutations(remainingLen, halfCounts);

                    // If k is less than or equal to the number of permutations with the remaining characters,
                    // it means the k-th permutation starts with the current character.
                    if (kBig.compareTo(permutationsWithRemaining) <= 0) {
                        firstHalf.append((char) ('a' + charCode)); // Append the chosen character.
                        // k remains the same relative to this block of permutations.
                        break; // Move to the next position.
                    } else {
                        // If k is larger, it means the k-th permutation does not start with this character.
                        // Subtract the count of permutations starting with this character from k.
                        kBig = kBig.subtract(permutationsWithRemaining);
                        // Backtrack: restore the character count and remaining length.
                        halfCounts[charCode]++;
                        remainingLen++;
                    }
                }
            }
        }

        // Construct the full palindrome.
        StringBuilder result = new StringBuilder(firstHalf);
        if (oddChar != ' ') {
            result.append(oddChar); // Append the middle character if string length is odd.
        }
        // Append the reverse of the first half.
        result.append(new StringBuilder(firstHalf).reverse());

        return result.toString();
    }
}
```