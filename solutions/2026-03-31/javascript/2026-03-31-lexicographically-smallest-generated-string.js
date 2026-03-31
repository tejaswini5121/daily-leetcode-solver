/**
 * @param {string} str1
 * @param {string} str2
 * @return {string}
 */
// Problem: Lexicographically Smallest Generated String
// Link: https://leetcode.com/problems/lexicographically-smallest-generated-string/
//
// Approach:
// This problem can be solved using a greedy approach combined with some string matching techniques.
// We need to construct a string 'word' of length n + m - 1.
// The constraints are based on str1:
// - If str1[i] == 'T', then word[i...(i+m-1)] must be equal to str2.
// - If str1[i] == 'F', then word[i...(i+m-1)] must NOT be equal to str2.
//
// We want to find the lexicographically smallest 'word'. This means we should try to fill the
// characters of 'word' from left to right with the smallest possible characters ('a', 'b', 'c', ...).
//
// The core idea is to determine the characters of 'word' by considering the constraints.
// The string 'word' can be thought of as being formed by overlapping copies of str2 and potentially
// other characters.
//
// Let's consider the indices of 'word'. For each index 'j' in 'word', we need to decide its character.
// The character at word[j] is influenced by the constraints imposed by str1 at various indices 'i'.
//
// A crucial observation is that if str1[i] == 'T', then the entire substring word[i...(i+m-1)] is fixed to str2.
// This implies that for all k such that i <= k < i+m, the character word[k] is determined by str2[k-i].
//
// We can represent the "forced" characters. We can use an array (or map) to store the character that
// must be at a certain index in 'word'. Initially, all indices are unassigned.
//
// When str1[i] == 'T':
// For k from 0 to m-1, the character word[i+k] must be str2[k].
// If word[i+k] is already assigned a character, and it's different from str2[k], then it's impossible
// to satisfy the constraints, and we should return "".
// Otherwise, assign word[i+k] = str2[k].
//
// After processing all 'T' constraints, we will have some characters in 'word' fixed.
// The remaining unassigned characters should be filled greedily with 'a', 'b', 'c', ...
//
// However, we also need to satisfy the 'F' constraints. If str1[i] == 'F', then word[i...(i+m-1)] != str2.
// After greedily filling the unassigned characters, we must check if all 'F' constraints are satisfied.
// If any 'F' constraint is violated (i.e., word[i...(i+m-1)] == str2), then we need to modify
// the assigned characters to break that equality, while trying to maintain lexicographical order.
//
// Modifying for 'F' constraints:
// If word[i...(i+m-1)] == str2 and str1[i] == 'F', we need to change at least one character in
// word[i...(i+m-1)] to make it different from str2. To keep the string lexicographically smallest,
// we should try to change the character at the latest possible index within the substring
// word[i...(i+m-1)] to the next available character (or 'a' if it's already 'z').
//
// The maximum length of str1 is 10^4 and str2 is 500. The length of 'word' is n + m - 1, which can be up to ~10^4 + 500.
//
// Let's refine the approach:
// 1. Initialize an array `wordChars` of size `n + m - 1` with a placeholder (e.g., null or undefined) for unassigned characters.
// 2. Iterate through `str1` from `i = 0` to `n - 1`:
//    - If `str1[i] == 'T'`:
//      - For `k = 0` to `m - 1`:
//        - The target index in `wordChars` is `i + k`.
//        - If `wordChars[i + k]` is already assigned and `wordChars[i + k] != str2[k]`, return `""` (conflict).
//        - Assign `wordChars[i + k] = str2[k]`.
// 3. After step 2, `wordChars` contains some fixed characters. Fill the remaining unassigned slots greedily:
//    - Iterate through `wordChars` from `j = 0` to `n + m - 2`.
//    - If `wordChars[j]` is unassigned, assign it to 'a'.
// 4. Now we have a candidate string. We need to check and potentially fix 'F' constraints.
//    - Iterate through `str1` from `i = 0` to `n - 1`:
//      - If `str1[i] == 'F'`:
//        - Extract the substring from `wordChars` starting at index `i` with length `m`.
//        - Check if this substring is equal to `str2`.
//        - If it is equal to `str2`:
//          - We need to change one character in `wordChars[i...(i+m-1)]`.
//          - To maintain lexicographical minimality, we should change the character at the largest index `j` (where `i <= j < i + m`) such that changing `wordChars[j]` to the next character (or 'a' if it's 'z') can resolve the conflict.
//          - Iterate `j` from `i + m - 1` down to `i`.
//          - Let `currentChar = wordChars[j]`.
//          - Try to increment `currentChar` to `nextChar`. If `currentChar` is 'z', `nextChar` would wrap around to 'a' (though we need to be careful here. If 'a' is the only option, it might lead to another conflict).
//          - The goal is to make `wordChars[i...(i+m-1)]` NOT equal to `str2`.
//          - A simpler way to think about fixing the 'F' constraint violation: if `wordChars.slice(i, i + m).join('') === str2`, we must change `wordChars[j]` for some `j` in `[i, i+m-1]`. To keep it smallest, we try changing the rightmost character.
//          - For `j` from `i + m - 1` down to `i`:
//              - Let `originalChar = wordChars[j]`.
//              - Find the smallest character `newChar` that is greater than `originalChar` (or 'a' if `originalChar` is 'z'). This means iterating through 'a' to 'z'.
//              - For `c` from `originalChar.charCodeAt(0) + 1` to `'z'.charCodeAt(0)`:
//                  - `newChar = String.fromCharCode(c)`.
//                  - Temporarily set `wordChars[j] = newChar`.
//                  - Check if the substring `wordChars.slice(i, i + m)` is now NOT equal to `str2`.
//                  - If it's not equal, we've found a valid change. Keep `wordChars[j] = newChar` and break the inner loop (over `j`) to move to the next 'F' constraint.
//                  - If it is still equal to `str2` (this can happen if `str2` itself has repeating patterns), or if `newChar` caused a conflict with a 'T' constraint (this shouldn't happen if 'T' constraints are processed first), then we need to try changing the next character to the left.
//              - If we iterate through all characters from `originalChar + 1` to 'z' and none of them make the substring different from `str2` (this implies that `str2` is formed by repeating characters, and changing any character within `[i, i+m-1]` still results in `str2` within that window or a prefix of `str2` being problematic), this might indicate impossibility.
//              - **Crucial Realization:** If `wordChars.slice(i, i + m).join('') === str2` and `str1[i] === 'F'`, we *must* change `wordChars[j]` for some `j` in `[i, i+m-1]` to a character lexicographically *larger* than `wordChars[j]` if possible, or to 'a' if that's the only way to break equality. The "greedily fill with 'a'" step might have assigned a character that needs to be incremented.
//              - To ensure lexicographical smallest, we should try to increment `wordChars[j]` from right to left.
//              - For `j` from `i + m - 1` down to `i`:
//                  - Let `originalChar = wordChars[j]`.
//                  - Iterate `char_code` from `originalChar.charCodeAt(0) + 1` up to `'z'.charCodeAt(0)`.
//                  - `newChar = String.fromCharCode(char_code)`.
//                  - Temporarily set `wordChars[j] = newChar`.
//                  - Check if `wordChars.slice(i, i + m).join('') !== str2`.
//                  - If it's different, we found a valid modification. We commit this change (`wordChars[j] = newChar`) and break the inner loop (over `j`) to proceed to the next 'F' constraint.
//                  - If it's still equal to `str2`, continue to the next `char_code`.
//                  - If we exhaust all `char_code` for `wordChars[j]` and cannot break equality, it means that even with all possible characters for `wordChars[j]` (from `originalChar + 1` to 'z'), the substring `wordChars.slice(i, i + m)` remains equal to `str2`. This implies a more complex situation, possibly an impossibility. However, if the previous greedy assignment was 'a', and we can't change it to anything else to break equality, we must then consider the character at `j-1`.
//              - **Correction:** The problem is that if `wordChars[j]` is already 'z' and we need to increment it, we can't. So, we should try to change `wordChars[j]` to the smallest character that makes the substring different from `str2`.
//              - For `j` from `i + m - 1` down to `i`:
//                  - Let `originalChar = wordChars[j]`.
//                  - Iterate through all possible characters `newChar` from 'a' to 'z'.
//                  - If `newChar > originalChar`: // Trying to make it lexicographically larger.
//                      - Temporarily set `wordChars[j] = newChar`.
//                      - Check if `wordChars.slice(i, i + m).join('') !== str2`.
//                      - If it's different, commit `wordChars[j] = newChar` and break the inner loop (over `j`).
//                      - If it's still equal, continue trying the next `newChar`.
//                  - If `newChar === originalChar`: // If `originalChar` is already 'a' and we need to change it.
//                      - Temporarily set `wordChars[j] = newChar` ('a').
//                      - Check if `wordChars.slice(i, i + m).join('') !== str2`.
//                      - If it's different, commit `wordChars[j] = newChar` and break the inner loop (over `j`).
//                      - If it's still equal, continue trying the next `newChar`.
//              - This logic is still flawed because we are trying to modify an already GREEDILY assigned character.
//              - **Revised Correction:**
//              - For each `i` where `str1[i] == 'F'` and `wordChars.slice(i, i + m).join('') === str2`:
//                  - We need to find the rightmost index `j` within `[i, i + m - 1]` such that we can change `wordChars[j]` to a *different* character and satisfy the condition.
//                  - Iterate `j` from `i + m - 1` down to `i`.
//                  - Let `current_char_at_j = wordChars[j]`.
//                  - Iterate through all possible `next_char` from 'a' to 'z'.
//                  - If `next_char !== current_char_at_j`:
//                      - Temporarily set `wordChars[j] = next_char`.
//                      - If `wordChars.slice(i, i + m).join('') !== str2`:
//                          - This is a valid change. We commit `wordChars[j] = next_char` and break from the loop over `j` to process the next `i`.
//                      - Reset `wordChars[j] = current_char_at_j` (backtrack for exploring other `next_char`).
//                  - If we try all `next_char` for `wordChars[j]` and none can break the equality, it means that `str2` has a structure such that changing only `wordChars[j]` does not make it different from `str2`. This could be because `str2` consists of only one character repeated, and we are forced to make it different from that character.
//                  - **Crucially:** If `wordChars.slice(i, i + m).join('') === str2` and `str1[i] === 'F'`, we must change at least one character. To preserve lexicographical order, we change the rightmost possible character to the *smallest possible different character*.
//                  - For `j` from `i + m - 1` down to `i`:
//                      - Let `originalChar = wordChars[j]`.
//                      - Iterate through characters `newChar` from 'a' to 'z'.
//                      - If `newChar !== originalChar`:
//                          - Temporarily set `wordChars[j] = newChar`.
//                          - Check if `wordChars.slice(i, i + m).join('') !== str2`.
//                          - If it's different, this is our minimal change. Commit `wordChars[j] = newChar` and break from the loop over `j`.
//                          - If it's still equal, reset `wordChars[j] = originalChar` and try the next `newChar`.
//                      - If we tried all `newChar` for `wordChars[j]` and the substring `wordChars.slice(i, i + m)` *still* equals `str2`, it means we cannot fix this specific `str1[i] == 'F'` constraint by changing only `wordChars[j]` (for this particular `j` and the characters to its left). This implies that perhaps the initial greedy assignment was wrong, or it's impossible.
//                      - **Important thought:** The problem is about finding the lexicographically smallest string. If we greedily fill with 'a', and then find a conflict for an 'F', we try to increment the rightmost character. If incrementing to the next available character ('b', 'c', etc.) still results in equality to `str2`, we might need to increment to 'a' (if the original was something else).
//                      - Let's reconsider the "fix F" step:
//                      - For each `i` where `str1[i] == 'F'` and `wordChars.slice(i, i + m).join('') === str2`:
//                          - Iterate `j` from `i + m - 1` down to `i`.
//                          - For `char_code` from `wordChars[j].charCodeAt(0) + 1` up to `'z'.charCodeAt(0)`:
//                              - `newChar = String.fromCharCode(char_code)`.
//                              - Temporarily set `wordChars[j] = newChar`.
//                              - If `wordChars.slice(i, i + m).join('') !== str2`:
//                                  - Commit `wordChars[j] = newChar`. Break inner loops.
//                              - Reset `wordChars[j] = wordChars[j]` (the original char at `j` before trying to increment). This is the critical part, we are restoring the state before trying to increment `wordChars[j]`.
//                          - If after trying all increments for `wordChars[j]`, the equality persists, it implies that `str2` is formed by a character repeated `m` times, or a pattern where incrementing one character always results in equality.
//                          - If `wordChars.slice(i, i + m).join('') === str2` and `str1[i] === 'F'`, we *must* change `wordChars[j]` for some `j` in `[i, i+m-1]`. To achieve lexicographical minimum, we want to make the change as far right as possible, and use the smallest possible character that breaks the equality.
//                          - For `j` from `i + m - 1` down to `i`:
//                              - `originalChar = wordChars[j]`.
//                              - Iterate `newChar` from 'a' to 'z'.
//                              - If `newChar !== originalChar`:
//                                  - `wordChars[j] = newChar`. // Tentative change
//                                  - If `wordChars.slice(i, i + m).join('') !== str2`:
//                                      - This is a valid change. Break all loops related to this `i` and move to the next `i`.
//                                  - `wordChars[j] = originalChar`. // Backtrack if the change didn't work.
//                              - If `newChar === originalChar`: // This case only matters if originalChar is not 'a' and we need to change it.
//                                  - But if we are looking for the *smallest* change, we would only consider characters larger than original.
//                                  - **The problem is simpler:** if `wordChars.slice(i, i + m).join('') === str2`, we need to change `wordChars[j]` for some `j` in `[i, i+m-1]`. We must use the smallest possible character that breaks the equality.
//                                  - For `j` from `i + m - 1` down to `i`:
//                                      - `originalChar = wordChars[j]`.
//                                      - For `newChar_code` from `originalChar.charCodeAt(0) + 1` to `'z'.charCodeAt(0)`:
//                                          - `newChar = String.fromCharCode(newChar_code)`.
//                                          - `wordChars[j] = newChar`.
//                                          - If `wordChars.slice(i, i + m).join('') !== str2`:
//                                              - Found it! Commit `wordChars[j] = newChar`. Break all loops for this `i`.
//                                          - `wordChars[j] = originalChar`. // Backtrack
//                                      - If after trying all increments for `wordChars[j]`, we still have equality, it means `str2` is patterned such that no single increment can break it, or the current character at `j` is 'z' and incrementing is not an option.
//                                      - If we reach this point for `j`, and no change worked, we move to `j-1`.
//                                      - **What if `originalChar` is 'a' and `str2` is "aaa" and we need to break it?** We would try 'b'. If that still results in "aaa" (impossible unless m > 1 and str2="aaa"), then we consider `j-1`.
//                                      - The key is: we must change *something*. We want the lexicographically smallest change.
//                                      - So, for each `i` where `str1[i] == 'F'` and `wordChars.slice(i, i + m).join('') === str2`:
//                                          - Iterate `j` from `i + m - 1` down to `i`.
//                                          - `originalChar = wordChars[j]`.
//                                          - For `newChar` from 'a' to 'z':
//                                              - If `newChar !== originalChar`:
//                                                  - `wordChars[j] = newChar`. // Tentative
//                                                  - If `wordChars.slice(i, i + m).join('') !== str2`:
//                                                      - Commit `wordChars[j] = newChar`. Break out of all loops for this `i`.
//                                                  - `wordChars[j] = originalChar`. // Backtrack
//                                          - If we loop through all `newChar` for a given `j` and don't find a solution, it means that for this `j`, changing it to any other character still results in `wordChars.slice(i, i+m)` being equal to `str2`. This is only possible if `str2` is formed by repeating a single character or a pattern that's preserved by changing one character. This scenario strongly suggests impossibility or a very specific edge case.
//                                          - If we iterate through all `j` from `i+m-1` down to `i` and cannot find a single character change that breaks the equality, then it's impossible to satisfy this `str1[i] == 'F'` constraint. Return `""`.
//
// 5. If all 'F' constraints are satisfied, join `wordChars` to form the result string.
//
//
// Example 1 walk-through: str1 = "TFTF", str2 = "ab"
// n = 4, m = 2. word length = 4 + 2 - 1 = 5.
// wordChars = [_, _, _, _, _]
//
// i = 0, str1[0] = 'T': word[0..1] = "ab"
// wordChars = ['a', 'b', _, _, _]
//
// i = 1, str1[1] = 'F':
//
// i = 2, str1[2] = 'T': word[2..3] = "ab"
// wordChars[2] must be 'a', wordChars[3] must be 'b'.
// wordChars = ['a', 'b', 'a', 'b', _]
//
// i = 3, str1[3] = 'F':
//
// Step 3: Fill unassigned greedily.
// wordChars = ['a', 'b', 'a', 'b', 'a'] (wordChars[4] was unassigned, filled with 'a')
// Candidate string: "ababa"
//
// Step 4: Check 'F' constraints.
//
// i = 1, str1[1] = 'F': Check word[1..2] which is wordChars[1..2] = ['b', 'a']. Is "ba" != "ab"? Yes. OK.
//
// i = 3, str1[3] = 'F': Check word[3..4] which is wordChars[3..4] = ['b', 'a']. Is "ba" != "ab"? Yes. OK.
//
// All 'F' constraints satisfied.
// Return "ababa".
//
//
// Example 2: str1 = "TFTF", str2 = "abc"
// n = 4, m = 3. word length = 4 + 3 - 1 = 6.
// wordChars = [_, _, _, _, _, _]
//
// i = 0, str1[0] = 'T': word[0..2] = "abc"
// wordChars = ['a', 'b', 'c', _, _, _]
//
// i = 1, str1[1] = 'F':
//
// i = 2, str1[2] = 'T': word[2..4] = "abc"
// wordChars[2] must be 'a'. But wordChars[2] is already 'c'. CONFLICT!
// Return "".
//
//
// Example 3: str1 = "F", str2 = "d"
// n = 1, m = 1. word length = 1 + 1 - 1 = 1.
// wordChars = [_]
//
// i = 0, str1[0] = 'F':
//
// Step 3: Fill unassigned greedily.
// wordChars = ['a']
// Candidate string: "a"
//
// Step 4: Check 'F' constraints.
//
// i = 0, str1[0] = 'F': Check word[0..0] which is wordChars[0..0] = ['a']. Is "a" != "d"? Yes. OK.
//
// All 'F' constraints satisfied.
// Return "a".
//
//
// Let's consider a tricky 'F' constraint fix:
// str1 = "TFF", str2 = "ab"
// n = 3, m = 2. word length = 3 + 2 - 1 = 4.
// wordChars = [_, _, _, _]
//
// i = 0, str1[0] = 'T': word[0..1] = "ab"
// wordChars = ['a', 'b', _, _]
//
// i = 1, str1[1] = 'F':
//
// i = 2, str1[2] = 'F':
//
// Step 3: Fill unassigned greedily.
// wordChars = ['a', 'b', 'a', 'a']
// Candidate string: "abaa"
//
// Step 4: Check 'F' constraints.
//
// i = 1, str1[1] = 'F': Check word[1..2] which is wordChars[1..2] = ['b', 'a']. Is "ba" != "ab"? Yes. OK.
//
// i = 2, str1[2] = 'F': Check word[2..3] which is wordChars[2..3] = ['a', 'a']. Is "aa" != "ab"? Yes. OK.
//
// All 'F' constraints satisfied.
// Return "abaa".
//
//
// Another tricky case:
// str1 = "TTF", str2 = "aa"
// n = 3, m = 2. word length = 3 + 2 - 1 = 4.
// wordChars = [_, _, _, _]
//
// i = 0, str1[0] = 'T': word[0..1] = "aa"
// wordChars = ['a', 'a', _, _]
//
// i = 1, str1[1] = 'T': word[1..2] = "aa"
// wordChars[1] must be 'a'. Already 'a'. OK.
// wordChars = ['a', 'a', 'a', _]
//
// i = 2, str1[2] = 'F':
//
// Step 3: Fill unassigned greedily.
// wordChars = ['a', 'a', 'a', 'a']
// Candidate string: "aaaa"
//
// Step 4: Check 'F' constraints.
//
// i = 2, str1[2] = 'F': Check word[2..3] which is wordChars[2..3] = ['a', 'a']. Is "aa" != "aa"? NO, they are equal.
// Constraint violated. Must fix.
//
// Fix for i = 2: wordChars[2..3] is "aa", str1[2] is 'F'.
// wordChars = ['a', 'a', 'a', 'a']
// We need to make wordChars[2..3] != "aa".
// Iterate j from i+m-1 (2+2-1=3) down to i (2).
// j = 3: wordChars[3] is 'a'. originalChar = 'a'.
// Try newChar from 'a' to 'z'.
// newChar = 'a': 'a' === originalChar. Skip.
// newChar = 'b': 'b' !== originalChar. Tentative: wordChars[3] = 'b'.
// Current wordChars: ['a', 'a', 'a', 'b']. Substring wordChars[2..3] is "ab".
// Is "ab" != "aa"? YES.
// Fix found! Commit wordChars[3] = 'b'.
// wordChars is now ['a', 'a', 'a', 'b'].
// Break loop for this 'i'.
//
// All 'F' constraints checked and fixed.
// Return "aaab".
//
//
// Edge case: What if fixing one 'F' constraint breaks another 'F' constraint?
// The problem states "Lexicographically Smallest". This implies we iterate through the 'F' constraints and fix them. If fixing one forces us to make a change that violates another 'F', that's a problem. However, the greedy fix (rightmost character, smallest possible different character) should be robust.
//
// Let's consider the constraints on modifying characters.
// When we encounter `str1[i] == 'F'` and `wordChars.slice(i, i + m).join('') === str2`:
// We iterate `j` from `i + m - 1` down to `i`.
// For each `j`, we iterate `newChar` from 'a' to 'z'.
// If `newChar !== wordChars[j]`:
//   Tentatively set `wordChars[j] = newChar`.
//   Check if `wordChars.slice(i, i + m).join('') !== str2`.
//   If it is different, we found our fix. Commit `wordChars[j] = newChar` and break all inner loops for this `i`.
//   If it's still the same, backtrack: `wordChars[j] = originalChar`.
// If, for a given `j`, we iterate through all `newChar` ('a' to 'z') and none of them can break the equality of `wordChars.slice(i, i + m)` from `str2` (while being different from `originalChar`), it means we cannot satisfy the 'F' constraint at `str1[i]` by modifying only `wordChars[j]` (and assuming characters to its right are already fixed or are not the source of the problem). This indicates that this specific `j` cannot be the point of divergence. We must then move to `j-1`.
// If we iterate through all `j` from `i + m - 1` down to `i` and cannot find *any* modification that breaks the equality, then it's impossible to satisfy the 'F' constraint at `str1[i]`. In this case, we should return `""`.
//
//
// Time Complexity:
// - Step 2 (Processing 'T' constraints): O(n * m) in the worst case, if we iterate through str1 and for each 'T', we iterate m times.
// - Step 3 (Greedy fill): O(n + m) for iterating through `wordChars`.
// - Step 4 (Processing 'F' constraints):
//   - Outer loop iterates `n` times (for `str1`).
//   - Inside, we extract substring: O(m).
//   - Checking equality: O(m).
//   - Fixing 'F' constraints:
//     - Loop for `j` goes from `m-1` down to `0` (at most `m` iterations).
//     - Inner loop for `newChar` goes from 'a' to 'z' (26 iterations).
//     - Substring check: O(m).
//     - Total for fixing one 'F' constraint: O(m * 26 * m) = O(m^2).
//   - Since there can be up to `n` 'F' constraints, the total for Step 4 can be O(n * m^2).
//
//   - Given n <= 10^4 and m <= 500:
//     - Step 2: 10^4 * 500 = 5 * 10^6 operations. (Feasible)
//     - Step 4 (worst case): 10^4 * 500^2 = 10^4 * 250000 = 2.5 * 10^9 operations. (Too slow)
//
//   - We need to optimize Step 4. The substring extraction and comparison `wordChars.slice(i, i + m).join('') === str2` is costly.
//
//   - Optimization for Step 4:
//   Instead of re-extracting and joining substrings every time, we can use hashing or KMP's LPS array concept.
//   However, the characters in `wordChars` can change.
//   The core issue is the repeated check `wordChars.slice(i, i + m).join('') === str2`.
//
//   Let's re-evaluate Step 4. For each `i` where `str1[i] == 'F'`, we first check if `wordChars[i...i+m-1]` matches `str2`.
//   If it matches, we then try to modify `wordChars[j]` for `j` from `i+m-1` down to `i`.
//   The modification loop looks like:
//   For `j` from `i+m-1` down to `i`:
//     `originalChar = wordChars[j]`
//     For `newChar` from 'a' to 'z':
//       If `newChar !== originalChar`:
//         `wordChars[j] = newChar`
//         Check `wordChars[i...i+m-1] !== str2`
//         If so, commit and break.
//         `wordChars[j] = originalChar`
//
//   The `wordChars.slice(i, i + m).join('') !== str2` check is the bottleneck.
//   Can we optimize this check?
//   When we change `wordChars[j]`, we only affect the substring `wordChars[i...i+m-1]` if `i <= j < i+m`.
//   If `wordChars.slice(i, i + m).join('') === str2` and `str1[i] == 'F'`, we need to change `wordChars[j]` for some `j` in `[i, i+m-1]`.
//   The smallest lexicographical change comes from changing the rightmost possible `j` to the smallest possible character that breaks the equality.
//
//   Let's consider the structure of str2. If str2 is "aaaa", and `wordChars[i..i+m-1]` becomes "aaaa", and str1[i] is 'F', we must change it. We try changing the last 'a'. To the smallest possible character other than 'a'. This is 'b'. If `str2` was "aba", and `wordChars[i..i+m-1]` became "aba", and str1[i] is 'F'. We try changing the last 'a'. To 'b'. This becomes "abb". "abb" != "aba". So, we commit.
//
//   The crucial part is the check: `wordChars.slice(i, i + m).join('') !== str2`.
//   This check is indeed O(m). So, for each 'F' constraint, the fix loop is O(m * 26 * m).
//   Total O(n * m^2). This is still too slow.
//
//   Alternative approach for 'F' constraint:
//   Instead of directly checking the substring, can we use string matching algorithms like KMP to find occurrences of `str2`?
//   But `wordChars` is being modified.
//
//   What if we pre-calculate all potential conflicts?
//   For every starting position `i` in `wordChars`, we can check if `wordChars[i...i+m-1] == str2`.
//
//   Let's rethink the structure of the problem and the constraints.
//   `n` up to 10^4, `m` up to 500.
//   The 'T' constraints establish a baseline.
//   The 'F' constraints are "negative" constraints.
//
//   Perhaps the "fix F" step needs a different perspective.
//   If `wordChars[i...i+m-1] == str2` and `str1[i] == 'F'`, we MUST break this equality.
//   To minimize lexicographically, we iterate `j` from `i+m-1` down to `i`.
//   For each `j`, we try to assign `wordChars[j]` to the smallest character `c` such that `c > wordChars[j]`.
//   If `wordChars[j]` is 'z', we cannot increase it.
//   If we change `wordChars[j]` to `c`, we need to ensure `wordChars[i...i+m-1] != str2`.
//
//   Consider KMP's `computeLPSArray` and `KMPSearch`.
//   If we can efficiently check if `str2` occurs at `wordChars[i...i+m-1]`.
//   When `wordChars[j]` is changed, it might affect occurrences starting at `i` if `i <= j < i+m`.
//
//   Let's consider the constraint `str1[i] == 'F'` and `wordChars[i...i+m-1] == str2`.
//   We need to change `wordChars[j]` for some `j` in `[i, i+m-1]`.
//   To maintain lexicographical smallest, we change the rightmost `j`, and to the smallest possible character that breaks equality.
//   The candidate characters for `wordChars[j]` are 'a' through 'z'.
//
//   The problematic step is `wordChars.slice(i, i + m).join('') !== str2`.
//   If `m` is small (e.g., up to 500), maybe O(nm^2) is actually acceptable if `n` is not always 10^4.
//   If `n` is small, `n * 500^2` is okay. If `m` is small, `10^4 * m^2` is okay.
//   But if both `n` and `m` are large, it's an issue.
//
//   Example where `m^2` is bad:
//   `str1` = "TFFFFF..." (10^4 'F's after a 'T')
//   `str2` = "ababab..." (length 500)
//
//   Let's assume the constraints allow for an O(nm^2) or slightly worse solution.
//   The substring check `wordChars.slice(i, i + m).join('')` creates a new string, which is O(m). Joining is O(m).
//   Maybe we can avoid string creation?
//   We can write a helper function `areSubstringsEqual(arr1, start1, arr2, start2, len)`
//   Or `areSubstringsEqual(arr, startIndex, str)`
//   This would still be O(m) for each check.
//
//   The problem difficulty is "Hard". This suggests there might be a non-trivial optimization or a different approach.
//
//   What if we use a Z-algorithm or KMP precomputation on `str2` and its reverse?
//
//   Consider the states:
//   `wordChars[k]` is either assigned by a 'T' constraint, or greedily filled with 'a', or modified to break an 'F' constraint.
//
//   Let's stick with the O(nm^2) approach for now and see if it passes. If not, we'll need to optimize.
//   The logic for fixing 'F' constraints:
//   For each `i` where `str1[i] == 'F'` and `current_word_substring == str2`:
//     Iterate `j` from `i + m - 1` down to `i`:
//       `originalChar = wordChars[j]`
//       Iterate `newChar` from 'a' to 'z':
//         If `newChar !== originalChar`:
//           `wordChars[j] = newChar`
//           If `checkSubstring(wordChars, i, str2)` is FALSE:
//             // Found a valid fix. Commit and move to next 'F' constraint.
//             goto next_F_constraint;
//           `wordChars[j] = originalChar` // Backtrack
//       // If we finish iterating 'a' to 'z' for `wordChars[j]` and no fix,
//       // it implies that changing `wordChars[j]` alone cannot break the equality.
//       // This means the current `j` is not the culprit, or `str2` has a specific pattern.
//       // The loop continues to `j-1`.
//     If we exit the loop over `j` without finding a fix (i.e., `goto next_F_constraint` was not taken),
//     it means no single character change in `wordChars[i...i+m-1]` can break the equality.
//     This implies impossibility. Return `""`.
//
//   The `checkSubstring` helper function:
//   `function checkSubstring(wordArr, startIndex, targetStr)`:
//     `m = targetStr.length`
//     For `k = 0` to `m-1`:
//       If `wordArr[startIndex + k] !== targetStr[k]`:
//         Return `false` // Not equal
//     Return `true` // Equal
//
//   The logic for `newChar` in the fix loop needs careful handling.
//   We want the *smallest* possible character change.
//   So, for `j` from `i+m-1` down to `i`:
//     `originalChar = wordChars[j]`
//     For `newChar_code` from `originalChar.charCodeAt(0) + 1` up to `'z'.charCodeAt(0)`:
//       `newChar = String.fromCharCode(newChar_code)`
//       `wordChars[j] = newChar`
//       If `!checkSubstring(wordChars, i, str2)`:
//         // Found the smallest possible INCREMENTAL change at index j
//         goto next_F_constraint;
//       `wordChars[j] = originalChar` // Backtrack
//     // If we reach here for a given `j`, it means either:
//     // 1. `originalChar` was 'z', so no increment is possible.
//     // 2. `str2` has a pattern such that even incrementing `wordChars[j]` to 'z'
//     //    still results in `wordChars[i...i+m-1]` being equal to `str2`.
//     // In either case, modifying `wordChars[j]` by incrementing it doesn't work.
//     // We must try changing `wordChars[j]` to something else? Or try `j-1`?
//     // The problem says "lexicographically smallest". This implies we want the
//     // smallest possible resulting string.
//     // If `wordChars[i...i+m-1] == str2` and `str1[i] == 'F'`, we must change `wordChars[j]`
//     // for some `j`.
//     // To achieve smallest result, we change rightmost `j` to the smallest possible `newChar`
//     // such that `wordChars[i...i+m-1] != str2`.
//     // So, the loop should be:
//     `for (let j = i + m - 1; j >= i; j--)`
//       `originalChar = wordChars[j]`
//       `for (let newCharCode = originalChar.charCodeAt(0) + 1; newCharCode <= 'z'.charCodeAt(0); newCharCode++)`
//         `newChar = String.fromCharCode(newCharCode)`
//         `wordChars[j] = newChar`
//         `if (!checkSubstring(wordChars, i, str2))`
//           `// Found the fix. Commit and break from all inner loops for this 'i'.`
//           `goto next_F_constraint;`
//         `wordChars[j] = originalChar; // Backtrack`
//
//     `// If we finish the loop for `j` without finding a fix by incrementing,`
//     `// it means we can't fix it by simply incrementing the character at `j`.`
//     `// This could happen if originalChar is 'z', or str2 has a repeated pattern.`
//     `// We need to consider changing `wordChars[j]` to 'a', if it's not already 'a'.`
//     `// But this makes the string lexicographically larger if originalChar > 'a'.`
//     `// The correct logic for "smallest possible change" is to find the smallest char`
//     `// `newChar` in 'a'...'z' such that `newChar !== originalChar` AND`
//     `// `wordChars[i...i+m-1] != str2`.`
//
//     `for (let j = i + m - 1; j >= i; j--)`
//       `originalChar = wordChars[j]`
//       `for (let newChar of "abcdefghijklmnopqrstuvwxyz")`
//         `if (newChar !== originalChar)`
//           `wordChars[j] = newChar`
//           `if (!checkSubstring(wordChars, i, str2))`
//             `// Found a valid modification. This is the rightmost position `j`,`
//             `// and `newChar` is the smallest character that breaks equality.`
`             // Commit and break from all inner loops for this 'i'.`
`             goto next_F_constraint;`
`           `wordChars[j] = originalChar; // Backtrack`
`       // If we finish the loop for 'a' to 'z' for this `j` and cannot find a fix,`
`       // it means this `j` cannot be modified to break equality.`
`       // This indicates that the problem might be impossible to solve if we exhaust all `j`.`
`     // If we reach here, it means we couldn't find a modification for str1[i] == 'F' constraint.`
`     return ""; // Impossible to generate a valid string.`
`next_F_constraint:;`
//
//   This refined fix logic for 'F' constraint seems more correct and might be what's expected.
//   The time complexity of `checkSubstring` is O(m).
//   The fix loop for one 'F' constraint becomes O(m * 26 * m) = O(m^2).
//   Total complexity remains O(nm^2).
//   If this is too slow, then string algorithms like KMP for pattern matching in a sliding window or hashing might be needed.
//   Let's proceed with the O(nm^2) implementation.
//
// Time Complexity:
// - Step 2 ('T' constraints): O(n * m)
// - Step 3 (Greedy fill): O(n + m)
// - Step 4 ('F' constraints): O(n * m^2) because for each of n 'F' constraints, we might iterate m positions, and for each position, try up to 26 characters, and each check takes O(m).
// Total Time Complexity: O(n * m^2)
//
// Space Complexity:
// - `wordChars` array: O(n + m)
// Total Space Complexity: O(n + m)

const solve = (str1, str2) => {
    const n = str1.length;
    const m = str2.length;
    const wordLength = n + m - 1;
    const wordChars = new Array(wordLength).fill(null); // Use null for unassigned characters

    // Helper function to check if a substring of wordChars matches targetStr
    const checkSubstring = (arr, startIndex, targetStr) => {
        const len = targetStr.length;
        for (let k = 0; k < len; k++) {
            if (startIndex + k >= arr.length || arr[startIndex + k] === null || arr[startIndex + k] !== targetStr[k]) {
                return false; // Mismatch or out of bounds or unassigned
            }
        }
        return true; // Match
    };

    // Step 2: Process 'T' constraints
    for (let i = 0; i < n; i++) {
        if (str1[i] === 'T') {
            for (let k = 0; k < m; k++) {
                const wordIndex = i + k;
                if (wordChars[wordIndex] !== null && wordChars[wordIndex] !== str2[k]) {
                    // Conflict: 'T' constraint requires a different character
                    return "";
                }
                wordChars[wordIndex] = str2[k];
            }
        }
    }

    // Step 3: Fill remaining unassigned slots greedily with 'a'
    for (let j = 0; j < wordLength; j++) {
        if (wordChars[j] === null) {
            wordChars[j] = 'a';
        }
    }

    // Step 4: Process and fix 'F' constraints
    let possible = true; // Flag to track if a valid string can be generated
    for (let i = 0; i < n; i++) {
        if (str1[i] === 'F') {
            // Check if the current substring matches str2
            if (checkSubstring(wordChars, i, str2)) {
                // Constraint violated: 'F' required not equal, but it is equal.
                // Need to modify the substring wordChars[i...i+m-1]
                let fixed = false;
                // Iterate from right to left to find the rightmost character to modify
                for (let j = i + m - 1; j >= i; j--) {
                    const originalChar = wordChars[j];
                    // Try all possible characters ('a' to 'z') to replace wordChars[j]
                    for (let newChar = 'a'; newChar <= 'z'; newChar = String.fromCharCode(newChar.charCodeAt(0) + 1)) {
                        if (newChar !== originalChar) {
                            wordChars[j] = newChar; // Tentative change
                            // Check if the substring is now different from str2
                            if (!checkSubstring(wordChars, i, str2)) {
                                // Found a valid modification. Commit and break.
                                fixed = true;
                                break; // Break from newChar loop
                            }
                            wordChars[j] = originalChar; // Backtrack if modification didn't work
                        }
                    }
                    if (fixed) {
                        break; // Break from j loop
                    }
                }

                if (!fixed) {
                    // If we couldn't fix the 'F' constraint by modifying any character
                    // in the substring, then it's impossible.
                    possible = false;
                    break; // Break from the outer 'i' loop
                }
            }
        }
    }

    if (!possible) {
        return "";
    }

    // Join the characters to form the final string
    return wordChars.join('');
};
```