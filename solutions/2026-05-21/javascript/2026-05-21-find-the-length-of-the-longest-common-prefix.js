// Problem: Find the Length of the Longest Common Prefix
// Link: https://leetcode.com/problems/find-the-length-of-the-longest-common-prefix/
//
// Approach:
// The problem asks for the length of the longest common prefix among all pairs of numbers,
// where one number comes from arr1 and the other from arr2.
//
// A brute-force approach would be to iterate through all pairs (x, y) where x is from arr1
// and y is from arr2, and for each pair, compute their longest common prefix. This would
// involve converting numbers to strings and comparing them. The time complexity would be
// O(N*M*L), where N is the length of arr1, M is the length of arr2, and L is the maximum
// number of digits in a number. Given the constraints (up to 5*10^4 for array lengths and
// numbers up to 10^8), this would be too slow.
//
// A more efficient approach involves using a Trie (prefix tree). We can insert all numbers
// from one array (say, arr1) into a Trie. Each node in the Trie will represent a digit.
// To insert a number, we traverse the Trie, creating new nodes if necessary, based on its digits.
//
// After building the Trie with numbers from arr1, we iterate through each number in arr2.
// For each number in arr2, we traverse the Trie using its digits. As we traverse, we keep
// track of the current prefix length. If at any point we encounter a node that marks the
// end of a number from arr1 AND is also a valid path for the current digit of arr2's number,
// we consider this as a potential common prefix. The longest such prefix found across all
// pairs will be our answer.
//
// However, a standard Trie of digits might be complex to implement with positive integers
// directly. A simpler approach for this specific problem is to convert numbers to strings.
// We can then use a Trie where each node represents a character (digit).
//
// Let's refine the Trie approach:
// 1. Convert all numbers in `arr1` to strings.
// 2. Build a Trie from these strings. Each node in the Trie will store its children (representing the next digit)
//    and a flag indicating if a number from `arr1` ends at this node.
// 3. Initialize `maxLength = 0`.
// 4. For each number `num2` in `arr2`:
//    a. Convert `num2` to a string `s2`.
//    b. Traverse the Trie with `s2`. Keep track of the current prefix length (`currentLength`) and
//       the current node in the Trie (`currentNode`).
//    c. For each digit `d` in `s2`:
//       i. If `currentNode` has a child for `d`:
//          - Move `currentNode` to that child.
//          - Increment `currentLength`.
//          - If `currentNode` also marks the end of a number from `arr1` (i.e., it's a complete prefix in `arr1`),
//            then `currentLength` is a potential common prefix length. Update `maxLength = Math.max(maxLength, currentLength)`.
//       ii. If `currentNode` does not have a child for `d`, it means there's no common prefix
//           beyond this point for `num2` with any number in `arr1` that shares the current path.
//           Break the inner loop for `s2`.
//
// This Trie approach significantly optimizes the search for common prefixes.
//
// Time Complexity Analysis:
// Building the Trie:
// Let N be the length of arr1. Let L_max be the maximum number of digits in any number in arr1.
// Each insertion into the Trie takes O(L_max) time.
// Total time to build the Trie is O(N * L_max).
//
// Searching for common prefixes:
// Let M be the length of arr2. Let L'_max be the maximum number of digits in any number in arr2.
// For each number in arr2, we traverse the Trie. In the worst case, we traverse up to L'_max digits.
// Total time for searching is O(M * L'_max).
//
// The maximum number of digits for numbers up to 10^8 is 9.
// So, L_max and L'_max are effectively constant (<= 9).
// The overall time complexity is O(N + M), where N and M are the lengths of the input arrays.
//
// Space Complexity Analysis:
// The Trie can store up to N * L_max nodes in the worst case (if all prefixes are unique).
// Each node might store pointers to 10 children and a boolean flag.
// The space complexity is O(N * L_max), where L_max is the maximum number of digits.
// Since L_max is at most 9, this is effectively O(N).
//
// Alternative: A simpler approach without explicit Trie implementation but similar logic.
// We can iterate through `arr1` and `arr2`. For each pair, convert them to strings and find the LCP.
// To optimize finding LCP between `s1` and `s2`, we can iterate digit by digit.
// This is still O(N*M*L).
//
// To make it faster, we can group numbers with the same prefix.
// A hash map can be used to store prefixes.
//
// Optimized Approach using Hash Map (similar to Trie logic):
// 1. Create a map `prefixMap` where keys are string prefixes and values are boolean (or count, not strictly needed here).
// 2. Iterate through `arr1`. For each number `num1`:
//    a. Convert `num1` to a string `s1`.
//    b. For each prefix of `s1` (from length 1 up to `s1.length`):
//       i. Add this prefix to `prefixMap`.
// 3. Initialize `maxLength = 0`.
// 4. Iterate through `arr2`. For each number `num2`:
//    a. Convert `num2` to a string `s2`.
//    b. For each prefix of `s2` (from length 1 up to `s2.length`):
//       i. If this prefix exists as a key in `prefixMap`:
//          - Update `maxLength = Math.max(maxLength, currentPrefixLength)`.
//       ii. If the prefix does not exist in `prefixMap`, we can stop checking longer prefixes for `s2`
//           because they won't be common either. However, to be fully correct, we need to check all prefixes of `s2`
//           against the `prefixMap`.
//
// The problem states "find the length of the longest common prefix between all pairs".
// This means if `a` is in `arr1` and `b` is in `arr2`, and `c` is their common prefix, we want the maximum length of `c`.
//
// Let's try the map approach more carefully.
//
// Approach with Hash Map (optimized for common prefix existence):
// 1. Create a Set `prefixes1` to store all unique prefixes of numbers in `arr1`.
// 2. For each number `num1` in `arr1`:
//    a. Convert `num1` to a string `s1`.
//    b. For `i` from 0 to `s1.length - 1`:
//       i. Extract the prefix `s1.substring(0, i + 1)`.
//       ii. Add this prefix to `prefixes1`.
// 3. Initialize `maxLength = 0`.
// 4. For each number `num2` in `arr2`:
//    a. Convert `num2` to a string `s2`.
//    b. For `i` from 0 to `s2.length - 1`:
//       i. Extract the prefix `s2.substring(0, i + 1)`.
//       ii. If `prefixes1.has(currentPrefix)`:
//           - Update `maxLength = Math.max(maxLength, currentPrefix.length)`.
//
// Time Complexity:
// Step 2: For each of N numbers, generating prefixes takes O(L_max^2) in string slicing (though substring is O(length)).
// If `s1.length` is `k`, number of prefixes is `k`. Generating each prefix string takes up to `k` time.
// Total for step 2: O(N * L_max^2) if string slicing is O(length), or O(N * L_max) if slicing is efficient and set insertion is O(prefix length).
// Assuming string operations and set insertions are efficient, it's roughly O(N * L_max).
//
// Step 4: For each of M numbers, generating prefixes and checking in set.
// Total for step 4: O(M * L'_max).
//
// Overall Time Complexity: O((N + M) * L_max), where L_max is max digits (approx 9). This is O(N+M).
//
// Space Complexity:
// The set `prefixes1` can store up to N * L_max prefixes. Each prefix can have a length up to L_max.
// Worst case space: O(N * L_max^2). For L_max=9, this is roughly O(N).
//
// This Map/Set approach seems simpler to implement than a full Trie and offers similar performance.
// Let's proceed with the Set approach.

/**
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @return {number}
 */
var longestCommonPrefixLength = function(arr1, arr2) {
    // Set to store all unique prefixes of numbers in arr1.
    // Using a Set for efficient O(1) average time complexity for add and has operations.
    const prefixes1 = new Set();

    // Iterate through each number in arr1.
    for (const num1 of arr1) {
        // Convert the number to a string to easily extract prefixes.
        const s1 = String(num1);
        // Iterate through all possible prefix lengths for the current number.
        for (let i = 1; i <= s1.length; i++) {
            // Extract the prefix string.
            const prefix = s1.substring(0, i);
            // Add the prefix to the set.
            prefixes1.add(prefix);
        }
    }

    // Initialize the maximum length of a common prefix found so far.
    let maxLength = 0;

    // Iterate through each number in arr2.
    for (const num2 of arr2) {
        // Convert the number to a string.
        const s2 = String(num2);
        // Iterate through all possible prefix lengths for the current number in arr2.
        for (let i = 1; i <= s2.length; i++) {
            // Extract the prefix string from num2.
            const prefix = s2.substring(0, i);
            // Check if this prefix exists in the set of prefixes from arr1.
            if (prefixes1.has(prefix)) {
                // If it exists, it means this is a common prefix for at least one pair (num1, num2).
                // Update maxLength to be the maximum of its current value and the length of this common prefix.
                maxLength = Math.max(maxLength, prefix.length);
            } else {
                // Optimization: If the current prefix of s2 is not found in prefixes1,
                // then any longer prefix starting with this one will also not be found.
                // So, we can break from this inner loop and move to the next number in arr2.
                // This optimization is crucial for performance.
                break;
            }
        }
    }

    // Return the overall longest common prefix length found.
    return maxLength;
};
```