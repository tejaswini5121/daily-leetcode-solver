// Processes a string with special operations: append letters, remove last char with '*', duplicate with '#', reverse with '%'.
// Problem Link: https://leetcode.com/problems/process-string-with-special-operations-i/
// Approach: Simulate the process by iterating through the input string and applying operations to a result string.
// We can use a std::string or a std::vector<char> to build the result string. std::string is generally more convenient for string manipulations.
// Time Complexity: O(N*M), where N is the length of the input string 's' and M is the length of the result string.
// In the worst case, '#' operation can double the length of the result string. However, '*' and '%' operations take O(M) time.
// The constraints state s.length <= 20, so N is small. The maximum length of the result string could grow exponentially with '#' operations, but given N <= 20, the practical length will be manageable.
// A tighter analysis: Each character from 's' is processed once. For letters, append is O(1) amortized. For '*', removal is O(1) if we think of it as popping from a stack (or end of string). For '%', reversing is O(M). For '#', duplicating is O(M).
// If we consider the total work done: Each character from 's' can be appended multiple times due to '#'. However, '*' limits the growth.
// In the worst case, a sequence like 'a#a#a#' could lead to repeated appends and copies.
// Let's consider an operation as a unit. A letter takes O(1) to append. '*' takes O(1) to remove (if using string::pop_back). '%' takes O(M) to reverse. '#' takes O(M) to duplicate.
// The total length of the string can grow. If 's' has length N, and we have K '#' operations, the length could be up to 2^K. But the number of '*' operations also influences this.
// Given N <= 20, the maximum number of '#' operations is at most 20. If all were '#', the length could become very large, but this is unlikely to be the intended scenario for a "Medium" problem.
// A more precise analysis of operations:
// Appending a character: O(1) amortized.
// '*' (pop_back): O(1).
// '%' (reverse): O(length of result).
// '#' (duplicate): O(length of result).
// The critical part is that '#' and '%' are O(M), where M is the current length of the result. The length M can grow.
// However, the input string length is very small (<= 20). This implies that even if the result string grows, its length will not be excessively large during the processing of these 20 characters.
// For example, "a#a#a#a#a#a#a#a#a#a" will have a result of length 20.
// "a##" -> "aa" -> "aaaa" (length 4).
// "a###" -> "aa" -> "aaaa" -> "aaaaaaaa" (length 8).
// The length of the result string is bounded by 2^N in a pathological case of only '#', but '*' operations significantly limit this.
// For N=20, the maximum length of the result string will not exceed values that make O(M) operations prohibitive. It's more like O(N * 2^N) in a very loose upper bound without considering '*' effectiveness.
// Given the constraint N <= 20, the complexity can be considered acceptable.
// A more practical analysis: the total number of character appends across all '#' operations, plus original appends, might be more relevant.
// Each character from 's' leads to at most one append operation (if it's a letter). Each '#' effectively "doubles" the number of appends that *would have happened* up to that point. '*' reduces the count.
// The total number of characters in the final string is at most 2^20 if all were '#', but practically limited by '*' and the small N.
// Space Complexity: O(M), where M is the maximum length of the result string.
// In the worst-case scenario, the result string could grow significantly due to '#', but given N <= 20, this growth is bounded and manageable.
// The space is dominated by storing the `result` string.
#include <string>
#include <algorithm> // Required for std::reverse
#include <vector>    // Can be used as an alternative to string, but string is more direct here.

class Solution {
public:
    std::string processString(std::string s) {
        std::string result = ""; // Initialize an empty string to build the result.

        // Iterate through each character of the input string 's'.
        for (char c : s) {
            if (std::islower(c)) {
                // If the character is a lowercase letter, append it to the result.
                result += c;
            } else if (c == '*') {
                // If the character is '*', remove the last character from 'result' if 'result' is not empty.
                if (!result.empty()) {
                    result.pop_back(); // Efficiently removes the last character.
                }
            } else if (c == '#') {
                // If the character is '#', duplicate the current 'result' and append it to itself.
                // This effectively doubles the current content of 'result'.
                result += result;
            } else if (c == '%') {
                // If the character is '%', reverse the current 'result'.
                // std::reverse works in-place on the string.
                std::reverse(result.begin(), result.end());
            }
        }

        // Return the final processed string.
        return result;
    }
};
