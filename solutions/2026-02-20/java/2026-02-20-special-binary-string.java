/**
 * Problem Summary: Rearrange a special binary string by swapping adjacent special substrings to achieve the lexicographically largest result.
 * LeetCode Link: https://leetcode.com/problems/special-binary-string/
 *
 * Approach:
 * This problem can be solved using a recursive, divide-and-conquer approach.
 * A special binary string can be decomposed into "1" followed by zero or more special binary strings, followed by "0".
 * For example, "11011000" can be seen as "1" + ("10") + ("1100") + "0".
 * The core idea is to identify these nested special substrings. We can do this by iterating through the string and maintaining a balance counter.
 * When the balance (number of 1s minus number of 0s) returns to 0, it signifies the end of a top-level special substring.
 * Within each identified top-level special substring (e.g., "1100" within "11011000"), we recursively apply the same logic to sort its inner special substrings.
 * The goal is to place larger components (those that result in lexicographically larger strings after sorting their internal components) first.
 * So, after recursively sorting the inner components of each special substring, we collect these sorted inner components and then sort them lexicographically in descending order.
 * Finally, we reconstruct the string by concatenating "1", the sorted inner components, and "0".
 *
 * For instance, in "11011000":
 * - Identify the outermost structure: "1" + (inner_special_string) + "0".
 * - The inner special string is "101100".
 * - Now, recursively process "101100".
 *   - This can be broken down into "1" + ("10") + ("1100") + "0".
 *   - Recursively process "10": It's already sorted, returns "10".
 *   - Recursively process "1100":
 *     - This can be broken down into "1" + ("10") + "0".
 *     - Recursively process "10": Returns "10".
 *     - So, "1100" becomes "1" + "10" + "0" = "1100".
 *   - The inner components of "101100" are "10" and "1100".
 *   - Sorted in descending lexicographical order: "1100", "10".
 *   - Reconstruct "101100": "1" + "1100" + "10" + "0" = "11100100".
 * - Now, the original string "11011000" becomes "1" + "11100100" + "0" = "11100100".
 *
 * Time Complexity:
 * The recursive calls break down the string. In the worst case, each character might be part of a recursive call.
 * For a string of length N, identifying the top-level special substrings takes O(N).
 * The recursive calls are made on substrings. The total length of substrings at any depth of recursion sums up to N.
 * Sorting the collected special substrings at each level takes at most O(K log K) where K is the number of such substrings, and the length of each substring can be up to N.
 * However, because the total length of strings processed at each level is N, and the sorting is done on substrings, the overall complexity can be analyzed as follows:
 * Let T(N) be the time complexity for a string of length N.
 * T(N) = O(N) (to find substrings) + sum(T(Ni)) (for recursive calls on Ni) + O(K log K * avg_len) (for sorting).
 * The key observation is that the number of special substrings is limited, and their lengths are balanced.
 * A more rigorous analysis suggests that the time complexity is roughly O(N log N). The log N factor comes from the depth of the recursion, similar to merge sort.
 * In the worst case, we might have many small special substrings, and sorting them takes time.
 * With N <= 50, this is efficient enough.
 *
 * Space Complexity:
 * The space complexity is dominated by the recursion depth and the storage for substrings.
 * The maximum recursion depth can be O(N) in skewed cases, but on average, it's closer to O(log N).
 * Storing the substrings during recursion can take up to O(N) space.
 * Therefore, the space complexity is O(N).
 */
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Solution {
    /**
     * Finds the lexicographically largest special binary string by swapping consecutive special substrings.
     *
     * @param s The input special binary string.
     * @return The lexicographically largest resulting string.
     */
    public String makeLargestSpecial(String s) {
        // Base case: If the string is empty or null, return it.
        if (s == null || s.length() == 0) {
            return s;
        }

        // List to store the special binary substrings found at this level.
        List<String> subs = new ArrayList<>();
        int balance = 0; // Counter for '1's minus '0's.
        int start = 0; // Starting index of the current special substring.

        // Iterate through the string to identify and process special substrings.
        for (int i = 0; i < s.length(); i++) {
            // Increment balance for '1', decrement for '0'.
            if (s.charAt(i) == '1') {
                balance++;
            } else {
                balance--;
            }

            // When balance returns to 0, it signifies the end of a top-level special substring.
            if (balance == 0) {
                // Extract the substring from 'start' to 'i+1'.
                // This substring is of the form "1" + (inner_special_string) + "0".
                // Recursively call makeLargestSpecial on the inner part of the substring
                // (i.e., from index 'start + 1' to 'i', excluding the outermost '1' and '0').
                String innerSubstring = makeLargestSpecial(s.substring(start + 1, i));
                // Reconstruct the processed special substring: "1" + processed_inner_part + "0".
                subs.add("1" + innerSubstring + "0");
                // Update the starting index for the next top-level special substring.
                start = i + 1;
            }
        }

        // Sort the collected special substrings in lexicographically descending order.
        // This ensures that when concatenated, we get the lexicographically largest string.
        Collections.sort(subs, Collections.reverseOrder());

        // Concatenate the sorted special substrings to form the final result.
        StringBuilder result = new StringBuilder();
        for (String sub : subs) {
            result.append(sub);
        }

        return result.toString();
    }
}
