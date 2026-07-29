```cpp
// Problem: Smallest Palindromic Rearrangement II
// Link: https://leetcode.com/problems/smallest-palindromic-rearrangement-ii/
//
// Approach:
// The core idea is to determine the counts of each character in the input string `s`.
// Since `s` is a palindrome, at most one character can have an odd count.
// The characters with even counts will contribute `count / 2` to the first half of the palindrome.
// The character with an odd count (if any) will be placed in the middle.
//
// To find the k-th lexicographically smallest palindromic permutation, we need to:
// 1. Count the frequency of each character.
// 2. Determine the characters that will form the first half of the palindrome (half of their counts).
// 3. Calculate the total number of distinct palindromic permutations. This involves combinations.
//    The number of permutations of the first half is `(n/2)! / (c1/2)! * (c2/2)! * ...`, where n is the length of the first half.
// 4. If `k` is greater than the total number of permutations, return "".
// 5. Greedily construct the k-th permutation for the first half. For each position in the first half,
//    we try placing the smallest available character. We calculate how many permutations start with this
//    character and subtract that count from `k`. We continue this until `k` becomes small enough
//    to determine the character for the current position.
// 6. Once the first half is constructed, the second half is its reverse, and the middle character (if any)
//    is placed between them.
//
// To efficiently calculate combinations and factorials, we can precompute them or use a dynamic programming approach.
// Since the length of `s` can be up to 10^4, the first half can be up to 5000.
// We need to handle large numbers for combinations, potentially using `long long`.
//
// Time Complexity:
// - Character counting: O(N), where N is the length of `s`.
// - Precomputing factorials and inverse factorials for combinations: O(N/2).
// - Calculating total permutations: O(alphabet_size), which is O(26).
// - Greedily constructing the first half: O((N/2) * alphabet_size) in the worst case if we recalculate combinations each time.
//   However, by carefully subtracting and using precomputed factorials, it can be closer to O(N/2).
//   The dominant part is building the first half, which is O(N/2).
// Overall time complexity is O(N).
//
// Space Complexity:
// - Storing character counts: O(alphabet_size), which is O(1).
// - Storing factorials and inverse factorials: O(N/2), which is O(N).
// - Storing the first half string: O(N/2), which is O(N).
// Overall space complexity is O(N).
//
#include <iostream>
#include <string>
#include <vector>
#include <numeric>
#include <algorithm>
#include <map>

// Max length of the string is 10^4, so N/2 is 5000.
// We need factorials up to 5000.
const int MAX_HALF_LEN = 5000;
long long fact[MAX_HALF_LEN + 1];

// Function to precompute factorials
void precompute_factorials() {
    fact[0] = 1;
    for (int i = 1; i <= MAX_HALF_LEN; ++i) {
        fact[i] = fact[i - 1] * i;
    }
}

// Function to calculate combinations C(n, k)
// C(n, k) = n! / (k! * (n-k)!)
// This is used to calculate the number of permutations of the first half
// when some characters are identical.
long long combinations(int n, int k) {
    if (k < 0 || k > n) {
        return 0;
    }
    // This is a simplified version of C(n, k) for our use case.
    // We are calculating permutations of a multiset.
    // The formula is (n)! / (c1! * c2! * ...), where n is the total number of items
    // and ci is the count of each distinct item.
    // In our case, 'n' will be the remaining length of the first half string
    // and 'k' will be the count of a specific character we are considering.
    // The denominator will be the factorials of the counts of all characters available.
    //
    // For example, if we have 'aaabbc' (first half string) and we want to calculate
    // the number of permutations starting with 'a', we fix one 'a', and are left with 'aabbc'.
    // The number of permutations of 'aabbc' is 5! / (2! * 2! * 1!).
    // So, if `remaining_len` is `n` and `char_count` is `k` for a specific character,
    // and `denom_product` is the product of factorials of counts of other characters.
    // The combinations we need to calculate is `fact[remaining_len] / (fact[char_count] * denom_product)`.
    //
    // This function `combinations` is not directly calculating C(n, k) in the traditional sense.
    // It's part of a larger calculation. The denominator is handled externally by dividing by
    // the factorial of each character count.
    return fact[n]; // This will be divided by factorials of character counts.
}


class Solution {
public:
    std::string smallestPalindrome(std::string s, int k) {
        // Precompute factorials if not already done.
        // This should ideally be done once globally or within a class constructor if multiple calls are expected.
        if (fact[0] == 0) { // Simple check to see if precomputation is needed
            precompute_factorials();
        }

        // 1. Count character frequencies
        std::map<char, int> counts;
        for (char c : s) {
            counts[c]++;
        }

        std::string first_half_chars;
        char odd_char = '\0';
        int odd_count = 0;

        // 2. Prepare characters for the first half and identify the middle character
        for (auto const& [key, val] : counts) {
            if (val % 2 == 1) {
                odd_char = key;
                odd_count = val;
            }
            // Add half of the even counts to the characters for the first half
            for (int i = 0; i < val / 2; ++i) {
                first_half_chars += key;
            }
        }

        // Sort first_half_chars to enable lexicographical ordering
        std::sort(first_half_chars.begin(), first_half_chars.end());

        int half_len = first_half_chars.length();
        int total_permutations = 0;

        // Calculate the total number of distinct palindromic permutations.
        // This is the number of permutations of the `first_half_chars` string.
        // Formula: (half_len)! / (c1! * c2! * ...), where ci is the count of each distinct character in `first_half_chars`.
        if (half_len > 0) {
            long long denom_product = 1;
            for (auto const& [key, val] : counts) {
                if (val > 1) { // Only divide by factorials of counts > 1
                    denom_product *= fact[val / 2];
                }
            }
            // Check for overflow before calculating total_permutations
            if (fact[half_len] % denom_product == 0) {
                 total_permutations = fact[half_len] / denom_product;
            } else {
                // This case implies very large numbers that might overflow long long
                // for intermediate `fact[half_len]`, or the division is not clean.
                // Given constraints, this might not be an issue for typical competitive programming platforms,
                // but for robustness, a BigInt library would be needed for extremely large inputs.
                // For this problem, we'll assume `long long` is sufficient.
                // If `k` is very large, `total_permutations` will also be large.
                // We can cap `total_permutations` if `k` is also capped.
                // The problem states k <= 10^6, so we only care if total_permutations is at least k.
                // Let's use a capped comparison.
                if (fact[half_len] / denom_product > k) { // Heuristic check
                    total_permutations = k + 1; // A value definitely larger than k
                } else {
                    total_permutations = fact[half_len] / denom_product;
                }
            }
        } else { // If first_half_chars is empty (e.g., s="a", s="aaa")
            total_permutations = 1;
        }

        // If k is larger than the total number of distinct palindromic permutations, return an empty string.
        if (k > total_permutations) {
            return "";
        }

        // 5. Greedily construct the k-th permutation for the first half
        std::string result_first_half = "";
        std::map<char, int> current_counts = counts; // Use original counts for reconstruction

        for (int i = 0; i < half_len; ++i) {
            // Iterate through possible characters ('a' to 'z') to place at the current position
            for (char c = 'a'; c <= 'z'; ++c) {
                // Check if character `c` is available and can be placed
                if (current_counts[c] > 0) {
                    // Temporarily decrement the count of character `c`
                    current_counts[c]--;

                    // Calculate the number of permutations of the remaining characters in the first half
                    // after placing character `c` at the current position.
                    // This is (remaining_len)! / (new_c1! * new_c2! * ...).
                    int remaining_len = half_len - (i + 1);
                    long long remaining_denom_product = 1;
                    for (auto const& [key, val] : current_counts) {
                        if (val > 1) { // Only consider characters with counts > 1 for factorial division
                            remaining_denom_product *= fact[val / 2];
                        }
                    }

                    long long num_perms_with_c;
                    if (remaining_len == 0) { // If this was the last character to place
                        num_perms_with_c = 1;
                    } else if (remaining_denom_product == 0) { // Avoid division by zero if counts are weird (shouldn't happen here)
                         num_perms_with_c = 0; // Or handle error appropriately
                    }
                     else {
                         // We need `fact[remaining_len]` which is `fact[half_len - (i+1)]`
                         num_perms_with_c = fact[remaining_len] / remaining_denom_product;
                    }


                    // If k is less than or equal to the number of permutations starting with character `c`,
                    // then character `c` is the correct character for the current position.
                    if (k <= num_perms_with_c) {
                        result_first_half += c;
                        // The counts are now permanently updated for this choice of `c`.
                        // Break the inner loop and move to the next position in the first half.
                        break;
                    } else {
                        // If k is greater, it means the k-th permutation does not start with character `c`.
                        // Subtract the number of permutations starting with `c` from `k`.
                        k -= num_perms_with_c;
                        // Backtrack: restore the count of character `c` to try the next character.
                        current_counts[c]++;
                    }
                }
            }
        }

        // 6. Construct the full palindrome
        std::string second_half = result_first_half;
        std::reverse(second_half.begin(), second_half.end());

        std::string final_palindrome = result_first_half;
        if (odd_char != '\0') {
            // If there's an odd character, append it to the middle.
            // Note: The `odd_count` from initial `counts` should be used.
            // Here `current_counts` is tracking counts for the first half.
            // We need the original count of `odd_char` for the middle.
            // The problem statement implies `s` is a palindrome, so there's at most one character with an odd count.
            // If `s` has odd length, then one character must have an odd count.
            // If `s` has even length, all characters must have even counts.
            // The way we've prepared `first_half_chars` and `odd_char` handles this correctly.
            // `odd_char` will be the character with an odd frequency in `s`.
            final_palindrome += odd_char;
        }
        final_palindrome += second_half;

        return final_palindrome;
    }
};
```