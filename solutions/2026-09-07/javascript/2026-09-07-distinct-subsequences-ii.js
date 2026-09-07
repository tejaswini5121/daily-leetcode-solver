// Problem: Distinct Subsequences II
// Summary: Counts the number of distinct non-empty subsequences of a given string, modulo 10^9 + 7.
// Link: https://leetcode.com/problems/distinct-subsequences-ii/
// Approach:
// This problem can be solved using dynamic programming. Let dp[i] be the number of distinct subsequences ending at index i.
// When we consider a new character s[i], it can extend all existing subsequences, and also form a new subsequence of just itself.
// If s[i] is a character that has appeared before, say at index j < i, then simply adding s[i] to all subsequences ending before i would lead to double counting.
// Specifically, if s[i] is the same as s[j], then any subsequence ending at j, when extended by s[i], will be the same as a subsequence ending at i formed by extending a subsequence ending at j.
// To avoid this, we can maintain a count of distinct subsequences ending with each character 'a' through 'z'.
// Let `count[char]` store the number of distinct subsequences ending with character `char`.
// When we process `s[i]`:
// 1. The number of new subsequences formed by `s[i]` is `1` (for `s[i]` itself) plus the sum of all distinct subsequences formed so far (which can be extended by `s[i]`).
// 2. Let `total_subsequences_before_i` be the sum of all distinct subsequences ending with any character up to index `i-1`.
// 3. The new subsequences ending with `s[i]` will be `total_subsequences_before_i + 1`.
// 4. However, if `s[i]` has appeared before, say the last occurrence was at index `prev_idx`, we need to subtract the number of subsequences that were formed by extending subsequences ending at `prev_idx`. This is precisely `count[s[i]]` *before* we update it for the current `s[i]`.
// 5. So, the number of distinct subsequences ending with `s[i]` at the current step is `(total_subsequences_before_i + 1 - count[s[i]] + MOD) % MOD`. The `+ MOD` is for handling negative results from subtraction before the modulo operation.
// 6. The `total_subsequences_before_i` can be calculated as the sum of all `count[char]` values.
// 7. We update `count[s[i]]` with this new value.
// 8. The final answer is the sum of all `count[char]` values modulo 10^9 + 7.
// Time Complexity: O(N), where N is the length of the string s. We iterate through the string once.
// Space Complexity: O(1), as we only use a fixed-size array (26 for lowercase English letters) to store counts.
//
// Example walkthrough: s = "aba"
// MOD = 10^9 + 7
// count = {'a': 0, 'b': 0, ...}
//
// i = 0, s[i] = 'a'
// total_subsequences_before_i = 0
// new_subsequences_ending_with_a = (0 + 1 - count['a']) % MOD = (1 - 0) % MOD = 1.
// count['a'] = 1.
// Current distinct subsequences: "a"
//
// i = 1, s[i] = 'b'
// total_subsequences_before_i = count['a'] = 1
// new_subsequences_ending_with_b = (1 + 1 - count['b']) % MOD = (2 - 0) % MOD = 2.
// count['b'] = 2.
// Current distinct subsequences: "a", "b", "ab" (count['a']=1, count['b']=2)
//
// i = 2, s[i] = 'a'
// total_subsequences_before_i = count['a'] + count['b'] = 1 + 2 = 3.
// new_subsequences_ending_with_a = (3 + 1 - count['a']) % MOD = (4 - 1 + MOD) % MOD = 3.
// count['a'] = 3.
// Current distinct subsequences: "a", "b", "ab", "aa", "ba", "aba" (count['a']=3, count['b']=2)
//
// Final answer = sum(count.values()) = 3 + 2 = 5. Wait, example output is 6.
// Let's re-evaluate the DP state and transition.
//
// Alternative DP State:
// Let `dp[i]` be the number of distinct subsequences of `s[0...i-1]`.
// When we consider `s[i]`:
// The number of distinct subsequences of `s[0...i]` is `dp[i]` (subsequences that don't include `s[i]`) plus the new subsequences formed by appending `s[i]` to existing subsequences or forming `s[i]` itself.
// The new subsequences are:
// 1. `s[i]` itself (1 subsequence).
// 2. `s[i]` appended to all distinct subsequences of `s[0...i-1]`. This would be `dp[i]`.
// So, `dp[i+1] = dp[i] + dp[i] + 1 = 2 * dp[i] + 1`.
// This counts *all* subsequences, not distinct ones.
//
// Let's go back to the character count approach and refine it.
// Let `dp` be the total number of distinct non-empty subsequences encountered so far.
// Let `last_count[char]` be the number of distinct subsequences ending with `char`.
// When processing `s[i]`:
// The number of new subsequences we can form using `s[i]` is `1` (for `s[i]` itself) plus all existing distinct subsequences (which we can append `s[i]` to).
// So, `new_subsequences_with_s_i = dp + 1`.
// If `s[i]` has appeared before, say the last time it appeared, it contributed `last_count[s[i]]` distinct subsequences ending with it. These subsequences, when extended by the current `s[i]`, will be duplicates of subsequences already counted.
// Therefore, the number of *truly new* distinct subsequences ending with `s[i]` is `(dp + 1 - last_count[s[i]]) % MOD`.
//
// Let `dp` be the total count of distinct subsequences.
// Let `ends_with[char]` be the count of distinct subsequences ending with `char`.
//
// Initialize `dp = 0`.
// Initialize `ends_with` array of size 26 to all zeros.
// MOD = 10^9 + 7
//
// For each character `char` in `s`:
//   `newly_added_ending_with_char = (dp + 1 - ends_with[char] + MOD) % MOD`
//   `dp = (dp + newly_added_ending_with_char) % MOD`
//   `ends_with[char] = (ends_with[char] + newly_added_ending_with_char) % MOD` // This update is incorrect.
//
// The correct logic should be:
// `dp[i]` = total distinct subsequences of `s[0...i-1]`.
// `ends_with[char]` = number of distinct subsequences of `s[0...i-1]` that end with `char`.
//
// When considering `s[i]`:
// The number of new subsequences ending with `s[i]` is `1` (for `s[i]` itself) plus the total number of distinct subsequences of `s[0...i-1]` (i.e., `dp[i]`).
// So, potential new subsequences ending with `s[i]` = `dp[i] + 1`.
// If `s[i]` has appeared before, say the last occurrence was at index `j`, then the subsequences ending with `s[i]` at index `i` will be duplicates of subsequences ending with `s[j]`.
// The number of distinct subsequences ending with `s[i]` *at index i* would be `(dp[i] + 1 - ends_with[s[i]]_before_this_char + MOD) % MOD`.
//
// Let's use `dp` as the total number of distinct non-empty subsequences.
// Let `last_occurrence_count[char]` store the number of distinct subsequences that *ended* with `char` from the *previous* occurrences of `char`.
//
// Initialize `total_distinct_subsequences = 0`.
// Initialize `last_occurrence_count` array of size 26 to all zeros.
// MOD = 10^9 + 7
//
// For each character `currentChar` in `s`:
//   `currentIndex = charCode - 'a'`
//   `new_subsequences_ending_here = (total_distinct_subsequences + 1) % MOD`
//   `duplicates = last_occurrence_count[currentIndex]`
//   `truly_new_subsequences = (new_subsequences_ending_here - duplicates + MOD) % MOD`
//
//   // Update total distinct subsequences:
//   // We add the `truly_new_subsequences`.
//   // We also need to consider the subsequences that were formed by appending `currentChar` to existing ones.
//   // The total number of subsequences ending with `currentChar` after processing this character is `new_subsequences_ending_here`.
//   // The previous count of subsequences ending with `currentChar` was `duplicates`.
//   // The total increase in distinct subsequences is `truly_new_subsequences`.
//
//   // Let `dp[k]` be the total number of distinct subsequences using the first `k` characters of `s`.
//   // When considering `s[k]`:
//   // The new subsequences are formed by appending `s[k]` to all distinct subsequences of `s[0...k-1]`, plus `s[k]` itself.
//   // Number of new subsequences ending with `s[k]` = `dp[k] + 1`.
//   // If `s[k]` has appeared before, say at `j`, then the subsequences ending with `s[k]` that are duplicates of subsequences ending with `s[j]` are `ends_with[s[k]]` from the state at index `j`.
//   // So, `ends_with[s[k]]` (for current `s[k]`) = `(dp[k] + 1 - ends_with[s[k]]_from_previous_state + MOD) % MOD`.
//   // The total distinct subsequences `dp[k+1]` = `dp[k] + (new subsequences ending with s[k])`.
//   // `dp[k+1] = dp[k] + (dp[k] + 1 - ends_with[s[k]]_from_previous_state + MOD) % MOD`. This is still getting complicated.
//
// Let's simplify the state tracking.
// `dp[i]` = total number of distinct subsequences for `s[0...i-1]`.
// `count[char]` = number of distinct subsequences *ending* with character `char` for `s[0...i-1]`.
//
// For `s[i]`:
// The total number of distinct subsequences for `s[0...i]` (let's call this `new_total`) can be calculated from `dp[i]` (total for `s[0...i-1]`).
// The new subsequences we add are formed by appending `s[i]` to all existing subsequences of `s[0...i-1]` AND `s[i]` itself.
// Number of subsequences to append `s[i]` to = `dp[i]`.
// So, we are potentially adding `dp[i] + 1` new subsequences.
// However, if `s[i]` has appeared before, say the last count of subsequences ending with `s[i]` was `prev_count_s_i`, then these `prev_count_s_i` subsequences would lead to duplicates if we simply append `s[i]` to everything.
//
// Correct DP Transition:
// Let `dp[i]` be the number of distinct subsequences of `s[0...i-1]`.
// Let `ends_with[char]` be the number of distinct subsequences of `s[0...i-1]` that end with `char`.
//
// Initialize `dp = 0` (total distinct subsequences of an empty prefix).
// Initialize `ends_with` array of size 26 to all zeros.
// MOD = 10^9 + 7.
//
// For each character `c` in `s`:
//   `char_index = c.charCodeAt(0) - 'a'.charCodeAt(0)`
//
//   // `current_new_ending_with_c`: number of new distinct subsequences that end with `c` using the current character.
//   // This is `1` (for `c` itself) plus all existing distinct subsequences `dp`.
//   // `potential_new_ending_with_c = (dp + 1) % MOD`.
//
//   // However, if `c` has appeared before, some of these will be duplicates.
//   // The number of duplicates is the number of distinct subsequences that ended with `c` *before* processing the current `c`. This is stored in `ends_with[char_index]`.
//   // So, the *truly new* distinct subsequences ending with `c` is:
//   `current_new_ending_with_c = (dp + 1 - ends_with[char_index] + MOD) % MOD`
//
//   // Now, we update the total distinct subsequences `dp`.
//   // The `current_new_ending_with_c` are added to the existing `dp`.
//   // But we also need to correctly update `ends_with[char_index]` for the *next* iteration.
//   // The new count of distinct subsequences ending with `c` will be `current_new_ending_with_c` PLUS the old `ends_with[char_index]`.
//   // No, this is not right. `current_new_ending_with_c` is the *total* number of distinct subsequences ending with `c` after processing the current character.
//
//   // Let's track the total sum of distinct subsequences (`total_subsequences`).
//   // And for each character, track the number of distinct subsequences ending with that character (`ends_with[char]`).
//
//   // For character `c`:
//   // `total_subsequences_before_c = total_subsequences`
//   // `prev_ends_with_c = ends_with[c]`
//
//   // Number of new subsequences formed by using `c` as the last character:
//   // This is `1` (for `c` itself) plus all existing distinct subsequences.
//   // So, `potential_new = (total_subsequences_before_c + 1) % MOD`.
//
//   // The number of distinct subsequences that END with `c` *after* processing this character is `potential_new`.
//   // The number of subsequences that we are adding to the `total_subsequences` count is `potential_new - prev_ends_with_c`.
//   // Why? Because the `prev_ends_with_c` subsequences ending with `c` were already accounted for in `total_subsequences_before_c`. When we add `c` to all existing subsequences, we are effectively creating new ones.
//   // The ones that are duplicates are precisely those that ended with `c` previously.
//
//   // So, the number of *newly contributed* distinct subsequences by this character `c` is:
//   // `newly_added = (potential_new - prev_ends_with_c + MOD) % MOD`
//
//   // `total_subsequences = (total_subsequences + newly_added) % MOD`
//   // `ends_with[c] = potential_new` // The total distinct subsequences ending with c is now `potential_new`.
//
// Let's dry run "aba" again with this logic.
// MOD = 10^9 + 7
// total_subsequences = 0
// ends_with = [0, 0, ..., 0] (for 'a' through 'z')
//
// i = 0, char = 'a'
// char_index = 0
// total_subsequences_before_c = 0
// prev_ends_with_c = ends_with[0] = 0
//
// potential_new = (total_subsequences_before_c + 1) % MOD = (0 + 1) % MOD = 1
// newly_added = (potential_new - prev_ends_with_c + MOD) % MOD = (1 - 0 + MOD) % MOD = 1
//
// total_subsequences = (total_subsequences + newly_added) % MOD = (0 + 1) % MOD = 1
// ends_with[0] = potential_new = 1
//
// State after 'a': total_subsequences = 1 ("a"), ends_with['a'] = 1
//
// i = 1, char = 'b'
// char_index = 1
// total_subsequences_before_c = 1
// prev_ends_with_c = ends_with[1] = 0
//
// potential_new = (total_subsequences_before_c + 1) % MOD = (1 + 1) % MOD = 2
// newly_added = (potential_new - prev_ends_with_c + MOD) % MOD = (2 - 0 + MOD) % MOD = 2
//
// total_subsequences = (total_subsequences + newly_added) % MOD = (1 + 2) % MOD = 3
// ends_with[1] = potential_new = 2
//
// State after 'b': total_subsequences = 3 ("a", "b", "ab"), ends_with['a'] = 1, ends_with['b'] = 2
//
// i = 2, char = 'a'
// char_index = 0
// total_subsequences_before_c = 3
// prev_ends_with_c = ends_with[0] = 1
//
// potential_new = (total_subsequences_before_c + 1) % MOD = (3 + 1) % MOD = 4
// newly_added = (potential_new - prev_ends_with_c + MOD) % MOD = (4 - 1 + MOD) % MOD = 3
//
// total_subsequences = (total_subsequences + newly_added) % MOD = (3 + 3) % MOD = 6
// ends_with[0] = potential_new = 4
//
// State after 'a': total_subsequences = 6 ("a", "b", "ab", "aa", "ba", "aba"), ends_with['a'] = 4, ends_with['b'] = 2
//
// Final answer = total_subsequences = 6. This matches Example 2.
//
// Let's dry run "abc".
// MOD = 10^9 + 7
// total_subsequences = 0
// ends_with = [0, 0, ..., 0]
//
// i = 0, char = 'a'
// total_subsequences_before_c = 0, prev_ends_with_c = 0
// potential_new = (0 + 1) % MOD = 1
// newly_added = (1 - 0 + MOD) % MOD = 1
// total_subsequences = (0 + 1) % MOD = 1
// ends_with[0] = 1
//
// State: total=1 ("a"), ends_with['a']=1
//
// i = 1, char = 'b'
// total_subsequences_before_c = 1, prev_ends_with_c = 0
// potential_new = (1 + 1) % MOD = 2
// newly_added = (2 - 0 + MOD) % MOD = 2
// total_subsequences = (1 + 2) % MOD = 3
// ends_with[1] = 2
//
// State: total=3 ("a", "b", "ab"), ends_with['a']=1, ends_with['b']=2
//
// i = 2, char = 'c'
// total_subsequences_before_c = 3, prev_ends_with_c = 0
// potential_new = (3 + 1) % MOD = 4
// newly_added = (4 - 0 + MOD) % MOD = 4
// total_subsequences = (3 + 4) % MOD = 7
// ends_with[2] = 4
//
// State: total=7 ("a", "b", "c", "ab", "ac", "bc", "abc"), ends_with['a']=1, ends_with['b']=2, ends_with['c']=4
//
// Final answer = 7. Matches Example 1.
//
// Let's dry run "aaa".
// MOD = 10^9 + 7
// total_subsequences = 0
// ends_with = [0, 0, ..., 0]
//
// i = 0, char = 'a'
// total_subsequences_before_c = 0, prev_ends_with_c = 0
// potential_new = (0 + 1) % MOD = 1
// newly_added = (1 - 0 + MOD) % MOD = 1
// total_subsequences = (0 + 1) % MOD = 1
// ends_with[0] = 1
//
// State: total=1 ("a"), ends_with['a']=1
//
// i = 1, char = 'a'
// total_subsequences_before_c = 1, prev_ends_with_c = 1
// potential_new = (1 + 1) % MOD = 2
// newly_added = (2 - 1 + MOD) % MOD = 1
// total_subsequences = (1 + 1) % MOD = 2
// ends_with[0] = 2
//
// State: total=2 ("a", "aa"), ends_with['a']=2
//
// i = 2, char = 'a'
// total_subsequences_before_c = 2, prev_ends_with_c = 2
// potential_new = (2 + 1) % MOD = 3
// newly_added = (3 - 2 + MOD) % MOD = 1
// total_subsequences = (2 + 1) % MOD = 3
// ends_with[0] = 3
//
// State: total=3 ("a", "aa", "aaa"), ends_with['a']=3
//
// Final answer = 3. Matches Example 3.
//
// The logic seems sound.
// Implementation details:
// - Use an array of size 26 for `ends_with`.
// - `charCodeAt(0) - 'a'.charCodeAt(0)` to get the index for a character.
// - Use `BigInt` for calculations if intermediate values could exceed JavaScript's safe integer limit, but since we modulo at each step, standard numbers should be fine. The constraints (N <= 2000) and modulo operations suggest standard numbers are sufficient.
// - Modulo constant: 10^9 + 7.
//
// One final check on the definition of `ends_with`:
// `ends_with[char]` at step `i` (after processing `s[i-1]`) represents the number of distinct subsequences of `s[0...i-1]` that end with `char`.
//
// Let `dp` be the total number of distinct subsequences for the prefix processed so far.
// Let `ends_with[char_idx]` be the number of distinct subsequences ending with character `char_idx` for the prefix processed so far.
//
// When processing character `c`:
//   `char_idx = c.charCodeAt(0) - 'a'.charCodeAt(0)`
//
//   // Calculate the number of distinct subsequences ending with `c` using the current character `c`.
//   // This is formed by taking all existing distinct subsequences (`dp`) and appending `c`, plus `c` itself.
//   // `current_ends_with_c = (dp + 1) % MOD`
//
//   // We are adding `current_ends_with_c` to our total count if `c` is a new character, or if these are genuinely new subsequences.
//   // The number of *new* distinct subsequences contributed by this character `c` is `current_ends_with_c` MINUS the number of distinct subsequences that *previously* ended with `c`.
//   // This is because those previously counted subsequences ending with `c`, when extended by the current `c`, would form duplicates of what `current_ends_with_c` represents.
//   // So, `newly_added_subsequences = (current_ends_with_c - ends_with[char_idx] + MOD) % MOD`.
//
//   // Update the total count of distinct subsequences:
//   // `dp = (dp + newly_added_subsequences) % MOD`.
//
//   // Update `ends_with[char_idx]` for the next iteration.
//   // The number of distinct subsequences ending with `c` *now* is `current_ends_with_c`.
//   // `ends_with[char_idx] = current_ends_with_c`.
//
// This is the same logic as before. Looks good.

// Header comment block:
// Problem: Distinct Subsequences II
// Summary: Counts the number of distinct non-empty subsequences of a given string, modulo 10^9 + 7.
// Link: https://leetcode.com/problems/distinct-subsequences-ii/
// Approach: Dynamic Programming. We maintain two pieces of information:
// 1. `total_distinct_subsequences`: the total count of distinct non-empty subsequences found so far.
// 2. `ends_with[char_idx]`: the count of distinct subsequences that end with the character corresponding to `char_idx`.
// When processing a character `c` from the input string `s`:
//   - The number of potential new subsequences ending with `c` is `(total_distinct_subsequences + 1)`. This is because we can append `c` to all previously found distinct subsequences, plus `c` itself forms a new subsequence.
//   - If `c` has appeared before, we need to subtract the number of distinct subsequences that previously ended with `c` (`ends_with[c]`). This is to avoid double-counting. The number of truly new distinct subsequences contributed by this `c` is `(total_distinct_subsequences + 1 - ends_with[c] + MOD) % MOD`.
//   - We update `total_distinct_subsequences` by adding these truly new subsequences.
//   - We then update `ends_with[c]` to reflect the total number of distinct subsequences that now end with `c`, which is `(total_distinct_subsequences + 1) % MOD`.
// Time complexity: O(N), where N is the length of the string `s`. We iterate through the string once.
// Space complexity: O(1), as we use a fixed-size array (26 for lowercase English letters) for `ends_with`.

const distinctSubseqII = function(s) {
    // Modulo constant as per problem statement
    const MOD = 10**9 + 7;

    // `ends_with[i]` will store the number of distinct subsequences
    // that end with the character corresponding to index `i` (0 for 'a', 1 for 'b', etc.).
    // Initialize all counts to 0.
    const ends_with = new Array(26).fill(0);

    // `total_distinct_subsequences` will store the total number of
    // distinct non-empty subsequences found so far.
    let total_distinct_subsequences = 0;

    // Iterate through each character of the input string `s`.
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        const char_index = char.charCodeAt(0) - 'a'.charCodeAt(0);

        // Calculate the number of new distinct subsequences that can be formed
        // using the current character `char` as the last character.
        // This count is `1` (for the subsequence consisting of `char` itself)
        // plus all the distinct subsequences found *before* this character.
        // `total_distinct_subsequences` represents the count of distinct
        // subsequences formed from the prefix `s[0...i-1]`.
        // So, `(total_distinct_subsequences + 1)` is the potential number
        // of distinct subsequences ending with the current `char`.
        // Example: if `s = "ab"` and we process `c`:
        // `total_distinct_subsequences` is 3 ("a", "b", "ab").
        // Adding `c` to each gives "ac", "bc", "abc". Plus `c` itself.
        // So, `3 + 1 = 4` new subsequences ending with `c`.

        // However, if `char` has appeared before, we've already counted
        // subsequences ending with `char`. For example, if `s = "aba"` and
        // we are at the second 'a'.
        // `total_distinct_subsequences` before this 'a' is 3 ("a", "b", "ab").
        // Potential new ending with 'a' would be `3 + 1 = 4`.
        // The subsequences ending with 'a' from the *previous* occurrence of 'a'
        // are `ends_with[char_index]` (which was 1 for the first 'a').
        // If we append the current 'a' to existing subsequences:
        // "a" (prev) + 'a' -> "aa"
        // "b" + 'a' -> "ba"
        // "ab" + 'a' -> "aba"
        // And 'a' itself.
        // The subsequences that END with the current 'a' are:
        // 1. The character 'a' itself.
        // 2. All existing distinct subsequences of `s[0...i-1]` with `char` appended.
        // The count of these is `total_distinct_subsequences + 1`.
        // But if `char` has been seen before, we have already counted subsequences ending with `char`.
        // Let `prev_ends_with_char` be the count of distinct subsequences that ended with `char` *before* processing the current `char`.
        // The number of *newly added* distinct subsequences by processing the current `char` is:
        // `(total_distinct_subsequences + 1) - prev_ends_with_char`.
        // We use `(total_distinct_subsequences + 1 - ends_with[char_index] + MOD) % MOD` to handle potential negative results from subtraction.
        const current_potential_ending_with_char = (total_distinct_subsequences + 1) % MOD;
        const prev_ends_with_char = ends_with[char_index];

        // `newly_added_subsequences` are the subsequences that are strictly new
        // and end with the current `char`.
        const newly_added_subsequences = (current_potential_ending_with_char - prev_ends_with_char + MOD) % MOD;

        // Update the total count of distinct subsequences.
        // We add the `newly_added_subsequences` to the running total.
        total_distinct_subsequences = (total_distinct_subsequences + newly_added_subsequences) % MOD;

        // Update the count of distinct subsequences ending with `char`.
        // The new count of distinct subsequences ending with `char` is `current_potential_ending_with_char`.
        // This is because `current_potential_ending_with_char` represents all distinct
        // subsequences that end with `char` using the prefix `s[0...i]`.
        ends_with[char_index] = current_potential_ending_with_char;
    }

    // The final `total_distinct_subsequences` holds the answer.
    return total_distinct_subsequences;
};
```