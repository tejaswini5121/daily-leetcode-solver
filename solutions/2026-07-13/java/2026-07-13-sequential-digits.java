/*
 * Problem Summary:
 * Find all integers within a given range [low, high] where each digit is exactly one greater than the previous digit.
 * The returned list of integers should be sorted in ascending order.
 *
 * Link:
 * https://leetcode.com/problems/sequential-digits/
 *
 * Approach Explanation:
 * The problem involves finding numbers with sequential digits (e.g., 123, 2345, 6789).
 * The total number of such integers is very small (at most 36, ranging from 12 to 123456789), as sequential digits are limited by starting digit and length (cannot exceed 9 digits, and next digit must be <= 9).
 * We can generate all possible sequential digit numbers and then filter them based on the given [low, high] range.
 *
 * The generation strategy involves two nested loops:
 * 1. An outer loop iterates through all possible starting digits (from 1 to 9).
 * 2. An inner loop builds sequential numbers by appending digits. Each appended digit must be one greater than the previous digit (e.g., if the current number being built is 1, append 2 to get 12; then append 3 to get 123, and so on).
 *
 * Inside the inner loop, after forming a new sequential number:
 * - We check if it falls within the [low, high] range. If it does, we add it to our result list.
 * - We also include an optimization: if the `currentNum` has already exceeded `high`, there's no need to continue appending more digits for this sequence. Any further number built from this `currentNum` will also be greater than `high`. Thus, we break out of the inner loop and proceed to the next `startDigit`.
 *
 * After generating all potential sequential numbers, the `result` list is explicitly sorted to meet the problem requirement.
 * Although numbers are generated in increasing order for a given starting digit, and starting digits are processed in increasing order, the overall generation order (e.g., 12, 123, then 23, 234) does not guarantee the final list is sorted without an explicit `Collections.sort()` call.
 *
 * Time Complexity:
 * O(1) - The number of sequential digit numbers possible is fixed and very small (at most 36).
 * The generation process involves constant arithmetic operations within two nested loops, each running at most 9 times.
 * Adding elements to an `ArrayList` takes amortized O(1).
 * Sorting a list of at most 36 elements is also effectively constant time (36 log 36 is a tiny, fixed number of operations).
 * Thus, the total time complexity is independent of the `low` and `high` input values' magnitudes, making it constant.
 *
 * Space Complexity:
 * O(1) - The `result` list stores at most 36 integers. This is a constant amount of memory, not dependent on the input range.
 */
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Solution {
    public List<Integer> sequentialDigits(int low, int high) {
        // Initialize an ArrayList to store all sequential digit numbers found within the range.
        List<Integer> result = new ArrayList<>();

        // The outer loop iterates through all possible starting digits for a sequential number.
        // A sequential number must start with a digit from 1 to 9.
        for (int startDigit = 1; startDigit <= 9; startDigit++) {
            // 'currentNum' will hold the sequential number being built.
            // It starts with the 'startDigit'.
            int currentNum = startDigit;

            // The inner loop appends subsequent digits to 'currentNum'.
            // Each 'nextDigit' must be one greater than the previous digit used.
            // So, it starts from 'startDigit + 1'.
            for (int nextDigit = startDigit + 1; nextDigit <= 9; nextDigit++) {
                // Append the 'nextDigit' to 'currentNum'.
                // Example: If currentNum is 12 and nextDigit is 3, new currentNum becomes 123.
                currentNum = currentNum * 10 + nextDigit;

                // Check if the newly formed 'currentNum' falls within the specified range [low, high].
                if (currentNum >= low && currentNum <= high) {
                    result.add(currentNum); // If it's in range, add it to our list.
                }

                // Optimization: If 'currentNum' has already exceeded 'high',
                // there's no need to continue appending more digits for this sequence.
                // Any further number built from this 'currentNum' will also be greater than 'high'.
                // Break out of the inner loop and try the next 'startDigit'.
                if (currentNum > high) {
                    break;
                }
            }
        }

        // The problem requires the output list to be sorted.
        // The generation order does not guarantee a fully sorted list across all starting digits
        // (e.g., 12, 123 are generated before 23, 234, but 23 should appear before 123).
        // Therefore, an explicit sort is necessary.
        Collections.sort(result);

        // Return the sorted list of sequential digit numbers within the range.
        return result;
    }
}