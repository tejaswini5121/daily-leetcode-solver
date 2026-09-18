/**
 * @param {string} s
 * @return {string[]}
 */
// Problem Summary: Find the maximum number of non-overlapping substrings where each substring must contain all occurrences of any character it includes.
// Link: https://leetcode.com/problems/maximum-number-of-non-overlapping-substrings/
// Approach:
// The core idea is to identify valid "minimal" substrings that satisfy the condition of containing all occurrences of their constituent characters.
// For each character, we need to know its first and last occurrence in the string.
// A substring s[i..j] is valid if for every character `c` present in s[i..j], its first occurrence is at or after `i` and its last occurrence is at or before `j`.
// We can iterate through the string and try to form valid substrings greedily.
// For each character, we find its first and last index. Let's say for character 'a', first is `first['a']` and last is `last['a']`.
// We can maintain a `current_end` pointer. When we encounter a character `c` at index `i`, the potential end of the current substring is `max(current_end, last[c])`.
// If the current index `i` reaches `current_end`, it means we have found a valid minimal substring `s[start..current_end]`.
// We then add this substring to our result and reset `start` to `i + 1` for the next potential substring.
//
// Detailed Steps:
// 1. Precompute first and last occurrences of each character. Store them in maps or arrays.
//    `first[char] = index of first occurrence`
//    `last[char] = index of last occurrence`
// 2. Initialize `result = []`, `start = 0`.
// 3. Iterate through the string `s` with index `i` from 0 to `s.length - 1`.
// 4. For each character `s[i]`:
//    a. Update `current_end = max(current_end, last[s[i]])`.
//    b. If `i == current_end`:
//       i. This indicates a valid minimal substring from `start` to `current_end`.
//       ii. Extract the substring `s.substring(start, current_end + 1)`.
//       iii. Add this substring to `result`.
//       iv. Update `start = i + 1` to begin searching for the next non-overlapping substring.
// 5. Return `result`.
//
// The greedy approach works because by extending the `current_end` to the furthest possible occurrence of any character encountered so far, we ensure that the substring we form is minimal and covers all its characters' occurrences within its bounds. When `i` finally reaches `current_end`, we have found a valid segment. By taking this segment and starting anew, we maximize the chances of fitting more substrings.
//
// Time Complexity: O(N), where N is the length of the string.
// We iterate through the string a constant number of times: once to find first/last occurrences, and once to build the substrings. Map operations (insertion/lookup) take O(1) on average for characters.
//
// Space Complexity: O(1) or O(alphabet size).
// We use arrays/maps to store first/last occurrences, which are of fixed size (26 for lowercase English letters). The result list can store up to N/2 substrings in the worst case, but the problem constraints suggest O(N) space is acceptable for the output. The auxiliary space used is dominated by the character occurrence maps, which is constant.

/**
 * @param {string} s
 * @return {string[]}
 */
const maxNumOfSubstrings = function(s) {
    // Arrays to store the first and last index of each character.
    // Initialize with -1 to indicate the character hasn't been seen yet.
    const first = new Array(26).fill(-1);
    const last = new Array(26).fill(-1);

    // Populate the first and last occurrence arrays.
    for (let i = 0; i < s.length; i++) {
        const charCode = s.charCodeAt(i) - 'a'.charCodeAt(0);
        if (first[charCode] === -1) {
            // If this is the first time we see this character, record its index.
            first[charCode] = i;
        }
        // Always update the last occurrence index for the character.
        last[charCode] = i;
    }

    const result = [];
    let start = 0; // The starting index of the current potential substring.
    let currentEnd = -1; // The furthest right boundary required by characters seen in the current potential substring.

    // Iterate through the string to identify and extract valid substrings.
    for (let i = 0; i < s.length; i++) {
        const charCode = s.charCodeAt(i) - 'a'.charCodeAt(0);

        // Update the `currentEnd` to be the maximum of its current value and the last occurrence of the current character.
        // This ensures that the current substring will cover all occurrences of characters seen so far.
        currentEnd = Math.max(currentEnd, last[charCode]);

        // If the current index `i` has reached the `currentEnd`, it means we have found a valid, minimal substring.
        // This substring starts at `start` and ends at `currentEnd`.
        if (i === currentEnd) {
            // Extract the valid substring.
            const sub = s.substring(start, currentEnd + 1);
            result.push(sub);

            // Reset `start` to the index after the current valid substring to begin searching for the next one.
            start = i + 1;
            // Reset `currentEnd` to -1. Although `currentEnd` will be updated in the next iteration,
            // resetting it to -1 conceptually signifies the start of a new search for a substring.
            // In practice, `currentEnd` will be re-evaluated with `last[next_char]` in the next loop iteration.
            // A more precise way to think about this is that `currentEnd` becomes the boundary for the *next* substring.
            // If we set `currentEnd = i + 1`, it implicitly means the next valid segment can start from `i+1`.
            // However, `currentEnd` needs to be the maximum boundary for the *current* substring being considered.
            // When `i === currentEnd`, we *complete* a substring. The next substring will start at `i + 1`.
            // `currentEnd` for the next substring will be determined by characters encountered from `i + 1` onwards.
            // So, `start` is `i + 1` and `currentEnd` will be re-calculated from characters encountered *after* `i`.
            // The `currentEnd` in the `if (i === currentEnd)` block is already set to the maximal end of the substring just found.
            // The `start` for the *next* substring is `i + 1`.
            // The `currentEnd` needs to be re-initialized to track the boundary for the *next* substring.
            // Since the loop will continue and `currentEnd` will be updated by `last[s[i+1]]`,
            // setting `currentEnd = i` or `currentEnd = -1` is fine. The key is that `start` is updated correctly.
            // Setting `currentEnd = i` here is also valid because the next iteration `i` will become `i+1`,
            // and `currentEnd` will be updated correctly.
            // For clarity, let's think about the next substring's `currentEnd`. It starts being determined by `s[i+1]`.
            // If we do `currentEnd = -1;`, the first character `s[i+1]` will correctly set `currentEnd = last[s[i+1]]`.
            // If we do `currentEnd = i;`, the next character `s[i+1]` will correctly set `currentEnd = Math.max(i, last[s[i+1]])`.
            // Since `i < i+1` and `last[s[i+1]] >= i+1` (as it's the last occurrence), this will correctly become `last[s[i+1]]`.
            // Thus, `currentEnd = i;` is a safe and common pattern here.
            currentEnd = i;
        }
    }

    return result;
};
```