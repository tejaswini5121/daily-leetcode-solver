```javascript
/**
 * @param {number} n The length of the happy strings.
 * @param {number} k The index (1-based) of the desired happy string.
 * @return {string} The k-th lexicographically smallest happy string of length n, or "" if it doesn't exist.
 */
const getHappyString = (n, k) => {
    // Approach:
    // We can use a backtracking approach to generate all happy strings of length n.
    // Since we need the k-th lexicographically smallest string, we can generate them in order
    // and stop once we have found the k-th string.
    // The characters are 'a', 'b', 'c'. A happy string has no adjacent identical characters.
    // We'll maintain a count of strings generated.
    //
    // The total number of happy strings of length n is at most 3 * 2^(n-1).
    // For n=10, this is 3 * 2^9 = 3 * 512 = 1536, which is manageable within k <= 100.
    //
    // We can optimize by realizing that the number of happy strings starting with 'a'
    // is equal to the number of happy strings starting with 'b', and so on.
    // If n > 1, for a given first character, say 'a', the next character can be 'b' or 'c'.
    // So, the number of happy strings of length n starting with 'a' is 2 * (number of happy strings of length n-1 starting with 'b' or 'c').
    // This symmetry helps.
    //
    // Let's refine the approach:
    // 1. We can pre-calculate the total number of happy strings of length n. This is 3 * 2^(n-1) if n > 0.
    //    If k is greater than this total, we can immediately return "".
    // 2. We can then use a recursive function (backtracking) to build the string character by character.
    // 3. In the recursive function, at each step, we try appending 'a', 'b', and 'c'.
    // 4. We only append a character if it's different from the last character appended.
    // 5. We decrement k for each valid happy string we generate.
    // 6. When k becomes 0, we have found our k-th string.
    //
    // A more efficient approach, especially if k can be large relative to the total number of strings:
    // Instead of generating all strings until k is met, we can determine which character
    // should be at each position of the k-th string.
    //
    // For a string of length n, let's consider the first character.
    // There are 3 choices: 'a', 'b', 'c'.
    // For each choice, how many happy strings of length n-1 can follow?
    // If the first char is 'a', the second can be 'b' or 'c'.
    // The number of happy strings of length n-1 that can start with 'b' or 'c' is equal.
    // Let `count_happy(length)` be the total number of happy strings of a given length.
    // `count_happy(1) = 3`
    // `count_happy(2) = 3 * 2 = 6` (ab, ac, ba, bc, ca, cb)
    // `count_happy(3) = 3 * 2 * 2 = 12`
    // `count_happy(n) = 3 * 2^(n-1)` for n >= 1.
    //
    // If we are constructing the k-th string of length n:
    // For the first character:
    // - If `k <= count_happy(n-1)`, the first character is 'a'.
    // - If `count_happy(n-1) < k <= 2 * count_happy(n-1)`, the first character is 'b'. We then adjust `k` by subtracting `count_happy(n-1)`.
    // - If `2 * count_happy(n-1) < k <= 3 * count_happy(n-1)`, the first character is 'c'. We then adjust `k` by subtracting `2 * count_happy(n-1)`.
    //
    // This logic can be applied recursively for each subsequent character.
    // The available characters for the next position depend on the previous character.
    // If the previous character was 'a', the next can be 'b' or 'c'.
    // If the previous character was 'b', the next can be 'a' or 'c'.
    // If the previous character was 'c', the next can be 'a' or 'b'.
    //
    // Let `num_strings_from(length, last_char)` be the number of happy strings of `length` that can be formed *given the previous character was `last_char`*.
    // `num_strings_from(len, prev)`:
    // If `len == 0`, return 1 (base case: an empty suffix forms one valid continuation).
    // Otherwise, iterate through 'a', 'b', 'c'. If `char != prev`, add `num_strings_from(len - 1, char)` to the total.
    //
    // This calculation `num_strings_from(len-1, next_char)` can be simplified.
    // For a length `L`, the number of ways to pick the next character from 3 options such that it's different from the last is 2.
    // So, for a length `len` remaining, and the current character `curr`, the number of possible continuations is `2 * 2 * ... * 2` (`len` times), but it's slightly tricky because the first char has 3 options.
    // The total number of happy strings of length `m` is `3 * 2^(m-1)` for `m >= 1`.
    //
    // Let's use the backtracking generation and stop when k is met. This is simpler to implement and sufficient given the constraints.
    //
    // Time Complexity: In the worst case, we might explore a significant portion of the happy strings tree.
    // The number of happy strings of length n is 3 * 2^(n-1).
    // Since k <= 100, we will at most generate the first 100 happy strings.
    // Each string generation involves recursive calls. The depth of recursion is n.
    // At each level, we try up to 3 characters.
    // The complexity is roughly O(k * n * alphabet_size), where alphabet_size is 3.
    // Given k <= 100 and n <= 10, this is very efficient.
    //
    // Space Complexity: The space complexity is dominated by the recursion depth, which is O(n) for the call stack.
    // The result string also takes O(n) space.

    const chars = ['a', 'b', 'c'];
    let result = "";
    let count = 0; // Counts how many happy strings we've generated so far.

    /**
     * Recursive helper function to generate happy strings.
     * @param {string} currentString - The string built so far.
     */
    const backtrack = (currentString) => {
        // If we have already found the k-th string, stop further exploration.
        if (count >= k) {
            return;
        }

        // If the current string has reached the desired length n.
        if (currentString.length === n) {
            count++; // Increment the count of happy strings found.
            // If this is the k-th string, store it and return.
            if (count === k) {
                result = currentString;
            }
            return;
        }

        // Try appending each character ('a', 'b', 'c') to the current string.
        for (const char of chars) {
            // Check if the character can be appended without violating the happy string condition.
            // The condition is: the current character must not be the same as the last character of the currentString.
            // If currentString is empty, any character can be appended.
            if (currentString.length === 0 || currentString[currentString.length - 1] !== char) {
                // Recursively call backtrack with the new string.
                backtrack(currentString + char);

                // If we found the k-th string during the recursive call, stop exploring this branch.
                if (result !== "") {
                    return;
                }
            }
        }
    };

    // Start the backtracking process with an empty string.
    backtrack("");

    // Return the k-th happy string found, or an empty string if fewer than k strings exist.
    return result;
};
```