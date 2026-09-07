```python
# Problem: Distinct Subsequences II
# Link: https://leetcode.com/problems/distinct-subsequences-ii/
#
# Approach:
# This problem can be solved using dynamic programming. We'll maintain an array `dp` where `dp[i]`
# represents the number of distinct non-empty subsequences that can be formed using the first `i`
# characters of the string `s`.
#
# We also need to keep track of the last seen index of each character to avoid overcounting.
# Let `last[char]` be the number of distinct subsequences ending with `char`.
#
# When we process the `i`-th character `s[i-1]` (using 1-based indexing for dp and 0-based for string `s`):
#
# 1. The total number of distinct subsequences so far is `dp[i-1]`.
# 2. For each existing subsequence, we can append `s[i-1]` to it. This gives us `dp[i-1]` new subsequences.
# 3. We also have the single character subsequence `s[i-1]` itself.
# 4. So, a naive calculation would be `dp[i] = dp[i-1] + dp[i-1] + 1`. However, this overcounts if `s[i-1]` has
#    appeared before.
#
# To correct for overcounting:
# If `s[i-1]` has appeared before, say at index `j-1` (where `j < i`), then the subsequences ending with
# `s[i-1]` that were formed using characters up to `s[j-2]` are now being formed again. The number of
# such subsequences is `dp[j-1]` (if `j > 1`, otherwise it's 0).
#
# Let `dp[i]` be the total number of distinct subsequences using `s[0...i-1]`.
# When considering `s[i]`:
# The new subsequences formed are:
# - `s[i]` itself (1 subsequence)
# - All existing subsequences from `s[0...i-1]` with `s[i]` appended. The number of such subsequences is `dp[i]`.
# So, a naive total would be `dp[i] + dp[i] + 1`.
#
# Let's refine the state. `dp[i]` will be the number of distinct subsequences considering `s[0...i-1]`.
# `dp[0] = 0` (no characters, no subsequences).
#
# For `s[i-1]` (the current character):
# The number of new subsequences we can form is `dp[i-1]` (by appending `s[i-1]` to all previous subsequences) + 1 (the character `s[i-1]` itself).
# So, `dp[i] = dp[i-1] + (dp[i-1] + 1) = 2 * dp[i-1] + 1`.
#
# Now, consider duplicates. If `s[i-1]` is character `c`, and the previous occurrence of `c` was at index `prev_idx`.
# The number of subsequences we formed *ending with `c`* using `s[0...prev_idx-1]` are `dp[prev_idx]`.
# These are precisely the ones we are re-forming when appending `c` to subsequences ending before `prev_idx`.
#
# Let's use `last_count[char]` to store the number of distinct subsequences ending with `char` *before* processing the current character.
#
# `dp[i]` = total distinct non-empty subsequences using `s[0...i-1]`.
# `dp[0] = 0`.
#
# For `i` from 1 to `n` (where `n` is `len(s)`):
# `current_char = s[i-1]`
#
# Total new subsequences ending with `current_char`:
# This is `dp[i-1]` (appending `current_char` to all previous subsequences) + 1 (the `current_char` itself).
# Let `new_subsequences_ending_with_current_char = dp[i-1] + 1`.
#
# However, if `current_char` has appeared before, say at index `k`, then the subsequences ending with `current_char` that were formed using `s[0...k-1]` are duplicates.
# The number of such duplicate subsequences is precisely `last_count[current_char]` from *before* the last `current_char` was processed.
#
# So, the number of *truly new* distinct subsequences ending with `current_char` is `(dp[i-1] + 1) - last_count[current_char]`.
#
# The total distinct subsequences up to `s[i-1]` is:
# `dp[i] = dp[i-1]` (existing subsequences) + `(dp[i-1] + 1 - last_count[current_char])` (new subsequences ending with `current_char`).
# `dp[i] = 2 * dp[i-1] + 1 - last_count[current_char]`.
#
# After calculating `dp[i]`, we need to update `last_count[current_char]` for the *next* iteration.
# The number of distinct subsequences ending with `current_char` *after* processing `s[i-1]` is `dp[i-1] + 1`.
#
# Let's use a simpler DP state:
# `dp[i]` = number of distinct non-empty subsequences considering string `s` of length `i`.
# `dp[0] = 0`.
#
# For character `s[i]`:
# The total number of subsequences formed by adding `s[i]` to existing ones is `dp[i]`.
# Plus, the subsequence `s[i]` itself (1).
# So, potential new subsequences = `dp[i] + 1`.
#
# If `s[i]` is a new character: `dp[i+1] = dp[i] + (dp[i] + 1) = 2 * dp[i] + 1`.
#
# If `s[i]` has appeared before, say `s[i] == s[j]` for `j < i`.
# The subsequences ending with `s[i]` that we are adding are:
# `s[i]` itself.
# All previous subsequences `sub` from `s[0...i-1]` appended with `s[i]`, i.e., `sub + s[i]`.
#
# The problem is that `sub + s[i]` might have been formed already if `s[j]` was used.
#
# Let `dp[k]` be the number of distinct subsequences using the first `k` characters of `s`.
# `dp[0] = 0`.
#
# For `i` from 1 to `n`:
# `dp[i] = 2 * dp[i-1] + 1` (total if `s[i-1]` is unique).
# If `s[i-1]` has a previous occurrence at index `prev_idx`, we need to subtract the subsequences that were formed ending with `s[i-1]` using characters up to `s[prev_idx-1]`.
# The number of such subsequences is `dp[prev_idx]`.
#
# So, `dp[i] = (2 * dp[i-1] + 1 - dp[prev_idx]) % MOD`.
#
# We need a way to store the `prev_idx`. Let's use `last_occurrence[char]` to store the `dp` value *before* processing that character.
#
# Let `dp[i]` be the total number of distinct subsequences using `s[0...i-1]`.
# `dp[0] = 0`.
#
# For `i` from 1 to `n`:
# `current_char = s[i-1]`
# `new_subsequences = dp[i-1] + 1` (these are all subsequences formed by appending `current_char` to existing ones, plus `current_char` itself).
# `prev_count_ending_with_char = last_count[current_char]` (number of distinct subsequences ending with `current_char` *before* processing the current occurrence).
#
# `dp[i] = (dp[i-1] + new_subsequences - prev_count_ending_with_char) % MOD`.
# `dp[i] = (dp[i-1] + (dp[i-1] + 1) - last_count[current_char]) % MOD`.
# `dp[i] = (2 * dp[i-1] + 1 - last_count[current_char]) % MOD`.
#
# Update `last_count[current_char]` for the *next* time `current_char` appears.
# The number of new distinct subsequences ending with `current_char` that we just formed is `dp[i-1] + 1`.
# So, `last_count[current_char] = dp[i-1] + 1`.
#
# The modulo is 10^9 + 7.
# The modulo operation needs to handle negative results correctly: `(a - b + MOD) % MOD`.
#
# Example: s = "abc"
# MOD = 10^9 + 7
# last_count = {'a': 0, 'b': 0, 'c': 0, ...}
# dp = [0] * (n+1)
# dp[0] = 0
#
# i = 1, s[0] = 'a'
# new_subsequences = dp[0] + 1 = 0 + 1 = 1 (subsequence "a")
# prev_count_ending_with_a = last_count['a'] = 0
# dp[1] = (dp[0] + new_subsequences - prev_count_ending_with_a) % MOD
#       = (0 + 1 - 0) % MOD = 1
# Update last_count['a'] = dp[0] + 1 = 1. (This '1' represents the subsequence "a" itself)
#
# i = 2, s[1] = 'b'
# new_subsequences = dp[1] + 1 = 1 + 1 = 2 (subsequences "b", "ab")
# prev_count_ending_with_b = last_count['b'] = 0
# dp[2] = (dp[1] + new_subsequences - prev_count_ending_with_b) % MOD
#       = (1 + 2 - 0) % MOD = 3
#   Subsequences: "a", "b", "ab"
# Update last_count['b'] = dp[1] + 1 = 1 + 1 = 2. (These 2 represent "b" and "ab" formed now)
#
# i = 3, s[2] = 'c'
# new_subsequences = dp[2] + 1 = 3 + 1 = 4 (subsequences "c", "ac", "bc", "abc")
# prev_count_ending_with_c = last_count['c'] = 0
# dp[3] = (dp[2] + new_subsequences - prev_count_ending_with_c) % MOD
#       = (3 + 4 - 0) % MOD = 7
#   Subsequences: "a", "b", "ab", "c", "ac", "bc", "abc"
# Update last_count['c'] = dp[2] + 1 = 3 + 1 = 4.
#
# Final answer: dp[3] = 7. Correct.
#
# Example: s = "aba"
# MOD = 10^9 + 7
# last_count = {} (default 0 for chars not seen)
# dp = [0] * 4
# dp[0] = 0
#
# i = 1, s[0] = 'a'
# new_subsequences = dp[0] + 1 = 1 ("a")
# prev_count_ending_with_a = last_count.get('a', 0) = 0
# dp[1] = (dp[0] + new_subsequences - prev_count_ending_with_a) % MOD
#       = (0 + 1 - 0) % MOD = 1
# Update last_count['a'] = dp[0] + 1 = 1.
#
# i = 2, s[1] = 'b'
# new_subsequences = dp[1] + 1 = 1 + 1 = 2 ("b", "ab")
# prev_count_ending_with_b = last_count.get('b', 0) = 0
# dp[2] = (dp[1] + new_subsequences - prev_count_ending_with_b) % MOD
#       = (1 + 2 - 0) % MOD = 3
#   Subsequences: "a", "b", "ab"
# Update last_count['b'] = dp[1] + 1 = 1 + 1 = 2.
#
# i = 3, s[2] = 'a'
# new_subsequences = dp[2] + 1 = 3 + 1 = 4 ("a", "aa", "ba", "aba")
# prev_count_ending_with_a = last_count.get('a', 0) = 1 (this represents the subsequence "a" itself, formed at i=1)
# dp[3] = (dp[2] + new_subsequences - prev_count_ending_with_a) % MOD
#       = (3 + 4 - 1) % MOD = 6
#   Let's trace carefully:
#   dp[2] = 3 ("a", "b", "ab")
#   Current char 'a'.
#   New subsequences to consider by appending 'a':
#   "a" (from empty string)
#   "aa" (from "a")
#   "ba" (from "b")
#   "aba" (from "ab")
#   Total potential new = dp[2] + 1 = 3 + 1 = 4.
#   The subsequence "a" itself is one.
#   When we append 'a' to existing subsequences: "a", "ba", "aba".
#   Total distinct: "a" (existing), "b", "ab" (existing).
#   New ones we are adding: "a", "aa", "ba", "aba".
#   Total if no duplicates: "a", "b", "ab", "a", "aa", "ba", "aba". Distinct are: "a", "b", "ab", "aa", "ba", "aba".
#   The problem is that "a" formed at step 3 is a duplicate of "a" formed at step 1.
#   The number of subsequences we *would have added* but are actually duplicates is the number of distinct subsequences ending with 'a' *before* this current 'a'.
#   This is `last_count['a']` from before processing s[2]. `last_count['a']` was 1 (representing "a").
#   So, we added 4 new potential subsequences. But 1 of them ("a") is a duplicate.
#   So, we add 4 - 1 = 3 *truly new* subsequences.
#   Total = dp[2] (existing) + 3 (truly new) = 3 + 3 = 6.
#   Subsequences: "a", "b", "ab", "aa", "ba", "aba". Correct.
#
#   Update last_count['a'] = dp[2] + 1 = 3 + 1 = 4. (These 4 represent "a", "aa", "ba", "aba" formed now).
#
# Final answer: dp[3] = 6. Correct.
#
# Example: s = "aaa"
# MOD = 10^9 + 7
# last_count = {}
# dp = [0] * 4
# dp[0] = 0
#
# i = 1, s[0] = 'a'
# new_subsequences = dp[0] + 1 = 1 ("a")
# prev_count_ending_with_a = last_count.get('a', 0) = 0
# dp[1] = (0 + 1 - 0) % MOD = 1
# Update last_count['a'] = dp[0] + 1 = 1.
#
# i = 2, s[1] = 'a'
# new_subsequences = dp[1] + 1 = 1 + 1 = 2 ("a", "aa")
# prev_count_ending_with_a = last_count.get('a', 0) = 1 (from "a" formed at step 1)
# dp[2] = (dp[1] + new_subsequences - prev_count_ending_with_a) % MOD
#       = (1 + 2 - 1) % MOD = 2
#   Subsequences: "a", "aa"
# Update last_count['a'] = dp[1] + 1 = 1 + 1 = 2. (These 2 represent "a", "aa" formed now)
#
# i = 3, s[2] = 'a'
# new_subsequences = dp[2] + 1 = 2 + 1 = 3 ("a", "aa", "aaa")
# prev_count_ending_with_a = last_count.get('a', 0) = 2 (from "a", "aa" formed at step 2)
# dp[3] = (dp[2] + new_subsequences - prev_count_ending_with_a) % MOD
#       = (2 + 3 - 2) % MOD = 3
#   Subsequences: "a", "aa", "aaa"
# Update last_count['a'] = dp[2] + 1 = 2 + 1 = 3.
#
# Final answer: dp[3] = 3. Correct.
#
# Time Complexity: O(N), where N is the length of the string `s`. We iterate through the string once. Dictionary operations (get, set) are O(1) on average.
# Space Complexity: O(1) because the `last_count` dictionary will store at most 26 entries (for lowercase English letters), and the `dp` array is of size N+1. If we consider the alphabet size constant, it's O(1). If alphabet size is variable, it would be O(min(N, Sigma)) where Sigma is alphabet size. For this problem, Sigma is 26.
#
# The DP state definition can be simplified. We don't need the `dp` array explicitly storing all previous values. We only need the total count from the previous step.
#
# Let `total_distinct_subsequences` be the count of distinct non-empty subsequences for the prefix processed so far.
# Let `last_count[char]` be the number of distinct subsequences ending with `char` formed *up to the current point*.
#
# Initialize `total_distinct_subsequences = 0`.
# Initialize `last_count` as a dictionary with all values 0.
# MOD = 10^9 + 7.
#
# For each character `char` in `s`:
#
# 1. Calculate the number of *new* subsequences that will be formed by appending `char` to existing subsequences.
#    If we append `char` to all `total_distinct_subsequences` existing subsequences, we get `total_distinct_subsequences` new ones.
#    Additionally, `char` itself forms a new subsequence.
#    So, `new_ending_with_char = total_distinct_subsequences + 1`.
#
# 2. The number of subsequences that were previously counted ending with `char` is `last_count[char]`. These are the ones we need to subtract to avoid duplicates.
#    The number of *truly new* subsequences added in this step is `new_ending_with_char - last_count[char]`.
#
# 3. Update the `total_distinct_subsequences`:
#    `total_distinct_subsequences = (total_distinct_subsequences + (new_ending_with_char - last_count[char])) % MOD`.
#    Ensure positive modulo: `(total_distinct_subsequences + new_ending_with_char - last_count[char] + MOD) % MOD`.
#
# 4. Update `last_count[char]` for the *next* occurrence of `char`. The number of distinct subsequences ending with `char` *after* this step is `new_ending_with_char`.
#    `last_count[char] = new_ending_with_char % MOD`.
#
# Let's retrace "aba" with this simplified approach.
# s = "aba"
# MOD = 10^9 + 7
# total_distinct_subsequences = 0
# last_count = {} # Defaults to 0
#
# i = 0, char = 'a'
# new_ending_with_a = total_distinct_subsequences + 1 = 0 + 1 = 1. (Represents "a")
# prev_count_ending_with_a = last_count.get('a', 0) = 0.
# truly_new = new_ending_with_a - prev_count_ending_with_a = 1 - 0 = 1.
# total_distinct_subsequences = (0 + 1 + MOD) % MOD = 1.
#   Current subsequences: {"a"}
# last_count['a'] = new_ending_with_a % MOD = 1.
#
# i = 1, char = 'b'
# new_ending_with_b = total_distinct_subsequences + 1 = 1 + 1 = 2. (Represents "b", "ab")
# prev_count_ending_with_b = last_count.get('b', 0) = 0.
# truly_new = new_ending_with_b - prev_count_ending_with_b = 2 - 0 = 2.
# total_distinct_subsequences = (1 + 2 + MOD) % MOD = 3.
#   Current subsequences: {"a", "b", "ab"}
# last_count['b'] = new_ending_with_b % MOD = 2.
#
# i = 2, char = 'a'
# new_ending_with_a = total_distinct_subsequences + 1 = 3 + 1 = 4. (Represents "a", "aa", "ba", "aba")
# prev_count_ending_with_a = last_count.get('a', 0) = 1. (This '1' was the count for "a" formed earlier)
# truly_new = new_ending_with_a - prev_count_ending_with_a = 4 - 1 = 3.
# total_distinct_subsequences = (3 + 3 + MOD) % MOD = 6.
#   Current subsequences: {"a", "b", "ab", "aa", "ba", "aba"}
# last_count['a'] = new_ending_with_a % MOD = 4. (These 4 are the counts ending in 'a' *now*: "a", "aa", "ba", "aba")
#
# Final answer: total_distinct_subsequences = 6. Correct.
#
# This simplified O(N) time, O(1) space approach seems correct and more efficient.
```

class Solution:
    def distinctSubseqII(self, s: str) -> int:
        # Modulo constant for large results
        MOD = 10**9 + 7

        # `last_count` stores the number of distinct subsequences ending with a particular character.
        # Initialize with 0 for all possible lowercase English letters.
        # We use a dictionary, which will effectively default to 0 for keys not yet present.
        last_count = {}

        # `total_distinct_subsequences` stores the total number of distinct non-empty subsequences
        # formed by processing the string prefix so far.
        total_distinct_subsequences = 0

        # Iterate through each character in the input string `s`
        for char in s:
            # `new_ending_with_char`: This represents the potential number of new subsequences
            # we can form by appending the current `char` to all existing subsequences, plus
            # the `char` itself forming a new subsequence.
            # For example, if `total_distinct_subsequences` is 3 ("a", "b", "ab"), and `char` is 'c',
            # then appending 'c' would give us "ac", "bc", "abc". Including "c" itself, we have 3 + 1 = 4 potential new subsequences.
            new_ending_with_char = total_distinct_subsequences + 1

            # `prev_count_ending_with_char`: This is the number of distinct subsequences that *already* ended
            # with `char` from previous occurrences of `char` in the string. We retrieve this from `last_count`.
            # If `char` has not been seen before, `last_count.get(char, 0)` returns 0.
            prev_count_ending_with_char = last_count.get(char, 0)

            # `truly_new_subsequences`: These are the subsequences that are genuinely new and distinct
            # formed in this step. We subtract `prev_count_ending_with_char` from `new_ending_with_char`
            # because those are the subsequences that would be duplicates if we didn't account for them.
            # For example, if `new_ending_with_char` is 4 and `prev_count_ending_with_char` is 1 (meaning "a" was formed before),
            # then the truly new ones are 4 - 1 = 3.
            truly_new_subsequences = new_ending_with_char - prev_count_ending_with_char

            # Update the `total_distinct_subsequences`. We add the `truly_new_subsequences` to the
            # count of existing distinct subsequences.
            # We use `( ... + MOD) % MOD` to ensure that the result remains positive after subtraction,
            # as Python's modulo operator can return negative results for negative inputs.
            total_distinct_subsequences = (total_distinct_subsequences + truly_new_subsequences + MOD) % MOD

            # Update `last_count[char]`. This count now reflects the total number of distinct subsequences
            # ending with `char` *after* processing the current character. This value will be used
            # as `prev_count_ending_with_char` the next time this character `char` appears.
            # We take modulo here as well.
            last_count[char] = new_ending_with_char % MOD

        # The final `total_distinct_subsequences` is our answer.
        return total_distinct_subsequences

```