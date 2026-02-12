```cpp
// Problem: Longest Balanced Substring I
// Link: https://leetcode.com/problems/longest-balanced-substring-i/
// Summary: Find the longest substring where all distinct characters appear an equal number of times.

/*
Approach:
The problem asks for the longest balanced substring. A brute-force approach would be to iterate through all possible substrings and check if each substring is balanced.
To check if a substring is balanced, we can use a frequency map (or an array since the alphabet is fixed to lowercase English letters).
For each substring, we count the frequency of each character. Then, we check if all non-zero frequencies are equal.

Since the string length is up to 1000, iterating through all substrings (O(N^2)) and for each substring, checking its balance (O(N) in the worst case for character counts, or O(26) if we use an array) would lead to an O(N^3) or O(N^2 * 26) overall complexity. Given N <= 1000, N^3 might be too slow.

We can optimize the balance check. For a fixed starting point `i`, as we extend the substring by moving the end point `j` from `i` to `N-1`:
1. Maintain a frequency map for characters in `s[i...j]`.
2. Keep track of the distinct characters encountered.
3. For each `j`, after updating the frequency map, iterate through the frequencies of distinct characters. If all these frequencies are equal, update the maximum length.

Let's refine this. For each starting index `i` from 0 to `N-1`:
Iterate through each possible distinct character count `k` that can appear in a balanced substring. Since there are only 26 lowercase English letters, `k` can range from 1 to 26.
For a fixed starting index `i` and a fixed number of distinct characters `k`, we want to find the longest balanced substring `s[i...j]` where exactly `k` distinct characters appear and each appears `count` times.
This seems to overcomplicate.

A more direct O(N^2) approach seems feasible.
Iterate through all possible start indices `i` (0 to N-1).
For each `i`, iterate through all possible end indices `j` (i to N-1).
For the substring `s[i...j]`:
  Create a frequency map (or array of size 26).
  Count the occurrences of each character in `s[i...j]`.
  Find the frequency of the first character encountered. Let this be `target_freq`.
  Check if all other characters that appear in the substring have a frequency equal to `target_freq`.
  If they do, update `max_len = max(max_len, j - i + 1)`.

Example walk-through with s = "abbac"
N = 5

i = 0:
  j = 0: "a". Freq: {'a':1}. Balanced. max_len = 1.
  j = 1: "ab". Freq: {'a':1, 'b':1}. Balanced. max_len = 2.
  j = 2: "abb". Freq: {'a':1, 'b':2}. Not balanced.
  j = 3: "abba". Freq: {'a':2, 'b':2}. Balanced. max_len = 4.
  j = 4: "abbac". Freq: {'a':2, 'b':2, 'c':1}. Not balanced.

i = 1:
  j = 1: "b". Freq: {'b':1}. Balanced. max_len = 4.
  j = 2: "bb". Freq: {'b':2}. Balanced. max_len = 4.
  j = 3: "bba". Freq: {'b':2, 'a':1}. Not balanced.
  j = 4: "bbac". Freq: {'b':2, 'a':1, 'c':1}. Not balanced.

i = 2:
  j = 2: "b". Freq: {'b':1}. Balanced. max_len = 4.
  j = 3: "ba". Freq: {'b':1, 'a':1}. Balanced. max_len = 4.
  j = 4: "bac". Freq: {'b':1, 'a':1, 'c':1}. Balanced. max_len = 4.

i = 3:
  j = 3: "a". Freq: {'a':1}. Balanced. max_len = 4.
  j = 4: "ac". Freq: {'a':1, 'c':1}. Balanced. max_len = 4.

i = 4:
  j = 4: "c". Freq: {'c':1}. Balanced. max_len = 4.

Final max_len = 4.

The O(N^2) approach:
Outer loop for start index `i`: 0 to N-1.
Inner loop for end index `j`: `i` to N-1.
Inside inner loop:
  Use `std::vector<int> freq(26, 0);`
  Iterate `k` from `i` to `j` to populate `freq`.
  Then, iterate through `freq` to check for balance. This check can be O(26).
  Total complexity: O(N^2 * N * 26) if we recompute freq every time, or O(N^2 * 26) if we incrementally update freq.

Incremental update for frequency:
For a fixed `i`, as `j` increases:
`freq[s[j] - 'a']++`
Then, check balance. This balance check is still tricky.
We need to know *how many distinct characters* have non-zero frequencies, and what that *common frequency* is.

Let's refine the balance check within the O(N^2) loop:
For a fixed `i`, and iterating `j` from `i` to `N-1`:
  Initialize `freq` array of size 26 to 0.
  Initialize `distinct_chars = 0`.
  Initialize `min_freq = infinity`, `max_freq = 0`.
  For `k` from `i` to `j`:
    If `freq[s[k] - 'a'] == 0`, increment `distinct_chars`.
    `freq[s[k] - 'a']++`.

  After iterating `k` from `i` to `j` (this is incorrect, we are iterating `j` in the outer loop, so we update incrementally for `j`):

  For a fixed `i`:
    `std::vector<int> freq(26, 0);`
    For `j` from `i` to `N-1`:
      `freq[s[j] - 'a']++;`
      // Now check if s[i...j] is balanced.
      // We need to find the non-zero frequencies and check if they are all equal.
      int current_target_freq = -1; // Stores the frequency of the first non-zero char
      bool is_balanced = true;
      int num_distinct = 0;

      for (int char_code = 0; char_code < 26; ++char_code) {
          if (freq[char_code] > 0) {
              num_distinct++;
              if (current_target_freq == -1) {
                  current_target_freq = freq[char_code];
              } else if (freq[char_code] != current_target_freq) {
                  is_balanced = false;
                  break;
              }
          }
      }

      // If it's balanced and there were distinct characters (handles empty substring case implicitly)
      if (is_balanced && num_distinct > 0) {
          // The length is j - i + 1
          max_len = std::max(max_len, j - i + 1);
      }

This approach has:
Outer loop `i`: N iterations.
Inner loop `j`: N iterations.
Inside `j` loop:
  Updating frequency: O(1)
  Checking balance: O(26) as we iterate through the 26 possible characters.
Total time complexity: O(N * N * 26) which is O(N^2).
Space complexity: O(26) for the frequency array, which is O(1).

This O(N^2) approach should be efficient enough for N <= 1000.

Let's re-verify the logic with an example: s = "zzabccy", N = 7. max_len = 0.

i = 0:
  freq = [0]*26
  j = 0: s[0] = 'z'. freq['z'-'a']++. freq = [..., 1, ...] (for 'z').
         Check balance: char_code for 'z' has freq 1. current_target_freq = 1. num_distinct = 1. is_balanced = true.
         max_len = max(0, 0-0+1) = 1.
  j = 1: s[1] = 'z'. freq['z'-'a']++. freq = [..., 2, ...] (for 'z').
         Check balance: char_code for 'z' has freq 2. current_target_freq = 2. num_distinct = 1. is_balanced = true.
         max_len = max(1, 1-0+1) = 2.
  j = 2: s[2] = 'a'. freq['a'-'a']++. freq = [1, ..., 2, ...] (for 'a', 'z').
         Check balance: char_code for 'a' has freq 1. current_target_freq = 1. num_distinct = 1.
                      char_code for 'z' has freq 2. freq != current_target_freq. is_balanced = false. Break.
  j = 3: s[3] = 'b'. freq['b'-'a']++. freq = [1, 1, ..., 2, ...] (for 'a', 'b', 'z').
         Check balance: char_code for 'a' has freq 1. current_target_freq = 1. num_distinct = 1.
                      char_code for 'b' has freq 1. freq == current_target_freq. num_distinct = 2.
                      char_code for 'z' has freq 2. freq != current_target_freq. is_balanced = false. Break.
  j = 4: s[4] = 'c'. freq['c'-'a']++. freq = [1, 1, 1, ..., 2, ...] (for 'a', 'b', 'c', 'z').
         Check balance: char_code for 'a' has freq 1. current_target_freq = 1. num_distinct = 1.
                      char_code for 'b' has freq 1. freq == current_target_freq. num_distinct = 2.
                      char_code for 'c' has freq 1. freq == current_target_freq. num_distinct = 3.
                      char_code for 'z' has freq 2. freq != current_target_freq. is_balanced = false. Break.
  j = 5: s[5] = 'c'. freq['c'-'a']++. freq = [1, 1, 2, ..., 2, ...] (for 'a', 'b', 'c', 'z').
         Check balance: 'a':1, 'b':1, 'c':2, 'z':2. Not balanced.
  j = 6: s[6] = 'y'. freq['y'-'a']++. freq = [1, 1, 2, ..., 1, ...] (for 'a', 'b', 'c', 'y', 'z').
         Check balance: 'a':1, 'b':1, 'y':1, 'c':2, 'z':2. Not balanced.

i = 1:
  freq = [0]*26
  j = 1: s[1] = 'z'. freq['z'-'a']++. freq = [..., 1, ...]. max_len = max(2, 1) = 2.
  j = 2: s[2] = 'a'. freq['a'-'a']++. freq = [1, ..., 1, ...].
         Check balance: 'a':1, 'z':1. current_target_freq = 1. num_distinct = 2. is_balanced = true.
         max_len = max(2, 2-1+1) = 2.
  j = 3: s[3] = 'b'. freq['b'-'a']++. freq = [1, 1, ..., 1, ...].
         Check balance: 'a':1, 'b':1, 'z':1. current_target_freq = 1. num_distinct = 3. is_balanced = true.
         max_len = max(2, 3-1+1) = 3.
  j = 4: s[4] = 'c'. freq['c'-'a']++. freq = [1, 1, 1, ..., 1, ...].
         Check balance: 'a':1, 'b':1, 'c':1, 'z':1. current_target_freq = 1. num_distinct = 4. is_balanced = true.
         max_len = max(3, 4-1+1) = 4. (Substring "zabc")
  j = 5: s[5] = 'c'. freq['c'-'a']++. freq = [1, 1, 2, ..., 1, ...]. Not balanced.
  j = 6: s[6] = 'y'. freq['y'-'a']++. freq = [1, 1, 2, ..., 1, 1, ...]. Not balanced.

i = 2:
  freq = [0]*26
  j = 2: s[2] = 'a'. freq['a'-'a']++. freq = [1, ...]. max_len = max(4, 1) = 4.
  j = 3: s[3] = 'b'. freq['b'-'a']++. freq = [1, 1, ...].
         Check balance: 'a':1, 'b':1. current_target_freq = 1. num_distinct = 2. is_balanced = true.
         max_len = max(4, 3-2+1) = 4.
  j = 4: s[4] = 'c'. freq['c'-'a']++. freq = [1, 1, 1, ...].
         Check balance: 'a':1, 'b':1, 'c':1. current_target_freq = 1. num_distinct = 3. is_balanced = true.
         max_len = max(4, 4-2+1) = 4.
  j = 5: s[5] = 'c'. freq['c'-'a']++. freq = [1, 1, 2, ...]. Not balanced.
  j = 6: s[6] = 'y'. freq['y'-'a']++. freq = [1, 1, 2, ..., 1, ...]. Not balanced.

i = 3:
  freq = [0]*26
  j = 3: s[3] = 'b'. freq['b'-'a']++. freq = [0, 1, ...]. max_len = max(4, 1) = 4.
  j = 4: s[4] = 'c'. freq['c'-'a']++. freq = [0, 1, 1, ...].
         Check balance: 'b':1, 'c':1. current_target_freq = 1. num_distinct = 2. is_balanced = true.
         max_len = max(4, 4-3+1) = 4.
  j = 5: s[5] = 'c'. freq['c'-'a']++. freq = [0, 1, 2, ...]. Not balanced.
  j = 6: s[6] = 'y'. freq['y'-'a']++. freq = [0, 1, 2, ..., 1, ...]. Not balanced.

i = 4:
  freq = [0]*26
  j = 4: s[4] = 'c'. freq['c'-'a']++. freq = [..., 1, ...]. max_len = max(4, 1) = 4.
  j = 5: s[5] = 'c'. freq['c'-'a']++. freq = [..., 2, ...]. max_len = max(4, 2) = 4.
  j = 6: s[6] = 'y'. freq['y'-'a']++. freq = [..., 2, ..., 1, ...]. Not balanced.

i = 5:
  freq = [0]*26
  j = 5: s[5] = 'c'. freq['c'-'a']++. freq = [..., 1, ...]. max_len = max(4, 1) = 4.
  j = 6: s[6] = 'y'. freq['y'-'a']++. freq = [..., 1, ..., 1, ...].
         Check balance: 'c':1, 'y':1. current_target_freq = 1. num_distinct = 2. is_balanced = true.
         max_len = max(4, 6-5+1) = 4.

i = 6:
  freq = [0]*26
  j = 6: s[6] = 'y'. freq['y'-'a']++. freq = [..., 1, ...]. max_len = max(4, 1) = 4.

Final max_len = 4. This logic appears correct.

Consider constraints:
1 <= s.length <= 1000. N^2 approach is fine.
s consists of lowercase English letters. Using a fixed-size array `freq[26]` is appropriate.

A small edge case to consider: what if the substring has only one distinct character?
Example: "aaaa".
i=0, j=0: "a". freq={'a':1}. Balanced. max_len = 1.
i=0, j=1: "aa". freq={'a':2}. Balanced. max_len = 2.
i=0, j=2: "aaa". freq={'a':3}. Balanced. max_len = 3.
i=0, j=3: "aaaa". freq={'a':4}. Balanced. max_len = 4.
The logic `current_target_freq` initialization and comparison works for this case because `num_distinct` will be 1, and the loop checking for `freq[char_code] != current_target_freq` will not find any other distinct characters to disqualify it.

Another edge case: an empty string is not possible by constraints.
What if a substring has no characters? (Not possible by constraints).

The problem states "all distinct characters in the substring appear the same number of times".
This implies that if a character does not appear in the substring, its count is 0 and it doesn't affect the condition.
Our check correctly only considers characters with `freq[char_code] > 0`.

One final check on the balance condition:
`current_target_freq` is set by the *first* non-zero character encountered.
Then, for *all subsequent* non-zero characters, their frequencies *must* match `current_target_freq`.
If `num_distinct` becomes 0 at any point, it means `s[i...j]` is empty, which is not possible due to constraints.
The loop `for (int char_code = 0; char_code < 26; ++char_code)` correctly iterates through all possibilities.

Consider the case where `current_target_freq` is -1 and `freq[char_code] > 0`.
This happens for the first distinct character encountered. `current_target_freq` is set to its frequency.
Then, `num_distinct` is incremented.
The `is_balanced` flag starts as true.
If a subsequent distinct character `freq[char_code]` does NOT equal `current_target_freq`, `is_balanced` becomes false, and we break.
If we finish the loop and `is_balanced` is still true, it means all distinct characters had the same frequency.
The `num_distinct > 0` check is important to ensure we are not considering an "empty" set of characters as balanced.
This seems robust.

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <map> // Although using vector is better here

class Solution {
public:
    /**
     * @brief Finds the length of the longest balanced substring.
     *
     * A substring is balanced if all distinct characters within it appear the same number of times.
     *
     * Approach:
     * We iterate through all possible substrings of the given string `s`.
     * For each substring, we count the frequency of its characters.
     * Then, we check if all characters that appear in the substring have the same frequency.
     * If they do, we update the maximum length found so far.
     *
     * To optimize, we use a nested loop structure:
     * The outer loop iterates through all possible starting indices `i` of a substring.
     * The inner loop iterates through all possible ending indices `j` of a substring, starting from `i`.
     * For each pair `(i, j)`, representing the substring `s[i...j]`:
     *   We maintain a frequency array `freq` of size 26 to store counts of 'a' through 'z'.
     *   As `j` increases, we incrementally update `freq` for `s[j]`.
     *   After updating `freq`, we check if the substring `s[i...j]` is balanced.
     *   The balance check involves iterating through the `freq` array. We find the frequency of the
     *   first character encountered and ensure all other characters present in the substring have
     *   the same frequency.
     *
     * Time Complexity: O(N^2 * C), where N is the length of the string `s` and C is the size of the alphabet (26).
     *                 This is because there are O(N^2) substrings, and for each substring, we check
     *                 its balance in O(C) time. Since C is constant (26), the complexity is effectively O(N^2).
     * Space Complexity: O(C), where C is the size of the alphabet (26). This is for storing the frequency array.
     *                 This is effectively O(1) as C is constant.
     *
     * @param s The input string.
     * @return The length of the longest balanced substring.
     */
    int longestBalancedSubstring(std::string s) {
        int n = s.length();
        int max_len = 0; // Initialize the maximum length found so far

        // Iterate through all possible starting indices of a substring
        for (int i = 0; i < n; ++i) {
            // Frequency array to store counts of each character ('a' to 'z') for the current substring s[i...j]
            // Initialized to zeros for each new starting index 'i'.
            std::vector<int> freq(26, 0);

            // Iterate through all possible ending indices of a substring, starting from the current 'i'
            for (int j = i; j < n; ++j) {
                // Increment the frequency count for the current character s[j]
                freq[s[j] - 'a']++;

                // Check if the current substring s[i...j] is balanced.
                // A substring is balanced if all its distinct characters appear the same number of times.

                int current_target_freq = -1; // Stores the frequency of the first non-zero character encountered.
                bool is_balanced = true;      // Flag to indicate if the current substring is balanced.
                int distinct_chars_count = 0; // Counter for the number of distinct characters in the substring.

                // Iterate through the frequency array to check the balance condition.
                for (int char_code = 0; char_code < 26; ++char_code) {
                    // If the character has a non-zero frequency (i.e., it exists in the substring)
                    if (freq[char_code] > 0) {
                        distinct_chars_count++; // Increment the count of distinct characters

                        // If this is the first distinct character we are encountering for this substring s[i...j]
                        if (current_target_freq == -1) {
                            current_target_freq = freq[char_code]; // Set its frequency as the target frequency
                        }
                        // If this is not the first distinct character, check if its frequency matches the target frequency.
                        else if (freq[char_code] != current_target_freq) {
                            is_balanced = false; // If frequencies don't match, the substring is not balanced.
                            break;               // No need to check further for this substring.
                        }
                    }
                }

                // If the substring is balanced AND it actually contains at least one distinct character (to avoid empty cases)
                // The condition `distinct_chars_count > 0` is implicitly handled by `current_target_freq == -1` check above
                // if there are no distinct chars. But explicitly checking for `is_balanced` and `distinct_chars_count > 0`
                // is clearer for defining a balanced substring with content.
                // If `is_balanced` is true, it implies all `freq[char_code] > 0` had the same frequency.
                // If there were no characters (`distinct_chars_count == 0`), `current_target_freq` would remain -1, and `is_balanced` would stay true,
                // but `max_len` wouldn't update for a length of 0.
                // The condition `is_balanced` implicitly handles cases where there are no characters or only one character.
                // If there are characters, and they all have the same frequency, `is_balanced` remains true.
                if (is_balanced && distinct_chars_count > 0) {
                    // The length of the current substring is (j - i + 1).
                    // Update max_len if the current substring is longer.
                    max_len = std::max(max_len, j - i + 1);
                }
            }
        }

        return max_len; // Return the length of the longest balanced substring found.
    }
};

/*
// Example Usage (for local testing, not part of the final submission structure)
int main() {
    Solution sol;
    std::cout << "Input: \"abbac\", Output: " << sol.longestBalancedSubstring("abbac") << std::endl; // Expected: 4
    std::cout << "Input: \"zzabccy\", Output: " << sol.longestBalancedSubstring("zzabccy") << std::endl; // Expected: 4
    std::cout << "Input: \"aba\", Output: " << sol.longestBalancedSubstring("aba") << std::endl; // Expected: 2
    std::cout << "Input: \"a\", Output: " << sol.longestBalancedSubstring("a") << std::endl; // Expected: 1
    std::cout << "Input: \"aa\", Output: " << sol.longestBalancedSubstring("aa") << std::endl; // Expected: 2
    std::cout << "Input: \"ab\", Output: " << sol.longestBalancedSubstring("ab") << std::endl; // Expected: 2
    std::cout << "Input: \"abcabcbb\", Output: " << sol.longestBalancedSubstring("abcabcbb") << std::endl; // Expected: 6 (abcabc)
    std::cout << "Input: \"leetcode\", Output: " << sol.longestBalancedSubstring("leetcode") << std::endl; // Expected: 2 (ee, cd, etc.)
    return 0;
}
*/
```