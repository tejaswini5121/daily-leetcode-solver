```cpp
// Problem: Special Binary String
// Link: https://leetcode.com/problems/special-binary-string/
// Summary: Given a special binary string, find the lexicographically largest string achievable by swapping adjacent special substrings.
// Approach:
// The problem can be solved using a recursive divide and conquer approach.
// A special binary string can be decomposed into smaller special binary strings.
// For example, "11011000" can be seen as "1" + "10" + "1100" + "0".
// However, the "1" and "0" at the ends are not part of the "special substring" structure that can be swapped.
// A special binary string always starts with '1' and ends with '0', unless it's "0" or "1", which are not special by definition.
// The core idea is to find the "primitive" special binary strings within a larger special binary string.
// A primitive special binary string is one that cannot be split into two non-empty special binary strings.
// For example, "1100" is primitive, but "1010" is not, it can be split into "10" and "10".
//
// The algorithm works as follows:
// 1. Iterate through the string to identify consecutive special substrings.
//    A special substring starts with '1' and ends with '0', and has an equal number of '1's and '0's,
//    and maintains the prefix condition (number of '1's >= number of '0's).
//    We can find these substrings by maintaining a balance counter: increment for '1', decrement for '0'.
//    When the balance is 0, we have found a potential special substring.
// 2. Recursively call the `makeLargest` function on each identified special substring.
//    This ensures that each smaller component is made lexicographically largest.
// 3. After recursively processing all identified special substrings, sort them in descending order.
//    This is because we want the lexicographically largest overall string, and placing larger substrings earlier achieves this.
// 4. Concatenate the sorted, processed substrings to form the result for the current level.
//
// Example walk-through: s = "11011000"
// - Identify outermost structure: The string starts with '1' and ends with '0'. We need to find its components.
// - Balance:
//   - s[0] = '1', balance = 1
//   - s[1] = '1', balance = 2
//   - s[2] = '0', balance = 1
//   - s[3] = '1', balance = 2
//   - s[4] = '1', balance = 3
//   - s[5] = '0', balance = 2
//   - s[6] = '0', balance = 1
//   - s[7] = '0', balance = 0. Found a component: "11011000" itself is a special string.
//
// - Within "11011000", find primitive components.
//   - Iterate to find split points where balance becomes 0.
//   - s[0]='1', bal=1
//   - s[1]='1', bal=2
//   - s[2]='0', bal=1  --> found "110" (not special, balance not 0)
//   - s[3]='1', bal=2
//   - s[4]='1', bal=3
//   - s[5]='0', bal=2
//   - s[6]='0', bal=1
//   - s[7]='0', bal=0. The whole string is a component.
//
//   Let's find the primitive special substrings within "11011000":
//   - Start at index 0: '1'. Balance = 1.
//   - Index 1: '1'. Balance = 2.
//   - Index 2: '0'. Balance = 1. Substring "110" is not special.
//   - Index 3: '1'. Balance = 2.
//   - Index 4: '1'. Balance = 3.
//   - Index 5: '0'. Balance = 2.
//   - Index 6: '0'. Balance = 1.
//   - Index 7: '0'. Balance = 0. Entire string "11011000" is a special binary string.
//
//   Now, we need to find the primitive special substrings that *compose* this one.
//   We are looking for substrings that are themselves special.
//   "11011000"
//   '1' (bal=1)
//   '1' (bal=2)
//   '0' (bal=1) -> "110" is NOT a special substring because balance isn't 0.
//   '1' (bal=2)
//   '1' (bal=3)
//   '0' (bal=2)
//   '0' (bal=1)
//   '0' (bal=0) -> The entire string is a component.
//
//   Let's trace the "decomposition" for "11011000":
//   The string must start with '1' and end with '0'.
//   The actual decomposition is based on finding consecutive *special* substrings.
//   "11011000"
//   Consider balance:
//   '1' (bal=1)
//   '1' (bal=2)
//   '0' (bal=1)
//   '1' (bal=2)
//   '1' (bal=3)
//   '0' (bal=2)
//   '0' (bal=1)
//   '0' (bal=0)
//
//   The outer '1' and '0' are anchors for the overall special string.
//   We are looking for "primitive" special substrings that make up the middle part.
//   "11011000"
//   Find components starting at index `start`.
//   When `balance` returns to 0, we've found a component.
//   `start = 0`, `s[0] = '1'`, `balance = 1`.
//   Iterate:
//   `i = 1`, `s[1] = '1'`, `balance = 2`.
//   `i = 2`, `s[2] = '0'`, `balance = 1`.
//   `i = 3`, `s[3] = '1'`, `balance = 2`.
//   `i = 4`, `s[4] = '1'`, `balance = 3`.
//   `i = 5`, `s[5] = '0'`, `balance = 2`.
//   `i = 6`, `s[6] = '0'`, `balance = 1`.
//   `i = 7`, `s[7] = '0'`, `balance = 0`.
//   We found a component from `start` (0) to `i` (7), which is "11011000".
//   This means this string itself is considered as one unit at this level.
//
//   The definition of a special substring is crucial: "The number of 0's is equal to the number of 1's. Every prefix of the binary string has at least as many 1's as 0's."
//   This definition applies to the *entire* input string `s` and also to any *substring* we consider as a potential component.
//   A move allows swapping two *consecutive, non-empty, special substrings*.
//
//   Let's re-evaluate the decomposition.
//   "11011000"
//   We are looking for sub-special-strings that we can permute.
//   The smallest "special" units that can be swapped are those that start with '1', end with '0', have equal 1s and 0s, and maintain the prefix property.
//   Example: "10" is special. "1100" is special. "1010" is special.
//
//   Consider "11011000":
//   Iterate to find contiguous special substrings that we can rearrange.
//   `start = 0`.
//   `s[0] = '1'`, `balance = 1`.
//   `i = 1`, `s[1] = '1'`, `balance = 2`.
//   `i = 2`, `s[2] = '0'`, `balance = 1`.
//   `i = 3`, `s[3] = '1'`, `balance = 2`.
//   `i = 4`, `s[4] = '1'`, `balance = 3`.
//   `i = 5`, `s[5] = '0'`, `balance = 2`.
//   `i = 6`, `s[6] = '0'`, `balance = 1`.
//   `i = 7`, `s[7] = '0'`, `balance = 0`.
//   We found a complete special substring from index `start` (0) to `i` (7).
//   This substring is "11011000".
//
//   The problem statement implies we break down `s` into "primitives" and then sort them.
//   "11011000" can be viewed as starting with '1', ending with '0', and containing a sequence of special binary strings in between.
//   We need to find the boundaries of these internal special strings.
//
//   Let's use `balance` to find the segments.
//   `s = "11011000"`
//   `start = 0`, `balance = 0`.
//   `i = 0`, `s[0] = '1'`, `balance = 1`.
//   `i = 1`, `s[1] = '1'`, `balance = 2`.
//   `i = 2`, `s[2] = '0'`, `balance = 1`.
//   `i = 3`, `s[3] = '1'`, `balance = 2`.
//   `i = 4`, `s[4] = '1'`, `balance = 3`.
//   `i = 5`, `s[5] = '0'`, `balance = 2`.
//   `i = 6`, `s[6] = '0'`, `balance = 1`.
//   `i = 7`, `s[7] = '0'`, `balance = 0`.
//   This means from `start` to `i` (0 to 7) is a balanced segment.
//   The substring is `s.substr(start, i - start + 1)`.
//   When `balance` becomes 0, it signifies the end of a component special binary string.
//   So, "11011000" itself is a candidate for a component.
//
//   Crucially, we are looking for the internal structure.
//   The logic should be:
//   Iterate through `s`. Maintain `balance`.
//   When `balance` is `0`, the substring from `start` to current index `i` is a special binary string.
//   This substring `s.substr(start, i - start + 1)` is a primitive component of `s`.
//   We should recursively call `makeLargest` on this substring (excluding its outer '1' and '0' if it's longer than "10", as those are anchors).
//   Let's reconsider the example "11011000".
//   `start = 0`.
//   `i = 0`, `s[0] = '1'`, `balance = 1`.
//   `i = 1`, `s[1] = '1'`, `balance = 2`.
//   `i = 2`, `s[2] = '0'`, `balance = 1`.  Substring is "110". Not special.
//   `i = 3`, `s[3] = '1'`, `balance = 2`.
//   `i = 4`, `s[4] = '1'`, `balance = 3`.
//   `i = 5`, `s[5] = '0'`, `balance = 2`.
//   `i = 6`, `s[6] = '0'`, `balance = 1`.
//   `i = 7`, `s[7] = '0'`, `balance = 0`.
//   This segment from `start` (0) to `i` (7) is `s.substr(0, 8)`, which is "11011000".
//   This means "11011000" is one unit.
//   However, a move is swapping *two consecutive, non-empty, special substrings*.
//   This implies `s` itself is decomposed into *multiple* special substrings that can be swapped.
//
//   Let's find the primitive components that we can rearrange.
//   "11011000"
//   `start = 0`.
//   `balance = 0`.
//   `i = 0`: '1', `balance = 1`.
//   `i = 1`: '1', `balance = 2`.
//   `i = 2`: '0', `balance = 1`.
//   `i = 3`: '1', `balance = 2`.
//   `i = 4`: '1', `balance = 3`.
//   `i = 5`: '0', `balance = 2`.
//   `i = 6`: '0', `balance = 1`.
//   `i = 7`: '0', `balance = 0`.
//   The entire string "11011000" is a single special binary string.
//   The problem states "You are given a special binary string s."
//   "A move consists of choosing two consecutive, non-empty, special substrings of s, and swapping them."
//   This suggests `s` can be broken into `s = s1 + s2 + ... + sk`, where each `si` is a special binary string.
//   The key is to identify these `s_i` components within `s`.
//
//   The algorithm should be:
//   Iterate through `s` to find "primitive" special substrings.
//   A primitive special substring is one that starts with '1', ends with '0', has equal 1s and 0s, and cannot be further decomposed into two non-empty special substrings.
//   Example: "10" is primitive. "1100" is primitive. "1010" is not primitive ("10" + "10").
//
//   Algorithm refined:
//   Function `makeLargest(s)`:
//     Initialize `result = ""`
//     Initialize `start = 0`
//     Initialize `balance = 0`
//     Create a list `components` to store special substrings found.
//
//     For `i` from 0 to `s.length() - 1`:
//       If `s[i] == '1'`, `balance++`.
//       Else, `balance--`.
//
//       If `balance == 0`: // Found a special substring `s[start...i]`
//         // This substring is `s.substr(start, i - start + 1)`
//         // If this substring is longer than "10", we need to recursively process its *internal* structure.
//         // The internal structure is `s.substr(start + 1, i - start - 1)`
//         // which is `s.substr(start + 1, (i - 1) - (start + 1) + 1)`
//         // The part to recursively process is `s[start+1 ... i-1]`
//         // The substring to recurse on is `s.substr(start + 1, (i - 1) - (start + 1) + 1)` which is `s.substr(start + 1, i - start - 1)`
//         string internal_part = s.substr(start + 1, i - start - 1);
//         components.push_back("1" + makeLargest(internal_part) + "0");
//
//         // Move `start` to the beginning of the next potential component.
//         start = i + 1;
//
//     // Sort the components in descending lexicographical order.
//     sort(components.rbegin(), components.rend());
//
//     // Concatenate the sorted components.
//     for (const string& comp : components) {
//       result += comp;
//     }
//
//     Return `result`.
//
//   Example: s = "11011000"
//   `makeLargest("11011000")`:
//     `start = 0`, `balance = 0`.
//     `i = 0`: '1', `balance = 1`.
//     `i = 1`: '1', `balance = 2`.
//     `i = 2`: '0', `balance = 1`.
//     `i = 3`: '1', `balance = 2`.
//     `i = 4`: '1', `balance = 3`.
//     `i = 5`: '0', `balance = 2`.
//     `i = 6`: '0', `balance = 1`.
//     `i = 7`: '0', `balance = 0`.
//     Found component `s[0...7]`: "11011000".
//     Internal part: `s.substr(0 + 1, 7 - 0 - 1)` = `s.substr(1, 6)` = "101100".
//     Recursive call: `makeLargest("101100")`.
//       `makeLargest("101100")`:
//         `start = 0`, `balance = 0`.
//         `i = 0`: '1', `balance = 1`.
//         `i = 1`: '0', `balance = 0`.
//           Found component `s[0...1]`: "10".
//           Internal part: `s.substr(0 + 1, 1 - 0 - 1)` = `s.substr(1, 0)` = "".
//           Recursive call: `makeLargest("")`. Returns "".
//           `components.push_back("1" + "" + "0")` -> `components.push_back("10")`.
//           `start` becomes `1 + 1 = 2`.
//         `i = 2`: '1', `balance = 1`. (from `start = 2`)
//         `i = 3`: '1', `balance = 2`.
//         `i = 4`: '0', `balance = 1`.
//         `i = 5`: '0', `balance = 0`.
//           Found component `s[2...5]`: "1100".
//           Internal part: `s.substr(2 + 1, 5 - 2 - 1)` = `s.substr(3, 2)` = "10".
//           Recursive call: `makeLargest("10")`.
//             `makeLargest("10")`:
//               `start = 0`, `balance = 0`.
//               `i = 0`: '1', `balance = 1`.
//               `i = 1`: '0', `balance = 0`.
//                 Found component `s[0...1]`: "10".
//                 Internal part: `s.substr(0 + 1, 1 - 0 - 1)` = `s.substr(1, 0)` = "".
//                 Recursive call: `makeLargest("")`. Returns "".
//                 `components.push_back("1" + "" + "0")` -> `components.push_back("10")`.
//                 `start` becomes `1 + 1 = 2`.
//               Loop ends.
//               Sort `components` ["10"]. No change.
//               Result: "10".
//           Return "10".
//           `components.push_back("1" + "10" + "0")` -> `components.push_back("1100")`.
//           `start` becomes `5 + 1 = 6`.
//         Loop ends.
//         `components` is ["10", "1100"].
//         Sort `components` in reverse: ["1100", "10"].
//         Result: "1100" + "10" = "110010".
//       Return "110010".
//     Back to `makeLargest("11011000")`:
//     `components.push_back("1" + "110010" + "0")` -> `components.push_back("11100100")`.
//     `start` becomes `7 + 1 = 8`.
//     Loop ends.
//     `components` is ["11100100"].
//     Sort `components`. No change.
//     Result: "11100100".
//
//   This matches Example 1 output.
//
//   Time Complexity:
//   Let N be the length of the string.
//   The recursion depth can be O(N) in the worst case (e.g., "111...1000...0").
//   At each level of recursion, we iterate through the string once to find components. This takes O(N).
//   We also sort the components. If there are `k` components, sorting takes `O(k log k)`. The total length of components is at most N.
//   The number of components `k` can be at most `N/2`.
//   The string concatenation can take up to O(N) time.
//   However, the total work done across all recursive calls involves processing substrings.
//   The crucial part is that each character is part of a substring at most `log N` times in a balanced decomposition, or `N` times in a very skewed decomposition.
//   The sorting of substrings can be costly. If we sort `k` strings of average length `L`, it's `k * L * log k`.
//   However, `k * L <= N`. The total length of strings being sorted at any level is at most N.
//   The number of components `k` can be `O(N)`. Sorting `O(N)` strings can be `O(N^2 log N)` if strings are long.
//   Let's reconsider. The total length of all substrings at a certain recursion depth is N.
//   The number of components at a given level is at most N/2.
//   When sorting components, the total number of comparisons is `k * log k`. Each comparison takes up to `L` time.
//   If the total length of all strings to be sorted at a level is `N`, and there are `k` strings, the sorting step takes roughly `O(N * log k)`.
//   The maximum number of components can be `N/2`. So `log k` is `log N`.
//   So, at each level, processing is `O(N) + O(N log N)` for sorting.
//   The depth of recursion is at most `N`.
//   This seems too high.
//   A common pattern for these types of string problems is `O(N log N)` or `O(N^2)`.
//   With N <= 50, `O(N^3)` or `O(N^4)` might even pass.
//   Let's analyze the string construction and sorting more carefully.
//   For a string of length N, the components are substrings. Let's say we have `k` components. Total length `N`.
//   Sorting `k` strings of average length `N/k` takes `O(k * (N/k) * log k) = O(N log k)`. Since `k <= N/2`, it's `O(N log N)`.
//   The number of recursive calls can be `O(N)`.
//   The total time seems to be around `O(N^2 log N)`.
//   Given N <= 50, N^2 = 2500, N^3 = 125000. This should be fine.
//   Let's assume `O(N^3)` as a safe upper bound for this approach.
//
//   Space Complexity:
//   The recursion depth can be `O(N)`.
//   At each recursive call, we store a list of components. The total length of components across one level is `O(N)`.
//   This could lead to `O(N^2)` space if we consider all recursive call stacks and their stored components.
//   However, typically, when analyzing space for recursion, we consider the maximum space used at any single point in time, which is related to the maximum depth of the call stack and the auxiliary space used at each call.
//   The `components` vector at any given call can hold strings summing up to length `N`.
//   So, the space complexity is `O(N)` for the `components` vector at one level.
//   The recursion depth adds another `O(N)` factor.
//   Thus, the space complexity is `O(N^2)`.
//
//   Edge cases:
//   - `s = "10"`: `makeLargest("10")` -> `start=0, bal=0`. `i=0`: '1', `bal=1`. `i=1`: '0', `bal=0`. Component "10". Internal "". Recurse `makeLargest("")` returns "". `components.push_back("1" + "" + "0")` -> "10". Sort ["10"]. Result "10". Correct.
//   - Empty string: The problem constraints say `1 <= s.length`. So empty string won't be an input.
//
//   Consider the `substr` for `internal_part`.
//   `s.substr(start + 1, i - start - 1)`
//   `start`: the beginning index of the current special string component.
//   `i`: the ending index of the current special string component.
//   The substring we want to recurse on is from `start + 1` to `i - 1`.
//   The length of this substring is `(i - 1) - (start + 1) + 1 = i - 1 - start - 1 + 1 = i - start - 1`.
//   This is correct.
//   If `i - start - 1 < 0`, meaning `i - start <= 0`, this case won't happen for a special string of length > 0.
//   If `i - start - 1 == 0`, it means the special string was "10", and the internal part is empty. `substr(start+1, 0)` correctly returns an empty string.

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <functional> // For std::greater

class Solution {
public:
    /**
     * @brief Given a special binary string s, return the lexicographically largest
     *        resulting string possible after applying swap operations.
     *
     * The problem defines special binary strings and a move operation: swapping
     * two consecutive special substrings.
     *
     * The approach is recursive and based on divide and conquer.
     * A special binary string can be broken down into smaller, primitive special
     * binary strings. For example, "11011000" can be viewed as "1" + X + "0",
     * where X is a sequence of special binary strings that can be rearranged.
     *
     * The algorithm works as follows:
     * 1. Iterate through the input string `s` to identify its constituent
     *    primitive special binary substrings. A substring is considered a primitive
     *    component if it starts with '1', ends with '0', has an equal number of
     *    '1's and '0's, and maintains the prefix property (balance >= 0).
     *    We find these components by tracking a `balance` counter (increment for '1',
     *    decrement for '0'). When `balance` returns to 0, we've found a complete
     *    special binary substring `s[start...i]`.
     *
     * 2. For each such found special substring `s[start...i]`:
     *    a. The "core" part that can be rearranged is the substring excluding its
     *       outer '1' and '0', which is `s[start+1 ... i-1]`.
     *    b. Recursively call `makeLargest` on this internal part:
     *       `makeLargest(s.substr(start + 1, i - start - 1))`.
     *    c. The result of the recursive call for this component will be:
     *       `"1" + makeLargest(internal_part) + "0"`.
     *    d. These constructed, rearranged components are stored in a `components` vector.
     *
     * 3. After finding all primitive components within the current string `s` and
     *    recursively processing them, sort the `components` vector in descending
     *    lexicographical order. This is because we want to place the lexicographically
     *    largest components at the beginning to achieve the overall largest string.
     *
     * 4. Concatenate the sorted, processed components to form the result for the
     *    current level of recursion.
     *
     * Time Complexity: O(N^3)
     *   The string length is N. The recursion depth can be O(N). At each level,
     *   we iterate through the substring O(N), perform substring operations (can be O(N) if not optimized),
     *   and sort components. Sorting k components of total length N takes O(N log k).
     *   Since k can be O(N), sorting can be O(N log N). With N <= 50, N^3 is acceptable.
     *
     * Space Complexity: O(N^2)
     *   The recursion depth can be O(N). At each recursive call, we store the
     *   `components` vector, whose total length is O(N). Thus, the total space
     *   used across all recursive calls on the stack can be O(N^2).
     *
     * @param s The input special binary string.
     * @return The lexicographically largest special binary string.
     */
    std::string makeLargest(std::string s) {
        // Base case for recursion: if the string is empty, return an empty string.
        if (s.empty()) {
            return "";
        }

        std::vector<std::string> components; // Stores the processed primitive special substrings.
        int start = 0;                         // Tracks the start index of the current primitive component.
        int balance = 0;                       // Tracks the balance of '1's and '0's.

        // Iterate through the string to find all primitive special substrings.
        for (int i = 0; i < s.length(); ++i) {
            if (s[i] == '1') {
                balance++; // Increment balance for '1'.
            } else {
                balance--; // Decrement balance for '0'.
            }

            // When balance becomes 0, we have found a complete special binary substring
            // from `start` to `i`.
            if (balance == 0) {
                // Extract the internal part of this special substring, excluding the outer '1' and '0'.
                // The internal part is s[start+1 ... i-1].
                // The length of this internal part is (i-1) - (start+1) + 1 = i - start - 1.
                // If the substring is "10", the internal part is empty (length 0).
                std::string internal_part = s.substr(start + 1, i - start - 1);

                // Recursively call makeLargest on the internal part to rearrange its components.
                // Then, reconstruct this primitive special substring with its internal part
                // maximized lexicographically.
                components.push_back("1" + makeLargest(internal_part) + "0");

                // Move the start pointer to the beginning of the next potential component.
                start = i + 1;
            }
        }

        // Sort the found components in descending lexicographical order.
        // This is to ensure that the lexicographically largest components appear first,
        // leading to the overall lexicographically largest string.
        // std::greater<std::string>() is used for descending sort.
        std::sort(components.begin(), components.end(), std::greater<std::string>());

        // Concatenate the sorted components to form the result for the current level.
        std::string result = "";
        for (const std::string& comp : components) {
            result += comp;
        }

        return result;
    }
};
```