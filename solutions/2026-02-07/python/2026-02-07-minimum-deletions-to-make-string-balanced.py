```python
# Problem: Minimum Deletions to Make String Balanced
# Link: https://leetcode.com/problems/minimum-deletions-to-make-string-balanced/
#
# Approach:
# The problem asks for the minimum deletions to make a string balanced,
# meaning no 'b' appears before an 'a'. This implies that a balanced string
# will have a prefix of 'a's followed by a suffix of 'b's (or just all 'a's or all 'b's).
#
# We can iterate through all possible split points in the string. For each split point `i`,
# we consider the string to be divided into two parts: `s[0...i-1]` and `s[i...n-1]`.
# To make the entire string balanced, all characters in the left part must be 'a's,
# and all characters in the right part must be 'b's.
#
# The number of deletions required for a split point `i` would be:
# (number of 'b's in `s[0...i-1]`) + (number of 'a's in `s[i...n-1]`).
#
# We can optimize this by pre-calculating the number of 'b's from the left and
# the number of 'a's from the right.
#
# Let `b_count_left[i]` be the number of 'b's in `s[0...i-1]`.
# Let `a_count_right[i]` be the number of 'a's in `s[i...n-1]`.
#
# We can compute `b_count_left` in a single pass from left to right.
# We can compute `a_count_right` in a single pass from right to left.
#
# Then, for each `i` from 0 to `n` (inclusive, where `n` is the length of `s`):
# The split point `i` means `s[0...i-1]` should be 'a's and `s[i...n-1]` should be 'b's.
# Number of deletions = `b_count_left[i]` + `a_count_right[i]`.
#
# The minimum of these values over all `i` will be our answer.
#
# We can further optimize this to a single pass. As we iterate through the string
# from left to right:
# Maintain `b_count_so_far`: the number of 'b's encountered so far.
# Maintain `min_deletions`: the minimum deletions found so far.
#
# For each character `s[i]`:
# If `s[i]` is 'a':
#   The current split point is after `s[i]`. The left part has `b_count_so_far` 'b's.
#   The right part has `total_a_count - a_count_so_far` 'a's.
#   We need to delete all 'b's to the left and all 'a's to the right.
#   The number of deletions for this split point is `b_count_so_far` + (total 'a's - 'a's encountered so far).
#   `min_deletions = min(min_deletions, b_count_so_far + (total_a_count - a_count_so_far))`
# If `s[i]` is 'b':
#   Increment `b_count_so_far`.
#
# This single pass approach can be slightly tricky to get right with indices.
# A simpler single-pass DP approach:
# Let `dp[i]` be the minimum deletions to make the prefix `s[0...i-1]` balanced.
#
# This doesn't directly work because the balance depends on the whole string.
#
# Let's reconsider the split point idea.
# We can calculate `b_count_prefix[i]` = number of 'b's in `s[0...i-1]`.
# We can calculate `a_count_suffix[i]` = number of 'a's in `s[i...n-1]`.
#
# `b_count_prefix` can be computed in one pass.
# `a_count_suffix` can be computed in one pass from right to left.
#
# For string `s` of length `n`:
# `b_count_prefix` will be an array of size `n+1`. `b_count_prefix[0] = 0`.
# For `i` from 0 to `n-1`: `b_count_prefix[i+1] = b_count_prefix[i] + (1 if s[i] == 'b' else 0)`.
#
# `a_count_suffix` will be an array of size `n+1`. `a_count_suffix[n] = 0`.
# For `i` from `n-1` down to 0: `a_count_suffix[i] = a_count_suffix[i+1] + (1 if s[i] == 'a' else 0)`.
#
# Now, iterate through all possible split points `i` from 0 to `n`:
# `i` represents the first index where 'b's are allowed. The string `s[0...i-1]` must be all 'a's,
# and `s[i...n-1]` must be all 'b's.
# Deletions = (number of 'b's in `s[0...i-1]`) + (number of 'a's in `s[i...n-1]`).
# This is `b_count_prefix[i]` + `a_count_suffix[i]`.
#
# The minimum of `b_count_prefix[i] + a_count_suffix[i]` for `i` in `[0, n]` is the answer.
#
# Example: s = "aababbab", n = 8
#
# b_count_prefix:
# i=0: s[0]='a', b_count_prefix[1]=0
# i=1: s[1]='a', b_count_prefix[2]=0
# i=2: s[2]='b', b_count_prefix[3]=1
# i=3: s[3]='a', b_count_prefix[4]=1
# i=4: s[4]='b', b_count_prefix[5]=2
# i=5: s[5]='b', b_count_prefix[6]=3
# i=6: s[6]='a', b_count_prefix[7]=3
# i=7: s[7]='b', b_count_prefix[8]=4
# b_count_prefix = [0, 0, 0, 1, 1, 2, 3, 3, 4]
#
# a_count_suffix:
# i=8: a_count_suffix[8]=0
# i=7: s[7]='b', a_count_suffix[7]=0
# i=6: s[6]='a', a_count_suffix[6]=1
# i=5: s[5]='b', a_count_suffix[5]=1
# i=4: s[4]='b', a_count_suffix[4]=1
# i=3: s[3]='a', a_count_suffix[3]=2
# i=2: s[2]='b', a_count_suffix[2]=2
# i=1: s[1]='a', a_count_suffix[1]=3
# i=0: s[0]='a', a_count_suffix[0]=4
# a_count_suffix = [4, 3, 2, 2, 1, 1, 1, 0, 0]
#
# Now calculate deletions for each split point `i` (from 0 to 8):
# i=0: b_count_prefix[0] + a_count_suffix[0] = 0 + 4 = 4  (Delete all 'a's, keep "bbbb") -> "bbbb"
# i=1: b_count_prefix[1] + a_count_suffix[1] = 0 + 3 = 3  (Delete 'b' at 2, 'a' at 6, keep "aaabbb") -> "aaabbb"
# i=2: b_count_prefix[2] + a_count_suffix[2] = 0 + 2 = 2  (Delete 'a' at 6, keep "aaabbb") -> "aaabbb"
# i=3: b_count_prefix[3] + a_count_suffix[3] = 1 + 2 = 3  (Delete 'b' at 2, 'a' at 6, keep "aaabbb") -> "aaabbb"
# i=4: b_count_prefix[4] + a_count_suffix[4] = 1 + 1 = 2  (Delete 'b' at 2, 'a' at 6, keep "aaabbb") -> "aaabbb"
# i=5: b_count_prefix[5] + a_count_suffix[5] = 2 + 1 = 3  (Delete 'b' at 2, 'b' at 4, 'a' at 6, keep "aabbb") -> "aabbb"
# i=6: b_count_prefix[6] + a_count_suffix[6] = 3 + 1 = 4  (Delete 'b' at 2, 'b' at 4, 'b' at 5, 'a' at 6, keep "aabbb") -> "aabbb"
# i=7: b_count_prefix[7] + a_count_suffix[7] = 3 + 0 = 3  (Delete 'b' at 2, 'b' at 4, 'b' at 5, keep "aaabb") -> "aaabb"
# i=8: b_count_prefix[8] + a_count_suffix[8] = 4 + 0 = 4  (Delete all 'b's, keep "aaaa") -> "aaaa"
#
# Minimum is 2. This logic seems correct.
#
# Alternative: Single Pass DP
# Let `b_count` be the number of 'b's encountered so far.
# Let `min_del` be the minimum deletions to balance the prefix ending at current index.
#
# Iterate through the string:
# For `char` in `s`:
#   If `char == 'a'`:
#     We have two choices for this 'a':
#     1. Keep it as an 'a'. This 'a' might be part of the 'a' prefix. If so, it doesn't add to deletions.
#        If it's part of the 'b' suffix, we'd need to delete it.
#        Crucially, an 'a' appearing after some 'b's requires deletion of the 'b's to its left.
#        The cost of keeping this 'a' is the minimum deletions to balance the prefix *before* this 'a',
#        plus the number of 'b's encountered so far (`b_count`). This is `min_del + b_count`.
#     2. Delete it. The cost is `min_del + 1` (if we consider deleting this 'a').
#     So, `min_del = min(min_del + 1, b_count)`.
#     Why `min_del + 1`? If we decide to delete this 'a', the minimum deletions up to this point
#     is the minimum deletions for the previous part plus 1 for deleting this 'a'.
#     Why `b_count`? If we decide to keep this 'a', it must follow all previous 'a's and precede all 'b's.
#     Any 'b' before this 'a' must be deleted. So, the cost is `b_count`.
#   If `char == 'b'`:
#     This 'b' can either be part of the 'b' suffix or be deleted.
#     If we keep it as part of the 'b' suffix, it doesn't add to deletions *yet*.
#     We simply increment `b_count`. The minimum deletions (`min_del`) remains the same as the previous step,
#     because this 'b' doesn't immediately force a deletion decision that changes `min_del`.
#     The decision of whether to delete this 'b' is implicitly handled when we encounter an 'a' later.
#     The `min_del` is the minimum cost to balance the prefix. When we see a 'b', it can always be part of the 'b' suffix
#     or be deleted later. So, `min_del` doesn't change. `b_count` increases.
#
# Let's re-evaluate the single pass.
# We want to achieve a state where `s[0...i-1]` are 'a's and `s[i...n-1]` are 'b's.
#
# Consider processing the string from left to right. At each position `i`, we are trying to decide
# the minimum deletions to make `s[0...i]` balanced.
#
# Let `ones` be the count of 'b's encountered so far.
# Let `deletions` be the minimum deletions to make the prefix `s[0...i-1]` balanced.
#
# When `s[i] == 'a'`:
#   We have two options for this 'a':
#   1. It's part of the 'a' prefix. This means all preceding 'b's must be deleted. Cost = `deletions` (cost before this 'a') + `ones` (delete all 'b's before this 'a').
#   2. It's an 'a' that we delete. Cost = `deletions` (cost before this 'a') + 1 (delete this 'a').
#   So, `deletions = min(deletions + 1, ones)`.
# When `s[i] == 'b'`:
#   This 'b' can be part of the 'b' suffix. It doesn't force an immediate deletion from the perspective
#   of the minimum deletions needed *so far*. We just increment `ones`. The `deletions` variable
#   represents the minimum deletions for a balanced prefix ending *before* this 'b', assuming it's part of the 'b' suffix.
#   If this 'b' is to be deleted, it will be accounted for by an 'a' appearing later.
#   So, `ones += 1`. `deletions` remains unchanged for this step.
#
# Initialize `ones = 0` and `deletions = 0`.
#
# Example: s = "aababbab"
# i=0, s[0]='a': deletions = min(0 + 1, 0) = 0. ones = 0.
# i=1, s[1]='a': deletions = min(0 + 1, 0) = 0. ones = 0.
# i=2, s[2]='b': ones = 0 + 1 = 1. deletions = 0.
# i=3, s[3]='a': deletions = min(0 + 1, 1) = 1. ones = 1.
# i=4, s[4]='b': ones = 1 + 1 = 2. deletions = 1.
# i=5, s[5]='b': ones = 2 + 1 = 3. deletions = 1.
# i=6, s[6]='a': deletions = min(1 + 1, 3) = 2. ones = 3.
# i=7, s[7]='b': ones = 3 + 1 = 4. deletions = 2.
#
# Final answer is `deletions = 2`. This single-pass DP seems correct.
#
# Time Complexity: O(N), where N is the length of the string s. We iterate through the string once.
# Space Complexity: O(1). We only use a few variables to store counts and minimum deletions.
#
# Let's consider the edge cases and interpretation of `deletions`.
# `deletions` at step `i` is the minimum deletions to make `s[0...i-1]` balanced.
#
# If `s[i] == 'a'`:
#   To balance `s[0...i]`:
#   Option 1: Delete this 'a'. The cost is `deletions_before_i` + 1.
#   Option 2: Keep this 'a'. This 'a' must be part of the 'a' prefix. This implies all 'b's
#             in `s[0...i-1]` must be deleted. The cost is `deletions_before_i_but_only_deleting_b` + `ones_before_i`.
#             The variable `deletions` already stores the minimum deletions to make the prefix balanced.
#             If we see an 'a', and `deletions` is the minimum cost to balance the previous part,
#             then either we delete this 'a' (cost `deletions + 1`), or we keep it. If we keep it,
#             it must follow all 'a's. So all 'b's before it must be deleted. The number of 'b's
#             seen so far is `ones`. So, the cost if we keep this 'a' is `ones`.
#             Therefore, `deletions = min(deletions + 1, ones)`.
#
# If `s[i] == 'b'`:
#   This 'b' can be part of the 'b' suffix, or it can be deleted.
#   If it's part of the 'b' suffix, it doesn't affect the `deletions` for the prefix `s[0...i]`.
#   The `deletions` variable represents the minimum deletions to make `s[0...i]` balanced.
#   If we see a 'b', this 'b' can always be part of the target 'b' suffix, or it will be deleted
#   because of some future 'a'. So the minimum deletions required up to this point, assuming
#   this 'b' could be part of the suffix, is the same as the minimum deletions for the previous prefix.
#   However, `ones` must be incremented to count this 'b' for future 'a's.
#   So, `ones += 1`. `deletions` remains `deletions`.
#
# Let's trace "bbaaaaabb" again:
# ones = 0, deletions = 0
# i=0, s[0]='b': ones = 1, deletions = 0.
# i=1, s[1]='b': ones = 2, deletions = 0.
# i=2, s[2]='a': deletions = min(0 + 1, 2) = 1. ones = 2.
# i=3, s[3]='a': deletions = min(1 + 1, 2) = 2. ones = 2.
# i=4, s[4]='a': deletions = min(2 + 1, 2) = 2. ones = 2.
# i=5, s[5]='a': deletions = min(2 + 1, 2) = 2. ones = 2.
# i=6, s[6]='a': deletions = min(2 + 1, 2) = 2. ones = 2.
# i=7, s[7]='b': ones = 2 + 1 = 3. deletions = 2.
# i=8, s[8]='b': ones = 3 + 1 = 4. deletions = 2.
#
# Final answer: 2. Correct.
#
# This single pass approach seems robust and efficient.
#
# Consider the split point approach one last time for clarity.
# Let `n = len(s)`
# Precompute `b_counts_prefix[i]`: number of 'b's in `s[0...i-1]`
# Precompute `a_counts_suffix[i]`: number of 'a's in `s[i...n-1]`
#
# Initialize `min_del = n` (worst case: delete all characters)
#
# For `i` from 0 to `n`:
#   # `i` is the index where the 'b' part starts.
#   # `s[0...i-1]` should be 'a's, `s[i...n-1]` should be 'b's.
#   # Deletions needed = (b's in prefix) + (a's in suffix)
#   `current_del = b_counts_prefix[i] + a_counts_suffix[i]`
#   `min_del = min(min_del, current_del)`
#
# This is O(N) for precomputation and O(N) for the final loop, so O(N) time.
# This is O(N) space for the prefix and suffix arrays.
#
# The single pass O(1) space solution is preferred.

class Solution:
    def minimumDeletions(self, s: str) -> int:
        # Initialize `ones` to count the number of 'b's encountered so far.
        # Initialize `deletions` to store the minimum deletions needed to balance the prefix processed so far.
        # Initially, the string is empty, so no 'b's and no deletions needed.
        ones = 0
        deletions = 0

        # Iterate through each character in the string.
        for char in s:
            # If the current character is 'a':
            # We have two choices to maintain a balanced string ending at this point:
            # 1. Delete this 'a'. The total deletions would be the minimum deletions
            #    for the prefix *before* this 'a', plus 1 for deleting this 'a'.
            #    This is `deletions + 1`.
            # 2. Keep this 'a'. For the string to remain balanced, this 'a' must be
            #    part of the 'a' prefix. This implies all preceding 'b's must be deleted.
            #    The number of preceding 'b's is `ones`. So, the cost for this option
            #    is the count of 'b's encountered so far (`ones`).
            # We take the minimum of these two options for `deletions`.
            if char == 'a':
                deletions = min(deletions + 1, ones)
            # If the current character is 'b':
            # This 'b' can either be part of the 'b' suffix or be deleted.
            # If it's part of the 'b' suffix, it doesn't immediately increase the minimum
            # deletions required for the prefix processed so far. The `deletions` value
            # will still represent the minimum deletions to balance the prefix, considering
            # that this 'b' could potentially be part of the valid 'b' suffix.
            # We simply increment `ones` to count this 'b' for future 'a's.
            # The actual decision of whether to delete this 'b' is deferred; it will be
            # accounted for when we encounter an 'a' later that is placed after this 'b'.
            elif char == 'b':
                ones += 1

        # After iterating through the entire string, `deletions` holds the minimum
        # number of deletions required to make the entire string balanced.
        return deletions

```