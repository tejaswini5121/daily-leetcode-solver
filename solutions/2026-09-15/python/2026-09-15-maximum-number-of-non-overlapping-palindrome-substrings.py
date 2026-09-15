```python
# Problem: Maximum Number of Non-overlapping Palindrome Substrings
# Link: https://leetcode.com/problems/maximum-number-of-non-overlapping-palindrome-substrings/
# Approach:
# This problem can be solved using dynamic programming or a greedy approach.
# The greedy approach works by iterating through the string and trying to find the shortest possible palindrome substring of length at least k.
# If such a palindrome is found, we select it and then recursively try to find the next non-overlapping palindrome from the remaining part of the string.
# To efficiently check for palindromes, we can precompute all possible palindrome substrings or check them on the fly.
# For checking palindromes on the fly, we can expand from the center for each possible center (a single character or between two characters).
#
# The greedy strategy is to always pick the leftmost valid palindrome. This is because picking a leftmost palindrome of a certain length leaves the maximum possible suffix for further palindrome selection.
#
# Let dp[i] be the maximum number of non-overlapping palindrome substrings we can form using the prefix s[:i].
#
# Base case: dp[0] = 0
#
# For each index i from k to n (length of s):
#   dp[i] = dp[i-1] (option to not include s[i-1] in any palindrome)
#   Iterate through possible start indices j from 0 to i-k:
#     If the substring s[j:i] is a palindrome of length at least k:
#       dp[i] = max(dp[i], dp[j] + 1)
#
# This DP approach has a time complexity of O(n^3) due to substring slicing and palindrome checking.
#
# A more optimized approach uses a greedy strategy combined with efficient palindrome checking.
# We can iterate through the string and for each position `i`, check if there's a palindrome ending at `i` with length at least `k`.
# If we find such a palindrome `s[j:i+1]`, we can potentially form a new valid selection.
# We maintain a `count` of selected palindromes and the `last_end_index` of the last selected palindrome.
# We iterate from left to right. For each `i`, we look for palindromes ending at `i`.
# If `s[j:i+1]` is a palindrome of length >= k, and `j >= last_end_index`, we can potentially select it.
# To ensure we pick the best leftmost palindrome, we can precompute all palindromic substrings or check on the fly.
#
# An even more efficient greedy approach:
# Iterate through the string. For each character `s[i]`, check if it can be the end of a palindrome of length `k` or `k+1`.
# If `s[i-k+1 : i+1]` is a palindrome (length k), we can potentially select it.
# If `s[i-k : i+1]` is a palindrome (length k+1), we can potentially select it.
# If we find such a palindrome ending at `i`, we increment our count and advance our `i` to `i+1` (since the next palindrome cannot overlap).
#
# Let's use an O(N^2) approach for palindrome checking and a greedy strategy.
# We will iterate through the string and at each position `i`, we check for palindromes ending at `i`.
#
# For each `i` from `k-1` to `n-1`:
#   Check if `s[i-k+1 : i+1]` is a palindrome. If yes, we can potentially make a cut here.
#   Check if `s[i-k : i+1]` is a palindrome. If yes, we can potentially make a cut here.
#   If we find a palindrome ending at `i` of length >= k, we increment our count and skip `k` characters (to ensure non-overlapping).
#
# Example: s = "abaccdbbd", k = 3
# n = 9
#
# i = 2 (k-1): s[0:3] = "aba" is palindrome. count = 1, i becomes 2 + k = 5
# i = 5: s[5:8] = "dbb" not palindrome. s[4:8] = "cdbb" not palindrome.
# i = 6: s[6:9] = "bbd" not palindrome. s[5:9] = "dbbd" is palindrome. count = 2, i becomes 6 + k = 9.
# Loop ends. Output: 2
#
# This greedy approach with O(N^2) palindrome check:
# Time Complexity: O(N^2) for palindrome checking within the loop.
# Space Complexity: O(1) besides input string.
#
# Let's refine the greedy approach.
# We want to find the maximum number of non-overlapping palindromes of length at least k.
# Iterate through the string. Maintain `count` of palindromes and `last_end` index.
# For `i` from `k-1` to `n-1`:
#   Check for palindromes ending at `i` with length `k` or `k+1`.
#   A palindrome ending at `i` with length `l` starts at `i - l + 1`.
#   We only care if `i - l + 1 >= last_end`.
#
# Function to check if substring s[start:end+1] is a palindrome:
# def is_palindrome(s, start, end):
#     while start < end:
#         if s[start] != s[end]:
#             return False
#         start += 1
#         end -= 1
#     return True
#
# Initialize count = 0
# Initialize last_end = 0
# For i from k-1 to n-1:
#   If i - (k-1) >= last_end and is_palindrome(s, i - k + 1, i):
#     count += 1
#     last_end = i + 1
#     continue # Move to the next possible start after this palindrome
#   If i - k >= last_end and is_palindrome(s, i - k, i):
#     count += 1
#     last_end = i + 1
#     continue # Move to the next possible start after this palindrome
#
# This greedy strategy needs to be careful about picking the "best" palindrome if multiple exist ending at `i`.
# The optimal greedy choice is to find ANY valid palindrome ending at `i` and then immediately restart the search from `i+1`.
#
# Let's simplify the greedy choice. Iterate through the string. If we find a palindrome of length at least `k` that starts *after* our last selected palindrome's end, we select it.
#
# Example: s = "abaccdbbd", k = 3
# n = 9
#
# i = 0, 1, 2:
#   At i=2: Check for palindromes ending at 2.
#   Length 3: s[0:3] = "aba". It's a palindrome. Starts at 0. Current last_end = 0. 0 >= 0. Select "aba".
#   count = 1. last_end = 3.
#   Continue outer loop from i = 3.
#
# i = 3, 4, 5:
#   At i=5: Check for palindromes ending at 5.
#   Length 3: s[3:6] = "ccd". Not palindrome.
#   Length 4: s[2:6] = "accd". Not palindrome.
#   Length 5: s[1:6] = "baccd". Not palindrome.
#   Length 6: s[0:6] = "abaccd". Not palindrome.
#
# This is not quite right. We need to check all possible palindrome lengths ending at `i`.
#
# Let's use DP.
# dp[i]: max number of non-overlapping palindromes in s[0...i-1].
# dp[0] = 0
#
# For i from 1 to n:
#   dp[i] = dp[i-1]  # Option to not end a palindrome at i-1
#   For j from 0 to i-k:
#     # Check if s[j...i-1] is a palindrome and its length (i-j) is >= k
#     if (i - j >= k) and is_palindrome(s, j, i-1):
#       dp[i] = max(dp[i], dp[j] + 1)
#
# This DP is O(N^3) due to string slicing/palindrome check inside nested loops.
#
# Optimized DP with O(N^2) palindrome check:
# Precompute is_palindrome[i][j] for all substrings s[i...j]. This takes O(N^2).
#
# is_palindrome_table = [[False] * n for _ in range(n)]
#
# For length = 1 to n:
#   For i = 0 to n - length:
#     j = i + length - 1
#     if length == 1:
#       is_palindrome_table[i][j] = True
#     elif length == 2:
#       is_palindrome_table[i][j] = (s[i] == s[j])
#     else:
#       is_palindrome_table[i][j] = (s[i] == s[j]) and is_palindrome_table[i+1][j-1]
#
# dp = [0] * (n + 1)
#
# For i from 1 to n:
#   dp[i] = dp[i-1] # Don't take a palindrome ending at i-1
#   For j from 0 to i-k:
#     # Check if substring s[j...i-1] is a palindrome of length at least k
#     if (i - j >= k) and is_palindrome_table[j][i-1]:
#       dp[i] = max(dp[i], dp[j] + 1)
#
# Return dp[n]
#
# This DP approach is O(N^2) time complexity due to precomputation and the DP transition.
# Space complexity is O(N^2) for the palindrome table.

# Greedy Approach with optimized palindrome check (O(N^2) overall):
# The core idea is to iterate through the string and find the earliest possible palindromic substring of length at least k.
# Once found, we "take" it and then continue searching for the next palindrome from the character immediately following the end of the taken palindrome.
#
# `count` will store the number of non-overlapping palindromes found.
# `last_end_index` will store the index immediately after the end of the last found palindrome.
#
# We iterate `i` from `k-1` to `n-1` (inclusive). This `i` represents the potential end index of a palindrome.
# For each `i`, we check two possibilities for palindromes of length exactly `k` and `k+1` ending at `i`.
# 1. Palindrome of length `k`: starts at `i - k + 1`.
# 2. Palindrome of length `k+1`: starts at `i - k`.
#
# If we find such a palindrome `s[start:i+1]` where `start >= last_end_index`, we can select it.
# We increment `count`, update `last_end_index` to `i + 1`, and crucially, we can then continue our search for the next palindrome from index `i + 1`. This is because any palindrome starting before `i+1` would overlap.
# The logic for `continue` is to effectively "jump" `i` forward. Instead of `i++`, if we find a palindrome ending at `i`, the next potential start for a palindrome is `i+1`.
# The loop `for i in range(k - 1, n):` implicitly handles `i++`. If we find a valid palindrome, we should consider the next character `i+1` as the earliest possible start of the *next* palindrome.
#
# Example: s = "abaccdbbd", k = 3, n = 9
#
# last_end_index = 0, count = 0
#
# i = 2 (k-1):
#   Check length k=3: s[0:3] = "aba". Palindrome. start = 0. 0 >= last_end_index (0).
#     Select "aba". count = 1. last_end_index = 2 + 1 = 3.
#     We found a palindrome ending at index 2. The next search can effectively begin from index 3.
#     The loop will naturally go to i=3 next.
#
# i = 3: No length k=3 or k+1=4 palindrome ending at 3 that starts at or after last_end_index (3).
# i = 4: No length k=3 or k+1=4 palindrome ending at 4 that starts at or after last_end_index (3).
# i = 5:
#   Check length k=3: s[3:6] = "ccd". Not palindrome.
#   Check length k+1=4: s[2:6] = "accd". Not palindrome.
#
# i = 6:
#   Check length k=3: s[4:7] = "cdb". Not palindrome.
#   Check length k+1=4: s[3:7] = "ccdb". Not palindrome.
#   Wait, the logic needs to be more comprehensive.
#   We need to check ALL palindromes of length >= k ending at `i`.
#
# Let's reconsider the DP:
# dp[i] = max number of palindromes in s[:i]
# dp[i] = dp[i-1] (don't use s[i-1])
# For `j` from `0` to `i-k`: if `s[j:i]` is a palindrome of length `>=k`, then `dp[i] = max(dp[i], dp[j] + 1)`.
#
# This DP is O(N^3). To optimize, we can precompute palindromes.
#
# Palindrome check helper function:
def is_palindrome(s: str, start: int, end: int) -> bool:
    while start < end:
        if s[start] != s[end]:
            return False
        start += 1
        end -= 1
    return True

# DP approach with O(N^2) precomputation for palindromes
# Time Complexity: O(N^2) for palindrome table + O(N^2) for DP = O(N^2)
# Space Complexity: O(N^2) for palindrome table + O(N) for DP = O(N^2)

class Solution:
    def maxNonOverlapping(self, s: str, k: int) -> int:
        n = len(s)
        
        # is_palindrome_table[i][j] will be True if s[i...j] is a palindrome
        is_palindrome_table = [[False] * n for _ in range(n)]
        
        # Precompute all palindromic substrings
        # Base cases: length 1 and 2
        for i in range(n):
            is_palindrome_table[i][i] = True # Single characters are palindromes
        
        for i in range(n - 1):
            if s[i] == s[i+1]:
                is_palindrome_table[i][i+1] = True # Two identical characters are palindromes
        
        # Fill for lengths 3 to n
        for length in range(3, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1 # End index of the substring
                # A substring s[i...j] is a palindrome if s[i] == s[j]
                # AND the inner substring s[i+1...j-1] is also a palindrome
                if s[i] == s[j] and is_palindrome_table[i+1][j-1]:
                    is_palindrome_table[i][j] = True
        
        # dp[i] will store the maximum number of non-overlapping palindromes in s[0...i-1]
        dp = [0] * (n + 1)
        
        # Iterate through the string to fill the DP table
        for i in range(1, n + 1):
            # Option 1: Don't include s[i-1] in any palindrome ending at i-1.
            # The maximum count is the same as for s[0...i-2].
            dp[i] = dp[i-1]
            
            # Option 2: Try to form a palindrome ending at index i-1.
            # We check all possible start indices `j` such that the substring s[j...i-1]
            # has length at least k.
            # The start index `j` must be at least 0.
            # The length of s[j...i-1] is (i-1) - j + 1 = i - j.
            # So we need i - j >= k, which means j <= i - k.
            # The start index `j` for the previous DP state would be `j`.
            
            for j in range(i - k + 1): # j goes from 0 up to i-k
                # If the substring s[j...i-1] is a palindrome and its length is >= k
                if is_palindrome_table[j][i-1]:
                    # We can form a palindrome s[j...i-1] and add it to the count
                    # from the prefix s[0...j-1].
                    # The number of palindromes would be dp[j] (for s[0...j-1]) + 1 (for s[j...i-1]).
                    dp[i] = max(dp[i], dp[j] + 1)
        
        return dp[n]

# Greedy approach with O(N^2) palindrome check on the fly.
# Time Complexity: O(N^2)
# Space Complexity: O(1)
class SolutionGreedy:
    def maxNonOverlapping(self, s: str, k: int) -> int:
        n = len(s)
        count = 0
        # `last_end_index` marks the index immediately after the end of the last selected palindrome.
        # The next palindrome must start at an index >= `last_end_index`.
        last_end_index = 0
        
        # Iterate through all possible end indices `i` for a palindrome.
        # A palindrome of length at least `k` ending at `i` must start at an index `start` such that `i - start + 1 >= k`.
        # The smallest possible start index is `i - k + 1`.
        # So, we only need to consider `i` from `k-1` up to `n-1`.
        for i in range(k - 1, n):
            # Check for palindromes of length exactly k ending at i.
            # Start index: i - k + 1.
            start_k = i - k + 1
            if start_k >= last_end_index: # Ensure non-overlap
                if is_palindrome(s, start_k, i):
                    count += 1
                    last_end_index = i + 1 # Next palindrome must start after this one
                    continue # Move to the next `i` to avoid overlapping checks with current `i`
                              # This `continue` is important for greedy. Once we find a palindrome ending at `i`,
                              # we "commit" to it and restart the search for the *next* palindrome from index `i+1`.
                              # The loop structure naturally moves `i` to `i+1`.
            
            # Check for palindromes of length exactly k+1 ending at i.
            # Start index: i - k.
            # This check is only relevant if we didn't find a length k palindrome or if the length k one was too early.
            # The check `start_k_plus_1 >= last_end_index` is implicitly handled by checking `start_k_plus_1` and then `start_k`.
            # If both are valid, which one do we pick? The greedy strategy is to pick the one that ends earliest.
            # However, here we are checking ending at `i`.
            # If we find a palindrome of length k, we take it and `continue`. This implicitly prioritizes shorter palindromes if both k and k+1 are valid.
            # This is correct because a shorter palindrome leaves more suffix for future palindromes.
            start_k_plus_1 = i - k
            if start_k_plus_1 >= last_end_index: # Ensure non-overlap
                if is_palindrome(s, start_k_plus_1, i):
                    count += 1
                    last_end_index = i + 1
                    # No `continue` here because if we found a length k+1 palindrome, we might have missed a length k one.
                    # However, the structure of the loop and the `continue` in the first `if` block ensures that we don't double count.
                    # If the length k palindrome was found, `continue` would have been executed.
                    # If length k was not found, but length k+1 is found, we take it.

        # The greedy approach above needs to iterate through ALL possible palindromes of length >= k ending at `i`
        # and pick the one that starts earliest, IF it doesn't overlap with `last_end_index`.
        # A simpler greedy approach is to iterate and for each position `i`, check if `s[i:i+k]` or `s[i:i+k+1]` is a palindrome.
        # If yes, take it, increment count, and advance `i` by `k` or `k+1`.
        
        # Let's try a simpler greedy approach again, focusing on the `last_end_index`.
        count = 0
        last_end_index = 0 # This is the index where the next palindrome can START.
        
        # Iterate through potential start indices `i` of palindromes.
        for i in range(n):
            # If `i` is already beyond or at the `last_end_index`, we can start searching for a new palindrome from here.
            if i >= last_end_index:
                # Check for a palindrome of length k starting at `i`.
                # End index would be `i + k - 1`.
                end_k = i + k - 1
                if end_k < n and is_palindrome(s, i, end_k):
                    count += 1
                    last_end_index = end_k + 1 # The next palindrome must start after `end_k`.
                    # We found the earliest possible palindrome of length `k` starting at or after `last_end_index`.
                    # We commit to this one and continue search from `end_k + 1`.
                    # The outer loop `for i in range(n)` will naturally increment `i`.
                    # We don't need to explicitly jump `i` here. `last_end_index` correctly handles skipping.
                    
                # If a palindrome of length k was not found starting at `i`, check for length k+1.
                # End index would be `i + k`.
                else: # This `else` is crucial: if a length k palindrome was found, we don't check for k+1 starting at the same `i`.
                    end_k_plus_1 = i + k
                    if end_k_plus_1 < n and is_palindrome(s, i, end_k_plus_1):
                        count += 1
                        last_end_index = end_k_plus_1 + 1
                        
        return count

# The DP approach with O(N^2) precomputation is robust and guaranteed correct.
# Let's stick with the DP. The greedy approaches can be tricky to get right for all cases.

# Final plan: Implement the O(N^2) DP solution with precomputed palindrome table.

```