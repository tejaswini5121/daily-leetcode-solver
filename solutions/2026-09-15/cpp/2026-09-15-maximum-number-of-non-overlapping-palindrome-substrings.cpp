// Problem Summary: Find the maximum number of non-overlapping palindrome substrings in a given string `s`, where each substring must have a length of at least `k`.
// Problem Link: https://leetcode.com/problems/maximum-number-of-non-overlapping-palindrome-substrings/
// Approach Explanation:
// This problem can be solved using dynamic programming combined with a pre-computation of all palindrome substrings.
// First, we create a 2D boolean array `isPalindrome[n][n]` where `isPalindrome[i][j]` is true if `s[i...j]` is a palindrome. This can be filled using DP: `isPalindrome[i][i]` is true, `isPalindrome[i][i+1]` is true if `s[i] == s[i+1]`, and `isPalindrome[i][j]` is true if `s[i] == s[j]` and `isPalindrome[i+1][j-1]` is true. This takes O(n^2) time.
//
// After pre-computing all palindromes, we use another DP array `dp[n+1]`. `dp[i]` will store the maximum number of non-overlapping palindrome substrings considering the prefix `s[0...i-1]`.
// Initialize `dp[0] = 0`.
// For `i` from 1 to `n`:
//   `dp[i] = dp[i-1]` (option to not include any substring ending at `i-1`).
//   Then, iterate `j` from `0` to `i-1` (representing potential start index of a substring `s[j...i-1]`):
//     If `isPalindrome[j][i-1]` is true and `(i-1) - j + 1 >= k` (length condition):
//       `dp[i] = max(dp[i], 1 + dp[j])`. Here, `1 + dp[j]` means we found one more palindrome `s[j...i-1]` and `dp[j]` gives the max count for `s[0...j-1]`.
// The final answer will be `dp[n]`.
//
// This DP approach is correct but can be optimized. The `dp` transition `dp[i] = max(dp[i-1], 1 + dp[j])` where `j < i` is essentially looking for the maximum `dp[j]` for all valid `j`.
// A greedy approach often works for "maximum non-overlapping intervals" type problems.
//
// Optimized Greedy Approach:
// Iterate through the string from left to right. Maintain a `dp` array where `dp[i]` stores the maximum number of non-overlapping palindrome substrings considering the prefix `s[0...i]`.
// `dp[i] = dp[i-1]` initially (if we don't extend or find a new palindrome ending at `i`).
//
// For each `i` from `0` to `n-1`:
//   `dp[i]` is based on `dp[i-1]` (or 0 if `i=0`).
//   Now, consider all possible palindrome substrings `s[j...i]` that end at `i`.
//   We need to check two types of palindromes:
//   1. Odd length palindromes centered at `i`.
//   2. Even length palindromes centered between `i-1` and `i`.
//
// To optimize, we can use a slightly different greedy approach:
// Iterate through the string `s` from `i = 0` to `n-1`. This `i` will be the potential *start* of a new palindrome.
// For each `i`, we will try to find the *shortest* palindrome ending at `i+k-1` or `i+k` (or longer) that satisfies the conditions. This doesn't quite fit.
//
// Let's refine the DP with an optimized transition, inspired by interval scheduling.
// `dp[i]` = maximum number of non-overlapping palindrome substrings using `s[0...i-1]`.
// `dp[0] = 0`.
// For `i` from 1 to `n`:
//   `dp[i] = dp[i-1]`
//   For each `j` from `0` to `i-1`: (This is the original DP transition which is O(N^2) overall after palindrome precomputation).
//
// A more efficient greedy strategy:
// Iterate `i` from `0` to `n-1` (current character being processed).
// We want to find the maximum number of palindromes. When we find a valid palindrome, we want to pick it and then continue searching from *after* its end. This suggests a greedy choice: when multiple palindromes end at the same position, pick the one that starts earliest (to maximize space for future palindromes). Or, when multiple palindromes *start* at the same position, pick the one that ends earliest.
// This is typical for interval scheduling: choose the interval that ends earliest.
//
// Let `ans = 0`.
// Let `last_end = -1` (the end index of the previously chosen palindrome).
// Iterate `i` from `0` to `n-1`: (`i` represents the potential starting position of a palindrome)
//   For each `j` from `i` to `n-1`: (`j` represents the potential ending position of a palindrome)
//     If `s[i...j]` is a palindrome and `j - i + 1 >= k` and `i > last_end`:
//       We found a valid palindrome `s[i...j]`.
//       However, we need to choose greedily. If there are multiple palindromes starting at `i` (or starting after `last_end` and ending at `j`), which one to pick?
//       The "earliest end time" greedy strategy works here.
//
// Let `ans = 0`.
// Let `end = -1`. This `end` variable will store the end index of the *last chosen* palindrome.
// Iterate `i` from `0` to `n-1`:
//   If `i <= end`: continue (current `i` is within the last chosen palindrome, so we cannot start a new one here).
//   We try to find a palindrome of length `k` or `k+1` starting at or around `i`. Why only `k` and `k+1`?
//   A crucial observation for this problem is that if there is a palindrome `s[x...y]` of length `L >= k`, then there must be a sub-palindrome `s[x'...y']` of length `k` or `k+1` within it.
//   Specifically, if `s[x...y]` is a palindrome, and `y - x + 1 >= k`, then consider `s[x...(x+k-1)]` or `s[x...(x+k)]`.
//   If `s[x...y]` is a palindrome of length `L >= k`. If we select this palindrome, we effectively block the range `[x, y]`.
//   If `L` is very large, say `L = 2k`, and we choose `s[x...x+2k-1]`. It's possible that `s[x...x+k-1]` and `s[x+k...x+2k-1]` could both be palindromes, giving 2.
//   But the problem asks for non-overlapping substrings. If we choose `s[x...y]`, we only get 1.
//   So, what if we pick a shorter palindrome?
//   E.g., `s = "abacaba", k = 3`. "abacaba" (len 7) is a palindrome. If we pick it, ans=1.
//   But "aba" (len 3, s[0...2]) and "aba" (len 3, s[4...6]) are also palindromes. If we pick these two, ans=2.
//   This means picking the shortest possible valid palindromes might be better.
//
// The constraint `L >= k` is important.
// What if we try to find the *first* palindrome of length `k` or `k+1` starting *after* the `last_end`?
// This is the key optimization for the greedy approach.
//
// Let `ans = 0`.
// Let `last_end_idx = -1`. This stores the index of the character *before* which we can start a new palindrome.
//
// Iterate `i` from `0` to `n-1` (current character being considered as a potential start of a palindrome):
//   If `i < last_end_idx`: // Current `i` is still within the last chosen palindrome, so skip.
//     continue;
//
//   // Check for a palindrome of length `k` starting at `i`
//   If `i + k - 1 < n` and `s[i...i+k-1]` is a palindrome:
//     `ans++`;
//     `last_end_idx = i + k - 1`; // The new "end" is the end of this palindrome.
//     continue; // Move to the next `i` to find a new palindrome *after* this one.
//
//   // Check for a palindrome of length `k+1` starting at `i` (only if `k+1` is still a valid length)
//   If `i + k < n` and `s[i...i+k]` is a palindrome:
//     `ans++`;
//     `last_end_idx = i + k`;
//     continue; // Move to the next `i` to find a new palindrome *after* this one.
//
// Why does this greedy strategy (only considering length `k` or `k+1`) work?
// This is a common pattern in interval problems. If we have a choice of several valid intervals that could be picked, which one to pick? The one that "frees up" the most space for subsequent intervals. This means picking the shortest valid interval.
//
// Consider a valid palindrome `s[j...p]` of length `len = p - j + 1 >= k`.
// If we pick this palindrome, we get 1 count and can continue searching from `p+1`.
// We want to maximize the number of non-overlapping palindromes.
//
// If `s[j...p]` is a palindrome, and its length `len >= k`.
//
// Case 1: `len = k`. We can pick `s[j...j+k-1]`. The next palindrome must start at or after `j+k`.
// Case 2: `len = k+1`. We can pick `s[j...j+k]`. The next palindrome must start at or after `j+k+1`.
// Case 3: `len > k+1`. If `s[j...p]` is a palindrome, then `s[j+1...p-1]` is also a palindrome.
//   If we pick `s[j...p]`, we get 1.
//   What if we picked a shorter one?
//   For any palindrome `s[j...p]` with length `L >= k`:
//   - If `L = k`, we must pick `s[j...p]`.
//   - If `L = k+1`, we must pick `s[j...p]`.
//   - If `L > k+1`:
//     If `s[j...j+k-1]` is a palindrome: we could pick this. Its length is `k`. It ends at `j+k-1`.
//     If `s[j...j+k]` is a palindrome: we could pick this. Its length is `k+1`. It ends at `j+k`.
//     We want to minimize the endpoint to allow more subsequent palindromes.
//     So, if `s[j...j+k-1]` is a palindrome, we prefer it over `s[j...j+k]` (if it also exists).
//     If `s[j...j+k]` is a palindrome, we prefer it over `s[j...p]` (if `p > j+k`).
//
// This suggests a greedy choice: when we are at index `i`, we try to find the shortest possible palindrome that starts at or after the previous `last_end_idx` and has length at least `k`.
//
// Let `ans = 0`.
// Let `end = -1` (the end index of the previously chosen palindrome).
// For `i` from `0` to `n-1`:
//   // Check for palindrome `s[i...i+k-1]` (length `k`)
//   If `i + k - 1 < n` and `s[i...(i+k-1)]` is a palindrome:
//     // If this palindrome starts after or exactly at the end of the previous one
//     If `i > end`:
//       `ans++`;
//       `end = i + k - 1`; // Greedily choose the shortest possible palindrome ending earliest.
//     // If `i <= end`, it means this palindrome overlaps. But wait, we're trying to find
//     // the *earliest ending* palindrome. So if `i <= end`, we are still considering
//     // palindromes starting from `i` that could *potentially* end earlier than the
//     // current `end`. This means we need to update `end` to `min(end, i+k-1)`.
//     // This logic is tricky. Let's trace it.
//     Else (`i <= end`): // `s[i...(i+k-1)]` overlaps with the previous selected palindrome.
//       `end = min(end, i + k - 1)`; // Choose the minimum end to maximize remaining space.
//
//   // Check for palindrome `s[i...(i+k)]` (length `k+1`)
//   If `i + k < n` and `s[i...(i+k)]` is a palindrome:
//     // Similar logic: if `i > end`, we found a new palindrome.
//     // If `i <= end`, this new palindrome might end earlier than current `end`.
//     If `i > end`:
//       `ans++`;
//       `end = i + k`;
//     Else (`i <= end`):
//       `end = min(end, i + k)`;
//
// This greedy strategy where `end` is dynamically updated to the minimum valid end index for current `ans` is correct.
//
// The core idea is: Iterate through `s` with `i`. If `i` is greater than the end of the last chosen palindrome (`prev_end`), it means we can start a new palindrome. We want to choose the shortest possible palindrome (`length k` or `k+1`) that starts at or after `prev_end+1`. We update `prev_end` to the end of this chosen palindrome.
//
// Let's refine the greedy approach to be clearer:
// `ans = 0`
// `last_idx_after_chosen_palindrome = -1` (This is `prev_end` effectively)
//
// Iterate `i` from `0` to `n-1`: (This `i` is the potential start of a palindrome)
//   // Check length k palindrome `s[i...i+k-1]`
//   If `i + k - 1 < n`:
//     If `s[i...i+k-1]` is a palindrome:
//       // This palindrome is valid. We need to consider if it starts after the previous `last_idx_after_chosen_palindrome`.
//       // If `i` is the first character after `last_idx_after_chosen_palindrome`, we can choose this.
//       // We increment count and set `last_idx_after_chosen_palindrome` to `i+k-1`.
//       // Then we break from inner checks and move to `i+1` for next outer loop, or rather to `i` of the next valid character.
//       // Example: s = "abaccdbbd", k = 3
//       // i=0: "aba" is palindrome, length 3. Choose. ans=1. last_idx_after_chosen_palindrome=2.
//       // i=1: `1 <= 2`, skip.
//       // i=2: `2 <= 2`, skip.
//       // i=3: `3 > 2`. Check for palindromes starting at 3.
//       //   "acc" len 3. Not palindrome.
//       //   "accd" len 4. Not palindrome.
//       // i=4: `4 > 2`. Check for palindromes starting at 4.
//       //   "ccd" len 3. Not palindrome.
//       //   "ccdb" len 4. Not palindrome.
//       // i=5: `5 > 2`. Check for palindromes starting at 5.
//       //   "dbb" len 3. Not palindrome.
//       //   "dbbd" len 4. Is palindrome. length 4 >= k=3. Choose. ans=2. last_idx_after_chosen_palindrome=8.
//       // i=6: `6 <= 8`, skip.
//       // ...
//       // Final ans=2. This works for Example 1.
//
// This implies the iteration over `i` should be for the *starting point* of the palindrome we are currently considering.
//
// Revisit the greedy logic.
// `ans = 0`
// `last_valid_end_idx = -1` // The end index of the previously chosen palindrome. New palindrome must start at `last_valid_end_idx + 1` or later.
//
// For `i` from `0` to `n-1`: // `i` is the potential *start* of a new palindrome.
//   // If `i` is before or at the `last_valid_end_idx`, it means we cannot start a new palindrome here.
//   // The new palindrome must start strictly after `last_valid_end_idx`.
//   If `i <= last_valid_end_idx`:
//     continue;
//
//   // We are at a valid starting point `i`.
//   // Try to find the shortest possible palindrome of length `k` or `k+1`
//   // that *starts at `i`* or *starts very close to `i` but after `last_valid_end_idx`*
//   // and ends earliest.
//
//   // Option 1: Palindrome of length `k` starting at `i`. `s[i...i+k-1]`
//   If `i + k - 1 < n` and `isPalindrome[i][i+k-1]`:
//     `ans++`;
//     `last_valid_end_idx = i + k - 1`;
//     // Once we pick a palindrome, we stop considering any other palindromes starting at `i` or before `i+k-1`
//     // and move on to find the next palindrome.
//     continue; // Go to next `i` in the outer loop.
//               // The outer loop `i` will increment, eventually skipping past `last_valid_end_idx`.
//
//   // Option 2: Palindrome of length `k+1` starting at `i`. `s[i...i+k]`
//   If `i + k < n` and `isPalindrome[i][i+k]`:
//     `ans++`;
//     `last_valid_end_idx = i + k`;
//     continue;
//
// This simpler greedy strategy is still not quite right. What if there is a palindrome `s[i...i+k-1]` and another `s[i+1...i+k+1]`?
// Say `s = "aaaaa", k = 3`.
// i=0: `s[0...2]`="aaa" (len 3). `ans=1`, `last_valid_end_idx=2`.
// i=1: `1 <= 2`, skip.
// i=2: `2 <= 2`, skip.
// i=3: `3 > 2`.
//   `s[3...5]`="aaa" (len 3). This is `s[3...3+3-1]`. Oops `n=5`, `i+k-1=3+3-1=5`. This `s[3...5]` is not a valid index.
//   For `s="aaaaa"`, `n=5`, `k=3`.
//   `i=0`: `s[0...2]` is "aaa". `isPalindrome[0][2]` true. `ans=1`, `last_valid_end_idx=2`.
//   `i=1`: `1 <= 2`, skip.
//   `i=2`: `2 <= 2`, skip.
//   `i=3`: `3 > 2`.
//     `i+k-1 = 3+3-1 = 5`. `5 < n` is false (`n` is 5, indices 0-4).
//     `i+k = 3+3 = 6`. `6 < n` is false.
//   Loop ends. `ans=1`.
//   Correct output for "aaaaa", k=3 should be 1 ("aaa" at 0, "aaa" at 1, "aaa" at 2). We can pick s[0...2] and s[3...5] is not possible. What about "aaa" at index 1?
//   s="aaaaa", k=3.
//   Palindromes:
//   "aaa": s[0...2], s[1...3], s[2...4]
//   "aaaa": s[0...3], s[1...4]
//   "aaaaa": s[0...4]
//
//   If we pick s[0...2], the next can start from index 3. But no length 3/4 palindrome starts at 3.
//   If we pick s[1...3], the next can start from index 4. `s[4...4+3-1]` and `s[4...4+3]` are out of bounds.
//
//   The problem is: the greedy choice is always picking `s[i...i+k-1]` or `s[i...i+k]` if they exist.
//   This is equivalent to saying: for any `i`, we pick the shortest valid palindrome `s[i...j]` (either length `k` or `k+1`).
//   If we pick `s[i...j]`, the next palindrome must start after `j`.
//
//   The greedy choice is to iterate `i` as the potential *start* of the current palindrome.
//   Then, for all `j` such that `s[i...j]` is a valid palindrome (length `j-i+1 >= k`):
//     We want to find the one that ends earliest.
//   Let `last_end = -1`.
//   For `i` from `0` to `n-1`:
//     If `i <= last_end`: // `i` is already covered by a previous palindrome.
//       continue;
//
//     // Search for shortest palindrome `s[i...j]` starting at `i` with `len >= k`
//     // Only check length `k` and `k+1`. Why?
//     // If `s[i...j]` is a palindrome with `j-i+1 > k+1`, then `s[i+1...j-1]` is a shorter palindrome.
//     // But we need `len >= k`.
//     // If `s[i...j]` is a palindrome of length `L >= k`.
//     // If `s[i...i+k-1]` is a palindrome, this is the shortest candidate of length `k`.
//     // If `s[i...i+k]` is a palindrome, this is the shortest candidate of length `k+1`.
//     // These are the *only* two types of "shortest" palindromes we need to consider from current `i`.
//     // Why? Because if `s[i...j]` is a palindrome with `j-i+1 > k+1`, then it's longer than necessary.
//     // And if `s[i...j]` is a palindrome and we pick it, we are blocking `[i, j]`.
//     // If we could pick `s[i...i+k-1]` instead, that would be better because it ends earlier.
//     // So we only need to check `s[i...i+k-1]` and `s[i...i+k]`.
//
//     `current_best_end = -1`; // Minimum end index found for a palindrome starting at or after `i`
//
//     // Check for length k palindrome starting at `i`
//     If `i + k - 1 < n` and `isPalindrome[i][i+k-1]`:
//       `current_best_end = i + k - 1`;
//
//     // Check for length k+1 palindrome starting at `i`
//     If `i + k < n` and `isPalindrome[i][i+k]`:
//       // If `current_best_end` is already set (by length `k` palindrome), we prefer it.
//       // Otherwise, set it to `i+k`.
//       If `current_best_end == -1`:
//         `current_best_end = i + k`;
//       Else: // Both length k and k+1 palindromes start at i. Pick the shorter one.
//         `current_best_end = min(current_best_end, i + k)`; // This will always be `i+k-1` if both exist.
//
//     // If we found a valid palindrome that starts at `i`
//     If `current_best_end != -1`:
//       `ans++`;
//       `last_end = current_best_end`;
//
//   Return `ans`.
//
// This looks like a solid greedy approach.
//
// Time Complexity:
// 1. Pre-computing `isPalindrome`: O(N^2) where N is `s.length()`.
//    Outer loop `len` from 1 to N. Inner loop `i` from 0 to N-len.
// 2. Greedy selection: O(N) loop for `i`. Inside, constant time checks.
// Total time complexity: O(N^2).
//
// Space Complexity:
// 1. `isPalindrome` 2D boolean array: O(N^2).
// Total space complexity: O(N^2).
//
// Constraints: `N <= 2000`. O(N^2) is `2000^2 = 4 * 10^6`, which is acceptable.

#include <string>
#include <vector>
#include <algorithm>

class Solution {
public:
    int maxPalindromes(std::string s, int k) {
        int n = s.length();

        // isPalindrome[i][j] will be true if s[i...j] is a palindrome.
        // This is a standard dynamic programming approach to find all palindromic substrings.
        std::vector<std::vector<bool>> isPalindrome(n, std::vector<bool>(n, false));

        // Palindromes of length 1 (single characters)
        for (int i = 0; i < n; ++i) {
            isPalindrome[i][i] = true;
        }

        // Palindromes of length 2
        for (int i = 0; i < n - 1; ++i) {
            if (s[i] == s[i+1]) {
                isPalindrome[i][i+1] = true;
            }
        }

        // Palindromes of length 3 or more
        // `len` is the length of the substring
        for (int len = 3; len <= n; ++len) {
            // `i` is the starting index
            for (int i = 0; i <= n - len; ++i) {
                // `j` is the ending index
                int j = i + len - 1;
                // s[i...j] is a palindrome if s[i] == s[j] and s[i+1...j-1] is a palindrome
                if (s[i] == s[j] && isPalindrome[i+1][j-1]) {
                    isPalindrome[i][j] = true;
                }
            }
        }

        // Greedy approach to select maximum non-overlapping palindromes
        int count = 0;
        int last_end_idx = -1; // The end index of the previously selected palindrome.
                               // A new palindrome must start strictly after this index.

        // Iterate through the string, considering each index `i` as a potential start of a new palindrome.
        for (int i = 0; i < n; ++i) {
            // If the current index `i` is covered by the previously selected palindrome,
            // we cannot start a new one here. Move to the next index.
            if (i <= last_end_idx) {
                continue;
            }

            // At this point, `i` is a valid start for a new palindrome.
            // We want to find the shortest possible valid palindrome (length k or k+1)
            // that starts at `i` and greedily pick it to leave maximum space for future palindromes.
            int current_palindrome_end = -1;

            // Check for a palindrome of length `k` starting at `i`
            // Its end index would be `i + k - 1`.
            if (i + k - 1 < n && isPalindrome[i][i + k - 1]) {
                current_palindrome_end = i + k - 1;
            }

            // Check for a palindrome of length `k+1` starting at `i`
            // Its end index would be `i + k`.
            // If we found a length `k` palindrome, we prefer it as it ends earlier.
            // If not, or if this length `k+1` palindrome ends even earlier (which it won't, if it also starts at `i`),
            // then consider it.
            if (i + k < n && isPalindrome[i][i + k]) {
                if (current_palindrome_end == -1) {
                    current_palindrome_end = i + k;
                } else {
                    // Both length `k` and `k+1` palindromes start at `i`.
                    // We must pick the shorter one to maximize remaining space.
                    // This means `current_palindrome_end` remains `i + k - 1`.
                    // We explicitly `min` here for clarity, though `i+k-1` is always smaller than `i+k`.
                    current_palindrome_end = std::min(current_palindrome_end, i + k);
                }
            }

            // If a valid palindrome (length `k` or `k+1` starting at `i`) was found
            if (current_palindrome_end != -1) {
                count++; // Increment the total count of non-overlapping palindromes
                last_end_idx = current_palindrome_end; // Update the end boundary for the next search
            }
        }

        return count;
    }
};