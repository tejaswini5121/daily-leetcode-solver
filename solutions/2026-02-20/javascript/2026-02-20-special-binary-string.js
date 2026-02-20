/**
 * @summary LeetCode 761: Special Binary String. This problem involves rearranging a special binary string by swapping adjacent special substrings to achieve the lexicographically largest result. Special binary strings have an equal number of 0s and 1s, and every prefix has at least as many 1s as 0s.
 * @link https://leetcode.com/problems/special-binary-string/
 * @approach The core idea is to recursively break down the special binary string into its smallest special components. A special binary string can be uniquely represented as "1" + S1 + "0" + S2, where S1 and S2 are themselves special binary strings (potentially empty). The recursive structure allows us to sort these inner special strings lexicographically. We can find these components by scanning the string, maintaining a balance counter (increment for '1', decrement for '0'). When the balance returns to zero, we've found a complete special substring. We recursively process the inner parts and then sort them in descending lexicographical order. The final result is constructed by concatenating "1", the sorted inner strings, "0", and then recursively processing the remaining part of the string.
 * @time_complexity The time complexity is roughly O(N * log N) in the best case due to sorting, but can approach O(N^2) in the worst case due to string concatenations and recursive calls on substrings. Given the small constraint (N <= 50), this is acceptable.
 * @space_complexity The space complexity is O(N) due to the recursion depth and the creation of new strings during processing.
 */
var makeLargestSpecial = function(s) {
    // Base case: if the string is empty or invalid, return it.
    if (!s || s.length === 0) {
        return "";
    }

    // We will store the special components found within the current string.
    const components = [];
    let balance = 0; // Tracks the balance of '1's and '0's.
    let start = 0;   // Marks the beginning of a potential special substring.

    // Iterate through the string to identify and extract special components.
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '1') {
            balance++; // Increment balance for '1'
        } else {
            balance--; // Decrement balance for '0'
        }

        // When balance returns to 0, we have found a complete special substring.
        if (balance === 0) {
            // The special substring is of the form "1" + inner_special_string + "0".
            // The inner_special_string is the substring from start + 1 to i - 1.
            // Recursively call makeLargestSpecial on the inner part to ensure it's also lexicographically largest.
            components.push("1" + makeLargestSpecial(s.substring(start + 1, i)) + "0");
            // Update the start for the next component.
            start = i + 1;
        }
    }

    // Sort the extracted special components in descending lexicographical order.
    // This is crucial for achieving the overall lexicographically largest string.
    components.sort((a, b) => b.localeCompare(a));

    // Concatenate the sorted components to form the result.
    return components.join("");
};
```