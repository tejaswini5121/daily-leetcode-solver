/*
 * Problem Summary:
 * Generates all integers where each digit is one more than the previous digit,
 * and returns those within a given range [low, high], sorted.
 *
 * Link: https://leetcode.com/problems/sequential-digits/
 *
 * Approach Explanation:
 * The approach enumerates all possible sequential digit numbers by iterating through
 * possible starting digits (1 to 9). For each starting digit, numbers are constructed
 * by successively appending the next digit (e.g., starting with 1, generate 12, then 123, etc.).
 * During construction, if a number falls within the [low, high] range, it's added to a result list.
 * An important optimization is applied: if the `currentNum` being built exceeds `high`,
 * the inner loop breaks, as any further numbers formed by appending more digits will also
 * be greater than `high`.
 * The numbers are generated in a naturally sorted order (first by starting digit, then by length),
 * eliminating the need for an explicit sorting step for the final list.
 *
 * Time Complexity:
 * O(1) - The number of possible sequential digit numbers is very small and constant.
 * There are at most 36 such numbers (e.g., 12, 123, ..., 123456789, 23, 234, ..., 89).
 * The generation process involves a fixed number of outer loop iterations (for starting digits)
 * and inner loop iterations (for appending digits). Each operation within the loops is constant time.
 * Thus, the total time complexity is independent of the input `low` and `high` values
 * beyond their magnitude fitting within standard integer types.
 *
 * Space Complexity:
 * O(1) - The maximum number of sequential digit numbers that can be stored in the result vector
 * is constant (at most 36 integers). The space usage does not scale with `low` or `high`.
 */
#include <vector>     // Required for std::vector
#include <algorithm>  // Not strictly needed for this specific solution as numbers are naturally sorted, but common utility header

class Solution {
public:
    std::vector<int> sequentialDigits(int low, int high) {
        std::vector<int> result; // This vector will store all sequential digit numbers within the range.
        
        // Iterate through all possible starting digits for a sequential number.
        // A sequential number must start with a digit from 1 to 9.
        for (int startDigit = 1; startDigit <= 9; ++startDigit) {
            int currentNum = startDigit;     // Initialize the number with the current starting digit.
            int nextDigit = startDigit + 1;  // Determine the next digit to append.

            // Continue building the sequential number as long as the next digit is valid (1-9).
            while (nextDigit <= 9) {
                // Append the next digit to the current number.
                // Example: If currentNum is 1 and nextDigit is 2, it becomes 12.
                // If currentNum is 12 and nextDigit is 3, it becomes 123.
                currentNum = currentNum * 10 + nextDigit;
                
                // Optimization: If the `currentNum` has already exceeded the `high` bound,
                // any subsequent sequential numbers formed by adding more digits will also
                // definitely be greater than `high`. So, we can stop building numbers
                // for this `startDigit` and move to the next one.
                if (currentNum > high) {
                    break; 
                }
                
                // If the `currentNum` is within the specified range [low, high],
                // add it to our result list.
                if (currentNum >= low) {
                    result.push_back(currentNum);
                }
                
                // Move to the next digit to append in the sequence.
                nextDigit++;
            }
        }
        
        // The numbers are naturally generated in sorted order (e.g., 12, 123, 1234, ..., then 23, 234, ...).
        // Therefore, an explicit std::sort call is not necessary.
        // std::sort(result.begin(), result.end()); // This line is not needed.
        
        return result; // Return the sorted list of sequential digit numbers.
    }
};