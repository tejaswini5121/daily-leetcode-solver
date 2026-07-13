/**
 * @fileoverview LeetCode Problem: Sequential Digits
 * @problem_summary Returns a sorted list of all integers in a given range [low, high] that have sequential digits.
 * @problem_link https://leetcode.com/problems/sequential-digits/
 *
 * @approach
 * The problem asks for numbers with sequential digits within a given range.
 * Sequential digits mean each digit is one greater than the previous one (e.g., 123, 4567).
 * The constraints on `low` and `high` (up to 10^9) suggest that we cannot iterate through all numbers in the range and check each one.
 * Instead, we can generate all possible sequential digit numbers and then filter them based on the given range.
 *
 * We can generate sequential digit numbers by considering starting digits from 1 to 9 and lengths from 2 up to 9 (since a 10-digit number starting with 1 would exceed 10^9).
 * For each starting digit and length, we can construct the sequential number.
 * For example:
 * - Starting digit 1, length 3: 1 -> 12 -> 123
 * - Starting digit 2, length 4: 2 -> 23 -> 234 -> 2345
 *
 * We can use a queue (or simply an array acting as a queue) for a Breadth-First Search (BFS) like generation.
 * Initialize the queue with single digits 1 through 9.
 * While the queue is not empty:
 *   - Dequeue a number `currentNum`.
 *   - If `currentNum` is within the range [low, high], add it to our result list.
 *   - Determine the last digit of `currentNum`.
 *   - If the last digit is less than 9, construct the next sequential digit number by appending `lastDigit + 1`.
 *   - Enqueue this new number.
 *
 * Finally, sort the collected numbers in ascending order.
 *
 * Alternative generation approach:
 * We can pre-generate all possible sequential numbers (up to 10^9) and store them.
 * The maximum possible sequential number is 123456789.
 * We can iterate through possible lengths of sequential numbers (from 2 to 9).
 * For each length, iterate through possible starting digits (from 1 to 10 - length).
 * Construct the number and add it to a list if it's within the [low, high] range.
 * Sort the final list.
 * This pre-generation approach is simpler to implement and has similar time complexity.
 *
 * Let's use the pre-generation approach for simplicity.
 * The possible sequential numbers are limited and can be generated systematically.
 *
 * Example:
 * Starting digits: 1, 2, 3, 4, 5, 6, 7, 8, 9
 * Possible lengths of sequential numbers:
 * - Length 2: 12, 23, 34, ..., 89
 * - Length 3: 123, 234, ..., 789
 * - ...
 * - Length 9: 123456789
 *
 * We can iterate through all possible starting digits (1-9).
 * For each starting digit, we can build the sequential number by appending the next digit as long as the next digit is <= 9.
 *
 * For example, starting with `1`:
 *   currentNum = 1
 *   nextDigit = 2. currentNum = 12. Check range.
 *   nextDigit = 3. currentNum = 123. Check range.
 *   ...
 *   nextDigit = 9. currentNum = 123456789. Check range.
 *
 * For example, starting with `2`:
 *   currentNum = 2
 *   nextDigit = 3. currentNum = 23. Check range.
 *   nextDigit = 4. currentNum = 234. Check range.
 *   ...
 *   nextDigit = 9. currentNum = 23456789. Check range.
 *
 * We collect all generated numbers that fall within [low, high] and then sort them.
 *
 * @time_complexity
 * Generating all sequential digit numbers is constant time because the maximum number of such integers is limited.
 * The largest sequential digit number is 123456789.
 * The total number of sequential digit integers is relatively small.
 * For a given length `L`, there are `10 - L` possible starting digits.
 * Summing for L from 2 to 9: (10-2) + (10-3) + ... + (10-9) = 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 = 36.
 * So, there are at most 36 sequential digit numbers to generate.
 *
 * For each generated number, we check if it's within the range [low, high]. This is O(1).
 * Sorting the results: If `R` is the number of sequential digits found within the range, then sorting takes O(R log R). Since `R` is at most 36, this is effectively constant time.
 *
 * Therefore, the overall time complexity is dominated by the generation and sorting of a small, fixed set of numbers, making it O(1) in terms of the input range size.
 *
 * @space_complexity
 * We store the sequential digit numbers that fall within the range. In the worst case, all 36 generated sequential numbers might fall within the range.
 * The space complexity is O(1) because the maximum number of results is bounded by a small constant (36).
 */

/**
 * @param {number} low
 * @param {number} high
 * @return {number[]}
 */
var sequentialDigits = function(low, high) {
    const result = []; // Array to store the sequential digits within the range.
    const digits = "123456789"; // String containing all possible digits to form sequential numbers.

    // Iterate through all possible starting positions in the 'digits' string.
    // 'i' represents the starting digit.
    for (let i = 0; i < digits.length; i++) {
        let currentNum = 0; // Variable to build the current sequential number.

        // Iterate through all possible ending positions in the 'digits' string,
        // starting from the current 'i'.
        // 'j' represents the end of the substring of sequential digits.
        for (let j = i; j < digits.length; j++) {
            // Append the digit at index 'j' to the current number.
            // We convert the character to a number using parseInt() or the unary plus operator (+).
            currentNum = currentNum * 10 + parseInt(digits[j]);

            // Check if the generated currentNum is within the specified range [low, high].
            if (currentNum >= low && currentNum <= high) {
                result.push(currentNum); // If it is, add it to our result list.
            }

            // Optimization: If the current number already exceeds 'high',
            // there's no need to continue building longer sequential numbers
            // starting with this prefix, as they will only be larger.
            // However, this check is implicitly handled by the `currentNum <= high` condition when pushing.
            // A more direct optimization would be:
            // if (currentNum > high) break;
            // but the current loop structure handles it fine by not pushing.
        }
    }

    // The problem requires the output list to be sorted.
    // Since we generate numbers in a somewhat ordered fashion (by starting digit and then length),
    // but not strictly in numerical order (e.g., 123 comes before 23), sorting is necessary.
    result.sort((a, b) => a - b); // Sort the result array in ascending numerical order.

    return result; // Return the sorted list of sequential digits within the range.
};
```